const db = require("../db");

// GET all products
exports.getAll = async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM products ORDER BY id");
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET one product
exports.getOne = async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM products WHERE id=$1", [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ error: "Product not found" });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// CREATE product
exports.create = async (req, res) => {
  const { name, description, price, stock, category_id } = req.body;
  try {
    // Check if category exists
    const categoryCheck = await db.query("SELECT id FROM categories WHERE id=$1", [category_id]);
    if (categoryCheck.rows.length === 0)
      return res.status(400).json({ error: "Category does not exist" });

    const result = await db.query(
      "INSERT INTO products (name, description, price, stock, category_id) VALUES ($1,$2,$3,$4,$5) RETURNING *",
      [name, description, price, stock, category_id]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// UPDATE product
exports.update = async (req, res) => {
  const { name, description, price, stock, category_id } = req.body;
  try {
    // Optional: check category exists
    const categoryCheck = await db.query("SELECT id FROM categories WHERE id=$1", [category_id]);
    if (categoryCheck.rows.length === 0)
      return res.status(400).json({ error: "Category does not exist" });

    const result = await db.query(
      "UPDATE products SET name=$1, description=$2, price=$3, stock=$4, category_id=$5 WHERE id=$6 RETURNING *",
      [name, description, price, stock, category_id, req.params.id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: "Product not found" });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// DELETE product
exports.remove = async (req, res) => {
  try {
    const result = await db.query("DELETE FROM products WHERE id=$1 RETURNING *", [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ error: "Product not found" });
    res.json({ message: "Product deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
