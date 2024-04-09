const JWT_SEC = '#@sksj9kdkl&'
const jwt = require('jsonwebtoken');
const User = require('../models/user')

const authenticate = async (req, res, next) => {
  try {
    // Extract JWT token from Authorization header
    const token = req.headers.authorization.split(' ')[1];

    console.log('token=',token)
    // Verify JWT token
    const decoded = jwt.verify(token, JWT_SEC);
    console.log('decoded=' ,decoded)
    // Find user by ID in database
    const user = await User.findByPk(decoded.id);
    
    if (!user) {
      throw new Error('User not found');
    }
    
    // Attach user to request object
    req.user = user;
    
    next();
  } catch (err) {
    res.status(401).json({ message: 'Unauthorized' });
  }
};

module.exports = authenticate;
