/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./demo/demo.ts");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./demo/demo.ts":
/*!**********************!*\
  !*** ./demo/demo.ts ***!
  \**********************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _init__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./init */ \"./demo/init.ts\");\n/* harmony import */ var _src__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../src */ \"./src/index.ts\");\n/* harmony import */ var _my_module__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./my-module */ \"./demo/my-module.ts\");\n\n\n\n_src__WEBPACK_IMPORTED_MODULE_1__[\"default\"].logger.debug('test debug');\n_src__WEBPACK_IMPORTED_MODULE_1__[\"default\"].logger.info('test info');\n_src__WEBPACK_IMPORTED_MODULE_1__[\"default\"].logger.warn('test warn');\n_src__WEBPACK_IMPORTED_MODULE_1__[\"default\"].logger.error(new Error('test error'));\nvar spanLogger = _src__WEBPACK_IMPORTED_MODULE_1__[\"default\"].logger.startSpan('first.span', {\n  parent: _src__WEBPACK_IMPORTED_MODULE_1__[\"default\"].tracer.createSpanContext()\n});\nsetTimeout(function () {\n  spanLogger.debug('test span debug');\n  spanLogger.info('test span info');\n  spanLogger.warn('test span warn');\n  spanLogger.error(new Error('test span error'));\n  spanLogger.endSpan();\n}, 2000); // create sub span\n\nvar span1 = spanLogger.startSpan('first_child.span');\nsetTimeout(function () {\n  span1.debug('test span debug');\n  span1.info('test span info');\n  span1.warn('test span warn');\n  span1.error(new Error('test span error'));\n  span1.endSpan({\n    status: _src__WEBPACK_IMPORTED_MODULE_1__[\"CanonicalCode\"].UNKNOWN\n  });\n}, 4000); // module logging\n\n_my_module__WEBPACK_IMPORTED_MODULE_2__[\"myModuleAce\"].logger.debug('test module debug');\n_my_module__WEBPACK_IMPORTED_MODULE_2__[\"myModuleAce\"].logger.info('test module info');\n_my_module__WEBPACK_IMPORTED_MODULE_2__[\"myModuleAce\"].logger.warn('test module warn');\n_my_module__WEBPACK_IMPORTED_MODULE_2__[\"myModuleAce\"].logger.error(new Error('test module error'));\n\n//# sourceURL=webpack:///./demo/demo.ts?");

/***/ }),

/***/ "./demo/init.ts":
/*!**********************!*\
  !*** ./demo/init.ts ***!
  \**********************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _src__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../src */ \"./src/index.ts\");\n\n_src__WEBPACK_IMPORTED_MODULE_0__[\"default\"].setTimer({\n  now: function now() {\n    return performance.timeOrigin + performance.now();\n  }\n});\n_src__WEBPACK_IMPORTED_MODULE_0__[\"default\"].logger.setAttributes({\n  app: 'my-app',\n  appVersion: '0.0.1',\n  os: 'macOS'\n}); // init logger exporter\n\n_src__WEBPACK_IMPORTED_MODULE_0__[\"default\"].logger.setExporter(_src__WEBPACK_IMPORTED_MODULE_0__[\"AlertLevel\"].Debug, new _src__WEBPACK_IMPORTED_MODULE_0__[\"ConsoleExporterWeb\"]());\n_src__WEBPACK_IMPORTED_MODULE_0__[\"default\"].logger.setBufferSize(0);\n\n//# sourceURL=webpack:///./demo/init.ts?");

/***/ }),

/***/ "./demo/my-module.ts":
/*!***************************!*\
  !*** ./demo/my-module.ts ***!
  \***************************/
/*! exports provided: myModuleAce */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"myModuleAce\", function() { return manager; });\n/* harmony import */ var _src__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../src */ \"./src/index.ts\");\n\nvar manager = new _src__WEBPACK_IMPORTED_MODULE_0__[\"Manager\"]();\nmanager.setLogger(new _src__WEBPACK_IMPORTED_MODULE_0__[\"SimpleLogger\"]());\nmanager.setTracer(new _src__WEBPACK_IMPORTED_MODULE_0__[\"SimpleTracer\"]());\nmanager.logger.setAttributes({\n  app: _src__WEBPACK_IMPORTED_MODULE_0__[\"default\"].logger.getAttributes().app,\n  appVersion: _src__WEBPACK_IMPORTED_MODULE_0__[\"default\"].logger.getAttributes().appVersion,\n  name: 'my-module'\n}); // init logger exporter\n\nmanager.logger.setExporter(_src__WEBPACK_IMPORTED_MODULE_0__[\"AlertLevel\"].Debug, new _src__WEBPACK_IMPORTED_MODULE_0__[\"ConsoleExporterWeb\"]());\nmanager.logger.setBufferSize(0);\n\n\n//# sourceURL=webpack:///./demo/my-module.ts?");

/***/ }),

/***/ "./node_modules/@opentelemetry/api/build/src/common/Time.js":
/*!******************************************************************!*\
  !*** ./node_modules/@opentelemetry/api/build/src/common/Time.js ***!
  \******************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n/*!\n * Copyright 2019, OpenTelemetry Authors\n *\n * Licensed under the Apache License, Version 2.0 (the \"License\");\n * you may not use this file except in compliance with the License.\n * You may obtain a copy of the License at\n *\n *      https://www.apache.org/licenses/LICENSE-2.0\n *\n * Unless required by applicable law or agreed to in writing, software\n * distributed under the License is distributed on an \"AS IS\" BASIS,\n * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n * See the License for the specific language governing permissions and\n * limitations under the License.\n */\nObject.defineProperty(exports, \"__esModule\", { value: true });\n//# sourceMappingURL=Time.js.map\n\n//# sourceURL=webpack:///./node_modules/@opentelemetry/api/build/src/common/Time.js?");

/***/ }),

/***/ "./node_modules/@opentelemetry/api/build/src/trace/Sampler.js":
/*!********************************************************************!*\
  !*** ./node_modules/@opentelemetry/api/build/src/trace/Sampler.js ***!
  \********************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n/*!\n * Copyright 2019, OpenTelemetry Authors\n *\n * Licensed under the Apache License, Version 2.0 (the \"License\");\n * you may not use this file except in compliance with the License.\n * You may obtain a copy of the License at\n *\n *      https://www.apache.org/licenses/LICENSE-2.0\n *\n * Unless required by applicable law or agreed to in writing, software\n * distributed under the License is distributed on an \"AS IS\" BASIS,\n * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n * See the License for the specific language governing permissions and\n * limitations under the License.\n */\nObject.defineProperty(exports, \"__esModule\", { value: true });\n//# sourceMappingURL=Sampler.js.map\n\n//# sourceURL=webpack:///./node_modules/@opentelemetry/api/build/src/trace/Sampler.js?");

/***/ }),

/***/ "./node_modules/@opentelemetry/api/build/src/trace/attributes.js":
/*!***********************************************************************!*\
  !*** ./node_modules/@opentelemetry/api/build/src/trace/attributes.js ***!
  \***********************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n/*!\n * Copyright 2019, OpenTelemetry Authors\n *\n * Licensed under the Apache License, Version 2.0 (the \"License\");\n * you may not use this file except in compliance with the License.\n * You may obtain a copy of the License at\n *\n *      https://www.apache.org/licenses/LICENSE-2.0\n *\n * Unless required by applicable law or agreed to in writing, software\n * distributed under the License is distributed on an \"AS IS\" BASIS,\n * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n * See the License for the specific language governing permissions and\n * limitations under the License.\n */\nObject.defineProperty(exports, \"__esModule\", { value: true });\n//# sourceMappingURL=attributes.js.map\n\n//# sourceURL=webpack:///./node_modules/@opentelemetry/api/build/src/trace/attributes.js?");

/***/ }),

/***/ "./node_modules/@opentelemetry/api/build/src/trace/span_context.js":
/*!*************************************************************************!*\
  !*** ./node_modules/@opentelemetry/api/build/src/trace/span_context.js ***!
  \*************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n/*!\n * Copyright 2019, OpenTelemetry Authors\n *\n * Licensed under the Apache License, Version 2.0 (the \"License\");\n * you may not use this file except in compliance with the License.\n * You may obtain a copy of the License at\n *\n *      https://www.apache.org/licenses/LICENSE-2.0\n *\n * Unless required by applicable law or agreed to in writing, software\n * distributed under the License is distributed on an \"AS IS\" BASIS,\n * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n * See the License for the specific language governing permissions and\n * limitations under the License.\n */\nObject.defineProperty(exports, \"__esModule\", { value: true });\n//# sourceMappingURL=span_context.js.map\n\n//# sourceURL=webpack:///./node_modules/@opentelemetry/api/build/src/trace/span_context.js?");

/***/ }),

