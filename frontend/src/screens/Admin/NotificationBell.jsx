import React, { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { api } from '../../shared/api.js';

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
    const socket = io('http://localhost:4000', { withCredentials: true, auth: { token } });
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


