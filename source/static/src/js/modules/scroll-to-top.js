'use strict';

var $ = require('jquery');

/**
 * scrolls to the top of the page on trigger click
 * @param  { Object - options - contains an object of config for the module, normally this is just the context in which the module has been called }
 * @return { Object - revealing module pattern object containing the returned functions/objects }
 */
module.exports = function (options) {
    // get the context for the current instance of the module
    var context = options.context;

    // scroll to top
    function scrollToTop() {
        $('html, body').animate({ scrollTop: 0 }, 800);
    }

    /**
     * Attach all the event listeners
     */
    function bindEventListeners() {
        context.on('click', function (e) {
            e.preventDefault();
            scrollToTop(e);
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