/***/ "./node_modules/@opentelemetry/api/build/src/trace/span_kind.js":
/*!**********************************************************************!*\
  !*** ./node_modules/@opentelemetry/api/build/src/trace/span_kind.js ***!
  \**********************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n/*!\n * Copyright 2019, OpenTelemetry Authors\n *\n * Licensed under the Apache License, Version 2.0 (the \"License\");\n * you may not use this file except in compliance with the License.\n * You may obtain a copy of the License at\n *\n *      https://www.apache.org/licenses/LICENSE-2.0\n *\n * Unless required by applicable law or agreed to in writing, software\n * distributed under the License is distributed on an \"AS IS\" BASIS,\n * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n * See the License for the specific language governing permissions and\n * limitations under the License.\n */\nObject.defineProperty(exports, \"__esModule\", { value: true });\n/**\n * Type of span. Can be used to specify additional relationships between spans\n * in addition to a parent/child relationship.\n */\nvar SpanKind;\n(function (SpanKind) {\n    /** Default value. Indicates that the span is used internally. */\n    SpanKind[SpanKind[\"INTERNAL\"] = 0] = \"INTERNAL\";\n    /**\n     * Indicates that the span covers server-side handling of an RPC or other\n     * remote request.\n     */\n    SpanKind[SpanKind[\"SERVER\"] = 1] = \"SERVER\";\n    /**\n     * Indicates that the span covers the client-side wrapper around an RPC or\n     * other remote request.\n     */\n    SpanKind[SpanKind[\"CLIENT\"] = 2] = \"CLIENT\";\n    /**\n     * Indicates that the span describes producer sending a message to a\n     * broker. Unlike client and server, there is no direct critical path latency\n     * relationship between producer and consumer spans.\n     */\n    SpanKind[SpanKind[\"PRODUCER\"] = 3] = \"PRODUCER\";\n    /**\n     * Indicates that the span describes consumer receiving a message from a\n     * broker. Unlike client and server, there is no direct critical path latency\n     * relationship between producer and consumer spans.\n     */\n    SpanKind[SpanKind[\"CONSUMER\"] = 4] = \"CONSUMER\";\n})(SpanKind = exports.SpanKind || (exports.SpanKind = {}));\n//# sourceMappingURL=span_kind.js.map\n\n//# sourceURL=webpack:///./node_modules/@opentelemetry/api/build/src/trace/span_kind.js?");

/***/ }),

/***/ "./node_modules/@opentelemetry/api/build/src/trace/status.js":
/*!*******************************************************************!*\
  !*** ./node_modules/@opentelemetry/api/build/src/trace/status.js ***!
  \*******************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n/*!\n * Copyright 2019, OpenTelemetry Authors\n *\n * Licensed under the Apache License, Version 2.0 (the \"License\");\n * you may not use this file except in compliance with the License.\n * You may obtain a copy of the License at\n *\n *      https://www.apache.org/licenses/LICENSE-2.0\n *\n * Unless required by applicable law or agreed to in writing, software\n * distributed under the License is distributed on an \"AS IS\" BASIS,\n * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n * See the License for the specific language governing permissions and\n * limitations under the License.\n */\nObject.defineProperty(exports, \"__esModule\", { value: true });\n/**\n * An enumeration of canonical status codes.\n */\nvar CanonicalCode;\n(function (CanonicalCode) {\n    /**\n     * Not an error; returned on success\n     */\n    CanonicalCode[CanonicalCode[\"OK\"] = 0] = \"OK\";\n    /**\n     * The operation was cancelled (typically by the caller).\n     */\n    CanonicalCode[CanonicalCode[\"CANCELLED\"] = 1] = \"CANCELLED\";\n    /**\n     * Unknown error.  An example of where this error may be returned is\n     * if a status value received from another address space belongs to\n     * an error-space that is not known in this address space.  Also\n     * errors raised by APIs that do not return enough error information\n     * may be converted to this error.\n     */\n    CanonicalCode[CanonicalCode[\"UNKNOWN\"] = 2] = \"UNKNOWN\";\n    /**\n     * Client specified an invalid argument.  Note that this differs\n     * from FAILED_PRECONDITION.  INVALID_ARGUMENT indicates arguments\n     * that are problematic regardless of the state of the system\n     * (e.g., a malformed file name).\n     */\n    CanonicalCode[CanonicalCode[\"INVALID_ARGUMENT\"] = 3] = \"INVALID_ARGUMENT\";\n    /**\n     * Deadline expired before operation could complete.  For operations\n     * that change the state of the system, this error may be returned\n     * even if the operation has completed successfully.  For example, a\n     * successful response from a server could have been delayed long\n     * enough for the deadline to expire.\n     */\n    CanonicalCode[CanonicalCode[\"DEADLINE_EXCEEDED\"] = 4] = \"DEADLINE_EXCEEDED\";\n    /**\n     * Some requested entity (e.g., file or directory) was not found.\n     */\n    CanonicalCode[CanonicalCode[\"NOT_FOUND\"] = 5] = \"NOT_FOUND\";\n    /**\n     * Some entity that we attempted to create (e.g., file or directory)\n     * already exists.\n     */\n    CanonicalCode[CanonicalCode[\"ALREADY_EXISTS\"] = 6] = \"ALREADY_EXISTS\";\n    /**\n     * The caller does not have permission to execute the specified\n     * operation.  PERMISSION_DENIED must not be used for rejections\n     * caused by exhausting some resource (use RESOURCE_EXHAUSTED\n     * instead for those errors).  PERMISSION_DENIED must not be\n     * used if the caller can not be identified (use UNAUTHENTICATED\n     * instead for those errors).\n     */\n    CanonicalCode[CanonicalCode[\"PERMISSION_DENIED\"] = 7] = \"PERMISSION_DENIED\";\n    /**\n     * Some resource has been exhausted, perhaps a per-user quota, or\n     * perhaps the entire file system is out of space.\n     */\n    CanonicalCode[CanonicalCode[\"RESOURCE_EXHAUSTED\"] = 8] = \"RESOURCE_EXHAUSTED\";\n    /**\n     * Operation was rejected because the system is not in a state\n     * required for the operation's execution.  For example, directory\n     * to be deleted may be non-empty, an rmdir operation is applied to\n     * a non-directory, etc.\n     *\n     * A litmus test that may help a service implementor in deciding\n     * between FAILED_PRECONDITION, ABORTED, and UNAVAILABLE:\n     *\n     *  - Use UNAVAILABLE if the client can retry just the failing call.\n     *  - Use ABORTED if the client should retry at a higher-level\n     *    (e.g., restarting a read-modify-write sequence).\n     *  - Use FAILED_PRECONDITION if the client should not retry until\n     *    the system state has been explicitly fixed.  E.g., if an \"rmdir\"\n     *    fails because the directory is non-empty, FAILED_PRECONDITION\n     *    should be returned since the client should not retry unless\n     *    they have first fixed up the directory by deleting files from it.\n     *  - Use FAILED_PRECONDITION if the client performs conditional\n     *    REST Get/Update/Delete on a resource and the resource on the\n     *    server does not match the condition. E.g., conflicting\n     *    read-modify-write on the same resource.\n     */\n    CanonicalCode[CanonicalCode[\"FAILED_PRECONDITION\"] = 9] = \"FAILED_PRECONDITION\";\n    /**\n     * The operation was aborted, typically due to a concurrency issue\n     * like sequencer check failures, transaction aborts, etc.\n     *\n     * See litmus test above for deciding between FAILED_PRECONDITION,\n     * ABORTED, and UNAVAILABLE.\n     */\n    CanonicalCode[CanonicalCode[\"ABORTED\"] = 10] = \"ABORTED\";\n    /**\n     * Operation was attempted past the valid range.  E.g., seeking or\n     * reading past end of file.\n     *\n     * Unlike INVALID_ARGUMENT, this error indicates a problem that may\n     * be fixed if the system state changes. For example, a 32-bit file\n     * system will generate INVALID_ARGUMENT if asked to read at an\n     * offset that is not in the range [0,2^32-1], but it will generate\n     * OUT_OF_RANGE if asked to read from an offset past the current\n     * file size.\n     *\n     * There is a fair bit of overlap between FAILED_PRECONDITION and\n     * OUT_OF_RANGE.  We recommend using OUT_OF_RANGE (the more specific\n     * error) when it applies so that callers who are iterating through\n     * a space can easily look for an OUT_OF_RANGE error to detect when\n     * they are done.\n     */\n    CanonicalCode[CanonicalCode[\"OUT_OF_RANGE\"] = 11] = \"OUT_OF_RANGE\";\n    /**\n     * Operation is not implemented or not supported/enabled in this service.\n     */\n    CanonicalCode[CanonicalCode[\"UNIMPLEMENTED\"] = 12] = \"UNIMPLEMENTED\";\n    /**\n     * Internal errors.  Means some invariants expected by underlying\n     * system has been broken.  If you see one of these errors,\n     * something is very broken.\n     */\n    CanonicalCode[CanonicalCode[\"INTERNAL\"] = 13] = \"INTERNAL\";\n    /**\n     * The service is currently unavailable.  This is a most likely a\n     * transient condition and may be corrected by retrying with\n     * a backoff.\n     *\n     * See litmus test above for deciding between FAILED_PRECONDITION,\n     * ABORTED, and UNAVAILABLE.\n     */\n    CanonicalCode[CanonicalCode[\"UNAVAILABLE\"] = 14] = \"UNAVAILABLE\";\n    /**\n     * Unrecoverable data loss or corruption.\n     */\n    CanonicalCode[CanonicalCode[\"DATA_LOSS\"] = 15] = \"DATA_LOSS\";\n    /**\n     * The request does not have valid authentication credentials for the\n     * operation.\n     */\n    CanonicalCode[CanonicalCode[\"UNAUTHENTICATED\"] = 16] = \"UNAUTHENTICATED\";\n})(CanonicalCode = exports.CanonicalCode || (exports.CanonicalCode = {}));\n//# sourceMappingURL=status.js.map\n\n//# sourceURL=webpack:///./node_modules/@opentelemetry/api/build/src/trace/status.js?");

