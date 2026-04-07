module.exports = {
  datasources: {
    db: {
      url: process.env.ANALYTICS_DATABASE_URL || 'postgresql://postgres:postgres@postgres:5432/analytics_db'
    }
  }
};
