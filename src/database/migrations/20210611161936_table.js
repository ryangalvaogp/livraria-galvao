exports.up = function (knex) {
    return knex.schema.createTable('table', function (table) {
        table.string('id').primary();
        table.string('title');
        table.boolean('capacity');
        table.boolean('isBusy').defaultTo(false);
        table.string('roomId');

        table.foreign('roomId').references('id').inTable('room');
    })
};

exports.down = function (knex) {
    return knex.schema.dropTable('table');
};
