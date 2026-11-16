const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const PORT = process.env.PORT || 3000;
const PUBLIC_DIR = path.join(__dirname, 'public');

// In-Memory Database matching Stitch specifications
let books = [
  {
    id: 'B001',
    title: 'Laskar Pelangi',
    author: 'Andrea Hirata',
    publisher: 'Bentang Pustaka',
    year: 2005,
    isbn: '978-979-3062-79-2',
    ddc: '899.223',
    shelfLocation: 'Rak Sastra B-04',
    category: 'Sastra Indonesia',
    totalStock: 8,
    availableStock: 4,
    borrowedStock: 4,
    isStandardCover: true,
    maxBorrowDays: 7,
    synopsis: 'Kisah tentang sepuluh anak dari keluarga miskin di Belitung yang bersekolah dengan penuh semangat.',
  },
  {
    id: 'B002',
    title: 'Bumi Manusia',
    author: 'Pramoedya Ananta Toer',
    publisher: 'Hasta Mitra',
    year: 1980,
    isbn: '978-979-973-123-5',
    ddc: '813.01',
    shelfLocation: 'Rak Sastra A-01',
    category: 'Novel Sejarah',
    totalStock: 12,
    availableStock: 2,
    borrowedStock: 10,
    isStandardCover: true,
    maxBorrowDays: 7,
  },
  {
    id: 'B003',
    title: 'Negeri 5 Menara',
    author: 'Ahmad Fuadi',
    publisher: 'Gramedia Pustaka Utama',
    year: 2009,
    isbn: '978-979-22-4861-6',
    ddc: '899.2',
    shelfLocation: 'Rak Fiksi C-12',
    category: 'Inspiratif',
    totalStock: 5,
    availableStock: 1,
    borrowedStock: 4,
    isStandardCover: true,
    maxBorrowDays: 7,
  },
  {
    id: 'B004',
    title: 'Filosofi Teras',
    author: 'Henry Manampiring',
    publisher: 'Penerbit Buku Kompas',
    year: 2018,
    isbn: '978-602-412-518-9',
    ddc: '158.1',
    shelfLocation: 'Rak Filsafat D-02',
    category: 'Filsafat Populer',
    totalStock: 3,
    availableStock: 0,
    borrowedStock: 3,
    isStandardCover: true,
    maxBorrowDays: 7,
  },
  {
    id: 'B005',
    title: 'Cantik Itu Luka',
    author: 'Eka Kurniawan',
    publisher: 'Gramedia Pustaka Utama',
    year: 2002,
    isbn: '978-602-03-1258-3',
    ddc: '899.23',
    shelfLocation: 'Rak Sastra B-08',
    category: 'Realisme Magis',
    totalStock: 6,
    availableStock: 3,
    borrowedStock: 3,
    isStandardCover: true,
    maxBorrowDays: 7,
  },
  {
    id: 'B006',
    title: 'Hujan',
    author: 'Tere Liye',
    publisher: 'Republika Penerbit',
    year: 2016,
    isbn: '978-602-0822-14-3',
    ddc: '813.2',
    shelfLocation: 'Rak Fiksi C-03',
    category: 'Fiksi Ilmiah',
    totalStock: 8,
    availableStock: 5,
    borrowedStock: 3,
    isStandardCover: true,
    maxBorrowDays: 7,
  },
  {
    id: 'B007',
    title: 'Kamus Besar Bahasa Indonesia V',
    author: 'Badan Pengembangan Bahasa Kemendikbud',
    publisher: 'Balai Pustaka',
    year: 2016,
    isbn: '978-979-407-182-4',
    ddc: '499.221',
    shelfLocation: 'Rak Referensi R-01',
    category: 'Referensi Induk',
    totalStock: 20,
    availableStock: 20,
    borrowedStock: 0,
    isStandardCover: true,
    maxBorrowDays: 3,
  },
  {
    id: 'B008',
    title: 'Struktur & Integritas Algoritma Modern',
    author: 'Donald E. Knuth',
    publisher: 'Addison-Wesley / Terjemahan',
    year: 2011,
    isbn: '978-0-201-89683-1',
    ddc: '005.1',
    shelfLocation: 'Rak Komputer K-03',
    category: 'Ilmu Komputer',
    totalStock: 3,
    availableStock: 1,
    borrowedStock: 2,
    isStandardCover: true,
    maxBorrowDays: 7,
  },
  {
    id: 'B009',
    title: 'Sejarah Pergerakan Nasional Indonesia',
    author: 'Sartono Kartodirdjo',
    publisher: 'Gramedia Pustaka Utama',
    year: 1993,
    isbn: '978-979-403-112-5',
    ddc: '959.8',
    shelfLocation: 'Rak Sejarah S-02',
    category: 'Sejarah Nasional',
    totalStock: 4,
    availableStock: 0,
    borrowedStock: 4,
    isStandardCover: true,
    maxBorrowDays: 7,
  },
];

