# ---------- FRONTEND ----------
FROM node:18 AS frontend
WORKDIR /app/frontend
COPY actinovate-frontend-main/package*.json ./
RUN npm install
COPY actinovate-frontend-main/ .
RUN npm run build

# ---------- BACKEND ----------
FROM python:3.11-slim AS backend

# Add necessary build tools for lxml and other C dependencies
RUN apt-get update && apt-get install -y \
    gcc \
    libxml2-dev \
    libxslt1-dev \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY backend/ ./backend/
COPY --from=frontend /app/frontend/dist ./frontend/build

RUN pip install --no-cache-dir -r backend/requirements.txt

EXPOSE 5000
CMD ["python", "app.py"]
