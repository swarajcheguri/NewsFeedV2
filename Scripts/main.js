
(function () {

    NProgress.start();
    jQuery("[name='my-checkbox']").bootstrapSwitch();
    var App = angular.module('RSSFeedApp', []);

    App.controller("FeedCtrl", ['$scope','$http', 'FeedService', function ($scope,$http, Feed) {
        $scope.loadButonText = "Load";
        $http.get(' http://tecnotree-7.0x10.info/api/tecnotree?type=json&query=list_feed')
          .success(function (data, status, headers) {
              NProgress.start();
              $scope.intialFeed = data.feed;
              var category = [];
              for (var i = 0; i < data.feed.length; i++) {
                  if (category.indexOf(data.feed[i].category) == -1) {
                      category.push(data.feed[i].category)
                  }
              }
              $scope.categories = category;
              $scope.totalFeed = data.feed.length;
              $http.get('http://tecnotree-7.0x10.info/api/tecnotree?type=json&query=api_hits')
       .success(function (data, status, headers) {
           $scope.apihits = data.api_hits;
           NProgress.done();
       })
       .error(function (data, status, headers) {
           $scope.SaveDataResult = "Error occured while reterving the API Hits";
           alert($scope.SaveDataResult);
       });
              NProgress.done();
          })
          .error(function (data, status, headers) {
              $scope.SaveDataResult = "Error occured while getting the data";
              alert($scope.SaveDataResult);
          });
        $scope.loadFeed = function (e) {
            Feed.parseFeed($scope.feedSrc).then(function (res) {
                $scope.loadButonText = angular.element(e.target).text();
                $scope.feeds = res.data.responseData.feed.entries;
            });
        }
    }]);

    App.factory('FeedService', ['$http', function ($http) {
        return {
            parseFeed: function (url) {
                return $http.jsonp(' http://ajax.googleapis.com/ajax/services/feed/load?v=1.0&num=4&callback=JSON_CALLBACK&q=' + encodeURIComponent(url));
            }
        }
    }]);


})(); 


