import React from 'react';
import { SelectedModule } from '../../types';
import { YDEA_MODULES } from '../../constants';
import { Icons } from '../ui/Icons';

interface Props {
  selectedModules: SelectedModule[];
  updateModules: (modules: SelectedModule[]) => void;
  onNext: () => void;
  onBack: () => void;
}

export const Step2Modules: React.FC<Props> = ({ selectedModules, updateModules, onNext, onBack }) => {

  const handleQuantityChange = (moduleId: string, quantity: number) => {
    const existing = selectedModules.find(m => m.id === moduleId);
    
    if (quantity <= 0) {
      updateModules(selectedModules.filter(m => m.id !== moduleId));
      return;
    }

    if (existing) {
      updateModules(selectedModules.map(m => m.id === moduleId ? { ...m, quantity } : m));
    } else {
      const moduleToAdd = YDEA_MODULES.find(m => m.id === moduleId);
      if (moduleToAdd) {
        updateModules([...selectedModules, { ...moduleToAdd, quantity }]);
      }
    }
  };

  const getQuantity = (id: string) => selectedModules.find(m => m.id === id)?.quantity || 0;
  const totalCost = selectedModules.reduce((acc, m) => acc + (m.price * m.quantity), 0);
  const isValid = selectedModules.length > 0;

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        {YDEA_MODULES.map(module => {
          const qty = getQuantity(module.id);
          const isSelected = qty > 0;

          return (
            <div 
              key={module.id} 
              className={`
                relative p-5 rounded-xl border transition-all duration-300
                ${isSelected 
                  ? 'bg-ydea-50 dark:bg-ydea-500/10 border-ydea-500/50 shadow-md shadow-ydea-500/10' 
                  : 'bg-white dark:bg-white/5 border-slate-200 dark:border-white/5 hover:border-ydea-500/30 hover:bg-slate-50 dark:hover:bg-ydea-900/10'
                }
              `}
            >
              <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                <div>
                  <h4 className={`font-display font-semibold text-lg ${isSelected ? 'text-ydea-700 dark:text-white' : 'text-slate-800 dark:text-slate-200'}`}>
                    {module.name}
                  </h4>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mb-2">{module.description}</p>
                  <div className="inline-flex items-center px-2 py-1 rounded bg-slate-100 dark:bg-black/20 text-xs font-mono text-ydea-600 dark:text-ydea-400 border border-slate-200 dark:border-ydea-500/20">
                    € {module.price.toLocaleString('it-IT')} / licenza
                  </div>
                </div>
                
                <div className="flex items-center gap-3 bg-slate-100 dark:bg-black/40 p-1 rounded-lg border border-slate-200 dark:border-white/10 self-start md:self-center">
                  <button 
                    type="button"
                    onClick={() => handleQuantityChange(module.id, qty - 1)}
                    className="w-8 h-8 flex items-center justify-center rounded hover:bg-white dark:hover:bg-white/10 text-slate-500 dark:text-slate-300 transition"
                  >
                    -
                  </button>
                  <input 
                    type="number" 
                    min="0"
                    readOnly
                    className="w-10 text-center bg-transparent border-none text-slate-800 dark:text-white font-bold outline-none"
                    value={qty}
                  />
                  <button 
                    type="button"
                    onClick={() => handleQuantityChange(module.id, qty + 1)}
                    className="w-8 h-8 flex items-center justify-center rounded hover:bg-ydea-500 hover:text-white text-slate-500 dark:text-slate-300 transition"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Floating Action Bar */}
      <div className="sticky bottom-0 glass-panel border-t border-slate-200 dark:border-ydea-500/10 p-4 -mx-6 -mb-12 mt-8 flex flex-col md:flex-row justify-between items-center gap-4 backdrop-blur-2xl">
        <div className="text-slate-500 dark:text-slate-300 font-medium">
          Totale Stimato: <span className="text-2xl font-bold text-ydea-600 dark:text-ydea-400 ml-2">€ {totalCost.toLocaleString('it-IT')}</span>
        </div>
        
        <div className="flex gap-4 w-full md:w-auto">
          <button
            onClick={onBack}
            className="flex-1 md:flex-none px-6 py-2 rounded-lg font-medium border border-slate-300 dark:border-white/10 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5 transition"
          >
            Indietro
          </button>
          <button
            onClick={onNext}
            disabled={!isValid}
            className={`flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-2 rounded-lg font-bold transition-all shadow-lg ${
              isValid 
                ? 'bg-ydea-500 text-white hover:bg-ydea-400' 
                : 'bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-slate-600 cursor-not-allowed'
            }`}
          >
            Riepilogo <Icons.Next className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};