import React, { useState, useMemo, useEffect } from "react";
import { Chess } from "chess.js";
import { ethers } from 'ethers';

export default function ChessGame({ account, matchId, isWhite, contractAddress }) {
  const game = useMemo(() => new Chess(), []);
  const [board, setBoard] = useState(game.board());
  const [selected, setSelected] = useState(null);
  const myColor = isWhite ? 'w' : 'b';

  // 1. SINCRONIZACIÓN CON EL RELAY (RECIBIR JUGADAS DEL RIVAL)
  useEffect(() => {
    const poll = setInterval(async () => {
      try {
        const res = await fetch(`http://localhost:8080/game/${matchId}`);
        const data = await res.json();
        if (data.pgn && data.pgn !== game.pgn()) {
          game.loadPgn(data.pgn);
          setBoard(game.board());
        }
      } catch (e) { console.log("Relay no responde"); }
    }, 2500);
    return () => clearInterval(poll);
  }, [matchId, game]);

  // 2. LÓGICA DE MOVIMIENTO
  const handleClick = async (square) => {
    if (game.isGameOver()) return;
    if (game.turn() !== myColor) return; // BLOQUEO DE TURNO

    if (!selected) {
      const piece = game.get(square);
      if (piece && piece.color === myColor) setSelected(square);
      return;
    }

    try {
      const move = game.move({ from: selected, to: square, promotion: "q" });
      if (move) {
        setBoard(game.board());
        
        // Enviar mi jugada al Relay
        await fetch("http://localhost:8080", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ matchId, pgn: game.pgn(), ultima: move.san })
        });

        // Si es Mate, avisar a la IA (CRE) en la Blockchain
        if (game.isCheckmate()) {
          const provider = new ethers.providers.Web3Provider(window.ethereum);
          const signer = provider.getSigner();
          const contract = new ethers.Contract(contractAddress, ["function triggerAgent(uint256,string,uint8)"], signer);
          await contract.triggerAgent(matchId, game.pgn(), 2);
          alert("¡Mate detectado! Enviando a revisión de IA...");
        }
      }
    } catch (e) { console.log("Movimiento ilegal"); }
    setSelected(null);
  };

  const alphabet = "abcdefgh";
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', backgroundColor: '#222', padding: '20px', borderRadius: '10px' }}>
      <div style={{ marginBottom: '15px', fontSize: '18px', color: game.turn() === myColor ? '#27ae60' : '#e74c3c', fontWeight: 'bold' }}>
        {game.turn() === myColor ? "🟢 ES TU TURNO" : "🔴 ESPERANDO RIVAL..."}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(8, 50px)', border: '4px solid #f1c40f' }}>
        {board.map((row, i) => row.map((piece, j) => {
          const sq = alphabet[j] + (8 - i);
          const isDark = (i + j) % 2 === 1;
          const isCheck = piece && piece.type === 'k' && piece.color === game.turn() && game.isCheck();
          return (
            <div key={sq} onClick={() => handleClick(sq)} style={{
              width: '50px', height: '50px', display: 'flex', alignItems: 'center', justifyContent: 'center',
              backgroundColor: isCheck ? '#e74c3c' : (selected === sq ? '#f1c40f' : (isDark ? '#769656' : '#eeeed2')),
              cursor: game.turn() === myColor ? 'pointer' : 'default'
            }}>
              {piece && <img src={`https://upload.wikimedia.org/wikipedia/commons/${getImg(piece.color, piece.type)}`} style={{width: '40px', pointerEvents: 'none'}} alt="" />}
            </div>
          );
        }))}
      </div>
      <div style={{ marginTop: '15px', color: '#888', fontSize: '11px', maxWidth: '400px' }}>PGN: {game.pgn()}</div>
    </div>
  );
}

function getImg(c, t) {
  const m = { w: { p: "4/45/Chess_plt45.svg", r: "7/72/Chess_rlt45.svg", n: "7/70/Chess_nlt45.svg", b: "b/b1/Chess_blt45.svg", q: "1/15/Chess_qlt45.svg", k: "4/42/Chess_klt45.svg" }, b: { p: "c/c7/Chess_pdt45.svg", r: "f/ff/Chess_rdt45.svg", n: "e/ef/Chess_ndt45.svg", b: "9/98/Chess_bdt45.svg", q: "4/47/Chess_qdt45.svg", k: "f/f0/Chess_kdt45.svg" } };
  return m[c][t];
}