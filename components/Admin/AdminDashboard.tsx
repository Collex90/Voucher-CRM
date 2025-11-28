import React, { useEffect, useState } from 'react';
import { User, VoucherRequest, RequestStatus } from '../../types';
import { api } from '../../services/api';
import { Icons } from '../ui/Icons';
import { StatusBadge } from '../ui/StatusBadge';

interface Props {
  user: User;
  onLogout: () => void;
}

const RequestDetailModal: React.FC<{ 
  request: VoucherRequest | null, 
  onClose: () => void,
  onApprove: () => void,
  onReject: () => void,
  isProcessing: boolean
}> = ({ request, onClose, onApprove, onReject, isProcessing }) => {
  if (!request) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/50 dark:bg-space-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="glass-panel border border-slate-200 dark:border-ydea-500/20 rounded-2xl shadow-2xl dark:shadow-[0_0_50px_rgba(0,0,0,0.5)] max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-fade-in">
        <div className="p-6 border-b border-slate-200 dark:border-white/10 flex justify-between items-center sticky top-0 bg-white/90 dark:bg-space-900/90 backdrop-blur-md z-10">
          <div>
             <h3 className="text-xl font-display font-bold text-slate-900 dark:text-white">Dettaglio Richiesta</h3>
             <p className="text-sm text-slate-500 dark:text-slate-400 font-mono mt-1">ID: {request.id.slice(0, 8)}</p>
          </div>
          <button onClick={onClose} disabled={isProcessing} className="text-slate-400 hover:text-slate-900 dark:hover:text-white transition">
            <Icons.X className="w-6 h-6"/>
          </button>
        </div>
        
        <div className="p-6 space-y-8">
           <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-50 dark:bg-white/5 p-4 rounded-lg border border-slate-200 dark:border-white/5">
                <p className="text-xs font-bold text-ydea-600 dark:text-ydea-500 uppercase mb-2">Partner</p>
                <p className="font-medium text-slate-900 dark:text-white text-lg">{request.partnerInfo.partnerName}</p>
                <p className="text-sm text-slate-500 dark:text-slate-400">{request.partnerInfo.contactName}</p>
              </div>
              <div className="bg-slate-50 dark:bg-white/5 p-4 rounded-lg border border-slate-200 dark:border-white/5">
                <p className="text-xs font-bold text-ydea-500 dark:text-ydea-300 uppercase mb-2">Cliente</p>
                <p className="font-medium text-slate-900 dark:text-white text-lg">{request.partnerInfo.customerName}</p>
                <p className="text-sm text-slate-500 dark:text-slate-400 font-mono">{request.partnerInfo.customerVat}</p>
              </div>
           </div>

           <div>
             <h4 className="font-bold text-slate-900 dark:text-white mb-4 border-b border-slate-200 dark:border-white/10 pb-2">Configurazione</h4>
             <ul className="space-y-3">
               {request.modules.map(m => (
                 <li key={m.id} className="flex justify-between items-center bg-slate-50 dark:bg-black/20 p-3 rounded border border-slate-200 dark:border-white/5">
                    <div>
                      <p className="font-medium text-slate-700 dark:text-slate-200">{m.name}</p>
                    </div>
                    <div className="text-right flex items-center gap-4">
                      <span className="text-sm font-mono text-slate-500 dark:text-slate-400">x{m.quantity}</span>
                      <span className="text-sm font-bold text-ydea-600 dark:text-ydea-400">€ {(m.price * m.quantity).toLocaleString('it-IT')}</span>
                    </div>
                 </li>
               ))}
             </ul>
             <div className="mt-4 pt-4 flex justify-between items-center">
                <span className="font-bold text-slate-500 dark:text-slate-400">Totale Valore</span>
                <span className="font-display font-bold text-2xl text-slate-900 dark:text-white">€ {request.totalValue.toLocaleString('it-IT')}</span>
             </div>
           </div>
        </div>

        <div className="p-6 border-t border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-black/20 flex justify-end gap-3 sticky bottom-0 backdrop-blur-xl">
          {request.status === RequestStatus.PENDING && (
            <>
              <button 
                onClick={onReject} 
                disabled={isProcessing}
                className="px-4 py-2 border border-red-500/30 text-red-600 dark:text-red-400 hover:bg-red-500/10 rounded-lg font-medium flex items-center gap-2 disabled:opacity-50 transition"
              >
                {isProcessing ? '...' : <><Icons.X className="w-4 h-4"/> Rifiuta</>}
              </button>
              <button 
                onClick={onApprove} 
                disabled={isProcessing}
                className="px-6 py-2 bg-green-600 text-white hover:bg-green-500 rounded-lg font-bold flex items-center gap-2 shadow-lg shadow-green-900/50 disabled:opacity-50 transition"
              >
                {isProcessing ? 'Elaborazione...' : <><Icons.Check className="w-4 h-4"/> Approva</>}
              </button>
            </>
          )}
           {request.status !== RequestStatus.PENDING && (
             <span className="text-slate-500 italic flex items-center gap-2 px-4 py-2">
               Richiesta già processata ({request.status})
             </span>
           )}
        </div>
      </div>
    </div>
  );
};

