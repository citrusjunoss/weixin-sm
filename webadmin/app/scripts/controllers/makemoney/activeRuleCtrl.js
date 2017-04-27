/**
 * Created by liaocaiming on 2016/12/18.
 */
(function () {
  'use strict';


  angular.module('webApp').controller('activeRuleCtrl', activeRuleCtrl);

  function activeRuleCtrl($scope, commonServ, HOST, $location) {
    var id = parseInt($location.search().id);
    var house_id = parseInt($location.search().house_id);
    var url = HOST + '/markethouse/info';
    commonServ.post({
        url: url,
        param: {house_id: house_id, id: id},
        success: function (data) {
           $scope.ruleInfo = data.errmsg.data.agent_content;
        },
        error: function (data) {
          wsh.successText(data.errmsg)
        }
      });
  }
  
    

  activeRuleCtrl.$inject = ['$scope', 'commonServ', 'HOST', '$location'];
})();

