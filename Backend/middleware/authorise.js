const authorize = (roles) => {
    return (req, res, next) => {
      if (!roles.includes(req.user.Role)) {
        return res.status(403).json({ message: 'Forbidden' });
      }
      next();
    };
  };
  
  module.exports = authorize;
  