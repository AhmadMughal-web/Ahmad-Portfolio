import { useState, useEffect, useRef } from 'react';

const PHRASES = [
  ' Full Stack Developer',
  ' AI-Powered Builder',
  ' React Specialist',
  ' Backend Architect',
  ' Problem Destroyer',
  ' Future-Ready Dev',
];

export default function Hero() {
  const [typed, setTyped] = useState('');
  const state = useRef({ pi: 0, ci: 0, del: false });
  const canvasRef = useRef(null);
  const mouse = useRef({ x: 0.5, y: 0.5 });
  const rafRef = useRef(null);

  useEffect(() => {
    let timer;
    const tick = () => {
      const s = state.current;
      const cur = PHRASES[s.pi];
      if (s.del) { if (s.ci > 0) s.ci--; }
      else { if (s.ci < cur.length) s.ci++; }
      setTyped(cur.substring(0, s.ci));
      let spd = s.del ? 48 : 86;
      if (!s.del && s.ci === cur.length) { spd = 1600; s.del = true; }
      else if (s.del && s.ci === 0) { s.del = false; s.pi = (s.pi + 1) % PHRASES.length; spd = 400; }
      timer = setTimeout(tick, spd);
    };
    timer = setTimeout(tick, 600);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const onMove = e => {
      mouse.current.x = e.clientX / window.innerWidth;
      mouse.current.y = e.clientY / window.innerHeight;
    };
    window.addEventListener('mousemove', onMove, { passive: true });
    return () => window.removeEventListener('mousemove', onMove);
  }, []);

  useEffect(() => {
    const cvs = canvasRef.current;
    if (!cvs) return;
    const ctx = cvs.getContext('2d');
    let t = 0, running = true;
    const DPR = Math.min(window.devicePixelRatio || 1, 1);

    const resize = () => {
      cvs.width = cvs.offsetWidth * DPR;
      cvs.height = cvs.offsetHeight * DPR;
      cvs.style.width = cvs.offsetWidth + 'px';
      cvs.style.height = cvs.offsetHeight + 'px';
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(cvs);

    const W = () => cvs.width / DPR;
    const H = () => cvs.height / DPR;

    const mkParticle = () => ({
      x: Math.random() * W(),
      y: Math.random() * H(),
      vy: 0.18 + Math.random() * 0.55,
      vx: (Math.random() - 0.5) * 0.12,
      r: 1 + Math.random() * 2.2,
      alpha: 0,
      maxAlpha: 0.45 + Math.random() * 1,
      phase: Math.random() * Math.PI * 2,
      color: Math.random() < 0.6 ? 'cyan' : 'purple',
      life: 0,
      maxLife: 180 + Math.floor(Math.random() * 240),
    });

    const particles = Array.from({ length: 55 }, mkParticle);
    particles.forEach(p => {
      p.alpha = Math.random() * p.maxAlpha;
      p.life = Math.random() * p.maxLife;
    });

    const orbCvs = document.createElement('canvas');
    const buildOrbs = () => {
      orbCvs.width = W(); orbCvs.height = H();
      const oc = orbCvs.getContext('2d');
      [
        { cx: 0.12, cy: 0.2, r: 0.32, c: 'rgba(88,28,220,0.18)' },
        { cx: 0.88, cy: 0.75, r: 0.28, c: 'rgba(0,180,220,0.14)' },
        { cx: 0.5, cy: 0.5, r: 0.22, c: 'rgba(168,85,247,0.09)' },
      ].forEach(o => {
        const g = oc.createRadialGradient(o.cx * W(), o.cy * H(), 0, o.cx * W(), o.cy * H(), o.r * Math.min(W(), H()));
        g.addColorStop(0, o.c); g.addColorStop(1, 'transparent');
        oc.fillStyle = g; oc.fillRect(0, 0, W(), H());
      });
    };
    buildOrbs();

    const REPEL_R = 130;

    const draw = () => {
      if (!running) return;
      t += 0.016;
      const w = W(), h = H();
      const mx = mouse.current.x * w;
      const my = mouse.current.y * h;
      ctx.clearRect(0, 0, w, h);
      ctx.drawImage(orbCvs, 0, 0);

      const mg = ctx.createRadialGradient(mx, my, 0, mx, my, REPEL_R);
      mg.addColorStop(0, 'rgba(0,247,255,0.07)');
      mg.addColorStop(0.5, 'rgba(168,85,247,0.03)');
      mg.addColorStop(1, 'transparent');
      ctx.fillStyle = mg; ctx.fillRect(0, 0, w, h);

      const dx = p.x - mx, dy = p.y - my;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < REPEL_R) {
        const force = (1 - dist / REPEL_R) * 0.6;
        p.x += (dx / dist) * force; p.y += (dy / dist) * force;
      }
      p.x += p.vx + Math.sin(t * 0.4 + p.phase) * 0.18;
      p.y += p.vy;
      p.life++;
      const lr = p.life / p.maxLife;
      if (lr < 0.15) p.alpha = (lr / 0.15) * p.maxAlpha;
      else if (lr < 0.75) p.alpha = p.maxAlpha;
      else p.alpha = ((1 - lr) / 0.25) * p.maxAlpha;
      if (p.life >= p.maxLife || p.y > h + 30 || p.x < -40 || p.x > w + 40)
        Object.assign(p, mkParticle(), { y: -20, alpha: 0, life: 0 });
      if (p.alpha < 0.01) return;

      const wobble = Math.sin(t * 1.2 + p.phase) * 0.06;
      ctx.save();
      ctx.translate(p.x, p.y); ctx.rotate(wobble);

      // Outer glow
      const gr = ctx.createRadialGradient(0, 0, 0, 0, 0, p.r * 5);
      gr.addColorStop(0, p.color === 'cyan'
        ? `rgba(0,247,255,${(p.alpha * 0.45).toFixed(3)})`
        : `rgba(168,85,247,${(p.alpha * 0.45).toFixed(3)})`);
      gr.addColorStop(1, 'transparent');
      ctx.beginPath(); ctx.arc(0, 0, p.r * 5, 0, Math.PI * 2);
      ctx.fillStyle = gr; ctx.fill();

      // Core dot
      ctx.beginPath(); ctx.arc(0, 0, p.r, 0, Math.PI * 2);
      ctx.fillStyle = p.color === 'cyan'
        ? `rgba(0,247,255,${p.alpha.toFixed(3)})`
        : `rgba(200,100,255,${p.alpha.toFixed(3)})`;
      ctx.fill();

      ctx.restore();

      for (let y = 0; y < h; y += 5) {
        ctx.fillStyle = 'rgba(0,0,0,0.018)';
        ctx.fillRect(0, y, w, 1);
      }
      rafRef.current = requestAnimationFrame(draw);
    };

    ctx.fillStyle = 'rgb(2,4,8)';
    ctx.fillRect(0, 0, cvs.width, cvs.height);
    rafRef.current = requestAnimationFrame(draw);

    const obs = new IntersectionObserver(([e]) => {
      running = e.isIntersecting;
      if (running) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = requestAnimationFrame(draw);
      } else {
        cancelAnimationFrame(rafRef.current);
      }
    }, { threshold: 0 });
    obs.observe(cvs);

    return () => {
      cancelAnimationFrame(rafRef.current);
      obs.disconnect();
      ro.disconnect();
    };
  }, []);

  const scrollTo = id => {
    const el = document.getElementById(id);
    if (el) window.scrollTo({ top: el.offsetTop - 10, behavior: 'smooth' });
  };

  return (
    <section id="home" className="relative min-h-screen flex flex-col
      items-center justify-center text-center px-5 overflow-hidden z-[1]">
      <style>{`
        @keyframes nameSlide{0%{background-position:0% 0%}100%{background-position:200% 0%}}
        .name-grad{
          background:linear-gradient(90deg,#00f7ff,#a855f7,#fff,#00f7ff,#a855f7);
          background-size:300% 100%;
          -webkit-background-clip:text;background-clip:text;
          -webkit-text-fill-color:transparent;
          animation:nameSlide 3s linear infinite;display:inline-block;
        }
        @keyframes bPulse{0%,100%{opacity:1;transform:scale(1)}50%{opacity:.5;transform:scale(1.5)}}
        .badge-dot{animation:bPulse 2s infinite;}
        @keyframes blink{0%,100%{opacity:1}50%{opacity:0}}
        .blink{animation:blink 1s infinite;}
        @keyframes fadeUp{from{opacity:0;transform:translateY(32px)}to{opacity:1;transform:translateY(0)}}
        .fu1{animation:fadeUp 0.8s ease both 0.3s}
        .fu2{animation:fadeUp 1s ease both 0.5s}
        .fu3{animation:fadeUp 1s ease both 1.1s}
        @keyframes sPulse{0%,100%{opacity:.3;transform:scaleY(1)}50%{opacity:1;transform:scaleY(1.2)}}
        .spulse{animation:sPulse 2s ease-in-out infinite;}
      `}</style>

      <canvas ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none z-[1]" />

      <div className="absolute inset-0 pointer-events-none z-[2]"
        style={{ background: 'radial-gradient(ellipse 70% 70% at 50% 50%,transparent 20%,rgba(2,4,8,0.45) 60%,rgba(2,4,8,0.88) 100%)' }} />

      <div className="fu1 relative z-[3] inline-flex items-center gap-2 px-[18px] py-[6px]
        border border-white/[0.08] rounded-full bg-white/[0.04] backdrop-blur-[10px]
        text-[0.74rem] font-medium tracking-[1px] text-[#64748b] mb-7">
        <span className="badge-dot w-[7px] h-[7px] rounded-full bg-[#22c55e] [box-shadow:0_0_8px_#22c55e]" />
        Available for Work — Full Stack Dev &amp; AI Integration
      </div>

      <div className="fu2 relative z-[3]">
        <p className="font-display text-[0.85rem] tracking-[3px] uppercase text-[#64748b] mb-4">Hello World 👋</p>
        <h1 className="font-display font-black leading-none tracking-[-3px] text-white mb-4 text-[clamp(3rem,8vw,7rem)]">
          I'm <span className="name-grad">M.Ahmad</span>
        </h1>
        <div className="font-display text-cyan tracking-[1px] mb-5 min-h-[2rem] text-[clamp(0.9rem,2.5vw,1.3rem)]">
          <span>{typed}</span><span className="blink text-purple">|</span>
        </div>
        <p className="text-[0.96rem] text-[#64748b] max-w-[440px] mx-auto mb-10 leading-[1.78]">
          Building modern web experiences — where clean code meets{' '}
          <strong className="text-cyan font-medium">AI innovation</strong>.
        </p>

        {/* Buttons */}
        <div className="flex gap-4 justify-center flex-wrap">
          <a href="./images/resume.pdf" download className="btn btn-p">
            <i className="fa-solid fa-download" /> Resume
          </a>
          <button className="btn btn-g" onClick={() => scrollTo('projects')}>
            View Work <i className="fa-solid fa-down-long" />
          </button>
          <button className="btn btn-C" onClick={() => scrollTo('certificates')}>
            <i className="fa-solid fa-graduation-cap" /> Certificates
          </button>
        </div>
      </div>

      <div className="fu3 absolute bottom-5 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-[3] text-[#64748b] text-[0.66rem] tracking-[2px] uppercase">
        <div className="spulse w-px h-[46px]" style={{ background: 'linear-gradient(to bottom,transparent,#00f7ff)' }} />
        <span>Scroll</span>
      </div>
    </section>
  );
}