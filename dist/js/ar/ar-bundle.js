/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("aframe"));
	else if(typeof define === 'function' && define.amd)
		define(["aframe"], factory);
	else {
		var a = typeof exports === 'object' ? factory(require("aframe")) : factory(root["AFRAME"]);
		for(var i in a) (typeof exports === 'object' ? exports : root)[i] = a[i];
	}
})(this, (__WEBPACK_EXTERNAL_MODULE_aframe__) => {
return /******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./src/client/ar/geoJSONEntity.js":
/*!****************************************!*\
  !*** ./src/client/ar/geoJSONEntity.js ***!
  \****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var aframe__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! aframe */ \"aframe\");\n/* harmony import */ var aframe__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(aframe__WEBPACK_IMPORTED_MODULE_0__);\n\n\nclass GeoJSONError extends Error {\n\tconstructor(message, geojson) {\n\t\tconst props = {\n\t\t\tgeojson: geojson,\n\t\t};\n\t\tsuper(message, props);\n\t\tthis.name = 'GeoJSONError';\n\t}\n}\n\nfunction validateGeoJSONFeature(feature) {\n\tif(!feature.hasOwnProperty('type') \n\t\t|| !feature.hasOwnProperty('geometry') \n\t\t|| !feature.hasOwnProperty('properties')\n\t\t|| !feature.geometry.hasOwnProperty('coordinates')\n\t\t)\n\t\tthrow new GeoJSONError('Invalid GeoJSON Feature', feature);\n}\n\nfunction GeoJSONEntity(feature, projected, primitive, scale, color, position) {\n\tvalidateGeoJSONFeature(feature);\n\n\tif(feature.geometry.type !== 'Point')\n\t\tthrow new GeoJSONError('Only Point geometry is supported', feature);\n\t\n\tconst [ lat, lng ] = feature.geometry.coordinates;\n\tconst _scale = feature.properties.scale || scale || 1;\n\tconst _position = feature.properties.position || position || {x: 0, y: 0, z: 0};\n\tconst _color = feature.properties.color || color || 'blue';\n\tconst _primitive = feature.properties.primitive || primitive || 'a-cone';\n\tconst _projected = projected || '';\n\n\tconst entity = document.createElement('a-entity');\n\tentity.setAttribute('look-at', '[gps'+ _projected +'-camera]');\n    entity.setAttribute('gps'+ _projected +'-entity-place', {latitude: lat, longitude: lng});\n    entity.setAttribute('position', _position);\n\t\n\tif(feature.properties.name) {\n\t\tconst textScale = _scale * 10;\n\t\tconst text = document.createElement('a-text');\n\t\ttext.setAttribute('value', feature.properties.name);\n\t\ttext.setAttribute('scale', {x: textScale, y: textScale, z: textScale});\n\t\ttext.setAttribute('align', 'center');\n\t\ttext.setAttribute('position', {x: 0, y: textScale/5, z: 0});\n\t\tentity.appendChild(text);\n\t}\n\t\n\tconst prim = document.createElement(_primitive);\n\tprim.setAttribute('scale', {x: _scale, y: _scale, z: _scale});\n\tprim.setAttribute('material', {color: _color});\n\tif(_primitive === 'a-cone') {\n\t\tprim.setAttribute('radius-bottom', 0.1);\n\t\tprim.setAttribute('radius-top', 0.75);\n\t\tprim.setAttribute('height', 2);\n\t}\n    entity.appendChild(prim);\n    \n    return entity;\n}\n\naframe__WEBPACK_IMPORTED_MODULE_0__.registerComponent('geojson-entity', {\n    schema: {\n        url: {\n            type: 'string',\n\t\t\tdefault: ''\n        },\n\t\tprimitive: {\n\t\t\ttype: 'string',\n\t\t\tdefault: 'a-cone'\n\t\t},\n        scale: {\n            type: 'number',\n            default: 10\n        },\n\t\tcolor: {\n\t\t\ttype: 'string',\n\t\t\tdefault: 'blue'\n\t\t},\n\t\tupdateVisibility: {\n\t\t\ttype: 'boolean',\n\t\t\tdefault: false\n\t\t}\n    },\n    multiple: true,\n    init: function() {\t\t\n\t\tconst camera = document.querySelector('a-camera');\n\t\tif(camera.getAttribute('gps-projected-camera'))\n\t\t\tthis.projected = '-projected';\n\t\telse if(camera.getAttribute('gps-new-camera'))\n\t\t\tthis.projected = '-new';\n\n\t\twindow.addEventListener('gps-camera-update-position', e => {\n\t\t\tthis.el.setAttribute('terrarium-dem', {\n\t\t\t\tlat: e.detail.position.latitude,\n\t\t\t\tlon: e.detail.position.longitude \n\t\t\t})\n\t\t});\n\n\t\tthis.el.addEventListener('elevation-available', e => {\n            const position = camera.getAttribute('position');\n            position.y = e.detail.elevation + 1.6;\n            camera.setAttribute('position', position);\n        });\n\n\t\tthis.el.addEventListener('osm-data-loaded', e => {\n            console.log(e.detail);\n\t\t\t//this.geoJSONEntities.forEach(entity => entity.setAttribute('position', true));\n\t\t});\n\n\t},\n\tupdate: function() {\n\t\tthis.loader = document.createElement('div');\n    \tthis.loader.classList.add('ar-loader');\n    \tdocument.body.appendChild(this.loader);\n\n\t\tif(this.geoJSONEntities?.length > 0)\n\t\t\tthis.geoJSONEntities.forEach(entity => this.el.sceneEl.removeChild(entity));\n\n\t\tthis.geoJSONEntities = [];\n\t\tthis.i = 0;\n\t\tconst data = this.data;\n\n       \ttry {\n\t\t\twindow.dispatchEvent(new Event('geojson-load-start'));\n\n\t\t\tfetch(data.url).then(res => res.json()).then(json => {\n\t\t\t\tif(typeof json !== 'object' || Array.isArray(json) || json === null)\n\t\t\t\t\tthrow new GeoJSONError('Invalid GeoJSON', json);\n\n\t\t\t\tif(json.type === 'FeatureCollection') {\n               \t\tjson.features.forEach(item => {\n\t\t\t\t\t\ttry {\n\t\t\t\t\t\t\tconst entity = GeoJSONEntity(item, this.projected, data.primitive, data.scale, data.color);\n\t\t\t\t\t\t\tthis.geoJSONEntities.push(entity);\n                   \t\t\tthis.el.sceneEl.appendChild(entity);\n\t\t\t\t\t\t} catch(e) { console.warn(e); }\n\n\t\t\t\t\t\twindow.dispatchEvent(new CustomEvent('geojson-load-progress', { \n\t\t\t\t\t\t\tprogress: ++this.i / this.geoJSONEntities.length\n\t\t\t\t\t\t}));\n               \t\t});\n\t\t\t\t}\n\t\t\t\telse {\n\t\t\t\t\ttry {\n\t\t\t\t\t\tconst entity = GeoJSONEntity(json, this.projected, data.primitive, data.scale, data.color);\n\t\t\t\t\t\tthis.geoJSONEntities.push(entity);\n\t\t\t\t\t\tthis.el.sceneEl.appendChild(entity);\n\t\t\t\t\t} catch(e) { console.warn(e); }\n\t\t\t\t}\n\n\t\t\t\tif(this.geoJSONEntities.length < 1)\n\t\t\t\t\tthrow new GeoJSONError('No valid features in GeoJSON', undefined);\n\t\t\t\n            });\n        } catch(err) { console.trace(err); }\n\n\t\tif(data.updateVisibility)\n\t\t\tthis.el.addEventListener('gps-camera-update-position', this.visibilityHandler);\n\n\t\twindow.dispatchEvent(new CustomEvent('geojson-load-end', { geojson: this.geoJSONEntities }));\n\t\tthis.loader.remove();\n    },\n\tremove: function() {\n\t\tif(data.updateVisibility)\n\t\t\tthis.el.removeEventListener('gps-camera-update-position', this.visibilityHandler);\n\n\t\tthis.geoJSONEntities.forEach(entity => this.el.sceneEl.removeChild(entity));\n\t},\n\tvisibilityHandler: function(e) {\n\t\te.target.getAttribute('distance') > 100 ?\n\t\t\te.target.setAttribute('visible', false)\n\t\t\t: e.target.setAttribute('visible', true);\n\t}\n});\n\n\n//# sourceURL=webpack://fhmap/./src/client/ar/geoJSONEntity.js?");

/***/ }),

