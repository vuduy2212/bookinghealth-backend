import { where } from 'sequelize';
import db from '../models/index';
const bookingController = {
    async postBookAppointment(req, res) {
        const date = Number(req.body.date);
        try {
            const schedule = await db.Schedule.findOne({
                where: {
                    doctorId: req.body.doctorId,
                    date,
                    timeType: req.body.timeType,
                },
                raw: true,
            });
            if (schedule === null) {
                return res.status(200).json({
                    schedule: false,
                    message: 'Xin lỗi! Bác sĩ không có lịch khám vào khung giờ này',
                });
            }
            if (schedule.currentNumber >= schedule.maxNumber) {
                return res.status(200).json({
                    schedule: false,
                    message: 'Xin lỗi! Số lượng bệnh nhân trong khung giờ này đã đầy',
                });
            }
            const booking = await db.Booking.findOrCreate({
                where: {
                    patientId: req.body.patientId,
                    date,
                    timeType: req.body.timeType,
                },
                defaults: {
                    statusId: 'S1',
                    doctorId: req.body.doctorId,
                    patientId: req.body.patientId,
                    date,
                    timeType: req.body.timeType,
                    reason: req.body.reason,
                },
            });
            if (booking[1] === true) {
                await db.Schedule.update(
                    {
                        currentNumber: schedule.currentNumber + 1,
                    },
                    {
                        where: {
                            ...schedule,
                        },
                        raw: true,
                    },
                );
                return res.status(200).json({
                    schedule: true,
                    created: true,
                    message: 'Post Book Appointment Successfully',
                });
            } else {
                return res.status(200).json({
                    schedule: true,
                    created: false,
                    message: 'The appointment failed because you already made an appointment for this time slot',
                });
            }
        } catch (error) {
            console.log(error);
            return res.status(500).json(error);
        }
    },

    async getAllNewBooking(req, res) {
        try {
            const data = await db.Booking.findAll({
                where: {
                    statusId: 'S1',
                },
                include: [
                    {
                        model: db.Allcode,
                        as: 'timeTypeBooking',
                        attributes: ['value'],
                    },
                    {
                        model: db.User,
                        as: 'patientData',
                        attributes: ['firstName', 'lastName', 'gender', 'address', 'yearOfBirth', 'phoneNumber'],
                        include: [
                            {
                                model: db.Allcode,
                                as: 'genderData',
                                attributes: ['value'],
                                raw: true,
                                nest: true,
                            },
                        ],
                        raw: true,
                        nest: true,
                    },
                    {
                        model: db.User,
                        as: 'doctorData',
                        attributes: ['firstName', 'lastName', 'gender', 'phoneNumber'],
                        include: [
                            {
                                model: db.Allcode,
                                as: 'genderData',
                                attributes: ['value'],
                                raw: true,
                                nest: true,
                            },

                            {
                                model: db.Doctor_Info,
                                as: 'doctorInfo',
                                attributes: ['price'],
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
                                        raw: true,
                                        nest: true,
                                    },
                                ],
                                raw: true,
                                nest: true,
                            },
                        ],
                        raw: true,
                        nest: true,
                    },
                ],
                raw: true,
                nest: true,
            });
            const dataFinal = data.map((item, index) => {
                return {
                    id: item.id,
                    namePatient: item.patientData.lastName + '' + item.patientData.firstName,
                    phoneNumberPatient: item.patientData.phoneNumber,
                    yearOfBirthPatient: item.patientData.yearOfBirth,
                    genderPatient: item.patientData.genderData.value,
                    addressPatient: item.patientData.address,
                    reason: item.reason,
                    nameDoctor: item.doctorData.lastName + '' + item.doctorData.firstName,
                    phoneNumberDoctor: item.doctorData.phoneNumber,
                    genderDoctor: item.doctorData.genderData.value,
                    positionDoctor: item.doctorData.doctorInfo.positionData.value,
                    clinic: item.doctorData.doctorInfo.clinic.name,
                    specialist: item.doctorData.doctorInfo.specialist.name,
                    addressClinic: item.doctorData.doctorInfo.clinic.address,
                    price: item.doctorData.doctorInfo.price,
                    time: item.timeTypeBooking.value,
                    date: new Date(item.date).toLocaleDateString('en-GB'),
                    timeBooking:
                        new Date(item.createdAt).toLocaleTimeString() +
                        ' ' +
                        new Date(item.createdAt).toLocaleDateString('en-GB'),
                };
            });
            return res.status(200).json(dataFinal);
        } catch (error) {
            console.log(error);
            return res.status(500).json(error);
        }
    },

    async getAllNewBookingOneClinic(req, res) {
        try {
            const data = await db.Booking.findAll({
                where: {
                    statusId: 'S1',
                },
                include: [
                    {
                        model: db.Allcode,
                        as: 'timeTypeBooking',
                        attributes: ['value'],
                    },
                    {
                        model: db.User,
                        as: 'patientData',
                        attributes: ['firstName', 'lastName', 'gender', 'address', 'yearOfBirth', 'phoneNumber'],
                        include: [
                            {
                                model: db.Allcode,
                                as: 'genderData',
                                attributes: ['value'],
                                raw: true,
                                nest: true,
                            },
                        ],
                        raw: true,
                        nest: true,
                    },
                    {
                        model: db.User,
                        as: 'doctorData',
                        attributes: ['firstName', 'lastName', 'gender', 'phoneNumber'],
                        include: [
                            {
                                model: db.Allcode,
                                as: 'genderData',
                                attributes: ['value'],
                                raw: true,
                                nest: true,
                            },

                            {
                                model: db.Doctor_Info,
                                as: 'doctorInfo',
                                attributes: ['price'],
                                // where: { clinicId: req.params.id }, // Lọc theo clinicId
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
                                        raw: true,
                                        nest: true,
                                    },
                                ],
                                raw: true,
                                nest: true,
                            },
                        ],
                        raw: true,
                        nest: true,
                    },
                ],
                raw: true,
                nest: true,
            });
            const dataFormated = data.map((item, index) => {
                return {
                    id: item.id,
                    namePatient: item.patientData.lastName + ' ' + item.patientData.firstName,
                    phoneNumberPatient: item.patientData.phoneNumber,
                    yearOfBirthPatient: item.patientData.yearOfBirth,
                    genderPatient: item.patientData.genderData.value,
                    addressPatient: item.patientData.address,
                    reason: item.reason,
                    nameDoctor: item.doctorData.lastName + ' ' + item.doctorData.firstName,
                    phoneNumberDoctor: item.doctorData.phoneNumber,
                    genderDoctor: item.doctorData.genderData.value,
                    positionDoctor: item.doctorData.doctorInfo.positionData.value,
                    clinic: item.doctorData.doctorInfo.clinic.name,
                    clinicId: item.doctorData.doctorInfo.clinic.id,
                    specialist: item.doctorData.doctorInfo.specialist.name,
                    addressClinic: item.doctorData.doctorInfo.clinic.address,
                    price: item.doctorData.doctorInfo.price,
                    time: item.timeTypeBooking.value,
                    date: new Date(item.date).toLocaleDateString('en-GB'),
                    timeBooking:
                        new Date(item.createdAt).toLocaleTimeString() +
                        ' ' +
                        new Date(item.createdAt).toLocaleDateString('en-GB'),
                };
            });
            const dataFinal = dataFormated.filter((element) => {
                return (element.clinicId = req.params.id);
            });
            return res.status(200).json(dataFinal);
        } catch (error) {
            console.log(error);
            return res.status(500).json(error);
        }
    },

    async confirmBooking(req, res) {
        try {
            await db.Booking.update(
                {
                    statusId: 'S2',
                },
                {
                    where: {
                        id: req.body.id,
                        statusId: 'S1',
                    },
                    raw: true,
                },
            );
            return res.status(200).json('Confirm Booking Successfully');
        } catch (error) {
            return res.status(500).json(error);
        }
    },
    async cancelBooking(req, res) {
        try {
            await db.Booking.update(
                {
                    statusId: 'S4',
                },
                {
                    where: {
                        id: req.params.id,
                    },
                    raw: true,
                },
            );
            return res.status(200).json('cancelBooking Successfully');
        } catch (error) {
            console.log(error);
            return res.status(500).json(error);
        }
    },
    async deleteBooking(req, res) {
        try {
            const booking = await db.Booking.findOne({
                where: {
                    id: req.params.id,
                },
                raw: true,
            });
            if (!booking) {
                return res.status(200).json('Can not find the appointment');
            }
            const schedule = await db.Schedule.findOne({
                where: {
                    doctorId: booking.doctorId,
                    date: Number(booking.date),
                    timeType: booking.timeType,
                },
                raw: true,
            });
            await db.Booking.destroy({
                where: {
                    id: req.params.id,
                },
                raw: true,
            });
            await db.Schedule.update(
                {
                    currentNumber: schedule.currentNumber - 1,
                },
                {
                    where: {
                        ...schedule,
                    },
                    raw: true,
                },
            );
            return res.status(200).json('CanCel Booking Successfully');
        } catch (error) {
            console.log(error);
            return res.status(500).json(error);
        }
    },

    async getConfirmedBookingOneDoctor(req, res) {
        try {
            const data = await db.Booking.findAll({
                where: {
                    statusId: 'S2',
                    doctorId: req.params.doctorId,
                    date: Number(req.params.date),
                },
                include: [
                    {
                        model: db.Allcode,
                        as: 'timeTypeBooking',
                        attributes: ['value'],
                    },
                    {
                        model: db.User,
                        as: 'patientData',
                        attributes: ['firstName', 'lastName', 'gender', 'address', 'yearOfBirth', 'phoneNumber'],
                        include: [
                            {
                                model: db.Allcode,
                                as: 'genderData',
                                attributes: ['value'],
                                raw: true,
                                nest: true,
                            },
                        ],
                        raw: true,
                        nest: true,
                    },
                    {
                        model: db.User,
                        as: 'doctorData',
                        attributes: ['firstName', 'lastName', 'gender', 'phoneNumber'],
                        include: [
                            {
                                model: db.Allcode,
                                as: 'genderData',
                                attributes: ['value'],
                                raw: true,
                                nest: true,
                            },

                            {
                                model: db.Doctor_Info,
                                as: 'doctorInfo',
                                attributes: ['price'],
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
                                        raw: true,
                                        nest: true,
                                    },
                                ],
                                raw: true,
                                nest: true,
                            },
                        ],
                        raw: true,
                        nest: true,
                    },
                ],
                raw: true,
                nest: true,
            });
            const dataFinal = data.map((item, index) => {
                return {
                    id: item.id,
                    namePatient: item.patientData.lastName + ' ' + item.patientData.firstName,
                    phoneNumberPatient: item.patientData.phoneNumber,
                    yearOfBirthPatient: item.patientData.yearOfBirth,
                    genderPatient: item.patientData.genderData.value,
                    addressPatient: item.patientData.address,
                    reason: item.reason,
                    nameDoctor: item.doctorData.lastName + ' ' + item.doctorData.firstName,
                    phoneNumberDoctor: item.doctorData.phoneNumber,
                    genderDoctor: item.doctorData.genderData.value,
                    positionDoctor: item.doctorData.doctorInfo.positionData.value,
                    clinic: item.doctorData.doctorInfo.clinic.name,
                    specialist: item.doctorData.doctorInfo.specialist.name,
                    addressClinic: item.doctorData.doctorInfo.clinic.address,
                    price: item.doctorData.doctorInfo.price,
                    time: item.timeTypeBooking.value,
                    date: new Date(item.date).toLocaleDateString('en-GB'),
                    timeBooking:
                        new Date(item.createdAt).toLocaleTimeString() +
                        ' ' +
                        new Date(item.createdAt).toLocaleDateString('en-GB'),
                };
            });
            return res.status(200).json(dataFinal);
        } catch (error) {
            console.log(error);
            return res.status(500).json(error);
        }
    },
    async finishedExamination(req, res) {
        try {
            await db.Booking.update(
                {
                    statusId: 'S3',
                },
                {
                    where: {
                        id: req.body.id,
                        statusId: 'S2',
                    },
                    raw: true,
                },
            );
            return res.status(200).json('Finished Examination');
        } catch (error) {
            return res.status(500).json(error);
        }
    },

    async getPatientExaminedOneDate(req, res) {
        try {
            const data = await db.Booking.findAll({
                where: {
                    statusId: 'S3',
                    doctorId: req.params.doctorId,
                    date: Number(req.params.date),
                },
                include: [
                    {
                        model: db.Allcode,
                        as: 'timeTypeBooking',
                        attributes: ['value'],
                    },
                    {
                        model: db.User,
                        as: 'patientData',
                        attributes: ['firstName', 'lastName', 'gender', 'address', 'yearOfBirth', 'phoneNumber'],
                        include: [
                            {
                                model: db.Allcode,
                                as: 'genderData',
                                attributes: ['value'],
                                raw: true,
                                nest: true,
                            },
                        ],
                        raw: true,
                        nest: true,
                    },
                    {
                        model: db.User,
                        as: 'doctorData',
                        attributes: ['firstName', 'lastName', 'gender', 'phoneNumber'],
                        include: [
                            {
                                model: db.Allcode,
                                as: 'genderData',
                                attributes: ['value'],
                                raw: true,
                                nest: true,
                            },

                            {
                                model: db.Doctor_Info,
                                as: 'doctorInfo',
                                attributes: ['price'],
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
                                        raw: true,
                                        nest: true,
                                    },
                                ],
                                raw: true,
                                nest: true,
                            },
                        ],
                        raw: true,
                        nest: true,
                    },
                ],
                raw: true,
                nest: true,
            });
            const dataFinal = data.map((item, index) => {
                return {
                    id: item.id,
                    namePatient: item.patientData.lastName + ' ' + item.patientData.firstName,
                    phoneNumberPatient: item.patientData.phoneNumber,
                    yearOfBirthPatient: item.patientData.yearOfBirth,
                    genderPatient: item.patientData.genderData.value,
                    addressPatient: item.patientData.address,
                    reason: item.reason,
                    nameDoctor: item.doctorData.lastName + ' ' + item.doctorData.firstName,
                    phoneNumberDoctor: item.doctorData.phoneNumber,
                    genderDoctor: item.doctorData.genderData.value,
                    positionDoctor: item.doctorData.doctorInfo.positionData.value,
                    clinic: item.doctorData.doctorInfo.clinic.name,
                    specialist: item.doctorData.doctorInfo.specialist.name,
                    addressClinic: item.doctorData.doctorInfo.clinic.address,
                    price: item.doctorData.doctorInfo.price,
                    time: item.timeTypeBooking.value,
                    date: new Date(item.date).toLocaleDateString('en-GB'),
                    timeBooking:
                        new Date(item.createdAt).toLocaleTimeString() +
                        ' ' +
                        new Date(item.createdAt).toLocaleDateString('en-GB'),
                };
            });
            return res.status(200).json(dataFinal);
        } catch (error) {
            console.log(error);
            return res.status(500).json(error);
        }
    },
    async getAllBookingOnePatient(req, res) {
        try {
            const data = await db.Booking.findAll({
                where: {
                    patientId: req.params.id,
                },
                // attributes: {
                //     exclude: ['result'],
                // },
                include: [
                    {
                        model: db.Allcode,
                        as: 'timeTypeBooking',
                        attributes: ['value'],
                    },
                    {
                        model: db.Allcode,
                        as: 'statusIdBooking',
                        attributes: ['value'],
                    },
                    {
                        model: db.User,
                        as: 'patientData',
                        attributes: ['firstName', 'lastName', 'gender', 'address', 'yearOfBirth', 'phoneNumber'],
                        include: [
                            {
                                model: db.Allcode,
                                as: 'genderData',
                                attributes: ['value'],
                                raw: true,
                                nest: true,
                            },
                        ],
                        raw: true,
                        nest: true,
                    },
                    {
                        model: db.User,
                        as: 'doctorData',
                        attributes: ['firstName', 'lastName', 'gender', 'phoneNumber'],
                        include: [
                            {
                                model: db.Allcode,
                                as: 'genderData',
                                attributes: ['value'],
                                raw: true,
                                nest: true,
                            },

                            {
                                model: db.Doctor_Info,
                                as: 'doctorInfo',
                                attributes: ['price'],
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
                                        raw: true,
                                        nest: true,
                                    },
                                ],
                                raw: true,
                                nest: true,
                            },
                        ],
                        raw: true,
                        nest: true,
                    },
                ],
                raw: true,
                nest: true,
            });
            const dataFinal = data.map((item, index) => {
                return {
                    id: item.id,
                    namePatient: item.patientData.lastName + ' ' + item.patientData.firstName,
                    phoneNumberPatient: item.patientData.phoneNumber,
                    yearOfBirthPatient: item.patientData.yearOfBirth,
                    genderPatient: item.patientData.genderData.value,
                    addressPatient: item.patientData.address,
                    reason: item.reason,
                    nameDoctor: item.doctorData.lastName + ' ' + item.doctorData.firstName,
                    phoneNumberDoctor: item.doctorData.phoneNumber,
                    genderDoctor: item.doctorData.genderData.value,
                    positionDoctor: item.doctorData.doctorInfo.positionData.value,
                    clinic: item.doctorData.doctorInfo.clinic.name,
                    specialist: item.doctorData.doctorInfo.specialist.name,
                    addressClinic: item.doctorData.doctorInfo.clinic.address,
                    price: item.doctorData.doctorInfo.price,
                    time: item.timeTypeBooking.value,
                    status: item.statusIdBooking.value,
                    date: new Date(item.date).toLocaleDateString('en-GB'),
                    timeBooking:
                        new Date(item.createdAt).toLocaleTimeString() +
                        ' ' +
                        new Date(item.createdAt).toLocaleDateString('en-GB'),
                };
            });
            return res.status(200).json(dataFinal);
        } catch (error) {
            console.log(error);
            return res.status(500).json(error);
        }
    },
};
export default bookingController;
