import dotenv from 'dotenv';
import app from './app.js';

dotenv.config();

const PORT = process.env.PORT || 3000;
const NODE_ENV = process.env.NODE_ENV || 'development';

const server = app.listen(PORT, () => {
    console.log(`
╔════════════════════════════════════════════════════╗
║   🚀 Research Network Backend                     ║
║   📡 Port: ${PORT}                                    ║
║   🌍 Environment: ${NODE_ENV}                  ║
║   ✅ API: http://localhost:${PORT}/api              ║
╚════════════════════════════════════════════════════╝
  `);
});

process.on('SIGTERM', () => {
    console.log('SIGTERM signal received: closing HTTP server');
    server.close(() => {
        console.log('HTTP server closed');
        process.exit(0);
    });
});

process.on('SIGINT', () => {
    console.log('SIGINT signal received: closing HTTP server');
    server.close(() => {
        console.log('HTTP server closed');
        process.exit(0);
    });
});