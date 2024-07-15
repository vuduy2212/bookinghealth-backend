import { finished } from 'nodemailer/lib/xoauth2';
import db from '../models/index';
const medicalRecordAndPrescriptionController = {
    async completeMedicalExamination(req, res) {
        const { bookingId, diagnosis, file, medications } = req.body;
        console.log(file);
        try {
            // Tạo medical record
            const medicalRecord = await db.MedicalRecord.create({
                bookingId,
                diagnosis,
                resultFile: file,
            });

            // Tạo prescriptions từ mảng medications
            const prescriptions = await Promise.all(
                medications.map(async (medication) => {
                    const { medicationId, dosage, instructions, quantity } = medication;
                    return await db.Prescription.create({
                        medical_record_id: medicalRecord.id,
                        medicationId,
                        dosage,
                        instructions,
                        quantity,
                    });
                }),
            );

            // Cập nhật trạng thái booking sang S3 (đã khám xong)
            await db.Booking.update({ statusId: 'S3' }, { where: { id: bookingId } });

            res.status(201).json('Tạo thành công kết quả khám bệnh và đơn thuốc cho bệnh nhân');
        } catch (error) {
            console.error('Error handling medical records and prescriptions:', error);
            res.status(500).json({ error: 'Failed to handle medical records and prescriptions' });
        }
    },
    async getPatientExaminedOneDateV2(req, res) {
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
                    {
                        model: db.MedicalRecord,
                        as: 'medicalRecord',
                        attributes: ['diagnosis', 'resultFile'],
                        include: [
                            {
                                model: db.Prescription,
                                as: 'prescriptions',
                                attributes: ['medicationId', 'dosage', 'instructions', 'quantity'],
                                include: [
                                    {
                                        model: db.Medication,
                                        as: 'medication',
                                        attributes: ['name'],
                                    },
                                ],
                            },
                        ],
                    },
                ],
                raw: true,
                nest: true,
            });

            // Sử dụng một đối tượng để lưu trữ thông tin đã hợp nhất
            const uniqueData = [];

            data.forEach((item) => {
                if (!uniqueData[item.id]) {
                    uniqueData[item.id] = {
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
                        diagnosis: item.medicalRecord?.diagnosis || '',
                        resultFile: item.medicalRecord?.resultFile || '',
                        notes: item.medicalRecord?.notes || '',
                        prescriptions: [],
                    };
                }

                if (item.medicalRecord && item.medicalRecord.prescriptions) {
                    uniqueData[item.id].prescriptions.push({
                        medicationName: item.medicalRecord.prescriptions.medication.name,
                        dosage: item.medicalRecord.prescriptions.dosage,
                        instructions: item.medicalRecord.prescriptions.instructions,
                        quantity: item.medicalRecord.prescriptions.quantity,
                    });
                }
            });

            // Chuyển đổi đối tượng trung gian thành mảng
            const dataFinal = Object.values(uniqueData);

            return res.status(200).json(dataFinal);
        } catch (error) {
            console.log(error);
            return res.status(500).json(error);
        }
    },

    async getAllExaminedOnePatient(req, res) {
        try {
            const data = await db.Booking.findAll({
                where: {
                    statusId: 'S3',
                    patientId: req.params.id,
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
                    {
                        model: db.MedicalRecord,
                        as: 'medicalRecord',
                        attributes: ['diagnosis', 'resultFile'],
                        include: [
                            {
                                model: db.Prescription,
                                as: 'prescriptions',
                                attributes: ['medicationId', 'dosage', 'instructions', 'quantity'],
                                include: [
                                    {
                                        model: db.Medication,
                                        as: 'medication',
                                        attributes: ['name'],
                                    },
                                ],
                            },
                        ],
                    },
                ],
                raw: true,
                nest: true,
            });

            // Sử dụng một đối tượng để lưu trữ thông tin đã hợp nhất
            const uniqueData = [];

            data.forEach((item) => {
                if (!uniqueData[item.id]) {
                    uniqueData[item.id] = {
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
                        diagnosis: item.medicalRecord?.diagnosis || '',
                        resultFile: item.medicalRecord?.resultFile || '',
                        notes: item.medicalRecord?.notes || '',
                        prescriptions: [],
                    };
                }

                if (item.medicalRecord && item.medicalRecord.prescriptions) {
                    uniqueData[item.id].prescriptions.push({
                        medicationName: item.medicalRecord.prescriptions.medication.name,
                        dosage: item.medicalRecord.prescriptions.dosage,
                        instructions: item.medicalRecord.prescriptions.instructions,
                        quantity: item.medicalRecord.prescriptions.quantity,
                    });
                }
            });

            // Chuyển đổi đối tượng trung gian thành mảng
            const dataFinal = Object.values(uniqueData);

            return res.status(200).json(dataFinal);
        } catch (error) {
            console.log(error);
            return res.status(500).json(error);
        }
    },
};

export default medicalRecordAndPrescriptionController;
