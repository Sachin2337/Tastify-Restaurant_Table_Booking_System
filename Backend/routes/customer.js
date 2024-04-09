const bcrypt = require('bcrypt')
const express = require('express');
const router = express.Router();
const User = require('../models/user');
const authenticate = require('../middleware/authentication');
const authorize = require('../middleware/authorise');
var jwt = require('jsonwebtoken');
const JWT_SEC = '#@sksj9kdkl&'

// Create a new user
router.post('/', async (req, res) => {
  // try {
  //   console.log( req.body.Username)
  //   let user = await User.findOne({ Username: req.body.Username });
  //   if (user) {
  //     console.log(user)
  //       return res.status(400).json({success, message: 'Sorry a user with this username already exists' })
  //   }

  //   const salt = await bcrypt.genSalt(10)
  //   const secPass = await bcrypt.hash(req.body.Password, salt);
    
  //   const role = req.body.Role;
  //   user = await User.create({
  //     Username: req.body.Username,
  //     Password: secPass,
  //     ConContactInfo: req.body.ContactInfo,
  //     Role: role
  //   })
  //   console.log(user)
  //   const authToken = jwt.sign(data, JWT_SEC)
  //   res.json({ success,authToken })
  // }
  // catch(err){
  //   res.status(400).json({ message: err.message })
  // }
  try {
    let euser = await User.findOne({ where: { Username: req.body.Username } });
    
    if (euser) {
      console.log(euser)
        return res.status(400).json({ message: 'Sorry a user with this username already exists' })
    }

    // defing role 
    let role  =  'customer';
    if(req.body.Role){
        role = 'admin'
    }
    const salt = await bcrypt.genSalt(10)
    const secPass = await bcrypt.hash(req.body.Password, salt);

    const user = await User.create({
      Username: req.body.Username,
      Password: secPass, // Hash this password in production
      ContactInfo:req.body.ContactInfo, 
      Role:role
    })

    const token = jwt.sign({ id: user.UserID, username: user.Username, role: user.Role }, 'your_jwt_secret', { expiresIn: '1h' });
    res.status(201).json({user,token});
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Get all users
router.get('/',authenticate, authorize(['admin']), async (req, res) => {
  try {
    const users = await User.findAll();
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get a specific user by ID
router.get('/:id',authenticate, authorize(['admin']), async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update a user
router.put('/:id',authenticate, authorize(['admin','customer']), async (req, res) => {

  try {
    const user = await User.findByPk(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    await user.update(req.body);
    res.json(user);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete a user
router.delete('/:id',authenticate, authorize(['admin','customer']), async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    console.log(user);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    await user.destroy();
    res.json({ message: 'User deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
