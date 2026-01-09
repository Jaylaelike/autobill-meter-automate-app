# Design Document: Station Detail Page

## Overview

This design document describes the implementation of a station detail page for the meter reading dashboard. The feature enables users to click on a station from the main dashboard to view detailed analytics including historical bar charts with time period selection (day/week/month/year), real-time line charts for live meter data, and custom date range queries via calendar component.

The implementation leverages the existing Next.js 14 App Router architecture, Prisma ORM for database access, TanStack Query for data fetching, and shadcn/ui chart components (built on Recharts) for visualizations.

## Architecture

```mermaid
graph TB
    subgraph Frontend
        Dashboard[Dashboard Page]
        StationDetail[Station Detail Page]
        BarChart[Bar Chart Component]
        LineChart[Line Chart Component]
        DatePicker[Date Range Picker]
        TimePeriodSelector[Time Period Selector]
    end
    
    subgraph API Layer
        StationAPI[/api/station/[id]]
        HistoricalAPI[/api/station/[id]/historical]
        RealtimeAPI[/api/station/[id]/realtime]
    end
    
    subgraph Data Layer
        Prisma[Prisma Client]
        SQLite[(SQLite DB)]
    end
    
    Dashboard -->|Click Station Row| StationDetail
    StationDetail --> BarChart
    StationDetail --> LineChart
    StationDetail --> DatePicker
    StationDetail --> TimePeriodSelector
    
    BarChart -->|Fetch| HistoricalAPI
    LineChart -->|Poll| RealtimeAPI
    StationDetail -->|Fetch| StationAPI
    
    StationAPI --> Prisma
    HistoricalAPI --> Prisma
    RealtimeAPI --> Prisma
    Prisma --> SQLite
```

## Components and Interfaces

### Page Components

#### Station Detail Page (`/app/station/[id]/page.tsx`)

The main page component that orchestrates all sub-components.

```typescript
interface StationDetailPageProps {
  params: { id: string };
}

interface StationInfo {
  id: string;
  name: string;
  ipAddress: string | null;
  scene: string | null;
  status: 'active' | 'stale' | 'offline';
  latestReading: PowerReading | null;
}
```

#### Station Header Component

Displays station information and navigation.

```typescript
interface StationHeaderProps {
  station: StationInfo;
  isLoading: boolean;
}
```

#### Summary Stats Component

Shows current power reading statistics.

```typescript
interface SummaryStatsProps {
  latestReading: PowerReading | null;
  isLoading: boolean;
}
```

### Chart Components

#### Historical Bar Chart Component

Displays aggregated power data with time period selection.

```typescript
type TimePeriod = 'day' | 'week' | 'month' | 'year';

interface HistoricalBarChartProps {
  stationId: string;
  dateRange: DateRange;
  timePeriod: TimePeriod;
  onTimePeriodChange: (period: TimePeriod) => void;
}

interface AggregatedDataPoint {
  label: string;           // Time label (hour, day, month)
  timestamp: string;       // ISO timestamp for the period start
  activePowerSum: number;  // Sum of active power readings
  activePowerAvg: number;  // Average active power
  muxPowerSum: number;     // Sum of MUX power readings
  muxPowerAvg: number;     // Average MUX power
  readingCount: number;    // Number of readings in period
}
```

#### Real-Time Line Chart Component

Displays live power readings with auto-refresh.

```typescript
interface RealtimeLineChartProps {
  stationId: string;
  refreshInterval?: number; // Default: 5000ms
  timeWindow?: number;      // Default: 30 minutes
}

interface RealtimeDataPoint {
  timestamp: string;
  activePower1: number | null;
  activePower2: number | null;
  activePower3: number | null;
  activePower4: number | null;
  activePower5: number | null;
  activePower6: number | null;
  muxPower1: number | null;
  muxPower2: number | null;
  muxPower3: number | null;
  muxPower4: number | null;
  muxPower5: number | null;
  muxPower6: number | null;
  totalActivePower: number;
  totalMuxPower: number;
}
```

### Date Selection Components

#### Date Range Picker Component

Calendar-based date range selection.

```typescript
interface DateRange {
  from: Date;
  to: Date;
}

interface DateRangePickerProps {
  dateRange: DateRange;
  onDateRangeChange: (range: DateRange) => void;
  maxDate?: Date; // Prevents future date selection
}
```

#### Time Period Selector Component