/***/ }),

/***/ "./node_modules/@opentelemetry/api/build/src/trace/trace_flags.js":
/*!************************************************************************!*\
  !*** ./node_modules/@opentelemetry/api/build/src/trace/trace_flags.js ***!
  \************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n/*!\n * Copyright 2019, OpenTelemetry Authors\n *\n * Licensed under the Apache License, Version 2.0 (the \"License\");\n * you may not use this file except in compliance with the License.\n * You may obtain a copy of the License at\n *\n *      https://www.apache.org/licenses/LICENSE-2.0\n *\n * Unless required by applicable law or agreed to in writing, software\n * distributed under the License is distributed on an \"AS IS\" BASIS,\n * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n * See the License for the specific language governing permissions and\n * limitations under the License.\n */\nObject.defineProperty(exports, \"__esModule\", { value: true });\n/**\n * An enumeration that represents global trace flags. These flags are\n * propagated to all child {@link Span}. These determine features such as\n * whether a Span should be traced. It is implemented as a bitmask.\n */\nvar TraceFlags;\n(function (TraceFlags) {\n    /** Represents no flag set. */\n    TraceFlags[TraceFlags[\"NONE\"] = 0] = \"NONE\";\n    /** Bit to represent whether trace is sampled in trace flags. */\n    TraceFlags[TraceFlags[\"SAMPLED\"] = 1] = \"SAMPLED\";\n})(TraceFlags = exports.TraceFlags || (exports.TraceFlags = {}));\n//# sourceMappingURL=trace_flags.js.map\n\n//# sourceURL=webpack:///./node_modules/@opentelemetry/api/build/src/trace/trace_flags.js?");

/***/ }),

/***/ "./src/SimpleLogger.ts":
/*!*****************************!*\
  !*** ./src/SimpleLogger.ts ***!
  \*****************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"default\", function() { return SimpleLogger; });\n/* harmony import */ var _api__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./api */ \"./src/api/index.ts\");\n/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./utils */ \"./src/utils.ts\");\nfunction ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }\n\nfunction _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }\n\nfunction _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }\n\nfunction _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError(\"Cannot call a class as a function\"); } }\n\nfunction _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if (\"value\" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }\n\nfunction _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }\n\n\n\n\nvar SimpleLogger = /*#__PURE__*/function () {\n  function SimpleLogger() {\n    _classCallCheck(this, SimpleLogger);\n\n    Object.defineProperty(this, \"attributes\", {\n      enumerable: true,\n      writable: true,\n      value: {\n        app: 'unknown',\n        appVersion: '0',\n        lib: 'acelogger@0.0.2',\n        name: '',\n        version: ''\n      }\n    });\n    Object.defineProperty(this, \"bufferSize\", {\n      enumerable: true,\n      writable: true,\n      value: 10\n    });\n    Object.defineProperty(this, \"bufferCount\", {\n      enumerable: true,\n      writable: true,\n      value: 0\n    });\n    Object.defineProperty(this, \"eventBuffer\", {\n      enumerable: true,\n      writable: true,\n      value: new Map()\n    });\n    Object.defineProperty(this, \"exporterMap\", {\n      enumerable: true,\n      writable: true,\n      value: new Map()\n    });\n  }\n\n  _createClass(SimpleLogger, [{\n    key: \"setAttributes\",\n    value: function setAttributes(attrs) {\n      Object.assign(this.attributes, attrs);\n    }\n  }, {\n    key: \"getAttributes\",\n    value: function getAttributes() {\n      return this.attributes;\n    }\n  }, {\n    key: \"debug\",\n    value: function debug(message, evt) {\n      this.innerLog(_api__WEBPACK_IMPORTED_MODULE_0__[\"AlertLevel\"].Debug, message, _objectSpread({}, evt));\n    }\n  }, {\n    key: \"info\",\n    value: function info(message, evt) {\n      this.innerLog(_api__WEBPACK_IMPORTED_MODULE_0__[\"AlertLevel\"].Info, message, _objectSpread({}, evt));\n    }\n  }, {\n    key: \"warn\",\n    value: function warn(message, evt) {\n      this.innerLog(_api__WEBPACK_IMPORTED_MODULE_0__[\"AlertLevel\"].Warn, message, _objectSpread({}, evt));\n    }\n  }, {\n    key: \"error\",\n    value: function error(_error, evt) {\n      this.innerLog(_api__WEBPACK_IMPORTED_MODULE_0__[\"AlertLevel\"].Error, _error, _objectSpread({}, evt));\n    }\n  }, {\n    key: \"store\",\n    value: function store(evt) {\n      evt.type = _api__WEBPACK_IMPORTED_MODULE_0__[\"EventType\"].Store;\n      this.innerLog(_api__WEBPACK_IMPORTED_MODULE_0__[\"AlertLevel\"].Info, \"store \".concat(Object.keys(evt.data), \" metrics\"), _objectSpread({}, evt));\n    }\n  }, {\n    key: \"count\",\n    value: function count(name, evt) {\n      var e = _objectSpread({}, evt);\n\n      e.name = name;\n      e.data = e.data || 1;\n      e.type = _api__WEBPACK_IMPORTED_MODULE_0__[\"EventType\"].Count;\n      this.innerLog(_api__WEBPACK_IMPORTED_MODULE_0__[\"AlertLevel\"].Info, \"count \".concat(name, \" \").concat(e.data, \" times\"), e);\n    }\n    /**\n     *\n     * @param name the name of timing event\n     * @param duration ms\n     * @param evt other event info\n     */\n\n  }, {\n    key: \"timing\",\n    value: function timing(name, duration, evt) {\n      var e = _objectSpread({}, evt);\n\n      e.name = name;\n      e.data = duration;\n      e.type = _api__WEBPACK_IMPORTED_MODULE_0__[\"EventType\"].Timing;\n      this.innerLog(_api__WEBPACK_IMPORTED_MODULE_0__[\"AlertLevel\"].Info, \"timing \".concat(name, \" \").concat(duration, \"ms\"), e);\n    }\n  }, {\n    key: \"startSpan\",\n    value: function startSpan(name, options) {\n      var parentSpan = this.span && this.span.toJSON();\n      var opts = parentSpan ? _objectSpread(_objectSpread({}, options), {}, {\n        parent: parentSpan.context\n      }) : options;\n      var span = this.manager.tracer.createSpan(name, opts);\n      var logger = new SimpleLogger();\n      logger.span = span;\n      logger.manager = this.manager;\n      logger.attributes = this.attributes;\n      logger.exporterMap = this.exporterMap;\n      logger.bufferSize = this.bufferSize;\n      logger.count(\"\".concat(span.toJSON().name, \".start\"));\n      return logger;\n    }\n  }, {\n    key: \"endSpan\",\n    value: function endSpan(evt) {\n      if (!this.span) {\n        this.error(new Error('logger.endSpan must call after logger.startSpan'));\n        return;\n      }\n\n      var span = this.span.toJSON();\n      span.endTime = Object(_utils__WEBPACK_IMPORTED_MODULE_1__[\"getMillisecondsTime\"])(evt && evt.time) || this.manager.timer.now();\n\n      if (evt && evt.status) {\n        this.error(new Error(\"\".concat(span.name, \" failed with status \").concat(evt.status)), evt);\n      }\n\n      this.timing(\"\".concat(span.name, \".end\"), span.endTime - span.startTime, evt);\n      this.count(\"\".concat(span.name, \".end\"), evt);\n    }\n  }, {\n    key: \"setExporter\",\n    value: function setExporter(level, exportor) {\n      var _this = this;\n\n      Object.keys(_api__WEBPACK_IMPORTED_MODULE_0__[\"AlertLevel\"]).forEach(function (l) {\n        var levelValue = _api__WEBPACK_IMPORTED_MODULE_0__[\"AlertLevel\"][l]; // set AlertLevel.Info exporter, will alse set all levels which greater than AlertLevel.Info;\n\n        if (typeof levelValue === 'number' && levelValue >= level) {\n          var arr = _this.exporterMap.get(levelValue) || [];\n          arr.push(exportor);\n\n          _this.exporterMap.set(levelValue, arr);\n        }\n      });\n      return this;\n    }\n  }, {\n    key: \"setBufferSize\",\n    value: function setBufferSize(size) {\n      this.bufferSize = size;\n      return this;\n    }\n  }, {\n    key: \"flush\",\n    value: function flush() {\n      var _this2 = this;\n\n      // 1. if exporters exist, export all events\n      this.eventBuffer.forEach(function (evts, key) {\n        _this2[\"export\"](key, evts);\n      }); // 2. reset eventBuffer anyway\n\n      this.eventBuffer = new Map();\n      this.bufferCount = 0;\n      return;\n    }\n  }, {\n    key: \"innerLog\",\n    value: function innerLog(level, message, evt) {\n      evt.level = level;\n\n      if (typeof message === 'string' && message) {\n        evt.message = message;\n      } else if (message instanceof Error) {\n        evt.stack = message.stack;\n        evt.message = message.message;\n      }\n\n      if (!evt.status) {\n        evt.status = _api__WEBPACK_IMPORTED_MODULE_0__[\"CanonicalCode\"].OK;\n      }\n\n      if (!evt.time) {\n        evt.time = this.manager.timer.now();\n      }\n\n      try {\n        var tracer = this.manager.tracer.toJSON();\n        var span = this.span ? this.span.toJSON() : {};\n        evt.attributes = _objectSpread(_objectSpread(_objectSpread({}, evt.attributes), span.attributes), {}, {\n          app: this.attributes.app,\n          appVersion: this.attributes.appVersion,\n          loggerLib: this.attributes.lib,\n          loggerName: this.attributes.name || this.attributes.app,\n          loggerVersion: this.attributes.version || this.attributes.appVersion,\n          spanId: span.context && span.context.spanId,\n          spanKind: span.kind,\n          spanName: span.name,\n          traceId: span.context && span.context.traceId,\n          tracerLib: tracer.lib\n        });\n\n        if (this.bufferSize <= 1) {\n          this[\"export\"](evt.level, [evt]);\n        } else {\n          var evts = this.eventBuffer.get(evt.level) || [];\n          evts.push(evt);\n          this.bufferCount++;\n          this.eventBuffer.set(evt.level, evts);\n\n          if (this.bufferCount >= this.bufferSize) {\n            this.flush();\n          }\n        }\n      } catch (err) {\n        // TODO: report error to some exporter\n\n        /* tslint:disable no-console */\n        console.error('Failed export events with error', err);\n      }\n    }\n  }, {\n    key: \"export\",\n    value: function _export(level, evts) {\n      try {\n        var exporters = this.exporterMap.get(level);\n\n        if (exporters) {\n          exporters.forEach(function (exporter) {\n            exporter[\"export\"](evts, function (result) {\n              if (result !== _api__WEBPACK_IMPORTED_MODULE_0__[\"ExportResult\"].SUCCESS) {\n                // TODO: report error to some exporter\n\n                /* tslint:disable no-console */\n                console.error(\"Failed export event with \".concat(result === _api__WEBPACK_IMPORTED_MODULE_0__[\"ExportResult\"].FAILED_NOT_RETRYABLE ? 'no' : '', \" retry\"));\n              }\n            });\n          });\n        }\n      } catch (err) {\n        // TODO: report error to some exporter\n\n        /* tslint:disable no-console */\n        console.error('Failed export events with error', err);\n      }\n    }\n  }]);\n\n  return SimpleLogger;\n}();\n\n\n\n//# sourceURL=webpack:///./src/SimpleLogger.ts?");

