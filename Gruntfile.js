module.exports = function (grunt) {

'use strict';

    // Show elapsed time after tasks run to visualize performance
    require('time-grunt')(grunt);
    // Load all Grunt tasks that are listed in package.json automatically
    require('load-grunt-tasks')(grunt);

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        //This is where tasks are defined and configured
        shell: {
            jekyllBuild: {
                command: 'jekyll build'
            },
            jekyllServe: {
                command: 'jekyll serve'
            }
        },

        // watch for files to change and run tasks when they do
        watch: {
            options: {
                    livereload: true
            },
            sass: {
                files: ['_sass/**/*.{scss,sass}'],
                tasks: ['sass']
            },
            imagemin: {
                files: ['_assets/images/**/*.{png,jpg,gif}'],
                tasks: ['newer:imagemin']
            }
        },

        // Setup Imagemin
        imagemin: {
            options: {
                optimizationLevel: 5,
            },
            dynamic: {
                files: [{
                    expand: true,
                    cwd: '_assets/images/',
                    src: ['**/*.{png,jpg,gif}'],
                    dest: '_site/assets'
                }]
            }
        },


        // sass (libsass) config
        sass: {
            options: {
                sourceMap: true,
                relativeAssets: false,
                outputStyle: 'expanded',
                sassDir: '_sass',
                cssDir: '_site/css'
            },
            build: {
                files: [{
                    expand: true,
                    cwd: '_sass/',
                    src: ['**/*.{scss,sass}'],
                    dest: '_site/css',
                    ext: '.css'
                }]
            }
        },
        cssmin: {
            target: {
                files: [{
                    expand: true,
                    cwd:'_site/css',
                    src: ['*.css', '!*.min.css'],
                    dest: '_site/css',
                    ext: '.min.css'
                }]
            }
        },

        // run tasks in parallel
        concurrent: {
            serve: [
                'watch',
                'shell:jekyllServe'
            ],
            options: {
                logConcurrentOutput: true
            }
        },

    });

    // Register the grunt serve task
    grunt.registerTask('serve', [
        'concurrent:serve'
    ]);

    // Register the grunt build task
    grunt.registerTask('build', [
        'shell:jekyllBuild',
        'sass',
        'cssmin',
        'imagemin'
    ]);

    // Register build as teh default task fallback
    grunt.registerTask('default', 'build');

};