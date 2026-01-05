
import React, { useState } from 'react';
import { AppState, PortfolioTheme } from './types';
import { generatePortfolioFromResume } from './services/geminiService';
import PortfolioPreview from './components/PortfolioPreview';
import { motion, AnimatePresence } from 'framer-motion';

declare const html2pdf: any;

const App: React.FC = () => {
  const [state, setState] = useState<AppState>({
    resumeFile: null,
    photoUrl: null,
    theme: PortfolioTheme.MODERN,
    portfolioData: null,
    isGenerating: false,
    error: null,
  });

  const handleResumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const allowedExt = ['.pdf', '.txt', '.md'];
      const isAllowed = allowedExt.some(ext => file.name.toLowerCase().endsWith(ext)) || 
                        ['application/pdf', 'text/plain'].includes(file.type);
      
      if (!isAllowed) {
        setState(prev => ({ 
          ...prev, 
          resumeFile: null, 
          error: "Oops! 🛑 Only PDF or TXT files are supported for now." 
        }));
        return;
      }
      
      setState(prev => ({ ...prev, resumeFile: file, error: null }));
    }
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setState(prev => ({ ...prev, photoUrl: url }));
    }
  };

  const generatePortfolio = async () => {
    if (!state.resumeFile) return;

    setState(prev => ({ ...prev, isGenerating: true, error: null }));
    try {
      const data = await generatePortfolioFromResume(state.resumeFile);
      setState(prev => ({ ...prev, portfolioData: data, isGenerating: false }));
    } catch (err: any) {
      console.error(err);
      setState(prev => ({ 
        ...prev, 
        isGenerating: false, 
        error: "AI had a brain freeze 🧊. Please try again or use a clearer PDF."
      }));
    }
  };

  const handleDownloadPDF = () => {
    const element = document.getElementById('portfolio-content');
    if (!element) return;

    const opt = {
      margin: 0,
      filename: `${state.portfolioData?.name.replace(/\s+/g, '_')}_Portfolio.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true, letterRendering: true },
      jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
    };

    html2pdf().set(opt).from(element).save();
  };

  const reset = () => {
    setState({
      resumeFile: null,
      photoUrl: null,
      theme: PortfolioTheme.MODERN,
      portfolioData: null,
      isGenerating: false,
      error: null,
    });
  };

  if (state.portfolioData) {
    return (
      <div className="relative">
        <motion.div 
          initial={{ x: 100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="fixed top-4 right-4 z-50 flex flex-col gap-2 no-print bg-white/95 backdrop-blur-md p-5 rounded-3xl shadow-2xl border border-slate-200 w-64"
        >
          <p className="text-xs font-bold text-slate-500 uppercase px-2 mb-2 tracking-widest">Dashboard ⚙️</p>
          
          <div className="space-y-3">
            <div>
              <p className="text-[10px] text-slate-400 font-bold uppercase mb-1 px-2">Switch Style 🎨</p>
              <div className="grid grid-cols-2 gap-2">
                {Object.values(PortfolioTheme).map((t) => (
                  <button
                    key={t}
                    onClick={() => setState(prev => ({ ...prev, theme: t }))}
                    className={`px-3 py-2 rounded-xl text-[10px] font-bold capitalize transition-all border ${
                      state.theme === t 
                        ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-100' 
                        : 'bg-white border-slate-100 text-slate-500 hover:border-indigo-200'
                    }`}
                  >
                    {t.replace('-', ' ')}
                  </button>
                ))}
              </div>
            </div>

            <button 
              onClick={handleDownloadPDF}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-emerald-600 text-white text-xs font-bold rounded-2xl hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-100"
            >
              Save as PDF 📄💾
            </button>

            <button 
              onClick={reset}
              className="w-full px-4 py-3 bg-slate-100 text-slate-600 text-xs font-bold rounded-2xl hover:bg-slate-200 transition-all"
            >
              Try Another 🔄
            </button>
          </div>
        </motion.div>
        <PortfolioPreview 
          data={state.portfolioData} 
          theme={state.theme} 
          photoUrl={state.photoUrl} 
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-sky-50 flex flex-col items-center justify-center p-6">
      <div className="max-w-2xl w-full">
        <header className="text-center mb-12">
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="inline-block p-4 bg-white rounded-[2rem] shadow-2xl mb-6 animate-float"
          >
            <span className="text-5xl">⚡</span>
          </motion.div>
          <h1 className="text-5xl font-extrabold text-slate-900 tracking-tight mb-4">
            InstantPortfolio <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-sky-600">AI ✨</span>
          </h1>
          <p className="text-lg text-slate-600">
            Turn your boring resume into a stunning site in 3 seconds. 🚀💎
          </p>
        </header>

        <div className="bg-white p-8 md:p-10 rounded-[3rem] shadow-2xl shadow-indigo-100/50 border border-slate-100 space-y-8">
          {/* Resume Upload */}
          <div className="space-y-4">
            <label className="block text-sm font-bold text-slate-700 uppercase tracking-widest">1. Upload Resume 📄</label>
            <div className={`relative border-2 border-dashed rounded-[2rem] p-10 transition-all ${state.resumeFile ? 'border-emerald-200 bg-emerald-50/50' : 'border-slate-200 hover:border-indigo-400 hover:bg-indigo-50/20'}`}>
              <input 
                type="file" 
                accept=".pdf,.txt,.md" 
                onChange={handleResumeChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <div className="text-center">
                {state.resumeFile ? (
                  <div className="flex flex-col items-center gap-2 text-emerald-600">
                    <span className="text-4xl">✅</span>
                    <span className="font-bold text-lg">{state.resumeFile.name}</span>
                  </div>
                ) : (
                  <div>
                    <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
                       <span className="text-2xl">📥</span>
                    </div>
                    <p className="text-slate-500 font-bold">Drop your resume here</p>
                    <p className="text-sm text-slate-400 mt-1">PDF or Text files work best 📝</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Photo Upload */}
          <div className="space-y-4">
            <label className="block text-sm font-bold text-slate-700 uppercase tracking-widest">2. Your Best Shot 📸</label>
            <div className="flex items-center gap-8 bg-slate-50 p-6 rounded-[2rem] border border-slate-100">
              <div className="w-24 h-24 rounded-full bg-white shadow-xl border-4 border-white flex-shrink-0 overflow-hidden flex items-center justify-center bg-slate-100">
                {state.photoUrl ? (
                  <img src={state.photoUrl} className="w-full h-full object-cover" alt="Preview" />
                ) : (
                  <span className="text-4xl">👤</span>
                )}
              </div>
              <div className="flex-1">
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={handlePhotoChange}
                  className="block w-full text-sm text-slate-500 file:mr-4 file:py-3 file:px-6 file:rounded-2xl file:border-0 file:text-sm file:font-bold file:bg-indigo-600 file:text-white hover:file:bg-indigo-700 transition-all cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* Theme Selection */}
          <div className="space-y-4">
             <label className="block text-sm font-bold text-slate-700 uppercase tracking-widest">3. Select Theme 🎨✨</label>
             <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
               {[
                 { id: PortfolioTheme.MODERN, emoji: '🏢' },
                 { id: PortfolioTheme.CREATIVE, emoji: '🎨' },
                 { id: PortfolioTheme.MINIMAL, emoji: '⚪' },
                 { id: PortfolioTheme.DARK_TECH, emoji: '📟' }
               ].map((t) => (
                 <button 
                  key={t.id}
                  onClick={() => setState(prev => ({ ...prev, theme: t.id }))}
                  className={`p-4 rounded-[1.5rem] text-xs font-bold capitalize border-2 transition-all flex flex-col items-center gap-2 ${state.theme === t.id ? 'border-indigo-600 bg-indigo-50 text-indigo-700 shadow-lg shadow-indigo-100' : 'border-slate-50 bg-slate-50 text-slate-500 hover:border-slate-200'}`}
                 >
                   <span className="text-xl">{t.emoji}</span>
                   {t.id.replace('-', ' ')}
                 </button>
               ))}
             </div>
          </div>

          {state.error && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 bg-red-50 text-red-600 rounded-2xl text-sm font-bold border border-red-100 flex items-center gap-3"
            >
              <span>⚠️</span> {state.error}
            </motion.div>
          )}

          <button
            onClick={generatePortfolio}
            disabled={!state.resumeFile || state.isGenerating}
            className={`w-full py-6 rounded-[2rem] text-xl font-black transition-all shadow-2xl flex items-center justify-center gap-3 ${
              !state.resumeFile || state.isGenerating
                ? 'bg-slate-100 text-slate-400 cursor-not-allowed shadow-none'
                : 'bg-indigo-600 text-white hover:bg-indigo-700 hover:-translate-y-1 shadow-indigo-200 active:scale-95'
            }`}
          >
            {state.isGenerating ? (
              <div className="flex items-center gap-3">
                <svg className="animate-spin h-7 w-7 text-white" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing Magic... 🧠✨
              </div>
            ) : (
              'Create My Portfolio! 🚀🔥'
            )}
          </button>
        </div>

        <footer className="mt-16 text-center text-slate-400 text-sm space-y-8">
          <p className="font-bold tracking-widest text-slate-300 uppercase">Built with Gemini 3.0 💎 & React ⚛️</p>
          
          <div className="flex flex-col items-center gap-4">
            <p className="text-[10px] uppercase font-black tracking-[0.2em] text-indigo-400">Share with the world 🌍</p>
            <div className="flex gap-4">
              <motion.a whileHover={{ y: -4 }} href="#" className="w-12 h-12 rounded-2xl bg-white shadow-lg flex items-center justify-center hover:bg-[#1DA1F2] hover:text-white transition-all text-xl">𝕏</motion.a>
              <motion.a whileHover={{ y: -4 }} href="#" className="w-12 h-12 rounded-2xl bg-white shadow-lg flex items-center justify-center hover:bg-[#0077B5] hover:text-white transition-all text-xl">in</motion.a>
              <motion.a whileHover={{ y: -4 }} href="#" className="w-12 h-12 rounded-2xl bg-white shadow-lg flex items-center justify-center hover:bg-gradient-to-tr hover:from-orange-400 hover:to-pink-600 hover:text-white transition-all text-xl">📸</motion.a>
            </div>
          </div>
          
          <div className="pt-8 border-t border-slate-100">
             <p className="opacity-40 font-medium">© {new Date().getFullYear()} InstantPortfolio AI • No build required ✨</p>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default App;
