"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.register = void 0;
const register = async (req, res) => {
    const body = req.body;
    try {
        console.log(body);
        res.status(200).json({
            message: 'Register',
            data: body,
        });
    }
    catch (error) {
        res.status(404).json({
            message: error.message,
        });
    }
};
exports.register = register;
//# sourceMappingURL=user.js.map