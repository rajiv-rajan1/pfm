FROM node:18-slim

WORKDIR /app

# Install dependencies first (caching)
COPY package.json .
RUN npm install --only=production

# Copy app source
COPY . .

# Expose port (Cloud Run defaults to 8080)
EXPOSE 8080

# Start server
CMD ["node", "server.js"]
