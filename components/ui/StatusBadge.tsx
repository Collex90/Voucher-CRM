import React from 'react';
import { RequestStatus } from '../../types';

export const StatusBadge: React.FC<{ status: RequestStatus }> = ({ status }) => {
  const styles = {
    [RequestStatus.DRAFT]: 'bg-slate-800 text-slate-400 border border-slate-700',
    [RequestStatus.PENDING]: 'bg-yellow-900/30 text-yellow-500 border border-yellow-500/30',
    [RequestStatus.APPROVED]: 'bg-green-900/30 text-green-400 border border-green-500/30 shadow-[0_0_10px_rgba(34,197,94,0.1)]',
    [RequestStatus.REJECTED]: 'bg-red-900/30 text-red-400 border border-red-500/30',
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-[10px] uppercase tracking-wider font-bold ${styles[status]}`}>
      {status}
    </span>
  );
};