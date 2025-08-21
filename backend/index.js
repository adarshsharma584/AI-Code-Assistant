import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import {authRouter} from './routes/auth.route.js';
import { chatRouter } from './routes/chat.route.js';
import { userRouter } from './routes/user.route.js';
dotenv.config();

import {connectDB} from './utils/dbConnection.js';
const app = express();
connectDB();
const port = process.env.PORT || 3000;


//Middlewares-->
app.use(express.json());
app.use(express.urlencoded({extended: true}))
app.use(cookieParser());
app.use(cors({
  origin: process.env.CORS_ORIGIN,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));
//Routes-->
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/chats', chatRouter);
app.use('/api/v1/users', userRouter);

//Testing API
app.get('/', (req, res) => {
  res.send('Hello, World!');
});

app.listen(5000, () => {
  console.log(`Server is running on port ${port}`); 
})
