const db = require("../db");

// GET all users
exports.getAll = async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM users ORDER BY id");
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET one user
exports.getOne = async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM users WHERE id=$1", [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ error: "User not found" });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// CREATE user
exports.create = async (req, res) => {
  const { email, password, role_id } = req.body;
  try {
    const result = await db.query(
      "INSERT INTO users (email, password, role_id) VALUES ($1,$2,$3) RETURNING *",
      [email, password, role_id]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// UPDATE user
exports.update = async (req, res) => {
  const { email, password, role_id } = req.body;
  try {
    const result = await db.query(
      "UPDATE users SET email=$1, password=$2, role_id=$3 WHERE id=$4 RETURNING *",
      [email, password, role_id, req.params.id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: "User not found" });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// DELETE user
exports.remove = async (req, res) => {
  try {
    const result = await db.query("DELETE FROM users WHERE id=$1 RETURNING *", [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ error: "User not found" });
    res.json({ message: "User deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
