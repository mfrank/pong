setCurrentUserToBePlayerNumber = function(playerNumber) {
  _player = playerNumber
  console.log('Du bist Spieler '+ _player)
  showCurrentPlayerText('playerInfo', 'Du bist Spieler ' +playerNumber)
}

showCurrentPlayerText = function(tagId, text){
  var element = document.getElementById(tagId)
  element.innerHTML = text
}