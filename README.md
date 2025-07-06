# 📈 Quant Trader Technical Analysis Agent

An AI-powered web application that performs **real-time technical analysis** on cryptocurrency charts using OHLCV data and natural language insights.

## 🚀 Overview

This project simplifies trading decisions by fetching **live crypto market data** and analyzing it using **AI (Gemini via Genkit)** to produce actionable trading insights. The platform helps users—both technical and non-technical—understand market behavior without needing in-depth trading knowledge.

## 🔍 Features

- 📊 Real-time Price & Volume Charting
- 📉 Market Trend Detection
- 🕯️ Candlestick Pattern Analysis
- 💡 CRT (Current Risk & Trend) Assessment
- 🧱 Support & Resistance Identification
- 🚨 Breakout & Breakdown Signal Detection
- 📈 Short-Term Outlook & Entry/Exit Suggestions

## 🧠 Tech Stack

| Category       | Tools Used                                           |
|----------------|------------------------------------------------------|
| Frontend       | Next.js, React, Tailwind CSS, TypeScript            |
| Backend        | Genkit AI (Google Gemini), Firebase Hosting         |
| Data API       | Binance Public OHLCV API                            |
| Visualization  | Recharts, Toast UI                                  |
| DevOps         | Git, GitHub                                          |

## ⚙️ How It Works

1. **User inputs** a crypto symbol (e.g., BTC, ETH)
2. App fetches **real-time OHLCV data** from Binance
3. Data is sent to **Genkit AI** using prompt-engineered flows
4. AI returns insights like trends, patterns, signals
5. Web dashboard **renders charts and detailed analysis**

## 🖥️ Screenshots

_Add screenshots of the app UI and charts here (optional)_

## 📦 Installation

```bash
git clone https://github.com/ranjith-prog/Quant-Trader-Technical-Analysis-Agent.git
cd Quant-Trader-Technical-Analysis-Agent
npm install
npm run dev
