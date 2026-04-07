module.exports = {
  datasources: {
    db: {
      url: process.env.NOTIFICATION_DATABASE_URL || 'postgresql://postgres:postgres@postgres:5432/notification_db'
    }
  }
};
