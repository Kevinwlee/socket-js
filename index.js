var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var counter = 0;
app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

app.get('/stats', function(req, res){
  res.sendFile(__dirname + '/stats.html');
});

io.on('connection', function(socket){
  socket.on('chat message', function(msg){
    io.emit('chat message', msg);
    counter ++
    io.emit('counter', counter);
  });
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});
