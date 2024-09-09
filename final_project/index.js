const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session');
const books = require('./router/booksdb.js');
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;

const app = express();

// Middleware to parse JSON request bodies
app.use(express.json());

// Middleware to handle sessions
app.use("/customer", session({
    secret: "your_session_secret", // Use a secret key for session
    resave: true,
    saveUninitialized: true
}));

// Authentication middleware for routes under /customer/auth
app.use("/customer/auth/*", (req, res, next) => {
    // Check if user is logged in and has a valid access token
    if (req.session.authorization) {
        let token = req.session.authorization['accessToken'];

        // Verify JWT token
        jwt.verify(token, 'your_jwt_secret_key', (err, user) => {
            if (!err) {
                req.user = user;
                next(); // Proceed to the next middleware
            } else {
                return res.status(403).json({ message: "User not authenticated" });
            }
        });
    } else {
        return res.status(403).json({ message: "User not logged in" });
    }
});

// Define routes
app.use("/customer", customer_routes);
app.use("/", genl_routes);

// Start the server
const PORT = 5000;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));

