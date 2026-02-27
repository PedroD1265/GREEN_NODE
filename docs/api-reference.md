# API Reference - GREEN NODE

Base URL: `/api`

## Health

### GET /api/health
Returns server status and configuration.

**Response:**
```json
{
  "status": "ok",
  "mode": "demo",
  "providers": {
    "storage": "local",
    "ai": "mock",
    "auth": "demo"
  },
  "timestamp": "2026-01-01T00:00:00.000Z"
}
```

## Authentication

### POST /api/auth/login
Login with a role (demo mode).

**Body:**
```json
{ "role": "user" }
```
Valid roles: `user`, `collector`, `admin`

**Response:**
```json
{
  "token": "eyJhbG...",
  "user": {
    "id": "user-me",
    "role": "user",
    "name": "Ana",
    "trustLevel": "Plata",
    "points": 1250
  }
}
```

### GET /api/auth/me
Get current user info.

**Headers:** `Authorization: Bearer <token>`

**Response:** Same as `user` object in login response.

## Cases

### POST /api/cases
Create a new pickup case.

**Body:**
```json
{
  "items": [{"materialId": "m1", "materialName": "PET", "bucket": "Reciclable", "estimatedKg": 3, "photos": 4}],
  "totalKg": 3,
  "incentive": "Puntos",
  "scheduledTime": "Hoy 14:00-16:00",
  "address": "Av. América #234",
  "addressVisible": false,
  "aiConfirmed": true,
  "userLevel": "Plata",
  "userId": "user-me"
}
```

**Response:** `201` with the created case object.

### GET /api/cases
List cases with optional filters.

**Query params:**
- `userId` - Filter by user ID
- `status` - Filter by status

**Response:** Array of case objects.

### GET /api/cases/:id
Get a specific case.

**Response:** Case object.

### PATCH /api/cases/:id
Update a case.

**Body:** Any combination of:
```json
{
  "status": "Aceptado",
  "collectorId": "col-3",
  "collectorName": "EcoCocha",
  "addressVisible": true,
  "address": "Av. Heroínas #890",
  "payoutBs": 9.5,
  "pointsEarned": 7,
  "aiConfirmed": true
}
```

**Response:** Updated case object.

### POST /api/cases/:id/evidence
Upload evidence photo for a case.

**Content-Type:** `multipart/form-data`
**Fields:**
- `file` - Image file
- `kind` - Evidence type (default: "photo")

**Response:** `201`
```json
{
  "id": "ev-1234567890",
  "url": "/uploads/CASE-001_photo_1234567890.jpg",
  "kind": "photo"
}
```

### POST /api/cases/:id/rate
Rate a case (user rates collector or collector rates user).

**Body:**
```json
{
  "fromRole": "user",
  "stars": 5,
  "issues": []
}
```

**Response:** `201` with rating object.

## Collectors

### GET /api/collectors
List all collectors.

**Response:** Array of collector objects with parsed JSON fields.

### PATCH /api/collectors/:id
Update collector settings.

**Body:** Any combination of:
```json
{
  "autoAccept": true,
  "zone": "Toda Cochabamba",
  "materialsAccepted": ["PET", "Cartón"],
  "tariffs": {"PET": 1.5},
  "pickupWindows": ["Lun-Vie 8:00-12:00"]
}
```

## Rewards

### GET /api/rewards
List all rewards in the catalog.

**Response:**
```json
[
  {
    "id": "rw1",
    "name": "Recarga móvil Bs 10",
    "description": "Entel, Tigo o Viva",
    "pointsCost": 100,
    "type": "digital",
    "icon": "📱",
    "category": "Telecomunicaciones"
  }
]
```

### POST /api/rewards/redeem
Redeem a reward.

**Body:**
```json
{
  "userId": "user-me",
  "rewardId": "rw1"
}
```

**Response:** `201`
```json
{
  "id": "red-1234567890",
  "reward": {"id": "rw1", "name": "Recarga móvil Bs 10"},
  "pointsSpent": 100,
  "remainingPoints": 1150
}
```

## Centers

### GET /api/centers
List collection centers.

**Response:** Array of center objects with parsed materialsAccepted.

## AI

### POST /api/ai/classify
Classify waste from images.

**Body:**
```json
{
  "imageUrls": ["https://example.com/photo.jpg"],
  "context": {}
}
```

**Response:**
```json
{
  "material": "PET",
  "bucket": "Reciclable",
  "confidence": 0.92,
  "quality": "buena",
  "tips": ["Enjuaga antes de reciclar", "Retira la etiqueta"]
}
```

### POST /api/ai/recommend-collectors
Get AI-recommended collectors for a case.

**Body:**
```json
{
  "caseDraft": {
    "items": [{"materialName": "PET", "estimatedKg": 3}]
  }
}
```

**Response:**
```json
{
  "recommendations": [
    {
      "collectorId": "col-3",
      "collectorName": "EcoCocha",
      "score": 0.95,
      "reasons": ["Acepta todos los materiales", "Recolector verificado"]
    }
  ],
  "recommendedId": "col-3"
}
```
