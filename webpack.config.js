var path = require('path');

module.exports = (env, argv) => {
  let devtool = false;
  if (argv.mode === 'development') {
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
    	externals
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
    	externals
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
    	externals
	},
	{
		name: '3d-bundle',
		entry: './src/client/planner/3d/index.js',
		output: {
			path: path.resolve(__dirname, 'dist','js','planner'),
      		filename: '3d-bundle.js',
      		libraryTarget: 'umd',
      		globalObject: 'this'
		},
		module,
    	externals
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
    	externals
	}
  ]
};
