import React, { useState, useEffect, useRef } from 'react';
import { User, BoardGameType, BotDifficulty, BoardGameRoom } from '../types';
import { StorageService } from '../services/storage';
import { 
  Trophy, 
  Crown, 
  Bot, 
  Users, 
  RotateCcw, 
  Play, 
  Flame, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle, 
  Copy, 
  Check, 
  ArrowRight,
  ShieldCheck,
  Zap,
  Coins
} from 'lucide-react';

interface BoardGamesArenaProps {
  currentUser: User | null;
  onUserUpdated: (user: User) => void;
}

// -----------------------------------------------------------------
// INITIAL BOARDS
// -----------------------------------------------------------------
const getInitialChessBoard = (): string[][] => [
  ['bR', 'bN', 'bB', 'bQ', 'bK', 'bB', 'bN', 'bR'],
  ['bP', 'bP', 'bP', 'bP', 'bP', 'bP', 'bP', 'bP'],
  ['', '', '', '', '', '', '', ''],
  ['', '', '', '', '', '', '', ''],
  ['', '', '', '', '', '', '', ''],
  ['', '', '', '', '', '', '', ''],
  ['wP', 'wP', 'wP', 'wP', 'wP', 'wP', 'wP', 'wP'],
  ['wR', 'wN', 'wB', 'wQ', 'wK', 'wB', 'wN', 'wR']
];

const getInitialCheckersBoard = (): string[][] => [
  ['', 'bM', '', 'bM', '', 'bM', '', 'bM'],
  ['bM', '', 'bM', '', 'bM', '', 'bM', ''],
  ['', 'bM', '', 'bM', '', 'bM', '', 'bM'],
  ['', '', '', '', '', '', '', ''],
  ['', '', '', '', '', '', '', ''],
  ['wM', '', 'wM', '', 'wM', '', 'wM', ''],
  ['', 'wM', '', 'wM', '', 'wM', '', 'wM'],
  ['wM', '', 'wM', '', 'wM', '', 'wM', '']
];

// Piece display symbols & names
const CHESS_SYMBOLS: Record<string, { icon: string; name: string }> = {
  'wK': { icon: '♔', name: 'Shoh' },
  'wQ': { icon: '♕', name: 'Farzin' },
  'wR': { icon: '♖', name: 'Rux' },
  'wB': { icon: '♗', name: 'Fil' },
  'wN': { icon: '♘', name: 'Ot' },
  'wP': { icon: '♙', name: 'Piyoda' },
  'bK': { icon: '♚', name: 'Shoh' },
  'bQ': { icon: '♛', name: 'Farzin' },
  'bR': { icon: '♜', name: 'Rux' },
  'bB': { icon: '♝', name: 'Fil' },
  'bN': { icon: '♞', name: 'Ot' },
  'bP': { icon: '♟', name: 'Piyoda' }
};

