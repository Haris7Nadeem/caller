import { useState } from 'react'

const KEYS = [
  ['1', ''], ['2', 'ABC'], ['3', 'DEF'],
  ['4', 'GHI'], ['5', 'JKL'], ['6', 'MNO'],
  ['7', 'PQRS'], ['8', 'TUV'], ['9', 'WXYZ'],
  ['*', ''], ['0', '+'], ['#', ''],
]

export default function Dialer({ onCall }) {
  const [value, setValue] = useState('')

  return (
    <div className="dialer">
      <div className="dialer-display">
        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="number"
        />
        {/* <div className="as">Calling as +1 (209) 448-7790</div> */}
      </div>

      <div className="dialer-grid">
        {KEYS.map(([digit, letters]) => (
          <button
            key={digit}
            className="dialer-key"
            onClick={() => setValue((v) => v + digit)}
          >
            {digit}
            <span className="letters">{letters}</span>
          </button>
        ))}
      </div>

      <button
        className="dialer-call-btn"
        disabled={!value}
        onClick={() => value && onCall(value)}
      >
        Call
      </button>
    </div>
  )
}
