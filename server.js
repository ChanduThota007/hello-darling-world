const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const integrationAPI = require('./api/integrationAPI');

// Load environment variables
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors({
    origin: process.env.LOVABLE_ORIGIN || 'https://lovable.dev',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// API Routes
app.use('/api', integrationAPI);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        success: false,
        error: 'Internal Server Error',
        message: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

// Start server
app.listen(port, () => {
    console.log(`Nova Integrations API server running on port ${port}`);
    console.log(`API available at http://localhost:${port}/api`);
    console.log('Available endpoints:');
    console.log('- GET    /api/health');
    console.log('- POST   /api/system/launch-app');
    console.log('- POST   /api/system/screenshot');
    console.log('- GET    /api/system/clipboard');
    console.log('- POST   /api/system/clipboard');
    console.log('- POST   /api/system/file');
    console.log('- GET    /api/calendar/events');
    console.log('- POST   /api/calendar/events');
    console.log('- PUT    /api/calendar/events/:eventId');
    console.log('- DELETE /api/calendar/events/:eventId');
    console.log('- GET    /api/calendar/reminders');
    console.log('- POST   /api/notes');
    console.log('- PUT    /api/notes/:notePath');
    console.log('- DELETE /api/notes/:notePath');
    console.log('- GET    /api/notes');
    console.log('- POST   /api/notes/journal');
    console.log('- GET    /api/notes/journal');
}); 