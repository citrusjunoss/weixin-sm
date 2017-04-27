/**
 * @ngdoc function
 * @name webApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the webApp
 */
(function () {
  'use strict';

  angular.module('webApp').controller('makeMoneySearchHouseCtrl', makeMoneySearchHouseCtrl);
  function makeMoneySearchHouseCtrl($scope, HOST,commonServ,$rootScope,$timeout,$location) {
    $scope.isSearch = false;
    $scope.areaList ='';
    var city = $location.search().city;
    var type = $location.search().type;
    var page = $location.search().page;
    // var city_id = parseInt($location.search().city_id);
    $scope.cityList = {};
    $scope.regionList = [];
    $scope.ajaxData = {
      city:city,
      city_id:'',
      search_name:'',
      page:1,
      page_size:8
    };


    $scope.searchHouse = function () {
      window.location.href = 'makemoney/makemoney?city='+ city  + '&search='+ $scope.ajaxData.search_name;
    };
    $scope.cancelSearch = function () {
      window.history.back();
    };
    //选择区域或类型
    $scope.areaChoose= function (area) {
      window.location.href = 'makemoney/makemoney?city='+ city  + '&area='+ area;
    };
    getHouseList();
    function getHouseList() {
      commonServ.post({
        url: HOST + "/markethouse/list",
        param: {
          city:city
        },
        success: function (data) {
          $scope.houseList = data.errmsg ? data.errmsg.data : [];
          var city_id = $scope.houseList[0].city_id;
          getAreaList(city_id);
        },
        error: function (data) {

        }
      });
    }
   // 获取城市县区列表
    function getAreaList (city) {
      commonServ.post({
        url: HOST + '/common/find-city-ajax',
        param:{id:city},
        success: function(data) {
          $scope.areaList = data.errmsg;
        },
        error: function(data) {
          wsh.successText(data.errmsg, false, $rootScope, $timeout);
        }
      });
    }
  }
  makeMoneySearchHouseCtrl.$inject = ['$scope', 'HOST','commonServ','$rootScope','$timeout','$location'];
})();


