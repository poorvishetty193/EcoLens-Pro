# Build frontend
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Serve with nginx
FROM nginx:alpine
# Copy built files to nginx serve directory
COPY --from=builder /app/dist /usr/share/nginx/html
# Fallback routing for SPA (React Router)
RUN echo 'server { listen 8080; location / { root /usr/share/nginx/html; index index.html index.htm; try_files $uri $uri/ /index.html; } }' > /etc/nginx/conf.d/default.conf

# Expose port (Cloud Run sets PORT env variable automatically, defaulting to 8080)
ENV PORT=8080
EXPOSE 8080

CMD ["nginx", "-g", "daemon off;"]
