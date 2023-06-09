import db from '../models/index';
const jwt = require('jsonwebtoken');
const authController = {
    async registerUser(req, res) {
        try {
            const newUser = await db.User.create({
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                phoneNumber: req.body.phoneNumber,
                email: req.body.email,
                password: req.body.password,
            });
            res.status(200).json(newUser);
        } catch (err) {
            res.status(500).json(err);
        }
    },
    async loginUser(req, res) {
        try {
            const user = await db.User.findOne({
                where: {
                    email: req.body.email,
                },
            });
            if (!user) {
                return res.status(404).json('Wrong username!');
            }
            const validPassword = user.password == req.body.password;
            if (!validPassword) {
                return res.status(404).json('Wrong password!');
            }
            if (user && validPassword) {
                const accessToken = jwt.sign(
                    {
                        id: user.id,
                        roldId: user.roldId,
                    },
                    process.env.JWT_ACCESS_KEY,
                    {
                        expiresIn: '365d',
                    }
                );
                const { password, ...others } = user.dataValues;
                return res.status(200).json({ ...others, accessToken });
            }
        } catch (error) {
            res.status(500).json(error);
        }
    },
};

module.exports = authController;
