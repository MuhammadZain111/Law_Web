import React, { useState } from 'react';
import { api } from '../../shared/api.js';

export default function ProfileForm() {
  const [form, setForm] = useState({
    fullName: '',
    barNumber: '',
    specialization: '',
    yearsOfExperience: 0,
    city: '',
    state: '',
    country: ''
  });
  const [msg, setMsg] = useState('');

  function onChange(e) {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: name === 'yearsOfExperience' ? Number(value) : value }));
  }

  async function submit(e) {
    e.preventDefault();
    setMsg('');
    await api.post('/lawyers/profile', form);
    setMsg('Submitted for approval.');
  }

  return (
    <form onSubmit={submit} style={{ maxWidth: 520 }}>
      <h3>Lawyer Profile</h3>
      <input name="fullName" placeholder="Full Name" value={form.fullName} onChange={onChange} required />
      <input name="barNumber" placeholder="Bar Number" value={form.barNumber} onChange={onChange} required />
      <input name="specialization" placeholder="Specialization" value={form.specialization} onChange={onChange} required />
      <input name="yearsOfExperience" type="number" placeholder="Years of Experience" value={form.yearsOfExperience} onChange={onChange} required />
      <input name="city" placeholder="City" value={form.city} onChange={onChange} />
      <input name="state" placeholder="State" value={form.state} onChange={onChange} />
      <input name="country" placeholder="Country" value={form.country} onChange={onChange} />
      <button type="submit">Submit</button>
      {msg && <p>{msg}</p>}
    </form>
  );
}


