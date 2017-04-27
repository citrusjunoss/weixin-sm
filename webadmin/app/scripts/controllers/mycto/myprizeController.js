(function() {
	'use strict';

	angular.module("webApp").controller("myprizeController", myprizeController);

	function myprizeController($scope, commonServ, HOST,$rootScope,$timeout) {

		$scope.prizeDatas = []; //全部中奖记录
		$scope.noUserPrizeDatas = []; //没填写用户信息的中奖记录

		function getMyPrize() {
			commonServ.post({
				url: HOST + '/market-activity/find-user-record-list-ajax',
				params: {},
				success: function(data) {
					$scope.prizeDatas = [];
					var data = data.errmsg.data;
					if(data && data.length > 0) {
						data.forEach(function(item, i) {
							$scope.prizeDatas.push({
								activity_name: item.marketingActivity.activity_name,
								prizes_name: item.prizes_name,
								created: item.created,
								exchangetime: item.modified,
							})
						})
						
						var temArr=data.filter(function(item,i){
							if(item.mobile && item.address && item.username){
								return true;
							}
						})
						temArr.forEach(function(item, i) {
							$scope.noUserPrizeDatas.push({
								activity_name: item.marketingActivity.activity_name,
								prizes_name: item.prizes_name,
								created: item.created,
								id:item.marketingActivity.id
							})
						})
					}
				},
				error: function(data) {
					wsh.successText(data.errmsg);
				}
			})
		}
		getMyPrize();
		
		//提交信息
		$scope.submitInfo=function(){
 
			var name0=$scope.user.username;
			var mobile0=$scope.user.mobile;
			var address0=$scope.user.address;

			$scope.user.id=$scope.noUserPrizeDatas[0].id;
			 if(name0 == "" || name0 == "undefined" || mobile0 == "" || mobile0 == "undefined" || address0 == "" || address0 == "undefined"){
                return wsh.successText('请填写完整的信息！', false, $rootScope, $timeout);
            }
            if(!(/^1[0-9]{10}$/).test(mobile0)){
                return wsh.successText('请填写正确的手机号码！', false, $rootScope, $timeout);
            }
            
           $('#form_btn').attr('disabled', 'disabled');
			commonServ.post({
				url: HOST + '/market-activity/update-record-ajax',
				param: {
					"id":$scope.user.id,
	                "username":$scope.user.username,
	                "mobile":$scope.user.mobile,
	                "address":$scope.user.address
				},
				success: function(data) {
					wsh.successText('您的资料已提交成功！', false, $rootScope, $timeout);
					location.reload();					
				},
				error: function(data) {
					wsh.successText(data.errmsg);
				}
			})
			
		};

		//增加限制分享
		document.addEventListener('WeixinJSBridgeReady', function onBridgeReady() {
			WeixinJSBridge.call('hideOptionMenu');
		});
	}
	myprizeController.$inject = ['$scope', 'commonServ', 'HOST','$rootScope','$timeout'];
})();