const Shipper = require('../models').Shipper;

module.exports = {
    create(req, res) {
        if(req.body.name.length < 5){
            let error =  "Shipper name has to be a minimum of 5 characters."
            return res.status(400).send(error);
        }
        return Shipper
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
        return Shipper
            .findAll()
            .then(users => res.status(200).send(users))
            .catch(error => res.status(400).send(error))
    },
    retrive(req, res) {
        return Shipper
            .findById(req.params.shipperId, {
            })
            .then(shipper => {
                if (!shipper){
                    return res.status(404).send({
                        message: 'Shipper Not Found'
                    });
                }
                return res.status(200).send(shipper);
            })
            .catch(error => res.status(400).send(error));
    },
    update(req, res){
        return Shipper
            .findById(req.params.shipperId, {  
            })
            .then(shipper => {
                if(!shipper){
                    return res.status(400).send({
                        message: "Shipper not Found"
                    })
                }
                return shipper 
                    .update({
                        name: req.body.name || shipper.name,
                        address: req.body.address || shipper.address,
                        city: req.body.city || shipper.city,
                        state: req.body.state || shipper.state,
                        zipCode: req.body.zipCode || shipper.zipCode
                    })
                    .then(() => res.status(200).send(shipper))
                    .catch((error) => res.status(400).send(error));
            })
            .catch( (error) => res.status(400).send(error));
    },
    destroy(req, res) {
        return Shipper
          .findById(req.params.shipperId)
          .then(shipper => {
            if (!shipper) {
              return res.status(400).send({
                message: 'Shipper Not Found',
              });
            }
            return shipper
              .destroy()
              .then(() => res.status(204).send({
                  message: 'Shipper Successfully removed'
              }))
              .catch(error => res.status(400).send(error));
          })
          .catch(error => res.status(400).send(error));
      }
};