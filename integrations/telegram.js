const TelegramBot = require('node-telegram-bot-api');
const config = require('./config');

class TelegramIntegration {
    constructor() {
        if (!config.telegram.botToken) {
            throw new Error('Telegram bot token not configured');
        }
        this.bot = new TelegramBot(config.telegram.botToken, { polling: true });
        this.setupCommandHandlers();
    }

    setupCommandHandlers() {
        // Handle /start command
        this.bot.onText(/\/start/, (msg) => {
            const chatId = msg.chat.id;
            this.bot.sendMessage(chatId, 'Hello! I am Nova, your AI assistant. How can I help you today?');
        });

        // Handle /help command
        this.bot.onText(/\/help/, (msg) => {
            const chatId = msg.chat.id;
            const helpText = `
Available commands:
/start - Start the bot
/help - Show this help message
/remind <time> <message> - Set a reminder
/note <message> - Save a note to Notion
            `.trim();
            this.bot.sendMessage(chatId, helpText);
        });
    }

    async sendMessage(message) {
        try {
            if (!config.telegram.chatId) {
                throw new Error('Telegram chat ID not configured');
            }
            await this.bot.sendMessage(config.telegram.chatId, message);
        } catch (error) {
            console.error('Error sending Telegram message:', error);
            throw error;
        }
    }

    async sendReminder(time, message) {
        try {
            const reminderTime = new Date(time);
            const now = new Date();
            const delay = reminderTime.getTime() - now.getTime();

            if (delay < 0) {
                throw new Error('Reminder time must be in the future');
            }

            setTimeout(async () => {
                await this.sendMessage(`🔔 Reminder: ${message}`);
            }, delay);

            return `Reminder set for ${reminderTime.toLocaleString()}`;
        } catch (error) {
            console.error('Error setting reminder:', error);
            throw error;
        }
    }
}

module.exports = TelegramIntegration; 