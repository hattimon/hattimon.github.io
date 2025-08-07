// Translation dictionary
const translations = {
    "title": {
        "en": "Helium (HNT) Dashboard",
        "pl": "Panel Helium (HNT)"
    },
    "price-chart": {
        "en": "HNT Price Chart",
        "pl": "Wykres cen HNT"
    },
    "halving-info": {
        "en": "Halving Information",
        "pl": "Informacje o halvingu"
    },
    "current-stage": {
        "en": "Current emission stage:",
        "pl": "Aktualny etap emisji:"
    },
    "last-halving": {
        "en": "Last halving:",
        "pl": "Ostatni halving:"
    },
    "next-halving": {
        "en": "Next halving:",
        "pl": "Następny halving:"
    },
    "current-price": {
        "en": "Current price:",
        "pl": "Aktualna cena:"
    },
    "market-cap": {
        "en": "Market cap:",
        "pl": "Kapitalizacja:"
    },
    "circulating": {
        "en": "Circulating supply:",
        "pl": "Podaż w obiegu:"
    },
    "max-supply": {
        "en": "Max supply:",
        "pl": "Maksymalna podaż:"
    },
    "consensus": {
        "en": "Consensus:",
        "pl": "Konsensus:"
    },
    "rewards": {
        "en": "Rewards for coverage and data transmission",
        "pl": "Nagrody za pokrycie i transmisję danych"
    },
    "halving-history": {
        "en": "Halving History",
        "pl": "Historia halvingów"
    },
    "reward-history": {
        "en": "Block Reward History",
        "pl": "Historia nagród blokowych"
    }
};

// Current language
let currentLanguage = 'en';

// DOM elements
const languageToggle = document.getElementById('language-toggle');
const soundToggle = document.getElementById('sound-toggle');
const bgMusic = document.getElementById('bg-music');
const priceChartCtx = document.getElementById('priceChart').getContext('2d');

// Chart instance
let priceChart;

// Initialize the dashboard
function initDashboard() {
    // Set up event listeners
    languageToggle.addEventListener('click', toggleLanguage);
    soundToggle.addEventListener('click', toggleSound);
    
    // Start background music
    bgMusic.volume = 0.3;
    bgMusic.play().catch(e => console.log("Autoplay prevented:", e));
    
    // Initialize chart
    initChart();
    
    // Start data updates
    updateData();
    setInterval(updateData, 60000); // Update every minute
    
    // Start countdown timers
    updateCountdowns();
    setInterval(updateCountdowns, 1000); // Update every second
}

// Toggle between English and Polish
function toggleLanguage() {
    currentLanguage = currentLanguage === 'en' ? 'pl' : 'en';
    languageToggle.textContent = currentLanguage === 'en' ? 'PL' : 'EN';
    applyTranslations();
    
    // Update moment.js locale for date formatting
    moment.locale(currentLanguage);
}

// Apply translations to all elements with data-translate attribute
function applyTranslations() {
    document.querySelectorAll('[data-translate]').forEach(element => {
        const key = element.getAttribute('data-translate');
        if (translations[key]) {
            element.textContent = translations[key][currentLanguage];
        }
    });
}

// Toggle background music
function toggleSound() {
    if (bgMusic.paused) {
        bgMusic.play();
        soundToggle.textContent = '🔊';
    } else {
        bgMusic.pause();
        soundToggle.textContent = '🔇';
    }
}

// Initialize the price chart
function initChart() {
    priceChart = new Chart(priceChartCtx, {
        type: 'line',
        data: {
            labels: [],
            datasets: [{
                label: 'HNT Price (USD)',
                data: [],
                borderColor: '#29abe2',
                backgroundColor: 'rgba(41, 171, 226, 0.1)',
                borderWidth: 2,
                fill: true,
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: false,
                    title: {
                        display: true,
                        text: 'Price (USD)'
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: 'Date'
                    }
                }
            },
            plugins: {
                legend: {
                    position: 'top',
                },
                tooltip: {
                    mode: 'index',
                    intersect: false,
                }
            }
        }
    });
}

// Update chart with new data
function updateChart(data) {
    // Format data for Chart.js
    const labels = data.prices.map(entry => moment(entry[0]).format('YYYY-MM-DD'));
    const prices = data.prices.map(entry => entry[1]);
    
    priceChart.data.labels = labels;
    priceChart.data.datasets[0].data = prices;
    priceChart.update();
    
    // Update current price display
    const currentPrice = prices[prices.length - 1];
    document.getElementById('current-price').textContent = `${currentPrice.toFixed(2)} USD`;
    
    // Update market cap (circulating supply * price)
    const circulatingSupply = 186011619;
    const marketCap = (circulatingSupply * currentPrice).toLocaleString('en-US', {
        style: 'currency',
        currency: 'USD',
        maximumFractionDigits: 0
    });
    document.getElementById('market-cap').textContent = marketCap;
}

// Fetch data from CoinGecko API
async function updateData() {
    try {
        // In a real implementation, you would fetch from CoinGecko API:
        // const response = await fetch('https://api.coingecko.com/api/v3/coins/helium/market_chart?vs_currency=usd&days=max');
        // const data = await response.json();
        
        // For demo purposes, we'll use mock data
        const mockData = generateMockData();
        updateChart(mockData);
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

// Update countdown timers
function updateCountdowns() {
    const lastHalvingDate = moment('2025-08-01');
    const nextHalvingDate = moment('2027-08-01');
    const now = moment();
    
    // Time since last halving
    const durationSince = moment.duration(now.diff(lastHalvingDate));
    const sinceText = `${durationSince.days()}d ${durationSince.hours()}h ${durationSince.minutes()}m ${durationSince.seconds()}s`;
    document.getElementById('time-since-halving').textContent = sinceText;
    
    // Time to next halving
    const durationTo = moment.duration(nextHalvingDate.diff(now));
    const toText = `${durationTo.days()}d ${durationTo.hours()}h ${durationTo.minutes()}m ${durationTo.seconds()}s`;
    document.getElementById('time-to-halving').textContent = toText;
}

// Generate mock data for demonstration
function generateMockData() {
    const prices = [];
    const now = Date.now();
    const twoYearsAgo = now - (2 * 365 * 24 * 60 * 60 * 1000);
    
    // Generate data points for the last 2 years
    for (let time = twoYearsAgo; time <= now; time += 24 * 60 * 60 * 1000) {
        // Simulate price fluctuations
        const basePrice = 2.0;
        const fluctuation = Math.sin((time - twoYearsAgo) / (365 * 24 * 60 * 60 * 1000) * Math.PI * 2) * 1.5;
        const randomFactor = 0.2 * Math.random();
        const price = basePrice + fluctuation + randomFactor;
        
        prices.push([time, price]);
    }
    
    return { prices };
}

// Initialize the dashboard when the page loads
window.addEventListener('DOMContentLoaded', initDashboard);
