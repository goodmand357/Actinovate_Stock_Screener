from flask import Flask, jsonify, request, send_from_directory
from flask_cors import CORS
from services import get_full_stock_data
import os

app = Flask(__name__, static_folder='../actinovate-frontend-main/dist', static_url_path='/')
CORS(app)

# Serve React frontend
@app.route('/')
def serve_index():
    return send_from_directory(app.static_folder, 'index.html')

# API route for financial data
@app.route('/api/financial-data')
def financial_data():
    symbol = request.args.get('symbol', 'AAPL')
    data = get_full_stock_data(symbol)
    return jsonify(data)

# Optional test route
@app.route('/ping')
def ping():
    return "Backend is alive"

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))  # Use Railway-assigned port if it exists
    app.run(host="0.0.0.0", port=port, debug=False)
