'use client';

import React, { useState } from 'react';

interface BarcodeScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onScanResult: (code: string) => void;
}

export const BarcodeScannerModal: React.FC<BarcodeScannerModalProps> = ({
  isOpen,
  onClose,
  onScanResult,
}) => {
  const [manualCode, setManualCode] = useState('');
  const [lastScanned, setLastScanned] = useState<string | null>(null);

  if (!isOpen) return null;

  const quickPresets = [
    { label: 'B001 - Laskar Pelangi', code: 'B001' },
    { label: 'B002 - Bumi Manusia', code: 'B002' },
    { label: 'B004 - Filosofi Teras (Habis)', code: 'B004' },
    { label: 'PJM-2026-0812 (Jatuh Tempo)', code: 'PJM-2026-0812' },
    { label: 'PJM-2026-0808 (Terlambat 9 Hari)', code: 'PJM-2026-0808' },
  ];

  const handleScan = (code: string) => {
    setLastScanned(code);
    onScanResult(code);
    setTimeout(() => {
      onClose();
    }, 400);
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (manualCode.trim()) {
      handleScan(manualCode.trim());
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-[#FBF9F5] rounded-2xl border-2 border-[#1E1E1E] shadow-[8px_8px_0_0_#1E1E1E] max-w-md w-full overflow-hidden">
        {/* Header */}
        <div className="bg-[#EBE5D8] px-6 py-4 border-b-2 border-[#1E1E1E] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#C85A17] text-white flex items-center justify-center font-bold text-sm border border-[#1E1E1E]">
              |||
            </div>
            <div>
              <h3 className="font-serif font-bold text-lg text-[#1F2421]">
                Scanner Barcode / QR Meja
              </h3>
              <p className="text-[11px] font-mono text-[#666666]">
                Deteksi Otomatis Buku & Transaksi
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
          {/* Scanner Viewfinder Box */}
          <div className="relative w-full h-44 rounded-xl border-2 border-[#1E1E1E] bg-[#1E2421] flex flex-col items-center justify-center overflow-hidden shadow-inner text-white">
            {/* Animated Laser Line */}
            <div className="absolute top-1/2 left-4 right-4 h-0.5 bg-red-500 shadow-[0_0_8px_2px_rgba(239,68,68,0.8)] animate-pulse" />

            {/* Corner Markers */}
            <div className="absolute top-3 left-3 w-4 h-4 border-t-2 border-l-2 border-[#C85A17]" />
            <div className="absolute top-3 right-3 w-4 h-4 border-t-2 border-r-2 border-[#C85A17]" />
            <div className="absolute bottom-3 left-3 w-4 h-4 border-b-2 border-l-2 border-[#C85A17]" />
            <div className="absolute bottom-3 right-3 w-4 h-4 border-b-2 border-r-2 border-[#C85A17]" />

            <div className="text-center z-10 px-4">
              <svg className="w-10 h-10 text-gray-400 mx-auto mb-2 opacity-60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
              </svg>
              <div className="text-xs font-mono text-gray-300">
                Arahkan barcode stiker buku atau kartu anggota ke kamera
              </div>
              {lastScanned && (
                <div className="mt-2 text-xs font-mono font-bold text-emerald-400 bg-emerald-950/80 px-2 py-1 rounded border border-emerald-500">
                  Terdeteksi: {lastScanned}
                </div>
              )}
            </div>
          </div>

          {/* Quick preset chips */}
          <div>
            <div className="text-[11px] font-mono font-bold text-[#666666] uppercase mb-1.5">
              Simulasi Pindai Cepat:
            </div>
            <div className="flex flex-wrap gap-1.5">
              {quickPresets.map((preset) => (
                <button
                  key={preset.code}
                  onClick={() => handleScan(preset.code)}
                  className="px-2.5 py-1 text-xs font-mono rounded border border-[#1E1E1E] bg-[#FFFFFF] hover:bg-[#C85A17] hover:text-white transition-colors"
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>

          {/* Manual Input Fallback */}
          <form onSubmit={handleManualSubmit} className="pt-2 border-t border-[#D9D2C5]">
            <label className="block text-xs font-mono font-bold text-[#1F2421] mb-1">
              Atau Masukkan Kode Barcode Manual:
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={manualCode}
                onChange={(e) => setManualCode(e.target.value)}
                placeholder="B001 / ISBN / PJM-..."
                className="flex-1 px-3 py-2 text-xs font-mono bg-[#FFFFFF] border-2 border-[#1E1E1E] rounded-lg focus:outline-none focus:border-[#C85A17]"
              />
              <button
                type="submit"
                className="px-4 py-2 rounded-lg border-2 border-[#1E1E1E] bg-[#C85A17] hover:bg-[#A34710] text-white text-xs font-mono font-bold shadow-[2px_2px_0_0_#1E1E1E]"
              >
                Cari
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
