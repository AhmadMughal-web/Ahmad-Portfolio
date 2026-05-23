import { useState, useEffect, useRef, useCallback } from 'react';
import { IoClose, IoPaperPlane } from "react-icons/io5";

const SYSTEM = `You are M.Ahmad's AI portfolio assistant. Be helpful, concise and friendly.

About M.Ahmad (Muhammad Ahmad):
- Full Stack Developer & AI Integration, 1+ year experience
- Skills: React, Node.js, Express, MongoDB, Tailwind CSS, HTML/CSS/JS, REST APIs
- AI: Claude, Groq API, OpenAI API, GitHub Copilot, Prompt Engineering
- Projects: Food Recipe App, AI Agency Landing, Gaming Trailer Website, Al-Ghani Herbal Platform, NexusAI (AI career platform)
- Contact: ahmadmughalweb@gmail.com | WhatsApp: +92 324 9425513
- GitHub: github.com/AhmadMughal-web | LinkedIn: linkedin.com/in/ahmadmughal-web
- Available for: freelance, full-time roles, collaborations

Keep replies short (2-3 sentences). If unrelated to M.Ahmad, politely redirect.`;

const QUICK = [
  { label: 'Projects', msg: "What projects has M.Ahmad built?" },
  { label: 'Skills', msg: "What are M.Ahmad's main skills?" },
  { label: 'Contact', msg: "How can I contact M.Ahmad?" },
  { label: 'AI Work', msg: "Tell me about M.Ahmad's AI experience" },
  { label: 'Hire', msg: "Is M.Ahmad available for hire?" },
];

// ── Claude animated icon ──────────────────────────────────────────────────────
function ClaudeIcon({ size = 32, color = '#000' }) {
  const lines = [
    { deg: 0, w: 6, h: 28, delay: '0.00s' },
    { deg: 30, w: 4, h: 22, delay: '0.14s' },
    { deg: 60, w: 7, h: 30, delay: '0.28s' },
    { deg: 90, w: 4, h: 20, delay: '0.42s' },
    { deg: 120, w: 6, h: 26, delay: '0.56s' },
    { deg: 150, w: 5, h: 24, delay: '0.70s' },
  ];
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none"
      xmlns="http://www.w3.org/2000/svg" style={{ display: 'block' }}>
      <defs>
        <linearGradient id="claudeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#a855f7" />
          <stop offset="100%" stopColor="#00f7ff" />
        </linearGradient>
      </defs>
      <style>{`
        @keyframes clPulse {
          0%,100% { opacity: 0.7; transform: scaleY(1);   }
          50%      { opacity: 1;   transform: scaleY(1.5); }
        }
        ${lines.map((l, i) => `
          .cl${i} {
            animation: clPulse 1.6s ease-in-out infinite ${l.delay};
          }
        `).join('')}
      `}</style>
      {lines.map(({ deg, w, h }, i) => {
        const cx = 50;
        const cy = 50;
        const gap = 0; // gap from center
        return (
          <g key={i} transform={`rotate(${deg} ${cx} ${cy})`}>
            {/* top arm */}
            <rect
              className={`cl${i}`}
              x={cx - w / 2} y={cy - gap - h}
              width={w} height={h}
              rx={w / 2} fill={color}
              style={{ transformOrigin: `${cx}px ${cy - gap}px` }}
            />
            {/* bottom arm */}
            <rect
              className={`cl${i}`}
              x={cx - w / 2} y={cy + gap}
              width={w} height={h}
              rx={w / 2} fill={color}
              style={{ transformOrigin: `${cx}px ${cy + gap}px` }}
            />
          </g>
        );
      })}
    </svg>
  );
}


