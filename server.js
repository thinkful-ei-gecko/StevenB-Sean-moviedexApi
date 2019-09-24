require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const cors = require('cors');

const movies = require('./movies-data');
const authToken = process.env.API_TOKEN;

const app = express();

//add all middleware
app.use(morgan('dev'));
app.use(helmet());
app.use(cors());

function validateBearerToken( req, res, next ) {
  const userToken = req.get('Authorization');
  console.log(`Validate bearer token middleware executed. Token key is ${userToken}`);
  console.log(authToken);
  if (!userToken || userToken.split(' ')[1] !== authToken) {
    return res.status(401).json('error: Unauthorized request')
  }
  next();
}

app.use(validateBearerToken);

//endpoint date manipulation
app.get('/movie', ( req, res ) => {
  res.json('I am running!');
})

const PORT = 8000;
app.listen(PORT, () => console.log(`Listening on http://localhost:${PORT}`));