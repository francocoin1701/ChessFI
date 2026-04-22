import React, { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { Chess } from "chess.js";
import io from "socket.io-client";
import { ethers, BrowserProvider, Contract, parseUnits } from "ethers";
import Board from "./components/Board";
import Lobby from "./components/Lobby";
import GamePanel from "./components/GamePanel";
import LandingPage from "./components/LandingPage";
import Intro from "./components/Intro";

const BACKEND_URL = "https://chess-server-backend.onrender.com";

const socket = io(BACKEND_URL, { transports: ["websocket"] });

const CONTRACT_ADDRESS = "0xa809761C3c878e982136b9f41519326193df1DF3";

const ABI = [
    "function crearReto() external payable",
    "function aceptarReto(uint256) external payable",
    "function nextId() view returns (uint256)",
    "function getPartidaActiva(address) view returns (bool activa, uint256 id)",
    "function partidas(uint256) view returns (address creador, address oponente, uint256 montoApuesta, uint8 estado, string pgnOficial, uint8 colorCreador, uint8 resultado)",
    "function triggerAgent(uint256, string, uint8) external",
    "event RetoCreado(uint256 indexed id, address creador, uint256 monto)",
    "event RetoAceptado(uint256 indexed id, address oponente)",
    "event PartidaFinalizada(uint256 indexed id, address winner, uint8 resultado)",
    "event PartidaCancelada(uint256 indexed id)"
];

export default function App() {
    const game = useMemo(() => new Chess(), []);

    const [view, setView] = useState('intro');
    const [user, setUser] = useState(null);
    const [opponentUser, setOpponentUser] = useState(null);
    const [roomId, setRoomId] = useState(null);
    const [myColor, setMyColor] = useState(null);
    const [challenges, setChallenges] = useState([]);
    const [timers, setTimers] = useState({ w: 600, b: 600 });
    const [isGameActive, setIsGameActive] = useState(false);
    const [selected, setSelected] = useState(null);
    const [loadingChain, setLoadingChain] = useState(false);
    const [pgn, setPgn] = useState('');
    const [gameResult, setGameResult] = useState(null);
    const [pendingPayment, setPendingPayment] = useState(null);
    const [processingPayment, setProcessingPayment] = useState(false);
    const [, forceUpdate] = useState(0);

    const userRef = useRef(user);
    const challengesRef = useRef(challenges);
    const roomIdRef = useRef(roomId);

    useEffect(() => { userRef.current = user; }, [user]);
    useEffect(() => { challengesRef.current = challenges; }, [challenges]);
    useEffect(() => { roomIdRef.current = roomId; }, [roomId]);

    const checkBusyOnChain = useCallback(async (walletAddress) => {
        try {
            const provider = new BrowserProvider(window.ethereum);
            const contract = new Contract(CONTRACT_ADDRESS, ABI, provider);
            const result = await contract.getPartidaActiva(walletAddress);
            return result.activa;
        } catch {
            return false;
        }
    }, []);

    useEffect(() => {
        socket.on('auth_success', async (profile) => {
            setUser(profile);
            try {
                const provider = new BrowserProvider(window.ethereum);
                const contract = new Contract(CONTRACT_ADDRESS, ABI, provider);
                const res = await contract.getPartidaActiva(profile.wallet);
                if (res.activa) {
                    const id = Number(res.id);
                    const rId = `room_${id}`;
                    const partida = await contract.partidas(id);
                    const colorCreador = Number(partida.colorCreador);
                    const esCreador = partida.creador.toLowerCase() === profile.wallet.toLowerCase();
                    const miColor = esCreador
                        ? (colorCreador === 0 ? 'w' : 'b')
                        : (colorCreador === 0 ? 'b' : 'w');
                    setRoomId(rId);
                    setMyColor(miColor);
                    setIsGameActive(true);
                    setView('game');
                    socket.emit('join_room', { roomId: rId });
                } else {
                    setView('lobby');
                    socket.emit('get_challenges');
                }
            } catch {
                setView('lobby');
                socket.emit('get_challenges');
            }
        });

        socket.on('list_challenges', (list) => setChallenges(list));
        socket.on('opponent_info', (info) => setOpponentUser(info));

        socket.on('challenge_created', (data) => {
            const currentUser = userRef.current;
            if (currentUser && data.creator_wallet.toLowerCase() === currentUser.wallet.toLowerCase()) {
                setRoomId(data.roomId);
                setIsGameActive(true);
                setMyColor(data.colorCreador === 0 ? 'w' : 'b');
                setPgn('');
                setView('game');
                socket.emit('join_room', { roomId: data.roomId });
            }
        });

        socket.on('challenge_accepted_global', (data) => {
            const currentUser = userRef.current;
            if (!currentUser) return;
            const isMyChallenge = challengesRef.current.some(c =>
                c.room_id === data.roomId &&
                c.creator_wallet.toLowerCase() === currentUser.wallet.toLowerCase()
            );
            const amIJoiner = data.joiner.toLowerCase() === currentUser.wallet.toLowerCase();
            if (isMyChallenge || amIJoiner) {
                setRoomId(data.roomId);
                setIsGameActive(true);
                setView('game');
                socket.emit('join_room', { roomId: data.roomId });
            }
        });

        socket.on('player_color', (c) => {
            if (c !== 'viewer') setMyColor(c);
        });

        socket.on('update_game', (d) => {
            if (d.pgn !== undefined) {
                game.loadPgn(d.pgn);
                setPgn(d.pgn);
            }
            if (d.timers) setTimers(d.timers);
            forceUpdate(n => n + 1);
        });

        socket.on('timer_update', ({ timers }) => setTimers({ ...timers }));

        socket.on('trigger_agent_ready', async ({ blockchainId, pgn, actionType }) => {
            try {
                const provider = new BrowserProvider(window.ethereum);
                const signer = await provider.getSigner();
                const contract = new Contract(CONTRACT_ADDRESS, ABI, signer);
                const tx = await contract.triggerAgent(blockchainId, pgn, actionType);
                // Avisar al servidor que la tx fue enviada → cambia estado a 'processing'
                socket.emit('payment_sent', { blockchainId });
                setProcessingPayment(true);
                await tx.wait();
                console.log("triggerAgent confirmado:", blockchainId);
            } catch (e) {
                console.error("Error en triggerAgent:", e);
            }
        });

        socket.on('game_over', (result) => {
            const currentRoomId = roomIdRef.current;
            if (currentRoomId) socket.emit('leave_room', { roomId: currentRoomId });
            setIsGameActive(false);
            setGameResult(result);
            setRoomId(null);
            setMyColor(null);
            setSelected(null);
            setPgn('');
            game.reset();
            forceUpdate(n => n + 1);
            setView('result');
            socket.emit('get_challenges');
        });

        // Pago pendiente — oráculo no confirmó, mostrar botón en lobby
        socket.on('pending_payment', (data) => {
            console.log("[PENDING] Pago pendiente:", data);
            setPendingPayment(data);
            setIsGameActive(false);
            setView('lobby');
        });

        // Oráculo confirmó on-chain → desbloquear todo
        socket.on('payment_confirmed', () => {
            console.log("[PENDING] Pago confirmado on-chain");
            setPendingPayment(null);
            setProcessingPayment(false);
        });

        socket.on('error_msg', (msg) => {
            alert("Error: " + msg);
            setLoadingChain(false);
        });

        return () => {
            socket.off('auth_success');
            socket.off('list_challenges');
            socket.off('opponent_info');
            socket.off('challenge_created');
            socket.off('challenge_accepted_global');
            socket.off('player_color');
            socket.off('update_game');
            socket.off('timer_update');
            socket.off('trigger_agent_ready');
            socket.off('game_over');
            socket.off('pending_payment');
            socket.off('payment_confirmed');
            socket.off('error_msg');
        };
    }, [game]);

    useEffect(() => {
        if (view === 'lobby') {
            socket.emit('get_challenges');
            if (pendingPayment) {
                socket.emit('check_pending_payment', {
                    blockchainId: pendingPayment.blockchainId
                });
            }
        }
    }, [view, pendingPayment]);

    const handleCreate = async (amount, time) => {
        if (!user?.wallet) return;
        if (pendingPayment) return alert("Tienes un pago pendiente. Resuélvelo antes de crear una nueva apuesta.");
        setLoadingChain(true);
        try {
            const busy = await checkBusyOnChain(user.wallet);
            if (busy) { setLoadingChain(false); return alert("Ya tienes una apuesta activa en cadena"); }
            const provider = new BrowserProvider(window.ethereum);
            const signer = await provider.getSigner();
            const contract = new Contract(CONTRACT_ADDRESS, ABI, signer);
            const tx = await contract.crearReto({ value: parseUnits(amount.toString(), "ether") });
            const receipt = await tx.wait();
            let bId = null;
            for (const log of receipt.logs) {
                try {
                    const parsed = contract.interface.parseLog(log);
                    if (parsed && parsed.name === "RetoCreado") bId = Number(parsed.args[0]);
                } catch (e) { }
            }
            if (bId === null) bId = Number(await contract.nextId()) - 1;
            const partida = await contract.partidas(bId);
            socket.emit('create_challenge', {
                blockchainId: bId,
                colorCreador: Number(partida.colorCreador),
                amount: amount.toString(),
                timeLimit: time,
                creador: user.wallet
            });
            const rId = `room_${bId}`;
            setRoomId(rId);
            setMyColor(Number(partida.colorCreador) === 0 ? 'w' : 'b');
            setPgn('');
            setIsGameActive(true);
            setView('game');
            socket.emit('join_room', { roomId: rId });
        } catch (e) {
            console.error(e);
            alert("Error en Blockchain");
        } finally {
            setLoadingChain(false);
        }
    };

    const handleAccept = async (challenge) => {
        if (!user?.wallet) return;
        if (pendingPayment) return alert("Tienes un pago pendiente. Resuélvelo antes de aceptar una apuesta.");
        setLoadingChain(true);
        try {
            const busy = await checkBusyOnChain(user.wallet);
            if (busy) { setLoadingChain(false); return alert("Ya tienes una apuesta activa en cadena"); }
            const provider = new BrowserProvider(window.ethereum);
            const signer = await provider.getSigner();
            const contract = new Contract(CONTRACT_ADDRESS, ABI, signer);
            const tx = await contract.aceptarReto(
                challenge.blockchain_id,
                { value: parseUnits(challenge.bet_amount.toString(), "ether") }
            );
            await tx.wait();
            socket.emit('accept_challenge', challenge.blockchain_id);
            setRoomId(challenge.room_id);
            setIsGameActive(true);
            setView('game');
            socket.emit('join_room', { roomId: challenge.room_id });
        } catch (e) {
            console.error(e);
            alert("Error en Pago");
        } finally {
            setLoadingChain(false);
        }
    };

    // Reintentar pago pendiente — cualquiera de los dos jugadores puede llamarlo
    const handlePayPending = useCallback(async () => {
        if (!pendingPayment) return;
        setLoadingChain(true);
        try {
            const provider = new BrowserProvider(window.ethereum);
            const signer = await provider.getSigner();
            const contract = new Contract(CONTRACT_ADDRESS, ABI, signer);
            const tx = await contract.triggerAgent(
                pendingPayment.blockchainId,
                pendingPayment.pgn,
                pendingPayment.actionType
            );
            socket.emit('payment_sent', { blockchainId: pendingPayment.blockchainId });
            setProcessingPayment(true);
            await tx.wait();
        } catch (e) {
            console.error("Error reintentando pago:", e);
            alert("Error enviando pago: " + e.message);
            setProcessingPayment(false);
        } finally {
            setLoadingChain(false);
        }
    }, [pendingPayment]);

    const handleSquareClick = useCallback((sq) => {
        if (!myColor || myColor === 'viewer') return;
        if (!selected) {
            const piece = game.get(sq);
            if (!piece || piece.color !== myColor) return;
            setSelected(sq);
            return;
        }
        socket.emit('move', { roomId, moveData: { from: selected, to: sq, promotion: 'q' } });
        setSelected(null);
    }, [myColor, selected, game, roomId]);

    const handleGoToLobby = useCallback(() => {
        if (roomIdRef.current) socket.emit('leave_room', { roomId: roomIdRef.current });
        setView('lobby');
    }, []);

    if (view === 'intro') return <Intro onFinish={() => setView('auth')} />;

    if (view === 'auth') return (
        <LandingPage onLogin={async () => {
            try {
                const provider = new BrowserProvider(window.ethereum);
                const signer = await provider.getSigner();
                const address = await signer.getAddress();
                const msg = "Login:" + Date.now();
                const sig = await signer.signMessage(msg);
                socket.emit('auth_web3', { address, signature: sig, message: msg });
            } catch {
                alert("Error conectando MetaMask");
            }
        }} />
    );

    if (view === 'result') return (
        <div style={s.bg}>
            <div style={s.resultBox}>
                <div style={{ fontSize: '3rem', marginBottom: '10px' }}>
                    {gameResult?.reason === 'timeout' ? '⏱' : '♟'}
                </div>
                <h2 style={{ color: '#f39c12', marginBottom: '8px' }}>Partida Finalizada</h2>
                <p style={{ color: '#fff', marginBottom: '4px' }}>
                    {gameResult?.winner
                        ? `Ganador: ${gameResult.winner.slice(0, 6)}...${gameResult.winner.slice(-4)}`
                        : 'Empate'}
                </p>
                <p style={{ color: '#666', fontSize: '0.8rem', marginBottom: '20px' }}>
                    {gameResult?.reason === 'timeout' ? 'Victoria por tiempo' :
                        gameResult?.reason === 'checkmate' ? 'Jaque mate' : 'Empate'}
                </p>
                <button onClick={() => { setGameResult(null); setView('lobby'); socket.emit('get_challenges'); }} style={s.btn}>
                    VOLVER AL LOBBY
                </button>
            </div>
        </div>
    );

    return (
        <div style={s.bg}>
            {view === 'lobby' && (
                <>
                    {/* Banner pago pendiente — fijo en la parte superior */}
                    {pendingPayment && (
                        <div style={s.pendingBar}>
                            {processingPayment ? (
                                <span>⏳ Procesando pago en blockchain... espera la confirmación del oráculo</span>
                            ) : (
                                <>
                                    <span>⚠️ Partida #{pendingPayment.blockchainId} tiene un pago pendiente</span>
                                    <button
                                        onClick={handlePayPending}
                                        style={s.pendingBtn}
                                        disabled={loadingChain}
                                    >
                                        {loadingChain ? 'Enviando...' : 'Resolver pago'}
                                    </button>
                                </>
                            )}
                        </div>
                    )}

                    {loadingChain && !pendingPayment && (
                        <div style={s.loadingBar}>Esperando confirmacion en cadena...</div>
                    )}

                    <Lobby
                        challenges={challenges}
                        user={user}
                        isBusy={isGameActive || loadingChain || !!pendingPayment}
                        activeRoomId={isGameActive ? roomId : null}
                        onCreateChallenge={handleCreate}
                        onAcceptChallenge={handleAccept}
                        onReturnToGame={() => setView('game')}
                    />
                </>
            )}

            {view === 'game' && (
                <div style={s.gameLayout}>
                    <Board
                        game={game}
                        myColor={myColor}
                        selected={selected}
                        onSquareClick={handleSquareClick}
                    />
                    <GamePanel
                        myColor={myColor || 'w'}
                        timers={timers}
                        pgn={pgn}
                        myUser={user}
                        opponentUser={opponentUser}
                    />
                    <div style={s.gameRight}>
                        <button onClick={handleGoToLobby} style={s.btnSmall}>LOBBY</button>
                    </div>
                </div>
            )}
        </div>
    );
}

const s = {
    bg: {
        backgroundColor: '#0a0a0a', color: '#fff', minHeight: '100vh',
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        justifyContent: 'center', fontFamily: "'Segoe UI', sans-serif"
    },
    gameLayout: { display: 'flex', gap: '16px', alignItems: 'flex-start', padding: '20px' },
    gameRight: { display: 'flex', flexDirection: 'column', gap: '10px', paddingTop: '8px' },
    resultBox: {
        backgroundColor: '#111', border: '1px solid #222', borderRadius: '16px',
        padding: '40px', textAlign: 'center', maxWidth: '380px'
    },
    btn: {
        padding: '12px 28px', backgroundColor: '#f39c12', border: 'none',
        borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', fontSize: '0.9rem', color: '#000'
    },
    btnSmall: {
        padding: '8px 16px', backgroundColor: 'transparent', border: '1px solid #333',
        borderRadius: '6px', color: '#666', cursor: 'pointer', fontSize: '0.75rem'
    },
    loadingBar: {
        backgroundColor: '#1a1a1a', border: '1px solid #f39c12', width: '100%',
        padding: '8px', textAlign: 'center', fontSize: '0.8rem', color: '#f39c12',
        position: 'fixed', top: 0, zIndex: 99
    },
    pendingBar: {
        backgroundColor: '#1a0f00', border: '1px solid #e67e22', width: '100%',
        padding: '10px 16px', textAlign: 'center', fontSize: '0.85rem', color: '#e67e22',
        position: 'fixed', top: 0, zIndex: 100, display: 'flex',
        alignItems: 'center', justifyContent: 'center', gap: '12px'
    },
    pendingBtn: {
        backgroundColor: '#e67e22', border: 'none', borderRadius: '6px',
        padding: '6px 14px', fontWeight: 'bold', cursor: 'pointer', color: '#000', fontSize: '0.8rem'
    }
};