
import React, { useState } from 'react';

interface AuthOverlayProps {
  onAuth: (code: string) => void;
}

const AuthOverlay: React.FC<AuthOverlayProps> = ({ onAuth }) => {
  const [code, setCode] = useState('');
  const [isError, setIsError] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanCode = code.trim().toUpperCase();
    if (cleanCode === 'VIP-DEMO-2025' || cleanCode === 'WORK-2025') {
      onAuth(cleanCode);
    } else {
      setIsError(true);
      setTimeout(() => setIsError(false), 1000);
    }
  };

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-[#05020a] p-4">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(139,92,246,0.15),transparent)]"></div>
      
      <div className={`w-full max-w-md p-10 glass rounded-[3rem] border-2 transition-all duration-300 ${isError ? 'border-red-500 shake shadow-[0_0_50px_rgba(239,68,68,0.4)]' : 'border-purple-500/30 shadow-2xl'}`}>
        <div className="text-center mb-10">
          <div className="inline-block p-6 rounded-full bg-purple-500/10 mb-6 border border-purple-500/20 animate-pulse">
            <span className="text-6xl">💼</span>
          </div>
          <h1 className="text-3xl font-black mb-3 tracking-tight">نظام العمل والمزادات</h1>
          <p className="text-gray-400 text-sm font-medium">أدخل كود الوصول المخصص لك</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="text-right">
            <label className="block text-xs font-black text-gray-500 mb-3 uppercase tracking-widest px-2">كود الترخيص الخاص بك</label>
            <input 
              type="text" 
              value={code}
              onChange={(e) => {
                setCode(e.target.value);
                setIsError(false);
              }}
              placeholder="AD-XXXX"
              className="w-full bg-black/50 border-2 border-white/5 rounded-[1.5rem] px-6 py-5 text-center text-3xl font-black tracking-[0.3em] focus:outline-none focus:border-purple-500 transition-all uppercase placeholder:text-gray-800"
            />
            <div className="mt-6 p-4 bg-purple-500/5 rounded-2xl border border-white/5 flex flex-col items-center gap-2">
              <p className="text-[10px] text-gray-500 font-bold italic">الكود الحالي للتجربة:</p>
              <code className="text-purple-400 text-xl font-black select-all">VIP-DEMO-2025</code>
            </div>
          </div>

          <button 
            type="submit"
            className="group w-full py-6 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-[1.5rem] font-black text-2xl hover:scale-[1.03] active:scale-95 transition-all shadow-2xl flex items-center justify-center gap-3"
          >
            دخول للنظام 🚀
          </button>
        </form>
      </div>
      
      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-10px); }
          75% { transform: translateX(10px); }
        }
        .shake { animation: shake 0.2s ease-in-out 0s 2; }
      `}</style>
    </div>
  );
};

export default AuthOverlay;
