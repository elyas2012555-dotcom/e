
import React from 'react';

interface StatsHeaderProps {
  earnings: { coins: number; usd: number };
  connectedUser?: string;
}

const StatsHeader: React.FC<StatsHeaderProps> = ({ earnings, connectedUser }) => {
  return (
    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 rtl">
      <div className="flex flex-col">
        <h1 className="text-2xl font-black italic tracking-tighter">
          مراقبة <span className="text-cyan-400">بث تيك توك المباشر</span>
        </h1>
        {connectedUser && (
          <div className="flex items-center gap-2 mt-1">
            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
            <span className="text-gray-400 text-sm font-bold">متصل حالياً بـ: </span>
            <span className="text-white text-sm font-black">@{connectedUser}</span>
          </div>
        )}
      </div>
      
      <div className="flex items-center gap-4">
        <div className="bg-[#1a0f0f] border border-[#ff4d4d]/30 rounded-2xl p-4 flex items-center gap-4 shadow-inner">
          <div className="w-10 h-10 bg-yellow-500/20 rounded-xl flex items-center justify-center text-xl">
            💰
          </div>
          <div className="text-right">
            <div className="text-xs text-gray-400 uppercase font-bold">إجمالي الأرباح</div>
            <div className="flex items-center gap-2 justify-end">
              <span className="font-black text-xl text-yellow-500">{earnings.coins} 🪙</span>
              <span className="text-emerald-400 font-bold text-sm">${earnings.usd.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatsHeader;
