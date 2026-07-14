import React from 'react';
import { User, LanguageCode } from '../types';

interface HeaderProps {
  user: User | null;
  currentLang: LanguageCode;
  onLangChange: (lang: LanguageCode) => void;
  onMenuToggle?: () => void;
}

const LANGUAGES: { code: LanguageCode; label: string }[] = [
  { code: 'en', label: 'English' },
  { code: 'hi', label: 'हिन्दी (Hindi)' },
  { code: 'ta', label: 'தமிழ் (Tamil)' },
  { code: 'te', label: 'తెలుగు (Telugu)' },
  { code: 'es', label: 'Español' },
  { code: 'fr', label: 'Français' },
  { code: 'de', label: 'Deutsch' },
  { code: 'zh', label: '中文' },
];

const Header: React.FC<HeaderProps> = ({ user, currentLang, onLangChange, onMenuToggle }) => {
  return (
    <header className="h-16 sm:h-20 glass border-b border-slate-200 flex items-center justify-between px-4 sm:px-8 z-20">
      <div className="flex items-center gap-3 md:hidden">
        <button
          type="button"
          onClick={onMenuToggle}
          className="p-2 rounded-xl text-slate-700 hover:bg-slate-100 border border-slate-200"
          aria-label="Open navigation menu"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <span className="text-lg font-bold text-primary">ChronicleAI</span>
      </div>

      <div className="hidden md:flex items-center space-x-4">
        <div className="flex items-center space-x-2 bg-white/80 border border-slate-300 rounded-xl px-3 py-1.5 transition-all focus-within:border-primary">
          <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5a18.022 18.022 0 01-3.827-5.806m10.056 5.806c-1.235-2.288-3.004-4.446-5.174-5.806m-.343 1.947a11.963 11.963 0 01-2.273 4.793 11.966 11.966 0 01-2.273-4.793m5.346 4.168a11.97 11.97 0 001.276-2.273" />
          </svg>
          <select
            value={currentLang}
            onChange={(e) => onLangChange(e.target.value as LanguageCode)}
            className="bg-transparent text-sm font-semibold text-slate-800 outline-none cursor-pointer hover:text-slate-950 transition-colors"
            aria-label="Select language"
          >
            {LANGUAGES.map(lang => (
              <option key={lang.code} value={lang.code} className="bg-white text-slate-900">
                {lang.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex items-center space-x-4 sm:space-x-6">
        <div className="md:hidden">
          <select
            value={currentLang}
            onChange={(e) => onLangChange(e.target.value as LanguageCode)}
            className="bg-white border border-slate-300 text-sm font-semibold text-slate-800 rounded-lg px-2 py-1.5 outline-none"
            aria-label="Select language"
          >
            {LANGUAGES.map(lang => (
              <option key={lang.code} value={lang.code}>
                {lang.code.toUpperCase()}
              </option>
            ))}
          </select>
        </div>

        <button type="button" className="relative p-2 text-slate-600 hover:text-slate-900 transition-colors" aria-label="Notifications">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
          <span className="absolute top-2 right-2 w-2 h-2 bg-teal-700 rounded-full"></span>
        </button>

        <div className="flex items-center space-x-3 pl-4 sm:pl-6 border-l border-slate-200">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-semibold text-slate-900">{user?.name}</p>
            <p className="text-xs text-slate-600">{user?.id}</p>
          </div>
          <div className="w-10 h-10 rounded-full border-2 border-primary/40 overflow-hidden bg-slate-200 p-0.5">
            <img src={user?.profilePic} alt="Profile" className="w-full h-full rounded-full object-cover" />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
