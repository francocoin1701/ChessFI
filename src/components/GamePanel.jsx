import React from "react";

const avatarUrl = (user) => {
  if (user?.photo_url && user.photo_url.includes('http')) return user.photo_url;
  return "https://api.dicebear.com/7.x/bottts/svg?seed=" + (user?.wallet || 'unknown');
};

function PlayerCard({ user, color, timer, isActive }) {
  const label = color === 'w' ? 'Blancas' : 'Negras';
  const mins = Math.floor(timer / 60);
  const secs = String(timer % 60).padStart(2, '0');
  const isLow = timer < 30;

  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: '10px',
      padding: '10px 14px',
      backgroundColor: isActive ? '#1f1f1f' : '#111',
      borderRadius: '10px',
      border: isActive ? '1px solid #f39c12' : '1px solid #222',
      transition: 'all 0.3s'
    }}>
      <div style={{
        width: '38px', height: '38px', borderRadius: '50%',
        border: `2px solid ${color === 'w' ? '#f5f5f5' : '#1a1a1a'}`,
        overflow: 'hidden', backgroundColor: '#000', flexShrink: 0
      }}>
        <img src={avatarUrl(user)} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      </div>

      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ color: '#fff', fontWeight: 'bold', fontSize: '0.85rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {user?.nickname || label}
          </span>
          <span style={{ color: '#f39c12', fontSize: '0.7rem', fontWeight: 'bold' }}>
            {user?.elo || 1200}
          </span>
        </div>
        <div style={{ display: 'flex', gap: '6px', marginTop: '2px' }}>
          <span style={{ fontSize: '0.6rem', color: '#2ecc71' }}>W:{user?.wins || 0}</span>
          <span style={{ fontSize: '0.6rem', color: '#e74c3c' }}>L:{user?.losses || 0}</span>
          <span style={{ fontSize: '0.6rem', color: '#3498db' }}>D:{user?.draws || 0}</span>
        </div>
      </div>

      <div style={{
        backgroundColor: isLow ? '#e74c3c' : '#000',
        border: `1px solid ${isLow ? '#e74c3c' : '#333'}`,
        borderRadius: '6px',
        padding: '6px 10px',
        fontFamily: 'monospace',
        fontSize: '1.1rem',
        fontWeight: 'bold',
        color: isLow ? '#fff' : '#f39c12',
        minWidth: '60px',
        textAlign: 'center',
        transition: 'all 0.3s'
      }}>
        {mins}:{secs}
      </div>
    </div>
  );
}

function PgnPanel({ pgn }) {
  if (!pgn) return (
    <div style={{ color: '#444', fontSize: '0.8rem', textAlign: 'center', marginTop: '20px' }}>
      Sin jugadas aún
    </div>
  );

  // parsear pgn en pares de jugadas
  const tokens = pgn
    .replace(/\{[^}]*\}/g, '')
    .replace(/\[[^\]]*\]/g, '')
    .trim()
    .split(/\s+/)
    .filter(t => t.length > 0);

  const moves = [];
  let i = 0;
  let moveNum = 1;

  while (i < tokens.length) {
    const t = tokens[i];
    if (/^\d+\./.test(t)) {
      const white = tokens[i + 1] || '';
      const black = tokens[i + 2] && !/^\d+\./.test(tokens[i + 2]) ? tokens[i + 2] : '';
      moves.push({ num: moveNum, white, black });
      moveNum++;
      i += black ? 3 : 2;
    } else {
      i++;
    }
  }

  return (
    <div style={{ overflowY: 'auto', flex: 1 }}>
      <div style={{ display: 'grid', gridTemplateColumns: '28px 1fr 1fr', gap: '2px' }}>
        {moves.map((m, idx) => (
          <React.Fragment key={idx}>
            <span style={{ color: '#555', fontSize: '0.75rem', padding: '4px 2px', textAlign: 'right' }}>
              {m.num}.
            </span>
            <span style={{
              color: '#fff', fontSize: '0.8rem', padding: '4px 6px',
              backgroundColor: idx === moves.length - 1 ? '#1f1f1f' : 'transparent',
              borderRadius: '4px', fontFamily: 'monospace'
            }}>
              {m.white}
            </span>
            <span style={{
              color: '#ccc', fontSize: '0.8rem', padding: '4px 6px',
              backgroundColor: idx === moves.length - 1 && !m.black ? 'transparent' : (idx === moves.length - 1 ? '#1f1f1f' : 'transparent'),
              borderRadius: '4px', fontFamily: 'monospace'
            }}>
              {m.black}
            </span>
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}

export default function GamePanel({ myColor, timers, pgn, myUser, opponentUser }) {
  const turn = pgn
    ? (pgn.split(/\s+/).filter(t => !/^\d+\./.test(t) && t && !t.match(/[{}[\]]/)).length % 2 === 0 ? 'w' : 'b')
    : 'w';

  const topColor = myColor === 'w' ? 'b' : 'w';
  const bottomColor = myColor;
  const topUser = myColor === 'w' ? opponentUser : myUser;
  const bottomUser = myColor === 'w' ? myUser : opponentUser;

  return (
    <div style={{
      display: 'flex', flexDirection: 'column', gap: '8px',
      width: '220px', height: '100%'
    }}>
      <PlayerCard
        user={topUser}
        color={topColor}
        timer={timers[topColor] || 0}
        isActive={turn === topColor}
      />

      <div style={{
        flex: 1, backgroundColor: '#111', borderRadius: '10px',
        border: '1px solid #222', padding: '10px',
        display: 'flex', flexDirection: 'column', overflow: 'hidden'
      }}>
        <div style={{ color: '#f39c12', fontSize: '0.7rem', fontWeight: 'bold', marginBottom: '8px', letterSpacing: '1px' }}>
          MOVIMIENTOS
        </div>
        <PgnPanel pgn={pgn} />
      </div>

      <PlayerCard
        user={bottomUser}
        color={bottomColor}
        timer={timers[bottomColor] || 0}
        isActive={turn === bottomColor}
      />
    </div>
  );
}