# G-COMMS

### GBRS Communications System v.0.9.2

A peer-to-peer tactical voice communications system with command hierarchy, channel-based audio routing, real-time status indicators, and signal alerts.

![Status](https://img.shields.io/badge/status-beta-yellow)
![Platform](https://img.shields.io/badge/platform-web%20%7C%20desktop-blue)
![License](https://img.shields.io/badge/license-MIT-green)

---

## Table of Contents

- [Features](#features)
- [Quick Start](#quick-start)
- [Version Guide](#version-guide)
  - [Browser Version (HTML)](#1-browser-version-html)
  - [React Component (JSX)](#2-react-component-jsx)
  - [Desktop App (Electron)](#3-desktop-app-electron)
- [Usage Guide](#usage-guide)
  - [Hosting a Session](#hosting-a-session)
  - [Joining a Session](#joining-a-session)
  - [Channels](#channels)
  - [Status Indicators](#status-indicators)
  - [Signal Whistles](#signal-whistles)
- [Keyboard Shortcuts](#keyboard-shortcuts)
- [Troubleshooting](#troubleshooting)
- [Technical Notes](#technical-notes)

---

## Features

- **Command Hierarchy** — Commander (host) has full control, operators are channel-locked
- **Channel-Based Audio** — Operators only hear/speak in their assigned channel
- **Peer-to-Peer Voice** — Direct WebRTC audio, no server routing
- **Session Codes** — 6-character codes for easy team joining
- **Drag & Drop Assignment** — Commander drags operators between channels
- **All-Call Broadcast** — Commander can address all channels simultaneously
- **Status Indicators** — Ready, Down, Wait One status broadcasts
- **Signal Whistles** — Attention, Alert, and Urgent audio signals
- **Real-time Roster** — See who's online, speaking, and their status
- **Volume Control** — Per-channel volume sliders
- **Hotkey Support** — Full keyboard control for tactical use
- **Zero Install Option** — Browser version works immediately

---

## Command Hierarchy

G-COMMS uses a strict command hierarchy:

### Commander (Host)
- Creates and manages channels
- Assigns operators to channels via drag & drop
- Can listen to ANY channel (toggle per channel)
- Can speak to ANY channel (select one at a time)
- Can broadcast to ALL channels simultaneously (All-Call)
- Sees all operators and their status

### Operators (Members)
- Assigned to ONE channel by Commander
- Can ONLY hear operators in their assigned channel
- Can ONLY speak to their assigned channel
- Cannot change their own channel assignment
- Can hear Commander when Commander speaks to their channel or All-Call

---

## Quick Start

**Fastest way to get running:**

1. Download `gcomms.html`
2. Open it in Chrome, Firefox, or Edge
3. Enter your callsign
4. Click "HOST NEW SESSION"
5. Share the 6-character code with your team

That's it. No installation, no server, no configuration.

---

## Version Guide

### 1. Browser Version (HTML)

**File:** `gcomms.html`

**Best for:** Immediate use, no setup required, sharing with non-technical team members

#### Requirements
- Modern web browser (Chrome, Firefox, Edge)
- Microphone
- Internet connection (for signaling only — voice is P2P)

#### Setup

**Option A: Local Use**
```
1. Download gcomms.html
2. Double-click to open in your default browser
3. Allow microphone access when prompted
4. Ready to use!
```

> ⚠️ **Note:** Some browsers restrict microphone access for local files. If you encounter issues, use Option B or C.

**Option B: Local Server (if mic doesn't work)**

Using Python:
```bash
# Navigate to the folder containing gcomms.html
cd /path/to/folder

# Python 3
python -m http.server 8000

# Then open http://localhost:8000/gcomms.html
```

Using Node.js:
```bash
# Install serve globally (one time)
npm install -g serve

# Run server
serve .

# Then open the URL shown in terminal
```

**Option C: Host Online (Recommended for Teams)**

Upload `gcomms.html` to any static hosting:

| Service | Cost | Difficulty | URL Format |
|---------|------|------------|------------|
| [GitHub Pages](https://pages.github.com) | Free | Easy | `username.github.io/repo` |
| [Netlify](https://netlify.com) | Free | Very Easy | `yoursite.netlify.app` |
| [Vercel](https://vercel.com) | Free | Very Easy | `yoursite.vercel.app` |
| [Cloudflare Pages](https://pages.cloudflare.com) | Free | Easy | `yoursite.pages.dev` |

GitHub Pages Quick Setup:
```bash
1. Create a new GitHub repository
2. Upload gcomms.html (rename to index.html)
3. Go to Settings → Pages
4. Set source to "main" branch
5. Your app is live at https://[username].github.io/[repo]
```

---

### 2. React Component (JSX)

**File:** `gcomms.jsx`

**Best for:** Developers integrating into existing React apps, customization

#### Requirements
- Node.js 16+
- React 18+
- npm or yarn

#### Setup

**Option A: Add to Existing React Project**

```bash
# Copy gcomms.jsx into your components folder
cp gcomms.jsx your-react-app/src/components/

# Install peer dependency (if not already)
npm install peerjs
```

In your app:
```jsx
import GComms from './components/gcomms';

function App() {
  return <GComms />;
}

export default App;
```

**Option B: Create New React Project**

```bash
# Create new React app
npx create-react-app gcomms-app
cd gcomms-app

# Install PeerJS
npm install peerjs

# Replace src/App.js content:
```

```jsx
import GComms from './gcomms';

function App() {
  return <GComms />;
}

export default App;
```

```bash
# Copy gcomms.jsx to src/gcomms.jsx

# Start development server
npm start
```

**Option C: Using Vite (Faster)**

```bash
# Create Vite project
npm create vite@latest gcomms-app -- --template react
cd gcomms-app

# Install dependencies
npm install
npm install peerjs

# Copy gcomms.jsx to src/gcomms.jsx

# Update src/App.jsx:
import GComms from './gcomms'
function App() {
  return <GComms />
}
export default App

# Run
npm run dev
```

#### Building for Production

```bash
npm run build
```

Output will be in `build/` or `dist/` folder — upload these files to any static host.

---

### 3. Desktop App (Electron)

**Best for:** Standalone executable, offline-capable launcher, professional deployment

#### Requirements
- Node.js 16+
- npm
- ~500MB disk space for build tools

#### Setup

**Step 1: Create Project Structure**

```bash
mkdir gcomms-desktop
cd gcomms-desktop
```

**Step 2: Initialize Project**

```bash
npm init -y
npm install electron --save-dev
npm install electron-builder --save-dev
```

**Step 3: Add Files**

Copy `gcomms.html` into the folder and rename to `index.html`:
```bash
cp /path/to/gcomms.html ./index.html
```

Create `main.js`:
```javascript
const { app, BrowserWindow } = require('electron');
const path = require('path');

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 900,
    minWidth: 800,
    minHeight: 600,
    title: 'G-COMMS',
    backgroundColor: '#0a0f0a',
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true
    }
  });

  // Load the app
  win.loadFile('index.html');
  
  // Hide menu bar
  win.setMenuBarVisibility(false);
  
  // Optional: Open DevTools for debugging
  // win.webContents.openDevTools();
}

// Create window when ready
app.whenReady().then(createWindow);

// Quit when all windows closed (except macOS)
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// macOS: recreate window when dock icon clicked
app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
```

**Step 4: Configure package.json**

Replace contents of `package.json`:
```json
{
  "name": "gcomms",
  "version": "0.9.2",
  "description": "GBRS Communications System",
  "main": "main.js",
  "author": "Your Name",
  "license": "MIT",
  "scripts": {
    "start": "electron .",
    "build": "electron-builder",
    "build:win": "electron-builder --win",
    "build:mac": "electron-builder --mac",
    "build:linux": "electron-builder --linux",
    "build:all": "electron-builder --win --mac --linux"
  },
  "build": {
    "appId": "com.gbrs.gcomms",
    "productName": "G-COMMS",
    "directories": {
      "output": "dist"
    },
    "files": [
      "index.html",
      "main.js"
    ],
    "win": {
      "target": [
        {
          "target": "nsis",
          "arch": ["x64"]
        },
        {
          "target": "portable",
          "arch": ["x64"]
        }
      ],
      "icon": "build/icon.ico"
    },
    "mac": {
      "target": ["dmg", "zip"],
      "icon": "build/icon.icns",
      "category": "public.app-category.utilities"
    },
    "linux": {
      "target": ["AppImage", "deb"],
      "icon": "build/icon.png",
      "category": "Network"
    },
    "nsis": {
      "oneClick": false,
      "allowToChangeInstallationDirectory": true,
      "installerIcon": "build/icon.ico",
      "uninstallerIcon": "build/icon.ico"
    }
  },
  "devDependencies": {
    "electron": "^28.0.0",
    "electron-builder": "^24.9.1"
  }
}
```

**Step 5: Add App Icons (Optional)**

Create a `build` folder and add icons:
```
gcomms-desktop/
├── build/
│   ├── icon.ico      (256x256, for Windows)
│   ├── icon.icns     (512x512, for macOS)
│   └── icon.png      (512x512, for Linux)
├── index.html
├── main.js
└── package.json
```

**Step 6: Test**

```bash
npm start
```

**Step 7: Build Executables**

```bash
# Windows installer (.exe)
npm run build:win

# macOS installer (.dmg)
npm run build:mac

# Linux installer (.AppImage)
npm run build:linux

# All platforms
npm run build:all
```

**Step 8: Distribute**

Built files will be in `dist/` folder:
```
dist/
├── G-COMMS Setup 0.9.1.exe      (Windows installer)
├── G-COMMS 0.9.1.exe            (Windows portable)
├── G-COMMS-0.9.1.dmg            (macOS)
├── G-COMMS-0.9.1.AppImage       (Linux)
└── G-COMMS_0.9.1_amd64.deb      (Debian/Ubuntu)
```

Send the appropriate file to your team members!

#### Final Folder Structure

```
gcomms-desktop/
├── build/
│   ├── icon.ico
│   ├── icon.icns
│   └── icon.png
├── dist/                 (created after build)
│   └── [executables]
├── node_modules/         (created by npm)
├── index.html
├── main.js
├── package.json
└── package-lock.json
```

---

## Usage Guide

### Hosting a Session

1. Enter your callsign (your display name)
2. Click **"🛰️ HOST NEW SESSION"**
3. You'll receive a 6-character session code (e.g., `K4M7NP`)
4. Share this code with your team
5. You are now the host and can:
   - Create/delete channels
   - Change channel colors
   - All normal user functions

### Joining a Session

1. Enter your callsign
2. Enter the 6-character session code
3. Click **"JOIN SESSION"**
4. Allow microphone access
5. You're connected!

### Channels

**For Commander:**
- Create channels with the "+ CREATE CHANNEL" button
- Each channel shows its assigned operators
- **Drag & drop** operators between channels to reassign them
- Unassigned operators appear in a yellow warning box at the top
- Use the 🎧 button to toggle listening to a channel
- Use the 🎙️ button to speak to a specific channel
- Use the **ALL-CALL** button to broadcast to everyone

**For Operators:**
- You are assigned to ONE channel by the Commander
- Your assigned channel is highlighted with "YOUR CHANNEL" badge
- You automatically hear and can speak to your assigned channel
- You cannot change your own assignment — request Commander to move you

**Channel Assignment Flow:**
1. New operators join as "Unassigned"
2. Commander drags them to appropriate channel
3. Operator immediately hears/speaks on that channel
4. Commander can reassign at any time by dragging

### Status Indicators

Your status appears in the Team Roster and broadcasts to all users:

| Status | Color | Hotkey | Meaning |
|--------|-------|--------|---------|
| STANDBY | ⚫ Gray | (default) | Connected, idle |
| READY | 🟢 Green | `Ctrl+Shift+A` | Acknowledged, good to go |
| DOWN | 🔴 Red | `Ctrl+Alt+D` | Operator down/incapacitated |
| WAIT ONE | 🟡 Yellow | `Ctrl+Alt+W` | Stand by, busy |

### Signal Whistles

Broadcast audio alerts to all connected users:

| Signal | Sound | Use Case |
|--------|-------|----------|
| 📯 ATTENTION | Rising whistle | General announcement incoming |
| 🔔 ALERT | Double blip | Important information |
| ⚠️ URGENT | Triple tone | Emergency, immediate attention |

### All-Call (Commander Only)

The All-Call feature allows the Commander to broadcast to ALL channels simultaneously:

1. Click the **📢 ALL-CALL** button (or press `Ctrl+0`)
2. The button pulses red when active
3. All operators hear your transmission regardless of channel
4. A notification appears on all operator screens: "COMMANDER ALL-CALL"
5. Click again (or press `Ctrl+0`) to deactivate

**Use cases:**
- Mission briefings
- Emergency announcements
- Coordinating multi-channel operations
- End-of-mission debrief

---

## Keyboard Shortcuts

### All Users

| Shortcut | Action |
|----------|--------|
| `Ctrl+M` | Toggle global mute (all audio) |
| `Ctrl+W` | Send attention whistle |
| `Ctrl+Shift+A` | Set status: Ready (green) |
| `Ctrl+Alt+D` | Set status: Down (red) |
| `Ctrl+Alt+W` | Set status: Wait One (yellow) |

### Commander Only

| Shortcut | Action |
|----------|--------|
| `Ctrl+1` - `Ctrl+9` | Toggle listening to channel 1-9 |
| `Ctrl+Shift+1` - `Ctrl+Shift+9` | Speak to channel 1-9 (toggle) |
| `Ctrl+0` | Toggle All-Call (broadcast to all channels) |

> **Note:** Hotkeys are disabled when typing in text fields.

---

## Troubleshooting

### Microphone not working

1. **Check browser permissions** — Click the lock icon in the address bar → Allow microphone
2. **Try a different browser** — Chrome has the best WebRTC support
3. **Use HTTPS or localhost** — Browsers block mic access on non-secure origins
4. **Check system permissions** — Windows/macOS privacy settings may block mic access

### Can't connect to session

1. **Verify the code** — Codes are case-insensitive but must be exact
2. **Check internet connection** — Both users need internet for initial connection
3. **Firewall issues** — WebRTC may be blocked on some corporate networks
4. **Host offline** — The host must remain connected for others to join

### Audio quality issues

1. **Reduce background noise** — Use headphones, find a quiet location
2. **Check bandwidth** — P2P audio requires ~100kbps per connection
3. **Too many users** — Performance may degrade with 10+ simultaneous connections

### "Session code already in use"

This means someone else generated the same code (rare). Simply:
1. Leave the session
2. Host a new session (you'll get a new code)

### Electron app won't build

1. **Clear npm cache:** `npm cache clean --force`
2. **Delete node_modules:** `rm -rf node_modules && npm install`
3. **Check Node version:** Requires Node 16+
4. **Windows users:** Run as administrator

---

## Technical Notes

### Architecture

- **Signaling:** PeerJS public servers (handles connection setup only)
- **Voice:** Direct WebRTC peer-to-peer (no server routing)
- **Data:** WebRTC DataChannels for status/whistles

### Privacy

- Voice audio is **never** sent to any server
- Only connection metadata passes through PeerJS signaling servers
- Session codes are random and temporary

### Browser Support

| Browser | Support |
|---------|---------|
| Chrome | ✅ Full |
| Edge | ✅ Full |
| Firefox | ✅ Full |
| Safari | ⚠️ Partial (some WebRTC issues) |
| Mobile Chrome | ✅ Full |
| Mobile Safari | ⚠️ Partial |

### Production Considerations

For serious/production use:

1. **Self-host PeerJS server** — Avoid dependency on public servers
   ```bash
   npm install peer
   npx peerjs --port 9000
   ```

2. **Add TURN server** — For users behind strict firewalls
   - [Coturn](https://github.com/coturn/coturn) (self-hosted)
   - [Twilio TURN](https://www.twilio.com/stun-turn) (hosted)

3. **Use HTTPS** — Required for microphone access in production

4. **Consider scaling** — WebRTC is P2P, so each user connects to every other user. For 10+ users, consider an SFU (Selective Forwarding Unit) architecture.

---

## License

MIT License — Use freely, modify as needed.

---

## Support

Found a bug or have a feature request? Open an issue or submit a PR.

**Stay frosty.** 🎖️
