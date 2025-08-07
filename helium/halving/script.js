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
    },
    "last-updated": {
        "en": "Last updated:",
        "pl": "Ostatnia aktualizacja:"
    },
    "update-tooltip": {
        "en": "Data updates every minute",
        "pl": "Dane aktualizowane co minutę"
    }
};

// Initialize with dark mode by default
let currentLanguage = 'en';
let currentTheme = 'dark';

// DOM elements
const themeToggle = document.getElementById('theme-toggle');
const languageToggle = document.getElementById('language-toggle');
const soundToggle = document.getElementById('sound-toggle');
const bgMusic = document.getElementById('bg-music');
const priceChartCtx = document.getElementById('priceChart').getContext('2d');
const chartLoader = document.getElementById('chart-loader');
const lastUpdatedEl = document.getElementById('last-updated');
const chart1mBtn = document.getElementById('chart-1m');
const chart3mBtn = document.getElementById('chart-3m');
const chart1yBtn = document.getElementById('chart-1y');
const chartAllBtn = document.getElementById('chart-all');

// Chart data
let priceChart;
let chartData = {
    all: null,
    '1y': null,
    '3m': null,
    '1m': null
};
let currentChartRange = 'all';

// Initialize dashboard with dark mode
function initDashboard() {
    // Force dark mode on first load
    document.body.classList.add('dark-mode');
    themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
    localStorage.setItem('hnt-theme', 'dark');

    // Load cached data immediately
    loadCachedData();
    
    // Set up event listeners
    themeToggle.addEventListener('click', toggleTheme);
    languageToggle.addEventListener('click', toggleLanguage);
    soundToggle.addEventListener('click', toggleSound);
    
    // Chart controls
    chart1mBtn.addEventListener('click', () => updateChartRange('1m'));
    chart3mBtn.addEventListener('click', () => updateChartRange('3m'));
    chart1yBtn.addEventListener('click', () => updateChartRange('1y'));
    chartAllBtn.addEventListener('click', () => updateChartRange('all'));
    
    // Background music
    bgMusic.volume = 0.3;
    bgMusic.play().catch(e => console.log("Autoplay prevented:", e));
    
    // Initialize chart
    initChart();
    
    // Start data updates
    updateData();
    setInterval(updateData, 60000); // Update every minute
    
    // Update countdowns
    updateCountdowns();
    setInterval(updateCountdowns, 1000);
}

// Load cached data
function loadCachedData() {
    const cachedData = localStorage.getItem('hnt-cached-data');
    const cachedTimestamp = localStorage.getItem('hnt-cached-timestamp');
    
    if (cachedData && cachedTimestamp) {
        const data = JSON.parse(cachedData);
        const timestamp = parseInt(cachedTimestamp);
        updateChart(data, currentChartRange, false);
        updateLastUpdatedText(new Date(timestamp));
        return true;
    }
    return false;
}

// Save data to cache
function saveDataToCache(data) {
    localStorage.setItem('hnt-cached-data', JSON.stringify(data));
    localStorage.setItem('hnt-cached-timestamp', Date.now().toString());
}

// Toggle dark/light mode
function toggleTheme() {
    if (currentTheme === 'light') {
        enableDarkMode();
    } else {
        disableDarkMode();
    }
}

function enableDarkMode() {
    document.body.classList.add('dark-mode');
    themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
    currentTheme = 'dark';
    localStorage.setItem('hnt-theme', 'dark');
    updateChartColors();
}

function disableDarkMode() {
    document.body.classList.remove('dark-mode');
    themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
    currentTheme = 'light';
    localStorage.setItem('hnt-theme', 'light');
    updateChartColors();
}

// Toggle language
function toggleLanguage() {
    currentLanguage = currentLanguage === 'en' ? 'pl' : 'en';
    languageToggle.querySelector('span').textContent = currentLanguage === 'en' ? 'PL' : 'EN';
    applyTranslations();
    localStorage.setItem('hnt-lang', currentLanguage);
    moment.locale(currentLanguage);
    updateLastUpdatedText();
}

