(function () {
  'use strict';

  /**
   * @ngdoc function
   * @name webApp.controller:MainCtrl
   * @description
   * # MainCtrl
   * Controller of the webApp
   */
  angular.module('webApp').controller('recommendCtrl', recommendCtrl);

  function recommendCtrl($scope, commonServ, HOST, $timeout, $location,$filter) {
    $scope.isShow = false;
    $scope.isBuild = false;
    $scope.isSubmit = true;
    $scope.count = 0;
    var ids = [];
    $scope.houseList = [];
    var int = 2, isajax = false;
    $scope.locationCity = $location.search().city;
    $scope.model = {
      real_name: '', //姓名
      mobile: '', //电话
      order_time:'',//预约时间
      house_id: '', //楼盘ID
      remark: '' //备注
    };
    
    $scope.ajaxData = {
      city:$scope.locationCity,
      page_size: 10,
      page:1,
      search: ''
    };
    getHouseList();
    $scope.searchHouseList = function () {
      getHouseList();
    };
    //获取楼盘信息
    function getHouseList() {
      commonServ.post({
        url: HOST + "/markethouse/list",
        param: $scope.ajaxData,
        success: function (data) {
          $scope.houseList = data.errmsg.data;
          if ($scope.houseList.length > 0) {
            $scope.houseList.forEach(function (e) {
              e.checked = false;
            });
          if ($scope.houseList.length < 10) {
             $("#houselist").css({
                "overflowY":'hidden'
             })
          }else {
               $("#houselist").css({
                "overflowY":'scroll'
             }) 
          }
          }
        },
        error: function (data) {
        }
      });
    }

    $scope.boxHide = function (e) {
      if (e.target.className == "checkbox-wrap") {
      checkLength();
      if ($scope.count > 3) {
        return wsh.successText("最多选择3个楼盘")
      } else {
        $scope.count = 0;
        $scope.isShow = false;
        $scope.houseList.forEach(function (e) {
          e.checked = false;
        })
        }
      }
    };
    $scope.chooseHouse = function () {
      checkLength();
      if ($scope.count > 3) {
        return wsh.successText("最多选择3个楼盘")
      } else if ($scope.count == 0){
          return wsh.successText("请选择楼盘")
      }else {
        $scope.model.house_id = ids.join(',');
        $scope.isShow = false;
      }
    };
    $scope.cancleBtn = function () {
       $scope.isShow = false;
       $scope.model.house_id = [];
       $scope.houseList.forEach(function (val, index, arr) {
           arr[index].checked = false;
       });
        $scope.count = 0;
    }
    //检查长度
    function checkLength() {
      ids = [];
      $scope.houseList.forEach(function (val, e) {
        if (val.checked) {
          ids.push(val.house_id);
        }
      });
      $scope.count = ids.length;
    }

    //提交推荐信息
    $scope.recommendSubmit = function () {
      if ($scope.model.real_name == "" || /^\s+$/.test($scope.model.real_name)) {
         return wsh.successText('姓名不能为空');
      };
      if (!/^[\u4E00-\u9FA5]{2,5}$/.test($scope.model.real_name)) {
         return wsh.successText('姓名为2~5位中文');
      }
      if ($scope.model.mobile == "" || /^\s+$/.test($scope.model.mobile) ) {
         return wsh.successText('手机号码不能为空');
      };
       if (!/^1[34578]\d{9}$/.test($scope.model.mobile)) {
         return wsh.successText('请输入正确手机号码');
      }
      var data = $filter('date');
			if (data($scope.model.order_time, 'yyyy-MM-dd HH:mm') < data(new Date(), 'yyyy-MM-dd HH:mm')) {
        return wsh.successText('预约时间需大于当前时间');
      }
			
			$scope.model.order_time = data($scope.model.order_time, 'yyyy-MM-dd HH:mm');
       
      //选择楼盘非空验证
      if ($scope.count == 0) {
         return wsh.successText("请选择楼盘");
      };
      // if ($("select").val() == "") {
      //   $scope.isBuild = true;
      //   return $timeout(function () {
      //     $scope.isBuild = false;
      //   }, 1000);
      // }
      if ($scope.isSubmit) {
        $scope.isSubmit = false;
        commonServ.post({
          url: HOST + "/broker/referrer",
          param: $scope.model,
          success: function (data) {
           wsh.successText('推荐成功');
           window.location.href = "/makemoney/makemoney?city=" + $scope.locationCity;
          },
          error: function (data) {
            $scope.isSubmit = true;
          }
        });
      }


    };
    var startY,
        endY;
    $("#houselist").bind('touchstart', function (event) {
        startY = event.touches[0].pageY;//手指接触屏幕的位置; 
    });
    $("#houselist").bind('touchmove', function (event) {
       endY = event.touches[0].pageY; //手指离开屏幕的位置;
    })
    $("#houselist").bind('touchend',  function(event) {
        var targetY = startY -  endY;
        if ($scope.houseList.length < 10 || targetY < 0) return;
        var ulHeight = $('.houselist-scorll').height();
        var lastHeight = $('.houselist-scorll').offset().top + ulHeight - $('.houselist-scorll li:last-child').offset().top;
        if (lastHeight > 0) {
          if (isajax) return isajax;
          isajax = true;
          var data = angular.copy($scope.ajaxData);
          data.page = int;
          commonServ.post({
            url: HOST + '/markethouse/list',
            param: data,
            beforeSend: function () {
              wsh.successText('加载中...');
            },
            success: function (data) {
              if (data.errmsg.data.length == 0) {
                //wsh.successText('没有更多了!');
                isajax = true;
              } else {
                $scope.houseList = $scope.houseList.concat(data.errmsg.data);
                int++;
                isajax = false;
              }
            },
            error: function (data) {
              isajax = false;
            }
          });
        }

    });
    var tt = new ToSlideUp('body', "../../images/up.png",
      {Json: {'position': 'fixed', 'width': '35px', 'height': '35px', 'bottom': '57px', 'right': '13px', 'z-index': '999'}, startLine: 300});
    tt.init();


  }

  recommendCtrl.$inject = ['$scope', 'commonServ', 'HOST', '$timeout', '$location','$filter'];
})();
