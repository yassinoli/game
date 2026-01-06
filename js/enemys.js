import {gw ,hero ,heroDies, explostion, hit , game , setPos , getPos , showlvl , levels} from './script.js'
import {stat} from './state.js'
export function createnemy() {
  if (stat.pause || stat.gameOver) return;
 
  // last stage
  if (stat.lvl === 3) {
    lastStage();
    return;
  }

  const config = stat.levelConfig[stat.lvl];

  //lvl up
  if (stat.enemiesKilled >= config.totalToKill ) {
    stat.lvl++;
    //enemiesKilled = 0;   
    showlvl();
    levels.innerText = `LEVEL ${stat.lvl}`;
    stat.speed += 1.3
    return;
  }

  const e = document.createElement('img');
  e.src = config.enemy;
  e.className = 'enmySize';
  const startX = Math.random() * (game.clientWidth - 160);
  setPos(e, startX, 0);

  stat.enemycount++;

  game.appendChild(e);
  stat.enemies.push(e);

  movenemy(e);
  enemyshut(e);
}




// enemy move
export function movenemy(enemy) {
  let ss = 60
  let mod = 1
let dir = 1
   function step() {
    
    if (!enemy.parentElement || stat.gameOver) return
    const pos = getPos(enemy);
    let x = pos.x + dir * stat.speed;
   if(stat.pause===false) {
    pos.y += 1;
    setPos(enemy, x, pos.y);
  }
  mod++
   
    if ((x <= 0 || x >= game.clientWidth - enemy.offsetWidth )||((ss%(Math.floor(Math.random()*120)) === 2)))  {
      dir *= -1
    }
   
    if(hit(enemy,hero)){
      const eRect = enemy.getBoundingClientRect();
      explostion(eRect.top - gw.top, eRect.left - gw.left);
      enemy.remove();
      stat.enemies = stat.enemies.filter(e => e !== enemy);
      if (stat.herolives==0){
        heroDies()
      }else{
        stat.herolives--
      }
      return;
    }
    if(!hit(enemy,game)){
      if (stat.herolives==0){
        heroDies()
      }else{
        stat.herolives--
      }
    }
 
       requestAnimationFrame(step)
    
  }
  requestAnimationFrame(step)
}

// enemy bull
export function enemyshut(enemy) {
  const shoot = setInterval(() => {
    if (!enemy.parentElement || stat.gameOver ) {
      clearInterval(shoot)
      return
    }

    const b = document.createElement('div')
    b.innerHTML = '<img src="image/albl.png">'
    b.className = 'bullet enemyBullet'
    if(stat.pause===false){
      const eRect = enemy.getBoundingClientRect();
      const startX = eRect.left - gw.left + enemy.offsetWidth / 2 - 4;
      const startY = eRect.top - gw.top + enemy.offsetHeight;
      setPos(b, startX, startY);
      game.appendChild(b)
      stat.enemyBullets.push(b)
      enemybuletmove(b)
    }
  }, Math.floor(Math.random()*2000) + 1000   )
}

export function enemybuletmove(b) {
   
   function step() {
    
    if (!b.parentElement || stat.gameOver ) return
    const pos = getPos(b);
    if (stat.pause===false){
      pos.y += 4;
      setPos(b, pos.x, pos.y);
    }

    // enemybullet -> hero
    if (hit(b, hero)) {
      const hRect = hero.getBoundingClientRect();
      explostion(hRect.top - gw.top, hRect.left - gw.left - 40) 
      if (stat.herolives==0){
        heroDies()
      }else{
        stat.herolives--
      }
      b.remove()
      return
    }

    if (!hit(b,game)){
      b.remove()
    }

    // enemybulet <-> hero bulet
    stat.heroBullets.forEach((hb, i) => {
      if (hit(b, hb)) {
        b.remove()
        hb.remove()
        stat.heroBullets.splice(i, 1)
      }
    })
    
      requestAnimationFrame(step)
    
  }
  requestAnimationFrame(step)
}


// ----------------- stage tali 

export function lastStage(){
  stat.lastOne = true
 if(stat.enemies.length == 0) {
  let e = document.createElement('div')
  e.className = 'enmySize'
  e.innerHTML ='<img src="image/enemy3.png"><progress  value="40" max="40"></progress>'
  const startX = Math.random() * (game.clientWidth - 160);
  setPos(e, startX, 0);
  stat.enemycount++
  stat.enemytotal++
  game.appendChild(e)
  stat.enemies.push(e)

  movitt(e)
  shutitt(e)}
}

function movitt(enemy) {
  let rdm = 0
let dir = 1
  function step() {
    if (!enemy.parentElement || stat.gameOver ) return
    let g = gw.width-100
    const pos = getPos(enemy);
    let x = pos.x + dir * 4;
    rdm++
    if(rdm%40===0){
      x = Math.floor(Math.random()*g)+dir*4
    }
    if(stat.pause===false){
      setPos(enemy, x, pos.y);
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
    if (!enemy.parentElement || stat.gameOver ) {
      clearInterval(shoot)
      return
    }
   if(stat.pause===false){
    const b = document.createElement('div')
    b.className = 'bullet enemyBullet'
    b.style.backgroundColor = 'green'
    b.style.height = '18px'
    b.style.width = '18x'
    b.style.borderRadius = '5px'

    const eRect = enemy.getBoundingClientRect();
    const startX = eRect.left - gw.left + enemy.offsetWidth / 2 - 4;
    const startY = eRect.top - gw.top + enemy.offsetHeight;
    setPos(b, startX, startY);

    game.appendChild(b)
    stat.enemyBullets.push(b)
    lastbullet(b)}
  }, 2000)
}

function lastbullet(b) {
  function step() {
    if (!b.parentElement || stat.gameOver ) return
    const pos = getPos(b);
    if(stat.pause===false){
      pos.y += 6;
      pos.x += Math.floor(Math.random()*40)-20;
      setPos(b, pos.x, pos.y);
    }
 
    if(!hit(b,game)){
      b.remove()
    }
    // enemybullet -> hero
    if (hit(b, hero)) {
      const hRect = hero.getBoundingClientRect();
      explostion(hRect.top - gw.top, hRect.left - gw.left) 
       if (stat.herolives==0){
        heroDies()
      }else{
        stat.herolives--
      }
      b.remove()
      return
    }

    // enemybulet <-> hero bulet
    stat.heroBullets.forEach((hb, i) => {
      if (hit(b, hb)) {
        b.remove()
        hb.remove()
        stat.heroBullets.splice(i, 1)
      }
    })
   
          requestAnimationFrame(step)
    
  }
  requestAnimationFrame(step)
}