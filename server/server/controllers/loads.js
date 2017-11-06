const Load = require('../models').Load;


module.exports = {
    create(req, res) {
        return Load
            .create({
                UserId: req.body.userId,
                TruckId: req.body.truckId,
                ShipperId: req.body.shipperId,
                ReceiverId: req.body.receiverId,
                pickupDate: req.body.pickupDate,
                pickupTime: req.body.pickupTime,
                deliveryDate: req.body.deliveryDate,
                deliveryTime: req.body.deliveryTime,
            })
            .then(load => res.status(201).send(load))
            .catch(error => res.status(400).send(error))
    },
    list(req, res) {
        return Load
            .findAll({
                include: [{
                    all: true
                }],
                order:['id']
            })
            .then(loads => {
                loads.map((load) => {
                    load.driver.password = "hidden"
                });
                res.status(200).send(loads)
            })
            .catch(error => res.status(400).send(error))
    },
    getDriverLoads(req, res) {
        return Load
            .findAll({
                where: {
                    UserId: req.body.driverId,
                    status: ['dispatched', 'at shipper', 'loaded', 'en route', 'at receiver', 'delivered', 'completed']
                },
                include: [{
                    all: true
                }]
            })
            .then(loads => {
                loads.map((load) => {
                    load.driver.password = "hidden";
                });
                res.status(200).send(loads)
            })
            .catch(error => res.status(400).send(error))
    },
    retrive(req, res) {
        return Load
            .findById(req.params.loadId)
            .then(load => {
                if (!load){
                    return res.status(404).send({
                        message: 'Load Not Found'
                    });
                }
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
                // load.filesData = [];
                // load.filesData.shift();
                return load
                    .update({
                        UserId: req.body.userId || load.UserId,
                        ShipperId: req.body.shipperId || load.ShipperId,
                        ReceiverId: req.body.receiverId || load.ReceiverId,
                        TruckId: req.body.truckId || load.TruckId,
                        pickupDate: req.body.pickupDate || load.pickupDate,
                        pickupTime: req.body.pickupTime || load.pickupTime,
                        deliveryDate: req.body.deliveryDate || load.deliveryDate,
                        deliveryTime: req.body.deliveryTime || load.deliveryTime,
                        status: req.body.status || load.status,
                        filesUploaded: req.body.filesUploaded || load.filesUploaded,
                        filesData: req.body.filesData || load.filesData,
                        loadAccepted: req.body.loadAccepted || load.loadAccepted,
                        loadRejected: req.body.loadRejected || load.loadRejected
                        // filesData: load.filesData 
                    })
                    .then(() => res.status(200).send(load))
                    .catch((error) => {
                        res.status(400).send(error)}
                    );
            })
            .catch( (error) => {
                res.status(400).send(error)
            })
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