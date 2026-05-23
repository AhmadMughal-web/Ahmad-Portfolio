import { useEffect, useRef, useState } from 'react';

const CERTS = [
    {
        title: 'Software Engineer',
        issuer: 'HackerRank',
        type: 'Role Certification',
        level: 'Certified',
        icon: 'fa-solid fa-laptop-code',
        color: '#00f7ff',
        pdf: '/certificates/software-engineer.pdf',
        verify: 'https://www.hackerrank.com/skills-verification/software_engineer',
        tags: ['Engineering', 'Problem Solving', 'Algorithms'],
    },
    {
        title: 'JavaScript',
        issuer: 'HackerRank',
        type: 'Skill Certification',
        level: 'Intermediate',
        icon: 'fa-brands fa-square-js',
        color: '#f7df1e',
        pdf: '/certificates/javascript-intermediate.pdf',
        verify: 'https://www.hackerrank.com/skills-verification/javascript_intermediate',
        tags: ['ES6+', 'DOM', 'Async/Await'],
    },
    {
        title: 'React',
        issuer: 'HackerRank',
        type: 'Skill Certification',
        level: 'Basic',
        icon: 'fa-brands fa-react',
        color: '#61dafb',
        pdf: '/certificates/react-basic.pdf',
        verify: 'https://www.hackerrank.com/skills-verification/react_basic',
        tags: ['Components', 'Hooks', 'State'],
    },
    {
        title: 'Problem Solving',
        issuer: 'HackerRank',
        type: 'Skill Certification',
        level: 'Intermediate',
        icon: 'fa-solid fa-brain',
        color: '#a855f7',
        pdf: '/certificates/problem-solving-intermediate.pdf',
        verify: 'https://www.hackerrank.com/skills-verification/problem_solving_intermediate',
        tags: ['Data Structures', 'Algorithms', 'Logic'],
    },
    // {
        // title: 'Node.js',
        // issuer: 'HackerRank',
        // type: 'Skill Certification',
        // level: 'Basic',
        // icon: 'fa-brands fa-node-js',
        // color: '#68a063',
        // pdf: '/certificates/nodejs-basic.pdf',
        // verify: 'https://www.hackerrank.com/skills-verification/nodejs_basic',
        // tags: ['Express', 'APIs', 'Server-Side'],
    // },
    {
        title: 'REST API',
        issuer: 'HackerRank',
        type: 'Skill Certification',
        level: 'Intermediate',
        icon: 'fa-solid fa-code-branch',
        color: '#00f7ff',
        pdf: '/certificates/rest-api-intermediate.pdf',
        verify: 'https://www.hackerrank.com/skills-verification/rest_api_intermediate',
        tags: ['HTTP', 'CRUD', 'JSON'],
    },
    {
        title: 'SQL',
        issuer: 'HackerRank',
        type: 'Skill Certification',
        level: 'Intermediate',
        icon: 'fa-solid fa-database',
        color: '#a855f7',
        pdf: '/certificates/sql-intermediate.pdf',
        verify: 'https://www.hackerrank.com/skills-verification/sql_intermediate',
        tags: ['Queries', 'Joins', 'Aggregations'],
    },
];

const LEVEL_STYLE = {
    'Certified': { bg: 'rgba(0,247,255,0.1)', border: 'rgba(0,247,255,0.35)', text: '#00f7ff' },
    'Intermediate': { bg: 'rgba(168,85,247,0.1)', border: 'rgba(168,85,247,0.35)', text: '#c084fc' },
    'Basic': { bg: 'rgba(74,222,128,0.1)', border: 'rgba(74,222,128,0.35)', text: '#4ade80' },
};

