"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = __importDefault(require("express"));
const db_1 = require("../db");
const bcrypt_1 = __importDefault(require("bcrypt"));
const auth_1 = require("../middleware/auth");
const upload_1 = require("./upload");
exports.router = express_1.default.Router();
const SECRET = "MY_SECRET_KEY"; // ควรเก็บใน .env
// ----------------- REGISTER -----------------
exports.router.post("/register", (req, res) => {
    const { username, email, password } = req.body;
    if (!username || !email || !password)
        return res.status(400).json({ error: "Missing required fields" });
    const hashed = bcrypt_1.default.hashSync(password, 10);
    db_1.conn.query("INSERT INTO users (username, email, password_hash, role) VALUES (?, ?, ?, 'user')", [username, email, hashed], (err, result) => {
        if (err)
            return res.status(500).json({ error: err.message });
        res.json({ id: result.insertId, username, email, role: "user" });
    });
});
// ----------------- LOGIN -----------------
exports.router.post("/login", (req, res) => {
    const { identifier, password } = req.body;
    if (!identifier || !password)
        return res.status(400).json({ error: "Missing fields" });
    db_1.conn.query("SELECT * FROM users WHERE username = ? OR email = ?", [identifier, identifier], (err, results) => {
        if (err)
            return res.status(500).json({ error: err.message });
        if (results.length === 0)
            return res.status(401).json({ error: "Invalid username/email or password" });
        const user = results[0];
        if (!bcrypt_1.default.compareSync(password, user.password_hash))
            return res.status(401).json({ error: "Invalid username/email or password" });
        // สร้าง session
        req.session.user = {
            id: user.id,
            username: user.username,
            role: user.role,
        };
        res.json({
            message: "Login successful",
            user: { id: user.id, username: user.username, role: user.role },
        });
    });
});
// ----------------- GET CURRENT USER -----------------
exports.router.get("/me", auth_1.authenticate, (req, res) => {
    res.json({ user: req.user });
});
// ----------------- UPDATE USER + UPLOAD AVATAR -----------------
exports.router.put("/:id", auth_1.authenticate, upload_1.fileUpload.diskLoader.single("file"), (req, res) => {
    const { id } = req.params;
    const { username, email } = req.body;
    const avatar_url = req.file ? "/uploads/" + upload_1.fileUpload.filename : null;
    const sql = "UPDATE users SET username=?, email=?, avatar_url=? WHERE id=?";
    db_1.conn.query(sql, [username, email, avatar_url, id], (err) => {
        if (err)
            return res.status(500).json({ error: err.message });
        res.json({ message: "User updated", avatar_url });
    });
});
// ----------------- GET USER BY ID -----------------
exports.router.get("/:id", auth_1.authenticate, (req, res) => {
    const { id } = req.params;
    db_1.conn.query("SELECT id, username, email, role, avatar_url FROM users WHERE id = ?", [id], (err, results) => {
        if (err)
            return res.status(500).json({ error: err.message });
        if (results.length === 0)
            return res.status(404).json({ error: "User not found" });
        res.json(results[0]);
    });
});
// ----------------- GET ALL USERS (ADMIN ONLY) -----------------
exports.router.get("/", auth_1.authenticate, auth_1.authorizeAdmin, (req, res) => {
    db_1.conn.query("SELECT id, username, email, role, avatar_url FROM users WHERE role = 'user'", (err, results) => {
        if (err)
            return res.status(500).json({ error: err.message });
        res.json(results);
    });
});
//# sourceMappingURL=user.js.map