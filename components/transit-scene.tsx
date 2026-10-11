'use client';

import { useEffect, useRef, useState } from 'react';
import type { BufferGeometry, Group, Material, Object3D } from 'three';

type SceneController = { rotate: (amount: number) => void; reset: () => void };

export default function TransitScene({ motion }: { motion: boolean }) {
  const host = useRef<HTMLDivElement>(null);
  const controller = useRef<SceneController | null>(null);
  const motionRef = useRef(motion);
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);
  useEffect(() => { motionRef.current = motion; }, [motion]);

  useEffect(() => {
    const element = host.current;
    if (!element) return;
    let disposed = false;
    let cleanup = () => {};

    async function createScene() {
      const THREE = await import('three');
      const { RoundedBoxGeometry } = await import('three/addons/geometries/RoundedBoxGeometry.js');
      if (disposed || !element) return;

      const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'low-power' });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.65));
      renderer.shadowMap.enabled = true;
      renderer.shadowMap.type = THREE.PCFSoftShadowMap;
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.22;
      renderer.domElement.setAttribute('aria-hidden', 'true');
      element.appendChild(renderer.domElement);

      const scene = new THREE.Scene();
      const camera = new THREE.OrthographicCamera(-5, 5, 4.4, -4.4, .1, 80);
      camera.position.set(8, 7.5, 10);
      camera.lookAt(0, .3, 0);
      const world = new THREE.Group();
      scene.add(world);
      scene.add(new THREE.HemisphereLight(0xffffff, 0x7a91ad, 3.2));
      const sun = new THREE.DirectionalLight(0xf7fbff, 4.1);
      sun.position.set(-4, 9, 6);
      sun.castShadow = true;
      sun.shadow.mapSize.set(2048, 2048);
      sun.shadow.camera.left = -7; sun.shadow.camera.right = 7;
      sun.shadow.camera.top = 7; sun.shadow.camera.bottom = -7;
      sun.shadow.normalBias = .025;
      sun.shadow.bias = -.0001;
      scene.add(sun);
      const fill = new THREE.DirectionalLight(0xdcefff, 1.4);
      fill.position.set(4, 2, -5);
      scene.add(fill);

      const colors = {
        ivory: new THREE.MeshStandardMaterial({ color: 0xeef4fb, roughness: .86 }),
        green: new THREE.MeshStandardMaterial({ color: 0x005b9f, roughness: .76 }),
        lime: new THREE.MeshStandardMaterial({ color: 0xffd447, roughness: .67 }),
        dark: new THREE.MeshStandardMaterial({ color: 0x092b4b, roughness: .58 }),
        silver: new THREE.MeshStandardMaterial({ color: 0xdce6ef, metalness: .48, roughness: .3 }),
        glass: new THREE.MeshStandardMaterial({ color: 0x143f65, metalness: .25, roughness: .14 }),
        rail: new THREE.MeshStandardMaterial({ color: 0x8d9db0, metalness: .65, roughness: .38 }),
        foliage: new THREE.MeshStandardMaterial({ color: 0x79a8a2, roughness: .9 }),
        ground: new THREE.MeshStandardMaterial({ color: 0xd4e2ef, roughness: .97 }),
      };
      const box = (w: number, h: number, d: number, x: number, y: number, z: number, material: Material, parent: Object3D = world, radius = .04) => {
        const mesh = new THREE.Mesh(new RoundedBoxGeometry(w, h, d, 2, Math.min(radius, w / 3, h / 3, d / 3)), material);
        mesh.position.set(x, y, z); mesh.castShadow = true; mesh.receiveShadow = true; parent.add(mesh); return mesh;
      };

      // A floating architectural model, built entirely from WebGL geometry.
      box(8.1, .35, 5.9, 0, -.68, 0, colors.green, world, .16);
      box(7.98, .1, 5.78, 0, -.46, 0, colors.ground, world, .12);
      box(1.1, .012, 5.7, -.7, -.397, 0, colors.ivory);
      box(7.8, .012, .75, 0, -.39, .13, colors.ivory);
      for (let i = 0; i < 7; i++) box(.1, .015, .35, -.7, -.38, -2.4 + i * .78, colors.ground);

      // Elliptical elevated railway, including deck, rails, and piers.
      const deckShape = new THREE.Shape();
      deckShape.absellipse(0, 0, 3.48, 2.18, 0, Math.PI * 2, false, 0);
      const hole = new THREE.Path();
      hole.absellipse(0, 0, 2.72, 1.42, 0, Math.PI * 2, true, 0);
      deckShape.holes.push(hole);
      const deck = new THREE.Mesh(new THREE.ExtrudeGeometry(deckShape, { depth: .18, bevelEnabled: true, bevelSegments: 2, steps: 1, bevelSize: .025, bevelThickness: .025, curveSegments: 80 }), colors.ivory);
      deck.rotation.x = -Math.PI / 2; deck.position.y = .67;
      deck.castShadow = true; deck.receiveShadow = true; world.add(deck);
      const makeCurve = (rx: number, rz: number, y: number) => new THREE.CatmullRomCurve3(Array.from({ length: 96 }, (_, i) => {
        const t = i / 96 * Math.PI * 2;
        return new THREE.Vector3(rx * Math.cos(t), y, rz * Math.sin(t));
      }), true, 'catmullrom', .5);
      for (const offset of [-.17, .17]) {
        const rail = new THREE.Mesh(new THREE.TubeGeometry(makeCurve(3.1 + offset, 1.8 + offset, .88), 180, .022, 5, true), colors.rail);
        world.add(rail);
      }
      for (let i = 0; i < 12; i++) {
        const t = i / 12 * Math.PI * 2;
        box(.2, 1.07, .23, 3.1 * Math.cos(t), .12, 1.8 * Math.sin(t), colors.ivory);
      }
      const loop = makeCurve(3.1, 1.8, 1.105);

      // Windows and stepped roofs give the miniature skyline an architectural rhythm.
      const buildings = [
        [-1.8, -.47, .68, 1.28, .7, 'green'], [.45, -.56, .72, 1.63, .66, 'ivory'],
        [1.48, -.34, .62, .99, .62, 'green'], [-1.6, .65, .62, .72, .5, 'ivory'],
        [.5, .55, .65, .52, .6, 'lime'], [2.95, -1.55, .5, 1.05, .52, 'green'],
      ] as const;
      for (const [x, z, w, h, d, shade] of buildings) {
        box(w, h, d, x, -.37 + h / 2, z, colors[shade]);
        box(w * .65, .12, d * .62, x, -.31 + h, z, colors[shade]);
        for (let level = 0; level < Math.floor(h / .27); level++) {
          box(w * .74, .065, .015, x, -.13 + level * .25, z + d / 2 + .005, colors.glass);
          box(.015, .065, d * .7, x + w / 2 + .005, -.13 + level * .25, z, colors.glass);
        }
      }
      const treeLocations = [[-2.25, .45], [-.2, -.95], [1.9, .35], [2.8, .6], [-3.3, -1.6], [-2.1, -2.45], [1.7, 2.5], [-1.55, 2.5]];
      for (const [x, z] of treeLocations) {
        box(.065, .38, .065, x, -.17, z, colors.dark, world, .01);
        const crown = new THREE.Mesh(new THREE.IcosahedronGeometry(.3, 1), colors.foliage);
        crown.scale.set(.85, 1.25, .85); crown.position.set(x, .18, z); crown.castShadow = true; world.add(crown);
      }
      // Station platform and canopy beside the foreground track.
      box(1.7, .12, .5, .25, .81, 2.28, colors.green);
      box(1.9, .09, .73, .25, 1.67, 2.25, colors.lime);
      for (const x of [-.45, .95]) box(.035, .83, .04, x, 1.24, 2.43, colors.dark, world, .004);
      box(.44, .24, .04, .25, 1.45, 2.5, colors.dark);
      box(.25, .06, .01, .25, 1.45, 2.526, colors.lime);

      const coaches: Group[] = [];
      for (let i = 0; i < 3; i++) {
        const coach = new THREE.Group();
        box(.39, .35, .83, 0, 0, 0, colors.silver, coach, .09);
        box(.398, .07, .68, 0, -.095, 0, colors.green, coach, .018);
        box(.29, .04, .56, 0, .184, 0, colors.ivory, coach, .02);
        for (const side of [-1, 1]) {
          for (let j = 0; j < 3; j++) box(.012, .12, .145, side * .198, .045, -.245 + j * .235, colors.glass, coach, .016);
          for (const z of [-.23, .23]) box(.025, .065, .12, side * .16, -.2, z, colors.dark, coach, .02);
        }
        box(.28, .135, .016, 0, .034, .406, colors.glass, coach, .026);
        if (i === 0) {
          box(.25, .027, .02, 0, -.071, .409, colors.lime, coach, .009);
        }
        world.add(coach); coaches.push(coach);
      }

      let rotationTarget = .12;
      let hoverX = 0;
      let hoverY = 0;
      let dragging = false;
      let previousX = 0;
      let isVisible = true;
      let travel = .16;
      let previousTime = 0;
      let frame = 0;
      let needsRender = true;

      const resize = () => {
        if (!element.clientWidth || !element.clientHeight) return;
        const aspect = element.clientWidth / element.clientHeight;
        const halfHeight = aspect < .9 ? 5.15 : 4.35;
        camera.left = -halfHeight * aspect; camera.right = halfHeight * aspect;
        camera.top = halfHeight; camera.bottom = -halfHeight; camera.updateProjectionMatrix();
        renderer.setSize(element.clientWidth, element.clientHeight);
        needsRender = true;
      };
      const resizeObserver = new ResizeObserver(resize); resizeObserver.observe(element); resize();
      const visibleObserver = new IntersectionObserver(([entry]) => { isVisible = entry.isIntersecting; needsRender = true; }, { rootMargin: '100px' });
      visibleObserver.observe(element);
      const down = (event: PointerEvent) => { dragging = true; previousX = event.clientX; if (event.pointerType === 'mouse') element.setPointerCapture(event.pointerId); };
      const move = (event: PointerEvent) => {
        const rect = element.getBoundingClientRect();
        hoverX = (event.clientX - rect.left) / rect.width - .5;
        hoverY = (event.clientY - rect.top) / rect.height - .5;
        if (dragging) { rotationTarget += (event.clientX - previousX) * .008; previousX = event.clientX; }
        needsRender = true;
      };
      const up = () => { dragging = false; };
      const leave = () => { hoverX = 0; hoverY = 0; dragging = false; needsRender = true; };
      const rotate = (amount: number) => { rotationTarget += amount; needsRender = true; };
      const reset = () => { rotationTarget = .12; hoverX = 0; hoverY = 0; needsRender = true; };
      const keydown = (event: KeyboardEvent) => {
        if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') { event.preventDefault(); rotate(event.key === 'ArrowLeft' ? -.3 : .3); }
        if (event.key === 'Home') { event.preventDefault(); reset(); }
      };
      element.addEventListener('pointerdown', down);
      element.addEventListener('pointermove', move);
      element.addEventListener('pointerup', up);
      element.addEventListener('pointercancel', up);
      element.addEventListener('pointerleave', leave);
      element.addEventListener('keydown', keydown);
      const contextLost = (event: Event) => { event.preventDefault(); setFailed(true); setReady(false); };
      renderer.domElement.addEventListener('webglcontextlost', contextLost);
      controller.current = { rotate, reset };

      const render = (time: number) => {
        if (disposed) return;
        frame = requestAnimationFrame(render);
        const delta = Math.min((time - previousTime) / 1000, .05);
        if (time - previousTime < 32) return;
        previousTime = time;
        if (!isVisible || document.hidden) return;
        const animate = motionRef.current;
        if (animate) travel = (travel + delta * .028) % 1;
        const desiredY = rotationTarget + (animate ? hoverX * .07 : 0);
        const desiredX = animate ? hoverY * .025 : 0;
        const settling = Math.abs(world.rotation.y - desiredY) > .0001 || Math.abs(world.rotation.x - desiredX) > .0001;
        if (!animate && !settling && !needsRender) return;
        world.rotation.y += (desiredY - world.rotation.y) * (animate ? .09 : 1);
        world.rotation.x += (desiredX - world.rotation.x) * (animate ? .09 : 1);
        coaches.forEach((coach, i) => {
          const position = (travel - i * .048 + 1) % 1;
          coach.position.copy(loop.getPointAt(position));
          const tangent = loop.getTangentAt(position);
          coach.rotation.y = Math.atan2(tangent.x, tangent.z);
        });
        renderer.render(scene, camera); needsRender = false;
      };
      frame = requestAnimationFrame(render);
      setReady(true);
      cleanup = () => {
        cancelAnimationFrame(frame); resizeObserver.disconnect(); visibleObserver.disconnect();
        element.removeEventListener('pointerdown', down); element.removeEventListener('pointermove', move);
        element.removeEventListener('pointerup', up); element.removeEventListener('pointercancel', up);
        element.removeEventListener('pointerleave', leave); element.removeEventListener('keydown', keydown);
        renderer.domElement.removeEventListener('webglcontextlost', contextLost);
        const geometries = new Set<BufferGeometry>();
        scene.traverse(object => { if (object instanceof THREE.Mesh) geometries.add(object.geometry); });
        geometries.forEach(geometry => geometry.dispose());
        Object.values(colors).forEach(material => material.dispose());
        renderer.dispose(); renderer.domElement.remove(); controller.current = null;
      };
    }
    createScene().catch(() => { if (!disposed) setFailed(true); });
    return () => { disposed = true; cleanup(); };
  }, []);

  return (
    <div className={`hero-art transit-world ${ready ? 'scene-ready' : ''}`}>
      <img className="scene-fallback" src="/images/transit-city.png" alt="Conceptual architectural model of a city connected by an elevated metro railway" width="1536" height="1024" fetchPriority="high" />
      {!failed && <div ref={host} className="scene-canvas" role="img" tabIndex={0} aria-label="Interactive 3D transit model. Drag horizontally or use left and right arrow keys to rotate. Press Home to reset." />}
      <div className="scene-topline mono"><span><span className="status-dot" /> A CITY IN MOTION</span><span>YVR / 01</span></div>
      <div className="scene-note mono">SMALL IDEAS.<br />REAL CONNECTIONS.</div>
      {ready && <div className="scene-controls"><span className="mono">DRAG TO EXPLORE</span><button aria-label="Rotate model left" onClick={() => controller.current?.rotate(-.35)}>Left</button><button aria-label="Reset model view" onClick={() => controller.current?.reset()}>Reset</button><button aria-label="Rotate model right" onClick={() => controller.current?.rotate(.35)}>Right</button></div>}
      <div className="scene-bottom"><span className="scene-ticket mono">NEXT STOP<span>A better way forward.</span></span></div>
    </div>
  );
}
