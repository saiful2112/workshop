'use client';

import React, { useState } from 'react';
import { Transaction } from '../types';

interface ReturnConfirmModalProps {
  transaction: Transaction | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (transactionId: string) => void;
}

export const ReturnConfirmModal: React.FC<ReturnConfirmModalProps> = ({
  transaction,
  isOpen,
  onClose,
  onConfirm,
}) => {
  const [finePaid, setFinePaid] = useState(true);

  if (!isOpen || !transaction) return null;

  const isLate = transaction.status === 'TERLAMBAT' || (transaction.daysLate && transaction.daysLate > 0);
  const fine = transaction.fineAmount || (transaction.daysLate ? transaction.daysLate * 1000 : 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-[#FBF9F5] rounded-2xl border-2 border-[#1E1E1E] shadow-[8px_8px_0_0_#1E1E1E] max-w-md w-full overflow-hidden">
        {/* Header */}
        <div className="bg-[#EBE5D8] px-6 py-4 border-b-2 border-[#1E1E1E] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-700 text-white flex items-center justify-center font-bold font-mono text-sm border border-[#1E1E1E]">
              ✓
            </div>
            <div>
              <h3 className="font-serif font-bold text-lg text-[#1F2421]">
                Proses Pengembalian Buku
              </h3>
              <p className="text-[11px] font-mono text-[#666666]">
                Kode: {transaction.id}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg border border-[#1E1E1E] bg-[#FFFFFF] hover:bg-[#F5F2EB] flex items-center justify-center text-[#555555]"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          <div className="bg-[#F5F2EB] p-4 rounded-xl border-2 border-[#1E1E1E] space-y-2">
            <div className="flex justify-between text-xs">
              <span className="font-mono text-[#666666]">Judul Buku:</span>
              <span className="font-serif font-bold text-[#1F2421] text-right max-w-[200px] truncate">
                {transaction.bookTitle}
              </span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="font-mono text-[#666666]">Peminjam:</span>
              <span className="font-bold text-[#1F2421]">
                {transaction.borrowerName} ({transaction.borrowerId})
              </span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="font-mono text-[#666666]">Tgl Pinjam / Jatuh Tempo:</span>
              <span className="font-mono text-[#1F2421]">
                {transaction.borrowDate} → {transaction.dueDate}
              </span>
            </div>
          </div>

          {/* Overdue Alert & Fine */}
          {isLate ? (
            <div className="p-4 bg-rose-50 border-2 border-rose-300 rounded-xl space-y-2">
              <div className="flex items-center gap-2 text-rose-800 font-mono font-bold text-xs">
                <span>⚠ TERLAMBAT {transaction.daysLate || 9} HARI KERJA</span>
              </div>
              <div className="flex justify-between items-center text-sm font-mono">
                <span className="text-[#666666]">Total Denda (Rp 1.000/hari):</span>
                <span className="text-rose-700 font-bold text-base">
                  Rp {fine.toLocaleString('id-ID')}
                </span>
              </div>
              <label className="flex items-center gap-2 text-xs font-mono text-[#444444] pt-2 border-t border-rose-200 cursor-pointer">
                <input
                  type="checkbox"
                  checked={finePaid}
                  onChange={(e) => setFinePaid(e.target.checked)}
                  className="rounded border-[#1E1E1E] text-[#C85A17] focus:ring-0"
                />
                Denda keterlambatan telah diterima lunas di meja kasir.
              </label>
            </div>
          ) : (
            <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-xl text-xs font-mono text-emerald-800 flex items-center gap-2">
              <span className="font-bold">✓ Tepat Waktu:</span>
              <span>Tidak ada denda keterlambatan untuk transaksi ini.</span>
            </div>
          )}

          <div className="p-3 bg-[#EBE5D8] rounded-xl border border-[#1E1E1E] text-[11px] font-mono text-[#555555]">
            <strong>Catatan Rekonsiliasi:</strong> Tombol konfirmasi di bawah akan mengunci transaksi, memperbarui status menjadi <em>KEMBALI</em>, dan otomatis menambahkan <strong>+1 eksemplar</strong> ke stok fisik rak.
          </div>

          {/* Action buttons */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg border-2 border-[#1E1E1E] bg-[#FFFFFF] hover:bg-[#F5F2EB] text-xs font-mono font-bold text-[#1F2421]"
            >
              Batal
            </button>
            <button
              onClick={() => {
                onConfirm(transaction.id);
                onClose();
              }}
              className="px-5 py-2 rounded-lg border-2 border-[#1E1E1E] bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-mono font-bold shadow-[2px_2px_0_0_#1E1E1E] active:translate-x-0.5"
            >
              Konfirmasi Selesai (+1 Stok)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
