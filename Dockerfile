# ---------- FRONTEND ----------
FROM node:18 AS frontend
WORKDIR /app

# Install deps and build
COPY actinovate-frontend-main/package*.json ./
RUN npm install
COPY actinovate-frontend-main/ ./
RUN npm run build

# ---------- BACKEND ----------
FROM python:3.11-slim AS backend

ENV DEBIAN_FRONTEND=noninteractive

# Install required system libs for pandas, sklearn, shap, lxml, etc
RUN apt-get update && apt-get install -y \
    build-essential \
    gcc \
    g++ \
    libxml2-dev \
    libxslt1-dev \
    libffi-dev \
    libglib2.0-0 \
    libsm6 \
    libxext6 \
    libxrender-dev \
    git \
    curl \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Backend code
COPY backend/ ./

# Include frontend build
COPY --from=frontend /app/dist ./frontend/build

# Upgrade pip and install Python dependencies
RUN pip install --upgrade pip && pip install --no-cache-dir -r requirements.txt

EXPOSE 5000

CMD ["python", "app.py"]
