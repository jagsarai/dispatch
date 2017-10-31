var jwt = require('jsonwebtoken');  
var User = require('../models').User;
var authConfig = require('../config/auth');
var bcrypt = require('bcrypt-node');
var saltNum = require('../config/salt').SALT_WORK_FACTOR;
var mailGunConfig = require('../config/email');
const mailGun = require('mailgun-js')(mailGunConfig);


//generate salt for password
let salt = bcrypt.genSalt(saltNum,(err, salt) => {
    return salt;
})

//create a json token to attach with user
let generateToken = (user) => {
    return jwt.sign(user, authConfig.secret, {
        expiresIn: 10080
    });
}
 
let setUserInfo = (request) => {
    console.log("inside setUserInfo");
    console.log("request id: " + request.id);
    console.log("request email: " + request.email);
    console.log("request role: " + request.role);    
    return {
        id: request.id,
        phone: request.phone,
        email: request.email,
        role: request.role,
        firstLogin: request.firstLogin
    };
}
 
//set log in cerdentials after passing passport login test
exports.login = (user) => {
    var userInfo = setUserInfo(user);
    return {
        token: 'JWT ' + generateToken(userInfo),
        user: userInfo
    }
}

//handle incoming request to register user.
exports.register = (req, res, next) => {
    console.log("inside register function");
    console.log(req.body.email);
    console.log(req.body.password);
    console.log(req.body.role);
    console.log(req.body.name);
    console.log(req.body.phone);
    let user = {
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password, salt),
        role: req.body.role,
        name: req.body.name,
        phone:  parseInt(req.body.phone),
        firstLogin: req.body.firstLogin
    }
    let tempPassword = req.body.password
   
 
    if(!user.email){
        return res.status(422).send({error: 'You must enter an email address'});
    }
 
    if(!user.password){
        return res.status(422).send({error: 'You must enter a password'});
    }

    User.findOne({
        where: {
            email: user.email
        }
    }).then((existingUser) => {

        if(existingUser){
            return res.status(400).send({
                error: "That email address is already in use."
            })
        }

        User.findOne({
            where: {
                phone: user.phone
            }
        }).then((existingUser) => {

            if(existingUser){
                return res.status(400).send({
                    error: "That phone number is already in use."
                })
            }

            User.create(user).then((user) => {
                if(user.firstLogin){
                    this.sendMail(user, tempPassword);
                }
                var userInfo = setUserInfo(user);
                user.password = "hidden"
                res.status(201).json({
                    token: 'JWT' + generateToken(userInfo),
                    user: user,
                });
            })
            .catch(error => {
                res.status(400).send(error)
                next(error);
            })
        }).catch(error => {res.status(400).send(error)
            next(error);
        })
    }).catch(error => {res.status(400).send(error)
        next(error);
    })

}

//authorize the users role
exports.roleAuthorization = (roles) => {
    console.log("Inside the role auth function");
    return function(req, res, next){
        console.log("user inside the role auth: ")
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

exports.sendMail = (user, tempPassword) => {
    var data = {
      from: '<postmaster@sandboxc405fb24f04442438e497838ee5022cd.mailgun.org>',
      to: 'sarai.jagvir@gmail.com',
      subject: `${user.name}, you have a new load waiting`,
      text: `Hi ${user.name}, welcome to Simple Dispatch!! Please log in using your temp password ${tempPassword} and start hauling.`
    };    
    mailGun.messages().send(data, (error, body) => {
      if(error){
          console.log(error);
      }
      else{
          console.log("message sent");
      }
    });
}