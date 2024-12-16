require("dotenv").config();
const express = require("express");
const db = require("../db");
const router = express.Router();
const bcrypt = require("bcrypt");

// Get all products
router.get("/products", async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM products");
    res.status(200).json(result.rows);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch products" });
  }
});

// Post a product
router.post("/products", async (req, res) => {
  const { name, category_id, price, stock_quantity, description, image_url } =
    req.body;

  if (!name || !category_id || !price || !stock_quantity) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    const result = await db.query(
      "INSERT INTO products (name, category_id, price, stock_quantity, description, image_url) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
      [name, category_id, price, stock_quantity, description, image_url]
    );

    res
      .status(201)
      .json({ msg: "Product created successfully", product: result.rows[0] });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to create product", details: error.message });
  }
});

module.exports = router;