let transactions = [
  {
    id: 'PJM-2026-0812',
    borrowerName: 'Ahmad Fauzi',
    borrowerId: 'NIM 220108234',
    borrowerType: 'MAHASISWA',
    bookId: 'B010',
    bookTitle: 'Arsitektur Modern Nusantara',
    bookAuthor: 'Eko Prawoto',
    borrowDate: '2026-11-09',
    dueDate: '2026-11-16',
    status: 'DIPINJAM',
    fineAmount: 0,
    notes: 'Jatuh tempo hari ini! Perlu konfirmasi perpanjangan atau pengembalian.',
  },
  {
    id: 'PJM-2026-0811',
    borrowerName: 'Siti Sarah',
    borrowerId: 'NIP 19920315',
    borrowerType: 'DOSEN',
    bookId: 'B011',
    bookTitle: 'Pengantar Ilmu Sejarah',
    bookAuthor: 'Kuntowijoyo',
    borrowDate: '2026-11-02',
    dueDate: '2026-11-09',
    returnDate: '2026-11-08',
    status: 'KEMBALI',
    fineAmount: 0,
  },
  {
    id: 'PJM-2026-0810',
    borrowerName: 'Budi Santoso',
    borrowerId: 'NIM 210204112',
    borrowerType: 'MAHASISWA',
    bookId: 'B012',
    bookTitle: 'Kalkulus Edisi Kelima',
    bookAuthor: 'James Stewart',
    borrowDate: '2026-11-11',
    dueDate: '2026-11-18',
    status: 'DIPINJAM',
    fineAmount: 0,
  },
  {
    id: 'PJM-2026-0809',
    borrowerName: 'Maya Anggraini',
    borrowerId: 'NIP 19890721',
    borrowerType: 'STAF',
    bookId: 'B013',
    bookTitle: 'Tata Kelola Perkotaan',
    bookAuthor: 'Nirwono Joga',
    borrowDate: '2026-11-01',
    dueDate: '2026-11-08',
    returnDate: '2026-11-07',
    status: 'KEMBALI',
    fineAmount: 0,
  },
  {
    id: 'PJM-2026-0808',
    borrowerName: 'Hendra Setiawan',
    borrowerId: 'NIM 200501899',
    borrowerType: 'MAHASISWA',
    bookId: 'B014',
    bookTitle: 'Rekayasa Perangkat Lunak',
    bookAuthor: 'Roger S. Pressman',
    borrowDate: '2026-10-31',
    dueDate: '2026-11-07',
    status: 'TERLAMBAT',
    daysLate: 9,
    fineAmount: 9000,
  },
  {
    id: 'PJM-2026-0807',
    borrowerName: 'Dewi Lestari',
    borrowerId: 'NIP 19951104',
    borrowerType: 'DOSEN',
    bookId: 'B005',
    bookTitle: 'Cantik Itu Luka',
    bookAuthor: 'Eka Kurniawan',
    borrowDate: '2026-10-25',
    dueDate: '2026-11-01',
    returnDate: '2026-11-01',
    status: 'KEMBALI',
    fineAmount: 0,
  },
  {
    id: 'PJM-2026-0806',
    borrowerName: 'Rizky Pratama',
    borrowerId: 'NIM 230409551',
    borrowerType: 'MAHASISWA',
    bookId: 'B015',
    bookTitle: 'Nirmana: Dasar Tata Rupa',
    bookAuthor: 'Sadarman',
    borrowDate: '2026-11-15',
    dueDate: '2026-11-22',
    status: 'DIPINJAM',
    fineAmount: 0,
  },
  {
    id: 'PJM-2026-0805',
    borrowerName: 'Prof. Bambang H.',
    borrowerId: 'NIP 19680410',
    borrowerType: 'DOSEN',
    bookId: 'B016',
    bookTitle: 'Introduction to Quantum Mechanics',
    bookAuthor: 'David J. Griffiths',
    borrowDate: '2026-10-20',
    dueDate: '2026-10-27',
    returnDate: '2026-10-26',
    status: 'KEMBALI',
    fineAmount: 0,
  },
];

