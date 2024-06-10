const express = require('express');
const mysql = require('mysql');
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');
const session = require('express-session');

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(session({
    secret: 'secret-key',
    resave: false,
    saveUninitialized: true
}));

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '140704',
    database: 'recipe_app'
});

db.connect((err) => {
    if (err) throw err;
    console.log('Connected to database');
});

app.post('/signup', async (req, res) => {
    const { username, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    db.query('INSERT INTO users (username, password) VALUES (?, ?)', [username, hashedPassword], (err, result) => {
        if (err) throw err;
        res.status(201).send('User created');
    });
});

app.post('/login', (req, res) => {
    const { username, password } = req.body;
    db.query('SELECT * FROM users WHERE username = ?', [username], async (err, results) => {
        if (err) throw err;
        if (results.length > 0 && await bcrypt.compare(password, results[0].password)) {
            req.session.user = results[0];
            res.send('Login successful');
        } else {
            res.status(401).send('Invalid credentials');
        }
    });
});

app.get('/categories', (req, res) => {
    db.query('SELECT * FROM categories', (err, results) => {
        if (err) throw err;
        res.json(results);
    });
});

app.post('/categories', (req, res) => {
    const { name } = req.body;
    db.query('INSERT INTO categories (name) VALUES (?)', [name], (err, result) => {
        if (err) throw err;
        res.status(201).send('Category created');
    });
});

app.get('/recipes', (req, res) => {
    db.query('SELECT * FROM recipes', (err, results) => {
        if (err) throw err;
        res.json(results);
    });
});

app.post('/recipes', (req, res) => {
    const { title, ingredients, instructions, cooking_time, serving_size, category_id, user_id } = req.body;
    db.query('INSERT INTO recipes (title, ingredients, instructions, cooking_time, serving_size, category_id, user_id) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [title, ingredients, instructions, cooking_time, serving_size, category_id, user_id], (err, result) => {
            if (err) throw err;
            res.status(201).send('Recipe created');
        });
});

app.put('/recipes/:id', (req, res) => {
    const { id } = req.params;
    const { title, ingredients, instructions, cooking_time, serving_size, category_id } = req.body;
    db.query('UPDATE recipes SET title = ?, ingredients = ?, instructions = ?, cooking_time = ?, serving_size = ?, category_id = ? WHERE id = ?',
        [title, ingredients, instructions, cooking_time, serving_size, category_id, id], (err, result) => {
            if (err) throw err;
            res.send('Recipe updated');
        });
});

app.delete('/recipes/:id', (req, res) => {
    const { id } = req.params;
    db.query('DELETE FROM recipes WHERE id = ?', [id], (err, result) => {
        if (err) throw err;
        res.send('Recipe deleted');
    });
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
