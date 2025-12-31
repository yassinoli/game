
const game = document.createElement('div')
game.className = 'startdiv'
document.body.appendChild(game)

const sounds = {
  star: new Audio("start.wav"),
  win: new Audio("kil.wav"),
  lose: new Audio("die.wav")
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
 let min = 0
  let sec =0
let pause = false
  let rdm = 0
let bulcount = 20
let hero
let enemies = []
let enemytotal = 0
let heroBullets = []
let enemyBullets = []
let gameOver = false
let enemycount = 0
let lvl = 1
let scorr = 0
let angle = 0
 let speed = 1.3
 const enemy1 = 'enemy1.png'
 const enemy2 = 'enemy2.png'
 const enemy3 = 'enemy3.png'
const btnpause = document.querySelector('.pause')
//--------------
let bulcounter = document.querySelector('.countBoullet')
 bulcounter.innerText =  `Bullets ${bulcount}`

 let levels = document.querySelector('.level')
 levels.innerText = `LEVEl ${lvl}`

 let scores = document.querySelector('.score')
scores.innerText = `SCORE : ${scorr}`
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
  setInterval(createnemy, 3000) ;
}

function createHero() {
  hero = document.createElement('img')
  hero.src = 'her.png'
  hero.className = 'plan'
  game.appendChild(hero)
}
//-------------------- move & shout 
const keys = {
  left: false,
  right: false,
  shoot: false
};

let lastShotTime = 0;
const SHOOT_DELAY = 800; // ms between shots
btnpause.addEventListener('click' , ()=>{
  if (pause){
    pause = false
  }else{
    pause =true
  }
})
document.addEventListener('keydown', e => {
  
  if (e.key === 'ArrowLeft') keys.left = true;
  if (e.key === 'ArrowRight') keys.right = true;
  if (e.key === ' ') keys.shoot = true;
  if (e.key === 'p'){
    if(pause===false){
      pause =true
    }else{
      pause =false
    }
  }
});

document.addEventListener('keyup', e => {
  if (e.key === 'ArrowLeft') keys.left = false;
  if (e.key === 'ArrowRight') keys.right = false;
  if (e.key === ' ') keys.shoot = false;
});

function gameLoop() {
 
  if (!gameOver && hero) {
    let x = hero.offsetLeft;
    let gw = game.getBoundingClientRect();
    let hw = hero.getBoundingClientRect();
    const speed = 6;

    if (keys.left && hw.left > gw.left && pause===false) {
      hero.style.left = x - speed + 'px';
    }

    if (keys.right && hw.right < gw.right && pause===false) {
      hero.style.left = x + speed + 'px';
    }

   
    const now = Date.now();
    if (keys.shoot && now - lastShotTime > SHOOT_DELAY && pause===false) {
      heroshut();
      lastShotTime = now;
    }
  }

      requestAnimationFrame(gameLoop);
  
}

requestAnimationFrame(gameLoop);



//---------------------------------------------------------
function createnemy() {
  if (pause || lvl>2) return
  let enemyto
  if (enemytotal<=3) enemyto = enemy1
  if (enemytotal>3 && enemytotal<=7) enemyto = enemy2
  if (enemytotal >7) {
   // levels.innerText = `LEVEL ${lvl}`
    lastStage()
    return
   }
  if (gameOver) return
   if (enemytotal>3 && lvl <2) lvl++ ,showlvl() , levels.innerText = `LEVEL ${lvl}` , speed = 3 // lvl & -> 2
   if (enemytotal>7 && lvl <3) lvl++,showlvl() , levels.innerText = `LEVEL ${lvl}` // lvl 2 -> 3
  if (enemycount == 3*lvl ) return 
  const e = document.createElement('img')
  e.src = enemyto
  e.className = 'enmySize'
  e.style.left = Math.random() * (game.clientWidth - 160) + 'px'
  enemycount++
  enemytotal++
  game.appendChild(e)
  enemies.push(e)

  movenemy(e)
  enemyshut(e)
}

// enemy move
function movenemy(enemy) {
  let ss = 60
  let mod = 1
let dir = 1
  function step() {
    
    if (!enemy.parentElement || gameOver) return
 let x = enemy.offsetLeft + dir * speed
   if(pause===false){
    enemy.style.left = x + 'px'
   if(mod%2==0) {
    enemy.style.top = enemy.offsetTop + 1 + 'px'
  }}
  mod++
    if (x <= 0 || x >= game.clientWidth - enemy.offsetWidth) {
      dir *= -1
    }
    if(ss%(Math.floor(Math.random()*120)) === 2){
      dir *= -1
    }
    if(hit(enemy,hero)){
      heroDies()
    }
 
       requestAnimationFrame(step)
    
  }
  requestAnimationFrame(step)
}

