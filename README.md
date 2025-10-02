# 🗺️ Location Tracker API

> A comprehensive location tracking API with pre-seeded areas

## 🛠️ Technologies Used

| Component       | Technology              |
| --------------- | ----------------------- |
| 🚀 **Backend**  | NestJS + TypeScript     |
| 🗄️ **Database** | PostgreSQL + PostGIS    |
| ⚡ **Cache**    | Redis                   |
| 🔧 **ORM**      | TypeORM                 |
| 📚 **Docs**     | Swagger/OpenAPI         |
| 🐳 **Deploy**   | Docker + Docker Compose |

## 🚀 Getting Started

### Step 1: Start the Application

```bash
docker-compose up --build -d
```

### Step 2: Check Services Status

```bash
docker-compose ps
```

### Step 3: Verify Health Check

```bash
curl -s http://localhost:3001/health | jq .
```

### Step 4: Run Database Migrations

```bash
docker-compose exec app node ./node_modules/typeorm/cli.js -d dist/database/data-source.js migration:run
```

### Step 5: Seed Areas

```bash
docker-compose exec app node dist/database/seed-areas.js
```

### Step 6: Verify Areas Are Loaded

```bash
curl -s http://localhost:3001/areas | jq '.data | length'
```

## 🔗 Important Links

- **API Documentation**: http://localhost:3001/swagger
- **Health Check**: http://localhost:3001/health

## 🔍 Request Tracking

All API requests include automatic **X-Request-ID** header for tracking and debugging:

```bash
# Example request with X-Request-ID
curl -H "Content-Type: application/json" \
     -H "X-Request-ID: custom-request-id" \
     http://localhost:3001/areas

# Or let the system auto-generate one
curl http://localhost:3001/areas
```

The system will:

- **Auto-generate** a UUID if no X-Request-ID is provided
- **Use your custom ID** if you provide one
- **Enable request tracing** across the entire system

## 📍 API Endpoints

### Location Tracking

```bash
POST /locations
{
  "userId": "550e8400-e29b-41d4-a716-446655440000",
  "lat": 41.0065,
  "lon": 28.9859
}
```

### Areas Management

```bash
# List all areas
GET /areas?limit=10&offset=0

# Create new area
POST /areas
{
  "name": "Custom Area",
  "coordinates": [[[lon1, lat1], [lon2, lat2], ...]]
}
```

### Entry/Exit Logs

```bash
# Get logs with filters
GET /logs?userId=uuid&event=ENTER&limit=10
```

## 📋 Response Structure

The API uses **two different response formats**:

### 🔄 Standard Response (Most endpoints)

```json
{
  "data": { ... },
  "message": "Success message",
  "userMessage": "User-friendly message",
  "isSuccess": true
}
```

### 📊 Paginated Response (Areas & Logs)

```json
{
  "data": [ ... ],
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 167,
    "totalPages": 17,
    "itemCount": 10,
    "hasNextPage": true,
    "hasPreviousPage": false
  },
  "message": "Areas retrieved successfully",
  "userMessage": "Areas loaded",
  "isSuccess": true
}
```

## 🚨 Troubleshooting

```bash
# Check service status
docker-compose ps

# View logs
docker-compose logs -f app

# Reset everything
docker-compose down -v && docker-compose up --build -d
```

---
