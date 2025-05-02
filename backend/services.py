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

def safe_float(value):
    try:
        return float(value)
    except (TypeError, ValueError):
        return None


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
            "price": safe_float(price),
            "pe_ratio": safe_float(overview_resp.get("PERatio")),
            "eps": safe_float(overview_resp.get("EPS")),
            "dividend_yield": safe_float(overview_resp.get("DividendYield")),
            "sector": overview_resp.get("Sector"),
            "industry": overview_resp.get("Industry"),
            "market_cap": safe_float(overview_resp.get("MarketCapitalization")),
            "revenue": safe_float(overview_resp.get("RevenueTTM")),
            "net_profit": safe_float(overview_resp.get("NetIncomeTTM")),
            "eps_growth_yoy": safe_float(overview_resp.get("QuarterlyEarningsGrowthYOY")),
            "revenue_growth_yoy": safe_float(overview_resp.get("QuarterlyRevenueGrowthYOY")),
            "price_to_sales": safe_float(overview_resp.get("PriceToSalesTrailing12Months")),
            "price_to_book": safe_float(overview_resp.get("PriceToBook")),
            "price_to_cash_flow": safe_float(overview_resp.get("EnterpriseToEbitda")),
            "beta": safe_float(overview_resp.get("Beta"))
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
            "sma_10": safe_float(sma.get(latest_date, {}).get("SMA")) if latest_date else None,
            "rsi": safe_float(rsi.get(latest_date, {}).get("RSI")) if latest_date else None,
            "momentum": safe_float(momentum.get(latest_date, {}).get("MOM")) if latest_date else None,
        }

    except Exception as e:
        print(f"[AlphaVantage] Failed to fetch {symbol}: {e}")
        traceback.print_exc()
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
        hist = ticker.history(period="5y")

        hist['SMA_10'] = hist['Close'].rolling(window=10).mean()
        hist['SMA_50'] = hist['Close'].rolling(window=50).mean()

        sma_10 = hist['SMA_10'].iloc[-1]
        sma_20 = hist['Close'].rolling(window=20).mean().iloc[-1]
        sma_50 = hist['SMA_50'].iloc[-1]
        sma_200 = hist['Close'].rolling(window=200).mean().iloc[-1]

        rsi = None
        if not hist.empty:
            delta = hist['Close'].diff()
            gain = (delta.where(delta > 0, 0)).rolling(window=14).mean()
            loss = (-delta.where(delta < 0, 0)).rolling(window=14).mean()
            rs = gain / loss
            rsi = 100 - (100 / (1 + rs))
            rsi = rsi.iloc[-1]

        macd = None
        macd_signal = None
        if not hist.empty:
            exp1 = hist['Close'].ewm(span=12, adjust=False).mean()
            exp2 = hist['Close'].ewm(span=26, adjust=False).mean()
            macd = exp1 - exp2
            macd_signal = macd.ewm(span=9, adjust=False).mean()
            macd = macd.iloc[-1]
            macd_signal = macd_signal.iloc[-1]

        momentum = None
        if len(hist) >= 6:
            momentum = ((hist['Close'].iloc[-1] - hist['Close'].iloc[-6]) / hist['Close'].iloc[-6]) * 100

        volatility_30d = None
        if len(hist) >= 30:
            volatility_30d = hist['Close'].pct_change().rolling(window=30).std().iloc[-1] * 100

        growth_metrics = {}
        try:
            financials = ticker.financials
            revenues = financials.loc['Total Revenue']
            available_years = revenues.index.year.tolist()
            for i in range(1, min(4, len(revenues))):
                prev_rev = revenues[i]
                curr_rev = revenues[i - 1]
                growth_rate = ((curr_rev - prev_rev) / prev_rev) * 100
                growth_metrics[f"Revenue Growth YoY ({available_years[i - 1]} vs {available_years[i]})"] = round(growth_rate, 2)
        except Exception as e:
            growth_metrics = {}

        # Safe getters with fallbacks
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
            "market_cap": info.get("marketCap") or fast_info.get("market_cap"),
            "sector": info.get("sector"),
            "industry": info.get("industry"),
            "pe_ratio": info.get("trailingPE"),
            "dividend_yield": round(ticker.info.get("dividendYield", 0) * 100, 2) if info.get("dividendYield") else None,
            "eps": info.get("trailingEps"),
            "beta": info.get("beta"),
            "relative_volume": relative_volume,
            "rsi": round(rsi, 2) if rsi else None,
            "macd": round(macd, 2) if macd else None,
            "macd_signal": round(macd_signal, 2) if macd_signal else None,
            "momentum": round(momentum, 2) if momentum else None,
            "volatility_30d": round(volatility_30d, 2) if volatility_30d else None,
            "gross_profits": info.get("grossProfits"),
            "trailingPE": info.get("trailingPE"),
            "forwardPE": info.get("forwardPE"),
            "pegRatio": info.get("pegRatio"),
            "priceToBook": info.get("priceToBook"),
            "returnOnEquity": info.get("returnOnEquity"),
            "totalRevenue": info.get("totalRevenue"),
            "netIncomeToCommon": info.get("netIncomeToCommon"),
            "profitMargins": round(ticker.info.get("profitMargins", 0) * 100, 2) if info.get("profitMargins") else None,
            "sma_10": round(sma_10, 2),
            "sma_20": round(sma_20, 2),
            "sma_50": round(sma_50, 2),
            "sma_200": round(sma_200, 2),
            "balance_sheet": getattr(ticker, "balance_sheet", None).to_dict() if hasattr(ticker, "balance_sheet") else None,
            "financials": getattr(ticker, "financials", None).to_dict() if hasattr(ticker, "financials") else None,
            "cashflow": getattr(ticker, "cashflow", None).to_dict() if hasattr(ticker, "cashflow") else None,
            "officers": info.get("companyOfficers"),
            "summary": info.get("longBusinessSummary"),
            "website": info.get("website"),
            "growth_metrics": growth_metrics
        }

    except Exception as e:
        print(f"Error in get_stock_data for {symbol}: {e}")
        traceback.print_exc()
        return {}


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


def get_from_polygon(symbol):
    return {}


def smart_merge(*sources):
    result = {}
    for source in sources:
        for k, v in source.items():
            if k not in result or result[k] is None:
                result[k] = v
    return result


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


def get_news_headlines(symbol):
    try:
        return news.get_yf_rss(symbol)
    except Exception as e:
        print(f"Error fetching news for {symbol}: {e}")
        return []

