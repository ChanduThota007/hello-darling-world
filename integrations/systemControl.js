const { exec } = require('child_process');
const { promisify } = require('util');
const execAsync = promisify(exec);
const clipboardy = require('clipboardy');
const screenshot = require('screenshot-desktop');
const fs = require('fs').promises;
const path = require('path');

class SystemControl {
    constructor() {
        this.appPaths = {
            notepad: 'notepad.exe',
            chrome: 'chrome.exe',
            vscode: 'code.exe',
            // Add more app paths as needed
        };
    }

    async launchApp(appName) {
        try {
            const appPath = this.appPaths[appName.toLowerCase()];
            if (!appPath) {
                throw new Error(`Unknown application: ${appName}`);
            }
            await execAsync(`start ${appPath}`);
            return `Launched ${appName} successfully`;
        } catch (error) {
            console.error(`Error launching ${appName}:`, error);
            throw error;
        }
    }

    async takeScreenshot(outputPath) {
        try {
            const buffer = await screenshot();
            await fs.writeFile(outputPath, buffer);
            return `Screenshot saved to ${outputPath}`;
        } catch (error) {
            console.error('Error taking screenshot:', error);
            throw error;
        }
    }

    async getClipboardContent() {
        try {
            return await clipboardy.read();
        } catch (error) {
            console.error('Error reading clipboard:', error);
            throw error;
        }
    }

    async setClipboardContent(content) {
        try {
            await clipboardy.write(content);
            return 'Clipboard content updated';
        } catch (error) {
            console.error('Error writing to clipboard:', error);
            throw error;
        }
    }

    async manageFile(action, sourcePath, destinationPath = null) {
        try {
            switch (action.toLowerCase()) {
                case 'move':
                    await fs.rename(sourcePath, destinationPath);
                    return `Moved ${sourcePath} to ${destinationPath}`;
                case 'delete':
                    await fs.unlink(sourcePath);
                    return `Deleted ${sourcePath}`;
                case 'copy':
                    await fs.copyFile(sourcePath, destinationPath);
                    return `Copied ${sourcePath} to ${destinationPath}`;
                default:
                    throw new Error(`Unknown file action: ${action}`);
            }
        } catch (error) {
            console.error(`Error performing file ${action}:`, error);
            throw error;
        }
    }

    async executeCommand(command, options = {}) {
        try {
            // Basic security check - prevent dangerous commands
            const dangerousCommands = ['rm', 'del', 'format', 'mkfs', 'dd'];
            if (dangerousCommands.some(cmd => command.toLowerCase().includes(cmd))) {
                throw new Error('Potentially dangerous command blocked');
            }

            const { stdout, stderr } = await execAsync(command, options);
            if (stderr) {
                console.warn('Command stderr:', stderr);
            }
            return stdout;
        } catch (error) {
            console.error('Error executing command:', error);
            throw error;
        }
    }
}

module.exports = SystemControl; 