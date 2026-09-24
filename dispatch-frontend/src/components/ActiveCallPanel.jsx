import { useEffect, useRef, useState } from 'react'

// Demo-only scripted exchange — stands in for the real STT + AI pipeline,
// which isn't wired up yet. Starts once the real call actually connects.
const SCRIPT = [
  { who: 'carrier', text: "Yeah this is Mike, callin' about the Dallas to Memphis load." },
  { who: 'seller', text: 'Yes sir, that load is still open. Pickup is tomorrow 8 AM.' },
  { who: 'carrier', text: "What's the rate on that one, and is it a dry van?" },
  {
    who: 'seller',
    text: '$2,450 all-in, 53-foot dry van, 42,000 lbs, no touch freight.',
    suggested: '$2,450 all-in, dry van 53ft, 42,000 lbs, drop-and-hook — no touch freight.',
  },
]

export default function ActiveCallPanel({ contact, status, error, onEnd }) {
  const [lines, setLines] = useState([])
  const [suggestion, setSuggestion] = useState(null)
  const [seconds, setSeconds] = useState(0)
  const scrollRef = useRef(null)

  useEffect(() => {
    if (status !== 'active') return
    const timer = setInterval(() => setSeconds((s) => s + 1), 1000)
    return () => clearInterval(timer)
  }, [status])

  useEffect(() => {
    if (status !== 'active') return
    let i = 0
    const step = () => {
      if (i >= SCRIPT.length) return
      const entry = SCRIPT[i]
      setLines((prev) => [...prev, entry])
      if (entry.suggested) setSuggestion(entry.suggested)
      i += 1
      setTimeout(step, 2200)
    }
    const start = setTimeout(step, 900)
    return () => clearTimeout(start)
  }, [status])

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' })
  }, [lines])

  const mm = String(Math.floor(seconds / 60)).padStart(2, '0')
  const ss = String(seconds % 60).padStart(2, '0')

  return (
    <div className="active-call-panel">
      <div className="acp-header">
        <div className="acp-who">
          <div className="acp-avatar">{contact.name.slice(0, 2).toUpperCase()}</div>
          <div>
            <h2>{contact.name}</h2>
            <div className="num">{contact.number}</div>
          </div>
        </div>
        <div className="acp-timer">
          {status === 'connecting' && 'Connecting…'}
          {status === 'active' && `${mm}:${ss}`}
          {status === 'error' && 'Call failed'}
        </div>
        <button className="acp-end-btn" onClick={onEnd}>
          {status === 'error' ? 'Close' : 'End call'}
        </button>
      </div>

      {status === 'error' && (
        <div style={{ padding: '20px 28px', color: '#e5644c', fontSize: 13 }}>
          Couldn't connect the call: {error || 'unknown error'}. Check that the
          backend is running and the token's allowed address can dial this
          number.
        </div>
      )}

      {status !== 'error' && (
        <div className="acp-body">
          <div className="acp-transcript" ref={scrollRef}>
            {lines.length === 0 && (
              <div className="acp-line carrier">
                <div className="who">
                  {status === 'connecting' ? 'Connecting' : 'Listening'}
                </div>
                {status === 'connecting'
                  ? 'Reaching out to the carrier…'
                  : "Waiting for the carrier to start talking…"}
              </div>
            )}
            {lines.map((l, idx) => (
              <div key={idx} className={`acp-line ${l.who}`}>
                <div className="who">{l.who === 'carrier' ? 'Carrier' : 'You'}</div>
                {l.text}
              </div>
            ))}
          </div>

          <div className="acp-suggest">
            <div className="acp-suggest-label">AI suggested reply</div>
            <div className={`acp-suggest-card${suggestion ? '' : ' pending'}`}>
              {suggestion || "Listening for the carrier's question…"}
            </div>
            <div className="acp-suggest-actions">
              <button>Edit</button>
              <button className="primary">Use reply</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
