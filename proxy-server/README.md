# Yahoo Finance Proxy Server

Proxy server sederhana untuk mengatasi masalah CORS saat mengakses Yahoo Finance API dari browser.

## Cara Deploy ke Heroku

1. Pastikan Anda memiliki akun Heroku dan Heroku CLI terinstal
2. Login ke Heroku CLI:
   ```
   heroku login
   ```
3. Buat aplikasi Heroku baru:
   ```
   heroku create nama-aplikasi-anda
   ```
4. Deploy ke Heroku:
   ```
   git init
   git add .
   git commit -m "Initial commit"
   git push heroku master
   ```
5. Buka aplikasi Anda:
   ```
   heroku open
   ```

## Cara Menggunakan

Setelah di-deploy, Anda dapat menggunakan proxy dengan URL:

```
https://nama-aplikasi-anda.herokuapp.com/yahoo-finance?symbol=RAJA.JK&interval=1m&range=1d
```

Parameter yang didukung:
- `symbol`: Kode saham (default: RAJA.JK)
- `interval`: Interval data (default: 1m)
- `range`: Rentang waktu (default: 1d)

## Mengupdate File HTML

Setelah deploy, jangan lupa untuk mengupdate file `raja_chart_yahoo.html` dengan nama aplikasi Heroku Anda yang sebenarnya:

```javascript
const proxyUrl = 'https://NAMA-APLIKASI-ANDA.herokuapp.com/yahoo-finance';
```

Ganti `NAMA-APLIKASI-ANDA` dengan nama aplikasi Heroku yang Anda buat.
