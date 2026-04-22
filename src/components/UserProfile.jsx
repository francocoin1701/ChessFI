import React, { useState } from "react";

export default function UserProfile({ user, onUpdate }) {
  const [isEditing, setIsEditing] = useState(false);
  const [nickname, setNickname] = useState(user.nickname || "");
  const [photoUrl, setPhotoUrl] = useState(user.photo_url || "");

  const handleSave = () => {
    onUpdate({ nickname, photoUrl });
    setIsEditing(false);
  };

  const avatarImg = user.photo_url && user.photo_url.includes('http') 
    ? user.photo_url 
    : "https://api.dicebear.com/7.x/bottts/svg?seed=" + user.wallet;

  return (
    <div style={s.profileCard}>
      <div style={s.avatarWrapper}>
        <img src={avatarImg} alt="" style={s.avatar} />
      </div>
      
      <div style={s.info}>
        {!isEditing ? (
          <>
            <div style={s.rowTop}>
              <span style={s.name}>{user.nickname || "Jugador"}</span>
              <span style={s.eloBadge}>{user.elo || 1200}</span>
            </div>
            
            <div style={s.walletText}>{user.wallet.slice(0,6)}...{user.wallet.slice(-4)}</div>
            
            <div style={s.statsRow}>
              <div style={s.stat}><b style={{color:'#2ecc71'}}>W:</b> {user.wins || 0}</div>
              <div style={s.stat}><b style={{color:'#e74c3c'}}>L:</b> {user.losses || 0}</div>
              <div style={s.stat}><b style={{color:'#3498db'}}>D:</b> {user.draws || 0}</div>
            </div>

            <div style={s.rowBottom}>
               <span style={s.earned}>💰 {user.balance_earned || 0} ETH</span>
               <button onClick={() => setIsEditing(true)} style={s.editBtn}>EDITAR</button>
            </div>
          </>
        ) : (
          <div style={s.editBox}>
            <input style={s.input} value={nickname} onChange={e => setNickname(e.target.value)} placeholder="Nick" />
            <input style={s.input} value={photoUrl} onChange={e => setPhotoUrl(e.target.value)} placeholder="URL Foto" />
            <div style={s.editBtns}>
              <button onClick={handleSave} style={s.btnOk}>✔</button>
              <button onClick={() => setIsEditing(false)} style={s.btnNo}>✖</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

const s = {
  profileCard: { 
    backgroundColor: '#1a1a1a', // Fondo sólido igual a "Nuevo Desafío"
    padding: '15px', 
    borderRadius: '12px', 
    border: '1px solid #333', // Límite definido
    display: 'flex', 
    gap: '12px',
    alignItems: 'center',
    width: '100%',
    boxSizing: 'border-box',
    marginBottom: '10px' // Espacio con la caja de abajo
  },
  avatarWrapper: {
    width: '50px',
    height: '50px',
    flexShrink: 0,
    borderRadius: '50%',
    border: '2px solid #f39c12',
    overflow: 'hidden',
    backgroundColor: '#000'
  },
  avatar: { width: '100%', height: '100%', objectFit: 'cover' },
  info: { display: 'flex', flexDirection: 'column', flex: 1, minWidth: 0 },
  rowTop: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  name: { fontSize: '0.9rem', fontWeight: 'bold', color: '#fff', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' },
  eloBadge: { fontSize: '0.7rem', color: '#f39c12', fontWeight: 'bold' },
  walletText: { fontSize: '0.65rem', color: '#666', marginBottom: '4px' },
  statsRow: { display: 'flex', gap: '5px', marginBottom: '5px' },
  stat: { fontSize: '0.7rem', backgroundColor: '#222', padding: '2px 5px', borderRadius: '4px' },
  rowBottom: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  earned: { fontSize: '0.75rem', color: '#2ecc71', fontWeight: 'bold' },
  editBtn: { background: 'none', border: 'none', color: '#555', cursor: 'pointer', fontSize: '0.6rem' },
  editBox: { display: 'flex', flexDirection: 'column', gap: '4px' },
  input: { backgroundColor: '#000', border: '1px solid #444', color: '#fff', padding: '4px', fontSize: '0.7rem', borderRadius: '4px' },
  editBtns: { display: 'flex', gap: '4px' },
  btnOk: { backgroundColor: '#2ecc71', border: 'none', color: '#fff', flex: 1, borderRadius: '4px', cursor: 'pointer' },
  btnNo: { backgroundColor: '#e74c3c', border: 'none', color: '#fff', flex: 1, borderRadius: '4px', cursor: 'pointer' }
};