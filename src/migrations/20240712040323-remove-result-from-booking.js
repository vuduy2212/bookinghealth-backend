'use strict';

module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.removeColumn('bookings', 'result');
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.addColumn('bookings', 'result', {
            type: Sequelize.STRING,
            allowNull: true,
        });
    },
};
