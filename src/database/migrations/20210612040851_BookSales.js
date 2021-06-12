exports.up = function (knex) {
    return knex.schema
        .createTable('bookSales', function (table) {
            table.string('idSale').primary();
            table.string('idClient').notNullable();
            table.string('idEmployee').notNullable();
            table.string('idBook').notNullable();
            table.integer('amount').notNullable();
            table.float('offeredPrice', 8, 2).notNullable();
            table.float('soldPrice', 8, 2).notNullable();
            table.float('factoryPrice', 8, 2).notNullable();
            table.string('saleDate').notNullable();
            table.string('paymentMethod').notNullable();

            table.foreign('idBook')
                .references('id')
                .inTable('books')
                .onDelete('CASCADE')
                .onUpdate('CASCADE');

            table.foreign('idClient')
                .references('id')
                .inTable('user')
                .onDelete('CASCADE')
                .onUpdate('CASCADE');

            table.foreign('idEmployee')
                .references('id')
                .inTable('user')
                .onDelete('CASCADE')
                .onUpdate('CASCADE');
        });
};

exports.down = function (knex) {
    return knex.schema.dropTable('bookSales');
};