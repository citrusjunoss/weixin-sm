/**
 * @ngdoc function
 * @name webApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the webApp
 */
(function () {
  'use strict';
  angular.module('webApp').controller('progressDetailCtrl', progressDetailCtrl);
  function progressDetailCtrl($scope, $timeout, $location, HOST, commonServ, viewImage) {
        var id = $location.search().id;
        var ajaxData = {
          id :id
        };
        $scope.progressInfo = '';
        getDetailInfo();
        function getDetailInfo() {
          commonServ.post({
            url:HOST + '/project/project-progress-detail',
            param:ajaxData,
            success:function(data){
              $scope.progressInfo = data.errmsg.data;

              $timeout(function(){
                  viewImage($scope.model.intro);
              },500);
            },
            error:function(data){
              wsh.successText(data.errmsg)
            }
          });
        }
  }
  progressDetailCtrl.$inject = ['$scope', '$timeout', '$location', 'HOST', 'commonServ', 'viewImage']
})();



