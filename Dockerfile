# Build frontend
FROM node:18-alpine AS client-builder
WORKDIR /app/client
COPY client/package*.json ./
RUN npm install
COPY client/ ./
RUN npm run build

# Build backend and serve
FROM node:18-alpine
WORKDIR /app/server
COPY server/package*.json ./
RUN npm install --production
COPY server/ ./
# Copy built frontend
COPY --from=client-builder /app/client/dist ./public

# Expose port (Cloud Run sets PORT env variable automatically, defaulting to 8080)
ENV PORT=8080
EXPOSE 8080

# Start server
CMD ["node", "index.js"]
