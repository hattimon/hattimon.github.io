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
let currentLanguage = localStorage.getItem('hnt-lang') || 'en';
let currentTheme = localStorage.getItem('hnt-theme') || 'light';
let chart = null;

// DOM elements
const themeToggle = document.getElementById('theme-toggle');
const languageToggle = document.getElementById('language-toggle');
const soundToggle = document.getElementById('sound-toggle');
const bgMusic = document.getElementById('bg-music');
const lastUpdatedEl = document.getElementById('last-updated');

// Initialize dashboard
function initDashboard() {
    loadSettings();
    setupEventListeners();
    loadCMCChart();
    startBackgroundTasks();
}

function loadSettings() {
    // Load theme
    if (currentTheme === 'dark') {
        document.body.classList.add('dark-mode');
        themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
    } else {
        document.body.classList.remove('dark-mode');
        themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
    }
    
    // Load language
    applyTranslations();
}

async function loadCMCChart() {
    document.getElementById('chart-loader').style.display = 'block';
    
    try {
        // Try to load from cache first
        const cachedData = localStorage.getItem('hnt-cached-chart-data');
        const cachedTime = localStorage.getItem('hnt-cached-chart-time');
        
        if (cachedData && cachedTime) {
            renderChart(JSON.parse(cachedData));
            updateLastUpdatedText(new Date(parseInt(cachedTime)));
        }
        
        // Fetch fresh data
        const response = await fetch('https://api.coinmarketcap.com/data-api/v3/cryptocurrency/detail/chart?id=5665&range=MAX');
        const data = await response.json();
        
        localStorage.setItem('hnt-cached-chart-data', JSON.stringify(data));
        localStorage.setItem('hnt-cached-chart-time', Date.now().toString());
        
        renderChart(data);
        updateLastUpdatedText();
        
    } catch (error) {
        console.error('Error loading chart data:', error);
        // Fallback to test data if API fails
        renderChart(getFallbackData());
    } finally {
        document.getElementById('chart-loader').style.display = 'none';
    }
}

function renderChart(data) {
    const container = document.getElementById('cmc-chart-container');
    container.innerHTML = ''; // Clear previous chart
    
    // Prepare data
    const points = data.data.points;
    const chartData = Object.keys(points).map(timestamp => {
        return {
            time: parseInt(timestamp),
            value: points[timestamp].v[0]
        };
    });
    
    // Create chart
    chart = LightweightCharts.createChart(container, {
        width: container.clientWidth,
        height: 500,
        layout: {
            backgroundColor: 'transparent',
            textColor: getComputedStyle(document.body).getPropertyValue('--text-color'),
        },
        grid: {
            vertLines: {
                color: currentTheme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
            },
            horzLines: {
                color: currentTheme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
            },
        },
        rightPriceScale: {
            borderColor: currentTheme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
        },
        timeScale: {
            borderColor: currentTheme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
        },
    });

    const areaSeries = chart.addAreaSeries({
        topColor: 'rgba(41, 171, 226, 0.4)',
        bottomColor: 'rgba(41, 171, 226, 0.0)',
        lineColor: 'rgba(41, 171, 226, 1)',
        lineWidth: 2,
    });

    areaSeries.setData(chartData);
    
    // Update current price display
    if (chartData.length > 0) {
        const currentPrice = chartData[chartData.length - 1].value;
        document.getElementById('current-price').textContent = `${currentPrice.toFixed(2)} USD`;
        
        const marketCap = (186011619 * currentPrice).toLocaleString('en-US', {
            style: 'currency',
            currency: 'USD',
            maximumFractionDigits: 0
        });
        document.getElementById('market-cap').textContent = marketCap;
    }
}

function getFallbackData() {
    return {
        data: {
            points: {
                "1577836800": { "v": [0.25] },
                "1609459200": { "v": [1.20] },
                "1640995200": { "v": [2.90] },
                "1672531200": { "v": [2.70] },
                "1704067200": { "v": [2.80] },
                "1735689600": { "v": [2.76] } // Current date
            }
        }
    };
}

function setupEventListeners() {
    themeToggle.addEventListener('click', toggleTheme);
    languageToggle.addEventListener('click', toggleLanguage);
    soundToggle.addEventListener('click', toggleSound);
    
    // Background music
    bgMusic.volume = 0.3;
    bgMusic.play().catch(e => console.log("Autoplay prevented:", e));
}

function toggleTheme() {
    currentTheme = currentTheme === 'dark' ? 'light' : 'dark';
    document.body.classList.toggle('dark-mode');
    themeToggle.innerHTML = currentTheme === 'dark' ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
    localStorage.setItem('hnt-theme', currentTheme);
    
    // Re-render chart with new theme
    if (chart) {
        const container = document.getElementById('cmc-chart-container');
        const existingData = chart.data;
        container.innerHTML = '';
        renderChart(existingData);
    }
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
    setInterval(updateCountdowns, 1000);
    setInterval(loadCMCChart, 60000); // Refresh every minute
}

// Initialize
window.addEventListener('DOMContentLoaded', initDashboard);
