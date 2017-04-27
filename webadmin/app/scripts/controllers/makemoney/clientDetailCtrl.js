(function () {
  'use strict';

  /**
   * @ngdoc function
   * @name webApp.controller:MainCtrl
   * @description
   * # MainCtrl
   * Controller of the webApp
   */
  angular.module('webApp').controller('clientDetailCtrl', clientDetailCtrl);

  function clientDetailCtrl($scope, HOST, $location, commonServ) {
    var id = $location.search().id;
    $scope.proTime = [];
    $scope.isValid = false;
    $scope.clientInfo = '';
    var Len = 0;
    commonServ.post({
      url: HOST + "/broker/client-info",
      param: {id: id},
      success: function (data) {
        $scope.clientInfo = data.errmsg.data;
        $scope.status = $scope.clientInfo.status;
        $scope.proTime = $scope.clientInfo.agentcustomlog;
        if ($scope.status == 7) {
            $scope.isValid = true;
            $scope.proTime.pop($scope.proTime.length);
        };
        Len = $scope.proTime.length;
        progressStatus();
      },
      error: function (data) {
          wsh.successText(data.errmsg);
      }

    });
    function progressStatus() {
      $("#progress-length").css('height', 1.4 * (Len - 1) + "rem");
      for (var i = 0; i < Len; i++) {
        $(".no" + i).css("background", "#ee3231");
        $(".progressBar-title li").eq(i).addClass('red');
      }
    }



  }

  clientDetailCtrl.$inject = ['$scope', 'HOST', '$location', 'commonServ'];
})();
