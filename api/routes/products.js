const express = require("express");


// enable the router method on express
const router = express.Router();

const mongoose = require("mongoose");
// for saving files to the server
const multer = require('multer');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads/")
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + file.originalname);
  }
});

const fileFilter = (req, file, cb) => {
  if(file.mimetype === "image/jpeg" || file.mimetype === "image/png"){
    cb(null, true);
  }else{
    cb(null, false);
  }


};

const upload = multer({ storage : storage,
  limits: {
  fileSize: 1024 * 1024 * 5
},
// fileFilter : fileFilter
});


// import the model(database) for products
const Product = require ('../models/product');

// Handling GET requests on /products (general)

router.get('/', (req, res, next) => {
  Product.find()
  .select("name price currency _id description imageUrl")
  .exec()
  .then(lists => {
    const response = {
      count : lists.length,
      products : lists.map(list => {
        return {
          name : list.name,
          price: list.price,
          currency: list.currency,
          description: list.description,
          imageUrl: list.imageUrl,
          _id: list._id,
          resquest: {
            type: "GET"
        }
      };
    })
  };
    res.status(200).json(response);
  }).catch(err => {
    console.log(err);
    res.status(500).json({error: err });
  });
});

// handling GET requests on /products/id (for a specific product)

  router.get('/:productID', (req, res, next) => {
  const id = req.params.productID;
  Product.findById(id)
  .select("name price _id currency description imageUrl")
  .exec()
  .then(doc => {
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

   const updateOps = {};
   for(const ops of req.body) {
     updateOps[ops.propName] = ops.value;
   }

     // update both name and price
  Product.updateOne({_id: id}, {$set: updateOps}).exec().then(result =>{
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

router.post('/', upload.single("imageUrl"), (req, res, next) => {
  console.log(req.file);
  // posting products data (name and price) to the server using the body-parser

  const product = new Product({
    _id: new mongoose.Types.ObjectId(),
    name: req.body.name,
    price: req.body.price,
    currency: req.body.currency,
    description: req.body.description,
    imageUrl : req.file.path

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