// ── Message formatting ────────────────────────────────────────────────────────
function parseParts(str) {
  const parts = str.split(/(\*\*[^*]+\*\*|M\.?\s*Ahmad|(?<!\w)Ahmad(?!\w))/g);
  return parts.map((part, pi) => {
    const isBold = part.startsWith('**') && part.endsWith('**');
    const isAhmad = /^(M\.?\s*Ahmad|Ahmad)$/.test(part);
    if (isBold || isAhmad) {
      const word = isBold ? part.slice(2, -2) : part;
      return (
        <strong key={pi} style={{
          background: 'linear-gradient(90deg,#a855f7,#00f7ff)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          fontWeight: 700,
        }}>{word}</strong>
      );
    }
    return <span key={pi} style={{ color: 'rgba(255,255,255,0.88)' }}>{part}</span>;
  });
}

const GradientDot = () => (
  <span style={{
    background: 'linear-gradient(135deg,#a855f7,#00f7ff)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    fontWeight: 900, fontSize: '1.1rem', lineHeight: '1.4', flexShrink: 0,
  }}>•</span>
);

function formatMessage(text) {
  const lines = text.split('\n');
  return lines.map((line, li) => {
    if (line.trim() === '') return <div key={li} style={{ height: '4px' }} />;
    if (line.trim().startsWith('* ') || line.trim().startsWith('- ') || line.trim().startsWith('• ')) {
      const slice = line.trim().startsWith('• ') ? 1 : 2;
      return (
        <div key={li} style={{ display: 'flex', gap: '7px', marginTop: '4px', alignItems: 'flex-start' }}>
          <GradientDot />
          <span style={{ flex: 1 }}>{parseParts(line.trim().slice(slice))}</span>
        </div>
      );
    }
    return <div key={li} style={{ marginTop: li > 0 ? '3px' : 0 }}>{parseParts(line)}</div>;
  });
}

