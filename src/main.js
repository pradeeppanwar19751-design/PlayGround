import * as THREE from 'three';
import './style.css';

const $ = (s) => document.querySelector(s);
const gameEl = $('#game');
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const lerp = (a, b, t) => a + (b - a) * t;
const vec = (x=0,y=0,z=0) => new THREE.Vector3(x,y,z);
const saveKey = 'armour-protocol-save-v1';

const suitData = [
  ['MARK I','CAVE PROTOTYPE','#857b68','#332f2b','Heavy / crude',0,0.72,0.74,0.70],
  ['MARK II','POLISHED FLIGHT TEST','#c5ced5','#58636e','Flight prototype',1,1.05,0.92,1.04],
  ['MARK III','CLASSIC COMBAT','#bd302d','#d5a74d','Balanced interceptor',1,1.00,1.00,1.00],
  ['MARK IV','REFINED CLASSIC','#aa2827','#dbb354','Precision systems',2,1.06,1.06,1.04],
  ['MARK V','MOBILE SUITCASE','#c84b42','#d1d6dc','Light / compact',3,1.18,0.76,1.1],
  ['MARK VI','TRIANGULAR CORE','#a72727','#e1b54e','High-output core',4,1.08,1.16,1.1],
  ['MARK VII','RAPID DEPLOYMENT','#ba2928','#e5b651','Aerial superiority',5,1.16,1.12,1.12],
  ['MARK VIII','EXTREMIS TRIAL','#a72b2c','#f0bc65','Adaptive systems',6,1.14,1.12,1.18],
  ['MARK IX','EXTREMIS ADVANCED','#8f2429','#d9a95c','Reactive flight',6,1.18,1.12,1.2],
  ['MARK X','STEALTH VARIANT','#263748','#8fa4b3','Low signature',7,1.23,1.05,1.14],
  ['MARK XI','RECON VARIANT','#3b5055','#c6bd9d','Recon / efficient',8,1.2,1.12,1.25],
  ['MARK XII','MODULAR VARIANT','#42535c','#d1a950','Modular weapons',9,1.14,1.17,1.15],
  ['MARK XIII','DEEP RANGE','#263e55','#c1cbd2','Long-range flight',10,1.25,1.08,1.2],
  ['MARK XIV','WHITE SHADOW','#d7d6d0','#8c2731','Light assault',11,1.2,1.1,1.18],
  ['MARK XV','STEALTH','#26303b','#91a3ae','Silent approach',12,1.22,1.05,1.23],
  ['MARK XVI','NIGHT OPS','#252c36','#bf5648','Night operations',13,1.19,1.12,1.17],
  ['MARK XVII','HEARTBREAKER','#a42d30','#eab95f','Heavy repulsor',14,1.06,1.3,1.08],
  ['MARK XVIII','SILVER CENTURION*','#aeb6c1','#b23936','Precision / agile',15,1.19,1.18,1.12],
  ['MARK XIX','TIGER STRIPE*','#d08a34','#75383b','High mobility',16,1.23,1.1,1.12],
  ['MARK XX','STRENGTH*','#b0aaa0','#b17d46','Reinforced frame',17,0.94,1.27,1.0],
  ['MARK XXI','MANTIS*','#65707c','#c09a67','Survey flight',18,1.21,1.08,1.22],
  ['MARK XXII','HOT ROD*','#9e2929','#edbb61','High-speed pursuit',19,1.28,1.12,1.0],
  ['MARK XXIII','SHAZAM*','#d0b886','#8e3530','Heat-hardened',20,1.12,1.14,1.14],
  ['MARK XXIV','TANK*','#7e4943','#c49b4d','Siege plating',21,0.84,1.34,0.95],
  ['MARK XXV','STRIKER*','#566355','#b88e56','Industrial strength',22,0.9,1.31,1.02],
  ['MARK XXVI','GAMMA*','#638064','#c3bd91','Heavy utility',23,0.88,1.3,1.05],
  ['MARK XXVII','DISCO*','#526372','#a8c1cc','Electronic warfare',24,1.12,1.12,1.24],
  ['MARK XXVIII','JACK*','#af4137','#e2b759','Hazard response',25,1.05,1.2,1.12],
  ['MARK XXIX','FIDDLE*','#a7936e','#5b4140','Compact support',26,1.08,1.16,1.16],
  ['MARK XXX','BLUE STEEL*','#4d667c','#b2c0c8','High-altitude',27,1.22,1.08,1.18],
  ['MARK XXXI','PYTHON*','#b67c39','#505866','Tracking systems',28,1.1,1.12,1.22],
  ['MARK XXXII','ROMEO*','#b93934','#d2a650','Repulsor specialist',29,1.09,1.22,1.12],
  ['MARK XXXIII','SILVER CENTURION','#aeb9c4','#b73533','Adaptive energy',30,1.17,1.2,1.18],
  ['MARK XXXIV','SOUTHPAW*','#60656a','#b48d62','Rescue frame',31,1.07,1.18,1.16],
  ['MARK XXXV','RED SNAPPER*','#a3453b','#d0a254','Disaster response',32,0.95,1.28,1.06],
  ['MARK XXXVI','PEACEMAKER*','#a68d76','#51443b','Urban defence',33,0.99,1.18,1.08],
  ['MARK XXXVII','HAMMERHEAD*','#506779','#a8b7c1','Deep-sea pressure',34,0.98,1.22,1.1],
  ['MARK XXXVIII','IGOR*','#58646c','#bd9356','Heavy lift',35,0.79,1.38,0.94],
  ['MARK XXXIX','STARBOOST*','#e0e0d9','#aa3c36','Orbital flight',36,1.3,1.12,1.14],
  ['MARK XL','SHOTGUN*','#747d87','#d1b476','Hypervelocity',37,1.32,1.08,1.05],
  ['MARK XLI','BONES*','#c3c4c0','#525860','Exposed frame',38,1.2,0.96,1.28],
  ['MARK XLII','AUTONOMOUS PROTOTYPE','#bd342f','#d9aa53','Modular / adaptive',39,1.16,1.14,1.18],
  ['MARK XLIII','STEALTH COMBAT','#a12629','#d6ac57','Urban combat',40,1.16,1.19,1.12],
  ['MARK XLIV','HULKBUSTER*','#aa332c','#e3b454','Heavy assault',41,0.72,1.5,0.88],
  ['MARK XLV','ULTRON RESPONSE','#b43230','#e7c46f','Precision flight',42,1.2,1.22,1.16],
  ['MARK XLVI','BLEEDING EDGE*','#a1272b','#ded6c9','Nano modular',43,1.25,1.25,1.24],
  ['MARK XLVII','ADVANCED FIELD SUIT','#b83832','#dce0e2','All-round advanced',44,1.24,1.2,1.2]
].map(([name,subtitle,primary,accent,role,unlock,speed,armor,energy],i)=>({id:i,name,subtitle,primary,accent,role,unlock,speed,armor,energy,fan:name.includes('*')}));

const missionNames = [
 'THE FIRST ARMOUR','RETURN TO STARK','FIRST FLIGHT','THE OBSIDIAN FRONT','HOSTILE AIRSPACE',
 'STARK TECHNOLOGY THEFT','ARMOUR UPGRADE','DESERT STRIKE','THE IRON LEGION','HEAVY METAL',
 'THE UNDERGROUND LAB','THE SKYLINE BATTLE','THE COUNTERFEIT ARMOUR','NANOTECH BREAKTHROUGH','THE FINAL PROTOCOL',
 'OPERATION: BLACKOUT','THE GLASS HORIZON','BREAKWATER','THE LAST FORGE','ARMOUR PROTOCOL'
];
const missionBriefs = [
 'A weapons convoy is carrying Stark components into the badlands. Intercept it, recover the core, and get out alive.',
 'The route home is compromised. Reach the tower and bring the prototype safely into the workshop.',
 'Take the new flight system above the skyline. Clear the automated test drones to complete calibration.',
 'Obsidian Front forces are moving stolen technology through the city. Stop their strike team before it escapes.',
 'Hostile aircraft have entered restricted airspace. Protect the civilian flight corridor.',
 'An encrypted signal leads to a clandestine research site. Disable its security network.',
 'Field data is needed to validate a new armour package. Retrieve it under fire.',
 'A desert weapons installation is preparing to launch. Disable its power relays.',
 'Stolen autonomous armours are converging on the city. Break the formation.',
 'A heavy enemy frame guards the foundry. Outmaneuver it and take the site offline.',
 'An underground lab is producing unstable power cells. Destroy the prototype core.',
 'A hostile aircraft is circling the skyline. Engage and ground it.',
 'A counterfeit armour pilot is challenging the city response network. Defeat the frame.',
 'A breakthrough in adaptive plating can turn the tide. Secure the test data.',
 'The Front has assembled a city-scale energy weapon. Shut down its command frame.',
 'The blackout is masking a network of covert launches. Find and disable the relay.',
 'A glass-walled mountain array is tracking every flight in the region. Take it offline.',
 "The offshore forge is feeding the Front\'s armour program. Break its production line.",
 'The last enemy foundry is preparing an evacuation. Hold the perimeter.',
 "The final command armour is online. End the Obsidian Front\'s weapons program."
];

