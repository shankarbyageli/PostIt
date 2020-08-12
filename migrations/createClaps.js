exports.up = function (knex) {
  return knex.schema.createTable('claps', function (table) {
    table.integer('storyId');
    table.integer('clappedBy');
    table.primary(['clappedBy', 'storyId']);
    table.foreign('clappedBy').references('users.userId').onDelete('CASCADE');
    table.foreign('storyId').references('stories.id').onDelete('CASCADE');
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists('claps');
};