/***/ }),

/***/ "./src/SimpleSpan.ts":
/*!***************************!*\
  !*** ./src/SimpleSpan.ts ***!
  \***************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"default\", function() { return SimpleSpan; });\nfunction _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError(\"Cannot call a class as a function\"); } }\n\nfunction _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if (\"value\" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }\n\nfunction _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }\n\nvar SimpleSpan = /*#__PURE__*/function () {\n  function SimpleSpan(options) {\n    _classCallCheck(this, SimpleSpan);\n\n    this.data = options;\n  }\n\n  _createClass(SimpleSpan, [{\n    key: \"toJSON\",\n    value: function toJSON() {\n      return this.data;\n    }\n  }, {\n    key: \"setAttributes\",\n    value: function setAttributes(attrs) {\n      if (!this.data.attributes) {\n        this.data.attributes = attrs;\n      } else {\n        Object.assign(this.data.attributes, attrs);\n      }\n    }\n  }]);\n\n  return SimpleSpan;\n}();\n\n\n\n//# sourceURL=webpack:///./src/SimpleSpan.ts?");

/***/ }),

/***/ "./src/SimpleTracer.ts":
/*!*****************************!*\
  !*** ./src/SimpleTracer.ts ***!
  \*****************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"default\", function() { return SimpleTracer; });\n/* harmony import */ var _api__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./api */ \"./src/api/index.ts\");\n/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./utils */ \"./src/utils.ts\");\n/* harmony import */ var _SimpleSpan__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./SimpleSpan */ \"./src/SimpleSpan.ts\");\nfunction ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }\n\nfunction _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }\n\nfunction _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }\n\nfunction _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError(\"Cannot call a class as a function\"); } }\n\nfunction _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if (\"value\" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }\n\nfunction _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }\n\n\n\n\n\nfunction createSpanId(parentSpanId) {\n  return parentSpanId ? \"\".concat(parentSpanId, \".1\") : '1';\n}\n\nfunction createTraceId() {\n  return Math.random().toString(32).substring(2) + Math.random().toString(32).substring(2);\n}\n\nvar SimpleTracer = /*#__PURE__*/function () {\n  function SimpleTracer() {\n    _classCallCheck(this, SimpleTracer);\n\n    Object.defineProperty(this, \"data\", {\n      enumerable: true,\n      writable: true,\n      value: {\n        lib: 'acelogger@0.0.2',\n        startTime: Date.now()\n      }\n    });\n  }\n\n  _createClass(SimpleTracer, [{\n    key: \"toJSON\",\n    value: function toJSON() {\n      return this.data;\n    }\n  }, {\n    key: \"createSpanContext\",\n    value: function createSpanContext(ctx) {\n      var c = _objectSpread({}, ctx);\n\n      return {\n        isRemote: c.isRemote,\n        spanId: createSpanId(c.spanId),\n        traceFlags: c.traceFlags || _api__WEBPACK_IMPORTED_MODULE_0__[\"TraceFlags\"].NONE,\n        traceId: c.traceId || createTraceId(),\n        traceState: c.traceState\n      };\n    }\n  }, {\n    key: \"createSpan\",\n    value: function createSpan(name, options) {\n      var opt = options || {};\n      var newOptions = {\n        attributes: opt.attributes,\n        context: this.createSpanContext(opt.parent),\n        endTime: 0,\n        kind: opt.kind || _api__WEBPACK_IMPORTED_MODULE_0__[\"SpanKind\"].INTERNAL,\n        name: name,\n        parentContext: opt.parent,\n        startTime: Object(_utils__WEBPACK_IMPORTED_MODULE_1__[\"getMillisecondsTime\"])(opt.startTime) || this.manager.timer.now()\n      };\n      return new _SimpleSpan__WEBPACK_IMPORTED_MODULE_2__[\"default\"](newOptions);\n    }\n  }, {\n    key: \"start\",\n    value: function start(time) {\n      this.data.startTime = Object(_utils__WEBPACK_IMPORTED_MODULE_1__[\"getMillisecondsTime\"])(time) || this.manager.timer.now();\n    }\n  }, {\n    key: \"end\",\n    value: function end(time) {\n      this.data.endTime = Object(_utils__WEBPACK_IMPORTED_MODULE_1__[\"getMillisecondsTime\"])(time) || this.manager.timer.now();\n    }\n  }]);\n\n  return SimpleTracer;\n}();\n\n\n\n//# sourceURL=webpack:///./src/SimpleTracer.ts?");

/***/ }),

/***/ "./src/api/ExportResult.ts":
/*!*********************************!*\
  !*** ./src/api/ExportResult.ts ***!
  \*********************************/
/*! exports provided: ExportResult */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"ExportResult\", function() { return ExportResult; });\n/*\n * Copyright The OpenTelemetry Authors\n *\n * Licensed under the Apache License, Version 2.0 (the \"License\");\n * you may not use this file except in compliance with the License.\n * You may obtain a copy of the License at\n *\n *      https://www.apache.org/licenses/LICENSE-2.0\n *\n * Unless required by applicable law or agreed to in writing, software\n * distributed under the License is distributed on an \"AS IS\" BASIS,\n * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n * See the License for the specific language governing permissions and\n * limitations under the License.\n */\nvar ExportResult;\n\n(function (ExportResult) {\n  ExportResult[ExportResult[\"SUCCESS\"] = 0] = \"SUCCESS\";\n  ExportResult[ExportResult[\"FAILED_NOT_RETRYABLE\"] = 1] = \"FAILED_NOT_RETRYABLE\";\n  ExportResult[ExportResult[\"FAILED_RETRYABLE\"] = 2] = \"FAILED_RETRYABLE\";\n})(ExportResult || (ExportResult = {}));\n\n//# sourceURL=webpack:///./src/api/ExportResult.ts?");

/***/ }),

/***/ "./src/api/Logger.ts":
/*!***************************!*\
  !*** ./src/api/Logger.ts ***!
  \***************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("\n\n//# sourceURL=webpack:///./src/api/Logger.ts?");

/***/ }),

/***/ "./src/api/LoggerEvent.ts":
/*!********************************!*\
  !*** ./src/api/LoggerEvent.ts ***!
  \********************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("\n\n//# sourceURL=webpack:///./src/api/LoggerEvent.ts?");

/***/ }),

