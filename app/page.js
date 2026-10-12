'use client';
import { useEffect, useRef, useState } from 'react';
import { invite } from './invite.config';
import Guestbook from './Guestbook';

/* Procedural layered rose (also used for the falling roses) */
const Bloom = ({ style, tone = 'red' }) => {
  const c = tone === 'white' ? ['#fffaf0', '#cdbfa6'] : ['#b3263a', '#4f0a16'];
  const id = 'g' + tone;
  const ring = (n, rx, ry, d, off, op) => Array.from({ length: n }, (_, i) => (
    <ellipse key={i + '' + d} cx="50" cy={50 - d} rx={rx} ry={ry} transform={`rotate(${off + (360 / n) * i} 50 50)`} fill={`url(#${id})`} stroke="#e8cfa4" strokeOpacity={op} strokeWidth=".8" />));
  return (<svg className="rose" viewBox="0 0 100 100" style={style} aria-hidden="true">
    <defs><radialGradient id={id}><stop offset="0" stopColor={c[0]} /><stop offset="1" stopColor={c[1]} /></radialGradient></defs>
    {ring(7, 17, 26, 22, 0, .35)}{ring(6, 14, 22, 15, 25, .4)}{ring(5, 11, 17, 9, 50, .5)}
    <path d="M50 50c-6-1-8-8-2-10 7-2 11 6 5 11-4 3-10 0-9-5" fill="none" stroke="#e8cfa4" strokeOpacity=".5" strokeWidth="1" />
  </svg>);
};
const Leaf = ({ style }) => (<svg className="rose" viewBox="0 0 40 80" style={style} aria-hidden="true"><path d="M20 78C2 56 4 22 20 2c16 20 18 54 0 76z" fill="#34411f" stroke="#8a9a5a" strokeOpacity=".5" /><path d="M20 76V8" stroke="#8a9a5a" strokeOpacity=".5" /></svg>);

/* Rose clusters for the simple fallback frame */
const Cluster = ({ cls }) => {
  const img = invite.roseImage;
  if (img) return <div className={`cluster ${cls}`}><img className="rose" src={img} alt="" style={{ width: 150, height: 150, left: -10, top: -10 }} /></div>;
  return (<div className={`cluster ${cls}`} aria-hidden="true">
    <Leaf style={{ width: 34, height: 68, left: 4, top: 52, transform: 'rotate(-60deg)' }} />
    <Leaf style={{ width: 34, height: 68, left: 70, top: 40, transform: 'rotate(40deg)' }} />
    <Bloom style={{ width: 84, height: 84, left: 8, top: 8 }} />
    <Bloom tone="white" style={{ width: 58, height: 58, left: 66, top: 62 }} />
    <Bloom style={{ width: 46, height: 46, left: 56, top: 6 }} />
  </div>);
};

const Orn = ({ small }) => (<svg className="orn" viewBox="0 0 200 34" style={small ? { width: 120, height: 20 } : null} aria-hidden="true"><path d="M4 17h66M130 17h66M70 17c10-14 20-14 30 0 10 14 20 14 30 0"/><circle cx="100" cy="17" r="7" fill="#8c1c2b"/></svg>);

const Divider = () => <img className="divider" src="/roses/divider.png" alt="" />;

/* Falling roses in the background */
function Falling({ fixed }) {
  const [items, setItems] = useState([]);
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const n = window.innerWidth < 480 ? 14 : 22;
    setItems(Array.from({ length: n }, (_, i) => ({
      id: i, left: Math.random() * 100, size: 14 + Math.random() * 20,
      dur: 9 + Math.random() * 9, delay: -Math.random() * 18,
      dx: (Math.random() - 0.5) * 90, rot: (Math.random() < 0.5 ? -1 : 1) * (180 + Math.random() * 360),
      tone: i % 3 === 0 ? 'white' : 'red' })));
  }, []);
  return (<div className={`fall${fixed ? ' fixed' : ''}`} aria-hidden="true">
    {items.map((p) => (
      <span key={p.id} style={{ left: p.left + '%', width: p.size, height: p.size, animationDuration: p.dur + 's', animationDelay: p.delay + 's', '--dx': p.dx + 'px', '--rot': p.rot + 'deg' }}>
        <Bloom tone={p.tone} style={{ position: 'static', width: '100%', height: '100%' }} />
      </span>))}
  </div>);
}

