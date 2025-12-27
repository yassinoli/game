
function starting() {
    let div = document.createElement('div')
    div.setAttribute('class', 'startdiv')
    document.body.appendChild(div)
    let strt = document.createElement('div')
    strt.setAttribute('class', 'starting')
    let buttonStart = document.createElement('button')
    buttonStart.setAttribute('class', 'starButton')
    buttonStart.innerText = 'Start play'
    let buttonInstruction = document.createElement('button')
    buttonInstruction.setAttribute('class', 'instructionbtn')
    buttonInstruction.innerText = 'See Instructions'
    strt.appendChild(buttonStart); strt.appendChild(buttonInstruction)
    document.querySelector('.startdiv').appendChild(strt)
}

starting()
var j = 0
let is = 1
var l = 0
let mv = true
let a = 3
let ids = 0
let btns = document.querySelector('.starButton')
let f = document.querySelector('.starting')

   


btns.addEventListener('click', () => {
    f.style.display = 'none'
    let load = document.querySelector('.startdiv')
    load.classList.add('loadstarting')
    setTimeout(() => {
        load.classList.remove('loadstarting')
    }, 1000);

    setTimeout(() => {
        load.classList.add('playdiv')
        heros()
        for(let j = 0 ; j<1 ; j++){enemys(`num${j}`)}
        scor()
        bullets()
        level()
        let hero = document.querySelector('.plan')
        //let x = 0
         let mapa = document.querySelector('.playdiv').getBoundingClientRect()

        let y = mapa.left + mapa.width/9
        const step = 10
        document.body.addEventListener('keydown', (elm) => {
            //console.log(elm.key)
            switch (elm.key) {
                // case 'ArrowUp' : x -= step; break
                case ' ' :  bullet() , mouving() ; break
                case 'ArrowLeft': y -= step; break
                case 'ArrowRight': y += step; break
            }
            // hero.style.top = x + 'px'
            hero.style.left = y + 'px'
          

        })
        const map = document.querySelector('.playdiv').getBoundingClientRect()
            function movenemy(){
             const enemy = document.querySelector('.enmySize')
             if (mv) j+=a
             else j-=a
             if (j>=map.right - 330) mv = false
             if (j<=1) mv =true
             enemy.style.left = j + 'px'
            requestAnimationFrame(movenemy)
}
            requestAnimationFrame(movenemy)

    }, 1100);
})


function heros() {
    // let hero = document.createElement('div')
    // hero.classList.add('hero')
    let plan = document.createElement('img')
    plan.setAttribute('class', 'plan')
    plan.setAttribute('src', 'her.png')
    // hero.appendChild(plan)
    let parent = document.querySelector('.startdiv')
    parent.appendChild(plan)
    // requestAnimationFrame()
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

function enemys(id) {
    //   let enm = document.createElement('div')
    //   enm.classList.add('enemy') 
    let enmy = document.createElement('img')
    enmy.setAttribute('src', 'enemy1.png')
    enmy.setAttribute('id',`${id}`)
    enmy.classList.add('enmySize')
    // enm.appendChild(enmy)
    let parnt = document.querySelector('.startdiv')
    parnt.appendChild(enmy)
}

function bullet() {
    let parnt = document.querySelector('.startdiv')
    let bullet = document.createElement('div')
    bullet.setAttribute('class', 'bullet')
     bullet.setAttribute('id', `its${is}`)
    is++
     bullet.setAttribute('id', 'blt')
    parnt.appendChild(bullet)
       
 let hero = document.querySelector('.plan').getBoundingClientRect()
      let hx = hero.left 
    let hy = hero.top - (hero.height)
    bullet.style.top = hy + 'px'
    bullet.style.left = hx-245 + 'px'
    bullet.style.background = 'white'
}

function mouving(){

             
                  let mapa = document.querySelector('.playdiv').getBoundingClientRect()
   
     function movebullet(){
             const bull = document.querySelector(`.bullet`)
        let topBullet = bull.getBoundingClientRect()
         let tp = topBullet.top
                  let top = parseFloat(bull.style.top);
                  bull.style.top = (top - 1) + 'px';
                  console.log(tp);
                  let enm = document.querySelector('.enmySize')
                  const enemy = enm.getBoundingClientRect()
                  if (tp<mapa.top || tp == enemy.x) bull.remove() , enm.remove() 
                  
                requestAnimationFrame(movebullet)
            }
                requestAnimationFrame(movebullet)       
}
