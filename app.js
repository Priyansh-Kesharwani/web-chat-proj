// REQUIRE MODULES
// ===============
var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var methodOverride = require("method-override");
var cors = require("cors");
const hbs = require('hbs')
const server = require("http").createServer(app);
const io = require("socket.io")(server);
const path = require('path')
const Filter = require('bad-words')
const { generateMessage, generateLocationMessage } = require('./utils/messages')
const { addUser, removeUser, getUser, getUsersInRoom } = require('./utils/roomusers')
const html = require('html')
const viewsPath = path.join(__dirname, '/views')
// BASIC SETTINGS
// ==============

app.use(express.static(path.join(__dirname,'/public')));
app.use("/", express.static(__dirname + "/views"));
app.set("view engine", "hbs");
// app.set('view engine', 'html');



app.set('views', viewsPath)
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(methodOverride("_method"));
app.use(cors());

mongoose.connect('mongodb+srv://priyansh:lWSngZldaGp6j29p@cluster0.bgf0oag.mongodb.net/?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: true,
    useUnifiedTopology: true,
    
})
// var currentUser = "";
// // WORKING WITH SOCKETS
// var count = 0;

io.on('connection', (socket) => {
  console.log('New WebSocket connection')

  socket.on('join', (options, callback) => {
      const { error, user } = addUser({ id: socket.id, ...options })

      if (error) {
          return callback(error)
      }

      socket.join(user.room)

      socket.emit('message', generateMessage('Admin', 'Welcome!'))
      socket.broadcast.to(user.room).emit('message', generateMessage('Admin', `${user.username} has joined!`))
      io.to(user.room).emit('roomData', {
          room: user.room,
          users: getUsersInRoom(user.room)
      })


      callback()
  })

  socket.on('sendMessage', (message, callback) => {
      const user = getUser(socket.id)
      const filter = new Filter()

      if (filter.isProfane(message)) {
          return callback('Profanity is not allowed!')
      }

      io.to(user.room).emit('message', generateMessage(user.username, message))
      callback()
  })

  socket.on('sendLocation', (coords, callback) => {
      const user = getUser(socket.id)
      io.to(user.room).emit('locationMessage', generateLocationMessage(user.username, `https://google.com/maps?q=${coords.latitude},${coords.longitude}`))
      callback()
  })

  socket.on('disconnect', () => {
      const user = removeUser(socket.id)

      if (user) {
          io.to(user.room).emit('message', generateMessage('Admin', `${user.username} has left!`))
          io.to(user.room).emit('roomData', {
              room: user.room,
              users: getUsersInRoom(user.room)
          })
      }
  })
})



app.get("/", (req, res) => {
  res.render("index.hbs");
});

app.get("/home", (res, req)=>{
  res.render("home.hbs");
});

app.get('/signin', (req, res) => {
  res.render('signin.hbs')
})


app.get('/signup', (req, res) => {
  res.render('signup.hbs')
})

app.get("/chat" ,(req,res) => {
  res.render("chat.hbs")
})

var usersRoute = require('./routes/users');
app.use('/routes',usersRoute);



// LISTENING TO SERVER
// ===================
const { PORT=3000, LOCAL_ADDRESS='0.0.0.0' } = process.env
server.listen(PORT, LOCAL_ADDRESS, () => {
  const address = server.address();
  console.log('server listening at', address);
});
