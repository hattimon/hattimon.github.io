(() => {
// Konfiguracja
const CELL=32, COLS=25, ROWS=18;
const MIN_BOARD=Math.min(COLS*CELL, ROWS*CELL);
const CLOUD_MAX_RADIUS=Math.floor(MIN_BOARD/5);

const HP_MAX=100;
const BOKA_BASE_SPEED=3.1, BOKA_R_BASE=14;
const HUNTER_R=11, HUNTER_AIM_RANGE=360;

// Zmniejszamy prędkość Włóczykija o 1/3 względem poprzedniej konfiguracji
function diff(level){
  const t=(level-1)/9;
  return {
    wallDensity: 0.26 + t*0.14,
    muminBase: 8 + Math.floor(level*1.2),
    hunterSpeed: (2.5 + t*1.2) * (2/3),         // 1/3 wolniej
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

// DOM
const canvas=document.getElementById('game'), ctx=canvas.getContext('2d');
const overlay=document.getElementById('overlay'), startBtn=document.getElementById('startBtn');
const pauseOv=document.getElementById('pause'), resumeBtn=document.getElementById('resumeBtn');
const leftEl=document.getElementById('left'), mushLeftEl=document.getElementById('mushLeft');
const lvlEl=document.getElementById('level'), scoreEl=document.getElementById('score');
const themeName=document.getElementById('themeName'), weatherName=document.getElementById('weatherName');
const hpFill=document.getElementById('hpFill'), frostFill=document.getElementById('frostFill');
const cloudStockFill=document.getElementById('cloudStockFill'), ammoAltFill=document.getElementById('ammoAltFill');
const ammoAltText=document.getElementById('ammoAltText'), ammoCloudText=document.getElementById('ammoCloudText');
const freezeT=document.getElementById('freezeT'), progressEl=document.getElementById('progress'), globalFreezeT=document.getElementById('globalFreezeT');
const musicBtn=document.getElementById('musicBtn'), musicBg=document.getElementById('musicBg'), musicPanic=document.getElementById('musicPanic');
const sfxBobek=document.getElementById('sfxBobek'), sfxDeathMumin=document.getElementById('sfxDeathMumin'), sfxDeathKij=document.getElementById('sfxDeathKij'), sfxWin=document.getElementById('sfxWin');
const panicDim=document.getElementById('panicDim'), globalFog=document.getElementById('globalFog');

// Audio
let musicOn=true;

// Stan gry
const boka={x:48,y:48,r:BOKA_R_BASE,hp:HP_MAX,poison:0,
  ammoAlt:100, ammoCloud:5, cloud:0, cloudActive:false, rooted:0, lookX:1, lookY:0,
  growT:0, growSpeedMul:1.0, // dodany mnożnik prędkości przy muchomorze
  chargeT:0, charging:false, globalFreeze:0};

const hunter={alive:true, x:COLS*CELL-80, y:ROWS*CELL-80, r:HUNTER_R, frozen:0, freezeHits:0, tShot:0};
const mumins=[], fearClouds=[], blueClouds=[], projs=[], iceBolts=[];
const boltPickups=[], cloudPickups=[]; const pickupRespawn=60;
const hattis=[]; let panic=false;
const cave={x:COLS*CELL-64,y:ROWS*CELL-64,r:26};
const bobek={active:false, x:0,y:0,r:8, dir:0, trapsLeft:0, speed:4.5};
const traps=[];
let level=1, score=0, playing=false, paused=false, weather='Dzień';
let lastTick=0;

// Wejście
const keys=new Set();
window.addEventListener('keydown',e=>{
  const mv=['ArrowUp','ArrowDown','ArrowLeft','ArrowRight','KeyW','KeyA','KeyS','KeyD'];
  if(mv.includes(e.code)){ e.preventDefault(); keys.add(e.code); }
  if(e.code==='ShiftLeft' || e.code==='ShiftRight'){ e.preventDefault(); if(!boka.charging){ boka.charging=true; boka.chargeT=0; } }
  if(e.code==='ControlLeft' || e.code==='ControlRight'){ e.preventDefault(); fireIceBolt(); }
  if(e.code==='KeyP'){ e.preventDefault(); paused=!paused; if(paused){ showPause(); } else hidePause(); }
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
  musicBtn.textContent='Muzyka: '+(musicOn?'ON':'OFF');
  if(!musicOn){ musicBg.pause(); musicPanic.pause(); }
  else { if(panic){ musicPanic.play(); } else { musicBg.play(); } }
});
startBtn.addEventListener('click',()=>{ overlay.hidden=true; startGame(); });
resumeBtn.addEventListener('click',()=>{ paused=false; hidePause(); });

// Pauza
function showPause(){ pauseOv.hidden=false; }
function hidePause(){ pauseOv.hidden=true; }

// Mapa
let grid=[], trees=[], mushrooms=[];
function isWall(c,r){if(r<0||c<0||r>=ROWS||c>=COLS)return true;return grid[r][c]===1}
function genMap(level){
  const d=diff(level), th=themeFor(level);
  trees=[]; mushrooms=[];
  grid=Array.from({length:ROWS},()=>Array(COLS).fill(0));
  for(let r=0;r<ROWS;r++)for(let c=0;c<COLS;c++) if(r===0||c===0||r===ROWS-1||c===COLS-1) grid[r][c]=1;
  for(let r=1;r<ROWS-1;r++) for(let c=1;c<COLS-1;c++) if(Math.random()<d.wallDensity) grid[r][c]=1;
  // carve
  let snakes=8+Math.floor(level/2);
  while(snakes--){
    let r=(ROWS>>1)+((Math.random()*6)|0)-3, c=(COLS>>1)+((Math.random()*6)|0)-3;
    for(let i=0;i<200;i++){
      grid[r][c]=0;
      const dir=(Math.random()*4)|0;
      if(dir===0&&r>1)r--; if(dir===1&&r<ROWS-2)r++;
      if(dir===2&&c>1)c--; if(dir===3&&c<COLS-2)c++;
    }
  }
  // domek 3x3: specjalne pola „2” – przechodnie dla wszystkich (nie blokują ruchu),
  // ale Buka nie może tam zjadać
  let dr=0,dc=0;
  for(let tries=0;tries<300;tries++){
    const r=2+((Math.random()*(ROWS-5))|0), c=2+((Math.random()*(COLS-5))|0);
    let ok=true; for(let rr2=r;rr2<r+3;rr2++) for(let cc=c;cc<c+3;cc++) if(isWall(cc,rr2)) ok=false;
    if(ok){dr=r;dc=c;break;}
  }
  for(let rr2=dr;rr2<dr+3;rr2++) for(let cc=dc;cc<dc+3;cc++) grid[rr2][cc]=2;

  // drzewa/muchomory
  const treeCount=16+Math.floor(level*1.2);
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
  hunter.alive=true; hunter.x=COLS*CELL-80; hunter.y=ROWS*CELL-80; hunter.frozen=0; hunter.freezeHits=0; hunter.tShot=0;

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

// Sterowanie: Shift – chmura
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
    boka.ammoCloud-=100;
    ammoCloudText.textContent=boka.ammoCloud;
    cloudStockFill.style.width=Math.min(100,(boka.ammoCloud/20)*100)+'%';
    boka.globalFreeze=60.0; boka.rooted=3.0;
    globalFog.hidden=false; globalFog.style.opacity='1';
    setTimeout(()=>{ globalFog.style.opacity='0'; }, 1500);
    freezeInRadius(99999, 60.0);
  } else if(t>=3 && boka.ammoCloud>=10){
    boka.ammoCloud-=10;
    ammoCloudText.textContent=boka.ammoCloud;
    cloudStockFill.style.width=Math.min(100,(boka.ammoCloud/20)*100)+'%';
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

// Bobek i pułapki
function triggerBobek(){
  if(bobek.active) return;
  sfxBobek.currentTime=0; sfxBobek.play();
  // Rozstaw od razu 5 pułapek po stronie domku (jak pick-upy – losowo, ale na połowie planszy z domkiem)
  placeWebTrapsNearHouse(5);
  // Bobek robi krótką przebieżkę i wraca
  bobek.active=true; bobek.x=cave.x; bobek.y=cave.y; bobek.dir=Math.random()*Math.PI*2; bobek.trapsLeft=0;
}
function placeWebTrapsNearHouse(n){
  // Znajdź bounding box domku
  let minC=COLS, minR=ROWS, maxC=0, maxR=0;
  for(let r=0;r<ROWS;r++) for(let c=0;c<COLS;c++) if(grid[r][c]===2){ if(c<minC)minC=c; if(c>maxC)maxC=c; if(r<minR)minR=r; if(r>maxR)maxR=r; }
  const houseCenterX=(minC+maxC+1)/2*CELL, houseCenterY=(minR+maxR+1)/2*CELL;
  const houseOnRight = houseCenterX > (COLS*CELL/2);

  for(let i=0;i<n;i++){
    for(let t=0;t<200;t++){
      const c = houseOnRight ? ((COLS/2)|0)+((Math.random()*((COLS-2)-(COLS/2)))|0) : 1+((Math.random()*((COLS/2)-2))|0);
      const r = 1+((Math.random()*(ROWS-2))|0);
      if(grid[r][c]!==0 && grid[r][c]!==2) continue; // pozwól także na okolicę domku
      const x=c*CELL+CELL/2, y=r*CELL+CELL/2;
      traps.push({x, y, r:11, active:true});
      break;
    }
  }
}
function updateBobek(dt){
  if(!bobek.active) return;
  const moved=moveCircle({x:bobek.x,y:bobek.y}, Math.cos(bobek.dir)*bobek.speed, Math.sin(bobek.dir)*bobek.speed, bobek.r);
  bobek.x=moved.x; bobek.y=moved.y;
  if(Math.random()<0.05){ bobek.dir=Math.random()*Math.PI*2; }
  // po chwili wraca do jaskini
  const dx=cave.x-bobek.x, dy=cave.y-bobek.y, d=Math.hypot(dx,dy);
  if(d<16){ bobek.active=false; } else if(Math.random()<0.05){ bobek.dir=Math.atan2(dy,dx); }
}
function updateTraps(){
  for(const t of traps){
    if(!t.active) continue;
    for(const m of mumins){
      if(!m.alive || m.trapped) continue;
      if(Math.hypot(m.x-t.x,m.y-t.y)<m.r+t.r){ m.trapped=true; m.frozen=999; }
    }
  }
}

// Hatifnatowie i muzyka PANIC
function summonHattis(onDeathBurst){
  const count = onDeathBurst? 15 : 10;
  hattis.length=0;
  for(let i=0;i<count;i++){
    const side=(Math.random()*4)|0; let x=0,y=0;
    if(side===0){ x=2; y=((Math.random()*ROWS*CELL)|0); }
    if(side===1){ x=COLS*CELL-2; y=((Math.random()*ROWS*CELL)|0); }
    if(side===2){ y=2; x=((Math.random()*COLS*CELL)|0); }
    if(side===3){ y=ROWS*CELL-2; x=((Math.random()*COLS*CELL)|0); }
    hattis.push({x,y,r:10, flee:false});
  }
  panic=true; panicDim.hidden=false;
  if(musicOn){ musicPanic.currentTime=0; musicPanic.play(); musicBg.pause(); }
}
function checkHattisClear(){
  if(hattis.length===0){
    panic=false; panicDim.hidden=true;
    if(musicOn){ musicPanic.pause(); musicBg.play(); }
  }
}

// Ruch/kolizje/projektyle
function moveCircle(obj,vx,vy,rad){
  let nx=obj.x+vx, ny=obj.y+vy;
  const minX=rad, minY=rad, maxX=COLS*CELL-rad, maxY=ROWS*CELL-rad;
  nx=Math.max(minX,Math.min(maxX,nx)); ny=Math.max(minY,Math.min(maxY,ny));
  // UWAGA: dom (tile 2) nie odpycha – więc nie liczymy kolizji z tile 2
  const c=(nx/CELL)|0, r=(ny/CELL)|0;
  for(let rr2=r-1;rr2<=r+1;rr2++) for(let cc=c-1;cc<=c+1;cc++){
    if(!grid[rr2]||grid[rr2][cc]===undefined) continue;
    if(grid[rr2][cc]===0 || grid[rr2][cc]===2) continue; // przechodnie
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

// Ctrl – piorun (ognikowy wygląd)
function fireIceBolt(){
  if(boka.ammoAlt<=0) return;
  const dirLen=Math.hypot(boka.lookX,boka.lookY)||1;
  const ux=boka.lookX/dirLen, uy=boka.lookY/dirLen;
  boka.ammoAlt--; ammoAltText.textContent=boka.ammoAlt;
  ammoAltFill.style.width=Math.min(100,(boka.ammoAlt/100)*100)+'%';
  iceBolts.push({x:boka.x+ux*16, y:boka.y+uy*16, vx:ux*7.0, vy:uy*7.0, ttl:2.5});
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

  // Ruch Buki (uwzględnij przyspieszenie z muchomora 1.5x)
  if(boka.growT>0){ boka.growT-=dt; if(boka.growT<=0){ boka.growSpeedMul=1.0; } }
  boka.r=BOKA_R_BASE * (boka.growT>0?4.0:1.0);
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

  // trucizna
  if(boka.poison>0){ boka.hp -= d.projDps*dt; boka.poison=Math.max(0,boka.poison-dt); }
  hpFill.style.width=Math.max(0,Math.min(100,(boka.hp/HP_MAX)*100))+'%';

  // Hunter
  if(hunter.alive){
    if(hunter.frozen>0) hunter.frozen-=dt;
    else{
      // priorytet: ratowanie uwięzionych
      const trapped = mumins.find(m=>m.alive && m.trapped);
      let dx,dy,distH;
      if(trapped){
        dx=trapped.x-hunter.x; dy=trapped.y-hunter.y; distH=Math.hypot(dx,dy);
      }else{
        dx=boka.x-hunter.x; dy=boka.y-hunter.y; distH=Math.hypot(dx,dy);
      }
      if(distH>1){
        const ux=dx/distH, uy=dy/distH;
        const moved=moveCircle(hunter, ux*d.hunterSpeed, uy*d.hunterSpeed, HUNTER_R);
        hunter.x=moved.x; hunter.y=moved.y;
      }
      hunter.tShot-=dt;
      if(!trapped && hunter.tShot<=0 && distH<HUNTER_AIM_RANGE && !(boka.cloudActive&&boka.rooted>0)){
        const speed=d.hunterProjSpeed;
        // ognikowy pocisk
        projs.push({x:hunter.x,y:hunter.y, vx:(dx/distH)*speed, vy:(dy/distH)*speed, ttl:6, flame:1});
        hunter.tShot=d.fireCooldown*(0.9+Math.random()*0.4);
      }
      if(trapped && distH<14){ trapped.trapped=false; trapped.frozen=0; }
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

  // Pioruny Ctrl
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
  }

  // Bobek i pułapki
  updateBobek(dt);
  updateTraps();

  // Muminki
  let aliveCount=0;
  for(const m of mumins){
    if(!m.alive) continue;
    aliveCount++;
    if(m.trapped){ /* stoi do zjedzenia lub uwolnienia */ }
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
        // uciekaj do domku – ruch przez pola „2” jest wolny (nie zderza się), więc wejdą.
        let target=null, best=1e9;
        for(let r=0;r<ROWS;r++) for(let c=0;c<COLS;c++) if(grid[r][c]===2){
          const tx=c*CELL+CELL/2, ty=r*CELL+CELL/2; const d2=Math.hypot(m.x-tx,m.y-ty);
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
    // zjedzenie poza domkiem – również jeśli w pułapce
    if(Math.hypot(m.x-boka.x,m.y-boka.y) < boka.r+m.r && !inHouse(m.x,m.y)){
      m.alive=false; aliveCount--; score+=50; scoreEl.textContent=score;
      sfxDeathMumin.currentTime=0; sfxDeathMumin.play();
      blueClouds.push({x:m.x,y:m.y,r:10, ttl:15});
      boka.ammoCloud+=3; ammoCloudText.textContent=boka.ammoCloud;
      cloudStockFill.style.width=Math.min(100,(boka.ammoCloud/20)*100)+'%';
    }
  }

  // Strach/niebieskie chmurki – nagrody
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

  // Postęp i koniec poziomu
  const totalM=mumins.length||1;
  progressEl.textContent=Math.round(((totalM-aliveCount)/totalM)*100)+'%';
  leftEl.textContent=aliveCount;
  if(aliveCount===0){
    if(level>=10){ finalWin(); return; }
    level++;
    overlay.hidden=false;
    document.getElementById('title').textContent = 'Poziom ukończony';
    document.getElementById('desc').textContent = 'Przejdź do następnego poziomu.';
    playing=false; return;
  }

  // Muchomory respawn i efekt: powiększenie + 1.5x szybszy ruch podczas trwania
  for(const m of mushrooms){
    if(m.alive===false){
      m.timer=(m.timer||60)-dt;
      if(m.timer<=0){
        const t=trees[(Math.random()*trees.length)|0];
        m.x=t.x+((Math.random()*18)|0)-9; m.y=t.y+6+((Math.random()*7)|0); m.alive=true; m.timer=0;
      }
    } else {
      if(Math.hypot(m.x-boka.x,m.y-boka.y)<boka.r+m.r){
        m.alive=false; m.timer=60;
        boka.growT=15; boka.growSpeedMul=1.5; // 150% prędkości
      }
    }
  }

  // pickupy
  updatePickups(boltPickups,'alt');
  updatePickups(cloudPickups,'cloud');

  // Hatifnatowie
  for(let i=hattis.length-1;i>=0;i--){
    const h=hattis[i];
    const sp=BOKA_BASE_SPEED*CELL/10 * ( (boka.growT>0)?1.5:1.0 );
    if(h.flee){
      const dx=h.x-boka.x, dy=h.y-boka.y, d=Math.hypot(dx,dy)||1;
      h.x+= (dx/d)*sp*dt; h.y+=(dy/d)*sp*dt;
      if(h.x< -20 || h.y< -20 || h.x>COLS*CELL+20 || h.y>ROWS*CELL+20){ hattis.splice(i,1); checkHattisClear(); continue; }
    } else {
      const dx=boka.x-h.x, dy=boka.y-h.y, d=Math.hypot(dx,dy)||1;
      h.x+= (dx/d)*sp*dt; h.y+=(dy/d)*sp*dt;
      if(Math.hypot(h.x-boka.x,h.y-boka.y)<h.r+boka.r){
        boka.hp=Math.max(0,boka.hp-HP_MAX*0.10);
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

function updatePickups(arr, kind){
  for(let i=0;i<arr.length;i++){
    const p=arr[i];
    if(p.alive && Math.hypot(p.x-boka.x,p.y-boka.y)<boka.r+p.r){
      if(kind==='alt'){
        boka.ammoAlt=Math.min(999,boka.ammoAlt+10); ammoAltText.textContent=boka.ammoAlt;
        ammoAltFill.style.width=Math.min(100,(boka.ammoAlt/100)*100)+'%';
      } else {
        boka.ammoCloud+=5; ammoCloudText.textContent=boka.ammoCloud;
        cloudStockFill.style.width=Math.min(100,(boka.ammoCloud/20)*100)+'%';
      }
      p.alive=false; p.timer=pickupRespawn;
    } else if(!p.alive && p.timer>0){
      p.timer-=1;
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

// Rysowanie
function draw(){
  const th=themeFor(level);
  ctx.clearRect(0,0,canvas.width,canvas.height);

  // kafle
  for(let r=0;r<ROWS;r++) for(let c=0;c<COLS;c++){
    const x=c*CELL,y=r*CELL,w=CELL,h=CELL;
    const t=grid[r][c];
    let col = (t===1? th.wall : (t===2? shade(th.path,0.8) : th.path));
    ctx.fillStyle=col; ctx.fillRect(x,y,w,h);
    if(t===2){ ctx.strokeStyle='rgba(200,255,220,0.25)'; ctx.strokeRect(x+3,y+3,w-6,h-6); }
  }

  // jaskinia – „kamienie”
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

  // drzewa/muchomory
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

  // pułapki – pajęczyny
  for(const t of traps){
    if(!t.active) continue;
    ctx.strokeStyle='rgba(220,220,255,0.9)';
    ctx.beginPath(); ctx.arc(t.x,t.y,12,0,Math.PI*2); ctx.stroke();
    ctx.beginPath();
    for(let a=0;a<6;a++){
      const ang=a*Math.PI/3;
      ctx.moveTo(t.x,t.y);
      ctx.lineTo(t.x+Math.cos(ang)*12, t.y+Math.sin(ang)*12);
    }
    ctx.stroke();
    ctx.beginPath();
    for(let r=4;r<=12;r+=4){
      ctx.arc(t.x,t.y,r,0,Math.PI*2);
    }
    ctx.stroke();
  }

  // chmurki strachu/niebieskie
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

  // Ogniki (pociski Włóczykija) – „flame”
  projs.forEach(p=>{
    const grd=ctx.createRadialGradient(p.x,p.y,0.5,p.x,p.y,6);
    grd.addColorStop(0,'rgba(255,240,160,1)');
    grd.addColorStop(0.6,'rgba(255,140,80,0.9)');
    grd.addColorStop(1,'rgba(255,80,40,0)');
    ctx.fillStyle=grd; ctx.beginPath(); ctx.arc(p.x,p.y,6,0,Math.PI*2); ctx.fill();
  });

  // Pioruny
  iceBolts.forEach(b=>{
    ctx.strokeStyle='rgba(160,220,255,0.9)';
    ctx.beginPath(); ctx.moveTo(b.x-3,b.y); ctx.lineTo(b.x+3,b.y); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(b.x,b.y-3); ctx.lineTo(b.x,b.y+3); ctx.stroke();
  });

  // Hunter – z okiem/kuszą
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

  // Bobek
  if(bobek.active){
    ctx.save(); ctx.translate(bobek.x,bobek.y);
    ctx.fillStyle='#101010'; ctx.beginPath(); ctx.arc(0,0,8,0,Math.PI*2); ctx.fill();
    for(let i=0;i<6;i++){ const a=i*(Math.PI*2/6); ctx.strokeStyle='#1d1d1d'; ctx.beginPath(); ctx.moveTo(Math.cos(a)*6,Math.sin(a)*6); ctx.lineTo(Math.cos(a)*10,Math.sin(a)*10); ctx.stroke(); }
    const ex=Math.cos(bobek.dir)*1.5, ey=Math.sin(bobek.dir)*1.5;
    ctx.fillStyle='#fff'; ctx.beginPath(); ctx.arc(-2,-2,1.8,0,Math.PI*2); ctx.fill(); ctx.beginPath(); ctx.arc(2,-2,1.8,0,Math.PI*2); ctx.fill();
    ctx.fillStyle='#000'; ctx.beginPath(); ctx.arc(-2+ex,-2+ey,0.6,0,Math.PI*2); ctx.fill(); ctx.beginPath(); ctx.arc(2+ex,-2+ey,0.6,0,Math.PI*2); ctx.fill();
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

  // chmura – lokalna/impuls
  if(boka.cloudActive){
    const radius=CLOUD_MAX_RADIUS*(boka.cloud/7.0)*2;
    const grd=ctx.createRadialGradient(boka.x,boka.y,10,boka.x,boka.y,Math.max(20,radius));
    grd.addColorStop(0,'rgba(0,0,0,0.6)');
    grd.addColorStop(1,'rgba(0,0,0,0)');
    ctx.fillStyle=grd; ctx.beginPath(); ctx.arc(boka.x,boka.y,Math.max(20,radius),0,Math.PI*2); ctx.fill();
  }

  // Hatifnatowie
  for(const h of hattis){
    ctx.save(); ctx.translate(h.x,h.y);
    ctx.shadowColor='rgba(255,245,150,0.9)'; ctx.shadowBlur=12;
    ctx.fillStyle='rgba(255,255,200,0.95)';
    ctx.beginPath(); ctx.ellipse(0,0,6,12,0,0,Math.PI*2); ctx.fill();
    ctx.shadowBlur=0;
    const dx=boka.x-h.x, dy=boka.y-h.y, d=Math.hypot(dx,dy)||1; const ox=(dx/d)*1.5, oy=(dy/d)*1.5;
    ctx.fillStyle='#333'; ctx.beginPath(); ctx.arc(-2+ox,-2+oy,1.2,0,Math.PI*2); ctx.fill(); ctx.beginPath(); ctx.arc(2+ox,-2+oy,1.2,0,Math.PI*2); ctx.fill();
    ctx.restore();
  }

  // pogoda/ramka
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

// Final – wygrana 10 poziomu
function finalWin(){
  playing=false;
  if(musicOn){ musicBg.pause(); }
  sfxWin.currentTime=0; sfxWin.play();
  const t0=performance.now();
  const anim=()=>{
    const t=(performance.now()-t0)/4000;
    ctx.save();
    ctx.clearRect(0,0,canvas.width,canvas.height);
    ctx.fillStyle='#001a12'; ctx.fillRect(0,0,canvas.width,canvas.height);
    const scale=1+ t*8;
    ctx.save(); ctx.translate(canvas.width/2, canvas.height/2); ctx.scale(scale, scale);
    ctx.fillStyle='#7ad1ff'; ctx.beginPath(); ctx.ellipse(0,40,60,90,0,0,Math.PI*2); ctx.fill();
    ctx.fillStyle='#eef9ff'; ctx.beginPath(); ctx.ellipse(-20,0,12,16,0,0,Math.PI*2); ctx.fill(); ctx.beginPath(); ctx.ellipse(20,0,12,16,0,0,Math.PI*2); ctx.fill();
    ctx.fillStyle='#0b1c10'; ctx.beginPath(); ctx.arc(-20,0,6,0,Math.PI*2); ctx.fill(); ctx.beginPath(); ctx.arc(20,0,6,0,Math.PI*2); ctx.fill();
    ctx.restore();
    for(let i=0;i<20;i++){
      const x=(i*37 + Math.sin(performance.now()/500+i)*100)%canvas.width;
      const y=(i*53 + Math.cos(performance.now()/500+i)*60)%canvas.height;
      ctx.fillStyle=`hsl(${(i*36)%360} 90% 60%)`;
      ctx.beginPath(); ctx.arc(x,y,2+Math.sin(performance.now()/100+i)*2,0,Math.PI*2); ctx.fill();
    }
    ctx.fillStyle='#ffffff'; ctx.font='bold 32px monospace'; ctx.textAlign='center';
    ctx.fillText('BUKA WON', canvas.width/2, 60);
    ctx.restore();
    if(t<1.0){ requestAnimationFrame(anim); }
  };
  anim();
}

// Start
function startGame(reset=false){
  if(reset){ level=1; score=0; boka.ammoAlt=100; boka.ammoCloud=5; boka.hp=HP_MAX; }
  resetLevel();
  overlay.hidden=true; paused=false; pauseOv.hidden=true;
  lastTick=performance.now();
  playing=true;
  if(musicOn){ musicBg.currentTime=0; musicBg.play(); }
  requestAnimationFrame(update);
}

// Utils
function themeFor(level){ return THEMES[(level-1)%THEMES.length]; }

})();
