
exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.table('calendar', function(table) {
        table.dropColumn('startTime');
        table.dropColumn('endTime');
        table.string('start');
        table.string('end');
      })
  ]);
};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.table('calendar', function(table) {
      table.time('startTime');
      table.time('endTime');
      table.dropColumn('start');
      table.dropColumn('end');
    })
  ]);
};
