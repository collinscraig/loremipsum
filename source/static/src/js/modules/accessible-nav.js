'use strict';

var $ = require('jquery');

/**
 * Adds focus listeners to ensure a user can tab through the navigation
 * @param  { Object - options - contains an object of config for the module, normally this is just the context in which the module has been called }
 * @return { Object - revealing module pattern object containing the returned functions/objects }
 */
module.exports = function(options) {
    var context = options.context;

    /**
     * Attach all the event listeners
     */
    function bindEventListeners() {
        // top level links
        var mainNavLinks = context.find('.main-navigation__link');
        // sub nav links
        var subNavLinks = context.find('.sub-nav__link');

        // listen for focus on the main nav link
        mainNavLinks.on('focus', function() {
            // clear hover class from all top level nav items to make sure only current item is highlighted
            mainNavLinks.removeClass('hover');
        });

        // listen for focus on sub nav link
        subNavLinks.on('focus', function() {
            // find the top nav link for this sub nav link and give it a hover class
            $(this).parents('.sub-nav').siblings('.main-navigation__link').addClass('hover');
        });

    }

    /**
     * init function called by app.js
     */
    function init() {
        bindEventListeners();
    }

    return {
        init: init
    };
};
