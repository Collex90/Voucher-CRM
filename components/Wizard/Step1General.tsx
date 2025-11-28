import React from 'react';
import { PartnerInfo } from '../../types';
import { Icons } from '../ui/Icons';

interface Props {
  data: PartnerInfo;
  updateData: (data: Partial<PartnerInfo>) => void;
  onNext: () => void;
}

export const Step1General: React.FC<Props> = ({ data, updateData, onNext }) => {
  const isValid = data.partnerName && data.contactName && data.customerName && data.customerVat;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isValid) onNext();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Partner Section */}
      <div className="glass-panel p-6 rounded-xl relative overflow-hidden group border-slate-200 dark:border-ydea-500/10 hover:border-ydea-500/30 transition-colors">
        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
           <Icons.User className="w-24 h-24 text-ydea-600 dark:text-ydea-500" />
        </div>
        
        <h4 className="text-lg font-display font-medium text-ydea-600 dark:text-ydea-400 mb-6 flex items-center gap-2">
          <Icons.User className="w-5 h-5" />
          Identificazione Partner
        </h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
          <div>
            <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-2 uppercase tracking-wider">Ragione Sociale Partner</label>
            <input
              type="text"
              required
              className="input-tech"
              placeholder="Es. Tech Solutions Srl"
              value={data.partnerName}
              onChange={e => updateData({ partnerName: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-2 uppercase tracking-wider">Nome Referente</label>
            <input
              type="text"
              required
              className="input-tech"
              placeholder="Es. Mario Rossi"
              value={data.contactName}
              onChange={e => updateData({ contactName: e.target.value })}
            />
          </div>
        </div>
      </div>

      {/* Customer Section */}
      <div className="glass-panel p-6 rounded-xl relative overflow-hidden group border-slate-200 dark:border-ydea-500/10 hover:border-ydea-500/30 transition-colors">
        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
           <Icons.Company className="w-24 h-24 text-ydea-400 dark:text-ydea-300" />
        </div>

        <h4 className="text-lg font-display font-medium text-ydea-600 dark:text-ydea-300 mb-6 flex items-center gap-2">
          <Icons.Company className="w-5 h-5" />
          Dati Cliente Finale
        </h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
          <div>
            <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-2 uppercase tracking-wider">Ragione Sociale Cliente</label>
            <input
              type="text"
              required
              className="input-tech"
              placeholder="Es. Azienda Cliente SpA"
              value={data.customerName}
              onChange={e => updateData({ customerName: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-2 uppercase tracking-wider">P.IVA / Codice Fiscale</label>
            <input
              type="text"
              required
              className="input-tech"
              placeholder="IT00000000000"
              value={data.customerVat}
              onChange={e => updateData({ customerVat: e.target.value })}
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end pt-4">
        <button
          type="submit"
          disabled={!isValid}
          className={`flex items-center gap-2 px-8 py-3 rounded-lg font-bold transition-all duration-300 transform ${
            isValid 
              ? 'bg-gradient-to-r from-ydea-600 to-ydea-500 text-white hover:scale-105 shadow-[0_0_20px_rgba(0,158,227,0.3)]' 
              : 'bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-slate-500 cursor-not-allowed border border-transparent dark:border-white/5'
          }`}
        >
          Prosegui <Icons.Next className="w-4 h-4" />
        </button>
      </div>
    </form>
  );
};