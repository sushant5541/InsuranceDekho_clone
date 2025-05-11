const jwt = require('jsonwebtoken');

const generateToken = (id, isAdmin = false) => {
  return jwt.sign(
    { id, isAdmin }, // Include isAdmin in the token payload
    process.env.JWT_SECRET,
    { expiresIn: '30d' }
  );
};

module.exports = generateToken;