# Google Cloud Platform Setup for CI/CD

Run these commands in your Cloud Shell or local terminal (authenticated with `gcloud`).

## 1. Environment Variables
Set these for your session:
```bash
export PROJECT_ID="your-project-id"
export REGION="us-central1"
export REPO_NAME="pfm-repo"
export SA_NAME="github-ci-cd"
```

## 2. Enable APIs
```bash
gcloud services enable artifactregistry.googleapis.com run.googleapis.com \
    --project=$PROJECT_ID
```

## 3. Create Artifact Registry
```bash
gcloud artifacts repositories create $REPO_NAME \
    --repository-format=docker \
    --location=$REGION \
    --description="Docker repository for PFM MVP" \
    --project=$PROJECT_ID
```

## 4. Create Service Account for GitHub Actions
```bash
gcloud iam service-accounts create $SA_NAME \
    --description="Service Account for GitHub Actions CI/CD" \
    --display-name="GitHub CI/CD" \
    --project=$PROJECT_ID
```

## 5. Assign IAM Roles
Give the service account permission to push to Artifact Registry and deploy to Cloud Run.

```bash
# Artifact Registry Writer
gcloud projects add-iam-policy-binding $PROJECT_ID \
    --member="serviceAccount:$SA_NAME@$PROJECT_ID.iam.gserviceaccount.com" \
    --role="roles/artifactregistry.writer"

# Cloud Run Admin (to create/update services)
gcloud projects add-iam-policy-binding $PROJECT_ID \
    --member="serviceAccount:$SA_NAME@$PROJECT_ID.iam.gserviceaccount.com" \
    --role="roles/run.admin"

# Service Account User (to act as the compute identity)
gcloud projects add-iam-policy-binding $PROJECT_ID \
    --member="serviceAccount:$SA_NAME@$PROJECT_ID.iam.gserviceaccount.com" \
    --role="roles/iam.serviceAccountUser"
```

## 6. Generate Key
Download the JSON key to add to GitHub Secrets.
```bash
gcloud iam service-accounts keys create gcp-key.json \
    --iam-account=$SA_NAME@$PROJECT_ID.iam.gserviceaccount.com
```
*Copy the content of `gcp-key.json` and paste it into GitHub Secret `GCP_SA_KEY`.*
