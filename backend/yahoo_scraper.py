import requests
from bs4 import BeautifulSoup

def scrape_yahoo_news(ticker):
    url = f"https://finance.yahoo.com/quote/{ticker}?p={ticker}"
    headers = {"User-Agent": "Mozilla/5.0"}

    try:
        response = requests.get(url, headers=headers)
        soup = BeautifulSoup(response.text, "html.parser")

        news_items = []
        for item in soup.select("section[data-test-locator='mega'] li"):
            headline = item.get_text(strip=True)
            if headline:
                news_items.append(headline)

        return {"news_headlines": news_items[:5]}  # Limit to 5
    except Exception as e:
        print(f"Scraper error: {e}")
        return {"news_headlines": []}
