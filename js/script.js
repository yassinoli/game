import {createnemy } from './enemys.js'
import {stat} from './state.js'
export const game = document.createElement('div')
game.className = 'startdiv'
game.setAttribute('id','gama')
document.body.appendChild(game)

const sounds = {
  star: new Audio("../audio/start.wav"),
  win: new Audio("../audio/kil.wav"),
  lose: new Audio("../audio/die.wav")
};

const startMenu = document.createElement('div')
startMenu.className = 'starting'
startMenu.innerHTML = `<button class="starButton">Start</button>`
game.appendChild(startMenu)

document.querySelector('.starButton').onclick = startGame
scor()
bullets()
level()
paused()
const keys = {
  left: false,
  right: false,
  shoot: false
};
export let gw = game.getBoundingClientRect();
export const btnpause = document.querySelector('.pause')
//--------------
let bulcounter = document.querySelector('.countBoullet')
bulcounter.innerText =  `Bullets ${stat.bulcount}`
export let levels = document.querySelector('.level')
levels.innerText = `LEVEl ${stat.lvl}`
let scores = document.querySelector('.score')
scores.innerText = `SCORE : ${stat.scorr}`

// Helper to get element position
const elementPositions = new WeakMap();
export function getPos(el) {
  if (!elementPositions.has(el)) {
    elementPositions.set(el, { x: 0, y: 0 });
  }
  return elementPositions.get(el);
}

export function setPos(el, x, y) {
  const pos = getPos(el);
  pos.x = x;
  pos.y = y;
  el.style.transform = `translate(${x}px, ${y}px)`;
}

// start game
function startGame() {
  sounds.star.play()
  startMenu.remove()
  createHero()
  createnemy()
  showlvl()
  bonus()
  rock()
   timer()
   countLive()
  setInterval(()=>{
    if(stat.pause==false){
      createnemy()
    }
  }, 3000) ;
}

function createHero() {
  hero = document.createElement('img')
  hero.src = 'image/her.png'
  hero.className = 'plan'
  game.appendChild(hero)
  stat.heroX = 0
  stat.heroY = 0
  setPos(hero, stat.heroX, stat.heroY)
}
export let hero = document.querySelector('.plan')
//-------------------- move & shout 

btnpause.addEventListener('click' , ()=>{
  if (stat.pause){
    stat.pause = false
  }else{
    stat.pause =true
  }
})
document.addEventListener('keydown', e => {
  
  if (e.key === 'ArrowLeft') keys.left = true ;
  if (e.key === 'ArrowRight') keys.right = true;
  if (e.key === ' ') keys.shoot = true;
  if (e.key === 'p'){
    if(stat.pause===false){
      stat.pause =true
    }else{
      stat.pause =false
    }
  }
});

document.addEventListener('keyup', e => {
  if (e.key === 'ArrowLeft') keys.left = false;
  if (e.key === 'ArrowRight') keys.right = false;
  if (e.key === ' ') keys.shoot = false;
});
function gameLoop() {
 
  if (!stat.gameOver && hero) {
    let hw = hero.getBoundingClientRect();
    const heroSpeed = 6;

    if (keys.left && hw.left > gw.left && stat.pause===false) {
      stat.heroX -= heroSpeed;
      setPos(hero, stat.heroX, stat.heroY);
    }

    if (keys.right && hw.right < gw.right && stat.pause===false) {
      stat.heroX += heroSpeed;
      setPos(hero, stat.heroX, stat.heroY);
    }

   
    const now = Date.now();
    if (keys.shoot && now - stat.lastShotTime > stat.SHOOT_DELAY && stat.pause===false) {
      heroshut();
      stat.lastShotTime = now;
    }
  }

      requestAnimationFrame(gameLoop);
  
}

requestAnimationFrame(gameLoop);





// -hero bul
function heroshut() {
   
   
  if (stat.bulcount<=0 || stat.pause) return;
  stat.bulcount--
  bulcounter.innerText =  `Bullets ${stat.bulcount}`
  levels.innerText = `LEVEL ${stat.lvl}`
  const b = document.createElement('div')
  b.innerHTML='<img src="image/10.webp">'
  b.className = 'bullet'
 
  const heroRect = hero.getBoundingClientRect();
  const startX = heroRect.left - gw.left + hero.offsetWidth / 2 - 20;
  const startY = heroRect.top - gw.top - 10;
  setPos(b, startX, startY);

  game.appendChild(b)
  stat.heroBullets.push(b)
  herobuletmove(b)
}

