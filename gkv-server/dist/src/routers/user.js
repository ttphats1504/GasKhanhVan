"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_1 = require("../controllers/user");
const router = (0, express_1.Router)();
router.post('/register', user_1.register);
exports.default = router;
//# sourceMappingURL=user.js.map