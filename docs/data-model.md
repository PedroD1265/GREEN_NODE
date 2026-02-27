# Data Model - GREEN NODE

## Database

SQLite database at `./data/green-node.sqlite`, managed via `better-sqlite3`.

## Tables

### users
| Column | Type | Description |
|--------|------|-------------|
| id | TEXT PK | User identifier (e.g., 'user-me') |
| role | TEXT | 'user', 'collector', or 'admin' |
| name | TEXT | Display name |
| trustLevel | TEXT | 'Bronce', 'Plata', 'Oro' |
| points | INTEGER | Accumulated reward points |

### collectors
| Column | Type | Description |
|--------|------|-------------|
| id | TEXT PK | Collector identifier (e.g., 'col-1') |
| name | TEXT | Display name |
| type | TEXT | 'Independiente' or 'Empresa' |
| verified | INTEGER | 0/1 verification status |
| rating | REAL | Average rating (0-5) |
| completedPickups | INTEGER | Total completed pickups |
| autoAccept | INTEGER | 0/1 auto-accept feature |
| zone | TEXT | Operating area |
| materialsAcceptedJson | TEXT | JSON array of material names |
| tariffsJson | TEXT | JSON object {material: Bs/kg} |
| windowsJson | TEXT | JSON array of pickup windows |

### cases
| Column | Type | Description |
|--------|------|-------------|
| id | TEXT PK | Case identifier (e.g., 'CASE-001') |
| userId | TEXT | Owner user ID |
| collectorId | TEXT | Assigned collector ID (empty if unassigned) |
| collectorName | TEXT | Assigned collector name |
| status | TEXT | 'Pendiente', 'Aceptado', 'En camino', 'Completado' |
| materialsJson | TEXT | JSON array of CaseItem objects |
| totalKg | REAL | Total estimated weight |
| incentive | TEXT | 'Efectivo' or 'Puntos' |
| scheduleJson | TEXT | JSON string with scheduled time |
| addressJson | TEXT | JSON string with address |
| addressVisible | INTEGER | 0/1 if address revealed to collector |
| aiConfirmed | INTEGER | 0/1 if AI verified contents |
| pin4 | TEXT | 4-digit PIN for delivery confirmation |
| userLevel | TEXT | User's trust level at time of creation |
| payoutBs | REAL | Cash payout amount (nullable) |
| pointsEarned | INTEGER | Points earned (nullable) |
| createdAt | INTEGER | Unix timestamp (ms) |

#### CaseItem JSON structure (inside materialsJson)
```json
{
  "materialId": "m1",
  "materialName": "PET",
  "bucket": "Reciclable",
  "estimatedKg": 3.5,
  "photos": 4
}
```

### evidence
| Column | Type | Description |
|--------|------|-------------|
| id | TEXT PK | Evidence identifier |
| caseId | TEXT FK | Related case |
| url | TEXT | File URL (local or Azure Blob) |
| kind | TEXT | 'photo', 'receipt', etc. |
| createdAt | INTEGER | Unix timestamp (ms) |

### ratings
| Column | Type | Description |
|--------|------|-------------|
| id | TEXT PK | Rating identifier |
| caseId | TEXT FK | Related case |
| fromRole | TEXT | 'user' or 'collector' |
| stars | INTEGER | 1-5 rating |
| issuesJson | TEXT | JSON array of issue tags |
| createdAt | INTEGER | Unix timestamp (ms) |

### rewards
| Column | Type | Description |
|--------|------|-------------|
| id | TEXT PK | Reward identifier |
| title | TEXT | Reward name |
| description | TEXT | Reward description |
| pointsCost | INTEGER | Points required to redeem |
| type | TEXT | 'digital' or 'physical' |
| icon | TEXT | Emoji icon |
| category | TEXT | Category name |

### redemptions
| Column | Type | Description |
|--------|------|-------------|
| id | TEXT PK | Redemption identifier |
| userId | TEXT FK | User who redeemed |
| rewardId | TEXT FK | Redeemed reward |
| createdAt | INTEGER | Unix timestamp (ms) |

### centers
| Column | Type | Description |
|--------|------|-------------|
| id | TEXT PK | Center identifier |
| name | TEXT | Center name |
| materialsJson | TEXT | JSON array of accepted materials |
| hours | TEXT | Operating hours |
| address | TEXT | Physical address |
| phone | TEXT | Contact phone |

## Seed Data

On first run, the database is seeded with:
- 5 users (4 regular + 1 admin)
- 3 collectors (2 independent + 1 company)
- 6 demo cases in various statuses
- 7 rewards in the catalog
- 3 collection centers in Cochabamba
