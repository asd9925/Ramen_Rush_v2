//import express
let express = require('express');

//create express app (object that accesses express library)
let app = express();

//Initialize HTTP server
let http = require("http");
let server = http.createServer(app);

//listen for requests (where server is available)
// let server = app.listen(4000,() => {
//     console.log("App is listening at localhost:4000");
// })

//serve static files from public folder in browser
app.use(express.static('public'));

console.log("My socket server is running");

//import socket.io
let io = require('socket.io');
io = new io.Server(server);

//variable to prevent two winners
let gameOver = false;

//listen for new client connection
io.on('connection', (socket) => {
    console.log("A client has connected: " + socket.id);

    //Send emit message for when player finishes
  socket.on('ramenComplete', () => {
    if(gameOver) return; //No second winner allowed
    gameOver = true;
    console.log("Winner: " + socket.id);  
    //tell winner they won
    socket.emit('youWin');
    //tell other player or everyone else they lost
    socket.broadcast.emit('youLose');
  })

//Listen for this client to disconnect
  socket.on('disconnect', () => {
    console.log("A client has disconnected: " + socket.id);
  });
  });

//Listen for where server is available
//'port' variable allows for deployment
let port = process.env.PORT || 5050;
server.listen(port, () => {
  console.log("App listening at port: " + port);
});