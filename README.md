# 📡 G-COMMS

### *When Discord is too casual and actual radios are too expensive*

---

## What Is This?

G-COMMS is a zero-install, browser-based tactical voice communications system. Think military radio nets, but you're in a browser and nobody had to buy a $3,000 Harris radio.

**Host a session. Share a code. Talk to your people.**

No accounts. No downloads. No "please update your app." Just comms.

---

## Features

🎙️ **Multi-Channel Architecture**
- Create squad channels on the fly
- Command Net for leadership coordination  
- Operators hear their squad, squad leaders hear everything

⭐ **Role-Based Access**
- **Commander** — Sees all, hears all, moves operators between channels, ALL-CALL broadcast
- **Squad Leader** — Leads their squad + Command Net access
- **Operator** — Talks to their squad, does operator things

🔊 **Per-Channel Controls**
- Independent listen/speak toggles per channel
- Volume sliders that actually work
- Visual indicators for who's transmitting

📢 **Tactical Signals**
- Attention whistle
- Alert tone  
- Urgent signal
- *Your teammates will hear it. They will respond. Hopefully.*

🚦 **Status System**
- 🟢 READY
- 🟡 WAIT ONE
- 🔴 DOWN
- ⚫ STANDBY

🔌 **Built Different**
- Auto-reconnect with exponential backoff
- Connection health monitoring
- TURN server fallback for corporate firewalls
- Wake lock keeps your screen on during ops

---

## How To Use

### Hosting (Commander)

1. Go to the site
2. Enter your callsign
3. Click **HOST NEW SESSION**
4. Share the 6-character code with your team
5. Drag operators into channels as they join
6. Promote trusted people to Squad Leader
7. Run your op

### Joining (Everyone Else)

1. Go to the site
2. Enter your callsign
3. Enter the session code
4. Click **JOIN SESSION**
5. Wait for Commander to assign you
6. Press the 🎙️ button to talk
7. Try not to talk over everyone else

---

## Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl+M` | Global mute toggle |
| `Ctrl+W` | Send attention whistle |
| `Ctrl+Shift+A` | Set status: READY |
| `Ctrl+Alt+D` | Set status: DOWN |
| `Ctrl+Alt+W` | Set status: WAIT ONE |
| `Ctrl+0` | ALL-CALL toggle (Commander) |
| `Ctrl+`` ` | Toggle Command Net listen |

---

## Technical Stuff (For Nerds)

- **WebRTC** peer-to-peer audio via PeerJS
- **Full mesh topology** — everyone connects to everyone
- **STUN/TURN** servers for NAT traversal
- **Opus codec** for voice-optimized audio
- **React 18** compiled in-browser because we live dangerously

### Network Architecture
```
       ┌─────────────────────────────────────┐
       │           MESH TOPOLOGY             │
       │                                     │
       │    Op1 ←——→ Op2 ←——→ Op3           │
       │     ↑↖      ↑↗↖      ↗↑            │
       │     │  ↘   ↙│  ↘   ↙  │            │
       │     ↓    ↘↙ ↓   ↘↙    ↓            │
       │    Op4 ←——→ CMD ←——→ Op5           │
       │              ↑                      │
       │         (Host/Sync)                 │
       └─────────────────────────────────────┘
```

### Scaling Limits

| Users | Connections | Vibes |
|-------|-------------|-------|
| 5 | 10 | Butter smooth |
| 10 | 45 | Solid |
| 20 | 190 | This is what we built for |
| 30+ | 435+ | Probably don't |

For 30+ users, you'd want an SFU (Selective Forwarding Unit) instead of mesh. That's a different app.

---

## Known Limitations

- **iOS Safari** — Wake lock doesn't work in PWA mode. Your screen might sleep. Apple things.
- **Mesh scaling** — 20 users is the practical limit before your CPU starts sweating
- **Host = single point of failure** — If Commander disconnects, the session continues but new joins won't work
- **No persistence** — Refresh = rejoin. There's no "session memory"

---

## Self-Hosting

It's a single HTML file. Throw it anywhere that serves static files:

- Vercel (recommended, it's free)
- Netlify
- GitHub Pages
- A Raspberry Pi in your closet
- Literally any web server

```bash
# That's it. That's the deploy.
cp index.html /var/www/html/
```

---

## FAQ

**Q: Is this encrypted?**  
A: WebRTC uses DTLS-SRTP encryption for media streams. Your voice is encrypted peer-to-peer. We're not listening. We can't listen. We don't want to listen.

**Q: Can I use this for [illegal thing]?**  
A: No. Also, why would you tell us?

**Q: Why "G-COMMS"?**  
A: It sounded cool at the time.

**Q: Can I use this for airsoft/paintball/milsim?**  
A: That's literally what it's for.

**Q: My friend can't connect from their work network.**  
A: Their IT department is why we added TURN servers. It should work, but some corporate firewalls are built different. Tell them to use their phone.

**Q: Why does it look like a military terminal from the 80s?**  
A: Because aesthetic.

**Q: 20 users is not enough.**  
A: That's not a question. Also, look into LiveKit or Daily.co for bigger deployments.

---

## Credits

Built with:
- [PeerJS](https://peerjs.com/) — WebRTC made less painful  
- [React](https://react.dev/) — You know what React is
- [JetBrains Mono](https://www.jetbrains.com/lp/mono/) — Pretty monospace font
- Questionable decisions — Me

---

## License

MIT. Do whatever you want. Build cool things.

---

<p align="center">
  <i>"COMMS UP"</i>
  <br><br>
  📡
</p>
