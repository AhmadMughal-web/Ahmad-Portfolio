import { useState, useEffect } from 'react';

const PHRASES = [
  'Loading my portfolio',
  'Brewing some code...',
  'Initializing AI systems...',
  'Almost there...',
];

export default function Loader({ onDone }) {
  const [pct, setPct]       = useState(0);
  const [out, setOut]       = useState(false);
  const [phraseIdx, setPhraseIdx] = useState(0);
  const [visible, setVisible]     = useState(true);

  // Progress bar
  useEffect(() => {
    let p = 0;
    const iv = setInterval(() => {
      p++;
      setPct(p);
      if (p >= 100) {
        clearInterval(iv);
        setTimeout(() => { setOut(true); setTimeout(onDone, 700); }, 300);
      }
    }, 22);
    return () => clearInterval(iv);
  }, [onDone]);

  // Cycle phrases with fade
  useEffect(() => {
    const cycle = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setPhraseIdx(i => (i + 1) % PHRASES.length);
        setVisible(true);
      }, 400);
    }, 1800);
    return () => clearInterval(cycle);
  }, []);

  return (
    <div
      className={`fixed inset-0 z-[9999] flex items-center justify-center
        transition-opacity duration-700 ${out ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
      style={{ background: '#020408' }}
    >
      {/* Ambient glow blobs */}
      <div style={{
        position: 'absolute', width: 400, height: 400,
        borderRadius: '50%', top: '10%', left: '15%',
        background: 'radial-gradient(circle, rgba(168,85,247,0.12), transparent 70%)',
        filter: 'blur(40px)', pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute', width: 350, height: 350,
        borderRadius: '50%', bottom: '10%', right: '10%',
        background: 'radial-gradient(circle, rgba(0,247,255,0.10), transparent 70%)',
        filter: 'blur(40px)', pointerEvents: 'none',
      }} />

      {/* Scanline overlay */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.08) 2px, rgba(0,0,0,0.08) 4px)',
        zIndex: 1,
      }} />

      <div className="flex flex-col items-center gap-8 relative z-[2]">

        {/* Logo — M.A with glitch flicker */}
        <div style={{ position: 'relative' }}>
          <div
            className="font-display font-black text-white select-none"
            style={{
              fontSize: 'clamp(64px, 12vw, 96px)',
              letterSpacing: '-5px',
              lineHeight: 1,
              textShadow: '0 0 40px rgba(168,85,247,0.4), 0 0 80px rgba(0,247,255,0.15)',
              animation: 'flicker 4s ease infinite',
            }}
          >
            M<span style={{
              background: 'linear-gradient(90deg,#a855f7,#00f7ff)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}>.</span>A
          </div>

          {/* Glitch clone */}
          <div
            className="font-display font-black select-none pointer-events-none"
            style={{
              position: 'absolute', top: 0, left: 0,
              fontSize: 'clamp(64px, 12vw, 96px)',
              letterSpacing: '-5px',
              lineHeight: 1,
              color: 'rgba(0,247,255,0.18)',
              animation: 'glitch 3s ease infinite',
              clipPath: 'inset(30% 0 50% 0)',
            }}
          >
            M.A
          </div>
        </div>

        {/* Phrase — fades in/out */}
        <div style={{
          fontFamily: 'monospace',
          fontSize: '0.78rem',
          letterSpacing: '3px',
          color: '#64748b',
          textTransform: 'uppercase',
          opacity: visible ? 1 : 0,
          transition: 'opacity 0.4s ease',
          minHeight: '1.2em',
          textAlign: 'center',
        }}>
          {PHRASES[phraseIdx]}
        </div>

        {/* Progress bar */}
        <div style={{ width: 240, display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div style={{
            width: '100%', height: 3,
            background: 'rgba(255,255,255,0.06)',
            borderRadius: 99, overflow: 'hidden',
            position: 'relative',
          }}>
            {/* Track glow */}
            <div style={{
              position: 'absolute', inset: 0,
              boxShadow: 'inset 0 0 8px rgba(168,85,247,0.2)',
            }} />
            {/* Fill */}
            <div style={{
              height: '100%',
              width: `${pct}%`,
              borderRadius: 99,
              background: 'linear-gradient(90deg, #a855f7, #00f7ff)',
              boxShadow: '0 0 12px #00f7ff, 0 0 24px rgba(0,247,255,0.4)',
              transition: 'width 25ms linear',
              position: 'relative',
            }}>
              {/* Tip sparkle */}
              <div style={{
                position: 'absolute', right: 0, top: '50%',
                transform: 'translate(50%, -50%)',
                width: 7, height: 7, borderRadius: '50%',
                background: '#00f7ff',
                boxShadow: '0 0 8px #00f7ff, 0 0 16px rgba(0,247,255,0.8)',
              }} />
            </div>
          </div>

          {/* Percentage */}
          <div style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          }}>
            <span style={{
              fontFamily: 'monospace', fontSize: '0.65rem',
              color: 'rgba(168,85,247,0.6)', letterSpacing: '1px',
            }}>
              INIT
            </span>
            <span style={{
              fontFamily: 'monospace', fontSize: '0.75rem', fontWeight: 700,
              background: 'linear-gradient(90deg,#a855f7,#00f7ff)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
              letterSpacing: '1px',
            }}>
              {pct}%
            </span>
            <span style={{
              fontFamily: 'monospace', fontSize: '0.65rem',
              color: 'rgba(0,247,255,0.6)', letterSpacing: '1px',
            }}>
              100
            </span>
          </div>
        </div>

        {/* Corner decorations */}
        {[
          { top: -28, left: -28, borderTop: '2px solid', borderLeft: '2px solid' },
          { top: -28, right: -28, borderTop: '2px solid', borderRight: '2px solid' },
          { bottom: -28, left: -28, borderBottom: '2px solid', borderLeft: '2px solid' },
          { bottom: -28, right: -28, borderBottom: '2px solid', borderRight: '2px solid' },
        ].map((s, i) => (
          <div key={i} style={{
            position: 'absolute', width: 16, height: 16,
            borderColor: 'rgba(168,85,247,0.4)', ...s,
          }} />
        ))}

      </div>

      <style>{`
        @keyframes flicker {
          0%,95%,100% { opacity: 1; }
          96% { opacity: 0.85; }
          97% { opacity: 1; }
          98% { opacity: 0.7; }
        }
        @keyframes glitch {
          0%,90%,100% { transform: translate(0); opacity: 0; }
          91% { transform: translate(-4px, 1px); opacity: 1; }
          93% { transform: translate(4px, -1px); opacity: 0.5; }
          95% { transform: translate(0); opacity: 0; }
        }
      `}</style>
    </div>
  );
}
