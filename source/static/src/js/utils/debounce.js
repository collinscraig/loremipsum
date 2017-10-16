/**
 * @module debounce
 * @param {function} func the function to be debounced
 * @param {int} wait the time to wait after event has stopped firing
 * @param {boolean} immediate whether to run the function immediately or wait for the timeout
 */

'use strict';

module.exports = function(func, wait, immediate) {
    // create var to store the timeout in
    var timeout;
    
    // function to be returned
    return function() {
        // ensure context is scoped correctly and store arguments to passed the the function being debounced
        var context = this;
        var args = arguments;
        // clear the timeout to prevent the timeout firing if the function is called again
        clearTimeout(timeout);
        // reassign timeout to a new Timeout
        timeout = setTimeout(function() {
            timeout = null;
            // check the immediate param is false then call the function using the context and it's arguments
            if (!immediate) {
                func.apply(context, args);
            }
        }, wait);
        // if immediate is true call the funciton immediately without the timeout
        if (immediate && !timeout) {
            func.apply(context, args);
        }
    };
};