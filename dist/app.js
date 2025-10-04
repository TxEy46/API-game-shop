"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const cors_1 = __importDefault(require("cors"));
const express_session_1 = __importDefault(require("express-session"));
const express_mysql_session_1 = __importDefault(require("express-mysql-session")); // import เป็นชื่ออื่น
const db_1 = require("./db");
const index_1 = require("./api/index");
const user_1 = require("./api/user");
const game_1 = require("./api/game");
const upload_1 = require("./api/upload");
// ------------------------ MySQL session store ------------------------
const MySQLStore = express_mysql_session_1.default; // cast เป็น any เพื่อให้ TS ยอม
const sessionStore = new MySQLStore({}, db_1.conn);
// ------------------------ Express app ------------------------
exports.app = (0, express_1.default)();
exports.app.use(body_parser_1.default.json());
exports.app.use((0, cors_1.default)({
    origin: "*",
}));
// ------------------------ Session ------------------------
exports.app.use((0, express_session_1.default)({
    name: "session_cookie_name", // ✅ เปลี่ยนจาก key → name
    secret: "SESSION_SECRET_KEY",
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 30, // 30 วัน
        httpOnly: true,
    },
}));
// ------------------------ Routers ------------------------
exports.app.use("/", index_1.router);
exports.app.use("/users", user_1.router);
exports.app.use("/games", game_1.router);
exports.app.use("/upload", upload_1.router);
exports.app.use("/uploads", express_1.default.static("uploads"));
//# sourceMappingURL=app.js.map