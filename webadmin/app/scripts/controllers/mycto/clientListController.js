(function () {
  'use strict';

  angular.module("webApp").controller("clientListController", clientListController);
  function clientListController($scope, commonServ, HOST) {
    var int = 1, isajax = false,data=null;
    $scope.model = {
      page: int,
      page_size: 10,
      status: 0,
      seach: '',
      employee_id: ''
    };
    $scope.isShow = false;
    $scope.userlists = [];
    $scope.status = '';
    $scope.showStatus =  ['新客户', '意向客户', '已成交'];

    $scope.staffInfo = {};//员工信息
    $scope.wxUserInfo = {};//微信用户信息
    // 客户类型
    $scope.statusList = [{id: 1, name: "新客户"}, {id: 2, name: "意向客户"}, {id: 3, name: "已成交"}, {id: 0, name: "全部"}];
    $scope.clientType = function (type) {
      $scope.model.status = type;
    };
    //获取微信用户信息
    commonServ.post({
      url: HOST + '/user/user-info',
      success: function (data) {
        $scope.wxUserInfo = data.errmsg.data;
        $scope.wxusersex = $scope.wxUserInfo.wxusersex;
      }
    });
    //员工信息获取
    commonServ.post({
      url: HOST + '/staff/staff-info ',
      success: function (data) {
        $scope.staffInfo = data.errmsg;
      }
    });


    $scope.clientStatus = [
      {
        val: 1,
        text: '新客户'
      },
      {
        val: 2,
        text: '意向客户'
      },
      {
        val: 3,
        text: '已成交'
      }
    ];

    $scope.showBox = function (id,status) {
      $scope.radio_status =status;
      $scope.user_id = id;
      $scope.isShow = true;
    };
    // 客户列表
    $scope.userlists = [];
    $scope.sreach = function () {
      if($scope.model.seach == ''){
        wsh.successText('请输入手机号码/姓名！');
      }else {
        $scope.userlists = [];
        isajax = true;
        int = 1;
        getClintList();
      }

    };
    //点击取消按钮
    $scope.cancle = function(){
      $scope.isShow = false;
    }
    // 点击更改状态
    $scope.changeStatus = function (status) {
      commonServ.post({
        url: HOST + '/staff/client-changestatus',
        param: {id: $scope.user_id, status: status},
        success: function (data) {
          if(data.errmsg.data == 'ok'){
            wsh.successText('修改成功！');
            $scope.isShow = false;
            $scope.userlists = [];
            int = 1;
            isajax = true;
            getClintList();
          }

        },
        error: function (data) {
          wsh.successText(data.errmsg)
        }
      });

    };



    //跳转方法
    $scope.goHref = function (id) {
      window.location.href = '/mycto/clientdetail?id=' + id;
    };
    //跳转方法
    $scope.goToHref = function (url,id) {
      window.location.href = url + id;
    };
     //跳转方法
    $scope.goToUrl= function (url) {
      window.location.href = url ;
    };
    //返回时销毁事件绑定
    $scope.$on('$destroy', function(){
      $(window).unbind('maxScorll');
    });
    $(window).bind('maxScorll', function (e) {
      if(isajax) return;
      getClintList();
    });

    function getClintList() {
      data = angular.copy($scope.model);
      data.employee_id = $scope.wxUserInfo.employee_id;
      data.page = int;
      isajax = true;
      commonServ.post({
        url: HOST + '/staff/client-list',
        param: data,
        beforeSend: function () {
          wsh.successText('加载中...');
        },
        success: function (data) {
          isajax = false;
          if (data.errmsg.data.length == 0) {
            wsh.successText('没有更多了!');
            isajax = true;
          } else {
            $scope.userlists = $scope.userlists.concat(data.errmsg.data);
            int++;
            isajax = false;
          }
        }
      })
    }

    var tt = new ToSlideUp('body', "../../images/up.png",
      {Json: {'position': 'fixed', 'width': '35px', 'height': '35px', 'bottom': '57px', 'right': '13px', 'z-index': '999'}, startLine: 300});
    tt.init();
    //增加限制分享
    document.addEventListener('WeixinJSBridgeReady', function onBridgeReady() {
      WeixinJSBridge.call('hideOptionMenu');
    });
  }
  clientListController.$inject = ['$scope', 'commonServ', 'HOST'];
})();