Toggle buttons for time aggregation period.

```typescript
interface TimePeriodSelectorProps {
  value: TimePeriod;
  onChange: (period: TimePeriod) => void;
}
```

## Data Models

### API Response Types

#### Station Detail Response

```typescript
interface StationDetailResponse {
  station: StationInfo;
  timestamp: string;
}
```

#### Historical Data Response

```typescript
interface HistoricalDataResponse {
  stationId: string;
  dateRange: {
    from: string;
    to: string;
  };
  timePeriod: TimePeriod;
  data: AggregatedDataPoint[];
  metadata: {
    totalReadings: number;
    aggregationMethod: 'sum' | 'average';
  };
}
```

#### Real-Time Data Response

```typescript
interface RealtimeDataResponse {
  stationId: string;
  readings: RealtimeDataPoint[];
  latestTimestamp: string;
}
```

### API Endpoints

#### GET `/api/station/[id]`

Fetches station information and latest reading.

Query Parameters: None

Response: `StationDetailResponse`

#### GET `/api/station/[id]/historical`

Fetches aggregated historical power data.

Query Parameters:
- `from`: ISO date string (required)
- `to`: ISO date string (required)
- `period`: 'day' | 'week' | 'month' | 'year' (required)

Response: `HistoricalDataResponse`

#### GET `/api/station/[id]/realtime`

Fetches recent power readings for real-time chart.

Query Parameters:
- `minutes`: number (default: 30)

Response: `RealtimeDataResponse`

### Data Aggregation Logic

```typescript
// Aggregation periods mapping
const aggregationConfig = {
  day: {
    groupBy: 'hour',      // Group readings by hour
    format: 'HH:00',      // Display format
    intervals: 24         // Expected data points
  },
  week: {
    groupBy: 'day',       // Group readings by day
    format: 'ddd',        // Display format (Mon, Tue, etc.)
    intervals: 7          // Expected data points
  },
  month: {
    groupBy: 'day',       // Group readings by day
    format: 'MMM DD',     // Display format
    intervals: 'dynamic'  // Depends on month
  },
  year: {
    groupBy: 'month',     // Group readings by month
    format: 'MMM',        // Display format
    intervals: 12         // Expected data points
  }
};
```



## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property 1: URL Construction Contains Station ID

*For any* station in the dashboard, when generating the navigation URL for that station, the resulting URL path SHALL contain the station's unique identifier.

**Validates: Requirements 1.3**

### Property 2: Station Detail Page Displays Station Information

*For any* valid station, when the station detail page renders with that station's data, the rendered output SHALL contain the station name, IP address (if present), scene (if present), and status.

**Validates: Requirements 2.1**

### Property 3: Time-Based Aggregation Correctness

*For any* set of power readings and any time period (day/week/month/year), the aggregation function SHALL produce mathematically correct results where:
- The sum of values in each group equals the actual sum of readings in that time interval
- The average of values in each group equals the actual average of readings in that time interval
- The reading count in each group equals the actual number of readings in that time interval

**Validates: Requirements 3.3, 3.4, 3.5, 3.6**

### Property 4: Real-Time Data Filtering by Time Window

*For any* set of power readings and a specified time window (default 30 minutes), the filtering function SHALL return only readings whose timestamps fall within the time window from the current time.

**Validates: Requirements 4.3**

### Property 5: Date Range Triggers Correct API Fetch

*For any* valid date range selection, when the date range changes, the API request SHALL include the exact start and end dates from the selection.

**Validates: Requirements 5.3**

### Property 6: Future Date Selection Prevention

*For any* date that is after the current date, the calendar component SHALL prevent that date from being selected (disabled state).

**Validates: Requirements 5.4**

### Property 7: API Aggregation Correctness

*For any* valid API request with date range and time period parameters, the API response SHALL contain aggregated data where each data point's values are mathematically correct aggregations of the underlying readings for that time interval.

**Validates: Requirements 6.1, 6.2, 6.3**

### Property 8: API Date Validation

*For any* API request with invalid date parameters (malformed dates, end date before start date, missing required parameters), the API SHALL return an appropriate error response with status code 400 and descriptive error message.

**Validates: Requirements 6.5**

## Error Handling

### Frontend Error Handling

