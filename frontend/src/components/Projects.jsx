import { useEffect, useRef, useState } from 'react';

const CATEGORIES = [
  { key: 'all', label: 'All Projects', icon: 'fa-solid fa-layer-group' },
  { key: 'frontend', label: 'Frontend', icon: 'fa-solid fa-laptop-code' },
  { key: 'fullstack', label: 'Full Stack', icon: 'fa-solid fa-server' },
  { key: 'ai', label: 'AI Projects', icon: 'fa-solid fa-brain' },
  { key: 'coming', label: 'Coming Soon', icon: 'fa-solid fa-rocket' },
];

const CAT_FILTER_COLOR = {
  all: { active: 'rgba(255,255,255,', glow: 'rgba(255,255,255,' },
  frontend: { active: 'rgba(0,247,255,', glow: 'rgba(0,247,255,' },
  fullstack: { active: 'rgba(168,85,247,', glow: 'rgba(168,85,247,' },
  ai: { active: 'rgba(74,222,128,', glow: 'rgba(74,222,128,' },
  coming: { active: 'rgba(251,191,36,', glow: 'rgba(251,191,36,' },
};

import { PROJECTS } from '../data/projects.js';

const CAT_BADGE = {
  frontend: 'bg-cyan/10 text-[#67e8f9] border-cyan/25',
  fullstack: 'bg-purple/15 text-[#c084fc] border-purple/35',
  ai: 'bg-green-500/10 text-[#4ade80] border-green-500/25',
  coming: 'bg-yellow-400/10 text-[#fbbf24] border-yellow-400/25',
};
const CAT_LABEL = {
  frontend: 'Frontend',
  fullstack: 'Full Stack',
  ai: 'AI Project',
  coming: 'Coming Soon',
};

