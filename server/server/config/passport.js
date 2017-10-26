var passport = require('passport');
var User = require('../models').User;
var config = require('./auth');
var JwtStrategy = require('passport-jwt').Strategy;
var ExtractJwt = require('passport-jwt').ExtractJwt;
var LocalStrategy = require('passport-local').Strategy;

var localOptions = {
    usernameField: 'email'
};

var localLogin = new LocalStrategy(localOptions, (email, password, done) => {
    User.findOne({
        where: {
            email: email
        }
    }).then((user) => { 
        if(!user){
            return done(null, false, {error: 'Email does not match. Please try again.'})
        }
        User.comparePassword (password, user, (err, isMatch) => {
            if(err){
                console.log("Inside error");
                return done(err);
            }

            if(!isMatch){
                console.log("This failed");
                return done(null, false, {error: 'Password does not match. Please try again.'});
            }
            console.log("User is in: ", user)
            return done(null, user);
        });
    })
    .catch((err) => {
        return done(err)
    })
});

var jwtOptions = {
    secretOrKey: config.secret,
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
};
 
var jwtLogin = new JwtStrategy(jwtOptions, (payload, done) => {
    console.log("Inside the jwtLogin");
    console.log("payload is: " + payload);

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