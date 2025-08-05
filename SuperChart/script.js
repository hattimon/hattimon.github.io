```javascript
// Interval mapping for higher time frames
const intervalMap = {
    "1": ["5", "15", "60"], // M1 -> M5, M15, H1
    "5": ["15", "60", "240"], // M5 -> M15, H1, H4
    "15": ["60", "240", "D"], // M15 -> H1, H4, D1
    "60": ["240", "D", "W"], // H1 -> H4, D1, W1
    "240": ["D", "W", "M"], // H4 -> D1, W1, MN
    "D": ["W", "M", "12M"], // D1 -> W1, MN, Y1
    "W": ["M", "12M"], // W1 -> MN, Y1
    "M": ["12M"], // MN -> Y1
    "12M": [] // Y1 -> No higher intervals
};

// Widget initialization function
function createWidget(containerId, interval, theme, studies = [], zIndex = 0) {
    return new TradingView.widget({
        container_id: containerId,
        width: "100%",
        height: "100%",
        symbol: "BINANCE:BTCUSDT",
        interval: interval,
        timezone: "Etc/UTC",
        theme: theme,
        style: "1", // Candlestick style
        locale: "en",
        toolbar_bg: "#f1f3f6",
        enable_publishing: false,
        allow_symbol_change: containerId === "main-chart",
        studies: studies,
        autosize: true,
        overrides: {
            "mainSeriesProperties.candleStyle.drawWick": containerId === "main-chart",
            "mainSeriesProperties.candleStyle.drawBorder": containerId === "main-chart"
        },
        zIndex: zIndex
    });
}

// Theme toggle
let currentTheme = "dark";
let widgets = [];

document.getElementById("theme-toggle").addEventListener("click", () => {
    currentTheme = currentTheme === "dark" ? "light" : "dark";
    document.body.classList.toggle("light-theme");
    widgets.forEach(widget => {
        try {
            widget.applyOverrides({ theme: currentTheme });
        } catch (error) {
            console.error(`Failed to apply theme to widget: ${error.message}`);
        }
    });
});

// Initialize charts
function initializeCharts(interval) {
    widgets = [];
    document.getElementById("main-chart").innerHTML = `
        <div id="overlay-chart-1"></div>
        <div id="overlay-chart-2"></div>
        <div id="overlay-chart-3"></div>
    `;

    // Main chart with RSI and Stochastic
    const mainWidget = createWidget("main-chart", interval, currentTheme, [
        { id: "Relative Strength Index", inputs: [14], styles: { "plot_0": { color: "#7e57c2", linewidth: 2 } }, container: "rsi-container" },
        { id: "Stochastic", inputs: [14, 3, 3], styles: { "%K": { color: "#26a69a", linewidth: 2 }, "%D": { color: "#ff6d00", linewidth: 2 } }, container: "stoch-container" }
    ], 1);
    widgets.push(mainWidget);

    // Overlay charts for higher intervals
    const intervals = intervalMap[interval] || [];
    intervals.forEach((int, index) => {
        const containerId = `overlay-chart-${index + 1}`;
        const overlayWidget = createWidget(containerId, int, currentTheme, [], index + 2);
        widgets.push(overlayWidget);
    });
}

// Polling to check if widgets are ready
function waitForWidgetsReady(callback) {
    if (widgets.length > 0 && widgets.every(w => w)) {
        callback();
    } else {
        setTimeout(() => waitForWidgetsReady(callback), 100);
    }
}

// Handle interval changes
const intervalSelector = document.getElementById("interval-selector");
intervalSelector.addEventListener("change", (e) => {
    const newInterval = e.target.value;
    initializeCharts(newInterval);
});

// Initialize with default H4 interval
initializeCharts("240");

// Handle window resize
window.addEventListener("resize", () => {
    waitForWidgetsReady(() => {
        widgets.forEach(widget => {
            try {
                widget.applyOverrides({
                    width: window.innerWidth,
                    height: window.innerHeight * 0.75 // Adjust for RSI and Stoch panels
                });
            } catch (error) {
                console.error(`Failed to resize widget: ${error.message}`);
            }
        });
    });
});
```
