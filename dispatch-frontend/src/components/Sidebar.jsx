import CallCard from './CallCard.jsx'

export default function Sidebar({ contacts, selectedId, onSelect }) {
  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <div className="mark" />
        <div>
          <div className="name">Convoy Dialer</div>
          <div className="sub">DeveloperHub Dispatch</div>
        </div>
      </div>

      <nav className="sidebar-nav">
        <button className="nav-btn active">Calls</button>
        <button className="nav-btn">Loads</button>
        <button className="nav-btn">Carriers</button>
      </nav>

      <div className="sidebar-list">
        <div className="sidebar-list-label">Recent</div>
        {contacts.map((c) => (
          <CallCard
            key={c.id}
            {...c}
            selected={c.id === selectedId}
            onClick={() => onSelect(c.id)}
          />
        ))}
      </div>

      <div className="sidebar-footer">
        <span><span className="status-dot" />Line ready</span>
        <span>+1 (209) 448-7790</span>
      </div>
    </aside>
  )
}
