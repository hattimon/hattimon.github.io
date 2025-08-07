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

// Current settings
let currentLanguage = 'en';
let currentTheme = 'light';
let currentChartRange = 'all';
let priceChart;
let chartData = {
    all: null,
    '1y': null,
    '3m': null,
    '1m': null
};

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

// Initialize dashboard
function initDashboard() {
    loadSettings();
    initChart();
    setupEventListeners();
    loadData();
    startBackgroundTasks();
}

function loadSettings() {
    // Load theme
    const savedTheme = localStorage.getItem('hnt-theme');
    if (savedTheme) {
        currentTheme = savedTheme;
        document.body.classList.toggle('dark-mode', currentTheme === 'dark');
        updateThemeIcon();
    }
    
    // Load language
    const savedLang = localStorage.getItem('hnt-lang');
    if (savedLang) {
        currentLanguage = savedLang;
        applyTranslations();
    }
    
    // Load chart range
    const savedRange = localStorage.getItem('hnt-chart-range');
    if (savedRange) {
        currentChartRange = savedRange;
    }
}

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

function setupEventListeners() {
    themeToggle.addEventListener('click', toggleTheme);
    languageToggle.addEventListener('click', toggleLanguage);
    soundToggle.addEventListener('click', toggleSound);
    
    chart1mBtn.addEventListener('click', () => updateChartRange('1m'));
    chart3mBtn.addEventListener('click', () => updateChartRange('3m'));
    chart1yBtn.addEventListener('click', () => updateChartRange('1y'));
    chartAllBtn.addEventListener('click', () => updateChartRange('all'));
}

function loadData() {
    // Try cache first
    const cachedData = localStorage.getItem('hnt-cached-data');
    if (cachedData) {
        processData(JSON.parse(cachedData));
        return;
    }
    
    // Then fallback
    fetch('hnt_fallback_data.json')
        .then(response => response.json())
        .then(data => processData(data))
        .catch(error => {
            console.error("Error loading fallback data:", error);
            processData(generateMockData());
        });
}

function processData(data) {
    if (!data?.prices) return;
    
    // Update last point to current date
    const now = Date.now();
    if (data.prices.length > 0) {
        data.prices[data.prices.length - 1][0] = now;
    }
    
    // Process ranges
    chartData.all = data;
    chartData['1y'] = filterData(data, now - 365 * 86400000);
    chartData['3m'] = filterData(data, now - 90 * 86400000);
    chartData['1m'] = filterData(data, now - 30 * 86400000);
    
    updateChartRange(currentChartRange);
    updatePriceDisplays(data.prices[data.prices.length - 1][1]);
    updateLastUpdatedText();
}

function filterData(data, minTime) {
    return {
        prices: data.prices.filter(entry => entry[0] >= minTime)
    };
}

function updateChartRange(range) {
    if (!chartData[range]) return;
    
    currentChartRange = range;
    localStorage.setItem('hnt-chart-range', range);
    
    // Update active button
    [chart1mBtn, chart3mBtn, chart1yBtn, chartAllBtn].forEach(btn => {
        btn.classList.remove('btn');
        btn.classList.add('btn-outline');
    });
    document.getElementById(`chart-${range}`).classList.remove('btn-outline');
    document.getElementById(`chart-${range}`).classList.add('btn');
    
    // Format labels
    let dateFormat;
    if (range === '1m' || range === '3m') dateFormat = 'MMM D';
    else dateFormat = 'MMM YYYY';
    
    priceChart.data.labels = chartData[range].prices.map(entry => 
        moment(entry[0]).format(dateFormat)
    );
    priceChart.data.datasets[0].data = chartData[range].prices.map(entry => entry[1]);
    priceChart.update();
}

function updatePriceDisplays(price) {
    document.getElementById('current-price').textContent = `${price.toFixed(2)} USD`;
    
    const marketCap = (186011619 * price).toLocaleString('en-US', {
        style: 'currency',
        currency: 'USD',
        maximumFractionDigits: 0
    });
    document.getElementById('market-cap').textContent = marketCap;
}

function fetchFreshData() {
    fetch('https://api.coingecko.com/api/v3/coins/helium/market_chart?vs_currency=usd&days=max')
        .then(response => response.json())
        .then(data => {
            localStorage.setItem('hnt-cached-data', JSON.stringify(data));
            localStorage.setItem('hnt-cached-time', Date.now().toString());
            processData(data);
        })
        .catch(error => {
            console.error('Error fetching fresh data:', error);
        });
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

function toggleTheme() {
    currentTheme = currentTheme === 'dark' ? 'light' : 'dark';
    document.body.classList.toggle('dark-mode');
    updateThemeIcon();
    localStorage.setItem('hnt-theme', currentTheme);
    priceChart.update();
}

function updateThemeIcon() {
    themeToggle.innerHTML = currentTheme === 'dark' ? 
        '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
}

function toggleLanguage() {
    currentLanguage = currentLanguage === 'en' ? 'pl' : 'en';
    localStorage.setItem('hnt-lang', currentLanguage);
    applyTranslations();
    moment.locale(currentLanguage);
    updateLastUpdatedText();
}

function applyTranslations() {
    document.querySelectorAll('[data-translate]').forEach(element => {
        const key = element.getAttribute('data-translate');
        if (translations[key]) {
            element.textContent = translations[key][currentLanguage];
        }
    });
    languageToggle.querySelector('span').textContent = currentLanguage === 'en' ? 'PL' : 'EN';
}

function toggleSound() {
    if (bgMusic.paused) {
        bgMusic.play();
        soundToggle.innerHTML = '<i class="fas fa-volume-up"></i>';
    } else {
        bgMusic.pause();
        soundToggle.innerHTML = '<i class="fas fa-volume-mute"></i>';
    }
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

function startBackgroundTasks() {
    setInterval(fetchFreshData, 60000);
    setInterval(updateCountdowns, 1000);
}

// Initialize
window.addEventListener('DOMContentLoaded', initDashboard);
