import { getRandomJoke, askChatGPT, getCountryCapital, translateText } from './api.js';

class Bot {
    constructor(name, avatar, commands) {
        this.name = name;
        this.avatar = avatar;
        this.commands = commands;
    }

    async respond(command, args) {
        if (this.commands.hasOwnProperty(command)) {
            if (typeof this.commands[command] === 'function') {
                return await this.commands[command](args);
            }
            return this.commands[command];
        }
        return null;
    }
}

const bots = [
    new Bot('Bot1', 'img/avatar-bot1.jpg', {
        '!bonjour': 'Bonjour',
        '!blague': getRandomJoke,
        'help': 'Voici la liste des commandes disponibles : !bonjour, !blague, !question',
        '!question': (args) => askChatGPT(args.join(' ')),

    }),
    new Bot('Bot2', 'img/avatar-bot2.jpg', {
        '!salut': 'Hello',
        '!capital': () => getCountryCapital('France'),
        'help' : 'Voici la liste des commandes disponibles : !salut,!capital, !question',
        '!question': (args) => askChatGPT(args.join(' ')),

    }),
    new Bot('Bot3', 'img/avatar-bot3.jpg', {
        '!non': 'Oui',
        '!traduction': (args) => translateText(args.join(' ')),
        'help' : 'Voici la liste des commandes disponibles : !non, !traduction, !question',
        '!question': (args) => askChatGPT(args.join(' ')),
    }),
];


const contactList = document.getElementById('contactList');
const chatContainer = document.getElementById('chatContainer');
const messageList = document.getElementById('messageList');
const messageInput = document.getElementById('messageInput');
const sendBtn = document.getElementById('sendBtn');
const botName = document.getElementById('botName');


function renderContacts() {
    bots.forEach((bot, index) => {
        const contactElement = document.createElement('li');
        contactElement.className = 'list-group-item list-group-item-action d-flex align-items-center';

        const avatarElement = document.createElement('img');
        avatarElement.className = 'avatar me-3';
        avatarElement.src = bot.avatar;

        const nameElement = document.createElement('div');
        nameElement.textContent = bot.name;

        contactElement.appendChild(avatarElement);
        contactElement.appendChild(nameElement);
        contactList.appendChild(contactElement);
    });
}

//Gestion des messages
async function sendMessage(text) {
    const messageElement = createMessageElement('Vous', text, true);
    messageList.appendChild(messageElement);

    const [command, ...args] = text.split(' ');

    for (const bot of bots) {
        const response = await bot.respond(command, args);
        if (response) {
            const botMessageElement = createMessageElement(bot.name, response, false, bot.avatar);
            messageList.appendChild(botMessageElement);
        }
    }

    chatContainer.scrollTop = chatContainer.scrollHeight;
    saveMessages();
}

function saveMessages() {
    const messages = [];
    messageList.childNodes.forEach((messageElement) => {
        const sent = messageElement.classList.contains('sent');
        const name = messageElement.querySelector('.message-content > p').textContent;
        const content = messageElement.querySelector('.message-content > p:nth-child(2)').textContent;
        const avatar = messageElement.querySelector('.avatar').src;
        messages.push({ name, content, sent, avatar });
    });
    localStorage.setItem('messages', JSON.stringify(messages));
}

function loadMessages() {
    const messages = JSON.parse(localStorage.getItem('messages')) || [];

    messageList.innerHTML = '';
    messages.forEach((message) => {
        const messageElement = createMessageElement(
            message.name,
            message.content,
            message.sent,
            message.avatar
        );
        messageList.appendChild(messageElement);
    });

    chatContainer.scrollTop = chatContainer.scrollHeight;
}

// Création d'un élément de message
function createMessageElement(name, content, sent = false, avatar = '') {
    const messageElement = document.createElement('li');
    messageElement.className = `message${sent ? ' sent' : ''}`;

    const avatarElement = document.createElement('img');
    avatarElement.className = 'avatar';
    avatarElement.src = avatar || 'img/default-avatar.jpg';

    const contentElement = document.createElement('div');
    contentElement.className = 'message-content';

    const nameElement = document.createElement('p');
    nameElement.textContent = name;
    contentElement.appendChild(nameElement);

    const textElement = document.createElement('p');
    textElement.textContent = content;
    contentElement.appendChild(textElement);

    const timeElement = document.createElement('p');
    timeElement.className = 'message-time';
    timeElement.textContent = new Date().toLocaleTimeString();
    contentElement.appendChild(timeElement);

    messageElement.appendChild(avatarElement);
    messageElement.appendChild(contentElement);

    return messageElement;
}

// Event listeners
sendBtn.addEventListener('click', () => {
    const text = messageInput.value.trim();
    if (text) {
        sendMessage(text);
    }
    messageInput.value = '';
});

messageInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        const text = messageInput.value.trim();
        if (text) {
            sendMessage(text);
        }
        messageInput.value = '';
    }
});

renderContacts();
loadMessages();

