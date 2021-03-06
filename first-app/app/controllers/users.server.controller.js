var User = require('mongoose').model('User'),
  passport = require('passport');

var getErrorMessage = function(err) {
  var message = '';

  if (err.code) {
    switch (err.code) {
      case 11000:
      case 11001:
        message = 'Username already exists';
        break;
      default:
        message = 'Something went wrong';
    }
  } else {
    for (var errName in err.errors) {
      if (err.errors[errName].message) {
        message = err.errors[errName].message;
      }

      return message;
    }
  }
};

exports.requiresLogin = function(req, res, next) {
  if (!req.isAuthenticated()) {
    return res.status(401).send({
      message: 'User is not signed in'
    });
  }
  next();
};

// 로그인 페이지
exports.renderSignin = function(req, res, next) {
  if (!req.user) {
    res.render('signin', {
      title: 'sign in form',
      messages: req.flash('error') || req.flash('info')
    });
  } else {
    return res.redirect('/');
  }
};

// 가입 페이지
exports.renderSignup = function(req, res, next) {
  if (!req.user) {
    res.render('signup', {
      title: 'sign up form',
      messages: req.flash('error')
    });
  } else {
    return res.redirect('/');
  }
};

// 로그인 처리
exports.signup = function(req, res, next) {
  if (!req.user) {
    var user = new User(req.body),
      message = null;

    user.provider = 'local';
    user.save(function(err) {
      if (err) {
        var message = getErrorMessage(err);
        req.flash('error', message);
        return res.redirect('/signup');
      }

      req.login(user, function(err) {
        if (err) {
          return next(err);
        }

        return res.redirect('/');
      });
    });
  } else {
    return res.redirect('/');
  }
};

// 로그아웃
exports.signout = function(req, res) {
  req.logout();
  res.redirect('/');
}
