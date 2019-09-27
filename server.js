require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const cors = require('cors');

const movies = require('./movies-data');
const PORT = process.env.PORT || 8000;

const app = express();
const morganSetting = process.env.NODE_ENV === 'production' ? 'tiny' : 'common';

//add all middleware
app.use(morgan(morganSetting));
app.use(helmet());
app.use(cors());

//add token authorization
function validateBearerToken( req, res, next ) {

  const authToken = process.env.API_TOKEN;
  const userToken = req.get('Authorization');

  if (!userToken || userToken.split(' ')[1] !== authToken) {
    return res.status(401).json({error: 'Unauthorized request'});
  }

  next();
}

app.use(validateBearerToken);

//endpoint data manipulation
app.get('/movie', ( req, res ) => {
  
  const { genre, country, avg_vote } = req.query;
  let results = movies;

  if (genre) {
    results = results.filter( movie => movie.genre.toLowerCase().includes(genre.toLowerCase()));
  }

  if (country) {
    results = results.filter( movie => movie.country.toLowerCase().includes(country.toLowerCase()));
  }

  if (avg_vote) {
    const voteResults = results.filter( movie => parseFloat(movie.avg_vote) >= parseFloat(avg_vote));
    results = voteResults.sort(( a, b ) => a.avg_vote < b.avg_vote ? 1 : a.avg_vote > b.avg_vote ? -1 : 0);
  }

  res.json(results);
});

app.listen(PORT, () => console.log(`Listening on http://localhost:${PORT}`));