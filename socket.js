const _socket = require('socket.io');
const MongoClient = require('mongodb').MongoClient;
const mongoEnv = require('./mongoEnv');
const ObjectID = require('mongodb').ObjectID;

const socketio = (server) => {
  var io = _socket.listen(server);
  try {
    (async () => {
      let db = await MongoClient.connect(`${mongoEnv.mongoHost}:${mongoEnv.mongoPort}/${mongoEnv.dbInfo.dbName}`);
      let lotteryCol = await db.collection(mongoEnv.dbInfo.lotteryCol);
      io.on('connection', function(socket) {
        console.log('a user connected');
        socket.on('identify by id', (id) => {
          console.log(`This socket is in room-${id}`);
          socket.join(id, () => {
            console.log('rooms:', socket.rooms);
            socket.room = socket.rooms[Object.keys(socket.rooms)[0]]
            console.log('room:', socket.room)
          });
          setTimeout(() => {
            io.to(id).emit('identifyById', id);
          }, 2000);      
        });
        socket.on('update data', function (data) {
          (async () => {
            let list = await lotteryCol.find({ _id: ObjectID(socket.room) }).toArray();
            let newList = list[0].list;
            data.newData.forEach(item => {
              ++newList[item];
            }); 
            let listUpdate = await lotteryCol.updateOne({ _id: ObjectID(socket.room) }, {
              $set: {
                list: newList
              }
            })
            io.to(socket.room).emit('updateData', newList);
          })();
        })
        socket.on('leave room by id', (id) => {
          socket.leaveAll();
          console.log('socket leave room id ', id);
          console.log(socket.rooms);
        });
        socket.on('disconnect', () => {
          console.log('a user disconnected');
          db.close();
        })
      });
    })()
  } catch (error) {
    console.log(error.stack)
  }
}

module.exports = socketio;