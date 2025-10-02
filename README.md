# Location Tracker API

A NestJS-based location tracking API with PostgreSQL, PostGIS, and Redis for geofencing and area monitoring.

## Features

- **Geofencing**: Create geographical areas and track user entry/exit events
- **Real-time Location Processing**: Process user locations and detect area changes
- **Area Management**: CRUD operations for geographical areas with polygon support
- **Entry/Exit Logging**: Historical tracking of user movements
- **Health Monitoring**: Comprehensive health checks for all services
- **Caching**: Redis-based caching for improved performance
- **Pagination**: Efficient data retrieval with pagination support

## Tech Stack

- **Backend**: NestJS, TypeScript
- **Database**: PostgreSQL with PostGIS extension
- **Cache**: Redis
- **ORM**: TypeORM
- **Validation**: class-validator, class-transformer
- **Documentation**: Swagger/OpenAPI
- **Containerization**: Docker, Docker Compose

## Quick Start

### Prerequisites

- Docker and Docker Compose
- Node.js 20+ (for local development)

### 1. Clone and Setup

```bash
git clone <repository-url>
cd location-tracker-api
```

### 2. Start Services

```bash
# Start all services (PostgreSQL, Redis, App)
docker-compose up --build -d
```

### 3. Run Database Migrations

```bash
# Run migrations to create database schema
docker-compose exec app node ./node_modules/typeorm/cli.js -d dist/database/data-source.js migration:run
```

### 4. Seed Sample Areas (Optional)

```bash
# Add sample areas to the database
docker-compose exec app node dist/database/seed-areas.js
```

### 5. Verify Installation

```bash
# Check health status
curl -s http://localhost:3001/health | jq .

# List areas (should return seeded areas)
curl -s http://localhost:3001/areas | jq .
```

## API Endpoints

### Health Check

```bash
GET /health
```

### Areas

```bash
# Get all areas with pagination
GET /areas?limit=10&offset=0

# Create a new area
POST /areas
Content-Type: application/json

{
  "name": "Office Building",
  "coordinates": [
    [
      [28.9848, 41.0055],
      [28.9870, 41.0055],
      [28.9870, 41.0075],
      [28.9848, 41.0075],
      [28.9848, 41.0055]
    ]
  ]
}
```

### Locations

```bash
# Submit user location
POST /locations
Content-Type: application/json

{
  "userId": "550e8400-e29b-41d4-a716-446655440000",
  "lat": 41.0055,
  "lon": 28.9848
}
```

### Logs

```bash
# Get entry/exit logs with filters and pagination
GET /logs?userId=<uuid>&areaId=<uuid>&event=ENTER&limit=10&offset=0
```

## Development Commands

### Docker Commands

```bash
# Start services
docker-compose up --build -d

# Stop services
docker-compose down

# Stop and remove volumes (clean start)
docker-compose down -v

# Clean Docker system
docker system prune -f

# View logs
docker-compose logs -f app

# Execute commands in container
docker-compose exec app <command>
```

### Database Commands

```bash
# Run migrations
docker-compose exec app node ./node_modules/typeorm/cli.js -d dist/database/data-source.js migration:run

# Seed sample areas
docker-compose exec app node dist/database/seed-areas.js

# Generate new migration
docker-compose exec app npm run migration:generate -- <migration-name>

# Revert last migration
docker-compose exec app npm run migration:revert
```

### Local Development

```bash
# Install dependencies
npm install

# Build project
npm run build

# Start development server
npm run start:dev

# Lint code
npm run lint

# Format code
npm run format
```

## Database Schema

### Tables

- **areas**: Geographical areas with polygon boundaries
- **locations**: User location records with PostGIS Point geometry
- **user_area_states**: Current user presence in areas (for performance)
- **entry_logs**: Historical entry/exit events

### Extensions

- **PostGIS**: Spatial database functionality
- **uuid-ossp**: UUID generation

## Configuration

### Environment Variables

```bash
# Database
DATABASE_URL=postgres://postgres:postgres@db:5432/location_tracker

# Redis
REDIS_HOST=redis
REDIS_PORT=6379
REDIS_URL=redis://redis:6379

# Application
PORT=3001
NODE_ENV=production
```

### Docker Services

- **app**: NestJS application (port 3001)
- **db**: PostgreSQL with PostGIS (port 5434)
- **redis**: Redis cache (port 6379)

## Health Monitoring

The application includes comprehensive health checks:

- **Database**: PostgreSQL connection status
- **Memory**: Heap memory usage (< 150MB)
- **Storage**: Disk usage (< 80%)
- **Redis**: Connection and response time

Access at: `http://localhost:3001/health`

## API Documentation

Swagger documentation is available at: `http://localhost:3001/api`

## Common Use Cases

### 1. Create a Geofenced Area

```bash
curl -X POST http://localhost:3001/areas \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Sultanahmet Square",
    "coordinates": [
      [
        [28.9848, 41.0055],
        [28.9870, 41.0055],
        [28.9870, 41.0075],
        [28.9848, 41.0075],
        [28.9848, 41.0055]
      ]
    ]
  }'
```

### 2. Track User Location

```bash
curl -X POST http://localhost:3001/locations \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "550e8400-e29b-41d4-a716-446655440000",
    "lat": 41.0055,
    "lon": 28.9848
  }'
```

### 3. Monitor Entry/Exit Events

```bash
# Get all logs
curl -s http://localhost:3001/logs | jq .

# Filter by user
curl -s "http://localhost:3001/logs?userId=550e8400-e29b-41d4-a716-446655440000" | jq .

# Filter by event type
curl -s "http://localhost:3001/logs?event=ENTER" | jq .
```

## Troubleshooting

### Common Issues

1. **Migration Errors**: Ensure database is healthy before running migrations
2. **Connection Issues**: Check Docker services are running with `docker-compose ps`
3. **Port Conflicts**: Verify ports 3001, 5434, and 6379 are available

### Logs

```bash
# Application logs
docker-compose logs -f app

# Database logs
docker-compose logs -f db

# Redis logs
docker-compose logs -f redis
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## License

Private/Unlicensed
