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
      when('/summary', {
        controller: 'SetupCtrl',
        templateUrl: 'views/summary.html'
      }).
      otherwise({
        redirectTo: '/setup'
      });
}]);