function ProjectCard({ img, tag, title, desc, link, github, cat, featured, coming }) {
  const ref = useRef(null);

  const CAT_COLORS = {
    frontend: { border: 'rgba(0,247,255,VAL)', glow: 'rgba(0,247,255,VAL)' },
    fullstack: { border: 'rgba(168,85,247,VAL)', glow: 'rgba(168,85,247,VAL)' },
    ai: { border: 'rgba(74,222,128,VAL)', glow: 'rgba(74,222,128,VAL)' },
    coming: { border: 'rgba(251,191,36,VAL)', glow: 'rgba(251,191,36,VAL)' },
  };
  const cc = CAT_COLORS[cat] || CAT_COLORS.frontend;
  const [hovered, setHovered] = useState(false);

  const onMove = e => {
    const r = ref.current.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    ref.current.style.transform = `translateY(-8px) rotateX(${-y * 8}deg) rotateY(${x * 8}deg)`;
    ref.current.style.setProperty('--mx', `${e.clientX - r.left}px`);
    ref.current.style.setProperty('--my', `${e.clientY - r.top}px`);
  };
  const onLeave = () => { ref.current.style.transform = ''; };

  const tags = tag.split('•').map(t => t.trim());

  return (
    <div ref={ref}
      onMouseMove={onMove}
      className={`proj-card relative bg-white/[0.04] rounded-[20px] overflow-hidden cursor-none
    border transition-all duration-400`}
      style={{
        borderColor: 'rgba(255,255,255,0.08)',
        transformStyle: 'preserve-3d',
      }}
      onMouseEnter={e => {
        setHovered(true);
        e.currentTarget.style.borderColor = cc.border.replace('VAL', '0.7');
        e.currentTarget.style.boxShadow = `0 30px 60px rgba(0,0,0,0.5), 0 0 30px ${cc.glow.replace('VAL', '0.25')}, 0 0 0 1px ${cc.border.replace('VAL', '0.5')}`;
      }}
      onMouseLeave={e => {
        setHovered(false);
        e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)';
        e.currentTarget.style.boxShadow = '';
        onLeave(e);
      }}>

      {/* Shimmer top border */}
      <div className="absolute top-0 -left-full w-[60%] h-[2px] z-[3]
        transition-[left] duration-600 ease-in-out hover:left-[150%]"
        style={{ background: 'linear-gradient(90deg,transparent,rgba(0,247,255,0.8),transparent)' }} />

      {/* Category badge */}
      <span className={`absolute top-3 left-3 z-[4] text-[9px] font-bold tracking-[0.4px]
        px-2 py-[2px] rounded-full uppercase border pointer-events-none ${CAT_BADGE[cat] || CAT_BADGE.frontend}`}>
        {CAT_LABEL[cat] || cat}
      </span>

      {/* Image */}
      <div className="relative overflow-hidden h-[240px] flex items-center justify-center"
        style={{ background: 'linear-gradient(135deg,#1e1b4b,#0c4a6e)' }}>
        {/* {coming && (
          <div className="absolute top-3 right-3 px-3 py-1 rounded-full z-[2] text-[0.66rem] font-bold
            tracking-[1px] bg-purple/20 border border-purple/40 text-purple">
            In Progress
          </div>
        )} */}
        {img && <img src={img} alt={title}
          className="w-full h-full object-cover block transition-transform duration-600 hover:scale-[1.09]"
          onError={e => { e.target.style.display = 'none'; }} />}
        <div className="absolute inset-0 bg-[rgba(2,4,8,0.8)] flex items-center justify-center
          opacity-0 hover:opacity-100 transition-opacity duration-400 backdrop-blur-[4px]">
          <div className="flex flex-col gap-2.5 items-center">


            {coming ? (
              <div className="flex flex-col gap-2 items-center">
                <span className="btn btn-p text-[0.78rem]">🚀 Coming Soon</span>
                <a href={github || '#'} target="_blank" rel="noreferrer"
                  className="inline-flex items-center gap-2 px-[22px] py-[10px] rounded-full
        text-[0.78rem] font-bold font-display text-white cursor-none
        bg-white/[0.08] border border-white/15 backdrop-blur-[8px]
        hover:bg-white/15 hover:border-white/30 transition-all duration-300">
                  <i className="fa-brands fa-github" /> Source Code
                </a>
              </div>
            ) : (
              <>
                <a href={link} target="_blank" rel="noreferrer" className="btn btn-p text-[0.78rem]">
                  <i className="fa-solid fa-arrow-up-right-from-square" /> Live Demo
                </a>
                <a href={github || '#'} target="_blank" rel="noreferrer"
                  className="inline-flex items-center gap-2 px-[22px] py-[10px] rounded-full
                    text-[0.78rem] font-bold font-display text-white cursor-none
                    bg-white/[0.08] border border-white/15 backdrop-blur-[8px]
                    hover:bg-white/15 hover:border-white/30 transition-all duration-300">
                  <i className="fa-brands fa-github" /> Source Code
                </a>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Info */}
      <div className="p-[22px] flex flex-col" style={{ minHeight: '160px' }}>
        <div className="flex flex-wrap gap-1.5 mb-2">
          {tags.map((t, i) => (
            <span key={i}
              className="text-[0.62rem] font-bold tracking-[1.5px] uppercase rounded-[6px] px-[10px] py-[3px]"
              style={{
                color: hovered ? cc.border.replace('VAL', '1') : '#94a3b8',
                background: hovered ? cc.glow.replace('VAL', '0.1') : 'rgba(255,255,255,0.04)',
                border: hovered ? `1px solid ${cc.border.replace('VAL', '0.4')}` : '1px solid rgba(255,255,255,0.08)',
                transition: 'all 0.3s ease',
              }}>
              {t}
            </span>
          ))}
        </div>
        <h3 className="font-display text-[1.08rem] font-bold text-white my-2">{title}</h3>
        <p className="text-[0.83rem] leading-[1.72] text-[#64748b]">{desc}</p>
        <div className="flex-1" />

        {/* ← YAHAN ADD KARO — coming soon repo button */}
        {coming && github && (
          <div className="flex items-center gap-3 mt-5 pt-4"
            style={{ borderTop: `1px solid rgba(251,191,36,0.12)` }}>

            {/* In Progress badge */}
            <div className="flex items-center gap-2 px-3 py-[7px] rounded-[10px]"
              style={{ background: 'rgba(251,191,36,0.08)', border: '1px solid rgba(251,191,36,0.2)' }}>
              <span className="w-2 h-2 rounded-full bg-[#fbbf24] animate-pulse" />
              <span className="font-display text-[0.68rem] font-bold text-[#fbbf24] tracking-[0.5px]">
                In Progress
              </span>
            </div>

            <div className="flex-1" />

            {/* GitHub repo button */}
            <a href={github} target="_blank" rel="noreferrer"
              onClick={e => e.stopPropagation()}
              className="flex items-center gap-2 px-4 py-[7px] rounded-[10px] cursor-none
                font-display text-[0.72rem] font-bold transition-all duration-300"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', color: '#64748b' }}
              onMouseEnter={e => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.10)';
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.25)';
                e.currentTarget.style.color = '#ffffff';
                e.currentTarget.style.boxShadow = '0 0 14px rgba(255,255,255,0.1)';
                e.currentTarget.style.transform = 'translateY(-1px)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.04)';
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)';
                e.currentTarget.style.color = '#64748b';
                e.currentTarget.style.boxShadow = 'none';
                e.currentTarget.style.transform = '';
              }}>
              <i className="fa-brands fa-github text-[0.82rem]" />
              View Repo
            </a>
          </div>
        )}

        {/* Bottom links bar */}
        {!coming && (
          <div className="relative mt-5 pt-4"
            style={{ borderTop: `1px solid ${cc.border.replace('VAL', '0.12')}` }}>

            {/* Animated line on hover */}
            <div className="absolute top-0 left-0 h-px w-0 transition-all duration-500"
              style={{
                background: `linear-gradient(90deg, ${cc.border.replace('VAL', '0.8')}, ${cc.glow.replace('VAL', '0.4')})`,
                width: hovered ? '100%' : '0%',
              }} />

            <div className="flex items-center gap-3">

              {/* Live Demo — pill button */}
              <a href={link} target="_blank" rel="noreferrer"
                onClick={e => e.stopPropagation()}
                className="flex-1 group flex items-center justify-center gap-2
          py-[9px] rounded-[10px] cursor-none
          font-display text-[0.72rem] font-bold tracking-[0.5px] uppercase
          transition-all duration-300"
                style={{
                  background: hovered ? cc.glow.replace('VAL', '0.12') : 'rgba(255,255,255,0.03)',
                  border: `1px solid ${hovered ? cc.border.replace('VAL', '0.4') : 'rgba(255,255,255,0.06)'}`,
                  color: hovered ? cc.border.replace('VAL', '1') : '#64748b',
                  boxShadow: hovered ? `0 0 16px ${cc.glow.replace('VAL', '0.2')}` : 'none',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.background = cc.glow.replace('VAL', '0.18');
                  e.currentTarget.style.color = cc.border.replace('VAL', '1');
                  e.currentTarget.style.borderColor = cc.border.replace('VAL', '0.6');
                  e.currentTarget.style.boxShadow = `0 0 20px ${cc.glow.replace('VAL', '0.3')}`;
                  e.currentTarget.style.transform = 'translateY(-1px)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = hovered ? cc.glow.replace('VAL', '0.12') : 'rgba(255,255,255,0.03)';
                  e.currentTarget.style.color = hovered ? cc.border.replace('VAL', '1') : '#64748b';
                  e.currentTarget.style.borderColor = hovered ? cc.border.replace('VAL', '0.4') : 'rgba(255,255,255,0.06)';
                  e.currentTarget.style.boxShadow = hovered ? `0 0 16px ${cc.glow.replace('VAL', '0.2')}` : 'none';
                  e.currentTarget.style.transform = '';
                }}>
                <i className="fa-solid fa-rocket text-[0.85rem]" />
                Live Preview
              </a>

              {/* Divider */}
              <div className="w-px h-7 bg-white/[0.08]" />

              {/* GitHub — icon only, clean */}
              {github ? (
                <a href={github} target="_blank" rel="noreferrer"
                  onClick={e => e.stopPropagation()}
                  className="flex items-center gap-2 py-[9px] px-4 rounded-[10px] cursor-none
            font-display text-[0.72rem] font-bold tracking-[0.5px] uppercase
            transition-all duration-300"
                  style={{
                    background: 'rgba(255,255,255,0.03)',
                    border: '1px solid rgba(255,255,255,0.06)',
                    color: '#64748b',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.background = 'rgba(255,255,255,0.08)';
                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)';
                    e.currentTarget.style.color = '#ffffff';
                    e.currentTarget.style.boxShadow = '0 0 14px rgba(255,255,255,0.1)';
                    e.currentTarget.style.transform = 'translateY(-1px)';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.background = 'rgba(255,255,255,0.03)';
                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)';
                    e.currentTarget.style.color = '#64748b';
                    e.currentTarget.style.boxShadow = 'none';
                    e.currentTarget.style.transform = '';
                  }}>
                  <i className="fa-brands fa-github text-[0.85rem]" />
                  Code
                </a>
              ) : (
                <div className="flex items-center gap-1.5 py-[9px] px-4 rounded-[10px]"
                  style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.04)' }}>
                  <i className="fa-solid fa-lock text-[0.65rem] text-white/20" />
                  <span className="font-display text-[0.68rem] text-white/20 tracking-[0.5px]">Private</span>
                </div>
              )}
            </div>
          </div>
        )}

      </div>

      {/* Glow */}
      <div className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-400
        pointer-events-none rounded-[20px]"
        style={{ background: `radial-gradient(circle at var(--mx,50%) var(--my,50%),${cc.glow.replace('VAL', '0.1')},transparent 65%)` }} />
    </div>
  );
}

