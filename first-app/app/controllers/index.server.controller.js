exports.render = function(req, res) {

  res.render('index', {
    title: 'This is node server',
    userFullName: req.user ? req.user.fullName : 'No login!',
    isLogin: req.user ? true : false
  });
}
