// app.js
const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');

const app = express();
const port = 3005;

// Parse application/json
app.use(bodyParser.json());

// Create MySQL connection
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'Jupyter#123',
  database: 'bquant'
});

// Connect to MySQL
connection.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
    return;
  }
  console.log('Connected to MySQL');
});

// Define routes for CRUD operations

//Create a new record
app.post('/Api/tickers', (req, res) => {
  const data = req.body;
  const query = 'INSERT INTO sampletable SET ?';
  connection.query(query, data, (err, result) => {
    if (err) {
      console.error('Error executing query:', err);
      res.status(500).send('Internal server error');
      return;
    }
    res.status(201).send('Record created successfully');
  });
});

// Read all records
app.get('/Api/tickers', (req, res) => {
  const query = 'SELECT * FROM sampletable';
  connection.query(query, (err, rows) => {
    if (err) {
      console.error('Error executing query:', err);
      res.status(500).send('Internal server error');
      return;
    }
    res.json(rows);
  });
});

// get AAPL records 
app.get('/Api/ticker=:ticker&column=:columns&period=:period', (req, res) => {
    // Extract query parameters

    const startDate = new Date();
    startDate.setFullYear(startDate.getFullYear() - `${req.params.period[0]}`);
    const { ticker, columns } = req.params;

    const query = `SELECT ${columns} FROM sampletable WHERE ticker = ${ticker} AND date >= '${startDate.toISOString().split('T')[0]}'`;
    connection.query(query, (err, rows) => {
    if (err) {
      console.error('Error executing query:', err);
      res.status(500).send('Internal server error');
      return;
    }
    
    res.json({ ticker, columns, rows });
    console.log(rows);
});
});

// Update a record
app.put('/Api/tickers/:TestId', (req, res) => {
  const TestId = req.params.TestId;
  const data = req.body;
  const query = 'UPDATE sampletable SET ? WHERE TestId = ?';
  connection.query(query, [data, TestId], (err, result) => {
    if (err) {
      console.error('Error executing query:', err);
      res.status(500).send('Internal server error');
      return;
    }
    res.send('Record updated successfully');
    console.log(result);
  });
});

// Delete a record
app.delete('/Api/tickers/:TestId', (req, res) => {
  const id = req.params.TestId;
  const query = 'DELETE FROM sampletable WHERE tickerid = ?';
  connection.query(query, id, (err, result) => {
    if (err) {
      console.error('Error executing query:', err);
      res.status(500).send('Internal server error');
      return;
    }
    res.send('Record deleted successfully');
    console.log(result)
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
