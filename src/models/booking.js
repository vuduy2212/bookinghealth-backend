'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Booking extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            Booking.belongsTo(models.User, {
                foreignKey: 'patientId',
                targetKey: 'id',
                as: 'patientData',
            });
            Booking.belongsTo(models.User, {
                foreignKey: 'doctorId',
                targetKey: 'id',
                as: 'doctorData',
            });
            Booking.belongsTo(models.Allcode, {
                foreignKey: 'timeType',
                targetKey: 'keyMap',
                as: 'timeTypeBooking',
            });
            Booking.belongsTo(models.Allcode, {
                foreignKey: 'statusId',
                targetKey: 'keyMap',
                as: 'statusIdBooking',
            });
        }
    }
    Booking.init(
        {
            statusId: DataTypes.STRING,
            doctorId: DataTypes.INTEGER,
            patientId: DataTypes.STRING,
            date: DataTypes.DATE,
            timeType: DataTypes.STRING,
            reason: DataTypes.TEXT('long'),
            result: DataTypes.STRING,
        },
        {
            sequelize,
            modelName: 'Booking',
        }
    );
    return Booking;
};
