/**
 * @ngdoc function
 * @name webApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the webApp
 */
(function () {
  'use strict';

  angular.module('webApp').controller('searchHouseCtrl', searchHouseCtrl);
  function searchHouseCtrl($scope, HOST,commonServ,$rootScope,$timeout,$location) {
    $scope.isSearch = false;
    $scope.areaList ='';
    var city = $location.search().city;
    var type = $location.search().type;
    var page = $location.search().page;
    var city_id = '';
    $scope.cityList = {};
    $scope.regionList = [];
    $scope.ajaxData = {
      city:city,
      city_id:'',
      house_type:type,
      page:1,
      house_name:'',
      page_size:8
    };


    $scope.searchHouse = function () {
      window.location.href = 'building/index?city='+ city + '&type='+ type + '&house='+ $scope.ajaxData.house_name;
    };
    $scope.cancelSearch = function () {
      window.history.back();
    };
    //选择区域或类型
    $scope.areaChoose= function (area) {
      window.location.href = 'building/index?city='+ city + '&type='+ type + '&area='+ area;
    };
    getBuildingList();
    //获取城市楼盘列表
    function getBuildingList() {
      commonServ.post({
        url: HOST + '/house/list',
        param:$scope.ajaxData,
        success: function(data) {
          $scope.mapHouse = data.errmsg.data;
          city_id = $scope.mapHouse[0].city_id;
          getAreaList(city_id);
        },
        error: function(data) {
          wsh.successText(data.errmsg, false, $rootScope, $timeout);
        }
      });
    }

   // 获取城市县区列表
    function getAreaList (city) {
      commonServ.post({
        url: HOST + '/common/find-city-ajax',
        param:{id:city},
        success: function(data) {
          $scope.areaList =data.errmsg;
        },
        error: function(data) {
          wsh.successText(data.errmsg, false, $rootScope, $timeout);
        }
      });
    }
  }
  searchHouseCtrl.$inject = ['$scope', 'HOST','commonServ','$rootScope','$timeout','$location'];
})();


