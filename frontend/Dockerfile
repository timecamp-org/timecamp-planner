FROM node:18.13.0-alpine

WORKDIR /app

# Install dependencies needed for building (including git for webpack git-revision plugin)
RUN apk add --no-cache python3 make g++ bash git findutils

# Copy .npmrc first for FontAwesome authentication (copy to both project root and home)
COPY .npmrc ./
COPY .npmrc /root/.npmrc

# Copy package files
COPY package.json yarn.lock ./

# Copy tools directory needed for preinstall script
COPY tools/ ./tools/

# Copy packages directory (needed for workspace setup)
COPY packages/ ./packages/

# Copy app directory structure (needed for install script to find package.json files)
COPY app/ ./app/

# Run preinstall script manually to install workspace dependencies
RUN if [ -f ./tools/install.sh ]; then \
      bash ./tools/install.sh || true; \
    fi

# Install root dependencies (with .npmrc available)
# Try with frozen lockfile first, fallback to regular install if FontAwesome auth fails
RUN yarn install --frozen-lockfile 2>&1 | tee /tmp/install.log || \
    (grep -q "401 Unauthorized" /tmp/install.log && \
     echo "FontAwesome auth failed, trying without frozen lockfile..." && \
     yarn install --ignore-engines || yarn install) || \
    yarn install

# Copy remaining files (including .git for webpack git-revision plugin)
COPY . .
# Ensure .git is available for webpack git-revision plugin
RUN if [ ! -d .git ] && [ -d ../.git ]; then cp -r ../.git .git 2>/dev/null || true; fi

# Run postinstall script
RUN yarn postinstall || true

# Ensure config directory exists (create if it doesn't)
RUN mkdir -p app/common/config

# Expose port
EXPOSE 3000

# Start script that ensures dependencies are installed
# Use --no-lockfile and --ignore-engines to avoid FontAwesome Pro and Node version issues
CMD ["sh", "-c", "if [ ! -d node_modules ] || [ ! -f node_modules/.yarn-integrity ]; then echo 'Installing dependencies (ignoring lockfile and engine checks)...' && yarn install --no-lockfile --ignore-engines || yarn install --ignore-engines || yarn install; fi && node -e \"require('esbuild').transformSync('const ok = true', { loader: 'js' })\" >/dev/null 2>&1 || (echo 'Reinstalling dependencies for current platform...' && rm -rf node_modules && yarn install --no-lockfile --ignore-engines || yarn install --ignore-engines || yarn install) && NODE_ENV=development STORYBOOK_DEVICE=browser node -max-old-space-size=4096 tools/server"]
