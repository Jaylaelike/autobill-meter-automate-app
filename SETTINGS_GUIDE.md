# Monitor Settings Guide

## Overview
The monitor system now supports dynamic configuration through a settings file that can be managed from the frontend Settings page.

## How It Works

### 1. Settings File Location
- **File:** `monitor-settings.json` (in project root)
- **Format:** JSON
- **Created by:** Frontend Settings page when you save settings

### 2. Settings Parameters

| Parameter | Description | Default | Min | Max | Unit |
|-----------|-------------|---------|-----|-----|------|
| `dbSaveInterval` | How often to save data to database | 30000 | 5000 | 300000 | milliseconds |
| `updateRate` | WebSocket data request frequency | 3000 | 1000 | 60000 | milliseconds |
| `connectionTimeout` | WebSocket connection timeout | 10000 | 5000 | 60000 | milliseconds |
| `reconnectInterval` | Delay between reconnection attempts | 5000 | 1000 | 60000 | milliseconds |
| `maxReconnectAttempts` | Maximum reconnection attempts | 10 | 1 | 50 | count |

### 3. How to Update Settings

#### From Frontend (Recommended)
1. Navigate to **Settings** page in the sidebar
2. Adjust the intervals as needed
3. Click **Save Settings**
4. **Restart the monitor service** for changes to take effect

#### Manual File Edit
1. Edit `monitor-settings.json` in the project root
2. Ensure valid JSON format
3. Restart the monitor service

### 4. Applying Settings

**Important:** Settings are loaded when `monitor.js` starts. To apply new settings:

```bash
# Stop the monitor
# (Press Ctrl+C if running in terminal)

# Restart the monitor
npm start
# or
node monitor.js simultaneous
```

### 5. Verifying Settings

#### Check if settings file exists:
```bash
node test-settings.js
```

#### Check monitor logs on startup:
When monitor.js starts, it will log:
```
📋 Loaded settings from file: /path/to/monitor-settings.json
   Settings: { ... }

⚙️  Monitor Configuration:
   Update Rate: 3000ms (3s)
   DB Save Interval: 30000ms (30s)
   ...
```

#### Check during operation:
When data is saved, the log will show:
```
[Station] 💾 Data saved (interval: 30s) - Total Active: 1234.56W, Total MUX: 789.01kWh
```

### 6. Example Settings File

```json
{
  "dbSaveInterval": 30000,
  "updateRate": 3000,
  "connectionTimeout": 10000,
  "reconnectInterval": 5000,
  "maxReconnectAttempts": 10
}
```

### 7. Troubleshooting

#### Settings not applying?
1. Check if `monitor-settings.json` exists in project root
2. Verify JSON format is valid
3. Ensure you restarted the monitor service
4. Check monitor logs for "Loaded settings from file" message

#### Settings file not created?
1. Check frontend Settings page for errors
2. Verify file permissions in project directory
3. Check browser console for API errors

#### Want to reset to defaults?
1. Delete `monitor-settings.json` file
2. Restart monitor service
3. Default values will be used

## Database Save Interval Impact

The `dbSaveInterval` controls how often power readings are written to the database:

- **Lower values (5-15s):** More frequent saves, larger database, more real-time data
- **Higher values (30-60s):** Less frequent saves, smaller database, less granular data
- **Recommended:** 30 seconds for balance between data granularity and database size

## Notes

- Settings are stored in **milliseconds** in the file
- Frontend displays values in **seconds** for easier editing
- Monitor must be **restarted** for settings to take effect
- Invalid settings will fall back to defaults
- Settings file is optional - defaults are used if not present
