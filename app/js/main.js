'use strict';
angular.module('Directives', []);
angular.module('Services', []);
angular.module('Filters', []);
angular.module('Constants', []);

var module = angular.module('app', ['Constants', 'ui.router', 'Directives', 'Services', 'Filters', 'templates']);

module.controller('baseController', function($scope, $rootScope, API_CONSTANTS, $http, $interval) {
    var updateStatistics = function() {
        $http.get(API_CONSTANTS.HOSTS.PATH + API_CONSTANTS.GET_STATISTICS).then(function(response) {
            $rootScope.statistics = response.data;

            response.data.wish_price_usd = response.data.wish_price_eth * response.data.eth_price_usd;

            var oldWishPrice = response.data.wish_price_usd / (100 + response.data.wish_usd_percent_change_24h) * 100;
            var oldEthPrice = response.data.eth_price_usd / (100 + response.data.eth_percent_change_24h) * 100;


            var oldWishEthPrice = oldWishPrice/oldEthPrice;
            var newWishEthPrice = response.data.wish_price_usd / response.data.eth_price_usd;

            var percentChangeWishEth = (newWishEthPrice - oldWishEthPrice) / oldWishEthPrice * 100;

            response.data.wish_eth_percent_change_24h = Math.round(percentChangeWishEth * 100) / 100;
            response.data.wish_price_usd = Math.round(response.data.wish_price_usd * 100) / 100;
            response.data.wish_price_eth = Math.round(response.data.wish_price_eth * 100000) / 100000;
        });
    };
    $interval(updateStatistics, 30000);
    updateStatistics();
}).run(function() {

}).config(function($httpProvider, $qProvider, $compileProvider) {
    $httpProvider.defaults.xsrfCookieName = 'csrftoken';
    $httpProvider.defaults.xsrfHeaderName = 'X-CSRFToken';
    $qProvider.errorOnUnhandledRejections(false);
    $compileProvider.aHrefSanitizationWhitelist(/^\s*(mailto|otpauth|https?):/);
});

