# Countdown for Disney — CLAUDE.md

## Project Overview

Cross-platform Expo/React Native rebuild of the original **Countdown for Disney** iOS and Android apps. Counts down days until a Walt Disney World vacation, with backgrounds, weather, tips, news, notifications, and in-app purchase.

**Original repos (for reference):**
- iOS: `github.com/jbestor/C4D_iOS` — use the `ES` branch (most recent App Store version)
- Android: `github.com/jbestor/C4D_Android` — `master` branch

---

## Architecture

```
app/
├── _layout.tsx               # expo-router root stack; wraps AppProvider + GestureHandler
├── index.tsx                 # → screens/MainScreen
├── weather.tsx               # → screens/WeatherScreen
├── news.tsx                  # → screens/NewsScreen
├── tips.tsx                  # → screens/TipsScreen  (paid)
├── set-date.tsx              # → screens/SetDateScreen
├── background.tsx            # → screens/BackgroundScreen
├── slideshow-options.tsx     # → screens/SlideshowOptionsScreen
├── customize-widget.tsx      # → screens/CustomizeWidgetScreen (paid)
├── notifications.tsx         # → screens/NotificationsScreen  (paid)
├── about.tsx                 # → screens/AboutScreen
│
├── screens/                  # Full-screen page components
├── components/
│   ├── AppContext.tsx         # Global state — trip date, background, paid status
│   ├── BottomBar.tsx         # Bottom navigation bar
│   ├── SlideMenu.tsx         # Right-swipe slide-out drawer menu
│   └── WandWidget.tsx        # Draggable wand/days bubble
│
├── services/
│   ├── RemoteConfigService.ts  # 3-tier fetch: remote → cache → bundle
│   ├── StorageService.ts       # AsyncStorage wrapper (all persisted state)
│   ├── WeatherService.ts       # OpenWeatherMap One Call API 3.0
│   ├── PurchaseService.ts      # IAP placeholder (wire up expo-in-app-purchases)
│   └── NotificationService.ts  # expo-notifications + milestone scheduling
│
├── data/                     # Bundled JSON fallbacks
│   ├── notifications.json
│   ├── tips.json
│   └── news.json
│
├── assets/
│   ├── backgrounds.ts        # 15 Disney background image registry
│   └── bg/                   # Background image files (populate from C4D_iOS repo)
│
└── utils/
    └── countdown.ts          # computeCountdown(tripDate) → { days, hours, minutes }
```

---

## Navigation Structure

### Main Screen (`app/index.tsx`)
- Full-screen ImageBackground with countdown number
- **Right swipe gesture** → opens slide-out menu (no hamburger icon)
- **WandWidget** — draggable star/days bubble, mirrors original iOS wand

### Bottom Bar
| Position | Element | Notes |
|----------|---------|-------|
| Left | 🎠 Slideshow icon | → slideshow-options screen |
| Center-left | "News" text | → news screen |
| Center | ⛅ Weather icon | → weather screen |
| Right | "Tips" text | → tips screen, **visible to all but gated behind purchase** |

### Slide-Out Menu (right swipe, no hamburger)
| Item | Access |
|------|--------|
| Set Trip Date | Free |
| Background Photo | Free |
| Slideshow Options | Free |
| Customize Widget | **Paid** (🔒) |
| Notifications | **Paid** (🔒) |
| Hide Menu | **Paid** (🔒) |
| Share | Free |
| Main Street Wishes | Free (opens browser) |
| Info / About | Free |

---

## Paid vs Free Features

**Free:**
- Set trip date
- Countdown display
- Background photo (Disney assets + user photo)
- Slideshow with interval options
- News (from remote config)
- Weather (7-day WDW forecast)
- Share countdown

**Paid ($0.99 full version unlock):**
- Tips (button visible to all but tapping prompts purchase)
- Customize Widget
- Notifications (planning milestones)
- Hide Menu option

**Lock behavior:** Paid items show 🔒. Tapping triggers `purchaseService.purchaseFullVersion()`, which should open the native IAP sheet. On success, `StorageService.setIsPaid(true)` persists and `AppContext` updates all gating.

---

## Remote Config Architecture

**Base URL:** `https://countdownfordisney.com/config/`

**Endpoints:**
- `notifications.json` — milestone notification schedule
- `tips.json` — categorized tips (Planning, Activity, Resort, Parks, Dining, Transportation)
- `news.json` — news articles + RSS feed URL

**Three-tier pipeline (RemoteConfigService.ts):**
1. Fetch remote — 24-hour cache TTL
2. On failure → load from AsyncStorage cache (even if stale)
3. On no cache → use bundled JSON in `app/data/`

**JSON format:** All files include a `version` field for future-proofing. Fails silently — the app never crashes on config fetch failure.

**Deployment:** JSON files are served from AWS S3 via CloudFront at `countdownfordisney.com/config/`. Update via S3 console or CI script. No app update required to change tips/news/notifications.

---

## Weather Service

- Provider: **OpenWeatherMap One Call API 3.0**
- Location: Walt Disney World — lat `28.3852`, lon `-81.5639`
- Units: Imperial (°F)
- Key: `EXPO_PUBLIC_OPENWEATHER_API_KEY` in `.env.local`
- Displays: current conditions + 7-day forecast
- See `app/services/WeatherService.ts`

---

## Notifications

Powered by `expo-notifications`. Milestones are loaded from `RemoteConfigService` (endpoint: `notifications.json`) with bundled fallback.