/***/ "./src/client/ar/index.js":
/*!********************************!*\
  !*** ./src/client/ar/index.js ***!
  \********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _geoJSONEntity__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./geoJSONEntity */ \"./src/client/ar/geoJSONEntity.js\");\n/* harmony import */ var _urlLocationEntity__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./urlLocationEntity */ \"./src/client/ar/urlLocationEntity.js\");\n/* harmony import */ var _pathEntity__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./pathEntity */ \"./src/client/ar/pathEntity.js\");\n\n\n\n\n\n//# sourceURL=webpack://fhmap/./src/client/ar/index.js?");

/***/ }),

/***/ "./src/client/ar/pathEntity.js":
/*!*************************************!*\
  !*** ./src/client/ar/pathEntity.js ***!
  \*************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var aframe__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! aframe */ \"aframe\");\n/* harmony import */ var aframe__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(aframe__WEBPACK_IMPORTED_MODULE_0__);\n\n\naframe__WEBPACK_IMPORTED_MODULE_0__.registerComponent('path-entity', {\n\tschema: {\n\t\turl: {\n\t\t\ttype: 'string',\n\t\t\tdefault: ''\n\t\t},\n\t\tcolor: {\n\t\t\ttype: 'string',\n\t\t\tdefault: 'green'\n\t\t}\n\t},\n\tdependencies: ['gps-projected-camera'],\n\tmultiple: true,\n\tinit: function() {\n\t\tthis.projected = '';\n\n\t\tthis.loader = document.createElement('div');\n    \tthis.loader.classList.add('ar-loader');\n    \tdocument.body.appendChild(this.loader);\n\n\t\tconst camera = document.querySelector('a-camera');\n\t\tif(camera.getAttribute('gps-projected-camera'))\n\t\t\tthis.projected = '-projected';\n\t\telse if(camera.getAttribute('gps-new-camera'))\n\t\t\tthis.projected = '-new';\n\n\n\t\tthis.camera = camera.components[`gps${this.projected}-camera`];\n\n\t\twindow.addEventListener('gps-camera-origin-coord-set', this.create.bind(this));\n\t},\n\tupdate: function() {\n\t\tthis.create();\n\t},\n\tcreate: function() {\n\t\tthis.pathEntities?.length > 0 && this.pathEntities.forEach(pathEntity => pathEntity.remove());\n\t\tthis.pathEntities = [];\n\t\tthis.i = 1;\n\t\ttry {\n\t\t\tfetch(this.data.url).then(res => res.json()).then(json => {\n\t\t\t\tif(typeof json !== 'object' || Array.isArray(json) || json === null)\n\t\t\t\t\tthrow new Error('Invalid GeoJSON');\n\t\t\t\t\n\t\t\t\tif(json.type === 'FeatureCollection') {\n\t\t\t\t\tjson.features.forEach(item => {\t\n\t\t\t\t\t\ttry {\n\t\t\t\t\t\t\tconst entity = this._createPathEntity(item, this.data.color);\n\t\t\t\t\t\t\tthis.pathEntities.push(entity);\n\t\t\t\t\t\t\tthis.el.sceneEl.appendChild(entity);\n\t\t\t\t\t\t} catch(e) { console.warn(e); }\n\t\t\t\t\t});\n\n\t\t\t\t\twindow.dispatchEvent(new CustomEvent('geojson-load-progress', { \n\t\t\t\t\t\tprogress: this.i++ / this.pathEntities.length\n\t\t\t\t\t}));\n\t\t\t\t}\n\t\t\t\telse {\n\t\t\t\t\ttry {\n\t\t\t\t\t\tconst entity = this._createPathEntity(json, this.data.color);\n\t\t\t\t\t\tthis.pathEntities.push(entity);\n\t\t\t\t\t\tthis.el.sceneEl.appendChild(entity);\n\t\t\t\t\t} catch(e) { console.warn(e); }\n\t\t\t\t}\n\n\t\t\t\tif(this.pathEntities.length < 1)\n\t\t\t\t\tthrow new Error('No valid features in GeoJSON');\n\n\t\t\t});\n\t\t} catch(e) { console.trace(e); }\n\n\t\twindow.dispatchEvent(new CustomEvent('geojson-load-end', { path: this.pathEntities }));\n\t\tthis.loader.remove();\n\t},\n\t_createPathEntity: function(feature, color) {\n\t\tconst _color = feature.properties.color || color || 'blue';\n\t\tthis.rendererSystem = this.el.sceneEl.systems.renderer;\n\t\n\t\tif(feature.geometry.type !== 'LineString') \n\t\t\tthrow new Error('PathEntity only supports LineString geometries');\n\t\n\t\tif(feature.geometry.coordinates.length < 2) \n\t\t\tthrow new Error('PathEntity requires at least two coordinates');\n\t\n\t\tconst path = document.createElement('a-entity');\n\t\tconst material = new THREE.LineBasicMaterial({\n\t\t\tcolor: new THREE.Color(0x00ff00),\n\t\t\tlinewidth: 10,\n\t\t});\n\t\t\n\t\tlet points = [];\n\t\tfor(let i = 0; i < feature.geometry.coordinates.length - 1; i++) {\n\t\t\tconst [ startLat, startLng ] = feature.geometry.coordinates[i];\n\t\t\tconst [ endLat, endLng ] = feature.geometry.coordinates[i+1];\n\t\t\tconst startPos = this.camera.latLonToWorld(startLat, startLng);\n\t\t\tconst endPos = this.camera.latLonToWorld(endLat, endLng);\n\t\t\tpoints.push(new THREE.Vector3(startPos[0], 0.3, startPos[1]));\n\t\t\tpoints.push(new THREE.Vector3(endPos[0], 0.3, endPos[1]));\n\n\t\t\tconst id = `line__${feature.properties.name.toLowerCase()}${i}`;\n\t\t\t/*path.setAttribute(id, {\n\t\t\t\tstart: {x: startPos[0], y: 0, z: startPos[1]},\n\t\t\t\tend: {x: endPos[0], y: 0, z: endPos[1]},\n\t\t\t\tcolor: _color\n\t\t\t});*/\n\t\t}\n\t\t\n\t\tconst geometry = new THREE.BufferGeometry().setFromPoints(points);\n\t\tpath.setObject3D(feature.properties.name, new THREE.Line(geometry, material));\n\t\tthis.rendererSystem.applyColorCorrection(material.color);\n\n\t\treturn path;\n\t}\n});\n\n\n//# sourceURL=webpack://fhmap/./src/client/ar/pathEntity.js?");

