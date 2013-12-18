module.exports = function(config) {
  config.set({
    // base path, that will be used to resolve files and exclude
    basePath: '',
 
 
    frameworks: ['jasmine'],
 
 
    // list of files / patterns to load in the browser
    files: [
      'source/Type.js',
      'source/Quest.js',
      'source/Action.js',
      'source/Scope.js',
      'source/Value.js',
      'source/*.js',
      'data/Properties.js',
      'data/Quests.js',
      'data/Resources.js',
      'data/Actions.js',
      'data/Creatures.js',
      'data/Items.js',
      'specs/*.js'
    ],
 
 
    // list of files to exclude
    exclude: [
      
    ],
 
 
    // test results reporter to use
    // possible values: 'dots', 'progress', 'junit'
    reporters: ['progress'],
 
 
    // web server port
    port: 9876,
 
 
    // cli runner port
    runnerPort: 9100,
 
 
    // enable / disable colors in the output (reporters and logs)
    colors: true,
 
 
    // level of logging
    // possible values: LOG_DISABLE || LOG_ERROR || LOG_WARN || LOG_INFO || LOG_DEBUG
    // logLevel: karma.LOG_INFO,
 
 
    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,
 
 
    // Start these browsers, currently available:
    // - Chrome
    // - ChromeCanary
    // - Firefox
    // - Opera
    // - Safari (only Mac)
    // - PhantomJS
    // - IE (only Windows)
    browsers: ['Chrome'/*, 'Safari', 'Firefox'*/],
 
 
    // If browser does not capture in given timeout [ms], kill it
    captureTimeout: 60000,
 
 
    // Continuous Integration mode
    // if true, it capture browsers, run tests and exit
    singleRun: false
 
  });
};