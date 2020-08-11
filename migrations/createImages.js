exports.up = function (knex) {
  return knex.schema.createTable('images', function (table) {
    table.increments('imageId').primary();
    table.string('imagePath', 1000).notNullable();
  });
};
exports.down = function (knex) {
  return knex.schema.dropTableIfExists('images');
};
