const nodemailer = require('nodemailer');
const utils = {
    async sendEmailAdminClinic(emailAdmin, firstNameAdmin, lastNameAdmin, passwordAdmin, clinicName) {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'vuduy.22122002@gmail.com',
                pass: 'vxjq azup pekx rovg',
            },
        });
        const mailOptions = {
            from: 'vuduy.22122002@gmail.com',
            to: emailAdmin,
            subject: 'Thông tin đăng nhập cho hỗ trợ viên phòng khám',
            text: ` 

Chào ${lastNameAdmin} ${firstNameAdmin},

Chúng tôi rất vui mừng thông báo rằng tài khoản Hỗ trợ viên phòng khám của bạn đã được tạo thành công cho phòng khám ${clinicName}. Dưới đây là các thông tin đăng nhập của bạn:

Tên đăng nhập: ${emailAdmin}
Mật khẩu tạm thời: ${passwordAdmin}

Đường link đăng nhập: [http://localhost:3000/login]

Nếu bạn có bất kỳ câu hỏi hoặc cần hỗ trợ gì thêm, vui lòng liên hệ với chúng tôi qua số điện thoại 0988419986

Xin cảm ơn đã tham gia và hợp tác cùng chúng tôi.

Trân trọng,
[Admin hệ thống]
[Admin hệ thống]
[BookingHeath]
            `,
        };

        transporter.sendMail(mailOptions);
    },

    async sendEmailNewDoctor(emailDoctor, firstNameDoctor, lastNameDoctor, passwordDoctor, clinicName) {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'vuduy.22122002@gmail.com',
                pass: 'vxjq azup pekx rovg',
            },
        });
        const mailOptions = {
            from: 'vuduy.22122002@gmail.com',
            to: emailDoctor,
            subject: 'Thông tin đăng nhập bác sĩ',
            text: ` 

Chào ${lastNameDoctor} ${firstNameDoctor},

Chúng tôi rất vui mừng thông báo rằng tài khoản Bác sỹ của bạn đã được tạo thành công cho phòng khám ${clinicName}. Dưới đây là các thông tin đăng nhập của bạn:

Tên đăng nhập: ${emailDoctor}
Mật khẩu tạm thời: ${passwordDoctor}

Đường link đăng nhập: [http://localhost:3000/login]

Nếu bạn có bất kỳ câu hỏi hoặc cần hỗ trợ gì thêm, vui lòng liên hệ với chúng tôi qua số điện thoại 0988419986

Xin cảm ơn đã tham gia và hợp tác cùng chúng tôi.

Trân trọng,
[Hỗ trợ viên bệnh viện ]
[Hỗ trợ viên bệnh viện]
[BookingHeath]
            `,
        };

        transporter.sendMail(mailOptions);
    },
};

module.exports = utils;
