'use strict';

var $ = require('jquery');

var modules = [
    {
        name: 'accessible-nav',
        module: require('./modules/accessible-nav')
    },
    {
        name: 'help-tip',
        module: require('./modules/help-tip')
    },
    {
        name: 'expand-content',
        module: require('./modules/expand-content')
    },
    {
        name: 'scroll-to-target',
        module: require('./modules/scroll-to-target')
    },
    {
        name: 'scroll-to-top',
        module: require('./modules/scroll-to-top')
    }
];

(function initModules() {

    for (var i = 0; i < modules.length; i++) {
        var Module = modules[i].module;

        var moduleName = $('[data-behavior*="' + modules[i].name + '"]');

        if (moduleName.length > 0) {
            var context = $('[data-behavior*="' + modules[i].name + '"]');
            var module = new Module({
                context: context
            });
            module.init();
        }
    }
}());
