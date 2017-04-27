(function() {
    'use strict';

    /**
     * @ngdoc function
     * @name webApp.controller:MainCtrl
     * @description
     * # MainCtrl
     * Controller of the webApp
     */
    angular.module('webApp')
        .controller('moneyClientCtrl', moneyClientCtrl)
        .directive('whenScrolled', function() {
            return function(scope, element, attr) {
                $(window).scroll(function() {
                    var scrollTop = $(window).scrollTop(),
                        scrollHeight = $(document).height(),
                        windowHeight = $(window).height();

                    if (scrollTop + windowHeight >= scrollHeight) {
                        scope.$apply(attr.whenScrolled);
                    }
                });
            };
        })
        /*.factory('Reddit', function($rootScope, $http, $timeout) {
          var Reddit = function(status) {
            this.items = [];
            this.busy = false;
            this.page = 1;
            this.noMore = false;
            this.status = status;
          };

          Reddit.prototype.nextPage = function() {
            if (this.busy) return;
            this.busy = true;

            var url = 'http://wx.api.vkdvip.com/broker/client-list';
            var wxUrl = 'http://shimao.wx.snsshop.net/makemoney/client';
            $http.post(url, {go_wxurl: wxUrl,page: this.page, page_size: 15, status: this.status, token: sessionStorage.token}).success(function(data) {         
                
              if ((data.errmsg == null) || (data.errmsg.data.length == 0)) {
                this.noMore = true;
                $timeout(function() {
                  this.noMore = false;
                }.bind(this), 2000);
              } else {
                var items = data.errmsg.data;
                for (var i = 0; i < items.length; i++) {
                  this.items.push(items[i]);
                }
                this.busy = false;
                this.page += 1;
              }  
             
            }.bind(this));
          };

          return Reddit;
        })*/
    ;

    function moneyClientCtrl($scope, HOST, $location, $timeout, commonServ) {
        /*$scope.status = 2;
        $scope.isNoData = false;
        $scope.searchWord = "";
        $scope.clientList = [];
        $scope.brokerInfo = {};
        $scope.isBroker = false;
        var int = 2, isajax = false;
        //post参数
        $scope.ajaxData = {
          page_size: 20,
          page: 1,
          search: '',
          status: '1',
          agent_id: $scope.brokerInfo.agent_id
        };

        //获取权限信息
        commonServ.post({
          url: HOST + "/broker/broker-info",
          success: function (data) {
            if (data.errmsg == '没有权限') {
              $scope.isBroker = false;
              window.location.href='/makemoney/makemoney';
            } else {
              $scope.isBroker = true;
              $scope.brokerInfo = data.errmsg.data;
              //获取经纪人信息
              commonServ.post({
                url: HOST + "/broker/user-info",
                param: {agent_id: $scope.brokerInfo.agent_id},
                success: function (data) {
                  $scope.userInfo = data.errmsg.data;
                },
                error: function (data) {
                }
              });
            }
          },
          error: function (data) {

          }
        });
        //搜索获取数据
        $scope.searchData = function () {
          getData();
        };

        //获取数据的方法
        function getData() {
          commonServ.post({
            url: HOST + "/broker/client-list",
            param: $scope.ajaxData,
            success: function (data) {
              $scope.clientList = data.errmsg.data;
            },
            error: function (data) {

            }
          })
        }

        //初始状态为有效客户
        getData();
        $scope.tabChange = function (status) {
          $scope.ajaxData.search = '';
          $scope.ajaxData.status = status;
          $scope.isNoData = false;
          getData();
          switch (status) {
            case 1:
              $('.client-status-m').text('您还没有效客户');
              $('.no-data-btn').show();
              $('.client-status-c').show();
              break;
            case 2:
              $('.client-status-m').text('您还没有推荐新客户');
              $('.no-data-btn').show();
              $('.client-status-c').show();
              break;
            case 3:
              $('.client-status-m').text('暂无无效客户');
              $('.no-data-btn').hide();
              $('.client-status-c').hide();
              break;
            default:
              break;
          }
        };
        //tab切换
        $scope.tabChange1 = function (status) {
          switch (status) {
            case 1:
              return window.location.href = '/makemoney/makemoney';
            case 2:
              if ($scope.isBroker) {
                return window.location.href = '/makemoney/client';
              } else {
                return window.location.href = '/makemoney/signup';
              }
            case 3:
              if ($scope.isBroker) {
                return window.location.href = '/makemoney/personal';
              } else {
                return window.location.href = '/makemoney/signup';
              }
          }
        };
        //滑屏加载
        $(window).bind('maxScorll', function (e) {
          if (isajax) return isajax;
          isajax = true;
          var data = angular.copy($scope.ajaxData);
          data.page = int;
          commonServ.post({
            url: HOST + '/broker/client-list',
            param: data,
            beforeSend: function () {
              wsh.successText('加载中...');
            },
            success: function (data) {
              if (data.errmsg.data.length == 0) {
                wsh.successText('没有更多了!');
                isajax = true;
              } else {
                $scope.clientList = $scope.clientList.concat(data.errmsg.data);
                int++;
                isajax = false;
              }
            },
            error: function (data) {
              isajax = false;
            }
          });
        });
        var tt = new ToSlideUp('body', "../../images/up.png",
          {
            Json: {
              'position': 'fixed',
              'width': '35px',
              'height': '35px',
              'bottom': '57px',
              'right': '13px',
              'z-index': '999'
            }, startLine: 300
          });
        tt.init();*/
        $scope.clientEffectCon = true;
        $scope.clientNewCon = false;
        $scope.clientInvalidCon = false;

        // client effect list
        $scope.init = function() {
            var params = {
                page_size: 17,
                page: 1,
                status: 1
            };
            $scope.busyInit = false;
            $scope.itemsEffect = [];
            commonServ.post({
                url: HOST + '/broker/client-list',
                param: params,
                success: function(data) {
                    if (data.errmsg.page.total_count == 0) {
                        $scope.dataEmptyEffect = true;
                    } else {
                        $scope.dataEmptyEffect = false;
                        if (data.errmsg.page.current_page < data.errmsg.page.total_page) {
                            params.page += 1;
                            angular.forEach(data.errmsg.data, function(item) {
                                $scope.itemsEffect.push(item);
                            });
                        } else {
                            $scope.dataEffectNoMore = true;
                            $timeout(function() {
                                $scope.dataEffectNoMore = false;
                            }, 2000);
                        }
                    }
                }
            });
        };
        $scope.init();

        $scope.showClientEffect = function() {
            $scope.clientEffectCon = true;
            $scope.clientNewCon = false;
            $scope.clientInvalidCon = false;

            // client effect list       
            var params = {
                page_size: 17,
                page: 1,
                status: 1
            };
            $scope.busyEffect = false;
            $scope.itemsEffect = [];
            $scope.loadMoreEffect = function() {
                commonServ.post({
                    url: HOST + '/broker/client-list',
                    param: params,
                    success: function(data) {
                        if (data.errmsg.page.total_count == 0) {
                            $scope.dataEmptyNew = true;
                        } else {
                            $scope.dataEmptyNew = false;
                            if (data.errmsg.page.current_page < data.errmsg.page.total_page) {
                                params.page += 1;
                                angular.forEach(data.errmsg.data, function(item) {
                                    $scope.itemsEffect.push(item);
                                });
                            } else {
                                $scope.dataEffectNoMore = true;
                                $timeout(function() {
                                    $scope.dataEffectNoMore = false;
                                }, 2000);
                            }
                        }
                    }
                })
            };
            $scope.loadMoreEffect();
        };

        $scope.showClientNew = function() {
            $scope.clientNewCon = true;
            $scope.clientEffectCon = false;
            $scope.clientInvalidCon = false;

            // client new list
            var params = {
                page_size: 17,
                page: 1,
                status: 2
            };
            $scope.busyNew = false;
            $scope.itemsNew = [];
            $scope.loadMoreNew = function() {
                commonServ.post({
                    url: HOST + '/broker/client-list',
                    param: params,
                    success: function(data) {
                        if (data.errmsg.page.total_count == 0) {
                            $scope.dataEmptyNew = true;
                        } else {
                            $scope.dataEmptyNew = false;
                            if (data.errmsg.page.current_page < data.errmsg.page.total_page) {
                                params.page += 1;
                                angular.forEach(data.errmsg.data, function(item) {
                                    $scope.itemsNew.push(item);
                                });
                            } else {
                                $scope.dataNewNoMore = true;
                                $timeout(function() {
                                    $scope.dataNewNoMore = false;
                                }, 2000);
                            }
                        }
                    }
                })
            };
            $scope.loadMoreNew();
        };

        $scope.showClientInvalid = function() {
            $scope.clientInvalidCon = true;
            $scope.clientNewCon = false;
            $scope.clientEffectCon = false;

            // client invalid list  

            var params = {
                page_size: 17,
                page: 1,
                status: 3
            };
            $scope.busyInvalid = false;
            $scope.itemsInvalid = [];
            $scope.loadMoreInvalid = function() {
                commonServ.post({
                    url: HOST + '/broker/client-list',
                    param: params,
                    success: function(data) {
                        if (data.errmsg.page.total_count == 0) {
                            $scope.dataEmptyInvalid = true;
                        } else {
                            $scope.dataEmptyInvalid = false;
                            if (data.errmsg.page.current_page < data.errmsg.page.total_page) {
                                params.page += 1;
                                angular.forEach(data.errmsg.data, function(item) {
                                    $scope.itemsInvalid.push(item);
                                });
                            } else {
                                $scope.dataInvalidNoMore = true;
                                $timeout(function() {
                                    $scope.dataInvalidNoMore = false;
                                }, 2000);
                            }
                        }
                    }
                })
            };
            $scope.loadMoreInvalid();
        };

        // client filter
        $scope.clientFilterFn = function(keyword) {
            if (!keyword) {
                wsh.successText('请输入姓名或手机号码');
            } else {
                if ($scope.clientEffectCon) {
                    commonServ.post({
                        url: HOST + '/broker/client-list',
                        param: {
                            page_size: 15,
                            page: 1,
                            status: 1,
                            search: keyword
                        },
                        success: function(data) {
                            $scope.dataEmptyEffect = (data.errmsg == null) || (data.errmsg.data.length == 0) ? true : false;
                            if (!$scope.dataEmptyEffect) {
                                // $scope.clientEffectList = data.errmsg.data;
                                $scope.itemsEffect = data.errmsg.data;
                            }
                        }
                    });
                } else if ($scope.clientNewCon) {
                    commonServ.post({
                        url: HOST + '/broker/client-list',
                        param: {
                            page_size: 15,
                            page: 1,
                            status: 2,
                            search: keyword
                        },
                        success: function(data) {
                            $scope.dataEmptyNew = (data.errmsg == null) || (data.errmsg.data.length == 0) ? true : false;
                            if (!$scope.dataEmptyNew) {
                                // $scope.clientNewList = data.errmsg.data;
                                $scope.itemsNew = data.errmsg.data;
                            }
                        }
                    });
                } else if ($scope.clientInvalidCon) {
                    commonServ.post({
                        url: HOST + '/broker/client-list',
                        param: {
                            page_size: 15,
                            page: 1,
                            status: 3,
                            search: keyword
                        },
                        success: function(data) {
                            $scope.dataEmptyInvalid = (data.errmsg == null) || (data.errmsg.data.length == 0) ? true : false;
                            if (!$scope.dataEmptyInvalid) {
                                // $scope.clientInvalidList = data.errmsg.data;
                                $scope.itemsInvalid = data.errmsg.data;
                            }
                        }
                    });
                }

            }
        };

        var isDisable = false;
        $scope.isBroker = false;
        $scope.is_over = false;
        commonServ.post({
            url: HOST + "/broker/broker-info",
            success: function(data) {
                if (data.errmsg == '没有权限') {
                    $scope.isBroker = false;
                    $scope.is_over = true;
                } else {
                    $scope.isBroker = true;
                    if ($scope.isBroker) {
                        $scope.brokerInfo = data.errmsg.data;
                        //获取经纪人信息
                        commonServ.post({
                            url: HOST + "/broker/user-info",
                            param: {
                                agent_id: $scope.brokerInfo.agent_id,
                                go_wxurl: $location.path()
                            },
                            success: function(data) {
                                $scope.is_over = true;
                            },
                            error: function(data) {
                                $scope.is_over = true;
                            }
                        });
                    }
                }
            },
            codeCheck: function(data) {
                if (data.errcode == -1) {
                    isDisable = true;
                }
                //wsh.successText(data.errmsg)
            },
            error: function(data) {
                //wsh.successText(data.errmsg)
            }
        });

        //tab切换
        $scope.tabChange = function(status) {
            if (!$scope.is_over) return;
            if (isDisable) {
                return wsh.successText('您的账号被禁用，请联系客服咨询');
            }
            switch (status) {
                case 1:
                    return window.location.href = '/makemoney/makemoney';
                case 2:
                    if ($scope.isBroker) {
                        return window.location.href = '/makemoney/client';
                    } else {
                        return window.location.href = '/makemoney/signup';
                    }
                case 3:
                    if ($scope.isBroker) {
                        return window.location.href = '/personalCenter';
                    } else {
                        return window.location.href = '/makemoney/signup';
                    }
            }
        };



    }

    moneyClientCtrl.$inject = ['$scope', 'HOST', '$location', '$timeout', 'commonServ'];
})();
