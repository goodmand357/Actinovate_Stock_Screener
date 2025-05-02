# ---------- FRONTEND ----------
FROM node:18 AS frontend
WORKDIR /app
COPY actinovate-frontend-main/package*.json ./
RUN npm install
COPY actinovate-frontend-main/ ./
RUN npm run build

# ---------- BACKEND ----------
FROM python:3.11-slim AS backend

# Required for pip + lxml + yfinance dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    gcc \
    libxml2-dev \
    libxslt1-dev \
    libffi-dev \
    curl \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY backend/ ./
COPY --from=frontend /app/dist ./frontend/build

RUN pip install --upgrade pip && pip install --no-cache-dir -r requirements.txt

EXPOSE 5000
CMD ["python", "app.py"]
