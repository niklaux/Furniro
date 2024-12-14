// db.js
const { Pool } = require('pg');
require('dotenv').config();

// Check if POSTGRES_URL exists, and throw an error if not
if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL is not set. Make sure the environment variable is defined."
  );
}

// Create a new pool with the specified connection parameters
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false, // Allows self-signed SSL certificates (not recommended for production)
  },
  connectionTimeoutMillis: 20000, // Connection timeout
  idleTimeoutMillis: 60000, // Keep idle connections for 60 seconds
  max: 20, // Maximum number of connections in the pool
});

// Error handler for idle clients
pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
  // You may want to add reconnect logic or other custom handling here
});

// Keep-alive mechanism to prevent idle timeouts
setInterval(() => {
  pool
    .query('SELECT 1')
    .catch((err) => console.error('Keep-alive error:', err));
}, 280000); // Every 4 minutes and 40 seconds

// Export the query function for use in other parts of the app
module.exports = {
  query: async (text, params) => {
    try {
      return await pool.query(text, params);
    } catch (err) {
      console.error('Query error:', err.message);
      // Optional: retry logic or custom handling can be added here
      throw err; // Rethrow the error after logging
    }
  },
};