/***/ "./src/api/LoggerEventExporter.ts":
/*!****************************************!*\
  !*** ./src/api/LoggerEventExporter.ts ***!
  \****************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("\n\n//# sourceURL=webpack:///./src/api/LoggerEventExporter.ts?");

/***/ }),

/***/ "./src/api/Manager.ts":
/*!****************************!*\
  !*** ./src/api/Manager.ts ***!
  \****************************/
/*! exports provided: Manager */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"Manager\", function() { return Manager; });\nfunction _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError(\"Cannot call a class as a function\"); } }\n\nfunction _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if (\"value\" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }\n\nfunction _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }\n\nvar defaultTimer = {\n  now: function now() {\n    return Date.now();\n  }\n};\nvar Manager = /*#__PURE__*/function () {\n  function Manager() {\n    _classCallCheck(this, Manager);\n\n    Object.defineProperty(this, \"registries\", {\n      enumerable: true,\n      writable: true,\n      value: new Map()\n    });\n  }\n\n  _createClass(Manager, [{\n    key: \"setLogger\",\n    value: function setLogger(logger) {\n      this.registries.set('logger', logger);\n\n      if (logger) {\n        logger.manager = this;\n      }\n    }\n  }, {\n    key: \"setTracer\",\n    value: function setTracer(tracer) {\n      this.registries.set('tracer', tracer);\n\n      if (tracer) {\n        tracer.manager = this;\n      }\n    }\n  }, {\n    key: \"setTimer\",\n    value: function setTimer(timer) {\n      this.registries.set('timer', timer);\n    }\n  }, {\n    key: \"logger\",\n    get: function get() {\n      return this.registries.get('logger');\n    }\n  }, {\n    key: \"tracer\",\n    get: function get() {\n      return this.registries.get('tracer');\n    }\n  }, {\n    key: \"timer\",\n    get: function get() {\n      return this.registries.get('timer') || defaultTimer;\n    }\n  }]);\n\n  return Manager;\n}();\n\n//# sourceURL=webpack:///./src/api/Manager.ts?");

/***/ }),

/***/ "./src/api/Span.ts":
/*!*************************!*\
  !*** ./src/api/Span.ts ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("\n\n//# sourceURL=webpack:///./src/api/Span.ts?");

/***/ }),

/***/ "./src/api/Timer.ts":
/*!**************************!*\
  !*** ./src/api/Timer.ts ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("\n\n//# sourceURL=webpack:///./src/api/Timer.ts?");

/***/ }),

/***/ "./src/api/Tracer.ts":
/*!***************************!*\
  !*** ./src/api/Tracer.ts ***!
  \***************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("\n\n//# sourceURL=webpack:///./src/api/Tracer.ts?");

/***/ }),

/***/ "./src/api/consts.ts":
/*!***************************!*\
  !*** ./src/api/consts.ts ***!
  \***************************/
/*! exports provided: EventType, AlertLevel */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"EventType\", function() { return EventType; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"AlertLevel\", function() { return AlertLevel; });\nvar EventType;\n\n(function (EventType) {\n  EventType[\"Log\"] = \"log\";\n  EventType[\"Store\"] = \"store\";\n  EventType[\"Count\"] = \"count\";\n  EventType[\"Timing\"] = \"timing\";\n  EventType[\"Start\"] = \"start\";\n  EventType[\"End\"] = \"end\";\n})(EventType || (EventType = {}));\n\nvar AlertLevel;\n\n(function (AlertLevel) {\n  AlertLevel[AlertLevel[\"Debug\"] = 0] = \"Debug\";\n  AlertLevel[AlertLevel[\"Info\"] = 1] = \"Info\";\n  AlertLevel[AlertLevel[\"Warn\"] = 2] = \"Warn\";\n  AlertLevel[AlertLevel[\"Error\"] = 3] = \"Error\";\n})(AlertLevel || (AlertLevel = {}));\n\n//# sourceURL=webpack:///./src/api/consts.ts?");

/***/ }),

/***/ "./src/api/index.ts":
/*!**************************!*\
  !*** ./src/api/index.ts ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _Timer__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Timer */ \"./src/api/Timer.ts\");\n/* harmony import */ var _Timer__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_Timer__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in _Timer__WEBPACK_IMPORTED_MODULE_0__) if([\"default\"].indexOf(__WEBPACK_IMPORT_KEY__) < 0) (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return _Timer__WEBPACK_IMPORTED_MODULE_0__[key]; }) }(__WEBPACK_IMPORT_KEY__));\n/* harmony import */ var _Tracer__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Tracer */ \"./src/api/Tracer.ts\");\n/* harmony import */ var _Tracer__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_Tracer__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in _Tracer__WEBPACK_IMPORTED_MODULE_1__) if([\"default\"].indexOf(__WEBPACK_IMPORT_KEY__) < 0) (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return _Tracer__WEBPACK_IMPORTED_MODULE_1__[key]; }) }(__WEBPACK_IMPORT_KEY__));\n/* harmony import */ var _Span__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./Span */ \"./src/api/Span.ts\");\n/* harmony import */ var _Span__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_Span__WEBPACK_IMPORTED_MODULE_2__);\n/* harmony reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in _Span__WEBPACK_IMPORTED_MODULE_2__) if([\"default\"].indexOf(__WEBPACK_IMPORT_KEY__) < 0) (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return _Span__WEBPACK_IMPORTED_MODULE_2__[key]; }) }(__WEBPACK_IMPORT_KEY__));\n/* harmony import */ var _Logger__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./Logger */ \"./src/api/Logger.ts\");\n/* harmony import */ var _Logger__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_Logger__WEBPACK_IMPORTED_MODULE_3__);\n/* harmony reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in _Logger__WEBPACK_IMPORTED_MODULE_3__) if([\"default\"].indexOf(__WEBPACK_IMPORT_KEY__) < 0) (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return _Logger__WEBPACK_IMPORTED_MODULE_3__[key]; }) }(__WEBPACK_IMPORT_KEY__));\n/* harmony import */ var _Manager__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./Manager */ \"./src/api/Manager.ts\");\n/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, \"Manager\", function() { return _Manager__WEBPACK_IMPORTED_MODULE_4__[\"Manager\"]; });\n\n/* harmony import */ var _LoggerEvent__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./LoggerEvent */ \"./src/api/LoggerEvent.ts\");\n/* harmony import */ var _LoggerEvent__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_LoggerEvent__WEBPACK_IMPORTED_MODULE_5__);\n/* harmony reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in _LoggerEvent__WEBPACK_IMPORTED_MODULE_5__) if([\"default\",\"Manager\"].indexOf(__WEBPACK_IMPORT_KEY__) < 0) (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return _LoggerEvent__WEBPACK_IMPORTED_MODULE_5__[key]; }) }(__WEBPACK_IMPORT_KEY__));\n/* harmony import */ var _LoggerEventExporter__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./LoggerEventExporter */ \"./src/api/LoggerEventExporter.ts\");\n/* harmony import */ var _LoggerEventExporter__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(_LoggerEventExporter__WEBPACK_IMPORTED_MODULE_6__);\n/* harmony reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in _LoggerEventExporter__WEBPACK_IMPORTED_MODULE_6__) if([\"default\",\"Manager\"].indexOf(__WEBPACK_IMPORT_KEY__) < 0) (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return _LoggerEventExporter__WEBPACK_IMPORTED_MODULE_6__[key]; }) }(__WEBPACK_IMPORT_KEY__));\n/* harmony import */ var _ExportResult__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./ExportResult */ \"./src/api/ExportResult.ts\");\n/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, \"ExportResult\", function() { return _ExportResult__WEBPACK_IMPORTED_MODULE_7__[\"ExportResult\"]; });\n\n/* harmony import */ var _consts__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./consts */ \"./src/api/consts.ts\");\n/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, \"EventType\", function() { return _consts__WEBPACK_IMPORTED_MODULE_8__[\"EventType\"]; });\n\n/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, \"AlertLevel\", function() { return _consts__WEBPACK_IMPORTED_MODULE_8__[\"AlertLevel\"]; });\n\n/* harmony import */ var _opentelemetry__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./opentelemetry */ \"./src/api/opentelemetry.ts\");\n/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, \"TraceFlags\", function() { return _opentelemetry__WEBPACK_IMPORTED_MODULE_9__[\"TraceFlags\"]; });\n\n/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, \"SpanContext\", function() { return _opentelemetry__WEBPACK_IMPORTED_MODULE_9__[\"SpanContext\"]; });\n\n/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, \"Attributes\", function() { return _opentelemetry__WEBPACK_IMPORTED_MODULE_9__[\"Attributes\"]; });\n\n/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, \"SpanKind\", function() { return _opentelemetry__WEBPACK_IMPORTED_MODULE_9__[\"SpanKind\"]; });\n\n/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, \"TimeInput\", function() { return _opentelemetry__WEBPACK_IMPORTED_MODULE_9__[\"TimeInput\"]; });\n\n/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, \"CanonicalCode\", function() { return _opentelemetry__WEBPACK_IMPORTED_MODULE_9__[\"CanonicalCode\"]; });\n\n/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, \"Sampler\", function() { return _opentelemetry__WEBPACK_IMPORTED_MODULE_9__[\"Sampler\"]; });\n\n\n\n\n\n\n\n\n\n\n\n\n//# sourceURL=webpack:///./src/api/index.ts?");

