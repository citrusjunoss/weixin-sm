/**
 * @ngdoc function
 * @name webApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the webApp
 */
(function () {
  'use strict';
  angular.module('webApp').controller('buildingInfoCtrl', buildingInfoCtrl);
  function buildingInfoCtrl($scope, HOST,commonServ,$rootScope,$timeout,$location) {
    //设置定位
    var geolocation = new qq.maps.Geolocation("4GIBZ-326R3-O5E3H-3EJKP-IJNYZ-SNFVV", "myapp");
    var options = {timeout: 8000};
    var type = $location.search().scan;
    $scope.locationCity = '定位中';
    $scope.isSearch = false;
    $scope.ajaxData = {
      city:'',
      city_id:'',
      district_id:'',
      house_type:'',
      page:1,
      house_name:'',
      page_size:5
    };



    //判断时候有楼盘类型限制,如果有赋值
    if($location.search().type){
      $scope.ajaxData.house_type = $location.search().type;
    }
    if($location.search().house){
      $scope.ajaxData.house_name = $location.search().house;
    }
    if($location.search().area){
      $scope.ajaxData.district_id = $location.search().area;
    }
    //判断时候选择城市页面跳转,是,不走定位方法,否,走定位方法
    if($location.search().city){
      $scope.ajaxData.city = $location.search().city;
      $scope.locationCity = $location.search().city;
      $scope.$broadcast('ajaxData1',$scope.ajaxData);

      if (type == 1) {
        scanCount($scope.locationCity);
      }

      //后台扫码统计
       function scanCount(name){
        commonServ.post({
          url:HOST + '/house/area-data-count',
          param:{type:'area',area_name:name},
          success:function(){

          },
          error:function(){

          }
        });
      }

    }else {
      geolocation.getLocation(showPosition,showErr,options);
    }



    //
    //定位失败的方法
    function showErr() {
      wsh.successText('定位失败,请选择城市');
      $scope.locationCity = '请选择';
      $timeout(function () {
        // $scope.chooseCityCom();
      },2000)
    }
    //定位成功的方法
    function showPosition(position) {
      $scope.locationCity=position.city;
      $scope.ajaxData.city =  $scope.locationCity;
      $scope.$broadcast('ajaxData',$scope.ajaxData);
    }
    //跳转地图
    $scope.houseMap = function () {
      window.location.href = 'building/map?city='+ $scope.locationCity;
    };
    //选择城市
    $scope.chooseCityCom = function () {
      window.location.href = 'building/choosecity?type=' +  $scope.ajaxData.house_type + '&page=building';
    };
    //搜索楼盘
    $scope.searchHouse = function () {
      if($scope.ajaxData.city == '') return;
      window.location.href = 'building/searchhouse?type=' +  $scope.ajaxData.house_type +'&city='+ $scope.ajaxData.city+ '&page=building';
    };

  }
  buildingInfoCtrl.$inject = ['$scope', 'HOST','commonServ','$rootScope','$timeout','$location'];
})();


