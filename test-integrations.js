require('dotenv').config();
const NotionIntegration = require('./integrations/notion');
const TelegramIntegration = require('./integrations/telegram');

async function testIntegrations() {
    try {
        // Test Notion Integration
        console.log('Testing Notion Integration...');
        const notion = new NotionIntegration();
        const pages = await notion.queryDatabase();
        console.log('Notion pages:', pages.length);

        // Test Telegram Integration
        console.log('\nTesting Telegram Integration...');
        const telegram = new TelegramIntegration();
        await telegram.sendMessage('🔔 Nova Integration Test: Telegram is working!');
        console.log('Telegram message sent successfully');

        // Test Reminder
        const reminderTime = new Date(Date.now() + 60000); // 1 minute from now
        await telegram.sendReminder(reminderTime, 'This is a test reminder');
        console.log('Reminder set successfully');

    } catch (error) {
        console.error('Integration test failed:', error);
    }
}

testIntegrations(); 