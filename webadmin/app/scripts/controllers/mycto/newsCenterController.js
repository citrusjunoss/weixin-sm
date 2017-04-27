(function () {
  'use strict';

  angular.module("webApp").controller("newsCenterController", newsCenterController);
  function newsCenterController($scope, HOST, commonServ, $rootScope, $timeout) {
    var int = 1, isajax = false;
    $scope.model = {
      page:int,
      page_size: 20
    };
    $scope.newsList = [];
    //返回时销毁事件绑定
    $scope.$on('$destroy', function(){
      $(window).unbind('maxScorll');
    });
    $(window).bind('maxScorll', function (e) {
      if(isajax) return;
      getNewsList();
    });

    //跳转新闻中心页面
    $scope.goNewsCenter = function(id){
      window.location.href = 'mycto/news?news_id='+id;
    }

    function getNewsList() {
      var data =angular.copy($scope.model);
      data.page = int;
      isajax = true;
      commonServ.post({
        url: HOST + '/information/list',
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
            $scope.newsList = $scope.newsList.concat(data.errmsg.data);

            int++;
            isajax = false;

          }
        }

      })
    };


    var tt = new ToSlideUp('body', "../../images/up.png",
      {Json: {'position': 'fixed', 'width': '35px', 'height': '35px', 'bottom': '57px', 'right': '13px', 'z-index': '999'}, startLine: 300});
    tt.init();
    //增加限制分享
    document.addEventListener('WeixinJSBridgeReady', function onBridgeReady() {
      WeixinJSBridge.call('hideOptionMenu');
    });
  }

  newsCenterController.$inject = ['$scope', 'HOST', 'commonServ', '$rootScope', '$timeout'];
})();
