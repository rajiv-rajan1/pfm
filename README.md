# AI-Driven Personal Finance Manager (MVP)

A waitlist access portal for a future AI-driven personal finance application.
Built with a **Microservices Architecture** using **FastAPI** (Backend) and **Nginx** (Frontend).

## Project Structure
- `backend/`: FastAPI application with SQLite database (SQLAlchemy).
- `frontend/`: Static HTML/CSS/JS served via Nginx.
- `docker-compose.yml`: Orchestration for local development.

## 🚀 How to Run Locally

1.  **Prerequisites**: Ensure Docker and Docker Compose are installed.
2.  **Start the App**:
    ```bash
    docker-compose up --build
    ```
3.  **Access the App**:
    - Frontend: Open [http://localhost](http://localhost) in your browser.
    - API Docs: Open [http://localhost:8000/docs](http://localhost:8000/docs).

## 🛠 Features
- **Modern UI**: Glassmorphism design with animations.
- **REST API**: Python FastAPI with Pydantic validation.
- **Database**: Local SQLite `waitlist.db` (persisted via Docker volume).
- **Dockerized**: Ready for container orchestration.

## ☁️ Deployment
See [deployment.md](./deployment.md) for detailed instructions on deploying to **Google Cloud Run**.

## Future Roadmap to Production
- Migrate SQLite to **Cloud SQL (PostgreSQL)**.
- Add Authentication (OAuth2 / JWT).
- Implement the "Smart Analysis" AI features.
