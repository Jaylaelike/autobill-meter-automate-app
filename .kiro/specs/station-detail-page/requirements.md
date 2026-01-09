# Requirements Document

## Introduction

This feature adds a station detail page to the meter reading dashboard. Users can click on a station from the main dashboard to navigate to a dedicated detail page showing comprehensive analytics including summary bar charts (day/week/month/year), real-time line charts for live meter data, and date/time range selection via calendar component. The implementation uses shadcn/ui chart components built on Recharts.

## Glossary

- **Station**: A power monitoring location with multiple sensors (Active Power and MUX Power meters)
- **Dashboard**: The main page displaying all stations with their latest readings
- **Station_Detail_Page**: A dedicated page showing detailed analytics for a single station
- **Power_Reading**: A time-series data record containing Active Power (Watts) and MUX Power (kWh) values
- **Bar_Chart**: A chart component displaying aggregated power data over time periods
- **Line_Chart**: A chart component displaying real-time power readings as a continuous line
- **Time_Period_Selector**: A UI control allowing selection of day, week, month, or year aggregation
- **Calendar_Component**: A date picker component for selecting custom date/time ranges
- **Real_Time_Data**: Power readings that update automatically at regular intervals

## Requirements

### Requirement 1: Station Row Click Navigation

**User Story:** As a user, I want to click on a station row in the main dashboard table, so that I can navigate to the station's detail page.

#### Acceptance Criteria

1. WHEN a user clicks on a station row in the power readings table, THE Dashboard SHALL navigate to the station detail page at `/station/[stationId]`
2. THE Dashboard SHALL display a visual hover indicator on station rows to indicate they are clickable
3. WHEN navigating to the station detail page, THE Dashboard SHALL pass the station identifier in the URL

### Requirement 2: Station Detail Page Layout

**User Story:** As a user, I want to see a comprehensive station detail page, so that I can analyze power consumption data for a specific station.

#### Acceptance Criteria

1. WHEN the station detail page loads, THE Station_Detail_Page SHALL display the station name and basic information (IP address, scene, status)
2. THE Station_Detail_Page SHALL display a summary statistics section showing current power readings
3. THE Station_Detail_Page SHALL display a bar chart section for historical data analytics
4. THE Station_Detail_Page SHALL display a line chart section for real-time meter data
5. THE Station_Detail_Page SHALL display a date/time range selector using a calendar component
6. THE Station_Detail_Page SHALL provide a back navigation link to return to the main dashboard

### Requirement 3: Summary Bar Chart Analytics

**User Story:** As a user, I want to view power consumption data in bar charts with different time aggregations, so that I can analyze usage patterns over various time periods.

#### Acceptance Criteria

1. THE Station_Detail_Page SHALL display a bar chart showing aggregated power consumption data
2. THE Station_Detail_Page SHALL provide a Time_Period_Selector with options: Day, Week, Month, Year
3. WHEN the user selects "Day", THE Bar_Chart SHALL display hourly aggregated data for the selected day
4. WHEN the user selects "Week", THE Bar_Chart SHALL display daily aggregated data for the selected week
5. WHEN the user selects "Month", THE Bar_Chart SHALL display daily aggregated data for the selected month
6. WHEN the user selects "Year", THE Bar_Chart SHALL display monthly aggregated data for the selected year
7. THE Bar_Chart SHALL display both Active Power (W) and MUX Power (kWh) data series
8. THE Bar_Chart SHALL use shadcn/ui chart components with proper tooltips and legends

### Requirement 4: Real-Time Line Chart

**User Story:** As a user, I want to see a live line chart of meter readings, so that I can monitor real-time power consumption.

#### Acceptance Criteria

1. THE Station_Detail_Page SHALL display a line chart showing real-time power readings
2. THE Line_Chart SHALL auto-refresh at regular intervals (every 5 seconds)
3. THE Line_Chart SHALL display the most recent readings (last 30 minutes by default)
4. THE Line_Chart SHALL show separate lines for Active Power and MUX Power readings
5. THE Line_Chart SHALL display timestamps on the x-axis and power values on the y-axis
6. WHEN new data arrives, THE Line_Chart SHALL animate smoothly to show the updated values
7. THE Line_Chart SHALL use shadcn/ui chart components with proper tooltips showing exact values

### Requirement 5: Date/Time Range Selection

**User Story:** As a user, I want to select custom date/time ranges using a calendar, so that I can query historical power data for specific periods.

#### Acceptance Criteria

1. THE Station_Detail_Page SHALL display a calendar component for date range selection
2. WHEN the user selects a start date, THE Calendar_Component SHALL allow selection of an end date
3. WHEN a date range is selected, THE Station_Detail_Page SHALL fetch and display power readings for that range
4. THE Calendar_Component SHALL prevent selection of future dates
5. THE Calendar_Component SHALL display the currently selected date range clearly
6. WHEN the date range changes, THE Bar_Chart SHALL update to show data for the new range

### Requirement 6: API Endpoints for Historical Data

**User Story:** As a developer, I want API endpoints that support historical data queries, so that the frontend can fetch aggregated power data.

#### Acceptance Criteria

1. THE API SHALL provide an endpoint to fetch power readings for a station within a date range
2. THE API SHALL support query parameters for start date, end date, and aggregation period
3. THE API SHALL return aggregated data (sum, average) based on the requested time period
4. IF no data exists for the requested range, THEN THE API SHALL return an empty array with appropriate status
5. THE API SHALL validate date range parameters and return appropriate error messages for invalid inputs

### Requirement 7: Error Handling and Loading States

**User Story:** As a user, I want clear feedback when data is loading or when errors occur, so that I understand the system state.

#### Acceptance Criteria

1. WHILE data is loading, THE Station_Detail_Page SHALL display skeleton loading indicators
2. IF the station is not found, THEN THE Station_Detail_Page SHALL display a "Station not found" error message
3. IF the API request fails, THEN THE Station_Detail_Page SHALL display an error message with retry option
4. WHILE the real-time chart is updating, THE Line_Chart SHALL maintain smooth visual continuity
