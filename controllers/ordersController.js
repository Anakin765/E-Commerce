const db = require("../db");

// GET all orders
exports.getAll = async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM orders ORDER BY id");
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET one order
exports.getOne = async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM orders WHERE id=$1", [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ error: "Order not found" });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// CREATE order
exports.create = async (req, res) => {
  const { customer_id, address_id, total_amount, status } = req.body;
  try {
    const result = await db.query(
      "INSERT INTO orders (customer_id, address_id, total_amount, status) VALUES ($1,$2,$3,$4) RETURNING *",
      [customer_id, address_id, total_amount, status]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// UPDATE order
exports.update = async (req, res) => {
  const { customer_id, address_id, total_amount, status } = req.body;
  try {
    const result = await db.query(
      "UPDATE orders SET customer_id=$1, address_id=$2, total_amount=$3, status=$4 WHERE id=$5 RETURNING *",
      [customer_id, address_id, total_amount, status, req.params.id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: "Order not found" });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// DELETE order
exports.remove = async (req, res) => {
  try {
    const result = await db.query("DELETE FROM orders WHERE id=$1 RETURNING *", [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ error: "Order not found" });
    res.json({ message: "Order deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
