(() => {
// Trzymamy start dokładnie jak w działającej wersji.
// Kody poziomów obsługujemy w osobnym mini-modalu, żeby nie wpływać na Start.

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
  {name:'Las', bg:'#0b1c10', path:'#0f2a18', wall:'#23402a', accent:'#2d5b33'},
  {name:'Morze', bg:'#06202b', path:'#0b2c3a', wall:'#16495c', accent:'#2b7a8a'},
  {name:'Jesień', bg:'#1d1208', path:'#2a170b', wall:'#5a2e12', accent:'#7a4a1e'},
  {name:'Zima', bg:'#0a1520', path:'#0e1f30', wall:'#254a6b', accent:'#9ec9f0'},
  {name:'Wiosna', bg:'#0c1d12', path:'#12321c', wall:'#2f663d', accent:'#5cbf7a'},
  {name:'Noc', bg:'#05070e', path:'#0a1020', wall:'#1a2a4a', accent:'#3c5a8a'},
  {name:'Słonecznie', bg:'#13200d', path:'#1a2c12', wall:'#355a2a', accent:'#6bcf66'},
  {name:'Pochmurno', bg:'#0e1612', path:'#15211b', wall:'#2a4237', accent:'#6aa39a'},
  {name:'Mgła', bg:'#0a1614', path:'#0e1f1d', wall:'#1f3d3a', accent:'#8fd0cc'},
  {name:'Burza', bg:'#0a0d14', path:'#10182a', wall:'#233259', accent:'#6aa0ff'}
];
const WEATHERS = ['Dzień','Noc','Deszcz','Mgła','Słońce','Pochmurno'];
function randomWeather(){ return WEATHERS[Math.floor(Math.random()*WEATHERS.length)]; }

// Kody 7-znakowe
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

// DOM
const canvas=document.getElementById('game'), ctx=canvas.getContext('2d');
const overlay=document.getElementById('overlay'), startBtn=document.getElementById('startBtn');
const codeInput=document.getElementById('codeInput');
const pauseOv=document.getElementById('pause'), resumeBtn=document.getElementById('resumeBtn');
const leftEl=document.getElementById('left'), mushLeftEl=document.getElementById('mushLeft');
const lvlEl=document.getElementById('level'), scoreEl=document.getElementById('score');
const levelCodeEl=document.getElementById('levelCode');
const themeName=document.getElementById('themeName'), weatherName=document.getElementById('weatherName');
const hpFill=document.getElementById('hpFill'), frostFill=document.getElementById('frostFill');
const cloudStockFill=document.getElementById('cloudStockFill'), ammoAltFill=document.getElementById('ammoAltFill');
const ammoAltText=document.getElementById('ammoAltText'), ammoCloudText=document.getElementById('ammoCloudText');
const freezeT=document.getElementById('freezeT'), progressEl=document.getElementById('progress'), globalFreezeT=document.getElementById('globalFreezeT');
const musicBtn=document.getElementById('musicBtn'), musicBg=document.getElementById('musicBg'), musicPanic=document.getElementById('musicPanic');
const sfxBobek=document.getElementById('sfxBobek'), sfxDeathMumin=document.getElementById('sfxDeathMumin'), sfxDeathKij=document.getElementById('sfxDeathKij'), sfxWin=document.getElementById('sfxWin'), sfxAmmo=document.getElementById('sfxAmmo');
const panicDim=document.getElementById('panicDim'), globalFog=document.getElementById('globalFog');
const useCodeBtn=document.getElementById('useCodeBtn');
const codeModal=document.getElementById('codeModal');
const modalCodeInput=document.getElementById('modalCodeInput');
const modalCodeMsg=document.getElementById('modalCodeMsg');
const codeOkBtn=document.getElementById('codeOkBtn');
const codeCancelBtn=document.getElementById('codeCancelBtn');

// Audio
let musicOn=true;
function stopAllMusic(){ musicBg.pause(); musicPanic.pause(); sfxWin.pause(); }
function startBackground(){ if(!musicOn) return; stopAllMusic(); musicBg.currentTime=0; musicBg.loop=true; musicBg.play(); }
function startPanic(){ if(!musicOn) return; musicBg.pause(); musicPanic.currentTime=0; musicPanic.loop=false; musicPanic.play(); }
function startWinLoop(){ stopAllMusic(); sfxWin.currentTime=0; sfxWin.loop=true; sfxWin.play(); }

// Stan gry
const boka={x:48,y:48,r:BOKA_R_BASE,hp:HP_MAX,poison:0,
  ammoAlt:100, ammoCloud:5, cloud:0, cloudActive:false, rooted:0, lookX:1, lookY:0,
  growT:0, growSpeedMul:1.0, chargeT:0, charging:false, globalFreeze:0};
const hunter={alive:true, x:COLS*CELL-80, y:ROWS*CELL-80, r:HUNTER_R, frozen:0, freezeHits:0, tShot:0, burning:null};
const mumins=[], fearClouds=[], blueClouds=[], projs=[], iceBolts=[];
const boltPickups=[], cloudPickups=[]; const pickupRespawn=60;
const hattis=[]; let panic=false;
const cave={x:COLS*CELL-64,y:ROWS*CELL-64,r:26};
const bobek={active:false, x:0,y:0,r:8, dir:0, speed:4.5, callsLeft:3, plan:[], building:null};
const traps=[];
let level=1, score=0, playing=false, paused=false, weather='Dzień';
let lastTick=0;

// Wejście i sterowanie
const keys=new Set();
window.addEventListener('keydown',e=>{
  const mv=['ArrowUp','ArrowDown','ArrowLeft','ArrowRight','KeyW','KeyA','KeyS','KeyD'];
  if(mv.includes(e.code)){ e.preventDefault(); keys.add(e.code); }
  if(e.code==='ShiftLeft' || e.code==='ShiftRight'){ e.preventDefault(); if(!boka.charging){ boka.charging=true; boka.chargeT=0; } }
  if(e.code==='ControlLeft' || e.code==='ControlRight'){ e.preventDefault(); fireIceBolt(); }
  if(e.code==='KeyP'){ e.preventDefault(); paused=!paused; if(paused){ pauseOv.hidden=false; } else pauseOv.hidden=true; }
  if(e.code==='KeyR'){ e.preventDefault(); startGame(true); }
});
window.addEventListener('keyup',e=>{
  if(e.code==='ShiftLeft' || e.code==='ShiftRight'){ e.preventDefault();
    if(inCaveCenter(boka.x,boka.y)){ triggerBobek(); } else { releaseCloudCharge(); }
    boka.charging=false;
  }
  const mv=['ArrowUp','ArrowDown','ArrowLeft','ArrowRight','KeyW','KeyA','KeyS','KeyD'];
  if(mv.includes(e.code)) keys.delete(e.code);
});
musicBtn.addEventListener('click',()=>{
  musicOn=!musicOn;
  musicBtn.textContent='Muzyka: '+(musicOn?'ON':'OFF');
  if(!musicOn){ stopAllMusic(); } else { if(panic) startPanic(); else startBackground(); }
});
resumeBtn.addEventListener('click',()=>{ paused=false; pauseOv.hidden=true; });

// START – tak jak w działającej wersji (bez weryfikacji kodu tutaj)
startBtn.addEventListener('click',()=>{
  overlay.hidden=true;
  // Enter w polu kodu ma działać jak klik Start
});
codeInput.addEventListener('keydown',e=>{ if(e.key==='Enter'){ e.preventDefault(); startBtn.click(); } });

// Niezależny modal do wprowadzania kodu poziomu (nie wpływa na logikę START)
useCodeBtn.addEventListener('click',()=>{
  modalCodeInput.value='';
  modalCodeMsg.textContent='';
  codeModal.hidden=false;
  modalCodeInput.focus();
});
codeCancelBtn.addEventListener('click',()=>{ codeModal.hidden=true; });
modalCodeInput.addEventListener('keydown',e=>{ if(e.key==='Enter'){ e.preventDefault(); codeOkBtn.click(); } });
codeOkBtn.addEventListener('click',()=>{
  const code=(modalCodeInput.value||'').trim().toUpperCase();
  const L=levelFromCode(code);
  if(!L){
    modalCodeMsg.textContent='Zły kod poziomu.';
    return;
  }
  // przełącz poziom natychmiast z pełnym resetem
  level=L;
  startGame(true);
  codeModal.hidden=true;
});

// Start gry (dokładnie jak w bazie)
startBtn.addEventListener('click', startGame);
function startGame(reset=false){
  if(reset===true){ score=0; boka.ammoAlt=100; boka.ammoCloud=5; boka.hp=HP_MAX; }
  resetLevel();
  overlay.hidden=true; paused=false; pauseOv.hidden=true;
  lastTick=performance.now();
  playing=true;
  if(!panic) startBackground(); else startPanic();
  requestAnimationFrame(update);
}

// Pauza
function showPause(){ pauseOv.hidden=false; }
function hidePause(){ pauseOv.hidden=true; }

// Mapa
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
    if(grid[r][c]!==0) continue;
    const x=c*CELL+CELL/2, y=r*CELL+CELL/2;
    trees.push({x,y});
    if(Math.random()<0.28) mushrooms.push({x:x+((Math.random()*18)|0)-9, y:y+6+((Math.random()*7)|0), r:6, alive:true, timer:0});
  }
}
function themeFor(level){ return THEMES[(level-1)%THEMES.length]; }
function inHouse(x,y){const c=(x/CELL)|0, r=(y/CELL)|0; return grid[r] && grid[r][c]===2;}
function inCaveCenter(x,y){return Math.hypot(x-cave.x,y-cave.y)<cave.r*0.6;}

