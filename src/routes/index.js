import authRouter from './auth';
import storedRouter from './stored';
function Route(app) {
    app.use('/auth', authRouter);
    app.use('/stored', storedRouter);
}

module.exports = Route;
