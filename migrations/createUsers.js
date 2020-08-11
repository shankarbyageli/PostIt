exports.up = function (knex) {
  return knex.schema.createTable('users', function (table) {
    table.increments('userId').primary();
    table.string('username', 255).notNullable().unique();
    table.string('displayName', 255).notNullable();
    table.string('avatarUrl', 1000).notNullable();
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists('users');
};
