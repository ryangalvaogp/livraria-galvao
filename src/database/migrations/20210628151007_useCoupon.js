
exports.up = function (knex) {
    return knex.schema
        .createTable('useCoupon', function (table) {
            table.string('id').primary();
            table.string('idUserCoupon').notNullable();
            table.string('idSale').notNullable();

            table.foreign('idUserCoupon')   
                .references('id')
                .inTable('userCoupons')
                .onDelete('CASCADE')
                .onUpdate('CASCADE');
        });
};

exports.down = function (knex) {
    return knex.schema.dropTable('useCoupon');
};