Each milestone fires X days **before** the trip date at 9:00 AM local time. Examples:
- 330 days: "Airlines have scheduled flights..."
- 180 days: "Dining reservations open!"
- 60 days: "Lightning Lane passes available"
- 7 days: "One week to go!"

Scheduling happens automatically when the user saves a new trip date. All previously scheduled notifications are cancelled and replaced on each save.

**Permission:** Requested at first toggle. If denied, user is directed to Settings.

---

## Background Images

15 Disney photos from the original apps (source: `C4D_iOS` ES branch `images/source/DisneyPicsOrig/`):

| ID | Label | Original filename |
|----|-------|-------------------|
| 0 | Castle | Castle.JPG |
| 1 | Side Castle | Side Castle.JPG |
| 2 | Balloon | Balloon.JPG |
| 3 | Fireworks | Fireworks.JPG |
| 4 | Golf Ball | Golf Ball.JPG |
| 5 | Haunted Mansion | HM2.JPG |
| 6 | Hat | Hat.JPG |
| 7 | Kidani | Kidani.jpg |
| 8 | Kidani Chandelier | Kidani Chandelier.JPG |
| 9 | Mad Tea Party | Mad Tea Party.JPG |
| 10 | Mickey's House | Mickey's House.JPG |
| 11 | Poly Waterfall | Poly Waterfall.jpg |
| 12 | Expedition Everest | Expedition Everest 2.jpg |
| 13 | Stitch | Stitch.JPG |
| 14 | Tree of Life | Tree.JPG |

Place images in `app/assets/bg/` with the filenames defined in `backgrounds.ts`. The user can also pick a photo from their library.

**Slideshow:** Cycles through all 15 Disney backgrounds at a configurable interval (3/5/10/15/30 seconds). Disabled when user has a custom photo selected.

---

## In-App Purchase

- SKU: `full_version`
- Price: $0.99
- Implementation: `app/services/PurchaseService.ts` (currently a mock that stores `isPaid=true`)
- **TODO:** Wire up real IAP:
  - Option A: `expo-in-app-purchases` (simpler, Expo-managed)
  - Option B: `react-native-purchases` / RevenueCat (recommended for cross-platform, analytics, receipt validation)
  - Configure product in App Store Connect + Google Play Console before testing

---

## Home Screen Widgets

Widget stubs are in `ios/widgets/README.md` and `android/widgets/README.md`.

**iOS:** WidgetKit extension. After `expo prebuild`, add a Widget Extension target in Xcode. Widget reads trip date from App Groups shared storage (`group.com.bit3computing.countdownfordisney`).

**Android:** Glance AppWidget. After `expo prebuild`, add receiver + layout in the Android module. Widget reads from SharedPreferences.

Widget style preference (`default`, `minimal`, `photo`) is set in `CustomizeWidgetScreen` and persisted via `StorageService.setWidgetStyle()`.

---

## AWS S3/CloudFront Deployment Plan

Remote config JSON lives at `https://countdownfordisney.com/config/`:

```
S3 bucket: countdownfordisney-config
  ├── notifications.json
  ├── tips.json
  └── news.json

CloudFront distribution:
  - Origin: countdownfordisney-config.s3.amazonaws.com
  - Domain: countdownfordisney.com/config/
  - Cache-Control: max-age=3600 (1 hour)
  - Invalidate distribution on update
```

**Update workflow:**
1. Edit JSON locally
2. `aws s3 cp notifications.json s3://countdownfordisney-config/notifications.json`
3. `aws cloudfront create-invalidation --distribution-id <ID> --paths "/config/*"`

No app release needed to update tips, news, or notification milestones.

---

## Development Setup

### Prerequisites
- Node.js 18+
- Expo Go app on iPhone (iOS 16+)
- WSL2 with Windows networking (tunnel mode for local preview)

### Installation
```bash
npm install
```

### Environment
```bash
cp .env.example .env.local
# Add your OpenWeatherMap API key
```

### Start (WSL)
```bash
npx expo start --tunnel
```
Use `--tunnel` in WSL so Expo Go on iPhone can reach the dev server over the internet (ngrok tunnel). The local network LAN mode may work if your iPhone and PC are on the same WiFi and WSL networking allows it, but tunnel is more reliable.

### Preview on iPhone
1. Install **Expo Go** from the App Store
2. Run `npx expo start --tunnel`
3. Scan the QR code with the iPhone camera (or open Expo Go and scan)

### Local Network (alternative, may require WSL firewall config)
```bash
npx expo start
```
Then open Windows Firewall settings and allow port 8081 for WSL. Your iPhone must be on the same WiFi network.

---

## Key Dependencies

| Package | Purpose |
|---------|---------|
| `expo-router` | File-based routing (like Next.js for RN) |
| `react-native-gesture-handler` | PanResponder + swipe gestures |
| `react-native-reanimated` | Animated menu transitions |
| `expo-notifications` | Local notification scheduling |
| `expo-image-picker` | User photo selection |
| `expo-sharing` | Share countdown image |
| `@react-native-async-storage/async-storage` | Persistent local storage |
| `expo-in-app-purchases` | IAP (needs wiring) |
| `react-native-view-shot` | Screenshot countdown for sharing |

---

## Non-Affiliation Disclaimer

This app is **not affiliated with, endorsed by, or sponsored by The Walt Disney Company** or any of its subsidiaries or affiliates. "Disney," "Walt Disney World," and all related marks are trademarks of The Walt Disney Company.

---

## Contact

- Developer: jason@bit3computing.com
- Community: https://www.facebook.com/groups/countdowntodisneyapp/
- Website: https://www.mainstreetwishes.com
