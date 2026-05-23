import { useEffect, useRef } from 'react';

export default function Stars() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const cvs = canvasRef.current;
    if (!cvs) return;
    const ctx = cvs.getContext('2d');
    let raf, t = 0;
    let running = true; // ← pause control

    const resize = () => {
      // Fix 2 — devicePixelRatio cap at 1.5
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      cvs.width = window.innerWidth * dpr;
      cvs.height = window.innerHeight * dpr;
      cvs.style.width = window.innerWidth + 'px';
      cvs.style.height = window.innerHeight + 'px';
      ctx.scale(dpr, dpr);
    };
    resize();
    window.addEventListener('resize', resize, { passive: true });

    const STARS = Array.from({ length: 160 }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      size: Math.random() * 1.6 + 0.3,
      phase: Math.random() * Math.PI * 2,
      speed: Math.random() * 5.1 + 3.2,
    }));

    const PTS = Array.from({ length: 65 }, () => ({
      x: Math.random(),
      y: Math.random(),
      // Connection stars ke speed ko slow krne ke leye
      vx: (Math.random() - 0.5) * 0.00030,
      vy: (Math.random() - 0.5) * 0.00030,
      size: Math.random() * 2.5 + 1.0,
      alpha: Math.random() * 0.4 + 0.55,
      color: Math.random() < 0.5 ? 'cyan' : 'purple',
      phase: Math.random() * Math.PI * 2,
    }));

    // Orbs — ek baar offscreen canvas pe draw karo
    const orbCvs = document.createElement('canvas');
    const drawOrbs = () => {
      orbCvs.width = window.innerWidth;
      orbCvs.height = window.innerHeight;
      const oc = orbCvs.getContext('2d');
      [
        { x: -100, y: -100, r: 400, c: 'rgba(88,28,220,0.22)' },
        { x: window.innerWidth + 80, y: window.innerHeight, r: 350, c: 'rgba(0,180,220,0.18)' },
        { x: window.innerWidth * 0.5, y: window.innerHeight * 0.4, r: 280, c: 'rgba(168,85,247,0.1)' },
      ].forEach(o => {
        const g = oc.createRadialGradient(o.x, o.y, 0, o.x, o.y, o.r);
        g.addColorStop(0, o.c); g.addColorStop(1, 'transparent');
        oc.fillStyle = g; oc.fillRect(0, 0, orbCvs.width, orbCvs.height);
      });
    };
    drawOrbs();
    window.addEventListener('resize', drawOrbs, { passive: true });

    const draw = () => {
      if (!running) { raf = requestAnimationFrame(draw); return; } // ← paused
      t += 0.013;
      const W = window.innerWidth, H = window.innerHeight;
      ctx.clearRect(0, 0, W, H);

      // Orbs — offscreen se copy
      ctx.drawImage(orbCvs, 0, 0);

      // Stars
      STARS.forEach(s => {
        const alpha = (Math.sin(t * s.speed + s.phase) * 0.5 + 0.5) * 0.95;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${alpha.toFixed(2)})`;
        ctx.fill();
      });

      // Move particles
      PTS.forEach(p => {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0) p.x = 1; if (p.x > 1) p.x = 0;
        if (p.y < 0) p.y = 1; if (p.y > 1) p.y = 0;
      });

      // Connection lines
      for (let i = 0; i < PTS.length; i++) {
        for (let j = i + 1; j < PTS.length; j++) {
          const a = PTS[i], b = PTS[j];
          const dx = (a.x - b.x) * W, dy = (a.y - b.y) * H;
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d < 90) {
            const alpha = (1 - d / 90) * 0.78;
            const grd = ctx.createLinearGradient(a.x * W, a.y * H, b.x * W, b.y * H);
            grd.addColorStop(0, `rgba(0,247,255,${alpha})`);
            grd.addColorStop(1, `rgba(168,85,247,${alpha})`);
            ctx.beginPath();
            ctx.moveTo(a.x * W, a.y * H);
            ctx.lineTo(b.x * W, b.y * H);
            ctx.strokeStyle = grd; ctx.lineWidth = 0.7; ctx.stroke();
          }
        }
      }

      // Particle dots
      PTS.forEach(p => {
        const pulse = Math.sin(t * 2.2 + p.phase) * 0.35 + 0.65;
        ctx.beginPath();
        ctx.arc(p.x * W, p.y * H, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color === 'cyan'
          ? `rgba(0,247,255,${p.alpha * pulse})`
          : `rgba(168,85,247,${p.alpha * pulse})`;
        ctx.fill();
      });

      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);

    // ── Intersection Observer — pause/resume ──
    const obs = new IntersectionObserver(
      ([e]) => { running = e.isIntersecting; },
      { threshold: 0 }
    );
    obs.observe(cvs);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
      window.removeEventListener('resize', drawOrbs);
      obs.disconnect();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none z-0"
    />
  );
}