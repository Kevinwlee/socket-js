var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var moment = require('moment');

var counter = 0;
var data = [];


var startMinute = moment().format("MMDDYYYYHHmm");

data.push(counter);


app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

app.get('/stats', function(req, res){
  res.sendFile(__dirname + '/stats.html');
});

app.get('/js', function(req, res){
  res.sendFile(__dirname + '/public/c3.min.js');
});

app.get('/css', function(req, res){
  res.sendFile(__dirname + '/public/c3.min.css');
});


io.on('connection', function(socket){
  socket.on('chat message', function(msg){
    io.emit('chat message', msg);
    counter ++
    io.emit('counter', counter);

    var minute = moment().format("MMDDYYYYHHmm");
    var d = data.pop()

    if (minute == startMinute) {
      d ++;
      data.push(d);
    
    } else {
      //reset stats
      data.push(d);
      io.emit('epoc-count', data);
      counter = 1;
      startMinute = minute;      
      data.push(counter);            
    }
    
    //build data set and emit

    

    
  });
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});
