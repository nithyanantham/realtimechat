var HashMap = require('hashmap');

var app = require('http').createServer();
var io = require('socket.io')(app);

app.listen('1234');

var users = new HashMap();

//map.set("username","socketid");
//map.get("username");
//map.delete("username");

io.sockets.on('connection', function (socket) {
    console.log(socket.id);

    socket.on('login', function (data) {

        users.set(data, socket.id);

        io.sockets.emit('online', data);

        console.log('User - ' + data + ' ' + socket.id + ' logged in!');
    });

    // User message transfer.
    socket.on('message', function (data) {

        //console.log(data);

        var currentuser = data.from;
        var otheruser = data.to;
        var otheruserid = users.get(otheruser);

        //console.log(otheruserid);
        if (users.has(currentuser) && users.has(otheruser)) {
            socket.to(otheruserid).emit('message', data);
        }
    });

    // User Disconnect from Server
    socket.on('disconnect', function (data) {

        //console.log(data);
        var userid = users.search(socket.id);

        //console.log(userid);

        // Remove the user from users List
        if (userid) {
            users.delete(userid);

            console.log('User - ' + userid + ' logged out!');
            io.sockets.emit('offline', userid);
        }
    });

});