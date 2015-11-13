require.config({
    shim: {
        amplify: {
            deps: ["jquery"],
            exports: 'amplify'
        },
        d3: {
            exports: 'd3'
        },
        lodash: {
            exports: '_'
        },

        'mocha': {
            init: function () {
                this.mocha.setup('bdd');
                return this.mocha;
            }
        }

    },
    paths: {
        'jquery': 'libs/jquery',
        'd3': 'libs/d3', // d3.v2.custom  // !!!!! This has been modified to create a custom force layout (Greg)    
        'amplify': 'libs/amplify',
        'lodash': 'libs/lodash',

        ////requirejs plugin
        //'depend': '../libs/requirejs-plugins/depend',
        //'text': '../libs/requirejs-plugins/text',
        //'css': '../libs/requirejs-plugins/css/css',
        //'css-builder': '../libs/requirejs-plugins/css/css-builder',
        //'normalize': '../libs/requirejs-plugins/css/normalize',
        //'moment': '../libs/moment',

    },
    waitSeconds: 10000
});


define([
    'src/GameBoard',
    'jquery',
    'd3',
    'lodash',
    'amplify'],
  function (GameBoard) {

      GameBoard.init();
  });

