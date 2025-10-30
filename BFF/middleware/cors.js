// CORS Middleware configuration
const corsMiddleware = (req, res, next) => {
  // Set the CORS response headers
  res.setHeader('Access-Control-Allow-Origin', req.headers.origin || 'https://localhost:3000');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, Cookie');
  res.setHeader('Access-Control-Allow-Credentials', 'true'); // 允许发送 Cookie

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  next();
};

module.exports = corsMiddleware;