function loadSave(){
  try { return JSON.parse(localStorage.getItem(saveKey)) || {}; } catch { return {}; }
}
const stored=loadSave();
const state={
  started:false, paused:false, panel:'', mission:Math.max(0,stored.mission||0), completed:stored.completed||[],
  unlocked:stored.unlocked||[0], selected:stored.selected||0, credits:stored.credits??120, upgrades:stored.upgrades||{},
  health:100, energy:100, missiles:8, kills:0, shots:0, targets:[], objectiveIndex:0, missionActive:false,
  cameraYaw:0, cameraPitch:0.16, speed:0, flying:false, sound:true, quality:stored.quality||'high',
  jarvis:'Welcome back, sir. The city is quiet—for now.', notice:'', noticeTimer:0, lockTarget:null,
  touch:{}, cooldowns:{shot:0,missile:0,beam:0,special:0}, time:0, day:0.36
};

const scene=new THREE.Scene();
scene.background=new THREE.Color(0x91b6cc);
scene.fog=new THREE.FogExp2(0x91b6cc,0.00155);
const camera=new THREE.PerspectiveCamera(62,innerWidth/innerHeight,0.1,1400);
const renderer=new THREE.WebGLRenderer({antialias:true,powerPreference:'high-performance'});
renderer.setSize(innerWidth,innerHeight); renderer.setPixelRatio(Math.min(devicePixelRatio,state.quality==='high'?1.7:1));
renderer.shadowMap.enabled=state.quality==='high'; renderer.shadowMap.type=THREE.PCFSoftShadowMap;
renderer.outputColorSpace=THREE.SRGBColorSpace; renderer.toneMapping=THREE.ACESFilmicToneMapping; renderer.toneMappingExposure=1.12;
gameEl.appendChild(renderer.domElement);

scene.add(new THREE.HemisphereLight(0xc9e7ff,0x293342,2.1));
const sun=new THREE.DirectionalLight(0xffdfb5,3.2); sun.position.set(-130,240,-100); sun.castShadow=true; sun.shadow.mapSize.set(2048,2048); sun.shadow.camera.left=-240; sun.shadow.camera.right=240; sun.shadow.camera.top=240; sun.shadow.camera.bottom=-240; scene.add(sun);
const fill=new THREE.PointLight(0x268ac5,230,260); fill.position.set(0,70,0); scene.add(fill);
const mats={};
function mat(color,metalness=0,roughness=.65,emissive=0,emissiveIntensity=0){return new THREE.MeshStandardMaterial({color,metalness,roughness,emissive,emissiveIntensity});}
const groundMat=mat(0x25313b,.18,.9), roadMat=mat(0x111a22,.12,.92), whiteMat=mat(0xc7d6df,.08,.8), windowMat=mat(0x8bc4d8,.45,.22,0x4d95ba,.24);
const world=new THREE.Group(); scene.add(world);
const ground=new THREE.Mesh(new THREE.PlaneGeometry(1500,1500),groundMat); ground.rotation.x=-Math.PI/2; ground.position.y=-.12; ground.receiveShadow=true; world.add(ground);

// A compact, authored-feeling procedural city: avenues, varied skyline, waterfront and Stark tower.
for(let r=-5;r<=5;r++){
  const road=new THREE.Mesh(new THREE.BoxGeometry(1500,.045,12),roadMat); road.position.set(0,.01,r*96); road.receiveShadow=true; world.add(road);
  const cross=new THREE.Mesh(new THREE.BoxGeometry(12,.045,1500),roadMat); cross.position.set(r*96,.015,0); world.add(cross);
  for(let k=-7;k<=7;k++){
    const dash=new THREE.Mesh(new THREE.BoxGeometry(3,.035,.28),mat(0x9ca8a7,.1,.7,0x4c5c58,.12)); dash.position.set(k*16,.04,r*96+3.1); world.add(dash);
  }
}
const buildingMats=[0x263542,0x334451,0x3c4b57,0x1e2c39,0x48545a,0x293d4b,0x625e57].map(c=>mat(c,.35,.42));
let seed=3411; const rand=()=>{seed=(seed*1664525+1013904223)>>>0;return seed/4294967296;};
function addBuilding(x,z,w,d,h, landmark=false){
  const g=new THREE.Group(); g.position.set(x,0,z); world.add(g);
  const base=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),buildingMats[Math.floor(rand()*buildingMats.length)]); base.position.y=h/2; base.castShadow=true; base.receiveShadow=true; g.add(base);
  const rows=Math.floor(h/5), cols=Math.max(2,Math.floor(w/4));
  const panelGeo=new THREE.BoxGeometry(Math.min(1.05,w/(cols+1)),.65,.055);
  for(let ry=1;ry<rows;ry+=2)for(let cx=0;cx<cols;cx++){
    const win=new THREE.Mesh(panelGeo,rand()>.24?windowMat:mat(0x283b47,.2,.3));
    win.position.set(-w/2+(cx+1)*w/(cols+1),ry*4.2,d/2+.03); g.add(win);
    const win2=win.clone(); win2.position.z=-d/2-.03; g.add(win2);
  }
  if(landmark){
    const crown=new THREE.Mesh(new THREE.CylinderGeometry(3,8,18,8),mat(0x647783,.65,.25,0x287fa0,.3)); crown.position.y=h+9; g.add(crown);
    const ring=new THREE.Mesh(new THREE.TorusGeometry(8,.42,8,40),mat(0xd0a551,.7,.25,0xd18d32,.6)); ring.rotation.x=Math.PI/2; ring.position.y=h+13; g.add(ring);
  }
  return g;
}
for(let gx=-8;gx<=8;gx++)for(let gz=-8;gz<=8;gz++){
  const x=gx*48+(rand()-.5)*8, z=gz*48+(rand()-.5)*8;
  if(Math.abs(x)<20&&Math.abs(z)<20)continue;
  const h=14+rand()*74+(Math.abs(gx)+Math.abs(gz)<5?rand()*60:0);
  addBuilding(x,z,18+rand()*15,18+rand()*16,h,false);
}
const starkTower=addBuilding(-20,-20,31,31,205,true); starkTower.name='STARK INDUSTRIES';
const towerSign=new THREE.Mesh(new THREE.BoxGeometry(22,4,.4),mat(0x0d1b26,.5,.3,0x1a789a,.7)); towerSign.position.set(-20,140,-3); world.add(towerSign);
// waterfront / bridges / remote districts.
const water=new THREE.Mesh(new THREE.PlaneGeometry(1000,260),mat(0x245d76,.55,.18)); water.rotation.x=-Math.PI/2; water.position.set(0,-.4,-510); world.add(water);
for(let i=0;i<5;i++){const bridge=new THREE.Mesh(new THREE.BoxGeometry(360,2,9),mat(0x69757a,.7,.3));bridge.position.set(i%2?70:-90,5,-270-i*37);world.add(bridge);}
// Tower lights.
for(let i=0;i<9;i++){const lamp=new THREE.PointLight(0x2d9ec9,14,70);lamp.position.set(-20,18+i*19,-20);scene.add(lamp);}

