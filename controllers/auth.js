var passport = require('passport');
var BasicStrategy = require('passport-http').BasicStrategy;
var User = require('../models/user');

passport.use(new BasicStrategy(
  function(userName, userPassword, callback) {
    User.findOne({ email: userName }, function (err, user) {

      if (err) { return callback(err); }

      // No user found with that email
      if (!user) { return callback(null, false); }

      // Make sure the password is correct
      user.verifyPassword(userPassword, function(err, isMatch) {
        if (err) { return callback(err); }

        // Password did not match
        if (!isMatch) { return callback(null, false); }

        // Success
        return callback(null, user);
      });
    });
  }
));

exports.isAuthenticated = function(req, res, next, secret) {
  passport.authenticate('basic', { 
    session : false 
    }, function(err, user, info) {
      if (err) { return next(err) }
      if (user) {
        if (!user.verified) {
          res.status(500).json({ message: 'Email address not yet verified. Please click on the link in your verification email to activate your account.', verify: true });
        } else {
          var token = user.createToken(secret);
          res.json({ token: token, roles: user.roles });
        }
        
      } else {
        res.status(401).json({ message: 'Unauthorized access!' });
      }
    })(req, res, next);
};

exports.hasRole = function(req, res, next) {
  var requestedRole = req.url.split('/')[1];

  if (requestedRole === 'login' || requestedRole === 'register') {
    next();
  } else {
    if (req.user.roles.indexOf(requestedRole) !== -1) {
      next();
    } else {
      res.status(403).json({ message: 'Unauthorized access!' });
    }
  }
};

exports.getRoles = function(req, res, next) {
  if (req.user.roles) {
    res.json({ roles: req.user.roles });
  } else {
    res.status(403).json({ message: 'Unauthorized access!' });
  }
};