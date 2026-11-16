import React from 'react';
import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Pustaka Petugas - Sistem Sirkulasi Perpustakaan Internal',
  description:
    'Antarmuka web responsif sistem sirkulasi mandiri khusus petugas perpustakaan meja layanan untuk mengelola katalog, peminjaman, pengembalian, dan rekonsiliasi inventaris stok fisik.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cinzel:wght@600;700;800&family=JetBrains+Mono:wght@400;500;600;700&family=Plus+Jakarta+Sans:wght@400;500;600;700&family=Lora:ital,wght@0,500;0,600;0,700;1,400&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-[#FBF9F5] text-[#1F2421] min-h-screen antialiased selection:bg-[#C85A17] selection:text-white font-sans">
        {children}
      </body>
    </html>
  );
}
