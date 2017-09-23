const Truck = require('../models').Truck;

module.exports = {
    create(req, res) {
        return Truck
            .create({
                year: req.body.year,
                make: req.body.make,
                model: req.body.model,
                number: req.body.number
            })
            .then(user => res.status(201).send(user))
            .catch(error => res.status(400).send(error))
    },
    list(req, res) {
        return Truck
            .findAll({
            })
            .then(users => res.status(200).send(users))
            .catch(error => res.status(400).send(error))
    },
    retrive(req, res) {
        return Truck
            .findById(req.params.truckId, {
            })
            .then(truck => {
                if (!truck){
                    return res.status(404).send({
                        message: 'Truck Not Found'
                    });
                }
                return res.status(200).send(truck);
            })
            .catch(error => res.status(400).send(error));
    },
    update(req, res){
        return Truck
            .findById(req.params.truckId, {  
            })
            .then(truck => {
                if(!truck){
                    return res.status(400).send({
                        message: "Truck not Found"
                    })
                }
                return truck 
                    .update({
                        number: req.body.number || truck.number,
                        year: req.body.year || truck.year,
                        make: req.body.make || truck.make,
                        model: req.body.model || truck.model,
                    })
                    .then(() => res.status(200).send(truck))
                    .catch((error) => res.status(400).send(error));
            })
            .catch( (error) => res.status(400).send(error));
    },
    destroy(req, res) {
        return Truck
          .findById(req.params.truckId)
          .then(truck => {
            if (!truck) {
              return res.status(400).send({
                message: 'Truck Not Found',
              });
            }
            return truck
              .destroy()
              .then(() => res.status(204).send({
                  message: 'Truck Successfully removed'
              }))
              .catch(error => res.status(400).send(error));
          })
          .catch(error => res.status(400).send(error));
      }
};