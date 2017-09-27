const express = require('express');
const logger = require('morgan');
const bodyParser = require('body-parser');
const cors = require('cors');
const db = require("./server/models/index");
// Set up the express app
const app = express();
var env = require('dotenv').load();

// Log requests to the console.
app.use(logger('dev'));

// Parse incoming requests data (https://github.com/expressjs/body-parser)
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(cors());


db.sequelize.sync().then(() => {
    console.log("Nice! Database looks fine")
}).catch((err) => {
    console.log(err, "Something went wrong with the database");
});

require('./server/routes')(app);


module.exports = app;