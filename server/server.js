require("dotenv").config();
const express = require("express");
const client = require("./db");
const users = require("./routes/users");
const products = require("./routes/products");

const app = express();
const port = process.env.PORT;

app.use(express.json());

// Example route to fetch users
app.use("/api", users);
app.use("/api", products);

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
