const User = require('../models').User;

module.exports = {
    create(req, res) {
        return User
            .create({
                role: req.body.role,
                phone: parseInt(req.body.phone),
                name: req.body.name,
                email: req.body.email,
                password: req.body.password
            })
            .then(user => res.status(201).send(user))
            .catch(error => res.status(400).send(error))
    },
    list(req, res) {
        return User
            .findAll()
            .then(users => res.status(200).send(users))
            .catch(error => res.status(400).send(error))
    },
    retrive(req, res) {
        return User
            .findById(req.params.userId, {
            })
            .then(user => {
                if (!user){
                    return res.status(404).send({
                        message: 'User Not Found'
                    });
                }
                return res.status(200).send(user);
            })
            .catch(error => res.status(400).send(error));
    },
    update(req, res){
        return User
            .findById(req.params.userId, {  
            })
            .then(user => {
                if(!user){
                    return res.status(400).send({
                        message: "User not Found"
                    })
                }
                return user 
                    .update({
                        name: req.body.name || user.name,
                        email: req.body.email || user.email,
                        password: req.body.password || user.password,
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
          .then(user => {
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
      }
};