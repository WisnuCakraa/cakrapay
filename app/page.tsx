"use client";

import { useAuthStore } from "@/store/use-auth-store";
import { useWallet, useTransactions, useUserWallets } from "@/hooks/use-wallet";
import { AlertCircle, Plus, CreditCard, Send, Wallet } from "lucide-react";
import { cn } from "@/lib/utils";
import { getCurrencyFlag } from "@/lib/currencies";
import { useState } from "react";
import { TransactionModal } from "@/components/features/TransactionModal";
import { AnimatedCounter } from "@/components/features/AnimatedCounter";
import { PortfolioList } from "@/components/features/PortfolioList";
import { RecentTransactions } from "@/components/features/RecentTransactions";
import { motion, Variants } from "framer-motion";

type ModalType = 'transfer' | 'topup' | 'payment' | null;

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
};

export default function Dashboard() {
  const { ownerId, walletId } = useAuthStore();
  const { data: userWallets } = useUserWallets(ownerId);
  const { data: wallet, isLoading: isWalletLoading, error: walletError } = useWallet(walletId);
  const { data: transactions, isLoading: isTxLoading } = useTransactions(walletId);

  const [modalType, setModalType] = useState<ModalType>(null);

  if (isWalletLoading) return <div className="p-8 text-muted-foreground animate-pulse">Loading dashboard...</div>;
  if (walletError || !wallet) return <div className="p-8 text-destructive flex items-center gap-2"><AlertCircle /> Error loading wallet data</div>;

  const isSuspended = wallet.status === "SUSPENDED";

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="max-w-6xl mx-auto space-y-6 pb-12"
    >

      <motion.div variants={itemVariants} className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground tracking-tight">Overview</h1>
          <p className="text-muted-foreground mt-1">
            Welcome back. Your active wallet status is <span className={cn("font-medium", isSuspended ? "text-destructive" : "text-primary")}>{wallet.status.toLowerCase()}</span>.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => setModalType('topup')} className="flex items-center gap-2 bg-sidebar-accent/50 hover:bg-sidebar-accent border border-border px-4 py-2.5 rounded-lg text-sm font-medium text-foreground transition-all hover:scale-105 active:scale-95">
            <Plus className="w-4 h-4 text-muted-foreground" /> Top Up
          </button>
          <button onClick={() => setModalType('payment')} className="flex items-center gap-2 bg-sidebar-accent/50 hover:bg-sidebar-accent border border-border px-4 py-2.5 rounded-lg text-sm font-medium text-foreground transition-all hover:scale-105 active:scale-95">
            <CreditCard className="w-4 h-4 text-muted-foreground" /> Pay
          </button>
          <button onClick={() => setModalType('transfer')} className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground font-bold px-4 py-2.5 rounded-lg text-sm transition-all shadow-[0_0_10px_rgba(0,240,255,0.3)] hover:scale-105 active:scale-95">
            <Send className="w-4 h-4" /> Transfer
          </button>
        </div>
      </motion.div>

      {isSuspended && (
        <motion.div variants={itemVariants} className="bg-destructive/10 border border-destructive/20 rounded-xl p-4 flex gap-4 items-start">
          <AlertCircle className="w-5 h-5 text-destructive shrink-0 mt-0.5" />
          <div>
            <h3 className="text-destructive font-semibold">Account Suspended</h3>
            <p className="text-destructive/80 text-sm mt-1">
              Your active wallet is currently suspended. Outgoing transfers and payments are disabled.
            </p>
          </div>
        </motion.div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        <motion.div variants={itemVariants} className="lg:col-span-2 bg-card border border-border rounded-2xl p-6 relative overflow-hidden shadow-sm hover:shadow-md transition-shadow group">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none group-hover:bg-primary/10 transition-colors"></div>

          <div className="flex justify-between items-start mb-8 relative z-10">
            <div>
              <p className="text-xs font-semibold tracking-wider text-muted-foreground uppercase mb-1">
                Available Balance {getCurrencyFlag(wallet.currency)}
              </p>
              <div className="flex items-baseline gap-1">
                <span className="text-5xl font-bold text-primary tracking-tight">
                  <AnimatedCounter value={Number(wallet.balance || 0)} currency={wallet.currency} />
                </span>
              </div>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center border border-primary/20 shadow-[0_0_15px_rgba(0,240,255,0.15)] group-hover:rotate-12 transition-transform">
              <Wallet className="w-6 h-6 text-primary" />
            </div>
          </div>

          <div className="flex items-center gap-8 relative z-10">
            <div>
              <p className="text-xs text-muted-foreground mb-1">Wallet ID</p>
              <p className="text-sm font-medium text-foreground font-mono">{wallet.id}</p>
            </div>
          </div>
        </motion.div>

        <motion.div variants={itemVariants}>
          <PortfolioList wallets={userWallets} />
        </motion.div>
      </div>

      <motion.div variants={itemVariants}>
        <RecentTransactions
          transactions={transactions}
          isLoading={isTxLoading}
          currency={wallet.currency}
        />
      </motion.div>

      <TransactionModal key={modalType || 'closed'} type={modalType} onClose={() => setModalType(null)} />
    </motion.div>
  );
}
