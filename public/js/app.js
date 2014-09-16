var gatewaydSetupWizard = angular.module('gatewaydSetupWizard', [
  'ngRoute'
]);

gatewaydSetupWizard.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.
      when('/setup', {
        controller: 'SetupCtrl',
        templateUrl: 'views/setup_form.html'
      }).
      otherwise({
        redirectTo: '/setup'
      });
}]);