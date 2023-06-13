import authRouter from './auth';
import storedRouter from './stored';
function Route(app) {
    app.use('/api/auth', authRouter);
    app.use('/api/stored', storedRouter);
}

module.exports = Route;
