module.exports = function(grunt) {
    // Create configuration
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        cssmin: {
            minify: {
                expand: true,
                cwd: 'css/',
                src: '*.css',
                dest: '.tmp/',
                ext: '.min.css'
            }
        },
        htmlbuild: {
            dist: {
                src: 'index.html',
                dest: 'Build/',
            },
            options: {
                styles: {
                    main: '.tmp/*.min.css'
                }
            }
        },
        clean: [ '.tmp/' ]
    });

    // Register the plugins
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-html-build');
    grunt.loadNpmTasks('grunt-contrib-clean');

    // Run the task
    grunt.registerTask('default', ['cssmin', 'htmlbuild', 'clean']);
}
