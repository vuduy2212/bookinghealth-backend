'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Clinic extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            Clinic.hasOne(models.Markdown, { foreignKey: 'clinicId' });
            Clinic.belongsToMany(models.User, {
                through: {
                    model: models.Doctor_Info,
                },
                foreignKey: 'clinicId',
            });
        }
    }
    Clinic.init(
        {
            name: DataTypes.STRING,
            address: DataTypes.STRING,
            phoneNumber: DataTypes.STRING,
            image: DataTypes.STRING,
            logo: DataTypes.STRING,
        },
        {
            sequelize,
            modelName: 'Clinic',
        }
    );
    return Clinic;
};
