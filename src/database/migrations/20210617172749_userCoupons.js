
exports.up = function (knex) {
    return knex.schema
        .createTable('userCoupons', function (table) {
            table.string('id').primary();
            table.string('idUser').notNullable();
            table.string('idCoupon').notNullable();
            table.boolean('isCollected').defaultTo(true);
            table.string('collectedDate');

            table.foreign('idUser')
                .references('id')
                .inTable('user')
                .onDelete('CASCADE')
                .onUpdate('CASCADE');

            table.foreign('idCoupon')
                .references('id')
                .inTable('coupon')
                .onDelete('CASCADE')
                .onUpdate('CASCADE');
        });
};

exports.down = function (knex) {
    return knex.schema.dropTable('userCoupons');
};

