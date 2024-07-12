import express from 'express';
import viewEngine from './config/viewEngine.js';
import morgan from 'morgan';
import dotenv from 'dotenv';
import connectDB from './config/connectDb.js';
import bodyParser from 'body-parser';
import Route from './routes/index.js';
const cookieParser = require('cookie-parser');
const cors = require('cors');
const corsOptions = {
    origin: '*',
    credentials: true, //access-control-allow-credentials:true
    optionSuccessStatus: 200,
};

const methodOverride = require('method-override');
dotenv.config();
const port = process.env.PORT;
const app = express();

app.use(cors(corsOptions));
app.use(methodOverride('_method'));
app.use(cookieParser());
//app.use(morgan('combined'));
// app.use(
//     bodyParser.urlencoded({
//         extended: true,
//     })
// );
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
//app.use(bodyParser.json());
viewEngine(app);
Route(app);
connectDB();
app.listen(port, () => {
    console.log(`Sever is running on ${port}`);
});
// Tạo ERD
// const sequelizeErd = require('sequelize-erd');
// const sequelize = require('./sequelizeConfig.js');
// const models = require('./models/index.js'); // Yêu cầu tất cả các mô hình

// sequelizeErd({ source: sequelize })
//     .then((svg) => {
//         require('fs').writeFileSync('erd.svg', svg);
//         console.log('ERD đã được tạo thành công và lưu dưới dạng erd.svg');
//     })
//     .catch((err) => {
//         console.error('Lỗi khi tạo ERD:', err);
//     });
