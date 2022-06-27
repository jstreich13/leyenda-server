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
  const { first_name, last_name, phone, address, email, password } = req.body;

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
    })
    .catch(() => {
      res.status(400).send("Failed registration");
    });
});

// ## POST /api/users/login

// -   Generates and responds a JWT for the user to use for future authorization.
// -   Expected body: { email, password }
// -   Response format: { token: "JWT_TOKEN_HERE" }
router.post("/login", (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).send("Please enter the required fields");
  }

  // Find the user
  knex("users")
    .where({ email: email })
    .first()
    .then((user) => {
      const isPasswordCorrect = bcrypt.compareSync(password, user.password);

      if (!isPasswordCorrect) {
        return res.status(400).send("Invalid password");
      }

      const token = jwt.sign(
        { id: user.id, email: user.email },
        process.env.JWT_KEY,
        { expiresIn: "24h" }
      );

      res.json({ token });
    })
    .catch(() => {
      res.status(400).send("Invalid credentials");
    });
});

// ## GET /api/users/current

// -   Gets information about the currently logged in user.
// -   If no valid JWT is provided, this route will respond with 401 Unauthorized.
// -   Expected headers: { Authorization: "Bearer JWT_TOKEN_HERE" }
router.get("/current", authenticate, (req, res) => {
  // REFACTORED TO AUTHENTICATE VIA MIDDLEWARE

  // If there is no auth header provided
  // if (!req.headers.authorization) {
  //     return res.status(401).send("Please login");
  // }

  // Parse the Bearer token
  // const authToken = req.headers.authorization.split(" ")[1];

  // Verify the token
  // jwt.verify(authToken, process.env.JWT_KEY, (err, decoded) => {
  //     if (err) {
  //         return res.status(401).send("Invalid auth token");
  //     }

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
