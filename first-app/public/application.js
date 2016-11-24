var mainApplicationModuleName = 'mean',
  mainApplicationModule = angular.module(mainApplicationModuleName, ['ngRoute', 'users', 'example']);

mainApplicationModule.config(['$locationProvider',
  function($locationProvider) {
    $locationProvider.hashPrefix('!');
  }
]);

// OAuth 인증 왕복 직후 애플리케이션의 URL에 해시를 추가하는 페이스북의 리다이렉트 버그 해결
if (window.location.hash === '#_=_') {
  window.location.hash = '#!';
}

angular.element(document).ready(function() {
  angular.bootstrap(document, [mainApplicationModuleName]);
});
