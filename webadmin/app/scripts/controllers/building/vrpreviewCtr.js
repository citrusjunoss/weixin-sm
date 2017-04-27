/**
 * Created by KellyJia on 2016/10/9.
 */
(function(){
  'use strict';
  angular.module('webApp').controller('vrpreviewCtr',vrpreviewCtr);
  function vrpreviewCtr($scope,commonServ,HOST,$location) {
    var id = $location.search().id;
    $scope.isLoading = {
      display: "block"
    };
    getVR();// VR看房
    function getVR(){
      var url = HOST + '/house/list';
      commonServ.post({
        url:url,
        param:{house_type_id:id},
        success:function(data){
          $scope.buildingInfo =  data.errmsg.data;
          $scope.isLoading = {
            display: "none"
          };
        },
        error:function(data){
          $scope.isLoading = {
            display: "none"
          };
           wsh.successText(data.errmsg)
        }
      });
    }

  }
  vrpreviewCtr.$inject=['$scope','commonServ','HOST','$location'];
})();
