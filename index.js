var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);



var Canvas = require('canvas')
  , Image = Canvas.Image
  , canvas = new Canvas(500, 500)
  , ctx = canvas.getContext('2d');

var words = {};
var messageNum = 0;

function drawWord(word, fontAddition) {
  colors = ['blue', 'red', 'green', 'orange', 'purple'];
  ctx.fillStyle = colors[Math.floor((Math.random() * 5))];
  fontSize = (15 + fontAddition).toString();
  ctx.font = fontSize + "px Georgia";
  ctx.globalAlpha = words[word] * 0.3;
  if((words[word]*0.3) > 1){
    ctx.globalAlpha = 1;
  }
  x = Math.floor(Math.random() * 300 + 50)
  y = Math.floor(Math.random() * 300 + 50)
  ctx.fillText(word, x, y);
}

function addWord(word){
  if(words.hasOwnProperty(word)){
    words[word]+= 1;
  }
  else{
    words[word] = 1;
  }
}

function drawWordCloud(msg){
  ctx.clearRect(0,0,500,500);
  for(word in words){
    var fontAddition = words[word] * 8;
    drawWord(word, fontAddition);
  }
}

voteCount = 0;

function decideVote(target){
  if(voteCount >= Math.ceil(io.engine.clientsCount/2) ) {
    startNewRound();
    drawWordCloud("msg");
    wordcloud = '<img src="' + canvas.toDataURL() + '" />'
    io.emit('success',target, wordcloud);
    console.log("yay");
  }
  voteCount = 0;
}

function startNewRound(){
  words = {};
  messageNum = 0;
}



app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
  app.use(express.static(__dirname + '/public'));
});


io.on('connection', function(socket){
    socket.on('chat message', function(msg){
    messageNum++;
    addWord(msg);
    drawWordCloud(msg);
    wordcloud = '<img src="' + canvas.toDataURL() + '" />'
    io.emit('chat message', msg, wordcloud, messageNum);
  });
    socket.on('countdown', function(target){
    io.emit('startCountdown', target);
    setTimeout(function() {decideVote(target)}, 6000);
  });
    socket.on('vote', function(){
    voteCount++;
  });
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});
