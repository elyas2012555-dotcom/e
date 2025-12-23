
import React from 'react';
import { AuctionState, AuctionStatus } from '../types';

interface AuctionCardProps {
  auction: AuctionState;
  formatTime: (s: number) => string;
}

const AuctionCard: React.FC<AuctionCardProps> = ({ auction, formatTime }) => {
  const top3 = [0, 1, 2].map(i => auction.bidders[i] || null);
  const isDaly = auction.status === AuctionStatus.DALY;
  const isLive = auction.status !== AuctionStatus.OFFLINE;

  const ranks = [
    { bg: 'bg-[#1a1608]', border: 'border-[#b8860b]/40', medal: 'https://cdn-icons-png.flaticon.com/512/2583/2583344.png' },
    { bg: 'bg-[#111111]', border: 'border-[#c0c0c0]/20', medal: 'https://cdn-icons-png.flaticon.com/512/2583/2583350.png' },
    { bg: 'bg-[#160d08]', border: 'border-[#cd7f32]/20', medal: 'https://cdn-icons-png.flaticon.com/512/2583/2583434.png' }
  ];

  return (
    <div className="relative w-full max-w-[420px] flex flex-col gap-4 font-sans rtl select-none mx-auto py-6 px-4">
      
      {/* شريط الحد الأدنى العلوي */}
      <div className={`flex items-center justify-center gap-3 py-4 rounded-2xl border-2 border-emerald-500/50 ${auction.minBid <= 1 ? 'bg-[#0a1a12]' : 'bg-[#0c0c0c]'} shadow-lg`}>
        <div className="bg-emerald-500 p-1 rounded-md">
           <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth="4" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"></path></svg>
        </div>
        <span className="text-[#00f2a4] font-black text-2xl tracking-[0.05em] uppercase">
          {auction.minBid <= 1 ? 'NO MINIMUM' : `MINIMUM: ${auction.minBid}`}
        </span>
      </div>

      {/* شريط وقت السنايب العلوي */}
      <div className="flex items-center justify-between px-8 py-4 bg-[#111111] rounded-2xl border-2 border-red-500/30 shadow-lg">
        <div className="flex items-center gap-4">
          <div className="w-6 h-6 flex items-center justify-center bg-white rounded-md">
             <span className="text-[10px]">🛡️</span>
          </div>
          <span className="text-white font-black text-2xl tracking-tight uppercase">SNIPE DELAY</span>
        </div>
        <div className="bg-[#ef4444] px-5 py-1 rounded-xl text-white font-black text-3xl">
          {auction.snipeDelay}S
        </div>
      </div>

      {/* صندوق المزاد الرئيسي */}
      <div className="bg-black border-[3px] border-[#b8860b]/40 rounded-[45px] p-8 shadow-[0_0_60px_rgba(0,0,0,1)] relative overflow-hidden">
        
        {/* التايمر وحالة الاتصال */}
        <div className="flex items-center justify-center gap-8 mb-8 mt-2">
          <div className={`font-black mono text-8xl tracking-tighter ${isDaly ? 'text-red-500 animate-pulse' : 'text-[#00f2a4]'} drop-shadow-[0_0_20px_rgba(0,242,164,0.4)]`}>
            {isDaly ? formatTime(auction.dalyTimeLeft) : formatTime(auction.timeLeft)}
          </div>
          
          <div className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl border ${!isLive ? 'bg-red-900/20 border-red-500/30 text-red-500' : 'bg-emerald-500/20 border-emerald-500/40 text-emerald-500'}`}>
            <div className={`w-3.5 h-3.5 rounded-full ${!isLive ? 'bg-red-500' : 'bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,1)]'}`}></div>
            <span className="font-black text-base uppercase tracking-widest">{!isLive ? 'OFFLINE' : 'LIVE'}</span>
          </div>
        </div>

        <div className="w-full h-[2px] bg-white/5 mb-8"></div>

        {/* قائمة المتصدرين الثلاثة */}
        <div className="space-y-4 mb-10">
          {top3.map((bidder, i) => (
            <div key={i} className={`flex items-center gap-5 p-5 rounded-[2rem] border transition-all duration-500 ${ranks[i].bg} ${ranks[i].border} ${bidder ? 'opacity-100 translate-x-0' : 'opacity-30'}`}>
              <div className="relative w-14 flex justify-center shrink-0">
                <img src={ranks[i].medal} className="w-12 h-12 object-contain" alt="rank" />
              </div>
              
              <div className="flex-1 flex items-center gap-5 overflow-hidden">
                <div className="w-14 h-14 rounded-full bg-[#3b2d7d] border-2 border-white/20 flex items-center justify-center overflow-hidden shrink-0">
                  {bidder ? (
                    <img src={bidder.avatar} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-white/40 font-black text-3xl">?</span>
                  )}
                </div>
                <span className={`font-black text-2xl truncate ${bidder ? 'text-white' : 'text-[#333]'}`}>
                  {bidder ? bidder.username : ''}
                </span>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <span className={`font-black text-4xl ${bidder ? 'text-yellow-500' : 'text-[#222]'}`}>
                  {bidder ? bidder.totalCoins : '0'}
                </span>
                <div className="w-6 h-6 bg-yellow-600 rounded-full flex items-center justify-center text-[12px]">🪙</div>
              </div>
            </div>
          ))}
        </div>

        {/* الفوتر - عدد الأشخاص */}
        <div className="bg-[#0c0c0c] border border-white/5 rounded-[1.5rem] py-4 flex items-center justify-center gap-4">
          <svg className="w-5 h-5 text-gray-700" fill="currentColor" viewBox="0 0 20 20"><path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z"></path></svg>
          <span className="text-gray-600 font-black text-sm uppercase tracking-widest">Total participants: {auction.totalParticipants}</span>
        </div>
      </div>
    </div>
  );
};

export default AuctionCard;
