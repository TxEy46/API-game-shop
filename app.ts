import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import session from "express-session";
import connectMySQL from "express-mysql-session";
import { conn } from "./db";

import { router as index } from "./api/index";
import { router as user } from "./api/user";
import { router as game } from "./api/game";
import { router as upload } from "./api/upload";

// ------------------------ MySQL session store ------------------------
const MySQLStore = (connectMySQL as unknown as (session: any) => any)(session);
const sessionStore = new MySQLStore({}, conn as any);

// ------------------------ Express app ------------------------
export const app = express();

app.use(bodyParser.json());
app.use(
  cors({
    origin: "*",
  })
);

// ------------------------ Session ------------------------
app.use(
  session({
    name: "session_cookie_name",
    secret: process.env.SESSION_SECRET || "SESSION_SECRET_KEY",
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24 * 30, // 30 วัน
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
    },
  })
);

// ------------------------ Routers ------------------------
app.use("/", index);
app.use("/users", user);
app.use("/games", game);
app.use("/upload", upload);
app.use("/uploads", express.static("uploads"));
