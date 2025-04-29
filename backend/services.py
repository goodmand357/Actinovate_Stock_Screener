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

def get_from_yahoo(symbol):
    try:
        ticker = yf.Ticker(symbol)
        info = ticker.info

        # Pull historical data if needed
        history = ticker.history(period="1d")
        price = info.get("regularMarketPrice") or info.get("currentPrice")

        return {
            "name": info.get("longName") or info.get("shortName") or info.get("displayName"),
            "summary": info.get("longBusinessSummary"),
            "sector": info.get("sector"),
            "industry": info.get("industry"),
            "website": info.get("website"),
            "founded": info.get("firstTradeDateMilliseconds"),
            "full_time_employees": info.get("fullTimeEmployees"),
            "officers": info.get("companyOfficers"),

            # Pricing & Volume
            "price": price,
            "previous_close": info.get("previousClose"),
            "volume": info.get("volume"),
            "market_cap": info.get("marketCap"),

            # Financial Ratios
            "pe_ratio": info.get("trailingPE"),
            "eps": info.get("trailingEps"),
            "dividend_yield": info.get("dividendYield"),
            "price_to_sales": info.get("priceToSalesTrailing12Months"),
            "price_to_book": info.get("priceToBook"),

            # Growth / Profitability
            "revenue": info.get("totalRevenue"),
            "net_profit": info.get("netIncomeToCommon"),
            "profit_margin": info.get("profitMargins"),
            "return_on_assets": info.get("returnOnAssets"),
            "return_on_equity": info.get("returnOnEquity"),
            "revenue_growth_yoy": info.get("revenueGrowth"),
            "eps_growth_yoy": info.get("earningsQuarterlyGrowth"),

            # Liquidity
            "current_ratio": info.get("currentRatio"),
            "quick_ratio": info.get("quickRatio"),

            # Momentum
            "beta": info.get("beta"),
            "sma_10": None,  # calculated elsewhere
            "sma_200": info.get("twoHundredDayAverage"),
            "momentum": None,  # add from tech indicators

            "ticker": symbol.upper()
        }
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
    yahoo_data = get_from_yahoo(symbol)
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

if __name__ == "__main__":
    symbol = "AAPL"
    stock_data = get_full_stock_data(symbol)
    for key, val in stock_data.items():
        print(f"{key}: {val}")
