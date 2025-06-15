const { Client } = require('@notionhq/client');
const config = require('./config');

class NotionIntegration {
    constructor() {
        this.client = new Client({ auth: config.notion.authToken });
        this.databaseId = config.notion.databaseId;
    }

    async queryDatabase() {
        try {
            const response = await this.client.databases.query({
                database_id: this.databaseId
            });
            return response.results;
        } catch (error) {
            console.error('Error querying Notion database:', error);
            throw error;
        }
    }

    async createPage(title, content, properties = {}) {
        try {
            const response = await this.client.pages.create({
                parent: { database_id: this.databaseId },
                properties: {
                    Name: {
                        title: [
                            {
                                text: {
                                    content: title
                                }
                            }
                        ]
                    },
                    ...properties
                },
                children: [
                    {
                        object: 'block',
                        type: 'paragraph',
                        paragraph: {
                            rich_text: [
                                {
                                    type: 'text',
                                    text: {
                                        content: content
                                    }
                                }
                            ]
                        }
                    }
                ]
            });
            return response;
        } catch (error) {
            console.error('Error creating Notion page:', error);
            throw error;
        }
    }

    async searchPages(query) {
        try {
            const response = await this.client.search({
                query: query,
                filter: {
                    property: 'object',
                    value: 'page'
                }
            });
            return response.results;
        } catch (error) {
            console.error('Error searching Notion pages:', error);
            throw error;
        }
    }
}

module.exports = NotionIntegration; 