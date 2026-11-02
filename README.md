# 🕌 Mehfil (महफ़िल / محفل) — Free Ambient Qawwali Radio

> **"Mehfil sajne wali hai..."**  
> A free, continuous ambient web radio recreating the devotional atmosphere of a late-night Sufi gathering (*Mehfil-e-Sama*): candlelit, soulful, and ad-free.

---

## 🌟 Highlights & Features

- **Legitimate YouTube IFrame Audio Engine**: Streams audio exclusively through the official YouTube IFrame Player API. No audio is hosted, stored, or scraped; all rights and views go directly to the artists and labels.
- **Continuous Radio Streaming**: Tap *"Enter the Mehfil"* and enjoy uninterrupted listening with auto-advance and crossfade transitions.
- **Curated Playlists**:
  1. **Coke Studio Qawwalis**: Orchestral grandeur and devotional collaborations (Pakistan & India editions).
  2. **NFAK Classics**: The raw, unadulterated ecstasy of Ustad Nusrat Fateh Ali Khan.
  3. **Trending & Sacred Anthems**: Beloved modern hymns (A.R. Rahman, Kun Faya Kun, Ajmer Sharif tributes).
  4. **Shuffle All**: A continuous stream blending all traditions.
- **Architectural & Visual Atmosphere**:
  - Handcrafted Mughal Arch (*Jharokha / Mihrab*) central player.
  - Realistic flickering diya flames and candle halo animation.
  - Falling crimson rose petals (*gulab ke pattiyaan*) and warm golden ember particle engine on HTML5 Canvas.
  - 20-bar animated equalizer / sitar visualizer responding to playback.
- **Modern Player Capabilities**:
  - Full playback controls: Play/Pause, Next, Previous, Scrubbable Seek Bar, Volume & Mute.
  - Shuffle and Repeat / Loop Modes.
  - **Now Playing Queue Drawer**: Slide-in drawer with real-time search filter and instant track selection.
  - **Media Session API**: Lock-screen and notification controls on mobile devices (Android & iOS).
  - **Sleep Timer**: 15 / 30 / 45 / 60 minutes with gentle 20-second fade out.
  - **Zen Mode**: Ambient cinema view dimming UI distractions for night listening.
  - **Video Peek**: Optional modal to watch the authentic performance video from YouTube.
  - **Web Share API**: Share direct link to any track (e.g. `?track=cs-01`).
  - **Keyboard Shortcuts**: Space, Arrows, Shift+Seek, Mute (M), Shuffle (S), Loop (L), Queue (Q), Zen (Z), Help (?).
  - **PWA (Progressive Web App)**: Offline shell caching with `manifest.json` and `sw.js`.
  - **Zero Build Step**: Pure HTML5, CSS3, and modern ES6+ JavaScript. Open `index.html` directly in any browser!

---

## 📁 Project Structure

```text
d:\Mehfil\
├── index.html            # Main single-page application & SEO markup
├── manifest.json         # PWA Manifest (app icons, theme color, display mode)
├── sw.js                 # Service Worker (caching app shell for instant loads)
├── robots.txt            # Search engine crawler permissions
├── sitemap.xml           # SEO sitemap
├── README.md             # Documentation & deployment guide
├── css/
│   ├── style.css         # Typography, layout, cards, FAQ, footer & responsiveness
│   ├── player.css        # Mughal arch deck, controls, seekbar, queue drawer, modals
│   └── animations.css    # Diya flame flicker, EQ bars, arch aura, reduced motion
├── js/
│   ├── playlists.js      # Easy-to-edit configuration of tracks and YouTube IDs
│   ├── couplets.js       # Curated public-domain Sufi poetry & translations
│   ├── player.js         # YouTube IFrame API controller, MediaSession, state
│   └── app.js            # UI bindings, canvas particle system, modals, PWA logic
└── img/
    ├── icon-192.svg      # PWA application icon (192x192)
    ├── icon-512.svg      # PWA application icon (512x512)
    └── upi-qr.svg        # Support Mehfil UPI QR mockup badge
```

---

## 🎵 How to Change or Add Songs & Playlists