function herobuletmove(b) {
   const enemyForce = document.querySelector("progress");
   let damage = 2;
  function step() {
    if (!b.parentElement || stat.gameOver) return
    const pos = getPos(b);
    if(stat.pause===false){
      pos.y -= 6;
      setPos(b, pos.x, pos.y);
    }
    
    // hero bulet -> enmy
    stat.enemies.forEach((e, i) => {
      if (hit(b, e)) {
        if(stat.lastOne){
          b.remove()
          const eRect = e.getBoundingClientRect();
          explostion(eRect.top - gw.top, eRect.left - gw.left)
          if(stat.lastOneLives===0){
            e.remove()
            winning()
            stat.gameOver=true
          }else{
            stat.lastOneLives--
             enemyForce.value = enemyForce.value - damage;
          }
        }else{
        b.remove()
        stat.enemiesKilled++
        const eRect = e.getBoundingClientRect();
        explostion(eRect.top - gw.top, eRect.left - gw.left)
        e.remove()
        stat.enemies.splice(i, 1)
        }
        stat.scorr+=5
        scores.innerText = `SCORE : ${stat.scorr}`
        sounds.win.play()
      }
        if(!hit(b,game)){
        b.remove()
      }
    }) 

    // hero bul <-> enemy bul
    stat.enemyBullets.forEach((eb, i) => {
      if (hit(b, eb)) {
        b.remove()
        eb.remove()
        stat.enemyBullets.splice(i, 1)
      }
    })
  
          requestAnimationFrame(step)
    
  }
  requestAnimationFrame(step)
}





// intersection
export function hit(a, b) {
  const ar = a.getBoundingClientRect()
  const br = b.getBoundingClientRect()
  return (
    ar.left < br.right && ar.right > br.left && ar.top < br.bottom && ar.bottom > br.top
  )
}

// game finish
export function heroDies() {
  stat.gameOver = true
  hero.style.opacity = '0.4'
   sounds.lose.play()
   let gamov = document.createElement('div')
   gamov.className = 'gamov'
   gamov.innerHTML = '<button class="replay">PLAY AGAIN</button>'
   game.appendChild(gamov)
   let replay = document.querySelector('.replay')
   replay.addEventListener('click',()=>{
  window.location.reload()
})
}


function scor() {
    let scordiv = document.createElement('div')
    scordiv.setAttribute('class', 'score')
    scordiv.innerText = 'SCORE:'
    document.body.appendChild(scordiv)
}
function bullets() {
    let timdiv = document.createElement('div')
    timdiv.setAttribute('class', 'countBoullet')
    timdiv.innerText = `BULLETS`
    document.body.appendChild(timdiv)
}

function level() {
    let leveldiv = document.createElement('div')
    leveldiv.setAttribute('class', 'level')
    leveldiv.innerText = 'LEVEL: 1'
    document.body.appendChild(leveldiv)
}
function paused() {
    let pausediv = document.createElement('div')
    pausediv.setAttribute('class', 'pause')
    pausediv.innerText ='PAUSE'
    document.body.appendChild(pausediv)
}
function countLive(){
  let countlive = document.createElement('diiv')
  countlive.setAttribute('class', 'countlive')
    countlive.innerText ='❤️​❤️​❤️​'
    document.body.appendChild(countlive)
    requestAnimationFrame(checklives)
}


function timer() {
    let timdiv = document.createElement('div')
    timdiv.setAttribute('class', 'timer')
    timdiv.innerText =`TIME : 00:${stat.sec}`
    document.body.appendChild(timdiv)
    setInterval(() => {
    if(stat.pause===false && stat.gameOver===false) {stat.sec++
     timdiv.innerText = `TIME : 0${Math.floor(stat.sec/60)}:${stat.sec%60} `}
    }, 1000);
}



//--------------- bons bullet
function bonus(){
 if(stat.gameOver || stat.pause) return ;
 setInterval(() => {
  let checkeing = document.querySelector('.bonus')
  if(stat.pause===false && stat.gameOver===false){
    if(!checkeing){
       stat.rdm = Math.floor(Math.random()*10)+5
   let bons = document.createElement('div')
  bons.className = 'bonus'
  bons.innerHTML = `<img src="image/box2.png">`
  bulcounter.innerText =  `Bullets ${stat.bulcount}`
      game.appendChild(bons)
       bonsmove()
    }
  }
}, 1000);
}

function bonsmove(){
  let bons = document.querySelector('.bonus')
  
   if (stat.pause===false && stat.gameOver===false){
     const startX = Math.random() * (gw.width-30);
     setPos(bons, startX, 5);
   }
  

 function mvbns(){ 
  if (hit(bons,hero)){
    bons.remove()
    stat.bulcount += stat.rdm
    buletwin(stat.rdm)
     bulcounter.innerText =  `Bullets ${stat.bulcount}`
  }

  if (!hit(bons , game)){
    bons.remove()
  }
  const pos = getPos(bons);
  if(stat.pause===false && stat.gameOver===false){
    pos.y += stat.speed;
    setPos(bons, pos.x, pos.y);
  }
   
       requestAnimationFrame(mvbns)
   
  }
     requestAnimationFrame(mvbns)
}


