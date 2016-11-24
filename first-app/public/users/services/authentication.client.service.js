angular.module('users').factory('Authentication', [
  function() {
    this.user = window.myUser;

    return {
      user: this.user
    };
  }
]);