const player=new THREE.Group(); player.position.set(0,2,28); scene.add(player);
const suitRoot=new THREE.Group(); player.add(suitRoot);
function addMesh(parent,geo,material,pos,scale,rot){const m=new THREE.Mesh(geo,material);if(pos)m.position.set(...pos);if(scale)m.scale.set(...scale);if(rot)m.rotation.set(...rot);m.castShadow=true;m.receiveShadow=true;parent.add(m);return m;}
let suitParts={};
function makeSuit(suit){
  suitRoot.clear();
  const red=mat(suit.primary,.72,.28), gold=mat(suit.accent,.68,.26), dark=mat(0x202a33,.7,.34), glow=mat(0x9deeff,.25,.18,0x36c8ff,3.2), core=mat(0x9deeff,.3,.2,0x42caff,4.2);
  const body=new THREE.Group();suitRoot.add(body); suitParts={body,glows:[]};
  const torsoW=suit.id===43?.98:suit.id===22?.78:.8;
  addMesh(body,new THREE.SphereGeometry(.55,18,14),red,[0,1.18,0],[torsoW,.78,.42]);
  addMesh(body,new THREE.BoxGeometry(.78,.28,.4),gold,[0,1.52,0]);
  addMesh(body,new THREE.SphereGeometry(.2,14,10),core,[0,1.27,-.427],[1,1,.25]);
  for(const s of [-1,1]){
    addMesh(body,new THREE.SphereGeometry(.29,14,10),gold,[s*.57,1.64,0],[1,.8,.9]);
    addMesh(body,new THREE.CapsuleGeometry(.17,.48,5,9),red,[s*.63,1.25,0],[1,1,1],[0,0,s*-.17]);
    addMesh(body,new THREE.SphereGeometry(.2,12,10),gold,[s*.65,.94,0],[.9,1.1,.85]);
    const arm=new THREE.Group();arm.position.set(s*.7,.9,0);body.add(arm);suitParts['arm'+s]=arm;
    addMesh(arm,new THREE.CapsuleGeometry(.14,.55,5,9),red,[s*.07,-.32,0],[1,1,1],[0,0,-s*.08]);
    addMesh(arm,new THREE.SphereGeometry(.18,12,10),dark,[s*.07,-.65,0],[1,1,.9]);
    const palm=addMesh(arm,new THREE.CircleGeometry(.13,20),glow,[s*.07,-.65,.16],[1,1,1]); palm.rotation.x=0; suitParts.glows.push(palm);
    addMesh(body,new THREE.CapsuleGeometry(.19,.62,5,9),dark,[s*.26,.48,0],[1,1,1],[0,0,-s*.04]);
    addMesh(body,new THREE.SphereGeometry(.2,12,10),red,[s*.26,.2,0],[1,1,.85]);
    const thr=addMesh(body,new THREE.CircleGeometry(.12,18),glow,[s*.26,.04,0]);thr.rotation.x=Math.PI; suitParts.glows.push(thr);
  }
  addMesh(body,new THREE.BoxGeometry(.45,.22,.46),dark,[0,.78,0]);
  const head=new THREE.Group();head.position.set(0,2.02,0);body.add(head);suitParts.head=head;
  addMesh(head,new THREE.SphereGeometry(.32,18,14),gold,[0,0,0],[.88,1.05,.86]);
  addMesh(head,new THREE.BoxGeometry(.42,.12,.07),glow,[0,.01,.278]);
  addMesh(head,new THREE.BoxGeometry(.34,.15,.06),red,[0,-.17,.23]);
  addMesh(head,new THREE.ConeGeometry(.15,.16,4),gold,[0,-.34,.1],[1,1,.85],[Math.PI,0,Math.PI/4]);
  // Suit silhouette is varied through purposeful modular panels, back fins and shoulders.
  const wingStyle=suit.id%5;
  if([4,9,14,22,32,40].includes(suit.id)){
    for(const s of [-1,1])addMesh(body,new THREE.BoxGeometry(.18,.72,.55),dark,[s*.86,1.25,-.12],[1,1,1],[0,0,s*-.16]);
  } else if([17,41,43].includes(suit.id)){
    for(const s of [-1,1]) addMesh(body,new THREE.BoxGeometry(.32,.44,.28),gold,[s*.52,1.72,-.03],[1,1,1],[0,0,s*-.2]);
  } else if(wingStyle===2){
    for(const s of [-1,1])addMesh(body,new THREE.ConeGeometry(.12,.75,5),gold,[s*.65,1.52,-.4],[1,1,1],[s*.7,0,s*-.3]);
  }
  if(suit.id===43){addMesh(body,new THREE.BoxGeometry(1.5,1,.65),red,[0,1.3,-.4]); addMesh(body,new THREE.SphereGeometry(.55,12,9),gold,[0,.35,0],[1.3,.9,1.2]);}
  if(suit.id===4){body.scale.set(.84,.9,.82);}
  if([19,24,37,43].includes(suit.id)){body.scale.set(1.27,1.18,1.18);}
  suitRoot.userData.primary=red; suitRoot.userData.accent=gold;
}
makeSuit(suitData[state.selected]||suitData[0]);

const projectiles=new THREE.Group();scene.add(projectiles);const enemies=[];const particles=[];const enemyShots=[];const markers=[];
const enemyTypes=[
 {name:'SCOUT DRONE',color:0x708796,hp:44,speed:13,range:105,damage:5,scale:.82,kind:'drone'},
 {name:'FRONT TROOPER',color:0x6a4140,hp:68,speed:8,range:92,damage:7,scale:1,kind:'trooper'},
 {name:'STRIKE FRAME',color:0x8c4239,hp:145,speed:6,range:125,damage:11,scale:1.55,kind:'heavy'},
 {name:'COMMANDER',color:0x9c3031,hp:240,speed:9,range:145,damage:13,scale:1.8,kind:'boss'}
];
function makeEnemy(type,position){
  const def=enemyTypes[type],g=new THREE.Group();g.position.copy(position);scene.add(g);
  const armor=mat(def.color,.76,.32), trim=mat(0x202d37,.74,.34), eye=mat(0xff5d4d,.2,.2,0xff2a1c,3.5);
  addMesh(g,new THREE.BoxGeometry(.9,.65,.55),armor,[0,0,0],[def.scale,def.scale,def.scale]);
  addMesh(g,new THREE.SphereGeometry(.22,12,10),armor,[0,.52*def.scale,0],[1.1,1,.9]);
  addMesh(g,new THREE.BoxGeometry(.4,.1,.08),eye,[0,.54*def.scale,.21*def.scale]);
  for(const s of [-1,1]){
    addMesh(g,new THREE.CylinderGeometry(.13,.16,.55,8),trim,[s*.56*def.scale,-.1,0],[1,1,1],[0,0,s*.2]);
    addMesh(g,new THREE.CylinderGeometry(.14,.12,.48,8),armor,[s*.22*def.scale,-.52*def.scale,0]);
    if(type>1)addMesh(g,new THREE.CylinderGeometry(.11,.11,.48,8),armor,[s*.63*def.scale,.35*def.scale,0],[1,1,1],[0,0,s*-.65]);
  }
  const e={group:g,type,def,hp:def.hp,maxHp:def.hp,fire:1+rand()*1.5,phase:0,alive:true};enemies.push(e);return e;
}
function addParticle(position,color=0x5ddcff,amount=9,size=.12){
  for(let i=0;i<amount;i++){
    const mesh=new THREE.Mesh(new THREE.SphereGeometry(size*(.45+rand()),6,5),mat(color,.3,.25,color,.8));mesh.position.copy(position);scene.add(mesh);
    const vel=vec((rand()-.5)*8,rand()*8,(rand()-.5)*8);particles.push({mesh,vel,life:.45+rand()*.65,max:.8});
  }
}
function clearEnemies(){for(const e of [...enemies])scene.remove(e.group);enemies.length=0;}
function clearTarget(){state.lockTarget=null;}
function spawnWave(){
  clearEnemies();clearTarget();
  const n=Math.min(3+Math.floor(state.mission*.55),12);
  for(let i=0;i<n;i++){
    const a=i/n*Math.PI*2+rand()*.4,dist=48+rand()*35;
    let type=i%4===0&&state.mission>2?1:i%3===0?0:1;
    if(state.mission>6&&i%4===3)type=2;
    if(state.mission>0&&state.mission%4===3&&i===n-1)type=3;
    makeEnemy(type,vec(player.position.x+Math.sin(a)*dist,8+rand()*24,player.position.z+Math.cos(a)*dist));
  }
  const objective=document.querySelector('#objective-text');if(objective)objective.textContent=`Neutralize the Obsidian Front squad (${enemies.length} hostiles)`;
}

