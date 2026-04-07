module.exports = {
  datasources: {
    db: {
      url: process.env.AUTH_DATABASE_URL || 'postgresql://postgres:postgres@postgres:5432/auth_db'
    }
  }
};
