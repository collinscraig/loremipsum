![Browserify logo](http://browserify.org/images/browserify.png)

#Browserify
(Dramatic pause)

##What on earth does that word even mean?
Excellent question! **Browserify** is a dependency managing module loader library based on the CommonJS pattern. This is the same system that Node uses for modularising all it's code. It's extremely clever at finding your dependencies and making stuff work but I have little knowledge of the underlying tech so for more info on CommonJS check out the spec [here](http://wiki.commonjs.org/wiki/CommonJS).

##Cool story bro, why is this better than RequireJS?
Another excellent question! RequireJS is very good at loading only the scripts that are needed for a certain section of a page to work. Like Browserify, Require can also publish to one file but you get a more overhead from having to include require itself in the compiled file. Browserify also benefits from much better error logging, a smaller learning curve and some excellent online documentation.

##Intriguing, so how is Browserify different?
**Browserify** is designed to scan through all your files, work out the dependencies and then bundle them into one lovely neat file. You can even include vendor libraries in this if you are feeling so inclined. It also has the ability to use npm modules in the browser, lots of front end libraries are already on there but a couple of examples would be jquery, lodash, backbone and angular. Which means adding a javascript library to your project is as simple as running ```npm install lodash --save-dev```. Magic.

## Sold! Gimme the syntax.
Here we go...

First let's create a small module that has only one job to do, in this case return the result of multiplying two numbers together. I am going to call that file ```mulitply.js``` and for the sake of this example assume that it is stored in the root of my scripts folder e.g. ```Satic/src/script/.```


```javascript
//multiply.js

module.exports = function(a, b) {
	return a * b;
}
```

Then in my main js file, in this case called ```app.js``` I simply 'require' the module I want to use and do obknoxious stuff like alert the value of 10 times 10...

```javascript
//app.js

var multiply = require('./multiply');

alert( multiply(10, 10) );
```

Although this is way more trivial than anything that we would probably end up using **Browserify** for, the key concepts here are really important. If you have a function that has one purpose, create a module for it. It would be great if we could create a whole bunch of reuseable modules in this base build.

##Lovely jubbley, but what about real projects?
And now we get to the meaty bit. The boilerplate is set up in the same way as any 'real' live project would be. Structure should like this...

    |--scripts
        | |-- libs
        | |-- modules
        | |-- plugins
        app.js

Included in this repo is jquery downloaded from npm. It is version 1.11 so it is compatible out of the box with IE8. Inside the main app.js file you should see the following:

```javascript
'use strict';
var $ = require('jquery');
var ExampleModule = require('./modules/example-module');

$(function() {

    if ( $('[data-behavior="example-module"]').length > 0 ) {

        var exampleModule = new ExampleModule({

            context: $('[data-behavior="example-module"]')

        });

        exampleModule.init();
    }

});
```

Let's run throught this line by line

```javascript
'use strict';
```

This is mandatory and sets the JS engine to strict mode, JSHint will moan if you don't include so be sure to appease the JS man.

```javascript
var $ = require('./libs/jquery');
```
Next we ```require``` jquery and assign it to the ```$``` variable. This means that we can now use jquery as expected but without having to assume that it is loaded, **Browserify** will make sure that jquery is loaded when it is needed, making the world a happier place!

###GOTCHA ALERT
You need to make sure you use the ```./``` in the path, otherwise **Browserify** will start looking for your module inside node_modules. To quote the spec...

> A module prefixed with '/' is an absolute path to the file. For example, require('/home/marco/foo.js') will load the file at  /home/marco/foo.js.

> A module prefixed with './' is relative to the file calling require(). That is, circle.js must be in the same directory as foo.js for  require('./circle') to find it.

> Without a leading '/' or './' to indicate a file, the module is either a "core module" or is loaded from a node_modules folder.

> If the given path does not exist, require() will throw an Error with its code property set to 'MODULE_NOT_FOUND'.

```javascript
var ExampleModule = require('./modules/example-module');
```
Pretty much the same as the above but this time we are loading a module that I have created, for now let's not worry about what that module does and look at what we do next in the app file.

```javscript
if ( $('[data-behavior="example-module"]').length > 0 ) {

   var exampleModule = new ExampleModule({

       context: $('[data-behavior="example-module"]')

   });

   exampleModule.init();
}
```
I'm going to ignore the jquery document ready for brevity. What I have done here is extrapolated (love that word) an idea from the ```behaviors``` pattern, sometimes used in the RequireJS version of the boilerplate, and used it to check what code should run. Classes and ids will work, but are discouraged in the interests of separation of concerns. So once we have confirmed that the element this script is bound to exists we run the constructor for ```ExampleModule``` and store it in the ```exampleModule``` variable. You can also see we are passing in some options to the constructor, I will explain how this functions when we go through ```example-module``` in detail. Final step is to run the ```init``` function. Hallelujah.

So what is going on inside the module itself...

```javascript
'use strict';

module.exports = function(options) {

    var context = options.context;

    function init() {
        console.log('example module init\'d');
        console.log(context);

        context.on('click', function(e) {
            e.preventDefault();
            alert('click!');
        });
    }

    return {
        init: init
    }
};
```
This bad boy is set up in revealing module pattern (More info on the pattern [here](http://addyosmani.com/resources/essentialjsdesignpatterns/book/#revealingmodulepatternjavascript).) which is a jazzy way of saying I keep everything inside a module private (scoped to the function) and only return things which the outside world needs to see. In this case just the ```init``` function. You can see that I handle the options that are passed in (in this case just ```context```), if you had more, this would be the place to deal with them. Then I assign a click listener and Bob is my uncle, javascript nirvana.

More resources:

https://toddmotto.com/the-data-js-api-for-behavioural-binding-stop-using-selectors-in-your-javascript/