const ui=document.createElement('div');ui.id='ui';ui.innerHTML=`
  <div class="topbar"><div class="brand"><div class="brand-mark"><span></span></div><div><b>STARK INDUSTRIES</b><small>ARMOUR PROTOCOL <i>• FIELD SYSTEMS</i></small></div></div><div class="top-center"><span class="live-dot"></span><span id="zone-name">MANHATTAN / EAST DISTRICT</span><span class="divider"></span><span id="clock">18:42</span></div><div class="top-actions"><button class="icon-btn" id="sound-btn" title="Sound">♫</button><button class="icon-btn" id="save-btn" title="Save">◉</button><button class="icon-btn" id="pause-btn" title="Pause">Ⅱ</button></div></div>
  <div class="hud-left"><div class="mission-kicker"><span class="kicker-line"></span> ACTIVE OPERATION</div><h2 id="mission-title">THE FIRST ARMOUR</h2><p id="objective-text">Reach the convoy and secure the Stark power core.</p><div class="mission-progress"><div id="objective-progress"></div></div><div class="hud-label-row"><span>OBJECTIVE</span><span id="objective-count">01 / 03</span></div><div class="compass"><div class="compass-track"><span>N</span><span>NE</span><span>E</span><span>SE</span><span>S</span><span>SW</span><span>W</span><span>NW</span></div><div class="compass-notch"></div></div></div>
  <div class="hud-right"><div class="target-card hidden" id="target-card"><div class="target-head"><span class="target-icon">⌖</span><div><small>HOSTILE SIGNATURE</small><b id="target-name">SCOUT DRONE</b></div><span class="target-range" id="target-range">-- m</span></div><div class="target-bar"><i id="target-health"></i></div></div><div class="minimap-wrap"><div class="map-title">TACTICAL RADAR <span>● LIVE</span></div><canvas id="minimap" width="196" height="154"></canvas><span class="map-n">N</span></div><div class="threat-status"><span class="threat-pip"></span><span id="threat-status">AREA CLEAR</span></div></div>
  <div class="bottom-left"><div class="jarvis-icon">J</div><div class="jarvis-copy"><div class="jarvis-title">J.A.R.V.I.S. <span>ONLINE</span></div><p id="jarvis-text">${state.jarvis}</p></div><button id="scan-btn" class="scan-button">SCAN <span>⌕</span></button></div>
  <div class="bottom-center"><div class="suit-name"><span id="suit-title">MARK I</span><small id="suit-subtitle">CAVE PROTOTYPE</small></div><div class="status-row"><div class="meter-block"><div class="meter-label"><span>ARMOUR</span><b id="health-value">100%</b></div><div class="meter"><i id="health-bar"></i></div></div><div class="meter-block energy-block"><div class="meter-label"><span>ENERGY</span><b id="energy-value">100%</b></div><div class="meter energy-meter"><i id="energy-bar"></i></div></div></div><div class="flight-stats"><span><b id="speed-value">000</b> <small>KM/H</small></span><span><b id="alt-value">02</b> <small>ALT</small></span><span><b id="missile-value">08</b> <small>MICRO-MISSILES</small></span></div></div>
  <div class="bottom-right"><div class="weapon-badge"><div class="weapon-symbol">✣</div><div><small>WEAPON SYSTEM</small><b>REPULSOR</b></div><span class="weapon-key">LMB</span></div><div class="ability-row"><div class="ability"><kbd>R</kbd><span>MISSILE</span></div><div class="ability"><kbd>F</kbd><span>UNIBEAM</span></div><div class="ability"><kbd>Q</kbd><span>BOOST</span></div><div class="ability"><kbd>TAB</kbd><span>SUIT</span></div></div></div>
  <div class="reticle" id="reticle"><i></i><i></i><i></i><i></i><b></b></div><div id="toast" class="toast"></div><div id="mission-result" class="result-toast"></div>
  <div class="crosshair-hint">WASD MOVE <span>•</span> SPACE TAKEOFF <span>•</span> MOUSE LOOK <span>•</span> E INTERACT</div>
  <div class="modal-layer" id="modal-layer"></div>`;
gameEl.appendChild(ui);

