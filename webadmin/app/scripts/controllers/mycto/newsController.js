(function () {
  'use strict';

  angular.module("webApp").controller("newsController", newsController);
  function newsController($scope, commonServ, HOST,$location,viewImage,$timeout) {
    var id = $location.search().news_id;
    $scope.model = {};
    getNewsInfo();
    function getNewsInfo() {
      var url = HOST + '/information/info';
      commonServ.post({
        url: url,
        param: {news_id: id},
        success: function (data) {
          $scope.news = data.errmsg.data
           $timeout(function(){
                  viewImage($scope.news.content);
            },500);
        }
      });

    };


  }

  newsController.$inject = ['$scope', 'commonServ', 'HOST','$location', 'viewImage','$timeout'];
})();