// Apply translations
function applyTranslations() {
    document.querySelectorAll('[data-translate]').forEach(element => {
        const key = element.getAttribute('data-translate');
        if (translations[key]) {
            element.textContent = translations[key][currentLanguage];
        }
    });
}

// Toggle sound
function toggleSound() {
    if (bgMusic.paused) {
        bgMusic.play();
        soundToggle.innerHTML = '<i class="fas fa-volume-up"></i>';
    } else {
        bgMusic.pause();
        soundToggle.innerHTML = '<i class="fas fa-volume-mute"></i>';
    }
}

// Initialize chart
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
                tension: 0.1,
                pointRadius: 0,
                pointHoverRadius: 5
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
                        text: 'Price (USD)',
                        color: () => getComputedStyle(document.body).getPropertyValue('--text-color')
                    },
                    grid: {
                        color: () => currentTheme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'
                    },
                    ticks: {
                        color: () => getComputedStyle(document.body).getPropertyValue('--text-color')
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: 'Date',
                        color: () => getComputedStyle(document.body).getPropertyValue('--text-color')
                    },
                    grid: {
                        color: () => currentTheme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'
                    },
                    ticks: {
                        color: () => getComputedStyle(document.body).getPropertyValue('--text-color')
                    }
                }
            },
            plugins: {
                legend: {
                    position: 'top',
                    labels: {
                        color: () => getComputedStyle(document.body).getPropertyValue('--text-color')
                    }
                },
                tooltip: {
                    mode: 'index',
                    intersect: false,
                    backgroundColor: () => currentTheme === 'dark' ? '#1e293b' : '#fff',
                    titleColor: () => currentTheme === 'dark' ? '#29abe2' : '#1a3e72',
                    bodyColor: () => getComputedStyle(document.body).getPropertyValue('--text-color'),
                    borderColor: () => currentTheme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
                    borderWidth: 1
                }
            }
        }
    });
}

// Update chart colors based on theme
function updateChartColors() {
    if (priceChart) {
        priceChart.options.scales.x.ticks.color = getComputedStyle(document.body).getPropertyValue('--text-color');
        priceChart.options.scales.y.ticks.color = getComputedStyle(document.body).getPropertyValue('--text-color');
        priceChart.options.scales.x.title.color = getComputedStyle(document.body).getPropertyValue('--text-color');
        priceChart.options.scales.y.title.color = getComputedStyle(document.body).getPropertyValue('--text-color');
        priceChart.options.scales.x.grid.color = currentTheme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)';
        priceChart.options.scales.y.grid.color = currentTheme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)';
        priceChart.options.plugins.legend.labels.color = getComputedStyle(document.body).getPropertyValue('--text-color');
        priceChart.options.plugins.tooltip.backgroundColor = currentTheme === 'dark' ? '#1e293b' : '#fff';
        priceChart.options.plugins.tooltip.titleColor = currentTheme === 'dark' ? '#29abe2' : '#1a3e72';
        priceChart.options.plugins.tooltip.bodyColor = getComputedStyle(document.body).getPropertyValue('--text-color');
        priceChart.options.plugins.tooltip.borderColor = currentTheme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)';
        priceChart.update();
    }
}

// Update chart data
function updateChart(data, range = 'all', saveCache = true) {
    if (!data?.prices) return;
    
    if (saveCache) saveDataToCache(data);
    
    // Store filtered data
    const now = Date.now();
    chartData = {
        all: data,
        '1y': { prices: data.prices.filter(entry => entry[0] >= now - 365 * 86400000) },
        '3m': { prices: data.prices.filter(entry => entry[0] >= now - 90 * 86400000) },
        '1m': { prices: data.prices.filter(entry => entry[0] >= now - 30 * 86400000) }
    };
    
    updateChartRange(range);
    
    // Update price displays
    const currentPrice = data.prices[data.prices.length - 1][1];
    document.getElementById('current-price').textContent = `${currentPrice.toFixed(2)} USD`;
    
    const marketCap = (186011619 * currentPrice).toLocaleString('en-US', {
        style: 'currency',
        currency: 'USD',
        maximumFractionDigits: 0
    });
    document.getElementById('market-cap').textContent = marketCap;
    
    updateLastUpdatedText();
}

