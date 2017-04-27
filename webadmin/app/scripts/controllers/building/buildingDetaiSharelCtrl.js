/**
 * @ngdoc function
 * @name webApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the webApp
 */
(function () {
  'use strict';

  angular.module('webApp').controller('buildingDetailShareCtrl', buildingDetailShareCtrl);
  function buildingDetailShareCtrl($scope, HOST, $location, commonServ,$timeout, viewImage) {
    var shareid = $location.search().shareid;
    $scope.isDisabled = false;
    var config = {};
    $scope.swiperData = [];
    $scope.house_id = '';
    var myshareid = '';
    //创建轮播图方法
    function createSwiper() {
      if($scope.model.housephoto.length == 0){
        $scope.swiperData = [{
          img_url:$scope.model.img_url
        }]
      }else{
        $scope.model.housephoto.forEach(function (val) {
          if(val.is_play == 1){
            $scope.swiperData.push(val);
          }
        });
        $timeout(function() {
          var mySwiper = new Swiper('.swiper-container', {
            loop: true,
            autoplay: 3000, //可选选项，自动滑动
            watchSlidesProgress: true,
            watchSlidesVisibility: true,
            pagination : '.swiper-pagination'
          });
        },500);
      }
    }
    //请求用户信息,楼盘信息
    commonServ.post({
      url: HOST + '/house/share-house-info',
      param: {id: shareid},
      success: function (data) {
        $scope.shareUserInfo = data.errmsg.data;
        $scope.model = $scope.shareUserInfo.house;
        $scope.house_id = $scope.model.house_id;
        document.title= $scope.model.house_name;
        sm.iosSetTitle($scope.model.house_name);
        createSwiper();
        getConfig();//加密获取config

        $timeout(function(){
            viewImage($scope.model.intro);
        },500);

      },
      error: function () {

      }
    });

    //url加密获取config
    function getConfig() {
      commonServ.post({
        url: HOST + '/weixin/url-sign',
        param: {url: window.location.href},
        success: function (data) {
          config = data.errmsg;
          getShareId();//获取分享id
        },
        error: function (data) {
        }
      });
    }

    function getShareId() {
      commonServ.post({
        url: HOST + '/house/share-house-add',
        param: {house_id: $scope.house_id},
        success: function (data) {
          myshareid = data.errmsg.share_id;
          weixinApi();//微信配置
        },
        error: function () {

        }
      })
    }

    //微信接口配置
    function weixinApi() {
      wx.config({
        debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
        appId: config.appid, // 必填，公众号的唯一标识
        timestamp: config.timestamp, // 必填，生成签名的时间戳
        nonceStr: config.noncestr, // 必填，生成签名的随机串
        signature: config.signature,// 必填，签名，见附录1
        jsApiList: [
          'onMenuShareTimeline',
          'onMenuShareAppMessage',
          'onMenuShareQQ',
          'onMenuShareWeibo',
          'chooseImage',
          'previewImage',
          'uploadImage',
          'downloadImage'
        ] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
      });
      //微信分享接口方法
      wx.ready(function () {
        var url = 'http://v-shimaoyx.weixin.vkdvip.com/building/detailshare?shareid=' + myshareid;
        // config信息验证后会执行ready方
        // 法，所有接口调用都必须在config接口获得结果之后，config是一个客户端的异步操作，所以如果需要在页面加载时就调用相关接口，则须把相关接口放在ready函数中调用来确保正确执行。对于用户触发时才调用的接口，则可以直接调用，不需要放在ready函数中。
        wx.onMenuShareTimeline({
          "imgUrl": $scope.model.share_img,
          "link": url,
          "desc": $scope.model.share_content,
          "title": $scope.model.share_title
        });
        wx.onMenuShareAppMessage({
          "imgUrl": $scope.model.share_img,
          "link": url,
          "desc": $scope.model.share_content,
          "title": $scope.model.share_title,
          success: function () {
            // 用户确认分享后执行的回调函数
            if (isNumber == 'number' && id) {
              commonServ.post({
                url: HOST + '/house/add-share',
                param: {house_id: id},
                success: function () {

                },
                error: function () {

                }
              })
            }

          },
          cancel: function () {
            // 用户取消分享后执行的回调函数
          }
        });

      });
    }

    //跳转推荐页面
    $scope.goMakemoney = function () {
      if($scope.isDisabled) return wsh.successText('账户禁用,请联系客服');
      $scope.isBroker ? window.location.href = 'makemoney/recommend?city=' +$scope.model.city: window.location.href = '/makemoney/signup';
    };
    //路线规划插件
    $scope.searchGo = function () {
      var routeplanHref = " http://apis.map.qq.com/tools/routeplan/eword=" + $scope.model.addr + "&epointx=" + $scope.model.longitude + "&epointy=" + $scope.model.latituded + "?key=4GIBZ-326R3-O5E3H-3EJKP-IJNYZ-SNFVV&referer=myapp";
      window.location.href = routeplanHref;
    };
    getUserStatus();
    //获取用户是否经纪人
    function getUserStatus() {
      commonServ.post({
        url: HOST + "/broker/broker-info",
        success: function (data) {
          if(data.errmsg == '没有权限') {
            $scope.isBroker = false;
          } else {
            $scope.isBroker = true;
          }
        },
        codeCheck: function (data) {
          wsh.successText(data.errmsg)
        },
        error: function (data) {
          if (data.errcode == -1) {
            $scope.isDisabled = true;
          }
        }
      });
    }
  }
  buildingDetailShareCtrl.$inject = ['$scope', 'HOST', '$location', 'commonServ','$timeout', 'viewImage'];
})();
