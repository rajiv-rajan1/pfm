# CI/CD Pipeline Documentation

Automated deployment pipeline using GitHub Actions and Google Cloud Run.

## GitHub Secrets Required
Go to **Settings > Secrets and variables > Actions** in your GitHub repository and add:

| Secret Name | Description |
|---|---|
| `GCP_PROJECT_ID` | Your Google Cloud Project ID |
| `GCP_REGION` | e.g., `us-central1` |
| `GCP_SA_KEY` | The JSON content of your Service Account Key |
| `ARTIFACT_REGISTRY_REPO` | Name of your repo (e.g., `pfm-repo`) |

## Workflows

### 1. Backend Deploy (`backend-deploy.yml`)
- **Trigger**: Push to `main` (changes in `backend/**`).
- **Steps**:
    1.  Checkout code.
    2.  Auth with GCP using `GCP_SA_KEY`.
    3.  Build Docker image: `us-central1-docker.pkg.dev/$PROJECT/$REPO/pfm-backend:$SHA`.
    4.  Push to Artifact Registry.
    5.  Deploy to Cloud Run (`pfm-backend`).
        - *One instance max* (due to SQLite).
        - *1GB Memory*.

### 2. Frontend Deploy (`frontend-deploy.yml`)
- **Trigger**: Push to `main` (changes in `frontend/**`).
- **Steps**:
    1.  Checkout code.
    2.  Auth with GCP.
    3.  Build Docker image.
    4.  Push to Artifact Registry.
    5.  Deploy to Cloud Run (`pfm-frontend`).
    6.  **Runtime Config**: Injects `BACKEND_API_URL` based on the deployed backend service.

## Maintenance
- **Rollback**: Use Cloud Run "Revisions" tab to revert to a previous revision immediately.
- **Credential Rotation**: Generate a new key in GCP IAM -> Service Accounts, and update `GCP_SA_KEY` in GitHub Secrets.
