(function () {
  'use strict';

  /**
   * @ngdoc function
   * @name webApp.controller:MainCtrl
   * @description
   * # MainCtrl
   * Controller of the webApp
   */
  angular.module('webApp').controller('commissionCtrl', commissionCtrl);

  function commissionCtrl($scope, commonServ, HOST, $location) {
    $scope.status = 3;
    $scope.userInfo = {}; //经纪人信息
    $scope.wxUserInfo = {};// 微信信息
    $scope.allMoney = 10;

    $scope.userType = {
      "1": "大众经纪人",
      "2": "案场经纪人"
    };
    //获取权限信息
    commonServ.post({
      url: HOST + "/broker/broker-info",
      success: function (data) {
        if (data.errmsg == '没有权限') {
          window.location.href = '/makemoney/makemoney';
        } else {
          $scope.isBroker = true;
          $scope.brokerInfo = data.errmsg.data;
          //获取经纪人信息
          commonServ.post({
            url: HOST + "/broker/user-info",
            param: {agent_id: $scope.brokerInfo.agent_id},
            success: function (data) {
              $scope.userInfo = data.errmsg.data;
              $scope.allMoney = parseInt($scope.userInfo.commission) + parseInt($scope.userInfo.commission_payed);
            },
            error: function (data) {
            }
          });
        }
      },
      error: function (data) {

      }
    });
    commonServ.post({
      url: HOST + "/user/user-info",
      success: function (data) {
        $scope.wxUserInfo = data.errmsg.data;
      },
      error: function () {

      }
    });

    //tab切换
    $scope.tabChange = function (status) {
      switch (status) {
        case 1:
          return window.location.href = '/makemoney/makemoney';
        case 2:
          if ($scope.isBroker) {
            return window.location.href = '/makemoney/client';
          } else {
            return window.location.href = '/makemoney/signup';
          }
        case 3:
          if ($scope.isBroker) {
            return window.location.href = '/makemoney/personal';
          } else {
            return window.location.href = '/makemoney/signup';
          }
      }
    };
    //跳转
    $scope.goHref = function (href) {
      switch (href) {
        case 1:
          return window.location.href = '/makemoney/rank';
      }
    }


  }

  commissionCtrl.$inject = ['$scope', 'commonServ', 'HOST', '$location'];
})();