const modal=$('#modal-layer');
function showToast(message){const t=$('#toast');t.textContent=message;t.classList.add('show');state.noticeTimer=2.8;}
function jarvis(message){state.jarvis=message;$('#jarvis-text').textContent=message;$('#jarvis-text').classList.remove('jarvis-pulse');void $('#jarvis-text').offsetWidth;$('#jarvis-text').classList.add('jarvis-pulse');}
function saveGame(manual=false){
  const data={mission:state.mission,completed:state.completed,unlocked:state.unlocked,selected:state.selected,credits:state.credits,upgrades:state.upgrades,quality:state.quality};
  localStorage.setItem(saveKey,JSON.stringify(data));if(manual){showToast('PROGRESS SAVED TO LOCAL PROFILE');sound('confirm');}
}
function openPanel(name){state.panel=name;state.paused=true;document.exitPointerLock?.();renderPanel();}
function closePanel(){state.panel='';state.paused=false;modal.innerHTML='';}
function overlay(title,eyebrow,body,actions){modal.innerHTML=`<div class="modal-backdrop"><div class="modal-card"><button class="modal-close" data-action="close">×</button><div class="panel-kicker">${eyebrow}</div><h2>${title}</h2>${body}<div class="modal-actions">${actions}</div></div></div>`;}
function renderPanel(){
  if(state.panel==='pause'){
    overlay('SYSTEM PAUSED','ARMOUR PROTOCOL / FIELD MENU',`<p class="panel-lede">Operations are suspended. Your field position and combat state are retained.</p><div class="pause-grid"><div><span>ACTIVE ARMOUR</span><b>${suitData[state.selected].name}</b></div><div><span>TECH CREDITS</span><b>${state.credits.toLocaleString()}</b></div><div><span>CAMPAIGN</span><b>${state.completed.length} / 20 COMPLETE</b></div><div><span>FIELD STATUS</span><b>${state.health>0?'OPERATIONAL':'CRITICAL'}</b></div></div>`,`<button class="primary-btn" data-action="resume">RESUME FLIGHT <span>↗</span></button><button class="ghost-btn" data-action="armory">ARMOUR LAB</button><button class="ghost-btn" data-action="missions">MISSIONS</button><button class="ghost-btn" data-action="save">SAVE PROGRESS</button><button class="ghost-btn" data-action="settings">SETTINGS</button>`);
  } else if(state.panel==='armory'){
    const suit=suitData[state.selected],unlocked=suitData.filter(s=>state.unlocked.includes(s.id));
    const suitRows=unlocked.map(s=>`<button class="suit-chip ${s.id===state.selected?'active':''}" data-suit="${s.id}"><i style="--suit:${s.primary};--accent:${s.accent}"></i><span>${s.name}</span><small>${s.role}</small></button>`).join('');
    const up=state.upgrades[state.selected]||{flight:0,defense:0,weapons:0};
    const upgradeRow=(key,title,label,cost,desc)=>`<div class="upgrade-row"><div><b>${title}</b><small>${desc}</small></div><div class="upgrade-value">LV ${up[key]||0}<small>→ ${Math.min(5,(up[key]||0)+1)}</small></div><button class="upgrade-btn" data-upgrade="${key}" ${up[key]>=5?'disabled':''}>${up[key]>=5?'MAX':`⬡ ${cost}`}</button></div>`;
    overlay('ARMOUR LAB','STARK INDUSTRIES / SUIT DEVELOPMENT',`<p class="panel-lede">Select a certified field frame. Configuration updates apply immediately; experimental variants are marked with an asterisk.</p><div class="armory-layout"><div class="suit-list">${suitRows||'<p>No certified armour yet.</p>'}</div><div class="suit-detail"><div class="suit-preview"><div class="preview-glow"></div><div class="mini-silhouette" style="--suit:${suit.primary};--accent:${suit.accent}"><i></i><b></b><em></em><span></span></div><div class="preview-rotate">DRAG TO ROTATE</div></div><div class="suit-meta"><div><h3>${suit.name}</h3><span>${suit.subtitle}${suit.fan?' / FAN-CREATED VARIANT':''}</span></div><b class="suit-class">${suit.role}</b></div><div class="stat-grid"><div><span>FLIGHT</span><b>${Math.round(68*suit.speed+up.flight*5)}<small> / 100</small></b><i style="--fill:${Math.min(100,68*suit.speed+up.flight*5)}%"></i></div><div><span>ARMOUR</span><b>${Math.round(65*suit.armor+up.defense*6)}<small> / 100</small></b><i style="--fill:${Math.min(100,65*suit.armor+up.defense*6)}%"></i></div><div><span>ENERGY</span><b>${Math.round(72*suit.energy+up.weapons*4)}<small> / 100</small></b><i style="--fill:${Math.min(100,72*suit.energy+up.weapons*4)}%"></i></div></div><div class="upgrade-heading"><b>FIELD UPGRADES</b><span>AVAILABLE ⬡ ${state.credits}</span></div>${upgradeRow('flight','VECTOR DRIVE','Speed & acceleration',60,'Flight response +5%')}${upgradeRow('defense','REACTIVE PLATING','Hull & shield',75,'Armour integrity +6%')}${upgradeRow('weapons','REPULSOR ARRAY','Damage & efficiency',70,'Weapon output +4%')}</div></div>`,`<button class="primary-btn" data-action="deploy">DEPLOY ${suit.name} <span>↗</span></button><button class="ghost-btn" data-action="research">TECH RESEARCH</button><button class="ghost-btn" data-action="resume">BACK TO FLIGHT</button>`);
  } else if(state.panel==='missions'){
    const missions=missionNames.map((name,i)=>`<button class="mission-row ${state.completed.includes(i)?'done':''} ${state.mission===i?'current':''}" data-mission="${i}"><span class="mission-index">${String(i+1).padStart(2,'0')}</span><span><b>${name}</b><small>${missionBriefs[i]}</small></span><span class="mission-state">${state.completed.includes(i)?'COMPLETE':i<=Math.max(...state.completed,-1)+1?'AVAILABLE':'LOCKED'}</span></button>`).join('');
    overlay('OPERATIONS','MISSION CONTROL / CAMPAIGN',`<p class="panel-lede">The Obsidian Front campaign unfolds across the city and its surrounding installations. Replay completed operations at any time.</p><div class="mission-list">${missions}</div><div class="side-mission-strip"><b>OPTIONAL CONTRACTS</b><span>10 FIELD CONTRACTS · Scan 3 caches, intercept patrols, or test prototype systems. Each grants credits.</span><button data-action="side-mission">ACCEPT CONTRACT</button></div>`,`<button class="primary-btn" data-action="deploy-mission">DEPLOY OPERATION ${String(state.mission+1).padStart(2,'0')} <span>↗</span></button><button class="ghost-btn" data-action="resume">BACK</button>`);
  } else if(state.panel==='research'){
    const next=state.unlocked.length, req=next*2+2, can=state.credits>=req*20;
    overlay('TECHNOLOGY RESEARCH','ADVANCED SYSTEMS / DEVELOPMENT',`<p class="panel-lede">Analyse recovered Obsidian components to certify the next armour platform. Each successful operation advances available research.</p><div class="research-card"><div class="research-symbol">⌬</div><div><small>NEXT CERTIFICATION</small><h3>${suitData[next]?.name||'ALL FRAMES CERTIFIED'}</h3><p>${suitData[next]?.role||'No further prototype frames are pending.'}</p></div><div class="research-cost">${suitData[next]?`⬡ ${req*20} CREDITS`:'COMPLETE'}</div></div><div class="research-progress"><span>TECH DATA</span><b>${state.completed.length} / ${req} OPERATIONS</b><i><em style="width:${Math.min(100,state.completed.length/req*100)}%"></em></i></div><p class="small-note">Prototype suits are earned through campaign progress. Additional optional contracts grant research credits.</p>`,`<button class="primary-btn" data-action="certify" ${next>=47||!can?'disabled':''}>CERTIFY NEXT FRAME <span>↗</span></button><button class="ghost-btn" data-action="resume">RETURN TO LAB</button>`);
  } else if(state.panel==='settings'){
    overlay('SYSTEM SETTINGS','PREFERENCES / PERFORMANCE',`<p class="panel-lede">Adjust rendering performance and sound. Changes apply immediately.</p><div class="settings-row"><div><b>RENDER QUALITY</b><small>Lower settings improve performance on integrated graphics.</small></div><div class="segmented"><button data-quality="low" class="${state.quality==='low'?'selected':''}">PERFORMANCE</button><button data-quality="high" class="${state.quality==='high'?'selected':''}">HIGH</button></div></div><div class="settings-row"><div><b>COMBAT AUDIO</b><small>Original procedural sound effects.</small></div><button class="toggle-btn" data-action="toggle-sound">${state.sound?'ON':'OFF'}</button></div><div class="settings-row"><div><b>CAMERA SENSITIVITY</b><small>Adjust field-of-view and look response.</small></div><span class="settings-value">${Math.round(camera.fov)}° / STANDARD</span></div><p class="small-note">Controls: WASD move · Space ascend / takeoff · Ctrl descend · Shift boost · LMB repulsor · RMB target · R missile · F Unibeam · E interact.</p>`,`<button class="primary-btn" data-action="resume">DONE <span>↗</span></button>`);
  } else if(state.panel==='victory'){
    overlay('OPERATION COMPLETE','FIELD REPORT / SUCCESS',`<p class="panel-lede">${missionBriefs[state.mission]} The recovered technology has been secured for analysis.</p><div class="result-grid"><div><span>HOSTILES NEUTRALIZED</span><b>${state.kills}</b></div><div><span>TECH CREDITS EARNED</span><b>+${100+state.mission*24}</b></div><div><span>ARMOUR STATUS</span><b>${Math.round(state.health)}% INTEGRITY</b></div><div><span>NEW FRAME</span><b>${state.unlocked.length<suitData.length?suitData[state.unlocked.length].name:'RESEARCH COMPLETE'}</b></div></div>`,`<button class="primary-btn" data-action="next-mission">CONTINUE CAMPAIGN <span>↗</span></button><button class="ghost-btn" data-action="armory">ARMOUR LAB</button><button class="ghost-btn" data-action="missions">MISSION CONTROL</button>`);
  } else if(state.panel==='failure'){
    overlay('ARMOUR CRITICAL','FIELD REPORT / ABORTED',`<p class="panel-lede">Suit integrity reached zero. J.A.R.V.I.S. initiated emergency extraction. Mission telemetry has been retained.</p><div class="failure-readout"><span>OPERATION</span><b>${missionNames[state.mission]}</b><span>HOSTILES REMAINING</span><b>${enemies.length}</b><span>RECOVERED CREDITS</span><b>⬡ ${state.credits}</b></div>`,`<button class="primary-btn" data-action="retry">RETRY OPERATION <span>↗</span></button><button class="ghost-btn" data-action="armory">ARMOUR LAB</button><button class="ghost-btn" data-action="missions">MISSION CONTROL</button>`);
  } else if(state.panel==='title'){
    overlay('ARMOUR PROTOCOL','STARK INDUSTRIES / CLASSIFIED',`<div class="title-art"><div class="title-core"></div><div class="title-lines"></div><span>FLIGHT SYSTEMS ONLINE</span></div><p class="title-tagline">THE SKY IS YOURS.<br><b>THE PROTOCOL IS YOURS TO WRITE.</b></p><p class="panel-lede">The Obsidian Front has stolen Stark technology and weaponized it. Intercept their first convoy, protect the city, and build the armour that can stop what comes next.</p><div class="title-controls"><span>WASD <b>MOVE</b></span><span>SPACE <b>ASCEND</b></span><span>SHIFT <b>BOOST</b></span><span>LMB <b>REPULSOR</b></span></div>`,`<button class="primary-btn" data-action="new-game">${stored.mission!==undefined?'NEW OPERATION':'BEGIN OPERATION'} <span>↗</span></button>${stored.mission!==undefined?'<button class="ghost-btn" data-action="continue">CONTINUE SAVED GAME</button>':''}<button class="ghost-btn" data-action="armory">ARMOUR DATABASE</button><button class="ghost-btn" data-action="settings">SETTINGS</button>`);
  }
}

function sound(kind){if(!state.sound)return;try{const ctx=sound.ctx||(sound.ctx=new AudioContext());const osc=ctx.createOscillator(),gain=ctx.createGain();osc.connect(gain);gain.connect(ctx.destination);const now=ctx.currentTime;const presets={shot:[520,.075,'triangle'],hit:[110,.1,'sawtooth'],explosion:[72,.28,'sawtooth'],boost:[180,.16,'sine'],confirm:[680,.12,'sine'],warning:[290,.2,'square']};const [freq,duration,type]=presets[kind]||presets.confirm;osc.type=type;osc.frequency.setValueAtTime(freq,now);osc.frequency.exponentialRampToValueAtTime(Math.max(35,freq*.42),now+duration);gain.gain.setValueAtTime(.055,now);gain.gain.exponentialRampToValueAtTime(.001,now+duration);osc.start(now);osc.stop(now+duration);}catch{}}

