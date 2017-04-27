/**
 * @ngdoc function
 * @name webApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the webApp
 */
(function () {
  'use strict';

  angular.module('webApp').controller('salesCenterCtrl', salesCenterCtrl);

  function salesCenterCtrl($scope, commonServ, HOST, $location) {
    var id = $location.search().id;
    $scope.nav = "";//地理位置信息
    $scope.isSearch = false; //是否搜索
    $scope.isActive = false; //是否选择状态
    //获取地理位置数据
    commonServ.post({
      url: HOST + '/house/navigation',
      param: {house_id: id},
      success: function (data) {
        $scope.nav = data.errmsg.data;
        init();
      },
      error: function () {

      }
    });
    //初始化地图方法
    function init(){
      var center=new qq.maps.LatLng($scope.nav.latituded,$scope.nav.longitude);
      var map=new qq.maps.Map(document.getElementById("container"),{
        center:center,
        zoom:16
      });
      //添加定时器
      setTimeout(function(){
        var marker=new qq.maps.Marker({
          position:center,
          animation:qq.maps.MarkerAnimation.DROP,
          map:map
        });
        //marker.setAnimation(qq.maps.Animation.DROP);
      },2000);
    }

    //搜索方法
    $scope.searchKeyword = function () {
      //获取关键搜索词
      var keyword = $("#keyword").val();
      var searchHref = "http://apis.map.qq.com/tools/poimarker?type=1&keyword=" + keyword + "&center=" +  $scope.nav.latituded + "," + $scope.nav.longitude + "&radius=2000&key=4GIBZ-326R3-O5E3H-3EJKP-IJNYZ-SNFVV&referer=myapp";
      window.location.href = searchHref;
    };

    //路线规划插件
    $scope.searchGo = function () {
      //var aaa = "http://apis.map.qq.com/uri/v1/routeplan?type=drive&to="+ $scope.nav.addr +"&tocoord="+ $scope.nav.longitude+","+$scope.nav.latituded+"&policy=0&referer=myapp";
      var routeplanHref = " http://apis.map.qq.com/tools/routeplan/eword=" + $scope.nav.addr + "&epointx=" + $scope.nav.longitude + "&epointy=" + $scope.nav.latituded + "?key=4GIBZ-326R3-O5E3H-3EJKP-IJNYZ-SNFVV&referer=myapp";
      window.location.href = routeplanHref;
    }
  }

salesCenterCtrl.$inject = ['$scope', 'commonServ', 'HOST', '$location']
})();
