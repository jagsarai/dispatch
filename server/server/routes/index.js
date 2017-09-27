const usersController = require('../controllers').users;
const loadsController = require('../controllers').loads;
const trucksController = require('../controllers').trucks;
const shippersController = require('../controllers').shippers;
const receiversController = require('../controllers').receivers;
const AuthenticationController = require('../controllers/authentication');
const passportService = require('../config/passport');
const passport = require('passport');

var requireAuth = passport.authenticate('jwt', {session: false});
var requireLogin = passport.authenticate('local', {session: false});

module.exports = (app) => {
    app.get('/api', (req, res) => res.status(200).send({
        message: 'Welcome!'
    }));

    
    app.get('/api/protected', requireAuth, function(req, res){
        res.status(200).send({ content: 'Success'});
    });

    app.post('/api/register', AuthenticationController.register);
    app.post('/api/login', requireLogin, AuthenticationController.login);

    app.get('/api/users', requireAuth, usersController.list);
    app.get('/api/users/:userId', requireAuth, usersController.retrive);
    app.put('/api/users/:userId', requireAuth, usersController.update);
    app.delete('/api/users/:userId', requireAuth, usersController.destroy);

    app.post('/api/loads/', requireAuth, loadsController.create);
    app.get('/api/loads', requireAuth, loadsController.list);
    app.get('/api/loads/:loadId', requireAuth, loadsController.retrive);
    app.put('/api/loads/:loadId', requireAuth, loadsController.update);
    app.delete('/api/loads/:loadId', requireAuth, loadsController.destroy);

    app.post('/api/trucks', requireAuth, trucksController.create);
    app.get('/api/trucks', requireAuth, trucksController.list);
    app.get('/api/trucks/:truckId', requireAuth, trucksController.retrive);
    app.put('/api/trucks/:truckId', requireAuth, trucksController.update);
    app.delete('/api/trucks/:truckId', requireAuth, trucksController.destroy);

    app.post('/api/shippers', requireAuth, shippersController.create);
    app.get('/api/shippers', requireAuth, shippersController.list);
    app.get('/api/shippers/:shipperId', requireAuth, shippersController.retrive);
    app.put('/api/shippers/:shipperId', requireAuth, shippersController.update);
    app.delete('/api/shippers/:shipperId', requireAuth, shippersController.destroy);

    app.post('/api/receivers', requireAuth, receiversController.create);
    app.get('/api/receivers', requireAuth, receiversController.list);
    app.get('/api/receivers/:receiverId', requireAuth, receiversController.retrive);
    app.put('/api/receivers/:receiverId', requireAuth, receiversController.update);
    app.delete('/api/receivers/:receiverId', requireAuth, receiversController.destroy);
}
