require("dotenv").config();
const express = require("express");
const db = require("../db");
const router = express.Router();
const bcrypt = require("bcrypt");

// Get All Users
router.get("/users", async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM users");
    res.status(200).json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).send(error.message);
  }
});

router.post("/users", async (req, res) => {
  const { name, email, password, address, phone_number, user_type } = req.body;

  if (!name || !email || !password || !address || !phone_number || !user_type) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    const emailCheckResult = await db.query(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );

    if (emailCheckResult.rows.length > 0) {
      return res.status(400).json({ error: "Email already exists." });
    }

    const saltRounds = parseInt(process.env.SALT_ROUNDS);
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const result = await db.query(
      "INSERT INTO users (name, email, password, address, phone_number, user_type) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
      [name, email, hashedPassword, address, phone_number, user_type]
    );

    res
      .status(201)
      .json({ msg: "Account successfully created.", data: result.rowCount[0] });
  } catch (error) {
    console.error(error);
    res.status(500).send(error.message);
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "All fields are required." });
  }

  try {
    const result = await db.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    const user = result.rows[0];

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ error: "Invalid Password" });
    }

    
  } catch (error) {
    console.error(error);
    res.status(500).send(error.message);
  }
});

module.exports = router;
