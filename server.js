const express = require('express');
const http = require('http');
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*' } });

app.get('/', (req, res) => {
    res.send('Serverul de Remote Desktop este activ!');
});

io.on('connection', (socket) => {
    console.log('Un utilizator s-a conectat:', socket.id);

    socket.on('offer', data => socket.broadcast.emit('offer', data));
    socket.on('answer', data => socket.broadcast.emit('answer', data));
    socket.on('ice-candidate', data => socket.broadcast.emit('ice-candidate', data));
    
    // Transmiterea comenzilor de click
    socket.on('remote-command', data => socket.broadcast.emit('remote-command', data));
    
    // LINIA NECESARĂ PENTRU A TRANSMITE IMAGINEA:
    socket.on('screen-data', data => socket.broadcast.emit('screen-data', data));

    socket.on('disconnect', () => {
        console.log('Utilizator deconectat:', socket.id);
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Serverul rulează pe portul ${PORT}`));
