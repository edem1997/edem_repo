// Dependencies
const bcrypt = require('bcrypt');
const jsonWebToken = require('jsonwebtoken');
const moment = require('moment');

const secretKey = process.env.JWT_SECRET || 'secrect key';

// helpers container
const helpers = {};

/**
 * Create a token
 * @param {String} id
 * @param {String} username
 * @param {String} email
 * @returns {Object} token data
 */
helpers.createToken = (id, username, email) => {
  // validate all parameters
  username = typeof username === 'string' && username.trim() ? username : false;
  username = typeof username === 'string' && username.trim() ? username : false; 
  username = typeof username === 'string' && username.trim() ? username : false; 
  if (id && username && email) {
    const payload = {
      id,
      username,
      email,
    };
    const token = jsonWebToken.sign(payload, secretKey, {
      expiresIn: moment().add(1, 'days').unix(),
      algorithm: 'HS256',
    });
    if (token) {
      return token;
    } else {
      return false;
    }
  } else {
    return false;
  }
}

/**
 * token validation
 * @param {String} token
 * @returns {Promise} if it is valid it will return an object, otherwise it return false
 */
helpers.validateToken = (token) => {
  console.log('token', token);
  
  // validate all parameters
  token = typeof token === 'string' && token.trim() ? token : false;
  return new Promise((resolve) => {
    if (token) {
      jsonWebToken.verify(token, secretKey, (err, decoded) => {
        if (!err) {
          resolve(decoded);
        } else {
          resolve(false);
        }
      });
    } else {
      resolve(false);
    }
  });
}

/**
 * hash
 * @param {String} str plain text
 * @returns {Promise}
 */
helpers.hash = (str) => {
  const salts = 10;
  return new Promise((resolve, reject) => {
    bcrypt.hash(str, salts).then(resolve).catch(reject);
  });
}

/**
 * Compare an encrypted string with a normal string
 * @param {String} encrypted encrypted string
 * @param {String} text text
 * @returns {Promise}
 */
helpers.compareHash = (hash, text) => {
  return new Promise((resolve, reject) => {
    bcrypt.compare(text, hash, (err, result) => {
      if (!err) {
        resolve(result);
      } else {
        reject(err);
      }
    });
  });
};

// export the module
module.exports = helpers;
