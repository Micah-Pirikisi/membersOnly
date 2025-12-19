# Use Node.js 22
FROM node:22-slim

# Create app directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install --production

# Copy all app files
COPY . .

# Expose port (Cloud Run uses $PORT)
ENV PORT=8080
EXPOSE 8080

# Start the app
CMD ["node", "index.js"]
