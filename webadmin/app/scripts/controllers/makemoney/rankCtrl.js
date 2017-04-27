(function () {
  'use strict';

  /**
   * @ngdoc function
   * @name webApp.controller:MainCtrl
   * @description
   * # MainCtrl
   * Controller of the webApp
   */
  angular.module('webApp').controller('rankCtrl', rankCtrl);

  function rankCtrl($scope, commonServ, HOST) {
    commonServ.post({
      url: HOST + "/ranklist/commission-list",
      success: function (data) {
        $scope.rankList = data.errmsg.data;
      },
      error: function (data) {

      }
    })


  }

  rankCtrl.$inject = ['$scope', 'commonServ', 'HOST'];
})();
