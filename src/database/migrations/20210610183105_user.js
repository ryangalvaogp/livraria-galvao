
exports.up = function (knex) {
    return knex.schema
        .createTable('user', function (table) {
            table.string('id').primary();
            table.string('avatarUrl').defaultTo(null)
            table.string('name').notNullable();
            table.string('email').notNullable();            
            table.string('cpf').notNullable();
            table.string('cell').notNullable();            
            table.string('password').notNullable();
            table.string('city');
            table.string('street');
            table.string('neighborhood');
            table.integer('n');
            table.integer('cep');
            table.integer('permission').notNullable();
            table.integer('xp').notNullable();
            table.boolean('premium').notNullable();
            table.string('registrationDate').notNullable();
        });
};

exports.down = function (knex) {
    return knex.schema.dropTable('user');
};
