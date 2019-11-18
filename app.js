var createError = require('http-errors');
var http = require('http');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose = require('mongoose');
var cors = require('cors');
const socketio = require('socket.io');

//import all routers
var indexRouter = require('./routes/index');
var userRouter = require('./routes/user');
var groupRouter = require('./routes/group');

//import all utils
const { getUserLocations, addUserLocation, generateLocationMessage } = require('./utils/messages');
const { addUser, removeUser, getUser, getUsersInRoom } = require('./utils/users');

var app = express();

/**
 * Get port from environment and store in Express.
 */

var port = process.env.PORT || '8000';
app.set('port', port);

/**
 * Create HTTP server.
 */

var server = http.createServer(app);

server.listen(port, () => console.log('API started on port', port));

//for desabling cors issue on frontend
app.use(cors());

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

const io = socketio(server);

//mongodb connection
mongoose.connect('mongodb://dbansal18:dbansal18@ds141434.mlab.com:41434/famecaredb',{ useCreateIndex: true, useNewUrlParser: true, useFindAndModify: false, useUnifiedTopology: true}, () => {
    console.log('connected to mongodb');
});

//use routers on routes
app.use('/api', indexRouter);
app.use('/user', userRouter);
app.use('/group', groupRouter);

io.on('connection', (socket) => {
    console.log('New WebSocket connection')

    socket.on('join', (options, callback) => {
        const { error, user } = addUser({ id: socket.id, ...options })

        const users = getUsersInRoom();

        if (error) {
            return callback(error, users)
        }
        
        io.emit('roomData', {
            users: getUsersInRoom()
        })
        callback(null, users)
    })

    socket.on('sendLocation', (coords, callback) => {
        // const user = getUser(socket.id)
        // io.emit('userLocation', generateLocationMessage(coords.username, coords))
        addUserLocation(coords);
        io.emit('userLocations', getUserLocations());
        callback()
    })

    socket.on('disconnect', () => {
        const user = removeUser(socket.id)
        if (user) {
            // io.emit('message', generateMessage('Admin', `${user.username} has left!`))
            io.emit('roomData', {
                users: getUsersInRoom()
            })
        }
    })

    // socket.on('getusers', () => {

    // })

    // socket.on('join', (options, callback) => {
    //     // console.log('se', JSON.parse(options))
    //     const { error, user } = addUser({ id: socket.id, ...JSON.parse(options) })

    //     if (error) {
    //         return callback(error)
    //     }

    //     socket.join(user.room)

    //     socket.emit('message', generateMessage('Admin', 'Welcome!'))
    //     socket.broadcast.to(user.room).emit('message', generateMessage('Admin', `${user.username} has joined!`))
    //     io.to(user.room).emit('roomData', {
    //         room: user.room,
    //         users: getUsersInRoom(user.room)
    //     })

    //     callback()
    // })

    // socket.on('sendMessage', (message, callback) => {
    //     const user = getUser(socket.id)
    //     const filter = new Filter()

    //     if (filter.isProfane(message)) {
    //         return callback('Profanity is not allowed!')
    //     }

    //     io.to(user.room).emit('message', generateMessage(user.username, message))
    //     callback()
    // })

    // socket.on('sendLocation', (coords, callback) => {
    //     const user = getUser(socket.id)
    //     io.to(user.room).emit('locationMessage', generateLocationMessage(user.username, `https://google.com/maps?q=${coords.latitude},${coords.longitude}`))
    //     callback()
    // })

    // socket.on('disconnect', () => {
    //     const user = removeUser(socket.id)

    //     if (user) {
    //         io.to(user.room).emit('message', generateMessage('Admin', `${user.username} has left!`))
    //         io.to(user.room).emit('roomData', {
    //             room: user.room,
    //             users: getUsersInRoom(user.room)
    //         })
    //     }
    // })
})

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500).json({message: 'Error'});
});

module.exports = app;
