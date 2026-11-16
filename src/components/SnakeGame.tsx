
import React, { useEffect, useRef, useState } from "react";

interface SnakeGameProps {
  currentUser?: unknown;
  onUserStatsUpdated?: () => void;
}

interface Point {
  x: number;
  y: number;
}

interface WordQuestion {
  word: string;
  options: string[];
  answer: string;
}

const GRID_SIZE = 20;
const CELL_SIZE = 18;
const CANVAS_SIZE = GRID_SIZE * CELL_SIZE;

const WORDS: WordQuestion[] = [
  { word: "Apple", options: ["Olma", "Nok", "Uzum"], answer: "Olma" },
  { word: "Book", options: ["Daftar", "Kitob", "Qalam"], answer: "Kitob" },
  { word: "Beautiful", options: ["Chiroyli", "Katta", "Tez"], answer: "Chiroyli" },
  { word: "Computer", options: ["Telefon", "Kompyuter", "Televizor"], answer: "Kompyuter" },
  { word: "Friend", options: ["O'qituvchi", "Do'st", "Oila"], answer: "Do'st" },
  { word: "School", options: ["Maktab", "Uy", "Do'kon"], answer: "Maktab" },
  { word: "Water", options: ["Sut", "Sharbat", "Suv"], answer: "Suv" },
  { word: "Morning", options: ["Kechqurun", "Ertalab", "Tushlik"], answer: "Ertalab" },
  { word: "Strong", options: ["Kuchli", "Zaif", "Kichik"], answer: "Kuchli" },
  { word: "Dream", options: ["Orzu", "Qo'rquv", "O'yin"], answer: "Orzu" },
  { word: "Happy", options: ["Xafa", "Xursand", "Charchagan"], answer: "Xursand" },
  { word: "Knowledge", options: ["Bilim", "Pul", "Vaqt"], answer: "Bilim" },
];

const initialSnake = (): Point[] => [
  { x: 9, y: 10 },
  { x: 8, y: 10 },
  { x: 7, y: 10 },
];

const randomFood = (snake: Point[]): Point => {
  let point: Point;

  do {
    point = {
      x: Math.floor(Math.random() * GRID_SIZE),
      y: Math.floor(Math.random() * GRID_SIZE),
    };
  } while (snake.some((part) => part.x === point.x && part.y === point.y));

  return point;
};

