gatewaydSetupWizard.controller('SetupCtrl', ['$scope', 'ApiService', function($scope, $api) {
  $scope.errors = [];

  $scope.config = {
    ripple_address: 'r1234...5'
  };

  $scope.setup = function(config) {
    $scope.errors = [];

    $api.setup($scope.config, function(error, response){

      if (error) {
        return $scope.errors = error.message;
      }


    });
  }
}]);