(function () {
  'use strict';
  angular.module('webApp')
    .controller('myRewardCtrl', myRewardCtrl);


	function myRewardCtrl($scope, HOST, $location, commonServ) {
		$scope.tabTitBonus = true;
		$scope.tabTitPrize = false;

		$scope.showTabBonus = function () {
			$scope.tabTitBonus = true;
			$scope.tabTitPrize = false;
		};

		$scope.showTabPrize = function () {
			$scope.tabTitBonus = false;
			$scope.tabTitPrize = true;
		};

		// user info
		commonServ.post({
			url: HOST + "/user/user-info",
			success: function (data) {
				$scope.userInfo = data.errmsg.data.wxusersex;
			},
			error: function (data) {

			}
		});

		// broker info
		commonServ.post({
			url: HOST + "/broker/broker-info",
			success: function (data) {
				$scope.broker = data.errmsg.data;
			},
			error: function (data) {

			}
		})

	}
  
  myRewardCtrl.$inject = ['$scope', 'HOST', '$location', 'commonServ'];
})();