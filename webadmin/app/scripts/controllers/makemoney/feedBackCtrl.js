(function () {
  'use strict';

  /**
   * @ngdoc function
   * @name webApp.controller:MainCtrl
   * @description
   * # MainCtrl
   * Controller of the webApp
   */
  angular.module('webApp').controller('feedBackCtrl', feedBackCtrl);

  function feedBackCtrl($scope, commonServ, HOST, $location, $timeout) {

    $scope.submitInfo = function (content) {
      if (content == undefined || content == '') {
        wsh.successText('请输入您的反馈意见');
        $('.feedback-text').focus();
      } else {
        commonServ.post({
          url: HOST + "/feedback/save",
          param: {
            common: content
          },
          success: function(data) {
            wsh.successText('提交成功');
            $timeout(function(){
              window.location.href = '/personalCenter';
            }, 2000);
          },
          error: function(data) {

          }

        });
      }
    }
    


  }

  feedBackCtrl.$inject = ['$scope', 'commonServ', 'HOST', '$location', '$timeout'];
})();
