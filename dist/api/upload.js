"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fileUpload = exports.router = void 0;
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const multer_1 = __importDefault(require("multer"));
exports.router = express_1.default.Router();
class FileMiddleware {
    filename = "";
    diskLoader = (0, multer_1.default)({
        storage: multer_1.default.diskStorage({
            destination: (_req, _file, cb) => cb(null, path_1.default.join(__dirname, "../uploads")),
            filename: (_req, file, cb) => {
                const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 10000);
                this.filename = uniqueSuffix + "." + file.originalname.split(".").pop();
                cb(null, this.filename);
            },
        }),
        limits: { fileSize: 64 * 1024 * 1024 },
    });
}
exports.fileUpload = new FileMiddleware();
exports.router.post("/", exports.fileUpload.diskLoader.single("file"), (req, res) => {
    res.json({ filename: "/uploads/" + exports.fileUpload.filename });
});
//# sourceMappingURL=upload.js.map