/**
 * @ngdoc function
 * @name webApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the webApp
 */
(function () {
  'use strict';

  angular.module('webApp').controller('ecologicalCtrl', ecologicalCtrl);
  function ecologicalCtrl($scope, commonServ, HOST, $location) {
    $scope.params = {
      house_name: '',   //楼盘名称
      province: '',     //省名
      province_id: '',  //省ID
      city_id: '',      //市ID
      district_id: '',  //区域ID
      house_type: '',   //楼盘类型
      page: 1,          //当前页数
      page_size: 8    //每页数
    };
    $scope.isLoading = {
      display: "block"
    };
    var int = 2, isajax = false;
    $scope.ecologicalList = [];
    var type = $location.search().type;
    getDetails();
    function getDetails() {
      var url =HOST + '/house/list';
      var data =angular.copy($scope.params);
      data.house_type = type;
      commonServ.post({
        url:url,
        param:data,
        success:function(data){
          $scope.ecologicalList = data.errmsg.data;
          $scope.isLoading = {
            display: "none"
          };
        },
        error:function(data){
          $scope.isLoading = {
            display: "none"
          };
          wsh.successText(data.errmsg)
        }
      });
    }

    $(window).bind('maxScorll', function (e) {
      if (isajax) return isajax;
      isajax = true;
      var data =angular.copy($scope.params);
      data.page=int;
      data.house_type = type;
      commonServ.post({
        url:HOST + '/house/list',
        param:data,
        beforeSend: function () {
          wsh.successText('加载中...');
        },
        success:function(data){
          if (data.errmsg.data.length == 0) {
            wsh.successText('没有更多了!');
            isajax = true;
          } else {
            $scope.ecologicalList = $scope.ecologicalList.concat(data.errmsg.data);
            int++;
            isajax = false;
          }
        },
        error:function(data){
          isajax = false;
          wsh.successText(data.errmsg)
        }
      });
    });
    var tt = new ToSlideUp('body', "../../images/up.png",
      {Json: {'position': 'fixed', 'width': '35px', 'height': '35px', 'bottom': '57px', 'right': '13px', 'z-index': '999'}, startLine: 300});
    tt.init();
  }

  ecologicalCtrl.$inject = ['$scope', 'commonServ', 'HOST', '$location'];
})();
