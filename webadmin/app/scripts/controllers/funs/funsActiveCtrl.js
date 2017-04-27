/**
 * Created by KellyJia on 2016/10/9.
 */
(function(){
  'use strict';
  angular.module('webApp').controller('funsActiveCtrl',funsActiveCtrl);
  function funsActiveCtrl($scope,commonServ,HOST,$location,$timeout) {
    //设置定位
    var geolocation = new qq.maps.Geolocation("4GIBZ-326R3-O5E3H-3EJKP-IJNYZ-SNFVV", "myapp");
    var options = {timeout: 8000};
    var id = $location.search().id;
    var mPage = 1,pageSize = 2,aPage = 1,isajax = false;
    $scope.nowTime = Date.parse(new Date())/1000;
    $scope.vAppoint = false;
    $scope.vmagezine = true;
    $scope.status = {
        M:false,
        A:false,
        S:true
    };
    $scope.AList = [];
    $scope.MList = [];
    $scope.SList = [];
    $scope.houseList = [];
    var houseArray = {
        house_id:'',
        house_name:'请选择楼盘'
      };
    $scope.houseid =  houseArray.house_id;
    $scope.isNoData = "M";
    $scope.ajaxData = {
          city:'',
          city_id:'',
          district_id:'',
          house_id:'',
          house_type:'',
          _page:1,
          house_name:'',
          _page_size:8
      };
      //判断时候有楼盘类型限制,如果有赋值
      if($location.search().type){
          $scope.ajaxData.house_type = $location.search().type;
      }
      //判断时候选择城市页面跳转,是,不走定位方法,否,走定位方法
      if($location.search().city){
          $scope.ajaxData.city = $location.search().city;
          $scope.locationCity = $location.search().city;
      }else {
          geolocation.getLocation(showPosition,showErr,options);
      }
     //定位失败的方法
     function showErr() {
          wsh.successText('定位失败,请选择城市');
          $timeout(function () {
              $scope.chooseCityCom();
          },2000)
      }
      //定位成功的方法
     function showPosition(position) {
          $scope.locationCity=position.city;
          $scope.ajaxData.city =  $scope.locationCity;
          $scope.$broadcast('ajaxData',$scope.ajaxData);
      }
    $scope.activeType = {};
      //获取微杂志的数据

      $scope.activeType.M = function () {
          if(!$scope.status.M)return;
          commonServ.post({
              url: HOST + '/magazine/list',
              param:$scope.ajaxData,
              success: function(data) {
                  if (data.errmsg.page.total_count == 0) {
                      $scope.isNodataM = true;
                  } else {
                      $scope.isNodataM = false;
                      if (data.errmsg.page.current_page < data.errmsg.page.total_page) {
                          $scope.ajaxData._page += 1;
                          $scope.MList =  $scope.MList.concat(data.errmsg.data)
                      } else {
                          wsh.successText('没有更多了')
                      }
                  }
              },
              error: function(data) {
                  wsh.successText(data.errmsg);
              }
          });
      };
      
      //获取微预约的数据
      $scope.activeType.A= function () {
         if(!$scope.status.A)return;
          commonServ.post({
              url: HOST + '/reserve/list-ajax',
              param:$scope.ajaxData,
              success: function(data) {
                  if (data.errmsg.page.total_count == 0) {
                      $scope.isNodataA = true;
                  } else {
                      $scope.isNodataA = false;
                      if (data.errmsg.page.current_page < data.errmsg.page.total_page) {
                          $scope.ajaxData._page += 1;
                          $scope.AList =  $scope.AList.concat(data.errmsg.data)
                      } else {
                      wsh.successText('没有更多了')
                      }
                  }
              },
              error: function(data) {
                  wsh.successText(data.errmsg);
              }
          });
      };
      //获取惊喜活动数据
      $scope.activeType.S= function () {
          if(!$scope.status.S)return;
          commonServ.post({
              url: HOST + '/market-activity/list-ajax',
              param:$scope.ajaxData,
              success: function(data) {
                  if (data.errmsg.page.total_count == 0) {
                      $scope.isNodataS = true;
                  } else {
                      $scope.isNodataS = false;
                      if (data.errmsg.page.current_page < data.errmsg.page.total_page) {
                          $scope.ajaxData._page += 1;
                          $scope.SList =  $scope.SList.concat(data.errmsg.data)
                      } else {
                          wsh.successText('没有更多了')
                      }
                  }
              },
              error: function(data) {
                  wsh.successText(data.errmsg);
              }
          });
      };
      $scope.activeType.S();
      //微杂志和微预约,微活动切换
      $scope.activeChange = function (type) {
          if($scope.status[type]) return;
          $scope.status = {
              M:false,
              A:false,
              S:false
          };
          $scope.houseid = '';
          $scope.ajaxData.house_id =$scope.houseid;
          $scope.status[type]= true;
          $scope.ajaxData._page = 1;
          $scope.isNodataM = false;
          $scope.isNodataA = false;
          $scope.isNodataS = false;
          $scope.AList = [];
          $scope.MList = [];
          $scope.SList = [];
          $scope.activeType[type]();
      };
      $scope.chooseVAppoint = function () {
          $scope.AList = [];
          $scope.SList = [];
          $scope.ajaxData.house_id=$scope.houseid;
          $scope.ajaxData._page = 1;
          $scope.isNodataA = false;
          $scope.status.A?$scope.activeType.A():$scope.activeType.S();
      };
      //选择城市
      $scope.chooseCityCom = function () {
          window.location.href = 'building/choosecity?page=funs&type=' + $scope.ajaxData.house_type;
      };
      //微预约跳转详情
      $scope.goADetail = function (id,status) {
          if(status == 2){
              wsh.successText('该活动已经结束')
          }else {
              window.location.href = HOST + '/reserve/detail?id=' + id;
          }
      };
      //微杂志跳转
      $scope.goMDetail = function (id,status) {
          if(status == 2){
              wsh.successText('该杂志已经关闭')
          }else{
              window.location.href =HOST +  '/magazine/detail?id=' + id;
          }
      };
      //微活动跳转
      $scope.goSDetail = function (id,status,houseid) {
          if(status == 2){
              wsh.successText('该活动已经结束')
          }else{
              window.location.href =HOST +  '/market-activity/activity?id=' + id + '&house_id='+houseid;
          }
      };
      getBuildingList();
      //获取城市楼盘列表
      function getBuildingList() {
          commonServ.post({
              url: HOST + '/house/list',
              param:$scope.ajaxData,
              success: function(data) {
                  $scope.houseList = data.errmsg.data;
                  $scope.houseList.unshift(houseArray);
              },
              error: function(data) {
                  wsh.successText(data.errmsg);
              }
          });
      }

  }
  funsActiveCtrl.$inject=['$scope','commonServ','HOST','$location','$timeout'];
})();
