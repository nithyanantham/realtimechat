$(function () {

    // Prompt for setting a username
    var fromUser = prompt("Enter from user");
    var toUser = prompt("Enter to User");

    $('.fromUser').val(fromUser);
    $('.toUser').val(toUser);

    var connected = false;
    var typing = false;
    var lastTypingTime;
    var $currentInput = $usernameInput.focus();

    var socket = io('http://localhost:1234');

    $(".sendbtn").click(function () {
        var fromUser = $('.fromuser').val();
        var toUser = $('.touser').val();
        var chatText = $('.chattext').val();

        var userMessage = { type: 'Chat', message: chatText };

        var data = { from: fromUser, to: toUser, message: userMessage };

        socket.emit('message', data);
    });

    // Socket events

    socket.on('connect', function (data) {
        console.log(data);
        console.log('connected');
        socket.emit('login', fromUser);
    });
    // Whenever the server emits 'login', log the login message
    socket.on('login', function (data) {
        console.log('connection successfull');
        connected = true;
        // Display the welcome message
        var message = "Welcome to Socket.IO Chat – ";
    });

    socket.on('disconnect', function () {
        console.log('you have been disconnected');
    });

    socket.on('reconnect', function () {
        console.log('you have been reconnected');
        socket.emit('login', fromUser);
    });

    socket.on('reconnect_error', function () {
        console.log('attempt to reconnect has failed');
    });

    socket.on('online', function (data) {
        console.log(data);
        console.log('user online ' + data);
    });

    socket.on('offline', function (data) {
        console.log(data);
        console.log('user offline ' + data);
    });

    socket.on('message', function (data) {
        console.log(data);
    });

});