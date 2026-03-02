# Creator Leaderboard API

A backend REST API built with **Node.js**, **Fastify**, **TypeScript**, and **PostgreSQL (Neon)** that powers a creator leaderboard system — tracking call minutes, ranking creators, and computing earnings.

---

## 🚀 Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Create your .env file (see Environment Variables section below)
#    Add your PostgreSQL/Neon credentials

# 3. Start the server
npm run start
```

Server starts on **`http://localhost:9000`**

```
Registered Routes:
├── POST /call/end
├── GET  /leaderboard
└── GET  /creator/:id/stats
```

> The server auto-creates the `calls` table on first start via `sequelize.sync()` — no manual migration needed.

---

## Tech Stack

| Layer       | Technology                     |
| ----------- | ------------------------------ |
| Runtime     | Node.js                        |
| Framework   | Fastify                        |
| Language    | TypeScript                     |
| ORM         | Sequelize                      |
| Database    | PostgreSQL (Neon — serverless) |
| Environment | dotenv                         |

---

## Project Structure

```
chatSpark-leaderboard/
├── app/
│   ├── configs/          # Server config, constants (earnings rate, port, etc.)
│   ├── constants/        # Shared message strings (success/error)
│   ├── controllers/      # Route handlers (call, leaderboard)
│   ├── helpers/          # Response helper (standardized API responses)
│   ├── interfaces/       # TypeScript interfaces for all models and payloads
│   ├── middlewares/      # Global middleware (request logging)
│   ├── models/           # Sequelize models (Call, User, Creator, Transaction)
│   ├── routes/           # Route registration (call, leaderboard)
│   └── services/         # Business logic (CallService, LeaderboardService, DB)
├── schema.sql            # PostgreSQL schema with index explanations
├── seed.ts               # Seed script to populate DB with test data
├── index.ts              # App bootstrap (DB init, sync, server start)
├── server.ts             # Entry point
├── tsconfig.json
└── .env                  # Environment variables (not committed)
```

---

## API Endpoints

### `POST /call/end`

Accepts a call log payload and saves it to the database.

**Request Body:**

```json
{
  "call_id": "abc123",
  "caller_id": "user_001",
  "creator_id": "creator_042",
  "duration_seconds": 240,
  "started_at": "2026-03-01T10:00:00Z"
}
```

**Success Response (201):**

```json
{
  "success": true,
  "message": "Call log saved successfully",
  "data": {
    "id": "uuid-auto-generated",
    "call_id": "abc123",
    "caller_id": "user_001",
    "creator_id": "creator_042",
    "duration_seconds": 240,
    "status": "completed",
    "started_at": "2026-03-01T10:00:00.000Z",
    "created_at": "...",
    "ended_at": "..."
  }
}
```

**Duplicate call_id (409):**

```json
{
  "success": false,
  "error": "Call log already exists"
}
```

> `call_id` has a `UNIQUE` constraint — the same call cannot be logged twice (prevents double-counting earnings on retries).

---

### `GET /leaderboard`

Returns top 10 creators ranked by total call **minutes** in the last **7 days**.

**Response (200):**

```json
{
  "success": true,
  "data": [
    { "creator_id": "creator_099", "totalMinutes": 30 },
    { "creator_id": "creator_042", "totalMinutes": 14 }
  ]
}
```

> Only calls with `started_at >= NOW() - 7 days` are counted. Older calls are excluded.

---

### `GET /creator/:id/stats`

Returns a specific creator's aggregated stats.

**Earnings formula:** `totalMinutes × ₹6/min`

**Response (200):**

```json
{
  "success": true,
  "data": {
    "creator_id": "creator_042",
    "totalCalls": 3,
    "totalMinutes": 14,
    "totalEarnings": 84
  }
}
```

---

## Database Schema

The `calls` table is the core of all 3 APIs:

```sql
CREATE TABLE calls (
    id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    call_id          VARCHAR(255) NOT NULL UNIQUE,  -- prevents duplicate entries
    caller_id        VARCHAR(255) NOT NULL,
    creator_id       VARCHAR(255) NOT NULL,
    duration_seconds INT DEFAULT 0,
    status           VARCHAR(50) DEFAULT 'completed',
    started_at       TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at       TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    ended_at         TIMESTAMP WITH TIME ZONE
);
```

**Indexes on `calls`:**

```sql
-- Leaderboard groups by this + /creator/:id/stats filters by this
CREATE INDEX idx_calls_creator_id ON calls(creator_id);

-- Leaderboard filters WHERE started_at >= 7 days ago
-- B-tree index lets PostgreSQL skip old rows directly
CREATE INDEX idx_calls_started_at ON calls(started_at);

-- Analytics: calls made by a specific user
CREATE INDEX idx_calls_caller_id ON calls(caller_id);
```

> Full schema including `users`, `creators`, `transactions` tables and all index rationale is documented in [`schema.sql`](./schema.sql).

---

## Setup & Running

### Prerequisites

- Node.js v18+
- A PostgreSQL database (Neon recommended)

### Environment Variables

Create a `.env` file:

```env
PORT=9000
DB_HOST=your-neon-host
DB_PORT=5432
DB_DATABASE=neondb
DB_USER=your-user
DB_PASSWORD=your-password
ENABLE_SERVER_LOGS=true
```

### Install & Run

```bash
npm install
npm run start
```

Server starts on `http://localhost:9000`

### Registered Routes

```
├── POST /call/end
├── GET  /leaderboard
├── GET  /creator/:id/stats
└── OPTIONS *
```

---

## Testing with cURL

**Post a call:**

```bash
curl -X POST http://localhost:9000/call/end \
  -H "Content-Type: application/json" \
  -d '{
    "call_id": "test-001",
    "caller_id": "user_001",
    "creator_id": "creator_042",
    "duration_seconds": 600,
    "started_at": "2026-03-01T10:00:00Z"
  }'
```

**Get leaderboard:**

```bash
curl http://localhost:9000/leaderboard
```

**Get creator stats:**

```bash
curl http://localhost:9000/creator/creator_042/stats
```

---

## Design Decisions

| Decision                                     | Reason                                                                                   |
| -------------------------------------------- | ---------------------------------------------------------------------------------------- |
| `call_id` is UNIQUE                          | Prevents double-counting if the same call end event is sent twice (network retry safety) |
| Earnings computed on-the-fly                 | `totalMinutes × 6` avoids storing a derived value that could go stale                    |
| 7-day filter uses indexed `started_at`       | B-tree index on timestamp makes the range filter O(log n) instead of full scan           |
| `caller_id` / `creator_id` stored as strings | Assignment sample payload uses plain string IDs — no FK constraint needed                |
| `sync()` without `alter`                     | Schema is stable; `alter: true` caused FK conflict issues on existing tables             |


## ChatSpark app name

username - rana