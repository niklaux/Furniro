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

// Get all product categories
router.get("/list-categories", async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM categories");
    res.status(200).json(result.rows);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to catch categories", details: error.message });
  }
});

// Add item to cart
router.post("/cart", async (req, res) => {
  const { user_id, product_id, quantity } = req.body;

  if (!user_id || !product_id || !quantity) {
    return res
      .status(400)
      .json({ error: "User, product, and quantity are required" });
  }

  try {
    const existingItem = await db.query(
      "SELECT * FROM cart WHERE user_id = $1 AND product_id = $2",
      [user_id, product_id]
    );

    if (existingItem.rows.length > 0) {
      await db.query(
        "UPDATE cart SET quantity = quantity + $1 WHERE user_id = $2 AND product_id = $3",
        [quantity, user_id, product_id]
      );
    } else {
      await db.query(
        "INSERT INTO cart (user_id, product_id, quantity) VALUES ($1, $2, $3)",
        [user_id, product_id, quantity]
      );
    }

    res.status(200).json({ msg: "Item added to cart" });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to add item to cart", details: error.message });
  }
});

// Fetch items in the cart for a user
router.get("/cart/:user_id", async (req, res) => {
  const { user_id } = req.params;

  if (!user_id) {
    return res.status(400).json({ error: "User ID is required" });
  }

  try {
    const result = await db.query(
      "SELECT * FROM cart JOIN products ON cart.product_id = products.product_id WHERE cart.user_id = $1",
      [user_id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ msg: "No items found in cart" });
    }

    res.status(200).json(result.rows);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to fetch cart items", details: error.message });
  }
});

// Update quantity of an item in the cart
router.put("/cart", async (req, res) => {
  const { user_id, product_id, quantity } = req.body;

  if (!user_id || !product_id || !quantity) {
    return res
      .status(400)
      .json({ error: "User ID, product ID, and quantity are required" });
  }

  try {
    await db.query(
      "UPDATE cart SET quantity = $1 WHERE user_id = $2 AND product_id = $3",
      [quantity, user_id, product_id]
    );
    res.status(200).json({ msg: "Cart item quantity updated successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to update cart item", details: error.message });
  }
});

// Delete an item from the cart
router.delete("/cart", async (req, res) => {
  const { user_id, product_id } = req.body;

  if (!user_id || !product_id) {
    return res
      .status(400)
      .json({ error: "User ID and product ID are required" });
  }

  try {
    await db.query("DELETE FROM cart WHERE user_id = $1 AND product_id = $2", [
      user_id,
      product_id,
    ]);
    res.status(200).json({ msg: "Cart item deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to delete cart item", details: error.message });
  }
});

module.exports = router;
