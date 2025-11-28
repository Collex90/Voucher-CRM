import React, { useState } from 'react';
import { Step1General } from './Step1General';
import { Step2Modules } from './Step2Modules';
import { Step3Summary } from './Step3Summary';
import { PartnerInfo, SelectedModule, VoucherRequest, RequestStatus } from '../../types';
import { api } from '../../services/api';
import { Icons } from '../ui/Icons';

export const RequestWizard: React.FC = () => {
  const [step, setStep] = useState(1);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [partnerInfo, setPartnerInfo] = useState<PartnerInfo>({
    partnerName: '',
    contactName: '',
    customerName: '',
    customerVat: ''
  });
  
  const [modules, setModules] = useState<SelectedModule[]>([]);

  const handleUpdatePartner = (data: Partial<PartnerInfo>) => {
    setPartnerInfo(prev => ({ ...prev, ...data }));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setError(null);
    
    try {
      const newRequest: VoucherRequest = {
        id: crypto.randomUUID(),
        submissionDate: new Date().toISOString(),
        status: RequestStatus.PENDING,
        partnerInfo,
        modules,
        totalValue: modules.reduce((acc, m) => acc + (m.price * m.quantity), 0)
      };

      await api.createRequest(newRequest);
      setIsSubmitted(true);
    } catch (err) {
      console.error(err);
      setError("Si è verificato un errore durante l'invio. Riprova.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNewRequest = () => {
    setStep(1);
    setPartnerInfo({
      partnerName: '',
      contactName: '',
      customerName: '',
      customerVat: ''
    });
    setModules([]);
    setIsSubmitted(false);
    setError(null);
  };

  // --- Success View ---
  if (isSubmitted) {
    return (
      <div className="flex-grow flex items-center justify-center p-4">
        <div className="max-w-lg w-full glass-panel p-10 rounded-2xl text-center animate-slide-up relative overflow-hidden border-ydea-500/30">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-ydea-600 to-ydea-400"></div>
          
          <div className="w-20 h-20 bg-ydea-500/10 rounded-full flex items-center justify-center mx-auto mb-6 ring-1 ring-ydea-500/50 shadow-[0_0_30px_rgba(0,158,227,0.2)]">
            <Icons.Check className="w-10 h-10 text-ydea-500 dark:text-ydea-400" />
          </div>
          
          <h2 className="text-3xl font-display font-bold text-slate-800 dark:text-white mb-2">Richiesta Trasmessa</h2>
          <p className="text-slate-600 dark:text-slate-400 mb-8 font-light">
            Il sistema ha preso in carico la tua richiesta. Il protocollo di approvazione è stato avviato.
          </p>
          
          <button 
            onClick={handleNewRequest}
            className="w-full py-3 bg-ydea-500 hover:bg-ydea-400 rounded-lg font-bold text-white transition-all shadow-lg shadow-ydea-500/20"
          >
            Nuova Richiesta
          </button>
        </div>
      </div>
    );
  }

  // --- Split Screen Layout ---
  return (
    <div className="flex-grow flex flex-col lg:flex-row h-[calc(100vh-80px)] overflow-hidden">
      
      {/* Left Panel: Visual & Progress */}
      <div className="lg:w-2/5 relative hidden lg:flex flex-col justify-between p-12 border-r border-slate-200 dark:border-ydea-500/10 bg-white/50 dark:bg-space-950/50 backdrop-blur-sm transition-colors duration-300">
        {/* Background blobs for this panel specific */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-ydea-500/10 blur-[80px] rounded-full"></div>

        <div className="relative z-10">
           <h2 className="font-display text-4xl font-bold text-slate-900 dark:text-white mb-2 leading-tight">
             Crea la tua <br/>
             <span className="text-transparent bg-clip-text bg-gradient-to-r from-ydea-600 to-ydea-400">Soluzione Digitale</span>
           </h2>
           <p className="text-slate-600 dark:text-slate-400 font-light mt-4 max-w-sm">
             Segui il wizard guidato per configurare il pacchetto software ideale per il tuo cliente.
           </p>
        </div>

        {/* Vertical Progress */}
        <div className="relative z-10 space-y-8">
          {[1, 2, 3].map((s) => {
            const isActive = step === s;
            const isCompleted = step > s;
            
            return (
              <div key={s} className={`flex items-center gap-4 group transition-all duration-500 ${step === s ? 'translate-x-4' : ''}`}>
                <div className={`
                  w-12 h-12 rounded-xl flex items-center justify-center font-display font-bold text-lg border transition-all duration-300
                  ${isActive 
                    ? 'bg-ydea-500 border-transparent text-white shadow-lg shadow-ydea-500/30' 
                    : isCompleted 
                      ? 'bg-ydea-500/10 border-ydea-500/30 text-ydea-600 dark:text-ydea-500'
                      : 'bg-white dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-400 dark:text-slate-500'
                  }
                `}>
                  {isCompleted ? <Icons.Check className="w-6 h-6" /> : s}
                </div>
                <div className="flex flex-col">
                  <span className={`text-sm font-bold uppercase tracking-wider transition-colors duration-300 ${isActive ? 'text-slate-800 dark:text-white' : 'text-slate-400 dark:text-slate-500'}`}>
                    Step 0{s}
                  </span>
                  <span className={`text-lg font-display transition-colors duration-300 ${isActive ? 'text-slate-600 dark:text-slate-200' : 'text-slate-400 dark:text-slate-600'}`}>
                    {s === 1 ? 'Dati Generali' : s === 2 ? 'Selezione Moduli' : 'Riepilogo e Invio'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        <div className="relative z-10 text-xs text-slate-400 dark:text-slate-600 font-mono">
          SYSTEM_ID: VOUCHER-CRM-V2.0 // YDEA
        </div>
      </div>

      {/* Right Panel: Form Area */}
      <div className="flex-1 overflow-y-auto relative bg-slate-50 dark:bg-space-950 transition-colors duration-300">
         {/* Mobile Progress Bar (visible only on small screens) */}
         <div className="lg:hidden p-4 border-b border-slate-200 dark:border-white/10 flex justify-between items-center bg-white dark:bg-space-900">
            <span className="text-slate-900 dark:text-white font-display font-bold">Step {step}/3</span>
            <div className="flex gap-1">
              {[1,2,3].map(s => (
                <div key={s} className={`h-1 w-8 rounded-full ${step >= s ? 'bg-ydea-500' : 'bg-slate-200 dark:bg-slate-700'}`}></div>
              ))}
            </div>
         </div>

         <div className="max-w-3xl mx-auto p-6 lg:p-12 pb-24">
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-200 px-4 py-3 rounded-lg mb-6 flex items-center gap-3 animate-fade-in">
                <Icons.X className="w-5 h-5" />
                <span>{error}</span>
              </div>
            )}

            {step === 1 && (
              <div className="animate-fade-in">
                <h3 className="text-2xl font-display font-semibold text-slate-900 dark:text-white mb-6 border-l-4 border-ydea-500 pl-4">Dettagli Anagrafica</h3>
                <Step1General 
                  data={partnerInfo} 
                  updateData={handleUpdatePartner} 
                  onNext={() => setStep(2)} 
                />
              </div>
            )}
            
            {step === 2 && (
              <div className="animate-fade-in">
                 <h3 className="text-2xl font-display font-semibold text-slate-900 dark:text-white mb-6 border-l-4 border-ydea-500 pl-4">Configurazione Software</h3>
                 <Step2Modules 
                  selectedModules={modules}
                  updateModules={setModules}
                  onNext={() => setStep(3)}
                  onBack={() => setStep(1)}
                />
              </div>
            )}

            {step === 3 && (
              <div className="animate-fade-in">
                <h3 className="text-2xl font-display font-semibold text-slate-900 dark:text-white mb-6 border-l-4 border-ydea-500 pl-4">Conferma Finale</h3>
                <Step3Summary
                  data={partnerInfo}
                  modules={modules}
                  onBack={() => setStep(2)}
                  onSubmit={handleSubmit}
                  isSubmitting={isSubmitting}
                />
              </div>
            )}
         </div>
      </div>
    </div>
  );
};