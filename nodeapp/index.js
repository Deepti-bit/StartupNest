const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser'); 
dotenv.config();

const userRoute = require('./routers/userRouter');
const startupProfileRoutes = require('./routers/startupProfileRoutes');
const startupSubmissionRoutes=require('./routers/startupSubmissionRoutes');

const app = express();


app.use(cors({
    
    origin: 'https://8081-eaecfaabfcdbbccabcfcbfaabdbcabfebaccfcccce.premiumproject.examly.io',
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json());
app.use(cookieParser());

app.use('/api/user', userRoute);
app.use('/startupProfile', startupProfileRoutes);
app.use('/api/startupSubmission', startupSubmissionRoutes);

const MONGO_URI = process.env.MONGO_URI;
const PORT = process.env.PORT || 8080;

mongoose.connect(MONGO_URI)
    .then(() => {
        console.log('MongoDB Connected');
        app.listen(PORT, () => console.log(`Server running on ${PORT}`));
    })
    .catch(err => console.error(err));