/* Cover with "Open" button, burst of small flowers, and music start */
const FLOWER = (fill) => `<svg viewBox="-12 -12 24 24" width="100%" height="100%"><g fill="${fill}">${[0, 72, 144, 216, 288].map((a) => `<ellipse cx="0" cy="-6" rx="3.6" ry="6" transform="rotate(${a})"/>`).join('')}</g><circle r="2" fill="#f7e3a1"/></svg>`;
function Cover({ onDone, audioRef }) {
  const [opening, setOpening] = useState(false);
  const [gone, setGone] = useState(false);
  const [hide, setHide] = useState(false);
  const btn = useRef(null);
  useEffect(() => { document.body.classList.add('locked'); return () => document.body.classList.remove('locked'); }, []);
  const open = () => {
    if (invite.music && audioRef) {
      const a = new Audio(invite.music); a.loop = true; a.volume = invite.musicVolume ?? 0.6;
      audioRef.current = a; a.play().catch(() => {});
    }
    setOpening(true);
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!reduce) {
      const r = btn.current.getBoundingClientRect(), ox = r.left + r.width / 2, oy = r.top + r.height / 2;
      const W = window.innerWidth, H = window.innerHeight, colors = ['#e58aa0', '#d9b45a', '#f4ead8', '#c9475f'];
      const N = W < 480 ? 40 : 70;
      for (let i = 0; i < N; i++) {
        const el = document.createElement('div'), s = 8 + Math.random() * 16;
        el.className = 'petal'; el.style.width = el.style.height = s + 'px'; el.style.left = ox - s / 2 + 'px'; el.style.top = oy - s / 2 + 'px';
        el.innerHTML = FLOWER(colors[i % colors.length]); document.body.appendChild(el);
        const dx = (Math.random() - 0.5) * W * 1.1, up = -(60 + Math.random() * H * 0.45), rot = (Math.random() - 0.5) * 720;
        el.animate([
          { transform: 'translate(0,0) scale(.2) rotate(0)', opacity: 1 },
          { transform: `translate(${dx * 0.55}px,${up}px) scale(1) rotate(${rot / 2}deg)`, opacity: 1, offset: 0.35 },
          { transform: `translate(${dx}px,${H - oy + 40}px) scale(.9) rotate(${rot}deg)`, opacity: 0 }],
          { duration: 2400 + Math.random() * 1600, easing: 'cubic-bezier(.3,.6,.4,1)', delay: Math.random() * 250, fill: 'forwards' }).onfinish = () => el.remove();
      }
    }
    setTimeout(() => { setGone(true); document.body.classList.remove('locked'); onDone?.(); }, reduce ? 0 : 1500);
    setTimeout(() => setHide(true), reduce ? 0 : 2400);
  };
  if (hide) return null;
  return (<div className={`cover${opening ? ' opening' : ''}${gone ? ' gone' : ''}`}><Falling /><div className="cover-card">
    <img className="rc tl" src="/cover/corner-tl.png" alt="" /><img className="rc br" src="/cover/corner-br.png" alt="" />
    <div className="cn">{invite.groom}<i>&amp;</i>{invite.bride}</div>
    <p>{new Date(invite.date).toLocaleString('en', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
    <p>{invite.coverLine}</p>
    <button ref={btn} className="open" onClick={open}>Open</button>
  </div></div>);
}

function Reveal({ children }) {
  const ref = useRef(null);
  useEffect(() => {
    const io = new IntersectionObserver(([e]) => e.isIntersecting && ref.current.classList.add('in'), { threshold: 0.15 });
    io.observe(ref.current); return () => io.disconnect();
  }, []);
  return <section ref={ref} className="rv">{children}</section>;
}

function Gallery() {
  const items = invite.photos.length ? invite.photos : Array.from({ length: 8 }, () => null);
  const [cur, setCur] = useState(0);
  const sx = useRef(null);
  const go = (n) => setCur((n + items.length) % items.length);
  useEffect(() => { const t = setInterval(() => setCur((c) => (c + 1) % items.length), 4000); return () => clearInterval(t); }, [items.length]);
  return (<>
    <div className="cf" onPointerDown={(e) => (sx.current = e.clientX)}
      onPointerUp={(e) => { if (sx.current !== null && Math.abs(e.clientX - sx.current) > 30) go(cur + (e.clientX < sx.current ? 1 : -1)); sx.current = null; }}>
      {items.map((p, i) => {
        let d = i - cur; if (d > items.length / 2) d -= items.length; if (d < -items.length / 2) d += items.length;
        const a = Math.abs(d);
        return (<div key={i} className="card" onClick={() => go(i)} style={{
          backgroundImage: p ? `url(${p})` : `linear-gradient(${150 + i * 20}deg,hsl(${(i * 37) % 360} 30% 30%),#1a0a0c)`,
          transform: `translateX(${d * 52}%) translateZ(${-a * 120}px) rotateY(${-d * 38}deg) scale(${a ? 0.82 : 1})`,
          opacity: a > 2 ? 0 : 1 - a * 0.25, zIndex: 10 - a, filter: a ? 'brightness(.6)' : 'none' }}>{!p && `Photo ${i + 1}`}</div>);
      })}
    </div>
    <p className="count">{cur + 1} / {items.length}</p>
  </>);
}

function Countdown({ to }) {
  const [txt, setTxt] = useState('');
  useEffect(() => {
    const tick = () => { const s = Math.max(0, Math.floor((new Date(to) - Date.now()) / 1000));
      setTxt(`${Math.floor(s / 86400)} days ${Math.floor((s % 86400) / 3600)} hours ${Math.floor((s % 3600) / 60)} min ${s % 60} sec`); };
    tick(); const t = setInterval(tick, 1000); return () => clearInterval(t);
  }, [to]);
  return <p className="cd">{txt}</p>;
}

function Calendar({ date }) {
  const d = new Date(date), y = d.getFullYear(), m = d.getMonth();
  const off = (new Date(y, m, 1).getDay() + 6) % 7, n = new Date(y, m + 1, 0).getDate();
  return (<>
    <h2>{d.toLocaleString('en', { month: 'long' })} {y}</h2>
    <div className="cal">
      {['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'].map((x) => <b key={x}>{x}</b>)}
      {Array.from({ length: off }, (_, i) => <span key={'e' + i} />)}
      {Array.from({ length: n }, (_, i) => <span key={i} className={i + 1 === d.getDate() ? 'on' : ''}>{i + 1}</span>)}
    </div>
  </>);
}

export default function Page() {
  const { groom, bride, date, welcome, reception, weekday, mapUrl, mapEmbed, venue, venueAr, address, hero, heroPhoto } = invite;
  const d = new Date(date);
  const audioRef = useRef(null);
  const [started, setStarted] = useState(false);
  const [muted, setMuted] = useState(false);

  useEffect(() => {
    const onVis = () => {
      const a = audioRef.current; if (!a) return;
      if (document.hidden) a.pause(); else a.play().catch(() => {});
    };
    document.addEventListener('visibilitychange', onVis);
    return () => { document.removeEventListener('visibilitychange', onVis); audioRef.current?.pause(); };
  }, []);

  const toggleMute = () => {
    const a = audioRef.current; if (!a) return;
    a.muted = !a.muted; setMuted(a.muted);
  };

  return (<>
    <Cover audioRef={audioRef} onDone={() => setStarted(true)} />
    <Falling fixed />
    <main>
      <Reveal>
        <p className="eyebrow">Save the Date</p>
        {heroPhoto ? (
          <img className="heroimg" src={heroPhoto} alt={`${groom} & ${bride}`} />
        ) : (
          <div className="frame">
            <div className="ph" style={hero ? { backgroundImage: `url(${hero})` } : null}>{!hero && `${bride} & ${groom}`}</div>
            <Cluster cls="a" /><Cluster cls="b" /><Cluster cls="c" />
          </div>)}
        <h1 className="names">{groom}<i>&amp;</i>{bride}</h1><Divider />
      </Reveal>
      <div className="vines">
        <i className="vine l" aria-hidden="true" /><i className="vine r" aria-hidden="true" />
        <Reveal>
          <h2>Ceremony Info</h2>
          <p className="small">We joyfully announce<br />our wedding</p><Orn small />
          <p className="script">{groom}<i>&amp;</i>{bride}</p><Divider />
        </Reveal>
        <Reveal><h2>Photo Gallery</h2><Gallery /></Reveal>
      </div>
      <Reveal>
        <h2>Reception Info</h2><Orn small />
        <p className="small" style={{ fontWeight: 600 }}>The reception will take place at:</p>
        <p className="small">{welcome} &nbsp;&nbsp; {weekday}</p>
        <div className="badge"><div className="d">{d.getDate()}</div><div><span>{d.toLocaleString('en', { month: 'long' })}</span><span>{d.getFullYear()}</span></div></div>
        <div className="times"><div className="small">Welcome<b>{welcome}</b></div><div className="small">Reception<b>{reception}</b></div></div>
        <p className="small">Countdown</p><Countdown to={date} />
        <Calendar date={date} />
        <Divider />
        <h2>Location</h2><Orn small />
        <p className="venue">{venue}<i dir="rtl" lang="ar">{venueAr}</i></p>
        <p className="small">{address}</p>
        {mapEmbed && (
          <a className="mapbox" href={mapUrl} target="_blank" rel="noopener noreferrer" aria-label={`Open ${venue} in Google Maps`}>
            <iframe title={`Map of ${venue}`} src={mapEmbed} loading="lazy" referrerPolicy="no-referrer-when-downgrade" tabIndex={-1} />
          </a>
        )}
        {mapUrl && <a className="btn" href={mapUrl} target="_blank" rel="noopener noreferrer">View Location</a>}
      </Reveal>
      <Reveal><Guestbook /></Reveal>
    </main>
    {started && invite.music && (
      <button className={`eq${muted ? ' off' : ''}`} onClick={toggleMute} aria-label={muted ? 'Unmute music' : 'Mute music'}>
        <i /><i /><i /><i />
      </button>
    )}
  </>);
}