/***/ }),

/***/ "./src/api/opentelemetry.ts":
/*!**********************************!*\
  !*** ./src/api/opentelemetry.ts ***!
  \**********************************/
/*! exports provided: TraceFlags, SpanContext, Attributes, SpanKind, TimeInput, CanonicalCode, Sampler */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _opentelemetry_api_build_src_trace_trace_flags__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @opentelemetry/api/build/src/trace/trace_flags */ \"./node_modules/@opentelemetry/api/build/src/trace/trace_flags.js\");\n/* harmony import */ var _opentelemetry_api_build_src_trace_trace_flags__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_opentelemetry_api_build_src_trace_trace_flags__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, \"TraceFlags\", function() { return _opentelemetry_api_build_src_trace_trace_flags__WEBPACK_IMPORTED_MODULE_0__[\"TraceFlags\"]; });\n\n/* harmony import */ var _opentelemetry_api_build_src_trace_span_context__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @opentelemetry/api/build/src/trace/span_context */ \"./node_modules/@opentelemetry/api/build/src/trace/span_context.js\");\n/* harmony import */ var _opentelemetry_api_build_src_trace_span_context__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_opentelemetry_api_build_src_trace_span_context__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, \"SpanContext\", function() { return _opentelemetry_api_build_src_trace_span_context__WEBPACK_IMPORTED_MODULE_1__[\"SpanContext\"]; });\n\n/* harmony import */ var _opentelemetry_api_build_src_trace_attributes__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @opentelemetry/api/build/src/trace/attributes */ \"./node_modules/@opentelemetry/api/build/src/trace/attributes.js\");\n/* harmony import */ var _opentelemetry_api_build_src_trace_attributes__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_opentelemetry_api_build_src_trace_attributes__WEBPACK_IMPORTED_MODULE_2__);\n/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, \"Attributes\", function() { return _opentelemetry_api_build_src_trace_attributes__WEBPACK_IMPORTED_MODULE_2__[\"Attributes\"]; });\n\n/* harmony import */ var _opentelemetry_api_build_src_trace_span_kind__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @opentelemetry/api/build/src/trace/span_kind */ \"./node_modules/@opentelemetry/api/build/src/trace/span_kind.js\");\n/* harmony import */ var _opentelemetry_api_build_src_trace_span_kind__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_opentelemetry_api_build_src_trace_span_kind__WEBPACK_IMPORTED_MODULE_3__);\n/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, \"SpanKind\", function() { return _opentelemetry_api_build_src_trace_span_kind__WEBPACK_IMPORTED_MODULE_3__[\"SpanKind\"]; });\n\n/* harmony import */ var _opentelemetry_api_build_src_common_Time__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @opentelemetry/api/build/src/common/Time */ \"./node_modules/@opentelemetry/api/build/src/common/Time.js\");\n/* harmony import */ var _opentelemetry_api_build_src_common_Time__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_opentelemetry_api_build_src_common_Time__WEBPACK_IMPORTED_MODULE_4__);\n/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, \"TimeInput\", function() { return _opentelemetry_api_build_src_common_Time__WEBPACK_IMPORTED_MODULE_4__[\"TimeInput\"]; });\n\n/* harmony import */ var _opentelemetry_api_build_src_trace_status__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @opentelemetry/api/build/src/trace/status */ \"./node_modules/@opentelemetry/api/build/src/trace/status.js\");\n/* harmony import */ var _opentelemetry_api_build_src_trace_status__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_opentelemetry_api_build_src_trace_status__WEBPACK_IMPORTED_MODULE_5__);\n/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, \"CanonicalCode\", function() { return _opentelemetry_api_build_src_trace_status__WEBPACK_IMPORTED_MODULE_5__[\"CanonicalCode\"]; });\n\n/* harmony import */ var _opentelemetry_api_build_src_trace_Sampler__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @opentelemetry/api/build/src/trace/Sampler */ \"./node_modules/@opentelemetry/api/build/src/trace/Sampler.js\");\n/* harmony import */ var _opentelemetry_api_build_src_trace_Sampler__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(_opentelemetry_api_build_src_trace_Sampler__WEBPACK_IMPORTED_MODULE_6__);\n/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, \"Sampler\", function() { return _opentelemetry_api_build_src_trace_Sampler__WEBPACK_IMPORTED_MODULE_6__[\"Sampler\"]; });\n\n\n\n\n\n\n\n\n\n//# sourceURL=webpack:///./src/api/opentelemetry.ts?");

/***/ }),

/***/ "./src/consts/Tags.ts":
/*!****************************!*\
  !*** ./src/consts/Tags.ts ***!
  \****************************/
/*! exports provided: TAG_USER_ID, TAG_USER_NAME, TAG_USER_OS_NAME, TAG_USER_OS_VERSION, TAG_USER_PLATFORM_NAME, TAG_USER_PLATFORM_VERSION, TAG_USER_DEVICE, TAG_USER_LOCALE, TAG_USER_CITY, TAG_USER_COUNTRY, TAG_USER_SCREEN_DPR, TAG_USER_SCREEN_RESOLUTION, TAG_USER_NET_TYPE, TAG_USER_NET_VENDOR, TAG_IDC */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"TAG_USER_ID\", function() { return TAG_USER_ID; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"TAG_USER_NAME\", function() { return TAG_USER_NAME; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"TAG_USER_OS_NAME\", function() { return TAG_USER_OS_NAME; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"TAG_USER_OS_VERSION\", function() { return TAG_USER_OS_VERSION; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"TAG_USER_PLATFORM_NAME\", function() { return TAG_USER_PLATFORM_NAME; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"TAG_USER_PLATFORM_VERSION\", function() { return TAG_USER_PLATFORM_VERSION; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"TAG_USER_DEVICE\", function() { return TAG_USER_DEVICE; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"TAG_USER_LOCALE\", function() { return TAG_USER_LOCALE; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"TAG_USER_CITY\", function() { return TAG_USER_CITY; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"TAG_USER_COUNTRY\", function() { return TAG_USER_COUNTRY; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"TAG_USER_SCREEN_DPR\", function() { return TAG_USER_SCREEN_DPR; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"TAG_USER_SCREEN_RESOLUTION\", function() { return TAG_USER_SCREEN_RESOLUTION; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"TAG_USER_NET_TYPE\", function() { return TAG_USER_NET_TYPE; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"TAG_USER_NET_VENDOR\", function() { return TAG_USER_NET_VENDOR; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"TAG_IDC\", function() { return TAG_IDC; });\n/**\n * 用户的 Tags 常量\n */\nvar TAG_USER_ID = 'user.id';\nvar TAG_USER_NAME = 'user.name';\nvar TAG_USER_OS_NAME = 'user.os.name';\nvar TAG_USER_OS_VERSION = 'user.os.version'; // like chrome, safari, wechat, lark, dingding\n\nvar TAG_USER_PLATFORM_NAME = 'user.platform.name';\nvar TAG_USER_PLATFORM_VERSION = 'user.platform.version'; // iPhone/Huawei/Samsung etc\n\nvar TAG_USER_DEVICE = 'user.device'; // zh-CN, en-US etc\n\nvar TAG_USER_LOCALE = 'user.locale';\nvar TAG_USER_CITY = 'user.city';\nvar TAG_USER_COUNTRY = 'user.country'; // devicePixelRatio\n\nvar TAG_USER_SCREEN_DPR = 'user.screen.dpr'; // 屏幕分辨率， 1024*768\n\nvar TAG_USER_SCREEN_RESOLUTION = 'user.screen.resolution'; // net environment, maybe wifi/3g/4g/5g\n\nvar TAG_USER_NET_TYPE = 'user.net.type'; // 网络厂商，联通/移动\n\nvar TAG_USER_NET_VENDOR = 'user.net.vendor';\n/**\n * 服务器环境的 Tags 常量\n */\n// 数据中心机房分布\n\nvar TAG_IDC = 'env.idc';\n\n//# sourceURL=webpack:///./src/consts/Tags.ts?");

/***/ }),

/***/ "./src/consts/index.ts":
/*!*****************************!*\
  !*** ./src/consts/index.ts ***!
  \*****************************/
