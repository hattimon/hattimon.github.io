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
        "en": "Live market data",
        "pl": "Dane rynkowe na żywo"
    }
};

// Current settings
let currentLanguage = localStorage.getItem('hnt-lang') || 'en';
let currentTheme = localStorage.getItem('hnt-theme') || 'light';
let chart = null;
let priceSeries = null;
const CMC_API_URL = 'https://api.coinmarketcap.com/data-api/v3/cryptocurrency/detail/chart?id=5665&range=MAX';

// Initialize dashboard
function initDashboard() {
    loadSettings();
    setupEventListeners();
    initChart();
    loadLiveData();
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

function initChart() {
    const container = document.getElementById('cmc-chart-container');
    container.innerHTML = '';
    
    chart = LightweightCharts.createChart(container, {
        width: Math.max(container.parentElement.clientWidth, 1200),
        height: 500,
        layout: {
            backgroundColor: 'transparent',
            textColor: getComputedStyle(document.body).getPropertyValue('--text-color'),
        },
        timeScale: {
            rightOffset: 12,
            barSpacing: 3,
            fixLeftEdge: true,
            fixRightEdge: true,
            borderVisible: false,
            timeVisible: true,
            secondsVisible: false,
            tickMarkFormatter: (time) => {
                return moment.unix(time).format('MMM YYYY');
            },
        },
        rightPriceScale: {
            borderColor: 'rgba(197, 203, 206, 0.3)',
        },
        grid: {
            vertLines: {
                color: 'rgba(197, 203, 206, 0.1)',
            },
            horzLines: {
                color: 'rgba(197, 203, 206, 0.1)',
            },
        },
    });

    priceSeries = chart.addAreaSeries({
        topColor: 'rgba(41, 171, 226, 0.4)',
        bottomColor: 'rgba(41, 171, 226, 0.0)',
        lineColor: 'rgba(41, 171, 226, 1)',
        lineWidth: 2,
    });
}

async function loadLiveData() {
    try {
        const response = await fetch(CMC_API_URL);
        const data = await response.json();
        
        if (!data.data || !data.data.points) {
            throw new Error('Invalid data format');
        }
        
        const points = data.data.points;
        const chartData = Object.keys(points).map(timestamp => ({
            time: parseInt(timestamp),
            value: points[timestamp].v[0]
        })).sort((a, b) => a.time - b.time);

        priceSeries.setData(chartData);
        
        // Set visible range to show full history
        if (chartData.length > 0) {
            chart.timeScale().setVisibleRange({
                from: chartData[0].time,
                to: Math.floor(Date.now() / 1000)
            });
            
            updatePriceInfo(chartData[chartData.length - 1].value);
        }
        
    } catch (error) {
        console.error('Error loading live data:', error);
        // Fallback to API v2 if v3 fails
        loadFallbackData();
    }
}

async function loadFallbackData() {
    try {
        const response = await fetch('https://api.coinmarketcap.com/data-api/v2/cryptocurrency/historical?id=5665&convertId=2781&timeStart=1561939200&timeEnd=' + Math.floor(Date.now() / 1000));
        const data = await response.json();
        
        if (data.data && data.data.quotes) {
            const chartData = data.data.quotes.map(item => ({
                time: Math.floor(new Date(item.timeOpen).getTime() / 1000),
                value: item.quote.USD.close
            }));
            
            priceSeries.setData(chartData);
            updatePriceInfo(chartData[chartData.length - 1].value);
        }
    } catch (error) {
        console.error('Error loading fallback data:', error);
    }
}

function updatePriceInfo(price) {
    document.getElementById('current-price').textContent = `${price.toFixed(4)} USD`;
    
    const marketCap = (186011619 * price).toLocaleString('en-US', {
        style: 'currency',
        currency: 'USD',
        maximumFractionDigits: 0
    });
    document.getElementById('market-cap').textContent = marketCap;
    updateLastUpdatedText();
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
    
    // Recreate chart with new theme
    initChart();
    loadLiveData();
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

function updateLastUpdatedText() {
    lastUpdatedEl.textContent = moment().format('LLLL');
}

function startBackgroundTasks() {
    // Update chart every minute
    setInterval(loadLiveData, 60000);
    setInterval(updateCountdowns, 1000);
}

// Initialize
window.addEventListener('DOMContentLoaded', initDashboard);
