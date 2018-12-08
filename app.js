// dependencies
const express = require('express');

const bodyParser = require('body-parser');

const mongoose = require('mongoose');

// implementation of the product route

const productRouter = require('./api/routes/products');

// using mongoose to connect with the database
mongoose.connect('mongodb://edem_123:edemson@cluster0-shard-00-00-uzcyz.mongodb.net:27017,cluster0-shard-00-01-uzcyz.mongodb.net:27017,cluster0-shard-00-02-uzcyz.mongodb.net:27017/test?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin&retryWrites=true',  { useNewUrlParser: true});

const app = express();

// use the bodyParser

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
// Preventing CORS errors
  // enable the CORS to allow access to every client sending a request to our server
app.use((res, req, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', '*');
  // OPTIONS (request that browser automatically sends to the sever )
  if(req.method === 'OPTIONS') {
    // then we want to support all this request methods (PUT, POST, PATCH, DELETE, GET)
    res.header('Access-Control-Allow-/Methods', 'PUT, POST, GET, PATCH, DELETE');
    return res.status(200).json({});
  };
   next();
});

// to handle incoming resquest at product endpoint

app.use('/products', productRouter);


// export the express file to the server file for requests handlings.

module.exports = app;
