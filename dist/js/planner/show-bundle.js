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
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else {
		var a = factory();
		for(var i in a) (typeof exports === 'object' ? exports : root)[i] = a[i];
	}
})(this, () => {
return /******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./src/client/planner/api.js":
/*!***********************************!*\
  !*** ./src/client/planner/api.js ***!
  \***********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n\nfunction createTable(headers, data) {\n\tconst table = document.createElement('table');\n\tconst thead = document.createElement('thead');\n\tconst tbody = document.createElement('tbody');\n\tconst tr = document.createElement('tr');\n\n\theaders.forEach(h => {\n\t\tconst th = document.createElement('th');\n\t\tth.innerHTML = h;\n\t\ttr.appendChild(th);\n\t});\n\tthead.appendChild(tr);\n\ttable.appendChild(thead);\n\n\tdata.forEach(row => {\n\t\tconst tr = document.createElement('tr');\n\t\t//row.forEach(cell => {\n\t\t\tconst td = document.createElement('td');\n\t\t\ttd.innerHTML = row.title;\n\t\t\ttr.appendChild(td);\n\t\t//});\n\t\ttbody.appendChild(tr);\n\t});\n\ttable.appendChild(tbody);\n\t\n\ttable.add = function(row) {\n\t\tconst tr = document.createElement('tr');\n\t\trow.forEach(cell => {\n\t\t\tconst td = document.createElement('td');\n\t\t\ttd.innerHTML = cell;\n\t\t\ttr.appendChild(td);\n\t\t});\n\t\ttbody.appendChild(tr);\n\t}\n\treturn table;\n}\n\nfunction roomDataCallback(room)\t{\n\tconst url = '/api/roomdata?id=' + room.id;\n\tlet element = document.createElement('div');\n\ttry {\n\tfetch(url, {method: 'GET'}).then((response) => {\n\t\treturn response.json();\n\t}).then((data) => {\n\t\tconst table = createTable(['event', 'time'], data.events);\n\t\telement.appendChild(table);\n\t});\n\t} catch(e) { console.error(e); }\n\treturn element;\n}\n\nfunction save(data) {\n\tfetch('/api/floorplan', {\n\t\tmethod: 'POST',\n\t\theaders: {\n\t\t\t'Content-Type': 'application/json'\n\t\t},\n\t\tbody: data\n\t})\n}\n\nconst api = {\n\teditRoomCallback: roomDataCallback,\n\troomDataCallback,\n\tsave\n};\n\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (api);\n\n//# sourceURL=webpack://fhmap/./src/client/planner/api.js?");

/***/ }),

/***/ "./src/client/planner/show.js":
/*!************************************!*\
  !*** ./src/client/planner/show.js ***!
  \************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var floorplanner__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! floorplanner */ \"../floorplanner/dist/floorplanner.js\");\n/* harmony import */ var floorplanner__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(floorplanner__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var _api__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./api */ \"./src/client/planner/api.js\");\n\n\n\nfunction getUrlParam(name){\n    if(name=(new RegExp('[?&;]'+encodeURIComponent(name)+'=([^&]*)')).exec(window.location.search))\n        return decodeURIComponent(name[1]);\n}\n\n\n\nwindow.addEventListener('load', function() {\n\tconst model = new floorplanner__WEBPACK_IMPORTED_MODULE_0__.Model();\n\tconst viewer = new floorplanner__WEBPACK_IMPORTED_MODULE_0__.Control3d('viewer', model, false, _api__WEBPACK_IMPORTED_MODULE_1__[\"default\"].roomDataCallback);\n\tconst fileName = getUrlParam('file');\n\tif (fileName) {\n\t\tfetch('data/floors/' + fileName).then(res => res.json()).then(data => {\n\t\t\tmodel.loadSerialized(JSON.stringify(data));\n\t\t\tviewer.render();\n\t\t});\n\t}\n\n});\n\n//# sourceURL=webpack://fhmap/./src/client/planner/show.js?");

/***/ }),

/***/ "../floorplanner/dist/floorplanner.js":
/*!********************************************!*\
  !*** ../floorplanner/dist/floorplanner.js ***!
  \********************************************/
/***/ (function(module) {


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
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
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
/******/ 	var __webpack_exports__ = __webpack_require__("./src/client/planner/show.js");
/******/ 	
/******/ 	return __webpack_exports__;
/******/ })()
;
});