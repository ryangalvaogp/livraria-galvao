
exports.up = function (knex) {
    return knex.schema
        .createTable('bookStock', function (table) {
            table.string('idBook').notNullable();
            table.integer('amount').notNullable();
            table.float('salePrice', 8, 2).notNullable();
            table.float('factoryPrice', 8, 2).notNullable();

            table.foreign('idBook').references('id').inTable('books');
        });
};

exports.down = function (knex) {
    return knex.schema.dropTable('bookStock');
};
