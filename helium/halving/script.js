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
    loadTradingViewWidget();
    startBackgroundTasks();
}

function loadTradingViewWidget() {
    const script = document.createElement('script');
    script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js';
    script.async = true;
    script.innerHTML = JSON.stringify({
        "autosize": true,
        "symbol": "BINANCE:HNTUSDT",
        "interval": "D",
        "timezone": "Etc/UTC",
        "theme": currentTheme,
        "style": "1",
        "locale": currentLanguage === 'pl' ? 'pl' : 'en',
        "enable_publishing": false,
        "backgroundColor": "transparent",
        "hide_top_toolbar": false,
        "hide_side_toolbar": false,
        "allow_symbol_change": true,
        "container_id": "tradingview-widget-container__widget"
    });
    
    document.querySelector('.tradingview-widget-container__widget').appendChild(script);
    updateLastUpdatedText();
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
    
    // Reload TradingView widget with new theme
    document.querySelector('.tradingview-widget-container__widget').innerHTML = '';
    loadTradingViewWidget();
}

function toggleLanguage() {
    currentLanguage = currentLanguage === 'en' ? 'pl' : 'en';
    localStorage.setItem('hnt-lang', currentLanguage);
    applyTranslations();
    moment.locale(currentLanguage);
    updateLastUpdatedText();
    
    // Reload TradingView widget with new language
    document.querySelector('.tradingview-widget-container__widget').innerHTML = '';
    loadTradingViewWidget();
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
    setInterval(() => {
        document.querySelector('.tradingview-widget-container__widget').innerHTML = '';
        loadTradingViewWidget();
        updateLastUpdatedText();
    }, 60000); // Refresh every minute
}

// Initialize
window.addEventListener('DOMContentLoaded', initDashboard);
