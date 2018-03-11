const _socket = require('socket.io');

const socketio = (server) => {
  var io = _socket.listen(server);
  io.on('connection', function(socket) {
    console.log('a user connected');
    setTimeout(() => {
      socket.emit('newChart', 'This is a new chart.')
    }, 3000);
    socket.on('newChart', (data) => {
      io.sockets.emit('newChart', data)
    })
    socket.on('disconnect', () => {
      console.log('a user disconnected')
    })
  })
  setTimeout(() => {
    io.sockets.emit('refresh', 'All client refresh.')
  }, 10000);
}

module.exports = socketio;