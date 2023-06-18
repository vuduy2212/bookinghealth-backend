import db from '../models/index';
import CRUDService from '../services/CRUDService';
class homeController {
    async getHomePage(req, res) {
        try {
            let data = await db.User.findAll();
            // res.render('homepage.ejs', {
            //     data: JSON.stringify(data),
            // });
            res.json(data);
        } catch (error) {
            console.log(error);
        }
    }
    getAboutPage(req, res) {
        res.render('aboutpage.ejs');
    }
    getRegisterPage(req, res) {
        res.render('registerpage.ejs');
    }
    async postRegisterPage(req, res) {
        await CRUDService.createNewUser(req.body);
        res.render('submit-register-page.ejs', {
            user: req.body,
            keys: Object.keys(req.body),
        });
    }
    async getDisplayUsers(req, res) {
        const users = await CRUDService.getAllUsers();
        res.status(200).json(users);
    }
    async getUpdatePage(req, res) {
        const user = await CRUDService.getOneUser({ id: req.params.id });
        res.render('updatepage.ejs', {
            user: user[0],
        });
    }
    async putUpdate(req, res) {
        await CRUDService.updateOneUser(req.body, { id: req.params.id });
        res.redirect('/display/users');
    }
    async deleteUsers(req, res) {
        await CRUDService.deleteUsers({ id: req.params.id });
        res.redirect('/display/users');
    }
}
module.exports = new homeController();
