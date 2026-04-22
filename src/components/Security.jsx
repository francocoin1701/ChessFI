import React, { useState, useEffect, useRef } from "react";

const contentEs = {
  eyebrow: 'Por qué confiar',
  title: 'Seguridad sin compromisos',
  subtitle: 'No pedimos confianza. La hacemos innecesaria.',
  pillars: [
    {
      icon: '🔒',
      color: '#f39c12',
      title: 'Contrato inteligente auditado',
      desc: 'Los fondos viven en un smart contract en Ethereum Sepolia. Ni nosotros ni nadie puede moverlos — solo el contrato puede liberarlos, y únicamente cuando se cumplan las condiciones programadas.',
      tag: 'Ethereum'
    },
    {
      icon: '🧠',
      color: '#2563eb',
      title: 'IA descentralizada como árbitro',
      desc: 'Al terminar cada partida, una IA analiza el PGN oficial guardado en cadena. El análisis no corre en nuestros servidores — corre en la red descentralizada de Chainlink, con consenso entre múltiples nodos independientes.',
      tag: 'Chainlink CRE'
    },
    {
      icon: '⛓',
      color: '#7c3aed',
      title: 'Workflows verificables on-chain',
      desc: 'Cada paso del proceso de liquidación es un workflow de Chainlink CRE — ejecutado por una red de oráculos con consenso BFT. Ningún nodo puede alterar el resultado por sí solo. Cada operación queda registrada y es auditable.',
      tag: 'BFT Consensus'
    },
    {
      icon: '📜',
      color: '#059669',
      title: 'PGN sellado en cadena',
      desc: 'El historial de la partida se guarda en el contrato antes de que la IA lo analice. Nadie puede modificar las jugadas después del hecho — el PGN que analiza la IA es el mismo que quedó sellado por el ganador.',
      tag: 'Inmutable'
    }
  ],
  flow: {
    title: 'Flujo de confianza',
    steps: [
      { label: 'Partida termina', sub: 'Chess engine detecta mate o timeout' },
      { label: 'Ganador firma', sub: 'triggerAgent() en MetaMask' },
      { label: 'PGN sellado', sub: 'Guardado en el contrato' },
      { label: 'CRE ejecuta', sub: 'IA analiza en red descentralizada' },
      { label: 'Pago automático', sub: 'Contrato libera fondos al ganador' },
    ]
  },
  note: 'El único punto de confianza es el código — y el código es público, inmutable y verificable por cualquiera en cualquier momento.'
};

const contentEn = {
  eyebrow: 'Why trust it',
  title: 'Security without compromise',
  subtitle: "We don't ask for trust. We make it unnecessary.",
  pillars: [
    {
      icon: '🔒',
      color: '#f39c12',
      title: 'Audited smart contract',
      desc: 'Funds live in a smart contract on Ethereum Sepolia. Neither we nor anyone else can move them — only the contract can release them, and only when programmed conditions are met.',
      tag: 'Ethereum'
    },
    {
      icon: '🧠',
      color: '#2563eb',
      title: 'Decentralized AI referee',
      desc: "When each game ends, an AI analyzes the official PGN stored on-chain. The analysis doesn't run on our servers — it runs on Chainlink's decentralized network, with consensus across multiple independent nodes.",
      tag: 'Chainlink CRE'
    },
    {
      icon: '⛓',
      color: '#7c3aed',
      title: 'Verifiable on-chain workflows',
      desc: 'Each step of the settlement process is a Chainlink CRE workflow — executed by an oracle network with BFT consensus. No single node can alter the result. Every operation is recorded and auditable.',
      tag: 'BFT Consensus'
    },
    {
      icon: '📜',
      color: '#059669',
      title: 'PGN sealed on-chain',
      desc: "The game history is stored in the contract before the AI analyzes it. Nobody can modify the moves after the fact — the PGN the AI analyzes is the same one sealed by the winner.",
      tag: 'Immutable'
    }
  ],
  flow: {
    title: 'Trust flow',
    steps: [
      { label: 'Game ends', sub: 'Chess engine detects checkmate or timeout' },
      { label: 'Winner signs', sub: 'triggerAgent() in MetaMask' },
      { label: 'PGN sealed', sub: 'Stored in the contract' },
      { label: 'CRE executes', sub: 'AI analyzes on decentralized network' },
      { label: 'Auto payout', sub: 'Contract releases funds to winner' },
    ]
  },
  note: 'The only point of trust is the code — and the code is public, immutable, and verifiable by anyone at any time.'
};

