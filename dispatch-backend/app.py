import os
from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
import requests
from requests.auth import HTTPBasicAuth

load_dotenv()

SPACE = os.environ["SIGNALWIRE_SPACE"]
PROJECT_ID = os.environ["SIGNALWIRE_PROJECT_ID"]
API_TOKEN = os.environ["SIGNALWIRE_API_TOKEN"]
FROM_NUMBER = os.environ["SIGNALWIRE_FROM_NUMBER"]
ALLOWED_ADDRESS = os.environ["SIGNALWIRE_ALLOWED_ADDRESS"]

BASE_URL = f"https://{SPACE}.signalwire.com"
AUTH = HTTPBasicAuth(PROJECT_ID, API_TOKEN)

app = Flask(__name__)
CORS(app)  # dev only — lock this down to your frontend's origin before going live


@app.route("/api/token", methods=["POST"])
def get_token():
    """
    Called by the frontend when it loads. Returns a short-lived guest token
    the browser SDK uses to place/receive calls without exposing your real
    API credentials to the browser.
    """
    resp = requests.post(
        f"{BASE_URL}/api/fabric/guests/tokens",
        auth=AUTH,
        json={"allowed_addresses": [ALLOWED_ADDRESS]},
    )
    if resp.status_code != 200:
        return jsonify({"error": "token request failed", "detail": resp.text}), 502
    return jsonify(resp.json())


@app.route("/api/voice/handler", methods=["POST"])
def voice_handler():
    """
    This is the SWML webhook you paste into the dashboard under:
    Phone Numbers > (your number) > "Accepts Calls As" > a Voice URL pointing
    here — and also as the handler on the Resource your token dials through.

    SignalWire calls this URL when a call needs instructions. Right now it
    just connects the caller to whatever number was dialed. This is the
    hook point where you'll later branch in the AI call-assist pipeline
    (e.g. fork the audio to a WebSocket for live STT).
    """
    payload = request.get_json(silent=True) or {}
    to_number = payload.get("to") or request.args.get("to")

    swml = {
        "version": "1.0.0",
        "sections": {
            "main": [
                {
                    "connect": {
                        "from": FROM_NUMBER,
                        "to": to_number,
                    }
                }
            ]
        },
    }
    return jsonify(swml)


@app.route("/api/health", methods=["GET"])
def health():
    return jsonify({"ok": True})


if __name__ == "__main__":
    app.run(port=5000, debug=True)