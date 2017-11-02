const User = require('../models').User;
var bcrypt = require('bcrypt-node');
var saltNum = require('../config/salt').SALT_WORK_FACTOR;
var mailGunConfig = require('../config/email');
const mailGun = require('mailgun-js')(mailGunConfig);

//generate salt for password
let salt = bcrypt.genSalt(saltNum,(err, salt) => {
    return salt;
})


module.exports = {
    
    list(req, res) {
        return User
            .findAll()
            .then((users) => {
                users.map((user) => {
                    user.password = "hidden";
                });
                res.status(200).send(users)
            })
            .catch(error => res.status(400).send(error))
    },
    listDrivers(req, res) {
        return User
            .findAll({
                where: {
                    role: 'driver'
                }
            })
            .then((drivers) => {
                drivers.map((driver) => {
                    driver.password = "hidden";
                });
                res.status(200).send(drivers)
            })
            .catch(error => res.status(400).send(error))
    },
    retrive(req, res) {
        return User
            .findById(req.params.userId, {
            })
            .then((user) => {
                if (!user){
                    return res.status(404).send({
                        message: 'User Not Found'
                    });
                }
                user.password = "hidden";
                return res.status(200).send(user);
            })
            .catch(error => res.status(400).send(error));
    },
    update(req, res){
        return User
            .findById(req.params.userId, {  
            })
            .then((user) => {
                if(!user){
                    return res.status(400).send({
                        message: "User not Found"
                    })
                }
                return user 
                    .update({
                        name: req.body.name || user.name,
                        email: req.body.email || user.email,
                        password: bcrypt.hashSync(req.body.password, salt) || user.password,
                        phone: req.body.phone || user.phone,
                        role: req.body.role || user.role
                    })
                    .then(() => res.status(200).send(user))
                    .catch((error) => res.status(400).send(error));
            })
            .catch( (error) => res.status(400).send(error));
    },
    destroy(req, res) {
        return User
          .findById(req.params.userId)
          .then((user) => {
            if (!user) {
              return res.status(400).send({
                message: 'User Not Found',
              });
            }
            return user
              .destroy()
              .then(() => res.status(204).send({
                  message: "User successfully removed"
              }))
              .catch(error => res.status(400).send(error));
          })
          .catch(error => res.status(400).send(error));
    },
    passwordReset(req, res){
        return User
         .findOne({
             where:{
                 email : req.body.email
             }
         }).then((user) => {
             if(!user){
                 return res.status(404).send('Email not found, please try again');
             }
             let tempPassword = Math.random().toString(36).slice(-8);
             return user
                .update({
                    name: user.name,
                    email: user.email,
                    password: bcrypt.hashSync(tempPassword, salt),
                    phone: user.phone,
                    role: user.role,
                    firstLogin: true
                }).then(() => {
                    var data = {
                        from: '<postmaster@sandboxc405fb24f04442438e497838ee5022cd.mailgun.org>',
                        to: 'sarai.jagvir@gmail.com',
                        subject: 'Password Reset',
                        text: `Hi ${user.name}, here is your temporary password ${tempPassword}, please log in and change your password. Thanks.`
                    };
                    mailGun.messages().send(data, (error, body) => {
                        if(error){
                            res.status(400).send("There was a problem sending your temporary password, please try again.")
                        }
                    });
                    res.status(200).send("Your password has been reset, please check your email for further instructions");
                }).catch((error) => {
                    res.status(400).send(error);
                });
         });
    },
    changePassword(req, res){
        return User
         .findOne({
             where:{
                 email : req.body.email
             }
         }).then((user) => {
             if(!user){
                 return res.status(404).send('Unable to locate user.');
             }
             return user
                .update({
                    name: user.name,
                    email: user.email,
                    password: bcrypt.hashSync(req.body.password, salt),
                    phone: user.phone,
                    role: user.role,
                    firstLogin: false
                }).then((user) => {
                    var data = {
                        from: '<postmaster@sandboxc405fb24f04442438e497838ee5022cd.mailgun.org>',
                        to: 'sarai.jagvir@gmail.com',
                        subject: 'Password Changed',
                        text: `Hi ${user.name}, your password was recently changed, if you did not make this change, please contact the admin.`
                    };
                    mailGun.messages().send(data, (error, body) => {
                        if(error){
                            console.log("Password change email not sent: ", error);
                        }
                    });
                    res.status(200).json({user: user});
                }).catch((error) => {
                    res.status(400).send(error);
                });
         });
    },
};