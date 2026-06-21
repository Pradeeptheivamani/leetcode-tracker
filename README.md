# LeetCode Analytics & Interview Readiness Platform

Production-oriented full-stack app for tracking LeetCode progress, interview readiness, topic/company mastery, contests, notes, friend comparison, AI hints, admin analytics, and bulk user export reports.

## Step-by-step Architecture

1. The frontend is a React/Vite/Tailwind application with React Router, Context API auth, Axios API access, and Recharts dashboards.
2. The backend is a Spring Boot 3 API using layered controllers, services, repositories, DTOs, Spring Security, JWT, JPA, and MySQL.
3. MySQL stores users, problems, tags, company mappings, contests, notes, friends, and export jobs.
4. JWT protects all application APIs except register/login/health.
5. Reports can be exported from the frontend as Excel, CSV, and print-to-PDF; the backend has a summary endpoint ready for server-side report generation.

## Folder Structure

```text
leetcode-tracker/
  backend/
    pom.xml
    src/main/java/com/leetcodeanalytics/
      domain/          JPA entities and enums
      dto/             API request/response records
      repository/      Spring Data repositories
      security/        JWT and security config
      service/         Business logic
      web/             REST controllers and exception handling
    src/main/resources/application.yml
  database/
    schema.sql
    ERD.md
  frontend/
    src/components/    Reusable UI widgets
    src/context/       Auth and theme context
    src/pages/         Feature modules
    src/services/      Axios client
```

## Backend APIs

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`
- `PUT /api/auth/profile`
- `PUT /api/auth/password`
- `GET /api/problems?q=&page=&size=&sort=`
- `POST /api/problems`
- `PUT /api/problems/{id}`
- `DELETE /api/problems/{id}`
- `GET /api/dashboard`
- `POST /api/ai/hints`
- `POST /api/friends`
- `DELETE /api/friends/{username}`
- `POST /api/exports/bulk-summary`
- `GET /api/admin/analytics`

## Local Setup

Prerequisites: Java 21, Maven, Node.js 20+, MySQL 8.

```powershell
cd backend
mvn spring-boot:run
```

```powershell
cd frontend
npm install
npm run dev
```

Create a `.env` for frontend when needed:

```env
VITE_API_URL=http://localhost:8080
```

Backend environment variables:

```env
DB_URL=jdbc:mysql://localhost:3306/leetcode_analytics?createDatabaseIfNotExist=true
DB_USERNAME=root
DB_PASSWORD=password
JWT_SECRET=replace-with-a-long-random-production-secret
CORS_ALLOWED_ORIGINS=http://localhost:5173
```

## Deployment Guide

1. Provision MySQL and run `database/schema.sql`, or let JPA create tables with `ddl-auto=update`.
2. Build backend with `mvn clean package`.
3. Run backend jar with production environment variables.
4. Build frontend with `npm run build --workspace=frontend`.
5. Host `frontend/dist` on Netlify, Vercel, S3/CloudFront, or Nginx.
6. Point `VITE_API_URL` to the deployed Spring Boot API.
7. Replace the development JWT secret and restrict CORS origins.

## Notes

The AI hint generator intentionally returns guidance only and avoids complete solutions. The LeetCode bulk export service is structured for live profile fetching; the current implementation provides deterministic report rows in the UI and a backend summary endpoint for extension.
