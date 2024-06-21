const socket = io('http://192.168.0.139:3000'); 

const output = document.getElementById('output');
const messageInput = document.getElementById('message');
const ctx = document.getElementById('chart').getContext('2d');
let chart;

function textToBinary(text) {
    return text.split('').map(char => {
        return char.charCodeAt(0).toString(2).padStart(8, '0');
    }).join(' ');
}

function binaryToText(binary) {
    return binary.split(' ').map(bin => {
        return String.fromCharCode(parseInt(bin, 2));
    }).join('');
}

function encrypt(text) {
    const ciphertext = CryptoJS.AES.encrypt(text, 'secret key 123').toString();
    return ciphertext;      
}

function decrypt(text) {
    const bytes = CryptoJS.AES.decrypt(text, 'secret key 123');
    const originalText = bytes.toString(CryptoJS.enc.Utf8);
    return originalText;
}

function sendMessage() {
    let message = messageInput.value.trim();
    if (message !== '') {
        outputMessage(`Mensagem inicial: ${message}`);//Mensagem inicial
        
        const encryptedMessage = encrypt(message);//Mensagem criptografada
        outputMessage(`Mensagem criptografada: ${encryptedMessage}`);
        
        const binaryMessage = textToBinary(encryptedMessage);//Mensagem criptografada em binário
        outputMessage(`Mensagem em binário: ${binaryMessage}`);
        
        const pseudoTernaryMessage = pseudoTernary(binaryMessage);//Mensagem criptografada aplicada o algoritmo
        outputMessage(`Enviado: ${pseudoTernaryMessage.toString()}`);
        
        socket.emit('sendMessage', pseudoTernaryMessage);
        messageInput.value = '';

        updateChart(pseudoTernaryMessage);//Faz o gráfico
    }
}

function outputMessage(message) {
    const messageElement = document.createElement('div');
    messageElement.textContent = message;
    output.appendChild(messageElement);
    output.scrollTop = output.scrollHeight;
}

socket.on('receiveMessage', (message) => {
    updateChart(message);
    outputMessage(`Recebido: ${message}`);

    const reversePseudoTernaryMessage = reversePseudoTernary(message);
    outputMessage(`Revertido o algoritmo: ${reversePseudoTernaryMessage}`);

    const textMessage = binaryToText(reversePseudoTernaryMessage);
    outputMessage(`Mensagem criptografada: ${textMessage}`);            
    
    const decryptedMessage = decrypt(textMessage);
    outputMessage(`Mensagem final: ${decryptedMessage}`);
});

function pseudoTernary(binaryMessage) {
    const data = [];
    let polarity = 1;
    binaryMessage.split('').forEach(bit => {
        const value = bit === '1' ? 0 : bit === '0'? polarity : '';
        polarity = -polarity;
        if (value !== ''){data.push(value);}
    });
    return data;
}

function reversePseudoTernary(data){
    let binary = "";
    let count = 0;
    data.forEach(bit => {
        const value = bit === 0 ? '1' : '0'
        binary += value;
        count ++;
        if (count === 8){binary += ' '; count = 0;};
    });
    return binary.trim();
}

function updateChart(data){
    if (chart) {
        chart.destroy();
    }
    chart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: Array.from({ length: data.length }, (_, i) => i + 1),
            datasets: [{
                label: 'Valores Binários Ami-Pseudoternário',
                data: data,
                borderColor: 'rgba(255,0,0,1)',
                borderWidth: 1,
                fill: false,
                stepped: true // Cria a onda quadrada
            }]
        },
        options: {
            scales: {
                x: {
                    ticks: {
                        stepSize: 1
                    }
                },
                y: {
                    min: -1.5,
                    max: 1.5
                }
            }
        }
    });
}
