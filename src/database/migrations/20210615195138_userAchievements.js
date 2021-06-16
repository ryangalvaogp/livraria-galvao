
exports.up = function (knex) {
    return knex.schema
        .createTable('userAchievements', function (table) {
            table.string('id').primary();
            table.string('idUser').notNullable();
            table.string('idAchievement').notNullable();
            table.string('achievementDate').notNullable();
            table.boolean('isCollected').defaultTo(true);
            table.string('collectedDate');

            table.foreign('idUser')
                .references('id')
                .inTable('user')
                .onDelete('CASCADE')
                .onUpdate('CASCADE');

            table.foreign('idAchievement')
                .references('id')
                .inTable('achievement')
                .onDelete('CASCADE')
                .onUpdate('CASCADE');
        });
};

exports.down = function (knex) {
    return knex.schema.dropTable('userAchievements');
};

