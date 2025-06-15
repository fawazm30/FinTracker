const express = require('express');
const mysql = require('mysql2/promise');
const path = require('path');
const bcryptjs = require('bcryptjs');
require('dotenv').config();

const app = express();
const PORT = 3000;
const session = require('express-session');

app.use(session({
  secret: 'your_secret_key', // use .env in production
  resave: false,
  saveUninitialized: true
}));


// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'Public')));
app.use('/Views', express.static(path.join(__dirname, 'Views')));

// ✅ Wrap everything in an async function
async function startServer() {
  try {
    const db = await mysql.createConnection({
        host: process.env.DB_HOST || 'mysql',     
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || 'root',
        database: process.env.DB_NAME || 'fintracker',
        port: 3306                                
    });

    console.log('Connected to MySQL');

    // Debug: List tables
    const [tables] = await db.execute('SHOW TABLES');
    console.log('Database tables:', tables);

    // Debug: Check budgets table
    try {
      const [budgetRows] = await db.execute('DESCRIBE budgets');
      console.log('Budgets table exists:', budgetRows.length > 0);
    } catch (err) {
      console.error('Budgets table check failed:', err);
    }

    // Debug: Check users table
    try {
      const [userRows] = await db.execute('DESCRIBE users');
      console.log('Users table exists:', userRows.length > 0);
    } catch (err) {
      console.error('Users table check failed:', err);
    }

    app.get('/', (req, res) => {
      res.redirect('/Views/login.html');
    });

    // Signup route
    app.post('/signup', async (req, res) => {
      const { firstname, email, password } = req.body;

  if (!firstname || !email || !password) {
    return res.redirect('Views/signup.html?error=empty');
  }

  try {
    const [rows] = await db.execute('SELECT * FROM users WHERE email = ?', [email]);
    if (rows.length > 0) {
      return res.redirect('Views/signup.html?error=email');
    }

    const hashedPassword = await bcryptjs.hash(password, 10); // ✅ hash the password
    await db.execute('INSERT INTO users (firstname, email, password) VALUES (?, ?, ?)', [
      firstname,
      email,
      hashedPassword
    ]);

    res.redirect('Views/login.html?success=1');
  } catch (err) {
    console.error('Signup Error:', err);
    res.status(500).send('Server error during signup');
  }
});

    // Login route
    app.post('/login', async (req, res) => {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.redirect('/Views/login.html?error=empty');
      }

      try {
        const [rows] = await db.execute('SELECT * FROM users WHERE email = ?', [email]);
        const user = rows[0];

        console.log("User from DB:", user);
        console.log("Input password:", password);

        if (!user) {
          return res.redirect('/Views/login.html?error=invalid');
        }

        const match = await bcryptjs.compare(password, user.password);
        if (!match) {
          return res.redirect('/Views/login.html?error=invalid');
        }
        req.session.userId = user.id;
        res.redirect(`/Views/dashboard.html?firstname=${encodeURIComponent(user.firstname)}`);
      } catch (err) {
        console.error('Login Error:', err);
        res.status(500).send('Server error during login.');
      }
    });
    app.use(express.json());
    app.post('/add-transaction', async (req, res) => {
        const { date, amount, description, category } = req.body;
        const userId = req.session.userId;
        if (!userId) {
            return res.status(401).json({ error: 'Unauthorized: user not logged in' });
        }

        try {
            await db.execute(
                'INSERT INTO transactions (user_id, date, amount, description, category) VALUES (?, ?, ?, ?, ?)',
                [userId, date, amount, description, category]
            );
            res.status(200).json({ message: 'Transaction added' });
        } catch (error) {
            console.error('Error adding transaction:', error);
            res.status(500).json({ error: 'Failed to add transaction' });
        }
    });
    // Fetch transactions for the logged-in user
    app.get('/transactions', async (req, res) => {
        const userId = req.session.userId;
        if (!userId) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        try {
            const [transactions] = await db.execute(
                'SELECT id, date, amount, description, category FROM transactions WHERE user_id = ? ORDER BY date DESC, id DESC',
                [userId]
            );
            res.json(transactions);
        } catch (error) {
            console.error('Error fetching transactions:', error);
            res.status(500).json({ error: 'Failed to fetch transactions' });
        }
    });
    // Delete transaction
    app.delete('/transactions/:id', async (req, res) => {
        const userId = req.session.userId;
        const transactionId = req.params.id;

        try {
            await db.execute(
                'DELETE FROM transactions WHERE id = ? AND user_id = ?',
                [transactionId, userId]
            );
            res.json({ message: 'Transaction deleted' });
        } catch (err) {
            console.error('Delete error:', err);
            res.status(500).json({ error: 'Failed to delete transaction' });
        }
    });
    // Set budget for current month
    app.post('/add-budget', async (req, res) => {
        const userId = req.session.userId;
        if (!userId) return res.status(401).json({ error: 'Unauthorized' });

        const { amount } = req.body;
        if (!amount) return res.status(400).json({ error: 'Amount required' });

        try {
            // Get first day of current month (YYYY-MM-01)
            const now = new Date();
            const month = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-01`;

            // Convert amount to number
            const budgetAmount = Number(amount);

            await db.execute(
                `INSERT INTO budgets (user_id, month, total_budget)
                VALUES (?, ?, ?)
                ON DUPLICATE KEY UPDATE total_budget = VALUES(total_budget)`,
                [userId, month, budgetAmount]
            );
            res.status(200).json({ message: 'Budget set successfully' });
        } catch (err) {
            console.error('Budget Error:', err);
            // Return detailed error message
            res.status(500).json({ 
                error: 'Failed to set budget',
                details: err.message,
                sql: err.sql
            });
        }
    });
// Get current month's budget summary
    app.get('/budget-summary', async (req, res) => {
        const userId = req.session.userId;
        if (!userId) return res.status(401).json({ error: 'Unauthorized' });

        try {
            // Get current month range
            const now = new Date();
            const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
            const nextMonthFirstDay = new Date(now.getFullYear(), now.getMonth() + 1, 1);
            
            // Format dates for MySQL
            const firstDayStr = firstDay.toISOString().slice(0, 10);
            const nextMonthFirstDayStr = nextMonthFirstDay.toISOString().slice(0, 10);

            // Debug log
            console.log(`Budget summary for user ${userId}: ${firstDayStr} to ${nextMonthFirstDayStr}`);

            // Get budget
            const [budgetRows] = await db.execute(
                'SELECT total_budget FROM budgets WHERE user_id = ? AND month = ?',
                [userId, firstDayStr]
            );
            
            // Calculate spending
            const [spentRows] = await db.execute(
                `SELECT SUM(amount) AS spent 
                FROM transactions 
                WHERE user_id = ? 
                  AND date >= ? 
                  AND date < ?
                  AND amount < 0`,
                [userId, firstDayStr, nextMonthFirstDayStr]
            );
            // Convert values to numbers
            const budget = budgetRows[0]?.total_budget 
                ? Number(budgetRows[0].total_budget) 
                : 0;
                
            const spent = spentRows[0]?.spent 
                ? Math.abs(Number(spentRows[0].spent)) 
                : 0;
            
            res.json({
                totalBudget: budget,
                spent: spent,
                remaining: budget - spent
            });
        } catch (err) {
            console.error('Budget Summary Error:', err);
            res.status(500).json({ 
                error: 'Failed to get budget data',
                details: err.message
            });
        }
    });
    // Logout route
    app.get('/logout', (req, res) => {
      res.redirect('/Views/login.html');
    });

    app.listen(PORT, () => {
      console.log(`🚀 Server running at http://localhost:${PORT}`);
    });

  } catch (err) {
    console.error('Failed to connect to DB or start server:', err);
  }
}

startServer();

