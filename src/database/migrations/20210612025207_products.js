
exports.up = function (knex) {
    return knex.schema
        .createTable('products', function (table) {
            table.string('id').primary();
            table.string('title').notNullable();
            table.string('description').notNullable();
            table.string('category').notNullable();
            table.integer('likes').defaultTo(0).notNullable();
        });
};

exports.down = function (knex) {
    return knex.schema.dropTable('products');
};