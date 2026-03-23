import React, { useState, useEffect, useMemo } from "react";
import { Chess } from "chess.js";
import io from "socket.io-client";

// Por ahora usaremos localhost, cuando lo subas a la nube cambiaremos esta URL
const socket = io("http://localhost:8080"); 
const ROOM_ID = "partida_pro_1"; // ID fijo para la prueba de dos PCs

export default function App() {
  const game = useMemo(() => new Chess(), []);
  const [board, setBoard] = useState(game.board());
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    // 1. Conectarse a la sala al iniciar
    socket.emit('join_room', ROOM_ID);

    // 2. Escuchar movimientos del rival
    socket.on('update_game', (data) => {
      game.loadPgn(data.pgn);
      setBoard(game.board());
    });

    // 3. Cargar estado inicial si ya hay alguien jugando
    socket.on('init_game', (pgn) => {
      if (pgn) {
        game.loadPgn(pgn);
        setBoard(game.board());
      }
    });

    return () => {
      socket.off('update_game');
      socket.off('init_game');
    };
  }, [game]);

  function handleClick(square) {
    if (game.isGameOver()) return;

    if (!selected) {
      const piece = game.get(square);
      if (piece && piece.color === game.turn()) setSelected(square);
      return;
    }

    try {
      const moveData = { from: selected, to: square, promotion: "q" };
      const move = game.move(moveData);

      if (move) {
        setBoard(game.board());
        // ENVIAR MOVIMIENTO AL SERVIDOR INSTANTÁNEAMENTE
        socket.emit('move', { roomId: ROOM_ID, move: moveData });
      }
    } catch (e) { console.log("Ilegal"); }
    setSelected(null);
  }

  const alphabet = "abcdefgh";
  return (
    <div style={styles.container}>
      <h2>Ajedrez Multijugador Real</h2>
      <div style={styles.board}>
        {board.map((row, i) => row.map((piece, j) => {
          const sq = alphabet[j] + (8 - i);
          const isDark = (i + j) % 2 === 1;
          return (
            <div key={sq} onClick={() => handleClick(sq)} style={{
              width: '50px', height: '50px', display: 'flex', alignItems: 'center', 
              justifyContent: 'center', cursor: 'pointer',
              backgroundColor: selected === sq ? '#f1c40f' : (isDark ? '#769656' : '#eeeed2')
            }}>
              {piece && <img src={`https://upload.wikimedia.org/wikipedia/commons/${getImg(piece.color, piece.type)}`} style={{width: '40px', pointerEvents: 'none'}} alt="" />}
            </div>
          );
        }))}
      </div>
      <p>Turno: {game.turn() === 'w' ? 'Blancas' : 'Negras'}</p>
    </div>
  );
}

function getImg(c, t) {
  const m = { w: { p: "4/45/Chess_plt45.svg", r: "7/72/Chess_rlt45.svg", n: "7/70/Chess_nlt45.svg", b: "b/b1/Chess_blt45.svg", q: "1/15/Chess_qlt45.svg", k: "4/42/Chess_klt45.svg" }, b: { p: "c/c7/Chess_pdt45.svg", r: "f/ff/Chess_rdt45.svg", n: "e/ef/Chess_ndt45.svg", b: "9/98/Chess_bdt45.svg", q: "4/47/Chess_qdt45.svg", k: "f/f0/Chess_kdt45.svg" } };
  return m[c][t];
}

const styles = {
  container: { display: 'flex', flexDirection: 'column', alignItems: 'center', backgroundColor: '#1a1a1a', color: 'white', minHeight: '100vh', paddingTop: '50px', fontFamily: 'sans-serif' },
  board: { display: 'grid', gridTemplateColumns: 'repeat(8, 50px)', border: '5px solid #333' }
};