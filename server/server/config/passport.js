var passport = require('passport');
var User = require('../models').User;
var config = require('./auth');
var JwtStrategy = require('passport-jwt').Strategy;
var ExtractJwt = require('passport-jwt').ExtractJwt;
var LocalStrategy = require('passport-local').Strategy;

var localOptions = {
    usernameField: 'email'
};

//use a local email and password login strategy
var localLogin = new LocalStrategy(localOptions, (email, password, done) => {
    User.findOne({
        where: {
            email: email
        }
    }).then((user) => { 
        if(!user){
            return done(null, false, {error: 'Email does not match. Please try again.'})
        }
        User.comparePassword(password, user, done);
    })
    .catch((err) => {
        return done(err)
    })
});

//get the JSON secret key
var jwtOptions = {
    secretOrKey: config.secret,
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
};
 
//login with JSON token for session persistance
var jwtLogin = new JwtStrategy(jwtOptions, (payload, done) => {

    User.findById(payload.id)
        .then((user) => {
            if(user){
                done(null, user);
            } else {
                done(null, false);
            }
        })
        .catch((error) => {
            return done(err, false)
        }); 
});

passport.use(jwtLogin);
passport.use(localLogin);