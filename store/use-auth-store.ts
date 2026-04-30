import { create } from 'zustand';

interface AuthState {
  ownerId: string;
  walletId: string | null;
  setOwnerId: (id: string) => void;
  setWalletId: (id: string | null) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  ownerId: 'user-001',
  walletId: 'f36db4fd-a7f3-4d6a-966c-235f2773f49d',
  setOwnerId: (id) => set({ ownerId: id }),
  setWalletId: (id) => set({ walletId: id }),
}));
