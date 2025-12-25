
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
let mv = true
let a = 1
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
        enemys()
        scor()
        bullets()
        level()
        let hero = document.querySelector('.hero')
        //let x = 0
        let y = 550
        const step = 10
        document.body.addEventListener('keydown', (elm) => {
            switch (elm.key) {
                // case 'ArrowUp' : x -= step; break
                case 'Backspace': bullet(); break
                case 'ArrowLeft': y -= step; break
                case 'ArrowRight': y += step; break
            }
            // hero.style.top = x + 'px'
            hero.style.left = y + 'px'

        })
            function movenemy(){
             const enemy = document.querySelector('.enmySize')
             if (mv) j+=a
             else j-=a
             if (j==1000) mv = false
             if (j<=1) mv =true
             enemy.style.left = j + 'px'
    requestAnimationFrame(movenemy)
}
            requestAnimationFrame(movenemy)


    }, 1100);

    


})


function heros() {
    let hero = document.createElement('div')
    hero.classList.add('hero')
    let plan = document.createElement('img')
    plan.setAttribute('class', 'plan')
    plan.setAttribute('src', 'airfight.png')
    hero.appendChild(plan)
    let parent = document.querySelector('.startdiv')
    parent.appendChild(hero)
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
    timdiv.setAttribute('class', 'tim')
    timdiv.innerText = `BULLETS`
    document.body.appendChild(timdiv)
}

function level() {
    let leveldiv = document.createElement('div')
    leveldiv.setAttribute('class', 'level')
    leveldiv.innerText = 'LEVEL: 1'
    document.body.appendChild(leveldiv)
}

function enemys() {
    //   let enm = document.createElement('div')
    //   enm.classList.add('enemy') 
    let enmy = document.createElement('img')
    enmy.setAttribute('src', 'enemy1.png')
    enmy.classList.add('enmySize')
    // enm.appendChild(enmy)
    let parnt = document.querySelector('.startdiv')
    parnt.appendChild(enmy)
}

function bullet() {
    let parnt = document.querySelector('.startdiv')
    let bullet = document.createElement('div')
    bullet.setAttribute('class', 'bullet')
    let starter = document.querySelector('.hero')
    let x = (starter.getBoundingClientRect().x + starter.getBoundingClientRect().right) / 2
    let y = (starter.getBoundingClientRect().y + starter.getBoundingClientRect().bottom) / 2
    console.log(x, y);
    bullet.style.top = x
    bullet.style.left = y
    parnt.appendChild(bullet)
}



// requestAnimationFrame(() => {
//     const enemy = document.querySelector('.enmySize')
//     console.log(enemy);

//     j++
//     enemy.style.left = j
// })


