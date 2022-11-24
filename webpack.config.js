var path = require('path');
const { exec } = require('child_process');
const buildScript = path.join(__dirname, 'build.sh');

const copyPlugin = {
	apply: (compiler) => {
		compiler.hooks.afterEmit.tap('AfterEmitPlugin', (compilation) => {
			exec(buildScript, (err, stdout, stderr) => {
				if (stdout) process.stdout.write(stdout);
				if (stderr) process.stderr.write(stderr);
			});
		});
	}
};


module.exports = (env, argv) => {
  let devtool = false;
  if (argv.mode === 'development') {
	env.dev = true;
    devtool = 'inline-source-map';
  }
  console.log(`${argv.mode} build`);
  const externals = {
    aframe: {
      commonjs: 'aframe',
      commonjs2: 'aframe',
      amd: 'aframe',
      root: 'AFRAME' // indicates global variable
    },
	leaflet: {
		commonjs: 'leaflet',
		commonjs2: 'leaflet',
		amd: 'leaflet',
		root: 'L'
	},
  };
  const module = {
    rules: [
		{
		  test: /\.worker\.js$/,
		  use: {
			loader: 'worker-loader',
			options: {
			  inline: 'no-fallback'
			}
		  }
		}
	  ]
  };
  const plugins = [
	copyPlugin
  ];

  return [
	{
		name: 'ar-bundle',
		entry: './src/client/ar/index.js',
		output: {
			path: path.resolve(__dirname, 'dist','js','ar'),
      		filename: 'ar-bundle.js',
      		libraryTarget: 'umd',
      		globalObject: 'this'
		},
		module,
    	externals,
		plugins
	},
	{
		name: 'map-bundle',
		entry: './src/client/map/index.js',
		output: {
			path: path.resolve(__dirname, 'dist','js','map'),
      		filename: 'map-bundle.js',
      		libraryTarget: 'umd',
      		globalObject: 'this'
		},
		module,
    	externals,
		plugins
	},
	{
		name: 'qr-bundle',
		entry: './src/client/qr/index.js',
		output: {
			path: path.resolve(__dirname, 'dist','js','qr'),
      		filename: 'qr-bundle.js',
      		libraryTarget: 'umd',
      		globalObject: 'this'
		},
		module,
    	externals,
		plugins
	},
	{
		name: 'planner-bundle',
		entry: './src/client/planner/index.js',
		output: {
			path: path.resolve(__dirname, 'dist','js','planner'),
      		filename: 'planner-bundle.js',
      		libraryTarget: 'umd',
      		globalObject: 'this'
		},
		module,
    	externals,
		plugins
	},
	{
		name: 'show-bundle',
		entry: './src/client/planner/show.js',
		output: {
			path: path.resolve(__dirname, 'dist','js','planner'),
      		filename: 'show-bundle.js',
      		libraryTarget: 'umd',
      		globalObject: 'this'
		},
		module,
    	externals,
		plugins
	}
  ]
};
