(function () {
  'use strict';

  angular.module("webApp").controller("completeClientController", completeClientController);
  function completeClientController($scope, commonServ, HOST, $location) {
    var id = $location.search().id,
      flagfool = true;//为false不能提交
    $scope.model = {
      user_id: id,
      user_name: '',
      mobile: '',
      gender: '',
      remarks: '',
      status: ''
    };
    //获取详情信息
    getDeatil();
    // 单选框（性别）
    //$(".sex > p").click(function () {
    //  $(this).siblings("p").html("<i class='iconfont radio woman'>&#xe610;</i>");
    //  $(this).html("<i class='iconfont radio'>&#xe624;</i>")
    //});

    // 状态
    $scope.lists = [{
      id: 1,
      name: "新客户"
    }, {
      id: 2,
      name: "意向"
    }, {
      id: 3,
      name: "已成交"
    }];
    $scope.status = $scope.lists[0];
    $scope.$watch('status', function (n) {
      $scope.statusId = n.id;
    });
    // 提交
    $scope.submit = function () {
      // validate

      if ($scope.myform.name.$invalid) {
        wsh.successText('请输入2-5位中文');
      } else {

        if ($scope.myform.phone.$invalid) {
          wsh.successText('手机号码格式错误');
        } else {

          if ($scope.myform.remark.$invalid) {
            wsh.successText('备注不能为空且不要超过最大字数限制');
          } else {
            if (flagfool) {
              flagfool = false;
              commonServ.post({
                url: HOST + '/staff/save-client',
                param: $scope.model,
                success: function () {
                  wsh.successText('提交成功！');
                  window.location = '/mycto/clientlist';
                },
                error: function () {
                  flagfool = true;
                }
              });
            } else {
              return wsh.successText('不能重复提交！');
            }
          }
        }

      }
    };

    //获取资料详情
    function getDeatil() {
      commonServ.post({
        url: HOST + '/staff/client-info',
        param: {id: id},
        success: function (data) {
          $scope.model = data.errmsg.data.wxusersex;
          $scope.model.status = parseInt($scope.model.status);
          $scope.image_url = data.errmsg.data.wxusersex.head_url;
        }
      })
    };
    //增加限制分享
    document.addEventListener('WeixinJSBridgeReady', function onBridgeReady() {
      WeixinJSBridge.call('hideOptionMenu');
    });
  }

  completeClientController.$inject = ['$scope', 'commonServ', 'HOST', '$location'];
})();
