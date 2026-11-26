# Smart Campus Student Hub — Rebuild

A clean, guided rebuild of the Smart Campus Student Hub.

- Working folder: `Desktop/rebuild/smart-campus`
- Original project at `Desktop/smart-campus` is untouched
- GitHub repo: `https://github.com/faizanyousuf/smart-campus-student-hub.git`
- Status: **complete — 17 of 17 stages**

## Stack

| Layer | Technology |
|---|---|
| Backend | Java 17 bytecode, Spring Boot 3.3.5, Maven |
| Database | MySQL 8, schema managed by `schema.sql` (`ddl-auto: none`) |
| Security | Spring Security + stateless JWT |
| Frontend | React 18, Vite 5, Axios, React Router v6 |
| Tests | JUnit 5 + Mockito (`spring-boot-starter-test`) |

## Modules

- **Auth** — login, register, `/auth/me` session restore, logout
- **Notices** — public reading; staff/admin create, edit, pin, unpin, delete
- **Complaints** — students submit and view their own; staff/admin assign and change status
- **Lost & Found** — report items, claim items, approve/reject claims, item status updates
- **Dashboard** — role-aware summary counts

## Demo accounts

All demo accounts use password:

```text
Demo@12345
```

| Role | Email |
|---|---|
| Admin | `admin@smartcampus.edu` |
| Staff | `staff@smartcampus.edu` |
| Student | `student@smartcampus.edu` |
| Student | `student2@smartcampus.edu` |

## Repository layout

```text
smart-campus/
├── backend/smart-campus-api/
│   └── src/main/
│       ├── java/com/smartcampus/hub/
│       │   ├── config/        # DataSeeder
│       │   ├── controller/    # REST controllers
│       │   ├── dto/           # Request/response records
│       │   ├── entity/        # JPA entities
│       │   ├── exception/     # Global API error handling
│       │   ├── repository/    # Spring Data repositories
│       │   ├── security/      # JWT filter, service, config
│       │   └── service/       # Business logic
│       └── resources/
│           ├── application.yml
│           ├── application-local.yml   # ignored; real secrets
│           └── db/schema.sql
├── frontend/
│   └── src/
│       ├── index.css          # Global styling
│       ├── api/               # Axios helper with JWT interceptor
│       ├── components/        # Layout, ProtectedRoute
│       ├── context/           # AuthContext
│       └── pages/             # auth, dashboard, notices, complaints, lostfound
└── docs/screenshots/
```

## Local setup

### 1. Database

Create the database and application user in MySQL, then load:

```text
backend/smart-campus-api/src/main/resources/db/schema.sql
```

The committed schema is the source of truth. Hibernate uses:

```yaml
spring.jpa.hibernate.ddl-auto: none
```

### 2. Local configuration

Create the ignored file:

```text
backend/smart-campus-api/src/main/resources/application-local.yml
```

It must contain the real datasource password and the JWT secret:

```yaml
spring:
  datasource:
    url: jdbc:mysql://localhost:3306/smart_campus_hub
    username: smartcampus
    password: YOUR_DB_PASSWORD

app:
  jwt:
    secret: YOUR_LONG_RANDOM_SECRET
    expiration-ms: 86400000
```

Generate a secret with:

```bash
openssl rand -base64 48
```

Never commit this file.

### 3. Backend

```bash
cd backend/smart-campus-api
mvn clean compile
mvn test
mvn spring-boot:run
```

Seed message on success:

```text
Seed complete. Demo login: student@smartcampus.edu / Demo@12345
```

### 4. Frontend

```bash
cd frontend
npm install
npm run dev
```

Open:

```text
http://localhost:5173
```

## Main API endpoints

| Method | Endpoint | Access |
|---|---|---|
| POST | `/api/auth/login` | public |
| POST | `/api/auth/register` | public |
| GET | `/api/auth/me` | authenticated |
| GET | `/api/health` | public |
| GET/POST/PUT/PATCH/DELETE | `/api/notices/**` | reads public, writes staff/admin |
| GET/POST | `/api/complaints` | authenticated |
| PATCH | `/api/complaints/{id}/assign` | staff/admin |
| PATCH | `/api/complaints/{id}/status` | staff/admin |
| GET/POST | `/api/lost-items` | authenticated |
| GET | `/api/lost-items/type/{LOST\|FOUND}` | authenticated |
| POST | `/api/lost-items/{id}/claims` | authenticated |
| GET | `/api/claims` | authenticated |
| PATCH | `/api/claims/{id}/decision` | staff/admin |
| GET | `/api/dashboard` | authenticated |

## Verification commands

```bash
# Backend tests
cd backend/smart-campus-api
mvn test

# Frontend production build
cd ../../frontend
npm run build

# Git safety
cd ..
git status --short
git log --oneline -5
git ls-files | grep -E '(application-local|\.env$|node_modules|target/)' || echo "No secrets or build output tracked"
```

## Safety

The frontend keeps the signed-in credentials in **tab-scoped `sessionStorage`** only, so an expired JWT can be renewed silently and the original request retried. These values are never written to `localStorage`, never logged, and never committed. Signing out clears them.

`.gitignore` blocks:

- `.env`, `.env.*` except `.env.example`
- `application-local.yml` / `.properties`
- `node_modules/`, `target/`, `dist/`
- local database and log files

Only source code, committed SQL, lockfiles, and documentation are tracked.

## Roadmap — complete

1. Folder + GitHub repo + first commit
2. Project folder structure
3. MySQL setup and tables
4. Spring Boot basics
5. JPA entities
6. Repositories and seed data
7. DTOs, services, controllers
8. Spring Security + JWT
9. React setup + API helper
10. Login/Register + session restore
11. Notices module
12. Complaints module
13. Lost & Found + claims
14. Role dashboards
15. React Router + protected routes
16. Backend unit tests
17. Docs, cleanup and final verification
