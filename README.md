# 🌿 TOM_iTECH Plant Panel

> Smart Monitoring System for Your Plants — powered by TOM_iTECH Project.

---

## 🧠 Overview
**TOM_iTECH Plant Panel** adalah proyek sistem pemantauan tanaman berbasis teknologi Internet of Things (IoT).  
Proyek ini dirancang untuk membaca, menampilkan, dan menganalisis kondisi tanaman secara real-time seperti:
- 🌡️ Suhu lingkungan  
- 💧 Kelembapan udara  
- 🌱 Kelembapan tanah  
- ☀️ Intensitas cahaya  

Data dari sensor dikirim ke panel utama (Plant Panel) yang menampilkan status tanaman secara dinamis dan menarik.

---

## ⚙️ Teknologi yang Digunakan
| Komponen | Deskripsi |
|-----------|------------|
| 🧩 **ESP32 / Arduino** | Mikrokontroler utama untuk membaca data sensor |
| 🌐 **Wi-Fi / MQTT / HTTP** | Protokol komunikasi ke panel |
| 💻 **Frontend (HTML/CSS/JS)** | Tampilan dashboard monitoring |
| 🧠 **Backend (Node.js / Express)** | Penghubung data sensor ke server |
| 📊 **Database (optional)** | Penyimpanan historis data tanaman |

---

## 🎯 Tujuan Proyek
Menjadi panel pemantau tanaman sederhana namun powerful — cocok untuk:
- Proyek belajar IoT 🌱  
- Eksperimen AI dan otomasi pertanian 🤖  
- Sistem greenhouse pintar 🏡  

---

## 🚀 Cara Menjalankan
```bash
# 1. Clone repository
git clone https://github.com/Wahidiningrat/TOM_iTech-Plant-Panel.git

# 2. Masuk ke folder project
cd TOM_iTech-Plant-Panel

# 3. Jalankan server (jika ada)
npm install
npm start
