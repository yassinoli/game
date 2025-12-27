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
let bulcount = 100
let hero
let enemies = []
let enemytotal = 0
let heroBullets = []
let enemyBullets = []
let gameOver = false
let enemycount = 0
let lvl = 1
let scorr = 0
 let speed = 1.3
 const enemy1 = 'enemy1.png'
 const enemy2 = 'enemy2.png'
 const enemy3 = 'enemy3.png'

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
  bonus()
  setInterval(createnemy, 400)

}

function createHero() {
  hero = document.createElement('img')
  hero.src = 'her.png'
  hero.className = 'plan'
  game.appendChild(hero)
}

document.addEventListener('keydown', e => {
  if (gameOver || !hero) return

  let x = hero.offsetLeft

  if (e.key === 'ArrowLeft') hero.style.left = x - 12 + 'px'
  if (e.key === 'ArrowRight') hero.style.left = x + 12 + 'px'
  if (e.key === ' ') heroshut()
})

function createnemy() {
  let enemyto
  if (enemytotal<=6) enemyto = enemy1
  if (enemytotal>6 && enemytotal<=20) enemyto = enemy2
  if (enemytotal >20) {
    lastStage()
    return
   }
  if (gameOver) return
   if (enemytotal>6 && lvl <2) lvl++ , levels.innerText = `LEVEL ${lvl}` , speed = 3 // lvl & -> 2
   if (enemytotal>20 && lvl <3) lvl++ , levels.innerText = `LEVEL ${lvl}` // lvl 2 -> 3
  if (enemycount == 3*lvl ) return 
  const e = document.createElement('img')
  e.src = enemyto
  e.className = 'enmySize'
  e.style.left = Math.random() * (game.clientWidth - 80) + 'px'
  enemycount++
  enemytotal++
  game.appendChild(e)
  enemies.push(e)

  movenemy(e)
  enemyshut(e)
}

// enemy move
function movenemy(enemy) {
  
let dir = 1
  function step() {
    if (!enemy.parentElement || gameOver) return

    let x = enemy.offsetLeft + dir * speed
    enemy.style.left = x + 'px'

    if (x <= 0 || x >= game.clientWidth - enemy.offsetWidth) {
      dir *= -1
      enemy.style.top = enemy.offsetTop + 30 + 'px'
    }
    requestAnimationFrame(step)
  }
  requestAnimationFrame(step)
}

// -hero bul
function heroshut() {
   
   
  if (bulcount<=0) return;
  bulcount--
  bulcounter.innerText =  `Bullets ${bulcount}`
  levels.innerText = `LEVEL ${lvl}`
  const b = document.createElement('div')
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

    b.style.top = b.offsetTop - 6 + 'px'

    // hero bulet -> enmy
    enemies.forEach((e, i) => {
      if (hit(b, e)) {
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
    if (!enemy.parentElement || gameOver) {
      clearInterval(shoot)
      return
    }

    const b = document.createElement('div')
    b.className = 'bullet enemyBullet'

    b.style.left = enemy.offsetLeft + enemy.offsetWidth / 2 - 4 + 'px'
    b.style.top = enemy.offsetTop + enemy.offsetHeight + 'px'

    game.appendChild(b)
    enemyBullets.push(b)
    enemybuletmove(b)
  }, 3000)
}

function enemybuletmove(b) {
  function step() {
    if (!b.parentElement || gameOver) return

    b.style.top = b.offsetTop + 4 + 'px'

    // enemybullet -> hero
    if (hit(b, hero)) {
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
    ar.left < br.right &&
    ar.right > br.left &&
    ar.top < br.bottom &&
    ar.bottom > br.top
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

function bonus(){
 setInterval(() => {
   let bons = document.createElement('div')
  bons.className = 'bonus'
  bons.innerText = '+5'
  bulcounter.innerText =  `Bullets ${bulcount}`
  game.appendChild(bons)
  bonsmove()
}, 10000);
}

function bonsmove(){
  let wg = game.getBoundingClientRect()
  let bons = document.querySelector('.bonus')
   bons.style.left = Math.random()*wg.width + 'px'
  bons.style.top = 5 + 'px'
  

 function mvbns(){ 
  if (hit(bons,hero)){
    bons.remove()
    bulcount += 5
     bulcounter.innerText =  `Bullets ${bulcount}`
  }

  if (!hit(bons , game)){
    bons.remove()
  }

   bons.style.top = bons.offsetTop + speed + 'px'
   requestAnimationFrame(mvbns)
  }
     requestAnimationFrame(mvbns)
}




function lastStage(){
 if(enemies.length == 0) {
    const e = document.createElement('img')
  e.src = enemy3
  e.className = 'enmySize'
  e.style.left = Math.random() * (game.clientWidth - 80) + 'px'
  enemycount++
  enemytotal++
  game.appendChild(e)
  enemies.push(e)

  movitt(e)
  shutitt(e)}
}

function movitt(enemy) {
  
let dir = 1
  function step() {
    if (!enemy.parentElement || gameOver) return

    let x = enemy.offsetLeft + dir * 4
    enemy.style.left = x + 'px'

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

    b.style.left = enemy.offsetLeft + enemy.offsetWidth / 2 - 4 + 'px'
    b.style.top = enemy.offsetTop + enemy.offsetHeight + 'px'

    game.appendChild(b)
    enemyBullets.push(b)
    lastbullet(b)
  }, 2000)
}

function lastbullet(b) {
  function step() {
    if (!b.parentElement || gameOver) return

    b.style.top = b.offsetTop + 16 + 'px'

    // enemybullet -> hero
    if (hit(b, hero)) {
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



setInterval(() => {
  console.log(enemyBullets.length);
}, 3000);