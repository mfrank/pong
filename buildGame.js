var height = 350
var width = 700                    
var size = { height: 75, width: 15 }

buildGame = function() {
  createGameArea()
  createBallAndPaddles()
}

createGameArea = function(){
  createCourt()
  createNet()
  createDisplay()
}

createCourt = function(){
  court = new newCourt({ height: height, width: width })
  document.body.appendChild(court)
}

newCourt = function(size) {
  var block = new newBlock({ x: 15, y: 35 }, size, "green")
  return block
}

newBlock = function(position, size, c) {
  var block = document.createElement("div")
  block.style.position = "absolute"
  block.style.width = size.width + 'px'
  block.style.height = size.height + 'px'
  block.style.top = position.y + 'px'
  block.style.left = position.x + 'px'
  block.style.backgroundColor = c
  return block
}

createNet = function(){
  net = new newNet({ x: width / 2, y: 0 }, { height: height, width: 2 }, 25)
  court.appendChild(net)
}

newNet = function(position, size, nodash) {                 
  block = new newBlock(position, size, "green")
  block.p = position
  block.s = size
  createDashedLine(position, size, nodash)
  return block
}

createDashedLine = function(position, size, nodash){
  for (i = 0; i < nodash; i++) {
    line = new newBlock({ x: 0, y: i * 2 * block.s.height / (2*nodash) }, { height: size.height / (2 * nodash), width: size.width }, "white")
    block.appendChild(line)
  }
}

createDisplay = function(){
  createLeftDisplay()
  createRightDisplay()
}
  
var leftBoard = width / 4

createLeftDisplay = function(){  
  leftDisplay = createScoreBoard(leftBoard)
}

var rightBoard = 3 * width / 4

createRightDisplay = function(){
  rightDisplay = createScoreBoard(rightBoard)
}

createScoreBoard = function(x){
  var scoreBoard = new newScoreBoard({ x: x, y: 5}, { width: 20, height: 40})
  scoreBoard.setValue(0)
  court.appendChild(scoreBoard)
  return scoreBoard
}

newScoreBoard = function(position, size) {
  block = new newBlock(position, size, "green")
  block.p = position
  block.s = size
  block.score = 0
  block.line = []

  createSevenSegmentDisplay()
  
  return block

}

createSevenSegmentDisplay = function(){
  createSegments()
  createValuesForDisplay()
}

createSegments = function(){
  createHorizontalLines()
  createVerticalLines()
}

createHorizontalLines = function (){
  for (i = 0; i < 3; i++){
    block.line[i] = new newBlock({ x: 1, y: (i * block.s.height / 2) }, { height: 3, width: block.s.width - 2 }, "white")
    block.appendChild(block.line[i])
  }
}

createVerticalLines = function(){
  for (i = 0; i < 2; i++) {
    createRightLines()
    createLeftLines()
  }
}

createLeftLines = function(){
  block.line[i + 3] = new newBlock({ x: 0, y: i * block.s.height / 2 + 4 }, { height: block.s.height / 2 - 5, width: 3}, "white")
  block.appendChild(block.line[i + 3])
}

createRightLines = function(){
  block.line[i + 5] = new newBlock({ x: block.s.width - 3, y: i * block.s.height / 2 + 4 }, { height: block.s.height / 2 - 5, width: 3 }, "white")
  block.appendChild(block.line[i + 5])
}

createValuesForDisplay = function(){
  var segments=new Array(
    [0, 2, 3, 4, 5, 6],
    [3, 4],
    [0, 5, 1, 4, 2],
    [0, 5, 1, 2, 6],
    [1, 3, 5, 6],
    [0, 1, 2, 3, 6],
    [1, 2, 3, 4, 6],
    [0, 5, 6],
    [0, 1, 2, 3, 4, 5, 6],
    [0, 1, 3, 5, 6])

    setColorForSegments(segments)
}

setColorForSegments = function(segments){
  block.setValue = function(value) {
    this.value = value    
    for (i = 0; i < 7; i++) 
        this.line[i].style.backgroundColor = "green" 
    for (i in segments[value]) 
        this.line[segments[value][i]].style.backgroundColor = "white"
  }
}

createBallAndPaddles = function(){
  createball()
  createPaddlesAndSetPosition()
}

createball = function(){
  ball = new newBall({                     
    x: 345, y: 170 },
  { x: -2, y: 2}
  ,10)

  court.appendChild(ball)
}

newBall = function(position, velocity, radius) {
  block = new newBlock(position, { height: radius, width: radius }, "white")
  block.p = position
  block.v = velocity
  block.r = radius
  
  ballMove()

  return block
}

ballMove = function(){
  block.move = function(){
    this.p.x += this.v.x                                
    this.p.y += this.v.y
    this.style.top = this.p.y + 'px'
    this.style.left = this.p.x + 'px'

  // checkIfTheBallHasHitTheSideOfTheCourt()
  // checkIfTheBallHasGoneOutOfPlay()

    this.play = 0
    if (this.p.x + this.r > parseInt(this.parentNode.style.width))
        this.play = 1
    if (this.p.x < 0)
        this.play = 2
    if (this.p.y + this.r > parseInt(this.parentNode.style.height))
        this.v.y = -this.v.y
    if (this.p.y < 0)
        this.v.y = -this.v.y
    return this.play
  }
}

createPaddlesAndSetPosition = function(){      
  createLeftPaddle()
  createRightPaddle()
}

