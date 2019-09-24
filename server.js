require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const cors = require('cors');

const movies = require('./movies-data');

const app = express();

app.use(morgan('dev'));
app.use(helmet());
app.use(cors());

app.get('/movie', (req, res) => {
  res.json('I am running!');
})

const PORT = 8000;
app.listen(PORT, () => console.log(`Listening on http://localhost:${PORT}`));