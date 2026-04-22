import React, { useEffect, useRef, useState } from "react";

const CHESS_PIECES = ['♟', '♞', '♝', '♜', '♛', '♚', '♙', '♘', '♗', '♖', '♕', '♔'];

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
      opacity: 0.07,
      pointerEvents: 'none'
    }}>
      {Array.from({ length: cols * rows }).map((_, i) => {
        const col = i % cols;
        const row = Math.floor(i / cols);
        const isDark = (col + row) % 2 === 1;
        return (
          <div key={i} style={{
            width: size, height: size,
            backgroundColor: isDark ? '#f39c12' : 'transparent'
          }} />
        );
      })}
    </div>
  );
}

function FloatingPiece({ piece, style }) {
  return (
    <div style={{
      position: 'absolute',
      fontSize: '2rem',
      color: '#f39c12',
      opacity: 0.12,
      animation: `floatPiece ${style.duration}s ease-in-out ${style.delay}s infinite alternate`,
      ...style
    }}>
      {piece}
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
    } else if (deleting && charIdx === 0) {
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
      textAlign: 'center', padding: '24px 32px',
      border: '1px solid #1f1f1f',
      borderRadius: '12px',
      backgroundColor: 'rgba(0,0,0,0.6)',
      backdropFilter: 'blur(8px)',
      transition: 'all 0.6s ease',
      opacity: visible ? 1 : 0,
      transform: visible ? 'translateY(0)' : 'translateY(20px)'
    }}>
      <div style={{ fontSize: '2rem', fontWeight: '800', color: '#f39c12', fontFamily: "'Playfair Display', serif" }}>
        {value}
      </div>
      <div style={{ fontSize: '0.75rem', color: '#555', marginTop: '4px', letterSpacing: '2px', textTransform: 'uppercase' }}>
        {label}
      </div>
    </div>
  );
}

function FeatureCard({ icon, title, desc, delay }) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), delay);
    return () => clearTimeout(t);
  }, [delay]);

  return (
    <div style={{
      padding: '28px', borderRadius: '14px',
      border: '1px solid #1a1a1a',
      backgroundColor: 'rgba(0,0,0,0.7)',
      backdropFilter: 'blur(10px)',
      transition: 'all 0.6s ease',
      opacity: visible ? 1 : 0,
      transform: visible ? 'translateY(0)' : 'translateY(30px)',
      cursor: 'default'
    }}
      onMouseEnter={e => {
        e.currentTarget.style.borderColor = '#f39c12';
        e.currentTarget.style.transform = 'translateY(-4px)';
      }}
      onMouseLeave={e => {
        e.currentTarget.style.borderColor = '#1a1a1a';
        e.currentTarget.style.transform = 'translateY(0)';
      }}
    >
      <div style={{ fontSize: '2rem', marginBottom: '12px' }}>{icon}</div>
      <div style={{ fontWeight: 'bold', color: '#fff', marginBottom: '8px', fontSize: '0.95rem', fontFamily: "'Playfair Display', serif" }}>
        {title}
      </div>
      <div style={{ color: '#555', fontSize: '0.8rem', lineHeight: '1.6' }}>{desc}</div>
    </div>
  );
}

