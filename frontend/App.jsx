import React, { useState } from 'react';
import { 
  Code2, 
  Wand2, 
  Copy, 
  CheckCheck, 
  Trash2, 
  AlertCircle,
  Code as CodeIcon,
  Terminal,
  Info
} from 'lucide-react';

const App = () => {
  const [inputCode, setInputCode] = useState('/* Kodu bura yapışdırın */\n#include <stdio.h>\n\nint main(void)\n{\n    printf("Hello, Holbeditor!\\n");\n    return (0);\n}');
  const [fixedCode, setFixedCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [copiedInput, setCopiedInput] = useState(false);
  const [copiedFixed, setCopiedFixed] = useState(false);

  // Sizin Python backend ünvanınız (betty_fixer burada işləyir)
  const API_URL = "http://localhost:8000/fix";

  const handleFixCode = async () => {
    if (!inputCode.trim()) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: inputCode }),
      });

      if (!response.ok) {
        throw new Error('Backend server cavab vermir. Holbeditor xidmətinin aktiv olduğundan əmin olun.');
      }

      const data = await response.json();
      setFixedCode(data.fixed_code);
    } catch (err) {
      setError(err.message || 'Xəta baş verdi.');
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = (text, type) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    if (type === 'input') {
      setCopiedInput(true);
      setTimeout(() => setCopiedInput(false), 2000);
    } else {
      setCopiedFixed(true);
      setTimeout(() => setCopiedFixed(false), 2000);
    }
  };

  const clearInput = () => {
    setInputCode('');
    setFixedCode('');
    setError(null);
  };

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 font-sans flex flex-col">
      {/* Header */}
      <header className="border-b border-white/5 bg-[#0f172a]/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 p-2 rounded-xl shadow-lg shadow-blue-500/20">
              <Code2 size={24} className="text-white" />
            </div>
            <h1 className="text-xl font-bold tracking-tight">Holb<span className="text-blue-500 underline decoration-blue-500/30 underline-offset-4">editor</span></h1>
          </div>
          
          <button 
            onClick={handleFixCode}
            disabled={isLoading || !inputCode.trim()}
            className={`flex items-center gap-2 px-8 py-2.5 rounded-lg font-bold transition-all ${
              isLoading 
              ? 'bg-slate-800 cursor-not-allowed text-slate-500' 
              : 'bg-blue-600 text-white hover:bg-blue-500 active:scale-95 shadow-lg shadow-blue-500/10'
            }`}
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <Wand2 size={18} />
            )}
            <span>{isLoading ? 'Düzəldilir...' : 'Betty-ni Düzəlt'}</span>
          </button>
        </div>
      </header>

      {/* Main Grid */}
      <main className="flex-grow max-w-[1600px] w-full mx-auto p-4 lg:p-6 grid grid-cols-1 lg:grid-cols-2 gap-6 overflow-hidden">
        
        {/* Giriş Paneli */}
        <div className="flex flex-col h-full rounded-xl overflow-hidden border border-white/5 bg-[#0f172a]/50 shadow-2xl">
          <div className="flex items-center justify-between px-5 py-3 bg-slate-900/40 border-b border-white/5">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 uppercase tracking-widest">
              <CodeIcon size={14} />
              <span>Giriş Kodu</span>
            </div>
            <div className="flex items-center gap-2">
              <button 
                onClick={() => copyToClipboard(inputCode, 'input')}
                className="p-1.5 text-slate-500 hover:text-white transition-colors relative group"
                title="Kopyala"
              >
                {copiedInput ? <CheckCheck size={16} className="text-green-500" /> : <Copy size={16} />}
                <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-800 text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">Kopyala</span>
              </button>
              <button 
                onClick={clearInput}
                className="p-1.5 text-slate-500 hover:text-red-400 transition-colors"
                title="Təmizlə"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
          <div className="flex-grow relative">
            <textarea
              className="absolute inset-0 w-full h-full p-6 bg-transparent text-slate-300 font-mono text-sm resize-none focus:outline-none custom-scrollbar"
              spellCheck="false"
              value={inputCode}
              onChange={(e) => setInputCode(e.target.value)}
              placeholder="C kodunu bura daxil edin..."
            />
          </div>
        </div>

        {/* Çıxış Paneli */}
        <div className="flex flex-col h-full rounded-xl overflow-hidden border border-white/5 bg-[#0f172a]/50 shadow-2xl relative">
          <div className="flex items-center justify-between px-5 py-3 bg-slate-900/40 border-b border-white/5">
            <div className="flex items-center gap-2 text-xs font-semibold text-blue-400 uppercase tracking-widest">
              <Terminal size={14} />
              <span>Düzəldilmiş Kod</span>
            </div>
            {fixedCode && (
              <button 
                onClick={() => copyToClipboard(fixedCode, 'fixed')}
                className={`flex items-center gap-2 text-xs px-4 py-1.5 rounded-md transition-all active:scale-95 shadow-lg flex-shrink-0 border ${
                  copiedFixed 
                  ? 'bg-green-500/10 border-green-500/50 text-green-400' 
                  : 'bg-blue-600 border-blue-500 text-white hover:bg-blue-500 shadow-blue-500/20'
                }`}
              >
                {copiedFixed ? <CheckCheck size={14} /> : <Copy size={14} />}
                {copiedFixed ? 'Kopyalandı!' : 'Kodu Kopyala'}
              </button>
            )}
          </div>
          
          <div className="flex-grow relative bg-black/20">
            {isLoading && (
              <div className="absolute inset-0 z-20 bg-black/40 backdrop-blur-sm flex items-center justify-center">
                <div className="flex flex-col items-center gap-3">
                  <div className="w-10 h-10 border-3 border-blue-600/30 border-t-blue-600 rounded-full animate-spin" />
                  <span className="text-xs font-bold text-blue-400 uppercase tracking-widest tracking-tighter text-center px-4">
                    Holbeditor tərəfindən düzəldilir...
                  </span>
                </div>
              </div>
            )}
            
            {!fixedCode && !isLoading && !error && (
              <div className="absolute inset-0 flex items-center justify-center text-slate-600 italic text-sm">
                Nəticəni görmək üçün yuxarıdakı düyməni sıxın
              </div>
            )}

            <textarea
              className="absolute inset-0 w-full h-full p-6 bg-transparent text-blue-50 font-mono text-sm resize-none focus:outline-none custom-scrollbar"
              readOnly
              value={fixedCode}
              placeholder="Düzəldilmiş kod burada görünəcək..."
            />
          </div>

          {error && (
            <div className="absolute bottom-4 left-4 right-4 p-4 bg-red-500/10 border border-red-500/20 rounded-lg flex items-start gap-3">
              <AlertCircle className="text-red-500 shrink-0" size={18} />
              <p className="text-xs text-red-200 leading-tight">{error}</p>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="p-4 border-t border-white/5 bg-[#020617] flex justify-center items-center px-8">
        <p className="text-slate-600 text-[10px] uppercase tracking-[0.3em] flex items-center gap-2">
          <Info size={12} className="text-blue-500" /> Holbeditor • Style & Doc Linter
        </p>
      </footer>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #1e293b; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #334155; }
      `}</style>
    </div>
  );
};

export default App;
