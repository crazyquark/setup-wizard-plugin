gatewaydSetupWizard.service('ApiService', ['$http', function($http) {
  function API() {
  }

  API.prototype = {
    setup: function(config, callback) {
      $http.post('/wizard/setup', config)
        .success(function(response, status, headers){
          callback(null, response);
        })
        .error(function(response, status, headers){
          callback(response);
        });
    }
  }

  return new API;

}]);