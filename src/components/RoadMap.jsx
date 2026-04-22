import React, { useState, useEffect, useRef } from "react";

const phasesEs = [
  {
    phase: "Fase 01",
    status: "active",
    title: "Testnet — Sepolia",
    period: "2026 Q1",
    desc: "Lanzamiento en testnet con el contrato inteligente completo, árbitro de IA via Chainlink CRE y frontend funcional. Validación del modelo con partidas reales.",
    items: [
      "Contrato auditado en Ethereum Sepolia",
      "Árbitro IA con Chainlink CRE",
      "Lobby en tiempo real con Socket.IO",
      "Asignación de colores on-chain",
      "Liquidación automática por mate y timeout"
    ]
  },
  {
    phase: "Fase 02",
    status: "upcoming",
    title: "Mainnet + NFTs de entrada",
    period: "2027 Q3",
    desc: "Deploy en mainnet con apuestas reales. Introducción de NFTs como entradas para torneos exclusivos — poseer el NFT es el único requisito para participar.",
    items: [
      "Deploy en Ethereum mainnet",
      "NFTs de acceso a torneos ERC-721",
      "Torneos con prize pool acumulado",
      "Sistema de ELO on-chain",
      "Historial de partidas NFT coleccionable"
    ]
  },
  {
    phase: "Fase 03",
    status: "upcoming",
    title: "Expansión multichain",
    period: "2028 Q1",
    desc: "ChessFi disponible desde cualquier cadena. Jugadores en Base, Polygon, Arbitrum o Avalanche pueden apostar contra alguien en Ethereum — el contrato central recibe fondos de cualquier red.",
    items: [
      "Integración con Chainlink CCIP",
      "Apuestas cross-chain nativas",
      "Soporte para Base, Polygon, Arbitrum",
      "Bridge automático de fondos",
      "Un solo lobby para todas las cadenas"
    ]
  },
  {
    phase: "Fase 04",
    status: "upcoming",
    title: "Liga descentralizada",
    period: "2028 Q3",
    desc: "Una liga mundial de ajedrez on-chain. Rankings por ELO en cadena, temporadas con prize pools comunitarios, staking para validar partidas y gobernanza por token.",
    items: [
      "Token de gobernanza ChessFi",
      "DAO para gestión de la plataforma",
      "Staking para validadores de partidas",
      "Temporadas con prize pool comunitario",
      "Integración con torneos físicos"
    ]
  }
];

const phasesEn = [
  {
    phase: "Phase 01",
    status: "active",
    title: "Testnet — Sepolia",
    period: "2025 Q1",
    desc: "Testnet launch with complete smart contract, AI referee via Chainlink CRE and functional frontend. Model validation with real games.",
    items: [
      "Audited contract on Ethereum Sepolia",
      "AI referee with Chainlink CRE",
      "Real-time lobby with Socket.IO",
      "On-chain color assignment",
      "Automatic settlement for checkmate and timeout"
    ]
  },
  {
    phase: "Phase 02",
    status: "upcoming",
    title: "Mainnet + Entry NFTs",
    period: "2025 Q3",
    desc: "Mainnet deploy with real bets. Introduction of NFTs as entry tickets for exclusive tournaments — owning the NFT is the only requirement to participate.",
    items: [
      "Ethereum mainnet deploy",
      "ERC-721 tournament access NFTs",
      "Tournaments with accumulated prize pool",
      "On-chain ELO system",
      "Collectible game history NFT"
    ]
  },
  {
    phase: "Phase 03",
    status: "upcoming",
    title: "Multichain expansion",
    period: "2026 Q1",
    desc: "ChessFi accessible from any chain. Players on Base, Polygon, Arbitrum or Avalanche can bet against someone on Ethereum — the central contract receives funds from any network.",
    items: [
      "Chainlink CCIP integration",
      "Native cross-chain bets",
      "Support for Base, Polygon, Arbitrum",
      "Automatic fund bridging",
      "Single lobby for all chains"
    ]
  },
  {
    phase: "Phase 04",
    status: "upcoming",
    title: "Decentralized league",
    period: "2026 Q3",
    desc: "A world chess league on-chain. On-chain ELO rankings, seasons with community prize pools, staking to validate games and token governance.",
    items: [
      "ChessFi governance token",
      "DAO for platform management",
      "Staking for game validators",
      "Community prize pool seasons",
      "Integration with physical tournaments"
    ]
  }
];

