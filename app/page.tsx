'use client';

import { useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from 'react';
import Lenis from 'lenis';
import 'lenis/dist/lenis.css';
import { Accordion as AccordionPrimitive } from '@base-ui/react/accordion';
import { Accordion, AccordionItem, AccordionContent } from '@/components/ui/accordion';
import { Dialog, DialogTrigger, DialogContent, DialogTitle, DialogDescription, DialogClose } from '@/components/ui/dialog';
import TransitScene from '@/components/transit-scene';
import Manifesto from '@/components/manifesto';
import ExecutiveGallery from '@/components/executive-gallery';
import { EMAIL, INSTAGRAM, DISCORD, TRANSIT_SOURCE, navigation, network, projects, teams } from './content';

function Wordmark() { return <><img className="brand-logo" src="/images/ontrackyvr-logo.jpg" alt="" width="1080" height="1080" />OnTrack<span>YVR</span></>; }

function Counter({ value, suffix, motion }: { value: number; suffix: string; motion: boolean }) {
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const element = ref.current;
    if (!element || !motion) return;
    let frame = 0;
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      observer.disconnect();
      const start = performance.now();
      const animate = (time: number) => {
        const progress = Math.min((time - start) / 1350, 1);
        element.textContent = `${Math.round(value * (1 - Math.pow(1 - progress, 3)))}${suffix}`;
        if (progress < 1) frame = requestAnimationFrame(animate);
      };
      frame = requestAnimationFrame(animate);
    }, { threshold: .6 });
    observer.observe(element);
    return () => { observer.disconnect(); cancelAnimationFrame(frame); element.textContent = `${value}${suffix}`; };
  }, [value, suffix, motion]);
  return <span ref={ref}>{value}{suffix}</span>;
}

