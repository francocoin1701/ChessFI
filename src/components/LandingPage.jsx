import React, { useEffect, useState } from "react";
import chainlinkImg from "../assets/markChainlink.png";
import es from "../i18n/es";
import en from "../i18n/en";
import HowItWorks from "./HowItWorks";
import Security from "./Security";
import Roadmap from "./RoadMap";

const LANGS = { es, en };

function ChessBackground() {
  const size = 64;
  const cols = Math.ceil(window.innerWidth / size) + 1;
  const rows = Math.ceil(window.innerHeight / size) + 1;
  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 0,
      display: 'grid',
      gridTemplateColumns: `repeat(${cols}, ${size}px)`,
      gridTemplateRows: `repeat(${rows}, ${size}px)`,
      opacity: 0.06, pointerEvents: 'none'
    }}>
      {Array.from({ length: cols * rows }).map((_, i) => {
        const col = i % cols;
        const row = Math.floor(i / cols);
        return (
          <div key={i} style={{
            width: size, height: size,
            backgroundColor: (col + row) % 2 === 1 ? '#f39c12' : 'transparent'
          }} />
        );
      })}
    </div>
  );
}

function TypewriterText({ texts }) {
  const [display, setDisplay] = useState('');
  const [textIdx, setTextIdx] = useState(0);
  const [charIdx, setCharIdx] = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const current = texts[textIdx];
    let timeout;
    if (!deleting && charIdx < current.length) {
      timeout = setTimeout(() => setCharIdx(c => c + 1), 60);
    } else if (!deleting && charIdx === current.length) {
      timeout = setTimeout(() => setDeleting(true), 2200);
    } else if (deleting && charIdx > 0) {
      timeout = setTimeout(() => setCharIdx(c => c - 1), 35);
    } else {
      setDeleting(false);
      setTextIdx(i => (i + 1) % texts.length);
    }
    setDisplay(current.slice(0, charIdx));
    return () => clearTimeout(timeout);
  }, [charIdx, deleting, textIdx, texts]);

  return (
    <span style={{ color: '#f39c12' }}>
      {display}
      <span style={{
        display: 'inline-block', width: '2px', height: '1em',
        backgroundColor: '#f39c12', marginLeft: '3px',
        animation: 'blink 1s step-end infinite',
        verticalAlign: 'text-bottom'
      }} />
    </span>
  );
}

function StatCard({ value, label, delay }) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), delay);
    return () => clearTimeout(t);
  }, [delay]);
  return (
    <div style={{
      textAlign: 'center', padding: '24px 28px',
      border: '1px solid #1a1a1a', borderRadius: '12px',
      backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)',
      transition: 'all 0.6s ease',
      opacity: visible ? 1 : 0,
      transform: visible ? 'translateY(0)' : 'translateY(20px)'
    }}>
      <div style={{ fontSize: '1.8rem', fontWeight: '800', color: '#f39c12', fontFamily: "'Playfair Display', serif" }}>
        {value}
      </div>
      <div style={{ fontSize: '0.7rem', color: '#444', marginTop: '4px', letterSpacing: '2px', textTransform: 'uppercase' }}>
        {label}
      </div>
    </div>
  );
}

function FeatureCard({ icon, title, desc, delay }) {
  const [visible, setVisible] = useState(false);
  const [hovered, setHovered] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), delay);
    return () => clearTimeout(t);
  }, [delay]);
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        padding: '26px', borderRadius: '14px',
        border: `1px solid ${hovered ? '#f39c12' : '#1a1a1a'}`,
        backgroundColor: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(10px)',
        transition: 'all 0.3s ease',
        opacity: visible ? 1 : 0,
        transform: visible ? (hovered ? 'translateY(-4px)' : 'translateY(0)') : 'translateY(30px)',
        cursor: 'default'
      }}
    >
      <div style={{ fontSize: '1.8rem', marginBottom: '10px' }}>{icon}</div>
      <div style={{ fontWeight: 'bold', color: '#fff', marginBottom: '8px', fontSize: '0.9rem', fontFamily: "'Playfair Display', serif" }}>
        {title}
      </div>
      <div style={{ color: '#555', fontSize: '0.78rem', lineHeight: '1.7' }}>{desc}</div>
    </div>
  );
}