let alerts = [
  {
    id: 'ALERT-01',
    bookTitle: 'Bumi Manusia',
    bookAuthor: 'Pramoedya Ananta Toer',
    borrowerName: 'Ratna Indah',
    borrowerId: 'NIM 220301912',
    dueDate: '2026-11-18',
    daysRemaining: 2,
    notified: false,
  },
  {
    id: 'ALERT-02',
    bookTitle: 'Negeri 5 Menara',
    bookAuthor: 'Ahmad Fuadi',
    borrowerName: 'Fajar Ramadhan',
    borrowerId: 'NIM 210103445',
    dueDate: '2026-11-19',
    daysRemaining: 3,
    notified: false,
  },
  {
    id: 'ALERT-03',
    bookTitle: 'Laskar Pelangi',
    bookAuthor: 'Andrea Hirata',
    borrowerName: 'Dian Safitri',
    borrowerId: 'NIP 19910408',
    dueDate: '2026-11-20',
    daysRemaining: 4,
    notified: true,
  },
];

function getStats() {
  const totalTitles = books.length;
  const availableShelfStock = books.reduce((acc, b) => acc + b.availableStock, 0);
  const activeLoans = transactions.filter((t) => t.status === 'DIPINJAM' || t.status === 'TERLAMBAT').length;
  const completedReturns = transactions.filter((t) => t.status === 'KEMBALI').length;
  const totalTrx = transactions.length;
  const returnRatePercent = totalTrx > 0 ? Math.round((completedReturns / totalTrx) * 100) : 91;

  return {
    totalTitles,
    newTitlesThisMonth: 6,
    availableShelfStock,
    activeLoans,
    completedReturns,
    returnRatePercent,
    terminalId: 'POS-SIRKULASI-01',
    archiveCode: 'ARC-TRX-2026.Q1',
  };
}

function parseJsonBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', (chunk) => (body += chunk));
    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch (err) {
        reject(err);
      }
    });
  });
}

