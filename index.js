const express = require('express');
const bodyParser = require('body-parser');
const TelegramBot = require('node-telegram-bot-api');

const app = express();
const port = process.env.PORT || 3000;

// Replace 'YOUR_BOT_TOKEN' with your actual Telegram bot token
const bot = new TelegramBot('7013297460:AAHXBvovHdU0NwKlOMXiXom7g5c1gMToKXU', { polling: true });

// Store user information
const userStore = {}; // Format: { userId: { name: 'user1', id: 'user1_id' } }

// Listen for private messages
bot.onText(/\/start/, (msg) => {
    const chatId = msg.chat.id;
    console.log(msg)
    bot.sendMessage(chatId, "Hello! Send me a message and I will forward it to the group.");
});

// Handle private messages and forward them to a group
bot.on('message', (msg) => {
    const chatId = msg.chat.id;
    const userId = msg.from.id;

    // Check if the message is from a private chat
    if (msg.chat.type === 'private') {
        // Store user information if not already stored
        if (!userStore[userId]) {
            userStore[userId] = {
                name: `user${Object.keys(userStore).length + 1}`, // Example name assignment
                id: userId
            };
        }

        const userName = userStore[userId].name;
        const groupChatId = '-4583899193'; // Replace with your group chat ID

        // Forward the message to the group with the user's name
        bot.sendMessage(groupChatId, `${userName}: ${msg.text}`);
    }
});
bot.on("polling_error", (msg) => console.log(msg));

// API endpoint to send a message to a specific user


// Start the Express server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
