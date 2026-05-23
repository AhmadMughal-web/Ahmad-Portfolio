import { useEffect, useRef } from 'react';

const TRAIL_COUNT = 8;

export default function Cursor() {
  const dotRef = useRef(null);
  const ringRef = useRef(null);
  const circleRef = useRef(null);
  const trailRefs = useRef([]);
  const mouse = useRef({ x: 0, y: 0 });
  const ringPos = useRef({ x: 0, y: 0 });
  const history = useRef(Array(TRAIL_COUNT * 4).fill({ x: 0, y: 0 }));
  const rafRef = useRef(null);

  useEffect(() => {
    const onMove = e => { mouse.current.x = e.clientX; mouse.current.y = e.clientY; };
    document.addEventListener('mousemove', onMove);

    const tick = () => {
      const mx = mouse.current.x;
      const my = mouse.current.y;

      if (dotRef.current) {
        dotRef.current.style.left = mx + 'px';
        dotRef.current.style.top = my + 'px';
      }

      ringPos.current.x += (mx - ringPos.current.x) * 0.25;
      ringPos.current.y += (my - ringPos.current.y) * 0.25;
      if (ringRef.current) {
        ringRef.current.style.left = ringPos.current.x + 'px';
        ringRef.current.style.top = ringPos.current.y + 'px';
      }

      history.current.unshift({ x: mx, y: my });
      history.current.length = TRAIL_COUNT * 4;
      trailRefs.current.forEach((el, i) => {
        if (!el) return;
        const h = history.current[(i + 1) * 2] || { x: 0, y: 0 };
        el.style.left = h.x + 'px';
        el.style.top = h.y + 'px';
        el.style.opacity = ((1 - i / TRAIL_COUNT) * 0.38).toFixed(2);
        el.style.background = i % 2 === 0 ? '#00f7ff' : '#cc44ff';
        const s = (3.5 - i * 0.32).toFixed(1);
        el.style.width = s + 'px';
        el.style.height = s + 'px';
      });

      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);

    const enter = () => {
      ringRef.current?.classList.add('hov');
      dotRef.current?.classList.add('hov');
      circleRef.current?.setAttribute('stroke', 'url(#rg-hov)');
    };
    const leave = () => {
      ringRef.current?.classList.remove('hov');
      dotRef.current?.classList.remove('hov');
      circleRef.current?.setAttribute('stroke', 'url(#rg)');
    };

    const attach = () =>
      document.querySelectorAll(
        'a, button, .skill-card, .proj-card, .id-card, .clink, .btn, .nav a, .whyme-card, .astat, .atag, .stack-note, .about-tags, .sec-title span, .c-link, .ft-stat'
      ).forEach(el => {
        el.addEventListener('mouseenter', enter);
        el.addEventListener('mouseleave', leave);
      });

    const obs = new MutationObserver(attach);
    obs.observe(document.body, { childList: true, subtree: true });
    attach();

    return () => {
      document.removeEventListener('mousemove', onMove);
      cancelAnimationFrame(rafRef.current);
      obs.disconnect();
    };
  }, []);

  return (
    <>
      {/* Dot */}
      <div
        ref={dotRef}
        className="hov:bg-[#cc44ff] fixed top-0 left-0 pointer-events-none z-[99999]
          -translate-x-1/2 -translate-y-1/2 w-[7px] h-[7px] rounded-full bg-[#00f7ff]
          transition-[background,box-shadow] duration-[250ms]"
        style={{ boxShadow: '0 0 8px #00f7ff, 0 0 18px rgba(0,247,255,0.5)' }}
      />

      {/* SVG Ring */}
      <svg
        ref={ringRef}
        viewBox="0 0 36 36"
        xmlns="http://www.w3.org/2000/svg"
        className="fixed top-0 left-0 pointer-events-none z-[99998] overflow-visible
          -translate-x-1/2 -translate-y-1/2 transition-[width,height] duration-[250ms]
          w-[36px] h-[36px] [&.hov]:w-[54px] [&.hov]:h-[54px]"
        style={{ animation: 'cursorSpin 2.5s linear infinite' }}
      >
        <style>{`
          @keyframes cursorSpin { to { transform: translate(-50%,-50%) rotate(360deg); } }
          .c-ring-svg { transform-origin: center; }
          .c-ring-svg.hov { animation-duration: 1.2s !important; }
        `}</style>
        <defs>
          <linearGradient id="rg" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#00f7ff" />
            <stop offset="45%" stopColor="#8800ff" />
            <stop offset="75%" stopColor="#cc44ff" />
            <stop offset="100%" stopColor="#00f7ff" />
          </linearGradient>
          <linearGradient id="rg-hov" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#cc44ff" />
            <stop offset="50%" stopColor="#00f7ff" />
            <stop offset="100%" stopColor="#8800ff" />
          </linearGradient>
        </defs>
        <circle
          ref={circleRef}
          cx="18" cy="18" r="16"
          fill="none"
          stroke="url(#rg)"
          strokeWidth="1.6"
          strokeLinecap="round"
        />
      </svg>

      {/* Trail dots */}
      {Array.from({ length: TRAIL_COUNT }, (_, i) => (
        <div
          key={i}
          ref={el => (trailRefs.current[i] = el)}
          className="fixed top-0 left-0 pointer-events-none z-[99997]
            -translate-x-1/2 -translate-y-1/2 rounded-full opacity-0"
          style={{ width: '4px', height: '4px' }}
        />
      ))}
    </>
  );
}