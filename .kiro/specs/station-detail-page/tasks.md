# Implementation Plan: Station Detail Page

## Overview

This implementation plan breaks down the station detail page feature into discrete coding tasks. The approach prioritizes building the API layer first, then the page structure, followed by chart components, and finally integration and testing.

## Tasks

- [x] 1. Set up project structure and dependencies
  - Install required dependencies (fast-check for property testing)
  - Create directory structure for station detail page
  - Set up test configuration for property-based tests
  - _Requirements: Testing Strategy_

- [x] 2. Implement API endpoints for station data
  - [x] 2.1 Create station detail API endpoint (`/api/station/[id]/route.ts`)
    - Fetch station by ID with latest reading
    - Calculate station status based on reading timestamp
    - Return StationDetailResponse
    - _Requirements: 2.1, 6.1_

  - [x] 2.2 Create historical data API endpoint (`/api/station/[id]/historical/route.ts`)
    - Accept query parameters: from, to, period
    - Implement date range validation
    - Implement aggregation logic for day/week/month/year periods
    - Return HistoricalDataResponse with aggregated data
    - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5_

  - [x] 2.3 Write property test for API date validation
    - **Property 8: API Date Validation**
    - **Validates: Requirements 6.5**

  - [x] 2.4 Create real-time data API endpoint (`/api/station/[id]/realtime/route.ts`)
    - Accept query parameter: minutes (default 30)
    - Fetch readings within time window
    - Calculate total power values
    - Return RealtimeDataResponse
    - _Requirements: 4.3_

  - [x] 2.5 Write property test for API aggregation correctness
    - **Property 7: API Aggregation Correctness**
    - **Validates: Requirements 6.1, 6.2, 6.3**

- [x] 3. Checkpoint - Ensure API endpoints work correctly
  - Ensure all API tests pass, ask the user if questions arise.

- [x] 4. Implement station detail page structure
  - [x] 4.1 Create station detail page (`/app/station/[id]/page.tsx`)
    - Set up page component with params
    - Implement data fetching with TanStack Query
    - Add loading and error states
    - _Requirements: 2.1, 7.1, 7.2, 7.3_

  - [x] 4.2 Create station header component
    - Display station name, IP address, scene, status
    - Add back navigation link to dashboard
    - _Requirements: 2.1, 2.6_

  - [x] 4.3 Write property test for station info display
    - **Property 2: Station Detail Page Displays Station Information**
    - **Validates: Requirements 2.1**

  - [x] 4.4 Create summary stats component
    - Display current power readings in cards
    - Show Active Power and MUX Power totals
    - _Requirements: 2.2_

- [x] 5. Implement date selection components
  - [x] 5.1 Create date range picker component
    - Use shadcn/ui calendar component
    - Implement date range selection
    - Disable future dates
    - Display selected range
    - _Requirements: 5.1, 5.2, 5.4, 5.5_

  - [x] 5.2 Write property test for future date prevention
    - **Property 6: Future Date Selection Prevention**
    - **Validates: Requirements 5.4**

  - [x] 5.3 Create time period selector component
    - Implement toggle buttons for Day/Week/Month/Year
    - Style with shadcn/ui button group
    - _Requirements: 3.2_

- [x] 6. Checkpoint - Ensure page structure and date components work
  - Ensure all tests pass, ask the user if questions arise.

- [x] 7. Implement chart components
  - [x] 7.1 Create historical bar chart component
    - Use shadcn/ui chart (Recharts BarChart)
    - Display aggregated Active Power and MUX Power
    - Add tooltips and legend
    - Connect to historical API with date range and period
    - _Requirements: 3.1, 3.3, 3.4, 3.5, 3.6, 3.7, 3.8_

  - [x] 7.2 Write property test for time-based aggregation
    - **Property 3: Time-Based Aggregation Correctness**
    - **Validates: Requirements 3.3, 3.4, 3.5, 3.6**

  - [x] 7.3 Create real-time line chart component
    - Use shadcn/ui chart (Recharts LineChart)
    - Display Active Power and MUX Power lines
    - Implement auto-refresh with 5-second interval
    - Add tooltips showing exact values
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 4.7_

  - [x] 7.4 Write property test for time window filtering
    - **Property 4: Real-Time Data Filtering by Time Window**
    - **Validates: Requirements 4.3_

- [x] 8. Implement dashboard navigation
  - [x] 8.1 Update power readings table with clickable rows
    - Add onClick handler to table rows
    - Implement navigation to station detail page
    - Add hover styles for clickable indication
    - _Requirements: 1.1, 1.2, 1.3_

  - [x] 8.2 Write property test for URL construction
    - **Property 1: URL Construction Contains Station ID**
    - **Validates: Requirements 1.3**

- [x] 9. Integration and wiring
  - [x] 9.1 Wire all components together in station detail page
    - Connect date range picker to bar chart
    - Connect time period selector to bar chart
    - Set up real-time chart auto-refresh
    - Handle state synchronization between components
    - _Requirements: 5.3, 5.6_

  - [x] 9.2 Write property test for date range API fetch
    - **Property 5: Date Range Triggers Correct API Fetch**
    - **Validates: Requirements 5.3**

  - [x] 9.3 Write unit tests for error handling
    - Test station not found error display
    - Test API failure error display with retry
    - Test loading skeleton display
    - _Requirements: 7.1, 7.2, 7.3_

- [x] 10. Final checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- All tasks including property tests are required
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation
- Property tests validate universal correctness properties
- Unit tests validate specific examples and edge cases
- The implementation uses TypeScript throughout, matching the existing codebase
- shadcn/ui chart components are built on Recharts
