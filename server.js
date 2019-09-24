require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const cors = require('cors');

const movies = require('./movies-data');

const app = express();

//add all middleware
app.use(morgan('dev'));
app.use(helmet());
app.use(cors());

//add token authorization
function validateBearerToken( req, res, next ) {
  const authToken = process.env.API_TOKEN;
  const userToken = req.get('Authorization');
  if (!userToken || userToken.split(' ')[1] !== authToken) {
    return res.status(401).json('error: Unauthorized request')
  }
  next();
}

app.use(validateBearerToken);

//endpoint data manipulation
app.get('/movie', ( req, res ) => {
  let results = movies;

  if (req.query.genre) {
    results = results.filter( movie => movie.genre.toLowerCase().includes(req.query.genre.toLowerCase()));
  }

  if (req.query.country) {
    results = results.filter( movie => movie.country.toLowerCase().includes(req.query.country.toLowerCase()));
  }

  if (req.query.avg_vote) {
    const voteResults = results.filter( movie => parseFloat(movie.avg_vote) >= parseFloat(req.query.avg_vote));
    results = voteResults.sort(( a, b ) => a.avg_vote < b.avg_vote ? 1 : a.avg_vote > b.avg_vote ? -1 : 0);
  }

  res.json(results);
})

const PORT = 8000;
app.listen(PORT, () => console.log(`Listening on http://localhost:${PORT}`));