import db from '../models/index';
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const salt = bcrypt.genSaltSync(10);
const authController = {
    async registerUser(req, res) {
        try {
            const usedEmail = await db.User.findOne({
                where: { email: req.body.email },
            });
            const usedPhone = await db.User.findOne({
                where: { phoneNumber: req.body.phoneNumber },
            });

            if (usedEmail) {
                return res.status(404).json('Email đã được sử dụng, vui lòng thử email khác');
            }
            if (usedPhone) {
                return res.status(404).json('Số điện thoại đã được sử dụng');
            }
            const hashed = await bcrypt.hashSync(req.body.password, salt);

            const newUser = await db.User.create({
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                phoneNumber: req.body.phoneNumber,
                email: req.body.email,
                password: hashed,
                roleId: req.body.roleId,
            });
            return res.status(200).json(newUser);
        } catch (err) {
            return res.status(500).json(err);
        }
    },

    generateAccessToken(user) {
        return jwt.sign(
            {
                id: user.id,
                roleId: user.roleId,
            },
            process.env.JWT_ACCESS_KEY,
            {
                expiresIn: '20s',
            },
        );
    },

    generateRefreshToken(user) {
        return jwt.sign(
            {
                id: user.id,
                roleId: user.roleId,
            },
            process.env.JWT_REFRESH_KEY,
            {
                expiresIn: '365d',
            },
        );
    },

    async loginUser(req, res) {
        try {
            const user = await db.User.findOne({
                where: {
                    email: req.body.email,
                },
            });

            if (!user) {
                return res.status(404).json('Email không đúng, vui lòng thử lại');
            }
            const validPassword = await bcrypt.compare(req.body.password, user.password);
            if (!validPassword) {
                return res.status(404).json('Mật khẩu không đúng, vui lòng thử lại');
            }
            if (user.roleId === 'R1x' || user.roleId === 'R2x') {
                return res
                    .status(404)
                    .json('Tài khoản của bạn chưa được xác thực!  Vui lòng liên hệ admin để xác thực tài khoản');
            }
            if (user && validPassword) {
                const accessToken = authController.generateAccessToken(user);
                const refreshToken = authController.generateRefreshToken(user);
                res.cookie('refreshToken', refreshToken, {
                    httpOnly: true,
                    secure: false,
                    path: '/',
                    sameSite: 'strict',
                    maxAge: 365 * 24 * 60 * 60 * 1000,
                });
                const { password, ...others } = user.dataValues;
                const clinic = await db.Clinic.findOne({
                    where: {
                        adminClinicId: user.id,
                    },
                    attributes: ['id', 'name'],
                });
                const doctorInfo = await db.Doctor_Info.findOne({
                    where: {
                        doctorId: user.id,
                    },
                    attributes: ['clinicId'],
                });
                if (clinic && user.roleId == 'R4') {
                    return res
                        .status(200)
                        .json({ ...others, accessToken, clinicId: clinic.id, clinicName: clinic.name });
                }
                if (doctorInfo && user.roleId == 'R2') {
                    return res.status(200).json({ ...others, accessToken, clinicId: doctorInfo.clinicId });
                }
                return res.status(200).json({ ...others, accessToken });
            }
        } catch (error) {
            console.log(error);
            return res.status(500).json(error);
        }
    },

    async requestRefreshToken(req, res) {
        //Get refresh token from user login
        const refreshToken = req.cookies.refreshToken;
        if (!refreshToken) {
            return res.status(401).json("You're not authenticated");
        }
        jwt.verify(refreshToken, process.env.JWT_REFRESH_KEY, (err, user) => {
            if (err) {
                return res.status(403).json('Refresh Token is not valid');
            }

            // Create new accessToken and refreshToken
            const newAccessToken = authController.generateAccessToken(user);
            const newRefreshToken = authController.generateRefreshToken(user);
            res.cookie('refreshToken', newRefreshToken, {
                httpOnly: true,
                secure: false,
                path: '/',
                sameSite: 'strict',
                maxAge: 365 * 24 * 60 * 60 * 1000,
            });
            return res.status(200).json({ accessToken: newAccessToken });
        });
    },

    async logOut(req, res) {
        res.clearCookie('refreshToken');
        res.status(200).json('Logged out successfully!');
    },

    async createClinicAdmin(req, res) {
        try {
            const usedEmail = await db.User.findOne({
                where: { email: req.body.email },
            });
            const usedPhone = await db.User.findOne({
                where: { phoneNumber: req.body.phoneNumber },
            });
            if (usedEmail) {
                return res.status(404).json('Email đã được sử dụng, vui lòng thử email khác');
            }
            if (usedPhone) {
                return res.status(404).json('Số điện thoại đã được sử dụng');
            }
            const hashed = await bcrypt.hashSync(req.body.password, salt);
            const newUser = await db.User.create({
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                phoneNumber: req.body.phoneNumber,
                email: req.body.email,
                password: hashed,
                roleId: 'R4',
            });
            return res.status(200).json(newUser);
        } catch (err) {
            console.log(err);
            return res.status(500).json(err);
        }
    },

    async testEmail(req, res) {
        try {
            const transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: 'vuduy.22122002@gmail.com',
                    pass: 'vxjq azup pekx rovg',
                },
            });
            const mailOptions = {
                from: 'vuduy.22122002@gmail.com',
                to: 'vuduy.2212@gmail.com',
                subject: 'Test email',
                text: `test emial`,
            };
            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    return res.status(500).json({ message: 'Error sending email', error });
                }
                res.status(200).json({ message: 'User created and email sent' });
            });
        } catch (error) {
            res.status(500).json(error);
        }
    },
    async changePassword(req, res) {
        try {
            console.log('sdfsd');
            const userId = req.user.id; // Giả sử bạn đã xác thực và có userId trong req.user
            console.log(userId);
            const { oldPassword, newPassword } = req.body;

            const user = await db.User.findOne({
                where: { id: userId },
            });
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }

            // Kiểm tra mật khẩu cũ
            const isMatch = await bcrypt.compare(oldPassword, user.password);
            if (!isMatch) {
                return res.status(400).json({ message: 'Old password is incorrect' });
            }

            // Mã hóa mật khẩu mới
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(newPassword, salt);

            // Cập nhật mật khẩu mới trong cơ sở dữ liệu
            user.password = hashedPassword;
            await user.save();

            res.status(200).json({ message: 'Password changed successfully' });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Server error' });
        }
    },
};

module.exports = authController;
