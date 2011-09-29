handleDocumentKeyboardEvents = function(){
   document.onkeypress = handleGamestartEvent
}

handleGamestartEvent = function(e) {                                    
  if (e.keyCode) { key = e.keyCode }
  else if (typeof (e.which) != 'undefined') { key = e.which; }

  handlePaddleEvent()
}

var startOnceOnly = 0

handlePaddleEvent = function(){
  if (_player == 1 && startOnceOnly == 0){
    switch (key) {       
      case (32):  
        direction = 'start'
        startGame()
        startOnceOnly = 1
        break
    }
  }

  var direction

  switch (key) {       
    case (115):                                   
      direction = 'down'
      break
    case (119):                                   
      direction = 'up'
      break  
  }  
  sendMovementToOtherPlayer(direction)
  MovePlayerPaddle(_player, direction)
}

startGame = function(){
  startRound() 
  console.log('Das Spiel startet')
  _socket.emit('start')
}

sendMovementToOtherPlayer = function(direction){
  console.log(direction)
  _socket.emit('move', { direction: direction, player:_player})
}

MovePlayerPaddle = function(playerNumber, direction){
        
  var schlaeger = playerNumber == 1 ? SchlaegerLinks:SchlaegerRechts

  switch (direction) {       
    case 'down':                                   
      schlaeger.move(10)                                  
      break
    case 'up':                                   
      schlaeger.move(-10)                        
      break  
  }  
}