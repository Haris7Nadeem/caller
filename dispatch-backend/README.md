# Dispatch backend — Flask + SignalWire

## Setup

```
pip install -r requirements.txt --break-system-packages
cp .env.example .env
```

Fill in `.env` from your SignalWire dashboard: **API > API Credentials**
(Space, Project ID, API Token). `SIGNALWIRE_FROM_NUMBER` is the number you
already purchased.

Run it:

```
python app.py
```

Runs on `http://localhost:5000`.

## What each endpoint does

- **`POST /api/token`** — frontend calls this on load. Returns a short-lived
  guest token so the browser can place calls without ever seeing your real
  API credentials.
- **`POST /api/voice/handler`** — SignalWire calls *this* (not the other way
  around) when it needs instructions for a call. Right now it just connects
  the call through. This is where the AI call-assist pipeline plugs in later
  — fork the call audio to a WebSocket here, run it through STT, then AI.
- **`GET /api/health`** — sanity check.

## One manual step this code can't do for you

SignalWire needs to know *where* to send call instructions — this is
dashboard config, not code:

1. In the SignalWire dashboard, open your phone number's settings.
2. Under **Accepts Calls As**, point the Voice handler at your
   `/api/voice/handler` URL (you'll need this server reachable from the
   internet — `ngrok` is the easiest way to test that locally: `ngrok http
   5000`, then use the `https://...ngrok.io/api/voice/handler` URL it gives
   you).
3. Find your number's **Resource address** (looks like `/public/your-number`)
   and put it in `SIGNALWIRE_ALLOWED_ADDRESS` in `.env` — this is what the
   guest token is scoped to.

## Not done yet

- CORS is wide open (`CORS(app)`) — restrict it to your frontend's actual
  origin before this touches real traffic.
- No STT or AI wired in — `/api/voice/handler` is the hook point for that.
- No auth on `/api/token` itself — right now anyone who finds this URL can
  get a calling token. Add a login check before this goes live with real
  sellers.
