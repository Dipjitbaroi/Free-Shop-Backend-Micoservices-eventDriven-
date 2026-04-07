module.exports = {
  datasources: {
    db: {
      url: process.env.INVENTORY_DATABASE_URL || 'postgresql://postgres:postgres@postgres:5432/inventory_db'
    }
  }
};
