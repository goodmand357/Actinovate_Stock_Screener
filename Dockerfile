# ---------- FRONTEND ----------
FROM node:18 AS frontend

# Set working directory
WORKDIR /app

# Install dependencies
COPY actinovate-frontend-main/package*.json ./
RUN npm install

# Copy frontend source
COPY actinovate-frontend-main/ ./

# Optional: if VITE_ variables are needed during build
COPY actinovate-frontend-main/.env ./

# Build frontend
RUN npm run build

# ---------- BACKEND ----------
FROM python:3.10-slim AS backend

# Set backend workdir
WORKDIR /backend

# Install system dependencies (if needed)
RUN apt-get update && apt-get install -y gcc

# Install Python dependencies
COPY backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy backend source
COPY backend/ .

# Copy built frontend into backend (if used by Flask etc)
COPY --from=frontend /app/dist ./frontend/build

# Expose port (adjust if needed)
EXPOSE 5000

# Start the backend server
CMD ["python", "app.py"]
