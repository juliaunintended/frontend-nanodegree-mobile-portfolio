'use strict';

const ngrok = require('ngrok');
const browserSync = require('browser-sync');

module.exports = function(grunt) {

    require('load-grunt-tasks')(grunt);

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        pagespeed: {
            options: {
                nokey: true,
                locale: 'en_GB'
            },
            local: {
                options: {
                    strategy: 'desktop'
                }
            },
            mobile: {
                options: {
                    strategy: 'mobile'
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-browser-sync');

    grunt.registerTask('bs-init', function() {
        var done = this.async();
        browserSync({
            timestamps: false,
            open: false,
            ui: false,
            server: {
                baseDir: './'
            }
        }, function(err, bs) {
            done();
        });
    });

    grunt.registerTask('psi-ngrok', 'Run pagespeed with ngrok', function() {
        var done = this.async();
        var port = 3000;
        ngrok.connect(port, function(err, url) {
            if (err !== null) {
                grunt.fail.fatal(err);
                return done();
            }
            grunt.config.set('pagespeed.options.url', url);
            console.log('running tunnel on: ', url);
            grunt.task.run('pagespeed');
            done();
        });
    });

    grunt.registerTask('ngrok', function() {
        var done = this.async();
        var port = 3000;
        ngrok.connect(port, function(err, url) {
            if (err !== null) {
                grunt.fail.fatal(err);
            }
            console.log('running tunnel on: ', url);
        });
    });

    grunt.registerTask('default', ['bs-init', 'psi-ngrok']);
    grunt.registerTask('serve', ['bs-init', 'ngrok']);

};
