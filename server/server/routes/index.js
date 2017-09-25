const usersController = require('../controllers').users;
const loadsController = require('../controllers').loads;
const trucksController = require('../controllers').trucks;
const shippersController = require('../controllers').shippers;
const recieversController = require('../controllers').recievers;
const AuthenticationController = require('../controllers/authentication');
const passportService = require('../config/passport');
const passport = require('passport');

var requireAuth = passport.authenticate('jwt', {session: false});
var requireLogin = passport.authenticate('local', {session: false});

module.exports = (app) => {
    app.get('/api', (req, res) => res.status(200).send({
        message: 'Welcome!'
    }));

    app.post('/register', AuthenticationController.register);
    app.post('/login', requireLogin, AuthenticationController.login);

    app.get('/protected', requireAuth, function(req, res){
        res.send({ content: 'Success'});
    });

    app.get('/api/users', requireAuth, usersController.list);
    app.get('/api/users/:userId', requireAuth, usersController.retrive);
    app.put('/api/users/:userId', requireAuth, usersController.update);
    app.delete('/api/users/:userId', requireAuth, usersController.destroy);

    app.post('/api/loads/:userId/:truckId/:shipperId/:recieverId/create', loadsController.create);
    app.get('/api/loads', loadsController.list);
    app.get('/api/loads/:loadId', loadsController.retrive);
    app.put('/api/loads/:loadId', loadsController.update);
    app.delete('/api/loads/:loadId', loadsController.destroy);

    app.post('/api/trucks', trucksController.create);
    app.get('/api/trucks', trucksController.list);
    app.get('/api/trucks/:truckId', trucksController.retrive);
    app.put('/api/trucks/:truckId', trucksController.update);
    app.delete('/api/trucks/:truckId', trucksController.destroy);

    app.post('/api/shippers', shippersController.create);
    app.get('/api/shippers', shippersController.list);
    app.get('/api/shippers/:shipperId', shippersController.retrive);
    app.put('/api/shippers/:shipperId', shippersController.update);
    app.delete('/api/shippers/:shipperId', shippersController.destroy);

    app.post('/api/recievers', recieversController.create);
    app.get('/api/recievers', recieversController.list);
    app.get('/api/recievers/:recieverId', recieversController.retrive);
    app.put('/api/recievers/:recieverId', recieversController.update);
    app.delete('/api/recievers/:recieverId', recieversController.destroy);
}
