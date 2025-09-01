"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.slugify = slugify;
function slugify(str) {
    return str
        .toLowerCase() // chữ thường
        .normalize('NFD') // tách dấu tiếng Việt
        .replace(/[\u0300-\u036f]/g, '') // xóa dấu
        .replace(/[^a-z0-9\s-]/g, '') // xóa ký tự đặc biệt
        .trim() // xóa khoảng trắng đầu cuối
        .replace(/\s+/g, '-') // thay space bằng -
        .replace(/-+/g, '-'); // tránh nhiều dấu -
}
//# sourceMappingURL=slugify.js.map