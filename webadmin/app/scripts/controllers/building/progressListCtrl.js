/**
 * @ngdoc function
 * @name webApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the webApp
 */
(function () {
  'use strict';
  angular.module('webApp').controller('progressListCtrl', progressListCtrl);
  function progressListCtrl($scope, $timeout, $location, HOST, $rootScope,commonServ) {
          var house_id = $location.search().id;
          var ajaxData = {
            house_id:house_id
          };
          $scope.progressInfo = {};
          getProgressDetail();
          // 获取项目进度详情
          function getProgressDetail() {
            commonServ.post({
              url:HOST + '/project/project-detail',
              param:ajaxData,
              success:function(data){
                $scope.progressInfo = data.errmsg.data;
              },
              error:function(data){
                wsh.successText(data.errmsg)
              }
            });
          }
          //工程进度跳转
        $scope.checkDetail = function (id) {
          window.location.href = 'building/progressdetail?id='+id;
        }
  }
  progressListCtrl.$inject = ['$scope', '$timeout', '$location', 'HOST', '$rootScope', 'commonServ']
})();