/***/ }),

/***/ "./src/client/ar/urlLocationEntity.js":
/*!********************************************!*\
  !*** ./src/client/ar/urlLocationEntity.js ***!
  \********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../utils.js */ \"./src/client/utils.js\");\n/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_utils_js__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var aframe__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! aframe */ \"aframe\");\n/* harmony import */ var aframe__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(aframe__WEBPACK_IMPORTED_MODULE_1__);\n\n\n\nfunction createUrlEntity({ name, coords, projected, primitive, color, scale }) {\n    const textScale = scale * 20;\n    const entity = document.createElement('a-entity');\n    entity.setAttribute('look-at', '[gps'+projected+'-camera]');\n    entity.setAttribute('gps'+projected+'-entity-place', {latitude: coords.lat, longitude: coords.lng});\n    entity.setAttribute('position', {x: 0, y: 1, z: 0});\n\n    const text = document.createElement('a-text');\n    text.setAttribute('value', name);\n    text.setAttribute('scale', {x: textScale, y: textScale, z: textScale});\n    text.setAttribute('align', 'center');\n    text.setAttribute('position', {x: 0, y: textScale/4, z: 0});\n    entity.appendChild(text);\n\n    const prim = document.createElement(primitive);\n\tprim.setAttribute('scale', {x: scale, y: scale, z: scale});\n\tprim.setAttribute('material', {color: color});\n\tif(primitive === 'a-cone') {\n\t\tprim.setAttribute('radius-bottom', 0.1);\n\t\tprim.setAttribute('radius-top', 1);\n\t\tprim.setAttribute('height', 3);\n\t}\n    entity.appendChild(prim);\n    \n    return entity;\n}\n\naframe__WEBPACK_IMPORTED_MODULE_1__.registerComponent('location-url', {\n\tschema: {\n\t\tname: {\n\t\t\ttype: 'string',\n\t\t\tdefault: 'Marker'\n\t\t},\n        scale: {\n            type: 'number',\n            default: 20\n        },\n\t\tcolor: {\n\t\t\ttype: 'string',\n\t\t\tdefault: 'blue'\n\t\t},\n\t\tprimitive: {\n\t\t\ttype: 'string',\n\t\t\tdefault: 'a-cone'\n\t\t}\n    },\n    init: function() {\n              const lat = _utils_js__WEBPACK_IMPORTED_MODULE_0___default()('lat');\n              const lng = _utils_js__WEBPACK_IMPORTED_MODULE_0___default()('lng');\n\t\t\t  const name = _utils_js__WEBPACK_IMPORTED_MODULE_0___default()('name');\n\n\t\t\t  const camera = document.querySelector('a-camera');\n\t\t\t  if(camera.getAttribute('gps-projected-camera'))\n\t\t\t  \tthis.projected = '-projected';\n\t\t\t  else if(camera.getAttribute('gps-new-camera'))\n\t\t\t\tthis.projected = '-new';\n\n              if(lat != undefined && lng != undefined) {\n                  const entity = createUrlEntity({\n\t\t\t\t\t\tname: name || this.data.name,\n\t\t\t\t\t\tprojected: this.projected || '',\n\t\t\t\t\t\tcoords: { lat: lat, lng: lng },\n\t\t\t\t\t\tprimitive: this.data.primitive,\n\t\t\t\t\t\tcolor: this.data.color, \n\t\t\t\t\t\tscale: this.data.scale\n\t\t\t\t\t});\n\n                  this.el.sceneEl.appendChild(entity);\n              }\n          }\n});\n\n\n//# sourceURL=webpack://fhmap/./src/client/ar/urlLocationEntity.js?");

/***/ }),

/***/ "./src/client/utils.js":
/*!*****************************!*\
  !*** ./src/client/utils.js ***!
  \*****************************/
/***/ (() => {

eval("function getUrlParam(name){\n    if(name=(new RegExp('[?&;]'+encodeURIComponent(name)+'=([^&]*)')).exec(window.location.search))\n        return decodeURIComponent(name[1]);\n}\n\n\n//# sourceURL=webpack://fhmap/./src/client/utils.js?");

/***/ }),

/***/ "aframe":
/*!******************************************************************************************!*\
  !*** external {"commonjs":"aframe","commonjs2":"aframe","amd":"aframe","root":"AFRAME"} ***!
  \******************************************************************************************/
/***/ ((module) => {

"use strict";
module.exports = __WEBPACK_EXTERNAL_MODULE_aframe__;

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = __webpack_require__("./src/client/ar/index.js");
/******/ 	
/******/ 	return __webpack_exports__;
/******/ })()
;
});