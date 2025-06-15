require('dotenv').config();
const NovaAgent = require('./agent/novaAgent');

async function testAgent() {
    try {
        const nova = new NovaAgent();
        
        // Test a complex task that requires multiple steps
        const task = "Create a note in Notion about my meeting tomorrow at 2 PM, and set a reminder in Telegram 30 minutes before";
        
        console.log('Executing task:', task);
        const result = await nova.executeTask(task);
        console.log('Task result:', result);
        
    } catch (error) {
        console.error('Agent test failed:', error);
    }
}

testAgent(); 