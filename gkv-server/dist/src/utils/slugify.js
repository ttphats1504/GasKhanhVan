"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.slugify = slugify;
function slugify(str) {
    return str
        .toLowerCase()
        .normalize('NFD') // tách dấu tiếng Việt
        .replace(/[\u0300-\u036f]/g, '') // xóa dấu
        .replace(/đ/g, 'd') // thay đ → d
        .replace(/Đ/g, 'd') // thay Đ → d
        .replace(/[^a-z0-9\s-]/g, '') // xóa ký tự đặc biệt còn lại
        .trim()
        .replace(/\s+/g, '-') // space → -
        .replace(/-+/g, '-'); // tránh nhiều dấu -
}
//# sourceMappingURL=slugify.js.map