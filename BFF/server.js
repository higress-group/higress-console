const app = require('./app');

// Set the port and address
const PORT = process.env.BFF_PORT || 3001;
const HOST = process.env.BFF_HOST || 'localhost';

// Start the server
const server = app.listen(PORT, HOST, () => {
  console.log('[BFF] Server started successfully');
  console.log(`[BFF] Listening address: http://${HOST}:${PORT}`);
});

server.on('error', (err) => {
  console.error('[BFF] Server error:', err);
});

// Close the server
process.on('SIGINT', () => {
  console.log('\n[BFF] Closing the server...');
  server.close(() => {
    console.log('[BFF] Server closed');
    process.exit(0);
  });
});
