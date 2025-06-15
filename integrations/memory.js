const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const config = require('./config');

class MemorySystem {
    constructor() {
        this.db = new sqlite3.Database(config.storage.dbPath);
        this.initializeDatabase();
    }

    async initializeDatabase() {
        const queries = [
            `CREATE TABLE IF NOT EXISTS user_preferences (
                key TEXT PRIMARY KEY,
                value TEXT,
                updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )`,
            `CREATE TABLE IF NOT EXISTS session_history (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                session_id TEXT,
                action_type TEXT,
                content TEXT,
                timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
            )`,
            `CREATE TABLE IF NOT EXISTS patterns (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                pattern_type TEXT,
                pattern_data TEXT,
                frequency INTEGER DEFAULT 1,
                last_used DATETIME DEFAULT CURRENT_TIMESTAMP
            )`,
            `CREATE TABLE IF NOT EXISTS custom_skills (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT UNIQUE,
                description TEXT,
                code TEXT,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                last_used DATETIME DEFAULT CURRENT_TIMESTAMP
            )`
        ];

        for (const query of queries) {
            await this.runQuery(query);
        }
    }

    runQuery(query, params = []) {
        return new Promise((resolve, reject) => {
            this.db.run(query, params, function(err) {
                if (err) reject(err);
                else resolve(this);
            });
        });
    }

    async getUserPreference(key) {
        return new Promise((resolve, reject) => {
            this.db.get(
                'SELECT value FROM user_preferences WHERE key = ?',
                [key],
                (err, row) => {
                    if (err) reject(err);
                    else resolve(row ? JSON.parse(row.value) : null);
                }
            );
        });
    }

    async setUserPreference(key, value) {
        const serializedValue = JSON.stringify(value);
        await this.runQuery(
            'INSERT OR REPLACE INTO user_preferences (key, value, updated_at) VALUES (?, ?, CURRENT_TIMESTAMP)',
            [key, serializedValue]
        );
    }

    async logSessionAction(sessionId, actionType, content) {
        await this.runQuery(
            'INSERT INTO session_history (session_id, action_type, content) VALUES (?, ?, ?)',
            [sessionId, actionType, JSON.stringify(content)]
        );
    }

    async getRecentSessions(limit = 10) {
        return new Promise((resolve, reject) => {
            this.db.all(
                'SELECT * FROM session_history ORDER BY timestamp DESC LIMIT ?',
                [limit],
                (err, rows) => {
                    if (err) reject(err);
                    else resolve(rows.map(row => ({
                        ...row,
                        content: JSON.parse(row.content)
                    })));
                }
            );
        });
    }

    async recordPattern(patternType, patternData) {
        await this.runQuery(
            `INSERT INTO patterns (pattern_type, pattern_data, last_used)
             VALUES (?, ?, CURRENT_TIMESTAMP)
             ON CONFLICT(pattern_type, pattern_data) 
             DO UPDATE SET frequency = frequency + 1, last_used = CURRENT_TIMESTAMP`,
            [patternType, JSON.stringify(patternData)]
        );
    }

    async getCommonPatterns(patternType, limit = 5) {
        return new Promise((resolve, reject) => {
            this.db.all(
                'SELECT * FROM patterns WHERE pattern_type = ? ORDER BY frequency DESC, last_used DESC LIMIT ?',
                [patternType, limit],
                (err, rows) => {
                    if (err) reject(err);
                    else resolve(rows.map(row => ({
                        ...row,
                        pattern_data: JSON.parse(row.pattern_data)
                    })));
                }
            );
        });
    }

    async registerCustomSkill(name, description, code) {
        await this.runQuery(
            'INSERT INTO custom_skills (name, description, code) VALUES (?, ?, ?)',
            [name, description, code]
        );
    }

    async getCustomSkill(name) {
        return new Promise((resolve, reject) => {
            this.db.get(
                'SELECT * FROM custom_skills WHERE name = ?',
                [name],
                (err, row) => {
                    if (err) reject(err);
                    else resolve(row);
                }
            );
        });
    }

    async updateSkillUsage(name) {
        await this.runQuery(
            'UPDATE custom_skills SET last_used = CURRENT_TIMESTAMP WHERE name = ?',
            [name]
        );
    }

    async close() {
        return new Promise((resolve, reject) => {
            this.db.close(err => {
                if (err) reject(err);
                else resolve();
            });
        });
    }
}

module.exports = MemorySystem; 