# TradingView Multi-Interval Chart

A web application displaying a TradingView chart with multi-interval candle overlays, RSI, and Stochastic Oscillator indicators. The chart supports dark/light themes, responsive design for mobile and desktop, and manual interval selection.

## Features
- **Multi-Interval Candles**: Displays up to three higher time frame candles (e.g., H4 → D1, W1, MN) with decreasing transparency (0.7, 0.5, 0.3).
- **Intervals Supported**: M1, M5, M15, H1, H4, D1, W1, MN, Y1.
- **Indicators**: RSI (top, 1/8 height) and Stochastic Oscillator (bottom, 1/8 height), resizable via drag.
- **Themes**: Toggle between dark and light modes.
- **Responsive Design**: Adapts to mobile and desktop screens.
- **TradingView Integration**: Uses the lightweight TradingView widget (`tv.js`) with all standard tools (zoom, crosshair, etc.).

## Setup
1. Clone the repository:
   ```bash
   git clone https://github.com/<your-username>/tradingview-multi-interval.git


Open index.html in a modern browser (e.g., Chrome, Firefox).
Ensure an internet connection for loading tv.js and Tailwind CSS via CDN.

Project Structure
tradingview-multi-interval/
├── index.html           # Main HTML file
├── css/
│   └── styles.css       # Custom CSS with responsive styles
├── js/
│   └── script.js        # JavaScript logic for chart initialization
├── README.md            # Project documentation
├── .gitignore           # Git ignore file
└── LICENSE              # MIT License

Limitations

The lightweight TradingView widget (tv.js) does not support custom overlays or advanced APIs. Multi-interval candles are simulated using multiple widget instances.
Interval changes are handled via a custom dropdown due to the lack of event APIs in tv.js.
For advanced features (e.g., custom overlays, event subscriptions), use the full TradingView Charting Library (requires a license).

Development

To extend functionality, consider integrating the full TradingView Charting Library for proper overlay support and event handling.
Add error handling for network failures when loading tv.js or Tailwind CSS.
Test on various devices to ensure responsiveness.

License
MIT License. See LICENSE for details.```
