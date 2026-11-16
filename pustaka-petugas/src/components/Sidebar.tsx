'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface SidebarProps {
  activeTab?: string;
  onTabChange?: (tab: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, onTabChange }) => {
  const pathname = usePathname();

  const navItems = [
    {
      id: 'beranda',
      label: 'Beranda',
      sublabel: 'Pusat Operasional',
      href: '/',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      ),
    },
    {
      id: 'katalog',
      label: 'Katalog Koleksi',
      sublabel: 'Sirkulasi Pustaka',
      href: '/katalog',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      ),
    },
    {
      id: 'riwayat',
      label: 'Riwayat Transaksi',
      sublabel: 'Log Sirkulasi',
      href: '/riwayat',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
        </svg>
      ),
    },
    {
      id: 'kelola-buku',
      label: 'Kelola Data Buku',
      sublabel: 'Rekonsiliasi Master',
      href: '/kelola-buku',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
      ),
    },
  ];

  const currentTab = activeTab || (pathname === '/' ? 'beranda' : pathname.replace('/', ''));

  return (
    <aside className="w-64 bg-[#F5F2EB] border-r-2 border-[#1E1E1E] flex flex-col justify-between h-screen sticky top-0 select-none shadow-[2px_0_0_0_#1E1E1E]">
      <div>
        {/* Brand Header */}
        <div className="p-5 border-b-2 border-[#1E1E1E] bg-[#EBE5D8]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#C85A17] text-white flex items-center justify-center font-bold text-xl shadow-[2px_2px_0_0_#1E1E1E] border-2 border-[#1E1E1E]">
              P
            </div>
            <div>
              <h1 className="font-serif font-bold text-lg text-[#1F2421] tracking-tight leading-none">
                Pustaka Petugas
              </h1>
              <p className="text-[11px] font-mono text-[#666666] uppercase mt-1 tracking-wider">
                Sistem Sirkulasi Mandiri
              </p>
            </div>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="p-3 space-y-1.5">
          <p className="px-3 pt-2 pb-1 text-[10px] font-mono font-bold uppercase tracking-wider text-[#8C857B]">
            Modul Utama
          </p>
          {navItems.map((item) => {
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onTabChange?.(item.id)}
                className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-lg border-2 text-left transition-all ${
                  isActive
                    ? 'bg-[#C85A17] text-white border-[#1E1E1E] shadow-[3px_3px_0_0_#1E1E1E] font-medium'
                    : 'bg-[#FBF9F5] text-[#333333] border-transparent hover:border-[#1E1E1E] hover:bg-[#FFFFFF]'
                }`}
              >
                <div className={`${isActive ? 'text-white' : 'text-[#C85A17]'}`}>
                  {item.icon}
                </div>
                <div className="flex-1">
                  <div className="text-sm font-semibold leading-tight">{item.label}</div>
                  <div className={`text-[11px] ${isActive ? 'text-amber-100' : 'text-[#777777]'}`}>
                    {item.sublabel}
                  </div>
                </div>
                {isActive && (
                  <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Terminal & Operator Info Footer */}
      <div className="p-4 border-t-2 border-[#1E1E1E] bg-[#EBE5D8] space-y-3">
        <div className="bg-[#FBF9F5] border-2 border-[#1E1E1E] rounded-lg p-3 shadow-[2px_2px_0_0_#1E1E1E]">
          <div className="flex items-center justify-between text-[11px] font-mono">
            <span className="text-[#666666]">Terminal:</span>
            <span className="font-bold text-[#1F2421]">POS-SIRKULASI-01</span>
          </div>
          <div className="flex items-center justify-between text-[11px] font-mono mt-1">
            <span className="text-[#666666]">Koneksi:</span>
            <span className="inline-flex items-center gap-1.5 text-emerald-700 font-bold">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              TERHUBUNG
            </span>
          </div>
          <div className="h-px bg-[#D9D2C5] my-2" />
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-[#1E1E1E] text-white flex items-center justify-center text-xs font-bold font-mono">
              P1
            </div>
            <div className="flex-1 overflow-hidden">
              <div className="text-xs font-bold text-[#1F2421] truncate">Petugas Meja 1</div>
              <div className="text-[10px] font-mono text-[#777777]">NIP. 19840212</div>
            </div>
          </div>
        </div>

        <button
          onClick={() => alert('Sesi petugas telah disimpan. Terminal tetap aktif untuk operasional.')}
          className="w-full py-2 px-3 text-xs font-mono font-bold text-[#777777] hover:text-[#B91C1C] hover:bg-[#FEE2E2] rounded border border-transparent hover:border-[#B91C1C] transition-all flex items-center justify-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          Kunci / Keluar Terminal
        </button>
      </div>
    </aside>
  );
};
