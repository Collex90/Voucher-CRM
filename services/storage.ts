import { VoucherRequest, RequestStatus } from '../types';

const STORAGE_KEY = 'ydea_voucher_requests';

export const getRequests = (): VoucherRequest[] => {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
};

export const saveRequest = (request: VoucherRequest): void => {
  const current = getRequests();
  // Ensure we don't duplicate if editing (though editing isn't in scope, good practice)
  const existingIndex = current.findIndex(r => r.id === request.id);
  if (existingIndex >= 0) {
    current[existingIndex] = request;
  } else {
    current.push(request);
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(current));
};

export const updateRequestStatus = (id: string, status: RequestStatus, userId: string): void => {
  const requests = getRequests();
  const index = requests.findIndex(r => r.id === id);
  if (index !== -1) {
    requests[index].status = status;
    if (status === RequestStatus.APPROVED || status === RequestStatus.REJECTED) {
      requests[index].approvedBy = userId;
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(requests));
  }
};

export const getRequestStats = () => {
  const requests = getRequests();
  return {
    total: requests.length,
    pending: requests.filter(r => r.status === RequestStatus.PENDING).length,
    approved: requests.filter(r => r.status === RequestStatus.APPROVED).length,
    value: requests.reduce((acc, r) => acc + r.totalValue, 0)
  };
};