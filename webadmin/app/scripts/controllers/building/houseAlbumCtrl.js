/**
 * @ngdoc function
 * @name webApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the webApp
 */
(function () {
  'use strict';

  angular.module('webApp').controller('houseAlbumCtrl', houseAlbumCtrl);
  function houseAlbumCtrl($scope, HOST,commonServ,$rootScope,$timeout,$location) {
    $scope.isSearch = false;
    $scope.swiperData = [];
    var id = $location.search().houseid;
    $scope.ajaxData = {
      housename : ''
    };

    commonServ.post({
      url:HOST + '/house/detail',
      param: {house_id: id},
      success: function (data) {
        $scope.model = data.errmsg.data;
        $scope.swiperData=$scope.model.housephoto;
        createSwiper();
      },
      error: function (data) {
        wsh.successText(data.errmsg)
      }
    });

    function createSwiper() {
        $timeout(function() {
          var mySwiper = new Swiper('.swiper-container', {
            loop: true,
            autoplay: 3000, //可选选项，自动滑动
            watchSlidesProgress: true,
            watchSlidesVisibility: true,
            pagination: '.swiper-pagination'
          });
        },500);
      }
  }
  houseAlbumCtrl.$inject = ['$scope', 'HOST','commonServ','$rootScope','$timeout','$location'];
})();