export const BoardGamesArena: React.FC<BoardGamesArenaProps> = ({ currentUser, onUserUpdated }) => {
  const [activeGame, setActiveGame] = useState<BoardGameType>('chess');
  const [gameMode, setGameMode] = useState<'bot' | 'multiplayer'>('bot');
  const [difficulty, setDifficulty] = useState<BotDifficulty>('medium');

  // Board state
  const [board, setBoard] = useState<string[][]>(getInitialChessBoard());
  const [turn, setTurn] = useState<'white' | 'black'>('white');
  const [selectedCell, setSelectedCell] = useState<[number, number] | null>(null);
  const [validMoves, setValidMoves] = useState<[number, number][]>([]);
  const [capturedWhite, setCapturedWhite] = useState<string[]>([]);
  const [capturedBlack, setCapturedBlack] = useState<string[]>([]);

  // Victory / Game over
  const [winner, setWinner] = useState<'white' | 'black' | 'draw' | null>(null);
  const [rewardClaimed, setRewardClaimed] = useState<{ coins: number; xp: number } | null>(null);

  // Multiplayer room state
  const [roomCodeInput, setRoomCodeInput] = useState('');
  const [activeRoom, setActiveRoom] = useState<BoardGameRoom | null>(null);
  const [roomCopied, setRoomCopied] = useState(false);
  const [multiplayerNotice, setMultiplayerNotice] = useState<string | null>(null);
  const roomPollTimer = useRef<any>(null);

  // Reset when switching game
  useEffect(() => {
    resetGame();
  }, [activeGame]);

  const resetGame = () => {
    const newBoard = activeGame === 'chess' ? getInitialChessBoard() : getInitialCheckersBoard();
    setBoard(newBoard);
    setTurn('white');
    setSelectedCell(null);
    setValidMoves([]);
    setCapturedWhite([]);
    setCapturedBlack([]);
    setWinner(null);
    setRewardClaimed(null);
    setActiveRoom(null);
  };

  // -----------------------------------------------------------------
  // SOUND / HAPTIC EFFECTS (WEB AUDIO)
  // -----------------------------------------------------------------
  const playSound = (type: 'move' | 'capture' | 'win') => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);

      const now = ctx.currentTime;
      if (type === 'move') {
        osc.frequency.setValueAtTime(440, now);
        osc.frequency.exponentialRampToValueAtTime(220, now + 0.08);
        gain.gain.setValueAtTime(0.12, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.08);
        osc.start(now);
        osc.stop(now + 0.08);
      } else if (type === 'capture') {
        osc.frequency.setValueAtTime(600, now);
        osc.frequency.exponentialRampToValueAtTime(300, now + 0.15);
        gain.gain.setValueAtTime(0.18, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.15);
        osc.start(now);
        osc.stop(now + 0.15);
      } else if (type === 'win') {
        osc.frequency.setValueAtTime(523.25, now);
        osc.frequency.setValueAtTime(659.25, now + 0.1);
        osc.frequency.setValueAtTime(783.99, now + 0.2);
        gain.gain.setValueAtTime(0.2, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.4);
        osc.start(now);
        osc.stop(now + 0.4);
      }
    } catch {
      // Audio fallback
    }
  };

  // -----------------------------------------------------------------
  // LEGAL MOVES CALCULATION (CHESS & CHECKERS)
  // -----------------------------------------------------------------
  const getLegalMoves = (r: number, c: number, currentBoard: string[][], currentGame: BoardGameType): [number, number][] => {
    const piece = currentBoard[r][c];
    if (!piece) return [];
    const isWhite = piece.startsWith('w');
    const moves: [number, number][] = [];

    if (currentGame === 'chess') {
      const pType = piece[1]; // P, N, B, R, Q, K
      const forward = isWhite ? -1 : 1;

      // 1. Pawn
      if (pType === 'P') {
        // Step forward 1
        if (r + forward >= 0 && r + forward < 8 && !currentBoard[r + forward][c]) {
          moves.push([r + forward, c]);
          // Step forward 2 from start
          const startRow = isWhite ? 6 : 1;
          if (r === startRow && !currentBoard[r + forward * 2][c]) {
            moves.push([r + forward * 2, c]);
          }
        }
        // Diagonal capture
        for (const dc of [-1, 1]) {
          const nr = r + forward;
          const nc = c + dc;
          if (nr >= 0 && nr < 8 && nc >= 0 && nc < 8) {
            const target = currentBoard[nr][nc];
            if (target && target.startsWith(isWhite ? 'b' : 'w')) {
              moves.push([nr, nc]);
            }
          }
        }
      }

      // 2. Knight
      if (pType === 'N') {
        const knightJumps = [
          [-2, -1], [-2, 1], [-1, -2], [-1, 2],
          [1, -2], [1, 2], [2, -1], [2, 1]
        ];
        for (const [dr, dc] of knightJumps) {
          const nr = r + dr;
          const nc = c + dc;
          if (nr >= 0 && nr < 8 && nc >= 0 && nc < 8) {
            const target = currentBoard[nr][nc];
            if (!target || target.startsWith(isWhite ? 'b' : 'w')) {
              moves.push([nr, nc]);
            }
          }
        }
      }

      // 3. Bishop, Rook, Queen (Rays)
      const rays: [number, number][] = [];
      if (pType === 'B' || pType === 'Q') {
        rays.push([-1, -1], [-1, 1], [1, -1], [1, 1]);
      }
      if (pType === 'R' || pType === 'Q') {
        rays.push([-1, 0], [1, 0], [0, -1], [0, 1]);
      }
      for (const [dr, dc] of rays) {
        let step = 1;
        while (true) {
          const nr = r + dr * step;
          const nc = c + dc * step;
          if (nr < 0 || nr >= 8 || nc < 0 || nc >= 8) break;
          const target = currentBoard[nr][nc];
          if (!target) {
            moves.push([nr, nc]);
          } else {
            if (target.startsWith(isWhite ? 'b' : 'w')) {
              moves.push([nr, nc]);
            }
            break;
          }
          step++;
        }
      }

      // 4. King
      if (pType === 'K') {
        for (let dr = -1; dr <= 1; dr++) {
          for (let dc = -1; dc <= 1; dc++) {
            if (dr === 0 && dc === 0) continue;
            const nr = r + dr;
            const nc = c + dc;
            if (nr >= 0 && nr < 8 && nc >= 0 && nc < 8) {
              const target = currentBoard[nr][nc];
              if (!target || target.startsWith(isWhite ? 'b' : 'w')) {
                moves.push([nr, nc]);
              }
            }
          }
        }
      }
    } else {
      // ----------------- CHECKERS (SHASHKA) -----------------
      const isKing = piece[1] === 'K';
      const forwardDir = isWhite ? -1 : 1;
      const dirs = isKing ? [-1, 1] : [forwardDir];

      // Regular 1-step moves
      for (const dr of dirs) {
        for (const dc of [-1, 1]) {
          const nr = r + dr;
          const nc = c + dc;
          if (nr >= 0 && nr < 8 && nc >= 0 && nc < 8 && !currentBoard[nr][nc]) {
            moves.push([nr, nc]);
          }
        }
      }

      // 2-step Jumps (captures)
      for (const dr of [-1, 1]) {
        for (const dc of [-1, 1]) {
          const midR = r + dr;
          const midC = c + dc;
          const landR = r + dr * 2;
          const landC = c + dc * 2;

          if (landR >= 0 && landR < 8 && landC >= 0 && landC < 8) {
            const midPiece = currentBoard[midR][midC];
            const landPiece = currentBoard[landR][landC];
            if (midPiece && midPiece.startsWith(isWhite ? 'b' : 'w') && !landPiece) {
              moves.push([landR, landC]);
            }
          }
        }
      }
    }

    return moves;
  };

  // -----------------------------------------------------------------
  // MOVE EXECUTION
  // -----------------------------------------------------------------
  const executeMove = (
    fromR: number, 
    fromC: number, 
    toR: number, 
    toC: number, 
    boardToMutate: string[][],
    currentGame: BoardGameType
  ): { nextBoard: string[][]; captured?: string } => {
    const next = boardToMutate.map(row => [...row]);
    let piece = next[fromR][fromC];
    let captured = next[toR][toC];

    // Checkers jump capture
    if (currentGame === 'checkers') {
      if (Math.abs(toR - fromR) === 2 && Math.abs(toC - fromC) === 2) {
        const midR = (fromR + toR) / 2;
        const midC = (fromC + toC) / 2;
        captured = next[midR][midC];
        next[midR][midC] = '';
      }
      // Crowning in Checkers
      if (piece === 'wM' && toR === 0) piece = 'wK';
      if (piece === 'bM' && toR === 7) piece = 'bK';
    }

    // Pawn promotion in Chess
    if (currentGame === 'chess') {
      if (piece === 'wP' && toR === 0) piece = 'wQ';
      if (piece === 'bP' && toR === 7) piece = 'bQ';
    }

    next[toR][toC] = piece;
    next[fromR][fromC] = '';

    return { nextBoard: next, captured };
  };

  // Check victory condition
  const checkGameOver = (b: string[][], currentGame: BoardGameType): 'white' | 'black' | null => {
    if (currentGame === 'chess') {
      let whiteKing = false;
      let blackKing = false;
      for (let r = 0; r < 8; r++) {
        for (let c = 0; c < 8; c++) {
          if (b[r][c] === 'wK') whiteKing = true;
          if (b[r][c] === 'bK') blackKing = true;
        }
      }
      if (!whiteKing) return 'black';
      if (!blackKing) return 'white';
      return null;
    } else {
      let whitePieces = 0;
      let blackPieces = 0;
      for (let r = 0; r < 8; r++) {
        for (let c = 0; c < 8; c++) {
          if (b[r][c].startsWith('w')) whitePieces++;
          if (b[r][c].startsWith('b')) blackPieces++;
        }
      }
      if (whitePieces === 0) return 'black';
      if (blackPieces === 0) return 'white';
      return null;
    }
  };

  // Handle cell click by human player
  const handleCellClick = (r: number, c: number) => {
    if (winner) return;

    // In multiplayer, ensure it's your turn and your piece color
    if (gameMode === 'multiplayer' && activeRoom) {
      const isHost = activeRoom.hostId === currentUser?.id;
      const myColor = isHost ? 'white' : 'black';
      if (turn !== myColor) return;
    } else if (gameMode === 'bot' && turn !== 'white') {
      return; // Wait for bot turn
    }

    const clickedPiece = board[r][c];

    // If cell is in valid moves: make the move!
    if (selectedCell && validMoves.some(([vr, vc]) => vr === r && vc === c)) {
      const [fromR, fromC] = selectedCell;
      const { nextBoard, captured } = executeMove(fromR, fromC, r, c, board, activeGame);

      if (captured) {
        playSound('capture');
        if (captured.startsWith('b')) setCapturedBlack(prev => [...prev, captured]);
        else setCapturedWhite(prev => [...prev, captured]);
      } else {
        playSound('move');
      }

      setBoard(nextBoard);
      setSelectedCell(null);
      setValidMoves([]);

      // Check win
      const won = checkGameOver(nextBoard, activeGame);
      if (won) {
        setWinner(won);
        playSound('win');
        handleGameWon(won);
        return;
      }

      const nextTurn = turn === 'white' ? 'black' : 'white';
      setTurn(nextTurn);

      // Multiplayer room update
      if (gameMode === 'multiplayer' && activeRoom) {
        activeRoom.boardState = JSON.stringify(nextBoard);
        activeRoom.currentTurn = nextTurn;
        activeRoom.moveHistory.push(`${activeGame}: (${fromR},${fromC})->(${r},${c})`);
        StorageService.saveBoardRoom(activeRoom);
      }
      return;
    }

    // Otherwise select current user's piece
    if (clickedPiece && clickedPiece.startsWith(turn === 'white' ? 'w' : 'b')) {
      setSelectedCell([r, c]);
      const moves = getLegalMoves(r, c, board, activeGame);
      setValidMoves(moves);
    } else {
      setSelectedCell(null);
      setValidMoves([]);
    }
  };

  // -----------------------------------------------------------------
  // BOT AI MOVE (EASY, MEDIUM, HARD)
  // -----------------------------------------------------------------
  useEffect(() => {
    if (gameMode !== 'bot' || turn !== 'black' || winner) return;

    const timer = setTimeout(() => {
      makeBotMove();
    }, 600);

    return () => clearTimeout(timer);
  }, [turn, gameMode, winner]);

  const makeBotMove = () => {
    // Collect all legal black moves
    const allMoves: { from: [number, number]; to: [number, number]; isCapture: boolean; value: number }[] = [];

    for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 8; c++) {
        if (board[r][c].startsWith('b')) {
          const moves = getLegalMoves(r, c, board, activeGame);
          for (const [tr, tc] of moves) {
            const target = board[tr][tc];
            const isCapture = !!target || (activeGame === 'checkers' && Math.abs(tr - r) === 2);
            let value = 0;

            if (isCapture) {
              if (activeGame === 'chess') {
                const capturedP = target?.[1] || '';
                if (capturedP === 'Q') value = 90;
                else if (capturedP === 'R') value = 50;
                else if (capturedP === 'B' || capturedP === 'N') value = 30;
                else if (capturedP === 'P') value = 10;
                else if (capturedP === 'K') value = 1000;
              } else {
                value = 40;
              }
            }

            // Center control bonus
            if (tr >= 2 && tr <= 5 && tc >= 2 && tc <= 5) {
              value += 5;
            }

            allMoves.push({ from: [r, c], to: [tr, tc], isCapture, value });
          }
        }
      }
    }

    if (allMoves.length === 0) {
      setWinner('white');
      playSound('win');
      handleGameWon('white');
      return;
    }

    let chosenMove = allMoves[0];

    if (difficulty === 'easy') {
      // Pick random move
      chosenMove = allMoves[Math.floor(Math.random() * allMoves.length)];
    } else if (difficulty === 'medium') {
      // Pick capture if available, or best value with some randomness
      const captures = allMoves.filter(m => m.isCapture);
      if (captures.length > 0) {
        captures.sort((a, b) => b.value - a.value);
        chosenMove = captures[0];
      } else {
        chosenMove = allMoves[Math.floor(Math.random() * allMoves.length)];
      }
    } else {
      // Hard: Highest heuristic score
      allMoves.sort((a, b) => b.value - a.value);
      chosenMove = allMoves[0];
    }

    const [fromR, fromC] = chosenMove.from;
    const [toR, toC] = chosenMove.to;

    const { nextBoard, captured } = executeMove(fromR, fromC, toR, toC, board, activeGame);

    if (captured) {
      playSound('capture');
      setCapturedWhite(prev => [...prev, captured]);
    } else {
      playSound('move');
    }

    setBoard(nextBoard);
    const won = checkGameOver(nextBoard, activeGame);
    if (won) {
      setWinner(won);
      playSound('win');
      handleGameWon(won);
    } else {
      setTurn('white');
    }
  };

  // Victory Rewards
  const handleGameWon = (wonColor: 'white' | 'black') => {
    if (!currentUser) return;
    if (wonColor === 'white') {
      const reward = StorageService.recordBoardGameWin(currentUser.id, activeGame, difficulty);
      setRewardClaimed(reward);
      const updated = StorageService.getCurrentUser();
      if (updated) onUserUpdated(updated);
    }
  };

  // -----------------------------------------------------------------
  // MULTIPLAYER ROOMS SYNC
  // -----------------------------------------------------------------
  const handleCreateRoom = () => {
    if (!currentUser) return;
    const room = StorageService.createBoardRoom(currentUser, activeGame);
    setActiveRoom(room);
    setBoard(JSON.parse(room.boardState));
    setTurn(room.currentTurn);
    setMultiplayerNotice(`Xona yaratildi! Do'stingizga quyidagi kodni bering: ${room.code}`);
  };

  const handleJoinRoom = () => {
    if (!currentUser || !roomCodeInput.trim()) return;
    const res = StorageService.joinBoardRoom(roomCodeInput.trim(), currentUser);
    if (res.success && res.room) {
      setActiveRoom(res.room);
      setActiveGame(res.room.gameType);
      setBoard(JSON.parse(res.room.boardState));
      setTurn(res.room.currentTurn);
      setMultiplayerNotice(res.message);
    } else {
      setMultiplayerNotice(res.message);
    }
  };

  // Polling active room
  useEffect(() => {
    if (gameMode !== 'multiplayer' || !activeRoom) return;

    roomPollTimer.current = setInterval(() => {
      const updated = StorageService.getBoardRoom(activeRoom.code);
      if (updated && updated.lastUpdated > activeRoom.lastUpdated) {
        setActiveRoom(updated);
        setBoard(JSON.parse(updated.boardState));
        setTurn(updated.currentTurn);
      }
    }, 1500);

    return () => clearInterval(roomPollTimer.current);
  }, [activeRoom, gameMode]);

  return (
    <div className="space-y-6 sm:space-y-8 animate-fadeIn">
      {/* Top Banner with Glassmorphism */}
      <div className="relative overflow-hidden rounded-3xl p-6 sm:p-8 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white border border-white/10 shadow-2xl">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-xs font-bold text-amber-300">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Aql va Strategiya Maydoni</span>
            </div>
            <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-white tracking-tight">
              Shaxmat va Shashka Arenasi
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Botga qarshi oson, o'rta yoki qiyin darajalarda intellektual jang olib boring, yoki do'stingizga xona kodini yuborib real vaqtda birga bellashing!
            </p>
          </div>

          {/* Game Switch Buttons */}
          <div className="flex bg-slate-800/80 p-1.5 rounded-2xl border border-slate-700/80 backdrop-blur-md shrink-0 shadow-lg">
            <button
              onClick={() => setActiveGame('chess')}
              className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-extrabold transition-all cursor-pointer flex items-center gap-2 ${
                activeGame === 'chess'
                  ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-md shadow-orange-500/25 scale-102'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Crown className="w-4 h-4" />
              <span>Shaxmat (Chess)</span>
            </button>
            <button
              onClick={() => setActiveGame('checkers')}
              className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-extrabold transition-all cursor-pointer flex items-center gap-2 ${
                activeGame === 'checkers'
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/25 scale-102'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Shashka</span>
            </button>
          </div>
        </div>
      </div>

      {/* Mode & Difficulty Selector Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
        {/* Mode Selector */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => { setGameMode('bot'); resetGame(); }}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              gameMode === 'bot'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <Bot className="w-4 h-4" />
            <span>Botga qarshi (AI)</span>
          </button>
          <button
            onClick={() => { setGameMode('multiplayer'); resetGame(); }}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              gameMode === 'multiplayer'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Do'st bilan ulanish (1v1)</span>
          </button>
        </div>

        {/* Difficulty Selector (when in Bot mode) */}
        {gameMode === 'bot' ? (
          <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
            <span className="text-[11px] font-bold text-slate-500 px-2">Daraja:</span>
            {(['easy', 'medium', 'hard'] as const).map(d => (
              <button
                key={d}
                onClick={() => setDifficulty(d)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  difficulty === d
                    ? d === 'easy'
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : d === 'medium'
                      ? 'bg-amber-600 text-white shadow-xs'
                      : 'bg-rose-600 text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                {d === 'easy' ? '🟢 Oson' : d === 'medium' ? '🟡 O\'rta' : '🔴 Qiyin'}
              </button>
            ))}
          </div>
        ) : (
          <button
            onClick={resetGame}
            className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Qayta boshlash</span>
          </button>
        )}
      </div>

      {/* Multiplayer Room Creation / Join Card */}
      {gameMode === 'multiplayer' && !activeRoom && (
        <div className="p-5 rounded-2xl bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-slate-850 dark:to-slate-800 border border-blue-200 dark:border-blue-900/60 shadow-xs flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-1">
            <h4 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
              <Users className="w-4 h-4 text-blue-600" />
              <span>Do'stingiz bilan real vaqtda o'ynang</span>
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Yangi xona ochib kodni do'stingizga yuboring yoki mavjud xona kodini kiriting.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={handleCreateRoom}
              className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <Play className="w-3.5 h-3.5" />
              <span>Yangi xona ochish</span>
            </button>

            <div className="flex items-center gap-1.5">
              <input
                type="text"
                placeholder="Xona kodi (masalan: CH-123)"
                value={roomCodeInput}
                onChange={(e) => setRoomCodeInput(e.target.value.toUpperCase())}
                className="px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-mono font-bold text-slate-900 dark:text-white uppercase w-36"
              />
              <button
                onClick={handleJoinRoom}
                className="px-3.5 py-2 bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs rounded-xl transition-colors cursor-pointer"
              >
                Ulanish
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Active Room Indicator */}
      {activeRoom && (
        <div className="p-4 rounded-2xl bg-indigo-500/10 border border-indigo-500/25 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="px-3 py-1 rounded-full bg-indigo-600 text-white font-mono font-bold text-xs shadow-xs">
              KOD: {activeRoom.code}
            </span>
            <span className="text-xs text-slate-700 dark:text-slate-300 font-semibold">
              {activeRoom.guestId ? `Raqib: ${activeRoom.guestName}` : 'Do\'stingiz ulanishini kutmoqda...'}
            </span>
          </div>

          <button
            onClick={() => {
              navigator.clipboard.writeText(activeRoom.code);
              setRoomCopied(true);
              setTimeout(() => setRoomCopied(false), 2000);
            }}
            className="px-3 py-1.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            {roomCopied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{roomCopied ? 'Nusxalandi!' : 'Kodni nusxalash'}</span>
          </button>
        </div>
      )}

      {multiplayerNotice && (
        <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900 text-xs text-blue-700 dark:text-blue-300 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{multiplayerNotice}</span>
        </div>
      )}

      {/* Main Board Arena Container */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Interactive Board */}
        <div className="lg:col-span-8 flex flex-col items-center">
          {/* Top Opponent Bar */}
          <div className="w-full max-w-[480px] mb-2.5 p-3 rounded-2xl bg-slate-800 text-white flex items-center justify-between shadow-xs">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center font-bold text-xs">
                {gameMode === 'bot' ? '🤖' : '👥'}
              </div>
              <div>
                <span className="text-xs font-bold block">
                  {gameMode === 'bot' ? `Bot (${difficulty.toUpperCase()})` : (activeRoom?.guestName || 'Raqib')}
                </span>
                <span className="text-[10px] text-slate-400">
                  Qora donalar {turn === 'black' && '• O\'ylamoqda...'}
                </span>
              </div>
            </div>

            {/* Captured white pieces */}
            <div className="flex gap-1 text-sm font-serif">
              {capturedWhite.slice(-6).map((p, idx) => (
                <span key={idx} className="opacity-80">
                  {CHESS_SYMBOLS[p]?.icon || '⚪'}
                </span>
              ))}
            </div>
          </div>

          {/* 8x8 Board Container */}
          <div className="relative p-2.5 sm:p-3 bg-gradient-to-br from-amber-950 via-slate-900 to-amber-950 rounded-3xl shadow-2xl border-4 border-amber-900/60 max-w-[480px] w-full aspect-square">
            <div className="grid grid-cols-8 grid-rows-8 w-full h-full rounded-2xl overflow-hidden border border-amber-900/40 shadow-inner">
              {board.map((row, r) =>
                row.map((cell, c) => {
                  const isDarkSquare = (r + c) % 2 === 1;
                  const isSelected = selectedCell?.[0] === r && selectedCell?.[1] === c;
                  const isValidTarget = validMoves.some(([vr, vc]) => vr === r && vc === c);
                  const isWhitePiece = cell.startsWith('w');

                  return (
                    <button
                      key={`${r}-${c}`}
                      type="button"
                      onClick={() => handleCellClick(r, c)}
                      className={`relative flex items-center justify-center select-none transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-amber-400 ring-4 ring-amber-400/80 z-10'
                          : isDarkSquare
                          ? 'bg-amber-900/70 hover:bg-amber-800/80'
                          : 'bg-amber-100/90 hover:bg-amber-200/90'
                      }`}
                    >
                      {/* Valid move indicator dot */}
                      {isValidTarget && (
                        <span className={`absolute rounded-full transition-all ${
                          cell ? 'w-full h-full border-4 border-emerald-400 bg-emerald-500/25' : 'w-4 h-4 bg-emerald-500 ring-4 ring-emerald-300/40 shadow-md animate-pulse'
                        }`} />
                      )}

                      {/* Piece Renderer */}
                      {cell && (
                        <div className={`transition-transform duration-150 ${
                          isSelected ? 'scale-115' : 'hover:scale-105'
                        }`}>
                          {activeGame === 'chess' ? (
                            <span 
                              className={`text-2xl sm:text-4xl font-serif drop-shadow-md leading-none ${
                                isWhitePiece
                                  ? 'text-white filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]'
                                  : 'text-slate-950 filter drop-shadow-[0_1px_2px_rgba(255,255,255,0.4)]'
                              }`}
                            >
                              {CHESS_SYMBOLS[cell]?.icon}
                            </span>
                          ) : (
                            /* Checkers piece */
                            <div className={`w-7 h-7 sm:w-9 sm:h-9 rounded-full flex items-center justify-center shadow-md border-2 ${
                              isWhitePiece
                                ? 'bg-gradient-to-br from-white to-slate-200 border-slate-300 text-slate-800'
                                : 'bg-gradient-to-br from-slate-900 to-slate-950 border-slate-700 text-white'
                            }`}>
                              {cell.endsWith('K') ? (
                                <Crown className="w-4 h-4 text-amber-400 fill-amber-400" />
                              ) : (
                                <div className="w-3 h-3 rounded-full border border-current opacity-40" />
                              )}
                            </div>
                          )}
                        </div>
                      )}
                    </button>
                  );
                })
              )}
            </div>
          </div>

          {/* Bottom Player Bar */}
          <div className="w-full max-w-[480px] mt-2.5 p-3 rounded-2xl bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-800 flex items-center justify-between shadow-xs">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs">
                {currentUser?.fullName?.[0] || 'S'}
              </div>
              <div>
                <span className="text-xs font-bold text-slate-900 dark:text-white block">
                  {currentUser?.fullName || 'Siz'} (Oq donalar)
                </span>
                <span className="text-[10px] text-blue-600 dark:text-blue-400 font-semibold">
                  {turn === 'white' ? '🟢 Sizning navbatingiz' : 'Kutilmoqda...'}
                </span>
              </div>
            </div>

            {/* Captured black pieces */}
            <div className="flex gap-1 text-sm font-serif">
              {capturedBlack.slice(-6).map((p, idx) => (
                <span key={idx} className="opacity-80">
                  {CHESS_SYMBOLS[p]?.icon || '⚫'}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Info, Rules & Strategy Card */}
        <div className="lg:col-span-4 space-y-4">
          {/* Turn indicator card */}
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                O'yin Holati
              </span>
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                turn === 'white' ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300' : 'bg-slate-800 text-white'
              }`}>
                {turn === 'white' ? 'Oq donalar yurishi' : 'Qora donalar yurishi'}
              </span>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 text-xs space-y-1">
              <span className="font-semibold text-slate-700 dark:text-slate-300 block">
                Tanlangan o'yin: <strong className="text-blue-600">{activeGame === 'chess' ? 'Shaxmat' : 'Shashka'}</strong>
              </span>
              <span className="text-slate-500 text-[11px] block">
                Rejim: {gameMode === 'bot' ? `Bot (${difficulty})` : 'Multiplayer 1v1'}
              </span>
            </div>

            <div className="pt-1 flex gap-2">
              <button
                onClick={resetGame}
                className="flex-1 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Qaytadan boshlash</span>
              </button>
            </div>
          </div>

          {/* Rules & Rewards info */}
          <div className="p-5 rounded-2xl bg-gradient-to-br from-amber-500/10 via-orange-500/10 to-transparent border border-amber-500/25 space-y-3">
            <div className="flex items-center gap-2 text-amber-800 dark:text-amber-300 font-bold text-xs">
              <Trophy className="w-4 h-4 text-amber-500" />
              <span>G'alaba Mukofotlari</span>
            </div>
            <ul className="text-xs text-slate-600 dark:text-slate-300 space-y-1.5 list-disc list-inside">
              <li>🟢 Oson botni yutganda: <strong>+40 Coin / +50 XP</strong></li>
              <li>🟡 O'rta botni yutganda: <strong>+70 Coin / +90 XP</strong></li>
              <li>🔴 Qiyin botni yutganda: <strong>+120 Coin / +150 XP</strong></li>
              <li>👥 Do'st ustidan g'alaba: <strong>+100 Coin / +120 XP</strong></li>
            </ul>
          </div>
        </div>
      </div>

      {/* Victory Celebration Modal */}
      {winner && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 text-center shadow-2xl space-y-5">
            <div className="w-16 h-16 rounded-3xl bg-amber-500 text-white flex items-center justify-center mx-auto shadow-lg shadow-amber-500/30 animate-bounce">
              <Trophy className="w-8 h-8" />
            </div>

            <div className="space-y-1">
              <h3 className="font-display font-extrabold text-2xl text-slate-900 dark:text-white">
                {winner === 'white' ? 'Tabriklaymiz, G\'alaba!' : 'Raqib G\'olib Bo\'ldi!'}
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                {winner === 'white'
                  ? `${activeGame === 'chess' ? 'Shaxmat' : 'Shashka'} o'yinida ajoyib strategik g'alaba qozondingiz!`
                  : 'Bu safar omad yetishmadi. Qaytadan urinib ko\'ring!'}
              </p>
            </div>

            {winner === 'white' && rewardClaimed && (
              <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 flex items-center justify-center gap-4">
                <span className="text-sm font-bold text-amber-600 dark:text-amber-400 flex items-center gap-1.5">
                  <Coins className="w-4 h-4" />
                  +{rewardClaimed.coins} Coin
                </span>
                <span className="text-sm font-bold text-blue-600 dark:text-blue-400 flex items-center gap-1.5">
                  <Zap className="w-4 h-4" />
                  +{rewardClaimed.xp} XP
                </span>
              </div>
            )}

            <button
              onClick={resetGame}
              className="w-full py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md transition-all cursor-pointer"
            >
              Yangi o'yin boshlash
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
