from flask import Flask, jsonify, request, send_from_directory
from flask_cors import CORS
from services import get_full_stock_data
import os
import yfinance as yf
import pandas as pd
from functools import lru_cache

app = Flask(__name__, static_folder='../actinovate-frontend-main/dist', static_url_path='/')
CORS(app)

# ===========================
# UTILITY: SANITIZE DATA
# ===========================
def convert_timestamps(obj):
    if isinstance(obj, dict):
        return {str(k): convert_timestamps(v) for k, v in obj.items()}
    elif isinstance(obj, list):
        return [convert_timestamps(item) for item in obj]
    elif isinstance(obj, pd.Timestamp):
        return str(obj)
    return obj


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
# API: MOCK PORTFOLIO DATA
# ===========================
@app.route('/api/portfolio')
def get_portfolio():
    mock_portfolio = [
        {
            "symbol": "AAPL",
            "name": "Apple Inc.",
            "shares": 25,
            "avg_price": 145.75,
            "current_price": 185.92,
            "total_value": 4648.00,
            "profit_loss": 1004.25,
            "profit_loss_percent": 27.56
        },
        {
            "symbol": "MSFT",
            "name": "Microsoft Corporation",
            "shares": 15,
            "avg_price": 235.45,
            "current_price": 328.79,
            "total_value": 4931.85,
            "profit_loss": 1400.10,
            "profit_loss_percent": 39.64
        },
        {
            "symbol": "GOOGL",
            "name": "Alphabet Inc.",
            "shares": 10,
            "avg_price": 1290.35,
            "current_price": 1450.16,
            "total_value": 14501.60,
            "profit_loss": 1598.10,
            "profit_loss_percent": 12.38
        },
        {
            "symbol": "AMZN",
            "name": "Amazon.com, Inc.",
            "shares": 8,
            "avg_price": 2860.75,
            "current_price": 3120.50,
            "total_value": 24964.00,
            "profit_loss": 2078.00,
            "profit_loss_percent": 9.08
        },
        {
            "symbol": "TSLA",
            "name": "Tesla, Inc.",
            "shares": 20,
            "avg_price": 235.65,
            "current_price": 273.58,
            "total_value": 5471.60,
            "profit_loss": 758.60,
            "profit_loss_percent": 16.09
        },
        {
            "symbol": "NVDA",
            "name": "NVIDIA Corporation",
            "shares": 12,
            "avg_price": 210.25,
            "current_price": 435.10,
            "total_value": 5221.20,
            "profit_loss": 2698.20,
            "profit_loss_percent": 106.94
        },
        {
            "symbol": "META",
            "name": "Meta Platforms, Inc.",
            "shares": 18,
            "avg_price": 195.72,
            "current_price": 297.80,
            "total_value": 5360.40,
            "profit_loss": 1837.44,
            "profit_loss_percent": 52.16
        }
    ]

    portfolio_summary = {
        "total_value": 35133.28,
        "total_profit_loss": 7451.44,
        "day_change": 523.80
    }

    return jsonify({
        "portfolio": mock_portfolio,
        "summary": portfolio_summary
    })


# ===========================
# API: SINGLE STOCK DATA
# ===========================
@app.route('/api/financial-data')
def financial_data():
    symbol = request.args.get('symbol', 'AAPL')
    data = cached_stock_data(symbol)
    cleaned_data = convert_timestamps(data)
    return jsonify(cleaned_data)


# ===========================
# API: HISTORICAL DATA
# ===========================
@app.route('/api/history/<symbol>')
def stock_history(symbol):
    try:
        stock = yf.Ticker(symbol.upper())
        hist = stock.history(period='6mo')

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

    results.sort(key=lambda x: x["score"], reverse=True)
    return jsonify(results)


# ===========================
# SERVER ENTRYPOINT
# ===========================
if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port, debug=False)

