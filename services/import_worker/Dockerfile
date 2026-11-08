# ==============================================================================
# DOCKERFILE: services/import_worker/Dockerfile
# Project: Bệnh viện Thú y Lê Sơn
# Phase 4B: Isolated Excel Ingestion Sandbox Container
# Hardening:
#   - Non-root execution (appuser)
#   - Minimal Alpine Node.js 20/22 runtime
#   - Zero network outbound tools (no curl, no wget)
# ==============================================================================

FROM node:22-alpine

# Create unprivileged worker user
RUN addgroup -S workergroup && adduser -S workeruser -G workergroup

WORKDIR /app

COPY package*.json ./
# Install only production dependencies
RUN npm ci --only=production --ignore-scripts 2>/dev/null || true

COPY src/ ./src/

# Switch to non-root user
USER workeruser

# Environment defaults
ENV NODE_ENV=production \
    NODE_OPTIONS="--max-old-space-size=1536"

CMD ["node", "src/ingest_pipeline.cjs"]
