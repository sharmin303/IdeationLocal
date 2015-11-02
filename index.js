var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var Canvas = require('canvas')
  , Image = Canvas.Image
  , canvas = new Canvas(500, 500)
  , ctx = canvas.getContext('2d');

function drawWordCloud(word) {
  colors = ['blue', 'red', 'green', 'orange', 'purple'];
  ctx.rotate(Math.random() - 0.5);
  ctx.fillStyle = colors[Math.floor((Math.random() * 5))];
  ctx.font = "17px Georgia";
  ctx.fillText(word, Math.floor(Math.random() * 300), Math.floor(Math.random() * 300));
}


app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

app.get('/canvas', function(req, res){
  
});

io.on('connection', function(socket){
    socket.on('chat message', function(msg){
    drawWordCloud(msg);
    wordcloud = '<img src="' + canvas.toDataURL() + '" />'
    io.emit('chat message', msg, wordcloud);
  });
    socket.on('countdown', function(target){
    io.emit('startCountdown', target);
  });
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});
