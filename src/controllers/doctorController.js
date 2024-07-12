import { where } from 'sequelize';
import db from '../models/index';
import utils from '../utils/utils';
const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const salt = bcrypt.genSaltSync(10);
const doctorController = {
    async getTopDoctorHome(req, res) {
        let limit = Number(req.params.limit);
        if (!limit) limit = 8;

        try {
            const response = await db.User.findAll({
                where: { roleId: 'R2' },
                limit,
                raw: true,
                attributes: { exclude: ['password'] },
                include: [
                    {
                        model: db.Allcode,
                        as: 'genderData',
                        attributes: ['value'],
                    },
                    {
                        model: db.Doctor_Info,
                        as: 'doctorInfo',
                        attributes: ['id'],
                        include: [
                            {
                                model: db.Clinic,
                                as: 'clinic',
                                attributes: ['id', 'name'],
                            },
                            {
                                model: db.Specialist,
                                as: 'specialist',
                                attributes: ['id', 'name'],
                            },
                            {
                                model: db.Allcode,
                                as: 'positionData',
                                attributes: ['value'],
                            },
                        ],
                    },
                ],
            });
            return res.status(200).json(response);
        } catch (error) {
            return res.status(500).json(error);
        }
    },
    async UpdateProfileDoctor(req, res) {
        try {
            const infoDoctor = await db.Doctor_Info.findOne({
                where: { doctorId: req.params.id },
            });
            if (infoDoctor) {
                await db.Doctor_Info.update(
                    {
                        clinicId: req.body.clinicId,
                        specialistId: req.body.specialistId,
                        price: req.body.price,
                        positionId: req.body.positionId,
                    },
                    {
                        where: {
                            doctorId: req.params.id,
                        },
                        raw: true,
                    },
                );
            } else {
                await db.Doctor_Info.create({
                    doctorId: req.params.id,
                    clinicId: req.body.clinicId,
                    specialistId: req.body.specialistId,
                    price: req.body.price,
                });
            }
            const markdownDoctor = await db.Markdown.findOne({
                where: { doctorId: req.params.id },
            });
            if (markdownDoctor) {
                await db.Markdown.update(
                    {
                        description: req.body.description,
                        contentMarkDown: req.body.contentMarkDown,
                        contentHTML: req.body.contentHTML,
                    },
                    {
                        where: {
                            doctorId: req.params.id,
                        },
                        raw: true,
                    },
                );
                return res.status(200).json('Update Profile Doctor successfully');
            } else {
                await db.Markdown.create({
                    ...req.body,
                    doctorId: req.params.id,
                });
                return res.status(200).json('Create Profile Doctor successfully');
            }
        } catch (error) {
            console.log(error);
            return res.status(500).json(error);
        }
    },
    async GetProfileDoctor(req, res) {
        try {
            const infoDoctor =
                (await db.Doctor_Info.findOne({
                    where: { doctorId: req.params.id },
                    raw: true,
                    exclude: ['id'],
                })) || {};
            const markdownDoctor =
                (await db.Markdown.findOne({
                    where: { doctorId: req.params.id },
                    raw: true,
                    attributes: ['description', 'contentHTML', 'contentMarkdown'],
                })) || {};

            return res.status(200).json({ ...infoDoctor, ...markdownDoctor });
        } catch (error) {
            console.log(error);
            return res.status(500).json(error);
        }
    },
    async GetDetailDoctor(req, res) {
        try {
            let data = await db.User.findOne({
                where: { id: req.params.id },
                attributes: { exclude: ['password'] },
                include: [
                    {
                        model: db.Markdown,
                        attributes: ['description', 'contentHTML', 'contentMarkdown'],
                    },

                    {
                        model: db.Doctor_Info,
                        as: 'doctorInfo',
                        attributes: ['price', 'createdAt'],
                        include: [
                            {
                                model: db.Clinic,
                                as: 'clinic',
                                attributes: ['id', 'name', 'address'],
                            },
                            {
                                model: db.Specialist,
                                as: 'specialist',
                                attributes: ['id', 'name'],
                            },
                            {
                                model: db.Allcode,
                                as: 'positionData',
                                attributes: ['value'],
                            },
                        ],
                    },
                ],
                raw: true,
                nest: true,
            });
            return res.status(200).json(data);
        } catch (error) {}
    },

    async bulkCreateSchedule(req, res) {
        try {
            const doctorId = req.body.doctorId;
            const date = Number(req.body.date);
            await db.Schedule.destroy({
                where: { doctorId, date },
            });
            await db.Schedule.bulkCreate(req.body.arraySchedule);
            return res.status(200).json('');
        } catch (error) {
            console.log(error);
            return res.status(500).json(error);
        }
    },
    async getoneSchedule(req, res) {
        try {
            const doctorId = req.params.id;
            const date = Number(req.params.date);
            const data = await db.Schedule.findAll({
                where: { doctorId, date: date },
                include: [
                    {
                        model: db.Allcode,
                        as: 'timeTypeData',
                        attributes: ['value'],
                    },
                ],
                raw: true,
                nest: true,
            });
            return res.status(200).json(data);
        } catch (error) {
            console.log(error);
            return res.status(500).json(error);
        }
    },
    async getAllOneSpecialist(req, res) {
        try {
            const specialistId = req.params.id;

            const data = await db.Doctor_Info.findAll({
                where: { specialistId },
                include: [
                    {
                        model: db.User,
                        attributes: {
                            exclude: ['password'],
                        },
                        include: [
                            {
                                model: db.Markdown,
                                attributes: ['description', 'contentHTML', 'contentMarkdown'],
                            },
                        ],
                    },

                    {
                        model: db.Clinic,
                        as: 'clinic',
                        attributes: ['name', 'address'],
                    },
                    {
                        model: db.Specialist,
                        as: 'specialist',
                        attributes: ['name'],
                    },
                    {
                        model: db.Allcode,
                        as: 'positionData',
                        attributes: ['value'],
                    },
                ],

                raw: true,
                nest: true,
            });
            return res.status(200).json(data);
        } catch (error) {
            console.log(error);
            return res.status(500).json(error);
        }
    },
    async getAllOneClinic(req, res) {
        try {
            const clinicId = req.params.id;

            const data = await db.Doctor_Info.findAll({
                where: { clinicId },
                include: [
                    {
                        model: db.User,
                        include: [
                            {
                                model: db.Markdown,
                                attributes: ['description', 'contentHTML', 'contentMarkdown'],
                            },
                        ],
                    },
                    {
                        model: db.Clinic,
                        as: 'clinic',
                        attributes: ['name', 'address'],
                    },
                    {
                        model: db.Specialist,
                        as: 'specialist',
                        attributes: ['name'],
                    },
                    {
                        model: db.Allcode,
                        as: 'positionData',
                        attributes: ['value'],
                    },
                ],
                raw: true,
                nest: true,
            });
            return res.status(200).json(data);
        } catch (error) {
            console.log(error);
            return res.status(500).json(error);
        }
    },
    async getAllDoctorOneClinicNoImage(req, res) {
        try {
            const clinicId = req.params.id;

            const data = await db.Doctor_Info.findAll({
                where: { clinicId },
                include: [
                    {
                        model: db.User,
                        attributes: ['id', 'firstName', 'lastName', 'phoneNumber', 'email'],
                    },
                    {
                        model: db.Clinic,
                        as: 'clinic',
                        attributes: ['name', 'address'],
                    },
                    {
                        model: db.Specialist,
                        as: 'specialist',
                        attributes: ['name'],
                    },
                    {
                        model: db.Allcode,
                        as: 'positionData',
                        attributes: ['value'],
                    },
                ],
                raw: true,
                nest: true,
            });
            const users = data.map((element) => {
                return {
                    id: element.User.id,
                    fullName: `${element.User.lastName} ${element.User.firstName}`,
                    email: element.User.email,
                    phoneNumber: element.User.phoneNumber,
                    specialist: element.specialist.name,
                    clinicName: element.clinic.name,
                    position: element.positionDate?.value,
                };
            });
            return res.status(200).json(users);
        } catch (error) {
            console.log(error);
            return res.status(500).json(error);
        }
    },

    // Xóa bác sĩ (chỉ admin phòng khám đó mới xóa được)
    async deleteOneDoctor(req, res) {
        const doctorId = req.params.id;

        try {
            const doctor = await db.Doctor_Info.findOne({ where: { doctorId } });

            if (!doctor) {
                return res.status(404).send({ error: 'Doctor not found' });
            }

            // Kiểm tra xem admin có thuộc phòng khám của bác sĩ này không
            const clinic = await db.Clinic.findOne({ where: { id: doctor.clinicId, adminClinicId: req.user.id } });

            if (!clinic) {
                return res.status(403).send({ error: 'You do not have permission to delete this doctor' });
            }

            await db.Doctor_Info.destroy({ where: { doctorId } });
            await db.User.destroy({ where: { id: doctorId } });
            await db.Markdown.destroy({ where: { doctorId } });

            res.send({ message: 'Doctor deleted successfully' });
        } catch (error) {
            res.status(500).send({ error: 'Internal server error' });
        }
    },
    async createDoctorAccount(req, res) {
        try {
            // const randomPassword = clinicController.generateRandomPassword();
            const randomPassword = '123456';
            const hashed = await bcrypt.hashSync(randomPassword, salt);
            const newDoctor = await db.User.create({
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                email: req.body.email,
                password: hashed,
                phoneNumber: req.body.phoneNumber,
                roleId: 'R2',
            });

            await db.Doctor_Info.create({
                doctorId: newDoctor.id,
                clinicId: req.body.clinicId,
                specialistId: req.body.specialistId,
                positionId: req.body.positionId,
            });
            await db.Markdown.create({
                doctorId: newDoctor.id,
                description: req.body.description,
                contentHTML: req.body.contentHTML,
                contentMarkdown: req.body.contentMarkdown,
            });

            res.status(200).json('Create new Doctor successfully');

            utils.sendEmailAdminClinic(
                req.body.email,
                req.body.firstName,
                req.body.lastName,
                randomPassword,
                req.body.clinicName,
            );
        } catch (error) {
            console.log(error);
            res.status(500).json(error);
        }
    },
};

export default doctorController;
