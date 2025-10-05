import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { api } from '../../shared/api.js';

const SOCKET_BASE = (import.meta.env?.VITE_API_BASE || 'http://localhost:5000');

export default function NotificationsBell() {
  const [count, setCount] = useState(0);
  const [notes, setNotes] = useState([]);

  async function load() {
    const res = await api.get('/lawyers/me/notifications');
    setNotes(res.data);
    setCount(res.data.filter((n) => !n.read).length);
  }

  useEffect(() => {
    load();
    const token = localStorage.getItem('token');
    const socket = io(SOCKET_BASE, { withCredentials: true, auth: { token } });
    socket.on('notification', (payload) => {
      setNotes((prev) => [payload, ...prev]);
      setCount((c) => c + 1);
    });
    return () => socket.disconnect();
  }, []);

  return (
    <div>
      <button>Notifications ({count})</button>
    </div>
  );
}


