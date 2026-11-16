'use client';

import React from 'react';
import { Book } from '../types';

interface PrintLabelModalProps {
  book: Book | null;
  isOpen: boolean;
  onClose: () => void;
}

export const PrintLabelModal: React.FC<PrintLabelModalProps> = ({
  book,
  isOpen,
  onClose,
}) => {
  if (!isOpen || !book) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-[#FBF9F5] rounded-2xl border-2 border-[#1E1E1E] shadow-[8px_8px_0_0_#1E1E1E] max-w-md w-full overflow-hidden">
        {/* Header */}
        <div className="bg-[#EBE5D8] px-6 py-4 border-b-2 border-[#1E1E1E] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#C85A17] text-white flex items-center justify-center font-bold text-sm border border-[#1E1E1E]">
              🖨
            </div>
            <div>
              <h3 className="font-serif font-bold text-lg text-[#1F2421]">
                Cetak Label Punggung & Barcode
              </h3>
              <p className="text-[11px] font-mono text-[#666666]">
                Standar Perpustakaan Nasional
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

        <div className="p-6 space-y-4">
          {/* Printable Label Preview Box */}
          <div className="p-4 bg-white border-2 border-dashed border-[#1E1E1E] rounded-xl flex flex-col items-center justify-center text-center space-y-2 shadow-sm">
            <div className="text-[10px] font-mono font-bold tracking-widest text-[#777777] uppercase">
              PERPUSTAKAAN MEJA LAYANAN
            </div>
            <div className="text-sm font-serif font-bold text-[#1F2421]">
              {book.title}
            </div>

            {/* Simulated Barcode */}
            <div className="py-2 px-4 bg-gray-50 border border-gray-300 rounded flex flex-col items-center">
              <div className="flex items-center gap-0.5 h-12">
                {[2, 1, 3, 1, 2, 4, 1, 3, 2, 1, 4, 2, 1, 3, 1, 2, 3, 1, 2, 1].map((w, idx) => (
                  <div
                    key={idx}
                    className="bg-black h-full"
                    style={{ width: `${w * 1.5}px` }}
                  />
                ))}
              </div>
              <span className="text-[10px] font-mono tracking-widest mt-1 text-black font-bold">
                *{book.id}-{book.ddc.replace('.', '')}*
              </span>
            </div>

            {/* Spine Label Box */}
            <div className="border-2 border-[#1E1E1E] p-2 bg-[#FBF9F5] rounded text-center w-32 font-mono">
              <div className="text-[9px] text-[#777777] font-bold">KODE PUNGGUNG</div>
              <div className="text-base font-bold text-[#1F2421]">{book.ddc}</div>
              <div className="text-xs font-bold text-[#C85A17] uppercase">
                {book.author.slice(0, 3)}
              </div>
              <div className="text-xs font-bold text-[#1F2421] lowercase">
                {book.title.slice(0, 1)}
              </div>
              <div className="text-[9px] text-[#555555] border-t border-[#D9D2C5] mt-1 pt-0.5">
                {book.shelfLocation}
              </div>
            </div>
          </div>

          <p className="text-xs font-mono text-[#666666] text-center">
            Format label telah disesuaikan dengan ukuran standar stiker kertas termal 50mm x 30mm.
          </p>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg border-2 border-[#1E1E1E] bg-[#FFFFFF] hover:bg-[#F5F2EB] text-xs font-mono font-bold text-[#1F2421]"
            >
              Tutup
            </button>
            <button
              onClick={handlePrint}
              className="px-5 py-2 rounded-lg border-2 border-[#1E1E1E] bg-[#C85A17] hover:bg-[#A34710] text-white text-xs font-mono font-bold shadow-[2px_2px_0_0_#1E1E1E] active:translate-x-0.5 flex items-center gap-1.5"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
              </svg>
              Cetak Sekarang
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
