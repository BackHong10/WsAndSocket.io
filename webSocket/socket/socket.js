const socketIo = require('socket.io')

exports.webSocket = (server) => {
    const io = socketIo(server, {path : '/socket.io'})

    io.on('connection', (socket) => {
        const req = socket.request
        const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
        console.log('새로운 클라이언트 접속!', ip, socket.id, req.ip);
        socket.on('disconnect', () => { 
            console.log('클라이언트 접속 해제', ip, socket.id);
            clearInterval(socket.interval);
          });
          socket.on('error', (error) => { // 에러 시
            console.error(error);
          });
          socket.on('reply', (data) => { // 클라이언트로부터 메시지
            console.log(data);
          });
          socket.interval = setInterval(() => { // 3초마다 클라이언트로 메시지 전송
            socket.emit('news', 'Hello Socket.IO');
          }, 3000);
    })
}