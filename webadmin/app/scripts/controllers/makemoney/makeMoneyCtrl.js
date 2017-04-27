(function () {
  'use strict';

  /**
   * @ngdoc function
   * @name webApp.controller:MainCtrl
   * @description
   * # MainCtrl
   * Controller of the webApp
   */
  angular.module('webApp').controller('makeMoneyCtrl', makeMoneyCtrl);
  function makeMoneyCtrl($scope, commonServ, HOST, $location, $timeout, $rootScope) {
    $scope.status = 1;//底部导航显示
    $scope.houseList = [];//楼盘列表
    $scope.isMobile = false; //手机号非空
    $scope.userInfo = '';//经纪人信息
    $scope.brokerInfo = '';
    $scope.isBroker = false;
    $scope.isShow = false;
    $scope.slideList = [];
    $scope.isLoading = {
      display: "block"
    };
    var isDisable = false;
    var isajax = false;
    var int = 1;
    var geolocation = new qq.maps.Geolocation("4GIBZ-326R3-O5E3H-3EJKP-IJNYZ-SNFVV", "myapp");
    var options = {timeout: 8000};
    $scope.locationCity = '请选择';
    $scope.isSearch = false;
    $scope.ajaxData = {
      city:'',
      district_id:'',
      search:'',
      page:1,
      page_size:8
    };
    $scope.ajaxData.district_id = parseInt($location.search().area);
    $scope.ajaxData.search = $location.search().search;
    //判断时候选择城市页面跳转,是,不走定位方法,否,走定位方法
    if($location.search().city){
      $scope.ajaxData.city = $location.search().city;
      $scope.locationCity = $location.search().city;
      $scope.$broadcast('ajaxData1',$scope.ajaxData);
      //getHouseList();
    }else {
      geolocation.getLocation(showPosition,showErr,options);
    }
    //
    //定位失败的方法
    function showErr() {
      wsh.successText('定位失败,请手动选择');
      $scope.$broadcast('ajaxData',$scope.ajaxData);
    }
    //定位成功的方法
    function showPosition(position) {
      $scope.locationCity = position.city;
      $scope.ajaxData.city =  $scope.locationCity;
      getList ();
    }
    //搜索显示
    $scope.seachFn = function () {
      $scope.isSearch = true;
    };
    //搜索户型;
    $scope.searchHouse = function () {
      if($scope.ajaxData.city == '') return;
      window.location.href = 'makemoney/makemoneysearchhouse?city='+ $scope.ajaxData.city;
    };
    //选择城市
    $scope.chooseCityCom = function () {
      window.location.href = 'makemoney/makemoneychoosecity';

    };
    //取消搜索
    $scope.cancelSearch = function () {
      $scope.isSearch = false;
      $scope.ajaxData.house_name = '';
    };
		
		//获取佣金类型getCommission(item.houseonline[0])
 		$scope.getCommission=function(obj){
 			var retuStr="";
 			var arr=obj.housecommission
 			if(arr.length>0){
 				for(var i=0;i<arr.length;i++){
 					if(arr[i].agent_type==$scope.userInfo.typeid){
 						retuStr=arr[i].commission+""+{"1":"%","2":"元","3":""}[arr[i].commission_type];
 						break; 						
 					}
 				}
 			}
 			if(retuStr){
 				obj.show=true;
 			}
 			return retuStr; 			
 		};
   
   $scope.is_over = false;
    //获取权限信息
    commonServ.post({
      url: HOST + "/broker/broker-info",
      success: function (data) {
        if (data.errmsg == '没有权限') {
          $scope.isBroker = false;
          $scope.isShow = true;
          $scope.is_over = true;
        } else {
          $scope.isBroker = true;
          if ($scope.isBroker) {
            $scope.brokerInfo = data.errmsg.data;
            //获取经纪人信息
            commonServ.post({
              url: HOST + "/broker/user-info",
              param: {agent_id: $scope.brokerInfo.agent_id, go_wxurl: $location.path()},
              success: function (data) {
                $scope.userInfo = data.errmsg.data;
                $scope.is_over = true;
              },
              error: function (data) {
                wsh.successText(data.errmsg);
                $scope.is_over = true;
              }
            });
          }
        }
      },
      codeCheck: function (data) {
        if (data.errcode == -1) {
          isDisable = true;
        }
        wsh.successText(data.errmsg)
      },
      error: function (data) {
        wsh.successText(data.errmsg)
      }
    });



    
    //获取楼盘列表
    function getHouseList() {
      commonServ.post({
        url: HOST + "/markethouse/list",
        param: $scope.ajaxData,
        success: function (data) {
          $scope.houseList = data.errmsg ? data.errmsg.data : [];
        },
        error: function (data) {

        }
      });
    }

    //轮播图图片请求

    commonServ.post({
      url: HOST + "/markethouse/silde-list",
      success: function (data) {
        $scope.slideList = data.errmsg ? data.errmsg.data : [];
          $timeout(function() {
          var mySwiper1 = new Swiper('.makeswiper', {
            loop: true,
            autoplay: 3000, //可选选项，自动滑动
            watchSlidesProgress: true,
            watchSlidesVisibility: true,
            pagination : '.swiper-pagination'
          });
        },500);
      },
      error: function () {

      }
    });

    //页面跳转方法
    $scope.goHref = function (type,house_id) {
      if (!$scope.is_over) return;
      if (isDisable) {
        return wsh.successText('您的账号被禁用，请联系客服咨询');
      }
      switch (type) {
        case 1:
        case 3:
          if (isDisable) {
            return wsh.successText('您的账号被禁用，请联系客服咨询');
          }
          if ($scope.isBroker) {
          	//TODO 需要验证此楼盘是否可推荐
          	 commonServ.post({
				        	url: HOST + "/markethouse/check-recommend",
					        param: {house_id: house_id},
					        success: function (data) {
					           return window.location.href = '/makemoney/recommend?city=' + $scope.ajaxData.city;
					        }, 
					        error: function (data) {
					          wsh.successText(data.errmsg);
					        }
				     	});
          } else {
            return window.location.href = '/makemoney/signup';
          }
          break;
        case 2:
          if ($scope.isBroker) {
            return window.location.href = '/personalCenter/myReward';
          } else {
            return window.location.href = '/makemoney/signup';
          } 
      }
    };
    //tab切换
    $scope.tabChange = function (status) {
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
   
     //返回时销毁事件绑定
    $scope.$on('$destroy', function(){
      $(window).unbind('maxScorll');
    });
      $(window).bind('maxScorll', function () {
           getList();
    });
    function getList () {
         if (isajax || $scope.ajaxData.city == "") return;
            isajax = true;
            var data =angular.copy($scope.ajaxData);
            data.page = int;
            commonServ.post({
              url: HOST + '/markethouse/list',
              param: data,
              beforeSend: function () {
                wsh.successText('加载中...');
              },
              success: function (data) {
                 isajax = false;
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
                wsh.successText(data.errmsg)
              }
          });
    }
    var tt = new ToSlideUp('body', "../../images/up.png",
        {Json: {'position': 'fixed', 'width': '35px', 'height': '35px', 'bottom': '57px', 'right': '13px', 'z-index': '999'}, startLine: 300});
    tt.init();
   
  }

  makeMoneyCtrl.$inject = ['$scope', 'commonServ', 'HOST', '$location','$timeout','$rootScope'];
})();
