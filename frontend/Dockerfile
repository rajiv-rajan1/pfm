FROM node:18-slim

WORKDIR /app

# Install dependencies (including devDependencies for build)
COPY package.json .
RUN npm install

# Copy app source
COPY . .

# Build Vite app
RUN npm run build

# Expose port (Cloud Run defaults to 8080)
EXPOSE 8080

# Start server
CMD ["node", "server.js"]
