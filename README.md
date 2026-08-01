# Mditor

A full stack collaborative Markdown editor with real-time multi-user sync, JWT authentication, and persistent cloud storage. Built with Next.js, Node.js/Express, PostgreSQL, and Yjs CRDT — deployed on AWS EC2 with Docker.

---

## Features

- **Real-time collaboration** — Multiple users can edit the same document simultaneously via Yjs CRDT and a self-hosted y-websocket server
- **JWT Authentication** — Secure register/login with bcrypt password hashing and JWT-based session management
- **Persistent storage** — Documents auto-save to PostgreSQL on every keystroke (debounced)
- **Multi-tab interface** — Open, close, and switch between multiple documents with tab-based navigation
- **File management** — Create, reopen, and permanently delete documents
- **Markdown export** — Download any document as a `.md` file
- **Shareable links** — Share a document URL with collaborators to open it directly

---

## Tech Stack

**Frontend**
- Next.js 15 (App Router)
- Tiptap (rich text editor)
- Yjs + y-websocket (CRDT-based real-time sync)
- Zustand (global state)
- Tailwind CSS

**Backend**
- Node.js + Express
- PostgreSQL (document and user storage)
- JWT + bcrypt (authentication)
- y-websocket (WebSocket collaboration server)

**DevOps**
- Docker
- AWS EC2
- GitHub

---

## Architecture

```
Browser (Next.js)
    │
    ├── REST API calls ──► Express Server (port 3001)
    │                           │
    │                    Controller → Service → Repository → PostgreSQL
    │
    └── WebSocket ──────► y-websocket Server (port 1234)
                                │
                           Yjs CRDT sync
```

The backend follows a strict layered architecture: **Route → Controller → Service → Repository → Database**. Each layer only communicates with the one directly below it.

---

## Getting Started

### Prerequisites

- Node.js v18+
- PostgreSQL
- Docker (for deployment)

### Local Development

**1. Clone the repo**
```bash
git clone https://github.com/RamPrakhyath05/Mditor.git
cd Mditor
```

**2. Install dependencies**
```bash
npm install
```

**3. Set up environment variables**

Create `.env.local` in the root:
```
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_WS_URL=ws://localhost:1234
```

Create `backend/.env`:
```
PORT=3001
DB_USER=postgres
DB_HOST=localhost
DB_NAME=mditor
DB_PASSWORD=yourpassword
DB_PORT=5432
JWT_SECRET=yoursecretkey
```

**4. Set up the database**
```bash
psql -U postgres -c "CREATE DATABASE mditor;"
psql -U postgres -d mditor -f backend/schema.sql
```

**5. Run all three servers**

Terminal 1 — Frontend:
```bash
npm run dev
```

Terminal 2 — Backend API:
```bash
npm run backend
```

Terminal 3 — WebSocket server:
```bash
npm run ws
```

Open [http://localhost:3000](http://localhost:3000)

---

## API Endpoints

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/auth/register` | Create a new account |
| POST | `/auth/login` | Login and receive JWT |

### Docs
All endpoints require `Authorization: Bearer <token>` header.

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/docs` | Get all documents for the logged-in user |
| GET | `/docs/:id` | Get a single document |
| POST | `/docs` | Create a new document |
| PUT | `/docs/:id` | Update document content |
| DELETE | `/docs/:id` | Delete a document permanently |

---

## Database Schema

```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  password TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE docs (
  id VARCHAR(20) PRIMARY KEY,
  owner_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  content JSONB,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

---

## Deployment

The backend, WebSocket server, and PostgreSQL database are deployed on **AWS EC2** using Docker Compose. The frontend is deployed on **Vercel**.

---

## License

MIT
