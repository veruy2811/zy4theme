Lu adalah senior frontend developer yang sangat paham Pterodactyl Panel, Laravel, React, TypeScript, TailwindCSS, styled-components, CSS module, Webpack/Vite, dan struktur frontend Pterodactyl.

Tugas lu adalah membuat theme custom Pterodactyl Panel bernama “ZY4 Theme” berdasarkan gambar referensi dashboard yang gua kasih lewat raw URL.

REFERENCE_IMAGE_URL = "https://raw.githubusercontent.com/veruy2811/theme/refs/heads/main/preview.png"

==================================================
TUJUAN UTAMA
==================================================

Buat theme frontend Pterodactyl bernama:

ZY4 Theme

Theme harus terlihat sangat mirip dengan gambar referensi dari REFERENCE_IMAGE_URL.

Wajib:
1. Buka / akses / analisis gambar dari REFERENCE_IMAGE_URL.
2. Jadikan gambar itu sebagai target visual utama.
3. Implementasikan tampilannya ke frontend Pterodactyl yang ada di project ini.
4. Jangan cuma bikin HTML preview statis.
5. Jangan merusak logic asli Pterodactyl.
6. Jangan copy theme Stellar/Apollo secara langsung.
7. Buat desain original dengan style premium futuristic seperti gambar referensi.

Kalau AI tidak bisa membuka URL gambar:
- Tetap buat theme berdasarkan deskripsi detail di prompt ini.
- Jangan berhenti.
- Jangan minta ulang kecuali benar-benar perlu.

==================================================
TARGET VISUAL DARI GAMBAR REFERENSI
==================================================

Theme harus berbentuk dashboard hosting panel dark futuristic.

Komposisi utama:
- Sidebar fixed di kiri.
- Topbar di atas.
- Dashboard content di kanan.
- Hero card besar.
- Row statistic cards.
- Live console panel.
- Analytics overview chart.
- Your Servers section.
- Footer kecil.

Style visual:
- Dark navy / near black background.
- Neon purple, blue, cyan.
- Glassmorphism cards.
- Border tipis transparan.
- Shadow halus.
- Glow neon.
- Rounded corner besar.
- Clean premium dashboard.
- Cyberpunk / space / futuristic style.
- Layout rapi seperti SaaS premium panel.

==================================================
NAMA DAN BRANDING
==================================================

Theme Name:
ZY4 Theme

Logo text:
ZY4 THEME

Subtitle:
PTERODACTYL PANEL

User fallback:
CaptainZy4

Role fallback:
Administrator

Footer:
© 2026 ZY4 Theme
Crafted for Performance
ZY4 Theme is not affiliated with Pterodactyl®.
Version: v1.0.0

Catatan:
Kalau data user asli dari Pterodactyl tersedia, gunakan data asli.
CaptainZy4 hanya fallback/demo.

==================================================
WARNA THEME
==================================================

Gunakan CSS variables ini:

:root {
  --zy4-bg: #050816;
  --zy4-bg-soft: #070b1f;
  --zy4-bg-panel: #090d24;

  --zy4-card: rgba(15, 23, 42, 0.68);
  --zy4-card-hover: rgba(30, 41, 59, 0.78);
  --zy4-sidebar: rgba(5, 8, 22, 0.94);
  --zy4-topbar: rgba(5, 8, 22, 0.72);

  --zy4-border: rgba(148, 163, 184, 0.15);
  --zy4-border-strong: rgba(124, 58, 237, 0.35);

  --zy4-primary: #7c3aed;
  --zy4-secondary: #2563eb;
  --zy4-cyan: #06b6d4;
  --zy4-blue: #3b82f6;
  --zy4-green: #22c55e;
  --zy4-danger: #ef4444;
  --zy4-warning: #f59e0b;

  --zy4-text: #f8fafc;
  --zy4-muted: #94a3b8;
  --zy4-muted-soft: #64748b;

  --zy4-radius: 18px;
  --zy4-radius-lg: 24px;

  --zy4-shadow: 0 20px 60px rgba(0, 0, 0, 0.45);
  --zy4-glow-purple: 0 0 35px rgba(124, 58, 237, 0.35);
  --zy4-glow-blue: 0 0 35px rgba(37, 99, 235, 0.3);
  --zy4-glow-cyan: 0 0 28px rgba(6, 182, 212, 0.25);
}

