/**
 * Created by KellyJia on 2016/10/18.
 */
(function ($) {
  'use strict';

  angular.module('webApp')
    .factory('commonServ', commonServ)
    .factory('viewImage', viewImage);
  function commonServ($rootScope, $http, $location, cfpLoadingBar) {

    var fn = function (type, config) {
      $rootScope.start = function() {
        cfpLoadingBar.start();
      };

      $rootScope.complete = function() {
        cfpLoadingBar.complete();
      };
      cfpLoadingBar.start();
      var defaultCfg = {
        url: '',       //请求url
        param: {}       // 请求参数
      };
      defaultCfg = $.extend(defaultCfg, config);
      defaultCfg.param.go_wxurl = window.location.href;
      $http[type](defaultCfg.url, defaultCfg.param).success(function (data) {
        if (data.errcode == '0') {
          typeof defaultCfg.success === 'function' && defaultCfg.success(data);
        } else if (data.errcode == '3') {
          window.location.href = data.data.url;
        }
        else if (data.errcode == '-1') {

          typeof config.codeCheck === 'function' && config.codeCheck(data);
        }
        else if (data.errcode == '-2') {
          typeof config.error === 'function' && config.error(data);
        }
        else if (data.errcode == '1') {
          typeof config.error === 'function' && config.error(data);
        }
        else if(data.errcode == '-3'){
        	typeof config.error === 'function' && config.error(data);
        }
        $rootScope.complete();
      }).error(function (data) {
        typeof config.error === 'function' && config.error(data);
      });
    };

    return {
      get: function (config) {
        fn('get', config);
      },
      post: function (config) {
        fn('post', config);
      }
    };
  }
  commonServ.$inject = ['$rootScope','$http', '$location', 'cfpLoadingBar'];

  function viewImage(){
    var Fn = function (content){
      //匹配img
        var imgReg = /<img [^>]*src=['"]([^'"]+)[^>]*>/gi;
        //匹配src属性
        var srcReg = /src=['"]?([^'"]*)['"]?/i;
        var arrImg = content.match(imgReg);
        var arrImgSrc = [];
        for (var i = 0; i < arrImg.length; i++) {
            //匹配到src
            var imgSrc = arrImg[i].match(srcReg);
            if (imgSrc[1]) {
                arrImgSrc.push( imgSrc[1]);
            }
        }

        var $images = $("#js-content").find("img");
        $images.on("click", function() {  
            wx.previewImage({
                current: this.src,
                urls: arrImgSrc
            });
        });

    }
    
    return function(content){
        Fn(content)
    };
  }



  
})(jQuery);
