const express = require('express');
const app = express();
var cors = require('cors');
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

app.listen(port, () => {
    console.log(`Mongo App | listening at http://localhost:${port}`);
})