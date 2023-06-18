import db from '../models/index';
class CRUDService {
    createNewUser(data) {
        return new Promise(async (resolve, reject) => {
            try {
                await db.User.create(data);
                resolve();
            } catch (error) {
                console.log(error);
            }
        });
    }
    getAllUsers() {
        return new Promise(async (resolve, reject) => {
            try {
                const data = await db.User.findAll({ raw: true });
                resolve(data);
            } catch (error) {
                console.log(error);
            }
        });
    }
    getOneUser(data) {
        return new Promise(async (resolve, reject) => {
            try {
                const user = await db.User.findAll({ where: data, raw: true });
                resolve(user);
            } catch (error) {
                console.log(error);
            }
        });
    }
    updateOneUser(object1, object2) {
        return new Promise(async (resolve, reject) => {
            try {
                await db.User.update(object1, { where: object2 });
                resolve();
            } catch (error) {
                console.log(error);
            }
        });
    }
    deleteUsers(data) {
        return new Promise(async (resolve, reject) => {
            try {
                await db.User.destroy({ where: data });
                resolve();
            } catch (error) {
                console.log(error);
            }
        });
    }
}

module.exports = new CRUDService();
