/**
 * Created by junchaocheng on 2016/10/28.
 */
(function () {
  'use strict';

  angular.module("webApp").controller("staffBindCtrl", staffBindCtrl);
  function staffBindCtrl($scope, commonServ, HOST, $rootScope, $timeout) {
   $scope.user = {
     login_name: '',
     pwd:''
   };
    commonServ.post({
      url: HOST + '/user/user-info',
      success: function () {

      },
      error: function () {

      }
    });
    $scope.saveBtn = function(){
      if (!$scope.user.login_name) {
        return wsh.successText('请填写账户！', false, $rootScope, $timeout);
      }
      if (!$scope.user.pwd) {
        return wsh.successText('请填写密码！', false, $rootScope, $timeout);
      }
      commonServ.post({
        url: HOST + '/user/staff-brind',
        param:$scope.user,
        success: function (data) {
          if (data.errmsg.data == "ok") {
            wsh.successText('绑定成功');
            return window.location.href = '/mycto/index';
          }
        },
        codeCheck: function (data) {
          return wsh.successText(data.errmsg);
        },
        error: function (data) {
          return wsh.successText(data.errmsg);
        }
      })
    }

  }

  staffBindCtrl.$inject = ['$scope', 'commonServ', 'HOST', '$rootScope', '$timeout'];
})();
