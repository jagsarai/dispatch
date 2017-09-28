var jwt = require('jsonwebtoken');  
var User = require('../models').User;
var authConfig = require('../config/auth');
var bcypt = require('bcrypt-node');
var saltNum = require('../config/salt').SALT_WORK_FACTOR;

var salt = bcypt.genSalt(saltNum,(err, salt) => {
    console.log("salt is " + salt);
    return salt;
})

 
function generateToken(user){
    return jwt.sign(user, authConfig.secret, {
        expiresIn: 10080
    });
}
 
function setUserInfo(request){
    console.log("inside setUserInfo");
    console.log("request id: " + request.id);
    console.log("request email: " + request.email);
    console.log("request role: " + request.role);    
    return {
        id: request.id,
        email: request.email,
        role: request.role
    };
}
 
exports.login = function(req, res, next){
    console.log("Request info: " + req.user);
    var userInfo = setUserInfo(req.user);
    res.status(200).json({
        token: 'JWT ' + generateToken(userInfo),
        user: userInfo
    });
    next(req.user);
}
 
exports.register = function(req, res, next){
    console.log("inside register function");
    console.log(req.body.email);
    console.log(req.body.password);
    console.log(req.body.role);
    console.log(req.body.name);
    console.log(req.body.phone);

    var email = req.body.email;
    var password = bcypt.hashSync(req.body.password, salt);
    var role = req.body.role;
    var name = req.body.name;
    var phone =  parseInt(req.body.phone);
 
    if(!email){
        return res.status(422).send({error: 'You must enter an email address'});
    }
 
    if(!password){
        return res.status(422).send({error: 'You must enter a password'});
    }

    User.findOne({
        where: {
            email: email
        }
    }).then((existingUser) => {

        if(existingUser){
            return res.status(400).send({
                error: "That Email address is already is use"
            })
        }

        User.create({
            role: role,
            phone: phone,
            name: name,
            email: email,
            password: password
        }).then((user) => {
            var userInfo = setUserInfo(user);

            res.status(201).json({
                token: 'JWT' + generateToken(userInfo),
                user: userInfo
            })
        })
        .catch(error => {
            res.status(400).send(error)
            next(error);
        })
    })
    .catch(error => {res.status(400).send(error)
        next(error);
    })
}
 
exports.roleAuthorization = function(roles){
    console.log("Inside the role auth function");
    return function(req, res, next){
        console.log("user inside the role auth: " + req.user)
        var user = req.user;

        User.findById(user.id)
        
        .then((foundUser) => {
                
            if(roles.indexOf(foundUser.role) > -1){
                return next();
            }
    
            res.status(401).json({error: 'You are not authorized to view this content'});
            return next('Unauthorized');
        })
        .catch((error) => {
            res.status(422).json({error: 'No user found.'});
            return next(error)
        }); 
    }
}