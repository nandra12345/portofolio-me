# Portfolio Website dengan Komentar Live

Website portfolio modern dengan fitur komentar real-time menggunakan PHP, MySQL, dan Tailwind CSS.

## 🚀 Fitur Utama

- ✨ Desain dark theme dengan gradien biru elegan
- 📱 Fully responsive (mobile-first)
- 💬 Sistem komentar live dengan auto-refresh
- 🎓 Showcase skills dan sertifikat dalam card interaktif
- 🔗 Integrasi sosial media
- 🛡️ Rate limiting dan sanitasi input untuk keamanan

## 📋 Teknologi

- **Frontend**: HTML5, Tailwind CSS, Vanilla JavaScript
- **Backend**: PHP 7.4+ dengan PDO
- **Database**: MySQL 5.7+ / MariaDB
- **Font**: Google Fonts (Poppins)
- **Icons**: Font Awesome 6

## 🛠️ Setup Lokal

### Prerequisites
- PHP 7.4 atau lebih baru
- MySQL 5.7+ / MariaDB
- Web server (Apache/Nginx) atau PHP built-in server
- Browser modern

### Langkah Instalasi

1. **Clone/Download Repository**
   ```bash
   # Letakkan folder di htdocs (XAMPP) atau www (WAMP)
   ```

2. **Setup Database**
   ```bash
   # Buka phpMyAdmin atau MySQL CLI
   # Import file database/schema.sql
   mysql -u root -p portfolio_db < database/schema.sql
   ```

3. **Konfigurasi Database**
   ```bash
   # Copy .env.example ke .env atau edit langsung config.php
   cp .env.example api/config.php
   ```
   
   Edit `api/config.php` sesuai setting MySQL lokal:
   ```php
   define('DB_HOST', 'localhost');
   define('DB_NAME', 'portfolio_db');
   define('DB_USER', 'root');
   define('DB_PASS', ''); // password MySQL kamu
   ```

4. **Jalankan Server Lokal**
   
   **Opsi A - XAMPP/WAMP:**
   - Start Apache & MySQL
   - Akses: `http://localhost/portfolio/`
   
   **Opsi B - PHP Built-in Server:**
   ```bash
   cd portfolio
   php -S localhost:8000
   ```
   - Akses: `http://localhost:8000`

5. **Test Komentar**
   - Scroll ke bagian Comments
   - Isi form dan submit
   - Komentar akan muncul otomatis dalam 5 detik

## 📱 Akses dari Mobile

### Dalam Jaringan Lokal (LAN)
1. Pastikan PC dan HP terhubung ke WiFi yang sama
2. Cari IP address PC kamu:
   - Windows: `ipconfig` (cari IPv4)
   - Mac/Linux: `ifconfig` atau `ip addr`
3. Di HP, akses: `http://[IP-PC]:8000` (contoh: `http://192.168.1.100:8000`)

### Deploy Online (Rekomendasi)
- **Hosting Gratis**: InfinityFree, 000webhost, Freehostia
- **Hosting Berbayar**: Hostinger, Niagahoster, DomaiNesia
- Upload via FTP/cPanel File Manager
- Import database via phpMyAdmin

## ⚙️ Konfigurasi

### Ubah Polling Interval Komentar
Edit `assets/js/app.js` baris 95:
```javascript
const POLLING_INTERVAL = 5000; // ubah ke 3000 untuk 3 detik
```

### Ubah Rate Limiting
Edit `api/comments.php` baris 15:
```php
define('RATE_LIMIT_SECONDS', 60); // minimal jeda antar komentar
```

### Ubah Warna Tema
Edit custom properties di `index.html` bagian `<style>`:
```css
:root {
  --color-primary: #2dd4bf; /* ubah ke warna pilihanmu */
}
```

## 🔒 Keamanan

### Implemented
- ✅ PDO Prepared Statements (SQL Injection prevention)
- ✅ Input sanitasi dengan `htmlspecialchars()`
- ✅ Rate limiting berbasis IP
- ✅ Header CORS restriction
- ✅ XSS protection

### Rekomendasi Tambahan
- 🔴 **WAJIB**: Tambahkan Google reCAPTCHA v3 sebelum production
- 🟡 Gunakan HTTPS (SSL/TLS) saat deploy
- 🟡 Implement session-based authentication untuk admin panel
- 🟡 Backup database secara berkala

## 🚀 Migrasi ke Teknologi Lain

### Dari Polling ke WebSocket
Ganti AJAX polling dengan library WebSocket (Socket.io, Pusher, Ably):
```javascript
// Contoh dengan Pusher
const pusher = new Pusher('YOUR_KEY');
const channel = pusher.subscribe('comments');
channel.bind('new-comment', function(data) {
  addCommentToDOM(data);
});
```

### Dari PHP/MySQL ke Serverless
Alternatif stack modern tanpa PHP hosting:
- **Supabase**: Database + Auth + Realtime (gratis)
- **Firebase**: Firestore + Cloud Functions
- **PlanetScale**: MySQL serverless
- Frontend tetap sama, hanya ganti endpoint API

## 🎨 Kustomisasi

### Ganti Data Pribadi
Edit `index.html`:
- Baris 85-95: Data "Tentang Saya"
- Baris 120-180: Skills & level
- Baris 200-280: Sertifikat
- Baris 320-340: Link sosial media

### Tambah Skill/Sertifikat Baru
Duplikasi block card yang sudah ada dan edit isinya.

## 🐛 Troubleshooting

**Komentar tidak muncul:**
- Cek console browser (F12) untuk error
- Pastikan database connected (cek `api/config.php`)
- Cek permission folder `api/` harus executable

**Error 404 di `/api/comments`:**
- Pastikan `.htaccess` ada (untuk Apache)
- Atau akses langsung `api/comments.php`

**Rate limiting terlalu ketat:**
- Edit `RATE_LIMIT_SECONDS` di `api/comments.php`
- Atau hapus temporary IP blocks di database

## 📞 Support

Jika ada masalah teknis, cek:
- PHP error log: `error_log` di folder PHP
- MySQL error log: phpMyAdmin > SQL tab
- Browser console: F12 > Console

## 📜 License

Free to use untuk personal portfolio. Jika mau modifikasi untuk komersial, silakan.

---

**Dibuat dengan ❤️ menggunakan Tailwind CSS & PHP**