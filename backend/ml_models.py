import pandas as pd
import numpy as np
import yfinance as yf
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report, confusion_matrix

def fetch_data(symbol: str = "AAPL", start="2020-01-01"):
    df = yf.download(symbol, start=start)
    df['SMA_10'] = df['Adj Close'].rolling(window=10).mean()
    df['SMA_50'] = df['Adj Close'].rolling(window=50).mean()
    df['RSI'] = df['Adj Close'].pct_change().rolling(14).apply(
        lambda x: (x[x > 0].sum() / abs(x).sum()) * 100 if abs(x).sum() != 0 else 50
    )
    df['Momentum_5'] = df['Adj Close'].pct_change(5)
    df['Volatility_20'] = df['Adj Close'].pct_change().rolling(20).std()
    df['Target'] = (df['Adj Close'].shift(-5) > df['Adj Close']).astype(int)
    df.dropna(inplace=True)
    return df

def train_random_forest(df: pd.DataFrame):
    features = ['SMA_10', 'SMA_50', 'RSI', 'Momentum_5', 'Volatility_20']
    X = df[features]
    y = df['Target']
    dates = df.index

    X_train, X_test, y_train, y_test, dates_train, dates_test = train_test_split(
        X, y, dates, test_size=0.2, shuffle=False
    )

    rf = RandomForestClassifier(n_estimators=100, max_depth=5, random_state=42, class_weight='balanced')
    rf.fit(X_train, y_train)
    y_pred = rf.predict(X_test)

    metrics = classification_report(y_test, y_pred, output_dict=True)
    cmatrix = confusion_matrix(y_test, y_pred)

    return {
        "model": rf,
        "report": metrics,
        "confusion_matrix": cmatrix,
        "features": features,
        "dates_test": dates_test,
        "y_test": y_test,
        "y_pred": y_pred
    }

# Example usage
if __name__ == "__main__":
    df = fetch_data("AAPL")
    results = train_random_forest(df)
    print("Classification Report:")
    print(results["report"])
  
