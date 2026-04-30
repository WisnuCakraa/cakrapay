"use client";

import { ArrowDownLeft, ArrowUpRight } from "lucide-react";
import { cn, formatCurrency } from "@/lib/utils";
import { motion } from "framer-motion";

interface Transaction {
  id: string;
  amount: number | string;
  transaction_type: string;
  created_at: string;
  status?: string;
}

interface RecentTransactionsProps {
  transactions?: Transaction[];
  isLoading?: boolean;
  currency?: string;
}

export function RecentTransactions({ transactions, isLoading, currency = 'USD' }: RecentTransactionsProps) {
  return (
    <div className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden flex flex-col h-full">
      <div className="p-6 border-b border-border flex items-center justify-between">
        <h2 className="text-lg font-bold text-foreground">Recent Transactions</h2>
      </div>

      <div className="overflow-x-auto overflow-y-auto max-h-[550px] custom-scrollbar">
        <table className="w-full text-sm text-left border-collapse">
          <thead className="text-[11px] text-muted-foreground font-semibold uppercase tracking-wider bg-sidebar-accent/30 sticky top-0 z-10 border-b border-border">
            <tr>
              <th className="px-6 py-4 bg-sidebar-accent/30 backdrop-blur-md">Date</th>
              <th className="px-6 py-4 bg-sidebar-accent/30 backdrop-blur-md">Type</th>
              <th className="px-6 py-4 text-right bg-sidebar-accent/30 backdrop-blur-md">Amount</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={3} className="px-6 py-12 text-center text-muted-foreground">
                  <div className="flex items-center justify-center gap-2">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                      className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full"
                    />
                    Loading transactions...
                  </div>
                </td>
              </tr>
            ) : !transactions || transactions.length === 0 ? (
              <tr>
                <td colSpan={3} className="px-6 py-12 text-center text-muted-foreground">No recent transactions found.</td>
              </tr>
            ) : (
              transactions.map((tx, index) => (
                <motion.tr
                  key={tx.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="border-b border-border hover:bg-sidebar-accent/10 transition-colors group"
                >
                  <td className="px-6 py-4 text-foreground whitespace-nowrap">
                    {new Date(tx.created_at || new Date()).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      {Number(tx.amount) > 0 ? (
                        <ArrowDownLeft className="w-4 h-4 text-emerald-500 group-hover:scale-110 transition-transform" />
                      ) : (
                        <ArrowUpRight className="w-4 h-4 text-rose-500 group-hover:scale-110 transition-transform" />
                      )}
                      <span className={cn(
                        "text-[10px] font-bold px-2 py-0.5 rounded border uppercase tracking-tighter whitespace-nowrap",
                        tx.transaction_type === 'TOPUP' && "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
                        tx.transaction_type === 'TRANSFER_IN' && "bg-primary/10 text-primary border-primary/20",
                        tx.transaction_type === 'TRANSFER_OUT' && "bg-tertiary/10 text-tertiary border-tertiary/20",
                        tx.transaction_type === 'PAYMENT' && "bg-secondary/10 text-secondary border-secondary/20",
                        !tx.transaction_type && "bg-muted text-muted-foreground border-border"
                      )}>
                        {tx.transaction_type?.replace('_', ' ') || 'TRANSACTION'}
                      </span>
                    </div>
                  </td>
                  <td className={cn(
                    "px-6 py-4 text-right font-bold tracking-tight whitespace-nowrap",
                    Number(tx.amount) > 0 ? "text-emerald-500" : "text-rose-500"
                  )}>
                    {Number(tx.amount) > 0 ? '+' : '-'}
                    {formatCurrency(Math.abs(Number(tx.amount)), currency)}
                  </td>
                </motion.tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
