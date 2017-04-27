/**
 * @ngdoc function
 * @name webApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the webApp
 */
(function () {
  'use strict';
  angular.module('webApp').controller('appointmentCtrl', appointmentCtrl);
  function appointmentCtrl($scope, $timeout, $location, HOST, $rootScope, $filter, commonServ) {
    var id = $location.search().id,
        flagfool = true;//为false不能提交

    $scope.confirm = function () {
      $(".elastic-layer").hide();
      $location.path("/building/detail");
    };
    $scope.user = {
      house_id: '',
      house_name: '',
      user_name: '',
      mobile: '',
      subscribe_time: '',
      remark: ''
    };

    $scope.saveBtn = function () {
      var data = $filter('date');
      if (!$scope.user.user_name) {
        return wsh.successText('请填写姓名！', false, $rootScope, $timeout);
      }
      if (!$scope.user.mobile) {
        return wsh.successText('请填写手机号码！', false, $rootScope, $timeout);
      } else {
      if (!(/^1[34578]\d{9}$/.test($scope.user.mobile))) {
          return wsh.successText('请填写正确的手机号码！', false, $rootScope, $timeout);
        }
      }
      if (data($scope.user.subscribe_time, 'yyyy-MM-dd HH:mm') < data(new Date(), 'yyyy-MM-dd HH:mm')) {
        return wsh.successText('预约时间需大于当前时间！', false, $rootScope, $timeout);
      }

      var param = angular.copy($scope.user);
      param.house_id = id;
      param.subscribe_time = data($scope.user.subscribe_time, 'yyyy-MM-dd HH:mm');

       var url = HOST + '/house/house-subscribe';
      if(flagfool){
        flagfool = false;
        commonServ.post({
          url: url,
          param: param,
          success: function (data) {
            if (data.errcode == 0) {
              $(".elastic-layer").show();
            }

          },
          error:function () {
            flagfool = true;
          }
        });
      }else {
        return wsh.successText('不能重复提交！', false, $rootScope, $timeout);
      }

    };
    //或取楼盘的主图和jhouse_name
    getDetails();
    function getDetails() {
       var url = HOST + '/house/detail';
       commonServ.post({
         url: url,
         param: {house_id: id},
         success: function (data) {
           $scope.image_url = data.errmsg.data.img_url;
           $scope.user.house_name = data.errmsg.data.house_name;


         }
       });

    }
  }

  appointmentCtrl.$inject = ['$scope', '$timeout', '$location', 'HOST', '$rootScope', '$filter', 'commonServ']
})();