//--------------- rocks
function rock(){
 setInterval(() => {
  if(stat.pause===false && stat.gameOver===false){
    let chck = document.querySelector('.rok')
    if(!chck){
      let rok = document.createElement('div')
  rok.className = 'rok'
  rok.innerHTML = '<img src="image/rock.png">'
  rok.setAttribute('id','box')
  if(stat.pause===false){
    game.appendChild(rok)
     rokmove()}
    }
  }
}, 3000);
}

function rokmove(){
  let rok = document.querySelector('.rok')

  if (stat.pause===false && stat.gameOver===false){
    const startX = Math.random() * (gw.width - 80) + 40;
    setPos(rok, startX, 5);
  }

  

 function mvrok(){ 
  if (hit(rok,hero)){
    const hRect = hero.getBoundingClientRect();
    explostion(hRect.top - gw.top, hRect.left - gw.left - 30)
    if(stat.herolives===0){
      hero.remove()
    heroDies()
    }else{
      rok.remove()
      stat.herolives--
    }
    
  }

  const pos = getPos(rok);
  if(stat.pause===false && stat.gameOver===false){
    pos.y += 6;
    setPos(rok, pos.x, pos.y);
  }
   
   stat.heroBullets.forEach((hb, i) => {
      if (hit(rok, hb)) {
        hb.remove()
        stat.heroBullets.splice(i, 1)
      }
    })

  if (!hit(rok , game)){
    rok.remove()
  }

       requestAnimationFrame(mvrok)
   
  }
     requestAnimationFrame(mvrok)
}



export function showlvl(){
  let show = document.createElement('div')
  show.innerText = `LEVEL ${stat.lvl}`
  show.setAttribute('class','showlvl')
  game.appendChild(show)
  setInterval(() => {
    show.remove()
  }, 500);
}

function winning(){
  let windiv = document.createElement('div')
  windiv.className = 'wining'
  windiv.innerHTML = '<img src="image/winer.gif">'
  game.appendChild(windiv)
  setTimeout(() => {
    window.location.reload()
  }, 2000);
}

document.addEventListener('visibilitychange', ()=>{
  if(document.hidden) stat.pause=true
  else stat.pause =false
})

export function explostion(x,y){
  let exp =document.createElement('div')
  exp.className ='explosion'
  setPos(exp, y, x);
  exp.innerHTML ='<img src="image/explo.gif">'
  game.appendChild(exp)
  setTimeout(() => {
    exp.remove()
  }, 1000);
}

function checkP() {
  const pos = document.querySelector('.pose');

  if (stat.pause === true && pos === null) {
    pose();
  } else if (stat.pause !== true && pos !== null) {
    pos.remove();
  }

  requestAnimationFrame(checkP);
}
requestAnimationFrame(checkP);

function pose() {
  const poseEl = document.createElement('div');
  poseEl.className = 'pose';
  poseEl.innerHTML = '<img src="image/pause.png"><div><button class="replay">replay</button><button class="continue">continue</button></div>'
  game.appendChild(poseEl);
  document.querySelector('.replay').addEventListener('click',()=>{
     window.location.reload()
    //replaying()
  })
  document.querySelector('.continue').addEventListener('click',()=>{stat.pause=false})
}


function checklives(){
  let lvs =document.querySelector('.countlive')
  let heart = '​❤️'
  lvs.innerText = `Lives : ${heart.repeat(stat.herolives)}`
  // if(stat.herolives==2){
  //   lvs.innerText = 'Lives :​❤️​'
  // }else if (stat.herolives==1){
  //   lvs.innerText = 'Lives :​❤️​'
  // }else{
  //   lvs.innerText = 'Lives : 0'
  // }
  requestAnimationFrame(checklives)
}


function buletwin(num){
  let buletgain = document.createElement('div')
  buletgain.innerText = `+${num} Bullets`
  buletgain.className = 'buletgain'
  game.appendChild(buletgain)
  setTimeout(() => {
    buletgain.remove()
  }, 300);
}


function replaying(){

   stat.enemiesKilled = 0
 stat.lastShotTime = 0;
 stat.SHOOT_DELAY = 400; // ms between shots
 stat.lastOne =false
 stat.lastOneLives = 19
 stat.herolives = 2
 stat.sec =0
 stat.pause = false
 stat.rdm = 0
 stat.bulcount = 100
 stat.enemies = []
 stat.enemytotal = 0
 stat.heroBullets = []
 stat.enemyBullets = []
 stat.gameOver = false
 stat.enemycount = 0
 stat.lvl = 1
 stat.scorr = 0
 stat.angle = 0
 stat.speed = 1.3
 stat.levelConfig = {
  1: { enemy: 'image/enemy1.png', maxAlive: 4, totalToKill: 4 },
  2: { enemy: 'image/enemy2.png', maxAlive: 5, totalToKill: 6 },
  3: { boss: true }}
 const df = document.getElementById('gama')
 df.innerHTML = ''
 startGame()
}