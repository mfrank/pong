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

  handleKeyForGameStart(key)
  handleKeyForPaddleMovements(key)
  
  
     
}

handleKeyForGameStart = function(key){

  if (_player == 1 && _isRunning == false ){
    switch (key) {       
      case (32):     
        direction = 'start'
        startGame()
     //   setzeSchlaegerZurueck()
        _isRunning = true
        break
    }
  }
}

handleKeyForPaddleMovements = function(key){
  
  var direction = getDirectionFromKeyPress(key)

  sendDirectionToPaddle(direction)
}

getDirectionFromKeyPress = function(key){
  
  switch (key) {       
    case (115):                                   
      return 'down'      
    case (119):                                  
      return 'up'
  }  

}