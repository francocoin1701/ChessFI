import React, { useState } from "react";
import UserProfile from "./UserProfile";

export default function Lobby({ challenges, liveGames, user, onCreateChallenge, onAcceptChallenge, onWatchGame, onReturnToGame, isBusy, activeRoomId }) {
  const [amount, setAmount] = useState("0.001");
  const [time, setTime] = useState(10);

  return (
    <div style={s.layout}>
      <div style={s.leftCol}>
        <UserProfile user={user} />
        
        {/* BOTÓN DE RETORNO AL JUEGO */}
        {activeRoomId && (
          <button onClick={onReturnToGame} style={s.returnBtn}>
            ⚠️ PARTIDA ACTIVA: VOLVER AL TABLERO
          </button>
        )}

        <div style={s.createBox}>
          <h3>Nuevo Desafío</h3>
          <label style={s.label}>Monto ETH</label>
          <input type="number" value={amount} onChange={e => setAmount(e.target.value)} style={s.input} disabled={isBusy} />
          <button onClick={() => onCreateChallenge(amount, time)} style={s.mainBtn} disabled={isBusy}>
            {isBusy ? "Ocupado..." : "Publicar Apuesta"}
          </button>
        </div>
      </div>

      <div style={s.centerCol}>
        <h3 style={{color: '#f39c12'}}>Apuestas Abiertas ♟️</h3>
        <div style={s.scrollArea}>
          {challenges.map(c => (
            <div key={c.id} style={s.card}>
              <div>
                <strong>💰 {c.bet_amount} ETH</strong>
                <div style={{fontSize: '0.7rem', color: '#666'}}>ID Blockchain: {c.blockchain_id}</div>
              </div>
              {c.creator_wallet.toLowerCase() !== user.wallet.toLowerCase() ? (
                <button onClick={() => onAcceptChallenge(c)} style={s.acceptBtn} disabled={isBusy}>ACEPTAR</button>
              ) : <span style={{color: '#f39c12', fontSize: '0.8rem'}}>Tu apuesta</span>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const s = {
  layout: { display: 'flex', gap: '20px', width: '90vw', height: '80vh', marginTop: '20px' },
  leftCol: { width: '300px', display: 'flex', flexDirection: 'column', gap: '15px' },
  centerCol: { flex: 1, backgroundColor: '#111', borderRadius: '15px', padding: '20px', overflow: 'hidden', display: 'flex', flexDirection: 'column' },
  scrollArea: { flex: 1, overflowY: 'auto' },
  returnBtn: { padding: '15px', backgroundColor: '#2ecc71', color: 'white', border: 'none', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer', marginBottom: '10px' },
  createBox: { backgroundColor: '#1a1a1a', padding: '20px', borderRadius: '12px', border: '1px solid #333' },
  input: { width: '100%', padding: '10px', marginBottom: '10px', backgroundColor: '#000', color: '#fff', border: '1px solid #444', borderRadius: '5px' },
  mainBtn: { width: '100%', padding: '10px', backgroundColor: '#f39c12', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' },
  card: { display: 'flex', justifyContent: 'space-between', padding: '15px', backgroundColor: '#1a1a1a', borderRadius: '10px', marginBottom: '10px', alignItems: 'center' },
  acceptBtn: { padding: '8px 15px', backgroundColor: '#2ecc71', border: 'none', borderRadius: '5px', color: 'white', fontWeight: 'bold', cursor: 'pointer' },
  label: { fontSize: '0.8rem', color: '#888' }
};