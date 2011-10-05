var _isRunning = false

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

handleKeyPress = function(key){
  handleKeyForGameStart(key)
  handleKeyForPaddleMovements(key)    
}

handleKeyForGameStart = function(key){
  if (_player == 1 && _isRunning == false ){
    handleKeyPressForGameStart(key)
  }
}

handleKeyPressForGameStart = function(key){
  if (key == 32) {       
    direction = 'start'
    startGame()
    _isRunning = true
  }
}

handleKeyForPaddleMovements = function(key){
  var direction = getDirectionFromKeyPress(key)
  sendDirectionToPaddle(direction)
}

getDirectionFromKeyPress = function(key){  
  if (key == 115)
    return 'down'       
  if (key == 119)                          
    return 'up' 
}