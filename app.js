var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var moment = require('moment');

var counter = 0;
var chats = [];

app.get('/', function(req, res){
  res.sendFile(__dirname + '/stats.html');
});

app.get('/chat', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

app.get('/js', function(req, res){
  res.sendFile(__dirname + '/public/c3.min.js');
});

app.get('/css', function(req, res){
  res.sendFile(__dirname + '/public/c3.min.css');
});

io.on('connection', function(socket){
  
  socket.on('chat-channel', function(msg){
    //capture chant and emit to channel subscribers
    chats.push(msg);
    io.emit('chat-channel', msg);

    //caputer the count and emit count to subscribers
    counter ++
    io.emit('counter-channel', counter);
    
  });
  
  socket.on("start-channel", function(){
    publishData();
  });
  
  function publishData(){
    //load current data
    onRedisEventChannel();
    onRedisStorageChannel(Math.random() * 99);
    onRedisDeviceTypeChannel()
    // reload ever few seconds
    setInterval(function (){
      onRedisEventChannel();
      onRedisStorageChannel(Math.random() * 99);
      onRedisDeviceTypeChannel();
    }, 4000);    
    
  }
  var geofences = ["Geofence"];
  var beacons = ["Beacon"];
  var locations = ["Location"];
  var custom = ["Custom"];
  var xAxis = ["x"];
    
  //Pretend that Redis is 
  function onRedisEventChannel (someRedisData) {

    //Extract data for chart
    var max = 6

    xAxis.push(moment().format("YYYY-MM-DD hh:mm:ss"))
    if (xAxis.length > max) {
      xAxis.splice(1, 1);
    }
    var seed = 49;
    geofences.push(Math.floor(Math.random() * seed));
    if (geofences.length > max) {
      geofences.splice(1, 1);
    }

    beacons.push(Math.floor(Math.random() * seed));
    if (beacons.length > max) {
      beacons.splice(1, 1);
    }
  
    locations.push(Math.floor(Math.random() * seed));  
    if (locations.length > max) {
      locations.splice(1, 1);
    }

    custom.push(Math.floor(Math.random() * seed));
    if (custom.length > max) {
      custom.splice(1, 1);
    }
    
    var columnData = { 
      columns: [
        xAxis,
        geofences,
        beacons,
        locations,
        custom
      ]
    }
        
    //emit data to chanel subscribers
    io.emit('c3-line-channel', columnData);
    
    var barColumnData = { 
      columns: [
        xAxis,
        geofences
      ]
    }
    
    io.emit("c3-bar-channel", barColumnData);
  }
  
  function onRedisStorageChannel(amount) {
    var columnData = {
      columns:[
        ['data', amount]
      ]
    }
    io.emit("c3-guage-channel", columnData);    
  }
  
  function onRedisDeviceTypeChannel(devices){
    var seed = 500;
    var columnData = {
      columns: [
        ['iPhone', Math.floor(Math.random() * seed)],
        ['iPad', Math.floor(Math.random() * seed)],
        ['Android', Math.floor(Math.random() * seed)],
        ['Browser', Math.floor(Math.random() * seed)]        
      ]
    }
    io.emit("c3-donut-channel", columnData);
  }
  
  
});


http.listen(3000, function(){
  console.log('listening on *:3000');
  
});
