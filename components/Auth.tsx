import React, { useState } from 'react';
import { User } from '../types';

interface AuthProps {
  onLogin: (user: User) => void;
  t: any;
}

const Auth: React.FC<AuthProps> = ({ onLogin, t }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin({
      id: 'USR-1',
      email: email || 'user@example.com',
      name: 'Researcher',
      profilePic: 'https://api.dicebear.com/7.x/avataaars/svg?seed=researcher'
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 heritage-bg relative overflow-hidden">
      <div className="w-full max-w-lg glass p-8 sm:p-12 rounded-[2.5rem] sm:rounded-[3rem] shadow-2xl relative z-10 card-3d border border-primary-10">
        <div className="text-center mb-10 sm:mb-12">
          <h1 className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tighter mb-4">{t.auth?.title || "ChronicleAI"}</h1>
          <p className="text-primary font-bold uppercase tracking-[0.3em] text-[10px]">{t.auth?.tagline || "Unveiling Ancient Manuscripts"}</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
          <div>
            <label htmlFor="email" className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">{t.auth?.email || "Email"}</label>
            <input
              id="email"
              type="email"
              required
              className="w-full bg-white border border-slate-300 rounded-2xl px-5 sm:px-6 py-4 sm:py-5 text-slate-900 placeholder:text-slate-400 outline-none focus:border-primary focus:ring-2 focus:ring-primary-10"
              placeholder={t.auth?.email || "Archive ID / Email"}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">{t.auth?.password || "Password"}</label>
            <input
              id="password"
              type="password"
              required
              className="w-full bg-white border border-slate-300 rounded-2xl px-5 sm:px-6 py-4 sm:py-5 text-slate-900 placeholder:text-slate-400 outline-none focus:border-primary focus:ring-2 focus:ring-primary-10"
              placeholder={t.auth?.password || "Code"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button type="submit" className="w-full bg-primary text-on-primary py-4 sm:py-5 rounded-[2rem] font-black text-lg sm:text-xl hover:brightness-95 transition shadow-lg shadow-teal-900/20">
            {isLogin ? (t.auth?.login || "Enter The Vault") : (t.auth?.register || "Initialize Session")}
          </button>
        </form>
        <div className="mt-8 sm:mt-10 text-center">
          <button type="button" onClick={() => setIsLogin(!isLogin)} className="text-slate-600 text-[10px] uppercase tracking-widest font-bold hover:text-slate-900 transition">
            {isLogin ? (t.auth?.register || "Generate New Credentials") : (t.auth?.login || "Return to Login Path")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Auth;
