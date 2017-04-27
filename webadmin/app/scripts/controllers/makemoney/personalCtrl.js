(function () {
  'use strict';
  angular.module('webApp')
    .controller('personalCtrl', personalCtrl);
  function personalCtrl ($scope, HOST, $location, commonServ) {

    commonServ.post({
      url: HOST + "/broker/broker-info",
      success: function (data) {
        $scope.brokerInfo = data.errmsg.data;
            switch(data.errmsg.data.typeid){
             case '1': 
               $scope.brokerType = '世茂业主' ;
               break;
             case '2': 
               $scope.brokerType = '世茂员工' ;
               break;
             case '3': 
               $scope.brokerType = '世茂合作方' ;
               break;
             case '4': 
               $scope.brokerType = '中介公司' ;
              break;
             case '5': 
               $scope.brokerType = '独立经纪人' ;
               break;
            }
      },
      error: function (data) {

      }
    });

    // user info
    commonServ.post({
      url: HOST + "/user/user-info",
      success: function (data) {
        $scope.userInfo = data.errmsg.data.wxusersex;
      },
      error: function (data) {

      }
    });
    $scope.goHref = function () {
      window.location.href = 'makemoney/bindingcard';
    };


   var isDisable = false;
        $scope.isBroker = false;
        $scope.is_over = false;
        commonServ.post({
            url: HOST + "/broker/broker-info",
            success: function(data) {
                if (data.errmsg == '没有权限') {
                    $scope.isBroker = false;
                    $scope.is_over = true;
                } else {
                    $scope.isBroker = true;
                    if ($scope.isBroker) {
                        $scope.brokerInfo = data.errmsg.data;
                        //获取经纪人信息
                        commonServ.post({
                            url: HOST + "/broker/user-info",
                            param: {
                                agent_id: $scope.brokerInfo.agent_id,
                                go_wxurl: $location.path()
                            },
                            success: function(data) {
                                $scope.is_over = true;
                            },
                            error: function(data) {
                                $scope.is_over = true;
                            }
                        });
                    }
                }
            },
            codeCheck: function(data) {
                if (data.errcode == -1) {
                    isDisable = true;
                }
                //wsh.successText(data.errmsg)
            },
            error: function(data) {
                //wsh.successText(data.errmsg)
            }
        });

        //tab切换
        $scope.tabChange = function(status) {
            if (!$scope.is_over) return;
            if (isDisable) {
                return wsh.successText('您的账号被禁用，请联系客服咨询');
            }
            switch (status) {
                case 1:
                    return window.location.href = '/makemoney/makemoney';
                case 2:
                    if ($scope.isBroker) {
                        return window.location.href = '/makemoney/client';
                    } else {
                        return window.location.href = '/makemoney/signup';
                    }
                case 3:
                    if ($scope.isBroker) {
                        return window.location.href = '/personalCenter';
                    } else {
                        return window.location.href = '/makemoney/signup';
                    }
            }
        };

  }
  
  personalCtrl.$inject = ['$scope', 'HOST', '$location', 'commonServ'];
})();
