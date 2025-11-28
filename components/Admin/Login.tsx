import React, { useState } from 'react';
import { User } from '../../types';
import { api } from '../../services/api';
import { Icons } from '../ui/Icons';

interface Props {
  onLogin: (user: User) => void;
}

export const Login: React.FC<Props> = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const user = await api.login(username, password);
      if (user) {
        onLogin(user);
      } else {
        setError('Credenziali non valide.');
      }
    } catch (err) {
      setError('Errore di connessione.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center relative">
      <div className="glass-panel p-10 rounded-2xl max-w-sm w-full border border-slate-200 dark:border-ydea-500/20 shadow-2xl dark:shadow-[0_0_50px_rgba(0,158,227,0.15)] relative z-10">
        
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-tr from-ydea-600 to-ydea-400 rounded-2xl mx-auto flex items-center justify-center mb-4 shadow-lg shadow-ydea-500/30">
             <Icons.User className="text-white w-8 h-8" />
          </div>
          <h2 className="text-2xl font-display font-bold text-slate-900 dark:text-white">Area Riservata</h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Accedi al pannello di controllo</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-2 uppercase">Username</label>
            <input
              type="text"
              className="input-tech"
              value={username}
              onChange={e => setUsername(e.target.value)}
              disabled={isLoading}
              placeholder="Inserisci username"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-2 uppercase">Password</label>
            <input
              type="password"
              className="input-tech"
              value={password}
              onChange={e => setPassword(e.target.value)}
              disabled={isLoading}
              placeholder="••••••••"
            />
          </div>
          
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 p-3 rounded text-red-500 dark:text-red-300 text-sm text-center flex items-center justify-center gap-2">
              <Icons.X className="w-4 h-4" /> {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 bg-slate-900 dark:bg-white text-white dark:text-space-950 rounded-lg font-bold hover:bg-ydea-500 dark:hover:bg-ydea-500 hover:text-white dark:hover:text-white transition-all duration-300 shadow-lg flex justify-center items-center"
          >
            {isLoading ? (
               <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
            ) : "Entra nel sistema"}
          </button>
        </form>
      </div>
    </div>
  );
};