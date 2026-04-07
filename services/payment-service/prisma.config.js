module.exports = {
  datasources: {
    db: {
      url: process.env.PAYMENT_DATABASE_URL || 'postgresql://postgres:postgres@postgres:5432/payment_db'
    }
  }
};
