const express = require('express');
const expressSession = require('express-session');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const passport = require('passport');
const localStrategy = ('passport-local');


const app = express();
app.use(bodyParser.json());
const port = 6969;
app.listen(port, () => console.log(`listening on port ${port}`));
mongoose.connect('mongodb://localhost/courseTracker');
mongoose.connection.once('open', () => console.log('connected to MongoDB'));
