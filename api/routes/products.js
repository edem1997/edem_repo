const express = require("express");

// enable the router method on express
const router = express.Router();

const mongoose = require("mongoose");

// import the model(database) for products
const Product = require ('../models for product/product');

// Handling GET requests on /products (general)

router.get('/', (req, res, next) =>{
  Product.find().exec().then(lists => {
    console.log(lists);
    res.status(200).json(lists);
  }).catch(err => {
    console.log(err);
    res.status(500).json({error: err });
  });
});

// handling GET requests on /products/id (for a specific product)

  router.get('/:productID', (req, res, next) => {
  const id = req.params.productID;
  Product.findById(id).exec().then(doc => {
    console.log(doc);
    if(doc){
      res.status(200).json(doc)
    }else{
      res.status(404).json({message: 'OPPPSSS!!, Not found'});
    }

  }).catch(err => {
    console.log(err);
    res.status(500).json({err})
  });
  });

 // handling PATCH requests on /products/id (for a specific product)

 router.patch('/:productID', (req, res, next) => {
   const id = req.params.productID;

     // update both name and price
  Product.updateOne({_id: id}, {$set: {name: req.body.newName, price: req.body.newPrice}}).exec().then(result =>{
    console.log(result);
    res.status(200).json({message:'your product is updated'})
  }).catch(err =>{
    console.log(err);
    res.status(500).json({error: err});
  });
 });

 // handling DELETE requests on /products/id (for a specific product)

 router.delete('/:productID', (req, res, next) => {
   const id = req.params.productID;
   Product.remove({_id: id}).exec().then(result => {
     res.status(200).json(result);
   }).catch(err =>{
     console.log(err);
     res.status(500).json({error : err});
   })
 });


  // handling GET requests on /products/id (for a specific product)

// Handling POST requests on /products

router.post('/', (req, res, next) => {
  // posting products data (name and price) to the server using the body-parser

  const product = new Product({
    _id: new mongoose.Types.ObjectId(),
    name: req.body.name,
    price: req.body.price
  });
  product.save().then(result => {
    console.log(result);
  }).catch(err => console.log(err));

  res.status(200).json({
    message : 'Handling POST requests to /products',
    product : product
  });
});



// exports the router
module.exports = router;
