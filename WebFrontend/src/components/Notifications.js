/**
 * Real-time notifications via WebSocket. Displays messages and supports a live region.
 * Requires env var: REACT_APP_WS_URL (optional).
 */
import React from 'react';
import ReconnectingWebSocket from 'reconnecting-websocket';

export default function Notifications() {
  const [messages, setMessages] = React.useState([]);
  const liveRef = React.useRef(null);

  React.useEffect(() => {
    const wsUrl = process.env.REACT_APP_WS_URL;
    if (!wsUrl) return;
    const ws = new ReconnectingWebSocket(wsUrl);
    ws.addEventListener('message', (ev) => {
      try {
        const data = JSON.parse(ev.data);
        const text = data.message || 'Notification';
        setMessages((prev) => [{ id: Date.now(), text }, ...prev].slice(0, 5));
        if (liveRef.current) {
          liveRef.current.textContent = text;
        }
      } catch {
        /* ignore */
      }
    });
    return () => ws.close();
  }, []);

  return (
    <>
      <div aria-live="polite" aria-atomic="true" className="sr-only" ref={liveRef} />
      <div className="notifications">
        {messages.map((m) => (
          <div key={m.id} role="status" className="toast">
            {m.text}
          </div>
        ))}
      </div>
      <style>{`
        .sr-only { position: absolute; left: -9999px; }
        .notifications { position: fixed; right: 1rem; bottom: 1rem; display: grid; gap: .5rem; z-index: 50; }
        .toast { background: var(--bg-secondary); border: 1px solid var(--border); padding: .5rem .75rem; border-radius: .5rem; box-shadow: 0 2px 8px rgba(0,0,0,.1); }
      `}</style>
    </>
  );
}