// Update chart range
function updateChartRange(range) {
    if (!chartData[range]) return;
    
    currentChartRange = range;
    
    // Update active button
    [chart1mBtn, chart3mBtn, chart1yBtn, chartAllBtn].forEach(btn => {
        btn.classList.remove('btn');
        btn.classList.add('btn-outline');
    });
    document.getElementById(`chart-${range}`).classList.add('btn');
    document.getElementById(`chart-${range}`).classList.remove('btn-outline');
    
    // Format data
    const data = chartData[range];
    const labels = data.prices.map(entry => moment(entry[0]).format(
        range === 'all' ? 'MMM YYYY' : 'MMM D'
    ));
    
    priceChart.data.labels = labels;
    priceChart.data.datasets[0].data = data.prices.map(entry => entry[1]);
    priceChart.update();
}

// Fetch data from API
async function updateData() {
    try {
        if (!loadCachedData()) {
            chartLoader.style.display = 'block';
        }
        
        const response = await fetch('https://api.coingecko.com/api/v3/coins/helium/market_chart?vs_currency=usd&days=max');
        const data = await response.json();
        
        if (!localStorage.getItem('hnt-cached-data') || JSON.stringify(data) !== localStorage.getItem('hnt-cached-data')) {
            updateChart(data, currentChartRange);
        }
    } catch (error) {
        console.error('Error:', error);
        if (!loadCachedData()) {
            const mockData = await fetchFallbackData();
            updateChart(mockData, currentChartRange);
        }
    } finally {
        chartLoader.style.display = 'none';
    }
}

// Fallback data
async function fetchFallbackData() {
    try {
        const response = await fetch('hnt_fallback_data.json');
        return await response.json();
    } catch (error) {
        console.error('Fallback failed:', error);
        return generateMockData();
    }
}

// Generate mock data
function generateMockData() {
    const prices = [];
    const now = Date.now();
    const startDate = new Date('2019-07-01').getTime();
    
    for (let time = startDate; time <= now; time += 86400000) {
        const days = (time - startDate) / 86400000;
        let price;
        
        if (days < 365) price = 0.25 + (days / 365) * 0.5;
        else if (days < 730) price = 1.0 + Math.sin((days - 365) / 365 * Math.PI) * 10;
        else if (days < 1095) price = 10 - (days - 730) / 365 * 8;
        else price = 2 + Math.sin(days / 90) * 1.5 + Math.random() * 0.5;
        
        prices.push([time, price * (0.95 + Math.random() * 0.1)]);
    }
    
    return { prices };
}

// Update countdowns
function updateCountdowns() {
    const lastHalving = moment('2025-08-01');
    const nextHalving = moment('2027-08-01');
    const now = moment();
    
    const since = moment.duration(now.diff(lastHalving));
    document.getElementById('time-since-halving').textContent = 
        `${since.days()}d ${since.hours()}h ${since.minutes()}m ${since.seconds()}s`;
    
    const to = moment.duration(nextHalving.diff(now));
    document.getElementById('time-to-halving').textContent = 
        `${to.days()}d ${to.hours()}h ${to.minutes()}m ${to.seconds()}s`;
}

// Update timestamp
function updateLastUpdatedText(date = new Date()) {
    lastUpdatedEl.textContent = moment(date).format('LLLL');
}

// Initialize
window.addEventListener('DOMContentLoaded', initDashboard);
