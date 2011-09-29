var hoehe = 350
var breite = 700                    
var size = { hoehe: 75, breite: 15 }

start = function(){
  SpielfeldAufbauen()
  handleDocumentKeyboardEvents()
  connectToServer()
}

window.onload = start

SpielfeldAufbauen = function() {
  rahmenDesSpielfeldes()
  schlaegerUndBall()
  }

rahmenDesSpielfeldes = function(){
  feldErstellen()
  netzErstellen()
  trefferanzeigeErstellen()
}

feldErstellen = function(){
  Feld = new FeldNeu({ hoehe: hoehe, breite: breite })
  document.body.appendChild(Feld)
}

FeldNeu = function(size) {
  var block = new BlockNeu({ x: 15, y: 35 }, size, "green")
  return block
}

netzErstellen = function(){
  Netz = new NetzNeu({                                    
    x: breite / 2, y: 0
  }, {
   hoehe: hoehe, breite: 2
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


var linkeTafel = breite / 4
var rechteTafel = 3 * breite / 4

trefferanzeigeErstellen = function(){
 
  linkeAnzeigeWirdErstellt()
  rechteAnzeigeWirdErstellt()
}
  
linkeAnzeigeWirdErstellt = function(){  
  
  AnzeigeL = erstelleAnzeige(linkeTafel)
}

rechteAnzeigeWirdErstellt = function(){
  
  AnzeigeR = erstelleAnzeige(rechteTafel)
}

erstelleAnzeige = function(x){
  var anzeige = new AnzeigeNeu(
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


schlaegerUndBall = function(){
  ballErstellen()
  schlaegerErstellen()
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


ballErstellen = function(){
  Ball = new BallNeu({                     
    x: 345, y: 170
  }, {
    x: -2,
    y: 2
  }, 10)

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
var schlaegerBreite = 15

schlaegerErstellen = function(){      
  linkerSchlaegerWirdErstellt()
  rechterSchlaegerWirdErstellt()
}

linkerSchlaegerWirdErstellt = function(){
  
  SchlaegerLinks = erstelleSchlaeger(spielfeldRand)

}

rechterSchlaegerWirdErstellt = function(){

  var positionRechtsAmRand = breite - schlaegerBreite - spielfeldRand

  SchlaegerRechts = erstelleSchlaeger(positionRechtsAmRand)
}

var schlaeger

erstelleSchlaeger = function(x){

  var schlaeger = new SchlaegerNeu(
    {
      x: x, y: (hoehe / 2 - 30)
    },
    {
      hoehe: 75, breite: 15 
    }
  )

  Feld.appendChild(schlaeger)

  return schlaeger
}

SchlaegerNeu = function(position, size) {
  block = BlockNeu(position, size, "white")
  block.p = position
  block.s = size
 

  block.move = function(d) {
   
      this.p.y += d
      this.style.top = this.p.y + 'px'
    
   
  }


  block.trifft = function(B){
    if (((B.p.x + B.r) >= this.p.x) && (B.p.x <= (this.p.x + this.s.breite))) {
      if (B.p.y >= this.p.y && B.p.y <= (this.p.y + this.s.hoehe)) {
        B.v.x = -B.v.x
      }
    }
  }
return block
}



update = function() {                       
  var zustand = Ball.move()                  
  if (zustand != 0){
    Timer.clearTimer()

    if (zustand == 1) {
      AnzeigeL.setValue(AnzeigeL.value + 1)
    } else {
      AnzeigeR.setValue(AnzeigeR.value + 1)
    }
    pruefeObSpielerGewonnenHat()         
  }
  SchlaegerLinks.trifft(Ball)
  SchlaegerRechts.trifft(Ball)
}

pruefeObSpielerGewonnenHat = function(){
  if (AnzeigeL.value == 9 || AnzeigeR.value == 9) {
    Timer.clearTimer()
  }
  else {
    startRound()
  }
}


AnzeigeNeu = function(position, size) {
  block = new BlockNeu(position, size, "green")
  block.p = position
  block.s = size
  block.score = 0
  block.Strich = []
  
  for (i = 0; i < 3; i++) {
    block.Strich[i] = new BlockNeu({ x: 1, y: (i * block.s.hoehe / 2) }, { hoehe: 3, breite: block.s.breite - 2 }, "white")
    block.appendChild(block.Strich[i])
  }

  for (i = 0; i < 2; i++) {
    block.Strich[i + 3] = new BlockNeu({ 
      x: 0, y: i * block.s.hoehe / 2 + 4 
    },
    { hoehe: block.s.hoehe / 2 - 5, breite: 3
    }, "white")
    block.appendChild(block.Strich[i + 3])

    block.Strich[i + 5] = new BlockNeu({ 
      x: block.s.breite - 3, y: i * block.s.hoehe / 2 + 4 
      },
      { hoehe: block.s.hoehe / 2 - 5, breite: 3 
      }, "white")
    block.appendChild(block.Strich[i + 5])
  }

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

  block.setValue = function(value) {
    this.value = value        
    for (i = 0; i < 7; i++) {
      this.Strich[i].style.backgroundColor = "green"
    }
    for (i in Segmente[value]) {
      this.Strich[Segmente[value][i]].style.backgroundColor = "white"
    }
  }
return block
}

startRound = function() {

  Ball.p = { x: 345, y: 170}
  Ball.v = { x: 3, y: 3}
  Timer = new startTimer(20, update)
}

startTimer = function(tick, code) {
  this.timer = window.setInterval(code, tick)
  this.clearTimer = function() {
    window.clearInterval(this.timer)
  }
}