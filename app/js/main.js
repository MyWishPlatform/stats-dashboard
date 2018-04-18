'use strict';
angular.module('Directives', []);
angular.module('Services', []);
angular.module('Filters', []);
angular.module('Constants', []);

var module = angular.module('app', ['Constants', 'ui.router', 'Directives', 'Services', 'Filters', 'templates']);

module.controller('baseController', function($scope, $rootScope, API_CONSTANTS, $http, $interval) {

    var networksList = ['MAINNET', 'TESTNET'];
    $rootScope.network = 'MAINNET';

    $interval(function() {
        var index = networksList.indexOf($rootScope.network);
        var nextIndex = index + 1;
        nextIndex = nextIndex >= networksList.length ? 0 : nextIndex;
        $rootScope.network = networksList[nextIndex];
    }, 15000);

    var updateStatistics = function() {
        $http.get(API_CONSTANTS.HOSTS.PATH + API_CONSTANTS.GET_STATISTICS).then(function(response) {
            $rootScope.statistics = response.data;

            response.data.currency_statistics.wish_price_usd = response.data.currency_statistics.wish_price_eth * response.data.currency_statistics.eth_price_usd;

            var oldWishPrice = response.data.currency_statistics.wish_price_usd / (100 + response.data.currency_statistics.wish_usd_percent_change_24h) * 100;
            var oldEthPrice = response.data.currency_statistics.eth_price_usd / (100 + response.data.currency_statistics.eth_percent_change_24h) * 100;


            var oldWishEthPrice = oldWishPrice/oldEthPrice;
            var newWishEthPrice = response.data.currency_statistics.wish_price_usd / response.data.currency_statistics.eth_price_usd;

            var percentChangeWishEth = (newWishEthPrice - oldWishEthPrice) / oldWishEthPrice * 100;

            response.data.currency_statistics.wish_eth_percent_change_24h = Math.round(percentChangeWishEth * 100) / 100;
            response.data.currency_statistics.wish_price_usd = Math.round(response.data.currency_statistics.wish_price_usd * 100) / 100;
            response.data.currency_statistics.wish_price_eth = Math.round(response.data.currency_statistics.wish_price_eth * 100000) / 100000;

            $rootScope.networksKeys = {
                MAINNET: {
                    RSK: response.data['RSK_MAINNET'],
                    ETH: response.data['ETHEREUM_MAINNET']
                },
                TESTNET: {
                    RSK: response.data['RSK_TESTNET'],
                    ETH: response.data['ETHEREUM_ROPSTEN']
                }
            };
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

