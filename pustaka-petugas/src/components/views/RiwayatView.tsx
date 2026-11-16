'use client';

import React, { useState, useMemo } from 'react';
import { Transaction } from '../../types';

interface RiwayatViewProps {
  transactions: Transaction[];
  onProcessReturn: (tx: Transaction) => void;
  onOpenScanner: () => void;
  onNewTransaction: () => void;
}

export const RiwayatView: React.FC<RiwayatViewProps> = ({
  transactions,
  onProcessReturn,
  onOpenScanner,
  onNewTransaction,
}) => {
  const [activeTab, setActiveTab] = useState<'ALL' | 'BORROWED' | 'RETURNED'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const countTotal = transactions.length;
  const countBorrowed = transactions.filter((t) => t.status === 'DIPINJAM' || t.status === 'TERLAMBAT').length;
  const countReturned = transactions.filter((t) => t.status === 'KEMBALI').length;

  const filteredTransactions = useMemo(() => {
    return transactions.filter((tx) => {
      const matchesSearch =
        tx.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tx.borrowerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tx.borrowerId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tx.bookTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tx.bookAuthor.toLowerCase().includes(searchQuery.toLowerCase());

      if (!matchesSearch) return false;

      if (activeTab === 'BORROWED') return tx.status === 'DIPINJAM' || tx.status === 'TERLAMBAT';
      if (activeTab === 'RETURNED') return tx.status === 'KEMBALI';
      return true;
    });
  }, [transactions, searchQuery, activeTab]);

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header Log Konsol */}
      <div className="bg-[#FFFFFF] rounded-2xl border-2 border-[#1E1E1E] p-6 shadow-[4px_4px_0_0_#1E1E1E] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 text-xs font-mono text-[#8C857B] mb-1">
            <span className="font-bold text-[#1F2421] bg-[#F5F2EB] px-2 py-0.5 rounded border border-[#1E1E1E]">
              KODE ARSIP: ARC-TRX-2026.Q1
            </span>
            <span>·</span>
            <span className="text-emerald-700 font-bold flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              SINKRONISASI AKTIF: REAL-TIME DB
            </span>
          </div>
          <h1 className="text-2xl font-serif font-bold text-[#1F2421]">
            Riwayat Transaksi Sirkulasi
          </h1>
          <p className="text-xs font-mono text-[#666666] mt-0.5">
            Log Konsol Meja Layanan 01 · Rekonsiliasi peminjaman dan pengembalian buku fisik.
          </p>
        </div>

        <button
          onClick={onNewTransaction}
          className="px-5 py-2.5 rounded-xl border-2 border-[#1E1E1E] bg-[#C85A17] hover:bg-[#A34710] text-white text-xs font-mono font-bold shadow-[3px_3px_0_0_#1E1E1E] active:translate-x-0.5 active:translate-y-0.5 transition-all flex items-center justify-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          + Transaksi Baru
        </button>
      </div>

      {/* Summary KPI Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-[#F5F2EB] p-4 rounded-xl border-2 border-[#1E1E1E] shadow-[2px_2px_0_0_#1E1E1E] flex items-center justify-between">
          <div>
            <span className="text-xs font-mono text-[#666666] uppercase">Total Arsip Berkas</span>
            <div className="text-2xl font-serif font-bold text-[#1F2421] mt-1">{countTotal} Berkas</div>
          </div>
          <div className="w-10 h-10 rounded-lg bg-[#FFFFFF] border border-[#1E1E1E] flex items-center justify-center font-mono font-bold text-sm">
            TX
          </div>
        </div>

        <div className="bg-[#FFFDF7] p-4 rounded-xl border-2 border-[#1E1E1E] shadow-[2px_2px_0_0_#1E1E1E] flex items-center justify-between">
          <div>
            <span className="text-xs font-mono text-amber-900 uppercase">Aktif Dipinjam</span>
            <div className="text-2xl font-serif font-bold text-[#C85A17] mt-1">{countBorrowed} Buku</div>
          </div>
          <div className="w-10 h-10 rounded-lg bg-amber-100 border border-amber-300 flex items-center justify-center font-mono font-bold text-amber-900 text-sm">
            ●
          </div>
        </div>

        <div className="bg-[#F7FDF9] p-4 rounded-xl border-2 border-[#1E1E1E] shadow-[2px_2px_0_0_#1E1E1E] flex items-center justify-between">
          <div>
            <span className="text-xs font-mono text-emerald-900 uppercase">Selesai Kembali</span>
            <div className="text-2xl font-serif font-bold text-emerald-800 mt-1">{countReturned} Buku</div>
          </div>
          <div className="w-10 h-10 rounded-lg bg-emerald-100 border border-emerald-300 flex items-center justify-center font-mono font-bold text-emerald-900 text-sm">
            ✓
          </div>
        </div>
      </div>

      {/* Controls: Search, Scanner, and Filter Tabs */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Tabs */}
        <div className="flex items-center gap-2 p-1.5 bg-[#EBE5D8] rounded-xl border-2 border-[#1E1E1E] shadow-[2px_2px_0_0_#1E1E1E] w-full md:w-auto">
          <button
            onClick={() => setActiveTab('ALL')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
              activeTab === 'ALL'
                ? 'bg-[#C85A17] text-white shadow-[2px_2px_0_0_#1E1E1E] border border-[#1E1E1E]'
                : 'text-[#333333] hover:bg-[#F5F2EB]'
            }`}
          >
            Semua Transaksi ({countTotal})
          </button>
          <button
            onClick={() => setActiveTab('BORROWED')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
              activeTab === 'BORROWED'
                ? 'bg-[#C85A17] text-white shadow-[2px_2px_0_0_#1E1E1E] border border-[#1E1E1E]'
                : 'text-[#333333] hover:bg-[#F5F2EB]'
            }`}
          >
            Dipinjam ({countBorrowed})
          </button>
          <button
            onClick={() => setActiveTab('RETURNED')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
              activeTab === 'RETURNED'
                ? 'bg-emerald-700 text-white shadow-[2px_2px_0_0_#1E1E1E] border border-[#1E1E1E]'
                : 'text-[#333333] hover:bg-[#F5F2EB]'
            }`}
          >
            Kembali ({countReturned})
          </button>
        </div>

        {/* Search & Scanner */}
        <div className="flex items-center gap-2 w-full md:w-auto flex-1 max-w-md">
          <div className="relative flex-1">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari kode PJM, nama peminjam, NIM/NIP, atau buku..."
              className="w-full pl-9 pr-3 py-2 text-xs bg-[#FFFFFF] border-2 border-[#1E1E1E] rounded-xl focus:outline-none focus:border-[#C85A17] font-sans"
            />
            <div className="absolute left-3 top-2.5 text-[#777777]">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>

          <button
            onClick={onOpenScanner}
            className="px-3 py-2 rounded-xl border-2 border-[#1E1E1E] bg-[#FFFFFF] hover:bg-[#F5F2EB] text-xs font-mono font-bold text-[#1F2421] shadow-[2px_2px_0_0_#1E1E1E] flex items-center gap-1.5 flex-shrink-0"
          >
            <svg className="w-3.5 h-3.5 text-[#C85A17]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
            </svg>
            Scanner
          </button>
        </div>
      </div>

      {/* Main Transactions Log Table */}
      <div className="bg-[#FFFFFF] border-2 border-[#1E1E1E] rounded-2xl shadow-[4px_4px_0_0_#1E1E1E] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b-2 border-[#1E1E1E] bg-[#EBE5D8] text-[11px] font-mono text-[#666666] uppercase">
                <th className="py-3 px-4">Kode Pinjam</th>
                <th className="py-3 px-4">Nama Peminjam</th>
                <th className="py-3 px-4">Judul Buku & Pengarang</th>
                <th className="py-3 px-4">Tgl Pinjam</th>
                <th className="py-3 px-4">Jatuh Tempo</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-center">Aksi Sirkulasi</th>
              </tr>
            </thead>
            <tbody className="divide-y border-b border-[#E5E0D8] text-xs">
              {filteredTransactions.map((tx) => {
                const isReturned = tx.status === 'KEMBALI';
                const isLate = tx.status === 'TERLAMBAT';
                const isTodayDue = tx.dueDate === '2026-11-16';

                return (
                  <tr key={tx.id} className="hover:bg-[#FBF9F5] transition-colors">
                    {/* Kode Pinjam */}
                    <td className="py-3 px-4 font-mono font-bold text-[#1F2421]">
                      {tx.id}
                      <span className="block text-[10px] text-[#8C857B] font-normal">
                        Buku ID: {tx.bookId}
                      </span>
                    </td>

                    {/* Nama Peminjam & NIP/NIM */}
                    <td className="py-3 px-4">
                      <div className="font-semibold text-[#1F2421]">{tx.borrowerName}</div>
                      <div className="text-[10px] font-mono text-[#666666]">
                        {tx.borrowerId} · <span className="uppercase text-[#8C857B]">{tx.borrowerType}</span>
                      </div>
                    </td>

                    {/* Judul Buku & Pengarang */}
                    <td className="py-3 px-4">
                      <div className="font-serif font-bold text-[#1F2421]">
                        {tx.bookTitle}
                      </div>
                      <div className="text-[11px] text-[#666666]">{tx.bookAuthor}</div>
                    </td>

                    {/* Tgl Pinjam */}
                    <td className="py-3 px-4 font-mono text-[11px] text-[#555555]">
                      {tx.borrowDate}
                    </td>

                    {/* Jatuh Tempo with warning indicator */}
                    <td className="py-3 px-4 font-mono text-[11px]">
                      <span className="font-bold text-[#1F2421]">{tx.dueDate}</span>
                      {isTodayDue && !isReturned && (
                        <span className="block text-[10px] font-bold text-amber-700 mt-0.5">
                          ⚠ Jatuh tempo hari ini!
                        </span>
                      )}
                      {isLate && (
                        <span className="block text-[10px] font-bold text-rose-700 mt-0.5">
                          Terlambat {tx.daysLate || 9} Hari! (Denda Rp {((tx.fineAmount || 9000)).toLocaleString('id-ID')})
                        </span>
                      )}
                    </td>

                    {/* Status Pill */}
                    <td className="py-3 px-4">
                      {isReturned && (
                        <span className="inline-flex items-center gap-1.5 text-[11px] font-mono font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded border border-emerald-300">
                          ✓ KEMBALI
                        </span>
                      )}
                      {tx.status === 'DIPINJAM' && (
                        <span className="inline-flex items-center gap-1.5 text-[11px] font-mono font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded border border-amber-300">
                          ● DIPINJAM
                        </span>
                      )}
                      {isLate && (
                        <span className="inline-flex items-center gap-1.5 text-[11px] font-mono font-bold text-rose-800 bg-rose-100 px-2 py-0.5 rounded border border-rose-300">
                          ⚠ TERLAMBAT
                        </span>
                      )}
                    </td>

                    {/* Aksi Sirkulasi with double return prevention */}
                    <td className="py-3 px-4 text-center">
                      {!isReturned ? (
                        <button
                          onClick={() => onProcessReturn(tx)}
                          className="px-3 py-1.5 rounded-lg border-2 border-[#1E1E1E] bg-[#C85A17] hover:bg-[#A34710] text-white text-xs font-mono font-bold shadow-[2px_2px_0_0_#1E1E1E] active:translate-x-0.5 transition-all"
                        >
                          Proses Pengembalian
                        </button>
                      ) : (
                        <span className="inline-block text-[11px] font-mono text-[#777777] bg-[#F5F2EB] px-2.5 py-1 rounded border border-[#D9D2C5]">
                          Selesai (Stok +1)
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Footer Security / Protocol Note */}
        <div className="p-4 bg-[#F5F2EB] border-t-2 border-[#1E1E1E] flex flex-col sm:flex-row justify-between items-center gap-2 text-xs font-mono text-[#666666]">
          <span>
            Protokol Keamanan: Pencegahan pengembalian ganda aktif pada semua nomor registrasi arsip.
          </span>
          <span className="font-bold text-[#1F2421]">
            Menampilkan {filteredTransactions.length} dari {transactions.length} berkas
          </span>
        </div>
      </div>
    </div>
  );
};
