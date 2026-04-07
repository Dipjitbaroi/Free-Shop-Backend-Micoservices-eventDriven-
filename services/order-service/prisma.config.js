module.exports = {
  datasources: {
    db: {
      url: process.env.ORDER_DATABASE_URL || 'postgresql://postgres:postgres@postgres:5432/order_db'
    }
  }
};
