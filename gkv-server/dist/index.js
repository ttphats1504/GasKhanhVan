"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
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
const cors_1 = __importDefault(require("cors"));
const mysql_1 = require("./src/database/mysql");
const ProductModel_1 = __importDefault(require("./src/models/ProductModel"));
const CategoryModel_1 = __importDefault(require("./src/models/CategoryModel"));
dotenv_1.default.config();
const PORT = process.env.PORT || 3001;
// mongoose connection pool
const dbURL = `mongodb+srv://${process.env.DATABASE_USERNAME}:${process.env.DATABASE_PASSWORD}@cluster0.dh8fo.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
const app = (0, express_1.default)();
const bodyParser = require('body-parser');
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use(bodyParser.urlencoded({
    extended: true,
}));
app.use(bodyParser.json());
app.use('/uploads', express_1.default.static('uploads'));
const connectMongoDB = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield mongoose_1.default.connect(dbURL);
        console.log(`Connect to db successfully!!!`);
    }
    catch (error) {
        console.log(`Can not connect to db ${error}`);
    }
});
const connectMySQL = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const connection = yield mysql_1.mysqlDB.getConnection();
        yield connection.query('SELECT 1'); // simple query to test the connection
        connection.release();
        console.log('Connected to MySQL successfully!!!');
    }
    catch (error) {
        console.error(`Cannot connect to MySQL: ${error}`);
        process.exit(1);
    }
});
app.use('/auth', user_1.default);
app.use('/api/products', productRoutes_1.default);
app.use('/api/categories', categoryRoutes_1.default);
const startServer = () => __awaiter(void 0, void 0, void 0, function* () {
    yield ProductModel_1.default.sync({ alter: true }); // syncs model with table structure
    yield CategoryModel_1.default.sync({ alter: true }); // syncs model with table structure
    yield connectMongoDB();
    yield connectMySQL();
    app.listen(PORT, () => {
        console.log(`Server is running at http://localhost:${PORT}`);
    });
});
startServer().catch((err) => {
    console.error('Failed to start server:', err);
});
exports.default = app;
//# sourceMappingURL=index.js.map