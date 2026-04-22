import React from "react";

const getImg = (c, t) => {
  const m = {
    w: { p: "4/45/Chess_plt45.svg", r: "7/72/Chess_rlt45.svg", n: "7/70/Chess_nlt45.svg", b: "b/b1/Chess_blt45.svg", q: "1/15/Chess_qlt45.svg", k: "4/42/Chess_klt45.svg" },
    b: { p: "c/c7/Chess_pdt45.svg", r: "f/ff/Chess_rdt45.svg", n: "e/ef/Chess_ndt45.svg", b: "9/98/Chess_bdt45.svg", q: "4/47/Chess_qdt45.svg", k: "f/f0/Chess_kdt45.svg" }
  };
  return m[c][t];
};

export default function Board({ game, myColor, selected, onSquareClick }) {
  const boardData = game.board();
  const alphabet = "abcdefgh";
  const range = [0, 1, 2, 3, 4, 5, 6, 7];
  const rows = myColor === 'b' ? [...range].reverse() : range;
  const cols = myColor === 'b' ? [...range].reverse() : range;

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(8, 56px)',
      border: '3px solid #f39c12',
      borderRadius: '4px',
      overflow: 'hidden'
    }}>
      {rows.map(i =>
        cols.map(j => {
          const sq = alphabet[j] + (8 - i);
          const piece = boardData[i][j];
          const isDark = (i + j) % 2 === 1;
          const isSelected = selected === sq;
          const isCheck = piece && piece.type === 'k' && piece.color === game.turn() && game.isCheck();

          let bg = isDark ? '#1a1a1a' : '#f5f5f5';
          if (isSelected) bg = '#f39c12';
          if (isCheck) bg = '#e74c3c';

          // neon blanco para piezas negras, neon negro/gris para piezas blancas
          const pieceGlow = piece
            ? piece.color === 'w'
              ? '0 0 4px rgba(0,0,0,0.9), 0 0 8px rgba(0,0,0,0.6)'
              : '0 0 4px rgba(255,255,255,0.9), 0 0 10px rgba(255,255,255,0.5)'
            : 'none';

          return (
            <div
              key={sq}
              onClick={() => onSquareClick(sq)}
              style={{
                width: '56px', height: '56px',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                backgroundColor: bg,
                cursor: 'pointer',
                transition: 'background-color 0.1s'
              }}
            >
              {piece && (
                <img
                  src={`https://upload.wikimedia.org/wikipedia/commons/${getImg(piece.color, piece.type)}`}
                  style={{
                    width: '44px', height: '44px',
                    filter: piece.color === 'w'
                      ? 'drop-shadow(0 0 3px rgba(0,0,0,1)) drop-shadow(0 0 6px rgba(0,0,0,0.8))'
                      : 'drop-shadow(0 0 3px rgba(255,255,255,1)) drop-shadow(0 0 7px rgba(255,255,255,0.7))'
                  }}
                  alt=""
                />
              )}
            </div>
          );
        })
      )}
    </div>
  );
}