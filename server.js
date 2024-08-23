const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = 3000;

// Middleware to parse JSON bodies
app.use(express.json());

// Serve static files (HTML, CSS, JS)
app.use(express.static(path.join(__dirname)));

// Route to serve CSV data
app.get('/data', (req, res) => {
  fs.readFile('data.csv', 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading file:', err);
      return res.status(500).json({ success: false, message: 'Error reading file.' });
    }
    res.send(data);
  });
});

// POST route to receive form data and save it to CSV
app.post('/submit', (req, res) => {
  const { name, age, occupation } = req.body;

  if (!name || !age || !occupation) {
    return res.status(400).json({ success: false, message: 'All fields are required.' });
  }

  // Prepare the CSV format line
  const newData = `\n${name},${age},${occupation}`;

  // Append the new data to the CSV file
  fs.appendFile('data.csv', newData, (err) => {
    if (err) {
      console.error('Error writing to file:', err);
      return res.status(500).json({ success: false, message: 'Error writing to file.' });
    }

    res.json({ success: true });
  });
});

// DELETE route to remove a record from the CSV
app.delete('/delete/:lineNumber', (req, res) => {
  const lineNumber = parseInt(req.params.lineNumber, 10);

  if (isNaN(lineNumber) || lineNumber <= 0) {
    return res.status(400).json({ success: false, message: 'Invalid line number.' });
  }

  fs.readFile('data.csv', 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading file:', err);
      return res.status(500).json({ success: false, message: 'Error reading file.' });
    }

    const lines = data.split('\n');
    if (lineNumber >= lines.length || lineNumber === 0) {
      return res.status(400).json({ success: false, message: 'Line number out of range.' });
    }

    // Remove the specified line
    lines.splice(lineNumber, 1);

    // Rebuild the CSV content
    const newContent = lines.join('\n');

    fs.writeFile('data.csv', newContent, 'utf8', (err) => {
      if (err) {
        console.error('Error writing file:', err);
        return res.status(500).json({ success: false, message: 'Error writing to file.' });
      }

      res.json({ success: true });
    });
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

