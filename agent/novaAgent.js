const { Agent, Task, Crew } = require('crewai');
const NotionIntegration = require('../integrations/notion');
const TelegramIntegration = require('../integrations/telegram');

class NovaAgent {
    constructor() {
        this.notion = new NotionIntegration();
        this.telegram = new TelegramIntegration();
        
        // Define our agents
        this.assistant = new Agent({
            role: 'AI Assistant',
            goal: 'Help users with their tasks and manage their digital life',
            backstory: 'I am Nova, an AI assistant designed to help users manage their tasks, notes, and digital life efficiently.',
            tools: [
                this.notionTool.bind(this),
                this.telegramTool.bind(this),
                this.fileManagementTool.bind(this)
            ]
        });

        this.planner = new Agent({
            role: 'Task Planner',
            goal: 'Break down complex tasks into manageable steps',
            backstory: 'I am an expert at planning and organizing complex tasks into simple, executable steps.',
            tools: [this.planningTool.bind(this)]
        });
    }

    // Tool definitions
    async notionTool(action, content) {
        switch(action) {
            case 'create_note':
                return await this.notion.createPage(content.title, content.body);
            case 'search_notes':
                return await this.notion.searchPages(content.query);
            default:
                throw new Error(`Unknown Notion action: ${action}`);
        }
    }

    async telegramTool(action, content) {
        switch(action) {
            case 'send_message':
                return await this.telegram.sendMessage(content.message);
            case 'set_reminder':
                return await this.telegram.sendReminder(content.time, content.message);
            default:
                throw new Error(`Unknown Telegram action: ${action}`);
        }
    }

    async fileManagementTool(action, content) {
        // This will integrate with your existing fileManager.js
        // Implementation will depend on your fileManager.js structure
        throw new Error('File management tool not implemented yet');
    }

    async planningTool(task) {
        // Break down complex tasks into steps
        return {
            steps: [
                { action: 'analyze', description: 'Understand the task requirements' },
                { action: 'plan', description: 'Create a step-by-step plan' },
                { action: 'execute', description: 'Execute the plan' },
                { action: 'verify', description: 'Verify the results' }
            ]
        };
    }

    async executeTask(userInput) {
        // Create a task
        const task = new Task({
            description: userInput,
            agent: this.assistant
        });

        // Create a crew with our agents
        const crew = new Crew({
            agents: [this.assistant, this.planner],
            tasks: [task],
            verbose: true
        });

        // Execute the task
        try {
            const result = await crew.kickoff();
            return result;
        } catch (error) {
            console.error('Task execution failed:', error);
            throw error;
        }
    }
}

module.exports = NovaAgent; 