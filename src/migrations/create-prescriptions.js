'use strict';
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('prescriptions', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER,
            },
            medical_record_id: {
                type: Sequelize.INTEGER,
            },
            medicationId: {
                type: Sequelize.INTEGER,
            },
            dosage: {
                type: Sequelize.TEXT,
            },
            instructions: {
                type: Sequelize.TEXT,
            },
            quantity: {
                type: Sequelize.STRING,
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
        await queryInterface.dropTable('prescriptions');
    },
};
