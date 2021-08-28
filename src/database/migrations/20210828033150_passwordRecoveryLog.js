
exports.up = function (knex) {
    return knex.schema
        .createTable('passwordRecoveryLog', function (table) {
            table.string('id').primary();
            table.string('idUser').notNullable();
            table.string('resetToken').notNullable();
            table.datetime('resetExpires').notNullable();
            table.boolean('isReseted').defaultTo(false);

            table.foreign('idUser')
                .references('id')
                .inTable('user')
                .onDelete('CASCADE')
                .onUpdate('CASCADE');

        });
};

exports.down = function (knex) {
    return knex.schema.dropTable('passwordRecoveryLog');
};

