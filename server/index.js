import express from 'express';
import dotenve from "dotenv";
import cors from 'cors'
import conn from './connection.js';
import cookieParser from "cookie-parser";
import authRoutes from "./routes/AuthRoutes.js"

dotenve.config();

const app = express();
const port = process.env.PORT   ||   5001
const databaseurl=process.env.DATABASE_URL;

app.use(cors({
    origin:["http://localhost:5173"],
    // methods:["GET","POST","PATCH","DELETE","PUT"],
    // credential:true
}));

app.use(cookieParser());
app.use(express.json());
app.use('/api/auth', authRoutes);

const server = app.listen(port,()=>{
    console.log(`server running at https://localhost:${port}`)
});

conn(databaseurl);
