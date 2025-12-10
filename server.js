//import express
let express = require('express');

//create express app (object that accesses express library)
let app = express();

//Initialize HTTP server
let http = require("http");
let server = http.createServer(app);

//serve static files from public folder in browser
app.use(express.static('public'));

//import socket.io
let io = require('socket.io');
io = new io.Server(server);

//variable to prevent two winners
let gameOver = false;

let waitingPlayer = null;

//listen for new client connection
io.on('connection', (socket) => {
  console.log("A client has connected: " + socket.id);

  // When a second player submits, match them together using waitingPlayer
  socket.on('submitName', (data) => {
    const name = (data && data.playerName) ? String(data.playerName).slice(0, 32) : 'Player';
    console.log('User submitted name:', socket.id, name);

    if (!waitingPlayer) {
      // no one waiting: store this socket as the waiting player
      waitingPlayer = { id: socket.id, name };
      socket.emit('waiting');
      return;
    }

    // pair with the waiting player
    const other = waitingPlayer;
    waitingPlayer = null;
    gameOver = false; // reset game over for new match

    // notify both clients they are matched
    socket.emit('matched', { opponentName: other.name });
    socket.to(other.id).emit('matched', { opponentName: name });

    // countdown is handled client-side
  });

  //Listen for player step updates
  socket.on('stepUpdate', (step) => {
    //Send step to opponent
    socket.broadcast.emit('opponentStep', step);
  });

  //Send message for when a player finishes
  socket.on('ramenComplete', () => {
    console.log("ramenComplete received from: " + socket.id);
    if (gameOver) {
      console.log("Game is already over: " + socket.id);
      return; //No second winner allowed
    }
    gameOver = true;
    console.log("Winner: " + socket.id);
    //tell winner they won
    socket.emit('youWin');
    console.log("Sent youWin to: " + socket.id);
    //tell other player they lost
    socket.broadcast.emit('youLose');
  });

  //Listen for this client to disconnect
  socket.on('disconnect', () => {
    console.log("A client has disconnected: " + socket.id);
    // if the disconnected socket was the waiting player, clear the slot
    if (waitingPlayer && waitingPlayer.id === socket.id) {
      waitingPlayer = null;
    }
  });
});

//Listen for where server is available
//'port' variable allows for deployment
let port = process.env.PORT || 5050;
server.listen(port, () => {
  console.log("App listening at port: " + port);
});