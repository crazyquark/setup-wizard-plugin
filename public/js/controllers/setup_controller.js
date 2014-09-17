gatewaydSetupWizard.controller('SetupCtrl', ['$scope', 'ApiService', function($scope, $api) {
  $scope.errors = [];

  $scope.config = {
    currencies: {}
  };
  
  $scope.config_results = {};
  
  $scope.setup = function() {
    $scope.errors = [];
    $scope.config.currencies[$scope.config.currency] = $scope.config.amount;

    $api.setup($scope.config, function(error, response){
      if (error) {
        return $scope.errors = error.message;
      }
      $scope.config_results = response;
    });
  }
}]);