function CertCard({ cert, index }) {
    const cardRef = useRef(null);
    const glowRef = useRef(null);
    const [hovered, setHovered] = useState(false);
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const obs = new IntersectionObserver(([e]) => {
            if (e.isIntersecting) {
                setTimeout(() => setVisible(true), index * 80);
                obs.disconnect();
            }
        }, { threshold: 0.1 });
        if (cardRef.current) obs.observe(cardRef.current);
        return () => obs.disconnect();
    }, [index]);

    const lvl = LEVEL_STYLE[cert.level] || LEVEL_STYLE['Intermediate'];

    const onMove = e => {
        const rect = cardRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left, y = e.clientY - rect.top;
        const cx = x / rect.width - 0.5, cy = y / rect.height - 0.5;
        cardRef.current.style.transform =
            `perspective(700px) rotateX(${-cy * 16}deg) rotateY(${cx * 16}deg) translateY(-8px) scale(1.03)`;
        if (glowRef.current)
            glowRef.current.style.background =
                `radial-gradient(circle at ${x}px ${y}px, ${cert.color}22, transparent 65%)`;
    };

    const onLeave = () => {
        cardRef.current.style.transform = '';
        setHovered(false);
    };

    return (
        <div
            ref={cardRef}
            className="relative rounded-[20px] overflow-hidden cursor-none border"
            style={{
                background: 'rgba(8,10,20,0.95)',
                borderColor: hovered ? `${cert.color}88` : 'rgba(255,255,255,0.07)',
                boxShadow: hovered
                    ? `0 0 0 1px ${cert.color}44, 0 20px 50px rgba(0,0,0,0.5), 0 0 40px ${cert.color}18`
                    : '0 8px 32px rgba(0,0,0,0.4)',
                opacity: visible ? 1 : 0,
                transform: visible ? 'translateY(0) scale(1)' : 'translateY(50px) scale(0.95)',
                transition: visible
                    ? 'opacity 0.6s ease, transform 0.6s cubic-bezier(0.16,1,0.3,1), border-color 0.3s, box-shadow 0.3s'
                    : 'none',
                transformStyle: 'preserve-3d',
            }}
            onMouseEnter={() => setHovered(true)}
            onMouseMove={onMove}
            onMouseLeave={onLeave}
        >
            {/* Top accent line */}
            <div className="absolute top-0 left-0 w-full h-[2px] transition-opacity duration-300"
                style={{
                    background: `linear-gradient(90deg,transparent,${cert.color},transparent)`,
                    opacity: hovered ? 1 : 0.3,
                }} />

            {/* Glow */}
            <div ref={glowRef}
                className="absolute inset-0 pointer-events-none rounded-[20px] transition-opacity duration-300"
                style={{ opacity: hovered ? 1 : 0 }}
            />


            <div className="p-6">
                {/* Icon + Title */}
                <div className="flex items-start gap-4 mb-4">
                    <div className="w-[52px] h-[52px] rounded-[14px] flex items-center justify-center flex-shrink-0"
                        style={{
                            background: `${cert.color}15`,
                            border: `1px solid ${cert.color}30`,
                            boxShadow: hovered ? `0 0 20px ${cert.color}30` : 'none',
                            transition: 'box-shadow 0.3s',
                        }}>
                        <i className={`${cert.icon} text-[1.4rem]`} style={{ color: cert.color }} />
                    </div>
                    <div className="flex-1 min-w-0">
                        <h3 className="font-display text-[1rem] font-black text-white leading-tight mb-1">
                            {cert.title}
                            <span className="ml-2 text-[0.7rem] font-semibold opacity-50">— {cert.level}</span>
                        </h3>
                        <div className="flex items-center gap-2">
                            <span className="text-[0.72rem] text-[#64748b]">{cert.issuer}</span>
                            <span className="w-1 h-1 rounded-full bg-white/20" />
                            <span className="text-[0.72rem]" style={{ color: lvl.text }}>{cert.type}</span>
                        </div>
                    </div>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5 mb-5">
                    {cert.tags.map(t => (
                        <span key={t}
                            className="text-[0.6rem] font-bold tracking-[1px] uppercase px-2.5 py-[3px] rounded-[6px]"
                            style={{
                                color: hovered ? cert.color : '#64748b',
                                background: hovered ? `${cert.color}12` : 'rgba(255,255,255,0.04)',
                                border: `1px solid ${hovered ? cert.color + '35' : 'rgba(255,255,255,0.07)'}`,
                                transition: 'all 0.3s ease',
                            }}>
                            {t}
                        </span>
                    ))}
                </div>

                {/* Action buttons — always visible */}
                <div className="flex items-center gap-2.5 pt-4"
                    style={{ borderTop: `1px solid rgba(255,255,255,0.06)` }}>

                    {/* View Certificate */}
                    <a href={cert.pdf} target="_blank" rel="noreferrer"
                        onClick={e => e.stopPropagation()}
                        className="flex-1 flex items-center justify-center gap-2 py-[9px] rounded-[10px]
              font-display text-[0.72rem] font-bold tracking-[0.5px] uppercase cursor-none
              transition-all duration-300"
                        style={{
                            background: hovered ? `${cert.color}18` : 'rgba(255,255,255,0.03)',
                            border: `1px solid ${hovered ? cert.color + '55' : 'rgba(255,255,255,0.07)'}`,
                            color: hovered ? cert.color : '#64748b',
                        }}
                        onMouseEnter={e => {
                            e.currentTarget.style.background = `${cert.color}25`;
                            e.currentTarget.style.borderColor = `${cert.color}88`;
                            e.currentTarget.style.color = cert.color;
                            e.currentTarget.style.boxShadow = `0 0 16px ${cert.color}30`;
                            e.currentTarget.style.transform = 'translateY(-1px)';
                        }}
                        onMouseLeave={e => {
                            e.currentTarget.style.background = hovered ? `${cert.color}18` : 'rgba(255,255,255,0.03)';
                            e.currentTarget.style.borderColor = hovered ? `${cert.color}55` : 'rgba(255,255,255,0.07)';
                            e.currentTarget.style.color = hovered ? cert.color : '#64748b';
                            e.currentTarget.style.boxShadow = 'none';
                            e.currentTarget.style.transform = '';
                        }}>
                        <i className="fa-solid fa-eye text-[0.7rem]" />
                        View
                    </a>

                    {/* Download */}
                    <a href={cert.pdf} download
                        onClick={e => e.stopPropagation()}
                        className="flex-1 flex items-center justify-center gap-2 py-[9px] rounded-[10px]
              font-display text-[0.72rem] font-bold tracking-[0.5px] uppercase cursor-none
              transition-all duration-300"
                        style={{
                            background: hovered ? 'rgba(255,255,255,0.07)' : 'rgba(255,255,255,0.03)',
                            border: `1px solid ${hovered ? 'rgba(255,255,255,0.18)' : 'rgba(255,255,255,0.07)'}`,
                            color: hovered ? '#ffffff' : '#64748b',
                        }}
                        onMouseEnter={e => {
                            e.currentTarget.style.background = 'rgba(255,255,255,0.12)';
                            e.currentTarget.style.borderColor = 'rgba(255,255,255,0.3)';
                            e.currentTarget.style.color = '#ffffff';
                            e.currentTarget.style.boxShadow = '0 0 14px rgba(255,255,255,0.1)';
                            e.currentTarget.style.transform = 'translateY(-1px)';
                        }}
                        onMouseLeave={e => {
                            e.currentTarget.style.background = hovered ? 'rgba(255,255,255,0.07)' : 'rgba(255,255,255,0.03)';
                            e.currentTarget.style.borderColor = hovered ? 'rgba(255,255,255,0.18)' : 'rgba(255,255,255,0.07)';
                            e.currentTarget.style.color = hovered ? '#ffffff' : '#64748b';
                            e.currentTarget.style.boxShadow = 'none';
                            e.currentTarget.style.transform = '';
                        }}>
                        <i className="fa-solid fa-download text-[0.7rem]" />
                        Download
                    </a>

                    {/* Verify link */}
                    <a href={cert.verify} target="_blank" rel="noreferrer"
                        onClick={e => e.stopPropagation()}
                        className="w-[38px] h-[38px] flex items-center justify-center rounded-[10px]
              cursor-none transition-all duration-300 flex-shrink-0"
                        style={{
                            background: 'rgba(255,255,255,0.03)',
                            border: '1px solid rgba(255,255,255,0.07)',
                            color: '#64748b',
                        }}
                        title="Verify on HackerRank"
                        onMouseEnter={e => {
                            e.currentTarget.style.background = 'rgba(34,197,94,0.12)';
                            e.currentTarget.style.borderColor = 'rgba(34,197,94,0.4)';
                            e.currentTarget.style.color = '#22c55e';
                            e.currentTarget.style.boxShadow = '0 0 12px rgba(34,197,94,0.2)';
                        }}
                        onMouseLeave={e => {
                            e.currentTarget.style.background = 'rgba(255,255,255,0.03)';
                            e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)';
                            e.currentTarget.style.color = '#64748b';
                            e.currentTarget.style.boxShadow = 'none';
                        }}>
                        <i className="fa-solid fa-arrow-up-right-from-square text-[0.65rem]" />
                    </a>
                </div>
            </div>
        </div>
    );
}

