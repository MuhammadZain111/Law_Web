import React, { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { api } from "../../shared/api.js";

export default function LawyerProfileSection() {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;
        const res = await api.get('/user/profile');
        const user = res?.data?.user || res?.data || res?.user || null;
        setProfile(user);
      } catch (_) {
        // ignore
      }
    })();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userType');
    window.location.href = '/';
  };

  return (
    <div className="p-6">
      <div className="max-w-xl bg-white rounded-xl shadow border border-gray-200 p-6">
        <div className="flex items-center gap-4">
          <img
            src={profile?.photoUrl || 'https://i.pravatar.cc/120'}
            alt="avatar"
            className="w-16 h-16 rounded-full object-cover"
          />
          <div>
            <div className="text-lg font-semibold">{profile ? `${profile.firstname || ''} ${profile.lastname || ''}`.trim() : 'Lawyer'}</div>
            <div className="text-sm text-gray-500">{profile?.email || ''}</div>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-4 text-sm">
          <div>
            <div className="text-gray-500">Specialization</div>
            <div className="font-medium">{profile?.occupation || '—'}</div>
          </div>
          <div>
            <div className="text-gray-500">City</div>
            <div className="font-medium">{profile?.city || '—'}</div>
          </div>
        </div>

        <div className="mt-8">
          <Button className="bg-red-600 hover:bg-red-700" onClick={handleLogout}>Logout</Button>
        </div>
      </div>
    </div>
  );
}
