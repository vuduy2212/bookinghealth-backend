'use strict';
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('medical_records', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER,
            },
            bookingId: {
                type: Sequelize.INTEGER,
                allowNull: false,
            },
            diagnosis: {
                type: Sequelize.TEXT,
            },
            notes: {
                type: Sequelize.TEXT,
            },
            resultFile: {
                type: Sequelize.BLOB('long'),
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
        await queryInterface.dropTable('medical_records');
    },
};
