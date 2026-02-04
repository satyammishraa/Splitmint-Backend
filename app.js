const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

// utils / helpers
const logger = require('./helper/logger');
const requestLogger = require('./helper/requestLogger');
const apiAuth = require('./helper/apiAuthentication');

// routes
const usersRouter = require('./routes/userRouter');
const groupRouter = require('./routes/groupRouter');
const expenseRouter = require('./routes/expenseRouter');

// db
const connectDB = require('./config/db');

const app = express();

/* -------------------- CORS -------------------- */
app.use(
  cors({
    origin: [
      'http://localhost:3000',
      'https://splitmint-frontend.vercel.app'
    ],
    credentials: true
  })
);

/* -------------------- MIDDLEWARE -------------------- */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(requestLogger);

/* -------------------- HEALTH CHECK -------------------- */
app.get('/', (req, res) => {
  res.json({
    status: 'Backend is live 🚀',
    service: 'SplitMint Backend'
  });
});

/* -------------------- ROUTES -------------------- */
app.use('/api/users', usersRouter);
app.use('/api/group', apiAuth.validateToken, groupRouter);
app.use('/api/expense', apiAuth.validateToken, expenseRouter);

/* -------------------- INVALID ROUTES -------------------- */
app.all('*', (req, res) => {
  logger.error(`[Invalid Route] ${req.originalUrl}`);
  res.status(404).json({
    status: 'fail',
    message: 'Invalid path'
  });
});

/* -------------------- DB + SERVER -------------------- */
connectDB();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server started on PORT | ${PORT}`);
  logger.info(`Server started on PORT | ${PORT}`);
});


// var dotenv = require('dotenv')
// var express = require('express')
// var logger = require('./helper/logger')
// var requestLogger = require('./helper/requestLogger')
// var apiAuth = require('./helper/apiAuthentication')
// var cors = require('cors')
// require('dotenv').config();


// const path = require('path');
// dotenv.config()

// var usersRouter = require('./routes/userRouter')
// var gorupRouter = require('./routes/groupRouter')
// var expenseRouter = require('./routes/expenseRouter')
// const connectDB = require('./config/db')

// var app = express()
// app.use(
//   cors({
//     origin: [
//       "http://localhost:3000",
//       "https://splitmint-frontend.vercel.app"
//     ],
//     credentials: true
//   })
// );

// //app.use(cors())
// app.use(express.json())
// app.use(express.urlencoded({ extended: true }));
// app.use(requestLogger)

// app.use('/api/users', usersRouter)
// app.use('/api/group', apiAuth.validateToken,gorupRouter)
// app.use('/api/expense', apiAuth.validateToken,expenseRouter)

// if (process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'staging') {
//     app.use(express.static('client/build'));
//     app.get('*', (req, res) => {
//     res.sendFile(path.resolve(__dirname,'client','build','index.html'));
//     });
//    }

// //To detect and log invalid api hits 
// app.all('*', (req, res) => {
//     logger.error(`[Invalid Route] ${req.originalUrl}`)
//     res.status(404).json({
//         status: 'fail',
//         message: 'Invalid path'
//       })
// })

// connectDB();
// const port = process.env.PORT || 3001
// app.listen(port, (err) => {
//     console.log(`Server started in PORT | ${port}`)
//     logger.info(`Server started in PORT | ${port}`)
// })
