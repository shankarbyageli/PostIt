const { db } = require('./config');

module.exports = {
  development: {
    client: 'sqlite3',
    connection: { filename: `database/${db}` },
    useNullAsDefault: true,
  },
  test: {
    client: 'sqlite3',
    connection: { filename: `database/${db}` },
    useNullAsDefault: true,
  },
};
