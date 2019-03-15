const express = require('express');
const path = require('path')
const morgan = require('morgan');
const cors = require('cors');
const app = express();

const passport = require('passport');
const cookieParser = require('cookie-parser');
const session = require('express-session');

//validador por medio de json web token
const jwt = require('jsonwebtoken');

//BD 
const mongoose = require('./database');

// Settings 
app.set('port', process.env.PORT || 3000);
app.set('json spaces', 4);

// Middlewares 
app.use(cors({
    origin: ['http://localhost:4200', 'http://127.0.0.1:4200', 'http://homeclean.cl','http://localhost'],
    credentials: true
}))

app.use(morgan('dev'));
app.use(express.json());
app.use(cookieParser());

const MongoStore = require('connect-mongo')(session);

app.use(session({
    name: '-tak-id',
    secret: 'BakoParadise57145894',
    resave: false,
    saveUninitialized: false,
    cookie:{
        maxAge: 36000000,
        httpOnly: false,
        secure: false
    },
    store: new MongoStore({ mongooseConnection: mongoose.connection })
}));
require('./config/passport');
app.use(passport.initialize());
app.use(passport.session())



// Routes
//app.use('/',  require('./routes/indexRoutes'));
app.use('/', express.static(path.join(__dirname, '../production/')));
app.use('/api/upload', require('./routes/uploadRoutes'));
app.use('/api/user', require('./routes/userRoutes'));


// Starting the server
app.listen(app.get('port'), () =>{
    console.log('Server on port', app.get('port'));

});
