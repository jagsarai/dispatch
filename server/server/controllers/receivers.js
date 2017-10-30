const Receiver = require('../models').Receiver;

module.exports = {
    create(req, res) {
        if(req.body.name.length < 5){
            let error = 'Receiver name has to be a minimum of 5 characters.'
            return res.status(400).send(error);
        }
        return Receiver
            .create({
                name: req.body.name,
                address: req.body.address,
                city: req.body.city,
                state: req.body.state,    
                zipCode: req.body.zipCode
            })
            .then(receiver => res.status(201).send(receiver))
            .catch(error => res.status(400).send(error))
    },
    list(req, res) {
        return Receiver
            .findAll()
            .then(receivers => res.status(200).send(receivers))
            .catch(error => res.status(400).send(error))
    },
    retrive(req, res) {
        return Receiver
            .findById(req.params.receiverId, {
            })
            .then(receiver => {
                if (!receiver){
                    return res.status(404).send({
                        message: 'Receiver Not Found'
                    });
                }
                return res.status(200).send(receiver);
            })
            .catch(error => res.status(400).send(error));
    },
    update(req, res){
        return Receiver
            .findById(req.params.receiverId, {  
            })
            .then(receiver => {
                if(!receiver){
                    return res.status(400).send({
                        message: "Receiver not Found"
                    })
                }
                return receiver 
                    .update({
                        name: req.body.name || receiver.name,
                        address: req.body.address || receiver.address,
                        city: req.body.city || receiver.city,
                        state: req.body.state || receiver.state,
                        zipCode: req.body.zipCode || receiver.zipCode
                    })
                    .then(() => res.status(200).send(receiver))
                    .catch((error) => res.status(400).send(error));
            })
            .catch( (error) => res.status(400).send(error));
    },
    destroy(req, res) {
        return Receiver
          .findById(req.params.receiverId)
          .then(receiver => {
            if (!receiver) {
              return res.status(400).send({
                message: 'Receiver Not Found',
              });
            }
            return receiver
              .destroy()
              .then(() => res.status(204).send({
                  message: 'Receiver Successfully removed'
              }))
              .catch(error => res.status(400).send(error));
          })
          .catch(error => res.status(400).send(error));
      }
};