import { useState } from 'react'
import Sidebar from './components/Sidebar.jsx'
import Dialer from './components/Dialer.jsx'
import ActiveCallPanel from './components/ActiveCallPanel.jsx'
import { placeCall, endCall } from './signalwire.js'

const CONTACTS = [
  { id: 1, name: 'Mike — Redline Carriers', number: '+12145550198', time: '10:56 AM', status: 'open', color: '#f2a93b' },
  { id: 2, name: 'Dana — Swift Freight', number: '+13475550507', time: '10:41 AM', status: 'quiet', color: '#3ed6a0' },
  { id: 3, name: 'Roy — Independent', number: '+13305554828', time: 'Yesterday', status: 'quiet', color: '#6c9be8' },
  { id: 4, name: 'Ops — Meridian Logistics', number: '+19285555076', time: 'Yesterday', status: 'open', color: '#c96ce8' },
]

export default function App() {
  const [selectedId, setSelectedId] = useState(null)
  const [activeContact, setActiveContact] = useState(null)
  const [activeCallObj, setActiveCallObj] = useState(null)
  const [callStatus, setCallStatus] = useState(null) // 'connecting' | 'active' | 'error'
  const [callError, setCallError] = useState(null)

  const startCall = async (contact) => {
    setActiveContact(contact)
    setCallStatus('connecting')
    setCallError(null)
    try {
      const call = await placeCall(contact.number, {
        onStateChange: (state) => {
          if (state === 'active') setCallStatus('active')
        },
      })
      setActiveCallObj(call)
      setCallStatus('active')
    } catch (err) {
      console.error(err)
      setCallError(err.message)
      setCallStatus('error')
    }
  }

  const hangUp = async () => {
    await endCall(activeCallObj)
    setActiveCallObj(null)
    setActiveContact(null)
    setCallStatus(null)
  }

  return (
    <div className="app-shell">
      {/* SignalWire attaches call audio here — kept off-screen, audio only */}
      <div id="sw-audio-root" style={{ position: 'absolute', width: 0, height: 0, overflow: 'hidden' }} />

      <Sidebar
        contacts={CONTACTS}
        selectedId={selectedId}
        onSelect={(id) => {
          setSelectedId(id)
          const contact = CONTACTS.find((c) => c.id === id)
          if (contact) startCall(contact)
        }}
      />

      <main className="main">
        <div className="main-topbar">
          <div>
            <h1>Dialer</h1>
            <p>Calling as +1 (209) 448-7790</p>
          </div>
          <span className="trial-pill">Trial mode</span>
        </div>

        <div className="dialer-wrap">
          <Dialer onCall={(number) => startCall({ name: 'Unknown carrier', number })} />
        </div>

        {activeContact && (
          <ActiveCallPanel
            contact={activeContact}
            status={callStatus}
            error={callError}
            onEnd={hangUp}
          />
        )}
      </main>
    </div>
  )
}
