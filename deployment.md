# Deploying to Google Cloud Run

This guide assumes you have the Google Cloud SDK (`gcloud`) installed and authenticated.

## Prerequisites
1.  Create a Google Cloud Project.
2.  Enable the **Cloud Run API** and **Artifact Registry API**.
3.  Authenticate: `gcloud auth login` and `gcloud config set project [YOUR_PROJECT_ID]`.

## Step 1: Create Artifact Registry
Create a Docker repository in Artifact Registry to store your images.

```bash
gcloud artifacts repositories create pfm-repo \
    --repository-format=docker \
    --location=us-central1 \
    --description="Docker repository for PFM MVP"
```

## Step 2: Build and Push Images

### Backend
1.  Navigate to the project root.
2.  Build the backend image:
    ```bash
    docker build -t us-central1-docker.pkg.dev/[YOUR_PROJECT_ID]/pfm-repo/pfm-backend ./backend
    ```
3.  Push the image:
    ```bash
    docker push us-central1-docker.pkg.dev/[YOUR_PROJECT_ID]/pfm-repo/pfm-backend
    ```

### Frontend
1.  Build the frontend image:
    ```bash
    docker build -t us-central1-docker.pkg.dev/[YOUR_PROJECT_ID]/pfm-repo/pfm-frontend ./frontend
    ```
2.  Push the image:
    ```bash
    docker push us-central1-docker.pkg.dev/[YOUR_PROJECT_ID]/pfm-repo/pfm-frontend
    ```

## Step 3: Deploy Backend Service
Deploy the backend first so we can get its URL.

```bash
gcloud run deploy pfm-backend \
    --image us-central1-docker.pkg.dev/[YOUR_PROJECT_ID]/pfm-repo/pfm-backend \
    --platform managed \
    --region us-central1 \
    --allow-unauthenticated \
    --port 8000
```
*Note the URL provided in the output (e.g., https://pfm-backend-xy123.a.run.app).*

**Important Note on Persistence**: This deployment uses a SQLite file inside the container. **Data will be lost** if the container restarts or scales down. For production, connect this service to **Cloud SQL**.

## Step 4: Configure & Deploy Frontend

For the frontend Nginx proxy to work on Cloud Run, you need to configure the specialized proxy behavior or, more commonly for valid separation, **update the Frontend Nginx config** to forward requests to the *absolute URL* of the backend you just deployed, OR update the `script.js` to point to the backend URL.

**Simpler Approach for Cloud Run MVP:**
Since Cloud Run services have unique HTTPS URLs, the Nginx internal proxy `http://backend:8000` (which works in Docker Compose) **will not work** in Cloud Run because they are separate isolated services.

**Action Required:**
1.  Get the Backend URL from Step 3.
2.  Update `frontend/nginx.conf` to proxy path `/api` to the Backend Service URL.
    *Alternatively, for a pure static site approach:* Update `frontend/script.js` to fetch from the full backend URL (e.g., `https://pfm-backend-xy123.a.run.app/api/waitlist`) and rebuild the frontend image.

**Deploy Frontend:**
```bash
gcloud run deploy pfm-frontend \
    --image us-central1-docker.pkg.dev/[YOUR_PROJECT_ID]/pfm-repo/pfm-frontend \
    --platform managed \
    --region us-central1 \
    --allow-unauthenticated \
    --port 80
```

## Step 5: Final Check
Visit the Frontend URL provided by Cloud Run. Test the form.
