

/**
 * @ngdoc function
 * @name webApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the webApp
 */
(function(){
	'use strict';
	angular.module('webApp').controller('contactCtrl',contactCtrl);
	function contactCtrl($scope) {
//		var mySwiper = new Swiper('.swiper-container', {
//			loop:true,
//			autoplay: 5000, //可选选项，自动滑动
//			watchSlidesProgress: true,
//			watchSlidesVisibility: true,
//		})
		$scope.addInfo = [
			[
				"世茂集团总部",
				"地址：中国香港金钟道89号力宝中心第一座38楼",
				"手机:00852-25119968",
				"传真:00852-25110278",
				"网址:www.shimaogroup.com"
			],
			[
				"世茂集团大中华区营运总部",
				"地址：中国上海市浦东新区银城中路68号时代金融中心大厦38楼",
				"邮编：200120",
				"电话：0086-21-38611111",
				"传真：0086-21-38611118",
				"网址:www.shimaogroup.com"
			],
			[
				"世茂房地产控股有限公司（股份代码 0813.HK)",
				"地址：中国香港金钟道89号力宝中心第一座38楼 ",
				"电话：00852-25119968",
				"传真：00852-25110278",
				"地址：中国上海市浦东新区银城中路68号时代金融中心大厦36-38楼",
				"邮编：200120",
				"电话：0086-21-38611111",
				"传真：0086-21-38611118",
				"网址：www.shimaoproperty.com"
			],
		]
	};
	contactCtrl.$inject=['$scope']
})();
