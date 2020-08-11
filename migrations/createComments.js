exports.up = function (knex) {
  return knex.schema.createTable('comments', function (table) {
    table.increments('id').primary();
    table.integer('commentOn');
    table.integer('commentBy');
    table.foreign('commentOn').references('stories.id').onDelete('CASCADE');
    table.foreign('commentBy').references('users.userId').onDelete('CASCADE');
    table.string('comment').notNullable();
    table.datetime('commentedAt').defaultTo(knex.fn.now());
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists('comments');
};
