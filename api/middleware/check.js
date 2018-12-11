
// dependencies
const { validateToken } = require('../../helpers');
const Tokens = require('../models/tokens');

// token validation
module.exports = async (req, res, next) =>{
  try {
    // get the token from the headers
    const { token } = req.headers;
    if (token) {
      // find the token in the db
      const storedToken = Tokens.findOne({ token });
      if (storedToken) {
        const validate = await validateToken(token);
        if (validate) {
          next();
        } else {
          res.status(401).send('Unauthorized, provide a valid token in the headers');
        }
      } else {
        res.status(404).send('The provided token was not found in the stored tokens');
      }
    } else {
      res.status(400).send('Missin required fields. Please provide a token in the headers');
    }
  } catch (error) {
    res.status(500).send('something went wrong');
  }
};