==================================================
GLOBAL STYLE
==================================================

Buat global style supaya panel punya tampilan seperti gambar.

Wajib ada:
- background radial-gradient gelap
- background orb/glow ungu dan biru
- glass card
- backdrop-filter blur
- neon border
- custom scrollbar
- smooth transition 200ms - 300ms
- hover card naik sedikit
- focus state yang jelas
- responsive media query
- font modern

Gunakan font:
- Inter untuk UI
- JetBrains Mono / monospace untuk console

Kalau font tidak tersedia, pakai fallback system font.

==================================================
STRUKTUR FILE YANG DIHARAPKAN
==================================================

Scan dulu struktur project Pterodactyl ini.

Biasanya frontend ada di:
resources/scripts

Cari:
- entrypoint frontend
- router
- dashboard/home page
- server list page
- server detail page
- navigation/sidebar component
- topbar/header component
- console component
- file manager component
- CSS global

Buat folder theme baru jika memungkinkan:

resources/scripts/zy4theme/
  components/
    Zy4Layout.tsx
    Zy4Sidebar.tsx
    Zy4Topbar.tsx
    Zy4Hero.tsx
    Zy4StatsCard.tsx
    Zy4ProgressRing.tsx
    Zy4Sparkline.tsx
    Zy4ConsolePreview.tsx
    Zy4Analytics.tsx
    Zy4ServerCard.tsx
    Zy4StatusBadge.tsx
    Zy4Footer.tsx
  data/
    zy4DemoData.ts
  styles/
    zy4-theme.css
  index.ts

Kalau struktur project beda:
- Jangan maksa.
- Ikuti pattern project.
- Buat file sesuai lokasi yang benar.
- Import CSS ke entrypoint yang benar.
- Integrasikan component ke layout/dashboard existing.

==================================================
HALAMAN YANG HARUS DISTYLE
==================================================

Minimal restyle:
1. Dashboard / Home
2. Server list
3. Server detail
4. Console page
5. File manager page
6. Database page
7. Schedules page
8. Account dropdown
9. Login page jika memungkinkan

Penting:
- Jangan ubah logic API.
- Jangan ubah auth/session.
- Jangan ubah permission.
- Jangan ubah websocket console.
- Jangan ubah server power action.
- Jangan ubah file manager backend.
- Jangan hapus komponen asli kalau masih dipakai logic-nya.
- Fokus restyle dan wrapper UI.

==================================================
LAYOUT UTAMA
==================================================

Buat layout desktop seperti gambar:

Sidebar:
- fixed kiri
- lebar sekitar 260px - 280px
- tinggi 100vh
- dark glass panel
- border kanan transparan
- logo di atas
- menu vertical
- status card di bawah
- footer kecil di bawah

Main content:
- margin-left sesuai sidebar
- min-height 100vh
- background gelap
- padding 24px
- topbar fixed/sticky di atas content
- dashboard grid rapi

Responsive:
Desktop:
- sidebar fixed
- content grid 12 kolom
- metric cards horizontal

Tablet:
- sidebar lebih kecil / collapsible
- cards jadi 2 kolom

Mobile:
- sidebar jadi drawer/collapsible
- content full width
- cards 1 kolom
- console horizontal scroll
- tidak boleh overflow layar

==================================================
SIDEBAR DETAIL
==================================================

Sidebar harus sangat mirip gambar.

Atas:
Logo:
ZY4 THEME

Subtitle:
PTERODACTYL PANEL

Tambahkan tombol collapse kecil di kanan logo jika memungkinkan.

Menu:
- Dashboard
- Servers
- Console
- Files
- Databases
- Schedules
- Users
- Settings

