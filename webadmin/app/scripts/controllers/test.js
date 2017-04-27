(function () {
    'use strict';

    angular.module("webApp").controller("testCtrl", testCtrl);
    function testCtrl($scope, commonServ, HOST,$location) {
        var url = HOST + '/information/top-info';
        commonServ.post({
            url: url,
            success: function (data,status,headers,config) {
                $scope.news = data.errmsg.data;

            },
            error: function (data) {

            }
    })
    }

    testCtrl.$inject = ['$scope', 'commonServ', 'HOST','$location'];
})();