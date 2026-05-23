import { useState, useEffect } from 'react';
import './styles/global.css';

import Cursor from './components/Cursor';
import Loader from './components/Loader';
import Stars from './components/Stars';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Skills from './components/Skills';
import Projects from './components/Projects';
import Contact from './components/Contact';
import Footer from './components/Footer';
import Chatbot from './components/Chatbot';
import QuoteBanner from './components/QuoteBanner';
import Certificates from './components/Certificates';

const SECTIONS = ['home', 'about', 'certificates', 'skills', 'projects', 'contact'];

export default function App() {
  const [loaded, setLoaded] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('home');

  // Scroll handlers — debounced with rAF for performance
  useEffect(() => {
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        setScrolled(window.scrollY > 50);

        // Active section detection
        const mid = window.innerHeight / 2;
        for (const id of [...SECTIONS].reverse()) {
          const el = document.getElementById(id);
          if (el && el.getBoundingClientRect().top <= mid) {
            setActiveSection(id);
            break;
          }
        }
        ticking = false;
      });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Reveal observer — single shared instance
  useEffect(() => {
    if (!loaded) return;
    const obs = new IntersectionObserver(
      entries => entries.forEach(e => {
        if (e.isIntersecting) e.target.classList.add('on');
      }),
      { threshold: 0.08, rootMargin: '0px 0px -50px 0px' }
    );
    document.querySelectorAll('.reveal').forEach(el => obs.observe(el));
    return () => obs.disconnect();
  }, [loaded]);

  if (!loaded) return <Loader onDone={() => setLoaded(true)} />;

  return (
    <>
      <Cursor />
      <Stars />
      <Navbar scrolled={scrolled} activeSection={activeSection} />
      <main>
        <Hero />
        <QuoteBanner />
        <About />
        <Certificates />
        <Skills />
        <Projects />
        <Contact />
      </main>
      <Footer />
      <Chatbot />
    </>
  );
}
