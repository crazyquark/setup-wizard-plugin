gatewaydSetupWizard.controller('SetupCtrl', ['$scope', '$rootScope', '$location', 'ApiService', function($scope, $rootScope, $location, $api) {
  $scope.errors = [];

  $scope.config = {
    currencies: {}
  };
  
  $scope.config_results = {};
  $scope.isSubmitting = false;

  $scope.setup = function() {
    $scope.errors = [];
    $rootScope.setupResults = {};

    $scope.config.currencies[$scope.config.currency] = $scope.config.amount;
    $scope.isSubmitting = !$scope.isSubmitting;
    $api.setup($scope.config, function(error, response){
      $scope.isSubmitting = !$scope.isSubmitting;

      if (error) {
        return $scope.errors.push(error);
      }

      if (response.success) {
        $rootScope.setupResults = response.setup;
        $location.path('/summary');
      }

    });
  };

}]);
