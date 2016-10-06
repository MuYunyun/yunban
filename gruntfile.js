module.exports = function(grunt) {
	
	grunt.initConfig({
		watch: {
			jade: {
				files: ['views/**'],
				options: {
					livereload: true
				}
			},
			js: {
				files: ['public/js/**', 'models/**/*.js', 'schemas/**/*.js'],
				tasks: ['jshint'],
				options: {
					livereload: true
				}
			},
			uglify: {
				files: ['public/**/*.js'],
				tasks: ['jshint'],
				options: {
					livereload: true
				}
			},
			styles: {
				files: ['public/**/*.less'],
				tasks: ['less'],
				options: {
					nospawn: true
				}
			}
		},

		jshint: {
			options: {
				jshintrc: '.jshintrc',  //所依赖的文件
				ignores: ['public/libs/**/*.js']
			},
			all: ['public/js/*.js', 'test/**/*.js', 'app/**/*.js']
		},

		less: {
			development: {
				options: {
					compress: true,
					yuicompress: true, //用什么方式压缩
					optimization: 2    //压缩的程度
				},
				files: {
					'public/build/index.css': 'public/less/index.less'
				}
			}
		},

		uglify: {
			development: {  //开发环境去压缩
				files: {
					'public/build/admin.min.js': 'public/js/admin.js',
					'public/build/detail.min.js': [
						'public/js/detail.js'
					]
				}
			}
		},

		nodemon: {
			dev: {
				script:'app.js',
				options: {
					file: 'app.js',
					args: [],
					ignoredFiles: ['README.md', 'node_modules/**', '.DS_Store'],
					watchedExtensions: ['js'],
					watchedFolders: ['./'],
					debug: true,
					delayTime: 1,
					env: {
						PORT: 3000
					},
					cwd: __dirname
				}
			}
		},

		mochaTest: {
			options: {
				reporter: 'spec'
			},
			src: ['test/**/*.js'] //测试文件
		},

		concurrent: {
			tasks: ['nodemon', 'watch', 'less', 'uglify', 'jshint'],
			options: {
				logConcurrentOutput: true
			}
		} 
	})

	grunt.loadNpmTasks('grunt-contrib-watch')	//监听文件变动
	grunt.loadNpmTasks('grunt-nodemon') //监听入口文件
	grunt.loadNpmTasks('grunt-concurrent') //多任务之类不阻塞
	grunt.loadNpmTasks('grunt-mocha-test') //单元测试
	grunt.loadNpmTasks('grunt-contrib-less')//less的编译
	grunt.loadNpmTasks('grunt-contrib-uglify')//js的压缩
	grunt.loadNpmTasks('grunt-contrib-jshint')//对编程规范作约束
	
	grunt.option('force', true) //不会因为语法错误中断grunt

	grunt.registerTask('default', ['concurrent'])
	
	grunt.registerTask('test', ['mochaTest'])

}