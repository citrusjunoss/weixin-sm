(function () {
  'use strict';

  angular.module("webApp").controller("recordController", recordController);
  function recordController($scope, commonServ, HOST, $rootScope, $timeout) {
    $scope.state = 1;
    $scope.recordList = [];
    $scope.datanavlist = [{id:1,name:'今日',value:'day'},{id:2,name:'本周',value:'week'},{id:3,name:'本月',value:'month'}];
    $scope.params = {
      page: 1,
      page_size: 5,
      status: 'day'
    };
    var int = 1, isajax = false;

    // 导航栏点击事件
    $scope.record = function (id,date) {
      int = 1, isajax = false;
      $scope.recordList = [];
      $scope.state = id;
      $scope.params.status = date;
      getRecordList()
    };

//跳转页面了解详情
    $scope.goHref = function(id,name) {
      window.location = '/building/detail?id=' +id+'&city='+name;
    }
    //返回时销毁事件绑定
    $scope.$on('$destroy', function(){
      $(window).unbind('maxScorll');
    });
    $(window).bind('maxScorll', function (e) {
      if(isajax) return;
      getRecordList();
    });


    function getRecordList() {
      var datascroll = angular.copy($scope.params);
      datascroll.page = int;
      isajax = true;
      commonServ.post({
        url: HOST + '/user/house-history-list',
        param:datascroll,
        beforeSend: function () {
          wsh.successText('加载中...');
        },
        success: function (data) {
          isajax = false;
          if (data.errmsg.data.length == 0) {
            isajax = true;
            return wsh.successText('没有更多了!');


          } else {
            $scope.recordList = $scope.recordList.concat(data.errmsg.data);

            int++;
            isajax = false;

          }
        }

      })
    };


    var tt = new ToSlideUp('body', "../../images/up.png",
      {Json: {'position': 'fixed', 'width': '35px', 'height': '35px', 'bottom': '57px', 'right': '13px', 'z-index': '999'}, startLine: 300});
    tt.init();
  }

  recordController.$inject = ['$scope', 'commonServ', 'HOST', '$rootScope', '$timeout'];
})();
