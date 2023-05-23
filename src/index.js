import express from 'express';
import viewEngine from './config/viewEngine.js';
import initWebRoutes from './routes/web.js';
import morgan from 'morgan';
import dotenv from 'dotenv';
dotenv.config();
const port = process.env.PORT;
const app = express();
app.use(morgan('combined'));
app.use(
    express.urlencoded({
        extended: true,
    })
);
app.use(express.json());
viewEngine(app);
initWebRoutes(app);

app.listen(port, () => {
    console.log(`Sever is running on ${port}`);
});
