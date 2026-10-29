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
    <div className="space-y-8 animate-fadeIn pb-16">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-violet-700 via-purple-700 to-indigo-800 rounded-3xl p-6 sm:p-8 text-white shadow-md">
        <div className="max-w-2xl">
          <span className="text-xs font-semibold uppercase tracking-wider text-purple-200">
            Mukofotlar & Rag'bat Tizimi
          </span>
          <h2 className="font-display font-bold text-2xl sm:text-3xl text-white mt-1 mb-2">
            Kunlik Missiyalar & Maktab Do'koni
          </h2>
          <p className="text-xs sm:text-sm text-purple-100/90 leading-relaxed">
            Haqiqiy faolligingiz evaziga Coin va XP yig'ing! Missiyalar tizim tomonidan tekshiriladi va faqat shart to'liq bajarilgandagina mukofot taqdim etiladi.
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 gap-6 text-sm font-semibold">
        <button
          onClick={() => { setActiveTab('quests'); setQuestMessage(null); }}
          className={`py-3 border-b-2 transition-colors flex items-center gap-2 cursor-pointer ${
            activeTab === 'quests'
              ? 'border-purple-600 text-purple-600 dark:text-purple-400'
              : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400'
          }`}
        >
          <Sparkles className="w-4 h-4 text-amber-500" />
          Kunlik Missiyalar ({quests.filter(q => q.completed).length}/{quests.length})
        </button>

        <button
          onClick={() => { setActiveTab('shop'); setShopMessage(null); }}
          className={`py-3 border-b-2 transition-colors flex items-center gap-2 cursor-pointer ${
            activeTab === 'shop'
              ? 'border-purple-600 text-purple-600 dark:text-purple-400'
              : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400'
          }`}
        >
          <ShoppingBag className="w-4 h-4 text-purple-600" />
          Maktab Do'koni
        </button>
      </div>

      {/* Tab 1: Quests */}
      {activeTab === 'quests' && (
        <div className="space-y-4">
          {questMessage && (
            <div className={`p-4 rounded-xl text-xs font-semibold flex items-start gap-2.5 ${
              questMessage.isError 
                ? 'bg-rose-50 text-rose-700 dark:bg-rose-950/50 dark:text-rose-300 border border-rose-200 dark:border-rose-900' 
                : 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-900'
            }`}>
              {questMessage.isError ? (
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              ) : (
                <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
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
                  className={`p-5 rounded-2xl border transition-all flex items-start justify-between gap-4 ${
                    quest.completed
                      ? 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-900/40'
                      : isEligible
                      ? 'bg-purple-50/30 dark:bg-purple-950/20 border-purple-300 dark:border-purple-800 shadow-sm ring-1 ring-purple-400/30'
                      : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-xs'
                  }`}
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-semibold text-sm text-slate-900 dark:text-white">
                        {quest.title}
                      </h4>
                      {quest.completed ? (
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-100 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-300">
                          Bajarildi
                        </span>
                      ) : isEligible ? (
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 animate-pulse">
                          Tayyor
                        </span>
                      ) : (
                        <span className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500">
                          Jarayonda
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-slate-600 dark:text-slate-400 mb-3 leading-relaxed">
                      {quest.description}
                    </p>

                    <div className="flex items-center gap-3 text-xs font-mono font-semibold">
                      <span className="text-amber-600 dark:text-amber-400 flex items-center gap-1">
                        <Coins className="w-3.5 h-3.5" /> +{quest.rewardCoins} Coin
                      </span>
                      <span className="text-blue-600 dark:text-blue-400 flex items-center gap-1">
                        <Award className="w-3.5 h-3.5" /> +{quest.rewardXp} XP
                      </span>
                    </div>
                  </div>

                  <div className="shrink-0">
                    {quest.completed ? (
                      <div className="w-9 h-9 rounded-xl bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 flex items-center justify-center">
                        <Check className="w-5 h-5" />
                      </div>
                    ) : (
                      <button
                        onClick={() => handleClaimQuest(quest)}
                        className={`px-3.5 py-2 font-semibold text-xs rounded-xl shadow-xs transition-all cursor-pointer ${
                          isEligible
                            ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-500/20'
                            : 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
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
            <div className={`p-3.5 rounded-xl text-xs font-semibold flex items-center gap-2 ${
              shopMessage.isError 
                ? 'bg-red-50 text-red-600 dark:bg-red-950/40 border border-red-200' 
                : 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 border border-emerald-200'
            }`}>
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{shopMessage.text}</span>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {shopItems.map((item) => {
              const isOwned = currentUser?.inventory?.includes(item.id);

              return (
                <div
                  key={item.id}
                  className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm flex flex-col justify-between"
                >
                  <div>
                    <div className="w-12 h-12 rounded-2xl bg-purple-100 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center text-xl mb-4">
                      {item.iconName === 'Crown' ? <Crown className="w-6 h-6" /> : <Award className="w-6 h-6" />}
                    </div>

                    <h4 className="font-display font-bold text-base text-slate-900 dark:text-white mb-1.5">
                      {item.title}
                    </h4>
                    <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
                      {item.description}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-1 font-mono font-bold text-sm text-amber-600 dark:text-amber-400">
                      <Coins className="w-4 h-4" />
                      <span>{item.price} Coin</span>
                    </div>

                    {isOwned ? (
                      <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                        <Check className="w-4 h-4" />
                        Olingan
                      </span>
                    ) : (
                      <button
                        onClick={() => handleBuyItem(item)}
                        disabled={!currentUser || currentUser.coins < item.price}
                        className="px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-slate-200 dark:disabled:bg-slate-800 disabled:text-slate-400 text-white font-semibold text-xs rounded-xl transition-colors cursor-pointer disabled:cursor-not-allowed"
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
