import React, { useState } from 'react';
import { User, DailyQuest, ShopItem, HomeworkItem } from '../types';
import { StorageService, INITIAL_SHOP_ITEMS } from '../services/storage';
import { 
  Sparkles, 
  ShoppingBag, 
  CheckCircle2, 
  Coins, 
  Award, 
  Crown, 
  Check, 
  AlertCircle,
  Lock,
  ArrowRight
} from 'lucide-react';

interface QuestsAndShopProps {
  currentUser: User | null;
  onUserUpdated: (user: User) => void;
  onNavigateToTab?: (tab: string) => void;
}

export const QuestsAndShop: React.FC<QuestsAndShopProps> = ({ 
  currentUser, 
  onUserUpdated,
  onNavigateToTab 
}) => {
  const [activeTab, setActiveTab] = useState<'quests' | 'shop'>('quests');
  const [quests, setQuests] = useState<DailyQuest[]>(StorageService.getQuests());
  const [shopItems] = useState<ShopItem[]>(INITIAL_SHOP_ITEMS);
  const [homeworkList] = useState<HomeworkItem[]>(StorageService.getHomework());

  const [questMessage, setQuestMessage] = useState<{ text: string; isError: boolean } | null>(null);
  const [shopMessage, setShopMessage] = useState<{ text: string; isError: boolean } | null>(null);

  const handleClaimQuest = (quest: DailyQuest) => {
    if (!currentUser) return;
    setQuestMessage(null);

    const res = StorageService.claimQuest(quest.id, currentUser, homeworkList);
    setQuestMessage({ text: res.message, isError: !res.success });

    if (res.success) {
      setQuests(StorageService.getQuests());
      const fresh = StorageService.getCurrentUser();
      if (fresh) onUserUpdated(fresh);
    }
  };

  const handleBuyItem = (item: ShopItem) => {
    if (!currentUser) return;
    const res = StorageService.buyShopItem(currentUser.id, item);
    setShopMessage({ text: res.message, isError: !res.success });
    if (res.success) {
      const fresh = StorageService.getCurrentUser();
      if (fresh) onUserUpdated(fresh);
    }
    setTimeout(() => setShopMessage(null), 3500);
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-fadeIn pb-20 px-2 sm:px-4 select-none">
      
      {/* 3D Top Banner */}
      <div className="relative overflow-hidden rounded-[2.5rem] p-6 sm:p-8 bg-gradient-to-b from-violet-600 via-purple-700 to-indigo-900 text-white border-4 border-purple-400/30 shadow-[0_12px_35px_rgba(109,40,217,0.4)]">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-48 h-48 sm:w-64 sm:h-64 bg-purple-300/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-400/20 via-transparent to-black/30 pointer-events-none" />

        <div className="relative z-10 max-w-2xl space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/30 backdrop-blur-md border border-purple-300/40 text-[11px] font-black tracking-wider uppercase text-purple-200 shadow-inner">
            <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
            Mukofotlar & Rag'bat Tizimi
          </div>
          <h2 className="font-display font-black text-2xl sm:text-4xl text-white drop-shadow-[0_4px_8px_rgba(0,0,0,0.5)] tracking-tight">
            Kunlik Missiyalar & Maktab Do'koni
          </h2>
          <p className="text-xs sm:text-sm text-purple-100/90 font-medium leading-relaxed">
            Haqiqiy faolligingiz evaziga Coin va XP yig'ing! Missiyalar tizim tomonidan tekshiriladi va faqat shart to'liq bajarilgandagina mukofot taqdim etiladi.
          </p>
        </div>
      </div>

      {/* 3D Navigation Tabs */}
      <div className="flex bg-slate-900/90 p-1.5 rounded-2xl border-2 border-slate-800 shadow-[inset_0_2px_8px_rgba(0,0,0,0.6)] gap-2">
        <button
          onClick={() => { setActiveTab('quests'); setQuestMessage(null); }}
          className={`flex-1 py-3 px-4 rounded-xl font-black text-xs sm:text-sm transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer active:translate-y-0.5 ${
            activeTab === 'quests'
              ? 'bg-gradient-to-b from-purple-500 to-indigo-700 text-white border-b-4 border-indigo-900 shadow-[0_4px_0_#312e81]'
              : 'text-slate-400 hover:text-white bg-transparent border-b-4 border-transparent'
          }`}
        >
          <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
          <span>Kunlik Missiyalar</span>
          <span className="px-2 py-0.5 rounded-lg bg-black/40 text-[10px] text-amber-300 border border-amber-400/20">
            {quests.filter(q => q.completed).length}/{quests.length}
          </span>
        </button>

        <button
          onClick={() => { setActiveTab('shop'); setShopMessage(null); }}
          className={`flex-1 py-3 px-4 rounded-xl font-black text-xs sm:text-sm transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer active:translate-y-0.5 ${
            activeTab === 'shop'
              ? 'bg-gradient-to-b from-purple-500 to-indigo-700 text-white border-b-4 border-indigo-900 shadow-[0_4px_0_#312e81]'
              : 'text-slate-400 hover:text-white bg-transparent border-b-4 border-transparent'
          }`}
        >
          <ShoppingBag className="w-4 h-4 text-purple-300 shrink-0" />
          <span>Maktab Do'koni</span>
        </button>
      </div>

      {/* Tab 1: Quests */}
      {activeTab === 'quests' && (
        <div className="space-y-4">
          {questMessage && (
            <div className={`p-4 rounded-2xl text-xs sm:text-sm font-bold flex items-start gap-3 border-2 shadow-lg animate-scaleUp ${
              questMessage.isError 
                ? 'bg-rose-950/80 text-rose-200 border-rose-600 shadow-[0_4px_15px_rgba(225,29,72,0.3)]' 
                : 'bg-emerald-950/80 text-emerald-200 border-emerald-500 shadow-[0_4px_15px_rgba(16,185,129,0.3)]'
            }`}>
              {questMessage.isError ? (
                <AlertCircle className="w-5 h-5 shrink-0 text-rose-400 mt-0.5" />
              ) : (
                <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-400 mt-0.5" />
              )}
              <span className="leading-relaxed">{questMessage.text}</span>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {quests.map((quest) => {
              const check = currentUser ? StorageService.canClaimQuest(quest, currentUser, homeworkList) : { canClaim: false };
              const isEligible = check.canClaim;

              return (
                <div
                  key={quest.id}
                  className={`p-5 sm:p-6 rounded-[2rem] border-4 transition-all duration-200 flex items-start justify-between gap-4 relative overflow-hidden ${
                    quest.completed
                      ? 'bg-slate-900/90 border-emerald-500/40 shadow-[0_8px_20px_rgba(16,185,129,0.15)] opacity-85'
                      : isEligible
                      ? 'bg-gradient-to-b from-slate-900 via-purple-950/40 to-slate-900 border-purple-500 shadow-[0_10px_25px_rgba(168,85,247,0.3)] scale-[1.01]'
                      : 'bg-slate-900/90 border-slate-800 shadow-[0_8px_20px_rgba(0,0,0,0.4)]'
                  }`}
                >
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="font-display font-black text-sm sm:text-base text-white tracking-tight">
                        {quest.title}
                      </h4>
                      {quest.completed ? (
                        <span className="text-[10px] font-black px-2 py-0.5 rounded-lg bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 uppercase tracking-wider">
                          Bajarildi
                        </span>
                      ) : isEligible ? (
                        <span className="text-[10px] font-black px-2 py-0.5 rounded-lg bg-purple-500/30 border border-purple-400/50 text-purple-300 animate-pulse uppercase tracking-wider">
                          Tayyor
                        </span>
                      ) : (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-lg bg-slate-800 text-slate-400 border border-slate-700 uppercase tracking-wider">
                          Jarayonda
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-slate-300 font-medium leading-relaxed">
                      {quest.description}
                    </p>

                    <div className="flex items-center gap-3 text-xs font-mono font-black pt-1">
                      <span className="text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-xl border border-amber-500/30 flex items-center gap-1 shadow-xs">
                        <Coins className="w-3.5 h-3.5" /> +{quest.rewardCoins} Coin
                      </span>
                      <span className="text-blue-400 bg-blue-500/10 px-2.5 py-1 rounded-xl border border-blue-500/30 flex items-center gap-1 shadow-xs">
                        <Award className="w-3.5 h-3.5" /> +{quest.rewardXp} XP
                      </span>
                    </div>
                  </div>

                  <div className="shrink-0 pt-1">
                    {quest.completed ? (
                      <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-400 to-emerald-600 text-slate-950 flex items-center justify-center border-2 border-emerald-300 shadow-[0_4px_12px_rgba(16,185,129,0.4)]">
                        <Check className="w-6 h-6 stroke-[3]" />
                      </div>
                    ) : (
                      <button
                        onClick={() => handleClaimQuest(quest)}
                        className={`px-4 py-2.5 font-black text-xs rounded-2xl transition-all duration-150 cursor-pointer active:translate-y-1 ${
                          isEligible
                            ? 'bg-gradient-to-b from-emerald-400 to-emerald-600 border-b-4 border-emerald-800 text-slate-950 shadow-[0_4px_0_#065f46] hover:brightness-110'
                            : 'bg-slate-800 border-b-4 border-slate-950 text-slate-300 hover:text-white shadow-[0_4px_0_#020617]'
                        }`}
                      >
                        {isEligible ? 'Mukofotni olish' : 'Tekshirish'}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tab 2: Shop */}
      {activeTab === 'shop' && (
        <div className="space-y-6">
          {shopMessage && (
            <div className={`p-4 rounded-2xl text-xs sm:text-sm font-bold flex items-center gap-3 border-2 shadow-lg animate-scaleUp ${
              shopMessage.isError 
                ? 'bg-rose-950/80 text-rose-200 border-rose-600 shadow-[0_4px_15px_rgba(225,29,72,0.3)]' 
                : 'bg-emerald-950/80 text-emerald-200 border-emerald-500 shadow-[0_4px_15px_rgba(16,185,129,0.3)]'
            }`}>
              <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-400" />
              <span>{shopMessage.text}</span>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {shopItems.map((item) => {
              const isOwned = currentUser?.inventory?.includes(item.id);

              return (
                <div
                  key={item.id}
                  className="bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 rounded-[2.5rem] border-4 border-slate-800 p-6 shadow-[0_15px_30px_rgba(0,0,0,0.5)] flex flex-col justify-between relative overflow-hidden group hover:border-purple-500/50 transition-all duration-300"
                >
                  <div>
                    {/* 3D Icon Box */}
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-600 text-white flex items-center justify-center text-xl mb-4 border-2 border-purple-300/40 shadow-[0_6px_15px_rgba(147,51,234,0.4)] group-hover:scale-105 transition-transform duration-300">
                      {item.iconName === 'Crown' ? <Crown className="w-7 h-7 text-yellow-300" /> : <Award className="w-7 h-7 text-purple-200" />}
                    </div>

                    <h4 className="font-display font-black text-lg text-white mb-1.5 tracking-tight">
                      {item.title}
                    </h4>
                    <p className="text-xs text-slate-400 font-medium leading-relaxed mb-6">
                      {item.description}
                    </p>
                  </div>

                  <div className="pt-4 border-t-2 border-slate-800/80 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-1.5 font-mono font-black text-sm text-amber-400 bg-amber-500/10 px-3 py-1.5 rounded-xl border border-amber-500/30">
                      <Coins className="w-4 h-4 text-amber-400" />
                      <span>{item.price} Coin</span>
                    </div>

                    {isOwned ? (
                      <span className="text-xs font-black text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-3 py-2 rounded-xl flex items-center gap-1">
                        <Check className="w-4 h-4 stroke-[3]" />
                        Olingan
                      </span>
                    ) : (
                      <button
                        onClick={() => handleBuyItem(item)}
                        disabled={!currentUser || currentUser.coins < item.price}
                        className="px-4 py-2.5 bg-gradient-to-b from-purple-500 to-indigo-700 active:translate-y-0.5 border-b-4 border-indigo-900 disabled:from-slate-800 disabled:to-slate-800 disabled:border-slate-950 disabled:text-slate-500 text-white font-black text-xs rounded-xl shadow-[0_4px_0_#312e81] disabled:shadow-none transition-all cursor-pointer disabled:cursor-not-allowed hover:brightness-110"
                      >
                        Xarid qilish
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};