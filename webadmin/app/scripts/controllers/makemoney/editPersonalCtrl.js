(function () {
  'use strict';

  /**
   * @ngdoc function
   * @name webApp.controller:MainCtrl
   * @description
   * # MainCtrl
   * Controller of the webApp
   */
  angular.module('webApp').controller('editPersonalCtrl', editPersonalCtrl);

  function editPersonalCtrl($scope, HOST, commonServ) {
    $scope.noOpen = true;
    $scope.selected = '';
    $scope.brokerInfo = {};//经纪人权限信息
    $scope.userInfo = {};//经纪人信息
    $scope.brokerType = [{
      id: "1",
      title: '大众经纪人'
    }, {
      id: "2",
      title: '案场经纪人'
    }];
//获取权限信息
    commonServ.post({
      url: HOST + "/broker/broker-info",
      success: function (data) {
        if (data.errmsg == '没有权限') {
          $location.path('/makemoney/makemoney');
        } else {
          $scope.brokerInfo = data.errmsg.data;
          //获取经纪人信息
          commonServ.post({
            url: HOST + "/broker/user-info",
            param: {agent_id: $scope.brokerInfo.agent_id},
            success: function (data) {
              $scope.userInfo = data.errmsg.data;
              $scope.selected = $scope.userInfo.typeid;
            },
            error: function (data) {
            }
          });
        }
      },
      error: function (data) {

      }
    });
    //提交信息
    $scope.submitInfo = function () {
      return wsh.successText('暂不支持修改功能')
    }


  }

  editPersonalCtrl.$inject = ['$scope', 'HOST', 'commonServ'];
})();
