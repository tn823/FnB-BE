const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
const dotenv = require('dotenv');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const fs = require('fs');
const { connectDB, sequelize } = require('../src/config/database');
const productRoutes = require('../src/routes/product.routes');
const categoryRoutes = require('../src/routes/category.routes');
const accountRoutes = require('../src/routes/account.routes');
const menuRoutes = require('../src/routes/menu.routes');
const comboRoutes = require('../src/routes/combo.routes');
const orderRoutes = require('../src/routes/order.routes');
const toppingRoutes = require('../src/routes/topping.routes');
const syncRoutes = require('../src/sync/syncRoutes');
const cron = require('node-cron');
const syncService = require('../src/sync/syncService');
const cookieParser = require('cookie-parser');
const authRoutes = require('../src/routes/auth.routes');

dotenv.config();

connectDB();

const app = express();
const port = process.env.PORT || 3000;

// const allowedOrigins = ['http://localhost:5173', 'https://fnb-fe-ui.vercel.app'];

// app.use(cors({
//   origin: function (origin, callback) {
//     // Kiểm tra xem origin có trong danh sách allowedOrigins hay không
//     if (!origin || allowedOrigins.indexOf(origin) !== -1) {
//       callback(null, true);
//     } else {
//       callback(new Error('Not allowed by CORS'));
//     }
//   },
//   methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
//   credentials: true,
// }));


// Middleware
app.use(morgan('dev'));
app.use(helmet());
app.use(express.json());
app.use(cookieParser());

// Routes
app.use('/api', productRoutes);
app.use('/api', categoryRoutes);
app.use('/api', accountRoutes);
app.use('/api', menuRoutes);
app.use('/api', comboRoutes);
app.use('/api', orderRoutes);
app.use('/api', toppingRoutes);
app.use('/api', syncRoutes);
app.use('/api', authRoutes);


fs.readFile('swagger.yaml', 'utf8', (err, data) => {
  if (err) {
    console.error('No such file swagger.yaml:', err);
    return;
  }
  const swaggerDocument = YAML.parse(data);
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
});


app.get('/', (req, res) => {
    res.send('Welcome to the F&B Order API');
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
