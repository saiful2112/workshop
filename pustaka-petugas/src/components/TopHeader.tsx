'use client';

import React, { useState, useEffect } from 'react';

interface TopHeaderProps {
  title: string;
  subtitle?: string;
  onNewTransaction?: () => void;
  onOpenScanner?: () => void;
  onRefresh?: () => void;
}

export const TopHeader: React.FC<TopHeaderProps> = ({
  title,
  subtitle,
  onNewTransaction,
  onOpenScanner,
  onRefresh,
}) => {
  const [timeStr, setTimeStr] = useState<string>('09:00:00');

  useEffect(() => {
    const update = () => {
      const now = new Date();
      setTimeStr(
        now.toLocaleTimeString('id-ID', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        })
      );
    };
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="bg-[#FBF9F5] border-b-2 border-[#1E1E1E] px-6 py-4 flex flex-col md:flex-row md:items-center justify-between gap-4 sticky top-0 z-30 shadow-[0_2px_0_0_#1E1E1E]">
      <div>
        <div className="flex items-center gap-2 text-xs font-mono text-[#8C857B] mb-0.5">
          <span>PUSTAKA PETUGAS</span>
          <span>/</span>
          <span className="text-[#C85A17] font-semibold uppercase">{title}</span>
        </div>
        <h2 className="text-2xl font-serif font-bold text-[#1F2421] tracking-tight">
          {title}
        </h2>
        {subtitle && (
          <p className="text-xs text-[#666666] font-mono mt-0.5">{subtitle}</p>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-3">
        {/* Terminal & Server Status Badges */}
        <div className="hidden lg:flex items-center gap-2 bg-[#F5F2EB] border-2 border-[#1E1E1E] px-3 py-1.5 rounded-lg text-xs font-mono shadow-[2px_2px_0_0_#1E1E1E]">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-[#555555]">SERVER INDUK AKTIF</span>
          <span className="text-[#D9D2C5]">|</span>
          <span className="font-bold text-[#1F2421]">{timeStr} WIB</span>
        </div>

        {/* Quick Actions */}
        {onRefresh && (
          <button
            onClick={onRefresh}
            title="Sinkronisasi Data"
            className="p-2 rounded-lg border-2 border-[#1E1E1E] bg-[#FFFFFF] hover:bg-[#F5F2EB] text-[#333333] shadow-[2px_2px_0_0_#1E1E1E] active:translate-x-0.5 active:translate-y-0.5 transition-all"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
        )}

        {onOpenScanner && (
          <button
            onClick={onOpenScanner}
            className="flex items-center gap-2 px-3 py-2 rounded-lg border-2 border-[#1E1E1E] bg-[#FFFFFF] hover:bg-[#F5F2EB] text-xs font-mono font-bold text-[#1F2421] shadow-[2px_2px_0_0_#1E1E1E] active:translate-x-0.5 active:translate-y-0.5 transition-all"
          >
            <svg className="w-4 h-4 text-[#C85A17]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
            </svg>
            SCANNER
          </button>
        )}

        {onNewTransaction && (
          <button
            onClick={onNewTransaction}
            className="flex items-center gap-2 px-4 py-2 rounded-lg border-2 border-[#1E1E1E] bg-[#C85A17] hover:bg-[#A34710] text-white text-xs font-mono font-bold shadow-[3px_3px_0_0_#1E1E1E] active:translate-x-0.5 active:translate-y-0.5 transition-all"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            + TRANSAKSI BARU
          </button>
        )}
      </div>
    </header>
  );
};
