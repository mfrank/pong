var app = require('http').createServer(handler)
  , io = require('socket.io').listen(app)
  , fs = require('fs')

app.listen(8080);

function handler (req, res) {
  fs.readFile(__dirname + '/pong.html',
    function (err, data) {
      if (err) {
        res.writeHead(500);
        return res.end('Error loading pong.html');
      }
      console.log("jo hier")
      res.writeHead(200);
      res.end(data);
    });

  
}

var playerA = null
var playerB = null

io.set('log level',1)
io.sockets.on('connection', function (socket) {
  
  if(playerA === null)
  {
     playerA = socket
     socket.emit('accepted', { player: 1 })
     console.log("player 1 connected")
 
     playerA.on('disconnect', function (){
       console.log("disconnect player 1")
       playerA = null
     })

     playerA.on('move', function (data) {
      console.log("Player A wants to go " + data.direction);
      if (playerB != null){
        playerB.emit('move', data)
      }
    });

    playerA.on('start', function(){
        console.log("Player A started");
      if (playerB != null){
        playerB.emit('start')
      }
    })
  
    return
  }

    if(playerB === null)
  {
     playerB = socket
     socket.emit('accepted', { player: 2 })
     console.log("player 2 connected")
     
     playerB.on('disconnect', function (){
       console.log("disconnect player 2")
       playerB = null
     })

    
     playerB.on('move', function (data) {
      console.log("Player B wants to go " + data.direction);
      if (playerA != null){
      playerA.emit('move', data)
    }
    });

    playerB.on('start', function(){
        console.log("Player B started");
      if (playerA != null){
        playerA.emit('start')
      }
    })
   
  }
});