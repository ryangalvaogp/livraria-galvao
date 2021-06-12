
exports.up = function (knex) {
    return knex.schema
        .createTable('books', function (table) {
            table.string('id').primary();
            table.string('title').notNullable();
            table.string('author').notNullable();
            table.string('isbn');
            table.string('category').notNullable();
            table.integer('editionNumber')
            table.string('publishingCompany')
            table.string('placeOfPublication');
            table.integer('pages').notNullable();
            table.integer('cddcdu');
        });
};

exports.down = function (knex) {
    return knex.schema.dropTable('books');
};
