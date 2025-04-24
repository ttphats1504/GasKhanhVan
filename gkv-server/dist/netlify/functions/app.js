"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const mongoose_1 = __importDefault(require("mongoose"));
const user_js_1 = __importDefault(require("../../src/routers/user.js"));
const productRoutes_js_1 = __importDefault(require("../../src/routers/productRoutes.js"));
const categoryRoutes_js_1 = __importDefault(require("../../src/routers/categoryRoutes.js"));
const incentiveRoutes_js_1 = __importDefault(require("../../src/routers/incentiveRoutes.js"));
const bannerRoutes_js_1 = __importDefault(require("../../src/routers/bannerRoutes.js"));
const cors_1 = __importDefault(require("cors"));
const mysql_js_1 = require("../../src/database/mysql.js");
const ProductModel_js_1 = __importDefault(require("../../src/models/ProductModel.js"));
const CategoryModel_js_1 = __importDefault(require("../../src/models/CategoryModel.js"));
const serverless_http_1 = __importDefault(require("serverless-http"));
const body_parser_1 = __importDefault(require("body-parser"));
const IncentiveModel_js_1 = __importDefault(require("../../src/models/IncentiveModel.js"));
const BannerModel_js_1 = __importDefault(require("../../src/models/BannerModel.js"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const corsOptions = {
    origin: ['https://gkv-admin-fe.vercel.app', 'https://gaskhanhvanquan7.vercel.app'], // replace with your actual Vercel frontend domain
    credentials: true, // if you're using cookies or authorization headers
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Origin', 'Content-Type', 'Accept', 'Authorization', 'X-Request-With'],
};
// Middleware
app.options('*', (0, cors_1.default)(corsOptions));
app.use((0, cors_1.default)(corsOptions));
app.use(express_1.default.json());
app.use(body_parser_1.default.urlencoded({ extended: true }));
app.use(body_parser_1.default.json());
// Static
app.use('/uploads', express_1.default.static('uploads'));
// Routes
app.use('/auth', user_js_1.default);
app.use('/api/products', productRoutes_js_1.default);
app.use('/api/categories', categoryRoutes_js_1.default);
app.use('/api/incentives', incentiveRoutes_js_1.default);
app.use('/api/banners', bannerRoutes_js_1.default);
// DB connections
const connectMongoDB = async () => {
    const dbURL = `mongodb+srv://${process.env.DATABASE_USERNAME}:${process.env.DATABASE_PASSWORD}@cluster0.dh8fo.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
    try {
        await mongoose_1.default.connect(dbURL);
        console.log(`Connected to MongoDB successfully!`);
    }
    catch (err) {
        console.error('MongoDB connection failed:', err);
    }
};
const connectMySQL = async () => {
    try {
        const connection = await mysql_js_1.mysqlDB.getConnection();
        connection.release();
        console.log('Connected to MySQL successfully!');
    }
    catch (err) {
        console.error('MySQL connection failed:', err);
    }
};
(async () => {
    // Call DB setup
    await connectMongoDB();
    await connectMySQL();
    await ProductModel_js_1.default.sync({ alter: true });
    await CategoryModel_js_1.default.sync({ alter: true });
    await IncentiveModel_js_1.default.sync({ alter: true });
    await BannerModel_js_1.default.sync({ alter: true });
})();
// Export as serverless function
exports.handler = (0, serverless_http_1.default)(app);
//# sourceMappingURL=app.js.map