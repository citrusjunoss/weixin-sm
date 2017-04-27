/**
 * @ngdoc function
 * @name webApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the webApp
 */
(function () {
  'use strict';

  angular.module('webApp').controller('marketActiveCtrl', marketActiveCtrl);
  function marketActiveCtrl($scope,$location) {
    
    $scope.id = $location.search().id;
  }
  marketActiveCtrl.$inject = ['$scope','$location']
})();
