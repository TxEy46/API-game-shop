"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.conn = void 0;
const mysql_1 = __importDefault(require("mysql"));
exports.conn = mysql_1.default.createPool({
    connectionLimit: 10,
    host: "localhost",
    user: "game_shop",
    password: "1",
    database: "game_store",
});
exports.conn.getConnection((err, connection) => {
    if (err) {
        console.error("❌ Database connection failed:", err.message);
        return;
    }
    console.log("✅ Database connected successfully!");
    connection.release();
});
//# sourceMappingURL=db.js.map