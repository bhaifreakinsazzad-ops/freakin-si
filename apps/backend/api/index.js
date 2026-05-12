// Vercel serverless entry point — re-exports the Express app from server.js.
// server.js only binds to a port when run directly, so this is safe for serverless.
module.exports = require('../server');
