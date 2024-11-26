import express from 'express';
import dotenve from "dotenv";
import cors from 'cors'
import conn from './connection.js';
import cookieParser from "cookie-parser";
import authRoutes from "./routes/AuthRoutes.js"
import contactsRouts from './routes/ContactsRoutes.js';
import setupSocket from './socket.js';

dotenve.config();

const app = express();
const port = process.env.PORT   ||   5001
const databaseurl=process.env.DATABASE_URL;

app.use(cors({
    origin:["http://localhost:5173"],
    methods: ["GET", "POST"],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use("/uploads/profiles", express.static("uploads/profiles"));


app.use(cookieParser());
app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/contacts',contactsRouts)

const server = app.listen(port,()=>{
    console.log(`server running at https://localhost:${port}`)
});

setupSocket(server);

conn(databaseurl);
