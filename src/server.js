const express = require('express');
const path = require('path');

const app = express();
const server = require('http').createServer(app);

const io = require('socket.io')(server);
const router = require('./router/routes');

app.use(express.static(path.join(__dirname, 'public')))
app.set('views', path.join(__dirname, 'public'));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
app.use('/', router);

let messages = []

io.on('connection', socket => {
    console.log(`Socket conectado! ${socket.id}`);

    socket.emit('previousMessages', messages);

    socket.on('sendMessage', data => {
        console.log(data);
        messages.push(data);
        socket.broadcast.emit('receivedMessage', data);
    })
})

server.listen(3000, () => {
    console.log('The server is running');
});