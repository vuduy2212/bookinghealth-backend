'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('Bookings', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER,
            },
            statusId: {
                allowNull: false,
                type: Sequelize.STRING,
            },
            doctorId: {
                allowNull: false,
                type: Sequelize.INTEGER,
            },
            patientId: {
                allowNull: false,
                type: Sequelize.STRING,
            },
            date: {
                allowNull: false,
                type: Sequelize.DATE,
            },
            timeType: {
                allowNull: false,
                type: Sequelize.STRING,
            },
            reason: {
                type: Sequelize.TEXT('long'),
            },
            result: {
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
        await queryInterface.dropTable('Bookings');
    },
};
