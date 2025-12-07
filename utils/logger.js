const pool = require("../db"); 

function logError({ error_type, message, endpoint, user_id }) {
  pool.query(
    `INSERT INTO logs (error_type, message, endpoint, user_id)
     VALUES ($1, $2, $3, $4)`,
    [error_type, message, endpoint, user_id],
    (err, res) => {
      if (err) console.error("Failed to log error:", err);
    }
  );
}

module.exports = logError;
