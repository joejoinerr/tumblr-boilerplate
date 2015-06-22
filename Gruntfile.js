module.exports = function(grunt) {

  // Create configuration
  grunt.initConfig({

    // Read packages
    pkg: grunt.file.readJSON("package.json"),

    // LibSass preprocessing
    sass: {
      options: {
        includePaths: ["bower_components"],
        precision: 5,
      },
      dev: {
        files: [{
          expand: true,
          cwd: "sass",
          src: ["**/*.scss"],
          dest: "css",
          ext: ".css"
        }],
        options: {
          outputStyle: "expanded",
          sourceMap: true
        }
      },
      dist: {
        files: [{
          expand: true,
          cwd: "sass",
          src: ["**/*.scss"],
          dest: "css",
          ext: ".min.css"
        }],
        options: {
          outputStyle: "compressed",
        }
      }
    },

    // Send CSS to HTML file
    htmlbuild: {
      dist: {
        src: "index.html",
        dest: "dist/",
      },
      options: {
        styles: {
          main: "css/*.min.css"
        }
      }
    },

    // Clean

    // CSS linting
    csslint: {
      lint: {
        options: {
          "import": 2,
          "box-model": false,
          "box-sizing": false,
          "unique-headings": false,
          "universal-selector": false
        },
        src: ["css/main.css"]
      }
    },

    // Start server
    connect: {
      server: {
        options: {
          livereload: true
        }
      }
    },

    // Watch and reload compiled stylesheets
    watch: {
      sass: {
        files: "sass/**/*.scss",
        tasks: ["sass:dev"],
      },
      livereload: {
        options: {
          livereload: true,
        },
        files: ["*.html", "css/**/*.css"]
      }
    }

  });

  // Load plugins
  grunt.loadNpmTasks("grunt-sass");
  grunt.loadNpmTasks("grunt-html-build");
  grunt.loadNpmTasks("grunt-contrib-csslint");
  grunt.loadNpmTasks("grunt-contrib-connect");
  grunt.loadNpmTasks("grunt-contrib-watch");

  // Run tasks
  grunt.registerTask("default", ["sass:dev", "connect", "watch"]);
  grunt.registerTask("build", ["sass:dev"]);
  grunt.registerTask("lint", ["sass:dev", "csslint"]);
  grunt.registerTask("dist", ["sass:dist", "htmlbuild"]);

};

