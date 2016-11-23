var mongoose = require('mongoose'),
  crypto = require('crypto'),
  Schema = mongoose.Schema;

var UserSchema = new Schema({
  firstName: String,
  lastName: String,
  email: {
    type: String,
    match: [
      /.+\@.+\..+/,
      'Please fill a valid email address'
    ]
  },
  username: {
    type: String,
    trim: true,
    unique: true,
    required: 'Username is required'
  },
  password: {
    type: String,
    validate: [
      function(password) {
        return password && password.length >= 6;
      },
      'Password should be longer'
    ]
  },
  // 암호 해시
  salt: String,
  // 사용자를 등록하기 위해 사용되는 전략 지시
  provider: {
    type: String,
    required: 'Provider is required'
  },
  // 인증 전략을 위한 사용자 식별자를 지시
  providerId: String,
  // OAuth 공급자로부터 인출한 사용자 객체를 저장
  providerData: {},
  created: {
    type: Date,
    default: Date.now
  },
});

// 가상 속성
UserSchema.virtual('fullName').get(function() {
  return this.firstName + ' ' + this.lastName;
}).set(function(fullName) {
  var splitName = fullName.split(' ');
  this.firstName = splitName[0] || '';
  this.lastName = splitName[1] || '';
});

UserSchema.pre('save', function(next) {
  if (this.password) {
    // 자동으로 가상 난수 해시 솔트 생성
    this.salt = new Buffer(crypto.randomBytes(16).toString('base64'), 'base64');
    // 해시된 비밀번호로 치환
    this.password = this.hashPassword(this.password);
  }

  next();
});

// 인스턴스 메소드 : crypto 모듈을 활용해 비밀번호 문자열 해시
UserSchema.methods.hashPassword = function(password) {
  return crypto.pbkdf2Sync(password, this.salt, 10000, 64).toString('base64');
};

// 인스턴스 메소드 : 현재 사용자의 해시 비밀번호와 비교
UserSchema.methods.authenticate = function(password) {
  return this.password === this.hashPassword(password);
};

// 정적 메소드 : 새로운 사용자가 선택 가능한 유일한 이름을 찾음
UserSchema.statics.findUniqueUserName = function(username, suffix, callback) {
  var _this = this,
    possibleUsername = username + (suffix || '');

  _this.findOne({
    username: possibleUsername
  }, function(err, user) {
    if (!err) {
      if (!user) {
        callback(possibleUsername);
      } else {
        return _this.findUniqueUserName(username, (suffix || 0) + 1, callback);
      }
    } else {
      callback(null);
    }
  });
}

// 맞춤식 인출 변경자
UserSchema.set('toJSON', {
  getters: true,
  virtuals: true
});

mongoose.model('User', UserSchema);
