# ---------- FRONTEND ----------
FROM node:18 AS frontend
WORKDIR /app

# Install dependencies
COPY actinovate-frontend-main/package*.json ./
RUN npm install

# Copy source and build
COPY actinovate-frontend-main/ ./
RUN npm run build

# ---------- BACKEND ----------
FROM python:3.11-slim AS backend

# Avoid prompts + install system deps
ENV DEBIAN_FRONTEND=noninteractive

RUN apt-get update && apt-get install -y \
    gcc \
    libxml2-dev \
    libxslt1-dev \
    build-essential \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy backend code
COPY backend/ ./

# Copy built frontend
COPY --from=frontend /app/dist ./frontend/build

# Install Python dependencies
RUN pip install --upgrade pip && pip install --no-cache-dir -r requirements.txt

# Expose backend port
EXPOSE 5000

# Run backend app
CMD ["python", "app.py"]
