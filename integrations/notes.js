const fs = require('fs').promises;
const path = require('path');
const config = require('./config');

class NotesSystem {
    constructor() {
        this.notesDir = path.join(process.cwd(), 'notes');
        this.journalsDir = path.join(this.notesDir, 'journals');
        this.initializeDirectories();
    }

    async initializeDirectories() {
        try {
            await fs.mkdir(this.notesDir, { recursive: true });
            await fs.mkdir(this.journalsDir, { recursive: true });
        } catch (error) {
            console.error('Error initializing notes directories:', error);
            throw error;
        }
    }

    async createNote(title, content, category = 'general') {
        try {
            const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
            const filename = `${timestamp}-${title.toLowerCase().replace(/\s+/g, '-')}.md`;
            const categoryDir = path.join(this.notesDir, category);
            
            await fs.mkdir(categoryDir, { recursive: true });
            
            const noteContent = `# ${title}\n\nCreated: ${new Date().toLocaleString()}\n\n${content}`;
            const filePath = path.join(categoryDir, filename);
            
            await fs.writeFile(filePath, noteContent, 'utf8');
            return {
                title,
                category,
                path: filePath,
                created: new Date(),
                content
            };
        } catch (error) {
            console.error('Error creating note:', error);
            throw error;
        }
    }

    async updateNote(notePath, newContent) {
        try {
            const content = await fs.readFile(notePath, 'utf8');
            const lines = content.split('\n');
            
            // Preserve the title and creation date
            const title = lines[0].replace('# ', '');
            const created = lines[1].replace('Created: ', '');
            
            const updatedContent = `# ${title}\nCreated: ${created}\n\nLast Updated: ${new Date().toLocaleString()}\n\n${newContent}`;
            await fs.writeFile(notePath, updatedContent, 'utf8');
            
            return {
                title,
                path: notePath,
                updated: new Date(),
                content: newContent
            };
        } catch (error) {
            console.error('Error updating note:', error);
            throw error;
        }
    }

    async deleteNote(notePath) {
        try {
            await fs.unlink(notePath);
            return `Note deleted: ${notePath}`;
        } catch (error) {
            console.error('Error deleting note:', error);
            throw error;
        }
    }

    async listNotes(category = null) {
        try {
            const searchDir = category ? path.join(this.notesDir, category) : this.notesDir;
            const notes = [];
            
            async function scanDirectory(dir) {
                const entries = await fs.readdir(dir, { withFileTypes: true });
                
                for (const entry of entries) {
                    const fullPath = path.join(dir, entry.name);
                    
                    if (entry.isDirectory()) {
                        if (dir === this.notesDir) { // Only scan first level categories
                            await scanDirectory.call(this, fullPath);
                        }
                    } else if (entry.name.endsWith('.md')) {
                        const content = await fs.readFile(fullPath, 'utf8');
                        const lines = content.split('\n');
                        const title = lines[0].replace('# ', '');
                        const created = lines[1].replace('Created: ', '');
                        
                        notes.push({
                            title,
                            category: path.relative(this.notesDir, path.dirname(fullPath)),
                            path: fullPath,
                            created: new Date(created),
                            content: lines.slice(4).join('\n') // Skip header
                        });
                    }
                }
            }
            
            await scanDirectory.call(this, searchDir);
            return notes.sort((a, b) => b.created - a.created);
        } catch (error) {
            console.error('Error listing notes:', error);
            throw error;
        }
    }

    async createJournalEntry(content, mood = null, tags = []) {
        try {
            const date = new Date();
            const filename = `${date.toISOString().split('T')[0]}.md`;
            const filePath = path.join(this.journalsDir, filename);
            
            let journalContent = `# Journal Entry - ${date.toLocaleDateString()}\n\n`;
            journalContent += `Time: ${date.toLocaleTimeString()}\n`;
            if (mood) journalContent += `Mood: ${mood}\n`;
            if (tags.length > 0) journalContent += `Tags: ${tags.join(', ')}\n`;
            journalContent += '\n' + content;
            
            // Append to existing journal entry if it exists
            try {
                const existingContent = await fs.readFile(filePath, 'utf8');
                journalContent = existingContent + '\n\n---\n\n' + journalContent;
            } catch (error) {
                // File doesn't exist, which is fine
            }
            
            await fs.writeFile(filePath, journalContent, 'utf8');
            return {
                date,
                mood,
                tags,
                path: filePath,
                content
            };
        } catch (error) {
            console.error('Error creating journal entry:', error);
            throw error;
        }
    }

    async searchNotes(query, category = null) {
        try {
            const notes = await this.listNotes(category);
            const searchTerms = query.toLowerCase().split(' ');
            
            return notes.filter(note => {
                const searchableText = `${note.title} ${note.content}`.toLowerCase();
                return searchTerms.every(term => searchableText.includes(term));
            });
        } catch (error) {
            console.error('Error searching notes:', error);
            throw error;
        }
    }

    async getJournalEntries(startDate, endDate) {
        try {
            const entries = [];
            const files = await fs.readdir(this.journalsDir);
            
            for (const file of files) {
                if (!file.endsWith('.md')) continue;
                
                const fileDate = new Date(file.replace('.md', ''));
                if (fileDate >= startDate && fileDate <= endDate) {
                    const content = await fs.readFile(path.join(this.journalsDir, file), 'utf8');
                    const lines = content.split('\n');
                    
                    // Parse journal entries
                    let currentEntry = null;
                    for (const line of lines) {
                        if (line.startsWith('# Journal Entry -')) {
                            if (currentEntry) entries.push(currentEntry);
                            currentEntry = {
                                date: new Date(line.replace('# Journal Entry - ', '')),
                                content: '',
                                mood: null,
                                tags: []
                            };
                        } else if (currentEntry) {
                            if (line.startsWith('Mood:')) {
                                currentEntry.mood = line.replace('Mood: ', '');
                            } else if (line.startsWith('Tags:')) {
                                currentEntry.tags = line.replace('Tags: ', '').split(', ');
                            } else if (!line.startsWith('Time:') && line !== '---') {
                                currentEntry.content += line + '\n';
                            }
                        }
                    }
                    if (currentEntry) entries.push(currentEntry);
                }
            }
            
            return entries.sort((a, b) => b.date - a.date);
        } catch (error) {
            console.error('Error getting journal entries:', error);
            throw error;
        }
    }
}

module.exports = NotesSystem; 