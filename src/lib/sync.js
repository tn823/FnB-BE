const { sequelize } = require('./config/database');
const Product = require('./models/product.model');

const syncDB = async () => {
  try {
    await sequelize.sync({ force: true });
    console.log('Database & tables created!');
  } catch (error) {
    console.error('Error syncing database:', error);
  }
};

syncDB();
