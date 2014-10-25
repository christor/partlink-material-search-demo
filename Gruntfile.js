module.exports = function (grunt) {

// Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        uglify: {
            options: {
                banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
            },
            build: {
                src: '*.js,*.html,jquery',
                dest: 'build/<%= pkg.name %>.min.js'
            }
        },
        /*
         * Build a WAR (web archive) without Maven or the JVM installed.
         */
        war: {
            target: {
                options: {
                    war_dist_folder: 'build',
                    war_verbose: true,
                    war_name: '<%= pkg.name %>-<%= pkg.version %>',
                    webxml_welcome: 'index.html',
                    webxml_display_name: 'Partlink Material Search Demo',
                },
                files: [
                    {
                        expand: true,
                        cwd: '',
                        src: ['lookup.js','index.html','jquery/**'],
                        dest: ''
                    }
                ]
            }
        }
    });
    // Load the plugin that provides the "uglify" task.
//  grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-war');
    // Default task(s).
    grunt.registerTask('default', ['war']);
};
