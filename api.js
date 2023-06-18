const express = require('express');
const cors = require('cors');

const app = express();
global.c = console.log.bind(console);


// dotenv configuration
require('dotenv').config();

const { routeNotFound, globalErrors } = require('./src/helpers/errorHandlers');

// db connection
require('./src/datasource/dbConnection');

// routes file imported
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
require('./src/api/routes')(app);
app.use(cors());
app.use(routeNotFound);
app.use(globalErrors);


// server listen
app.listen(process.env.API_PORT, () => {
    console.log(`Server is running on ${process.env.API_PORT}`);
});