// -hero bul
function heroshut() {
   
   
  if (bulcount<=0 || pause) return;
  bulcount--
  bulcounter.innerText =  `Bullets ${bulcount}`
  levels.innerText = `LEVEL ${lvl}`
  const b = document.createElement('div')
  b.innerHTML='<img src="10.webp">'
  b.className = 'bullet'
 
  b.style.left = hero.offsetLeft + hero.offsetWidth / 2 - 20 + 'px'
  b.style.top = hero.offsetTop - 10 + 'px'

  game.appendChild(b)
  heroBullets.push(b)
  herobuletmove(b)
}

function herobuletmove(b) {
  function step() {
    if (!b.parentElement || gameOver) return
    if(pause===false){
          b.style.top = b.offsetTop - 6 + 'px'
    }
    
    // hero bulet -> enmy
    enemies.forEach((e, i) => {
      if (hit(b, e)) {
        explostion(e.offsetTop , e.offsetLeft)
        b.remove()
        e.remove()
        scorr+=5
        scores.innerText = `SCORE : ${scorr}`
        sounds.win.play()
        enemycount--
        enemies.splice(i, 1)
      }
    })

    // hero bul <-> enemy bul
    enemyBullets.forEach((eb, i) => {
      if (hit(b, eb)) {
        b.remove()
        eb.remove()
        enemyBullets.splice(i, 1)
      }
    })
  
          requestAnimationFrame(step)
    
  }
  requestAnimationFrame(step)
}

// enemy bull
function enemyshut(enemy) {
  const shoot = setInterval(() => {
    if (!enemy.parentElement || gameOver ) {
      clearInterval(shoot)
      return
    }

    const b = document.createElement('div')
    b.innerHTML = '<img src="albl.png">'
    b.className = 'bullet enemyBullet'
    if(pause===false){
       b.style.left = enemy.offsetLeft + enemy.offsetWidth / 2 - 4 + 'px'
    b.style.top = enemy.offsetTop + enemy.offsetHeight + 'px'
    game.appendChild(b)
    enemyBullets.push(b)
    enemybuletmove(b)
    }
  }, Math.floor(Math.random()*2000) + 1000   )
}

function enemybuletmove(b) {
  function step() {
    if (!b.parentElement || gameOver ) return
    if (pause===false){
         b.style.top = b.offsetTop + 4 + 'px'
    }

    // enemybullet -> hero
    if (hit(b, hero)) {
      explostion(hero.offsetTop ,hero.offsetLeft-40 ) 
      heroDies()
      b.remove()
      return
    }

    if (!hit(b,game)){
      b.remove()
    }

    // enemybulet <-> hero bulet
    heroBullets.forEach((hb, i) => {
      if (hit(b, hb)) {
        b.remove()
        hb.remove()
        heroBullets.splice(i, 1)
      }
    })
    
      requestAnimationFrame(step)
    
  }
  requestAnimationFrame(step)
}

// intersection
function hit(a, b) {
  const ar = a.getBoundingClientRect()
  const br = b.getBoundingClientRect()
  return (
    ar.left < br.right && ar.right > br.left && ar.top < br.bottom && ar.bottom > br.top
  )
}

