const express = require('express');
const router = express.Router();
const SystemControl = require('../integrations/systemControl');
const CalendarIntegration = require('../integrations/calendar');
const NotesSystem = require('../integrations/notes');

// Initialize integrations
const systemControl = new SystemControl();
const calendar = new CalendarIntegration();
const notes = new NotesSystem();

// System Control Endpoints
router.post('/system/launch-app', async (req, res) => {
    try {
        const { appName } = req.body;
        const result = await systemControl.launchApp(appName);
        res.json({ success: true, result });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

router.post('/system/screenshot', async (req, res) => {
    try {
        const { outputPath } = req.body;
        const result = await systemControl.takeScreenshot(outputPath);
        res.json({ success: true, result });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

router.get('/system/clipboard', async (req, res) => {
    try {
        const content = await systemControl.getClipboardContent();
        res.json({ success: true, content });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

router.post('/system/clipboard', async (req, res) => {
    try {
        const { content } = req.body;
        const result = await systemControl.setClipboardContent(content);
        res.json({ success: true, result });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

router.post('/system/file', async (req, res) => {
    try {
        const { action, sourcePath, destinationPath } = req.body;
        const result = await systemControl.manageFile(action, sourcePath, destinationPath);
        res.json({ success: true, result });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Calendar Endpoints
router.get('/calendar/events', async (req, res) => {
    try {
        const { timeMin, timeMax, maxResults } = req.query;
        const events = await calendar.listEvents(
            new Date(timeMin),
            new Date(timeMax),
            parseInt(maxResults)
        );
        res.json({ success: true, events });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

router.post('/calendar/events', async (req, res) => {
    try {
        const event = await calendar.createEvent(req.body);
        res.json({ success: true, event });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

router.put('/calendar/events/:eventId', async (req, res) => {
    try {
        const event = await calendar.updateEvent(req.params.eventId, req.body);
        res.json({ success: true, event });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

router.delete('/calendar/events/:eventId', async (req, res) => {
    try {
        const result = await calendar.deleteEvent(req.params.eventId);
        res.json({ success: true, result });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

router.get('/calendar/reminders', async (req, res) => {
    try {
        const { hours } = req.query;
        const reminders = await calendar.getUpcomingReminders(parseInt(hours));
        res.json({ success: true, reminders });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Notes Endpoints
router.post('/notes', async (req, res) => {
    try {
        const { title, content, category } = req.body;
        const note = await notes.createNote(title, content, category);
        res.json({ success: true, note });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

router.put('/notes/:notePath', async (req, res) => {
    try {
        const note = await notes.updateNote(req.params.notePath, req.body.content);
        res.json({ success: true, note });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

router.delete('/notes/:notePath', async (req, res) => {
    try {
        const result = await notes.deleteNote(req.params.notePath);
        res.json({ success: true, result });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

router.get('/notes', async (req, res) => {
    try {
        const { category, query } = req.query;
        const notesList = query 
            ? await notes.searchNotes(query, category)
            : await notes.listNotes(category);
        res.json({ success: true, notes: notesList });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

router.post('/notes/journal', async (req, res) => {
    try {
        const { content, mood, tags } = req.body;
        const entry = await notes.createJournalEntry(content, mood, tags);
        res.json({ success: true, entry });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

router.get('/notes/journal', async (req, res) => {
    try {
        const { startDate, endDate } = req.query;
        const entries = await notes.getJournalEntries(
            new Date(startDate),
            new Date(endDate)
        );
        res.json({ success: true, entries });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Health check endpoint
router.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

module.exports = router; 