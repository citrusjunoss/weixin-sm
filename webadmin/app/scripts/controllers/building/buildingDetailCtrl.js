/**
 * @ngdoc function
 * @name webApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the webApp
 */
(function () {
  'use strict';

  angular.module('webApp').controller('buildingDetailCtrl', buildingDetailCtrl);
  function buildingDetailCtrl($scope, HOST, $location, commonServ,$timeout,$rootScope,viewImage) {
    var id = parseInt($location.search().id);
    var type = $location.search().scan;
    $scope.isDisabled = false;
    var isNumber = typeof id;
    var shareid = '';
    $scope.swiperData = [];
    var city;
    $scope.isBroker = false;//判断是否为经纪人,默认不是
    $scope.model = {};
    var config = {};
    getDetails();
    if (isNumber == 'number' && id) {
      dataCount();
    }
    


    function getDetails() {
      var url = HOST + '/house/detail';
      commonServ.post({
        url: url,
        param: {house_id: id},
        success: function (data) {
          $scope.model = data.errmsg.data;
          city = $scope.model.city;
          document.title = $scope.model.house_name;
          scanCount($scope.model.house_name);
          sm.iosSetTitle($scope.model.house_name);
          createSwiper();
          //微信图片预览
          $timeout(function(){
              viewImage($scope.model.intro);
          },500);
        },
        error: function (data) {
          wsh.successText(data.errmsg)
        }
      });
    }
    //数据统计
    function dataCount(){
      //pv统计
      commonServ.post({
        url:HOST + '/house/add-pv',
        param:{house_id:id},
        success:function(){

        },
        error:function(){

        }
      });
      //uv统计
      commonServ.post({
        url:HOST + '/house/add-uv',
        param:{house_id:id},
        success:function(){

        },
        error:function(){

        }
      });
    }
    //后台扫码统计
     function scanCount(name){
     if(type != 1) return;
      commonServ.post({
        url:HOST + '/house/data-count',
        param:{type:'house_detail',house_name:name},
        success:function(){

        },
        error:function(){

        }
      });
    }
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

    //加密
    commonServ.post({
      url: HOST + '/weixin/url-sign',
      param: {url: window.location.href},
      success: function (data) {
        config = data.errmsg;
        getShareId();//获取shareid
      },
      error: function (data) {
      }
    });
    function getShareId() {
      commonServ.post({
        url: HOST + '/house/share-house-add',
        param: {house_id: id},
        success: function (data) {
          shareid = data.errmsg.share_id;
          weixinApi();//微信配置
        },
        error: function () {

        }
      })
    }
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

      wx.ready(function () {
        var url = 'http://v-shimaoyx.weixin.vkdvip.com/building/detailshare?shareid=' + shareid;
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
        //TODO 调取接口是否可以推荐
        commonServ.post({
	        url: HOST + "/markethouse/check-recommend",
	        param: {house_id: id},
	        success: function (data) {
	           $scope.isBroker ? window.location.href = 'makemoney/recommend?city='+ city: window.location.href = '/makemoney/signup';
	        }, 	        
	        error: function (data) {
	          wsh.successText(data.errmsg);
	        }
     	});
    };
    $scope.goHref=function(){
      window.location.href = 'building/active?id=' + id;
    };
    getUserStatus();
    //获取用户是否经纪人
    function getUserStatus() {
      commonServ.post({
        url: HOST + "/broker/broker-info",
        success: function (data) {
          if (data.errmsg == '没有权限') {
            $scope.isBroker = false;
          } else {
            $scope.isBroker = true;
          }
        },
        codeCheck: function (data) {
          if (data.errcode == -1) {
            $scope.isDisabled = true;
          }
        },
        error: function (data) {
          wsh.successText(data.errmsg);
        }
      });
    }
    //路线规划插件
    $scope.searchGo = function () {
      var routeplanHref = " http://apis.map.qq.com/tools/routeplan/eword=" + $scope.model.addr + "&epointx=" + $scope.model.longitude + "&epointy=" + $scope.model.latituded + "?key=4GIBZ-326R3-O5E3H-3EJKP-IJNYZ-SNFVV&referer=myapp";
      window.location.href = routeplanHref;
    };

  }
  buildingDetailCtrl.$inject = ['$scope', 'HOST', '$location', 'commonServ','$timeout','$rootScope','viewImage'];

})();
