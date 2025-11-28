import React, { useState } from 'react';
import { RequestWizard } from './components/Wizard/RequestWizard';
import { AdminDashboard } from './components/Admin/AdminDashboard';
import { Login } from './components/Admin/Login';
import { User } from './types';
import { Icons } from './components/ui/Icons';
import { useTheme } from './components/ui/ThemeContext';

type View = 'wizard' | 'admin';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>('wizard');
  const [user, setUser] = useState<User | null>(null);
  const { theme, toggleTheme } = useTheme();

  const handleLogin = (u: User) => {
    setUser(u);
  };

  const handleLogout = () => {
    setUser(null);
  };

  const renderContent = () => {
    if (currentView === 'admin') {
      if (!user) {
        return <Login onLogin={handleLogin} />;
      }
      return <AdminDashboard user={user} onLogout={handleLogout} />;
    }
    return <RequestWizard />;
  };

  return (
    <div className="min-h-screen flex flex-col font-sans relative overflow-x-hidden transition-colors duration-300">
      {/* Background Ambience Elements */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
         {/* Adjust blobs opacity for Light Mode */}
         <div className="absolute top-0 left-1/4 w-96 h-96 bg-ydea-300/30 dark:bg-ydea-600/10 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-[100px] animate-blob"></div>
         <div className="absolute top-0 right-1/4 w-96 h-96 bg-ydea-200/40 dark:bg-ydea-400/10 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-[100px] animate-blob animation-delay-2000"></div>
         <div className="absolute -bottom-32 left-1/3 w-96 h-96 bg-ydea-200/30 dark:bg-ydea-800/15 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-[120px] animate-blob animation-delay-4000"></div>
      </div>

      {/* Glass Header */}
      <header className="sticky top-0 z-50 w-full glass-panel border-b-0 dark:border-b dark:border-b-ydea-500/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer group" onClick={() => setCurrentView('wizard')}>
            <div className="relative w-10 h-10 flex items-center justify-center">
              <div className="absolute inset-0 bg-gradient-to-tr from-ydea-500 to-ydea-300 rounded-lg opacity-80 group-hover:opacity-100 transition duration-300 blur-sm"></div>
              <div className="relative bg-white dark:bg-space-950 rounded-lg w-[38px] h-[38px] flex items-center justify-center border border-ydea-500/30">
                <span className="font-display font-bold text-xl text-ydea-500">Y</span>
              </div>
            </div>
            <div className="flex flex-col">
              <span className="font-display font-bold text-xl tracking-tight text-slate-800 dark:text-white leading-none">Ydea</span>
              <span className="text-[10px] uppercase tracking-[0.2em] text-ydea-500 dark:text-ydea-400 font-medium">Partner Portal</span>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <nav className="flex gap-2 bg-slate-100/50 dark:bg-space-900/50 p-1 rounded-full border border-slate-200 dark:border-ydea-500/20 backdrop-blur-md">
              <button 
                  onClick={() => setCurrentView('wizard')}
                  className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-300 ${
                    currentView === 'wizard' 
                    ? 'bg-ydea-500 text-white shadow-lg shadow-ydea-500/30' 
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-white/50 dark:hover:bg-white/5'
                  }`}
              >
                  Nuova Richiesta
              </button>
              <button 
                  onClick={() => setCurrentView('admin')}
                  className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-300 flex items-center gap-2 ${
                    currentView === 'admin' 
                    ? 'bg-ydea-500 text-white shadow-lg shadow-ydea-500/30' 
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-white/50 dark:hover:bg-white/5'
                  }`}
              >
                  <Icons.User className="w-3.5 h-3.5"/> Staff
              </button>
            </nav>

            {/* Theme Toggle */}
            <button 
              onClick={toggleTheme}
              className="w-10 h-10 flex items-center justify-center rounded-full bg-slate-100 dark:bg-space-900 border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-400 hover:text-ydea-500 dark:hover:text-ydea-400 transition-colors"
              title={theme === 'dark' ? 'Passa alla modalità chiara' : 'Passa alla modalità scura'}
            >
              {theme === 'dark' ? <Icons.Sun className="w-5 h-5" /> : <Icons.Moon className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </header>

      <main className="flex-grow relative z-10 flex flex-col">
        {renderContent()}
      </main>

      <footer className="relative z-10 border-t border-slate-200 dark:border-ydea-500/10 py-8 mt-auto bg-slate-50/80 dark:bg-space-950/80 backdrop-blur-sm transition-colors duration-300">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <p className="text-slate-500 text-sm font-light">
            &copy; {new Date().getFullYear()} <span className="font-display font-bold text-ydea-600 dark:text-ydea-400">Ydea Software</span>. Cloud Customer Suite.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default App;