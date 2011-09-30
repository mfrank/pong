registerForDocumentKeyboardEvents = function(){
   document.onkeypress = handleKeyboardEvent
}

handleKeyboardEvent = function(e) {                                    
  var key = extractKeyFromEvent(e)
  handleKeyPress(key)
}

extractKeyFromEvent = function(e){
  return e.keyCode || e.which
}

var _isRunning = false

handleKeyPress = function(key){

  handleKeyForStartingGame(key)
  if (_isRunning){
    getDirectionForPaddleMove(key)
  }
}

handleKeyForStartingGame = function(key){
  var handled = false

  if (_player == 1 && ! _isRunning ){
    switch (key) {       
      case (32):  
        direction = 'start'
        startGame()
        handled = true
        break
    }
  }
}

getDirectionForPaddleMove = function(key){
  var direction

  switch (key) {       
    case (115):                                   
      direction = 'down'
      break
    case (119):                                   
      direction = 'up'
      break  
  }  

  sendDirectionToPaddle(direction)
}

sendDirectionToPaddle = function(direction){
  if ( direction ){
    sendMovementToOtherPlayer(direction)
    MovePlayerPaddle(_player, direction)
  }
}