import { useEffect, useRef, useState } from 'react';

const CATEGORIES = [
  { key: 'all', label: 'All Skills', icon: 'fa-solid fa-layer-group' },
  { key: 'frontend', label: 'Frontend', icon: 'fa-solid fa-laptop-code' },
  { key: 'backend', label: 'Backend', icon: 'fa-solid fa-server' },
  { key: 'ai', label: 'AI Skills', icon: 'fa-solid fa-brain' },
  { key: 'devtools', label: 'Dev Tools', icon: 'fa-solid fa-screwdriver-wrench' },
];

const SKILLS = [
  { icon: 'fa-brands fa-html5', label: 'HTML5', pct: 95, cat: 'frontend' },
  { icon: 'fa-brands fa-css3-alt', label: 'CSS3', pct: 90, cat: 'frontend' },
  { icon: 'fa-brands fa-square-js', label: 'JavaScript', pct: 82, cat: 'frontend' },
  { icon: 'fa-brands fa-react', label: 'React', pct: 80, cat: 'frontend' },
  { icon: 'fa-brands fa-tailwind-css', label: 'Tailwind', pct: 85, cat: 'frontend' },
  { icon: 'fa-brands fa-bootstrap', label: 'Bootstrap', pct: 88, cat: 'frontend' },
  { icon: 'fa-brands fa-node-js', label: 'Node.js', pct: 75, cat: 'backend' },
  { icon: 'fa-solid fa-server', label: 'Express.js', pct: 75, cat: 'backend' },
  { icon: 'fa-solid fa-database', label: 'MongoDB', pct: 80, cat: 'backend' },
  { icon: 'fa-solid fa-code-branch', label: 'REST APIs', pct: 75, cat: 'backend' },
  { icon: 'fa-brands fa-claude', label: 'Claude', pct: 88, cat: 'ai' },
  { icon: 'fa-solid fa-code', label: 'GitHub Copilot', pct: 83, cat: 'ai' },
  { icon: 'fa-solid fa-brain', label: 'AI Integration', pct: 88, cat: 'ai' },
  { icon: 'fa-solid fa-comment-dots', label: 'Prompt Eng.', pct: 80, cat: 'ai' },
  { icon: 'fa-brands fa-openai', label: 'OpenAI API', pct: 72, cat: 'ai' },
  { icon: 'fa-brands fa-git-alt', label: 'Git', pct: 85, cat: 'devtools' },
  { icon: 'fa-brands fa-github', label: 'GitHub', pct: 85, cat: 'devtools' },
  { icon: 'fa-solid fa-rocket', label: 'Netlify', pct: 82, cat: 'devtools' },
  { icon: 'fa-brands fa-digital-ocean', label: 'Render', pct: 75, cat: 'devtools' },

];

const CAT_BADGE = {
  frontend: 'bg-cyan/10 text-[#67e8f9] border-cyan/25',
  backend: 'bg-purple/15 text-[#c084fc] border-purple/35',
  devtools: 'bg-yellow-400/10 text-[#fbbf24] border-yellow-400/25',
  ai: 'bg-green-500/10 text-[#4ade80] border-green-500/25',
};

const CAT_FILTER_COLOR = {
  all: { active: 'rgba(255,255,255,', glow: 'rgba(255,255,255,' },
  frontend: { active: 'rgba(0,247,255,', glow: 'rgba(0,247,255,' },
  backend: { active: 'rgba(168,85,247,', glow: 'rgba(168,85,247,' },
  devtools: { active: 'rgba(251,191,36,', glow: 'rgba(251,191,36,' },
  ai: { active: 'rgba(74,222,128,', glow: 'rgba(74,222,128,' },
};

const CAT_LABEL = { frontend: 'Frontend', backend: 'Backend', devtools: 'Dev Tools', ai: 'AI' };

