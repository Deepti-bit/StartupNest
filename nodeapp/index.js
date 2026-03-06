const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser'); // 1. Import this

dotenv.config();

const userRoute = require('./routers/userRouter');
const app = express();

// 2. CONFIGURE CORS (Crucial for cookies)
app.use(cors({
    // Replace this string with the EXACT URL of your frontend browser tab
    origin: 'https://8081-fdadabacebccabcfcbfaabdbcabfebaccfcccce.premiumproject.examly.io', 
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json());
app.use(cookieParser()); // 3. Use this before your routes

app.use('/api/user', userRoute);

const MONGO_URI = process.env.MONGO_URI;
const PORT = process.env.PORT || 8080;

mongoose.connect(MONGO_URI)
    .then(() => {
        console.log('MongoDB Connected');
        app.listen(PORT, () => console.log(`Server: http://localhost:${PORT}`));
    })
    .catch(err => console.error(err));