(function() {
  'use strict';

  angular
  .module('roboconf.applications')
  .controller('SingleApplicationTemplateController', singleApplicationTemplateController);

  singleApplicationTemplateController.$inject =
    ['Restangular', '$scope', '$routeParams', 'rAppTemplates', '$window', 'rUtils'];

  function singleApplicationTemplateController(Restangular, $scope, $routeParams, rAppTemplates, $window, rUtils) {

    // Fields
    $scope.invoked = false;
    $scope.error = false;
    $scope.askToDelete = false;
    $scope.showRestError = false;
    $scope.associatedApps = [];

    $scope.deleteApplicationTemplate = deleteApplicationTemplate;
    $scope.findAvatar = rUtils.findRandomAvatar;
    $scope.findIcon = rUtils.findIcon;

    // Initial actions
    findApplicationTemplate($routeParams.tplName, $routeParams.tplQualifier);
    listAssociatedApplications($routeParams.tplName, $routeParams.tplQualifier);

    // Function definitions
    function findApplicationTemplate(appName, appQualifier) {

      rAppTemplates.refreshTemplates().then(function() {
        $scope.invoked = true;
        $scope.error = rAppTemplates.gotErrors();
        $scope.app = rAppTemplates.getTemplates().filter(function(val, index, arr) {
          return val.name === appName && val.qualifier === appQualifier;
        }).pop();
      });
    }

    function deleteApplicationTemplate() {
      Restangular.one('applications/templates/' + $routeParams.tplName + '/' + $routeParams.tplQualifier)
      .remove().then(function() {
        $window.location = '#/application-templates';
      }, function() {
        $scope.showRestError = true;
      }).finally (function() {
        $scope.askToDelete = false;
      });
    }

    function listAssociatedApplications(name, qualifier) {
      Restangular.all('applications').getList().
      then(function(applications) {
        $scope.associatedApps = applications.filter(function(val, index, arr) {
          return val.tpl.name === name && val.tpl.qualifier === qualifier;
        });
      });
    }
  }
})();
