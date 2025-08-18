(() => {
// Constants, helpers, and configuration — mechanics unchanged
const CELL=32, COLS=25, ROWS=18;
const MIN_BOARD=Math.min(COLS*CELL, ROWS*CELL);
const CLOUD_MAX_RADIUS=Math.floor(MIN_BOARD/5);

const HP_MAX=100;
const BOKA_BASE_SPEED=3.1, BOKA_R_BASE=14;
const HUNTER_R=11, HUNTER_AIM_RANGE=360;

function diff(level){
  const t=(level-1)/29;
  return {
    wallDensity: 0.24 + t*0.26,
    carveSteps: 220 + Math.floor(t*180),
    muminBase: 8 + Math.floor(level*1.2),
    hunterSpeed: (2.5 + t*1.2) * (2/3),
    hunterProjSpeed: 4.2 + t*1.4,
    fireCooldown: (1.8*5) * (1.0 - t*0.35),
    projDps: (14/10)*3
  };
}
const THEMES = [
  {name:{en:'Forest',pl:'Las'}, bg:'#0b1c10', path:'#0f2a18', wall:'#23402a', accent:'#2d5b33'},
  {name:{en:'Sea',pl:'Morze'}, bg:'#06202b', path:'#0b2c3a', wall:'#16495c', accent:'#2b7a8a'},
  {name:{en:'Autumn',pl:'Jesień'}, bg:'#1d1208', path:'#2a170b', wall:'#5a2e12', accent:'#7a4a1e'},
  {name:{en:'Winter',pl:'Zima'}, bg:'#0a1520', path:'#0e1f30', wall:'#254a6b', accent:'#9ec9f0'},
  {name:{en:'Spring',pl:'Wiosna'}, bg:'#0c1d12', path:'#12321c', wall:'#2f663d', accent:'#5cbf7a'},
  {name:{en:'Night',pl:'Noc'}, bg:'#05070e', path:'#0a1020', wall:'#1a2a4a', accent:'#3c5a8a'},
  {name:{en:'Sunny',pl:'Słonecznie'}, bg:'#13200d', path:'#1a2c12', wall:'#355a2a', accent:'#6bcf66'},
  {name:{en:'Cloudy',pl:'Pochmurno'}, bg:'#0e1612', path:'#15211b', wall:'#2a4237', accent:'#6aa39a'},
  {name:{en:'Fog',pl:'Mgła'}, bg:'#0a1614', path:'#0e1f1d', wall:'#1f3d3a', accent:'#8fd0cc'},
  {name:{en:'Storm',pl:'Burza'}, bg:'#0a0d14', path:'#10182a', wall:'#233259', accent:'#6aa0ff'}
];
function themeFor(level){ return THEMES[(level-1)%THEMES.length]; }
function shade(hex, f){
  const c = hex.replace('#','');
  const r=parseInt(c.substr(0,2),16), g=parseInt(c.substr(2,2),16), b=parseInt(c.substr(4,2),16);
  return `rgb(${Math.round(r*f)},${Math.round(g*f)},${Math.round(b*f)})`;
}
const WEATHERS = [
  {en:'Day',pl:'Dzień'}, {en:'Night',pl:'Noc'}, {en:'Rain',pl:'Deszcz'},
  {en:'Fog',pl:'Mgła'}, {en:'Sun',pl:'Słońce'}, {en:'Cloudy',pl:'Pochmurno'}
];
function randomWeather(){ return WEATHERS[Math.floor(Math.random()*WEATHERS.length)]; }

// Level codes
function levelCodeFor(level){
  const base="ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let s=""; let x=level*9301+49297;
  for(let i=0;i<7;i++){ x=(x*1103515245+12345)>>>0; s+=base[x%base.length]; }
  return s;
}
function levelFromCode(code){
  code=(code||"").toUpperCase();
  for(let L=1;L<=30;L++){ if(levelCodeFor(L)===code) return L; }
  return null;
}

// i18n
let LANG='en';
const I={
  title:{en:'BUKA in Moomin Valley',pl:'BUKA w Dolinie Muminków'},
  help:{en:'Guide',pl:'Poradnik'},
  targets:{en:'Targets',pl:'Cele'},
  moomins:{en:'Moomins',pl:'Muminki'},
  bolts:{en:'Bolts',pl:'Pioruny'},
  clouds:{en:'Clouds',pl:'Chmurki'},
  mushrooms:{en:'Mushrooms',pl:'Muchomory'},
  theme:{en:'Theme',pl:'Motyw'},
  weather:{en:'Weather',pl:'Pogoda'},
  score:{en:'Score',pl:'Punkty'},
  progress:{en:'Progress',pl:'Postęp'},
  level:{en:'Level',pl:'Poziom'},
  hunterFreeze:{en:'Snufkin freeze',pl:'Zamrożenie Włóczykija'},
  globalFreeze:{en:'Global Freeze',pl:'Global Freeze'},
  levelCode:{en:'Level code',pl:'Kod poziomu'},
  musicOn:{en:'Music: ON',pl:'Muzyka: ON'},
  musicOff:{en:'Music: OFF',pl:'Muzyka: OFF'},
  startTitle:{en:'Buka awakens the frost…',pl:'Buka budzi mróz…'},
  controls:{en:'Controls: Shift – cloud (hold 3s: strong; ≥6s: global), Ctrl – bolt, WASD/Arrows – move, P – pause, R – restart.',
            pl:'Sterowanie: Shift – chmura (trzymaj 3s: mocna; ≥6s: globalna), Ctrl – piorun, WASD/Strzałki – ruch, P – pauza, R – restart.'},
  controlsShort:{en:'Shift – cloud (3s/6s), Ctrl – bolt, WASD/Arrows – move, P – resume, R – restart.',
                 pl:'Shift – chmura (3s/6s), Ctrl – piorun, WASD/Strzałki – ruch, P – wznów, R – restart.'},
  codeLabel:{en:'Level code (7 chars)',pl:'Kod poziomu (7 znaków)'},
  applyCode:{en:'Codes',pl:'Kody'},
  start:{en:'Start',pl:'Start'},
  pause:{en:'Pause',pl:'Pauza'},
  resume:{en:'Resume',pl:'Wznów'},
  guideTitle:{en:'Game guide',pl:'Poradnik gry'},
  close:{en:'Close',pl:'Zamknij'},
  welcomeH:{en:'Welcome to Moomin Valley',pl:'Witaj w Dolinie Muminków'},
  welcomeP:{en:'You are Buka – a frigid force. Eliminate all Moomins while dealing with Snufkin and Hattifatteners.',
            pl:'Wcielasz się w Bukę – lodowatą siłę. Wyeliminuj wszystkie Muminki, radząc sobie z Włóczykijem i Hatifnatami.'},
  controlsH:{en:'Controls',pl:'Sterowanie'},
  ctrlMove:{en:'Move: WASD or Arrows.',pl:'Ruch: WASD lub Strzałki.'},
  ctrlBolt:{en:'Bolt (ice shot): Ctrl – consumes bolt ammo, freezes the target.',pl:'Piorun: Ctrl – zużywa amunicję, zamraża cel.'},
  ctrlCloud:{en:'Frost cloud: hold Shift to charge:',pl:'Chmura mrozu: przytrzymaj Shift, aby ładować:'},
  ctrlCloudS:{en:'Tap: small cloud (7s), freezes nearby.',pl:'Krótkie naciśnięcie: mała chmura (7s), mrozi w pobliżu.'},
  ctrlCloudM:{en:'≥3s: strong cloud (bigger radius, 30s freeze), costs 10 clouds.',pl:'≥3s: silna chmura (większy zasięg, 30s), koszt 10 chmurek.'},
  ctrlCloudG:{en:'≥6s: global freeze for 60s, costs 100 clouds.',pl:'≥6s: globalne zamrożenie na 60s, koszt 100 chmurek.'},
  ctrlPause:{en:'P – pause/resume.',pl:'P – pauza/wznów.'},
  ctrlRestart:{en:'R – restart level.',pl:'R – restart poziomu.'},
  goalH:{en:'Goal',pl:'Cel'},
  goalP:{en:'Eliminate all Moomins on each level. The Progress bar shows completion. There are 30 levels with rising difficulty and themes.',
         pl:'Wyeliminuj wszystkie Muminki na każdym poziomie. Pasek Postęp pokazuje ukończenie. 30 poziomów o rosnącej trudności i motywach.'},
  hudH:{en:'Resources & HUD',pl:'Zasoby i HUD'},
  hudHp:{en:'HP: green bar – avoid Snufkin’s flames and Hattifatteners.',pl:'Życie: zielony pasek – unikaj ogników i Hatifnatów.'},
  hudClouds:{en:'Clouds: blue bar – for clouds and global freeze.',pl:'Chmurki: niebieski pasek – do chmur i globalnego zamrożenia.'},
  hudBolts:{en:'Bolts: light blue bar – each shot costs 1.',pl:'Pioruny: jasnoniebieski pasek – każdy strzał koszt 1.'},
  hudGf:{en:'Global Freeze: remaining time.',pl:'Global Freeze: pozostały czas.'},
  hudCode:{en:'Level code: 7 chars – can be used on start screen to jump to a level.',pl:'Kod poziomu: 7 znaków – do skoku na poziom.'},
  objectsH:{en:'Objects',pl:'Obiekty'},
  objMoomins:{en:'Moomins: when they see you, they run to the house; outside you can eliminate by proximity.',pl:'Muminki: gdy cię widzą, biegną do domku; poza nim możesz je wyeliminować bliskością.'},
  objHunter:{en:'Snufkin: shoots flames (DoT). Freeze with bolts/clouds; summons Hattifatteners; disappears after many freezes.',pl:'Włóczykij: strzela ognikami (DoT). Zamrażaj piorunami/chmurą; wzywa Hatifnatów; znika po wielu zamrożeniach.'},
  objHatti:{en:'Hattifatteners: chase Buka; contact hurts, then they flee; bolt hits may grow them.',pl:'Hatifnatowie: gonią Bukę; kontakt rani, potem uciekają; piorun może ich powiększyć.'},
  objBobek:{en:'Bobek: call in the cave (center + release Shift). Builds webs; Snufkin can burn them.',pl:'Bobek: wezwij w jaskini (środek + puść Shift). Buduje pajęczyny; Włóczykij je pali.'},
  objTraps:{en:'Traps: immobilize Moomins; burned ones vanish.',pl:'Pułapki: unieruchamiają Muminki; spalone znikają.'},
  objBoltPick:{en:'Bolt pickup: +10 ammo.',pl:'Pioruny – pickup: +10 amunicji.'},
  objCloudPick:{en:'Cloud pickup: +5 clouds.',pl:'Chmurki – pickup: +5 chmurek.'},
  objShrooms:{en:'Mushrooms: 15s growth (3x speed, bigger reach).',pl:'Muchomory: 15s wzrost (3x prędkość, większy zasięg).'},
  objHouse:{en:'House: 3×3 passable; can’t eliminate inside.',pl:'Domek: 3×3 przechodni; w środku nie wyeliminujesz.'},
  objCave:{en:'Cave: Bobek call point.',pl:'Jaskinia: punkt wywołania Bobka.'},
  tacticsH:{en:'Tactics',pl:'Taktyka'},
  tac1:{en:'Combine clouds and bolts.',pl:'Łącz chmury i pioruny.'},
  tac2:{en:'Place webs near house routes.',pl:'Stawiaj pajęczyny przy trasach do domku.'},
  tac3:{en:'Watch Snufkin’s aim.',pl:'Uważaj na celowanie Włóczykija.'},
  tac4:{en:'Save Global Freeze for crises.',pl:'Global Freeze zostaw na kryzysy.'},
  tac5:{en:'Use mushrooms to sweep.',pl:'Czyść trudne miejsca muchomorami.'},
  codesH:{en:'Level codes',pl:'Kody poziomów'},
  codesP:{en:'Enter a code on start to jump to a level.',pl:'Wpisz kod na starcie, aby wskoczyć do poziomu.'},
  musicH:{en:'Music',pl:'Muzyka'},
  musicP:{en:'Music ON/OFF toggles background/panic tracks.',pl:'Muzyka ON/OFF przełącza tło i motyw paniki.'},
  glhfH:{en:'Good luck!',pl:'Powodzenia!'},
  glhfP:{en:'Experiment with map, weather and themes.',pl:'Eksperymentuj z mapą, pogodą i motywami.'}
};
function i18nText(key){ return (I[key]||{})[LANG]||''; }
function tSync(){
  document.querySelectorAll('[data-i18n]').forEach(el=>{
    const k=el.getAttribute('data-i18n'); if(!I[k]) return;
    el.textContent = I[k][LANG];
  });
  document.title = i18nText('title');
}

// DOM
const canvas=document.getElementById('game'), ctx=canvas.getContext('2d');
const overlay=document.getElementById('overlay'), startBtn=document.getElementById('startBtn');
const pauseOv=document.getElementById('pause'), resumeBtn=document.getElementById('resumeBtn');
const leftEl=document.getElementById('left'), mushLeftEl=document.getElementById('mushLeft');
const lvlEl=document.getElementById('level'), scoreEl=document.getElementById('score');
const levelCodeEl=document.getElementById('levelCode');
const themeName=document.getElementById('themeName'), weatherName=document.getElementById('weatherName');
const hpFill=document.getElementById('hpFill');
const cloudStockFill=document.getElementById('cloudStockFill'), ammoAltFill=document.getElementById('ammoAltFill');
const freezeT=document.getElementById('freezeT'), progressEl=document.getElementById('progress'), globalFreezeT=document.getElementById('globalFreezeT');
const musicBtn=document.getElementById('musicBtn'), musicBg=document.getElementById('musicBg'), musicPanic=document.getElementById('musicPanic');
const sfxBobek=document.getElementById('sfxBobek'), sfxDeathMumin=document.getElementById('sfxDeathMumin'), sfxDeathKij=document.getElementById('sfxDeathKij'), sfxWin=document.getElementById('sfxWin'), sfxAmmo=document.getElementById('sfxAmmo');
const panicDim=document.getElementById('panicDim'), globalFog=document.getElementById('globalFog');

// Level codes – UI
const codeInput=document.getElementById('codeInput');
const applyCodeBtn=document.getElementById('applyCodeBtn');
const codeStatus=document.getElementById('codeStatus');

// Modal help
const helpBtn=document.getElementById('helpBtn');
const helpModal=document.getElementById('helpModal');
const helpClose=document.getElementById('helpClose');

// Language button
const langBtn=document.getElementById('langBtn');

// Touch controls
const joystick = document.getElementById('joystick');
const thumb = joystick.querySelector('.thumb');
const boltBtn = document.getElementById('boltBtn');
const cloudBtn = document.getElementById('cloudBtn');
const pauseBtn = document.getElementById('pauseBtn');
const resetBtn = document.getElementById('resetBtn');
const lockBtn = document.getElementById('lockBtn');
let moveX = 0, moveY = 0;
let joyTouchId = null;
let resetLocked = true;
resetBtn.disabled = true;
lockBtn.textContent = '🔒';

let musicOn=true;
function stopAllMusic(){ musicBg.pause(); musicPanic.pause(); sfxWin.pause(); }
function startBackground(){ if(!musicOn) return; stopAllMusic(); musicBg.currentTime=0; musicBg.loop=true; musicBg.play(); }
function startPanic(){ if(!musicOn) return; musicBg.pause(); musicPanic.currentTime=0; musicPanic.loop=false; musicPanic.play(); }
function startWinLoop(){ stopAllMusic(); sfxWin.currentTime=0; sfxWin.loop=true; sfxWin.play(); }

// Game state
const boka=baseBoka();
function baseBoka(){
  return {x:48,y:48,r:BOKA_R_BASE,hp:HP_MAX,poison:0,
    ammoAlt:100, ammoCloud:5, cloud:0, cloudActive:false, rooted:0, lookX:1, lookY:0,
    growT:0, growSpeedMul:1.0, chargeT:0, charging:false, globalFreeze:0};
}
const hunter={alive:true, x:COLS*CELL-80, y:ROWS*CELL-80, r:HUNTER_R, frozen:0, freezeHits:0, tShot:0, burning:null};
const mumins=[], fearClouds=[], blueClouds=[], projs=[], iceBolts=[];
const boltPickups=[], cloudPickups=[]; const pickupRespawn=60;
const hattis=[]; let panic=false;
const cave={x:COLS*CELL-64,y:ROWS*CELL-64,r:26};
const bobek={active:false, x:0,y:0,r:8, dir:0, speed:4.5, callsLeft:3, plan:[], building:null};
const traps=[];
let level=1, score=0, playing=false, paused=false, weather='Dzień';
let lastTick=0;

// Input
const keys=new Set();
window.addEventListener('keydown',e=>{
  const mv=['ArrowUp','ArrowDown','ArrowLeft','ArrowRight','KeyW','KeyA','KeyS','KeyD'];
  if(mv.includes(e.code)){ e.preventDefault(); keys.add(e.code); }
  if(e.code==='ShiftLeft' || e.code==='ShiftRight'){ e.preventDefault(); if(!boka.charging){ boka.charging=true; boka.chargeT=0; } }
  if(e.code==='ControlLeft' || e.code==='ControlRight'){ e.preventDefault(); fireIceBolt(); }
  if(e.code==='KeyP'){ e.preventDefault(); paused=!paused; pauseOv.hidden=!paused; }
  if(e.code==='KeyR'){ e.preventDefault(); startGame(true); }
});
window.addEventListener('keyup',e=>{
  if(e.code==='ShiftLeft' || e.code==='ShiftRight'){ e.preventDefault();
    if(inCaveCenter(boka.x,boka.y)){ triggerBobek(); }
    else { releaseCloudCharge(); }
    boka.charging=false;
  }
  const mv=['ArrowUp','ArrowDown','ArrowLeft','ArrowRight','KeyW','KeyA','KeyS','KeyD'];
  if(mv.includes(e.code)) keys.delete(e.code);
});
musicBtn.addEventListener('click',()=>{
  musicOn=!musicOn;
  musicBtn.textContent = musicOn ? i18nText('musicOn') : i18nText('musicOff');
  if(!musicOn){ stopAllMusic(); } else { if(panic) startPanic(); else startBackground(); }
});
startBtn.addEventListener('click',(e)=>{ e.preventDefault(); startGame(true); });
resumeBtn.addEventListener('click',(e)=>{ e.preventDefault(); paused=false; pauseOv.hidden=true; });

// Poradnik – modal
helpBtn.addEventListener('click',(e)=>{ e.preventDefault(); helpModal.hidden=false; });
helpClose.addEventListener('click',(e)=>{ e.preventDefault(); helpModal.hidden=true; });
helpModal.addEventListener('click',(e)=>{ const card=e.target.closest('.modal-card'); if(!card) helpModal.hidden=true; });

// Język
function applyLang(){
  // Ustaw teksty data-i18n
  tSync();
  // Nazwa motywu i pogody
  const th=themeFor(level);
  themeName.textContent = th.name[LANG];
  weatherName.textContent = weather;
  // Przycisk pokazuje język do przełączenia
  langBtn.textContent = (LANG==='en'?'Polski':'English');
  // Przycisk muzyki
  musicBtn.textContent = musicOn ? i18nText('musicOn') : i18nText('musicOff');
}
langBtn.addEventListener('click',(e)=>{
  e.preventDefault();
  LANG = (LANG==='en'?'pl':'en');
  // odśwież pogodę/motyw nazwy
  const th=themeFor(level);
  themeName.textContent = th.name[LANG];
  // jeżeli aktualny string pogody nie jest w słowniku, losuj nową etykietę w bieżącym języku
  applyLang();
});

// Level codes – safe: only set starting level (1..30)
applyCodeBtn.addEventListener('click',()=>{
  const code=(codeInput.value||'').trim().toUpperCase();
  const msgShort = (LANG==='en'?'Enter 7 chars.':'Wpisz 7 znaków.');
  const msgOk = (LANG==='en'?'Loaded level: ':'Załadowano poziom: ');
  const msgBad = (LANG==='en'?'Invalid code.':'Nieprawidłowy kod.');
  if(!code || code.length!==7){ codeStatus.textContent=msgShort; return; }
  const L=levelFromCode(code);
  if(L){ level=L; codeStatus.textContent=msgOk+L; }
  else { codeStatus.textContent=msgBad; }
});

// Touch controls handling
joystick.addEventListener('touchstart', e => {
  e.preventDefault();
  if (joyTouchId === null) {
    joyTouchId = e.changedTouches[0].identifier;
    updateJoy(e.changedTouches[0]);
  }
});
joystick.addEventListener('touchmove', e => {
  e.preventDefault();
  for (const t of e.changedTouches) {
    if (t.identifier === joyTouchId) {
      updateJoy(t);
      break;
    }
  }
});
joystick.addEventListener('touchend', e => {
  e.preventDefault();
  for (const t of e.changedTouches) {
    if (t.identifier === joyTouchId) {
      joyTouchId = null;
      thumb.style.left = '50%';
      thumb.style.top = '50%';
      moveX = 0;
      moveY = 0;
      break;
    }
  }
});
function updateJoy(touch) {
  const rect = joystick.getBoundingClientRect();
  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 2;
  let dx = touch.clientX - centerX;
  let dy = touch.clientY - centerY;
  const dist = Math.hypot(dx, dy);
  const radius = rect.width / 2;
  if (dist > radius) {
    dx = (dx / dist) * radius;
    dy = (dy / dist) * radius;
  }
  thumb.style.left = (50 + (dx / radius * 50)) + '%';
  thumb.style.top = (50 + (dy / radius * 50)) + '%';
  moveX = dx / radius;
  moveY = dy / radius;
}
boltBtn.addEventListener('touchstart', e => { e.preventDefault(); fireIceBolt(); });
cloudBtn.addEventListener('touchstart', e => { e.preventDefault(); if (!boka.charging) { boka.charging = true; boka.chargeT = 0; } });
cloudBtn.addEventListener('touchend', e => { e.preventDefault(); if (inCaveCenter(boka.x, boka.y)) { triggerBobek(); } else { releaseCloudCharge(); } boka.charging = false; });
pauseBtn.addEventListener('touchend', e => { e.preventDefault(); paused = !paused; pauseOv.hidden = !paused; });
resetBtn.addEventListener('touchend', e => { e.preventDefault(); if (!resetLocked) startGame(true); });
lockBtn.addEventListener('touchend', e => { e.preventDefault(); resetLocked = !resetLocked; resetBtn.disabled = resetLocked; lockBtn.textContent = resetLocked ? '🔒' : '🔓'; });

// Map and tiles
let grid=[], trees=[], mushrooms=[], houseCells=[];
function isWall(c,r){if(r<0||c<0||r>=ROWS||c>=COLS)return true;return grid[r][c]===1}
function genMap(level){
  const d=diff(level);
  trees=[]; mushrooms=[]; houseCells=[];
  grid=Array.from({length:ROWS},()=>Array(COLS).fill(0));
  for(let r=0;r<ROWS;r++)for(let c=0;c<COLS;c++) if(r===0||c===0||r===ROWS-1||c===COLS-1) grid[r][c]=1;
  for(let r=1;r<ROWS-1;r++) for(let c=1;c<COLS-1;c++) if(Math.random()<d.wallDensity) grid[r][c]=1;
  let snakes=10+Math.floor(level/2);
  while(snakes--){
    let r=(ROWS>>1)+((Math.random()*6)|0)-3, c=(COLS>>1)+((Math.random()*6)|0)-3;
    for(let i=0;i<d.carveSteps;i++){
      grid[r][c]=0;
      const dir=(Math.random()*4)|0;
      if(dir===0&&r>1)r--; if(dir===1&&r<ROWS-2)r++;
      if(dir===2&&c>1)c--; if(dir===3&&c<COLS-2)c++;
    }
  }
  // 3x3 house – tile 2 (passable)
  let dr=0,dc=0;
  for(let tries=0;tries<500;tries++){
    const r=2+((Math.random()*(ROWS-5))|0), c=2+((Math.random()*(COLS-5))|0);
    let ok=true; for(let rr2=r;rr2<r+3;rr2++) for(let cc=c;cc<c+3;cc++) if(isWall(cc,rr2)) ok=false;
    if(ok){dr=r;dc=c;break;}
  }
  for(let rr2=dr;rr2<dr+3;rr2++) for(let cc=dc;cc<dc+3;cc++){ grid[rr2][cc]=2; houseCells.push({c:cc,r:rr2}); }

  const treeCount=18+Math.floor(level*1.4);
  for(let i=0;i<treeCount;i++){
    const c=1+((Math.random()*(COLS-2))|0), r=1+((Math.random()*(ROWS-2))|0);
    if(grid[r][c]!==0 && grid[r][c]!==2) continue;
    const x=c*CELL+CELL/2, y=r*CELL+CELL/2;
    trees.push({x,y});
    if(Math.random()<0.28) mushrooms.push({x:x+((Math.random()*18)|0)-9, y:y+6+((Math.random()*7)|0), r:6, alive:true, timer:0});
  }
}
function inHouse(x,y){const c=(x/CELL)|0, r=(y/CELL)|0; return grid[r] && grid[r][c]===2;}
function inCaveCenter(x,y){return Math.hypot(x-cave.x,y-cave.y)<cave.r*0.6;}

// Level reset
function resetLevel(){
  mumins.length=0; fearClouds.length=0; blueClouds.length=0; projs.length=0; iceBolts.length=0;
  boltPickups.length=0; cloudPickups.length=0; traps.length=0; hattis.length=0;
  panic=false; panicDim.hidden=true; globalFog.hidden=true; globalFog.style.opacity='0';

  genMap(level);

  Object.assign(boka, baseBoka());
  hunter.alive=true; hunter.x=COLS*CELL-80; hunter.y=ROWS*CELL-80; hunter.frozen=0; hunter.freezeHits=0; hunter.tShot=0; hunter.burning=null;
  bobek.active=false; bobek.callsLeft=3; bobek.plan=[]; bobek.building=null;

  const d=diff(level);
  for(let i=0;i<d.muminBase;i++){
    const c=1+((Math.random()*(COLS-2))|0), r=1+((Math.random()*(ROWS-2))|0);
    if(grid[r][c]!==0){ i--; continue; }
    const x=c*CELL+CELL/2, y=r*CELL+CELL/2;
    if(Math.hypot(x-boka.x,y-boka.y)<80){ i--; continue; }
    mumins.push({x,y,r:11, alive:true, hide:false, frozen:0, dir:Math.random()*Math.PI*2, trapped:false});
  }
  placePickups(boltPickups,5,'bolt');
  placePickups(cloudPickups,5,'cloud');

  updateHUDTheme(); updateHUD();
}

// HUD
function updateHUDTheme(){
  const th=themeFor(level);
  document.documentElement.style.setProperty('--bg', th.bg);
  document.documentElement.style.setProperty('--path', th.path);
  document.documentElement.style.setProperty('--wall', th.wall);
  document.documentElement.style.setProperty('--accent', th.accent);
  themeName.textContent=th.name[LANG];
  const w=randomWeather(); weather = w[LANG]; weatherName.textContent=weather;
  levelCodeEl.textContent=levelCodeFor(level);
}
function updateHUD(){
  leftEl.textContent=mumins.filter(m=>m.alive).length;
  mushLeftEl.textContent=mushrooms.filter(m=>m.alive!==false).length;
  lvlEl.textContent=level;
  scoreEl.textContent=score;
  ammoAltFill.style.width=Math.min(100,(boka.ammoAlt/100)*100)+'%';
  cloudStockFill.style.width=Math.min(100,(boka.ammoCloud/20)*100)+'%';
  hpFill.style.width=Math.max(0, Math.min(100,(boka.hp/HP_MAX)*100))+'%';
  globalFreezeT.textContent = boka.globalFreeze>0 ? Math.ceil(boka.globalFreeze)+'s' : '—';
}

// Pickups
function placePickups(arr,count,shape){
  for(let i=0;i<count;i++){
    let x=0,y=0;
    for(let t=0;t<100;t++){
      const c=1+((Math.random()*(COLS-2))|0), r=1+((Math.random()*(ROWS-2))|0);
      if(grid[r][c]!==0) continue;
      x=c*CELL+CELL/2; y=r*CELL+CELL/2; break;
    }
    arr.push({x,y,r:10, alive:true, shape, timer:0});
  }
}
function updatePickups(arr, kind, dt){
  for(let i=0;i<arr.length;i++){
    const p=arr[i];
    if(p.alive && Math.hypot(p.x-boka.x,p.y-boka.y)<boka.r+p.r){
      if(kind==='alt'){
        boka.ammoAlt=Math.min(999,boka.ammoAlt+10); ammoAltFill.style.width=Math.min(100,(boka.ammoAlt/100)*100)+'%';
      } else {
        boka.ammoCloud+=5; cloudStockFill.style.width=Math.min(100,(boka.ammoCloud/20)*100)+'%';
      }
      sfxAmmo.currentTime=0; sfxAmmo.play();
      p.alive=false; p.timer=pickupRespawn;
    } else if(!p.alive && p.timer>0){
      p.timer-=dt;
      if(p.timer<=0){
        for(let t=0;t<100;t++){
          const c=1+((Math.random()*(COLS-2))|0), r=1+((Math.random()*(ROWS-2))|0);
          if(grid[r][c]!==0) continue;
          p.x=c*CELL+CELL/2; p.y=r*CELL+CELL/2; break;
        }
        p.alive=true;
      }
    }
  }
}

// Clouds/freezing – mechanics unchanged
function tryUseCloudBasic(){
  if(boka.cloudActive || boka.ammoCloud<=0) return false;
  boka.ammoCloud--; cloudStockFill.style.width=Math.min(100,(boka.ammoCloud/20)*100)+'%';
  boka.cloud=7.0; boka.cloudActive=true; boka.rooted=3.0;
  freezeInRadius(CLOUD_MAX_RADIUS, 10.0);
  return true;
}
function releaseCloudCharge(){
  const t=boka.chargeT;
  if(t>=6 && boka.ammoCloud>=100){
    boka.ammoCloud-=100; cloudStockFill.style.width=Math.min(100,(boka.ammoCloud/20)*100)+'%';
    boka.globalFreeze=60.0; boka.rooted=3.0; globalFreezeT.textContent=Math.ceil(boka.globalFreeze)+'s';
    globalFog.hidden=false; globalFog.style.opacity='1'; setTimeout(()=>{ globalFog.style.opacity='0'; }, 1500);
    freezeInRadius(99999, 60.0);
  } else if(t>=3 && boka.ammoCloud>=10){
    boka.ammoCloud-=10; cloudStockFill.style.width=Math.min(100,(boka.ammoCloud/20)*100)+'%';
    boka.cloud=7.0; boka.cloudActive=true; boka.rooted=3.0;
    freezeInRadius(CLOUD_MAX_RADIUS*2, 30.0);
  } else {
    tryUseCloudBasic();
  }
  boka.chargeT=0;
}
function freezeInRadius(radius, seconds){
  mumins.forEach(m=>{ if(m.alive && Math.hypot(m.x-boka.x,m.y-boka.y)<radius){ m.frozen=Math.max(m.frozen,seconds);} });
  if(hunter.alive && Math.hypot(hunter.x-boka.x,hunter.y-boka.y)<radius){
    if(hunter.frozen<=0) hunter.freezeHits++;
    hunter.frozen=Math.max(hunter.frozen,60.0);
    if(hunter.freezeHits>=10){ hunter.alive=false; sfxDeathKij.currentTime=0; sfxDeathKij.play(); summonHattis(true); }
    else if(hunter.freezeHits%3===0){ summonHattis(false); }
  }
}

// Bobek / traps – mechanics unchanged
function triggerBobek(){
  if(bobek.active || bobek.callsLeft<=0) return;
  bobek.callsLeft--; sfxBobek.currentTime=0; sfxBobek.play();
  bobek.plan = planWebSpotsNearHouse(5);
  bobek.building = null;
  bobek.active=true; bobek.x=cave.x; bobek.y=cave.y; bobek.dir=Math.random()*Math.PI*2;
}
function planWebSpotsNearHouse(n){
  const spots=[];
  let minC=COLS, minR=ROWS, maxC=0, maxR=0;
  for(const h of houseCells){ if(h.c<minC)minC=h.c; if(h.c>maxC)maxC=h.c; if(h.r<minR)minR=h.r; if(h.r>maxR)maxR=h.r; }
  const houseCenterX=(minC+maxC+1)/2*CELL;
  const rightSide = houseCenterX > (COLS*CELL/2);
  for(let i=0;i<n;i++){
    for(let t=0;t<300;t++){
      const c = rightSide ? ((COLS/2)|0)+((Math.random()*((COLS-2)-(COLS/2)))|0) : 1+((Math.random()*((COLS/2)-2))|0);
      const r = 1+((Math.random()*(ROWS-2))|0);
      if(grid[r][c]!==0) continue;
      const x=c*CELL+CELL/2, y=r*CELL+CELL/2;
      spots.push({x,y}); break;
    }
  }
  return spots;
}
function updateBobek(dt){
  if(!bobek.active) return;
  if(bobek.building){
    bobek.building.time += dt;
    if(bobek.building.time>=10){
      const t= bobek.building.trap;
      t.active=true; t.buildProgress=1; bobek.building=null;
    }
  } else {
    if(bobek.plan.length>0){
      const target=bobek.plan[0];
      const dx=target.x-bobek.x, dy=target.y-bobek.y; const d=Math.hypot(dx,dy)||1;
      bobek.dir=Math.atan2(dy,dx);
      const moved=moveCircle({x:bobek.x,y:bobek.y}, Math.cos(bobek.dir)*bobek.speed, Math.sin(bobek.dir)*bobek.speed, bobek.r);
      bobek.x=moved.x; bobek.y=moved.y;
      if(d<12){
        if(!inHouse(target.x,target.y)){
          const trap={x:target.x,y:target.y,r:12,active:false,buildProgress:0, burning: null};
          traps.push(trap);
          bobek.building={trap, time:0};
        }
        bobek.plan.shift();
      }
    } else {
      const dx=cave.x-bobek.x, dy=cave.y-bobek.y, d=Math.hypot(dx,dy)||1;
      bobek.dir=Math.atan2(dy,dx);
      const moved=moveCircle({x:bobek.x,y:bobek.y}, Math.cos(bobek.dir)*bobek.speed, Math.sin(bobek.dir)*bobek.speed, bobek.r);
      bobek.x=moved.x; bobek.y=moved.y;
      if(d<16){ bobek.active=false; }
    }
  }
}
function updateTraps(dt){
  for(const t of traps){
    if(t.burning!=null){ t.burning += dt; if(t.burning>=15){ t.active=false; t.burning=null; } }
    if(!t.active && t.buildProgress<1){ t.buildProgress = Math.min(1,(t.buildProgress||0)+dt/10); }
    if(!t.active) continue;
    for(const m of mumins){
      if(!m.alive || m.trapped) continue;
      if(Math.hypot(m.x-t.x,m.y-t.y)<m.r+t.r){ m.trapped=true; m.frozen=999; }
    }
  }
}

// Hatifnatowie – tylko „palce” po 3 z każdej strony, bez ramion
function summonHattis(onDeathBurst){
  const count = onDeathBurst? 15 : 10;
  hattis.length=0;
  for(let i=0;i<count;i++){
    const side=(Math.random()*4)|0; let x=0,y=0;
    if(side===0){ x=2; y=((Math.random()*ROWS*CELL)|0); }
    if(side===1){ x=COLS*CELL-2; y=((Math.random()*ROWS*CELL)|0); }
    if(side===2){ y=2; x=((Math.random()*COLS*CELL)|0); }
    if(side===3){ y=ROWS*CELL-2; x=((Math.random()*COLS*CELL)|0); }
    hattis.push({
      x,y,r:10, flee:false, scale:1,
      fingersL: 3, fingersR: 3,
      fingerLen: 4.6,
      fingerSpread: 0.95, // wachlarz kątowy
      handYOffset: -2.0,  // nieco powyżej środka
      handRelY: 0.25      // ok. 1/4 wysokości ciała
    });
  }
  panic=true; panicDim.hidden=false; startPanic();
}
function checkHattisClear(){
  if(hattis.length===0){ panic=false; panicDim.hidden=true; startBackground(); }
}

// Movement/collisions
function moveCircle(obj,vx,vy,rad){
  let nx=obj.x+vx, ny=obj.y+vy;
  const minX=rad, minY=rad, maxX=COLS*CELL-rad, maxY=ROWS*CELL-rad;
  nx=Math.max(minX,Math.min(maxX,nx)); ny=Math.max(minY,Math.min(maxY,ny));
  const c=(nx/CELL)|0, r=(ny/CELL)|0;
  for(let rr2=r-1;rr2<=r+1;rr2++) for(let cc=c-1;cc<=c+1;cc++){
    if(!grid[rr2]||grid[rr2][cc]===undefined) continue;
    if(grid[rr2][cc]===0 || grid[rr2][cc]===2) continue;
    const rx=cc*CELL, ry=rr2*CELL;
    const cx=Math.max(rx,Math.min(nx,rx+CELL));
    const cy=Math.max(ry,Math.min(ny,ry+CELL));
    const dx=nx-cx, dy=ny-cy, d2=dx*dx+dy*dy;
    if(d2<rad*rad-1){
      const d=Math.sqrt(Math.max(d2,1e-4));
      const ux=dx/d, uy=dy/d;
      nx=cx+ux*(rad+0.5); ny=cy+uy*(rad+0.5);
    }
  }
  return {x:nx,y:ny};
}

// Ctrl – lightning
function fireIceBolt(){
  if(boka.ammoAlt<=0) return;
  const dirLen=Math.hypot(boka.lookX,boka.lookY)||1;
  const ux=boka.lookX/dirLen, uy=boka.lookY/dirLen;
  boka.ammoAlt--; ammoAltFill.style.width=Math.min(100,(boka.ammoAlt/100)*100)+'%';
  iceBolts.push({x:boka.x+ux*16, y:boka.y+uy*16, vx:ux*7.0, vy:uy*7.0, ttl:2.5});
}

// Game loop
function update(now){
  if(!playing) return;
  const d=diff(level);
  const dt=Math.min(0.033,(now-lastTick)/16.666);
  lastTick=now;
  if(paused){ draw(); requestAnimationFrame(update); return; }

  if(boka.charging) boka.chargeT += dt;

  if(boka.cloudActive){ boka.cloud -= dt; if(boka.cloud<=0){ boka.cloud=0; boka.cloudActive=false; } }
  if(boka.rooted>0) boka.rooted-=dt;
  if(boka.globalFreeze>0) boka.globalFreeze-=dt;
  globalFreezeT.textContent = boka.globalFreeze>0? Math.ceil(boka.globalFreeze)+'s':'—';

  if(boka.growT>0){
    boka.growT=Math.max(0,boka.growT-dt); boka.growSpeedMul=3.0;
    const t=boka.growT/15; const scale=1+(4-1)*t; boka.r=BOKA_R_BASE*scale;
    if(boka.growT<=0){ boka.growSpeedMul=1.0; boka.r=BOKA_R_BASE; }
  } else boka.r=BOKA_R_BASE;

  if(!boka.cloudActive && boka.rooted<=0){
    let ax=0,ay=0;
    if(keys.has('ArrowUp')||keys.has('KeyW')) ay-=1;
    if(keys.has('ArrowDown')||keys.has('KeyS')) ay+=1;
    if(keys.has('ArrowLeft')||keys.has('KeyA')) ax-=1;
    if(keys.has('ArrowRight')||keys.has('KeyD')) ax+=1;
    if (Math.abs(moveX) > 0.1 || Math.abs(moveY) > 0.1) {
      ax = moveX;
      ay = moveY;
    }
    if(ax||ay){ const l=Math.hypot(ax,ay); ax/=l; ay/=l; boka.lookX=ax; boka.lookY=ay; }
    const sp=BOKA_BASE_SPEED*CELL/10 * (boka.growSpeedMul||1.0);
    const moved=moveCircle(boka, ax*sp*dt, ay*sp*dt, boka.r);
    boka.x=moved.x; boka.y=moved.y;
  }

  if(boka.poison>0){ boka.hp -= d.projDps*dt; boka.poison=Math.max(0,boka.poison-dt); }
  hpFill.style.width=Math.max(0,Math.min(100,(boka.hp/HP_MAX)*100))+'%';

  if(hunter.alive){
    if(hunter.frozen>0) hunter.frozen-=dt;
    else{
      const trapped = mumins.find(m=>m.alive && m.trapped);
      if(trapped){
        const nextTrap=nearestBlockingTrap(hunter,trapped);
        if(nextTrap){
          if(nextTrap.active && nextTrap.burning==null){
            goTowards(hunter,nextTrap.x,nextTrap.y,d.hunterSpeed);
            if(Math.hypot(hunter.x-nextTrap.x,hunter.y-nextTrap.y)<14) nextTrap.burning=0;
          } else {
            goTowards(hunter,trapped.x,trapped.y,d.hunterSpeed);
            if(Math.hypot(hunter.x-trapped.x,hunter.y-trapped.y)<14){ trapped.trapped=false; trapped.frozen=0; }
          }
        } else {
          goTowards(hunter,trapped.x,trapped.y,d.hunterSpeed);
          if(Math.hypot(hunter.x-trapped.x,hunter.y-trapped.y)<14){ trapped.trapped=false; trapped.frozen=0; }
        }
      } else {
        const activeTrap=traps.find(t=>t.active);
        if(activeTrap){
          goTowards(hunter,activeTrap.x,activeTrap.y,d.hunterSpeed);
          if(Math.hypot(hunter.x-activeTrap.x,hunter.y-activeTrap.y)<14 && activeTrap.burning==null) activeTrap.burning=0;
        } else {
          goTowards(hunter,boka.x,boka.y,d.hunterSpeed);
          hunter.tShot-=dt;
          const dx=boka.x-hunter.x, dy=boka.y-hunter.y, distH=Math.hypot(dx,dy);
          if(hunter.tShot<=0 && distH<HUNTER_AIM_RANGE && !(boka.cloudActive&&boka.rooted>0)){
            const speed=d.hunterProjSpeed;
            projs.push({x:hunter.x,y:hunter.y, vx:(dx/distH)*speed, vy:(dy/distH)*speed, ttl:6});
            hunter.tShot=d.fireCooldown*(0.9+Math.random()*0.4);
          }
        }
      }
    }
    freezeT.textContent = (hunter.frozen>0? Math.ceil(hunter.frozen)+'s':'0s');
  } else freezeT.textContent='—';

  for(let i=projs.length-1;i>=0;i--){
    const p=projs[i]; p.ttl-=dt; if(p.ttl<=0){projs.splice(i,1); continue;}
    const moved=moveCircle(p, p.vx, p.vy, 2); p.x=moved.x; p.y=moved.y;
    if(Math.hypot(p.x-boka.x,p.y-boka.y)<boka.r+4){ boka.poison=2.5; projs.splice(i,1); }
  }
  for(let i=iceBolts.length-1;i>=0;i--){
    const b=iceBolts[i]; b.ttl-=dt; if(b.ttl<=0){iceBolts.splice(i,1); continue;}
    const moved=moveCircle(b, b.vx, b.vy, 2); b.x=moved.x; b.y=moved.y;
    for(const m of mumins){
      if(!m.alive) continue;
      if(Math.hypot(b.x-m.x,b.y-m.y)<m.r+4){ m.frozen=Math.max(m.frozen,10.0); b.ttl=0; break; }
    }
    if(hunter.alive && Math.hypot(b.x-hunter.x,b.y-hunter.y)<HUNTER_R+4){
      if(hunter.frozen<=0) hunter.freezeHits++;
      hunter.frozen=Math.max(hunter.frozen,60.0);
      if(hunter.freezeHits>=10){ hunter.alive=false; sfxDeathKij.currentTime=0; sfxDeathKij.play(); summonHattis(true); }
      else if(hunter.freezeHits%3===0){ summonHattis(false); }
      b.ttl=0;
    }
    for(const h of hattis){ if(Math.hypot(b.x-h.x,b.y-h.y)<h.r*h.scale+6){ h.scale*=1.10; b.ttl=0; break; } }
  }

  updateBobek(dt); updateTraps(dt);

  let aliveCount=0;
  for(const m of mumins){
    if(!m.alive) continue; aliveCount++;
    if(m.trapped){ }
    else if(m.frozen>0){ m.frozen-=dt; }
    else{
      const dx=boka.x-m.x, dy=boka.y-m.y, dd=Math.hypot(dx,dy);
      let see=false;
      if(dd<260){
        const steps=Math.ceil(dd/8); let ok=true;
        for(let k=1;k<steps;k++){ const xx=m.x+dx*(k/steps), yy=m.y+dy*(k/steps); const c=(xx/CELL)|0, r=(yy/CELL)|0; if(isWall(c,r)){ok=false;break;} }
        see=ok;
      }
      if(see){
        m.hide=true;
        let target=null, best=1e9;
        for(const hc of houseCells){
          const tx=hc.c*CELL+CELL/2, ty=hc.r*CELL+CELL/2; const d2=Math.hypot(m.x-tx,m.y-ty);
          if(d2<best){best=d2; target={x:tx,y:ty}}
        }
        if(target){
          const ux=(target.x-m.x)/best, uy=(target.y-m.y)/best;
          const moved=moveCircle(m, ux*2.4, uy*2.4, m.r); m.x=moved.x; m.y=moved.y;
        }
        if(Math.random()<0.35*dt*3){ fearClouds.push({x:m.x,y:m.y,r:8, ttl:10}); }
      } else {
        m.hide=false;
        if(Math.random()<0.02) m.dir=Math.random()*Math.PI*2;
        const moved=moveCircle(m, Math.cos(m.dir)*1.0, Math.sin(m.dir)*1.0, m.r); m.x=moved.x; m.y=moved.y;
      }
    }
    if(Math.hypot(m.x-boka.x,m.y-boka.y) < boka.r+m.r && !inHouse(m.x,m.y)){
      m.alive=false; aliveCount--; score+=50; scoreEl.textContent=score;
      sfxDeathMumin.currentTime=0; sfxDeathMumin.play();
      blueClouds.push({x:m.x,y:m.y,r:10, ttl:15});
      boka.ammoCloud+=3; cloudStockFill.style.width=Math.min(100,(boka.ammoCloud/20)*100)+'%';
    }
  }

  for(let i=fearClouds.length-1;i>=0;i--){
    const f=fearClouds[i]; f.ttl-=dt; if(f.ttl<=0){fearClouds.splice(i,1); continue;}
    if(Math.hypot(f.x-boka.x,f.y-boka.y)<boka.r+f.r){ boka.hp=Math.min(HP_MAX, boka.hp+5); score+=10; scoreEl.textContent=score; fearClouds.splice(i,1); }
  }
  for(let i=blueClouds.length-1;i>=0;i--){
    const b=blueClouds[i]; b.ttl-=dt; if(b.ttl<=0){blueClouds.splice(i,1); continue;}
    if(Math.hypot(b.x-boka.x,b.y-boka.y)<boka.r+b.r){
      boka.hp=Math.min(HP_MAX, boka.hp+20);
      boka.ammoCloud++; cloudStockFill.style.width=Math.min(100,(boka.ammoCloud/20)*100)+'%';
      blueClouds.splice(i,1);
    }
  }

  const totalM=mumins.length||1;
  progressEl.textContent=Math.round(((totalM-aliveCount)/totalM)*100)+'%';
  leftEl.textContent=aliveCount;
  if(aliveCount===0){
    stopAllMusic();
    if(level>=30){ finalWin(); return; }
    level++;
    overlay.hidden=false;
    document.querySelector('#overlay .ttl').textContent = (LANG==='en'?'Level complete':'Poziom ukończony');
    document.querySelector('#overlay .desc')?.remove(); // bezpiecznie
    playing=false; return;
  }

  for(const m of mushrooms){
    if(m.alive===false){
      m.timer=(m.timer||60)-dt;
      if(m.timer<=0){
        const t=trees[(Math.random()*trees.length)|0];
        m.x=t.x+((Math.random()*18)|0)-9; m.y=t.y+6+((Math.random()*7)|0); m.alive=true; m.timer=0;
      }
    } else if(Math.hypot(m.x-boka.x,m.y-boka.y)<boka.r+m.r){
      m.alive=false; m.timer=60; boka.growT=15;
    }
  }

  updatePickups(boltPickups,'alt', dt);
  updatePickups(cloudPickups,'cloud', dt);

  for(let i=hattis.length-1;i>=0;i--){
    const h=hattis[i];
    const sp=BOKA_BASE_SPEED*CELL/10 * (boka.growSpeedMul||1.0);
    if(h.flee){
      const dx=h.x-boka.x, dy=h.y-boka.y, d=Math.hypot(dx,dy)||1;
      h.x+=(dx/d)*sp*dt; h.y+=(dy/d)*sp*dt;
      if(h.x< -20 || h.y< -20 || h.x>COLS*CELL+20 || h.y>ROWS*CELL+20){ hattis.splice(i,1); checkHattisClear(); continue; }
    } else {
      const dx=boka.x-h.x, dy=boka.y-h.y, d=Math.hypot(dx,dy)||1;
      h.x+=(dx/d)*sp*dt; h.y+=(dy/d)*sp*dt;
      if(Math.hypot(h.x-boka.x,h.y-boka.y)<(h.r*h.scale)+boka.r){
        boka.hp=Math.max(0,boka.hp-HP_MAX*0.10);
        h.flee=true;
      }
    }
  }

  if(boka.hp<=0){
    stopAllMusic();
    playing=false; overlay.hidden=false;
    document.querySelector('#overlay .ttl').textContent=(LANG==='en'?'Defeat':'Przegrana');
    return;
  }

  draw();
  requestAnimationFrame(update);
}

// Helpers
function nearestBlockingTrap(src, dst){
  let best=null, bestD=1e9;
  for(const t of traps){
    if(!t.active) continue;
    const d=pointLineDistance({x:t.x,y:t.y},{x:src.x,y:src.y},{x:dst.x,y:dst.y});
    if(d<80){
      const dd=Math.hypot(src.x-t.x,src.y-t.y);
      if(dd<bestD){ best=t; bestD=dd; }
    }
  }
  return best;
}
function pointLineDistance(p,a,b){
  const A=p.x-a.x,B=p.y-a.y; const C=b.x-a.x,D=b.y-a.y;
  const dot=A*C+B*D; const len=C*C+D*D; const t=Math.max(0,Math.min(1,dot/len));
  const xx=a.x + C*t, yy=a.y + D*t;
  return Math.hypot(p.x-xx,p.y-yy);
}
function goTowards(obj, tx, ty, speed){
  const dx=tx-obj.x, dy=ty-obj.y, d=Math.hypot(dx,dy)||1;
  const moved=moveCircle(obj, (dx/d)*speed, (dy/d)*speed, obj.r||HUNTER_R);
  obj.x=moved.x; obj.y=moved.y;
}

// Drawing
function draw(){
  const th=themeFor(level);
  ctx.clearRect(0,0,canvas.width,canvas.height);

  // Tiles
  for(let r=0;r<ROWS;r++) for(let c=0;c<COLS;c++){
    const x=c*CELL,y=r*CELL,w=CELL,h=CELL;
    const t=grid[r][c];
    let col = (t===1? th.wall : (t===2? shade(th.path,0.8) : th.path));
    ctx.fillStyle=col; ctx.fillRect(x,y,w,h);
    if(t===2){ ctx.strokeStyle='rgba(200,255,220,0.25)'; ctx.strokeRect(x+3,y+3,w-6,h-6); }
  }

  // Cave
  {
    const cx=cave.x, cy=cave.y, r=cave.r;
    for(let i=0;i<18;i++){
      const ang=i*(Math.PI*2/18);
      const rx=cx+Math.cos(ang)*r*0.9 + ((Math.random()*9)|0)-4;
      const ry=cy+Math.sin(ang)*r*0.9 + ((Math.random()*9)|0)-4;
      const cr=4+((Math.random()*3)|0);
      const grd=ctx.createRadialGradient(rx,ry,1,rx,ry,cr);
      grd.addColorStop(0,'#3b3b3b'); grd.addColorStop(1,'#121212');
      ctx.fillStyle=grd; ctx.beginPath(); ctx.arc(rx,ry,cr,0,Math.PI*2); ctx.fill();
    }
    ctx.fillStyle='rgba(10,10,10,0.9)'; ctx.beginPath(); ctx.arc(cx,cy,r*0.6,0,Math.PI*2); ctx.fill();
  }

  // Trees / mushrooms
  for(const t of trees){
    ctx.fillStyle=shade(th.accent,0.4); ctx.fillRect(t.x-6, t.y+5, 12, 6);
    ctx.fillStyle=th.accent; ctx.beginPath(); ctx.moveTo(t.x, t.y-18); ctx.lineTo(t.x-12, t.y+8); ctx.lineTo(t.x+12, t.y+8); ctx.closePath(); ctx.fill();
    ctx.fillStyle=shade(th.accent,0.5); ctx.fillRect(t.x-2, t.y+8, 4, 8);
  }
  for(const m of mushrooms){
    if(m.alive===false) continue;
    ctx.fillStyle='#eddcc8'; ctx.fillRect(m.x-2, m.y-4, 4, 6);
    ctx.fillStyle='#d3222a'; ctx.beginPath(); ctx.ellipse(m.x, m.y-4, 8, 5, 0, 0, Math.PI, true); ctx.fill();
    ctx.fillStyle='#fff'; ctx.beginPath(); ctx.arc(m.x-3,m.y-6,1.2,0,Math.PI*2); ctx.fill(); ctx.beginPath(); ctx.arc(m.x+2,m.y-5,1.4,0,Math.PI*2); ctx.fill();
  }

  // pickups
  for(const p of boltPickups){
    if(!p.alive) continue;
    const g=ctx.createRadialGradient(p.x,p.y,2,p.x,p.y,12);
    g.addColorStop(0,'#dff4ff'); g.addColorStop(1,'#5ab0ff');
    ctx.strokeStyle='#aee1ff'; ctx.fillStyle=g;
    ctx.beginPath();
    ctx.moveTo(p.x, p.y-10); ctx.lineTo(p.x+5, p.y-2); ctx.lineTo(p.x+1, p.y-2); ctx.lineTo(p.x+8, p.y+10); ctx.lineTo(p.x-4, p.y+0); ctx.lineTo(p.x+2, p.y+0); ctx.closePath();
    ctx.fill(); ctx.stroke();
  }
  for(const p of cloudPickups){
    if(!p.alive) continue;
    ctx.fillStyle='rgba(180,220,255,0.95)';
    const x=p.x, y=p.y;
    ctx.beginPath();
    ctx.arc(x-6,y,6,0,Math.PI*2);
    ctx.arc(x,y-4,7,0,Math.PI*2);
    ctx.arc(x+7,y,5,0,Math.PI*2);
    ctx.closePath(); ctx.fill();
    ctx.strokeStyle='rgba(120,170,210,0.8)'; ctx.stroke();
  }

  // traps
  for(const t of traps){
    const build=t.active?1:Math.min(1,(t.buildProgress||0));
    ctx.save();
    ctx.globalAlpha = 0.4 + 0.6*build;
    const R = 12*build;
    ctx.strokeStyle=t.burning!=null ? 'rgba(255,140,80,0.9)' : 'rgba(220,220,255,0.9)';
    ctx.beginPath(); ctx.arc(t.x,t.y,R,0,Math.PI*2); ctx.stroke();
    for(let a=0;a<6;a++){
      const ang=a*Math.PI/3;
      ctx.beginPath(); ctx.moveTo(t.x,t.y);
      ctx.lineTo(t.x+Math.cos(ang)*R, t.y+Math.sin(ang)*R); ctx.stroke();
    }
    for(let r=4;r<=R;r+=4){
      ctx.beginPath(); ctx.arc(t.x,t.y,r,0,Math.PI*2); ctx.stroke();
    }
    ctx.restore();
  }

  // reward clouds
  fearClouds.forEach(f=>{ ctx.fillStyle='rgba(255,230,120,0.55)'; ctx.beginPath(); ctx.arc(f.x,f.y,f.r,0,Math.PI*2); ctx.fill(); });
  blueClouds.forEach(b=>{ ctx.fillStyle='rgba(140,200,255,0.7)'; ctx.beginPath(); ctx.arc(b.x,b.y,b.r,0,Math.PI*2); ctx.fill(); });

  // moomins
  mumins.forEach(m=>{
    if(!m.alive) return;
    ctx.save(); ctx.translate(m.x,m.y);
    const body = m.trapped? 'rgba(180,120,120,0.9)' : (m.frozen>0? 'rgba(220,240,255,0.95)' : (m.hide ? 'rgba(255,255,255,0.8)' : '#f7f7f7'));
    ctx.fillStyle=body;
    ctx.beginPath(); ctx.ellipse(0,4,8,11,0,0,Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.ellipse(0,-10,6,5,0,0,Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.ellipse(-3,-15,2,3,0,0,Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.ellipse(3,-15,2,3,0,0,Math.PI*2); ctx.fill();
    ctx.restore();
  });

  // flames
  projs.forEach(p=>{
    const grd=ctx.createRadialGradient(p.x,p.y,0.5,p.x,p.y,6);
    grd.addColorStop(0,'rgba(255,240,160,1)');
    grd.addColorStop(0.6,'rgba(255,140,80,0.9)');
    grd.addColorStop(1,'rgba(255,80,40,0)');
    ctx.fillStyle=grd; ctx.beginPath(); ctx.arc(p.x,p.y,6,0,Math.PI*2); ctx.fill();
  });

  // bolts
  iceBolts.forEach(b=>{
    ctx.strokeStyle='rgba(160,220,255,0.9)';
    ctx.beginPath(); ctx.moveTo(b.x-3,b.y); ctx.lineTo(b.x+3,b.y); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(b.x,b.y-3); ctx.lineTo(b.x,b.y+3); ctx.stroke();
  });

  // hunter
  if(hunter.alive){
    ctx.save(); ctx.translate(hunter.x,hunter.y);
    const frozen=hunter.frozen>0;
    ctx.fillStyle=frozen ? 'rgba(160,240,220,0.9)' : '#7de6a9';
    ctx.beginPath(); ctx.moveTo(-8,-10); ctx.lineTo(8,-10); ctx.lineTo(0,-26); ctx.closePath(); ctx.fill();
    ctx.fillStyle='#e8f7ef'; ctx.beginPath(); ctx.ellipse(0,-6,5,4,0,0,Math.PI*2); ctx.fill();
    const dx=boka.x-hunter.x, dy=boka.y-hunter.y, d=Math.hypot(dx,dy)||1; const ox=(dx/d)*1.5, oy=(dy/d)*1.5;
    ctx.fillStyle='#213a2b'; ctx.beginPath(); ctx.arc(-1+ox,-6+oy,1.2,0,Math.PI*2); ctx.fill();
    ctx.fillStyle=frozen ? 'rgba(160,240,220,0.9)' : '#7de6a9';
    ctx.beginPath(); ctx.moveTo(0,-10); ctx.lineTo(-9,14); ctx.lineTo(9,14); ctx.closePath(); ctx.fill();
    const ang=Math.atan2(dy,dx);
    ctx.strokeStyle='#1c3b2a'; ctx.lineWidth=2; ctx.beginPath(); ctx.moveTo(0,0); ctx.lineTo(Math.cos(ang)*12, Math.sin(ang)*12); ctx.stroke(); ctx.lineWidth=1;
    if(frozen){ ctx.strokeStyle='rgba(180,255,255,0.8)'; ctx.strokeRect(-11,-28,22,44); }
    ctx.restore();
  }

  // bobek
  if(bobek.active){
    ctx.save(); ctx.translate(bobek.x,bobek.y);
    ctx.fillStyle='#101010'; ctx.beginPath(); ctx.arc(0,0,8,0,Math.PI*2); ctx.fill();
    for(let i=0;i<6;i++){ const a=i*(Math.PI*2/6); ctx.strokeStyle='#1d1d1d'; ctx.beginPath(); ctx.moveTo(Math.cos(a)*6,Math.sin(a)*6); ctx.lineTo(Math.cos(a)*10,Math.sin(a)*10); ctx.stroke(); }
    const ex=Math.cos(bobek.dir)*1.5, ey=Math.sin(bobek.dir)*1.5;
    ctx.fillStyle='#fff'; ctx.beginPath(); ctx.arc(-2,-2,1.8,0,Math.PI*2); ctx.fill(); ctx.beginPath(); ctx.arc(2,-2,1.8,0,Math.PI*2); ctx.fill();
    ctx.fillStyle='#000'; ctx.beginPath(); ctx.arc(-2+ex,-2+ey,0.6,0,Math.PI*2); ctx.fill(); ctx.beginPath(); ctx.arc(2+ex,-2+ey,0.6,0,Math.PI*2); ctx.fill();
    ctx.restore();
  }

  // buka
  const glow=10+6*Math.sin(performance.now()/180);
  ctx.save(); ctx.translate(boka.x,boka.y);
  ctx.shadowColor='#7ad1ff'; ctx.shadowBlur=glow;
  ctx.fillStyle=boka.cloudActive?'#5aa7d4':'#7ad1ff';
  ctx.beginPath(); ctx.ellipse(0,2,boka.r*0.93,boka.r*1.3,0,0,Math.PI*2); ctx.fill();
  ctx.fillStyle=boka.cloudActive?'rgba(120,160,190,0.5)':'rgba(170,220,255,0.5)';
  ctx.beginPath(); ctx.ellipse(0,8,boka.r*1.1,6,0,0,Math.PI*2); ctx.fill();
  ctx.shadowBlur=0;
  const el=Math.hypot(boka.lookX,boka.lookY)||1; const ex=(boka.lookX/el)*2.2, ey=(boka.lookY/el)*2.2;
  ctx.fillStyle='#eef9ff';
  ctx.beginPath(); ctx.ellipse(-4,-4,3,4,0,0,Math.PI*2); ctx.fill();
  ctx.beginPath(); ctx.ellipse(4,-4,3,4,0,0,Math.PI*2); ctx.fill();
  ctx.fillStyle='#0b1c10'; ctx.beginPath(); ctx.arc(-4+ex,-4+ey,1.6,0,Math.PI*2); ctx.fill(); ctx.beginPath(); ctx.arc(4+ex,-4+ey,1.6,0,Math.PI*2); ctx.fill();
  ctx.restore();

  // local cloud vignette
  if(boka.cloudActive){
    const radius=CLOUD_MAX_RADIUS*(boka.cloud/7.0)*2;
    const grd=ctx.createRadialGradient(boka.x,boka.y,10,boka.x,boka.y,Math.max(20,radius));
    grd.addColorStop(0,'rgba(0,0,0,0.6)');
    grd.addColorStop(1,'rgba(0,0,0,0)');
    ctx.fillStyle=grd; ctx.beginPath(); ctx.arc(boka.x,boka.y,Math.max(20,radius),0,Math.PI*2); ctx.fill();
  }

  // Hatifnatowie – smukłe ciała, oczy w kierunku Buki, łapki 3–5 palców
  for(const h of hattis){
    ctx.save(); ctx.translate(h.x,h.y); ctx.scale(h.scale,h.scale);

    // ciało
    ctx.shadowColor='rgba(255,245,150,0.9)'; ctx.shadowBlur=12;
    ctx.fillStyle='rgba(255,255,210,0.97)';
    ctx.beginPath(); ctx.ellipse(0,0,5.5,13.5,0,0,Math.PI*2); ctx.fill();
    ctx.shadowBlur=0;

    // oczy w stronę Buki
    const dx=boka.x-h.x, dy=boka.y-h.y, d=Math.hypot(dx,dy)||1;
    const ox=(dx/d)*1.6, oy=(dy/d)*1.6;
    ctx.fillStyle='#333';
    ctx.beginPath(); ctx.arc(-1.8+ox,-3.0+oy,1.15,0,Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.arc( 1.8+ox,-3.0+oy,1.15,0,Math.PI*2); ctx.fill();

    // ręce + palce
    const armLen = h.armLen||10, spread=h.handSpread||0.9;
    const yArm = 1.5, bodyW=5.5;

    function hand(dir,fingers){
      const baseX = dir*(bodyW-1), baseY=yArm;
      ctx.strokeStyle='rgba(255,255,230,0.95)'; ctx.lineWidth=1.6;
      ctx.beginPath(); ctx.moveTo(baseX,baseY); ctx.lineTo(baseX+dir*armLen, baseY); ctx.stroke();
      const handX=baseX+dir*armLen, handY=baseY;
      const n=fingers; const fingerLen=4.6;
      for(let i=0;i<n;i++){
        const t = n===1?0:(i/(n-1)-0.5);
        const ang=t*spread;
        const fx=handX + Math.cos(ang)*fingerLen;
        const fy=handY + Math.sin(ang)*fingerLen + t*2;
        ctx.beginPath(); ctx.moveTo(handX,handY); ctx.lineTo(fx,fy); ctx.stroke();
        ctx.beginPath(); ctx.arc(fx,fy,0.9,0,Math.PI*2); ctx.fillStyle='rgba(255,255,235,0.95)'; ctx.fill();
      }
    }
    hand(-1, h.fingersL||4);
    hand( 1, h.fingersR||4);

    ctx.restore();
  }

  // Weather / frame
  if(weather==='Noc'){ ctx.fillStyle='rgba(0,0,30,0.25)'; ctx.fillRect(0,0,canvas.width,canvas.height); }
  else if(weather==='Deszcz'){
    ctx.strokeStyle='rgba(180,200,255,0.25)';
    for(let i=0;i<50;i++){
      const x=(performance.now()/10 + i*50)%canvas.width;
      const y=(i*37 + performance.now()/3)%canvas.height;
      ctx.beginPath(); ctx.moveTo(x,y); ctx.lineTo(x+4,y+10); ctx.stroke();
    }
  } else if(weather==='Mgła'){
    ctx.fillStyle='rgba(200,220,220,0.08)'; ctx.fillRect(0,0,canvas.width,canvas.height);
    ctx.fillStyle='rgba(200,220,220,0.08)'; ctx.fillRect(20,20,canvas.width-40,canvas.height-40);
  }
  ctx.strokeStyle='rgba(255,255,255,0.06)'; ctx.strokeRect(0.5,0.5,canvas.width-1,canvas.height-1);
}

// Final win
function finalWin(){
  playing=false;
  startWinLoop();
}

// Start game
function startGame(fullReset=false){
  if(fullReset){
    score=0;
    Object.assign(boka, baseBoka());
  }
  resetLevel();
  overlay.hidden=true; paused=false; pauseOv.hidden=true;
  lastTick=performance.now();
  playing=true;
  // i18n sync on start
  applyLang();
  startBackground();
  requestAnimationFrame(update);
}

// Initial i18n sync so buttons are correct before first start
applyLang();

})();
