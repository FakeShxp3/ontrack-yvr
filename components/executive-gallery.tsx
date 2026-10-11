'use client';

import { useState, type CSSProperties } from 'react';
import { executives } from '@/app/content';

export default function ExecutiveGallery() {
  const [hovered, setHovered] = useState<string | null>(null);
  const [selected, setSelected] = useState<string | null>(null);
  const active = hovered ?? selected;
  return <section className="section executive-section" id="executives" aria-labelledby="executives-heading">
    <div className="shell">
      <div className="executive-heading reveal"><span className="eyebrow section-index">05 / THE EXECUTIVE TEAM</span><h2 id="executives-heading">Meet the <span className="serif-word">team.</span></h2><p>The students organizing our projects, meetings, and club updates.</p><span className="executive-hint mono">HOVER, FOCUS OR TAP A CARD TO MEET THEM</span></div>
      <div className={`executive-gallery ${active ? 'has-active' : ''}`} onPointerLeave={() => setHovered(null)} onBlur={event => { if (!event.currentTarget.contains(event.relatedTarget)) setSelected(null); }}>
        {executives.map((person, index) => <button key={person.name} className={`executive-profile profile-${person.color} ${active === person.name ? 'is-active' : ''}`} style={{ '--card-rotation': `${[-7, -3, 1, -2, 7][index]}deg`, '--card-offset': `${[15, 0, 12, 1, 17][index]}px` } as CSSProperties} onPointerEnter={event => { if (event.pointerType === 'mouse') setHovered(person.name); }} onFocus={() => setSelected(person.name)} onClick={() => setSelected(person.name)} onKeyDown={event => { if (event.key === 'Escape') { setSelected(null); setHovered(null); event.currentTarget.blur(); } }} aria-pressed={active === person.name} aria-label={`${person.name}, ${person.role}`}>
          <span className={`executive-photo ${person.photo ? 'has-cutout' : ''}`}>
            {person.photo ? <img className="profile-portrait" src={person.photo.src} alt={`Portrait of ${person.name}`} width={800} height={960} loading="lazy" decoding="async" draggable={false} /> : <><span className="profile-index mono">0{index + 1} / ONTRACKYVR</span><span className="profile-initials" aria-hidden="true">{person.initials}</span><span className="profile-photo-note mono">PHOTO COMING SOON</span></>}
          </span>
          <span className="profile-caption"><span className="mono">{person.role}</span><strong>{person.name}</strong><span className="profile-description">{person.description}</span></span>
        </button>)}
      </div>
      <button className="clear-profile mono" onClick={() => { setSelected(null); setHovered(null); }} disabled={!active}>Show everyone</button>
    </div>
  </section>;
}
