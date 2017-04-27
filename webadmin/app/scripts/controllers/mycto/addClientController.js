(function () {
  'use strict';

  angular.module("webApp").controller("addClientController", addClientController);
  function addClientController($scope, commonServ, HOST,$location) {
    var id = $location.search().user_id,
        flagfool = true;//为false不能提交
    $scope.model = {
      user_id: id,
      user_name: '',
      mobile: '',
      gender: '',
      remarks: '',
      status: ''
    };
    // 单选框（性别）

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
    //获取用户的信息
    if(id) {
      commonServ.post({
        url: HOST + '/user/client-info',
        param: {user_id: id},
        success: function (data) {
          $scope.image_url = data.errmsg.data.head_url;

        }
      })
    }

    // 提交
    $scope.submit = function() {
      // validate
      if ($scope.myForm.name.$pristine) {
        wsh.successText('用户名不能为空');
      } else {
        if ($scope.myForm.name.$invalid) {
          wsh.successText('请输入2-5位中文');
        } else {
          if ($scope.myForm.phone.$pristine) {
            wsh.successText('手机号码不能为空');
          } else {
            if ($scope.myForm.phone.$invalid) {
              wsh.successText('手机号码格式错误');
            } else {
              if ($scope.myForm.remark.$pristine) {
                wsh.successText('请输入备注信息');
              } else {
                if ($scope.myForm.remark.$invalid) {
                  wsh.successText('超过最大字数限制');
                } else {

                  var params = angular.copy($scope.model);
                      params.user_name = $scope.user.name;
                      params.mobile = $scope.user.mobile;
                      params.status =  $scope.statusId;
                      params.remarks = $scope.user.remarks;
                      params.gender = $scope.user.sex;
                  if(flagfool){
                    flagfool = false;
                  commonServ.post({
                    url: HOST + '/staff/save-client',
                    param: params,
                    success: function () {
                      wsh.successText('提交成功！');
                      window.location = '/mycto/clientlist';
                    },
                    error:function () {
                      flagfool = true;
                    }
                  });
                  }else {
                    return wsh.successText('不能重复提交！', false, $rootScope, $timeout);
                  }
                }
              }
            }
          }
        }
      }
    };
    //增加限制分享
    document.addEventListener('WeixinJSBridgeReady', function onBridgeReady() {
      WeixinJSBridge.call('hideOptionMenu');
    });

  }

  addClientController.$inject = ['$scope', 'commonServ', 'HOST','$location'];
})();
