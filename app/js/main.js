'use strict';
angular.module('Directives', []);
angular.module('Services', []);
angular.module('Filters', []);
angular.module('Constants', []);

var module = angular.module('app', ['Constants', 'ui.router', 'Directives', 'Services', 'Filters', 'templates']);

module.controller('baseController', function($scope, $rootScope, API_CONSTANTS, $http, $interval) {

    var networksList = ['MAINNET', 'TESTNET'];
    $rootScope.network = 'MAINNET';

    $rootScope.currencyStats = 'WISH';

    $interval(function() {
        var index = networksList.indexOf($rootScope.network);
        var nextIndex = index + 1;
        nextIndex = nextIndex >= networksList.length ? 0 : nextIndex;
        $rootScope.network = networksList[nextIndex];
    }, 7500);

    $interval(function() {
        $rootScope.currencyStats = ($rootScope.currencyStats === 'WISH' ? 'EOSISH' : 'WISH');
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


            response.data.currency_statistics.eosish_price_usd = Math.round(response.data.currency_statistics.eosish_price_usd * 10000) / 10000;
            // response.data.currency_statistics.eos_price_usd = Math.round(response.data.currency_statistics.eos_price_usd * 10000) / 10000;


            // console.log(response.data);
            $rootScope.networksKeys = {
                MAINNET: {
                    RSK: response.data['RSK_MAINNET'],
                    ETH: response.data['ETHEREUM_MAINNET'],
                    NEO: response.data['NEO_MAINNET'],
                    EOS: response.data['EOS_MAINNET']
                },
                TESTNET: {
                    RSK: response.data['RSK_TESTNET'],
                    ETH: response.data['ETHEREUM_ROPSTEN'],
                    NEO: response.data['NEO_TESTNET'],
                    EOS: response.data['EOS_TESTNET']
                }
            };
        });
    };
    $interval(updateStatistics, 30000);
    updateStatistics();
}).run(function() {

}).config(function($httpProvider, $qProvider, $compileProvider) {
    // $httpProvider.defaults.xsrfCookieName = 'csrftoken';
    // $httpProvider.defaults.xsrfHeaderName = 'X-CSRFToken';
    $httpProvider.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
    $qProvider.errorOnUnhandledRejections(false);
    $compileProvider.aHrefSanitizationWhitelist(/^\s*(mailto|otpauth|https?):/);
});