const SnakeGame: React.FC<SnakeGameProps> = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const directionRef = useRef<Point>({ x: 1, y: 0 });
  const eatenRef = useRef(0);
  const scoreRef = useRef(0);

  const [snake, setSnake] = useState<Point[]>(initialSnake);
  const [food, setFood] = useState<Point>({ x: 14, y: 10 });
  const [score, setScore] = useState(0);
  const [eaten, setEaten] = useState(0);
  const [bestScore, setBestScore] = useState(0);

  const [running, setRunning] = useState(false);
  const [started, setStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);

  const [showWord, setShowWord] = useState(false);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);

  const currentQuestion = WORDS[questionIndex];

  const changeDirection = (next: Point) => {
    const current = directionRef.current;

    if (next.x === -current.x && next.y === -current.y) return;

    directionRef.current = next;
  };

  const resetGame = () => {
    setSnake(initialSnake());
    setFood({ x: 14, y: 10 });

    directionRef.current = { x: 1, y: 0 };
    eatenRef.current = 0;
    scoreRef.current = 0;

    setScore(0);
    setEaten(0);
    setGameOver(false);
    setShowWord(false);
    setSelectedAnswer(null);
    setStarted(true);
    setRunning(true);
  };

  // Klaviatura boshqaruvi
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const key = event.key.toLowerCase();

      const directions: Record<string, Point> = {
        arrowup: { x: 0, y: -1 },
        w: { x: 0, y: -1 },
        arrowdown: { x: 0, y: 1 },
        s: { x: 0, y: 1 },
        arrowleft: { x: -1, y: 0 },
        a: { x: -1, y: 0 },
        arrowright: { x: 1, y: 0 },
        d: { x: 1, y: 0 },
      };

      if (directions[key]) {
        event.preventDefault();
        changeDirection(directions[key]);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // O'yin mexanikasi
  useEffect(() => {
    if (!running || gameOver || showWord) return;

    const interval = window.setInterval(() => {
      const currentDirection = directionRef.current;

      setSnake((previousSnake) => {
        const head = previousSnake[0];

        const newHead = {
          x: head.x + currentDirection.x,
          y: head.y + currentDirection.y,
        };

        const ateFood = newHead.x === food.x && newHead.y === food.y;

        const hitWall =
          newHead.x < 0 ||
          newHead.x >= GRID_SIZE ||
          newHead.y < 0 ||
          newHead.y >= GRID_SIZE;

        const body = ateFood
          ? previousSnake
          : previousSnake.slice(0, -1);

        const hitSelf = body.some(
          (part) => part.x === newHead.x && part.y === newHead.y
        );

        if (hitWall || hitSelf) {
          setRunning(false);
          setGameOver(true);
          setBestScore((best) => Math.max(best, scoreRef.current));
          return previousSnake;
        }

        const newSnake = [newHead, ...previousSnake];

        if (ateFood) {
          const nextScore = scoreRef.current + 10;
          const nextEaten = eatenRef.current + 1;

          scoreRef.current = nextScore;
          eatenRef.current = nextEaten;

          setScore(nextScore);
          setEaten(nextEaten);
          setFood(randomFood(newSnake));

          if (nextEaten >= 10) {
            setRunning(false);
            setShowWord(true);
            eatenRef.current = 0;
            setEaten(0);
          }
        } else {
          newSnake.pop();
        }

        return newSnake;
      });
    }, 140);

    return () => window.clearInterval(interval);
  }, [running, gameOver, showWord, food]);

  // Canvas chizish
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");

    if (!canvas || !ctx) return;

    ctx.fillStyle = "#101827";
    ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);

    // Grid
    ctx.strokeStyle = "rgba(255,255,255,0.035)";

    for (let i = 0; i <= GRID_SIZE; i++) {
      ctx.beginPath();
      ctx.moveTo(i * CELL_SIZE, 0);
      ctx.lineTo(i * CELL_SIZE, CANVAS_SIZE);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(0, i * CELL_SIZE);
      ctx.lineTo(CANVAS_SIZE, i * CELL_SIZE);
      ctx.stroke();
    }

    // Ovqat
    ctx.fillStyle = "#fb7185";
    ctx.beginPath();
    ctx.arc(
      food.x * CELL_SIZE + CELL_SIZE / 2,
      food.y * CELL_SIZE + CELL_SIZE / 2,
      CELL_SIZE * 0.36,
      0,
      Math.PI * 2
    );
    ctx.fill();

    // Ilon
    snake.forEach((part, index) => {
      const padding = 2;

      ctx.fillStyle = index === 0 ? "#bef264" : "#65a30d";
      ctx.beginPath();
      ctx.roundRect(
        part.x * CELL_SIZE + padding,
        part.y * CELL_SIZE + padding,
        CELL_SIZE - padding * 2,
        CELL_SIZE - padding * 2,
        5
      );
      ctx.fill();
    });
  }, [snake, food]);

  const answerQuestion = (answer: string) => {
    if (selectedAnswer) return;

    setSelectedAnswer(answer);

    if (answer === currentQuestion.answer) {
      const nextScore = scoreRef.current + 50;
      scoreRef.current = nextScore;
      setScore(nextScore);
      setBestScore((best) => Math.max(best, nextScore));
    }
  };

  const continueGame = () => {
    setQuestionIndex((index) => (index + 1) % WORDS.length);
    setSelectedAnswer(null);
    setShowWord(false);
    setRunning(true);
  };

  // Ixcham yo'nalish tugmasi
  const controlButton = (
    symbol: string,
    direction: Point,
    label: string
  ) => (
    <button
      type="button"
      aria-label={label}
      onPointerDown={(event) => {
        event.preventDefault();
        changeDirection(direction);
      }}
      className="flex h-11 w-11 select-none touch-none items-center justify-center rounded-xl border border-white/10 bg-white/10 text-lg font-bold text-white shadow-sm transition active:scale-90 active:bg-lime-400 active:text-black"
    >
      {symbol}
    </button>
  );

  return (
    <div className="mx-auto w-full max-w-[440px] px-3 py-3 text-white">
      {/* Sarlavha */}
      <div className="mb-3 flex items-center justify-between">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[3px] text-lime-400">
            Arcade game
          </p>
          <h1 className="text-2xl font-black">
            Snake <span className="text-lime-400">Game</span>
          </h1>
        </div>

        <div className="rounded-xl border border-lime-400/20 bg-lime-400/10 px-3 py-2 text-right">
          <p className="text-[10px] text-gray-400">BALL</p>
          <p className="text-xl font-black text-lime-400">{score}</p>
        </div>
      </div>

      {/* Statistikalar */}
      <div className="mb-3 grid grid-cols-3 gap-2">
        <div className="rounded-xl border border-white/10 bg-white/5 p-2 text-center">
          <p className="text-[9px] text-gray-400">OVQAT</p>
          <p className="text-base font-bold">{eaten}/10</p>
        </div>

        <div className="rounded-xl border border-white/10 bg-white/5 p-2 text-center">
          <p className="text-[9px] text-gray-400">ILON</p>
          <p className="text-base font-bold">{snake.length}</p>
        </div>

        <div className="rounded-xl border border-white/10 bg-white/5 p-2 text-center">
          <p className="text-[9px] text-gray-400">REKORD</p>
          <p className="text-base font-bold text-yellow-400">{bestScore}</p>
        </div>
      </div>

      {/* Kichik o'yin maydoni */}
      <div className="relative mx-auto w-full max-w-[380px] rounded-2xl border border-white/10 bg-[#0b1220] p-2 shadow-xl">
        <div className="relative mx-auto aspect-square w-full max-w-[360px] overflow-hidden rounded-xl">
          <canvas
            ref={canvasRef}
            width={CANVAS_SIZE}
            height={CANVAS_SIZE}
            className="block h-full w-full"
          />

          {!started && !gameOver && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 text-center">
              <div className="text-4xl">🐍</div>
              <h2 className="mt-2 text-xl font-black">Snake Game</h2>
              <p className="mt-1 text-xs text-gray-300">
                Ovqatlarni yig'ishni boshlang!
              </p>
              <button
                onClick={resetGame}
                className="mt-4 rounded-xl bg-lime-400 px-5 py-2 text-sm font-bold text-black"
              >
                ▶ Boshlash
              </button>
            </div>
          )}

          {gameOver && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/85 text-center">
              <div className="text-4xl">💥</div>
              <h2 className="mt-2 text-xl font-black">O'yin tugadi!</h2>
              <p className="mt-1 text-sm text-gray-300">
                Natijangiz: {score} ball
              </p>
              <button
                onClick={resetGame}
                className="mt-4 rounded-xl bg-lime-400 px-5 py-2 text-sm font-bold text-black"
              >
                ↻ Qayta o'ynash
              </button>
            </div>
          )}

          {showWord && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/85 p-3 backdrop-blur-sm">
              <div className="w-full max-w-[270px] rounded-2xl border border-lime-400/30 bg-[#172234] p-4 text-center">
                <div className="text-3xl">📚</div>
                <p className="mt-2 text-[10px] font-bold uppercase tracking-widest text-lime-400">
                  English challenge
                </p>
                <h2 className="mt-2 text-2xl font-black">
                  {currentQuestion.word}
                </h2>
                <p className="mb-3 mt-1 text-xs text-gray-400">
                  Tarjimasini toping
                </p>

                <div className="space-y-2">
                  {currentQuestion.options.map((option) => (
                    <button
                      key={option}
                      onClick={() => answerQuestion(option)}
                      disabled={!!selectedAnswer}
                      className={`w-full rounded-lg border px-3 py-2 text-sm font-semibold ${
                        selectedAnswer === option
                          ? option === currentQuestion.answer
                            ? "border-lime-400 bg-lime-400/20 text-lime-300"
                            : "border-red-400 bg-red-400/20 text-red-300"
                          : "border-white/10 bg-white/5"
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>

                {selectedAnswer && (
                  <div className="mt-3">
                    <p className={`text-xs font-bold ${
                      selectedAnswer === currentQuestion.answer
                        ? "text-lime-400"
                        : "text-red-400"
                    }`}>
                      {selectedAnswer === currentQuestion.answer
                        ? "Ajoyib! +50 ball 🎉"
                        : `To'g'ri javob: ${currentQuestion.answer}`}
                    </p>

                    <button
                      onClick={continueGame}
                      className="mt-3 w-full rounded-lg bg-lime-400 py-2 text-sm font-bold text-black"
                    >
                      Davom etish →
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* TELEFON UCHUN BOSHQARUV TUGMALARI */}
      <div className="mx-auto mt-3 flex w-fit flex-col items-center gap-1.5">
        {controlButton("▲", { x: 0, y: -1 }, "Yuqoriga")}

        <div className="flex items-center gap-1.5">
          {controlButton("◀", { x: -1, y: 0 }, "Chapga")}
          {controlButton("▼", { x: 0, y: 1 }, "Pastga")}
          {controlButton("▶", { x: 1, y: 0 }, "O'ngga")}
        </div>
      </div>

      {/* Qo'llanma */}
      <div className="mt-3 rounded-xl border border-white/10 bg-white/5 px-3 py-2">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-semibold text-gray-300">
            🎮 Boshqaruv
          </span>
          <span className="text-[10px] text-gray-500">
            WASD / Strelkalar
          </span>
        </div>
        <p className="mt-1 text-[10px] text-gray-500">
          Har 10 ta ovqatdan keyin inglizcha savol chiqadi. To'g'ri javob +50 ball!
        </p>
      </div>
    </div>
  );
};

export default SnakeGame;
