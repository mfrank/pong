var _player
var _socket

startGame = function(){
  startRound() 
  console.log('Das Spiel startet')
  _socket.emit('start')
  _isRunning = true
}

sendMovementToOtherPlayer = function(direction){
  console.log(direction)
  _socket.emit('move', { direction: direction, player:_player})
}

connectToServer = function(){
  
  console.log('connecting to server ...')
  _socket = createSocketConnectingToServer()          
  startListeningToEventsFromServer(_socket)
}
createSocketConnectingToServer = function(){
  return io.connect('http://192.168.1.157:8080')
}
startListeningToEventsFromServer = function(s){
  handleServerAcceptedEvent(s)
  handleOtherPlayerMoveEvent(s)
  handleOtherPlayerTriggeredStartEvent(s)
}
handleServerAcceptedEvent = function(s){
 
  s.on('accepted', function (data) {
    
    setCurrentUserToBePlayerNumber(data.player)
  })
}

setCurrentUserToBePlayerNumber = function(playerNumber) {
  _player = playerNumber
  console.log('Du bist Spieler '+ _player)
  
  setText('playerInfo', 'Du bist Spieler ' +playerNumber)
}
setText = function(tagId, text){
  var element = document.getElementById(tagId)
  element.innerHTML = text
}
handleOtherPlayerMoveEvent = function(s){
  
  s.on('move', function (data){
  
    var otherPlayerNumber = _player == 1 ? 2 : 1
    MovePlayerPaddle( otherPlayerNumber, data.direction)
    
  })
}
handleOtherPlayerTriggeredStartEvent = function(s){
  s.on('start', function (){
      startRound()           
  })
}