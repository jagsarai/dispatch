const Load = require('../models').Load;


module.exports = {
    create(req, res) {
        return Load
            .create({
                UserId: parseInt(req.params.userId),
                TruckId: req.params.truckId,
                ShipperId: req.params.shipperId,
                RecieverId: req.params.recieverId,
            })
            .then(load => res.status(201).send(load))
            .catch(error => res.status(400).send(error))
    },
    list(req, res) {
        return Load
            .findAll({
                include: [{
                    all: true
                }]
            })
            .then(loads => res.status(200).send(loads))
            .catch(error => res.status(400).send(error))
    },
    retrive(req, res) {
        return Load
            .findById(req.params.loadId, {
            })
            .then(load => {
                if (!load){
                    return res.status(404).send({
                        message: 'Load Not Found'
                    });
                }
                return res.status(200).send(laod);
            })
            .catch(error => res.status(400).send(error));
    },
    update(req, res){
        return Load
            .findById(req.params.loadId, {  
            })
            .then(load => {
                if(!load){
                    return res.status(400).send({
                        message: "Load not Found"
                    })
                }
                return load 
                    .update({
                        UserId: req.body.userId || load.UserId,
                        ShipperId: req.body.shipperId || load.ShipperId,
                        RecieverId: req.body.recieverId || load.RecieverId,
                        TruckId: req.body.truckId || load.TruckId,
                    })
                    .then(() => res.status(200).send(todo))
                    .catch((error) => res.status(400).send(error));
            })
            .catch( (error) => res.status(400).send(error));
    },
    destroy(req, res) {
        return Load
          .findById(req.params.loadId)
          .then(load => {
            if (!load) {
              return res.status(400).send({
                message: 'Load Not Found',
              });
            }
            return Load
              .destroy()
              .then(() => res.status(204).send({
                  message: 'Load Successfully removed'
              }))
              .catch(error => res.status(400).send(error));
          })
          .catch(error => res.status(400).send(error));
      }
};