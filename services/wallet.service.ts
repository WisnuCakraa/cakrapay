export const API_BASE_URL = 'http://localhost:3000/api';

export interface Transaction {
  id: string;
  wallet_id?: string;
  amount: number;
  transaction_type: string;
  status?: string;
  created_at: string;
  reference_id: string;
  currency?: string;
  wallet?: {
    owner_id: string;
  };
}

export interface Wallet {
  id: string;
  owner_id: string;
  balance: number;
  currency: string;
  status: 'ACTIVE' | 'SUSPENDED';
}

export const walletService = {
  getWallet: async (walletId: string): Promise<Wallet> => {
    const res = await fetch(`${API_BASE_URL}/wallets/${walletId}`);
    if (!res.ok) throw new Error('Failed to fetch wallet');
    const json = await res.json();
    return json.data || json;
  },

  getAllWallets: async (): Promise<Wallet[]> => {
    const res = await fetch(`${API_BASE_URL}/wallets`);
    if (!res.ok) throw new Error('Failed to fetch all wallets');
    const json = await res.json();
    return json.data || json;
  },

  getAllLedgers: async (): Promise<Transaction[]> => {
    const res = await fetch(`${API_BASE_URL}/ledgers`);
    if (!res.ok) throw new Error('Failed to fetch all ledgers');
    const json = await res.json();
    return json.data || json;
  },

  getWalletsByUser: async (ownerId: string): Promise<Wallet[]> => {
    const res = await fetch(`${API_BASE_URL}/wallets/user/${ownerId}`);
    if (!res.ok) throw new Error('Failed to fetch user wallets');
    const json = await res.json();
    return json.data || json;
  },

  getTransactions: async (walletId: string): Promise<Transaction[]> => {
    const res = await fetch(`${API_BASE_URL}/wallets/${walletId}/transactions`);
    if (!res.ok) throw new Error('Failed to fetch transactions');
    const json = await res.json();
    return json.data || json;
  },

  transfer: async (data: { sender_id: string; receiver_id: string; amount: number; reference_id: string }) => {
    const res = await fetch(`${API_BASE_URL}/wallets/transfer`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Transfer failed');
    const json = await res.json();
    return json.data || json;
  },

  topup: async (walletId: string, data: { amount: number; reference_id: string }) => {
    const res = await fetch(`${API_BASE_URL}/wallets/${walletId}/topup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Topup failed');
    const json = await res.json();
    return json.data || json;
  },

  payment: async (walletId: string, data: { amount: number; reference_id: string }) => {
    const res = await fetch(`${API_BASE_URL}/wallets/${walletId}/payment`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Payment failed');
    const json = await res.json();
    return json.data || json;
  },

  createWallet: async (data: { owner_id: string; currency: string }): Promise<Wallet> => {
    const res = await fetch(`${API_BASE_URL}/wallets`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || 'Failed to create wallet');
    }
    const json = await res.json();
    return json.data || json;
  },

  updateWalletStatus: async (id: string, status: 'ACTIVE' | 'SUSPENDED'): Promise<Wallet> => {
    const res = await fetch(`${API_BASE_URL}/wallets/${id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    if (!res.ok) throw new Error('Failed to update wallet status');
    const json = await res.json();
    return json.data || json;
  }
};
