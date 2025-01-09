# Country Info Backend

## Project Description

This NestJS backend application serves as an API aggregator for country information. It fetches and combines data from two external APIs:
- Nager.Date API for country lists and basic information
- Countries Now API for population data and flag images

## Technologies

- NestJS
- TypeScript
- Axios for HTTP requests
- ConfigModule for environment management

## Prerequisites

- Node.js (v18.x or later)
- npm (v9.x or later)

## Installation

1. Clone the repository
```bash
git clone https://github.com/phpfc/country-info-backend.git
cd country-info-backend
```

2. Install dependencies
```bash
npm install
```

## Environment Configuration

Create a `.env` file in the project root with the following variables:
```
# External API Base URLs
DATE_NAGER_API_URL=https://date.nager.at/api/v3
COUNTRIES_NOW_API_URL=https://countriesnow.space/api/v0.1

# Optional: Custom port (default is 3001)
PORT=3001
```

## Running the Application

### Development Mode
```bash
npm run start:dev
```

### Production Mode
```bash
npm run build
npm run start:prod
```

The server will run on `http://localhost:3001` by default.

## API Endpoints

### Available Countries
- **GET** `/countries`
  - Retrieves a list of countries with basic information
  - Includes country code, name, and flag URL

### Country Details
- **GET** `/countries/:code`
  - Retrieves detailed information for a specific country
  - Includes:
    - Country name and code
    - Population data over time
    - Bordering countries with their flags

## External API Documentation

- Country List API: [Nager.Date Swagger](https://date.nager.at/swagger/index.html)
- Country Details API: [Countries Now API](https://documenter.getpostman.com/view/1134062/T1LJjU52)

## Project Structure

- `src/`
  - `countries/`: Core country-related modules
  - `http.service.ts`: Centralized HTTP client for external API calls
  - `interfaces/`: TypeScript interfaces for type safety

## CORS Configuration

The backend is configured to allow requests from the frontend application running on `http://localhost:3000`.