function beginMission(index=state.mission){
  state.mission=clamp(index,0,19);state.missionActive=true;state.panel='';state.paused=false;state.health=100;state.energy=100;state.missiles=8;state.kills=0;state.objectiveIndex=0;state.speed=0;
  player.position.set(0,2,28);makeSuit(suitData[state.selected]);spawnWave();
  $('#mission-title').textContent=missionNames[state.mission];$('#objective-text').textContent=missionBriefs[state.mission];
  jarvis(`${missionBriefs[state.mission]} I'm tracking hostile signatures now.`);showToast(`OPERATION ${String(state.mission+1).padStart(2,'0')} ACTIVE`);sound('confirm');saveGame();
}
function victory(){
  state.missionActive=false;clearEnemies();state.panel='victory';state.paused=true;state.completed=[...new Set([...state.completed,state.mission])];state.credits+=100+state.mission*24;
  const unlockedId=Math.min(47,state.mission+1);if(unlockedId<suitData.length&&!state.unlocked.includes(unlockedId)){state.unlocked.push(unlockedId);jarvis(`${suitData[unlockedId].name} frame certified and available in the armour lab.`);}else jarvis('Operation successful. Recovery teams are securing the field.');
  saveGame();renderPanel();sound('confirm');
}
function fail(){state.missionActive=false;state.panel='failure';state.paused=true;clearEnemies();jarvis('Critical armour failure detected. Emergency recovery is underway.');renderPanel();sound('warning');}
function damageEnemy(enemy,amount){if(!enemy?.alive)return;enemy.hp-=amount;addParticle(enemy.group.position,0x66dfff,3,.07);sound('hit');if(enemy.hp<=0){enemy.alive=false;addParticle(enemy.group.position,0xff843b,22,.2);scene.remove(enemy.group);const i=enemies.indexOf(enemy);if(i>=0)enemies.splice(i,1);state.kills++;state.credits+=5;if(state.lockTarget===enemy)clearTarget();
  if(enemies.length===0&&state.missionActive){if(state.objectiveIndex===0){state.objectiveIndex=1;$('#objective-text').textContent='Reach and disable the signal relay.';jarvis("Squad neutralized. I'm locating the Front signal relay now.");const relay=addMesh(world,new THREE.OctahedronGeometry(3,1),mat(0xb44435,.5,.26,0xff421f,1.5),[28,5,-46]);relay.userData.relay=true;markers.push(relay);showToast('SIGNAL RELAY LOCATED — PRESS E TO DISABLE');}else{victory();}}
}}
function nearestEnemy(max=180){let best=null,dist=max;for(const e of enemies){const d=e.group.position.distanceTo(player.position);if(d<dist){dist=d;best=e;}}return best;}
function getAim(){const origin=camera.position.clone(),dir=new THREE.Vector3();camera.getWorldDirection(dir);let selected=null,score=Infinity;for(const e of enemies){const to=e.group.position.clone().sub(origin);const along=to.dot(dir);if(along<0)continue;const off=to.addScaledVector(dir,-along).length();const q=off+along*.012;if(off<along*.25&&q<score){score=q;selected=e;}}return selected||nearestEnemy(100);}
function fireRepulsor(){if(state.panel||state.paused||state.cooldowns.shot>0||state.energy<1)return;state.cooldowns.shot=.19;state.energy-=.9;state.shots++;sound('shot');const target=state.lockTarget||getAim();const from=player.position.clone().add(vec(0,1.2,0));const dir=target?target.group.position.clone().sub(from).normalize():new THREE.Vector3();if(!target)camera.getWorldDirection(dir);
  const beam=new THREE.Mesh(new THREE.CylinderGeometry(.12,.12,1,8),mat(0x7deaff,.2,.15,0x31caff,3));beam.position.copy(from).addScaledVector(dir,1.3);beam.quaternion.setFromUnitVectors(vec(0,1,0),dir);beam.scale.y=1;scene.add(beam);beam.userData.life=.11;particles.push({mesh:beam,life:.11,max:.11,vel:vec(),beam:true});
  if(target){const distance=from.distanceTo(target.group.position);damageEnemy(target,Math.max(14,24-distance*.045)*(suitData[state.selected].armor?1:1));}
}
function fireMissile(){if(state.panel||state.paused||state.cooldowns.missile>0||state.missiles<=0)return;const target=state.lockTarget||getAim();if(!target){showToast('NO HOSTILE LOCK');return;}state.cooldowns.missile=1.25;state.missiles--;sound('warning');const mesh=new THREE.Mesh(new THREE.SphereGeometry(.16,8,6),mat(0xffc66b,.25,.18,0xff8024,2));mesh.position.copy(player.position).add(vec(0,1,0));scene.add(mesh);const direction=target.group.position.clone().sub(mesh.position).normalize();enemyShots.push({mesh,velocity:direction.clone().multiplyScalar(44),target:target,playerMissile:true,damage:65,life:3.5});}
function fireBeam(){if(state.panel||state.paused||state.cooldowns.beam>0||state.energy<32)return;state.cooldowns.beam=7;state.energy-=32;sound('warning');const target=state.lockTarget||getAim();if(target){damageEnemy(target,125);for(const e of [...enemies])if(e!==target&&e.group.position.distanceTo(target.group.position)<14)damageEnemy(e,50);}else{showToast('UNIBEAM — NO TARGET IN ARC');}}
function boost(){if(state.energy<12){showToast('ENERGY TOO LOW');return;}state.energy=Math.max(0,state.energy-12);state.speed=Math.max(state.speed,76);player.position.addScaledVector(getForward(),8);sound('boost');addParticle(player.position,0x54dfff,12,.12);}
function getForward(){return vec(Math.sin(state.cameraYaw),0,-Math.cos(state.cameraYaw));}
function targetNext(){if(!enemies.length){jarvis('No hostile signatures in range, sir.');return;}const i=state.lockTarget?enemies.indexOf(state.lockTarget):-1;state.lockTarget=enemies[(i+1)%enemies.length];jarvis(`${state.lockTarget.def.name} locked. ${Math.round(state.lockTarget.hp)} points of armour remain.`);sound('confirm');}
function activateSpecial(){if(state.energy<20){showToast('ENERGY TOO LOW');return;}state.energy-=20;state.health=Math.min(100,state.health+15);for(const e of [...enemies])if(e.group.position.distanceTo(player.position)<24)damageEnemy(e,52);addParticle(player.position,0x65dfff,38,.22);jarvis('Defensive pulse deployed. Nearby hostile systems disrupted.');sound('boost');}

function interact(){
  const relay=markers.find(m=>m.userData.relay);
  if(relay&&relay.position.distanceTo(player.position)<20){scene.remove(relay);markers.splice(markers.indexOf(relay),1);state.objectiveIndex=2;$('#objective-text').textContent='Signal relay destroyed. Secure the field and return to the tower.';jarvis('Relay offline. The Front squad is cut off. Operation complete.');victory();return;}
  if(player.position.distanceTo(vec(-20,0,-20))<42){openPanel('armory');return;}
  if(enemies.length===0&&state.missionActive){victory();return;}
  jarvis('No local interaction available. I recommend clearing the hostile signatures.');
}

const keys={};
addEventListener('keydown',e=>{
  keys[e.code]=true;
  if(['Space','ArrowUp','ArrowDown','ArrowLeft','ArrowRight','Tab'].includes(e.code))e.preventDefault();
  if(e.repeat)return;
  if(e.code==='Escape'){if(state.panel==='title')return;if(state.panel)closePanel();else openPanel('pause');}
  if(e.code==='Tab'){if(state.panel==='armory')closePanel();else openPanel('armory');}
  if(e.code==='KeyE')interact();if(e.code==='KeyR')fireMissile();if(e.code==='KeyF')fireBeam();if(e.code==='KeyQ')activateSpecial();if(e.code==='KeyT')targetNext();
  if(e.code==='Space'&&!state.panel){state.flying=true;}
});
addEventListener('keyup',e=>{keys[e.code]=false;if(e.code==='Space'&&player.position.y<2.1)state.flying=false;});
renderer.domElement.addEventListener('mousedown',e=>{if(e.button===0)fireRepulsor();if(e.button===2)targetNext();});renderer.domElement.addEventListener('contextmenu',e=>e.preventDefault());
let drag=null;
renderer.domElement.addEventListener('pointerdown',e=>{drag={x:e.clientX,y:e.clientY,id:e.pointerId};renderer.domElement.setPointerCapture(e.pointerId);});
renderer.domElement.addEventListener('pointermove',e=>{if(!drag||e.pointerType==='mouse'&&e.buttons===0)return;const dx=e.clientX-drag.x,dy=e.clientY-drag.y;state.cameraYaw-=dx*.004;state.cameraPitch=clamp(state.cameraPitch+dy*.002,-.28,.72);drag={x:e.clientX,y:e.clientY,id:e.pointerId};});
renderer.domElement.addEventListener('pointerup',()=>drag=null);
addEventListener('mousemove',e=>{if(document.pointerLockElement===renderer.domElement){state.cameraYaw-=e.movementX*.0022;state.cameraPitch=clamp(state.cameraPitch+e.movementY*.0015,-.28,.72);}});
renderer.domElement.addEventListener('click',()=>{if(!state.panel&&innerWidth>700&&document.pointerLockElement!==renderer.domElement){renderer.domElement.requestPointerLock?.();}});

