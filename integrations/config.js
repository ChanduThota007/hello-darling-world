// Integration configuration and secrets management
const config = {
    notion: {
        authToken: process.env.NOTION_AUTH_TOKEN || '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',
        databaseId: process.env.NOTION_DATABASE_ID || '2128d94745cf800bb6dfc528311875a8'
    },
    telegram: {
        botToken: process.env.TELEGRAM_BOT_TOKEN,
        chatId: process.env.TELEGRAM_CHAT_ID
    },
    google: {
        clientId: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        redirectUri: process.env.GOOGLE_REDIRECT_URI || 'http://localhost:3000/oauth2callback'
    },
    storage: {
        // SQLite database path for long-term storage
        dbPath: process.env.DB_PATH || './nova.db'
    }
};

module.exports = config; 