function ChainlinkSection({ t }) {
  const [visible, setVisible] = useState(false);
  const [imgError, setImgError] = useState(false);
  const ref = React.useRef();

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setVisible(true); },
      { threshold: 0.2 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={ref} style={{
      position: 'relative', zIndex: 10,
      padding: '80px 48px',
      maxWidth: '1000px', margin: '0 auto'
    }}>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '40px', alignItems: 'center',
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(40px)',
        transition: 'all 0.8s ease'
      }}>

        {/* izquierda — imagen y badge */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', alignItems: 'flex-start' }}>
          <div style={{ fontSize: '0.7rem', color: '#2563eb', letterSpacing: '3px', textTransform: 'uppercase' }}>
            {t.chainlink.eyebrow}
          </div>

          <h2 style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: 'clamp(1.6rem, 3vw, 2.4rem)',
            fontWeight: '700', color: '#fff',
            letterSpacing: '-0.5px', margin: 0, lineHeight: '1.2'
          }}>
            {t.chainlink.title}
          </h2>

          <div style={{
            borderRadius: '14px', overflow: 'hidden',
            border: '1px solid #1a2a4a',
            backgroundColor: '#0a0f1a',
            padding: '20px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            width: '100%', maxWidth: '280px'
          }}>
            {imgError ? (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', padding: '20px' }}>
                <svg width="48" height="48" viewBox="0 0 32 32" fill="none">
                  <path d="M16 2L4 9v14l12 7 12-7V9L16 2z" fill="none" stroke="#2563eb" strokeWidth="1.5" />
                  <path d="M16 8l-6 3.5v7L16 22l6-3.5v-7L16 8z" fill="#2563eb" opacity="0.4" />
                </svg>
                <span style={{ color: '#2563eb', fontSize: '0.8rem', letterSpacing: '1px' }}>CHAINLINK CRE</span>
              </div>
            ) : (
              <img
                src={chainlinkImg}
                alt="Chainlink CRE"
                onError={() => setImgError(true)}
                style={{ width: '100%', objectFit: 'contain', borderRadius: '8px' }}
              />
            )}
          </div>

          <div style={{
            display: 'inline-block',
            backgroundColor: 'rgba(37,99,235,0.1)',
            border: '1px solid rgba(37,99,235,0.3)',
            borderRadius: '100px',
            padding: '4px 14px',
            fontSize: '0.7rem', color: '#2563eb', letterSpacing: '1px'
          }}>
            {t.chainlink.badge}
          </div>
        </div>

        {/* derecha — descripcion y puntos */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <p style={{ color: '#555', fontSize: '0.88rem', lineHeight: '1.8', fontWeight: '300', margin: 0 }}>
            {t.chainlink.desc}
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {t.chainlink.points.map((point, i) => (
              <div
                key={i}
                style={{
                  display: 'flex', gap: '12px', alignItems: 'flex-start',
                  padding: '12px 16px',
                  backgroundColor: 'rgba(37,99,235,0.04)',
                  border: '1px solid #0d1a2e',
                  borderRadius: '10px',
                  transition: 'border-color 0.2s',
                  cursor: 'default'
                }}
                onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(37,99,235,0.3)'}
                onMouseLeave={e => e.currentTarget.style.borderColor = '#0d1a2e'}
              >
                <span style={{ fontSize: '1rem', flexShrink: 0 }}>{point.icon}</span>
                <span style={{ color: '#444', fontSize: '0.78rem', lineHeight: '1.6' }}>{point.text}</span>
              </div>
            ))}
          </div>


          <a href="https://chain.link/chainlink-runtime-environment"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              color: '#2563eb', fontSize: '0.8rem', textDecoration: 'none',
              letterSpacing: '0.5px', transition: 'color 0.2s',
              display: 'inline-flex', alignItems: 'center', gap: '4px'
            }}
            onMouseEnter={e => e.currentTarget.style.color = '#4f8ef7'}
            onMouseLeave={e => e.currentTarget.style.color = '#2563eb'}
          >
            {t.chainlink.link}
          </a>
        </div>
      </div>
    </section>
  );
}

