
exports.up = function (knex) {
    return knex.schema
        .createTable('user', function (table) {
            table.string('id').primary();
            table.string('avatarUrl').defaultTo('https://upload.wikimedia.org/wikipedia/commons/6/6e/Breezeicons-actions-22-im-user.svg')
            table.string('name').notNullable();
            table.string('email').notNullable();
            table.string('city').notNullable();
            table.string('street').notNullable();
            table.string('neighborhood').notNullable();
            table.integer('n').notNullable();
            table.integer('cep').notNullable();
            table.string('cpf').notNullable();
            table.string('cell').notNullable();
            table.integer('permission').notNullable();
            table.integer('xp').notNullable();
            table.boolean('premium').notNullable();
            table.string('registrationDate').notNullable();
            table.string('password').notNullable();
        });
};

exports.down = function (knex) {
    return knex.schema.dropTable('user');
};
