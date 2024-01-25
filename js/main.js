const ROWS = 30
const COLS = 30

let snake
let fruit
let loopInterval

class Fruit {
  constructor() {
    this.x = Math.floor(Math.random() * COLS)
    this.y = Math.floor(Math.random() * ROWS)
  }

  draw() {
    getAtCoords(this.x, this.y).classList.add('fruit')
  }
}

class Tail {
  constructor(x, y) {
    this.x = x
    this.y = y
  }

  draw() {
    getAtCoords(this.x, this.y).classList.add('snake')
  }
}

class Snake {
  segments = []
  constructor(x, y, dir) {
    this.x = x
    this.y = y
    this.dir = dir
  }

  draw() {
    this.segments.forEach((seg) => seg.draw())
    getAtCoords(this.x, this.y).classList.add('snake')
  }

  setDirection(dir) {
    if (this.segments.length > 0) {
      if (this.dir === 'ArrowLeft' && dir === 'ArrowRight') return
      if (this.dir === 'ArrowRight' && dir === 'ArrowLeft') return
      if (this.dir === 'ArrowUp' && dir === 'ArrowDown') return
      if (this.dir === 'ArrowDown' && dir === 'ArrowUp') return
    }
    this.dir = dir
  }

  move() {
    getAtCoords(this.x, this.y).classList.remove('snake')

    for (let i = this.segments.length - 1; i > -1; i--) {
      if (i === 0) {
        this.segments[i].x = this.x
        this.segments[i].y = this.y
      } else {
        this.segments[i].x = this.segments[i - 1].x
        this.segments[i].y = this.segments[i - 1].y
      }
    }

    switch (this.dir) {
      case 'ArrowRight':
        this.x++
        break
      case 'ArrowLeft':
        this.x--
        break
      case 'ArrowUp':
        this.y--
        break
      case 'ArrowDown':
        this.y++
        break
    }
  }

  isCollidingWalls() {
    return this.x < 0 || this.x >= COLS || this.y < 0 || this.y >= ROWS
  }

  isCollidingTail() {
    for (let i = 1; i < this.segments.length; i++) {
      if (this.x === this.segments[i].x && this.y === this.segments[i].y) {
        return true
      }
    }
    return false
  }
}

function getAtCoords(x, y) {
  return document.getElementById(`c${x}_r${y}`)
}

function play() {
  snake.move()
  if (snake.isCollidingTail() || snake.isCollidingWalls()) {
    clearInterval(loopInterval)
    return
  }

  if (snake.x === fruit.x && snake.y === fruit.y) {
    snake.segments.push(new Tail(snake.x, snake.y))
    fruit = new Fruit()
  }

  view()
}

function viewGame() {
  let result = ''
  for (let y = 0; y < ROWS; y++) {
    result += '<div class="row">'
    for (let x = 0; x < COLS; x++) {
      result += `<div class="box" id="c${x}_r${y}"></div>`
    }
    result += '</div>'
  }
  return result
}

function view() {
  document.getElementById('app').innerHTML = `
		${viewGame()}
	`

  snake.draw()
  fruit.draw()
}

function init() {
  snake = new Snake(ROWS / 2, COLS / 2, 'ArrowRight')
  fruit = new Fruit()
  document.addEventListener('keydown', (e) => snake.setDirection(e.key))
  view()
  loopInterval = setInterval(play, 250)
}
