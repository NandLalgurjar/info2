const express = require('express');
const path = require('path');
const app = express();

app.use(express.static(path.join(__dirname, '/public')));

app.set('views', path.join(__dirname, 'src/admin/views'));
app.set("view engine", "ejs");

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
    console.log(`Admin Server is running on ${process.env.ADMIN_PORT}`);
});

