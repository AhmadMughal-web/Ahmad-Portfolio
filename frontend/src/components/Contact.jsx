import { useState, useEffect, useRef } from 'react';

export default function Contact() {
  const [form, setForm]     = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState('idle');
  const ref = useRef(null);

  const onChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async e => {
    e.preventDefault();
    setStatus('sending');
    try {
      const res = await fetch('https://formsubmit.co/ajax/ahmadmughalweb@gmail.com', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ ...form, _captcha: 'false' }),
      });
      if (res.ok) { setStatus('success'); setForm({ name: '', email: '', message: '' }); }
      else setStatus('error');
    } catch { setStatus('error'); }
  };

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { ref.current?.classList.add('on'); obs.disconnect(); }
    }, { threshold: 0.1 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  const inputCls = `w-full bg-white/[0.04] border border-white/[0.08] rounded-[12px] px-[17px] py-[13px]
    text-white font-body text-[0.93rem] outline-none
    transition-all duration-300
    focus:border-cyan/40 focus:[box-shadow:0_0_0_3px_rgba(0,247,255,0.06)]
    placeholder:text-[#64748b]`;

  return (
    <section id="contact" className="section reveal px-[8%] py-20 relative z-[2]" ref={ref}>
      <div className="font-display text-[0.7rem] tracking-[4px] uppercase text-cyan mb-4">05 — Contact</div>
      <h2 className="sec-title font-display font-black text-white mb-4 text-[clamp(2rem,5vw,3.5rem)] tracking-[-2px]">
        Let's Build <span>Together</span>
      </h2>
      <p className="text-[0.96rem] text-[#64748b] mb-14">Got a project or opportunity? I'd love to hear about it.</p>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.2fr] gap-10 lg:gap-20 items-start max-w-[1000px] mx-auto">

        {/* Left */}
        <div>
          <div className="font-display text-[1.9rem] lg:text-[1.9rem] font-black text-white leading-[1.2] mb-5">
            Drop me a message <i class="fa-solid fa-envelope"></i>
          </div>
          <p className="text-[0.92rem] leading-[1.82] text-[#64748b] mb-10">
            I'm actively looking for opportunities as a{' '}
            <strong className="text-white">Full Stack Developer &amp; AI Integration</strong>. Whether it's
            a freelance project, or full-time role — I'd love to connect!
          </p>
          <div className="flex flex-col gap-3">
            {[
              { label:'Email', val:'ahmadmughalweb@gmail.com', icon:'fa-envelope', cls:'text-cyan', onClick:()=>window.open('mailto:ahmadmughalweb@gmail.com'), waColor:false },
              { label:'WhatsApp', val:'+92 324 9425513', icon:'fa-brands fa-whatsapp', cls:'text-[#22c55e]', onClick:()=>window.open('https://wa.me/923249425513'), waColor:true },
            ].map(({ label, val, icon, cls, onClick, waColor }) => (
              <div key={label} onClick={onClick}
                className="c-link flex items-center gap-4 px-5 py-[17px] bg-white/[0.04] border border-white/[0.08]
                  rounded-[16px] cursor-none transition-all duration-400
                  hover:border-cyan/30 hover:translate-x-1.5 hover:bg-cyan/[0.04]">
                <div className={`w-[42px] h-[42px] rounded-[12px] flex items-center justify-center text-[1rem] flex-shrink-0 ${cls}
                  ${waColor ? 'bg-[rgba(34,197,94,0.12)]' : 'bg-gradient-to-br from-purple/20 to-cyan/20'}`}>
                  <i className={`fa-solid ${icon}`} />
                </div>
                <div className="flex flex-col flex-1">
                  <span className="text-[0.66rem] tracking-[2px] uppercase text-[#64748b]">{label}</span>
                  <span className="font-display text-[0.84rem] font-semibold text-white mt-0.5 break-all">{val}</span>
                </div>
                <i className="fa-solid fa-arrow-up-right-from-square text-[0.72rem] text-[#64748b]
                  group-hover:text-cyan transition-colors duration-400" />
              </div>
            ))}
          </div>
        </div>

        {/* Form */}
        <form className="flex flex-col gap-[18px]" onSubmit={handleSubmit}>
          {[
            { name:'name',    label:'Your Name',      type:'text',  placeholder:'John Doe' },
            { name:'email',   label:'Email Address',  type:'email', placeholder:'john@example.com' },
          ].map(f => (
            <div key={f.name} className="flex flex-col gap-2">
              <label className="font-display text-[0.7rem] font-bold tracking-[2px] uppercase text-[#64748b]">
                {f.label}
              </label>
              <input name={f.name} type={f.type} placeholder={f.placeholder}
                value={form[f.name]} onChange={onChange} required className={inputCls} />
            </div>
          ))}
          <div className="flex flex-col gap-2">
            <label className="font-display text-[0.7rem] font-bold tracking-[2px] uppercase text-[#64748b]">
              Message
            </label>
            <textarea name="message" placeholder="Tell me about your project or opportunity..."
              value={form.message} onChange={onChange} required
              className={`${inputCls} resize-none h-[128px]`} />
          </div>

          {status === 'success' && (
            <div className="flex items-start gap-4 p-4 rounded-[14px] text-[0.88rem] leading-[1.6]
              bg-[rgba(34,197,94,0.08)] border border-[rgba(34,197,94,0.3)] text-[#4ade80]
              [animation:fadeUp_0.4s_ease]">
              <i className="fa-solid fa-circle-check text-[1.3rem] mt-0.5 flex-shrink-0" />
              <div><strong className="block font-display text-[0.92rem]">Message Sent!</strong>
                <p className="opacity-80 mt-0.5">I'll get back to you very soon 🚀</p></div>
            </div>
          )}
          {status === 'error' && (
            <div className="flex items-start gap-4 p-4 rounded-[14px] text-[0.88rem] leading-[1.6]
              bg-[rgba(239,68,68,0.08)] border border-[rgba(239,68,68,0.3)] text-[#f87171]
              [animation:fadeUp_0.4s_ease]">
              <i className="fa-solid fa-circle-xmark text-[1.3rem] mt-0.5 flex-shrink-0" />
              <div><strong className="block font-display text-[0.92rem]">Something went wrong</strong>
                <p className="opacity-80 mt-0.5">Please try again or WhatsApp me directly.</p></div>
            </div>
          )}

          <button type="submit" disabled={status === 'sending'}
            className="btn btn-p btn-full disabled:opacity-50 disabled:cursor-not-allowed">
            {status === 'sending'
              ? <><i className="fa-solid fa-spinner fa-spin" /> Sending...</>
              : <><i className="fa-solid fa-paper-plane" /> Send Message</>}
          </button>
        </form>
      </div>
    </section>
  );
}
