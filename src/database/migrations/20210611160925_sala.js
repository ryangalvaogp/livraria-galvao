exports.up = function(knex) {
  return knex.schema.createTable('room', function(table){
    table.string('id').primary();
    table.string('title');
  })
};

exports.down = function(knex) {
    return knex.schema.dropTable('room');
};
