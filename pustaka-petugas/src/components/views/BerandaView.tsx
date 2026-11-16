'use client';

import React from 'react';
import { LibraryStats, Transaction, CriticalLoanAlert } from '../../types';

interface BerandaViewProps {
  stats: LibraryStats;
  recentTransactions: Transaction[];
  alerts: CriticalLoanAlert[];
  onProcessReturn: (tx: Transaction) => void;
  onNotifyAlert: (alertId: string) => void;
  onNewTransaction: () => void;
  onNavigateToTab: (tab: string) => void;
}

export const BerandaView: React.FC<BerandaViewProps> = ({
  stats,
  recentTransactions,
  alerts,
  onProcessReturn,
  onNotifyAlert,
  onNewTransaction,
  onNavigateToTab,
}) => {
  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Banner Operasional */}
      <div className="bg-[#FFFFFF] rounded-2xl border-2 border-[#1E1E1E] p-6 shadow-[4px_4px_0_0_#1E1E1E] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-[#8C857B] mb-1">
            <span className="w-2 h-2 rounded-full bg-[#C85A17]" />
            <span>KONSOL SIRKULASI MEJA LAYANAN 01</span>
          </div>
          <h1 className="text-3xl font-serif font-bold text-[#1F2421] tracking-tight">
            Pusat Operasional Sirkulasi
          </h1>
          <p className="text-xs font-mono text-[#666666] mt-1">
            Sesi Operasional: <strong>Senin, 16 November 2026</strong> · Status Database:{' '}
            <span className="text-emerald-700 font-bold">Sinkron Real-time</span>
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigateToTab('katalog')}
            className="px-4 py-2.5 rounded-xl border-2 border-[#1E1E1E] bg-[#F5F2EB] hover:bg-[#EBE5D8] text-xs font-mono font-bold text-[#1F2421] shadow-[2px_2px_0_0_#1E1E1E] transition-all"
          >
            Buka Katalog Koleksi
          </button>
          <button
            onClick={onNewTransaction}
            className="px-5 py-2.5 rounded-xl border-2 border-[#1E1E1E] bg-[#C85A17] hover:bg-[#A34710] text-white text-xs font-mono font-bold shadow-[3px_3px_0_0_#1E1E1E] active:translate-x-0.5 active:translate-y-0.5 transition-all flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            + Transaksi Baru
          </button>
        </div>
      </div>

      {/* 4 KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1: Koleksi Induk */}
        <div className="bg-[#FFFFFF] border-2 border-[#1E1E1E] rounded-xl p-5 shadow-[3px_3px_0_0_#1E1E1E] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs font-mono text-[#666666]">
              <span>KOLEKSI INDUK</span>
              <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                +{stats.newTitlesThisMonth} Bln Ini
              </span>
            </div>
            <div className="text-3xl font-serif font-bold text-[#1F2421] mt-2">
              {stats.totalTitles}
            </div>
            <div className="text-xs font-mono text-[#777777] mt-0.5">Judul Buku Terdaftar</div>
          </div>
          <div className="mt-4 pt-3 border-t border-[#F0EBE1] flex items-center justify-between text-[11px] font-mono">
            <span className="text-[#8C857B]">Klasifikasi DDC Lengkap</span>
            <span className="text-[#C85A17] font-bold cursor-pointer" onClick={() => onNavigateToTab('kelola-buku')}>
              Lihat Master →
            </span>
          </div>
        </div>

        {/* KPI 2: Stok di Rak */}
        <div className="bg-[#FFFFFF] border-2 border-[#1E1E1E] rounded-xl p-5 shadow-[3px_3px_0_0_#1E1E1E] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs font-mono text-[#666666]">
              <span>STOK DI RAK</span>
              <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                TERSEDIA
              </span>
            </div>
            <div className="text-3xl font-serif font-bold text-[#1F2421] mt-2">
              {stats.availableShelfStock}
            </div>
            <div className="text-xs font-mono text-[#777777] mt-0.5">Eksemplar Siap Pinjam</div>
          </div>
          <div className="mt-4 pt-3 border-t border-[#F0EBE1] flex items-center justify-between text-[11px] font-mono">
            <span className="text-[#8C857B]">Kapasitas Rak 92%</span>
            <span className="text-[#C85A17] font-bold cursor-pointer" onClick={() => onNavigateToTab('katalog')}>
              Jelajahi Rak →
            </span>
          </div>
        </div>

        {/* KPI 3: Sirkulasi Aktif */}
        <div className="bg-[#FFFFFF] border-2 border-[#1E1E1E] rounded-xl p-5 shadow-[3px_3px_0_0_#1E1E1E] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs font-mono text-[#666666]">
              <span>SIRKULASI AKTIF</span>
              <span className="text-amber-800 font-bold bg-amber-50 px-2 py-0.5 rounded border border-amber-300">
                DIPINJAM
              </span>
            </div>
            <div className="text-3xl font-serif font-bold text-[#C85A17] mt-2">
              {stats.activeLoans}
            </div>
            <div className="text-xs font-mono text-[#777777] mt-0.5">Buku di Tangan Anggota</div>
          </div>
          <div className="mt-4 pt-3 border-t border-[#F0EBE1] flex items-center justify-between text-[11px] font-mono">
            <span className="text-[#8C857B]">3 Mendekati Tempo</span>
            <span className="text-[#C85A17] font-bold cursor-pointer" onClick={() => onNavigateToTab('riwayat')}>
              Log Sirkulasi →
            </span>
          </div>
        </div>

        {/* KPI 4: Riwayat Selesai */}
        <div className="bg-[#FFFFFF] border-2 border-[#1E1E1E] rounded-xl p-5 shadow-[3px_3px_0_0_#1E1E1E] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs font-mono text-[#666666]">
              <span>RIWAYAT SELESAI</span>
              <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                {stats.returnRatePercent}% Tingkat Kembali
              </span>
            </div>
            <div className="text-3xl font-serif font-bold text-[#1F2421] mt-2">
              {stats.completedReturns}
            </div>
            <div className="text-xs font-mono text-[#777777] mt-0.5">Transaksi Pengembalian</div>
          </div>
          <div className="mt-4 pt-3 border-t border-[#F0EBE1] flex items-center justify-between text-[11px] font-mono">
            <span className="text-[#8C857B]">Arsip Q1 2026</span>
            <span className="text-[#C85A17] font-bold cursor-pointer" onClick={() => onNavigateToTab('riwayat')}>
              Semua Riwayat →
            </span>
          </div>
        </div>
      </div>

      {/* Main Grid: 2 Columns (Transactions List & Critical Loan Panel) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Recent Transactions Table (2 cols) */}
        <div className="lg:col-span-2 bg-[#FFFFFF] border-2 border-[#1E1E1E] rounded-2xl shadow-[4px_4px_0_0_#1E1E1E] overflow-hidden flex flex-col justify-between">
          <div className="p-5 border-b-2 border-[#1E1E1E] bg-[#F5F2EB] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#C85A17]" />
              <h3 className="font-serif font-bold text-lg text-[#1F2421]">
                Daftar Transaksi Terbaru
              </h3>
            </div>
            <button
              onClick={() => onNavigateToTab('riwayat')}
              className="text-xs font-mono font-bold text-[#C85A17] hover:underline"
            >
              Lihat Semua Transaksi ({stats.activeLoans + stats.completedReturns}) →
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b-2 border-[#1E1E1E] bg-[#EBE5D8] text-[11px] font-mono text-[#666666] uppercase">
                  <th className="py-2.5 px-4">No. Registrasi</th>
                  <th className="py-2.5 px-4">Anggota</th>
                  <th className="py-2.5 px-4">Judul Buku</th>
                  <th className="py-2.5 px-4">Batas Pengembalian</th>
                  <th className="py-2.5 px-4">Status</th>
                  <th className="py-2.5 px-4 text-center">Aksi Cepat</th>
                </tr>
              </thead>
              <tbody className="divide-y border-b border-[#E5E0D8] text-xs font-sans">
                {recentTransactions.map((tx) => {
                  const isBorrowed = tx.status === 'DIPINJAM';
                  const isLate = tx.status === 'TERLAMBAT';

                  return (
                    <tr key={tx.id} className="hover:bg-[#FBF9F5] transition-colors">
                      <td className="py-3 px-4 font-mono font-bold text-[#1F2421]">
                        {tx.id}
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-semibold text-[#1F2421]">{tx.borrowerName}</div>
                        <div className="text-[10px] font-mono text-[#777777]">{tx.borrowerId}</div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-serif font-bold text-[#1F2421] line-clamp-1">
                          {tx.bookTitle}
                        </div>
                        <div className="text-[10px] text-[#666666]">{tx.bookAuthor}</div>
                      </td>
                      <td className="py-3 px-4 font-mono text-[11px]">
                        {tx.dueDate}
                      </td>
                      <td className="py-3 px-4">
                        {tx.status === 'KEMBALI' && (
                          <span className="inline-flex items-center gap-1 text-[11px] font-mono font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-300">
                            ✓ KEMBALI
                          </span>
                        )}
                        {tx.status === 'DIPINJAM' && (
                          <span className="inline-flex items-center gap-1 text-[11px] font-mono font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-300">
                            ● DIPINJAM
                          </span>
                        )}
                        {tx.status === 'TERLAMBAT' && (
                          <span className="inline-flex items-center gap-1 text-[11px] font-mono font-bold text-rose-800 bg-rose-50 px-2 py-0.5 rounded border border-rose-300">
                            ⚠ TERLAMBAT
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-center">
                        {isBorrowed || isLate ? (
                          <button
                            onClick={() => onProcessReturn(tx)}
                            className="text-[11px] font-mono font-bold px-2.5 py-1 rounded bg-[#C85A17] hover:bg-[#A34710] text-white border border-[#1E1E1E] shadow-[1px_1px_0_0_#1E1E1E] transition-all"
                          >
                            Proses Kembali
                          </button>
                        ) : (
                          <span className="text-[11px] font-mono text-[#777777] bg-[#F5F2EB] px-2 py-0.5 rounded border border-[#D9D2C5]">
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

          <div className="p-3 bg-[#FBF9F5] border-t border-[#1E1E1E] text-xs font-mono text-[#666666] flex justify-between items-center">
            <span>Menampilkan 5 transaksi sirkulasi terbaru</span>
            <button
              onClick={() => onNavigateToTab('riwayat')}
              className="font-bold text-[#C85A17] hover:underline"
            >
              Buka Konsol Sirkulasi Penuh →
            </button>
          </div>
        </div>

        {/* Right Column: Panel Perhatian Petugas & Denda Rule */}
        <div className="space-y-6">
          {/* Panel Perhatian Petugas */}
          <div className="bg-[#FFFFFF] border-2 border-[#1E1E1E] rounded-2xl shadow-[4px_4px_0_0_#1E1E1E] p-5 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b-2 border-[#1E1E1E]">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-ping" />
                <h3 className="font-serif font-bold text-base text-[#1F2421]">
                  Perhatian Petugas
                </h3>
              </div>
              <span className="text-[10px] font-mono font-bold bg-amber-100 text-amber-900 px-2 py-0.5 rounded border border-amber-300">
                {alerts.length} Kritis
              </span>
            </div>

            <p className="text-xs text-[#666666] font-mono">
              Buku yang mendekati jatuh tempo (1-4 hari kerja). Hubungi peminjam untuk mencegah denda.
            </p>

            <div className="space-y-3">
              {alerts.map((alert) => (
                <div
                  key={alert.id}
                  className="p-3 bg-[#FBF9F5] border-2 border-[#1E1E1E] rounded-xl shadow-[2px_2px_0_0_#1E1E1E] space-y-2"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="font-serif font-bold text-xs text-[#1F2421]">
                        {alert.bookTitle}
                      </div>
                      <div className="text-[10px] font-mono text-[#666666]">
                        {alert.borrowerName} ({alert.borrowerId})
                      </div>
                    </div>
                    <span className="text-[10px] font-mono font-bold text-amber-800 bg-amber-100 px-1.5 py-0.5 rounded border border-amber-300 whitespace-nowrap">
                      Sisa {alert.daysRemaining} Hari
                    </span>
                  </div>

                  <div className="flex items-center justify-between pt-1 border-t border-[#F0EBE1] text-[11px] font-mono">
                    <span className="text-[#8C857B]">Tempo: {alert.dueDate}</span>
                    <button
                      disabled={alert.notified}
                      onClick={() => onNotifyAlert(alert.id)}
                      className={`text-[10px] font-bold px-2 py-0.5 rounded border transition-all ${
                        alert.notified
                          ? 'bg-emerald-100 text-emerald-800 border-emerald-300 cursor-default'
                          : 'bg-[#FFFFFF] hover:bg-[#C85A17] hover:text-white border-[#1E1E1E] text-[#1F2421]'
                      }`}
                    >
                      {alert.notified ? '✓ Terkirim' : 'Kirim Notifikasi'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Ketentuan Denda Card */}
          <div className="bg-[#F5F2EB] border-2 border-[#1E1E1E] rounded-2xl shadow-[4px_4px_0_0_#1E1E1E] p-5 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-md bg-[#C85A17] text-white flex items-center justify-center font-bold text-xs border border-[#1E1E1E]">
                Rp
              </div>
              <h4 className="font-serif font-bold text-sm text-[#1F2421]">
                Standar Denda Sirkulasi
              </h4>
            </div>

            <p className="text-xs text-[#444444] leading-relaxed">
              Denda keterlambatan buku koleksi umum adalah <strong>Rp 1.000 / hari kerja</strong> per eksemplar. Sistem secara otomatis menghitung akumulasi denda pada saat pemrosesan kembali di meja layanan.
            </p>

            <div className="p-2.5 bg-[#FFFFFF] rounded-lg border border-[#1E1E1E] text-[11px] font-mono text-[#666666] flex justify-between items-center">
              <span>Batas Maksimal Pinjam:</span>
              <span className="font-bold text-[#1F2421]">7 Hari Kerja</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
