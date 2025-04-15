# ---------- FRONTEND ----------
FROM node:18 AS frontend
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ .
RUN npm run build

# ---------- BACKEND ----------
FROM python:3.11-slim AS backend
WORKDIR /app
COPY backend/ ./backend/
COPY --from=frontend /app/frontend/dist ./frontend/build
RUN pip install --no-cache-dir -r backend/requirements.txt

EXPOSE 5000
CMD ["python", "backend/app.py"]
