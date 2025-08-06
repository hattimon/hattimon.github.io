/* BUKA – główna logika gry
   Ujęto: osobne pickupy amunicji, super/global chmura po przytrzymaniu spacji,
   Włóczykij z twarzą/kuszą, Hatifnatowie z „paniką”, muchomory respawn, kopalnia i Bobek.
*/
(() => {
// Konfiguracja i stałe
const CELL=32, COLS=25, ROWS=18;
const MIN_BOARD=Math.min(COLS*CELL, ROWS*CELL);
const CLOUD_MAX_RADIUS=Math.floor(MIN_BOARD/5);
const RNG_SEED=42;

const HP_MAX=100;
const BOKA_BASE_SPEED=3.1, BOKA_R_BASE=14;

const HUNTER_R=11, HUNTER_AIM_RANGE=360;

// poziomy (10)
function diff(level){
  const t=(level-1)/9;
  return {
    wallDensity: 0.26 + t*0.14,
    muminBase: 8 + Math.floor(level*1.2),
    hunterSpeed: 2.5 + t*1.2,
    hunterProjSpeed: 4.2 + t*1.4,
    fireCooldown: (1.8*5) * (1.0 - t*0.35),
    projDps: (14/10)*3, // 3x więcej niż poprzednio
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

// DOM
const canvas=document.getElementById('game'), ctx=canvas.getContext('2d');
const overlay=document.getElementById('overlay'), startBtn=document.getElementById('startBtn');
const leftEl=document.getElementById('left'), mushLeftEl=document.getElementById('mushLeft');
const lvlEl=document.getElementById('level'), scoreEl=document.getElementById('score');
const themeName=document.getElementById('themeName'), weatherName=document.getElementById('weatherName');
const hpFill=document.getElementById('hpFill'), frostFill=document.getElementById('frostFill');
const cloudStockFill=document.getElementById('cloudStockFill'), ammoAltFill=document.getElementById('ammoAltFill');
const ammoAltText=document.getElementById('ammoAltText'), ammoCloudText=document.getElementById('ammoCloudText');
const freezeT=document.getElementById('freezeT'), progressEl=document.getElementById('progress'), globalFreezeT=document.getElementById('globalFreezeT');
const musicBtn=document.getElementById('musicBtn'), musicHappy=document.getElementById('musicHappy'), musicDark=document.getElementById('musicDark'), musicPanic=document.getElementById('musicPanic');
const panicDim=document.getElementById('panicDim');

// RNG
function mulberry32(a){return function(){let t=a+=0x6D2B79F5;t=Math.imul(t^t>>>15,t|1);t^=t+Math.imul(t^t>>>7,t|61);return((t^t>>>14)>>>0)/4294967296}}
let rng=mulberry32(RNG_SEED);
function rr(a,b){return Math.floor(a+(b-a)*Math.random());}

// Mapa, ozdoby i kopalnia
let grid=[], trees=[], mushrooms=[];
let mine={x:0,y:0,w:CELL*3,h:CELL*3}; // prostokąt kopalni
function isWall(c,r){if(r<0||c<0||r>=ROWS||c>=COLS)return true;return grid[r][c]===1}
function genMap(level){
  const d=diff(level), th=themeFor(level);
  document.documentElement.style.setProperty('--bg', th.bg);
  document.documentElement.style.setProperty('--path', th.path);
  document.documentElement.style.setProperty('--wall', th.wall);
  trees=[]; mushrooms=[];
  grid=Array.from({length:ROWS},()=>Array(COLS).fill(0));
  for(let r=0;r<ROWS;r++)for(let c=0;c<COLS;c++) if(r===0||c===0||r===ROWS-1||c===COLS-1) grid[r][c]=1;
  for(let r=1;r<ROWS-1;r++) for(let c=1;c<COLS-1;c++) if(Math.random()<d.wallDensity) grid[r][c]=1;
  let snakes=8+Math.floor(level/2);
  while(snakes--){
    let r=(ROWS>>1)+rr(-3,3), c=(COLS>>1)+rr(-3,3);
    for(let i=0;i<200;i++){
      grid[r][c]=0;
      const dir=rr(0,4);
      if(dir===0&&r>1)r--; if(dir===1&&r<ROWS-2)r++;
      if(dir===2&&c>1)c--; if(dir===3&&c<COLS-2)c++;
    }
  }
  // domek
  let dr=0,dc=0;
  for(let tries=0;tries<200;tries++){
    const r=2+rr(0,ROWS-5), c=2+rr(0,COLS-5);
    let ok=true; for(let rr2=r;rr2<r+3;rr2++) for(let cc=c;cc<c+3;cc++) if(isWall(cc,rr2)) ok=false;
    if(ok){dr=r;dc=c;break;}
  }
  for(let rr2=dr;rr2<dr+3;rr2++) for(let cc=dc;cc<dc+3;cc++) grid[rr2][cc]=2;

  // kopalnia – umieszczamy osobny „pokój” 3x3 z innym tilem 3
  let mr=0,mc=0;
  for(let tries=0;tries<200;tries++){
    const r=2+rr(0,ROWS-5), c=2+rr(0,COLS-5);
    let ok=true; for(let rr2=r;rr2<r+3;rr2++) for(let cc=c;cc<c+3;cc++) if(isWall(cc,rr2)) ok=false;
    if(ok){mr=r;mc=c;break;}
  }
  for(let rr2=mr;rr2<mr+3;rr2++) for(let cc=mc;cc<mc+3;cc++) grid[rr2][cc]=3;
  mine.x=mc*CELL; mine.y=mr*CELL; mine.w=CELL*3; mine.h=CELL*3;

  // drzewa + muchomory
  const treeCount=16+Math.floor(level*1.2);
  for(let i=0;i<treeCount;i++){
    const c=1+rr(0,COLS-2), r=1+rr(0,ROWS-2);
    if(grid[r][c]!==0) continue;
    const x=c*CELL+CELL/2, y=r*CELL+CELL/2;
    trees.push({x,y});
    if(Math.random()<0.28) mushrooms.push({x:x+rr(-8,9), y:y+rr(6,12), r:6, alive:true, timer:0});
  }
}
function themeFor(level){ return THEMES[(level-1)%THEMES.length]; }
function inHouse(x,y){const c=Math.floor(x/CELL), r=Math.floor(y/CELL); return grid[r] && grid[r][c]===2;}
function inMine(x,y){return x>mine.x && x<mine.x+mine.w && y>mine.y && y<mine.y+mine.h;}

// Obiekty
const boka={x:CELL*1.5,y:CELL*1.5,r:BOKA_R_BASE,hp:HP_MAX,poison:0,
  ammoAlt:100, ammoCloud:5, cloud:0, cloudActive:false, rooted:0, lookX:1, lookY:0, growT:0,
  chargeT:0, charging:false, globalFreeze:0 // czas globalnego zamrożenia (super/global)
};
const hunter={alive:true, x:CELL*(COLS-2.5), y:CELL*(ROWS-2.5), r:HUNTER_R, frozen:0, freezeHits:0, tShot:0, deaths:0};
const mumins=[], fearClouds=[], blueClouds=[], projs=[], iceBolts=[];
const boltPickups=[], cloudPickups=[];
const boltTimers=[], cloudTimers=[];
const pickupRespawn=60;

const hattis=[]; let panic=false;
const bobek={active:false, x:0,y:0,r:8, dir:0, trapsLeft:0, speed:4.5};
const traps=[];

// HUD/music/pogoda
let level=1, score=0, playing=false, paused=false, musicOn=true, weather='Dzień';
let lastTick=0;

// Wejście
const keys=new Set();
window.addEventListener('keydown',e=>{
  const mv=['ArrowUp','ArrowDown','ArrowLeft','ArrowRight','KeyW','KeyA','KeyS','KeyD'];
  if(mv.includes(e.code)){ e.preventDefault(); keys.add(e.code); }
  if(e.code==='Space'){ e.preventDefault(); if(!boka.charging){ boka.charging=true; boka.chargeT=0; } }
  if(e.code==='AltLeft' || e.code==='AltRight'){ e.preventDefault(); fireIceBolt(); }
  if(e.code==='KeyP') paused=!paused;
  if(e.code==='KeyR') startGame(true);
});
window.addEventListener('keyup',e=>{
  if(e.code==='Space'){ e.preventDefault(); releaseCloudCharge(); boka.charging=false; }
  const mv=['ArrowUp','ArrowDown','ArrowLeft','ArrowRight','KeyW','KeyA','KeyS','KeyD'];
  if(mv.includes(e.code)) keys.delete(e.code);
});
document.getElementById('musicBtn').addEventListener('click',()=>{
  musicOn=!musicOn;
  document.getElementById('musicBtn').textContent='Muzyka: '+(musicOn?'ON':'OFF');
  if(!musicOn){ musicHappy.pause(); musicDark.pause(); musicPanic.pause(); }
  else { if(panic){ musicPanic.play(); } else if(boka.cloudActive){ musicDark.play(); } else { musicHappy.play(); } }
});
startBtn.addEventListener('click',()=>startGame());

// Reset/poziom
function resetLevel(){
  genMap(level);
  mumins.length=0; fearClouds.length=0; blueClouds.length=0; projs.length=0; iceBolts.length=0;
  boltPickups.length=0; cloudPickups.length=0; boltTimers.length=0; cloudTimers.length=0;
  traps.length=0; hattis.length=0; panic=false; panicDim.hidden=true;

  boka.x=CELL*1.5; boka.y=CELL*1.5; boka.hp=HP_MAX; boka.poison=0; boka.cloud=0; boka.cloudActive=false; boka.rooted=0; boka.lookX=1; boka.lookY=0; boka.growT=0; boka.globalFreeze=0; boka.chargeT=0; boka.charging=false;
  hunter.alive=true; hunter.x=CELL*(COLS-2.5); hunter.y=CELL*(ROWS-2.5); hunter.frozen=0; hunter.freezeHits=0; hunter.tShot=0; hunter.deaths=0;
  bobek.active=false; bobek.trapsLeft=0;

  const d=diff(level);
  for(let i=0;i<d.muminBase;i++){
    const c=1+rr(0,COLS-2), r=1+rr(0,ROWS-2);
    if(grid[r][c]!==0){i--;continue;}
    const x=c*CELL+CELL/2, y=r*CELL+CELL/2;
    if(Math.hypot(x-boka.x,y-boka.y)<80){i--;continue;}
    mumins.push({x,y,r:11, alive:true, hide:false, frozen:0, dir:Math.random()*Math.PI*2, trapped:false});
  }

  placePickups(boltPickups,5,'bolt');
  placePickups(cloudPickups,5,'cloud');
  for(let i=0;i<5;i++){ boltTimers[i]=0; cloudTimers[i]=0; }

  updateHUDTheme();
  updateHUD();
}

// HUD helpers
function updateHUDTheme(){
  const th=themeFor(level);
  document.documentElement.style.setProperty('--bg', th.bg);
  document.documentElement.style.setProperty('--path', th.path);
  document.documentElement.style.setProperty('--wall', th.wall);
  themeName.textContent=th.name;
  weather=randomWeather(); weatherName.textContent=weather;
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
      const c=1+rr(0,COLS-2), r=1+rr(0,ROWS-2);
      if(grid[r][c]!==0) continue;
      x=c*CELL+CELL/2; y=r*CELL+CELL/2; break;
    }
    arr.push({x,y,r:10, alive:true, shape, timer:0});
  }
}

// Akcje – chmura i ładowanie
function tryUseCloudBasic(){
  if(boka.cloudActive || boka.ammoCloud<=0) return false;
  boka.ammoCloud--; ammoCloudText.textContent=boka.ammoCloud;
  cloudStockFill.style.width=Math.min(100,(boka.ammoCloud/20)*100)+'%';
  boka.cloud=7.0; boka.cloudActive=true; boka.rooted=3.0;
  if(musicOn){ musicDark.currentTime=0; musicDark.play(); musicHappy.pause(); }
  // zamroź w zasięgu 10s
  freezeInRadius(CLOUD_MAX_RADIUS, 10.0);
  return true;
}
function releaseCloudCharge(){
  // decyzja: jeśli ładował przez >=6s i ma >=100 ammo -> global, else jeśli >=3s i ma >=10 ammo -> super, else -> basic
  const t=boka.chargeT;
  if(t>=6 && boka.ammoCloud>=100){
    boka.ammoCloud-=100;
    ammoCloudText.textContent=boka.ammoCloud;
    cloudStockFill.style.width=Math.min(100,(boka.ammoCloud/20)*100)+'%';
    boka.globalFreeze=60.0; // minuta
    boka.rooted=3.0;
    // zamroź wszystko
    freezeInRadius(99999, 60.0);
    if(musicOn){ musicDark.currentTime=0; musicDark.play(); musicHappy.pause(); }
  } else if(t>=3 && boka.ammoCloud>=10){
    boka.ammoCloud-=10;
    ammoCloudText.textContent=boka.ammoCloud;
    cloudStockFill.style.width=Math.min(100,(boka.ammoCloud/20)*100)+'%';
    // super chmura 2x
    boka.cloud=7.0; boka.cloudActive=true; boka.rooted=3.0;
    freezeInRadius(CLOUD_MAX_RADIUS*2, 30.0);
    if(musicOn){ musicDark.currentTime=0; musicDark.play(); musicHappy.pause(); }
  } else {
    tryUseCloudBasic();
  }
  boka.chargeT=0;
}
function freezeInRadius(radius, seconds){
  // muminki
  mumins.forEach(m=>{ if(m.alive && !inHouse(m.x,m.y) && Math.hypot(m.x-boka.x,m.y-boka.y)<radius){ m.frozen=Math.max(m.frozen,seconds);} });
  // hunter
  if(hunter.alive && Math.hypot(hunter.x-boka.x,hunter.y-boka.y)<radius){
    if(hunter.frozen<=0) hunter.freezeHits++;
    hunter.frozen=Math.max(hunter.frozen,seconds>=60?60:60); // niech i tak 60 s
    if(hunter.freezeHits>=10){ hunter.alive=false; hunter.deaths++; maybeSummonHattis(true); }
    else if(hunter.freezeHits%3===0){ maybeSummonHattis(false); }
  }
}

// Pioruny Alt
function fireIceBolt(){
  if(boka.ammoAlt<=0) return;
  const dirLen=Math.hypot(boka.lookX,boka.lookY)||1;
  const ux=boka.lookX/dirLen, uy=boka.lookY/dirLen;
  boka.ammoAlt--; ammoAltText.textContent=boka.ammoAlt;
  ammoAltFill.style.width=Math.min(100,(boka.ammoAlt/100)*100)+'%';
  iceBolts.push({x:boka.x+ux*16, y:boka.y+uy*16, vx:ux*7.3, vy:uy*7.3, ttl:2.5});
}

// Hatifnatowie
function maybeSummonHattis(onDeathBurst){
  const count = onDeathBurst? 15 : 10;
  hattis.length=0;
  for(let i=0;i<count;i++){
    // start z krawędzi
    const side=rr(0,4);
    let x=0,y=0;
    if(side===0){ x=2; y=rr(2,ROWS*CELL-2); }
    if(side===1){ x=COLS*CELL-2; y=rr(2,ROWS*CELL-2); }
    if(side===2){ y=2; x=rr(2,COLS*CELL-2); }
    if(side===3){ y=ROWS*CELL-2; x=rr(2,COLS*CELL-2); }
    hattis.push({x,y,r:10, flee:false, vx:0,vy:0});
  }
  panic=true; document.getElementById('panicDim').hidden=false;
  if(musicOn){ musicPanic.currentTime=0; musicPanic.play(); musicDark.pause(); musicHappy.pause(); }
}

// Bobek i pułapki
function maybeSpawnBobek(){
  if(!bobek.active && inMine(boka.x,boka.y)){
    bobek.active=true; bobek.x=mine.x+mine.w/2; bobek.y=mine.y+mine.h/2; bobek.dir=Math.random()*Math.PI*2; bobek.trapsLeft=5;
  }
}
function updateBobek(dt){
  if(!bobek.active) return;
  // ruch szybki
  const sp= bobek.trapsLeft>0 ? bobek.speed : bobek.speed*0.8;
  const nx=bobek.x+Math.cos(bobek.dir)*sp, ny=bobek.y+Math.sin(bobek.dir)*sp;
  const m=moveCircle({x:bobek.x,y:bobek.y}, Math.cos(bobek.dir)*sp, Math.sin(bobek.dir)*sp, bobek.r);
  bobek.x=m.x; bobek.y=m.y;
  if(Math.random()<0.02) bobek.dir=Math.random()*Math.PI*2;
  // kładź pułapki
  if(bobek.trapsLeft>0 && Math.random()<0.02){
    traps.push({x:bobek.x, y:bobek.y, r:10, active:true, target:null});
    bobek.trapsLeft--;
  }
  // gdy skończy pułapki – wraca do kopalni
  if(bobek.trapsLeft<=0){
    const dx= mine.x+mine.w/2 - bobek.x, dy= mine.y+mine.h/2 - bobek.y, d=Math.hypot(dx,dy);
    if(d<14){ bobek.active=false; } else { bobek.dir=Math.atan2(dy,dx); }
  }
}
function updateTraps(dt){
  // wciągnięcie Muminka
  for(const t of traps){
    if(!t.active) continue;
    for(const m of mumins){
      if(!m.alive || m.trapped) continue;
      if(Math.hypot(m.x-t.x,m.y-t.y)<m.r+t.r){ m.trapped=true; m.frozen=999; t.target=m; }
    }
  }
}

// Reset summon panic off
function checkHattisClear(){
  if(hattis.length===0){
    panic=false; document.getElementById('panicDim').hidden=true;
    if(musicOn){ musicPanic.pause(); if(boka.cloudActive){ musicDark.play(); } else { musicHappy.play(); } }
  }
}

// Ruch i kolizje
function moveCircle(obj,vx,vy,rad){
  let nx=obj.x+vx, ny=obj.y+vy;
  const minX=rad, minY=rad, maxX=COLS*CELL-rad, maxY=ROWS*CELL-rad;
  nx=Math.max(minX,Math.min(maxX,nx)); ny=Math.max(minY,Math.min(maxY,ny));
  const c=Math.floor(nx/CELL), r=Math.floor(ny/CELL);
  for(let rr2=r-1;rr2<=r+1;rr2++) for(let cc=c-1;cc<=c+1;cc++){
    if(!grid[rr2]||grid[rr2][cc]===undefined) continue;
    if(grid[rr2][cc]===0) continue;
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

// Główna pętla
function update(now){
  if(!playing) return;
  const d=diff(level);
  const dt=Math.min(0.033,(now-lastTick)/16.666);
  lastTick=now;
  if(paused){ draw(); requestAnimationFrame(update); return; }

  // ładowanie spacji
  if(boka.charging) boka.chargeT += dt;

  // timery
  if(boka.cloudActive){
    boka.cloud -= dt; if(boka.cloud<=0){ boka.cloud=0; boka.cloudActive=false; if(musicOn && !panic){ musicDark.pause(); musicHappy.play(); } }
    frostFill.style.width=(boka.cloud/7.0*100)+'%';
  } else frostFill.style.width='0%';
  if(boka.rooted>0) boka.rooted-=dt;
  if(boka.globalFreeze>0) boka.globalFreeze-=dt;
  globalFreezeT.textContent = boka.globalFreeze>0? Math.ceil(boka.globalFreeze)+'s':'—';

  // Buka ruch
  if(boka.growT>0) boka.growT-=dt;
  let sizeMul=(boka.growT>0)?4.0:1.0;
  boka.r=BOKA_R_BASE*sizeMul;
  const spMul=(boka.growT>0)?1.33:1.0;
  if(!boka.cloudActive && boka.rooted<=0){
    let ax=0,ay=0;
    if(keys.has('ArrowUp')||keys.has('KeyW')) ay-=1;
    if(keys.has('ArrowDown')||keys.has('KeyS')) ay+=1;
    if(keys.has('ArrowLeft')||keys.has('KeyA')) ax-=1;
    if(keys.has('ArrowRight')||keys.has('KeyD')) ax+=1;
    if(ax||ay){ const l=Math.hypot(ax,ay); ax/=l; ay/=l; boka.lookX=ax; boka.lookY=ay; }
    const sp=BOKA_BASE_SPEED*CELL/10*spMul;
    const moved=moveCircle(boka, ax*sp*dt, ay*sp*dt, boka.r);
    boka.x=moved.x; boka.y=moved.y;
  }

  // trucizna
  if(boka.poison>0){ boka.hp -= d.projDps*dt; boka.poison=Math.max(0,boka.poison-dt); }
  hpFill.style.width=Math.max(0,Math.min(100,(boka.hp/HP_MAX)*100))+'%';

  // Hunter
  if(hunter.alive){
    if(hunter.frozen>0) hunter.frozen-=dt;
    else{
      const dx=boka.x-hunter.x, dy=boka.y-hunter.y, distH=Math.hypot(dx,dy);
      if(distH>1){
        const ux=dx/distH, uy=dy/distH;
        const moved=moveCircle(hunter, ux*d.hunterSpeed, uy*d.hunterSpeed, HUNTER_R);
        hunter.x=moved.x; hunter.y=moved.y;
      }
      hunter.tShot-=dt;
      if(hunter.tShot<=0 && distH<HUNTER_AIM_RANGE && !(boka.cloudActive&&boka.rooted>0)){
        const speed=d.hunterProjSpeed;
        projs.push({x:hunter.x,y:hunter.y, vx:(dx/distH)*speed, vy:(dy/distH)*speed, ttl:6});
        hunter.tShot=d.fireCooldown*(0.9+Math.random()*0.4);
      }
    }
    freezeT.textContent = (hunter.frozen>0? Math.ceil(hunter.frozen)+'s':'0s');
  } else {
    freezeT.textContent='—';
  }

  // Ogniki
  for(let i=projs.length-1;i>=0;i--){
    const p=projs[i];
    p.ttl-=dt; if(p.ttl<=0){projs.splice(i,1); continue;}
    const moved=moveCircle(p, p.vx, p.vy, 2); p.x=moved.x; p.y=moved.y;
    if(Math.hypot(p.x-boka.x,p.y-boka.y)<boka.r+4){ boka.poison=2.5; projs.splice(i,1); }
  }

  // Pioruny Alt
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
      if(hunter.freezeHits>=10){ hunter.alive=false; hunter.deaths++; maybeSummonHattis(true); }
      else if(hunter.freezeHits%3===0){ maybeSummonHattis(false); }
      b.ttl=0;
    }
  }

  // Bobek
  maybeSpawnBobek();
  updateBobek(dt);
  updateTraps(dt);

  // Hunter ratuje uwięzionych
  if(hunter.alive && hunter.frozen<=0){
    const trapped = mumins.find(m=>m.alive && m.trapped);
    if(trapped){
      const dx=trapped.x-hunter.x, dy=trapped.y-hunter.y, dH=Math.hypot(dx,dy);
      if(dH>1){ const ux=dx/dH, uy=dy/dH; const moved=moveCircle(hunter, ux*diff(level).hunterSpeed, uy*diff(level).hunterSpeed, HUNTER_R); hunter.x=moved.x; hunter.y=moved.y; }
      if(dH<14){ trapped.trapped=false; trapped.frozen=0; }
    }
  }

  // Muminki
  let aliveCount=0;
  for(const m of mumins){
    if(!m.alive) continue;
    aliveCount++;
    if(m.trapped){ /* stoi */ }
    else if(m.frozen>0){ m.frozen-=dt; }
    else{
      const dx=boka.x-m.x, dy=boka.y-m.y, dd=Math.hypot(dx,dy);
      let see=false;
      if(dd<260){
        const steps=Math.ceil(dd/8); let ok=true;
        for(let k=1;k<steps;k++){ const xx=m.x+dx*(k/steps), yy=m.y+dy*(k/steps); const c=Math.floor(xx/CELL), r=Math.floor(yy/CELL); if(isWall(c,r)){ok=false;break;} }
        see=ok;
      }
      if(see){
        m.hide=true;
        let target=null, best=1e9;
        for(let r=0;r<ROWS;r++) for(let c=0;c<COLS;c++) if(grid[r][c]===2){
          const tx=c*CELL+CELL/2, ty=r*CELL+CELL/2; const d2=Math.hypot(m.x-tx,m.y-ty);
          if(d2<best){best=d2; target={x:tx,y:ty}}
        }
        if(target){ const ux=(target.x-m.x)/best, uy=(target.y-m.y)/best; const moved=moveCircle(m, ux*2.4, uy*2.4, m.r); m.x=moved.x; m.y=moved.y; }
        if(Math.random()<0.35*dt*3){ fearClouds.push({x:m.x,y:m.y,r:8, ttl:10}); }
      } else {
        m.hide=false;
        if(Math.random()<0.02) m.dir=Math.random()*Math.PI*2;
        const moved=moveCircle(m, Math.cos(m.dir)*1.0, Math.sin(m.dir)*1.0, m.r); m.x=moved.x; m.y=moved.y;
      }
    }
    if(Math.hypot(m.x-boka.x,m.y-boka.y) < boka.r+m.r && !inHouse(m.x,m.y)){
      m.alive=false; aliveCount--; score+=50; scoreEl.textContent=score;
      blueClouds.push({x:m.x,y:m.y,r:10, ttl:15});
      boka.ammoCloud+=3; ammoCloudText.textContent=boka.ammoCloud;
      cloudStockFill.style.width=Math.min(100,(boka.ammoCloud/20)*100)+'%';
    }
  }
  // Postęp i koniec poziomu
  const totalM=mumins.length||1;
  progressEl.textContent=Math.round(((totalM-aliveCount)/totalM)*100)+'%';
  leftEl.textContent=aliveCount;
  if(aliveCount===0){
    level = Math.min(10, level+1);
    overlay.hidden=false;
    document.getElementById('title').textContent = (level>10?'Gratulacje!':'Poziom ukończony');
    document.getElementById('desc').textContent = (level>10?'Przeszedłeś wszystkie 10 poziomów! Możesz grać dalej, restartuj R.':'Przejdź do następnego poziomu.');
    playing=false; return;
  }

  // Muchomory respawn po minucie
  for(const m of mushrooms){
    if(m.alive===false){
      m.timer=(m.timer||60)-dt;
      if(m.timer<=0){
        // odrodź w innym miejscu pod drzewem
        const t=trees[rr(0,trees.length)];
        m.x=t.x+rr(-8,9); m.y=t.y+rr(6,12); m.alive=true; m.timer=0;
      }
    } else {
      if(Math.hypot(m.x-boka.x,m.y-boka.y)<boka.r+m.r){
        m.alive=false; m.timer=60; boka.growT=15;
      }
    }
  }

  // Pickupy + respawn
  for(let i=0;i<boltPickups.length;i++){
    const p=boltPickups[i];
    if(p.alive && Math.hypot(p.x-boka.x,p.y-boka.y)<boka.r+p.r){
      boka.ammoAlt=Math.min(999,boka.ammoAlt+10); ammoAltText.textContent=boka.ammoAlt;
      ammoAltFill.style.width=Math.min(100,(boka.ammoAlt/100)*100)+'%';
      p.alive=false; p.timer=pickupRespawn;
    } else if(!p.alive && p.timer>0){ p.timer-=dt; if(p.timer<=0){
      // przenieś
      for(let t=0;t<100;t++){
        const c=1+rr(0,COLS-2), r=1+rr(0,ROWS-2);
        if(grid[r][c]!==0) continue;
        p.x=c*CELL+CELL/2; p.y=r*CELL+CELL/2; break;
      }
      p.alive=true;
    }}
  }
  for(let i=0;i<cloudPickups.length;i++){
    const p=cloudPickups[i];
    if(p.alive && Math.hypot(p.x-boka.x,p.y-boka.y)<boka.r+p.r){
      boka.ammoCloud+=5; ammoCloudText.textContent=boka.ammoCloud;
      cloudStockFill.style.width=Math.min(100,(boka.ammoCloud/20)*100)+'%';
      p.alive=false; p.timer=pickupRespawn;
    } else if(!p.alive && p.timer>0){ p.timer-=dt; if(p.timer<=0){
      for(let t=0;t<100;t++){
        const c=1+rr(0,COLS-2), r=1+rr(0,ROWS-2);
        if(grid[r][c]!==0) continue;
        p.x=c*CELL+CELL/2; p.y=r*CELL+CELL/2; break;
      }
      p.alive=true;
    }}
  }

  // Hatifnatowie – ruch i kontakt
  for(let i=hattis.length-1;i>=0;i--){
    const h=hattis[i];
    const sp=BOKA_BASE_SPEED*CELL/10 * ( (boka.growT>0)?1.33:1.0 );
    if(h.flee){
      // uciekaj prosto od Buki
      const dx=h.x-boka.x, dy=h.y-boka.y, d=Math.hypot(dx,dy)||1;
      h.x+= (dx/d)*sp*dt; h.y+=(dy/d)*sp*dt;
      // poza planszę -> znikaj
      if(h.x< -20 || h.y< -20 || h.x>COLS*CELL+20 || h.y>ROWS*CELL+20){ hattis.splice(i,1); checkHattisClear(); continue; }
    } else {
      const dx=boka.x-h.x, dy=boka.y-h.y, d=Math.hypot(dx,dy)||1;
      h.x+= (dx/d)*sp*dt; h.y+=(dy/d)*sp*dt;
      if(Math.hypot(h.x-boka.x,h.y-boka.y)<h.r+boka.r){
        boka.hp=Math.max(0,boka.hp-HP_MAX*0.10); // -10%
        h.flee=true;
      }
    }
  }

  if(boka.hp<=0){
    playing=false; overlay.hidden=false;
    document.getElementById('title').textContent='Przegrana';
    document.getElementById('desc').textContent='Hatifnatowie i ogniki cię wyczerpały. Spróbuj ponownie.';
    return;
  }

  draw();
  requestAnimationFrame(update);
}

// Rysowanie
function draw(){
  const th=themeFor(level);
  // kafle
  ctx.clearRect(0,0,canvas.width,canvas.height);
  for(let r=0;r<ROWS;r++) for(let c=0;c<COLS;c++){
    const x=c*CELL,y=r*CELL,w=CELL,h=CELL;
    const t=grid[r][c];
    let col = (t===1? th.wall : (t===2? shade(th.path,0.8) : (t===3? '#1a1a1a' : th.path)));
    if(boka.cloudActive){ col = shade(col,0.85); }
    ctx.fillStyle=col; ctx.fillRect(x,y,w,h);
    if(t===2){ ctx.strokeStyle='rgba(200,255,220,0.25)'; ctx.strokeRect(x+3,y+3,w-6,h-6); }
    if(t===3){ // kopalnia
      ctx.strokeStyle='rgba(50,50,50,0.6)'; ctx.strokeRect(x+2,y+2,w-4,h-4);
      ctx.fillStyle='#0a0a0a'; ctx.fillRect(x+4,y+4,w-8,h-8);
    }
  }

  // drzewa i muchomory
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

  // pickupy
  boltPickups.forEach(p=>{
    if(!p.alive) return;
    const g=ctx.createRadialGradient(p.x,p.y,2,p.x,p.y,12);
    g.addColorStop(0,'#dff4ff'); g.addColorStop(1,'#5ab0ff');
    ctx.strokeStyle='#aee1ff'; ctx.fillStyle=g;
    ctx.beginPath();
    ctx.moveTo(p.x, p.y-10); ctx.lineTo(p.x+5, p.y-2); ctx.lineTo(p.x+1, p.y-2); ctx.lineTo(p.x+8, p.y+10); ctx.lineTo(p.x-4, p.y+0); ctx.lineTo(p.x+2, p.y+0); ctx.closePath();
    ctx.fill(); ctx.stroke();
  });
  cloudPickups.forEach(p=>{
    if(!p.alive) return;
    ctx.fillStyle='rgba(180,220,255,0.95)';
    const x=p.x, y=p.y;
    ctx.beginPath();
    ctx.arc(x-6,y,6,0,Math.PI*2);
    ctx.arc(x,y-4,7,0,Math.PI*2);
    ctx.arc(x+7,y,5,0,Math.PI*2);
    ctx.closePath(); ctx.fill();
    ctx.strokeStyle='rgba(120,170,210,0.8)'; ctx.stroke();
  });

  // pułapki
  for(const t of traps){
    if(!t.active) continue;
    ctx.strokeStyle='rgba(200,180,80,0.8)';
    ctx.beginPath(); ctx.arc(t.x,t.y,10,0,Math.PI*2); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(t.x-8,t.y); ctx.lineTo(t.x+8,t.y); ctx.moveTo(t.x,t.y-8); ctx.lineTo(t.x,t.y+8); ctx.stroke();
  }

  // chmurki strachu i niebieskie
  fearClouds.forEach(f=>{ ctx.fillStyle='rgba(255,230,120,0.55)'; ctx.beginPath(); ctx.arc(f.x,f.y,f.r,0,Math.PI*2); ctx.fill(); });
  blueClouds.forEach(b=>{ ctx.fillStyle='rgba(140,200,255,0.7)'; ctx.beginPath(); ctx.arc(b.x,b.y,b.r,0,Math.PI*2); ctx.fill(); });

  // Muminki
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

  // Ogniki
  projs.forEach(p=>{ ctx.fillStyle='#a9ffbf'; ctx.beginPath(); ctx.arc(p.x,p.y,3,0,Math.PI*2); ctx.fill(); });

  // Pioruny
  iceBolts.forEach(b=>{
    ctx.strokeStyle='rgba(160,220,255,0.9)';
    ctx.beginPath(); ctx.moveTo(b.x-3,b.y); ctx.lineTo(b.x+3,b.y); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(b.x,b.y-3); ctx.lineTo(b.x,b.y+3); ctx.stroke();
  });

  // Włóczykij – smuklejszy, twarz/oko/kusza
  if(hunter.alive){
    ctx.save(); ctx.translate(hunter.x,hunter.y);
    const frozen=hunter.frozen>0;
    ctx.fillStyle=frozen ? 'rgba(160,240,220,0.9)' : '#7de6a9';
    // kapelusz
    ctx.beginPath(); ctx.moveTo(-8,-10); ctx.lineTo(8,-10); ctx.lineTo(0,-26); ctx.closePath(); ctx.fill();
    // twarz
    ctx.fillStyle='#e8f7ef'; ctx.beginPath(); ctx.ellipse(0,-6,5,4,0,0,Math.PI*2); ctx.fill();
    // oko patrzące na Bukę
    const dx=boka.x-hunter.x, dy=boka.y-hunter.y, d=Math.hypot(dx,dy)||1; const ox=(dx/d)*1.5, oy=(dy/d)*1.5;
    ctx.fillStyle='#213a2b'; ctx.beginPath(); ctx.arc(-1+ox,-6+oy,1.2,0,Math.PI*2); ctx.fill();
    // płaszcz – smukły trójkąt
    ctx.fillStyle=frozen ? 'rgba(160,240,220,0.9)' : '#7de6a9';
    ctx.beginPath(); ctx.moveTo(0,-10); ctx.lineTo(-9,14); ctx.lineTo(9,14); ctx.closePath(); ctx.fill();
    // kusza – celowanie do ostatniego kierunku strzału (na Bukę)
    ctx.strokeStyle='#1c3b2a'; ctx.lineWidth=2;
    const cx = Math.atan2(dy,dx);
    ctx.beginPath(); ctx.moveTo(0,0); ctx.lineTo(Math.cos(cx)*12, Math.sin(cx)*12); ctx.stroke();
    ctx.lineWidth=1;
    if(frozen){ ctx.strokeStyle='rgba(180,255,255,0.8)'; ctx.strokeRect(-11,-28,22,44); }
    ctx.restore();
  }

  // Buka
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

  // chmura mrozu
  if(boka.cloudActive){
    const radius=CLOUD_MAX_RADIUS*(boka.cloud/7.0)*2; // efekt większego oddechu
    const grd=ctx.createRadialGradient(boka.x,boka.y,10,boka.x,boka.y,radius);
    grd.addColorStop(0,'rgba(0,0,0,0.8)');
    grd.addColorStop(0.6,'rgba(0,0,0,0.6)');
    grd.addColorStop(1,'rgba(0,0,0,0)');
    ctx.fillStyle=grd; ctx.beginPath(); ctx.arc(boka.x,boka.y,radius,0,Math.PI*2); ctx.fill();
    ctx.strokeStyle='rgba(140,200,255,0.35)'; ctx.beginPath(); ctx.arc(boka.x,boka.y,Math.max(0,radius-6),0,Math.PI*2); ctx.stroke();
  }

  // Hatifnatowie – świecący, oczy w moją stronę
  for(const h of hattis){
    ctx.save(); ctx.translate(h.x,h.y);
    ctx.shadowColor='rgba(255,245,150,0.9)'; ctx.shadowBlur=12;
    ctx.fillStyle='rgba(255,255,200,0.95)';
    ctx.beginPath(); ctx.ellipse(0,0,6,12,0,0,Math.PI*2); ctx.fill();
    ctx.shadowBlur=0;
    // oczy
    const dx=boka.x-h.x, dy=boka.y-h.y, d=Math.hypot(dx,dy)||1; const ox=(dx/d)*1.5, oy=(dy/d)*1.5;
    ctx.fillStyle='#333'; ctx.beginPath(); ctx.arc(-2+ox,-2+oy,1.2,0,Math.PI*2); ctx.fill(); ctx.beginPath(); ctx.arc(2+ox,-2+oy,1.2,0,Math.PI*2); ctx.fill();
    ctx.restore();
  }

  // pogoda – noc/deszcz/mgła
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

  // panic dim
  if(panic){ /* warstwa #panicDim CSS już przyciemnia */ }

  // ramka
  ctx.strokeStyle='rgba(255,255,255,0.06)'; ctx.strokeRect(0.5,0.5,canvas.width-1,canvas.height-1);
}

// Start
function startGame(reset=false){
  overlay.hidden=true;
  if(reset){ level=1; score=0; boka.ammoAlt=100; boka.ammoCloud=5; boka.hp=HP_MAX; }
  updateHUDTheme();
  updateHUD();
  resetLevel();
  playing=true; paused=false;
  lastTick=performance.now();
  if(musicOn){ musicHappy.currentTime=0; musicHappy.play(); musicDark.pause(); musicPanic.pause(); }
  requestAnimationFrame(update);
}

// Export helpers do scope
window.startGame=startGame;

})();
