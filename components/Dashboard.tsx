
import React, { useState } from 'react';
import { AuctionState, AuctionStatus, ConnectionStatus, Bidder } from '../types';
import AuctionCard from './AuctionCard';

interface DashboardProps {
  auction: AuctionState;
  setAuction: React.Dispatch<React.SetStateAction<AuctionState>>;
  updateSettings: (settings: Partial<AuctionState>) => void;
  earnings: { coins: number; usd: number };
  // Fix: Added setEarnings to DashboardProps to allow resetting earnings
  setEarnings: React.Dispatch<React.SetStateAction<{ coins: number; usd: number }>>;
  connectToTikTok: (username: string) => void;
  adjustTime: (s: number) => void;
  accessRequests: any[];
  onApprove: (id: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ 
  auction, 
  updateSettings, 
  earnings, 
  // Fix: Destructured setEarnings from props
  setEarnings,
  connectToTikTok, 
  adjustTime,
  setAuction
}) => {
  const [tiktokUser, setTiktokUser] = useState('');
  const [copied, setCopied] = useState(false);

  // توليد رابط OBS دقيق
  const obsLink = `${window.location.protocol}//${window.location.host}${window.location.pathname}?mode=overlay`;

  const copyObsLink = () => {
    navigator.clipboard.writeText(obsLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const adjustBidderCoins = (username: string, amount: number) => {
    setAuction(prev => {
      const newBidders = prev.bidders.map(b => {
        if (b.username === username) {
          return { ...b, totalCoins: Math.max(0, b.totalCoins + amount) };
        }
        return b;
      });
      newBidders.sort((a, b) => b.totalCoins - a.totalCoins);
      return { ...prev, bidders: newBidders };
    });
  };

  const downloadFile = (filename: string, content: string) => {
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const downloadFullPackage = () => {
    // 1. Bridge.js
    const bridgeCode = `const { WebcastPushConnection } = require('tiktok-live-connector');
const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 8081 });
let tiktokConn = null;

wss.on('connection', (ws) => {
    console.log('✅ Connected to Web Interface');
    ws.on('message', (message) => {
        const data = JSON.parse(message);
        if (data.type === 'SET_USERNAME') {
            const username = data.username;
            console.log('🔗 Attaching to TikTok User:', username);
            if (tiktokConn) tiktokConn.disconnect();
            tiktokConn = new WebcastPushConnection(username);
            tiktokConn.connect().then(() => console.log('🚀 SUCCESS: Connected to Live!')).catch(e => console.error('❌ ERROR:', e));
            tiktokConn.on('gift', (data) => ws.send(JSON.stringify({ type: 'GIFT', data })));
        }
    });
});
console.log('📡 SERVER STARTED: Open the dashboard and click CONNECT');`;

    // 2. package.json
    const packageJson = JSON.stringify({
      name: "tiktok-auction-pro",
      version: "1.0.0",
      main: "bridge.js",
      dependencies: { "tiktok-live-connector": "^1.4.1", "ws": "^8.13.0" },
      scripts: { "start": "node bridge.js" }
    }, null, 2);

    // 3. Run_Auction.bat
    const batFile = `@echo off\ncolor 0b\ntitle TikTok Auction Runner\necho Installing system dependencies...\nif not exist node_modules ( npm install )\necho Launching Bridge...\nnpm start\npause`;

    // 4. Instructions.txt
    const instructions = `كيفية تشغيل المزاد:\n1. قم بتثبيت Node.js من الموقع الرسمي (nodejs.org).\n2. فك ضغط هذه الملفات في مجلد واحد.\n3. اضغط مرتين على Run_Auction.bat.\n4. افتح هذا الرابط في متصفحك: ${window.location.href}\n5. ضع يوزر تيك توك الخاص بك واضغط Connect.`;

    // 5. OBS_LINK.txt
    const obsTxt = `رابط الـ OBS الخاص بمزادك:\n${obsLink}\n\nضعه في متصفح OBS (Browser Source) واجعل العرض 450 والارتفاع 800.`;

    // تنزيل الملفات
    downloadFile('bridge.js', bridgeCode);
    downloadFile('package.json', packageJson);
    downloadFile('Run_Auction.bat', batFile);
    downloadFile('تعليمات_التشغيل.txt', instructions);
    downloadFile('رابط_الـ_OBS.txt', obsTxt);
  };

  return (
    <div className="max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 rtl text-right">
      
      {/* المعاينة والتحميلات */}
      <div className="lg:col-span-5 order-2 lg:order-1">
        <div className="sticky top-8 space-y-6">
           <div className="bg-[#000] p-4 rounded-[3rem] border-2 border-white/5 shadow-2xl overflow-hidden">
              <div className="text-center mb-4 pt-2">
                <h2 className="text-gray-500 font-black text-[10px] uppercase tracking-widest">مباشر الآن (المعاينة)</h2>
              </div>
              <AuctionCard auction={auction} formatTime={(s) => {
                const m = Math.floor(s / 60);
                const sc = s % 60;
                return `${m}:${sc.toString().padStart(2, '0')}`;
              }} />
           </div>

           {/* قسم رابط الـ OBS */}
           <div className="bg-white/5 p-6 rounded-[2rem] border border-white/10">
              <h3 className="text-white font-black text-sm mb-4">🔗 رابط البث (OBS)</h3>
              <div className="flex gap-2 mb-3">
                <input 
                  type="text" 
                  readOnly 
                  value={obsLink}
                  className="flex-1 bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-[10px] text-cyan-400 font-mono"
                />
                <button 
                  onClick={copyObsLink}
                  className={`px-4 py-3 rounded-xl text-[10px] font-black transition-all ${copied ? 'bg-emerald-500 text-black' : 'bg-white/10 text-white hover:bg-white/20'}`}
                >
                  {copied ? '✅ تم النسخ' : 'نسخ'}
                </button>
              </div>
              <p className="text-[9px] text-gray-500">انسخ هذا الرابط وضعه في OBS كـ "Browser Source" لمشاهدة المزاد على البث.</p>
           </div>

           {/* مركز التحميل */}
           <div className="bg-gradient-to-br from-indigo-900/40 to-black p-8 rounded-[2.5rem] border border-indigo-500/20 shadow-xl">
             <div className="flex items-center gap-4 mb-6">
                <div className="bg-indigo-500 w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shadow-lg shadow-indigo-500/40">📦</div>
                <div>
                   <h3 className="text-white font-black text-lg">تحميل المزاد الكامل</h3>
                   <p className="text-indigo-300 text-[10px] font-bold">كل الملفات اللازمة للتشغيل أوفلاين</p>
                </div>
             </div>
             <button 
               onClick={downloadFullPackage}
               className="w-full bg-white text-black hover:bg-gray-200 font-black py-5 rounded-2xl transition-all flex items-center justify-center gap-3 text-lg"
             >
               📥 تحميل حزمة التشغيل (.zip)
             </button>
             <p className="text-[9px] text-gray-500 mt-4 text-center">
               ستحصل على ملفات: Bridge, Runner, Package, Instructions
             </p>
           </div>
        </div>
      </div>

      {/* لوحة التحكم */}
      <div className="lg:col-span-7 space-y-6 order-1 lg:order-2">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-4xl font-black text-white italic tracking-tighter">
            AUCTION <span className="text-cyan-400">PRO</span>
          </h1>
          <div className="bg-[#1a0f30] border border-blue-500/20 rounded-2xl px-5 py-3 flex items-center gap-4 shadow-xl">
             <div className="bg-yellow-500 w-6 h-6 rounded-lg flex items-center justify-center text-xs shadow-lg">🪙</div>
             <div className="flex flex-col text-left">
                <span className="text-gray-500 text-[10px] font-bold uppercase">إجمالي المزايدات</span>
                <span className="text-[#00f2a4] font-black text-xl leading-none">{earnings.coins}</span>
             </div>
          </div>
        </div>

        {/* إحصائيات سريعة */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
           <div className="bg-[#12122b] rounded-[2rem] p-6 border border-white/5">
              <h3 className="text-blue-400 text-[10px] font-black uppercase mb-4 text-center">وقت المزاد</h3>
              <div className="flex items-center justify-center gap-2 text-4xl font-black">
                <div className="bg-black/40 px-4 py-2 rounded-xl border border-white/5">{Math.floor(auction.timeLeft / 60)}</div>
                <span className="text-gray-600">:</span>
                <div className="bg-black/40 px-4 py-2 rounded-xl border border-white/5">{(auction.timeLeft % 60).toString().padStart(2, '0')}</div>
              </div>
              <div className="flex gap-2 mt-4">
                 <button onClick={() => adjustTime(60)} className="flex-1 bg-white/5 py-3 rounded-xl text-[10px] font-black hover:bg-white/10">+1D</button>
                 <button onClick={() => adjustTime(-60)} className="flex-1 bg-white/5 py-3 rounded-xl text-[10px] font-black hover:bg-white/10">-1D</button>
              </div>
           </div>

           <div className="bg-[#2b1212] rounded-[2rem] p-6 border border-red-500/10 text-center">
              <h3 className="text-red-400 text-[10px] font-black uppercase mb-4">تأخير السنايب</h3>
              <div className="text-5xl font-black text-white py-2">{auction.snipeDelay}s</div>
              <div className="flex gap-2 mt-4">
                 <button onClick={() => updateSettings({ snipeDelay: auction.snipeDelay + 5 })} className="flex-1 bg-red-500/10 py-3 rounded-xl text-[10px] font-black hover:bg-red-500/20">+5ث</button>
                 <button onClick={() => updateSettings({ snipeDelay: Math.max(0, auction.snipeDelay - 5) })} className="flex-1 bg-red-500/10 py-3 rounded-xl text-[10px] font-black hover:bg-red-500/20">-5ث</button>
              </div>
           </div>

           <div className="bg-[#122b1c] rounded-[2rem] p-6 border border-emerald-500/10 text-center">
              <h3 className="text-emerald-400 text-[10px] font-black uppercase mb-4">الحد الأدنى</h3>
              <div className="relative mt-2">
                 <input 
                  type="number" 
                  value={auction.minBid}
                  onChange={(e) => updateSettings({ minBid: Math.max(1, parseInt(e.target.value) || 1) })}
                  className="w-full bg-black/40 text-center text-4xl font-black text-yellow-500 py-3 rounded-xl border border-emerald-500/20 outline-none"
                />
              </div>
              <div className="flex gap-2 mt-3">
                 <button onClick={() => updateSettings({ minBid: auction.minBid + 5 })} className="flex-1 bg-emerald-500/10 py-3 rounded-xl text-[10px] font-black hover:bg-emerald-500/20">+5</button>
                 <button onClick={() => updateSettings({ minBid: Math.max(1, auction.minBid - 5) })} className="flex-1 bg-emerald-500/10 py-3 rounded-xl text-[10px] font-black hover:bg-emerald-500/20">-5</button>
              </div>
           </div>
        </div>

        {/* الاتصال والتحكم */}
        <div className="space-y-4">
          <div className="relative">
            <input 
              type="text" 
              placeholder="يوزر تيك توك بدون @" 
              value={tiktokUser} 
              onChange={(e) => setTiktokUser(e.target.value)} 
              className="w-full bg-black/60 border-2 border-white/5 rounded-[1.5rem] px-8 py-7 text-right font-black focus:border-cyan-500 outline-none text-2xl" 
            />
            {auction.connectionStatus === ConnectionStatus.CONNECTING && (
              <div className="absolute left-8 top-1/2 -translate-y-1/2">
                <div className="w-8 h-8 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
              </div>
            )}
            {auction.connectionStatus === ConnectionStatus.CONNECTED && (
              <div className="absolute left-8 top-1/2 -translate-y-1/2 flex items-center gap-3 bg-emerald-500/20 px-4 py-2 rounded-full border border-emerald-500/30">
                <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Active</span>
                <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(16,185,129,1)]"></div>
              </div>
            )}
          </div>
          
          <button 
            onClick={() => connectToTikTok(tiktokUser)} 
            className={`w-full py-7 rounded-[1.5rem] font-black flex items-center justify-center gap-4 transition-all text-2xl bg-gradient-to-r from-cyan-400 to-blue-600 text-black shadow-lg shadow-cyan-500/20 active:scale-95`}
          >
            {auction.connectionStatus === ConnectionStatus.CONNECTED ? '🔄 تحديث الاتصال بالبث' : '🎵 ربط حساب تيك توك'}
          </button>

          <div className="grid grid-cols-2 gap-4">
            <button 
              onClick={() => updateSettings({ status: AuctionStatus.RUNNING })}
              className="bg-[#22c55e] hover:bg-[#16a34a] py-10 rounded-[2rem] flex flex-col items-center justify-center gap-2 text-white font-black text-2xl shadow-lg shadow-emerald-500/10"
            >
              <span className="text-3xl">▶️</span> تشغيل المزاد
            </button>
            <button 
              onClick={() => updateSettings({ status: AuctionStatus.PAUSED })}
              className="bg-[#92400e] hover:bg-[#78350f] py-10 rounded-[2rem] flex flex-col items-center justify-center gap-2 text-white font-black text-2xl shadow-lg shadow-yellow-500/10"
            >
              <span className="text-3xl">⏸️</span> إيقاف مؤقت
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <button 
              onClick={() => updateSettings({ status: AuctionStatus.FINISHED })}
              className="bg-[#991b1b] py-6 rounded-2xl text-white font-black text-xl hover:bg-red-800 transition-colors"
            >
              🏁 إنهاء وإعلان الفائز
            </button>
            <button 
              onClick={() => {
                if(confirm('هل أنت متأكد من تصفير المزاد؟')) {
                  setAuction(prev => ({...prev, status: AuctionStatus.OFFLINE, bidders: [], timeLeft: 120, totalParticipants: 0, connectionStatus: ConnectionStatus.DISCONNECTED}));
                  setEarnings({ coins: 0, usd: 0 });
                }
              }}
              className="bg-gray-800 py-6 rounded-2xl text-white font-black text-xl hover:bg-gray-700 transition-colors"
            >
              🔄 ريستارت كامل
            </button>
          </div>
        </div>

        {/* إدارة المزايدين (Manual) */}
        <div className="bg-black/40 border border-white/5 rounded-[2.5rem] p-8 mt-12">
          <div className="flex justify-between items-center mb-8">
             <h2 className="text-2xl font-black text-white flex items-center gap-3">
                <span className="text-3xl">👥</span> قائمة المزايدين
             </h2>
             <span className="bg-white/5 px-4 py-1.5 rounded-full text-xs font-bold text-gray-500">
               {auction.bidders.length} مشارك
             </span>
          </div>
          
          <div className="space-y-4">
            {auction.bidders.length === 0 ? (
              <div className="text-center py-16 text-gray-700 font-black border-2 border-dashed border-white/5 rounded-[2rem]">
                لا توجد مزايدات حتى الآن..
              </div>
            ) : (
              auction.bidders.map((bidder, idx) => (
                <div key={bidder.username} className="bg-white/5 border border-white/5 rounded-2xl p-5 flex items-center justify-between gap-6 hover:bg-white/[0.07] transition-all">
                  <div className="flex items-center gap-5">
                    <div className="relative">
                       <img src={bidder.avatar} alt={bidder.username} className="w-14 h-14 rounded-full border-2 border-white/10" />
                       <div className="absolute -top-2 -right-2 bg-yellow-500 text-black w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black border-2 border-black">
                         {idx + 1}
                       </div>
                    </div>
                    <div>
                      <div className="font-black text-white text-lg">{bidder.username}</div>
                      <div className="text-yellow-500 font-black flex items-center gap-1">
                        <span>{bidder.totalCoins}</span>
                        <span className="text-[10px]">🪙</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row items-center gap-2">
                    <div className="flex bg-black/40 p-1 rounded-xl">
                      <button 
                        onClick={() => adjustBidderCoins(bidder.username, 50)}
                        className="px-4 py-2 hover:bg-emerald-500/20 text-emerald-500 text-[11px] font-black rounded-lg transition-all"
                      >+50</button>
                      <button 
                        onClick={() => adjustBidderCoins(bidder.username, 10)}
                        className="px-4 py-2 hover:bg-emerald-500/20 text-emerald-500 text-[11px] font-black rounded-lg transition-all"
                      >+10</button>
                    </div>
                    
                    <div className="flex bg-black/40 p-1 rounded-xl">
                      <button 
                        onClick={() => adjustBidderCoins(bidder.username, -10)}
                        className="px-4 py-2 hover:bg-red-500/20 text-red-500 text-[11px] font-black rounded-lg transition-all"
                      >-10</button>
                      <button 
                        onClick={() => adjustBidderCoins(bidder.username, -50)}
                        className="px-4 py-2 hover:bg-red-500/20 text-red-500 text-[11px] font-black rounded-lg transition-all"
                      >-50</button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
