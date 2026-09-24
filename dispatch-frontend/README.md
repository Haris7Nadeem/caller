# Convoy Dialer — frontend scaffold

React + Vite frontend for the dispatch dialer. UI only for now — mock data,
no Twilio/SignalWire connection yet.

## Run it

```
npm install
npm run dev
```

Opens at http://localhost:5173

## What's here

```
src/
  components/
    Sidebar.jsx        - left nav + recent calls list
    CallCard.jsx        - single row in that list
    Dialer.jsx          - keypad + manual number entry (default view)
    ActiveCallPanel.jsx - live transcript + AI suggested reply (shows when a call is active)
  App.jsx                - wires it together, holds mock contact data
  index.css               - all styling (design tokens at the top)
```

Click any contact in the sidebar, or dial a number and hit Call — either one
opens `ActiveCallPanel`. Its transcript is a **scripted demo** (see the
`SCRIPT` array at the top of `ActiveCallPanel.jsx`) so the UI can be reviewed
without a real call. Swap that for the real pipeline next:

1. WebSocket connection to your backend when a call starts
2. Backend streams carrier audio → STT → pushes transcript lines over the socket
3. Backend sends transcript to the AI → pushes the suggested reply over the socket
4. Replace the `SCRIPT` simulation in `ActiveCallPanel.jsx` with state driven by
   those socket messages

## Design tokens

Dark theme, amber accent (dispatch/signal color), JetBrains Mono for phone
numbers and timers, Manrope for everything else. All tokens are CSS
variables at the top of `src/index.css` — change the palette there.
