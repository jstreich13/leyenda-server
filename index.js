require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();
const PORT = process.env.port || 8080;
const userRoutes = require("./routes/users");

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send(`<h1>Welcome to my Express App</h1>`);
});

// Routes
app.use("/api/users", userRoutes);

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
