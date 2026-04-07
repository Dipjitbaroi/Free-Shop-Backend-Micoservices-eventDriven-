module.exports = {
  datasources: {
    db: {
      url: process.env.VENDOR_DATABASE_URL || 'postgresql://postgres:postgres@postgres:5432/vendor_db'
    }
  }
};
    }
  }
}