// game finish
function heroDies() {
  gameOver = true
  hero.style.opacity = '0.4'
   sounds.lose.play()
   alert('GAME OVER')
  window.location.reload()
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
function timer() {
    let timdiv = document.createElement('div')
    timdiv.setAttribute('class', 'timer')
    timdiv.innerText =`TIME : 0${min}:${sec}`
    document.body.appendChild(timdiv)
    setInterval(() => {
    if(pause===false) {sec++
     timdiv.innerText = `TIME : 0${Math.floor(sec/60)}:${sec%60} `}
    }, 1000);
}



//--------------- bons bullet
function bonus(){
 
 setInterval(() => {
 
  if(pause===false){
     rdm = Math.floor(Math.random()*10)+5
   let bons = document.createElement('div')
  bons.className = 'bonus'
  bons.innerHTML = `<img src="box2.png">`
  bulcounter.innerText =  `Bullets ${bulcount}`
      game.appendChild(bons)
       bonsmove()
  }
 
}, 10000);
}

function bonsmove(){
  let wg = game.getBoundingClientRect()
  let bons = document.querySelector('.bonus')
  
   if (pause===false){
     bons.style.left = Math.random()*wg.width + 'px'
      bons.style.top = 5 + 'px'
   }
  

 function mvbns(){ 
  if (hit(bons,hero)){
    bons.remove()
    bulcount += rdm
     bulcounter.innerText =  `Bullets ${bulcount}`
  }

  if (!hit(bons , game)){
    bons.remove()
  }
    if(pause===false){
         bons.style.top = bons.offsetTop + speed + 'px'
    }
   
       requestAnimationFrame(mvbns)
   
  }
     requestAnimationFrame(mvbns)
}


//--------------- rocks
function rock(){
 setInterval(() => {
   let rok = document.createElement('div')
  rok.className = 'rok'
  rok.innerHTML = '<img src="fire.gif">'
  rok.setAttribute('id','box')
  if(pause===false){
    game.appendChild(rok)
     rokmove()
  }
 
}, 8000);
}

function rokmove(){
  let wg = game.getBoundingClientRect()
  let rok = document.querySelector('.rok')

  if (pause===false){
       rok.style.left = Math.random()*(wg.width-80)+40 + 'px'
       rok.style.top = 5 + 'px'
  }

  

 function mvrok(){ 
  if (hit(rok,hero)){
    explostion(hero.offsetTop , hero.offsetLeft-30)
    rok.remove()
    hero.remove()
    heroDies()
  }

    if(pause===false){
       rok.style.top = rok.offsetTop + 3 + 'px'
  }
   
   heroBullets.forEach((hb, i) => {
      if (hit(rok, hb)) {
        hb.remove()
        heroBullets.splice(i, 1)
      }
    })

  if (!hit(rok , game)){
    rok.remove()
  }

       requestAnimationFrame(mvrok)
   
  }
     requestAnimationFrame(mvrok)
}










// ----------------- stage tali 

function lastStage(){
 if(enemies.length == 0) {
  lvl++
  showlvl()
    const e = document.createElement('img')
  e.src = enemy3
  e.className = 'enmySize'
  e.style.left = Math.random() * (game.clientWidth - 160) + 'px'
  enemycount++
  enemytotal++
  game.appendChild(e)
  enemies.push(e)

  movitt(e)
  shutitt(e)}
}

function movitt(enemy) {
  let rdm = 0
let dir = 1
  function step() {
    if (!enemy.parentElement || gameOver ) return
    let g =game.getBoundingClientRect()
    let gw = g.width-100
    let x = enemy.offsetLeft + dir * 4
    rdm++
    if(rdm%40===0){
      x = Math.floor(Math.random()*gw)+dir*4
    }
    if(pause===false){
        enemy.style.left = x + 'px'
    }
  

    if (x <= 0 || x >= game.clientWidth - enemy.offsetWidth) {
      dir *= -1
    }
   
          requestAnimationFrame(step)
    
  }
  requestAnimationFrame(step)
}

function shutitt(enemy) {
  const shoot = setInterval(() => {
    if (!enemy.parentElement || gameOver) {
      clearInterval(shoot)
      return
    }

    const b = document.createElement('div')
    b.className = 'bullet enemyBullet'
    b.style.backgroundColor = 'green'
    b.style.height = '18px'
    b.style.width = '18x'
    b.style.borderRadius = '5px'

    b.style.left = enemy.offsetLeft + enemy.offsetWidth / 2 - 4 + 'px'
    b.style.top = enemy.offsetTop + enemy.offsetHeight + 'px'

    game.appendChild(b)
    enemyBullets.push(b)
    lastbullet(b)
  }, 2000)
}

function lastbullet(b) {
  function step() {
    if (!b.parentElement || gameOver ) return
    if(pause===false){
    b.style.top = b.offsetTop + 6 + 'px'
    b.style.left = b.offsetLeft + Math.floor(Math.random()*40)-20 + 'px' 
    }
 

    // enemybullet -> hero
    if (hit(b, hero)) {
      explostion(hero.offsetTop,hero.offsetLeft ) 
      heroDies()
      b.remove()
      return
    }

    // enemybulet <-> hero bulet
    heroBullets.forEach((hb, i) => {
      if (hit(b, hb)) {
        b.remove()
        hb.remove()
        heroBullets.splice(i, 1)
      }
    })
   
          requestAnimationFrame(step)
    
  }
  requestAnimationFrame(step)
}


function showlvl(){
  let show = document.createElement('div')
  show.innerText = `LEVEL ${lvl}`
  show.setAttribute('class','showlvl')
  game.appendChild(show)
  setInterval(() => {
    show.remove()
  }, 500);
}

function winning(){
  let windiv = document.createElement('div')
  windiv.className = 'wining'
  game.appendChild(windiv)
}

document.addEventListener('visibilitychange', ()=>{
  if(document.hidden) pause=true
  else pause =false
})

function explostion(x,y){
  let exp =document.createElement('div')
  exp.className ='explosion'
  exp.style.top = x +'px'
  exp.style.left = y + 'px'
  exp.innerHTML ='<img src="explo.gif">'
  game.appendChild(exp)
  setTimeout(() => {
    exp.remove()
  }, 1000);
}

function checkP() {
  const pos = document.querySelector('.pose');

  if (pause === true && pos === null) {
    pose();
  } else if (pause !== true && pos !== null) {
    pos.remove();
  }

  requestAnimationFrame(checkP);
}
requestAnimationFrame(checkP);

function pose() {
  const poseEl = document.createElement('div');
  poseEl.className = 'pose';
  poseEl.innerText = 'PAUSE'
  game.appendChild(poseEl);
}
