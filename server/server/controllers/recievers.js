const Reciever = require('../models').Reciever;

module.exports = {
    create(req, res) {
        return Reciever
            .create({
                name: req.body.name,
                address: req.body.address,
                city: req.body.city,
                state: req.body.state,    
                zipCode: req.body.zipCode
            })
            .then(user => res.status(201).send(user))
            .catch(error => res.status(400).send(error))
    },
    list(req, res) {
        return Reciever
            .findAll()
            .then(users => res.status(200).send(users))
            .catch(error => res.status(400).send(error))
    },
    retrive(req, res) {
        return Reciever
            .findById(req.params.recieverId, {
            })
            .then(reciever => {
                if (!reciever){
                    return res.status(404).send({
                        message: 'Reciever Not Found'
                    });
                }
                return res.status(200).send(reciever);
            })
            .catch(error => res.status(400).send(error));
    },
    update(req, res){
        return Reciever
            .findById(req.params.recieverId, {  
            })
            .then(reciever => {
                if(!reciever){
                    return res.status(400).send({
                        message: "Reciever not Found"
                    })
                }
                return reciever 
                    .update({
                        name: req.body.name || reciever.name,
                        address: req.body.address || reciever.address,
                        city: req.body.city || reciever.city,
                        state: req.body.state || reciever.state,
                        zipCode: req.body.zipCode || reciever.zipCode
                    })
                    .then(() => res.status(200).send(reciever))
                    .catch((error) => res.status(400).send(error));
            })
            .catch( (error) => res.status(400).send(error));
    },
    destroy(req, res) {
        return Reciever
          .findById(req.params.recieverId)
          .then(reciever => {
            if (!reciever) {
              return res.status(400).send({
                message: 'Reciever Not Found',
              });
            }
            return reciever
              .destroy()
              .then(() => res.status(204).send({
                  message: 'Reciever Successfully removed'
              }))
              .catch(error => res.status(400).send(error));
          })
          .catch(error => res.status(400).send(error));
      }
};