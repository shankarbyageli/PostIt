const app = require('./src/app.js');

const PORT = process.env.PORT || 8000;

const express = require('express');

const app = express();

app.set('view engine', 'pug');
app.set('views', './templates');

app.get('/name', (req, res) => {
  res.render('name', { name: 'John' });
});

app.listen(PORT, () => console.log('server is listening', PORT));
