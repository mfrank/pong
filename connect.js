var _player
var _socket

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

handleOtherPlayerMoveEvent = function(s){ 
  s.on('move', function (data){
    var otherPlayerNumber = _player == 1 ? 2 : 1
    movePlayerPaddle( otherPlayerNumber, data.direction)
  })
}

handleOtherPlayerTriggeredStartEvent = function(s){
  s.on('start', function (){
    setPaddlePositionWhenGameStarts()
    startRound() 
  })
}

startGame = function(){
  setPaddlePositionWhenGameStarts()
  startRound() 
  console.log('Das Spiel startet')
  _socket.emit('start')
}

sendMovementToOtherPlayer = function(direction){
  console.log(direction)
  _socket.emit('move', { direction: direction, player:_player})
}