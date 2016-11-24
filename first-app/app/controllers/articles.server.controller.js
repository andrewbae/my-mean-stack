var mongoose = require('mongoose'),
  Article = mongoose.model('Article');

// 에러메시지 반환
var getErrorMessage = function(err) {
  if (err.errors) {
    for (var errName in err.errors) {
      if (err.errors[errName].message) {
        return err.errors[errName].message;
      }
    }
  } else {
    return 'Unknown server error';
  }
};

// 작성자 검증
exports.hasAuthorization = function(req, res, next) {
  if (req.article.creator.id !== req.user.id) {
    return res.status(403).send({
      message: 'User is not authorized'
    });
  }
  next();
};

// 다큐먼트 생성
exports.create = function(req, res) {
  var article = new Article(req.body);
  article.creator = req.user;

  article.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: getErrorMessage(err)
      });
    } else {
      res.json(article);
    }
  });
};

// 다큐먼트 목록
exports.list = function(req, res) {
  Article.find().sort('-created').populate('creator', 'firstName lastName fullName').exec(
    function(err, articles) {
      if (err) {
        return res.status(400).send({
          message: getErrorMessage(err)
        });
      } else {
        res.json(articles);
      }
    }
  );
};

// 다큐먼트 읽기
exports.read = function(req, res) {
  res.json(req.article);
};

// 다큐먼트 수정
exports.update = function(req, res) {
  var article = req.article;

  article.title = req.body.title;
  article.content = req.body.content;

  article.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: getErrorMessage(err)
      });
    } else {
      res.json(article);
    }
  });
};

// 다큐먼트 삭제
exports.delete = function(req, res) {
  var article = req.article;

  article.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: getErrorMessage(err)
      });
    } else {
      res.json(article);
    }
  })
};

// id로 다큐먼트 반환
exports.articleByID = function(req, res, next, id) {
  Article.findById(id).populate('creator', 'firstName lastName fullName').exec(
    function(err, article) {
      if (err) {
        return next(err);
      }

      if (!article) {
        return next(new Error('Failed to load article : ' + id));
      }

      req.article = article;
      next();
    }
  );
};
