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
let bulcount = 6
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
  setInterval(createnemy, 4000)
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
  if (gameOver) return
   if (enemytotal>4*lvl) lvl++ , bulcount = parseInt((20*lvl)/1.5) , 
   levels.innerText = `LEVEL ${lvl}`
  if (enemycount == 3*lvl || enemytotal==5*lvl) return 
  const e = document.createElement('img')
  e.src = 'enemy1.png'
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
   bulcount--
   
  if (bulcount<0) return;
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
  let bons = document.createElement('div')
  bons.className = 'bonus'
  bons.innerText = '+5'
  document.querySelector('.startdiv').appendChild(bons)
}

// setInterval(() => {
//   bonus()
// }, 3000);