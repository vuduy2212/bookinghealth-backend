'use strict';
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('medications', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER,
            },
            name: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            composition: {
                type: Sequelize.TEXT,
            },
            dosage: {
                type: Sequelize.TEXT,
            },
            instructions: {
                type: Sequelize.TEXT,
            },
            clinicId: {
                type: Sequelize.INTEGER,
            },
            createdAt: {
                allowNull: false,
                type: Sequelize.DATE,
            },
            updatedAt: {
                allowNull: false,
                type: Sequelize.DATE,
            },
        });
    },
    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('medications');
    },
};
