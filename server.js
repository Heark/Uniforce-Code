var app = require("express")();
var PORT = process.env.PORT || 3000;
console.log(process.env.IP);
var server = app.listen(PORT, function(){
  console.log("Server is on");
});

var io = require("socket.io")(server);

io.on('connection', function(client){
  console.log(client.id + 'has connected!');
  
  client.on('hi', function() {
    console.log(client.id + "said hi!");
  });
});