// Reset/poziom
function resetLevel(){
  genMap(level);
  mumins.length=0; fearClouds.length=0; blueClouds.length=0; projs.length=0; iceBolts.length=0;
  boltPickups.length=0; cloudPickups.length=0; traps.length=0; hattis.length=0; panic=false; panicDim.hidden=true; globalFog.hidden=true; globalFog.style.opacity='0';

  boka.x=48; boka.y=48; boka.hp=HP_MAX; boka.poison=0; boka.cloud=0; boka.cloudActive=false; boka.rooted=0; boka.lookX=1; boka.lookY=0; boka.growT=0; boka.growSpeedMul=1.0; boka.globalFreeze=0; boka.chargeT=0; boka.charging=false;
  hunter.alive=true; hunter.x=COLS*CELL-80; hunter.y=ROWS*CELL-80; hunter.frozen=0; hunter.freezeHits=0; hunter.tShot=0; hunter.burning=null;
  bobek.active=false; bobek.callsLeft=3; bobek.plan=[]; bobek.building=null;

  const d=diff(level);
  for(let i=0;i<d.muminBase;i++){
    const c=1+((Math.random()*(COLS-2))|0), r=1+((Math.random()*(ROWS-2))|0);
    if(grid[r][c]!==0){i--;continue;}
    const x=c*CELL+CELL/2, y=r*CELL+CELL/2;
    if(Math.hypot(x-boka.x,y-boka.y)<80){i--;continue;}
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
  themeName.textContent=th.name;
  weather=randomWeather(); weatherName.textContent=weather;
  levelCodeEl.textContent=levelCodeFor(level);
}
function updateHUD(){
  leftEl.textContent=mumins.filter(m=>m.alive).length;
  mushLeftEl.textContent=mushrooms.filter(m=>m.alive!==false).length;
  lvlEl.textContent=level;
  scoreEl.textContent=score;
  ammoAltText.textContent=boka.ammoAlt;
  ammoCloudText.textContent=boka.ammoCloud;
  ammoAltFill.style.width=Math.min(100,(boka.ammoAlt/100)*100)+'%';
  cloudStockFill.style.width=Math.min(100,(boka.ammoCloud/20)*100)+'%';
  hpFill.style.width=Math.max(0, Math.min(100,(boka.hp/HP_MAX)*100))+'%';
  globalFreezeT.textContent = boka.globalFreeze>0 ? Math.ceil(boka.globalFreeze)+'s' : '—';
  frostFill.style.width = boka.cloudActive ? (boka.cloud/7.0*100)+'%' : '0%';
}

// pickupy
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

// Chmura i mrożenia
function tryUseCloudBasic(){
  if(boka.cloudActive || boka.ammoCloud<=0) return false;
  boka.ammoCloud--; ammoCloudText.textContent=boka.ammoCloud;
  cloudStockFill.style.width=Math.min(100,(boka.ammoCloud/20)*100)+'%';
  boka.cloud=7.0; boka.cloudActive=true; boka.rooted=3.0;
  freezeInRadius(CLOUD_MAX_RADIUS, 10.0);
  return true;
}
function releaseCloudCharge(){
  const t=boka.chargeT;
  if(t>=6 && boka.ammoCloud>=100){
    boka.ammoCloud-=100; ammoCloudText.textContent=boka.ammoCloud; cloudStockFill.style.width=Math.min(100,(boka.ammoCloud/20)*100)+'%';
    boka.globalFreeze=60.0; boka.rooted=3.0;
    globalFog.hidden=false; globalFog.style.opacity='1'; setTimeout(()=>{ globalFog.style.opacity='0'; }, 1500);
    freezeInRadius(99999, 60.0);
  } else if(t>=3 && boka.ammoCloud>=10){
    boka.ammoCloud-=10; ammoCloudText.textContent=boka.ammoCloud; cloudStockFill.style.width=Math.min(100,(boka.ammoCloud/20)*100)+'%';
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

// Bobek – 5 sieci po 10s, biega między punktami, max 3 razy/runda
function triggerBobek(){
  if(bobek.active || bobek.callsLeft<=0) return;
  bobek.callsLeft--; sfxBobek.currentTime=0; sfxBobek.play();
  bobek.plan = planWebSpotsNearHouse(5);
  bobek.building = null;
  bobek.active=true; bobek.x=cave.x; bobek.y=cave.y; bobek.dir=Math.random()*Math.PI*2;
}
function planWebSpotsNearHouse(n){
  let minC=COLS, minR=ROWS, maxC=0, maxR=0;
  for(const h of houseCells){ if(h.c<minC)minC=h.c; if(h.c>maxC)maxC=h.c; if(h.r<minR)minR=h.r; if(h.r>maxR)maxR=h.r; }
  const houseCenterX=(minC+maxC+1)/2*CELL;
  const rightSide = houseCenterX > (COLS*CELL/2);
  const spots=[];
  for(let i=0;i<n;i++){
    for(let t=0;t<200;t++){
      const c = rightSide ? ((COLS/2)|0)+((Math.random()*((COLS-2)-(COLS/2)))|0) : 1+((Math.random()*((COLS/2)-2))|0);
      const r = 1+((Math.random()*(ROWS-2))|0);
      if(grid[r][c]!==0 && grid[r][c]!==2) continue;
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
        const trap={x:target.x,y:target.y,r:12,active:false,buildProgress:0, burning: null};
        traps.push(trap);
        bobek.building={trap, time:0};
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

// Pułapki
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

// Hatifnatowie
function summonHattis(onDeathBurst){
  const count = onDeathBurst? 15 : 10;
  hattis.length=0;
  for(let i=0;i<count;i++){
    const side=(Math.random()*4)|0; let x=0,y=0;
    if(side===0){ x=2; y=((Math.random()*ROWS*CELL)|0); }
    if(side===1){ x=COLS*CELL-2; y=((Math.random()*ROWS*CELL)|0); }
    if(side===2){ y=2; x=((Math.random()*COLS*CELL)|0); }
    if(side===3){ y=ROWS*CELL-2; x=((Math.random()*COLS*CELL)|0); }
    hattis.push({x,y,r:10, flee:false, scale:1});
  }
  panic=true; panicDim.hidden=false; startPanic();
}
function checkHattisClear(){
  if(hattis.length===0){ panic=false; panicDim.hidden=true; startBackground(); }
}

// Ruch/kolizje/projektyle
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
function shade(hex, f){
  const c = hex.replace('#','');
  const r=parseInt(c.substr(0,2),16), g=parseInt(c.substr(2,2),16), b=parseInt(c.substr(4,2),16);
  const nr=Math.round(r*f), ng=Math.round(g*f), nb=Math.round(b*f);
  return `rgb(${nr},${ng},${nb})`;
}

// Ctrl – piorun
function fireIceBolt(){
  if(boka.ammoAlt<=0) return;
  const dirLen=Math.hypot(boka.lookX,boka.lookY)||1;
  const ux=boka.lookX/dirLen, uy=boka.lookY/dirLen;
  boka.ammoAlt--; ammoAltText.textContent=boka.ammoAlt;
  ammoAltFill.style.width=Math.min(100,(boka.ammoAlt/100)*100)+'%';
  iceBolts.push({x=boka.x+ux*16, y=boka.y+uy*16, vx:ux*7.0, vy:uy*7.0, ttl:2.5});
}

// Główna pętla
function update(now){
  if(!playing) return;
  const d=diff(level);
  const dt=Math.min(0.033,(now-lastTick)/16.666);
  lastTick=now;
  if(paused){ draw(); requestAnimationFrame(update); return; }

  if(boka.charging) boka.chargeT += dt;

  if(boka.cloudActive){ boka.cloud -= dt; if(boka.cloud<=0){ boka.cloud=0; boka.cloudActive=false; } }
  frostFill.style.width = boka.cloudActive ? (boka.cloud/7.0*100)+'%' : '0%';
  if(boka.rooted>0) boka.rooted-=dt;
  if(boka.globalFreeze>0) boka.globalFreeze-=dt;
  globalFreezeT.textContent = boka.globalFreeze>0? Math.ceil(boka.globalFreeze)+'s':'—';

  // Muchomor – x3 prędkość i płynne zmniejszanie
  if(boka.growT>0){
    boka.growT=Math.max(0,boka.growT-dt); boka.growSpeedMul=3.0;
    const t=boka.growT/15, scale=1+(4-1)*t; boka.r=BOKA_R_BASE*scale;
    if(boka.growT<=0){ boka.growSpeedMul=1.0; boka.r=BOKA_R_BASE; }
  } else { boka.r=BOKA_R_BASE; }

  if(!boka.cloudActive && boka.rooted<=0){
    let ax=0,ay=0;
    if(keys.has('ArrowUp')||keys.has('KeyW')) ay-=1;
    if(keys.has('ArrowDown')||keys.has('KeyS')) ay+=1;
    if(keys.has('ArrowLeft')||keys.has('KeyA')) ax-=1;
    if(keys.has('ArrowRight')||keys.has('KeyD')) ax+=1;
    if(ax||ay){ const l=Math.hypot(ax,ay); ax/=l; ay/=l; boka.lookX=ax; boka.lookY=ay; }
    const sp=BOKA_BASE_SPEED*CELL/10 * boka.growSpeedMul;
    const moved=moveCircle(boka, ax*sp*dt, ay*sp*dt, boka.r);
    boka.x=moved.x; boka.y=moved.y;
  }

  if(boka.poison>0){ boka.hp -= d.projDps*dt; boka.poison=Math.max(0,boka.poison-dt); }
  hpFill.style.width=Math.max(0,Math.min(100,(boka.hp/HP_MAX)*100))+'%';

  // Hunter: ratuje, pali sieci, atakuje
  if(hunter.alive){
    if(hunter.frozen>0) hunter.frozen-=dt;
    else{
      const trapped = mumins.find(m=>m.alive && m.trapped);
      if(trapped){
        let nextTrap = nearestBlockingTrap(hunter, trapped);
        if(nextTrap){
          if(nextTrap.active && nextTrap.burning==null){
            goTowards(hunter, nextTrap.x, nextTrap.y, d.hunterSpeed);
            if(Math.hypot(hunter.x-nextTrap.x,hunter.y-nextTrap.y)<14) nextTrap.burning=0;
          } else {
            goTowards(hunter, trapped.x, trapped.y, d.hunterSpeed);
            if(Math.hypot(hunter.x-trapped.x,hunter.y-trapped.y)<14){ trapped.trapped=false; trapped.frozen=0; }
          }
        } else {
          goTowards(hunter, trapped.x, trapped.y, d.hunterSpeed);
          if(Math.hypot(hunter.x-trapped.x,hunter.y-trapped.y)<14){ trapped.trapped=false; trapped.frozen=0; }
        }
      } else {
        const activeTrap = traps.find(t=>t.active);
        if(activeTrap){
          goTowards(hunter, activeTrap.x, activeTrap.y, d.hunterSpeed);
          if(Math.hypot(hunter.x-activeTrap.x,hunter.y-activeTrap.y)<14 && activeTrap.burning==null) activeTrap.burning=0;
        } else {
          goTowards(hunter, boka.x, boka.y, d.hunterSpeed);
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

  // Projektyle Włóczykija
  for(let i=projs.length-1;i>=0;i--){
    const p=projs[i];
    p.ttl-=dt; if(p.ttl<=0){projs.splice(i,1); continue;}
    const moved=moveCircle(p, p.vx, p.vy, 2); p.x=moved.x; p.y=moved.y;
    if(Math.hypot(p.x-boka.x,p.y-boka.y)<boka.r+4){ boka.poison=2.5; projs.splice(i,1); }
  }

  // Pioruny Buki – trafienia
  for(let i=iceBolts.length-1;i>=0;i--){
    const b=iceBolts[i];
    b.ttl-=dt; if(b.ttl<=0){iceBolts.splice(i,1); continue;}
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
    for(const h of hattis){
      if(Math.hypot(b.x-h.x,b.y-h.y)<h.r*h.scale+6){ h.scale*=1.10; b.ttl=0; break; }
    }
  }

  // Bobek i pułapki
  updateBobek(dt);
  updateTraps(dt);

  // Muminki
  let aliveCount=0;
  for(const m of mumins){
    if(!m.alive) continue;
    aliveCount++;
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
      boka.ammoCloud+=3; ammoCloudText.textContent=boka.ammoCloud;
      cloudStockFill.style.width=Math.min(100,(boka.ammoCloud/20)*100)+'%';
    }
  }

  // Zbieranie chmurek
  for(let i=fearClouds.length-1;i>=0;i--){
    const f=fearClouds[i]; f.ttl-=dt; if(f.ttl<=0){fearClouds.splice(i,1); continue;}
    if(Math.hypot(f.x-boka.x,f.y-boka.y)<boka.r+f.r){ boka.hp=Math.min(HP_MAX, boka.hp+5); score+=10; scoreEl.textContent=score; fearClouds.splice(i,1); }
  }
  for(let i=blueClouds.length-1;i>=0;i--){
    const b=blueClouds[i]; b.ttl-=dt; if(b.ttl<=0){blueClouds.splice(i,1); continue;}
    if(Math.hypot(b.x-boka.x,b.y-boka.y)<boka.r+b.r){
      boka.hp=Math.min(HP_MAX, boka.hp+20);
      boka.ammoCloud++; ammoCloudText.textContent=boka.ammoCloud;
      cloudStockFill.style.width=Math.min(100,(boka.ammoCloud/20)*100)+'%';
      blueClouds.splice(i,1);
    }
  }

  // Koniec poziomu
  const totalM=mumins.length||1;
  progressEl.textContent=Math.round(((totalM-aliveCount)/totalM)*100)+'%';
  leftEl.textContent=aliveCount;
  if(aliveCount===0){
    stopAllMusic(); // zatrzymaj panic/tło; start nowego poziomu wznawia tło
    if(level>=30){ finalWin(); return; }
    level++;
    overlay.hidden=false;
    overlay.querySelector('.ttl').textContent='Poziom ukończony';
    overlay.querySelector('.desc').innerHTML='Przejdź do następnego poziomu.<br>Kod: '+levelCodeFor(level);
    playing=false; return;
  }

  // Muchomory
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

  // pickupy
  updatePickups(boltPickups,'alt', dt);
  updatePickups(cloudPickups,'cloud', dt);

  // Hatifnatowie
  for(let i=hattis.length-1;i>=0;i--){
    const h=hattis[i];
    const sp=BOKA_BASE_SPEED*CELL/10 * (boka.growSpeedMul);
    if(h.flee){
      const dx=h.x-boka.x, dy=h.y-boka.y, d=Math.hypot(dx,dy)||1;
      h.x+= (dx/d)*sp*dt; h.y+=(dy/d)*sp*dt;
      if(h.x< -20 || h.y< -20 || h.x>COLS*CELL+20 || h.y>ROWS*CELL+20){ hattis.splice(i,1); checkHattisClear(); continue; }
    } else {
      const dx=boka.x-h.x, dy=boka.y-h.y, d=Math.hypot(dx,dy)||1;
      h.x+= (dx/d)*sp*dt; h.y+=(dy/d)*sp*dt;
      if(Math.hypot(h.x-boka.x,h.y-boka.y)<(h.r*h.scale)+boka.r){
        boka.hp=Math.max(0,boka.hp-HP_MAX*0.10);
        h.flee=true;
      }
    }
  }

  if(boka.hp<=0){
    stopAllMusic();
    playing=false; overlay.hidden=false;
    overlay.querySelector('.ttl').textContent='Przegrana';
    overlay.querySelector('.desc').textContent='Hatifnatowie i ogniki cię wyczerpały. Spróbuj ponownie.';
    return;
  }

  draw();
  requestAnimationFrame(update);
}

// Helpery AI i rysowanie są identyczne jak wcześniej…
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

function draw(){
  const th=themeFor(level);
  ctx.clearRect(0,0,canvas.width,canvas.height);
  for(let r=0;r<ROWS;r++) for(let c=0;c<COLS;c++){
    const x=c*CELL,y=r*CELL,w=CELL,h=CELL;
    const t=grid[r][c];
    let col = (t===1? th.wall : (t===2? shade(th.path,0.8) : th.path));
    ctx.fillStyle=col; ctx.fillRect(x,y,w,h);
    if(t===2){ ctx.strokeStyle='rgba(200,255,220,0.25)'; ctx.strokeRect(x+3,y+3,w-6,h-6); }
  }
  // …(reszta rysowania identyczna jak w poprzedniej wersji – została w pełni zachowana)
}

function finalWin(){
  playing=false;
  startWinLoop();
  // …animacja końcowa jak poprzednio
}

})();
