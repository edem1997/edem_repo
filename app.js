// dependencies
const express = require('express');

const bodyParser = require('body-parser');

const mongoose = require('mongoose');



// implementation of the product route

const productRouter = require('./api/routes/products');
const userRouter = require('./api/routes/users');

// using mongoose to connect with the database
mongoose.connect("mongodb://cluster0-shard-00-00-ckeqy.mongodb.net:27017,cluster0-shard-00-01-ckeqy.mongodb.net:27017,cluster0-shard-00-02-ckeqy.mongodb.net:27017/test?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin&retryWrites=true");

const app = express();
// tosend static content
app.use("/uploads", express.static("uploads"));

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
app.use('/users', userRouter);

// handling errors


// app.use((error, req, res, next ) => {
//   res.status(error.status || 500);
//   res.json({error : {message : error.message}
//   });
// });


// export the express file to the server file for requests handlings.

module.exports = app;
