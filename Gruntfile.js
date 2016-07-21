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
                tasks: ['sass', 'autoprefixer', 'cssmin']
            },
            imagemin: {
                files: ['_assets/images/**/*.{png,jpg,gif}'],
                tasks: ['newer:imagemin']
            },
            html: {
                files: ['_includes/**/*.html', '_layouts/**/*.html', '_posts/**/*.{md,markdown}', '*.yml'],
                tasks: ['newer:shell:jekyllBuild']
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
                cssDir: 'dist/'
            },
            build: {
                files: [{
                    expand: true,
                    cwd: '_sass/',
                    src: ['**/*.{scss,sass}'],
                    dest: 'dist/',
                    ext: '.css'
                }]
            }
        },
        cssmin: {
            options: {
                keepSpecialComment: 0,
                advanced: true
            },
            target: {
                files: [{
                    expand: true,
                    cwd:'dist/',
                    src: ['**/*.css'],
                    dest: '_site/css/',
                    ext: '.min.css'
                }]
            }
        },
        autoprefixer: {
            options: {
                browsers: ['last 8 versions', 'ie 8', 'ie 9', '> 1%']
            },
            main: {
                expand: true,
                flatten: true,
                src: 'dist/*.css',
                dest: ''
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
        'autoprefixer',
        'cssmin',
        'newer:imagemin'
    ]);

    // Register build as teh default task fallback
    grunt.registerTask('default', 'build');

};