// ── Main component ────────────────────────────────────────────────────────────
export default function Chatbot() {
  const [open, setOpen] = useState(false);
  const [msgs, setMsgs] = useState([
    { role: 'assistant', content: "Hey! 👋 I'm M.Ahmad's AI assistant. Ask me anything about his work, skills or availability!" },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [pulse, setPulse] = useState(false);
  const [unread, setUnread] = useState(0);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [msgs, loading]);

  useEffect(() => {
    if (open) { setTimeout(() => inputRef.current?.focus(), 300); setUnread(0); }
  }, [open]);

  useEffect(() => {
    if (!open && msgs.length > 1) {
      setPulse(true); setUnread(u => u + 1);
      setTimeout(() => setPulse(false), 2000);
    }
  }, [msgs.length]);

  const handleInput = useCallback((e) => {
    setInput(e.target.value);
    const el = e.target;
    el.style.height = 'auto';
    el.style.height = Math.min(el.scrollHeight, 120) + 'px';
  }, []);

  const send = async (text) => {
    const content = (text || input).trim();
    if (!content || loading) return;
    setInput('');
    if (inputRef.current) inputRef.current.style.height = 'auto';
    const newMsgs = [...msgs, { role: 'user', content }];
    setMsgs(newMsgs);
    setLoading(true);
    try {
      let data;
      for (let attempt = 1; attempt <= 3; attempt++) {
        try {
          const res = await fetch('https://ahmad-portfolio-backend.onrender.com/api/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              messages: newMsgs.map(m => ({ role: m.role, content: m.content })),
              system: SYSTEM,
            }),
          });
          if (!res.ok) throw new Error('Server error');
          data = await res.json();
          break;
        } catch (err) {
          if (attempt === 3) throw err;
          await new Promise(r => setTimeout(r, 1000 * attempt));
        }
      }
      setMsgs(m => [...m, { role: 'assistant', content: data.reply || 'Sorry, no response generated.' }]);
    } catch {
      setMsgs(m => [...m, { role: 'assistant', content: 'Network error — please contact M.Ahmad directly via email or WhatsApp.' }]);
    }
    setLoading(false);
  };

  const onKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); }
  };

  return (
    <>
      <style>{`
        @keyframes botOpen   { from{opacity:0;transform:scale(0.88) translateY(20px)} to{opacity:1;transform:scale(1) translateY(0)} }
        @keyframes msgIn     { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
        @keyframes ringPulse { 0%{box-shadow:0 0 0 0 rgba(0,247,255,0.55)} 70%{box-shadow:0 0 0 18px rgba(0,247,255,0)} 100%{box-shadow:0 0 0 0 rgba(0,247,255,0)} }
        @keyframes dotBounce { 0%,80%,100%{transform:translateY(0)} 40%{transform:translateY(-6px)} }
        .bot-open   { animation: botOpen 0.35s cubic-bezier(0.34,1.56,0.64,1) both; }
        .msg-in     { animation: msgIn 0.28s ease both; }
        .ring-pulse { animation: ringPulse 2s ease infinite; }
        .dot0 { animation: dotBounce 1.2s ease infinite 0s; }
        .dot1 { animation: dotBounce 1.2s ease infinite 0.2s; }
        .dot2 { animation: dotBounce 1.2s ease infinite 0.4s; }
        .chat-scroll::-webkit-scrollbar       { width: 3px; }
        .chat-scroll::-webkit-scrollbar-thumb { background: rgba(168,85,247,0.35); border-radius: 99px; }
        .chat-textarea                         { scrollbar-width: none; }
        .chat-textarea::-webkit-scrollbar     { display: none; }
      `}</style>

      {/* Float button */}
      <button
        onClick={() => setOpen(o => !o)}
        className={`fixed bottom-7 right-7 z-[1000] w-[62px] h-[62px] rounded-full
          flex items-center justify-center text-[#020408] text-[1.35rem]
          transition-all duration-300 hover:scale-110 active:scale-95 cursor-none
          ${pulse ? 'ring-pulse' : ''}`}
        style={{
          background: 'linear-gradient(135deg,#a855f7,#00f7ff)',
          boxShadow: '0 0 28px rgba(0,247,255,0.4), 0 4px 20px rgba(0,0,0,0.5)',
        }}
      >
        {open ? <IoClose size={28} /> : <ClaudeIcon size={55} />}
        {!open && unread > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-[#ef4444]
            flex items-center justify-center text-[0.58rem] font-black text-white border-2 border-[#020408]">
            {unread}
          </span>
        )}
      </button>

      {/* Chat panel */}
      {open && (
        <div
          className="bot-open fixed bottom-[90px] right-7 z-[999] w-[360px] flex flex-col rounded-[24px] overflow-hidden"
          style={{
            height: '540px',
            background: 'rgba(6,8,16,0.98)',
            border: '1px solid rgba(168,85,247,0.35)',
            boxShadow: '0 0 70px rgba(168,85,247,0.18), 0 30px 80px rgba(0,0,0,0.75)',
          }}
        >
          {/* Header */}
          <div
            className="flex items-center gap-3 px-5 py-[14px] border-b border-purple/20 flex-shrink-0"
            style={{ background: 'linear-gradient(135deg,rgba(168,85,247,0.14),rgba(0,247,255,0.06))' }}
          >
            <div className="relative flex-shrink-0">
              <div
                className="w-[38px] h-[38px] rounded-full flex items-center justify-center"
                style={{ background: 'linear-gradient(135deg,#a855f7,#00f7ff)' }}
              >
                <i className="fa-brands fa-claude text-black" style={{ fontSize: '24px' }} />
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 w-[11px] h-[11px] rounded-full bg-[#22c55e] border-2 border-[#06080f] animate-pulse" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-display text-[0.88rem] font-bold text-white leading-none">M.Ahmad's AI</p>
              <p className="text-[0.66rem] text-cyan/80 mt-[3px]">● Online — ask me anything</p>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="text-[#64748b] hover:text-white transition-colors cursor-none bg-transparent border-none p-1 flex-shrink-0"
            >
              <IoClose size={20} />
            </button>
          </div>

          {/* Messages */}
          <div className="chat-scroll flex-1 overflow-y-auto px-4 py-3 flex flex-col gap-3 min-h-0">
            {msgs.map((m, i) => (
              <div key={i} className={`msg-in flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                {m.role === 'assistant' && (
                  <div
                    className="w-6 h-6 rounded-full flex items-center justify-center mr-2 mt-1 flex-shrink-0"
                    style={{ background: 'linear-gradient(135deg,#a855f7,#00f7ff)' }}
                  >
                    <i className="fa-brands fa-claude text-black" style={{ fontSize: '15px' }} />
                  </div>
                )}
                <div
                  className={`max-w-[78%] rounded-[14px] px-[14px] py-[9px] text-[0.83rem] leading-[1.65]
                    ${m.role === 'user'
                      ? 'text-[#020408] font-medium rounded-br-[4px]'
                      : 'text-white/88 border border-purple/18 rounded-bl-[4px]'
                    }`}
                  style={m.role === 'user'
                    ? { background: 'linear-gradient(135deg,#a855f7,#00f7ff)' }
                    : { background: 'rgba(168,85,247,0.09)' }
                  }
                >
                  {m.role === 'assistant' ? formatMessage(m.content) : m.content}
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex justify-start msg-in">
                <div
                  className="w-6 h-6 rounded-full flex items-center justify-center mr-2 mt-1 flex-shrink-0"
                  style={{ background: 'linear-gradient(135deg,#a855f7,#00f7ff)' }}
                >
                  <i className="fa-brands fa-claude text-black" style={{
                    fontSize: '15px'
                  }} />
                </div>
                <div className="px-4 py-[10px] rounded-[14px] rounded-bl-[4px] border border-purple/20 bg-purple/[0.09] flex items-center text-cyan">
                  <ClaudeIcon size={38} color="url(#claudeGrad)" />
                </div>

              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Suggestions */}
          <div className="flex gap-2 px-4 py-2 flex-shrink-0 overflow-x-auto" style={{ scrollbarWidth: 'none' }}>
            {QUICK.map(q => (
              <button
                key={q.label}
                onClick={() => send(q.msg)}
                className="text-[0.68rem] px-[10px] py-[5px] rounded-full border border-purple/30
                  bg-purple/[0.09] text-purple/80 cursor-none flex-shrink-0
                  hover:border-cyan/55 hover:text-cyan hover:bg-cyan/[0.09]
                  transition-all duration-200 font-display font-semibold whitespace-nowrap"
              >
                {q.label}
              </button>
            ))}
          </div>

          {/* Input */}
          <div
            className="px-4 pb-3 border-t border-purple/15 flex gap-2 items-end flex-shrink-0"
            style={{ background: 'rgba(6,8,16,0.6)' }}
          >
            <textarea
              ref={inputRef}
              value={input}
              onChange={handleInput}
              onKeyDown={onKey}
              placeholder="Ask me anything..."
              rows={1}
              className="chat-textarea mt-2 flex-1 bg-white/[0.05] border border-white/[0.08] rounded-[12px]
                px-3 py-[9px] text-[0.84rem] text-white outline-none resize-none
                focus:border-cyan/45 placeholder:text-[#64748b] transition-all duration-200"
              style={{ lineHeight: '1.5', minHeight: '38px', maxHeight: '120px' }}
            />
            <button
              onClick={() => send()}
              disabled={!input.trim() || loading}
              className="w-[40px] h-[40px] rounded-[12px] flex items-center justify-center
                text-[#020408] text-[0.9rem] cursor-none flex-shrink-0
                disabled:opacity-35 transition-all duration-200 hover:scale-105"
              style={{ background: 'linear-gradient(135deg,#a855f7,#00f7ff)' }}
            >
              <IoPaperPlane size={18} />
            </button>
          </div>
        </div>
      )}
    </>
  );
}