exports.render = function(req, res) {
  res.render('index', {
    title: 'This is node server',
    user: JSON.stringify(req.user)
  });
}
