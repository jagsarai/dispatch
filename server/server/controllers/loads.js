const Load = require('../models').Load;


module.exports = {
    create(req, res) {
        return Load
            .create({
                UserId: req.body.userId,
                TruckId: req.body.truckId,
                ShipperId: req.body.shipperId,
                ReceiverId: req.body.receiverId,
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
            .then(loads => {
                loads.map((load) => {
                    load.driver.password = "hidden"
                });
                res.status(200).send(loads)
            })
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
                load.driver.password = "hidden";
                return res.status(200).send(load);
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
                        ReceiverId: req.body.receiverId || load.ReceiverId,
                        TruckId: req.body.truckId || load.TruckId,
                    })
                    .then(() => res.status(200).send(load))
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
            return load
              .destroy()
              .then(() => res.status(204).send({
                  message: 'Load Successfully removed'
              }))
              .catch(error => res.status(400).send(error));
          })
          .catch(error => res.status(400).send(error));
      }
};