# GE Automate Meter Node

A comprehensive power monitoring system that collects real-time data from multiple stations via WebSocket connections and provides a modern web dashboard for visualization and analytics.

## Screenshots

### Backend Screenshot
![Backend Overview](https://56fwnhyzti.ufs.sh/f/aK4w8mNL3AiP82fV67CIASebfHy6vUqQVTDpmPjuM4on8xhi)

---

## System Architecture Diagrams

### High-Level System Overview

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        GE AUTOMATE METER NODE SYSTEM                        │
└─────────────────────────────────────────────────────────────────────────────┘

    ┌──────────────┐     ┌──────────────┐     ┌──────────────┐
    │   Station 1  │     │   Station 2  │     │   Station N  │
    │    (แพร่)     │     │    (น่าน)     │     │   (ชุมพร)    │
    │  WebSocket   │     │  WebSocket   │     │  WebSocket   │
    └──────┬───────┘     └──────┬───────┘     └──────┬───────┘
           │                    │                    │
           │    Real-time Power Data (3s interval)  │
           └────────────────────┼────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                         BACKEND (Node.js)                                   │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                      monitor.js                                      │   │
│  │  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────────┐  │   │
│  │  │ StationMonitor  │  │ MonitorController│  │  ApiDataFetcher    │  │   │
│  │  │  - WebSocket    │  │  - Orchestration │  │  - HTTP API calls  │  │   │
│  │  │  - Data Buffer  │  │  - Station Mgmt  │  │  - Chiang Mai      │  │   │
│  │  │  - Reconnection │  │  - DB Init       │  │  - Data Transform  │  │   │
│  │  └─────────────────┘  └─────────────────┘  └─────────────────────┘  │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                    │                                        │
│                                    ▼ (30s interval)                         │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                    DatabaseService.js                                │   │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────────────┐  │   │
│  │  │ Prisma ORM  │  │ Validation  │  │ Total Power Calculation     │  │   │
│  │  │             │  │             │  │ - totalActivePower          │  │   │
│  │  │             │  │             │  │ - totalMuxPower             │  │   │
│  │  └─────────────┘  └─────────────┘  └─────────────────────────────┘  │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                    │                                        │
└────────────────────────────────────┼────────────────────────────────────────┘
                                     │
                                     ▼
                    ┌────────────────────────────────┐
                    │        SQLite Database         │
                    │  ┌──────────────────────────┐  │
                    │  │ Station                  │  │
                    │  │ PowerReading             │  │
                    │  │ StationMonitoredObject   │  │
                    │  │ User                     │  │
                    │  └──────────────────────────┘  │
                    └────────────────────────────────┘
                                     │
                                     ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                      FRONTEND (Next.js Dashboard)                           │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                         API Routes                                   │   │
│  │  /api/station/[id]  │  /api/station/[id]/historical  │  /api/settings│   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                         Components                                   │   │
│  │  stats-cards │ power-readings-table │ historical-bar-chart │ sidebar│   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                           Pages                                      │   │
│  │     Dashboard (/)  │  Station Detail (/station/[id])  │  Settings   │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────────┘
                                     │
                                     ▼
                    ┌────────────────────────────────┐
                    │         Web Browser            │
                    │    http://localhost:3000       │
                    └────────────────────────────────┘
```

### Data Flow Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           DATA FLOW DIAGRAM                                 │
└─────────────────────────────────────────────────────────────────────────────┘

  POWER STATIONS                    BACKEND                      FRONTEND
  ══════════════                    ═══════                      ════════

  ┌─────────────┐
  │  Station    │
  │  Hardware   │
  │  (PLC/RTU)  │
  └──────┬──────┘
         │
         │ WebSocket Connection
         │ ws://10.x.x.x/ws
         ▼
  ┌─────────────┐     ┌─────────────────────────────────────────────────┐
  │  WebSocket  │────▶│  1. CONNECT & AUTHENTICATE                      │
  │  Server     │     │     - comet.signIn (Admin/admin)                │
  │             │     │     - Get USID session token                    │
  └─────────────┘     │     - Subscribe to ScriptEngine notifications   │
                      └─────────────────────────────────────────────────┘
                                          │
                                          ▼
                      ┌─────────────────────────────────────────────────┐
                      │  2. REGISTER MONITORED OBJECTS                  │
                      │     Active Power: 8684-8689 (6 channels)        │
                      │     MUX Power: 18069-18070, 73909-73910,        │
                      │                75428-75429 (6 channels)         │
                      └─────────────────────────────────────────────────┘
                                          │
                                          ▼
                      ┌─────────────────────────────────────────────────┐
                      │  3. RECEIVE REAL-TIME DATA (every 3s)           │
                      │     {                                           │
                      │       "8684": 1234.56,  // Active Power 1       │
                      │       "8685": 2345.67,  // Active Power 2       │
                      │       ...                                       │
                      │       "18069": 100.5,   // MUX Power 1          │
                      │       ...                                       │
                      │     }                                           │
                      └─────────────────────────────────────────────────┘
                                          │
                                          ▼
                      ┌─────────────────────────────────────────────────┐
                      │  4. BUFFER & CALCULATE TOTALS                   │
                      │     totalActivePower = Σ(activePower1-6)        │
                      │     totalMuxPower = Σ(muxPower1-6)              │
                      └─────────────────────────────────────────────────┘
                                          │
                                          ▼ (every 30s)
                      ┌─────────────────────────────────────────────────┐
                      │  5. SAVE TO DATABASE                            │
                      │     PowerReading {                              │
                      │       stationId, timestamp,                     │
                      │       activePower1-6, muxPower1-6,              │
                      │       totalActivePower, totalMuxPower           │
                      │     }                                           │
                      └─────────────────────────────────────────────────┘
                                          │
                                          │
                      ┌───────────────────┴───────────────────┐
                      │           SQLite Database             │
                      └───────────────────┬───────────────────┘
                                          │
                                          ▼
                      ┌─────────────────────────────────────────────────┐
                      │  6. API ROUTES QUERY DATABASE                   │
                      │     GET /api/station/[id]                       │
                      │     GET /api/station/[id]/historical            │
                      │     GET /api/station/[id]/realtime              │
                      └─────────────────────────────────────────────────┘
                                          │
                                          ▼
                                                        ┌─────────────────┐
                                                        │  7. DASHBOARD   │
                                                        │  - Stats Cards  │
                                                        │  - Power Table  │
                                                        │  - Bar Charts   │
                                                        │  - Analytics    │
                                                        └─────────────────┘
```


### Component Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                       COMPONENT ARCHITECTURE                                │
└─────────────────────────────────────────────────────────────────────────────┘

BACKEND COMPONENTS
══════════════════

┌─────────────────────────────────────────────────────────────────────────────┐
│                              monitor.js                                     │
│  ┌───────────────────────────────────────────────────────────────────────┐ │
│  │                        MonitorController                               │ │
│  │  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────────┐   │ │
│  │  │ initialize()    │  │ startSimultaneous│  │ loadStationsFromDB │   │ │
│  │  │ - DB connect    │  │ - All stations   │  │ - Dynamic config   │   │ │
│  │  │ - Load stations │  │ - Parallel run   │  │ - Fallback support │   │ │
│  │  └─────────────────┘  └─────────────────┘  └─────────────────────┘   │ │
│  └───────────────────────────────────────────────────────────────────────┘ │
│                                    │                                        │
│                    ┌───────────────┴───────────────┐                       │
│                    ▼                               ▼                        │
│  ┌─────────────────────────────┐  ┌─────────────────────────────────────┐  │
│  │      StationMonitor         │  │         ApiDataFetcher              │  │
│  │  ┌───────────────────────┐  │  │  ┌───────────────────────────────┐  │  │
│  │  │ connect()             │  │  │  │ connect()                     │  │  │
│  │  │ initializeSession()   │  │  │  │ fetchData()                   │  │  │
│  │  │ startMonitoring()     │  │  │  │ transformData()               │  │  │
│  │  │ saveToDatabase()      │  │  │  │ saveToDatabase()              │  │  │
│  │  │ handleReconnect()     │  │  │  │ handleReconnect()             │  │  │
│  │  │ checkNetworkConnectivity│ │  │  └───────────────────────────────┘  │  │
│  │  └───────────────────────┘  │  │  For: Chiang Mai (HTTP API)         │  │
│  │  For: WebSocket stations    │  └─────────────────────────────────────┘  │
│  └─────────────────────────────┘                                           │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│                         DatabaseService.js                                  │
│  ┌───────────────────────────────────────────────────────────────────────┐ │
│  │                          Prisma Client                                 │ │
│  │  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────────┐   │ │
│  │  │ Station CRUD    │  │ PowerReading    │  │ MonitoredObjects    │   │ │
│  │  │ - findOrCreate  │  │ - create        │  │ - getByStation      │   │ │
│  │  │ - getAll        │  │ - getLatest     │  │ - updateMapping     │   │ │
│  │  │ - update        │  │ - aggregate     │  │                     │   │ │
│  │  └─────────────────┘  └─────────────────┘  └─────────────────────┘   │ │
│  └───────────────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────────────┘


FRONTEND COMPONENTS (Next.js)
═════════════════════════════

┌─────────────────────────────────────────────────────────────────────────────┐
│                    frontend/meter-reading-dashboard                         │
│                                                                             │
│  PAGES                                                                      │
│  ┌─────────────────┐  ┌─────────────────────┐  ┌─────────────────────────┐ │
│  │   / (Dashboard) │  │ /station/[id]       │  │ /settings               │ │
│  │   - Overview    │  │ - Station Detail    │  │ - Interval Config       │ │
│  │   - All Stats   │  │ - Historical Chart  │  │ - Clear Readings        │ │
│  └─────────────────┘  └─────────────────────┘  └─────────────────────────┘ │
│                                                                             │
│  COMPONENTS                                                                 │
│  ┌─────────────────┐  ┌─────────────────────┐  ┌─────────────────────────┐ │
│  │  stats-cards    │  │ power-readings-table│  │ historical-bar-chart    │ │
│  │  - Total Active │  │ - Station list      │  │ - Daily/Weekly/Monthly  │ │
│  │  - Total MUX    │  │ - Power values      │  │ - Power trends          │ │
│  │  - Sensor count │  │ - Status indicators │  │ - Time-based analysis   │ │
│  └─────────────────┘  └─────────────────────┘  └─────────────────────────┘ │
│  ┌─────────────────┐  ┌─────────────────────┐  ┌─────────────────────────┐ │
│  │  app-sidebar    │  │ power-summary-cards │  │ station-detail-page     │ │
│  │  - Navigation   │  │ - Per-station stats │  │ - Analytics             │ │
│  │  - Settings link│  │ - Real-time values  │  │ - MIN/MAX/AVG           │ │
│  └─────────────────┘  └─────────────────────┘  └─────────────────────────┘ │
│                                                                             │
│  API ROUTES                                                                 │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │ /api/station/[id]              - Station details & latest reading   │   │
│  │ /api/station/[id]/historical   - Historical power data              │   │
│  │ /api/station/[id]/realtime     - Real-time readings                 │   │
│  │ /api/station/[id]/active-power-analytics - Active Power stats       │   │
│  │ /api/station/[id]/mux-analytics          - MUX Power stats          │   │
│  │ /api/settings                  - Read/Write monitor settings        │   │
│  │ /api/settings/clear-readings   - Clear PowerReading table           │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Database Schema Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         DATABASE SCHEMA (SQLite)                            │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────┐
│           Station               │
├─────────────────────────────────┤
│ id          Int      PK         │
│ name        String   UNIQUE     │
│ ipAddress   String              │
│ scene       String?             │
│ createdAt   DateTime            │
│ updatedAt   DateTime            │
├─────────────────────────────────┤
│ ◄─── PowerReading (1:N)         │
│ ◄─── StationMonitoredObject(1:N)│
└─────────────────────────────────┘
              │
              │ 1:N
              ▼
┌─────────────────────────────────┐       ┌─────────────────────────────────┐
│        PowerReading             │       │   StationMonitoredObject        │
├─────────────────────────────────┤       ├─────────────────────────────────┤
│ id               Int      PK    │       │ id            Int      PK       │
│ stationId        Int      FK    │       │ stationId     Int      FK       │
│ timestamp        DateTime       │       │ objectType    String            │
│ activePower1     Float?         │       │ objectId      Int               │
│ activePower2     Float?         │       │ label         String?           │
│ activePower3     Float?         │       │ createdAt     DateTime          │
│ activePower4     Float?         │       │ updatedAt     DateTime          │
│ activePower5     Float?         │       └─────────────────────────────────┘
│ activePower6     Float?         │
│ muxPower1        Float?         │       ┌─────────────────────────────────┐
│ muxPower2        Float?         │       │            User                 │
│ muxPower3        Float?         │       ├─────────────────────────────────┤
│ muxPower4        Float?         │       │ id            Int      PK       │
│ muxPower5        Float?         │       │ username      String   UNIQUE   │
│ muxPower6        Float?         │       │ email         String   UNIQUE   │
│ totalActivePower Float?         │       │ password      String            │
│ totalMuxPower    Float?         │       │ role          String            │
│ createdAt        DateTime       │       │ createdAt     DateTime          │
└─────────────────────────────────┘       │ updatedAt     DateTime          │
                                          └─────────────────────────────────┘
```

### Settings & Configuration Flow

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    SETTINGS CONFIGURATION FLOW                              │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│                         FRONTEND SETTINGS PAGE                              │
│  ┌───────────────────────────────────────────────────────────────────────┐ │
│  │  ┌─────────────────────┐  ┌─────────────────────┐                     │ │
│  │  │ DB Save Interval    │  │ Update Rate         │                     │ │
│  │  │ [    30    ] sec    │  │ [    3     ] sec    │                     │ │
│  │  └─────────────────────┘  └─────────────────────┘                     │ │
│  │  ┌─────────────────────┐  ┌─────────────────────┐                     │ │
│  │  │ Connection Timeout  │  │ Reconnect Interval  │                     │ │
│  │  │ [    10    ] sec    │  │ [    5     ] sec    │                     │ │
│  │  └─────────────────────┘  └─────────────────────┘                     │ │
│  │  ┌─────────────────────┐                                              │ │
│  │  │ Max Reconnect       │  ┌──────────────────────────────────────┐   │ │
│  │  │ [    10    ] times  │  │  [Save Settings]  [Clear Readings]   │   │ │
│  │  └─────────────────────┘  └──────────────────────────────────────┘   │ │
│  └───────────────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────────────┘
                                    │
                                    │ POST /api/settings
                                    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                         monitor-settings.json                               │
│  {                                                                          │
│    "dbSaveInterval": 30000,      // ms - How often to save to database     │
│    "updateRate": 3000,           // ms - WebSocket data request frequency  │
│    "connectionTimeout": 10000,   // ms - WebSocket connection timeout      │
│    "reconnectInterval": 5000,    // ms - Delay between reconnect attempts  │
│    "maxReconnectAttempts": 10    // count - Max reconnection attempts      │
│  }                                                                          │
└─────────────────────────────────────────────────────────────────────────────┘
                                    │
                                    │ Read on startup
                                    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                            monitor.js                                       │
│  loadSettingsFromFile() ──▶ config = { ...defaults, ...customSettings }    │
│                                                                             │
│  ⚠️  IMPORTANT: Restart monitor.js for settings to take effect!            │
└─────────────────────────────────────────────────────────────────────────────┘
```


### Network Reconnection Flow

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                      NETWORK RECONNECTION FLOW                              │
└─────────────────────────────────────────────────────────────────────────────┘

                    ┌─────────────────────┐
                    │   Connection Lost   │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │ reconnectAttempts++ │
                    │ networkFailureCount++│
                    └──────────┬──────────┘
                               │
                               ▼
              ┌────────────────────────────────┐
              │ attempts < maxReconnectAttempts│
              │         (default: 10)          │
              └────────────────┬───────────────┘
                    ┌──────────┴──────────┐
                    │                     │
                   YES                    NO
                    │                     │
                    ▼                     ▼
    ┌───────────────────────────┐  ┌─────────────────────────┐
    │ Calculate Backoff Delay   │  │ Wait 2 minutes          │
    │ delay = min(              │  │ Reset reconnectAttempts │
    │   reconnectInterval *     │  │ Try again               │
    │   1.5^(attempts-1),       │  └─────────────────────────┘
    │   60000                   │
    │ )                         │
    └───────────────┬───────────┘
                    │
                    ▼
    ┌───────────────────────────┐
    │ Check Network Connectivity│
    │ (TCP connect to port 80)  │
    └───────────────┬───────────┘
                    │
         ┌─────────┴─────────┐
         │                   │
    Available           Unavailable
         │                   │
         ▼                   ▼
    ┌─────────────┐    ┌─────────────┐
    │ Reconnect   │    │ Wait & Retry│
    │ WebSocket   │    │ (increment  │
    └──────┬──────┘    │  attempts)  │
           │           └─────────────┘
    ┌──────┴──────┐
    │             │
  Success       Fail
    │             │
    ▼             ▼
┌─────────┐  ┌─────────────┐
│ Reset   │  │ Continue    │
│ counters│  │ retry loop  │
│ Resume  │  └─────────────┘
│ monitor │
└─────────┘
```

---

## System Architecture

The system consists of two main components:

1. **Backend Data Collector** (Node.js) - Collects real-time data from stations
2. **Frontend Dashboard** (Next.js) - Provides web interface for monitoring and analytics

## Features

### Backend Data Collector
- **Real-time WebSocket Monitoring**: Connects to multiple stations simultaneously
- **Dynamic Station Management**: Load station configurations from database
- **Monitored Objects**: Tracks 12 power objects per station:
  - Active Power 1-6 (Objects: 8684-8689)
  - MUX Power Meters 1-6 (Objects: 18069-18070, 73909-73910, 75428-75429)
- **Auto-reconnection**: Handles connection failures with exponential backoff
- **Data Persistence**: Stores readings in SQLite database via Prisma ORM
- **Configurable Settings**: Adjustable intervals via Settings page
- **Logging**: Comprehensive logging system with rotation

### Frontend Dashboard
- **Station Overview**: Real-time status monitoring for all stations
- **Station Detail Pages**: Comprehensive analytics per station
- **Power Summary Cards**: Total Active Power, MUX Power, and sensor counts
- **Historical Analysis**: Configurable time periods (Day, Week, Month, Year)
- **Power Breakdowns**: Individual channel analysis with MIN/MAX/AVG statistics
- **Settings Page**: Configure monitor intervals and clear database
- **Real-time Updates**: Auto-refreshing data with WebSocket integration

## Project Structure

```
ge-automate-meter-node/
├── src/                          # Backend source code
│   ├── api/                      # API data fetchers
│   │   └── ApiDataFetcher.js     # HTTP API for Chiang Mai station
│   ├── database/                 # Database services
│   │   └── DatabaseService.js    # Prisma ORM wrapper
│   ├── utils/                    # Utility scripts
│   └── websocket/                # WebSocket handlers
├── frontend/                     # Frontend Next.js application
│   └── meter-reading-dashboard/  # Dashboard application
│       ├── app/                  # Next.js app router
│       │   ├── api/              # API routes
│       │   ├── station/[id]/     # Station detail page
│       │   └── settings/         # Settings page
│       ├── components/           # React components
│       └── lib/                  # Utilities and types
├── prisma/                       # Database schema and migrations
│   └── schema.prisma             # Prisma schema definition
├── logs/                         # Application logs
├── monitor.js                    # Main monitoring application
├── chaigmai.js                   # Chiang Mai specific monitoring
├── monitor-settings.json         # Runtime settings (created by Settings page)
└── *.csv                         # Data import/export files
```

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm (recommended) or npm
- SQLite (included)

### Installation

1. **Clone the repository:**
```bash
git clone <repository-url>
cd ge-automate-meter-node
```

2. **Install dependencies:**
```bash
pnpm install
```

3. **Set up environment variables:**
```bash
cp .env.example .env
```

4. **Configure database:**
```bash
pnpm db:generate
pnpm db:migrate
```

5. **Seed initial data:**
```bash
pnpm stations:seed
pnpm objects:import
```

### Running the System

#### Start Backend Monitor
```bash
# Start the main monitoring service
pnpm start

# Or run specific monitors
node monitor.js
node chaigmai.js
```

#### Start Frontend Dashboard
```bash
cd frontend/meter-reading-dashboard
pnpm install
pnpm dev
```

The dashboard will be available at [http://localhost:3000](http://localhost:3000)

## Configuration

### Station Configuration
Stations are managed dynamically through the database. Use the station management utilities:

```bash
# List all stations
pnpm stations:list

# Seed default stations
pnpm stations:seed

# Analyze station data
pnpm stations:analyze
```

### Monitored Objects
The system monitors 12 objects per station:

| Object ID | Type | Description |
|-----------|------|-------------|
| 8684-8689 | Active Power | Power channels 1-6 |
| 18069-18070 | MUX Power | MUX meters 1-2 |
| 73909-73910 | MUX Power | MUX meters 3-4 |
| 75428-75429 | MUX Power | MUX meters 5-6 |

### System Settings

Settings can be configured via the **Settings page** in the dashboard or by editing `monitor-settings.json`:

| Parameter | Description | Default | Unit |
|-----------|-------------|---------|------|
| `dbSaveInterval` | How often to save data to database | 30000 | ms |
| `updateRate` | WebSocket data request frequency | 3000 | ms |
| `connectionTimeout` | WebSocket connection timeout | 10000 | ms |
| `reconnectInterval` | Delay between reconnection attempts | 5000 | ms |
| `maxReconnectAttempts` | Maximum reconnection attempts | 10 | count |

**Note:** Restart `monitor.js` after changing settings for them to take effect.


## Database Schema

### Core Models

**Station**
- id, name, ipAddress, scene
- Relationship to PowerReading and StationMonitoredObject

**PowerReading**
- Timestamp-based power measurements
- 6 Active Power channels (activePower1-6)
- 6 MUX Power channels (muxPower1-6)
- Total power calculations (totalActivePower, totalMuxPower)

**StationMonitoredObject**
- Maps object types to specific IDs per station
- Enables dynamic object monitoring

## Scripts Reference

### Database Operations
```bash
pnpm db:generate    # Generate Prisma client
pnpm db:migrate     # Run database migrations
pnpm db:push        # Push schema changes
pnpm db:studio      # Open Prisma Studio
pnpm db:reset       # Reset database
```

### Station Management
```bash
pnpm stations:list     # List all stations
pnpm stations:seed     # Seed default stations
pnpm stations:analyze  # Analyze station data
pnpm stations:check    # Check station status
```

### Object Management
```bash
pnpm objects:import   # Import monitored objects
pnpm objects:verify   # Verify object mappings
```

### Testing
```bash
pnpm test:objects      # Test object monitoring
pnpm test:chiang-mai   # Test Chiang Mai station
pnpm test:monitor      # Test monitoring system
pnpm test:ranong       # Test Ranong data mapping
```

### Data Management
```bash
pnpm clear:readings   # Clear power readings (use --force)
```

## Monitoring & Logging

### Log Files
- `logs/monitor.log` - Main monitoring log
- `logs/chiangmai_*.log` - Chiang Mai specific logs
- `data.log` - Data collection log

### Health Monitoring
The system provides built-in health monitoring:
- Connection status per station
- Data collection rates
- Error tracking and recovery
- Performance metrics

## API Endpoints

The frontend provides REST APIs for data access:

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/station/[id]` | GET | Station details |
| `/api/station/[id]/historical` | GET | Historical power data |
| `/api/station/[id]/realtime` | GET | Real-time readings |
| `/api/station/[id]/active-power-analytics` | GET | Active Power analytics |
| `/api/station/[id]/mux-analytics` | GET | MUX Power analytics |
| `/api/settings` | GET/POST | Read/Write monitor settings |
| `/api/settings/clear-readings` | POST | Clear PowerReading table |

## Deployment

### Docker Deployment (Recommended)

The project includes Docker support for easy deployment and development.

#### Production Deployment

1. **Build and run with Docker Compose:**
```bash
# Build and start all services
pnpm docker:up

# View logs
pnpm docker:logs

# Stop services
pnpm docker:down
```

2. **Manual Docker build:**
```bash
# Build the image
pnpm docker:build

# Run the container
pnpm docker:run
```

#### Development with Docker

```bash
# Start development environment
pnpm docker:dev

# Stop development environment
pnpm docker:dev:down
```

The development setup includes:
- Hot reload for both backend and frontend
- Volume mounts for live code changes
- Separate development database
- Debug logging enabled

#### Docker Services

| Service | Port | Description |
|---------|------|-------------|
| `monitor` | - | Backend data collector |
| `dashboard` | 3000 | Frontend web interface |
| `db-init` | - | Database initialization (runs once) |

#### Docker Environment Variables

Create a `.env` file for Docker deployment:
```env
NODE_ENV=production
DATABASE_URL=file:./data/production.db
DEBUG=false
```

### Traditional Deployment

#### Production Setup

1. **Environment Configuration:**
```bash
NODE_ENV=production
DATABASE_URL="file:./production.db"
```

2. **Build Frontend:**
```bash
cd frontend/meter-reading-dashboard
pnpm build
```

3. **Start Services:**
```bash
# Backend monitor
pnpm start

# Frontend (production)
cd frontend/meter-reading-dashboard
pnpm start
```

### Process Management
Consider using PM2 for production process management:

```bash
pm2 start monitor.js --name "power-monitor"
pm2 start frontend/meter-reading-dashboard/package.json --name "dashboard"
```

## Troubleshooting

### Common Issues

1. **WebSocket Connection Failures**
   - Check station IP addresses and network connectivity
   - Verify firewall settings
   - Review connection logs in `logs/monitor.log`

2. **Database Issues**
   - Run `pnpm db:generate` after schema changes
   - Check database file permissions
   - Use `pnpm db:studio` for data inspection

3. **Missing Data**
   - Verify monitored object IDs are correct
   - Check station-specific object mappings
   - Review data collection logs

4. **Settings Not Applying**
   - Ensure `monitor-settings.json` exists
   - Verify JSON format is valid
   - Restart `monitor.js` after changes

### Debug Mode
Enable debug logging by setting environment variable:
```bash
DEBUG=true node monitor.js
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the ISC License.

## Support

For issues and questions:
1. Check the troubleshooting section
2. Review log files in the `logs/` directory
3. Open an issue on the repository
