// Server entry point
const app = require('./app');
const connectDB = require('./config/db');
const { initVeramo } = require('./config/veramo');
const { PORT } = require('./config/env');

let httpServer;

const start = async () => {
    await connectDB();
    await initVeramo();
    httpServer = app.listen(PORT, () => {
        console.log(`🚀 Server running on port ${PORT}`);
        console.log(`📡 Health check: http://localhost:${PORT}/health`);
        console.log(`📡 API base: http://localhost:${PORT}/api`);
    });
    return httpServer;
};

start().catch((err) => {
    console.error('Failed to start server:', err);
    process.exit(1);
});

process.on('SIGTERM', () => {
    console.log('SIGTERM signal received: closing HTTP server');
    if (httpServer) httpServer.close(() => console.log('HTTP server closed'));
});

module.exports = { start };
