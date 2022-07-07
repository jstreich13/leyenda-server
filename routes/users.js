const express = require("express");
const router = express.Router();
const knex = require("../knexConfig");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const authenticate = require("../middleware/authenticate");

// ## POST /api/users/register

// - Creates a new user.
// - Expected body: { first_name, last_name, phone, address, email, password }
router.post("/register", (req, res) => {
  const { first_name, last_name, email, password } = req.body;

  if (!first_name || !last_name || !email || !password) {
    return res.status(400).send("Please enter the required fields.");
  }

  const hashedPassword = bcrypt.hashSync(password, 10);

  // Create the new user
  const newUser = {
    ...req.body,
    password: hashedPassword,
  };

  knex("users")
    .insert(newUser)
    .then(() => {
      res.status(201).send("Registered successfully");
    });
});

// ## POST /api/users/login

router.post("/login", (req, res) => {
  const { email, password } = req.body;

  // Find the user
  knex("users")
    .where({ email: email })
    .first()
    .then((user) => {
      const isPasswordCorrect = bcrypt.compareSync(password, user.password);

      const token = jwt.sign(
        { id: user.id, email: user.email },
        process.env.JWT_KEY,
        { expiresIn: "24h" }
      );

      res.json({ token });
    });
});

// ## GET /api/users/current

// -   Gets information about the currently logged in user.
// -   If no valid JWT is provided, this route will respond with 401 Unauthorized.
// -   Expected headers: { Authorization: "Bearer JWT_TOKEN_HERE" }
router.get("/current", authenticate, (req, res) => {
  knex("users")
    //.where({ email: decoded.email })
    //middleware is returning decoded object as req.user
    .where({ email: req.user.email })
    .first()
    .then((user) => {
      // Respond with the user data
      delete user.password;
      res.json(user);
    });
});
//});

module.exports = router;
