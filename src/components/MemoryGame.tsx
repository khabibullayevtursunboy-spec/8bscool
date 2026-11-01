import React, { useState, useEffect } from 'react';
import { User } from '../types';
import { StorageService } from '../services/storage';
import { Brain, Trophy, RotateCcw, Sparkles, CheckCircle2, Zap } from 'lucide-react';

interface MemoryGameProps {
  currentUser: User | null;
  onUserStatsUpdated: () => void;
}

interface Card {
  id: number;
  content: string;
  pairId: number;
  isFlipped: boolean;
  isMatched: boolean;
}

const GAME_PAIRS = [
  { item1: 'H₂O', item2: 'Suv formulasi' },
  { item1: 'F = m·a', item2: 'Nyuton 2-qonuni' },
  { item1: 'E = mc²', item2: 'Einstein tenglamasi' },
  { item1: 'CO₂', item2: 'Uglerod angidrid' },
  { item1: 'S = v·t', item2: 'Masofa formulasi' },
  { item1: 'NaCl', item2: 'Osh tuzi' },
];

export const MemoryGame: React.FC<MemoryGameProps> = ({ currentUser, onUserStatsUpdated }) => {
  const [cards, setCards] = useState<Card[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [isChecking, setIsChecking] = useState(false);
  const [moves, setMoves] = useState(0);
  const [isWon, setIsWon] = useState(false);

  // O'yinni boshlash / qaytadan boshlash
  const initializeGame = () => {
    let deck: Card[] = [];
    let idCounter = 0;

    GAME_PAIRS.forEach((pair, index) => {
      deck.push({ id: idCounter++, content: pair.item1, pairId: index, isFlipped: false, isMatched: false });
      deck.push({ id: idCounter++, content: pair.item2, pairId: index, isFlipped: false, isMatched: false });
    });

    // Kartalarni aralashtirish
    deck = deck.sort(() => Math.random() - 0.5);
    setCards(deck);
    setFlippedCards([]);
    setMoves(0);
    setIsWon(false);
  };

  useEffect(() => {
    initializeGame();
  }, []);

  const handleCardClick = (id: number) => {
    if (isChecking || isWon) return;
    const clickedCard = cards.find(c => c.id === id);
    if (!clickedCard || clickedCard.isFlipped || clickedCard.isMatched) return;

    // Kartani ochish
    const newCards = cards.map(c => c.id === id ? { ...c, isFlipped: true } : c);
    setCards(newCards);

    const newFlipped = [...flippedCards, id];
    setFlippedCards(newFlipped);

    if (newFlipped.length === 2) {
      setMoves(prev => prev + 1);
      setIsChecking(true);
      const [firstId, secondId] = newFlipped;
      const firstCard = newCards.find(c => c.id === firstId);
      const secondCard = newCards.find(c => c.id === secondId);

      if (firstCard && secondCard && firstCard.pairId === secondCard.pairId) {
        // Juftlik topildi
        setCards(prev => prev.map(c => c.pairId === firstCard.pairId ? { ...c, isMatched: true } : c));
        setFlippedCards([]);
        setIsChecking(false);

        // Hammasi topilganini tekshirish
        setTimeout(() => {
          setCards(latestCards => {
            if (latestCards.every(c => c.isMatched)) {
              setIsWon(true);
              if (currentUser) {
                StorageService.addCoinsAndXp(currentUser.id, 40, 50);
                onUserStatsUpdated();
              }
            }
            return latestCards;
          });
        }, 200);

      } else {
        // Juftlik topilmadi, ortga yopish
        setTimeout(() => {
          setCards(prev => prev.map(c => c.id === firstId || c.id === secondId ? { ...c, isFlipped: false } : c));
          setFlippedCards([]);
          setIsChecking(false);
        }, 800);
      }
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6 animate-fadeIn max-w-4xl mx-auto px-2 sm:px-4 pb-12 select-none">
      {/* Dynamic Banner */}
      <div className="relative overflow-hidden rounded-3xl p-5 sm:p-7 bg-gradient-to-r from-teal-600 via-emerald-600 to-cyan-700 text-white border border-teal-400/20 shadow-2xl">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-48 h-48 sm:w-64 sm:h-64 bg-emerald-300/20 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="space-y-1.5 text-center sm:text-left">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-[11px] font-extrabold text-teal-100 shadow-sm">
              <Brain className="w-3.5 h-3.5 text-emerald-300 animate-pulse" />
              <span>Mantiq va Xotira Mashqi</span>
            </div>
            <h2 className="font-display font-black text-xl sm:text-3xl text-white tracking-tight">
              Xotira O'yini (Memory Game)
            </h2>
            <p className="text-xs sm:text-sm text-teal-100/90 font-medium max-w-md">
              Fan formulalari va ularning ta'riflarini o'zaro mos juftlikda toping!
            </p>
          </div>

          <div className="flex items-center gap-3 bg-black/25 backdrop-blur-lg px-4 py-2.5 rounded-2xl border border-white/15 text-xs font-mono font-bold w-full sm:w-auto justify-between sm:justify-start">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-400" />
              <span>Urinishlar: <span className="text-emerald-300 font-extrabold text-sm">{moves}</span></span>
            </div>
            <button
              onClick={initializeGame}
              className="p-2 bg-white/20 hover:bg-white/30 active:scale-95 rounded-xl transition-all cursor-pointer shadow-sm"
              title="Qaytadan boshlash"
            >
              <RotateCcw className="w-4 h-4 text-white" />
            </button>
          </div>
        </div>
      </div>

      {/* Grid Kartochkalar / Yutuq Paneli */}
      <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-2xl border border-slate-200/80 dark:border-slate-800 rounded-3xl p-4 sm:p-7 shadow-xl">
        {isWon ? (
          <div className="py-8 sm:py-12 text-center space-y-4 animate-scaleUp">
            <div className="w-20 h-20 bg-emerald-500/15 text-emerald-500 rounded-3xl flex items-center justify-center mx-auto shadow-inner border border-emerald-500/30">
              <Trophy className="w-10 h-10 animate-bounce" />
            </div>
            <div className="space-y-1">
              <h3 className="font-display font-black text-xl sm:text-3xl text-slate-900 dark:text-white">
                Tabriklaymiz! 🎉
              </h3>
              <p className="text-sm font-bold text-emerald-600 dark:text-emerald-400">
                Barcha juftliklar muvaffaqiyatli topildi!
              </p>
            </div>
            
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 font-medium max-w-sm mx-auto">
              Siz <span className="text-emerald-500 font-extrabold">{moves} ta</span> urinishda marraga yetdingiz va <span className="text-amber-500 font-extrabold">+40 Coin, +50 XP</span> mukofotga ega bo'ldingiz!
            </p>

            <button
              onClick={initializeGame}
              className="px-6 py-3.5 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-600 text-white font-extrabold text-xs sm:text-sm rounded-2xl shadow-lg shadow-teal-500/30 hover:shadow-teal-500/50 active:scale-95 transition-all cursor-pointer inline-flex items-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Yana bir bor o'ynash</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5 sm:gap-4">
            {cards.map(card => {
              const showContent = card.isFlipped || card.isMatched;

              return (
                <button
                  key={card.id}
                  onClick={() => handleCardClick(card.id)}
                  disabled={card.isMatched || card.isFlipped}
                  className={`h-24 sm:h-28 rounded-2xl font-bold text-xs sm:text-sm transition-all duration-300 flex items-center justify-center p-3 text-center cursor-pointer active:scale-95 select-none relative overflow-hidden ${
                    card.isMatched
                      ? 'bg-emerald-500/10 dark:bg-emerald-950/30 border-2 border-emerald-500/60 text-emerald-700 dark:text-emerald-300 opacity-80 pointer-events-none'
                      : showContent
                      ? 'bg-white dark:bg-slate-800 border-2 border-teal-500 text-slate-900 dark:text-white shadow-lg scale-[1.02] z-10'
                      : 'bg-gradient-to-br from-teal-600 via-emerald-600 to-cyan-700 hover:from-teal-500 hover:to-cyan-600 text-white border border-teal-400/30 shadow-md'
                  }`}
                >
                  {card.isMatched && (
                    <span className="absolute top-1.5 right-1.5 p-0.5 bg-emerald-500 text-white rounded-full">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                    </span>
                  )}
                  {showContent ? (
                    <span className="animate-fadeIn leading-tight">{card.content}</span>
                  ) : (
                    <Sparkles className="w-6 h-6 text-teal-200/60 animate-pulse" />
                  )}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};