
exports.up = function (knex) {
    return knex.schema
        .createTable('userReadBook', function (table) {
            table.string('idUserReadBook').primary();
            table.string('idUser').notNullable();
            table.string('idBook').notNullable();
            table.boolean('isRead').defaultTo(false);
            table.string('dateStart');
            table.string('destiny');
            table.string('dateEnd');
            table.integer('assessment').defaultTo(null);;
            table.string('review');

            table.foreign('idUser')
                .references('id')
                .inTable('user')
                .onDelete('CASCADE')
                .onUpdate('CASCADE');

            table.foreign('idBook')
                .references('id')
                .inTable('books')
                .onDelete('CASCADE')
                .onUpdate('CASCADE');
        });
};

exports.down = function (knex) {
    return knex.schema.dropTable('userReadBook');
};
