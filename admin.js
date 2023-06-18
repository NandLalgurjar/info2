const express = require('express');

const app = express();

// dotenv configuration
require('dotenv').config();

// db connection
require('./src/datasource/dbConnection');

// routes file imported

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
require('./src/admin/')(app);

// server listen
app.listen(process.env.ADMIN_PORT, () => {
    console.log(`Server is running on ${process.env.ADMIN_PORT}`);
});

