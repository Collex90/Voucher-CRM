import { VoucherRequest, RequestStatus, User } from '../types';
import { db } from '../lib/firebase';
import { MOCK_USERS } from '../constants';
import { 
  collection, 
  getDocs, 
  setDoc, 
  doc, 
  updateDoc, 
  query, 
  orderBy 
} from 'firebase/firestore';

const STORAGE_KEY = 'ydea_voucher_requests';
const COLLECTION_NAME = 'requests';

// Helper to simulate delay for local storage to match network feel
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Helper to hash password client-side
const hashPassword = async (password: string): Promise<string> => {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
  return hashHex;
};

// --- DATA MAPPING ---
// Maps Firestore document data to App types
// Firestore stores dates as Timestamp objects usually, but we send ISO strings.
const mapFromDB = (data: any): VoucherRequest => ({
  id: data.id,
  submissionDate: data.submissionDate, 
  status: data.status as RequestStatus,
  partnerInfo: data.partnerInfo,
  modules: data.modules,
  totalValue: data.totalValue,
  approvedBy: data.approvedBy
});

export const api = {
  // --- AUTH ---
  login: async (username: string, password: string): Promise<User | null> => {
    await delay(500);
    
    // Calculate hash of input password
    const inputHash = await hashPassword(password);
    
    // Compare with stored hash
    const user = MOCK_USERS.find(u => u.username === username && u.passwordHash === inputHash);
    
    // Return user without the hash property
    if (user) {
      const { passwordHash, ...safeUser } = user;
      return safeUser;
    }
    
    return null;
  },

  // --- REQUESTS ---
  getRequests: async (): Promise<VoucherRequest[]> => {
    if (db) {
      try {
        const q = query(collection(db, COLLECTION_NAME), orderBy('submissionDate', 'desc'));
        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map(doc => mapFromDB(doc.data()));
      } catch (error) {
        console.error('Firebase error:', error);
        throw error;
      }
    } else {
      // Local Fallback
      await delay(500);
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    }
  },

  createRequest: async (request: VoucherRequest): Promise<void> => {
    if (db) {
      try {
        // Use setDoc with specific ID to match the UUID generated in frontend
        await setDoc(doc(db, COLLECTION_NAME, request.id), request);
      } catch (error) {
        console.error('Firebase error:', error);
        throw error;
      }
    } else {
      // Local Fallback
      await delay(800);
      const current = await api.getRequests();
      current.unshift(request); // Add to top
      localStorage.setItem(STORAGE_KEY, JSON.stringify(current));
    }
  },

  updateStatus: async (id: string, status: RequestStatus, userId: string): Promise<void> => {
    if (db) {
      try {
        const updates: any = { status };
        if (status === RequestStatus.APPROVED || status === RequestStatus.REJECTED) {
          updates.approvedBy = userId;
        }
        const requestRef = doc(db, COLLECTION_NAME, id);
        await updateDoc(requestRef, updates);
      } catch (error) {
        console.error('Firebase error:', error);
        throw error;
      }
    } else {
      // Local Fallback
      const current = await api.getRequests();
      const index = current.findIndex(r => r.id === id);
      if (index !== -1) {
        current[index].status = status;
        if (status === RequestStatus.APPROVED || status === RequestStatus.REJECTED) {
          current[index].approvedBy = userId;
        }
        localStorage.setItem(STORAGE_KEY, JSON.stringify(current));
      }
    }
  },

  getStats: async () => {
    const requests = await api.getRequests();
    return {
      total: requests.length,
      pending: requests.filter(r => r.status === RequestStatus.PENDING).length,
      approved: requests.filter(r => r.status === RequestStatus.APPROVED).length,
      value: requests.reduce((acc, r) => acc + r.totalValue, 0)
    };
  }
};