export default function Projects() {
  const [activeFilter, setActiveFilter] = useState('all');
  const ref = useRef(null);

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { ref.current?.classList.add('on'); obs.disconnect(); }
    }, { threshold: 0.1 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  const filtered = activeFilter === 'all'
    ? PROJECTS
    : activeFilter === 'coming'
      ? PROJECTS.filter(p => p.coming)
      : PROJECTS.filter(p => p.cat === activeFilter);

  return (
    <section id="projects" className="section reveal px-[8%] py-20 relative z-[2]" ref={ref}>
      <div className="font-display text-[0.7rem] tracking-[4px] uppercase text-cyan mb-4">04 — Work</div>
      <h2 className="sec-title font-display font-black text-white mb-4 text-[clamp(2rem,5vw,3.5rem)] tracking-[-2px]">
        Featured <span>Projects</span>
      </h2>
      <p className="text-[0.96rem] text-[#64748b] mb-10">Things I've built with love &amp; code</p>

      {/* Filter buttons — same style as Skills */}
      <div className="flex justify-center gap-2.5 mb-10 flex-wrap">
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

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[26px] max-w-[1100px] mx-auto">
        {filtered.map((p, i) => <ProjectCard key={i} {...p} />)}
      </div>

      <div className="mt-14 max-w-[1100px] mx-auto flex flex-col items-center gap-4">
        <span className="w-full h-px" style={{ background: 'linear-gradient(90deg,transparent,rgba(168,85,247,0.4),transparent)' }} />
        <p className="text-[0.82rem] sm:text-[0.88rem] text-[#64748b] text-center px-4">
          <i className="fa-solid fa-satellite-dish text-cyan" />{' '}
          Built <strong className="text-white">25+ projects</strong> in practice —{' '}
          <strong className="text-white">7 deployed live.</strong> Quality over quantity. Every time.
        </p>
        <span className="w-full h-px" style={{ background: 'linear-gradient(90deg,transparent,rgba(168,85,247,0.4),transparent)' }} />
      </div>
    </section>
  );
}
