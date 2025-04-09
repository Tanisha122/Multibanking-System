const express = require('express');
const mysql = require('mysql2');
const dotenv = require('dotenv');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const session = require('express-session');

dotenv.config(); // Load environment variables

const app = express();
const PORT = process.env.PORT || 4000; // Port for the server

// Middleware
app.use(express.json());
app.use(cors({
  origin: 'http://127.0.0.1:5501', // Allow requests from your frontend
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Ensure all necessary methods are allowed
}));
app.use(session({
  secret: process.env.SESSION_SECRET || 'secret',
  resave: false,
  saveUninitialized: true,
  cookie: {
    secure: false, // If you're using HTTP (not HTTPS) during local testing
    httpOnly: true,
  },
}));

// MySQL Database Connection
const db = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'Api3138@ap',
  database: process.env.DB_NAME || 'finone1',
});

// Test the database connection
db.getConnection((err, connection) => {
  if (err) {
    console.error('Error connecting to the database:', err);
    return;
  }
  console.log('Connected to the database!');
  connection.release();
});

// Authentication Middleware
function isAuthenticated(req, res, next) {
  if (req.session.user) {
    return next();  // User is logged in, proceed to the route
  } else {
    return res.status(401).send('Unauthorized');  // User is not logged in
  }
}

// Routes
// User Signup route
app.post('/signup', async (req, res) => {
  const { first_name, last_name, email, username, phone, password } = req.body;

  try {
    // Check if user already exists
    console.log('Checking if user exists...');
    const [rows] = await db.promise().query('SELECT user_id, username, password FROM users WHERE email = ? OR username = ?', [email, username]);
    console.log('Existing users:', rows);
    if (rows.length > 0) {
      return res.status(400).send({
        message: 'Email or Username already exists.',
        redirect: false, // No redirect to login page
      });
    }

    // Hash the password
    console.log('Hashing password...');
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log('Hashed Password:', hashedPassword);

    // Insert new user into the database
    console.log('Inserting user...');
    const query = 'INSERT INTO users (first_name, last_name, email, username, phone, password, role) VALUES (?, ?, ?, ?, ?, ?, ?)';
    const params = [first_name, last_name, email, username, phone, hashedPassword, 'user'];
    console.log('Executing query:', query);
    console.log('Query params:', params);

    const [result] = await db.promise().query(query, params);
    console.log('Insert result:', result);

    if (result.affectedRows === 0) {
      console.error('Insert failed, no rows affected');
      return res.status(500).send({
        message: 'Failed to insert user',
        redirect: false, // No redirect to login page
      });
    }

    // Generate JWT token
    const token = jwt.sign({ user_id: result.insertId, username, email }, process.env.JWT_SECRET, { expiresIn: '1h' });
    console.log('Generated Token:', token);

    res.status(201).json({
      message: 'User registered successfully.',
      token, // Send the token back for user authentication
      redirect: true, // Indicate that the user can be redirected to login page
    });

  } catch (error) {
    console.error('Error during signup:', error);
    res.status(500).send({
      message: 'An error occurred during signup.',
      redirect: false, // No redirect on error
    });
  }
});

// User Login Route
app.post('/index', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Query to check if the user exists in the database by email
    const [rows] = await db.promise().query('SELECT user_id, username, password FROM users WHERE email = ? OR username = ?', [email, email]);
    if (rows.length === 0) {
      return res.status(401).send('Invalid email or password.');
    }

    const user = rows[0];

    // Compare hashed passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).send('Invalid email or password.');
    }

    // Generate JWT token
    const token = jwt.sign({ user_id: user.user_id, username: user.username, email }, process.env.JWT_SECRET, { expiresIn: '1h' });

    // Set session user for front-end access
    req.session.user = { username: user.username };

    res.status(200).json({
      message: 'Login successful.',
      token, // Send the token for user authentication
    });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).send('An error occurred during login.');
  }
});

// Route to check session and send username
app.get('/check-session', (req, res) => {
  if (req.session.user) {
    return res.json({ success: true, username: req.session.user.username });
  } else {
    return res.json({ success: false });
  }
});

// Fetch account details by account ID (Example: Account 1 for Bank A, Account 2 for Bank B)
app.get('/accounts/:accountId', (req, res) => {
  const accountId = req.params.accountId;

  // Fetch account details from database (balance and account type)
  db.query('SELECT balance, account_type FROM accounts WHERE account_id = ?', [accountId], (err, results) => {
    if (err) {
      console.error('Error fetching account:', err);
      return res.status(500).send('Error fetching account details');
    }

    if (results.length === 0) {
      return res.status(404).json({ message: 'Account not found' });
    }

    const account = results[0];
    res.json({
      balance: account.balance,
      account_type: account.account_type, // For example, 'Savings' for Bank A, etc.
    });
  });
});

// Fetch last 5 transactions by account ID (for accounts 1, 2, 3)
app.get('/transactions/:accountId', (req, res) => {
  const accountId = req.params.accountId;

  // Fetch last 5 transactions for the account
  db.query('SELECT description, amount, date FROM transactions WHERE account_id = ? ORDER BY date DESC LIMIT 5', [accountId], (err, results) => {
    if (err) {
      console.error('Error fetching transactions:', err);
      return res.status(500).send('Error fetching transactions');
    }

    if (results.length === 0) {
      return res.status(404).json({ message: 'No transactions found for this account' });
    }

    res.json({
      success: true,
      transactions: results,  // Return transactions as an array of objects
    });
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server Error:', err.stack);
  res.status(500).send('Something went wrong!');
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
