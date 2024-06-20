const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(express.static('client'));

io.on('connection', (socket) => {
    console.log('Novo cliente conectado');

    socket.on('sendMessage', (message) => {
        console.log('Mensagem recebida do cliente:', message);
        socket.broadcast.emit('receiveMessage', message);
    });

    socket.on('disconnect', () => {
        console.log('Cliente desconectado');
    });
});

const PORT = process.env.PORT || 3000;
const IP_ADDRESS = '127.27.236.14'; // Escuta em todas as interfaces de rede

server.listen(PORT, () => {
    console.log(`Servidor rodando em http://${IP_ADDRESS}:${PORT}`);
});
