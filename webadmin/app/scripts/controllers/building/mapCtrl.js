/**
 * @ngdoc function
 * @name webApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the webApp
 */
(function() {
	'use strict';
	angular.module('webApp').controller('mapCtrl', mapCtrl);

	function mapCtrl($scope, commonServ, HOST, $location, $rootScope, $timeout) {
		$scope.areaArrow = false; //区域是否展开
		$scope.typeArrow = false; //区域是否展开
		$scope.isHouse = false;
		$scope.isCurrent = 0;
		$scope.isCurrent2 = 0;
		$scope.bottomShow = false;
		$scope.mapHousedetail = '';
		$scope.goHref = function (id,city) {
			window.location.href = 'building/detail?id=' + id + '&city=' + city;
		};
		$scope.navCenter={
			lat:'',
			lng:''
		};
		var cityid = '';
		$scope.areaList = [
			{
				name:'不限',
				id:''
			}
		];
		$scope.typeList = [
			{
				id:'',
				name:'不限'
			},
			{
				id:'1,6',
				name:'住宅'
			},
			{
				id:'2,6',
				name:'商业'
			},
			{
				id:3,
				name:'酒店'
			},
			{
				id:4,
				name:'物业'
			},
			{
				id:5,
				name:'主题乐园'
			}
		];
		$scope.mapHouse = [];//地图经纬度数组
		getBuildingList();
		var mH = $(window).height() - $('.city-wrap').height() + 'px';
		$(".map-page").css('height', mH);
		$scope.areaShow = function() {
			$scope.areaArrow = !$scope.areaArrow;
			$scope.typeArrow = false;
		};
		$scope.typeShow = function() {
			$scope.areaArrow = false;
			$scope.typeArrow = !$scope.typeArrow;
		};
		//选择区域或类型
		$scope.areaChoose= function (area,index) {
			$scope.isCurrent = index;
			$scope.ajaxData.district_id = area;
			$scope.areaArrow = false;
			getBuildingList();
		};
		$scope.typeChoose= function (type,index) {
			$scope.isCurrent2 = index;
			$scope.ajaxData.house_type = type;
			$scope.typeArrow = false;
			getBuildingList();
		};
		//初始化地图方法
		function init() {
			var center = new qq.maps.LatLng($scope.navCenter.lat, $scope.navCenter.lng);
			var map = new qq.maps.Map(document.getElementById("container"), {
				center: center,//地图中心
				zoom:10//缩放级别
			});
			function CustomOverlay(position, index) {
				this.index = index;
				this.position = position;
			}
			CustomOverlay.prototype = new qq.maps.Overlay();
			//定义construct,实现这个接口来初始化自定义的Dom元素
			CustomOverlay.prototype.construct = function() {
					var div = this.div = document.createElement("div");
					var divStyle = this.div.style;
					div.id = 'a' + this.index;
					div.className = 'map-tag';
					divStyle.position = "absolute";
					divStyle.width = '120px';
					divStyle.height ='50px';
					divStyle.background = "#FFFFFF";
					divStyle.border = "1px solid #ccc";
					divStyle.textAlign = "center";
					divStyle.lineHeight = "20px";
					divStyle.cursor = "pointer";
					this.div.innerHTML = '<div><p class="map_house_name">'+$scope.mapHouse[this.index].house_name+'</p><p><span>'+$scope.mapHouse[this.index].price+'</span>元/m<sup>2</sup></p></div>';
					//将dom添加到覆盖物层
					var panes = this.getPanes();
					//设置panes的层级，overlayMouseTarget可接收点击事件
					panes.overlayMouseTarget.appendChild(div);
					var self = this;
					this.div.onclick = function() {
						$(".map-tag").removeClass('map-active');
						$(this).addClass('map-active');
						mapDetailShow(self.index);
					}
				};
			//实现draw接口来绘制和更新自定义的dom元素
			CustomOverlay.prototype.draw = function() {
					var overlayProjection = this.getProjection();
					//返回覆盖物容器的相对像素坐标
					var pixel = overlayProjection.fromLatLngToDivPixel(this.position);
					var divStyle = this.div.style;
					divStyle.left = pixel.x -50+ "px";
					divStyle.top = pixel.y -25 + "px";
				};
			//实现destroy接口来删除自定义的Dom元素，此方法会在setMap(null)后被调用
			CustomOverlay.prototype.destroy = function() {
				this.div.onclick = null;
				this.div.parentNode.removeChild(this.div);
				this.div = null
			};

			// 遍历展示Dom元素
			for(var i = 0 ; i < $scope.mapHouse.length ;i++){
				var latlng = new qq.maps.LatLng($scope.mapHouse[i].latituded, $scope.mapHouse[i].longitude);
				var overlay = new CustomOverlay(latlng, i);	
				overlay.setMap(map);					
			}
		}
		function mapDetailShow(index){
			$scope.mapHousedetail = $scope.mapHouse[index];
			$scope.bottomShow = true;
			$scope.$apply();
		}
		//获取楼盘列表信息
		function getBuildingList() {
			commonServ.post({
				url: HOST + '/house/list',
				param:$scope.ajaxData,
				success: function(data) {
					$scope.mapHouse = data.errmsg.data;
					if($scope.navCenter.lat == ''){
						$scope.navCenter.lat = $scope.mapHouse[0].latituded;
						$scope.navCenter.lng = $scope.mapHouse[0].longitude;
					}
					if(cityid == ''){
						cityid = $scope.mapHouse[0].city_id;
						getAreaList(cityid);
					}

					init();//初始化地图
					$scope.isLoading = {
						display: "none"
					};
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
		}

		function getAreaList (city) {
			commonServ.post({
				url: HOST + '/common/find-city-ajax',
				param:{id:city},
				success: function(data) {
					$scope.areaList =$scope.areaList.concat(data.errmsg);
					$scope.isLoading = {
						display: "none"
					};
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
		}

		// $scope.houseTypeClass = [];
		// $scope.isSearch = false;//是否搜索
		// $scope.isActive = false;//是否选择状态
		// var isajax = false;
		// var int = 2;
		// var house_id = $location.search().id;
		// $scope.isLoading = {
		//   display: "block"
		// };
		// getHouseTypeList();//获取户型类别
		// //楼盘信息
		// // commonServ.post({
		// //   url: HOST + '/house/detail',
		// //   param: {house_id: house_id},
		// //   success: function (data) {
		// //     $scope.houseInfo = data.errmsg.data;
		// //     $scope.isLoading = {
		// //       display: "none"
		// //     };
		// //   },
		// //   error: function (data) {
		// //     $scope.isLoading = {
		// //       display: "none"
		// //     };
		// //     wsh.successText(data.errmsg)
		// //   }
		// // });
		// //户型信息
		// $scope.houseTypeClass.forEach(function (val, index) {
		//   val.id = index;
		//   val.ischoose = true
		// });
		// $scope.chooseType = function (id) {
		//   getHouseTypeinfo(id);
		//   $scope.class_id = id
		//
		// };
		// $scope.atten = function (id) {
		//   var url = HOST + '/house/attention';
		//   commonServ.post({
		//     url: url,
		//     param: {house_type_class_id: $scope.class_id, house_type_id: id, house_id: house_id},
		//     success: function (data) {
		//       if (data.errmsg.data == 0) {
		//         $scope.isActive = false;
		//       } else if (data.errmsg.data == 1) {
		//         $scope.isActive = true;
		//       }
		//     },
		//     error: function (data) {
		//       wsh.successText(data.errmsg, false, $rootScope, $timeout)
		//     }
		//   });
		//
		// };
		//
		// function getHouseTypeList() {
		//   var url = HOST + '/house/house-type-list';
		//   commonServ.post({
		//     url: url,
		//     param: {house_id: house_id, page: 1, page_size: 15},
		//     success: function (data) {
		//
		//       $scope.houseTypeList = data.errmsg.data;
		//       $scope.page = data.errmsg.page;
		//       if ($scope.houseTypeList.length > 0) {
		//         var id = $scope.houseTypeList[0].house_type_class_id;
		//         getHouseTypeinfo(id);
		//       }
		//
		//     },
		//     error: function (data) {
		//       wsh.successText(data.errmsg);
		//     }
		//   });
		//
		// }
		//
		// function getHouseTypeinfo(id) {
		//   var url = HOST + '/house/house-type-detail';
		//   commonServ.post({
		//     url: url,
		//     param: {house_type_class_id: id, house_id: house_id},
		//     success: function (data) {
		//       $scope.houseTypeInfo = data.errmsg ? data.errmsg.data : '';
		//       $scope.class_id = $scope.houseTypeInfo.house_type_class_id;
		//       getIsAtten(id);
		//     },
		//     error: function (data) {
		//       wsh.successText(data.errmsg);
		//     }
		//   });
		// }
		//
		// function getIsAtten(id) {
		//
		//   var isUrl = HOST + '/house/check-attention';
		//   commonServ.post({
		//     url: isUrl,
		//     param: {house_type_id: $scope.houseTypeInfo.house_type_id, house_id: house_id, house_type_class_id: id},
		//     success: function (data) {
		//       $scope.isActive = data.errmsg.data == 1 ? true : false;
		//     },
		//     error: function (data) {
		//       wsh.successText(data.errmsg);
		//     }
		//   });
		// }
		//
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
	}

	mapCtrl.$inject = ['$scope', 'commonServ', 'HOST', '$location', '$rootScope', '$timeout'];

})();