const express = require('express');

// Middleware for handling cross - domain requests (CORS)
const corsMiddleware = require('./middleware/cors');

// Middleware for production environment security
const helmet = require('helmet');
const compression = require('compression');
const rateLimit = require('express-rate-limit');

// Create express application
const app = express();

// Production environment security configuration
if (process.env.NODE_ENV === 'production') {
  app.use(helmet({
    contentSecurityPolicy: false,
    crossOriginEmbedderPolicy: false,
  }));

  // Compress responses
  app.use(compression());

  // Rate limiting configuration
  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 150,
    message: {
      code: 429,
      msg: 'Request too frequent, please try again later',
    },
  });
  app.use(limiter);
}

app.use(express.json({ limit: '10mb' }));
app.use(express.raw({ type: 'application/json', limit: '10mb' }));
app.use(corsMiddleware);

app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// Import all routes
app.use('/', require('./routes'));

app.use('*', (req, res) => {
  res.status(404).json({ code: 404, msg: 'Interface not found' });
});

app.use((err, req, res) => {
  console.error('[BFF] Server error:', err);
  res.status(500).json({ code: 500, msg: 'BFF internal error' });
});

module.exports = app;
