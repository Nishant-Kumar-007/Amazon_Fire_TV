# ViewEase TV — Every Scene, Understood.

[![Amazon Fire TV Hackathon 2026](https://img.shields.io/badge/Amazon%20Developer%20Hackathon-2026-FF9900.svg?logo=amazon)](https://developer.amazon.com/apps-and-games/fire-tv)
[![React Native TV](https://img.shields.io/badge/React%20Native%20TV-v0.81-61DAFB.svg?logo=react)](https://github.com/react-native-tvos/react-native-tvos)
[![Expo SDK 54](https://img.shields.io/badge/Expo-SDK%2054-000020.svg?logo=expo)](https://expo.dev/)
[![License: MIT-0](https://img.shields.io/badge/License-MIT--0-green.svg)](./LICENSE)
[![Zero-Cost Architecture](https://img.shields.io/badge/Cloud%20APIs-Zero%20Cost%20%2F%20Offline%20First-4CAF50.svg)](#zero-cost-development-guarantee)

> **ViewEase TV** is a next-generation television experience engineered for **Amazon Fire TV (Fire OS & Vega OS)**. It unites a cinematic streaming interface with **ViewEase Assist**—an intelligent, contextual viewing companion that explains complex dialogue, identifies speakers, translates lines, and delivers spoiler-free story recaps without pulling viewers away from the screen.

---

## Table of Contents

- [Product Identity & Vision](#product-identity--vision)
- [Key Features](#key-features)
  - [1. Cinematic Entertainment Hub](#1-cinematic-entertainment-hub)
  - [2. ViewEase Assist Companion](#2-viewease-assist-companion)
  - [3. TVBridge™ Shared Compatibility Layer](#3-tvbridge-shared-compatibility-layer)
  - [4. FocusLab™ Built-In Diagnostics](#4-focuslab-built-in-diagnostics)
  - [5. Persistence: Continue Watching & My List](#5-persistence-continue-watching--my-list)
- [Architecture & Monorepo Structure](#architecture--monorepo-structure)
- [Platform Support & Validation Status](#platform-support--validation-status)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Development Commands](#development-commands)
  - [Testing & Quality Assurance](#testing--quality-assurance)
  - [Production Export](#production-export)
- [Remote Control & Spatial Navigation](#remote-control--spatial-navigation)
- [Zero-Cost Development Guarantee](#zero-cost-development-guarantee)
- [Upstream Attribution & Licensing](#upstream-attribution--licensing)

---

## Product Identity & Vision

- **Name**: ViewEase TV
- **Tagline**: *Every Scene, Understood.*
- **Target Platforms**: Amazon Fire TV (Fire OS), Fire TV (Vega OS), Android TV, Web TV.
- **Vision**: Modern entertainment is filled with dense dialogue, whispered accents, complex ensemble plots, and jargon. ViewEase TV bridges the comprehension gap directly on the big screen through thoughtful 10-foot UI design, robust remote focus management, and deterministic, low-latency contextual intelligence.

---

## Key Features

### 1. Cinematic Entertainment Hub
- **Warm Charcoal & Amber Design System**: Purpose-built TV aesthetic using deep charcoal surfaces (`#0D0F14`, `#161B22`), rich golden amber accents (`#E5A93C`, `#F5BE58`), and ivory typography (`#F0F3F8`).
- **Dynamic Backdrop Hero Banner**: Smooth visual transition responding to focused cards, displaying high-resolution artwork, maturity ratings, 4K/HDR badges, and immediate "Play" and "Add to My List" CTAs.
- **Curated Content Rows**: Horizontal carousels for Continue Watching, Trending Originals, Sci-Fi Epics, Mystery & Thrillers, and Documentaries.
- **Browse & Instant Search**: Dedicated search screen with category filter pills and live real-time query matching across titles, genres, and synopses.
- **Rich Title Details Screen**: Comprehensive metadata presentation with duration, release year, genre tags, storyline breakdown, persistent watchlist toggling, and related titles carousel.

### 2. ViewEase Assist Companion
Access contextual comprehension tools right from the video overlay at any point during playback:
- **Explain This Line**: Delivers concise, jargon-free explanations of dialogue in real time.
- **Make It Simpler**: Rewrites convoluted or fast-paced exposition into natural, accessible phrasing.
- **Translate**: Provides instant translations into Hindi for multilingual households.
- **Who Said That?**: Identifies the speaking character, their role in the story, and context for their motivation.
- **Previously in This Story**: Generates contextual, spoiler-free narrative recaps that only cover events up to the current timestamp.

*Powered by a pluggable `ViewEaseAssistProvider` interface. The prototype ships with an offline-first `CuratedLocalAssistProvider` guaranteeing instant response times with zero cloud dependencies or paid API keys.*

### 3. TVBridge™ Shared Compatibility Layer
A resilient TV interaction framework located in `packages/shared-ui/src/tvbridge/`:
- **Unified TV Player Controller (`useTVPlayerController`)**: Standardizes play, pause, seek, overlay visibility, and companion drawer state.
- **Key Mapping Normalization**: Corrects upstream starter defects (such as inverted fast-forward/rewind behaviors) across physical Fire TV remotes, Android TV D-pads, and keyboard emulations.
- **Focus Restoration State Machine (`FocusRestorationManager`)**: Remembers and restores the exact focused node when navigating back from modal drawers, title details, or full-screen playback.
- **Platform Capability Detection (`getTVPlatformCapabilities`)**: Detects operating system capabilities, hardware acceleration support, and optimal video buffer settings.

### 4. FocusLab™ Built-In Diagnostics
Accessible directly from **Settings > FocusLab™ Diagnostics**:
- **Live Remote Event Telemetry**: 50-event bounded circular buffer capturing D-pad direction, key code, timestamp, and target node.
- **Hardware & Runtime Inspector**: Reports platform OS, Hermes engine status, pixel ratio, window dimensions, and focus engine version.
- **Automated Diagnostic Suite**: Runs 6 repeatable in-app test scenarios verifying catalog integrity, assist provider capabilities, spatial navigation boundaries, storage read/write performance, and focus restoration contracts.
- **Compatibility Report Generator**: Generates clean, copyable markdown diagnostic summaries directly on the TV screen.

### 5. Persistence: Continue Watching & My List
- Seamless local storage via `StorageService` using `@react-native-async-storage/async-storage`.
- Automatically logs video timestamps, calculates progress percentages, and removes completed titles (>95%).
- Instant, non-blocking watchlist additions and removals reflected across Home, Details, and My List screens.

---

## Architecture & Monorepo Structure

```text
Amazon_Fire_TV/
├── apps/
│   ├── expo-multi-tv/           # Universal React Native TV App (Fire OS / Android TV / Web)
│   │   ├── __tests__/           # Comprehensive Jest automated test suite
│   │   ├── app.json             # ViewEase TV app manifest & TV banner configurations
│   │   ├── App.tsx              # Application entry point with SpaceNavigation provider
│   │   └── package.json         # Expo SDK 54 / React Native 0.81 TVOS
│   └── vega/                    # Fire TV Vega OS Target (Preserved Amazon Kepler Architecture)
│       ├── src/                 # Kepler native entry points & TVEventHandler
│       └── package.json         # React 18 / React Native 0.72 Kepler toolchain
├── packages/
│   └── shared-ui/               # Core ViewEase TV UI, Logic & TVBridge
│       ├── src/
│       │   ├── components/      # Cinematic cards, player overlay, assist drawer
│       │   ├── data/            # Rich offline catalog & timestamped transcripts
│       │   ├── screens/         # Home, Explore, Details, Player, My List, Settings, FocusLab
│       │   ├── services/        # Local storage & ViewEase Assist Provider interface
│       │   ├── theme/           # Warm Amber & Charcoal cinematic design tokens
│       │   └── tvbridge/        # Cross-platform TVBridge abstraction layer
│       └── tsconfig.json        # Shared TypeScript configuration
├── package.json                 # Monorepo root with Yarn 4 workspaces
└── README.md                    # Authoritative project documentation
```

---

## Platform Support & Validation Status

| Platform | Target Architecture | Build & Test Status | Notes |
| :--- | :--- | :--- | :--- |
| **Amazon Fire TV (Fire OS)** | `apps/expo-multi-tv` (Android TV target) | **Verified** | Uses `react-native-tvos` + `react-native-video` (ExoPlayer) with full D-pad remote support. |
| **Web TV (WebOS / Tizen / Browser)** | `apps/expo-multi-tv` (Web target) | **Verified** | Production export succeeded (`expo export --platform web`, 1.84 MB bundle). 100% keyboard D-pad navigation. |
| **Amazon Fire TV (Vega OS)** | `apps/vega` (Kepler target) | **Architecture Preserved** | Upstream Vega codebase maintained in `apps/vega/`. Full compilation requires Amazon's proprietary Kepler SDK. |
| **Automated Test Suite** | Jest + TypeScript | **16 / 16 Passing** | Unit tests cover ViewEase Catalog, ViewEase Assist, Storage, and TVBridge. |
| **Static Type Checking** | TypeScript 5.7 (`tsc`) | **0 Errors** | Clean compilation across `@multi-tv/shared-ui` and `@multi-tv/expo-multi-tv`. |

---

## Getting Started

### Prerequisites
- **Node.js**: v18.0.0 or higher (Node v24 recommended)
- **Corepack**: Enabled (`corepack enable`) to manage Yarn 4.5.0
- **Android Studio / Fire TV SDK** *(optional, for physical device deployment)*: Android SDK 34+ with `adb`

### Installation
Clone your repository and install dependencies using Corepack Yarn:

```bash
git clone https://github.com/Nishant-Kumar-007/Amazon_Fire_TV.git
cd Amazon_Fire_TV

# Install all workspace dependencies
corepack yarn install
```

### Development Commands

#### 1. Run Web TV Experience (Fastest Preview)
Simulates the television experience in any modern browser with full keyboard D-pad navigation:
```bash
corepack yarn dev:web
```

#### 2. Run on Amazon Fire TV (Fire OS) / Android TV
Deploy to an emulator or physical Fire TV device connected via `adb`:
```bash
# Ensure device is connected
adb devices

# Launch Metro bundler and run on Fire TV
corepack yarn dev:android
```

#### 3. Run on Apple TV
```bash
corepack yarn dev:ios
```

---

### Testing & Quality Assurance

Run the automated test suite:
```bash
corepack yarn workspace @multi-tv/expo-multi-tv test --watchAll=false
```
*Result: 16 test suites passing (ViewEase Catalog integrity, Assist Provider responses, Watchlist storage persistence, TVBridge player controller).*

Run static type checking across all packages:
```bash
# Typecheck shared-ui
corepack yarn workspace @multi-tv/shared-ui run tsc

# Typecheck expo-multi-tv
corepack yarn workspace @multi-tv/expo-multi-tv typecheck
```

---

### Production Export

Export the optimized production bundle for Web TV / smart TV web runtimes:
```bash
corepack yarn workspace @multi-tv/expo-multi-tv run expo export --platform web
```
Output is generated to `apps/expo-multi-tv/dist/` ready to be served via any lightweight HTTP daemon.

---

## Remote Control & Spatial Navigation

The app is built around 10-foot spatial navigation. All views are navigable using standard TV remotes or keyboard arrow keys:

| Remote Button | Keyboard Key | In Navigation | In Video Player | In ViewEase Assist |
| :--- | :--- | :--- | :--- | :--- |
| **D-Pad Up / Down** | Arrow Up / Down | Move between rows / items | Show / hide overlay controls | Select transcript segment / action |
| **D-Pad Left / Right** | Arrow Left / Right | Move across carousel cards | Seek backward / forward 10s | Switch assistant action tab |
| **Select / OK** | Enter / Return | Open title / trigger action | Toggle play / pause | Trigger companion explanation |
| **Back** | Escape / Backspace | Navigate to previous screen | Exit player (restores focus) | Dismiss companion overlay |
| **Play / Pause** | Spacebar | N/A | Toggle Playback | Toggle Playback |
| **Fast Forward** | Right Bracket (`]`) | N/A | Step forward 10 seconds | N/A |
| **Rewind** | Left Bracket (`[`) | N/A | Step backward 10 seconds | N/A |

---

## Zero-Cost Development Guarantee

ViewEase TV requires **no paid cloud subscriptions, no external API keys, and no telemetry services**:
- **Offline Deterministic Companion**: Sample transcripts, character biographies, and multilingual translations are bundled locally in `packages/shared-ui/src/data/viewEaseCatalog.ts`.
- **Public Domain Sample Streaming**: Integrates legal, CORS-compliant demonstration streams (e.g. Big Buck Bunny, Tears of Steel, Elephants Dream) for reliable player testing.
- **Zero Lock-In Provider Architecture**: Future teams can plug in Gemini, Claude, or AWS Bedrock APIs simply by implementing the `ViewEaseAssistProvider` TypeScript interface.

---

## Upstream Attribution & Licensing

ViewEase TV was developed as an advanced transformation of the official Amazon open-source starter:
- **Upstream Project**: [AmazonAppDev/react-native-multi-tv-app-sample](https://github.com/AmazonAppDev/react-native-multi-tv-app-sample)
- **Primary Repository**: [Nishant-Kumar-007/Amazon_Fire_TV](https://github.com/Nishant-Kumar-007/Amazon_Fire_TV)
- **License**: Licensed under the **MIT-0 License** (MIT No Attribution). See the [LICENSE](./LICENSE) file for complete details.
- **Notice**: Amazon, Fire TV, and related marks are trademarks of Amazon.com, Inc. or its affiliates. This project is an independent hackathon submission.

---

*Engineered with precision for the Amazon Developer Hackathon 2026.*
