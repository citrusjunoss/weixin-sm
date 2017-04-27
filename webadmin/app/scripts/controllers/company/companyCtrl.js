/**
 * @ngdoc function
 * @name webApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the webApp
 */
(function () {
  'use strict';
  

  angular.module('webApp')
    .controller('companyCtrl', companyCtrl);
  function companyCtrl(commonServ,HOST,$compile,$scope) {
    var mySwiper = new Swiper('.swiper-container', {
      loop: true,
      autoplay: 5000, //可选选项，自动滑动
      watchSlidesProgress: true,
      watchSlidesVisibility: true,
      pagination: '.swiper-pagination',
      paginationClickable: true,
      preventClicks : false
    });
     commonServ.post({
       url: HOST + "/ranklist/commission-list",
       success: function (data) {

       },
       error: function (data) {

       }
     })

     // 首页背景高度
    var screen = $(window).height();
    $('.new_home_wrap').css('min-height',screen);

    }

  companyCtrl.$inject = ['commonServ','HOST','$compile','$scope'];
})();
