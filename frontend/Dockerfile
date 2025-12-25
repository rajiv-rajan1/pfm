# Stage 1: Build the React application
FROM node:18-slim as builder
WORKDIR /app

# Install dependencies
COPY package.json package-lock.json* ./

# 1. Declare the argument
ARG VITE_GOOGLE_CLIENT_ID

# 2. Create a .env file for the build step
# This ensures Vite "bakes" the variable into the static files
RUN echo "VITE_GOOGLE_CLIENT_ID=$VITE_GOOGLE_CLIENT_ID" > .env
ENV VITE_GOOGLE_CLIENT_ID=$VITE_GOOGLE_CLIENT_ID

RUN npm install

# Copy source code
COPY . .

# Build the app (Vite creates the 'dist' folder)
RUN npm run build

# Stage 2: Serve with Nginx
FROM nginx:alpine

# Copy the build output from Stage 1 to Nginx
COPY --from=builder /app/dist /usr/share/nginx/html

# Configure Nginx for Cloud Run (Port 8080) and React Router
# We use a template to allow runtime environment variable substitution (BACKEND_API_URL)
# Nginx docker image automatically runs envsubst on files in /etc/nginx/templates/
RUN mkdir -p /etc/nginx/templates
RUN echo 'server { \
    listen 8080; \
    server_name localhost; \
    root /usr/share/nginx/html; \
    index index.html index.htm; \
    \
    # Proxy API requests to the backend (passed as env var) \
    location /api { \
        proxy_pass ${BACKEND_API_URL}; \
        proxy_set_header Host $host; \
        proxy_set_header X-Real-IP $remote_addr; \
    } \
    \
    # Handle React Router (redirect 404s to index.html) \
    location / { \
        try_files $uri $uri/ /index.html; \
    } \
    \
    # Optional: Cache static assets for performance \
    location ~* \.(js|css|png|jpg|jpeg|gif|ico)$ { \
        expires 1y; \
        add_header Cache-Control "public, no-transform"; \
    } \
}' > /etc/nginx/templates/default.conf.template

# Ensure the final config directory exists (it should, but safety first)
RUN mkdir -p /etc/nginx/conf.d

# Expose 8080
EXPOSE 8080

# Start Nginx (envsubst happens automatically by entrypoint)
CMD ["nginx", "-g", "daemon off;"]