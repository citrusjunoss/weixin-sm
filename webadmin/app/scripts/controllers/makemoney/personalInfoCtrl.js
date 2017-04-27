(function() {
	'use strict';

	angular.module('webApp')
		.controller('personalInfoCtrl', personalInfoCtrl);

	function personalInfoCtrl($scope, HOST, $location, commonServ) {
		/*brokerInfoApi.doRequest().success(function (data) {
			
		});*/
		commonServ.post({
			url: HOST + "/broker/broker-detail",
			success: function(data) {
				$scope.brokerInfo = data;
				switch(data.errmsg.data.typeid){
			             case '1': 
			               $scope.brokerType = '世茂业主' ;
			               break;
			             case '2': 
			               $scope.brokerType = '世茂员工' ;
			               break;
			             case '3': 
			               $scope.brokerType = '世茂合作方' ;
			               break;
			             case '4': 
			               $scope.brokerType = '中介公司' ;
			              break;
			             case '5': 
			               $scope.brokerType = '独立经纪人' ;
			               break;
		            }
		            $scope.typeid=data.errmsg.data.typeid;
		            //城市
		            $scope.cityName = data.errmsg.data.city_name;
		            //身份证
		            $scope.idnumber = data.errmsg.data.idnumber;

		            // 注册时间
		            $scope.brokerTime = data.errmsg.data.writetime;
		            var newData=data.errmsg.data;
		            if(newData.houseinfo &&newData.houseinfo.house_name){//所属楼盘
		            		$scope.houseName = newData.houseinfo.house_name;
		            }
		            if(newData.companyinfo && newData.companyinfo.company_name){ // 合作公司
		            		$scope.companyName = newData.companyinfo.company_name;
		            }
		            if(newData.agencyinfo && newData.agencyinfo.agency_name){//所属公司
		            		$scope.agencyName =newData.agencyinfo.agency_name;
		            }
			},
			error: function(data) {
			}
		});

	}

	personalInfoCtrl.$inject = ['$scope', 'HOST', '$location', 'commonServ'];
})();

