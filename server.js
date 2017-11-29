var express = require("express");
var path = require("path");
var app = express();
var bodyParser = require("body-parser");
var session = require('express-session');
var server = app.listen(8000, function() {
 console.log("listening on port 8000");
});
var io = require('socket.io').listen(server);
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/basic_mongoose');

app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
app.use(session({secret: 'codingdojorocks'}));
app.set('views', path.join(__dirname, './views'));
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, './static')));
app.use(express.static(path.join(__dirname, './public/dist')));


var users = [];
io.sockets.on('connection', function (socket) {
    console.log("Client/socket is connected!");
    console.log("Client/socket id is: ", socket.id);
    // all the server socket code goes in here
    socket.on('new_user', function(data){
        var new_user = {
            name: data.user,
            id:socket.id,
        }
        users.push(new_user);
        io.emit('all_user',{res:users});
    })

    socket.on('disconnect', function(){
        var rest_user = users.filter(function(el){
            return el.id != socket.id;
        })
        users = rest_user;
        io.emit('all_user',{res:users});
    })
    

})

app.get('/', function(req, res){
    res.render('index');
})