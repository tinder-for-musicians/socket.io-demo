const express = require('express');
const io = require('socket.io')();

const port = 4040;

const app = express();

app.use(express.json());

io.on('connection', (client) => {
    console.log('a user has connected');
    client.on('subscribeToTimer', (interval) => {
        console.log('client is subscribing to timer with interval ', interval);
        setInterval(() => {
            client.emit('timer', new Date());
        }, interval);
    });
    client.on('chatMessage', (msg) => {
        console.log(msg);
        io.emit('chatMessage', msg);
    });
    client.on('disconnect', () => {
        console.log('user disconnected');
    });
});

io.listen(4000);
app.listen(port, () => console.log('Server running on port 4040'));