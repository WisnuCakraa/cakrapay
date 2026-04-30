"use client";

import { useState, useMemo } from "react";
import { Search, Plus, Wallet, AlertCircle, ShieldCheck, ShieldAlert, History } from "lucide-react";
import { useAllWallets, useAllTransactions, useUpdateWalletStatus } from "@/hooks/use-wallet";
import { cn, formatCurrency } from "@/lib/utils";
import { motion } from "framer-motion";
import { CreateWalletModal } from "@/components/features/CreateWalletModal";
import { ConfirmDialog } from "@/components/features/ConfirmDialog";

type FilterStatus = 'ALL' | 'ACTIVE' | 'SUSPENDED';

export default function AdminPanel() {
  const { data: wallets, isLoading: isWalletsLoading } = useAllWallets();
  const { data: allTransactions, isLoading: isTxLoading } = useAllTransactions();
  const updateStatus = useUpdateWalletStatus();

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<FilterStatus>('ALL');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [confirmData, setConfirmData] = useState<{ id: string; status: 'ACTIVE' | 'SUSPENDED' } | null>(null);

  const filteredWallets = useMemo(() => {
    if (!wallets) return [];
    return wallets.filter(w => {
      const matchesSearch = w.id.toLowerCase().includes(search.toLowerCase()) ||
        w.owner_id.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = statusFilter === 'ALL' || w.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [wallets, search, statusFilter]);

  const stats = useMemo(() => {
    if (!wallets) return { total: 0, suspended: 0 };
    return {
      total: wallets.length,
      suspended: wallets.filter(w => w.status === 'SUSPENDED').length
    };
  }, [wallets]);

  const handleToggleStatus = async () => {
    if (!confirmData) return;
    try {
      await updateStatus.mutateAsync({ id: confirmData.id, status: confirmData.status });
      setConfirmData(null);
    } catch (err) {
      console.error(err);
    }
  };

  if (isWalletsLoading) return <div className="p-8 text-muted-foreground animate-pulse">Loading admin panel...</div>;

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-20">

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground tracking-tight">System Admin</h1>
          <p className="text-muted-foreground mt-1">Manage network wallets and monitor global ledger activity.</p>
        </div>
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground font-bold px-6 py-3 rounded-xl text-sm transition-all shadow-[0_0_15px_rgba(0,240,255,0.3)] hover:scale-105 active:scale-95"
        >
          <Plus className="w-5 h-5" />
          NEW WALLET
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card border border-border rounded-2xl p-6 shadow-sm relative overflow-hidden group"
        >
          <div className="absolute top-0 right-0 p-6 opacity-5 pointer-events-none group-hover:opacity-10 transition-opacity">
            <Wallet className="w-24 h-24 text-primary" />
          </div>
          <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-2">Total Managed Wallets</p>
          <h3 className="text-4xl font-bold text-foreground tracking-tight">{stats.total}</h3>
          <p className="text-sm text-muted-foreground mt-2 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse inline-block" />
            Live network data
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-card border border-border rounded-2xl p-6 shadow-sm relative overflow-hidden group"
        >
          <div className="absolute top-0 right-0 p-6 opacity-5 pointer-events-none group-hover:opacity-10 transition-opacity">
            <AlertCircle className="w-24 h-24 text-destructive" />
          </div>
          <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-2">Suspended Accounts</p>
          <h3 className={cn("text-4xl font-bold tracking-tight", stats.suspended > 0 ? "text-destructive" : "text-foreground")}>
            {stats.suspended}
          </h3>
          <p className="text-sm text-muted-foreground mt-2">Requires manual review</p>
        </motion.div>
      </div>

      <div className="space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 px-2">
          <h2 className="text-xl font-bold text-foreground">User Registry</h2>
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
              <input
                type="text"
                placeholder="Search by ID or Owner..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="bg-sidebar-accent/50 border border-border rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-primary/50 transition-all w-64"
              />
            </div>
            <div className="flex bg-sidebar-accent/50 border border-border p-1 rounded-lg">
              {(['ALL', 'ACTIVE', 'SUSPENDED'] as FilterStatus[]).map((f) => (
                <button
                  key={f}
                  onClick={() => setStatusFilter(f)}
                  className={cn(
                    "px-4 py-1.5 rounded-md text-[10px] font-bold tracking-wider uppercase transition-all",
                    statusFilter === f ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left border-collapse">
              <thead className="text-[11px] text-muted-foreground font-semibold uppercase tracking-wider bg-sidebar-accent/30 border-b border-border">
                <tr>
                  <th className="px-6 py-4">Wallet ID / Owner</th>
                  <th className="px-6 py-4">Balance</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredWallets.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-12 text-center text-muted-foreground">No matching wallets found.</td>
                  </tr>
                ) : (
                  filteredWallets.map((w, idx) => (
                    <tr key={w.id} className="border-b border-border hover:bg-sidebar-accent/10 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="font-mono text-xs text-foreground mb-1 group-hover:text-primary transition-colors">{w.id}</div>
                        <div className="flex items-center gap-2 text-muted-foreground text-[10px] font-bold uppercase tracking-tighter">
                          <Plus className="w-3 h-3" /> {w.owner_id}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div>
                            <div className="font-bold text-foreground">
                              {formatCurrency(w.balance, w.currency)}
                            </div>
                            <div className="text-[10px] text-muted-foreground font-mono">{w.currency}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={cn(
                          "text-[10px] font-bold px-3 py-1 rounded-full border tracking-widest flex items-center gap-1.5 w-fit",
                          w.status === 'ACTIVE'
                            ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                            : "bg-destructive/10 text-destructive border-destructive/20"
                        )}>
                          {w.status === 'ACTIVE' ? <ShieldCheck className="w-3 h-3" /> : <ShieldAlert className="w-3 h-3" />}
                          {w.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => setConfirmData({
                            id: w.id,
                            status: w.status === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE'
                          })}
                          className={cn(
                            "text-[10px] font-bold px-4 py-2 rounded-lg transition-all border",
                            w.status === 'ACTIVE'
                              ? "text-destructive border-destructive/20 hover:bg-destructive/10"
                              : "text-emerald-500 border-emerald-500/20 hover:bg-emerald-500/10"
                          )}
                        >
                          {w.status === 'ACTIVE' ? "SUSPEND" : "ACTIVATE"}
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between px-2">
          <div className="flex items-center gap-2">
            <History className="w-5 h-5 text-primary" />
            <h2 className="text-xl font-bold text-foreground">Global Ledger Log</h2>
          </div>
        </div>

        <div className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden flex flex-col">
          <div className="overflow-x-auto overflow-y-auto max-h-[500px] custom-scrollbar">
            <table className="w-full text-sm text-left border-collapse">
              <thead className="text-[11px] text-muted-foreground font-semibold uppercase tracking-wider bg-sidebar-accent/30 sticky top-0 z-10 border-b border-border">
                <tr>
                  <th className="px-6 py-4 bg-sidebar-accent/30 backdrop-blur-md">Date</th>
                  <th className="px-6 py-4 bg-sidebar-accent/30 backdrop-blur-md">Wallet / Owner</th>
                  <th className="px-6 py-4 bg-sidebar-accent/30 backdrop-blur-md">Type</th>
                  <th className="px-6 py-4 text-right bg-sidebar-accent/30 backdrop-blur-md">Amount</th>
                </tr>
              </thead>
              <tbody>
                {isTxLoading ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-12 text-center text-muted-foreground animate-pulse">Fetching global ledger...</td>
                  </tr>
                ) : !allTransactions || allTransactions.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-12 text-center text-muted-foreground">No transactions found in system.</td>
                  </tr>
                ) : (
                  allTransactions.map((tx, idx) => (
                    <tr key={tx.id} className="border-b border-border hover:bg-sidebar-accent/5 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-foreground">
                          {new Date(tx.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        </div>
                        <div className="text-[10px] text-muted-foreground font-mono">
                          {new Date(tx.created_at).toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-[10px] font-mono text-muted-foreground truncate max-w-[120px]">{tx.id}</div>
                        <div className="text-[10px] font-bold text-foreground tracking-tighter uppercase">{tx.wallet?.owner_id || '—'}</div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={cn(
                          "text-[9px] font-black px-2 py-0.5 rounded border uppercase tracking-tighter",
                          tx.transaction_type === 'TOPUP' && "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
                          tx.transaction_type === 'TRANSFER_IN' && "bg-primary/10 text-primary border-primary/20",
                          tx.transaction_type === 'TRANSFER_OUT' && "bg-tertiary/10 text-tertiary border-tertiary/20",
                          tx.transaction_type === 'PAYMENT' && "bg-secondary/10 text-secondary border-secondary/20",
                        )}>
                          {tx.transaction_type?.replace('_', ' ')}
                        </span>
                      </td>
                      <td className={cn(
                        "px-6 py-4 text-right font-bold tabular-nums whitespace-nowrap",
                        Number(tx.amount) > 0 ? "text-emerald-500" : "text-rose-500"
                      )}>
                        <div className="flex items-center justify-end gap-1.5">
                          <span>
                            {Number(tx.amount) > 0 ? '+' : '-'}
                            {formatCurrency(Math.abs(Number(tx.amount)), tx.currency || 'USD')}
                          </span>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <CreateWalletModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />

      <ConfirmDialog
        isOpen={!!confirmData}
        title={confirmData?.status === 'SUSPENDED' ? "Suspend Wallet?" : "Activate Wallet?"}
        description={`Are you sure you want to ${confirmData?.status.toLowerCase()} this wallet? This will affect the user's ability to perform transactions.`}
        confirmLabel={confirmData?.status === 'SUSPENDED' ? "Suspend" : "Activate"}
        variant={confirmData?.status === 'SUSPENDED' ? 'danger' : 'primary'}
        isLoading={updateStatus.isPending}
        onConfirm={handleToggleStatus}
        onCancel={() => setConfirmData(null)}
      />

    </div>
  );
}
