import authRouter from './auth';
import storedRouter from './stored';
import allCodeRouter from './allCode';
import userRouter from './user';
function Route(app) {
    app.use('/api/auth', authRouter);
    app.use('/api/stored', storedRouter);
    app.use('/api/allcode', allCodeRouter);
    app.use('/api/user', userRouter);
}

module.exports = Route;
