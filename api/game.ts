import express from "express";
import { conn } from "../db";

export const router = express.Router();

// ดึงข้อมูลเกมทั้งหมด
router.get("/", (req, res) => {
  conn.query("SELECT * FROM games", (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// ดึงรายละเอียดเกมตาม id
router.get("/:id", (req, res) => {
  const { id } = req.params;
  conn.query(
    `SELECT g.*, c.name as category_name 
     FROM games g 
     JOIN categories c ON g.category_id = c.id 
     WHERE g.id = ?`,
    [id],
    (err, results) => {
      if (err) return res.status(500).json({ error: err.message });
      if (results.length === 0) return res.status(404).json({ error: "Game not found" });
      res.json(results[0]);
    }
  );
});
