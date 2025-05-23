"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const mongoose_1 = __importDefault(require("mongoose"));
const user_1 = __importDefault(require("./src/routers/user"));
const productRoutes_1 = __importDefault(require("./src/routers/productRoutes"));
const categoryRoutes_1 = __importDefault(require("./src/routers/categoryRoutes"));
const incentiveRoutes_1 = __importDefault(require("./src/routers/incentiveRoutes"));
const bannerRoutes_1 = __importDefault(require("./src/routers/bannerRoutes"));
const cors_1 = __importDefault(require("cors"));
const mysql_1 = require("./src/database/mysql");
const ProductModel_1 = __importDefault(require("./src/models/ProductModel"));
const CategoryModel_1 = __importDefault(require("./src/models/CategoryModel"));
const IncentiveModel_1 = __importDefault(require("./src/models/IncentiveModel"));
const BannerModel_1 = __importDefault(require("./src/models/BannerModel"));
dotenv_1.default.config();
const PORT = process.env.PORT || 3001;
// mongoose connection pool
const dbURL = `mongodb+srv://${process.env.DATABASE_USERNAME}:${process.env.DATABASE_PASSWORD}@cluster0.dh8fo.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
const app = (0, express_1.default)();
const bodyParser = require('body-parser');
const corsOptions = {
    origin: ['https://gkv-admin-fe.vercel.app', 'https://gaskhanhvanquan7.vercel.app'], // replace with your actual Vercel frontend domain
    credentials: true, // if you're using cookies or authorization headers
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Origin', 'Content-Type', 'Accept', 'Authorization', 'X-Request-With'],
};
const allowedOrigins = [
    'https://gkv-admin-fe.vercel.app',
    'https://gaskhanhvanquan7.vercel.app',
    'http://localhost:3000',
    'http://localhost:3002',
];
app.use((req, res, next) => {
    const origin = req.headers.origin;
    if (allowedOrigins.includes(origin)) {
        res.header('Access-Control-Allow-Origin', origin);
        res.header('Access-Control-Allow-Credentials', 'true');
        res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,PATCH,OPTIONS');
        res.header('Access-Control-Allow-Headers', 'Origin,Content-Type,Accept,Authorization,X-Requested-With');
    }
    next();
});
app.options('*', (0, cors_1.default)(corsOptions));
app.use((0, cors_1.default)(corsOptions));
app.use(express_1.default.json());
app.use(bodyParser.urlencoded({
    extended: true,
}));
app.use(bodyParser.json());
app.use('/uploads', express_1.default.static('uploads'));
const connectMongoDB = async () => {
    try {
        await mongoose_1.default.connect(dbURL);
        console.log(`Connect to db successfully!!!`);
    }
    catch (error) {
        console.log(`Can not connect to db ${error}`);
    }
};
const connectMySQL = async () => {
    try {
        const connection = await mysql_1.mysqlDB.getConnection();
        connection.release();
        console.log('Connected to MySQL successfully!!!');
    }
    catch (error) {
        console.error(`Cannot connect to MySQL: ${error}`);
        process.exit(1);
    }
};
app.use('/auth', user_1.default);
app.use('/api/products', productRoutes_1.default);
app.use('/api/categories', categoryRoutes_1.default);
app.use('/api/incentives', incentiveRoutes_1.default);
app.use('/api/banners', bannerRoutes_1.default);
const startServer = async () => {
    await ProductModel_1.default.sync({ alter: true }); // syncs model with table structure
    await CategoryModel_1.default.sync({ alter: true }); // syncs model with table structure
    await IncentiveModel_1.default.sync({ alter: true }); // syncs model with table structure
    await BannerModel_1.default.sync({ alter: true }); // syncs model with table structure
    await connectMongoDB();
    await connectMySQL();
    app.listen(PORT, () => {
        console.log(`Server is running at port ${PORT}`);
    });
};
startServer().catch((err) => {
    console.error('Failed to start server:', err);
});
exports.default = app;
//# sourceMappingURL=index.js.map