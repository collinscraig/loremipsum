'use strict';

var util = require('gulp-util');

module.exports = function(error) {
    this.emit('end');
    return util.log(util.colors.red.bold('Error' + (error.plugin ? ': ' + error.plugin : '')), '\n\n' + error.message + '\n');
};