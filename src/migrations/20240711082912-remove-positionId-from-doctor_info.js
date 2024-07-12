'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        return queryInterface.removeColumn('doctor_infos', 'positionId');
    },

    down: async (queryInterface, Sequelize) => {
        return queryInterface.addColumn('doctor_infos', 'positionId', {
            type: Sequelize.INTEGER,
            allowNull: true,
        });
    },
};