Setiap menu:
- icon kiri
- label kanan
- rounded 10px - 14px
- hover background rgba
- active state gradient blue-purple
- active state glow
- active state border neon

Active Dashboard style:
background: linear-gradient(135deg, rgba(124,58,237,.9), rgba(37,99,235,.75));
box-shadow: 0 0 25px rgba(124,58,237,.45);

Bawah sidebar:
Panel Status card:
- dot hijau
- text kecil: Panel Status
- text besar: Online
- text kecil: All systems operational
- mini sparkline ungu kecil

Footer sidebar:
© 2026 ZY4 Theme
Crafted for Performance
icon hati kecil ungu

==================================================
TOPBAR DETAIL
==================================================

Topbar berada di atas dashboard content.

Isi:
1. Search box
   Placeholder:
   Search anything...

   Di kanan search box ada badge:
   CTRL K

2. Icon kanan:
   - activity icon
   - layers/server icon
   - notification bell
   - badge angka 3

3. Profile area:
   Avatar bulat
   Dot online hijau
   Nama:
   CaptainZy4
   Role:
   Administrator
   Dropdown arrow

Kalau project punya data user asli:
- gunakan nama user asli
- gunakan email/avatar asli kalau tersedia
- role fallback Administrator jika tidak tersedia

Style:
- topbar glass
- border bottom transparan
- search input gelap
- icon hover glow
- notification badge ungu

==================================================
DASHBOARD HERO CARD
==================================================

Buat hero card besar di atas dashboard.

Text kiri:
Welcome back,

Judul besar:
ZY4 Theme

Deskripsi:
Next-gen Pterodactyl theme with futuristic design, powerful features, and unmatched performance.

Style judul:
- “ZY4” putih
- “Theme” gradient blue-purple

Background hero:
- dark glass
- radial glow
- planet/space arc pakai CSS gradient
- star/noise subtle kalau bisa pakai CSS
- border neon halus

Stat kecil di hero:
- Servers 12
- Users 48
- Uptime 99.98%

Kanan hero:
- logo neon besar “Z4” atau “ZY4”
- gunakan CSS text/logo glow
- jangan butuh image eksternal wajib

Kalau data asli tersedia:
- Servers ambil jumlah server asli
- Users jika tidak tersedia fallback 48
- Uptime fallback 99.98%

==================================================
RESOURCE STAT CARDS
==================================================

Buat row cards seperti gambar:

1. CPU Usage
   Overall Usage
   Value: data asli kalau ada, fallback 23.6%

2. RAM Usage
   Overall Usage
   Value: data asli kalau ada, fallback 48.7%

3. Disk Usage
   Overall Usage
   Value: data asli kalau ada, fallback 61.2%

4. Network
   Inbound / Outbound
   Value: data asli kalau ada, fallback 324.7 Mbps

5. Active Servers
   Currently Online
   Value: data asli kalau ada, fallback 8 / 12

Setiap card:
- icon neon
- title
- subtitle
- value besar
- circular progress atau progress bar
- network card pakai mini sparkline
- active servers pakai progress bar hijau
- hover glow

Progress ring:
- pakai CSS conic-gradient kalau tidak ada library
- jangan tambah dependency baru kalau tidak perlu

==================================================
LIVE CONSOLE PANEL
==================================================

Buat panel Live Console di bagian tengah kiri.

Header:
Live Console

Button kanan:
Open Console

Isi fallback logs:
[14:23:11] [INFO] Starting server on 0.0.0.0:25565
[14:23:11] [INFO] Using epoll channel type
[14:23:11] [INFO] Paper 1.20.4 starting
[14:23:12] [INFO] Loading libraries, please wait...
[14:23:13] [INFO] Environment: authHost='https://authserver.mojang.com'
[14:23:13] [INFO] Enabling plugins...
[14:23:14] [INFO] Done! For help, type "help"
[14:23:15] [INFO] [WorldGuard] Loaded configuration for world 'world'
[14:23:16] [INFO] [Vault] Enabled Vault
[14:23:16] [INFO] Server permissions file permissions.yml is empty, ignoring it
[14:23:17] [INFO] Server is running with 0/100 players online.

