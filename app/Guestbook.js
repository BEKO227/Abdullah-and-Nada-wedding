'use client';
import { useState } from 'react';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db } from './firebase';

const MSG = {
  sent: 'Thank you! Your message has been sent to the couple.',
  wait: 'Please wait a few seconds before sending another message.',
  error: 'Something went wrong. Please try again.',
};

export default function Guestbook() {
  const [name, setName] = useState('');
  const [msg, setMsg] = useState('');
  const [trap, setTrap] = useState('');
  const [state, setState] = useState('idle');

  const submit = async (e) => {
    e.preventDefault();
    if (trap) return; // honeypot: bots fill hidden fields
    const n = name.trim(), m = msg.trim();
    if (!n || !m) return;
    try {
      const last = Number(localStorage.getItem('gb_last') || 0);
      if (Date.now() - last < 30000) { setState('wait'); return; }
    } catch {}
    setState('sending');
    try {
      await addDoc(collection(db, 'guestbook'), {
        name: n.slice(0, 40), message: m.slice(0, 300), createdAt: serverTimestamp(),
      });
      try { localStorage.setItem('gb_last', String(Date.now())); } catch {}
      setName(''); setMsg(''); setState('sent');
    } catch { setState('error'); }
  };

  return (<>
    <h2>Guest Book</h2>
    <p className="small">Leave us a few words</p>
    <form className="gb-form" onSubmit={submit}>
      <input className="gb-in" value={name} onChange={(e) => setName(e.target.value)} maxLength={40} placeholder="Your name" aria-label="Your name" required dir="auto" />
      <textarea className="gb-in" value={msg} onChange={(e) => setMsg(e.target.value)} maxLength={300} rows={4} placeholder="Your message" aria-label="Your message" required dir="auto" />
      <input className="gb-trap" tabIndex={-1} autoComplete="off" value={trap} onChange={(e) => setTrap(e.target.value)} aria-hidden="true" />
      <button className="btn gb-btn" type="submit" disabled={state === 'sending'}>{state === 'sending' ? 'Sending...' : 'Send'}</button>
      <p className="gb-note" role="status">{MSG[state] || ''}</p>
    </form>
  </>);
}