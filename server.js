var app = require("express")();
var PORT = process.env.PORT || 3000;
console.log(process.env.IP);
var server = app.listen(PORT, function(){
  console.log("Server is on");
});

var io = require("socket.io")(server);
var connectCounter = 0;
io.on('connection', function(client){
  console.log(client.id + ' has connected!');

  client.emit('isconnected');

  client.on('hi', function() {
    client.emit('hi-too');
  });

  client.on('new-connection,' function(){
    connectCounter++
  })

  client.on('lost-connection', function(){
    connectCounter--
  })

  client.on('get-players-online', function(){
    return connectCounter;
  })
});
