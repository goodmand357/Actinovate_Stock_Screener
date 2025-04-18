from flask import Flask, jsonify, request, send_from_directory
from flask_cors import CORS
from services import get_full_stock_data
import os

# Serve static files (React build)
app = Flask(__name__, static_folder='../actinovate-frontend-main/dist', static_url_path='/')
CORS(app)

# ===========================
# FRONTEND ROUTE
# ===========================

@app.route('/')
def serve_index():
    return send_from_directory(app.static_folder, 'index.html')


# ===========================
# API ROUTES
# ===========================

# Health check
@app.route('/ping')
def ping():
    return "Backend is alive"

# Single stock financial data
@app.route('/api/financial-data')
def financial_data():
    symbol = request.args.get('symbol', 'AAPL')
    data = get_full_stock_data(symbol)
    return jsonify(data)

# Stock screener endpoint with filters
@app.route('/api/screener')
def screener():
    # Accept multiple symbols: ?symbols=AAPL&symbols=MSFT
    symbols = request.args.getlist('symbols') or ['AAPL', 'MSFT', 'GOOGL']
    pe_max = float(request.args.get('pe_max', 30.0))
    dividend_min = float(request.args.get('dividend_min', 0.0))
    rsi_max = float(request.args.get('rsi_max', 70.0))

    results = []

    for symbol in symbols:
        try:
            data = get_full_stock_data(symbol)
            pe = data.get("pe_ratio")
            div = data.get("dividend_yield") or 0
            rsi = data.get("rsi") or 0

            # Apply filters
            if (pe is not None and pe <= pe_max and div >= dividend_min and rsi <= rsi_max):
                results.append({
                    "symbol": symbol.upper(),
                    "price": data.get("price"),
                    "pe_ratio": pe,
                    "dividend_yield": div,
                    "rsi": rsi,
                    "sector": data.get("sector"),
                    "market_cap": data.get("market_cap"),
                    "eps": data.get("eps"),
                })
        except Exception as e:
            print(f"[❌] Error processing {symbol}: {e}")
            continue

    return jsonify(results)


# ===========================
# SERVER RUNNER
# ===========================

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port, debug=False)
