import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { walletService } from "@/services/wallet.service";

export function useWallet(walletId: string | null) {
  return useQuery({
    queryKey: ['wallet', walletId],
    queryFn: () => walletService.getWallet(walletId!),
    enabled: !!walletId,
  });
}

export function useUserWallets(ownerId: string) {
  return useQuery({
    queryKey: ['user-wallets', ownerId],
    queryFn: () => walletService.getWalletsByUser(ownerId),
    enabled: !!ownerId,
  });
}

export function useAllWallets() {
  return useQuery({
    queryKey: ['all-wallets'],
    queryFn: () => walletService.getAllWallets(),
  });
}

export function useTransactions(walletId?: string | null) {
  return useQuery({
    queryKey: ['transactions', walletId],
    queryFn: () => walletService.getTransactions(walletId!),
    enabled: !!walletId,
  });
}

export function useAllTransactions() {
  return useQuery({
    queryKey: ['all-transactions'],
    queryFn: () => walletService.getAllLedgers(),
  });
}

export function useTransfer() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: walletService.transfer,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wallet'] });
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      queryClient.invalidateQueries({ queryKey: ['user-wallets'] });
    },
  });
}

export function useTopup() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: { walletId: string; amount: number; reference_id: string }) => 
      walletService.topup(data.walletId, { amount: data.amount, reference_id: data.reference_id }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wallet'] });
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      queryClient.invalidateQueries({ queryKey: ['user-wallets'] });
    },
  });
}

export function usePayment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: { walletId: string; amount: number; reference_id: string }) => 
      walletService.payment(data.walletId, { amount: data.amount, reference_id: data.reference_id }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wallet'] });
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      queryClient.invalidateQueries({ queryKey: ['user-wallets'] });
    },
  });
}

export function useCreateWallet() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: walletService.createWallet,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['all-wallets'] });
    },
  });
}

export function useUpdateWalletStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: 'ACTIVE' | 'SUSPENDED' }) =>
      walletService.updateWalletStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['all-wallets'] });
    },
  });
}

