import express from "express";
import { conn } from "../db";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { authenticate, authorizeAdmin } from "../middleware/auth";
import { fileUpload } from "./upload";

export const router = express.Router();

const SECRET = "MY_SECRET_KEY"; // ควรเก็บใน .env

// ----------------- REGISTER -----------------
router.post("/register", (req, res) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password)
    return res.status(400).json({ error: "Missing required fields" });

  const hashed = bcrypt.hashSync(password, 10);

  conn.query(
    "INSERT INTO users (username, email, password_hash, role) VALUES (?, ?, ?, 'user')",
    [username, email, hashed],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ id: result.insertId, username, email, role: "user" });
    }
  );
});

// ----------------- LOGIN -----------------
router.post("/login", (req, res) => {
  const { identifier, password } = req.body;
  if (!identifier || !password)
    return res.status(400).json({ error: "Missing fields" });

  conn.query(
    "SELECT * FROM users WHERE username = ? OR email = ?",
    [identifier, identifier],
    (err, results) => {
      if (err) return res.status(500).json({ error: err.message });
      if (results.length === 0)
        return res.status(401).json({ error: "Invalid username/email or password" });

      const user = results[0];
      if (!bcrypt.compareSync(password, user.password_hash))
        return res.status(401).json({ error: "Invalid username/email or password" });

      // สร้าง session
      (req.session as any).user = {
        id: user.id,
        username: user.username,
        role: user.role,
      };

      res.json({
        message: "Login successful",
        user: { id: user.id, username: user.username, role: user.role },
      });
    }
  );
});

// ----------------- GET CURRENT USER -----------------
router.get("/me", authenticate, (req, res) => {
  res.json({ user: (req as any).user });
});

// ----------------- UPDATE USER + UPLOAD AVATAR -----------------
router.put("/:id", authenticate, fileUpload.diskLoader.single("file"), (req, res) => {
  const { id } = req.params;
  const { username, email } = req.body;
  const avatar_url = req.file ? "/uploads/" + fileUpload.filename : null;

  const sql = "UPDATE users SET username=?, email=?, avatar_url=? WHERE id=?";
  conn.query(sql, [username, email, avatar_url, id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "User updated", avatar_url });
  });
});

// ----------------- GET USER BY ID -----------------
router.get("/:id", authenticate, (req, res) => {
  const { id } = req.params;
  conn.query("SELECT id, username, email, role, avatar_url FROM users WHERE id = ?", [id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.length === 0) return res.status(404).json({ error: "User not found" });
    res.json(results[0]);
  });
});

// ----------------- GET ALL USERS (ADMIN ONLY) -----------------
router.get("/", authenticate, authorizeAdmin, (req, res) => {
  conn.query(
    "SELECT id, username, email, role, avatar_url FROM users WHERE role = 'user'",
    (err, results) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(results);
    }
  );
});
