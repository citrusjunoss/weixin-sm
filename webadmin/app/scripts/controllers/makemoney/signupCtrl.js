(function () {
  'use strict';

  /**
   * @ngdoc function
   * @name webApp.controller:MainCtrl
   * @description
   * # MainCtrl
   * Controller of the webApp
   */
  angular.module('webApp').controller('signUpCtrl', signUpCtrl);

  function signUpCtrl($scope, commonServ, HOST, $timeout, $location) {
  	var autoCity=""//自动定位的城市名
    $scope.is_gray = false;
    $scope.isMobile = false; //手机号非空
    $scope.isChoose = false;//同意条款
    $scope.isCode = true;
    $scope.is_show_layer = false;
    $scope.isTips = false;
    $scope.houseList==[];
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
      typeid:0
    };//提交的用户信息 ps 需增加新增form的post字段
    //默认经纪人类型
   //该字段可换为$scope.user.经纪人类型
    //经纪人类型
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
    $scope.agentTypes = [
      {
        id:0,
        name:'请选择经纪人'
      },
      {
        id:1,
        name:'世茂业主'
      },
      {
        id:2,
        name:'世茂员工'
      },
     	{
      	id:3,
       	name:'世茂合作方'
     	},
      {
        id:4,
        name:'中介公司'
      },
      {
        id:5,
        name:'独立经纪人'
      }
    ]
    //中介公司列表
    $scope.agency = 0;//该字段可换为$scope.user.中介公司ID
    $scope.agencyList = [
      {
        agency_id :0,
        agency_name:'请选择中介'
      },
      {
        agency_id :1,
        agency_name:'世茂业主'
      },
      {
        agency_id :2,
        agency_name:'世茂员工'
      },
      {
        agency_id :3,
        agency_name:'世茂合作方'
      },
      {
        agency_id :4,
        agency_name:'中介公司'
      },
      {
        agency_id :5,
        agency_name:'独立经纪人'
      }
    ]
    //合作公司列表
    $scope.partne = 0;//该字段可换为$scope.user.合作公司Id
    $scope.partnerList = []
    var isUnNull = false;//验证码非空
    var sendCodeBtn = $(".send-code-btn");//发送验证码按钮
    var isClick = true;//按钮可以被点击

    //发送验证码方法
    $scope.sendCode = function () {

      if ($scope.user.mobile == "" || /^\s+$/.test($scope.user.mobile)) {
          return wsh.successText("手机号码不能为空");
      }
      if (!/^1[34578]\d{9}$/.test($scope.user.mobile)) {
         return  wsh.successText("请输入正确的手机号码");
      }
      if (!isClick) return;
      $scope.is_gray = true;
      isClick = false;
      $scope.isCode = false;
        //获取验证码
        commonServ.post({
          url: HOST + '/message/get-captcha',
          param: {mobile: $scope.user.mobile},
          success: function (data) {
            // $scope.is_gray = false;
            // clearInterval(countTimer);
            // sendCodeBtn.val("重新发送")
            return wsh.successText("发送成功");
          },

          error: function (data) {
            return wsh.successText(data.errmsg);
          }
        });
        //发送验证码倒计时
        var countDown = 60;
        clearInterval(countTimer);
        var countTimer = setInterval(function () {
          countDown--;
          sendCodeBtn.val("重新发送(" + countDown + ")");
          if (countDown <= 0) {
            isClick = true;
            countDown = 60;
            $scope.is_gray = false;
            $scope.$apply();
            clearInterval(countTimer);
            sendCodeBtn.val("重新发送")
          }
        }, 1000)
    };
 
 
 		//切换楼盘
 		$scope.changHouse=function(){
 			 $scope.agencyList=[];
 			 $scope.partnerList=[];
 			 //合作公司
 			 if($scope.user.house_id){
		    commonServ.post({
		        url: HOST + '/house/broker-company-list',
		        param:{page_size:999,page:1,house_id:$scope.user.house_id},        
		        success: function (msg) {
		          $scope.partnerList=msg.errmsg.data;
		        },
		        error: function (data) {
	            return wsh.successText(data.errmsg);
	          }
		
		      })
		    
		    //中介公司
		     commonServ.post({
		        url: HOST + '/house/broker-agency-list',
		        param:{page_size:999,page:1,house_id:$scope.user.house_id},        
		        success: function (msg) {
		          $scope.agencyList=msg.errmsg.data;
		        },
		        error: function (data) {
	            return wsh.successText(data.errmsg);
	          }
		      })
 			}
 		}
 		
   
    //条款显示
    $scope.clauseShow = function () {
      $scope.isChoose = !$scope.isChoose;
      $scope.is_show_layer = true;
    };
    //同意条款按钮
    $scope.agreeClause = function () {
      $scope.isChoose = true;
      $scope.is_show_layer = false;
    };

    // 弹层提示
    $scope.TipClick = function(){
        $scope.isTips = false;
        window.location.href = '/makemoney/makemoney';
    }

    //提交信息
    $scope.submitInfo = function () {
      if ($scope.user.typeid == 0) {
          return wsh.successText("请选择经纪人");
      }
      if ($scope.user.realname == "" || /^\s+$/.test($scope.user.realname)) {
          return wsh.successText("姓名不能为空");
      }
      if (!/^[\u4E00-\u9FA5]{2,5}$/.test($scope.user.realname)) {
          return wsh.successText("请输入2~5个汉字");
      }
      if ($scope.user.mobile == "" || /^\s+$/.test($scope.user.mobile)) {
          return wsh.successText("手机号码不能为空");
      }
      if (!/^1[34578]\d{9}$/.test($scope.user.mobile)) {
         return  wsh.successText("请输入正确的手机号码");
      }
      if (!$scope.user.city) {
          return wsh.successText("请选择城市");
      }
      if ($scope.user.company_id == 0 && $scope.user.typeid == 3) {
          return wsh.successText("请选择合作方");
      }
      if ($scope.user.agency_id == 0 && $scope.user.typeid == 4) {
          return wsh.successText("请选择中介公司");
      }
      if ($scope.user.house_id == '' && ($scope.user.typeid == 1 || $scope.user.typeid == 3 || $scope.user.typeid == 4)) {
          return wsh.successText("请选择楼盘");
      }
      if ($scope.user.idnumber == '' && ($scope.user.typeid == 1 || $scope.user.typeid == 2)) {
          return wsh.successText("请填写身份证");
      }
      if ($scope.user.captcha != '') {
        isUnNull = true;
      }
      //判断非空
      if (isUnNull) {
        //判断同意条款
        if ($scope.isChoose) {
          $scope.isChoose ? $scope.user.iscontract = 1 : $scope.user.iscontract = 2;
          commonServ.post({
            url: HOST + "/broker/regiser",
            param: $scope.user,
            success: function (data) {
                //跳转到我要赚钱首页
                $scope.isTips = true;
                //window.location.href = '/makemoney/makemoney';
            },
            codeCheck: function (data) {
              return wsh.successText(data.errmsg);
            },
            error: function (data) {
              return wsh.successText(data.errmsg);
            }
          })
        } else {
          return wsh.successText('请阅读注册条款')
        }
      } else {
        return wsh.successText('请填写完整信息')
      }
    }

	  //  获取注册须知
	  commonServ.post({
		  url:HOST + '/broker/activity-rules',
		  success:function (data) {
		    $scope.ruleText = data.errmsg.data;
		  }
	  })
	  
	  //自动定位到当前城市
	   var geolocation = new qq.maps.Geolocation("4GIBZ-326R3-O5E3H-3EJKP-IJNYZ-SNFVV", "myapp");
	   var options = {timeout: 8000};
	   geolocation.getLocation(showPosition,getCityAndHouse,options);
	   
	   function showPosition(data){
		   	autoCity=data.city;
		   	//楼盘下拉
		   getCityAndHouse();
			}
	   
	   //获取城市 获取楼盘
	   function getCityAndHouse(){
		    //城市下拉
		    commonServ.post({
		        url: HOST + '/house/house-city-all',
		        param:{page_size:999,page:1},        
		        success: function (msg) {
		          $scope.cityList=msg.errmsg.data;
		          //TODO 自动定位判别
		          for(var i=0;i<$scope.cityList.length;i++){
		          	if($scope.cityList[i].city_name==autoCity){
		          		$scope.user.city=$scope.cityList[i];
		          	}
		          }
							
		          //楼盘下拉
					    commonServ.post({
					        url: HOST + '/house/list',
					        param:{page_size:999,page:1,city:$scope.user.city.city_name},        
					        success: function (msg) {
					          $scope.houseList=msg.errmsg.data;
					        },
					        error: function (data) {
				            return wsh.successText(data.errmsg);
				          }
					    })
		        }
		      })
	   }
	   
	   //改变城市后重新请求楼盘
	   $scope.changeCity=function(){
	   	 //楼盘下拉
	   	  $scope.houseList==[];
	   	  $scope.agencyList=[];
 			  $scope.partnerList=[];
		    commonServ.post({
		        url: HOST + '/house/list',
		        param:{page_size:999,page:1,city:$scope.user.city.city_name},        
		        success: function (msg) {
		          $scope.houseList=msg.errmsg.data;
		        },
		        error: function (data) {
	            return wsh.successText(data.errmsg);
	          }
		    })
	   }
	   
}

  signUpCtrl.$inject = ['$scope', 'commonServ', 'HOST', '$timeout', '$location'];
})();
