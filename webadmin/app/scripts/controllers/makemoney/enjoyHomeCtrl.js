(function() {
	'use strict';

	angular.module('webApp')
		.controller('enjoyHomeCtrl', enjoyHomeCtrl);

	function enjoyHomeCtrl($scope, HOST, $location, commonServ,viewImage, $timeout) {
		commonServ.post({
			url: HOST + "/broker/activity-rules",
			success: function(data) {
				$scope.rules = data.errmsg.data;
				//微信图片预览
				$timeout(function(){
		                  viewImage($scope.rules.rule);
		              },500);
			},
			error: function(data) {

			}

		});


	}

	enjoyHomeCtrl.$inject = ['$scope', 'HOST', '$location', 'commonServ', 'viewImage','$timeout'];
})();