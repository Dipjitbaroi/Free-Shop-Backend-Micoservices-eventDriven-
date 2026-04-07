module.exports = {
  datasources: {
    db: {
      url: process.env.USER_DATABASE_URL || 'postgresql://postgres:postgres@postgres:5432/user_db'
    }
  }
};;
