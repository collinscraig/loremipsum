'use strict';

var $ = require('jquery');

/**
 * Reveals help tip content when trigger is pressed.
 * @param  { Object - options - contains an object of config for the module, normally this is just the context in which the module has been called }
 * @return { Object - revealing module pattern object containing the returned functions/objects }
 */
module.exports = function(options) {
    var context = $(options.context);

    /**
     * init function called by app.js
     */
    function init() {

        $.each(context, function() {

            var $this = $(this);

            var triggerBtn = $this.find('[data-binding="help-tip-trigger"]');

            var doWrapper = function($module) {
                $module.hasClass('is-open') ? $module.removeClass('is-open') : $module.addClass('is-open');
            };

            /**
             * Attach all the event listeners
             */
            function bindEventListeners($module) {

                triggerBtn.on('click', $module, function(e) {
                    e.preventDefault();
                    doWrapper($module);
                });
            }

            bindEventListeners($this);
        });
    }

    return {
        init: init
    };
};
