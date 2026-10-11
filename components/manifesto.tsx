'use client';

import { useEffect, useRef, useState } from 'react';

const chapters = [
  { label: 'Research', start: 'Student feedback.', accent: 'Transit proposals.', detail: 'Our Policy & Research team collects concerns about crowded buses and inefficient routes, then prepares practical proposals for TransLink and the City of Burnaby.', photos: ['club/planning', 'club/classroom', 'bus', 'club/workshop'], captions: ['CLUB PLANNING', 'AT BURNABY NORTH', 'THE COMMUTE WE CARE ABOUT', 'WORKING TOGETHER'] },
  { label: 'Outreach', start: 'First transit trip?', accent: 'We teach the basics.', detail: 'Our Leadership Outreach team develops Grade 7 lessons on bus and SkyTrain travel: reading maps, planning transfers, using Compass Cards, and travelling safely.', photos: ['club/presentation', 'station', 'club/group', 'club/classroom'], captions: ['SHARING WHAT WE KNOW', 'BUS & SKYTRAIN BASICS', 'OUR CLUB COMMUNITY', 'LEARNING TOGETHER'] },
  { label: 'Media', start: 'Local transit news.', accent: 'Student stories.', detail: 'Our Media Team creates route-update reels, student interviews, and the OnTrackYVR club trailer. Follow @ontrackyvr_ to see what we’re working on.', photos: ['club/members', 'club/group', 'tracks', 'club/workshop'], captions: ['THE PEOPLE IN OUR CLUB', 'ONTRACKYVR AT BURNABY NORTH', 'METRO VANCOUVER', 'BEHIND THE SCENES'] },
];

const clamp = (value: number) => Math.max(0, Math.min(1, value));

export default function Manifesto({ motion }: { motion: boolean }) {
  const root = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);
  useEffect(() => {
    const element = root.current;
    if (!element || !motion) return;
    const slides = Array.from(element.querySelectorAll<HTMLElement>('.manifesto-slide'));
    let frame = 0;
    const update = () => {
      const bounds = element.getBoundingClientRect();
      const range = Math.max(1, element.offsetHeight - window.innerHeight);
      const progress = clamp(-bounds.top / range);
      const position = progress * chapters.length;
      setActive(Math.min(chapters.length - 1, Math.floor(position)));
      element.style.setProperty('--journey-progress', String(progress));
      slides.forEach((slide, index) => {
        const local = position - index;
        // Hold each statement fully visible for most of its scroll segment.
        const fadeIn = index === 0 ? 1 : clamp((local + .1) / .2);
        const fadeOut = index === chapters.length - 1 ? 1 : 1 - clamp((local - .9) / .2);
        slide.style.setProperty('--slide-opacity', String(fadeIn * fadeOut));
        slide.style.setProperty('--photo-drift', `${(local - .35) * -70}px`);
        slide.style.setProperty('--text-drift', '0px');
        slide.style.setProperty('--photo-turn', `${(local - .35) * 3}deg`);
      });
      frame = 0;
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(update); };
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    update();
    return () => { window.removeEventListener('scroll', schedule); window.removeEventListener('resize', schedule); cancelAnimationFrame(frame); };
  }, [motion]);

  function goToChapter(index: number) {
    const element = root.current;
    if (!element) return;
    const top = element.getBoundingClientRect().top + window.scrollY;
    window.scrollTo({ top: top + (element.offsetHeight - window.innerHeight) * ((index + .45) / chapters.length), behavior: motion ? 'smooth' : 'instant' });
  }

  return <section ref={root} id="manifesto" className={`manifesto ${motion ? 'manifesto-animated' : 'manifesto-static'}`} aria-labelledby="manifesto-heading">
    <div className="manifesto-pin">
      <div className="manifesto-meta shell"><h2 id="manifesto-heading" className="eyebrow"><span className="status-dot" />WHAT OUR CLUB DOES</h2><a href="#mission" className="mono">SKIP TO THE MISSION</a></div>
      <div className="manifesto-stage">
        {chapters.map((chapter, index) => <div className="manifesto-slide" key={chapter.label} style={{ '--slide-opacity': index === 0 ? 1 : 0 } as React.CSSProperties}>
          {chapter.photos.map((photo, photoIndex) => <figure key={`${photo}-${photoIndex}`} className={`manifesto-photo story-photo story-photo-${photoIndex}`}><img src={`/photos/${photo}.webp`} alt="" width="900" height="1000" loading="lazy" /><figcaption className="mono">{chapter.captions[photoIndex]}</figcaption></figure>)}
          <div className="manifesto-words"><span className="manifesto-number mono">0{index + 1} / {chapter.label.toUpperCase()}</span><p>{chapter.start}<br /><span className="serif-word">{chapter.accent}</span></p><span className="manifesto-detail">{chapter.detail}</span></div>
        </div>)}
      </div>
      <nav className="manifesto-stops" aria-label="Manifesto chapters">{chapters.map((chapter, index) => <button key={chapter.label} onClick={() => goToChapter(index)} aria-current={active === index ? 'step' : undefined}><span className="stop-dot" /><span className="mono">0{index + 1}</span>{chapter.label}</button>)}</nav>
      <div className="manifesto-progress" aria-hidden="true"><span /></div>
    </div>
  </section>;
}
