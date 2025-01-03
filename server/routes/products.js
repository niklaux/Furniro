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

// Checkout the cart
router.post("/checkout", async (req, res) => {
  const { user_id } = req.body;

  if (!user_id) {
    return res.status(400).json({ error: "User ID is required" });
  }

  try {
    // Fetch the user's cart items
    const cartItems = await db.query(
      "SELECT * FROM cart JOIN products ON cart.product_id = products.product_id WHERE cart.user_id = $1",
      [user_id]
    );

    if (cartItems.rows.length === 0) {
      return res.status(400).json({ error: "No items in the cart" });
    }

    // Calculate the total price
    let totalPrice = 0;
    for (const item of cartItems.rows) {
      totalPrice += item.price * item.quantity;
    }

    // Create the order
    const result = await db.query(
      "INSERT INTO orders (user_id, order_date, status, total_price) VALUES ($1, NOW(), 'pending', $2) RETURNING order_id",
      [user_id, totalPrice]
    );

    const orderId = result.rows[0].order_id;

    // Create order items for each product in the cart
    for (const item of cartItems.rows) {
      await db.query(
        "INSERT INTO order_items (order_id, product_id, quantity, price_at_purchase) VALUES ($1, $2, $3, $4)",
        [orderId, item.product_id, item.quantity, item.price]
      );

      // Update the product stock
      await db.query(
        "UPDATE products SET stock_quantity = stock_quantity - $1 WHERE product_id = $2",
        [item.quantity, item.product_id]
      );
    }

    // Clear the user's cart
    await db.query("DELETE FROM cart WHERE user_id = $1", [user_id]);

    res.status(200).json({ msg: "Checkout successful", order_id: orderId });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "Failed to process checkout", details: error.message });
  }
});

// Route to fetch orders for a user
router.get("/orders/:userId", async (req, res) => {
  const { userId } = req.params;

  if (!userId) {
    return res.status(400).json({ error: "User ID is required" });
  }

  try {
    console.log(`Fetching orders for user ID: ${userId}`);

    // Fetch orders for the user from the database using raw SQL
    const result = await db.query(
      "SELECT * FROM orders WHERE user_id = $1 ORDER BY order_date DESC",
      [userId]
    );

    console.log("Query executed successfully, result:", result);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "No orders found." });
    }

    res.status(200).json(result.rows); // Send orders as response
  } catch (error) {
    console.error("Error fetching orders:", error);
    return res.status(500).json({
      message: "Failed to fetch orders",
      error: error.message,
    });
  }
});

// Fetch order items with product details per order batch
router.get("/order-items/:orderId", async (req, res) => {
  const { orderId } = req.params;

  if (!orderId) {
    return res.status(400).json({ msg: "Order ID is required" });
  }

  try {
    const query = `
      SELECT 
        oi.order_id,
        oi.product_id,
        oi.quantity,
        oi.price_at_purchase,
        p.name AS product_name,
        p.description AS product_description,
        p.image_url AS product_image,
        p.price AS current_price
      FROM order_items oi
      JOIN products p ON oi.product_id = p.product_id
      WHERE oi.order_id = $1
    `;

    const result = await db.query(query, [orderId]);

    if (result.rows.length === 0) {
      return res.status(404).json({ msg: "No items found for this order." });
    }

    res.status(200).json(result.rows);
  } catch (error) {
    return res
      .status(500)
      .json({ msg: "Failed to fetch order items.", error: error.message });
  }
});

module.exports = router;
