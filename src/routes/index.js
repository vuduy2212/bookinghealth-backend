import authRouter from './auth';
import storedRouter from './stored';
import allCodeRouter from './allCode';
import userRouter from './user';
import doctorRouter from './doctor';
function Route(app) {
    app.use('/api/auth', authRouter); // đăng kí, đăng nhập
    app.use('/api/stored', storedRouter);
    app.use('/api/allcode', allCodeRouter); // kí hiệu
    app.use('/api/user', userRouter); // user chung
    app.use('/api/doctor', doctorRouter); // bác sĩ
}

module.exports = Route;
