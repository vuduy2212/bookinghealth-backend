'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Doctor_Info extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            Doctor_Info.belongsTo(models.Allcode, {
                foreignKey: 'positionId',
                targetKey: 'keyMap',
                as: 'positionData',
            });
            Doctor_Info.belongsTo(models.User, { foreignKey: 'doctorId' });
            Doctor_Info.belongsTo(models.Clinic, {
                foreignKey: 'clinicId', // Khóa ngoại trong Doctor_Info tham chiếu đến Clinic
                as: 'clinic',
            });
            Doctor_Info.belongsTo(models.Specialist, {
                foreignKey: 'specialistId', // Khóa ngoại trong Doctor_Info tham chiếu đến Specialist
                as: 'specialist',
            });
        }
    }
    Doctor_Info.init(
        {
            doctorId: DataTypes.INTEGER,
            clinicId: DataTypes.INTEGER,
            specialistId: DataTypes.INTEGER,
            price: DataTypes.INTEGER,
            note: DataTypes.STRING,
            count: DataTypes.INTEGER,
            positionId: DataTypes.STRING, // only doctor
        },
        {
            sequelize,
            modelName: 'Doctor_Info',
        },
    );
    return Doctor_Info;
};
