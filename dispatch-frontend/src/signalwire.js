import { SignalWire } from '@signalwire/js'

// Point this at your Flask backend.
const BACKEND_URL = 'http://127.0.0.1:5000'

let clientPromise = null

async function fetchToken() {
  const res = await fetch(`${BACKEND_URL}/api/token`, { method: 'POST' })
  if (!res.ok) {
    throw new Error(`Backend token request failed (${res.status})`)
  }
  const data = await res.json()
  return data.token
}

// Reuse one client for the session instead of re-authing on every call.
export function getClient() {
  if (!clientPromise) {
    clientPromise = fetchToken().then((token) =>
      SignalWire({ token, rootElement: document.getElementById('sw-audio-root') })
    )
  }
  return clientPromise
}

// Places an outbound call to a phone number (E.164, e.g. +15551234567) or a
// Fabric address (e.g. /public/something). Returns the live call object —
// keep it around so you can call hangup() on it later.
export async function placeCall(destination, { onStateChange } = {}) {
  const client = await getClient()

  const call = await client.dial({
    to: destination,
    audio: true,
    video: false,
    rootElement: document.getElementById('sw-audio-root'),
  })

  if (onStateChange) {
    call.on?.('call.state', (state) => onStateChange(state))
  }

  await call.start()
  return call
}

export async function endCall(call) {
  if (call) {
    await call.hangup()
  }
}
