import { useEffect, useRef } from 'react';

export default function About() {
  const sectionRef = useRef(null);
  const cardRef = useRef(null);
  const canvasRef = useRef(null);
  const hintRef = useRef(null);
  const whyRef = useRef(null);

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        sectionRef.current?.classList.add('on');
        setTimeout(() => {
          if (hintRef.current) {
            hintRef.current.style.opacity = '1';
            hintRef.current.style.transition = 'opacity 0.5s ease';
            setTimeout(() => { if (hintRef.current) hintRef.current.style.opacity = '0'; }, 3000);
          }
        }, 500);
        obs.disconnect();
      }
    }, { threshold: 0.3 });
    if (sectionRef.current) obs.observe(sectionRef.current);

    const whyObs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { whyRef.current?.classList.add('on'); whyObs.disconnect(); }
    }, { threshold: 0.1 });
    if (whyRef.current) whyObs.observe(whyRef.current);

    return () => { obs.disconnect(); whyObs.disconnect(); };
  }, []);

  /* Elastic lanyard */
  useEffect(() => {
    const card = cardRef.current;
    const canvas = canvasRef.current;
    const wrap = canvas?.parentElement;
    if (!card || !canvas || !wrap) return;
    const ctx = canvas.getContext('2d');
    let cx = 0, cy = 0, vx = 0, vy = 0, isDragging = false, dragStartX, dragStartY, raf;

    const resize = () => { canvas.width = wrap.offsetWidth; canvas.height = wrap.offsetHeight; };
    resize();
    window.addEventListener('resize', resize);

    const onDown = e => { isDragging = true; dragStartX = e.clientX - cx; dragStartY = e.clientY - cy; vx = 0; vy = 0; e.preventDefault(); };
    const onMove = e => { if (!isDragging) return; cx = e.clientX - dragStartX; cy = e.clientY - dragStartY; };
    const onUp = () => { isDragging = false; };

    const animate = () => {
      if (!isDragging) { vx = vx * 0.88 - cx * 0.09; vy = vy * 0.88 - cy * 0.09 + 0.4; cx += vx; cy += vy; }
      card.style.transform = `translate(calc(-50% + ${cx}px), ${cy}px) rotate(${cx * 0.1}deg)`;
      card.style.transformOrigin = 'top center';
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const ax = canvas.width / 2, ay = 6;
      const wrapRect = wrap.getBoundingClientRect();
      const hole = card.querySelector('.card-hole');
      const holeRect = hole.getBoundingClientRect();
      const holeX = holeRect.left + holeRect.width / 2 - wrapRect.left;
      const holeY = holeRect.top + holeRect.height / 2 - wrapRect.top + 6;
      const cp1x = ax + (holeX - ax) * 0.1, cp1y = ay + (holeY - ay) * 0.5;
      const cp2x = holeX - (holeX - ax) * 0.1, cp2y = holeY - (holeY - ay) * 0.2;
      const grad = ctx.createLinearGradient(ax, ay, holeX, holeY);
      grad.addColorStop(0, 'rgba(0,247,255,1)'); grad.addColorStop(0.5, 'rgba(0,247,255,0.55)'); grad.addColorStop(1, 'rgba(0,247,255,1)');
      ctx.shadowColor = 'rgba(0,247,255,0.7)'; ctx.shadowBlur = 10;
      ctx.beginPath(); ctx.moveTo(ax, ay); ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, holeX, holeY);
      ctx.strokeStyle = grad; ctx.lineWidth = 2.5; ctx.lineCap = 'round'; ctx.stroke();
      ctx.beginPath(); ctx.arc(ax, ay, 5, 0, Math.PI * 2); ctx.fillStyle = 'rgba(0,247,255,0.95)'; ctx.shadowBlur = 16; ctx.fill();
      ctx.beginPath(); ctx.arc(holeX, holeY, 3.5, 0, Math.PI * 2); ctx.fillStyle = 'rgba(0,247,255,0.85)'; ctx.shadowBlur = 10; ctx.fill();
      ctx.shadowBlur = 0;
      raf = requestAnimationFrame(animate);
    };
    card.addEventListener('mousedown', onDown);
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
    raf = requestAnimationFrame(animate);
    return () => { card.removeEventListener('mousedown', onDown); window.removeEventListener('mousemove', onMove); window.removeEventListener('mouseup', onUp); window.removeEventListener('resize', resize); cancelAnimationFrame(raf); };
  }, []);

  const TAGS = ['Self-Taught', 'Fast Learner', 'Problem Solver', 'Open to Work'];
  const WHY = [
    { icon: 'fa-bolt', title: 'AI-Powered Developer', desc: "I don't just use AI — I build with it. Groq & Claude are already in my production apps. Most devs are still learning about it." },
    { icon: 'fa-layer-group', title: 'Full Stack, Real World', desc: 'Frontend to backend to deployment — I own the full pipeline. No half-finished projects, no excuses.' },
    { icon: 'fa-brain', title: 'Self-Taught & Hungry', desc: "No degree, no shortcuts — just obsession. Everything I know, I earned. That hunger doesn't stop." },
    { icon: 'fa-rocket', title: 'Fast. Clean. Scalable.', desc: "Clean code isn't optional for me — it's a habit. I write code that's easy to read, maintain and scale." },
  ];

  return (
    <section id="about" className="section reveal px-[8%] py-20 relative z-[2]" ref={sectionRef}>
      <div className="font-display text-[0.7rem] tracking-[4px] uppercase text-cyan mb-4">01 — About</div>
      <h2 className="sec-title font-display font-black text-white mb-14
        text-[clamp(2rem,5vw,3.5rem)] tracking-[-2px]">
        Who I <span>Am</span>
      </h2>

      {/* Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.35fr] gap-12 lg:gap-20 items-center max-w-[1100px] mx-auto">

        {/* ID Card */}
        <div className="relative flex justify-center items-start min-h-[420px]">
          <canvas ref={canvasRef} className="absolute top-0 left-0 w-full h-full pointer-events-none z-[2]" />
          <div ref={cardRef}
            className="id-card absolute top-20 left-1/2 w-[210px] z-[3] cursor-grab active:cursor-grabbing
              bg-[rgba(8,12,24,0.95)] border border-cyan/25 rounded-[18px] p-4 pb-6
              flex flex-col items-center gap-[10px] will-change-transform"
            style={{ boxShadow: '0 0 30px rgba(0,247,255,0.1),0 20px 60px rgba(0,0,0,0.6),inset 0 1px 0 rgba(255,255,255,0.05)' }}>
            <div className="card-hole w-[14px] h-[14px] rounded-full bg-[#020408] border-2 border-cyan/70 relative z-[4]"
              style={{ boxShadow: '0 0 10px rgba(0,247,255,0.6),inset 0 0 4px rgba(0,247,255,0.3)' }} />
            <div className="w-[125px] h-[150px] rounded-[10px] overflow-hidden border-2 border-cyan/20"
              style={{ background: 'linear-gradient(135deg,#1e1b4b,#0c4a6e)' }}>
              <img src="/images/my pic.jpeg" alt="M Ahmad"
                className="w-full h-full object-cover object-[center_20%] pointer-events-none block"
                onError={e => e.target.style.display = 'none'} />
            </div>
            <div className="flex flex-col items-center gap-1">
              <span className="font-display text-[0.95rem] font-black text-white">M Ahmad</span>
              <span className="text-[0.68rem] text-cyan tracking-[2px] uppercase">Full Stack Dev</span>
              <div className="flex items-center gap-1.5 mt-1 px-3 py-1 rounded-full
                bg-[rgba(34,197,94,0.1)] border border-[rgba(34,197,94,0.3)]
                text-[0.66rem] text-[#4ade80] font-semibold">
                <span className="w-[6px] h-[6px] rounded-full bg-[#22c55e] [box-shadow:0_0_6px_#22c55e]
                  animate-pulse" />
                Open to Work
              </div>
            </div>
          </div>
          <p ref={hintRef} className="absolute bottom-3 left-1/2 -translate-x-1/2 text-[0.65rem]
            text-cyan/90 tracking-[2px] uppercase whitespace-nowrap z-[5] opacity-0">
            ⟵ drag me ⟶
          </p>
        </div>

        {/* Text */}
        <div>
          <p className="font-display text-[0.74rem] tracking-[3px] uppercase text-cyan mb-5">
            Full Stack Dev &amp; AI Integration

          </p>
          <p className="text-[0.96rem] leading-[1.9] text-[#94a3b8]">
            I'm <strong className="text-white font-medium">M Ahmad</strong> — a{' '}
            <strong className="text-white font-medium">Full Stack Developer &amp; AI Integrated Web Apps</strong> who doesn't just write
            code, but builds <strong className="text-white font-medium">intelligent web experiences</strong>. Clean UI, solid backend, and real-world deployment — all in one.
          </p>
          <p className="text-[0.96rem] leading-[1.9] text-[#94a3b8] mt-4">
            While others are learning about AI,{' '}
            <strong className="text-white font-medium">I'm already building with it</strong> — integrating{' '}
            <strong className="text-white font-medium">Groq &amp; Claude</strong> into production apps. This portfolio itself runs a{' '}
            <strong className="text-white font-medium">live AI assistant</strong>. That's not a flex — that's my standard.
          </p>
          <p className="text-[0.96rem] leading-[1.9] text-[#94a3b8] mt-4">
            The next generation of tech belongs to developers who{' '}
            <strong className="text-white font-medium">code and think with AI</strong>. I'm not waiting for that future —{' '}
            <strong className="text-white font-medium">I'm building it.</strong>
          </p>

          {/* Stats */}
          <div className="grid grid-cols-3 mt-6 mb-5 rounded-[16px] w-full max-w-[420px]
  bg-cyan/[0.03] border border-purple/20 hover:bg-purple/[0.12] hover:border-purple/50
  transition-all duration-300 divide-x divide-purple/20">
            {[['25+', 'Projects'], ['1yr+', 'Experience'], ['100%', 'Dedication']].map(([num, label]) => (
              <div key={label} className="astat flex flex-col items-center gap-1 py-4 px-2">
                <span className="font-display text-[1.4rem] sm:text-[1.8rem] font-black leading-none grad">{num}</span>
                <span className="text-[0.6rem] sm:text-[0.7rem] font-semibold tracking-[1px] text-[#64748b] uppercase text-center">{label}</span>
              </div>
            ))}
          </div>

          {/* Tags */}
          <div className="about-tags flex flex-wrap gap-[10px] mt-8">
            {TAGS.map(t => (
              <span key={t} className="atag px-4 py-[6px] border border-white/[0.08] rounded-full
                bg-white/[0.04] font-display text-[0.74rem] font-semibold text-[#64748b]
                hover:border-cyan hover:text-white transition-all duration-300 cursor-none">
                {t}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Why Me */}
      <div className="whyme-wrap reveal mt-20 max-w-[920px] mx-auto" ref={whyRef}>
        <h3 className="text-[2rem] font-black text-white mb-10">
          Why You Should <span className="grad">Hire Me</span>
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-[18px] mb-10">
          {WHY.map(({ icon, title, desc }) => (
            <div key={title}
              className="whyme-card relative overflow-hidden rounded-[20px] p-7 border border-purple/20
                bg-white/[0.04] transition-all duration-300 cursor-pointer
                hover:-translate-y-1.5 hover:border-cyan/50
                hover:[box-shadow:0_0_0_1px_rgba(0,247,255,0.3),0_12px_40px_rgba(0,0,0,0.4)]">
              <div className="absolute inset-0 pointer-events-none"
                style={{ background: 'radial-gradient(circle at top left,rgba(168,85,247,0.06),transparent 60%)' }} />
              <div className="text-[1.4rem] mb-4 grad inline-block">
                <i className={`fa-solid ${icon}`} />
              </div>
              <h4 className="font-display text-[0.95rem] font-bold text-white mb-2">{title}</h4>
              <p className="text-[0.82rem] leading-[1.7] text-[#64748b]">{desc}</p>
            </div>
          ))}
        </div>
        <div className="flex flex-col items-center gap-4 mt-2">
          <span className="w-full h-px" style={{ background: 'linear-gradient(90deg,transparent,rgba(168,85,247,0.4),transparent)' }} />
          <p className="text-[0.82rem] sm:text-[0.88rem] text-[#64748b] text-center px-4">
            The dev market is crowded.{' '}
            <strong className="text-white">AI-integrated full stack developers?</strong>{' '}
            <span className="grad font-black text-[1rem]">Rare.</span> I'm one of them.
          </p>
          <span className="w-full h-px" style={{ background: 'linear-gradient(90deg,transparent,rgba(168,85,247,0.4),transparent)' }} />
        </div>
      </div>
    </section>
  );
}
