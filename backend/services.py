from yahoo_scraper import scrape_yahoo_news
import requests
import yfinance as yf
import config

# ============================
# Alpha Vantage as Primary Source
# ============================
def get_from_alpha_vantage(symbol):
    base_url = config.ALPHA_VANTAGE_BASE_URL
    api_key = config.ALPHA_VANTAGE_API_KEY

    try:
        # Price
        price_url = f"{base_url}?function=GLOBAL_QUOTE&symbol={symbol}&apikey={api_key}"
        price_resp = requests.get(price_url).json()
        price = price_resp.get("Global Quote", {}).get("05. price")

        # Overview
        overview_url = f"{base_url}?function=OVERVIEW&symbol={symbol}&apikey={api_key}"
        overview_resp = requests.get(overview_url).json()

        return {
            "price": float(price) if price else None,
            "pe_ratio": float(overview_resp.get("PERatio", 0)) or None,
            "eps": float(overview_resp.get("EPS", 0)) or None,
            "dividend_yield": float(overview_resp.get("DividendYield", 0)) or None,
            "sector": overview_resp.get("Sector"),
            "industry": overview_resp.get("Industry"),
            "market_cap": float(overview_resp.get("MarketCapitalization", 0)) or None,
            "revenue": float(overview_resp.get("RevenueTTM", 0)) or None,
            "net_profit": float(overview_resp.get("NetIncomeTTM", 0)) or None,
            "eps_growth_yoy": float(overview_resp.get("QuarterlyEarningsGrowthYOY", 0)) or None,
            "revenue_growth_yoy": float(overview_resp.get("QuarterlyRevenueGrowthYOY", 0)) or None,
        }
    except:
        return {}

# ============================
# Technical Indicators from Alpha Vantage
# ============================
def get_technical_indicators(symbol):
    base_url = config.ALPHA_VANTAGE_BASE_URL
    api_key = config.ALPHA_VANTAGE_API_KEY
    interval = "daily"

    def get_indicator(function):
        url = f"{base_url}?function={function}&symbol={symbol}&interval={interval}&time_period=10&series_type=close&apikey={api_key}"
        resp = requests.get(url).json()
        return resp.get("Technical Analysis: Daily", {})

    try:
        sma = get_indicator("SMA")
        rsi = get_indicator("RSI")
        momentum = get_indicator("MOM")
        latest_date = next(iter(sma), None)

        return {
            "sma_10": float(sma.get(latest_date, {}).get("SMA", 0)) if latest_date else None,
            "rsi": float(rsi.get(latest_date, {}).get("RSI", 0)) if latest_date else None,
            "momentum": float(momentum.get(latest_date, {}).get("MOM", 0)) if latest_date else None,
        }
    except:
        return {}

# ============================
# Fallback: Yahoo Finance via yfinance
# ============================
import yfinance as yf

def get_stock_data(symbol):
    try:
        ticker = yf.Ticker(symbol)
        info = ticker.info
        fast_info = ticker.fast_info
        history = ticker.history(period="6mo")

        # Safe getters with fallbacks
        price = info.get("currentPrice") or fast_info.get("last_price")
        previous_close = info.get("previousClose") or fast_info.get("previous_close", 0)
        change = price - previous_close if price and previous_close else 0
        percent_change = (change / previous_close * 100) if previous_close else 0

        # Stocks tab fields
        stock = {
            "ticker": symbol,
            "name": info.get("longName") or info.get("shortName") or info.get("displayName") or "N/A",
            "price": round(price, 2) if price else None,
            "change": round(change, 2),
            "change_percent": round(percent_change, 2),
            "volume": info.get("volume") or fast_info.get("volume") or 0,
            "market_cap": info.get("marketCap") or fast_info.get("market_cap") or 0,
        }

        # Additional metrics for other tabs
        stock.update({
            "sector": info.get("sector"),
            "industry": info.get("industry"),
            "summary": info.get("longBusinessSummary"),
            "website": info.get("website"),
            "founded": info.get("firstTradeDateEpochUtc"),
            "pe_ratio": info.get("trailingPE"),
            "dividend_yield": round(info.get("dividendYield", 0) * 100, 2) if info.get("dividendYield") else None,
            "eps": info.get("trailingEps"),
            "rsi": None,  # Add later if calculated manually
            "sma_10": None,
            "sma_20": None,
            "sma_50": None,
            "sma_200": info.get("twoHundredDayAverage"),
            "balance_sheet": ticker.balance_sheet.to_dict(),
            "financials": ticker.financials.to_dict(),
            "cashflow": ticker.cashflow.to_dict(),
            "officers": info.get("companyOfficers"),
        })

        return stock

    except Exception as e:
        print(f"Error in get_from_yahoo for {symbol}: {e}")
        return {}
        
# ============================
# Finnhub API fallback
# ============================
def get_from_finnhub(symbol):
    api_key = config.FINNHUB_API_KEY
    base_url = config.FINNHUB_BASE_URL

    eps_trend_url = f"{base_url}/stock/earnings?symbol={symbol}&token={api_key}"
    recommendation_url = f"{base_url}/stock/recommendation?symbol={symbol}&token={api_key}"

    eps_trend = []
    recommendation = {}

    try:
        eps_resp = requests.get(eps_trend_url).json()
        if isinstance(eps_resp, list):
            eps_trend = eps_resp[:3]  # Limit to last 3 quarters
    except:
        pass

    try:
        rec_resp = requests.get(recommendation_url).json()
        if isinstance(rec_resp, list) and rec_resp:
            recommendation = rec_resp[0]  # Latest
    except:
        pass

    return {
        "eps_trend": eps_trend,
        "recommendation": recommendation,
    }

# ============================
# Polygon API placeholder
# ============================
def get_from_polygon(symbol):
    return {}

# ============================
# Utility: Smart Merge
# ============================
def smart_merge(*sources):
    result = {}
    for source in sources:
        for k, v in source.items():
            if k not in result or result[k] is None:
                result[k] = v
    return result

# ============================
# Final Aggregator
# ============================
def get_full_stock_data(symbol):
    yahoo_data = get_stock_data(symbol)  # <-- Fix here
    alpha_data = get_from_alpha_vantage(symbol)
    tech_data = get_technical_indicators(symbol)
    finnhub_data = get_from_finnhub(symbol)
    polygon_data = get_from_polygon(symbol)

    return smart_merge(
        yahoo_data,
        alpha_data,
        tech_data,
        finnhub_data,
        polygon_data,
        {"ticker": symbol.upper()}
    )