/*! exports provided: TAG_USER_ID, TAG_USER_NAME, TAG_USER_OS_NAME, TAG_USER_OS_VERSION, TAG_USER_PLATFORM_NAME, TAG_USER_PLATFORM_VERSION, TAG_USER_DEVICE, TAG_USER_LOCALE, TAG_USER_CITY, TAG_USER_COUNTRY, TAG_USER_SCREEN_DPR, TAG_USER_SCREEN_RESOLUTION, TAG_USER_NET_TYPE, TAG_USER_NET_VENDOR, TAG_IDC */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _Tags__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Tags */ \"./src/consts/Tags.ts\");\n/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, \"TAG_USER_ID\", function() { return _Tags__WEBPACK_IMPORTED_MODULE_0__[\"TAG_USER_ID\"]; });\n\n/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, \"TAG_USER_NAME\", function() { return _Tags__WEBPACK_IMPORTED_MODULE_0__[\"TAG_USER_NAME\"]; });\n\n/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, \"TAG_USER_OS_NAME\", function() { return _Tags__WEBPACK_IMPORTED_MODULE_0__[\"TAG_USER_OS_NAME\"]; });\n\n/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, \"TAG_USER_OS_VERSION\", function() { return _Tags__WEBPACK_IMPORTED_MODULE_0__[\"TAG_USER_OS_VERSION\"]; });\n\n/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, \"TAG_USER_PLATFORM_NAME\", function() { return _Tags__WEBPACK_IMPORTED_MODULE_0__[\"TAG_USER_PLATFORM_NAME\"]; });\n\n/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, \"TAG_USER_PLATFORM_VERSION\", function() { return _Tags__WEBPACK_IMPORTED_MODULE_0__[\"TAG_USER_PLATFORM_VERSION\"]; });\n\n/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, \"TAG_USER_DEVICE\", function() { return _Tags__WEBPACK_IMPORTED_MODULE_0__[\"TAG_USER_DEVICE\"]; });\n\n/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, \"TAG_USER_LOCALE\", function() { return _Tags__WEBPACK_IMPORTED_MODULE_0__[\"TAG_USER_LOCALE\"]; });\n\n/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, \"TAG_USER_CITY\", function() { return _Tags__WEBPACK_IMPORTED_MODULE_0__[\"TAG_USER_CITY\"]; });\n\n/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, \"TAG_USER_COUNTRY\", function() { return _Tags__WEBPACK_IMPORTED_MODULE_0__[\"TAG_USER_COUNTRY\"]; });\n\n/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, \"TAG_USER_SCREEN_DPR\", function() { return _Tags__WEBPACK_IMPORTED_MODULE_0__[\"TAG_USER_SCREEN_DPR\"]; });\n\n/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, \"TAG_USER_SCREEN_RESOLUTION\", function() { return _Tags__WEBPACK_IMPORTED_MODULE_0__[\"TAG_USER_SCREEN_RESOLUTION\"]; });\n\n/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, \"TAG_USER_NET_TYPE\", function() { return _Tags__WEBPACK_IMPORTED_MODULE_0__[\"TAG_USER_NET_TYPE\"]; });\n\n/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, \"TAG_USER_NET_VENDOR\", function() { return _Tags__WEBPACK_IMPORTED_MODULE_0__[\"TAG_USER_NET_VENDOR\"]; });\n\n/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, \"TAG_IDC\", function() { return _Tags__WEBPACK_IMPORTED_MODULE_0__[\"TAG_IDC\"]; });\n\n\n\n//# sourceURL=webpack:///./src/consts/index.ts?");

/***/ }),

/***/ "./src/exporters/ConsoleExporterNode.ts":
/*!**********************************************!*\
  !*** ./src/exporters/ConsoleExporterNode.ts ***!
  \**********************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"default\", function() { return ConsoleExporterNode; });\n/* harmony import */ var _api__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../api */ \"./src/api/index.ts\");\n/* harmony import */ var _console__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./console */ \"./src/exporters/console.ts\");\nfunction _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError(\"Cannot call a class as a function\"); } }\n\nfunction _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if (\"value\" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }\n\nfunction _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }\n\n\n\n\nvar ConsoleExporterNode = /*#__PURE__*/function () {\n  function ConsoleExporterNode() {\n    _classCallCheck(this, ConsoleExporterNode);\n\n    Object.defineProperty(this, \"stoped\", {\n      enumerable: true,\n      writable: true,\n      value: false\n    });\n  }\n\n  _createClass(ConsoleExporterNode, [{\n    key: \"export\",\n    value: function _export(evts, cb) {\n      if (this.stoped) {\n        return;\n      }\n\n      evts.forEach(_console__WEBPACK_IMPORTED_MODULE_1__[\"adaptToNodeConsole\"]);\n\n      if (cb) {\n        cb(_api__WEBPACK_IMPORTED_MODULE_0__[\"ExportResult\"].SUCCESS);\n      }\n    }\n  }, {\n    key: \"shutdown\",\n    value: function shutdown() {\n      this.stoped = true;\n    }\n  }]);\n\n  return ConsoleExporterNode;\n}();\n\n\n\n//# sourceURL=webpack:///./src/exporters/ConsoleExporterNode.ts?");

/***/ }),

/***/ "./src/exporters/ConsoleExporterWeb.ts":
/*!*********************************************!*\
  !*** ./src/exporters/ConsoleExporterWeb.ts ***!
  \*********************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"default\", function() { return ConsoleExporterNode; });\n/* harmony import */ var _api__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../api */ \"./src/api/index.ts\");\n/* harmony import */ var _console__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./console */ \"./src/exporters/console.ts\");\nfunction _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError(\"Cannot call a class as a function\"); } }\n\nfunction _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if (\"value\" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }\n\nfunction _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }\n\n\n\n\nvar ConsoleExporterNode = /*#__PURE__*/function () {\n  function ConsoleExporterNode() {\n    _classCallCheck(this, ConsoleExporterNode);\n\n    Object.defineProperty(this, \"stoped\", {\n      enumerable: true,\n      writable: true,\n      value: false\n    });\n  }\n\n  _createClass(ConsoleExporterNode, [{\n    key: \"export\",\n    value: function _export(evts, cb) {\n      if (this.stoped) {\n        return;\n      }\n\n      evts.forEach(_console__WEBPACK_IMPORTED_MODULE_1__[\"adaptToBrowserConsole\"]);\n\n      if (cb) {\n        cb(_api__WEBPACK_IMPORTED_MODULE_0__[\"ExportResult\"].SUCCESS);\n      }\n    }\n  }, {\n    key: \"shutdown\",\n    value: function shutdown() {\n      this.stoped = true;\n    }\n  }]);\n\n  return ConsoleExporterNode;\n}();\n\n\n\n//# sourceURL=webpack:///./src/exporters/ConsoleExporterWeb.ts?");

/***/ }),

/***/ "./src/exporters/console.ts":
/*!**********************************!*\
  !*** ./src/exporters/console.ts ***!
  \**********************************/
/*! exports provided: AlertLevelTitleMap, formatBrowserConsole, formatNodeConsole, adaptToJSConsole, adaptToBrowserConsole, adaptToNodeConsole */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"AlertLevelTitleMap\", function() { return AlertLevelTitleMap; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"formatBrowserConsole\", function() { return formatBrowserConsole; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"formatNodeConsole\", function() { return formatNodeConsole; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"adaptToJSConsole\", function() { return adaptToJSConsole; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"adaptToBrowserConsole\", function() { return adaptToBrowserConsole; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"adaptToNodeConsole\", function() { return adaptToNodeConsole; });\n/* harmony import */ var _api__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../api */ \"./src/api/index.ts\");\nvar _AlertLevelTitleMap;\n\nfunction _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }\n\nfunction _nonIterableSpread() { throw new TypeError(\"Invalid attempt to spread non-iterable instance.\\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.\"); }\n\nfunction _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === \"string\") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === \"Object\" && o.constructor) n = o.constructor.name; if (n === \"Map\" || n === \"Set\") return Array.from(o); if (n === \"Arguments\" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }\n\nfunction _iterableToArray(iter) { if (typeof Symbol !== \"undefined\" && Symbol.iterator in Object(iter)) return Array.from(iter); }\n\nfunction _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }\n\nfunction _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }\n\nfunction _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }\n\n\n\nfunction formatSection(evt) {\n  var attrs = evt.attributes || {};\n  var spanName = attrs.spanName ? '|' + attrs.spanName : '';\n  var spanId = attrs.spanId ? '|' + attrs.spanId : '';\n  return \"\".concat(attrs.loggerName).concat(spanId).concat(spanName);\n}\n\nvar AlertLevelTitleMap = (_AlertLevelTitleMap = {}, _defineProperty(_AlertLevelTitleMap, _api__WEBPACK_IMPORTED_MODULE_0__[\"AlertLevel\"].Debug, 'DEBUG'), _defineProperty(_AlertLevelTitleMap, _api__WEBPACK_IMPORTED_MODULE_0__[\"AlertLevel\"].Info, 'INFO'), _defineProperty(_AlertLevelTitleMap, _api__WEBPACK_IMPORTED_MODULE_0__[\"AlertLevel\"].Warn, 'WARN'), _defineProperty(_AlertLevelTitleMap, _api__WEBPACK_IMPORTED_MODULE_0__[\"AlertLevel\"].Error, 'ERROR'), _AlertLevelTitleMap);\n/**\n * format evt to be a colorful output in browser console\n * @param evt\n */\n\nfunction formatBrowserConsole(evt) {\n  var statusColor = evt.level < _api__WEBPACK_IMPORTED_MODULE_0__[\"AlertLevel\"].Warn ? '#bbbbbb' : '#FF7043';\n  return [\"%c\".concat(AlertLevelTitleMap[evt.level], \" \").concat(formatSection(evt)), \"font-weight: bold; color: \".concat(statusColor, \";\"), \"\\\"\".concat(evt.message || 'no message', \"\\\"\"), evt];\n}\n/**\n * format evt to be a colorful output in node console\n * @param evt\n */\n\nfunction formatNodeConsole(evt) {\n  var statusColor = evt.level < _api__WEBPACK_IMPORTED_MODULE_0__[\"AlertLevel\"].Warn ? '32' : '31';\n  return [\"\\x1B[\".concat(statusColor, \"m\").concat(AlertLevelTitleMap[evt.level], \"\\x1B[0m\"), formatSection(evt), \"\\\"\".concat(evt.message || 'no message', \"\\\"\"), evt];\n}\n/* tslint:disable: no-console */\n\nfunction adaptToJSConsole(evt, format) {\n  var _console2, _console3, _console4, _console5;\n\n  if (evt.level >= _api__WEBPACK_IMPORTED_MODULE_0__[\"AlertLevel\"].Error) {\n    var _console;\n\n    // 这里不使用 console.error() 是因为像 sentry\n    // 等工具会拦截该方法，从而导致重复上报\n    (_console = console).warn.apply(_console, _toConsumableArray(format(evt)));\n\n    return;\n  }\n\n  switch (evt.level) {\n    case _api__WEBPACK_IMPORTED_MODULE_0__[\"AlertLevel\"].Debug:\n      (_console2 = console).debug.apply(_console2, _toConsumableArray(format(evt)));\n\n      break;\n\n    case _api__WEBPACK_IMPORTED_MODULE_0__[\"AlertLevel\"].Info:\n      (_console3 = console).info.apply(_console3, _toConsumableArray(format(evt)));\n\n      break;\n\n    case _api__WEBPACK_IMPORTED_MODULE_0__[\"AlertLevel\"].Warn:\n      (_console4 = console).warn.apply(_console4, _toConsumableArray(format(evt)));\n\n      break;\n\n    default:\n      (_console5 = console).info.apply(_console5, _toConsumableArray(format(evt)));\n\n      break;\n  }\n}\n/* tslint:enable */\n\nfunction adaptToBrowserConsole(evt) {\n  adaptToJSConsole(evt, formatBrowserConsole);\n}\nfunction adaptToNodeConsole(evt) {\n  adaptToJSConsole(evt, formatNodeConsole);\n}\n\n//# sourceURL=webpack:///./src/exporters/console.ts?");

