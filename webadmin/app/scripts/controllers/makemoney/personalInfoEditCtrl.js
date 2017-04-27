(function() {
	'use strict';

	angular.module('webApp').controller('personalInfoEditCtrl', personalInfoEditCtrl);

	function personalInfoEditCtrl($scope, HOST, $location, commonServ, $timeout) {
		var autoCity = "" //自动定位的城市名
		$scope.is_gray = false;
		$scope.isMobile = false; //手机号非空
		$scope.isCode = true;
		$scope.isTips = false;
		$scope.idNumberDisable = false;
		var clickSendCode = true;
		$scope.houseList=[];

		$scope.user = {
			realname: '',
			mobile: '',
			captcha: '',
			city: '',
			house_id: '',
			idnumber: '',
			company_id: '',
			agency_id: '',
			iscontract: 1,
			typeid: 0
		};
		
		//修改经纪人类型 重新加载合作方
		$scope.changeAgentType=function(){
			
			if($scope.user.house_id && $scope.user.typeid==3) {
				//合作公司
				$scope.partnerList=[];
				commonServ.post({
					url: HOST + '/house/broker-company-list',
					param: {
						page_size: 999,
						page: 1,
						house_id: $scope.user.house_id
					},
					success: function(msg) {
						$scope.partnerList = msg.errmsg.data;
					}

				})
			}
			//中介公司列表
			$scope.agencyList = [];
			$scope.partnerList = [];
			$scope.user.house_id="";
			
		};

		//经纪人类型
		$scope.agentTypes = [{
				id: 0,
				name: '请选择经纪人'
			},
			{
				id: 1,
				name: '世茂业主'
			},
			{
				id: 2,
				name: '世茂员工'
			},
			{
				id: 3,
				name: '世茂合作方'
			},
			{
				id: 4,
				name: '中介公司'
			},
			{
				id: 5,
				name: '独立经纪人'
			}
		]
		//中介公司列表
		$scope.agencyList = []

		//所属公司
		$scope.partnerList = []

		commonServ.post({
			url: HOST + "/broker/broker-detail",
			success: function(res) {
				var data = res.errmsg.data;
				$scope.user = {
					realname: data.realname,
					mobile: data.mobile,
					city: data.city_id,
					house_id: parseInt(data.house_id),
					idnumber: data.idnumber,
					company_id: parseInt(data.company_id),
					agency_id: parseInt(data.agency_id),
					typeid: parseInt(data.typeid)
				};
				if($scope.user.idnumber) {
					$scope.idNumberDisable = true;
				}
				getCityAndHouse();
				$scope.changHouse();
			},
			error: function(data) {}
		});
		$scope.showsendbtn = false;
		var isUnNull = true; //验证码非空
		var sendCodeBtn = $(".send-code-btn"); //发送验证码按钮
		var isClick = true; //按钮可以被点击

		//改变了手机号
		$scope.changePhone = function() {
			isUnNull = false; //验证验证码非空
			clickSendCode = false;
			$scope.user.captcha = "";
			$scope.showsendbtn = true; //显示发送验证码按钮
		};

		//发送验证码方法
		$scope.sendCode = function() {

			if($scope.user.mobile == "" || /^\s+$/.test($scope.user.mobile)) {
				return wsh.successText("手机号码不能为空");
			}
			if(!/^1[34578]\d{9}$/.test($scope.user.mobile)) {
				return wsh.successText("请输入正确的手机号码");
			}
			if(!isClick) return;
			$scope.is_gray = true;
			isClick = false;
			$scope.isCode = false;
			clickSendCode = true;
			//获取验证码
			commonServ.post({
				url: HOST + '/message/get-captcha',
				param: {
					mobile: $scope.user.mobile
				},
				success: function(data) {
					// $scope.is_gray = false;
					// clearInterval(countTimer);
					// sendCodeBtn.val("重新发送")
					return wsh.successText("发送成功");
				},

				error: function(data) {
					return wsh.successText(data.errmsg);
				}
			});
			//发送验证码倒计时
			var countDown = 60;
			clearInterval(countTimer);
			var countTimer = setInterval(function() {
				countDown--;
				sendCodeBtn.val("重新发送(" + countDown + ")");
				if(countDown <= 0) {
					isClick = true;
					countDown = 60;
					$scope.is_gray = false;
					$scope.$apply();
					clearInterval(countTimer);
					sendCodeBtn.val("重新发送")
				}
			}, 1000)
		};

		//提交信息
		$scope.submitInfo = function() {
			if($scope.user.typeid == 0) {
				return wsh.successText("请选择经纪人");
			}
			if($scope.user.realname == "" || /^\s+$/.test($scope.user.realname)) {
				return wsh.successText("姓名不能为空");
			}
			if(!/^[\u4E00-\u9FA5]{2,5}$/.test($scope.user.realname)) {
				return wsh.successText("请输入2~5个汉字");
			}
			if($scope.user.mobile == "" || /^\s+$/.test($scope.user.mobile)) {
				return wsh.successText("手机号码不能为空");
			}
			if(!/^1[34578]\d{9}$/.test($scope.user.mobile)) {
				return wsh.successText("请输入正确的手机号码");
			}
			if(!$scope.user.city) {
				return wsh.successText("请选择城市");
			}
			if($scope.user.company_id == 0 && $scope.user.typeid == 3) {
				return wsh.successText("请选择合作方");
			}
			if($scope.user.agency_id == 0 && $scope.user.typeid == 4) {
				return wsh.successText("请选择中介公司");
			}
			if($scope.user.house_id == '' && ($scope.user.typeid == 1 || $scope.user.typeid == 3 || $scope.user.typeid == 4)) {
				return wsh.successText("请选择楼盘");
			}
			if($scope.user.idnumber == '' && ($scope.user.typeid == 1 || $scope.user.typeid == 2)) {
				return wsh.successText("请填写身份证");
			}
			if(!clickSendCode) {
				return wsh.successText("请重新获取验证码");
			}
			if($scope.user.captcha != '' && $scope.user.captcha) {
				isUnNull = true;
			}
			//判断非空
			if(isUnNull) {
				commonServ.post({
					url: HOST + "/broker/edit",
					param: $scope.user,
					success: function(data) {
						//弹窗提示修改成功
						$scope.isTips = true;
						//window.location.href = '/makemoney/makemoney';
					},
					codeCheck: function(data) {
						return wsh.successText(data.errmsg);
					},
					error: function(data) {
						return wsh.successText(data.errmsg);
					}
				})
			} else {
				return wsh.successText("请填写验证码");
			}
		}

		function getCityAndHouse() {
			//城市下拉
			commonServ.post({
				url: HOST + '/house/house-city-all',
				param: {
					page_size: 999,
					page: 1
				},
				success: function(msg) {
					$scope.cityList = msg.errmsg.data;
					if($scope.user.city) {
						for(var i = 0; i < $scope.cityList.length; i++) {
							if($scope.cityList[i].city_id == $scope.user.city) {
								$scope.user.city = $scope.cityList[i];
							}
						}
					}

					//楼盘下拉
					commonServ.post({
						url: HOST + '/house/list',
						param: {
							page_size: 999,
							page: 1,
							city: $scope.user.city.city_name
						},
						success: function(msg) {
							$scope.houseList = msg.errmsg.data;
						}
					})
				}
			})
		}

		//切换楼盘
		$scope.changHouse = function() {
			$scope.agencyList = [];
			$scope.partnerList = [];
			if($scope.user.house_id) {

				//合作公司
				commonServ.post({
					url: HOST + '/house/broker-company-list',
					param: {
						page_size: 999,
						page: 1,
						house_id: $scope.user.house_id
					},
					success: function(msg) {
						$scope.partnerList = msg.errmsg.data;
					}

				})

				//中介公司
				commonServ.post({
					url: HOST + '/house/broker-agency-list',
					param: {
						page_size: 999,
						page: 1,
						house_id: $scope.user.house_id
					},
					success: function(msg) {
						$scope.agencyList = msg.errmsg.data;
					}
				})
			}
		}

		//合作公司
		//		commonServ.post({
		//			url: HOST + '/company/list',
		//			param: { page_size: 999, page: 1 },
		//			success: function(msg) {
		//				$scope.partnerList = msg.errmsg.data;
		//			}
		//
		//		});
		//		//中介公司
		//		commonServ.post({
		//			url: HOST + '/agency/list',
		//			param: { page_size: 999, page: 1 },
		//			success: function(msg) {
		//				$scope.agencyList = msg.errmsg.data;
		//			}
		//		});

		//改变城市后重新请求楼盘
		$scope.changeCity = function() {
			$scope.houseList == []
			$scope.agencyList=[];
 			$scope.partnerList=[];
			commonServ.post({
				url: HOST + '/house/list',
				param: {
					page_size: 999,
					page: 1,
					city: $scope.user.city.city_name
				},
				success: function(msg) {
					$scope.houseList = msg.errmsg.data;
				},
				error: function(data) {
					$scope.houseList = []
				}
			})
		}

		//弹层提示
		$scope.TipClick = function() {
			$scope.isTips = false;
			window.location.href = '/personalCenter/info';
		}

	};

	personalInfoEditCtrl.$inject = ['$scope', 'HOST', '$location', 'commonServ', '$timeout', ];
})();