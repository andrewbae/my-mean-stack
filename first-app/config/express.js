var config = require('./config'), // config
  express = require('express'),
  morgan = require('morgan'),
  compress = require('compression'),
  bodyParser = require('body-parser'),
  methodOverride = require('method-override'),
  session = require('express-session'),
  flash = require('connect-flash'),
  passport = require('passport');

module.exports = function() {
  // 웹서버 미들웨어
  var app = express();

  // morgan : 로거 미들웨어
  // compression : 응답 압축
  if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
  } else if (process.env.NODE_ENV === 'production') {
    app.use(compress());
  }

  // body parser : 요청 데이터 처리
  app.use(bodyParser.urlencoded({
    extended: true
  }));
  app.use(bodyParser.json());

  // method override : delete, put http method 사용
  app.use(methodOverride());

  // session : 사용자 추적
  app.use(session({
    saveUninitialized: true,
    resave: true,
    secret: config.sessionSecret
  }));

  // 뷰
  app.set('views', './app/views');
  app.set('view engine', 'ejs');

  // connect-flash
  app.use(flash());

  // passport
  app.use(passport.initialize());
  app.use(passport.session());

  // 라우팅
  require('../app/routes/index.server.routes.js')(app);
  require('../app/routes/users.server.routes.js')(app);
  require('../app/routes/articles.server.routes.js')(app);

  // 정적파일 경로
  app.use(express.static('./public'));

  return app;
};
