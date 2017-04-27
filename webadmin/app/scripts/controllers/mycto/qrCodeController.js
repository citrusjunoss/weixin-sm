(function () {
  'use strict';
  angular.module("webApp").controller("qrCodeController", qrCodeController);
  function qrCodeController($scope, commonServ, HOST) {
    getQrcode();
    function getQrcode() {
      var url = HOST + '/staff/qrcode';
      commonServ.post({
        url: url,
        success: function (data) {
          $scope.imgSrc = data.errmsg ? data.errmsg.data.url : '';
        },
        error: function (data) {

        }
      });
    };
    //增加限制分享
    document.addEventListener('WeixinJSBridgeReady', function onBridgeReady() {
      WeixinJSBridge.call('hideOptionMenu');
    });

  }

  qrCodeController.$inject = ['$scope', 'commonServ', 'HOST'];
})();
