var config = require('./config'),
  mongoose = require('mongoose');

module.exports = function() {
  // db 연결
  var db = mongoose.connect(config.db);

  // 모델 읽기
  require('../app/models/user.server.model');
  require('../app/models/article.server.model');

  return db;
};