export const AdminDashboard: React.FC<Props> = ({ user, onLogout }) => {
  const [requests, setRequests] = useState<VoucherRequest[]>([]);
  const [stats, setStats] = useState({ total: 0, pending: 0, approved: 0, value: 0 });
  const [selectedRequest, setSelectedRequest] = useState<VoucherRequest | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const data = await api.getRequests();
      setRequests(data);
      const statsData = await api.getStats();
      setStats(statsData);
    } catch (error) {
      console.error("Failed to load data", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleStatusChange = async (id: string, status: RequestStatus) => {
    setIsProcessing(true);
    try {
      await api.updateStatus(id, status, user.id);
      await loadData();
      setSelectedRequest(null);
    } catch (err) {
      console.error("Error updating status", err);
      alert("Errore nell'aggiornamento dello stato.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="animate-fade-in pb-12">
      <div className="flex justify-between items-center mb-10">
        <div>
           <h2 className="text-3xl font-display font-bold text-slate-900 dark:text-white">Dashboard Operativa</h2>
           <p className="text-slate-500 dark:text-slate-400">Bentornato, <span className="text-ydea-600 dark:text-ydea-400">{user.name}</span></p>
        </div>
        <div className="flex gap-3">
           <button onClick={loadData} className="text-ydea-600 dark:text-ydea-500 hover:bg-ydea-500/10 px-4 py-2 rounded-lg transition flex items-center gap-2 text-sm font-medium border border-ydea-500/20">
             <Icons.Pending className="w-4 h-4"/> Sync
           </button>
           <button onClick={onLogout} className="text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-white/5 transition text-sm font-medium border border-transparent hover:border-slate-200 dark:hover:border-white/10">
             <Icons.Logout className="w-4 h-4" /> Logout
           </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
        <div className="glass-panel p-6 rounded-2xl relative overflow-hidden group border-slate-200 dark:border-ydea-500/10">
           <div className="absolute right-0 top-0 p-4 opacity-10 group-hover:scale-110 transition-transform"><Icons.Pending className="w-16 h-16 text-yellow-500"/></div>
           <div className="text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-widest mb-2">In Attesa</div>
           <div className="text-4xl font-display font-bold text-yellow-600 dark:text-yellow-500">{isLoading ? '-' : stats.pending}</div>
        </div>
        <div className="glass-panel p-6 rounded-2xl relative overflow-hidden group border-slate-200 dark:border-ydea-500/10">
           <div className="absolute right-0 top-0 p-4 opacity-10 group-hover:scale-110 transition-transform"><Icons.Check className="w-16 h-16 text-green-500"/></div>
           <div className="text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-widest mb-2">Approvate</div>
           <div className="text-4xl font-display font-bold text-green-600 dark:text-green-500">{isLoading ? '-' : stats.approved}</div>
        </div>
        <div className="glass-panel p-6 rounded-2xl relative overflow-hidden group border-slate-200 dark:border-ydea-500/10">
           <div className="absolute right-0 top-0 p-4 opacity-10 group-hover:scale-110 transition-transform"><Icons.File className="w-16 h-16 text-slate-800 dark:text-white"/></div>
           <div className="text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-widest mb-2">Totali</div>
           <div className="text-4xl font-display font-bold text-slate-800 dark:text-white">{isLoading ? '-' : stats.total}</div>
        </div>
        <div className="glass-panel p-6 rounded-2xl relative overflow-hidden group border-slate-200 dark:border-ydea-500/30">
           <div className="absolute inset-0 bg-gradient-to-r from-ydea-500/10 to-transparent"></div>
           <div className="text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-widest mb-2 relative z-10">Pipeline Value</div>
           <div className="text-4xl font-display font-bold text-transparent bg-clip-text bg-gradient-to-r from-ydea-600 to-ydea-400 dark:from-ydea-500 dark:to-ydea-300 relative z-10">
             € {isLoading ? '-' : (stats.value / 1000).toFixed(1)}k
           </div>
        </div>
      </div>

      {/* Table */}
      <div className="glass-panel rounded-2xl overflow-hidden border border-slate-200 dark:border-white/10">
        <div className="px-8 py-6 border-b border-slate-200 dark:border-white/5 flex justify-between items-center bg-slate-50 dark:bg-white/5">
          <h3 className="font-bold text-lg text-slate-900 dark:text-white">Log Richieste</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-500 dark:text-slate-400">
            <thead className="bg-slate-100 dark:bg-black/20 text-xs uppercase font-bold text-slate-500 tracking-wider">
              <tr>
                <th className="px-8 py-4">Stato</th>
                <th className="px-8 py-4">Data</th>
                <th className="px-8 py-4">Partner</th>
                <th className="px-8 py-4">Cliente</th>
                <th className="px-8 py-4 text-right">Valore</th>
                <th className="px-8 py-4 text-center">Azioni</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-white/5">
              {isLoading ? (
                <tr>
                   <td colSpan={6} className="px-8 py-20 text-center">
                     <div className="flex justify-center items-center gap-2">
                       <div className="w-2 h-2 bg-ydea-500 rounded-full animate-bounce"></div>
                       <div className="w-2 h-2 bg-ydea-500 rounded-full animate-bounce delay-75"></div>
                       <div className="w-2 h-2 bg-ydea-500 rounded-full animate-bounce delay-150"></div>
                     </div>
                   </td>
                </tr>
              ) : requests.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-8 py-12 text-center text-slate-500">
                    Nessuna richiesta presente nel database.
                  </td>
                </tr>
              ) : (
                requests.map(req => (
                  <tr key={req.id} className="hover:bg-slate-50 dark:hover:bg-white/5 transition">
                    <td className="px-8 py-4"><StatusBadge status={req.status} /></td>
                    <td className="px-8 py-4 font-mono text-xs">{new Date(req.submissionDate).toLocaleDateString('it-IT')}</td>
                    <td className="px-8 py-4 font-medium text-slate-900 dark:text-white">{req.partnerInfo.partnerName}</td>
                    <td className="px-8 py-4">{req.partnerInfo.customerName}</td>
                    <td className="px-8 py-4 text-right font-medium text-slate-700 dark:text-slate-300">€ {req.totalValue.toLocaleString('it-IT')}</td>
                    <td className="px-8 py-4 text-center">
                      <button 
                        onClick={() => setSelectedRequest(req)}
                        className="text-ydea-600 dark:text-ydea-400 hover:text-ydea-800 dark:hover:text-white font-bold text-xs border border-ydea-500/30 px-3 py-1.5 rounded hover:bg-ydea-500/10 transition uppercase tracking-wide"
                      >
                        Analizza
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <RequestDetailModal 
        request={selectedRequest}
        isProcessing={isProcessing}
        onClose={() => setSelectedRequest(null)}
        onApprove={() => selectedRequest && handleStatusChange(selectedRequest.id, RequestStatus.APPROVED)}
        onReject={() => selectedRequest && handleStatusChange(selectedRequest.id, RequestStatus.REJECTED)}
      />
    </div>
  );
};