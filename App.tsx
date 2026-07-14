import React, { useState, useEffect } from 'react';
import Auth from './components/Auth';
import Dashboard from './components/Dashboard';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Upload from './components/Upload';
import Scan from './components/Scan';
import VoiceAssistance from './components/VoiceAssistance';
import Report from './components/Report';
import Research from './components/Research';
import { PageType, User, ScanRecord, LanguageCode } from './types';
import { translations } from './i18n';

function normalizeRecord(raw: Record<string, unknown>): ScanRecord {
  return {
    id: String(raw.id ?? `DOC-${Date.now()}`),
    type: String(raw.type ?? raw.category ?? raw.fileName ?? 'Unknown'),
    timestamp: String(raw.timestamp ?? raw.uploadDate ?? new Date().toISOString()),
    originalText: String(raw.originalText ?? raw.sourceText ?? ''),
    language: raw.language ? String(raw.language) : undefined,
    imageUrl: raw.imageUrl ? String(raw.imageUrl) : undefined,
    translatedText: raw.translatedText ? String(raw.translatedText) : undefined,
    confidence: typeof raw.confidence === 'number' ? raw.confidence : undefined,
  };
}

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);
  const [currentPage, setCurrentPage] = useState<PageType>('dashboard');
  const [records, setRecords] = useState<ScanRecord[]>([]);
  const [currentLang, setCurrentLang] = useState<LanguageCode>('en');
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  const t = translations[currentLang] || translations.en;

  useEffect(() => {
    const saved = localStorage.getItem('chronicle_records');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          setRecords(parsed.map((r) => normalizeRecord(r as Record<string, unknown>)));
        }
      } catch {
        setRecords([]);
      }
    }
    const savedLang = localStorage.getItem('chronicle_lang') as LanguageCode;
    if (savedLang && translations[savedLang]) {
      setCurrentLang(savedLang);
    }
  }, []);

  useEffect(() => {
    setMobileNavOpen(false);
  }, [currentPage]);

  const changeLanguage = (lang: LanguageCode) => {
    setCurrentLang(lang);
    localStorage.setItem('chronicle_lang', lang);
  };

  const saveRecord = (record: ScanRecord) => {
    const updated = [record, ...records];
    setRecords(updated);
    localStorage.setItem('chronicle_records', JSON.stringify(updated));
  };

  const handleLogin = (userData: User) => {
    setUser(userData);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUser(null);
    setCurrentPage('dashboard');
    setMobileNavOpen(false);
  };

  const handleNavigate = (page: PageType) => {
    setCurrentPage(page);
    setMobileNavOpen(false);
  };

  if (!isAuthenticated) {
    return <Auth onLogin={handleLogin} t={t} />;
  }

  return (
    <div className="flex min-h-screen heritage-bg text-on-light overflow-hidden font-['Inter']">
      {mobileNavOpen && (
        <button
          type="button"
          aria-label="Close navigation"
          className="fixed inset-0 bg-slate-900/40 z-40 md:hidden"
          onClick={() => setMobileNavOpen(false)}
        />
      )}

      <Sidebar
        activePage={currentPage}
        onPageChange={handleNavigate}
        onLogout={handleLogout}
        t={t}
        mobileOpen={mobileNavOpen}
      />

      <div className="flex-1 flex flex-col h-screen overflow-hidden relative min-w-0">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary-10 blur-[120px] rounded-full -mr-32 -mt-32 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-primary-05 blur-[100px] rounded-full -ml-32 -mb-32 pointer-events-none"></div>

        <Header
          user={user}
          currentLang={currentLang}
          onLangChange={changeLanguage}
          onMenuToggle={() => setMobileNavOpen((open) => !open)}
        />

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-12 relative z-10 scroll-smooth custom-scrollbar">
          <div className="max-w-7xl mx-auto pb-20">
            {currentPage === 'dashboard' && <Dashboard records={records} onNavigate={handleNavigate} t={t} />}
            {currentPage === 'upload' && <Upload onSave={saveRecord} t={t} />}
            {currentPage === 'scan' && <Scan onSave={saveRecord} t={t} />}
            {currentPage === 'research' && <Research t={t} />}
            {currentPage === 'voice' && <VoiceAssistance records={records} t={t} />}
            {currentPage === 'report' && <Report records={records} t={t} />}
          </div>
        </main>
      </div>
    </div>
  );
};

export default App;
