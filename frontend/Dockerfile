# Stage 1: Build the React application
FROM node:18-slim as builder
WORKDIR /app

# Install dependencies
COPY package.json package-lock.json* ./

# 1. Declare the argument
ARG VITE_GOOGLE_CLIENT_ID
# 2. Set it as an environment variable for the build step
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
# We use an inline configuration to ensure it binds to port 8080 correctly
RUN echo 'server { \
    listen 8080; \
    server_name localhost; \
    root /usr/share/nginx/html; \
    index index.html index.htm; \
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
}' > /etc/nginx/conf.d/default.conf

# Expose 8080
EXPOSE 8080

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]