

const express = require('express');
const cors = require('cors'); // LINE 1: Import the tool
const fs = require('fs'); // Built-in Node tool for files
const app = express();
const port = 3000;

app.use(cors()); // LINE 2: Tell Express to use it
app.use(express.json()); // NEW: This allows the server to read data sent in the "body"

// Helper function to read the database
const getQuotesFromDB = () => {
    const data = fs.readFileSync('database.json');
    return JSON.parse(data);
};

app.get('/api/quote', (req, res) => {
  const quotes = getQuotesFromDB(); // <--- ADD THIS LINE
  const randomIndex = Math.floor(Math.random() * quotes.length);
  res.json({ quote: quotes[randomIndex] });
});

app.get('/api/all-quotes', (req, res) => {
  const quotes = getQuotesFromDB();
  res.json(quotes);
});

// Helper function to save to the database
const saveQuotesToDB = (quotes) => {
    fs.writeFileSync('database.json', JSON.stringify(quotes, null, 2));
};


// NEW: This route receives data from the frontend
app.post('/api/quote', (req, res) => {
  const newQuote = req.body.text; // We'll name the variable 'text' in the frontend
  if (newQuote) {
    const quotes = getQuotesFromDB();
    quotes.push(newQuote);
    saveQuotesToDB(quotes); // Add it to our list!
    res.json({ message: "SAVED TO DATABASE"});
  } else {
    res.status(400).json({ message: "Quote cannot be empty" });
  }
});

app.listen(port, () => {
  console.log(`Backend running at http://localhost:${port}`);
});