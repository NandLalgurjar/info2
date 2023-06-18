const mongoose = require("mongoose");
// console.log(process.env.DB_URL);
mongoose.connect(process.env.DB_URL).then(() => {
    console.log('Connected Successfully')
}).catch(error => console.log('Failed to connect', error));