export default function LandingPage({ onLogin }) {
  const [lang, setLang] = useState('en');
  const [heroVisible, setHeroVisible] = useState(false);
  const [btnHover, setBtnHover] = useState(false);

  const t = LANGS[lang];

  useEffect(() => {
    const timer = setTimeout(() => setHeroVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const floatingPieces = [
    { piece: '♚', top: '8%', left: '5%', dur: 6, delay: 0 },
    { piece: '♛', top: '15%', right: '8%', dur: 7, delay: 1 },
    { piece: '♜', bottom: '20%', left: '3%', dur: 5, delay: 0.5 },
    { piece: '♞', bottom: '30%', right: '5%', dur: 8, delay: 2 },
    { piece: '♝', top: '45%', left: '8%', dur: 6, delay: 1.5 },
    { piece: '♟', top: '60%', right: '10%', dur: 7, delay: 0.8 },
  ];

  return (
    <div style={{
      backgroundColor: '#080808', color: '#fff',
      minHeight: '100vh', fontFamily: "'DM Sans', sans-serif",
      position: 'relative', overflow: 'hidden'
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;800&family=DM+Sans:wght@300;400;500&display=swap');
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }
        @keyframes floatPiece { from{transform:translateY(0) rotate(-3deg)} to{transform:translateY(-18px) rotate(3deg)} }
        @keyframes rotateSlow { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
        @keyframes pulseGold { 0%,100%{box-shadow:0 0 0 0 rgba(243,156,18,0)} 50%{box-shadow:0 0 0 10px rgba(243,156,18,0.1)} }
      `}</style>

      <ChessBackground />

      {floatingPieces.map((fp, i) => (
        <div key={i} style={{
          position: 'fixed', fontSize: '2rem', color: '#f39c12', opacity: 0.1,
          pointerEvents: 'none', zIndex: 1,
          top: fp.top, left: fp.left, bottom: fp.bottom, right: fp.right,
          animation: `floatPiece ${fp.dur}s ease-in-out ${fp.delay}s infinite alternate`
        }}>
          {fp.piece}
        </div>
      ))}

      <div style={{
        position: 'fixed', inset: 0, zIndex: 1, pointerEvents: 'none',
        background: 'repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(0,0,0,0.025) 2px,rgba(0,0,0,0.025) 4px)'
      }} />

      {/* HEADER */}
      <header style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 48px', height: '64px',
        backgroundColor: 'rgba(8,8,8,0.9)', backdropFilter: 'blur(16px)',
        borderBottom: '1px solid #111'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '1.3rem' }}>♟</span>
          <span style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.25rem', fontWeight: '800' }}>
            Chess<span style={{ color: '#f39c12' }}>Fi</span>
          </span>
        </div>

        <nav style={{ display: 'flex', gap: '28px', alignItems: 'center' }}>
          {[
            { label: t.nav.how, id: 'how' },
            { label: t.nav.security, id: 'security' },
            { label: t.nav.roadmap, id: 'roadmap' }
          ].map(item => (
            <span
              key={item.id}
              onClick={() => {
                document.getElementById(item.id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }}
              style={{
                color: '#444', fontSize: '0.8rem', cursor: 'pointer',
                letterSpacing: '0.5px', transition: 'color 0.2s'
              }}
              onMouseEnter={e => e.target.style.color = '#f39c12'}
              onMouseLeave={e => e.target.style.color = '#444'}
            >
              {item.label}
            </span>
          ))}

          <div style={{ display: 'flex', gap: '4px' }}>
            {['es', 'en'].map(l => (
              <button key={l} onClick={() => setLang(l)} style={{
                padding: '4px 10px', borderRadius: '4px', cursor: 'pointer',
                backgroundColor: lang === l ? '#f39c12' : 'transparent',
                border: `1px solid ${lang === l ? '#f39c12' : '#222'}`,
                color: lang === l ? '#000' : '#444',
                fontSize: '0.7rem', fontWeight: lang === l ? 'bold' : 'normal',
                transition: 'all 0.2s', textTransform: 'uppercase'
              }}>
                {l}
              </button>
            ))}
          </div>

          <button
            onClick={onLogin}
            onMouseEnter={() => setBtnHover(true)}
            onMouseLeave={() => setBtnHover(false)}
            style={{
              padding: '8px 22px',
              backgroundColor: btnHover ? '#f39c12' : 'transparent',
              border: '1px solid #f39c12', borderRadius: '6px',
              color: btnHover ? '#000' : '#f39c12',
              fontWeight: '600', fontSize: '0.8rem', cursor: 'pointer',
              transition: 'all 0.2s',
              animation: 'pulseGold 3s ease-in-out infinite'
            }}
          >
            {t.nav.connect}
          </button>
        </nav>
      </header>

      {/* HERO */}
      <section style={{
        position: 'relative', zIndex: 10,
        minHeight: '100vh',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        textAlign: 'center', padding: '0 24px', paddingTop: '64px'
      }}>
        <div style={{
          transition: 'all 1s ease',
          opacity: heroVisible ? 1 : 0,
          transform: heroVisible ? 'translateY(0)' : 'translateY(40px)'
        }}>
          <div style={{
            display: 'inline-block', border: '1px solid #1f1f1f', borderRadius: '100px',
            padding: '5px 16px', fontSize: '0.7rem', color: '#f39c12',
            letterSpacing: '3px', textTransform: 'uppercase', marginBottom: '28px',
            backgroundColor: 'rgba(243,156,18,0.05)'
          }}>
            {t.hero.badge}
          </div>

          <h1 style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: 'clamp(3rem, 8vw, 7rem)',
            fontWeight: '800', lineHeight: '1.05',
            marginBottom: '8px', letterSpacing: '-2px', margin: 0
          }}>
            Chess<span style={{ color: '#f39c12' }}>Fi</span>
          </h1>

          <div style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: 'clamp(1rem, 2.5vw, 1.5rem)',
            color: '#333', marginBottom: '24px', marginTop: '12px',
            letterSpacing: '-0.5px', minHeight: '2.5rem'
          }}>
            <TypewriterText texts={t.hero.taglines} />
          </div>

          <p style={{
            color: '#3a3a3a', fontSize: '0.88rem', lineHeight: '1.9',
            maxWidth: '500px', margin: '0 auto 48px', fontWeight: '300'
          }}>
            {t.hero.desc}
          </p>

          <div style={{ display: 'flex', gap: '14px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button
              onClick={onLogin}
              style={{
                padding: '14px 36px', backgroundColor: '#f39c12',
                border: 'none', borderRadius: '8px',
                fontWeight: '700', fontSize: '0.88rem', color: '#000',
                cursor: 'pointer', letterSpacing: '0.5px', transition: 'all 0.2s',
                fontFamily: "'DM Sans', sans-serif"
              }}
              onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#e67e22'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
              onMouseLeave={e => { e.currentTarget.style.backgroundColor = '#f39c12'; e.currentTarget.style.transform = 'translateY(0)'; }}
            >
              {t.hero.cta}
            </button>

            <button style={{
              padding: '14px 36px', backgroundColor: 'transparent',
              border: '1px solid #1e1e1e', borderRadius: '8px',
              fontWeight: '400', fontSize: '0.88rem', color: '#444',
              cursor: 'pointer', transition: 'all 0.2s',
              fontFamily: "'DM Sans', sans-serif"
            }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = '#f39c12'; e.currentTarget.style.color = '#f39c12'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = '#1e1e1e'; e.currentTarget.style.color = '#444'; }}
            >
              {t.hero.how}
            </button>
          </div>
        </div>

        <div style={{
          position: 'absolute', bottom: '-80px', right: '-80px',
          width: '320px', height: '320px', opacity: 0.035,
          display: 'grid', gridTemplateColumns: 'repeat(8, 1fr)',
          animation: 'rotateSlow 60s linear infinite', pointerEvents: 'none'
        }}>
          {Array.from({ length: 64 }).map((_, i) => (
            <div key={i} style={{
              backgroundColor: (Math.floor(i / 8) + i) % 2 === 0 ? '#f39c12' : 'transparent'
            }} />
          ))}
        </div>
      </section>

      {/* STATS */}
      <section style={{
        position: 'relative', zIndex: 10,
        padding: '60px 48px',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
        gap: '14px', maxWidth: '860px', margin: '0 auto'
      }}>
        {t.stats.map((s, i) => (
          <StatCard key={i} value={s.value} label={s.label} delay={200 + i * 150} />
        ))}
      </section>

      {/* FEATURES */}
      <section style={{
        position: 'relative', zIndex: 10,
        padding: '20px 48px 60px',
        maxWidth: '960px', margin: '0 auto'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <div style={{
            fontSize: '0.68rem', color: '#f39c12', letterSpacing: '4px',
            textTransform: 'uppercase', marginBottom: '10px'
          }}>
            {t.built.eyebrow}
          </div>
          <h2 style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: 'clamp(1.8rem, 4vw, 2.6rem)',
            fontWeight: '700', color: '#fff', letterSpacing: '-1px', margin: 0
          }}>
            {t.built.title}
          </h2>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '14px'
        }}>
          {t.features.map((f, i) => (
            <FeatureCard key={i} icon={f.icon} title={f.title} desc={f.desc} delay={200 + i * 120} />
          ))}
        </div>
      </section>

      {/* CHAINLINK CRE */}
      <div style={{
        position: 'relative', zIndex: 10,
        borderTop: '1px solid #0f0f0f',
        borderBottom: '1px solid #0f0f0f',
        backgroundColor: 'rgba(37,99,235,0.02)'
      }}>
        <ChainlinkSection t={t} />
      </div>
      {/* HOW IT WORKS */}
      <div id='how' style={{ position: 'relative', zIndex: 10, borderTop: '1px solid #0f0f0f' }}>
        <HowItWorks lang={lang} />
      </div>

      {/* SECURITY */}
      <div id='security' style={{ position: 'relative', zIndex: 10, borderTop: '1px solid #0f0f0f', backgroundColor: 'rgba(0,0,0,0.3)' }}>
        <Security lang={lang} />
      </div>

      {/* ROADMAP */}
      <div id="roadmap" style={{ position: 'relative', zIndex: 10, borderTop: '1px solid #0f0f0f' }}>
        <Roadmap lang={lang} />
      </div>

      {/* FOOTER */}
      <footer style={{
        position: 'relative', zIndex: 10,
        borderTop: '1px solid #0f0f0f',
        padding: '20px 48px',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center'
      }}>
        <span style={{ fontFamily: "'Playfair Display', serif", color: '#1e1e1e', fontSize: '0.9rem' }}>
          Chess<span style={{ color: '#f39c12' }}>Fi</span>
        </span>
        <span style={{ color: '#1e1e1e', fontSize: '0.65rem', letterSpacing: '2px' }}>
          {t.footer.net}
        </span>
      </footer>
    </div>
  );
}