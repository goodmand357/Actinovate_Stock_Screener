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

WORKDIR /backend

# Install system dependencies to build wheels
RUN apt-get update && apt-get install -y gcc build-essential

# Use a virtual environment to keep things clean
RUN python -m venv venv
ENV PATH="/backend/venv/bin:$PATH"

COPY backend/requirements.txt .

# 🧠 FIX: Avoid memory overload with limited pip cache
RUN pip install --no-cache-dir --upgrade pip \
 && pip install --no-cache-dir -r requirements.txt

COPY backend/ .

COPY --from=frontend /app/dist ./frontend/build

EXPOSE 5000
CMD ["python", "app.py"]
