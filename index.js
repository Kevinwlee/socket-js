var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var moment = require('moment');

var counter = 0;
var chats = [];

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

var geofences = ["Geofence"];
var beacons = ["Beacon"];
var locations = ["Location"];
var custom = ["Custom"];
var xAxis = ["x"];
io.on('connection', function(socket){
  
  socket.on('chat_channel', function(msg){
    //capture chant and emit to channel subscribers
    chats.push(msg);
    io.emit('chat_channel', msg);

    //caputer the count and emit count to subscribers
    counter ++
    io.emit('counter_channel', counter);

    //sample: process the data    
    var max = 6

    xAxis.push(moment().format("YYYY-MM-DD hh:mm:ss"))

    if (xAxis.length > max) {
      xAxis.splice(1, 1);
    }
    
    geofences.push(Math.floor(Math.random() * 99));
    
    if (geofences.length > max) {
      geofences.splice(1, 1);
    }

    beacons.push(Math.floor(Math.random() * 99));
    
    if (beacons.length > max) {
      beacons.splice(1, 1);
    }
    
    locations.push(Math.floor(Math.random() * 99));
    
    if (locations.length > max) {
      locations.splice(1, 1);
    }

    custom.push(Math.floor(Math.random() * 99));
    
    if (custom.length > max) {
      custom.splice(1, 1);
    }
    
    var randomData = { 
      columns: [
        xAxis,
        geofences,
        beacons,
        locations,
        custom
      ]
    }
    
    //emit data to chanel subscribers
    io.emit('event_bar_channel', randomData);    
    
  });
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});
