"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Wallet, Loader2 } from "lucide-react";
import { useCreateWallet } from "@/hooks/use-wallet";
import { getCurrencyFlag } from "@/lib/currencies";

interface CreateWalletModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CURRENCIES = ['USD', 'IDR', 'EUR', 'GBP', 'JPY', 'SGD'];

export function CreateWalletModal({ isOpen, onClose }: CreateWalletModalProps) {
  const [ownerId, setOwnerId] = useState("");
  const [currency, setCurrency] = useState("USD");
  const createWallet = useCreateWallet();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ownerId) return;

    try {
      await createWallet.mutateAsync({ owner_id: ownerId, currency });
      onClose();
      setOwnerId("");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-background/80 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            className="relative w-full max-w-md bg-card border border-border rounded-2xl shadow-2xl overflow-hidden"
          >
            <div className="p-6 border-b border-border flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center border border-primary/20">
                  <Wallet className="w-4 h-4 text-primary" />
                </div>
                <h3 className="text-lg font-bold text-foreground">Create New Wallet</h3>
              </div>
              <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Owner ID</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. user-001"
                  value={ownerId}
                  onChange={(e) => setOwnerId(e.target.value)}
                  className="w-full bg-sidebar-accent/50 border border-border rounded-xl px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 transition-colors"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Currency</label>
                <div className="grid grid-cols-2 gap-2">
                  {CURRENCIES.map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setCurrency(c)}
                      className={`flex items-center justify-center gap-2 px-4 py-3 rounded-xl border transition-all ${currency === c
                        ? "bg-primary/10 border-primary text-primary shadow-[0_0_10px_rgba(0,240,255,0.1)]"
                        : "bg-sidebar-accent/30 border-border text-muted-foreground hover:bg-sidebar-accent/50"
                        }`}
                    >
                      <span className="text-lg">{getCurrencyFlag(c)}</span>
                      <span className="font-bold text-sm">{c}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={createWallet.isPending || !ownerId}
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold py-3.5 rounded-xl transition-all shadow-[0_0_15px_rgba(0,240,255,0.3)] disabled:opacity-50 disabled:shadow-none flex items-center justify-center gap-2"
                >
                  {createWallet.isPending ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      CREATING...
                    </>
                  ) : (
                    "CREATE WALLET"
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
