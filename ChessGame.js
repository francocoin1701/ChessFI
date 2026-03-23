import React, { useState } from "react";
import { Chess } from "chess.js";
import { Chessboard } from "react-chessboard";

export default function ChessGame({ matchId, onGameOver }) {
  const [game, setGame] = useState(new Chess());

  function makeAMove(move) {
    try {
      const result = game.move(move);
      setGame(new Chess(game.fen())); // Actualiza el estado visual

      // Verificar si el juego terminó
      if (game.isGameOver()) {
        const pgn = game.pgn(); // ESTO ES LO QUE NECESITA TU IA
        alert("Juego terminado: " + pgn);
        onGameOver(pgn); // Llamamos a la función para cerrar en blockchain
      }
      return result;
    } catch (e) {
      return null; // Movimiento ilegal
    }
  }

  function onDrop(sourceSquare, targetSquare) {
    const move = makeAMove({
      from: sourceSquare,
      to: targetSquare,
      promotion: "q", // promocionar a reina por defecto
    });
    return move !== null;
  }

  return (
    <div style={{ width: "400px", margin: "auto" }}>
      <h3>Partida # {matchId}</h3>
      <Chessboard position={game.fen()} onPieceDrop={onDrop} />
      <button onClick={() => setGame(new Chess())}>Reiniciar</button>
    </div>
  );
}