/***/ }),

/***/ "./src/index.ts":
/*!**********************!*\
  !*** ./src/index.ts ***!
  \**********************/
/*! no static exports found */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _api__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./api */ \"./src/api/index.ts\");\n/* harmony import */ var _SimpleLogger__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./SimpleLogger */ \"./src/SimpleLogger.ts\");\n/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, \"SimpleLogger\", function() { return _SimpleLogger__WEBPACK_IMPORTED_MODULE_1__[\"default\"]; });\n\n/* harmony import */ var _SimpleTracer__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./SimpleTracer */ \"./src/SimpleTracer.ts\");\n/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, \"SimpleTracer\", function() { return _SimpleTracer__WEBPACK_IMPORTED_MODULE_2__[\"default\"]; });\n\n/* harmony import */ var _exporters_ConsoleExporterWeb__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./exporters/ConsoleExporterWeb */ \"./src/exporters/ConsoleExporterWeb.ts\");\n/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, \"ConsoleExporterWeb\", function() { return _exporters_ConsoleExporterWeb__WEBPACK_IMPORTED_MODULE_3__[\"default\"]; });\n\n/* harmony import */ var _exporters_ConsoleExporterNode__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./exporters/ConsoleExporterNode */ \"./src/exporters/ConsoleExporterNode.ts\");\n/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, \"ConsoleExporterNode\", function() { return _exporters_ConsoleExporterNode__WEBPACK_IMPORTED_MODULE_4__[\"default\"]; });\n\n/* harmony reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in _api__WEBPACK_IMPORTED_MODULE_0__) if([\"default\",\"ConsoleExporterWeb\",\"ConsoleExporterNode\",\"SimpleLogger\",\"SimpleTracer\"].indexOf(__WEBPACK_IMPORT_KEY__) < 0) (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return _api__WEBPACK_IMPORTED_MODULE_0__[key]; }) }(__WEBPACK_IMPORT_KEY__));\n/* harmony import */ var _consts__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./consts */ \"./src/consts/index.ts\");\n/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, \"TAG_USER_ID\", function() { return _consts__WEBPACK_IMPORTED_MODULE_5__[\"TAG_USER_ID\"]; });\n\n/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, \"TAG_USER_NAME\", function() { return _consts__WEBPACK_IMPORTED_MODULE_5__[\"TAG_USER_NAME\"]; });\n\n/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, \"TAG_USER_OS_NAME\", function() { return _consts__WEBPACK_IMPORTED_MODULE_5__[\"TAG_USER_OS_NAME\"]; });\n\n/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, \"TAG_USER_OS_VERSION\", function() { return _consts__WEBPACK_IMPORTED_MODULE_5__[\"TAG_USER_OS_VERSION\"]; });\n\n/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, \"TAG_USER_PLATFORM_NAME\", function() { return _consts__WEBPACK_IMPORTED_MODULE_5__[\"TAG_USER_PLATFORM_NAME\"]; });\n\n/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, \"TAG_USER_PLATFORM_VERSION\", function() { return _consts__WEBPACK_IMPORTED_MODULE_5__[\"TAG_USER_PLATFORM_VERSION\"]; });\n\n/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, \"TAG_USER_DEVICE\", function() { return _consts__WEBPACK_IMPORTED_MODULE_5__[\"TAG_USER_DEVICE\"]; });\n\n/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, \"TAG_USER_LOCALE\", function() { return _consts__WEBPACK_IMPORTED_MODULE_5__[\"TAG_USER_LOCALE\"]; });\n\n/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, \"TAG_USER_CITY\", function() { return _consts__WEBPACK_IMPORTED_MODULE_5__[\"TAG_USER_CITY\"]; });\n\n/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, \"TAG_USER_COUNTRY\", function() { return _consts__WEBPACK_IMPORTED_MODULE_5__[\"TAG_USER_COUNTRY\"]; });\n\n/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, \"TAG_USER_SCREEN_DPR\", function() { return _consts__WEBPACK_IMPORTED_MODULE_5__[\"TAG_USER_SCREEN_DPR\"]; });\n\n/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, \"TAG_USER_SCREEN_RESOLUTION\", function() { return _consts__WEBPACK_IMPORTED_MODULE_5__[\"TAG_USER_SCREEN_RESOLUTION\"]; });\n\n/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, \"TAG_USER_NET_TYPE\", function() { return _consts__WEBPACK_IMPORTED_MODULE_5__[\"TAG_USER_NET_TYPE\"]; });\n\n/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, \"TAG_USER_NET_VENDOR\", function() { return _consts__WEBPACK_IMPORTED_MODULE_5__[\"TAG_USER_NET_VENDOR\"]; });\n\n/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, \"TAG_IDC\", function() { return _consts__WEBPACK_IMPORTED_MODULE_5__[\"TAG_IDC\"]; });\n\n/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./utils */ \"./src/utils.ts\");\n/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, \"isTimeInputHrTime\", function() { return _utils__WEBPACK_IMPORTED_MODULE_6__[\"isTimeInputHrTime\"]; });\n\n/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, \"getMillisecondsTime\", function() { return _utils__WEBPACK_IMPORTED_MODULE_6__[\"getMillisecondsTime\"]; });\n\n/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, \"isMetricEvent\", function() { return _utils__WEBPACK_IMPORTED_MODULE_6__[\"isMetricEvent\"]; });\n\n\n\n\n\n\n\n\n\n\nvar manager = new _api__WEBPACK_IMPORTED_MODULE_0__[\"Manager\"]();\nmanager.setLogger(new _SimpleLogger__WEBPACK_IMPORTED_MODULE_1__[\"default\"]());\nmanager.setTracer(new _SimpleTracer__WEBPACK_IMPORTED_MODULE_2__[\"default\"]());\n/* harmony default export */ __webpack_exports__[\"default\"] = (manager);\n\n//# sourceURL=webpack:///./src/index.ts?");

/***/ }),

/***/ "./src/utils.ts":
/*!**********************!*\
  !*** ./src/utils.ts ***!
  \**********************/
/*! exports provided: isTimeInputHrTime, getMillisecondsTime, isMetricEvent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"isTimeInputHrTime\", function() { return isTimeInputHrTime; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"getMillisecondsTime\", function() { return getMillisecondsTime; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"isMetricEvent\", function() { return isMetricEvent; });\n/* harmony import */ var _api__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./api */ \"./src/api/index.ts\");\n\nfunction isTimeInputHrTime(time) {\n  return Array.isArray(time) && time.length === 2;\n}\nfunction getMillisecondsTime(time) {\n  return time && isTimeInputHrTime(time) ? time[0] * 1e3 + time[1] / 1e6 : time;\n}\nfunction isMetricEvent(evt) {\n  return evt && (evt.type === _api__WEBPACK_IMPORTED_MODULE_0__[\"EventType\"].Count || evt.type === _api__WEBPACK_IMPORTED_MODULE_0__[\"EventType\"].Store || evt.type === _api__WEBPACK_IMPORTED_MODULE_0__[\"EventType\"].Timing);\n}\n\n//# sourceURL=webpack:///./src/utils.ts?");

/***/ })

/******/ });