function PillarCard({ pillar, index, visible }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        padding: '28px', borderRadius: '14px',
        border: `1px solid ${hovered ? pillar.color : '#1a1a1a'}`,
        backgroundColor: hovered ? `${pillar.color}08` : 'rgba(0,0,0,0.6)',
        backdropFilter: 'blur(10px)',
        transition: 'all 0.3s ease',
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(30px)',
        transitionDelay: `${index * 0.1}s`,
        cursor: 'default'
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px' }}>
        <span style={{ fontSize: '1.8rem' }}>{pillar.icon}</span>
        <span style={{
          fontSize: '0.6rem', letterSpacing: '1.5px', textTransform: 'uppercase',
          color: pillar.color, border: `1px solid ${pillar.color}40`,
          borderRadius: '100px', padding: '3px 10px',
          backgroundColor: `${pillar.color}10`
        }}>
          {pillar.tag}
        </span>
      </div>
      <div style={{
        fontFamily: "'Playfair Display', serif",
        fontSize: '0.95rem', fontWeight: '700',
        color: '#fff', marginBottom: '10px'
      }}>
        {pillar.title}
      </div>
      <div style={{ color: '#444', fontSize: '0.78rem', lineHeight: '1.75' }}>
        {pillar.desc}
      </div>
    </div>
  );
}

export default function Security({ lang = 'es' }) {
  const [visible, setVisible] = useState(false);
  const ref = useRef();
  const c = lang === 'es' ? contentEs : contentEn;

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setVisible(true); },
      { threshold: 0.1 }
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
      <div style={{ textAlign: 'center', marginBottom: '56px' }}>
        <div style={{
          fontSize: '0.68rem', color: '#f39c12', letterSpacing: '4px',
          textTransform: 'uppercase', marginBottom: '10px'
        }}>
          {c.eyebrow}
        </div>
        <h2 style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: 'clamp(1.8rem, 4vw, 2.6rem)',
          fontWeight: '700', color: '#fff',
          letterSpacing: '-1px', margin: '0 0 12px'
        }}>
          {c.title}
        </h2>
        <p style={{ color: '#333', fontSize: '0.85rem', margin: 0 }}>
          {c.subtitle}
        </p>
      </div>

      {/* pilares */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '14px', marginBottom: '48px'
      }}>
        {c.pillars.map((p, i) => (
          <PillarCard key={i} pillar={p} index={i} visible={visible} />
        ))}
      </div>

      {/* flujo de confianza */}
      <div style={{
        backgroundColor: 'rgba(0,0,0,0.6)',
        border: '1px solid #1a1a1a',
        borderRadius: '14px', padding: '28px',
        opacity: visible ? 1 : 0,
        transition: 'all 0.6s ease 0.5s'
      }}>
        <div style={{
          fontSize: '0.7rem', color: '#f39c12', letterSpacing: '3px',
          textTransform: 'uppercase', marginBottom: '24px'
        }}>
          {c.flow.title}
        </div>

        <div style={{
          display: 'flex', alignItems: 'center',
          gap: '0', flexWrap: 'wrap', rowGap: '16px'
        }}>
          {c.flow.steps.map((step, i) => (
            <React.Fragment key={i}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: '120px' }}>
                <div style={{
                  width: '36px', height: '36px', borderRadius: '50%',
                  backgroundColor: '#0a0a0a',
                  border: `1px solid ${i === c.flow.steps.length - 1 ? '#f39c12' : '#222'}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '0.7rem', color: i === c.flow.steps.length - 1 ? '#f39c12' : '#333',
                  fontWeight: '800', marginBottom: '8px', fontFamily: 'monospace'
                }}>
                  {String(i + 1).padStart(2, '0')}
                </div>
                <div style={{
                  color: '#fff', fontSize: '0.72rem', fontWeight: '600',
                  textAlign: 'center', marginBottom: '2px'
                }}>
                  {step.label}
                </div>
                <div style={{
                  color: '#333', fontSize: '0.62rem',
                  textAlign: 'center', maxWidth: '100px'
                }}>
                  {step.sub}
                </div>
              </div>
              {i < c.flow.steps.length - 1 && (
                <div style={{
                  flex: 1, height: '1px',
                  background: 'linear-gradient(to right, #1a1a1a, #f39c1240, #1a1a1a)',
                  minWidth: '20px', marginBottom: '28px'
                }} />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* nota final */}
      <div style={{
        marginTop: '24px', padding: '16px 20px',
        backgroundColor: 'rgba(243,156,18,0.04)',
        border: '1px solid #1f1a10',
        borderRadius: '10px',
        display: 'flex', gap: '12px', alignItems: 'flex-start',
        opacity: visible ? 1 : 0,
        transition: 'all 0.6s ease 0.7s'
      }}>
        <span style={{ color: '#f39c12', fontSize: '1rem', flexShrink: 0 }}>⚠</span>
        <span style={{ color: '#333', fontSize: '0.78rem', lineHeight: '1.6' }}>
          {c.note}
        </span>
      </div>
    </section>
  );
}