Bawah:
Type a command...

Style:
- terminal background sangat gelap
- font monospace
- timestamp abu
- [INFO] hijau/cyan
- warning kuning
- error merah
- panel scroll
- command input glass/dark

Kalau Pterodactyl sudah punya console asli:
- Jangan ganti websocket logic.
- Jangan ganti command send logic.
- Hanya restyle wrapper, terminal, input, header, button.

==================================================
ANALYTICS OVERVIEW PANEL
==================================================

Buat panel Analytics Overview di bagian tengah kanan.

Header:
Analytics Overview

Dropdown:
Last 7 Days

Chart:
- CPU Usage (%) warna blue
- RAM Usage (%) warna purple
- line chart
- area gradient transparan
- y-axis 0,25,50,75,100
- x-axis May 12 - May 18 fallback

Kalau ada chart library existing, gunakan.
Kalau tidak ada, buat pakai SVG/CSS tanpa dependency baru.

Data fallback:
CPU: [55, 50, 58, 76, 60, 88, 52]
RAM: [22, 30, 42, 38, 28, 40, 43]

Di bawah chart buat mini cards:
- Total Users: 48 +12%
- Total Servers: 12 +8%
- Total Backups: 156 +18%
- Total Databases: 32 +5%

Style:
- grid 4 card kecil
- icon neon
- percentage hijau
- border tipis

==================================================
YOUR SERVERS SECTION
==================================================

Buat section bawah:

Title:
Your Servers

Button kanan:
View All Servers
+ Create Server

Server cards fallback:
1. Minecraft Survival
   Domain: minecraft-survival.zy4.net
   CPU: 2.4%
   RAM: 4.2GB
   Status: Online

2. SA:MP Roleplay
   Domain: samp-roleplay.zy4.net
   CPU: 11.6%
   RAM: 512MB
   Status: Online

3. VPS Hosting
   Domain: vps.zy4.net
   CPU: 7.3%
   RAM: 2GB
   Status: Online

4. Node.js App
   Domain: nodeapp.zy4.net
   CPU: 3.1%
   RAM: 1GB
   Status: Online

Setiap server card:
- icon kiri
- nama server
- domain
- CPU
- RAM
- dot online hijau
- menu titik tiga
- mini sparkline kanan
- hover glow
- border neon saat hover

Kalau Pterodactyl punya data server asli:
- Gunakan list server asli.
- Gunakan fallback hanya jika data kosong atau tidak tersedia.
- Jangan rusak link masuk ke server detail.

==================================================
LOGIN PAGE
==================================================

Kalau login page bisa distyle, ubah jadi:

- background dark futuristic
- glow orb purple/blue
- card login glassmorphism
- logo ZY4 Theme
- input rounded dark
- focus glow
- button gradient purple-blue
- text muted
- error message tetap tampil
- jangan rusak auth logic

==================================================
FILE MANAGER STYLE
==================================================

Restyle file manager:
- background dark
- table/list glass
- folder/file rows rounded
- hover glow
- breadcrumb glass
- action buttons gradient/dark
- editor area dark
- scrollbar custom

Jangan ubah logic upload, rename, delete, edit, permission.

==================================================
DATABASE PAGE STYLE
==================================================

Restyle database page:
- cards glass
- create database button gradient
- table dark
- password/host/user info readable
- modal glass

Jangan ubah API database.

==================================================
SCHEDULES PAGE STYLE
==================================================

Restyle schedules:
- schedule cards glass
- active/inactive badge
- cron info readable
- create schedule button gradient
- modal glass

Jangan ubah schedule API.

==================================================
SERVER DETAIL PAGE
==================================================

Restyle server detail:
- server header glass
- resource usage cards
- power buttons clean
- console dark
- tabs/menu style futuristic
- status badge online/offline/starting/stopping

Power buttons:
- Start: green
- Restart: blue/purple
- Stop: red
- Kill: red/danger

