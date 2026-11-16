const http = require('http');

function makeRequest(path, method = 'GET', data = null) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: '127.0.0.1',
      port: 3000,
      path,
      method,
      headers: {
        'Content-Type': 'application/json',
      },
    };

    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => (body += chunk));
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, headers: res.headers, data: body ? JSON.parse(body) : null });
        } catch {
          resolve({ status: res.statusCode, headers: res.headers, data: body });
        }
      });
    });

    req.on('error', reject);
    if (data) {
      req.write(JSON.stringify(data));
    }
    req.end();
  });
}

async function runTests() {
  console.log('--- MENJALANKAN INTEGRATION TESTS UNTUK PUSTAKA PETUGAS ---');

  // Test 1: GET /api/stats
  console.log('1. Menguji GET /api/stats...');
  const statsRes = await makeRequest('/api/stats');
  console.log(`   Status: ${statsRes.status}`);
  console.log(`   Total Koleksi: ${statsRes.data.data.stats.totalTitles} Judul`);
  console.log(`   Sirkulasi Aktif: ${statsRes.data.data.stats.activeLoans} Transaksi`);
  console.log(`   Tingkat Kembali: ${statsRes.data.data.stats.returnRatePercent}%`);
  if (statsRes.status !== 200) throw new Error('Stats test failed');

  // Test 2: GET /api/books
  console.log('2. Menguji GET /api/books...');
  const booksRes = await makeRequest('/api/books');
  console.log(`   Status: ${booksRes.status}`);
  console.log(`   Jumlah Buku Terdaftar: ${booksRes.data.count}`);
  if (booksRes.status !== 200 || booksRes.data.count < 9) throw new Error('Books test failed');

  // Test 3: POST /api/transactions (Peminjaman Baru)
  console.log('3. Menguji POST /api/transactions (Pinjam Buku B001)...');
  const borrowRes = await makeRequest('/api/transactions', 'POST', {
    bookId: 'B001',
    borrowerName: 'Test QA Engineer',
    borrowerId: 'NIM 99990001',
    borrowerType: 'MAHASISWA',
    daysToBorrow: 7,
  });
  console.log(`   Status: ${borrowRes.status}`);
  console.log(`   ID Transaksi Baru: ${borrowRes.data.data.id}`);
  console.log(`   Buku: ${borrowRes.data.data.bookTitle}`);
  if (borrowRes.status !== 201) throw new Error('Borrow test failed');

  // Test 4: PUT /api/transactions (Pengembalian Buku)
  console.log('4. Menguji PUT /api/transactions (Pengembalian Buku & +1 Stok)...');
  const returnRes = await makeRequest('/api/transactions', 'PUT', {
    transactionId: borrowRes.data.data.id,
  });
  console.log(`   Status: ${returnRes.status}`);
  console.log(`   Status Transaksi: ${returnRes.data.data.status}`);
  if (returnRes.status !== 200 || returnRes.data.data.status !== 'KEMBALI') throw new Error('Return test failed');

  // Test 5: Pencegahan Pengembalian Ganda
  console.log('5. Menguji Proteksi Pencegahan Pengembalian Ganda...');
  const doubleReturnRes = await makeRequest('/api/transactions', 'PUT', {
    transactionId: borrowRes.data.data.id,
  });
  console.log(`   Status Duplikasi: ${doubleReturnRes.status} (Ditolak Sesuai Ekspektasi)`);
  console.log(`   Pesan: ${doubleReturnRes.data.message}`);
  if (doubleReturnRes.status !== 400) throw new Error('Double return prevention test failed');

  // Test 6: GET / (Frontend HTML UI)
  console.log('6. Menguji GET / (Frontend UI & Google Stitch Template)...');
  const uiRes = await makeRequest('/');
  console.log(`   Status: ${uiRes.status}`);
  console.log(`   Content-Type: ${uiRes.headers['content-type']}`);
  if (uiRes.status !== 200 || !uiRes.data.includes('Pustaka Petugas')) throw new Error('UI delivery failed');

  console.log('\n>>> SEMUA 6 INTEGRATION TESTS BERHASIL 100%! <<<\n');
  process.exit(0);
}

// Start server first then run tests
const serverProcess = require('./standalone-server.js');
setTimeout(() => {
  runTests().catch((err) => {
    console.error('Test error:', err);
    process.exit(1);
  });
}, 1000);
