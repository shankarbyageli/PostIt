exports.up = function (knex) {
  return knex.schema.createTable('followers', function (table) {
    table.integer('userId');
    table.integer('followerId');
    table.foreign('userId').references('users.userId').onDelete('CASCADE');
    table.foreign('followerId').references('users.userId').onDelete('CASCADE');
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists('followers');
};
