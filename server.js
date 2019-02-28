var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io').listen(server);

var players = {}, degat;
var star = {
  x: Math.floor(Math.random() * 700) + 50,
  y: Math.floor(Math.random() * 500) + 50
};
var scores = {
  blue: 100,
  red: 100
};
let cpt = 0, team;

app.use(express.static(__dirname + '/public'));

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', function (socket) {
  console.log('a user connected');
  cpt++;
  if((cpt % 2) === 0){
    players[socket.id] = {
      rotation: 0,
      playerId: socket.id,
      team: 'blue'
    };
  }else{
    players[socket.id] = {
      rotation: 0,
      playerId: socket.id,
      team: 'red'
    };
  }
  // create a new player and add it to our players object
  // send the players object to the new player
  socket.emit('currentPlayers', players);
  // send the star object to the new player
  socket.emit('starLocation', star);
  // send the current scores
  socket.emit('scoreUpdate', scores);
  // update all other players of the new player
  socket.broadcast.emit('newPlayer', players[socket.id]);

  socket.on('disconnect', function () {

    console.log('user disconnected');
    // remove this player from our players object
    delete players[socket.id];
    // emit a message to all players to remove this player
    io.emit('disconnect', socket.id);
    
    
  });
  // when a player moves, update the player data
  socket.on('playerMovement', function (movementData) {
    players[socket.id].x = movementData.x;
    players[socket.id].y = movementData.y;
    players[socket.id].rotation = movementData.rotation;
    
    // emit a message to all players about the player that moved
    socket.broadcast.emit('playerMoved', players[socket.id]);
  });

  socket.on('starCollected', function () {
    if (players[socket.id].team === 'red') {
      scores.red += 10;
    } else {
      scores.blue += 10;
    }
    star.x = Math.floor(Math.random() * 700) + 50;
    star.y = Math.floor(Math.random() * 500) + 50;
    io.emit('starLocation', star);
    io.emit('scoreUpdate', scores);
  });

  socket.on('attaque',function(){
    if (players[socket.id].team === 'blue') {
      scores.red += (1*-1);
      if (scores.red === 0 ) {
        scores.red = 500
        scores.blue = 500
        
      }
    } else if (players[socket.id].team === 'red') {
      scores.blue += (1*-1);
      if (scores.blue === 0 ) {
        scores.red = 500
        scores.blue = 500
        
      }
    }
    io.emit('scoreUpdate', scores);
  })
});
server.listen(process.env.PORT || 3000, function () {
  console.log(`Listening on ${server.address().port}`);
});