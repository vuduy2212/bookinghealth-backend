import db from '../models/index';
import utils from '../utils/utils';
const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const salt = bcrypt.genSaltSync(10);

const clinicController = {
    generateRandomPassword() {
        return crypto.randomBytes(4).toString('hex').slice(0, 8); // Generates an 8-character random password
    },
    async createNewClinic(req, res) {
        try {
            const clinic = await db.Clinic.create({
                name: req.body.name,
                address: req.body.address,
                phoneNumber: req.body.phoneNumber,
                image: req.body.image,
                logo: req.body.logo,
            });
            const clinicId = clinic.id;
            await db.Markdown.create({
                clinicId: clinicId,
                description: req.body.description,
                contentHTML: req.body.contentHTML || '',
                contentMarkdown: req.body.contentMarkdown || '',
            });
            res.status(200).json('Create new Clinic successfully');
        } catch (error) {
            console.log(error);
            res.status(500).json(error);
        }
    },
    async getAllClinicNoImage(req, res) {
        // no get image
        try {
            const response = await db.Clinic.findAll({
                attributes: {
                    exclude: ['image', 'logo'],
                },
            });
            res.status(200).json(response);
        } catch (error) {
            res.status(500).json(error);
        }
    },
    async getAllClinic(req, res) {
        try {
            const response = await db.Clinic.findAll({
                attributes: {
                    exclude: ['image'],
                },
            });
            res.status(200).json(response);
        } catch (error) {
            res.status(500).json(error);
        }
    },
    async getAllClinicWithAdminInfo(req, res) {
        //  get image
        try {
            const response = await db.Clinic.findAll({
                attributes: {
                    exclude: ['logo', 'image', 'description', 'contentHTML', 'contentMarkdown'],
                },
                include: [
                    {
                        model: db.User,
                        attributes: [
                            //['name', 'adminClinicName'],
                            ['email', 'adminClinicEmail'],
                            ['phoneNumber', 'adminClinicPhone'],
                        ],
                    },
                ],
            });
            res.status(200).json(response);
        } catch (error) {
            res.status(500).json(error);
        }
    },
    async getAllClinicName(req, res) {
        // no get image
        try {
            const response = await db.Clinic.findAll({
                attributes: ['id', 'name'],
            });
            res.status(200).json(response);
        } catch (error) {
            res.status(500).json(error);
        }
    },
    async getAllClinicName(req, res) {
        // no get image
        try {
            const response = await db.Clinic.findAll({
                attributes: ['id', 'name'],
            });
            res.status(200).json(response);
        } catch (error) {
            res.status(500).json(error);
        }
    },
    async getLimitClinic(req, res) {
        try {
            let limit = Number(req.params.limit);
            if (!limit) limit = 8;
            const response = await db.Clinic.findAll({
                limit,
                raw: true,
                attributes: {
                    exclude: ['image'],
                },
            });
            res.status(200).json(response);
        } catch (error) {
            res.status(500).json(error);
        }
    },
    async getOneClinic(req, res) {
        try {
            const response = await db.Clinic.findOne({
                where: { id: req.params.id },
                include: [
                    {
                        model: db.Markdown,
                        attributes: ['description', 'contentHTML', 'contentMarkdown'],
                    },
                    {
                        model: db.User,
                        as: 'adminClinic',
                        attributes: ['firstName', 'lastName', 'phoneNumber', 'email'],
                    },
                ],
                raw: true,
                nest: true,
            });
            res.status(200).json(response);
        } catch (error) {
            res.status(500).json(error);
        }
    },

    async updateOneClinic(req, res) {
        const data = req.body;
        const { name, address, phoneNumber, image, logo, ...dataMarkdown } = data;
        const promise = Promise.all([
            db.Clinic.update(
                { name, address, phoneNumber, image, logo },
                {
                    where: { id: req.params.id },
                },
            ),
            db.Markdown.update(dataMarkdown, {
                where: { clinicId: req.params.id },
            }),
        ]);
        promise
            .then(() => {
                res.status(200).json('Update successfully');
            })
            .catch((error) => {
                res.status(500).json(error);
            });
    },
    async deleteOneClinic(req, res) {
        const clinicId = req.params.id;

        // Tìm phòng khám
        const clinic = await db.Clinic.findOne({
            where: { id: clinicId },
        });

        if (!clinic) {
            return res.status(404).json({ error: 'Clinic not found' });
        }

        const promise = Promise.all([
            db.Clinic.destroy({
                where: { id: req.params.id },
            }),
            db.Markdown.destroy({
                where: { clinicId: req.params.id },
            }),
            db.User.destroy({
                where: { id: clinic.adminClinicId, roleId: 'R4' },
            }),
        ]);
        promise
            .then(() => {
                res.status(200).json('Delete successfully');
            })
            .catch((error) => {
                console.log(error);
                res.status(500).json(error);
            });
    },
    async createNewClinicAndAdmin(req, res) {
        try {
            const randomPassword = clinicController.generateRandomPassword();
            const hashed = await bcrypt.hashSync(randomPassword, salt);
            const newAdmin = await db.User.create({
                firstName: req.body.firstNameAdmin,
                lastName: req.body.lastNameAdmin,
                email: req.body.emailAdmin,
                password: hashed,
                phoneNumber: req.body.phoneNumberAdmin,
                roleId: 'R4',
            });
            const clinic = await db.Clinic.create({
                name: req.body.name,
                address: req.body.address,
                phoneNumber: req.body.phoneNumber,
                image: req.body.image,
                logo: req.body.logo,
                adminClinicId: newAdmin.id,
            });
            const clinicId = clinic.id;
            await db.Markdown.create({
                clinicId: clinicId,
                description: req.body.description,
                contentHTML: req.body.contentHTML || '',
                contentMarkdown: req.body.contentMarkdown || '',
            });

            res.status(200).json('Create new Clinic successfully');

            utils.sendEmailAdminClinic(
                req.body.emailAdmin,
                req.body.firstNameAdmin,
                req.body.lastNameAdmin,
                randomPassword,
                req.body.clinicName,
            );
        } catch (error) {
            console.log(error);
            res.status(500).json(error);
        }
    },
};
export default clinicController;
