export default function CallCard({ name, number, time, status, color, selected, onClick }) {
  const initials = name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

  return (
    <button className={`call-card${selected ? ' selected' : ''}`} onClick={onClick}>
      <div className="call-avatar" style={{ background: color }}>
        {initials}
      </div>
      <div className="call-card-body">
        <div className="call-card-name">{name}</div>
        <div className="call-card-meta">{number} · {time}</div>
      </div>
      <span className={`call-card-tag ${status === 'open' ? 'tag-open' : 'tag-quiet'}`}>
        {status === 'open' ? 'LOAD OPEN' : 'QUIET'}
      </span>
    </button>
  )
}