```typescript
// Error types for station detail page
type StationDetailError = 
  | { type: 'NOT_FOUND'; message: string }
  | { type: 'NETWORK_ERROR'; message: string }
  | { type: 'INVALID_DATE_RANGE'; message: string }
  | { type: 'SERVER_ERROR'; message: string };

// Error handling in components
const handleError = (error: StationDetailError) => {
  switch (error.type) {
    case 'NOT_FOUND':
      return <NotFoundMessage stationId={stationId} />;
    case 'NETWORK_ERROR':
      return <NetworkErrorMessage onRetry={refetch} />;
    case 'INVALID_DATE_RANGE':
      return <InvalidDateRangeMessage />;
    case 'SERVER_ERROR':
      return <ServerErrorMessage onRetry={refetch} />;
  }
};
```

### API Error Handling

```typescript
// API error responses
interface APIErrorResponse {
  error: string;
  code: string;
  details?: Record<string, string>;
}

// Validation errors
const validateDateRange = (from: string, to: string): APIErrorResponse | null => {
  const fromDate = new Date(from);
  const toDate = new Date(to);
  
  if (isNaN(fromDate.getTime())) {
    return { error: 'Invalid start date format', code: 'INVALID_FROM_DATE' };
  }
  if (isNaN(toDate.getTime())) {
    return { error: 'Invalid end date format', code: 'INVALID_TO_DATE' };
  }
  if (fromDate > toDate) {
    return { error: 'Start date must be before end date', code: 'INVALID_DATE_RANGE' };
  }
  if (toDate > new Date()) {
    return { error: 'End date cannot be in the future', code: 'FUTURE_DATE' };
  }
  return null;
};
```

### Loading States

```typescript
// Loading state management
interface LoadingState {
  stationInfo: boolean;
  historicalData: boolean;
  realtimeData: boolean;
}

// Skeleton components for each section
const StationDetailSkeleton = () => (
  <>
    <StationHeaderSkeleton />
    <SummaryStatsSkeleton />
    <BarChartSkeleton />
    <LineChartSkeleton />
  </>
);
```

## Testing Strategy

### Dual Testing Approach

This feature requires both unit tests and property-based tests for comprehensive coverage:

- **Unit tests**: Verify specific examples, edge cases, and error conditions
- **Property tests**: Verify universal properties across all valid inputs

### Property-Based Testing Configuration

- **Library**: fast-check (TypeScript property-based testing library)
- **Minimum iterations**: 100 per property test
- **Tag format**: `Feature: station-detail-page, Property {number}: {property_text}`

### Test Categories

#### Unit Tests

1. **Component Rendering Tests**
   - Station header displays correct information
   - Summary stats show power readings
   - Charts render with data
   - Calendar component renders with date range
   - Error states display correctly
   - Loading skeletons appear during fetch

2. **Navigation Tests**
   - Station row click navigates to correct URL
   - Back link returns to dashboard

3. **API Endpoint Tests**
   - Station detail endpoint returns correct data
   - Historical endpoint handles valid date ranges
   - Realtime endpoint returns recent readings
   - Error responses for invalid inputs

#### Property-Based Tests

1. **Property 1: URL Construction**
   - Generate random station IDs
   - Verify URL always contains the ID

2. **Property 3: Time-Based Aggregation**
   - Generate random sets of power readings with timestamps
   - Apply aggregation for each time period
   - Verify mathematical correctness of sums, averages, counts

3. **Property 4: Time Window Filtering**
   - Generate random readings with various timestamps
   - Apply time window filter
   - Verify only readings within window are returned

4. **Property 6: Future Date Prevention**
   - Generate random dates (past and future)
   - Verify future dates are always disabled

5. **Property 7: API Aggregation**
   - Generate random date ranges and readings
   - Call API and verify response aggregations match expected values

6. **Property 8: API Date Validation**
   - Generate invalid date combinations
   - Verify API returns appropriate errors

### Test File Structure

```
frontend/meter-reading-dashboard/
├── __tests__/
│   ├── components/
│   │   ├── station-detail-page.test.tsx
│   │   ├── historical-bar-chart.test.tsx
│   │   ├── realtime-line-chart.test.tsx
│   │   └── date-range-picker.test.tsx
│   ├── api/
│   │   ├── station-detail.test.ts
│   │   ├── historical-data.test.ts
│   │   └── realtime-data.test.ts
│   └── properties/
│       ├── url-construction.property.test.ts
│       ├── aggregation.property.test.ts
│       ├── time-filtering.property.test.ts
│       └── date-validation.property.test.ts
```
