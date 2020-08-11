module.exports = {
  db: process.env.db,
  clientId: process.env.client_id,
  clientSecret: process.env.client_secret,
  knexDevelopment: process.env.knex_development,
  knexTest: process.env.knex_test,
};