All music configuration is contained inside **[`js/playlists.js`](file:///d:/Mehfil/js/playlists.js)**.

### 1. Adding an Individual YouTube Video
To add a new song:
1. Find the song on YouTube (e.g., `https://www.youtube.com/watch?v=kw4tT7SCmaY`).
2. Copy the video ID after `v=` (e.g., `kw4tT7SCmaY`).
3. Open `js/playlists.js` and add an object to the desired playlist array:

```javascript
{
  id: "cs-09",
  title: "Chaap Tilak",
  urduTitle: "چھاپ تلک سب چھینی",
  artist: "Ustad Nusrat Fateh Ali Khan & Party",
  album: "Traditional Mehfil",
  duration: "14:20",
  videoId: "YOUR_YOUTUBE_VIDEO_ID_HERE",
  poet: "Hazrat Amir Khusrau",
  couplet: "छाप तिलक सब छीनी रे मोसे नैना मिलाइके।",
  coupletUrdu: "چھاپ تلک سب چھینی رے موسے نیناں ملائیکے",
  era: "13th Century Sufi Kalaam"
}
```

### 2. Replacing with a Full YouTube Playlist ID
If you want to map a category to an entire YouTube-managed playlist, replace the placeholder in `MEHFIL_CONFIG.youtubePlaylists`:

```javascript
const MEHFIL_CONFIG = {
  youtubePlaylists: {
    cokeStudio: "PLtrm7m8J2Z4N628_x1v8b90", // Replace PLAYLIST_ID_COKE_STUDIO
    nfakClassics: "PLw_27LrqN-4J92b...",      // Replace PLAYLIST_ID_NFAK_CLASSICS
    trending: "PLxyz..."                      // Replace PLAYLIST_ID_TRENDING_QAWWALI
  }
};
```

---

## 🎨 How to Customize Colours & Theme

The color palette and fonts are defined using CSS Custom Properties at the top of **[`css/style.css`](file:///d:/Mehfil/css/style.css)**:

```css
:root {
  /* Background Velvet Tones */
  --bg-midnight: #070204;
  --bg-deep: #0e0508;
  --bg-surface: #180a10;
  --bg-card: #200d16;

  /* Gold & Candle Accents */
  --gold-primary: #d4af37;        /* Antique gold accent */
  --gold-light: #fae498;          /* Shimmer highlights */
  --amber-candle: #ffb347;        /* Diya flame glow */

  /* Jewel Highlights */
  --emerald-accent: #198463;      /* Emerald green touches */
  --crimson-velvet: #4a0c1a;      /* Rich Mughal maroon */
}
```

Adjust any hex value to restyle the entire site immediately.

---

## ✍️ How to Add or Edit Sufi Couplets

Public-domain couplets that rotate in the "Verses of the Sufis" section are in **[`js/couplets.js`](file:///d:/Mehfil/js/couplets.js)**. Simply add a new verse:

```javascript
{
  urdu: "نمی دانم چه منزل بود شب جای که من بودم",
  hindi: "नमी दानम चे मंज़िल बूद शब जाए के मन बूदम",
  translation: "I know not what divine abode it was where I spent the night...",
  poet: "Hazrat Amir Khusrau",
  context: "From his Persian Ghazaliyat"
}
```

---

## ⌨️ Keyboard Shortcuts Reference

| Key | Action |
| :--- | :--- |
| `Space` | Play / Pause current track |
| `→` (Right Arrow) | Next track |
| `←` (Left Arrow) | Previous track (or rewind to 0:00) |
| `Shift + →` | Fast forward 10 seconds |
| `Shift + ←` | Rewind 10 seconds |
| `↑` (Up Arrow) | Volume up 10% |
| `↓` (Down Arrow) | Volume down 10% |
| `M` | Mute / Unmute audio |
| `S` | Toggle Shuffle |
| `L` | Toggle Loop Mode (Repeat Track / Repeat Playlist / Off) |
| `Q` | Open / Close Now Playing Queue Drawer |
| `Z` | Toggle Zen / Cinema Mode |
| `?` (`Shift + /`) | Open Keyboard Shortcuts Cheatsheet |

---

## 🚀 Deployment Instructions

Mehfil has **no build step, no npm dependencies, and no node backend**. You can deploy it to any static web host in under 60 seconds:

### Option 1: Netlify
1. Go to [Netlify](https://www.netlify.com/).
2. Drag and drop the `Mehfil` directory into the Netlify Drop box.
3. Your site will instantly go live with free SSL.

### Option 2: Vercel
1. Install Vercel CLI (`npm i -g vercel`) or connect your GitHub repository.
2. Run `vercel` inside the `Mehfil` folder.
3. Accept the default static project settings.

### Option 3: GitHub Pages
1. Push this folder to a GitHub repository.
2. In your repo, go to **Settings > Pages**.
3. Under **Build and deployment > Source**, select `Deploy from a branch` and choose `main` / `root`.
4. Click Save.

### Option 4: Local 1-Click Launch on Windows (Recommended)
Simply double-click **`Start-Mehfil.bat`** in the project folder!
- It automatically launches a local web server at `http://localhost:3000` using Python, Node, or Windows PowerShell.
- It opens your default browser immediately with valid HTTP origin headers, ensuring 100% of YouTube's embedded streams play smoothly without `file://` cross-origin security restrictions.

### Option 5: Direct Browser Opening
You can also double-click `index.html` directly. Note that certain major record labels (such as Coke Studio Pakistan) may enforce HTTP referrers; for unrestricted listening, using `Start-Mehfil.bat` or deploying to Netlify/Vercel/GitHub Pages is recommended.

---

## ⚖️ Copyright & Compliance Disclaimer

> **Audio plays through YouTube's embedded player.**  
> Nothing is hosted on this site; all rights, views, and royalties remain with the original artists, producers, and recording labels (including Coke Studio, EMI Pakistan, Oriental Star Agencies, and Universal Music).
