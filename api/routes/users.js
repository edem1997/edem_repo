// Dependencies
const router = require('express').Router();
const Users = require('../models/user');
const Tokens = require('../models/tokens');
const checkMiddleware = require('../middleware/check');
const { hash, compareHash, createToken } = require('../../helpers');

// Get all users
router.get('/', checkMiddleware, async (req, res, next) => {
  try {
    const data = await Users.find({}, { password: 0 });
    res.send(data);
  } catch (error) {
    next(error);
  }
});

// Create a new user
router.post('/signup', async (req, res, next) => {
  try {
    // get all parameters from the body
    let { username, fullname, email, password } = req.body;
    // validate parameters
    username = typeof username === 'string' && username.trim() ? username.trim().toLowerCase() : false;
    email = typeof email === 'string' && email.trim() ? email.trim().toLowerCase() : false;
    password = typeof password === 'string' && password.trim() ? password.trim().toLowerCase() : false;
    fullname = typeof fullname === 'string' && fullname.trim() ? fullname.trim().toLowerCase() : false;
    if (username && fullname && email && password) {
      const passwordHash = await hash(password);
      if (passwordHash) {
        const user = new Users({
          username,
          fullname,
          email,
          password: passwordHash,
        });
        const response = await user.save();
        if (response) {
          res.status(201).send('User created successfully')
        } else {
          res.status(500).send('Could not create a new user');
        }
      } else {
        res.status(500).send('Could not create a password hash')
      }
    } else {
      res.status(400).send('Missing required fields');
    }
  } catch (error) {
    next(error);
  }
});

// User Auth by password and email
router.post('/login', async (req, res, next) => {
  try {
    // Get the parameters
    let { email, password } = req.body;
    // validate params
    email = typeof email === 'string' && email.trim() ? email.trim() : false;
    password = typeof password === 'string' && password.trim() ? password.trim() : false;
    if (email && password) {
      // find the user by the email field
      const user = await Users.findOne({ email });
      if (user) {
        // check if the password matches with the stored hash
        const match = await compareHash(user.password, password);
        if (match) {
          // create a token
          const token = createToken(user._id, user.username, user.email);
          if (token) {
            const data = {
              token,
              user,
            };
            // store the token
            await Tokens.create({ token });
            res.status(200).send(data);
          } else {
            res.status(500).send('Could create the new token');
          }
        } else {
          res.status(401).send('invalid credentials');
        }
      } else {
        res.status(404).send(`Could not found any user that matches with the email (${email})`);        
      }
    } else {
      res.status(400).send('Missing required fields');      
    }
  } catch (error) {
    next(error);
  }
});


module.exports = router;
