# J.A.R.V.I.S — Voice Assistant HUD · User Manual

## Quick Start

```powershell
cd "c:\Users\admin\OneDrive\Desktop\JARVIS_UI\app\frontend"
npm start
```

The app will open automatically at **http://localhost:3000**.

> [!IMPORTANT]
> If you see `'craco' is not recognized`, use `npx craco start` instead of `npm start`.

---

## Project Structure

```
JARVIS_UI/
└── app/frontend/
    ├── package.json            # Dependencies & scripts
    ├── craco.config.js         # Webpack alias (@/ → src/)
    ├── postcss.config.js       # Tailwind CSS processing
    ├── tailwind.config.js      # Tailwind theme (dark HUD palette)
    ├── public/
    │   └── index.html          # HTML shell + Google Fonts
    └── src/
        ├── index.js            # React entry point
        ├── index.css           # Global styles, HUD theme, animations
        ├── App.js              # Router setup
        ├── App.css             # App-level styles
        ├── lib/
        │   └── jarvis.js       # Voice engine, speech recognition/synthesis, witty response router
        ├── pages/
        │   └── Dashboard.jsx   # Main dashboard (orchestrates all components)
        └── components/kyra/
            ├── BootOverlay.jsx     # Boot-up animation
            ├── TopBar.jsx          # Header bar with status & weather
            ├── DottedOrb.jsx       # Central animated orb (reacts to agent state)
            ├── VoiceWaveform.jsx   # Waveform visualizer + mic/mute controls
            ├── SystemStats.jsx     # Left panel: system metrics & weather
            ├── ConversationLog.jsx # Right panel: chat log + typed input
            ├── QuickCommands.jsx   # Preset command buttons
            └── DiagnosticsStrip.jsx# Bottom diagnostics ticker
```

---

## How to Use the App

### Voice Interaction
1. **Click the microphone button** (center-bottom of the orb panel) to start listening
2. **Speak your command** — you'll see a live transcript appear below the orb
3. **JARVIS processes and responds** — both on-screen and via text-to-speech

### Typed Commands
- Use the **text input** in the right-side Conversation Log panel
- Type any command and press Enter

### Quick Commands
- Click any of the **preset command buttons** below the orb panel:
  - `SCAN` — Environmental scan
  - `MUSIC` — Workshop playlist
  - `LOCK` — Lockdown protocol
  - `ANALYZE` — Deep analysis
  - `SEARCH` — Global recon sweep
  - `DEPLOY` — Mark VII suit deployment
  - `CALL` — Call Rhodes
  - `SLEEP` — Enter standby

### Mute Toggle
- Click the **speaker icon** next to the mic to mute/unmute voice responses
- When muted, JARVIS still responds on-screen but won't speak aloud

### Weather & Location
- On first load, the browser will request **location permission**
- If granted, real-time weather data appears in the System Stats panel and Top Bar
- Click the retry button if location was denied initially

---

## Available npm Scripts

| Command | Description |
|---------|-------------|
| `npm start` | Start development server (port 3000) |
| `npm run build` | Create production build in `build/` |
| `npm test` | Run tests |

---

## Troubleshooting

| Problem | Fix |
|---------|-----|
| `'craco' is not recognized` | Run `npx craco start` instead, or re-run `npm install --legacy-peer-deps` |
| `Cannot find module 'ajv/dist/compile/codegen'` | Run `npm install ajv@8.17.1 --save-dev --legacy-peer-deps` |
| `ERESOLVE unable to resolve dependency tree` | Always use `npm install --legacy-peer-deps` |
| Speech recognition not working | Use **Chrome** or **Edge** (Firefox/Safari have limited support) |
| No weather data | Allow location permission in browser when prompted |
| Port 3000 already in use | Kill the existing process or set `PORT=3001` before `npm start` |

---

## Tech Stack

- **React 19** + React Router 7
- **CRACO** (Create React App Configuration Override)
- **Tailwind CSS 3** + custom HUD theme
- **Framer Motion** for animations
- **Web Speech API** (browser-native, no API keys needed)
- **Open-Meteo API** for weather (free, no API key)
- **Radix UI** primitives
- **Recharts** for data visualization

> [!TIP]
> Best experienced in **Chrome** with a microphone for the full JARVIS voice interaction. Use a British English voice for the authentic feel.
