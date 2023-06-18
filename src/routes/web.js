import express from 'express';
import homeController from '../controllers/homeController.js';
let router = express.Router();

let initWebRoutes = (app) => {
    router.delete('/user/:id/delete', homeController.deleteUsers);
    router.get('/user/:id/update', homeController.getUpdatePage);
    router.put('/user/:id/update/submit', homeController.putUpdate);
    router.post('/register/submit', homeController.postRegisterPage);
    router.get('/register', homeController.getRegisterPage);
    router.get('/about', homeController.getAboutPage);
    router.get('/display/users', homeController.getDisplayUsers);
    router.get('/', homeController.getHomePage);
    app.use('/', router);
};

export default initWebRoutes;
