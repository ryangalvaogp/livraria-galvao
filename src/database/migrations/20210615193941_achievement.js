
exports.up = function (knex) {
    return knex.schema
        .createTable('achievement', function (table) {
            table.string('id').primary();
            table.string('title').notNullable();
            table.string('type').notNullable();
            table.string('reward').notNullable();
            table.integer('amount').notNullable();
            table.boolean('isActive').defaultTo(true);
            
        });
};

exports.down = function (knex) {
    return knex.schema.dropTable('achievement');
};
