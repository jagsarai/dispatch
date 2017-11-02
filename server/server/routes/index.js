const usersController = require('../controllers').users;
const loadsController = require('../controllers').loads;
const trucksController = require('../controllers').trucks;
const shippersController = require('../controllers').shippers;
const receiversController = require('../controllers').receivers;
const AuthenticationController = require('../controllers/authentication');
const passportService = require('../config/passport');
const passport = require('passport');


//require JSON token upon any request made 
var requireAuth = passport.authenticate('jwt', {session: false});

module.exports = (app) => {
    app.get('/api', (req, res) => res.status(200).send({
        message: 'Welcome!'
    }));

    
    app.get('/api/protected', requireAuth, function(req, res){
        res.status(200).send({ content: 'Success'});
    });

    app.get('/api/drivers', requireAuth, AuthenticationController.roleAuthorization(['admin']), usersController.listDrivers);
    app.post('/api/drivers/register', requireAuth, AuthenticationController.roleAuthorization(['admin']), AuthenticationController.register);


    app.post('/api/register', AuthenticationController.register);
    app.post('/api/login', function(req, res, next) {
        passport.authenticate('local', {session: false}, function(err, user, info) {
          if (err) { 
              return res.status(505).send(err);
          }
          if (!user) { 
              return res.status(401).send(info);
          }
          var success = AuthenticationController.login(user);
          res.status(200).json(success);
          next(user);
        })(req, res, next);
    });

    app.get('/api/users', requireAuth, AuthenticationController.roleAuthorization(['admin']), usersController.list);
    app.get('/api/users/:userId', requireAuth, AuthenticationController.roleAuthorization(['admin']), usersController.retrive);
    app.put('/api/users/:userId', requireAuth, AuthenticationController.roleAuthorization(['admin']), usersController.update);
    app.delete('/api/users/:userId', requireAuth, AuthenticationController.roleAuthorization(['admin']), usersController.destroy);
    app.post('/api/users/forgot_password', usersController.passwordReset)
    app.post('/api/users/change_password', requireAuth, usersController.changePassword)

    app.post('/api/loads/', requireAuth, AuthenticationController.roleAuthorization(['admin']), loadsController.create);
    app.get('/api/loads', requireAuth, AuthenticationController.roleAuthorization(['admin']), loadsController.list);
    app.get('/api/loads/:loadId', requireAuth, AuthenticationController.roleAuthorization(['admin', 'driver']), loadsController.retrive);
    app.put('/api/loads/:loadId', requireAuth, AuthenticationController.roleAuthorization(['admin', 'driver']), loadsController.update);
    app.delete('/api/loads/:loadId', requireAuth, AuthenticationController.roleAuthorization(['admin']), loadsController.destroy);
    app.post('/api/loads/driver', requireAuth, AuthenticationController.roleAuthorization(['admin', 'driver']), loadsController.getDriverLoads);

    app.post('/api/trucks', requireAuth, AuthenticationController.roleAuthorization(['admin']), trucksController.create);
    app.get('/api/trucks', requireAuth, AuthenticationController.roleAuthorization(['admin']), trucksController.list);
    app.get('/api/trucks/:truckId', requireAuth, AuthenticationController.roleAuthorization(['admin']), trucksController.retrive);
    app.put('/api/trucks/:truckId', requireAuth, AuthenticationController.roleAuthorization(['admin']), trucksController.update);
    app.delete('/api/trucks/:truckId', requireAuth, AuthenticationController.roleAuthorization(['admin']), trucksController.destroy);

    app.post('/api/shippers', requireAuth, AuthenticationController.roleAuthorization(['admin']), shippersController.create);
    app.get('/api/shippers', requireAuth, AuthenticationController.roleAuthorization(['admin']), shippersController.list);
    app.get('/api/shippers/:shipperId', requireAuth, AuthenticationController.roleAuthorization(['admin', 'driver']), shippersController.retrive);
    app.put('/api/shippers/:shipperId', requireAuth, AuthenticationController.roleAuthorization(['admin']), shippersController.update);
    app.delete('/api/shippers/:shipperId', requireAuth, AuthenticationController.roleAuthorization(['admin']), shippersController.destroy);

    app.post('/api/receivers', requireAuth, AuthenticationController.roleAuthorization(['admin']), receiversController.create);
    app.get('/api/receivers', requireAuth, AuthenticationController.roleAuthorization(['admin']), receiversController.list);
    app.get('/api/receivers/:receiverId', requireAuth, AuthenticationController.roleAuthorization(['admin', 'driver']), receiversController.retrive);
    app.put('/api/receivers/:receiverId', requireAuth, AuthenticationController.roleAuthorization(['admin']), receiversController.update);
    app.delete('/api/receivers/:receiverId', requireAuth, AuthenticationController.roleAuthorization(['admin']), receiversController.destroy);
}
