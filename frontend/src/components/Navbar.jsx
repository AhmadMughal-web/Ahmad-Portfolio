import { useState } from 'react';

const LINKS = ['home', 'about', 'certificates', 'skills', 'projects', 'contact'];

export default function Navbar({ scrolled, activeSection }) {
  const [open, setOpen] = useState(false);

  const scrollTo = (id) => {
    const el = document.getElementById(id.toLowerCase().trim());
    if (!el) return;
    setOpen(false);

    // Pehle reveal trigger karo
    el.classList.add('on');

    // 1 frame wait karo phir scroll karo
    requestAnimationFrame(() => {
      const top = el.getBoundingClientRect().top + window.scrollY - 0;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  };

  return (
    <nav className={`fixed top-0 w-full z-[100] flex items-center justify-between px-[8%] transition-all duration-400 overflow-visible ${scrolled
      ? 'py-[13px] bg-[rgba(2,4,8,0.92)] backdrop-blur-2xl'
      : 'py-5'
      }`}>

      {/* Bottom border */}
      <div className="absolute bottom-0 left-0 w-full h-[1.5px] pointer-events-none overflow-visible">
        <div className="absolute top-0 right-1/2 h-full transition-all duration-700 ease-in-out"
          style={{
            width: scrolled ? '50%' : '0%',
            background: 'linear-gradient(270deg, rgba(0,247,255,0.9), rgba(168,85,247,0.8), transparent)',
          }} />
        <div className="absolute top-0 left-1/2 h-full transition-all duration-700 ease-in-out"
          style={{
            width: scrolled ? '50%' : '0%',
            background: 'linear-gradient(90deg, rgba(0,247,255,0.9), rgba(168,85,247,0.8), transparent)',
          }} />
        {/* Dot — half upar (exactly footer jaisa) */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full transition-all duration-500 w-3 h-3 "
          style={{
            width: scrolled ? '12px' : '0px',
            height: scrolled ? '12px' : '0px',
            background: '#00f7ff',
            boxShadow: scrolled ? '0 0 16px 4px rgba(0,247,255,0.7)' : 'none',
            zIndex: 10,
          }}
        />
      </div>

      {/* Logo */}
      <div className="font-display text-[1.55rem] font-black text-white tracking-tight z-[101] select-none">
        M<span className="text-cyan">.</span>Ahmad
      </div>

      {/* Desktop links */}
      <ul className={`
        md:flex hidden list-none gap-10 items-center
      `}>
        {LINKS.map(l => (
          <li key={l}>
            <a
              href={`#${l}`}
              className={`font-display text-[0.78rem] font-semibold tracking-widest uppercase relative
                transition-colors duration-300 group
                ${activeSection === l ? 'text-white' : 'text-[#64748b] hover:text-white'}
              `}
              onClick={e => { e.preventDefault(); scrollTo(l); }}
            >
              {l.charAt(0).toUpperCase() + l.slice(1)}
              <span className={`
                absolute -bottom-1 left-0 h-[1.5px] rounded-full
                bg-gradient-to-r from-purple to-cyan
                transition-all duration-300
                ${activeSection === l ? 'w-full' : 'w-0 group-hover:w-full'}
              `} />
            </a>
          </li>
        ))}
      </ul>

      {/* Hamburger */}
      <button
        className={`md:hidden flex flex-col gap-[5px] bg-transparent border-none p-[5px] z-[101]
          cursor-none`}
        onClick={() => setOpen(o => !o)}
        aria-label="Toggle menu"
      >
        <span className={`block w-6 h-[2px] bg-white rounded-full transition-all duration-300
          ${open ? 'translate-y-[7px] rotate-45' : ''}`} />
        <span className={`block w-6 h-[2px] bg-white rounded-full transition-all duration-300
          ${open ? 'opacity-0' : ''}`} />
        <span className={`block w-6 h-[2px] bg-white rounded-full transition-all duration-300
          ${open ? '-translate-y-[7px] -rotate-45' : ''}`} />
      </button>

      {/* Mobile menu */}
      <ul className={`
        md:hidden fixed inset-0 bg-[rgba(2,4,8,0.97)] backdrop-blur-2xl
        flex flex-col justify-center items-center gap-10 z-[100] list-none
        transition-transform duration-400
        ${open ? 'translate-x-0' : 'translate-x-full'}
      `}>
        {LINKS.map(l => (
          <li key={l}>
            <a
              href={`#${l}`}
              className="font-display text-[1.3rem] font-semibold tracking-[3px] uppercase
                text-[#64748b] hover:text-white transition-colors duration-300"
              onClick={e => { e.preventDefault(); scrollTo(l); }}
            >
              {l.charAt(0).toUpperCase() + l.slice(1)}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
