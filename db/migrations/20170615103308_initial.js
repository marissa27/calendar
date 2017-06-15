
exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.createTable('calendar', function(table) {
      table.increments('id').primary();
      table.string('title');
      table.string('description');
      table.time('startTime');
      table.time('endTime');

      table.timestamps(true, true);
    }),
  ])
};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.dropTable('calendar'),
  ]);
};
