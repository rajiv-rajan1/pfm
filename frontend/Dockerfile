FROM node:18-slim

WORKDIR /app

# 1. Install dependencies
COPY package.json package-lock.json* ./
# Note: We use 'npm install' instead of 'npm ci --only=production' because
# we need devDependencies (like vite) to run the build step below.
RUN npm install

# 2. Copy source code
COPY . .

# 3. Build the Vite app (generates the 'dist' folder)
RUN npm run build

# 4. Expose port 8080
EXPOSE 8080

# 5. Start your custom server
# Ensure your server.js uses process.env.PORT || 8080
CMD ["node", "server.js"]
