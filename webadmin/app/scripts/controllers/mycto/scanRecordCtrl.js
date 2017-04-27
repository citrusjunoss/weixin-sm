/**
 * Created by junchaocheng on 2016/10/31.
 */
(function () {
  "use strict";
  angular.module("webApp").controller("scanRecordCtrl", scanRecordCtrl);
  function scanRecordCtrl($scope, commonServ, HOST, $rootScope, $timeout) {
    var int = 1, isajax = false;
    $scope.scanList = [];
    $scope.model = {
      page:int,
      page_size: 20
    };

    //检测归属
    $scope.checkStatus = function (status, id) {
      if (status == 0) {
        window.location.href = '/mycto/addclient?user_id=' + id;
      } else {
        return wsh.successText('该客户已经被归属！', false, $rootScope, $timeout);
      }
    };

    //返回时销毁事件绑定
    $scope.$on('$destroy', function(){
      $(window).unbind('maxScorll');
    });

    $(window).bind('maxScorll', function (e) {
      if(isajax) return;
      getList();
    });

    //获取员工扫描记录列表数据
    function getList() {
      var datascroll = angular.copy($scope.model);
      datascroll.page = int;
      isajax = true;
      commonServ.post({
        url: HOST + '/staff/scand-client-list',
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
            $scope.scanList = $scope.scanList.concat(data.errmsg.data);
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

    //增加限制分享
    document.addEventListener('WeixinJSBridgeReady', function onBridgeReady() {
      WeixinJSBridge.call('hideOptionMenu');
    });
  }

  scanRecordCtrl.$inject = ['$scope', 'commonServ', 'HOST', '$rootScope', '$timeout'];
})();
