# Portal Pengajuan Kredit PT. JKL

Web sederhana untuk mendigitalisasi proses pengajuan kredit kendaraan, mulai dari pengajuan oleh sales hingga pencairan dana.

Project ini dibuat sebagai implementasi **Soal 2.a**.

##  Cara Menjalankan

Project ini merupakan aplikasi berbasis HTML, CSS, dan JavaScript sehingga **tidak memerlukan instalasi atau server**.

1. Ekstrak folder project.
2. Buka file `index.html` menggunakan browser.
3. Aplikasi siap digunakan.

## Struktur File

```text
├── index.html   # Struktur halaman
├── style.css    # Styling dan tampilan aplikasi
└── app.js       # Logika dan alur aplikasi
```

##  Alur Penggunaan

Aplikasi memiliki beberapa peran yang dapat dipilih melalui tombol di bagian atas halaman.

### 1. Sales Dealer

* Pilih **Sales Dealer**.
* Klik **Buat Pengajuan**.
* Isi data pengajuan kredit.
* Upload 4 dokumen yang diperlukan.
* Kirim pengajuan.

### 2. Marketing

* Pilih **Marketing**.
* Periksa pengajuan yang masuk.
* Klik **Submit ke Atasan**.

### 3. Atasan Marketing

* Pilih **Atasan Marketing**.
* Periksa pengajuan.
* Pilih **Setujui** atau **Tolak**.
* Jika pengajuan ditolak, catatan penolakan wajib diisi.

### 4. Admin Backoffice

* Pilih **Admin Backoffice**.
* Klik **Buat Kontrak dan PO**.

### 5. Konsumen

* Pilih **Konsumen**.
* Masukkan nama sesuai dengan data pengajuan.
* Klik **Tanda Tangan Dokumen**.

### 6. Pencairan Dana

* Kembali ke **Admin Backoffice**.
* Klik **Cairkan Dana** untuk menyelesaikan proses pengajuan.

## Penyimpanan Data

Data aplikasi disimpan menggunakan **localStorage** pada browser.

Untuk mengembalikan aplikasi ke data contoh/default:

1. Buka pengaturan browser.
2. Hapus **cookie dan data situs** untuk halaman aplikasi.
3. Muat ulang halaman.

> Catatan: Menghapus data situs juga akan menghapus data pengajuan yang tersimpan di browser.

## Catatan

* Aplikasi belum menggunakan database.
* Belum tersedia sistem autentikasi/login.
* Pemilihan role masih dilakukan secara bebas melalui tombol pada halaman.
* Data hanya tersimpan secara lokal menggunakan `localStorage`.
* Perhitungan estimasi angsuran menggunakan asumsi **bunga flat 9% per tahun** dan bukan perhitungan kredit dari lembaga pembiayaan sebenarnya.

## 🛠️ Teknologi

* HTML
* CSS
* JavaScript
* LocalStorage