Jangan ubah action logic.

==================================================
ANIMASI
==================================================

Tambahkan animasi halus:
- card hover translateY(-2px)
- border glow saat hover
- active menu glow
- background orb bergerak pelan
- button hover glow
- skeleton/loading pulse kalau data loading

Jangan buat animasi berat.
Jangan bikin panel lag.

==================================================
ACCESSIBILITY
==================================================

Pastikan:
- text readable
- contrast cukup
- focus state ada
- button tetap bisa keyboard focus
- aria-label untuk icon button jika perlu
- jangan hilangkan label penting

==================================================
INTEGRASI DATA PTERODACTYL
==================================================

Gunakan data asli jika tersedia:
- user data
- server list
- resource usage
- console logs
- server status
- permissions
- file manager
- database
- schedule

Fallback demo data hanya untuk dashboard visual jika data asli belum tersedia.

Jangan:
- hardcode semua kalau data asli tersedia
- menghapus API call existing
- mengubah endpoint
- mengubah auth/session
- mengubah permission
- mengubah websocket console
- mengubah file manager logic
- mengubah server power logic

==================================================
KUALITAS KODE
==================================================

Wajib:
- TypeScript valid
- React component reusable
- props jelas
- hindari any berlebihan
- tidak ada unused import
- tidak ada dead code
- tidak ada console.log debug tidak perlu
- build harus lolos
- import path benar
- CSS class rapi
- responsive rapi
- jangan install dependency baru kecuali sangat perlu

Kalau perlu dependency:
- cek package.json dulu
- gunakan dependency existing
- kalau harus install, jelaskan alasannya di komentar/ringkasan

==================================================
CARA KERJA YANG HARUS LU LAKUKAN
==================================================

Lakukan step ini:

1. Scan struktur project.
2. Baca package.json.
3. Identifikasi apakah pakai yarn/npm.
4. Identifikasi entrypoint frontend.
5. Identifikasi layout dashboard Pterodactyl.
6. Identifikasi component server list, console, topbar/sidebar.
7. Buat folder/file ZY4 Theme.
8. Buat CSS global ZY4 Theme.
9. Buat components ZY4.
10. Integrasikan ke dashboard/home.
11. Restyle page utama Pterodactyl.
12. Pastikan responsive.
13. Jalankan typecheck/build kalau environment memungkinkan.
14. Fix error build.
15. Berikan ringkasan file yang dibuat/diubah.
16. Berikan command build untuk Windows.

Command build:
- cek package.json dulu
- kalau yarn:
  yarn install
  yarn build:production
- kalau npm:
  npm install
  npm run build
- jangan asal pilih, lihat script yang tersedia.

==================================================
BATASAN PENTING
==================================================

Jangan membuat:
- standalone index.html
- mockup terpisah yang tidak masuk ke Pterodactyl
- theme yang hanya gambar
- theme yang merusak dashboard asli
- theme yang menghapus fitur Pterodactyl

Boleh membuat:
- component baru
- CSS baru
- wrapper layout baru
- fallback demo data
- helper small chart SVG
- progress ring CSS
- sparkline CSS/SVG

==================================================
OUTPUT AKHIR YANG GUA MAU
==================================================

Setelah selesai, kasih ringkasan:

1. File yang dibuat.
2. File yang diubah.
3. Fitur yang sudah dibuat.
4. Halaman yang sudah distyle.
5. Command build di Windows.
6. Catatan kalau ada bagian yang perlu gua import/manual setup.
7. Cara rollback jika theme error.

==================================================
KESIMPULAN TARGET
==================================================

Hasil akhir harus terlihat seperti gambar referensi:
- sidebar ZY4 Theme kiri
- topbar search/profile
- hero ZY4 Theme
- CPU/RAM/Disk/Network/Active Server cards
- Live Console
- Analytics Overview
- Your Servers cards
- footer
- dark futuristic premium glassmorphism neon purple-blue

Mulai sekarang scan project dan implementasikan ZY4 Theme secara langsung.