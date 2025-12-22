# Workload Identity Federation Setup

Since you are using Workload Identity (a more secure method than JSON keys), you need to configure the authentication pool and provider on Google Cloud.

## 1. Set Environment Variables
Run this in your Cloud Shell or local terminal (make sure you are logged in with `gcloud auth login` and `gcloud config set project <YOUR_PROJECT_ID>`):

```bash
# Configuration
export COMPONENT_NAME="pfm-component" # Or any name you like
export PROJECT_ID=$(gcloud config get-value project)
export PROJECT_NUMBER=$(gcloud projects describe $PROJECT_ID --format="value(projectNumber)")
export REGION="us-central1"
export POOL_NAME="github-pool"
export PROVIDER_NAME="github-provider"
export SA_NAME="github-ci-cd" # Must match what you used before
export REPO="rajiv-rajan1/pfm" # e.g., rajiv-rajan1/pfm
```

## 2. Create the Workload Identity Pool
```bash
gcloud iam workload-identity-pools create $POOL_NAME \
    --location="global" \
    --display-name="GitHub Actions Pool" \
    --project=$PROJECT_ID
```

## 3. Create the Workload Identity Provider
**Important**: We will first try to delete the provider if it partially exists to ensure a clean state.

```bash
# Delete if exists (ignore error if not found)
gcloud iam workload-identity-pools providers delete $PROVIDER_NAME \
    --workload-identity-pool=$POOL_NAME \
    --location="global" \
    --project=$PROJECT_ID \
    --quiet || true

# Create the provider
gcloud iam workload-identity-pools providers create-oidc $PROVIDER_NAME \
    --location="global" \
    --workload-identity-pool=$POOL_NAME \
    --display-name="GitHub Actions Provider" \
    --attribute-mapping="google.subject=assertion.sub,attribute.repository=assertion.repository" \
    --issuer-uri="https://token.actions.githubusercontent.com" \
    --project=$PROJECT_ID
```

## 4. Allowance: IAM Policy Binding
Allow the GitHub Actions workflow (via the pool) to impersonate the Service Account.
**CRITICAL**: Make sure `REPO` is set correctly above!

```bash
gcloud iam service-accounts add-iam-policy-binding "$SA_NAME@$PROJECT_ID.iam.gserviceaccount.com" \
    --project=$PROJECT_ID \
    --role="roles/iam.workloadIdentityUser" \
    --member="principalSet://iam.googleapis.com/projects/$PROJECT_NUMBER/locations/global/workloadIdentityPools/$POOL_NAME/attribute.repository/$REPO"
```

## 5. Enable the IAM Credentials API
Required for the token exchange to work.
```bash
gcloud services enable iamcredentials.googleapis.com --project=$PROJECT_ID
```

## 6. Get Your Provider String (For the YAML)
Run this command to get the exact string you need to paste into your GitHub Actions YAML:

```bash
echo "workload_identity_provider: 'projects/$PROJECT_NUMBER/locations/global/workloadIdentityPools/$POOL_NAME/providers/$PROVIDER_NAME'"
```

**Check against your YAML:**
If the output number differs from what is currently in your `.github/workflows/*.yml` files (you mentioned `386128391538`), you **MUST** update the YAML files with the string output by the command above.

## 7. Secrets in GitHub
Ensure these Secrets are set in your GitHub Repository settings (Settings > Secrets and variables > Actions):

*   `GCP_PROJECT_ID`: Your actual Project ID (e.g., `pfm-2t1`)
*   `GCP_REGION`: `us-central1` (or your chosen region)
*   `ARTIFACT_REGISTRY_REPO`: `pfm-repo` (or whatever you named your artifact registry)
*   `GCP_SA_KEY`: **DELETE THIS** if it exists. We are not using it anymore.