export default function Home() {
  const [paused, setPaused] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('');
  const [copyStatus, setCopyStatus] = useState('');
  const copyTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const motion = !paused && !reducedMotion;

  useEffect(() => {
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReducedMotion(preference.matches);
    update(); preference.addEventListener('change', update);
    return () => preference.removeEventListener('change', update);
  }, []);

  useEffect(() => {
    if (!motion) return;
    const lenis = new Lenis({ autoRaf: true, duration: 1.12, smoothWheel: true, anchors: { offset: -96 }, prevent: element => !!element.closest('[data-lenis-prevent]') });
    return () => lenis.destroy();
  }, [motion]);

  useEffect(() => {
    const revealObserver = new IntersectionObserver(entries => {
      for (const entry of entries) if (entry.isIntersecting) { entry.target.classList.add('is-visible'); revealObserver.unobserve(entry.target); }
    }, { threshold: .1, rootMargin: '0px 0px -30px 0px' });
    document.querySelectorAll('.reveal').forEach(element => { element.classList.add('reveal-ready'); revealObserver.observe(element); });
    let frame = 0;
    const update = () => {
      let current = '';
      for (const [, id] of navigation) {
        const section = document.getElementById(id);
        if (section && section.getBoundingClientRect().top < window.innerHeight * .45) current = id;
      }
      setActiveSection(current);
      frame = 0;
    };
    const scroll = () => { if (!frame) frame = requestAnimationFrame(update); };
    window.addEventListener('scroll', scroll, { passive: true }); update();
    return () => { revealObserver.disconnect(); window.removeEventListener('scroll', scroll); cancelAnimationFrame(frame); if (copyTimeout.current) clearTimeout(copyTimeout.current); };
  }, []);

  const tiltCard = (event: ReactPointerEvent<HTMLButtonElement>) => {
    if (!motion || event.pointerType !== 'mouse') return;
    const card = event.currentTarget;
    const bounds = card.getBoundingClientRect();
    const x = (event.clientX - bounds.left) / bounds.width;
    const y = (event.clientY - bounds.top) / bounds.height;
    card.style.setProperty('--rx', `${(y - .5) * -5}deg`);
    card.style.setProperty('--ry', `${(x - .5) * 5}deg`);
    card.style.setProperty('--px', `${x * 100}%`);
    card.style.setProperty('--py', `${y * 100}%`);
  };
  const resetTilt = (event: ReactPointerEvent<HTMLButtonElement>) => {
    event.currentTarget.style.setProperty('--rx', '0deg');
    event.currentTarget.style.setProperty('--ry', '0deg');
  };
  const copyEmail = async () => {
    try { await navigator.clipboard.writeText(EMAIL); setCopyStatus('Email copied'); }
    catch { setCopyStatus('Use the email link to get in touch.'); }
    if (copyTimeout.current) clearTimeout(copyTimeout.current);
    copyTimeout.current = setTimeout(() => setCopyStatus(''), 3500);
  };

  return (
    <div className={motion ? 'motion-active' : 'motion-paused'}>
      <a className="skip-link" href="#main">Skip to content</a>
      <header className="site-header">
        <a className="wordmark" href="#home" aria-label="OnTrackYVR home"><Wordmark /></a>
        <nav className="desktop-nav" aria-label="Main navigation">{navigation.map(([label, id]) => <a key={id} href={`#${id}`} aria-current={activeSection === id ? 'location' : undefined}>{label}</a>)}</nav>
        <div className="header-actions"><a className="button button-small button-dark" href="#join">Get on board</a>
          <Dialog open={menuOpen} onOpenChange={setMenuOpen}>
            <DialogTrigger className="menu-toggle" aria-label="Open navigation">More <span className="menu-lines" aria-hidden="true"><i /><i /><i /></span></DialogTrigger>
            <DialogContent className={`mega-dialog ${motion ? 'menu-motion' : 'menu-still'}`} showCloseButton={false}>
              <div className="mega-header"><DialogTitle className="wordmark"><Wordmark /></DialogTitle><DialogClose className="dialog-close" aria-label="Close navigation">×</DialogClose></div>
              <DialogDescription className="sr-only">Explore the OnTrackYVR website.</DialogDescription>
              <div className="mega-body" data-lenis-prevent>
              <div className="mega-grid"><nav aria-label="All sections" className="mobile-links">{[...navigation, ['Executives', 'executives'], ['Join us', 'join']].map(([label, id], i) => <a key={id} href={`#${id}`} onClick={() => setMenuOpen(false)}><span className="mono">0{i + 1}</span>{label}</a>)}</nav>
              <aside className="mega-community"><img src="/photos/tracks.webp" alt="Elevated SkyTrain tracks curve between Vancouver towers" width="4016" height="6016" /><div><span className="mono">YOUR NEXT CONNECTION</span><h3>Find your people.<br /><span className="serif-word">Move things forward.</span></h3><a className="button button-lime" href={DISCORD} target="_blank" rel="noopener noreferrer">Join our Discord</a><a className="text-link" href={INSTAGRAM} target="_blank" rel="noopener noreferrer">@ontrackyvr_</a></div></aside></div><p className="mega-foot mono">BURNABY NORTH SECONDARY / STUDENT-LED. FUTURE-BOUND.</p>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </header>

      <main id="main">
        <section className="hero photographic-hero" id="home" aria-labelledby="hero-heading"><img className="hero-photograph" src="/photos/hero.webp" srcSet="/photos/hero-small.webp 1000w, /photos/hero.webp 2200w" sizes="100vw" alt="A SkyTrain rounds a sweeping elevated curve through Vancouver" width="3820" height="2149" fetchPriority="high" /><div className="hero-shade" /><div className="hero-inner shell">
          <div className="hero-topline"><span className="eyebrow"><span className="status-dot" /> A NEW ERA OF STUDENT TRANSIT</span><span className="mono location-label">BURNABY, BC / METRO VANCOUVER</span></div>
          <div className="hero-grid">
            <div className="hero-copy">
              <span className="hero-school mono">ONTRACKYVR / BURNABY NORTH SECONDARY</span><h1 id="hero-heading">Moving ideas.<br />Moving <span className="serif-word">people.</span></h1>
              <p>Better transit starts with us. We’re the students at Burnaby North turning everyday commutes into a movement for change.</p>
              <div className="hero-actions"><a className="button button-lime" href="#teams">Find your path</a><a className="text-link" href="#manifesto">Our reason to move </a></div>
              <div className="hero-caption"><span className="mini-route" aria-hidden="true"><i /><i /><i /></span><span>Student-led. Transit-focused. Future-bound.</span></div>
            </div>
          </div>
          <div className="hero-bottom"><a href="#manifesto" className="scroll-link"> SCROLL TO EXPLORE</a><span className="mono">BUILT AT BURNABY NORTH. MOVING BEYOND IT.</span><button className="motion-toggle mono" onClick={() => setPaused(!paused)} aria-pressed={!motion} disabled={reducedMotion} aria-label={reducedMotion ? 'Reduced motion is enabled in your device settings' : motion ? 'Pause animations' : 'Play animations'}><span aria-hidden="true">{motion ? 'Ⅱ' : '▷'}</span>{reducedMotion ? 'REDUCED MOTION' : motion ? 'PAUSE MOTION' : 'PLAY MOTION'}</button></div></div>
        </section>

        <Manifesto motion={motion} />

        <div className="values-strip" aria-label="Better connections. Bigger possibilities. One shared direction."><div className="marquee-track" aria-hidden="true">{[0, 1, 2, 3].map(i => <div className="marquee-set" key={i}><span>Better connections.</span><span className="asterisk">✳</span><span>Bigger possibilities.</span><span className="asterisk">✳</span><span>One shared direction.</span><span className="asterisk">✳</span></div>)}</div></div>

        <section className="section shell" id="mission" aria-labelledby="mission-heading">
          <div className="reveal"><span className="eyebrow section-index"><span className="section-node" />01 / THE MISSION</span><div className="section-heading"><h2 id="mission-heading">Transit connects a city.<br /><span className="text-muted">We connect what’s next.</span></h2><p>Every crowded bus and missed connection is a reason to care. We’re making student voices part of a more reliable, sustainable, and accessible Metro Vancouver.</p></div></div>
          <div className="mission-pillars grid gap-7 sm:grid-cols-2 lg:grid-cols-4">
            {[
              ['01', 'Reliable', 'A commute you can count on. For school, for work, for everything in between.'],
              ['02', 'Sustainable', 'Cleaner ways to move, from everyday transit choices to electrification.'],
              ['03', 'Accessible', 'Routes, maps, and transfers that make sense. Confidence for every rider.'],
              ['04', 'Student-led', 'Our experiences become organized research, creative media, and meaningful advocacy.'],
            ].map(([number, title, description], i) => <article className="mission-pillar reveal" key={title} style={{ transitionDelay: `${i * 65}ms` }}><span className="pillar-number mono">{number}</span><h3>{title}</h3><p>{description}</p></article>)}
          </div>
          <div className="era-panel era-with-scene reveal"><div className="era-copy"><span className="eyebrow">FORMERLY THE TRANSPORTATION NETWORK CLUB</span><h3>A new name.<br />A clearer <span className="serif-word">direction.</span></h3><p>More than a rebrand. We rebuilt how we work so research, media, and outreach move together—from the first idea to the final result.</p><ol className="era-principles"><li><span className="era-dot" /><div><h4>Smoother collaboration</h4><p>Connected teams. Shared progress.</p></div></li><li><span className="era-dot" /><div><h4>Faster turnaround</h4><p>Clear roles that keep good ideas moving.</p></div></li><li><span className="era-dot" /><div><h4>Stronger together</h4><p>Every member contributes to one mission.</p></div></li></ol></div><TransitScene motion={motion} /></div>
          <div className="stats-row reveal"><div><strong><Counter value={233} suffix="M+" motion={motion} /></strong><p>Transit journeys across<br />Metro Vancouver in 2023</p></div><div><strong><Counter value={430} suffix="K" motion={motion} /></strong><p>Unique customers on an average<br />weekday in fall 2023</p></div><div><strong>1 <span className="stat-in">in</span> 3</strong><p>Metro Vancouver residents<br />used transit weekly in 2023</p></div></div>
          <a className="stat-source mono" href={TRANSIT_SOURCE} target="_blank" rel="noopener noreferrer">2023 REGIONAL SNAPSHOT · SOURCE: TRANSLINK </a>
        </section>

        <section className="section teams-section" id="teams" aria-labelledby="teams-heading"><div className="shell">
          <div className="reveal"><span className="eyebrow section-index"><span className="section-node" />02 / FIND YOUR PEOPLE</span><div className="section-heading"><h2 id="teams-heading">Different paths.<br />One <span className="serif-word">direction.</span></h2><p>Big ideas need different perspectives. Find your people, bring your curiosity, and build something real.</p></div></div>
          <div className="team-grid grid gap-5 md:grid-cols-3">{teams.map((team, i) => <Dialog key={team.number}>
            <DialogTrigger className={`team-card team-${team.color} reveal`} onPointerMove={tiltCard} onPointerLeave={resetTilt} style={{ transitionDelay: `${i * 65}ms` }} aria-label={`Explore ${team.name}`}>
              <span className="team-card-top"><span className="mono">PATH {team.number}</span></span>
              <span className="path-number" aria-hidden="true">{team.number}</span>
              <span className="team-card-content"><span className="team-name">{team.name}</span><span className="team-headline">{team.headline}</span><span className="team-description">{team.description}</span><span className="team-tags">{team.tags.map(tag => <span key={tag}>{tag}</span>)}</span></span>
              <span className="team-card-bottom"><span>Explore the team</span></span>
            </DialogTrigger>
            <DialogContent className={`team-dialog team-dialog-${team.color}`} showCloseButton={false} data-lenis-prevent>
              <DialogClose className="dialog-close" aria-label="Close team details">×</DialogClose>
              <span className="eyebrow">PATH {team.number} / FIND YOUR PEOPLE</span>
              <DialogTitle className="dialog-heading">{team.name}</DialogTitle>
              <DialogDescription className="dialog-description">{team.detail}</DialogDescription>
              <div className="dialog-lead"><span className="mono">YOUR TEAM LEADER</span><strong>{team.leader}</strong></div>
              <h3 className="dialog-subheading">What you’ll work on</h3><ul className="dialog-activities">{team.activities.map(activity => <li key={activity}>{activity}</li>)}</ul>
              <p className="dialog-note">Team leaders guide members and projects, with major initiatives coordinated alongside the executive team.</p>
              <a className="button button-dark" href={`mailto:${EMAIL}?subject=${encodeURIComponent(`I'd like to join the ${team.name}`)}`}>Join this path</a>
            </DialogContent>
          </Dialog>)}</div>
          <p className="teams-note"><span className="status-dot" /> Curiosity is a great place to start. Let’s find where you fit.</p>
        </div></section>

        <section className="section shell projects-section" id="projects" aria-labelledby="projects-heading">
          <div className="reveal"><span className="eyebrow section-index"><span className="section-node" />03 / FROM IDEAS TO ACTION</span><div className="section-heading"><h2 id="projects-heading">Ideas that <span className="serif-word">move.</span></h2><p>Less “what if.” More “what’s next.”<br />Here’s what our teams are working on.</p></div></div>
          <div className="projects-grid"><figure className="project-feature reveal"><div className="project-image"><img src="/photos/station.webp" alt="Passengers wait as a SkyTrain arrives at New Westminster station" width="7161" height="4028" loading="lazy" /><span className="image-chip mono">NEW WESTMINSTER / THE EVERYDAY</span></div><figcaption><div><span className="eyebrow">OUR EVERYDAY INSPIRATION</span><h3>Built around the<br />everyday commute.</h3><p>Buses. SkyTrain. The walk in between.<br />Small experiences can spark big changes.</p></div><span className="feature-star" aria-hidden="true">✳</span></figcaption></figure>
            <Accordion className="projects-accordion reveal" defaultValue={['01']}>{projects.map(project => <AccordionItem key={project.number} value={project.number} className="project-item">
              <AccordionPrimitive.Header><AccordionPrimitive.Trigger className="project-trigger"><span className="project-number mono">{project.number}</span><span className="project-title"><span className="mono">{project.team}</span><span>{project.name}</span></span><span className="project-expand" aria-hidden="true">+</span></AccordionPrimitive.Trigger></AccordionPrimitive.Header>
              <AccordionContent className="project-details"><p>{project.description}</p><div className="project-tags">{project.tags.map(tag => <span key={tag}>{tag}</span>)}</div></AccordionContent>
            </AccordionItem>)}</Accordion>
          </div>
        </section>

        <section className="network-section" id="network" aria-labelledby="network-heading"><div className="shell">
          <div className="network-intro reveal"><span className="eyebrow section-index"><span className="section-node" />04 / BETTER, TOGETHER</span><div className="section-heading"><h2 id="network-heading">Local roots.<br /><span className="serif-word">Wider reach.</span></h2><p>A stronger transit future takes more than one school. We’re building relationships that bring student perspectives into a bigger conversation.</p></div></div>
          <figure className="network-landscape reveal"><img src="/photos/burnaby.webp" alt="Metrotown towers rise above Burnaby’s trees and neighbourhoods" width="2629" height="1478" loading="lazy" /><figcaption><span className="mono">ROOTED HERE / BURNABY, BC</span><span>One city.<br /><span className="serif-word">A thousand connections.</span></span></figcaption></figure><div className="network-list">{network.map(partner => <article className="network-row reveal" key={partner.name}><span className="network-number mono">{partner.number}</span><div className="network-name"><span className="mono">{partner.type}</span><h3>{partner.name}</h3></div><p>{partner.description}</p><span className={`network-status status-${partner.state}`} tabIndex={0}><span />{partner.status}</span></article>)}</div>
        </div></section>

        <ExecutiveGallery />

        <section className="section shell journey-section" id="journey" aria-labelledby="journey-heading"><div className="journey-copy reveal"><span className="eyebrow section-index"><span className="section-node" />06 / FOLLOW THE JOURNEY</span><h2 id="journey-heading">Catch us<br />in <span className="serif-word">motion.</span></h2><p>The meetings, the projects, the moments in between. Follow along as we figure out what a better transit future can look like.</p><a className="button button-dark" href={INSTAGRAM} target="_blank" rel="noopener noreferrer">@ontrackyvr_</a><span className="mono social-official">OFFICIAL INSTAGRAM</span></div><div className="social-cards"><a className="social-card social-era reveal" href={INSTAGRAM} target="_blank" rel="noopener noreferrer" aria-label="Visit OnTrackYVR on Instagram for team and club updates"><img className="social-photo" src="/photos/bus.webp" alt="A TransLink bus travels along a Vancouver street" width="4370" height="2458" loading="lazy" /><span className="mono social-card-kicker">ONTRACKYVR / CLUB UPDATES</span><span className="social-display">NEW<br />ERA<span className="social-asterisk" aria-hidden="true">✳</span></span><span className="social-card-bottom">The people. The plans. The progress.</span></a><a className="social-card social-voice reveal" href={DISCORD} target="_blank" rel="noopener noreferrer" aria-label="Join the OnTrackYVR community on Discord"><span className="mono social-card-kicker">ONTRACKYVR / COMMUNITY</span><span className="social-display">YOUR<br /><span className="serif-word">city.</span><br />YOUR<br /><span className="serif-word">voice.</span></span><span className="social-card-bottom">Join the Discord.</span></a></div></section>

        <section id="join" className="join-section shell reveal" aria-labelledby="join-heading"><div className="join-copy"><span className="eyebrow"><span className="status-dot" />07 / YOUR NEXT STOP</span><h2 id="join-heading">The future is moving.<br />Move it <span className="serif-word">with us.</span></h2><p>Bring your ideas, your perspective, and your everyday commute. There’s a place for you at OnTrackYVR.</p><div className="join-actions"><a className="button button-lime" href={DISCORD} target="_blank" rel="noopener noreferrer">Join our Discord</a><a className="text-link" href={INSTAGRAM} target="_blank" rel="noopener noreferrer">Follow the journey</a></div></div><div className="join-ticket" aria-hidden="true"><span className="mono">ONTRACKYVR</span><span className="ticket-label">ALL<br />ABOARD.</span><div className="ticket-divider" /><span className="mono">DESTINATION</span><strong>What’s next.</strong><span className="mono ticket-bottom">BNSS / A BETTER FUTURE</span></div></section>

        <div className="contact-line shell"><span>Good ideas start with a conversation.</span><div className="contact-email"><a href={`mailto:${EMAIL}`}>{EMAIL}</a><button onClick={copyEmail} aria-label="Copy email address">{copyStatus === 'Email copied' ? '✓' : '⧉'}</button></div><span className="copy-status" role="status">{copyStatus}</span></div>
      </main>

      <footer className="footer shell"><div><a className="wordmark" href="#home" aria-label="OnTrackYVR back to top"><Wordmark /></a><p>Burnaby North Secondary<br />Burnaby, BC, Canada</p></div><div className="footer-center"><span className="mono">A NEW ERA. MOVING FORWARD TOGETHER.</span><span>© 2026 OnTrackYVR</span></div><div className="footer-links"><a href={INSTAGRAM} target="_blank" rel="noopener noreferrer">Instagram</a><a href={DISCORD} target="_blank" rel="noopener noreferrer">Discord</a><a href={`mailto:${EMAIL}`}>Get in touch</a><a href="#home">Back to top </a></div></footer><details className="photo-credits shell"><summary className="mono">PHOTOGRAPHY & CREDITS <span aria-hidden="true">＋</span></summary><div><p>Club photographs supplied by OnTrackYVR. The additional transit photographs show Metro Vancouver and its commuters.</p><p>SkyTrain, station and bus photos by Albert Stoynov on Unsplash: <a href="https://unsplash.com/photos/EPSjqKy4IVk" target="_blank" rel="noopener noreferrer">elevated curve</a>, <a href="https://unsplash.com/photos/83KIFRea81E" target="_blank" rel="noopener noreferrer">New Westminster</a>, <a href="https://unsplash.com/photos/hv6_qbRfDA8" target="_blank" rel="noopener noreferrer">Vancouver bus</a>. <a href="https://unsplash.com/photos/8Z_Iwvct7ro" target="_blank" rel="noopener noreferrer">Urban tracks</a> by Ryunosuke Kikuno. Used under the <a href="https://unsplash.com/license" target="_blank" rel="noopener noreferrer">Unsplash Licence</a>.</p><p><a href="https://commons.wikimedia.org/wiki/File:Burnaby_Metrotown_skyline.jpg" target="_blank" rel="noopener noreferrer">Burnaby Metrotown skyline</a> by Zacharycmango / Wikimedia Commons, <a href="https://creativecommons.org/licenses/by-sa/4.0/" target="_blank" rel="noopener noreferrer">CC BY-SA 4.0</a>. Resized, converted to WebP and cropped for display; this adapted photo remains under CC BY-SA 4.0.</p></div></details>
    </div>
  );
}
