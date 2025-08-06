(() => {
    // Config (mechanics unchanged)
    const CELL = 32, COLS = 25, ROWS = 18;
    const MIN_BOARD = Math.min(COLS * CELL, ROWS * CELL);
    const CLOUD_MAX_RADIUS = Math.floor(MIN_BOARD / 5);

    const HP_MAX = 100;
    const BOKA_BASE_SPEED = 3.1, BOKA_R_BASE = 14;
    const HUNTER_R = 11, HUNTER_AIM_RANGE = 360;

    // Difficulty
    function diff(level) {
        const t = (level - 1) / 29;
        return {
            wallDensity: 0.24 + t * 0.26,
            carveSteps: 220 + Math.floor(t * 180),
            muminBase: 8 + Math.floor(level * 1.2),
            hunterSpeed: (2.5 + t * 1.2) * (2 / 3),
            hunterProjSpeed: 4.2 + t * 1.4,
            fireCooldown: (1.8 * 5) * (1.0 - t * 0.35),
            projDps: (14 / 10) * 3
        };
    }

    // Themes, weather
    const THEMES = [
        { name: ['Forest', 'Las'], bg: '#0b1c10', path: '#0f2a18', wall: '#23402a', accent: '#2d5b33' },
        { name: ['Sea', 'Morze'], bg: '#06202b', path: '#0b2c3a', wall: '#16495c', accent: '#2b7a8a' },
        { name: ['Autumn', 'Jesień'], bg: '#1d1208', path: '#2a170b', wall: '#5a2e12', accent: '#7a4a1e' },
        { name: ['Winter', 'Zima'], bg: '#0a1520', path: '#0e1f30', wall: '#254a6b', accent: '#9ec9f0' },
        { name: ['Spring', 'Wiosna'], bg: '#0c1d12', path: '#12321c', wall: '#2f663d', accent: '#5cbf7a' },
        { name: ['Night', 'Noc'], bg: '#05070e', path: '#0a1020', wall: '#1a2a4a', accent: '#3c5a8a' },
        { name: ['Sunny', 'Słonecznie'], bg: '#13200d', path: '#1a2c12', wall: '#355a2a', accent: '#6bcf66' },
        { name: ['Cloudy', 'Pochmurno'], bg: '#0e1612', path: '#15211b', wall: '#2a4237', accent: '#6aa39a' },
        { name: ['Fog', 'Mgła'], bg: '#0a1614', path: '#0e1f1d', wall: '#1f3d3a', accent: '#8fd0cc' },
        { name: ['Storm', 'Burza'], bg: '#0a0d14', path: '#10182a', wall: '#233259', accent: '#6aa0ff' }
    ];
    const WEATHERS = [
        ['Day', 'Dzień'], ['Night', 'Noc'], ['Rain', 'Deszcz'], ['Fog', 'Mgła'], ['Sun', 'Słońce'], ['Cloudy', 'Pochmurno']
    ];
    function themeFor(level) { return THEMES[(level - 1) % THEMES.length]; }
    function randomWeather() { return WEATHERS[Math.floor(Math.random() * WEATHERS.length)]; }
    function shade(hex, f) {
        const c = hex.replace('#', '');
        const r = parseInt(c.substr(0, 2), 16), g = parseInt(c.substr(2, 2), 16), b = parseInt(c.substr(4, 2), 16);
        return `rgb(${Math.round(r * f)},${Math.round(g * f)},${Math.round(b * f)})`;
    }

    // Codes
    function levelCodeFor(level) {
        const base = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
        let s = ""; let x = level * 9301 + 49297;
        for (let i = 0; i < 7; i++) { x = (x * 1103515245 + 12345) >>> 0; s += base[x % base.length]; }
        return s;
    }
    function levelFromCode(code) {
        code = (code || "").toUpperCase();
        for (let L = 1; L <= 30; L++) { if (levelCodeFor(L) === code) return L; }
        return null;
    }

    // Language
    let LANG = 'en';
    const $ = s => document.querySelector(s);
    const i18nDict = {
        title: { en: 'BUKA in Moomin Valley', pl: 'BUKA w Dolinie Muminków' },
        help: { en: 'Guide', pl: 'Poradnik' },
        targets: { en: 'Targets', pl: 'Cele' },
        moomins: { en: 'Moomins', pl: 'Muminki' },
        bolts: { en: 'Bolts', pl: 'Pioruny' },
        clouds: { en: 'Clouds', pl: 'Chmurki' },
        mushrooms: { en: 'Mushrooms', pl: 'Muchomory' },
        theme: { en: 'Theme', pl: 'Motyw' },
        weather: { en: 'Weather', pl: 'Pogoda' },
        score: { en: 'Score', pl: 'Punkty' },
        progress: { en: 'Progress', pl: 'Postęp' },
        level: { en: 'Level', pl: 'Poziom' },
        hunterFreeze: { en: 'Snufkin freeze', pl: 'Zamrożenie Włóczykija' },
        globalFreeze: { en: 'Global Freeze', pl: 'Globalne Zamrożenie' },
        levelCode: { en: 'Level code', pl: 'Kod poziomu' },
        musicOn: { en: 'Music: ON', pl: 'Muzyka: WŁ.' },
        musicOff: { en: 'Music: OFF', pl: 'Muzyka: WYŁ.' },
        startTitle: { en: 'Buka awakens the frost…', pl: 'Buka budzi mróz…' },
        controls: { en: 'Controls: Shift – cloud (hold 3s: strong; ≥6s: global), Ctrl – bolt, WASD/Arrows – move, P – pause, R – restart.', pl: 'Sterowanie: Shift – chmura (trzymaj 3s: mocna; ≥6s: globalna), Ctrl – piorun, WASD/Strzałki – ruch, P – pauza, R – restart.' },
        controlsShort: { en: 'Shift – cloud (3s/6s), Ctrl – bolt, WASD/Arrows – move, P – resume, R – restart.', pl: 'Shift – chmura (3s/6s), Ctrl – piorun, WASD/Strzałki – ruch, P – wznów, R – restart.' },
        codeLabel: { en: 'Level code (7 chars)', pl: 'Kod poziomu (7 znaków)' },
        applyCode: { en: 'Codes', pl: 'Kody' },
        start: { en: 'Start', pl: 'Start' },
        pause: { en: 'Pause', pl: 'Pauza' },
        resume: { en: 'Resume', pl: 'Wznów' },
        guideTitle: { en: 'Game guide', pl: 'Poradnik gry' },
        close: { en: 'Close', pl: 'Zamknij' },
        welcomeH: { en: 'Welcome to Moomin Valley', pl: 'Witaj w Dolinie Muminków' },
        welcomeP: { en: 'You are Buka – a frigid force. Eliminate all Moomins while dealing with Snufkin and Hattifatteners.', pl: 'Wcielasz się w Bukę – lodowatą siłę. Wyeliminuj wszystkie Muminki, radząc sobie z Włóczykijem i Hatifnatami.' },
        controlsH: { en: 'Controls', pl: 'Sterowanie' },
        ctrlMove: { en: 'Move: WASD or Arrows.', pl: 'Ruch: WASD lub Strzałki.' },
        ctrlBolt: { en: 'Bolt (ice shot): Ctrl – consumes bolt ammo, freezes the target.', pl: 'Piorun: Ctrl – zużywa amunicję, zamraża cel.' },
        ctrlCloud: { en: 'Frost cloud: hold Shift to charge:', pl: 'Chmura mrozu: przytrzymaj Shift, aby ładować:' },
        ctrlCloudS: { en: 'Tap: small cloud (7s), freezes nearby.', pl: 'Krótkie naciśnięcie: mała chmura (7s), mrozi w pobliżu.' },
        ctrlCloudM: { en: '≥3s: strong cloud (bigger radius, 30s freeze), costs 10 clouds.', pl: '≥3s: silna chmura (większy zasięg, 30s), koszt 10 chmurek.' },
        ctrlCloudG: { en: '≥6s: global freeze for 60s, costs 100 clouds.', pl: '≥6s: globalne zamrożenie na 60s, koszt 100 chmurek.' },
        ctrlPause: { en: 'P – pause/resume.', pl: 'P – pauza/wznów.' },
        ctrlRestart: { en: 'R – restart level.', pl: 'R – restart poziomu.' },
        goalH: { en: 'Goal', pl: 'Cel' },
        goalP: { en: 'Eliminate all Moomins. 30 levels with rising difficulty and themes.', pl: 'Wyeliminuj wszystkie Muminki. 30 poziomów o rosnącej trudności i motywach.' },
        hudH: { en: 'Resources & HUD', pl: 'Zasoby i HUD' },
        hudHp: { en: 'HP: green bar – avoid flames and Hattifatteners.', pl: 'Życie: zielony pasek – unikaj ogników i Hatifnatów.' },
        hudClouds: { en: 'Clouds: blue bar – for clouds and global freeze.', pl: 'Chmurki: niebieski pasek – do chmur i globalnego zamrożenia.' },
        hudBolts: { en: 'Bolts: light blue bar – each shot costs 1.', pl: 'Pioruny: jasnoniebieski pasek – każdy strzał koszt 1.' },
        hudGf: { en: 'Global Freeze: remaining time.', pl: 'Globalne Zamrożenie: pozostały czas.' },
        hudCode: { en: 'Level code: 7 chars to start at a level.', pl: 'Kod poziomu: 7 znaków do startu na poziomie.' },
        objectsH: { en: 'Objects', pl: 'Obiekty' },
        objMoomins: { en: 'Moomins: run to house if they see you; outside you can eliminate by proximity.', pl: 'Muminki: uciekają do domku; poza domkiem możesz je wyeliminować bliskością.' },
        objHunter: { en: 'Snufkin: shoots flames (DoT). Freeze with bolts/clouds; summons Hattifatteners; disappears after many freezes.', pl: 'Włóczykij: strzela ognikami. Zamrażaj piorunami/chmurą; wzywa Hatifnatów; znika po wielu zamrożeniach.' },
        objHatti: { en: 'Hattifatteners: chase Buka; contact hurts, then they flee; bolt hits may grow them.', pl: 'Hatifnatowie: gonią Bukę; kontakt rani, potem uciekają; piorun ich powiększa.' },
        objBobek: { en: 'Bobek: call in cave (center + release Shift). Builds webs (traps); Snufkin can burn them.', pl: 'Bobek: wezwij w jaskini (środek + puść Shift). Buduje pajęczyny; Włóczykij je pali.' },
        objTraps: { en: 'Traps: immobilize Moomins; burned ones vanish.', pl: 'Pułapki: unieruchamiają Muminki; spalone znikają.' },
        objBoltPick: { en: 'Bolt pickup: +10 ammo.', pl: 'Pioruny – pickup: +10 amunicji.' },
        objCloudPick: { en: 'Cloud pickup: +5 clouds.', pl: 'Chmurki – pickup: +5 chmurek.' },
        objShrooms: { en: 'Mushrooms: 15s growth (3x speed, bigger reach).', pl: 'Muchomory: 15s wzrost (3x prędkość, większy zasięg).' },
        objHouse: { en: 'House: 3×3 passable; can’t eliminate Moomin inside.', pl: 'Domek: 3×3 przechodni; w środku nie wyeliminujesz Muminka.' },
        objCave: { en: 'Cave: call Bobek here.', pl: 'Jaskinia: tu wzywasz Bobka.' },
        tacticsH: { en: 'Tactics', pl: 'Taktyka' },
        tac1: { en: 'Combine clouds and bolts.', pl: 'Łącz chmury i pioruny.' },
        tac2: { en: 'Place webs on house routes.', pl: 'Stawiaj pajęczyny na trasach przy domku.' },
        tac3: { en: 'Watch Snufkin’s aim.', pl: 'Uważaj na celowanie Włóczykija.' },
        tac4: { en: 'Save Global Freeze for crises.', pl: 'Globalne Zamrożenie zostaw na kryzysy.' },
        tac5: { en: 'Use mushrooms to sweep.', pl: 'Muchomorami czyść trudniejsze miejsca.' },
        codesH: { en: 'Level codes', pl: 'Kody poziomów' },
        codesP: { en: 'Enter code on start screen to jump to a level.', pl: 'Wpisz kod na ekranie startu, by wskoczyć do poziomu.' },
        musicH: { en: 'Music', pl: 'Muzyka' },
        musicP: { en: 'Music ON/OFF toggles background and panic tracks.', pl: 'Muzyka WŁ./WYŁ. przełącza tło i motyw paniki.' },
        glhfH: { en: 'Good luck!', pl: 'Powodzenia!' },
        glhfP: { en: 'Experiment with map, weather and themes.', pl: 'Eksperymentuj z mapą, pogodą i motywami.' }
    };
    function tSync() {
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            const item = i18nDict[key];
            if (!item) return;
            el.textContent = item[LANG];
        });
        document.title = i18nDict.title[LANG];
    }

    // DOM
    const canvas = document.getElementById('game'), ctx = canvas.getContext('2d');
    const overlay = document.getElementById('overlay'), startBtn = document.getElementById('startBtn');
    const pauseOv = document.getElementById('pause'), resumeBtn = document.getElementById('resumeBtn');
    const leftEl = document.getElementById('left'), mushLeftEl = document.getElementById('mushLeft');
    const lvlEl = document.getElementById('level'), scoreEl = document.getElementById('score');
    const levelCodeEl = document.getElementById('levelCode');
    const themeName = document.getElementById('themeName'), weatherName = document.getElementById('weatherName');
    const hpFill = document.getElementById('hpFill');
    const cloudStockFill = document.getElementById('cloudStockFill'), ammoAltFill = document.getElementById('ammoAltFill');
    const freezeT = document.getElementById('freezeT'), progressEl = document.getElementById('progress'), globalFreezeT = document.getElementById('globalFreezeT');
    const musicBtn = document.getElementById('musicBtn'), musicBg = document.getElementById('musicBg'), musicPanic = document.getElementById('musicPanic');
    const sfxBobek = document.getElementById('sfxBobek'), sfxDeathMumin = document.getElementById('sfxDeathMumin'), sfxDeathKij = document.getElementById('sfxDeathKij'), sfxWin = document.getElementById('sfxWin'), sfxAmmo = document.getElementById('sfxAmmo');
    const panicDim = document.getElementById('panicDim'), globalFog = document.getElementById('globalFog');
    const codeInput = document.getElementById('codeInput');
    const applyCodeBtn = document.getElementById('applyCodeBtn');
    const codeStatus = document.getElementById('codeStatus');
    const helpBtn = document.getElementById('helpBtn');
    const helpModal = document.getElementById('helpModal');
    const helpClose = document.getElementById('helpClose');

    // Audio
    let musicOn = true;
    function stopAllMusic() { musicBg.pause(); musicPanic.pause(); sfxWin.pause(); }
    function startBackground() { if (!musicOn) return; stopAllMusic(); musicBg.currentTime = 0; musicBg.loop = true; musicBg.play(); }
    function startPanic() { if (!musicOn) return; musicBg.pause(); musicPanic.currentTime = 0; musicPanic.loop = false; musicPanic.play(); }
    function startWinLoop() { stopAllMusic(); sfxWin.currentTime = 0; sfxWin.loop = true; sfxWin.play(); }

    // Game state
    const boka = baseBoka();
    function baseBoka() {
        return {
            x: 48, y: 48, r: BOKA_R_BASE, hp: HP_MAX, poison: 0,
            ammoAlt: 100, ammoCloud: 5, cloud: 0, cloudActive: false, rooted: 0, lookX: 1, lookY: 0,
            growT: 0, growSpeedMul: 1.0, chargeT: 0, charging: false, globalFreeze: 0
        };
    }
    const hunter = { alive: true, x: COLS * CELL - 80, y: ROWS * CELL - 80, r: HUNTER_R, frozen: 0, freezeHits: 0, tShot: 0, burning: null };
    const mumins = [], fearClouds = [], blueClouds = [], projs = [], iceBolts = [];
    const boltPickups = [], cloudPickups = []; const pickupRespawn = 60;
    const hattis = []; let panic = false;
    const cave = { x: COLS * CELL - 64, y: ROWS * CELL - 64, r: 26 };
    const bobek = { active: false, x: 0, y: 0, r: 8, dir: 0, speed: 4.5, callsLeft: 3, plan: [], building: null };
    const traps = [];
    let level = 1, score = 0, playing = false, paused = false;
    let weather = WEATHERS[0];
    let lastTick = 0;

    // Input
    const keys = new Set();
    window.addEventListener('keydown', e => {
        const mv = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'KeyW', 'KeyA', 'KeyS', 'KeyD'];
        if (mv.includes(e.code)) { e.preventDefault(); keys.add(e.code); }
        if (e.code === 'ShiftLeft' || e.code === 'ShiftRight') { e.preventDefault(); if (!boka.charging) { boka.charging = true; boka.chargeT = 0; } }
        if (e.code === 'ControlLeft' || e.code === 'ControlRight') { e.preventDefault(); fireIceBolt(); }
        if (e.code === 'KeyP') { e.preventDefault(); paused = !paused; pauseOv.hidden = !paused; }
        if (e.code === 'KeyR') { e.preventDefault(); startGame(true); }
    });
    window.addEventListener('keyup', e => {
        if (e.code === 'ShiftLeft' || e.code === 'ShiftRight') {
            e.preventDefault();
            if (inCaveCenter(boka.x, boka.y)) { triggerBobek(); }
            else { releaseCloudCharge(); }
            boka.charging = false;
        }
        const mv = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'KeyW', 'KeyA', 'KeyS', 'KeyD'];
        if (mv.includes(e.code)) keys.delete(e.code);
    });

    // Button handlers
    startBtn.addEventListener('click', e => {
        e.preventDefault();
        overlay.hidden = true;
        startGame(true);
    });
    resumeBtn.addEventListener('click', e => {
        e.preventDefault();
        paused = false;
        pauseOv.hidden = true;
    });
    applyCodeBtn.addEventListener('click', e => {
        e.preventDefault();
        const code = (codeInput.value || '').trim().toUpperCase();
        if (!code || code.length !== 7) { codeStatus.textContent = (LANG === 'en' ? 'Enter 7 chars.' : 'Wpisz 7 znaków.'); return; }
        const L = levelFromCode(code);
        if (L) { level = L; codeStatus.textContent = (LANG === 'en' ? 'Loaded level: ' : 'Załadowano poziom: ') + L; }
        else { codeStatus.textContent = (LANG === 'en' ? 'Invalid code.' : 'Nieprawidłowy kod.'); }
    });
    musicBtn.addEventListener('click', e => {
        e.preventDefault();
        musicOn = !musicOn;
        musicBtn.textContent = musicOn ? i18nDict.musicOn[LANG] : i18nDict.musicOff[LANG];
        if (!musicOn) { stopAllMusic(); } else { if (panic) startPanic(); else startBackground(); }
    });
    helpBtn.addEventListener('click', e => {
        e.preventDefault();
        helpModal.hidden = false;
    });
    helpClose.addEventListener('click', e => {
        e.preventDefault();
        helpModal.hidden = true;
    });
    helpModal.addEventListener('click', e => {
        const card = e.target.closest('.modal-card');
        if (!card) helpModal.hidden = true;
    });

    function applyLang() {
        LANG = (LANG === 'en' ? 'pl' : 'en');
        langBtn.textContent = (LANG === 'en' ? 'Polski' : 'English');
        tSync();
        const th = themeFor(level);
        themeName.textContent = th.name[LANG === 'en' ? 0 : 1];
        weatherName.textContent = weather[LANG === 'en' ? 0 : 1];
        document.title = i18nDict.title[LANG];
    }
    langBtn.addEventListener('click', e => {
        e.preventDefault();
        applyLang();
    });

    // Map
    let grid = [], trees = [], mushrooms = [], houseCells = [];
    function isWall(c, r) { if (r < 0 || c < 0 || r >= ROWS || c >= COLS) return true; return grid[r][c] === 1; }
    function genMap(level) {
        const d = diff(level);
        trees = []; mushrooms = []; houseCells = [];
        grid = Array.from({ length: ROWS }, () => Array(COLS).fill(0));
        for (let r = 0; r < ROWS; r++) for (let c = 0; c < COLS; c++) if (r === 0 || c === 0 || r === ROWS - 1 || c === COLS - 1) grid[r][c] = 1;
        for (let r = 1; r < ROWS - 1; r++) for (let c = 1; c < COLS - 1; c++) if (Math.random() < d.wallDensity) grid[r][c] = 1;
        let snakes = 10 + Math.floor(level / 2);
        while (snakes--) {
            let r = (ROWS >> 1) + ((Math.random() * 6) | 0) - 3, c = (COLS >> 1) + ((Math.random() * 6) | 0) - 3;
            for (let i = 0; i < d.carveSteps; i++) {
                grid[r][c] = 0;
                const dir = (Math.random() * 4) | 0;
                if (dir === 0 && r > 1) r--; if (dir === 1 && r < ROWS - 2) r++;
                if (dir === 2 && c > 1) c--; if (dir === 3 && c < COLS - 2) c++;
            }
        }
        // House 3x3 (tile=2 passable)
        let dr = 0, dc = 0;
        for (let tries = 0; tries < 500; tries++) {
            const r = 2 + ((Math.random() * (ROWS - 5)) | 0), c = 2 + ((Math.random() * (COLS - 5)) | 0);
            let ok = true; for (let rr2 = r; rr2 < r + 3; rr2++) for (let cc = c; cc < c + 3; cc++) if (isWall(cc, rr2)) ok = false;
            if (ok) { dr = r; dc = c; break; }
        }
        for (let rr2 = dr; rr2 < dr + 3; rr2++) for (let cc = dc; cc < dc + 3; cc++) { grid[rr2][cc] = 2; houseCells.push({ c: cc, r: rr2 }); }

        const treeCount = 18 + Math.floor(level * 1.4);
        for (let i = 0; i < treeCount; i++) {
            const c = 1 + ((Math.random() * (COLS - 2)) | 0), r = 1 + ((Math.random() * (ROWS - 2)) | 0);
            if (grid[r][c] !== 0 && grid[r][c] !== 2) continue;
            const x = c * CELL + CELL / 2, y = r * CELL + CELL / 2;
            trees.push({ x, y });
            if (Math.random() < 0.28) mushrooms.push({ x: x + ((Math.random() * 18) | 0) - 9, y: y + 6 + ((Math.random() * 7) | 0), r: 6, alive: true, timer: 0 });
        }
    }
    function inHouse(x, y) { const c = (x / CELL) | 0, r = (y / CELL) | 0; return grid[r] && grid[r][c] === 2; }
    function inCaveCenter(x, y) { return Math.hypot(x - cave.x, y - cave.y) < cave.r * 0.6; }

    // Reset
    function resetLevel() {
        mumins.length = 0; fearClouds.length = 0; blueClouds.length = 0; projs.length = 0; iceBolts.length = 0;
        boltPickups.length = 0; cloudPickups.length = 0; traps.length = 0; hattis.length = 0;
        panic = false; panicDim.hidden = true; globalFog.hidden = true; globalFog.style.opacity = '0';

        genMap(level);

        Object.assign(boka, baseBoka());
        hunter.alive = true; hunter.x = COLS * CELL - 80; hunter.y = ROWS * CELL - 80; hunter.frozen = 0; hunter.freezeHits = 0; hunter.tShot = 0; hunter.burning = null;
        bobek.active = false; bobek.callsLeft = 3; bobek.plan = []; bobek.building = null;

        const d = diff(level);
        for (let i = 0; i < d.muminBase; i++) {
            const c = 1 + ((Math.random() * (COLS - 2)) | 0), r = 1 + ((Math.random() * (ROWS - 2)) | 0);
            if (grid[r][c] !== 0) { i--; continue; }
            const x = c * CELL + CELL / 2, y = r * CELL + CELL / 2;
            if (Math.hypot(x - boka.x, y - boka.y) < 80) { i--; continue; }
            mumins.push({ x, y, r: 11, alive: true, hide: false, frozen: 0, dir: Math.random() * Math.PI * 2, trapped: false });
        }
        placePickups(boltPickups, 5, 'bolt');
        placePickups(cloudPickups, 5, 'cloud');

        updateHUDTheme(); updateHUD();
    }

    // HUD/theme/weather
    function updateHUDTheme() {
        const th = themeFor(level);
        document.documentElement.style.setProperty('--bg', th.bg);
        document.documentElement.style.setProperty('--path', th.path);
        document.documentElement.style.setProperty('--wall', th.wall);
        document.documentElement.style.setProperty('--accent', th.accent);
        themeName.textContent = th.name[LANG === 'en' ? 0 : 1];
        weather = randomWeather();
        weatherName.textContent = weather[LANG === 'en' ? 0 : 1];
        levelCodeEl.textContent = levelCodeFor(level);
    }
    function updateHUD() {
        leftEl.textContent = mumins.filter(m => m.alive).length;
        mushLeftEl.textContent = mushrooms.filter(m => m.alive !== false).length;
        lvlEl.textContent = level;
        scoreEl.textContent = score;
        ammoAltFill.style.width = Math.min(100, (boka.ammoAlt / 100) * 100) + '%';
        cloudStockFill.style.width = Math.min(100, (boka.ammoCloud / 20) * 100) + '%';
        hpFill.style.width = Math.max(0, Math.min(100, (boka.hp / HP_MAX) * 100)) + '%';
        globalFreezeT.textContent = boka.globalFreeze > 0 ? Math.ceil(boka.globalFreeze) + 's' : '—';
        progressEl.textContent = Math.round((1 - mumins.filter(m => m.alive).length / mumins.length) * 100) + '%';
    }

    // Pickups
    function placePickups(arr, count, shape) {
        for (let i = 0; i < count; i++) {
            let x = 0, y = 0;
            for (let t = 0; t < 100; t++) {
                const c = 1 + ((Math.random() * (COLS - 2)) | 0), r = 1 + ((Math.random() * (ROWS - 2)) | 0);
                if (grid[r][c] !== 0) continue;
                x = c * CELL + CELL / 2; y = r * CELL + CELL / 2; break;
            }
            arr.push({ x, y, r: 10, alive: true, shape, timer: 0 });
        }
    }
    function updatePickups(arr, kind, dt) {
        for (let i = 0; i < arr.length; i++) {
            const p = arr[i];
            if (p.alive && Math.hypot(p.x - boka.x, p.y - boka.y) < boka.r + p.r) {
                if (kind === 'alt') { boka.ammoAlt = Math.min(999, boka.ammoAlt + 10); }
                else { boka.ammoCloud += 5; }
                sfxAmmo.currentTime = 0; sfxAmmo.play();
                p.alive = false; p.timer = pickupRespawn;
            } else if (!p.alive && p.timer > 0) {
                p.timer -= dt;
                if (p.timer <= 0) {
                    for (let t = 0; t < 100; t++) {
                        const c = 1 + ((Math.random() * (COLS - 2)) | 0), r = 1 + ((Math.random() * (ROWS - 2)) | 0);
                        if (grid[r][c] !== 0) continue;
                        p.x = c * CELL + CELL / 2; p.y = r * CELL + CELL / 2; break;
                    }
                    p.alive = true;
                }
            }
        }
    }

    // Clouds / freezing
    function tryUseCloudBasic() {
        if (boka.cloudActive || boka.ammoCloud <= 0) return false;
        boka.ammoCloud--; cloudStockFill.style.width = Math.min(100, (boka.ammoCloud / 20) * 100) + '%';
        boka.cloud = 7.0; boka.cloudActive = true; boka.rooted = 3.0;
        blueClouds.push({ x: boka.x, y: boka.y, r: CLOUD_MAX_RADIUS, ttl: 7.0 });
        freezeInRadius(CLOUD_MAX_RADIUS, 10.0);
        return true;
    }
    function releaseCloudCharge() {
        const t = boka.chargeT;
        if (t >= 6 && boka.ammoCloud >= 100) {
            boka.ammoCloud -= 100; cloudStockFill.style.width = Math.min(100, (boka.ammoCloud / 20) * 100) + '%';
            boka.globalFreeze = 60.0; boka.rooted = 3.0; globalFreezeT.textContent = Math.ceil(boka.globalFreeze) + 's';
            globalFog.hidden = false; globalFog.style.opacity = '1'; setTimeout(() => { globalFog.style.opacity = '0'; }, 1500);
            freezeInRadius(99999, 60.0);
        } else if (t >= 3 && boka.ammoCloud >= 10) {
            boka.ammoCloud -= 10; cloudStockFill.style.width = Math.min(100, (boka.ammoCloud / 20) * 100) + '%';
            boka.cloud = 7.0; boka.cloudActive = true; boka.rooted = 3.0;
            blueClouds.push({ x: boka.x, y: boka.y, r: CLOUD_MAX_RADIUS * 2, ttl: 7.0 });
            freezeInRadius(CLOUD_MAX_RADIUS * 2, 30.0);
        } else {
            tryUseCloudBasic();
        }
        boka.chargeT = 0;
    }
    function freezeInRadius(radius, seconds) {
        mumins.forEach(m => {
            if (m.alive && Math.hypot(m.x - boka.x, m.y - boka.y) < radius) {
                m.frozen = Math.max(m.frozen, seconds);
            }
        });
        if (hunter.alive && Math.hypot(hunter.x - boka.x, hunter.y - boka.y) < radius) {
            if (hunter.frozen <= 0) hunter.freezeHits++;
            hunter.frozen = Math.max(hunter.frozen, 60.0);
            if (hunter.freezeHits >= 10) {
                hunter.alive = false;
                sfxDeathKij.currentTime = 0;
                sfxDeathKij.play();
                summonHattis(true);
            } else if (hunter.freezeHits % 3 === 0) {
                summonHattis(false);
            }
        }
    }

    // Bobek / traps
    function triggerBobek() {
        if (bobek.active || bobek.callsLeft <= 0) return;
        bobek.callsLeft--;
        sfxBobek.currentTime = 0;
        sfxBobek.play();
        bobek.plan = planWebSpotsNearHouse(5);
        bobek.building = null;
        bobek.active = true;
        bobek.x = cave.x;
        bobek.y = cave.y;
        bobek.dir = Math.random() * Math.PI * 2;
    }
    function planWebSpotsNearHouse(n) {
        const spots = [];
        let minC = COLS, minR = ROWS, maxC = 0, maxR = 0;
        for (const h of houseCells) {
            if (h.c < minC) minC = h.c;
            if (h.c > maxC) maxC = h.c;
            if (h.r < minR) minR = h.r;
            if (h.r > maxR) maxR = h.r;
        }
        const houseCenterX = (minC + maxC + 1) / 2 * CELL;
        const rightSide = houseCenterX > (COLS * CELL / 2);
        for (let i = 0; i < n; i++) {
            for (let t = 0; t < 300; t++) {
                const c = rightSide ? ((COLS / 2) | 0) + ((Math.random() * ((COLS - 2) - (COLS / 2))) | 0) : 1 + ((Math.random() * ((COLS / 2) - 2)) | 0);
                const r = 1 + ((Math.random() * (ROWS - 2)) | 0);
                if (grid[r][c] !== 0) continue;
                const x = c * CELL + CELL / 2, y = r * CELL + CELL / 2;
                spots.push({ x, y });
                break;
            }
        }
        return spots;
    }
    function updateBobek(dt) {
        if (!bobek.active) return;
        if (bobek.building) {
            bobek.building.time += dt;
            if (bobek.building.time >= 10) {
                const t = bobek.building.trap;
                t.active = true;
                t.buildProgress = 1;
                bobek.building = null;
            }
        } else {
            if (bobek.plan.length > 0) {
                const target = bobek.plan[0];
                const dx = target.x - bobek.x, dy = target.y - bobek.y;
                const d = Math.hypot(dx, dy) || 1;
                bobek.dir = Math.atan2(dy, dx);
                const moved = moveCircle({ x: bobek.x, y: bobek.y }, Math.cos(bobek.dir) * bobek.speed, Math.sin(bobek.dir) * bobek.speed, bobek.r);
                bobek.x = moved.x;
                bobek.y = moved.y;
                if (d < 12) {
                    if (!inHouse(target.x, target.y)) {
                        const trap = { x: target.x, y: target.y, r: 12, active: false, buildProgress: 0, burning: null };
                        traps.push(trap);
                        bobek.building = { trap, time: 0 };
                    }
                    bobek.plan.shift();
                }
            } else {
                const dx = cave.x - bobek.x, dy = cave.y - bobek.y, d = Math.hypot(dx, dy) || 1;
                bobek.dir = Math.atan2(dy, dx);
                const moved = moveCircle({ x: bobek.x, y: bobek.y }, Math.cos(bobek.dir) * bobek.speed, Math.sin(bobek.dir) * bobek.speed, bobek.r);
                bobek.x = moved.x;
                bobek.y = moved.y;
                if (d < 16) { bobek.active = false; }
            }
        }
    }
    function updateTraps(dt) {
        for (const t of traps) {
            if (t.burning != null) {
                t.burning += dt;
                if (t.burning >= 15) {
                    t.active = false;
                    t.burning = null;
                }
            }
            if (!t.active && t.buildProgress < 1) {
                t.buildProgress = Math.min(1, (t.buildProgress || 0) + dt / 10);
            }
            if (!t.active) continue;
            for (const m of mumins) {
                if (!m.alive || m.trapped) continue;
                if (Math.hypot(m.x - t.x, m.y - t.y) < m.r + t.r) {
                    m.trapped = true;
                    m.frozen = 999;
                }
            }
        }
    }

    // Hattifatteners
    function summonHattis(onDeathBurst) {
        const count = onDeathBurst ? 15 : 10;
        hattis.length = 0;
        for (let i = 0; i < count; i++) {
            const side = (Math.random() * 4) | 0;
            let x = 0, y = 0;
            if (side === 0) { x = 2; y = ((Math.random() * ROWS * CELL) | 0); }
            if (side === 1) { x = COLS * CELL - 2; y = ((Math.random() * ROWS * CELL) | 0); }
            if (side === 2) { y = 2; x = ((Math.random() * COLS * CELL) | 0); }
            if (side === 3) { y = ROWS * CELL - 2; x = ((Math.random() * COLS * CELL) | 0); }
            hattis.push({
                x, y, r: 10, flee: false, scale: 1,
                handSpan: 6 + Math.random() * 3,
                fingersL: 3 + (Math.random() * 3 | 0),
                fingersR: 3 + (Math.random() * 3 | 0),
                armLen: 8 + Math.random() * 4
            });
        }
        panic = true;
        panicDim.hidden = false;
        startPanic();
    }
    function checkHattisClear() {
        if (hattis.length === 0) {
            panic = false;
            panicDim.hidden = true;
            startBackground();
        }
    }

    // Movement
    function moveCircle(obj, vx, vy, rad) {
        let nx = obj.x + vx, ny = obj.y + vy;
        const minX = rad, minY = rad, maxX = COLS * CELL - rad, maxY = ROWS * CELL - rad;
        nx = Math.max(minX, Math.min(maxX, nx));
        ny = Math.max(minY, Math.min(maxY, ny));
        const c = (nx / CELL) | 0, r = (ny / CELL) | 0;
        for (let rr2 = r - 1; rr2 <= r + 1; rr2++) for (let cc = c - 1; cc <= c + 1; cc++) {
            if (!grid[rr2] || grid[rr2][cc] === undefined) continue;
            if (grid[rr2][cc] === 0 || grid[rr2][cc] === 2) continue;
            const rx = cc * CELL, ry = rr2 * CELL;
            const cx = Math.max(rx, Math.min(nx, rx + CELL));
            const cy = Math.max(ry, Math.min(ny, ry + CELL));
            const dx = nx - cx, dy = ny - cy, d2 = dx * dx + dy * dy;
            if (d2 < rad * rad - 1) {
                const d = Math.sqrt(Math.max(d2, 1e-4));
                const ux = dx / d, uy = dy / d;
                nx = cx + ux * (rad + 0.5);
                ny = cy + uy * (rad + 0.5);
            }
        }
        return { x: nx, y: ny };
    }

    // Navigation
    function goTowards(obj, tx, ty, speed) {
        const dx = tx - obj.x, dy = ty - obj.y;
        const d = Math.hypot(dx, dy) || 1;
        const moved = moveCircle(obj, (dx / d) * speed, (dy / d) * speed, obj.r);
        obj.x = moved.x;
        obj.y = moved.y;
    }
    function nearestBlockingTrap(hunter, mumin) {
        let minD = Infinity, nearest = null;
        for (const t of traps) {
            if (!t.active || t.burning != null) continue;
            const d = Math.hypot(t.x - mumin.x, t.y - mumin.y);
            if (d < minD) { minD = d; nearest = t; }
        }
        return nearest;
    }

    // Fire bolt
    function fireIceBolt() {
        if (boka.ammoAlt <= 0) return;
        const dirLen = Math.hypot(boka.lookX, boka.lookY) || 1;
        const ux = boka.lookX / dirLen, uy = boka.lookY / dirLen;
        boka.ammoAlt--;
        ammoAltFill.style.width = Math.min(100, (boka.ammoAlt / 100) * 100) + '%';
        iceBolts.push({ x: boka.x + ux * 16, y: boka.y + uy * 16, vx: ux * 7.0, vy: uy * 7.0, ttl: 2.5 });
    }

    // Game start
    function startGame(restart = false) {
        if (restart) {
            score = 0;
            level = levelFromCode(codeInput.value.trim().toUpperCase()) || 1;
        }
        resetLevel();
        playing = true;
        paused = false;
        pauseOv.hidden = true;
        startBackground();
        lastTick = performance.now();
        requestAnimationFrame(update);
    }

    // Update loop
    function update(now) {
        if (!playing) return;
        const d = diff(level);
        const dt = Math.min(0.033, (now - lastTick) / 16.666);
        lastTick = now;
        if (paused) { draw(); requestAnimationFrame(update); return; }

        if (boka.charging) boka.chargeT += dt;

        if (boka.cloudActive) {
            boka.cloud -= dt;
            if (boka.cloud <= 0) {
                boka.cloud = 0;
                boka.cloudActive = false;
            }
        }
        if (boka.rooted > 0) boka.rooted -= dt;
        if (boka.globalFreeze > 0) boka.globalFreeze -= dt;
        globalFreezeT.textContent = boka.globalFreeze > 0 ? Math.ceil(boka.globalFreeze) + 's' : '—';

        if (boka.growT > 0) {
            boka.growT = Math.max(0, boka.growT - dt);
            boka.growSpeedMul = 3.0;
            const t = boka.growT / 15;
            const scale = 1 + (4 - 1) * t;
            boka.r = BOKA_R_BASE * scale;
            if (boka.growT <= 0) {
                boka.growSpeedMul = 1.0;
                boka.r = BOKA_R_BASE;
            }
        } else boka.r = BOKA_R_BASE;

        if (!boka.cloudActive && boka.rooted <= 0) {
            let ax = 0, ay = 0;
            if (keys.has('ArrowUp') || keys.has('KeyW')) ay -= 1;
            if (keys.has('ArrowDown') || keys.has('KeyS')) ay += 1;
            if (keys.has('ArrowLeft') || keys.has('KeyA')) ax -= 1;
            if (keys.has('ArrowRight') || keys.has('KeyD')) ax += 1;
            if (ax || ay) {
                const l = Math.hypot(ax, ay);
                ax /= l;
                ay /= l;
                boka.lookX = ax;
                boka.lookY = ay;
            }
            const sp = BOKA_BASE_SPEED * CELL / 10 * (boka.growSpeedMul || 1.0);
            const moved = moveCircle(boka, ax * sp * dt, ay * sp * dt, boka.r);
            boka.x = moved.x;
            boka.y = moved.y;
        }

        if (boka.poison > 0) {
            boka.hp -= d.projDps * dt;
            boka.poison = Math.max(0, boka.poison - dt);
        }
        hpFill.style.width = Math.max(0, Math.min(100, (boka.hp / HP_MAX) * 100)) + '%';

        if (hunter.alive) {
            if (hunter.frozen > 0) hunter.frozen -= dt;
            else {
                const trapped = mumins.find(m => m.alive && m.trapped);
                if (trapped) {
                    const nextTrap = nearestBlockingTrap(hunter, trapped);
                    if (nextTrap) {
                        if (nextTrap.active && nextTrap.burning == null) {
                            goTowards(hunter, nextTrap.x, nextTrap.y, d.hunterSpeed);
                            if (Math.hypot(hunter.x - nextTrap.x, hunter.y - nextTrap.y) < 14) nextTrap.burning = 0;
                        } else {
                            goTowards(hunter, trapped.x, trapped.y, d.hunterSpeed);
                            if (Math.hypot(hunter.x - trapped.x, hunter.y - trapped.y) < 14) {
                                trapped.trapped = false;
                                trapped.frozen = 0;
                            }
                        }
                    } else {
                        goTowards(hunter, trapped.x, trapped.y, d.hunterSpeed);
                        if (Math.hypot(hunter.x - trapped.x, hunter.y - trapped.y) < 14) {
                            trapped.trapped = false;
                            trapped.frozen = 0;
                        }
                    }
                } else {
                    const activeTrap = traps.find(t => t.active);
                    if (activeTrap) {
                        goTowards(hunter, activeTrap.x, activeTrap.y, d.hunterSpeed);
                        if (Math.hypot(hunter.x - activeTrap.x, hunter.y - activeTrap.y) < 14 && activeTrap.burning == null) activeTrap.burning = 0;
                    } else {
                        goTowards(hunter, boka.x, boka.y, d.hunterSpeed);
                        hunter.tShot -= dt;
                        const dx = boka.x - hunter.x, dy = boka.y - hunter.y, distH = Math.hypot(dx, dy);
                        if (hunter.tShot <= 0 && distH < HUNTER_AIM_RANGE && !(boka.cloudActive && boka.rooted > 0)) {
                            const speed = d.hunterProjSpeed;
                            projs.push({ x: hunter.x, y: hunter.y, vx: (dx / distH) * speed, vy: (dy / distH) * speed, ttl: 6 });
                            hunter.tShot = d.fireCooldown * (0.9 + Math.random() * 0.4);
                        }
                    }
                }
            }
            freezeT.textContent = (hunter.frozen > 0 ? Math.ceil(hunter.frozen) + 's' : '0s');
        } else freezeT.textContent = '—';

        for (let i = projs.length - 1; i >= 0; i--) {
            const p = projs[i];
            p.ttl -= dt;
            if (p.ttl <= 0) { projs.splice(i, 1); continue; }
            const moved = moveCircle(p, p.vx, p.vy, 2);
            p.x = moved.x;
            p.y = moved.y;
            if (Math.hypot(p.x - boka.x, p.y - boka.y) < boka.r + 4) {
                boka.poison = 2.5;
                projs.splice(i, 1);
            }
        }

        for (let i = iceBolts.length - 1; i >= 0; i--) {
            const b = iceBolts[i];
            b.ttl -= dt;
            if (b.ttl <= 0) { iceBolts.splice(i, 1); continue; }
            const moved = moveCircle(b, b.vx, b.vy, 2);
            b.x = moved.x;
            b.y = moved.y;
            for (const m of mumins) {
                if (!m.alive) continue;
                if (Math.hypot(b.x - m.x, b.y - m.y) < m.r + 4) {
                    m.frozen = Math.max(m.frozen, 10.0);
                    b.ttl = 0;
                    break;
                }
            }
            if (hunter.alive && Math.hypot(b.x - hunter.x, b.y - hunter.y) < HUNTER_R + 4) {
                if (hunter.frozen <= 0) hunter.freezeHits++;
                hunter.frozen = Math.max(hunter.frozen, 60.0);
                if (hunter.freezeHits >= 10) {
                    hunter.alive = false;
                    sfxDeathKij.currentTime = 0;
                    sfxDeathKij.play();
                    summonHattis(true);
                } else if (hunter.freezeHits % 3 === 0) {
                    summonHattis(false);
                }
                b.ttl = 0;
            }
            for (const h of hattis) {
                if (Math.hypot(b.x - h.x, b.y - h.y) < h.r * h.scale + 6) {
                    h.scale *= 1.10;
                    b.ttl = 0;
                    break;
                }
            }
        }

        for (let i = mumins.length - 1; i >= 0; i--) {
            const m = mumins[i];
            if (!m.alive) continue;
            if (m.frozen > 0) {
                m.frozen -= dt;
                continue;
            }
            if (m.trapped) continue;
            const dx = boka.x - m.x, dy = boka.y - m.y, dist = Math.hypot(dx, dy);
            if (dist < 260 && !inHouse(m.x, m.y)) {
                let nearestHouse = null, minDist = Infinity;
                for (const h of houseCells) {
                    const hd = Math.hypot(m.x - (h.c * CELL + CELL / 2), m.y - (h.r * CELL + CELL / 2));
                    if (hd < minDist) {
                        minDist = hd;
                        nearestHouse = h;
                    }
                }
                if (nearestHouse) {
                    goTowards(m, nearestHouse.c * CELL + CELL / 2, nearestHouse.r * CELL + CELL / 2, 2.5);
                    m.hide = inHouse(m.x, m.y);
                }
            } else if (dist < boka.r + m.r && !m.hide) {
                m.alive = false;
                score += 10;
                sfxDeathMumin.currentTime = 0;
                sfxDeathMumin.play();
            } else {
                m.dir += (Math.random() - 0.5) * 0.5;
                const moved = moveCircle(m, Math.cos(m.dir) * 2, Math.sin(m.dir) * 2, m.r);
                m.x = moved.x;
                m.y = moved.y;
            }
        }

        for (let i = hattis.length - 1; i >= 0; i--) {
            const h = hattis[i];
            if (h.flee) {
                const edgeX = h.x < COLS * CELL / 2 ? 0 : COLS * CELL;
                const edgeY = h.y < ROWS * CELL / 2 ? 0 : ROWS * CELL;
                goTowards(h, edgeX, edgeY, 3.5);
                if (h.x < 5 || h.x > COLS * CELL - 5 || h.y < 5 || h.y > ROWS * CELL - 5) {
                    hattis.splice(i, 1);
                    continue;
                }
            } else {
                goTowards(h, boka.x, boka.y, 3.5);
                if (Math.hypot(h.x - boka.x, h.y - boka.y) < boka.r + h.r * h.scale) {
                    boka.hp -= 20;
                    h.flee = true;
                }
            }
        }
        checkHattisClear();

        for (let i = mushrooms.length - 1; i >= 0; i--) {
            const m = mushrooms[i];
            if (!m.alive) continue;
            if (Math.hypot(m.x - boka.x, m.y - boka.y) < boka.r + m.r) {
                m.alive = false;
                boka.growT = 15.0;
            }
        }

        updatePickups(boltPickups, 'alt', dt);
        updatePickups(cloudPickups, 'cloud', dt);
        updateBobek(dt);
        updateTraps(dt);

        for (let i = blueClouds.length - 1; i >= 0; i--) {
            blueClouds[i].ttl -= dt;
            if (blueClouds[i].ttl <= 0) blueClouds.splice(i, 1);
        }

        if (boka.hp <= 0) {
            playing = false;
            overlay.hidden = false;
            stopAllMusic();
        }

        if (mumins.every(m => !m.alive)) {
            level++;
            if (level > 30) {
                playing = false;
                startWinLoop();
                overlay.hidden = false;
            } else {
                resetLevel();
                startWinLoop();
                setTimeout(startBackground, 2000);
            }
        }

        updateHUD();
        draw();
        requestAnimationFrame(update);
    }

    // Draw
    function draw() {
        const th = themeFor(level);
        ctx.fillStyle = th.path;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        for (let r = 0; r < ROWS; r++) {
            for (let c = 0; c < COLS; c++) {
                if (grid[r][c] === 1) {
                    ctx.fillStyle = th.wall;
                    ctx.fillRect(c * CELL, r * CELL, CELL, CELL);
                } else if (grid[r][c] === 2) {
                    ctx.fillStyle = shade(th.accent, 0.8);
                    ctx.fillRect(c * CELL, r * CELL, CELL, CELL);
                    ctx.fillStyle = shade(th.accent, 0.6);
                    ctx.fillRect(c * CELL + 4, r * CELL + 4, CELL - 8, CELL - 8);
                }
            }
        }

        for (const t of trees) {
            ctx.fillStyle = shade(th.wall, 0.7);
            ctx.beginPath();
            ctx.arc(t.x, t.y, 8, 0, Math.PI * 2);
            ctx.fill();
        }

        for (const m of mushrooms) {
            if (!m.alive) continue;
            ctx.fillStyle = '#ff4040';
            ctx.beginPath();
            ctx.arc(m.x, m.y, m.r, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(m.x - 2, m.y - 4, 4, 6);
        }

        for (const t of traps) {
            if (!t.active && t.buildProgress < 1) {
                ctx.fillStyle = `rgba(255, 255, 255, ${t.buildProgress * 0.5})`;
                ctx.beginPath();
                ctx.arc(t.x, t.y, t.r, 0, Math.PI * 2);
                ctx.fill();
            } else if (t.active) {
                ctx.fillStyle = t.burning != null ? '#ff4040' : '#ffffff';
                ctx.beginPath();
                ctx.arc(t.x, t.y, t.r, 0, Math.PI * 2);
                ctx.fill();
            }
        }

        for (const c of blueClouds) {
            ctx.fillStyle = `rgba(0, 120, 255, ${c.ttl / 7})`;
            ctx.beginPath();
            ctx.arc(c.x, c.y, c.r, 0, Math.PI * 2);
            ctx.fill();
        }

        for (const p of boltPickups) {
            if (!p.alive) continue;
            ctx.fillStyle = '#4190ff';
            ctx.beginPath();
            ctx.moveTo(p.x - 6, p.y);
            ctx.lineTo(p.x, p.y - 10);
            ctx.lineTo(p.x + 6, p.y);
            ctx.lineTo(p.x, p.y + 10);
            ctx.fill();
        }

        for (const p of cloudPickups) {
            if (!p.alive) continue;
            ctx.fillStyle = '#b0e0ff';
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
            ctx.fill();
        }

        for (const m of mumins) {
            if (!m.alive) continue;
            ctx.fillStyle = m.frozen > 0 ? '#a0c0ff' : '#ffffff';
            ctx.beginPath();
            ctx.arc(m.x, m.y, m.r, 0, Math.PI * 2);
            ctx.fill();
            if (m.trapped) {
                ctx.strokeStyle = '#ffffff';
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.arc(m.x, m.y, m.r + 2, 0, Math.PI * 2);
                ctx.stroke();
            }
        }

        if (hunter.alive) {
            ctx.fillStyle = hunter.frozen > 0 ? '#a0c0ff' : '#40c040';
            ctx.beginPath();
            ctx.arc(hunter.x, hunter.y, hunter.r, 0, Math.PI * 2);
            ctx.fill();
        }

        for (const h of hattis) {
            ctx.fillStyle = h.flee ? '#ffffa0' : '#ffd700';
            ctx.beginPath();
            ctx.arc(h.x, h.y, h.r * h.scale, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = '#ffffff';
            for (let i = 0; i < h.fingersL; i++) {
                const angle = Math.PI / 2 + (i - (h.fingersL - 1) / 2) * h.handSpan / h.fingersL;
                ctx.fillRect(h.x - h.r * h.scale - h.armLen, h.y + angle * 4, h.armLen, 2);
            }
            for (let i = 0; i < h.fingersR; i++) {
                const angle = Math.PI / 2 + (i - (h.fingersR - 1) / 2) * h.handSpan / h.fingersR;
                ctx.fillRect(h.x + h.r * h.scale, h.y + angle * 4, h.armLen, 2);
            }
        }

        for (const p of projs) {
            ctx.fillStyle = '#ff4040';
            ctx.beginPath();
            ctx.arc(p.x, p.y, 4, 0, Math.PI * 2);
            ctx.fill();
        }

        for (const b of iceBolts) {
            ctx.fillStyle = '#4190ff';
            ctx.beginPath();
            ctx.arc(b.x, b.y, 4, 0, Math.PI * 2);
            ctx.fill();
        }

        if (bobek.active) {
            ctx.fillStyle = '#a0a0a0';
            ctx.beginPath();
            ctx.arc(bobek.x, bobek.y, bobek.r, 0, Math.PI * 2);
            ctx.fill();
        }

        ctx.fillStyle = boka.poison > 0 ? '#ff4040' : '#7ad1ff';
        ctx.beginPath();
        ctx.arc(boka.x, boka.y, boka.r, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = cave.x ? '#4a4a4a' : 'transparent';
        ctx.beginPath();
        ctx.arc(cave.x, cave.y, cave.r, 0, Math.PI * 2);
        ctx.fill();
    }

    // Initialize
    tSync();
    updateHUDTheme();
})();
