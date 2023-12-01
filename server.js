var express = require('express');  // express 불러오기
var app = require('express')();
var server = require('http').createServer(app);
// http server를 socket.io server로 upgrade한다
var io = require('socket.io')(server);

app.use(express.static('dist'));
app.use(express.static('src'));
// localhost:3000으로 서버에 접속하면 클라이언트로 index.html을 전송한다
app.get('/', function(req, res) {
  res.sendFile(__dirname + 'src/index.html');
});

// namespace /chat에 접속한다.
var chat = io.of('/chat').on('connection', function(socket) {
  socket.on('chat message', function(data){
    console.log('클라이언트로부터의 메시지: ', data);
    var buttonValue = data.value;

    // 방 이름은 "room" + 버튼 값으로 지정
    var room = "room" + buttonValue;

    // room에 join한다
    socket.join(room);
    // room에 join되어 있는 클라이언트에게 메시지를 전송한다
    chat.to(room).emit('chat message', data);
  });
});

server.listen(3000, function() {
  console.log('Socket IO server listening on port 3000');
});