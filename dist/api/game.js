"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = __importDefault(require("express"));
const db_1 = require("../db");
exports.router = express_1.default.Router();
// ดึงข้อมูลเกมทั้งหมด
exports.router.get("/", (req, res) => {
    db_1.conn.query("SELECT * FROM games", (err, results) => {
        if (err)
            return res.status(500).json({ error: err.message });
        res.json(results);
    });
});
// ดึงรายละเอียดเกมตาม id
exports.router.get("/:id", (req, res) => {
    const { id } = req.params;
    db_1.conn.query(`SELECT g.*, c.name as category_name 
     FROM games g 
     JOIN categories c ON g.category_id = c.id 
     WHERE g.id = ?`, [id], (err, results) => {
        if (err)
            return res.status(500).json({ error: err.message });
        if (results.length === 0)
            return res.status(404).json({ error: "Game not found" });
        res.json(results[0]);
    });
});
//# sourceMappingURL=game.js.map