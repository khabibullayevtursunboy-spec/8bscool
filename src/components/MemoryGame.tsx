import React, { useState, useEffect } from 'react';
import { User } from '../types';
import { StorageService } from '../services/storage';
import { Brain, Trophy, RotateCcw, Sparkles, CheckCircle2 } from 'lucide-react';

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
        }, 900);
      }
    }
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-fadeIn max-w-4xl mx-auto">
      {/* Banner */}
      <div className="relative overflow-hidden rounded-3xl p-6 sm:p-8 bg-gradient-to-r from-teal-600 via-emerald-600 to-cyan-700 text-white border border-white/20 shadow-2xl">
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-56 h-56 bg-emerald-300/20 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="space-y-2 text-center sm:text-left">
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-xs font-bold text-teal-100">
              <Brain className="w-3.5 h-3.5 text-emerald-300" />
              <span>Mantiq va Xotira</span>
            </div>
            <h2 className="font-display font-black text-2xl sm:text-3xl text-white tracking-tight">
              Xotira O'yini (Memory Game)
            </h2>
            <p className="text-xs sm:text-sm text-teal-100/90 font-medium">
              Fan formulalari va ularning ta'riflarini o'zaro mos juftlikda toping!
            </p>
          </div>

          <div className="flex items-center gap-4 bg-black/20 backdrop-blur-md px-4 py-3 rounded-2xl border border-white/10 text-xs font-mono font-bold">
            <div>Urinishlar: <span className="text-emerald-300">{moves}</span></div>
            <button
              onClick={initializeGame}
              className="p-2 bg-white/20 hover:bg-white/30 rounded-xl transition-all cursor-pointer"
              title="Qaytadan boshlash"
            >
              <RotateCcw className="w-4 h-4 text-white" />
            </button>
          </div>
        </div>
      </div>

      {/* Grid Kartochkalar */}
      <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl">
        {isWon ? (
          <div className="py-12 text-center space-y-4 animate-fadeIn">
            <div className="w-16 h-16 bg-emerald-500/10 text-emerald-500 rounded-2xl flex items-center justify-center mx-auto shadow-inner">
              <Trophy className="w-10 h-10 animate-bounce" />
            </div>
            <h3 className="font-display font-black text-2xl text-slate-900 dark:text-white">
              Tabriklaymiz! Barcha juftliklarni topdingiz! 🎉
            </h3>
            <p className="text-xs text-slate-500 font-medium">
              Siz <span className="text-emerald-500 font-bold">{moves} ta</span> urinishda yakunladingiz va <span className="text-amber-500 font-bold">+40 Coin, +50 XP</span> mukofotini oldingiz!
            </p>
            <button
              onClick={initializeGame}
              className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-bold text-xs rounded-xl shadow-md hover:from-emerald-600 hover:to-teal-600 transition-all cursor-pointer inline-flex items-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              Yana o'ynash
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3.5">
            {cards.map(card => {
              const showContent = card.isFlipped || card.isMatched;

              return (
                <button
                  key={card.id}
                  onClick={() => handleCardClick(card.id)}
                  className={`h-28 rounded-2xl font-bold text-xs sm:text-sm transition-all duration-300 flex items-center justify-center p-3 text-center cursor-pointer shadow-sm ${
                    card.isMatched
                      ? 'bg-emerald-500/20 border-2 border-emerald-500 text-emerald-700 dark:text-emerald-300 opacity-75 pointer-events-none'
                      : showContent
                      ? 'bg-white dark:bg-slate-800 border-2 border-teal-500 text-slate-900 dark:text-white shadow-md scale-105'
                      : 'bg-gradient-to-br from-teal-600 to-cyan-700 hover:from-teal-500 hover:to-cyan-600 text-white border border-teal-400/30'
                  }`}
                >
                  {showContent ? card.content : <Sparkles className="w-6 h-6 text-teal-200/60 animate-pulse" />}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};