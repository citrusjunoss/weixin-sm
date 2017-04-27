/**
 * @ngdoc function
 * @name webApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the webApp
 */
(function () {
  'use strict';
  angular.module('webApp').controller('newsCtrl', newsCtrl);
  function newsCtrl($scope,HOST,commonServ, $timeout,viewImage) {
    var url = HOST + '/information/top-info';
    commonServ.post({
      url: url,
      success: function (data,status,headers,config) {
        $scope.news = data.errmsg.data;
        $timeout(function(){
            viewImage($scope.news.content);
        },500);
      },
      error: function (data) {

      }
    });
  }
  newsCtrl.$inject = ['$scope','HOST','commonServ','$timeout','viewImage'];
})();
