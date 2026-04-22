import React, { useState, useEffect, useRef } from "react";

const stepsEs = [
  {
    num: "01",
    icon: "🦊",
    title: "Conecta tu wallet",
    desc: "Entra con MetaMask en segundos. Sin registros, sin emails, sin contraseñas. Tu wallet es tu identidad."
  },
  {
    num: "02",
    icon: "♟",
    title: "Explora el lobby",
    desc: "Ve todas las apuestas abiertas en tiempo real. Monto, tiempo de partida, dirección del retador — todo visible antes de aceptar."
  },
  {
    num: "03",
    icon: "💰",
    title: "Pon o acepta una apuesta",
    desc: "Crea un reto enviando ETH al contrato inteligente, o acepta uno existente igualando el monto. Los fondos quedan bloqueados en cadena — nadie los toca."
  },
  {
    num: "04",
    icon: "⚔️",
    title: "Juega la partida",
    desc: "El tablero se activa cuando los dos jugadores están listos. Cada movimiento se valida en tiempo real. El reloj corre — sin pausas, sin trampas."
  },
  {
    num: "05",
    icon: "🤖",
    title: "La IA arbitra",
    desc: "Al detectar mate o tiempo agotado, el ganador firma una transacción. Chainlink CRE ejecuta un workflow descentralizado que analiza la partida con IA."
  },
  {
    num: "06",
    icon: "⚡",
    title: "Cobro automático",
    desc: "El contrato inteligente libera el 95% del pozo al ganador al instante. Sin esperas, sin solicitudes, sin intermediarios que autoricen el pago."
  }
];

const stepsEn = [
  {
    num: "01",
    icon: "🦊",
    title: "Connect your wallet",
    desc: "Sign in with MetaMask in seconds. No sign-ups, no emails, no passwords. Your wallet is your identity."
  },
  {
    num: "02",
    icon: "♟",
    title: "Browse the lobby",
    desc: "See all open bets in real time. Amount, game timer, challenger address — everything visible before you accept."
  },
  {
    num: "03",
    icon: "💰",
    title: "Place or accept a bet",
    desc: "Create a challenge by sending ETH to the smart contract, or accept an existing one by matching the amount. Funds are locked on-chain — nobody touches them."
  },
  {
    num: "04",
    icon: "⚔️",
    title: "Play the game",
    desc: "The board activates when both players are ready. Every move is validated in real time. The clock runs — no pauses, no cheating."
  },
  {
    num: "05",
    icon: "🤖",
    title: "AI arbitrates",
    desc: "On checkmate or timeout, the winner signs a transaction. Chainlink CRE executes a decentralized workflow that analyzes the game with AI."
  },
  {
    num: "06",
    icon: "⚡",
    title: "Automatic payout",
    desc: "The smart contract instantly releases 95% of the pot to the winner. No waiting, no requests, no intermediaries to authorize the payment."
  }
];

function Step({ step, index, visible }) {
  const isEven = index % 2 === 0;
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      opacity: visible ? 1 : 0,
      transform: visible ? 'translateY(0)' : 'translateY(30px)',
      transition: `all 0.6s ease ${index * 0.1}s`
    }}>
      <div style={{
        width: '56px', height: '56px', borderRadius: '50%',
        backgroundColor: '#0a0a0a',
        border: '1px solid #1f1f1f',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: '1.6rem', marginBottom: '16px',
        position: 'relative'
      }}>
        {step.icon}
        <div style={{
          position: 'absolute', top: '-8px', right: '-8px',
          backgroundColor: '#f39c12', color: '#000',
          fontSize: '0.55rem', fontWeight: '800',
          borderRadius: '100px', padding: '2px 6px',
          letterSpacing: '0.5px'
        }}>
          {step.num}
        </div>
      </div>
      <div style={{
        fontFamily: "'Playfair Display', serif",
        fontSize: '0.95rem', fontWeight: '700',
        color: '#fff', textAlign: 'center', marginBottom: '8px'
      }}>
        {step.title}
      </div>
      <div style={{
        color: '#444', fontSize: '0.78rem', lineHeight: '1.7',
        textAlign: 'center', maxWidth: '180px'
      }}>
        {step.desc}
      </div>
    </div>
  );
}

export default function HowItWorks({ lang = 'es' }) {
  const [visible, setVisible] = useState(false);
  const ref = useRef();
  const steps = lang === 'es' ? stepsEs : stepsEn;

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
      <div style={{ textAlign: 'center', marginBottom: '60px' }}>
        <div style={{
          fontSize: '0.68rem', color: '#f39c12', letterSpacing: '4px',
          textTransform: 'uppercase', marginBottom: '10px'
        }}>
          {lang === 'es' ? 'El flujo completo' : 'The full flow'}
        </div>
        <h2 style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: 'clamp(1.8rem, 4vw, 2.6rem)',
          fontWeight: '700', color: '#fff',
          letterSpacing: '-1px', margin: 0
        }}>
          {lang === 'es' ? 'Cómo funciona' : 'How it works'}
        </h2>
      </div>

      {/* conectores entre pasos */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '40px 20px',
        position: 'relative'
      }}>
        {steps.map((step, i) => (
          <Step key={i} step={step} index={i} visible={visible} />
        ))}
      </div>

      {/* linea de flujo decorativa */}
      <div style={{
        marginTop: '60px',
        padding: '20px 24px',
        backgroundColor: 'rgba(243,156,18,0.04)',
        border: '1px solid #1a1a1a',
        borderRadius: '12px',
        display: 'flex', alignItems: 'center',
        gap: '12px',
        opacity: visible ? 1 : 0,
        transition: 'all 0.6s ease 0.8s'
      }}>
        <span style={{ fontSize: '1.2rem' }}>♟</span>
        <span style={{ color: '#333', fontSize: '0.8rem', lineHeight: '1.6' }}>
          {lang === 'es'
            ? 'Todo el proceso ocurre en cadena — desde el depósito hasta el pago. Ningún servidor nuestro toca tu dinero en ningún momento.'
            : 'The entire process happens on-chain — from deposit to payout. No server of ours ever touches your money at any point.'}
        </span>
      </div>
    </section>
  );
}