# GE Automate Meter Node

A comprehensive power monitoring system that collects real-time data from multiple stations via WebSocket connections and provides a modern web dashboard for visualization and analytics.

## Screenshots

### Backend Screenshot
![Backend Overview](https://56fwnhyzti.ufs.sh/f/aK4w8mNL3AiP82fV67CIASebfHy6vUqQVTDpmPjuM4on8xhi)


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
- **Logging**: Comprehensive logging system with rotation

### Frontend Dashboard
- **Station Overview**: Real-time status monitoring for all stations
- **Station Detail Pages**: Comprehensive analytics per station
- **Power Summary Cards**: Total Active Power, MUX Power, and sensor counts
- **Historical Analysis**: Configurable time periods (Day, Week, Month, Year)
- **Power Breakdowns**: Individual channel analysis with MIN/MAX/AVG statistics
- **Real-time Updates**: Auto-refreshing data with WebSocket integration

## Project Structure

```
ge-automate-meter-node/
├── src/                          # Backend source code
│   ├── api/                      # API data fetchers
│   ├── database/                 # Database services
│   ├── utils/                    # Utility scripts
│   └── websocket/                # WebSocket handlers
├── frontend/                     # Frontend Next.js application
│   └── meter-reading-dashboard/  # Dashboard application
├── prisma/                       # Database schema and migrations
├── logs/                         # Application logs
├── scripts/                      # Utility scripts
├── monitor.js                    # Main monitoring application
├── chaigmai.js                   # Chiang Mai specific monitoring
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
Edit `monitor.js` configuration:

```javascript
const config = {
  updateRate: 3000,           // Data collection interval (ms)
  connectionTimeout: 10000,   // WebSocket timeout (ms)
  reconnectInterval: 5000,    // Reconnection delay (ms)
  maxReconnectAttempts: 5,    // Max reconnection attempts
  cycleDelay: 60000,         // Delay between station cycles (ms)
};
```

## Database Schema

### Core Models

**Station**
- id, name, ipAddress, scene
- Relationship to PowerReading and StationMonitoredObject

**PowerReading**
- Timestamp-based power measurements
- 6 Active Power channels (activePower1-6)
- 6 MUX Power channels (muxPower1-6)

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