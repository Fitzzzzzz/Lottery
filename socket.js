const _socket = require('socket.io');

const socketio = (server) => {
  var io = _socket.listen(server);
  io.on('connection', function(socket) {
    console.log('a user connected');
    socket.on('identify by id', (id) => {
      console.log(`This socket is in room-${id}`);
      socket.join(id, () => {
        console.log('rooms', socket.rooms)
        socket.on('update lottery data', (data) => {
          io.to(id).emit('updateData', 'Lottery data has update!')
        })
      });
      setTimeout(() => {
        io.to(id).emit('identifyById', id)
      }, 2000);      
    });
    socket.on('leave room by id', (id) => {
      socket.leaveAll()
    });
    socket.on('disconnect', () => {
      console.log('a user disconnected')
    })
  });
}

module.exports = socketio;