var hoehe = 350
var breite = 700                    
var size = { hoehe: 75, breite: 15 }

SpielfeldAufbauen = function() {
  rahmenDesSpielfeldes()
  paddleUndBall()
}

rahmenDesSpielfeldes = function(){
  createField()
  createNet()
  punktanzeigeErstellen()
}

createField = function(){
  Feld = new newField({ hoehe: hoehe, breite: breite })
  document.body.appendChild(Feld)
}

newField = function(size) {
  var block = new BlockNeu({ x: 15, y: 35 }, size, "green")
  return block
}

BlockNeu = function(position, size, c) {
  var block = document.createElement("div")
  block.style.position = "absolute"
  block.style.width = size.breite + 'px'
  block.style.height = size.hoehe + 'px'
  block.style.top = position.y + 'px'
  block.style.left = position.x + 'px'
  block.style.backgroundColor = c
  return block
}

createNet = function(){
  Netz = new NetzNeu({ x: breite / 2, y: 0
  }, { hoehe: hoehe, breite: 2
  }, 40)
  Feld.appendChild(Netz)
}

NetzNeu = function(position, size, nodash) {                 
  block = new BlockNeu(position, size, "green")
  block.p = position
  block.s = size
  for (i = 0; i < nodash; i++) {
    Strich = new BlockNeu({ x: 0, y: i * 2 * block.s.hoehe / (2*nodash) }, { hoehe: size.hoehe / (2 * nodash), breite: size.breite }, "white")
    block.appendChild(Strich)
  }
  return block
}

punktanzeigeErstellen = function(){
  linkeAnzeigeWirdErstellt()
  rechteAnzeigeWirdErstellt()
}
  
var linkeTafel = breite / 4

linkeAnzeigeWirdErstellt = function(){  
  AnzeigeL = createScoreBoard(linkeTafel)
}

var rechteTafel = 3 * breite / 4

rechteAnzeigeWirdErstellt = function(){
  AnzeigeR = createScoreBoard(rechteTafel)
}

createScoreBoard = function(x){
  var anzeige = new newScoreBoard(
    {
      x: x, y: 5
    },
    {
      breite: 20, hoehe: 40
    }
  )
  anzeige.setValue(0)
  Feld.appendChild(anzeige)
  return anzeige
}

newScoreBoard = function(position, size) {
  block = new BlockNeu(position, size, "green")
  block.p = position
  block.s = size
  block.score = 0
  block.Strich = []
  createHorizontaleLines()
  createVerticalLines()
  createArrayForSegments()
  
return block

}
createHorizontaleLines = function (){
  for (i = 0; i < 3; i++) {
    block.Strich[i] = new BlockNeu({ x: 1, y: (i * block.s.hoehe / 2) }, { hoehe: 3, breite: block.s.breite - 2 }, "white")
    block.appendChild(block.Strich[i])
  }
}

createVerticalLines = function(){
  for (i = 0; i < 2; i++) {
    block.Strich[i + 3] = new BlockNeu({ 
      x: 0, y: i * block.s.hoehe / 2 + 4 
    }, { hoehe: block.s.hoehe / 2 - 5, breite: 3}
    , "white")
    
    block.appendChild(block.Strich[i + 3])

    block.Strich[i + 5] = new BlockNeu({ 
      x: block.s.breite - 3, y: i * block.s.hoehe / 2 + 4 },
      { hoehe: block.s.hoehe / 2 - 5, breite: 3 }
      , "white")
    block.appendChild(block.Strich[i + 5])
  }
}

