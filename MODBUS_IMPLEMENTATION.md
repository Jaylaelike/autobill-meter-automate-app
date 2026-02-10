# Modbus Configuration Implementation

## Overview
Added a new `StationModbus` table to map station names to their Modbus channel broadcaster names (TV5, MCOT, PRD, TPBS, etc.).

## Database Schema

### StationModbus Model
```prisma
model StationModbus {
  id          String   @id @default(cuid())
  stationId   String   @unique
  
  // Modbus channel mappings (broadcaster names)
  modbus1     String?  // e.g., "TV5"
  modbus2     String?  // e.g., "MCOT"
  modbus3     String?  // e.g., "PRD"
  modbus4     String?  // e.g., "TPBS"
  modbus5     String?  // e.g., "NT", "LOOKTOONG", etc.
  modbus6     String?  // e.g., "RADIO", "DINDIN", etc.
  
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  // Relationship
  station     Station  @relation(fields: [stationId], references: [id])
}
```

## Files Modified

### Backend
1. **prisma/schema.prisma**
   - Added `StationModbus` model
   - Added `modbusConfig` relationship to `Station` model

2. **src/utils/import-modbus.js** (NEW)
   - CSV parser for modbus.csv
   - Import script to populate database
   - Verification script

3. **package.json**
   - Added `modbus:import` script
   - Added `modbus:verify` script

### Frontend
1. **frontend/meter-reading-dashboard/prisma/schema.prisma**
   - Added `StationModbus` model (synced with backend)
   - Added `modbusConfig` relationship to `Station` model

## Data Structure

### modbus.csv Format
```csv
station,Modbus 1,Modbus 2,Modbus 3,Modbus 4,Modbus 5,Modbus 6
ใบหยก,TV5,,,TPBS,,
กาญจนบุรี,TV5,MCOT,,TPBS,,
ขอนแก่น,TV5,MCOT,PRD,TPBS,LOOKTOONG,DINDIN
```

### Database Mapping
Each station has up to 6 Modbus channels mapped to broadcaster names:
- **Modbus 1**: Usually TV5
- **Modbus 2**: Usually MCOT
- **Modbus 3**: Usually PRD
- **Modbus 4**: Usually TPBS
- **Modbus 5**: Various (NT, LOOKTOONG, DINDIN, ART, BFKT, NANA STUDIO)
- **Modbus 6**: Various (RADIO, DINDIN, RADIO LINE)

## Usage

### Import Modbus Configuration
```bash
# Import from modbus.csv
npm run modbus:import

# Verify imported data
npm run modbus:verify
```

### Query Modbus Configuration

#### Backend (DatabaseService.js)
```javascript
// Get station with modbus config
const station = await prisma.station.findUnique({
  where: { name: 'ขอนแก่น' },
  include: { modbusConfig: true }
});

console.log(station.modbusConfig);
// {
//   modbus1: 'TV5',
//   modbus2: 'MCOT',
//   modbus3: 'PRD',
//   modbus4: 'TPBS',
//   modbus5: 'LOOKTOONG',
//   modbus6: 'DINDIN'
// }
```

#### Frontend API Route
```typescript
import { prisma } from '@/lib/prisma';

// Get station with modbus config
const station = await prisma.station.findUnique({
  where: { id: stationId },
  include: { modbusConfig: true }
});
```

## Import Results

### Summary
- **Total Stations**: 34
- **Successfully Imported**: 34
- **Skipped**: 0

### Station Breakdown
- **2 channels**: ใบหยก, นครสวรรค์, เชียงราย
- **3 channels**: กาญจนบุรี, อุบลราชธานี, ระยอง, สุราษฎร์ธานี, นครศรีธรรมราช, สงขลา, สตูล, ตรัง, ตาก, เชียงใหม่, แพร่, แม่ฮ่องสอน, ชัยภูมิ, อุดรธานี
- **4 channels**: มุกดาหาร, สกลนคร, สุรินทร์, นครราชสีมา, สระแก้ว, ตราด, ชุมพร, เพชรบูรณ์, น่าน, บึงกาฬ, เลย, ภูเก็ต
- **5 channels**: สิงห์บุรี, ร้อยเอ็ด, ระนอง, สุโขทัย
- **6 channels**: ขอนแก่น

## Common Broadcaster Names

### Standard Channels
- **TV5**: Channel 1 (all stations)
- **MCOT**: Channel 2 (most stations)
- **PRD**: Channel 3 (many stations)
- **TPBS**: Channel 4 (all stations)

### Additional Channels
- **NT**: สิงห์บุรี, บึงกาฬ
- **LOOKTOONG**: ระนอง, ขอนแก่น
- **DINDIN**: ร้อยเอ็ด, ขอนแก่น
- **ART**: สุโขทัย
- **BFKT**: เลย
- **NANA STUDIO**: ภูเก็ต
- **RADIO**: สกลนคร
- **RADIO LINE**: ภูเก็ต

## Future Enhancements

1. **Frontend Display**
   - Show broadcaster names in station detail pages
   - Map MUX power readings to broadcaster names
   - Create broadcaster-specific analytics

2. **API Endpoints**
   - GET `/api/station/[id]/modbus` - Get modbus config
   - PUT `/api/station/[id]/modbus` - Update modbus config

3. **Dashboard Features**
   - Broadcaster power consumption charts
   - Compare power usage across broadcasters
   - Filter stations by broadcaster

## Migration Steps Completed

1. ✅ Added `StationModbus` model to Prisma schema (backend)
2. ✅ Added `StationModbus` model to Prisma schema (frontend)
3. ✅ Generated Prisma clients
4. ✅ Pushed schema changes to database
5. ✅ Created import script (`src/utils/import-modbus.js`)
6. ✅ Added npm scripts to package.json
7. ✅ Imported data from `modbus.csv`
8. ✅ Verified all 34 stations imported successfully

## Notes

- The modbus configuration is optional (all fields are nullable)
- Each station can have 1-6 modbus channels configured
- The relationship is one-to-one (Station ↔ StationModbus)
- Data can be re-imported safely (uses upsert)
