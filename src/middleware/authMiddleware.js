const jwt = require('jsonwebtoken');
import db from '../models/index';

const authMiddleware = {
    async verifyToken(req, res, next) {
        const token = req.headers.token; // Lấy token từ user login
        if (token) {
            const accessToken = token.split(' ')[1]; // token : Bearer 61d5s1fsdf5s1df3
            jwt.verify(accessToken, process.env.JWT_ACCESS_KEY, (err, user) => {
                if (err) {
                    return res.status(403).json('Token is not valid');
                }
                req.user = user;
                next();
            });
        } else {
            return res.status(401).json("You 're not authenticated");
        }
    },
    verifyTokenAndUserAuthorization(req, res, next) {
        authMiddleware.verifyToken(req, res, () => {
            if (req.user.id == req.params.id || req.user.roleId == 'R1') {
                next();
            } else {
                res.status(403).json("You're not allowed to do that!");
            }
        });
    },
    verifyTokenAndAdmin(req, res, next) {
        authMiddleware.verifyToken(req, res, () => {
            if (req.user.roleId === 'R1') {
                next();
            } else {
                res.status(403).json("You're not allowed to do that!");
            }
        });
    },
    verifyTokenAndDoctor(req, res, next) {
        authMiddleware.verifyToken(req, res, () => {
            if (req.user.roleId === 'R2') {
                next();
            } else {
                res.status(403).json("You're not allowed to do that!");
            }
        });
    },
    verifyTokenAndDoctorAndAdmin(req, res, next) {
        authMiddleware.verifyToken(req, res, () => {
            if (req.user.roleId === 'R2' || req.user.roleId === 'R1') {
                next();
            } else {
                res.status(403).json("You're not allowed to do that!");
            }
        });
    },

    verifyTokenToUpdateClinic(req, res, next) {
        authMiddleware.verifyToken(req, res, async () => {
            try {
                if (req.user.roleId !== 'R4') {
                    return res.status(403).json("You're not allowed to do that!");
                }
                const adminClinicId = req.params.id;

                if (adminClinicId == req.user.id) {
                    next();
                } else {
                    return res.status(403).json({ msg: 'Access denied' });
                }
            } catch (error) {
                res.status(403).json("You're not allowed to do that !");
            }
        });
    },
    verifyTokenAndAdminClinic(req, res, next) {
        authMiddleware.verifyToken(req, res, () => {
            if (req.user.roleId === 'R4') {
                next();
            } else {
                res.status(403).json("You're not allowed to do that!");
            }
        });
    },
};

module.exports = authMiddleware;
