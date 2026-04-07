module.exports = {
  datasources: {
    db: {
      url: process.env.PRODUCT_DATABASE_URL || 'postgresql://postgres:postgres@postgres:5432/product_db'
    }
  }
};
