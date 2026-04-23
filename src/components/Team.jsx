import React, { useEffect, useState, useRef } from "react";
import ceoImg from "../assets/ceo.png";
import lawyerImg from "../assets/layer.jpeg";

const AnonymousAvatar = () => (
  <svg viewBox="0 0 110 110" width="110" height="110" xmlns="http://www.w3.org/2000/svg">
    <circle cx="55" cy="55" r="55" fill="#0d1117"/>
    <circle cx="55" cy="42" r="18" fill="#1a1a2e"/>
    <ellipse cx="55" cy="95" rx="30" ry="22" fill="#1a1a2e"/>
    <text x="55" y="50" textAnchor="middle" fontSize="26" fill="#f39c12" fontFamily="serif" fontWeight="bold">?</text>
    <circle cx="55" cy="55" r="54" fill="none" stroke="#f39c12" strokeWidth="0.4" strokeDasharray="4 6" opacity="0.3"/>
  </svg>
);

const teamData = {
  en: {
    eyebrow: "The team",
    title: "Built by people who care",
    members: [
      {
        name: "Franco Jerez",
        role: "CEO & Founder",
        tags: ["Full Stack Developer", "Web3 Engineer"],
        bio: "Architect of the ChessFi protocol. Designed and built the smart contract infrastructure, the decentralized AI arbitration layer, and the full-stack application from the ground up.",
        img: ceoImg
      },
      {
        name: "Julián Bermúdez",
        role: "Legal Counsel",
        tags: ["Web3 Law", "Smart Contract Compliance"],
        bio: "Expert in blockchain regulation and digital asset law. Advises ChessFi on legal framework, smart contract enforceability, and emerging Web3 regulatory compliance across jurisdictions.",
        img: lawyerImg
      },
      {
        name: "Undisclosed",
        role: "Strategic Investor",
        tags: ["Venture Capital", "Web3 Infrastructure"],
        bio: "Senior partner at a tier-1 Web3 venture fund with a portfolio spanning DeFi, on-chain gaming, and decentralized infrastructure. Backing ChessFi's growth strategy and global market expansion.",
        img: null
      }
    ]
  },
  es: {
    eyebrow: "El equipo",
    title: "Construido por personas comprometidas",
    members: [
      {
        name: "Franco Jerez",
        role: "CEO & Fundador",
        tags: ["Full Stack Developer", "Web3 Engineer"],
        bio: "Arquitecto del protocolo ChessFi. Diseñó y construyó la infraestructura de contratos inteligentes, la capa de arbitraje IA descentralizada y la aplicación completa desde cero.",
        img: ceoImg
      },
      {
        name: "Julián Bermúdez",
        role: "Asesor Legal",
        tags: ["Derecho Web3", "Cumplimiento Normativo"],
        bio: "Experto en regulación blockchain y derecho de activos digitales. Asesora a ChessFi en marco legal, ejecutabilidad de contratos inteligentes y cumplimiento normativo Web3 en múltiples jurisdicciones.",
        img: lawyerImg
      },
      {
        name: "Anónimo",
        role: "Inversor Estratégico",
        tags: ["Venture Capital", "Infraestructura Web3"],
        bio: "Socio senior en un fondo de venture capital tier-1 especializado en Web3, con portafolio en DeFi, gaming on-chain e infraestructura descentralizada. Respaldando la estrategia de crecimiento y expansión global de ChessFi.",
        img: null
      }
    ]
  }
};

function MemberCard({ member, delay }) {
  const [visible, setVisible] = useState(false);
  const [hovered, setHovered] = useState(false);
  const ref = useRef();

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setTimeout(() => setVisible(true), delay); },
      { threshold: 0.2 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [delay]);

  return (
    <div
      ref={ref}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        padding: '40px 32px',
        borderRadius: '16px',
        border: `1px solid ${hovered ? '#f39c12' : '#1a1a1a'}`,
        backgroundColor: 'rgba(0,0,0,0.7)',
        backdropFilter: 'blur(12px)',
        transition: 'all 0.4s ease',
        opacity: visible ? 1 : 0,
        transform: visible
          ? (hovered ? 'translateY(-6px)' : 'translateY(0)')
          : 'translateY(40px)',
        cursor: 'default',
        textAlign: 'center'
      }}
    >
      {/* Avatar */}
      <div style={{
        width: '110px', height: '110px',
        borderRadius: '50%',
        overflow: 'hidden',
        border: `2px solid ${hovered ? '#f39c12' : '#1f1f1f'}`,
        marginBottom: '20px',
        transition: 'border-color 0.3s',
        flexShrink: 0
      }}>
        {member.img
          ? <img src={member.img} alt={member.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          : <AnonymousAvatar />
        }
      </div>

      {/* Name */}
      <div style={{
        fontFamily: "'Playfair Display', serif",
        fontSize: '1.15rem', fontWeight: '700',
        color: member.img ? '#fff' : '#555',
        marginBottom: '4px',
        letterSpacing: member.img ? '0' : '3px',
        textTransform: member.img ? 'none' : 'uppercase',
        fontSize: member.img ? '1.15rem' : '0.75rem'
      }}>
        {member.name}
      </div>

      {/* Role */}
      <div style={{
        fontSize: '0.72rem', color: '#f39c12',
        letterSpacing: '2px', textTransform: 'uppercase',
        marginBottom: '14px'
      }}>
        {member.role}
      </div>

      {/* Tags */}
      <div style={{
        display: 'flex', flexWrap: 'wrap', gap: '6px',
        justifyContent: 'center', marginBottom: '18px'
      }}>
        {member.tags.map((tag, i) => (
          <span key={i} style={{
            backgroundColor: 'rgba(243,156,18,0.08)',
            border: '1px solid rgba(243,156,18,0.2)',
            borderRadius: '100px',
            padding: '3px 12px',
            fontSize: '0.65rem', color: '#f39c12',
            letterSpacing: '1px'
          }}>
            {tag}
          </span>
        ))}
      </div>

      {/* Bio */}
      <p style={{
        color: '#444', fontSize: '0.78rem',
        lineHeight: '1.8', margin: 0, fontWeight: '300'
      }}>
        {member.bio}
      </p>
    </div>
  );
}

export default function Team({ lang = 'en' }) {
  const t = teamData[lang] || teamData.en;
  const [titleVisible, setTitleVisible] = useState(false);
  const titleRef = useRef();

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setTitleVisible(true); },
      { threshold: 0.2 }
    );
    if (titleRef.current) observer.observe(titleRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section style={{
      position: 'relative', zIndex: 10,
      padding: '80px 48px',
      maxWidth: '1000px', margin: '0 auto'
    }}>
      {/* Header */}
      <div
        ref={titleRef}
        style={{
          textAlign: 'center', marginBottom: '56px',
          opacity: titleVisible ? 1 : 0,
          transform: titleVisible ? 'translateY(0)' : 'translateY(30px)',
          transition: 'all 0.7s ease'
        }}
      >
        <div style={{
          fontSize: '0.68rem', color: '#f39c12',
          letterSpacing: '4px', textTransform: 'uppercase', marginBottom: '10px'
        }}>
          {t.eyebrow}
        </div>
        <h2 style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: 'clamp(1.8rem, 4vw, 2.6rem)',
          fontWeight: '700', color: '#fff',
          letterSpacing: '-1px', margin: 0
        }}>
          {t.title}
        </h2>
      </div>

      {/* Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
        gap: '20px'
      }}>
        {t.members.map((member, i) => (
          <MemberCard key={i} member={member} delay={i * 200} />
        ))}
      </div>
    </section>
  );
}