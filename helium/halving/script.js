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
let currentLanguage = localStorage.getItem('hnt-lang') || 'en';
let currentTheme = localStorage.getItem('hnt-theme') || 'dark';
let currentChartRange = localStorage.getItem('hnt-chart-range') || 'all';

// DOM elements
const themeToggle = document.getElementById('theme-toggle');
const languageToggle = document.getElementById('language-toggle');
const soundToggle = document.getElementById('sound-toggle');
const bgMusic = document.getElementById('bg-music');
const priceChartCtx = document.getElementById('priceChart').getContext('2d');
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

// Initialize dashboard
function initDashboard() {
    // Apply saved settings
    applyTheme();
    applyTranslations();
    
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
    
    // Load data
    loadData();
    
    // Update countdowns
    updateCountdowns();
    setInterval(updateCountdowns, 1000);
}

// Theme management
function applyTheme() {
    if (currentTheme === 'dark') {
        document.body.classList.add('dark-mode');
        themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
    } else {
        document.body.classList.remove('dark-mode');
        themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
    }
}

function toggleTheme() {
    currentTheme = currentTheme === 'dark' ? 'light' : 'dark';
    localStorage.setItem('hnt-theme', currentTheme);
    applyTheme();
    updateChartColors();
}

// Language management
function applyTranslations() {
    document.querySelectorAll('[data-translate]').forEach(element => {
        const key = element.getAttribute('data-translate');
        if (translations[key]) {
            element.textContent = translations[key][currentLanguage];
        }
    });
    languageToggle.querySelector('span').textContent = currentLanguage === 'en' ? 'PL' : 'EN';
}

function toggleLanguage() {
    currentLanguage = currentLanguage === 'en' ? 'pl' : 'en';
    localStorage.setItem('hnt-lang', currentLanguage);
    applyTranslations();
    moment.locale(currentLanguage);
    updateLastUpdatedText();
}

// Sound management
function toggleSound() {
    if (bgMusic.paused) {
        bgMusic.play();
        soundToggle.innerHTML = '<i class="fas fa-volume-up"></i>';
    } else {
        bgMusic.pause();
        soundToggle.innerHTML = '<i class="fas fa-volume-mute"></i>';
    }
}

// Chart initialization
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

function updateChartColors() {
    if (priceChart) {
        priceChart.update();
    }
}

// Data loading
function loadData() {
    // Try to load from cache first
    const cachedData = localStorage.getItem('hnt-cached-data');
    const cachedTime = localStorage.getItem('hnt-cached-time');
    
    if (cachedData && cachedTime) {
        const data = JSON.parse(cachedData);
        processData(data);
        updateLastUpdatedText(new Date(parseInt(cachedTime)));
    } else {
        // Load fallback if no cache
        loadFallbackData();
    }
    
    // Fetch fresh data in background
    fetchFreshData();
}

function fetchFreshData() {
    fetch('https://api.coingecko.com/api/v3/coins/helium/market_chart?vs_currency=usd&days=max')
        .then(response => response.json())
        .then(data => {
            localStorage.setItem('hnt-cached-data', JSON.stringify(data));
            localStorage.setItem('hnt-cached-time', Date.now().toString());
            processData(data);
            updateLastUpdatedText();
        })
        .catch(error => {
            console.error('Error fetching fresh data:', error);
        });
}

function loadFallbackData() {
    fetch('hnt_fallback_data.json')
        .then(response => response.json())
        .then(data => {
            processData(data);
            updateLastUpdatedText(new Date(0)); // Very old data
        })
        .catch(error => {
            console.error('Error loading fallback data:', error);
            // Generate basic mock data as last resort
            processData(generateMockData());
            updateLastUpdatedText(new Date(0));
        });
}

function processData(data) {
    if (!data?.prices) return;
    
    const now = Date.now();
    chartData = {
        all: data,
        '1y': filterData(data, now - 365 * 86400000),
        '3m': filterData(data, now - 90 * 86400000),
        '1m': filterData(data, now - 30 * 86400000)
    };
    
    updateChartRange(currentChartRange);
    
    // Update price displays
    const currentPrice = data.prices[data.prices.length - 1][1];
    document.getElementById('current-price').textContent = `${currentPrice.toFixed(2)} USD`;
    
    const marketCap = (186011619 * currentPrice).toLocaleString('en-US', {
        style: 'currency',
        currency: 'USD',
        maximumFractionDigits: 0
    });
    document.getElementById('market-cap').textContent = marketCap;
}

function filterData(data, minTime) {
    return {
        prices: data.prices.filter(entry => entry[0] >= minTime)
    };
}

function updateChartRange(range) {
    if (!chartData[range]?.prices?.length) return;
    
    currentChartRange = range;
    localStorage.setItem('hnt-chart-range', range);
    
    // Update active button
    [chart1mBtn, chart3mBtn, chart1yBtn, chartAllBtn].forEach(btn => {
        btn.classList.remove('btn');
        btn.classList.add('btn-outline');
    });
    document.getElementById(`chart-${range}`).classList.remove('btn-outline');
    document.getElementById(`chart-${range}`).classList.add('btn');
    
    // Format labels based on range
    let dateFormat;
    if (range === '1m' || range === '3m') dateFormat = 'MMM D';
    else dateFormat = 'MMM YYYY';
    
    priceChart.data.labels = chartData[range].prices.map(entry => 
        moment(entry[0]).format(dateFormat)
    );
    priceChart.data.datasets[0].data = chartData[range].prices.map(entry => entry[1]);
    priceChart.update();
}

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

function updateLastUpdatedText(date = new Date()) {
    lastUpdatedEl.textContent = moment(date).format('LLLL');
}

// Initialize
window.addEventListener('DOMContentLoaded', initDashboard);
