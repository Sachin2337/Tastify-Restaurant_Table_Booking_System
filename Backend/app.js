
require('dotenv').config()
const express = require('express');
const bodyParser = require('body-parser');
const menuItemRoutes = require('./routes/menuItem');
const userRoute = require('./routes/customer');
const feedbackRoute = require('./routes/feedback');
const orderItemRoute  = require('./routes/orderItem');
const sequelize = require('./config/database');
const login = require('./routes/login');
const reservation = require('./routes/reservation');;
const app = express();
const cors = require("cors");

//allow cross orgin resource sharing
app.use(cors());


// Middleware
app.use(bodyParser.json());

app.use(express.static('public'))

// Routes
app.use('/api/menuItems', menuItemRoutes);
app.use('/api/customer', userRoute);
app.use('/api/feedback', feedbackRoute);
app.use('/api/order' , orderItemRoute);
app.use('/api/login' , login);
app.use('/api/reserve', reservation);


// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

console.log(process.env.MYSQL_DATABASE)

try {
  sequelize.authenticate().then(()=>console.log('Connection has been established successfully.'))
} catch (error) {
  console.error('Unable to connect to the database:', error);
}

// Sync Sequelize models with the database
sequelize.sync({ force: false }).then(() => {
  console.log('Database synced');
}).catch(err => {
  console.error('Error syncing database:', err);
});
