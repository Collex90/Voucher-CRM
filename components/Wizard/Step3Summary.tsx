import React from 'react';
import { PartnerInfo, SelectedModule } from '../../types';
import { Icons } from '../ui/Icons';

interface Props {
  data: PartnerInfo;
  modules: SelectedModule[];
  onBack: () => void;
  onSubmit: () => void;
  isSubmitting: boolean;
}

export const Step3Summary: React.FC<Props> = ({ data, modules, onBack, onSubmit, isSubmitting }) => {
  const totalCost = modules.reduce((acc, m) => acc + (m.price * m.quantity), 0);

  return (
    <div className="space-y-8 pb-8">
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="glass-panel p-5 rounded-xl border border-slate-200 dark:border-ydea-500/10">
          <h4 className="text-xs font-bold text-ydea-600 dark:text-ydea-500 uppercase tracking-widest mb-4 flex items-center gap-2">
            <Icons.User className="w-3 h-3" /> Dati Partner
          </h4>
          <div className="space-y-2">
            <div>
              <span className="text-slate-500 text-sm block">Ragione Sociale</span>
              <span className="text-slate-900 dark:text-white font-medium text-lg">{data.partnerName}</span>
            </div>
            <div>
              <span className="text-slate-500 text-sm block">Referente</span>
              <span className="text-slate-700 dark:text-slate-300">{data.contactName}</span>
            </div>
          </div>
        </div>

        <div className="glass-panel p-5 rounded-xl border border-slate-200 dark:border-ydea-500/10">
          <h4 className="text-xs font-bold text-ydea-600 dark:text-ydea-300 uppercase tracking-widest mb-4 flex items-center gap-2">
            <Icons.Company className="w-3 h-3" /> Dati Cliente
          </h4>
          <div className="space-y-2">
             <div>
              <span className="text-slate-500 text-sm block">Cliente Finale</span>
              <span className="text-slate-900 dark:text-white font-medium text-lg">{data.customerName}</span>
            </div>
            <div>
              <span className="text-slate-500 text-sm block">P.IVA / CF</span>
              <span className="text-slate-700 dark:text-slate-300 font-mono">{data.customerVat}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="glass-panel rounded-xl overflow-hidden border border-slate-200 dark:border-white/5">
        <div className="px-6 py-4 border-b border-slate-200 dark:border-white/5 bg-slate-50 dark:bg-white/5">
          <h4 className="font-display font-bold text-slate-800 dark:text-white">Configurazione Licenze</h4>
        </div>
        <table className="w-full text-sm text-left">
          <thead className="bg-slate-100 dark:bg-black/20 text-slate-500 dark:text-slate-400 font-medium uppercase text-xs tracking-wider">
            <tr>
              <th className="px-6 py-4">Modulo</th>
              <th className="px-6 py-4 text-center">Qty</th>
              <th className="px-6 py-4 text-right">Prezzo</th>
              <th className="px-6 py-4 text-right">Totale</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 dark:divide-white/5">
            {modules.map(m => (
              <tr key={m.id} className="hover:bg-slate-50 dark:hover:bg-white/5 transition">
                <td className="px-6 py-4 font-medium text-slate-800 dark:text-slate-200">{m.name}</td>
                <td className="px-6 py-4 text-center text-slate-600 dark:text-slate-400">{m.quantity}</td>
                <td className="px-6 py-4 text-right text-slate-600 dark:text-slate-400">€ {m.price.toLocaleString('it-IT')}</td>
                <td className="px-6 py-4 text-right font-medium text-ydea-600 dark:text-ydea-400">€ {(m.price * m.quantity).toLocaleString('it-IT')}</td>
              </tr>
            ))}
          </tbody>
          <tfoot className="bg-slate-100 dark:bg-ydea-900/20 font-bold text-slate-800 dark:text-white border-t border-slate-200 dark:border-ydea-500/20">
            <tr>
              <td colSpan={3} className="px-6 py-4 text-right">TOTALE FINALE</td>
              <td className="px-6 py-4 text-right text-xl text-ydea-600 dark:text-ydea-400 shadow-glow">€ {totalCost.toLocaleString('it-IT')}</td>
            </tr>
          </tfoot>
        </table>
      </div>

      <div className="flex flex-col md:flex-row justify-end gap-4 mt-8">
        <button
          onClick={onBack}
          disabled={isSubmitting}
          className="px-6 py-3 rounded-lg font-medium border border-slate-300 dark:border-white/10 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5 transition"
        >
          Modifica
        </button>
        <button
          onClick={onSubmit}
          disabled={isSubmitting}
          className="flex items-center justify-center gap-2 px-10 py-3 rounded-lg font-bold bg-ydea-500 text-white hover:bg-ydea-400 transition-all transform hover:-translate-y-1 disabled:opacity-70 disabled:transform-none shadow-lg shadow-ydea-500/20"
        >
          {isSubmitting ? (
            <span className="flex items-center gap-2">
              <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Trasmissione...
            </span>
          ) : (
            <>Conferma e Invia <Icons.Check className="w-4 h-4" /></>
          )}
        </button>
      </div>
    </div>
  );
};