function PhaseCard({ phase, index, visible }) {
  const [hovered, setHovered] = useState(false);
  const isActive = phase.status === 'active';

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: 'relative',
        padding: '28px', borderRadius: '14px',
        border: `1px solid ${isActive ? '#f39c12' : (hovered ? '#333' : '#1a1a1a')}`,
        backgroundColor: isActive ? 'rgba(243,156,18,0.04)' : 'rgba(0,0,0,0.6)',
        backdropFilter: 'blur(10px)',
        transition: 'all 0.3s ease',
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(30px)',
        transitionDelay: `${index * 0.15}s`,
        cursor: 'default'
      }}
    >
      {/* badge status */}
      <div style={{
        position: 'absolute', top: '16px', right: '16px',
        display: 'flex', alignItems: 'center', gap: '6px'
      }}>
        <div style={{
          width: '6px', height: '6px', borderRadius: '50%',
          backgroundColor: isActive ? '#2ecc71' : '#333',
          animation: isActive ? 'pulseDot 2s ease-in-out infinite' : 'none'
        }} />
        <span style={{
          fontSize: '0.6rem', letterSpacing: '1.5px',
          textTransform: 'uppercase',
          color: isActive ? '#2ecc71' : '#333'
        }}>
          {isActive ? 'Live' : 'Soon'}
        </span>
      </div>

      <div style={{
        fontSize: '0.65rem', color: '#f39c12',
        letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '8px'
      }}>
        {phase.phase} · {phase.period}
      </div>

      <h3 style={{
        fontFamily: "'Playfair Display', serif",
        fontSize: '1.15rem', fontWeight: '700',
        color: '#fff', margin: '0 0 12px'
      }}>
        {phase.title}
      </h3>

      <p style={{
        color: '#444', fontSize: '0.78rem',
        lineHeight: '1.7', margin: '0 0 18px'
      }}>
        {phase.desc}
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
        {phase.items.map((item, i) => (
          <div key={i} style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
            <span style={{
              color: isActive ? '#f39c12' : '#2a2a2a',
              fontSize: '0.7rem', marginTop: '2px', flexShrink: 0
            }}>
              {isActive ? '✓' : '○'}
            </span>
            <span style={{
              color: isActive ? '#555' : '#2a2a2a',
              fontSize: '0.75rem', lineHeight: '1.5'
            }}>
              {item}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Roadmap({ lang = 'es' }) {
  const [visible, setVisible] = useState(false);
  const ref = useRef();
  const phases = lang === 'es' ? phasesEs : phasesEn;

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
      <style>{`
        @keyframes pulseDot {
          0%,100% { opacity:1; transform:scale(1); }
          50% { opacity:0.5; transform:scale(1.4); }
        }
      `}</style>

      <div style={{ textAlign: 'center', marginBottom: '56px' }}>
        <div style={{
          fontSize: '0.68rem', color: '#f39c12', letterSpacing: '4px',
          textTransform: 'uppercase', marginBottom: '10px'
        }}>
          {lang === 'es' ? 'El camino' : 'The path'}
        </div>
        <h2 style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: 'clamp(1.8rem, 4vw, 2.6rem)',
          fontWeight: '700', color: '#fff',
          letterSpacing: '-1px', margin: 0
        }}>
          Roadmap
        </h2>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '14px'
      }}>
        {phases.map((phase, i) => (
          <PhaseCard key={i} phase={phase} index={i} visible={visible} />
        ))}
      </div>
    </section>
  );
}