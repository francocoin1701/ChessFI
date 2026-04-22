import React, { useState, useEffect } from "react";

export default function Intro({ onFinish }) {
  const [scene, setScene] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timings = [2000, 2200, 2200, 2400, 1800];
    let total = 0;
    const timeouts = [];

    timings.forEach((t, i) => {
      total += t;
      timeouts.push(setTimeout(() => setScene(i + 1), total));
    });

    timeouts.push(setTimeout(() => {
      setVisible(false);
      setTimeout(onFinish, 800);
    }, total + 600));

    return () => timeouts.forEach(clearTimeout);
  }, [onFinish]);

  if (!visible && scene >= 5) return null;

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 9999,
      backgroundColor: '#000',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      overflow: 'hidden',
      opacity: !visible ? 0 : 1,
      transition: 'opacity 0.8s ease'
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;800&family=DM+Sans:wght@300;400&display=swap');

        @keyframes walkPawn {
          0%   { transform: translateX(-120px); }
          100% { transform: translateX(0px); }
        }
        @keyframes bobPawn {
          0%,100% { transform: translateY(0px) rotate(-2deg); }
          50%     { transform: translateY(-6px) rotate(2deg); }
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes chainPulse {
          0%,100% { filter: drop-shadow(0 0 6px #f39c12); }
          50%     { filter: drop-shadow(0 0 20px #f39c12) drop-shadow(0 0 40px #f39c12); }
        }
        @keyframes linkGlow {
          0%,100% { filter: drop-shadow(0 0 6px #2563eb); }
          50%     { filter: drop-shadow(0 0 20px #2563eb) drop-shadow(0 0 40px #4f8ef7); }
        }
        @keyframes handshakeShake {
          0%,100% { transform: scale(1) rotate(0deg); }
          25%     { transform: scale(1.08) rotate(-2deg); }
          75%     { transform: scale(1.08) rotate(2deg); }
        }
        @keyframes smokeRise {
          0%   { opacity: 0; transform: translateY(40px) scale(0.6); }
          40%  { opacity: 0.9; }
          100% { opacity: 0; transform: translateY(-160px) scale(2.2); }
        }
        @keyframes smokeRise2 {
          0%   { opacity: 0; transform: translateY(40px) scale(0.4); }
          50%  { opacity: 0.7; }
          100% { opacity: 0; transform: translateY(-180px) scale(2.8); }
        }
        @keyframes goldBurst {
          0%   { opacity: 0; transform: scale(0.2); }
          40%  { opacity: 1; transform: scale(1.2); }
          70%  { transform: scale(0.95); }
          100% { opacity: 1; transform: scale(1); }
        }
        @keyframes titleReveal {
          0%   { opacity: 0; letter-spacing: 30px; filter: blur(12px); }
          100% { opacity: 1; letter-spacing: -2px; filter: blur(0); }
        }
        @keyframes treeSway {
          0%,100% { transform: rotate(-1deg) translateX(0); }
          50%     { transform: rotate(1deg) translateX(2px); }
        }
        @keyframes lanternFlicker {
          0%,100% { opacity: 1; }
          30%     { opacity: 0.7; }
          60%     { opacity: 0.9; }
          80%     { opacity: 0.6; }
        }
        @keyframes starTwinkle {
          0%,100% { opacity: 0.3; }
          50%     { opacity: 1; }
        }
        @keyframes floatIn {
          from { opacity: 0; transform: translateY(30px) scale(0.8); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes subtitleFade {
          from { opacity: 0; }
          to   { opacity: 0.6; }
        }
      `}</style>

      {/* SKIP */}
      <button onClick={() => { setVisible(false); setTimeout(onFinish, 400); }} style={{
        position: 'absolute', top: '24px', right: '28px',
        background: 'none', border: '1px solid #222',
        color: '#333', padding: '6px 14px', borderRadius: '20px',
        cursor: 'pointer', fontSize: '0.7rem', letterSpacing: '1px',
        zIndex: 10, transition: 'all 0.2s',
        fontFamily: "'DM Sans', sans-serif"
      }}
        onMouseEnter={e => { e.target.style.borderColor = '#f39c12'; e.target.style.color = '#f39c12'; }}
        onMouseLeave={e => { e.target.style.borderColor = '#222'; e.target.style.color = '#333'; }}
      >
        SALTAR
      </button>

      {/* ESCENA 1 — EL PEON EN EL BOSQUE */}
      {scene === 0 && (
        <div style={{ animation: 'fadeIn 0.6s ease forwards', width: '100%', position: 'relative', height: '100vh', overflow: 'hidden' }}>

          {/* estrellas */}
          {[...Array(30)].map((_, i) => (
            <div key={i} style={{
              position: 'absolute',
              top: `${Math.random() * 45}%`,
              left: `${Math.random() * 100}%`,
              width: i % 3 === 0 ? '2px' : '1px',
              height: i % 3 === 0 ? '2px' : '1px',
              borderRadius: '50%',
              backgroundColor: '#fff',
              animation: `starTwinkle ${1.5 + Math.random() * 2}s ease-in-out ${Math.random() * 2}s infinite`
            }} />
          ))}

          {/* luna */}
          <div style={{
            position: 'absolute', top: '8%', right: '15%',
            width: '48px', height: '48px', borderRadius: '50%',
            backgroundColor: '#fffbe6',
            boxShadow: '0 0 30px rgba(255,251,230,0.4)',
            animation: 'fadeIn 1s ease forwards'
          }} />

          {/* arboles */}
          {[-15, 5, 22, 40, 58, 72, 85, 98].map((left, i) => (
            <div key={i} style={{
              position: 'absolute', bottom: '18%', left: `${left}%`,
              animation: `treeSway ${3 + i * 0.4}s ease-in-out ${i * 0.2}s infinite`,
              transformOrigin: 'bottom center'
            }}>
              <svg width={40 + (i % 3) * 20} height={120 + (i % 4) * 40} viewBox="0 0 60 160" fill="none">
                <polygon points="30,0 60,100 0,100" fill={`hsl(${130 + i * 5}, 20%, ${8 + i * 2}%)`} />
                <polygon points="30,30 55,120 5,120" fill={`hsl(${130 + i * 5}, 20%, ${6 + i * 2}%)`} />
                <rect x="22" y="120" width="16" height="40" fill="#1a0f00" />
              </svg>
            </div>
          ))}

          {/* suelo */}
          <div style={{
            position: 'absolute', bottom: 0, left: 0, right: 0, height: '22%',
            background: 'linear-gradient(to top, #0a0800, #111a0a)'
          }} />

          {/* niebla */}
          <div style={{
            position: 'absolute', bottom: '18%', left: 0, right: 0, height: '120px',
            background: 'linear-gradient(to top, rgba(20,30,10,0.8), transparent)',
            filter: 'blur(8px)'
          }} />

          {/* peon caminando con linterna */}
          <div style={{
            position: 'absolute', bottom: '22%', left: '50%',
            transform: 'translateX(-50%)',
            animation: 'walkPawn 1.2s ease-out forwards',
            display: 'flex', flexDirection: 'column', alignItems: 'center'
          }}>
            {/* halo linterna */}
            <div style={{
              position: 'absolute', top: '-20px', left: '-30px',
              width: '80px', height: '80px', borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(243,156,18,0.25) 0%, transparent 70%)',
              animation: 'lanternFlicker 1.8s ease-in-out infinite'
            }} />

            {/* peon SVG */}
            <div style={{ animation: 'bobPawn 1.4s ease-in-out infinite', fontSize: '3.5rem', filter: 'drop-shadow(0 0 12px rgba(243,156,18,0.6))' }}>
              ♟
            </div>

            {/* linterna */}
            <div style={{
              position: 'absolute', right: '-18px', top: '8px',
              fontSize: '1.2rem',
              animation: 'lanternFlicker 1.8s ease-in-out infinite'
            }}>🏮</div>
          </div>

          {/* texto */}
          <div style={{
            position: 'absolute', bottom: '8%', width: '100%', textAlign: 'center',
            animation: 'fadeUp 0.8s ease 0.8s both'
          }}>
            <div style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: '1.1rem', color: '#666', letterSpacing: '3px', textTransform: 'uppercase'
            }}>
              Un jugador. Solo en la oscuridad.
            </div>
          </div>
        </div>
      )}

      {/* ESCENA 2 — ENCUENTRA LA BLOCKCHAIN */}
      {scene === 1 && (
        <div style={{ animation: 'fadeIn 0.5s ease forwards', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '32px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '48px' }}>

            {/* peon */}
            <div style={{ animation: 'floatIn 0.6s ease forwards', textAlign: 'center' }}>
              <div style={{ fontSize: '3.5rem', filter: 'drop-shadow(0 0 10px rgba(243,156,18,0.5))' }}>♟</div>
              <div style={{ color: '#333', fontSize: '0.65rem', letterSpacing: '2px', marginTop: '6px' }}>JUGADOR</div>
            </div>

            {/* separador */}
            <div style={{ color: '#1a1a1a', fontSize: '1.5rem', animation: 'fadeIn 0.5s ease 0.4s both' }}>✦</div>

            {/* blockchain */}
            <div style={{ animation: 'floatIn 0.7s ease 0.3s both', textAlign: 'center' }}>
              <div style={{
                fontSize: '3rem',
                animation: 'chainPulse 2s ease-in-out infinite',
                filter: 'drop-shadow(0 0 12px #f39c12)'
              }}>⛓</div>
              <div style={{ color: '#333', fontSize: '0.65rem', letterSpacing: '2px', marginTop: '6px' }}>BLOCKCHAIN</div>
            </div>

            <div style={{ color: '#1a1a1a', fontSize: '1.5rem', animation: 'fadeIn 0.5s ease 0.7s both' }}>✦</div>

            {/* chainlink CRE */}
            <div style={{ animation: 'floatIn 0.7s ease 0.6s both', textAlign: 'center' }}>
              <div style={{
                width: '56px', height: '56px', borderRadius: '50%',
                backgroundColor: '#0d1117',
                border: '2px solid #2563eb',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                animation: 'linkGlow 2s ease-in-out infinite',
                margin: '0 auto'
              }}>
                <svg width="28" height="28" viewBox="0 0 32 32" fill="none">
                  <path d="M16 2L4 9v14l12 7 12-7V9L16 2z" fill="none" stroke="#2563eb" strokeWidth="2" />
                  <path d="M16 8l-6 3.5v7L16 22l6-3.5v-7L16 8z" fill="#2563eb" opacity="0.5" />
                </svg>
              </div>
              <div style={{ color: '#333', fontSize: '0.65rem', letterSpacing: '2px', marginTop: '6px' }}>CHAINLINK CRE</div>
            </div>
          </div>

          <div style={{ animation: 'fadeUp 0.6s ease 0.8s both', textAlign: 'center' }}>
            <div style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: '1.1rem', color: '#444', letterSpacing: '2px'
            }}>
              Tres fuerzas. Un encuentro inevitable.
            </div>
          </div>
        </div>
      )}

      {/* ESCENA 3 — SE TOMAN DE LAS MANOS */}
      {scene === 2 && (
        <div style={{ animation: 'fadeIn 0.5s ease forwards', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '40px' }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: '16px',
            animation: 'handshakeShake 1.2s ease-in-out infinite'
          }}>
            <div style={{ fontSize: '2.8rem', filter: 'drop-shadow(0 0 8px rgba(243,156,18,0.7))' }}>♟</div>
            <div style={{ fontSize: '1.8rem', color: '#f39c12', animation: 'chainPulse 1s infinite' }}>⛓</div>
            <div style={{
              width: '44px', height: '44px', borderRadius: '50%',
              border: '2px solid #2563eb',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              animation: 'linkGlow 1s infinite'
            }}>
              <svg width="22" height="22" viewBox="0 0 32 32" fill="none">
                <path d="M16 2L4 9v14l12 7 12-7V9L16 2z" fill="none" stroke="#2563eb" strokeWidth="2.5" />
                <path d="M16 8l-6 3.5v7L16 22l6-3.5v-7L16 8z" fill="#2563eb" opacity="0.6" />
              </svg>
            </div>
          </div>

          {/* humo violeta subiendo */}
          <div style={{ position: 'relative', width: '300px', height: '180px' }}>
            {[...Array(12)].map((_, i) => (
              <div key={i} style={{
                position: 'absolute',
                bottom: 0,
                left: `${30 + (i % 5) * 12}%`,
                width: `${16 + (i % 3) * 8}px`,
                height: `${16 + (i % 3) * 8}px`,
                borderRadius: '50%',
                backgroundColor: i < 6
                  ? `hsla(${270 + i * 10}, 80%, 40%, 0.6)`
                  : `hsla(${45 + i * 5}, 90%, 55%, 0.5)`,
                filter: 'blur(8px)',
                animation: `${i % 2 === 0 ? 'smokeRise' : 'smokeRise2'} ${1.5 + i * 0.15}s ease-out ${i * 0.1}s infinite`
              }} />
            ))}
          </div>

          <div style={{ animation: 'fadeUp 0.6s ease 0.4s both', textAlign: 'center' }}>
            <div style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: '1.1rem', color: '#555', letterSpacing: '2px'
            }}>
              Algo nuevo está naciendo...
            </div>
          </div>
        </div>
      )}

      {/* ESCENA 4 — EXPLOSION DORADA Y NOMBRE */}
      {scene === 3 && (
        <div style={{ animation: 'fadeIn 0.3s ease forwards', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '24px', position: 'relative' }}>

          {/* rayos de luz */}
          {[...Array(12)].map((_, i) => (
            <div key={i} style={{
              position: 'absolute',
              top: '50%', left: '50%',
              width: '2px',
              height: `${80 + i * 15}px`,
              backgroundColor: '#f39c12',
              opacity: 0.15,
              transformOrigin: 'top center',
              transform: `rotate(${i * 30}deg) translateX(-50%)`,
              animation: 'fadeIn 0.4s ease forwards'
            }} />
          ))}

          {/* destellos */}
          {[...Array(20)].map((_, i) => (
            <div key={i} style={{
              position: 'absolute',
              top: `${20 + Math.random() * 60}%`,
              left: `${10 + Math.random() * 80}%`,
              width: `${2 + Math.random() * 4}px`,
              height: `${2 + Math.random() * 4}px`,
              borderRadius: '50%',
              backgroundColor: i % 3 === 0 ? '#fff' : '#f39c12',
              animation: `starTwinkle ${0.5 + Math.random()}s ease-in-out ${Math.random() * 0.5}s infinite`
            }} />
          ))}

          <div style={{ animation: 'goldBurst 0.8s ease forwards', textAlign: 'center', position: 'relative', zIndex: 2 }}>
            <h1 style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: 'clamp(4rem, 12vw, 9rem)',
              fontWeight: '800',
              margin: 0,
              animation: 'titleReveal 1s ease 0.2s both',
              background: 'linear-gradient(135deg, #f39c12 0%, #fff8e1 40%, #f39c12 70%, #e67e22 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              filter: 'drop-shadow(0 0 30px rgba(243,156,18,0.6))'
            }}>
              ChessFi
            </h1>
          </div>

          <div style={{
            animation: 'subtitleFade 0.8s ease 0.8s both',
            opacity: 0,
            textAlign: 'center',
            position: 'relative', zIndex: 2
          }}>
            <div style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: '0.85rem', color: '#888',
              letterSpacing: '3px', textTransform: 'uppercase'
            }}>
              Hoy nace lo que cambia las apuestas para siempre
            </div>
          </div>
        </div>
      )}

      {/* ESCENA 5 — FADE OUT */}
      {scene >= 4 && (
        <div style={{
          animation: 'fadeIn 0.4s ease forwards',
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', gap: '16px'
        }}>
          <h1 style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: 'clamp(3rem, 8vw, 6rem)',
            fontWeight: '800',
            background: 'linear-gradient(135deg, #f39c12, #fff8e1, #f39c12)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            margin: 0,
            filter: 'drop-shadow(0 0 20px rgba(243,156,18,0.4))'
          }}>
            ChessFi
          </h1>
          <div style={{ color: '#333', fontSize: '0.75rem', letterSpacing: '3px' }}>
            CARGANDO...
          </div>
        </div>
      )}
    </div>
  );
}