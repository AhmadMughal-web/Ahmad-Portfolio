import { useEffect, useRef, useState } from 'react';

const NAV = ['Home', 'About', 'Certificates', 'Skills', 'Projects', 'Contact'];
const SOCIALS = [
  { href: 'https://github.com/AhmadMughal-web', icon: 'fa-github', label: 'GitHub', color: '#e2e8f0', glow: 'rgba(226,232,240,0.25)' },
  { href: 'https://linkedin.com/in/ahmadmughal-web', icon: 'fa-linkedin', label: 'LinkedIn', color: '#0ea5e9', glow: 'rgba(14,165,233,0.35)' },
  { href: 'mailto:ahmadmughalweb@gmail.com', icon: 'fa-envelope', label: 'Email', color: '#f97316', glow: 'rgba(249,115,22,0.35)' },
  { href: 'https://wa.me/923249425513', icon: 'fa-whatsapp', label: 'WhatsApp', color: '#22c55e', glow: 'rgba(34,197,94,0.35)' },
];
const STATS = [
  { num: '25+', label: 'Projects' },
  { num: '5★', label: 'Rating' },
  { num: '1yr+', label: 'Exp' },
  { num: '∞', label: 'Passion' },
];

export default function Footer() {
  const ref = useRef(null);
  const canvas = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        setVisible(true);
        obs.disconnect(); // ✅ ek baar dekha, phir observe band
      }
    }, { threshold: 0.05 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    const cvs = canvas.current;
    if (!cvs) return;
    const ctx = cvs.getContext('2d');
    let raf, t = 0;
    const resize = () => { cvs.width = cvs.offsetWidth; cvs.height = cvs.offsetHeight; };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(cvs);
    const draw = () => {
      t += 0.008;
      ctx.clearRect(0, 0, cvs.width, cvs.height);
      const cols = Math.ceil(cvs.width / 44);
      const rows = Math.ceil(cvs.height / 44);
      for (let r = 0; r <= rows; r++) {
        for (let c = 0; c <= cols; c++) {
          const wave = Math.sin(t + c * 0.4 + r * 0.3);
          const alpha = (wave * 0.5 + 0.5) * 0.18;
          ctx.beginPath();
          ctx.arc(c * 44, r * 44, 1.2, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(168,85,247,${alpha})`;
          ctx.fill();
        }
      }
      raf = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(raf); ro.disconnect(); };
  }, []);

  const scrollTo = id => {
    if (id === 'home') { window.scrollTo({ top: 0, behavior: 'smooth' }); return; }
    const el = document.getElementById(id);
    if (!el) return;

    el.classList.add('on');

    requestAnimationFrame(() => {
      const top = el.getBoundingClientRect().top + window.scrollY - 10;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  };

  return (
    <footer ref={ref} className="relative z-[2] overflow-hidden"
      style={{ background: 'linear-gradient(180deg,transparent,rgba(2,4,8,0.98) 18%)' }}>
      <style>{`
        @keyframes ftFadeUp { from{opacity:0;transform:translateY(24px)} to{opacity:1;transform:translateY(0)} }
        .ft-in { animation: ftFadeUp 0.7s ease both; }
        @keyframes gradShift { 0%{background-position:0% 50%} 100%{background-position:200% 50%} }
        .ft-logo-text {
          background: linear-gradient(90deg,#00f7ff,#a855f7,#fff,#00f7ff);
          background-size: 300% 100%;
          -webkit-background-clip: text; background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: gradShift 4s linear infinite;
        }
        @keyframes orb1 { 0%,100%{transform:translate(0,0) scale(1)} 50%{transform:translate(30px,-20px) scale(1.12)} }
        @keyframes orb2 { 0%,100%{transform:translate(0,0) scale(1)} 50%{transform:translate(-25px,20px) scale(0.9)} }
        .ft-orb1 { animation: orb1 12s ease-in-out infinite; }
        .ft-orb2 { animation: orb2 15s ease-in-out infinite; }
      `}</style>

      {/* Orbs */}
      <div className="ft-orb1 absolute top-0 left-[-100px] w-[400px] h-[400px] rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle,rgba(88,28,220,0.22),transparent 65%)', filter: 'blur(60px)' }} />
      <div className="ft-orb2 absolute bottom-0 right-[-80px] w-[350px] h-[350px] rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle,rgba(0,180,220,0.18),transparent 65%)', filter: 'blur(55px)' }} />

      {/* Particle canvas */}
      <canvas ref={canvas} className="absolute inset-0 w-full h-full pointer-events-none opacity-60" />

      {/* Top glowing divider */}
      <div className="relative w-full h-[2px]"
        style={{ background: 'linear-gradient(90deg,transparent,rgba(168,85,247,0.8),rgba(0,247,255,0.9),rgba(168,85,247,0.8),transparent)' }}>
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 rounded-full"
          style={{ background: '#00f7ff', boxShadow: '0 0 16px 4px rgba(0,247,255,0.7)' }} />
      </div>

      <div className="relative px-[8%] pt-14 pb-8">
        {/* 3-col grid */}
        <div className="grid grid-cols-1 md:grid-cols-[1.4fr_1fr_1fr] gap-12 mb-12">

          {/* Brand */}
          <div className={visible ? 'ft-in' : 'opacity-0'} style={{ animationDelay: '0.1s' }}>
            <div className="flex items-center gap-3 mb-5">
              <div className="w-16 h-12 rounded-[18px] flex items-center justify-center
                font-display text-[1.15rem] font-black text-[#020408] flex-shrink-0"
                style={{ background: 'linear-gradient(135deg,#a855f7,#00f7ff)', boxShadow: '0 0 20px rgba(0,247,255,0.3),0 0 40px rgba(168,85,247,0.2)' }}>
                M.A
              </div>
              <div>
                <p className="ft-logo-text font-display text-[1.4rem] font-black leading-none">M.Ahmad</p>
                <p className="text-[0.7rem] text-[#64748b] tracking-[1.5px] mt-1 uppercase">Full Stack Dev & AI Integration</p>
              </div>
            </div>
            <p className="text-[0.88rem] leading-[1.85] text-[#64748b] mb-6 max-w-[280px]">
              Building intelligent web experiences where{' '}
              <span className="text-white font-medium">clean code</span> meets{' '}
              <span className="text-cyan font-medium">AI power</span>.
              Available for freelance & full-time.
            </p>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border mb-6
              border-[rgba(34,197,94,0.3)] bg-[rgba(34,197,94,0.06)]">
              <span className="w-2 h-2 rounded-full bg-[#22c55e] animate-pulse [box-shadow:0_0_8px_#22c55e]" />
              <span className="text-[0.72rem] font-bold tracking-[1px] text-[#4ade80]">Open to Work</span>
            </div>
            <div className="flex gap-3 flex-wrap">
              {SOCIALS.map(s => (
                <a key={s.icon} href={s.href} target="_blank" rel="noreferrer" title={s.label}
                  className="w-[44px] h-[44px] rounded-[12px] flex items-center justify-center
                    text-[1.1rem] no-underline transition-all duration-300 hover:-translate-y-1.5"
                  style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: '#64748b' }}
                  onMouseEnter={e => { e.currentTarget.style.color = s.color; e.currentTarget.style.borderColor = s.color + '66'; e.currentTarget.style.boxShadow = `0 0 16px ${s.glow}`; e.currentTarget.style.background = s.color + '11'; }}
                  onMouseLeave={e => { e.currentTarget.style.color = '#64748b'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; }}>
                  <i className={s.icon === 'fa-envelope' ? 'fa-solid fa-envelope' : `fa-brands ${s.icon}`} />
                </a>
              ))}
            </div>
          </div>

          {/* Nav */}
          <div className={visible ? 'ft-in' : 'opacity-0'} style={{ animationDelay: '0.2s' }}>
            <p className="font-display text-[0.7rem] font-black tracking-[3px] uppercase text-cyan mb-5">Navigation</p>
            <ul className="flex flex-col gap-[10px] list-none">
              {NAV.map(l => (
                <li key={l}>
                  <a href={`#${l.toLowerCase()}`}
                    onClick={e => { e.preventDefault(); scrollTo(l.toLowerCase()); }}
                    className="group flex items-center gap-2.5 text-[0.86rem] text-[#64748b]
                      hover:text-white transition-all duration-300 no-underline cursor-none">
                    <span className="w-0 group-hover:w-4 h-px transition-all duration-300 flex-shrink-0 rounded-full"
                      style={{ background: 'linear-gradient(90deg,#a855f7,#00f7ff)' }} />
                    <span className="group-hover:translate-x-1 transition-transform duration-300">{l}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Stats */}
          <div className={visible ? 'ft-in' : 'opacity-0'} style={{ animationDelay: '0.3s' }}>
            <p className="font-display text-[0.7rem] font-black tracking-[3px] uppercase text-cyan mb-5">By the Numbers</p>
            <div className="grid grid-cols-2 gap-3">
              {STATS.map(({ num, label }) => (
                <div key={label}
                  className="ft-stat flex flex-col items-center justify-center py-4 px-2 rounded-[16px]
                    border border-purple/20 bg-white/[0.03]
                    hover:border-cyan/40 hover:bg-cyan/[0.04]
                    transition-all duration-300 cursor-default">
                  <span className="font-display font-black leading-none mb-1 text-[1.6rem]"
                    style={{ background: 'linear-gradient(135deg,#a855f7,#00f7ff)', WebkitBackgroundClip: 'text', backgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                    {num}
                  </span>
                  <span className="text-[0.65rem] tracking-[1.5px] uppercase text-[#64748b]">{label}</span>
                </div>
              ))}
            </div>
            <a href="#contact"
              onClick={e => { e.preventDefault(); scrollTo('contact'); }}
              className="btn btn-p btn-full mt-5 cursor-none text-[0.8rem]">
              <i className="fa-solid fa-paper-plane" /> Let's Work Together
            </a>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="w-full h-px mb-6 overflow-hidden rounded-full"
          style={{ background: 'linear-gradient(90deg,transparent,rgba(168,85,247,0.5),rgba(0,247,255,0.5),rgba(168,85,247,0.5),transparent)' }} />

        <div className="flex items-center justify-between flex-wrap gap-4">
          <p className="text-[0.76rem] text-[#64748b]">
            Made with{' '}
            <span style={{ background: 'linear-gradient(135deg,#a855f7,#00f7ff)', WebkitBackgroundClip: 'text', backgroundClip: 'text', WebkitTextFillColor: 'transparent', fontWeight: 700 }}>♥</span>{' '}
            by{' '}
            <span style={{ background: 'linear-gradient(135deg,#a855f7,#00f7ff)', WebkitBackgroundClip: 'text', backgroundClip: 'text', WebkitTextFillColor: 'transparent', fontWeight: 700 }}>M Ahmad</span>{' '}
            — © 2026. All rights reserved.
          </p>
          <div className="flex items-center gap-3 text-[0.72rem] text-[#64748b]">
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#22c55e] animate-pulse" />
              All systems operational
            </span>
            <span className="text-purple/40">|</span>
            <span>Built with React + Tailwind</span>
          </div>
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="group flex items-center gap-2 px-4 py-2.5 rounded-full
              text-[0.74rem] font-display font-bold tracking-[0.5px] cursor-none
              transition-all duration-300 hover:-translate-y-1"
            style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(168,85,247,0.35)', color: '#a855f7' }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(0,247,255,0.07)'; e.currentTarget.style.borderColor = 'rgba(0,247,255,0.5)'; e.currentTarget.style.color = '#00f7ff'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; e.currentTarget.style.borderColor = 'rgba(168,85,247,0.35)'; e.currentTarget.style.color = '#a855f7'; }}>
            <i className="fa-solid fa-arrow-up text-[0.72rem]" />
            Back to Top
          </button>
        </div>
      </div>
    </footer>
  );
}