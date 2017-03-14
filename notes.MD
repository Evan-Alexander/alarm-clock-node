

# Vocab:
flat file - what we've been writing our js in up to this point, on one file
Asset Pipeline - a organizational system in which files are prepared for the browser.  It will optimize and compile our project by completing the following tasks:
1. Taking multiple JS files and concatenating them (copy/paste them together into a single file)
2. Add features like checking our code for syntax errors when it concatenates, so that we're less likely to ship bugs.
# The pipeline can robustly manage external dependencies like JQuery

--BROWSER LIMITATIONS:
1. No way to access the filesystem.  This is a security feature of web browsers. Once we build a pipeline, it needs to access the filesystem to read all of our individual JS files, and to write a single concatenated file.
2. The browser includes a lot of things we don't need, like the DOM.  Ideally, we'd have a slightly different JS environment for our asset pipeline than the browser.

# Vocab:
RUNTIME ENVIRONMENT - Node.js - let's us run JS from the command line, gives us filesystem access, among others.

NODE MODULES - linking together seperate JS files.

-- FROM THE NINJA JS VIDEOS --

# Template String - `in JS 6 and above, when statements written in these 'back-ticks' you may include a function directly without needing to concatenate it.  Example:
The sum of the two numbers is ${a+b}`;

var counter = function(arr){
  return 'there are ' + arr.length + ' elements in this array';
};

var adder = function(a,b) {
  return `the sum of the 2 numbers is ${a+b}`;
};

var pi = 3.142;

module.exports.counter = counter;
module.exports.adder = adder;
module.exports.pi = pi;
module.exports = object
counter and adder are properties of the exports object
'= counter' and '= adder' are the variables containing the backend functions

- in his app:

var stuff = require('./stuff');

console.log(stuff.counter(['shaun', 'crystal', 'ryu']));
console.log(stuff.adder(5,6));
console.log(stuff.adder(stuff.pi, 5));

# By making stuff an object, we make counter a property of stuff and it will call that specific function while still being able to access the other functions on the page.

--REFACTORING functions in stuff.js --

module.exports.counter = function(arr){
  return 'there are ' + arr.length + ' elements in this array';
};

module.exports.adder = function(a,b) {
  return `the sum of the 2 numbers is ${a+b}`;
};

module.exports.pi = 3.142;

--OR--
#Use object literal notation:

module.exports = {
counter: counter;
adder: adder;
pi: pi;
};

--Npm-- 'Introducing Npm and Gulp'
# When starting a new project, run:
npm init
# This creates a manifest file - where npm stores a list of packages needed for the project, along with which versions are needed.  kinda works like a grocery list for your project by keeping track of all the third party packages it needs to run.

--GULP--
# A JS package that runs development tasks for us.
# Optimizes code and packages it up in a format the browser can understand.
# It is in charge of managing other npm packages that we will download later.
# Vocab:
Development dependency - only used in app development, not in production in the browser.
# By seperating out dependencies for development vs. production, the production app can be smaller and faster.

npm install gulp --save-dev

--BROWSERIFY--
# Browserify is responsible for translating "require" and "exports" keywords provided by Node to the browser.  Otherwise the browser doesn't recognize these keywords.

# Project breakdown:
1. When we start a new project, we run the $ npm init command.
2. Then, we download each package that our project needs using either the --save-dev flag for development dependencies or the --save flag for dependencies that are used in production. We actually won't be using npm for production dependencies in this class, but it's good to know what the flag means.
3. Commit the package.json file with the project (but make sure the node_modules/ folder is included in your .gitignore file.)
4. When we clone a project to continue working on it, we simply run $ npm install and all packages saved to the manifest file will be downloaded into a new node_modules/ folder.

--WRITING A GULP TASK--
1. create a gulp.js file in the parent project directory
2. place this at the top: var gulp = require('gulp'); --note: its standard practice for the variable name to be the same as the package name
3. below require, an example of a task:
gulp.task('myTask', function(){
  console.log('hello gulp');
});
# Notes - We are calling the task method defined in the gulp package to create a task.  The method takes two arguments:
1. a string representing the name of the task, - for later reference.
2. the function to run when we tell gulp to run this task.  in this case, the task just prints hello gulp to the console.
# Run command in the top level of your project directory.
# Remember to use JS lowerCamelCasing and place all require function calls at the top of the file so developers can see all dependencies at a glance.

#Vocab:
Callback function: a function which is executed at a particular time, such as after a particular event completes.  

--Gulp Task for pingpong--Build Folder--
# Note: it is untidy to keep automatically-generated production files in the same place as our development files.  The code below is how we seperate the project production version inside a 'build' directory.
gulp.task('jsBrowserify', function() {
  return browserify({ entries: ['./js/pingpong-interface.js'] })
    .bundle()
    .pipe(source('app.js'))
    .pipe(gulp.dest('./build/js'));
});
# Notes:
1. Call the Browserify function and tell it which files to browserify.  This is done by passing in an object with a key 'entries'. The corresponding value is an array of file names. We tell it to pull in our front-end file only.  The backend file was taken care of by the require keyword in our pingpong-interface file when we wrote: var Calculator = require('./../js/pingpong.js').calculatorModule;
2. We call bundle(), which is built into the Browserify package.
3. We tell it to create a new file called app.js and put it into a new folder, which will be called 'build'.  This folder will eventually hold other code, so we tell gulp to create a js folder inside of it to store our browserfied JS.

--Contatenation--
# Consolidating multiple JS files into one. - drastically reduces load time.
# npm install gulp-concat --save-dev
# When files are concatenated, they are stored into a temporary folder called 'tmp'.
# Globbing pattern uses the 'get all' asterisk (see below)
gulp.task('concatInterface', function() {
  return gulp.src(['./js/* -interface.js']) -> (disregard space between * and - for markdown purposes here)
  .pipe(concat('allConcat.js'))
  .pipe(gulp.dest('./tmp'));
});
# The * is shorthand for saying 'grab all the files ending in -interface.js and concatenate and browserify all of them'.
# Moving forward, this will set the program up to do this automatically.

--Minification--
# Speeds up the rate at which your browser processes your program by removing extra characters, spacing, ect. and places your code within one line

npm install-uglify --save-dev

# Add this to your gulpfile.js:

var uglify = require('gulp-uglify');

# Add this to app.js file:

gulp.task("minifyScripts", ["jsBrowserify"], function(){
  return gulp.src("./build/js/app.js")
    .pipe(uglify())
    .pipe(gulp.dest("./build/js"));
});

# by running gulp minifyScripts in the terminal: This function will enable us to run minifyScripts, which triggers jsBrowserify, which triggers concatInterface

--Build and Clean Tasks--
# By seperating tasks for development and production, we'll need to specify which one we're referencing.  -Environment variables- help us with this.

# To do so we need to install gulp-util:

npm install gulp-util --save-dev

# place this in your gulp.js file:
var buildProduction = utilities.env.production;

# Place at the end of all tasks
gulp.task("build", function(){
  if (buildProduction) {
    gulp.start('minifyScripts');
  } else {
    gulp.start('jsBrowserify');
  }
});

# now we can run:
gulp build --production

--Clean Tasks--
# To make sure we are using up to date versions of our files every time we build.  This also cleans up our environment before we make a build.

npm install del --save-dev

# Place inside of gulp.js file:

var del = require('del');

gulp.task("clean", function(){
  return del(['build', 'tmp']);
});

# We pass 'del' an array of paths to delete and it removes them.  Here, we're telling it to delete the entire build and tmp folders.  We'll put it right before the build task and call it automatically by making it a dependency of our build task.  Whether we're making a production or a development build, we will clean up first.

gulp.task("build", ['clean'], function(){
  if (buildProduction) {
    gulp.start('minifyScripts');
  } else {
    gulp.start('jsBrowserify');
  }
});

--JS-hint--
# the package, itself:
$ npm install jshint --save-dev

# Allows us to write a gulp task so it will automatically check code using linter
$ npm install gulp-jshint --save-dev

# To run:

gulp jshint
