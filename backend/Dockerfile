FROM node:16.13.1-alpine

WORKDIR /app

# Install dependencies needed for building
RUN apk add --no-cache python3 make g++ bash postgresql-client

# Copy package files
COPY package.json yarn.lock ./

# Install dependencies
RUN yarn install --frozen-lockfile

# Copy source code
COPY . .

# Create config.local directory for Docker overrides
RUN mkdir -p src/config/config.local

# Build TypeScript
RUN yarn build

# Expose port
EXPOSE 3001

# Default command
CMD ["node", "dist/run.js"]
