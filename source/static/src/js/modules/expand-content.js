'use strict';

var $ = require('jquery');

/**
 * Reveals a block of content on trigger click by switching a class on the module context
 * @param  { Object - options - contains an object of config for the module, normally this is just the context in which the module has been called }
 * @return { Object - revealing module pattern object containing the returned functions/objects }
 */
module.exports = function(options) {
    var context = $(options.context);

    var expandedClass = 'is-open';
    var collapsedClass = 'is-closed';

    /**
     * init function called by app.js
     */
    function init() {

        $.each(context, function() {

            var $this = $(this);
            var triggerBtn = $this.find('[data-binding="expand-content-trigger"]');

            var toggleClasses = function($module) {
                if ($module.hasClass(collapsedClass)) {
                    $module.removeClass(collapsedClass).addClass(expandedClass);
                } else {
                    $module.removeClass(expandedClass).addClass(collapsedClass);
                }
            };

            /**
             * Attach all the event listeners
             */
            function bindEventListeners($module) {

                triggerBtn.on('click', $module, function(e) {
                    e.preventDefault();
                    toggleClasses($module);
                });
            }

            bindEventListeners($this);
        });
    }

    return {
        init: init
    };
};