var leftBoarder = 10
var paddleWidth = 15

createLeftPaddle = function(){ 
  leftPaddle = createPaddle(leftBoarder)
}

var rightBoarder = width - paddleWidth - leftBoarder

createRightPaddle = function(){
  rightPaddle = createPaddle(rightBoarder)
}

var paddle

createPaddle = function(x){
  var paddle = new newPaddle({ x: x, y: (height / 2 - 30)}, {height: 75, width: 15})
  court.appendChild(paddle)

  return paddle
}


newPaddle = function(position, size) {
  block = newBlock(position, size, "white")
  block.p = position
  block.s = size
  block.move = function(d) { 
    
    if (this.p.y >= 15){
      this.p.y += d
      this.style.top = this.p.y + 'px'
    }
    else
      this.p.y = 15
      this.style.top = this.p.y + 'px'

   if (this.p.y <= block.s.height + 190){
      this.p.y += d
      this.style.top = this.p.y  + 'px'
    }
    else
      this.p.y = block.s.height + 190
      this.style.top = this.p.y + 'px'
  }

  block.hit = function(ball){
    if ((ball.p.x + ball.r) >= this.p.x && ball.p.x <= (this.p.x + this.s.width)) {
      if (ball.p.y >= this.p.y && ball.p.y <= (this.p.y + this.s.height)) {
  
    

        paddleArea = 100*(ball.p.y - this.p.y)/block.s.height
  
        if(paddleArea>=0 && paddleArea<=1*100/7){
          ball.v.y = (ball.v.y + (-3))
        }
        if(paddleArea>1*100/7 && paddleArea<=2*100/7){
          ball.v.y = (ball.v.y + (-2))
        }
        if(paddleArea>2*100/7 && paddleArea<=3*100/7){
          ball.v.y = (ball.v.y + (-1))
        }
        if(paddleArea>3*100/7 && paddleArea<=4*100/7){
          ball.v.y = (ball.v.y)
        }
        if(paddleArea>4*100/7 && paddleArea<=5*100/7){
          ball.v.y = (ball.v.y + (1))
        }
        if(paddleArea>5*100/7 && paddleArea<=6*100/7){
          ball.v.y = (ball.v.y + (2))
        }
        if(paddleArea>6*100/7 && paddleArea<=7*100/7){
          ball.v.y = (ball.v.y + (3))
        }
  
         ball.v.x = -ball.v.x
        
      }
    }
  }

  return block
}

sendDirectionToPaddle = function(direction){
  if ( direction == undefined )
    return

  sendMovementToOtherPlayer(direction)
  movePlayerPaddle(_player, direction)
}

movePlayerPaddle = function(playerNumber, direction){      
  var paddle = playerNumber == 1 ? leftPaddle:rightPaddle
  movePlayerPaddleDown(paddle, direction)
  movePlayerPaddleUp(paddle, direction)
}

movePlayerPaddleDown = function(paddle, direction){
  if (direction == 'down')                                      
    paddle.move(10)               
}   

movePlayerPaddleUp = function(paddle, direction){
  if (direction == 'up')                                   
    paddle.move(-10)                        
} 

startRound = function(playerNumber, direction) {
  ball.p = { x: 345, y: 170}
  ball.v = { x: 3, y: 3}
  Timer = new startTimer(20, update)
}

startTimer = function(tick, code, codew) {
  this.timer = window.setInterval(code, tick)
  this.clearTimer = function() {
    window.clearInterval(this.timer)
  }
}

update = function() {                       
  var ballIsStillInPlay = ball.move()        
  checkIfBallHitPaddle()
  checkIfPlayerScored(ballIsStillInPlay)
}

checkIfBallHitPaddle = function(){
  leftPaddle.hit(ball)
  rightPaddle.hit(ball)
}

checkIfPlayerScored = function(ballIsStillInPlay){
  if (ballIsStillInPlay){
    Timer.clearTimer()
    scorePlayer(ballIsStillInPlay)
    checkIfPlayerWon() 
  }  
}

scorePlayer = function(ballIsStillInPlay){
  scorePlayerA(ballIsStillInPlay)    
  scorePlayerB(ballIsStillInPlay)   
}

scorePlayerA = function(ballIsStillInPlay){
  if (ballIsStillInPlay == 1)
    leftDisplay.setValue(leftDisplay.value + 1)
}

scorePlayerB = function(ballIsStillInPlay){
  if (ballIsStillInPlay == 2)
    rightDisplay.setValue(rightDisplay.value + 1)
}

checkIfPlayerWon = function(){
  if (leftDisplay.value == 9 || rightDisplay.value == 9) {
    Timer.clearTimer()
  }
  else {
    startRound()
  }
}

setPaddlePositionWhenGameStarts = function(){
  setRightPaddlePositionWhenGameStarts()
  setLeftPaddlePositionWhenGameStarts()
}

setRightPaddlePositionWhenGameStarts = function(){
  leftPaddle.p = { x: leftBoarder, y: (height / 2 - 30) }
  leftPaddle.move(0)
}

setLeftPaddlePositionWhenGameStarts = function(){
  rightPaddle.p = { x: width - paddleWidth - leftBoarder, y: (height / 2 - 30) }
  rightPaddle.move(0)
}

showCurrentPlayerText = function(tagId, text){
  var element = document.getElementById(tagId)
  element.innerHTML = text
}