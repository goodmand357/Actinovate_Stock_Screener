from yahoo_scraper import scrape_yahoo_news
import requests
import yfinance as yf
import traceback
import config
from ta.momentum import RSIIndicator
from ta.trend import MACD
from yahoo_fin import news
import pandas as pd
import numpy as np

# ============================
# Alpha Vantage as Primary Source
# ============================
def get_from_alpha_vantage(symbol):
    base_url = config.ALPHA_VANTAGE_BASE_URL
    api_key = config.ALPHA_VANTAGE_API_KEY

    try:
        price_url = f"{base_url}?function=GLOBAL_QUOTE&symbol={symbol}&apikey={api_key}"
        price_resp = requests.get(price_url).json()
        price = price_resp.get("Global Quote", {}).get("05. price")

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
            "price_to_sales": float(overview_resp.get("PriceToSalesTrailing12Months", 0)) or None,
            "price_to_book": float(overview_resp.get("PriceToBook", 0)) or None,
            "price_to_cash_flow": float(overview_resp.get("EnterpriseToEbitda", 0)) or None,
            "beta": float(overview_resp.get("Beta", 0)) or None
        }

    except Exception as e:
        print(f"[AlphaVantage] Failed to fetch {symbol}: {e}")
        traceback.print_exc()
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

    except Exception as e:
        print(f"[AlphaVantage] Failed to fetch {symbol}: {e}")
        traceback.print_exc()
        return {}

# ============================
# Yahoo Finance Fallback
# ============================
def get_stock_data(symbol):
    try:
        ticker = yf.Ticker(symbol)
        info = ticker.info
        fast_info = ticker.fast_info
        hist = ticker.history(period="5y")

        hist['SMA_10'] = hist['Close'].rolling(window=10).mean()
        hist['SMA_50'] = hist['Close'].rolling(window=50).mean()
        hist['RSI'] = RSIIndicator(close=hist["Close"], window=14).rsi()
        hist['Momentum_5'] = hist['Close'].pct_change(5)
        hist['Volatility_20'] = hist['Close'].pct_change().rolling(20).std()
        hist['Future_Return'] = hist['Close'].shift(-5) / hist['Close'] - 1
        hist['Target'] = (hist['Future_Return'] > 0).astype(int)
        hist = hist.dropna()

        sma_10 = hist['SMA_10'].iloc[-1]
        sma_20 = hist['Close'].rolling(window=20).mean().iloc[-1]
        sma_50 = hist['SMA_50'].iloc[-1]
        sma_200 = hist['Close'].rolling(window=200).mean().iloc[-1]
        rsi = hist['RSI'].iloc[-1]
        momentum = hist['Momentum_5'].iloc[-1] * 100
        volatility_30d = hist['Volatility_20'].iloc[-1] * 100
        macd = MACD(close=hist["Close"]).macd_signal().iloc[-1]

        price = info.get("currentPrice") or fast_info.get("last_price")
        previous_close = info.get("previousClose") or fast_info.get("previous_close", 0)
        change = price - previous_close if price and previous_close else 0
        percent_change = (change / previous_close * 100) if previous_close else 0
        relative_volume = info.get("averageVolume10days") / info.get("averageVolume") if info.get("averageVolume") else None

        stock = {
            "ticker": symbol,
            "name": info.get("longName") or info.get("shortName") or info.get("displayName") or "N/A",
            "price": round(price, 2) if price else None,
            "change": round(change, 2),
            "change_percent": round(percent_change, 2),
            "volume": info.get("volume") or fast_info.get("volume") or 0,
            "market_cap": info.get("marketCap") or fast_info.get("market_cap") or 0,
            "sector": info.get("sector"),
            "industry": info.get("industry"),
            "summary": info.get("longBusinessSummary"),
            "website": info.get("website"),
            "pe_ratio": info.get("trailingPE"),
            "dividend_yield": round(info.get("dividendYield", 0) * 100, 2) if info.get("dividendYield") else None,
            "eps": info.get("trailingEps"),
            "beta": info.get("beta"),
            "relative_volume": relative_volume,
            "rsi": round(rsi, 2),
            "macd_signal": round(macd, 2),
            "momentum": round(momentum, 2),
            "volatility_30d": round(volatility_30d, 2),
            "sma_10": round(sma_10, 2),
            "sma_20": round(sma_20, 2),
            "sma_50": round(sma_50, 2),
            "sma_200": round(sma_200, 2),
            "balance_sheet": getattr(ticker, "balance_sheet", None).to_dict() if hasattr(ticker, "balance_sheet") else None,
            "financials": getattr(ticker, "financials", None).to_dict() if hasattr(ticker, "financials") else None,
            "cashflow": getattr(ticker, "cashflow", None).to_dict() if hasattr(ticker, "cashflow") else None,
            "officers": info.get("companyOfficers"),
        }

        # Revenue Growth Calculations
        revenue_growth = {}
        try:
            financials = stock.get("financials", {})
            if financials:
                revs = [(pd.to_datetime(date).year, report.get("Total Revenue")) for date, report in financials.items() if report.get("Total Revenue")]
                revs.sort(reverse=True)
                for i in range(1, min(4, len(revs))):
                    prev = revs[i][1]
                    curr = revs[i - 1][1]
                    if prev:
                        growth = ((curr - prev) / prev) * 100
                        revenue_growth[f"revenue_growth_y{i}"] = round(growth, 2)
        except Exception as e:
            print("Error calculating YoY revenue growth:", e)

        stock.update(revenue_growth)

        return stock

    except Exception as e:
        print(f"Error in get_stock_data for {symbol}: {e}")
        traceback.print_exc()
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
            eps_trend = eps_resp[:3]
    except:
        pass

    try:
        rec_resp = requests.get(recommendation_url).json()
        if isinstance(rec_resp, list) and rec_resp:
            recommendation = rec_resp[0]
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
    yahoo_data = get_stock_data(symbol)
    alpha_data = get_from_alpha_vantage(symbol)
    tech_data = get_technical_indicators(symbol)
    finnhub_data = get_from_finnhub(symbol)
    polygon_data = get_from_polygon(symbol)
    news_data = get_news_headlines(symbol)

    return smart_merge(
        yahoo_data,
        alpha_data,
        tech_data,
        finnhub_data,
        polygon_data,
        {"ticker": symbol.upper(), "news": news_data}
    )

# ============================
# News Headlines
# ============================
def get_news_headlines(symbol):
    try:
        return news.get_yf_rss(symbol)
    except Exception as e:
        print(f"Error fetching news for {symbol}: {e}")
        return []

