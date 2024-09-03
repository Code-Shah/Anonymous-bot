
const TelegramBot = require('node-telegram-bot-api');
const token = '7013297460:AAHXBvovHdU0NwKlOMXiXom7g5c1gMToKXU';
const bot = new TelegramBot(token, { polling: true });

// Store user information
const userStore = {};
// Store user states
const userState = {}; // 'active' or 'inactive'

// Command Handler: /start
bot.onText(/\/start/, (msg) => {
    const chatId = msg.chat.id;
    userState[msg.from.id] = 'active'; // Set the user's state to active
    bot.sendMessage(chatId, "Hello! Send me a message and I will forward it to the group.\nUse /exit to stop sending messages.");
});

// Command Handler: /help
bot.onText(/\/help/, (msg) => {
    const chatId = msg.chat.id;
    bot.sendMessage(chatId, "Here's how to use this bot:\n\n/start - Start the bot\n/exit - Stop sending messages\n/help - Get help information\nSend any message after /start to forward it to the group.");
});

// Command Handler: /exit
bot.onText(/\/exit/, (msg) => {
    const chatId = msg.chat.id;
    delete userState[msg.from.id]; // Remove the user's state
    bot.sendMessage(chatId, "You have exited. Use /start to resume.");
});

// Handle private messages and forward them to a group
bot.on('message', (msg) => {
    const chatId = msg.chat.id;
    const userId = msg.from.id;
    console.log(userState[userId])

    // Check if the message is from a private chat
    if (msg.chat.type === 'private') {
        // Check if the user is in active state
        if (userState[userId] === 'active') {
            // Store user information if not already stored
            if (!userStore[userId]) {
                userStore[userId] = {
                    name: `user${Object.keys(userStore).length + 1}`, // Example name assignment
                    id: userId
                };
            }

            const userName = userStore[userId].name;
            const groupChatId = '-1002150245968'; // Replace with your group chat ID

            // Forward the message to the group with the user's name
            bot.sendMessage(groupChatId, `<b>${userName}:</b>\n${msg.text}`, { parse_mode: 'HTML' });
        } else {
            // If the user is not active, send a help message
            bot.sendMessage(chatId, "Please use /start to begin sending messages.");
        }
    }
});

// Handle unknown commands
bot.onText(/\/(.*)/, (msg, match) => {
    const command = match[1];
    if (!['start', 'help', 'exit'].includes(command)) {
        const chatId = msg.chat.id;
        bot.sendMessage(chatId, "Unknown command. Use /help for a list of commands.");
    }
});

// Error handling
bot.on("polling_error", (msg) => console.log(msg));