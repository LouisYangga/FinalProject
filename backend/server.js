const express = require('express');
const https = require('https');
const fs = require("fs");
const app = express();
var cors = require('cors');
const dotenv = require('dotenv').config();
global.__basedir = __dirname + "/..";
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors())

const port = 5000;
require('./db');
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/subjects', require('./routes/subjectRoutes'));
app.use('/api/students', require('./routes/studentRoutes'));
app.get('/', (req, res) => {
    res.json('Server side');
})

https.createServer({
    key: fs.readFileSync("key.pem"),
    cert: fs.readFileSync("cert.pem")
}, app).listen(port, () => {
    console.log(`Mongo App | listening at https://localhost:${port}`);
})