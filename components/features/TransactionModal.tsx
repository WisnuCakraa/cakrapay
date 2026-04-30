"use client";

import { useState, useEffect, useRef } from "react";
import { useAuthStore } from "@/store/use-auth-store";
import { useWallet, useAllWallets, useTransfer, useTopup, usePayment } from "@/hooks/use-wallet";
import { X, ArrowRight, Wallet as CheckCircle2, Loader2, ChevronDown, User, AlertCircle } from "lucide-react";
import { cn, formatCurrency } from "@/lib/utils";
import { getCurrencyFlag } from "@/lib/currencies";

type ModalType = 'transfer' | 'topup' | 'payment' | null;

interface TransactionModalProps {
  type: ModalType;
  onClose: () => void;
}

export function TransactionModal({ type, onClose }: TransactionModalProps) {
  const { walletId } = useAuthStore();
  const { data: wallet } = useWallet(walletId);
  const { data: allWallets } = useAllWallets();

  const transferMutation = useTransfer();
  const topupMutation = useTopup();
  const paymentMutation = usePayment();

  const [amount, setAmount] = useState<string>("");
  const [receiverId, setReceiverId] = useState<string>("");
  const [referenceId] = useState(() => (typeof crypto !== 'undefined' && type) ? crypto.randomUUID() : "");
  const [isSuccess, setIsSuccess] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!type || !wallet) return null;

  const isLoading = transferMutation.isPending || topupMutation.isPending || paymentMutation.isPending;
  const isError = transferMutation.isError || topupMutation.isError || paymentMutation.isError;
  const errorMsg = transferMutation.error?.message || topupMutation.error?.message || paymentMutation.error?.message;

  const handleMax = () => {
    setAmount(Number(wallet.balance).toString());
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const numAmount = Number(amount);
    if (!numAmount || numAmount <= 0) return;

    const onSuccess = () => {
      setIsSuccess(true);
      setTimeout(onClose, 2000);
    };

    if (type === 'transfer') {
      if (!receiverId) return;
      transferMutation.mutate({
        sender_id: wallet.id,
        receiver_id: receiverId,
        amount: numAmount,
        reference_id: referenceId
      }, { onSuccess });
    } else if (type === 'topup') {
      topupMutation.mutate({
        walletId: wallet.id,
        amount: numAmount,
        reference_id: referenceId
      }, { onSuccess });
    } else if (type === 'payment') {
      paymentMutation.mutate({
        walletId: wallet.id,
        amount: numAmount,
        reference_id: referenceId
      }, { onSuccess });
    }
  };

  const getTitle = () => {
    switch (type) {
      case 'transfer': return "Execute Transfer";
      case 'topup': return "Top Up Wallet";
      case 'payment': return "Make a Payment";
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
      <div className="bg-card border border-border w-full max-w-md rounded-2xl shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">

        <div className="p-6 border-b border-border flex items-center justify-between rounded-t-2xl bg-card">
          <h2 className="text-xl font-bold text-foreground">{getTitle()}</h2>
          <button onClick={onClose} className="p-2 hover:bg-sidebar-accent rounded-full transition-colors text-muted-foreground hover:text-foreground">
            <X className="w-5 h-5" />
          </button>
        </div>

        {isSuccess ? (
          <div className="p-12 flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center mb-6">
              <CheckCircle2 className="w-8 h-8 text-emerald-500" />
            </div>
            <h3 className="text-2xl font-bold text-foreground mb-2">Success!</h3>
            <p className="text-muted-foreground">Your transaction has been processed.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-6">

            <div className="space-y-2">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">From Wallet</label>
              <div className="flex items-center gap-3 p-3 bg-sidebar-accent/50 border border-border rounded-xl opacity-70">
                <div className="p-2 bg-background rounded-lg border border-border text-lg leading-none">
                  {getCurrencyFlag(wallet.currency)}
                </div>
                <div>
                  <div className="text-sm font-bold text-foreground">{wallet.currency} Wallet</div>
                  <div className="text-xs text-muted-foreground font-mono">{wallet.id.split('-')[0]}</div>
                </div>
                <div className="ml-auto text-right">
                  <div className="text-xs text-muted-foreground mb-0.5">Available</div>
                  <div className="text-sm font-bold text-foreground">{formatCurrency(wallet.balance, wallet.currency)}</div>
                </div>
              </div>
            </div>

            {type === 'transfer' && (
              <div className="space-y-2 relative" ref={dropdownRef}>
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">To Network Wallet</label>
                <div
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className={cn(
                    "w-full bg-background border rounded-xl px-4 py-3 text-sm flex items-center justify-between cursor-pointer transition-colors",
                    isDropdownOpen ? "border-primary ring-1 ring-primary" : "border-border hover:border-muted-foreground/50",
                    !receiverId && "text-muted-foreground"
                  )}
                >
                  {receiverId ? (
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-primary" />
                      <span className="font-semibold text-foreground">
                        {allWallets?.find(w => w.id === receiverId)?.owner_id}
                      </span>
                      <span className="text-xs font-mono text-muted-foreground bg-sidebar-accent/50 px-2 py-0.5 rounded">
                        {receiverId.split('-')[0]}
                      </span>
                    </div>
                  ) : (
                    "Select Recipient..."
                  )}
                  <ChevronDown className={cn("w-4 h-4 transition-transform duration-200", isDropdownOpen && "rotate-180 text-primary")} />
                </div>

                {isDropdownOpen && (
                  <div className="absolute top-[calc(100%+8px)] left-0 w-full bg-card border border-border rounded-xl shadow-xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-2">
                    <div className="max-h-60 overflow-y-auto p-2 space-y-1">
                      {allWallets?.filter(w => w.id !== wallet.id).map(w => {
                        const isMismatched = w.currency !== wallet.currency;
                        const isSelected = w.id === receiverId;
                        return (
                          <div
                            key={w.id}
                            onClick={() => {
                              if (!isMismatched) {
                                setReceiverId(w.id);
                                setIsDropdownOpen(false);
                              }
                            }}
                            className={cn(
                              "flex items-center justify-between p-3 rounded-lg transition-all duration-200",
                              isMismatched
                                ? "opacity-50 cursor-not-allowed bg-background/50"
                                : "cursor-pointer hover:bg-primary/10 hover:pl-4",
                              isSelected && !isMismatched ? "bg-primary/15 border-primary/30" : "border-transparent"
                            )}
                          >
                            <div className="flex items-center gap-3">
                              <div className={cn(
                                "w-8 h-8 rounded-full flex items-center justify-center text-lg shadow-inner",
                                isMismatched ? "bg-muted grayscale opacity-50" : "bg-secondary/20"
                              )}>
                                {getCurrencyFlag(w.currency)}
                              </div>
                              <div>
                                <div className={cn("text-sm font-bold", isMismatched ? "text-muted-foreground" : "text-foreground")}>
                                  {w.owner_id}
                                </div>
                                <div className="text-xs font-mono text-muted-foreground mt-0.5">
                                  {w.id.split('-')[0]} • {w.currency}
                                </div>
                              </div>
                            </div>

                            {isMismatched && (
                              <div className="flex items-center gap-1 text-[10px] uppercase font-bold tracking-wider text-destructive bg-destructive/10 px-2 py-1 rounded">
                                <AlertCircle className="w-3 h-3" />
                                Mismatch
                              </div>
                            )}
                          </div>
                        );
                      })}
                      {allWallets?.filter(w => w.id !== wallet.id).length === 0 && (
                        <div className="p-4 text-center text-sm text-muted-foreground">
                          No network wallets available.
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            <div className="space-y-2">
              <div className="flex justify-between items-end">
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Amount</label>
                {(type === 'transfer' || type === 'payment') && (
                  <button type="button" onClick={handleMax} className="text-[10px] font-bold text-primary hover:underline uppercase tracking-wider">Use Max</button>
                )}
              </div>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg font-bold text-muted-foreground">
                  {new Intl.NumberFormat('en-US', { style: 'currency', currency: wallet.currency }).format(0).replace(/\d|[,.]/g, '')}
                </span>
                <input
                  type="number"
                  step="0.01"
                  min="0.01"
                  max={type !== 'topup' ? Number(wallet.balance) : undefined}
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  required
                  placeholder="0.00"
                  className="w-full bg-background border border-border rounded-xl pl-10 pr-4 py-3 text-xl font-bold text-foreground focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-colors"
                />
              </div>
            </div>

            {isError && (
              <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg text-xs text-destructive font-medium">
                {errorMsg}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading || wallet.status === 'SUSPENDED'}
              className="w-full mt-4 bg-primary hover:bg-primary/90 text-primary-foreground font-bold py-3.5 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <ArrowRight className="w-5 h-5" />}
              {isLoading ? "Processing..." : "Confirm Transaction"}
            </button>

            {wallet.status === 'SUSPENDED' && (
              <p className="text-xs text-destructive text-center mt-2 font-medium">Your wallet is suspended. Transactions are disabled.</p>
            )}
          </form>
        )}
      </div>
    </div>
  );
}
