import { useEffect, useRef, useState } from 'react';

const WORDS = [
    { text: 'Most developers', highlight: false },
    { text: 'write code.', highlight: false },
    { text: 'Few', highlight: 'white' },
    { text: 'build solutions.', highlight: false },
    { text: 'Even fewer', highlight: false },
    { text: 'build the future —', highlight: false },
    { text: 'with AI,', highlight: 'grad' },
    { text: 'with purpose,', highlight: 'grad' },
    { text: 'with fire.', highlight: 'grad' },
    { text: "Don't", highlight: false },
    { text: 'wait', highlight: false },
    { text: 'to be chosen.', highlight: false },
    { text: 'Build something', highlight: false },
    { text: 'so undeniable', highlight: 'white' },
    { text: 'the world', highlight: false },
    { text: 'has no choice', highlight: false },
    { text: 'but to notice', highlight: false },
    { text: 'you.', highlight: 'grad' },
];

export default function QuoteBanner() {
    const canvasRef = useRef(null);
    const sectionRef = useRef(null);
    const [visible, setVisible] = useState(false);
    const [wordIdx, setWordIdx] = useState(-1);
    const [glitching, setGlitching] = useState(false);
    const [done, setDone] = useState(false);

    useEffect(() => {
        const obs = new IntersectionObserver(([e]) => {
            if (e.isIntersecting && !visible) { setVisible(true); obs.disconnect(); }
        }, { threshold: 0.35 });
        if (sectionRef.current) obs.observe(sectionRef.current);
        return () => obs.disconnect();
    }, [visible]);

    useEffect(() => {
        if (!visible) return;
        let i = 0;
        const iv = setInterval(() => {
            setWordIdx(i); i++;
            if (i >= WORDS.length) { clearInterval(iv); setDone(true); }
        }, 160);
        return () => clearInterval(iv);
    }, [visible]);

    useEffect(() => {
        if (!done) return;
        setGlitching(true);
        setTimeout(() => setGlitching(false), 800);
    }, [done]);

    // useEffect(() => {
    //     const cvs = canvasRef.current;
    //     if (!cvs) return;
    //     const ctx = cvs.getContext('2d');
    //     let raf, t = 0;
    //     const resize = () => { cvs.width = cvs.offsetWidth; cvs.height = cvs.offsetHeight; };
    //     resize();
    //     const ro = new ResizeObserver(resize);
    //     ro.observe(cvs);
    //     const pts = Array.from({ length: 65 }, () => ({
    //         x: Math.random(), y: Math.random(),
    //         vx: (Math.random() - 0.5) * 0.00055,
    //         vy: (Math.random() - 0.5) * 0.00055,
    //         size: Math.random() * 1.8 + 0.3,
    //         alpha: Math.random() * 0.55 + 0.15,
    //         color: Math.random() < 0.5 ? 'cyan' : 'purple',
    //         phase: Math.random() * Math.PI * 2,
    //     }));
    //     const draw = () => {
    //         t += 0.013;
    //         ctx.clearRect(0, 0, cvs.width, cvs.height);
    //         pts.forEach(p => {
    //             p.x += p.vx; p.y += p.vy;
    //             if (p.x < 0) p.x = 1; if (p.x > 1) p.x = 0;
    //             if (p.y < 0) p.y = 1; if (p.y > 1) p.y = 0;
    //         });
    //         for (let i = 0; i < pts.length; i++) {
    //             for (let j = i + 1; j < pts.length; j++) {
    //                 const a = pts[i], b = pts[j];
    //                 const dx = (a.x - b.x) * cvs.width, dy = (a.y - b.y) * cvs.height;
    //                 const d = Math.sqrt(dx * dx + dy * dy);
    //                 if (d < 100) {
    //                     const alpha = (1 - d / 100) * 0.2;
    //                     const grad = ctx.createLinearGradient(a.x * cvs.width, a.y * cvs.height, b.x * cvs.width, b.y * cvs.height);
    //                     grad.addColorStop(0, `rgba(0,247,255,${alpha})`);
    //                     grad.addColorStop(1, `rgba(168,85,247,${alpha})`);
    //                     ctx.beginPath(); ctx.moveTo(a.x * cvs.width, a.y * cvs.height);
    //                     ctx.lineTo(b.x * cvs.width, b.y * cvs.height);
    //                     ctx.strokeStyle = grad; ctx.lineWidth = 0.7; ctx.stroke();
    //                 }
    //             }
    //         }
    //         pts.forEach(p => {
    //             const pulse = Math.sin(t * 2.2 + p.phase) * 0.35 + 0.65;
    //             ctx.beginPath();
    //             ctx.arc(p.x * cvs.width, p.y * cvs.height, p.size, 0, Math.PI * 2);
    //             ctx.fillStyle = p.color === 'cyan' ? `rgba(0,247,255,${p.alpha * pulse})` : `rgba(168,85,247,${p.alpha * pulse})`;
    //             ctx.fill();
    //         });
    //         const cx = cvs.width / 2, cy = cvs.height / 2;
    //         const glow = ctx.createRadialGradient(cx, cy, 0, cx, cy, cvs.width * 0.4);
    //         glow.addColorStop(0, `rgba(168,85,247,${(Math.sin(t * 0.8) * 0.5 + 0.5) * 0.06})`);
    //         glow.addColorStop(1, 'transparent');
    //         ctx.fillStyle = glow; ctx.fillRect(0, 0, cvs.width, cvs.height);
    //         raf = requestAnimationFrame(draw);
    //     };
    //     draw();
    //     return () => { cancelAnimationFrame(raf); ro.disconnect(); };
    // }, []);

    const gradStyle = {
        background: 'linear-gradient(135deg,#a855f7,#00f7ff)',
        WebkitBackgroundClip: 'text', backgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
    };

    return (
        <div ref={sectionRef} className="relative z-[2] py-16 px-[8%] overflow-hidden">
            <style>{`
        @keyframes wordIn {
          from { opacity:0; transform:translateY(8px) scale(0.94); filter:blur(5px); }
          to   { opacity:1; transform:translateY(0) scale(1); filter:blur(0); }
        }
        .word-in { animation: wordIn 0.32s cubic-bezier(0.16,1,0.3,1) both; }
        @keyframes glitch1 {
          0%,100%{ clip-path:inset(0 0 92% 0);  transform:translate(-4px,0) skewX(-1deg); }
          25%    { clip-path:inset(25% 0 55% 0); transform:translate(4px,0) skewX(1deg); }
          50%    { clip-path:inset(60% 0 18% 0); transform:translate(-3px,0) skewX(-1deg); }
          75%    { clip-path:inset(10% 0 75% 0); transform:translate(3px,0) skewX(0deg); }
        }
        @keyframes glitch2 {
          0%,100%{ clip-path:inset(45% 0 35% 0); transform:translate(4px,0) skewX(1deg); }
          25%    { clip-path:inset(70% 0 12% 0); transform:translate(-4px,0) skewX(-1deg); }
          50%    { clip-path:inset(8% 0 80% 0);  transform:translate(3px,0) skewX(0deg); }
          75%    { clip-path:inset(35% 0 48% 0); transform:translate(-3px,0) skewX(1deg); }
        }
        .glitch-el { position:relative; display:inline-block; }
        .glitch-el::before, .glitch-el::after {
          content: attr(data-text); position:absolute; inset:0; pointer-events:none;
          background:inherit; -webkit-background-clip:text; background-clip:text; -webkit-text-fill-color:transparent;
        }
        .glitch-el.on::before { color:#00f7ff; animation: glitch1 0.1s steps(1) 4; }
        .glitch-el.on::after  { color:#a855f7; animation: glitch2 0.1s steps(1) 4; }
        @keyframes scanline { 0%{ top:-4px; opacity:0.8; } 100%{ top:100%; opacity:0; } }
        .scan { animation: scanline 2.8s linear infinite; }
        @keyframes borderPulse { 0%,100%{ opacity:0.45; } 50%{ opacity:1; } }
        .b-pulse { animation: borderPulse 3s ease-in-out infinite; }
        @keyframes authorIn { from{ opacity:0; transform:translateX(-16px); } to{ opacity:1; transform:translateX(0); } }
        .author-in { animation: authorIn 0.55s ease both; }
        @keyframes cornerBlink { 0%,100%{ opacity:0.4; } 50%{ opacity:1; } }
        .corner { animation: cornerBlink 2.5s ease-in-out infinite; }
      `}</style>

            {/* <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" /> */}

            {visible && (
                <div className="scan absolute left-0 w-full h-[2px] pointer-events-none"
                    style={{ background: 'linear-gradient(90deg,transparent,rgba(0,247,255,0.5),rgba(168,85,247,0.5),transparent)' }} />
            )}

            <div className="b-pulse absolute top-0 left-0 w-full h-[1.5px]"
                style={{ background: 'linear-gradient(90deg,transparent,#00f7ff,#a855f7,transparent)' }} />
            <div className="b-pulse absolute bottom-0 left-0 w-full h-[1.5px]"
                style={{ background: 'linear-gradient(90deg,transparent,#a855f7,#00f7ff,transparent)', animationDelay: '1.5s' }} />

            {['top-0 left-0 border-t-2 border-l-2', 'top-0 right-0 border-t-2 border-r-2',
                'bottom-0 left-0 border-b-2 border-l-2', 'bottom-0 right-0 border-b-2 border-r-2'].map((c, i) => (
                    <div key={i} className={`corner absolute w-6 h-6 ${c} border-cyan/60`} />
                ))}

            <div className="absolute inset-0 pointer-events-none"
                style={{ background: 'radial-gradient(ellipse 65% 130% at 50% 50%,rgba(168,85,247,0.07),transparent)' }} />

            <div className="relative max-w-[860px] mx-auto text-center">
                <div className="font-display text-[5.5rem] leading-[0.65] font-black mb-2 select-none"
                    style={{ ...gradStyle, opacity: 0.25 }}>"</div>

                <p className="text-[0.98rem] sm:text-[1.18rem] leading-[2.2] font-light min-h-[120px]">
                    {WORDS.map((w, i) => {
                        if (i > wordIdx) return null;
                        if (w.highlight === 'grad') return (
                            <span key={i} className="word-in inline">
                                <strong className="not-italic font-black" style={gradStyle}>{w.text}</strong>{' '}
                            </span>
                        );
                        if (w.highlight === 'white') return (
                            <span key={i} className="word-in inline">
                                <strong className="text-white not-italic font-bold">{w.text}</strong>{' '}
                            </span>
                        );
                        return <span key={i} className="word-in inline text-[#8892a4] italic">{w.text}{' '}</span>;
                    })}
                </p>

                {done && (
                    <div className="author-in flex items-center justify-center gap-4 mt-7">
                        <div className="h-px flex-1 max-w-[80px]"
                            style={{ background: 'linear-gradient(90deg,transparent,#a855f7)' }} />
                        <div className={`glitch-el font-display text-[0.78rem] tracking-[5px] uppercase font-black ${glitching ? 'on' : ''}`}
                            data-text="M AHMAD" style={gradStyle}>
                            M AHMAD
                        </div>
                        <div className="h-px flex-1 max-w-[80px]"
                            style={{ background: 'linear-gradient(90deg,#00f7ff,transparent)' }} />
                    </div>
                )}

                {done && (
                    <div className="font-display text-[3rem] leading-[1] font-black select-none mt-1"
                        style={{ ...gradStyle, opacity: 0.2 }}>"</div>
                )}
            </div>
        </div>
    );
}