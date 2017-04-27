(function () {
  'use strict';
  angular.module("webApp").controller("internalController", internalController);
  function internalController($scope, HOST, commonServ) {
    $scope.wxUserInfo = '';//微信用户信息
    $scope.isStaff = false;//是否为员工
    $scope.isLoading = {
      display: 'block'
    };
    $scope.staffInfo = {};//员工信息
    commonServ.post({
      url: HOST + '/user/user-info',
      success: function (data) {
        $scope.wxUserInfo = data.errmsg.data;
        $scope.wxusersex = $scope.wxUserInfo.wxusersex;
        if ($scope.wxUserInfo.employee_id >0) {
          $scope.isStaff = true;
        }
        $scope.isLoading = {
          display: 'none'
        }
      }
    });
    //员工信息获取
    commonServ.post({
      url: HOST + '/staff/staff-info',
      success: function (data) {
        $scope.staffInfo = data.errmsg;
      }
    });
    //推荐人信息获取
    commonServ.post({
      url: HOST + '/user/superior-info',
      success: function (data) {
        if(data.errmsg){
          $scope.recommenpersion = data.errmsg.data.posterpro.wx_nickname;
        }

      }
    });

  }

  internalController.$inject = ['$scope', 'HOST', 'commonServ'];
})();
