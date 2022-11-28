import {
  Links,
  Main,
  Meta,
  Scripts,
  Title,
  __export,
  createAxiosInstance,
  createModel,
  createStore,
  defineAppConfig,
  runtime_default,
  runtime_default2,
  setAxiosInstance
} from "./chunk-TSAEMROI.mjs";

// .ice/env.server.ts
process.env.ICE_CORE_MODE = "development";
process.env.ICE_CORE_ROUTER = "true";
process.env.ICE_CORE_ERROR_BOUNDARY = "false";
process.env.ICE_CORE_INITIAL_DATA = "true";
process.env.ICE_CORE_DEV_PORT = "3001";

// .ice/entry.server.ts
import * as runtime2 from "@ice/runtime/server";

// node_modules/@ice/plugin-request/esm/runtime.js
var EXPORT_NAME = "requestConfig";
var runtime = async ({ appContext }) => {
  const { appExport } = appContext;
  const exported = appExport[EXPORT_NAME];
  const requestConfig = (typeof exported === "function" ? await exported() : exported) || {};
  if (Array.isArray(requestConfig)) {
    requestConfig.forEach((requestItem) => {
      const instanceName = requestItem.instanceName ? requestItem.instanceName : "default";
      if (instanceName) {
        const axiosInstance = createAxiosInstance(instanceName)[instanceName];
        setAxiosInstance(requestItem, axiosInstance);
      }
    });
  } else {
    const axiosInstance = createAxiosInstance().default;
    setAxiosInstance(requestConfig, axiosInstance);
  }
};
var runtime_default3 = runtime;

// .ice/runtimeModules.ts
var statics = [
  runtime_default3
];
var commons = [
  runtime_default,
  runtime_default2
];

// src/app.ts
var app_exports = {};
__export(app_exports, {
  default: () => app_default
});
var app_default = defineAppConfig(() => ({}));

// src/document.tsx
import { jsxDEV as _jsxDEV } from "@ice/runtime/jsx-dev-runtime";
function Document() {
  return /* @__PURE__ */ _jsxDEV("html", {
    children: [
      /* @__PURE__ */ _jsxDEV("head", {
        children: [
          /* @__PURE__ */ _jsxDEV("meta", {
            charSet: "utf-8"
          }, void 0, false, {
            fileName: "/Users/mamba/workspace/mse/ice-app/src/document.tsx",
            lineNumber: 7,
            columnNumber: 9
          }, this),
          /* @__PURE__ */ _jsxDEV("meta", {
            name: "description",
            content: "ice.js 3 pro scaffold"
          }, void 0, false, {
            fileName: "/Users/mamba/workspace/mse/ice-app/src/document.tsx",
            lineNumber: 8,
            columnNumber: 9
          }, this),
          /* @__PURE__ */ _jsxDEV("link", {
            rel: "icon",
            href: "/favicon.ico",
            type: "image/x-icon"
          }, void 0, false, {
            fileName: "/Users/mamba/workspace/mse/ice-app/src/document.tsx",
            lineNumber: 9,
            columnNumber: 9
          }, this),
          /* @__PURE__ */ _jsxDEV("meta", {
            name: "viewport",
            content: "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no"
          }, void 0, false, {
            fileName: "/Users/mamba/workspace/mse/ice-app/src/document.tsx",
            lineNumber: 10,
            columnNumber: 9
          }, this),
          /* @__PURE__ */ _jsxDEV(Meta, {}, void 0, false, {
            fileName: "/Users/mamba/workspace/mse/ice-app/src/document.tsx",
            lineNumber: 11,
            columnNumber: 9
          }, this),
          /* @__PURE__ */ _jsxDEV(Title, {}, void 0, false, {
            fileName: "/Users/mamba/workspace/mse/ice-app/src/document.tsx",
            lineNumber: 12,
            columnNumber: 9
          }, this),
          /* @__PURE__ */ _jsxDEV(Links, {}, void 0, false, {
            fileName: "/Users/mamba/workspace/mse/ice-app/src/document.tsx",
            lineNumber: 13,
            columnNumber: 9
          }, this)
        ]
      }, void 0, true, {
        fileName: "/Users/mamba/workspace/mse/ice-app/src/document.tsx",
        lineNumber: 6,
        columnNumber: 7
      }, this),
      /* @__PURE__ */ _jsxDEV("body", {
        children: [
          /* @__PURE__ */ _jsxDEV(Main, {}, void 0, false, {
            fileName: "/Users/mamba/workspace/mse/ice-app/src/document.tsx",
            lineNumber: 16,
            columnNumber: 9
          }, this),
          /* @__PURE__ */ _jsxDEV(Scripts, {}, void 0, false, {
            fileName: "/Users/mamba/workspace/mse/ice-app/src/document.tsx",
            lineNumber: 17,
            columnNumber: 9
          }, this)
        ]
      }, void 0, true, {
        fileName: "/Users/mamba/workspace/mse/ice-app/src/document.tsx",
        lineNumber: 15,
        columnNumber: 7
      }, this)
    ]
  }, void 0, true, {
    fileName: "/Users/mamba/workspace/mse/ice-app/src/document.tsx",
    lineNumber: 5,
    columnNumber: 5
  }, this);
}

// asset-manifest:virtual:assets-manifest.json
var virtual_assets_manifest_default = { publicPath: "/", entries: { main: ["js/framework.js", "css/c8f226dc.css", "js/vendors-node_modules_ice_bundles_compiled_pmmmwh_react-refresh-webpack-plugin_lib_runtime_Ref-1bfb3e.js", "css/main.css", "js/main.js"] }, pages: { layout: ["js/66153dc7.js", "js/vendors-node_modules_antd_es_index_js-node_modules_moment_dist_locale_af_js-node_modules_mome-33da60.js", "js/vendors-node_modules_ant-design_icons_es_index_js-node_modules_babel_runtime_helpers_typeof_js.js", "css/vendors-node_modules_ant-design_pro-utils_es_useEditableArray_index_js-node_modules_umijs_use-2911dc.css", "js/vendors-node_modules_ant-design_pro-utils_es_useEditableArray_index_js-node_modules_umijs_use-2911dc.js", "css/vendors-node_modules_ant-design_pro-layout_es_components_FooterToolbar_index_js.css", "js/vendors-node_modules_ant-design_pro-layout_es_components_FooterToolbar_index_js.js", "css/layout.css", "js/layout.js"], "success-index": ["js/vendors-node_modules_antd_es_index_js-node_modules_moment_dist_locale_af_js-node_modules_mome-33da60.js", "js/success-index.js"], "login-index": ["js/vendors-node_modules_antd_es_index_js-node_modules_moment_dist_locale_af_js-node_modules_mome-33da60.js", "js/vendors-node_modules_ant-design_icons_es_index_js-node_modules_babel_runtime_helpers_typeof_js.js", "css/vendors-node_modules_ant-design_pro-utils_es_useEditableArray_index_js-node_modules_umijs_use-2911dc.css", "js/vendors-node_modules_ant-design_pro-utils_es_useEditableArray_index_js-node_modules_umijs_use-2911dc.js", "js/vendors-node_modules_lodash_each_js-node_modules_lodash_merge_js-node_modules_reactcss_lib_in-0f2c29.js", "css/vendors-node_modules_ant-design_pro-form_es_index_js.css", "js/vendors-node_modules_ant-design_pro-form_es_index_js.js", "css/login-index.css", "js/login-index.js"], "form-index": ["js/66153dc7.js", "js/vendors-node_modules_antd_es_index_js-node_modules_moment_dist_locale_af_js-node_modules_mome-33da60.js", "js/vendors-node_modules_ant-design_icons_es_index_js-node_modules_babel_runtime_helpers_typeof_js.js", "css/vendors-node_modules_ant-design_pro-utils_es_useEditableArray_index_js-node_modules_umijs_use-2911dc.css", "js/vendors-node_modules_ant-design_pro-utils_es_useEditableArray_index_js-node_modules_umijs_use-2911dc.js", "js/vendors-node_modules_lodash_each_js-node_modules_lodash_merge_js-node_modules_reactcss_lib_in-0f2c29.js", "css/vendors-node_modules_ant-design_pro-form_es_index_js.css", "js/vendors-node_modules_ant-design_pro-form_es_index_js.js", "css/vendors-node_modules_ant-design_pro-layout_es_components_FooterToolbar_index_js.css", "js/vendors-node_modules_ant-design_pro-layout_es_components_FooterToolbar_index_js.js", "js/form-index.js"], "list-index": ["js/66153dc7.js", "js/vendors-node_modules_antd_es_index_js-node_modules_moment_dist_locale_af_js-node_modules_mome-33da60.js", "js/vendors-node_modules_ant-design_icons_es_index_js-node_modules_babel_runtime_helpers_typeof_js.js", "css/vendors-node_modules_ant-design_pro-utils_es_useEditableArray_index_js-node_modules_umijs_use-2911dc.css", "js/vendors-node_modules_ant-design_pro-utils_es_useEditableArray_index_js-node_modules_umijs_use-2911dc.js", "js/vendors-node_modules_lodash_each_js-node_modules_lodash_merge_js-node_modules_reactcss_lib_in-0f2c29.js", "css/vendors-node_modules_ant-design_pro-form_es_index_js.css", "js/vendors-node_modules_ant-design_pro-form_es_index_js.js", "css/vendors-node_modules_ant-design_pro-layout_es_components_FooterToolbar_index_js.css", "js/vendors-node_modules_ant-design_pro-layout_es_components_FooterToolbar_index_js.js", "css/vendors-node_modules_ant-design_pro-table_es_index_js.css", "js/vendors-node_modules_ant-design_pro-table_es_index_js.js", "js/list-index.js"], index: ["js/ff39441c.js", "js/35fc8c20.js", "js/2c796e83.js", "js/29107295.js", "js/916b1988.js", "js/b637e9a5.js", "js/vendors-node_modules_antd_es_index_js-node_modules_moment_dist_locale_af_js-node_modules_mome-33da60.js", "js/vendors-node_modules_ant-design_icons_es_index_js-node_modules_babel_runtime_helpers_typeof_js.js", "js/vendors-node_modules_lodash_each_js-node_modules_lodash_merge_js-node_modules_reactcss_lib_in-0f2c29.js", "js/vendors-node_modules_ant-design_charts_es_index_js-node_modules_l7eval5_dist_esm_index_js.js", "css/index.css", "js/index.js"], $: ["js/vendors-node_modules_antd_es_index_js-node_modules_moment_dist_locale_af_js-node_modules_mome-33da60.js", "js/$.js"] }, assets: {}, dataLoader: "js/data-loader.js" };

// .ice/routes.ts
var routes_default = [
  {
    path: "",
    load: () => import(
      /* webpackChunkName: "layout" */
      "./layout-OKZE7G55.mjs"
    ),
    componentName: "layout",
    index: void 0,
    id: "layout",
    exact: true,
    exports: [
      "default"
    ],
    layout: true,
    children: [
      {
        path: "success",
        load: () => import(
          /* webpackChunkName: "success-index" */
          "./success-34ZV2X3I.mjs"
        ),
        componentName: "success-index",
        index: true,
        id: "success/index",
        exact: true,
        exports: [
          "default"
        ]
      },
      {
        path: "login",
        load: () => import(
          /* webpackChunkName: "login-index" */
          "./login-YGT7Y23D.mjs"
        ),
        componentName: "login-index",
        index: true,
        id: "login/index",
        exact: true,
        exports: [
          "default",
          "getConfig"
        ]
      },
      {
        path: "form",
        load: () => import(
          /* webpackChunkName: "form-index" */
          "./form-FWZ7AXFM.mjs"
        ),
        componentName: "form-index",
        index: true,
        id: "form/index",
        exact: true,
        exports: [
          "default",
          "pageConfig"
        ]
      },
      {
        path: "list",
        load: () => import(
          /* webpackChunkName: "list-index" */
          "./list-U5LEMNLB.mjs"
        ),
        componentName: "list-index",
        index: true,
        id: "list/index",
        exact: true,
        exports: [
          "default",
          "pageConfig"
        ]
      },
      {
        path: "",
        load: () => import(
          /* webpackChunkName: "index" */
          "./pages-DFCGAAGT.mjs"
        ),
        componentName: "index",
        index: true,
        id: "index",
        exact: true,
        exports: [
          "default",
          "pageConfig"
        ]
      },
      {
        path: "*",
        load: () => import(
          /* webpackChunkName: "$" */
          "./$-HFIWJYQI.mjs"
        ),
        componentName: "$",
        index: void 0,
        id: "$",
        exact: true,
        exports: [
          "default"
        ]
      }
    ]
  }
];

// .ice/routes-config.bundle.mjs
import { Link, Outlet, useParams, useSearchParams, useLocation, useNavigate } from "@ice/runtime/router";
import { defineAppConfig as defineAppConfig2, useAppData, useData, useConfig, Meta as Meta2, Title as Title2, Links as Links2, Scripts as Scripts2, Data, Main as Main2, history, KeepAliveOutlet, useMounted, ClientOnly, defineDataLoader, defineServerDataLoader, defineStaticDataLoader } from "@ice/runtime";
import * as React7 from "react";
import React6 from "react";
import React4 from "react";
import React2, { useMemo } from "react";
import React from "react";
import { useEffect, useLayoutEffect } from "react";
import React3, { useContext, useMemo as useMemo2, useRef, useReducer } from "react";
import { useContext as useContext3 } from "react";
import { useContext as useContext2 } from "react";
import { useReducer as useReducer2, useRef as useRef2, useMemo as useMemo3, useContext as useContext4, useDebugValue } from "react";
import { unstable_batchedUpdates } from "react-dom";
import React5 from "react";
import * as React9 from "react";
import * as React8 from "react";
import { createContext, useContext as useContext5 } from "react";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = {
    exports: {}
  }).exports, mod), mod.exports;
};
var __export2 = (target, all) => {
  for (var name in all)
    __defProp(target, name, {
      get: all[name],
      enumerable: true
    });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, {
          get: () => from[key],
          enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable
        });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", {
  value: mod,
  enumerable: true
}) : target, mod));
var require_bind = __commonJS({
  "node_modules/axios/lib/helpers/bind.js"(exports, module) {
    "use strict";
    module.exports = function bind(fn2, thisArg) {
      return function wrap() {
        var args = new Array(arguments.length);
        for (var i2 = 0; i2 < args.length; i2++) {
          args[i2] = arguments[i2];
        }
        return fn2.apply(thisArg, args);
      };
    };
  }
});
var require_utils = __commonJS({
  "node_modules/axios/lib/utils.js"(exports, module) {
    "use strict";
    var bind = require_bind();
    var toString = Object.prototype.toString;
    var kindOf2 = function(cache) {
      return function(thing) {
        var str = toString.call(thing);
        return cache[str] || (cache[str] = str.slice(8, -1).toLowerCase());
      };
    }(/* @__PURE__ */ Object.create(null));
    function kindOfTest(type) {
      type = type.toLowerCase();
      return function isKindOf(thing) {
        return kindOf2(thing) === type;
      };
    }
    function isArray(val) {
      return Array.isArray(val);
    }
    function isUndefined(val) {
      return typeof val === "undefined";
    }
    function isBuffer(val) {
      return val !== null && !isUndefined(val) && val.constructor !== null && !isUndefined(val.constructor) && typeof val.constructor.isBuffer === "function" && val.constructor.isBuffer(val);
    }
    var isArrayBuffer = kindOfTest("ArrayBuffer");
    function isArrayBufferView(val) {
      var result;
      if (typeof ArrayBuffer !== "undefined" && ArrayBuffer.isView) {
        result = ArrayBuffer.isView(val);
      } else {
        result = val && val.buffer && isArrayBuffer(val.buffer);
      }
      return result;
    }
    function isString(val) {
      return typeof val === "string";
    }
    function isNumber(val) {
      return typeof val === "number";
    }
    function isObject(val) {
      return val !== null && typeof val === "object";
    }
    function isPlainObject3(val) {
      if (kindOf2(val) !== "object") {
        return false;
      }
      var prototype = Object.getPrototypeOf(val);
      return prototype === null || prototype === Object.prototype;
    }
    var isDate2 = kindOfTest("Date");
    var isFile = kindOfTest("File");
    var isBlob = kindOfTest("Blob");
    var isFileList = kindOfTest("FileList");
    function isFunction2(val) {
      return toString.call(val) === "[object Function]";
    }
    function isStream(val) {
      return isObject(val) && isFunction2(val.pipe);
    }
    function isFormData(thing) {
      var pattern = "[object FormData]";
      return thing && (typeof FormData === "function" && thing instanceof FormData || toString.call(thing) === pattern || isFunction2(thing.toString) && thing.toString() === pattern);
    }
    var isURLSearchParams = kindOfTest("URLSearchParams");
    function trim(str) {
      return str.trim ? str.trim() : str.replace(/^\s+|\s+$/g, "");
    }
    function isStandardBrowserEnv() {
      if (typeof navigator !== "undefined" && (navigator.product === "ReactNative" || navigator.product === "NativeScript" || navigator.product === "NS")) {
        return false;
      }
      return typeof window !== "undefined" && typeof document !== "undefined";
    }
    function forEach(obj, fn2) {
      if (obj === null || typeof obj === "undefined") {
        return;
      }
      if (typeof obj !== "object") {
        obj = [
          obj
        ];
      }
      if (isArray(obj)) {
        for (var i2 = 0, l2 = obj.length; i2 < l2; i2++) {
          fn2.call(null, obj[i2], i2, obj);
        }
      } else {
        for (var key in obj) {
          if (Object.prototype.hasOwnProperty.call(obj, key)) {
            fn2.call(null, obj[key], key, obj);
          }
        }
      }
    }
    function merge() {
      var result = {};
      function assignValue(val, key) {
        if (isPlainObject3(result[key]) && isPlainObject3(val)) {
          result[key] = merge(result[key], val);
        } else if (isPlainObject3(val)) {
          result[key] = merge({}, val);
        } else if (isArray(val)) {
          result[key] = val.slice();
        } else {
          result[key] = val;
        }
      }
      for (var i2 = 0, l2 = arguments.length; i2 < l2; i2++) {
        forEach(arguments[i2], assignValue);
      }
      return result;
    }
    function extend(a2, b2, thisArg) {
      forEach(b2, function assignValue(val, key) {
        if (thisArg && typeof val === "function") {
          a2[key] = bind(val, thisArg);
        } else {
          a2[key] = val;
        }
      });
      return a2;
    }
    function stripBOM(content) {
      if (content.charCodeAt(0) === 65279) {
        content = content.slice(1);
      }
      return content;
    }
    function inherits(constructor, superConstructor, props, descriptors) {
      constructor.prototype = Object.create(superConstructor.prototype, descriptors);
      constructor.prototype.constructor = constructor;
      props && Object.assign(constructor.prototype, props);
    }
    function toFlatObject(sourceObj, destObj, filter) {
      var props;
      var i2;
      var prop;
      var merged = {};
      destObj = destObj || {};
      do {
        props = Object.getOwnPropertyNames(sourceObj);
        i2 = props.length;
        while (i2-- > 0) {
          prop = props[i2];
          if (!merged[prop]) {
            destObj[prop] = sourceObj[prop];
            merged[prop] = true;
          }
        }
        sourceObj = Object.getPrototypeOf(sourceObj);
      } while (sourceObj && (!filter || filter(sourceObj, destObj)) && sourceObj !== Object.prototype);
      return destObj;
    }
    function endsWith(str, searchString, position) {
      str = String(str);
      if (position === void 0 || position > str.length) {
        position = str.length;
      }
      position -= searchString.length;
      var lastIndex = str.indexOf(searchString, position);
      return lastIndex !== -1 && lastIndex === position;
    }
    function toArray(thing) {
      if (!thing)
        return null;
      var i2 = thing.length;
      if (isUndefined(i2))
        return null;
      var arr = new Array(i2);
      while (i2-- > 0) {
        arr[i2] = thing[i2];
      }
      return arr;
    }
    var isTypedArray = function(TypedArray) {
      return function(thing) {
        return TypedArray && thing instanceof TypedArray;
      };
    }(typeof Uint8Array !== "undefined" && Object.getPrototypeOf(Uint8Array));
    module.exports = {
      isArray,
      isArrayBuffer,
      isBuffer,
      isFormData,
      isArrayBufferView,
      isString,
      isNumber,
      isObject,
      isPlainObject: isPlainObject3,
      isUndefined,
      isDate: isDate2,
      isFile,
      isBlob,
      isFunction: isFunction2,
      isStream,
      isURLSearchParams,
      isStandardBrowserEnv,
      forEach,
      merge,
      extend,
      trim,
      stripBOM,
      inherits,
      toFlatObject,
      kindOf: kindOf2,
      kindOfTest,
      endsWith,
      toArray,
      isTypedArray,
      isFileList
    };
  }
});
var require_buildURL = __commonJS({
  "node_modules/axios/lib/helpers/buildURL.js"(exports, module) {
    "use strict";
    var utils = require_utils();
    function encode(val) {
      return encodeURIComponent(val).replace(/%3A/gi, ":").replace(/%24/g, "$").replace(/%2C/gi, ",").replace(/%20/g, "+").replace(/%5B/gi, "[").replace(/%5D/gi, "]");
    }
    module.exports = function buildURL(url, params, paramsSerializer) {
      if (!params) {
        return url;
      }
      var serializedParams;
      if (paramsSerializer) {
        serializedParams = paramsSerializer(params);
      } else if (utils.isURLSearchParams(params)) {
        serializedParams = params.toString();
      } else {
        var parts = [];
        utils.forEach(params, function serialize(val, key) {
          if (val === null || typeof val === "undefined") {
            return;
          }
          if (utils.isArray(val)) {
            key = key + "[]";
          } else {
            val = [
              val
            ];
          }
          utils.forEach(val, function parseValue(v2) {
            if (utils.isDate(v2)) {
              v2 = v2.toISOString();
            } else if (utils.isObject(v2)) {
              v2 = JSON.stringify(v2);
            }
            parts.push(encode(key) + "=" + encode(v2));
          });
        });
        serializedParams = parts.join("&");
      }
      if (serializedParams) {
        var hashmarkIndex = url.indexOf("#");
        if (hashmarkIndex !== -1) {
          url = url.slice(0, hashmarkIndex);
        }
        url += (url.indexOf("?") === -1 ? "?" : "&") + serializedParams;
      }
      return url;
    };
  }
});
var require_InterceptorManager = __commonJS({
  "node_modules/axios/lib/core/InterceptorManager.js"(exports, module) {
    "use strict";
    var utils = require_utils();
    function InterceptorManager() {
      this.handlers = [];
    }
    InterceptorManager.prototype.use = function use(fulfilled, rejected, options) {
      this.handlers.push({
        fulfilled,
        rejected,
        synchronous: options ? options.synchronous : false,
        runWhen: options ? options.runWhen : null
      });
      return this.handlers.length - 1;
    };
    InterceptorManager.prototype.eject = function eject(id) {
      if (this.handlers[id]) {
        this.handlers[id] = null;
      }
    };
    InterceptorManager.prototype.forEach = function forEach(fn2) {
      utils.forEach(this.handlers, function forEachHandler(h2) {
        if (h2 !== null) {
          fn2(h2);
        }
      });
    };
    module.exports = InterceptorManager;
  }
});
var require_normalizeHeaderName = __commonJS({
  "node_modules/axios/lib/helpers/normalizeHeaderName.js"(exports, module) {
    "use strict";
    var utils = require_utils();
    module.exports = function normalizeHeaderName(headers, normalizedName) {
      utils.forEach(headers, function processHeader(value, name) {
        if (name !== normalizedName && name.toUpperCase() === normalizedName.toUpperCase()) {
          headers[normalizedName] = value;
          delete headers[name];
        }
      });
    };
  }
});
var require_AxiosError = __commonJS({
  "node_modules/axios/lib/core/AxiosError.js"(exports, module) {
    "use strict";
    var utils = require_utils();
    function AxiosError(message, code, config, request2, response) {
      Error.call(this);
      this.message = message;
      this.name = "AxiosError";
      code && (this.code = code);
      config && (this.config = config);
      request2 && (this.request = request2);
      response && (this.response = response);
    }
    utils.inherits(AxiosError, Error, {
      toJSON: function toJSON() {
        return {
          message: this.message,
          name: this.name,
          description: this.description,
          number: this.number,
          fileName: this.fileName,
          lineNumber: this.lineNumber,
          columnNumber: this.columnNumber,
          stack: this.stack,
          config: this.config,
          code: this.code,
          status: this.response && this.response.status ? this.response.status : null
        };
      }
    });
    var prototype = AxiosError.prototype;
    var descriptors = {};
    [
      "ERR_BAD_OPTION_VALUE",
      "ERR_BAD_OPTION",
      "ECONNABORTED",
      "ETIMEDOUT",
      "ERR_NETWORK",
      "ERR_FR_TOO_MANY_REDIRECTS",
      "ERR_DEPRECATED",
      "ERR_BAD_RESPONSE",
      "ERR_BAD_REQUEST",
      "ERR_CANCELED"
    ].forEach(function(code) {
      descriptors[code] = {
        value: code
      };
    });
    Object.defineProperties(AxiosError, descriptors);
    Object.defineProperty(prototype, "isAxiosError", {
      value: true
    });
    AxiosError.from = function(error, code, config, request2, response, customProps) {
      var axiosError = Object.create(prototype);
      utils.toFlatObject(error, axiosError, function filter(obj) {
        return obj !== Error.prototype;
      });
      AxiosError.call(axiosError, error.message, code, config, request2, response);
      axiosError.name = error.name;
      customProps && Object.assign(axiosError, customProps);
      return axiosError;
    };
    module.exports = AxiosError;
  }
});
var require_transitional = __commonJS({
  "node_modules/axios/lib/defaults/transitional.js"(exports, module) {
    "use strict";
    module.exports = {
      silentJSONParsing: true,
      forcedJSONParsing: true,
      clarifyTimeoutError: false
    };
  }
});
var require_toFormData = __commonJS({
  "node_modules/axios/lib/helpers/toFormData.js"(exports, module) {
    "use strict";
    var utils = require_utils();
    function toFormData(obj, formData) {
      formData = formData || new FormData();
      var stack = [];
      function convertValue(value) {
        if (value === null)
          return "";
        if (utils.isDate(value)) {
          return value.toISOString();
        }
        if (utils.isArrayBuffer(value) || utils.isTypedArray(value)) {
          return typeof Blob === "function" ? new Blob([
            value
          ]) : Buffer.from(value);
        }
        return value;
      }
      function build(data, parentKey) {
        if (utils.isPlainObject(data) || utils.isArray(data)) {
          if (stack.indexOf(data) !== -1) {
            throw Error("Circular reference detected in " + parentKey);
          }
          stack.push(data);
          utils.forEach(data, function each(value, key) {
            if (utils.isUndefined(value))
              return;
            var fullKey = parentKey ? parentKey + "." + key : key;
            var arr;
            if (value && !parentKey && typeof value === "object") {
              if (utils.endsWith(key, "{}")) {
                value = JSON.stringify(value);
              } else if (utils.endsWith(key, "[]") && (arr = utils.toArray(value))) {
                arr.forEach(function(el) {
                  !utils.isUndefined(el) && formData.append(fullKey, convertValue(el));
                });
                return;
              }
            }
            build(value, fullKey);
          });
          stack.pop();
        } else {
          formData.append(parentKey, convertValue(data));
        }
      }
      build(obj);
      return formData;
    }
    module.exports = toFormData;
  }
});
var require_settle = __commonJS({
  "node_modules/axios/lib/core/settle.js"(exports, module) {
    "use strict";
    var AxiosError = require_AxiosError();
    module.exports = function settle(resolve, reject, response) {
      var validateStatus = response.config.validateStatus;
      if (!response.status || !validateStatus || validateStatus(response.status)) {
        resolve(response);
      } else {
        reject(new AxiosError("Request failed with status code " + response.status, [
          AxiosError.ERR_BAD_REQUEST,
          AxiosError.ERR_BAD_RESPONSE
        ][Math.floor(response.status / 100) - 4], response.config, response.request, response));
      }
    };
  }
});
var require_cookies = __commonJS({
  "node_modules/axios/lib/helpers/cookies.js"(exports, module) {
    "use strict";
    var utils = require_utils();
    module.exports = utils.isStandardBrowserEnv() ? function standardBrowserEnv() {
      return {
        write: function write(name, value, expires, path, domain, secure) {
          var cookie = [];
          cookie.push(name + "=" + encodeURIComponent(value));
          if (utils.isNumber(expires)) {
            cookie.push("expires=" + new Date(expires).toGMTString());
          }
          if (utils.isString(path)) {
            cookie.push("path=" + path);
          }
          if (utils.isString(domain)) {
            cookie.push("domain=" + domain);
          }
          if (secure === true) {
            cookie.push("secure");
          }
          document.cookie = cookie.join("; ");
        },
        read: function read(name) {
          var match = document.cookie.match(new RegExp("(^|;\\s*)(" + name + ")=([^;]*)"));
          return match ? decodeURIComponent(match[3]) : null;
        },
        remove: function remove(name) {
          this.write(name, "", Date.now() - 864e5);
        }
      };
    }() : function nonStandardBrowserEnv() {
      return {
        write: function write() {
        },
        read: function read() {
          return null;
        },
        remove: function remove() {
        }
      };
    }();
  }
});
var require_isAbsoluteURL = __commonJS({
  "node_modules/axios/lib/helpers/isAbsoluteURL.js"(exports, module) {
    "use strict";
    module.exports = function isAbsoluteURL(url) {
      return /^([a-z][a-z\d+\-.]*:)?\/\//i.test(url);
    };
  }
});
var require_combineURLs = __commonJS({
  "node_modules/axios/lib/helpers/combineURLs.js"(exports, module) {
    "use strict";
    module.exports = function combineURLs(baseURL, relativeURL) {
      return relativeURL ? baseURL.replace(/\/+$/, "") + "/" + relativeURL.replace(/^\/+/, "") : baseURL;
    };
  }
});
var require_buildFullPath = __commonJS({
  "node_modules/axios/lib/core/buildFullPath.js"(exports, module) {
    "use strict";
    var isAbsoluteURL = require_isAbsoluteURL();
    var combineURLs = require_combineURLs();
    module.exports = function buildFullPath(baseURL, requestedURL) {
      if (baseURL && !isAbsoluteURL(requestedURL)) {
        return combineURLs(baseURL, requestedURL);
      }
      return requestedURL;
    };
  }
});
var require_parseHeaders = __commonJS({
  "node_modules/axios/lib/helpers/parseHeaders.js"(exports, module) {
    "use strict";
    var utils = require_utils();
    var ignoreDuplicateOf = [
      "age",
      "authorization",
      "content-length",
      "content-type",
      "etag",
      "expires",
      "from",
      "host",
      "if-modified-since",
      "if-unmodified-since",
      "last-modified",
      "location",
      "max-forwards",
      "proxy-authorization",
      "referer",
      "retry-after",
      "user-agent"
    ];
    module.exports = function parseHeaders(headers) {
      var parsed = {};
      var key;
      var val;
      var i2;
      if (!headers) {
        return parsed;
      }
      utils.forEach(headers.split("\n"), function parser(line) {
        i2 = line.indexOf(":");
        key = utils.trim(line.substr(0, i2)).toLowerCase();
        val = utils.trim(line.substr(i2 + 1));
        if (key) {
          if (parsed[key] && ignoreDuplicateOf.indexOf(key) >= 0) {
            return;
          }
          if (key === "set-cookie") {
            parsed[key] = (parsed[key] ? parsed[key] : []).concat([
              val
            ]);
          } else {
            parsed[key] = parsed[key] ? parsed[key] + ", " + val : val;
          }
        }
      });
      return parsed;
    };
  }
});
var require_isURLSameOrigin = __commonJS({
  "node_modules/axios/lib/helpers/isURLSameOrigin.js"(exports, module) {
    "use strict";
    var utils = require_utils();
    module.exports = utils.isStandardBrowserEnv() ? function standardBrowserEnv() {
      var msie = /(msie|trident)/i.test(navigator.userAgent);
      var urlParsingNode = document.createElement("a");
      var originURL;
      function resolveURL(url) {
        var href = url;
        if (msie) {
          urlParsingNode.setAttribute("href", href);
          href = urlParsingNode.href;
        }
        urlParsingNode.setAttribute("href", href);
        return {
          href: urlParsingNode.href,
          protocol: urlParsingNode.protocol ? urlParsingNode.protocol.replace(/:$/, "") : "",
          host: urlParsingNode.host,
          search: urlParsingNode.search ? urlParsingNode.search.replace(/^\?/, "") : "",
          hash: urlParsingNode.hash ? urlParsingNode.hash.replace(/^#/, "") : "",
          hostname: urlParsingNode.hostname,
          port: urlParsingNode.port,
          pathname: urlParsingNode.pathname.charAt(0) === "/" ? urlParsingNode.pathname : "/" + urlParsingNode.pathname
        };
      }
      originURL = resolveURL(window.location.href);
      return function isURLSameOrigin(requestURL) {
        var parsed = utils.isString(requestURL) ? resolveURL(requestURL) : requestURL;
        return parsed.protocol === originURL.protocol && parsed.host === originURL.host;
      };
    }() : function nonStandardBrowserEnv() {
      return function isURLSameOrigin() {
        return true;
      };
    }();
  }
});
var require_CanceledError = __commonJS({
  "node_modules/axios/lib/cancel/CanceledError.js"(exports, module) {
    "use strict";
    var AxiosError = require_AxiosError();
    var utils = require_utils();
    function CanceledError(message) {
      AxiosError.call(this, message == null ? "canceled" : message, AxiosError.ERR_CANCELED);
      this.name = "CanceledError";
    }
    utils.inherits(CanceledError, AxiosError, {
      __CANCEL__: true
    });
    module.exports = CanceledError;
  }
});
var require_parseProtocol = __commonJS({
  "node_modules/axios/lib/helpers/parseProtocol.js"(exports, module) {
    "use strict";
    module.exports = function parseProtocol(url) {
      var match = /^([-+\w]{1,25})(:?\/\/|:)/.exec(url);
      return match && match[1] || "";
    };
  }
});
var require_xhr = __commonJS({
  "node_modules/axios/lib/adapters/xhr.js"(exports, module) {
    "use strict";
    var utils = require_utils();
    var settle = require_settle();
    var cookies = require_cookies();
    var buildURL = require_buildURL();
    var buildFullPath = require_buildFullPath();
    var parseHeaders = require_parseHeaders();
    var isURLSameOrigin = require_isURLSameOrigin();
    var transitionalDefaults = require_transitional();
    var AxiosError = require_AxiosError();
    var CanceledError = require_CanceledError();
    var parseProtocol = require_parseProtocol();
    module.exports = function xhrAdapter(config) {
      return new Promise(function dispatchXhrRequest(resolve, reject) {
        var requestData = config.data;
        var requestHeaders = config.headers;
        var responseType = config.responseType;
        var onCanceled;
        function done() {
          if (config.cancelToken) {
            config.cancelToken.unsubscribe(onCanceled);
          }
          if (config.signal) {
            config.signal.removeEventListener("abort", onCanceled);
          }
        }
        if (utils.isFormData(requestData) && utils.isStandardBrowserEnv()) {
          delete requestHeaders["Content-Type"];
        }
        var request2 = new XMLHttpRequest();
        if (config.auth) {
          var username = config.auth.username || "";
          var password = config.auth.password ? unescape(encodeURIComponent(config.auth.password)) : "";
          requestHeaders.Authorization = "Basic " + btoa(username + ":" + password);
        }
        var fullPath = buildFullPath(config.baseURL, config.url);
        request2.open(config.method.toUpperCase(), buildURL(fullPath, config.params, config.paramsSerializer), true);
        request2.timeout = config.timeout;
        function onloadend() {
          if (!request2) {
            return;
          }
          var responseHeaders = "getAllResponseHeaders" in request2 ? parseHeaders(request2.getAllResponseHeaders()) : null;
          var responseData = !responseType || responseType === "text" || responseType === "json" ? request2.responseText : request2.response;
          var response = {
            data: responseData,
            status: request2.status,
            statusText: request2.statusText,
            headers: responseHeaders,
            config,
            request: request2
          };
          settle(function _resolve(value) {
            resolve(value);
            done();
          }, function _reject(err) {
            reject(err);
            done();
          }, response);
          request2 = null;
        }
        if ("onloadend" in request2) {
          request2.onloadend = onloadend;
        } else {
          request2.onreadystatechange = function handleLoad() {
            if (!request2 || request2.readyState !== 4) {
              return;
            }
            if (request2.status === 0 && !(request2.responseURL && request2.responseURL.indexOf("file:") === 0)) {
              return;
            }
            setTimeout(onloadend);
          };
        }
        request2.onabort = function handleAbort() {
          if (!request2) {
            return;
          }
          reject(new AxiosError("Request aborted", AxiosError.ECONNABORTED, config, request2));
          request2 = null;
        };
        request2.onerror = function handleError() {
          reject(new AxiosError("Network Error", AxiosError.ERR_NETWORK, config, request2, request2));
          request2 = null;
        };
        request2.ontimeout = function handleTimeout() {
          var timeoutErrorMessage = config.timeout ? "timeout of " + config.timeout + "ms exceeded" : "timeout exceeded";
          var transitional = config.transitional || transitionalDefaults;
          if (config.timeoutErrorMessage) {
            timeoutErrorMessage = config.timeoutErrorMessage;
          }
          reject(new AxiosError(timeoutErrorMessage, transitional.clarifyTimeoutError ? AxiosError.ETIMEDOUT : AxiosError.ECONNABORTED, config, request2));
          request2 = null;
        };
        if (utils.isStandardBrowserEnv()) {
          var xsrfValue = (config.withCredentials || isURLSameOrigin(fullPath)) && config.xsrfCookieName ? cookies.read(config.xsrfCookieName) : void 0;
          if (xsrfValue) {
            requestHeaders[config.xsrfHeaderName] = xsrfValue;
          }
        }
        if ("setRequestHeader" in request2) {
          utils.forEach(requestHeaders, function setRequestHeader(val, key) {
            if (typeof requestData === "undefined" && key.toLowerCase() === "content-type") {
              delete requestHeaders[key];
            } else {
              request2.setRequestHeader(key, val);
            }
          });
        }
        if (!utils.isUndefined(config.withCredentials)) {
          request2.withCredentials = !!config.withCredentials;
        }
        if (responseType && responseType !== "json") {
          request2.responseType = config.responseType;
        }
        if (typeof config.onDownloadProgress === "function") {
          request2.addEventListener("progress", config.onDownloadProgress);
        }
        if (typeof config.onUploadProgress === "function" && request2.upload) {
          request2.upload.addEventListener("progress", config.onUploadProgress);
        }
        if (config.cancelToken || config.signal) {
          onCanceled = function(cancel) {
            if (!request2) {
              return;
            }
            reject(!cancel || cancel && cancel.type ? new CanceledError() : cancel);
            request2.abort();
            request2 = null;
          };
          config.cancelToken && config.cancelToken.subscribe(onCanceled);
          if (config.signal) {
            config.signal.aborted ? onCanceled() : config.signal.addEventListener("abort", onCanceled);
          }
        }
        if (!requestData) {
          requestData = null;
        }
        var protocol = parseProtocol(fullPath);
        if (protocol && [
          "http",
          "https",
          "file"
        ].indexOf(protocol) === -1) {
          reject(new AxiosError("Unsupported protocol " + protocol + ":", AxiosError.ERR_BAD_REQUEST, config));
          return;
        }
        request2.send(requestData);
      });
    };
  }
});
var require_null = __commonJS({
  "node_modules/axios/lib/helpers/null.js"(exports, module) {
    module.exports = null;
  }
});
var require_defaults = __commonJS({
  "node_modules/axios/lib/defaults/index.js"(exports, module) {
    "use strict";
    var utils = require_utils();
    var normalizeHeaderName = require_normalizeHeaderName();
    var AxiosError = require_AxiosError();
    var transitionalDefaults = require_transitional();
    var toFormData = require_toFormData();
    var DEFAULT_CONTENT_TYPE = {
      "Content-Type": "application/x-www-form-urlencoded"
    };
    function setContentTypeIfUnset(headers, value) {
      if (!utils.isUndefined(headers) && utils.isUndefined(headers["Content-Type"])) {
        headers["Content-Type"] = value;
      }
    }
    function getDefaultAdapter() {
      var adapter;
      if (typeof XMLHttpRequest !== "undefined") {
        adapter = require_xhr();
      } else if (typeof process !== "undefined" && Object.prototype.toString.call(process) === "[object process]") {
        adapter = require_xhr();
      }
      return adapter;
    }
    function stringifySafely(rawValue, parser, encoder) {
      if (utils.isString(rawValue)) {
        try {
          (parser || JSON.parse)(rawValue);
          return utils.trim(rawValue);
        } catch (e) {
          if (e.name !== "SyntaxError") {
            throw e;
          }
        }
      }
      return (encoder || JSON.stringify)(rawValue);
    }
    var defaults = {
      transitional: transitionalDefaults,
      adapter: getDefaultAdapter(),
      transformRequest: [
        function transformRequest(data, headers) {
          normalizeHeaderName(headers, "Accept");
          normalizeHeaderName(headers, "Content-Type");
          if (utils.isFormData(data) || utils.isArrayBuffer(data) || utils.isBuffer(data) || utils.isStream(data) || utils.isFile(data) || utils.isBlob(data)) {
            return data;
          }
          if (utils.isArrayBufferView(data)) {
            return data.buffer;
          }
          if (utils.isURLSearchParams(data)) {
            setContentTypeIfUnset(headers, "application/x-www-form-urlencoded;charset=utf-8");
            return data.toString();
          }
          var isObjectPayload = utils.isObject(data);
          var contentType = headers && headers["Content-Type"];
          var isFileList;
          if ((isFileList = utils.isFileList(data)) || isObjectPayload && contentType === "multipart/form-data") {
            var _FormData = this.env && this.env.FormData;
            return toFormData(isFileList ? {
              "files[]": data
            } : data, _FormData && new _FormData());
          } else if (isObjectPayload || contentType === "application/json") {
            setContentTypeIfUnset(headers, "application/json");
            return stringifySafely(data);
          }
          return data;
        }
      ],
      transformResponse: [
        function transformResponse(data) {
          var transitional = this.transitional || defaults.transitional;
          var silentJSONParsing = transitional && transitional.silentJSONParsing;
          var forcedJSONParsing = transitional && transitional.forcedJSONParsing;
          var strictJSONParsing = !silentJSONParsing && this.responseType === "json";
          if (strictJSONParsing || forcedJSONParsing && utils.isString(data) && data.length) {
            try {
              return JSON.parse(data);
            } catch (e) {
              if (strictJSONParsing) {
                if (e.name === "SyntaxError") {
                  throw AxiosError.from(e, AxiosError.ERR_BAD_RESPONSE, this, null, this.response);
                }
                throw e;
              }
            }
          }
          return data;
        }
      ],
      timeout: 0,
      xsrfCookieName: "XSRF-TOKEN",
      xsrfHeaderName: "X-XSRF-TOKEN",
      maxContentLength: -1,
      maxBodyLength: -1,
      env: {
        FormData: require_null()
      },
      validateStatus: function validateStatus(status) {
        return status >= 200 && status < 300;
      },
      headers: {
        common: {
          "Accept": "application/json, text/plain, */*"
        }
      }
    };
    utils.forEach([
      "delete",
      "get",
      "head"
    ], function forEachMethodNoData(method) {
      defaults.headers[method] = {};
    });
    utils.forEach([
      "post",
      "put",
      "patch"
    ], function forEachMethodWithData(method) {
      defaults.headers[method] = utils.merge(DEFAULT_CONTENT_TYPE);
    });
    module.exports = defaults;
  }
});
var require_transformData = __commonJS({
  "node_modules/axios/lib/core/transformData.js"(exports, module) {
    "use strict";
    var utils = require_utils();
    var defaults = require_defaults();
    module.exports = function transformData(data, headers, fns) {
      var context = this || defaults;
      utils.forEach(fns, function transform(fn2) {
        data = fn2.call(context, data, headers);
      });
      return data;
    };
  }
});
var require_isCancel = __commonJS({
  "node_modules/axios/lib/cancel/isCancel.js"(exports, module) {
    "use strict";
    module.exports = function isCancel(value) {
      return !!(value && value.__CANCEL__);
    };
  }
});
var require_dispatchRequest = __commonJS({
  "node_modules/axios/lib/core/dispatchRequest.js"(exports, module) {
    "use strict";
    var utils = require_utils();
    var transformData = require_transformData();
    var isCancel = require_isCancel();
    var defaults = require_defaults();
    var CanceledError = require_CanceledError();
    function throwIfCancellationRequested(config) {
      if (config.cancelToken) {
        config.cancelToken.throwIfRequested();
      }
      if (config.signal && config.signal.aborted) {
        throw new CanceledError();
      }
    }
    module.exports = function dispatchRequest(config) {
      throwIfCancellationRequested(config);
      config.headers = config.headers || {};
      config.data = transformData.call(config, config.data, config.headers, config.transformRequest);
      config.headers = utils.merge(config.headers.common || {}, config.headers[config.method] || {}, config.headers);
      utils.forEach([
        "delete",
        "get",
        "head",
        "post",
        "put",
        "patch",
        "common"
      ], function cleanHeaderConfig(method) {
        delete config.headers[method];
      });
      var adapter = config.adapter || defaults.adapter;
      return adapter(config).then(function onAdapterResolution(response) {
        throwIfCancellationRequested(config);
        response.data = transformData.call(config, response.data, response.headers, config.transformResponse);
        return response;
      }, function onAdapterRejection(reason) {
        if (!isCancel(reason)) {
          throwIfCancellationRequested(config);
          if (reason && reason.response) {
            reason.response.data = transformData.call(config, reason.response.data, reason.response.headers, config.transformResponse);
          }
        }
        return Promise.reject(reason);
      });
    };
  }
});
var require_mergeConfig = __commonJS({
  "node_modules/axios/lib/core/mergeConfig.js"(exports, module) {
    "use strict";
    var utils = require_utils();
    module.exports = function mergeConfig(config1, config2) {
      config2 = config2 || {};
      var config = {};
      function getMergedValue(target, source) {
        if (utils.isPlainObject(target) && utils.isPlainObject(source)) {
          return utils.merge(target, source);
        } else if (utils.isPlainObject(source)) {
          return utils.merge({}, source);
        } else if (utils.isArray(source)) {
          return source.slice();
        }
        return source;
      }
      function mergeDeepProperties(prop) {
        if (!utils.isUndefined(config2[prop])) {
          return getMergedValue(config1[prop], config2[prop]);
        } else if (!utils.isUndefined(config1[prop])) {
          return getMergedValue(void 0, config1[prop]);
        }
      }
      function valueFromConfig2(prop) {
        if (!utils.isUndefined(config2[prop])) {
          return getMergedValue(void 0, config2[prop]);
        }
      }
      function defaultToConfig2(prop) {
        if (!utils.isUndefined(config2[prop])) {
          return getMergedValue(void 0, config2[prop]);
        } else if (!utils.isUndefined(config1[prop])) {
          return getMergedValue(void 0, config1[prop]);
        }
      }
      function mergeDirectKeys(prop) {
        if (prop in config2) {
          return getMergedValue(config1[prop], config2[prop]);
        } else if (prop in config1) {
          return getMergedValue(void 0, config1[prop]);
        }
      }
      var mergeMap = {
        "url": valueFromConfig2,
        "method": valueFromConfig2,
        "data": valueFromConfig2,
        "baseURL": defaultToConfig2,
        "transformRequest": defaultToConfig2,
        "transformResponse": defaultToConfig2,
        "paramsSerializer": defaultToConfig2,
        "timeout": defaultToConfig2,
        "timeoutMessage": defaultToConfig2,
        "withCredentials": defaultToConfig2,
        "adapter": defaultToConfig2,
        "responseType": defaultToConfig2,
        "xsrfCookieName": defaultToConfig2,
        "xsrfHeaderName": defaultToConfig2,
        "onUploadProgress": defaultToConfig2,
        "onDownloadProgress": defaultToConfig2,
        "decompress": defaultToConfig2,
        "maxContentLength": defaultToConfig2,
        "maxBodyLength": defaultToConfig2,
        "beforeRedirect": defaultToConfig2,
        "transport": defaultToConfig2,
        "httpAgent": defaultToConfig2,
        "httpsAgent": defaultToConfig2,
        "cancelToken": defaultToConfig2,
        "socketPath": defaultToConfig2,
        "responseEncoding": defaultToConfig2,
        "validateStatus": mergeDirectKeys
      };
      utils.forEach(Object.keys(config1).concat(Object.keys(config2)), function computeConfigValue(prop) {
        var merge = mergeMap[prop] || mergeDeepProperties;
        var configValue = merge(prop);
        utils.isUndefined(configValue) && merge !== mergeDirectKeys || (config[prop] = configValue);
      });
      return config;
    };
  }
});
var require_data = __commonJS({
  "node_modules/axios/lib/env/data.js"(exports, module) {
    module.exports = {
      "version": "0.27.2"
    };
  }
});
var require_validator = __commonJS({
  "node_modules/axios/lib/helpers/validator.js"(exports, module) {
    "use strict";
    var VERSION = require_data().version;
    var AxiosError = require_AxiosError();
    var validators = {};
    [
      "object",
      "boolean",
      "number",
      "function",
      "string",
      "symbol"
    ].forEach(function(type, i2) {
      validators[type] = function validator(thing) {
        return typeof thing === type || "a" + (i2 < 1 ? "n " : " ") + type;
      };
    });
    var deprecatedWarnings = {};
    validators.transitional = function transitional(validator, version, message) {
      function formatMessage(opt, desc) {
        return "[Axios v" + VERSION + "] Transitional option '" + opt + "'" + desc + (message ? ". " + message : "");
      }
      return function(value, opt, opts) {
        if (validator === false) {
          throw new AxiosError(formatMessage(opt, " has been removed" + (version ? " in " + version : "")), AxiosError.ERR_DEPRECATED);
        }
        if (version && !deprecatedWarnings[opt]) {
          deprecatedWarnings[opt] = true;
          console.warn(formatMessage(opt, " has been deprecated since v" + version + " and will be removed in the near future"));
        }
        return validator ? validator(value, opt, opts) : true;
      };
    };
    function assertOptions(options, schema, allowUnknown) {
      if (typeof options !== "object") {
        throw new AxiosError("options must be an object", AxiosError.ERR_BAD_OPTION_VALUE);
      }
      var keys = Object.keys(options);
      var i2 = keys.length;
      while (i2-- > 0) {
        var opt = keys[i2];
        var validator = schema[opt];
        if (validator) {
          var value = options[opt];
          var result = value === void 0 || validator(value, opt, options);
          if (result !== true) {
            throw new AxiosError("option " + opt + " must be " + result, AxiosError.ERR_BAD_OPTION_VALUE);
          }
          continue;
        }
        if (allowUnknown !== true) {
          throw new AxiosError("Unknown option " + opt, AxiosError.ERR_BAD_OPTION);
        }
      }
    }
    module.exports = {
      assertOptions,
      validators
    };
  }
});
var require_Axios = __commonJS({
  "node_modules/axios/lib/core/Axios.js"(exports, module) {
    "use strict";
    var utils = require_utils();
    var buildURL = require_buildURL();
    var InterceptorManager = require_InterceptorManager();
    var dispatchRequest = require_dispatchRequest();
    var mergeConfig = require_mergeConfig();
    var buildFullPath = require_buildFullPath();
    var validator = require_validator();
    var validators = validator.validators;
    function Axios(instanceConfig) {
      this.defaults = instanceConfig;
      this.interceptors = {
        request: new InterceptorManager(),
        response: new InterceptorManager()
      };
    }
    Axios.prototype.request = function request2(configOrUrl, config) {
      if (typeof configOrUrl === "string") {
        config = config || {};
        config.url = configOrUrl;
      } else {
        config = configOrUrl || {};
      }
      config = mergeConfig(this.defaults, config);
      if (config.method) {
        config.method = config.method.toLowerCase();
      } else if (this.defaults.method) {
        config.method = this.defaults.method.toLowerCase();
      } else {
        config.method = "get";
      }
      var transitional = config.transitional;
      if (transitional !== void 0) {
        validator.assertOptions(transitional, {
          silentJSONParsing: validators.transitional(validators.boolean),
          forcedJSONParsing: validators.transitional(validators.boolean),
          clarifyTimeoutError: validators.transitional(validators.boolean)
        }, false);
      }
      var requestInterceptorChain = [];
      var synchronousRequestInterceptors = true;
      this.interceptors.request.forEach(function unshiftRequestInterceptors(interceptor) {
        if (typeof interceptor.runWhen === "function" && interceptor.runWhen(config) === false) {
          return;
        }
        synchronousRequestInterceptors = synchronousRequestInterceptors && interceptor.synchronous;
        requestInterceptorChain.unshift(interceptor.fulfilled, interceptor.rejected);
      });
      var responseInterceptorChain = [];
      this.interceptors.response.forEach(function pushResponseInterceptors(interceptor) {
        responseInterceptorChain.push(interceptor.fulfilled, interceptor.rejected);
      });
      var promise;
      if (!synchronousRequestInterceptors) {
        var chain = [
          dispatchRequest,
          void 0
        ];
        Array.prototype.unshift.apply(chain, requestInterceptorChain);
        chain = chain.concat(responseInterceptorChain);
        promise = Promise.resolve(config);
        while (chain.length) {
          promise = promise.then(chain.shift(), chain.shift());
        }
        return promise;
      }
      var newConfig = config;
      while (requestInterceptorChain.length) {
        var onFulfilled = requestInterceptorChain.shift();
        var onRejected = requestInterceptorChain.shift();
        try {
          newConfig = onFulfilled(newConfig);
        } catch (error) {
          onRejected(error);
          break;
        }
      }
      try {
        promise = dispatchRequest(newConfig);
      } catch (error1) {
        return Promise.reject(error1);
      }
      while (responseInterceptorChain.length) {
        promise = promise.then(responseInterceptorChain.shift(), responseInterceptorChain.shift());
      }
      return promise;
    };
    Axios.prototype.getUri = function getUri(config) {
      config = mergeConfig(this.defaults, config);
      var fullPath = buildFullPath(config.baseURL, config.url);
      return buildURL(fullPath, config.params, config.paramsSerializer);
    };
    utils.forEach([
      "delete",
      "get",
      "head",
      "options"
    ], function forEachMethodNoData(method) {
      Axios.prototype[method] = function(url, config) {
        return this.request(mergeConfig(config || {}, {
          method,
          url,
          data: (config || {}).data
        }));
      };
    });
    utils.forEach([
      "post",
      "put",
      "patch"
    ], function forEachMethodWithData(method) {
      function generateHTTPMethod(isForm) {
        return function httpMethod(url, data, config) {
          return this.request(mergeConfig(config || {}, {
            method,
            headers: isForm ? {
              "Content-Type": "multipart/form-data"
            } : {},
            url,
            data
          }));
        };
      }
      Axios.prototype[method] = generateHTTPMethod();
      Axios.prototype[method + "Form"] = generateHTTPMethod(true);
    });
    module.exports = Axios;
  }
});
var require_CancelToken = __commonJS({
  "node_modules/axios/lib/cancel/CancelToken.js"(exports, module) {
    "use strict";
    var CanceledError = require_CanceledError();
    function CancelToken(executor) {
      if (typeof executor !== "function") {
        throw new TypeError("executor must be a function.");
      }
      var resolvePromise;
      this.promise = new Promise(function promiseExecutor(resolve) {
        resolvePromise = resolve;
      });
      var token = this;
      this.promise.then(function(cancel) {
        if (!token._listeners)
          return;
        var i2;
        var l2 = token._listeners.length;
        for (i2 = 0; i2 < l2; i2++) {
          token._listeners[i2](cancel);
        }
        token._listeners = null;
      });
      this.promise.then = function(onfulfilled) {
        var _resolve;
        var promise = new Promise(function(resolve) {
          token.subscribe(resolve);
          _resolve = resolve;
        }).then(onfulfilled);
        promise.cancel = function reject() {
          token.unsubscribe(_resolve);
        };
        return promise;
      };
      executor(function cancel(message) {
        if (token.reason) {
          return;
        }
        token.reason = new CanceledError(message);
        resolvePromise(token.reason);
      });
    }
    CancelToken.prototype.throwIfRequested = function throwIfRequested() {
      if (this.reason) {
        throw this.reason;
      }
    };
    CancelToken.prototype.subscribe = function subscribe(listener) {
      if (this.reason) {
        listener(this.reason);
        return;
      }
      if (this._listeners) {
        this._listeners.push(listener);
      } else {
        this._listeners = [
          listener
        ];
      }
    };
    CancelToken.prototype.unsubscribe = function unsubscribe(listener) {
      if (!this._listeners) {
        return;
      }
      var index = this._listeners.indexOf(listener);
      if (index !== -1) {
        this._listeners.splice(index, 1);
      }
    };
    CancelToken.source = function source() {
      var cancel;
      var token = new CancelToken(function executor(c2) {
        cancel = c2;
      });
      return {
        token,
        cancel
      };
    };
    module.exports = CancelToken;
  }
});
var require_spread = __commonJS({
  "node_modules/axios/lib/helpers/spread.js"(exports, module) {
    "use strict";
    module.exports = function spread(callback) {
      return function wrap(arr) {
        return callback.apply(null, arr);
      };
    };
  }
});
var require_isAxiosError = __commonJS({
  "node_modules/axios/lib/helpers/isAxiosError.js"(exports, module) {
    "use strict";
    var utils = require_utils();
    module.exports = function isAxiosError(payload) {
      return utils.isObject(payload) && payload.isAxiosError === true;
    };
  }
});
var require_axios = __commonJS({
  "node_modules/axios/lib/axios.js"(exports, module) {
    "use strict";
    var utils = require_utils();
    var bind = require_bind();
    var Axios = require_Axios();
    var mergeConfig = require_mergeConfig();
    var defaults = require_defaults();
    function createInstance(defaultConfig) {
      var context = new Axios(defaultConfig);
      var instance = bind(Axios.prototype.request, context);
      utils.extend(instance, Axios.prototype, context);
      utils.extend(instance, context);
      instance.create = function create(instanceConfig) {
        return createInstance(mergeConfig(defaultConfig, instanceConfig));
      };
      return instance;
    }
    var axios2 = createInstance(defaults);
    axios2.Axios = Axios;
    axios2.CanceledError = require_CanceledError();
    axios2.CancelToken = require_CancelToken();
    axios2.isCancel = require_isCancel();
    axios2.VERSION = require_data().version;
    axios2.toFormData = require_toFormData();
    axios2.AxiosError = require_AxiosError();
    axios2.Cancel = axios2.CanceledError;
    axios2.all = function all(promises) {
      return Promise.all(promises);
    };
    axios2.spread = require_spread();
    axios2.isAxiosError = require_isAxiosError();
    module.exports = axios2;
    module.exports.default = axios2;
  }
});
var require_axios2 = __commonJS({
  "node_modules/axios/index.js"(exports, module) {
    module.exports = require_axios();
  }
});
var require_react_is_development = __commonJS({
  "node_modules/react-is/cjs/react-is.development.js"(exports) {
    "use strict";
    if (true) {
      (function() {
        "use strict";
        var hasSymbol = typeof Symbol === "function" && Symbol.for;
        var REACT_ELEMENT_TYPE = hasSymbol ? Symbol.for("react.element") : 60103;
        var REACT_PORTAL_TYPE = hasSymbol ? Symbol.for("react.portal") : 60106;
        var REACT_FRAGMENT_TYPE = hasSymbol ? Symbol.for("react.fragment") : 60107;
        var REACT_STRICT_MODE_TYPE = hasSymbol ? Symbol.for("react.strict_mode") : 60108;
        var REACT_PROFILER_TYPE = hasSymbol ? Symbol.for("react.profiler") : 60114;
        var REACT_PROVIDER_TYPE = hasSymbol ? Symbol.for("react.provider") : 60109;
        var REACT_CONTEXT_TYPE = hasSymbol ? Symbol.for("react.context") : 60110;
        var REACT_ASYNC_MODE_TYPE = hasSymbol ? Symbol.for("react.async_mode") : 60111;
        var REACT_CONCURRENT_MODE_TYPE = hasSymbol ? Symbol.for("react.concurrent_mode") : 60111;
        var REACT_FORWARD_REF_TYPE = hasSymbol ? Symbol.for("react.forward_ref") : 60112;
        var REACT_SUSPENSE_TYPE = hasSymbol ? Symbol.for("react.suspense") : 60113;
        var REACT_SUSPENSE_LIST_TYPE = hasSymbol ? Symbol.for("react.suspense_list") : 60120;
        var REACT_MEMO_TYPE = hasSymbol ? Symbol.for("react.memo") : 60115;
        var REACT_LAZY_TYPE = hasSymbol ? Symbol.for("react.lazy") : 60116;
        var REACT_BLOCK_TYPE = hasSymbol ? Symbol.for("react.block") : 60121;
        var REACT_FUNDAMENTAL_TYPE = hasSymbol ? Symbol.for("react.fundamental") : 60117;
        var REACT_RESPONDER_TYPE = hasSymbol ? Symbol.for("react.responder") : 60118;
        var REACT_SCOPE_TYPE = hasSymbol ? Symbol.for("react.scope") : 60119;
        function isValidElementType2(type) {
          return typeof type === "string" || typeof type === "function" || type === REACT_FRAGMENT_TYPE || type === REACT_CONCURRENT_MODE_TYPE || type === REACT_PROFILER_TYPE || type === REACT_STRICT_MODE_TYPE || type === REACT_SUSPENSE_TYPE || type === REACT_SUSPENSE_LIST_TYPE || typeof type === "object" && type !== null && (type.$$typeof === REACT_LAZY_TYPE || type.$$typeof === REACT_MEMO_TYPE || type.$$typeof === REACT_PROVIDER_TYPE || type.$$typeof === REACT_CONTEXT_TYPE || type.$$typeof === REACT_FORWARD_REF_TYPE || type.$$typeof === REACT_FUNDAMENTAL_TYPE || type.$$typeof === REACT_RESPONDER_TYPE || type.$$typeof === REACT_SCOPE_TYPE || type.$$typeof === REACT_BLOCK_TYPE);
        }
        function typeOf(object) {
          if (typeof object === "object" && object !== null) {
            var $$typeof = object.$$typeof;
            switch ($$typeof) {
              case REACT_ELEMENT_TYPE:
                var type = object.type;
                switch (type) {
                  case REACT_ASYNC_MODE_TYPE:
                  case REACT_CONCURRENT_MODE_TYPE:
                  case REACT_FRAGMENT_TYPE:
                  case REACT_PROFILER_TYPE:
                  case REACT_STRICT_MODE_TYPE:
                  case REACT_SUSPENSE_TYPE:
                    return type;
                  default:
                    var $$typeofType = type && type.$$typeof;
                    switch ($$typeofType) {
                      case REACT_CONTEXT_TYPE:
                      case REACT_FORWARD_REF_TYPE:
                      case REACT_LAZY_TYPE:
                      case REACT_MEMO_TYPE:
                      case REACT_PROVIDER_TYPE:
                        return $$typeofType;
                      default:
                        return $$typeof;
                    }
                }
              case REACT_PORTAL_TYPE:
                return $$typeof;
            }
          }
          return void 0;
        }
        var AsyncMode = REACT_ASYNC_MODE_TYPE;
        var ConcurrentMode = REACT_CONCURRENT_MODE_TYPE;
        var ContextConsumer = REACT_CONTEXT_TYPE;
        var ContextProvider = REACT_PROVIDER_TYPE;
        var Element = REACT_ELEMENT_TYPE;
        var ForwardRef = REACT_FORWARD_REF_TYPE;
        var Fragment3 = REACT_FRAGMENT_TYPE;
        var Lazy = REACT_LAZY_TYPE;
        var Memo = REACT_MEMO_TYPE;
        var Portal = REACT_PORTAL_TYPE;
        var Profiler = REACT_PROFILER_TYPE;
        var StrictMode = REACT_STRICT_MODE_TYPE;
        var Suspense = REACT_SUSPENSE_TYPE;
        var hasWarnedAboutDeprecatedIsAsyncMode = false;
        function isAsyncMode(object) {
          {
            if (!hasWarnedAboutDeprecatedIsAsyncMode) {
              hasWarnedAboutDeprecatedIsAsyncMode = true;
              console["warn"]("The ReactIs.isAsyncMode() alias has been deprecated, and will be removed in React 17+. Update your code to use ReactIs.isConcurrentMode() instead. It has the exact same API.");
            }
          }
          return isConcurrentMode(object) || typeOf(object) === REACT_ASYNC_MODE_TYPE;
        }
        function isConcurrentMode(object) {
          return typeOf(object) === REACT_CONCURRENT_MODE_TYPE;
        }
        function isContextConsumer2(object) {
          return typeOf(object) === REACT_CONTEXT_TYPE;
        }
        function isContextProvider(object) {
          return typeOf(object) === REACT_PROVIDER_TYPE;
        }
        function isElement(object) {
          return typeof object === "object" && object !== null && object.$$typeof === REACT_ELEMENT_TYPE;
        }
        function isForwardRef(object) {
          return typeOf(object) === REACT_FORWARD_REF_TYPE;
        }
        function isFragment(object) {
          return typeOf(object) === REACT_FRAGMENT_TYPE;
        }
        function isLazy(object) {
          return typeOf(object) === REACT_LAZY_TYPE;
        }
        function isMemo(object) {
          return typeOf(object) === REACT_MEMO_TYPE;
        }
        function isPortal(object) {
          return typeOf(object) === REACT_PORTAL_TYPE;
        }
        function isProfiler(object) {
          return typeOf(object) === REACT_PROFILER_TYPE;
        }
        function isStrictMode(object) {
          return typeOf(object) === REACT_STRICT_MODE_TYPE;
        }
        function isSuspense(object) {
          return typeOf(object) === REACT_SUSPENSE_TYPE;
        }
        exports.AsyncMode = AsyncMode;
        exports.ConcurrentMode = ConcurrentMode;
        exports.ContextConsumer = ContextConsumer;
        exports.ContextProvider = ContextProvider;
        exports.Element = Element;
        exports.ForwardRef = ForwardRef;
        exports.Fragment = Fragment3;
        exports.Lazy = Lazy;
        exports.Memo = Memo;
        exports.Portal = Portal;
        exports.Profiler = Profiler;
        exports.StrictMode = StrictMode;
        exports.Suspense = Suspense;
        exports.isAsyncMode = isAsyncMode;
        exports.isConcurrentMode = isConcurrentMode;
        exports.isContextConsumer = isContextConsumer2;
        exports.isContextProvider = isContextProvider;
        exports.isElement = isElement;
        exports.isForwardRef = isForwardRef;
        exports.isFragment = isFragment;
        exports.isLazy = isLazy;
        exports.isMemo = isMemo;
        exports.isPortal = isPortal;
        exports.isProfiler = isProfiler;
        exports.isStrictMode = isStrictMode;
        exports.isSuspense = isSuspense;
        exports.isValidElementType = isValidElementType2;
        exports.typeOf = typeOf;
      })();
    }
  }
});
var require_react_is = __commonJS({
  "node_modules/react-is/index.js"(exports, module) {
    "use strict";
    if (false) {
      module.exports = null;
    } else {
      module.exports = require_react_is_development();
    }
  }
});
var require_object_assign = __commonJS({
  "node_modules/object-assign/index.js"(exports, module) {
    "use strict";
    var getOwnPropertySymbols = Object.getOwnPropertySymbols;
    var hasOwnProperty = Object.prototype.hasOwnProperty;
    var propIsEnumerable = Object.prototype.propertyIsEnumerable;
    function toObject(val) {
      if (val === null || val === void 0) {
        throw new TypeError("Object.assign cannot be called with null or undefined");
      }
      return Object(val);
    }
    function shouldUseNative() {
      try {
        if (!Object.assign) {
          return false;
        }
        var test1 = new String("abc");
        test1[5] = "de";
        if (Object.getOwnPropertyNames(test1)[0] === "5") {
          return false;
        }
        var test2 = {};
        for (var i2 = 0; i2 < 10; i2++) {
          test2["_" + String.fromCharCode(i2)] = i2;
        }
        var order2 = Object.getOwnPropertyNames(test2).map(function(n2) {
          return test2[n2];
        });
        if (order2.join("") !== "0123456789") {
          return false;
        }
        var test3 = {};
        "abcdefghijklmnopqrst".split("").forEach(function(letter) {
          test3[letter] = letter;
        });
        if (Object.keys(Object.assign({}, test3)).join("") !== "abcdefghijklmnopqrst") {
          return false;
        }
        return true;
      } catch (err) {
        return false;
      }
    }
    module.exports = shouldUseNative() ? Object.assign : function(target, source) {
      var from;
      var to = toObject(target);
      var symbols;
      for (var s2 = 1; s2 < arguments.length; s2++) {
        from = Object(arguments[s2]);
        for (var key in from) {
          if (hasOwnProperty.call(from, key)) {
            to[key] = from[key];
          }
        }
        if (getOwnPropertySymbols) {
          symbols = getOwnPropertySymbols(from);
          for (var i2 = 0; i2 < symbols.length; i2++) {
            if (propIsEnumerable.call(from, symbols[i2])) {
              to[symbols[i2]] = from[symbols[i2]];
            }
          }
        }
      }
      return to;
    };
  }
});
var require_ReactPropTypesSecret = __commonJS({
  "node_modules/prop-types/lib/ReactPropTypesSecret.js"(exports, module) {
    "use strict";
    var ReactPropTypesSecret = "SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED";
    module.exports = ReactPropTypesSecret;
  }
});
var require_has = __commonJS({
  "node_modules/prop-types/lib/has.js"(exports, module) {
    module.exports = Function.call.bind(Object.prototype.hasOwnProperty);
  }
});
var require_checkPropTypes = __commonJS({
  "node_modules/prop-types/checkPropTypes.js"(exports, module) {
    "use strict";
    var printWarning = function() {
    };
    if (true) {
      ReactPropTypesSecret = require_ReactPropTypesSecret();
      loggedTypeFailures = {};
      has = require_has();
      printWarning = function(text) {
        var message = "Warning: " + text;
        if (typeof console !== "undefined") {
          console.error(message);
        }
        try {
          throw new Error(message);
        } catch (x2) {
        }
      };
    }
    var ReactPropTypesSecret;
    var loggedTypeFailures;
    var has;
    function checkPropTypes(typeSpecs, values, location, componentName, getStack) {
      if (true) {
        for (var typeSpecName in typeSpecs) {
          if (has(typeSpecs, typeSpecName)) {
            var error;
            try {
              if (typeof typeSpecs[typeSpecName] !== "function") {
                var err = Error((componentName || "React class") + ": " + location + " type `" + typeSpecName + "` is invalid; it must be a function, usually from the `prop-types` package, but received `" + typeof typeSpecs[typeSpecName] + "`.This often happens because of typos such as `PropTypes.function` instead of `PropTypes.func`.");
                err.name = "Invariant Violation";
                throw err;
              }
              error = typeSpecs[typeSpecName](values, typeSpecName, componentName, location, null, ReactPropTypesSecret);
            } catch (ex) {
              error = ex;
            }
            if (error && !(error instanceof Error)) {
              printWarning((componentName || "React class") + ": type specification of " + location + " `" + typeSpecName + "` is invalid; the type checker function must return `null` or an `Error` but returned a " + typeof error + ". You may have forgotten to pass an argument to the type checker creator (arrayOf, instanceOf, objectOf, oneOf, oneOfType, and shape all require an argument).");
            }
            if (error instanceof Error && !(error.message in loggedTypeFailures)) {
              loggedTypeFailures[error.message] = true;
              var stack = getStack ? getStack() : "";
              printWarning("Failed " + location + " type: " + error.message + (stack != null ? stack : ""));
            }
          }
        }
      }
    }
    checkPropTypes.resetWarningCache = function() {
      if (true) {
        loggedTypeFailures = {};
      }
    };
    module.exports = checkPropTypes;
  }
});
var require_factoryWithTypeCheckers = __commonJS({
  "node_modules/prop-types/factoryWithTypeCheckers.js"(exports, module) {
    "use strict";
    var ReactIs = require_react_is();
    var assign = require_object_assign();
    var ReactPropTypesSecret = require_ReactPropTypesSecret();
    var has = require_has();
    var checkPropTypes = require_checkPropTypes();
    var printWarning = function() {
    };
    if (true) {
      printWarning = function(text) {
        var message = "Warning: " + text;
        if (typeof console !== "undefined") {
          console.error(message);
        }
        try {
          throw new Error(message);
        } catch (x2) {
        }
      };
    }
    function emptyFunctionThatReturnsNull() {
      return null;
    }
    module.exports = function(isValidElement, throwOnDirectAccess) {
      var ITERATOR_SYMBOL = typeof Symbol === "function" && Symbol.iterator;
      var FAUX_ITERATOR_SYMBOL = "@@iterator";
      function getIteratorFn(maybeIterable) {
        var iteratorFn = maybeIterable && (ITERATOR_SYMBOL && maybeIterable[ITERATOR_SYMBOL] || maybeIterable[FAUX_ITERATOR_SYMBOL]);
        if (typeof iteratorFn === "function") {
          return iteratorFn;
        }
      }
      var ANONYMOUS = "<<anonymous>>";
      var ReactPropTypes = {
        array: createPrimitiveTypeChecker("array"),
        bigint: createPrimitiveTypeChecker("bigint"),
        bool: createPrimitiveTypeChecker("boolean"),
        func: createPrimitiveTypeChecker("function"),
        number: createPrimitiveTypeChecker("number"),
        object: createPrimitiveTypeChecker("object"),
        string: createPrimitiveTypeChecker("string"),
        symbol: createPrimitiveTypeChecker("symbol"),
        any: createAnyTypeChecker(),
        arrayOf: createArrayOfTypeChecker,
        element: createElementTypeChecker(),
        elementType: createElementTypeTypeChecker(),
        instanceOf: createInstanceTypeChecker,
        node: createNodeChecker(),
        objectOf: createObjectOfTypeChecker,
        oneOf: createEnumTypeChecker,
        oneOfType: createUnionTypeChecker,
        shape: createShapeTypeChecker,
        exact: createStrictShapeTypeChecker
      };
      function is(x2, y2) {
        if (x2 === y2) {
          return x2 !== 0 || 1 / x2 === 1 / y2;
        } else {
          return x2 !== x2 && y2 !== y2;
        }
      }
      function PropTypeError(message, data) {
        this.message = message;
        this.data = data && typeof data === "object" ? data : {};
        this.stack = "";
      }
      PropTypeError.prototype = Error.prototype;
      function createChainableTypeChecker(validate2) {
        if (true) {
          var manualPropTypeCallCache = {};
          var manualPropTypeWarningCount = 0;
        }
        function checkType(isRequired, props, propName, componentName, location, propFullName, secret) {
          componentName = componentName || ANONYMOUS;
          propFullName = propFullName || propName;
          if (secret !== ReactPropTypesSecret) {
            if (throwOnDirectAccess) {
              var err = new Error("Calling PropTypes validators directly is not supported by the `prop-types` package. Use `PropTypes.checkPropTypes()` to call them. Read more at http://fb.me/use-check-prop-types");
              err.name = "Invariant Violation";
              throw err;
            } else if (typeof console !== "undefined") {
              var cacheKey = componentName + ":" + propName;
              if (!manualPropTypeCallCache[cacheKey] && manualPropTypeWarningCount < 3) {
                printWarning("You are manually calling a React.PropTypes validation function for the `" + propFullName + "` prop on `" + componentName + "`. This is deprecated and will throw in the standalone `prop-types` package. You may be seeing this warning due to a third-party PropTypes library. See https://fb.me/react-warning-dont-call-proptypes for details.");
                manualPropTypeCallCache[cacheKey] = true;
                manualPropTypeWarningCount++;
              }
            }
          }
          if (props[propName] == null) {
            if (isRequired) {
              if (props[propName] === null) {
                return new PropTypeError("The " + location + " `" + propFullName + "` is marked as required " + ("in `" + componentName + "`, but its value is `null`."));
              }
              return new PropTypeError("The " + location + " `" + propFullName + "` is marked as required in " + ("`" + componentName + "`, but its value is `undefined`."));
            }
            return null;
          } else {
            return validate2(props, propName, componentName, location, propFullName);
          }
        }
        var chainedCheckType = checkType.bind(null, false);
        chainedCheckType.isRequired = checkType.bind(null, true);
        return chainedCheckType;
      }
      function createPrimitiveTypeChecker(expectedType) {
        function validate2(props, propName, componentName, location, propFullName, secret) {
          var propValue = props[propName];
          var propType = getPropType(propValue);
          if (propType !== expectedType) {
            var preciseType = getPreciseType(propValue);
            return new PropTypeError("Invalid " + location + " `" + propFullName + "` of type " + ("`" + preciseType + "` supplied to `" + componentName + "`, expected ") + ("`" + expectedType + "`."), {
              expectedType
            });
          }
          return null;
        }
        return createChainableTypeChecker(validate2);
      }
      function createAnyTypeChecker() {
        return createChainableTypeChecker(emptyFunctionThatReturnsNull);
      }
      function createArrayOfTypeChecker(typeChecker) {
        function validate2(props, propName, componentName, location, propFullName) {
          if (typeof typeChecker !== "function") {
            return new PropTypeError("Property `" + propFullName + "` of component `" + componentName + "` has invalid PropType notation inside arrayOf.");
          }
          var propValue = props[propName];
          if (!Array.isArray(propValue)) {
            var propType = getPropType(propValue);
            return new PropTypeError("Invalid " + location + " `" + propFullName + "` of type " + ("`" + propType + "` supplied to `" + componentName + "`, expected an array."));
          }
          for (var i2 = 0; i2 < propValue.length; i2++) {
            var error = typeChecker(propValue, i2, componentName, location, propFullName + "[" + i2 + "]", ReactPropTypesSecret);
            if (error instanceof Error) {
              return error;
            }
          }
          return null;
        }
        return createChainableTypeChecker(validate2);
      }
      function createElementTypeChecker() {
        function validate2(props, propName, componentName, location, propFullName) {
          var propValue = props[propName];
          if (!isValidElement(propValue)) {
            var propType = getPropType(propValue);
            return new PropTypeError("Invalid " + location + " `" + propFullName + "` of type " + ("`" + propType + "` supplied to `" + componentName + "`, expected a single ReactElement."));
          }
          return null;
        }
        return createChainableTypeChecker(validate2);
      }
      function createElementTypeTypeChecker() {
        function validate2(props, propName, componentName, location, propFullName) {
          var propValue = props[propName];
          if (!ReactIs.isValidElementType(propValue)) {
            var propType = getPropType(propValue);
            return new PropTypeError("Invalid " + location + " `" + propFullName + "` of type " + ("`" + propType + "` supplied to `" + componentName + "`, expected a single ReactElement type."));
          }
          return null;
        }
        return createChainableTypeChecker(validate2);
      }
      function createInstanceTypeChecker(expectedClass) {
        function validate2(props, propName, componentName, location, propFullName) {
          if (!(props[propName] instanceof expectedClass)) {
            var expectedClassName = expectedClass.name || ANONYMOUS;
            var actualClassName = getClassName(props[propName]);
            return new PropTypeError("Invalid " + location + " `" + propFullName + "` of type " + ("`" + actualClassName + "` supplied to `" + componentName + "`, expected ") + ("instance of `" + expectedClassName + "`."));
          }
          return null;
        }
        return createChainableTypeChecker(validate2);
      }
      function createEnumTypeChecker(expectedValues) {
        if (!Array.isArray(expectedValues)) {
          if (true) {
            if (arguments.length > 1) {
              printWarning("Invalid arguments supplied to oneOf, expected an array, got " + arguments.length + " arguments. A common mistake is to write oneOf(x, y, z) instead of oneOf([x, y, z]).");
            } else {
              printWarning("Invalid argument supplied to oneOf, expected an array.");
            }
          }
          return emptyFunctionThatReturnsNull;
        }
        function validate2(props, propName, componentName, location, propFullName) {
          var propValue = props[propName];
          for (var i2 = 0; i2 < expectedValues.length; i2++) {
            if (is(propValue, expectedValues[i2])) {
              return null;
            }
          }
          var valuesString = JSON.stringify(expectedValues, function replacer(key, value) {
            var type = getPreciseType(value);
            if (type === "symbol") {
              return String(value);
            }
            return value;
          });
          return new PropTypeError("Invalid " + location + " `" + propFullName + "` of value `" + String(propValue) + "` " + ("supplied to `" + componentName + "`, expected one of " + valuesString + "."));
        }
        return createChainableTypeChecker(validate2);
      }
      function createObjectOfTypeChecker(typeChecker) {
        function validate2(props, propName, componentName, location, propFullName) {
          if (typeof typeChecker !== "function") {
            return new PropTypeError("Property `" + propFullName + "` of component `" + componentName + "` has invalid PropType notation inside objectOf.");
          }
          var propValue = props[propName];
          var propType = getPropType(propValue);
          if (propType !== "object") {
            return new PropTypeError("Invalid " + location + " `" + propFullName + "` of type " + ("`" + propType + "` supplied to `" + componentName + "`, expected an object."));
          }
          for (var key in propValue) {
            if (has(propValue, key)) {
              var error = typeChecker(propValue, key, componentName, location, propFullName + "." + key, ReactPropTypesSecret);
              if (error instanceof Error) {
                return error;
              }
            }
          }
          return null;
        }
        return createChainableTypeChecker(validate2);
      }
      function createUnionTypeChecker(arrayOfTypeCheckers) {
        if (!Array.isArray(arrayOfTypeCheckers)) {
          true ? printWarning("Invalid argument supplied to oneOfType, expected an instance of array.") : void 0;
          return emptyFunctionThatReturnsNull;
        }
        for (var i2 = 0; i2 < arrayOfTypeCheckers.length; i2++) {
          var checker = arrayOfTypeCheckers[i2];
          if (typeof checker !== "function") {
            printWarning("Invalid argument supplied to oneOfType. Expected an array of check functions, but received " + getPostfixForTypeWarning(checker) + " at index " + i2 + ".");
            return emptyFunctionThatReturnsNull;
          }
        }
        function validate2(props, propName, componentName, location, propFullName) {
          var expectedTypes = [];
          for (var i3 = 0; i3 < arrayOfTypeCheckers.length; i3++) {
            var checker2 = arrayOfTypeCheckers[i3];
            var checkerResult = checker2(props, propName, componentName, location, propFullName, ReactPropTypesSecret);
            if (checkerResult == null) {
              return null;
            }
            if (checkerResult.data && has(checkerResult.data, "expectedType")) {
              expectedTypes.push(checkerResult.data.expectedType);
            }
          }
          var expectedTypesMessage = expectedTypes.length > 0 ? ", expected one of type [" + expectedTypes.join(", ") + "]" : "";
          return new PropTypeError("Invalid " + location + " `" + propFullName + "` supplied to " + ("`" + componentName + "`" + expectedTypesMessage + "."));
        }
        return createChainableTypeChecker(validate2);
      }
      function createNodeChecker() {
        function validate2(props, propName, componentName, location, propFullName) {
          if (!isNode(props[propName])) {
            return new PropTypeError("Invalid " + location + " `" + propFullName + "` supplied to " + ("`" + componentName + "`, expected a ReactNode."));
          }
          return null;
        }
        return createChainableTypeChecker(validate2);
      }
      function invalidValidatorError(componentName, location, propFullName, key, type) {
        return new PropTypeError((componentName || "React class") + ": " + location + " type `" + propFullName + "." + key + "` is invalid; it must be a function, usually from the `prop-types` package, but received `" + type + "`.");
      }
      function createShapeTypeChecker(shapeTypes) {
        function validate2(props, propName, componentName, location, propFullName) {
          var propValue = props[propName];
          var propType = getPropType(propValue);
          if (propType !== "object") {
            return new PropTypeError("Invalid " + location + " `" + propFullName + "` of type `" + propType + "` " + ("supplied to `" + componentName + "`, expected `object`."));
          }
          for (var key in shapeTypes) {
            var checker = shapeTypes[key];
            if (typeof checker !== "function") {
              return invalidValidatorError(componentName, location, propFullName, key, getPreciseType(checker));
            }
            var error = checker(propValue, key, componentName, location, propFullName + "." + key, ReactPropTypesSecret);
            if (error) {
              return error;
            }
          }
          return null;
        }
        return createChainableTypeChecker(validate2);
      }
      function createStrictShapeTypeChecker(shapeTypes) {
        function validate2(props, propName, componentName, location, propFullName) {
          var propValue = props[propName];
          var propType = getPropType(propValue);
          if (propType !== "object") {
            return new PropTypeError("Invalid " + location + " `" + propFullName + "` of type `" + propType + "` " + ("supplied to `" + componentName + "`, expected `object`."));
          }
          var allKeys = assign({}, props[propName], shapeTypes);
          for (var key in allKeys) {
            var checker = shapeTypes[key];
            if (has(shapeTypes, key) && typeof checker !== "function") {
              return invalidValidatorError(componentName, location, propFullName, key, getPreciseType(checker));
            }
            if (!checker) {
              return new PropTypeError("Invalid " + location + " `" + propFullName + "` key `" + key + "` supplied to `" + componentName + "`.\nBad object: " + JSON.stringify(props[propName], null, "  ") + "\nValid keys: " + JSON.stringify(Object.keys(shapeTypes), null, "  "));
            }
            var error = checker(propValue, key, componentName, location, propFullName + "." + key, ReactPropTypesSecret);
            if (error) {
              return error;
            }
          }
          return null;
        }
        return createChainableTypeChecker(validate2);
      }
      function isNode(propValue) {
        switch (typeof propValue) {
          case "number":
          case "string":
          case "undefined":
            return true;
          case "boolean":
            return !propValue;
          case "object":
            if (Array.isArray(propValue)) {
              return propValue.every(isNode);
            }
            if (propValue === null || isValidElement(propValue)) {
              return true;
            }
            var iteratorFn = getIteratorFn(propValue);
            if (iteratorFn) {
              var iterator = iteratorFn.call(propValue);
              var step;
              if (iteratorFn !== propValue.entries) {
                while (!(step = iterator.next()).done) {
                  if (!isNode(step.value)) {
                    return false;
                  }
                }
              } else {
                while (!(step = iterator.next()).done) {
                  var entry = step.value;
                  if (entry) {
                    if (!isNode(entry[1])) {
                      return false;
                    }
                  }
                }
              }
            } else {
              return false;
            }
            return true;
          default:
            return false;
        }
      }
      function isSymbol(propType, propValue) {
        if (propType === "symbol") {
          return true;
        }
        if (!propValue) {
          return false;
        }
        if (propValue["@@toStringTag"] === "Symbol") {
          return true;
        }
        if (typeof Symbol === "function" && propValue instanceof Symbol) {
          return true;
        }
        return false;
      }
      function getPropType(propValue) {
        var propType = typeof propValue;
        if (Array.isArray(propValue)) {
          return "array";
        }
        if (propValue instanceof RegExp) {
          return "object";
        }
        if (isSymbol(propType, propValue)) {
          return "symbol";
        }
        return propType;
      }
      function getPreciseType(propValue) {
        if (typeof propValue === "undefined" || propValue === null) {
          return "" + propValue;
        }
        var propType = getPropType(propValue);
        if (propType === "object") {
          if (propValue instanceof Date) {
            return "date";
          } else if (propValue instanceof RegExp) {
            return "regexp";
          }
        }
        return propType;
      }
      function getPostfixForTypeWarning(value) {
        var type = getPreciseType(value);
        switch (type) {
          case "array":
          case "object":
            return "an " + type;
          case "boolean":
          case "date":
          case "regexp":
            return "a " + type;
          default:
            return type;
        }
      }
      function getClassName(propValue) {
        if (!propValue.constructor || !propValue.constructor.name) {
          return ANONYMOUS;
        }
        return propValue.constructor.name;
      }
      ReactPropTypes.checkPropTypes = checkPropTypes;
      ReactPropTypes.resetWarningCache = checkPropTypes.resetWarningCache;
      ReactPropTypes.PropTypes = ReactPropTypes;
      return ReactPropTypes;
    };
  }
});
var require_prop_types = __commonJS({
  "node_modules/prop-types/index.js"(exports, module) {
    if (true) {
      ReactIs = require_react_is();
      throwOnDirectAccess = true;
      module.exports = require_factoryWithTypeCheckers()(ReactIs.isElement, throwOnDirectAccess);
    } else {
      module.exports = null();
    }
    var ReactIs;
    var throwOnDirectAccess;
  }
});
var require_hoist_non_react_statics_cjs = __commonJS({
  "node_modules/hoist-non-react-statics/dist/hoist-non-react-statics.cjs.js"(exports, module) {
    "use strict";
    var reactIs = require_react_is();
    var REACT_STATICS = {
      childContextTypes: true,
      contextType: true,
      contextTypes: true,
      defaultProps: true,
      displayName: true,
      getDefaultProps: true,
      getDerivedStateFromError: true,
      getDerivedStateFromProps: true,
      mixins: true,
      propTypes: true,
      type: true
    };
    var KNOWN_STATICS = {
      name: true,
      length: true,
      prototype: true,
      caller: true,
      callee: true,
      arguments: true,
      arity: true
    };
    var FORWARD_REF_STATICS = {
      "$$typeof": true,
      render: true,
      defaultProps: true,
      displayName: true,
      propTypes: true
    };
    var MEMO_STATICS = {
      "$$typeof": true,
      compare: true,
      defaultProps: true,
      displayName: true,
      propTypes: true,
      type: true
    };
    var TYPE_STATICS = {};
    TYPE_STATICS[reactIs.ForwardRef] = FORWARD_REF_STATICS;
    TYPE_STATICS[reactIs.Memo] = MEMO_STATICS;
    function getStatics(component) {
      if (reactIs.isMemo(component)) {
        return MEMO_STATICS;
      }
      return TYPE_STATICS[component["$$typeof"]] || REACT_STATICS;
    }
    var defineProperty = Object.defineProperty;
    var getOwnPropertyNames = Object.getOwnPropertyNames;
    var getOwnPropertySymbols = Object.getOwnPropertySymbols;
    var getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;
    var getPrototypeOf = Object.getPrototypeOf;
    var objectPrototype = Object.prototype;
    function hoistNonReactStatics(targetComponent, sourceComponent, blacklist) {
      if (typeof sourceComponent !== "string") {
        if (objectPrototype) {
          var inheritedComponent = getPrototypeOf(sourceComponent);
          if (inheritedComponent && inheritedComponent !== objectPrototype) {
            hoistNonReactStatics(targetComponent, inheritedComponent, blacklist);
          }
        }
        var keys = getOwnPropertyNames(sourceComponent);
        if (getOwnPropertySymbols) {
          keys = keys.concat(getOwnPropertySymbols(sourceComponent));
        }
        var targetStatics = getStatics(targetComponent);
        var sourceStatics = getStatics(sourceComponent);
        for (var i2 = 0; i2 < keys.length; ++i2) {
          var key = keys[i2];
          if (!KNOWN_STATICS[key] && !(blacklist && blacklist[key]) && !(sourceStatics && sourceStatics[key]) && !(targetStatics && targetStatics[key])) {
            var descriptor = getOwnPropertyDescriptor(sourceComponent, key);
            try {
              defineProperty(targetComponent, key, descriptor);
            } catch (e) {
            }
          }
        }
      }
      return targetComponent;
    }
    module.exports = hoistNonReactStatics;
  }
});
var require_react_is_development2 = __commonJS({
  "node_modules/react-redux/node_modules/react-is/cjs/react-is.development.js"(exports) {
    "use strict";
    if (true) {
      (function() {
        "use strict";
        var REACT_ELEMENT_TYPE = 60103;
        var REACT_PORTAL_TYPE = 60106;
        var REACT_FRAGMENT_TYPE = 60107;
        var REACT_STRICT_MODE_TYPE = 60108;
        var REACT_PROFILER_TYPE = 60114;
        var REACT_PROVIDER_TYPE = 60109;
        var REACT_CONTEXT_TYPE = 60110;
        var REACT_FORWARD_REF_TYPE = 60112;
        var REACT_SUSPENSE_TYPE = 60113;
        var REACT_SUSPENSE_LIST_TYPE = 60120;
        var REACT_MEMO_TYPE = 60115;
        var REACT_LAZY_TYPE = 60116;
        var REACT_BLOCK_TYPE = 60121;
        var REACT_SERVER_BLOCK_TYPE = 60122;
        var REACT_FUNDAMENTAL_TYPE = 60117;
        var REACT_SCOPE_TYPE = 60119;
        var REACT_OPAQUE_ID_TYPE = 60128;
        var REACT_DEBUG_TRACING_MODE_TYPE = 60129;
        var REACT_OFFSCREEN_TYPE = 60130;
        var REACT_LEGACY_HIDDEN_TYPE = 60131;
        if (typeof Symbol === "function" && Symbol.for) {
          var symbolFor = Symbol.for;
          REACT_ELEMENT_TYPE = symbolFor("react.element");
          REACT_PORTAL_TYPE = symbolFor("react.portal");
          REACT_FRAGMENT_TYPE = symbolFor("react.fragment");
          REACT_STRICT_MODE_TYPE = symbolFor("react.strict_mode");
          REACT_PROFILER_TYPE = symbolFor("react.profiler");
          REACT_PROVIDER_TYPE = symbolFor("react.provider");
          REACT_CONTEXT_TYPE = symbolFor("react.context");
          REACT_FORWARD_REF_TYPE = symbolFor("react.forward_ref");
          REACT_SUSPENSE_TYPE = symbolFor("react.suspense");
          REACT_SUSPENSE_LIST_TYPE = symbolFor("react.suspense_list");
          REACT_MEMO_TYPE = symbolFor("react.memo");
          REACT_LAZY_TYPE = symbolFor("react.lazy");
          REACT_BLOCK_TYPE = symbolFor("react.block");
          REACT_SERVER_BLOCK_TYPE = symbolFor("react.server.block");
          REACT_FUNDAMENTAL_TYPE = symbolFor("react.fundamental");
          REACT_SCOPE_TYPE = symbolFor("react.scope");
          REACT_OPAQUE_ID_TYPE = symbolFor("react.opaque.id");
          REACT_DEBUG_TRACING_MODE_TYPE = symbolFor("react.debug_trace_mode");
          REACT_OFFSCREEN_TYPE = symbolFor("react.offscreen");
          REACT_LEGACY_HIDDEN_TYPE = symbolFor("react.legacy_hidden");
        }
        var enableScopeAPI = false;
        function isValidElementType2(type) {
          if (typeof type === "string" || typeof type === "function") {
            return true;
          }
          if (type === REACT_FRAGMENT_TYPE || type === REACT_PROFILER_TYPE || type === REACT_DEBUG_TRACING_MODE_TYPE || type === REACT_STRICT_MODE_TYPE || type === REACT_SUSPENSE_TYPE || type === REACT_SUSPENSE_LIST_TYPE || type === REACT_LEGACY_HIDDEN_TYPE || enableScopeAPI) {
            return true;
          }
          if (typeof type === "object" && type !== null) {
            if (type.$$typeof === REACT_LAZY_TYPE || type.$$typeof === REACT_MEMO_TYPE || type.$$typeof === REACT_PROVIDER_TYPE || type.$$typeof === REACT_CONTEXT_TYPE || type.$$typeof === REACT_FORWARD_REF_TYPE || type.$$typeof === REACT_FUNDAMENTAL_TYPE || type.$$typeof === REACT_BLOCK_TYPE || type[0] === REACT_SERVER_BLOCK_TYPE) {
              return true;
            }
          }
          return false;
        }
        function typeOf(object) {
          if (typeof object === "object" && object !== null) {
            var $$typeof = object.$$typeof;
            switch ($$typeof) {
              case REACT_ELEMENT_TYPE:
                var type = object.type;
                switch (type) {
                  case REACT_FRAGMENT_TYPE:
                  case REACT_PROFILER_TYPE:
                  case REACT_STRICT_MODE_TYPE:
                  case REACT_SUSPENSE_TYPE:
                  case REACT_SUSPENSE_LIST_TYPE:
                    return type;
                  default:
                    var $$typeofType = type && type.$$typeof;
                    switch ($$typeofType) {
                      case REACT_CONTEXT_TYPE:
                      case REACT_FORWARD_REF_TYPE:
                      case REACT_LAZY_TYPE:
                      case REACT_MEMO_TYPE:
                      case REACT_PROVIDER_TYPE:
                        return $$typeofType;
                      default:
                        return $$typeof;
                    }
                }
              case REACT_PORTAL_TYPE:
                return $$typeof;
            }
          }
          return void 0;
        }
        var ContextConsumer = REACT_CONTEXT_TYPE;
        var ContextProvider = REACT_PROVIDER_TYPE;
        var Element = REACT_ELEMENT_TYPE;
        var ForwardRef = REACT_FORWARD_REF_TYPE;
        var Fragment3 = REACT_FRAGMENT_TYPE;
        var Lazy = REACT_LAZY_TYPE;
        var Memo = REACT_MEMO_TYPE;
        var Portal = REACT_PORTAL_TYPE;
        var Profiler = REACT_PROFILER_TYPE;
        var StrictMode = REACT_STRICT_MODE_TYPE;
        var Suspense = REACT_SUSPENSE_TYPE;
        var hasWarnedAboutDeprecatedIsAsyncMode = false;
        var hasWarnedAboutDeprecatedIsConcurrentMode = false;
        function isAsyncMode(object) {
          {
            if (!hasWarnedAboutDeprecatedIsAsyncMode) {
              hasWarnedAboutDeprecatedIsAsyncMode = true;
              console["warn"]("The ReactIs.isAsyncMode() alias has been deprecated, and will be removed in React 18+.");
            }
          }
          return false;
        }
        function isConcurrentMode(object) {
          {
            if (!hasWarnedAboutDeprecatedIsConcurrentMode) {
              hasWarnedAboutDeprecatedIsConcurrentMode = true;
              console["warn"]("The ReactIs.isConcurrentMode() alias has been deprecated, and will be removed in React 18+.");
            }
          }
          return false;
        }
        function isContextConsumer2(object) {
          return typeOf(object) === REACT_CONTEXT_TYPE;
        }
        function isContextProvider(object) {
          return typeOf(object) === REACT_PROVIDER_TYPE;
        }
        function isElement(object) {
          return typeof object === "object" && object !== null && object.$$typeof === REACT_ELEMENT_TYPE;
        }
        function isForwardRef(object) {
          return typeOf(object) === REACT_FORWARD_REF_TYPE;
        }
        function isFragment(object) {
          return typeOf(object) === REACT_FRAGMENT_TYPE;
        }
        function isLazy(object) {
          return typeOf(object) === REACT_LAZY_TYPE;
        }
        function isMemo(object) {
          return typeOf(object) === REACT_MEMO_TYPE;
        }
        function isPortal(object) {
          return typeOf(object) === REACT_PORTAL_TYPE;
        }
        function isProfiler(object) {
          return typeOf(object) === REACT_PROFILER_TYPE;
        }
        function isStrictMode(object) {
          return typeOf(object) === REACT_STRICT_MODE_TYPE;
        }
        function isSuspense(object) {
          return typeOf(object) === REACT_SUSPENSE_TYPE;
        }
        exports.ContextConsumer = ContextConsumer;
        exports.ContextProvider = ContextProvider;
        exports.Element = Element;
        exports.ForwardRef = ForwardRef;
        exports.Fragment = Fragment3;
        exports.Lazy = Lazy;
        exports.Memo = Memo;
        exports.Portal = Portal;
        exports.Profiler = Profiler;
        exports.StrictMode = StrictMode;
        exports.Suspense = Suspense;
        exports.isAsyncMode = isAsyncMode;
        exports.isConcurrentMode = isConcurrentMode;
        exports.isContextConsumer = isContextConsumer2;
        exports.isContextProvider = isContextProvider;
        exports.isElement = isElement;
        exports.isForwardRef = isForwardRef;
        exports.isFragment = isFragment;
        exports.isLazy = isLazy;
        exports.isMemo = isMemo;
        exports.isPortal = isPortal;
        exports.isProfiler = isProfiler;
        exports.isStrictMode = isStrictMode;
        exports.isSuspense = isSuspense;
        exports.isValidElementType = isValidElementType2;
        exports.typeOf = typeOf;
      })();
    }
  }
});
var require_react_is2 = __commonJS({
  "node_modules/react-redux/node_modules/react-is/index.js"(exports, module) {
    "use strict";
    if (false) {
      module.exports = null;
    } else {
      module.exports = require_react_is_development2();
    }
  }
});
var require_lodash = __commonJS({
  "node_modules/lodash.isfunction/index.js"(exports, module) {
    var asyncTag = "[object AsyncFunction]";
    var funcTag = "[object Function]";
    var genTag = "[object GeneratorFunction]";
    var nullTag = "[object Null]";
    var proxyTag = "[object Proxy]";
    var undefinedTag = "[object Undefined]";
    var freeGlobal = typeof global == "object" && global && global.Object === Object && global;
    var freeSelf = typeof self == "object" && self && self.Object === Object && self;
    var root = freeGlobal || freeSelf || Function("return this")();
    var objectProto = Object.prototype;
    var hasOwnProperty = objectProto.hasOwnProperty;
    var nativeObjectToString = objectProto.toString;
    var Symbol2 = root.Symbol;
    var symToStringTag = Symbol2 ? Symbol2.toStringTag : void 0;
    function baseGetTag(value) {
      if (value == null) {
        return value === void 0 ? undefinedTag : nullTag;
      }
      return symToStringTag && symToStringTag in Object(value) ? getRawTag(value) : objectToString(value);
    }
    function getRawTag(value) {
      var isOwn = hasOwnProperty.call(value, symToStringTag), tag = value[symToStringTag];
      try {
        value[symToStringTag] = void 0;
        var unmasked = true;
      } catch (e) {
      }
      var result = nativeObjectToString.call(value);
      if (unmasked) {
        if (isOwn) {
          value[symToStringTag] = tag;
        } else {
          delete value[symToStringTag];
        }
      }
      return result;
    }
    function objectToString(value) {
      return nativeObjectToString.call(value);
    }
    function isFunction2(value) {
      if (!isObject(value)) {
        return false;
      }
      var tag = baseGetTag(value);
      return tag == funcTag || tag == genTag || tag == asyncTag || tag == proxyTag;
    }
    function isObject(value) {
      var type = typeof value;
      return value != null && (type == "object" || type == "function");
    }
    module.exports = isFunction2;
  }
});
var import_axios = __toESM(require_axios2(), 1);
var DEFAULT_CONFIG = {};
var axiosInstances = {
  default: import_axios.default.create(DEFAULT_CONFIG)
};
function createAxiosInstance2(instanceName) {
  if (instanceName) {
    if (axiosInstances[instanceName]) {
      return axiosInstances;
    }
    axiosInstances[instanceName] = import_axios.default.create(DEFAULT_CONFIG);
  }
  return axiosInstances;
}
var request = async function(options) {
  try {
    const instanceName = options.instanceName ? options.instanceName : "default";
    const axiosInstance = createAxiosInstance2()[instanceName];
    if (!(typeof axiosInstance === "function")) {
      throw new Error(`unknown ${instanceName} in request method`);
    }
    const response = await axiosInstance(options);
    if (axiosInstance.defaults.withFullResponse || options.withFullResponse) {
      return response;
    }
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
[
  "delete",
  "get",
  "head",
  "options"
].forEach((method) => {
  request[method] = function(url, config) {
    return request(Object.assign(config || {}, {
      method,
      url
    }));
  };
});
[
  "post",
  "put",
  "patch"
].forEach((method) => {
  request[method] = function(url, data, config) {
    return request(Object.assign(config || {}, {
      method,
      url,
      data
    }));
  };
});
request.CancelToken = import_axios.default.CancelToken;
request.isCancel = import_axios.default.isCancel;
var validate = function(validations) {
  if (true) {
    for (var _i = 0, validations_1 = validations; _i < validations_1.length; _i++) {
      var validation = validations_1[_i];
      var condition = validation[0];
      var errorMessage = validation[1];
      if (condition) {
        throw new Error(errorMessage);
      }
    }
  }
};
var validate_default = validate;
var pluginFactory_default = function(config) {
  return {
    config,
    validate: validate_default,
    create: function(plugin) {
      validate_default([
        [
          plugin.onStoreCreated && typeof plugin.onStoreCreated !== "function",
          "Plugin onStoreCreated must be a function"
        ],
        [
          plugin.onModel && typeof plugin.onModel !== "function",
          "Plugin onModel must be a function"
        ],
        [
          plugin.middleware && typeof plugin.middleware !== "function",
          "Plugin middleware must be a function"
        ]
      ]);
      if (plugin.onInit) {
        plugin.onInit.call(this);
      }
      var result = {};
      if (plugin.exposed) {
        for (var _i = 0, _a = Object.keys(plugin.exposed); _i < _a.length; _i++) {
          var key = _a[_i];
          this[key] = typeof plugin.exposed[key] === "function" ? plugin.exposed[key].bind(this) : Object.create(plugin.exposed[key]);
        }
      }
      for (var _b = 0, _c = [
        "onModel",
        "middleware",
        "onStoreCreated"
      ]; _b < _c.length; _b++) {
        var method = _c[_b];
        if (plugin[method]) {
          result[method] = plugin[method].bind(this);
        }
      }
      return result;
    }
  };
};
var __awaiter = function(thisArg, _arguments, P2, generator) {
  function adopt(value) {
    return value instanceof P2 ? value : new P2(function(resolve) {
      resolve(value);
    });
  }
  return new (P2 || (P2 = Promise))(function(resolve, reject) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    }
    function rejected(value) {
      try {
        step(generator["throw"](value));
      } catch (e) {
        reject(e);
      }
    }
    function step(result) {
      result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
    }
    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};
var __generator = function(thisArg, body) {
  var _2 = {
    label: 0,
    sent: function() {
      if (t2[0] & 1)
        throw t2[1];
      return t2[1];
    },
    trys: [],
    ops: []
  }, f2, y2, t2, g2;
  return g2 = {
    next: verb(0),
    "throw": verb(1),
    "return": verb(2)
  }, typeof Symbol === "function" && (g2[Symbol.iterator] = function() {
    return this;
  }), g2;
  function verb(n2) {
    return function(v2) {
      return step([
        n2,
        v2
      ]);
    };
  }
  function step(op) {
    if (f2)
      throw new TypeError("Generator is already executing.");
    while (_2)
      try {
        if (f2 = 1, y2 && (t2 = op[0] & 2 ? y2["return"] : op[0] ? y2["throw"] || ((t2 = y2["return"]) && t2.call(y2), 0) : y2.next) && !(t2 = t2.call(y2, op[1])).done)
          return t2;
        if (y2 = 0, t2)
          op = [
            op[0] & 2,
            t2.value
          ];
        switch (op[0]) {
          case 0:
          case 1:
            t2 = op;
            break;
          case 4:
            _2.label++;
            return {
              value: op[1],
              done: false
            };
          case 5:
            _2.label++;
            y2 = op[1];
            op = [
              0
            ];
            continue;
          case 7:
            op = _2.ops.pop();
            _2.trys.pop();
            continue;
          default:
            if (!(t2 = _2.trys, t2 = t2.length > 0 && t2[t2.length - 1]) && (op[0] === 6 || op[0] === 2)) {
              _2 = 0;
              continue;
            }
            if (op[0] === 3 && (!t2 || op[1] > t2[0] && op[1] < t2[3])) {
              _2.label = op[1];
              break;
            }
            if (op[0] === 6 && _2.label < t2[1]) {
              _2.label = t2[1];
              t2 = op;
              break;
            }
            if (t2 && _2.label < t2[2]) {
              _2.label = t2[2];
              _2.ops.push(op);
              break;
            }
            if (t2[2])
              _2.ops.pop();
            _2.trys.pop();
            continue;
        }
        op = body.call(thisArg, _2);
      } catch (e) {
        op = [
          6,
          e
        ];
        y2 = 0;
      } finally {
        f2 = t2 = 0;
      }
    if (op[0] & 5)
      throw op[1];
    return {
      value: op[0] ? op[1] : void 0,
      done: true
    };
  }
};
var dispatchPlugin = {
  exposed: {
    storeDispatch: function(action, state) {
      console.warn("Warning: store not yet loaded");
    },
    storeGetState: function() {
      console.warn("Warning: store not yet loaded");
    },
    dispatch: function(action) {
      return this.storeDispatch(action);
    },
    createDispatcher: function(modelName, reducerName) {
      var _this = this;
      return function(payload, meta) {
        return __awaiter(_this, void 0, void 0, function() {
          var action;
          return __generator(this, function(_a) {
            action = {
              type: modelName + "/" + reducerName
            };
            if (typeof payload !== "undefined") {
              action.payload = payload;
            }
            if (typeof meta !== "undefined") {
              action.meta = meta;
            }
            return [
              2,
              this.dispatch(action)
            ];
          });
        });
      };
    }
  },
  onStoreCreated: function(store) {
    this.storeDispatch = store.dispatch;
    this.storeGetState = store.getState;
    return {
      dispatch: this.dispatch
    };
  },
  onModel: function(model) {
    this.dispatch[model.name] = {};
    if (!model.reducers) {
      return;
    }
    for (var _i = 0, _a = Object.keys(model.reducers); _i < _a.length; _i++) {
      var reducerName = _a[_i];
      this.validate([
        [
          !!reducerName.match(/\/.+\//),
          "Invalid reducer name (" + model.name + "/" + reducerName + ")"
        ],
        [
          typeof model.reducers[reducerName] !== "function",
          "Invalid reducer (" + model.name + "/" + reducerName + "). Must be a function"
        ]
      ]);
      this.dispatch[model.name][reducerName] = this.createDispatcher.apply(this, [
        model.name,
        reducerName
      ]);
    }
  }
};
var dispatch_default = dispatchPlugin;
var __awaiter2 = function(thisArg, _arguments, P2, generator) {
  function adopt(value) {
    return value instanceof P2 ? value : new P2(function(resolve) {
      resolve(value);
    });
  }
  return new (P2 || (P2 = Promise))(function(resolve, reject) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    }
    function rejected(value) {
      try {
        step(generator["throw"](value));
      } catch (e) {
        reject(e);
      }
    }
    function step(result) {
      result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
    }
    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};
var __generator2 = function(thisArg, body) {
  var _2 = {
    label: 0,
    sent: function() {
      if (t2[0] & 1)
        throw t2[1];
      return t2[1];
    },
    trys: [],
    ops: []
  }, f2, y2, t2, g2;
  return g2 = {
    next: verb(0),
    "throw": verb(1),
    "return": verb(2)
  }, typeof Symbol === "function" && (g2[Symbol.iterator] = function() {
    return this;
  }), g2;
  function verb(n2) {
    return function(v2) {
      return step([
        n2,
        v2
      ]);
    };
  }
  function step(op) {
    if (f2)
      throw new TypeError("Generator is already executing.");
    while (_2)
      try {
        if (f2 = 1, y2 && (t2 = op[0] & 2 ? y2["return"] : op[0] ? y2["throw"] || ((t2 = y2["return"]) && t2.call(y2), 0) : y2.next) && !(t2 = t2.call(y2, op[1])).done)
          return t2;
        if (y2 = 0, t2)
          op = [
            op[0] & 2,
            t2.value
          ];
        switch (op[0]) {
          case 0:
          case 1:
            t2 = op;
            break;
          case 4:
            _2.label++;
            return {
              value: op[1],
              done: false
            };
          case 5:
            _2.label++;
            y2 = op[1];
            op = [
              0
            ];
            continue;
          case 7:
            op = _2.ops.pop();
            _2.trys.pop();
            continue;
          default:
            if (!(t2 = _2.trys, t2 = t2.length > 0 && t2[t2.length - 1]) && (op[0] === 6 || op[0] === 2)) {
              _2 = 0;
              continue;
            }
            if (op[0] === 3 && (!t2 || op[1] > t2[0] && op[1] < t2[3])) {
              _2.label = op[1];
              break;
            }
            if (op[0] === 6 && _2.label < t2[1]) {
              _2.label = t2[1];
              t2 = op;
              break;
            }
            if (t2 && _2.label < t2[2]) {
              _2.label = t2[2];
              _2.ops.push(op);
              break;
            }
            if (t2[2])
              _2.ops.pop();
            _2.trys.pop();
            continue;
        }
        op = body.call(thisArg, _2);
      } catch (e) {
        op = [
          6,
          e
        ];
        y2 = 0;
      } finally {
        f2 = t2 = 0;
      }
    if (op[0] & 5)
      throw op[1];
    return {
      value: op[0] ? op[1] : void 0,
      done: true
    };
  }
};
var effectsPlugin = {
  exposed: {
    effects: {}
  },
  onModel: function(model) {
    if (!model.effects) {
      return;
    }
    var effects = typeof model.effects === "function" ? model.effects(this.dispatch) : model.effects;
    this.validate([
      [
        typeof effects !== "object",
        "Invalid effects from Model(" + model.name + "), effects should return an object"
      ]
    ]);
    for (var _i = 0, _a = Object.keys(effects); _i < _a.length; _i++) {
      var effectName = _a[_i];
      this.validate([
        [
          !!effectName.match(/\//),
          "Invalid effect name (" + model.name + "/" + effectName + ")"
        ],
        [
          typeof effects[effectName] !== "function",
          "Invalid effect (" + model.name + "/" + effectName + "). Must be a function"
        ]
      ]);
      this.effects[model.name + "/" + effectName] = effects[effectName].bind(this.dispatch[model.name]);
      this.dispatch[model.name][effectName] = this.createDispatcher.apply(this, [
        model.name,
        effectName
      ]);
      this.dispatch[model.name][effectName].isEffect = true;
    }
  },
  middleware: function(store) {
    var _this = this;
    return function(next) {
      return function(action) {
        return __awaiter2(_this, void 0, void 0, function() {
          return __generator2(this, function(_a) {
            switch (_a.label) {
              case 0:
                if (!(action.type in this.effects))
                  return [
                    3,
                    2
                  ];
                return [
                  4,
                  next(action)
                ];
              case 1:
                _a.sent();
                return [
                  2,
                  this.effects[action.type](action.payload, store.getState(), action.meta)
                ];
              case 2:
                return [
                  2,
                  next(action)
                ];
            }
          });
        });
      };
    };
  }
};
var effects_default = effectsPlugin;
var redux_exports = {};
__export2(redux_exports, {
  __DO_NOT_USE__ActionTypes: () => ActionTypes,
  applyMiddleware: () => applyMiddleware,
  bindActionCreators: () => bindActionCreators,
  combineReducers: () => combineReducers,
  compose: () => compose,
  createStore: () => createStore2,
  legacy_createStore: () => legacy_createStore
});
function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }
  return obj;
}
function ownKeys(object, enumerableOnly) {
  var keys = Object.keys(object);
  if (Object.getOwnPropertySymbols) {
    var symbols = Object.getOwnPropertySymbols(object);
    enumerableOnly && (symbols = symbols.filter(function(sym) {
      return Object.getOwnPropertyDescriptor(object, sym).enumerable;
    })), keys.push.apply(keys, symbols);
  }
  return keys;
}
function _objectSpread2(target) {
  for (var i2 = 1; i2 < arguments.length; i2++) {
    var source = null != arguments[i2] ? arguments[i2] : {};
    i2 % 2 ? ownKeys(Object(source), true).forEach(function(key) {
      _defineProperty(target, key, source[key]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function(key) {
      Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
    });
  }
  return target;
}
var $$observable = function() {
  return typeof Symbol === "function" && Symbol.observable || "@@observable";
}();
var randomString = function randomString2() {
  return Math.random().toString(36).substring(7).split("").join(".");
};
var ActionTypes = {
  INIT: "@@redux/INIT" + randomString(),
  REPLACE: "@@redux/REPLACE" + randomString(),
  PROBE_UNKNOWN_ACTION: function PROBE_UNKNOWN_ACTION() {
    return "@@redux/PROBE_UNKNOWN_ACTION" + randomString();
  }
};
function isPlainObject(obj) {
  if (typeof obj !== "object" || obj === null)
    return false;
  var proto = obj;
  while (Object.getPrototypeOf(proto) !== null) {
    proto = Object.getPrototypeOf(proto);
  }
  return Object.getPrototypeOf(obj) === proto;
}
function miniKindOf(val) {
  if (val === void 0)
    return "undefined";
  if (val === null)
    return "null";
  var type = typeof val;
  switch (type) {
    case "boolean":
    case "string":
    case "number":
    case "symbol":
    case "function": {
      return type;
    }
  }
  if (Array.isArray(val))
    return "array";
  if (isDate(val))
    return "date";
  if (isError(val))
    return "error";
  var constructorName = ctorName(val);
  switch (constructorName) {
    case "Symbol":
    case "Promise":
    case "WeakMap":
    case "WeakSet":
    case "Map":
    case "Set":
      return constructorName;
  }
  return type.slice(8, -1).toLowerCase().replace(/\s/g, "");
}
function ctorName(val) {
  return typeof val.constructor === "function" ? val.constructor.name : null;
}
function isError(val) {
  return val instanceof Error || typeof val.message === "string" && val.constructor && typeof val.constructor.stackTraceLimit === "number";
}
function isDate(val) {
  if (val instanceof Date)
    return true;
  return typeof val.toDateString === "function" && typeof val.getDate === "function" && typeof val.setDate === "function";
}
function kindOf(val) {
  var typeOfVal = typeof val;
  if (true) {
    typeOfVal = miniKindOf(val);
  }
  return typeOfVal;
}
function createStore2(reducer, preloadedState, enhancer) {
  var _ref2;
  if (typeof preloadedState === "function" && typeof enhancer === "function" || typeof enhancer === "function" && typeof arguments[3] === "function") {
    throw new Error(false ? formatProdErrorMessage(0) : "It looks like you are passing several store enhancers to createStore(). This is not supported. Instead, compose them together to a single function. See https://redux.js.org/tutorials/fundamentals/part-4-store#creating-a-store-with-enhancers for an example.");
  }
  if (typeof preloadedState === "function" && typeof enhancer === "undefined") {
    enhancer = preloadedState;
    preloadedState = void 0;
  }
  if (typeof enhancer !== "undefined") {
    if (typeof enhancer !== "function") {
      throw new Error(false ? formatProdErrorMessage(1) : "Expected the enhancer to be a function. Instead, received: '" + kindOf(enhancer) + "'");
    }
    return enhancer(createStore2)(reducer, preloadedState);
  }
  if (typeof reducer !== "function") {
    throw new Error(false ? formatProdErrorMessage(2) : "Expected the root reducer to be a function. Instead, received: '" + kindOf(reducer) + "'");
  }
  var currentReducer = reducer;
  var currentState = preloadedState;
  var currentListeners = [];
  var nextListeners = currentListeners;
  var isDispatching = false;
  function ensureCanMutateNextListeners() {
    if (nextListeners === currentListeners) {
      nextListeners = currentListeners.slice();
    }
  }
  function getState() {
    if (isDispatching) {
      throw new Error(false ? formatProdErrorMessage(3) : "You may not call store.getState() while the reducer is executing. The reducer has already received the state as an argument. Pass it down from the top reducer instead of reading it from the store.");
    }
    return currentState;
  }
  function subscribe(listener) {
    if (typeof listener !== "function") {
      throw new Error(false ? formatProdErrorMessage(4) : "Expected the listener to be a function. Instead, received: '" + kindOf(listener) + "'");
    }
    if (isDispatching) {
      throw new Error(false ? formatProdErrorMessage(5) : "You may not call store.subscribe() while the reducer is executing. If you would like to be notified after the store has been updated, subscribe from a component and invoke store.getState() in the callback to access the latest state. See https://redux.js.org/api/store#subscribelistener for more details.");
    }
    var isSubscribed = true;
    ensureCanMutateNextListeners();
    nextListeners.push(listener);
    return function unsubscribe() {
      if (!isSubscribed) {
        return;
      }
      if (isDispatching) {
        throw new Error(false ? formatProdErrorMessage(6) : "You may not unsubscribe from a store listener while the reducer is executing. See https://redux.js.org/api/store#subscribelistener for more details.");
      }
      isSubscribed = false;
      ensureCanMutateNextListeners();
      var index = nextListeners.indexOf(listener);
      nextListeners.splice(index, 1);
      currentListeners = null;
    };
  }
  function dispatch(action) {
    if (!isPlainObject(action)) {
      throw new Error(false ? formatProdErrorMessage(7) : "Actions must be plain objects. Instead, the actual type was: '" + kindOf(action) + "'. You may need to add middleware to your store setup to handle dispatching other values, such as 'redux-thunk' to handle dispatching functions. See https://redux.js.org/tutorials/fundamentals/part-4-store#middleware and https://redux.js.org/tutorials/fundamentals/part-6-async-logic#using-the-redux-thunk-middleware for examples.");
    }
    if (typeof action.type === "undefined") {
      throw new Error(false ? formatProdErrorMessage(8) : 'Actions may not have an undefined "type" property. You may have misspelled an action type string constant.');
    }
    if (isDispatching) {
      throw new Error(false ? formatProdErrorMessage(9) : "Reducers may not dispatch actions.");
    }
    try {
      isDispatching = true;
      currentState = currentReducer(currentState, action);
    } finally {
      isDispatching = false;
    }
    var listeners = currentListeners = nextListeners;
    for (var i2 = 0; i2 < listeners.length; i2++) {
      var listener = listeners[i2];
      listener();
    }
    return action;
  }
  function replaceReducer(nextReducer) {
    if (typeof nextReducer !== "function") {
      throw new Error(false ? formatProdErrorMessage(10) : "Expected the nextReducer to be a function. Instead, received: '" + kindOf(nextReducer));
    }
    currentReducer = nextReducer;
    dispatch({
      type: ActionTypes.REPLACE
    });
  }
  function observable() {
    var _ref;
    var outerSubscribe = subscribe;
    return _ref = {
      subscribe: function subscribe2(observer) {
        if (typeof observer !== "object" || observer === null) {
          throw new Error(false ? formatProdErrorMessage(11) : "Expected the observer to be an object. Instead, received: '" + kindOf(observer) + "'");
        }
        function observeState() {
          if (observer.next) {
            observer.next(getState());
          }
        }
        observeState();
        var unsubscribe = outerSubscribe(observeState);
        return {
          unsubscribe
        };
      }
    }, _ref[$$observable] = function() {
      return this;
    }, _ref;
  }
  dispatch({
    type: ActionTypes.INIT
  });
  return _ref2 = {
    dispatch,
    subscribe,
    getState,
    replaceReducer
  }, _ref2[$$observable] = observable, _ref2;
}
var legacy_createStore = createStore2;
function warning(message) {
  if (typeof console !== "undefined" && typeof console.error === "function") {
    console.error(message);
  }
  try {
    throw new Error(message);
  } catch (e) {
  }
}
function getUnexpectedStateShapeWarningMessage(inputState, reducers, action, unexpectedKeyCache) {
  var reducerKeys = Object.keys(reducers);
  var argumentName = action && action.type === ActionTypes.INIT ? "preloadedState argument passed to createStore" : "previous state received by the reducer";
  if (reducerKeys.length === 0) {
    return "Store does not have a valid reducer. Make sure the argument passed to combineReducers is an object whose values are reducers.";
  }
  if (!isPlainObject(inputState)) {
    return "The " + argumentName + ' has unexpected type of "' + kindOf(inputState) + '". Expected argument to be an object with the following ' + ('keys: "' + reducerKeys.join('", "') + '"');
  }
  var unexpectedKeys = Object.keys(inputState).filter(function(key) {
    return !reducers.hasOwnProperty(key) && !unexpectedKeyCache[key];
  });
  unexpectedKeys.forEach(function(key) {
    unexpectedKeyCache[key] = true;
  });
  if (action && action.type === ActionTypes.REPLACE)
    return;
  if (unexpectedKeys.length > 0) {
    return "Unexpected " + (unexpectedKeys.length > 1 ? "keys" : "key") + " " + ('"' + unexpectedKeys.join('", "') + '" found in ' + argumentName + ". ") + "Expected to find one of the known reducer keys instead: " + ('"' + reducerKeys.join('", "') + '". Unexpected keys will be ignored.');
  }
}
function assertReducerShape(reducers) {
  Object.keys(reducers).forEach(function(key) {
    var reducer = reducers[key];
    var initialState = reducer(void 0, {
      type: ActionTypes.INIT
    });
    if (typeof initialState === "undefined") {
      throw new Error(false ? formatProdErrorMessage(12) : 'The slice reducer for key "' + key + `" returned undefined during initialization. If the state passed to the reducer is undefined, you must explicitly return the initial state. The initial state may not be undefined. If you don't want to set a value for this reducer, you can use null instead of undefined.`);
    }
    if (typeof reducer(void 0, {
      type: ActionTypes.PROBE_UNKNOWN_ACTION()
    }) === "undefined") {
      throw new Error(false ? formatProdErrorMessage(13) : 'The slice reducer for key "' + key + '" returned undefined when probed with a random type. ' + ("Don't try to handle '" + ActionTypes.INIT + `' or other actions in "redux/*" `) + "namespace. They are considered private. Instead, you must return the current state for any unknown actions, unless it is undefined, in which case you must return the initial state, regardless of the action type. The initial state may not be undefined, but can be null.");
    }
  });
}
function combineReducers(reducers) {
  var reducerKeys = Object.keys(reducers);
  var finalReducers = {};
  for (var i2 = 0; i2 < reducerKeys.length; i2++) {
    var key = reducerKeys[i2];
    if (true) {
      if (typeof reducers[key] === "undefined") {
        warning('No reducer provided for key "' + key + '"');
      }
    }
    if (typeof reducers[key] === "function") {
      finalReducers[key] = reducers[key];
    }
  }
  var finalReducerKeys = Object.keys(finalReducers);
  var unexpectedKeyCache;
  if (true) {
    unexpectedKeyCache = {};
  }
  var shapeAssertionError;
  try {
    assertReducerShape(finalReducers);
  } catch (e) {
    shapeAssertionError = e;
  }
  return function combination(state, action) {
    if (state === void 0) {
      state = {};
    }
    if (shapeAssertionError) {
      throw shapeAssertionError;
    }
    if (true) {
      var warningMessage = getUnexpectedStateShapeWarningMessage(state, finalReducers, action, unexpectedKeyCache);
      if (warningMessage) {
        warning(warningMessage);
      }
    }
    var hasChanged = false;
    var nextState3 = {};
    for (var _i = 0; _i < finalReducerKeys.length; _i++) {
      var _key = finalReducerKeys[_i];
      var reducer = finalReducers[_key];
      var previousStateForKey = state[_key];
      var nextStateForKey = reducer(previousStateForKey, action);
      if (typeof nextStateForKey === "undefined") {
        var actionType = action && action.type;
        throw new Error(false ? formatProdErrorMessage(14) : "When called with an action of type " + (actionType ? '"' + String(actionType) + '"' : "(unknown type)") + ', the slice reducer for key "' + _key + '" returned undefined. To ignore an action, you must explicitly return the previous state. If you want this reducer to hold no value, you can return null instead of undefined.');
      }
      nextState3[_key] = nextStateForKey;
      hasChanged = hasChanged || nextStateForKey !== previousStateForKey;
    }
    hasChanged = hasChanged || finalReducerKeys.length !== Object.keys(state).length;
    return hasChanged ? nextState3 : state;
  };
}
function bindActionCreator(actionCreator, dispatch) {
  return function() {
    return dispatch(actionCreator.apply(this, arguments));
  };
}
function bindActionCreators(actionCreators, dispatch) {
  if (typeof actionCreators === "function") {
    return bindActionCreator(actionCreators, dispatch);
  }
  if (typeof actionCreators !== "object" || actionCreators === null) {
    throw new Error(false ? formatProdErrorMessage(16) : "bindActionCreators expected an object or a function, but instead received: '" + kindOf(actionCreators) + `'. Did you write "import ActionCreators from" instead of "import * as ActionCreators from"?`);
  }
  var boundActionCreators = {};
  for (var key in actionCreators) {
    var actionCreator = actionCreators[key];
    if (typeof actionCreator === "function") {
      boundActionCreators[key] = bindActionCreator(actionCreator, dispatch);
    }
  }
  return boundActionCreators;
}
function compose() {
  for (var _len = arguments.length, funcs = new Array(_len), _key = 0; _key < _len; _key++) {
    funcs[_key] = arguments[_key];
  }
  if (funcs.length === 0) {
    return function(arg) {
      return arg;
    };
  }
  if (funcs.length === 1) {
    return funcs[0];
  }
  return funcs.reduce(function(a2, b2) {
    return function() {
      return a2(b2.apply(void 0, arguments));
    };
  });
}
function applyMiddleware() {
  for (var _len = arguments.length, middlewares = new Array(_len), _key = 0; _key < _len; _key++) {
    middlewares[_key] = arguments[_key];
  }
  return function(createStore3) {
    return function() {
      var store = createStore3.apply(void 0, arguments);
      var _dispatch = function dispatch() {
        throw new Error(false ? formatProdErrorMessage(15) : "Dispatching while constructing your middleware is not allowed. Other middleware would not be applied to this dispatch.");
      };
      var middlewareAPI = {
        getState: store.getState,
        dispatch: function dispatch() {
          return _dispatch.apply(void 0, arguments);
        }
      };
      var chain = middlewares.map(function(middleware) {
        return middleware(middlewareAPI);
      });
      _dispatch = compose.apply(void 0, chain)(store.dispatch);
      return _objectSpread2(_objectSpread2({}, store), {}, {
        dispatch: _dispatch
      });
    };
  };
}
function isCrushed() {
}
if (typeof isCrushed.name === "string" && isCrushed.name !== "isCrushed") {
  warning('You are currently using minified code outside of NODE_ENV === "production". This means that you are running a slower development build of Redux. You can use loose-envify (https://github.com/zertosh/loose-envify) for browserify or setting mode to production in webpack (https://webpack.js.org/concepts/mode/) to ensure you have the correct code for your production build.');
}
var isListener_default = function(reducer) {
  return reducer.indexOf("/") > -1;
};
var __assign = function() {
  __assign = Object.assign || function(t2) {
    for (var s2, i2 = 1, n2 = arguments.length; i2 < n2; i2++) {
      s2 = arguments[i2];
      for (var p2 in s2)
        if (Object.prototype.hasOwnProperty.call(s2, p2))
          t2[p2] = s2[p2];
    }
    return t2;
  };
  return __assign.apply(this, arguments);
};
var __rest = function(s2, e) {
  var t2 = {};
  for (var p2 in s2)
    if (Object.prototype.hasOwnProperty.call(s2, p2) && e.indexOf(p2) < 0)
      t2[p2] = s2[p2];
  if (s2 != null && typeof Object.getOwnPropertySymbols === "function")
    for (var i2 = 0, p2 = Object.getOwnPropertySymbols(s2); i2 < p2.length; i2++) {
      if (e.indexOf(p2[i2]) < 0 && Object.prototype.propertyIsEnumerable.call(s2, p2[i2]))
        t2[p2[i2]] = s2[p2[i2]];
    }
  return t2;
};
var __spreadArrays = function() {
  for (var s2 = 0, i2 = 0, il = arguments.length; i2 < il; i2++)
    s2 += arguments[i2].length;
  for (var r2 = Array(s2), k2 = 0, i2 = 0; i2 < il; i2++)
    for (var a2 = arguments[i2], j2 = 0, jl = a2.length; j2 < jl; j2++, k2++)
      r2[k2] = a2[j2];
  return r2;
};
var composeEnhancersWithDevtools = function(devtoolOptions) {
  if (devtoolOptions === void 0) {
    devtoolOptions = {};
  }
  var disabled = devtoolOptions.disabled, options = __rest(devtoolOptions, [
    "disabled"
  ]);
  return !disabled && typeof window === "object" && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__(options) : compose;
};
function redux_default(_a) {
  var _this = this;
  var redux = _a.redux, models = _a.models;
  var combineReducers2 = redux.combineReducers || combineReducers;
  var createStore3 = redux.createStore || createStore2;
  var initialStates = typeof redux.initialStates !== "undefined" ? redux.initialStates : {};
  this.reducers = redux.reducers;
  this.mergeReducers = function(nextReducers) {
    if (nextReducers === void 0) {
      nextReducers = {};
    }
    _this.reducers = __assign(__assign({}, _this.reducers), nextReducers);
    if (!Object.keys(_this.reducers).length) {
      return function(state) {
        return state;
      };
    }
    return combineReducers2(_this.reducers);
  };
  this.createModelReducer = function(model2) {
    var modelBaseReducer = model2.baseReducer;
    var modelReducers = {};
    for (var _i2 = 0, _a2 = Object.keys(model2.reducers || {}); _i2 < _a2.length; _i2++) {
      var modelReducer = _a2[_i2];
      var action = isListener_default(modelReducer) ? modelReducer : model2.name + "/" + modelReducer;
      modelReducers[action] = model2.reducers[modelReducer];
    }
    var combinedReducer = function(state, action2) {
      if (state === void 0) {
        state = model2.state;
      }
      if (typeof modelReducers[action2.type] === "function") {
        return modelReducers[action2.type](state, action2.payload, action2.meta);
      }
      return state;
    };
    _this.reducers[model2.name] = !modelBaseReducer ? combinedReducer : function(state, action2) {
      return combinedReducer(modelBaseReducer(state, action2), action2);
    };
  };
  for (var _i = 0, models_1 = models; _i < models_1.length; _i++) {
    var model = models_1[_i];
    this.createModelReducer(model);
  }
  this.createRootReducer = function(rootReducers) {
    if (rootReducers === void 0) {
      rootReducers = {};
    }
    var mergedReducers = _this.mergeReducers();
    if (Object.keys(rootReducers).length) {
      return function(state, action) {
        var rootReducerAction = rootReducers[action.type];
        if (rootReducerAction) {
          return mergedReducers(rootReducerAction(state, action), action);
        }
        return mergedReducers(state, action);
      };
    }
    return mergedReducers;
  };
  var rootReducer = this.createRootReducer(redux.rootReducers);
  var middlewares = applyMiddleware.apply(redux_exports, redux.middlewares);
  var enhancers = composeEnhancersWithDevtools(redux.devtoolOptions).apply(void 0, __spreadArrays(redux.enhancers, [
    middlewares
  ]));
  this.store = createStore3(rootReducer, initialStates, enhancers);
  return this;
}
var __assign2 = function() {
  __assign2 = Object.assign || function(t2) {
    for (var s2, i2 = 1, n2 = arguments.length; i2 < n2; i2++) {
      s2 = arguments[i2];
      for (var p2 in s2)
        if (Object.prototype.hasOwnProperty.call(s2, p2))
          t2[p2] = s2[p2];
    }
    return t2;
  };
  return __assign2.apply(this, arguments);
};
var corePlugins = [
  dispatch_default,
  effects_default
];
var Icestore = function() {
  function Icestore2(config) {
    var _this = this;
    this.plugins = [];
    this.getModels = function(models) {
      return Object.keys(models).map(function(name) {
        return __assign2(__assign2({
          name
        }, models[name]), {
          reducers: models[name].reducers || {}
        });
      });
    };
    this.config = config;
    this.pluginFactory = pluginFactory_default(config);
    for (var _i = 0, _a = corePlugins.concat(this.config.plugins); _i < _a.length; _i++) {
      var plugin = _a[_i];
      this.plugins.push(this.pluginFactory.create(plugin));
    }
    this.forEachPlugin("middleware", function(middleware) {
      _this.config.redux.middlewares.push(middleware);
    });
  }
  Icestore2.prototype.forEachPlugin = function(method, fn2) {
    for (var _i = 0, _a = this.plugins; _i < _a.length; _i++) {
      var plugin = _a[_i];
      if (plugin[method]) {
        fn2(plugin[method]);
      }
    }
  };
  Icestore2.prototype.addModel = function(model) {
    validate_default([
      [
        !model,
        "model config is required"
      ],
      [
        typeof model.name !== "string",
        'model "name" [string] is required'
      ],
      [
        model.state === void 0 && model.baseReducer === void 0,
        "model(" + model.name + ') "state" is required'
      ],
      [
        model.baseReducer !== void 0 && typeof model.baseReducer !== "function",
        "model(" + model.name + ') "baseReducer" must be a function'
      ]
    ]);
    this.forEachPlugin("onModel", function(onModel) {
      return onModel(model);
    });
  };
  Icestore2.prototype.init = function() {
    var _this = this;
    this.models = this.getModels(this.config.models);
    for (var _i = 0, _a = this.models; _i < _a.length; _i++) {
      var model = _a[_i];
      this.addModel(model);
    }
    var redux = redux_default.call(this, {
      redux: this.config.redux,
      models: this.models
    });
    var icestore = __assign2(__assign2({
      name: this.config.name
    }, redux.store), {
      model: function(model2) {
        _this.addModel(model2);
        redux.mergeReducers(redux.createModelReducer(model2));
        redux.store.replaceReducer(redux.createRootReducer(_this.config.redux.rootReducers));
        redux.store.dispatch({
          type: "@@redux/REPLACE "
        });
      }
    });
    this.forEachPlugin("onStoreCreated", function(onStoreCreated) {
      var returned = onStoreCreated(icestore);
      if (returned) {
        Object.keys(returned || {}).forEach(function(key) {
          icestore[key] = returned[key];
        });
      }
    });
    return icestore;
  };
  return Icestore2;
}();
var import_prop_types = __toESM(require_prop_types());
var ReactReduxContext = /* @__PURE__ */ React.createContext(null);
if (true) {
  ReactReduxContext.displayName = "ReactRedux";
}
function defaultNoopBatch(callback) {
  callback();
}
var batch = defaultNoopBatch;
var setBatch = function setBatch2(newBatch) {
  return batch = newBatch;
};
var getBatch = function getBatch2() {
  return batch;
};
function createListenerCollection() {
  var batch2 = getBatch();
  var first = null;
  var last = null;
  return {
    clear: function clear() {
      first = null;
      last = null;
    },
    notify: function notify2() {
      batch2(function() {
        var listener = first;
        while (listener) {
          listener.callback();
          listener = listener.next;
        }
      });
    },
    get: function get2() {
      var listeners = [];
      var listener = first;
      while (listener) {
        listeners.push(listener);
        listener = listener.next;
      }
      return listeners;
    },
    subscribe: function subscribe(callback) {
      var isSubscribed = true;
      var listener = last = {
        callback,
        next: null,
        prev: last
      };
      if (listener.prev) {
        listener.prev.next = listener;
      } else {
        first = listener;
      }
      return function unsubscribe() {
        if (!isSubscribed || first === null)
          return;
        isSubscribed = false;
        if (listener.next) {
          listener.next.prev = listener.prev;
        } else {
          last = listener.prev;
        }
        if (listener.prev) {
          listener.prev.next = listener.next;
        } else {
          first = listener.next;
        }
      };
    }
  };
}
var nullListeners = {
  notify: function notify() {
  },
  get: function get() {
    return [];
  }
};
function createSubscription(store, parentSub) {
  var unsubscribe;
  var listeners = nullListeners;
  function addNestedSub(listener) {
    trySubscribe();
    return listeners.subscribe(listener);
  }
  function notifyNestedSubs() {
    listeners.notify();
  }
  function handleChangeWrapper() {
    if (subscription.onStateChange) {
      subscription.onStateChange();
    }
  }
  function isSubscribed() {
    return Boolean(unsubscribe);
  }
  function trySubscribe() {
    if (!unsubscribe) {
      unsubscribe = parentSub ? parentSub.addNestedSub(handleChangeWrapper) : store.subscribe(handleChangeWrapper);
      listeners = createListenerCollection();
    }
  }
  function tryUnsubscribe() {
    if (unsubscribe) {
      unsubscribe();
      unsubscribe = void 0;
      listeners.clear();
      listeners = nullListeners;
    }
  }
  var subscription = {
    addNestedSub,
    notifyNestedSubs,
    handleChangeWrapper,
    isSubscribed,
    trySubscribe,
    tryUnsubscribe,
    getListeners: function getListeners() {
      return listeners;
    }
  };
  return subscription;
}
var useIsomorphicLayoutEffect = typeof window !== "undefined" && typeof window.document !== "undefined" && typeof window.document.createElement !== "undefined" ? useLayoutEffect : useEffect;
function Provider(_ref) {
  var store = _ref.store, context = _ref.context, children = _ref.children;
  var contextValue = useMemo(function() {
    var subscription = createSubscription(store);
    return {
      store,
      subscription
    };
  }, [
    store
  ]);
  var previousState = useMemo(function() {
    return store.getState();
  }, [
    store
  ]);
  useIsomorphicLayoutEffect(function() {
    var subscription = contextValue.subscription;
    subscription.onStateChange = subscription.notifyNestedSubs;
    subscription.trySubscribe();
    if (previousState !== store.getState()) {
      subscription.notifyNestedSubs();
    }
    return function() {
      subscription.tryUnsubscribe();
      subscription.onStateChange = null;
    };
  }, [
    contextValue,
    previousState
  ]);
  var Context2 = context || ReactReduxContext;
  return /* @__PURE__ */ React2.createElement(Context2.Provider, {
    value: contextValue
  }, children);
}
if (true) {
  Provider.propTypes = {
    store: import_prop_types.default.shape({
      subscribe: import_prop_types.default.func.isRequired,
      dispatch: import_prop_types.default.func.isRequired,
      getState: import_prop_types.default.func.isRequired
    }),
    context: import_prop_types.default.object,
    children: import_prop_types.default.any
  };
}
var import_hoist_non_react_statics = __toESM(require_hoist_non_react_statics_cjs());
var import_react_is = __toESM(require_react_is2());
setBatch(unstable_batchedUpdates);
var randomString3 = function() {
  return Math.random().toString(36).substring(7).split("").join(".");
};
var ActionTypes2 = {
  SET_STATE: "@@icestore_SET_STATE" + randomString3()
};
var actionTypes_default = ActionTypes2;
var SET_STATE = actionTypes_default.SET_STATE;
function n(n2) {
  for (var r2 = arguments.length, t2 = Array(r2 > 1 ? r2 - 1 : 0), e = 1; e < r2; e++)
    t2[e - 1] = arguments[e];
  if (true) {
    var i2 = Y[n2], o2 = i2 ? "function" == typeof i2 ? i2.apply(null, t2) : i2 : "unknown error nr: " + n2;
    throw Error("[Immer] " + o2);
  }
  throw Error("[Immer] minified error nr: " + n2 + (t2.length ? " " + t2.map(function(n3) {
    return "'" + n3 + "'";
  }).join(",") : "") + ". Find the full error at: https://bit.ly/3cXEKWf");
}
function r(n2) {
  return !!n2 && !!n2[Q];
}
function t(n2) {
  var r2;
  return !!n2 && (function(n3) {
    if (!n3 || "object" != typeof n3)
      return false;
    var r3 = Object.getPrototypeOf(n3);
    if (null === r3)
      return true;
    var t2 = Object.hasOwnProperty.call(r3, "constructor") && r3.constructor;
    return t2 === Object || "function" == typeof t2 && Function.toString.call(t2) === Z;
  }(n2) || Array.isArray(n2) || !!n2[L] || !!(null === (r2 = n2.constructor) || void 0 === r2 ? void 0 : r2[L]) || s(n2) || v(n2));
}
function i(n2, r2, t2) {
  void 0 === t2 && (t2 = false), 0 === o(n2) ? (t2 ? Object.keys : nn)(n2).forEach(function(e) {
    t2 && "symbol" == typeof e || r2(e, n2[e], n2);
  }) : n2.forEach(function(t3, e) {
    return r2(e, t3, n2);
  });
}
function o(n2) {
  var r2 = n2[Q];
  return r2 ? r2.i > 3 ? r2.i - 4 : r2.i : Array.isArray(n2) ? 1 : s(n2) ? 2 : v(n2) ? 3 : 0;
}
function u(n2, r2) {
  return 2 === o(n2) ? n2.has(r2) : Object.prototype.hasOwnProperty.call(n2, r2);
}
function a(n2, r2) {
  return 2 === o(n2) ? n2.get(r2) : n2[r2];
}
function f(n2, r2, t2) {
  var e = o(n2);
  2 === e ? n2.set(r2, t2) : 3 === e ? (n2.delete(r2), n2.add(t2)) : n2[r2] = t2;
}
function c(n2, r2) {
  return n2 === r2 ? 0 !== n2 || 1 / n2 == 1 / r2 : n2 != n2 && r2 != r2;
}
function s(n2) {
  return X && n2 instanceof Map;
}
function v(n2) {
  return q && n2 instanceof Set;
}
function p(n2) {
  return n2.o || n2.t;
}
function l(n2) {
  if (Array.isArray(n2))
    return Array.prototype.slice.call(n2);
  var r2 = rn(n2);
  delete r2[Q];
  for (var t2 = nn(r2), e = 0; e < t2.length; e++) {
    var i2 = t2[e], o2 = r2[i2];
    false === o2.writable && (o2.writable = true, o2.configurable = true), (o2.get || o2.set) && (r2[i2] = {
      configurable: true,
      writable: true,
      enumerable: o2.enumerable,
      value: n2[i2]
    });
  }
  return Object.create(Object.getPrototypeOf(n2), r2);
}
function d(n2, e) {
  return void 0 === e && (e = false), y(n2) || r(n2) || !t(n2) ? n2 : (o(n2) > 1 && (n2.set = n2.add = n2.clear = n2.delete = h), Object.freeze(n2), e && i(n2, function(n3, r2) {
    return d(r2, true);
  }, true), n2);
}
function h() {
  n(2);
}
function y(n2) {
  return null == n2 || "object" != typeof n2 || Object.isFrozen(n2);
}
function b(r2) {
  var t2 = tn[r2];
  return t2 || n(18, r2), t2;
}
function m(n2, r2) {
  tn[n2] || (tn[n2] = r2);
}
function _() {
  return U || n(0), U;
}
function j(n2, r2) {
  r2 && (b("Patches"), n2.u = [], n2.s = [], n2.v = r2);
}
function O(n2) {
  g(n2), n2.p.forEach(S), n2.p = null;
}
function g(n2) {
  n2 === U && (U = n2.l);
}
function w(n2) {
  return U = {
    p: [],
    l: U,
    h: n2,
    m: true,
    _: 0
  };
}
function S(n2) {
  var r2 = n2[Q];
  0 === r2.i || 1 === r2.i ? r2.j() : r2.O = true;
}
function P(r2, e) {
  e._ = e.p.length;
  var i2 = e.p[0], o2 = void 0 !== r2 && r2 !== i2;
  return e.h.g || b("ES5").S(e, r2, o2), o2 ? (i2[Q].P && (O(e), n(4)), t(r2) && (r2 = M(e, r2), e.l || x(e, r2)), e.u && b("Patches").M(i2[Q].t, r2, e.u, e.s)) : r2 = M(e, i2, []), O(e), e.u && e.v(e.u, e.s), r2 !== H ? r2 : void 0;
}
function M(n2, r2, t2) {
  if (y(r2))
    return r2;
  var e = r2[Q];
  if (!e)
    return i(r2, function(i2, o3) {
      return A(n2, e, r2, i2, o3, t2);
    }, true), r2;
  if (e.A !== n2)
    return r2;
  if (!e.P)
    return x(n2, e.t, true), e.t;
  if (!e.I) {
    e.I = true, e.A._--;
    var o2 = 4 === e.i || 5 === e.i ? e.o = l(e.k) : e.o;
    i(3 === e.i ? new Set(o2) : o2, function(r3, i2) {
      return A(n2, e, o2, r3, i2, t2);
    }), x(n2, o2, false), t2 && n2.u && b("Patches").R(e, t2, n2.u, n2.s);
  }
  return e.o;
}
function A(e, i2, o2, a2, c2, s2) {
  if (c2 === o2 && n(5), r(c2)) {
    var v2 = M(e, c2, s2 && i2 && 3 !== i2.i && !u(i2.D, a2) ? s2.concat(a2) : void 0);
    if (f(o2, a2, v2), !r(v2))
      return;
    e.m = false;
  }
  if (t(c2) && !y(c2)) {
    if (!e.h.F && e._ < 1)
      return;
    M(e, c2), i2 && i2.A.l || x(e, c2);
  }
}
function x(n2, r2, t2) {
  void 0 === t2 && (t2 = false), n2.h.F && n2.m && d(r2, t2);
}
function z(n2, r2) {
  var t2 = n2[Q];
  return (t2 ? p(t2) : n2)[r2];
}
function I(n2, r2) {
  if (r2 in n2)
    for (var t2 = Object.getPrototypeOf(n2); t2; ) {
      var e = Object.getOwnPropertyDescriptor(t2, r2);
      if (e)
        return e;
      t2 = Object.getPrototypeOf(t2);
    }
}
function k(n2) {
  n2.P || (n2.P = true, n2.l && k(n2.l));
}
function E(n2) {
  n2.o || (n2.o = l(n2.t));
}
function R(n2, r2, t2) {
  var e = s(r2) ? b("MapSet").N(r2, t2) : v(r2) ? b("MapSet").T(r2, t2) : n2.g ? function(n3, r3) {
    var t3 = Array.isArray(n3), e2 = {
      i: t3 ? 1 : 0,
      A: r3 ? r3.A : _(),
      P: false,
      I: false,
      D: {},
      l: r3,
      t: n3,
      k: null,
      o: null,
      j: null,
      C: false
    }, i2 = e2, o2 = en;
    t3 && (i2 = [
      e2
    ], o2 = on);
    var u2 = Proxy.revocable(i2, o2), a2 = u2.revoke, f2 = u2.proxy;
    return e2.k = f2, e2.j = a2, f2;
  }(r2, t2) : b("ES5").J(r2, t2);
  return (t2 ? t2.A : _()).p.push(e), e;
}
function D(e) {
  return r(e) || n(22, e), function n2(r2) {
    if (!t(r2))
      return r2;
    var e2, u2 = r2[Q], c2 = o(r2);
    if (u2) {
      if (!u2.P && (u2.i < 4 || !b("ES5").K(u2)))
        return u2.t;
      u2.I = true, e2 = F(r2, c2), u2.I = false;
    } else
      e2 = F(r2, c2);
    return i(e2, function(r3, t2) {
      u2 && a(u2.t, r3) === t2 || f(e2, r3, n2(t2));
    }), 3 === c2 ? new Set(e2) : e2;
  }(e);
}
function F(n2, r2) {
  switch (r2) {
    case 2:
      return new Map(n2);
    case 3:
      return Array.from(n2);
  }
  return l(n2);
}
function N() {
  function t2(n2, r2) {
    var t3 = s2[n2];
    return t3 ? t3.enumerable = r2 : s2[n2] = t3 = {
      configurable: true,
      enumerable: r2,
      get: function() {
        var r3 = this[Q];
        return f2(r3), en.get(r3, n2);
      },
      set: function(r3) {
        var t4 = this[Q];
        f2(t4), en.set(t4, n2, r3);
      }
    }, t3;
  }
  function e(n2) {
    for (var r2 = n2.length - 1; r2 >= 0; r2--) {
      var t3 = n2[r2][Q];
      if (!t3.P)
        switch (t3.i) {
          case 5:
            a2(t3) && k(t3);
            break;
          case 4:
            o2(t3) && k(t3);
        }
    }
  }
  function o2(n2) {
    for (var r2 = n2.t, t3 = n2.k, e2 = nn(t3), i2 = e2.length - 1; i2 >= 0; i2--) {
      var o3 = e2[i2];
      if (o3 !== Q) {
        var a3 = r2[o3];
        if (void 0 === a3 && !u(r2, o3))
          return true;
        var f3 = t3[o3], s3 = f3 && f3[Q];
        if (s3 ? s3.t !== a3 : !c(f3, a3))
          return true;
      }
    }
    var v2 = !!r2[Q];
    return e2.length !== nn(r2).length + (v2 ? 0 : 1);
  }
  function a2(n2) {
    var r2 = n2.k;
    if (r2.length !== n2.t.length)
      return true;
    var t3 = Object.getOwnPropertyDescriptor(r2, r2.length - 1);
    if (t3 && !t3.get)
      return true;
    for (var e2 = 0; e2 < r2.length; e2++)
      if (!r2.hasOwnProperty(e2))
        return true;
    return false;
  }
  function f2(r2) {
    r2.O && n(3, JSON.stringify(p(r2)));
  }
  var s2 = {};
  m("ES5", {
    J: function(n2, r2) {
      var e2 = Array.isArray(n2), i2 = function(n3, r3) {
        if (n3) {
          for (var e3 = Array(r3.length), i3 = 0; i3 < r3.length; i3++)
            Object.defineProperty(e3, "" + i3, t2(i3, true));
          return e3;
        }
        var o4 = rn(r3);
        delete o4[Q];
        for (var u2 = nn(o4), a3 = 0; a3 < u2.length; a3++) {
          var f3 = u2[a3];
          o4[f3] = t2(f3, n3 || !!o4[f3].enumerable);
        }
        return Object.create(Object.getPrototypeOf(r3), o4);
      }(e2, n2), o3 = {
        i: e2 ? 5 : 4,
        A: r2 ? r2.A : _(),
        P: false,
        I: false,
        D: {},
        l: r2,
        t: n2,
        k: i2,
        o: null,
        O: false,
        C: false
      };
      return Object.defineProperty(i2, Q, {
        value: o3,
        writable: true
      }), i2;
    },
    S: function(n2, t3, o3) {
      o3 ? r(t3) && t3[Q].A === n2 && e(n2.p) : (n2.u && function n3(r2) {
        if (r2 && "object" == typeof r2) {
          var t4 = r2[Q];
          if (t4) {
            var e2 = t4.t, o4 = t4.k, f3 = t4.D, c2 = t4.i;
            if (4 === c2)
              i(o4, function(r3) {
                r3 !== Q && (void 0 !== e2[r3] || u(e2, r3) ? f3[r3] || n3(o4[r3]) : (f3[r3] = true, k(t4)));
              }), i(e2, function(n4) {
                void 0 !== o4[n4] || u(o4, n4) || (f3[n4] = false, k(t4));
              });
            else if (5 === c2) {
              if (a2(t4) && (k(t4), f3.length = true), o4.length < e2.length)
                for (var s3 = o4.length; s3 < e2.length; s3++)
                  f3[s3] = false;
              else
                for (var v2 = e2.length; v2 < o4.length; v2++)
                  f3[v2] = true;
              for (var p2 = Math.min(o4.length, e2.length), l2 = 0; l2 < p2; l2++)
                o4.hasOwnProperty(l2) || (f3[l2] = true), void 0 === f3[l2] && n3(o4[l2]);
            }
          }
        }
      }(n2.p[0]), e(n2.p));
    },
    K: function(n2) {
      return 4 === n2.i ? o2(n2) : a2(n2);
    }
  });
}
var G;
var U;
var W = "undefined" != typeof Symbol && "symbol" == typeof Symbol("x");
var X = "undefined" != typeof Map;
var q = "undefined" != typeof Set;
var B = "undefined" != typeof Proxy && void 0 !== Proxy.revocable && "undefined" != typeof Reflect;
var H = W ? Symbol.for("immer-nothing") : ((G = {})["immer-nothing"] = true, G);
var L = W ? Symbol.for("immer-draftable") : "__$immer_draftable";
var Q = W ? Symbol.for("immer-state") : "__$immer_state";
var Y = {
  0: "Illegal state",
  1: "Immer drafts cannot have computed properties",
  2: "This object has been frozen and should not be mutated",
  3: function(n2) {
    return "Cannot use a proxy that has been revoked. Did you pass an object from inside an immer function to an async process? " + n2;
  },
  4: "An immer producer returned a new value *and* modified its draft. Either return a new value *or* modify the draft.",
  5: "Immer forbids circular references",
  6: "The first or second argument to `produce` must be a function",
  7: "The third argument to `produce` must be a function or undefined",
  8: "First argument to `createDraft` must be a plain object, an array, or an immerable object",
  9: "First argument to `finishDraft` must be a draft returned by `createDraft`",
  10: "The given draft is already finalized",
  11: "Object.defineProperty() cannot be used on an Immer draft",
  12: "Object.setPrototypeOf() cannot be used on an Immer draft",
  13: "Immer only supports deleting array indices",
  14: "Immer only supports setting array indices and the 'length' property",
  15: function(n2) {
    return "Cannot apply patch, path doesn't resolve: " + n2;
  },
  16: 'Sets cannot have "replace" patches.',
  17: function(n2) {
    return "Unsupported patch operation: " + n2;
  },
  18: function(n2) {
    return "The plugin for '" + n2 + "' has not been loaded into Immer. To enable the plugin, import and call `enable" + n2 + "()` when initializing your application.";
  },
  20: "Cannot use proxies if Proxy, Proxy.revocable or Reflect are not available",
  21: function(n2) {
    return "produce can only be called on things that are draftable: plain objects, arrays, Map, Set or classes that are marked with '[immerable]: true'. Got '" + n2 + "'";
  },
  22: function(n2) {
    return "'current' expects a draft, got: " + n2;
  },
  23: function(n2) {
    return "'original' expects a draft, got: " + n2;
  },
  24: "Patching reserved attributes like __proto__, prototype and constructor is not allowed"
};
var Z = "" + Object.prototype.constructor;
var nn = "undefined" != typeof Reflect && Reflect.ownKeys ? Reflect.ownKeys : void 0 !== Object.getOwnPropertySymbols ? function(n2) {
  return Object.getOwnPropertyNames(n2).concat(Object.getOwnPropertySymbols(n2));
} : Object.getOwnPropertyNames;
var rn = Object.getOwnPropertyDescriptors || function(n2) {
  var r2 = {};
  return nn(n2).forEach(function(t2) {
    r2[t2] = Object.getOwnPropertyDescriptor(n2, t2);
  }), r2;
};
var tn = {};
var en = {
  get: function(n2, r2) {
    if (r2 === Q)
      return n2;
    var e = p(n2);
    if (!u(e, r2))
      return function(n3, r3, t2) {
        var e2, i3 = I(r3, t2);
        return i3 ? "value" in i3 ? i3.value : null === (e2 = i3.get) || void 0 === e2 ? void 0 : e2.call(n3.k) : void 0;
      }(n2, e, r2);
    var i2 = e[r2];
    return n2.I || !t(i2) ? i2 : i2 === z(n2.t, r2) ? (E(n2), n2.o[r2] = R(n2.A.h, i2, n2)) : i2;
  },
  has: function(n2, r2) {
    return r2 in p(n2);
  },
  ownKeys: function(n2) {
    return Reflect.ownKeys(p(n2));
  },
  set: function(n2, r2, t2) {
    var e = I(p(n2), r2);
    if (null == e ? void 0 : e.set)
      return e.set.call(n2.k, t2), true;
    if (!n2.P) {
      var i2 = z(p(n2), r2), o2 = null == i2 ? void 0 : i2[Q];
      if (o2 && o2.t === t2)
        return n2.o[r2] = t2, n2.D[r2] = false, true;
      if (c(t2, i2) && (void 0 !== t2 || u(n2.t, r2)))
        return true;
      E(n2), k(n2);
    }
    return n2.o[r2] === t2 && "number" != typeof t2 && (void 0 !== t2 || r2 in n2.o) || (n2.o[r2] = t2, n2.D[r2] = true, true);
  },
  deleteProperty: function(n2, r2) {
    return void 0 !== z(n2.t, r2) || r2 in n2.t ? (n2.D[r2] = false, E(n2), k(n2)) : delete n2.D[r2], n2.o && delete n2.o[r2], true;
  },
  getOwnPropertyDescriptor: function(n2, r2) {
    var t2 = p(n2), e = Reflect.getOwnPropertyDescriptor(t2, r2);
    return e ? {
      writable: true,
      configurable: 1 !== n2.i || "length" !== r2,
      enumerable: e.enumerable,
      value: t2[r2]
    } : e;
  },
  defineProperty: function() {
    n(11);
  },
  getPrototypeOf: function(n2) {
    return Object.getPrototypeOf(n2.t);
  },
  setPrototypeOf: function() {
    n(12);
  }
};
var on = {};
i(en, function(n2, r2) {
  on[n2] = function() {
    return arguments[0] = arguments[0][0], r2.apply(this, arguments);
  };
}), on.deleteProperty = function(r2, t2) {
  return isNaN(parseInt(t2)) && n(13), on.set.call(this, r2, t2, void 0);
}, on.set = function(r2, t2, e) {
  return "length" !== t2 && isNaN(parseInt(t2)) && n(14), en.set.call(this, r2[0], t2, e, r2[0]);
};
var un = function() {
  function e(r2) {
    var e2 = this;
    this.g = B, this.F = true, this.produce = function(r3, i3, o2) {
      if ("function" == typeof r3 && "function" != typeof i3) {
        var u2 = i3;
        i3 = r3;
        var a2 = e2;
        return function(n2) {
          var r4 = this;
          void 0 === n2 && (n2 = u2);
          for (var t2 = arguments.length, e3 = Array(t2 > 1 ? t2 - 1 : 0), o3 = 1; o3 < t2; o3++)
            e3[o3 - 1] = arguments[o3];
          return a2.produce(n2, function(n3) {
            var t3;
            return (t3 = i3).call.apply(t3, [
              r4,
              n3
            ].concat(e3));
          });
        };
      }
      var f2;
      if ("function" != typeof i3 && n(6), void 0 !== o2 && "function" != typeof o2 && n(7), t(r3)) {
        var c2 = w(e2), s2 = R(e2, r3, void 0), v2 = true;
        try {
          f2 = i3(s2), v2 = false;
        } finally {
          v2 ? O(c2) : g(c2);
        }
        return "undefined" != typeof Promise && f2 instanceof Promise ? f2.then(function(n2) {
          return j(c2, o2), P(n2, c2);
        }, function(n2) {
          throw O(c2), n2;
        }) : (j(c2, o2), P(f2, c2));
      }
      if (!r3 || "object" != typeof r3) {
        if (void 0 === (f2 = i3(r3)) && (f2 = r3), f2 === H && (f2 = void 0), e2.F && d(f2, true), o2) {
          var p2 = [], l2 = [];
          b("Patches").M(r3, f2, p2, l2), o2(p2, l2);
        }
        return f2;
      }
      n(21, r3);
    }, this.produceWithPatches = function(n2, r3) {
      if ("function" == typeof n2)
        return function(r4) {
          for (var t3 = arguments.length, i4 = Array(t3 > 1 ? t3 - 1 : 0), o3 = 1; o3 < t3; o3++)
            i4[o3 - 1] = arguments[o3];
          return e2.produceWithPatches(r4, function(r5) {
            return n2.apply(void 0, [
              r5
            ].concat(i4));
          });
        };
      var t2, i3, o2 = e2.produce(n2, r3, function(n3, r4) {
        t2 = n3, i3 = r4;
      });
      return "undefined" != typeof Promise && o2 instanceof Promise ? o2.then(function(n3) {
        return [
          n3,
          t2,
          i3
        ];
      }) : [
        o2,
        t2,
        i3
      ];
    }, "boolean" == typeof (null == r2 ? void 0 : r2.useProxies) && this.setUseProxies(r2.useProxies), "boolean" == typeof (null == r2 ? void 0 : r2.autoFreeze) && this.setAutoFreeze(r2.autoFreeze);
  }
  var i2 = e.prototype;
  return i2.createDraft = function(e2) {
    t(e2) || n(8), r(e2) && (e2 = D(e2));
    var i3 = w(this), o2 = R(this, e2, void 0);
    return o2[Q].C = true, g(i3), o2;
  }, i2.finishDraft = function(r2, t2) {
    var e2 = r2 && r2[Q];
    e2 && e2.C || n(9), e2.I && n(10);
    var i3 = e2.A;
    return j(i3, t2), P(void 0, i3);
  }, i2.setAutoFreeze = function(n2) {
    this.F = n2;
  }, i2.setUseProxies = function(r2) {
    r2 && !B && n(20), this.g = r2;
  }, i2.applyPatches = function(n2, t2) {
    var e2;
    for (e2 = t2.length - 1; e2 >= 0; e2--) {
      var i3 = t2[e2];
      if (0 === i3.path.length && "replace" === i3.op) {
        n2 = i3.value;
        break;
      }
    }
    e2 > -1 && (t2 = t2.slice(e2 + 1));
    var o2 = b("Patches").$;
    return r(n2) ? o2(n2, t2) : this.produce(n2, function(n3) {
      return o2(n3, t2);
    });
  }, e;
}();
var an = new un();
var fn = an.produce;
var cn = an.produceWithPatches.bind(an);
var sn = an.setAutoFreeze.bind(an);
var vn = an.setUseProxies.bind(an);
var pn = an.applyPatches.bind(an);
var ln = an.createDraft.bind(an);
var dn = an.finishDraft.bind(an);
N();
var __assign3 = function() {
  __assign3 = Object.assign || function(t2) {
    for (var s2, i2 = 1, n2 = arguments.length; i2 < n2; i2++) {
      s2 = arguments[i2];
      for (var p2 in s2)
        if (Object.prototype.hasOwnProperty.call(s2, p2))
          t2[p2] = s2[p2];
    }
    return t2;
  };
  return __assign3.apply(this, arguments);
};
var cntState = {
  global: 0,
  models: {},
  effects: {}
};
var nextState = __assign3(__assign3({}, cntState), {
  models: __assign3({}, cntState.models),
  effects: __assign3({}, cntState.effects)
});
var __assign4 = function() {
  __assign4 = Object.assign || function(t2) {
    for (var s2, i2 = 1, n2 = arguments.length; i2 < n2; i2++) {
      s2 = arguments[i2];
      for (var p2 in s2)
        if (Object.prototype.hasOwnProperty.call(s2, p2))
          t2[p2] = s2[p2];
    }
    return t2;
  };
  return __assign4.apply(this, arguments);
};
var defaultValue = {
  error: null,
  value: 0
};
var cntState2 = {
  global: __assign4({}, defaultValue),
  models: {},
  effects: {}
};
var nextState2 = {
  global: __assign4({}, cntState2.global),
  models: __assign4({}, cntState2.models),
  effects: __assign4({}, cntState2.effects)
};
var import_lodash = __toESM(require_lodash());
var SET_STATE2 = actionTypes_default.SET_STATE;
var Context = createContext(null);
Context.displayName = "AuthContext";
var AuthProvider = Context.Provider;
function definePageConfig(pageConfig4) {
  return pageConfig4;
}
var pageConfig = definePageConfig(() => {
  return {
    auth: [
      "admin",
      "user"
    ]
  };
});
var pageConfig2 = definePageConfig(() => {
  return {
    auth: [
      "admin"
    ]
  };
});
var pageConfig3 = definePageConfig(() => {
  return {
    auth: [
      "admin",
      "user"
    ]
  };
});
var routes_config_default = {
  "form/index": pageConfig,
  "list/index": pageConfig2,
  "index": pageConfig3
};

// src/models/user.ts
var user_default = createModel({
  state: {
    currentUser: {}
  },
  reducers: {
    updateCurrentUser(prevState, payload) {
      prevState.currentUser = payload;
    }
  }
});

// src/store.ts
var store_default = createStore({
  user: user_default
});

// .ice/entry.server.ts
var runtimeModules = {
  commons,
  statics
};
var getRouterBasename = () => {
  var _a, _b, _c;
  const appConfig = runtime2.getAppConfig(app_exports);
  return (_c = (_b = (_a = appConfig == null ? void 0 : appConfig.router) == null ? void 0 : _a.basename) != null ? _b : "/") != null ? _c : "";
};
var setRuntimeEnv = (renderMode) => {
  if (renderMode === "SSG") {
    process.env.ICE_CORE_SSG = "true";
  } else {
    process.env.ICE_CORE_SSR = "true";
  }
};
async function renderToHTML2(requestContext, options = {}) {
  const { documentOnly, renderMode = "SSR", basename, serverOnlyBasename, routePath, disableFallback } = options;
  setRuntimeEnv(renderMode);
  return await runtime2.renderToHTML(requestContext, {
    app: app_exports,
    assetsManifest: virtual_assets_manifest_default,
    routes: routes_default,
    runtimeModules,
    Document,
    serverOnlyBasename,
    basename: basename || getRouterBasename(),
    documentOnly,
    renderMode,
    routePath,
    disableFallback,
    routesConfig: routes_config_default,
    runtimeOptions: {
      appStore: store_default
    }
  });
}
async function renderToResponse2(requestContext, options = {}) {
  const { documentOnly, renderMode = "SSR", basename, serverOnlyBasename, disableFallback } = options;
  setRuntimeEnv(options);
  runtime2.renderToResponse(requestContext, {
    app: app_exports,
    assetsManifest: virtual_assets_manifest_default,
    routes: routes_default,
    runtimeModules,
    Document,
    serverOnlyBasename,
    basename: basename || getRouterBasename(),
    documentOnly,
    renderMode,
    disableFallback,
    routesConfig: routes_config_default,
    runtimeOptions: {
      appStore: store_default
    }
  });
}
export {
  renderToHTML2 as renderToHTML,
  renderToResponse2 as renderToResponse
};
/*
object-assign
(c) Sindre Sorhus
@license MIT
*/
/** @license React v16.13.1
* react-is.development.js
*
* Copyright (c) Facebook, Inc. and its affiliates.
*
* This source code is licensed under the MIT license found in the
* LICENSE file in the root directory of this source tree.
*/
/** @license React v17.0.2
* react-is.development.js
*
* Copyright (c) Facebook, Inc. and its affiliates.
*
* This source code is licensed under the MIT license found in the
* LICENSE file in the root directory of this source tree.
*/
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiLi4vLi4vLmljZS9Vc2Vycy9tYW1iYS93b3Jrc3BhY2UvbXNlL2ljZS1hcHAvLmljZS9lbnYuc2VydmVyLnRzIiwgIi4uLy4uLy5pY2UvVXNlcnMvbWFtYmEvd29ya3NwYWNlL21zZS9pY2UtYXBwLy5pY2UvZW50cnkuc2VydmVyLnRzIiwgIi4uLy4uL25vZGVfbW9kdWxlcy9AaWNlL3BsdWdpbi1yZXF1ZXN0L2VzbS9ydW50aW1lLmpzIiwgIi4uLy4uLy5pY2UvVXNlcnMvbWFtYmEvd29ya3NwYWNlL21zZS9pY2UtYXBwLy5pY2UvcnVudGltZU1vZHVsZXMudHMiLCAiLi4vLi4vc3JjL1VzZXJzL21hbWJhL3dvcmtzcGFjZS9tc2UvaWNlLWFwcC9zcmMvYXBwLnRzIiwgIi4uLy4uL3NyYy9Vc2Vycy9tYW1iYS93b3Jrc3BhY2UvbXNlL2ljZS1hcHAvc3JjL2RvY3VtZW50LnRzeCIsICIuLi8uLi8uaWNlL1VzZXJzL21hbWJhL3dvcmtzcGFjZS9tc2UvaWNlLWFwcC8uaWNlL3JvdXRlcy50cyIsICIuLi8uLi8uaWNlL1VzZXJzL21hbWJhL3dvcmtzcGFjZS9tc2UvaWNlLWFwcC8uaWNlL3JvdXRlcy1jb25maWcuYnVuZGxlLm1qcyIsICIuLi8uLi9zcmMvbW9kZWxzL1VzZXJzL21hbWJhL3dvcmtzcGFjZS9tc2UvaWNlLWFwcC9zcmMvbW9kZWxzL3VzZXIudHMiLCAiLi4vLi4vc3JjL1VzZXJzL21hbWJhL3dvcmtzcGFjZS9tc2UvaWNlLWFwcC9zcmMvc3RvcmUudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbIi8vIERlZmluZSBwcm9jZXNzLmVudiBpbiB0b3AgbWFrZSBpdCBwb3NzaWJsZSB0byB1c2UgSUNFX0NPUkVfKiBpbiBAaWNlL3J1bnRpbWUsIGVzYnVpbGQgZGVmaW5lIG9wdGlvbnMgZG9lc24ndCBoYXZlIHRoZSBhYmlsaXR5XG4vLyBUaGUgcnVudGltZSB2YWx1ZSBzdWNoIGFzIF9fcHJvY2Vzcy5lbnYuSUNFX0NPUkVfKl9fIHdpbGwgYmUgcmVwbGFjZWQgYnkgZXNidWlsZCBkZWZpbmUsIHNvIHRoZSB2YWx1ZSBpcyByZWFsLXRpbWVcblxucHJvY2Vzcy5lbnYuSUNFX0NPUkVfTU9ERSA9IF9fcHJvY2Vzcy5lbnYuSUNFX0NPUkVfTU9ERV9fO1xucHJvY2Vzcy5lbnYuSUNFX0NPUkVfUk9VVEVSID0gX19wcm9jZXNzLmVudi5JQ0VfQ09SRV9ST1VURVJfXztcbnByb2Nlc3MuZW52LklDRV9DT1JFX0VSUk9SX0JPVU5EQVJZID0gX19wcm9jZXNzLmVudi5JQ0VfQ09SRV9FUlJPUl9CT1VOREFSWV9fO1xucHJvY2Vzcy5lbnYuSUNFX0NPUkVfSU5JVElBTF9EQVRBID0gX19wcm9jZXNzLmVudi5JQ0VfQ09SRV9JTklUSUFMX0RBVEFfXztcbnByb2Nlc3MuZW52LklDRV9DT1JFX0RFVl9QT1JUID0gX19wcm9jZXNzLmVudi5JQ0VfQ09SRV9ERVZfUE9SVF9fOyIsICJpbXBvcnQgJy4vZW52LnNlcnZlcic7XG5pbXBvcnQgKiBhcyBydW50aW1lIGZyb20gJ0BpY2UvcnVudGltZS9zZXJ2ZXInO1xuaW1wb3J0IHsgY29tbW9ucywgc3RhdGljcyB9IGZyb20gJy4vcnVudGltZU1vZHVsZXMnO1xuaW1wb3J0ICogYXMgYXBwIGZyb20gJ0AvYXBwJztcbmltcG9ydCBEb2N1bWVudCBmcm9tICdAL2RvY3VtZW50JztcbmltcG9ydCB0eXBlIHsgUmVuZGVyTW9kZSB9IGZyb20gJ0BpY2UvcnVudGltZSc7XG4vLyBAdHMtaWdub3JlXG5pbXBvcnQgYXNzZXRzTWFuaWZlc3QgZnJvbSAndmlydHVhbDphc3NldHMtbWFuaWZlc3QuanNvbic7XG5pbXBvcnQgcm91dGVzIGZyb20gJy4vcm91dGVzJztcbmltcG9ydCByb3V0ZXNDb25maWcgZnJvbSAnLi9yb3V0ZXMtY29uZmlnLmJ1bmRsZS5tanMnO1xuaW1wb3J0IGFwcFN0b3JlIGZyb20gJ0Avc3RvcmUnO1xuXG5jb25zdCBydW50aW1lTW9kdWxlcyA9IHsgY29tbW9ucywgc3RhdGljcyB9O1xuXG5jb25zdCBnZXRSb3V0ZXJCYXNlbmFtZSA9ICgpID0+IHtcbiAgY29uc3QgYXBwQ29uZmlnID0gcnVudGltZS5nZXRBcHBDb25maWcoYXBwKTtcbiAgcmV0dXJuIGFwcENvbmZpZz8ucm91dGVyPy5iYXNlbmFtZSA/PyAnLycgPz8gJyc7XG59XG5cbmNvbnN0IHNldFJ1bnRpbWVFbnYgPSAocmVuZGVyTW9kZSkgPT4ge1xuICBpZiAocmVuZGVyTW9kZSA9PT0gJ1NTRycpIHtcbiAgICBwcm9jZXNzLmVudi5JQ0VfQ09SRV9TU0cgPSAndHJ1ZSc7XG4gIH0gZWxzZSB7XG4gICAgcHJvY2Vzcy5lbnYuSUNFX0NPUkVfU1NSID0gJ3RydWUnO1xuICB9XG59XG5cbmludGVyZmFjZSBSZW5kZXJPcHRpb25zIHtcbiAgZG9jdW1lbnRPbmx5PzogYm9vbGVhbjtcbiAgcmVuZGVyTW9kZT86IFJlbmRlck1vZGU7XG4gIGJhc2VuYW1lPzogc3RyaW5nO1xuICBzZXJ2ZXJPbmx5QmFzZW5hbWU/OiBzdHJpbmc7XG4gIHJvdXRlUGF0aD86IHN0cmluZztcbiAgZGlzYWJsZUZhbGxiYWNrPzogYm9vbGVhbjtcbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHJlbmRlclRvSFRNTChyZXF1ZXN0Q29udGV4dCwgb3B0aW9uczogUmVuZGVyT3B0aW9ucyA9IHt9KSB7XG4gIGNvbnN0IHsgZG9jdW1lbnRPbmx5LCByZW5kZXJNb2RlID0gJ1NTUicsIGJhc2VuYW1lLCBzZXJ2ZXJPbmx5QmFzZW5hbWUsIHJvdXRlUGF0aCwgZGlzYWJsZUZhbGxiYWNrIH0gPSBvcHRpb25zO1xuICBzZXRSdW50aW1lRW52KHJlbmRlck1vZGUpO1xuXG4gIHJldHVybiBhd2FpdCBydW50aW1lLnJlbmRlclRvSFRNTChyZXF1ZXN0Q29udGV4dCwge1xuICAgIGFwcCxcbiAgICBhc3NldHNNYW5pZmVzdCxcbiAgICByb3V0ZXMsXG4gICAgcnVudGltZU1vZHVsZXMsXG4gICAgRG9jdW1lbnQsXG4gICAgc2VydmVyT25seUJhc2VuYW1lLFxuICAgIGJhc2VuYW1lOiBiYXNlbmFtZSB8fCBnZXRSb3V0ZXJCYXNlbmFtZSgpLFxuICAgIGRvY3VtZW50T25seSxcbiAgICByZW5kZXJNb2RlLFxuICAgIHJvdXRlUGF0aCxcbiAgICBkaXNhYmxlRmFsbGJhY2ssXG4gICAgcm91dGVzQ29uZmlnLFxuICAgIHJ1bnRpbWVPcHRpb25zOiB7XG4gICAgICBhcHBTdG9yZSxcbiAgICB9LFxuICB9KTtcbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHJlbmRlclRvUmVzcG9uc2UocmVxdWVzdENvbnRleHQsIG9wdGlvbnM6IFJlbmRlck9wdGlvbnMgPSB7fSkge1xuICBjb25zdCB7IGRvY3VtZW50T25seSwgcmVuZGVyTW9kZSA9ICdTU1InLCBiYXNlbmFtZSwgc2VydmVyT25seUJhc2VuYW1lLCBkaXNhYmxlRmFsbGJhY2sgfSA9IG9wdGlvbnM7XG4gIHNldFJ1bnRpbWVFbnYob3B0aW9ucyk7XG5cbiAgcnVudGltZS5yZW5kZXJUb1Jlc3BvbnNlKHJlcXVlc3RDb250ZXh0LCB7XG4gICAgYXBwLFxuICAgIGFzc2V0c01hbmlmZXN0LFxuICAgIHJvdXRlcyxcbiAgICBydW50aW1lTW9kdWxlcyxcbiAgICBEb2N1bWVudCxcbiAgICBzZXJ2ZXJPbmx5QmFzZW5hbWUsXG4gICAgYmFzZW5hbWU6IGJhc2VuYW1lIHx8IGdldFJvdXRlckJhc2VuYW1lKCksXG4gICAgZG9jdW1lbnRPbmx5LFxuICAgIHJlbmRlck1vZGUsXG4gICAgZGlzYWJsZUZhbGxiYWNrLFxuICAgIHJvdXRlc0NvbmZpZyxcbiAgICBydW50aW1lT3B0aW9uczoge1xuICAgICAgYXBwU3RvcmUsXG4gICAgfSxcbiAgfSk7XG59XG4iLCAiaW1wb3J0IHsgY3JlYXRlQXhpb3NJbnN0YW5jZSwgc2V0QXhpb3NJbnN0YW5jZSB9IGZyb20gJy4vcmVxdWVzdC5qcyc7XG5jb25zdCBFWFBPUlRfTkFNRSA9ICdyZXF1ZXN0Q29uZmlnJztcbmNvbnN0IHJ1bnRpbWUgPSBhc3luYyAoeyBhcHBDb250ZXh0IH0pID0+IHtcbiAgICBjb25zdCB7IGFwcEV4cG9ydCB9ID0gYXBwQ29udGV4dDtcbiAgICBjb25zdCBleHBvcnRlZCA9IGFwcEV4cG9ydFtFWFBPUlRfTkFNRV07XG4gICAgY29uc3QgcmVxdWVzdENvbmZpZyA9ICh0eXBlb2YgZXhwb3J0ZWQgPT09ICdmdW5jdGlvbicgPyBhd2FpdCBleHBvcnRlZCgpIDogZXhwb3J0ZWQpIHx8IHt9O1xuICAgIC8vIFN1cHBvcnQgbXVsdGkgY29uZmlncy5cbiAgICBpZiAoQXJyYXkuaXNBcnJheShyZXF1ZXN0Q29uZmlnKSkge1xuICAgICAgICByZXF1ZXN0Q29uZmlnLmZvckVhY2gocmVxdWVzdEl0ZW0gPT4ge1xuICAgICAgICAgICAgY29uc3QgaW5zdGFuY2VOYW1lID0gcmVxdWVzdEl0ZW0uaW5zdGFuY2VOYW1lID8gcmVxdWVzdEl0ZW0uaW5zdGFuY2VOYW1lIDogJ2RlZmF1bHQnO1xuICAgICAgICAgICAgaWYgKGluc3RhbmNlTmFtZSkge1xuICAgICAgICAgICAgICAgIGNvbnN0IGF4aW9zSW5zdGFuY2UgPSBjcmVhdGVBeGlvc0luc3RhbmNlKGluc3RhbmNlTmFtZSlbaW5zdGFuY2VOYW1lXTtcbiAgICAgICAgICAgICAgICBzZXRBeGlvc0luc3RhbmNlKHJlcXVlc3RJdGVtLCBheGlvc0luc3RhbmNlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgICBjb25zdCBheGlvc0luc3RhbmNlID0gY3JlYXRlQXhpb3NJbnN0YW5jZSgpLmRlZmF1bHQ7XG4gICAgICAgIHNldEF4aW9zSW5zdGFuY2UocmVxdWVzdENvbmZpZywgYXhpb3NJbnN0YW5jZSk7XG4gICAgfVxufTtcbmV4cG9ydCBkZWZhdWx0IHJ1bnRpbWU7XG4vLyMgc291cmNlTWFwcGluZ1VSTD1ydW50aW1lLmpzLm1hcCIsICJpbXBvcnQgbW9kdWxlMCBmcm9tICdAaWNlL3BsdWdpbi1yZXF1ZXN0L2VzbS9ydW50aW1lJztcbiAgICAgICAgICAgICAgICBpbXBvcnQgbW9kdWxlMSBmcm9tICdAaWNlL3BsdWdpbi1zdG9yZS9lc20vcnVudGltZSc7XG4gICAgICAgICAgICAgICAgaW1wb3J0IG1vZHVsZTIgZnJvbSAnQGljZS9wbHVnaW4tYXV0aC9lc20vcnVudGltZSc7XG4gICAgICAgICAgICAgICAgXG5leHBvcnQgY29uc3Qgc3RhdGljcyA9IFtcbiAgbW9kdWxlMCxcbl07XG5leHBvcnQgY29uc3QgY29tbW9ucyA9IFtcbiAgbW9kdWxlMSxcbiAgbW9kdWxlMixcbl07XG5cblxuIiwgImltcG9ydCB7IGRlZmluZUFwcENvbmZpZywgaGlzdG9yeSwgZGVmaW5lRGF0YUxvYWRlciB9IGZyb20gJ2ljZSc7XG5pbXBvcnQgeyBmZXRjaFVzZXJJbmZvIH0gZnJvbSAnLi9zZXJ2aWNlcy91c2VyJztcbmltcG9ydCB7IGRlZmluZUF1dGhDb25maWcgfSBmcm9tICdAaWNlL3BsdWdpbi1hdXRoL2VzbS90eXBlcyc7XG5pbXBvcnQgeyBkZWZpbmVTdG9yZUNvbmZpZyB9IGZyb20gJ0BpY2UvcGx1Z2luLXN0b3JlL2VzbS90eXBlcyc7XG5pbXBvcnQgeyBkZWZpbmVSZXF1ZXN0Q29uZmlnIH0gZnJvbSAnQGljZS9wbHVnaW4tcmVxdWVzdC9lc20vdHlwZXMnO1xuXG4vLyBBcHAgY29uZmlnLCBzZWUgaHR0cHM6Ly92My5pY2Uud29yay9kb2NzL2d1aWRlL2Jhc2ljL2FwcFxuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQXBwQ29uZmlnKCgpID0+ICh7XG4gIC8vIFNldCB5b3VyIGNvbmZpZ3MgaGVyZS5cbn0pKTtcblxuZXhwb3J0IGNvbnN0IGF1dGhDb25maWcgPSBkZWZpbmVBdXRoQ29uZmlnKGFzeW5jIChhcHBEYXRhKSA9PiB7XG4gIGNvbnN0IHsgdXNlckluZm8gPSB7fSB9ID0gYXBwRGF0YTtcbiAgcmV0dXJuIHtcbiAgICBpbml0aWFsQXV0aDoge1xuICAgICAgYWRtaW46IHVzZXJJbmZvLnVzZXJUeXBlID09PSAnYWRtaW4nLFxuICAgICAgdXNlcjogdXNlckluZm8udXNlclR5cGUgPT09ICd1c2VyJyxcbiAgICB9LFxuICB9O1xufSk7XG5cbmV4cG9ydCBjb25zdCBzdG9yZUNvbmZpZyA9IGRlZmluZVN0b3JlQ29uZmlnKGFzeW5jIChhcHBEYXRhKSA9PiB7XG4gIGNvbnN0IHsgdXNlckluZm8gPSB7fSB9ID0gYXBwRGF0YTtcbiAgcmV0dXJuIHtcbiAgICBpbml0aWFsU3RhdGVzOiB7XG4gICAgICB1c2VyOiB7XG4gICAgICAgIGN1cnJlbnRVc2VyOiB1c2VySW5mbyxcbiAgICAgIH0sXG4gICAgfSxcbiAgfTtcbn0pO1xuXG5leHBvcnQgY29uc3QgcmVxdWVzdCA9IGRlZmluZVJlcXVlc3RDb25maWcoKCkgPT4gKHtcbiAgYmFzZVVSTDogJy9hcGknLFxufSkpO1xuXG5leHBvcnQgY29uc3QgZGF0YUxvYWRlciA9IGRlZmluZURhdGFMb2FkZXIoYXN5bmMgKCkgPT4ge1xuICBjb25zdCB1c2VySW5mbyA9IGF3YWl0IGdldFVzZXJJbmZvKCk7XG4gIHJldHVybiB7XG4gICAgdXNlckluZm8sXG4gIH07XG59KTtcblxuYXN5bmMgZnVuY3Rpb24gZ2V0VXNlckluZm8oKSB7XG4gIHRyeSB7XG4gICAgY29uc3QgdXNlckluZm8gPSBhd2FpdCBmZXRjaFVzZXJJbmZvKCk7XG4gICAgcmV0dXJuIHVzZXJJbmZvO1xuICB9IGNhdGNoIChlcnJvcikge1xuICAgIGhpc3Rvcnk/LnB1c2goYC9sb2dpbj9yZWRpcmVjdD0ke3dpbmRvdy5sb2NhdGlvbi5wYXRobmFtZX1gKTtcbiAgfVxuICByZXR1cm4gdW5kZWZpbmVkO1xufVxuIiwgImltcG9ydCB7IE1ldGEsIFRpdGxlLCBMaW5rcywgTWFpbiwgU2NyaXB0cyB9IGZyb20gJ2ljZSc7XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIERvY3VtZW50KCkge1xuICByZXR1cm4gKFxuICAgIDxodG1sPlxuICAgICAgPGhlYWQ+XG4gICAgICAgIDxtZXRhIGNoYXJTZXQ9XCJ1dGYtOFwiIC8+XG4gICAgICAgIDxtZXRhIG5hbWU9XCJkZXNjcmlwdGlvblwiIGNvbnRlbnQ9XCJpY2UuanMgMyBwcm8gc2NhZmZvbGRcIiAvPlxuICAgICAgICA8bGluayByZWw9XCJpY29uXCIgaHJlZj1cIi9mYXZpY29uLmljb1wiIHR5cGU9XCJpbWFnZS94LWljb25cIiAvPlxuICAgICAgICA8bWV0YSBuYW1lPVwidmlld3BvcnRcIiBjb250ZW50PVwid2lkdGg9ZGV2aWNlLXdpZHRoLCBpbml0aWFsLXNjYWxlPTEsIG1heGltdW0tc2NhbGU9MSwgdXNlci1zY2FsYWJsZT1ub1wiIC8+XG4gICAgICAgIDxNZXRhIC8+XG4gICAgICAgIDxUaXRsZSAvPlxuICAgICAgICA8TGlua3MgLz5cbiAgICAgIDwvaGVhZD5cbiAgICAgIDxib2R5PlxuICAgICAgICA8TWFpbiAvPlxuICAgICAgICA8U2NyaXB0cyAvPlxuICAgICAgPC9ib2R5PlxuICAgIDwvaHRtbD5cbiAgKTtcbn1cbiIsICJleHBvcnQgZGVmYXVsdCBbXG4gIHtcbiAgICBwYXRoOiAnJyxcbiAgICBsb2FkOiAoKSA9PiBpbXBvcnQoLyogd2VicGFja0NodW5rTmFtZTogXCJsYXlvdXRcIiAqLyAnQC9wYWdlcy9sYXlvdXQnKSxcbiAgICBjb21wb25lbnROYW1lOiAnbGF5b3V0JyxcbiAgICBpbmRleDogdW5kZWZpbmVkLFxuICAgIGlkOiAnbGF5b3V0JyxcbiAgICBleGFjdDogdHJ1ZSxcbiAgICBleHBvcnRzOiBbXCJkZWZhdWx0XCJdLFxuICAgIGxheW91dDogdHJ1ZSxcbiAgICBjaGlsZHJlbjogW3tcbiAgICAgIHBhdGg6ICdzdWNjZXNzJyxcbiAgICAgIGxvYWQ6ICgpID0+IGltcG9ydCgvKiB3ZWJwYWNrQ2h1bmtOYW1lOiBcInN1Y2Nlc3MtaW5kZXhcIiAqLyAnQC9wYWdlcy9zdWNjZXNzL2luZGV4JyksXG4gICAgICBjb21wb25lbnROYW1lOiAnc3VjY2Vzcy1pbmRleCcsXG4gICAgICBpbmRleDogdHJ1ZSxcbiAgICAgIGlkOiAnc3VjY2Vzcy9pbmRleCcsXG4gICAgICBleGFjdDogdHJ1ZSxcbiAgICAgIGV4cG9ydHM6IFtcImRlZmF1bHRcIl0sXG4gICAgfSx7XG4gICAgICBwYXRoOiAnbG9naW4nLFxuICAgICAgbG9hZDogKCkgPT4gaW1wb3J0KC8qIHdlYnBhY2tDaHVua05hbWU6IFwibG9naW4taW5kZXhcIiAqLyAnQC9wYWdlcy9sb2dpbi9pbmRleCcpLFxuICAgICAgY29tcG9uZW50TmFtZTogJ2xvZ2luLWluZGV4JyxcbiAgICAgIGluZGV4OiB0cnVlLFxuICAgICAgaWQ6ICdsb2dpbi9pbmRleCcsXG4gICAgICBleGFjdDogdHJ1ZSxcbiAgICAgIGV4cG9ydHM6IFtcImRlZmF1bHRcIixcImdldENvbmZpZ1wiXSxcbiAgICB9LHtcbiAgICAgIHBhdGg6ICdmb3JtJyxcbiAgICAgIGxvYWQ6ICgpID0+IGltcG9ydCgvKiB3ZWJwYWNrQ2h1bmtOYW1lOiBcImZvcm0taW5kZXhcIiAqLyAnQC9wYWdlcy9mb3JtL2luZGV4JyksXG4gICAgICBjb21wb25lbnROYW1lOiAnZm9ybS1pbmRleCcsXG4gICAgICBpbmRleDogdHJ1ZSxcbiAgICAgIGlkOiAnZm9ybS9pbmRleCcsXG4gICAgICBleGFjdDogdHJ1ZSxcbiAgICAgIGV4cG9ydHM6IFtcImRlZmF1bHRcIixcInBhZ2VDb25maWdcIl0sXG4gICAgfSx7XG4gICAgICBwYXRoOiAnbGlzdCcsXG4gICAgICBsb2FkOiAoKSA9PiBpbXBvcnQoLyogd2VicGFja0NodW5rTmFtZTogXCJsaXN0LWluZGV4XCIgKi8gJ0AvcGFnZXMvbGlzdC9pbmRleCcpLFxuICAgICAgY29tcG9uZW50TmFtZTogJ2xpc3QtaW5kZXgnLFxuICAgICAgaW5kZXg6IHRydWUsXG4gICAgICBpZDogJ2xpc3QvaW5kZXgnLFxuICAgICAgZXhhY3Q6IHRydWUsXG4gICAgICBleHBvcnRzOiBbXCJkZWZhdWx0XCIsXCJwYWdlQ29uZmlnXCJdLFxuICAgIH0se1xuICAgICAgcGF0aDogJycsXG4gICAgICBsb2FkOiAoKSA9PiBpbXBvcnQoLyogd2VicGFja0NodW5rTmFtZTogXCJpbmRleFwiICovICdAL3BhZ2VzL2luZGV4JyksXG4gICAgICBjb21wb25lbnROYW1lOiAnaW5kZXgnLFxuICAgICAgaW5kZXg6IHRydWUsXG4gICAgICBpZDogJ2luZGV4JyxcbiAgICAgIGV4YWN0OiB0cnVlLFxuICAgICAgZXhwb3J0czogW1wiZGVmYXVsdFwiLFwicGFnZUNvbmZpZ1wiXSxcbiAgICB9LHtcbiAgICAgIHBhdGg6ICcqJyxcbiAgICAgIGxvYWQ6ICgpID0+IGltcG9ydCgvKiB3ZWJwYWNrQ2h1bmtOYW1lOiBcIiRcIiAqLyAnQC9wYWdlcy8kJyksXG4gICAgICBjb21wb25lbnROYW1lOiAnJCcsXG4gICAgICBpbmRleDogdW5kZWZpbmVkLFxuICAgICAgaWQ6ICckJyxcbiAgICAgIGV4YWN0OiB0cnVlLFxuICAgICAgZXhwb3J0czogW1wiZGVmYXVsdFwiXSxcbiAgICB9LF1cbiAgfSxcbl07XG4iLCAidmFyIF9fY3JlYXRlID0gT2JqZWN0LmNyZWF0ZTtcbnZhciBfX2RlZlByb3AgPSBPYmplY3QuZGVmaW5lUHJvcGVydHk7XG52YXIgX19nZXRPd25Qcm9wRGVzYyA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3I7XG52YXIgX19nZXRPd25Qcm9wTmFtZXMgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcztcbnZhciBfX2dldFByb3RvT2YgPSBPYmplY3QuZ2V0UHJvdG90eXBlT2Y7XG52YXIgX19oYXNPd25Qcm9wID0gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eTtcbnZhciBfX2NvbW1vbkpTID0gKGNiLCBtb2QpID0+IGZ1bmN0aW9uIF9fcmVxdWlyZSgpIHtcbiAgcmV0dXJuIG1vZCB8fCAoMCwgY2JbX19nZXRPd25Qcm9wTmFtZXMoY2IpWzBdXSkoKG1vZCA9IHsgZXhwb3J0czoge30gfSkuZXhwb3J0cywgbW9kKSwgbW9kLmV4cG9ydHM7XG59O1xudmFyIF9fZXhwb3J0ID0gKHRhcmdldCwgYWxsKSA9PiB7XG4gIGZvciAodmFyIG5hbWUgaW4gYWxsKVxuICAgIF9fZGVmUHJvcCh0YXJnZXQsIG5hbWUsIHsgZ2V0OiBhbGxbbmFtZV0sIGVudW1lcmFibGU6IHRydWUgfSk7XG59O1xudmFyIF9fY29weVByb3BzID0gKHRvLCBmcm9tLCBleGNlcHQsIGRlc2MpID0+IHtcbiAgaWYgKGZyb20gJiYgdHlwZW9mIGZyb20gPT09IFwib2JqZWN0XCIgfHwgdHlwZW9mIGZyb20gPT09IFwiZnVuY3Rpb25cIikge1xuICAgIGZvciAobGV0IGtleSBvZiBfX2dldE93blByb3BOYW1lcyhmcm9tKSlcbiAgICAgIGlmICghX19oYXNPd25Qcm9wLmNhbGwodG8sIGtleSkgJiYga2V5ICE9PSBleGNlcHQpXG4gICAgICAgIF9fZGVmUHJvcCh0bywga2V5LCB7IGdldDogKCkgPT4gZnJvbVtrZXldLCBlbnVtZXJhYmxlOiAhKGRlc2MgPSBfX2dldE93blByb3BEZXNjKGZyb20sIGtleSkpIHx8IGRlc2MuZW51bWVyYWJsZSB9KTtcbiAgfVxuICByZXR1cm4gdG87XG59O1xudmFyIF9fdG9FU00gPSAobW9kLCBpc05vZGVNb2RlLCB0YXJnZXQpID0+ICh0YXJnZXQgPSBtb2QgIT0gbnVsbCA/IF9fY3JlYXRlKF9fZ2V0UHJvdG9PZihtb2QpKSA6IHt9LCBfX2NvcHlQcm9wcyhcbiAgaXNOb2RlTW9kZSB8fCAhbW9kIHx8ICFtb2QuX19lc01vZHVsZSA/IF9fZGVmUHJvcCh0YXJnZXQsIFwiZGVmYXVsdFwiLCB7IHZhbHVlOiBtb2QsIGVudW1lcmFibGU6IHRydWUgfSkgOiB0YXJnZXQsXG4gIG1vZFxuKSk7XG5cbi8vIG5vZGVfbW9kdWxlcy9heGlvcy9saWIvaGVscGVycy9iaW5kLmpzXG52YXIgcmVxdWlyZV9iaW5kID0gX19jb21tb25KUyh7XG4gIFwibm9kZV9tb2R1bGVzL2F4aW9zL2xpYi9oZWxwZXJzL2JpbmQuanNcIihleHBvcnRzLCBtb2R1bGUpIHtcbiAgICBcInVzZSBzdHJpY3RcIjtcbiAgICBtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGJpbmQoZm4yLCB0aGlzQXJnKSB7XG4gICAgICByZXR1cm4gZnVuY3Rpb24gd3JhcCgpIHtcbiAgICAgICAgdmFyIGFyZ3MgPSBuZXcgQXJyYXkoYXJndW1lbnRzLmxlbmd0aCk7XG4gICAgICAgIGZvciAodmFyIGkyID0gMDsgaTIgPCBhcmdzLmxlbmd0aDsgaTIrKykge1xuICAgICAgICAgIGFyZ3NbaTJdID0gYXJndW1lbnRzW2kyXTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZm4yLmFwcGx5KHRoaXNBcmcsIGFyZ3MpO1xuICAgICAgfTtcbiAgICB9O1xuICB9XG59KTtcblxuLy8gbm9kZV9tb2R1bGVzL2F4aW9zL2xpYi91dGlscy5qc1xudmFyIHJlcXVpcmVfdXRpbHMgPSBfX2NvbW1vbkpTKHtcbiAgXCJub2RlX21vZHVsZXMvYXhpb3MvbGliL3V0aWxzLmpzXCIoZXhwb3J0cywgbW9kdWxlKSB7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG4gICAgdmFyIGJpbmQgPSByZXF1aXJlX2JpbmQoKTtcbiAgICB2YXIgdG9TdHJpbmcgPSBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nO1xuICAgIHZhciBraW5kT2YyID0gZnVuY3Rpb24oY2FjaGUpIHtcbiAgICAgIHJldHVybiBmdW5jdGlvbih0aGluZykge1xuICAgICAgICB2YXIgc3RyID0gdG9TdHJpbmcuY2FsbCh0aGluZyk7XG4gICAgICAgIHJldHVybiBjYWNoZVtzdHJdIHx8IChjYWNoZVtzdHJdID0gc3RyLnNsaWNlKDgsIC0xKS50b0xvd2VyQ2FzZSgpKTtcbiAgICAgIH07XG4gICAgfSgvKiBAX19QVVJFX18gKi8gT2JqZWN0LmNyZWF0ZShudWxsKSk7XG4gICAgZnVuY3Rpb24ga2luZE9mVGVzdCh0eXBlKSB7XG4gICAgICB0eXBlID0gdHlwZS50b0xvd2VyQ2FzZSgpO1xuICAgICAgcmV0dXJuIGZ1bmN0aW9uIGlzS2luZE9mKHRoaW5nKSB7XG4gICAgICAgIHJldHVybiBraW5kT2YyKHRoaW5nKSA9PT0gdHlwZTtcbiAgICAgIH07XG4gICAgfVxuICAgIGZ1bmN0aW9uIGlzQXJyYXkodmFsKSB7XG4gICAgICByZXR1cm4gQXJyYXkuaXNBcnJheSh2YWwpO1xuICAgIH1cbiAgICBmdW5jdGlvbiBpc1VuZGVmaW5lZCh2YWwpIHtcbiAgICAgIHJldHVybiB0eXBlb2YgdmFsID09PSBcInVuZGVmaW5lZFwiO1xuICAgIH1cbiAgICBmdW5jdGlvbiBpc0J1ZmZlcih2YWwpIHtcbiAgICAgIHJldHVybiB2YWwgIT09IG51bGwgJiYgIWlzVW5kZWZpbmVkKHZhbCkgJiYgdmFsLmNvbnN0cnVjdG9yICE9PSBudWxsICYmICFpc1VuZGVmaW5lZCh2YWwuY29uc3RydWN0b3IpICYmIHR5cGVvZiB2YWwuY29uc3RydWN0b3IuaXNCdWZmZXIgPT09IFwiZnVuY3Rpb25cIiAmJiB2YWwuY29uc3RydWN0b3IuaXNCdWZmZXIodmFsKTtcbiAgICB9XG4gICAgdmFyIGlzQXJyYXlCdWZmZXIgPSBraW5kT2ZUZXN0KFwiQXJyYXlCdWZmZXJcIik7XG4gICAgZnVuY3Rpb24gaXNBcnJheUJ1ZmZlclZpZXcodmFsKSB7XG4gICAgICB2YXIgcmVzdWx0O1xuICAgICAgaWYgKHR5cGVvZiBBcnJheUJ1ZmZlciAhPT0gXCJ1bmRlZmluZWRcIiAmJiBBcnJheUJ1ZmZlci5pc1ZpZXcpIHtcbiAgICAgICAgcmVzdWx0ID0gQXJyYXlCdWZmZXIuaXNWaWV3KHZhbCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXN1bHQgPSB2YWwgJiYgdmFsLmJ1ZmZlciAmJiBpc0FycmF5QnVmZmVyKHZhbC5idWZmZXIpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9XG4gICAgZnVuY3Rpb24gaXNTdHJpbmcodmFsKSB7XG4gICAgICByZXR1cm4gdHlwZW9mIHZhbCA9PT0gXCJzdHJpbmdcIjtcbiAgICB9XG4gICAgZnVuY3Rpb24gaXNOdW1iZXIodmFsKSB7XG4gICAgICByZXR1cm4gdHlwZW9mIHZhbCA9PT0gXCJudW1iZXJcIjtcbiAgICB9XG4gICAgZnVuY3Rpb24gaXNPYmplY3QodmFsKSB7XG4gICAgICByZXR1cm4gdmFsICE9PSBudWxsICYmIHR5cGVvZiB2YWwgPT09IFwib2JqZWN0XCI7XG4gICAgfVxuICAgIGZ1bmN0aW9uIGlzUGxhaW5PYmplY3QzKHZhbCkge1xuICAgICAgaWYgKGtpbmRPZjIodmFsKSAhPT0gXCJvYmplY3RcIikge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG4gICAgICB2YXIgcHJvdG90eXBlID0gT2JqZWN0LmdldFByb3RvdHlwZU9mKHZhbCk7XG4gICAgICByZXR1cm4gcHJvdG90eXBlID09PSBudWxsIHx8IHByb3RvdHlwZSA9PT0gT2JqZWN0LnByb3RvdHlwZTtcbiAgICB9XG4gICAgdmFyIGlzRGF0ZTIgPSBraW5kT2ZUZXN0KFwiRGF0ZVwiKTtcbiAgICB2YXIgaXNGaWxlID0ga2luZE9mVGVzdChcIkZpbGVcIik7XG4gICAgdmFyIGlzQmxvYiA9IGtpbmRPZlRlc3QoXCJCbG9iXCIpO1xuICAgIHZhciBpc0ZpbGVMaXN0ID0ga2luZE9mVGVzdChcIkZpbGVMaXN0XCIpO1xuICAgIGZ1bmN0aW9uIGlzRnVuY3Rpb24yKHZhbCkge1xuICAgICAgcmV0dXJuIHRvU3RyaW5nLmNhbGwodmFsKSA9PT0gXCJbb2JqZWN0IEZ1bmN0aW9uXVwiO1xuICAgIH1cbiAgICBmdW5jdGlvbiBpc1N0cmVhbSh2YWwpIHtcbiAgICAgIHJldHVybiBpc09iamVjdCh2YWwpICYmIGlzRnVuY3Rpb24yKHZhbC5waXBlKTtcbiAgICB9XG4gICAgZnVuY3Rpb24gaXNGb3JtRGF0YSh0aGluZykge1xuICAgICAgdmFyIHBhdHRlcm4gPSBcIltvYmplY3QgRm9ybURhdGFdXCI7XG4gICAgICByZXR1cm4gdGhpbmcgJiYgKHR5cGVvZiBGb3JtRGF0YSA9PT0gXCJmdW5jdGlvblwiICYmIHRoaW5nIGluc3RhbmNlb2YgRm9ybURhdGEgfHwgdG9TdHJpbmcuY2FsbCh0aGluZykgPT09IHBhdHRlcm4gfHwgaXNGdW5jdGlvbjIodGhpbmcudG9TdHJpbmcpICYmIHRoaW5nLnRvU3RyaW5nKCkgPT09IHBhdHRlcm4pO1xuICAgIH1cbiAgICB2YXIgaXNVUkxTZWFyY2hQYXJhbXMgPSBraW5kT2ZUZXN0KFwiVVJMU2VhcmNoUGFyYW1zXCIpO1xuICAgIGZ1bmN0aW9uIHRyaW0oc3RyKSB7XG4gICAgICByZXR1cm4gc3RyLnRyaW0gPyBzdHIudHJpbSgpIDogc3RyLnJlcGxhY2UoL15cXHMrfFxccyskL2csIFwiXCIpO1xuICAgIH1cbiAgICBmdW5jdGlvbiBpc1N0YW5kYXJkQnJvd3NlckVudigpIHtcbiAgICAgIGlmICh0eXBlb2YgbmF2aWdhdG9yICE9PSBcInVuZGVmaW5lZFwiICYmIChuYXZpZ2F0b3IucHJvZHVjdCA9PT0gXCJSZWFjdE5hdGl2ZVwiIHx8IG5hdmlnYXRvci5wcm9kdWN0ID09PSBcIk5hdGl2ZVNjcmlwdFwiIHx8IG5hdmlnYXRvci5wcm9kdWN0ID09PSBcIk5TXCIpKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cbiAgICAgIHJldHVybiB0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiICYmIHR5cGVvZiBkb2N1bWVudCAhPT0gXCJ1bmRlZmluZWRcIjtcbiAgICB9XG4gICAgZnVuY3Rpb24gZm9yRWFjaChvYmosIGZuMikge1xuICAgICAgaWYgKG9iaiA9PT0gbnVsbCB8fCB0eXBlb2Ygb2JqID09PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIGlmICh0eXBlb2Ygb2JqICE9PSBcIm9iamVjdFwiKSB7XG4gICAgICAgIG9iaiA9IFtvYmpdO1xuICAgICAgfVxuICAgICAgaWYgKGlzQXJyYXkob2JqKSkge1xuICAgICAgICBmb3IgKHZhciBpMiA9IDAsIGwyID0gb2JqLmxlbmd0aDsgaTIgPCBsMjsgaTIrKykge1xuICAgICAgICAgIGZuMi5jYWxsKG51bGwsIG9ialtpMl0sIGkyLCBvYmopO1xuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBmb3IgKHZhciBrZXkgaW4gb2JqKSB7XG4gICAgICAgICAgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIGtleSkpIHtcbiAgICAgICAgICAgIGZuMi5jYWxsKG51bGwsIG9ialtrZXldLCBrZXksIG9iaik7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIGZ1bmN0aW9uIG1lcmdlKCkge1xuICAgICAgdmFyIHJlc3VsdCA9IHt9O1xuICAgICAgZnVuY3Rpb24gYXNzaWduVmFsdWUodmFsLCBrZXkpIHtcbiAgICAgICAgaWYgKGlzUGxhaW5PYmplY3QzKHJlc3VsdFtrZXldKSAmJiBpc1BsYWluT2JqZWN0Myh2YWwpKSB7XG4gICAgICAgICAgcmVzdWx0W2tleV0gPSBtZXJnZShyZXN1bHRba2V5XSwgdmFsKTtcbiAgICAgICAgfSBlbHNlIGlmIChpc1BsYWluT2JqZWN0Myh2YWwpKSB7XG4gICAgICAgICAgcmVzdWx0W2tleV0gPSBtZXJnZSh7fSwgdmFsKTtcbiAgICAgICAgfSBlbHNlIGlmIChpc0FycmF5KHZhbCkpIHtcbiAgICAgICAgICByZXN1bHRba2V5XSA9IHZhbC5zbGljZSgpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJlc3VsdFtrZXldID0gdmFsO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBmb3IgKHZhciBpMiA9IDAsIGwyID0gYXJndW1lbnRzLmxlbmd0aDsgaTIgPCBsMjsgaTIrKykge1xuICAgICAgICBmb3JFYWNoKGFyZ3VtZW50c1tpMl0sIGFzc2lnblZhbHVlKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfVxuICAgIGZ1bmN0aW9uIGV4dGVuZChhMiwgYjIsIHRoaXNBcmcpIHtcbiAgICAgIGZvckVhY2goYjIsIGZ1bmN0aW9uIGFzc2lnblZhbHVlKHZhbCwga2V5KSB7XG4gICAgICAgIGlmICh0aGlzQXJnICYmIHR5cGVvZiB2YWwgPT09IFwiZnVuY3Rpb25cIikge1xuICAgICAgICAgIGEyW2tleV0gPSBiaW5kKHZhbCwgdGhpc0FyZyk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgYTJba2V5XSA9IHZhbDtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICByZXR1cm4gYTI7XG4gICAgfVxuICAgIGZ1bmN0aW9uIHN0cmlwQk9NKGNvbnRlbnQpIHtcbiAgICAgIGlmIChjb250ZW50LmNoYXJDb2RlQXQoMCkgPT09IDY1Mjc5KSB7XG4gICAgICAgIGNvbnRlbnQgPSBjb250ZW50LnNsaWNlKDEpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIGNvbnRlbnQ7XG4gICAgfVxuICAgIGZ1bmN0aW9uIGluaGVyaXRzKGNvbnN0cnVjdG9yLCBzdXBlckNvbnN0cnVjdG9yLCBwcm9wcywgZGVzY3JpcHRvcnMpIHtcbiAgICAgIGNvbnN0cnVjdG9yLnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoc3VwZXJDb25zdHJ1Y3Rvci5wcm90b3R5cGUsIGRlc2NyaXB0b3JzKTtcbiAgICAgIGNvbnN0cnVjdG9yLnByb3RvdHlwZS5jb25zdHJ1Y3RvciA9IGNvbnN0cnVjdG9yO1xuICAgICAgcHJvcHMgJiYgT2JqZWN0LmFzc2lnbihjb25zdHJ1Y3Rvci5wcm90b3R5cGUsIHByb3BzKTtcbiAgICB9XG4gICAgZnVuY3Rpb24gdG9GbGF0T2JqZWN0KHNvdXJjZU9iaiwgZGVzdE9iaiwgZmlsdGVyKSB7XG4gICAgICB2YXIgcHJvcHM7XG4gICAgICB2YXIgaTI7XG4gICAgICB2YXIgcHJvcDtcbiAgICAgIHZhciBtZXJnZWQgPSB7fTtcbiAgICAgIGRlc3RPYmogPSBkZXN0T2JqIHx8IHt9O1xuICAgICAgZG8ge1xuICAgICAgICBwcm9wcyA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eU5hbWVzKHNvdXJjZU9iaik7XG4gICAgICAgIGkyID0gcHJvcHMubGVuZ3RoO1xuICAgICAgICB3aGlsZSAoaTItLSA+IDApIHtcbiAgICAgICAgICBwcm9wID0gcHJvcHNbaTJdO1xuICAgICAgICAgIGlmICghbWVyZ2VkW3Byb3BdKSB7XG4gICAgICAgICAgICBkZXN0T2JqW3Byb3BdID0gc291cmNlT2JqW3Byb3BdO1xuICAgICAgICAgICAgbWVyZ2VkW3Byb3BdID0gdHJ1ZTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgc291cmNlT2JqID0gT2JqZWN0LmdldFByb3RvdHlwZU9mKHNvdXJjZU9iaik7XG4gICAgICB9IHdoaWxlIChzb3VyY2VPYmogJiYgKCFmaWx0ZXIgfHwgZmlsdGVyKHNvdXJjZU9iaiwgZGVzdE9iaikpICYmIHNvdXJjZU9iaiAhPT0gT2JqZWN0LnByb3RvdHlwZSk7XG4gICAgICByZXR1cm4gZGVzdE9iajtcbiAgICB9XG4gICAgZnVuY3Rpb24gZW5kc1dpdGgoc3RyLCBzZWFyY2hTdHJpbmcsIHBvc2l0aW9uKSB7XG4gICAgICBzdHIgPSBTdHJpbmcoc3RyKTtcbiAgICAgIGlmIChwb3NpdGlvbiA9PT0gdm9pZCAwIHx8IHBvc2l0aW9uID4gc3RyLmxlbmd0aCkge1xuICAgICAgICBwb3NpdGlvbiA9IHN0ci5sZW5ndGg7XG4gICAgICB9XG4gICAgICBwb3NpdGlvbiAtPSBzZWFyY2hTdHJpbmcubGVuZ3RoO1xuICAgICAgdmFyIGxhc3RJbmRleCA9IHN0ci5pbmRleE9mKHNlYXJjaFN0cmluZywgcG9zaXRpb24pO1xuICAgICAgcmV0dXJuIGxhc3RJbmRleCAhPT0gLTEgJiYgbGFzdEluZGV4ID09PSBwb3NpdGlvbjtcbiAgICB9XG4gICAgZnVuY3Rpb24gdG9BcnJheSh0aGluZykge1xuICAgICAgaWYgKCF0aGluZylcbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICB2YXIgaTIgPSB0aGluZy5sZW5ndGg7XG4gICAgICBpZiAoaXNVbmRlZmluZWQoaTIpKVxuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgIHZhciBhcnIgPSBuZXcgQXJyYXkoaTIpO1xuICAgICAgd2hpbGUgKGkyLS0gPiAwKSB7XG4gICAgICAgIGFycltpMl0gPSB0aGluZ1tpMl07XG4gICAgICB9XG4gICAgICByZXR1cm4gYXJyO1xuICAgIH1cbiAgICB2YXIgaXNUeXBlZEFycmF5ID0gZnVuY3Rpb24oVHlwZWRBcnJheSkge1xuICAgICAgcmV0dXJuIGZ1bmN0aW9uKHRoaW5nKSB7XG4gICAgICAgIHJldHVybiBUeXBlZEFycmF5ICYmIHRoaW5nIGluc3RhbmNlb2YgVHlwZWRBcnJheTtcbiAgICAgIH07XG4gICAgfSh0eXBlb2YgVWludDhBcnJheSAhPT0gXCJ1bmRlZmluZWRcIiAmJiBPYmplY3QuZ2V0UHJvdG90eXBlT2YoVWludDhBcnJheSkpO1xuICAgIG1vZHVsZS5leHBvcnRzID0ge1xuICAgICAgaXNBcnJheSxcbiAgICAgIGlzQXJyYXlCdWZmZXIsXG4gICAgICBpc0J1ZmZlcixcbiAgICAgIGlzRm9ybURhdGEsXG4gICAgICBpc0FycmF5QnVmZmVyVmlldyxcbiAgICAgIGlzU3RyaW5nLFxuICAgICAgaXNOdW1iZXIsXG4gICAgICBpc09iamVjdCxcbiAgICAgIGlzUGxhaW5PYmplY3Q6IGlzUGxhaW5PYmplY3QzLFxuICAgICAgaXNVbmRlZmluZWQsXG4gICAgICBpc0RhdGU6IGlzRGF0ZTIsXG4gICAgICBpc0ZpbGUsXG4gICAgICBpc0Jsb2IsXG4gICAgICBpc0Z1bmN0aW9uOiBpc0Z1bmN0aW9uMixcbiAgICAgIGlzU3RyZWFtLFxuICAgICAgaXNVUkxTZWFyY2hQYXJhbXMsXG4gICAgICBpc1N0YW5kYXJkQnJvd3NlckVudixcbiAgICAgIGZvckVhY2gsXG4gICAgICBtZXJnZSxcbiAgICAgIGV4dGVuZCxcbiAgICAgIHRyaW0sXG4gICAgICBzdHJpcEJPTSxcbiAgICAgIGluaGVyaXRzLFxuICAgICAgdG9GbGF0T2JqZWN0LFxuICAgICAga2luZE9mOiBraW5kT2YyLFxuICAgICAga2luZE9mVGVzdCxcbiAgICAgIGVuZHNXaXRoLFxuICAgICAgdG9BcnJheSxcbiAgICAgIGlzVHlwZWRBcnJheSxcbiAgICAgIGlzRmlsZUxpc3RcbiAgICB9O1xuICB9XG59KTtcblxuLy8gbm9kZV9tb2R1bGVzL2F4aW9zL2xpYi9oZWxwZXJzL2J1aWxkVVJMLmpzXG52YXIgcmVxdWlyZV9idWlsZFVSTCA9IF9fY29tbW9uSlMoe1xuICBcIm5vZGVfbW9kdWxlcy9heGlvcy9saWIvaGVscGVycy9idWlsZFVSTC5qc1wiKGV4cG9ydHMsIG1vZHVsZSkge1xuICAgIFwidXNlIHN0cmljdFwiO1xuICAgIHZhciB1dGlscyA9IHJlcXVpcmVfdXRpbHMoKTtcbiAgICBmdW5jdGlvbiBlbmNvZGUodmFsKSB7XG4gICAgICByZXR1cm4gZW5jb2RlVVJJQ29tcG9uZW50KHZhbCkucmVwbGFjZSgvJTNBL2dpLCBcIjpcIikucmVwbGFjZSgvJTI0L2csIFwiJFwiKS5yZXBsYWNlKC8lMkMvZ2ksIFwiLFwiKS5yZXBsYWNlKC8lMjAvZywgXCIrXCIpLnJlcGxhY2UoLyU1Qi9naSwgXCJbXCIpLnJlcGxhY2UoLyU1RC9naSwgXCJdXCIpO1xuICAgIH1cbiAgICBtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGJ1aWxkVVJMKHVybCwgcGFyYW1zLCBwYXJhbXNTZXJpYWxpemVyKSB7XG4gICAgICBpZiAoIXBhcmFtcykge1xuICAgICAgICByZXR1cm4gdXJsO1xuICAgICAgfVxuICAgICAgdmFyIHNlcmlhbGl6ZWRQYXJhbXM7XG4gICAgICBpZiAocGFyYW1zU2VyaWFsaXplcikge1xuICAgICAgICBzZXJpYWxpemVkUGFyYW1zID0gcGFyYW1zU2VyaWFsaXplcihwYXJhbXMpO1xuICAgICAgfSBlbHNlIGlmICh1dGlscy5pc1VSTFNlYXJjaFBhcmFtcyhwYXJhbXMpKSB7XG4gICAgICAgIHNlcmlhbGl6ZWRQYXJhbXMgPSBwYXJhbXMudG9TdHJpbmcoKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHZhciBwYXJ0cyA9IFtdO1xuICAgICAgICB1dGlscy5mb3JFYWNoKHBhcmFtcywgZnVuY3Rpb24gc2VyaWFsaXplKHZhbCwga2V5KSB7XG4gICAgICAgICAgaWYgKHZhbCA9PT0gbnVsbCB8fCB0eXBlb2YgdmFsID09PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmICh1dGlscy5pc0FycmF5KHZhbCkpIHtcbiAgICAgICAgICAgIGtleSA9IGtleSArIFwiW11cIjtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdmFsID0gW3ZhbF07XG4gICAgICAgICAgfVxuICAgICAgICAgIHV0aWxzLmZvckVhY2godmFsLCBmdW5jdGlvbiBwYXJzZVZhbHVlKHYyKSB7XG4gICAgICAgICAgICBpZiAodXRpbHMuaXNEYXRlKHYyKSkge1xuICAgICAgICAgICAgICB2MiA9IHYyLnRvSVNPU3RyaW5nKCk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKHV0aWxzLmlzT2JqZWN0KHYyKSkge1xuICAgICAgICAgICAgICB2MiA9IEpTT04uc3RyaW5naWZ5KHYyKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHBhcnRzLnB1c2goZW5jb2RlKGtleSkgKyBcIj1cIiArIGVuY29kZSh2MikpO1xuICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICAgICAgc2VyaWFsaXplZFBhcmFtcyA9IHBhcnRzLmpvaW4oXCImXCIpO1xuICAgICAgfVxuICAgICAgaWYgKHNlcmlhbGl6ZWRQYXJhbXMpIHtcbiAgICAgICAgdmFyIGhhc2htYXJrSW5kZXggPSB1cmwuaW5kZXhPZihcIiNcIik7XG4gICAgICAgIGlmIChoYXNobWFya0luZGV4ICE9PSAtMSkge1xuICAgICAgICAgIHVybCA9IHVybC5zbGljZSgwLCBoYXNobWFya0luZGV4KTtcbiAgICAgICAgfVxuICAgICAgICB1cmwgKz0gKHVybC5pbmRleE9mKFwiP1wiKSA9PT0gLTEgPyBcIj9cIiA6IFwiJlwiKSArIHNlcmlhbGl6ZWRQYXJhbXM7XG4gICAgICB9XG4gICAgICByZXR1cm4gdXJsO1xuICAgIH07XG4gIH1cbn0pO1xuXG4vLyBub2RlX21vZHVsZXMvYXhpb3MvbGliL2NvcmUvSW50ZXJjZXB0b3JNYW5hZ2VyLmpzXG52YXIgcmVxdWlyZV9JbnRlcmNlcHRvck1hbmFnZXIgPSBfX2NvbW1vbkpTKHtcbiAgXCJub2RlX21vZHVsZXMvYXhpb3MvbGliL2NvcmUvSW50ZXJjZXB0b3JNYW5hZ2VyLmpzXCIoZXhwb3J0cywgbW9kdWxlKSB7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG4gICAgdmFyIHV0aWxzID0gcmVxdWlyZV91dGlscygpO1xuICAgIGZ1bmN0aW9uIEludGVyY2VwdG9yTWFuYWdlcigpIHtcbiAgICAgIHRoaXMuaGFuZGxlcnMgPSBbXTtcbiAgICB9XG4gICAgSW50ZXJjZXB0b3JNYW5hZ2VyLnByb3RvdHlwZS51c2UgPSBmdW5jdGlvbiB1c2UoZnVsZmlsbGVkLCByZWplY3RlZCwgb3B0aW9ucykge1xuICAgICAgdGhpcy5oYW5kbGVycy5wdXNoKHtcbiAgICAgICAgZnVsZmlsbGVkLFxuICAgICAgICByZWplY3RlZCxcbiAgICAgICAgc3luY2hyb25vdXM6IG9wdGlvbnMgPyBvcHRpb25zLnN5bmNocm9ub3VzIDogZmFsc2UsXG4gICAgICAgIHJ1bldoZW46IG9wdGlvbnMgPyBvcHRpb25zLnJ1bldoZW4gOiBudWxsXG4gICAgICB9KTtcbiAgICAgIHJldHVybiB0aGlzLmhhbmRsZXJzLmxlbmd0aCAtIDE7XG4gICAgfTtcbiAgICBJbnRlcmNlcHRvck1hbmFnZXIucHJvdG90eXBlLmVqZWN0ID0gZnVuY3Rpb24gZWplY3QoaWQpIHtcbiAgICAgIGlmICh0aGlzLmhhbmRsZXJzW2lkXSkge1xuICAgICAgICB0aGlzLmhhbmRsZXJzW2lkXSA9IG51bGw7XG4gICAgICB9XG4gICAgfTtcbiAgICBJbnRlcmNlcHRvck1hbmFnZXIucHJvdG90eXBlLmZvckVhY2ggPSBmdW5jdGlvbiBmb3JFYWNoKGZuMikge1xuICAgICAgdXRpbHMuZm9yRWFjaCh0aGlzLmhhbmRsZXJzLCBmdW5jdGlvbiBmb3JFYWNoSGFuZGxlcihoMikge1xuICAgICAgICBpZiAoaDIgIT09IG51bGwpIHtcbiAgICAgICAgICBmbjIoaDIpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9O1xuICAgIG1vZHVsZS5leHBvcnRzID0gSW50ZXJjZXB0b3JNYW5hZ2VyO1xuICB9XG59KTtcblxuLy8gbm9kZV9tb2R1bGVzL2F4aW9zL2xpYi9oZWxwZXJzL25vcm1hbGl6ZUhlYWRlck5hbWUuanNcbnZhciByZXF1aXJlX25vcm1hbGl6ZUhlYWRlck5hbWUgPSBfX2NvbW1vbkpTKHtcbiAgXCJub2RlX21vZHVsZXMvYXhpb3MvbGliL2hlbHBlcnMvbm9ybWFsaXplSGVhZGVyTmFtZS5qc1wiKGV4cG9ydHMsIG1vZHVsZSkge1xuICAgIFwidXNlIHN0cmljdFwiO1xuICAgIHZhciB1dGlscyA9IHJlcXVpcmVfdXRpbHMoKTtcbiAgICBtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIG5vcm1hbGl6ZUhlYWRlck5hbWUoaGVhZGVycywgbm9ybWFsaXplZE5hbWUpIHtcbiAgICAgIHV0aWxzLmZvckVhY2goaGVhZGVycywgZnVuY3Rpb24gcHJvY2Vzc0hlYWRlcih2YWx1ZSwgbmFtZSkge1xuICAgICAgICBpZiAobmFtZSAhPT0gbm9ybWFsaXplZE5hbWUgJiYgbmFtZS50b1VwcGVyQ2FzZSgpID09PSBub3JtYWxpemVkTmFtZS50b1VwcGVyQ2FzZSgpKSB7XG4gICAgICAgICAgaGVhZGVyc1tub3JtYWxpemVkTmFtZV0gPSB2YWx1ZTtcbiAgICAgICAgICBkZWxldGUgaGVhZGVyc1tuYW1lXTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfTtcbiAgfVxufSk7XG5cbi8vIG5vZGVfbW9kdWxlcy9heGlvcy9saWIvY29yZS9BeGlvc0Vycm9yLmpzXG52YXIgcmVxdWlyZV9BeGlvc0Vycm9yID0gX19jb21tb25KUyh7XG4gIFwibm9kZV9tb2R1bGVzL2F4aW9zL2xpYi9jb3JlL0F4aW9zRXJyb3IuanNcIihleHBvcnRzLCBtb2R1bGUpIHtcbiAgICBcInVzZSBzdHJpY3RcIjtcbiAgICB2YXIgdXRpbHMgPSByZXF1aXJlX3V0aWxzKCk7XG4gICAgZnVuY3Rpb24gQXhpb3NFcnJvcihtZXNzYWdlLCBjb2RlLCBjb25maWcsIHJlcXVlc3QyLCByZXNwb25zZSkge1xuICAgICAgRXJyb3IuY2FsbCh0aGlzKTtcbiAgICAgIHRoaXMubWVzc2FnZSA9IG1lc3NhZ2U7XG4gICAgICB0aGlzLm5hbWUgPSBcIkF4aW9zRXJyb3JcIjtcbiAgICAgIGNvZGUgJiYgKHRoaXMuY29kZSA9IGNvZGUpO1xuICAgICAgY29uZmlnICYmICh0aGlzLmNvbmZpZyA9IGNvbmZpZyk7XG4gICAgICByZXF1ZXN0MiAmJiAodGhpcy5yZXF1ZXN0ID0gcmVxdWVzdDIpO1xuICAgICAgcmVzcG9uc2UgJiYgKHRoaXMucmVzcG9uc2UgPSByZXNwb25zZSk7XG4gICAgfVxuICAgIHV0aWxzLmluaGVyaXRzKEF4aW9zRXJyb3IsIEVycm9yLCB7XG4gICAgICB0b0pTT046IGZ1bmN0aW9uIHRvSlNPTigpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICBtZXNzYWdlOiB0aGlzLm1lc3NhZ2UsXG4gICAgICAgICAgbmFtZTogdGhpcy5uYW1lLFxuICAgICAgICAgIGRlc2NyaXB0aW9uOiB0aGlzLmRlc2NyaXB0aW9uLFxuICAgICAgICAgIG51bWJlcjogdGhpcy5udW1iZXIsXG4gICAgICAgICAgZmlsZU5hbWU6IHRoaXMuZmlsZU5hbWUsXG4gICAgICAgICAgbGluZU51bWJlcjogdGhpcy5saW5lTnVtYmVyLFxuICAgICAgICAgIGNvbHVtbk51bWJlcjogdGhpcy5jb2x1bW5OdW1iZXIsXG4gICAgICAgICAgc3RhY2s6IHRoaXMuc3RhY2ssXG4gICAgICAgICAgY29uZmlnOiB0aGlzLmNvbmZpZyxcbiAgICAgICAgICBjb2RlOiB0aGlzLmNvZGUsXG4gICAgICAgICAgc3RhdHVzOiB0aGlzLnJlc3BvbnNlICYmIHRoaXMucmVzcG9uc2Uuc3RhdHVzID8gdGhpcy5yZXNwb25zZS5zdGF0dXMgOiBudWxsXG4gICAgICAgIH07XG4gICAgICB9XG4gICAgfSk7XG4gICAgdmFyIHByb3RvdHlwZSA9IEF4aW9zRXJyb3IucHJvdG90eXBlO1xuICAgIHZhciBkZXNjcmlwdG9ycyA9IHt9O1xuICAgIFtcbiAgICAgIFwiRVJSX0JBRF9PUFRJT05fVkFMVUVcIixcbiAgICAgIFwiRVJSX0JBRF9PUFRJT05cIixcbiAgICAgIFwiRUNPTk5BQk9SVEVEXCIsXG4gICAgICBcIkVUSU1FRE9VVFwiLFxuICAgICAgXCJFUlJfTkVUV09SS1wiLFxuICAgICAgXCJFUlJfRlJfVE9PX01BTllfUkVESVJFQ1RTXCIsXG4gICAgICBcIkVSUl9ERVBSRUNBVEVEXCIsXG4gICAgICBcIkVSUl9CQURfUkVTUE9OU0VcIixcbiAgICAgIFwiRVJSX0JBRF9SRVFVRVNUXCIsXG4gICAgICBcIkVSUl9DQU5DRUxFRFwiXG4gICAgXS5mb3JFYWNoKGZ1bmN0aW9uKGNvZGUpIHtcbiAgICAgIGRlc2NyaXB0b3JzW2NvZGVdID0geyB2YWx1ZTogY29kZSB9O1xuICAgIH0pO1xuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0aWVzKEF4aW9zRXJyb3IsIGRlc2NyaXB0b3JzKTtcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkocHJvdG90eXBlLCBcImlzQXhpb3NFcnJvclwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuICAgIEF4aW9zRXJyb3IuZnJvbSA9IGZ1bmN0aW9uKGVycm9yLCBjb2RlLCBjb25maWcsIHJlcXVlc3QyLCByZXNwb25zZSwgY3VzdG9tUHJvcHMpIHtcbiAgICAgIHZhciBheGlvc0Vycm9yID0gT2JqZWN0LmNyZWF0ZShwcm90b3R5cGUpO1xuICAgICAgdXRpbHMudG9GbGF0T2JqZWN0KGVycm9yLCBheGlvc0Vycm9yLCBmdW5jdGlvbiBmaWx0ZXIob2JqKSB7XG4gICAgICAgIHJldHVybiBvYmogIT09IEVycm9yLnByb3RvdHlwZTtcbiAgICAgIH0pO1xuICAgICAgQXhpb3NFcnJvci5jYWxsKGF4aW9zRXJyb3IsIGVycm9yLm1lc3NhZ2UsIGNvZGUsIGNvbmZpZywgcmVxdWVzdDIsIHJlc3BvbnNlKTtcbiAgICAgIGF4aW9zRXJyb3IubmFtZSA9IGVycm9yLm5hbWU7XG4gICAgICBjdXN0b21Qcm9wcyAmJiBPYmplY3QuYXNzaWduKGF4aW9zRXJyb3IsIGN1c3RvbVByb3BzKTtcbiAgICAgIHJldHVybiBheGlvc0Vycm9yO1xuICAgIH07XG4gICAgbW9kdWxlLmV4cG9ydHMgPSBBeGlvc0Vycm9yO1xuICB9XG59KTtcblxuLy8gbm9kZV9tb2R1bGVzL2F4aW9zL2xpYi9kZWZhdWx0cy90cmFuc2l0aW9uYWwuanNcbnZhciByZXF1aXJlX3RyYW5zaXRpb25hbCA9IF9fY29tbW9uSlMoe1xuICBcIm5vZGVfbW9kdWxlcy9heGlvcy9saWIvZGVmYXVsdHMvdHJhbnNpdGlvbmFsLmpzXCIoZXhwb3J0cywgbW9kdWxlKSB7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG4gICAgbW9kdWxlLmV4cG9ydHMgPSB7XG4gICAgICBzaWxlbnRKU09OUGFyc2luZzogdHJ1ZSxcbiAgICAgIGZvcmNlZEpTT05QYXJzaW5nOiB0cnVlLFxuICAgICAgY2xhcmlmeVRpbWVvdXRFcnJvcjogZmFsc2VcbiAgICB9O1xuICB9XG59KTtcblxuLy8gbm9kZV9tb2R1bGVzL2F4aW9zL2xpYi9oZWxwZXJzL3RvRm9ybURhdGEuanNcbnZhciByZXF1aXJlX3RvRm9ybURhdGEgPSBfX2NvbW1vbkpTKHtcbiAgXCJub2RlX21vZHVsZXMvYXhpb3MvbGliL2hlbHBlcnMvdG9Gb3JtRGF0YS5qc1wiKGV4cG9ydHMsIG1vZHVsZSkge1xuICAgIFwidXNlIHN0cmljdFwiO1xuICAgIHZhciB1dGlscyA9IHJlcXVpcmVfdXRpbHMoKTtcbiAgICBmdW5jdGlvbiB0b0Zvcm1EYXRhKG9iaiwgZm9ybURhdGEpIHtcbiAgICAgIGZvcm1EYXRhID0gZm9ybURhdGEgfHwgbmV3IEZvcm1EYXRhKCk7XG4gICAgICB2YXIgc3RhY2sgPSBbXTtcbiAgICAgIGZ1bmN0aW9uIGNvbnZlcnRWYWx1ZSh2YWx1ZSkge1xuICAgICAgICBpZiAodmFsdWUgPT09IG51bGwpXG4gICAgICAgICAgcmV0dXJuIFwiXCI7XG4gICAgICAgIGlmICh1dGlscy5pc0RhdGUodmFsdWUpKSB7XG4gICAgICAgICAgcmV0dXJuIHZhbHVlLnRvSVNPU3RyaW5nKCk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHV0aWxzLmlzQXJyYXlCdWZmZXIodmFsdWUpIHx8IHV0aWxzLmlzVHlwZWRBcnJheSh2YWx1ZSkpIHtcbiAgICAgICAgICByZXR1cm4gdHlwZW9mIEJsb2IgPT09IFwiZnVuY3Rpb25cIiA/IG5ldyBCbG9iKFt2YWx1ZV0pIDogQnVmZmVyLmZyb20odmFsdWUpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB2YWx1ZTtcbiAgICAgIH1cbiAgICAgIGZ1bmN0aW9uIGJ1aWxkKGRhdGEsIHBhcmVudEtleSkge1xuICAgICAgICBpZiAodXRpbHMuaXNQbGFpbk9iamVjdChkYXRhKSB8fCB1dGlscy5pc0FycmF5KGRhdGEpKSB7XG4gICAgICAgICAgaWYgKHN0YWNrLmluZGV4T2YoZGF0YSkgIT09IC0xKSB7XG4gICAgICAgICAgICB0aHJvdyBFcnJvcihcIkNpcmN1bGFyIHJlZmVyZW5jZSBkZXRlY3RlZCBpbiBcIiArIHBhcmVudEtleSk7XG4gICAgICAgICAgfVxuICAgICAgICAgIHN0YWNrLnB1c2goZGF0YSk7XG4gICAgICAgICAgdXRpbHMuZm9yRWFjaChkYXRhLCBmdW5jdGlvbiBlYWNoKHZhbHVlLCBrZXkpIHtcbiAgICAgICAgICAgIGlmICh1dGlscy5pc1VuZGVmaW5lZCh2YWx1ZSkpXG4gICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIHZhciBmdWxsS2V5ID0gcGFyZW50S2V5ID8gcGFyZW50S2V5ICsgXCIuXCIgKyBrZXkgOiBrZXk7XG4gICAgICAgICAgICB2YXIgYXJyO1xuICAgICAgICAgICAgaWYgKHZhbHVlICYmICFwYXJlbnRLZXkgJiYgdHlwZW9mIHZhbHVlID09PSBcIm9iamVjdFwiKSB7XG4gICAgICAgICAgICAgIGlmICh1dGlscy5lbmRzV2l0aChrZXksIFwie31cIikpIHtcbiAgICAgICAgICAgICAgICB2YWx1ZSA9IEpTT04uc3RyaW5naWZ5KHZhbHVlKTtcbiAgICAgICAgICAgICAgfSBlbHNlIGlmICh1dGlscy5lbmRzV2l0aChrZXksIFwiW11cIikgJiYgKGFyciA9IHV0aWxzLnRvQXJyYXkodmFsdWUpKSkge1xuICAgICAgICAgICAgICAgIGFyci5mb3JFYWNoKGZ1bmN0aW9uKGVsKSB7XG4gICAgICAgICAgICAgICAgICAhdXRpbHMuaXNVbmRlZmluZWQoZWwpICYmIGZvcm1EYXRhLmFwcGVuZChmdWxsS2V5LCBjb252ZXJ0VmFsdWUoZWwpKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGJ1aWxkKHZhbHVlLCBmdWxsS2V5KTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgICBzdGFjay5wb3AoKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBmb3JtRGF0YS5hcHBlbmQocGFyZW50S2V5LCBjb252ZXJ0VmFsdWUoZGF0YSkpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBidWlsZChvYmopO1xuICAgICAgcmV0dXJuIGZvcm1EYXRhO1xuICAgIH1cbiAgICBtb2R1bGUuZXhwb3J0cyA9IHRvRm9ybURhdGE7XG4gIH1cbn0pO1xuXG4vLyBub2RlX21vZHVsZXMvYXhpb3MvbGliL2NvcmUvc2V0dGxlLmpzXG52YXIgcmVxdWlyZV9zZXR0bGUgPSBfX2NvbW1vbkpTKHtcbiAgXCJub2RlX21vZHVsZXMvYXhpb3MvbGliL2NvcmUvc2V0dGxlLmpzXCIoZXhwb3J0cywgbW9kdWxlKSB7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG4gICAgdmFyIEF4aW9zRXJyb3IgPSByZXF1aXJlX0F4aW9zRXJyb3IoKTtcbiAgICBtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIHNldHRsZShyZXNvbHZlLCByZWplY3QsIHJlc3BvbnNlKSB7XG4gICAgICB2YXIgdmFsaWRhdGVTdGF0dXMgPSByZXNwb25zZS5jb25maWcudmFsaWRhdGVTdGF0dXM7XG4gICAgICBpZiAoIXJlc3BvbnNlLnN0YXR1cyB8fCAhdmFsaWRhdGVTdGF0dXMgfHwgdmFsaWRhdGVTdGF0dXMocmVzcG9uc2Uuc3RhdHVzKSkge1xuICAgICAgICByZXNvbHZlKHJlc3BvbnNlKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJlamVjdChuZXcgQXhpb3NFcnJvcihcbiAgICAgICAgICBcIlJlcXVlc3QgZmFpbGVkIHdpdGggc3RhdHVzIGNvZGUgXCIgKyByZXNwb25zZS5zdGF0dXMsXG4gICAgICAgICAgW0F4aW9zRXJyb3IuRVJSX0JBRF9SRVFVRVNULCBBeGlvc0Vycm9yLkVSUl9CQURfUkVTUE9OU0VdW01hdGguZmxvb3IocmVzcG9uc2Uuc3RhdHVzIC8gMTAwKSAtIDRdLFxuICAgICAgICAgIHJlc3BvbnNlLmNvbmZpZyxcbiAgICAgICAgICByZXNwb25zZS5yZXF1ZXN0LFxuICAgICAgICAgIHJlc3BvbnNlXG4gICAgICAgICkpO1xuICAgICAgfVxuICAgIH07XG4gIH1cbn0pO1xuXG4vLyBub2RlX21vZHVsZXMvYXhpb3MvbGliL2hlbHBlcnMvY29va2llcy5qc1xudmFyIHJlcXVpcmVfY29va2llcyA9IF9fY29tbW9uSlMoe1xuICBcIm5vZGVfbW9kdWxlcy9heGlvcy9saWIvaGVscGVycy9jb29raWVzLmpzXCIoZXhwb3J0cywgbW9kdWxlKSB7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG4gICAgdmFyIHV0aWxzID0gcmVxdWlyZV91dGlscygpO1xuICAgIG1vZHVsZS5leHBvcnRzID0gdXRpbHMuaXNTdGFuZGFyZEJyb3dzZXJFbnYoKSA/IGZ1bmN0aW9uIHN0YW5kYXJkQnJvd3NlckVudigpIHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIHdyaXRlOiBmdW5jdGlvbiB3cml0ZShuYW1lLCB2YWx1ZSwgZXhwaXJlcywgcGF0aCwgZG9tYWluLCBzZWN1cmUpIHtcbiAgICAgICAgICB2YXIgY29va2llID0gW107XG4gICAgICAgICAgY29va2llLnB1c2gobmFtZSArIFwiPVwiICsgZW5jb2RlVVJJQ29tcG9uZW50KHZhbHVlKSk7XG4gICAgICAgICAgaWYgKHV0aWxzLmlzTnVtYmVyKGV4cGlyZXMpKSB7XG4gICAgICAgICAgICBjb29raWUucHVzaChcImV4cGlyZXM9XCIgKyBuZXcgRGF0ZShleHBpcmVzKS50b0dNVFN0cmluZygpKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKHV0aWxzLmlzU3RyaW5nKHBhdGgpKSB7XG4gICAgICAgICAgICBjb29raWUucHVzaChcInBhdGg9XCIgKyBwYXRoKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKHV0aWxzLmlzU3RyaW5nKGRvbWFpbikpIHtcbiAgICAgICAgICAgIGNvb2tpZS5wdXNoKFwiZG9tYWluPVwiICsgZG9tYWluKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKHNlY3VyZSA9PT0gdHJ1ZSkge1xuICAgICAgICAgICAgY29va2llLnB1c2goXCJzZWN1cmVcIik7XG4gICAgICAgICAgfVxuICAgICAgICAgIGRvY3VtZW50LmNvb2tpZSA9IGNvb2tpZS5qb2luKFwiOyBcIik7XG4gICAgICAgIH0sXG4gICAgICAgIHJlYWQ6IGZ1bmN0aW9uIHJlYWQobmFtZSkge1xuICAgICAgICAgIHZhciBtYXRjaCA9IGRvY3VtZW50LmNvb2tpZS5tYXRjaChuZXcgUmVnRXhwKFwiKF58O1xcXFxzKikoXCIgKyBuYW1lICsgXCIpPShbXjtdKilcIikpO1xuICAgICAgICAgIHJldHVybiBtYXRjaCA/IGRlY29kZVVSSUNvbXBvbmVudChtYXRjaFszXSkgOiBudWxsO1xuICAgICAgICB9LFxuICAgICAgICByZW1vdmU6IGZ1bmN0aW9uIHJlbW92ZShuYW1lKSB7XG4gICAgICAgICAgdGhpcy53cml0ZShuYW1lLCBcIlwiLCBEYXRlLm5vdygpIC0gODY0ZTUpO1xuICAgICAgICB9XG4gICAgICB9O1xuICAgIH0oKSA6IGZ1bmN0aW9uIG5vblN0YW5kYXJkQnJvd3NlckVudigpIHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIHdyaXRlOiBmdW5jdGlvbiB3cml0ZSgpIHtcbiAgICAgICAgfSxcbiAgICAgICAgcmVhZDogZnVuY3Rpb24gcmVhZCgpIHtcbiAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgfSxcbiAgICAgICAgcmVtb3ZlOiBmdW5jdGlvbiByZW1vdmUoKSB7XG4gICAgICAgIH1cbiAgICAgIH07XG4gICAgfSgpO1xuICB9XG59KTtcblxuLy8gbm9kZV9tb2R1bGVzL2F4aW9zL2xpYi9oZWxwZXJzL2lzQWJzb2x1dGVVUkwuanNcbnZhciByZXF1aXJlX2lzQWJzb2x1dGVVUkwgPSBfX2NvbW1vbkpTKHtcbiAgXCJub2RlX21vZHVsZXMvYXhpb3MvbGliL2hlbHBlcnMvaXNBYnNvbHV0ZVVSTC5qc1wiKGV4cG9ydHMsIG1vZHVsZSkge1xuICAgIFwidXNlIHN0cmljdFwiO1xuICAgIG1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gaXNBYnNvbHV0ZVVSTCh1cmwpIHtcbiAgICAgIHJldHVybiAvXihbYS16XVthLXpcXGQrXFwtLl0qOik/XFwvXFwvL2kudGVzdCh1cmwpO1xuICAgIH07XG4gIH1cbn0pO1xuXG4vLyBub2RlX21vZHVsZXMvYXhpb3MvbGliL2hlbHBlcnMvY29tYmluZVVSTHMuanNcbnZhciByZXF1aXJlX2NvbWJpbmVVUkxzID0gX19jb21tb25KUyh7XG4gIFwibm9kZV9tb2R1bGVzL2F4aW9zL2xpYi9oZWxwZXJzL2NvbWJpbmVVUkxzLmpzXCIoZXhwb3J0cywgbW9kdWxlKSB7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG4gICAgbW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBjb21iaW5lVVJMcyhiYXNlVVJMLCByZWxhdGl2ZVVSTCkge1xuICAgICAgcmV0dXJuIHJlbGF0aXZlVVJMID8gYmFzZVVSTC5yZXBsYWNlKC9cXC8rJC8sIFwiXCIpICsgXCIvXCIgKyByZWxhdGl2ZVVSTC5yZXBsYWNlKC9eXFwvKy8sIFwiXCIpIDogYmFzZVVSTDtcbiAgICB9O1xuICB9XG59KTtcblxuLy8gbm9kZV9tb2R1bGVzL2F4aW9zL2xpYi9jb3JlL2J1aWxkRnVsbFBhdGguanNcbnZhciByZXF1aXJlX2J1aWxkRnVsbFBhdGggPSBfX2NvbW1vbkpTKHtcbiAgXCJub2RlX21vZHVsZXMvYXhpb3MvbGliL2NvcmUvYnVpbGRGdWxsUGF0aC5qc1wiKGV4cG9ydHMsIG1vZHVsZSkge1xuICAgIFwidXNlIHN0cmljdFwiO1xuICAgIHZhciBpc0Fic29sdXRlVVJMID0gcmVxdWlyZV9pc0Fic29sdXRlVVJMKCk7XG4gICAgdmFyIGNvbWJpbmVVUkxzID0gcmVxdWlyZV9jb21iaW5lVVJMcygpO1xuICAgIG1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gYnVpbGRGdWxsUGF0aChiYXNlVVJMLCByZXF1ZXN0ZWRVUkwpIHtcbiAgICAgIGlmIChiYXNlVVJMICYmICFpc0Fic29sdXRlVVJMKHJlcXVlc3RlZFVSTCkpIHtcbiAgICAgICAgcmV0dXJuIGNvbWJpbmVVUkxzKGJhc2VVUkwsIHJlcXVlc3RlZFVSTCk7XG4gICAgICB9XG4gICAgICByZXR1cm4gcmVxdWVzdGVkVVJMO1xuICAgIH07XG4gIH1cbn0pO1xuXG4vLyBub2RlX21vZHVsZXMvYXhpb3MvbGliL2hlbHBlcnMvcGFyc2VIZWFkZXJzLmpzXG52YXIgcmVxdWlyZV9wYXJzZUhlYWRlcnMgPSBfX2NvbW1vbkpTKHtcbiAgXCJub2RlX21vZHVsZXMvYXhpb3MvbGliL2hlbHBlcnMvcGFyc2VIZWFkZXJzLmpzXCIoZXhwb3J0cywgbW9kdWxlKSB7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG4gICAgdmFyIHV0aWxzID0gcmVxdWlyZV91dGlscygpO1xuICAgIHZhciBpZ25vcmVEdXBsaWNhdGVPZiA9IFtcbiAgICAgIFwiYWdlXCIsXG4gICAgICBcImF1dGhvcml6YXRpb25cIixcbiAgICAgIFwiY29udGVudC1sZW5ndGhcIixcbiAgICAgIFwiY29udGVudC10eXBlXCIsXG4gICAgICBcImV0YWdcIixcbiAgICAgIFwiZXhwaXJlc1wiLFxuICAgICAgXCJmcm9tXCIsXG4gICAgICBcImhvc3RcIixcbiAgICAgIFwiaWYtbW9kaWZpZWQtc2luY2VcIixcbiAgICAgIFwiaWYtdW5tb2RpZmllZC1zaW5jZVwiLFxuICAgICAgXCJsYXN0LW1vZGlmaWVkXCIsXG4gICAgICBcImxvY2F0aW9uXCIsXG4gICAgICBcIm1heC1mb3J3YXJkc1wiLFxuICAgICAgXCJwcm94eS1hdXRob3JpemF0aW9uXCIsXG4gICAgICBcInJlZmVyZXJcIixcbiAgICAgIFwicmV0cnktYWZ0ZXJcIixcbiAgICAgIFwidXNlci1hZ2VudFwiXG4gICAgXTtcbiAgICBtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIHBhcnNlSGVhZGVycyhoZWFkZXJzKSB7XG4gICAgICB2YXIgcGFyc2VkID0ge307XG4gICAgICB2YXIga2V5O1xuICAgICAgdmFyIHZhbDtcbiAgICAgIHZhciBpMjtcbiAgICAgIGlmICghaGVhZGVycykge1xuICAgICAgICByZXR1cm4gcGFyc2VkO1xuICAgICAgfVxuICAgICAgdXRpbHMuZm9yRWFjaChoZWFkZXJzLnNwbGl0KFwiXFxuXCIpLCBmdW5jdGlvbiBwYXJzZXIobGluZSkge1xuICAgICAgICBpMiA9IGxpbmUuaW5kZXhPZihcIjpcIik7XG4gICAgICAgIGtleSA9IHV0aWxzLnRyaW0obGluZS5zdWJzdHIoMCwgaTIpKS50b0xvd2VyQ2FzZSgpO1xuICAgICAgICB2YWwgPSB1dGlscy50cmltKGxpbmUuc3Vic3RyKGkyICsgMSkpO1xuICAgICAgICBpZiAoa2V5KSB7XG4gICAgICAgICAgaWYgKHBhcnNlZFtrZXldICYmIGlnbm9yZUR1cGxpY2F0ZU9mLmluZGV4T2Yoa2V5KSA+PSAwKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmIChrZXkgPT09IFwic2V0LWNvb2tpZVwiKSB7XG4gICAgICAgICAgICBwYXJzZWRba2V5XSA9IChwYXJzZWRba2V5XSA/IHBhcnNlZFtrZXldIDogW10pLmNvbmNhdChbdmFsXSk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHBhcnNlZFtrZXldID0gcGFyc2VkW2tleV0gPyBwYXJzZWRba2V5XSArIFwiLCBcIiArIHZhbCA6IHZhbDtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgICAgcmV0dXJuIHBhcnNlZDtcbiAgICB9O1xuICB9XG59KTtcblxuLy8gbm9kZV9tb2R1bGVzL2F4aW9zL2xpYi9oZWxwZXJzL2lzVVJMU2FtZU9yaWdpbi5qc1xudmFyIHJlcXVpcmVfaXNVUkxTYW1lT3JpZ2luID0gX19jb21tb25KUyh7XG4gIFwibm9kZV9tb2R1bGVzL2F4aW9zL2xpYi9oZWxwZXJzL2lzVVJMU2FtZU9yaWdpbi5qc1wiKGV4cG9ydHMsIG1vZHVsZSkge1xuICAgIFwidXNlIHN0cmljdFwiO1xuICAgIHZhciB1dGlscyA9IHJlcXVpcmVfdXRpbHMoKTtcbiAgICBtb2R1bGUuZXhwb3J0cyA9IHV0aWxzLmlzU3RhbmRhcmRCcm93c2VyRW52KCkgPyBmdW5jdGlvbiBzdGFuZGFyZEJyb3dzZXJFbnYoKSB7XG4gICAgICB2YXIgbXNpZSA9IC8obXNpZXx0cmlkZW50KS9pLnRlc3QobmF2aWdhdG9yLnVzZXJBZ2VudCk7XG4gICAgICB2YXIgdXJsUGFyc2luZ05vZGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiYVwiKTtcbiAgICAgIHZhciBvcmlnaW5VUkw7XG4gICAgICBmdW5jdGlvbiByZXNvbHZlVVJMKHVybCkge1xuICAgICAgICB2YXIgaHJlZiA9IHVybDtcbiAgICAgICAgaWYgKG1zaWUpIHtcbiAgICAgICAgICB1cmxQYXJzaW5nTm9kZS5zZXRBdHRyaWJ1dGUoXCJocmVmXCIsIGhyZWYpO1xuICAgICAgICAgIGhyZWYgPSB1cmxQYXJzaW5nTm9kZS5ocmVmO1xuICAgICAgICB9XG4gICAgICAgIHVybFBhcnNpbmdOb2RlLnNldEF0dHJpYnV0ZShcImhyZWZcIiwgaHJlZik7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgaHJlZjogdXJsUGFyc2luZ05vZGUuaHJlZixcbiAgICAgICAgICBwcm90b2NvbDogdXJsUGFyc2luZ05vZGUucHJvdG9jb2wgPyB1cmxQYXJzaW5nTm9kZS5wcm90b2NvbC5yZXBsYWNlKC86JC8sIFwiXCIpIDogXCJcIixcbiAgICAgICAgICBob3N0OiB1cmxQYXJzaW5nTm9kZS5ob3N0LFxuICAgICAgICAgIHNlYXJjaDogdXJsUGFyc2luZ05vZGUuc2VhcmNoID8gdXJsUGFyc2luZ05vZGUuc2VhcmNoLnJlcGxhY2UoL15cXD8vLCBcIlwiKSA6IFwiXCIsXG4gICAgICAgICAgaGFzaDogdXJsUGFyc2luZ05vZGUuaGFzaCA/IHVybFBhcnNpbmdOb2RlLmhhc2gucmVwbGFjZSgvXiMvLCBcIlwiKSA6IFwiXCIsXG4gICAgICAgICAgaG9zdG5hbWU6IHVybFBhcnNpbmdOb2RlLmhvc3RuYW1lLFxuICAgICAgICAgIHBvcnQ6IHVybFBhcnNpbmdOb2RlLnBvcnQsXG4gICAgICAgICAgcGF0aG5hbWU6IHVybFBhcnNpbmdOb2RlLnBhdGhuYW1lLmNoYXJBdCgwKSA9PT0gXCIvXCIgPyB1cmxQYXJzaW5nTm9kZS5wYXRobmFtZSA6IFwiL1wiICsgdXJsUGFyc2luZ05vZGUucGF0aG5hbWVcbiAgICAgICAgfTtcbiAgICAgIH1cbiAgICAgIG9yaWdpblVSTCA9IHJlc29sdmVVUkwod2luZG93LmxvY2F0aW9uLmhyZWYpO1xuICAgICAgcmV0dXJuIGZ1bmN0aW9uIGlzVVJMU2FtZU9yaWdpbihyZXF1ZXN0VVJMKSB7XG4gICAgICAgIHZhciBwYXJzZWQgPSB1dGlscy5pc1N0cmluZyhyZXF1ZXN0VVJMKSA/IHJlc29sdmVVUkwocmVxdWVzdFVSTCkgOiByZXF1ZXN0VVJMO1xuICAgICAgICByZXR1cm4gcGFyc2VkLnByb3RvY29sID09PSBvcmlnaW5VUkwucHJvdG9jb2wgJiYgcGFyc2VkLmhvc3QgPT09IG9yaWdpblVSTC5ob3N0O1xuICAgICAgfTtcbiAgICB9KCkgOiBmdW5jdGlvbiBub25TdGFuZGFyZEJyb3dzZXJFbnYoKSB7XG4gICAgICByZXR1cm4gZnVuY3Rpb24gaXNVUkxTYW1lT3JpZ2luKCkge1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH07XG4gICAgfSgpO1xuICB9XG59KTtcblxuLy8gbm9kZV9tb2R1bGVzL2F4aW9zL2xpYi9jYW5jZWwvQ2FuY2VsZWRFcnJvci5qc1xudmFyIHJlcXVpcmVfQ2FuY2VsZWRFcnJvciA9IF9fY29tbW9uSlMoe1xuICBcIm5vZGVfbW9kdWxlcy9heGlvcy9saWIvY2FuY2VsL0NhbmNlbGVkRXJyb3IuanNcIihleHBvcnRzLCBtb2R1bGUpIHtcbiAgICBcInVzZSBzdHJpY3RcIjtcbiAgICB2YXIgQXhpb3NFcnJvciA9IHJlcXVpcmVfQXhpb3NFcnJvcigpO1xuICAgIHZhciB1dGlscyA9IHJlcXVpcmVfdXRpbHMoKTtcbiAgICBmdW5jdGlvbiBDYW5jZWxlZEVycm9yKG1lc3NhZ2UpIHtcbiAgICAgIEF4aW9zRXJyb3IuY2FsbCh0aGlzLCBtZXNzYWdlID09IG51bGwgPyBcImNhbmNlbGVkXCIgOiBtZXNzYWdlLCBBeGlvc0Vycm9yLkVSUl9DQU5DRUxFRCk7XG4gICAgICB0aGlzLm5hbWUgPSBcIkNhbmNlbGVkRXJyb3JcIjtcbiAgICB9XG4gICAgdXRpbHMuaW5oZXJpdHMoQ2FuY2VsZWRFcnJvciwgQXhpb3NFcnJvciwge1xuICAgICAgX19DQU5DRUxfXzogdHJ1ZVxuICAgIH0pO1xuICAgIG1vZHVsZS5leHBvcnRzID0gQ2FuY2VsZWRFcnJvcjtcbiAgfVxufSk7XG5cbi8vIG5vZGVfbW9kdWxlcy9heGlvcy9saWIvaGVscGVycy9wYXJzZVByb3RvY29sLmpzXG52YXIgcmVxdWlyZV9wYXJzZVByb3RvY29sID0gX19jb21tb25KUyh7XG4gIFwibm9kZV9tb2R1bGVzL2F4aW9zL2xpYi9oZWxwZXJzL3BhcnNlUHJvdG9jb2wuanNcIihleHBvcnRzLCBtb2R1bGUpIHtcbiAgICBcInVzZSBzdHJpY3RcIjtcbiAgICBtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIHBhcnNlUHJvdG9jb2wodXJsKSB7XG4gICAgICB2YXIgbWF0Y2ggPSAvXihbLStcXHddezEsMjV9KSg6P1xcL1xcL3w6KS8uZXhlYyh1cmwpO1xuICAgICAgcmV0dXJuIG1hdGNoICYmIG1hdGNoWzFdIHx8IFwiXCI7XG4gICAgfTtcbiAgfVxufSk7XG5cbi8vIG5vZGVfbW9kdWxlcy9heGlvcy9saWIvYWRhcHRlcnMveGhyLmpzXG52YXIgcmVxdWlyZV94aHIgPSBfX2NvbW1vbkpTKHtcbiAgXCJub2RlX21vZHVsZXMvYXhpb3MvbGliL2FkYXB0ZXJzL3hoci5qc1wiKGV4cG9ydHMsIG1vZHVsZSkge1xuICAgIFwidXNlIHN0cmljdFwiO1xuICAgIHZhciB1dGlscyA9IHJlcXVpcmVfdXRpbHMoKTtcbiAgICB2YXIgc2V0dGxlID0gcmVxdWlyZV9zZXR0bGUoKTtcbiAgICB2YXIgY29va2llcyA9IHJlcXVpcmVfY29va2llcygpO1xuICAgIHZhciBidWlsZFVSTCA9IHJlcXVpcmVfYnVpbGRVUkwoKTtcbiAgICB2YXIgYnVpbGRGdWxsUGF0aCA9IHJlcXVpcmVfYnVpbGRGdWxsUGF0aCgpO1xuICAgIHZhciBwYXJzZUhlYWRlcnMgPSByZXF1aXJlX3BhcnNlSGVhZGVycygpO1xuICAgIHZhciBpc1VSTFNhbWVPcmlnaW4gPSByZXF1aXJlX2lzVVJMU2FtZU9yaWdpbigpO1xuICAgIHZhciB0cmFuc2l0aW9uYWxEZWZhdWx0cyA9IHJlcXVpcmVfdHJhbnNpdGlvbmFsKCk7XG4gICAgdmFyIEF4aW9zRXJyb3IgPSByZXF1aXJlX0F4aW9zRXJyb3IoKTtcbiAgICB2YXIgQ2FuY2VsZWRFcnJvciA9IHJlcXVpcmVfQ2FuY2VsZWRFcnJvcigpO1xuICAgIHZhciBwYXJzZVByb3RvY29sID0gcmVxdWlyZV9wYXJzZVByb3RvY29sKCk7XG4gICAgbW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiB4aHJBZGFwdGVyKGNvbmZpZykge1xuICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uIGRpc3BhdGNoWGhyUmVxdWVzdChyZXNvbHZlLCByZWplY3QpIHtcbiAgICAgICAgdmFyIHJlcXVlc3REYXRhID0gY29uZmlnLmRhdGE7XG4gICAgICAgIHZhciByZXF1ZXN0SGVhZGVycyA9IGNvbmZpZy5oZWFkZXJzO1xuICAgICAgICB2YXIgcmVzcG9uc2VUeXBlID0gY29uZmlnLnJlc3BvbnNlVHlwZTtcbiAgICAgICAgdmFyIG9uQ2FuY2VsZWQ7XG4gICAgICAgIGZ1bmN0aW9uIGRvbmUoKSB7XG4gICAgICAgICAgaWYgKGNvbmZpZy5jYW5jZWxUb2tlbikge1xuICAgICAgICAgICAgY29uZmlnLmNhbmNlbFRva2VuLnVuc3Vic2NyaWJlKG9uQ2FuY2VsZWQpO1xuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAoY29uZmlnLnNpZ25hbCkge1xuICAgICAgICAgICAgY29uZmlnLnNpZ25hbC5yZW1vdmVFdmVudExpc3RlbmVyKFwiYWJvcnRcIiwgb25DYW5jZWxlZCk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGlmICh1dGlscy5pc0Zvcm1EYXRhKHJlcXVlc3REYXRhKSAmJiB1dGlscy5pc1N0YW5kYXJkQnJvd3NlckVudigpKSB7XG4gICAgICAgICAgZGVsZXRlIHJlcXVlc3RIZWFkZXJzW1wiQ29udGVudC1UeXBlXCJdO1xuICAgICAgICB9XG4gICAgICAgIHZhciByZXF1ZXN0MiA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpO1xuICAgICAgICBpZiAoY29uZmlnLmF1dGgpIHtcbiAgICAgICAgICB2YXIgdXNlcm5hbWUgPSBjb25maWcuYXV0aC51c2VybmFtZSB8fCBcIlwiO1xuICAgICAgICAgIHZhciBwYXNzd29yZCA9IGNvbmZpZy5hdXRoLnBhc3N3b3JkID8gdW5lc2NhcGUoZW5jb2RlVVJJQ29tcG9uZW50KGNvbmZpZy5hdXRoLnBhc3N3b3JkKSkgOiBcIlwiO1xuICAgICAgICAgIHJlcXVlc3RIZWFkZXJzLkF1dGhvcml6YXRpb24gPSBcIkJhc2ljIFwiICsgYnRvYSh1c2VybmFtZSArIFwiOlwiICsgcGFzc3dvcmQpO1xuICAgICAgICB9XG4gICAgICAgIHZhciBmdWxsUGF0aCA9IGJ1aWxkRnVsbFBhdGgoY29uZmlnLmJhc2VVUkwsIGNvbmZpZy51cmwpO1xuICAgICAgICByZXF1ZXN0Mi5vcGVuKGNvbmZpZy5tZXRob2QudG9VcHBlckNhc2UoKSwgYnVpbGRVUkwoZnVsbFBhdGgsIGNvbmZpZy5wYXJhbXMsIGNvbmZpZy5wYXJhbXNTZXJpYWxpemVyKSwgdHJ1ZSk7XG4gICAgICAgIHJlcXVlc3QyLnRpbWVvdXQgPSBjb25maWcudGltZW91dDtcbiAgICAgICAgZnVuY3Rpb24gb25sb2FkZW5kKCkge1xuICAgICAgICAgIGlmICghcmVxdWVzdDIpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICB9XG4gICAgICAgICAgdmFyIHJlc3BvbnNlSGVhZGVycyA9IFwiZ2V0QWxsUmVzcG9uc2VIZWFkZXJzXCIgaW4gcmVxdWVzdDIgPyBwYXJzZUhlYWRlcnMocmVxdWVzdDIuZ2V0QWxsUmVzcG9uc2VIZWFkZXJzKCkpIDogbnVsbDtcbiAgICAgICAgICB2YXIgcmVzcG9uc2VEYXRhID0gIXJlc3BvbnNlVHlwZSB8fCByZXNwb25zZVR5cGUgPT09IFwidGV4dFwiIHx8IHJlc3BvbnNlVHlwZSA9PT0gXCJqc29uXCIgPyByZXF1ZXN0Mi5yZXNwb25zZVRleHQgOiByZXF1ZXN0Mi5yZXNwb25zZTtcbiAgICAgICAgICB2YXIgcmVzcG9uc2UgPSB7XG4gICAgICAgICAgICBkYXRhOiByZXNwb25zZURhdGEsXG4gICAgICAgICAgICBzdGF0dXM6IHJlcXVlc3QyLnN0YXR1cyxcbiAgICAgICAgICAgIHN0YXR1c1RleHQ6IHJlcXVlc3QyLnN0YXR1c1RleHQsXG4gICAgICAgICAgICBoZWFkZXJzOiByZXNwb25zZUhlYWRlcnMsXG4gICAgICAgICAgICBjb25maWcsXG4gICAgICAgICAgICByZXF1ZXN0OiByZXF1ZXN0MlxuICAgICAgICAgIH07XG4gICAgICAgICAgc2V0dGxlKGZ1bmN0aW9uIF9yZXNvbHZlKHZhbHVlKSB7XG4gICAgICAgICAgICByZXNvbHZlKHZhbHVlKTtcbiAgICAgICAgICAgIGRvbmUoKTtcbiAgICAgICAgICB9LCBmdW5jdGlvbiBfcmVqZWN0KGVycikge1xuICAgICAgICAgICAgcmVqZWN0KGVycik7XG4gICAgICAgICAgICBkb25lKCk7XG4gICAgICAgICAgfSwgcmVzcG9uc2UpO1xuICAgICAgICAgIHJlcXVlc3QyID0gbnVsbDtcbiAgICAgICAgfVxuICAgICAgICBpZiAoXCJvbmxvYWRlbmRcIiBpbiByZXF1ZXN0Mikge1xuICAgICAgICAgIHJlcXVlc3QyLm9ubG9hZGVuZCA9IG9ubG9hZGVuZDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZXF1ZXN0Mi5vbnJlYWR5c3RhdGVjaGFuZ2UgPSBmdW5jdGlvbiBoYW5kbGVMb2FkKCkge1xuICAgICAgICAgICAgaWYgKCFyZXF1ZXN0MiB8fCByZXF1ZXN0Mi5yZWFkeVN0YXRlICE9PSA0KSB7XG4gICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChyZXF1ZXN0Mi5zdGF0dXMgPT09IDAgJiYgIShyZXF1ZXN0Mi5yZXNwb25zZVVSTCAmJiByZXF1ZXN0Mi5yZXNwb25zZVVSTC5pbmRleE9mKFwiZmlsZTpcIikgPT09IDApKSB7XG4gICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHNldFRpbWVvdXQob25sb2FkZW5kKTtcbiAgICAgICAgICB9O1xuICAgICAgICB9XG4gICAgICAgIHJlcXVlc3QyLm9uYWJvcnQgPSBmdW5jdGlvbiBoYW5kbGVBYm9ydCgpIHtcbiAgICAgICAgICBpZiAoIXJlcXVlc3QyKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgfVxuICAgICAgICAgIHJlamVjdChuZXcgQXhpb3NFcnJvcihcIlJlcXVlc3QgYWJvcnRlZFwiLCBBeGlvc0Vycm9yLkVDT05OQUJPUlRFRCwgY29uZmlnLCByZXF1ZXN0MikpO1xuICAgICAgICAgIHJlcXVlc3QyID0gbnVsbDtcbiAgICAgICAgfTtcbiAgICAgICAgcmVxdWVzdDIub25lcnJvciA9IGZ1bmN0aW9uIGhhbmRsZUVycm9yKCkge1xuICAgICAgICAgIHJlamVjdChuZXcgQXhpb3NFcnJvcihcIk5ldHdvcmsgRXJyb3JcIiwgQXhpb3NFcnJvci5FUlJfTkVUV09SSywgY29uZmlnLCByZXF1ZXN0MiwgcmVxdWVzdDIpKTtcbiAgICAgICAgICByZXF1ZXN0MiA9IG51bGw7XG4gICAgICAgIH07XG4gICAgICAgIHJlcXVlc3QyLm9udGltZW91dCA9IGZ1bmN0aW9uIGhhbmRsZVRpbWVvdXQoKSB7XG4gICAgICAgICAgdmFyIHRpbWVvdXRFcnJvck1lc3NhZ2UgPSBjb25maWcudGltZW91dCA/IFwidGltZW91dCBvZiBcIiArIGNvbmZpZy50aW1lb3V0ICsgXCJtcyBleGNlZWRlZFwiIDogXCJ0aW1lb3V0IGV4Y2VlZGVkXCI7XG4gICAgICAgICAgdmFyIHRyYW5zaXRpb25hbCA9IGNvbmZpZy50cmFuc2l0aW9uYWwgfHwgdHJhbnNpdGlvbmFsRGVmYXVsdHM7XG4gICAgICAgICAgaWYgKGNvbmZpZy50aW1lb3V0RXJyb3JNZXNzYWdlKSB7XG4gICAgICAgICAgICB0aW1lb3V0RXJyb3JNZXNzYWdlID0gY29uZmlnLnRpbWVvdXRFcnJvck1lc3NhZ2U7XG4gICAgICAgICAgfVxuICAgICAgICAgIHJlamVjdChuZXcgQXhpb3NFcnJvcihcbiAgICAgICAgICAgIHRpbWVvdXRFcnJvck1lc3NhZ2UsXG4gICAgICAgICAgICB0cmFuc2l0aW9uYWwuY2xhcmlmeVRpbWVvdXRFcnJvciA/IEF4aW9zRXJyb3IuRVRJTUVET1VUIDogQXhpb3NFcnJvci5FQ09OTkFCT1JURUQsXG4gICAgICAgICAgICBjb25maWcsXG4gICAgICAgICAgICByZXF1ZXN0MlxuICAgICAgICAgICkpO1xuICAgICAgICAgIHJlcXVlc3QyID0gbnVsbDtcbiAgICAgICAgfTtcbiAgICAgICAgaWYgKHV0aWxzLmlzU3RhbmRhcmRCcm93c2VyRW52KCkpIHtcbiAgICAgICAgICB2YXIgeHNyZlZhbHVlID0gKGNvbmZpZy53aXRoQ3JlZGVudGlhbHMgfHwgaXNVUkxTYW1lT3JpZ2luKGZ1bGxQYXRoKSkgJiYgY29uZmlnLnhzcmZDb29raWVOYW1lID8gY29va2llcy5yZWFkKGNvbmZpZy54c3JmQ29va2llTmFtZSkgOiB2b2lkIDA7XG4gICAgICAgICAgaWYgKHhzcmZWYWx1ZSkge1xuICAgICAgICAgICAgcmVxdWVzdEhlYWRlcnNbY29uZmlnLnhzcmZIZWFkZXJOYW1lXSA9IHhzcmZWYWx1ZTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgaWYgKFwic2V0UmVxdWVzdEhlYWRlclwiIGluIHJlcXVlc3QyKSB7XG4gICAgICAgICAgdXRpbHMuZm9yRWFjaChyZXF1ZXN0SGVhZGVycywgZnVuY3Rpb24gc2V0UmVxdWVzdEhlYWRlcih2YWwsIGtleSkge1xuICAgICAgICAgICAgaWYgKHR5cGVvZiByZXF1ZXN0RGF0YSA9PT0gXCJ1bmRlZmluZWRcIiAmJiBrZXkudG9Mb3dlckNhc2UoKSA9PT0gXCJjb250ZW50LXR5cGVcIikge1xuICAgICAgICAgICAgICBkZWxldGUgcmVxdWVzdEhlYWRlcnNba2V5XTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIHJlcXVlc3QyLnNldFJlcXVlc3RIZWFkZXIoa2V5LCB2YWwpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICAgIGlmICghdXRpbHMuaXNVbmRlZmluZWQoY29uZmlnLndpdGhDcmVkZW50aWFscykpIHtcbiAgICAgICAgICByZXF1ZXN0Mi53aXRoQ3JlZGVudGlhbHMgPSAhIWNvbmZpZy53aXRoQ3JlZGVudGlhbHM7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHJlc3BvbnNlVHlwZSAmJiByZXNwb25zZVR5cGUgIT09IFwianNvblwiKSB7XG4gICAgICAgICAgcmVxdWVzdDIucmVzcG9uc2VUeXBlID0gY29uZmlnLnJlc3BvbnNlVHlwZTtcbiAgICAgICAgfVxuICAgICAgICBpZiAodHlwZW9mIGNvbmZpZy5vbkRvd25sb2FkUHJvZ3Jlc3MgPT09IFwiZnVuY3Rpb25cIikge1xuICAgICAgICAgIHJlcXVlc3QyLmFkZEV2ZW50TGlzdGVuZXIoXCJwcm9ncmVzc1wiLCBjb25maWcub25Eb3dubG9hZFByb2dyZXNzKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAodHlwZW9mIGNvbmZpZy5vblVwbG9hZFByb2dyZXNzID09PSBcImZ1bmN0aW9uXCIgJiYgcmVxdWVzdDIudXBsb2FkKSB7XG4gICAgICAgICAgcmVxdWVzdDIudXBsb2FkLmFkZEV2ZW50TGlzdGVuZXIoXCJwcm9ncmVzc1wiLCBjb25maWcub25VcGxvYWRQcm9ncmVzcyk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGNvbmZpZy5jYW5jZWxUb2tlbiB8fCBjb25maWcuc2lnbmFsKSB7XG4gICAgICAgICAgb25DYW5jZWxlZCA9IGZ1bmN0aW9uKGNhbmNlbCkge1xuICAgICAgICAgICAgaWYgKCFyZXF1ZXN0Mikge1xuICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZWplY3QoIWNhbmNlbCB8fCBjYW5jZWwgJiYgY2FuY2VsLnR5cGUgPyBuZXcgQ2FuY2VsZWRFcnJvcigpIDogY2FuY2VsKTtcbiAgICAgICAgICAgIHJlcXVlc3QyLmFib3J0KCk7XG4gICAgICAgICAgICByZXF1ZXN0MiA9IG51bGw7XG4gICAgICAgICAgfTtcbiAgICAgICAgICBjb25maWcuY2FuY2VsVG9rZW4gJiYgY29uZmlnLmNhbmNlbFRva2VuLnN1YnNjcmliZShvbkNhbmNlbGVkKTtcbiAgICAgICAgICBpZiAoY29uZmlnLnNpZ25hbCkge1xuICAgICAgICAgICAgY29uZmlnLnNpZ25hbC5hYm9ydGVkID8gb25DYW5jZWxlZCgpIDogY29uZmlnLnNpZ25hbC5hZGRFdmVudExpc3RlbmVyKFwiYWJvcnRcIiwgb25DYW5jZWxlZCk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGlmICghcmVxdWVzdERhdGEpIHtcbiAgICAgICAgICByZXF1ZXN0RGF0YSA9IG51bGw7XG4gICAgICAgIH1cbiAgICAgICAgdmFyIHByb3RvY29sID0gcGFyc2VQcm90b2NvbChmdWxsUGF0aCk7XG4gICAgICAgIGlmIChwcm90b2NvbCAmJiBbXCJodHRwXCIsIFwiaHR0cHNcIiwgXCJmaWxlXCJdLmluZGV4T2YocHJvdG9jb2wpID09PSAtMSkge1xuICAgICAgICAgIHJlamVjdChuZXcgQXhpb3NFcnJvcihcIlVuc3VwcG9ydGVkIHByb3RvY29sIFwiICsgcHJvdG9jb2wgKyBcIjpcIiwgQXhpb3NFcnJvci5FUlJfQkFEX1JFUVVFU1QsIGNvbmZpZykpO1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICByZXF1ZXN0Mi5zZW5kKHJlcXVlc3REYXRhKTtcbiAgICAgIH0pO1xuICAgIH07XG4gIH1cbn0pO1xuXG4vLyBub2RlX21vZHVsZXMvYXhpb3MvbGliL2hlbHBlcnMvbnVsbC5qc1xudmFyIHJlcXVpcmVfbnVsbCA9IF9fY29tbW9uSlMoe1xuICBcIm5vZGVfbW9kdWxlcy9heGlvcy9saWIvaGVscGVycy9udWxsLmpzXCIoZXhwb3J0cywgbW9kdWxlKSB7XG4gICAgbW9kdWxlLmV4cG9ydHMgPSBudWxsO1xuICB9XG59KTtcblxuLy8gbm9kZV9tb2R1bGVzL2F4aW9zL2xpYi9kZWZhdWx0cy9pbmRleC5qc1xudmFyIHJlcXVpcmVfZGVmYXVsdHMgPSBfX2NvbW1vbkpTKHtcbiAgXCJub2RlX21vZHVsZXMvYXhpb3MvbGliL2RlZmF1bHRzL2luZGV4LmpzXCIoZXhwb3J0cywgbW9kdWxlKSB7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG4gICAgdmFyIHV0aWxzID0gcmVxdWlyZV91dGlscygpO1xuICAgIHZhciBub3JtYWxpemVIZWFkZXJOYW1lID0gcmVxdWlyZV9ub3JtYWxpemVIZWFkZXJOYW1lKCk7XG4gICAgdmFyIEF4aW9zRXJyb3IgPSByZXF1aXJlX0F4aW9zRXJyb3IoKTtcbiAgICB2YXIgdHJhbnNpdGlvbmFsRGVmYXVsdHMgPSByZXF1aXJlX3RyYW5zaXRpb25hbCgpO1xuICAgIHZhciB0b0Zvcm1EYXRhID0gcmVxdWlyZV90b0Zvcm1EYXRhKCk7XG4gICAgdmFyIERFRkFVTFRfQ09OVEVOVF9UWVBFID0ge1xuICAgICAgXCJDb250ZW50LVR5cGVcIjogXCJhcHBsaWNhdGlvbi94LXd3dy1mb3JtLXVybGVuY29kZWRcIlxuICAgIH07XG4gICAgZnVuY3Rpb24gc2V0Q29udGVudFR5cGVJZlVuc2V0KGhlYWRlcnMsIHZhbHVlKSB7XG4gICAgICBpZiAoIXV0aWxzLmlzVW5kZWZpbmVkKGhlYWRlcnMpICYmIHV0aWxzLmlzVW5kZWZpbmVkKGhlYWRlcnNbXCJDb250ZW50LVR5cGVcIl0pKSB7XG4gICAgICAgIGhlYWRlcnNbXCJDb250ZW50LVR5cGVcIl0gPSB2YWx1ZTtcbiAgICAgIH1cbiAgICB9XG4gICAgZnVuY3Rpb24gZ2V0RGVmYXVsdEFkYXB0ZXIoKSB7XG4gICAgICB2YXIgYWRhcHRlcjtcbiAgICAgIGlmICh0eXBlb2YgWE1MSHR0cFJlcXVlc3QgIT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICAgICAgYWRhcHRlciA9IHJlcXVpcmVfeGhyKCk7XG4gICAgICB9IGVsc2UgaWYgKHR5cGVvZiBwcm9jZXNzICE9PSBcInVuZGVmaW5lZFwiICYmIE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChwcm9jZXNzKSA9PT0gXCJbb2JqZWN0IHByb2Nlc3NdXCIpIHtcbiAgICAgICAgYWRhcHRlciA9IHJlcXVpcmVfeGhyKCk7XG4gICAgICB9XG4gICAgICByZXR1cm4gYWRhcHRlcjtcbiAgICB9XG4gICAgZnVuY3Rpb24gc3RyaW5naWZ5U2FmZWx5KHJhd1ZhbHVlLCBwYXJzZXIsIGVuY29kZXIpIHtcbiAgICAgIGlmICh1dGlscy5pc1N0cmluZyhyYXdWYWx1ZSkpIHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAocGFyc2VyIHx8IEpTT04ucGFyc2UpKHJhd1ZhbHVlKTtcbiAgICAgICAgICByZXR1cm4gdXRpbHMudHJpbShyYXdWYWx1ZSk7XG4gICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICBpZiAoZS5uYW1lICE9PSBcIlN5bnRheEVycm9yXCIpIHtcbiAgICAgICAgICAgIHRocm93IGU7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgICByZXR1cm4gKGVuY29kZXIgfHwgSlNPTi5zdHJpbmdpZnkpKHJhd1ZhbHVlKTtcbiAgICB9XG4gICAgdmFyIGRlZmF1bHRzID0ge1xuICAgICAgdHJhbnNpdGlvbmFsOiB0cmFuc2l0aW9uYWxEZWZhdWx0cyxcbiAgICAgIGFkYXB0ZXI6IGdldERlZmF1bHRBZGFwdGVyKCksXG4gICAgICB0cmFuc2Zvcm1SZXF1ZXN0OiBbZnVuY3Rpb24gdHJhbnNmb3JtUmVxdWVzdChkYXRhLCBoZWFkZXJzKSB7XG4gICAgICAgIG5vcm1hbGl6ZUhlYWRlck5hbWUoaGVhZGVycywgXCJBY2NlcHRcIik7XG4gICAgICAgIG5vcm1hbGl6ZUhlYWRlck5hbWUoaGVhZGVycywgXCJDb250ZW50LVR5cGVcIik7XG4gICAgICAgIGlmICh1dGlscy5pc0Zvcm1EYXRhKGRhdGEpIHx8IHV0aWxzLmlzQXJyYXlCdWZmZXIoZGF0YSkgfHwgdXRpbHMuaXNCdWZmZXIoZGF0YSkgfHwgdXRpbHMuaXNTdHJlYW0oZGF0YSkgfHwgdXRpbHMuaXNGaWxlKGRhdGEpIHx8IHV0aWxzLmlzQmxvYihkYXRhKSkge1xuICAgICAgICAgIHJldHVybiBkYXRhO1xuICAgICAgICB9XG4gICAgICAgIGlmICh1dGlscy5pc0FycmF5QnVmZmVyVmlldyhkYXRhKSkge1xuICAgICAgICAgIHJldHVybiBkYXRhLmJ1ZmZlcjtcbiAgICAgICAgfVxuICAgICAgICBpZiAodXRpbHMuaXNVUkxTZWFyY2hQYXJhbXMoZGF0YSkpIHtcbiAgICAgICAgICBzZXRDb250ZW50VHlwZUlmVW5zZXQoaGVhZGVycywgXCJhcHBsaWNhdGlvbi94LXd3dy1mb3JtLXVybGVuY29kZWQ7Y2hhcnNldD11dGYtOFwiKTtcbiAgICAgICAgICByZXR1cm4gZGF0YS50b1N0cmluZygpO1xuICAgICAgICB9XG4gICAgICAgIHZhciBpc09iamVjdFBheWxvYWQgPSB1dGlscy5pc09iamVjdChkYXRhKTtcbiAgICAgICAgdmFyIGNvbnRlbnRUeXBlID0gaGVhZGVycyAmJiBoZWFkZXJzW1wiQ29udGVudC1UeXBlXCJdO1xuICAgICAgICB2YXIgaXNGaWxlTGlzdDtcbiAgICAgICAgaWYgKChpc0ZpbGVMaXN0ID0gdXRpbHMuaXNGaWxlTGlzdChkYXRhKSkgfHwgaXNPYmplY3RQYXlsb2FkICYmIGNvbnRlbnRUeXBlID09PSBcIm11bHRpcGFydC9mb3JtLWRhdGFcIikge1xuICAgICAgICAgIHZhciBfRm9ybURhdGEgPSB0aGlzLmVudiAmJiB0aGlzLmVudi5Gb3JtRGF0YTtcbiAgICAgICAgICByZXR1cm4gdG9Gb3JtRGF0YShpc0ZpbGVMaXN0ID8geyBcImZpbGVzW11cIjogZGF0YSB9IDogZGF0YSwgX0Zvcm1EYXRhICYmIG5ldyBfRm9ybURhdGEoKSk7XG4gICAgICAgIH0gZWxzZSBpZiAoaXNPYmplY3RQYXlsb2FkIHx8IGNvbnRlbnRUeXBlID09PSBcImFwcGxpY2F0aW9uL2pzb25cIikge1xuICAgICAgICAgIHNldENvbnRlbnRUeXBlSWZVbnNldChoZWFkZXJzLCBcImFwcGxpY2F0aW9uL2pzb25cIik7XG4gICAgICAgICAgcmV0dXJuIHN0cmluZ2lmeVNhZmVseShkYXRhKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZGF0YTtcbiAgICAgIH1dLFxuICAgICAgdHJhbnNmb3JtUmVzcG9uc2U6IFtmdW5jdGlvbiB0cmFuc2Zvcm1SZXNwb25zZShkYXRhKSB7XG4gICAgICAgIHZhciB0cmFuc2l0aW9uYWwgPSB0aGlzLnRyYW5zaXRpb25hbCB8fCBkZWZhdWx0cy50cmFuc2l0aW9uYWw7XG4gICAgICAgIHZhciBzaWxlbnRKU09OUGFyc2luZyA9IHRyYW5zaXRpb25hbCAmJiB0cmFuc2l0aW9uYWwuc2lsZW50SlNPTlBhcnNpbmc7XG4gICAgICAgIHZhciBmb3JjZWRKU09OUGFyc2luZyA9IHRyYW5zaXRpb25hbCAmJiB0cmFuc2l0aW9uYWwuZm9yY2VkSlNPTlBhcnNpbmc7XG4gICAgICAgIHZhciBzdHJpY3RKU09OUGFyc2luZyA9ICFzaWxlbnRKU09OUGFyc2luZyAmJiB0aGlzLnJlc3BvbnNlVHlwZSA9PT0gXCJqc29uXCI7XG4gICAgICAgIGlmIChzdHJpY3RKU09OUGFyc2luZyB8fCBmb3JjZWRKU09OUGFyc2luZyAmJiB1dGlscy5pc1N0cmluZyhkYXRhKSAmJiBkYXRhLmxlbmd0aCkge1xuICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICByZXR1cm4gSlNPTi5wYXJzZShkYXRhKTtcbiAgICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgICBpZiAoc3RyaWN0SlNPTlBhcnNpbmcpIHtcbiAgICAgICAgICAgICAgaWYgKGUubmFtZSA9PT0gXCJTeW50YXhFcnJvclwiKSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgQXhpb3NFcnJvci5mcm9tKGUsIEF4aW9zRXJyb3IuRVJSX0JBRF9SRVNQT05TRSwgdGhpcywgbnVsbCwgdGhpcy5yZXNwb25zZSk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgdGhyb3cgZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGRhdGE7XG4gICAgICB9XSxcbiAgICAgIHRpbWVvdXQ6IDAsXG4gICAgICB4c3JmQ29va2llTmFtZTogXCJYU1JGLVRPS0VOXCIsXG4gICAgICB4c3JmSGVhZGVyTmFtZTogXCJYLVhTUkYtVE9LRU5cIixcbiAgICAgIG1heENvbnRlbnRMZW5ndGg6IC0xLFxuICAgICAgbWF4Qm9keUxlbmd0aDogLTEsXG4gICAgICBlbnY6IHtcbiAgICAgICAgRm9ybURhdGE6IHJlcXVpcmVfbnVsbCgpXG4gICAgICB9LFxuICAgICAgdmFsaWRhdGVTdGF0dXM6IGZ1bmN0aW9uIHZhbGlkYXRlU3RhdHVzKHN0YXR1cykge1xuICAgICAgICByZXR1cm4gc3RhdHVzID49IDIwMCAmJiBzdGF0dXMgPCAzMDA7XG4gICAgICB9LFxuICAgICAgaGVhZGVyczoge1xuICAgICAgICBjb21tb246IHtcbiAgICAgICAgICBcIkFjY2VwdFwiOiBcImFwcGxpY2F0aW9uL2pzb24sIHRleHQvcGxhaW4sICovKlwiXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9O1xuICAgIHV0aWxzLmZvckVhY2goW1wiZGVsZXRlXCIsIFwiZ2V0XCIsIFwiaGVhZFwiXSwgZnVuY3Rpb24gZm9yRWFjaE1ldGhvZE5vRGF0YShtZXRob2QpIHtcbiAgICAgIGRlZmF1bHRzLmhlYWRlcnNbbWV0aG9kXSA9IHt9O1xuICAgIH0pO1xuICAgIHV0aWxzLmZvckVhY2goW1wicG9zdFwiLCBcInB1dFwiLCBcInBhdGNoXCJdLCBmdW5jdGlvbiBmb3JFYWNoTWV0aG9kV2l0aERhdGEobWV0aG9kKSB7XG4gICAgICBkZWZhdWx0cy5oZWFkZXJzW21ldGhvZF0gPSB1dGlscy5tZXJnZShERUZBVUxUX0NPTlRFTlRfVFlQRSk7XG4gICAgfSk7XG4gICAgbW9kdWxlLmV4cG9ydHMgPSBkZWZhdWx0cztcbiAgfVxufSk7XG5cbi8vIG5vZGVfbW9kdWxlcy9heGlvcy9saWIvY29yZS90cmFuc2Zvcm1EYXRhLmpzXG52YXIgcmVxdWlyZV90cmFuc2Zvcm1EYXRhID0gX19jb21tb25KUyh7XG4gIFwibm9kZV9tb2R1bGVzL2F4aW9zL2xpYi9jb3JlL3RyYW5zZm9ybURhdGEuanNcIihleHBvcnRzLCBtb2R1bGUpIHtcbiAgICBcInVzZSBzdHJpY3RcIjtcbiAgICB2YXIgdXRpbHMgPSByZXF1aXJlX3V0aWxzKCk7XG4gICAgdmFyIGRlZmF1bHRzID0gcmVxdWlyZV9kZWZhdWx0cygpO1xuICAgIG1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gdHJhbnNmb3JtRGF0YShkYXRhLCBoZWFkZXJzLCBmbnMpIHtcbiAgICAgIHZhciBjb250ZXh0ID0gdGhpcyB8fCBkZWZhdWx0cztcbiAgICAgIHV0aWxzLmZvckVhY2goZm5zLCBmdW5jdGlvbiB0cmFuc2Zvcm0oZm4yKSB7XG4gICAgICAgIGRhdGEgPSBmbjIuY2FsbChjb250ZXh0LCBkYXRhLCBoZWFkZXJzKTtcbiAgICAgIH0pO1xuICAgICAgcmV0dXJuIGRhdGE7XG4gICAgfTtcbiAgfVxufSk7XG5cbi8vIG5vZGVfbW9kdWxlcy9heGlvcy9saWIvY2FuY2VsL2lzQ2FuY2VsLmpzXG52YXIgcmVxdWlyZV9pc0NhbmNlbCA9IF9fY29tbW9uSlMoe1xuICBcIm5vZGVfbW9kdWxlcy9heGlvcy9saWIvY2FuY2VsL2lzQ2FuY2VsLmpzXCIoZXhwb3J0cywgbW9kdWxlKSB7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG4gICAgbW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBpc0NhbmNlbCh2YWx1ZSkge1xuICAgICAgcmV0dXJuICEhKHZhbHVlICYmIHZhbHVlLl9fQ0FOQ0VMX18pO1xuICAgIH07XG4gIH1cbn0pO1xuXG4vLyBub2RlX21vZHVsZXMvYXhpb3MvbGliL2NvcmUvZGlzcGF0Y2hSZXF1ZXN0LmpzXG52YXIgcmVxdWlyZV9kaXNwYXRjaFJlcXVlc3QgPSBfX2NvbW1vbkpTKHtcbiAgXCJub2RlX21vZHVsZXMvYXhpb3MvbGliL2NvcmUvZGlzcGF0Y2hSZXF1ZXN0LmpzXCIoZXhwb3J0cywgbW9kdWxlKSB7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG4gICAgdmFyIHV0aWxzID0gcmVxdWlyZV91dGlscygpO1xuICAgIHZhciB0cmFuc2Zvcm1EYXRhID0gcmVxdWlyZV90cmFuc2Zvcm1EYXRhKCk7XG4gICAgdmFyIGlzQ2FuY2VsID0gcmVxdWlyZV9pc0NhbmNlbCgpO1xuICAgIHZhciBkZWZhdWx0cyA9IHJlcXVpcmVfZGVmYXVsdHMoKTtcbiAgICB2YXIgQ2FuY2VsZWRFcnJvciA9IHJlcXVpcmVfQ2FuY2VsZWRFcnJvcigpO1xuICAgIGZ1bmN0aW9uIHRocm93SWZDYW5jZWxsYXRpb25SZXF1ZXN0ZWQoY29uZmlnKSB7XG4gICAgICBpZiAoY29uZmlnLmNhbmNlbFRva2VuKSB7XG4gICAgICAgIGNvbmZpZy5jYW5jZWxUb2tlbi50aHJvd0lmUmVxdWVzdGVkKCk7XG4gICAgICB9XG4gICAgICBpZiAoY29uZmlnLnNpZ25hbCAmJiBjb25maWcuc2lnbmFsLmFib3J0ZWQpIHtcbiAgICAgICAgdGhyb3cgbmV3IENhbmNlbGVkRXJyb3IoKTtcbiAgICAgIH1cbiAgICB9XG4gICAgbW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBkaXNwYXRjaFJlcXVlc3QoY29uZmlnKSB7XG4gICAgICB0aHJvd0lmQ2FuY2VsbGF0aW9uUmVxdWVzdGVkKGNvbmZpZyk7XG4gICAgICBjb25maWcuaGVhZGVycyA9IGNvbmZpZy5oZWFkZXJzIHx8IHt9O1xuICAgICAgY29uZmlnLmRhdGEgPSB0cmFuc2Zvcm1EYXRhLmNhbGwoXG4gICAgICAgIGNvbmZpZyxcbiAgICAgICAgY29uZmlnLmRhdGEsXG4gICAgICAgIGNvbmZpZy5oZWFkZXJzLFxuICAgICAgICBjb25maWcudHJhbnNmb3JtUmVxdWVzdFxuICAgICAgKTtcbiAgICAgIGNvbmZpZy5oZWFkZXJzID0gdXRpbHMubWVyZ2UoXG4gICAgICAgIGNvbmZpZy5oZWFkZXJzLmNvbW1vbiB8fCB7fSxcbiAgICAgICAgY29uZmlnLmhlYWRlcnNbY29uZmlnLm1ldGhvZF0gfHwge30sXG4gICAgICAgIGNvbmZpZy5oZWFkZXJzXG4gICAgICApO1xuICAgICAgdXRpbHMuZm9yRWFjaChcbiAgICAgICAgW1wiZGVsZXRlXCIsIFwiZ2V0XCIsIFwiaGVhZFwiLCBcInBvc3RcIiwgXCJwdXRcIiwgXCJwYXRjaFwiLCBcImNvbW1vblwiXSxcbiAgICAgICAgZnVuY3Rpb24gY2xlYW5IZWFkZXJDb25maWcobWV0aG9kKSB7XG4gICAgICAgICAgZGVsZXRlIGNvbmZpZy5oZWFkZXJzW21ldGhvZF07XG4gICAgICAgIH1cbiAgICAgICk7XG4gICAgICB2YXIgYWRhcHRlciA9IGNvbmZpZy5hZGFwdGVyIHx8IGRlZmF1bHRzLmFkYXB0ZXI7XG4gICAgICByZXR1cm4gYWRhcHRlcihjb25maWcpLnRoZW4oZnVuY3Rpb24gb25BZGFwdGVyUmVzb2x1dGlvbihyZXNwb25zZSkge1xuICAgICAgICB0aHJvd0lmQ2FuY2VsbGF0aW9uUmVxdWVzdGVkKGNvbmZpZyk7XG4gICAgICAgIHJlc3BvbnNlLmRhdGEgPSB0cmFuc2Zvcm1EYXRhLmNhbGwoXG4gICAgICAgICAgY29uZmlnLFxuICAgICAgICAgIHJlc3BvbnNlLmRhdGEsXG4gICAgICAgICAgcmVzcG9uc2UuaGVhZGVycyxcbiAgICAgICAgICBjb25maWcudHJhbnNmb3JtUmVzcG9uc2VcbiAgICAgICAgKTtcbiAgICAgICAgcmV0dXJuIHJlc3BvbnNlO1xuICAgICAgfSwgZnVuY3Rpb24gb25BZGFwdGVyUmVqZWN0aW9uKHJlYXNvbikge1xuICAgICAgICBpZiAoIWlzQ2FuY2VsKHJlYXNvbikpIHtcbiAgICAgICAgICB0aHJvd0lmQ2FuY2VsbGF0aW9uUmVxdWVzdGVkKGNvbmZpZyk7XG4gICAgICAgICAgaWYgKHJlYXNvbiAmJiByZWFzb24ucmVzcG9uc2UpIHtcbiAgICAgICAgICAgIHJlYXNvbi5yZXNwb25zZS5kYXRhID0gdHJhbnNmb3JtRGF0YS5jYWxsKFxuICAgICAgICAgICAgICBjb25maWcsXG4gICAgICAgICAgICAgIHJlYXNvbi5yZXNwb25zZS5kYXRhLFxuICAgICAgICAgICAgICByZWFzb24ucmVzcG9uc2UuaGVhZGVycyxcbiAgICAgICAgICAgICAgY29uZmlnLnRyYW5zZm9ybVJlc3BvbnNlXG4gICAgICAgICAgICApO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QocmVhc29uKTtcbiAgICAgIH0pO1xuICAgIH07XG4gIH1cbn0pO1xuXG4vLyBub2RlX21vZHVsZXMvYXhpb3MvbGliL2NvcmUvbWVyZ2VDb25maWcuanNcbnZhciByZXF1aXJlX21lcmdlQ29uZmlnID0gX19jb21tb25KUyh7XG4gIFwibm9kZV9tb2R1bGVzL2F4aW9zL2xpYi9jb3JlL21lcmdlQ29uZmlnLmpzXCIoZXhwb3J0cywgbW9kdWxlKSB7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG4gICAgdmFyIHV0aWxzID0gcmVxdWlyZV91dGlscygpO1xuICAgIG1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gbWVyZ2VDb25maWcoY29uZmlnMSwgY29uZmlnMikge1xuICAgICAgY29uZmlnMiA9IGNvbmZpZzIgfHwge307XG4gICAgICB2YXIgY29uZmlnID0ge307XG4gICAgICBmdW5jdGlvbiBnZXRNZXJnZWRWYWx1ZSh0YXJnZXQsIHNvdXJjZSkge1xuICAgICAgICBpZiAodXRpbHMuaXNQbGFpbk9iamVjdCh0YXJnZXQpICYmIHV0aWxzLmlzUGxhaW5PYmplY3Qoc291cmNlKSkge1xuICAgICAgICAgIHJldHVybiB1dGlscy5tZXJnZSh0YXJnZXQsIHNvdXJjZSk7XG4gICAgICAgIH0gZWxzZSBpZiAodXRpbHMuaXNQbGFpbk9iamVjdChzb3VyY2UpKSB7XG4gICAgICAgICAgcmV0dXJuIHV0aWxzLm1lcmdlKHt9LCBzb3VyY2UpO1xuICAgICAgICB9IGVsc2UgaWYgKHV0aWxzLmlzQXJyYXkoc291cmNlKSkge1xuICAgICAgICAgIHJldHVybiBzb3VyY2Uuc2xpY2UoKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gc291cmNlO1xuICAgICAgfVxuICAgICAgZnVuY3Rpb24gbWVyZ2VEZWVwUHJvcGVydGllcyhwcm9wKSB7XG4gICAgICAgIGlmICghdXRpbHMuaXNVbmRlZmluZWQoY29uZmlnMltwcm9wXSkpIHtcbiAgICAgICAgICByZXR1cm4gZ2V0TWVyZ2VkVmFsdWUoY29uZmlnMVtwcm9wXSwgY29uZmlnMltwcm9wXSk7XG4gICAgICAgIH0gZWxzZSBpZiAoIXV0aWxzLmlzVW5kZWZpbmVkKGNvbmZpZzFbcHJvcF0pKSB7XG4gICAgICAgICAgcmV0dXJuIGdldE1lcmdlZFZhbHVlKHZvaWQgMCwgY29uZmlnMVtwcm9wXSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGZ1bmN0aW9uIHZhbHVlRnJvbUNvbmZpZzIocHJvcCkge1xuICAgICAgICBpZiAoIXV0aWxzLmlzVW5kZWZpbmVkKGNvbmZpZzJbcHJvcF0pKSB7XG4gICAgICAgICAgcmV0dXJuIGdldE1lcmdlZFZhbHVlKHZvaWQgMCwgY29uZmlnMltwcm9wXSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGZ1bmN0aW9uIGRlZmF1bHRUb0NvbmZpZzIocHJvcCkge1xuICAgICAgICBpZiAoIXV0aWxzLmlzVW5kZWZpbmVkKGNvbmZpZzJbcHJvcF0pKSB7XG4gICAgICAgICAgcmV0dXJuIGdldE1lcmdlZFZhbHVlKHZvaWQgMCwgY29uZmlnMltwcm9wXSk7XG4gICAgICAgIH0gZWxzZSBpZiAoIXV0aWxzLmlzVW5kZWZpbmVkKGNvbmZpZzFbcHJvcF0pKSB7XG4gICAgICAgICAgcmV0dXJuIGdldE1lcmdlZFZhbHVlKHZvaWQgMCwgY29uZmlnMVtwcm9wXSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGZ1bmN0aW9uIG1lcmdlRGlyZWN0S2V5cyhwcm9wKSB7XG4gICAgICAgIGlmIChwcm9wIGluIGNvbmZpZzIpIHtcbiAgICAgICAgICByZXR1cm4gZ2V0TWVyZ2VkVmFsdWUoY29uZmlnMVtwcm9wXSwgY29uZmlnMltwcm9wXSk7XG4gICAgICAgIH0gZWxzZSBpZiAocHJvcCBpbiBjb25maWcxKSB7XG4gICAgICAgICAgcmV0dXJuIGdldE1lcmdlZFZhbHVlKHZvaWQgMCwgY29uZmlnMVtwcm9wXSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHZhciBtZXJnZU1hcCA9IHtcbiAgICAgICAgXCJ1cmxcIjogdmFsdWVGcm9tQ29uZmlnMixcbiAgICAgICAgXCJtZXRob2RcIjogdmFsdWVGcm9tQ29uZmlnMixcbiAgICAgICAgXCJkYXRhXCI6IHZhbHVlRnJvbUNvbmZpZzIsXG4gICAgICAgIFwiYmFzZVVSTFwiOiBkZWZhdWx0VG9Db25maWcyLFxuICAgICAgICBcInRyYW5zZm9ybVJlcXVlc3RcIjogZGVmYXVsdFRvQ29uZmlnMixcbiAgICAgICAgXCJ0cmFuc2Zvcm1SZXNwb25zZVwiOiBkZWZhdWx0VG9Db25maWcyLFxuICAgICAgICBcInBhcmFtc1NlcmlhbGl6ZXJcIjogZGVmYXVsdFRvQ29uZmlnMixcbiAgICAgICAgXCJ0aW1lb3V0XCI6IGRlZmF1bHRUb0NvbmZpZzIsXG4gICAgICAgIFwidGltZW91dE1lc3NhZ2VcIjogZGVmYXVsdFRvQ29uZmlnMixcbiAgICAgICAgXCJ3aXRoQ3JlZGVudGlhbHNcIjogZGVmYXVsdFRvQ29uZmlnMixcbiAgICAgICAgXCJhZGFwdGVyXCI6IGRlZmF1bHRUb0NvbmZpZzIsXG4gICAgICAgIFwicmVzcG9uc2VUeXBlXCI6IGRlZmF1bHRUb0NvbmZpZzIsXG4gICAgICAgIFwieHNyZkNvb2tpZU5hbWVcIjogZGVmYXVsdFRvQ29uZmlnMixcbiAgICAgICAgXCJ4c3JmSGVhZGVyTmFtZVwiOiBkZWZhdWx0VG9Db25maWcyLFxuICAgICAgICBcIm9uVXBsb2FkUHJvZ3Jlc3NcIjogZGVmYXVsdFRvQ29uZmlnMixcbiAgICAgICAgXCJvbkRvd25sb2FkUHJvZ3Jlc3NcIjogZGVmYXVsdFRvQ29uZmlnMixcbiAgICAgICAgXCJkZWNvbXByZXNzXCI6IGRlZmF1bHRUb0NvbmZpZzIsXG4gICAgICAgIFwibWF4Q29udGVudExlbmd0aFwiOiBkZWZhdWx0VG9Db25maWcyLFxuICAgICAgICBcIm1heEJvZHlMZW5ndGhcIjogZGVmYXVsdFRvQ29uZmlnMixcbiAgICAgICAgXCJiZWZvcmVSZWRpcmVjdFwiOiBkZWZhdWx0VG9Db25maWcyLFxuICAgICAgICBcInRyYW5zcG9ydFwiOiBkZWZhdWx0VG9Db25maWcyLFxuICAgICAgICBcImh0dHBBZ2VudFwiOiBkZWZhdWx0VG9Db25maWcyLFxuICAgICAgICBcImh0dHBzQWdlbnRcIjogZGVmYXVsdFRvQ29uZmlnMixcbiAgICAgICAgXCJjYW5jZWxUb2tlblwiOiBkZWZhdWx0VG9Db25maWcyLFxuICAgICAgICBcInNvY2tldFBhdGhcIjogZGVmYXVsdFRvQ29uZmlnMixcbiAgICAgICAgXCJyZXNwb25zZUVuY29kaW5nXCI6IGRlZmF1bHRUb0NvbmZpZzIsXG4gICAgICAgIFwidmFsaWRhdGVTdGF0dXNcIjogbWVyZ2VEaXJlY3RLZXlzXG4gICAgICB9O1xuICAgICAgdXRpbHMuZm9yRWFjaChPYmplY3Qua2V5cyhjb25maWcxKS5jb25jYXQoT2JqZWN0LmtleXMoY29uZmlnMikpLCBmdW5jdGlvbiBjb21wdXRlQ29uZmlnVmFsdWUocHJvcCkge1xuICAgICAgICB2YXIgbWVyZ2UgPSBtZXJnZU1hcFtwcm9wXSB8fCBtZXJnZURlZXBQcm9wZXJ0aWVzO1xuICAgICAgICB2YXIgY29uZmlnVmFsdWUgPSBtZXJnZShwcm9wKTtcbiAgICAgICAgdXRpbHMuaXNVbmRlZmluZWQoY29uZmlnVmFsdWUpICYmIG1lcmdlICE9PSBtZXJnZURpcmVjdEtleXMgfHwgKGNvbmZpZ1twcm9wXSA9IGNvbmZpZ1ZhbHVlKTtcbiAgICAgIH0pO1xuICAgICAgcmV0dXJuIGNvbmZpZztcbiAgICB9O1xuICB9XG59KTtcblxuLy8gbm9kZV9tb2R1bGVzL2F4aW9zL2xpYi9lbnYvZGF0YS5qc1xudmFyIHJlcXVpcmVfZGF0YSA9IF9fY29tbW9uSlMoe1xuICBcIm5vZGVfbW9kdWxlcy9heGlvcy9saWIvZW52L2RhdGEuanNcIihleHBvcnRzLCBtb2R1bGUpIHtcbiAgICBtb2R1bGUuZXhwb3J0cyA9IHtcbiAgICAgIFwidmVyc2lvblwiOiBcIjAuMjcuMlwiXG4gICAgfTtcbiAgfVxufSk7XG5cbi8vIG5vZGVfbW9kdWxlcy9heGlvcy9saWIvaGVscGVycy92YWxpZGF0b3IuanNcbnZhciByZXF1aXJlX3ZhbGlkYXRvciA9IF9fY29tbW9uSlMoe1xuICBcIm5vZGVfbW9kdWxlcy9heGlvcy9saWIvaGVscGVycy92YWxpZGF0b3IuanNcIihleHBvcnRzLCBtb2R1bGUpIHtcbiAgICBcInVzZSBzdHJpY3RcIjtcbiAgICB2YXIgVkVSU0lPTiA9IHJlcXVpcmVfZGF0YSgpLnZlcnNpb247XG4gICAgdmFyIEF4aW9zRXJyb3IgPSByZXF1aXJlX0F4aW9zRXJyb3IoKTtcbiAgICB2YXIgdmFsaWRhdG9ycyA9IHt9O1xuICAgIFtcIm9iamVjdFwiLCBcImJvb2xlYW5cIiwgXCJudW1iZXJcIiwgXCJmdW5jdGlvblwiLCBcInN0cmluZ1wiLCBcInN5bWJvbFwiXS5mb3JFYWNoKGZ1bmN0aW9uKHR5cGUsIGkyKSB7XG4gICAgICB2YWxpZGF0b3JzW3R5cGVdID0gZnVuY3Rpb24gdmFsaWRhdG9yKHRoaW5nKSB7XG4gICAgICAgIHJldHVybiB0eXBlb2YgdGhpbmcgPT09IHR5cGUgfHwgXCJhXCIgKyAoaTIgPCAxID8gXCJuIFwiIDogXCIgXCIpICsgdHlwZTtcbiAgICAgIH07XG4gICAgfSk7XG4gICAgdmFyIGRlcHJlY2F0ZWRXYXJuaW5ncyA9IHt9O1xuICAgIHZhbGlkYXRvcnMudHJhbnNpdGlvbmFsID0gZnVuY3Rpb24gdHJhbnNpdGlvbmFsKHZhbGlkYXRvciwgdmVyc2lvbiwgbWVzc2FnZSkge1xuICAgICAgZnVuY3Rpb24gZm9ybWF0TWVzc2FnZShvcHQsIGRlc2MpIHtcbiAgICAgICAgcmV0dXJuIFwiW0F4aW9zIHZcIiArIFZFUlNJT04gKyBcIl0gVHJhbnNpdGlvbmFsIG9wdGlvbiAnXCIgKyBvcHQgKyBcIidcIiArIGRlc2MgKyAobWVzc2FnZSA/IFwiLiBcIiArIG1lc3NhZ2UgOiBcIlwiKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBmdW5jdGlvbih2YWx1ZSwgb3B0LCBvcHRzKSB7XG4gICAgICAgIGlmICh2YWxpZGF0b3IgPT09IGZhbHNlKSB7XG4gICAgICAgICAgdGhyb3cgbmV3IEF4aW9zRXJyb3IoXG4gICAgICAgICAgICBmb3JtYXRNZXNzYWdlKG9wdCwgXCIgaGFzIGJlZW4gcmVtb3ZlZFwiICsgKHZlcnNpb24gPyBcIiBpbiBcIiArIHZlcnNpb24gOiBcIlwiKSksXG4gICAgICAgICAgICBBeGlvc0Vycm9yLkVSUl9ERVBSRUNBVEVEXG4gICAgICAgICAgKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAodmVyc2lvbiAmJiAhZGVwcmVjYXRlZFdhcm5pbmdzW29wdF0pIHtcbiAgICAgICAgICBkZXByZWNhdGVkV2FybmluZ3Nbb3B0XSA9IHRydWU7XG4gICAgICAgICAgY29uc29sZS53YXJuKFxuICAgICAgICAgICAgZm9ybWF0TWVzc2FnZShcbiAgICAgICAgICAgICAgb3B0LFxuICAgICAgICAgICAgICBcIiBoYXMgYmVlbiBkZXByZWNhdGVkIHNpbmNlIHZcIiArIHZlcnNpb24gKyBcIiBhbmQgd2lsbCBiZSByZW1vdmVkIGluIHRoZSBuZWFyIGZ1dHVyZVwiXG4gICAgICAgICAgICApXG4gICAgICAgICAgKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdmFsaWRhdG9yID8gdmFsaWRhdG9yKHZhbHVlLCBvcHQsIG9wdHMpIDogdHJ1ZTtcbiAgICAgIH07XG4gICAgfTtcbiAgICBmdW5jdGlvbiBhc3NlcnRPcHRpb25zKG9wdGlvbnMsIHNjaGVtYSwgYWxsb3dVbmtub3duKSB7XG4gICAgICBpZiAodHlwZW9mIG9wdGlvbnMgIT09IFwib2JqZWN0XCIpIHtcbiAgICAgICAgdGhyb3cgbmV3IEF4aW9zRXJyb3IoXCJvcHRpb25zIG11c3QgYmUgYW4gb2JqZWN0XCIsIEF4aW9zRXJyb3IuRVJSX0JBRF9PUFRJT05fVkFMVUUpO1xuICAgICAgfVxuICAgICAgdmFyIGtleXMgPSBPYmplY3Qua2V5cyhvcHRpb25zKTtcbiAgICAgIHZhciBpMiA9IGtleXMubGVuZ3RoO1xuICAgICAgd2hpbGUgKGkyLS0gPiAwKSB7XG4gICAgICAgIHZhciBvcHQgPSBrZXlzW2kyXTtcbiAgICAgICAgdmFyIHZhbGlkYXRvciA9IHNjaGVtYVtvcHRdO1xuICAgICAgICBpZiAodmFsaWRhdG9yKSB7XG4gICAgICAgICAgdmFyIHZhbHVlID0gb3B0aW9uc1tvcHRdO1xuICAgICAgICAgIHZhciByZXN1bHQgPSB2YWx1ZSA9PT0gdm9pZCAwIHx8IHZhbGlkYXRvcih2YWx1ZSwgb3B0LCBvcHRpb25zKTtcbiAgICAgICAgICBpZiAocmVzdWx0ICE9PSB0cnVlKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgQXhpb3NFcnJvcihcIm9wdGlvbiBcIiArIG9wdCArIFwiIG11c3QgYmUgXCIgKyByZXN1bHQsIEF4aW9zRXJyb3IuRVJSX0JBRF9PUFRJT05fVkFMVUUpO1xuICAgICAgICAgIH1cbiAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoYWxsb3dVbmtub3duICE9PSB0cnVlKSB7XG4gICAgICAgICAgdGhyb3cgbmV3IEF4aW9zRXJyb3IoXCJVbmtub3duIG9wdGlvbiBcIiArIG9wdCwgQXhpb3NFcnJvci5FUlJfQkFEX09QVElPTik7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgbW9kdWxlLmV4cG9ydHMgPSB7XG4gICAgICBhc3NlcnRPcHRpb25zLFxuICAgICAgdmFsaWRhdG9yc1xuICAgIH07XG4gIH1cbn0pO1xuXG4vLyBub2RlX21vZHVsZXMvYXhpb3MvbGliL2NvcmUvQXhpb3MuanNcbnZhciByZXF1aXJlX0F4aW9zID0gX19jb21tb25KUyh7XG4gIFwibm9kZV9tb2R1bGVzL2F4aW9zL2xpYi9jb3JlL0F4aW9zLmpzXCIoZXhwb3J0cywgbW9kdWxlKSB7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG4gICAgdmFyIHV0aWxzID0gcmVxdWlyZV91dGlscygpO1xuICAgIHZhciBidWlsZFVSTCA9IHJlcXVpcmVfYnVpbGRVUkwoKTtcbiAgICB2YXIgSW50ZXJjZXB0b3JNYW5hZ2VyID0gcmVxdWlyZV9JbnRlcmNlcHRvck1hbmFnZXIoKTtcbiAgICB2YXIgZGlzcGF0Y2hSZXF1ZXN0ID0gcmVxdWlyZV9kaXNwYXRjaFJlcXVlc3QoKTtcbiAgICB2YXIgbWVyZ2VDb25maWcgPSByZXF1aXJlX21lcmdlQ29uZmlnKCk7XG4gICAgdmFyIGJ1aWxkRnVsbFBhdGggPSByZXF1aXJlX2J1aWxkRnVsbFBhdGgoKTtcbiAgICB2YXIgdmFsaWRhdG9yID0gcmVxdWlyZV92YWxpZGF0b3IoKTtcbiAgICB2YXIgdmFsaWRhdG9ycyA9IHZhbGlkYXRvci52YWxpZGF0b3JzO1xuICAgIGZ1bmN0aW9uIEF4aW9zKGluc3RhbmNlQ29uZmlnKSB7XG4gICAgICB0aGlzLmRlZmF1bHRzID0gaW5zdGFuY2VDb25maWc7XG4gICAgICB0aGlzLmludGVyY2VwdG9ycyA9IHtcbiAgICAgICAgcmVxdWVzdDogbmV3IEludGVyY2VwdG9yTWFuYWdlcigpLFxuICAgICAgICByZXNwb25zZTogbmV3IEludGVyY2VwdG9yTWFuYWdlcigpXG4gICAgICB9O1xuICAgIH1cbiAgICBBeGlvcy5wcm90b3R5cGUucmVxdWVzdCA9IGZ1bmN0aW9uIHJlcXVlc3QyKGNvbmZpZ09yVXJsLCBjb25maWcpIHtcbiAgICAgIGlmICh0eXBlb2YgY29uZmlnT3JVcmwgPT09IFwic3RyaW5nXCIpIHtcbiAgICAgICAgY29uZmlnID0gY29uZmlnIHx8IHt9O1xuICAgICAgICBjb25maWcudXJsID0gY29uZmlnT3JVcmw7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjb25maWcgPSBjb25maWdPclVybCB8fCB7fTtcbiAgICAgIH1cbiAgICAgIGNvbmZpZyA9IG1lcmdlQ29uZmlnKHRoaXMuZGVmYXVsdHMsIGNvbmZpZyk7XG4gICAgICBpZiAoY29uZmlnLm1ldGhvZCkge1xuICAgICAgICBjb25maWcubWV0aG9kID0gY29uZmlnLm1ldGhvZC50b0xvd2VyQ2FzZSgpO1xuICAgICAgfSBlbHNlIGlmICh0aGlzLmRlZmF1bHRzLm1ldGhvZCkge1xuICAgICAgICBjb25maWcubWV0aG9kID0gdGhpcy5kZWZhdWx0cy5tZXRob2QudG9Mb3dlckNhc2UoKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGNvbmZpZy5tZXRob2QgPSBcImdldFwiO1xuICAgICAgfVxuICAgICAgdmFyIHRyYW5zaXRpb25hbCA9IGNvbmZpZy50cmFuc2l0aW9uYWw7XG4gICAgICBpZiAodHJhbnNpdGlvbmFsICE9PSB2b2lkIDApIHtcbiAgICAgICAgdmFsaWRhdG9yLmFzc2VydE9wdGlvbnModHJhbnNpdGlvbmFsLCB7XG4gICAgICAgICAgc2lsZW50SlNPTlBhcnNpbmc6IHZhbGlkYXRvcnMudHJhbnNpdGlvbmFsKHZhbGlkYXRvcnMuYm9vbGVhbiksXG4gICAgICAgICAgZm9yY2VkSlNPTlBhcnNpbmc6IHZhbGlkYXRvcnMudHJhbnNpdGlvbmFsKHZhbGlkYXRvcnMuYm9vbGVhbiksXG4gICAgICAgICAgY2xhcmlmeVRpbWVvdXRFcnJvcjogdmFsaWRhdG9ycy50cmFuc2l0aW9uYWwodmFsaWRhdG9ycy5ib29sZWFuKVxuICAgICAgICB9LCBmYWxzZSk7XG4gICAgICB9XG4gICAgICB2YXIgcmVxdWVzdEludGVyY2VwdG9yQ2hhaW4gPSBbXTtcbiAgICAgIHZhciBzeW5jaHJvbm91c1JlcXVlc3RJbnRlcmNlcHRvcnMgPSB0cnVlO1xuICAgICAgdGhpcy5pbnRlcmNlcHRvcnMucmVxdWVzdC5mb3JFYWNoKGZ1bmN0aW9uIHVuc2hpZnRSZXF1ZXN0SW50ZXJjZXB0b3JzKGludGVyY2VwdG9yKSB7XG4gICAgICAgIGlmICh0eXBlb2YgaW50ZXJjZXB0b3IucnVuV2hlbiA9PT0gXCJmdW5jdGlvblwiICYmIGludGVyY2VwdG9yLnJ1bldoZW4oY29uZmlnKSA9PT0gZmFsc2UpIHtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgc3luY2hyb25vdXNSZXF1ZXN0SW50ZXJjZXB0b3JzID0gc3luY2hyb25vdXNSZXF1ZXN0SW50ZXJjZXB0b3JzICYmIGludGVyY2VwdG9yLnN5bmNocm9ub3VzO1xuICAgICAgICByZXF1ZXN0SW50ZXJjZXB0b3JDaGFpbi51bnNoaWZ0KGludGVyY2VwdG9yLmZ1bGZpbGxlZCwgaW50ZXJjZXB0b3IucmVqZWN0ZWQpO1xuICAgICAgfSk7XG4gICAgICB2YXIgcmVzcG9uc2VJbnRlcmNlcHRvckNoYWluID0gW107XG4gICAgICB0aGlzLmludGVyY2VwdG9ycy5yZXNwb25zZS5mb3JFYWNoKGZ1bmN0aW9uIHB1c2hSZXNwb25zZUludGVyY2VwdG9ycyhpbnRlcmNlcHRvcikge1xuICAgICAgICByZXNwb25zZUludGVyY2VwdG9yQ2hhaW4ucHVzaChpbnRlcmNlcHRvci5mdWxmaWxsZWQsIGludGVyY2VwdG9yLnJlamVjdGVkKTtcbiAgICAgIH0pO1xuICAgICAgdmFyIHByb21pc2U7XG4gICAgICBpZiAoIXN5bmNocm9ub3VzUmVxdWVzdEludGVyY2VwdG9ycykge1xuICAgICAgICB2YXIgY2hhaW4gPSBbZGlzcGF0Y2hSZXF1ZXN0LCB2b2lkIDBdO1xuICAgICAgICBBcnJheS5wcm90b3R5cGUudW5zaGlmdC5hcHBseShjaGFpbiwgcmVxdWVzdEludGVyY2VwdG9yQ2hhaW4pO1xuICAgICAgICBjaGFpbiA9IGNoYWluLmNvbmNhdChyZXNwb25zZUludGVyY2VwdG9yQ2hhaW4pO1xuICAgICAgICBwcm9taXNlID0gUHJvbWlzZS5yZXNvbHZlKGNvbmZpZyk7XG4gICAgICAgIHdoaWxlIChjaGFpbi5sZW5ndGgpIHtcbiAgICAgICAgICBwcm9taXNlID0gcHJvbWlzZS50aGVuKGNoYWluLnNoaWZ0KCksIGNoYWluLnNoaWZ0KCkpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBwcm9taXNlO1xuICAgICAgfVxuICAgICAgdmFyIG5ld0NvbmZpZyA9IGNvbmZpZztcbiAgICAgIHdoaWxlIChyZXF1ZXN0SW50ZXJjZXB0b3JDaGFpbi5sZW5ndGgpIHtcbiAgICAgICAgdmFyIG9uRnVsZmlsbGVkID0gcmVxdWVzdEludGVyY2VwdG9yQ2hhaW4uc2hpZnQoKTtcbiAgICAgICAgdmFyIG9uUmVqZWN0ZWQgPSByZXF1ZXN0SW50ZXJjZXB0b3JDaGFpbi5zaGlmdCgpO1xuICAgICAgICB0cnkge1xuICAgICAgICAgIG5ld0NvbmZpZyA9IG9uRnVsZmlsbGVkKG5ld0NvbmZpZyk7XG4gICAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgICAgb25SZWplY3RlZChlcnJvcik7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHRyeSB7XG4gICAgICAgIHByb21pc2UgPSBkaXNwYXRjaFJlcXVlc3QobmV3Q29uZmlnKTtcbiAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgIHJldHVybiBQcm9taXNlLnJlamVjdChlcnJvcik7XG4gICAgICB9XG4gICAgICB3aGlsZSAocmVzcG9uc2VJbnRlcmNlcHRvckNoYWluLmxlbmd0aCkge1xuICAgICAgICBwcm9taXNlID0gcHJvbWlzZS50aGVuKHJlc3BvbnNlSW50ZXJjZXB0b3JDaGFpbi5zaGlmdCgpLCByZXNwb25zZUludGVyY2VwdG9yQ2hhaW4uc2hpZnQoKSk7XG4gICAgICB9XG4gICAgICByZXR1cm4gcHJvbWlzZTtcbiAgICB9O1xuICAgIEF4aW9zLnByb3RvdHlwZS5nZXRVcmkgPSBmdW5jdGlvbiBnZXRVcmkoY29uZmlnKSB7XG4gICAgICBjb25maWcgPSBtZXJnZUNvbmZpZyh0aGlzLmRlZmF1bHRzLCBjb25maWcpO1xuICAgICAgdmFyIGZ1bGxQYXRoID0gYnVpbGRGdWxsUGF0aChjb25maWcuYmFzZVVSTCwgY29uZmlnLnVybCk7XG4gICAgICByZXR1cm4gYnVpbGRVUkwoZnVsbFBhdGgsIGNvbmZpZy5wYXJhbXMsIGNvbmZpZy5wYXJhbXNTZXJpYWxpemVyKTtcbiAgICB9O1xuICAgIHV0aWxzLmZvckVhY2goW1wiZGVsZXRlXCIsIFwiZ2V0XCIsIFwiaGVhZFwiLCBcIm9wdGlvbnNcIl0sIGZ1bmN0aW9uIGZvckVhY2hNZXRob2ROb0RhdGEobWV0aG9kKSB7XG4gICAgICBBeGlvcy5wcm90b3R5cGVbbWV0aG9kXSA9IGZ1bmN0aW9uKHVybCwgY29uZmlnKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnJlcXVlc3QobWVyZ2VDb25maWcoY29uZmlnIHx8IHt9LCB7XG4gICAgICAgICAgbWV0aG9kLFxuICAgICAgICAgIHVybCxcbiAgICAgICAgICBkYXRhOiAoY29uZmlnIHx8IHt9KS5kYXRhXG4gICAgICAgIH0pKTtcbiAgICAgIH07XG4gICAgfSk7XG4gICAgdXRpbHMuZm9yRWFjaChbXCJwb3N0XCIsIFwicHV0XCIsIFwicGF0Y2hcIl0sIGZ1bmN0aW9uIGZvckVhY2hNZXRob2RXaXRoRGF0YShtZXRob2QpIHtcbiAgICAgIGZ1bmN0aW9uIGdlbmVyYXRlSFRUUE1ldGhvZChpc0Zvcm0pIHtcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uIGh0dHBNZXRob2QodXJsLCBkYXRhLCBjb25maWcpIHtcbiAgICAgICAgICByZXR1cm4gdGhpcy5yZXF1ZXN0KG1lcmdlQ29uZmlnKGNvbmZpZyB8fCB7fSwge1xuICAgICAgICAgICAgbWV0aG9kLFxuICAgICAgICAgICAgaGVhZGVyczogaXNGb3JtID8ge1xuICAgICAgICAgICAgICBcIkNvbnRlbnQtVHlwZVwiOiBcIm11bHRpcGFydC9mb3JtLWRhdGFcIlxuICAgICAgICAgICAgfSA6IHt9LFxuICAgICAgICAgICAgdXJsLFxuICAgICAgICAgICAgZGF0YVxuICAgICAgICAgIH0pKTtcbiAgICAgICAgfTtcbiAgICAgIH1cbiAgICAgIEF4aW9zLnByb3RvdHlwZVttZXRob2RdID0gZ2VuZXJhdGVIVFRQTWV0aG9kKCk7XG4gICAgICBBeGlvcy5wcm90b3R5cGVbbWV0aG9kICsgXCJGb3JtXCJdID0gZ2VuZXJhdGVIVFRQTWV0aG9kKHRydWUpO1xuICAgIH0pO1xuICAgIG1vZHVsZS5leHBvcnRzID0gQXhpb3M7XG4gIH1cbn0pO1xuXG4vLyBub2RlX21vZHVsZXMvYXhpb3MvbGliL2NhbmNlbC9DYW5jZWxUb2tlbi5qc1xudmFyIHJlcXVpcmVfQ2FuY2VsVG9rZW4gPSBfX2NvbW1vbkpTKHtcbiAgXCJub2RlX21vZHVsZXMvYXhpb3MvbGliL2NhbmNlbC9DYW5jZWxUb2tlbi5qc1wiKGV4cG9ydHMsIG1vZHVsZSkge1xuICAgIFwidXNlIHN0cmljdFwiO1xuICAgIHZhciBDYW5jZWxlZEVycm9yID0gcmVxdWlyZV9DYW5jZWxlZEVycm9yKCk7XG4gICAgZnVuY3Rpb24gQ2FuY2VsVG9rZW4oZXhlY3V0b3IpIHtcbiAgICAgIGlmICh0eXBlb2YgZXhlY3V0b3IgIT09IFwiZnVuY3Rpb25cIikge1xuICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKFwiZXhlY3V0b3IgbXVzdCBiZSBhIGZ1bmN0aW9uLlwiKTtcbiAgICAgIH1cbiAgICAgIHZhciByZXNvbHZlUHJvbWlzZTtcbiAgICAgIHRoaXMucHJvbWlzZSA9IG5ldyBQcm9taXNlKGZ1bmN0aW9uIHByb21pc2VFeGVjdXRvcihyZXNvbHZlKSB7XG4gICAgICAgIHJlc29sdmVQcm9taXNlID0gcmVzb2x2ZTtcbiAgICAgIH0pO1xuICAgICAgdmFyIHRva2VuID0gdGhpcztcbiAgICAgIHRoaXMucHJvbWlzZS50aGVuKGZ1bmN0aW9uKGNhbmNlbCkge1xuICAgICAgICBpZiAoIXRva2VuLl9saXN0ZW5lcnMpXG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB2YXIgaTI7XG4gICAgICAgIHZhciBsMiA9IHRva2VuLl9saXN0ZW5lcnMubGVuZ3RoO1xuICAgICAgICBmb3IgKGkyID0gMDsgaTIgPCBsMjsgaTIrKykge1xuICAgICAgICAgIHRva2VuLl9saXN0ZW5lcnNbaTJdKGNhbmNlbCk7XG4gICAgICAgIH1cbiAgICAgICAgdG9rZW4uX2xpc3RlbmVycyA9IG51bGw7XG4gICAgICB9KTtcbiAgICAgIHRoaXMucHJvbWlzZS50aGVuID0gZnVuY3Rpb24ob25mdWxmaWxsZWQpIHtcbiAgICAgICAgdmFyIF9yZXNvbHZlO1xuICAgICAgICB2YXIgcHJvbWlzZSA9IG5ldyBQcm9taXNlKGZ1bmN0aW9uKHJlc29sdmUpIHtcbiAgICAgICAgICB0b2tlbi5zdWJzY3JpYmUocmVzb2x2ZSk7XG4gICAgICAgICAgX3Jlc29sdmUgPSByZXNvbHZlO1xuICAgICAgICB9KS50aGVuKG9uZnVsZmlsbGVkKTtcbiAgICAgICAgcHJvbWlzZS5jYW5jZWwgPSBmdW5jdGlvbiByZWplY3QoKSB7XG4gICAgICAgICAgdG9rZW4udW5zdWJzY3JpYmUoX3Jlc29sdmUpO1xuICAgICAgICB9O1xuICAgICAgICByZXR1cm4gcHJvbWlzZTtcbiAgICAgIH07XG4gICAgICBleGVjdXRvcihmdW5jdGlvbiBjYW5jZWwobWVzc2FnZSkge1xuICAgICAgICBpZiAodG9rZW4ucmVhc29uKSB7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIHRva2VuLnJlYXNvbiA9IG5ldyBDYW5jZWxlZEVycm9yKG1lc3NhZ2UpO1xuICAgICAgICByZXNvbHZlUHJvbWlzZSh0b2tlbi5yZWFzb24pO1xuICAgICAgfSk7XG4gICAgfVxuICAgIENhbmNlbFRva2VuLnByb3RvdHlwZS50aHJvd0lmUmVxdWVzdGVkID0gZnVuY3Rpb24gdGhyb3dJZlJlcXVlc3RlZCgpIHtcbiAgICAgIGlmICh0aGlzLnJlYXNvbikge1xuICAgICAgICB0aHJvdyB0aGlzLnJlYXNvbjtcbiAgICAgIH1cbiAgICB9O1xuICAgIENhbmNlbFRva2VuLnByb3RvdHlwZS5zdWJzY3JpYmUgPSBmdW5jdGlvbiBzdWJzY3JpYmUobGlzdGVuZXIpIHtcbiAgICAgIGlmICh0aGlzLnJlYXNvbikge1xuICAgICAgICBsaXN0ZW5lcih0aGlzLnJlYXNvbik7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIGlmICh0aGlzLl9saXN0ZW5lcnMpIHtcbiAgICAgICAgdGhpcy5fbGlzdGVuZXJzLnB1c2gobGlzdGVuZXIpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5fbGlzdGVuZXJzID0gW2xpc3RlbmVyXTtcbiAgICAgIH1cbiAgICB9O1xuICAgIENhbmNlbFRva2VuLnByb3RvdHlwZS51bnN1YnNjcmliZSA9IGZ1bmN0aW9uIHVuc3Vic2NyaWJlKGxpc3RlbmVyKSB7XG4gICAgICBpZiAoIXRoaXMuX2xpc3RlbmVycykge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICB2YXIgaW5kZXggPSB0aGlzLl9saXN0ZW5lcnMuaW5kZXhPZihsaXN0ZW5lcik7XG4gICAgICBpZiAoaW5kZXggIT09IC0xKSB7XG4gICAgICAgIHRoaXMuX2xpc3RlbmVycy5zcGxpY2UoaW5kZXgsIDEpO1xuICAgICAgfVxuICAgIH07XG4gICAgQ2FuY2VsVG9rZW4uc291cmNlID0gZnVuY3Rpb24gc291cmNlKCkge1xuICAgICAgdmFyIGNhbmNlbDtcbiAgICAgIHZhciB0b2tlbiA9IG5ldyBDYW5jZWxUb2tlbihmdW5jdGlvbiBleGVjdXRvcihjMikge1xuICAgICAgICBjYW5jZWwgPSBjMjtcbiAgICAgIH0pO1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgdG9rZW4sXG4gICAgICAgIGNhbmNlbFxuICAgICAgfTtcbiAgICB9O1xuICAgIG1vZHVsZS5leHBvcnRzID0gQ2FuY2VsVG9rZW47XG4gIH1cbn0pO1xuXG4vLyBub2RlX21vZHVsZXMvYXhpb3MvbGliL2hlbHBlcnMvc3ByZWFkLmpzXG52YXIgcmVxdWlyZV9zcHJlYWQgPSBfX2NvbW1vbkpTKHtcbiAgXCJub2RlX21vZHVsZXMvYXhpb3MvbGliL2hlbHBlcnMvc3ByZWFkLmpzXCIoZXhwb3J0cywgbW9kdWxlKSB7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG4gICAgbW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBzcHJlYWQoY2FsbGJhY2spIHtcbiAgICAgIHJldHVybiBmdW5jdGlvbiB3cmFwKGFycikge1xuICAgICAgICByZXR1cm4gY2FsbGJhY2suYXBwbHkobnVsbCwgYXJyKTtcbiAgICAgIH07XG4gICAgfTtcbiAgfVxufSk7XG5cbi8vIG5vZGVfbW9kdWxlcy9heGlvcy9saWIvaGVscGVycy9pc0F4aW9zRXJyb3IuanNcbnZhciByZXF1aXJlX2lzQXhpb3NFcnJvciA9IF9fY29tbW9uSlMoe1xuICBcIm5vZGVfbW9kdWxlcy9heGlvcy9saWIvaGVscGVycy9pc0F4aW9zRXJyb3IuanNcIihleHBvcnRzLCBtb2R1bGUpIHtcbiAgICBcInVzZSBzdHJpY3RcIjtcbiAgICB2YXIgdXRpbHMgPSByZXF1aXJlX3V0aWxzKCk7XG4gICAgbW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBpc0F4aW9zRXJyb3IocGF5bG9hZCkge1xuICAgICAgcmV0dXJuIHV0aWxzLmlzT2JqZWN0KHBheWxvYWQpICYmIHBheWxvYWQuaXNBeGlvc0Vycm9yID09PSB0cnVlO1xuICAgIH07XG4gIH1cbn0pO1xuXG4vLyBub2RlX21vZHVsZXMvYXhpb3MvbGliL2F4aW9zLmpzXG52YXIgcmVxdWlyZV9heGlvcyA9IF9fY29tbW9uSlMoe1xuICBcIm5vZGVfbW9kdWxlcy9heGlvcy9saWIvYXhpb3MuanNcIihleHBvcnRzLCBtb2R1bGUpIHtcbiAgICBcInVzZSBzdHJpY3RcIjtcbiAgICB2YXIgdXRpbHMgPSByZXF1aXJlX3V0aWxzKCk7XG4gICAgdmFyIGJpbmQgPSByZXF1aXJlX2JpbmQoKTtcbiAgICB2YXIgQXhpb3MgPSByZXF1aXJlX0F4aW9zKCk7XG4gICAgdmFyIG1lcmdlQ29uZmlnID0gcmVxdWlyZV9tZXJnZUNvbmZpZygpO1xuICAgIHZhciBkZWZhdWx0cyA9IHJlcXVpcmVfZGVmYXVsdHMoKTtcbiAgICBmdW5jdGlvbiBjcmVhdGVJbnN0YW5jZShkZWZhdWx0Q29uZmlnKSB7XG4gICAgICB2YXIgY29udGV4dCA9IG5ldyBBeGlvcyhkZWZhdWx0Q29uZmlnKTtcbiAgICAgIHZhciBpbnN0YW5jZSA9IGJpbmQoQXhpb3MucHJvdG90eXBlLnJlcXVlc3QsIGNvbnRleHQpO1xuICAgICAgdXRpbHMuZXh0ZW5kKGluc3RhbmNlLCBBeGlvcy5wcm90b3R5cGUsIGNvbnRleHQpO1xuICAgICAgdXRpbHMuZXh0ZW5kKGluc3RhbmNlLCBjb250ZXh0KTtcbiAgICAgIGluc3RhbmNlLmNyZWF0ZSA9IGZ1bmN0aW9uIGNyZWF0ZShpbnN0YW5jZUNvbmZpZykge1xuICAgICAgICByZXR1cm4gY3JlYXRlSW5zdGFuY2UobWVyZ2VDb25maWcoZGVmYXVsdENvbmZpZywgaW5zdGFuY2VDb25maWcpKTtcbiAgICAgIH07XG4gICAgICByZXR1cm4gaW5zdGFuY2U7XG4gICAgfVxuICAgIHZhciBheGlvczIgPSBjcmVhdGVJbnN0YW5jZShkZWZhdWx0cyk7XG4gICAgYXhpb3MyLkF4aW9zID0gQXhpb3M7XG4gICAgYXhpb3MyLkNhbmNlbGVkRXJyb3IgPSByZXF1aXJlX0NhbmNlbGVkRXJyb3IoKTtcbiAgICBheGlvczIuQ2FuY2VsVG9rZW4gPSByZXF1aXJlX0NhbmNlbFRva2VuKCk7XG4gICAgYXhpb3MyLmlzQ2FuY2VsID0gcmVxdWlyZV9pc0NhbmNlbCgpO1xuICAgIGF4aW9zMi5WRVJTSU9OID0gcmVxdWlyZV9kYXRhKCkudmVyc2lvbjtcbiAgICBheGlvczIudG9Gb3JtRGF0YSA9IHJlcXVpcmVfdG9Gb3JtRGF0YSgpO1xuICAgIGF4aW9zMi5BeGlvc0Vycm9yID0gcmVxdWlyZV9BeGlvc0Vycm9yKCk7XG4gICAgYXhpb3MyLkNhbmNlbCA9IGF4aW9zMi5DYW5jZWxlZEVycm9yO1xuICAgIGF4aW9zMi5hbGwgPSBmdW5jdGlvbiBhbGwocHJvbWlzZXMpIHtcbiAgICAgIHJldHVybiBQcm9taXNlLmFsbChwcm9taXNlcyk7XG4gICAgfTtcbiAgICBheGlvczIuc3ByZWFkID0gcmVxdWlyZV9zcHJlYWQoKTtcbiAgICBheGlvczIuaXNBeGlvc0Vycm9yID0gcmVxdWlyZV9pc0F4aW9zRXJyb3IoKTtcbiAgICBtb2R1bGUuZXhwb3J0cyA9IGF4aW9zMjtcbiAgICBtb2R1bGUuZXhwb3J0cy5kZWZhdWx0ID0gYXhpb3MyO1xuICB9XG59KTtcblxuLy8gbm9kZV9tb2R1bGVzL2F4aW9zL2luZGV4LmpzXG52YXIgcmVxdWlyZV9heGlvczIgPSBfX2NvbW1vbkpTKHtcbiAgXCJub2RlX21vZHVsZXMvYXhpb3MvaW5kZXguanNcIihleHBvcnRzLCBtb2R1bGUpIHtcbiAgICBtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmVfYXhpb3MoKTtcbiAgfVxufSk7XG5cbi8vIG5vZGVfbW9kdWxlcy9yZWFjdC1pcy9janMvcmVhY3QtaXMuZGV2ZWxvcG1lbnQuanNcbnZhciByZXF1aXJlX3JlYWN0X2lzX2RldmVsb3BtZW50ID0gX19jb21tb25KUyh7XG4gIFwibm9kZV9tb2R1bGVzL3JlYWN0LWlzL2Nqcy9yZWFjdC1pcy5kZXZlbG9wbWVudC5qc1wiKGV4cG9ydHMpIHtcbiAgICBcInVzZSBzdHJpY3RcIjtcbiAgICBpZiAodHJ1ZSkge1xuICAgICAgKGZ1bmN0aW9uKCkge1xuICAgICAgICBcInVzZSBzdHJpY3RcIjtcbiAgICAgICAgdmFyIGhhc1N5bWJvbCA9IHR5cGVvZiBTeW1ib2wgPT09IFwiZnVuY3Rpb25cIiAmJiBTeW1ib2wuZm9yO1xuICAgICAgICB2YXIgUkVBQ1RfRUxFTUVOVF9UWVBFID0gaGFzU3ltYm9sID8gU3ltYm9sLmZvcihcInJlYWN0LmVsZW1lbnRcIikgOiA2MDEwMztcbiAgICAgICAgdmFyIFJFQUNUX1BPUlRBTF9UWVBFID0gaGFzU3ltYm9sID8gU3ltYm9sLmZvcihcInJlYWN0LnBvcnRhbFwiKSA6IDYwMTA2O1xuICAgICAgICB2YXIgUkVBQ1RfRlJBR01FTlRfVFlQRSA9IGhhc1N5bWJvbCA/IFN5bWJvbC5mb3IoXCJyZWFjdC5mcmFnbWVudFwiKSA6IDYwMTA3O1xuICAgICAgICB2YXIgUkVBQ1RfU1RSSUNUX01PREVfVFlQRSA9IGhhc1N5bWJvbCA/IFN5bWJvbC5mb3IoXCJyZWFjdC5zdHJpY3RfbW9kZVwiKSA6IDYwMTA4O1xuICAgICAgICB2YXIgUkVBQ1RfUFJPRklMRVJfVFlQRSA9IGhhc1N5bWJvbCA/IFN5bWJvbC5mb3IoXCJyZWFjdC5wcm9maWxlclwiKSA6IDYwMTE0O1xuICAgICAgICB2YXIgUkVBQ1RfUFJPVklERVJfVFlQRSA9IGhhc1N5bWJvbCA/IFN5bWJvbC5mb3IoXCJyZWFjdC5wcm92aWRlclwiKSA6IDYwMTA5O1xuICAgICAgICB2YXIgUkVBQ1RfQ09OVEVYVF9UWVBFID0gaGFzU3ltYm9sID8gU3ltYm9sLmZvcihcInJlYWN0LmNvbnRleHRcIikgOiA2MDExMDtcbiAgICAgICAgdmFyIFJFQUNUX0FTWU5DX01PREVfVFlQRSA9IGhhc1N5bWJvbCA/IFN5bWJvbC5mb3IoXCJyZWFjdC5hc3luY19tb2RlXCIpIDogNjAxMTE7XG4gICAgICAgIHZhciBSRUFDVF9DT05DVVJSRU5UX01PREVfVFlQRSA9IGhhc1N5bWJvbCA/IFN5bWJvbC5mb3IoXCJyZWFjdC5jb25jdXJyZW50X21vZGVcIikgOiA2MDExMTtcbiAgICAgICAgdmFyIFJFQUNUX0ZPUldBUkRfUkVGX1RZUEUgPSBoYXNTeW1ib2wgPyBTeW1ib2wuZm9yKFwicmVhY3QuZm9yd2FyZF9yZWZcIikgOiA2MDExMjtcbiAgICAgICAgdmFyIFJFQUNUX1NVU1BFTlNFX1RZUEUgPSBoYXNTeW1ib2wgPyBTeW1ib2wuZm9yKFwicmVhY3Quc3VzcGVuc2VcIikgOiA2MDExMztcbiAgICAgICAgdmFyIFJFQUNUX1NVU1BFTlNFX0xJU1RfVFlQRSA9IGhhc1N5bWJvbCA/IFN5bWJvbC5mb3IoXCJyZWFjdC5zdXNwZW5zZV9saXN0XCIpIDogNjAxMjA7XG4gICAgICAgIHZhciBSRUFDVF9NRU1PX1RZUEUgPSBoYXNTeW1ib2wgPyBTeW1ib2wuZm9yKFwicmVhY3QubWVtb1wiKSA6IDYwMTE1O1xuICAgICAgICB2YXIgUkVBQ1RfTEFaWV9UWVBFID0gaGFzU3ltYm9sID8gU3ltYm9sLmZvcihcInJlYWN0LmxhenlcIikgOiA2MDExNjtcbiAgICAgICAgdmFyIFJFQUNUX0JMT0NLX1RZUEUgPSBoYXNTeW1ib2wgPyBTeW1ib2wuZm9yKFwicmVhY3QuYmxvY2tcIikgOiA2MDEyMTtcbiAgICAgICAgdmFyIFJFQUNUX0ZVTkRBTUVOVEFMX1RZUEUgPSBoYXNTeW1ib2wgPyBTeW1ib2wuZm9yKFwicmVhY3QuZnVuZGFtZW50YWxcIikgOiA2MDExNztcbiAgICAgICAgdmFyIFJFQUNUX1JFU1BPTkRFUl9UWVBFID0gaGFzU3ltYm9sID8gU3ltYm9sLmZvcihcInJlYWN0LnJlc3BvbmRlclwiKSA6IDYwMTE4O1xuICAgICAgICB2YXIgUkVBQ1RfU0NPUEVfVFlQRSA9IGhhc1N5bWJvbCA/IFN5bWJvbC5mb3IoXCJyZWFjdC5zY29wZVwiKSA6IDYwMTE5O1xuICAgICAgICBmdW5jdGlvbiBpc1ZhbGlkRWxlbWVudFR5cGUyKHR5cGUpIHtcbiAgICAgICAgICByZXR1cm4gdHlwZW9mIHR5cGUgPT09IFwic3RyaW5nXCIgfHwgdHlwZW9mIHR5cGUgPT09IFwiZnVuY3Rpb25cIiB8fCB0eXBlID09PSBSRUFDVF9GUkFHTUVOVF9UWVBFIHx8IHR5cGUgPT09IFJFQUNUX0NPTkNVUlJFTlRfTU9ERV9UWVBFIHx8IHR5cGUgPT09IFJFQUNUX1BST0ZJTEVSX1RZUEUgfHwgdHlwZSA9PT0gUkVBQ1RfU1RSSUNUX01PREVfVFlQRSB8fCB0eXBlID09PSBSRUFDVF9TVVNQRU5TRV9UWVBFIHx8IHR5cGUgPT09IFJFQUNUX1NVU1BFTlNFX0xJU1RfVFlQRSB8fCB0eXBlb2YgdHlwZSA9PT0gXCJvYmplY3RcIiAmJiB0eXBlICE9PSBudWxsICYmICh0eXBlLiQkdHlwZW9mID09PSBSRUFDVF9MQVpZX1RZUEUgfHwgdHlwZS4kJHR5cGVvZiA9PT0gUkVBQ1RfTUVNT19UWVBFIHx8IHR5cGUuJCR0eXBlb2YgPT09IFJFQUNUX1BST1ZJREVSX1RZUEUgfHwgdHlwZS4kJHR5cGVvZiA9PT0gUkVBQ1RfQ09OVEVYVF9UWVBFIHx8IHR5cGUuJCR0eXBlb2YgPT09IFJFQUNUX0ZPUldBUkRfUkVGX1RZUEUgfHwgdHlwZS4kJHR5cGVvZiA9PT0gUkVBQ1RfRlVOREFNRU5UQUxfVFlQRSB8fCB0eXBlLiQkdHlwZW9mID09PSBSRUFDVF9SRVNQT05ERVJfVFlQRSB8fCB0eXBlLiQkdHlwZW9mID09PSBSRUFDVF9TQ09QRV9UWVBFIHx8IHR5cGUuJCR0eXBlb2YgPT09IFJFQUNUX0JMT0NLX1RZUEUpO1xuICAgICAgICB9XG4gICAgICAgIGZ1bmN0aW9uIHR5cGVPZihvYmplY3QpIHtcbiAgICAgICAgICBpZiAodHlwZW9mIG9iamVjdCA9PT0gXCJvYmplY3RcIiAmJiBvYmplY3QgIT09IG51bGwpIHtcbiAgICAgICAgICAgIHZhciAkJHR5cGVvZiA9IG9iamVjdC4kJHR5cGVvZjtcbiAgICAgICAgICAgIHN3aXRjaCAoJCR0eXBlb2YpIHtcbiAgICAgICAgICAgICAgY2FzZSBSRUFDVF9FTEVNRU5UX1RZUEU6XG4gICAgICAgICAgICAgICAgdmFyIHR5cGUgPSBvYmplY3QudHlwZTtcbiAgICAgICAgICAgICAgICBzd2l0Y2ggKHR5cGUpIHtcbiAgICAgICAgICAgICAgICAgIGNhc2UgUkVBQ1RfQVNZTkNfTU9ERV9UWVBFOlxuICAgICAgICAgICAgICAgICAgY2FzZSBSRUFDVF9DT05DVVJSRU5UX01PREVfVFlQRTpcbiAgICAgICAgICAgICAgICAgIGNhc2UgUkVBQ1RfRlJBR01FTlRfVFlQRTpcbiAgICAgICAgICAgICAgICAgIGNhc2UgUkVBQ1RfUFJPRklMRVJfVFlQRTpcbiAgICAgICAgICAgICAgICAgIGNhc2UgUkVBQ1RfU1RSSUNUX01PREVfVFlQRTpcbiAgICAgICAgICAgICAgICAgIGNhc2UgUkVBQ1RfU1VTUEVOU0VfVFlQRTpcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHR5cGU7XG4gICAgICAgICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgICAgICB2YXIgJCR0eXBlb2ZUeXBlID0gdHlwZSAmJiB0eXBlLiQkdHlwZW9mO1xuICAgICAgICAgICAgICAgICAgICBzd2l0Y2ggKCQkdHlwZW9mVHlwZSkge1xuICAgICAgICAgICAgICAgICAgICAgIGNhc2UgUkVBQ1RfQ09OVEVYVF9UWVBFOlxuICAgICAgICAgICAgICAgICAgICAgIGNhc2UgUkVBQ1RfRk9SV0FSRF9SRUZfVFlQRTpcbiAgICAgICAgICAgICAgICAgICAgICBjYXNlIFJFQUNUX0xBWllfVFlQRTpcbiAgICAgICAgICAgICAgICAgICAgICBjYXNlIFJFQUNUX01FTU9fVFlQRTpcbiAgICAgICAgICAgICAgICAgICAgICBjYXNlIFJFQUNUX1BST1ZJREVSX1RZUEU6XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gJCR0eXBlb2ZUeXBlO1xuICAgICAgICAgICAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gJCR0eXBlb2Y7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIGNhc2UgUkVBQ1RfUE9SVEFMX1RZUEU6XG4gICAgICAgICAgICAgICAgcmV0dXJuICQkdHlwZW9mO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgICByZXR1cm4gdm9pZCAwO1xuICAgICAgICB9XG4gICAgICAgIHZhciBBc3luY01vZGUgPSBSRUFDVF9BU1lOQ19NT0RFX1RZUEU7XG4gICAgICAgIHZhciBDb25jdXJyZW50TW9kZSA9IFJFQUNUX0NPTkNVUlJFTlRfTU9ERV9UWVBFO1xuICAgICAgICB2YXIgQ29udGV4dENvbnN1bWVyID0gUkVBQ1RfQ09OVEVYVF9UWVBFO1xuICAgICAgICB2YXIgQ29udGV4dFByb3ZpZGVyID0gUkVBQ1RfUFJPVklERVJfVFlQRTtcbiAgICAgICAgdmFyIEVsZW1lbnQgPSBSRUFDVF9FTEVNRU5UX1RZUEU7XG4gICAgICAgIHZhciBGb3J3YXJkUmVmID0gUkVBQ1RfRk9SV0FSRF9SRUZfVFlQRTtcbiAgICAgICAgdmFyIEZyYWdtZW50MyA9IFJFQUNUX0ZSQUdNRU5UX1RZUEU7XG4gICAgICAgIHZhciBMYXp5ID0gUkVBQ1RfTEFaWV9UWVBFO1xuICAgICAgICB2YXIgTWVtbyA9IFJFQUNUX01FTU9fVFlQRTtcbiAgICAgICAgdmFyIFBvcnRhbCA9IFJFQUNUX1BPUlRBTF9UWVBFO1xuICAgICAgICB2YXIgUHJvZmlsZXIgPSBSRUFDVF9QUk9GSUxFUl9UWVBFO1xuICAgICAgICB2YXIgU3RyaWN0TW9kZSA9IFJFQUNUX1NUUklDVF9NT0RFX1RZUEU7XG4gICAgICAgIHZhciBTdXNwZW5zZSA9IFJFQUNUX1NVU1BFTlNFX1RZUEU7XG4gICAgICAgIHZhciBoYXNXYXJuZWRBYm91dERlcHJlY2F0ZWRJc0FzeW5jTW9kZSA9IGZhbHNlO1xuICAgICAgICBmdW5jdGlvbiBpc0FzeW5jTW9kZShvYmplY3QpIHtcbiAgICAgICAgICB7XG4gICAgICAgICAgICBpZiAoIWhhc1dhcm5lZEFib3V0RGVwcmVjYXRlZElzQXN5bmNNb2RlKSB7XG4gICAgICAgICAgICAgIGhhc1dhcm5lZEFib3V0RGVwcmVjYXRlZElzQXN5bmNNb2RlID0gdHJ1ZTtcbiAgICAgICAgICAgICAgY29uc29sZVtcIndhcm5cIl0oXCJUaGUgUmVhY3RJcy5pc0FzeW5jTW9kZSgpIGFsaWFzIGhhcyBiZWVuIGRlcHJlY2F0ZWQsIGFuZCB3aWxsIGJlIHJlbW92ZWQgaW4gUmVhY3QgMTcrLiBVcGRhdGUgeW91ciBjb2RlIHRvIHVzZSBSZWFjdElzLmlzQ29uY3VycmVudE1vZGUoKSBpbnN0ZWFkLiBJdCBoYXMgdGhlIGV4YWN0IHNhbWUgQVBJLlwiKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgICAgcmV0dXJuIGlzQ29uY3VycmVudE1vZGUob2JqZWN0KSB8fCB0eXBlT2Yob2JqZWN0KSA9PT0gUkVBQ1RfQVNZTkNfTU9ERV9UWVBFO1xuICAgICAgICB9XG4gICAgICAgIGZ1bmN0aW9uIGlzQ29uY3VycmVudE1vZGUob2JqZWN0KSB7XG4gICAgICAgICAgcmV0dXJuIHR5cGVPZihvYmplY3QpID09PSBSRUFDVF9DT05DVVJSRU5UX01PREVfVFlQRTtcbiAgICAgICAgfVxuICAgICAgICBmdW5jdGlvbiBpc0NvbnRleHRDb25zdW1lcjIob2JqZWN0KSB7XG4gICAgICAgICAgcmV0dXJuIHR5cGVPZihvYmplY3QpID09PSBSRUFDVF9DT05URVhUX1RZUEU7XG4gICAgICAgIH1cbiAgICAgICAgZnVuY3Rpb24gaXNDb250ZXh0UHJvdmlkZXIob2JqZWN0KSB7XG4gICAgICAgICAgcmV0dXJuIHR5cGVPZihvYmplY3QpID09PSBSRUFDVF9QUk9WSURFUl9UWVBFO1xuICAgICAgICB9XG4gICAgICAgIGZ1bmN0aW9uIGlzRWxlbWVudChvYmplY3QpIHtcbiAgICAgICAgICByZXR1cm4gdHlwZW9mIG9iamVjdCA9PT0gXCJvYmplY3RcIiAmJiBvYmplY3QgIT09IG51bGwgJiYgb2JqZWN0LiQkdHlwZW9mID09PSBSRUFDVF9FTEVNRU5UX1RZUEU7XG4gICAgICAgIH1cbiAgICAgICAgZnVuY3Rpb24gaXNGb3J3YXJkUmVmKG9iamVjdCkge1xuICAgICAgICAgIHJldHVybiB0eXBlT2Yob2JqZWN0KSA9PT0gUkVBQ1RfRk9SV0FSRF9SRUZfVFlQRTtcbiAgICAgICAgfVxuICAgICAgICBmdW5jdGlvbiBpc0ZyYWdtZW50KG9iamVjdCkge1xuICAgICAgICAgIHJldHVybiB0eXBlT2Yob2JqZWN0KSA9PT0gUkVBQ1RfRlJBR01FTlRfVFlQRTtcbiAgICAgICAgfVxuICAgICAgICBmdW5jdGlvbiBpc0xhenkob2JqZWN0KSB7XG4gICAgICAgICAgcmV0dXJuIHR5cGVPZihvYmplY3QpID09PSBSRUFDVF9MQVpZX1RZUEU7XG4gICAgICAgIH1cbiAgICAgICAgZnVuY3Rpb24gaXNNZW1vKG9iamVjdCkge1xuICAgICAgICAgIHJldHVybiB0eXBlT2Yob2JqZWN0KSA9PT0gUkVBQ1RfTUVNT19UWVBFO1xuICAgICAgICB9XG4gICAgICAgIGZ1bmN0aW9uIGlzUG9ydGFsKG9iamVjdCkge1xuICAgICAgICAgIHJldHVybiB0eXBlT2Yob2JqZWN0KSA9PT0gUkVBQ1RfUE9SVEFMX1RZUEU7XG4gICAgICAgIH1cbiAgICAgICAgZnVuY3Rpb24gaXNQcm9maWxlcihvYmplY3QpIHtcbiAgICAgICAgICByZXR1cm4gdHlwZU9mKG9iamVjdCkgPT09IFJFQUNUX1BST0ZJTEVSX1RZUEU7XG4gICAgICAgIH1cbiAgICAgICAgZnVuY3Rpb24gaXNTdHJpY3RNb2RlKG9iamVjdCkge1xuICAgICAgICAgIHJldHVybiB0eXBlT2Yob2JqZWN0KSA9PT0gUkVBQ1RfU1RSSUNUX01PREVfVFlQRTtcbiAgICAgICAgfVxuICAgICAgICBmdW5jdGlvbiBpc1N1c3BlbnNlKG9iamVjdCkge1xuICAgICAgICAgIHJldHVybiB0eXBlT2Yob2JqZWN0KSA9PT0gUkVBQ1RfU1VTUEVOU0VfVFlQRTtcbiAgICAgICAgfVxuICAgICAgICBleHBvcnRzLkFzeW5jTW9kZSA9IEFzeW5jTW9kZTtcbiAgICAgICAgZXhwb3J0cy5Db25jdXJyZW50TW9kZSA9IENvbmN1cnJlbnRNb2RlO1xuICAgICAgICBleHBvcnRzLkNvbnRleHRDb25zdW1lciA9IENvbnRleHRDb25zdW1lcjtcbiAgICAgICAgZXhwb3J0cy5Db250ZXh0UHJvdmlkZXIgPSBDb250ZXh0UHJvdmlkZXI7XG4gICAgICAgIGV4cG9ydHMuRWxlbWVudCA9IEVsZW1lbnQ7XG4gICAgICAgIGV4cG9ydHMuRm9yd2FyZFJlZiA9IEZvcndhcmRSZWY7XG4gICAgICAgIGV4cG9ydHMuRnJhZ21lbnQgPSBGcmFnbWVudDM7XG4gICAgICAgIGV4cG9ydHMuTGF6eSA9IExhenk7XG4gICAgICAgIGV4cG9ydHMuTWVtbyA9IE1lbW87XG4gICAgICAgIGV4cG9ydHMuUG9ydGFsID0gUG9ydGFsO1xuICAgICAgICBleHBvcnRzLlByb2ZpbGVyID0gUHJvZmlsZXI7XG4gICAgICAgIGV4cG9ydHMuU3RyaWN0TW9kZSA9IFN0cmljdE1vZGU7XG4gICAgICAgIGV4cG9ydHMuU3VzcGVuc2UgPSBTdXNwZW5zZTtcbiAgICAgICAgZXhwb3J0cy5pc0FzeW5jTW9kZSA9IGlzQXN5bmNNb2RlO1xuICAgICAgICBleHBvcnRzLmlzQ29uY3VycmVudE1vZGUgPSBpc0NvbmN1cnJlbnRNb2RlO1xuICAgICAgICBleHBvcnRzLmlzQ29udGV4dENvbnN1bWVyID0gaXNDb250ZXh0Q29uc3VtZXIyO1xuICAgICAgICBleHBvcnRzLmlzQ29udGV4dFByb3ZpZGVyID0gaXNDb250ZXh0UHJvdmlkZXI7XG4gICAgICAgIGV4cG9ydHMuaXNFbGVtZW50ID0gaXNFbGVtZW50O1xuICAgICAgICBleHBvcnRzLmlzRm9yd2FyZFJlZiA9IGlzRm9yd2FyZFJlZjtcbiAgICAgICAgZXhwb3J0cy5pc0ZyYWdtZW50ID0gaXNGcmFnbWVudDtcbiAgICAgICAgZXhwb3J0cy5pc0xhenkgPSBpc0xhenk7XG4gICAgICAgIGV4cG9ydHMuaXNNZW1vID0gaXNNZW1vO1xuICAgICAgICBleHBvcnRzLmlzUG9ydGFsID0gaXNQb3J0YWw7XG4gICAgICAgIGV4cG9ydHMuaXNQcm9maWxlciA9IGlzUHJvZmlsZXI7XG4gICAgICAgIGV4cG9ydHMuaXNTdHJpY3RNb2RlID0gaXNTdHJpY3RNb2RlO1xuICAgICAgICBleHBvcnRzLmlzU3VzcGVuc2UgPSBpc1N1c3BlbnNlO1xuICAgICAgICBleHBvcnRzLmlzVmFsaWRFbGVtZW50VHlwZSA9IGlzVmFsaWRFbGVtZW50VHlwZTI7XG4gICAgICAgIGV4cG9ydHMudHlwZU9mID0gdHlwZU9mO1xuICAgICAgfSkoKTtcbiAgICB9XG4gIH1cbn0pO1xuXG4vLyBub2RlX21vZHVsZXMvcmVhY3QtaXMvaW5kZXguanNcbnZhciByZXF1aXJlX3JlYWN0X2lzID0gX19jb21tb25KUyh7XG4gIFwibm9kZV9tb2R1bGVzL3JlYWN0LWlzL2luZGV4LmpzXCIoZXhwb3J0cywgbW9kdWxlKSB7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG4gICAgaWYgKGZhbHNlKSB7XG4gICAgICBtb2R1bGUuZXhwb3J0cyA9IG51bGw7XG4gICAgfSBlbHNlIHtcbiAgICAgIG1vZHVsZS5leHBvcnRzID0gcmVxdWlyZV9yZWFjdF9pc19kZXZlbG9wbWVudCgpO1xuICAgIH1cbiAgfVxufSk7XG5cbi8vIG5vZGVfbW9kdWxlcy9vYmplY3QtYXNzaWduL2luZGV4LmpzXG52YXIgcmVxdWlyZV9vYmplY3RfYXNzaWduID0gX19jb21tb25KUyh7XG4gIFwibm9kZV9tb2R1bGVzL29iamVjdC1hc3NpZ24vaW5kZXguanNcIihleHBvcnRzLCBtb2R1bGUpIHtcbiAgICBcInVzZSBzdHJpY3RcIjtcbiAgICB2YXIgZ2V0T3duUHJvcGVydHlTeW1ib2xzID0gT2JqZWN0LmdldE93blByb3BlcnR5U3ltYm9scztcbiAgICB2YXIgaGFzT3duUHJvcGVydHkgPSBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5O1xuICAgIHZhciBwcm9wSXNFbnVtZXJhYmxlID0gT2JqZWN0LnByb3RvdHlwZS5wcm9wZXJ0eUlzRW51bWVyYWJsZTtcbiAgICBmdW5jdGlvbiB0b09iamVjdCh2YWwpIHtcbiAgICAgIGlmICh2YWwgPT09IG51bGwgfHwgdmFsID09PSB2b2lkIDApIHtcbiAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcihcIk9iamVjdC5hc3NpZ24gY2Fubm90IGJlIGNhbGxlZCB3aXRoIG51bGwgb3IgdW5kZWZpbmVkXCIpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIE9iamVjdCh2YWwpO1xuICAgIH1cbiAgICBmdW5jdGlvbiBzaG91bGRVc2VOYXRpdmUoKSB7XG4gICAgICB0cnkge1xuICAgICAgICBpZiAoIU9iamVjdC5hc3NpZ24pIHtcbiAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgICAgdmFyIHRlc3QxID0gbmV3IFN0cmluZyhcImFiY1wiKTtcbiAgICAgICAgdGVzdDFbNV0gPSBcImRlXCI7XG4gICAgICAgIGlmIChPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcyh0ZXN0MSlbMF0gPT09IFwiNVwiKSB7XG4gICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIHZhciB0ZXN0MiA9IHt9O1xuICAgICAgICBmb3IgKHZhciBpMiA9IDA7IGkyIDwgMTA7IGkyKyspIHtcbiAgICAgICAgICB0ZXN0MltcIl9cIiArIFN0cmluZy5mcm9tQ2hhckNvZGUoaTIpXSA9IGkyO1xuICAgICAgICB9XG4gICAgICAgIHZhciBvcmRlcjIgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcyh0ZXN0MikubWFwKGZ1bmN0aW9uKG4yKSB7XG4gICAgICAgICAgcmV0dXJuIHRlc3QyW24yXTtcbiAgICAgICAgfSk7XG4gICAgICAgIGlmIChvcmRlcjIuam9pbihcIlwiKSAhPT0gXCIwMTIzNDU2Nzg5XCIpIHtcbiAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgICAgdmFyIHRlc3QzID0ge307XG4gICAgICAgIFwiYWJjZGVmZ2hpamtsbW5vcHFyc3RcIi5zcGxpdChcIlwiKS5mb3JFYWNoKGZ1bmN0aW9uKGxldHRlcikge1xuICAgICAgICAgIHRlc3QzW2xldHRlcl0gPSBsZXR0ZXI7XG4gICAgICAgIH0pO1xuICAgICAgICBpZiAoT2JqZWN0LmtleXMoT2JqZWN0LmFzc2lnbih7fSwgdGVzdDMpKS5qb2luKFwiXCIpICE9PSBcImFiY2RlZmdoaWprbG1ub3BxcnN0XCIpIHtcbiAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuICAgIH1cbiAgICBtb2R1bGUuZXhwb3J0cyA9IHNob3VsZFVzZU5hdGl2ZSgpID8gT2JqZWN0LmFzc2lnbiA6IGZ1bmN0aW9uKHRhcmdldCwgc291cmNlKSB7XG4gICAgICB2YXIgZnJvbTtcbiAgICAgIHZhciB0byA9IHRvT2JqZWN0KHRhcmdldCk7XG4gICAgICB2YXIgc3ltYm9scztcbiAgICAgIGZvciAodmFyIHMyID0gMTsgczIgPCBhcmd1bWVudHMubGVuZ3RoOyBzMisrKSB7XG4gICAgICAgIGZyb20gPSBPYmplY3QoYXJndW1lbnRzW3MyXSk7XG4gICAgICAgIGZvciAodmFyIGtleSBpbiBmcm9tKSB7XG4gICAgICAgICAgaWYgKGhhc093blByb3BlcnR5LmNhbGwoZnJvbSwga2V5KSkge1xuICAgICAgICAgICAgdG9ba2V5XSA9IGZyb21ba2V5XTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGdldE93blByb3BlcnR5U3ltYm9scykge1xuICAgICAgICAgIHN5bWJvbHMgPSBnZXRPd25Qcm9wZXJ0eVN5bWJvbHMoZnJvbSk7XG4gICAgICAgICAgZm9yICh2YXIgaTIgPSAwOyBpMiA8IHN5bWJvbHMubGVuZ3RoOyBpMisrKSB7XG4gICAgICAgICAgICBpZiAocHJvcElzRW51bWVyYWJsZS5jYWxsKGZyb20sIHN5bWJvbHNbaTJdKSkge1xuICAgICAgICAgICAgICB0b1tzeW1ib2xzW2kyXV0gPSBmcm9tW3N5bWJvbHNbaTJdXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHJldHVybiB0bztcbiAgICB9O1xuICB9XG59KTtcblxuLy8gbm9kZV9tb2R1bGVzL3Byb3AtdHlwZXMvbGliL1JlYWN0UHJvcFR5cGVzU2VjcmV0LmpzXG52YXIgcmVxdWlyZV9SZWFjdFByb3BUeXBlc1NlY3JldCA9IF9fY29tbW9uSlMoe1xuICBcIm5vZGVfbW9kdWxlcy9wcm9wLXR5cGVzL2xpYi9SZWFjdFByb3BUeXBlc1NlY3JldC5qc1wiKGV4cG9ydHMsIG1vZHVsZSkge1xuICAgIFwidXNlIHN0cmljdFwiO1xuICAgIHZhciBSZWFjdFByb3BUeXBlc1NlY3JldCA9IFwiU0VDUkVUX0RPX05PVF9QQVNTX1RISVNfT1JfWU9VX1dJTExfQkVfRklSRURcIjtcbiAgICBtb2R1bGUuZXhwb3J0cyA9IFJlYWN0UHJvcFR5cGVzU2VjcmV0O1xuICB9XG59KTtcblxuLy8gbm9kZV9tb2R1bGVzL3Byb3AtdHlwZXMvbGliL2hhcy5qc1xudmFyIHJlcXVpcmVfaGFzID0gX19jb21tb25KUyh7XG4gIFwibm9kZV9tb2R1bGVzL3Byb3AtdHlwZXMvbGliL2hhcy5qc1wiKGV4cG9ydHMsIG1vZHVsZSkge1xuICAgIG1vZHVsZS5leHBvcnRzID0gRnVuY3Rpb24uY2FsbC5iaW5kKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkpO1xuICB9XG59KTtcblxuLy8gbm9kZV9tb2R1bGVzL3Byb3AtdHlwZXMvY2hlY2tQcm9wVHlwZXMuanNcbnZhciByZXF1aXJlX2NoZWNrUHJvcFR5cGVzID0gX19jb21tb25KUyh7XG4gIFwibm9kZV9tb2R1bGVzL3Byb3AtdHlwZXMvY2hlY2tQcm9wVHlwZXMuanNcIihleHBvcnRzLCBtb2R1bGUpIHtcbiAgICBcInVzZSBzdHJpY3RcIjtcbiAgICB2YXIgcHJpbnRXYXJuaW5nID0gZnVuY3Rpb24oKSB7XG4gICAgfTtcbiAgICBpZiAodHJ1ZSkge1xuICAgICAgUmVhY3RQcm9wVHlwZXNTZWNyZXQgPSByZXF1aXJlX1JlYWN0UHJvcFR5cGVzU2VjcmV0KCk7XG4gICAgICBsb2dnZWRUeXBlRmFpbHVyZXMgPSB7fTtcbiAgICAgIGhhcyA9IHJlcXVpcmVfaGFzKCk7XG4gICAgICBwcmludFdhcm5pbmcgPSBmdW5jdGlvbih0ZXh0KSB7XG4gICAgICAgIHZhciBtZXNzYWdlID0gXCJXYXJuaW5nOiBcIiArIHRleHQ7XG4gICAgICAgIGlmICh0eXBlb2YgY29uc29sZSAhPT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgICAgIGNvbnNvbGUuZXJyb3IobWVzc2FnZSk7XG4gICAgICAgIH1cbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IobWVzc2FnZSk7XG4gICAgICAgIH0gY2F0Y2ggKHgyKSB7XG4gICAgICAgIH1cbiAgICAgIH07XG4gICAgfVxuICAgIHZhciBSZWFjdFByb3BUeXBlc1NlY3JldDtcbiAgICB2YXIgbG9nZ2VkVHlwZUZhaWx1cmVzO1xuICAgIHZhciBoYXM7XG4gICAgZnVuY3Rpb24gY2hlY2tQcm9wVHlwZXModHlwZVNwZWNzLCB2YWx1ZXMsIGxvY2F0aW9uLCBjb21wb25lbnROYW1lLCBnZXRTdGFjaykge1xuICAgICAgaWYgKHRydWUpIHtcbiAgICAgICAgZm9yICh2YXIgdHlwZVNwZWNOYW1lIGluIHR5cGVTcGVjcykge1xuICAgICAgICAgIGlmIChoYXModHlwZVNwZWNzLCB0eXBlU3BlY05hbWUpKSB7XG4gICAgICAgICAgICB2YXIgZXJyb3I7XG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICBpZiAodHlwZW9mIHR5cGVTcGVjc1t0eXBlU3BlY05hbWVdICE9PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgICAgICAgICAgICB2YXIgZXJyID0gRXJyb3IoXG4gICAgICAgICAgICAgICAgICAoY29tcG9uZW50TmFtZSB8fCBcIlJlYWN0IGNsYXNzXCIpICsgXCI6IFwiICsgbG9jYXRpb24gKyBcIiB0eXBlIGBcIiArIHR5cGVTcGVjTmFtZSArIFwiYCBpcyBpbnZhbGlkOyBpdCBtdXN0IGJlIGEgZnVuY3Rpb24sIHVzdWFsbHkgZnJvbSB0aGUgYHByb3AtdHlwZXNgIHBhY2thZ2UsIGJ1dCByZWNlaXZlZCBgXCIgKyB0eXBlb2YgdHlwZVNwZWNzW3R5cGVTcGVjTmFtZV0gKyBcImAuVGhpcyBvZnRlbiBoYXBwZW5zIGJlY2F1c2Ugb2YgdHlwb3Mgc3VjaCBhcyBgUHJvcFR5cGVzLmZ1bmN0aW9uYCBpbnN0ZWFkIG9mIGBQcm9wVHlwZXMuZnVuY2AuXCJcbiAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgIGVyci5uYW1lID0gXCJJbnZhcmlhbnQgVmlvbGF0aW9uXCI7XG4gICAgICAgICAgICAgICAgdGhyb3cgZXJyO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIGVycm9yID0gdHlwZVNwZWNzW3R5cGVTcGVjTmFtZV0odmFsdWVzLCB0eXBlU3BlY05hbWUsIGNvbXBvbmVudE5hbWUsIGxvY2F0aW9uLCBudWxsLCBSZWFjdFByb3BUeXBlc1NlY3JldCk7XG4gICAgICAgICAgICB9IGNhdGNoIChleCkge1xuICAgICAgICAgICAgICBlcnJvciA9IGV4O1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGVycm9yICYmICEoZXJyb3IgaW5zdGFuY2VvZiBFcnJvcikpIHtcbiAgICAgICAgICAgICAgcHJpbnRXYXJuaW5nKFxuICAgICAgICAgICAgICAgIChjb21wb25lbnROYW1lIHx8IFwiUmVhY3QgY2xhc3NcIikgKyBcIjogdHlwZSBzcGVjaWZpY2F0aW9uIG9mIFwiICsgbG9jYXRpb24gKyBcIiBgXCIgKyB0eXBlU3BlY05hbWUgKyBcImAgaXMgaW52YWxpZDsgdGhlIHR5cGUgY2hlY2tlciBmdW5jdGlvbiBtdXN0IHJldHVybiBgbnVsbGAgb3IgYW4gYEVycm9yYCBidXQgcmV0dXJuZWQgYSBcIiArIHR5cGVvZiBlcnJvciArIFwiLiBZb3UgbWF5IGhhdmUgZm9yZ290dGVuIHRvIHBhc3MgYW4gYXJndW1lbnQgdG8gdGhlIHR5cGUgY2hlY2tlciBjcmVhdG9yIChhcnJheU9mLCBpbnN0YW5jZU9mLCBvYmplY3RPZiwgb25lT2YsIG9uZU9mVHlwZSwgYW5kIHNoYXBlIGFsbCByZXF1aXJlIGFuIGFyZ3VtZW50KS5cIlxuICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGVycm9yIGluc3RhbmNlb2YgRXJyb3IgJiYgIShlcnJvci5tZXNzYWdlIGluIGxvZ2dlZFR5cGVGYWlsdXJlcykpIHtcbiAgICAgICAgICAgICAgbG9nZ2VkVHlwZUZhaWx1cmVzW2Vycm9yLm1lc3NhZ2VdID0gdHJ1ZTtcbiAgICAgICAgICAgICAgdmFyIHN0YWNrID0gZ2V0U3RhY2sgPyBnZXRTdGFjaygpIDogXCJcIjtcbiAgICAgICAgICAgICAgcHJpbnRXYXJuaW5nKFxuICAgICAgICAgICAgICAgIFwiRmFpbGVkIFwiICsgbG9jYXRpb24gKyBcIiB0eXBlOiBcIiArIGVycm9yLm1lc3NhZ2UgKyAoc3RhY2sgIT0gbnVsbCA/IHN0YWNrIDogXCJcIilcbiAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgY2hlY2tQcm9wVHlwZXMucmVzZXRXYXJuaW5nQ2FjaGUgPSBmdW5jdGlvbigpIHtcbiAgICAgIGlmICh0cnVlKSB7XG4gICAgICAgIGxvZ2dlZFR5cGVGYWlsdXJlcyA9IHt9O1xuICAgICAgfVxuICAgIH07XG4gICAgbW9kdWxlLmV4cG9ydHMgPSBjaGVja1Byb3BUeXBlcztcbiAgfVxufSk7XG5cbi8vIG5vZGVfbW9kdWxlcy9wcm9wLXR5cGVzL2ZhY3RvcnlXaXRoVHlwZUNoZWNrZXJzLmpzXG52YXIgcmVxdWlyZV9mYWN0b3J5V2l0aFR5cGVDaGVja2VycyA9IF9fY29tbW9uSlMoe1xuICBcIm5vZGVfbW9kdWxlcy9wcm9wLXR5cGVzL2ZhY3RvcnlXaXRoVHlwZUNoZWNrZXJzLmpzXCIoZXhwb3J0cywgbW9kdWxlKSB7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG4gICAgdmFyIFJlYWN0SXMgPSByZXF1aXJlX3JlYWN0X2lzKCk7XG4gICAgdmFyIGFzc2lnbiA9IHJlcXVpcmVfb2JqZWN0X2Fzc2lnbigpO1xuICAgIHZhciBSZWFjdFByb3BUeXBlc1NlY3JldCA9IHJlcXVpcmVfUmVhY3RQcm9wVHlwZXNTZWNyZXQoKTtcbiAgICB2YXIgaGFzID0gcmVxdWlyZV9oYXMoKTtcbiAgICB2YXIgY2hlY2tQcm9wVHlwZXMgPSByZXF1aXJlX2NoZWNrUHJvcFR5cGVzKCk7XG4gICAgdmFyIHByaW50V2FybmluZyA9IGZ1bmN0aW9uKCkge1xuICAgIH07XG4gICAgaWYgKHRydWUpIHtcbiAgICAgIHByaW50V2FybmluZyA9IGZ1bmN0aW9uKHRleHQpIHtcbiAgICAgICAgdmFyIG1lc3NhZ2UgPSBcIldhcm5pbmc6IFwiICsgdGV4dDtcbiAgICAgICAgaWYgKHR5cGVvZiBjb25zb2xlICE9PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgICAgICAgY29uc29sZS5lcnJvcihtZXNzYWdlKTtcbiAgICAgICAgfVxuICAgICAgICB0cnkge1xuICAgICAgICAgIHRocm93IG5ldyBFcnJvcihtZXNzYWdlKTtcbiAgICAgICAgfSBjYXRjaCAoeDIpIHtcbiAgICAgICAgfVxuICAgICAgfTtcbiAgICB9XG4gICAgZnVuY3Rpb24gZW1wdHlGdW5jdGlvblRoYXRSZXR1cm5zTnVsbCgpIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgICBtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGlzVmFsaWRFbGVtZW50LCB0aHJvd09uRGlyZWN0QWNjZXNzKSB7XG4gICAgICB2YXIgSVRFUkFUT1JfU1lNQk9MID0gdHlwZW9mIFN5bWJvbCA9PT0gXCJmdW5jdGlvblwiICYmIFN5bWJvbC5pdGVyYXRvcjtcbiAgICAgIHZhciBGQVVYX0lURVJBVE9SX1NZTUJPTCA9IFwiQEBpdGVyYXRvclwiO1xuICAgICAgZnVuY3Rpb24gZ2V0SXRlcmF0b3JGbihtYXliZUl0ZXJhYmxlKSB7XG4gICAgICAgIHZhciBpdGVyYXRvckZuID0gbWF5YmVJdGVyYWJsZSAmJiAoSVRFUkFUT1JfU1lNQk9MICYmIG1heWJlSXRlcmFibGVbSVRFUkFUT1JfU1lNQk9MXSB8fCBtYXliZUl0ZXJhYmxlW0ZBVVhfSVRFUkFUT1JfU1lNQk9MXSk7XG4gICAgICAgIGlmICh0eXBlb2YgaXRlcmF0b3JGbiA9PT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICAgICAgcmV0dXJuIGl0ZXJhdG9yRm47XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHZhciBBTk9OWU1PVVMgPSBcIjw8YW5vbnltb3VzPj5cIjtcbiAgICAgIHZhciBSZWFjdFByb3BUeXBlcyA9IHtcbiAgICAgICAgYXJyYXk6IGNyZWF0ZVByaW1pdGl2ZVR5cGVDaGVja2VyKFwiYXJyYXlcIiksXG4gICAgICAgIGJpZ2ludDogY3JlYXRlUHJpbWl0aXZlVHlwZUNoZWNrZXIoXCJiaWdpbnRcIiksXG4gICAgICAgIGJvb2w6IGNyZWF0ZVByaW1pdGl2ZVR5cGVDaGVja2VyKFwiYm9vbGVhblwiKSxcbiAgICAgICAgZnVuYzogY3JlYXRlUHJpbWl0aXZlVHlwZUNoZWNrZXIoXCJmdW5jdGlvblwiKSxcbiAgICAgICAgbnVtYmVyOiBjcmVhdGVQcmltaXRpdmVUeXBlQ2hlY2tlcihcIm51bWJlclwiKSxcbiAgICAgICAgb2JqZWN0OiBjcmVhdGVQcmltaXRpdmVUeXBlQ2hlY2tlcihcIm9iamVjdFwiKSxcbiAgICAgICAgc3RyaW5nOiBjcmVhdGVQcmltaXRpdmVUeXBlQ2hlY2tlcihcInN0cmluZ1wiKSxcbiAgICAgICAgc3ltYm9sOiBjcmVhdGVQcmltaXRpdmVUeXBlQ2hlY2tlcihcInN5bWJvbFwiKSxcbiAgICAgICAgYW55OiBjcmVhdGVBbnlUeXBlQ2hlY2tlcigpLFxuICAgICAgICBhcnJheU9mOiBjcmVhdGVBcnJheU9mVHlwZUNoZWNrZXIsXG4gICAgICAgIGVsZW1lbnQ6IGNyZWF0ZUVsZW1lbnRUeXBlQ2hlY2tlcigpLFxuICAgICAgICBlbGVtZW50VHlwZTogY3JlYXRlRWxlbWVudFR5cGVUeXBlQ2hlY2tlcigpLFxuICAgICAgICBpbnN0YW5jZU9mOiBjcmVhdGVJbnN0YW5jZVR5cGVDaGVja2VyLFxuICAgICAgICBub2RlOiBjcmVhdGVOb2RlQ2hlY2tlcigpLFxuICAgICAgICBvYmplY3RPZjogY3JlYXRlT2JqZWN0T2ZUeXBlQ2hlY2tlcixcbiAgICAgICAgb25lT2Y6IGNyZWF0ZUVudW1UeXBlQ2hlY2tlcixcbiAgICAgICAgb25lT2ZUeXBlOiBjcmVhdGVVbmlvblR5cGVDaGVja2VyLFxuICAgICAgICBzaGFwZTogY3JlYXRlU2hhcGVUeXBlQ2hlY2tlcixcbiAgICAgICAgZXhhY3Q6IGNyZWF0ZVN0cmljdFNoYXBlVHlwZUNoZWNrZXJcbiAgICAgIH07XG4gICAgICBmdW5jdGlvbiBpcyh4MiwgeTIpIHtcbiAgICAgICAgaWYgKHgyID09PSB5Mikge1xuICAgICAgICAgIHJldHVybiB4MiAhPT0gMCB8fCAxIC8geDIgPT09IDEgLyB5MjtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZXR1cm4geDIgIT09IHgyICYmIHkyICE9PSB5MjtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgZnVuY3Rpb24gUHJvcFR5cGVFcnJvcihtZXNzYWdlLCBkYXRhKSB7XG4gICAgICAgIHRoaXMubWVzc2FnZSA9IG1lc3NhZ2U7XG4gICAgICAgIHRoaXMuZGF0YSA9IGRhdGEgJiYgdHlwZW9mIGRhdGEgPT09IFwib2JqZWN0XCIgPyBkYXRhIDoge307XG4gICAgICAgIHRoaXMuc3RhY2sgPSBcIlwiO1xuICAgICAgfVxuICAgICAgUHJvcFR5cGVFcnJvci5wcm90b3R5cGUgPSBFcnJvci5wcm90b3R5cGU7XG4gICAgICBmdW5jdGlvbiBjcmVhdGVDaGFpbmFibGVUeXBlQ2hlY2tlcih2YWxpZGF0ZTIpIHtcbiAgICAgICAgaWYgKHRydWUpIHtcbiAgICAgICAgICB2YXIgbWFudWFsUHJvcFR5cGVDYWxsQ2FjaGUgPSB7fTtcbiAgICAgICAgICB2YXIgbWFudWFsUHJvcFR5cGVXYXJuaW5nQ291bnQgPSAwO1xuICAgICAgICB9XG4gICAgICAgIGZ1bmN0aW9uIGNoZWNrVHlwZShpc1JlcXVpcmVkLCBwcm9wcywgcHJvcE5hbWUsIGNvbXBvbmVudE5hbWUsIGxvY2F0aW9uLCBwcm9wRnVsbE5hbWUsIHNlY3JldCkge1xuICAgICAgICAgIGNvbXBvbmVudE5hbWUgPSBjb21wb25lbnROYW1lIHx8IEFOT05ZTU9VUztcbiAgICAgICAgICBwcm9wRnVsbE5hbWUgPSBwcm9wRnVsbE5hbWUgfHwgcHJvcE5hbWU7XG4gICAgICAgICAgaWYgKHNlY3JldCAhPT0gUmVhY3RQcm9wVHlwZXNTZWNyZXQpIHtcbiAgICAgICAgICAgIGlmICh0aHJvd09uRGlyZWN0QWNjZXNzKSB7XG4gICAgICAgICAgICAgIHZhciBlcnIgPSBuZXcgRXJyb3IoXG4gICAgICAgICAgICAgICAgXCJDYWxsaW5nIFByb3BUeXBlcyB2YWxpZGF0b3JzIGRpcmVjdGx5IGlzIG5vdCBzdXBwb3J0ZWQgYnkgdGhlIGBwcm9wLXR5cGVzYCBwYWNrYWdlLiBVc2UgYFByb3BUeXBlcy5jaGVja1Byb3BUeXBlcygpYCB0byBjYWxsIHRoZW0uIFJlYWQgbW9yZSBhdCBodHRwOi8vZmIubWUvdXNlLWNoZWNrLXByb3AtdHlwZXNcIlxuICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICBlcnIubmFtZSA9IFwiSW52YXJpYW50IFZpb2xhdGlvblwiO1xuICAgICAgICAgICAgICB0aHJvdyBlcnI7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKHR5cGVvZiBjb25zb2xlICE9PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgICAgICAgICAgIHZhciBjYWNoZUtleSA9IGNvbXBvbmVudE5hbWUgKyBcIjpcIiArIHByb3BOYW1lO1xuICAgICAgICAgICAgICBpZiAoIW1hbnVhbFByb3BUeXBlQ2FsbENhY2hlW2NhY2hlS2V5XSAmJiBtYW51YWxQcm9wVHlwZVdhcm5pbmdDb3VudCA8IDMpIHtcbiAgICAgICAgICAgICAgICBwcmludFdhcm5pbmcoXG4gICAgICAgICAgICAgICAgICBcIllvdSBhcmUgbWFudWFsbHkgY2FsbGluZyBhIFJlYWN0LlByb3BUeXBlcyB2YWxpZGF0aW9uIGZ1bmN0aW9uIGZvciB0aGUgYFwiICsgcHJvcEZ1bGxOYW1lICsgXCJgIHByb3Agb24gYFwiICsgY29tcG9uZW50TmFtZSArIFwiYC4gVGhpcyBpcyBkZXByZWNhdGVkIGFuZCB3aWxsIHRocm93IGluIHRoZSBzdGFuZGFsb25lIGBwcm9wLXR5cGVzYCBwYWNrYWdlLiBZb3UgbWF5IGJlIHNlZWluZyB0aGlzIHdhcm5pbmcgZHVlIHRvIGEgdGhpcmQtcGFydHkgUHJvcFR5cGVzIGxpYnJhcnkuIFNlZSBodHRwczovL2ZiLm1lL3JlYWN0LXdhcm5pbmctZG9udC1jYWxsLXByb3B0eXBlcyBmb3IgZGV0YWlscy5cIlxuICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgbWFudWFsUHJvcFR5cGVDYWxsQ2FjaGVbY2FjaGVLZXldID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICBtYW51YWxQcm9wVHlwZVdhcm5pbmdDb3VudCsrO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmIChwcm9wc1twcm9wTmFtZV0gPT0gbnVsbCkge1xuICAgICAgICAgICAgaWYgKGlzUmVxdWlyZWQpIHtcbiAgICAgICAgICAgICAgaWYgKHByb3BzW3Byb3BOYW1lXSA9PT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBuZXcgUHJvcFR5cGVFcnJvcihcIlRoZSBcIiArIGxvY2F0aW9uICsgXCIgYFwiICsgcHJvcEZ1bGxOYW1lICsgXCJgIGlzIG1hcmtlZCBhcyByZXF1aXJlZCBcIiArIChcImluIGBcIiArIGNvbXBvbmVudE5hbWUgKyBcImAsIGJ1dCBpdHMgdmFsdWUgaXMgYG51bGxgLlwiKSk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgcmV0dXJuIG5ldyBQcm9wVHlwZUVycm9yKFwiVGhlIFwiICsgbG9jYXRpb24gKyBcIiBgXCIgKyBwcm9wRnVsbE5hbWUgKyBcImAgaXMgbWFya2VkIGFzIHJlcXVpcmVkIGluIFwiICsgKFwiYFwiICsgY29tcG9uZW50TmFtZSArIFwiYCwgYnV0IGl0cyB2YWx1ZSBpcyBgdW5kZWZpbmVkYC5cIikpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiB2YWxpZGF0ZTIocHJvcHMsIHByb3BOYW1lLCBjb21wb25lbnROYW1lLCBsb2NhdGlvbiwgcHJvcEZ1bGxOYW1lKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgdmFyIGNoYWluZWRDaGVja1R5cGUgPSBjaGVja1R5cGUuYmluZChudWxsLCBmYWxzZSk7XG4gICAgICAgIGNoYWluZWRDaGVja1R5cGUuaXNSZXF1aXJlZCA9IGNoZWNrVHlwZS5iaW5kKG51bGwsIHRydWUpO1xuICAgICAgICByZXR1cm4gY2hhaW5lZENoZWNrVHlwZTtcbiAgICAgIH1cbiAgICAgIGZ1bmN0aW9uIGNyZWF0ZVByaW1pdGl2ZVR5cGVDaGVja2VyKGV4cGVjdGVkVHlwZSkge1xuICAgICAgICBmdW5jdGlvbiB2YWxpZGF0ZTIocHJvcHMsIHByb3BOYW1lLCBjb21wb25lbnROYW1lLCBsb2NhdGlvbiwgcHJvcEZ1bGxOYW1lLCBzZWNyZXQpIHtcbiAgICAgICAgICB2YXIgcHJvcFZhbHVlID0gcHJvcHNbcHJvcE5hbWVdO1xuICAgICAgICAgIHZhciBwcm9wVHlwZSA9IGdldFByb3BUeXBlKHByb3BWYWx1ZSk7XG4gICAgICAgICAgaWYgKHByb3BUeXBlICE9PSBleHBlY3RlZFR5cGUpIHtcbiAgICAgICAgICAgIHZhciBwcmVjaXNlVHlwZSA9IGdldFByZWNpc2VUeXBlKHByb3BWYWx1ZSk7XG4gICAgICAgICAgICByZXR1cm4gbmV3IFByb3BUeXBlRXJyb3IoXG4gICAgICAgICAgICAgIFwiSW52YWxpZCBcIiArIGxvY2F0aW9uICsgXCIgYFwiICsgcHJvcEZ1bGxOYW1lICsgXCJgIG9mIHR5cGUgXCIgKyAoXCJgXCIgKyBwcmVjaXNlVHlwZSArIFwiYCBzdXBwbGllZCB0byBgXCIgKyBjb21wb25lbnROYW1lICsgXCJgLCBleHBlY3RlZCBcIikgKyAoXCJgXCIgKyBleHBlY3RlZFR5cGUgKyBcImAuXCIpLFxuICAgICAgICAgICAgICB7IGV4cGVjdGVkVHlwZSB9XG4gICAgICAgICAgICApO1xuICAgICAgICAgIH1cbiAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gY3JlYXRlQ2hhaW5hYmxlVHlwZUNoZWNrZXIodmFsaWRhdGUyKTtcbiAgICAgIH1cbiAgICAgIGZ1bmN0aW9uIGNyZWF0ZUFueVR5cGVDaGVja2VyKCkge1xuICAgICAgICByZXR1cm4gY3JlYXRlQ2hhaW5hYmxlVHlwZUNoZWNrZXIoZW1wdHlGdW5jdGlvblRoYXRSZXR1cm5zTnVsbCk7XG4gICAgICB9XG4gICAgICBmdW5jdGlvbiBjcmVhdGVBcnJheU9mVHlwZUNoZWNrZXIodHlwZUNoZWNrZXIpIHtcbiAgICAgICAgZnVuY3Rpb24gdmFsaWRhdGUyKHByb3BzLCBwcm9wTmFtZSwgY29tcG9uZW50TmFtZSwgbG9jYXRpb24sIHByb3BGdWxsTmFtZSkge1xuICAgICAgICAgIGlmICh0eXBlb2YgdHlwZUNoZWNrZXIgIT09IFwiZnVuY3Rpb25cIikge1xuICAgICAgICAgICAgcmV0dXJuIG5ldyBQcm9wVHlwZUVycm9yKFwiUHJvcGVydHkgYFwiICsgcHJvcEZ1bGxOYW1lICsgXCJgIG9mIGNvbXBvbmVudCBgXCIgKyBjb21wb25lbnROYW1lICsgXCJgIGhhcyBpbnZhbGlkIFByb3BUeXBlIG5vdGF0aW9uIGluc2lkZSBhcnJheU9mLlwiKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgdmFyIHByb3BWYWx1ZSA9IHByb3BzW3Byb3BOYW1lXTtcbiAgICAgICAgICBpZiAoIUFycmF5LmlzQXJyYXkocHJvcFZhbHVlKSkge1xuICAgICAgICAgICAgdmFyIHByb3BUeXBlID0gZ2V0UHJvcFR5cGUocHJvcFZhbHVlKTtcbiAgICAgICAgICAgIHJldHVybiBuZXcgUHJvcFR5cGVFcnJvcihcIkludmFsaWQgXCIgKyBsb2NhdGlvbiArIFwiIGBcIiArIHByb3BGdWxsTmFtZSArIFwiYCBvZiB0eXBlIFwiICsgKFwiYFwiICsgcHJvcFR5cGUgKyBcImAgc3VwcGxpZWQgdG8gYFwiICsgY29tcG9uZW50TmFtZSArIFwiYCwgZXhwZWN0ZWQgYW4gYXJyYXkuXCIpKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgZm9yICh2YXIgaTIgPSAwOyBpMiA8IHByb3BWYWx1ZS5sZW5ndGg7IGkyKyspIHtcbiAgICAgICAgICAgIHZhciBlcnJvciA9IHR5cGVDaGVja2VyKHByb3BWYWx1ZSwgaTIsIGNvbXBvbmVudE5hbWUsIGxvY2F0aW9uLCBwcm9wRnVsbE5hbWUgKyBcIltcIiArIGkyICsgXCJdXCIsIFJlYWN0UHJvcFR5cGVzU2VjcmV0KTtcbiAgICAgICAgICAgIGlmIChlcnJvciBpbnN0YW5jZW9mIEVycm9yKSB7XG4gICAgICAgICAgICAgIHJldHVybiBlcnJvcjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGNyZWF0ZUNoYWluYWJsZVR5cGVDaGVja2VyKHZhbGlkYXRlMik7XG4gICAgICB9XG4gICAgICBmdW5jdGlvbiBjcmVhdGVFbGVtZW50VHlwZUNoZWNrZXIoKSB7XG4gICAgICAgIGZ1bmN0aW9uIHZhbGlkYXRlMihwcm9wcywgcHJvcE5hbWUsIGNvbXBvbmVudE5hbWUsIGxvY2F0aW9uLCBwcm9wRnVsbE5hbWUpIHtcbiAgICAgICAgICB2YXIgcHJvcFZhbHVlID0gcHJvcHNbcHJvcE5hbWVdO1xuICAgICAgICAgIGlmICghaXNWYWxpZEVsZW1lbnQocHJvcFZhbHVlKSkge1xuICAgICAgICAgICAgdmFyIHByb3BUeXBlID0gZ2V0UHJvcFR5cGUocHJvcFZhbHVlKTtcbiAgICAgICAgICAgIHJldHVybiBuZXcgUHJvcFR5cGVFcnJvcihcIkludmFsaWQgXCIgKyBsb2NhdGlvbiArIFwiIGBcIiArIHByb3BGdWxsTmFtZSArIFwiYCBvZiB0eXBlIFwiICsgKFwiYFwiICsgcHJvcFR5cGUgKyBcImAgc3VwcGxpZWQgdG8gYFwiICsgY29tcG9uZW50TmFtZSArIFwiYCwgZXhwZWN0ZWQgYSBzaW5nbGUgUmVhY3RFbGVtZW50LlwiKSk7XG4gICAgICAgICAgfVxuICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBjcmVhdGVDaGFpbmFibGVUeXBlQ2hlY2tlcih2YWxpZGF0ZTIpO1xuICAgICAgfVxuICAgICAgZnVuY3Rpb24gY3JlYXRlRWxlbWVudFR5cGVUeXBlQ2hlY2tlcigpIHtcbiAgICAgICAgZnVuY3Rpb24gdmFsaWRhdGUyKHByb3BzLCBwcm9wTmFtZSwgY29tcG9uZW50TmFtZSwgbG9jYXRpb24sIHByb3BGdWxsTmFtZSkge1xuICAgICAgICAgIHZhciBwcm9wVmFsdWUgPSBwcm9wc1twcm9wTmFtZV07XG4gICAgICAgICAgaWYgKCFSZWFjdElzLmlzVmFsaWRFbGVtZW50VHlwZShwcm9wVmFsdWUpKSB7XG4gICAgICAgICAgICB2YXIgcHJvcFR5cGUgPSBnZXRQcm9wVHlwZShwcm9wVmFsdWUpO1xuICAgICAgICAgICAgcmV0dXJuIG5ldyBQcm9wVHlwZUVycm9yKFwiSW52YWxpZCBcIiArIGxvY2F0aW9uICsgXCIgYFwiICsgcHJvcEZ1bGxOYW1lICsgXCJgIG9mIHR5cGUgXCIgKyAoXCJgXCIgKyBwcm9wVHlwZSArIFwiYCBzdXBwbGllZCB0byBgXCIgKyBjb21wb25lbnROYW1lICsgXCJgLCBleHBlY3RlZCBhIHNpbmdsZSBSZWFjdEVsZW1lbnQgdHlwZS5cIikpO1xuICAgICAgICAgIH1cbiAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gY3JlYXRlQ2hhaW5hYmxlVHlwZUNoZWNrZXIodmFsaWRhdGUyKTtcbiAgICAgIH1cbiAgICAgIGZ1bmN0aW9uIGNyZWF0ZUluc3RhbmNlVHlwZUNoZWNrZXIoZXhwZWN0ZWRDbGFzcykge1xuICAgICAgICBmdW5jdGlvbiB2YWxpZGF0ZTIocHJvcHMsIHByb3BOYW1lLCBjb21wb25lbnROYW1lLCBsb2NhdGlvbiwgcHJvcEZ1bGxOYW1lKSB7XG4gICAgICAgICAgaWYgKCEocHJvcHNbcHJvcE5hbWVdIGluc3RhbmNlb2YgZXhwZWN0ZWRDbGFzcykpIHtcbiAgICAgICAgICAgIHZhciBleHBlY3RlZENsYXNzTmFtZSA9IGV4cGVjdGVkQ2xhc3MubmFtZSB8fCBBTk9OWU1PVVM7XG4gICAgICAgICAgICB2YXIgYWN0dWFsQ2xhc3NOYW1lID0gZ2V0Q2xhc3NOYW1lKHByb3BzW3Byb3BOYW1lXSk7XG4gICAgICAgICAgICByZXR1cm4gbmV3IFByb3BUeXBlRXJyb3IoXCJJbnZhbGlkIFwiICsgbG9jYXRpb24gKyBcIiBgXCIgKyBwcm9wRnVsbE5hbWUgKyBcImAgb2YgdHlwZSBcIiArIChcImBcIiArIGFjdHVhbENsYXNzTmFtZSArIFwiYCBzdXBwbGllZCB0byBgXCIgKyBjb21wb25lbnROYW1lICsgXCJgLCBleHBlY3RlZCBcIikgKyAoXCJpbnN0YW5jZSBvZiBgXCIgKyBleHBlY3RlZENsYXNzTmFtZSArIFwiYC5cIikpO1xuICAgICAgICAgIH1cbiAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gY3JlYXRlQ2hhaW5hYmxlVHlwZUNoZWNrZXIodmFsaWRhdGUyKTtcbiAgICAgIH1cbiAgICAgIGZ1bmN0aW9uIGNyZWF0ZUVudW1UeXBlQ2hlY2tlcihleHBlY3RlZFZhbHVlcykge1xuICAgICAgICBpZiAoIUFycmF5LmlzQXJyYXkoZXhwZWN0ZWRWYWx1ZXMpKSB7XG4gICAgICAgICAgaWYgKHRydWUpIHtcbiAgICAgICAgICAgIGlmIChhcmd1bWVudHMubGVuZ3RoID4gMSkge1xuICAgICAgICAgICAgICBwcmludFdhcm5pbmcoXG4gICAgICAgICAgICAgICAgXCJJbnZhbGlkIGFyZ3VtZW50cyBzdXBwbGllZCB0byBvbmVPZiwgZXhwZWN0ZWQgYW4gYXJyYXksIGdvdCBcIiArIGFyZ3VtZW50cy5sZW5ndGggKyBcIiBhcmd1bWVudHMuIEEgY29tbW9uIG1pc3Rha2UgaXMgdG8gd3JpdGUgb25lT2YoeCwgeSwgeikgaW5zdGVhZCBvZiBvbmVPZihbeCwgeSwgel0pLlwiXG4gICAgICAgICAgICAgICk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICBwcmludFdhcm5pbmcoXCJJbnZhbGlkIGFyZ3VtZW50IHN1cHBsaWVkIHRvIG9uZU9mLCBleHBlY3RlZCBhbiBhcnJheS5cIik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICAgIHJldHVybiBlbXB0eUZ1bmN0aW9uVGhhdFJldHVybnNOdWxsO1xuICAgICAgICB9XG4gICAgICAgIGZ1bmN0aW9uIHZhbGlkYXRlMihwcm9wcywgcHJvcE5hbWUsIGNvbXBvbmVudE5hbWUsIGxvY2F0aW9uLCBwcm9wRnVsbE5hbWUpIHtcbiAgICAgICAgICB2YXIgcHJvcFZhbHVlID0gcHJvcHNbcHJvcE5hbWVdO1xuICAgICAgICAgIGZvciAodmFyIGkyID0gMDsgaTIgPCBleHBlY3RlZFZhbHVlcy5sZW5ndGg7IGkyKyspIHtcbiAgICAgICAgICAgIGlmIChpcyhwcm9wVmFsdWUsIGV4cGVjdGVkVmFsdWVzW2kyXSkpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICAgIHZhciB2YWx1ZXNTdHJpbmcgPSBKU09OLnN0cmluZ2lmeShleHBlY3RlZFZhbHVlcywgZnVuY3Rpb24gcmVwbGFjZXIoa2V5LCB2YWx1ZSkge1xuICAgICAgICAgICAgdmFyIHR5cGUgPSBnZXRQcmVjaXNlVHlwZSh2YWx1ZSk7XG4gICAgICAgICAgICBpZiAodHlwZSA9PT0gXCJzeW1ib2xcIikge1xuICAgICAgICAgICAgICByZXR1cm4gU3RyaW5nKHZhbHVlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiB2YWx1ZTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgICByZXR1cm4gbmV3IFByb3BUeXBlRXJyb3IoXCJJbnZhbGlkIFwiICsgbG9jYXRpb24gKyBcIiBgXCIgKyBwcm9wRnVsbE5hbWUgKyBcImAgb2YgdmFsdWUgYFwiICsgU3RyaW5nKHByb3BWYWx1ZSkgKyBcImAgXCIgKyAoXCJzdXBwbGllZCB0byBgXCIgKyBjb21wb25lbnROYW1lICsgXCJgLCBleHBlY3RlZCBvbmUgb2YgXCIgKyB2YWx1ZXNTdHJpbmcgKyBcIi5cIikpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBjcmVhdGVDaGFpbmFibGVUeXBlQ2hlY2tlcih2YWxpZGF0ZTIpO1xuICAgICAgfVxuICAgICAgZnVuY3Rpb24gY3JlYXRlT2JqZWN0T2ZUeXBlQ2hlY2tlcih0eXBlQ2hlY2tlcikge1xuICAgICAgICBmdW5jdGlvbiB2YWxpZGF0ZTIocHJvcHMsIHByb3BOYW1lLCBjb21wb25lbnROYW1lLCBsb2NhdGlvbiwgcHJvcEZ1bGxOYW1lKSB7XG4gICAgICAgICAgaWYgKHR5cGVvZiB0eXBlQ2hlY2tlciAhPT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICAgICAgICByZXR1cm4gbmV3IFByb3BUeXBlRXJyb3IoXCJQcm9wZXJ0eSBgXCIgKyBwcm9wRnVsbE5hbWUgKyBcImAgb2YgY29tcG9uZW50IGBcIiArIGNvbXBvbmVudE5hbWUgKyBcImAgaGFzIGludmFsaWQgUHJvcFR5cGUgbm90YXRpb24gaW5zaWRlIG9iamVjdE9mLlwiKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgdmFyIHByb3BWYWx1ZSA9IHByb3BzW3Byb3BOYW1lXTtcbiAgICAgICAgICB2YXIgcHJvcFR5cGUgPSBnZXRQcm9wVHlwZShwcm9wVmFsdWUpO1xuICAgICAgICAgIGlmIChwcm9wVHlwZSAhPT0gXCJvYmplY3RcIikge1xuICAgICAgICAgICAgcmV0dXJuIG5ldyBQcm9wVHlwZUVycm9yKFwiSW52YWxpZCBcIiArIGxvY2F0aW9uICsgXCIgYFwiICsgcHJvcEZ1bGxOYW1lICsgXCJgIG9mIHR5cGUgXCIgKyAoXCJgXCIgKyBwcm9wVHlwZSArIFwiYCBzdXBwbGllZCB0byBgXCIgKyBjb21wb25lbnROYW1lICsgXCJgLCBleHBlY3RlZCBhbiBvYmplY3QuXCIpKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgZm9yICh2YXIga2V5IGluIHByb3BWYWx1ZSkge1xuICAgICAgICAgICAgaWYgKGhhcyhwcm9wVmFsdWUsIGtleSkpIHtcbiAgICAgICAgICAgICAgdmFyIGVycm9yID0gdHlwZUNoZWNrZXIocHJvcFZhbHVlLCBrZXksIGNvbXBvbmVudE5hbWUsIGxvY2F0aW9uLCBwcm9wRnVsbE5hbWUgKyBcIi5cIiArIGtleSwgUmVhY3RQcm9wVHlwZXNTZWNyZXQpO1xuICAgICAgICAgICAgICBpZiAoZXJyb3IgaW5zdGFuY2VvZiBFcnJvcikge1xuICAgICAgICAgICAgICAgIHJldHVybiBlcnJvcjtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gY3JlYXRlQ2hhaW5hYmxlVHlwZUNoZWNrZXIodmFsaWRhdGUyKTtcbiAgICAgIH1cbiAgICAgIGZ1bmN0aW9uIGNyZWF0ZVVuaW9uVHlwZUNoZWNrZXIoYXJyYXlPZlR5cGVDaGVja2Vycykge1xuICAgICAgICBpZiAoIUFycmF5LmlzQXJyYXkoYXJyYXlPZlR5cGVDaGVja2VycykpIHtcbiAgICAgICAgICB0cnVlID8gcHJpbnRXYXJuaW5nKFwiSW52YWxpZCBhcmd1bWVudCBzdXBwbGllZCB0byBvbmVPZlR5cGUsIGV4cGVjdGVkIGFuIGluc3RhbmNlIG9mIGFycmF5LlwiKSA6IHZvaWQgMDtcbiAgICAgICAgICByZXR1cm4gZW1wdHlGdW5jdGlvblRoYXRSZXR1cm5zTnVsbDtcbiAgICAgICAgfVxuICAgICAgICBmb3IgKHZhciBpMiA9IDA7IGkyIDwgYXJyYXlPZlR5cGVDaGVja2Vycy5sZW5ndGg7IGkyKyspIHtcbiAgICAgICAgICB2YXIgY2hlY2tlciA9IGFycmF5T2ZUeXBlQ2hlY2tlcnNbaTJdO1xuICAgICAgICAgIGlmICh0eXBlb2YgY2hlY2tlciAhPT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICAgICAgICBwcmludFdhcm5pbmcoXG4gICAgICAgICAgICAgIFwiSW52YWxpZCBhcmd1bWVudCBzdXBwbGllZCB0byBvbmVPZlR5cGUuIEV4cGVjdGVkIGFuIGFycmF5IG9mIGNoZWNrIGZ1bmN0aW9ucywgYnV0IHJlY2VpdmVkIFwiICsgZ2V0UG9zdGZpeEZvclR5cGVXYXJuaW5nKGNoZWNrZXIpICsgXCIgYXQgaW5kZXggXCIgKyBpMiArIFwiLlwiXG4gICAgICAgICAgICApO1xuICAgICAgICAgICAgcmV0dXJuIGVtcHR5RnVuY3Rpb25UaGF0UmV0dXJuc051bGw7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGZ1bmN0aW9uIHZhbGlkYXRlMihwcm9wcywgcHJvcE5hbWUsIGNvbXBvbmVudE5hbWUsIGxvY2F0aW9uLCBwcm9wRnVsbE5hbWUpIHtcbiAgICAgICAgICB2YXIgZXhwZWN0ZWRUeXBlcyA9IFtdO1xuICAgICAgICAgIGZvciAodmFyIGkzID0gMDsgaTMgPCBhcnJheU9mVHlwZUNoZWNrZXJzLmxlbmd0aDsgaTMrKykge1xuICAgICAgICAgICAgdmFyIGNoZWNrZXIyID0gYXJyYXlPZlR5cGVDaGVja2Vyc1tpM107XG4gICAgICAgICAgICB2YXIgY2hlY2tlclJlc3VsdCA9IGNoZWNrZXIyKHByb3BzLCBwcm9wTmFtZSwgY29tcG9uZW50TmFtZSwgbG9jYXRpb24sIHByb3BGdWxsTmFtZSwgUmVhY3RQcm9wVHlwZXNTZWNyZXQpO1xuICAgICAgICAgICAgaWYgKGNoZWNrZXJSZXN1bHQgPT0gbnVsbCkge1xuICAgICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChjaGVja2VyUmVzdWx0LmRhdGEgJiYgaGFzKGNoZWNrZXJSZXN1bHQuZGF0YSwgXCJleHBlY3RlZFR5cGVcIikpIHtcbiAgICAgICAgICAgICAgZXhwZWN0ZWRUeXBlcy5wdXNoKGNoZWNrZXJSZXN1bHQuZGF0YS5leHBlY3RlZFR5cGUpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgICB2YXIgZXhwZWN0ZWRUeXBlc01lc3NhZ2UgPSBleHBlY3RlZFR5cGVzLmxlbmd0aCA+IDAgPyBcIiwgZXhwZWN0ZWQgb25lIG9mIHR5cGUgW1wiICsgZXhwZWN0ZWRUeXBlcy5qb2luKFwiLCBcIikgKyBcIl1cIiA6IFwiXCI7XG4gICAgICAgICAgcmV0dXJuIG5ldyBQcm9wVHlwZUVycm9yKFwiSW52YWxpZCBcIiArIGxvY2F0aW9uICsgXCIgYFwiICsgcHJvcEZ1bGxOYW1lICsgXCJgIHN1cHBsaWVkIHRvIFwiICsgKFwiYFwiICsgY29tcG9uZW50TmFtZSArIFwiYFwiICsgZXhwZWN0ZWRUeXBlc01lc3NhZ2UgKyBcIi5cIikpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBjcmVhdGVDaGFpbmFibGVUeXBlQ2hlY2tlcih2YWxpZGF0ZTIpO1xuICAgICAgfVxuICAgICAgZnVuY3Rpb24gY3JlYXRlTm9kZUNoZWNrZXIoKSB7XG4gICAgICAgIGZ1bmN0aW9uIHZhbGlkYXRlMihwcm9wcywgcHJvcE5hbWUsIGNvbXBvbmVudE5hbWUsIGxvY2F0aW9uLCBwcm9wRnVsbE5hbWUpIHtcbiAgICAgICAgICBpZiAoIWlzTm9kZShwcm9wc1twcm9wTmFtZV0pKSB7XG4gICAgICAgICAgICByZXR1cm4gbmV3IFByb3BUeXBlRXJyb3IoXCJJbnZhbGlkIFwiICsgbG9jYXRpb24gKyBcIiBgXCIgKyBwcm9wRnVsbE5hbWUgKyBcImAgc3VwcGxpZWQgdG8gXCIgKyAoXCJgXCIgKyBjb21wb25lbnROYW1lICsgXCJgLCBleHBlY3RlZCBhIFJlYWN0Tm9kZS5cIikpO1xuICAgICAgICAgIH1cbiAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gY3JlYXRlQ2hhaW5hYmxlVHlwZUNoZWNrZXIodmFsaWRhdGUyKTtcbiAgICAgIH1cbiAgICAgIGZ1bmN0aW9uIGludmFsaWRWYWxpZGF0b3JFcnJvcihjb21wb25lbnROYW1lLCBsb2NhdGlvbiwgcHJvcEZ1bGxOYW1lLCBrZXksIHR5cGUpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9wVHlwZUVycm9yKFxuICAgICAgICAgIChjb21wb25lbnROYW1lIHx8IFwiUmVhY3QgY2xhc3NcIikgKyBcIjogXCIgKyBsb2NhdGlvbiArIFwiIHR5cGUgYFwiICsgcHJvcEZ1bGxOYW1lICsgXCIuXCIgKyBrZXkgKyBcImAgaXMgaW52YWxpZDsgaXQgbXVzdCBiZSBhIGZ1bmN0aW9uLCB1c3VhbGx5IGZyb20gdGhlIGBwcm9wLXR5cGVzYCBwYWNrYWdlLCBidXQgcmVjZWl2ZWQgYFwiICsgdHlwZSArIFwiYC5cIlxuICAgICAgICApO1xuICAgICAgfVxuICAgICAgZnVuY3Rpb24gY3JlYXRlU2hhcGVUeXBlQ2hlY2tlcihzaGFwZVR5cGVzKSB7XG4gICAgICAgIGZ1bmN0aW9uIHZhbGlkYXRlMihwcm9wcywgcHJvcE5hbWUsIGNvbXBvbmVudE5hbWUsIGxvY2F0aW9uLCBwcm9wRnVsbE5hbWUpIHtcbiAgICAgICAgICB2YXIgcHJvcFZhbHVlID0gcHJvcHNbcHJvcE5hbWVdO1xuICAgICAgICAgIHZhciBwcm9wVHlwZSA9IGdldFByb3BUeXBlKHByb3BWYWx1ZSk7XG4gICAgICAgICAgaWYgKHByb3BUeXBlICE9PSBcIm9iamVjdFwiKSB7XG4gICAgICAgICAgICByZXR1cm4gbmV3IFByb3BUeXBlRXJyb3IoXCJJbnZhbGlkIFwiICsgbG9jYXRpb24gKyBcIiBgXCIgKyBwcm9wRnVsbE5hbWUgKyBcImAgb2YgdHlwZSBgXCIgKyBwcm9wVHlwZSArIFwiYCBcIiArIChcInN1cHBsaWVkIHRvIGBcIiArIGNvbXBvbmVudE5hbWUgKyBcImAsIGV4cGVjdGVkIGBvYmplY3RgLlwiKSk7XG4gICAgICAgICAgfVxuICAgICAgICAgIGZvciAodmFyIGtleSBpbiBzaGFwZVR5cGVzKSB7XG4gICAgICAgICAgICB2YXIgY2hlY2tlciA9IHNoYXBlVHlwZXNba2V5XTtcbiAgICAgICAgICAgIGlmICh0eXBlb2YgY2hlY2tlciAhPT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICAgICAgICAgIHJldHVybiBpbnZhbGlkVmFsaWRhdG9yRXJyb3IoY29tcG9uZW50TmFtZSwgbG9jYXRpb24sIHByb3BGdWxsTmFtZSwga2V5LCBnZXRQcmVjaXNlVHlwZShjaGVja2VyKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB2YXIgZXJyb3IgPSBjaGVja2VyKHByb3BWYWx1ZSwga2V5LCBjb21wb25lbnROYW1lLCBsb2NhdGlvbiwgcHJvcEZ1bGxOYW1lICsgXCIuXCIgKyBrZXksIFJlYWN0UHJvcFR5cGVzU2VjcmV0KTtcbiAgICAgICAgICAgIGlmIChlcnJvcikge1xuICAgICAgICAgICAgICByZXR1cm4gZXJyb3I7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBjcmVhdGVDaGFpbmFibGVUeXBlQ2hlY2tlcih2YWxpZGF0ZTIpO1xuICAgICAgfVxuICAgICAgZnVuY3Rpb24gY3JlYXRlU3RyaWN0U2hhcGVUeXBlQ2hlY2tlcihzaGFwZVR5cGVzKSB7XG4gICAgICAgIGZ1bmN0aW9uIHZhbGlkYXRlMihwcm9wcywgcHJvcE5hbWUsIGNvbXBvbmVudE5hbWUsIGxvY2F0aW9uLCBwcm9wRnVsbE5hbWUpIHtcbiAgICAgICAgICB2YXIgcHJvcFZhbHVlID0gcHJvcHNbcHJvcE5hbWVdO1xuICAgICAgICAgIHZhciBwcm9wVHlwZSA9IGdldFByb3BUeXBlKHByb3BWYWx1ZSk7XG4gICAgICAgICAgaWYgKHByb3BUeXBlICE9PSBcIm9iamVjdFwiKSB7XG4gICAgICAgICAgICByZXR1cm4gbmV3IFByb3BUeXBlRXJyb3IoXCJJbnZhbGlkIFwiICsgbG9jYXRpb24gKyBcIiBgXCIgKyBwcm9wRnVsbE5hbWUgKyBcImAgb2YgdHlwZSBgXCIgKyBwcm9wVHlwZSArIFwiYCBcIiArIChcInN1cHBsaWVkIHRvIGBcIiArIGNvbXBvbmVudE5hbWUgKyBcImAsIGV4cGVjdGVkIGBvYmplY3RgLlwiKSk7XG4gICAgICAgICAgfVxuICAgICAgICAgIHZhciBhbGxLZXlzID0gYXNzaWduKHt9LCBwcm9wc1twcm9wTmFtZV0sIHNoYXBlVHlwZXMpO1xuICAgICAgICAgIGZvciAodmFyIGtleSBpbiBhbGxLZXlzKSB7XG4gICAgICAgICAgICB2YXIgY2hlY2tlciA9IHNoYXBlVHlwZXNba2V5XTtcbiAgICAgICAgICAgIGlmIChoYXMoc2hhcGVUeXBlcywga2V5KSAmJiB0eXBlb2YgY2hlY2tlciAhPT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICAgICAgICAgIHJldHVybiBpbnZhbGlkVmFsaWRhdG9yRXJyb3IoY29tcG9uZW50TmFtZSwgbG9jYXRpb24sIHByb3BGdWxsTmFtZSwga2V5LCBnZXRQcmVjaXNlVHlwZShjaGVja2VyKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoIWNoZWNrZXIpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIG5ldyBQcm9wVHlwZUVycm9yKFxuICAgICAgICAgICAgICAgIFwiSW52YWxpZCBcIiArIGxvY2F0aW9uICsgXCIgYFwiICsgcHJvcEZ1bGxOYW1lICsgXCJgIGtleSBgXCIgKyBrZXkgKyBcImAgc3VwcGxpZWQgdG8gYFwiICsgY29tcG9uZW50TmFtZSArIFwiYC5cXG5CYWQgb2JqZWN0OiBcIiArIEpTT04uc3RyaW5naWZ5KHByb3BzW3Byb3BOYW1lXSwgbnVsbCwgXCIgIFwiKSArIFwiXFxuVmFsaWQga2V5czogXCIgKyBKU09OLnN0cmluZ2lmeShPYmplY3Qua2V5cyhzaGFwZVR5cGVzKSwgbnVsbCwgXCIgIFwiKVxuICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdmFyIGVycm9yID0gY2hlY2tlcihwcm9wVmFsdWUsIGtleSwgY29tcG9uZW50TmFtZSwgbG9jYXRpb24sIHByb3BGdWxsTmFtZSArIFwiLlwiICsga2V5LCBSZWFjdFByb3BUeXBlc1NlY3JldCk7XG4gICAgICAgICAgICBpZiAoZXJyb3IpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIGVycm9yO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gY3JlYXRlQ2hhaW5hYmxlVHlwZUNoZWNrZXIodmFsaWRhdGUyKTtcbiAgICAgIH1cbiAgICAgIGZ1bmN0aW9uIGlzTm9kZShwcm9wVmFsdWUpIHtcbiAgICAgICAgc3dpdGNoICh0eXBlb2YgcHJvcFZhbHVlKSB7XG4gICAgICAgICAgY2FzZSBcIm51bWJlclwiOlxuICAgICAgICAgIGNhc2UgXCJzdHJpbmdcIjpcbiAgICAgICAgICBjYXNlIFwidW5kZWZpbmVkXCI6XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICBjYXNlIFwiYm9vbGVhblwiOlxuICAgICAgICAgICAgcmV0dXJuICFwcm9wVmFsdWU7XG4gICAgICAgICAgY2FzZSBcIm9iamVjdFwiOlxuICAgICAgICAgICAgaWYgKEFycmF5LmlzQXJyYXkocHJvcFZhbHVlKSkge1xuICAgICAgICAgICAgICByZXR1cm4gcHJvcFZhbHVlLmV2ZXJ5KGlzTm9kZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAocHJvcFZhbHVlID09PSBudWxsIHx8IGlzVmFsaWRFbGVtZW50KHByb3BWYWx1ZSkpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB2YXIgaXRlcmF0b3JGbiA9IGdldEl0ZXJhdG9yRm4ocHJvcFZhbHVlKTtcbiAgICAgICAgICAgIGlmIChpdGVyYXRvckZuKSB7XG4gICAgICAgICAgICAgIHZhciBpdGVyYXRvciA9IGl0ZXJhdG9yRm4uY2FsbChwcm9wVmFsdWUpO1xuICAgICAgICAgICAgICB2YXIgc3RlcDtcbiAgICAgICAgICAgICAgaWYgKGl0ZXJhdG9yRm4gIT09IHByb3BWYWx1ZS5lbnRyaWVzKSB7XG4gICAgICAgICAgICAgICAgd2hpbGUgKCEoc3RlcCA9IGl0ZXJhdG9yLm5leHQoKSkuZG9uZSkge1xuICAgICAgICAgICAgICAgICAgaWYgKCFpc05vZGUoc3RlcC52YWx1ZSkpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB3aGlsZSAoIShzdGVwID0gaXRlcmF0b3IubmV4dCgpKS5kb25lKSB7XG4gICAgICAgICAgICAgICAgICB2YXIgZW50cnkgPSBzdGVwLnZhbHVlO1xuICAgICAgICAgICAgICAgICAgaWYgKGVudHJ5KSB7XG4gICAgICAgICAgICAgICAgICAgIGlmICghaXNOb2RlKGVudHJ5WzFdKSkge1xuICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgZnVuY3Rpb24gaXNTeW1ib2wocHJvcFR5cGUsIHByb3BWYWx1ZSkge1xuICAgICAgICBpZiAocHJvcFR5cGUgPT09IFwic3ltYm9sXCIpIHtcbiAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoIXByb3BWYWx1ZSkge1xuICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgICBpZiAocHJvcFZhbHVlW1wiQEB0b1N0cmluZ1RhZ1wiXSA9PT0gXCJTeW1ib2xcIikge1xuICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0eXBlb2YgU3ltYm9sID09PSBcImZ1bmN0aW9uXCIgJiYgcHJvcFZhbHVlIGluc3RhbmNlb2YgU3ltYm9sKSB7XG4gICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuICAgICAgZnVuY3Rpb24gZ2V0UHJvcFR5cGUocHJvcFZhbHVlKSB7XG4gICAgICAgIHZhciBwcm9wVHlwZSA9IHR5cGVvZiBwcm9wVmFsdWU7XG4gICAgICAgIGlmIChBcnJheS5pc0FycmF5KHByb3BWYWx1ZSkpIHtcbiAgICAgICAgICByZXR1cm4gXCJhcnJheVwiO1xuICAgICAgICB9XG4gICAgICAgIGlmIChwcm9wVmFsdWUgaW5zdGFuY2VvZiBSZWdFeHApIHtcbiAgICAgICAgICByZXR1cm4gXCJvYmplY3RcIjtcbiAgICAgICAgfVxuICAgICAgICBpZiAoaXNTeW1ib2wocHJvcFR5cGUsIHByb3BWYWx1ZSkpIHtcbiAgICAgICAgICByZXR1cm4gXCJzeW1ib2xcIjtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcHJvcFR5cGU7XG4gICAgICB9XG4gICAgICBmdW5jdGlvbiBnZXRQcmVjaXNlVHlwZShwcm9wVmFsdWUpIHtcbiAgICAgICAgaWYgKHR5cGVvZiBwcm9wVmFsdWUgPT09IFwidW5kZWZpbmVkXCIgfHwgcHJvcFZhbHVlID09PSBudWxsKSB7XG4gICAgICAgICAgcmV0dXJuIFwiXCIgKyBwcm9wVmFsdWU7XG4gICAgICAgIH1cbiAgICAgICAgdmFyIHByb3BUeXBlID0gZ2V0UHJvcFR5cGUocHJvcFZhbHVlKTtcbiAgICAgICAgaWYgKHByb3BUeXBlID09PSBcIm9iamVjdFwiKSB7XG4gICAgICAgICAgaWYgKHByb3BWYWx1ZSBpbnN0YW5jZW9mIERhdGUpIHtcbiAgICAgICAgICAgIHJldHVybiBcImRhdGVcIjtcbiAgICAgICAgICB9IGVsc2UgaWYgKHByb3BWYWx1ZSBpbnN0YW5jZW9mIFJlZ0V4cCkge1xuICAgICAgICAgICAgcmV0dXJuIFwicmVnZXhwXCI7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBwcm9wVHlwZTtcbiAgICAgIH1cbiAgICAgIGZ1bmN0aW9uIGdldFBvc3RmaXhGb3JUeXBlV2FybmluZyh2YWx1ZSkge1xuICAgICAgICB2YXIgdHlwZSA9IGdldFByZWNpc2VUeXBlKHZhbHVlKTtcbiAgICAgICAgc3dpdGNoICh0eXBlKSB7XG4gICAgICAgICAgY2FzZSBcImFycmF5XCI6XG4gICAgICAgICAgY2FzZSBcIm9iamVjdFwiOlxuICAgICAgICAgICAgcmV0dXJuIFwiYW4gXCIgKyB0eXBlO1xuICAgICAgICAgIGNhc2UgXCJib29sZWFuXCI6XG4gICAgICAgICAgY2FzZSBcImRhdGVcIjpcbiAgICAgICAgICBjYXNlIFwicmVnZXhwXCI6XG4gICAgICAgICAgICByZXR1cm4gXCJhIFwiICsgdHlwZTtcbiAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgcmV0dXJuIHR5cGU7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGZ1bmN0aW9uIGdldENsYXNzTmFtZShwcm9wVmFsdWUpIHtcbiAgICAgICAgaWYgKCFwcm9wVmFsdWUuY29uc3RydWN0b3IgfHwgIXByb3BWYWx1ZS5jb25zdHJ1Y3Rvci5uYW1lKSB7XG4gICAgICAgICAgcmV0dXJuIEFOT05ZTU9VUztcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcHJvcFZhbHVlLmNvbnN0cnVjdG9yLm5hbWU7XG4gICAgICB9XG4gICAgICBSZWFjdFByb3BUeXBlcy5jaGVja1Byb3BUeXBlcyA9IGNoZWNrUHJvcFR5cGVzO1xuICAgICAgUmVhY3RQcm9wVHlwZXMucmVzZXRXYXJuaW5nQ2FjaGUgPSBjaGVja1Byb3BUeXBlcy5yZXNldFdhcm5pbmdDYWNoZTtcbiAgICAgIFJlYWN0UHJvcFR5cGVzLlByb3BUeXBlcyA9IFJlYWN0UHJvcFR5cGVzO1xuICAgICAgcmV0dXJuIFJlYWN0UHJvcFR5cGVzO1xuICAgIH07XG4gIH1cbn0pO1xuXG4vLyBub2RlX21vZHVsZXMvcHJvcC10eXBlcy9pbmRleC5qc1xudmFyIHJlcXVpcmVfcHJvcF90eXBlcyA9IF9fY29tbW9uSlMoe1xuICBcIm5vZGVfbW9kdWxlcy9wcm9wLXR5cGVzL2luZGV4LmpzXCIoZXhwb3J0cywgbW9kdWxlKSB7XG4gICAgaWYgKHRydWUpIHtcbiAgICAgIFJlYWN0SXMgPSByZXF1aXJlX3JlYWN0X2lzKCk7XG4gICAgICB0aHJvd09uRGlyZWN0QWNjZXNzID0gdHJ1ZTtcbiAgICAgIG1vZHVsZS5leHBvcnRzID0gcmVxdWlyZV9mYWN0b3J5V2l0aFR5cGVDaGVja2VycygpKFJlYWN0SXMuaXNFbGVtZW50LCB0aHJvd09uRGlyZWN0QWNjZXNzKTtcbiAgICB9IGVsc2Uge1xuICAgICAgbW9kdWxlLmV4cG9ydHMgPSBudWxsKCk7XG4gICAgfVxuICAgIHZhciBSZWFjdElzO1xuICAgIHZhciB0aHJvd09uRGlyZWN0QWNjZXNzO1xuICB9XG59KTtcblxuLy8gbm9kZV9tb2R1bGVzL2hvaXN0LW5vbi1yZWFjdC1zdGF0aWNzL2Rpc3QvaG9pc3Qtbm9uLXJlYWN0LXN0YXRpY3MuY2pzLmpzXG52YXIgcmVxdWlyZV9ob2lzdF9ub25fcmVhY3Rfc3RhdGljc19janMgPSBfX2NvbW1vbkpTKHtcbiAgXCJub2RlX21vZHVsZXMvaG9pc3Qtbm9uLXJlYWN0LXN0YXRpY3MvZGlzdC9ob2lzdC1ub24tcmVhY3Qtc3RhdGljcy5janMuanNcIihleHBvcnRzLCBtb2R1bGUpIHtcbiAgICBcInVzZSBzdHJpY3RcIjtcbiAgICB2YXIgcmVhY3RJcyA9IHJlcXVpcmVfcmVhY3RfaXMoKTtcbiAgICB2YXIgUkVBQ1RfU1RBVElDUyA9IHtcbiAgICAgIGNoaWxkQ29udGV4dFR5cGVzOiB0cnVlLFxuICAgICAgY29udGV4dFR5cGU6IHRydWUsXG4gICAgICBjb250ZXh0VHlwZXM6IHRydWUsXG4gICAgICBkZWZhdWx0UHJvcHM6IHRydWUsXG4gICAgICBkaXNwbGF5TmFtZTogdHJ1ZSxcbiAgICAgIGdldERlZmF1bHRQcm9wczogdHJ1ZSxcbiAgICAgIGdldERlcml2ZWRTdGF0ZUZyb21FcnJvcjogdHJ1ZSxcbiAgICAgIGdldERlcml2ZWRTdGF0ZUZyb21Qcm9wczogdHJ1ZSxcbiAgICAgIG1peGluczogdHJ1ZSxcbiAgICAgIHByb3BUeXBlczogdHJ1ZSxcbiAgICAgIHR5cGU6IHRydWVcbiAgICB9O1xuICAgIHZhciBLTk9XTl9TVEFUSUNTID0ge1xuICAgICAgbmFtZTogdHJ1ZSxcbiAgICAgIGxlbmd0aDogdHJ1ZSxcbiAgICAgIHByb3RvdHlwZTogdHJ1ZSxcbiAgICAgIGNhbGxlcjogdHJ1ZSxcbiAgICAgIGNhbGxlZTogdHJ1ZSxcbiAgICAgIGFyZ3VtZW50czogdHJ1ZSxcbiAgICAgIGFyaXR5OiB0cnVlXG4gICAgfTtcbiAgICB2YXIgRk9SV0FSRF9SRUZfU1RBVElDUyA9IHtcbiAgICAgIFwiJCR0eXBlb2ZcIjogdHJ1ZSxcbiAgICAgIHJlbmRlcjogdHJ1ZSxcbiAgICAgIGRlZmF1bHRQcm9wczogdHJ1ZSxcbiAgICAgIGRpc3BsYXlOYW1lOiB0cnVlLFxuICAgICAgcHJvcFR5cGVzOiB0cnVlXG4gICAgfTtcbiAgICB2YXIgTUVNT19TVEFUSUNTID0ge1xuICAgICAgXCIkJHR5cGVvZlwiOiB0cnVlLFxuICAgICAgY29tcGFyZTogdHJ1ZSxcbiAgICAgIGRlZmF1bHRQcm9wczogdHJ1ZSxcbiAgICAgIGRpc3BsYXlOYW1lOiB0cnVlLFxuICAgICAgcHJvcFR5cGVzOiB0cnVlLFxuICAgICAgdHlwZTogdHJ1ZVxuICAgIH07XG4gICAgdmFyIFRZUEVfU1RBVElDUyA9IHt9O1xuICAgIFRZUEVfU1RBVElDU1tyZWFjdElzLkZvcndhcmRSZWZdID0gRk9SV0FSRF9SRUZfU1RBVElDUztcbiAgICBUWVBFX1NUQVRJQ1NbcmVhY3RJcy5NZW1vXSA9IE1FTU9fU1RBVElDUztcbiAgICBmdW5jdGlvbiBnZXRTdGF0aWNzKGNvbXBvbmVudCkge1xuICAgICAgaWYgKHJlYWN0SXMuaXNNZW1vKGNvbXBvbmVudCkpIHtcbiAgICAgICAgcmV0dXJuIE1FTU9fU1RBVElDUztcbiAgICAgIH1cbiAgICAgIHJldHVybiBUWVBFX1NUQVRJQ1NbY29tcG9uZW50W1wiJCR0eXBlb2ZcIl1dIHx8IFJFQUNUX1NUQVRJQ1M7XG4gICAgfVxuICAgIHZhciBkZWZpbmVQcm9wZXJ0eSA9IE9iamVjdC5kZWZpbmVQcm9wZXJ0eTtcbiAgICB2YXIgZ2V0T3duUHJvcGVydHlOYW1lcyA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eU5hbWVzO1xuICAgIHZhciBnZXRPd25Qcm9wZXJ0eVN5bWJvbHMgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlTeW1ib2xzO1xuICAgIHZhciBnZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yO1xuICAgIHZhciBnZXRQcm90b3R5cGVPZiA9IE9iamVjdC5nZXRQcm90b3R5cGVPZjtcbiAgICB2YXIgb2JqZWN0UHJvdG90eXBlID0gT2JqZWN0LnByb3RvdHlwZTtcbiAgICBmdW5jdGlvbiBob2lzdE5vblJlYWN0U3RhdGljcyh0YXJnZXRDb21wb25lbnQsIHNvdXJjZUNvbXBvbmVudCwgYmxhY2tsaXN0KSB7XG4gICAgICBpZiAodHlwZW9mIHNvdXJjZUNvbXBvbmVudCAhPT0gXCJzdHJpbmdcIikge1xuICAgICAgICBpZiAob2JqZWN0UHJvdG90eXBlKSB7XG4gICAgICAgICAgdmFyIGluaGVyaXRlZENvbXBvbmVudCA9IGdldFByb3RvdHlwZU9mKHNvdXJjZUNvbXBvbmVudCk7XG4gICAgICAgICAgaWYgKGluaGVyaXRlZENvbXBvbmVudCAmJiBpbmhlcml0ZWRDb21wb25lbnQgIT09IG9iamVjdFByb3RvdHlwZSkge1xuICAgICAgICAgICAgaG9pc3ROb25SZWFjdFN0YXRpY3ModGFyZ2V0Q29tcG9uZW50LCBpbmhlcml0ZWRDb21wb25lbnQsIGJsYWNrbGlzdCk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHZhciBrZXlzID0gZ2V0T3duUHJvcGVydHlOYW1lcyhzb3VyY2VDb21wb25lbnQpO1xuICAgICAgICBpZiAoZ2V0T3duUHJvcGVydHlTeW1ib2xzKSB7XG4gICAgICAgICAga2V5cyA9IGtleXMuY29uY2F0KGdldE93blByb3BlcnR5U3ltYm9scyhzb3VyY2VDb21wb25lbnQpKTtcbiAgICAgICAgfVxuICAgICAgICB2YXIgdGFyZ2V0U3RhdGljcyA9IGdldFN0YXRpY3ModGFyZ2V0Q29tcG9uZW50KTtcbiAgICAgICAgdmFyIHNvdXJjZVN0YXRpY3MgPSBnZXRTdGF0aWNzKHNvdXJjZUNvbXBvbmVudCk7XG4gICAgICAgIGZvciAodmFyIGkyID0gMDsgaTIgPCBrZXlzLmxlbmd0aDsgKytpMikge1xuICAgICAgICAgIHZhciBrZXkgPSBrZXlzW2kyXTtcbiAgICAgICAgICBpZiAoIUtOT1dOX1NUQVRJQ1Nba2V5XSAmJiAhKGJsYWNrbGlzdCAmJiBibGFja2xpc3Rba2V5XSkgJiYgIShzb3VyY2VTdGF0aWNzICYmIHNvdXJjZVN0YXRpY3Nba2V5XSkgJiYgISh0YXJnZXRTdGF0aWNzICYmIHRhcmdldFN0YXRpY3Nba2V5XSkpIHtcbiAgICAgICAgICAgIHZhciBkZXNjcmlwdG9yID0gZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKHNvdXJjZUNvbXBvbmVudCwga2V5KTtcbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgIGRlZmluZVByb3BlcnR5KHRhcmdldENvbXBvbmVudCwga2V5LCBkZXNjcmlwdG9yKTtcbiAgICAgICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHJldHVybiB0YXJnZXRDb21wb25lbnQ7XG4gICAgfVxuICAgIG1vZHVsZS5leHBvcnRzID0gaG9pc3ROb25SZWFjdFN0YXRpY3M7XG4gIH1cbn0pO1xuXG4vLyBub2RlX21vZHVsZXMvcmVhY3QtcmVkdXgvbm9kZV9tb2R1bGVzL3JlYWN0LWlzL2Nqcy9yZWFjdC1pcy5kZXZlbG9wbWVudC5qc1xudmFyIHJlcXVpcmVfcmVhY3RfaXNfZGV2ZWxvcG1lbnQyID0gX19jb21tb25KUyh7XG4gIFwibm9kZV9tb2R1bGVzL3JlYWN0LXJlZHV4L25vZGVfbW9kdWxlcy9yZWFjdC1pcy9janMvcmVhY3QtaXMuZGV2ZWxvcG1lbnQuanNcIihleHBvcnRzKSB7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG4gICAgaWYgKHRydWUpIHtcbiAgICAgIChmdW5jdGlvbigpIHtcbiAgICAgICAgXCJ1c2Ugc3RyaWN0XCI7XG4gICAgICAgIHZhciBSRUFDVF9FTEVNRU5UX1RZUEUgPSA2MDEwMztcbiAgICAgICAgdmFyIFJFQUNUX1BPUlRBTF9UWVBFID0gNjAxMDY7XG4gICAgICAgIHZhciBSRUFDVF9GUkFHTUVOVF9UWVBFID0gNjAxMDc7XG4gICAgICAgIHZhciBSRUFDVF9TVFJJQ1RfTU9ERV9UWVBFID0gNjAxMDg7XG4gICAgICAgIHZhciBSRUFDVF9QUk9GSUxFUl9UWVBFID0gNjAxMTQ7XG4gICAgICAgIHZhciBSRUFDVF9QUk9WSURFUl9UWVBFID0gNjAxMDk7XG4gICAgICAgIHZhciBSRUFDVF9DT05URVhUX1RZUEUgPSA2MDExMDtcbiAgICAgICAgdmFyIFJFQUNUX0ZPUldBUkRfUkVGX1RZUEUgPSA2MDExMjtcbiAgICAgICAgdmFyIFJFQUNUX1NVU1BFTlNFX1RZUEUgPSA2MDExMztcbiAgICAgICAgdmFyIFJFQUNUX1NVU1BFTlNFX0xJU1RfVFlQRSA9IDYwMTIwO1xuICAgICAgICB2YXIgUkVBQ1RfTUVNT19UWVBFID0gNjAxMTU7XG4gICAgICAgIHZhciBSRUFDVF9MQVpZX1RZUEUgPSA2MDExNjtcbiAgICAgICAgdmFyIFJFQUNUX0JMT0NLX1RZUEUgPSA2MDEyMTtcbiAgICAgICAgdmFyIFJFQUNUX1NFUlZFUl9CTE9DS19UWVBFID0gNjAxMjI7XG4gICAgICAgIHZhciBSRUFDVF9GVU5EQU1FTlRBTF9UWVBFID0gNjAxMTc7XG4gICAgICAgIHZhciBSRUFDVF9TQ09QRV9UWVBFID0gNjAxMTk7XG4gICAgICAgIHZhciBSRUFDVF9PUEFRVUVfSURfVFlQRSA9IDYwMTI4O1xuICAgICAgICB2YXIgUkVBQ1RfREVCVUdfVFJBQ0lOR19NT0RFX1RZUEUgPSA2MDEyOTtcbiAgICAgICAgdmFyIFJFQUNUX09GRlNDUkVFTl9UWVBFID0gNjAxMzA7XG4gICAgICAgIHZhciBSRUFDVF9MRUdBQ1lfSElEREVOX1RZUEUgPSA2MDEzMTtcbiAgICAgICAgaWYgKHR5cGVvZiBTeW1ib2wgPT09IFwiZnVuY3Rpb25cIiAmJiBTeW1ib2wuZm9yKSB7XG4gICAgICAgICAgdmFyIHN5bWJvbEZvciA9IFN5bWJvbC5mb3I7XG4gICAgICAgICAgUkVBQ1RfRUxFTUVOVF9UWVBFID0gc3ltYm9sRm9yKFwicmVhY3QuZWxlbWVudFwiKTtcbiAgICAgICAgICBSRUFDVF9QT1JUQUxfVFlQRSA9IHN5bWJvbEZvcihcInJlYWN0LnBvcnRhbFwiKTtcbiAgICAgICAgICBSRUFDVF9GUkFHTUVOVF9UWVBFID0gc3ltYm9sRm9yKFwicmVhY3QuZnJhZ21lbnRcIik7XG4gICAgICAgICAgUkVBQ1RfU1RSSUNUX01PREVfVFlQRSA9IHN5bWJvbEZvcihcInJlYWN0LnN0cmljdF9tb2RlXCIpO1xuICAgICAgICAgIFJFQUNUX1BST0ZJTEVSX1RZUEUgPSBzeW1ib2xGb3IoXCJyZWFjdC5wcm9maWxlclwiKTtcbiAgICAgICAgICBSRUFDVF9QUk9WSURFUl9UWVBFID0gc3ltYm9sRm9yKFwicmVhY3QucHJvdmlkZXJcIik7XG4gICAgICAgICAgUkVBQ1RfQ09OVEVYVF9UWVBFID0gc3ltYm9sRm9yKFwicmVhY3QuY29udGV4dFwiKTtcbiAgICAgICAgICBSRUFDVF9GT1JXQVJEX1JFRl9UWVBFID0gc3ltYm9sRm9yKFwicmVhY3QuZm9yd2FyZF9yZWZcIik7XG4gICAgICAgICAgUkVBQ1RfU1VTUEVOU0VfVFlQRSA9IHN5bWJvbEZvcihcInJlYWN0LnN1c3BlbnNlXCIpO1xuICAgICAgICAgIFJFQUNUX1NVU1BFTlNFX0xJU1RfVFlQRSA9IHN5bWJvbEZvcihcInJlYWN0LnN1c3BlbnNlX2xpc3RcIik7XG4gICAgICAgICAgUkVBQ1RfTUVNT19UWVBFID0gc3ltYm9sRm9yKFwicmVhY3QubWVtb1wiKTtcbiAgICAgICAgICBSRUFDVF9MQVpZX1RZUEUgPSBzeW1ib2xGb3IoXCJyZWFjdC5sYXp5XCIpO1xuICAgICAgICAgIFJFQUNUX0JMT0NLX1RZUEUgPSBzeW1ib2xGb3IoXCJyZWFjdC5ibG9ja1wiKTtcbiAgICAgICAgICBSRUFDVF9TRVJWRVJfQkxPQ0tfVFlQRSA9IHN5bWJvbEZvcihcInJlYWN0LnNlcnZlci5ibG9ja1wiKTtcbiAgICAgICAgICBSRUFDVF9GVU5EQU1FTlRBTF9UWVBFID0gc3ltYm9sRm9yKFwicmVhY3QuZnVuZGFtZW50YWxcIik7XG4gICAgICAgICAgUkVBQ1RfU0NPUEVfVFlQRSA9IHN5bWJvbEZvcihcInJlYWN0LnNjb3BlXCIpO1xuICAgICAgICAgIFJFQUNUX09QQVFVRV9JRF9UWVBFID0gc3ltYm9sRm9yKFwicmVhY3Qub3BhcXVlLmlkXCIpO1xuICAgICAgICAgIFJFQUNUX0RFQlVHX1RSQUNJTkdfTU9ERV9UWVBFID0gc3ltYm9sRm9yKFwicmVhY3QuZGVidWdfdHJhY2VfbW9kZVwiKTtcbiAgICAgICAgICBSRUFDVF9PRkZTQ1JFRU5fVFlQRSA9IHN5bWJvbEZvcihcInJlYWN0Lm9mZnNjcmVlblwiKTtcbiAgICAgICAgICBSRUFDVF9MRUdBQ1lfSElEREVOX1RZUEUgPSBzeW1ib2xGb3IoXCJyZWFjdC5sZWdhY3lfaGlkZGVuXCIpO1xuICAgICAgICB9XG4gICAgICAgIHZhciBlbmFibGVTY29wZUFQSSA9IGZhbHNlO1xuICAgICAgICBmdW5jdGlvbiBpc1ZhbGlkRWxlbWVudFR5cGUyKHR5cGUpIHtcbiAgICAgICAgICBpZiAodHlwZW9mIHR5cGUgPT09IFwic3RyaW5nXCIgfHwgdHlwZW9mIHR5cGUgPT09IFwiZnVuY3Rpb25cIikge1xuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmICh0eXBlID09PSBSRUFDVF9GUkFHTUVOVF9UWVBFIHx8IHR5cGUgPT09IFJFQUNUX1BST0ZJTEVSX1RZUEUgfHwgdHlwZSA9PT0gUkVBQ1RfREVCVUdfVFJBQ0lOR19NT0RFX1RZUEUgfHwgdHlwZSA9PT0gUkVBQ1RfU1RSSUNUX01PREVfVFlQRSB8fCB0eXBlID09PSBSRUFDVF9TVVNQRU5TRV9UWVBFIHx8IHR5cGUgPT09IFJFQUNUX1NVU1BFTlNFX0xJU1RfVFlQRSB8fCB0eXBlID09PSBSRUFDVF9MRUdBQ1lfSElEREVOX1RZUEUgfHwgZW5hYmxlU2NvcGVBUEkpIHtcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAodHlwZW9mIHR5cGUgPT09IFwib2JqZWN0XCIgJiYgdHlwZSAhPT0gbnVsbCkge1xuICAgICAgICAgICAgaWYgKHR5cGUuJCR0eXBlb2YgPT09IFJFQUNUX0xBWllfVFlQRSB8fCB0eXBlLiQkdHlwZW9mID09PSBSRUFDVF9NRU1PX1RZUEUgfHwgdHlwZS4kJHR5cGVvZiA9PT0gUkVBQ1RfUFJPVklERVJfVFlQRSB8fCB0eXBlLiQkdHlwZW9mID09PSBSRUFDVF9DT05URVhUX1RZUEUgfHwgdHlwZS4kJHR5cGVvZiA9PT0gUkVBQ1RfRk9SV0FSRF9SRUZfVFlQRSB8fCB0eXBlLiQkdHlwZW9mID09PSBSRUFDVF9GVU5EQU1FTlRBTF9UWVBFIHx8IHR5cGUuJCR0eXBlb2YgPT09IFJFQUNUX0JMT0NLX1RZUEUgfHwgdHlwZVswXSA9PT0gUkVBQ1RfU0VSVkVSX0JMT0NLX1RZUEUpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgICBmdW5jdGlvbiB0eXBlT2Yob2JqZWN0KSB7XG4gICAgICAgICAgaWYgKHR5cGVvZiBvYmplY3QgPT09IFwib2JqZWN0XCIgJiYgb2JqZWN0ICE9PSBudWxsKSB7XG4gICAgICAgICAgICB2YXIgJCR0eXBlb2YgPSBvYmplY3QuJCR0eXBlb2Y7XG4gICAgICAgICAgICBzd2l0Y2ggKCQkdHlwZW9mKSB7XG4gICAgICAgICAgICAgIGNhc2UgUkVBQ1RfRUxFTUVOVF9UWVBFOlxuICAgICAgICAgICAgICAgIHZhciB0eXBlID0gb2JqZWN0LnR5cGU7XG4gICAgICAgICAgICAgICAgc3dpdGNoICh0eXBlKSB7XG4gICAgICAgICAgICAgICAgICBjYXNlIFJFQUNUX0ZSQUdNRU5UX1RZUEU6XG4gICAgICAgICAgICAgICAgICBjYXNlIFJFQUNUX1BST0ZJTEVSX1RZUEU6XG4gICAgICAgICAgICAgICAgICBjYXNlIFJFQUNUX1NUUklDVF9NT0RFX1RZUEU6XG4gICAgICAgICAgICAgICAgICBjYXNlIFJFQUNUX1NVU1BFTlNFX1RZUEU6XG4gICAgICAgICAgICAgICAgICBjYXNlIFJFQUNUX1NVU1BFTlNFX0xJU1RfVFlQRTpcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHR5cGU7XG4gICAgICAgICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgICAgICB2YXIgJCR0eXBlb2ZUeXBlID0gdHlwZSAmJiB0eXBlLiQkdHlwZW9mO1xuICAgICAgICAgICAgICAgICAgICBzd2l0Y2ggKCQkdHlwZW9mVHlwZSkge1xuICAgICAgICAgICAgICAgICAgICAgIGNhc2UgUkVBQ1RfQ09OVEVYVF9UWVBFOlxuICAgICAgICAgICAgICAgICAgICAgIGNhc2UgUkVBQ1RfRk9SV0FSRF9SRUZfVFlQRTpcbiAgICAgICAgICAgICAgICAgICAgICBjYXNlIFJFQUNUX0xBWllfVFlQRTpcbiAgICAgICAgICAgICAgICAgICAgICBjYXNlIFJFQUNUX01FTU9fVFlQRTpcbiAgICAgICAgICAgICAgICAgICAgICBjYXNlIFJFQUNUX1BST1ZJREVSX1RZUEU6XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gJCR0eXBlb2ZUeXBlO1xuICAgICAgICAgICAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gJCR0eXBlb2Y7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIGNhc2UgUkVBQ1RfUE9SVEFMX1RZUEU6XG4gICAgICAgICAgICAgICAgcmV0dXJuICQkdHlwZW9mO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgICByZXR1cm4gdm9pZCAwO1xuICAgICAgICB9XG4gICAgICAgIHZhciBDb250ZXh0Q29uc3VtZXIgPSBSRUFDVF9DT05URVhUX1RZUEU7XG4gICAgICAgIHZhciBDb250ZXh0UHJvdmlkZXIgPSBSRUFDVF9QUk9WSURFUl9UWVBFO1xuICAgICAgICB2YXIgRWxlbWVudCA9IFJFQUNUX0VMRU1FTlRfVFlQRTtcbiAgICAgICAgdmFyIEZvcndhcmRSZWYgPSBSRUFDVF9GT1JXQVJEX1JFRl9UWVBFO1xuICAgICAgICB2YXIgRnJhZ21lbnQzID0gUkVBQ1RfRlJBR01FTlRfVFlQRTtcbiAgICAgICAgdmFyIExhenkgPSBSRUFDVF9MQVpZX1RZUEU7XG4gICAgICAgIHZhciBNZW1vID0gUkVBQ1RfTUVNT19UWVBFO1xuICAgICAgICB2YXIgUG9ydGFsID0gUkVBQ1RfUE9SVEFMX1RZUEU7XG4gICAgICAgIHZhciBQcm9maWxlciA9IFJFQUNUX1BST0ZJTEVSX1RZUEU7XG4gICAgICAgIHZhciBTdHJpY3RNb2RlID0gUkVBQ1RfU1RSSUNUX01PREVfVFlQRTtcbiAgICAgICAgdmFyIFN1c3BlbnNlID0gUkVBQ1RfU1VTUEVOU0VfVFlQRTtcbiAgICAgICAgdmFyIGhhc1dhcm5lZEFib3V0RGVwcmVjYXRlZElzQXN5bmNNb2RlID0gZmFsc2U7XG4gICAgICAgIHZhciBoYXNXYXJuZWRBYm91dERlcHJlY2F0ZWRJc0NvbmN1cnJlbnRNb2RlID0gZmFsc2U7XG4gICAgICAgIGZ1bmN0aW9uIGlzQXN5bmNNb2RlKG9iamVjdCkge1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIGlmICghaGFzV2FybmVkQWJvdXREZXByZWNhdGVkSXNBc3luY01vZGUpIHtcbiAgICAgICAgICAgICAgaGFzV2FybmVkQWJvdXREZXByZWNhdGVkSXNBc3luY01vZGUgPSB0cnVlO1xuICAgICAgICAgICAgICBjb25zb2xlW1wid2FyblwiXShcIlRoZSBSZWFjdElzLmlzQXN5bmNNb2RlKCkgYWxpYXMgaGFzIGJlZW4gZGVwcmVjYXRlZCwgYW5kIHdpbGwgYmUgcmVtb3ZlZCBpbiBSZWFjdCAxOCsuXCIpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgICAgZnVuY3Rpb24gaXNDb25jdXJyZW50TW9kZShvYmplY3QpIHtcbiAgICAgICAgICB7XG4gICAgICAgICAgICBpZiAoIWhhc1dhcm5lZEFib3V0RGVwcmVjYXRlZElzQ29uY3VycmVudE1vZGUpIHtcbiAgICAgICAgICAgICAgaGFzV2FybmVkQWJvdXREZXByZWNhdGVkSXNDb25jdXJyZW50TW9kZSA9IHRydWU7XG4gICAgICAgICAgICAgIGNvbnNvbGVbXCJ3YXJuXCJdKFwiVGhlIFJlYWN0SXMuaXNDb25jdXJyZW50TW9kZSgpIGFsaWFzIGhhcyBiZWVuIGRlcHJlY2F0ZWQsIGFuZCB3aWxsIGJlIHJlbW92ZWQgaW4gUmVhY3QgMTgrLlwiKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIGZ1bmN0aW9uIGlzQ29udGV4dENvbnN1bWVyMihvYmplY3QpIHtcbiAgICAgICAgICByZXR1cm4gdHlwZU9mKG9iamVjdCkgPT09IFJFQUNUX0NPTlRFWFRfVFlQRTtcbiAgICAgICAgfVxuICAgICAgICBmdW5jdGlvbiBpc0NvbnRleHRQcm92aWRlcihvYmplY3QpIHtcbiAgICAgICAgICByZXR1cm4gdHlwZU9mKG9iamVjdCkgPT09IFJFQUNUX1BST1ZJREVSX1RZUEU7XG4gICAgICAgIH1cbiAgICAgICAgZnVuY3Rpb24gaXNFbGVtZW50KG9iamVjdCkge1xuICAgICAgICAgIHJldHVybiB0eXBlb2Ygb2JqZWN0ID09PSBcIm9iamVjdFwiICYmIG9iamVjdCAhPT0gbnVsbCAmJiBvYmplY3QuJCR0eXBlb2YgPT09IFJFQUNUX0VMRU1FTlRfVFlQRTtcbiAgICAgICAgfVxuICAgICAgICBmdW5jdGlvbiBpc0ZvcndhcmRSZWYob2JqZWN0KSB7XG4gICAgICAgICAgcmV0dXJuIHR5cGVPZihvYmplY3QpID09PSBSRUFDVF9GT1JXQVJEX1JFRl9UWVBFO1xuICAgICAgICB9XG4gICAgICAgIGZ1bmN0aW9uIGlzRnJhZ21lbnQob2JqZWN0KSB7XG4gICAgICAgICAgcmV0dXJuIHR5cGVPZihvYmplY3QpID09PSBSRUFDVF9GUkFHTUVOVF9UWVBFO1xuICAgICAgICB9XG4gICAgICAgIGZ1bmN0aW9uIGlzTGF6eShvYmplY3QpIHtcbiAgICAgICAgICByZXR1cm4gdHlwZU9mKG9iamVjdCkgPT09IFJFQUNUX0xBWllfVFlQRTtcbiAgICAgICAgfVxuICAgICAgICBmdW5jdGlvbiBpc01lbW8ob2JqZWN0KSB7XG4gICAgICAgICAgcmV0dXJuIHR5cGVPZihvYmplY3QpID09PSBSRUFDVF9NRU1PX1RZUEU7XG4gICAgICAgIH1cbiAgICAgICAgZnVuY3Rpb24gaXNQb3J0YWwob2JqZWN0KSB7XG4gICAgICAgICAgcmV0dXJuIHR5cGVPZihvYmplY3QpID09PSBSRUFDVF9QT1JUQUxfVFlQRTtcbiAgICAgICAgfVxuICAgICAgICBmdW5jdGlvbiBpc1Byb2ZpbGVyKG9iamVjdCkge1xuICAgICAgICAgIHJldHVybiB0eXBlT2Yob2JqZWN0KSA9PT0gUkVBQ1RfUFJPRklMRVJfVFlQRTtcbiAgICAgICAgfVxuICAgICAgICBmdW5jdGlvbiBpc1N0cmljdE1vZGUob2JqZWN0KSB7XG4gICAgICAgICAgcmV0dXJuIHR5cGVPZihvYmplY3QpID09PSBSRUFDVF9TVFJJQ1RfTU9ERV9UWVBFO1xuICAgICAgICB9XG4gICAgICAgIGZ1bmN0aW9uIGlzU3VzcGVuc2Uob2JqZWN0KSB7XG4gICAgICAgICAgcmV0dXJuIHR5cGVPZihvYmplY3QpID09PSBSRUFDVF9TVVNQRU5TRV9UWVBFO1xuICAgICAgICB9XG4gICAgICAgIGV4cG9ydHMuQ29udGV4dENvbnN1bWVyID0gQ29udGV4dENvbnN1bWVyO1xuICAgICAgICBleHBvcnRzLkNvbnRleHRQcm92aWRlciA9IENvbnRleHRQcm92aWRlcjtcbiAgICAgICAgZXhwb3J0cy5FbGVtZW50ID0gRWxlbWVudDtcbiAgICAgICAgZXhwb3J0cy5Gb3J3YXJkUmVmID0gRm9yd2FyZFJlZjtcbiAgICAgICAgZXhwb3J0cy5GcmFnbWVudCA9IEZyYWdtZW50MztcbiAgICAgICAgZXhwb3J0cy5MYXp5ID0gTGF6eTtcbiAgICAgICAgZXhwb3J0cy5NZW1vID0gTWVtbztcbiAgICAgICAgZXhwb3J0cy5Qb3J0YWwgPSBQb3J0YWw7XG4gICAgICAgIGV4cG9ydHMuUHJvZmlsZXIgPSBQcm9maWxlcjtcbiAgICAgICAgZXhwb3J0cy5TdHJpY3RNb2RlID0gU3RyaWN0TW9kZTtcbiAgICAgICAgZXhwb3J0cy5TdXNwZW5zZSA9IFN1c3BlbnNlO1xuICAgICAgICBleHBvcnRzLmlzQXN5bmNNb2RlID0gaXNBc3luY01vZGU7XG4gICAgICAgIGV4cG9ydHMuaXNDb25jdXJyZW50TW9kZSA9IGlzQ29uY3VycmVudE1vZGU7XG4gICAgICAgIGV4cG9ydHMuaXNDb250ZXh0Q29uc3VtZXIgPSBpc0NvbnRleHRDb25zdW1lcjI7XG4gICAgICAgIGV4cG9ydHMuaXNDb250ZXh0UHJvdmlkZXIgPSBpc0NvbnRleHRQcm92aWRlcjtcbiAgICAgICAgZXhwb3J0cy5pc0VsZW1lbnQgPSBpc0VsZW1lbnQ7XG4gICAgICAgIGV4cG9ydHMuaXNGb3J3YXJkUmVmID0gaXNGb3J3YXJkUmVmO1xuICAgICAgICBleHBvcnRzLmlzRnJhZ21lbnQgPSBpc0ZyYWdtZW50O1xuICAgICAgICBleHBvcnRzLmlzTGF6eSA9IGlzTGF6eTtcbiAgICAgICAgZXhwb3J0cy5pc01lbW8gPSBpc01lbW87XG4gICAgICAgIGV4cG9ydHMuaXNQb3J0YWwgPSBpc1BvcnRhbDtcbiAgICAgICAgZXhwb3J0cy5pc1Byb2ZpbGVyID0gaXNQcm9maWxlcjtcbiAgICAgICAgZXhwb3J0cy5pc1N0cmljdE1vZGUgPSBpc1N0cmljdE1vZGU7XG4gICAgICAgIGV4cG9ydHMuaXNTdXNwZW5zZSA9IGlzU3VzcGVuc2U7XG4gICAgICAgIGV4cG9ydHMuaXNWYWxpZEVsZW1lbnRUeXBlID0gaXNWYWxpZEVsZW1lbnRUeXBlMjtcbiAgICAgICAgZXhwb3J0cy50eXBlT2YgPSB0eXBlT2Y7XG4gICAgICB9KSgpO1xuICAgIH1cbiAgfVxufSk7XG5cbi8vIG5vZGVfbW9kdWxlcy9yZWFjdC1yZWR1eC9ub2RlX21vZHVsZXMvcmVhY3QtaXMvaW5kZXguanNcbnZhciByZXF1aXJlX3JlYWN0X2lzMiA9IF9fY29tbW9uSlMoe1xuICBcIm5vZGVfbW9kdWxlcy9yZWFjdC1yZWR1eC9ub2RlX21vZHVsZXMvcmVhY3QtaXMvaW5kZXguanNcIihleHBvcnRzLCBtb2R1bGUpIHtcbiAgICBcInVzZSBzdHJpY3RcIjtcbiAgICBpZiAoZmFsc2UpIHtcbiAgICAgIG1vZHVsZS5leHBvcnRzID0gbnVsbDtcbiAgICB9IGVsc2Uge1xuICAgICAgbW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlX3JlYWN0X2lzX2RldmVsb3BtZW50MigpO1xuICAgIH1cbiAgfVxufSk7XG5cbi8vIG5vZGVfbW9kdWxlcy9sb2Rhc2guaXNmdW5jdGlvbi9pbmRleC5qc1xudmFyIHJlcXVpcmVfbG9kYXNoID0gX19jb21tb25KUyh7XG4gIFwibm9kZV9tb2R1bGVzL2xvZGFzaC5pc2Z1bmN0aW9uL2luZGV4LmpzXCIoZXhwb3J0cywgbW9kdWxlKSB7XG4gICAgdmFyIGFzeW5jVGFnID0gXCJbb2JqZWN0IEFzeW5jRnVuY3Rpb25dXCI7XG4gICAgdmFyIGZ1bmNUYWcgPSBcIltvYmplY3QgRnVuY3Rpb25dXCI7XG4gICAgdmFyIGdlblRhZyA9IFwiW29iamVjdCBHZW5lcmF0b3JGdW5jdGlvbl1cIjtcbiAgICB2YXIgbnVsbFRhZyA9IFwiW29iamVjdCBOdWxsXVwiO1xuICAgIHZhciBwcm94eVRhZyA9IFwiW29iamVjdCBQcm94eV1cIjtcbiAgICB2YXIgdW5kZWZpbmVkVGFnID0gXCJbb2JqZWN0IFVuZGVmaW5lZF1cIjtcbiAgICB2YXIgZnJlZUdsb2JhbCA9IHR5cGVvZiBnbG9iYWwgPT0gXCJvYmplY3RcIiAmJiBnbG9iYWwgJiYgZ2xvYmFsLk9iamVjdCA9PT0gT2JqZWN0ICYmIGdsb2JhbDtcbiAgICB2YXIgZnJlZVNlbGYgPSB0eXBlb2Ygc2VsZiA9PSBcIm9iamVjdFwiICYmIHNlbGYgJiYgc2VsZi5PYmplY3QgPT09IE9iamVjdCAmJiBzZWxmO1xuICAgIHZhciByb290ID0gZnJlZUdsb2JhbCB8fCBmcmVlU2VsZiB8fCBGdW5jdGlvbihcInJldHVybiB0aGlzXCIpKCk7XG4gICAgdmFyIG9iamVjdFByb3RvID0gT2JqZWN0LnByb3RvdHlwZTtcbiAgICB2YXIgaGFzT3duUHJvcGVydHkgPSBvYmplY3RQcm90by5oYXNPd25Qcm9wZXJ0eTtcbiAgICB2YXIgbmF0aXZlT2JqZWN0VG9TdHJpbmcgPSBvYmplY3RQcm90by50b1N0cmluZztcbiAgICB2YXIgU3ltYm9sMiA9IHJvb3QuU3ltYm9sO1xuICAgIHZhciBzeW1Ub1N0cmluZ1RhZyA9IFN5bWJvbDIgPyBTeW1ib2wyLnRvU3RyaW5nVGFnIDogdm9pZCAwO1xuICAgIGZ1bmN0aW9uIGJhc2VHZXRUYWcodmFsdWUpIHtcbiAgICAgIGlmICh2YWx1ZSA9PSBudWxsKSB7XG4gICAgICAgIHJldHVybiB2YWx1ZSA9PT0gdm9pZCAwID8gdW5kZWZpbmVkVGFnIDogbnVsbFRhZztcbiAgICAgIH1cbiAgICAgIHJldHVybiBzeW1Ub1N0cmluZ1RhZyAmJiBzeW1Ub1N0cmluZ1RhZyBpbiBPYmplY3QodmFsdWUpID8gZ2V0UmF3VGFnKHZhbHVlKSA6IG9iamVjdFRvU3RyaW5nKHZhbHVlKTtcbiAgICB9XG4gICAgZnVuY3Rpb24gZ2V0UmF3VGFnKHZhbHVlKSB7XG4gICAgICB2YXIgaXNPd24gPSBoYXNPd25Qcm9wZXJ0eS5jYWxsKHZhbHVlLCBzeW1Ub1N0cmluZ1RhZyksIHRhZyA9IHZhbHVlW3N5bVRvU3RyaW5nVGFnXTtcbiAgICAgIHRyeSB7XG4gICAgICAgIHZhbHVlW3N5bVRvU3RyaW5nVGFnXSA9IHZvaWQgMDtcbiAgICAgICAgdmFyIHVubWFza2VkID0gdHJ1ZTtcbiAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgIH1cbiAgICAgIHZhciByZXN1bHQgPSBuYXRpdmVPYmplY3RUb1N0cmluZy5jYWxsKHZhbHVlKTtcbiAgICAgIGlmICh1bm1hc2tlZCkge1xuICAgICAgICBpZiAoaXNPd24pIHtcbiAgICAgICAgICB2YWx1ZVtzeW1Ub1N0cmluZ1RhZ10gPSB0YWc7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgZGVsZXRlIHZhbHVlW3N5bVRvU3RyaW5nVGFnXTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9XG4gICAgZnVuY3Rpb24gb2JqZWN0VG9TdHJpbmcodmFsdWUpIHtcbiAgICAgIHJldHVybiBuYXRpdmVPYmplY3RUb1N0cmluZy5jYWxsKHZhbHVlKTtcbiAgICB9XG4gICAgZnVuY3Rpb24gaXNGdW5jdGlvbjIodmFsdWUpIHtcbiAgICAgIGlmICghaXNPYmplY3QodmFsdWUpKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cbiAgICAgIHZhciB0YWcgPSBiYXNlR2V0VGFnKHZhbHVlKTtcbiAgICAgIHJldHVybiB0YWcgPT0gZnVuY1RhZyB8fCB0YWcgPT0gZ2VuVGFnIHx8IHRhZyA9PSBhc3luY1RhZyB8fCB0YWcgPT0gcHJveHlUYWc7XG4gICAgfVxuICAgIGZ1bmN0aW9uIGlzT2JqZWN0KHZhbHVlKSB7XG4gICAgICB2YXIgdHlwZSA9IHR5cGVvZiB2YWx1ZTtcbiAgICAgIHJldHVybiB2YWx1ZSAhPSBudWxsICYmICh0eXBlID09IFwib2JqZWN0XCIgfHwgdHlwZSA9PSBcImZ1bmN0aW9uXCIpO1xuICAgIH1cbiAgICBtb2R1bGUuZXhwb3J0cyA9IGlzRnVuY3Rpb24yO1xuICB9XG59KTtcblxuLy8gLmljZS9pbmRleC50c1xuaW1wb3J0IHsgTGluaywgT3V0bGV0LCB1c2VQYXJhbXMsIHVzZVNlYXJjaFBhcmFtcywgdXNlTG9jYXRpb24sIHVzZU5hdmlnYXRlIH0gZnJvbSBcIkBpY2UvcnVudGltZS9yb3V0ZXJcIjtcbmltcG9ydCB7IGRlZmluZUFwcENvbmZpZywgdXNlQXBwRGF0YSwgdXNlRGF0YSwgdXNlQ29uZmlnLCBNZXRhLCBUaXRsZSwgTGlua3MsIFNjcmlwdHMsIERhdGEsIE1haW4sIGhpc3RvcnksIEtlZXBBbGl2ZU91dGxldCwgdXNlTW91bnRlZCwgQ2xpZW50T25seSwgZGVmaW5lRGF0YUxvYWRlciwgZGVmaW5lU2VydmVyRGF0YUxvYWRlciwgZGVmaW5lU3RhdGljRGF0YUxvYWRlciB9IGZyb20gXCJAaWNlL3J1bnRpbWVcIjtcblxuLy8gbm9kZV9tb2R1bGVzL0BpY2UvcGx1Z2luLXJlcXVlc3QvZXNtL3JlcXVlc3QuanNcbnZhciBpbXBvcnRfYXhpb3MgPSBfX3RvRVNNKHJlcXVpcmVfYXhpb3MyKCksIDEpO1xudmFyIERFRkFVTFRfQ09ORklHID0ge307XG52YXIgYXhpb3NJbnN0YW5jZXMgPSB7XG4gIGRlZmF1bHQ6IGltcG9ydF9heGlvcy5kZWZhdWx0LmNyZWF0ZShERUZBVUxUX0NPTkZJRylcbn07XG5mdW5jdGlvbiBjcmVhdGVBeGlvc0luc3RhbmNlKGluc3RhbmNlTmFtZSkge1xuICBpZiAoaW5zdGFuY2VOYW1lKSB7XG4gICAgaWYgKGF4aW9zSW5zdGFuY2VzW2luc3RhbmNlTmFtZV0pIHtcbiAgICAgIHJldHVybiBheGlvc0luc3RhbmNlcztcbiAgICB9XG4gICAgYXhpb3NJbnN0YW5jZXNbaW5zdGFuY2VOYW1lXSA9IGltcG9ydF9heGlvcy5kZWZhdWx0LmNyZWF0ZShERUZBVUxUX0NPTkZJRyk7XG4gIH1cbiAgcmV0dXJuIGF4aW9zSW5zdGFuY2VzO1xufVxudmFyIHJlcXVlc3QgPSBhc3luYyBmdW5jdGlvbihvcHRpb25zKSB7XG4gIHRyeSB7XG4gICAgY29uc3QgaW5zdGFuY2VOYW1lID0gb3B0aW9ucy5pbnN0YW5jZU5hbWUgPyBvcHRpb25zLmluc3RhbmNlTmFtZSA6IFwiZGVmYXVsdFwiO1xuICAgIGNvbnN0IGF4aW9zSW5zdGFuY2UgPSBjcmVhdGVBeGlvc0luc3RhbmNlKClbaW5zdGFuY2VOYW1lXTtcbiAgICBpZiAoISh0eXBlb2YgYXhpb3NJbnN0YW5jZSA9PT0gXCJmdW5jdGlvblwiKSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKGB1bmtub3duICR7aW5zdGFuY2VOYW1lfSBpbiByZXF1ZXN0IG1ldGhvZGApO1xuICAgIH1cbiAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IGF4aW9zSW5zdGFuY2Uob3B0aW9ucyk7XG4gICAgaWYgKGF4aW9zSW5zdGFuY2UuZGVmYXVsdHMud2l0aEZ1bGxSZXNwb25zZSB8fCBvcHRpb25zLndpdGhGdWxsUmVzcG9uc2UpIHtcbiAgICAgIHJldHVybiByZXNwb25zZTtcbiAgICB9XG4gICAgcmV0dXJuIHJlc3BvbnNlLmRhdGE7XG4gIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgY29uc29sZS5lcnJvcihlcnJvcik7XG4gICAgdGhyb3cgZXJyb3I7XG4gIH1cbn07XG5bXCJkZWxldGVcIiwgXCJnZXRcIiwgXCJoZWFkXCIsIFwib3B0aW9uc1wiXS5mb3JFYWNoKChtZXRob2QpID0+IHtcbiAgcmVxdWVzdFttZXRob2RdID0gZnVuY3Rpb24odXJsLCBjb25maWcpIHtcbiAgICByZXR1cm4gcmVxdWVzdChPYmplY3QuYXNzaWduKGNvbmZpZyB8fCB7fSwge1xuICAgICAgbWV0aG9kLFxuICAgICAgdXJsXG4gICAgfSkpO1xuICB9O1xufSk7XG5bXCJwb3N0XCIsIFwicHV0XCIsIFwicGF0Y2hcIl0uZm9yRWFjaCgobWV0aG9kKSA9PiB7XG4gIHJlcXVlc3RbbWV0aG9kXSA9IGZ1bmN0aW9uKHVybCwgZGF0YSwgY29uZmlnKSB7XG4gICAgcmV0dXJuIHJlcXVlc3QoT2JqZWN0LmFzc2lnbihjb25maWcgfHwge30sIHtcbiAgICAgIG1ldGhvZCxcbiAgICAgIHVybCxcbiAgICAgIGRhdGFcbiAgICB9KSk7XG4gIH07XG59KTtcbnJlcXVlc3QuQ2FuY2VsVG9rZW4gPSBpbXBvcnRfYXhpb3MuZGVmYXVsdC5DYW5jZWxUb2tlbjtcbnJlcXVlc3QuaXNDYW5jZWwgPSBpbXBvcnRfYXhpb3MuZGVmYXVsdC5pc0NhbmNlbDtcblxuLy8gbm9kZV9tb2R1bGVzL0BpY2UvcGx1Z2luLXN0b3JlL2VzbS9ydW50aW1lLmpzXG5pbXBvcnQgKiBhcyBSZWFjdDcgZnJvbSBcInJlYWN0XCI7XG5cbi8vIG5vZGVfbW9kdWxlcy9AaWNlL3N0b3JlL2VzbS9pbmRleC5qc1xuaW1wb3J0IFJlYWN0NiBmcm9tIFwicmVhY3RcIjtcblxuLy8gbm9kZV9tb2R1bGVzL0BpY2Uvc3RvcmUvZXNtL3V0aWxzL3ZhbGlkYXRlLmpzXG52YXIgdmFsaWRhdGUgPSBmdW5jdGlvbih2YWxpZGF0aW9ucykge1xuICBpZiAodHJ1ZSkge1xuICAgIGZvciAodmFyIF9pID0gMCwgdmFsaWRhdGlvbnNfMSA9IHZhbGlkYXRpb25zOyBfaSA8IHZhbGlkYXRpb25zXzEubGVuZ3RoOyBfaSsrKSB7XG4gICAgICB2YXIgdmFsaWRhdGlvbiA9IHZhbGlkYXRpb25zXzFbX2ldO1xuICAgICAgdmFyIGNvbmRpdGlvbiA9IHZhbGlkYXRpb25bMF07XG4gICAgICB2YXIgZXJyb3JNZXNzYWdlID0gdmFsaWRhdGlvblsxXTtcbiAgICAgIGlmIChjb25kaXRpb24pIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKGVycm9yTWVzc2FnZSk7XG4gICAgICB9XG4gICAgfVxuICB9XG59O1xudmFyIHZhbGlkYXRlX2RlZmF1bHQgPSB2YWxpZGF0ZTtcblxuLy8gbm9kZV9tb2R1bGVzL0BpY2Uvc3RvcmUvZXNtL3BsdWdpbkZhY3RvcnkuanNcbnZhciBwbHVnaW5GYWN0b3J5X2RlZmF1bHQgPSBmdW5jdGlvbihjb25maWcpIHtcbiAgcmV0dXJuIHtcbiAgICBjb25maWcsXG4gICAgdmFsaWRhdGU6IHZhbGlkYXRlX2RlZmF1bHQsXG4gICAgY3JlYXRlOiBmdW5jdGlvbihwbHVnaW4pIHtcbiAgICAgIHZhbGlkYXRlX2RlZmF1bHQoW1xuICAgICAgICBbXG4gICAgICAgICAgcGx1Z2luLm9uU3RvcmVDcmVhdGVkICYmIHR5cGVvZiBwbHVnaW4ub25TdG9yZUNyZWF0ZWQgIT09IFwiZnVuY3Rpb25cIixcbiAgICAgICAgICBcIlBsdWdpbiBvblN0b3JlQ3JlYXRlZCBtdXN0IGJlIGEgZnVuY3Rpb25cIlxuICAgICAgICBdLFxuICAgICAgICBbXG4gICAgICAgICAgcGx1Z2luLm9uTW9kZWwgJiYgdHlwZW9mIHBsdWdpbi5vbk1vZGVsICE9PSBcImZ1bmN0aW9uXCIsXG4gICAgICAgICAgXCJQbHVnaW4gb25Nb2RlbCBtdXN0IGJlIGEgZnVuY3Rpb25cIlxuICAgICAgICBdLFxuICAgICAgICBbXG4gICAgICAgICAgcGx1Z2luLm1pZGRsZXdhcmUgJiYgdHlwZW9mIHBsdWdpbi5taWRkbGV3YXJlICE9PSBcImZ1bmN0aW9uXCIsXG4gICAgICAgICAgXCJQbHVnaW4gbWlkZGxld2FyZSBtdXN0IGJlIGEgZnVuY3Rpb25cIlxuICAgICAgICBdXG4gICAgICBdKTtcbiAgICAgIGlmIChwbHVnaW4ub25Jbml0KSB7XG4gICAgICAgIHBsdWdpbi5vbkluaXQuY2FsbCh0aGlzKTtcbiAgICAgIH1cbiAgICAgIHZhciByZXN1bHQgPSB7fTtcbiAgICAgIGlmIChwbHVnaW4uZXhwb3NlZCkge1xuICAgICAgICBmb3IgKHZhciBfaSA9IDAsIF9hID0gT2JqZWN0LmtleXMocGx1Z2luLmV4cG9zZWQpOyBfaSA8IF9hLmxlbmd0aDsgX2krKykge1xuICAgICAgICAgIHZhciBrZXkgPSBfYVtfaV07XG4gICAgICAgICAgdGhpc1trZXldID0gdHlwZW9mIHBsdWdpbi5leHBvc2VkW2tleV0gPT09IFwiZnVuY3Rpb25cIiA/IHBsdWdpbi5leHBvc2VkW2tleV0uYmluZCh0aGlzKSA6IE9iamVjdC5jcmVhdGUocGx1Z2luLmV4cG9zZWRba2V5XSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGZvciAodmFyIF9iID0gMCwgX2MgPSBbXCJvbk1vZGVsXCIsIFwibWlkZGxld2FyZVwiLCBcIm9uU3RvcmVDcmVhdGVkXCJdOyBfYiA8IF9jLmxlbmd0aDsgX2IrKykge1xuICAgICAgICB2YXIgbWV0aG9kID0gX2NbX2JdO1xuICAgICAgICBpZiAocGx1Z2luW21ldGhvZF0pIHtcbiAgICAgICAgICByZXN1bHRbbWV0aG9kXSA9IHBsdWdpblttZXRob2RdLmJpbmQodGhpcyk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfVxuICB9O1xufTtcblxuLy8gbm9kZV9tb2R1bGVzL0BpY2Uvc3RvcmUvZXNtL3BsdWdpbnMvZGlzcGF0Y2guanNcbnZhciBfX2F3YWl0ZXIgPSBmdW5jdGlvbih0aGlzQXJnLCBfYXJndW1lbnRzLCBQMiwgZ2VuZXJhdG9yKSB7XG4gIGZ1bmN0aW9uIGFkb3B0KHZhbHVlKSB7XG4gICAgcmV0dXJuIHZhbHVlIGluc3RhbmNlb2YgUDIgPyB2YWx1ZSA6IG5ldyBQMihmdW5jdGlvbihyZXNvbHZlKSB7XG4gICAgICByZXNvbHZlKHZhbHVlKTtcbiAgICB9KTtcbiAgfVxuICByZXR1cm4gbmV3IChQMiB8fCAoUDIgPSBQcm9taXNlKSkoZnVuY3Rpb24ocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgZnVuY3Rpb24gZnVsZmlsbGVkKHZhbHVlKSB7XG4gICAgICB0cnkge1xuICAgICAgICBzdGVwKGdlbmVyYXRvci5uZXh0KHZhbHVlKSk7XG4gICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIHJlamVjdChlKTtcbiAgICAgIH1cbiAgICB9XG4gICAgZnVuY3Rpb24gcmVqZWN0ZWQodmFsdWUpIHtcbiAgICAgIHRyeSB7XG4gICAgICAgIHN0ZXAoZ2VuZXJhdG9yW1widGhyb3dcIl0odmFsdWUpKTtcbiAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgcmVqZWN0KGUpO1xuICAgICAgfVxuICAgIH1cbiAgICBmdW5jdGlvbiBzdGVwKHJlc3VsdCkge1xuICAgICAgcmVzdWx0LmRvbmUgPyByZXNvbHZlKHJlc3VsdC52YWx1ZSkgOiBhZG9wdChyZXN1bHQudmFsdWUpLnRoZW4oZnVsZmlsbGVkLCByZWplY3RlZCk7XG4gICAgfVxuICAgIHN0ZXAoKGdlbmVyYXRvciA9IGdlbmVyYXRvci5hcHBseSh0aGlzQXJnLCBfYXJndW1lbnRzIHx8IFtdKSkubmV4dCgpKTtcbiAgfSk7XG59O1xudmFyIF9fZ2VuZXJhdG9yID0gZnVuY3Rpb24odGhpc0FyZywgYm9keSkge1xuICB2YXIgXzIgPSB7IGxhYmVsOiAwLCBzZW50OiBmdW5jdGlvbigpIHtcbiAgICBpZiAodDJbMF0gJiAxKVxuICAgICAgdGhyb3cgdDJbMV07XG4gICAgcmV0dXJuIHQyWzFdO1xuICB9LCB0cnlzOiBbXSwgb3BzOiBbXSB9LCBmMiwgeTIsIHQyLCBnMjtcbiAgcmV0dXJuIGcyID0geyBuZXh0OiB2ZXJiKDApLCBcInRocm93XCI6IHZlcmIoMSksIFwicmV0dXJuXCI6IHZlcmIoMikgfSwgdHlwZW9mIFN5bWJvbCA9PT0gXCJmdW5jdGlvblwiICYmIChnMltTeW1ib2wuaXRlcmF0b3JdID0gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH0pLCBnMjtcbiAgZnVuY3Rpb24gdmVyYihuMikge1xuICAgIHJldHVybiBmdW5jdGlvbih2Mikge1xuICAgICAgcmV0dXJuIHN0ZXAoW24yLCB2Ml0pO1xuICAgIH07XG4gIH1cbiAgZnVuY3Rpb24gc3RlcChvcCkge1xuICAgIGlmIChmMilcbiAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoXCJHZW5lcmF0b3IgaXMgYWxyZWFkeSBleGVjdXRpbmcuXCIpO1xuICAgIHdoaWxlIChfMilcbiAgICAgIHRyeSB7XG4gICAgICAgIGlmIChmMiA9IDEsIHkyICYmICh0MiA9IG9wWzBdICYgMiA/IHkyW1wicmV0dXJuXCJdIDogb3BbMF0gPyB5MltcInRocm93XCJdIHx8ICgodDIgPSB5MltcInJldHVyblwiXSkgJiYgdDIuY2FsbCh5MiksIDApIDogeTIubmV4dCkgJiYgISh0MiA9IHQyLmNhbGwoeTIsIG9wWzFdKSkuZG9uZSlcbiAgICAgICAgICByZXR1cm4gdDI7XG4gICAgICAgIGlmICh5MiA9IDAsIHQyKVxuICAgICAgICAgIG9wID0gW29wWzBdICYgMiwgdDIudmFsdWVdO1xuICAgICAgICBzd2l0Y2ggKG9wWzBdKSB7XG4gICAgICAgICAgY2FzZSAwOlxuICAgICAgICAgIGNhc2UgMTpcbiAgICAgICAgICAgIHQyID0gb3A7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICBjYXNlIDQ6XG4gICAgICAgICAgICBfMi5sYWJlbCsrO1xuICAgICAgICAgICAgcmV0dXJuIHsgdmFsdWU6IG9wWzFdLCBkb25lOiBmYWxzZSB9O1xuICAgICAgICAgIGNhc2UgNTpcbiAgICAgICAgICAgIF8yLmxhYmVsKys7XG4gICAgICAgICAgICB5MiA9IG9wWzFdO1xuICAgICAgICAgICAgb3AgPSBbMF07XG4gICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICBjYXNlIDc6XG4gICAgICAgICAgICBvcCA9IF8yLm9wcy5wb3AoKTtcbiAgICAgICAgICAgIF8yLnRyeXMucG9wKCk7XG4gICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgaWYgKCEodDIgPSBfMi50cnlzLCB0MiA9IHQyLmxlbmd0aCA+IDAgJiYgdDJbdDIubGVuZ3RoIC0gMV0pICYmIChvcFswXSA9PT0gNiB8fCBvcFswXSA9PT0gMikpIHtcbiAgICAgICAgICAgICAgXzIgPSAwO1xuICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChvcFswXSA9PT0gMyAmJiAoIXQyIHx8IG9wWzFdID4gdDJbMF0gJiYgb3BbMV0gPCB0MlszXSkpIHtcbiAgICAgICAgICAgICAgXzIubGFiZWwgPSBvcFsxXTtcbiAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAob3BbMF0gPT09IDYgJiYgXzIubGFiZWwgPCB0MlsxXSkge1xuICAgICAgICAgICAgICBfMi5sYWJlbCA9IHQyWzFdO1xuICAgICAgICAgICAgICB0MiA9IG9wO1xuICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICh0MiAmJiBfMi5sYWJlbCA8IHQyWzJdKSB7XG4gICAgICAgICAgICAgIF8yLmxhYmVsID0gdDJbMl07XG4gICAgICAgICAgICAgIF8yLm9wcy5wdXNoKG9wKTtcbiAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAodDJbMl0pXG4gICAgICAgICAgICAgIF8yLm9wcy5wb3AoKTtcbiAgICAgICAgICAgIF8yLnRyeXMucG9wKCk7XG4gICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgfVxuICAgICAgICBvcCA9IGJvZHkuY2FsbCh0aGlzQXJnLCBfMik7XG4gICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIG9wID0gWzYsIGVdO1xuICAgICAgICB5MiA9IDA7XG4gICAgICB9IGZpbmFsbHkge1xuICAgICAgICBmMiA9IHQyID0gMDtcbiAgICAgIH1cbiAgICBpZiAob3BbMF0gJiA1KVxuICAgICAgdGhyb3cgb3BbMV07XG4gICAgcmV0dXJuIHsgdmFsdWU6IG9wWzBdID8gb3BbMV0gOiB2b2lkIDAsIGRvbmU6IHRydWUgfTtcbiAgfVxufTtcbnZhciBkaXNwYXRjaFBsdWdpbiA9IHtcbiAgZXhwb3NlZDoge1xuICAgIHN0b3JlRGlzcGF0Y2g6IGZ1bmN0aW9uKGFjdGlvbiwgc3RhdGUpIHtcbiAgICAgIGNvbnNvbGUud2FybihcIldhcm5pbmc6IHN0b3JlIG5vdCB5ZXQgbG9hZGVkXCIpO1xuICAgIH0sXG4gICAgc3RvcmVHZXRTdGF0ZTogZnVuY3Rpb24oKSB7XG4gICAgICBjb25zb2xlLndhcm4oXCJXYXJuaW5nOiBzdG9yZSBub3QgeWV0IGxvYWRlZFwiKTtcbiAgICB9LFxuICAgIGRpc3BhdGNoOiBmdW5jdGlvbihhY3Rpb24pIHtcbiAgICAgIHJldHVybiB0aGlzLnN0b3JlRGlzcGF0Y2goYWN0aW9uKTtcbiAgICB9LFxuICAgIGNyZWF0ZURpc3BhdGNoZXI6IGZ1bmN0aW9uKG1vZGVsTmFtZSwgcmVkdWNlck5hbWUpIHtcbiAgICAgIHZhciBfdGhpcyA9IHRoaXM7XG4gICAgICByZXR1cm4gZnVuY3Rpb24ocGF5bG9hZCwgbWV0YSkge1xuICAgICAgICByZXR1cm4gX19hd2FpdGVyKF90aGlzLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgdmFyIGFjdGlvbjtcbiAgICAgICAgICByZXR1cm4gX19nZW5lcmF0b3IodGhpcywgZnVuY3Rpb24oX2EpIHtcbiAgICAgICAgICAgIGFjdGlvbiA9IHsgdHlwZTogbW9kZWxOYW1lICsgXCIvXCIgKyByZWR1Y2VyTmFtZSB9O1xuICAgICAgICAgICAgaWYgKHR5cGVvZiBwYXlsb2FkICE9PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgICAgICAgICAgIGFjdGlvbi5wYXlsb2FkID0gcGF5bG9hZDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICh0eXBlb2YgbWV0YSAhPT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgICAgICAgICBhY3Rpb24ubWV0YSA9IG1ldGE7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gWzIsIHRoaXMuZGlzcGF0Y2goYWN0aW9uKV07XG4gICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgICAgfTtcbiAgICB9XG4gIH0sXG4gIG9uU3RvcmVDcmVhdGVkOiBmdW5jdGlvbihzdG9yZSkge1xuICAgIHRoaXMuc3RvcmVEaXNwYXRjaCA9IHN0b3JlLmRpc3BhdGNoO1xuICAgIHRoaXMuc3RvcmVHZXRTdGF0ZSA9IHN0b3JlLmdldFN0YXRlO1xuICAgIHJldHVybiB7IGRpc3BhdGNoOiB0aGlzLmRpc3BhdGNoIH07XG4gIH0sXG4gIG9uTW9kZWw6IGZ1bmN0aW9uKG1vZGVsKSB7XG4gICAgdGhpcy5kaXNwYXRjaFttb2RlbC5uYW1lXSA9IHt9O1xuICAgIGlmICghbW9kZWwucmVkdWNlcnMpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgZm9yICh2YXIgX2kgPSAwLCBfYSA9IE9iamVjdC5rZXlzKG1vZGVsLnJlZHVjZXJzKTsgX2kgPCBfYS5sZW5ndGg7IF9pKyspIHtcbiAgICAgIHZhciByZWR1Y2VyTmFtZSA9IF9hW19pXTtcbiAgICAgIHRoaXMudmFsaWRhdGUoW1xuICAgICAgICBbXG4gICAgICAgICAgISFyZWR1Y2VyTmFtZS5tYXRjaCgvXFwvLitcXC8vKSxcbiAgICAgICAgICBcIkludmFsaWQgcmVkdWNlciBuYW1lIChcIiArIG1vZGVsLm5hbWUgKyBcIi9cIiArIHJlZHVjZXJOYW1lICsgXCIpXCJcbiAgICAgICAgXSxcbiAgICAgICAgW1xuICAgICAgICAgIHR5cGVvZiBtb2RlbC5yZWR1Y2Vyc1tyZWR1Y2VyTmFtZV0gIT09IFwiZnVuY3Rpb25cIixcbiAgICAgICAgICBcIkludmFsaWQgcmVkdWNlciAoXCIgKyBtb2RlbC5uYW1lICsgXCIvXCIgKyByZWR1Y2VyTmFtZSArIFwiKS4gTXVzdCBiZSBhIGZ1bmN0aW9uXCJcbiAgICAgICAgXVxuICAgICAgXSk7XG4gICAgICB0aGlzLmRpc3BhdGNoW21vZGVsLm5hbWVdW3JlZHVjZXJOYW1lXSA9IHRoaXMuY3JlYXRlRGlzcGF0Y2hlci5hcHBseSh0aGlzLCBbbW9kZWwubmFtZSwgcmVkdWNlck5hbWVdKTtcbiAgICB9XG4gIH1cbn07XG52YXIgZGlzcGF0Y2hfZGVmYXVsdCA9IGRpc3BhdGNoUGx1Z2luO1xuXG4vLyBub2RlX21vZHVsZXMvQGljZS9zdG9yZS9lc20vcGx1Z2lucy9lZmZlY3RzLmpzXG52YXIgX19hd2FpdGVyMiA9IGZ1bmN0aW9uKHRoaXNBcmcsIF9hcmd1bWVudHMsIFAyLCBnZW5lcmF0b3IpIHtcbiAgZnVuY3Rpb24gYWRvcHQodmFsdWUpIHtcbiAgICByZXR1cm4gdmFsdWUgaW5zdGFuY2VvZiBQMiA/IHZhbHVlIDogbmV3IFAyKGZ1bmN0aW9uKHJlc29sdmUpIHtcbiAgICAgIHJlc29sdmUodmFsdWUpO1xuICAgIH0pO1xuICB9XG4gIHJldHVybiBuZXcgKFAyIHx8IChQMiA9IFByb21pc2UpKShmdW5jdGlvbihyZXNvbHZlLCByZWplY3QpIHtcbiAgICBmdW5jdGlvbiBmdWxmaWxsZWQodmFsdWUpIHtcbiAgICAgIHRyeSB7XG4gICAgICAgIHN0ZXAoZ2VuZXJhdG9yLm5leHQodmFsdWUpKTtcbiAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgcmVqZWN0KGUpO1xuICAgICAgfVxuICAgIH1cbiAgICBmdW5jdGlvbiByZWplY3RlZCh2YWx1ZSkge1xuICAgICAgdHJ5IHtcbiAgICAgICAgc3RlcChnZW5lcmF0b3JbXCJ0aHJvd1wiXSh2YWx1ZSkpO1xuICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICByZWplY3QoZSk7XG4gICAgICB9XG4gICAgfVxuICAgIGZ1bmN0aW9uIHN0ZXAocmVzdWx0KSB7XG4gICAgICByZXN1bHQuZG9uZSA/IHJlc29sdmUocmVzdWx0LnZhbHVlKSA6IGFkb3B0KHJlc3VsdC52YWx1ZSkudGhlbihmdWxmaWxsZWQsIHJlamVjdGVkKTtcbiAgICB9XG4gICAgc3RlcCgoZ2VuZXJhdG9yID0gZ2VuZXJhdG9yLmFwcGx5KHRoaXNBcmcsIF9hcmd1bWVudHMgfHwgW10pKS5uZXh0KCkpO1xuICB9KTtcbn07XG52YXIgX19nZW5lcmF0b3IyID0gZnVuY3Rpb24odGhpc0FyZywgYm9keSkge1xuICB2YXIgXzIgPSB7IGxhYmVsOiAwLCBzZW50OiBmdW5jdGlvbigpIHtcbiAgICBpZiAodDJbMF0gJiAxKVxuICAgICAgdGhyb3cgdDJbMV07XG4gICAgcmV0dXJuIHQyWzFdO1xuICB9LCB0cnlzOiBbXSwgb3BzOiBbXSB9LCBmMiwgeTIsIHQyLCBnMjtcbiAgcmV0dXJuIGcyID0geyBuZXh0OiB2ZXJiKDApLCBcInRocm93XCI6IHZlcmIoMSksIFwicmV0dXJuXCI6IHZlcmIoMikgfSwgdHlwZW9mIFN5bWJvbCA9PT0gXCJmdW5jdGlvblwiICYmIChnMltTeW1ib2wuaXRlcmF0b3JdID0gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH0pLCBnMjtcbiAgZnVuY3Rpb24gdmVyYihuMikge1xuICAgIHJldHVybiBmdW5jdGlvbih2Mikge1xuICAgICAgcmV0dXJuIHN0ZXAoW24yLCB2Ml0pO1xuICAgIH07XG4gIH1cbiAgZnVuY3Rpb24gc3RlcChvcCkge1xuICAgIGlmIChmMilcbiAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoXCJHZW5lcmF0b3IgaXMgYWxyZWFkeSBleGVjdXRpbmcuXCIpO1xuICAgIHdoaWxlIChfMilcbiAgICAgIHRyeSB7XG4gICAgICAgIGlmIChmMiA9IDEsIHkyICYmICh0MiA9IG9wWzBdICYgMiA/IHkyW1wicmV0dXJuXCJdIDogb3BbMF0gPyB5MltcInRocm93XCJdIHx8ICgodDIgPSB5MltcInJldHVyblwiXSkgJiYgdDIuY2FsbCh5MiksIDApIDogeTIubmV4dCkgJiYgISh0MiA9IHQyLmNhbGwoeTIsIG9wWzFdKSkuZG9uZSlcbiAgICAgICAgICByZXR1cm4gdDI7XG4gICAgICAgIGlmICh5MiA9IDAsIHQyKVxuICAgICAgICAgIG9wID0gW29wWzBdICYgMiwgdDIudmFsdWVdO1xuICAgICAgICBzd2l0Y2ggKG9wWzBdKSB7XG4gICAgICAgICAgY2FzZSAwOlxuICAgICAgICAgIGNhc2UgMTpcbiAgICAgICAgICAgIHQyID0gb3A7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICBjYXNlIDQ6XG4gICAgICAgICAgICBfMi5sYWJlbCsrO1xuICAgICAgICAgICAgcmV0dXJuIHsgdmFsdWU6IG9wWzFdLCBkb25lOiBmYWxzZSB9O1xuICAgICAgICAgIGNhc2UgNTpcbiAgICAgICAgICAgIF8yLmxhYmVsKys7XG4gICAgICAgICAgICB5MiA9IG9wWzFdO1xuICAgICAgICAgICAgb3AgPSBbMF07XG4gICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICBjYXNlIDc6XG4gICAgICAgICAgICBvcCA9IF8yLm9wcy5wb3AoKTtcbiAgICAgICAgICAgIF8yLnRyeXMucG9wKCk7XG4gICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgaWYgKCEodDIgPSBfMi50cnlzLCB0MiA9IHQyLmxlbmd0aCA+IDAgJiYgdDJbdDIubGVuZ3RoIC0gMV0pICYmIChvcFswXSA9PT0gNiB8fCBvcFswXSA9PT0gMikpIHtcbiAgICAgICAgICAgICAgXzIgPSAwO1xuICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChvcFswXSA9PT0gMyAmJiAoIXQyIHx8IG9wWzFdID4gdDJbMF0gJiYgb3BbMV0gPCB0MlszXSkpIHtcbiAgICAgICAgICAgICAgXzIubGFiZWwgPSBvcFsxXTtcbiAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAob3BbMF0gPT09IDYgJiYgXzIubGFiZWwgPCB0MlsxXSkge1xuICAgICAgICAgICAgICBfMi5sYWJlbCA9IHQyWzFdO1xuICAgICAgICAgICAgICB0MiA9IG9wO1xuICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICh0MiAmJiBfMi5sYWJlbCA8IHQyWzJdKSB7XG4gICAgICAgICAgICAgIF8yLmxhYmVsID0gdDJbMl07XG4gICAgICAgICAgICAgIF8yLm9wcy5wdXNoKG9wKTtcbiAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAodDJbMl0pXG4gICAgICAgICAgICAgIF8yLm9wcy5wb3AoKTtcbiAgICAgICAgICAgIF8yLnRyeXMucG9wKCk7XG4gICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgfVxuICAgICAgICBvcCA9IGJvZHkuY2FsbCh0aGlzQXJnLCBfMik7XG4gICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIG9wID0gWzYsIGVdO1xuICAgICAgICB5MiA9IDA7XG4gICAgICB9IGZpbmFsbHkge1xuICAgICAgICBmMiA9IHQyID0gMDtcbiAgICAgIH1cbiAgICBpZiAob3BbMF0gJiA1KVxuICAgICAgdGhyb3cgb3BbMV07XG4gICAgcmV0dXJuIHsgdmFsdWU6IG9wWzBdID8gb3BbMV0gOiB2b2lkIDAsIGRvbmU6IHRydWUgfTtcbiAgfVxufTtcbnZhciBlZmZlY3RzUGx1Z2luID0ge1xuICBleHBvc2VkOiB7XG4gICAgZWZmZWN0czoge31cbiAgfSxcbiAgb25Nb2RlbDogZnVuY3Rpb24obW9kZWwpIHtcbiAgICBpZiAoIW1vZGVsLmVmZmVjdHMpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgdmFyIGVmZmVjdHMgPSB0eXBlb2YgbW9kZWwuZWZmZWN0cyA9PT0gXCJmdW5jdGlvblwiID8gbW9kZWwuZWZmZWN0cyh0aGlzLmRpc3BhdGNoKSA6IG1vZGVsLmVmZmVjdHM7XG4gICAgdGhpcy52YWxpZGF0ZShbXG4gICAgICBbXG4gICAgICAgIHR5cGVvZiBlZmZlY3RzICE9PSBcIm9iamVjdFwiLFxuICAgICAgICBcIkludmFsaWQgZWZmZWN0cyBmcm9tIE1vZGVsKFwiICsgbW9kZWwubmFtZSArIFwiKSwgZWZmZWN0cyBzaG91bGQgcmV0dXJuIGFuIG9iamVjdFwiXG4gICAgICBdXG4gICAgXSk7XG4gICAgZm9yICh2YXIgX2kgPSAwLCBfYSA9IE9iamVjdC5rZXlzKGVmZmVjdHMpOyBfaSA8IF9hLmxlbmd0aDsgX2krKykge1xuICAgICAgdmFyIGVmZmVjdE5hbWUgPSBfYVtfaV07XG4gICAgICB0aGlzLnZhbGlkYXRlKFtcbiAgICAgICAgW1xuICAgICAgICAgICEhZWZmZWN0TmFtZS5tYXRjaCgvXFwvLyksXG4gICAgICAgICAgXCJJbnZhbGlkIGVmZmVjdCBuYW1lIChcIiArIG1vZGVsLm5hbWUgKyBcIi9cIiArIGVmZmVjdE5hbWUgKyBcIilcIlxuICAgICAgICBdLFxuICAgICAgICBbXG4gICAgICAgICAgdHlwZW9mIGVmZmVjdHNbZWZmZWN0TmFtZV0gIT09IFwiZnVuY3Rpb25cIixcbiAgICAgICAgICBcIkludmFsaWQgZWZmZWN0IChcIiArIG1vZGVsLm5hbWUgKyBcIi9cIiArIGVmZmVjdE5hbWUgKyBcIikuIE11c3QgYmUgYSBmdW5jdGlvblwiXG4gICAgICAgIF1cbiAgICAgIF0pO1xuICAgICAgdGhpcy5lZmZlY3RzW21vZGVsLm5hbWUgKyBcIi9cIiArIGVmZmVjdE5hbWVdID0gZWZmZWN0c1tlZmZlY3ROYW1lXS5iaW5kKHRoaXMuZGlzcGF0Y2hbbW9kZWwubmFtZV0pO1xuICAgICAgdGhpcy5kaXNwYXRjaFttb2RlbC5uYW1lXVtlZmZlY3ROYW1lXSA9IHRoaXMuY3JlYXRlRGlzcGF0Y2hlci5hcHBseSh0aGlzLCBbbW9kZWwubmFtZSwgZWZmZWN0TmFtZV0pO1xuICAgICAgdGhpcy5kaXNwYXRjaFttb2RlbC5uYW1lXVtlZmZlY3ROYW1lXS5pc0VmZmVjdCA9IHRydWU7XG4gICAgfVxuICB9LFxuICBtaWRkbGV3YXJlOiBmdW5jdGlvbihzdG9yZSkge1xuICAgIHZhciBfdGhpcyA9IHRoaXM7XG4gICAgcmV0dXJuIGZ1bmN0aW9uKG5leHQpIHtcbiAgICAgIHJldHVybiBmdW5jdGlvbihhY3Rpb24pIHtcbiAgICAgICAgcmV0dXJuIF9fYXdhaXRlcjIoX3RoaXMsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICByZXR1cm4gX19nZW5lcmF0b3IyKHRoaXMsIGZ1bmN0aW9uKF9hKSB7XG4gICAgICAgICAgICBzd2l0Y2ggKF9hLmxhYmVsKSB7XG4gICAgICAgICAgICAgIGNhc2UgMDpcbiAgICAgICAgICAgICAgICBpZiAoIShhY3Rpb24udHlwZSBpbiB0aGlzLmVmZmVjdHMpKVxuICAgICAgICAgICAgICAgICAgcmV0dXJuIFszLCAyXTtcbiAgICAgICAgICAgICAgICByZXR1cm4gWzQsIG5leHQoYWN0aW9uKV07XG4gICAgICAgICAgICAgIGNhc2UgMTpcbiAgICAgICAgICAgICAgICBfYS5zZW50KCk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIFsyLCB0aGlzLmVmZmVjdHNbYWN0aW9uLnR5cGVdKGFjdGlvbi5wYXlsb2FkLCBzdG9yZS5nZXRTdGF0ZSgpLCBhY3Rpb24ubWV0YSldO1xuICAgICAgICAgICAgICBjYXNlIDI6XG4gICAgICAgICAgICAgICAgcmV0dXJuIFsyLCBuZXh0KGFjdGlvbildO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICAgIH07XG4gICAgfTtcbiAgfVxufTtcbnZhciBlZmZlY3RzX2RlZmF1bHQgPSBlZmZlY3RzUGx1Z2luO1xuXG4vLyBub2RlX21vZHVsZXMvcmVkdXgvZXMvcmVkdXguanNcbnZhciByZWR1eF9leHBvcnRzID0ge307XG5fX2V4cG9ydChyZWR1eF9leHBvcnRzLCB7XG4gIF9fRE9fTk9UX1VTRV9fQWN0aW9uVHlwZXM6ICgpID0+IEFjdGlvblR5cGVzLFxuICBhcHBseU1pZGRsZXdhcmU6ICgpID0+IGFwcGx5TWlkZGxld2FyZSxcbiAgYmluZEFjdGlvbkNyZWF0b3JzOiAoKSA9PiBiaW5kQWN0aW9uQ3JlYXRvcnMsXG4gIGNvbWJpbmVSZWR1Y2VyczogKCkgPT4gY29tYmluZVJlZHVjZXJzLFxuICBjb21wb3NlOiAoKSA9PiBjb21wb3NlLFxuICBjcmVhdGVTdG9yZTogKCkgPT4gY3JlYXRlU3RvcmUsXG4gIGxlZ2FjeV9jcmVhdGVTdG9yZTogKCkgPT4gbGVnYWN5X2NyZWF0ZVN0b3JlXG59KTtcblxuLy8gbm9kZV9tb2R1bGVzL0BiYWJlbC9ydW50aW1lL2hlbHBlcnMvZXNtL2RlZmluZVByb3BlcnR5LmpzXG5mdW5jdGlvbiBfZGVmaW5lUHJvcGVydHkob2JqLCBrZXksIHZhbHVlKSB7XG4gIGlmIChrZXkgaW4gb2JqKSB7XG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KG9iaiwga2V5LCB7XG4gICAgICB2YWx1ZSxcbiAgICAgIGVudW1lcmFibGU6IHRydWUsXG4gICAgICBjb25maWd1cmFibGU6IHRydWUsXG4gICAgICB3cml0YWJsZTogdHJ1ZVxuICAgIH0pO1xuICB9IGVsc2Uge1xuICAgIG9ialtrZXldID0gdmFsdWU7XG4gIH1cbiAgcmV0dXJuIG9iajtcbn1cblxuLy8gbm9kZV9tb2R1bGVzL0BiYWJlbC9ydW50aW1lL2hlbHBlcnMvZXNtL29iamVjdFNwcmVhZDIuanNcbmZ1bmN0aW9uIG93bktleXMob2JqZWN0LCBlbnVtZXJhYmxlT25seSkge1xuICB2YXIga2V5cyA9IE9iamVjdC5rZXlzKG9iamVjdCk7XG4gIGlmIChPYmplY3QuZ2V0T3duUHJvcGVydHlTeW1ib2xzKSB7XG4gICAgdmFyIHN5bWJvbHMgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlTeW1ib2xzKG9iamVjdCk7XG4gICAgZW51bWVyYWJsZU9ubHkgJiYgKHN5bWJvbHMgPSBzeW1ib2xzLmZpbHRlcihmdW5jdGlvbihzeW0pIHtcbiAgICAgIHJldHVybiBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKG9iamVjdCwgc3ltKS5lbnVtZXJhYmxlO1xuICAgIH0pKSwga2V5cy5wdXNoLmFwcGx5KGtleXMsIHN5bWJvbHMpO1xuICB9XG4gIHJldHVybiBrZXlzO1xufVxuZnVuY3Rpb24gX29iamVjdFNwcmVhZDIodGFyZ2V0KSB7XG4gIGZvciAodmFyIGkyID0gMTsgaTIgPCBhcmd1bWVudHMubGVuZ3RoOyBpMisrKSB7XG4gICAgdmFyIHNvdXJjZSA9IG51bGwgIT0gYXJndW1lbnRzW2kyXSA/IGFyZ3VtZW50c1tpMl0gOiB7fTtcbiAgICBpMiAlIDIgPyBvd25LZXlzKE9iamVjdChzb3VyY2UpLCB0cnVlKS5mb3JFYWNoKGZ1bmN0aW9uKGtleSkge1xuICAgICAgX2RlZmluZVByb3BlcnR5KHRhcmdldCwga2V5LCBzb3VyY2Vba2V5XSk7XG4gICAgfSkgOiBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9ycyA/IE9iamVjdC5kZWZpbmVQcm9wZXJ0aWVzKHRhcmdldCwgT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcnMoc291cmNlKSkgOiBvd25LZXlzKE9iamVjdChzb3VyY2UpKS5mb3JFYWNoKGZ1bmN0aW9uKGtleSkge1xuICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRhcmdldCwga2V5LCBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKHNvdXJjZSwga2V5KSk7XG4gICAgfSk7XG4gIH1cbiAgcmV0dXJuIHRhcmdldDtcbn1cblxuLy8gbm9kZV9tb2R1bGVzL3JlZHV4L2VzL3JlZHV4LmpzXG52YXIgJCRvYnNlcnZhYmxlID0gZnVuY3Rpb24oKSB7XG4gIHJldHVybiB0eXBlb2YgU3ltYm9sID09PSBcImZ1bmN0aW9uXCIgJiYgU3ltYm9sLm9ic2VydmFibGUgfHwgXCJAQG9ic2VydmFibGVcIjtcbn0oKTtcbnZhciByYW5kb21TdHJpbmcgPSBmdW5jdGlvbiByYW5kb21TdHJpbmcyKCkge1xuICByZXR1cm4gTWF0aC5yYW5kb20oKS50b1N0cmluZygzNikuc3Vic3RyaW5nKDcpLnNwbGl0KFwiXCIpLmpvaW4oXCIuXCIpO1xufTtcbnZhciBBY3Rpb25UeXBlcyA9IHtcbiAgSU5JVDogXCJAQHJlZHV4L0lOSVRcIiArIHJhbmRvbVN0cmluZygpLFxuICBSRVBMQUNFOiBcIkBAcmVkdXgvUkVQTEFDRVwiICsgcmFuZG9tU3RyaW5nKCksXG4gIFBST0JFX1VOS05PV05fQUNUSU9OOiBmdW5jdGlvbiBQUk9CRV9VTktOT1dOX0FDVElPTigpIHtcbiAgICByZXR1cm4gXCJAQHJlZHV4L1BST0JFX1VOS05PV05fQUNUSU9OXCIgKyByYW5kb21TdHJpbmcoKTtcbiAgfVxufTtcbmZ1bmN0aW9uIGlzUGxhaW5PYmplY3Qob2JqKSB7XG4gIGlmICh0eXBlb2Ygb2JqICE9PSBcIm9iamVjdFwiIHx8IG9iaiA9PT0gbnVsbClcbiAgICByZXR1cm4gZmFsc2U7XG4gIHZhciBwcm90byA9IG9iajtcbiAgd2hpbGUgKE9iamVjdC5nZXRQcm90b3R5cGVPZihwcm90bykgIT09IG51bGwpIHtcbiAgICBwcm90byA9IE9iamVjdC5nZXRQcm90b3R5cGVPZihwcm90byk7XG4gIH1cbiAgcmV0dXJuIE9iamVjdC5nZXRQcm90b3R5cGVPZihvYmopID09PSBwcm90bztcbn1cbmZ1bmN0aW9uIG1pbmlLaW5kT2YodmFsKSB7XG4gIGlmICh2YWwgPT09IHZvaWQgMClcbiAgICByZXR1cm4gXCJ1bmRlZmluZWRcIjtcbiAgaWYgKHZhbCA9PT0gbnVsbClcbiAgICByZXR1cm4gXCJudWxsXCI7XG4gIHZhciB0eXBlID0gdHlwZW9mIHZhbDtcbiAgc3dpdGNoICh0eXBlKSB7XG4gICAgY2FzZSBcImJvb2xlYW5cIjpcbiAgICBjYXNlIFwic3RyaW5nXCI6XG4gICAgY2FzZSBcIm51bWJlclwiOlxuICAgIGNhc2UgXCJzeW1ib2xcIjpcbiAgICBjYXNlIFwiZnVuY3Rpb25cIjoge1xuICAgICAgcmV0dXJuIHR5cGU7XG4gICAgfVxuICB9XG4gIGlmIChBcnJheS5pc0FycmF5KHZhbCkpXG4gICAgcmV0dXJuIFwiYXJyYXlcIjtcbiAgaWYgKGlzRGF0ZSh2YWwpKVxuICAgIHJldHVybiBcImRhdGVcIjtcbiAgaWYgKGlzRXJyb3IodmFsKSlcbiAgICByZXR1cm4gXCJlcnJvclwiO1xuICB2YXIgY29uc3RydWN0b3JOYW1lID0gY3Rvck5hbWUodmFsKTtcbiAgc3dpdGNoIChjb25zdHJ1Y3Rvck5hbWUpIHtcbiAgICBjYXNlIFwiU3ltYm9sXCI6XG4gICAgY2FzZSBcIlByb21pc2VcIjpcbiAgICBjYXNlIFwiV2Vha01hcFwiOlxuICAgIGNhc2UgXCJXZWFrU2V0XCI6XG4gICAgY2FzZSBcIk1hcFwiOlxuICAgIGNhc2UgXCJTZXRcIjpcbiAgICAgIHJldHVybiBjb25zdHJ1Y3Rvck5hbWU7XG4gIH1cbiAgcmV0dXJuIHR5cGUuc2xpY2UoOCwgLTEpLnRvTG93ZXJDYXNlKCkucmVwbGFjZSgvXFxzL2csIFwiXCIpO1xufVxuZnVuY3Rpb24gY3Rvck5hbWUodmFsKSB7XG4gIHJldHVybiB0eXBlb2YgdmFsLmNvbnN0cnVjdG9yID09PSBcImZ1bmN0aW9uXCIgPyB2YWwuY29uc3RydWN0b3IubmFtZSA6IG51bGw7XG59XG5mdW5jdGlvbiBpc0Vycm9yKHZhbCkge1xuICByZXR1cm4gdmFsIGluc3RhbmNlb2YgRXJyb3IgfHwgdHlwZW9mIHZhbC5tZXNzYWdlID09PSBcInN0cmluZ1wiICYmIHZhbC5jb25zdHJ1Y3RvciAmJiB0eXBlb2YgdmFsLmNvbnN0cnVjdG9yLnN0YWNrVHJhY2VMaW1pdCA9PT0gXCJudW1iZXJcIjtcbn1cbmZ1bmN0aW9uIGlzRGF0ZSh2YWwpIHtcbiAgaWYgKHZhbCBpbnN0YW5jZW9mIERhdGUpXG4gICAgcmV0dXJuIHRydWU7XG4gIHJldHVybiB0eXBlb2YgdmFsLnRvRGF0ZVN0cmluZyA9PT0gXCJmdW5jdGlvblwiICYmIHR5cGVvZiB2YWwuZ2V0RGF0ZSA9PT0gXCJmdW5jdGlvblwiICYmIHR5cGVvZiB2YWwuc2V0RGF0ZSA9PT0gXCJmdW5jdGlvblwiO1xufVxuZnVuY3Rpb24ga2luZE9mKHZhbCkge1xuICB2YXIgdHlwZU9mVmFsID0gdHlwZW9mIHZhbDtcbiAgaWYgKHRydWUpIHtcbiAgICB0eXBlT2ZWYWwgPSBtaW5pS2luZE9mKHZhbCk7XG4gIH1cbiAgcmV0dXJuIHR5cGVPZlZhbDtcbn1cbmZ1bmN0aW9uIGNyZWF0ZVN0b3JlKHJlZHVjZXIsIHByZWxvYWRlZFN0YXRlLCBlbmhhbmNlcikge1xuICB2YXIgX3JlZjI7XG4gIGlmICh0eXBlb2YgcHJlbG9hZGVkU3RhdGUgPT09IFwiZnVuY3Rpb25cIiAmJiB0eXBlb2YgZW5oYW5jZXIgPT09IFwiZnVuY3Rpb25cIiB8fCB0eXBlb2YgZW5oYW5jZXIgPT09IFwiZnVuY3Rpb25cIiAmJiB0eXBlb2YgYXJndW1lbnRzWzNdID09PSBcImZ1bmN0aW9uXCIpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoZmFsc2UgPyBmb3JtYXRQcm9kRXJyb3JNZXNzYWdlKDApIDogXCJJdCBsb29rcyBsaWtlIHlvdSBhcmUgcGFzc2luZyBzZXZlcmFsIHN0b3JlIGVuaGFuY2VycyB0byBjcmVhdGVTdG9yZSgpLiBUaGlzIGlzIG5vdCBzdXBwb3J0ZWQuIEluc3RlYWQsIGNvbXBvc2UgdGhlbSB0b2dldGhlciB0byBhIHNpbmdsZSBmdW5jdGlvbi4gU2VlIGh0dHBzOi8vcmVkdXguanMub3JnL3R1dG9yaWFscy9mdW5kYW1lbnRhbHMvcGFydC00LXN0b3JlI2NyZWF0aW5nLWEtc3RvcmUtd2l0aC1lbmhhbmNlcnMgZm9yIGFuIGV4YW1wbGUuXCIpO1xuICB9XG4gIGlmICh0eXBlb2YgcHJlbG9hZGVkU3RhdGUgPT09IFwiZnVuY3Rpb25cIiAmJiB0eXBlb2YgZW5oYW5jZXIgPT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICBlbmhhbmNlciA9IHByZWxvYWRlZFN0YXRlO1xuICAgIHByZWxvYWRlZFN0YXRlID0gdm9pZCAwO1xuICB9XG4gIGlmICh0eXBlb2YgZW5oYW5jZXIgIT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICBpZiAodHlwZW9mIGVuaGFuY2VyICE9PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihmYWxzZSA/IGZvcm1hdFByb2RFcnJvck1lc3NhZ2UoMSkgOiBcIkV4cGVjdGVkIHRoZSBlbmhhbmNlciB0byBiZSBhIGZ1bmN0aW9uLiBJbnN0ZWFkLCByZWNlaXZlZDogJ1wiICsga2luZE9mKGVuaGFuY2VyKSArIFwiJ1wiKTtcbiAgICB9XG4gICAgcmV0dXJuIGVuaGFuY2VyKGNyZWF0ZVN0b3JlKShyZWR1Y2VyLCBwcmVsb2FkZWRTdGF0ZSk7XG4gIH1cbiAgaWYgKHR5cGVvZiByZWR1Y2VyICE9PSBcImZ1bmN0aW9uXCIpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoZmFsc2UgPyBmb3JtYXRQcm9kRXJyb3JNZXNzYWdlKDIpIDogXCJFeHBlY3RlZCB0aGUgcm9vdCByZWR1Y2VyIHRvIGJlIGEgZnVuY3Rpb24uIEluc3RlYWQsIHJlY2VpdmVkOiAnXCIgKyBraW5kT2YocmVkdWNlcikgKyBcIidcIik7XG4gIH1cbiAgdmFyIGN1cnJlbnRSZWR1Y2VyID0gcmVkdWNlcjtcbiAgdmFyIGN1cnJlbnRTdGF0ZSA9IHByZWxvYWRlZFN0YXRlO1xuICB2YXIgY3VycmVudExpc3RlbmVycyA9IFtdO1xuICB2YXIgbmV4dExpc3RlbmVycyA9IGN1cnJlbnRMaXN0ZW5lcnM7XG4gIHZhciBpc0Rpc3BhdGNoaW5nID0gZmFsc2U7XG4gIGZ1bmN0aW9uIGVuc3VyZUNhbk11dGF0ZU5leHRMaXN0ZW5lcnMoKSB7XG4gICAgaWYgKG5leHRMaXN0ZW5lcnMgPT09IGN1cnJlbnRMaXN0ZW5lcnMpIHtcbiAgICAgIG5leHRMaXN0ZW5lcnMgPSBjdXJyZW50TGlzdGVuZXJzLnNsaWNlKCk7XG4gICAgfVxuICB9XG4gIGZ1bmN0aW9uIGdldFN0YXRlKCkge1xuICAgIGlmIChpc0Rpc3BhdGNoaW5nKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoZmFsc2UgPyBmb3JtYXRQcm9kRXJyb3JNZXNzYWdlKDMpIDogXCJZb3UgbWF5IG5vdCBjYWxsIHN0b3JlLmdldFN0YXRlKCkgd2hpbGUgdGhlIHJlZHVjZXIgaXMgZXhlY3V0aW5nLiBUaGUgcmVkdWNlciBoYXMgYWxyZWFkeSByZWNlaXZlZCB0aGUgc3RhdGUgYXMgYW4gYXJndW1lbnQuIFBhc3MgaXQgZG93biBmcm9tIHRoZSB0b3AgcmVkdWNlciBpbnN0ZWFkIG9mIHJlYWRpbmcgaXQgZnJvbSB0aGUgc3RvcmUuXCIpO1xuICAgIH1cbiAgICByZXR1cm4gY3VycmVudFN0YXRlO1xuICB9XG4gIGZ1bmN0aW9uIHN1YnNjcmliZShsaXN0ZW5lcikge1xuICAgIGlmICh0eXBlb2YgbGlzdGVuZXIgIT09IFwiZnVuY3Rpb25cIikge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKGZhbHNlID8gZm9ybWF0UHJvZEVycm9yTWVzc2FnZSg0KSA6IFwiRXhwZWN0ZWQgdGhlIGxpc3RlbmVyIHRvIGJlIGEgZnVuY3Rpb24uIEluc3RlYWQsIHJlY2VpdmVkOiAnXCIgKyBraW5kT2YobGlzdGVuZXIpICsgXCInXCIpO1xuICAgIH1cbiAgICBpZiAoaXNEaXNwYXRjaGluZykge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKGZhbHNlID8gZm9ybWF0UHJvZEVycm9yTWVzc2FnZSg1KSA6IFwiWW91IG1heSBub3QgY2FsbCBzdG9yZS5zdWJzY3JpYmUoKSB3aGlsZSB0aGUgcmVkdWNlciBpcyBleGVjdXRpbmcuIElmIHlvdSB3b3VsZCBsaWtlIHRvIGJlIG5vdGlmaWVkIGFmdGVyIHRoZSBzdG9yZSBoYXMgYmVlbiB1cGRhdGVkLCBzdWJzY3JpYmUgZnJvbSBhIGNvbXBvbmVudCBhbmQgaW52b2tlIHN0b3JlLmdldFN0YXRlKCkgaW4gdGhlIGNhbGxiYWNrIHRvIGFjY2VzcyB0aGUgbGF0ZXN0IHN0YXRlLiBTZWUgaHR0cHM6Ly9yZWR1eC5qcy5vcmcvYXBpL3N0b3JlI3N1YnNjcmliZWxpc3RlbmVyIGZvciBtb3JlIGRldGFpbHMuXCIpO1xuICAgIH1cbiAgICB2YXIgaXNTdWJzY3JpYmVkID0gdHJ1ZTtcbiAgICBlbnN1cmVDYW5NdXRhdGVOZXh0TGlzdGVuZXJzKCk7XG4gICAgbmV4dExpc3RlbmVycy5wdXNoKGxpc3RlbmVyKTtcbiAgICByZXR1cm4gZnVuY3Rpb24gdW5zdWJzY3JpYmUoKSB7XG4gICAgICBpZiAoIWlzU3Vic2NyaWJlZCkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICBpZiAoaXNEaXNwYXRjaGluZykge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoZmFsc2UgPyBmb3JtYXRQcm9kRXJyb3JNZXNzYWdlKDYpIDogXCJZb3UgbWF5IG5vdCB1bnN1YnNjcmliZSBmcm9tIGEgc3RvcmUgbGlzdGVuZXIgd2hpbGUgdGhlIHJlZHVjZXIgaXMgZXhlY3V0aW5nLiBTZWUgaHR0cHM6Ly9yZWR1eC5qcy5vcmcvYXBpL3N0b3JlI3N1YnNjcmliZWxpc3RlbmVyIGZvciBtb3JlIGRldGFpbHMuXCIpO1xuICAgICAgfVxuICAgICAgaXNTdWJzY3JpYmVkID0gZmFsc2U7XG4gICAgICBlbnN1cmVDYW5NdXRhdGVOZXh0TGlzdGVuZXJzKCk7XG4gICAgICB2YXIgaW5kZXggPSBuZXh0TGlzdGVuZXJzLmluZGV4T2YobGlzdGVuZXIpO1xuICAgICAgbmV4dExpc3RlbmVycy5zcGxpY2UoaW5kZXgsIDEpO1xuICAgICAgY3VycmVudExpc3RlbmVycyA9IG51bGw7XG4gICAgfTtcbiAgfVxuICBmdW5jdGlvbiBkaXNwYXRjaChhY3Rpb24pIHtcbiAgICBpZiAoIWlzUGxhaW5PYmplY3QoYWN0aW9uKSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKGZhbHNlID8gZm9ybWF0UHJvZEVycm9yTWVzc2FnZSg3KSA6IFwiQWN0aW9ucyBtdXN0IGJlIHBsYWluIG9iamVjdHMuIEluc3RlYWQsIHRoZSBhY3R1YWwgdHlwZSB3YXM6ICdcIiArIGtpbmRPZihhY3Rpb24pICsgXCInLiBZb3UgbWF5IG5lZWQgdG8gYWRkIG1pZGRsZXdhcmUgdG8geW91ciBzdG9yZSBzZXR1cCB0byBoYW5kbGUgZGlzcGF0Y2hpbmcgb3RoZXIgdmFsdWVzLCBzdWNoIGFzICdyZWR1eC10aHVuaycgdG8gaGFuZGxlIGRpc3BhdGNoaW5nIGZ1bmN0aW9ucy4gU2VlIGh0dHBzOi8vcmVkdXguanMub3JnL3R1dG9yaWFscy9mdW5kYW1lbnRhbHMvcGFydC00LXN0b3JlI21pZGRsZXdhcmUgYW5kIGh0dHBzOi8vcmVkdXguanMub3JnL3R1dG9yaWFscy9mdW5kYW1lbnRhbHMvcGFydC02LWFzeW5jLWxvZ2ljI3VzaW5nLXRoZS1yZWR1eC10aHVuay1taWRkbGV3YXJlIGZvciBleGFtcGxlcy5cIik7XG4gICAgfVxuICAgIGlmICh0eXBlb2YgYWN0aW9uLnR5cGUgPT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihmYWxzZSA/IGZvcm1hdFByb2RFcnJvck1lc3NhZ2UoOCkgOiAnQWN0aW9ucyBtYXkgbm90IGhhdmUgYW4gdW5kZWZpbmVkIFwidHlwZVwiIHByb3BlcnR5LiBZb3UgbWF5IGhhdmUgbWlzc3BlbGxlZCBhbiBhY3Rpb24gdHlwZSBzdHJpbmcgY29uc3RhbnQuJyk7XG4gICAgfVxuICAgIGlmIChpc0Rpc3BhdGNoaW5nKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoZmFsc2UgPyBmb3JtYXRQcm9kRXJyb3JNZXNzYWdlKDkpIDogXCJSZWR1Y2VycyBtYXkgbm90IGRpc3BhdGNoIGFjdGlvbnMuXCIpO1xuICAgIH1cbiAgICB0cnkge1xuICAgICAgaXNEaXNwYXRjaGluZyA9IHRydWU7XG4gICAgICBjdXJyZW50U3RhdGUgPSBjdXJyZW50UmVkdWNlcihjdXJyZW50U3RhdGUsIGFjdGlvbik7XG4gICAgfSBmaW5hbGx5IHtcbiAgICAgIGlzRGlzcGF0Y2hpbmcgPSBmYWxzZTtcbiAgICB9XG4gICAgdmFyIGxpc3RlbmVycyA9IGN1cnJlbnRMaXN0ZW5lcnMgPSBuZXh0TGlzdGVuZXJzO1xuICAgIGZvciAodmFyIGkyID0gMDsgaTIgPCBsaXN0ZW5lcnMubGVuZ3RoOyBpMisrKSB7XG4gICAgICB2YXIgbGlzdGVuZXIgPSBsaXN0ZW5lcnNbaTJdO1xuICAgICAgbGlzdGVuZXIoKTtcbiAgICB9XG4gICAgcmV0dXJuIGFjdGlvbjtcbiAgfVxuICBmdW5jdGlvbiByZXBsYWNlUmVkdWNlcihuZXh0UmVkdWNlcikge1xuICAgIGlmICh0eXBlb2YgbmV4dFJlZHVjZXIgIT09IFwiZnVuY3Rpb25cIikge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKGZhbHNlID8gZm9ybWF0UHJvZEVycm9yTWVzc2FnZSgxMCkgOiBcIkV4cGVjdGVkIHRoZSBuZXh0UmVkdWNlciB0byBiZSBhIGZ1bmN0aW9uLiBJbnN0ZWFkLCByZWNlaXZlZDogJ1wiICsga2luZE9mKG5leHRSZWR1Y2VyKSk7XG4gICAgfVxuICAgIGN1cnJlbnRSZWR1Y2VyID0gbmV4dFJlZHVjZXI7XG4gICAgZGlzcGF0Y2goe1xuICAgICAgdHlwZTogQWN0aW9uVHlwZXMuUkVQTEFDRVxuICAgIH0pO1xuICB9XG4gIGZ1bmN0aW9uIG9ic2VydmFibGUoKSB7XG4gICAgdmFyIF9yZWY7XG4gICAgdmFyIG91dGVyU3Vic2NyaWJlID0gc3Vic2NyaWJlO1xuICAgIHJldHVybiBfcmVmID0ge1xuICAgICAgc3Vic2NyaWJlOiBmdW5jdGlvbiBzdWJzY3JpYmUyKG9ic2VydmVyKSB7XG4gICAgICAgIGlmICh0eXBlb2Ygb2JzZXJ2ZXIgIT09IFwib2JqZWN0XCIgfHwgb2JzZXJ2ZXIgPT09IG51bGwpIHtcbiAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoZmFsc2UgPyBmb3JtYXRQcm9kRXJyb3JNZXNzYWdlKDExKSA6IFwiRXhwZWN0ZWQgdGhlIG9ic2VydmVyIHRvIGJlIGFuIG9iamVjdC4gSW5zdGVhZCwgcmVjZWl2ZWQ6ICdcIiArIGtpbmRPZihvYnNlcnZlcikgKyBcIidcIik7XG4gICAgICAgIH1cbiAgICAgICAgZnVuY3Rpb24gb2JzZXJ2ZVN0YXRlKCkge1xuICAgICAgICAgIGlmIChvYnNlcnZlci5uZXh0KSB7XG4gICAgICAgICAgICBvYnNlcnZlci5uZXh0KGdldFN0YXRlKCkpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBvYnNlcnZlU3RhdGUoKTtcbiAgICAgICAgdmFyIHVuc3Vic2NyaWJlID0gb3V0ZXJTdWJzY3JpYmUob2JzZXJ2ZVN0YXRlKTtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICB1bnN1YnNjcmliZVxuICAgICAgICB9O1xuICAgICAgfVxuICAgIH0sIF9yZWZbJCRvYnNlcnZhYmxlXSA9IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfSwgX3JlZjtcbiAgfVxuICBkaXNwYXRjaCh7XG4gICAgdHlwZTogQWN0aW9uVHlwZXMuSU5JVFxuICB9KTtcbiAgcmV0dXJuIF9yZWYyID0ge1xuICAgIGRpc3BhdGNoLFxuICAgIHN1YnNjcmliZSxcbiAgICBnZXRTdGF0ZSxcbiAgICByZXBsYWNlUmVkdWNlclxuICB9LCBfcmVmMlskJG9ic2VydmFibGVdID0gb2JzZXJ2YWJsZSwgX3JlZjI7XG59XG52YXIgbGVnYWN5X2NyZWF0ZVN0b3JlID0gY3JlYXRlU3RvcmU7XG5mdW5jdGlvbiB3YXJuaW5nKG1lc3NhZ2UpIHtcbiAgaWYgKHR5cGVvZiBjb25zb2xlICE9PSBcInVuZGVmaW5lZFwiICYmIHR5cGVvZiBjb25zb2xlLmVycm9yID09PSBcImZ1bmN0aW9uXCIpIHtcbiAgICBjb25zb2xlLmVycm9yKG1lc3NhZ2UpO1xuICB9XG4gIHRyeSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKG1lc3NhZ2UpO1xuICB9IGNhdGNoIChlKSB7XG4gIH1cbn1cbmZ1bmN0aW9uIGdldFVuZXhwZWN0ZWRTdGF0ZVNoYXBlV2FybmluZ01lc3NhZ2UoaW5wdXRTdGF0ZSwgcmVkdWNlcnMsIGFjdGlvbiwgdW5leHBlY3RlZEtleUNhY2hlKSB7XG4gIHZhciByZWR1Y2VyS2V5cyA9IE9iamVjdC5rZXlzKHJlZHVjZXJzKTtcbiAgdmFyIGFyZ3VtZW50TmFtZSA9IGFjdGlvbiAmJiBhY3Rpb24udHlwZSA9PT0gQWN0aW9uVHlwZXMuSU5JVCA/IFwicHJlbG9hZGVkU3RhdGUgYXJndW1lbnQgcGFzc2VkIHRvIGNyZWF0ZVN0b3JlXCIgOiBcInByZXZpb3VzIHN0YXRlIHJlY2VpdmVkIGJ5IHRoZSByZWR1Y2VyXCI7XG4gIGlmIChyZWR1Y2VyS2V5cy5sZW5ndGggPT09IDApIHtcbiAgICByZXR1cm4gXCJTdG9yZSBkb2VzIG5vdCBoYXZlIGEgdmFsaWQgcmVkdWNlci4gTWFrZSBzdXJlIHRoZSBhcmd1bWVudCBwYXNzZWQgdG8gY29tYmluZVJlZHVjZXJzIGlzIGFuIG9iamVjdCB3aG9zZSB2YWx1ZXMgYXJlIHJlZHVjZXJzLlwiO1xuICB9XG4gIGlmICghaXNQbGFpbk9iamVjdChpbnB1dFN0YXRlKSkge1xuICAgIHJldHVybiBcIlRoZSBcIiArIGFyZ3VtZW50TmFtZSArICcgaGFzIHVuZXhwZWN0ZWQgdHlwZSBvZiBcIicgKyBraW5kT2YoaW5wdXRTdGF0ZSkgKyAnXCIuIEV4cGVjdGVkIGFyZ3VtZW50IHRvIGJlIGFuIG9iamVjdCB3aXRoIHRoZSBmb2xsb3dpbmcgJyArICgna2V5czogXCInICsgcmVkdWNlcktleXMuam9pbignXCIsIFwiJykgKyAnXCInKTtcbiAgfVxuICB2YXIgdW5leHBlY3RlZEtleXMgPSBPYmplY3Qua2V5cyhpbnB1dFN0YXRlKS5maWx0ZXIoZnVuY3Rpb24oa2V5KSB7XG4gICAgcmV0dXJuICFyZWR1Y2Vycy5oYXNPd25Qcm9wZXJ0eShrZXkpICYmICF1bmV4cGVjdGVkS2V5Q2FjaGVba2V5XTtcbiAgfSk7XG4gIHVuZXhwZWN0ZWRLZXlzLmZvckVhY2goZnVuY3Rpb24oa2V5KSB7XG4gICAgdW5leHBlY3RlZEtleUNhY2hlW2tleV0gPSB0cnVlO1xuICB9KTtcbiAgaWYgKGFjdGlvbiAmJiBhY3Rpb24udHlwZSA9PT0gQWN0aW9uVHlwZXMuUkVQTEFDRSlcbiAgICByZXR1cm47XG4gIGlmICh1bmV4cGVjdGVkS2V5cy5sZW5ndGggPiAwKSB7XG4gICAgcmV0dXJuIFwiVW5leHBlY3RlZCBcIiArICh1bmV4cGVjdGVkS2V5cy5sZW5ndGggPiAxID8gXCJrZXlzXCIgOiBcImtleVwiKSArIFwiIFwiICsgKCdcIicgKyB1bmV4cGVjdGVkS2V5cy5qb2luKCdcIiwgXCInKSArICdcIiBmb3VuZCBpbiAnICsgYXJndW1lbnROYW1lICsgXCIuIFwiKSArIFwiRXhwZWN0ZWQgdG8gZmluZCBvbmUgb2YgdGhlIGtub3duIHJlZHVjZXIga2V5cyBpbnN0ZWFkOiBcIiArICgnXCInICsgcmVkdWNlcktleXMuam9pbignXCIsIFwiJykgKyAnXCIuIFVuZXhwZWN0ZWQga2V5cyB3aWxsIGJlIGlnbm9yZWQuJyk7XG4gIH1cbn1cbmZ1bmN0aW9uIGFzc2VydFJlZHVjZXJTaGFwZShyZWR1Y2Vycykge1xuICBPYmplY3Qua2V5cyhyZWR1Y2VycykuZm9yRWFjaChmdW5jdGlvbihrZXkpIHtcbiAgICB2YXIgcmVkdWNlciA9IHJlZHVjZXJzW2tleV07XG4gICAgdmFyIGluaXRpYWxTdGF0ZSA9IHJlZHVjZXIodm9pZCAwLCB7XG4gICAgICB0eXBlOiBBY3Rpb25UeXBlcy5JTklUXG4gICAgfSk7XG4gICAgaWYgKHR5cGVvZiBpbml0aWFsU3RhdGUgPT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihmYWxzZSA/IGZvcm1hdFByb2RFcnJvck1lc3NhZ2UoMTIpIDogJ1RoZSBzbGljZSByZWR1Y2VyIGZvciBrZXkgXCInICsga2V5ICsgYFwiIHJldHVybmVkIHVuZGVmaW5lZCBkdXJpbmcgaW5pdGlhbGl6YXRpb24uIElmIHRoZSBzdGF0ZSBwYXNzZWQgdG8gdGhlIHJlZHVjZXIgaXMgdW5kZWZpbmVkLCB5b3UgbXVzdCBleHBsaWNpdGx5IHJldHVybiB0aGUgaW5pdGlhbCBzdGF0ZS4gVGhlIGluaXRpYWwgc3RhdGUgbWF5IG5vdCBiZSB1bmRlZmluZWQuIElmIHlvdSBkb24ndCB3YW50IHRvIHNldCBhIHZhbHVlIGZvciB0aGlzIHJlZHVjZXIsIHlvdSBjYW4gdXNlIG51bGwgaW5zdGVhZCBvZiB1bmRlZmluZWQuYCk7XG4gICAgfVxuICAgIGlmICh0eXBlb2YgcmVkdWNlcih2b2lkIDAsIHtcbiAgICAgIHR5cGU6IEFjdGlvblR5cGVzLlBST0JFX1VOS05PV05fQUNUSU9OKClcbiAgICB9KSA9PT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKGZhbHNlID8gZm9ybWF0UHJvZEVycm9yTWVzc2FnZSgxMykgOiAnVGhlIHNsaWNlIHJlZHVjZXIgZm9yIGtleSBcIicgKyBrZXkgKyAnXCIgcmV0dXJuZWQgdW5kZWZpbmVkIHdoZW4gcHJvYmVkIHdpdGggYSByYW5kb20gdHlwZS4gJyArIChcIkRvbid0IHRyeSB0byBoYW5kbGUgJ1wiICsgQWN0aW9uVHlwZXMuSU5JVCArIGAnIG9yIG90aGVyIGFjdGlvbnMgaW4gXCJyZWR1eC8qXCIgYCkgKyBcIm5hbWVzcGFjZS4gVGhleSBhcmUgY29uc2lkZXJlZCBwcml2YXRlLiBJbnN0ZWFkLCB5b3UgbXVzdCByZXR1cm4gdGhlIGN1cnJlbnQgc3RhdGUgZm9yIGFueSB1bmtub3duIGFjdGlvbnMsIHVubGVzcyBpdCBpcyB1bmRlZmluZWQsIGluIHdoaWNoIGNhc2UgeW91IG11c3QgcmV0dXJuIHRoZSBpbml0aWFsIHN0YXRlLCByZWdhcmRsZXNzIG9mIHRoZSBhY3Rpb24gdHlwZS4gVGhlIGluaXRpYWwgc3RhdGUgbWF5IG5vdCBiZSB1bmRlZmluZWQsIGJ1dCBjYW4gYmUgbnVsbC5cIik7XG4gICAgfVxuICB9KTtcbn1cbmZ1bmN0aW9uIGNvbWJpbmVSZWR1Y2VycyhyZWR1Y2Vycykge1xuICB2YXIgcmVkdWNlcktleXMgPSBPYmplY3Qua2V5cyhyZWR1Y2Vycyk7XG4gIHZhciBmaW5hbFJlZHVjZXJzID0ge307XG4gIGZvciAodmFyIGkyID0gMDsgaTIgPCByZWR1Y2VyS2V5cy5sZW5ndGg7IGkyKyspIHtcbiAgICB2YXIga2V5ID0gcmVkdWNlcktleXNbaTJdO1xuICAgIGlmICh0cnVlKSB7XG4gICAgICBpZiAodHlwZW9mIHJlZHVjZXJzW2tleV0gPT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICAgICAgd2FybmluZygnTm8gcmVkdWNlciBwcm92aWRlZCBmb3Iga2V5IFwiJyArIGtleSArICdcIicpO1xuICAgICAgfVxuICAgIH1cbiAgICBpZiAodHlwZW9mIHJlZHVjZXJzW2tleV0gPT09IFwiZnVuY3Rpb25cIikge1xuICAgICAgZmluYWxSZWR1Y2Vyc1trZXldID0gcmVkdWNlcnNba2V5XTtcbiAgICB9XG4gIH1cbiAgdmFyIGZpbmFsUmVkdWNlcktleXMgPSBPYmplY3Qua2V5cyhmaW5hbFJlZHVjZXJzKTtcbiAgdmFyIHVuZXhwZWN0ZWRLZXlDYWNoZTtcbiAgaWYgKHRydWUpIHtcbiAgICB1bmV4cGVjdGVkS2V5Q2FjaGUgPSB7fTtcbiAgfVxuICB2YXIgc2hhcGVBc3NlcnRpb25FcnJvcjtcbiAgdHJ5IHtcbiAgICBhc3NlcnRSZWR1Y2VyU2hhcGUoZmluYWxSZWR1Y2Vycyk7XG4gIH0gY2F0Y2ggKGUpIHtcbiAgICBzaGFwZUFzc2VydGlvbkVycm9yID0gZTtcbiAgfVxuICByZXR1cm4gZnVuY3Rpb24gY29tYmluYXRpb24oc3RhdGUsIGFjdGlvbikge1xuICAgIGlmIChzdGF0ZSA9PT0gdm9pZCAwKSB7XG4gICAgICBzdGF0ZSA9IHt9O1xuICAgIH1cbiAgICBpZiAoc2hhcGVBc3NlcnRpb25FcnJvcikge1xuICAgICAgdGhyb3cgc2hhcGVBc3NlcnRpb25FcnJvcjtcbiAgICB9XG4gICAgaWYgKHRydWUpIHtcbiAgICAgIHZhciB3YXJuaW5nTWVzc2FnZSA9IGdldFVuZXhwZWN0ZWRTdGF0ZVNoYXBlV2FybmluZ01lc3NhZ2Uoc3RhdGUsIGZpbmFsUmVkdWNlcnMsIGFjdGlvbiwgdW5leHBlY3RlZEtleUNhY2hlKTtcbiAgICAgIGlmICh3YXJuaW5nTWVzc2FnZSkge1xuICAgICAgICB3YXJuaW5nKHdhcm5pbmdNZXNzYWdlKTtcbiAgICAgIH1cbiAgICB9XG4gICAgdmFyIGhhc0NoYW5nZWQgPSBmYWxzZTtcbiAgICB2YXIgbmV4dFN0YXRlMyA9IHt9O1xuICAgIGZvciAodmFyIF9pID0gMDsgX2kgPCBmaW5hbFJlZHVjZXJLZXlzLmxlbmd0aDsgX2krKykge1xuICAgICAgdmFyIF9rZXkgPSBmaW5hbFJlZHVjZXJLZXlzW19pXTtcbiAgICAgIHZhciByZWR1Y2VyID0gZmluYWxSZWR1Y2Vyc1tfa2V5XTtcbiAgICAgIHZhciBwcmV2aW91c1N0YXRlRm9yS2V5ID0gc3RhdGVbX2tleV07XG4gICAgICB2YXIgbmV4dFN0YXRlRm9yS2V5ID0gcmVkdWNlcihwcmV2aW91c1N0YXRlRm9yS2V5LCBhY3Rpb24pO1xuICAgICAgaWYgKHR5cGVvZiBuZXh0U3RhdGVGb3JLZXkgPT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICAgICAgdmFyIGFjdGlvblR5cGUgPSBhY3Rpb24gJiYgYWN0aW9uLnR5cGU7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihmYWxzZSA/IGZvcm1hdFByb2RFcnJvck1lc3NhZ2UoMTQpIDogXCJXaGVuIGNhbGxlZCB3aXRoIGFuIGFjdGlvbiBvZiB0eXBlIFwiICsgKGFjdGlvblR5cGUgPyAnXCInICsgU3RyaW5nKGFjdGlvblR5cGUpICsgJ1wiJyA6IFwiKHVua25vd24gdHlwZSlcIikgKyAnLCB0aGUgc2xpY2UgcmVkdWNlciBmb3Iga2V5IFwiJyArIF9rZXkgKyAnXCIgcmV0dXJuZWQgdW5kZWZpbmVkLiBUbyBpZ25vcmUgYW4gYWN0aW9uLCB5b3UgbXVzdCBleHBsaWNpdGx5IHJldHVybiB0aGUgcHJldmlvdXMgc3RhdGUuIElmIHlvdSB3YW50IHRoaXMgcmVkdWNlciB0byBob2xkIG5vIHZhbHVlLCB5b3UgY2FuIHJldHVybiBudWxsIGluc3RlYWQgb2YgdW5kZWZpbmVkLicpO1xuICAgICAgfVxuICAgICAgbmV4dFN0YXRlM1tfa2V5XSA9IG5leHRTdGF0ZUZvcktleTtcbiAgICAgIGhhc0NoYW5nZWQgPSBoYXNDaGFuZ2VkIHx8IG5leHRTdGF0ZUZvcktleSAhPT0gcHJldmlvdXNTdGF0ZUZvcktleTtcbiAgICB9XG4gICAgaGFzQ2hhbmdlZCA9IGhhc0NoYW5nZWQgfHwgZmluYWxSZWR1Y2VyS2V5cy5sZW5ndGggIT09IE9iamVjdC5rZXlzKHN0YXRlKS5sZW5ndGg7XG4gICAgcmV0dXJuIGhhc0NoYW5nZWQgPyBuZXh0U3RhdGUzIDogc3RhdGU7XG4gIH07XG59XG5mdW5jdGlvbiBiaW5kQWN0aW9uQ3JlYXRvcihhY3Rpb25DcmVhdG9yLCBkaXNwYXRjaCkge1xuICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIGRpc3BhdGNoKGFjdGlvbkNyZWF0b3IuYXBwbHkodGhpcywgYXJndW1lbnRzKSk7XG4gIH07XG59XG5mdW5jdGlvbiBiaW5kQWN0aW9uQ3JlYXRvcnMoYWN0aW9uQ3JlYXRvcnMsIGRpc3BhdGNoKSB7XG4gIGlmICh0eXBlb2YgYWN0aW9uQ3JlYXRvcnMgPT09IFwiZnVuY3Rpb25cIikge1xuICAgIHJldHVybiBiaW5kQWN0aW9uQ3JlYXRvcihhY3Rpb25DcmVhdG9ycywgZGlzcGF0Y2gpO1xuICB9XG4gIGlmICh0eXBlb2YgYWN0aW9uQ3JlYXRvcnMgIT09IFwib2JqZWN0XCIgfHwgYWN0aW9uQ3JlYXRvcnMgPT09IG51bGwpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoZmFsc2UgPyBmb3JtYXRQcm9kRXJyb3JNZXNzYWdlKDE2KSA6IFwiYmluZEFjdGlvbkNyZWF0b3JzIGV4cGVjdGVkIGFuIG9iamVjdCBvciBhIGZ1bmN0aW9uLCBidXQgaW5zdGVhZCByZWNlaXZlZDogJ1wiICsga2luZE9mKGFjdGlvbkNyZWF0b3JzKSArIGAnLiBEaWQgeW91IHdyaXRlIFwiaW1wb3J0IEFjdGlvbkNyZWF0b3JzIGZyb21cIiBpbnN0ZWFkIG9mIFwiaW1wb3J0ICogYXMgQWN0aW9uQ3JlYXRvcnMgZnJvbVwiP2ApO1xuICB9XG4gIHZhciBib3VuZEFjdGlvbkNyZWF0b3JzID0ge307XG4gIGZvciAodmFyIGtleSBpbiBhY3Rpb25DcmVhdG9ycykge1xuICAgIHZhciBhY3Rpb25DcmVhdG9yID0gYWN0aW9uQ3JlYXRvcnNba2V5XTtcbiAgICBpZiAodHlwZW9mIGFjdGlvbkNyZWF0b3IgPT09IFwiZnVuY3Rpb25cIikge1xuICAgICAgYm91bmRBY3Rpb25DcmVhdG9yc1trZXldID0gYmluZEFjdGlvbkNyZWF0b3IoYWN0aW9uQ3JlYXRvciwgZGlzcGF0Y2gpO1xuICAgIH1cbiAgfVxuICByZXR1cm4gYm91bmRBY3Rpb25DcmVhdG9ycztcbn1cbmZ1bmN0aW9uIGNvbXBvc2UoKSB7XG4gIGZvciAodmFyIF9sZW4gPSBhcmd1bWVudHMubGVuZ3RoLCBmdW5jcyA9IG5ldyBBcnJheShfbGVuKSwgX2tleSA9IDA7IF9rZXkgPCBfbGVuOyBfa2V5KyspIHtcbiAgICBmdW5jc1tfa2V5XSA9IGFyZ3VtZW50c1tfa2V5XTtcbiAgfVxuICBpZiAoZnVuY3MubGVuZ3RoID09PSAwKSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uKGFyZykge1xuICAgICAgcmV0dXJuIGFyZztcbiAgICB9O1xuICB9XG4gIGlmIChmdW5jcy5sZW5ndGggPT09IDEpIHtcbiAgICByZXR1cm4gZnVuY3NbMF07XG4gIH1cbiAgcmV0dXJuIGZ1bmNzLnJlZHVjZShmdW5jdGlvbihhMiwgYjIpIHtcbiAgICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gYTIoYjIuYXBwbHkodm9pZCAwLCBhcmd1bWVudHMpKTtcbiAgICB9O1xuICB9KTtcbn1cbmZ1bmN0aW9uIGFwcGx5TWlkZGxld2FyZSgpIHtcbiAgZm9yICh2YXIgX2xlbiA9IGFyZ3VtZW50cy5sZW5ndGgsIG1pZGRsZXdhcmVzID0gbmV3IEFycmF5KF9sZW4pLCBfa2V5ID0gMDsgX2tleSA8IF9sZW47IF9rZXkrKykge1xuICAgIG1pZGRsZXdhcmVzW19rZXldID0gYXJndW1lbnRzW19rZXldO1xuICB9XG4gIHJldHVybiBmdW5jdGlvbihjcmVhdGVTdG9yZTMpIHtcbiAgICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgc3RvcmUgPSBjcmVhdGVTdG9yZTMuYXBwbHkodm9pZCAwLCBhcmd1bWVudHMpO1xuICAgICAgdmFyIF9kaXNwYXRjaCA9IGZ1bmN0aW9uIGRpc3BhdGNoKCkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoZmFsc2UgPyBmb3JtYXRQcm9kRXJyb3JNZXNzYWdlKDE1KSA6IFwiRGlzcGF0Y2hpbmcgd2hpbGUgY29uc3RydWN0aW5nIHlvdXIgbWlkZGxld2FyZSBpcyBub3QgYWxsb3dlZC4gT3RoZXIgbWlkZGxld2FyZSB3b3VsZCBub3QgYmUgYXBwbGllZCB0byB0aGlzIGRpc3BhdGNoLlwiKTtcbiAgICAgIH07XG4gICAgICB2YXIgbWlkZGxld2FyZUFQSSA9IHtcbiAgICAgICAgZ2V0U3RhdGU6IHN0b3JlLmdldFN0YXRlLFxuICAgICAgICBkaXNwYXRjaDogZnVuY3Rpb24gZGlzcGF0Y2goKSB7XG4gICAgICAgICAgcmV0dXJuIF9kaXNwYXRjaC5hcHBseSh2b2lkIDAsIGFyZ3VtZW50cyk7XG4gICAgICAgIH1cbiAgICAgIH07XG4gICAgICB2YXIgY2hhaW4gPSBtaWRkbGV3YXJlcy5tYXAoZnVuY3Rpb24obWlkZGxld2FyZSkge1xuICAgICAgICByZXR1cm4gbWlkZGxld2FyZShtaWRkbGV3YXJlQVBJKTtcbiAgICAgIH0pO1xuICAgICAgX2Rpc3BhdGNoID0gY29tcG9zZS5hcHBseSh2b2lkIDAsIGNoYWluKShzdG9yZS5kaXNwYXRjaCk7XG4gICAgICByZXR1cm4gX29iamVjdFNwcmVhZDIoX29iamVjdFNwcmVhZDIoe30sIHN0b3JlKSwge30sIHtcbiAgICAgICAgZGlzcGF0Y2g6IF9kaXNwYXRjaFxuICAgICAgfSk7XG4gICAgfTtcbiAgfTtcbn1cbmZ1bmN0aW9uIGlzQ3J1c2hlZCgpIHtcbn1cbmlmICh0eXBlb2YgaXNDcnVzaGVkLm5hbWUgPT09IFwic3RyaW5nXCIgJiYgaXNDcnVzaGVkLm5hbWUgIT09IFwiaXNDcnVzaGVkXCIpIHtcbiAgd2FybmluZygnWW91IGFyZSBjdXJyZW50bHkgdXNpbmcgbWluaWZpZWQgY29kZSBvdXRzaWRlIG9mIE5PREVfRU5WID09PSBcInByb2R1Y3Rpb25cIi4gVGhpcyBtZWFucyB0aGF0IHlvdSBhcmUgcnVubmluZyBhIHNsb3dlciBkZXZlbG9wbWVudCBidWlsZCBvZiBSZWR1eC4gWW91IGNhbiB1c2UgbG9vc2UtZW52aWZ5IChodHRwczovL2dpdGh1Yi5jb20vemVydG9zaC9sb29zZS1lbnZpZnkpIGZvciBicm93c2VyaWZ5IG9yIHNldHRpbmcgbW9kZSB0byBwcm9kdWN0aW9uIGluIHdlYnBhY2sgKGh0dHBzOi8vd2VicGFjay5qcy5vcmcvY29uY2VwdHMvbW9kZS8pIHRvIGVuc3VyZSB5b3UgaGF2ZSB0aGUgY29ycmVjdCBjb2RlIGZvciB5b3VyIHByb2R1Y3Rpb24gYnVpbGQuJyk7XG59XG5cbi8vIG5vZGVfbW9kdWxlcy9AaWNlL3N0b3JlL2VzbS91dGlscy9pc0xpc3RlbmVyLmpzXG52YXIgaXNMaXN0ZW5lcl9kZWZhdWx0ID0gZnVuY3Rpb24ocmVkdWNlcikge1xuICByZXR1cm4gcmVkdWNlci5pbmRleE9mKFwiL1wiKSA+IC0xO1xufTtcblxuLy8gbm9kZV9tb2R1bGVzL0BpY2Uvc3RvcmUvZXNtL3JlZHV4LmpzXG52YXIgX19hc3NpZ24gPSBmdW5jdGlvbigpIHtcbiAgX19hc3NpZ24gPSBPYmplY3QuYXNzaWduIHx8IGZ1bmN0aW9uKHQyKSB7XG4gICAgZm9yICh2YXIgczIsIGkyID0gMSwgbjIgPSBhcmd1bWVudHMubGVuZ3RoOyBpMiA8IG4yOyBpMisrKSB7XG4gICAgICBzMiA9IGFyZ3VtZW50c1tpMl07XG4gICAgICBmb3IgKHZhciBwMiBpbiBzMilcbiAgICAgICAgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChzMiwgcDIpKVxuICAgICAgICAgIHQyW3AyXSA9IHMyW3AyXTtcbiAgICB9XG4gICAgcmV0dXJuIHQyO1xuICB9O1xuICByZXR1cm4gX19hc3NpZ24uYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbn07XG52YXIgX19yZXN0ID0gZnVuY3Rpb24oczIsIGUpIHtcbiAgdmFyIHQyID0ge307XG4gIGZvciAodmFyIHAyIGluIHMyKVxuICAgIGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwoczIsIHAyKSAmJiBlLmluZGV4T2YocDIpIDwgMClcbiAgICAgIHQyW3AyXSA9IHMyW3AyXTtcbiAgaWYgKHMyICE9IG51bGwgJiYgdHlwZW9mIE9iamVjdC5nZXRPd25Qcm9wZXJ0eVN5bWJvbHMgPT09IFwiZnVuY3Rpb25cIilcbiAgICBmb3IgKHZhciBpMiA9IDAsIHAyID0gT2JqZWN0LmdldE93blByb3BlcnR5U3ltYm9scyhzMik7IGkyIDwgcDIubGVuZ3RoOyBpMisrKSB7XG4gICAgICBpZiAoZS5pbmRleE9mKHAyW2kyXSkgPCAwICYmIE9iamVjdC5wcm90b3R5cGUucHJvcGVydHlJc0VudW1lcmFibGUuY2FsbChzMiwgcDJbaTJdKSlcbiAgICAgICAgdDJbcDJbaTJdXSA9IHMyW3AyW2kyXV07XG4gICAgfVxuICByZXR1cm4gdDI7XG59O1xudmFyIF9fc3ByZWFkQXJyYXlzID0gZnVuY3Rpb24oKSB7XG4gIGZvciAodmFyIHMyID0gMCwgaTIgPSAwLCBpbCA9IGFyZ3VtZW50cy5sZW5ndGg7IGkyIDwgaWw7IGkyKyspXG4gICAgczIgKz0gYXJndW1lbnRzW2kyXS5sZW5ndGg7XG4gIGZvciAodmFyIHIyID0gQXJyYXkoczIpLCBrMiA9IDAsIGkyID0gMDsgaTIgPCBpbDsgaTIrKylcbiAgICBmb3IgKHZhciBhMiA9IGFyZ3VtZW50c1tpMl0sIGoyID0gMCwgamwgPSBhMi5sZW5ndGg7IGoyIDwgamw7IGoyKyssIGsyKyspXG4gICAgICByMltrMl0gPSBhMltqMl07XG4gIHJldHVybiByMjtcbn07XG52YXIgY29tcG9zZUVuaGFuY2Vyc1dpdGhEZXZ0b29scyA9IGZ1bmN0aW9uKGRldnRvb2xPcHRpb25zKSB7XG4gIGlmIChkZXZ0b29sT3B0aW9ucyA9PT0gdm9pZCAwKSB7XG4gICAgZGV2dG9vbE9wdGlvbnMgPSB7fTtcbiAgfVxuICB2YXIgZGlzYWJsZWQgPSBkZXZ0b29sT3B0aW9ucy5kaXNhYmxlZCwgb3B0aW9ucyA9IF9fcmVzdChkZXZ0b29sT3B0aW9ucywgW1wiZGlzYWJsZWRcIl0pO1xuICByZXR1cm4gIWRpc2FibGVkICYmIHR5cGVvZiB3aW5kb3cgPT09IFwib2JqZWN0XCIgJiYgd2luZG93Ll9fUkVEVVhfREVWVE9PTFNfRVhURU5TSU9OX0NPTVBPU0VfXyA/IHdpbmRvdy5fX1JFRFVYX0RFVlRPT0xTX0VYVEVOU0lPTl9DT01QT1NFX18ob3B0aW9ucykgOiBjb21wb3NlO1xufTtcbmZ1bmN0aW9uIHJlZHV4X2RlZmF1bHQoX2EpIHtcbiAgdmFyIF90aGlzID0gdGhpcztcbiAgdmFyIHJlZHV4ID0gX2EucmVkdXgsIG1vZGVscyA9IF9hLm1vZGVscztcbiAgdmFyIGNvbWJpbmVSZWR1Y2VyczIgPSByZWR1eC5jb21iaW5lUmVkdWNlcnMgfHwgY29tYmluZVJlZHVjZXJzO1xuICB2YXIgY3JlYXRlU3RvcmUzID0gcmVkdXguY3JlYXRlU3RvcmUgfHwgY3JlYXRlU3RvcmU7XG4gIHZhciBpbml0aWFsU3RhdGVzID0gdHlwZW9mIHJlZHV4LmluaXRpYWxTdGF0ZXMgIT09IFwidW5kZWZpbmVkXCIgPyByZWR1eC5pbml0aWFsU3RhdGVzIDoge307XG4gIHRoaXMucmVkdWNlcnMgPSByZWR1eC5yZWR1Y2VycztcbiAgdGhpcy5tZXJnZVJlZHVjZXJzID0gZnVuY3Rpb24obmV4dFJlZHVjZXJzKSB7XG4gICAgaWYgKG5leHRSZWR1Y2VycyA9PT0gdm9pZCAwKSB7XG4gICAgICBuZXh0UmVkdWNlcnMgPSB7fTtcbiAgICB9XG4gICAgX3RoaXMucmVkdWNlcnMgPSBfX2Fzc2lnbihfX2Fzc2lnbih7fSwgX3RoaXMucmVkdWNlcnMpLCBuZXh0UmVkdWNlcnMpO1xuICAgIGlmICghT2JqZWN0LmtleXMoX3RoaXMucmVkdWNlcnMpLmxlbmd0aCkge1xuICAgICAgcmV0dXJuIGZ1bmN0aW9uKHN0YXRlKSB7XG4gICAgICAgIHJldHVybiBzdGF0ZTtcbiAgICAgIH07XG4gICAgfVxuICAgIHJldHVybiBjb21iaW5lUmVkdWNlcnMyKF90aGlzLnJlZHVjZXJzKTtcbiAgfTtcbiAgdGhpcy5jcmVhdGVNb2RlbFJlZHVjZXIgPSBmdW5jdGlvbihtb2RlbDIpIHtcbiAgICB2YXIgbW9kZWxCYXNlUmVkdWNlciA9IG1vZGVsMi5iYXNlUmVkdWNlcjtcbiAgICB2YXIgbW9kZWxSZWR1Y2VycyA9IHt9O1xuICAgIGZvciAodmFyIF9pMiA9IDAsIF9hMiA9IE9iamVjdC5rZXlzKG1vZGVsMi5yZWR1Y2VycyB8fCB7fSk7IF9pMiA8IF9hMi5sZW5ndGg7IF9pMisrKSB7XG4gICAgICB2YXIgbW9kZWxSZWR1Y2VyID0gX2EyW19pMl07XG4gICAgICB2YXIgYWN0aW9uID0gaXNMaXN0ZW5lcl9kZWZhdWx0KG1vZGVsUmVkdWNlcikgPyBtb2RlbFJlZHVjZXIgOiBtb2RlbDIubmFtZSArIFwiL1wiICsgbW9kZWxSZWR1Y2VyO1xuICAgICAgbW9kZWxSZWR1Y2Vyc1thY3Rpb25dID0gbW9kZWwyLnJlZHVjZXJzW21vZGVsUmVkdWNlcl07XG4gICAgfVxuICAgIHZhciBjb21iaW5lZFJlZHVjZXIgPSBmdW5jdGlvbihzdGF0ZSwgYWN0aW9uMikge1xuICAgICAgaWYgKHN0YXRlID09PSB2b2lkIDApIHtcbiAgICAgICAgc3RhdGUgPSBtb2RlbDIuc3RhdGU7XG4gICAgICB9XG4gICAgICBpZiAodHlwZW9mIG1vZGVsUmVkdWNlcnNbYWN0aW9uMi50eXBlXSA9PT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICAgIHJldHVybiBtb2RlbFJlZHVjZXJzW2FjdGlvbjIudHlwZV0oc3RhdGUsIGFjdGlvbjIucGF5bG9hZCwgYWN0aW9uMi5tZXRhKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBzdGF0ZTtcbiAgICB9O1xuICAgIF90aGlzLnJlZHVjZXJzW21vZGVsMi5uYW1lXSA9ICFtb2RlbEJhc2VSZWR1Y2VyID8gY29tYmluZWRSZWR1Y2VyIDogZnVuY3Rpb24oc3RhdGUsIGFjdGlvbjIpIHtcbiAgICAgIHJldHVybiBjb21iaW5lZFJlZHVjZXIobW9kZWxCYXNlUmVkdWNlcihzdGF0ZSwgYWN0aW9uMiksIGFjdGlvbjIpO1xuICAgIH07XG4gIH07XG4gIGZvciAodmFyIF9pID0gMCwgbW9kZWxzXzEgPSBtb2RlbHM7IF9pIDwgbW9kZWxzXzEubGVuZ3RoOyBfaSsrKSB7XG4gICAgdmFyIG1vZGVsID0gbW9kZWxzXzFbX2ldO1xuICAgIHRoaXMuY3JlYXRlTW9kZWxSZWR1Y2VyKG1vZGVsKTtcbiAgfVxuICB0aGlzLmNyZWF0ZVJvb3RSZWR1Y2VyID0gZnVuY3Rpb24ocm9vdFJlZHVjZXJzKSB7XG4gICAgaWYgKHJvb3RSZWR1Y2VycyA9PT0gdm9pZCAwKSB7XG4gICAgICByb290UmVkdWNlcnMgPSB7fTtcbiAgICB9XG4gICAgdmFyIG1lcmdlZFJlZHVjZXJzID0gX3RoaXMubWVyZ2VSZWR1Y2VycygpO1xuICAgIGlmIChPYmplY3Qua2V5cyhyb290UmVkdWNlcnMpLmxlbmd0aCkge1xuICAgICAgcmV0dXJuIGZ1bmN0aW9uKHN0YXRlLCBhY3Rpb24pIHtcbiAgICAgICAgdmFyIHJvb3RSZWR1Y2VyQWN0aW9uID0gcm9vdFJlZHVjZXJzW2FjdGlvbi50eXBlXTtcbiAgICAgICAgaWYgKHJvb3RSZWR1Y2VyQWN0aW9uKSB7XG4gICAgICAgICAgcmV0dXJuIG1lcmdlZFJlZHVjZXJzKHJvb3RSZWR1Y2VyQWN0aW9uKHN0YXRlLCBhY3Rpb24pLCBhY3Rpb24pO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBtZXJnZWRSZWR1Y2VycyhzdGF0ZSwgYWN0aW9uKTtcbiAgICAgIH07XG4gICAgfVxuICAgIHJldHVybiBtZXJnZWRSZWR1Y2VycztcbiAgfTtcbiAgdmFyIHJvb3RSZWR1Y2VyID0gdGhpcy5jcmVhdGVSb290UmVkdWNlcihyZWR1eC5yb290UmVkdWNlcnMpO1xuICB2YXIgbWlkZGxld2FyZXMgPSBhcHBseU1pZGRsZXdhcmUuYXBwbHkocmVkdXhfZXhwb3J0cywgcmVkdXgubWlkZGxld2FyZXMpO1xuICB2YXIgZW5oYW5jZXJzID0gY29tcG9zZUVuaGFuY2Vyc1dpdGhEZXZ0b29scyhyZWR1eC5kZXZ0b29sT3B0aW9ucykuYXBwbHkodm9pZCAwLCBfX3NwcmVhZEFycmF5cyhyZWR1eC5lbmhhbmNlcnMsIFttaWRkbGV3YXJlc10pKTtcbiAgdGhpcy5zdG9yZSA9IGNyZWF0ZVN0b3JlMyhyb290UmVkdWNlciwgaW5pdGlhbFN0YXRlcywgZW5oYW5jZXJzKTtcbiAgcmV0dXJuIHRoaXM7XG59XG5cbi8vIG5vZGVfbW9kdWxlcy9AaWNlL3N0b3JlL2VzbS9pY2VzdG9yZS5qc1xudmFyIF9fYXNzaWduMiA9IGZ1bmN0aW9uKCkge1xuICBfX2Fzc2lnbjIgPSBPYmplY3QuYXNzaWduIHx8IGZ1bmN0aW9uKHQyKSB7XG4gICAgZm9yICh2YXIgczIsIGkyID0gMSwgbjIgPSBhcmd1bWVudHMubGVuZ3RoOyBpMiA8IG4yOyBpMisrKSB7XG4gICAgICBzMiA9IGFyZ3VtZW50c1tpMl07XG4gICAgICBmb3IgKHZhciBwMiBpbiBzMilcbiAgICAgICAgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChzMiwgcDIpKVxuICAgICAgICAgIHQyW3AyXSA9IHMyW3AyXTtcbiAgICB9XG4gICAgcmV0dXJuIHQyO1xuICB9O1xuICByZXR1cm4gX19hc3NpZ24yLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG59O1xudmFyIGNvcmVQbHVnaW5zID0gW2Rpc3BhdGNoX2RlZmF1bHQsIGVmZmVjdHNfZGVmYXVsdF07XG52YXIgSWNlc3RvcmUgPSBmdW5jdGlvbigpIHtcbiAgZnVuY3Rpb24gSWNlc3RvcmUyKGNvbmZpZykge1xuICAgIHZhciBfdGhpcyA9IHRoaXM7XG4gICAgdGhpcy5wbHVnaW5zID0gW107XG4gICAgdGhpcy5nZXRNb2RlbHMgPSBmdW5jdGlvbihtb2RlbHMpIHtcbiAgICAgIHJldHVybiBPYmplY3Qua2V5cyhtb2RlbHMpLm1hcChmdW5jdGlvbihuYW1lKSB7XG4gICAgICAgIHJldHVybiBfX2Fzc2lnbjIoX19hc3NpZ24yKHsgbmFtZSB9LCBtb2RlbHNbbmFtZV0pLCB7IHJlZHVjZXJzOiBtb2RlbHNbbmFtZV0ucmVkdWNlcnMgfHwge30gfSk7XG4gICAgICB9KTtcbiAgICB9O1xuICAgIHRoaXMuY29uZmlnID0gY29uZmlnO1xuICAgIHRoaXMucGx1Z2luRmFjdG9yeSA9IHBsdWdpbkZhY3RvcnlfZGVmYXVsdChjb25maWcpO1xuICAgIGZvciAodmFyIF9pID0gMCwgX2EgPSBjb3JlUGx1Z2lucy5jb25jYXQodGhpcy5jb25maWcucGx1Z2lucyk7IF9pIDwgX2EubGVuZ3RoOyBfaSsrKSB7XG4gICAgICB2YXIgcGx1Z2luID0gX2FbX2ldO1xuICAgICAgdGhpcy5wbHVnaW5zLnB1c2godGhpcy5wbHVnaW5GYWN0b3J5LmNyZWF0ZShwbHVnaW4pKTtcbiAgICB9XG4gICAgdGhpcy5mb3JFYWNoUGx1Z2luKFwibWlkZGxld2FyZVwiLCBmdW5jdGlvbihtaWRkbGV3YXJlKSB7XG4gICAgICBfdGhpcy5jb25maWcucmVkdXgubWlkZGxld2FyZXMucHVzaChtaWRkbGV3YXJlKTtcbiAgICB9KTtcbiAgfVxuICBJY2VzdG9yZTIucHJvdG90eXBlLmZvckVhY2hQbHVnaW4gPSBmdW5jdGlvbihtZXRob2QsIGZuMikge1xuICAgIGZvciAodmFyIF9pID0gMCwgX2EgPSB0aGlzLnBsdWdpbnM7IF9pIDwgX2EubGVuZ3RoOyBfaSsrKSB7XG4gICAgICB2YXIgcGx1Z2luID0gX2FbX2ldO1xuICAgICAgaWYgKHBsdWdpblttZXRob2RdKSB7XG4gICAgICAgIGZuMihwbHVnaW5bbWV0aG9kXSk7XG4gICAgICB9XG4gICAgfVxuICB9O1xuICBJY2VzdG9yZTIucHJvdG90eXBlLmFkZE1vZGVsID0gZnVuY3Rpb24obW9kZWwpIHtcbiAgICB2YWxpZGF0ZV9kZWZhdWx0KFtcbiAgICAgIFshbW9kZWwsIFwibW9kZWwgY29uZmlnIGlzIHJlcXVpcmVkXCJdLFxuICAgICAgW3R5cGVvZiBtb2RlbC5uYW1lICE9PSBcInN0cmluZ1wiLCAnbW9kZWwgXCJuYW1lXCIgW3N0cmluZ10gaXMgcmVxdWlyZWQnXSxcbiAgICAgIFtcbiAgICAgICAgbW9kZWwuc3RhdGUgPT09IHZvaWQgMCAmJiBtb2RlbC5iYXNlUmVkdWNlciA9PT0gdm9pZCAwLFxuICAgICAgICBcIm1vZGVsKFwiICsgbW9kZWwubmFtZSArICcpIFwic3RhdGVcIiBpcyByZXF1aXJlZCdcbiAgICAgIF0sXG4gICAgICBbXG4gICAgICAgIG1vZGVsLmJhc2VSZWR1Y2VyICE9PSB2b2lkIDAgJiYgdHlwZW9mIG1vZGVsLmJhc2VSZWR1Y2VyICE9PSBcImZ1bmN0aW9uXCIsXG4gICAgICAgIFwibW9kZWwoXCIgKyBtb2RlbC5uYW1lICsgJykgXCJiYXNlUmVkdWNlclwiIG11c3QgYmUgYSBmdW5jdGlvbidcbiAgICAgIF1cbiAgICBdKTtcbiAgICB0aGlzLmZvckVhY2hQbHVnaW4oXCJvbk1vZGVsXCIsIGZ1bmN0aW9uKG9uTW9kZWwpIHtcbiAgICAgIHJldHVybiBvbk1vZGVsKG1vZGVsKTtcbiAgICB9KTtcbiAgfTtcbiAgSWNlc3RvcmUyLnByb3RvdHlwZS5pbml0ID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIF90aGlzID0gdGhpcztcbiAgICB0aGlzLm1vZGVscyA9IHRoaXMuZ2V0TW9kZWxzKHRoaXMuY29uZmlnLm1vZGVscyk7XG4gICAgZm9yICh2YXIgX2kgPSAwLCBfYSA9IHRoaXMubW9kZWxzOyBfaSA8IF9hLmxlbmd0aDsgX2krKykge1xuICAgICAgdmFyIG1vZGVsID0gX2FbX2ldO1xuICAgICAgdGhpcy5hZGRNb2RlbChtb2RlbCk7XG4gICAgfVxuICAgIHZhciByZWR1eCA9IHJlZHV4X2RlZmF1bHQuY2FsbCh0aGlzLCB7XG4gICAgICByZWR1eDogdGhpcy5jb25maWcucmVkdXgsXG4gICAgICBtb2RlbHM6IHRoaXMubW9kZWxzXG4gICAgfSk7XG4gICAgdmFyIGljZXN0b3JlID0gX19hc3NpZ24yKF9fYXNzaWduMih7IG5hbWU6IHRoaXMuY29uZmlnLm5hbWUgfSwgcmVkdXguc3RvcmUpLCB7XG4gICAgICBtb2RlbDogZnVuY3Rpb24obW9kZWwyKSB7XG4gICAgICAgIF90aGlzLmFkZE1vZGVsKG1vZGVsMik7XG4gICAgICAgIHJlZHV4Lm1lcmdlUmVkdWNlcnMocmVkdXguY3JlYXRlTW9kZWxSZWR1Y2VyKG1vZGVsMikpO1xuICAgICAgICByZWR1eC5zdG9yZS5yZXBsYWNlUmVkdWNlcihyZWR1eC5jcmVhdGVSb290UmVkdWNlcihfdGhpcy5jb25maWcucmVkdXgucm9vdFJlZHVjZXJzKSk7XG4gICAgICAgIHJlZHV4LnN0b3JlLmRpc3BhdGNoKHsgdHlwZTogXCJAQHJlZHV4L1JFUExBQ0UgXCIgfSk7XG4gICAgICB9XG4gICAgfSk7XG4gICAgdGhpcy5mb3JFYWNoUGx1Z2luKFwib25TdG9yZUNyZWF0ZWRcIiwgZnVuY3Rpb24ob25TdG9yZUNyZWF0ZWQpIHtcbiAgICAgIHZhciByZXR1cm5lZCA9IG9uU3RvcmVDcmVhdGVkKGljZXN0b3JlKTtcbiAgICAgIGlmIChyZXR1cm5lZCkge1xuICAgICAgICBPYmplY3Qua2V5cyhyZXR1cm5lZCB8fCB7fSkuZm9yRWFjaChmdW5jdGlvbihrZXkpIHtcbiAgICAgICAgICBpY2VzdG9yZVtrZXldID0gcmV0dXJuZWRba2V5XTtcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfSk7XG4gICAgcmV0dXJuIGljZXN0b3JlO1xuICB9O1xuICByZXR1cm4gSWNlc3RvcmUyO1xufSgpO1xuXG4vLyBub2RlX21vZHVsZXMvQGljZS9zdG9yZS9lc20vcGx1Z2lucy9wcm92aWRlci5qc1xuaW1wb3J0IFJlYWN0NCBmcm9tIFwicmVhY3RcIjtcblxuLy8gbm9kZV9tb2R1bGVzL3JlYWN0LXJlZHV4L2VzL2NvbXBvbmVudHMvUHJvdmlkZXIuanNcbnZhciBpbXBvcnRfcHJvcF90eXBlcyA9IF9fdG9FU00ocmVxdWlyZV9wcm9wX3R5cGVzKCkpO1xuaW1wb3J0IFJlYWN0MiwgeyB1c2VNZW1vIH0gZnJvbSBcInJlYWN0XCI7XG5cbi8vIG5vZGVfbW9kdWxlcy9yZWFjdC1yZWR1eC9lcy9jb21wb25lbnRzL0NvbnRleHQuanNcbmltcG9ydCBSZWFjdCBmcm9tIFwicmVhY3RcIjtcbnZhciBSZWFjdFJlZHV4Q29udGV4dCA9IC8qIEBfX1BVUkVfXyAqLyBSZWFjdC5jcmVhdGVDb250ZXh0KG51bGwpO1xuaWYgKHRydWUpIHtcbiAgUmVhY3RSZWR1eENvbnRleHQuZGlzcGxheU5hbWUgPSBcIlJlYWN0UmVkdXhcIjtcbn1cblxuLy8gbm9kZV9tb2R1bGVzL3JlYWN0LXJlZHV4L2VzL3V0aWxzL2JhdGNoLmpzXG5mdW5jdGlvbiBkZWZhdWx0Tm9vcEJhdGNoKGNhbGxiYWNrKSB7XG4gIGNhbGxiYWNrKCk7XG59XG52YXIgYmF0Y2ggPSBkZWZhdWx0Tm9vcEJhdGNoO1xudmFyIHNldEJhdGNoID0gZnVuY3Rpb24gc2V0QmF0Y2gyKG5ld0JhdGNoKSB7XG4gIHJldHVybiBiYXRjaCA9IG5ld0JhdGNoO1xufTtcbnZhciBnZXRCYXRjaCA9IGZ1bmN0aW9uIGdldEJhdGNoMigpIHtcbiAgcmV0dXJuIGJhdGNoO1xufTtcblxuLy8gbm9kZV9tb2R1bGVzL3JlYWN0LXJlZHV4L2VzL3V0aWxzL1N1YnNjcmlwdGlvbi5qc1xuZnVuY3Rpb24gY3JlYXRlTGlzdGVuZXJDb2xsZWN0aW9uKCkge1xuICB2YXIgYmF0Y2gyID0gZ2V0QmF0Y2goKTtcbiAgdmFyIGZpcnN0ID0gbnVsbDtcbiAgdmFyIGxhc3QgPSBudWxsO1xuICByZXR1cm4ge1xuICAgIGNsZWFyOiBmdW5jdGlvbiBjbGVhcigpIHtcbiAgICAgIGZpcnN0ID0gbnVsbDtcbiAgICAgIGxhc3QgPSBudWxsO1xuICAgIH0sXG4gICAgbm90aWZ5OiBmdW5jdGlvbiBub3RpZnkyKCkge1xuICAgICAgYmF0Y2gyKGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgbGlzdGVuZXIgPSBmaXJzdDtcbiAgICAgICAgd2hpbGUgKGxpc3RlbmVyKSB7XG4gICAgICAgICAgbGlzdGVuZXIuY2FsbGJhY2soKTtcbiAgICAgICAgICBsaXN0ZW5lciA9IGxpc3RlbmVyLm5leHQ7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH0sXG4gICAgZ2V0OiBmdW5jdGlvbiBnZXQyKCkge1xuICAgICAgdmFyIGxpc3RlbmVycyA9IFtdO1xuICAgICAgdmFyIGxpc3RlbmVyID0gZmlyc3Q7XG4gICAgICB3aGlsZSAobGlzdGVuZXIpIHtcbiAgICAgICAgbGlzdGVuZXJzLnB1c2gobGlzdGVuZXIpO1xuICAgICAgICBsaXN0ZW5lciA9IGxpc3RlbmVyLm5leHQ7XG4gICAgICB9XG4gICAgICByZXR1cm4gbGlzdGVuZXJzO1xuICAgIH0sXG4gICAgc3Vic2NyaWJlOiBmdW5jdGlvbiBzdWJzY3JpYmUoY2FsbGJhY2spIHtcbiAgICAgIHZhciBpc1N1YnNjcmliZWQgPSB0cnVlO1xuICAgICAgdmFyIGxpc3RlbmVyID0gbGFzdCA9IHtcbiAgICAgICAgY2FsbGJhY2ssXG4gICAgICAgIG5leHQ6IG51bGwsXG4gICAgICAgIHByZXY6IGxhc3RcbiAgICAgIH07XG4gICAgICBpZiAobGlzdGVuZXIucHJldikge1xuICAgICAgICBsaXN0ZW5lci5wcmV2Lm5leHQgPSBsaXN0ZW5lcjtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGZpcnN0ID0gbGlzdGVuZXI7XG4gICAgICB9XG4gICAgICByZXR1cm4gZnVuY3Rpb24gdW5zdWJzY3JpYmUoKSB7XG4gICAgICAgIGlmICghaXNTdWJzY3JpYmVkIHx8IGZpcnN0ID09PSBudWxsKVxuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgaXNTdWJzY3JpYmVkID0gZmFsc2U7XG4gICAgICAgIGlmIChsaXN0ZW5lci5uZXh0KSB7XG4gICAgICAgICAgbGlzdGVuZXIubmV4dC5wcmV2ID0gbGlzdGVuZXIucHJldjtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBsYXN0ID0gbGlzdGVuZXIucHJldjtcbiAgICAgICAgfVxuICAgICAgICBpZiAobGlzdGVuZXIucHJldikge1xuICAgICAgICAgIGxpc3RlbmVyLnByZXYubmV4dCA9IGxpc3RlbmVyLm5leHQ7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgZmlyc3QgPSBsaXN0ZW5lci5uZXh0O1xuICAgICAgICB9XG4gICAgICB9O1xuICAgIH1cbiAgfTtcbn1cbnZhciBudWxsTGlzdGVuZXJzID0ge1xuICBub3RpZnk6IGZ1bmN0aW9uIG5vdGlmeSgpIHtcbiAgfSxcbiAgZ2V0OiBmdW5jdGlvbiBnZXQoKSB7XG4gICAgcmV0dXJuIFtdO1xuICB9XG59O1xuZnVuY3Rpb24gY3JlYXRlU3Vic2NyaXB0aW9uKHN0b3JlLCBwYXJlbnRTdWIpIHtcbiAgdmFyIHVuc3Vic2NyaWJlO1xuICB2YXIgbGlzdGVuZXJzID0gbnVsbExpc3RlbmVycztcbiAgZnVuY3Rpb24gYWRkTmVzdGVkU3ViKGxpc3RlbmVyKSB7XG4gICAgdHJ5U3Vic2NyaWJlKCk7XG4gICAgcmV0dXJuIGxpc3RlbmVycy5zdWJzY3JpYmUobGlzdGVuZXIpO1xuICB9XG4gIGZ1bmN0aW9uIG5vdGlmeU5lc3RlZFN1YnMoKSB7XG4gICAgbGlzdGVuZXJzLm5vdGlmeSgpO1xuICB9XG4gIGZ1bmN0aW9uIGhhbmRsZUNoYW5nZVdyYXBwZXIoKSB7XG4gICAgaWYgKHN1YnNjcmlwdGlvbi5vblN0YXRlQ2hhbmdlKSB7XG4gICAgICBzdWJzY3JpcHRpb24ub25TdGF0ZUNoYW5nZSgpO1xuICAgIH1cbiAgfVxuICBmdW5jdGlvbiBpc1N1YnNjcmliZWQoKSB7XG4gICAgcmV0dXJuIEJvb2xlYW4odW5zdWJzY3JpYmUpO1xuICB9XG4gIGZ1bmN0aW9uIHRyeVN1YnNjcmliZSgpIHtcbiAgICBpZiAoIXVuc3Vic2NyaWJlKSB7XG4gICAgICB1bnN1YnNjcmliZSA9IHBhcmVudFN1YiA/IHBhcmVudFN1Yi5hZGROZXN0ZWRTdWIoaGFuZGxlQ2hhbmdlV3JhcHBlcikgOiBzdG9yZS5zdWJzY3JpYmUoaGFuZGxlQ2hhbmdlV3JhcHBlcik7XG4gICAgICBsaXN0ZW5lcnMgPSBjcmVhdGVMaXN0ZW5lckNvbGxlY3Rpb24oKTtcbiAgICB9XG4gIH1cbiAgZnVuY3Rpb24gdHJ5VW5zdWJzY3JpYmUoKSB7XG4gICAgaWYgKHVuc3Vic2NyaWJlKSB7XG4gICAgICB1bnN1YnNjcmliZSgpO1xuICAgICAgdW5zdWJzY3JpYmUgPSB2b2lkIDA7XG4gICAgICBsaXN0ZW5lcnMuY2xlYXIoKTtcbiAgICAgIGxpc3RlbmVycyA9IG51bGxMaXN0ZW5lcnM7XG4gICAgfVxuICB9XG4gIHZhciBzdWJzY3JpcHRpb24gPSB7XG4gICAgYWRkTmVzdGVkU3ViLFxuICAgIG5vdGlmeU5lc3RlZFN1YnMsXG4gICAgaGFuZGxlQ2hhbmdlV3JhcHBlcixcbiAgICBpc1N1YnNjcmliZWQsXG4gICAgdHJ5U3Vic2NyaWJlLFxuICAgIHRyeVVuc3Vic2NyaWJlLFxuICAgIGdldExpc3RlbmVyczogZnVuY3Rpb24gZ2V0TGlzdGVuZXJzKCkge1xuICAgICAgcmV0dXJuIGxpc3RlbmVycztcbiAgICB9XG4gIH07XG4gIHJldHVybiBzdWJzY3JpcHRpb247XG59XG5cbi8vIG5vZGVfbW9kdWxlcy9yZWFjdC1yZWR1eC9lcy91dGlscy91c2VJc29tb3JwaGljTGF5b3V0RWZmZWN0LmpzXG5pbXBvcnQgeyB1c2VFZmZlY3QsIHVzZUxheW91dEVmZmVjdCB9IGZyb20gXCJyZWFjdFwiO1xudmFyIHVzZUlzb21vcnBoaWNMYXlvdXRFZmZlY3QgPSB0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiICYmIHR5cGVvZiB3aW5kb3cuZG9jdW1lbnQgIT09IFwidW5kZWZpbmVkXCIgJiYgdHlwZW9mIHdpbmRvdy5kb2N1bWVudC5jcmVhdGVFbGVtZW50ICE9PSBcInVuZGVmaW5lZFwiID8gdXNlTGF5b3V0RWZmZWN0IDogdXNlRWZmZWN0O1xuXG4vLyBub2RlX21vZHVsZXMvcmVhY3QtcmVkdXgvZXMvY29tcG9uZW50cy9Qcm92aWRlci5qc1xuZnVuY3Rpb24gUHJvdmlkZXIoX3JlZikge1xuICB2YXIgc3RvcmUgPSBfcmVmLnN0b3JlLCBjb250ZXh0ID0gX3JlZi5jb250ZXh0LCBjaGlsZHJlbiA9IF9yZWYuY2hpbGRyZW47XG4gIHZhciBjb250ZXh0VmFsdWUgPSB1c2VNZW1vKGZ1bmN0aW9uKCkge1xuICAgIHZhciBzdWJzY3JpcHRpb24gPSBjcmVhdGVTdWJzY3JpcHRpb24oc3RvcmUpO1xuICAgIHJldHVybiB7XG4gICAgICBzdG9yZSxcbiAgICAgIHN1YnNjcmlwdGlvblxuICAgIH07XG4gIH0sIFtzdG9yZV0pO1xuICB2YXIgcHJldmlvdXNTdGF0ZSA9IHVzZU1lbW8oZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIHN0b3JlLmdldFN0YXRlKCk7XG4gIH0sIFtzdG9yZV0pO1xuICB1c2VJc29tb3JwaGljTGF5b3V0RWZmZWN0KGZ1bmN0aW9uKCkge1xuICAgIHZhciBzdWJzY3JpcHRpb24gPSBjb250ZXh0VmFsdWUuc3Vic2NyaXB0aW9uO1xuICAgIHN1YnNjcmlwdGlvbi5vblN0YXRlQ2hhbmdlID0gc3Vic2NyaXB0aW9uLm5vdGlmeU5lc3RlZFN1YnM7XG4gICAgc3Vic2NyaXB0aW9uLnRyeVN1YnNjcmliZSgpO1xuICAgIGlmIChwcmV2aW91c1N0YXRlICE9PSBzdG9yZS5nZXRTdGF0ZSgpKSB7XG4gICAgICBzdWJzY3JpcHRpb24ubm90aWZ5TmVzdGVkU3VicygpO1xuICAgIH1cbiAgICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgICBzdWJzY3JpcHRpb24udHJ5VW5zdWJzY3JpYmUoKTtcbiAgICAgIHN1YnNjcmlwdGlvbi5vblN0YXRlQ2hhbmdlID0gbnVsbDtcbiAgICB9O1xuICB9LCBbY29udGV4dFZhbHVlLCBwcmV2aW91c1N0YXRlXSk7XG4gIHZhciBDb250ZXh0MiA9IGNvbnRleHQgfHwgUmVhY3RSZWR1eENvbnRleHQ7XG4gIHJldHVybiAvKiBAX19QVVJFX18gKi8gUmVhY3QyLmNyZWF0ZUVsZW1lbnQoQ29udGV4dDIuUHJvdmlkZXIsIHtcbiAgICB2YWx1ZTogY29udGV4dFZhbHVlXG4gIH0sIGNoaWxkcmVuKTtcbn1cbmlmICh0cnVlKSB7XG4gIFByb3ZpZGVyLnByb3BUeXBlcyA9IHtcbiAgICBzdG9yZTogaW1wb3J0X3Byb3BfdHlwZXMuZGVmYXVsdC5zaGFwZSh7XG4gICAgICBzdWJzY3JpYmU6IGltcG9ydF9wcm9wX3R5cGVzLmRlZmF1bHQuZnVuYy5pc1JlcXVpcmVkLFxuICAgICAgZGlzcGF0Y2g6IGltcG9ydF9wcm9wX3R5cGVzLmRlZmF1bHQuZnVuYy5pc1JlcXVpcmVkLFxuICAgICAgZ2V0U3RhdGU6IGltcG9ydF9wcm9wX3R5cGVzLmRlZmF1bHQuZnVuYy5pc1JlcXVpcmVkXG4gICAgfSksXG4gICAgY29udGV4dDogaW1wb3J0X3Byb3BfdHlwZXMuZGVmYXVsdC5vYmplY3QsXG4gICAgY2hpbGRyZW46IGltcG9ydF9wcm9wX3R5cGVzLmRlZmF1bHQuYW55XG4gIH07XG59XG5cbi8vIG5vZGVfbW9kdWxlcy9yZWFjdC1yZWR1eC9lcy9jb21wb25lbnRzL2Nvbm5lY3RBZHZhbmNlZC5qc1xudmFyIGltcG9ydF9ob2lzdF9ub25fcmVhY3Rfc3RhdGljcyA9IF9fdG9FU00ocmVxdWlyZV9ob2lzdF9ub25fcmVhY3Rfc3RhdGljc19janMoKSk7XG52YXIgaW1wb3J0X3JlYWN0X2lzID0gX190b0VTTShyZXF1aXJlX3JlYWN0X2lzMigpKTtcbmltcG9ydCBSZWFjdDMsIHsgdXNlQ29udGV4dCwgdXNlTWVtbyBhcyB1c2VNZW1vMiwgdXNlUmVmLCB1c2VSZWR1Y2VyIH0gZnJvbSBcInJlYWN0XCI7XG5cbi8vIG5vZGVfbW9kdWxlcy9yZWFjdC1yZWR1eC9lcy9ob29rcy91c2VTdG9yZS5qc1xuaW1wb3J0IHsgdXNlQ29udGV4dCBhcyB1c2VDb250ZXh0MyB9IGZyb20gXCJyZWFjdFwiO1xuXG4vLyBub2RlX21vZHVsZXMvcmVhY3QtcmVkdXgvZXMvaG9va3MvdXNlUmVkdXhDb250ZXh0LmpzXG5pbXBvcnQgeyB1c2VDb250ZXh0IGFzIHVzZUNvbnRleHQyIH0gZnJvbSBcInJlYWN0XCI7XG5cbi8vIG5vZGVfbW9kdWxlcy9yZWFjdC1yZWR1eC9lcy9ob29rcy91c2VTZWxlY3Rvci5qc1xuaW1wb3J0IHsgdXNlUmVkdWNlciBhcyB1c2VSZWR1Y2VyMiwgdXNlUmVmIGFzIHVzZVJlZjIsIHVzZU1lbW8gYXMgdXNlTWVtbzMsIHVzZUNvbnRleHQgYXMgdXNlQ29udGV4dDQsIHVzZURlYnVnVmFsdWUgfSBmcm9tIFwicmVhY3RcIjtcblxuLy8gbm9kZV9tb2R1bGVzL3JlYWN0LXJlZHV4L2VzL3V0aWxzL3JlYWN0QmF0Y2hlZFVwZGF0ZXMuanNcbmltcG9ydCB7IHVuc3RhYmxlX2JhdGNoZWRVcGRhdGVzIH0gZnJvbSBcInJlYWN0LWRvbVwiO1xuXG4vLyBub2RlX21vZHVsZXMvcmVhY3QtcmVkdXgvZXMvaW5kZXguanNcbnNldEJhdGNoKHVuc3RhYmxlX2JhdGNoZWRVcGRhdGVzKTtcblxuLy8gbm9kZV9tb2R1bGVzL0BpY2Uvc3RvcmUvZXNtL2FjdGlvblR5cGVzLmpzXG52YXIgcmFuZG9tU3RyaW5nMyA9IGZ1bmN0aW9uKCkge1xuICByZXR1cm4gTWF0aC5yYW5kb20oKS50b1N0cmluZygzNikuc3Vic3RyaW5nKDcpLnNwbGl0KFwiXCIpLmpvaW4oXCIuXCIpO1xufTtcbnZhciBBY3Rpb25UeXBlczIgPSB7XG4gIFNFVF9TVEFURTogXCJAQGljZXN0b3JlX1NFVF9TVEFURVwiICsgcmFuZG9tU3RyaW5nMygpXG59O1xudmFyIGFjdGlvblR5cGVzX2RlZmF1bHQgPSBBY3Rpb25UeXBlczI7XG5cbi8vIG5vZGVfbW9kdWxlcy9AaWNlL3N0b3JlL2VzbS9wbHVnaW5zL3Byb3ZpZGVyLmpzXG52YXIgU0VUX1NUQVRFID0gYWN0aW9uVHlwZXNfZGVmYXVsdC5TRVRfU1RBVEU7XG5cbi8vIG5vZGVfbW9kdWxlcy9AaWNlL3N0b3JlL2VzbS9wbHVnaW5zL21vZGVsQXBpcy5qc1xuaW1wb3J0IFJlYWN0NSBmcm9tIFwicmVhY3RcIjtcblxuLy8gbm9kZV9tb2R1bGVzL2ltbWVyL2Rpc3QvaW1tZXIuZXNtLm1qc1xuZnVuY3Rpb24gbihuMikge1xuICBmb3IgKHZhciByMiA9IGFyZ3VtZW50cy5sZW5ndGgsIHQyID0gQXJyYXkocjIgPiAxID8gcjIgLSAxIDogMCksIGUgPSAxOyBlIDwgcjI7IGUrKylcbiAgICB0MltlIC0gMV0gPSBhcmd1bWVudHNbZV07XG4gIGlmICh0cnVlKSB7XG4gICAgdmFyIGkyID0gWVtuMl0sIG8yID0gaTIgPyBcImZ1bmN0aW9uXCIgPT0gdHlwZW9mIGkyID8gaTIuYXBwbHkobnVsbCwgdDIpIDogaTIgOiBcInVua25vd24gZXJyb3IgbnI6IFwiICsgbjI7XG4gICAgdGhyb3cgRXJyb3IoXCJbSW1tZXJdIFwiICsgbzIpO1xuICB9XG4gIHRocm93IEVycm9yKFwiW0ltbWVyXSBtaW5pZmllZCBlcnJvciBucjogXCIgKyBuMiArICh0Mi5sZW5ndGggPyBcIiBcIiArIHQyLm1hcChmdW5jdGlvbihuMykge1xuICAgIHJldHVybiBcIidcIiArIG4zICsgXCInXCI7XG4gIH0pLmpvaW4oXCIsXCIpIDogXCJcIikgKyBcIi4gRmluZCB0aGUgZnVsbCBlcnJvciBhdDogaHR0cHM6Ly9iaXQubHkvM2NYRUtXZlwiKTtcbn1cbmZ1bmN0aW9uIHIobjIpIHtcbiAgcmV0dXJuICEhbjIgJiYgISFuMltRXTtcbn1cbmZ1bmN0aW9uIHQobjIpIHtcbiAgdmFyIHIyO1xuICByZXR1cm4gISFuMiAmJiAoZnVuY3Rpb24objMpIHtcbiAgICBpZiAoIW4zIHx8IFwib2JqZWN0XCIgIT0gdHlwZW9mIG4zKVxuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIHZhciByMyA9IE9iamVjdC5nZXRQcm90b3R5cGVPZihuMyk7XG4gICAgaWYgKG51bGwgPT09IHIzKVxuICAgICAgcmV0dXJuIHRydWU7XG4gICAgdmFyIHQyID0gT2JqZWN0Lmhhc093blByb3BlcnR5LmNhbGwocjMsIFwiY29uc3RydWN0b3JcIikgJiYgcjMuY29uc3RydWN0b3I7XG4gICAgcmV0dXJuIHQyID09PSBPYmplY3QgfHwgXCJmdW5jdGlvblwiID09IHR5cGVvZiB0MiAmJiBGdW5jdGlvbi50b1N0cmluZy5jYWxsKHQyKSA9PT0gWjtcbiAgfShuMikgfHwgQXJyYXkuaXNBcnJheShuMikgfHwgISFuMltMXSB8fCAhIShudWxsID09PSAocjIgPSBuMi5jb25zdHJ1Y3RvcikgfHwgdm9pZCAwID09PSByMiA/IHZvaWQgMCA6IHIyW0xdKSB8fCBzKG4yKSB8fCB2KG4yKSk7XG59XG5mdW5jdGlvbiBpKG4yLCByMiwgdDIpIHtcbiAgdm9pZCAwID09PSB0MiAmJiAodDIgPSBmYWxzZSksIDAgPT09IG8objIpID8gKHQyID8gT2JqZWN0LmtleXMgOiBubikobjIpLmZvckVhY2goZnVuY3Rpb24oZSkge1xuICAgIHQyICYmIFwic3ltYm9sXCIgPT0gdHlwZW9mIGUgfHwgcjIoZSwgbjJbZV0sIG4yKTtcbiAgfSkgOiBuMi5mb3JFYWNoKGZ1bmN0aW9uKHQzLCBlKSB7XG4gICAgcmV0dXJuIHIyKGUsIHQzLCBuMik7XG4gIH0pO1xufVxuZnVuY3Rpb24gbyhuMikge1xuICB2YXIgcjIgPSBuMltRXTtcbiAgcmV0dXJuIHIyID8gcjIuaSA+IDMgPyByMi5pIC0gNCA6IHIyLmkgOiBBcnJheS5pc0FycmF5KG4yKSA/IDEgOiBzKG4yKSA/IDIgOiB2KG4yKSA/IDMgOiAwO1xufVxuZnVuY3Rpb24gdShuMiwgcjIpIHtcbiAgcmV0dXJuIDIgPT09IG8objIpID8gbjIuaGFzKHIyKSA6IE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChuMiwgcjIpO1xufVxuZnVuY3Rpb24gYShuMiwgcjIpIHtcbiAgcmV0dXJuIDIgPT09IG8objIpID8gbjIuZ2V0KHIyKSA6IG4yW3IyXTtcbn1cbmZ1bmN0aW9uIGYobjIsIHIyLCB0Mikge1xuICB2YXIgZSA9IG8objIpO1xuICAyID09PSBlID8gbjIuc2V0KHIyLCB0MikgOiAzID09PSBlID8gKG4yLmRlbGV0ZShyMiksIG4yLmFkZCh0MikpIDogbjJbcjJdID0gdDI7XG59XG5mdW5jdGlvbiBjKG4yLCByMikge1xuICByZXR1cm4gbjIgPT09IHIyID8gMCAhPT0gbjIgfHwgMSAvIG4yID09IDEgLyByMiA6IG4yICE9IG4yICYmIHIyICE9IHIyO1xufVxuZnVuY3Rpb24gcyhuMikge1xuICByZXR1cm4gWCAmJiBuMiBpbnN0YW5jZW9mIE1hcDtcbn1cbmZ1bmN0aW9uIHYobjIpIHtcbiAgcmV0dXJuIHEgJiYgbjIgaW5zdGFuY2VvZiBTZXQ7XG59XG5mdW5jdGlvbiBwKG4yKSB7XG4gIHJldHVybiBuMi5vIHx8IG4yLnQ7XG59XG5mdW5jdGlvbiBsKG4yKSB7XG4gIGlmIChBcnJheS5pc0FycmF5KG4yKSlcbiAgICByZXR1cm4gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwobjIpO1xuICB2YXIgcjIgPSBybihuMik7XG4gIGRlbGV0ZSByMltRXTtcbiAgZm9yICh2YXIgdDIgPSBubihyMiksIGUgPSAwOyBlIDwgdDIubGVuZ3RoOyBlKyspIHtcbiAgICB2YXIgaTIgPSB0MltlXSwgbzIgPSByMltpMl07XG4gICAgZmFsc2UgPT09IG8yLndyaXRhYmxlICYmIChvMi53cml0YWJsZSA9IHRydWUsIG8yLmNvbmZpZ3VyYWJsZSA9IHRydWUpLCAobzIuZ2V0IHx8IG8yLnNldCkgJiYgKHIyW2kyXSA9IHsgY29uZmlndXJhYmxlOiB0cnVlLCB3cml0YWJsZTogdHJ1ZSwgZW51bWVyYWJsZTogbzIuZW51bWVyYWJsZSwgdmFsdWU6IG4yW2kyXSB9KTtcbiAgfVxuICByZXR1cm4gT2JqZWN0LmNyZWF0ZShPYmplY3QuZ2V0UHJvdG90eXBlT2YobjIpLCByMik7XG59XG5mdW5jdGlvbiBkKG4yLCBlKSB7XG4gIHJldHVybiB2b2lkIDAgPT09IGUgJiYgKGUgPSBmYWxzZSksIHkobjIpIHx8IHIobjIpIHx8ICF0KG4yKSA/IG4yIDogKG8objIpID4gMSAmJiAobjIuc2V0ID0gbjIuYWRkID0gbjIuY2xlYXIgPSBuMi5kZWxldGUgPSBoKSwgT2JqZWN0LmZyZWV6ZShuMiksIGUgJiYgaShuMiwgZnVuY3Rpb24objMsIHIyKSB7XG4gICAgcmV0dXJuIGQocjIsIHRydWUpO1xuICB9LCB0cnVlKSwgbjIpO1xufVxuZnVuY3Rpb24gaCgpIHtcbiAgbigyKTtcbn1cbmZ1bmN0aW9uIHkobjIpIHtcbiAgcmV0dXJuIG51bGwgPT0gbjIgfHwgXCJvYmplY3RcIiAhPSB0eXBlb2YgbjIgfHwgT2JqZWN0LmlzRnJvemVuKG4yKTtcbn1cbmZ1bmN0aW9uIGIocjIpIHtcbiAgdmFyIHQyID0gdG5bcjJdO1xuICByZXR1cm4gdDIgfHwgbigxOCwgcjIpLCB0Mjtcbn1cbmZ1bmN0aW9uIG0objIsIHIyKSB7XG4gIHRuW24yXSB8fCAodG5bbjJdID0gcjIpO1xufVxuZnVuY3Rpb24gXygpIHtcbiAgcmV0dXJuIFUgfHwgbigwKSwgVTtcbn1cbmZ1bmN0aW9uIGoobjIsIHIyKSB7XG4gIHIyICYmIChiKFwiUGF0Y2hlc1wiKSwgbjIudSA9IFtdLCBuMi5zID0gW10sIG4yLnYgPSByMik7XG59XG5mdW5jdGlvbiBPKG4yKSB7XG4gIGcobjIpLCBuMi5wLmZvckVhY2goUyksIG4yLnAgPSBudWxsO1xufVxuZnVuY3Rpb24gZyhuMikge1xuICBuMiA9PT0gVSAmJiAoVSA9IG4yLmwpO1xufVxuZnVuY3Rpb24gdyhuMikge1xuICByZXR1cm4gVSA9IHsgcDogW10sIGw6IFUsIGg6IG4yLCBtOiB0cnVlLCBfOiAwIH07XG59XG5mdW5jdGlvbiBTKG4yKSB7XG4gIHZhciByMiA9IG4yW1FdO1xuICAwID09PSByMi5pIHx8IDEgPT09IHIyLmkgPyByMi5qKCkgOiByMi5PID0gdHJ1ZTtcbn1cbmZ1bmN0aW9uIFAocjIsIGUpIHtcbiAgZS5fID0gZS5wLmxlbmd0aDtcbiAgdmFyIGkyID0gZS5wWzBdLCBvMiA9IHZvaWQgMCAhPT0gcjIgJiYgcjIgIT09IGkyO1xuICByZXR1cm4gZS5oLmcgfHwgYihcIkVTNVwiKS5TKGUsIHIyLCBvMiksIG8yID8gKGkyW1FdLlAgJiYgKE8oZSksIG4oNCkpLCB0KHIyKSAmJiAocjIgPSBNKGUsIHIyKSwgZS5sIHx8IHgoZSwgcjIpKSwgZS51ICYmIGIoXCJQYXRjaGVzXCIpLk0oaTJbUV0udCwgcjIsIGUudSwgZS5zKSkgOiByMiA9IE0oZSwgaTIsIFtdKSwgTyhlKSwgZS51ICYmIGUudihlLnUsIGUucyksIHIyICE9PSBIID8gcjIgOiB2b2lkIDA7XG59XG5mdW5jdGlvbiBNKG4yLCByMiwgdDIpIHtcbiAgaWYgKHkocjIpKVxuICAgIHJldHVybiByMjtcbiAgdmFyIGUgPSByMltRXTtcbiAgaWYgKCFlKVxuICAgIHJldHVybiBpKHIyLCBmdW5jdGlvbihpMiwgbzMpIHtcbiAgICAgIHJldHVybiBBKG4yLCBlLCByMiwgaTIsIG8zLCB0Mik7XG4gICAgfSwgdHJ1ZSksIHIyO1xuICBpZiAoZS5BICE9PSBuMilcbiAgICByZXR1cm4gcjI7XG4gIGlmICghZS5QKVxuICAgIHJldHVybiB4KG4yLCBlLnQsIHRydWUpLCBlLnQ7XG4gIGlmICghZS5JKSB7XG4gICAgZS5JID0gdHJ1ZSwgZS5BLl8tLTtcbiAgICB2YXIgbzIgPSA0ID09PSBlLmkgfHwgNSA9PT0gZS5pID8gZS5vID0gbChlLmspIDogZS5vO1xuICAgIGkoMyA9PT0gZS5pID8gbmV3IFNldChvMikgOiBvMiwgZnVuY3Rpb24ocjMsIGkyKSB7XG4gICAgICByZXR1cm4gQShuMiwgZSwgbzIsIHIzLCBpMiwgdDIpO1xuICAgIH0pLCB4KG4yLCBvMiwgZmFsc2UpLCB0MiAmJiBuMi51ICYmIGIoXCJQYXRjaGVzXCIpLlIoZSwgdDIsIG4yLnUsIG4yLnMpO1xuICB9XG4gIHJldHVybiBlLm87XG59XG5mdW5jdGlvbiBBKGUsIGkyLCBvMiwgYTIsIGMyLCBzMikge1xuICBpZiAoYzIgPT09IG8yICYmIG4oNSksIHIoYzIpKSB7XG4gICAgdmFyIHYyID0gTShlLCBjMiwgczIgJiYgaTIgJiYgMyAhPT0gaTIuaSAmJiAhdShpMi5ELCBhMikgPyBzMi5jb25jYXQoYTIpIDogdm9pZCAwKTtcbiAgICBpZiAoZihvMiwgYTIsIHYyKSwgIXIodjIpKVxuICAgICAgcmV0dXJuO1xuICAgIGUubSA9IGZhbHNlO1xuICB9XG4gIGlmICh0KGMyKSAmJiAheShjMikpIHtcbiAgICBpZiAoIWUuaC5GICYmIGUuXyA8IDEpXG4gICAgICByZXR1cm47XG4gICAgTShlLCBjMiksIGkyICYmIGkyLkEubCB8fCB4KGUsIGMyKTtcbiAgfVxufVxuZnVuY3Rpb24geChuMiwgcjIsIHQyKSB7XG4gIHZvaWQgMCA9PT0gdDIgJiYgKHQyID0gZmFsc2UpLCBuMi5oLkYgJiYgbjIubSAmJiBkKHIyLCB0Mik7XG59XG5mdW5jdGlvbiB6KG4yLCByMikge1xuICB2YXIgdDIgPSBuMltRXTtcbiAgcmV0dXJuICh0MiA/IHAodDIpIDogbjIpW3IyXTtcbn1cbmZ1bmN0aW9uIEkobjIsIHIyKSB7XG4gIGlmIChyMiBpbiBuMilcbiAgICBmb3IgKHZhciB0MiA9IE9iamVjdC5nZXRQcm90b3R5cGVPZihuMik7IHQyOyApIHtcbiAgICAgIHZhciBlID0gT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcih0MiwgcjIpO1xuICAgICAgaWYgKGUpXG4gICAgICAgIHJldHVybiBlO1xuICAgICAgdDIgPSBPYmplY3QuZ2V0UHJvdG90eXBlT2YodDIpO1xuICAgIH1cbn1cbmZ1bmN0aW9uIGsobjIpIHtcbiAgbjIuUCB8fCAobjIuUCA9IHRydWUsIG4yLmwgJiYgayhuMi5sKSk7XG59XG5mdW5jdGlvbiBFKG4yKSB7XG4gIG4yLm8gfHwgKG4yLm8gPSBsKG4yLnQpKTtcbn1cbmZ1bmN0aW9uIFIobjIsIHIyLCB0Mikge1xuICB2YXIgZSA9IHMocjIpID8gYihcIk1hcFNldFwiKS5OKHIyLCB0MikgOiB2KHIyKSA/IGIoXCJNYXBTZXRcIikuVChyMiwgdDIpIDogbjIuZyA/IGZ1bmN0aW9uKG4zLCByMykge1xuICAgIHZhciB0MyA9IEFycmF5LmlzQXJyYXkobjMpLCBlMiA9IHsgaTogdDMgPyAxIDogMCwgQTogcjMgPyByMy5BIDogXygpLCBQOiBmYWxzZSwgSTogZmFsc2UsIEQ6IHt9LCBsOiByMywgdDogbjMsIGs6IG51bGwsIG86IG51bGwsIGo6IG51bGwsIEM6IGZhbHNlIH0sIGkyID0gZTIsIG8yID0gZW47XG4gICAgdDMgJiYgKGkyID0gW2UyXSwgbzIgPSBvbik7XG4gICAgdmFyIHUyID0gUHJveHkucmV2b2NhYmxlKGkyLCBvMiksIGEyID0gdTIucmV2b2tlLCBmMiA9IHUyLnByb3h5O1xuICAgIHJldHVybiBlMi5rID0gZjIsIGUyLmogPSBhMiwgZjI7XG4gIH0ocjIsIHQyKSA6IGIoXCJFUzVcIikuSihyMiwgdDIpO1xuICByZXR1cm4gKHQyID8gdDIuQSA6IF8oKSkucC5wdXNoKGUpLCBlO1xufVxuZnVuY3Rpb24gRChlKSB7XG4gIHJldHVybiByKGUpIHx8IG4oMjIsIGUpLCBmdW5jdGlvbiBuMihyMikge1xuICAgIGlmICghdChyMikpXG4gICAgICByZXR1cm4gcjI7XG4gICAgdmFyIGUyLCB1MiA9IHIyW1FdLCBjMiA9IG8ocjIpO1xuICAgIGlmICh1Mikge1xuICAgICAgaWYgKCF1Mi5QICYmICh1Mi5pIDwgNCB8fCAhYihcIkVTNVwiKS5LKHUyKSkpXG4gICAgICAgIHJldHVybiB1Mi50O1xuICAgICAgdTIuSSA9IHRydWUsIGUyID0gRihyMiwgYzIpLCB1Mi5JID0gZmFsc2U7XG4gICAgfSBlbHNlXG4gICAgICBlMiA9IEYocjIsIGMyKTtcbiAgICByZXR1cm4gaShlMiwgZnVuY3Rpb24ocjMsIHQyKSB7XG4gICAgICB1MiAmJiBhKHUyLnQsIHIzKSA9PT0gdDIgfHwgZihlMiwgcjMsIG4yKHQyKSk7XG4gICAgfSksIDMgPT09IGMyID8gbmV3IFNldChlMikgOiBlMjtcbiAgfShlKTtcbn1cbmZ1bmN0aW9uIEYobjIsIHIyKSB7XG4gIHN3aXRjaCAocjIpIHtcbiAgICBjYXNlIDI6XG4gICAgICByZXR1cm4gbmV3IE1hcChuMik7XG4gICAgY2FzZSAzOlxuICAgICAgcmV0dXJuIEFycmF5LmZyb20objIpO1xuICB9XG4gIHJldHVybiBsKG4yKTtcbn1cbmZ1bmN0aW9uIE4oKSB7XG4gIGZ1bmN0aW9uIHQyKG4yLCByMikge1xuICAgIHZhciB0MyA9IHMyW24yXTtcbiAgICByZXR1cm4gdDMgPyB0My5lbnVtZXJhYmxlID0gcjIgOiBzMltuMl0gPSB0MyA9IHsgY29uZmlndXJhYmxlOiB0cnVlLCBlbnVtZXJhYmxlOiByMiwgZ2V0OiBmdW5jdGlvbigpIHtcbiAgICAgIHZhciByMyA9IHRoaXNbUV07XG4gICAgICByZXR1cm4gZjIocjMpLCBlbi5nZXQocjMsIG4yKTtcbiAgICB9LCBzZXQ6IGZ1bmN0aW9uKHIzKSB7XG4gICAgICB2YXIgdDQgPSB0aGlzW1FdO1xuICAgICAgZjIodDQpLCBlbi5zZXQodDQsIG4yLCByMyk7XG4gICAgfSB9LCB0MztcbiAgfVxuICBmdW5jdGlvbiBlKG4yKSB7XG4gICAgZm9yICh2YXIgcjIgPSBuMi5sZW5ndGggLSAxOyByMiA+PSAwOyByMi0tKSB7XG4gICAgICB2YXIgdDMgPSBuMltyMl1bUV07XG4gICAgICBpZiAoIXQzLlApXG4gICAgICAgIHN3aXRjaCAodDMuaSkge1xuICAgICAgICAgIGNhc2UgNTpcbiAgICAgICAgICAgIGEyKHQzKSAmJiBrKHQzKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIGNhc2UgNDpcbiAgICAgICAgICAgIG8yKHQzKSAmJiBrKHQzKTtcbiAgICAgICAgfVxuICAgIH1cbiAgfVxuICBmdW5jdGlvbiBvMihuMikge1xuICAgIGZvciAodmFyIHIyID0gbjIudCwgdDMgPSBuMi5rLCBlMiA9IG5uKHQzKSwgaTIgPSBlMi5sZW5ndGggLSAxOyBpMiA+PSAwOyBpMi0tKSB7XG4gICAgICB2YXIgbzMgPSBlMltpMl07XG4gICAgICBpZiAobzMgIT09IFEpIHtcbiAgICAgICAgdmFyIGEzID0gcjJbbzNdO1xuICAgICAgICBpZiAodm9pZCAwID09PSBhMyAmJiAhdShyMiwgbzMpKVxuICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB2YXIgZjMgPSB0M1tvM10sIHMzID0gZjMgJiYgZjNbUV07XG4gICAgICAgIGlmIChzMyA/IHMzLnQgIT09IGEzIDogIWMoZjMsIGEzKSlcbiAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH1cbiAgICB9XG4gICAgdmFyIHYyID0gISFyMltRXTtcbiAgICByZXR1cm4gZTIubGVuZ3RoICE9PSBubihyMikubGVuZ3RoICsgKHYyID8gMCA6IDEpO1xuICB9XG4gIGZ1bmN0aW9uIGEyKG4yKSB7XG4gICAgdmFyIHIyID0gbjIuaztcbiAgICBpZiAocjIubGVuZ3RoICE9PSBuMi50Lmxlbmd0aClcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIHZhciB0MyA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IocjIsIHIyLmxlbmd0aCAtIDEpO1xuICAgIGlmICh0MyAmJiAhdDMuZ2V0KVxuICAgICAgcmV0dXJuIHRydWU7XG4gICAgZm9yICh2YXIgZTIgPSAwOyBlMiA8IHIyLmxlbmd0aDsgZTIrKylcbiAgICAgIGlmICghcjIuaGFzT3duUHJvcGVydHkoZTIpKVxuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbiAgZnVuY3Rpb24gZjIocjIpIHtcbiAgICByMi5PICYmIG4oMywgSlNPTi5zdHJpbmdpZnkocChyMikpKTtcbiAgfVxuICB2YXIgczIgPSB7fTtcbiAgbShcIkVTNVwiLCB7IEo6IGZ1bmN0aW9uKG4yLCByMikge1xuICAgIHZhciBlMiA9IEFycmF5LmlzQXJyYXkobjIpLCBpMiA9IGZ1bmN0aW9uKG4zLCByMykge1xuICAgICAgaWYgKG4zKSB7XG4gICAgICAgIGZvciAodmFyIGUzID0gQXJyYXkocjMubGVuZ3RoKSwgaTMgPSAwOyBpMyA8IHIzLmxlbmd0aDsgaTMrKylcbiAgICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoZTMsIFwiXCIgKyBpMywgdDIoaTMsIHRydWUpKTtcbiAgICAgICAgcmV0dXJuIGUzO1xuICAgICAgfVxuICAgICAgdmFyIG80ID0gcm4ocjMpO1xuICAgICAgZGVsZXRlIG80W1FdO1xuICAgICAgZm9yICh2YXIgdTIgPSBubihvNCksIGEzID0gMDsgYTMgPCB1Mi5sZW5ndGg7IGEzKyspIHtcbiAgICAgICAgdmFyIGYzID0gdTJbYTNdO1xuICAgICAgICBvNFtmM10gPSB0MihmMywgbjMgfHwgISFvNFtmM10uZW51bWVyYWJsZSk7XG4gICAgICB9XG4gICAgICByZXR1cm4gT2JqZWN0LmNyZWF0ZShPYmplY3QuZ2V0UHJvdG90eXBlT2YocjMpLCBvNCk7XG4gICAgfShlMiwgbjIpLCBvMyA9IHsgaTogZTIgPyA1IDogNCwgQTogcjIgPyByMi5BIDogXygpLCBQOiBmYWxzZSwgSTogZmFsc2UsIEQ6IHt9LCBsOiByMiwgdDogbjIsIGs6IGkyLCBvOiBudWxsLCBPOiBmYWxzZSwgQzogZmFsc2UgfTtcbiAgICByZXR1cm4gT2JqZWN0LmRlZmluZVByb3BlcnR5KGkyLCBRLCB7IHZhbHVlOiBvMywgd3JpdGFibGU6IHRydWUgfSksIGkyO1xuICB9LCBTOiBmdW5jdGlvbihuMiwgdDMsIG8zKSB7XG4gICAgbzMgPyByKHQzKSAmJiB0M1tRXS5BID09PSBuMiAmJiBlKG4yLnApIDogKG4yLnUgJiYgZnVuY3Rpb24gbjMocjIpIHtcbiAgICAgIGlmIChyMiAmJiBcIm9iamVjdFwiID09IHR5cGVvZiByMikge1xuICAgICAgICB2YXIgdDQgPSByMltRXTtcbiAgICAgICAgaWYgKHQ0KSB7XG4gICAgICAgICAgdmFyIGUyID0gdDQudCwgbzQgPSB0NC5rLCBmMyA9IHQ0LkQsIGMyID0gdDQuaTtcbiAgICAgICAgICBpZiAoNCA9PT0gYzIpXG4gICAgICAgICAgICBpKG80LCBmdW5jdGlvbihyMykge1xuICAgICAgICAgICAgICByMyAhPT0gUSAmJiAodm9pZCAwICE9PSBlMltyM10gfHwgdShlMiwgcjMpID8gZjNbcjNdIHx8IG4zKG80W3IzXSkgOiAoZjNbcjNdID0gdHJ1ZSwgayh0NCkpKTtcbiAgICAgICAgICAgIH0pLCBpKGUyLCBmdW5jdGlvbihuNCkge1xuICAgICAgICAgICAgICB2b2lkIDAgIT09IG80W240XSB8fCB1KG80LCBuNCkgfHwgKGYzW240XSA9IGZhbHNlLCBrKHQ0KSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICBlbHNlIGlmICg1ID09PSBjMikge1xuICAgICAgICAgICAgaWYgKGEyKHQ0KSAmJiAoayh0NCksIGYzLmxlbmd0aCA9IHRydWUpLCBvNC5sZW5ndGggPCBlMi5sZW5ndGgpXG4gICAgICAgICAgICAgIGZvciAodmFyIHMzID0gbzQubGVuZ3RoOyBzMyA8IGUyLmxlbmd0aDsgczMrKylcbiAgICAgICAgICAgICAgICBmM1tzM10gPSBmYWxzZTtcbiAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgZm9yICh2YXIgdjIgPSBlMi5sZW5ndGg7IHYyIDwgbzQubGVuZ3RoOyB2MisrKVxuICAgICAgICAgICAgICAgIGYzW3YyXSA9IHRydWU7XG4gICAgICAgICAgICBmb3IgKHZhciBwMiA9IE1hdGgubWluKG80Lmxlbmd0aCwgZTIubGVuZ3RoKSwgbDIgPSAwOyBsMiA8IHAyOyBsMisrKVxuICAgICAgICAgICAgICBvNC5oYXNPd25Qcm9wZXJ0eShsMikgfHwgKGYzW2wyXSA9IHRydWUpLCB2b2lkIDAgPT09IGYzW2wyXSAmJiBuMyhvNFtsMl0pO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0objIucFswXSksIGUobjIucCkpO1xuICB9LCBLOiBmdW5jdGlvbihuMikge1xuICAgIHJldHVybiA0ID09PSBuMi5pID8gbzIobjIpIDogYTIobjIpO1xuICB9IH0pO1xufVxudmFyIEc7XG52YXIgVTtcbnZhciBXID0gXCJ1bmRlZmluZWRcIiAhPSB0eXBlb2YgU3ltYm9sICYmIFwic3ltYm9sXCIgPT0gdHlwZW9mIFN5bWJvbChcInhcIik7XG52YXIgWCA9IFwidW5kZWZpbmVkXCIgIT0gdHlwZW9mIE1hcDtcbnZhciBxID0gXCJ1bmRlZmluZWRcIiAhPSB0eXBlb2YgU2V0O1xudmFyIEIgPSBcInVuZGVmaW5lZFwiICE9IHR5cGVvZiBQcm94eSAmJiB2b2lkIDAgIT09IFByb3h5LnJldm9jYWJsZSAmJiBcInVuZGVmaW5lZFwiICE9IHR5cGVvZiBSZWZsZWN0O1xudmFyIEggPSBXID8gU3ltYm9sLmZvcihcImltbWVyLW5vdGhpbmdcIikgOiAoKEcgPSB7fSlbXCJpbW1lci1ub3RoaW5nXCJdID0gdHJ1ZSwgRyk7XG52YXIgTCA9IFcgPyBTeW1ib2wuZm9yKFwiaW1tZXItZHJhZnRhYmxlXCIpIDogXCJfXyRpbW1lcl9kcmFmdGFibGVcIjtcbnZhciBRID0gVyA/IFN5bWJvbC5mb3IoXCJpbW1lci1zdGF0ZVwiKSA6IFwiX18kaW1tZXJfc3RhdGVcIjtcbnZhciBZID0geyAwOiBcIklsbGVnYWwgc3RhdGVcIiwgMTogXCJJbW1lciBkcmFmdHMgY2Fubm90IGhhdmUgY29tcHV0ZWQgcHJvcGVydGllc1wiLCAyOiBcIlRoaXMgb2JqZWN0IGhhcyBiZWVuIGZyb3plbiBhbmQgc2hvdWxkIG5vdCBiZSBtdXRhdGVkXCIsIDM6IGZ1bmN0aW9uKG4yKSB7XG4gIHJldHVybiBcIkNhbm5vdCB1c2UgYSBwcm94eSB0aGF0IGhhcyBiZWVuIHJldm9rZWQuIERpZCB5b3UgcGFzcyBhbiBvYmplY3QgZnJvbSBpbnNpZGUgYW4gaW1tZXIgZnVuY3Rpb24gdG8gYW4gYXN5bmMgcHJvY2Vzcz8gXCIgKyBuMjtcbn0sIDQ6IFwiQW4gaW1tZXIgcHJvZHVjZXIgcmV0dXJuZWQgYSBuZXcgdmFsdWUgKmFuZCogbW9kaWZpZWQgaXRzIGRyYWZ0LiBFaXRoZXIgcmV0dXJuIGEgbmV3IHZhbHVlICpvciogbW9kaWZ5IHRoZSBkcmFmdC5cIiwgNTogXCJJbW1lciBmb3JiaWRzIGNpcmN1bGFyIHJlZmVyZW5jZXNcIiwgNjogXCJUaGUgZmlyc3Qgb3Igc2Vjb25kIGFyZ3VtZW50IHRvIGBwcm9kdWNlYCBtdXN0IGJlIGEgZnVuY3Rpb25cIiwgNzogXCJUaGUgdGhpcmQgYXJndW1lbnQgdG8gYHByb2R1Y2VgIG11c3QgYmUgYSBmdW5jdGlvbiBvciB1bmRlZmluZWRcIiwgODogXCJGaXJzdCBhcmd1bWVudCB0byBgY3JlYXRlRHJhZnRgIG11c3QgYmUgYSBwbGFpbiBvYmplY3QsIGFuIGFycmF5LCBvciBhbiBpbW1lcmFibGUgb2JqZWN0XCIsIDk6IFwiRmlyc3QgYXJndW1lbnQgdG8gYGZpbmlzaERyYWZ0YCBtdXN0IGJlIGEgZHJhZnQgcmV0dXJuZWQgYnkgYGNyZWF0ZURyYWZ0YFwiLCAxMDogXCJUaGUgZ2l2ZW4gZHJhZnQgaXMgYWxyZWFkeSBmaW5hbGl6ZWRcIiwgMTE6IFwiT2JqZWN0LmRlZmluZVByb3BlcnR5KCkgY2Fubm90IGJlIHVzZWQgb24gYW4gSW1tZXIgZHJhZnRcIiwgMTI6IFwiT2JqZWN0LnNldFByb3RvdHlwZU9mKCkgY2Fubm90IGJlIHVzZWQgb24gYW4gSW1tZXIgZHJhZnRcIiwgMTM6IFwiSW1tZXIgb25seSBzdXBwb3J0cyBkZWxldGluZyBhcnJheSBpbmRpY2VzXCIsIDE0OiBcIkltbWVyIG9ubHkgc3VwcG9ydHMgc2V0dGluZyBhcnJheSBpbmRpY2VzIGFuZCB0aGUgJ2xlbmd0aCcgcHJvcGVydHlcIiwgMTU6IGZ1bmN0aW9uKG4yKSB7XG4gIHJldHVybiBcIkNhbm5vdCBhcHBseSBwYXRjaCwgcGF0aCBkb2Vzbid0IHJlc29sdmU6IFwiICsgbjI7XG59LCAxNjogJ1NldHMgY2Fubm90IGhhdmUgXCJyZXBsYWNlXCIgcGF0Y2hlcy4nLCAxNzogZnVuY3Rpb24objIpIHtcbiAgcmV0dXJuIFwiVW5zdXBwb3J0ZWQgcGF0Y2ggb3BlcmF0aW9uOiBcIiArIG4yO1xufSwgMTg6IGZ1bmN0aW9uKG4yKSB7XG4gIHJldHVybiBcIlRoZSBwbHVnaW4gZm9yICdcIiArIG4yICsgXCInIGhhcyBub3QgYmVlbiBsb2FkZWQgaW50byBJbW1lci4gVG8gZW5hYmxlIHRoZSBwbHVnaW4sIGltcG9ydCBhbmQgY2FsbCBgZW5hYmxlXCIgKyBuMiArIFwiKClgIHdoZW4gaW5pdGlhbGl6aW5nIHlvdXIgYXBwbGljYXRpb24uXCI7XG59LCAyMDogXCJDYW5ub3QgdXNlIHByb3hpZXMgaWYgUHJveHksIFByb3h5LnJldm9jYWJsZSBvciBSZWZsZWN0IGFyZSBub3QgYXZhaWxhYmxlXCIsIDIxOiBmdW5jdGlvbihuMikge1xuICByZXR1cm4gXCJwcm9kdWNlIGNhbiBvbmx5IGJlIGNhbGxlZCBvbiB0aGluZ3MgdGhhdCBhcmUgZHJhZnRhYmxlOiBwbGFpbiBvYmplY3RzLCBhcnJheXMsIE1hcCwgU2V0IG9yIGNsYXNzZXMgdGhhdCBhcmUgbWFya2VkIHdpdGggJ1tpbW1lcmFibGVdOiB0cnVlJy4gR290ICdcIiArIG4yICsgXCInXCI7XG59LCAyMjogZnVuY3Rpb24objIpIHtcbiAgcmV0dXJuIFwiJ2N1cnJlbnQnIGV4cGVjdHMgYSBkcmFmdCwgZ290OiBcIiArIG4yO1xufSwgMjM6IGZ1bmN0aW9uKG4yKSB7XG4gIHJldHVybiBcIidvcmlnaW5hbCcgZXhwZWN0cyBhIGRyYWZ0LCBnb3Q6IFwiICsgbjI7XG59LCAyNDogXCJQYXRjaGluZyByZXNlcnZlZCBhdHRyaWJ1dGVzIGxpa2UgX19wcm90b19fLCBwcm90b3R5cGUgYW5kIGNvbnN0cnVjdG9yIGlzIG5vdCBhbGxvd2VkXCIgfTtcbnZhciBaID0gXCJcIiArIE9iamVjdC5wcm90b3R5cGUuY29uc3RydWN0b3I7XG52YXIgbm4gPSBcInVuZGVmaW5lZFwiICE9IHR5cGVvZiBSZWZsZWN0ICYmIFJlZmxlY3Qub3duS2V5cyA/IFJlZmxlY3Qub3duS2V5cyA6IHZvaWQgMCAhPT0gT2JqZWN0LmdldE93blByb3BlcnR5U3ltYm9scyA/IGZ1bmN0aW9uKG4yKSB7XG4gIHJldHVybiBPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcyhuMikuY29uY2F0KE9iamVjdC5nZXRPd25Qcm9wZXJ0eVN5bWJvbHMobjIpKTtcbn0gOiBPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcztcbnZhciBybiA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3JzIHx8IGZ1bmN0aW9uKG4yKSB7XG4gIHZhciByMiA9IHt9O1xuICByZXR1cm4gbm4objIpLmZvckVhY2goZnVuY3Rpb24odDIpIHtcbiAgICByMlt0Ml0gPSBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKG4yLCB0Mik7XG4gIH0pLCByMjtcbn07XG52YXIgdG4gPSB7fTtcbnZhciBlbiA9IHsgZ2V0OiBmdW5jdGlvbihuMiwgcjIpIHtcbiAgaWYgKHIyID09PSBRKVxuICAgIHJldHVybiBuMjtcbiAgdmFyIGUgPSBwKG4yKTtcbiAgaWYgKCF1KGUsIHIyKSlcbiAgICByZXR1cm4gZnVuY3Rpb24objMsIHIzLCB0Mikge1xuICAgICAgdmFyIGUyLCBpMyA9IEkocjMsIHQyKTtcbiAgICAgIHJldHVybiBpMyA/IFwidmFsdWVcIiBpbiBpMyA/IGkzLnZhbHVlIDogbnVsbCA9PT0gKGUyID0gaTMuZ2V0KSB8fCB2b2lkIDAgPT09IGUyID8gdm9pZCAwIDogZTIuY2FsbChuMy5rKSA6IHZvaWQgMDtcbiAgICB9KG4yLCBlLCByMik7XG4gIHZhciBpMiA9IGVbcjJdO1xuICByZXR1cm4gbjIuSSB8fCAhdChpMikgPyBpMiA6IGkyID09PSB6KG4yLnQsIHIyKSA/IChFKG4yKSwgbjIub1tyMl0gPSBSKG4yLkEuaCwgaTIsIG4yKSkgOiBpMjtcbn0sIGhhczogZnVuY3Rpb24objIsIHIyKSB7XG4gIHJldHVybiByMiBpbiBwKG4yKTtcbn0sIG93bktleXM6IGZ1bmN0aW9uKG4yKSB7XG4gIHJldHVybiBSZWZsZWN0Lm93bktleXMocChuMikpO1xufSwgc2V0OiBmdW5jdGlvbihuMiwgcjIsIHQyKSB7XG4gIHZhciBlID0gSShwKG4yKSwgcjIpO1xuICBpZiAobnVsbCA9PSBlID8gdm9pZCAwIDogZS5zZXQpXG4gICAgcmV0dXJuIGUuc2V0LmNhbGwobjIuaywgdDIpLCB0cnVlO1xuICBpZiAoIW4yLlApIHtcbiAgICB2YXIgaTIgPSB6KHAobjIpLCByMiksIG8yID0gbnVsbCA9PSBpMiA/IHZvaWQgMCA6IGkyW1FdO1xuICAgIGlmIChvMiAmJiBvMi50ID09PSB0MilcbiAgICAgIHJldHVybiBuMi5vW3IyXSA9IHQyLCBuMi5EW3IyXSA9IGZhbHNlLCB0cnVlO1xuICAgIGlmIChjKHQyLCBpMikgJiYgKHZvaWQgMCAhPT0gdDIgfHwgdShuMi50LCByMikpKVxuICAgICAgcmV0dXJuIHRydWU7XG4gICAgRShuMiksIGsobjIpO1xuICB9XG4gIHJldHVybiBuMi5vW3IyXSA9PT0gdDIgJiYgXCJudW1iZXJcIiAhPSB0eXBlb2YgdDIgJiYgKHZvaWQgMCAhPT0gdDIgfHwgcjIgaW4gbjIubykgfHwgKG4yLm9bcjJdID0gdDIsIG4yLkRbcjJdID0gdHJ1ZSwgdHJ1ZSk7XG59LCBkZWxldGVQcm9wZXJ0eTogZnVuY3Rpb24objIsIHIyKSB7XG4gIHJldHVybiB2b2lkIDAgIT09IHoobjIudCwgcjIpIHx8IHIyIGluIG4yLnQgPyAobjIuRFtyMl0gPSBmYWxzZSwgRShuMiksIGsobjIpKSA6IGRlbGV0ZSBuMi5EW3IyXSwgbjIubyAmJiBkZWxldGUgbjIub1tyMl0sIHRydWU7XG59LCBnZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3I6IGZ1bmN0aW9uKG4yLCByMikge1xuICB2YXIgdDIgPSBwKG4yKSwgZSA9IFJlZmxlY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKHQyLCByMik7XG4gIHJldHVybiBlID8geyB3cml0YWJsZTogdHJ1ZSwgY29uZmlndXJhYmxlOiAxICE9PSBuMi5pIHx8IFwibGVuZ3RoXCIgIT09IHIyLCBlbnVtZXJhYmxlOiBlLmVudW1lcmFibGUsIHZhbHVlOiB0MltyMl0gfSA6IGU7XG59LCBkZWZpbmVQcm9wZXJ0eTogZnVuY3Rpb24oKSB7XG4gIG4oMTEpO1xufSwgZ2V0UHJvdG90eXBlT2Y6IGZ1bmN0aW9uKG4yKSB7XG4gIHJldHVybiBPYmplY3QuZ2V0UHJvdG90eXBlT2YobjIudCk7XG59LCBzZXRQcm90b3R5cGVPZjogZnVuY3Rpb24oKSB7XG4gIG4oMTIpO1xufSB9O1xudmFyIG9uID0ge307XG5pKGVuLCBmdW5jdGlvbihuMiwgcjIpIHtcbiAgb25bbjJdID0gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIGFyZ3VtZW50c1swXSA9IGFyZ3VtZW50c1swXVswXSwgcjIuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgfTtcbn0pLCBvbi5kZWxldGVQcm9wZXJ0eSA9IGZ1bmN0aW9uKHIyLCB0Mikge1xuICByZXR1cm4gaXNOYU4ocGFyc2VJbnQodDIpKSAmJiBuKDEzKSwgb24uc2V0LmNhbGwodGhpcywgcjIsIHQyLCB2b2lkIDApO1xufSwgb24uc2V0ID0gZnVuY3Rpb24ocjIsIHQyLCBlKSB7XG4gIHJldHVybiBcImxlbmd0aFwiICE9PSB0MiAmJiBpc05hTihwYXJzZUludCh0MikpICYmIG4oMTQpLCBlbi5zZXQuY2FsbCh0aGlzLCByMlswXSwgdDIsIGUsIHIyWzBdKTtcbn07XG52YXIgdW4gPSBmdW5jdGlvbigpIHtcbiAgZnVuY3Rpb24gZShyMikge1xuICAgIHZhciBlMiA9IHRoaXM7XG4gICAgdGhpcy5nID0gQiwgdGhpcy5GID0gdHJ1ZSwgdGhpcy5wcm9kdWNlID0gZnVuY3Rpb24ocjMsIGkzLCBvMikge1xuICAgICAgaWYgKFwiZnVuY3Rpb25cIiA9PSB0eXBlb2YgcjMgJiYgXCJmdW5jdGlvblwiICE9IHR5cGVvZiBpMykge1xuICAgICAgICB2YXIgdTIgPSBpMztcbiAgICAgICAgaTMgPSByMztcbiAgICAgICAgdmFyIGEyID0gZTI7XG4gICAgICAgIHJldHVybiBmdW5jdGlvbihuMikge1xuICAgICAgICAgIHZhciByNCA9IHRoaXM7XG4gICAgICAgICAgdm9pZCAwID09PSBuMiAmJiAobjIgPSB1Mik7XG4gICAgICAgICAgZm9yICh2YXIgdDIgPSBhcmd1bWVudHMubGVuZ3RoLCBlMyA9IEFycmF5KHQyID4gMSA/IHQyIC0gMSA6IDApLCBvMyA9IDE7IG8zIDwgdDI7IG8zKyspXG4gICAgICAgICAgICBlM1tvMyAtIDFdID0gYXJndW1lbnRzW28zXTtcbiAgICAgICAgICByZXR1cm4gYTIucHJvZHVjZShuMiwgZnVuY3Rpb24objMpIHtcbiAgICAgICAgICAgIHZhciB0MztcbiAgICAgICAgICAgIHJldHVybiAodDMgPSBpMykuY2FsbC5hcHBseSh0MywgW3I0LCBuM10uY29uY2F0KGUzKSk7XG4gICAgICAgICAgfSk7XG4gICAgICAgIH07XG4gICAgICB9XG4gICAgICB2YXIgZjI7XG4gICAgICBpZiAoXCJmdW5jdGlvblwiICE9IHR5cGVvZiBpMyAmJiBuKDYpLCB2b2lkIDAgIT09IG8yICYmIFwiZnVuY3Rpb25cIiAhPSB0eXBlb2YgbzIgJiYgbig3KSwgdChyMykpIHtcbiAgICAgICAgdmFyIGMyID0gdyhlMiksIHMyID0gUihlMiwgcjMsIHZvaWQgMCksIHYyID0gdHJ1ZTtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICBmMiA9IGkzKHMyKSwgdjIgPSBmYWxzZTtcbiAgICAgICAgfSBmaW5hbGx5IHtcbiAgICAgICAgICB2MiA/IE8oYzIpIDogZyhjMik7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIFwidW5kZWZpbmVkXCIgIT0gdHlwZW9mIFByb21pc2UgJiYgZjIgaW5zdGFuY2VvZiBQcm9taXNlID8gZjIudGhlbihmdW5jdGlvbihuMikge1xuICAgICAgICAgIHJldHVybiBqKGMyLCBvMiksIFAobjIsIGMyKTtcbiAgICAgICAgfSwgZnVuY3Rpb24objIpIHtcbiAgICAgICAgICB0aHJvdyBPKGMyKSwgbjI7XG4gICAgICAgIH0pIDogKGooYzIsIG8yKSwgUChmMiwgYzIpKTtcbiAgICAgIH1cbiAgICAgIGlmICghcjMgfHwgXCJvYmplY3RcIiAhPSB0eXBlb2YgcjMpIHtcbiAgICAgICAgaWYgKHZvaWQgMCA9PT0gKGYyID0gaTMocjMpKSAmJiAoZjIgPSByMyksIGYyID09PSBIICYmIChmMiA9IHZvaWQgMCksIGUyLkYgJiYgZChmMiwgdHJ1ZSksIG8yKSB7XG4gICAgICAgICAgdmFyIHAyID0gW10sIGwyID0gW107XG4gICAgICAgICAgYihcIlBhdGNoZXNcIikuTShyMywgZjIsIHAyLCBsMiksIG8yKHAyLCBsMik7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGYyO1xuICAgICAgfVxuICAgICAgbigyMSwgcjMpO1xuICAgIH0sIHRoaXMucHJvZHVjZVdpdGhQYXRjaGVzID0gZnVuY3Rpb24objIsIHIzKSB7XG4gICAgICBpZiAoXCJmdW5jdGlvblwiID09IHR5cGVvZiBuMilcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uKHI0KSB7XG4gICAgICAgICAgZm9yICh2YXIgdDMgPSBhcmd1bWVudHMubGVuZ3RoLCBpNCA9IEFycmF5KHQzID4gMSA/IHQzIC0gMSA6IDApLCBvMyA9IDE7IG8zIDwgdDM7IG8zKyspXG4gICAgICAgICAgICBpNFtvMyAtIDFdID0gYXJndW1lbnRzW28zXTtcbiAgICAgICAgICByZXR1cm4gZTIucHJvZHVjZVdpdGhQYXRjaGVzKHI0LCBmdW5jdGlvbihyNSkge1xuICAgICAgICAgICAgcmV0dXJuIG4yLmFwcGx5KHZvaWQgMCwgW3I1XS5jb25jYXQoaTQpKTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgfTtcbiAgICAgIHZhciB0MiwgaTMsIG8yID0gZTIucHJvZHVjZShuMiwgcjMsIGZ1bmN0aW9uKG4zLCByNCkge1xuICAgICAgICB0MiA9IG4zLCBpMyA9IHI0O1xuICAgICAgfSk7XG4gICAgICByZXR1cm4gXCJ1bmRlZmluZWRcIiAhPSB0eXBlb2YgUHJvbWlzZSAmJiBvMiBpbnN0YW5jZW9mIFByb21pc2UgPyBvMi50aGVuKGZ1bmN0aW9uKG4zKSB7XG4gICAgICAgIHJldHVybiBbbjMsIHQyLCBpM107XG4gICAgICB9KSA6IFtvMiwgdDIsIGkzXTtcbiAgICB9LCBcImJvb2xlYW5cIiA9PSB0eXBlb2YgKG51bGwgPT0gcjIgPyB2b2lkIDAgOiByMi51c2VQcm94aWVzKSAmJiB0aGlzLnNldFVzZVByb3hpZXMocjIudXNlUHJveGllcyksIFwiYm9vbGVhblwiID09IHR5cGVvZiAobnVsbCA9PSByMiA/IHZvaWQgMCA6IHIyLmF1dG9GcmVlemUpICYmIHRoaXMuc2V0QXV0b0ZyZWV6ZShyMi5hdXRvRnJlZXplKTtcbiAgfVxuICB2YXIgaTIgPSBlLnByb3RvdHlwZTtcbiAgcmV0dXJuIGkyLmNyZWF0ZURyYWZ0ID0gZnVuY3Rpb24oZTIpIHtcbiAgICB0KGUyKSB8fCBuKDgpLCByKGUyKSAmJiAoZTIgPSBEKGUyKSk7XG4gICAgdmFyIGkzID0gdyh0aGlzKSwgbzIgPSBSKHRoaXMsIGUyLCB2b2lkIDApO1xuICAgIHJldHVybiBvMltRXS5DID0gdHJ1ZSwgZyhpMyksIG8yO1xuICB9LCBpMi5maW5pc2hEcmFmdCA9IGZ1bmN0aW9uKHIyLCB0Mikge1xuICAgIHZhciBlMiA9IHIyICYmIHIyW1FdO1xuICAgIGUyICYmIGUyLkMgfHwgbig5KSwgZTIuSSAmJiBuKDEwKTtcbiAgICB2YXIgaTMgPSBlMi5BO1xuICAgIHJldHVybiBqKGkzLCB0MiksIFAodm9pZCAwLCBpMyk7XG4gIH0sIGkyLnNldEF1dG9GcmVlemUgPSBmdW5jdGlvbihuMikge1xuICAgIHRoaXMuRiA9IG4yO1xuICB9LCBpMi5zZXRVc2VQcm94aWVzID0gZnVuY3Rpb24ocjIpIHtcbiAgICByMiAmJiAhQiAmJiBuKDIwKSwgdGhpcy5nID0gcjI7XG4gIH0sIGkyLmFwcGx5UGF0Y2hlcyA9IGZ1bmN0aW9uKG4yLCB0Mikge1xuICAgIHZhciBlMjtcbiAgICBmb3IgKGUyID0gdDIubGVuZ3RoIC0gMTsgZTIgPj0gMDsgZTItLSkge1xuICAgICAgdmFyIGkzID0gdDJbZTJdO1xuICAgICAgaWYgKDAgPT09IGkzLnBhdGgubGVuZ3RoICYmIFwicmVwbGFjZVwiID09PSBpMy5vcCkge1xuICAgICAgICBuMiA9IGkzLnZhbHVlO1xuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICB9XG4gICAgZTIgPiAtMSAmJiAodDIgPSB0Mi5zbGljZShlMiArIDEpKTtcbiAgICB2YXIgbzIgPSBiKFwiUGF0Y2hlc1wiKS4kO1xuICAgIHJldHVybiByKG4yKSA/IG8yKG4yLCB0MikgOiB0aGlzLnByb2R1Y2UobjIsIGZ1bmN0aW9uKG4zKSB7XG4gICAgICByZXR1cm4gbzIobjMsIHQyKTtcbiAgICB9KTtcbiAgfSwgZTtcbn0oKTtcbnZhciBhbiA9IG5ldyB1bigpO1xudmFyIGZuID0gYW4ucHJvZHVjZTtcbnZhciBjbiA9IGFuLnByb2R1Y2VXaXRoUGF0Y2hlcy5iaW5kKGFuKTtcbnZhciBzbiA9IGFuLnNldEF1dG9GcmVlemUuYmluZChhbik7XG52YXIgdm4gPSBhbi5zZXRVc2VQcm94aWVzLmJpbmQoYW4pO1xudmFyIHBuID0gYW4uYXBwbHlQYXRjaGVzLmJpbmQoYW4pO1xudmFyIGxuID0gYW4uY3JlYXRlRHJhZnQuYmluZChhbik7XG52YXIgZG4gPSBhbi5maW5pc2hEcmFmdC5iaW5kKGFuKTtcblxuLy8gbm9kZV9tb2R1bGVzL0BpY2Uvc3RvcmUvZXNtL3BsdWdpbnMvaW1tZXIuanNcbk4oKTtcblxuLy8gbm9kZV9tb2R1bGVzL0BpY2Uvc3RvcmUvZXNtL3BsdWdpbnMvbG9hZGluZy5qc1xudmFyIF9fYXNzaWduMyA9IGZ1bmN0aW9uKCkge1xuICBfX2Fzc2lnbjMgPSBPYmplY3QuYXNzaWduIHx8IGZ1bmN0aW9uKHQyKSB7XG4gICAgZm9yICh2YXIgczIsIGkyID0gMSwgbjIgPSBhcmd1bWVudHMubGVuZ3RoOyBpMiA8IG4yOyBpMisrKSB7XG4gICAgICBzMiA9IGFyZ3VtZW50c1tpMl07XG4gICAgICBmb3IgKHZhciBwMiBpbiBzMilcbiAgICAgICAgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChzMiwgcDIpKVxuICAgICAgICAgIHQyW3AyXSA9IHMyW3AyXTtcbiAgICB9XG4gICAgcmV0dXJuIHQyO1xuICB9O1xuICByZXR1cm4gX19hc3NpZ24zLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG59O1xudmFyIGNudFN0YXRlID0ge1xuICBnbG9iYWw6IDAsXG4gIG1vZGVsczoge30sXG4gIGVmZmVjdHM6IHt9XG59O1xudmFyIG5leHRTdGF0ZSA9IF9fYXNzaWduMyhfX2Fzc2lnbjMoe30sIGNudFN0YXRlKSwgeyBtb2RlbHM6IF9fYXNzaWduMyh7fSwgY250U3RhdGUubW9kZWxzKSwgZWZmZWN0czogX19hc3NpZ24zKHt9LCBjbnRTdGF0ZS5lZmZlY3RzKSB9KTtcblxuLy8gbm9kZV9tb2R1bGVzL0BpY2Uvc3RvcmUvZXNtL3BsdWdpbnMvZXJyb3IuanNcbnZhciBfX2Fzc2lnbjQgPSBmdW5jdGlvbigpIHtcbiAgX19hc3NpZ240ID0gT2JqZWN0LmFzc2lnbiB8fCBmdW5jdGlvbih0Mikge1xuICAgIGZvciAodmFyIHMyLCBpMiA9IDEsIG4yID0gYXJndW1lbnRzLmxlbmd0aDsgaTIgPCBuMjsgaTIrKykge1xuICAgICAgczIgPSBhcmd1bWVudHNbaTJdO1xuICAgICAgZm9yICh2YXIgcDIgaW4gczIpXG4gICAgICAgIGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwoczIsIHAyKSlcbiAgICAgICAgICB0MltwMl0gPSBzMltwMl07XG4gICAgfVxuICAgIHJldHVybiB0MjtcbiAgfTtcbiAgcmV0dXJuIF9fYXNzaWduNC5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xufTtcbnZhciBkZWZhdWx0VmFsdWUgPSB7XG4gIGVycm9yOiBudWxsLFxuICB2YWx1ZTogMFxufTtcbnZhciBjbnRTdGF0ZTIgPSB7XG4gIGdsb2JhbDogX19hc3NpZ240KHt9LCBkZWZhdWx0VmFsdWUpLFxuICBtb2RlbHM6IHt9LFxuICBlZmZlY3RzOiB7fVxufTtcbnZhciBuZXh0U3RhdGUyID0ge1xuICBnbG9iYWw6IF9fYXNzaWduNCh7fSwgY250U3RhdGUyLmdsb2JhbCksXG4gIG1vZGVsczogX19hc3NpZ240KHt9LCBjbnRTdGF0ZTIubW9kZWxzKSxcbiAgZWZmZWN0czogX19hc3NpZ240KHt9LCBjbnRTdGF0ZTIuZWZmZWN0cylcbn07XG5cbi8vIG5vZGVfbW9kdWxlcy9AaWNlL3N0b3JlL2VzbS91dGlscy9jaGVja01vZGVscy5qc1xudmFyIGltcG9ydF9sb2Rhc2ggPSBfX3RvRVNNKHJlcXVpcmVfbG9kYXNoKCkpO1xuXG4vLyBub2RlX21vZHVsZXMvQGljZS9zdG9yZS9lc20vdXRpbHMvYXBwZW5kUmVkdWNlcnMuanNcbnZhciBTRVRfU1RBVEUyID0gYWN0aW9uVHlwZXNfZGVmYXVsdC5TRVRfU1RBVEU7XG5cbi8vIG5vZGVfbW9kdWxlcy9AaWNlL3BsdWdpbi1hdXRoL2VzbS9ydW50aW1lL2luZGV4LmpzXG5pbXBvcnQgKiBhcyBSZWFjdDkgZnJvbSBcInJlYWN0XCI7XG5cbi8vIG5vZGVfbW9kdWxlcy9AaWNlL3BsdWdpbi1hdXRoL2VzbS9ydW50aW1lL0F1dGguanNcbmltcG9ydCAqIGFzIFJlYWN0OCBmcm9tIFwicmVhY3RcIjtcbmltcG9ydCB7IGNyZWF0ZUNvbnRleHQsIHVzZUNvbnRleHQgYXMgdXNlQ29udGV4dDUgfSBmcm9tIFwicmVhY3RcIjtcbnZhciBDb250ZXh0ID0gY3JlYXRlQ29udGV4dChudWxsKTtcbkNvbnRleHQuZGlzcGxheU5hbWUgPSBcIkF1dGhDb250ZXh0XCI7XG52YXIgQXV0aFByb3ZpZGVyID0gQ29udGV4dC5Qcm92aWRlcjtcblxuLy8gLmljZS9pbmRleC50c1xuZnVuY3Rpb24gZGVmaW5lUGFnZUNvbmZpZyhwYWdlQ29uZmlnNCkge1xuICByZXR1cm4gcGFnZUNvbmZpZzQ7XG59XG5cbi8vIHNyYy9wYWdlcy9mb3JtL2luZGV4LnRzeFxudmFyIHBhZ2VDb25maWcgPSBkZWZpbmVQYWdlQ29uZmlnKCgpID0+IHtcbiAgcmV0dXJuIHtcbiAgICBhdXRoOiBbXCJhZG1pblwiLCBcInVzZXJcIl1cbiAgfTtcbn0pO1xuXG4vLyBzcmMvcGFnZXMvbGlzdC9pbmRleC50c3hcbnZhciBwYWdlQ29uZmlnMiA9IGRlZmluZVBhZ2VDb25maWcoKCkgPT4ge1xuICByZXR1cm4ge1xuICAgIGF1dGg6IFtcImFkbWluXCJdXG4gIH07XG59KTtcblxuLy8gc3JjL3BhZ2VzL2luZGV4LnRzeFxudmFyIHBhZ2VDb25maWczID0gZGVmaW5lUGFnZUNvbmZpZygoKSA9PiB7XG4gIHJldHVybiB7XG4gICAgYXV0aDogW1wiYWRtaW5cIiwgXCJ1c2VyXCJdXG4gIH07XG59KTtcblxuLy8gLmljZS9yb3V0ZXMtY29uZmlnLnRzXG52YXIgcm91dGVzX2NvbmZpZ19kZWZhdWx0ID0ge1xuICBcImZvcm0vaW5kZXhcIjogcGFnZUNvbmZpZyxcbiAgXCJsaXN0L2luZGV4XCI6IHBhZ2VDb25maWcyLFxuICBcImluZGV4XCI6IHBhZ2VDb25maWczXG59O1xuZXhwb3J0IHtcbiAgcm91dGVzX2NvbmZpZ19kZWZhdWx0IGFzIGRlZmF1bHRcbn07XG4vKlxub2JqZWN0LWFzc2lnblxuKGMpIFNpbmRyZSBTb3JodXNcbkBsaWNlbnNlIE1JVFxuKi9cbi8qKiBAbGljZW5zZSBSZWFjdCB2MTYuMTMuMVxuICogcmVhY3QtaXMuZGV2ZWxvcG1lbnQuanNcbiAqXG4gKiBDb3B5cmlnaHQgKGMpIEZhY2Vib29rLCBJbmMuIGFuZCBpdHMgYWZmaWxpYXRlcy5cbiAqXG4gKiBUaGlzIHNvdXJjZSBjb2RlIGlzIGxpY2Vuc2VkIHVuZGVyIHRoZSBNSVQgbGljZW5zZSBmb3VuZCBpbiB0aGVcbiAqIExJQ0VOU0UgZmlsZSBpbiB0aGUgcm9vdCBkaXJlY3Rvcnkgb2YgdGhpcyBzb3VyY2UgdHJlZS5cbiAqL1xuLyoqIEBsaWNlbnNlIFJlYWN0IHYxNy4wLjJcbiAqIHJlYWN0LWlzLmRldmVsb3BtZW50LmpzXG4gKlxuICogQ29weXJpZ2h0IChjKSBGYWNlYm9vaywgSW5jLiBhbmQgaXRzIGFmZmlsaWF0ZXMuXG4gKlxuICogVGhpcyBzb3VyY2UgY29kZSBpcyBsaWNlbnNlZCB1bmRlciB0aGUgTUlUIGxpY2Vuc2UgZm91bmQgaW4gdGhlXG4gKiBMSUNFTlNFIGZpbGUgaW4gdGhlIHJvb3QgZGlyZWN0b3J5IG9mIHRoaXMgc291cmNlIHRyZWUuXG4gKi9cbiIsICIvKiBlc2xpbnQtZGlzYWJsZSBAdHlwZXNjcmlwdC1lc2xpbnQvY29uc2lzdGVudC10eXBlLWFzc2VydGlvbnMgKi9cbmltcG9ydCB7IFVzZXJJbmZvIH0gZnJvbSAnQC9pbnRlcmZhY2VzL3VzZXInO1xuaW1wb3J0IHsgY3JlYXRlTW9kZWwgfSBmcm9tICdpY2UnO1xuXG5pbnRlcmZhY2UgTW9kZWxTdGF0ZSB7XG4gIGN1cnJlbnRVc2VyOiBVc2VySW5mbztcbn1cblxuZXhwb3J0IGRlZmF1bHQgY3JlYXRlTW9kZWwoe1xuICBzdGF0ZToge1xuICAgIGN1cnJlbnRVc2VyOiB7fSxcbiAgfSBhcyBNb2RlbFN0YXRlLFxuICByZWR1Y2Vyczoge1xuICAgIHVwZGF0ZUN1cnJlbnRVc2VyKHByZXZTdGF0ZTogTW9kZWxTdGF0ZSwgcGF5bG9hZCkge1xuICAgICAgcHJldlN0YXRlLmN1cnJlbnRVc2VyID0gcGF5bG9hZDtcbiAgICB9LFxuICB9LFxufSk7XG4iLCAiaW1wb3J0IHsgY3JlYXRlU3RvcmUgfSBmcm9tICdpY2UnO1xuaW1wb3J0IHVzZXIgZnJvbSAnQC9tb2RlbHMvdXNlcic7XG5cbmV4cG9ydCBkZWZhdWx0IGNyZWF0ZVN0b3JlKHtcbiAgdXNlcixcbn0pO1xuIl0sCiAgIm1hcHBpbmdzIjogIjs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFHQUEsUUFBUUMsSUFBSUMsZ0JBQWdCQztBQUM1QkgsUUFBUUMsSUFBSUcsa0JBQWtCRDtBQUM5QkgsUUFBUUMsSUFBSUksMEJBQTBCRjtBQUN0Q0gsUUFBUUMsSUFBSUssd0JBQXdCSDtBQUNwQ0gsUUFBUUMsSUFBSU0sb0JBQW9CSjs7O0FDTmhDLFlBQVlLLGNBQWE7OztBQ0F6QixJQUFNLGNBQWM7QUFDcEIsSUFBTSxVQUFVLE9BQU8sRUFBRSxXQUFXLE1BQU07QUFDdEMsUUFBTSxFQUFFLFVBQVUsSUFBSTtBQUN0QixRQUFNLFdBQVcsVUFBVTtBQUMzQixRQUFNLGlCQUFpQixPQUFPLGFBQWEsYUFBYSxNQUFNLFNBQVMsSUFBSSxhQUFhLENBQUM7QUFFekYsTUFBSSxNQUFNLFFBQVEsYUFBYSxHQUFHO0FBQzlCLGtCQUFjLFFBQVEsaUJBQWU7QUFDakMsWUFBTSxlQUFlLFlBQVksZUFBZSxZ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QkFBaUJaLGdCQUFnQkMsVUFBeUIsQ0FBQSxHQUFJO0FBQ2xGLFFBQU0sRUFBRUMsY0FBY1IsYUFBYSxPQUFPRixVQUFVVyxvQkFBb0JFLGdCQUFlLElBQUtKO0FBQzVGUixnQkFBY1EsT0FBTztBQUVyQlksRUFBUUQsMEJBQWlCWixnQkFBZ0I7SUFDdkNWO0lBQ0FnQjtJQUNBQztJQUNBdkI7SUFDQXdCO0lBQ0FMO0lBQ0FYLFVBQVVBLFlBQVlMLGtCQUFpQjtJQUN2Q2U7SUFDQVI7SUFDQVc7SUFDQUk7SUFDQUMsZ0JBQWdCO01BQ2RDOztHQUVIO0FBQ0g7IiwKICAibmFtZXMiOiBbInByb2Nlc3MiLCAiZW52IiwgIklDRV9DT1JFX01PREUiLCAiX19wcm9jZXNzIiwgIklDRV9DT1JFX1JPVVRFUiIsICJJQ0VfQ09SRV9FUlJPUl9CT1VOREFSWSIsICJJQ0VfQ09SRV9JTklUSUFMX0RBVEEiLCAiSUNFX0NPUkVfREVWX1BPUlQiLCAicnVudGltZSIsICJydW50aW1lX2RlZmF1bHQiLCAic3RhdGljcyIsICJtb2R1bGUwIiwgImNvbW1vbnMiLCAibW9kdWxlMSIsICJtb2R1bGUyIiwgImRlZmluZUFwcENvbmZpZyIsICJodG1sIiwgImhlYWQiLCAibWV0YSIsICJjaGFyU2V0IiwgIm5hbWUiLCAiY29udGVudCIsICJsaW5rIiwgInJlbCIsICJocmVmIiwgInR5cGUiLCAiTWV0YSIsICJUaXRsZSIsICJMaW5rcyIsICJib2R5IiwgIk1haW4iLCAiU2NyaXB0cyIsICJwYXRoIiwgImxvYWQiLCAiY29tcG9uZW50TmFtZSIsICJpbmRleCIsICJ1bmRlZmluZWQiLCAiaWQiLCAiZXhhY3QiLCAiZXhwb3J0cyIsICJsYXlvdXQiLCAiY2hpbGRyZW4iLCAiTGluayIsICJPdXRsZXQiLCAidXNlUGFyYW1zIiwgInVzZVNlYXJjaFBhcmFtcyIsICJ1c2VMb2NhdGlvbiIsICJ1c2VOYXZpZ2F0ZSIsICJkZWZpbmVBcHBDb25maWciLCAidXNlQXBwRGF0YSIsICJ1c2VEYXRhIiwgInVzZUNvbmZpZyIsICJNZXRhIiwgIlRpdGxlIiwgIkxpbmtzIiwgIlNjcmlwdHMiLCAiRGF0YSIsICJNYWluIiwgImhpc3RvcnkiLCAiS2VlcEFsaXZlT3V0bGV0IiwgInVzZU1vdW50ZWQiLCAiQ2xpZW50T25seSIsICJkZWZpbmVEYXRhTG9hZGVyIiwgImRlZmluZVNlcnZlckRhdGFMb2FkZXIiLCAiZGVmaW5lU3RhdGljRGF0YUxvYWRlciIsICJSZWFjdDciLCAiUmVhY3Q2IiwgIlJlYWN0NCIsICJSZWFjdDIiLCAidXNlTWVtbyIsICJSZWFjdCIsICJ1c2VFZmZlY3QiLCAidXNlTGF5b3V0RWZmZWN0IiwgIlJlYWN0MyIsICJ1c2VDb250ZXh0IiwgInVzZU1lbW8yIiwgInVzZVJlZiIsICJ1c2VSZWR1Y2VyIiwgInVzZUNvbnRleHQzIiwgInVzZUNvbnRleHQyIiwgInVzZVJlZHVjZXIyIiwgInVzZVJlZjIiLCAidXNlTWVtbzMiLCAidXNlQ29udGV4dDQiLCAidXNlRGVidWdWYWx1ZSIsICJ1bnN0YWJsZV9iYXRjaGVkVXBkYXRlcyIsICJSZWFjdDUiLCAiUmVhY3Q5IiwgIlJlYWN0OCIsICJjcmVhdGVDb250ZXh0IiwgInVzZUNvbnRleHQ1IiwgIl9fY3JlYXRlIiwgIk9iamVjdCIsICJjcmVhdGUiLCAiX19kZWZQcm9wIiwgImRlZmluZVByb3BlcnR5IiwgIl9fZ2V0T3duUHJvcERlc2MiLCAiZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yIiwgIl9fZ2V0T3duUHJvcE5hbWVzIiwgImdldE93blByb3BlcnR5TmFtZXMiLCAiX19nZXRQcm90b09mIiwgImdldFByb3RvdHlwZU9mIiwgIl9faGFzT3duUHJvcCIsICJwcm90b3R5cGUiLCAiaGFzT3duUHJvcGVydHkiLCAiX19jb21tb25KUyIsICJjYiIsICJtb2QiLCAiX19yZXF1aXJlIiwgImV4cG9ydHMiLCAiX19leHBvcnQiLCAidGFyZ2V0IiwgImFsbCIsICJuYW1lIiwgImdldCIsICJlbnVtZXJhYmxlIiwgIl9fY29weVByb3BzIiwgInRvIiwgImZyb20iLCAiZXhjZXB0IiwgImRlc2MiLCAia2V5IiwgImNhbGwiLCAiX190b0VTTSIsICJpc05vZGVNb2RlIiwgIl9fZXNNb2R1bGUiLCAidmFsdWUiLCAicmVxdWlyZV9iaW5kIiwgIm1vZHVsZSIsICJiaW5kIiwgImZuMiIsICJ0aGlzQXJnIiwgIndyYXAiLCAiYXJncyIsICJBcnJheSIsICJhcmd1bWVudHMiLCAibGVuZ3RoIiwgImkyIiwgImFwcGx5IiwgInJlcXVpcmVfdXRpbHMiLCAidG9TdHJpbmciLCAia2luZE9mMiIsICJjYWNoZSIsICJ0aGluZyIsICJzdHIiLCAic2xpY2UiLCAidG9Mb3dlckNhc2UiLCAia2luZE9mVGVzdCIsICJ0eXBlIiwgImlzS2luZE9mIiwgImlzQXJyYXkiLCAidmFsIiwgImlzVW5kZWZpbmVkIiwgImlzQnVmZmVyIiwgImNvbnN0cnVjdG9yIiwgImlzQXJyYXlCdWZmZXIiLCAiaXNBcnJheUJ1ZmZlclZpZXciLCAicmVzdWx0IiwgIkFycmF5QnVmZmVyIiwgImlzVmlldyIsICJidWZmZXIiLCAiaXNTdHJpbmciLCAiaXNOdW1iZXIiLCAiaXNPYmplY3QiLCAiaXNQbGFpbk9iamVjdDMiLCAiaXNEYXRlMiIsICJpc0ZpbGUiLCAiaXNCbG9iIiwgImlzRmlsZUxpc3QiLCAiaXNGdW5jdGlvbjIiLCAiaXNTdHJlYW0iLCAicGlwZSIsICJpc0Zvcm1EYXRhIiwgInBhdHRlcm4iLCAiRm9ybURhdGEiLCAiaXNVUkxTZWFyY2hQYXJhbXMiLCAidHJpbSIsICJyZXBsYWNlIiwgImlzU3RhbmRhcmRCcm93c2VyRW52IiwgIm5hdmlnYXRvciIsICJwcm9kdWN0IiwgIndpbmRvdyIsICJkb2N1bWVudCIsICJmb3JFYWNoIiwgIm9iaiIsICJsMiIsICJtZXJnZSIsICJhc3NpZ25WYWx1ZSIsICJleHRlbmQiLCAiYTIiLCAiYjIiLCAic3RyaXBCT00iLCAiY29udGVudCIsICJjaGFyQ29kZUF0IiwgImluaGVyaXRzIiwgInN1cGVyQ29uc3RydWN0b3IiLCAicHJvcHMiLCAiZGVzY3JpcHRvcnMiLCAiYXNzaWduIiwgInRvRmxhdE9iamVjdCIsICJzb3VyY2VPYmoiLCAiZGVzdE9iaiIsICJmaWx0ZXIiLCAicHJvcCIsICJtZXJnZWQiLCAiZW5kc1dpdGgiLCAic2VhcmNoU3RyaW5nIiwgInBvc2l0aW9uIiwgIlN0cmluZyIsICJsYXN0SW5kZXgiLCAiaW5kZXhPZiIsICJ0b0FycmF5IiwgImFyciIsICJpc1R5cGVkQXJyYXkiLCAiVHlwZWRBcnJheSIsICJVaW50OEFycmF5IiwgImlzUGxhaW5PYmplY3QiLCAiaXNEYXRlIiwgImlzRnVuY3Rpb24iLCAia2luZE9mIiwgInJlcXVpcmVfYnVpbGRVUkwiLCAidXRpbHMiLCAiZW5jb2RlIiwgImVuY29kZVVSSUNvbXBvbmVudCIsICJidWlsZFVSTCIsICJ1cmwiLCAicGFyYW1zIiwgInBhcmFtc1NlcmlhbGl6ZXIiLCAic2VyaWFsaXplZFBhcmFtcyIsICJwYXJ0cyIsICJzZXJpYWxpemUiLCAicGFyc2VWYWx1ZSIsICJ2MiIsICJ0b0lTT1N0cmluZyIsICJKU09OIiwgInN0cmluZ2lmeSIsICJwdXNoIiwgImpvaW4iLCAiaGFzaG1hcmtJbmRleCIsICJyZXF1aXJlX0ludGVyY2VwdG9yTWFuYWdlciIsICJJbnRlcmNlcHRvck1hbmFnZXIiLCAiaGFuZGxlcnMiLCAidXNlIiwgImZ1bGZpbGxlZCIsICJyZWplY3RlZCIsICJvcHRpb25zIiwgInN5bmNocm9ub3VzIiwgInJ1bldoZW4iLCAiZWplY3QiLCAiaWQiLCAiZm9yRWFjaEhhbmRsZXIiLCAiaDIiLCAicmVxdWlyZV9ub3JtYWxpemVIZWFkZXJOYW1lIiwgIm5vcm1hbGl6ZUhlYWRlck5hbWUiLCAiaGVhZGVycyIsICJub3JtYWxpemVkTmFtZSIsICJwcm9jZXNzSGVhZGVyIiwgInRvVXBwZXJDYXNlIiwgInJlcXVpcmVfQXhpb3NFcnJvciIsICJBeGlvc0Vycm9yIiwgIm1lc3NhZ2UiLCAiY29kZSIsICJjb25maWciLCAicmVxdWVzdDIiLCAicmVzcG9uc2UiLCAiRXJyb3IiLCAicmVxdWVzdCIsICJ0b0pTT04iLCAiZGVzY3JpcHRpb24iLCAibnVtYmVyIiwgImZpbGVOYW1lIiwgImxpbmVOdW1iZXIiLCAiY29sdW1uTnVtYmVyIiwgInN0YWNrIiwgInN0YXR1cyIsICJkZWZpbmVQcm9wZXJ0aWVzIiwgImVycm9yIiwgImN1c3RvbVByb3BzIiwgImF4aW9zRXJyb3IiLCAicmVxdWlyZV90cmFuc2l0aW9uYWwiLCAic2lsZW50SlNPTlBhcnNpbmciLCAiZm9yY2VkSlNPTlBhcnNpbmciLCAiY2xhcmlmeVRpbWVvdXRFcnJvciIsICJyZXF1aXJlX3RvRm9ybURhdGEiLCAidG9Gb3JtRGF0YSIsICJmb3JtRGF0YSIsICJjb252ZXJ0VmFsdWUiLCAiQmxvYiIsICJCdWZmZXIiLCAiYnVpbGQiLCAiZGF0YSIsICJwYXJlbnRLZXkiLCAiZWFjaCIsICJmdWxsS2V5IiwgImVsIiwgImFwcGVuZCIsICJwb3AiLCAicmVxdWlyZV9zZXR0bGUiLCAic2V0dGxlIiwgInJlc29sdmUiLCAicmVqZWN0IiwgInZhbGlkYXRlU3RhdHVzIiwgIkVSUl9CQURfUkVRVUVTVCIsICJFUlJfQkFEX1JFU1BPTlNFIiwgIk1hdGgiLCAiZmxvb3IiLCAicmVxdWlyZV9jb29raWVzIiwgInN0YW5kYXJkQnJvd3NlckVudiIsICJ3cml0ZSIsICJleHBpcmVzIiwgInBhdGgiLCAiZG9tYWluIiwgInNlY3VyZSIsICJjb29raWUiLCAiRGF0ZSIsICJ0b0dNVFN0cmluZyIsICJyZWFkIiwgIm1hdGNoIiwgIlJlZ0V4cCIsICJkZWNvZGVVUklDb21wb25lbnQiLCAicmVtb3ZlIiwgIm5vdyIsICJub25TdGFuZGFyZEJyb3dzZXJFbnYiLCAicmVxdWlyZV9pc0Fic29sdXRlVVJMIiwgImlzQWJzb2x1dGVVUkwiLCAidGVzdCIsICJyZXF1aXJlX2NvbWJpbmVVUkxzIiwgImNvbWJpbmVVUkxzIiwgImJhc2VVUkwiLCAicmVsYXRpdmVVUkwiLCAicmVxdWlyZV9idWlsZEZ1bGxQYXRoIiwgImJ1aWxkRnVsbFBhdGgiLCAicmVxdWVzdGVkVVJMIiwgInJlcXVpcmVfcGFyc2VIZWFkZXJzIiwgImlnbm9yZUR1cGxpY2F0ZU9mIiwgInBhcnNlSGVhZGVycyIsICJwYXJzZWQiLCAic3BsaXQiLCAicGFyc2VyIiwgImxpbmUiLCAic3Vic3RyIiwgImNvbmNhdCIsICJyZXF1aXJlX2lzVVJMU2FtZU9yaWdpbiIsICJtc2llIiwgInVzZXJBZ2VudCIsICJ1cmxQYXJzaW5nTm9kZSIsICJjcmVhdGVFbGVtZW50IiwgIm9yaWdpblVSTCIsICJyZXNvbHZlVVJMIiwgImhyZWYiLCAic2V0QXR0cmlidXRlIiwgInByb3RvY29sIiwgImhvc3QiLCAic2VhcmNoIiwgImhhc2giLCAiaG9zdG5hbWUiLCAicG9ydCIsICJwYXRobmFtZSIsICJjaGFyQXQiLCAibG9jYXRpb24iLCAiaXNVUkxTYW1lT3JpZ2luIiwgInJlcXVlc3RVUkwiLCAicmVxdWlyZV9DYW5jZWxlZEVycm9yIiwgIkNhbmNlbGVkRXJyb3IiLCAiRVJSX0NBTkNFTEVEIiwgIl9fQ0FOQ0VMX18iLCAicmVxdWlyZV9wYXJzZVByb3RvY29sIiwgInBhcnNlUHJvdG9jb2wiLCAiZXhlYyIsICJyZXF1aXJlX3hociIsICJjb29raWVzIiwgInRyYW5zaXRpb25hbERlZmF1bHRzIiwgInhockFkYXB0ZXIiLCAiUHJvbWlzZSIsICJkaXNwYXRjaFhoclJlcXVlc3QiLCAicmVxdWVzdERhdGEiLCAicmVxdWVzdEhlYWRlcnMiLCAicmVzcG9uc2VUeXBlIiwgIm9uQ2FuY2VsZWQiLCAiZG9uZSIsICJjYW5jZWxUb2tlbiIsICJ1bnN1YnNjcmliZSIsICJzaWduYWwiLCAicmVtb3ZlRXZlbnRMaXN0ZW5lciIsICJYTUxIdHRwUmVxdWVzdCIsICJhdXRoIiwgInVzZXJuYW1lIiwgInBhc3N3b3JkIiwgInVuZXNjYXBlIiwgIkF1dGhvcml6YXRpb24iLCAiYnRvYSIsICJmdWxsUGF0aCIsICJvcGVuIiwgIm1ldGhvZCIsICJ0aW1lb3V0IiwgIm9ubG9hZGVuZCIsICJyZXNwb25zZUhlYWRlcnMiLCAiZ2V0QWxsUmVzcG9uc2VIZWFkZXJzIiwgInJlc3BvbnNlRGF0YSIsICJyZXNwb25zZVRleHQiLCAic3RhdHVzVGV4dCIsICJfcmVzb2x2ZSIsICJfcmVqZWN0IiwgImVyciIsICJvbnJlYWR5c3RhdGVjaGFuZ2UiLCAiaGFuZGxlTG9hZCIsICJyZWFkeVN0YXRlIiwgInJlc3BvbnNlVVJMIiwgInNldFRpbWVvdXQiLCAib25hYm9ydCIsICJoYW5kbGVBYm9ydCIsICJFQ09OTkFCT1JURUQiLCAib25lcnJvciIsICJoYW5kbGVFcnJvciIsICJFUlJfTkVUV09SSyIsICJvbnRpbWVvdXQiLCAiaGFuZGxlVGltZW91dCIsICJ0aW1lb3V0RXJyb3JNZXNzYWdlIiwgInRyYW5zaXRpb25hbCIsICJFVElNRURPVVQiLCAieHNyZlZhbHVlIiwgIndpdGhDcmVkZW50aWFscyIsICJ4c3JmQ29va2llTmFtZSIsICJ4c3JmSGVhZGVyTmFtZSIsICJzZXRSZXF1ZXN0SGVhZGVyIiwgIm9uRG93bmxvYWRQcm9ncmVzcyIsICJhZGRFdmVudExpc3RlbmVyIiwgIm9uVXBsb2FkUHJvZ3Jlc3MiLCAidXBsb2FkIiwgImNhbmNlbCIsICJhYm9ydCIsICJzdWJzY3JpYmUiLCAiYWJvcnRlZCIsICJzZW5kIiwgInJlcXVpcmVfbnVsbCIsICJyZXF1aXJlX2RlZmF1bHRzIiwgIkRFRkFVTFRfQ09OVEVOVF9UWVBFIiwgInNldENvbnRlbnRUeXBlSWZVbnNldCIsICJnZXREZWZhdWx0QWRhcHRlciIsICJhZGFwdGVyIiwgInByb2Nlc3MiLCAic3RyaW5naWZ5U2FmZWx5IiwgInJhd1ZhbHVlIiwgImVuY29kZXIiLCAicGFyc2UiLCAiZSIsICJkZWZhdWx0cyIsICJ0cmFuc2Zvcm1SZXF1ZXN0IiwgImlzT2JqZWN0UGF5bG9hZCIsICJjb250ZW50VHlwZSIsICJfRm9ybURhdGEiLCAiZW52IiwgInRyYW5zZm9ybVJlc3BvbnNlIiwgInN0cmljdEpTT05QYXJzaW5nIiwgIm1heENvbnRlbnRMZW5ndGgiLCAibWF4Qm9keUxlbmd0aCIsICJjb21tb24iLCAiZm9yRWFjaE1ldGhvZE5vRGF0YSIsICJmb3JFYWNoTWV0aG9kV2l0aERhdGEiLCAicmVxdWlyZV90cmFuc2Zvcm1EYXRhIiwgInRyYW5zZm9ybURhdGEiLCAiZm5zIiwgImNvbnRleHQiLCAidHJhbnNmb3JtIiwgInJlcXVpcmVfaXNDYW5jZWwiLCAiaXNDYW5jZWwiLCAicmVxdWlyZV9kaXNwYXRjaFJlcXVlc3QiLCAidGhyb3dJZkNhbmNlbGxhdGlvblJlcXVlc3RlZCIsICJ0aHJvd0lmUmVxdWVzdGVkIiwgImRpc3BhdGNoUmVxdWVzdCIsICJjbGVhbkhlYWRlckNvbmZpZyIsICJ0aGVuIiwgIm9uQWRhcHRlclJlc29sdXRpb24iLCAib25BZGFwdGVyUmVqZWN0aW9uIiwgInJlYXNvbiIsICJyZXF1aXJlX21lcmdlQ29uZmlnIiwgIm1lcmdlQ29uZmlnIiwgImNvbmZpZzEiLCAiY29uZmlnMiIsICJnZXRNZXJnZWRWYWx1ZSIsICJzb3VyY2UiLCAibWVyZ2VEZWVwUHJvcGVydGllcyIsICJ2YWx1ZUZyb21Db25maWcyIiwgImRlZmF1bHRUb0NvbmZpZzIiLCAibWVyZ2VEaXJlY3RLZXlzIiwgIm1lcmdlTWFwIiwgImtleXMiLCAiY29tcHV0ZUNvbmZpZ1ZhbHVlIiwgImNvbmZpZ1ZhbHVlIiwgInJlcXVpcmVfZGF0YSIsICJyZXF1aXJlX3ZhbGlkYXRvciIsICJWRVJTSU9OIiwgInZlcnNpb24iLCAidmFsaWRhdG9ycyIsICJ2YWxpZGF0b3IiLCAiZGVwcmVjYXRlZFdhcm5pbmdzIiwgImZvcm1hdE1lc3NhZ2UiLCAib3B0IiwgIm9wdHMiLCAiRVJSX0RFUFJFQ0FURUQiLCAiY29uc29sZSIsICJ3YXJuIiwgImFzc2VydE9wdGlvbnMiLCAic2NoZW1hIiwgImFsbG93VW5rbm93biIsICJFUlJfQkFEX09QVElPTl9WQUxVRSIsICJFUlJfQkFEX09QVElPTiIsICJyZXF1aXJlX0F4aW9zIiwgIkF4aW9zIiwgImluc3RhbmNlQ29uZmlnIiwgImludGVyY2VwdG9ycyIsICJjb25maWdPclVybCIsICJib29sZWFuIiwgInJlcXVlc3RJbnRlcmNlcHRvckNoYWluIiwgInN5bmNocm9ub3VzUmVxdWVzdEludGVyY2VwdG9ycyIsICJ1bnNoaWZ0UmVxdWVzdEludGVyY2VwdG9ycyIsICJpbnRlcmNlcHRvciIsICJ1bnNoaWZ0IiwgInJlc3BvbnNlSW50ZXJjZXB0b3JDaGFpbiIsICJwdXNoUmVzcG9uc2VJbnRlcmNlcHRvcnMiLCAicHJvbWlzZSIsICJjaGFpbiIsICJzaGlmdCIsICJuZXdDb25maWciLCAib25GdWxmaWxsZWQiLCAib25SZWplY3RlZCIsICJnZXRVcmkiLCAiZ2VuZXJhdGVIVFRQTWV0aG9kIiwgImlzRm9ybSIsICJodHRwTWV0aG9kIiwgInJlcXVpcmVfQ2FuY2VsVG9rZW4iLCAiQ2FuY2VsVG9rZW4iLCAiZXhlY3V0b3IiLCAiVHlwZUVycm9yIiwgInJlc29sdmVQcm9taXNlIiwgInByb21pc2VFeGVjdXRvciIsICJ0b2tlbiIsICJfbGlzdGVuZXJzIiwgIm9uZnVsZmlsbGVkIiwgImxpc3RlbmVyIiwgImluZGV4IiwgInNwbGljZSIsICJjMiIsICJyZXF1aXJlX3NwcmVhZCIsICJzcHJlYWQiLCAiY2FsbGJhY2siLCAicmVxdWlyZV9pc0F4aW9zRXJyb3IiLCAiaXNBeGlvc0Vycm9yIiwgInBheWxvYWQiLCAicmVxdWlyZV9heGlvcyIsICJjcmVhdGVJbnN0YW5jZSIsICJkZWZhdWx0Q29uZmlnIiwgImluc3RhbmNlIiwgImF4aW9zMiIsICJDYW5jZWwiLCAicHJvbWlzZXMiLCAiZGVmYXVsdCIsICJyZXF1aXJlX2F4aW9zMiIsICJyZXF1aXJlX3JlYWN0X2lzX2RldmVsb3BtZW50IiwgImhhc1N5bWJvbCIsICJTeW1ib2wiLCAiZm9yIiwgIlJFQUNUX0VMRU1FTlRfVFlQRSIsICJSRUFDVF9QT1JUQUxfVFlQRSIsICJSRUFDVF9GUkFHTUVOVF9UWVBFIiwgIlJFQUNUX1NUUklDVF9NT0RFX1RZUEUiLCAiUkVBQ1RfUFJPRklMRVJfVFlQRSIsICJSRUFDVF9QUk9WSURFUl9UWVBFIiwgIlJFQUNUX0NPTlRFWFRfVFlQRSIsICJSRUFDVF9BU1lOQ19NT0RFX1RZUEUiLCAiUkVBQ1RfQ09OQ1VSUkVOVF9NT0RFX1RZUEUiLCAiUkVBQ1RfRk9SV0FSRF9SRUZfVFlQRSIsICJSRUFDVF9TVVNQRU5TRV9UWVBFIiwgIlJFQUNUX1NVU1BFTlNFX0xJU1RfVFlQRSIsICJSRUFDVF9NRU1PX1RZUEUiLCAiUkVBQ1RfTEFaWV9UWVBFIiwgIlJFQUNUX0JMT0NLX1RZUEUiLCAiUkVBQ1RfRlVOREFNRU5UQUxfVFlQRSIsICJSRUFDVF9SRVNQT05ERVJfVFlQRSIsICJSRUFDVF9TQ09QRV9UWVBFIiwgImlzVmFsaWRFbGVtZW50VHlwZTIiLCAiJCR0eXBlb2YiLCAidHlwZU9mIiwgIm9iamVjdCIsICIkJHR5cGVvZlR5cGUiLCAiQXN5bmNNb2RlIiwgIkNvbmN1cnJlbnRNb2RlIiwgIkNvbnRleHRDb25zdW1lciIsICJDb250ZXh0UHJvdmlkZXIiLCAiRWxlbWVudCIsICJGb3J3YXJkUmVmIiwgIkZyYWdtZW50MyIsICJMYXp5IiwgIk1lbW8iLCAiUG9ydGFsIiwgIlByb2ZpbGVyIiwgIlN0cmljdE1vZGUiLCAiU3VzcGVuc2UiLCAiaGFzV2FybmVkQWJvdXREZXByZWNhdGVkSXNBc3luY01vZGUiLCAiaXNBc3luY01vZGUiLCAiaXNDb25jdXJyZW50TW9kZSIsICJpc0NvbnRleHRDb25zdW1lcjIiLCAiaXNDb250ZXh0UHJvdmlkZXIiLCAiaXNFbGVtZW50IiwgImlzRm9yd2FyZFJlZiIsICJpc0ZyYWdtZW50IiwgImlzTGF6eSIsICJpc01lbW8iLCAiaXNQb3J0YWwiLCAiaXNQcm9maWxlciIsICJpc1N0cmljdE1vZGUiLCAiaXNTdXNwZW5zZSIsICJGcmFnbWVudCIsICJpc0NvbnRleHRDb25zdW1lciIsICJpc1ZhbGlkRWxlbWVudFR5cGUiLCAicmVxdWlyZV9yZWFjdF9pcyIsICJyZXF1aXJlX29iamVjdF9hc3NpZ24iLCAiZ2V0T3duUHJvcGVydHlTeW1ib2xzIiwgInByb3BJc0VudW1lcmFibGUiLCAicHJvcGVydHlJc0VudW1lcmFibGUiLCAidG9PYmplY3QiLCAic2hvdWxkVXNlTmF0aXZlIiwgInRlc3QxIiwgInRlc3QyIiwgImZyb21DaGFyQ29kZSIsICJvcmRlcjIiLCAibWFwIiwgIm4yIiwgInRlc3QzIiwgImxldHRlciIsICJzeW1ib2xzIiwgInMyIiwgInJlcXVpcmVfUmVhY3RQcm9wVHlwZXNTZWNyZXQiLCAiUmVhY3RQcm9wVHlwZXNTZWNyZXQiLCAicmVxdWlyZV9oYXMiLCAiRnVuY3Rpb24iLCAicmVxdWlyZV9jaGVja1Byb3BUeXBlcyIsICJwcmludFdhcm5pbmciLCAibG9nZ2VkVHlwZUZhaWx1cmVzIiwgImhhcyIsICJ0ZXh0IiwgIngyIiwgImNoZWNrUHJvcFR5cGVzIiwgInR5cGVTcGVjcyIsICJ2YWx1ZXMiLCAiY29tcG9uZW50TmFtZSIsICJnZXRTdGFjayIsICJ0eXBlU3BlY05hbWUiLCAiZXgiLCAicmVzZXRXYXJuaW5nQ2FjaGUiLCAicmVxdWlyZV9mYWN0b3J5V2l0aFR5cGVDaGVja2VycyIsICJSZWFjdElzIiwgImVtcHR5RnVuY3Rpb25UaGF0UmV0dXJuc051bGwiLCAiaXNWYWxpZEVsZW1lbnQiLCAidGhyb3dPbkRpcmVjdEFjY2VzcyIsICJJVEVSQVRPUl9TWU1CT0wiLCAiaXRlcmF0b3IiLCAiRkFVWF9JVEVSQVRPUl9TWU1CT0wiLCAiZ2V0SXRlcmF0b3JGbiIsICJtYXliZUl0ZXJhYmxlIiwgIml0ZXJhdG9yRm4iLCAiQU5PTllNT1VTIiwgIlJlYWN0UHJvcFR5cGVzIiwgImFycmF5IiwgImNyZWF0ZVByaW1pdGl2ZVR5cGVDaGVja2VyIiwgImJpZ2ludCIsICJib29sIiwgImZ1bmMiLCAic3RyaW5nIiwgInN5bWJvbCIsICJhbnkiLCAiY3JlYXRlQW55VHlwZUNoZWNrZXIiLCAiYXJyYXlPZiIsICJjcmVhdGVBcnJheU9mVHlwZUNoZWNrZXIiLCAiZWxlbWVudCIsICJjcmVhdGVFbGVtZW50VHlwZUNoZWNrZXIiLCAiZWxlbWVudFR5cGUiLCAiY3JlYXRlRWxlbWVudFR5cGVUeXBlQ2hlY2tlciIsICJpbnN0YW5jZU9mIiwgImNyZWF0ZUluc3RhbmNlVHlwZUNoZWNrZXIiLCAibm9kZSIsICJjcmVhdGVOb2RlQ2hlY2tlciIsICJvYmplY3RPZiIsICJjcmVhdGVPYmplY3RPZlR5cGVDaGVja2VyIiwgIm9uZU9mIiwgImNyZWF0ZUVudW1UeXBlQ2hlY2tlciIsICJvbmVPZlR5cGUiLCAiY3JlYXRlVW5pb25UeXBlQ2hlY2tlciIsICJzaGFwZSIsICJjcmVhdGVTaGFwZVR5cGVDaGVja2VyIiwgImV4YWN0IiwgImNyZWF0ZVN0cmljdFNoYXBlVHlwZUNoZWNrZXIiLCAiaXMiLCAieTIiLCAiUHJvcFR5cGVFcnJvciIsICJjcmVhdGVDaGFpbmFibGVUeXBlQ2hlY2tlciIsICJ2YWxpZGF0ZTIiLCAibWFudWFsUHJvcFR5cGVDYWxsQ2FjaGUiLCAibWFudWFsUHJvcFR5cGVXYXJuaW5nQ291bnQiLCAiY2hlY2tUeXBlIiwgImlzUmVxdWlyZWQiLCAicHJvcE5hbWUiLCAicHJvcEZ1bGxOYW1lIiwgInNlY3JldCIsICJjYWNoZUtleSIsICJjaGFpbmVkQ2hlY2tUeXBlIiwgImV4cGVjdGVkVHlwZSIsICJwcm9wVmFsdWUiLCAicHJvcFR5cGUiLCAiZ2V0UHJvcFR5cGUiLCAicHJlY2lzZVR5cGUiLCAiZ2V0UHJlY2lzZVR5cGUiLCAidHlwZUNoZWNrZXIiLCAiZXhwZWN0ZWRDbGFzcyIsICJleHBlY3RlZENsYXNzTmFtZSIsICJhY3R1YWxDbGFzc05hbWUiLCAiZ2V0Q2xhc3NOYW1lIiwgImV4cGVjdGVkVmFsdWVzIiwgInZhbHVlc1N0cmluZyIsICJyZXBsYWNlciIsICJhcnJheU9mVHlwZUNoZWNrZXJzIiwgImNoZWNrZXIiLCAiZ2V0UG9zdGZpeEZvclR5cGVXYXJuaW5nIiwgImV4cGVjdGVkVHlwZXMiLCAiaTMiLCAiY2hlY2tlcjIiLCAiY2hlY2tlclJlc3VsdCIsICJleHBlY3RlZFR5cGVzTWVzc2FnZSIsICJpc05vZGUiLCAiaW52YWxpZFZhbGlkYXRvckVycm9yIiwgInNoYXBlVHlwZXMiLCAiYWxsS2V5cyIsICJldmVyeSIsICJzdGVwIiwgImVudHJpZXMiLCAibmV4dCIsICJlbnRyeSIsICJpc1N5bWJvbCIsICJQcm9wVHlwZXMiLCAicmVxdWlyZV9wcm9wX3R5cGVzIiwgInJlcXVpcmVfaG9pc3Rfbm9uX3JlYWN0X3N0YXRpY3NfY2pzIiwgInJlYWN0SXMiLCAiUkVBQ1RfU1RBVElDUyIsICJjaGlsZENvbnRleHRUeXBlcyIsICJjb250ZXh0VHlwZSIsICJjb250ZXh0VHlwZXMiLCAiZGVmYXVsdFByb3BzIiwgImRpc3BsYXlOYW1lIiwgImdldERlZmF1bHRQcm9wcyIsICJnZXREZXJpdmVkU3RhdGVGcm9tRXJyb3IiLCAiZ2V0RGVyaXZlZFN0YXRlRnJvbVByb3BzIiwgIm1peGlucyIsICJwcm9wVHlwZXMiLCAiS05PV05fU1RBVElDUyIsICJjYWxsZXIiLCAiY2FsbGVlIiwgImFyaXR5IiwgIkZPUldBUkRfUkVGX1NUQVRJQ1MiLCAicmVuZGVyIiwgIk1FTU9fU1RBVElDUyIsICJjb21wYXJlIiwgIlRZUEVfU1RBVElDUyIsICJnZXRTdGF0aWNzIiwgImNvbXBvbmVudCIsICJvYmplY3RQcm90b3R5cGUiLCAiaG9pc3ROb25SZWFjdFN0YXRpY3MiLCAidGFyZ2V0Q29tcG9uZW50IiwgInNvdXJjZUNvbXBvbmVudCIsICJibGFja2xpc3QiLCAiaW5oZXJpdGVkQ29tcG9uZW50IiwgInRhcmdldFN0YXRpY3MiLCAic291cmNlU3RhdGljcyIsICJkZXNjcmlwdG9yIiwgInJlcXVpcmVfcmVhY3RfaXNfZGV2ZWxvcG1lbnQyIiwgIlJFQUNUX1NFUlZFUl9CTE9DS19UWVBFIiwgIlJFQUNUX09QQVFVRV9JRF9UWVBFIiwgIlJFQUNUX0RFQlVHX1RSQUNJTkdfTU9ERV9UWVBFIiwgIlJFQUNUX09GRlNDUkVFTl9UWVBFIiwgIlJFQUNUX0xFR0FDWV9ISURERU5fVFlQRSIsICJzeW1ib2xGb3IiLCAiZW5hYmxlU2NvcGVBUEkiLCAiaGFzV2FybmVkQWJvdXREZXByZWNhdGVkSXNDb25jdXJyZW50TW9kZSIsICJyZXF1aXJlX3JlYWN0X2lzMiIsICJyZXF1aXJlX2xvZGFzaCIsICJhc3luY1RhZyIsICJmdW5jVGFnIiwgImdlblRhZyIsICJudWxsVGFnIiwgInByb3h5VGFnIiwgInVuZGVmaW5lZFRhZyIsICJmcmVlR2xvYmFsIiwgImdsb2JhbCIsICJmcmVlU2VsZiIsICJzZWxmIiwgInJvb3QiLCAib2JqZWN0UHJvdG8iLCAibmF0aXZlT2JqZWN0VG9TdHJpbmciLCAiU3ltYm9sMiIsICJzeW1Ub1N0cmluZ1RhZyIsICJ0b1N0cmluZ1RhZyIsICJiYXNlR2V0VGFnIiwgImdldFJhd1RhZyIsICJvYmplY3RUb1N0cmluZyIsICJpc093biIsICJ0YWciLCAidW5tYXNrZWQiLCAiaW1wb3J0X2F4aW9zIiwgIkRFRkFVTFRfQ09ORklHIiwgImF4aW9zSW5zdGFuY2VzIiwgImNyZWF0ZUF4aW9zSW5zdGFuY2UiLCAiaW5zdGFuY2VOYW1lIiwgImF4aW9zSW5zdGFuY2UiLCAid2l0aEZ1bGxSZXNwb25zZSIsICJ2YWxpZGF0ZSIsICJ2YWxpZGF0aW9ucyIsICJfaSIsICJ2YWxpZGF0aW9uc18xIiwgInZhbGlkYXRpb24iLCAiY29uZGl0aW9uIiwgImVycm9yTWVzc2FnZSIsICJ2YWxpZGF0ZV9kZWZhdWx0IiwgInBsdWdpbkZhY3RvcnlfZGVmYXVsdCIsICJwbHVnaW4iLCAib25TdG9yZUNyZWF0ZWQiLCAib25Nb2RlbCIsICJtaWRkbGV3YXJlIiwgIm9uSW5pdCIsICJleHBvc2VkIiwgIl9hIiwgIl9iIiwgIl9jIiwgIl9fYXdhaXRlciIsICJfYXJndW1lbnRzIiwgIlAyIiwgImdlbmVyYXRvciIsICJhZG9wdCIsICJfX2dlbmVyYXRvciIsICJib2R5IiwgIl8yIiwgImxhYmVsIiwgInNlbnQiLCAidDIiLCAidHJ5cyIsICJvcHMiLCAiZjIiLCAiZzIiLCAidmVyYiIsICJvcCIsICJkaXNwYXRjaFBsdWdpbiIsICJzdG9yZURpc3BhdGNoIiwgImFjdGlvbiIsICJzdGF0ZSIsICJzdG9yZUdldFN0YXRlIiwgImRpc3BhdGNoIiwgImNyZWF0ZURpc3BhdGNoZXIiLCAibW9kZWxOYW1lIiwgInJlZHVjZXJOYW1lIiwgIl90aGlzIiwgIm1ldGEiLCAic3RvcmUiLCAiZ2V0U3RhdGUiLCAibW9kZWwiLCAicmVkdWNlcnMiLCAiZGlzcGF0Y2hfZGVmYXVsdCIsICJfX2F3YWl0ZXIyIiwgIl9fZ2VuZXJhdG9yMiIsICJlZmZlY3RzUGx1Z2luIiwgImVmZmVjdHMiLCAiZWZmZWN0TmFtZSIsICJpc0VmZmVjdCIsICJlZmZlY3RzX2RlZmF1bHQiLCAicmVkdXhfZXhwb3J0cyIsICJfX0RPX05PVF9VU0VfX0FjdGlvblR5cGVzIiwgIkFjdGlvblR5cGVzIiwgImFwcGx5TWlkZGxld2FyZSIsICJiaW5kQWN0aW9uQ3JlYXRvcnMiLCAiY29tYmluZVJlZHVjZXJzIiwgImNvbXBvc2UiLCAiY3JlYXRlU3RvcmUiLCAibGVnYWN5X2NyZWF0ZVN0b3JlIiwgIl9kZWZpbmVQcm9wZXJ0eSIsICJjb25maWd1cmFibGUiLCAid3JpdGFibGUiLCAib3duS2V5cyIsICJlbnVtZXJhYmxlT25seSIsICJzeW0iLCAiX29iamVjdFNwcmVhZDIiLCAiZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9ycyIsICIkJG9ic2VydmFibGUiLCAib2JzZXJ2YWJsZSIsICJyYW5kb21TdHJpbmciLCAicmFuZG9tU3RyaW5nMiIsICJyYW5kb20iLCAic3Vic3RyaW5nIiwgIklOSVQiLCAiUkVQTEFDRSIsICJQUk9CRV9VTktOT1dOX0FDVElPTiIsICJwcm90byIsICJtaW5pS2luZE9mIiwgImlzRXJyb3IiLCAiY29uc3RydWN0b3JOYW1lIiwgImN0b3JOYW1lIiwgInN0YWNrVHJhY2VMaW1pdCIsICJ0b0RhdGVTdHJpbmciLCAiZ2V0RGF0ZSIsICJzZXREYXRlIiwgInR5cGVPZlZhbCIsICJyZWR1Y2VyIiwgInByZWxvYWRlZFN0YXRlIiwgImVuaGFuY2VyIiwgIl9yZWYyIiwgImZvcm1hdFByb2RFcnJvck1lc3NhZ2UiLCAiY3VycmVudFJlZHVjZXIiLCAiY3VycmVudFN0YXRlIiwgImN1cnJlbnRMaXN0ZW5lcnMiLCAibmV4dExpc3RlbmVycyIsICJpc0Rpc3BhdGNoaW5nIiwgImVuc3VyZUNhbk11dGF0ZU5leHRMaXN0ZW5lcnMiLCAiaXNTdWJzY3JpYmVkIiwgImxpc3RlbmVycyIsICJyZXBsYWNlUmVkdWNlciIsICJuZXh0UmVkdWNlciIsICJfcmVmIiwgIm91dGVyU3Vic2NyaWJlIiwgInN1YnNjcmliZTIiLCAib2JzZXJ2ZXIiLCAib2JzZXJ2ZVN0YXRlIiwgIndhcm5pbmciLCAiZ2V0VW5leHBlY3RlZFN0YXRlU2hhcGVXYXJuaW5nTWVzc2FnZSIsICJpbnB1dFN0YXRlIiwgInVuZXhwZWN0ZWRLZXlDYWNoZSIsICJyZWR1Y2VyS2V5cyIsICJhcmd1bWVudE5hbWUiLCAidW5leHBlY3RlZEtleXMiLCAiYXNzZXJ0UmVkdWNlclNoYXBlIiwgImluaXRpYWxTdGF0ZSIsICJmaW5hbFJlZHVjZXJzIiwgImZpbmFsUmVkdWNlcktleXMiLCAic2hhcGVBc3NlcnRpb25FcnJvciIsICJjb21iaW5hdGlvbiIsICJ3YXJuaW5nTWVzc2FnZSIsICJoYXNDaGFuZ2VkIiwgIm5leHRTdGF0ZTMiLCAiX2tleSIsICJwcmV2aW91c1N0YXRlRm9yS2V5IiwgIm5leHRTdGF0ZUZvcktleSIsICJhY3Rpb25UeXBlIiwgImJpbmRBY3Rpb25DcmVhdG9yIiwgImFjdGlvbkNyZWF0b3IiLCAiYWN0aW9uQ3JlYXRvcnMiLCAiYm91bmRBY3Rpb25DcmVhdG9ycyIsICJfbGVuIiwgImZ1bmNzIiwgImFyZyIsICJyZWR1Y2UiLCAibWlkZGxld2FyZXMiLCAiY3JlYXRlU3RvcmUzIiwgIl9kaXNwYXRjaCIsICJtaWRkbGV3YXJlQVBJIiwgImlzQ3J1c2hlZCIsICJpc0xpc3RlbmVyX2RlZmF1bHQiLCAiX19hc3NpZ24iLCAicDIiLCAiX19yZXN0IiwgIl9fc3ByZWFkQXJyYXlzIiwgImlsIiwgInIyIiwgImsyIiwgImoyIiwgImpsIiwgImNvbXBvc2VFbmhhbmNlcnNXaXRoRGV2dG9vbHMiLCAiZGV2dG9vbE9wdGlvbnMiLCAiZGlzYWJsZWQiLCAiX19SRURVWF9ERVZUT09MU19FWFRFTlNJT05fQ09NUE9TRV9fIiwgInJlZHV4X2RlZmF1bHQiLCAicmVkdXgiLCAibW9kZWxzIiwgImNvbWJpbmVSZWR1Y2VyczIiLCAiaW5pdGlhbFN0YXRlcyIsICJtZXJnZVJlZHVjZXJzIiwgIm5leHRSZWR1Y2VycyIsICJjcmVhdGVNb2RlbFJlZHVjZXIiLCAibW9kZWwyIiwgIm1vZGVsQmFzZVJlZHVjZXIiLCAiYmFzZVJlZHVjZXIiLCAibW9kZWxSZWR1Y2VycyIsICJfaTIiLCAiX2EyIiwgIm1vZGVsUmVkdWNlciIsICJjb21iaW5lZFJlZHVjZXIiLCAiYWN0aW9uMiIsICJtb2RlbHNfMSIsICJjcmVhdGVSb290UmVkdWNlciIsICJyb290UmVkdWNlcnMiLCAibWVyZ2VkUmVkdWNlcnMiLCAicm9vdFJlZHVjZXJBY3Rpb24iLCAicm9vdFJlZHVjZXIiLCAiZW5oYW5jZXJzIiwgIl9fYXNzaWduMiIsICJjb3JlUGx1Z2lucyIsICJJY2VzdG9yZSIsICJJY2VzdG9yZTIiLCAicGx1Z2lucyIsICJnZXRNb2RlbHMiLCAicGx1Z2luRmFjdG9yeSIsICJmb3JFYWNoUGx1Z2luIiwgImFkZE1vZGVsIiwgImluaXQiLCAiaWNlc3RvcmUiLCAicmV0dXJuZWQiLCAiaW1wb3J0X3Byb3BfdHlwZXMiLCAiUmVhY3RSZWR1eENvbnRleHQiLCAiZGVmYXVsdE5vb3BCYXRjaCIsICJiYXRjaCIsICJzZXRCYXRjaCIsICJzZXRCYXRjaDIiLCAibmV3QmF0Y2giLCAiZ2V0QmF0Y2giLCAiZ2V0QmF0Y2gyIiwgImNyZWF0ZUxpc3RlbmVyQ29sbGVjdGlvbiIsICJiYXRjaDIiLCAiZmlyc3QiLCAibGFzdCIsICJjbGVhciIsICJub3RpZnkiLCAibm90aWZ5MiIsICJnZXQyIiwgInByZXYiLCAibnVsbExpc3RlbmVycyIsICJjcmVhdGVTdWJzY3JpcHRpb24iLCAicGFyZW50U3ViIiwgImFkZE5lc3RlZFN1YiIsICJ0cnlTdWJzY3JpYmUiLCAibm90aWZ5TmVzdGVkU3VicyIsICJoYW5kbGVDaGFuZ2VXcmFwcGVyIiwgInN1YnNjcmlwdGlvbiIsICJvblN0YXRlQ2hhbmdlIiwgIkJvb2xlYW4iLCAidHJ5VW5zdWJzY3JpYmUiLCAiZ2V0TGlzdGVuZXJzIiwgInVzZUlzb21vcnBoaWNMYXlvdXRFZmZlY3QiLCAiUHJvdmlkZXIiLCAiY2hpbGRyZW4iLCAiY29udGV4dFZhbHVlIiwgInByZXZpb3VzU3RhdGUiLCAiQ29udGV4dDIiLCAiaW1wb3J0X2hvaXN0X25vbl9yZWFjdF9zdGF0aWNzIiwgImltcG9ydF9yZWFjdF9pcyIsICJyYW5kb21TdHJpbmczIiwgIkFjdGlvblR5cGVzMiIsICJTRVRfU1RBVEUiLCAiYWN0aW9uVHlwZXNfZGVmYXVsdCIsICJuIiwgIlkiLCAibzIiLCAibjMiLCAiciIsICJRIiwgInQiLCAicjMiLCAiWiIsICJMIiwgInMiLCAidiIsICJpIiwgIm8iLCAibm4iLCAidDMiLCAidSIsICJhIiwgImYiLCAic2V0IiwgImRlbGV0ZSIsICJhZGQiLCAiYyIsICJYIiwgIk1hcCIsICJxIiwgIlNldCIsICJwIiwgImwiLCAicm4iLCAiZCIsICJ5IiwgImgiLCAiZnJlZXplIiwgImlzRnJvemVuIiwgImIiLCAidG4iLCAibSIsICJfIiwgIlUiLCAiaiIsICJPIiwgImciLCAiUyIsICJ3IiwgIlAiLCAiTSIsICJ4IiwgIkgiLCAibzMiLCAiQSIsICJJIiwgImsiLCAiUiIsICJEIiwgIkYiLCAieiIsICJFIiwgIk4iLCAiVCIsICJlMiIsICJDIiwgImVuIiwgIm9uIiwgInUyIiwgIlByb3h5IiwgInJldm9jYWJsZSIsICJyZXZva2UiLCAicHJveHkiLCAiSiIsICJLIiwgInQ0IiwgImEzIiwgImYzIiwgInMzIiwgImUzIiwgIm80IiwgIm40IiwgIm1pbiIsICJHIiwgIlciLCAiQiIsICJSZWZsZWN0IiwgImRlbGV0ZVByb3BlcnR5IiwgInNldFByb3RvdHlwZU9mIiwgImlzTmFOIiwgInBhcnNlSW50IiwgInVuIiwgInByb2R1Y2UiLCAicjQiLCAicHJvZHVjZVdpdGhQYXRjaGVzIiwgImk0IiwgInI1IiwgInVzZVByb3hpZXMiLCAic2V0VXNlUHJveGllcyIsICJhdXRvRnJlZXplIiwgInNldEF1dG9GcmVlemUiLCAiY3JlYXRlRHJhZnQiLCAiZmluaXNoRHJhZnQiLCAiYXBwbHlQYXRjaGVzIiwgIiQiLCAiYW4iLCAiZm4iLCAiY24iLCAic24iLCAidm4iLCAicG4iLCAibG4iLCAiZG4iLCAiX19hc3NpZ24zIiwgImNudFN0YXRlIiwgIm5leHRTdGF0ZSIsICJfX2Fzc2lnbjQiLCAiZGVmYXVsdFZhbHVlIiwgImNudFN0YXRlMiIsICJuZXh0U3RhdGUyIiwgImltcG9ydF9sb2Rhc2giLCAiU0VUX1NUQVRFMiIsICJDb250ZXh0IiwgIkF1dGhQcm92aWRlciIsICJkZWZpbmVQYWdlQ29uZmlnIiwgInBhZ2VDb25maWc0IiwgInBhZ2VDb25maWciLCAicGFnZUNvbmZpZzIiLCAicGFnZUNvbmZpZzMiLCAicm91dGVzX2NvbmZpZ19kZWZhdWx0IiwgImNyZWF0ZU1vZGVsIiwgInN0YXRlIiwgImN1cnJlbnRVc2VyIiwgInJlZHVjZXJzIiwgInVwZGF0ZUN1cnJlbnRVc2VyIiwgInByZXZTdGF0ZSIsICJwYXlsb2FkIiwgImNyZWF0ZVN0b3JlIiwgInVzZXIiLCAicnVudGltZU1vZHVsZXMiLCAiY29tbW9ucyIsICJzdGF0aWNzIiwgImdldFJvdXRlckJhc2VuYW1lIiwgImFwcENvbmZpZyIsICJnZXRBcHBDb25maWciLCAiYXBwIiwgInJvdXRlciIsICJiYXNlbmFtZSIsICJzZXRSdW50aW1lRW52IiwgInJlbmRlck1vZGUiLCAicHJvY2VzcyIsICJlbnYiLCAiSUNFX0NPUkVfU1NHIiwgIklDRV9DT1JFX1NTUiIsICJyZW5kZXJUb0hUTUwiLCAicmVxdWVzdENvbnRleHQiLCAib3B0aW9ucyIsICJkb2N1bWVudE9ubHkiLCAic2VydmVyT25seUJhc2VuYW1lIiwgInJvdXRlUGF0aCIsICJkaXNhYmxlRmFsbGJhY2siLCAiYXNzZXRzTWFuaWZlc3QiLCAicm91dGVzIiwgIkRvY3VtZW50IiwgInJvdXRlc0NvbmZpZyIsICJydW50aW1lT3B0aW9ucyIsICJhcHBTdG9yZSIsICJyZW5kZXJUb1Jlc3BvbnNlIiwgInJ1bnRpbWUiXQp9Cg==
