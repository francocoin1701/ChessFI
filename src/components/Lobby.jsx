import React, { useState } from "react";
import UserProfile from "./UserProfile";

export default function Lobby({ challenges, user, onCreateChallenge, onAcceptChallenge, onReturnToGame, isBusy, activeRoomId }) {
  const [amount, setAmount] = useState("0.001");
  const [time, setTime] = useState(10);

  return (
    <div style={s.layout}>
      <div style={s.leftCol}>
        <UserProfile user={user} />

        {activeRoomId && (
          <button onClick={onReturnToGame} style={s.returnBtn}>
            PARTIDA ACTIVA: VOLVER AL TABLERO
          </button>
        )}

        <div style={s.createBox}>
          <h3 style={{ color: '#f39c12', marginBottom: '12px', fontSize: '0.95rem' }}>Nuevo Desafío</h3>

          <label style={s.label}>Tiempo por jugador</label>
          <div style={{ display: 'flex', gap: '6px', marginBottom: '14px', flexWrap: 'wrap' }}>
            {[1, 3, 5, 10, 15].map(t => (
              <button
                key={t}
                onClick={() => setTime(t)}
                disabled={isBusy}
                style={{
                  padding: '5px 10px',
                  backgroundColor: time === t ? '#f39c12' : '#222',
                  color: time === t ? '#000' : '#888',
                  border: `1px solid ${time === t ? '#f39c12' : '#333'}`,
                  borderRadius: '6px',
                  cursor: isBusy ? 'not-allowed' : 'pointer',
                  fontWeight: time === t ? 'bold' : 'normal',
                  fontSize: '0.75rem',
                  transition: 'all 0.2s'
                }}
              >
                {t}min
              </button>
            ))}
          </div>

          <label style={s.label}>Monto ETH</label>
          <input
            type="number"
            value={amount}
            onChange={e => setAmount(e.target.value)}
            style={s.input}
            disabled={isBusy}
            step="0.001"
            min="0.001"
          />

          <button
            onClick={() => onCreateChallenge(amount, time)}
            style={{ ...s.mainBtn, opacity: isBusy ? 0.5 : 1, cursor: isBusy ? 'not-allowed' : 'pointer' }}
            disabled={isBusy}
          >
            {isBusy ? "Ocupado..." : "Publicar Apuesta"}
          </button>
        </div>
      </div>

      <div style={s.centerCol}>
        <h3 style={{ color: '#f39c12', marginBottom: '16px', fontSize: '0.95rem', letterSpacing: '1px' }}>
          Apuestas Abiertas ♟
        </h3>
        <div style={s.scrollArea}>
          {challenges.length === 0 && (
            <div style={{ color: '#444', textAlign: 'center', marginTop: '40px', fontSize: '0.85rem' }}>
              No hay apuestas abiertas
            </div>
          )}
          {challenges.map(c => (
            <div key={c.id} style={s.card}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <strong style={{ color: '#f39c12', fontSize: '0.95rem' }}>
                  {c.bet_amount} ETH
                </strong>
                <span style={{ fontSize: '0.7rem', color: '#555' }}>
                  {c.creator_wallet.slice(0, 6)}...{c.creator_wallet.slice(-4)}
                </span>
                <span style={{ fontSize: '0.65rem', color: '#444' }}>
                  ID: {c.blockchain_id} · {c.time_limit || 10}min
                </span>
              </div>

              {c.creator_wallet.toLowerCase() !== user.wallet.toLowerCase() ? (
                <button
                  onClick={() => onAcceptChallenge(c)}
                  style={{ ...s.acceptBtn, opacity: isBusy ? 0.5 : 1, cursor: isBusy ? 'not-allowed' : 'pointer' }}
                  disabled={isBusy}
                >
                  ACEPTAR
                </button>
              ) : (
                <span style={{ color: '#f39c12', fontSize: '0.75rem', fontWeight: 'bold' }}>
                  Tu apuesta
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const s = {
  layout: {
    display: 'flex',
    gap: '20px',
    width: '90vw',
    height: '85vh',
    marginTop: '20px'
  },
  leftCol: {
    width: '280px',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    flexShrink: 0
  },
  centerCol: {
    flex: 1,
    backgroundColor: '#111',
    borderRadius: '14px',
    padding: '20px',
    border: '1px solid #1f1f1f',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column'
  },
  scrollArea: {
    flex: 1,
    overflowY: 'auto',
    paddingRight: '4px'
  },
  returnBtn: {
    padding: '12px',
    backgroundColor: '#2ecc71',
    color: '#000',
    border: 'none',
    borderRadius: '10px',
    fontWeight: 'bold',
    cursor: 'pointer',
    fontSize: '0.8rem',
    textAlign: 'center'
  },
  createBox: {
    backgroundColor: '#111',
    padding: '18px',
    borderRadius: '12px',
    border: '1px solid #1f1f1f',
    display: 'flex',
    flexDirection: 'column'
  },
  label: {
    fontSize: '0.75rem',
    color: '#666',
    marginBottom: '6px',
    display: 'block'
  },
  input: {
    width: '100%',
    padding: '10px',
    marginBottom: '12px',
    backgroundColor: '#000',
    color: '#fff',
    border: '1px solid #333',
    borderRadius: '6px',
    fontSize: '0.9rem',
    boxSizing: 'border-box'
  },
  mainBtn: {
    width: '100%',
    padding: '11px',
    backgroundColor: '#f39c12',
    border: 'none',
    borderRadius: '8px',
    fontWeight: 'bold',
    fontSize: '0.85rem',
    color: '#000',
    transition: 'opacity 0.2s'
  },
  card: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '14px 16px',
    backgroundColor: '#0f0f0f',
    borderRadius: '10px',
    marginBottom: '8px',
    border: '1px solid #1a1a1a',
    transition: 'border-color 0.2s'
  },
  acceptBtn: {
    padding: '8px 16px',
    backgroundColor: '#2ecc71',
    border: 'none',
    borderRadius: '6px',
    color: '#000',
    fontWeight: 'bold',
    fontSize: '0.8rem',
    transition: 'opacity 0.2s'
  }
};