function setTarget(target){state.lockTarget=target;}
function updateEnemy(e,dt){
  const p=e.group.position,to=player.position.clone().sub(p),d=to.length();e.phase+=dt;
  if(d>20){const desired=player.position.clone().add(vec(Math.sin(e.phase*.7)*8,5+Math.sin(e.phase)*3,Math.cos(e.phase*.6)*8));p.lerp(desired,dt*(e.def.speed*.05));}
  e.group.lookAt(player.position.x,player.position.y,player.position.z);e.group.position.y=Math.max(3,e.group.position.y+Math.sin(e.phase*2)*dt*.6);
  e.fire-=dt;if(d<e.def.range&&e.fire<=0){e.fire=1.65+rand()*1.3;const mesh=new THREE.Mesh(new THREE.SphereGeometry(.16,7,5),mat(0xff694c,.15,.2,0xff3d22,2.5));mesh.position.copy(p).add(vec(0,.2,0));scene.add(mesh);const vel=player.position.clone().add(vec(0,.5,0)).sub(mesh.position).normalize().multiplyScalar(23);enemyShots.push({mesh,velocity:vel,life:4,damage:e.def.damage});}
  if(e.type===3&&e.hp<e.maxHp*.52&&e.phase>1.8){e.phase=0;for(let i=0;i<3;i++){const angle=i/3*Math.PI*2;makeEnemy(0,p.clone().add(vec(Math.cos(angle)*8,2,Math.sin(angle)*8)));}jarvis('Commander deploying scout drones. Target the exposed side conduits.');}
}
function updateProjectiles(dt){
  for(let i=enemyShots.length-1;i>=0;i--){const s=enemyShots[i];if(s.playerMissile){if(!s.target?.alive){scene.remove(s.mesh);enemyShots.splice(i,1);continue;}const dir=s.target.group.position.clone().sub(s.mesh.position).normalize();s.velocity.lerp(dir.multiplyScalar(52),dt*2);}
    s.mesh.position.addScaledVector(s.velocity,dt);s.life-=dt;
    if(s.playerMissile&&s.target?.alive&&s.mesh.position.distanceTo(s.target.group.position)<2.2){damageEnemy(s.target,s.damage);addParticle(s.mesh.position,0xffa45a,15,.14);s.life=-1;}
    else if(!s.playerMissile&&s.mesh.position.distanceTo(player.position)<1.9){state.health-=s.damage/(suitData[state.selected].armor||1);state.energy=Math.max(0,state.energy-4);addParticle(player.position,0xff604d,8,.1);s.life=-1;sound('hit');if(state.health<42&&Math.random()<.14)jarvis('Armour integrity is falling, sir. Consider boosting clear of the attack pattern.');}
    if(s.life<=0){scene.remove(s.mesh);enemyShots.splice(i,1);}
  }
  for(let i=particles.length-1;i>=0;i--){const p=particles[i];p.life-=dt;if(p.beam){p.mesh.scale.y=32;p.mesh.material.opacity=clamp(p.life/.11,0,1);}else{p.mesh.position.addScaledVector(p.vel,dt);p.vel.y-=7*dt;p.mesh.scale.multiplyScalar(.985);}if(p.life<=0){scene.remove(p.mesh);particles.splice(i,1);}}
}
function updatePlayer(dt){
  const forward=getForward(),right=vec(Math.cos(state.cameraYaw),0,Math.sin(state.cameraYaw));
  let input=vec((keys.KeyD||state.touch.right?1:0)-(keys.KeyA||state.touch.left?1:0),0,(keys.KeyS||state.touch.back?1:0)-(keys.KeyW||state.touch.forward?1:0));
  if(input.lengthSq()>0)input.normalize();const boostKey=keys.ShiftLeft||keys.ShiftRight||state.touch.boost;
  const suit=suitData[state.selected],upgrade=state.upgrades[state.selected]||{flight:0,defense:0,weapons:0};
  const maxSpeed=(state.flying?36:20)*suit.speed*(1+upgrade.flight*.055);if(boostKey&&state.energy>0)state.speed=Math.min(maxSpeed*1.65,state.speed+dt*35);else if(input.lengthSq())state.speed=lerp(state.speed,maxSpeed,dt*1.5);else state.speed=lerp(state.speed,0,dt*.55);
  player.position.addScaledVector(forward,-input.z*state.speed*dt);player.position.addScaledVector(right,input.x*state.speed*dt*.8);
  if(state.flying||keys.Space||state.touch.up){state.flying=true;let vert=(keys.Space||state.touch.up?1:0)-(keys.ControlLeft||keys.ControlRight||state.touch.down?1:0);player.position.y=clamp(player.position.y+vert*dt*(boostKey?24:12),1.25,220);state.energy=Math.max(0,state.energy-dt*(boostKey?7:1.4));if(player.position.y<1.6&&!keys.Space&&!state.touch.up)state.flying=false;}
  else {player.position.y=lerp(player.position.y,1.25,dt*2.8);state.energy=Math.min(100,state.energy+dt*(state.missionActive?2.3:5));}
  if(!state.flying&&player.position.y<1.5)player.position.y=1.25;
  player.position.x=clamp(player.position.x,-570,570);player.position.z=clamp(player.position.z,-640,520);
  const tilt=clamp(input.x*.25,-.3,.3);suitRoot.rotation.z=lerp(suitRoot.rotation.z,-tilt,dt*5);suitRoot.rotation.x=lerp(suitRoot.rotation.x,state.flying?-input.z*.1:0,dt*3);
  if(suitParts.glows)for(const g of suitParts.glows)g.material.emissiveIntensity=state.flying?4:2.6;
  if(state.health<100&&!state.missionActive)state.health=Math.min(100,state.health+dt*4);
  if(boostKey&&state.energy>0&&input.lengthSq())state.energy=Math.max(0,state.energy-dt*5);
  state.energy=Math.min(100,state.energy+dt*(state.flying?0.35:1.4));
  if(state.health<=0&&state.missionActive)fail();
}
function updateCamera(dt){const target=player.position.clone().add(vec(0,1.1,0));const dist=state.flying?10:8.5;const horiz=Math.cos(state.cameraPitch)*dist;const desired=target.clone().add(vec(Math.sin(state.cameraYaw)*horiz,2.4+Math.sin(state.cameraPitch)*dist,Math.cos(state.cameraYaw)*horiz));camera.position.lerp(desired,1-Math.exp(-dt*5));camera.lookAt(target.clone().add(vec(0,.3,0)));}

function drawRadar(){const c=$('#minimap'),ctx=c.getContext('2d'),w=c.width,h=c.height;ctx.clearRect(0,0,w,h);ctx.fillStyle='rgba(8,19,29,.82)';ctx.fillRect(0,0,w,h);ctx.strokeStyle='rgba(87,180,210,.17)';ctx.lineWidth=1;for(let i=1;i<4;i++){ctx.beginPath();ctx.arc(w/2,h/2,i*22,0,Math.PI*2);ctx.stroke();}ctx.beginPath();ctx.moveTo(w/2,8);ctx.lineTo(w/2,h-8);ctx.moveTo(8,h/2);ctx.lineTo(w-8,h/2);ctx.stroke();ctx.fillStyle='#47dcf4';ctx.beginPath();ctx.moveTo(w/2,h/2-7);ctx.lineTo(w/2-5,h/2+5);ctx.lineTo(w/2+5,h/2+5);ctx.fill();for(const e of enemies){const dx=e.group.position.x-player.position.x,dz=e.group.position.z-player.position.z,scale=.48;const x=clamp(w/2+dx*scale,8,w-8),y=clamp(h/2+dz*scale,8,h-8);ctx.fillStyle=e.type===3?'#ff785f':'#e65d50';ctx.beginPath();ctx.arc(x,y,e.type===3?4:2.8,0,Math.PI*2);ctx.fill();}for(const m of markers){const dx=m.position.x-player.position.x,dz=m.position.z-player.position.z;ctx.fillStyle='#f0bd63';ctx.fillRect(clamp(w/2+dx*.48,5,w-5)-2,clamp(h/2+dz*.48,5,h-5)-2,4,4);}}
function updateHUD(){
  const health=clamp(state.health,0,100),energy=clamp(state.energy,0,100);$('#health-value').textContent=`${Math.round(health)}%`;
  $('#health-bar').style.width=`${health}%`;$('#energy-value').textContent=`${Math.round(energy)}%`;$('#energy-bar').style.width=`${energy}%`;
  $('#health-bar').classList.toggle('critical',health<30);$('#speed-value').textContent=String(Math.round(state.speed*8)).padStart(3,'0');$('#alt-value').textContent=String(Math.round(player.position.y)).padStart(2,'0');$('#missile-value').textContent=String(state.missiles).padStart(2,'0');
  const suit=suitData[state.selected];$('#suit-title').textContent=suit.name;$('#suit-subtitle').textContent=suit.subtitle;$('#target-card').classList.toggle('hidden',!state.lockTarget?.alive);
  if(state.lockTarget?.alive){$('#target-name').textContent=state.lockTarget.def.name;$('#target-range').textContent=`${Math.round(player.position.distanceTo(state.lockTarget.group.position))} m`;$('#target-health').style.width=`${state.lockTarget.hp/state.lockTarget.maxHp*100}%`;}
  $('#threat-status').textContent=enemies.length?`${enemies.length} HOSTILE${enemies.length!==1?'S':''} DETECTED`:'AREA CLEAR';$('.threat-pip').classList.toggle('alert',enemies.length>0);
  const done=enemies.length===0?100:Math.max(4,100*(1-enemies.length/Math.max(1,3+Math.floor(state.mission*.55))));$('#objective-progress').style.width=`${done}%`;$('#objective-count').textContent=state.objectiveIndex===0?`01 / 02`:'02 / 02';
  const direction=((state.cameraYaw%(Math.PI*2)+Math.PI*2)%(Math.PI*2))/(Math.PI*2);$('.compass-track').style.transform=`translateX(${-direction*240}px)`;
  $('#reticle').classList.toggle('locked',!!state.lockTarget);$('#clock').textContent=`${String(Math.floor(18+state.time/120)%24).padStart(2,'0')}:${String(Math.floor(state.time*0.5)%60).padStart(2,'0')}`;
  $('#zone-name').textContent=player.position.distanceTo(vec(-20,0,-20))<75?'STARK INDUSTRIES / MANHATTAN':player.position.z<-250?'EAST RIVER / WATERFRONT':'MANHATTAN / EAST DISTRICT';drawRadar();
}

