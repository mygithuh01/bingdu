const config = {
  // 游戏的状态  0:游戏未开始  1：游戏进行中   2: 游戏结束
  status: 0,
  // 病毒生成的时间间隔
  interval: 800,
  // 病毒动画的速度
  speed: 3
}

let score = 0;

const q = (selector, root = document) => {
  return root.querySelector(selector)
}
const qAll = (selector, root = document) => {
  return Array.from(root.querySelectorAll(selector))
}

const startAlert = q("#start-alert")
const gameDesc = q(".game-desc")
const footer = q("#start-alert footer")
const virus_icon = q('p', footer)

startAlert.addEventListener("click", () => {
  // 添加动画
  gameDesc.classList.add("slide-up")
  footer.classList.add("slide-down")
  virus_icon.style.display = "none"
  setTimeout(() => {
    startAlert.style.display = "none"
  }, 500)
  startGame()

  // 更新游戏状态
  config.status = 1
})

let timer, updater
// 开始游戏
const startGame = () => {
  timer = setInterval(() => {
    makeVirus()
  }, config.interval)
  updater = setInterval(() => {
    update()
  }, 16)
}

const game = q('#game')
const letters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S',
  'T', 'U', 'V', 'W', 'X', 'Y', 'Z'
]
// 获得游戏场景
const stage = q("#stage")
// ui层
const uiLayer = q('#ui')
// 存放生产的病毒
const virues = []

const makeVirus = () => {
  let virus = document.createElement('div')
  virus.setAttribute('class', 'virus')
  let p = document.createElement('p')
  p.classList.add('letter')
  virus.appendChild(p)
  const s = p.style
  // 设置病毒的颜色
  switch (Math.floor(Math.random() * 6)) {
    case 0:
      s.backgroundImage = 'radial-gradient(rgba(255,150,150,0),rgba(255,0,0,1))'
      s.boxShadow = '0 0 15px #f00'
      break
    case 1:
      s.backgroundImage = 'radial-gradient(rgba(0, 255, 0, 0),rgba(0,255,0,1))'
      s.boxShadow = '0 0 15px #f00'
      break
    case 2:
      s.backgroundImage = 'radial-gradient(rgba(0, 0, 255, 0),rgba(0,0,255,1))'
      s.boxShadow = '0 0 15px #f00'
      break
    case 3:
      s.backgroundImage = 'radial-gradient(rgba(255, 255, 0, 0),rgba(255,255,0,1))'
      s.boxShadow = '0 0 15px #f00'
      break
    case 4:
      s.backgroundImage = 'radial-gradient(rgba(0, 255, 255, 0),rgba(0,255,255,1))'
      s.boxShadow = '0 0 15px #f00'
      break
    case 5:
      s.backgroundImage = 'radial-gradient(rgba(255, 0, 255, 0),rgba(255,0,255,1))'
      s.boxShadow = '0 0 15px #f00'
      break
  }
  const letter = letters[Math.floor(Math.random() * 26)]
  p.innerHTML = letter
  virus.style.left = Math.random() * (stage.offsetWidth - 100) + 'px'
  virus.letter = letter
  game.appendChild(virus)
  // 保存生产的病毒
  virues.push(virus)
}

const winH = stage.offsetHeight;
let ms = config.speed;
const update = () => {
  for (let i = 0; i < virues.length; i++) {
    const virus = virues[i]
    if (!virus.speed) {
      virus.speed = config.speed
    } else {
      virus.speed += virus.speed * 0.006
    }
    virus.style.top = virus.offsetTop + virus.speed + 'px'
    if (virus.offsetTop > (winH - 200) && !uiLayer.warning) {
      showWarning()
      uiLayer.warning = true
    } else if (virus.offsetTop >= winH) {
      // 游戏结束
      gameOver()
    }
  }
}

const showWarning = () => {
  let warningLayer = document.createElement('div')
  warningLayer.setAttribute('class', 'warning')
  uiLayer.appendChild(warningLayer)
}

const gameOverAlert = q('#game-over-alert')

// 游戏结束
const gameOver = () => {
  clearInterval(timer)
  clearInterval(updater)
  config.status = 2
  gameOverAlert.style.display = "block"
}

const scoreLabel = q("#score-label")
const xmEffect = q("#xm")

// 监听键盘事件
window.addEventListener("keyup", function (e) {
  const key = e.key

  for (let i = 0; i < virues.length; i++) {
    const virus = virues[i]
    if (virus.letter.toLowerCase() === key.toLocaleLowerCase() && config.status === 1) {
      // 切换病毒
      const dieImg = document.createElement('img')
      game.appendChild(dieImg)
      dieImg.src = '../images/virus-die.png'
      dieImg.style.position = 'absolute'
      dieImg.style.left = virus.offsetLeft + 'px'
      dieImg.style.top = virus.offsetTop + 'px'
      dieImg.classList.add('fade-out')
      setTimeout(function () {
        game.removeChild(dieImg)
      }, 1000)
      game.removeChild(virus)
      virues.splice(i, 1)
      score++
      scoreLabel.innerHTML = score
      if (score === 30) {

      }
      // 播放消灭音效
      xmEffect.currentTime = 0
      xmEffect.play()

    }
  }
})

// 重玩
const restartBtn = q("#restart-btn")
restartBtn.addEventListener("click", () => {
  gameOverAlert.style.display = "none"
  resetGame()
})

const resetGame = () => {
  config.status = 1
  score = 0
  scoreLabel.innerHTML = score
  game.innerHTML = ''
  virues.length  = 0
  uiLayer.removeChild(document.querySelector('.warning'))
  uiLayer.warning = false
  startGame()
}