    'use strict';

    module.exports = function(grunt) {

      grunt.initConfig({
        bowercopy: {
          options: {
            clean: false,
            //srcPrefix: 'bower_components'
            destPrefix: 'vendor'
          },


          'jquery-file-upload': {
            options: {
            },
            files: {
              'blueimp/tmpl': 'blueimp-tmpl/js/tmpl*.js',
              'blueimp/canvas-to-blob': 'blueimp-canvas-to-blob/js/*',
              'blueimp/loadimage': 'blueimp-load-image/js/*',

              'blueimp/gallery/js/': 'blueimp-gallery/js/*',              
              'blueimp/gallery/img/': 'blueimp-gallery/img/*',              
              'blueimp/gallery/css/': 'blueimp-gallery/css/*',                            

              'blueimp/jquery-file-upload/js/': 'jquery-file-upload/js/*',
              'blueimp/jquery-file-upload/img/': 'jquery-file-upload/img/*',              
              'blueimp/jquery-file-upload/css/': 'jquery-file-upload/css/*',   
            },
          },          

          'closure-library': {
            options: {
            },
            files: {
              'closure/closure': 'closure-library/closure/*',
              'closure/third_party': 'closure-library/third_party/*',
            },
          },

          'limejs': {
            options: {
            },
            files: {
              'lime/css': 'limejs/lime/css/*',
              'lime/src': 'limejs/lime/src/*',
            },
          },


          'box2d': {
            options: {
            },
            files: {
              'box2d/src': 'box2d/src/*',
            },
          },


          'jquery': {
            options: {
            },
            files: {
              'jquery': 'jquery/jquery*.js'
            },
          },

          'bootstrap': {
            options: {
            },
            files: {
              'bootstrap': 'bootstrap/dist/*'
            },

          },



        },
        
        shell: {
          deps: {
            options: {
              stdout: true
            },
              command: 'python "./vendor/closure/closure/bin/build/depswriter.py" --root_with_prefix="./vendor/closure/  ../../" --root_with_prefix="./js/  ../../../../js" --root_with_prefix="./assets/  ../../../../assets" --root_with_prefix="./vendor/lime/  ../../../lime/" --root_with_prefix="./vendor/box2d/src/ ../../../box2d/src/" --output_file="./vendor/closure/closure/goog/deps.js"' 
          }
        }

      }

   );

      grunt.loadNpmTasks('grunt-bowercopy');
      grunt.loadNpmTasks('grunt-shell');
      // Alias bower to bowercopy
      grunt.registerTask("bower", "bowercopy");

      // Default task(s).
      grunt.registerTask('default', ['bower','shell:deps']);

    };