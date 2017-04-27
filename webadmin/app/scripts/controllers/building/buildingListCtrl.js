/**
 * @ngdoc function
 * @name webApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the webApp
 */
(function() {
	'use strict';

	angular.module('webApp').controller('buildingListCtrl', buildingListCtrl);
	function buildingListCtrl($scope, HOST, commonServ, $rootScope, $timeout, $location) {
		$scope.imgData = [];//轮播图数据
		var int = 1, isajax = false;
		$scope.ajaxData.page = int;
		$scope.bulidingList = [];//楼盘列表
		var city_id = '';
		$scope.$on('ajaxData',function(event,data){
			getBuildingList();
			loadMore();
		});
		$scope.goHref = function (id) {
			window.location.href = 'building/detail?id=' + id +'&city='+ $scope.ajaxData.city;
		};
		//加载区域列表
		getBuildingList();
		//轮播图
		commonServ.post({
			url: HOST + '/house/gallery-slide',
			success: function(data) {
				$scope.imgData = data.errmsg.data;
				$timeout(function() {
					var mySwiper = new Swiper('.swiper-container', {
						loop: true,
						autoplay: 3000, //可选选项，自动滑动
						watchSlidesProgress: true,
						watchSlidesVisibility: true,
						pagination : '.swiper-pagination'
					});
				},500);
				if(data.errcode == 0) {
					$(".elastic-layer").show();
				}

			},
			error: function(data) {
				$scope.isLoading = {
					display: "none"
				};
				wsh.successText(data.errmsg, false, $rootScope, $timeout);
			}
		});
		function getBuildingList() {
			if ($scope.ajaxData.city == '') return;
			commonServ.post({
				url: HOST + '/house/list',
				param:$scope.ajaxData,
				success: function(data) {
					city_id = data.errmsg.data[0].city_id;
					getAreaInfo();
				},
				error: function(data) {
					wsh.successText(data.errmsg, false, $rootScope, $timeout);
				}
			});
		}
		//获取大区信息
		function getAreaInfo() {
			commonServ.post({
				url: HOST + '/house/regional-list',
				param:{city_id:city_id},
				success: function(data) {
					$scope.areaList = data.errmsg.data;
				},
				error: function(data) {
					wsh.successText(data.errmsg, false, $rootScope, $timeout);
				}
			});
		}
		//跳转其他城市
		$scope.otherCity = function(city){
			window.location.href = 'building/index?type='+$scope.ajaxData.house_type +'&city='+ city;
		};

		//返回时销毁事件绑定
		$scope.$on('$destroy', function(){
			$(window).unbind('maxScorll');
		});
		$(window).bind('maxScorll', function (e) {
			if(isajax) return;
			loadMore();
		});

		function loadMore() {
			if ($scope.ajaxData.city == '') return;
			var data =angular.copy($scope.ajaxData);
			data.page = int;
			isajax = true;
			commonServ.post({
				url: HOST + '/house/list',
				param:data,
				beforeSend: function () {
					wsh.successText('加载中...');
				},
				success: function (data) {
					isajax = false;
					if (data.errmsg.data.length == 0) {
						isajax = true;
						//return wsh.successText('没有更多了!');
						return false;
					} else {
						console.log($scope.bulidingList);
						$scope.bulidingList = $scope.bulidingList.concat(data.errmsg.data);
						int++;
						isajax = false;
					}
				}

			})
		}
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
		tt.init();
	}
	buildingListCtrl.$inject = ['$scope', 'HOST', 'commonServ', '$rootScope', '$timeout', '$location'];
})();