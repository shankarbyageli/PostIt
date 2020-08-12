const { knexDevelopment, knexTest } = require('./config');

module.exports = {
  development: {
    client: 'sqlite3',
    connection: { filename: knexDevelopment },
    useNullAsDefault: true,
  },
  test: {
    client: 'sqlite3',
    connection: { filename: knexTest },
    useNullAsDefault: true,
  },
};