createArrayForSegments = function(){
  var Segmente=new Array(
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

    setValueFromArray(Segmente)
}

setValueFromArray = function(Segmente){
    block.setValue = function(value) {
      this.value = value        
      for (i = 0; i < 7; i++) {
        this.Strich[i].style.backgroundColor = "green"
      }
      for (i in Segmente[value]) {
        this.Strich[Segmente[value][i]].style.backgroundColor = "white"
      }
  }
}



paddleUndBall = function(){
  ballErstellen()
  paddleErstellen()
}

ballErstellen = function(){
  Ball = new BallNeu({                     
    x: 345, y: 170 },
  { x: -2, y: 2}
  ,10)

  Feld.appendChild(Ball)
}

BallNeu = function(position, velocity, radius) {
  block = new BlockNeu(position, { hoehe: radius, breite: radius }, "white")
  block.p = position
  block.v = velocity
  block.r = radius
  block.move = function(){
    this.p.x += this.v.x                                
    this.p.y += this.v.y
    this.style.top = this.p.y + 'px'
    this.style.left = this.p.x + 'px'

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
return block
}

var spielfeldRand = 10
var paddleWidth = 15

paddleErstellen = function(){      
  createLeftPaddle()
  createRightPaddle()
}

createLeftPaddle = function(){
  
  leftPaddle = createPaddle(spielfeldRand)
}

createRightPaddle = function(){

  var positionRechtsAmRand = breite - paddleWidth - spielfeldRand

  rightPaddle = createPaddle(positionRechtsAmRand)
}

var paddle

createPaddle = function(x){
  var paddle = new paddleNeu(
    {
      x: x, y: (hoehe / 2 - 30)
    },
    {
      hoehe: 75, breite: 15 
    }
  )
  Feld.appendChild(paddle)

  return paddle
}


paddleNeu = function(position, size) {
  block = BlockNeu(position, size, "white")
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

   if (this.p.y <= block.s.hoehe + 190){
      this.p.y += d
      this.style.top = this.p.y  + 'px'
    }
    else
      this.p.y = block.s.hoehe + 190
      this.style.top = this.p.y + 'px'
  }

  block.trifft = function(ball){
    if ((ball.p.x + ball.r) >= this.p.x && ball.p.x <= (this.p.x + this.s.breite)) {
      if (ball.p.y >= this.p.y && ball.p.y <= (this.p.y + this.s.hoehe)) {
  
    

        winkel = 100*(ball.p.y - this.p.y)/block.s.hoehe
  
        if(winkel>=0 && winkel<=1*100/7){
          ball.v.y = (ball.v.y + (-3))
        }
        if(winkel>1*100/7 && winkel<=2*100/7){
          ball.v.y = (ball.v.y + (-2))
        }
        if(winkel>2*100/7 && winkel<=3*100/7){
          ball.v.y = (ball.v.y + (-1))
        }
        if(winkel>3*100/7 && winkel<=4*100/7){
          ball.v.y = (ball.v.y)
        }
        if(winkel>4*100/7 && winkel<=5*100/7){
          ball.v.y = (ball.v.y + (1))
        }
        if(winkel>5*100/7 && winkel<=6*100/7){
          ball.v.y = (ball.v.y + (2))
        }
        if(winkel>6*100/7 && winkel<=7*100/7){
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
  MovePlayerPaddle(_player, direction)
}

MovePlayerPaddle = function(playerNumber, direction){
        
  var paddle = playerNumber == 1 ? leftPaddle:rightPaddle

  switch (direction) {       
    case 'down':                                   
      paddle.move(10)                                  
      break
    case 'up':                                   
      paddle.move(-10)                        
      break  
  }  
}

startRound = function() {

  Ball.p = { x: 345, y: 170}
  Ball.v = { x: 3, y: 3}
  Timer = new startTimer(20, updateScore)
}

updateScore = function() {                       
  var punkt = Ball.move()                  
  pruefeObSpielerGetroffenHat(punkt)
}

pruefeObSpielerGetroffenHat = function(punkt){
  if (punkt != 0){
    Timer.clearTimer()
    scorePlayerA(punkt)    
    scorePlayerB(punkt)
      
    pruefeObSpielerGewonnenHat()         
  }
  paddleTrifftBall() 
}

scorePlayerA = function(punkt){
  if (punkt == 1)
    AnzeigeL.setValue(AnzeigeL.value + 1)
}

scorePlayerB = function(punkt){
  if (punkt == 2)
    AnzeigeR.setValue(AnzeigeR.value + 1)
}

paddleTrifftBall = function(){
  leftPaddle.trifft(Ball)
  rightPaddle.trifft(Ball)
}

pruefeObSpielerGewonnenHat = function(){
  if (AnzeigeL.value == 9 || AnzeigeR.value == 9) {
    Timer.clearTimer()
  }
  else {
    startRound()
  }
}

setzeSchlaegerZurueck = function(){
  setzeRechterSchlaegerZurueck()
  setzeLinkerSchlaegerZurueck()
}

setzeRechterSchlaegerZurueck = function(){
  leftPaddle.p = { x: spielfeldRand, y: (hoehe / 2 - 30) }
  leftPaddle.move(0)
}

setzeLinkerSchlaegerZurueck = function(){
  rightPaddle.p = { x: breite - paddleWidth - spielfeldRand, y: (hoehe / 2 - 30) }
  rightPaddle.move(0)
}

startTimer = function(tick, code) {
  this.timer = window.setInterval(code, tick)
  this.clearTimer = function() {
    window.clearInterval(this.timer)
  }
}