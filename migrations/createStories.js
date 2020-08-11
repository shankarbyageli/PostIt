exports.up = function (knex) {
  return knex.schema.createTable('stories', function (table) {
    table.increments('id').primary();
    table.decimal('isPublished').notNullable().defaultTo(0);
    table.integer('authorId');
    table.integer('coverImageId');
    table.foreign('authorId').references('userId').inTable('users');
    table.string('title');
    table.string('content');
    table
      .foreign('coverImageId')
      .references('images.imageId')
      .onDelete('CASCADE');
    table.datetime('lastModified').defaultTo(knex.fn.now());
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists('stories');
};
