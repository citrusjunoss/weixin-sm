(function(){
  'use strict';

  /**
   * @ngdoc overview
   * @name webApp
   * @description
   * # webApp
   *
   * Main module of the application.
   */
  angular
      .module('webApp', [
        'ui.router',
        'chieffancypants.loadingBar'
      ])
      .config(['$stateProvider','$urlRouterProvider','$locationProvider','$httpProvider',function ($stateProvider, $urlRouterProvider,$locationProvider,$httpProvider) {
        $urlRouterProvider.otherwise("/");
        $stateProvider
            .state('/', {
              url: "/",
              templateUrl: "views/company/index.html",
              controller: 'companyCtrl',
              data: {pageTitle: '世茂集团'}
            })
            .state('company/news', {
                url: "/company/news",
                templateUrl: "views/company/news.html",
                controller: 'newsCtrl',
                data: {pageTitle: '最新资讯'}
            })
            .state('company/publicWelfare', {
                url: "/company/public",
                templateUrl: "views/company/publicWelfare.html",
                data: {pageTitle: '仁爱世茂'}
            })
            .state('company/about', {
                url: "/company/about",
                templateUrl: "views/company/about.html",
                data: {pageTitle: '关于世茂'}
            })
            .state('company/hotel', {
                url: "/company/hotel",
                templateUrl: "views/company/hotel.html",
                data: {pageTitle: '酒店'}
            })
            .state('company/property', {
                url: "/company/property",
                templateUrl: "views/company/property.html",
                data: {pageTitle: '物业'}
            })
            .state('company/theme', {
                url: "/company/theme",
                templateUrl: "views/company/theme.html",
                data: {pageTitle: '主题乐园'}
            })
            .state('company/house', {
                url: "/company/house",
                templateUrl: "views/company/house.html",
                data: {pageTitle: '住宅'}
            })
            .state('company/business', {
                url: "/company/business",
                templateUrl: "views/company/business.html",
                data: {pageTitle: '商业'}
            })
            .state('building', {
              url: "/building",
              templateUrl: "views/building/index.html",
              controller: 'buildingInfoCtrl',
              data: {pageTitle: '城市展厅'}
            })
            .state('building.index', {
                url: "/index",
                templateUrl: "views/building/cityshow.html",
                controller: 'buildingListCtrl',
                data: {pageTitle: '城市展厅'}
            })
            .state('funs', {
                url: "/funs",
                templateUrl: "views/funs/funsactive.html",
                controller: 'funsActiveCtrl',
                data: {pageTitle: '活动列表'}
            })

            .state('building.detail', {
                url: "/detail",
                templateUrl: "views/building/housedetail.html",
                controller: 'buildingDetailCtrl',
                data: {pageTitle: '跳转中'}
            })
            .state('building.detailshare', {
                url: "/detailshare",
                templateUrl: "views/building/housedetailshare.html",
                controller: 'buildingDetailShareCtrl',
                data: {pageTitle: '跳转中'}
            })
            .state('building.housemap', {
                url: "/map",
                templateUrl: "views/building/housemap.html",
                controller: 'mapCtrl',
                data: {pageTitle: '地图找房页'}
            })
            .state('building/active', {
                url: "/building/active",
                templateUrl: "views/building/marketactive.html",
                controller: 'marketActiveCtrl',
                data: {pageTitle: '惊喜活动'}
            })
            .state('housealbum', {
                url: "/building/album",
                templateUrl: "views/building/housealbum.html",
                controller: 'houseAlbumCtrl',
                data: {pageTitle: '楼盘相册'}
            })

            .state('choosecity', {
                url: "/building/choosecity",
                templateUrl: "views/building/choosecity.html",
                controller: 'chooseCityCtrl',
                data: {pageTitle: '选择城市'}
            })
            .state('searchhouse', {
                url: "/building/searchhouse",
                templateUrl: "views/building/searchhouse.html",
                controller: 'searchHouseCtrl',
                data: {pageTitle: '搜索楼盘'}
            })
            .state('appointment', {
                url: "/building/appoint",
                templateUrl: "views/building/appointment.html",
                controller: 'appointmentCtrl',
                data: {pageTitle: '预约看房'}
            })
            .state('housetype', {
                url: "/building/housetype",
                templateUrl: "views/building/housetype.html",
                controller: 'houseTypeCtrl',
                data: {pageTitle: '户型展示'}
            })
            .state('progress', {
                url: "/building/progresslist",
                templateUrl: "views/building/progresslist.html",
                controller: 'progressListCtrl',
                data: {pageTitle: '项目动态'}
            })
            .state('progressdetail', {
                url: "/building/progressdetail",
                templateUrl: "views/building/progressdetail.html",
                controller: 'progressDetailCtrl',
                data: {pageTitle: '进度详情'}
            })

					//2016/12/13 我的会员开始
            .state('/mycto/staffbind', {
                url: "/mycto/staffbind",
                templateUrl: "views/mycto/staffbind.html",
                controller: 'staffBindCtrl',
                data: {pageTitle: '绑定微信'}
            })
            .state('/mycto/index', {
              url: "/mycto/index",
              templateUrl: "views/mycto/index.html",
              controller: 'internalController',
              data: {pageTitle: '会员中心'}
            })
            .state('/mycto/qrcode', {
              url: "/mycto/qrcode",
              templateUrl: "views/mycto/qrcode.html",
              controller: 'qrCodeController',
              data: {pageTitle: '我的二维码'}
            })
            .state('/mycto/attention', {
              url: "/mycto/attention",
              templateUrl: "views/mycto/attention.html",
              controller: 'attentionCtrl',
              data: {pageTitle: '我关注的楼盘'}
            })
            .state('/mycto/concerned', {
              url: "/mycto/concerned",
              templateUrl: "views/mycto/concerned.html",
              controller: 'concernedController',
              data: {pageTitle: '我关注的户型'}
            })
            .state('/mycto/myrecommend', {
              url: "/mycto/myrecommend",
              templateUrl: "views/mycto/myrecommend.html",
              controller: 'myrecommendController',
              data: {pageTitle: '我的推荐'}
            })
            .state('/mycto/myprize', {
              url: "/mycto/myprize",
              templateUrl: "views/mycto/myprize.html",
              controller: 'myprizeController',
              data: {pageTitle: '我的奖品'}
            })
            .state('/mycto/scanrecord', {
              url: "/mycto/scanrecord",
              templateUrl: "views/mycto/scanrecord.html",
              controller: 'scanRecordCtrl',
              data: {pageTitle: '员工码扫描记录'}
            })
            .state('/mycto/recordlist', {
              url: "/mycto/recordlist",
              templateUrl: "views/mycto/recordlist.html",
              controller: 'recordController',
              data: {pageTitle: '看房记录'}
            })
            .state('/mycto/newsList', {
              url: "/mycto/newsList",
              templateUrl: "views/mycto/news.html",
              controller: 'newsCenterController',
              data: {pageTitle: '资讯中心'}
            })
            .state('/mycto/news', {
              url: "/mycto/news",
              templateUrl: "views/mycto/newscenter.html",
              controller: 'newsController',
              data: {pageTitle: '最新资讯'}
            })
            .state('/mycto/clientlist', {
              url: "/mycto/clientlist",
              templateUrl: "views/mycto/clientlist.html",
              controller: 'clientListController',
              data: {pageTitle: '我的客户'}
            })
            .state('/mycto/addclient', {
              url: "/mycto/addclient",
              templateUrl: "views/mycto/addclient.html",
              controller: 'addClientController',
              data: {pageTitle: '新增客户'}
            })
            .state('/mycto/clientdetail', {
              url: "/mycto/clientdetail",
              templateUrl: "views/mycto/clientdetail.html",
              controller: 'clientDetailController',
              data: {pageTitle: '详细客户资料'}
            })
            .state('/mycto/completeclient', {
              url: "/mycto/completeclient",
              templateUrl: "views/mycto/completeclient.html",
              controller: 'completeClientController',
              data: {pageTitle: '完善客户资料'}
            })
            .state('/mycto/allstatistics', {
              url: "/mycto/allstatistics",
              templateUrl: "views/mycto/allstatistics.html",
              controller: 'allStatisticsController',
              data: {pageTitle: '活动数据总览'}
            })
            .state('/mycto/activestatistics', {
              url: "/mycto/activestatistics",
              templateUrl: "views/mycto/active_statistics.html",
              controller: 'activeStatisticsController',
              data: {pageTitle: '活动统计'}
            })
            .state('/mycto/timeselect', {
              url: "/mycto/timeselect",
              templateUrl: "views/mycto/time_select.html",
              controller: 'timeSelectController',
              data: {pageTitle: '时间段选择'}
            })

          //2016/12/13 我的会员结束
          
           //2016/12/13 全名经济人开始
          .state('makemoney', {
                url: "/makemoney/makemoney",
                templateUrl: "views/makemoney/makemoney.html",
                controller: 'makeMoneyCtrl',
                data: {pageTitle: '世茂乐享家'}
            })
            .state('signup', {
                url: "/makemoney/signup",
                templateUrl: "views/makemoney/signup.html",
                controller: 'signUpCtrl',
                data: {pageTitle: '注册经纪人'}
            })
            .state('recommend', {
                url: "/makemoney/recommend",
                templateUrl: "views/makemoney/recommend.html",
                controller: 'recommendCtrl',
                data: {pageTitle: '推荐买房'}
            })
            .state('activerule', {
                url: "/makemoney/activerule",
                templateUrl: "views/makemoney/activerule.html",
                controller: 'activeRuleCtrl',
                data: {pageTitle: '推荐奖励规则'}
            })
            .state('client', {
                url: "/makemoney/client",
                templateUrl: "views/makemoney/client.html",
                controller: 'moneyClientCtrl',
                data: {pageTitle: '我的客户'}
            })
            .state('clientdetail', {
                url: "/makemoney/clientdetail",
                templateUrl: "views/makemoney/clientdetail.html",
                controller: 'clientDetailCtrl',
                data: {pageTitle: '客户详情'}
            })
             .state('feedback', {
                url: "/makemoney/feedback",
                templateUrl: "views/makemoney/feedback.html",
                controller: 'feedBackCtrl',
                data: {pageTitle: '意见反馈'}
            })
            .state('bindingcard', {
                url: "/makemoney/bindingcard",
                templateUrl: "views/makemoney/bindingcard.html",
                controller: 'bindingCardCtrl',
                data: {pageTitle: '绑定银行卡'}
            })
            .state('bindingcardinfo', {
                url: "/makemoney/bindingcardinfo",
                templateUrl: "views/makemoney/bindingcardinfo.html",
                 //controller: 'bindingCardCtrl',
                data: {pageTitle: '银行卡绑定说明'}
            })			
            .state('personalCenter', {
              url: '/personalCenter',
              templateUrl: 'views/makemoney/personal_center.html',
              controller: 'personalCtrl',
              data: {
                pageTitle: '个人中心'
              }
            })
            .state('personalInfo', {
              url: '/personalCenter/info',
              templateUrl: 'views/makemoney/info_view.html',
              controller: 'personalInfoCtrl',
              data: {
                pageTitle: '个人信息'
              }
            })       
            .state('personalInfoEdit', {
              url: '/personalInfo/edit',
              templateUrl: 'views/makemoney/info_edit.html',
              controller: 'personalInfoEditCtrl',
              data: {
                pageTitle: '个人信息'
              }
            })
            .state('myReward', {
              url: '/personalCenter/myReward',
              templateUrl: 'views/makemoney/my_reward.html',
              controller: 'myRewardCtrl',
              data: {
                pageTitle: '我的奖励'
              }
            })
            .state('enjoyHome', {
              url: '/personalCenter/enjoyHome',
              templateUrl: 'views/makemoney/about_enjoy_home.html',
              controller: 'enjoyHomeCtrl',
              data: {
                pageTitle: '关于乐享家'
              }
            })
            .state('makemoneychoosecity', {
              url: '/makemoney/makemoneychoosecity',
              templateUrl: 'views/makemoney/makemoneychoosecity.html',
              controller: 'makeMoneyChooseCityCtrl',
              data: {
                pageTitle: '选择城市'
              }
            })
            .state('makeMoneySearchHouseCtrl', {
              url: '/makemoney/makemoneysearchhouse',
              templateUrl: 'views/makemoney/makemoneysearchhouse.html',
              controller: 'makeMoneySearchHouseCtrl',
              data: {
                pageTitle: '搜索楼盘'
              }
            })
          .state('test', {
              url: '/test',
              templateUrl: 'views/test.html',
              controller: 'testCtrl',
              data: {
                  pageTitle: '搜索楼盘'
              }
          });

          $locationProvider.html5Mode(true);
          $httpProvider.defaults.withCredentials = true;
      }
  ])
      .config(['cfpLoadingBarProvider', function(cfpLoadingBarProvider) {        
        cfpLoadingBarProvider.includeSpinner = true;
        cfpLoadingBarProvider.spinnerTemplate = '<div class="loadingBox"><img src="../../images/svg/three-dots.svg" width="45px"></div>';
      }])
  .run([
    '$rootScope', '$window','$location','HOST','commonServ','$http',
    function ($rootScope, $window,$location,HOST,commonServ,$http) {
      	$rootScope.$on('$stateChangeStart', function (event, toState) {
        $rootScope.$state = toState;
        $rootScope.changeHref = function (url) {
            window.location.href = url;
        }
        $window.document.title = toState.data.pageTitle;
            var iframe = document.createElement("iframe");
            iframe.title = '世茂集团';
            iframe.width = 0;
            iframe.height = 0;
            iframe.setAttribute("src", "images/mycto-logo.png");
            iframe.addEventListener('load', function () {
              setTimeout(function () {
                iframe.removeEventListener('load', function () {
                });
                document.body.removeChild(iframe);
              }, 0);
            });
            document.body.appendChild(iframe);
      });

    }
  ]);
      
})();