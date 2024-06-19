const socket = io();

const chat = document.getElementById('chat');
const messageInput = document.getElementById('message');

socket.on('receiveMessage', (message) => {
    const messageElement = document.createElement('div');
    messageElement.textContent = message;
    chat.appendChild(messageElement);
    chat.scrollTop = chat.scrollHeight;
});

function sendMessage() {
    const message = messageInput.value;
    if (message.trim() !== '') {
        socket.emit('sendMessage', message);
        messageInput.value = '';
    }
}