function animate(){requestAnimationFrame(animate);const dt=Math.min(.04,clock.getDelta());state.time+=dt;
  if(!state.paused&&state.started){updatePlayer(dt);for(const e of [...enemies])updateEnemy(e,dt);updateProjectiles(dt);updateCamera(dt);}
  else if(state.started)updateCamera(dt);
  for(const k in state.cooldowns)state.cooldowns[k]=Math.max(0,state.cooldowns[k]-dt);
  if(state.noticeTimer>0){state.noticeTimer-=dt;if(state.noticeTimer<=0)$('#toast').classList.remove('show');}
  if(state.started)updateHUD();
  renderer.render(scene,camera);
}
const clock=new THREE.Clock();updateCamera(1);animate();

// UI delegation keeps every displayed action wired to a real state transition.
ui.addEventListener('click',e=>{
 const action=e.target.closest('[data-action]')?.dataset.action;
 if(action){
   if(action==='close'||action==='resume'){closePanel();}
   if(action==='new-game'){state.completed=[];state.unlocked=[0];state.selected=0;state.credits=120;state.upgrades={};state.started=true;closePanel();beginMission(0);}
   if(action==='continue'){state.started=true;state.missionActive=false;state.panel='';state.paused=false;beginMission(state.mission);}
   if(action==='pause')openPanel('pause');
   if(action==='armory')openPanel('armory');
   if(action==='missions')openPanel('missions');
   if(action==='settings')openPanel('settings');
   if(action==='research')openPanel('research');
   if(action==='save'){saveGame(true);}
   if(action==='deploy'){makeSuit(suitData[state.selected]);closePanel();showToast(`${suitData[state.selected].name} CONFIGURATION DEPLOYED`);jarvis(`${suitData[state.selected].name} online. All systems nominal.`);saveGame();}
   if(action==='deploy-mission'){state.started=true;beginMission(state.mission);}
   if(action==='next-mission'){state.mission=Math.min(19,state.mission+1);if(state.mission===19&&state.completed.length===20){state.panel='';openPanel('title');}else{state.started=true;beginMission(state.mission);}}
   if(action==='retry'){state.started=true;beginMission(state.mission);}
   if(action==='side-mission'){state.credits+=45;state.health=Math.min(100,state.health+15);jarvis('Optional contract accepted and completed: local patrol intercepted. 45 credits transferred.');showToast('CONTRACT COMPLETE · +45 CREDITS');renderPanel();saveGame();}
   if(action==='certify'){const next=state.unlocked.length,req=next*2+2;if(next<47&&state.completed.length>=req&&state.credits>=req*20){state.credits-=req*20;state.unlocked.push(next);jarvis(`${suitData[next].name} certification complete. Frame ready in the lab.`);sound('confirm');renderPanel();saveGame();}else showToast('MORE FIELD DATA REQUIRED');}
   if(action==='toggle-sound'){state.sound=!state.sound;renderPanel();}
   return;
 }
 const suit=e.target.closest('[data-suit]')?.dataset.suit;
 if(suit!==undefined){state.selected=Number(suit);makeSuit(suitData[state.selected]);renderPanel();saveGame();return;}
 const upgrade=e.target.closest('[data-upgrade]')?.dataset.upgrade;
 if(upgrade){const costs={flight:60,defense:75,weapons:70};const u=state.upgrades[state.selected]||(state.upgrades[state.selected]={flight:0,defense:0,weapons:0});if(state.credits>=costs[upgrade]&&u[upgrade]<5){state.credits-=costs[upgrade];u[upgrade]++;jarvis(`${upgrade} upgrade installed. Performance increase confirmed.`);sound('confirm');renderPanel();saveGame();}else showToast('INSUFFICIENT TECH CREDITS');return;}
 const mission=e.target.closest('[data-mission]')?.dataset.mission;
 if(mission!==undefined){const i=Number(mission);if(i<=Math.max(...state.completed,-1)+1||state.completed.includes(i)){state.mission=i;renderPanel();}else showToast('OPERATION LOCKED — COMPLETE PREVIOUS MISSION');return;}
 const quality=e.target.closest('[data-quality]')?.dataset.quality;
 if(quality){state.quality=quality;renderer.setPixelRatio(Math.min(devicePixelRatio,quality==='high'?1.7:1));renderer.shadowMap.enabled=quality==='high';saveGame();renderPanel();}
});
$('#scan-btn').addEventListener('click',()=>{const count=enemies.length;if(count){const heavy=enemies.find(e=>e.type>=2);jarvis(`Scan complete. ${count} hostile signature${count===1?'':'s'} detected. ${heavy?`Priority threat: ${heavy.def.name}, ${Math.round(heavy.hp)} armour points. `:''}Use target lock to cycle threats.`);if(!state.lockTarget)setTarget(nearestEnemy());}else jarvis('Scan complete. No hostile units in local airspace. The gold marker indicates your current objective.');sound('confirm');});
$('#pause-btn').addEventListener('click',()=>{if(state.started)openPanel('pause');});$('#save-btn').addEventListener('click',()=>saveGame(true));$('#sound-btn').addEventListener('click',()=>{state.sound=!state.sound;$('#sound-btn').classList.toggle('muted',!state.sound);showToast(state.sound?'AUDIO ENABLED':'AUDIO MUTED');});
addEventListener('resize',()=>{camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();renderer.setSize(innerWidth,innerHeight);});

// Touch flight/combat controls; movement joystick is split into directional press zones.
const touchControls=document.createElement('div');touchControls.className='touch-controls';touchControls.innerHTML='<div class="touch-pad"><button data-touch="forward">▲</button><div><button data-touch="left">◀</button><button data-touch="back">▼</button><button data-touch="right">▶</button></div></div><div class="touch-actions"><button data-touch="up">ASCEND</button><button data-touch="boost">BOOST</button><button data-touch="fire">FIRE</button><button data-touch="lock">LOCK</button><button data-touch="land">LAND</button></div>';ui.appendChild(touchControls);
touchControls.addEventListener('pointerdown',e=>{const action=e.target.dataset.touch;if(!action)return;e.preventDefault();if(action==='fire')fireRepulsor();else if(action==='lock')targetNext();else if(action==='land'){state.flying=false;state.speed=0;showToast('LANDING SEQUENCE');}else state.touch[action]=true;});touchControls.addEventListener('pointerup',e=>{const action=e.target.dataset.touch;if(action)state.touch[action]=false;});touchControls.addEventListener('pointerleave',e=>{const action=e.target.dataset.touch;if(action)state.touch[action]=false;});

state.started=false;state.paused=true;state.panel='title';renderPanel();
