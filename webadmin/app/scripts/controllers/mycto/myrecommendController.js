(function () {
  'use strict';

  angular.module("webApp").controller("myrecommendController", myrecommendController);
  function myrecommendController($scope, commonServ, HOST) {
    var int = 1,isajax=false;//控制请求
    $scope.model = {
      page:int,
      page_size: 20
    };
    $scope.recommendList = [];


    //返回时销毁事件绑定
    $scope.$on('$destroy', function(){
      $(window).unbind('maxScorll');
    });
    $(window).bind('maxScorll', function (e) {
      if(isajax) return;
      getrecommendList();
    });

    function getrecommendList() {
      var data =angular.copy($scope.model);
      data.page = int;
      isajax = true;
      commonServ.post({
        url: HOST + '/user/qrcode-wxuser-list',
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
            $scope.recommendList = $scope.recommendList.concat(data.errmsg.data);

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
  myrecommendController.$inject = ['$scope', 'commonServ', 'HOST'];
})();
