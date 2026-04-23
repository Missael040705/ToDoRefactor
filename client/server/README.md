# ToDoRefactor API (Local Dev)

Express API for tasks persisted in Neon PostgreSQL.

## Endpoints

- GET `/api/tasks`
- POST `/api/tasks`
- PUT `/api/tasks/:id`
- DELETE `/api/tasks/:id`

## Local setup

1. Copy `.env.example` to `.env`.
2. Set `DATABASE_URL` with your Neon credentials.
3. Install and run:

```bash
npm install
npm run start
```

API runs on `http://localhost:3001` by default.

## Quick smoke test (PowerShell)

```powershell
Invoke-RestMethod -Uri http://localhost:3001/api/tasks -Method GET

$body = @{ title='Test'; description='Smoke'; owner='local-dev' } | ConvertTo-Json
Invoke-RestMethod -Uri http://localhost:3001/api/tasks -Method POST -ContentType 'application/json' -Body $body
```