function SkillCard({ icon, label, pct, cat }) {
  const canvasRef = useRef(null);
  const animRef = useRef(null);
  const glowRef = useRef(null);
  const borderRef = useRef(null);
  const labelRef = useRef(null);
  const pctRef = useRef(null);
  const cardRef = useRef(null);
  const CAT_GLOW = {
    frontend: { r: '0,247,255', name: 'cyan' },
    backend: { r: '168,85,247', name: 'purple' },
    devtools: { r: '251,191,36', name: 'orange' },
    ai: { r: '74,222,128', name: 'green' },
  };
  const curPct = useRef(0);
  const tgtPct = useRef(0);



  const cc = CAT_GLOW[cat] || CAT_GLOW.frontend;

  const draw = (p) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const W = canvas.width, H = canvas.height, cx = W / 2, cy = H / 2, r = W / 2 - 6;
    ctx.clearRect(0, 0, W, H);
    ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(168,85,247,0.2)'; ctx.lineWidth = 5;
    ctx.setLineDash([3, 5]); ctx.stroke();
    if (p <= 0) return;
    const endAngle = -Math.PI / 2 + (Math.PI * 2 * p / 100);
    const grad = ctx.createLinearGradient(0, 0, W, H);
    grad.addColorStop(0, '#a855f7'); grad.addColorStop(1, '#00f7ff');
    ctx.beginPath(); ctx.arc(cx, cy, r, -Math.PI / 2, endAngle);
    ctx.strokeStyle = 'rgba(168,85,247,0.25)'; ctx.lineWidth = 9; ctx.setLineDash([3, 5]); ctx.lineCap = 'butt'; ctx.stroke();
    ctx.beginPath(); ctx.arc(cx, cy, r, -Math.PI / 2, endAngle);
    ctx.strokeStyle = 'rgba(0,247,255,0.2)'; ctx.lineWidth = 7; ctx.setLineDash([3, 5]); ctx.stroke();
    ctx.beginPath(); ctx.arc(cx, cy, r, -Math.PI / 2, endAngle);
    ctx.strokeStyle = grad; ctx.lineWidth = 5; ctx.setLineDash([3, 5]); ctx.stroke();
    const tipX = cx + r * Math.cos(endAngle), tipY = cy + r * Math.sin(endAngle);
    ctx.beginPath(); ctx.arc(tipX, tipY, 3, 0, Math.PI * 2);
    ctx.fillStyle = '#00f7ff'; ctx.setLineDash([]);
    ctx.shadowColor = 'rgba(0,247,255,0.9)'; ctx.shadowBlur = 8; ctx.fill(); ctx.shadowBlur = 0;
  };

  const animLoop = () => {
    const diff = tgtPct.current - curPct.current;
    if (Math.abs(diff) < 0.3) { curPct.current = tgtPct.current; draw(curPct.current); return; }
    curPct.current += diff * 0.08; draw(curPct.current);
    animRef.current = requestAnimationFrame(animLoop);
  };

  useEffect(() => { draw(0); return () => cancelAnimationFrame(animRef.current); }, []);

  const onEnter = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left, y = e.clientY - rect.top;
    const cx = x / rect.width - 0.5, cy = y / rect.height - 0.5;
    cardRef.current.style.transform =
      `perspective(600px) rotateX(${-cy * 20}deg) rotateY(${cx * 20}deg) translateY(-8px) scale(1.05)`;
    cardRef.current.style.setProperty('--mx', `${x}px`);
    cardRef.current.style.setProperty('--my', `${y}px`);

    // Glow + border ON
    if (glowRef.current) {
      glowRef.current.style.background = `radial-gradient(circle at 50% 50%, rgba(${cc.r},0.18), transparent 65%)`;
      glowRef.current.style.opacity = '1';
    }
    if (borderRef.current) {
      borderRef.current.style.boxShadow = `0 0 0 1px rgba(${cc.r},0.6), 0 0 20px rgba(${cc.r},0.15), inset 0 0 20px rgba(${cc.r},0.05)`;
      borderRef.current.style.opacity = '1';
    }
    // Text bright
    if (labelRef.current) labelRef.current.style.color = '#ffffff';
    if (pctRef.current) pctRef.current.style.opacity = '1';

    // Arc animate
    if (tgtPct.current !== pct) {
      tgtPct.current = pct;
      cancelAnimationFrame(animRef.current);
      animRef.current = requestAnimationFrame(animLoop);
    }
  };

  const onMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left, y = e.clientY - rect.top;
    const cx = x / rect.width - 0.5, cy = y / rect.height - 0.5;
    cardRef.current.style.transform =
      `perspective(600px) rotateX(${-cy * 20}deg) rotateY(${cx * 20}deg) translateY(-8px) scale(1.05)`;
    cardRef.current.style.setProperty('--mx', `${x}px`);
    cardRef.current.style.setProperty('--my', `${y}px`);
    if (glowRef.current)
      glowRef.current.style.background =
        `radial-gradient(circle at ${x}px ${y}px, rgba(${cc.r},0.18), transparent 65%)`;
  };

  const onLeave = () => {
    cardRef.current.style.transform = '';
    if (glowRef.current) { glowRef.current.style.opacity = '0'; }
    if (borderRef.current) { borderRef.current.style.opacity = '0'; }
    if (labelRef.current) { labelRef.current.style.color = '#64748b'; }
    if (pctRef.current) { pctRef.current.style.opacity = '0.5'; }
    tgtPct.current = 0;
    cancelAnimationFrame(animRef.current);
    animRef.current = requestAnimationFrame(animLoop);
  };

  return (
    <div
      ref={cardRef}
      className="skill-card relative flex flex-col items-center gap-1.5 rounded-[20px]
        p-[22px_18px_18px] text-center overflow-hidden border border-purple/25
        bg-white/[0.04] will-change-transform cursor-none"
      style={{ transformStyle: 'preserve-3d', transition: 'transform 0.15s ease' }}
      onMouseEnter={onEnter}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
    >
      {/* Category badge */}
      <span className={`absolute top-[10px] right-[10px] text-[9px] font-bold tracking-[0.4px]
        px-2 py-[2px] rounded-full uppercase border pointer-events-none z-[2] ${CAT_BADGE[cat]}`}>
        {CAT_LABEL[cat]}
      </span>

      {/* Icon */}
      <div className="text-[2rem] grad block relative z-[1] leading-none">
        <i className={icon} />
      </div>

      {/* Label */}
      <span ref={labelRef}
        className="font-display text-[0.75rem] font-bold tracking-[0.5px] relative z-[1]"
        style={{ color: '#64748b', transition: 'color 0.25s ease' }}>
        {label}
      </span>

      {/* Arc meter */}
      <div className="relative w-[60px] h-[60px] mt-1 z-[1]">
        <canvas ref={canvasRef} width={60} height={60} className="block w-[60px] h-[60px]" />
        <div ref={pctRef}
          className="absolute inset-0 flex items-center justify-center pointer-events-none
    font-display text-[0.62rem] font-black"
          style={{
            paddingBottom: 4,
            opacity: 0.5,
            transition: 'opacity 0.25s ease',
            background: 'linear-gradient(135deg,#a855f7,#00f7ff)',
            WebkitBackgroundClip: 'text',
            backgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}>
          {pct}%
        </div>
      </div>

      {/* Glow — JS controlled */}
      <div ref={glowRef}
        className="absolute inset-0 pointer-events-none rounded-[20px]"
        style={{
          opacity: 0,
          transition: 'opacity 0.3s ease',
          background: `radial-gradient(circle at 50% 50%, rgba(${cc.r},0.18), transparent 65%)`,
        }}
      />

      {/* Border glow — JS controlled */}

      <div ref={borderRef}
        className="absolute inset-0 pointer-events-none rounded-[20px] border-transparent"
        style={{
          opacity: 0,
          transition: 'opacity 0.3s ease',
          border: `2px solid rgba(${cc.r}, 0.5)`,
          boxShadow: `0 0 20px rgba(${cc.r},0.15), inset 0 0 20px rgba(${cc.r},0.05)`,
        }}
      />
    </div>
  );
}
export default function Skills() {
  const [activeFilter, setActiveFilter] = useState('all');
  const ref = useRef(null);
  const gridRef = useRef(null);

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        ref.current?.classList.add('on');
        gridRef.current?.querySelectorAll('.skill-card').forEach((card, i) => {
          setTimeout(() => { card.style.opacity = '1'; card.style.transform = 'translateY(0)'; }, i * 80);
        });
        obs.disconnect();
      }
    }, { threshold: 0.1 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  const filtered = activeFilter === 'all' ? SKILLS : SKILLS.filter(s => s.cat === activeFilter);

  return (
    <section id="skills" className="section reveal px-[8%] py-20 relative z-[2]" ref={ref}>
      <div className="font-display text-[0.7rem] tracking-[4px] uppercase text-cyan mb-4">03 — Skills</div>
      <h2 className="sec-title font-display font-black text-white mb-4 text-[clamp(2rem,5vw,3.5rem)] tracking-[-2px]">
        My <span>Toolkit</span>
      </h2>
      <p className="text-[0.96rem] text-[#64748b] mb-14">Frontend &amp; Backend technologies I'm working with</p>

      {/* Filter */}
      <div className="flex justify-center gap-2.5 mb-9 flex-wrap">
        {CATEGORIES.map(c => {
          const fc = CAT_FILTER_COLOR[c.key];
          const isActive = activeFilter === c.key;
          return (
            <button key={c.key}
              onClick={() => setActiveFilter(c.key)}
              className="inline-flex items-center gap-1.5 px-[22px] py-[9px] rounded-full border
        font-display text-[0.78rem] font-bold tracking-[0.5px] cursor-none"
              style={{
                borderColor: isActive ? `${fc.active}0.8)` : 'rgba(168,85,247,0.35)',
                background: isActive ? `${fc.active}0.12)` : 'rgba(168,85,247,0.07)',
                color: isActive ? `${fc.active}1)` : 'rgba(255,255,255,0.45)',
                boxShadow: isActive ? `0 0 0 1px ${fc.glow}0.7), 0 0 18px ${fc.glow}0.25)` : 'none',
                transition: 'all 0.25s ease',
              }}
              onMouseEnter={e => {
                if (isActive) return;
                e.currentTarget.style.borderColor = `${fc.active}0.6)`;
                e.currentTarget.style.color = `${fc.active}1)`;
                e.currentTarget.style.background = `${fc.active}0.07)`;
                e.currentTarget.style.boxShadow = `0 0 0 1px ${fc.glow}0.4), 0 0 12px ${fc.glow}0.15)`;
              }}
              onMouseLeave={e => {
                if (isActive) return;
                e.currentTarget.style.borderColor = 'rgba(168,85,247,0.35)';
                e.currentTarget.style.color = 'rgba(255,255,255,0.45)';
                e.currentTarget.style.background = 'rgba(168,85,247,0.07)';
                e.currentTarget.style.boxShadow = 'none';
              }}>
              <i className={`${c.icon} text-[13px]`} />
              {c.label}
            </button>
          );
        })}
      </div>

      {/* Grid */}
      <div ref={gridRef}
        className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-[18px] max-w-[920px] mx-auto">
        {filtered.map(s => <SkillCard key={`${s.cat}-${s.label}`} {...s} />)}
      </div>

      {/* Stack note */}
      <div className="stack-note flex items-center gap-2.5 max-w-[920px] mx-auto mt-7 px-[22px] py-4
        bg-cyan/[0.04] border border-cyan/15 rounded-[14px] text-[0.88rem] text-[#64748b]">
        <i className="fa-solid fa-fire text-cyan" />
        <span>Already <strong className="text-white">1+ year</strong> in the game —{' '}
          <strong className="text-white">Node.js, Express &amp; MongoDB</strong> in production. Full stack, fully committed. 🚀</span>
      </div>
    </section>
  );
}
