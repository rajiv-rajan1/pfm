# AI-Driven Personal Finance Manager (MVP)

A waitlist access portal for a future AI-driven personal finance application.
Built with a **Microservices Architecture** using **FastAPI** (Backend) and **React/Vite** (Frontend).

## Project Structure

- `backend/`: FastAPI application with SQLite database (SQLAlchemy).
- `frontend/`: React application (Vite + Tailwind CSS) served via a Node.js BFF (Backend for Frontend).
- `.github/workflows`: CI/CD pipelines for automated deployment.

## � Frontend Overview

The frontend is a modern **React 19** application built with **Vite** and styled with **Tailwind CSS**.

### Architecture: The "BFF" Pattern
Uniquely, this frontend does not just serve static files. It uses a **Node.js Express server** (`frontend/server.js`) to act as a **Backend for Frontend (BFF)**.

**Why?**
The application requires secure communication with the Google Cloud Run-hosted backend. The Express server handles:
1.  **Static File Serving**: Serves the optimized production build (`dist/`).
2.  **Authentication Proxy**: Intercepts API requests to `/api/*`, fetches a secure **Google ID Token** (using `google-auth-library`), and attaches it to the request before forwarding it to the backend. This keeps sensitive auth logic off the client browser.

## 🚀 How to Run Locally

### Prerequisites
- Node.js (v18+)
- Docker & Docker Compose (optional but recommended)

### 1. Frontend Development (UI Only)
For rapid UI development with Hot Module Replacement (HMR):
```bash
cd frontend
npm install
npm run dev
```
*Note: API calls may fail in this mode if they require the secure proxy to the backend.*

### 2. Full Application (Production Simulation)
To run the full stack locally as it runs in production (including the Auth Proxy):

**Option A: Using Docker (Recommended)**
```bash
# Build and run the container
docker build -t pfm-frontend ./frontend
docker run -p 8080:8080 -e BACKEND_API_URL="http://host.docker.internal:8000" pfm-frontend
```

**Option B: Manual Build & Run**
```bash
cd frontend
npm install
npm run build
# Set URL to your local or remote backend
export BACKEND_API_URL="http://localhost:8000"
node server.js
```

## ☁️ Deployment

The application is containerized and deployed to **Google Cloud Run**.

### Build Pipeline
1.  **Build**: GitHub Actions builds the frontend container using `frontend/Dockerfile`.
2.  **Push**: Pushes the image to Google Artifact Registry.
3.  **Deploy**: Deploys to Cloud Run with the `BACKEND_API_URL` environment variable injected.

### Configuration
- **Dockerfile**: `frontend/Dockerfile` (Installs dependencies -> builds Vite app -> runs Node server).
- **Port**: Listens on port `8080` (Standard for Cloud Run).

## 🛠 Features
- **Modern UI**: Glassmorphism design, responsive layout, and Radix UI components.
- **Secure Auth**: Google OAuth 2.0 integration.
- **Type Safety**: TypeScript used throughout the frontend.

## Future Roadmap
- Migrate SQLite to **Cloud SQL (PostgreSQL)**.
- Implement the "Smart Analysis" AI features.