const server = http.createServer(async (req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;
  const method = req.method;

  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  // --- API ENDPOINTS ---
  if (pathname === '/api/stats' && method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ success: true, data: { stats: getStats(), alerts, recentTransactions: transactions.slice(0, 5) } }));
    return;
  }

  if (pathname === '/api/books' && method === 'GET') {
    const q = (parsedUrl.query.q || '').toLowerCase();
    let result = books;
    if (q) {
      result = result.filter((b) => b.title.toLowerCase().includes(q) || b.author.toLowerCase().includes(q) || b.id.toLowerCase().includes(q));
    }
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ success: true, count: result.length, data: result }));
    return;
  }

  if (pathname === '/api/books' && method === 'POST') {
    try {
      const body = await parseJsonBody(req);
      const newBook = {
        id: body.id || `B0${String(books.length + 1).padStart(2, '0')}`,
        title: body.title || 'Buku Baru',
        author: body.author || 'Penulis',
        publisher: body.publisher || 'Penerbit Pustaka',
        year: Number(body.year || 2026),
        isbn: body.isbn || `978-602-000-0`,
        ddc: body.ddc || '000.0',
        shelfLocation: body.shelfLocation || 'Rak Meja 01',
        category: body.category || 'Koleksi Umum',
        totalStock: Number(body.totalStock || 1),
        availableStock: Number(body.totalStock || 1),
        borrowedStock: 0,
        isStandardCover: body.isStandardCover ?? true,
        maxBorrowDays: 7,
      };
      books.unshift(newBook);
      res.writeHead(201, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: true, data: newBook }));
    } catch (e) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: false, message: e.message }));
    }
    return;
  }

  if (pathname === '/api/transactions' && method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ success: true, count: transactions.length, data: transactions }));
    return;
  }

  if (pathname === '/api/transactions' && method === 'POST') {
    try {
      const body = await parseJsonBody(req);
      const book = books.find((b) => b.id === body.bookId);
      if (!book || book.availableStock <= 0) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, message: 'Stok buku habis!' }));
        return;
      }
      book.availableStock -= 1;
      book.borrowedStock += 1;

      const newTx = {
        id: `PJM-2026-0${813 + transactions.length}`,
        borrowerName: body.borrowerName,
        borrowerId: body.borrowerId,
        borrowerType: body.borrowerType || 'MAHASISWA',
        bookId: book.id,
        bookTitle: book.title,
        bookAuthor: book.author,
        borrowDate: new Date().toISOString().split('T')[0],
        dueDate: new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
        status: 'DIPINJAM',
        fineAmount: 0,
      };
      transactions.unshift(newTx);
      res.writeHead(201, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: true, data: newTx }));
    } catch (e) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: false, message: e.message }));
    }
    return;
  }

  if (pathname === '/api/transactions' && method === 'PUT') {
    try {
      const body = await parseJsonBody(req);
      const tx = transactions.find((t) => t.id === body.transactionId);
      if (!tx) {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, message: 'Transaksi tidak ditemukan.' }));
        return;
      }
      if (tx.status === 'KEMBALI') {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, message: 'Sudah pernah dikembalikan (pencegahan duplikasi aktif).' }));
        return;
      }
      tx.status = 'KEMBALI';
      tx.returnDate = new Date().toISOString().split('T')[0];
      const book = books.find((b) => b.id === tx.bookId);
      if (book) {
        book.availableStock = Math.min(book.totalStock, book.availableStock + 1);
        book.borrowedStock = Math.max(0, book.borrowedStock - 1);
      }
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: true, data: tx }));
    } catch (e) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: false, message: e.message }));
    }
    return;
  }

  // --- SERVE STATIC FRONTEND (public/index.html) ---
  let filePath = path.join(PUBLIC_DIR, pathname === '/' ? 'index.html' : pathname);
  if (!fs.existsSync(filePath)) {
    filePath = path.join(PUBLIC_DIR, 'index.html');
  }

  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('File Not Found');
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    const mimeTypes = {
      '.html': 'text/html',
      '.css': 'text/css',
      '.js': 'application/javascript',
      '.json': 'application/json',
      '.png': 'image/png',
      '.jpg': 'image/jpeg',
      '.svg': 'image/svg+xml',
    };

    res.writeHead(200, { 'Content-Type': mimeTypes[ext] || 'text/html' });
    res.end(data);
  });
});

server.listen(PORT, () => {
  console.log(`\n================================================================`);
  console.log(`  PUSTAKA PETUGAS - SISTEM SIRKULASI PERPUSTAKAAN INTERNAL`);
  console.log(`  Server aktif di: http://127.0.0.1:${PORT}`);
  console.log(`  Database status: IN-MEMORY RECONCILED (READY)`);
  console.log(`================================================================\n`);
});
