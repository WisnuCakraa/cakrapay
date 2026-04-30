"use client";

import { useAuthStore } from "@/store/use-auth-store";
import { useUserWallets, useAllWallets } from "@/hooks/use-wallet";
import { useState, useRef, useEffect, useMemo } from "react";
import { ChevronDown, Wallet as WalletIcon, User } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { getCurrencyFlag } from "@/lib/currencies";

export function Topbar() {
  const { ownerId, walletId, setOwnerId, setWalletId } = useAuthStore();
  const { data: userWallets } = useUserWallets(ownerId);
  const { data: allWallets } = useAllWallets();

  const [isUserOpen, setIsUserOpen] = useState(false);
  const [isWalletOpen, setIsWalletOpen] = useState(false);

  const userRef = useRef<HTMLDivElement>(null);
  const walletRef = useRef<HTMLDivElement>(null);

  const dynamicUsers = useMemo(() => {
    if (!allWallets) return [{ id: ownerId, name: `User (${ownerId})` }];
    const uniqueOwnerIds = Array.from(new Set(allWallets.map(w => w.owner_id)));
    return uniqueOwnerIds.map(id => ({ id, name: `User ${id.split('-').pop()?.toUpperCase() || id}` }));
  }, [allWallets, ownerId]);

  const activeUser = dynamicUsers.find(u => u.id === ownerId) || dynamicUsers[0];
  const activeWalletObj = userWallets?.find(w => w.id === walletId);

  useEffect(() => {
    if (userWallets && userWallets.length > 0) {
      if (!walletId || !userWallets.find(w => w.id === walletId)) {
        setWalletId(userWallets[0].id);
      }
    }
  }, [userWallets, walletId, setWalletId]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userRef.current && !userRef.current.contains(event.target as Node)) setIsUserOpen(false);
      if (walletRef.current && !walletRef.current.contains(event.target as Node)) setIsWalletOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="h-20 border-b border-border bg-background flex items-center justify-end px-8 sticky top-0 z-50">
      <div className="flex items-center gap-4">

        {userWallets && userWallets.length > 0 && (
          <div className="relative" ref={walletRef}>
            <button
              onClick={() => setIsWalletOpen(!isWalletOpen)}
              className="text-sm font-semibold px-4 py-2 rounded-lg bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20 transition-all flex items-center gap-2"
            >
              <span className="text-lg leading-none">{activeWalletObj ? getCurrencyFlag(activeWalletObj.currency) : <WalletIcon className="w-4 h-4" />}</span>
              {activeWalletObj ? `${activeWalletObj.currency} Wallet` : "Select Wallet"}
              <ChevronDown className="w-4 h-4 ml-1 opacity-70" />
            </button>

            {isWalletOpen && (
              <div className="absolute top-full right-0 mt-2 w-56 bg-card border border-border rounded-xl shadow-lg overflow-hidden py-1 z-50">
                <div className="px-3 py-2 text-xs font-semibold text-muted-foreground border-b border-border mb-1 uppercase tracking-wider">
                  Your Wallets
                </div>
                {userWallets.map((wallet) => (
                  <button
                    key={wallet.id}
                    onClick={() => {
                      setWalletId(wallet.id);
                      setIsWalletOpen(false);
                    }}
                    className={`w-full text-left px-4 py-3 text-sm transition-colors hover:bg-sidebar-accent flex items-center justify-between ${wallet.id === walletId ? 'bg-sidebar-accent/50 border-l-2 border-primary' : 'border-l-2 border-transparent'}`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-sidebar-accent flex items-center justify-center text-lg leading-none">
                        {getCurrencyFlag(wallet.currency)}
                      </div>
                      <div>
                        <div className={`font-bold ${wallet.id === walletId ? 'text-primary' : 'text-foreground'}`}>
                          {wallet.currency} Wallet
                        </div>
                        <div className="text-xs text-muted-foreground mt-0.5">
                          {formatCurrency(wallet.balance, wallet.currency)}
                        </div>
                      </div>
                    </div>
                    {wallet.status === 'SUSPENDED' && (
                      <span className="text-[9px] font-bold uppercase tracking-widest bg-destructive/10 text-destructive px-2 py-0.5 rounded-sm border border-destructive/20">
                        Suspended
                      </span>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        <div className="w-px h-6 bg-border mx-2"></div>

        <div className="relative" ref={userRef}>
          <button
            onClick={() => setIsUserOpen(!isUserOpen)}
            className="text-sm font-semibold px-4 py-2 rounded-lg bg-secondary/10 text-secondary border border-secondary/20 hover:bg-secondary/20 transition-all flex items-center gap-2"
          >
            <User className="w-4 h-4" />
            {activeUser.name} <span className="opacity-50 text-xs font-mono ml-1">({activeUser.id})</span>
            <ChevronDown className="w-4 h-4 ml-1 opacity-70" />
          </button>

          {isUserOpen && (
            <div className="absolute top-full right-0 mt-2 w-48 bg-card border border-border rounded-xl shadow-lg overflow-hidden py-1 z-50">
              <div className="px-3 py-2 text-xs font-semibold text-muted-foreground border-b border-border mb-1 uppercase tracking-wider">
                Switch Role
              </div>
              {dynamicUsers.map((user) => (
                <button
                  key={user.id}
                  onClick={() => {
                    setOwnerId(user.id);
                    setIsUserOpen(false);
                  }}
                  className={`w-full text-left px-4 py-2 text-sm font-medium transition-colors hover:bg-sidebar-accent flex items-center justify-between ${user.id === ownerId ? 'text-secondary bg-secondary/5' : 'text-foreground'}`}
                >
                  <span className="truncate mr-2">{user.name}</span>
                  <span className="text-xs text-muted-foreground font-mono shrink-0">{user.id}</span>
                </button>
              ))}
            </div>
          )}
        </div>

      </div>
    </header>
  );
}
