from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import os

# Import your service function(s)
from services import get_full_stock_data
from stock_data import get_financial_data  # optional, if you're using it

app = Flask(__name__, static_folder="../actinovate-frontend-main/dist", static_url_path="/")
CORS(app)

@app.route("/")
def index():
    return send_from_directory(app.static_folder, "index.html")

@app.route("/<path:path>")
def serve_static(path):
    return send_from_directory(app.static_folder, path)

@app.route("/stock", methods=["GET"])
def stock():
    symbol = request.args.get("symbol", "AAPL")
    data = get_full_stock_data(symbol)
    return jsonify(data)

# Optional: Hook in the version from main.py if you're using that too
@app.route("/financials", methods=["GET"])
def financials():
    symbol = request.args.get("symbol", "AAPL")
    data = get_financial_data(symbol)
    return jsonify(data)

if __name__ == "__main__":
    app.run(debug=True)
