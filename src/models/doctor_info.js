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
            Doctor_Info.belongsTo(models.User, { foreignKey: 'doctorId' });
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
        },
        {
            sequelize,
            modelName: 'Doctor_Info',
        }
    );
    return Doctor_Info;
};
