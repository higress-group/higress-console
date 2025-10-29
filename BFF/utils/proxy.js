const http = require('http');
const { URL } = require('url');

/**
 * Parameter definition for proxying requests to the backend service
 * @param {string} path
 * @param {string} method
 * @param {Object} headers
 * @param {string} body
 * @param {string} backendBaseUrl
 * @returns {Promise<Object>}
 */

// Define the core function proxyRequest
const proxyRequest = (path, method, headers, body) => {
  // Set the backend URL (self-hosted server address)
  const backendBaseUrl = 'http://demo.higress.io';

  return new Promise((resolve, reject) => {
    try {
      // Configure the complete URL
      const backendURL = new URL(path, backendBaseUrl);

      // Create a proxy request
      const proxyReq = http.request(
        backendURL,
        {
          method,
          headers: {
            'Content-Type': 'application/json',
            'Content-Length': body ? Buffer.byteLength(body) : 0,
            ...headers,
          },
        },
        (backendRes) => {
          // Set the response header
          let data = '';
          backendRes.on('data', (chunk) => {
            data += chunk;
          });

          // Listen for the response to end
          backendRes.on('end', () => {
            resolve({
              statusCode: backendRes.statusCode || 500,
              headers: backendRes.headers, // Set the response header, directly from the backend
              data, // Set the response body
            });
          });
        },
      );

      proxyReq.on('error', (err) => {
        console.error('[BFF Proxy] Error requesting the backend:', err);
        reject(new Error('Backend service unavailable'));
      });

      // If the request body exists, write the request body and send it
      if (body) proxyReq.write(body);
      proxyReq.end();
    } catch (err) {
      console.error('[BFF Proxy] Internal error:', err);
      reject(err);
    }
  });
};

module.exports = {
  proxyRequest,
};
