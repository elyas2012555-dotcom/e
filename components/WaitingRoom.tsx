
import React, { useState } from 'react';

interface WaitingRoomProps {
  onSendRequest: (name: string) => void;
}

const WaitingRoom: React.FC<WaitingRoomProps> = ({ onSendRequest }) => {
  const [name, setName] = useState('');
  const [sent, setSent] = useState(false);

  return (
    <div className="fixed inset-0 z-[2000] flex items-center justify-center bg-[#05020a] p-6 text-center">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(139,92,246,0.1),transparent)]"></div>
      
      <div className="w-full max-w-md glass p-12 rounded-[4rem] border-2 border-purple-500/30 space-y-10 relative">
        {!sent ? (
          <>
            <div className="text-9xl animate-bounce">💼</div>
            <div>
              <h1 className="text-4xl font-black mb-2">طلب دخول للمزاد</h1>
              <p className="text-gray-500 font-bold uppercase tracking-widest text-xs">اكتب اسمك ليوافق عليك المسؤول</p>
            </div>
            <input 
              type="text" 
              placeholder="اكتب اسمك هنا" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-black/80 border-2 border-white/10 p-6 rounded-3xl text-center text-3xl font-black focus:border-purple-500 outline-none uppercase"
            />
            <button 
              onClick={() => { if(name) { onSendRequest(name); setSent(true); } }} 
              className="w-full py-7 bg-purple-600 rounded-3xl font-black text-2xl hover:bg-purple-500 shadow-2xl transition-all"
            >
              إرسال طلب الدخول 🚀
            </button>
          </>
        ) : (
          <div className="space-y-8 py-10">
            <div className="text-8xl animate-pulse">⏳</div>
            <h1 className="text-3xl font-black">جاري انتظار موافقة المسؤول...</h1>
            <p className="text-gray-400 font-bold">يرجى عدم إغلاق هذه الصفحة</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default WaitingRoom;
