exports.up = function (knex) {
    return knex.schema
        .createTable('productsStock', function (table) {
            table.string('idProduct').notNullable();
            table.integer('amount').notNullable();
            table.float('salePrice', 8, 2).notNullable();
            table.float('factoryPrice', 8, 2).notNullable();

            table.foreign('idProduct')
                .references('id')
                .inTable('products')
                .onDelete('CASCADE')
                .onUpdate('CASCADE');
        });
};

exports.down = function (knex) {
    return knex.schema.dropTable('productsStock');
};
