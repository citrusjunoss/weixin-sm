/**
 * @ngdoc function
 * @name webApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the webApp
 */
(function () {
  'use strict';
  angular.module('webApp').controller('attentionCtrl', attentionCtrl);
  function attentionCtrl($scope, HOST, commonServ) {
    var int = 1, isajax = false;
    $scope.model = {
      page: int,
      page_size: 20
    };
    $scope.houseList = [];
    //返回时销毁事件绑定
    $scope.$on('$destroy', function(){
      $(window).unbind('maxScorll');
    });
    $(window).bind('maxScorll', function (e) {
      if(isajax) return;
      getActionHouseList();
    });

    //跳转楼盘详情页面
    $scope.checkStatus = function (id) {
      window.location.href = '/building/detail?id=' + id;
    };
    function getActionHouseList() {
      var data =angular.copy($scope.model);
      data.page = int;
      isajax = true;
      commonServ.post({
        url: HOST + '/user/house-list',
        param:data,
        beforeSend: function () {
          wsh.successText('加载中...');
        },
        success: function (data) {
          isajax = false;
          if (data.errmsg.data.length == 0) {
            isajax = true;
            return wsh.successText('没有更多了!');

          } else {
            $scope.houseList = $scope.houseList.concat(data.errmsg.data);

            int++;
            isajax = false;

          }
        }

      })
    }
    var tt = new ToSlideUp('body', "../../images/up.png",
      {
        Json: {
          'position': 'fixed',
          'width': '35px',
          'height': '35px',
          'bottom': '57px',
          'right': '13px',
          'z-index': '999'
        }, startLine: 300
      });
    tt.init();


  }

  attentionCtrl.$inject = ['$scope', 'HOST', 'commonServ'];

})();