export default function Certificates() {
    const ref = useRef(null);

    useEffect(() => {
        const obs = new IntersectionObserver(([e]) => {
            if (e.isIntersecting) { ref.current?.classList.add('on'); obs.disconnect(); }
        }, { threshold: 0.05 });
        if (ref.current) obs.observe(ref.current);
        return () => obs.disconnect();
    }, []);

    return (
        <section id="certificates" className="section reveal px-[8%] py-20 relative z-[2]" ref={ref}>
            <style>{`
        @keyframes certFloat { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
        .cert-icon-float { animation: certFloat 3s ease-in-out infinite; }
      `}</style>

            <div className="font-display text-[0.7rem] tracking-[4px] uppercase text-cyan mb-4">
                02 — Credentials
            </div>
            <h2 className="sec-title font-display font-black text-white mb-4
        text-[clamp(2rem,5vw,3.5rem)] tracking-[-2px]">
                Certifications <span>&amp; Skills</span>
            </h2>
            <p className="text-[0.96rem] text-[#64748b] mb-6">
                Verified skills from HackerRank — tested, not claimed.
            </p>

            {/* HackerRank badge */}
            <div className="inline-flex items-center gap-3 px-5 py-3 rounded-[14px] mb-14
        border border-[rgba(34,197,94,0.25)] bg-[rgba(34,197,94,0.05)]">
                <div className="w-8 h-8 rounded-[8px] flex items-center justify-center
          bg-[rgba(34,197,94,0.15)] border border-[rgba(34,197,94,0.3)]">
                    <i className="fa-solid fa-certificate text-[0.85rem] text-[#22c55e]" />
                </div>
                <div>
                    <p className="font-display text-[0.78rem] font-bold text-white leading-none">
                        HackerRank Verified
                    </p>
                    <p className="text-[0.68rem] text-[#64748b] mt-[3px]">
                        7 certifications — all verified & publicly accessible
                    </p>
                </div>
                <a href="https://www.hackerrank.com/ahmadmughalweb" target="_blank" rel="noreferrer"
                    className="ml-2 flex items-center gap-1.5 px-3 py-1.5 rounded-[8px] cursor-none
            font-display text-[0.68rem] font-bold text-[#22c55e] transition-all duration-200
            hover:bg-[rgba(34,197,94,0.12)]"
                    style={{ border: '1px solid rgba(34,197,94,0.3)' }}>
                    View Profile <i className="fa-solid fa-arrow-up-right-from-square text-[0.6rem]" />
                </a>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-[1100px] mx-auto">
                {CERTS.map((c, i) => <CertCard key={i} cert={c} index={i} />)}
            </div>

            {/* Bottom */}
            <div className="mt-14 max-w-[1100px] mx-auto flex flex-col items-center gap-4">
                <span className="w-full h-px"
                    style={{ background: 'linear-gradient(90deg,transparent,rgba(0,247,255,0.4),transparent)' }} />
                <p className="text-[0.82rem] sm:text-[0.88rem] text-[#64748b] text-center px-4">
                    <i className="fa-solid fa-shield-halved text-cyan" />{' '}
                    Every certificate is <strong className="text-white">publicly verifiable</strong> on HackerRank.{' '}
                    No fake credentials. <strong className="text-white">Earned, not claimed.</strong>
                </p>
                <span className="w-full h-px"
                    style={{ background: 'linear-gradient(90deg,transparent,rgba(0,247,255,0.4),transparent)' }} />
            </div>
        </section>
    );
}