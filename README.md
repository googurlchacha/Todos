# Todo App

A full-stack Todo application, featuring a **NestJS** REST API, **React** frontend, **PostgreSQL**, **Docker**, and **Kubernetes (GKE)** deployment.

## Architecture

```
┌─────────────────────────────────────────────────────────────────────────┐
│                           User / Browser                                 │
└─────────────────────────────────┬───────────────────────────────────────┘
                                  │
                    ┌─────────────▼─────────────┐
                    │   Frontend (React / Nginx) │  Port 80 / 5173
                    │   - Add / Edit / Delete    │
                    │   - Mark done              │
                    └─────────────┬──────────────┘
                                  │ HTTP /todos
                    ┌─────────────▼──────────────┐
                    │   Backend (NestJS)          │  Port 3000
                    │   - REST CRUD              │
                    │   - Swagger, Validation    │
                    └─────────────┬──────────────┘
                                  │ TypeORM
                    ┌─────────────▼──────────────┐
                    │   PostgreSQL               │  Port 5432
                    │   - todos table            │
                    └────────────────────────────┘
```

## Project Structure

```
.
├── backend/                 # NestJS API
│   ├── src/
│   │   ├── todo/            # Todo module (entity, DTOs, service, controller)
│   │   ├── logger/          # Logging (console + optional GCP Logging)
│   │   ├── filters/         # Global exception filter
│   │   └── main.ts
│   ├── Dockerfile
│   ├── package.json
│   └── .env.example
├── frontend/                # React (Vite) SPA
│   ├── src/
│   │   ├── api/             # API client
│   │   ├── components/      # TodoForm, TodoList, TodoItem
│   │   └── types/
│   ├── Dockerfile
│   ├── nginx.conf.template
│   └── package.json
├── kubernetes/              # GKE manifests
│   ├── namespace.yaml
│   ├── configmap.yaml
│   ├── secret.yaml.example
│   ├── postgres-pvc.yaml
│   ├── postgres-deployment.yaml
│   ├── backend-deployment.yaml   # LoadBalancer for API
│   └── frontend-deployment.yaml  # LoadBalancer for UI
├── docker-compose.yml
└── README.md
```

## Quick Start (Local)

### Prerequisites

- Node.js 18+
- Docker & Docker Compose (optional, for full stack)
- PostgreSQL 14+ (if running backend only)

### Option A: Docker Compose (recommended)

```bash
# From project root
cp backend/.env.example backend/.env
# Edit backend/.env if you need different DB credentials

docker compose up -d
```

- **Frontend:** http://localhost:80  
- **Backend API:** http://localhost:3000  
- **Swagger:** http://localhost:3000/api/docs  

### Option B: Run backend and frontend separately

**Backend:**

```bash
cd backend
cp .env.example .env
# Set DB_* to your PostgreSQL connection
npm install
npm run start:dev
```

**Frontend (dev server with proxy to backend):**

```bash
cd frontend
npm install
npm run dev
```

Open http://localhost:5173. The Vite dev server proxies API requests to `http://localhost:3000`.

---

## Backend (NestJS)

- **Framework:** NestJS 10, TypeScript  
- **API:** REST CRUD for Todos (`/todos`)  
- **Database:** PostgreSQL with TypeORM  
- **Validation:** class-validator + ValidationPipe  
- **Docs:** Swagger/OpenAPI at `/api/docs`  
- **Logging:** Winston; optional Google Cloud Logging when `GCP_PROJECT_ID` and `GOOGLE_APPLICATION_CREDENTIALS` are set  

### Environment (.env)

See `backend/.env.example`. Main variables:

- `PORT`, `NODE_ENV`
- `DB_HOST`, `DB_PORT`, `DB_USERNAME`, `DB_PASSWORD`, `DB_DATABASE`
- `CORS_ORIGIN`, `LOG_LEVEL`
- Optional: `GCP_PROJECT_ID`, `GOOGLE_APPLICATION_CREDENTIALS` for Cloud Logging

### Tests

```bash
cd backend
npm test
npm run test:cov
```

---

## Frontend (React)

- **Stack:** React 18, Vite, TypeScript  
- **Features:** Add, edit, delete, mark todo done  
- **Design:** Responsive, dark theme  

For production build, the app uses relative URLs so it can be served behind the same host as the API (e.g. nginx proxying `/todos` to the backend).

---

## Google Cloud (GKE) Deployment

**For a complete step-by-step guide (prerequisites, Artifact Registry, GKE, secrets, troubleshooting), see [docs/GKE-DEPLOYMENT.md](docs/GKE-DEPLOYMENT.md).**

Summary:

1. **Build and push images** to Artifact Registry (e.g. `REGION-docker.pkg.dev/PROJECT_ID/todo-app/todo-api:latest`).
2. **Create a GKE cluster** and grant the node service account `roles/artifactregistry.reader`.
3. **Create `kubernetes/secret.yaml`** from `secret.yaml.example` with base64-encoded DB password.
4. **Apply manifests** in order: namespace → configmap → secret → postgres-pvc → postgres-deployment → backend-deployment → frontend-deployment.
5. **Get EXTERNAL-IPs** with `kubectl get svc -n todo-app` and open the frontend IP in the browser.

### Optional: Google Cloud Logging

- Ensure the GKE node pool has a service account with **Logs Writer** (or use Workload Identity).
- In the backend deployment, set env `GCP_PROJECT_ID` and mount or provide `GOOGLE_APPLICATION_CREDENTIALS` if using a key (e.g. via a K8s secret). The NestJS app uses `@google-cloud/logging-winston` when these are set.

---

## API Summary

| Method | Path       | Description        |
|--------|------------|--------------------|
| GET    | /todos     | List all todos     |
| GET    | /todos/:id | Get one todo       |
| POST   | /todos     | Create todo        |
| PATCH  | /todos/:id | Update todo        |
| DELETE | /todos/:id | Delete todo        |

Full request/response shapes and validation rules are in **Swagger** at `/api/docs`.

---

## Screenshots

Add screenshots of your deployed app here (e.g. Todo list UI, Swagger docs, GKE workload overview) to showcase the project.

---

## Linting

- **Backend:** `cd backend && npm run lint` (ESLint + Prettier)  
- **Frontend:** `cd frontend && npm run lint`  

---

## License

MIT.