export default function LandingPage({ onLogin }) {
  const [heroVisible, setHeroVisible] = useState(false);
  const [btnHover, setBtnHover] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setHeroVisible(true), 100);
    return () => clearTimeout(t);
  }, []);

  const floatingPieces = [
    { piece: '♚', style: { top: '8%', left: '5%', duration: 6, delay: 0 } },
    { piece: '♛', style: { top: '15%', right: '8%', duration: 7, delay: 1 } },
    { piece: '♜', style: { bottom: '20%', left: '3%', duration: 5, delay: 0.5 } },
    { piece: '♞', style: { bottom: '30%', right: '5%', duration: 8, delay: 2 } },
    { piece: '♝', style: { top: '45%', left: '8%', duration: 6, delay: 1.5 } },
    { piece: '♟', style: { top: '60%', right: '10%', duration: 7, delay: 0.8 } },
  ];

  return (
    <div style={{
      backgroundColor: '#080808',
      color: '#fff',
      minHeight: '100vh',
      fontFamily: "'DM Sans', sans-serif",
      position: 'relative',
      overflow: 'hidden'
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;800&family=DM+Sans:wght@300;400;500&display=swap');

        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
        @keyframes floatPiece {
          from { transform: translateY(0px) rotate(-3deg); }
          to   { transform: translateY(-18px) rotate(3deg); }
        }
        @keyframes rotateSlow {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        @keyframes pulseGold {
          0%, 100% { box-shadow: 0 0 0 0 rgba(243,156,18,0); }
          50%       { box-shadow: 0 0 0 12px rgba(243,156,18,0.12); }
        }
        @keyframes scanline {
          0%   { transform: translateY(-100%); }
          100% { transform: translateY(100vh); }
        }
      `}</style>

      <ChessBackground />

      {floatingPieces.map((fp, i) => (
        <FloatingPiece key={i} piece={fp.piece} style={fp.style} />
      ))}

      {/* scanline sutil */}
      <div style={{
        position: 'fixed', inset: 0, zIndex: 1, pointerEvents: 'none',
        background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.03) 2px, rgba(0,0,0,0.03) 4px)'
      }} />

      {/* HEADER */}
      <header style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 48px', height: '64px',
        backgroundColor: 'rgba(8,8,8,0.85)',
        backdropFilter: 'blur(16px)',
        borderBottom: '1px solid #141414'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '1.4rem' }}>♟</span>
          <span style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: '1.3rem', fontWeight: '800',
            color: '#fff', letterSpacing: '1px'
          }}>
            Chess<span style={{ color: '#f39c12' }}>Fi</span>
          </span>
        </div>

        <nav style={{ display: 'flex', gap: '32px', alignItems: 'center' }}>
          {['Cómo funciona', 'Seguridad', 'Roadmap'].map(item => (
            <span key={item} style={{
              color: '#555', fontSize: '0.82rem', cursor: 'pointer',
              letterSpacing: '0.5px', transition: 'color 0.2s'
            }}
              onMouseEnter={e => e.target.style.color = '#f39c12'}
              onMouseLeave={e => e.target.style.color = '#555'}
            >
              {item}
            </span>
          ))}

          <button
            onClick={onLogin}
            onMouseEnter={() => setBtnHover(true)}
            onMouseLeave={() => setBtnHover(false)}
            style={{
              padding: '8px 22px',
              backgroundColor: btnHover ? '#f39c12' : 'transparent',
              border: '1px solid #f39c12',
              borderRadius: '6px',
              color: btnHover ? '#000' : '#f39c12',
              fontWeight: '600', fontSize: '0.82rem',
              cursor: 'pointer',
              transition: 'all 0.2s',
              animation: 'pulseGold 3s ease-in-out infinite'
            }}
          >
            Conectar Wallet
          </button>
        </nav>
      </header>

      {/* HERO */}
      <section style={{
        position: 'relative', zIndex: 10,
        minHeight: '100vh',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        textAlign: 'center',
        padding: '0 24px',
        paddingTop: '64px'
      }}>
        <div style={{
          transition: 'all 1s ease',
          opacity: heroVisible ? 1 : 0,
          transform: heroVisible ? 'translateY(0)' : 'translateY(40px)'
        }}>
          <div style={{
            display: 'inline-block',
            border: '1px solid #1f1f1f',
            borderRadius: '100px',
            padding: '6px 18px',
            fontSize: '0.72rem',
            color: '#f39c12',
            letterSpacing: '3px',
            textTransform: 'uppercase',
            marginBottom: '32px',
            backgroundColor: 'rgba(243,156,18,0.06)'
          }}>
            Blockchain · IA · Ajedrez
          </div>

          <h1 style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: 'clamp(3rem, 8vw, 7rem)',
            fontWeight: '800',
            lineHeight: '1.05',
            marginBottom: '8px',
            letterSpacing: '-2px'
          }}>
            Chess<span style={{ color: '#f39c12' }}>Fi</span>
          </h1>

          <div style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: 'clamp(1rem, 2.5vw, 1.6rem)',
            color: '#333',
            marginBottom: '24px',
            letterSpacing: '-0.5px',
            minHeight: '2.5rem'
          }}>
            <TypewriterText texts={[
              'El árbitro que no puede ser comprado.',
              'Apuestas sin intermediarios.',
              'IA + Blockchain + Ajedrez.',
              'Gana. Cobra. Sin pedir permiso.'
            ]} />
          </div>

          <p style={{
            color: '#444', fontSize: '0.9rem', lineHeight: '1.8',
            maxWidth: '520px', margin: '0 auto 48px',
            fontWeight: '300'
          }}>
            Cada partida es un contrato inteligente. Cada victoria la verifica una IA descentralizada.
            Los fondos se liberan automáticamente — sin árbitros, sin bancos, sin confianza ciega.
          </p>

          <div style={{ display: 'flex', gap: '14px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button
              onClick={onLogin}
              style={{
                padding: '14px 36px',
                backgroundColor: '#f39c12',
                border: 'none', borderRadius: '8px',
                fontWeight: '700', fontSize: '0.9rem',
                color: '#000', cursor: 'pointer',
                letterSpacing: '0.5px',
                transition: 'all 0.2s',
                fontFamily: "'DM Sans', sans-serif"
              }}
              onMouseEnter={e => {
                e.currentTarget.style.backgroundColor = '#e67e22';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.backgroundColor = '#f39c12';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              Jugar ahora →
            </button>

            <button style={{
              padding: '14px 36px',
              backgroundColor: 'transparent',
              border: '1px solid #222', borderRadius: '8px',
              fontWeight: '400', fontSize: '0.9rem',
              color: '#555', cursor: 'pointer',
              fontFamily: "'DM Sans', sans-serif",
              transition: 'all 0.2s'
            }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = '#f39c12';
                e.currentTarget.style.color = '#f39c12';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = '#222';
                e.currentTarget.style.color = '#555';
              }}
            >
              Cómo funciona
            </button>
          </div>
        </div>

        {/* tablero decorativo giratorio */}
        <div style={{
          position: 'absolute', bottom: '-80px', right: '-80px',
          width: '360px', height: '360px', opacity: 0.04,
          display: 'grid', gridTemplateColumns: 'repeat(8, 1fr)',
          animation: 'rotateSlow 60s linear infinite',
          pointerEvents: 'none'
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
        padding: '80px 48px',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
        gap: '16px', maxWidth: '900px', margin: '0 auto'
      }}>
        <StatCard value="100%" label="Sin intermediarios" delay={200} />
        <StatCard value="IA" label="Árbitro descentralizado" delay={350} />
        <StatCard value="0%" label="Manipulación posible" delay={500} />
        <StatCard value="ETH" label="Pagos instantáneos" delay={650} />
      </section>

      {/* FEATURES */}
      <section style={{
        position: 'relative', zIndex: 10,
        padding: '40px 48px 100px',
        maxWidth: '960px', margin: '0 auto'
      }}>
        <div style={{
          textAlign: 'center', marginBottom: '56px'
        }}>
          <div style={{
            fontSize: '0.7rem', color: '#f39c12', letterSpacing: '4px',
            textTransform: 'uppercase', marginBottom: '12px'
          }}>
            Por qué ChessFi
          </div>
          <h2 style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: 'clamp(1.8rem, 4vw, 2.8rem)',
            fontWeight: '700', color: '#fff',
            letterSpacing: '-1px'
          }}>
            Construido diferente
          </h2>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: '16px'
        }}>
          <FeatureCard
            icon="⚖️"
            title="Árbitro sin corrupción"
            desc="Una IA analiza cada partida y el resultado se escribe en la blockchain. Nadie puede alterar el veredicto."
            delay={200}
          />
          <FeatureCard
            icon="🔒"
            title="Fondos en contrato"
            desc="Tu dinero vive en un smart contract auditado. Ni nosotros podemos tocarlo — solo el ganador puede cobrarlo."
            delay={350}
          />
          <FeatureCard
            icon="⚡"
            title="Pago automático"
            desc="Al detectar el mate, el contrato libera los fondos al ganador sin intervención humana ni demoras."
            delay={500}
          />
          <FeatureCard
            icon="♟"
            title="Solo ajedrez puro"
            desc="Sin rankings manipulados, sin matchmaking opaco. Pon tu apuesta, juega tu partida, cobra si ganas."
            delay={650}
          />
          <FeatureCard
            icon="🌐"
            title="Sin fronteras"
            desc="Cualquier wallet en cualquier parte del mundo puede desafiarte. El contrato no tiene jurisdicción."
            delay={800}
          />
          <FeatureCard
            icon="👁"
            title="Todo verificable"
            desc="Cada partida, cada pago, cada movimiento queda registrado en cadena. Auditable por cualquiera, para siempre."
            delay={950}
          />
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{
        position: 'relative', zIndex: 10,
        borderTop: '1px solid #111',
        padding: '24px 48px',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center'
      }}>
        <span style={{ fontFamily: "'Playfair Display', serif", color: '#222', fontSize: '0.9rem' }}>
          Chess<span style={{ color: '#f39c12' }}>Fi</span>
        </span>
        <span style={{ color: '#2a2a2a', fontSize: '0.7rem', letterSpacing: '1px' }}>
          TESTNET · SEPOLIA
        </span>
      </footer>
    </div>
  );
}