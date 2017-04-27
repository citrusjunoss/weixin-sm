/**
 * @ngdoc function
 * @name webApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the webApp
 */
(function () {
  'use strict';

  angular.module("webApp").controller("clientDetailController", clientDetailController);
  function clientDetailController($scope, commonServ, HOST,$location) {
    var id = $location.search().id;
    $scope.model = {};
    getDeatil();
    // 状态
    $scope.sex = ['未知', '男', '女'];
    $scope.showStatus =  ['新客户', '意向客户', '已成交'];
    $scope.submit = function () {
      window.location.href = '/mycto/completeclient?id=' + id;
    };

    function getDeatil() {
      commonServ.post({
        url: HOST + '/staff/client-info',
        param: {id: id},
        success: function (data) {
          $scope.model = data.errmsg.data.wxusersex;
          $scope.image_url = data.errmsg.data.wxusersex.head_url;

        }
      })
    };
    //增加限制分享
    document.addEventListener('WeixinJSBridgeReady', function onBridgeReady() {
      WeixinJSBridge.call('hideOptionMenu');
    });
  }

  clientDetailController.$inject = ['$scope', 'commonServ', 'HOST','$location'];
})();
