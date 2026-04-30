"use client";

import { useMemo } from "react";
import { Activity } from "lucide-react";
import { cn } from "@/lib/utils";
import { getCurrencyFlag } from "@/lib/currencies";
import { AnimatedCounter } from "./AnimatedCounter";
import { motion } from "framer-motion";

interface Wallet {
  id: string;
  currency: string;
  balance: number | string;
}

interface PortfolioListProps {
  wallets?: Wallet[];
}

export function PortfolioList({ wallets }: PortfolioListProps) {
  const totalValue = useMemo(() => {
    return wallets?.reduce((acc, w) => acc + Number(w.balance), 0) || 0;
  }, [wallets]);

  return (
    <div className="bg-card border border-border rounded-2xl p-6 shadow-sm flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-bold text-foreground">My Portfolio</h2>
        <Activity className="w-5 h-5 text-muted-foreground" />
      </div>

      <div className="space-y-4 overflow-y-auto pr-1 max-h-40">
        {wallets?.map((w, index) => {
          const share = totalValue > 0 ? (Number(w.balance) / totalValue) * 100 : 0;
          return (
            <motion.div
              key={w.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="space-y-2 p-1"
            >
              <div className="flex justify-between items-end">
                <div>
                  <p className="text-sm font-bold text-foreground">
                    {getCurrencyFlag(w.currency)} {w.currency} Wallet
                  </p>
                  <p className="text-xs text-muted-foreground font-mono">{w.id.split('-')[0]}</p>
                </div>
                <p className="text-sm font-bold text-foreground">
                  <AnimatedCounter value={Number(w.balance)} currency={w.currency} />
                </p>
              </div>
              <div className="w-full h-1.5 bg-sidebar-accent rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${share}%` }}
                  transition={{ duration: 1.5, ease: "easeOut", delay: 0.5 }}
                  className={cn(
                    "h-full rounded-full",
                    w.currency === 'USD' ? 'bg-primary shadow-[0_0_8px_rgba(0,240,255,0.5)]' :
                      w.currency === 'EUR' ? 'bg-secondary' : 'bg-tertiary'
                  )}
                />
              </div>
            </motion.div>
          );
        })}
        {!wallets?.length && (
          <p className="text-sm text-muted-foreground text-center py-8">No wallets found.</p>
        )}
      </div>
    </div>
  );
}
