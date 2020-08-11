exports.up = function (knex) {
  return knex.schema.createTable('tags', function (table) {
    table.integer('storyId');
    table.foreign('storyId').references('stories.id').onDelete('CASCADE');
    table.string('tag').notNullable();
  });
};
exports.down = function (knex) {
  return knex.schema.dropTableIfExists('tags');
};
