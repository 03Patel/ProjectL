

import express from "express";
import cors from "cors";
import db from './db.js';

import authRoutes from "./routes/auth.js";
import eventRoutes from "./routes/event.js";
import dotenv from "dotenv";
dotenv.config();


db();

const app = express();
app.use(cors());

app.use(express.json());


const PORT = 5000;


app.use("/api/auth", authRoutes)
app.use('/api/events', eventRoutes);

app.get("/", (req, res) => {
    res.send("Ganesh ji Patel")
})


import webpush from "web-push";

webpush.setVapidDetails(
  'mailto:ganeshjipatel108@gmail.com',           
  process.env.VAPID_PUBLIC_KEY,       
  process.env.VAPID_PRIVATE_KEY       
);



app.listen(PORT, () => console.log(`Server is running ${PORT}`))