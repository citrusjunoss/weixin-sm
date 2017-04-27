/**
 * @ngdoc function
 * @name webApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the webApp
 */
(function() {
    'use strict';
    angular.module('webApp').controller('houseTypeCtrl', houseTypeCtrl);

    function houseTypeCtrl($scope, commonServ, HOST, $location, $rootScope, $timeout, viewImage) {
        $scope.follow = false;
        $scope.menuShow = false;
        $scope.houseTypeInfo = '';
        var house_id = $location.search().houseid;
        var class_id = $location.search().classid;
        $scope.houseTypeName = '';
        $scope.houseTypeClass = [];
        $scope.houseTypeIndex = 0;
        $scope.isSearch = false; //是否搜索
        $scope.noData = true;
        $scope.goHref = function(url) {
            window.location.href = url;
        };
        var config = {};
        var isajax = false;
        getHouseTypeList(); //获取户型类别
        //楼盘信息
        commonServ.post({
            url: HOST + '/house/detail',
            param: {
                house_id: house_id
            },
            success: function(data) {
                $scope.houseInfo = data.errmsg.data;
            },
            error: function(data) {
                wsh.successText(data.errmsg)
            }
        });
        //户型信息
        // $scope.houseTypeClass.forEach(function (val, index) {
        //   val.id = index;
        //   val.ischoose = true
        // });
        $scope.chooseType = function(id, index) {
            $scope.houseTypeIndex = index;
            $scope.houseTypeName = $scope.houseTypeList[index].house_type_name;
            getHouseTypeinfo(id);
            $scope.class_id = id;
            $scope.menuShow = false;
            $scope.isClick = true;
        };
        $scope.atten = function(id) {
            var url = HOST + '/house/attention';
            commonServ.post({
                url: url,
                param: {
                    house_type_class_id: $scope.class_id,
                    house_type_id: id,
                    house_id: house_id
                },
                success: function(data) {
                    if (data.errmsg.data == 0) {
                        $scope.follow = false;
                    } else if (data.errmsg.data == 1) {
                        $scope.follow = true;
                    }
                },
                error: function(data) {
                    wsh.successText(data.errmsg, false, $rootScope, $timeout)
                }
            });

        };

        function getHouseTypeList() {
            var url = HOST + '/house/house-type-list';
            commonServ.post({
                url: url,
                param: {
                    house_id: house_id
                },
                success: function(data) {
                    if (data.errmsg.data.length == 0) {
                        wsh.successText('暂无数据');
                    } else {
                        $scope.houseTypeList = data.errmsg.data;
                        $scope.page = data.errmsg.page;
                        $scope.houseTypeName = $scope.houseTypeList[$scope.houseTypeIndex].house_type_name;
                        if (class_id) {
                            var id = class_id;
                        } else {
                            var id = $scope.houseTypeList[$scope.houseTypeIndex].house_type_class_id;
                        }
                        $scope.noData = false;
                        getHouseTypeinfo(id);
                    }
                },
                error: function(data) {
                    wsh.successText(data.errmsg);
                }
            });

        }

        function getHouseTypeinfo(id) {
            var url = HOST + '/house/house-type-detail';
            commonServ.post({
                url: url,
                param: {
                    house_type_class_id: id,
                    house_id: house_id
                },
                success: function(data) {
                    $scope.houseTypeInfo = data.errmsg ? data.errmsg.data : '';
                    $scope.class_id = $scope.houseTypeInfo.house_type_class_id;
                    getIsAtten(id);
                    $timeout(function(){
                        viewImage($scope.houseTypeInfo.content);
                    },500);
                    
                },
                error: function(data) {
                    wsh.successText(data.errmsg);
                }
            });
        }

        function getIsAtten(id) {

            var isUrl = HOST + '/house/check-attention';
            commonServ.post({
                url: isUrl,
                param: {
                    house_type_id: $scope.houseTypeInfo.house_type_id,
                    house_id: house_id,
                    house_type_class_id: id
                },
                success: function(data) {
                    $scope.follow = data.errmsg.data == 1 ? true : false;
                },
                error: function(data) {
                    wsh.successText(data.errmsg);
                }
            });
        }

        function iosTitle(tit) {
            var iframe = document.createElement("iframe");
            iframe.title = tit;
            iframe.width = 0;
            iframe.height = 0;
            iframe.setAttribute("src", "images/mycto-logo.png");
            iframe.addEventListener('load', function() {
                setTimeout(function() {
                    iframe.removeEventListener('load', function() {});
                    document.body.removeChild(iframe);
                }, 0);
            });
            document.body.appendChild(iframe);
        }

        // 注释
        // $(window).bind('maxScorll', function (e) {
        //   if (isajax) return isajax;
        //   isajax = true;
        //   commonServ.post({
        //     url: HOST + '/house/house-type-list',
        //     param: {house_id: house_id, page: int, page_size: 15},
        //     beforeSend: function () {
        //       wsh.successText('加载中...', false, $rootScope, $timeout);
        //     },
        //     success: function (data) {
        //       if (data.errmsg.data.length == 0) {
        //         wsh.successText('没有更多了!', false, $rootScope, $timeout);
        //         isajax = true;
        //       } else {
        //         $scope.houseTypeList = $scope.houseTypeList.concat(data.errmsg.data);
        //         int++;
        //         isajax = false;
        //       }
        //     },
        //     error: function (data) {
        //       isajax = false;
        //       wsh.successText(data.errmsg);
        //     }
        //   });
        // });
        //
        // var tt = new ToSlideUp('body', "../../images/up.png",
        //   {Json: {'position': 'fixed', 'width': '35px', 'height': '35px', 'bottom': '57px', 'right': '13px', 'z-index': '999'}, startLine: 300});
        // tt.init();
    
    commonServ.post({
      url: HOST + '/weixin/url-sign',
      param: {url: window.location.href},
      success: function (data) {
        config = data.errmsg;
        weixinApi(config);
      },
      error: function (data) {
      }
    });

    function weixinApi(config) {
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
    }

    }

    houseTypeCtrl.$inject = ['$scope', 'commonServ', 'HOST', '$location', '$rootScope', '$timeout', 'viewImage'];

})();
