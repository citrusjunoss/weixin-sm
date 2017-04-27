(function () {
  'use strict';

  angular.module("webApp").controller("concernedController", concernedController);
  function concernedController($scope, commonServ, HOST) {
    var int = 1, isajax = false;
    $scope.model = {
      page: int,
      page_size: 20
    };
    $scope.housekindList = [];

    //跳转户型详情页面
    $scope.checkStatus = function (classid,id) {
      window.location.href = '/building/housetype?houseid=' +classid +'&classid='+id;
    };

    //返回时销毁事件绑定
    $scope.$on('$destroy', function(){
      $(window).unbind('maxScorll');
    });
    $(window).bind('maxScorll', function (e) {
      if(isajax) return;
      getActionHouseList();
    });


    function getActionHouseList() {
      var data =angular.copy($scope.model);
      data.page = int;
      isajax = true;
      commonServ.post({
        url: HOST + '/house/user-class-attention',
        param:data,
        beforeSend: function () {
          wsh.successText('加载中...');
        },
        success: function (data) {
          isajax = false;
          if (data.errmsg.data.length == 0) {
            wsh.successText('没有更多了!');

            isajax = true;
          } else {
            $scope.housekindList = $scope.housekindList.concat(data.errmsg.data);
            int++;
            isajax = false;
          }
        }

      })
    };

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
  concernedController.$inject = ['$scope', 'commonServ', 'HOST'];
})();
