from flask import Flask, jsonify, request, send_from_directory
from flask_cors import CORS
from services import get_full_stock_data
import os
import yfinance as yf
from functools import lru_cache

app = Flask(__name__, static_folder='../actinovate-frontend-main/dist', static_url_path='/')
CORS(app)


# ===========================
# FRONTEND ROUTE
# ===========================
@app.route('/')
def serve_index():
    return send_from_directory(app.static_folder, 'index.html')


# ===========================
# HEALTH CHECK
# ===========================
@app.route('/ping')
def ping():
    return "Backend is alive"


# ===========================
# CACHED STOCK DATA
# ===========================
@lru_cache(maxsize=128)
def cached_stock_data(symbol):
    return get_full_stock_data(symbol)


# ===========================
# API: SINGLE STOCK DATA
# ===========================
@app.route('/api/financial-data')
def financial_data():
    symbol = request.args.get('symbol', 'AAPL')
    data = cached_stock_data(symbol)
    return jsonify(data)


# ===========================
# API: HISTORICAL DATA
# ===========================
@app.route('/api/history/<symbol>')
def stock_history(symbol):
    try:
        stock = yf.Ticker(symbol.upper())
        hist = stock.history(period='6mo')  # You can adjust period (e.g. '1y', '5y')

        result = [
            {"date": str(index.date()), "close": row['Close']}
            for index, row in hist.iterrows()
        ]

        return jsonify(result)
    except Exception as e:
        return jsonify({"error": str(e)}), 500


# ===========================
# API: SCREENER WITH SCORING
# ===========================
@app.route('/api/screener')
def screener():
    symbols = request.args.getlist('symbols') or ['AAPL', 'MSFT', 'GOOGL', 'AMZN']
    pe_max = float(request.args.get('pe_max', 40.0))
    dividend_min = float(request.args.get('dividend_min', 0.0))
    rsi_max = float(request.args.get('rsi_max', 70.0))

    results = []

    for symbol in symbols:
        try:
            data = cached_stock_data(symbol)
            pe = data.get("pe_ratio")
            div = data.get("dividend_yield") or 0
            rsi = data.get("rsi") or 0

            if (pe is not None and pe <= pe_max and div >= dividend_min and rsi <= rsi_max):
                # Scoring logic (adjust as needed)
                score = (
                    (1 / pe if pe > 0 else 0) * 0.4 +
                    div * 0.3 +
                    (100 - rsi) / 100 * 0.3
                )

                results.append({
                    "symbol": symbol.upper(),
                    "price": data.get("price"),
                    "pe_ratio": pe,
                    "dividend_yield": div,
                    "rsi": rsi,
                    "sector": data.get("sector"),
                    "market_cap": data.get("market_cap"),
                    "score": round(score, 4),
                })
        except Exception as e:
            print(f"[❌] Error processing {symbol}: {e}")
            continue

    # Sort by score descending
    results.sort(key=lambda x: x["score"], reverse=True)

    return jsonify(results)


# ===========================
# SERVER ENTRYPOINT
# ===========================
if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port, debug=False)
