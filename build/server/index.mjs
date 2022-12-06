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
} from "./chunk-W7QBZEVI.mjs";

// .ice/env.server.ts
process.env.ICE_CORE_MODE = "development";
process.env.ICE_CORE_ROUTER = "true";
process.env.ICE_CORE_ERROR_BOUNDARY = "false";
process.env.ICE_CORE_INITIAL_DATA = "true";
process.env.ICE_CORE_DEV_PORT = "3000";

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
            fileName: "/Users/mamba/workspace/mse/higress-console/src/document.tsx",
            lineNumber: 7,
            columnNumber: 9
          }, this),
          /* @__PURE__ */ _jsxDEV("meta", {
            name: "description",
            content: "ice.js 3 pro scaffold"
          }, void 0, false, {
            fileName: "/Users/mamba/workspace/mse/higress-console/src/document.tsx",
            lineNumber: 8,
            columnNumber: 9
          }, this),
          /* @__PURE__ */ _jsxDEV("link", {
            rel: "icon",
            href: "/higress.jpg",
            type: "image/x-icon"
          }, void 0, false, {
            fileName: "/Users/mamba/workspace/mse/higress-console/src/document.tsx",
            lineNumber: 9,
            columnNumber: 9
          }, this),
          /* @__PURE__ */ _jsxDEV("meta", {
            name: "viewport",
            content: "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no"
          }, void 0, false, {
            fileName: "/Users/mamba/workspace/mse/higress-console/src/document.tsx",
            lineNumber: 10,
            columnNumber: 9
          }, this),
          /* @__PURE__ */ _jsxDEV(Meta, {}, void 0, false, {
            fileName: "/Users/mamba/workspace/mse/higress-console/src/document.tsx",
            lineNumber: 11,
            columnNumber: 9
          }, this),
          /* @__PURE__ */ _jsxDEV(Title, {}, void 0, false, {
            fileName: "/Users/mamba/workspace/mse/higress-console/src/document.tsx",
            lineNumber: 12,
            columnNumber: 9
          }, this),
          /* @__PURE__ */ _jsxDEV(Links, {}, void 0, false, {
            fileName: "/Users/mamba/workspace/mse/higress-console/src/document.tsx",
            lineNumber: 13,
            columnNumber: 9
          }, this)
        ]
      }, void 0, true, {
        fileName: "/Users/mamba/workspace/mse/higress-console/src/document.tsx",
        lineNumber: 6,
        columnNumber: 7
      }, this),
      /* @__PURE__ */ _jsxDEV("body", {
        children: [
          /* @__PURE__ */ _jsxDEV(Main, {}, void 0, false, {
            fileName: "/Users/mamba/workspace/mse/higress-console/src/document.tsx",
            lineNumber: 16,
            columnNumber: 9
          }, this),
          /* @__PURE__ */ _jsxDEV(Scripts, {}, void 0, false, {
            fileName: "/Users/mamba/workspace/mse/higress-console/src/document.tsx",
            lineNumber: 17,
            columnNumber: 9
          }, this)
        ]
      }, void 0, true, {
        fileName: "/Users/mamba/workspace/mse/higress-console/src/document.tsx",
        lineNumber: 15,
        columnNumber: 7
      }, this)
    ]
  }, void 0, true, {
    fileName: "/Users/mamba/workspace/mse/higress-console/src/document.tsx",
    lineNumber: 5,
    columnNumber: 5
  }, this);
}

// asset-manifest:virtual:assets-manifest.json
var virtual_assets_manifest_default = { publicPath: "/", entries: { main: ["js/framework.js", "css/c8f226dc.css", "js/vendors-node_modules_ice_bundles_compiled_pmmmwh_react-refresh-webpack-plugin_lib_runtime_Ref-03041f.js", "css/main.css", "js/main.js"] }, pages: { layout: ["js/66153dc7.js", "js/vendors-node_modules_antd_es_index_js-node_modules_moment_dist_locale_af_js-node_modules_mome-33da60.js", "js/vendors-node_modules_ant-design_icons_es_index_js-node_modules_babel_runtime_helpers_typeof_js.js", "css/vendors-node_modules_ant-design_pro-utils_es_useEditableArray_index_js-node_modules_umijs_use-2911dc.css", "js/vendors-node_modules_ant-design_pro-utils_es_useEditableArray_index_js-node_modules_umijs_use-2911dc.js", "css/vendors-node_modules_ant-design_pro-layout_es_components_FooterToolbar_index_js-node_modules_-72b988.css", "js/vendors-node_modules_ant-design_pro-layout_es_components_FooterToolbar_index_js-node_modules_-72b988.js", "css/layout.css", "js/layout.js"], "service-source-index": ["js/66153dc7.js", "js/vendors-node_modules_antd_es_index_js-node_modules_moment_dist_locale_af_js-node_modules_mome-33da60.js", "js/vendors-node_modules_ant-design_icons_es_index_js-node_modules_babel_runtime_helpers_typeof_js.js", "css/vendors-node_modules_ant-design_pro-utils_es_useEditableArray_index_js-node_modules_umijs_use-2911dc.css", "js/vendors-node_modules_ant-design_pro-utils_es_useEditableArray_index_js-node_modules_umijs_use-2911dc.js", "js/vendors-node_modules_lodash_each_js-node_modules_lodash_merge_js-node_modules_reactcss_lib_in-0f2c29.js", "css/vendors-node_modules_ant-design_pro-form_es_index_js.css", "js/vendors-node_modules_ant-design_pro-form_es_index_js.js", "css/vendors-node_modules_ant-design_pro-layout_es_components_FooterToolbar_index_js-node_modules_-72b988.css", "js/vendors-node_modules_ant-design_pro-layout_es_components_FooterToolbar_index_js-node_modules_-72b988.js", "css/vendors-node_modules_ant-design_pro-table_es_index_js.css", "js/vendors-node_modules_ant-design_pro-table_es_index_js.js", "js/service-source-index.js"], "service-list-index": ["js/66153dc7.js", "js/vendors-node_modules_antd_es_index_js-node_modules_moment_dist_locale_af_js-node_modules_mome-33da60.js", "js/vendors-node_modules_ant-design_icons_es_index_js-node_modules_babel_runtime_helpers_typeof_js.js", "css/vendors-node_modules_ant-design_pro-utils_es_useEditableArray_index_js-node_modules_umijs_use-2911dc.css", "js/vendors-node_modules_ant-design_pro-utils_es_useEditableArray_index_js-node_modules_umijs_use-2911dc.js", "js/vendors-node_modules_lodash_each_js-node_modules_lodash_merge_js-node_modules_reactcss_lib_in-0f2c29.js", "css/vendors-node_modules_ant-design_pro-form_es_index_js.css", "js/vendors-node_modules_ant-design_pro-form_es_index_js.js", "css/vendors-node_modules_ant-design_pro-layout_es_components_FooterToolbar_index_js-node_modules_-72b988.css", "js/vendors-node_modules_ant-design_pro-layout_es_components_FooterToolbar_index_js-node_modules_-72b988.js", "js/service-list-index.js"], "success-index": ["js/vendors-node_modules_antd_es_index_js-node_modules_moment_dist_locale_af_js-node_modules_mome-33da60.js", "js/success-index.js"], "domain-index": ["js/66153dc7.js", "js/vendors-node_modules_antd_es_index_js-node_modules_moment_dist_locale_af_js-node_modules_mome-33da60.js", "js/vendors-node_modules_ant-design_icons_es_index_js-node_modules_babel_runtime_helpers_typeof_js.js", "css/vendors-node_modules_ant-design_pro-utils_es_useEditableArray_index_js-node_modules_umijs_use-2911dc.css", "js/vendors-node_modules_ant-design_pro-utils_es_useEditableArray_index_js-node_modules_umijs_use-2911dc.js", "js/vendors-node_modules_lodash_each_js-node_modules_lodash_merge_js-node_modules_reactcss_lib_in-0f2c29.js", "css/vendors-node_modules_ant-design_pro-form_es_index_js.css", "js/vendors-node_modules_ant-design_pro-form_es_index_js.js", "css/vendors-node_modules_ant-design_pro-layout_es_components_FooterToolbar_index_js-node_modules_-72b988.css", "js/vendors-node_modules_ant-design_pro-layout_es_components_FooterToolbar_index_js-node_modules_-72b988.js", "css/vendors-node_modules_ant-design_pro-table_es_index_js.css", "js/vendors-node_modules_ant-design_pro-table_es_index_js.js", "js/domain-index.js"], "router-index": ["js/66153dc7.js", "js/vendors-node_modules_antd_es_index_js-node_modules_moment_dist_locale_af_js-node_modules_mome-33da60.js", "js/vendors-node_modules_ant-design_icons_es_index_js-node_modules_babel_runtime_helpers_typeof_js.js", "css/vendors-node_modules_ant-design_pro-utils_es_useEditableArray_index_js-node_modules_umijs_use-2911dc.css", "js/vendors-node_modules_ant-design_pro-utils_es_useEditableArray_index_js-node_modules_umijs_use-2911dc.js", "js/vendors-node_modules_lodash_each_js-node_modules_lodash_merge_js-node_modules_reactcss_lib_in-0f2c29.js", "css/vendors-node_modules_ant-design_pro-form_es_index_js.css", "js/vendors-node_modules_ant-design_pro-form_es_index_js.js", "css/vendors-node_modules_ant-design_pro-layout_es_components_FooterToolbar_index_js-node_modules_-72b988.css", "js/vendors-node_modules_ant-design_pro-layout_es_components_FooterToolbar_index_js-node_modules_-72b988.js", "css/vendors-node_modules_ant-design_pro-table_es_index_js.css", "js/vendors-node_modules_ant-design_pro-table_es_index_js.js", "js/router-index.js"], "login-index": ["js/vendors-node_modules_antd_es_index_js-node_modules_moment_dist_locale_af_js-node_modules_mome-33da60.js", "js/vendors-node_modules_ant-design_icons_es_index_js-node_modules_babel_runtime_helpers_typeof_js.js", "css/vendors-node_modules_ant-design_pro-utils_es_useEditableArray_index_js-node_modules_umijs_use-2911dc.css", "js/vendors-node_modules_ant-design_pro-utils_es_useEditableArray_index_js-node_modules_umijs_use-2911dc.js", "js/vendors-node_modules_lodash_each_js-node_modules_lodash_merge_js-node_modules_reactcss_lib_in-0f2c29.js", "css/vendors-node_modules_ant-design_pro-form_es_index_js.css", "js/vendors-node_modules_ant-design_pro-form_es_index_js.js", "css/login-index.css", "js/login-index.js"], index: ["js/ff39441c.js", "js/35fc8c20.js", "js/2c796e83.js", "js/29107295.js", "js/916b1988.js", "js/b637e9a5.js", "js/vendors-node_modules_antd_es_index_js-node_modules_moment_dist_locale_af_js-node_modules_mome-33da60.js", "js/vendors-node_modules_ant-design_icons_es_index_js-node_modules_babel_runtime_helpers_typeof_js.js", "js/vendors-node_modules_lodash_each_js-node_modules_lodash_merge_js-node_modules_reactcss_lib_in-0f2c29.js", "js/vendors-node_modules_ant-design_charts_es_index_js-node_modules_l7eval5_dist_esm_index_js.js", "css/index.css", "js/index.js"], $: ["js/vendors-node_modules_antd_es_index_js-node_modules_moment_dist_locale_af_js-node_modules_mome-33da60.js", "js/$.js"] }, assets: { "src/assets/logo.png": "4fa98631" }, dataLoader: "js/data-loader.js" };

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
        path: "service-source",
        load: () => import(
          /* webpackChunkName: "service-source-index" */
          "./service-source-D3ZI6P24.mjs"
        ),
        componentName: "service-source-index",
        index: true,
        id: "service-source/index",
        exact: true,
        exports: [
          "default",
          "pageConfig"
        ]
      },
      {
        path: "service-list",
        load: () => import(
          /* webpackChunkName: "service-list-index" */
          "./service-list-WYBI623C.mjs"
        ),
        componentName: "service-list-index",
        index: true,
        id: "service-list/index",
        exact: true,
        exports: [
          "default",
          "pageConfig"
        ]
      },
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
        path: "domain",
        load: () => import(
          /* webpackChunkName: "domain-index" */
          "./domain-XRTTJMX7.mjs"
        ),
        componentName: "domain-index",
        index: true,
        id: "domain/index",
        exact: true,
        exports: [
          "default",
          "pageConfig"
        ]
      },
      {
        path: "router",
        load: () => import(
          /* webpackChunkName: "router-index" */
          "./router-H5UT46YU.mjs"
        ),
        componentName: "router-index",
        index: true,
        id: "router/index",
        exact: true,
        exports: [
          "default",
          "pageConfig"
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
        path: "",
        load: () => import(
          /* webpackChunkName: "index" */
          "./pages-XPK3T2UH.mjs"
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
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiLi4vLi4vLmljZS9Vc2Vycy9tYW1iYS93b3Jrc3BhY2UvbXNlL2hpZ3Jlc3MtY29uc29sZS8uaWNlL2Vudi5zZXJ2ZXIudHMiLCAiLi4vLi4vLmljZS9Vc2Vycy9tYW1iYS93b3Jrc3BhY2UvbXNlL2hpZ3Jlc3MtY29uc29sZS8uaWNlL2VudHJ5LnNlcnZlci50cyIsICIuLi8uLi9ub2RlX21vZHVsZXMvQGljZS9wbHVnaW4tcmVxdWVzdC9lc20vcnVudGltZS5qcyIsICIuLi8uLi8uaWNlL1VzZXJzL21hbWJhL3dvcmtzcGFjZS9tc2UvaGlncmVzcy1jb25zb2xlLy5pY2UvcnVudGltZU1vZHVsZXMudHMiLCAiLi4vLi4vc3JjL1VzZXJzL21hbWJhL3dvcmtzcGFjZS9tc2UvaGlncmVzcy1jb25zb2xlL3NyYy9hcHAudHMiLCAiLi4vLi4vc3JjL1VzZXJzL21hbWJhL3dvcmtzcGFjZS9tc2UvaGlncmVzcy1jb25zb2xlL3NyYy9kb2N1bWVudC50c3giLCAiLi4vLi4vLmljZS9Vc2Vycy9tYW1iYS93b3Jrc3BhY2UvbXNlL2hpZ3Jlc3MtY29uc29sZS8uaWNlL3JvdXRlcy50cyIsICIuLi8uLi8uaWNlL1VzZXJzL21hbWJhL3dvcmtzcGFjZS9tc2UvaGlncmVzcy1jb25zb2xlLy5pY2Uvcm91dGVzLWNvbmZpZy5idW5kbGUubWpzIiwgIi4uLy4uL3NyYy9tb2RlbHMvVXNlcnMvbWFtYmEvd29ya3NwYWNlL21zZS9oaWdyZXNzLWNvbnNvbGUvc3JjL21vZGVscy91c2VyLnRzIiwgIi4uLy4uL3NyYy9Vc2Vycy9tYW1iYS93b3Jrc3BhY2UvbXNlL2hpZ3Jlc3MtY29uc29sZS9zcmMvc3RvcmUudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbIi8vIERlZmluZSBwcm9jZXNzLmVudiBpbiB0b3AgbWFrZSBpdCBwb3NzaWJsZSB0byB1c2UgSUNFX0NPUkVfKiBpbiBAaWNlL3J1bnRpbWUsIGVzYnVpbGQgZGVmaW5lIG9wdGlvbnMgZG9lc24ndCBoYXZlIHRoZSBhYmlsaXR5XG4vLyBUaGUgcnVudGltZSB2YWx1ZSBzdWNoIGFzIF9fcHJvY2Vzcy5lbnYuSUNFX0NPUkVfKl9fIHdpbGwgYmUgcmVwbGFjZWQgYnkgZXNidWlsZCBkZWZpbmUsIHNvIHRoZSB2YWx1ZSBpcyByZWFsLXRpbWVcblxucHJvY2Vzcy5lbnYuSUNFX0NPUkVfTU9ERSA9IF9fcHJvY2Vzcy5lbnYuSUNFX0NPUkVfTU9ERV9fO1xucHJvY2Vzcy5lbnYuSUNFX0NPUkVfUk9VVEVSID0gX19wcm9jZXNzLmVudi5JQ0VfQ09SRV9ST1VURVJfXztcbnByb2Nlc3MuZW52LklDRV9DT1JFX0VSUk9SX0JPVU5EQVJZID0gX19wcm9jZXNzLmVudi5JQ0VfQ09SRV9FUlJPUl9CT1VOREFSWV9fO1xucHJvY2Vzcy5lbnYuSUNFX0NPUkVfSU5JVElBTF9EQVRBID0gX19wcm9jZXNzLmVudi5JQ0VfQ09SRV9JTklUSUFMX0RBVEFfXztcbnByb2Nlc3MuZW52LklDRV9DT1JFX0RFVl9QT1JUID0gX19wcm9jZXNzLmVudi5JQ0VfQ09SRV9ERVZfUE9SVF9fOyIsICJpbXBvcnQgJy4vZW52LnNlcnZlcic7XG5pbXBvcnQgKiBhcyBydW50aW1lIGZyb20gJ0BpY2UvcnVudGltZS9zZXJ2ZXInO1xuaW1wb3J0IHsgY29tbW9ucywgc3RhdGljcyB9IGZyb20gJy4vcnVudGltZU1vZHVsZXMnO1xuaW1wb3J0ICogYXMgYXBwIGZyb20gJ0AvYXBwJztcbmltcG9ydCBEb2N1bWVudCBmcm9tICdAL2RvY3VtZW50JztcbmltcG9ydCB0eXBlIHsgUmVuZGVyTW9kZSB9IGZyb20gJ0BpY2UvcnVudGltZSc7XG4vLyBAdHMtaWdub3JlXG5pbXBvcnQgYXNzZXRzTWFuaWZlc3QgZnJvbSAndmlydHVhbDphc3NldHMtbWFuaWZlc3QuanNvbic7XG5pbXBvcnQgcm91dGVzIGZyb20gJy4vcm91dGVzJztcbmltcG9ydCByb3V0ZXNDb25maWcgZnJvbSAnLi9yb3V0ZXMtY29uZmlnLmJ1bmRsZS5tanMnO1xuaW1wb3J0IGFwcFN0b3JlIGZyb20gJ0Avc3RvcmUnO1xuXG5jb25zdCBydW50aW1lTW9kdWxlcyA9IHsgY29tbW9ucywgc3RhdGljcyB9O1xuXG5jb25zdCBnZXRSb3V0ZXJCYXNlbmFtZSA9ICgpID0+IHtcbiAgY29uc3QgYXBwQ29uZmlnID0gcnVudGltZS5nZXRBcHBDb25maWcoYXBwKTtcbiAgcmV0dXJuIGFwcENvbmZpZz8ucm91dGVyPy5iYXNlbmFtZSA/PyAnLycgPz8gJyc7XG59XG5cbmNvbnN0IHNldFJ1bnRpbWVFbnYgPSAocmVuZGVyTW9kZSkgPT4ge1xuICBpZiAocmVuZGVyTW9kZSA9PT0gJ1NTRycpIHtcbiAgICBwcm9jZXNzLmVudi5JQ0VfQ09SRV9TU0cgPSAndHJ1ZSc7XG4gIH0gZWxzZSB7XG4gICAgcHJvY2Vzcy5lbnYuSUNFX0NPUkVfU1NSID0gJ3RydWUnO1xuICB9XG59XG5cbmludGVyZmFjZSBSZW5kZXJPcHRpb25zIHtcbiAgZG9jdW1lbnRPbmx5PzogYm9vbGVhbjtcbiAgcmVuZGVyTW9kZT86IFJlbmRlck1vZGU7XG4gIGJhc2VuYW1lPzogc3RyaW5nO1xuICBzZXJ2ZXJPbmx5QmFzZW5hbWU/OiBzdHJpbmc7XG4gIHJvdXRlUGF0aD86IHN0cmluZztcbiAgZGlzYWJsZUZhbGxiYWNrPzogYm9vbGVhbjtcbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHJlbmRlclRvSFRNTChyZXF1ZXN0Q29udGV4dCwgb3B0aW9uczogUmVuZGVyT3B0aW9ucyA9IHt9KSB7XG4gIGNvbnN0IHsgZG9jdW1lbnRPbmx5LCByZW5kZXJNb2RlID0gJ1NTUicsIGJhc2VuYW1lLCBzZXJ2ZXJPbmx5QmFzZW5hbWUsIHJvdXRlUGF0aCwgZGlzYWJsZUZhbGxiYWNrIH0gPSBvcHRpb25zO1xuICBzZXRSdW50aW1lRW52KHJlbmRlck1vZGUpO1xuXG4gIHJldHVybiBhd2FpdCBydW50aW1lLnJlbmRlclRvSFRNTChyZXF1ZXN0Q29udGV4dCwge1xuICAgIGFwcCxcbiAgICBhc3NldHNNYW5pZmVzdCxcbiAgICByb3V0ZXMsXG4gICAgcnVudGltZU1vZHVsZXMsXG4gICAgRG9jdW1lbnQsXG4gICAgc2VydmVyT25seUJhc2VuYW1lLFxuICAgIGJhc2VuYW1lOiBiYXNlbmFtZSB8fCBnZXRSb3V0ZXJCYXNlbmFtZSgpLFxuICAgIGRvY3VtZW50T25seSxcbiAgICByZW5kZXJNb2RlLFxuICAgIHJvdXRlUGF0aCxcbiAgICBkaXNhYmxlRmFsbGJhY2ssXG4gICAgcm91dGVzQ29uZmlnLFxuICAgIHJ1bnRpbWVPcHRpb25zOiB7XG4gICAgICBhcHBTdG9yZSxcbiAgICB9LFxuICB9KTtcbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHJlbmRlclRvUmVzcG9uc2UocmVxdWVzdENvbnRleHQsIG9wdGlvbnM6IFJlbmRlck9wdGlvbnMgPSB7fSkge1xuICBjb25zdCB7IGRvY3VtZW50T25seSwgcmVuZGVyTW9kZSA9ICdTU1InLCBiYXNlbmFtZSwgc2VydmVyT25seUJhc2VuYW1lLCBkaXNhYmxlRmFsbGJhY2sgfSA9IG9wdGlvbnM7XG4gIHNldFJ1bnRpbWVFbnYob3B0aW9ucyk7XG5cbiAgcnVudGltZS5yZW5kZXJUb1Jlc3BvbnNlKHJlcXVlc3RDb250ZXh0LCB7XG4gICAgYXBwLFxuICAgIGFzc2V0c01hbmlmZXN0LFxuICAgIHJvdXRlcyxcbiAgICBydW50aW1lTW9kdWxlcyxcbiAgICBEb2N1bWVudCxcbiAgICBzZXJ2ZXJPbmx5QmFzZW5hbWUsXG4gICAgYmFzZW5hbWU6IGJhc2VuYW1lIHx8IGdldFJvdXRlckJhc2VuYW1lKCksXG4gICAgZG9jdW1lbnRPbmx5LFxuICAgIHJlbmRlck1vZGUsXG4gICAgZGlzYWJsZUZhbGxiYWNrLFxuICAgIHJvdXRlc0NvbmZpZyxcbiAgICBydW50aW1lT3B0aW9uczoge1xuICAgICAgYXBwU3RvcmUsXG4gICAgfSxcbiAgfSk7XG59XG4iLCAiaW1wb3J0IHsgY3JlYXRlQXhpb3NJbnN0YW5jZSwgc2V0QXhpb3NJbnN0YW5jZSB9IGZyb20gJy4vcmVxdWVzdC5qcyc7XG5jb25zdCBFWFBPUlRfTkFNRSA9ICdyZXF1ZXN0Q29uZmlnJztcbmNvbnN0IHJ1bnRpbWUgPSBhc3luYyAoeyBhcHBDb250ZXh0IH0pID0+IHtcbiAgICBjb25zdCB7IGFwcEV4cG9ydCB9ID0gYXBwQ29udGV4dDtcbiAgICBjb25zdCBleHBvcnRlZCA9IGFwcEV4cG9ydFtFWFBPUlRfTkFNRV07XG4gICAgY29uc3QgcmVxdWVzdENvbmZpZyA9ICh0eXBlb2YgZXhwb3J0ZWQgPT09ICdmdW5jdGlvbicgPyBhd2FpdCBleHBvcnRlZCgpIDogZXhwb3J0ZWQpIHx8IHt9O1xuICAgIC8vIFN1cHBvcnQgbXVsdGkgY29uZmlncy5cbiAgICBpZiAoQXJyYXkuaXNBcnJheShyZXF1ZXN0Q29uZmlnKSkge1xuICAgICAgICByZXF1ZXN0Q29uZmlnLmZvckVhY2gocmVxdWVzdEl0ZW0gPT4ge1xuICAgICAgICAgICAgY29uc3QgaW5zdGFuY2VOYW1lID0gcmVxdWVzdEl0ZW0uaW5zdGFuY2VOYW1lID8gcmVxdWVzdEl0ZW0uaW5zdGFuY2VOYW1lIDogJ2RlZmF1bHQnO1xuICAgICAgICAgICAgaWYgKGluc3RhbmNlTmFtZSkge1xuICAgICAgICAgICAgICAgIGNvbnN0IGF4aW9zSW5zdGFuY2UgPSBjcmVhdGVBeGlvc0luc3RhbmNlKGluc3RhbmNlTmFtZSlbaW5zdGFuY2VOYW1lXTtcbiAgICAgICAgICAgICAgICBzZXRBeGlvc0luc3RhbmNlKHJlcXVlc3RJdGVtLCBheGlvc0luc3RhbmNlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgICBjb25zdCBheGlvc0luc3RhbmNlID0gY3JlYXRlQXhpb3NJbnN0YW5jZSgpLmRlZmF1bHQ7XG4gICAgICAgIHNldEF4aW9zSW5zdGFuY2UocmVxdWVzdENvbmZpZywgYXhpb3NJbnN0YW5jZSk7XG4gICAgfVxufTtcbmV4cG9ydCBkZWZhdWx0IHJ1bnRpbWU7XG4vLyMgc291cmNlTWFwcGluZ1VSTD1ydW50aW1lLmpzLm1hcCIsICJpbXBvcnQgbW9kdWxlMCBmcm9tICdAaWNlL3BsdWdpbi1yZXF1ZXN0L2VzbS9ydW50aW1lJztcbiAgICAgICAgICAgICAgICBpbXBvcnQgbW9kdWxlMSBmcm9tICdAaWNlL3BsdWdpbi1zdG9yZS9lc20vcnVudGltZSc7XG4gICAgICAgICAgICAgICAgaW1wb3J0IG1vZHVsZTIgZnJvbSAnQGljZS9wbHVnaW4tYXV0aC9lc20vcnVudGltZSc7XG4gICAgICAgICAgICAgICAgXG5leHBvcnQgY29uc3Qgc3RhdGljcyA9IFtcbiAgbW9kdWxlMCxcbl07XG5leHBvcnQgY29uc3QgY29tbW9ucyA9IFtcbiAgbW9kdWxlMSxcbiAgbW9kdWxlMixcbl07XG5cblxuIiwgImltcG9ydCB7IGRlZmluZUFwcENvbmZpZywgaGlzdG9yeSwgZGVmaW5lRGF0YUxvYWRlciB9IGZyb20gJ2ljZSc7XG5pbXBvcnQgeyBmZXRjaFVzZXJJbmZvIH0gZnJvbSAnLi9zZXJ2aWNlcy91c2VyJztcbmltcG9ydCB7IGRlZmluZUF1dGhDb25maWcgfSBmcm9tICdAaWNlL3BsdWdpbi1hdXRoL2VzbS90eXBlcyc7XG5pbXBvcnQgeyBkZWZpbmVTdG9yZUNvbmZpZyB9IGZyb20gJ0BpY2UvcGx1Z2luLXN0b3JlL2VzbS90eXBlcyc7XG5pbXBvcnQgeyBkZWZpbmVSZXF1ZXN0Q29uZmlnIH0gZnJvbSAnQGljZS9wbHVnaW4tcmVxdWVzdC9lc20vdHlwZXMnO1xuXG4vLyBBcHAgY29uZmlnLCBzZWUgaHR0cHM6Ly92My5pY2Uud29yay9kb2NzL2d1aWRlL2Jhc2ljL2FwcFxuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQXBwQ29uZmlnKCgpID0+ICh7XG4gIC8vIFNldCB5b3VyIGNvbmZpZ3MgaGVyZS5cbn0pKTtcblxuZXhwb3J0IGNvbnN0IGF1dGhDb25maWcgPSBkZWZpbmVBdXRoQ29uZmlnKGFzeW5jIChhcHBEYXRhKSA9PiB7XG4gIGNvbnN0IHsgdXNlckluZm8gPSB7fSB9ID0gYXBwRGF0YTtcbiAgcmV0dXJuIHtcbiAgICBpbml0aWFsQXV0aDoge1xuICAgICAgYWRtaW46IHVzZXJJbmZvLnVzZXJUeXBlID09PSAnYWRtaW4nLFxuICAgICAgdXNlcjogdXNlckluZm8udXNlclR5cGUgPT09ICd1c2VyJyxcbiAgICB9LFxuICB9O1xufSk7XG5cbmV4cG9ydCBjb25zdCBzdG9yZUNvbmZpZyA9IGRlZmluZVN0b3JlQ29uZmlnKGFzeW5jIChhcHBEYXRhKSA9PiB7XG4gIGNvbnN0IHsgdXNlckluZm8gPSB7fSB9ID0gYXBwRGF0YTtcbiAgcmV0dXJuIHtcbiAgICBpbml0aWFsU3RhdGVzOiB7XG4gICAgICB1c2VyOiB7XG4gICAgICAgIGN1cnJlbnRVc2VyOiB1c2VySW5mbyxcbiAgICAgIH0sXG4gICAgfSxcbiAgfTtcbn0pO1xuXG5leHBvcnQgY29uc3QgcmVxdWVzdCA9IGRlZmluZVJlcXVlc3RDb25maWcoKCkgPT4gKHtcbiAgYmFzZVVSTDogJy9hcGknLFxufSkpO1xuXG5leHBvcnQgY29uc3QgZGF0YUxvYWRlciA9IGRlZmluZURhdGFMb2FkZXIoYXN5bmMgKCkgPT4ge1xuICBjb25zdCB1c2VySW5mbyA9IGF3YWl0IGdldFVzZXJJbmZvKCk7XG4gIHJldHVybiB7XG4gICAgdXNlckluZm8sXG4gIH07XG59KTtcblxuYXN5bmMgZnVuY3Rpb24gZ2V0VXNlckluZm8oKSB7XG4gIHRyeSB7XG4gICAgY29uc3QgdXNlckluZm8gPSBhd2FpdCBmZXRjaFVzZXJJbmZvKCk7XG4gICAgcmV0dXJuIHVzZXJJbmZvO1xuICB9IGNhdGNoIChlcnJvcikge1xuICAgIGhpc3Rvcnk/LnB1c2goYC9sb2dpbj9yZWRpcmVjdD0ke3dpbmRvdy5sb2NhdGlvbi5wYXRobmFtZX1gKTtcbiAgfVxuICByZXR1cm4gdW5kZWZpbmVkO1xufVxuIiwgImltcG9ydCB7IE1ldGEsIFRpdGxlLCBMaW5rcywgTWFpbiwgU2NyaXB0cyB9IGZyb20gJ2ljZSc7XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIERvY3VtZW50KCkge1xuICByZXR1cm4gKFxuICAgIDxodG1sPlxuICAgICAgPGhlYWQ+XG4gICAgICAgIDxtZXRhIGNoYXJTZXQ9XCJ1dGYtOFwiIC8+XG4gICAgICAgIDxtZXRhIG5hbWU9XCJkZXNjcmlwdGlvblwiIGNvbnRlbnQ9XCJpY2UuanMgMyBwcm8gc2NhZmZvbGRcIiAvPlxuICAgICAgICA8bGluayByZWw9XCJpY29uXCIgaHJlZj1cIi9oaWdyZXNzLmpwZ1wiIHR5cGU9XCJpbWFnZS94LWljb25cIiAvPlxuICAgICAgICA8bWV0YSBuYW1lPVwidmlld3BvcnRcIiBjb250ZW50PVwid2lkdGg9ZGV2aWNlLXdpZHRoLCBpbml0aWFsLXNjYWxlPTEsIG1heGltdW0tc2NhbGU9MSwgdXNlci1zY2FsYWJsZT1ub1wiIC8+XG4gICAgICAgIDxNZXRhIC8+XG4gICAgICAgIDxUaXRsZSAvPlxuICAgICAgICA8TGlua3MgLz5cbiAgICAgIDwvaGVhZD5cbiAgICAgIDxib2R5PlxuICAgICAgICA8TWFpbiAvPlxuICAgICAgICA8U2NyaXB0cyAvPlxuICAgICAgPC9ib2R5PlxuICAgIDwvaHRtbD5cbiAgKTtcbn1cbiIsICJleHBvcnQgZGVmYXVsdCBbXG4gIHtcbiAgICBwYXRoOiAnJyxcbiAgICBsb2FkOiAoKSA9PiBpbXBvcnQoLyogd2VicGFja0NodW5rTmFtZTogXCJsYXlvdXRcIiAqLyAnQC9wYWdlcy9sYXlvdXQnKSxcbiAgICBjb21wb25lbnROYW1lOiAnbGF5b3V0JyxcbiAgICBpbmRleDogdW5kZWZpbmVkLFxuICAgIGlkOiAnbGF5b3V0JyxcbiAgICBleGFjdDogdHJ1ZSxcbiAgICBleHBvcnRzOiBbXCJkZWZhdWx0XCJdLFxuICAgIGxheW91dDogdHJ1ZSxcbiAgICBjaGlsZHJlbjogW3tcbiAgICAgIHBhdGg6ICdzZXJ2aWNlLXNvdXJjZScsXG4gICAgICBsb2FkOiAoKSA9PiBpbXBvcnQoLyogd2VicGFja0NodW5rTmFtZTogXCJzZXJ2aWNlLXNvdXJjZS1pbmRleFwiICovICdAL3BhZ2VzL3NlcnZpY2Utc291cmNlL2luZGV4JyksXG4gICAgICBjb21wb25lbnROYW1lOiAnc2VydmljZS1zb3VyY2UtaW5kZXgnLFxuICAgICAgaW5kZXg6IHRydWUsXG4gICAgICBpZDogJ3NlcnZpY2Utc291cmNlL2luZGV4JyxcbiAgICAgIGV4YWN0OiB0cnVlLFxuICAgICAgZXhwb3J0czogW1wiZGVmYXVsdFwiLFwicGFnZUNvbmZpZ1wiXSxcbiAgICB9LHtcbiAgICAgIHBhdGg6ICdzZXJ2aWNlLWxpc3QnLFxuICAgICAgbG9hZDogKCkgPT4gaW1wb3J0KC8qIHdlYnBhY2tDaHVua05hbWU6IFwic2VydmljZS1saXN0LWluZGV4XCIgKi8gJ0AvcGFnZXMvc2VydmljZS1saXN0L2luZGV4JyksXG4gICAgICBjb21wb25lbnROYW1lOiAnc2VydmljZS1saXN0LWluZGV4JyxcbiAgICAgIGluZGV4OiB0cnVlLFxuICAgICAgaWQ6ICdzZXJ2aWNlLWxpc3QvaW5kZXgnLFxuICAgICAgZXhhY3Q6IHRydWUsXG4gICAgICBleHBvcnRzOiBbXCJkZWZhdWx0XCIsXCJwYWdlQ29uZmlnXCJdLFxuICAgIH0se1xuICAgICAgcGF0aDogJ3N1Y2Nlc3MnLFxuICAgICAgbG9hZDogKCkgPT4gaW1wb3J0KC8qIHdlYnBhY2tDaHVua05hbWU6IFwic3VjY2Vzcy1pbmRleFwiICovICdAL3BhZ2VzL3N1Y2Nlc3MvaW5kZXgnKSxcbiAgICAgIGNvbXBvbmVudE5hbWU6ICdzdWNjZXNzLWluZGV4JyxcbiAgICAgIGluZGV4OiB0cnVlLFxuICAgICAgaWQ6ICdzdWNjZXNzL2luZGV4JyxcbiAgICAgIGV4YWN0OiB0cnVlLFxuICAgICAgZXhwb3J0czogW1wiZGVmYXVsdFwiXSxcbiAgICB9LHtcbiAgICAgIHBhdGg6ICdkb21haW4nLFxuICAgICAgbG9hZDogKCkgPT4gaW1wb3J0KC8qIHdlYnBhY2tDaHVua05hbWU6IFwiZG9tYWluLWluZGV4XCIgKi8gJ0AvcGFnZXMvZG9tYWluL2luZGV4JyksXG4gICAgICBjb21wb25lbnROYW1lOiAnZG9tYWluLWluZGV4JyxcbiAgICAgIGluZGV4OiB0cnVlLFxuICAgICAgaWQ6ICdkb21haW4vaW5kZXgnLFxuICAgICAgZXhhY3Q6IHRydWUsXG4gICAgICBleHBvcnRzOiBbXCJkZWZhdWx0XCIsXCJwYWdlQ29uZmlnXCJdLFxuICAgIH0se1xuICAgICAgcGF0aDogJ3JvdXRlcicsXG4gICAgICBsb2FkOiAoKSA9PiBpbXBvcnQoLyogd2VicGFja0NodW5rTmFtZTogXCJyb3V0ZXItaW5kZXhcIiAqLyAnQC9wYWdlcy9yb3V0ZXIvaW5kZXgnKSxcbiAgICAgIGNvbXBvbmVudE5hbWU6ICdyb3V0ZXItaW5kZXgnLFxuICAgICAgaW5kZXg6IHRydWUsXG4gICAgICBpZDogJ3JvdXRlci9pbmRleCcsXG4gICAgICBleGFjdDogdHJ1ZSxcbiAgICAgIGV4cG9ydHM6IFtcImRlZmF1bHRcIixcInBhZ2VDb25maWdcIl0sXG4gICAgfSx7XG4gICAgICBwYXRoOiAnbG9naW4nLFxuICAgICAgbG9hZDogKCkgPT4gaW1wb3J0KC8qIHdlYnBhY2tDaHVua05hbWU6IFwibG9naW4taW5kZXhcIiAqLyAnQC9wYWdlcy9sb2dpbi9pbmRleCcpLFxuICAgICAgY29tcG9uZW50TmFtZTogJ2xvZ2luLWluZGV4JyxcbiAgICAgIGluZGV4OiB0cnVlLFxuICAgICAgaWQ6ICdsb2dpbi9pbmRleCcsXG4gICAgICBleGFjdDogdHJ1ZSxcbiAgICAgIGV4cG9ydHM6IFtcImRlZmF1bHRcIixcImdldENvbmZpZ1wiXSxcbiAgICB9LHtcbiAgICAgIHBhdGg6ICcnLFxuICAgICAgbG9hZDogKCkgPT4gaW1wb3J0KC8qIHdlYnBhY2tDaHVua05hbWU6IFwiaW5kZXhcIiAqLyAnQC9wYWdlcy9pbmRleCcpLFxuICAgICAgY29tcG9uZW50TmFtZTogJ2luZGV4JyxcbiAgICAgIGluZGV4OiB0cnVlLFxuICAgICAgaWQ6ICdpbmRleCcsXG4gICAgICBleGFjdDogdHJ1ZSxcbiAgICAgIGV4cG9ydHM6IFtcImRlZmF1bHRcIixcInBhZ2VDb25maWdcIl0sXG4gICAgfSx7XG4gICAgICBwYXRoOiAnKicsXG4gICAgICBsb2FkOiAoKSA9PiBpbXBvcnQoLyogd2VicGFja0NodW5rTmFtZTogXCIkXCIgKi8gJ0AvcGFnZXMvJCcpLFxuICAgICAgY29tcG9uZW50TmFtZTogJyQnLFxuICAgICAgaW5kZXg6IHVuZGVmaW5lZCxcbiAgICAgIGlkOiAnJCcsXG4gICAgICBleGFjdDogdHJ1ZSxcbiAgICAgIGV4cG9ydHM6IFtcImRlZmF1bHRcIl0sXG4gICAgfSxdXG4gIH0sXG5dO1xuIiwgInZhciBfX2NyZWF0ZSA9IE9iamVjdC5jcmVhdGU7XG52YXIgX19kZWZQcm9wID0gT2JqZWN0LmRlZmluZVByb3BlcnR5O1xudmFyIF9fZ2V0T3duUHJvcERlc2MgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yO1xudmFyIF9fZ2V0T3duUHJvcE5hbWVzID0gT2JqZWN0LmdldE93blByb3BlcnR5TmFtZXM7XG52YXIgX19nZXRQcm90b09mID0gT2JqZWN0LmdldFByb3RvdHlwZU9mO1xudmFyIF9faGFzT3duUHJvcCA9IE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHk7XG52YXIgX19jb21tb25KUyA9IChjYiwgbW9kKSA9PiBmdW5jdGlvbiBfX3JlcXVpcmUoKSB7XG4gIHJldHVybiBtb2QgfHwgKDAsIGNiW19fZ2V0T3duUHJvcE5hbWVzKGNiKVswXV0pKChtb2QgPSB7IGV4cG9ydHM6IHt9IH0pLmV4cG9ydHMsIG1vZCksIG1vZC5leHBvcnRzO1xufTtcbnZhciBfX2V4cG9ydCA9ICh0YXJnZXQsIGFsbCkgPT4ge1xuICBmb3IgKHZhciBuYW1lIGluIGFsbClcbiAgICBfX2RlZlByb3AodGFyZ2V0LCBuYW1lLCB7IGdldDogYWxsW25hbWVdLCBlbnVtZXJhYmxlOiB0cnVlIH0pO1xufTtcbnZhciBfX2NvcHlQcm9wcyA9ICh0bywgZnJvbSwgZXhjZXB0LCBkZXNjKSA9PiB7XG4gIGlmIChmcm9tICYmIHR5cGVvZiBmcm9tID09PSBcIm9iamVjdFwiIHx8IHR5cGVvZiBmcm9tID09PSBcImZ1bmN0aW9uXCIpIHtcbiAgICBmb3IgKGxldCBrZXkgb2YgX19nZXRPd25Qcm9wTmFtZXMoZnJvbSkpXG4gICAgICBpZiAoIV9faGFzT3duUHJvcC5jYWxsKHRvLCBrZXkpICYmIGtleSAhPT0gZXhjZXB0KVxuICAgICAgICBfX2RlZlByb3AodG8sIGtleSwgeyBnZXQ6ICgpID0+IGZyb21ba2V5XSwgZW51bWVyYWJsZTogIShkZXNjID0gX19nZXRPd25Qcm9wRGVzYyhmcm9tLCBrZXkpKSB8fCBkZXNjLmVudW1lcmFibGUgfSk7XG4gIH1cbiAgcmV0dXJuIHRvO1xufTtcbnZhciBfX3RvRVNNID0gKG1vZCwgaXNOb2RlTW9kZSwgdGFyZ2V0KSA9PiAodGFyZ2V0ID0gbW9kICE9IG51bGwgPyBfX2NyZWF0ZShfX2dldFByb3RvT2YobW9kKSkgOiB7fSwgX19jb3B5UHJvcHMoXG4gIGlzTm9kZU1vZGUgfHwgIW1vZCB8fCAhbW9kLl9fZXNNb2R1bGUgPyBfX2RlZlByb3AodGFyZ2V0LCBcImRlZmF1bHRcIiwgeyB2YWx1ZTogbW9kLCBlbnVtZXJhYmxlOiB0cnVlIH0pIDogdGFyZ2V0LFxuICBtb2RcbikpO1xuXG4vLyBub2RlX21vZHVsZXMvYXhpb3MvbGliL2hlbHBlcnMvYmluZC5qc1xudmFyIHJlcXVpcmVfYmluZCA9IF9fY29tbW9uSlMoe1xuICBcIm5vZGVfbW9kdWxlcy9heGlvcy9saWIvaGVscGVycy9iaW5kLmpzXCIoZXhwb3J0cywgbW9kdWxlKSB7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG4gICAgbW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBiaW5kKGZuMiwgdGhpc0FyZykge1xuICAgICAgcmV0dXJuIGZ1bmN0aW9uIHdyYXAoKSB7XG4gICAgICAgIHZhciBhcmdzID0gbmV3IEFycmF5KGFyZ3VtZW50cy5sZW5ndGgpO1xuICAgICAgICBmb3IgKHZhciBpMiA9IDA7IGkyIDwgYXJncy5sZW5ndGg7IGkyKyspIHtcbiAgICAgICAgICBhcmdzW2kyXSA9IGFyZ3VtZW50c1tpMl07XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGZuMi5hcHBseSh0aGlzQXJnLCBhcmdzKTtcbiAgICAgIH07XG4gICAgfTtcbiAgfVxufSk7XG5cbi8vIG5vZGVfbW9kdWxlcy9heGlvcy9saWIvdXRpbHMuanNcbnZhciByZXF1aXJlX3V0aWxzID0gX19jb21tb25KUyh7XG4gIFwibm9kZV9tb2R1bGVzL2F4aW9zL2xpYi91dGlscy5qc1wiKGV4cG9ydHMsIG1vZHVsZSkge1xuICAgIFwidXNlIHN0cmljdFwiO1xuICAgIHZhciBiaW5kID0gcmVxdWlyZV9iaW5kKCk7XG4gICAgdmFyIHRvU3RyaW5nID0gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZztcbiAgICB2YXIga2luZE9mMiA9IGZ1bmN0aW9uKGNhY2hlKSB7XG4gICAgICByZXR1cm4gZnVuY3Rpb24odGhpbmcpIHtcbiAgICAgICAgdmFyIHN0ciA9IHRvU3RyaW5nLmNhbGwodGhpbmcpO1xuICAgICAgICByZXR1cm4gY2FjaGVbc3RyXSB8fCAoY2FjaGVbc3RyXSA9IHN0ci5zbGljZSg4LCAtMSkudG9Mb3dlckNhc2UoKSk7XG4gICAgICB9O1xuICAgIH0oLyogQF9fUFVSRV9fICovIE9iamVjdC5jcmVhdGUobnVsbCkpO1xuICAgIGZ1bmN0aW9uIGtpbmRPZlRlc3QodHlwZSkge1xuICAgICAgdHlwZSA9IHR5cGUudG9Mb3dlckNhc2UoKTtcbiAgICAgIHJldHVybiBmdW5jdGlvbiBpc0tpbmRPZih0aGluZykge1xuICAgICAgICByZXR1cm4ga2luZE9mMih0aGluZykgPT09IHR5cGU7XG4gICAgICB9O1xuICAgIH1cbiAgICBmdW5jdGlvbiBpc0FycmF5KHZhbCkge1xuICAgICAgcmV0dXJuIEFycmF5LmlzQXJyYXkodmFsKTtcbiAgICB9XG4gICAgZnVuY3Rpb24gaXNVbmRlZmluZWQodmFsKSB7XG4gICAgICByZXR1cm4gdHlwZW9mIHZhbCA9PT0gXCJ1bmRlZmluZWRcIjtcbiAgICB9XG4gICAgZnVuY3Rpb24gaXNCdWZmZXIodmFsKSB7XG4gICAgICByZXR1cm4gdmFsICE9PSBudWxsICYmICFpc1VuZGVmaW5lZCh2YWwpICYmIHZhbC5jb25zdHJ1Y3RvciAhPT0gbnVsbCAmJiAhaXNVbmRlZmluZWQodmFsLmNvbnN0cnVjdG9yKSAmJiB0eXBlb2YgdmFsLmNvbnN0cnVjdG9yLmlzQnVmZmVyID09PSBcImZ1bmN0aW9uXCIgJiYgdmFsLmNvbnN0cnVjdG9yLmlzQnVmZmVyKHZhbCk7XG4gICAgfVxuICAgIHZhciBpc0FycmF5QnVmZmVyID0ga2luZE9mVGVzdChcIkFycmF5QnVmZmVyXCIpO1xuICAgIGZ1bmN0aW9uIGlzQXJyYXlCdWZmZXJWaWV3KHZhbCkge1xuICAgICAgdmFyIHJlc3VsdDtcbiAgICAgIGlmICh0eXBlb2YgQXJyYXlCdWZmZXIgIT09IFwidW5kZWZpbmVkXCIgJiYgQXJyYXlCdWZmZXIuaXNWaWV3KSB7XG4gICAgICAgIHJlc3VsdCA9IEFycmF5QnVmZmVyLmlzVmlldyh2YWwpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmVzdWx0ID0gdmFsICYmIHZhbC5idWZmZXIgJiYgaXNBcnJheUJ1ZmZlcih2YWwuYnVmZmVyKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfVxuICAgIGZ1bmN0aW9uIGlzU3RyaW5nKHZhbCkge1xuICAgICAgcmV0dXJuIHR5cGVvZiB2YWwgPT09IFwic3RyaW5nXCI7XG4gICAgfVxuICAgIGZ1bmN0aW9uIGlzTnVtYmVyKHZhbCkge1xuICAgICAgcmV0dXJuIHR5cGVvZiB2YWwgPT09IFwibnVtYmVyXCI7XG4gICAgfVxuICAgIGZ1bmN0aW9uIGlzT2JqZWN0KHZhbCkge1xuICAgICAgcmV0dXJuIHZhbCAhPT0gbnVsbCAmJiB0eXBlb2YgdmFsID09PSBcIm9iamVjdFwiO1xuICAgIH1cbiAgICBmdW5jdGlvbiBpc1BsYWluT2JqZWN0Myh2YWwpIHtcbiAgICAgIGlmIChraW5kT2YyKHZhbCkgIT09IFwib2JqZWN0XCIpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuICAgICAgdmFyIHByb3RvdHlwZSA9IE9iamVjdC5nZXRQcm90b3R5cGVPZih2YWwpO1xuICAgICAgcmV0dXJuIHByb3RvdHlwZSA9PT0gbnVsbCB8fCBwcm90b3R5cGUgPT09IE9iamVjdC5wcm90b3R5cGU7XG4gICAgfVxuICAgIHZhciBpc0RhdGUyID0ga2luZE9mVGVzdChcIkRhdGVcIik7XG4gICAgdmFyIGlzRmlsZSA9IGtpbmRPZlRlc3QoXCJGaWxlXCIpO1xuICAgIHZhciBpc0Jsb2IgPSBraW5kT2ZUZXN0KFwiQmxvYlwiKTtcbiAgICB2YXIgaXNGaWxlTGlzdCA9IGtpbmRPZlRlc3QoXCJGaWxlTGlzdFwiKTtcbiAgICBmdW5jdGlvbiBpc0Z1bmN0aW9uMih2YWwpIHtcbiAgICAgIHJldHVybiB0b1N0cmluZy5jYWxsKHZhbCkgPT09IFwiW29iamVjdCBGdW5jdGlvbl1cIjtcbiAgICB9XG4gICAgZnVuY3Rpb24gaXNTdHJlYW0odmFsKSB7XG4gICAgICByZXR1cm4gaXNPYmplY3QodmFsKSAmJiBpc0Z1bmN0aW9uMih2YWwucGlwZSk7XG4gICAgfVxuICAgIGZ1bmN0aW9uIGlzRm9ybURhdGEodGhpbmcpIHtcbiAgICAgIHZhciBwYXR0ZXJuID0gXCJbb2JqZWN0IEZvcm1EYXRhXVwiO1xuICAgICAgcmV0dXJuIHRoaW5nICYmICh0eXBlb2YgRm9ybURhdGEgPT09IFwiZnVuY3Rpb25cIiAmJiB0aGluZyBpbnN0YW5jZW9mIEZvcm1EYXRhIHx8IHRvU3RyaW5nLmNhbGwodGhpbmcpID09PSBwYXR0ZXJuIHx8IGlzRnVuY3Rpb24yKHRoaW5nLnRvU3RyaW5nKSAmJiB0aGluZy50b1N0cmluZygpID09PSBwYXR0ZXJuKTtcbiAgICB9XG4gICAgdmFyIGlzVVJMU2VhcmNoUGFyYW1zID0ga2luZE9mVGVzdChcIlVSTFNlYXJjaFBhcmFtc1wiKTtcbiAgICBmdW5jdGlvbiB0cmltKHN0cikge1xuICAgICAgcmV0dXJuIHN0ci50cmltID8gc3RyLnRyaW0oKSA6IHN0ci5yZXBsYWNlKC9eXFxzK3xcXHMrJC9nLCBcIlwiKTtcbiAgICB9XG4gICAgZnVuY3Rpb24gaXNTdGFuZGFyZEJyb3dzZXJFbnYoKSB7XG4gICAgICBpZiAodHlwZW9mIG5hdmlnYXRvciAhPT0gXCJ1bmRlZmluZWRcIiAmJiAobmF2aWdhdG9yLnByb2R1Y3QgPT09IFwiUmVhY3ROYXRpdmVcIiB8fCBuYXZpZ2F0b3IucHJvZHVjdCA9PT0gXCJOYXRpdmVTY3JpcHRcIiB8fCBuYXZpZ2F0b3IucHJvZHVjdCA9PT0gXCJOU1wiKSkge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG4gICAgICByZXR1cm4gdHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIiAmJiB0eXBlb2YgZG9jdW1lbnQgIT09IFwidW5kZWZpbmVkXCI7XG4gICAgfVxuICAgIGZ1bmN0aW9uIGZvckVhY2gob2JqLCBmbjIpIHtcbiAgICAgIGlmIChvYmogPT09IG51bGwgfHwgdHlwZW9mIG9iaiA9PT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICBpZiAodHlwZW9mIG9iaiAhPT0gXCJvYmplY3RcIikge1xuICAgICAgICBvYmogPSBbb2JqXTtcbiAgICAgIH1cbiAgICAgIGlmIChpc0FycmF5KG9iaikpIHtcbiAgICAgICAgZm9yICh2YXIgaTIgPSAwLCBsMiA9IG9iai5sZW5ndGg7IGkyIDwgbDI7IGkyKyspIHtcbiAgICAgICAgICBmbjIuY2FsbChudWxsLCBvYmpbaTJdLCBpMiwgb2JqKTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgZm9yICh2YXIga2V5IGluIG9iaikge1xuICAgICAgICAgIGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBrZXkpKSB7XG4gICAgICAgICAgICBmbjIuY2FsbChudWxsLCBvYmpba2V5XSwga2V5LCBvYmopO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICBmdW5jdGlvbiBtZXJnZSgpIHtcbiAgICAgIHZhciByZXN1bHQgPSB7fTtcbiAgICAgIGZ1bmN0aW9uIGFzc2lnblZhbHVlKHZhbCwga2V5KSB7XG4gICAgICAgIGlmIChpc1BsYWluT2JqZWN0MyhyZXN1bHRba2V5XSkgJiYgaXNQbGFpbk9iamVjdDModmFsKSkge1xuICAgICAgICAgIHJlc3VsdFtrZXldID0gbWVyZ2UocmVzdWx0W2tleV0sIHZhbCk7XG4gICAgICAgIH0gZWxzZSBpZiAoaXNQbGFpbk9iamVjdDModmFsKSkge1xuICAgICAgICAgIHJlc3VsdFtrZXldID0gbWVyZ2Uoe30sIHZhbCk7XG4gICAgICAgIH0gZWxzZSBpZiAoaXNBcnJheSh2YWwpKSB7XG4gICAgICAgICAgcmVzdWx0W2tleV0gPSB2YWwuc2xpY2UoKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZXN1bHRba2V5XSA9IHZhbDtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgZm9yICh2YXIgaTIgPSAwLCBsMiA9IGFyZ3VtZW50cy5sZW5ndGg7IGkyIDwgbDI7IGkyKyspIHtcbiAgICAgICAgZm9yRWFjaChhcmd1bWVudHNbaTJdLCBhc3NpZ25WYWx1ZSk7XG4gICAgICB9XG4gICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH1cbiAgICBmdW5jdGlvbiBleHRlbmQoYTIsIGIyLCB0aGlzQXJnKSB7XG4gICAgICBmb3JFYWNoKGIyLCBmdW5jdGlvbiBhc3NpZ25WYWx1ZSh2YWwsIGtleSkge1xuICAgICAgICBpZiAodGhpc0FyZyAmJiB0eXBlb2YgdmFsID09PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgICAgICBhMltrZXldID0gYmluZCh2YWwsIHRoaXNBcmcpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGEyW2tleV0gPSB2YWw7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgICAgcmV0dXJuIGEyO1xuICAgIH1cbiAgICBmdW5jdGlvbiBzdHJpcEJPTShjb250ZW50KSB7XG4gICAgICBpZiAoY29udGVudC5jaGFyQ29kZUF0KDApID09PSA2NTI3OSkge1xuICAgICAgICBjb250ZW50ID0gY29udGVudC5zbGljZSgxKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBjb250ZW50O1xuICAgIH1cbiAgICBmdW5jdGlvbiBpbmhlcml0cyhjb25zdHJ1Y3Rvciwgc3VwZXJDb25zdHJ1Y3RvciwgcHJvcHMsIGRlc2NyaXB0b3JzKSB7XG4gICAgICBjb25zdHJ1Y3Rvci5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKHN1cGVyQ29uc3RydWN0b3IucHJvdG90eXBlLCBkZXNjcmlwdG9ycyk7XG4gICAgICBjb25zdHJ1Y3Rvci5wcm90b3R5cGUuY29uc3RydWN0b3IgPSBjb25zdHJ1Y3RvcjtcbiAgICAgIHByb3BzICYmIE9iamVjdC5hc3NpZ24oY29uc3RydWN0b3IucHJvdG90eXBlLCBwcm9wcyk7XG4gICAgfVxuICAgIGZ1bmN0aW9uIHRvRmxhdE9iamVjdChzb3VyY2VPYmosIGRlc3RPYmosIGZpbHRlcikge1xuICAgICAgdmFyIHByb3BzO1xuICAgICAgdmFyIGkyO1xuICAgICAgdmFyIHByb3A7XG4gICAgICB2YXIgbWVyZ2VkID0ge307XG4gICAgICBkZXN0T2JqID0gZGVzdE9iaiB8fCB7fTtcbiAgICAgIGRvIHtcbiAgICAgICAgcHJvcHMgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcyhzb3VyY2VPYmopO1xuICAgICAgICBpMiA9IHByb3BzLmxlbmd0aDtcbiAgICAgICAgd2hpbGUgKGkyLS0gPiAwKSB7XG4gICAgICAgICAgcHJvcCA9IHByb3BzW2kyXTtcbiAgICAgICAgICBpZiAoIW1lcmdlZFtwcm9wXSkge1xuICAgICAgICAgICAgZGVzdE9ialtwcm9wXSA9IHNvdXJjZU9ialtwcm9wXTtcbiAgICAgICAgICAgIG1lcmdlZFtwcm9wXSA9IHRydWU7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHNvdXJjZU9iaiA9IE9iamVjdC5nZXRQcm90b3R5cGVPZihzb3VyY2VPYmopO1xuICAgICAgfSB3aGlsZSAoc291cmNlT2JqICYmICghZmlsdGVyIHx8IGZpbHRlcihzb3VyY2VPYmosIGRlc3RPYmopKSAmJiBzb3VyY2VPYmogIT09IE9iamVjdC5wcm90b3R5cGUpO1xuICAgICAgcmV0dXJuIGRlc3RPYmo7XG4gICAgfVxuICAgIGZ1bmN0aW9uIGVuZHNXaXRoKHN0ciwgc2VhcmNoU3RyaW5nLCBwb3NpdGlvbikge1xuICAgICAgc3RyID0gU3RyaW5nKHN0cik7XG4gICAgICBpZiAocG9zaXRpb24gPT09IHZvaWQgMCB8fCBwb3NpdGlvbiA+IHN0ci5sZW5ndGgpIHtcbiAgICAgICAgcG9zaXRpb24gPSBzdHIubGVuZ3RoO1xuICAgICAgfVxuICAgICAgcG9zaXRpb24gLT0gc2VhcmNoU3RyaW5nLmxlbmd0aDtcbiAgICAgIHZhciBsYXN0SW5kZXggPSBzdHIuaW5kZXhPZihzZWFyY2hTdHJpbmcsIHBvc2l0aW9uKTtcbiAgICAgIHJldHVybiBsYXN0SW5kZXggIT09IC0xICYmIGxhc3RJbmRleCA9PT0gcG9zaXRpb247XG4gICAgfVxuICAgIGZ1bmN0aW9uIHRvQXJyYXkodGhpbmcpIHtcbiAgICAgIGlmICghdGhpbmcpXG4gICAgICAgIHJldHVybiBudWxsO1xuICAgICAgdmFyIGkyID0gdGhpbmcubGVuZ3RoO1xuICAgICAgaWYgKGlzVW5kZWZpbmVkKGkyKSlcbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICB2YXIgYXJyID0gbmV3IEFycmF5KGkyKTtcbiAgICAgIHdoaWxlIChpMi0tID4gMCkge1xuICAgICAgICBhcnJbaTJdID0gdGhpbmdbaTJdO1xuICAgICAgfVxuICAgICAgcmV0dXJuIGFycjtcbiAgICB9XG4gICAgdmFyIGlzVHlwZWRBcnJheSA9IGZ1bmN0aW9uKFR5cGVkQXJyYXkpIHtcbiAgICAgIHJldHVybiBmdW5jdGlvbih0aGluZykge1xuICAgICAgICByZXR1cm4gVHlwZWRBcnJheSAmJiB0aGluZyBpbnN0YW5jZW9mIFR5cGVkQXJyYXk7XG4gICAgICB9O1xuICAgIH0odHlwZW9mIFVpbnQ4QXJyYXkgIT09IFwidW5kZWZpbmVkXCIgJiYgT2JqZWN0LmdldFByb3RvdHlwZU9mKFVpbnQ4QXJyYXkpKTtcbiAgICBtb2R1bGUuZXhwb3J0cyA9IHtcbiAgICAgIGlzQXJyYXksXG4gICAgICBpc0FycmF5QnVmZmVyLFxuICAgICAgaXNCdWZmZXIsXG4gICAgICBpc0Zvcm1EYXRhLFxuICAgICAgaXNBcnJheUJ1ZmZlclZpZXcsXG4gICAgICBpc1N0cmluZyxcbiAgICAgIGlzTnVtYmVyLFxuICAgICAgaXNPYmplY3QsXG4gICAgICBpc1BsYWluT2JqZWN0OiBpc1BsYWluT2JqZWN0MyxcbiAgICAgIGlzVW5kZWZpbmVkLFxuICAgICAgaXNEYXRlOiBpc0RhdGUyLFxuICAgICAgaXNGaWxlLFxuICAgICAgaXNCbG9iLFxuICAgICAgaXNGdW5jdGlvbjogaXNGdW5jdGlvbjIsXG4gICAgICBpc1N0cmVhbSxcbiAgICAgIGlzVVJMU2VhcmNoUGFyYW1zLFxuICAgICAgaXNTdGFuZGFyZEJyb3dzZXJFbnYsXG4gICAgICBmb3JFYWNoLFxuICAgICAgbWVyZ2UsXG4gICAgICBleHRlbmQsXG4gICAgICB0cmltLFxuICAgICAgc3RyaXBCT00sXG4gICAgICBpbmhlcml0cyxcbiAgICAgIHRvRmxhdE9iamVjdCxcbiAgICAgIGtpbmRPZjoga2luZE9mMixcbiAgICAgIGtpbmRPZlRlc3QsXG4gICAgICBlbmRzV2l0aCxcbiAgICAgIHRvQXJyYXksXG4gICAgICBpc1R5cGVkQXJyYXksXG4gICAgICBpc0ZpbGVMaXN0XG4gICAgfTtcbiAgfVxufSk7XG5cbi8vIG5vZGVfbW9kdWxlcy9heGlvcy9saWIvaGVscGVycy9idWlsZFVSTC5qc1xudmFyIHJlcXVpcmVfYnVpbGRVUkwgPSBfX2NvbW1vbkpTKHtcbiAgXCJub2RlX21vZHVsZXMvYXhpb3MvbGliL2hlbHBlcnMvYnVpbGRVUkwuanNcIihleHBvcnRzLCBtb2R1bGUpIHtcbiAgICBcInVzZSBzdHJpY3RcIjtcbiAgICB2YXIgdXRpbHMgPSByZXF1aXJlX3V0aWxzKCk7XG4gICAgZnVuY3Rpb24gZW5jb2RlKHZhbCkge1xuICAgICAgcmV0dXJuIGVuY29kZVVSSUNvbXBvbmVudCh2YWwpLnJlcGxhY2UoLyUzQS9naSwgXCI6XCIpLnJlcGxhY2UoLyUyNC9nLCBcIiRcIikucmVwbGFjZSgvJTJDL2dpLCBcIixcIikucmVwbGFjZSgvJTIwL2csIFwiK1wiKS5yZXBsYWNlKC8lNUIvZ2ksIFwiW1wiKS5yZXBsYWNlKC8lNUQvZ2ksIFwiXVwiKTtcbiAgICB9XG4gICAgbW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBidWlsZFVSTCh1cmwsIHBhcmFtcywgcGFyYW1zU2VyaWFsaXplcikge1xuICAgICAgaWYgKCFwYXJhbXMpIHtcbiAgICAgICAgcmV0dXJuIHVybDtcbiAgICAgIH1cbiAgICAgIHZhciBzZXJpYWxpemVkUGFyYW1zO1xuICAgICAgaWYgKHBhcmFtc1NlcmlhbGl6ZXIpIHtcbiAgICAgICAgc2VyaWFsaXplZFBhcmFtcyA9IHBhcmFtc1NlcmlhbGl6ZXIocGFyYW1zKTtcbiAgICAgIH0gZWxzZSBpZiAodXRpbHMuaXNVUkxTZWFyY2hQYXJhbXMocGFyYW1zKSkge1xuICAgICAgICBzZXJpYWxpemVkUGFyYW1zID0gcGFyYW1zLnRvU3RyaW5nKCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB2YXIgcGFydHMgPSBbXTtcbiAgICAgICAgdXRpbHMuZm9yRWFjaChwYXJhbXMsIGZ1bmN0aW9uIHNlcmlhbGl6ZSh2YWwsIGtleSkge1xuICAgICAgICAgIGlmICh2YWwgPT09IG51bGwgfHwgdHlwZW9mIHZhbCA9PT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAodXRpbHMuaXNBcnJheSh2YWwpKSB7XG4gICAgICAgICAgICBrZXkgPSBrZXkgKyBcIltdXCI7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHZhbCA9IFt2YWxdO1xuICAgICAgICAgIH1cbiAgICAgICAgICB1dGlscy5mb3JFYWNoKHZhbCwgZnVuY3Rpb24gcGFyc2VWYWx1ZSh2Mikge1xuICAgICAgICAgICAgaWYgKHV0aWxzLmlzRGF0ZSh2MikpIHtcbiAgICAgICAgICAgICAgdjIgPSB2Mi50b0lTT1N0cmluZygpO1xuICAgICAgICAgICAgfSBlbHNlIGlmICh1dGlscy5pc09iamVjdCh2MikpIHtcbiAgICAgICAgICAgICAgdjIgPSBKU09OLnN0cmluZ2lmeSh2Mik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBwYXJ0cy5wdXNoKGVuY29kZShrZXkpICsgXCI9XCIgKyBlbmNvZGUodjIpKTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgICAgIHNlcmlhbGl6ZWRQYXJhbXMgPSBwYXJ0cy5qb2luKFwiJlwiKTtcbiAgICAgIH1cbiAgICAgIGlmIChzZXJpYWxpemVkUGFyYW1zKSB7XG4gICAgICAgIHZhciBoYXNobWFya0luZGV4ID0gdXJsLmluZGV4T2YoXCIjXCIpO1xuICAgICAgICBpZiAoaGFzaG1hcmtJbmRleCAhPT0gLTEpIHtcbiAgICAgICAgICB1cmwgPSB1cmwuc2xpY2UoMCwgaGFzaG1hcmtJbmRleCk7XG4gICAgICAgIH1cbiAgICAgICAgdXJsICs9ICh1cmwuaW5kZXhPZihcIj9cIikgPT09IC0xID8gXCI/XCIgOiBcIiZcIikgKyBzZXJpYWxpemVkUGFyYW1zO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHVybDtcbiAgICB9O1xuICB9XG59KTtcblxuLy8gbm9kZV9tb2R1bGVzL2F4aW9zL2xpYi9jb3JlL0ludGVyY2VwdG9yTWFuYWdlci5qc1xudmFyIHJlcXVpcmVfSW50ZXJjZXB0b3JNYW5hZ2VyID0gX19jb21tb25KUyh7XG4gIFwibm9kZV9tb2R1bGVzL2F4aW9zL2xpYi9jb3JlL0ludGVyY2VwdG9yTWFuYWdlci5qc1wiKGV4cG9ydHMsIG1vZHVsZSkge1xuICAgIFwidXNlIHN0cmljdFwiO1xuICAgIHZhciB1dGlscyA9IHJlcXVpcmVfdXRpbHMoKTtcbiAgICBmdW5jdGlvbiBJbnRlcmNlcHRvck1hbmFnZXIoKSB7XG4gICAgICB0aGlzLmhhbmRsZXJzID0gW107XG4gICAgfVxuICAgIEludGVyY2VwdG9yTWFuYWdlci5wcm90b3R5cGUudXNlID0gZnVuY3Rpb24gdXNlKGZ1bGZpbGxlZCwgcmVqZWN0ZWQsIG9wdGlvbnMpIHtcbiAgICAgIHRoaXMuaGFuZGxlcnMucHVzaCh7XG4gICAgICAgIGZ1bGZpbGxlZCxcbiAgICAgICAgcmVqZWN0ZWQsXG4gICAgICAgIHN5bmNocm9ub3VzOiBvcHRpb25zID8gb3B0aW9ucy5zeW5jaHJvbm91cyA6IGZhbHNlLFxuICAgICAgICBydW5XaGVuOiBvcHRpb25zID8gb3B0aW9ucy5ydW5XaGVuIDogbnVsbFxuICAgICAgfSk7XG4gICAgICByZXR1cm4gdGhpcy5oYW5kbGVycy5sZW5ndGggLSAxO1xuICAgIH07XG4gICAgSW50ZXJjZXB0b3JNYW5hZ2VyLnByb3RvdHlwZS5lamVjdCA9IGZ1bmN0aW9uIGVqZWN0KGlkKSB7XG4gICAgICBpZiAodGhpcy5oYW5kbGVyc1tpZF0pIHtcbiAgICAgICAgdGhpcy5oYW5kbGVyc1tpZF0gPSBudWxsO1xuICAgICAgfVxuICAgIH07XG4gICAgSW50ZXJjZXB0b3JNYW5hZ2VyLnByb3RvdHlwZS5mb3JFYWNoID0gZnVuY3Rpb24gZm9yRWFjaChmbjIpIHtcbiAgICAgIHV0aWxzLmZvckVhY2godGhpcy5oYW5kbGVycywgZnVuY3Rpb24gZm9yRWFjaEhhbmRsZXIoaDIpIHtcbiAgICAgICAgaWYgKGgyICE9PSBudWxsKSB7XG4gICAgICAgICAgZm4yKGgyKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfTtcbiAgICBtb2R1bGUuZXhwb3J0cyA9IEludGVyY2VwdG9yTWFuYWdlcjtcbiAgfVxufSk7XG5cbi8vIG5vZGVfbW9kdWxlcy9heGlvcy9saWIvaGVscGVycy9ub3JtYWxpemVIZWFkZXJOYW1lLmpzXG52YXIgcmVxdWlyZV9ub3JtYWxpemVIZWFkZXJOYW1lID0gX19jb21tb25KUyh7XG4gIFwibm9kZV9tb2R1bGVzL2F4aW9zL2xpYi9oZWxwZXJzL25vcm1hbGl6ZUhlYWRlck5hbWUuanNcIihleHBvcnRzLCBtb2R1bGUpIHtcbiAgICBcInVzZSBzdHJpY3RcIjtcbiAgICB2YXIgdXRpbHMgPSByZXF1aXJlX3V0aWxzKCk7XG4gICAgbW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBub3JtYWxpemVIZWFkZXJOYW1lKGhlYWRlcnMsIG5vcm1hbGl6ZWROYW1lKSB7XG4gICAgICB1dGlscy5mb3JFYWNoKGhlYWRlcnMsIGZ1bmN0aW9uIHByb2Nlc3NIZWFkZXIodmFsdWUsIG5hbWUpIHtcbiAgICAgICAgaWYgKG5hbWUgIT09IG5vcm1hbGl6ZWROYW1lICYmIG5hbWUudG9VcHBlckNhc2UoKSA9PT0gbm9ybWFsaXplZE5hbWUudG9VcHBlckNhc2UoKSkge1xuICAgICAgICAgIGhlYWRlcnNbbm9ybWFsaXplZE5hbWVdID0gdmFsdWU7XG4gICAgICAgICAgZGVsZXRlIGhlYWRlcnNbbmFtZV07XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH07XG4gIH1cbn0pO1xuXG4vLyBub2RlX21vZHVsZXMvYXhpb3MvbGliL2NvcmUvQXhpb3NFcnJvci5qc1xudmFyIHJlcXVpcmVfQXhpb3NFcnJvciA9IF9fY29tbW9uSlMoe1xuICBcIm5vZGVfbW9kdWxlcy9heGlvcy9saWIvY29yZS9BeGlvc0Vycm9yLmpzXCIoZXhwb3J0cywgbW9kdWxlKSB7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG4gICAgdmFyIHV0aWxzID0gcmVxdWlyZV91dGlscygpO1xuICAgIGZ1bmN0aW9uIEF4aW9zRXJyb3IobWVzc2FnZSwgY29kZSwgY29uZmlnLCByZXF1ZXN0MiwgcmVzcG9uc2UpIHtcbiAgICAgIEVycm9yLmNhbGwodGhpcyk7XG4gICAgICB0aGlzLm1lc3NhZ2UgPSBtZXNzYWdlO1xuICAgICAgdGhpcy5uYW1lID0gXCJBeGlvc0Vycm9yXCI7XG4gICAgICBjb2RlICYmICh0aGlzLmNvZGUgPSBjb2RlKTtcbiAgICAgIGNvbmZpZyAmJiAodGhpcy5jb25maWcgPSBjb25maWcpO1xuICAgICAgcmVxdWVzdDIgJiYgKHRoaXMucmVxdWVzdCA9IHJlcXVlc3QyKTtcbiAgICAgIHJlc3BvbnNlICYmICh0aGlzLnJlc3BvbnNlID0gcmVzcG9uc2UpO1xuICAgIH1cbiAgICB1dGlscy5pbmhlcml0cyhBeGlvc0Vycm9yLCBFcnJvciwge1xuICAgICAgdG9KU09OOiBmdW5jdGlvbiB0b0pTT04oKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgbWVzc2FnZTogdGhpcy5tZXNzYWdlLFxuICAgICAgICAgIG5hbWU6IHRoaXMubmFtZSxcbiAgICAgICAgICBkZXNjcmlwdGlvbjogdGhpcy5kZXNjcmlwdGlvbixcbiAgICAgICAgICBudW1iZXI6IHRoaXMubnVtYmVyLFxuICAgICAgICAgIGZpbGVOYW1lOiB0aGlzLmZpbGVOYW1lLFxuICAgICAgICAgIGxpbmVOdW1iZXI6IHRoaXMubGluZU51bWJlcixcbiAgICAgICAgICBjb2x1bW5OdW1iZXI6IHRoaXMuY29sdW1uTnVtYmVyLFxuICAgICAgICAgIHN0YWNrOiB0aGlzLnN0YWNrLFxuICAgICAgICAgIGNvbmZpZzogdGhpcy5jb25maWcsXG4gICAgICAgICAgY29kZTogdGhpcy5jb2RlLFxuICAgICAgICAgIHN0YXR1czogdGhpcy5yZXNwb25zZSAmJiB0aGlzLnJlc3BvbnNlLnN0YXR1cyA/IHRoaXMucmVzcG9uc2Uuc3RhdHVzIDogbnVsbFxuICAgICAgICB9O1xuICAgICAgfVxuICAgIH0pO1xuICAgIHZhciBwcm90b3R5cGUgPSBBeGlvc0Vycm9yLnByb3RvdHlwZTtcbiAgICB2YXIgZGVzY3JpcHRvcnMgPSB7fTtcbiAgICBbXG4gICAgICBcIkVSUl9CQURfT1BUSU9OX1ZBTFVFXCIsXG4gICAgICBcIkVSUl9CQURfT1BUSU9OXCIsXG4gICAgICBcIkVDT05OQUJPUlRFRFwiLFxuICAgICAgXCJFVElNRURPVVRcIixcbiAgICAgIFwiRVJSX05FVFdPUktcIixcbiAgICAgIFwiRVJSX0ZSX1RPT19NQU5ZX1JFRElSRUNUU1wiLFxuICAgICAgXCJFUlJfREVQUkVDQVRFRFwiLFxuICAgICAgXCJFUlJfQkFEX1JFU1BPTlNFXCIsXG4gICAgICBcIkVSUl9CQURfUkVRVUVTVFwiLFxuICAgICAgXCJFUlJfQ0FOQ0VMRURcIlxuICAgIF0uZm9yRWFjaChmdW5jdGlvbihjb2RlKSB7XG4gICAgICBkZXNjcmlwdG9yc1tjb2RlXSA9IHsgdmFsdWU6IGNvZGUgfTtcbiAgICB9KTtcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydGllcyhBeGlvc0Vycm9yLCBkZXNjcmlwdG9ycyk7XG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHByb3RvdHlwZSwgXCJpc0F4aW9zRXJyb3JcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbiAgICBBeGlvc0Vycm9yLmZyb20gPSBmdW5jdGlvbihlcnJvciwgY29kZSwgY29uZmlnLCByZXF1ZXN0MiwgcmVzcG9uc2UsIGN1c3RvbVByb3BzKSB7XG4gICAgICB2YXIgYXhpb3NFcnJvciA9IE9iamVjdC5jcmVhdGUocHJvdG90eXBlKTtcbiAgICAgIHV0aWxzLnRvRmxhdE9iamVjdChlcnJvciwgYXhpb3NFcnJvciwgZnVuY3Rpb24gZmlsdGVyKG9iaikge1xuICAgICAgICByZXR1cm4gb2JqICE9PSBFcnJvci5wcm90b3R5cGU7XG4gICAgICB9KTtcbiAgICAgIEF4aW9zRXJyb3IuY2FsbChheGlvc0Vycm9yLCBlcnJvci5tZXNzYWdlLCBjb2RlLCBjb25maWcsIHJlcXVlc3QyLCByZXNwb25zZSk7XG4gICAgICBheGlvc0Vycm9yLm5hbWUgPSBlcnJvci5uYW1lO1xuICAgICAgY3VzdG9tUHJvcHMgJiYgT2JqZWN0LmFzc2lnbihheGlvc0Vycm9yLCBjdXN0b21Qcm9wcyk7XG4gICAgICByZXR1cm4gYXhpb3NFcnJvcjtcbiAgICB9O1xuICAgIG1vZHVsZS5leHBvcnRzID0gQXhpb3NFcnJvcjtcbiAgfVxufSk7XG5cbi8vIG5vZGVfbW9kdWxlcy9heGlvcy9saWIvZGVmYXVsdHMvdHJhbnNpdGlvbmFsLmpzXG52YXIgcmVxdWlyZV90cmFuc2l0aW9uYWwgPSBfX2NvbW1vbkpTKHtcbiAgXCJub2RlX21vZHVsZXMvYXhpb3MvbGliL2RlZmF1bHRzL3RyYW5zaXRpb25hbC5qc1wiKGV4cG9ydHMsIG1vZHVsZSkge1xuICAgIFwidXNlIHN0cmljdFwiO1xuICAgIG1vZHVsZS5leHBvcnRzID0ge1xuICAgICAgc2lsZW50SlNPTlBhcnNpbmc6IHRydWUsXG4gICAgICBmb3JjZWRKU09OUGFyc2luZzogdHJ1ZSxcbiAgICAgIGNsYXJpZnlUaW1lb3V0RXJyb3I6IGZhbHNlXG4gICAgfTtcbiAgfVxufSk7XG5cbi8vIG5vZGVfbW9kdWxlcy9heGlvcy9saWIvaGVscGVycy90b0Zvcm1EYXRhLmpzXG52YXIgcmVxdWlyZV90b0Zvcm1EYXRhID0gX19jb21tb25KUyh7XG4gIFwibm9kZV9tb2R1bGVzL2F4aW9zL2xpYi9oZWxwZXJzL3RvRm9ybURhdGEuanNcIihleHBvcnRzLCBtb2R1bGUpIHtcbiAgICBcInVzZSBzdHJpY3RcIjtcbiAgICB2YXIgdXRpbHMgPSByZXF1aXJlX3V0aWxzKCk7XG4gICAgZnVuY3Rpb24gdG9Gb3JtRGF0YShvYmosIGZvcm1EYXRhKSB7XG4gICAgICBmb3JtRGF0YSA9IGZvcm1EYXRhIHx8IG5ldyBGb3JtRGF0YSgpO1xuICAgICAgdmFyIHN0YWNrID0gW107XG4gICAgICBmdW5jdGlvbiBjb252ZXJ0VmFsdWUodmFsdWUpIHtcbiAgICAgICAgaWYgKHZhbHVlID09PSBudWxsKVxuICAgICAgICAgIHJldHVybiBcIlwiO1xuICAgICAgICBpZiAodXRpbHMuaXNEYXRlKHZhbHVlKSkge1xuICAgICAgICAgIHJldHVybiB2YWx1ZS50b0lTT1N0cmluZygpO1xuICAgICAgICB9XG4gICAgICAgIGlmICh1dGlscy5pc0FycmF5QnVmZmVyKHZhbHVlKSB8fCB1dGlscy5pc1R5cGVkQXJyYXkodmFsdWUpKSB7XG4gICAgICAgICAgcmV0dXJuIHR5cGVvZiBCbG9iID09PSBcImZ1bmN0aW9uXCIgPyBuZXcgQmxvYihbdmFsdWVdKSA6IEJ1ZmZlci5mcm9tKHZhbHVlKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdmFsdWU7XG4gICAgICB9XG4gICAgICBmdW5jdGlvbiBidWlsZChkYXRhLCBwYXJlbnRLZXkpIHtcbiAgICAgICAgaWYgKHV0aWxzLmlzUGxhaW5PYmplY3QoZGF0YSkgfHwgdXRpbHMuaXNBcnJheShkYXRhKSkge1xuICAgICAgICAgIGlmIChzdGFjay5pbmRleE9mKGRhdGEpICE9PSAtMSkge1xuICAgICAgICAgICAgdGhyb3cgRXJyb3IoXCJDaXJjdWxhciByZWZlcmVuY2UgZGV0ZWN0ZWQgaW4gXCIgKyBwYXJlbnRLZXkpO1xuICAgICAgICAgIH1cbiAgICAgICAgICBzdGFjay5wdXNoKGRhdGEpO1xuICAgICAgICAgIHV0aWxzLmZvckVhY2goZGF0YSwgZnVuY3Rpb24gZWFjaCh2YWx1ZSwga2V5KSB7XG4gICAgICAgICAgICBpZiAodXRpbHMuaXNVbmRlZmluZWQodmFsdWUpKVxuICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB2YXIgZnVsbEtleSA9IHBhcmVudEtleSA/IHBhcmVudEtleSArIFwiLlwiICsga2V5IDoga2V5O1xuICAgICAgICAgICAgdmFyIGFycjtcbiAgICAgICAgICAgIGlmICh2YWx1ZSAmJiAhcGFyZW50S2V5ICYmIHR5cGVvZiB2YWx1ZSA9PT0gXCJvYmplY3RcIikge1xuICAgICAgICAgICAgICBpZiAodXRpbHMuZW5kc1dpdGgoa2V5LCBcInt9XCIpKSB7XG4gICAgICAgICAgICAgICAgdmFsdWUgPSBKU09OLnN0cmluZ2lmeSh2YWx1ZSk7XG4gICAgICAgICAgICAgIH0gZWxzZSBpZiAodXRpbHMuZW5kc1dpdGgoa2V5LCBcIltdXCIpICYmIChhcnIgPSB1dGlscy50b0FycmF5KHZhbHVlKSkpIHtcbiAgICAgICAgICAgICAgICBhcnIuZm9yRWFjaChmdW5jdGlvbihlbCkge1xuICAgICAgICAgICAgICAgICAgIXV0aWxzLmlzVW5kZWZpbmVkKGVsKSAmJiBmb3JtRGF0YS5hcHBlbmQoZnVsbEtleSwgY29udmVydFZhbHVlKGVsKSk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBidWlsZCh2YWx1ZSwgZnVsbEtleSk7XG4gICAgICAgICAgfSk7XG4gICAgICAgICAgc3RhY2sucG9wKCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgZm9ybURhdGEuYXBwZW5kKHBhcmVudEtleSwgY29udmVydFZhbHVlKGRhdGEpKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgYnVpbGQob2JqKTtcbiAgICAgIHJldHVybiBmb3JtRGF0YTtcbiAgICB9XG4gICAgbW9kdWxlLmV4cG9ydHMgPSB0b0Zvcm1EYXRhO1xuICB9XG59KTtcblxuLy8gbm9kZV9tb2R1bGVzL2F4aW9zL2xpYi9jb3JlL3NldHRsZS5qc1xudmFyIHJlcXVpcmVfc2V0dGxlID0gX19jb21tb25KUyh7XG4gIFwibm9kZV9tb2R1bGVzL2F4aW9zL2xpYi9jb3JlL3NldHRsZS5qc1wiKGV4cG9ydHMsIG1vZHVsZSkge1xuICAgIFwidXNlIHN0cmljdFwiO1xuICAgIHZhciBBeGlvc0Vycm9yID0gcmVxdWlyZV9BeGlvc0Vycm9yKCk7XG4gICAgbW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBzZXR0bGUocmVzb2x2ZSwgcmVqZWN0LCByZXNwb25zZSkge1xuICAgICAgdmFyIHZhbGlkYXRlU3RhdHVzID0gcmVzcG9uc2UuY29uZmlnLnZhbGlkYXRlU3RhdHVzO1xuICAgICAgaWYgKCFyZXNwb25zZS5zdGF0dXMgfHwgIXZhbGlkYXRlU3RhdHVzIHx8IHZhbGlkYXRlU3RhdHVzKHJlc3BvbnNlLnN0YXR1cykpIHtcbiAgICAgICAgcmVzb2x2ZShyZXNwb25zZSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZWplY3QobmV3IEF4aW9zRXJyb3IoXG4gICAgICAgICAgXCJSZXF1ZXN0IGZhaWxlZCB3aXRoIHN0YXR1cyBjb2RlIFwiICsgcmVzcG9uc2Uuc3RhdHVzLFxuICAgICAgICAgIFtBeGlvc0Vycm9yLkVSUl9CQURfUkVRVUVTVCwgQXhpb3NFcnJvci5FUlJfQkFEX1JFU1BPTlNFXVtNYXRoLmZsb29yKHJlc3BvbnNlLnN0YXR1cyAvIDEwMCkgLSA0XSxcbiAgICAgICAgICByZXNwb25zZS5jb25maWcsXG4gICAgICAgICAgcmVzcG9uc2UucmVxdWVzdCxcbiAgICAgICAgICByZXNwb25zZVxuICAgICAgICApKTtcbiAgICAgIH1cbiAgICB9O1xuICB9XG59KTtcblxuLy8gbm9kZV9tb2R1bGVzL2F4aW9zL2xpYi9oZWxwZXJzL2Nvb2tpZXMuanNcbnZhciByZXF1aXJlX2Nvb2tpZXMgPSBfX2NvbW1vbkpTKHtcbiAgXCJub2RlX21vZHVsZXMvYXhpb3MvbGliL2hlbHBlcnMvY29va2llcy5qc1wiKGV4cG9ydHMsIG1vZHVsZSkge1xuICAgIFwidXNlIHN0cmljdFwiO1xuICAgIHZhciB1dGlscyA9IHJlcXVpcmVfdXRpbHMoKTtcbiAgICBtb2R1bGUuZXhwb3J0cyA9IHV0aWxzLmlzU3RhbmRhcmRCcm93c2VyRW52KCkgPyBmdW5jdGlvbiBzdGFuZGFyZEJyb3dzZXJFbnYoKSB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICB3cml0ZTogZnVuY3Rpb24gd3JpdGUobmFtZSwgdmFsdWUsIGV4cGlyZXMsIHBhdGgsIGRvbWFpbiwgc2VjdXJlKSB7XG4gICAgICAgICAgdmFyIGNvb2tpZSA9IFtdO1xuICAgICAgICAgIGNvb2tpZS5wdXNoKG5hbWUgKyBcIj1cIiArIGVuY29kZVVSSUNvbXBvbmVudCh2YWx1ZSkpO1xuICAgICAgICAgIGlmICh1dGlscy5pc051bWJlcihleHBpcmVzKSkge1xuICAgICAgICAgICAgY29va2llLnB1c2goXCJleHBpcmVzPVwiICsgbmV3IERhdGUoZXhwaXJlcykudG9HTVRTdHJpbmcoKSk7XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmICh1dGlscy5pc1N0cmluZyhwYXRoKSkge1xuICAgICAgICAgICAgY29va2llLnB1c2goXCJwYXRoPVwiICsgcGF0aCk7XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmICh1dGlscy5pc1N0cmluZyhkb21haW4pKSB7XG4gICAgICAgICAgICBjb29raWUucHVzaChcImRvbWFpbj1cIiArIGRvbWFpbik7XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmIChzZWN1cmUgPT09IHRydWUpIHtcbiAgICAgICAgICAgIGNvb2tpZS5wdXNoKFwic2VjdXJlXCIpO1xuICAgICAgICAgIH1cbiAgICAgICAgICBkb2N1bWVudC5jb29raWUgPSBjb29raWUuam9pbihcIjsgXCIpO1xuICAgICAgICB9LFxuICAgICAgICByZWFkOiBmdW5jdGlvbiByZWFkKG5hbWUpIHtcbiAgICAgICAgICB2YXIgbWF0Y2ggPSBkb2N1bWVudC5jb29raWUubWF0Y2gobmV3IFJlZ0V4cChcIihefDtcXFxccyopKFwiICsgbmFtZSArIFwiKT0oW147XSopXCIpKTtcbiAgICAgICAgICByZXR1cm4gbWF0Y2ggPyBkZWNvZGVVUklDb21wb25lbnQobWF0Y2hbM10pIDogbnVsbDtcbiAgICAgICAgfSxcbiAgICAgICAgcmVtb3ZlOiBmdW5jdGlvbiByZW1vdmUobmFtZSkge1xuICAgICAgICAgIHRoaXMud3JpdGUobmFtZSwgXCJcIiwgRGF0ZS5ub3coKSAtIDg2NGU1KTtcbiAgICAgICAgfVxuICAgICAgfTtcbiAgICB9KCkgOiBmdW5jdGlvbiBub25TdGFuZGFyZEJyb3dzZXJFbnYoKSB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICB3cml0ZTogZnVuY3Rpb24gd3JpdGUoKSB7XG4gICAgICAgIH0sXG4gICAgICAgIHJlYWQ6IGZ1bmN0aW9uIHJlYWQoKSB7XG4gICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIH0sXG4gICAgICAgIHJlbW92ZTogZnVuY3Rpb24gcmVtb3ZlKCkge1xuICAgICAgICB9XG4gICAgICB9O1xuICAgIH0oKTtcbiAgfVxufSk7XG5cbi8vIG5vZGVfbW9kdWxlcy9heGlvcy9saWIvaGVscGVycy9pc0Fic29sdXRlVVJMLmpzXG52YXIgcmVxdWlyZV9pc0Fic29sdXRlVVJMID0gX19jb21tb25KUyh7XG4gIFwibm9kZV9tb2R1bGVzL2F4aW9zL2xpYi9oZWxwZXJzL2lzQWJzb2x1dGVVUkwuanNcIihleHBvcnRzLCBtb2R1bGUpIHtcbiAgICBcInVzZSBzdHJpY3RcIjtcbiAgICBtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGlzQWJzb2x1dGVVUkwodXJsKSB7XG4gICAgICByZXR1cm4gL14oW2Etel1bYS16XFxkK1xcLS5dKjopP1xcL1xcLy9pLnRlc3QodXJsKTtcbiAgICB9O1xuICB9XG59KTtcblxuLy8gbm9kZV9tb2R1bGVzL2F4aW9zL2xpYi9oZWxwZXJzL2NvbWJpbmVVUkxzLmpzXG52YXIgcmVxdWlyZV9jb21iaW5lVVJMcyA9IF9fY29tbW9uSlMoe1xuICBcIm5vZGVfbW9kdWxlcy9heGlvcy9saWIvaGVscGVycy9jb21iaW5lVVJMcy5qc1wiKGV4cG9ydHMsIG1vZHVsZSkge1xuICAgIFwidXNlIHN0cmljdFwiO1xuICAgIG1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gY29tYmluZVVSTHMoYmFzZVVSTCwgcmVsYXRpdmVVUkwpIHtcbiAgICAgIHJldHVybiByZWxhdGl2ZVVSTCA/IGJhc2VVUkwucmVwbGFjZSgvXFwvKyQvLCBcIlwiKSArIFwiL1wiICsgcmVsYXRpdmVVUkwucmVwbGFjZSgvXlxcLysvLCBcIlwiKSA6IGJhc2VVUkw7XG4gICAgfTtcbiAgfVxufSk7XG5cbi8vIG5vZGVfbW9kdWxlcy9heGlvcy9saWIvY29yZS9idWlsZEZ1bGxQYXRoLmpzXG52YXIgcmVxdWlyZV9idWlsZEZ1bGxQYXRoID0gX19jb21tb25KUyh7XG4gIFwibm9kZV9tb2R1bGVzL2F4aW9zL2xpYi9jb3JlL2J1aWxkRnVsbFBhdGguanNcIihleHBvcnRzLCBtb2R1bGUpIHtcbiAgICBcInVzZSBzdHJpY3RcIjtcbiAgICB2YXIgaXNBYnNvbHV0ZVVSTCA9IHJlcXVpcmVfaXNBYnNvbHV0ZVVSTCgpO1xuICAgIHZhciBjb21iaW5lVVJMcyA9IHJlcXVpcmVfY29tYmluZVVSTHMoKTtcbiAgICBtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGJ1aWxkRnVsbFBhdGgoYmFzZVVSTCwgcmVxdWVzdGVkVVJMKSB7XG4gICAgICBpZiAoYmFzZVVSTCAmJiAhaXNBYnNvbHV0ZVVSTChyZXF1ZXN0ZWRVUkwpKSB7XG4gICAgICAgIHJldHVybiBjb21iaW5lVVJMcyhiYXNlVVJMLCByZXF1ZXN0ZWRVUkwpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHJlcXVlc3RlZFVSTDtcbiAgICB9O1xuICB9XG59KTtcblxuLy8gbm9kZV9tb2R1bGVzL2F4aW9zL2xpYi9oZWxwZXJzL3BhcnNlSGVhZGVycy5qc1xudmFyIHJlcXVpcmVfcGFyc2VIZWFkZXJzID0gX19jb21tb25KUyh7XG4gIFwibm9kZV9tb2R1bGVzL2F4aW9zL2xpYi9oZWxwZXJzL3BhcnNlSGVhZGVycy5qc1wiKGV4cG9ydHMsIG1vZHVsZSkge1xuICAgIFwidXNlIHN0cmljdFwiO1xuICAgIHZhciB1dGlscyA9IHJlcXVpcmVfdXRpbHMoKTtcbiAgICB2YXIgaWdub3JlRHVwbGljYXRlT2YgPSBbXG4gICAgICBcImFnZVwiLFxuICAgICAgXCJhdXRob3JpemF0aW9uXCIsXG4gICAgICBcImNvbnRlbnQtbGVuZ3RoXCIsXG4gICAgICBcImNvbnRlbnQtdHlwZVwiLFxuICAgICAgXCJldGFnXCIsXG4gICAgICBcImV4cGlyZXNcIixcbiAgICAgIFwiZnJvbVwiLFxuICAgICAgXCJob3N0XCIsXG4gICAgICBcImlmLW1vZGlmaWVkLXNpbmNlXCIsXG4gICAgICBcImlmLXVubW9kaWZpZWQtc2luY2VcIixcbiAgICAgIFwibGFzdC1tb2RpZmllZFwiLFxuICAgICAgXCJsb2NhdGlvblwiLFxuICAgICAgXCJtYXgtZm9yd2FyZHNcIixcbiAgICAgIFwicHJveHktYXV0aG9yaXphdGlvblwiLFxuICAgICAgXCJyZWZlcmVyXCIsXG4gICAgICBcInJldHJ5LWFmdGVyXCIsXG4gICAgICBcInVzZXItYWdlbnRcIlxuICAgIF07XG4gICAgbW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBwYXJzZUhlYWRlcnMoaGVhZGVycykge1xuICAgICAgdmFyIHBhcnNlZCA9IHt9O1xuICAgICAgdmFyIGtleTtcbiAgICAgIHZhciB2YWw7XG4gICAgICB2YXIgaTI7XG4gICAgICBpZiAoIWhlYWRlcnMpIHtcbiAgICAgICAgcmV0dXJuIHBhcnNlZDtcbiAgICAgIH1cbiAgICAgIHV0aWxzLmZvckVhY2goaGVhZGVycy5zcGxpdChcIlxcblwiKSwgZnVuY3Rpb24gcGFyc2VyKGxpbmUpIHtcbiAgICAgICAgaTIgPSBsaW5lLmluZGV4T2YoXCI6XCIpO1xuICAgICAgICBrZXkgPSB1dGlscy50cmltKGxpbmUuc3Vic3RyKDAsIGkyKSkudG9Mb3dlckNhc2UoKTtcbiAgICAgICAgdmFsID0gdXRpbHMudHJpbShsaW5lLnN1YnN0cihpMiArIDEpKTtcbiAgICAgICAgaWYgKGtleSkge1xuICAgICAgICAgIGlmIChwYXJzZWRba2V5XSAmJiBpZ25vcmVEdXBsaWNhdGVPZi5pbmRleE9mKGtleSkgPj0gMCkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAoa2V5ID09PSBcInNldC1jb29raWVcIikge1xuICAgICAgICAgICAgcGFyc2VkW2tleV0gPSAocGFyc2VkW2tleV0gPyBwYXJzZWRba2V5XSA6IFtdKS5jb25jYXQoW3ZhbF0pO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBwYXJzZWRba2V5XSA9IHBhcnNlZFtrZXldID8gcGFyc2VkW2tleV0gKyBcIiwgXCIgKyB2YWwgOiB2YWw7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgIHJldHVybiBwYXJzZWQ7XG4gICAgfTtcbiAgfVxufSk7XG5cbi8vIG5vZGVfbW9kdWxlcy9heGlvcy9saWIvaGVscGVycy9pc1VSTFNhbWVPcmlnaW4uanNcbnZhciByZXF1aXJlX2lzVVJMU2FtZU9yaWdpbiA9IF9fY29tbW9uSlMoe1xuICBcIm5vZGVfbW9kdWxlcy9heGlvcy9saWIvaGVscGVycy9pc1VSTFNhbWVPcmlnaW4uanNcIihleHBvcnRzLCBtb2R1bGUpIHtcbiAgICBcInVzZSBzdHJpY3RcIjtcbiAgICB2YXIgdXRpbHMgPSByZXF1aXJlX3V0aWxzKCk7XG4gICAgbW9kdWxlLmV4cG9ydHMgPSB1dGlscy5pc1N0YW5kYXJkQnJvd3NlckVudigpID8gZnVuY3Rpb24gc3RhbmRhcmRCcm93c2VyRW52KCkge1xuICAgICAgdmFyIG1zaWUgPSAvKG1zaWV8dHJpZGVudCkvaS50ZXN0KG5hdmlnYXRvci51c2VyQWdlbnQpO1xuICAgICAgdmFyIHVybFBhcnNpbmdOb2RlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImFcIik7XG4gICAgICB2YXIgb3JpZ2luVVJMO1xuICAgICAgZnVuY3Rpb24gcmVzb2x2ZVVSTCh1cmwpIHtcbiAgICAgICAgdmFyIGhyZWYgPSB1cmw7XG4gICAgICAgIGlmIChtc2llKSB7XG4gICAgICAgICAgdXJsUGFyc2luZ05vZGUuc2V0QXR0cmlidXRlKFwiaHJlZlwiLCBocmVmKTtcbiAgICAgICAgICBocmVmID0gdXJsUGFyc2luZ05vZGUuaHJlZjtcbiAgICAgICAgfVxuICAgICAgICB1cmxQYXJzaW5nTm9kZS5zZXRBdHRyaWJ1dGUoXCJocmVmXCIsIGhyZWYpO1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIGhyZWY6IHVybFBhcnNpbmdOb2RlLmhyZWYsXG4gICAgICAgICAgcHJvdG9jb2w6IHVybFBhcnNpbmdOb2RlLnByb3RvY29sID8gdXJsUGFyc2luZ05vZGUucHJvdG9jb2wucmVwbGFjZSgvOiQvLCBcIlwiKSA6IFwiXCIsXG4gICAgICAgICAgaG9zdDogdXJsUGFyc2luZ05vZGUuaG9zdCxcbiAgICAgICAgICBzZWFyY2g6IHVybFBhcnNpbmdOb2RlLnNlYXJjaCA/IHVybFBhcnNpbmdOb2RlLnNlYXJjaC5yZXBsYWNlKC9eXFw/LywgXCJcIikgOiBcIlwiLFxuICAgICAgICAgIGhhc2g6IHVybFBhcnNpbmdOb2RlLmhhc2ggPyB1cmxQYXJzaW5nTm9kZS5oYXNoLnJlcGxhY2UoL14jLywgXCJcIikgOiBcIlwiLFxuICAgICAgICAgIGhvc3RuYW1lOiB1cmxQYXJzaW5nTm9kZS5ob3N0bmFtZSxcbiAgICAgICAgICBwb3J0OiB1cmxQYXJzaW5nTm9kZS5wb3J0LFxuICAgICAgICAgIHBhdGhuYW1lOiB1cmxQYXJzaW5nTm9kZS5wYXRobmFtZS5jaGFyQXQoMCkgPT09IFwiL1wiID8gdXJsUGFyc2luZ05vZGUucGF0aG5hbWUgOiBcIi9cIiArIHVybFBhcnNpbmdOb2RlLnBhdGhuYW1lXG4gICAgICAgIH07XG4gICAgICB9XG4gICAgICBvcmlnaW5VUkwgPSByZXNvbHZlVVJMKHdpbmRvdy5sb2NhdGlvbi5ocmVmKTtcbiAgICAgIHJldHVybiBmdW5jdGlvbiBpc1VSTFNhbWVPcmlnaW4ocmVxdWVzdFVSTCkge1xuICAgICAgICB2YXIgcGFyc2VkID0gdXRpbHMuaXNTdHJpbmcocmVxdWVzdFVSTCkgPyByZXNvbHZlVVJMKHJlcXVlc3RVUkwpIDogcmVxdWVzdFVSTDtcbiAgICAgICAgcmV0dXJuIHBhcnNlZC5wcm90b2NvbCA9PT0gb3JpZ2luVVJMLnByb3RvY29sICYmIHBhcnNlZC5ob3N0ID09PSBvcmlnaW5VUkwuaG9zdDtcbiAgICAgIH07XG4gICAgfSgpIDogZnVuY3Rpb24gbm9uU3RhbmRhcmRCcm93c2VyRW52KCkge1xuICAgICAgcmV0dXJuIGZ1bmN0aW9uIGlzVVJMU2FtZU9yaWdpbigpIHtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9O1xuICAgIH0oKTtcbiAgfVxufSk7XG5cbi8vIG5vZGVfbW9kdWxlcy9heGlvcy9saWIvY2FuY2VsL0NhbmNlbGVkRXJyb3IuanNcbnZhciByZXF1aXJlX0NhbmNlbGVkRXJyb3IgPSBfX2NvbW1vbkpTKHtcbiAgXCJub2RlX21vZHVsZXMvYXhpb3MvbGliL2NhbmNlbC9DYW5jZWxlZEVycm9yLmpzXCIoZXhwb3J0cywgbW9kdWxlKSB7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG4gICAgdmFyIEF4aW9zRXJyb3IgPSByZXF1aXJlX0F4aW9zRXJyb3IoKTtcbiAgICB2YXIgdXRpbHMgPSByZXF1aXJlX3V0aWxzKCk7XG4gICAgZnVuY3Rpb24gQ2FuY2VsZWRFcnJvcihtZXNzYWdlKSB7XG4gICAgICBBeGlvc0Vycm9yLmNhbGwodGhpcywgbWVzc2FnZSA9PSBudWxsID8gXCJjYW5jZWxlZFwiIDogbWVzc2FnZSwgQXhpb3NFcnJvci5FUlJfQ0FOQ0VMRUQpO1xuICAgICAgdGhpcy5uYW1lID0gXCJDYW5jZWxlZEVycm9yXCI7XG4gICAgfVxuICAgIHV0aWxzLmluaGVyaXRzKENhbmNlbGVkRXJyb3IsIEF4aW9zRXJyb3IsIHtcbiAgICAgIF9fQ0FOQ0VMX186IHRydWVcbiAgICB9KTtcbiAgICBtb2R1bGUuZXhwb3J0cyA9IENhbmNlbGVkRXJyb3I7XG4gIH1cbn0pO1xuXG4vLyBub2RlX21vZHVsZXMvYXhpb3MvbGliL2hlbHBlcnMvcGFyc2VQcm90b2NvbC5qc1xudmFyIHJlcXVpcmVfcGFyc2VQcm90b2NvbCA9IF9fY29tbW9uSlMoe1xuICBcIm5vZGVfbW9kdWxlcy9heGlvcy9saWIvaGVscGVycy9wYXJzZVByb3RvY29sLmpzXCIoZXhwb3J0cywgbW9kdWxlKSB7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG4gICAgbW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBwYXJzZVByb3RvY29sKHVybCkge1xuICAgICAgdmFyIG1hdGNoID0gL14oWy0rXFx3XXsxLDI1fSkoOj9cXC9cXC98OikvLmV4ZWModXJsKTtcbiAgICAgIHJldHVybiBtYXRjaCAmJiBtYXRjaFsxXSB8fCBcIlwiO1xuICAgIH07XG4gIH1cbn0pO1xuXG4vLyBub2RlX21vZHVsZXMvYXhpb3MvbGliL2FkYXB0ZXJzL3hoci5qc1xudmFyIHJlcXVpcmVfeGhyID0gX19jb21tb25KUyh7XG4gIFwibm9kZV9tb2R1bGVzL2F4aW9zL2xpYi9hZGFwdGVycy94aHIuanNcIihleHBvcnRzLCBtb2R1bGUpIHtcbiAgICBcInVzZSBzdHJpY3RcIjtcbiAgICB2YXIgdXRpbHMgPSByZXF1aXJlX3V0aWxzKCk7XG4gICAgdmFyIHNldHRsZSA9IHJlcXVpcmVfc2V0dGxlKCk7XG4gICAgdmFyIGNvb2tpZXMgPSByZXF1aXJlX2Nvb2tpZXMoKTtcbiAgICB2YXIgYnVpbGRVUkwgPSByZXF1aXJlX2J1aWxkVVJMKCk7XG4gICAgdmFyIGJ1aWxkRnVsbFBhdGggPSByZXF1aXJlX2J1aWxkRnVsbFBhdGgoKTtcbiAgICB2YXIgcGFyc2VIZWFkZXJzID0gcmVxdWlyZV9wYXJzZUhlYWRlcnMoKTtcbiAgICB2YXIgaXNVUkxTYW1lT3JpZ2luID0gcmVxdWlyZV9pc1VSTFNhbWVPcmlnaW4oKTtcbiAgICB2YXIgdHJhbnNpdGlvbmFsRGVmYXVsdHMgPSByZXF1aXJlX3RyYW5zaXRpb25hbCgpO1xuICAgIHZhciBBeGlvc0Vycm9yID0gcmVxdWlyZV9BeGlvc0Vycm9yKCk7XG4gICAgdmFyIENhbmNlbGVkRXJyb3IgPSByZXF1aXJlX0NhbmNlbGVkRXJyb3IoKTtcbiAgICB2YXIgcGFyc2VQcm90b2NvbCA9IHJlcXVpcmVfcGFyc2VQcm90b2NvbCgpO1xuICAgIG1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24geGhyQWRhcHRlcihjb25maWcpIHtcbiAgICAgIHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbiBkaXNwYXRjaFhoclJlcXVlc3QocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICAgIHZhciByZXF1ZXN0RGF0YSA9IGNvbmZpZy5kYXRhO1xuICAgICAgICB2YXIgcmVxdWVzdEhlYWRlcnMgPSBjb25maWcuaGVhZGVycztcbiAgICAgICAgdmFyIHJlc3BvbnNlVHlwZSA9IGNvbmZpZy5yZXNwb25zZVR5cGU7XG4gICAgICAgIHZhciBvbkNhbmNlbGVkO1xuICAgICAgICBmdW5jdGlvbiBkb25lKCkge1xuICAgICAgICAgIGlmIChjb25maWcuY2FuY2VsVG9rZW4pIHtcbiAgICAgICAgICAgIGNvbmZpZy5jYW5jZWxUb2tlbi51bnN1YnNjcmliZShvbkNhbmNlbGVkKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKGNvbmZpZy5zaWduYWwpIHtcbiAgICAgICAgICAgIGNvbmZpZy5zaWduYWwucmVtb3ZlRXZlbnRMaXN0ZW5lcihcImFib3J0XCIsIG9uQ2FuY2VsZWQpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBpZiAodXRpbHMuaXNGb3JtRGF0YShyZXF1ZXN0RGF0YSkgJiYgdXRpbHMuaXNTdGFuZGFyZEJyb3dzZXJFbnYoKSkge1xuICAgICAgICAgIGRlbGV0ZSByZXF1ZXN0SGVhZGVyc1tcIkNvbnRlbnQtVHlwZVwiXTtcbiAgICAgICAgfVxuICAgICAgICB2YXIgcmVxdWVzdDIgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcbiAgICAgICAgaWYgKGNvbmZpZy5hdXRoKSB7XG4gICAgICAgICAgdmFyIHVzZXJuYW1lID0gY29uZmlnLmF1dGgudXNlcm5hbWUgfHwgXCJcIjtcbiAgICAgICAgICB2YXIgcGFzc3dvcmQgPSBjb25maWcuYXV0aC5wYXNzd29yZCA/IHVuZXNjYXBlKGVuY29kZVVSSUNvbXBvbmVudChjb25maWcuYXV0aC5wYXNzd29yZCkpIDogXCJcIjtcbiAgICAgICAgICByZXF1ZXN0SGVhZGVycy5BdXRob3JpemF0aW9uID0gXCJCYXNpYyBcIiArIGJ0b2EodXNlcm5hbWUgKyBcIjpcIiArIHBhc3N3b3JkKTtcbiAgICAgICAgfVxuICAgICAgICB2YXIgZnVsbFBhdGggPSBidWlsZEZ1bGxQYXRoKGNvbmZpZy5iYXNlVVJMLCBjb25maWcudXJsKTtcbiAgICAgICAgcmVxdWVzdDIub3Blbihjb25maWcubWV0aG9kLnRvVXBwZXJDYXNlKCksIGJ1aWxkVVJMKGZ1bGxQYXRoLCBjb25maWcucGFyYW1zLCBjb25maWcucGFyYW1zU2VyaWFsaXplciksIHRydWUpO1xuICAgICAgICByZXF1ZXN0Mi50aW1lb3V0ID0gY29uZmlnLnRpbWVvdXQ7XG4gICAgICAgIGZ1bmN0aW9uIG9ubG9hZGVuZCgpIHtcbiAgICAgICAgICBpZiAoIXJlcXVlc3QyKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgfVxuICAgICAgICAgIHZhciByZXNwb25zZUhlYWRlcnMgPSBcImdldEFsbFJlc3BvbnNlSGVhZGVyc1wiIGluIHJlcXVlc3QyID8gcGFyc2VIZWFkZXJzKHJlcXVlc3QyLmdldEFsbFJlc3BvbnNlSGVhZGVycygpKSA6IG51bGw7XG4gICAgICAgICAgdmFyIHJlc3BvbnNlRGF0YSA9ICFyZXNwb25zZVR5cGUgfHwgcmVzcG9uc2VUeXBlID09PSBcInRleHRcIiB8fCByZXNwb25zZVR5cGUgPT09IFwianNvblwiID8gcmVxdWVzdDIucmVzcG9uc2VUZXh0IDogcmVxdWVzdDIucmVzcG9uc2U7XG4gICAgICAgICAgdmFyIHJlc3BvbnNlID0ge1xuICAgICAgICAgICAgZGF0YTogcmVzcG9uc2VEYXRhLFxuICAgICAgICAgICAgc3RhdHVzOiByZXF1ZXN0Mi5zdGF0dXMsXG4gICAgICAgICAgICBzdGF0dXNUZXh0OiByZXF1ZXN0Mi5zdGF0dXNUZXh0LFxuICAgICAgICAgICAgaGVhZGVyczogcmVzcG9uc2VIZWFkZXJzLFxuICAgICAgICAgICAgY29uZmlnLFxuICAgICAgICAgICAgcmVxdWVzdDogcmVxdWVzdDJcbiAgICAgICAgICB9O1xuICAgICAgICAgIHNldHRsZShmdW5jdGlvbiBfcmVzb2x2ZSh2YWx1ZSkge1xuICAgICAgICAgICAgcmVzb2x2ZSh2YWx1ZSk7XG4gICAgICAgICAgICBkb25lKCk7XG4gICAgICAgICAgfSwgZnVuY3Rpb24gX3JlamVjdChlcnIpIHtcbiAgICAgICAgICAgIHJlamVjdChlcnIpO1xuICAgICAgICAgICAgZG9uZSgpO1xuICAgICAgICAgIH0sIHJlc3BvbnNlKTtcbiAgICAgICAgICByZXF1ZXN0MiA9IG51bGw7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKFwib25sb2FkZW5kXCIgaW4gcmVxdWVzdDIpIHtcbiAgICAgICAgICByZXF1ZXN0Mi5vbmxvYWRlbmQgPSBvbmxvYWRlbmQ7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmVxdWVzdDIub25yZWFkeXN0YXRlY2hhbmdlID0gZnVuY3Rpb24gaGFuZGxlTG9hZCgpIHtcbiAgICAgICAgICAgIGlmICghcmVxdWVzdDIgfHwgcmVxdWVzdDIucmVhZHlTdGF0ZSAhPT0gNCkge1xuICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAocmVxdWVzdDIuc3RhdHVzID09PSAwICYmICEocmVxdWVzdDIucmVzcG9uc2VVUkwgJiYgcmVxdWVzdDIucmVzcG9uc2VVUkwuaW5kZXhPZihcImZpbGU6XCIpID09PSAwKSkge1xuICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBzZXRUaW1lb3V0KG9ubG9hZGVuZCk7XG4gICAgICAgICAgfTtcbiAgICAgICAgfVxuICAgICAgICByZXF1ZXN0Mi5vbmFib3J0ID0gZnVuY3Rpb24gaGFuZGxlQWJvcnQoKSB7XG4gICAgICAgICAgaWYgKCFyZXF1ZXN0Mikge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgIH1cbiAgICAgICAgICByZWplY3QobmV3IEF4aW9zRXJyb3IoXCJSZXF1ZXN0IGFib3J0ZWRcIiwgQXhpb3NFcnJvci5FQ09OTkFCT1JURUQsIGNvbmZpZywgcmVxdWVzdDIpKTtcbiAgICAgICAgICByZXF1ZXN0MiA9IG51bGw7XG4gICAgICAgIH07XG4gICAgICAgIHJlcXVlc3QyLm9uZXJyb3IgPSBmdW5jdGlvbiBoYW5kbGVFcnJvcigpIHtcbiAgICAgICAgICByZWplY3QobmV3IEF4aW9zRXJyb3IoXCJOZXR3b3JrIEVycm9yXCIsIEF4aW9zRXJyb3IuRVJSX05FVFdPUkssIGNvbmZpZywgcmVxdWVzdDIsIHJlcXVlc3QyKSk7XG4gICAgICAgICAgcmVxdWVzdDIgPSBudWxsO1xuICAgICAgICB9O1xuICAgICAgICByZXF1ZXN0Mi5vbnRpbWVvdXQgPSBmdW5jdGlvbiBoYW5kbGVUaW1lb3V0KCkge1xuICAgICAgICAgIHZhciB0aW1lb3V0RXJyb3JNZXNzYWdlID0gY29uZmlnLnRpbWVvdXQgPyBcInRpbWVvdXQgb2YgXCIgKyBjb25maWcudGltZW91dCArIFwibXMgZXhjZWVkZWRcIiA6IFwidGltZW91dCBleGNlZWRlZFwiO1xuICAgICAgICAgIHZhciB0cmFuc2l0aW9uYWwgPSBjb25maWcudHJhbnNpdGlvbmFsIHx8IHRyYW5zaXRpb25hbERlZmF1bHRzO1xuICAgICAgICAgIGlmIChjb25maWcudGltZW91dEVycm9yTWVzc2FnZSkge1xuICAgICAgICAgICAgdGltZW91dEVycm9yTWVzc2FnZSA9IGNvbmZpZy50aW1lb3V0RXJyb3JNZXNzYWdlO1xuICAgICAgICAgIH1cbiAgICAgICAgICByZWplY3QobmV3IEF4aW9zRXJyb3IoXG4gICAgICAgICAgICB0aW1lb3V0RXJyb3JNZXNzYWdlLFxuICAgICAgICAgICAgdHJhbnNpdGlvbmFsLmNsYXJpZnlUaW1lb3V0RXJyb3IgPyBBeGlvc0Vycm9yLkVUSU1FRE9VVCA6IEF4aW9zRXJyb3IuRUNPTk5BQk9SVEVELFxuICAgICAgICAgICAgY29uZmlnLFxuICAgICAgICAgICAgcmVxdWVzdDJcbiAgICAgICAgICApKTtcbiAgICAgICAgICByZXF1ZXN0MiA9IG51bGw7XG4gICAgICAgIH07XG4gICAgICAgIGlmICh1dGlscy5pc1N0YW5kYXJkQnJvd3NlckVudigpKSB7XG4gICAgICAgICAgdmFyIHhzcmZWYWx1ZSA9IChjb25maWcud2l0aENyZWRlbnRpYWxzIHx8IGlzVVJMU2FtZU9yaWdpbihmdWxsUGF0aCkpICYmIGNvbmZpZy54c3JmQ29va2llTmFtZSA/IGNvb2tpZXMucmVhZChjb25maWcueHNyZkNvb2tpZU5hbWUpIDogdm9pZCAwO1xuICAgICAgICAgIGlmICh4c3JmVmFsdWUpIHtcbiAgICAgICAgICAgIHJlcXVlc3RIZWFkZXJzW2NvbmZpZy54c3JmSGVhZGVyTmFtZV0gPSB4c3JmVmFsdWU7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGlmIChcInNldFJlcXVlc3RIZWFkZXJcIiBpbiByZXF1ZXN0Mikge1xuICAgICAgICAgIHV0aWxzLmZvckVhY2gocmVxdWVzdEhlYWRlcnMsIGZ1bmN0aW9uIHNldFJlcXVlc3RIZWFkZXIodmFsLCBrZXkpIHtcbiAgICAgICAgICAgIGlmICh0eXBlb2YgcmVxdWVzdERhdGEgPT09IFwidW5kZWZpbmVkXCIgJiYga2V5LnRvTG93ZXJDYXNlKCkgPT09IFwiY29udGVudC10eXBlXCIpIHtcbiAgICAgICAgICAgICAgZGVsZXRlIHJlcXVlc3RIZWFkZXJzW2tleV07XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICByZXF1ZXN0Mi5zZXRSZXF1ZXN0SGVhZGVyKGtleSwgdmFsKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoIXV0aWxzLmlzVW5kZWZpbmVkKGNvbmZpZy53aXRoQ3JlZGVudGlhbHMpKSB7XG4gICAgICAgICAgcmVxdWVzdDIud2l0aENyZWRlbnRpYWxzID0gISFjb25maWcud2l0aENyZWRlbnRpYWxzO1xuICAgICAgICB9XG4gICAgICAgIGlmIChyZXNwb25zZVR5cGUgJiYgcmVzcG9uc2VUeXBlICE9PSBcImpzb25cIikge1xuICAgICAgICAgIHJlcXVlc3QyLnJlc3BvbnNlVHlwZSA9IGNvbmZpZy5yZXNwb25zZVR5cGU7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHR5cGVvZiBjb25maWcub25Eb3dubG9hZFByb2dyZXNzID09PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgICAgICByZXF1ZXN0Mi5hZGRFdmVudExpc3RlbmVyKFwicHJvZ3Jlc3NcIiwgY29uZmlnLm9uRG93bmxvYWRQcm9ncmVzcyk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHR5cGVvZiBjb25maWcub25VcGxvYWRQcm9ncmVzcyA9PT0gXCJmdW5jdGlvblwiICYmIHJlcXVlc3QyLnVwbG9hZCkge1xuICAgICAgICAgIHJlcXVlc3QyLnVwbG9hZC5hZGRFdmVudExpc3RlbmVyKFwicHJvZ3Jlc3NcIiwgY29uZmlnLm9uVXBsb2FkUHJvZ3Jlc3MpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChjb25maWcuY2FuY2VsVG9rZW4gfHwgY29uZmlnLnNpZ25hbCkge1xuICAgICAgICAgIG9uQ2FuY2VsZWQgPSBmdW5jdGlvbihjYW5jZWwpIHtcbiAgICAgICAgICAgIGlmICghcmVxdWVzdDIpIHtcbiAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmVqZWN0KCFjYW5jZWwgfHwgY2FuY2VsICYmIGNhbmNlbC50eXBlID8gbmV3IENhbmNlbGVkRXJyb3IoKSA6IGNhbmNlbCk7XG4gICAgICAgICAgICByZXF1ZXN0Mi5hYm9ydCgpO1xuICAgICAgICAgICAgcmVxdWVzdDIgPSBudWxsO1xuICAgICAgICAgIH07XG4gICAgICAgICAgY29uZmlnLmNhbmNlbFRva2VuICYmIGNvbmZpZy5jYW5jZWxUb2tlbi5zdWJzY3JpYmUob25DYW5jZWxlZCk7XG4gICAgICAgICAgaWYgKGNvbmZpZy5zaWduYWwpIHtcbiAgICAgICAgICAgIGNvbmZpZy5zaWduYWwuYWJvcnRlZCA/IG9uQ2FuY2VsZWQoKSA6IGNvbmZpZy5zaWduYWwuYWRkRXZlbnRMaXN0ZW5lcihcImFib3J0XCIsIG9uQ2FuY2VsZWQpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBpZiAoIXJlcXVlc3REYXRhKSB7XG4gICAgICAgICAgcmVxdWVzdERhdGEgPSBudWxsO1xuICAgICAgICB9XG4gICAgICAgIHZhciBwcm90b2NvbCA9IHBhcnNlUHJvdG9jb2woZnVsbFBhdGgpO1xuICAgICAgICBpZiAocHJvdG9jb2wgJiYgW1wiaHR0cFwiLCBcImh0dHBzXCIsIFwiZmlsZVwiXS5pbmRleE9mKHByb3RvY29sKSA9PT0gLTEpIHtcbiAgICAgICAgICByZWplY3QobmV3IEF4aW9zRXJyb3IoXCJVbnN1cHBvcnRlZCBwcm90b2NvbCBcIiArIHByb3RvY29sICsgXCI6XCIsIEF4aW9zRXJyb3IuRVJSX0JBRF9SRVFVRVNULCBjb25maWcpKTtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgcmVxdWVzdDIuc2VuZChyZXF1ZXN0RGF0YSk7XG4gICAgICB9KTtcbiAgICB9O1xuICB9XG59KTtcblxuLy8gbm9kZV9tb2R1bGVzL2F4aW9zL2xpYi9oZWxwZXJzL251bGwuanNcbnZhciByZXF1aXJlX251bGwgPSBfX2NvbW1vbkpTKHtcbiAgXCJub2RlX21vZHVsZXMvYXhpb3MvbGliL2hlbHBlcnMvbnVsbC5qc1wiKGV4cG9ydHMsIG1vZHVsZSkge1xuICAgIG1vZHVsZS5leHBvcnRzID0gbnVsbDtcbiAgfVxufSk7XG5cbi8vIG5vZGVfbW9kdWxlcy9heGlvcy9saWIvZGVmYXVsdHMvaW5kZXguanNcbnZhciByZXF1aXJlX2RlZmF1bHRzID0gX19jb21tb25KUyh7XG4gIFwibm9kZV9tb2R1bGVzL2F4aW9zL2xpYi9kZWZhdWx0cy9pbmRleC5qc1wiKGV4cG9ydHMsIG1vZHVsZSkge1xuICAgIFwidXNlIHN0cmljdFwiO1xuICAgIHZhciB1dGlscyA9IHJlcXVpcmVfdXRpbHMoKTtcbiAgICB2YXIgbm9ybWFsaXplSGVhZGVyTmFtZSA9IHJlcXVpcmVfbm9ybWFsaXplSGVhZGVyTmFtZSgpO1xuICAgIHZhciBBeGlvc0Vycm9yID0gcmVxdWlyZV9BeGlvc0Vycm9yKCk7XG4gICAgdmFyIHRyYW5zaXRpb25hbERlZmF1bHRzID0gcmVxdWlyZV90cmFuc2l0aW9uYWwoKTtcbiAgICB2YXIgdG9Gb3JtRGF0YSA9IHJlcXVpcmVfdG9Gb3JtRGF0YSgpO1xuICAgIHZhciBERUZBVUxUX0NPTlRFTlRfVFlQRSA9IHtcbiAgICAgIFwiQ29udGVudC1UeXBlXCI6IFwiYXBwbGljYXRpb24veC13d3ctZm9ybS11cmxlbmNvZGVkXCJcbiAgICB9O1xuICAgIGZ1bmN0aW9uIHNldENvbnRlbnRUeXBlSWZVbnNldChoZWFkZXJzLCB2YWx1ZSkge1xuICAgICAgaWYgKCF1dGlscy5pc1VuZGVmaW5lZChoZWFkZXJzKSAmJiB1dGlscy5pc1VuZGVmaW5lZChoZWFkZXJzW1wiQ29udGVudC1UeXBlXCJdKSkge1xuICAgICAgICBoZWFkZXJzW1wiQ29udGVudC1UeXBlXCJdID0gdmFsdWU7XG4gICAgICB9XG4gICAgfVxuICAgIGZ1bmN0aW9uIGdldERlZmF1bHRBZGFwdGVyKCkge1xuICAgICAgdmFyIGFkYXB0ZXI7XG4gICAgICBpZiAodHlwZW9mIFhNTEh0dHBSZXF1ZXN0ICE9PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgICAgIGFkYXB0ZXIgPSByZXF1aXJlX3hocigpO1xuICAgICAgfSBlbHNlIGlmICh0eXBlb2YgcHJvY2VzcyAhPT0gXCJ1bmRlZmluZWRcIiAmJiBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwocHJvY2VzcykgPT09IFwiW29iamVjdCBwcm9jZXNzXVwiKSB7XG4gICAgICAgIGFkYXB0ZXIgPSByZXF1aXJlX3hocigpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIGFkYXB0ZXI7XG4gICAgfVxuICAgIGZ1bmN0aW9uIHN0cmluZ2lmeVNhZmVseShyYXdWYWx1ZSwgcGFyc2VyLCBlbmNvZGVyKSB7XG4gICAgICBpZiAodXRpbHMuaXNTdHJpbmcocmF3VmFsdWUpKSB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgKHBhcnNlciB8fCBKU09OLnBhcnNlKShyYXdWYWx1ZSk7XG4gICAgICAgICAgcmV0dXJuIHV0aWxzLnRyaW0ocmF3VmFsdWUpO1xuICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgaWYgKGUubmFtZSAhPT0gXCJTeW50YXhFcnJvclwiKSB7XG4gICAgICAgICAgICB0aHJvdyBlO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgcmV0dXJuIChlbmNvZGVyIHx8IEpTT04uc3RyaW5naWZ5KShyYXdWYWx1ZSk7XG4gICAgfVxuICAgIHZhciBkZWZhdWx0cyA9IHtcbiAgICAgIHRyYW5zaXRpb25hbDogdHJhbnNpdGlvbmFsRGVmYXVsdHMsXG4gICAgICBhZGFwdGVyOiBnZXREZWZhdWx0QWRhcHRlcigpLFxuICAgICAgdHJhbnNmb3JtUmVxdWVzdDogW2Z1bmN0aW9uIHRyYW5zZm9ybVJlcXVlc3QoZGF0YSwgaGVhZGVycykge1xuICAgICAgICBub3JtYWxpemVIZWFkZXJOYW1lKGhlYWRlcnMsIFwiQWNjZXB0XCIpO1xuICAgICAgICBub3JtYWxpemVIZWFkZXJOYW1lKGhlYWRlcnMsIFwiQ29udGVudC1UeXBlXCIpO1xuICAgICAgICBpZiAodXRpbHMuaXNGb3JtRGF0YShkYXRhKSB8fCB1dGlscy5pc0FycmF5QnVmZmVyKGRhdGEpIHx8IHV0aWxzLmlzQnVmZmVyKGRhdGEpIHx8IHV0aWxzLmlzU3RyZWFtKGRhdGEpIHx8IHV0aWxzLmlzRmlsZShkYXRhKSB8fCB1dGlscy5pc0Jsb2IoZGF0YSkpIHtcbiAgICAgICAgICByZXR1cm4gZGF0YTtcbiAgICAgICAgfVxuICAgICAgICBpZiAodXRpbHMuaXNBcnJheUJ1ZmZlclZpZXcoZGF0YSkpIHtcbiAgICAgICAgICByZXR1cm4gZGF0YS5idWZmZXI7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHV0aWxzLmlzVVJMU2VhcmNoUGFyYW1zKGRhdGEpKSB7XG4gICAgICAgICAgc2V0Q29udGVudFR5cGVJZlVuc2V0KGhlYWRlcnMsIFwiYXBwbGljYXRpb24veC13d3ctZm9ybS11cmxlbmNvZGVkO2NoYXJzZXQ9dXRmLThcIik7XG4gICAgICAgICAgcmV0dXJuIGRhdGEudG9TdHJpbmcoKTtcbiAgICAgICAgfVxuICAgICAgICB2YXIgaXNPYmplY3RQYXlsb2FkID0gdXRpbHMuaXNPYmplY3QoZGF0YSk7XG4gICAgICAgIHZhciBjb250ZW50VHlwZSA9IGhlYWRlcnMgJiYgaGVhZGVyc1tcIkNvbnRlbnQtVHlwZVwiXTtcbiAgICAgICAgdmFyIGlzRmlsZUxpc3Q7XG4gICAgICAgIGlmICgoaXNGaWxlTGlzdCA9IHV0aWxzLmlzRmlsZUxpc3QoZGF0YSkpIHx8IGlzT2JqZWN0UGF5bG9hZCAmJiBjb250ZW50VHlwZSA9PT0gXCJtdWx0aXBhcnQvZm9ybS1kYXRhXCIpIHtcbiAgICAgICAgICB2YXIgX0Zvcm1EYXRhID0gdGhpcy5lbnYgJiYgdGhpcy5lbnYuRm9ybURhdGE7XG4gICAgICAgICAgcmV0dXJuIHRvRm9ybURhdGEoaXNGaWxlTGlzdCA/IHsgXCJmaWxlc1tdXCI6IGRhdGEgfSA6IGRhdGEsIF9Gb3JtRGF0YSAmJiBuZXcgX0Zvcm1EYXRhKCkpO1xuICAgICAgICB9IGVsc2UgaWYgKGlzT2JqZWN0UGF5bG9hZCB8fCBjb250ZW50VHlwZSA9PT0gXCJhcHBsaWNhdGlvbi9qc29uXCIpIHtcbiAgICAgICAgICBzZXRDb250ZW50VHlwZUlmVW5zZXQoaGVhZGVycywgXCJhcHBsaWNhdGlvbi9qc29uXCIpO1xuICAgICAgICAgIHJldHVybiBzdHJpbmdpZnlTYWZlbHkoZGF0YSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGRhdGE7XG4gICAgICB9XSxcbiAgICAgIHRyYW5zZm9ybVJlc3BvbnNlOiBbZnVuY3Rpb24gdHJhbnNmb3JtUmVzcG9uc2UoZGF0YSkge1xuICAgICAgICB2YXIgdHJhbnNpdGlvbmFsID0gdGhpcy50cmFuc2l0aW9uYWwgfHwgZGVmYXVsdHMudHJhbnNpdGlvbmFsO1xuICAgICAgICB2YXIgc2lsZW50SlNPTlBhcnNpbmcgPSB0cmFuc2l0aW9uYWwgJiYgdHJhbnNpdGlvbmFsLnNpbGVudEpTT05QYXJzaW5nO1xuICAgICAgICB2YXIgZm9yY2VkSlNPTlBhcnNpbmcgPSB0cmFuc2l0aW9uYWwgJiYgdHJhbnNpdGlvbmFsLmZvcmNlZEpTT05QYXJzaW5nO1xuICAgICAgICB2YXIgc3RyaWN0SlNPTlBhcnNpbmcgPSAhc2lsZW50SlNPTlBhcnNpbmcgJiYgdGhpcy5yZXNwb25zZVR5cGUgPT09IFwianNvblwiO1xuICAgICAgICBpZiAoc3RyaWN0SlNPTlBhcnNpbmcgfHwgZm9yY2VkSlNPTlBhcnNpbmcgJiYgdXRpbHMuaXNTdHJpbmcoZGF0YSkgJiYgZGF0YS5sZW5ndGgpIHtcbiAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgcmV0dXJuIEpTT04ucGFyc2UoZGF0YSk7XG4gICAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgICAgaWYgKHN0cmljdEpTT05QYXJzaW5nKSB7XG4gICAgICAgICAgICAgIGlmIChlLm5hbWUgPT09IFwiU3ludGF4RXJyb3JcIikge1xuICAgICAgICAgICAgICAgIHRocm93IEF4aW9zRXJyb3IuZnJvbShlLCBBeGlvc0Vycm9yLkVSUl9CQURfUkVTUE9OU0UsIHRoaXMsIG51bGwsIHRoaXMucmVzcG9uc2UpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIHRocm93IGU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBkYXRhO1xuICAgICAgfV0sXG4gICAgICB0aW1lb3V0OiAwLFxuICAgICAgeHNyZkNvb2tpZU5hbWU6IFwiWFNSRi1UT0tFTlwiLFxuICAgICAgeHNyZkhlYWRlck5hbWU6IFwiWC1YU1JGLVRPS0VOXCIsXG4gICAgICBtYXhDb250ZW50TGVuZ3RoOiAtMSxcbiAgICAgIG1heEJvZHlMZW5ndGg6IC0xLFxuICAgICAgZW52OiB7XG4gICAgICAgIEZvcm1EYXRhOiByZXF1aXJlX251bGwoKVxuICAgICAgfSxcbiAgICAgIHZhbGlkYXRlU3RhdHVzOiBmdW5jdGlvbiB2YWxpZGF0ZVN0YXR1cyhzdGF0dXMpIHtcbiAgICAgICAgcmV0dXJuIHN0YXR1cyA+PSAyMDAgJiYgc3RhdHVzIDwgMzAwO1xuICAgICAgfSxcbiAgICAgIGhlYWRlcnM6IHtcbiAgICAgICAgY29tbW9uOiB7XG4gICAgICAgICAgXCJBY2NlcHRcIjogXCJhcHBsaWNhdGlvbi9qc29uLCB0ZXh0L3BsYWluLCAqLypcIlxuICAgICAgICB9XG4gICAgICB9XG4gICAgfTtcbiAgICB1dGlscy5mb3JFYWNoKFtcImRlbGV0ZVwiLCBcImdldFwiLCBcImhlYWRcIl0sIGZ1bmN0aW9uIGZvckVhY2hNZXRob2ROb0RhdGEobWV0aG9kKSB7XG4gICAgICBkZWZhdWx0cy5oZWFkZXJzW21ldGhvZF0gPSB7fTtcbiAgICB9KTtcbiAgICB1dGlscy5mb3JFYWNoKFtcInBvc3RcIiwgXCJwdXRcIiwgXCJwYXRjaFwiXSwgZnVuY3Rpb24gZm9yRWFjaE1ldGhvZFdpdGhEYXRhKG1ldGhvZCkge1xuICAgICAgZGVmYXVsdHMuaGVhZGVyc1ttZXRob2RdID0gdXRpbHMubWVyZ2UoREVGQVVMVF9DT05URU5UX1RZUEUpO1xuICAgIH0pO1xuICAgIG1vZHVsZS5leHBvcnRzID0gZGVmYXVsdHM7XG4gIH1cbn0pO1xuXG4vLyBub2RlX21vZHVsZXMvYXhpb3MvbGliL2NvcmUvdHJhbnNmb3JtRGF0YS5qc1xudmFyIHJlcXVpcmVfdHJhbnNmb3JtRGF0YSA9IF9fY29tbW9uSlMoe1xuICBcIm5vZGVfbW9kdWxlcy9heGlvcy9saWIvY29yZS90cmFuc2Zvcm1EYXRhLmpzXCIoZXhwb3J0cywgbW9kdWxlKSB7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG4gICAgdmFyIHV0aWxzID0gcmVxdWlyZV91dGlscygpO1xuICAgIHZhciBkZWZhdWx0cyA9IHJlcXVpcmVfZGVmYXVsdHMoKTtcbiAgICBtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIHRyYW5zZm9ybURhdGEoZGF0YSwgaGVhZGVycywgZm5zKSB7XG4gICAgICB2YXIgY29udGV4dCA9IHRoaXMgfHwgZGVmYXVsdHM7XG4gICAgICB1dGlscy5mb3JFYWNoKGZucywgZnVuY3Rpb24gdHJhbnNmb3JtKGZuMikge1xuICAgICAgICBkYXRhID0gZm4yLmNhbGwoY29udGV4dCwgZGF0YSwgaGVhZGVycyk7XG4gICAgICB9KTtcbiAgICAgIHJldHVybiBkYXRhO1xuICAgIH07XG4gIH1cbn0pO1xuXG4vLyBub2RlX21vZHVsZXMvYXhpb3MvbGliL2NhbmNlbC9pc0NhbmNlbC5qc1xudmFyIHJlcXVpcmVfaXNDYW5jZWwgPSBfX2NvbW1vbkpTKHtcbiAgXCJub2RlX21vZHVsZXMvYXhpb3MvbGliL2NhbmNlbC9pc0NhbmNlbC5qc1wiKGV4cG9ydHMsIG1vZHVsZSkge1xuICAgIFwidXNlIHN0cmljdFwiO1xuICAgIG1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gaXNDYW5jZWwodmFsdWUpIHtcbiAgICAgIHJldHVybiAhISh2YWx1ZSAmJiB2YWx1ZS5fX0NBTkNFTF9fKTtcbiAgICB9O1xuICB9XG59KTtcblxuLy8gbm9kZV9tb2R1bGVzL2F4aW9zL2xpYi9jb3JlL2Rpc3BhdGNoUmVxdWVzdC5qc1xudmFyIHJlcXVpcmVfZGlzcGF0Y2hSZXF1ZXN0ID0gX19jb21tb25KUyh7XG4gIFwibm9kZV9tb2R1bGVzL2F4aW9zL2xpYi9jb3JlL2Rpc3BhdGNoUmVxdWVzdC5qc1wiKGV4cG9ydHMsIG1vZHVsZSkge1xuICAgIFwidXNlIHN0cmljdFwiO1xuICAgIHZhciB1dGlscyA9IHJlcXVpcmVfdXRpbHMoKTtcbiAgICB2YXIgdHJhbnNmb3JtRGF0YSA9IHJlcXVpcmVfdHJhbnNmb3JtRGF0YSgpO1xuICAgIHZhciBpc0NhbmNlbCA9IHJlcXVpcmVfaXNDYW5jZWwoKTtcbiAgICB2YXIgZGVmYXVsdHMgPSByZXF1aXJlX2RlZmF1bHRzKCk7XG4gICAgdmFyIENhbmNlbGVkRXJyb3IgPSByZXF1aXJlX0NhbmNlbGVkRXJyb3IoKTtcbiAgICBmdW5jdGlvbiB0aHJvd0lmQ2FuY2VsbGF0aW9uUmVxdWVzdGVkKGNvbmZpZykge1xuICAgICAgaWYgKGNvbmZpZy5jYW5jZWxUb2tlbikge1xuICAgICAgICBjb25maWcuY2FuY2VsVG9rZW4udGhyb3dJZlJlcXVlc3RlZCgpO1xuICAgICAgfVxuICAgICAgaWYgKGNvbmZpZy5zaWduYWwgJiYgY29uZmlnLnNpZ25hbC5hYm9ydGVkKSB7XG4gICAgICAgIHRocm93IG5ldyBDYW5jZWxlZEVycm9yKCk7XG4gICAgICB9XG4gICAgfVxuICAgIG1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gZGlzcGF0Y2hSZXF1ZXN0KGNvbmZpZykge1xuICAgICAgdGhyb3dJZkNhbmNlbGxhdGlvblJlcXVlc3RlZChjb25maWcpO1xuICAgICAgY29uZmlnLmhlYWRlcnMgPSBjb25maWcuaGVhZGVycyB8fCB7fTtcbiAgICAgIGNvbmZpZy5kYXRhID0gdHJhbnNmb3JtRGF0YS5jYWxsKFxuICAgICAgICBjb25maWcsXG4gICAgICAgIGNvbmZpZy5kYXRhLFxuICAgICAgICBjb25maWcuaGVhZGVycyxcbiAgICAgICAgY29uZmlnLnRyYW5zZm9ybVJlcXVlc3RcbiAgICAgICk7XG4gICAgICBjb25maWcuaGVhZGVycyA9IHV0aWxzLm1lcmdlKFxuICAgICAgICBjb25maWcuaGVhZGVycy5jb21tb24gfHwge30sXG4gICAgICAgIGNvbmZpZy5oZWFkZXJzW2NvbmZpZy5tZXRob2RdIHx8IHt9LFxuICAgICAgICBjb25maWcuaGVhZGVyc1xuICAgICAgKTtcbiAgICAgIHV0aWxzLmZvckVhY2goXG4gICAgICAgIFtcImRlbGV0ZVwiLCBcImdldFwiLCBcImhlYWRcIiwgXCJwb3N0XCIsIFwicHV0XCIsIFwicGF0Y2hcIiwgXCJjb21tb25cIl0sXG4gICAgICAgIGZ1bmN0aW9uIGNsZWFuSGVhZGVyQ29uZmlnKG1ldGhvZCkge1xuICAgICAgICAgIGRlbGV0ZSBjb25maWcuaGVhZGVyc1ttZXRob2RdO1xuICAgICAgICB9XG4gICAgICApO1xuICAgICAgdmFyIGFkYXB0ZXIgPSBjb25maWcuYWRhcHRlciB8fCBkZWZhdWx0cy5hZGFwdGVyO1xuICAgICAgcmV0dXJuIGFkYXB0ZXIoY29uZmlnKS50aGVuKGZ1bmN0aW9uIG9uQWRhcHRlclJlc29sdXRpb24ocmVzcG9uc2UpIHtcbiAgICAgICAgdGhyb3dJZkNhbmNlbGxhdGlvblJlcXVlc3RlZChjb25maWcpO1xuICAgICAgICByZXNwb25zZS5kYXRhID0gdHJhbnNmb3JtRGF0YS5jYWxsKFxuICAgICAgICAgIGNvbmZpZyxcbiAgICAgICAgICByZXNwb25zZS5kYXRhLFxuICAgICAgICAgIHJlc3BvbnNlLmhlYWRlcnMsXG4gICAgICAgICAgY29uZmlnLnRyYW5zZm9ybVJlc3BvbnNlXG4gICAgICAgICk7XG4gICAgICAgIHJldHVybiByZXNwb25zZTtcbiAgICAgIH0sIGZ1bmN0aW9uIG9uQWRhcHRlclJlamVjdGlvbihyZWFzb24pIHtcbiAgICAgICAgaWYgKCFpc0NhbmNlbChyZWFzb24pKSB7XG4gICAgICAgICAgdGhyb3dJZkNhbmNlbGxhdGlvblJlcXVlc3RlZChjb25maWcpO1xuICAgICAgICAgIGlmIChyZWFzb24gJiYgcmVhc29uLnJlc3BvbnNlKSB7XG4gICAgICAgICAgICByZWFzb24ucmVzcG9uc2UuZGF0YSA9IHRyYW5zZm9ybURhdGEuY2FsbChcbiAgICAgICAgICAgICAgY29uZmlnLFxuICAgICAgICAgICAgICByZWFzb24ucmVzcG9uc2UuZGF0YSxcbiAgICAgICAgICAgICAgcmVhc29uLnJlc3BvbnNlLmhlYWRlcnMsXG4gICAgICAgICAgICAgIGNvbmZpZy50cmFuc2Zvcm1SZXNwb25zZVxuICAgICAgICAgICAgKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIFByb21pc2UucmVqZWN0KHJlYXNvbik7XG4gICAgICB9KTtcbiAgICB9O1xuICB9XG59KTtcblxuLy8gbm9kZV9tb2R1bGVzL2F4aW9zL2xpYi9jb3JlL21lcmdlQ29uZmlnLmpzXG52YXIgcmVxdWlyZV9tZXJnZUNvbmZpZyA9IF9fY29tbW9uSlMoe1xuICBcIm5vZGVfbW9kdWxlcy9heGlvcy9saWIvY29yZS9tZXJnZUNvbmZpZy5qc1wiKGV4cG9ydHMsIG1vZHVsZSkge1xuICAgIFwidXNlIHN0cmljdFwiO1xuICAgIHZhciB1dGlscyA9IHJlcXVpcmVfdXRpbHMoKTtcbiAgICBtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIG1lcmdlQ29uZmlnKGNvbmZpZzEsIGNvbmZpZzIpIHtcbiAgICAgIGNvbmZpZzIgPSBjb25maWcyIHx8IHt9O1xuICAgICAgdmFyIGNvbmZpZyA9IHt9O1xuICAgICAgZnVuY3Rpb24gZ2V0TWVyZ2VkVmFsdWUodGFyZ2V0LCBzb3VyY2UpIHtcbiAgICAgICAgaWYgKHV0aWxzLmlzUGxhaW5PYmplY3QodGFyZ2V0KSAmJiB1dGlscy5pc1BsYWluT2JqZWN0KHNvdXJjZSkpIHtcbiAgICAgICAgICByZXR1cm4gdXRpbHMubWVyZ2UodGFyZ2V0LCBzb3VyY2UpO1xuICAgICAgICB9IGVsc2UgaWYgKHV0aWxzLmlzUGxhaW5PYmplY3Qoc291cmNlKSkge1xuICAgICAgICAgIHJldHVybiB1dGlscy5tZXJnZSh7fSwgc291cmNlKTtcbiAgICAgICAgfSBlbHNlIGlmICh1dGlscy5pc0FycmF5KHNvdXJjZSkpIHtcbiAgICAgICAgICByZXR1cm4gc291cmNlLnNsaWNlKCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHNvdXJjZTtcbiAgICAgIH1cbiAgICAgIGZ1bmN0aW9uIG1lcmdlRGVlcFByb3BlcnRpZXMocHJvcCkge1xuICAgICAgICBpZiAoIXV0aWxzLmlzVW5kZWZpbmVkKGNvbmZpZzJbcHJvcF0pKSB7XG4gICAgICAgICAgcmV0dXJuIGdldE1lcmdlZFZhbHVlKGNvbmZpZzFbcHJvcF0sIGNvbmZpZzJbcHJvcF0pO1xuICAgICAgICB9IGVsc2UgaWYgKCF1dGlscy5pc1VuZGVmaW5lZChjb25maWcxW3Byb3BdKSkge1xuICAgICAgICAgIHJldHVybiBnZXRNZXJnZWRWYWx1ZSh2b2lkIDAsIGNvbmZpZzFbcHJvcF0pO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBmdW5jdGlvbiB2YWx1ZUZyb21Db25maWcyKHByb3ApIHtcbiAgICAgICAgaWYgKCF1dGlscy5pc1VuZGVmaW5lZChjb25maWcyW3Byb3BdKSkge1xuICAgICAgICAgIHJldHVybiBnZXRNZXJnZWRWYWx1ZSh2b2lkIDAsIGNvbmZpZzJbcHJvcF0pO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBmdW5jdGlvbiBkZWZhdWx0VG9Db25maWcyKHByb3ApIHtcbiAgICAgICAgaWYgKCF1dGlscy5pc1VuZGVmaW5lZChjb25maWcyW3Byb3BdKSkge1xuICAgICAgICAgIHJldHVybiBnZXRNZXJnZWRWYWx1ZSh2b2lkIDAsIGNvbmZpZzJbcHJvcF0pO1xuICAgICAgICB9IGVsc2UgaWYgKCF1dGlscy5pc1VuZGVmaW5lZChjb25maWcxW3Byb3BdKSkge1xuICAgICAgICAgIHJldHVybiBnZXRNZXJnZWRWYWx1ZSh2b2lkIDAsIGNvbmZpZzFbcHJvcF0pO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBmdW5jdGlvbiBtZXJnZURpcmVjdEtleXMocHJvcCkge1xuICAgICAgICBpZiAocHJvcCBpbiBjb25maWcyKSB7XG4gICAgICAgICAgcmV0dXJuIGdldE1lcmdlZFZhbHVlKGNvbmZpZzFbcHJvcF0sIGNvbmZpZzJbcHJvcF0pO1xuICAgICAgICB9IGVsc2UgaWYgKHByb3AgaW4gY29uZmlnMSkge1xuICAgICAgICAgIHJldHVybiBnZXRNZXJnZWRWYWx1ZSh2b2lkIDAsIGNvbmZpZzFbcHJvcF0pO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICB2YXIgbWVyZ2VNYXAgPSB7XG4gICAgICAgIFwidXJsXCI6IHZhbHVlRnJvbUNvbmZpZzIsXG4gICAgICAgIFwibWV0aG9kXCI6IHZhbHVlRnJvbUNvbmZpZzIsXG4gICAgICAgIFwiZGF0YVwiOiB2YWx1ZUZyb21Db25maWcyLFxuICAgICAgICBcImJhc2VVUkxcIjogZGVmYXVsdFRvQ29uZmlnMixcbiAgICAgICAgXCJ0cmFuc2Zvcm1SZXF1ZXN0XCI6IGRlZmF1bHRUb0NvbmZpZzIsXG4gICAgICAgIFwidHJhbnNmb3JtUmVzcG9uc2VcIjogZGVmYXVsdFRvQ29uZmlnMixcbiAgICAgICAgXCJwYXJhbXNTZXJpYWxpemVyXCI6IGRlZmF1bHRUb0NvbmZpZzIsXG4gICAgICAgIFwidGltZW91dFwiOiBkZWZhdWx0VG9Db25maWcyLFxuICAgICAgICBcInRpbWVvdXRNZXNzYWdlXCI6IGRlZmF1bHRUb0NvbmZpZzIsXG4gICAgICAgIFwid2l0aENyZWRlbnRpYWxzXCI6IGRlZmF1bHRUb0NvbmZpZzIsXG4gICAgICAgIFwiYWRhcHRlclwiOiBkZWZhdWx0VG9Db25maWcyLFxuICAgICAgICBcInJlc3BvbnNlVHlwZVwiOiBkZWZhdWx0VG9Db25maWcyLFxuICAgICAgICBcInhzcmZDb29raWVOYW1lXCI6IGRlZmF1bHRUb0NvbmZpZzIsXG4gICAgICAgIFwieHNyZkhlYWRlck5hbWVcIjogZGVmYXVsdFRvQ29uZmlnMixcbiAgICAgICAgXCJvblVwbG9hZFByb2dyZXNzXCI6IGRlZmF1bHRUb0NvbmZpZzIsXG4gICAgICAgIFwib25Eb3dubG9hZFByb2dyZXNzXCI6IGRlZmF1bHRUb0NvbmZpZzIsXG4gICAgICAgIFwiZGVjb21wcmVzc1wiOiBkZWZhdWx0VG9Db25maWcyLFxuICAgICAgICBcIm1heENvbnRlbnRMZW5ndGhcIjogZGVmYXVsdFRvQ29uZmlnMixcbiAgICAgICAgXCJtYXhCb2R5TGVuZ3RoXCI6IGRlZmF1bHRUb0NvbmZpZzIsXG4gICAgICAgIFwiYmVmb3JlUmVkaXJlY3RcIjogZGVmYXVsdFRvQ29uZmlnMixcbiAgICAgICAgXCJ0cmFuc3BvcnRcIjogZGVmYXVsdFRvQ29uZmlnMixcbiAgICAgICAgXCJodHRwQWdlbnRcIjogZGVmYXVsdFRvQ29uZmlnMixcbiAgICAgICAgXCJodHRwc0FnZW50XCI6IGRlZmF1bHRUb0NvbmZpZzIsXG4gICAgICAgIFwiY2FuY2VsVG9rZW5cIjogZGVmYXVsdFRvQ29uZmlnMixcbiAgICAgICAgXCJzb2NrZXRQYXRoXCI6IGRlZmF1bHRUb0NvbmZpZzIsXG4gICAgICAgIFwicmVzcG9uc2VFbmNvZGluZ1wiOiBkZWZhdWx0VG9Db25maWcyLFxuICAgICAgICBcInZhbGlkYXRlU3RhdHVzXCI6IG1lcmdlRGlyZWN0S2V5c1xuICAgICAgfTtcbiAgICAgIHV0aWxzLmZvckVhY2goT2JqZWN0LmtleXMoY29uZmlnMSkuY29uY2F0KE9iamVjdC5rZXlzKGNvbmZpZzIpKSwgZnVuY3Rpb24gY29tcHV0ZUNvbmZpZ1ZhbHVlKHByb3ApIHtcbiAgICAgICAgdmFyIG1lcmdlID0gbWVyZ2VNYXBbcHJvcF0gfHwgbWVyZ2VEZWVwUHJvcGVydGllcztcbiAgICAgICAgdmFyIGNvbmZpZ1ZhbHVlID0gbWVyZ2UocHJvcCk7XG4gICAgICAgIHV0aWxzLmlzVW5kZWZpbmVkKGNvbmZpZ1ZhbHVlKSAmJiBtZXJnZSAhPT0gbWVyZ2VEaXJlY3RLZXlzIHx8IChjb25maWdbcHJvcF0gPSBjb25maWdWYWx1ZSk7XG4gICAgICB9KTtcbiAgICAgIHJldHVybiBjb25maWc7XG4gICAgfTtcbiAgfVxufSk7XG5cbi8vIG5vZGVfbW9kdWxlcy9heGlvcy9saWIvZW52L2RhdGEuanNcbnZhciByZXF1aXJlX2RhdGEgPSBfX2NvbW1vbkpTKHtcbiAgXCJub2RlX21vZHVsZXMvYXhpb3MvbGliL2Vudi9kYXRhLmpzXCIoZXhwb3J0cywgbW9kdWxlKSB7XG4gICAgbW9kdWxlLmV4cG9ydHMgPSB7XG4gICAgICBcInZlcnNpb25cIjogXCIwLjI3LjJcIlxuICAgIH07XG4gIH1cbn0pO1xuXG4vLyBub2RlX21vZHVsZXMvYXhpb3MvbGliL2hlbHBlcnMvdmFsaWRhdG9yLmpzXG52YXIgcmVxdWlyZV92YWxpZGF0b3IgPSBfX2NvbW1vbkpTKHtcbiAgXCJub2RlX21vZHVsZXMvYXhpb3MvbGliL2hlbHBlcnMvdmFsaWRhdG9yLmpzXCIoZXhwb3J0cywgbW9kdWxlKSB7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG4gICAgdmFyIFZFUlNJT04gPSByZXF1aXJlX2RhdGEoKS52ZXJzaW9uO1xuICAgIHZhciBBeGlvc0Vycm9yID0gcmVxdWlyZV9BeGlvc0Vycm9yKCk7XG4gICAgdmFyIHZhbGlkYXRvcnMgPSB7fTtcbiAgICBbXCJvYmplY3RcIiwgXCJib29sZWFuXCIsIFwibnVtYmVyXCIsIFwiZnVuY3Rpb25cIiwgXCJzdHJpbmdcIiwgXCJzeW1ib2xcIl0uZm9yRWFjaChmdW5jdGlvbih0eXBlLCBpMikge1xuICAgICAgdmFsaWRhdG9yc1t0eXBlXSA9IGZ1bmN0aW9uIHZhbGlkYXRvcih0aGluZykge1xuICAgICAgICByZXR1cm4gdHlwZW9mIHRoaW5nID09PSB0eXBlIHx8IFwiYVwiICsgKGkyIDwgMSA/IFwibiBcIiA6IFwiIFwiKSArIHR5cGU7XG4gICAgICB9O1xuICAgIH0pO1xuICAgIHZhciBkZXByZWNhdGVkV2FybmluZ3MgPSB7fTtcbiAgICB2YWxpZGF0b3JzLnRyYW5zaXRpb25hbCA9IGZ1bmN0aW9uIHRyYW5zaXRpb25hbCh2YWxpZGF0b3IsIHZlcnNpb24sIG1lc3NhZ2UpIHtcbiAgICAgIGZ1bmN0aW9uIGZvcm1hdE1lc3NhZ2Uob3B0LCBkZXNjKSB7XG4gICAgICAgIHJldHVybiBcIltBeGlvcyB2XCIgKyBWRVJTSU9OICsgXCJdIFRyYW5zaXRpb25hbCBvcHRpb24gJ1wiICsgb3B0ICsgXCInXCIgKyBkZXNjICsgKG1lc3NhZ2UgPyBcIi4gXCIgKyBtZXNzYWdlIDogXCJcIik7XG4gICAgICB9XG4gICAgICByZXR1cm4gZnVuY3Rpb24odmFsdWUsIG9wdCwgb3B0cykge1xuICAgICAgICBpZiAodmFsaWRhdG9yID09PSBmYWxzZSkge1xuICAgICAgICAgIHRocm93IG5ldyBBeGlvc0Vycm9yKFxuICAgICAgICAgICAgZm9ybWF0TWVzc2FnZShvcHQsIFwiIGhhcyBiZWVuIHJlbW92ZWRcIiArICh2ZXJzaW9uID8gXCIgaW4gXCIgKyB2ZXJzaW9uIDogXCJcIikpLFxuICAgICAgICAgICAgQXhpb3NFcnJvci5FUlJfREVQUkVDQVRFRFxuICAgICAgICAgICk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHZlcnNpb24gJiYgIWRlcHJlY2F0ZWRXYXJuaW5nc1tvcHRdKSB7XG4gICAgICAgICAgZGVwcmVjYXRlZFdhcm5pbmdzW29wdF0gPSB0cnVlO1xuICAgICAgICAgIGNvbnNvbGUud2FybihcbiAgICAgICAgICAgIGZvcm1hdE1lc3NhZ2UoXG4gICAgICAgICAgICAgIG9wdCxcbiAgICAgICAgICAgICAgXCIgaGFzIGJlZW4gZGVwcmVjYXRlZCBzaW5jZSB2XCIgKyB2ZXJzaW9uICsgXCIgYW5kIHdpbGwgYmUgcmVtb3ZlZCBpbiB0aGUgbmVhciBmdXR1cmVcIlxuICAgICAgICAgICAgKVxuICAgICAgICAgICk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHZhbGlkYXRvciA/IHZhbGlkYXRvcih2YWx1ZSwgb3B0LCBvcHRzKSA6IHRydWU7XG4gICAgICB9O1xuICAgIH07XG4gICAgZnVuY3Rpb24gYXNzZXJ0T3B0aW9ucyhvcHRpb25zLCBzY2hlbWEsIGFsbG93VW5rbm93bikge1xuICAgICAgaWYgKHR5cGVvZiBvcHRpb25zICE9PSBcIm9iamVjdFwiKSB7XG4gICAgICAgIHRocm93IG5ldyBBeGlvc0Vycm9yKFwib3B0aW9ucyBtdXN0IGJlIGFuIG9iamVjdFwiLCBBeGlvc0Vycm9yLkVSUl9CQURfT1BUSU9OX1ZBTFVFKTtcbiAgICAgIH1cbiAgICAgIHZhciBrZXlzID0gT2JqZWN0LmtleXMob3B0aW9ucyk7XG4gICAgICB2YXIgaTIgPSBrZXlzLmxlbmd0aDtcbiAgICAgIHdoaWxlIChpMi0tID4gMCkge1xuICAgICAgICB2YXIgb3B0ID0ga2V5c1tpMl07XG4gICAgICAgIHZhciB2YWxpZGF0b3IgPSBzY2hlbWFbb3B0XTtcbiAgICAgICAgaWYgKHZhbGlkYXRvcikge1xuICAgICAgICAgIHZhciB2YWx1ZSA9IG9wdGlvbnNbb3B0XTtcbiAgICAgICAgICB2YXIgcmVzdWx0ID0gdmFsdWUgPT09IHZvaWQgMCB8fCB2YWxpZGF0b3IodmFsdWUsIG9wdCwgb3B0aW9ucyk7XG4gICAgICAgICAgaWYgKHJlc3VsdCAhPT0gdHJ1ZSkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEF4aW9zRXJyb3IoXCJvcHRpb24gXCIgKyBvcHQgKyBcIiBtdXN0IGJlIFwiICsgcmVzdWx0LCBBeGlvc0Vycm9yLkVSUl9CQURfT1BUSU9OX1ZBTFVFKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgY29udGludWU7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGFsbG93VW5rbm93biAhPT0gdHJ1ZSkge1xuICAgICAgICAgIHRocm93IG5ldyBBeGlvc0Vycm9yKFwiVW5rbm93biBvcHRpb24gXCIgKyBvcHQsIEF4aW9zRXJyb3IuRVJSX0JBRF9PUFRJT04pO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIG1vZHVsZS5leHBvcnRzID0ge1xuICAgICAgYXNzZXJ0T3B0aW9ucyxcbiAgICAgIHZhbGlkYXRvcnNcbiAgICB9O1xuICB9XG59KTtcblxuLy8gbm9kZV9tb2R1bGVzL2F4aW9zL2xpYi9jb3JlL0F4aW9zLmpzXG52YXIgcmVxdWlyZV9BeGlvcyA9IF9fY29tbW9uSlMoe1xuICBcIm5vZGVfbW9kdWxlcy9heGlvcy9saWIvY29yZS9BeGlvcy5qc1wiKGV4cG9ydHMsIG1vZHVsZSkge1xuICAgIFwidXNlIHN0cmljdFwiO1xuICAgIHZhciB1dGlscyA9IHJlcXVpcmVfdXRpbHMoKTtcbiAgICB2YXIgYnVpbGRVUkwgPSByZXF1aXJlX2J1aWxkVVJMKCk7XG4gICAgdmFyIEludGVyY2VwdG9yTWFuYWdlciA9IHJlcXVpcmVfSW50ZXJjZXB0b3JNYW5hZ2VyKCk7XG4gICAgdmFyIGRpc3BhdGNoUmVxdWVzdCA9IHJlcXVpcmVfZGlzcGF0Y2hSZXF1ZXN0KCk7XG4gICAgdmFyIG1lcmdlQ29uZmlnID0gcmVxdWlyZV9tZXJnZUNvbmZpZygpO1xuICAgIHZhciBidWlsZEZ1bGxQYXRoID0gcmVxdWlyZV9idWlsZEZ1bGxQYXRoKCk7XG4gICAgdmFyIHZhbGlkYXRvciA9IHJlcXVpcmVfdmFsaWRhdG9yKCk7XG4gICAgdmFyIHZhbGlkYXRvcnMgPSB2YWxpZGF0b3IudmFsaWRhdG9ycztcbiAgICBmdW5jdGlvbiBBeGlvcyhpbnN0YW5jZUNvbmZpZykge1xuICAgICAgdGhpcy5kZWZhdWx0cyA9IGluc3RhbmNlQ29uZmlnO1xuICAgICAgdGhpcy5pbnRlcmNlcHRvcnMgPSB7XG4gICAgICAgIHJlcXVlc3Q6IG5ldyBJbnRlcmNlcHRvck1hbmFnZXIoKSxcbiAgICAgICAgcmVzcG9uc2U6IG5ldyBJbnRlcmNlcHRvck1hbmFnZXIoKVxuICAgICAgfTtcbiAgICB9XG4gICAgQXhpb3MucHJvdG90eXBlLnJlcXVlc3QgPSBmdW5jdGlvbiByZXF1ZXN0Mihjb25maWdPclVybCwgY29uZmlnKSB7XG4gICAgICBpZiAodHlwZW9mIGNvbmZpZ09yVXJsID09PSBcInN0cmluZ1wiKSB7XG4gICAgICAgIGNvbmZpZyA9IGNvbmZpZyB8fCB7fTtcbiAgICAgICAgY29uZmlnLnVybCA9IGNvbmZpZ09yVXJsO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY29uZmlnID0gY29uZmlnT3JVcmwgfHwge307XG4gICAgICB9XG4gICAgICBjb25maWcgPSBtZXJnZUNvbmZpZyh0aGlzLmRlZmF1bHRzLCBjb25maWcpO1xuICAgICAgaWYgKGNvbmZpZy5tZXRob2QpIHtcbiAgICAgICAgY29uZmlnLm1ldGhvZCA9IGNvbmZpZy5tZXRob2QudG9Mb3dlckNhc2UoKTtcbiAgICAgIH0gZWxzZSBpZiAodGhpcy5kZWZhdWx0cy5tZXRob2QpIHtcbiAgICAgICAgY29uZmlnLm1ldGhvZCA9IHRoaXMuZGVmYXVsdHMubWV0aG9kLnRvTG93ZXJDYXNlKCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjb25maWcubWV0aG9kID0gXCJnZXRcIjtcbiAgICAgIH1cbiAgICAgIHZhciB0cmFuc2l0aW9uYWwgPSBjb25maWcudHJhbnNpdGlvbmFsO1xuICAgICAgaWYgKHRyYW5zaXRpb25hbCAhPT0gdm9pZCAwKSB7XG4gICAgICAgIHZhbGlkYXRvci5hc3NlcnRPcHRpb25zKHRyYW5zaXRpb25hbCwge1xuICAgICAgICAgIHNpbGVudEpTT05QYXJzaW5nOiB2YWxpZGF0b3JzLnRyYW5zaXRpb25hbCh2YWxpZGF0b3JzLmJvb2xlYW4pLFxuICAgICAgICAgIGZvcmNlZEpTT05QYXJzaW5nOiB2YWxpZGF0b3JzLnRyYW5zaXRpb25hbCh2YWxpZGF0b3JzLmJvb2xlYW4pLFxuICAgICAgICAgIGNsYXJpZnlUaW1lb3V0RXJyb3I6IHZhbGlkYXRvcnMudHJhbnNpdGlvbmFsKHZhbGlkYXRvcnMuYm9vbGVhbilcbiAgICAgICAgfSwgZmFsc2UpO1xuICAgICAgfVxuICAgICAgdmFyIHJlcXVlc3RJbnRlcmNlcHRvckNoYWluID0gW107XG4gICAgICB2YXIgc3luY2hyb25vdXNSZXF1ZXN0SW50ZXJjZXB0b3JzID0gdHJ1ZTtcbiAgICAgIHRoaXMuaW50ZXJjZXB0b3JzLnJlcXVlc3QuZm9yRWFjaChmdW5jdGlvbiB1bnNoaWZ0UmVxdWVzdEludGVyY2VwdG9ycyhpbnRlcmNlcHRvcikge1xuICAgICAgICBpZiAodHlwZW9mIGludGVyY2VwdG9yLnJ1bldoZW4gPT09IFwiZnVuY3Rpb25cIiAmJiBpbnRlcmNlcHRvci5ydW5XaGVuKGNvbmZpZykgPT09IGZhbHNlKSB7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIHN5bmNocm9ub3VzUmVxdWVzdEludGVyY2VwdG9ycyA9IHN5bmNocm9ub3VzUmVxdWVzdEludGVyY2VwdG9ycyAmJiBpbnRlcmNlcHRvci5zeW5jaHJvbm91cztcbiAgICAgICAgcmVxdWVzdEludGVyY2VwdG9yQ2hhaW4udW5zaGlmdChpbnRlcmNlcHRvci5mdWxmaWxsZWQsIGludGVyY2VwdG9yLnJlamVjdGVkKTtcbiAgICAgIH0pO1xuICAgICAgdmFyIHJlc3BvbnNlSW50ZXJjZXB0b3JDaGFpbiA9IFtdO1xuICAgICAgdGhpcy5pbnRlcmNlcHRvcnMucmVzcG9uc2UuZm9yRWFjaChmdW5jdGlvbiBwdXNoUmVzcG9uc2VJbnRlcmNlcHRvcnMoaW50ZXJjZXB0b3IpIHtcbiAgICAgICAgcmVzcG9uc2VJbnRlcmNlcHRvckNoYWluLnB1c2goaW50ZXJjZXB0b3IuZnVsZmlsbGVkLCBpbnRlcmNlcHRvci5yZWplY3RlZCk7XG4gICAgICB9KTtcbiAgICAgIHZhciBwcm9taXNlO1xuICAgICAgaWYgKCFzeW5jaHJvbm91c1JlcXVlc3RJbnRlcmNlcHRvcnMpIHtcbiAgICAgICAgdmFyIGNoYWluID0gW2Rpc3BhdGNoUmVxdWVzdCwgdm9pZCAwXTtcbiAgICAgICAgQXJyYXkucHJvdG90eXBlLnVuc2hpZnQuYXBwbHkoY2hhaW4sIHJlcXVlc3RJbnRlcmNlcHRvckNoYWluKTtcbiAgICAgICAgY2hhaW4gPSBjaGFpbi5jb25jYXQocmVzcG9uc2VJbnRlcmNlcHRvckNoYWluKTtcbiAgICAgICAgcHJvbWlzZSA9IFByb21pc2UucmVzb2x2ZShjb25maWcpO1xuICAgICAgICB3aGlsZSAoY2hhaW4ubGVuZ3RoKSB7XG4gICAgICAgICAgcHJvbWlzZSA9IHByb21pc2UudGhlbihjaGFpbi5zaGlmdCgpLCBjaGFpbi5zaGlmdCgpKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcHJvbWlzZTtcbiAgICAgIH1cbiAgICAgIHZhciBuZXdDb25maWcgPSBjb25maWc7XG4gICAgICB3aGlsZSAocmVxdWVzdEludGVyY2VwdG9yQ2hhaW4ubGVuZ3RoKSB7XG4gICAgICAgIHZhciBvbkZ1bGZpbGxlZCA9IHJlcXVlc3RJbnRlcmNlcHRvckNoYWluLnNoaWZ0KCk7XG4gICAgICAgIHZhciBvblJlamVjdGVkID0gcmVxdWVzdEludGVyY2VwdG9yQ2hhaW4uc2hpZnQoKTtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICBuZXdDb25maWcgPSBvbkZ1bGZpbGxlZChuZXdDb25maWcpO1xuICAgICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICAgIG9uUmVqZWN0ZWQoZXJyb3IpO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICB0cnkge1xuICAgICAgICBwcm9taXNlID0gZGlzcGF0Y2hSZXF1ZXN0KG5ld0NvbmZpZyk7XG4gICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QoZXJyb3IpO1xuICAgICAgfVxuICAgICAgd2hpbGUgKHJlc3BvbnNlSW50ZXJjZXB0b3JDaGFpbi5sZW5ndGgpIHtcbiAgICAgICAgcHJvbWlzZSA9IHByb21pc2UudGhlbihyZXNwb25zZUludGVyY2VwdG9yQ2hhaW4uc2hpZnQoKSwgcmVzcG9uc2VJbnRlcmNlcHRvckNoYWluLnNoaWZ0KCkpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHByb21pc2U7XG4gICAgfTtcbiAgICBBeGlvcy5wcm90b3R5cGUuZ2V0VXJpID0gZnVuY3Rpb24gZ2V0VXJpKGNvbmZpZykge1xuICAgICAgY29uZmlnID0gbWVyZ2VDb25maWcodGhpcy5kZWZhdWx0cywgY29uZmlnKTtcbiAgICAgIHZhciBmdWxsUGF0aCA9IGJ1aWxkRnVsbFBhdGgoY29uZmlnLmJhc2VVUkwsIGNvbmZpZy51cmwpO1xuICAgICAgcmV0dXJuIGJ1aWxkVVJMKGZ1bGxQYXRoLCBjb25maWcucGFyYW1zLCBjb25maWcucGFyYW1zU2VyaWFsaXplcik7XG4gICAgfTtcbiAgICB1dGlscy5mb3JFYWNoKFtcImRlbGV0ZVwiLCBcImdldFwiLCBcImhlYWRcIiwgXCJvcHRpb25zXCJdLCBmdW5jdGlvbiBmb3JFYWNoTWV0aG9kTm9EYXRhKG1ldGhvZCkge1xuICAgICAgQXhpb3MucHJvdG90eXBlW21ldGhvZF0gPSBmdW5jdGlvbih1cmwsIGNvbmZpZykge1xuICAgICAgICByZXR1cm4gdGhpcy5yZXF1ZXN0KG1lcmdlQ29uZmlnKGNvbmZpZyB8fCB7fSwge1xuICAgICAgICAgIG1ldGhvZCxcbiAgICAgICAgICB1cmwsXG4gICAgICAgICAgZGF0YTogKGNvbmZpZyB8fCB7fSkuZGF0YVxuICAgICAgICB9KSk7XG4gICAgICB9O1xuICAgIH0pO1xuICAgIHV0aWxzLmZvckVhY2goW1wicG9zdFwiLCBcInB1dFwiLCBcInBhdGNoXCJdLCBmdW5jdGlvbiBmb3JFYWNoTWV0aG9kV2l0aERhdGEobWV0aG9kKSB7XG4gICAgICBmdW5jdGlvbiBnZW5lcmF0ZUhUVFBNZXRob2QoaXNGb3JtKSB7XG4gICAgICAgIHJldHVybiBmdW5jdGlvbiBodHRwTWV0aG9kKHVybCwgZGF0YSwgY29uZmlnKSB7XG4gICAgICAgICAgcmV0dXJuIHRoaXMucmVxdWVzdChtZXJnZUNvbmZpZyhjb25maWcgfHwge30sIHtcbiAgICAgICAgICAgIG1ldGhvZCxcbiAgICAgICAgICAgIGhlYWRlcnM6IGlzRm9ybSA/IHtcbiAgICAgICAgICAgICAgXCJDb250ZW50LVR5cGVcIjogXCJtdWx0aXBhcnQvZm9ybS1kYXRhXCJcbiAgICAgICAgICAgIH0gOiB7fSxcbiAgICAgICAgICAgIHVybCxcbiAgICAgICAgICAgIGRhdGFcbiAgICAgICAgICB9KSk7XG4gICAgICAgIH07XG4gICAgICB9XG4gICAgICBBeGlvcy5wcm90b3R5cGVbbWV0aG9kXSA9IGdlbmVyYXRlSFRUUE1ldGhvZCgpO1xuICAgICAgQXhpb3MucHJvdG90eXBlW21ldGhvZCArIFwiRm9ybVwiXSA9IGdlbmVyYXRlSFRUUE1ldGhvZCh0cnVlKTtcbiAgICB9KTtcbiAgICBtb2R1bGUuZXhwb3J0cyA9IEF4aW9zO1xuICB9XG59KTtcblxuLy8gbm9kZV9tb2R1bGVzL2F4aW9zL2xpYi9jYW5jZWwvQ2FuY2VsVG9rZW4uanNcbnZhciByZXF1aXJlX0NhbmNlbFRva2VuID0gX19jb21tb25KUyh7XG4gIFwibm9kZV9tb2R1bGVzL2F4aW9zL2xpYi9jYW5jZWwvQ2FuY2VsVG9rZW4uanNcIihleHBvcnRzLCBtb2R1bGUpIHtcbiAgICBcInVzZSBzdHJpY3RcIjtcbiAgICB2YXIgQ2FuY2VsZWRFcnJvciA9IHJlcXVpcmVfQ2FuY2VsZWRFcnJvcigpO1xuICAgIGZ1bmN0aW9uIENhbmNlbFRva2VuKGV4ZWN1dG9yKSB7XG4gICAgICBpZiAodHlwZW9mIGV4ZWN1dG9yICE9PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcihcImV4ZWN1dG9yIG11c3QgYmUgYSBmdW5jdGlvbi5cIik7XG4gICAgICB9XG4gICAgICB2YXIgcmVzb2x2ZVByb21pc2U7XG4gICAgICB0aGlzLnByb21pc2UgPSBuZXcgUHJvbWlzZShmdW5jdGlvbiBwcm9taXNlRXhlY3V0b3IocmVzb2x2ZSkge1xuICAgICAgICByZXNvbHZlUHJvbWlzZSA9IHJlc29sdmU7XG4gICAgICB9KTtcbiAgICAgIHZhciB0b2tlbiA9IHRoaXM7XG4gICAgICB0aGlzLnByb21pc2UudGhlbihmdW5jdGlvbihjYW5jZWwpIHtcbiAgICAgICAgaWYgKCF0b2tlbi5fbGlzdGVuZXJzKVxuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgdmFyIGkyO1xuICAgICAgICB2YXIgbDIgPSB0b2tlbi5fbGlzdGVuZXJzLmxlbmd0aDtcbiAgICAgICAgZm9yIChpMiA9IDA7IGkyIDwgbDI7IGkyKyspIHtcbiAgICAgICAgICB0b2tlbi5fbGlzdGVuZXJzW2kyXShjYW5jZWwpO1xuICAgICAgICB9XG4gICAgICAgIHRva2VuLl9saXN0ZW5lcnMgPSBudWxsO1xuICAgICAgfSk7XG4gICAgICB0aGlzLnByb21pc2UudGhlbiA9IGZ1bmN0aW9uKG9uZnVsZmlsbGVkKSB7XG4gICAgICAgIHZhciBfcmVzb2x2ZTtcbiAgICAgICAgdmFyIHByb21pc2UgPSBuZXcgUHJvbWlzZShmdW5jdGlvbihyZXNvbHZlKSB7XG4gICAgICAgICAgdG9rZW4uc3Vic2NyaWJlKHJlc29sdmUpO1xuICAgICAgICAgIF9yZXNvbHZlID0gcmVzb2x2ZTtcbiAgICAgICAgfSkudGhlbihvbmZ1bGZpbGxlZCk7XG4gICAgICAgIHByb21pc2UuY2FuY2VsID0gZnVuY3Rpb24gcmVqZWN0KCkge1xuICAgICAgICAgIHRva2VuLnVuc3Vic2NyaWJlKF9yZXNvbHZlKTtcbiAgICAgICAgfTtcbiAgICAgICAgcmV0dXJuIHByb21pc2U7XG4gICAgICB9O1xuICAgICAgZXhlY3V0b3IoZnVuY3Rpb24gY2FuY2VsKG1lc3NhZ2UpIHtcbiAgICAgICAgaWYgKHRva2VuLnJlYXNvbikge1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICB0b2tlbi5yZWFzb24gPSBuZXcgQ2FuY2VsZWRFcnJvcihtZXNzYWdlKTtcbiAgICAgICAgcmVzb2x2ZVByb21pc2UodG9rZW4ucmVhc29uKTtcbiAgICAgIH0pO1xuICAgIH1cbiAgICBDYW5jZWxUb2tlbi5wcm90b3R5cGUudGhyb3dJZlJlcXVlc3RlZCA9IGZ1bmN0aW9uIHRocm93SWZSZXF1ZXN0ZWQoKSB7XG4gICAgICBpZiAodGhpcy5yZWFzb24pIHtcbiAgICAgICAgdGhyb3cgdGhpcy5yZWFzb247XG4gICAgICB9XG4gICAgfTtcbiAgICBDYW5jZWxUb2tlbi5wcm90b3R5cGUuc3Vic2NyaWJlID0gZnVuY3Rpb24gc3Vic2NyaWJlKGxpc3RlbmVyKSB7XG4gICAgICBpZiAodGhpcy5yZWFzb24pIHtcbiAgICAgICAgbGlzdGVuZXIodGhpcy5yZWFzb24pO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICBpZiAodGhpcy5fbGlzdGVuZXJzKSB7XG4gICAgICAgIHRoaXMuX2xpc3RlbmVycy5wdXNoKGxpc3RlbmVyKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuX2xpc3RlbmVycyA9IFtsaXN0ZW5lcl07XG4gICAgICB9XG4gICAgfTtcbiAgICBDYW5jZWxUb2tlbi5wcm90b3R5cGUudW5zdWJzY3JpYmUgPSBmdW5jdGlvbiB1bnN1YnNjcmliZShsaXN0ZW5lcikge1xuICAgICAgaWYgKCF0aGlzLl9saXN0ZW5lcnMpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgdmFyIGluZGV4ID0gdGhpcy5fbGlzdGVuZXJzLmluZGV4T2YobGlzdGVuZXIpO1xuICAgICAgaWYgKGluZGV4ICE9PSAtMSkge1xuICAgICAgICB0aGlzLl9saXN0ZW5lcnMuc3BsaWNlKGluZGV4LCAxKTtcbiAgICAgIH1cbiAgICB9O1xuICAgIENhbmNlbFRva2VuLnNvdXJjZSA9IGZ1bmN0aW9uIHNvdXJjZSgpIHtcbiAgICAgIHZhciBjYW5jZWw7XG4gICAgICB2YXIgdG9rZW4gPSBuZXcgQ2FuY2VsVG9rZW4oZnVuY3Rpb24gZXhlY3V0b3IoYzIpIHtcbiAgICAgICAgY2FuY2VsID0gYzI7XG4gICAgICB9KTtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIHRva2VuLFxuICAgICAgICBjYW5jZWxcbiAgICAgIH07XG4gICAgfTtcbiAgICBtb2R1bGUuZXhwb3J0cyA9IENhbmNlbFRva2VuO1xuICB9XG59KTtcblxuLy8gbm9kZV9tb2R1bGVzL2F4aW9zL2xpYi9oZWxwZXJzL3NwcmVhZC5qc1xudmFyIHJlcXVpcmVfc3ByZWFkID0gX19jb21tb25KUyh7XG4gIFwibm9kZV9tb2R1bGVzL2F4aW9zL2xpYi9oZWxwZXJzL3NwcmVhZC5qc1wiKGV4cG9ydHMsIG1vZHVsZSkge1xuICAgIFwidXNlIHN0cmljdFwiO1xuICAgIG1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gc3ByZWFkKGNhbGxiYWNrKSB7XG4gICAgICByZXR1cm4gZnVuY3Rpb24gd3JhcChhcnIpIHtcbiAgICAgICAgcmV0dXJuIGNhbGxiYWNrLmFwcGx5KG51bGwsIGFycik7XG4gICAgICB9O1xuICAgIH07XG4gIH1cbn0pO1xuXG4vLyBub2RlX21vZHVsZXMvYXhpb3MvbGliL2hlbHBlcnMvaXNBeGlvc0Vycm9yLmpzXG52YXIgcmVxdWlyZV9pc0F4aW9zRXJyb3IgPSBfX2NvbW1vbkpTKHtcbiAgXCJub2RlX21vZHVsZXMvYXhpb3MvbGliL2hlbHBlcnMvaXNBeGlvc0Vycm9yLmpzXCIoZXhwb3J0cywgbW9kdWxlKSB7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG4gICAgdmFyIHV0aWxzID0gcmVxdWlyZV91dGlscygpO1xuICAgIG1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gaXNBeGlvc0Vycm9yKHBheWxvYWQpIHtcbiAgICAgIHJldHVybiB1dGlscy5pc09iamVjdChwYXlsb2FkKSAmJiBwYXlsb2FkLmlzQXhpb3NFcnJvciA9PT0gdHJ1ZTtcbiAgICB9O1xuICB9XG59KTtcblxuLy8gbm9kZV9tb2R1bGVzL2F4aW9zL2xpYi9heGlvcy5qc1xudmFyIHJlcXVpcmVfYXhpb3MgPSBfX2NvbW1vbkpTKHtcbiAgXCJub2RlX21vZHVsZXMvYXhpb3MvbGliL2F4aW9zLmpzXCIoZXhwb3J0cywgbW9kdWxlKSB7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG4gICAgdmFyIHV0aWxzID0gcmVxdWlyZV91dGlscygpO1xuICAgIHZhciBiaW5kID0gcmVxdWlyZV9iaW5kKCk7XG4gICAgdmFyIEF4aW9zID0gcmVxdWlyZV9BeGlvcygpO1xuICAgIHZhciBtZXJnZUNvbmZpZyA9IHJlcXVpcmVfbWVyZ2VDb25maWcoKTtcbiAgICB2YXIgZGVmYXVsdHMgPSByZXF1aXJlX2RlZmF1bHRzKCk7XG4gICAgZnVuY3Rpb24gY3JlYXRlSW5zdGFuY2UoZGVmYXVsdENvbmZpZykge1xuICAgICAgdmFyIGNvbnRleHQgPSBuZXcgQXhpb3MoZGVmYXVsdENvbmZpZyk7XG4gICAgICB2YXIgaW5zdGFuY2UgPSBiaW5kKEF4aW9zLnByb3RvdHlwZS5yZXF1ZXN0LCBjb250ZXh0KTtcbiAgICAgIHV0aWxzLmV4dGVuZChpbnN0YW5jZSwgQXhpb3MucHJvdG90eXBlLCBjb250ZXh0KTtcbiAgICAgIHV0aWxzLmV4dGVuZChpbnN0YW5jZSwgY29udGV4dCk7XG4gICAgICBpbnN0YW5jZS5jcmVhdGUgPSBmdW5jdGlvbiBjcmVhdGUoaW5zdGFuY2VDb25maWcpIHtcbiAgICAgICAgcmV0dXJuIGNyZWF0ZUluc3RhbmNlKG1lcmdlQ29uZmlnKGRlZmF1bHRDb25maWcsIGluc3RhbmNlQ29uZmlnKSk7XG4gICAgICB9O1xuICAgICAgcmV0dXJuIGluc3RhbmNlO1xuICAgIH1cbiAgICB2YXIgYXhpb3MyID0gY3JlYXRlSW5zdGFuY2UoZGVmYXVsdHMpO1xuICAgIGF4aW9zMi5BeGlvcyA9IEF4aW9zO1xuICAgIGF4aW9zMi5DYW5jZWxlZEVycm9yID0gcmVxdWlyZV9DYW5jZWxlZEVycm9yKCk7XG4gICAgYXhpb3MyLkNhbmNlbFRva2VuID0gcmVxdWlyZV9DYW5jZWxUb2tlbigpO1xuICAgIGF4aW9zMi5pc0NhbmNlbCA9IHJlcXVpcmVfaXNDYW5jZWwoKTtcbiAgICBheGlvczIuVkVSU0lPTiA9IHJlcXVpcmVfZGF0YSgpLnZlcnNpb247XG4gICAgYXhpb3MyLnRvRm9ybURhdGEgPSByZXF1aXJlX3RvRm9ybURhdGEoKTtcbiAgICBheGlvczIuQXhpb3NFcnJvciA9IHJlcXVpcmVfQXhpb3NFcnJvcigpO1xuICAgIGF4aW9zMi5DYW5jZWwgPSBheGlvczIuQ2FuY2VsZWRFcnJvcjtcbiAgICBheGlvczIuYWxsID0gZnVuY3Rpb24gYWxsKHByb21pc2VzKSB7XG4gICAgICByZXR1cm4gUHJvbWlzZS5hbGwocHJvbWlzZXMpO1xuICAgIH07XG4gICAgYXhpb3MyLnNwcmVhZCA9IHJlcXVpcmVfc3ByZWFkKCk7XG4gICAgYXhpb3MyLmlzQXhpb3NFcnJvciA9IHJlcXVpcmVfaXNBeGlvc0Vycm9yKCk7XG4gICAgbW9kdWxlLmV4cG9ydHMgPSBheGlvczI7XG4gICAgbW9kdWxlLmV4cG9ydHMuZGVmYXVsdCA9IGF4aW9zMjtcbiAgfVxufSk7XG5cbi8vIG5vZGVfbW9kdWxlcy9heGlvcy9pbmRleC5qc1xudmFyIHJlcXVpcmVfYXhpb3MyID0gX19jb21tb25KUyh7XG4gIFwibm9kZV9tb2R1bGVzL2F4aW9zL2luZGV4LmpzXCIoZXhwb3J0cywgbW9kdWxlKSB7XG4gICAgbW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlX2F4aW9zKCk7XG4gIH1cbn0pO1xuXG4vLyBub2RlX21vZHVsZXMvcmVhY3QtaXMvY2pzL3JlYWN0LWlzLmRldmVsb3BtZW50LmpzXG52YXIgcmVxdWlyZV9yZWFjdF9pc19kZXZlbG9wbWVudCA9IF9fY29tbW9uSlMoe1xuICBcIm5vZGVfbW9kdWxlcy9yZWFjdC1pcy9janMvcmVhY3QtaXMuZGV2ZWxvcG1lbnQuanNcIihleHBvcnRzKSB7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG4gICAgaWYgKHRydWUpIHtcbiAgICAgIChmdW5jdGlvbigpIHtcbiAgICAgICAgXCJ1c2Ugc3RyaWN0XCI7XG4gICAgICAgIHZhciBoYXNTeW1ib2wgPSB0eXBlb2YgU3ltYm9sID09PSBcImZ1bmN0aW9uXCIgJiYgU3ltYm9sLmZvcjtcbiAgICAgICAgdmFyIFJFQUNUX0VMRU1FTlRfVFlQRSA9IGhhc1N5bWJvbCA/IFN5bWJvbC5mb3IoXCJyZWFjdC5lbGVtZW50XCIpIDogNjAxMDM7XG4gICAgICAgIHZhciBSRUFDVF9QT1JUQUxfVFlQRSA9IGhhc1N5bWJvbCA/IFN5bWJvbC5mb3IoXCJyZWFjdC5wb3J0YWxcIikgOiA2MDEwNjtcbiAgICAgICAgdmFyIFJFQUNUX0ZSQUdNRU5UX1RZUEUgPSBoYXNTeW1ib2wgPyBTeW1ib2wuZm9yKFwicmVhY3QuZnJhZ21lbnRcIikgOiA2MDEwNztcbiAgICAgICAgdmFyIFJFQUNUX1NUUklDVF9NT0RFX1RZUEUgPSBoYXNTeW1ib2wgPyBTeW1ib2wuZm9yKFwicmVhY3Quc3RyaWN0X21vZGVcIikgOiA2MDEwODtcbiAgICAgICAgdmFyIFJFQUNUX1BST0ZJTEVSX1RZUEUgPSBoYXNTeW1ib2wgPyBTeW1ib2wuZm9yKFwicmVhY3QucHJvZmlsZXJcIikgOiA2MDExNDtcbiAgICAgICAgdmFyIFJFQUNUX1BST1ZJREVSX1RZUEUgPSBoYXNTeW1ib2wgPyBTeW1ib2wuZm9yKFwicmVhY3QucHJvdmlkZXJcIikgOiA2MDEwOTtcbiAgICAgICAgdmFyIFJFQUNUX0NPTlRFWFRfVFlQRSA9IGhhc1N5bWJvbCA/IFN5bWJvbC5mb3IoXCJyZWFjdC5jb250ZXh0XCIpIDogNjAxMTA7XG4gICAgICAgIHZhciBSRUFDVF9BU1lOQ19NT0RFX1RZUEUgPSBoYXNTeW1ib2wgPyBTeW1ib2wuZm9yKFwicmVhY3QuYXN5bmNfbW9kZVwiKSA6IDYwMTExO1xuICAgICAgICB2YXIgUkVBQ1RfQ09OQ1VSUkVOVF9NT0RFX1RZUEUgPSBoYXNTeW1ib2wgPyBTeW1ib2wuZm9yKFwicmVhY3QuY29uY3VycmVudF9tb2RlXCIpIDogNjAxMTE7XG4gICAgICAgIHZhciBSRUFDVF9GT1JXQVJEX1JFRl9UWVBFID0gaGFzU3ltYm9sID8gU3ltYm9sLmZvcihcInJlYWN0LmZvcndhcmRfcmVmXCIpIDogNjAxMTI7XG4gICAgICAgIHZhciBSRUFDVF9TVVNQRU5TRV9UWVBFID0gaGFzU3ltYm9sID8gU3ltYm9sLmZvcihcInJlYWN0LnN1c3BlbnNlXCIpIDogNjAxMTM7XG4gICAgICAgIHZhciBSRUFDVF9TVVNQRU5TRV9MSVNUX1RZUEUgPSBoYXNTeW1ib2wgPyBTeW1ib2wuZm9yKFwicmVhY3Quc3VzcGVuc2VfbGlzdFwiKSA6IDYwMTIwO1xuICAgICAgICB2YXIgUkVBQ1RfTUVNT19UWVBFID0gaGFzU3ltYm9sID8gU3ltYm9sLmZvcihcInJlYWN0Lm1lbW9cIikgOiA2MDExNTtcbiAgICAgICAgdmFyIFJFQUNUX0xBWllfVFlQRSA9IGhhc1N5bWJvbCA/IFN5bWJvbC5mb3IoXCJyZWFjdC5sYXp5XCIpIDogNjAxMTY7XG4gICAgICAgIHZhciBSRUFDVF9CTE9DS19UWVBFID0gaGFzU3ltYm9sID8gU3ltYm9sLmZvcihcInJlYWN0LmJsb2NrXCIpIDogNjAxMjE7XG4gICAgICAgIHZhciBSRUFDVF9GVU5EQU1FTlRBTF9UWVBFID0gaGFzU3ltYm9sID8gU3ltYm9sLmZvcihcInJlYWN0LmZ1bmRhbWVudGFsXCIpIDogNjAxMTc7XG4gICAgICAgIHZhciBSRUFDVF9SRVNQT05ERVJfVFlQRSA9IGhhc1N5bWJvbCA/IFN5bWJvbC5mb3IoXCJyZWFjdC5yZXNwb25kZXJcIikgOiA2MDExODtcbiAgICAgICAgdmFyIFJFQUNUX1NDT1BFX1RZUEUgPSBoYXNTeW1ib2wgPyBTeW1ib2wuZm9yKFwicmVhY3Quc2NvcGVcIikgOiA2MDExOTtcbiAgICAgICAgZnVuY3Rpb24gaXNWYWxpZEVsZW1lbnRUeXBlMih0eXBlKSB7XG4gICAgICAgICAgcmV0dXJuIHR5cGVvZiB0eXBlID09PSBcInN0cmluZ1wiIHx8IHR5cGVvZiB0eXBlID09PSBcImZ1bmN0aW9uXCIgfHwgdHlwZSA9PT0gUkVBQ1RfRlJBR01FTlRfVFlQRSB8fCB0eXBlID09PSBSRUFDVF9DT05DVVJSRU5UX01PREVfVFlQRSB8fCB0eXBlID09PSBSRUFDVF9QUk9GSUxFUl9UWVBFIHx8IHR5cGUgPT09IFJFQUNUX1NUUklDVF9NT0RFX1RZUEUgfHwgdHlwZSA9PT0gUkVBQ1RfU1VTUEVOU0VfVFlQRSB8fCB0eXBlID09PSBSRUFDVF9TVVNQRU5TRV9MSVNUX1RZUEUgfHwgdHlwZW9mIHR5cGUgPT09IFwib2JqZWN0XCIgJiYgdHlwZSAhPT0gbnVsbCAmJiAodHlwZS4kJHR5cGVvZiA9PT0gUkVBQ1RfTEFaWV9UWVBFIHx8IHR5cGUuJCR0eXBlb2YgPT09IFJFQUNUX01FTU9fVFlQRSB8fCB0eXBlLiQkdHlwZW9mID09PSBSRUFDVF9QUk9WSURFUl9UWVBFIHx8IHR5cGUuJCR0eXBlb2YgPT09IFJFQUNUX0NPTlRFWFRfVFlQRSB8fCB0eXBlLiQkdHlwZW9mID09PSBSRUFDVF9GT1JXQVJEX1JFRl9UWVBFIHx8IHR5cGUuJCR0eXBlb2YgPT09IFJFQUNUX0ZVTkRBTUVOVEFMX1RZUEUgfHwgdHlwZS4kJHR5cGVvZiA9PT0gUkVBQ1RfUkVTUE9OREVSX1RZUEUgfHwgdHlwZS4kJHR5cGVvZiA9PT0gUkVBQ1RfU0NPUEVfVFlQRSB8fCB0eXBlLiQkdHlwZW9mID09PSBSRUFDVF9CTE9DS19UWVBFKTtcbiAgICAgICAgfVxuICAgICAgICBmdW5jdGlvbiB0eXBlT2Yob2JqZWN0KSB7XG4gICAgICAgICAgaWYgKHR5cGVvZiBvYmplY3QgPT09IFwib2JqZWN0XCIgJiYgb2JqZWN0ICE9PSBudWxsKSB7XG4gICAgICAgICAgICB2YXIgJCR0eXBlb2YgPSBvYmplY3QuJCR0eXBlb2Y7XG4gICAgICAgICAgICBzd2l0Y2ggKCQkdHlwZW9mKSB7XG4gICAgICAgICAgICAgIGNhc2UgUkVBQ1RfRUxFTUVOVF9UWVBFOlxuICAgICAgICAgICAgICAgIHZhciB0eXBlID0gb2JqZWN0LnR5cGU7XG4gICAgICAgICAgICAgICAgc3dpdGNoICh0eXBlKSB7XG4gICAgICAgICAgICAgICAgICBjYXNlIFJFQUNUX0FTWU5DX01PREVfVFlQRTpcbiAgICAgICAgICAgICAgICAgIGNhc2UgUkVBQ1RfQ09OQ1VSUkVOVF9NT0RFX1RZUEU6XG4gICAgICAgICAgICAgICAgICBjYXNlIFJFQUNUX0ZSQUdNRU5UX1RZUEU6XG4gICAgICAgICAgICAgICAgICBjYXNlIFJFQUNUX1BST0ZJTEVSX1RZUEU6XG4gICAgICAgICAgICAgICAgICBjYXNlIFJFQUNUX1NUUklDVF9NT0RFX1RZUEU6XG4gICAgICAgICAgICAgICAgICBjYXNlIFJFQUNUX1NVU1BFTlNFX1RZUEU6XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0eXBlO1xuICAgICAgICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICAgICAgdmFyICQkdHlwZW9mVHlwZSA9IHR5cGUgJiYgdHlwZS4kJHR5cGVvZjtcbiAgICAgICAgICAgICAgICAgICAgc3dpdGNoICgkJHR5cGVvZlR5cGUpIHtcbiAgICAgICAgICAgICAgICAgICAgICBjYXNlIFJFQUNUX0NPTlRFWFRfVFlQRTpcbiAgICAgICAgICAgICAgICAgICAgICBjYXNlIFJFQUNUX0ZPUldBUkRfUkVGX1RZUEU6XG4gICAgICAgICAgICAgICAgICAgICAgY2FzZSBSRUFDVF9MQVpZX1RZUEU6XG4gICAgICAgICAgICAgICAgICAgICAgY2FzZSBSRUFDVF9NRU1PX1RZUEU6XG4gICAgICAgICAgICAgICAgICAgICAgY2FzZSBSRUFDVF9QUk9WSURFUl9UWVBFOlxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuICQkdHlwZW9mVHlwZTtcbiAgICAgICAgICAgICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuICQkdHlwZW9mO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICBjYXNlIFJFQUNUX1BPUlRBTF9UWVBFOlxuICAgICAgICAgICAgICAgIHJldHVybiAkJHR5cGVvZjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgICAgcmV0dXJuIHZvaWQgMDtcbiAgICAgICAgfVxuICAgICAgICB2YXIgQXN5bmNNb2RlID0gUkVBQ1RfQVNZTkNfTU9ERV9UWVBFO1xuICAgICAgICB2YXIgQ29uY3VycmVudE1vZGUgPSBSRUFDVF9DT05DVVJSRU5UX01PREVfVFlQRTtcbiAgICAgICAgdmFyIENvbnRleHRDb25zdW1lciA9IFJFQUNUX0NPTlRFWFRfVFlQRTtcbiAgICAgICAgdmFyIENvbnRleHRQcm92aWRlciA9IFJFQUNUX1BST1ZJREVSX1RZUEU7XG4gICAgICAgIHZhciBFbGVtZW50ID0gUkVBQ1RfRUxFTUVOVF9UWVBFO1xuICAgICAgICB2YXIgRm9yd2FyZFJlZiA9IFJFQUNUX0ZPUldBUkRfUkVGX1RZUEU7XG4gICAgICAgIHZhciBGcmFnbWVudDMgPSBSRUFDVF9GUkFHTUVOVF9UWVBFO1xuICAgICAgICB2YXIgTGF6eSA9IFJFQUNUX0xBWllfVFlQRTtcbiAgICAgICAgdmFyIE1lbW8gPSBSRUFDVF9NRU1PX1RZUEU7XG4gICAgICAgIHZhciBQb3J0YWwgPSBSRUFDVF9QT1JUQUxfVFlQRTtcbiAgICAgICAgdmFyIFByb2ZpbGVyID0gUkVBQ1RfUFJPRklMRVJfVFlQRTtcbiAgICAgICAgdmFyIFN0cmljdE1vZGUgPSBSRUFDVF9TVFJJQ1RfTU9ERV9UWVBFO1xuICAgICAgICB2YXIgU3VzcGVuc2UgPSBSRUFDVF9TVVNQRU5TRV9UWVBFO1xuICAgICAgICB2YXIgaGFzV2FybmVkQWJvdXREZXByZWNhdGVkSXNBc3luY01vZGUgPSBmYWxzZTtcbiAgICAgICAgZnVuY3Rpb24gaXNBc3luY01vZGUob2JqZWN0KSB7XG4gICAgICAgICAge1xuICAgICAgICAgICAgaWYgKCFoYXNXYXJuZWRBYm91dERlcHJlY2F0ZWRJc0FzeW5jTW9kZSkge1xuICAgICAgICAgICAgICBoYXNXYXJuZWRBYm91dERlcHJlY2F0ZWRJc0FzeW5jTW9kZSA9IHRydWU7XG4gICAgICAgICAgICAgIGNvbnNvbGVbXCJ3YXJuXCJdKFwiVGhlIFJlYWN0SXMuaXNBc3luY01vZGUoKSBhbGlhcyBoYXMgYmVlbiBkZXByZWNhdGVkLCBhbmQgd2lsbCBiZSByZW1vdmVkIGluIFJlYWN0IDE3Ky4gVXBkYXRlIHlvdXIgY29kZSB0byB1c2UgUmVhY3RJcy5pc0NvbmN1cnJlbnRNb2RlKCkgaW5zdGVhZC4gSXQgaGFzIHRoZSBleGFjdCBzYW1lIEFQSS5cIik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICAgIHJldHVybiBpc0NvbmN1cnJlbnRNb2RlKG9iamVjdCkgfHwgdHlwZU9mKG9iamVjdCkgPT09IFJFQUNUX0FTWU5DX01PREVfVFlQRTtcbiAgICAgICAgfVxuICAgICAgICBmdW5jdGlvbiBpc0NvbmN1cnJlbnRNb2RlKG9iamVjdCkge1xuICAgICAgICAgIHJldHVybiB0eXBlT2Yob2JqZWN0KSA9PT0gUkVBQ1RfQ09OQ1VSUkVOVF9NT0RFX1RZUEU7XG4gICAgICAgIH1cbiAgICAgICAgZnVuY3Rpb24gaXNDb250ZXh0Q29uc3VtZXIyKG9iamVjdCkge1xuICAgICAgICAgIHJldHVybiB0eXBlT2Yob2JqZWN0KSA9PT0gUkVBQ1RfQ09OVEVYVF9UWVBFO1xuICAgICAgICB9XG4gICAgICAgIGZ1bmN0aW9uIGlzQ29udGV4dFByb3ZpZGVyKG9iamVjdCkge1xuICAgICAgICAgIHJldHVybiB0eXBlT2Yob2JqZWN0KSA9PT0gUkVBQ1RfUFJPVklERVJfVFlQRTtcbiAgICAgICAgfVxuICAgICAgICBmdW5jdGlvbiBpc0VsZW1lbnQob2JqZWN0KSB7XG4gICAgICAgICAgcmV0dXJuIHR5cGVvZiBvYmplY3QgPT09IFwib2JqZWN0XCIgJiYgb2JqZWN0ICE9PSBudWxsICYmIG9iamVjdC4kJHR5cGVvZiA9PT0gUkVBQ1RfRUxFTUVOVF9UWVBFO1xuICAgICAgICB9XG4gICAgICAgIGZ1bmN0aW9uIGlzRm9yd2FyZFJlZihvYmplY3QpIHtcbiAgICAgICAgICByZXR1cm4gdHlwZU9mKG9iamVjdCkgPT09IFJFQUNUX0ZPUldBUkRfUkVGX1RZUEU7XG4gICAgICAgIH1cbiAgICAgICAgZnVuY3Rpb24gaXNGcmFnbWVudChvYmplY3QpIHtcbiAgICAgICAgICByZXR1cm4gdHlwZU9mKG9iamVjdCkgPT09IFJFQUNUX0ZSQUdNRU5UX1RZUEU7XG4gICAgICAgIH1cbiAgICAgICAgZnVuY3Rpb24gaXNMYXp5KG9iamVjdCkge1xuICAgICAgICAgIHJldHVybiB0eXBlT2Yob2JqZWN0KSA9PT0gUkVBQ1RfTEFaWV9UWVBFO1xuICAgICAgICB9XG4gICAgICAgIGZ1bmN0aW9uIGlzTWVtbyhvYmplY3QpIHtcbiAgICAgICAgICByZXR1cm4gdHlwZU9mKG9iamVjdCkgPT09IFJFQUNUX01FTU9fVFlQRTtcbiAgICAgICAgfVxuICAgICAgICBmdW5jdGlvbiBpc1BvcnRhbChvYmplY3QpIHtcbiAgICAgICAgICByZXR1cm4gdHlwZU9mKG9iamVjdCkgPT09IFJFQUNUX1BPUlRBTF9UWVBFO1xuICAgICAgICB9XG4gICAgICAgIGZ1bmN0aW9uIGlzUHJvZmlsZXIob2JqZWN0KSB7XG4gICAgICAgICAgcmV0dXJuIHR5cGVPZihvYmplY3QpID09PSBSRUFDVF9QUk9GSUxFUl9UWVBFO1xuICAgICAgICB9XG4gICAgICAgIGZ1bmN0aW9uIGlzU3RyaWN0TW9kZShvYmplY3QpIHtcbiAgICAgICAgICByZXR1cm4gdHlwZU9mKG9iamVjdCkgPT09IFJFQUNUX1NUUklDVF9NT0RFX1RZUEU7XG4gICAgICAgIH1cbiAgICAgICAgZnVuY3Rpb24gaXNTdXNwZW5zZShvYmplY3QpIHtcbiAgICAgICAgICByZXR1cm4gdHlwZU9mKG9iamVjdCkgPT09IFJFQUNUX1NVU1BFTlNFX1RZUEU7XG4gICAgICAgIH1cbiAgICAgICAgZXhwb3J0cy5Bc3luY01vZGUgPSBBc3luY01vZGU7XG4gICAgICAgIGV4cG9ydHMuQ29uY3VycmVudE1vZGUgPSBDb25jdXJyZW50TW9kZTtcbiAgICAgICAgZXhwb3J0cy5Db250ZXh0Q29uc3VtZXIgPSBDb250ZXh0Q29uc3VtZXI7XG4gICAgICAgIGV4cG9ydHMuQ29udGV4dFByb3ZpZGVyID0gQ29udGV4dFByb3ZpZGVyO1xuICAgICAgICBleHBvcnRzLkVsZW1lbnQgPSBFbGVtZW50O1xuICAgICAgICBleHBvcnRzLkZvcndhcmRSZWYgPSBGb3J3YXJkUmVmO1xuICAgICAgICBleHBvcnRzLkZyYWdtZW50ID0gRnJhZ21lbnQzO1xuICAgICAgICBleHBvcnRzLkxhenkgPSBMYXp5O1xuICAgICAgICBleHBvcnRzLk1lbW8gPSBNZW1vO1xuICAgICAgICBleHBvcnRzLlBvcnRhbCA9IFBvcnRhbDtcbiAgICAgICAgZXhwb3J0cy5Qcm9maWxlciA9IFByb2ZpbGVyO1xuICAgICAgICBleHBvcnRzLlN0cmljdE1vZGUgPSBTdHJpY3RNb2RlO1xuICAgICAgICBleHBvcnRzLlN1c3BlbnNlID0gU3VzcGVuc2U7XG4gICAgICAgIGV4cG9ydHMuaXNBc3luY01vZGUgPSBpc0FzeW5jTW9kZTtcbiAgICAgICAgZXhwb3J0cy5pc0NvbmN1cnJlbnRNb2RlID0gaXNDb25jdXJyZW50TW9kZTtcbiAgICAgICAgZXhwb3J0cy5pc0NvbnRleHRDb25zdW1lciA9IGlzQ29udGV4dENvbnN1bWVyMjtcbiAgICAgICAgZXhwb3J0cy5pc0NvbnRleHRQcm92aWRlciA9IGlzQ29udGV4dFByb3ZpZGVyO1xuICAgICAgICBleHBvcnRzLmlzRWxlbWVudCA9IGlzRWxlbWVudDtcbiAgICAgICAgZXhwb3J0cy5pc0ZvcndhcmRSZWYgPSBpc0ZvcndhcmRSZWY7XG4gICAgICAgIGV4cG9ydHMuaXNGcmFnbWVudCA9IGlzRnJhZ21lbnQ7XG4gICAgICAgIGV4cG9ydHMuaXNMYXp5ID0gaXNMYXp5O1xuICAgICAgICBleHBvcnRzLmlzTWVtbyA9IGlzTWVtbztcbiAgICAgICAgZXhwb3J0cy5pc1BvcnRhbCA9IGlzUG9ydGFsO1xuICAgICAgICBleHBvcnRzLmlzUHJvZmlsZXIgPSBpc1Byb2ZpbGVyO1xuICAgICAgICBleHBvcnRzLmlzU3RyaWN0TW9kZSA9IGlzU3RyaWN0TW9kZTtcbiAgICAgICAgZXhwb3J0cy5pc1N1c3BlbnNlID0gaXNTdXNwZW5zZTtcbiAgICAgICAgZXhwb3J0cy5pc1ZhbGlkRWxlbWVudFR5cGUgPSBpc1ZhbGlkRWxlbWVudFR5cGUyO1xuICAgICAgICBleHBvcnRzLnR5cGVPZiA9IHR5cGVPZjtcbiAgICAgIH0pKCk7XG4gICAgfVxuICB9XG59KTtcblxuLy8gbm9kZV9tb2R1bGVzL3JlYWN0LWlzL2luZGV4LmpzXG52YXIgcmVxdWlyZV9yZWFjdF9pcyA9IF9fY29tbW9uSlMoe1xuICBcIm5vZGVfbW9kdWxlcy9yZWFjdC1pcy9pbmRleC5qc1wiKGV4cG9ydHMsIG1vZHVsZSkge1xuICAgIFwidXNlIHN0cmljdFwiO1xuICAgIGlmIChmYWxzZSkge1xuICAgICAgbW9kdWxlLmV4cG9ydHMgPSBudWxsO1xuICAgIH0gZWxzZSB7XG4gICAgICBtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmVfcmVhY3RfaXNfZGV2ZWxvcG1lbnQoKTtcbiAgICB9XG4gIH1cbn0pO1xuXG4vLyBub2RlX21vZHVsZXMvb2JqZWN0LWFzc2lnbi9pbmRleC5qc1xudmFyIHJlcXVpcmVfb2JqZWN0X2Fzc2lnbiA9IF9fY29tbW9uSlMoe1xuICBcIm5vZGVfbW9kdWxlcy9vYmplY3QtYXNzaWduL2luZGV4LmpzXCIoZXhwb3J0cywgbW9kdWxlKSB7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG4gICAgdmFyIGdldE93blByb3BlcnR5U3ltYm9scyA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eVN5bWJvbHM7XG4gICAgdmFyIGhhc093blByb3BlcnR5ID0gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eTtcbiAgICB2YXIgcHJvcElzRW51bWVyYWJsZSA9IE9iamVjdC5wcm90b3R5cGUucHJvcGVydHlJc0VudW1lcmFibGU7XG4gICAgZnVuY3Rpb24gdG9PYmplY3QodmFsKSB7XG4gICAgICBpZiAodmFsID09PSBudWxsIHx8IHZhbCA9PT0gdm9pZCAwKSB7XG4gICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoXCJPYmplY3QuYXNzaWduIGNhbm5vdCBiZSBjYWxsZWQgd2l0aCBudWxsIG9yIHVuZGVmaW5lZFwiKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBPYmplY3QodmFsKTtcbiAgICB9XG4gICAgZnVuY3Rpb24gc2hvdWxkVXNlTmF0aXZlKCkge1xuICAgICAgdHJ5IHtcbiAgICAgICAgaWYgKCFPYmplY3QuYXNzaWduKSB7XG4gICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIHZhciB0ZXN0MSA9IG5ldyBTdHJpbmcoXCJhYmNcIik7XG4gICAgICAgIHRlc3QxWzVdID0gXCJkZVwiO1xuICAgICAgICBpZiAoT2JqZWN0LmdldE93blByb3BlcnR5TmFtZXModGVzdDEpWzBdID09PSBcIjVcIikge1xuICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgICB2YXIgdGVzdDIgPSB7fTtcbiAgICAgICAgZm9yICh2YXIgaTIgPSAwOyBpMiA8IDEwOyBpMisrKSB7XG4gICAgICAgICAgdGVzdDJbXCJfXCIgKyBTdHJpbmcuZnJvbUNoYXJDb2RlKGkyKV0gPSBpMjtcbiAgICAgICAgfVxuICAgICAgICB2YXIgb3JkZXIyID0gT2JqZWN0LmdldE93blByb3BlcnR5TmFtZXModGVzdDIpLm1hcChmdW5jdGlvbihuMikge1xuICAgICAgICAgIHJldHVybiB0ZXN0MltuMl07XG4gICAgICAgIH0pO1xuICAgICAgICBpZiAob3JkZXIyLmpvaW4oXCJcIikgIT09IFwiMDEyMzQ1Njc4OVwiKSB7XG4gICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIHZhciB0ZXN0MyA9IHt9O1xuICAgICAgICBcImFiY2RlZmdoaWprbG1ub3BxcnN0XCIuc3BsaXQoXCJcIikuZm9yRWFjaChmdW5jdGlvbihsZXR0ZXIpIHtcbiAgICAgICAgICB0ZXN0M1tsZXR0ZXJdID0gbGV0dGVyO1xuICAgICAgICB9KTtcbiAgICAgICAgaWYgKE9iamVjdC5rZXlzKE9iamVjdC5hc3NpZ24oe30sIHRlc3QzKSkuam9pbihcIlwiKSAhPT0gXCJhYmNkZWZnaGlqa2xtbm9wcXJzdFwiKSB7XG4gICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cbiAgICB9XG4gICAgbW9kdWxlLmV4cG9ydHMgPSBzaG91bGRVc2VOYXRpdmUoKSA/IE9iamVjdC5hc3NpZ24gOiBmdW5jdGlvbih0YXJnZXQsIHNvdXJjZSkge1xuICAgICAgdmFyIGZyb207XG4gICAgICB2YXIgdG8gPSB0b09iamVjdCh0YXJnZXQpO1xuICAgICAgdmFyIHN5bWJvbHM7XG4gICAgICBmb3IgKHZhciBzMiA9IDE7IHMyIDwgYXJndW1lbnRzLmxlbmd0aDsgczIrKykge1xuICAgICAgICBmcm9tID0gT2JqZWN0KGFyZ3VtZW50c1tzMl0pO1xuICAgICAgICBmb3IgKHZhciBrZXkgaW4gZnJvbSkge1xuICAgICAgICAgIGlmIChoYXNPd25Qcm9wZXJ0eS5jYWxsKGZyb20sIGtleSkpIHtcbiAgICAgICAgICAgIHRvW2tleV0gPSBmcm9tW2tleV07XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGlmIChnZXRPd25Qcm9wZXJ0eVN5bWJvbHMpIHtcbiAgICAgICAgICBzeW1ib2xzID0gZ2V0T3duUHJvcGVydHlTeW1ib2xzKGZyb20pO1xuICAgICAgICAgIGZvciAodmFyIGkyID0gMDsgaTIgPCBzeW1ib2xzLmxlbmd0aDsgaTIrKykge1xuICAgICAgICAgICAgaWYgKHByb3BJc0VudW1lcmFibGUuY2FsbChmcm9tLCBzeW1ib2xzW2kyXSkpIHtcbiAgICAgICAgICAgICAgdG9bc3ltYm9sc1tpMl1dID0gZnJvbVtzeW1ib2xzW2kyXV07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgICByZXR1cm4gdG87XG4gICAgfTtcbiAgfVxufSk7XG5cbi8vIG5vZGVfbW9kdWxlcy9wcm9wLXR5cGVzL2xpYi9SZWFjdFByb3BUeXBlc1NlY3JldC5qc1xudmFyIHJlcXVpcmVfUmVhY3RQcm9wVHlwZXNTZWNyZXQgPSBfX2NvbW1vbkpTKHtcbiAgXCJub2RlX21vZHVsZXMvcHJvcC10eXBlcy9saWIvUmVhY3RQcm9wVHlwZXNTZWNyZXQuanNcIihleHBvcnRzLCBtb2R1bGUpIHtcbiAgICBcInVzZSBzdHJpY3RcIjtcbiAgICB2YXIgUmVhY3RQcm9wVHlwZXNTZWNyZXQgPSBcIlNFQ1JFVF9ET19OT1RfUEFTU19USElTX09SX1lPVV9XSUxMX0JFX0ZJUkVEXCI7XG4gICAgbW9kdWxlLmV4cG9ydHMgPSBSZWFjdFByb3BUeXBlc1NlY3JldDtcbiAgfVxufSk7XG5cbi8vIG5vZGVfbW9kdWxlcy9wcm9wLXR5cGVzL2xpYi9oYXMuanNcbnZhciByZXF1aXJlX2hhcyA9IF9fY29tbW9uSlMoe1xuICBcIm5vZGVfbW9kdWxlcy9wcm9wLXR5cGVzL2xpYi9oYXMuanNcIihleHBvcnRzLCBtb2R1bGUpIHtcbiAgICBtb2R1bGUuZXhwb3J0cyA9IEZ1bmN0aW9uLmNhbGwuYmluZChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5KTtcbiAgfVxufSk7XG5cbi8vIG5vZGVfbW9kdWxlcy9wcm9wLXR5cGVzL2NoZWNrUHJvcFR5cGVzLmpzXG52YXIgcmVxdWlyZV9jaGVja1Byb3BUeXBlcyA9IF9fY29tbW9uSlMoe1xuICBcIm5vZGVfbW9kdWxlcy9wcm9wLXR5cGVzL2NoZWNrUHJvcFR5cGVzLmpzXCIoZXhwb3J0cywgbW9kdWxlKSB7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG4gICAgdmFyIHByaW50V2FybmluZyA9IGZ1bmN0aW9uKCkge1xuICAgIH07XG4gICAgaWYgKHRydWUpIHtcbiAgICAgIFJlYWN0UHJvcFR5cGVzU2VjcmV0ID0gcmVxdWlyZV9SZWFjdFByb3BUeXBlc1NlY3JldCgpO1xuICAgICAgbG9nZ2VkVHlwZUZhaWx1cmVzID0ge307XG4gICAgICBoYXMgPSByZXF1aXJlX2hhcygpO1xuICAgICAgcHJpbnRXYXJuaW5nID0gZnVuY3Rpb24odGV4dCkge1xuICAgICAgICB2YXIgbWVzc2FnZSA9IFwiV2FybmluZzogXCIgKyB0ZXh0O1xuICAgICAgICBpZiAodHlwZW9mIGNvbnNvbGUgIT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICAgICAgICBjb25zb2xlLmVycm9yKG1lc3NhZ2UpO1xuICAgICAgICB9XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgdGhyb3cgbmV3IEVycm9yKG1lc3NhZ2UpO1xuICAgICAgICB9IGNhdGNoICh4Mikge1xuICAgICAgICB9XG4gICAgICB9O1xuICAgIH1cbiAgICB2YXIgUmVhY3RQcm9wVHlwZXNTZWNyZXQ7XG4gICAgdmFyIGxvZ2dlZFR5cGVGYWlsdXJlcztcbiAgICB2YXIgaGFzO1xuICAgIGZ1bmN0aW9uIGNoZWNrUHJvcFR5cGVzKHR5cGVTcGVjcywgdmFsdWVzLCBsb2NhdGlvbiwgY29tcG9uZW50TmFtZSwgZ2V0U3RhY2spIHtcbiAgICAgIGlmICh0cnVlKSB7XG4gICAgICAgIGZvciAodmFyIHR5cGVTcGVjTmFtZSBpbiB0eXBlU3BlY3MpIHtcbiAgICAgICAgICBpZiAoaGFzKHR5cGVTcGVjcywgdHlwZVNwZWNOYW1lKSkge1xuICAgICAgICAgICAgdmFyIGVycm9yO1xuICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgaWYgKHR5cGVvZiB0eXBlU3BlY3NbdHlwZVNwZWNOYW1lXSAhPT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICAgICAgICAgICAgdmFyIGVyciA9IEVycm9yKFxuICAgICAgICAgICAgICAgICAgKGNvbXBvbmVudE5hbWUgfHwgXCJSZWFjdCBjbGFzc1wiKSArIFwiOiBcIiArIGxvY2F0aW9uICsgXCIgdHlwZSBgXCIgKyB0eXBlU3BlY05hbWUgKyBcImAgaXMgaW52YWxpZDsgaXQgbXVzdCBiZSBhIGZ1bmN0aW9uLCB1c3VhbGx5IGZyb20gdGhlIGBwcm9wLXR5cGVzYCBwYWNrYWdlLCBidXQgcmVjZWl2ZWQgYFwiICsgdHlwZW9mIHR5cGVTcGVjc1t0eXBlU3BlY05hbWVdICsgXCJgLlRoaXMgb2Z0ZW4gaGFwcGVucyBiZWNhdXNlIG9mIHR5cG9zIHN1Y2ggYXMgYFByb3BUeXBlcy5mdW5jdGlvbmAgaW5zdGVhZCBvZiBgUHJvcFR5cGVzLmZ1bmNgLlwiXG4gICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICBlcnIubmFtZSA9IFwiSW52YXJpYW50IFZpb2xhdGlvblwiO1xuICAgICAgICAgICAgICAgIHRocm93IGVycjtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICBlcnJvciA9IHR5cGVTcGVjc1t0eXBlU3BlY05hbWVdKHZhbHVlcywgdHlwZVNwZWNOYW1lLCBjb21wb25lbnROYW1lLCBsb2NhdGlvbiwgbnVsbCwgUmVhY3RQcm9wVHlwZXNTZWNyZXQpO1xuICAgICAgICAgICAgfSBjYXRjaCAoZXgpIHtcbiAgICAgICAgICAgICAgZXJyb3IgPSBleDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChlcnJvciAmJiAhKGVycm9yIGluc3RhbmNlb2YgRXJyb3IpKSB7XG4gICAgICAgICAgICAgIHByaW50V2FybmluZyhcbiAgICAgICAgICAgICAgICAoY29tcG9uZW50TmFtZSB8fCBcIlJlYWN0IGNsYXNzXCIpICsgXCI6IHR5cGUgc3BlY2lmaWNhdGlvbiBvZiBcIiArIGxvY2F0aW9uICsgXCIgYFwiICsgdHlwZVNwZWNOYW1lICsgXCJgIGlzIGludmFsaWQ7IHRoZSB0eXBlIGNoZWNrZXIgZnVuY3Rpb24gbXVzdCByZXR1cm4gYG51bGxgIG9yIGFuIGBFcnJvcmAgYnV0IHJldHVybmVkIGEgXCIgKyB0eXBlb2YgZXJyb3IgKyBcIi4gWW91IG1heSBoYXZlIGZvcmdvdHRlbiB0byBwYXNzIGFuIGFyZ3VtZW50IHRvIHRoZSB0eXBlIGNoZWNrZXIgY3JlYXRvciAoYXJyYXlPZiwgaW5zdGFuY2VPZiwgb2JqZWN0T2YsIG9uZU9mLCBvbmVPZlR5cGUsIGFuZCBzaGFwZSBhbGwgcmVxdWlyZSBhbiBhcmd1bWVudCkuXCJcbiAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChlcnJvciBpbnN0YW5jZW9mIEVycm9yICYmICEoZXJyb3IubWVzc2FnZSBpbiBsb2dnZWRUeXBlRmFpbHVyZXMpKSB7XG4gICAgICAgICAgICAgIGxvZ2dlZFR5cGVGYWlsdXJlc1tlcnJvci5tZXNzYWdlXSA9IHRydWU7XG4gICAgICAgICAgICAgIHZhciBzdGFjayA9IGdldFN0YWNrID8gZ2V0U3RhY2soKSA6IFwiXCI7XG4gICAgICAgICAgICAgIHByaW50V2FybmluZyhcbiAgICAgICAgICAgICAgICBcIkZhaWxlZCBcIiArIGxvY2F0aW9uICsgXCIgdHlwZTogXCIgKyBlcnJvci5tZXNzYWdlICsgKHN0YWNrICE9IG51bGwgPyBzdGFjayA6IFwiXCIpXG4gICAgICAgICAgICAgICk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIGNoZWNrUHJvcFR5cGVzLnJlc2V0V2FybmluZ0NhY2hlID0gZnVuY3Rpb24oKSB7XG4gICAgICBpZiAodHJ1ZSkge1xuICAgICAgICBsb2dnZWRUeXBlRmFpbHVyZXMgPSB7fTtcbiAgICAgIH1cbiAgICB9O1xuICAgIG1vZHVsZS5leHBvcnRzID0gY2hlY2tQcm9wVHlwZXM7XG4gIH1cbn0pO1xuXG4vLyBub2RlX21vZHVsZXMvcHJvcC10eXBlcy9mYWN0b3J5V2l0aFR5cGVDaGVja2Vycy5qc1xudmFyIHJlcXVpcmVfZmFjdG9yeVdpdGhUeXBlQ2hlY2tlcnMgPSBfX2NvbW1vbkpTKHtcbiAgXCJub2RlX21vZHVsZXMvcHJvcC10eXBlcy9mYWN0b3J5V2l0aFR5cGVDaGVja2Vycy5qc1wiKGV4cG9ydHMsIG1vZHVsZSkge1xuICAgIFwidXNlIHN0cmljdFwiO1xuICAgIHZhciBSZWFjdElzID0gcmVxdWlyZV9yZWFjdF9pcygpO1xuICAgIHZhciBhc3NpZ24gPSByZXF1aXJlX29iamVjdF9hc3NpZ24oKTtcbiAgICB2YXIgUmVhY3RQcm9wVHlwZXNTZWNyZXQgPSByZXF1aXJlX1JlYWN0UHJvcFR5cGVzU2VjcmV0KCk7XG4gICAgdmFyIGhhcyA9IHJlcXVpcmVfaGFzKCk7XG4gICAgdmFyIGNoZWNrUHJvcFR5cGVzID0gcmVxdWlyZV9jaGVja1Byb3BUeXBlcygpO1xuICAgIHZhciBwcmludFdhcm5pbmcgPSBmdW5jdGlvbigpIHtcbiAgICB9O1xuICAgIGlmICh0cnVlKSB7XG4gICAgICBwcmludFdhcm5pbmcgPSBmdW5jdGlvbih0ZXh0KSB7XG4gICAgICAgIHZhciBtZXNzYWdlID0gXCJXYXJuaW5nOiBcIiArIHRleHQ7XG4gICAgICAgIGlmICh0eXBlb2YgY29uc29sZSAhPT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgICAgIGNvbnNvbGUuZXJyb3IobWVzc2FnZSk7XG4gICAgICAgIH1cbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IobWVzc2FnZSk7XG4gICAgICAgIH0gY2F0Y2ggKHgyKSB7XG4gICAgICAgIH1cbiAgICAgIH07XG4gICAgfVxuICAgIGZ1bmN0aW9uIGVtcHR5RnVuY3Rpb25UaGF0UmV0dXJuc051bGwoKSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gICAgbW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihpc1ZhbGlkRWxlbWVudCwgdGhyb3dPbkRpcmVjdEFjY2Vzcykge1xuICAgICAgdmFyIElURVJBVE9SX1NZTUJPTCA9IHR5cGVvZiBTeW1ib2wgPT09IFwiZnVuY3Rpb25cIiAmJiBTeW1ib2wuaXRlcmF0b3I7XG4gICAgICB2YXIgRkFVWF9JVEVSQVRPUl9TWU1CT0wgPSBcIkBAaXRlcmF0b3JcIjtcbiAgICAgIGZ1bmN0aW9uIGdldEl0ZXJhdG9yRm4obWF5YmVJdGVyYWJsZSkge1xuICAgICAgICB2YXIgaXRlcmF0b3JGbiA9IG1heWJlSXRlcmFibGUgJiYgKElURVJBVE9SX1NZTUJPTCAmJiBtYXliZUl0ZXJhYmxlW0lURVJBVE9SX1NZTUJPTF0gfHwgbWF5YmVJdGVyYWJsZVtGQVVYX0lURVJBVE9SX1NZTUJPTF0pO1xuICAgICAgICBpZiAodHlwZW9mIGl0ZXJhdG9yRm4gPT09IFwiZnVuY3Rpb25cIikge1xuICAgICAgICAgIHJldHVybiBpdGVyYXRvckZuO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICB2YXIgQU5PTllNT1VTID0gXCI8PGFub255bW91cz4+XCI7XG4gICAgICB2YXIgUmVhY3RQcm9wVHlwZXMgPSB7XG4gICAgICAgIGFycmF5OiBjcmVhdGVQcmltaXRpdmVUeXBlQ2hlY2tlcihcImFycmF5XCIpLFxuICAgICAgICBiaWdpbnQ6IGNyZWF0ZVByaW1pdGl2ZVR5cGVDaGVja2VyKFwiYmlnaW50XCIpLFxuICAgICAgICBib29sOiBjcmVhdGVQcmltaXRpdmVUeXBlQ2hlY2tlcihcImJvb2xlYW5cIiksXG4gICAgICAgIGZ1bmM6IGNyZWF0ZVByaW1pdGl2ZVR5cGVDaGVja2VyKFwiZnVuY3Rpb25cIiksXG4gICAgICAgIG51bWJlcjogY3JlYXRlUHJpbWl0aXZlVHlwZUNoZWNrZXIoXCJudW1iZXJcIiksXG4gICAgICAgIG9iamVjdDogY3JlYXRlUHJpbWl0aXZlVHlwZUNoZWNrZXIoXCJvYmplY3RcIiksXG4gICAgICAgIHN0cmluZzogY3JlYXRlUHJpbWl0aXZlVHlwZUNoZWNrZXIoXCJzdHJpbmdcIiksXG4gICAgICAgIHN5bWJvbDogY3JlYXRlUHJpbWl0aXZlVHlwZUNoZWNrZXIoXCJzeW1ib2xcIiksXG4gICAgICAgIGFueTogY3JlYXRlQW55VHlwZUNoZWNrZXIoKSxcbiAgICAgICAgYXJyYXlPZjogY3JlYXRlQXJyYXlPZlR5cGVDaGVja2VyLFxuICAgICAgICBlbGVtZW50OiBjcmVhdGVFbGVtZW50VHlwZUNoZWNrZXIoKSxcbiAgICAgICAgZWxlbWVudFR5cGU6IGNyZWF0ZUVsZW1lbnRUeXBlVHlwZUNoZWNrZXIoKSxcbiAgICAgICAgaW5zdGFuY2VPZjogY3JlYXRlSW5zdGFuY2VUeXBlQ2hlY2tlcixcbiAgICAgICAgbm9kZTogY3JlYXRlTm9kZUNoZWNrZXIoKSxcbiAgICAgICAgb2JqZWN0T2Y6IGNyZWF0ZU9iamVjdE9mVHlwZUNoZWNrZXIsXG4gICAgICAgIG9uZU9mOiBjcmVhdGVFbnVtVHlwZUNoZWNrZXIsXG4gICAgICAgIG9uZU9mVHlwZTogY3JlYXRlVW5pb25UeXBlQ2hlY2tlcixcbiAgICAgICAgc2hhcGU6IGNyZWF0ZVNoYXBlVHlwZUNoZWNrZXIsXG4gICAgICAgIGV4YWN0OiBjcmVhdGVTdHJpY3RTaGFwZVR5cGVDaGVja2VyXG4gICAgICB9O1xuICAgICAgZnVuY3Rpb24gaXMoeDIsIHkyKSB7XG4gICAgICAgIGlmICh4MiA9PT0geTIpIHtcbiAgICAgICAgICByZXR1cm4geDIgIT09IDAgfHwgMSAvIHgyID09PSAxIC8geTI7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmV0dXJuIHgyICE9PSB4MiAmJiB5MiAhPT0geTI7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGZ1bmN0aW9uIFByb3BUeXBlRXJyb3IobWVzc2FnZSwgZGF0YSkge1xuICAgICAgICB0aGlzLm1lc3NhZ2UgPSBtZXNzYWdlO1xuICAgICAgICB0aGlzLmRhdGEgPSBkYXRhICYmIHR5cGVvZiBkYXRhID09PSBcIm9iamVjdFwiID8gZGF0YSA6IHt9O1xuICAgICAgICB0aGlzLnN0YWNrID0gXCJcIjtcbiAgICAgIH1cbiAgICAgIFByb3BUeXBlRXJyb3IucHJvdG90eXBlID0gRXJyb3IucHJvdG90eXBlO1xuICAgICAgZnVuY3Rpb24gY3JlYXRlQ2hhaW5hYmxlVHlwZUNoZWNrZXIodmFsaWRhdGUyKSB7XG4gICAgICAgIGlmICh0cnVlKSB7XG4gICAgICAgICAgdmFyIG1hbnVhbFByb3BUeXBlQ2FsbENhY2hlID0ge307XG4gICAgICAgICAgdmFyIG1hbnVhbFByb3BUeXBlV2FybmluZ0NvdW50ID0gMDtcbiAgICAgICAgfVxuICAgICAgICBmdW5jdGlvbiBjaGVja1R5cGUoaXNSZXF1aXJlZCwgcHJvcHMsIHByb3BOYW1lLCBjb21wb25lbnROYW1lLCBsb2NhdGlvbiwgcHJvcEZ1bGxOYW1lLCBzZWNyZXQpIHtcbiAgICAgICAgICBjb21wb25lbnROYW1lID0gY29tcG9uZW50TmFtZSB8fCBBTk9OWU1PVVM7XG4gICAgICAgICAgcHJvcEZ1bGxOYW1lID0gcHJvcEZ1bGxOYW1lIHx8IHByb3BOYW1lO1xuICAgICAgICAgIGlmIChzZWNyZXQgIT09IFJlYWN0UHJvcFR5cGVzU2VjcmV0KSB7XG4gICAgICAgICAgICBpZiAodGhyb3dPbkRpcmVjdEFjY2Vzcykge1xuICAgICAgICAgICAgICB2YXIgZXJyID0gbmV3IEVycm9yKFxuICAgICAgICAgICAgICAgIFwiQ2FsbGluZyBQcm9wVHlwZXMgdmFsaWRhdG9ycyBkaXJlY3RseSBpcyBub3Qgc3VwcG9ydGVkIGJ5IHRoZSBgcHJvcC10eXBlc2AgcGFja2FnZS4gVXNlIGBQcm9wVHlwZXMuY2hlY2tQcm9wVHlwZXMoKWAgdG8gY2FsbCB0aGVtLiBSZWFkIG1vcmUgYXQgaHR0cDovL2ZiLm1lL3VzZS1jaGVjay1wcm9wLXR5cGVzXCJcbiAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgZXJyLm5hbWUgPSBcIkludmFyaWFudCBWaW9sYXRpb25cIjtcbiAgICAgICAgICAgICAgdGhyb3cgZXJyO1xuICAgICAgICAgICAgfSBlbHNlIGlmICh0eXBlb2YgY29uc29sZSAhPT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgICAgICAgICB2YXIgY2FjaGVLZXkgPSBjb21wb25lbnROYW1lICsgXCI6XCIgKyBwcm9wTmFtZTtcbiAgICAgICAgICAgICAgaWYgKCFtYW51YWxQcm9wVHlwZUNhbGxDYWNoZVtjYWNoZUtleV0gJiYgbWFudWFsUHJvcFR5cGVXYXJuaW5nQ291bnQgPCAzKSB7XG4gICAgICAgICAgICAgICAgcHJpbnRXYXJuaW5nKFxuICAgICAgICAgICAgICAgICAgXCJZb3UgYXJlIG1hbnVhbGx5IGNhbGxpbmcgYSBSZWFjdC5Qcm9wVHlwZXMgdmFsaWRhdGlvbiBmdW5jdGlvbiBmb3IgdGhlIGBcIiArIHByb3BGdWxsTmFtZSArIFwiYCBwcm9wIG9uIGBcIiArIGNvbXBvbmVudE5hbWUgKyBcImAuIFRoaXMgaXMgZGVwcmVjYXRlZCBhbmQgd2lsbCB0aHJvdyBpbiB0aGUgc3RhbmRhbG9uZSBgcHJvcC10eXBlc2AgcGFja2FnZS4gWW91IG1heSBiZSBzZWVpbmcgdGhpcyB3YXJuaW5nIGR1ZSB0byBhIHRoaXJkLXBhcnR5IFByb3BUeXBlcyBsaWJyYXJ5LiBTZWUgaHR0cHM6Ly9mYi5tZS9yZWFjdC13YXJuaW5nLWRvbnQtY2FsbC1wcm9wdHlwZXMgZm9yIGRldGFpbHMuXCJcbiAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgIG1hbnVhbFByb3BUeXBlQ2FsbENhY2hlW2NhY2hlS2V5XSA9IHRydWU7XG4gICAgICAgICAgICAgICAgbWFudWFsUHJvcFR5cGVXYXJuaW5nQ291bnQrKztcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAocHJvcHNbcHJvcE5hbWVdID09IG51bGwpIHtcbiAgICAgICAgICAgIGlmIChpc1JlcXVpcmVkKSB7XG4gICAgICAgICAgICAgIGlmIChwcm9wc1twcm9wTmFtZV0gPT09IG51bGwpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gbmV3IFByb3BUeXBlRXJyb3IoXCJUaGUgXCIgKyBsb2NhdGlvbiArIFwiIGBcIiArIHByb3BGdWxsTmFtZSArIFwiYCBpcyBtYXJrZWQgYXMgcmVxdWlyZWQgXCIgKyAoXCJpbiBgXCIgKyBjb21wb25lbnROYW1lICsgXCJgLCBidXQgaXRzIHZhbHVlIGlzIGBudWxsYC5cIikpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIHJldHVybiBuZXcgUHJvcFR5cGVFcnJvcihcIlRoZSBcIiArIGxvY2F0aW9uICsgXCIgYFwiICsgcHJvcEZ1bGxOYW1lICsgXCJgIGlzIG1hcmtlZCBhcyByZXF1aXJlZCBpbiBcIiArIChcImBcIiArIGNvbXBvbmVudE5hbWUgKyBcImAsIGJ1dCBpdHMgdmFsdWUgaXMgYHVuZGVmaW5lZGAuXCIpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gdmFsaWRhdGUyKHByb3BzLCBwcm9wTmFtZSwgY29tcG9uZW50TmFtZSwgbG9jYXRpb24sIHByb3BGdWxsTmFtZSk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHZhciBjaGFpbmVkQ2hlY2tUeXBlID0gY2hlY2tUeXBlLmJpbmQobnVsbCwgZmFsc2UpO1xuICAgICAgICBjaGFpbmVkQ2hlY2tUeXBlLmlzUmVxdWlyZWQgPSBjaGVja1R5cGUuYmluZChudWxsLCB0cnVlKTtcbiAgICAgICAgcmV0dXJuIGNoYWluZWRDaGVja1R5cGU7XG4gICAgICB9XG4gICAgICBmdW5jdGlvbiBjcmVhdGVQcmltaXRpdmVUeXBlQ2hlY2tlcihleHBlY3RlZFR5cGUpIHtcbiAgICAgICAgZnVuY3Rpb24gdmFsaWRhdGUyKHByb3BzLCBwcm9wTmFtZSwgY29tcG9uZW50TmFtZSwgbG9jYXRpb24sIHByb3BGdWxsTmFtZSwgc2VjcmV0KSB7XG4gICAgICAgICAgdmFyIHByb3BWYWx1ZSA9IHByb3BzW3Byb3BOYW1lXTtcbiAgICAgICAgICB2YXIgcHJvcFR5cGUgPSBnZXRQcm9wVHlwZShwcm9wVmFsdWUpO1xuICAgICAgICAgIGlmIChwcm9wVHlwZSAhPT0gZXhwZWN0ZWRUeXBlKSB7XG4gICAgICAgICAgICB2YXIgcHJlY2lzZVR5cGUgPSBnZXRQcmVjaXNlVHlwZShwcm9wVmFsdWUpO1xuICAgICAgICAgICAgcmV0dXJuIG5ldyBQcm9wVHlwZUVycm9yKFxuICAgICAgICAgICAgICBcIkludmFsaWQgXCIgKyBsb2NhdGlvbiArIFwiIGBcIiArIHByb3BGdWxsTmFtZSArIFwiYCBvZiB0eXBlIFwiICsgKFwiYFwiICsgcHJlY2lzZVR5cGUgKyBcImAgc3VwcGxpZWQgdG8gYFwiICsgY29tcG9uZW50TmFtZSArIFwiYCwgZXhwZWN0ZWQgXCIpICsgKFwiYFwiICsgZXhwZWN0ZWRUeXBlICsgXCJgLlwiKSxcbiAgICAgICAgICAgICAgeyBleHBlY3RlZFR5cGUgfVxuICAgICAgICAgICAgKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGNyZWF0ZUNoYWluYWJsZVR5cGVDaGVja2VyKHZhbGlkYXRlMik7XG4gICAgICB9XG4gICAgICBmdW5jdGlvbiBjcmVhdGVBbnlUeXBlQ2hlY2tlcigpIHtcbiAgICAgICAgcmV0dXJuIGNyZWF0ZUNoYWluYWJsZVR5cGVDaGVja2VyKGVtcHR5RnVuY3Rpb25UaGF0UmV0dXJuc051bGwpO1xuICAgICAgfVxuICAgICAgZnVuY3Rpb24gY3JlYXRlQXJyYXlPZlR5cGVDaGVja2VyKHR5cGVDaGVja2VyKSB7XG4gICAgICAgIGZ1bmN0aW9uIHZhbGlkYXRlMihwcm9wcywgcHJvcE5hbWUsIGNvbXBvbmVudE5hbWUsIGxvY2F0aW9uLCBwcm9wRnVsbE5hbWUpIHtcbiAgICAgICAgICBpZiAodHlwZW9mIHR5cGVDaGVja2VyICE9PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgICAgICAgIHJldHVybiBuZXcgUHJvcFR5cGVFcnJvcihcIlByb3BlcnR5IGBcIiArIHByb3BGdWxsTmFtZSArIFwiYCBvZiBjb21wb25lbnQgYFwiICsgY29tcG9uZW50TmFtZSArIFwiYCBoYXMgaW52YWxpZCBQcm9wVHlwZSBub3RhdGlvbiBpbnNpZGUgYXJyYXlPZi5cIik7XG4gICAgICAgICAgfVxuICAgICAgICAgIHZhciBwcm9wVmFsdWUgPSBwcm9wc1twcm9wTmFtZV07XG4gICAgICAgICAgaWYgKCFBcnJheS5pc0FycmF5KHByb3BWYWx1ZSkpIHtcbiAgICAgICAgICAgIHZhciBwcm9wVHlwZSA9IGdldFByb3BUeXBlKHByb3BWYWx1ZSk7XG4gICAgICAgICAgICByZXR1cm4gbmV3IFByb3BUeXBlRXJyb3IoXCJJbnZhbGlkIFwiICsgbG9jYXRpb24gKyBcIiBgXCIgKyBwcm9wRnVsbE5hbWUgKyBcImAgb2YgdHlwZSBcIiArIChcImBcIiArIHByb3BUeXBlICsgXCJgIHN1cHBsaWVkIHRvIGBcIiArIGNvbXBvbmVudE5hbWUgKyBcImAsIGV4cGVjdGVkIGFuIGFycmF5LlwiKSk7XG4gICAgICAgICAgfVxuICAgICAgICAgIGZvciAodmFyIGkyID0gMDsgaTIgPCBwcm9wVmFsdWUubGVuZ3RoOyBpMisrKSB7XG4gICAgICAgICAgICB2YXIgZXJyb3IgPSB0eXBlQ2hlY2tlcihwcm9wVmFsdWUsIGkyLCBjb21wb25lbnROYW1lLCBsb2NhdGlvbiwgcHJvcEZ1bGxOYW1lICsgXCJbXCIgKyBpMiArIFwiXVwiLCBSZWFjdFByb3BUeXBlc1NlY3JldCk7XG4gICAgICAgICAgICBpZiAoZXJyb3IgaW5zdGFuY2VvZiBFcnJvcikge1xuICAgICAgICAgICAgICByZXR1cm4gZXJyb3I7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBjcmVhdGVDaGFpbmFibGVUeXBlQ2hlY2tlcih2YWxpZGF0ZTIpO1xuICAgICAgfVxuICAgICAgZnVuY3Rpb24gY3JlYXRlRWxlbWVudFR5cGVDaGVja2VyKCkge1xuICAgICAgICBmdW5jdGlvbiB2YWxpZGF0ZTIocHJvcHMsIHByb3BOYW1lLCBjb21wb25lbnROYW1lLCBsb2NhdGlvbiwgcHJvcEZ1bGxOYW1lKSB7XG4gICAgICAgICAgdmFyIHByb3BWYWx1ZSA9IHByb3BzW3Byb3BOYW1lXTtcbiAgICAgICAgICBpZiAoIWlzVmFsaWRFbGVtZW50KHByb3BWYWx1ZSkpIHtcbiAgICAgICAgICAgIHZhciBwcm9wVHlwZSA9IGdldFByb3BUeXBlKHByb3BWYWx1ZSk7XG4gICAgICAgICAgICByZXR1cm4gbmV3IFByb3BUeXBlRXJyb3IoXCJJbnZhbGlkIFwiICsgbG9jYXRpb24gKyBcIiBgXCIgKyBwcm9wRnVsbE5hbWUgKyBcImAgb2YgdHlwZSBcIiArIChcImBcIiArIHByb3BUeXBlICsgXCJgIHN1cHBsaWVkIHRvIGBcIiArIGNvbXBvbmVudE5hbWUgKyBcImAsIGV4cGVjdGVkIGEgc2luZ2xlIFJlYWN0RWxlbWVudC5cIikpO1xuICAgICAgICAgIH1cbiAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gY3JlYXRlQ2hhaW5hYmxlVHlwZUNoZWNrZXIodmFsaWRhdGUyKTtcbiAgICAgIH1cbiAgICAgIGZ1bmN0aW9uIGNyZWF0ZUVsZW1lbnRUeXBlVHlwZUNoZWNrZXIoKSB7XG4gICAgICAgIGZ1bmN0aW9uIHZhbGlkYXRlMihwcm9wcywgcHJvcE5hbWUsIGNvbXBvbmVudE5hbWUsIGxvY2F0aW9uLCBwcm9wRnVsbE5hbWUpIHtcbiAgICAgICAgICB2YXIgcHJvcFZhbHVlID0gcHJvcHNbcHJvcE5hbWVdO1xuICAgICAgICAgIGlmICghUmVhY3RJcy5pc1ZhbGlkRWxlbWVudFR5cGUocHJvcFZhbHVlKSkge1xuICAgICAgICAgICAgdmFyIHByb3BUeXBlID0gZ2V0UHJvcFR5cGUocHJvcFZhbHVlKTtcbiAgICAgICAgICAgIHJldHVybiBuZXcgUHJvcFR5cGVFcnJvcihcIkludmFsaWQgXCIgKyBsb2NhdGlvbiArIFwiIGBcIiArIHByb3BGdWxsTmFtZSArIFwiYCBvZiB0eXBlIFwiICsgKFwiYFwiICsgcHJvcFR5cGUgKyBcImAgc3VwcGxpZWQgdG8gYFwiICsgY29tcG9uZW50TmFtZSArIFwiYCwgZXhwZWN0ZWQgYSBzaW5nbGUgUmVhY3RFbGVtZW50IHR5cGUuXCIpKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGNyZWF0ZUNoYWluYWJsZVR5cGVDaGVja2VyKHZhbGlkYXRlMik7XG4gICAgICB9XG4gICAgICBmdW5jdGlvbiBjcmVhdGVJbnN0YW5jZVR5cGVDaGVja2VyKGV4cGVjdGVkQ2xhc3MpIHtcbiAgICAgICAgZnVuY3Rpb24gdmFsaWRhdGUyKHByb3BzLCBwcm9wTmFtZSwgY29tcG9uZW50TmFtZSwgbG9jYXRpb24sIHByb3BGdWxsTmFtZSkge1xuICAgICAgICAgIGlmICghKHByb3BzW3Byb3BOYW1lXSBpbnN0YW5jZW9mIGV4cGVjdGVkQ2xhc3MpKSB7XG4gICAgICAgICAgICB2YXIgZXhwZWN0ZWRDbGFzc05hbWUgPSBleHBlY3RlZENsYXNzLm5hbWUgfHwgQU5PTllNT1VTO1xuICAgICAgICAgICAgdmFyIGFjdHVhbENsYXNzTmFtZSA9IGdldENsYXNzTmFtZShwcm9wc1twcm9wTmFtZV0pO1xuICAgICAgICAgICAgcmV0dXJuIG5ldyBQcm9wVHlwZUVycm9yKFwiSW52YWxpZCBcIiArIGxvY2F0aW9uICsgXCIgYFwiICsgcHJvcEZ1bGxOYW1lICsgXCJgIG9mIHR5cGUgXCIgKyAoXCJgXCIgKyBhY3R1YWxDbGFzc05hbWUgKyBcImAgc3VwcGxpZWQgdG8gYFwiICsgY29tcG9uZW50TmFtZSArIFwiYCwgZXhwZWN0ZWQgXCIpICsgKFwiaW5zdGFuY2Ugb2YgYFwiICsgZXhwZWN0ZWRDbGFzc05hbWUgKyBcImAuXCIpKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGNyZWF0ZUNoYWluYWJsZVR5cGVDaGVja2VyKHZhbGlkYXRlMik7XG4gICAgICB9XG4gICAgICBmdW5jdGlvbiBjcmVhdGVFbnVtVHlwZUNoZWNrZXIoZXhwZWN0ZWRWYWx1ZXMpIHtcbiAgICAgICAgaWYgKCFBcnJheS5pc0FycmF5KGV4cGVjdGVkVmFsdWVzKSkge1xuICAgICAgICAgIGlmICh0cnVlKSB7XG4gICAgICAgICAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA+IDEpIHtcbiAgICAgICAgICAgICAgcHJpbnRXYXJuaW5nKFxuICAgICAgICAgICAgICAgIFwiSW52YWxpZCBhcmd1bWVudHMgc3VwcGxpZWQgdG8gb25lT2YsIGV4cGVjdGVkIGFuIGFycmF5LCBnb3QgXCIgKyBhcmd1bWVudHMubGVuZ3RoICsgXCIgYXJndW1lbnRzLiBBIGNvbW1vbiBtaXN0YWtlIGlzIHRvIHdyaXRlIG9uZU9mKHgsIHksIHopIGluc3RlYWQgb2Ygb25lT2YoW3gsIHksIHpdKS5cIlxuICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgcHJpbnRXYXJuaW5nKFwiSW52YWxpZCBhcmd1bWVudCBzdXBwbGllZCB0byBvbmVPZiwgZXhwZWN0ZWQgYW4gYXJyYXkuXCIpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgICByZXR1cm4gZW1wdHlGdW5jdGlvblRoYXRSZXR1cm5zTnVsbDtcbiAgICAgICAgfVxuICAgICAgICBmdW5jdGlvbiB2YWxpZGF0ZTIocHJvcHMsIHByb3BOYW1lLCBjb21wb25lbnROYW1lLCBsb2NhdGlvbiwgcHJvcEZ1bGxOYW1lKSB7XG4gICAgICAgICAgdmFyIHByb3BWYWx1ZSA9IHByb3BzW3Byb3BOYW1lXTtcbiAgICAgICAgICBmb3IgKHZhciBpMiA9IDA7IGkyIDwgZXhwZWN0ZWRWYWx1ZXMubGVuZ3RoOyBpMisrKSB7XG4gICAgICAgICAgICBpZiAoaXMocHJvcFZhbHVlLCBleHBlY3RlZFZhbHVlc1tpMl0pKSB7XG4gICAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgICB2YXIgdmFsdWVzU3RyaW5nID0gSlNPTi5zdHJpbmdpZnkoZXhwZWN0ZWRWYWx1ZXMsIGZ1bmN0aW9uIHJlcGxhY2VyKGtleSwgdmFsdWUpIHtcbiAgICAgICAgICAgIHZhciB0eXBlID0gZ2V0UHJlY2lzZVR5cGUodmFsdWUpO1xuICAgICAgICAgICAgaWYgKHR5cGUgPT09IFwic3ltYm9sXCIpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIFN0cmluZyh2YWx1ZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gdmFsdWU7XG4gICAgICAgICAgfSk7XG4gICAgICAgICAgcmV0dXJuIG5ldyBQcm9wVHlwZUVycm9yKFwiSW52YWxpZCBcIiArIGxvY2F0aW9uICsgXCIgYFwiICsgcHJvcEZ1bGxOYW1lICsgXCJgIG9mIHZhbHVlIGBcIiArIFN0cmluZyhwcm9wVmFsdWUpICsgXCJgIFwiICsgKFwic3VwcGxpZWQgdG8gYFwiICsgY29tcG9uZW50TmFtZSArIFwiYCwgZXhwZWN0ZWQgb25lIG9mIFwiICsgdmFsdWVzU3RyaW5nICsgXCIuXCIpKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gY3JlYXRlQ2hhaW5hYmxlVHlwZUNoZWNrZXIodmFsaWRhdGUyKTtcbiAgICAgIH1cbiAgICAgIGZ1bmN0aW9uIGNyZWF0ZU9iamVjdE9mVHlwZUNoZWNrZXIodHlwZUNoZWNrZXIpIHtcbiAgICAgICAgZnVuY3Rpb24gdmFsaWRhdGUyKHByb3BzLCBwcm9wTmFtZSwgY29tcG9uZW50TmFtZSwgbG9jYXRpb24sIHByb3BGdWxsTmFtZSkge1xuICAgICAgICAgIGlmICh0eXBlb2YgdHlwZUNoZWNrZXIgIT09IFwiZnVuY3Rpb25cIikge1xuICAgICAgICAgICAgcmV0dXJuIG5ldyBQcm9wVHlwZUVycm9yKFwiUHJvcGVydHkgYFwiICsgcHJvcEZ1bGxOYW1lICsgXCJgIG9mIGNvbXBvbmVudCBgXCIgKyBjb21wb25lbnROYW1lICsgXCJgIGhhcyBpbnZhbGlkIFByb3BUeXBlIG5vdGF0aW9uIGluc2lkZSBvYmplY3RPZi5cIik7XG4gICAgICAgICAgfVxuICAgICAgICAgIHZhciBwcm9wVmFsdWUgPSBwcm9wc1twcm9wTmFtZV07XG4gICAgICAgICAgdmFyIHByb3BUeXBlID0gZ2V0UHJvcFR5cGUocHJvcFZhbHVlKTtcbiAgICAgICAgICBpZiAocHJvcFR5cGUgIT09IFwib2JqZWN0XCIpIHtcbiAgICAgICAgICAgIHJldHVybiBuZXcgUHJvcFR5cGVFcnJvcihcIkludmFsaWQgXCIgKyBsb2NhdGlvbiArIFwiIGBcIiArIHByb3BGdWxsTmFtZSArIFwiYCBvZiB0eXBlIFwiICsgKFwiYFwiICsgcHJvcFR5cGUgKyBcImAgc3VwcGxpZWQgdG8gYFwiICsgY29tcG9uZW50TmFtZSArIFwiYCwgZXhwZWN0ZWQgYW4gb2JqZWN0LlwiKSk7XG4gICAgICAgICAgfVxuICAgICAgICAgIGZvciAodmFyIGtleSBpbiBwcm9wVmFsdWUpIHtcbiAgICAgICAgICAgIGlmIChoYXMocHJvcFZhbHVlLCBrZXkpKSB7XG4gICAgICAgICAgICAgIHZhciBlcnJvciA9IHR5cGVDaGVja2VyKHByb3BWYWx1ZSwga2V5LCBjb21wb25lbnROYW1lLCBsb2NhdGlvbiwgcHJvcEZ1bGxOYW1lICsgXCIuXCIgKyBrZXksIFJlYWN0UHJvcFR5cGVzU2VjcmV0KTtcbiAgICAgICAgICAgICAgaWYgKGVycm9yIGluc3RhbmNlb2YgRXJyb3IpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZXJyb3I7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGNyZWF0ZUNoYWluYWJsZVR5cGVDaGVja2VyKHZhbGlkYXRlMik7XG4gICAgICB9XG4gICAgICBmdW5jdGlvbiBjcmVhdGVVbmlvblR5cGVDaGVja2VyKGFycmF5T2ZUeXBlQ2hlY2tlcnMpIHtcbiAgICAgICAgaWYgKCFBcnJheS5pc0FycmF5KGFycmF5T2ZUeXBlQ2hlY2tlcnMpKSB7XG4gICAgICAgICAgdHJ1ZSA/IHByaW50V2FybmluZyhcIkludmFsaWQgYXJndW1lbnQgc3VwcGxpZWQgdG8gb25lT2ZUeXBlLCBleHBlY3RlZCBhbiBpbnN0YW5jZSBvZiBhcnJheS5cIikgOiB2b2lkIDA7XG4gICAgICAgICAgcmV0dXJuIGVtcHR5RnVuY3Rpb25UaGF0UmV0dXJuc051bGw7XG4gICAgICAgIH1cbiAgICAgICAgZm9yICh2YXIgaTIgPSAwOyBpMiA8IGFycmF5T2ZUeXBlQ2hlY2tlcnMubGVuZ3RoOyBpMisrKSB7XG4gICAgICAgICAgdmFyIGNoZWNrZXIgPSBhcnJheU9mVHlwZUNoZWNrZXJzW2kyXTtcbiAgICAgICAgICBpZiAodHlwZW9mIGNoZWNrZXIgIT09IFwiZnVuY3Rpb25cIikge1xuICAgICAgICAgICAgcHJpbnRXYXJuaW5nKFxuICAgICAgICAgICAgICBcIkludmFsaWQgYXJndW1lbnQgc3VwcGxpZWQgdG8gb25lT2ZUeXBlLiBFeHBlY3RlZCBhbiBhcnJheSBvZiBjaGVjayBmdW5jdGlvbnMsIGJ1dCByZWNlaXZlZCBcIiArIGdldFBvc3RmaXhGb3JUeXBlV2FybmluZyhjaGVja2VyKSArIFwiIGF0IGluZGV4IFwiICsgaTIgKyBcIi5cIlxuICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIHJldHVybiBlbXB0eUZ1bmN0aW9uVGhhdFJldHVybnNOdWxsO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBmdW5jdGlvbiB2YWxpZGF0ZTIocHJvcHMsIHByb3BOYW1lLCBjb21wb25lbnROYW1lLCBsb2NhdGlvbiwgcHJvcEZ1bGxOYW1lKSB7XG4gICAgICAgICAgdmFyIGV4cGVjdGVkVHlwZXMgPSBbXTtcbiAgICAgICAgICBmb3IgKHZhciBpMyA9IDA7IGkzIDwgYXJyYXlPZlR5cGVDaGVja2Vycy5sZW5ndGg7IGkzKyspIHtcbiAgICAgICAgICAgIHZhciBjaGVja2VyMiA9IGFycmF5T2ZUeXBlQ2hlY2tlcnNbaTNdO1xuICAgICAgICAgICAgdmFyIGNoZWNrZXJSZXN1bHQgPSBjaGVja2VyMihwcm9wcywgcHJvcE5hbWUsIGNvbXBvbmVudE5hbWUsIGxvY2F0aW9uLCBwcm9wRnVsbE5hbWUsIFJlYWN0UHJvcFR5cGVzU2VjcmV0KTtcbiAgICAgICAgICAgIGlmIChjaGVja2VyUmVzdWx0ID09IG51bGwpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoY2hlY2tlclJlc3VsdC5kYXRhICYmIGhhcyhjaGVja2VyUmVzdWx0LmRhdGEsIFwiZXhwZWN0ZWRUeXBlXCIpKSB7XG4gICAgICAgICAgICAgIGV4cGVjdGVkVHlwZXMucHVzaChjaGVja2VyUmVzdWx0LmRhdGEuZXhwZWN0ZWRUeXBlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgICAgdmFyIGV4cGVjdGVkVHlwZXNNZXNzYWdlID0gZXhwZWN0ZWRUeXBlcy5sZW5ndGggPiAwID8gXCIsIGV4cGVjdGVkIG9uZSBvZiB0eXBlIFtcIiArIGV4cGVjdGVkVHlwZXMuam9pbihcIiwgXCIpICsgXCJdXCIgOiBcIlwiO1xuICAgICAgICAgIHJldHVybiBuZXcgUHJvcFR5cGVFcnJvcihcIkludmFsaWQgXCIgKyBsb2NhdGlvbiArIFwiIGBcIiArIHByb3BGdWxsTmFtZSArIFwiYCBzdXBwbGllZCB0byBcIiArIChcImBcIiArIGNvbXBvbmVudE5hbWUgKyBcImBcIiArIGV4cGVjdGVkVHlwZXNNZXNzYWdlICsgXCIuXCIpKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gY3JlYXRlQ2hhaW5hYmxlVHlwZUNoZWNrZXIodmFsaWRhdGUyKTtcbiAgICAgIH1cbiAgICAgIGZ1bmN0aW9uIGNyZWF0ZU5vZGVDaGVja2VyKCkge1xuICAgICAgICBmdW5jdGlvbiB2YWxpZGF0ZTIocHJvcHMsIHByb3BOYW1lLCBjb21wb25lbnROYW1lLCBsb2NhdGlvbiwgcHJvcEZ1bGxOYW1lKSB7XG4gICAgICAgICAgaWYgKCFpc05vZGUocHJvcHNbcHJvcE5hbWVdKSkge1xuICAgICAgICAgICAgcmV0dXJuIG5ldyBQcm9wVHlwZUVycm9yKFwiSW52YWxpZCBcIiArIGxvY2F0aW9uICsgXCIgYFwiICsgcHJvcEZ1bGxOYW1lICsgXCJgIHN1cHBsaWVkIHRvIFwiICsgKFwiYFwiICsgY29tcG9uZW50TmFtZSArIFwiYCwgZXhwZWN0ZWQgYSBSZWFjdE5vZGUuXCIpKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGNyZWF0ZUNoYWluYWJsZVR5cGVDaGVja2VyKHZhbGlkYXRlMik7XG4gICAgICB9XG4gICAgICBmdW5jdGlvbiBpbnZhbGlkVmFsaWRhdG9yRXJyb3IoY29tcG9uZW50TmFtZSwgbG9jYXRpb24sIHByb3BGdWxsTmFtZSwga2V5LCB0eXBlKSB7XG4gICAgICAgIHJldHVybiBuZXcgUHJvcFR5cGVFcnJvcihcbiAgICAgICAgICAoY29tcG9uZW50TmFtZSB8fCBcIlJlYWN0IGNsYXNzXCIpICsgXCI6IFwiICsgbG9jYXRpb24gKyBcIiB0eXBlIGBcIiArIHByb3BGdWxsTmFtZSArIFwiLlwiICsga2V5ICsgXCJgIGlzIGludmFsaWQ7IGl0IG11c3QgYmUgYSBmdW5jdGlvbiwgdXN1YWxseSBmcm9tIHRoZSBgcHJvcC10eXBlc2AgcGFja2FnZSwgYnV0IHJlY2VpdmVkIGBcIiArIHR5cGUgKyBcImAuXCJcbiAgICAgICAgKTtcbiAgICAgIH1cbiAgICAgIGZ1bmN0aW9uIGNyZWF0ZVNoYXBlVHlwZUNoZWNrZXIoc2hhcGVUeXBlcykge1xuICAgICAgICBmdW5jdGlvbiB2YWxpZGF0ZTIocHJvcHMsIHByb3BOYW1lLCBjb21wb25lbnROYW1lLCBsb2NhdGlvbiwgcHJvcEZ1bGxOYW1lKSB7XG4gICAgICAgICAgdmFyIHByb3BWYWx1ZSA9IHByb3BzW3Byb3BOYW1lXTtcbiAgICAgICAgICB2YXIgcHJvcFR5cGUgPSBnZXRQcm9wVHlwZShwcm9wVmFsdWUpO1xuICAgICAgICAgIGlmIChwcm9wVHlwZSAhPT0gXCJvYmplY3RcIikge1xuICAgICAgICAgICAgcmV0dXJuIG5ldyBQcm9wVHlwZUVycm9yKFwiSW52YWxpZCBcIiArIGxvY2F0aW9uICsgXCIgYFwiICsgcHJvcEZ1bGxOYW1lICsgXCJgIG9mIHR5cGUgYFwiICsgcHJvcFR5cGUgKyBcImAgXCIgKyAoXCJzdXBwbGllZCB0byBgXCIgKyBjb21wb25lbnROYW1lICsgXCJgLCBleHBlY3RlZCBgb2JqZWN0YC5cIikpO1xuICAgICAgICAgIH1cbiAgICAgICAgICBmb3IgKHZhciBrZXkgaW4gc2hhcGVUeXBlcykge1xuICAgICAgICAgICAgdmFyIGNoZWNrZXIgPSBzaGFwZVR5cGVzW2tleV07XG4gICAgICAgICAgICBpZiAodHlwZW9mIGNoZWNrZXIgIT09IFwiZnVuY3Rpb25cIikge1xuICAgICAgICAgICAgICByZXR1cm4gaW52YWxpZFZhbGlkYXRvckVycm9yKGNvbXBvbmVudE5hbWUsIGxvY2F0aW9uLCBwcm9wRnVsbE5hbWUsIGtleSwgZ2V0UHJlY2lzZVR5cGUoY2hlY2tlcikpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdmFyIGVycm9yID0gY2hlY2tlcihwcm9wVmFsdWUsIGtleSwgY29tcG9uZW50TmFtZSwgbG9jYXRpb24sIHByb3BGdWxsTmFtZSArIFwiLlwiICsga2V5LCBSZWFjdFByb3BUeXBlc1NlY3JldCk7XG4gICAgICAgICAgICBpZiAoZXJyb3IpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIGVycm9yO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gY3JlYXRlQ2hhaW5hYmxlVHlwZUNoZWNrZXIodmFsaWRhdGUyKTtcbiAgICAgIH1cbiAgICAgIGZ1bmN0aW9uIGNyZWF0ZVN0cmljdFNoYXBlVHlwZUNoZWNrZXIoc2hhcGVUeXBlcykge1xuICAgICAgICBmdW5jdGlvbiB2YWxpZGF0ZTIocHJvcHMsIHByb3BOYW1lLCBjb21wb25lbnROYW1lLCBsb2NhdGlvbiwgcHJvcEZ1bGxOYW1lKSB7XG4gICAgICAgICAgdmFyIHByb3BWYWx1ZSA9IHByb3BzW3Byb3BOYW1lXTtcbiAgICAgICAgICB2YXIgcHJvcFR5cGUgPSBnZXRQcm9wVHlwZShwcm9wVmFsdWUpO1xuICAgICAgICAgIGlmIChwcm9wVHlwZSAhPT0gXCJvYmplY3RcIikge1xuICAgICAgICAgICAgcmV0dXJuIG5ldyBQcm9wVHlwZUVycm9yKFwiSW52YWxpZCBcIiArIGxvY2F0aW9uICsgXCIgYFwiICsgcHJvcEZ1bGxOYW1lICsgXCJgIG9mIHR5cGUgYFwiICsgcHJvcFR5cGUgKyBcImAgXCIgKyAoXCJzdXBwbGllZCB0byBgXCIgKyBjb21wb25lbnROYW1lICsgXCJgLCBleHBlY3RlZCBgb2JqZWN0YC5cIikpO1xuICAgICAgICAgIH1cbiAgICAgICAgICB2YXIgYWxsS2V5cyA9IGFzc2lnbih7fSwgcHJvcHNbcHJvcE5hbWVdLCBzaGFwZVR5cGVzKTtcbiAgICAgICAgICBmb3IgKHZhciBrZXkgaW4gYWxsS2V5cykge1xuICAgICAgICAgICAgdmFyIGNoZWNrZXIgPSBzaGFwZVR5cGVzW2tleV07XG4gICAgICAgICAgICBpZiAoaGFzKHNoYXBlVHlwZXMsIGtleSkgJiYgdHlwZW9mIGNoZWNrZXIgIT09IFwiZnVuY3Rpb25cIikge1xuICAgICAgICAgICAgICByZXR1cm4gaW52YWxpZFZhbGlkYXRvckVycm9yKGNvbXBvbmVudE5hbWUsIGxvY2F0aW9uLCBwcm9wRnVsbE5hbWUsIGtleSwgZ2V0UHJlY2lzZVR5cGUoY2hlY2tlcikpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKCFjaGVja2VyKSB7XG4gICAgICAgICAgICAgIHJldHVybiBuZXcgUHJvcFR5cGVFcnJvcihcbiAgICAgICAgICAgICAgICBcIkludmFsaWQgXCIgKyBsb2NhdGlvbiArIFwiIGBcIiArIHByb3BGdWxsTmFtZSArIFwiYCBrZXkgYFwiICsga2V5ICsgXCJgIHN1cHBsaWVkIHRvIGBcIiArIGNvbXBvbmVudE5hbWUgKyBcImAuXFxuQmFkIG9iamVjdDogXCIgKyBKU09OLnN0cmluZ2lmeShwcm9wc1twcm9wTmFtZV0sIG51bGwsIFwiICBcIikgKyBcIlxcblZhbGlkIGtleXM6IFwiICsgSlNPTi5zdHJpbmdpZnkoT2JqZWN0LmtleXMoc2hhcGVUeXBlcyksIG51bGwsIFwiICBcIilcbiAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHZhciBlcnJvciA9IGNoZWNrZXIocHJvcFZhbHVlLCBrZXksIGNvbXBvbmVudE5hbWUsIGxvY2F0aW9uLCBwcm9wRnVsbE5hbWUgKyBcIi5cIiArIGtleSwgUmVhY3RQcm9wVHlwZXNTZWNyZXQpO1xuICAgICAgICAgICAgaWYgKGVycm9yKSB7XG4gICAgICAgICAgICAgIHJldHVybiBlcnJvcjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGNyZWF0ZUNoYWluYWJsZVR5cGVDaGVja2VyKHZhbGlkYXRlMik7XG4gICAgICB9XG4gICAgICBmdW5jdGlvbiBpc05vZGUocHJvcFZhbHVlKSB7XG4gICAgICAgIHN3aXRjaCAodHlwZW9mIHByb3BWYWx1ZSkge1xuICAgICAgICAgIGNhc2UgXCJudW1iZXJcIjpcbiAgICAgICAgICBjYXNlIFwic3RyaW5nXCI6XG4gICAgICAgICAgY2FzZSBcInVuZGVmaW5lZFwiOlxuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgY2FzZSBcImJvb2xlYW5cIjpcbiAgICAgICAgICAgIHJldHVybiAhcHJvcFZhbHVlO1xuICAgICAgICAgIGNhc2UgXCJvYmplY3RcIjpcbiAgICAgICAgICAgIGlmIChBcnJheS5pc0FycmF5KHByb3BWYWx1ZSkpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIHByb3BWYWx1ZS5ldmVyeShpc05vZGUpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHByb3BWYWx1ZSA9PT0gbnVsbCB8fCBpc1ZhbGlkRWxlbWVudChwcm9wVmFsdWUpKSB7XG4gICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdmFyIGl0ZXJhdG9yRm4gPSBnZXRJdGVyYXRvckZuKHByb3BWYWx1ZSk7XG4gICAgICAgICAgICBpZiAoaXRlcmF0b3JGbikge1xuICAgICAgICAgICAgICB2YXIgaXRlcmF0b3IgPSBpdGVyYXRvckZuLmNhbGwocHJvcFZhbHVlKTtcbiAgICAgICAgICAgICAgdmFyIHN0ZXA7XG4gICAgICAgICAgICAgIGlmIChpdGVyYXRvckZuICE9PSBwcm9wVmFsdWUuZW50cmllcykge1xuICAgICAgICAgICAgICAgIHdoaWxlICghKHN0ZXAgPSBpdGVyYXRvci5uZXh0KCkpLmRvbmUpIHtcbiAgICAgICAgICAgICAgICAgIGlmICghaXNOb2RlKHN0ZXAudmFsdWUpKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgd2hpbGUgKCEoc3RlcCA9IGl0ZXJhdG9yLm5leHQoKSkuZG9uZSkge1xuICAgICAgICAgICAgICAgICAgdmFyIGVudHJ5ID0gc3RlcC52YWx1ZTtcbiAgICAgICAgICAgICAgICAgIGlmIChlbnRyeSkge1xuICAgICAgICAgICAgICAgICAgICBpZiAoIWlzTm9kZShlbnRyeVsxXSkpIHtcbiAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGZ1bmN0aW9uIGlzU3ltYm9sKHByb3BUeXBlLCBwcm9wVmFsdWUpIHtcbiAgICAgICAgaWYgKHByb3BUeXBlID09PSBcInN5bWJvbFwiKSB7XG4gICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCFwcm9wVmFsdWUpIHtcbiAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHByb3BWYWx1ZVtcIkBAdG9TdHJpbmdUYWdcIl0gPT09IFwiU3ltYm9sXCIpIHtcbiAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICBpZiAodHlwZW9mIFN5bWJvbCA9PT0gXCJmdW5jdGlvblwiICYmIHByb3BWYWx1ZSBpbnN0YW5jZW9mIFN5bWJvbCkge1xuICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cbiAgICAgIGZ1bmN0aW9uIGdldFByb3BUeXBlKHByb3BWYWx1ZSkge1xuICAgICAgICB2YXIgcHJvcFR5cGUgPSB0eXBlb2YgcHJvcFZhbHVlO1xuICAgICAgICBpZiAoQXJyYXkuaXNBcnJheShwcm9wVmFsdWUpKSB7XG4gICAgICAgICAgcmV0dXJuIFwiYXJyYXlcIjtcbiAgICAgICAgfVxuICAgICAgICBpZiAocHJvcFZhbHVlIGluc3RhbmNlb2YgUmVnRXhwKSB7XG4gICAgICAgICAgcmV0dXJuIFwib2JqZWN0XCI7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGlzU3ltYm9sKHByb3BUeXBlLCBwcm9wVmFsdWUpKSB7XG4gICAgICAgICAgcmV0dXJuIFwic3ltYm9sXCI7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHByb3BUeXBlO1xuICAgICAgfVxuICAgICAgZnVuY3Rpb24gZ2V0UHJlY2lzZVR5cGUocHJvcFZhbHVlKSB7XG4gICAgICAgIGlmICh0eXBlb2YgcHJvcFZhbHVlID09PSBcInVuZGVmaW5lZFwiIHx8IHByb3BWYWx1ZSA9PT0gbnVsbCkge1xuICAgICAgICAgIHJldHVybiBcIlwiICsgcHJvcFZhbHVlO1xuICAgICAgICB9XG4gICAgICAgIHZhciBwcm9wVHlwZSA9IGdldFByb3BUeXBlKHByb3BWYWx1ZSk7XG4gICAgICAgIGlmIChwcm9wVHlwZSA9PT0gXCJvYmplY3RcIikge1xuICAgICAgICAgIGlmIChwcm9wVmFsdWUgaW5zdGFuY2VvZiBEYXRlKSB7XG4gICAgICAgICAgICByZXR1cm4gXCJkYXRlXCI7XG4gICAgICAgICAgfSBlbHNlIGlmIChwcm9wVmFsdWUgaW5zdGFuY2VvZiBSZWdFeHApIHtcbiAgICAgICAgICAgIHJldHVybiBcInJlZ2V4cFwiO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcHJvcFR5cGU7XG4gICAgICB9XG4gICAgICBmdW5jdGlvbiBnZXRQb3N0Zml4Rm9yVHlwZVdhcm5pbmcodmFsdWUpIHtcbiAgICAgICAgdmFyIHR5cGUgPSBnZXRQcmVjaXNlVHlwZSh2YWx1ZSk7XG4gICAgICAgIHN3aXRjaCAodHlwZSkge1xuICAgICAgICAgIGNhc2UgXCJhcnJheVwiOlxuICAgICAgICAgIGNhc2UgXCJvYmplY3RcIjpcbiAgICAgICAgICAgIHJldHVybiBcImFuIFwiICsgdHlwZTtcbiAgICAgICAgICBjYXNlIFwiYm9vbGVhblwiOlxuICAgICAgICAgIGNhc2UgXCJkYXRlXCI6XG4gICAgICAgICAgY2FzZSBcInJlZ2V4cFwiOlxuICAgICAgICAgICAgcmV0dXJuIFwiYSBcIiArIHR5cGU7XG4gICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgIHJldHVybiB0eXBlO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBmdW5jdGlvbiBnZXRDbGFzc05hbWUocHJvcFZhbHVlKSB7XG4gICAgICAgIGlmICghcHJvcFZhbHVlLmNvbnN0cnVjdG9yIHx8ICFwcm9wVmFsdWUuY29uc3RydWN0b3IubmFtZSkge1xuICAgICAgICAgIHJldHVybiBBTk9OWU1PVVM7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHByb3BWYWx1ZS5jb25zdHJ1Y3Rvci5uYW1lO1xuICAgICAgfVxuICAgICAgUmVhY3RQcm9wVHlwZXMuY2hlY2tQcm9wVHlwZXMgPSBjaGVja1Byb3BUeXBlcztcbiAgICAgIFJlYWN0UHJvcFR5cGVzLnJlc2V0V2FybmluZ0NhY2hlID0gY2hlY2tQcm9wVHlwZXMucmVzZXRXYXJuaW5nQ2FjaGU7XG4gICAgICBSZWFjdFByb3BUeXBlcy5Qcm9wVHlwZXMgPSBSZWFjdFByb3BUeXBlcztcbiAgICAgIHJldHVybiBSZWFjdFByb3BUeXBlcztcbiAgICB9O1xuICB9XG59KTtcblxuLy8gbm9kZV9tb2R1bGVzL3Byb3AtdHlwZXMvaW5kZXguanNcbnZhciByZXF1aXJlX3Byb3BfdHlwZXMgPSBfX2NvbW1vbkpTKHtcbiAgXCJub2RlX21vZHVsZXMvcHJvcC10eXBlcy9pbmRleC5qc1wiKGV4cG9ydHMsIG1vZHVsZSkge1xuICAgIGlmICh0cnVlKSB7XG4gICAgICBSZWFjdElzID0gcmVxdWlyZV9yZWFjdF9pcygpO1xuICAgICAgdGhyb3dPbkRpcmVjdEFjY2VzcyA9IHRydWU7XG4gICAgICBtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmVfZmFjdG9yeVdpdGhUeXBlQ2hlY2tlcnMoKShSZWFjdElzLmlzRWxlbWVudCwgdGhyb3dPbkRpcmVjdEFjY2Vzcyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIG1vZHVsZS5leHBvcnRzID0gbnVsbCgpO1xuICAgIH1cbiAgICB2YXIgUmVhY3RJcztcbiAgICB2YXIgdGhyb3dPbkRpcmVjdEFjY2VzcztcbiAgfVxufSk7XG5cbi8vIG5vZGVfbW9kdWxlcy9ob2lzdC1ub24tcmVhY3Qtc3RhdGljcy9kaXN0L2hvaXN0LW5vbi1yZWFjdC1zdGF0aWNzLmNqcy5qc1xudmFyIHJlcXVpcmVfaG9pc3Rfbm9uX3JlYWN0X3N0YXRpY3NfY2pzID0gX19jb21tb25KUyh7XG4gIFwibm9kZV9tb2R1bGVzL2hvaXN0LW5vbi1yZWFjdC1zdGF0aWNzL2Rpc3QvaG9pc3Qtbm9uLXJlYWN0LXN0YXRpY3MuY2pzLmpzXCIoZXhwb3J0cywgbW9kdWxlKSB7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG4gICAgdmFyIHJlYWN0SXMgPSByZXF1aXJlX3JlYWN0X2lzKCk7XG4gICAgdmFyIFJFQUNUX1NUQVRJQ1MgPSB7XG4gICAgICBjaGlsZENvbnRleHRUeXBlczogdHJ1ZSxcbiAgICAgIGNvbnRleHRUeXBlOiB0cnVlLFxuICAgICAgY29udGV4dFR5cGVzOiB0cnVlLFxuICAgICAgZGVmYXVsdFByb3BzOiB0cnVlLFxuICAgICAgZGlzcGxheU5hbWU6IHRydWUsXG4gICAgICBnZXREZWZhdWx0UHJvcHM6IHRydWUsXG4gICAgICBnZXREZXJpdmVkU3RhdGVGcm9tRXJyb3I6IHRydWUsXG4gICAgICBnZXREZXJpdmVkU3RhdGVGcm9tUHJvcHM6IHRydWUsXG4gICAgICBtaXhpbnM6IHRydWUsXG4gICAgICBwcm9wVHlwZXM6IHRydWUsXG4gICAgICB0eXBlOiB0cnVlXG4gICAgfTtcbiAgICB2YXIgS05PV05fU1RBVElDUyA9IHtcbiAgICAgIG5hbWU6IHRydWUsXG4gICAgICBsZW5ndGg6IHRydWUsXG4gICAgICBwcm90b3R5cGU6IHRydWUsXG4gICAgICBjYWxsZXI6IHRydWUsXG4gICAgICBjYWxsZWU6IHRydWUsXG4gICAgICBhcmd1bWVudHM6IHRydWUsXG4gICAgICBhcml0eTogdHJ1ZVxuICAgIH07XG4gICAgdmFyIEZPUldBUkRfUkVGX1NUQVRJQ1MgPSB7XG4gICAgICBcIiQkdHlwZW9mXCI6IHRydWUsXG4gICAgICByZW5kZXI6IHRydWUsXG4gICAgICBkZWZhdWx0UHJvcHM6IHRydWUsXG4gICAgICBkaXNwbGF5TmFtZTogdHJ1ZSxcbiAgICAgIHByb3BUeXBlczogdHJ1ZVxuICAgIH07XG4gICAgdmFyIE1FTU9fU1RBVElDUyA9IHtcbiAgICAgIFwiJCR0eXBlb2ZcIjogdHJ1ZSxcbiAgICAgIGNvbXBhcmU6IHRydWUsXG4gICAgICBkZWZhdWx0UHJvcHM6IHRydWUsXG4gICAgICBkaXNwbGF5TmFtZTogdHJ1ZSxcbiAgICAgIHByb3BUeXBlczogdHJ1ZSxcbiAgICAgIHR5cGU6IHRydWVcbiAgICB9O1xuICAgIHZhciBUWVBFX1NUQVRJQ1MgPSB7fTtcbiAgICBUWVBFX1NUQVRJQ1NbcmVhY3RJcy5Gb3J3YXJkUmVmXSA9IEZPUldBUkRfUkVGX1NUQVRJQ1M7XG4gICAgVFlQRV9TVEFUSUNTW3JlYWN0SXMuTWVtb10gPSBNRU1PX1NUQVRJQ1M7XG4gICAgZnVuY3Rpb24gZ2V0U3RhdGljcyhjb21wb25lbnQpIHtcbiAgICAgIGlmIChyZWFjdElzLmlzTWVtbyhjb21wb25lbnQpKSB7XG4gICAgICAgIHJldHVybiBNRU1PX1NUQVRJQ1M7XG4gICAgICB9XG4gICAgICByZXR1cm4gVFlQRV9TVEFUSUNTW2NvbXBvbmVudFtcIiQkdHlwZW9mXCJdXSB8fCBSRUFDVF9TVEFUSUNTO1xuICAgIH1cbiAgICB2YXIgZGVmaW5lUHJvcGVydHkgPSBPYmplY3QuZGVmaW5lUHJvcGVydHk7XG4gICAgdmFyIGdldE93blByb3BlcnR5TmFtZXMgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcztcbiAgICB2YXIgZ2V0T3duUHJvcGVydHlTeW1ib2xzID0gT2JqZWN0LmdldE93blByb3BlcnR5U3ltYm9scztcbiAgICB2YXIgZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yID0gT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcjtcbiAgICB2YXIgZ2V0UHJvdG90eXBlT2YgPSBPYmplY3QuZ2V0UHJvdG90eXBlT2Y7XG4gICAgdmFyIG9iamVjdFByb3RvdHlwZSA9IE9iamVjdC5wcm90b3R5cGU7XG4gICAgZnVuY3Rpb24gaG9pc3ROb25SZWFjdFN0YXRpY3ModGFyZ2V0Q29tcG9uZW50LCBzb3VyY2VDb21wb25lbnQsIGJsYWNrbGlzdCkge1xuICAgICAgaWYgKHR5cGVvZiBzb3VyY2VDb21wb25lbnQgIT09IFwic3RyaW5nXCIpIHtcbiAgICAgICAgaWYgKG9iamVjdFByb3RvdHlwZSkge1xuICAgICAgICAgIHZhciBpbmhlcml0ZWRDb21wb25lbnQgPSBnZXRQcm90b3R5cGVPZihzb3VyY2VDb21wb25lbnQpO1xuICAgICAgICAgIGlmIChpbmhlcml0ZWRDb21wb25lbnQgJiYgaW5oZXJpdGVkQ29tcG9uZW50ICE9PSBvYmplY3RQcm90b3R5cGUpIHtcbiAgICAgICAgICAgIGhvaXN0Tm9uUmVhY3RTdGF0aWNzKHRhcmdldENvbXBvbmVudCwgaW5oZXJpdGVkQ29tcG9uZW50LCBibGFja2xpc3QpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICB2YXIga2V5cyA9IGdldE93blByb3BlcnR5TmFtZXMoc291cmNlQ29tcG9uZW50KTtcbiAgICAgICAgaWYgKGdldE93blByb3BlcnR5U3ltYm9scykge1xuICAgICAgICAgIGtleXMgPSBrZXlzLmNvbmNhdChnZXRPd25Qcm9wZXJ0eVN5bWJvbHMoc291cmNlQ29tcG9uZW50KSk7XG4gICAgICAgIH1cbiAgICAgICAgdmFyIHRhcmdldFN0YXRpY3MgPSBnZXRTdGF0aWNzKHRhcmdldENvbXBvbmVudCk7XG4gICAgICAgIHZhciBzb3VyY2VTdGF0aWNzID0gZ2V0U3RhdGljcyhzb3VyY2VDb21wb25lbnQpO1xuICAgICAgICBmb3IgKHZhciBpMiA9IDA7IGkyIDwga2V5cy5sZW5ndGg7ICsraTIpIHtcbiAgICAgICAgICB2YXIga2V5ID0ga2V5c1tpMl07XG4gICAgICAgICAgaWYgKCFLTk9XTl9TVEFUSUNTW2tleV0gJiYgIShibGFja2xpc3QgJiYgYmxhY2tsaXN0W2tleV0pICYmICEoc291cmNlU3RhdGljcyAmJiBzb3VyY2VTdGF0aWNzW2tleV0pICYmICEodGFyZ2V0U3RhdGljcyAmJiB0YXJnZXRTdGF0aWNzW2tleV0pKSB7XG4gICAgICAgICAgICB2YXIgZGVzY3JpcHRvciA9IGdldE93blByb3BlcnR5RGVzY3JpcHRvcihzb3VyY2VDb21wb25lbnQsIGtleSk7XG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICBkZWZpbmVQcm9wZXJ0eSh0YXJnZXRDb21wb25lbnQsIGtleSwgZGVzY3JpcHRvcik7XG4gICAgICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgICByZXR1cm4gdGFyZ2V0Q29tcG9uZW50O1xuICAgIH1cbiAgICBtb2R1bGUuZXhwb3J0cyA9IGhvaXN0Tm9uUmVhY3RTdGF0aWNzO1xuICB9XG59KTtcblxuLy8gbm9kZV9tb2R1bGVzL3JlYWN0LXJlZHV4L25vZGVfbW9kdWxlcy9yZWFjdC1pcy9janMvcmVhY3QtaXMuZGV2ZWxvcG1lbnQuanNcbnZhciByZXF1aXJlX3JlYWN0X2lzX2RldmVsb3BtZW50MiA9IF9fY29tbW9uSlMoe1xuICBcIm5vZGVfbW9kdWxlcy9yZWFjdC1yZWR1eC9ub2RlX21vZHVsZXMvcmVhY3QtaXMvY2pzL3JlYWN0LWlzLmRldmVsb3BtZW50LmpzXCIoZXhwb3J0cykge1xuICAgIFwidXNlIHN0cmljdFwiO1xuICAgIGlmICh0cnVlKSB7XG4gICAgICAoZnVuY3Rpb24oKSB7XG4gICAgICAgIFwidXNlIHN0cmljdFwiO1xuICAgICAgICB2YXIgUkVBQ1RfRUxFTUVOVF9UWVBFID0gNjAxMDM7XG4gICAgICAgIHZhciBSRUFDVF9QT1JUQUxfVFlQRSA9IDYwMTA2O1xuICAgICAgICB2YXIgUkVBQ1RfRlJBR01FTlRfVFlQRSA9IDYwMTA3O1xuICAgICAgICB2YXIgUkVBQ1RfU1RSSUNUX01PREVfVFlQRSA9IDYwMTA4O1xuICAgICAgICB2YXIgUkVBQ1RfUFJPRklMRVJfVFlQRSA9IDYwMTE0O1xuICAgICAgICB2YXIgUkVBQ1RfUFJPVklERVJfVFlQRSA9IDYwMTA5O1xuICAgICAgICB2YXIgUkVBQ1RfQ09OVEVYVF9UWVBFID0gNjAxMTA7XG4gICAgICAgIHZhciBSRUFDVF9GT1JXQVJEX1JFRl9UWVBFID0gNjAxMTI7XG4gICAgICAgIHZhciBSRUFDVF9TVVNQRU5TRV9UWVBFID0gNjAxMTM7XG4gICAgICAgIHZhciBSRUFDVF9TVVNQRU5TRV9MSVNUX1RZUEUgPSA2MDEyMDtcbiAgICAgICAgdmFyIFJFQUNUX01FTU9fVFlQRSA9IDYwMTE1O1xuICAgICAgICB2YXIgUkVBQ1RfTEFaWV9UWVBFID0gNjAxMTY7XG4gICAgICAgIHZhciBSRUFDVF9CTE9DS19UWVBFID0gNjAxMjE7XG4gICAgICAgIHZhciBSRUFDVF9TRVJWRVJfQkxPQ0tfVFlQRSA9IDYwMTIyO1xuICAgICAgICB2YXIgUkVBQ1RfRlVOREFNRU5UQUxfVFlQRSA9IDYwMTE3O1xuICAgICAgICB2YXIgUkVBQ1RfU0NPUEVfVFlQRSA9IDYwMTE5O1xuICAgICAgICB2YXIgUkVBQ1RfT1BBUVVFX0lEX1RZUEUgPSA2MDEyODtcbiAgICAgICAgdmFyIFJFQUNUX0RFQlVHX1RSQUNJTkdfTU9ERV9UWVBFID0gNjAxMjk7XG4gICAgICAgIHZhciBSRUFDVF9PRkZTQ1JFRU5fVFlQRSA9IDYwMTMwO1xuICAgICAgICB2YXIgUkVBQ1RfTEVHQUNZX0hJRERFTl9UWVBFID0gNjAxMzE7XG4gICAgICAgIGlmICh0eXBlb2YgU3ltYm9sID09PSBcImZ1bmN0aW9uXCIgJiYgU3ltYm9sLmZvcikge1xuICAgICAgICAgIHZhciBzeW1ib2xGb3IgPSBTeW1ib2wuZm9yO1xuICAgICAgICAgIFJFQUNUX0VMRU1FTlRfVFlQRSA9IHN5bWJvbEZvcihcInJlYWN0LmVsZW1lbnRcIik7XG4gICAgICAgICAgUkVBQ1RfUE9SVEFMX1RZUEUgPSBzeW1ib2xGb3IoXCJyZWFjdC5wb3J0YWxcIik7XG4gICAgICAgICAgUkVBQ1RfRlJBR01FTlRfVFlQRSA9IHN5bWJvbEZvcihcInJlYWN0LmZyYWdtZW50XCIpO1xuICAgICAgICAgIFJFQUNUX1NUUklDVF9NT0RFX1RZUEUgPSBzeW1ib2xGb3IoXCJyZWFjdC5zdHJpY3RfbW9kZVwiKTtcbiAgICAgICAgICBSRUFDVF9QUk9GSUxFUl9UWVBFID0gc3ltYm9sRm9yKFwicmVhY3QucHJvZmlsZXJcIik7XG4gICAgICAgICAgUkVBQ1RfUFJPVklERVJfVFlQRSA9IHN5bWJvbEZvcihcInJlYWN0LnByb3ZpZGVyXCIpO1xuICAgICAgICAgIFJFQUNUX0NPTlRFWFRfVFlQRSA9IHN5bWJvbEZvcihcInJlYWN0LmNvbnRleHRcIik7XG4gICAgICAgICAgUkVBQ1RfRk9SV0FSRF9SRUZfVFlQRSA9IHN5bWJvbEZvcihcInJlYWN0LmZvcndhcmRfcmVmXCIpO1xuICAgICAgICAgIFJFQUNUX1NVU1BFTlNFX1RZUEUgPSBzeW1ib2xGb3IoXCJyZWFjdC5zdXNwZW5zZVwiKTtcbiAgICAgICAgICBSRUFDVF9TVVNQRU5TRV9MSVNUX1RZUEUgPSBzeW1ib2xGb3IoXCJyZWFjdC5zdXNwZW5zZV9saXN0XCIpO1xuICAgICAgICAgIFJFQUNUX01FTU9fVFlQRSA9IHN5bWJvbEZvcihcInJlYWN0Lm1lbW9cIik7XG4gICAgICAgICAgUkVBQ1RfTEFaWV9UWVBFID0gc3ltYm9sRm9yKFwicmVhY3QubGF6eVwiKTtcbiAgICAgICAgICBSRUFDVF9CTE9DS19UWVBFID0gc3ltYm9sRm9yKFwicmVhY3QuYmxvY2tcIik7XG4gICAgICAgICAgUkVBQ1RfU0VSVkVSX0JMT0NLX1RZUEUgPSBzeW1ib2xGb3IoXCJyZWFjdC5zZXJ2ZXIuYmxvY2tcIik7XG4gICAgICAgICAgUkVBQ1RfRlVOREFNRU5UQUxfVFlQRSA9IHN5bWJvbEZvcihcInJlYWN0LmZ1bmRhbWVudGFsXCIpO1xuICAgICAgICAgIFJFQUNUX1NDT1BFX1RZUEUgPSBzeW1ib2xGb3IoXCJyZWFjdC5zY29wZVwiKTtcbiAgICAgICAgICBSRUFDVF9PUEFRVUVfSURfVFlQRSA9IHN5bWJvbEZvcihcInJlYWN0Lm9wYXF1ZS5pZFwiKTtcbiAgICAgICAgICBSRUFDVF9ERUJVR19UUkFDSU5HX01PREVfVFlQRSA9IHN5bWJvbEZvcihcInJlYWN0LmRlYnVnX3RyYWNlX21vZGVcIik7XG4gICAgICAgICAgUkVBQ1RfT0ZGU0NSRUVOX1RZUEUgPSBzeW1ib2xGb3IoXCJyZWFjdC5vZmZzY3JlZW5cIik7XG4gICAgICAgICAgUkVBQ1RfTEVHQUNZX0hJRERFTl9UWVBFID0gc3ltYm9sRm9yKFwicmVhY3QubGVnYWN5X2hpZGRlblwiKTtcbiAgICAgICAgfVxuICAgICAgICB2YXIgZW5hYmxlU2NvcGVBUEkgPSBmYWxzZTtcbiAgICAgICAgZnVuY3Rpb24gaXNWYWxpZEVsZW1lbnRUeXBlMih0eXBlKSB7XG4gICAgICAgICAgaWYgKHR5cGVvZiB0eXBlID09PSBcInN0cmluZ1wiIHx8IHR5cGVvZiB0eXBlID09PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAodHlwZSA9PT0gUkVBQ1RfRlJBR01FTlRfVFlQRSB8fCB0eXBlID09PSBSRUFDVF9QUk9GSUxFUl9UWVBFIHx8IHR5cGUgPT09IFJFQUNUX0RFQlVHX1RSQUNJTkdfTU9ERV9UWVBFIHx8IHR5cGUgPT09IFJFQUNUX1NUUklDVF9NT0RFX1RZUEUgfHwgdHlwZSA9PT0gUkVBQ1RfU1VTUEVOU0VfVFlQRSB8fCB0eXBlID09PSBSRUFDVF9TVVNQRU5TRV9MSVNUX1RZUEUgfHwgdHlwZSA9PT0gUkVBQ1RfTEVHQUNZX0hJRERFTl9UWVBFIHx8IGVuYWJsZVNjb3BlQVBJKSB7XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKHR5cGVvZiB0eXBlID09PSBcIm9iamVjdFwiICYmIHR5cGUgIT09IG51bGwpIHtcbiAgICAgICAgICAgIGlmICh0eXBlLiQkdHlwZW9mID09PSBSRUFDVF9MQVpZX1RZUEUgfHwgdHlwZS4kJHR5cGVvZiA9PT0gUkVBQ1RfTUVNT19UWVBFIHx8IHR5cGUuJCR0eXBlb2YgPT09IFJFQUNUX1BST1ZJREVSX1RZUEUgfHwgdHlwZS4kJHR5cGVvZiA9PT0gUkVBQ1RfQ09OVEVYVF9UWVBFIHx8IHR5cGUuJCR0eXBlb2YgPT09IFJFQUNUX0ZPUldBUkRfUkVGX1RZUEUgfHwgdHlwZS4kJHR5cGVvZiA9PT0gUkVBQ1RfRlVOREFNRU5UQUxfVFlQRSB8fCB0eXBlLiQkdHlwZW9mID09PSBSRUFDVF9CTE9DS19UWVBFIHx8IHR5cGVbMF0gPT09IFJFQUNUX1NFUlZFUl9CTE9DS19UWVBFKSB7XG4gICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgICAgZnVuY3Rpb24gdHlwZU9mKG9iamVjdCkge1xuICAgICAgICAgIGlmICh0eXBlb2Ygb2JqZWN0ID09PSBcIm9iamVjdFwiICYmIG9iamVjdCAhPT0gbnVsbCkge1xuICAgICAgICAgICAgdmFyICQkdHlwZW9mID0gb2JqZWN0LiQkdHlwZW9mO1xuICAgICAgICAgICAgc3dpdGNoICgkJHR5cGVvZikge1xuICAgICAgICAgICAgICBjYXNlIFJFQUNUX0VMRU1FTlRfVFlQRTpcbiAgICAgICAgICAgICAgICB2YXIgdHlwZSA9IG9iamVjdC50eXBlO1xuICAgICAgICAgICAgICAgIHN3aXRjaCAodHlwZSkge1xuICAgICAgICAgICAgICAgICAgY2FzZSBSRUFDVF9GUkFHTUVOVF9UWVBFOlxuICAgICAgICAgICAgICAgICAgY2FzZSBSRUFDVF9QUk9GSUxFUl9UWVBFOlxuICAgICAgICAgICAgICAgICAgY2FzZSBSRUFDVF9TVFJJQ1RfTU9ERV9UWVBFOlxuICAgICAgICAgICAgICAgICAgY2FzZSBSRUFDVF9TVVNQRU5TRV9UWVBFOlxuICAgICAgICAgICAgICAgICAgY2FzZSBSRUFDVF9TVVNQRU5TRV9MSVNUX1RZUEU6XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0eXBlO1xuICAgICAgICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICAgICAgdmFyICQkdHlwZW9mVHlwZSA9IHR5cGUgJiYgdHlwZS4kJHR5cGVvZjtcbiAgICAgICAgICAgICAgICAgICAgc3dpdGNoICgkJHR5cGVvZlR5cGUpIHtcbiAgICAgICAgICAgICAgICAgICAgICBjYXNlIFJFQUNUX0NPTlRFWFRfVFlQRTpcbiAgICAgICAgICAgICAgICAgICAgICBjYXNlIFJFQUNUX0ZPUldBUkRfUkVGX1RZUEU6XG4gICAgICAgICAgICAgICAgICAgICAgY2FzZSBSRUFDVF9MQVpZX1RZUEU6XG4gICAgICAgICAgICAgICAgICAgICAgY2FzZSBSRUFDVF9NRU1PX1RZUEU6XG4gICAgICAgICAgICAgICAgICAgICAgY2FzZSBSRUFDVF9QUk9WSURFUl9UWVBFOlxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuICQkdHlwZW9mVHlwZTtcbiAgICAgICAgICAgICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuICQkdHlwZW9mO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICBjYXNlIFJFQUNUX1BPUlRBTF9UWVBFOlxuICAgICAgICAgICAgICAgIHJldHVybiAkJHR5cGVvZjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgICAgcmV0dXJuIHZvaWQgMDtcbiAgICAgICAgfVxuICAgICAgICB2YXIgQ29udGV4dENvbnN1bWVyID0gUkVBQ1RfQ09OVEVYVF9UWVBFO1xuICAgICAgICB2YXIgQ29udGV4dFByb3ZpZGVyID0gUkVBQ1RfUFJPVklERVJfVFlQRTtcbiAgICAgICAgdmFyIEVsZW1lbnQgPSBSRUFDVF9FTEVNRU5UX1RZUEU7XG4gICAgICAgIHZhciBGb3J3YXJkUmVmID0gUkVBQ1RfRk9SV0FSRF9SRUZfVFlQRTtcbiAgICAgICAgdmFyIEZyYWdtZW50MyA9IFJFQUNUX0ZSQUdNRU5UX1RZUEU7XG4gICAgICAgIHZhciBMYXp5ID0gUkVBQ1RfTEFaWV9UWVBFO1xuICAgICAgICB2YXIgTWVtbyA9IFJFQUNUX01FTU9fVFlQRTtcbiAgICAgICAgdmFyIFBvcnRhbCA9IFJFQUNUX1BPUlRBTF9UWVBFO1xuICAgICAgICB2YXIgUHJvZmlsZXIgPSBSRUFDVF9QUk9GSUxFUl9UWVBFO1xuICAgICAgICB2YXIgU3RyaWN0TW9kZSA9IFJFQUNUX1NUUklDVF9NT0RFX1RZUEU7XG4gICAgICAgIHZhciBTdXNwZW5zZSA9IFJFQUNUX1NVU1BFTlNFX1RZUEU7XG4gICAgICAgIHZhciBoYXNXYXJuZWRBYm91dERlcHJlY2F0ZWRJc0FzeW5jTW9kZSA9IGZhbHNlO1xuICAgICAgICB2YXIgaGFzV2FybmVkQWJvdXREZXByZWNhdGVkSXNDb25jdXJyZW50TW9kZSA9IGZhbHNlO1xuICAgICAgICBmdW5jdGlvbiBpc0FzeW5jTW9kZShvYmplY3QpIHtcbiAgICAgICAgICB7XG4gICAgICAgICAgICBpZiAoIWhhc1dhcm5lZEFib3V0RGVwcmVjYXRlZElzQXN5bmNNb2RlKSB7XG4gICAgICAgICAgICAgIGhhc1dhcm5lZEFib3V0RGVwcmVjYXRlZElzQXN5bmNNb2RlID0gdHJ1ZTtcbiAgICAgICAgICAgICAgY29uc29sZVtcIndhcm5cIl0oXCJUaGUgUmVhY3RJcy5pc0FzeW5jTW9kZSgpIGFsaWFzIGhhcyBiZWVuIGRlcHJlY2F0ZWQsIGFuZCB3aWxsIGJlIHJlbW92ZWQgaW4gUmVhY3QgMTgrLlwiKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIGZ1bmN0aW9uIGlzQ29uY3VycmVudE1vZGUob2JqZWN0KSB7XG4gICAgICAgICAge1xuICAgICAgICAgICAgaWYgKCFoYXNXYXJuZWRBYm91dERlcHJlY2F0ZWRJc0NvbmN1cnJlbnRNb2RlKSB7XG4gICAgICAgICAgICAgIGhhc1dhcm5lZEFib3V0RGVwcmVjYXRlZElzQ29uY3VycmVudE1vZGUgPSB0cnVlO1xuICAgICAgICAgICAgICBjb25zb2xlW1wid2FyblwiXShcIlRoZSBSZWFjdElzLmlzQ29uY3VycmVudE1vZGUoKSBhbGlhcyBoYXMgYmVlbiBkZXByZWNhdGVkLCBhbmQgd2lsbCBiZSByZW1vdmVkIGluIFJlYWN0IDE4Ky5cIik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgICBmdW5jdGlvbiBpc0NvbnRleHRDb25zdW1lcjIob2JqZWN0KSB7XG4gICAgICAgICAgcmV0dXJuIHR5cGVPZihvYmplY3QpID09PSBSRUFDVF9DT05URVhUX1RZUEU7XG4gICAgICAgIH1cbiAgICAgICAgZnVuY3Rpb24gaXNDb250ZXh0UHJvdmlkZXIob2JqZWN0KSB7XG4gICAgICAgICAgcmV0dXJuIHR5cGVPZihvYmplY3QpID09PSBSRUFDVF9QUk9WSURFUl9UWVBFO1xuICAgICAgICB9XG4gICAgICAgIGZ1bmN0aW9uIGlzRWxlbWVudChvYmplY3QpIHtcbiAgICAgICAgICByZXR1cm4gdHlwZW9mIG9iamVjdCA9PT0gXCJvYmplY3RcIiAmJiBvYmplY3QgIT09IG51bGwgJiYgb2JqZWN0LiQkdHlwZW9mID09PSBSRUFDVF9FTEVNRU5UX1RZUEU7XG4gICAgICAgIH1cbiAgICAgICAgZnVuY3Rpb24gaXNGb3J3YXJkUmVmKG9iamVjdCkge1xuICAgICAgICAgIHJldHVybiB0eXBlT2Yob2JqZWN0KSA9PT0gUkVBQ1RfRk9SV0FSRF9SRUZfVFlQRTtcbiAgICAgICAgfVxuICAgICAgICBmdW5jdGlvbiBpc0ZyYWdtZW50KG9iamVjdCkge1xuICAgICAgICAgIHJldHVybiB0eXBlT2Yob2JqZWN0KSA9PT0gUkVBQ1RfRlJBR01FTlRfVFlQRTtcbiAgICAgICAgfVxuICAgICAgICBmdW5jdGlvbiBpc0xhenkob2JqZWN0KSB7XG4gICAgICAgICAgcmV0dXJuIHR5cGVPZihvYmplY3QpID09PSBSRUFDVF9MQVpZX1RZUEU7XG4gICAgICAgIH1cbiAgICAgICAgZnVuY3Rpb24gaXNNZW1vKG9iamVjdCkge1xuICAgICAgICAgIHJldHVybiB0eXBlT2Yob2JqZWN0KSA9PT0gUkVBQ1RfTUVNT19UWVBFO1xuICAgICAgICB9XG4gICAgICAgIGZ1bmN0aW9uIGlzUG9ydGFsKG9iamVjdCkge1xuICAgICAgICAgIHJldHVybiB0eXBlT2Yob2JqZWN0KSA9PT0gUkVBQ1RfUE9SVEFMX1RZUEU7XG4gICAgICAgIH1cbiAgICAgICAgZnVuY3Rpb24gaXNQcm9maWxlcihvYmplY3QpIHtcbiAgICAgICAgICByZXR1cm4gdHlwZU9mKG9iamVjdCkgPT09IFJFQUNUX1BST0ZJTEVSX1RZUEU7XG4gICAgICAgIH1cbiAgICAgICAgZnVuY3Rpb24gaXNTdHJpY3RNb2RlKG9iamVjdCkge1xuICAgICAgICAgIHJldHVybiB0eXBlT2Yob2JqZWN0KSA9PT0gUkVBQ1RfU1RSSUNUX01PREVfVFlQRTtcbiAgICAgICAgfVxuICAgICAgICBmdW5jdGlvbiBpc1N1c3BlbnNlKG9iamVjdCkge1xuICAgICAgICAgIHJldHVybiB0eXBlT2Yob2JqZWN0KSA9PT0gUkVBQ1RfU1VTUEVOU0VfVFlQRTtcbiAgICAgICAgfVxuICAgICAgICBleHBvcnRzLkNvbnRleHRDb25zdW1lciA9IENvbnRleHRDb25zdW1lcjtcbiAgICAgICAgZXhwb3J0cy5Db250ZXh0UHJvdmlkZXIgPSBDb250ZXh0UHJvdmlkZXI7XG4gICAgICAgIGV4cG9ydHMuRWxlbWVudCA9IEVsZW1lbnQ7XG4gICAgICAgIGV4cG9ydHMuRm9yd2FyZFJlZiA9IEZvcndhcmRSZWY7XG4gICAgICAgIGV4cG9ydHMuRnJhZ21lbnQgPSBGcmFnbWVudDM7XG4gICAgICAgIGV4cG9ydHMuTGF6eSA9IExhenk7XG4gICAgICAgIGV4cG9ydHMuTWVtbyA9IE1lbW87XG4gICAgICAgIGV4cG9ydHMuUG9ydGFsID0gUG9ydGFsO1xuICAgICAgICBleHBvcnRzLlByb2ZpbGVyID0gUHJvZmlsZXI7XG4gICAgICAgIGV4cG9ydHMuU3RyaWN0TW9kZSA9IFN0cmljdE1vZGU7XG4gICAgICAgIGV4cG9ydHMuU3VzcGVuc2UgPSBTdXNwZW5zZTtcbiAgICAgICAgZXhwb3J0cy5pc0FzeW5jTW9kZSA9IGlzQXN5bmNNb2RlO1xuICAgICAgICBleHBvcnRzLmlzQ29uY3VycmVudE1vZGUgPSBpc0NvbmN1cnJlbnRNb2RlO1xuICAgICAgICBleHBvcnRzLmlzQ29udGV4dENvbnN1bWVyID0gaXNDb250ZXh0Q29uc3VtZXIyO1xuICAgICAgICBleHBvcnRzLmlzQ29udGV4dFByb3ZpZGVyID0gaXNDb250ZXh0UHJvdmlkZXI7XG4gICAgICAgIGV4cG9ydHMuaXNFbGVtZW50ID0gaXNFbGVtZW50O1xuICAgICAgICBleHBvcnRzLmlzRm9yd2FyZFJlZiA9IGlzRm9yd2FyZFJlZjtcbiAgICAgICAgZXhwb3J0cy5pc0ZyYWdtZW50ID0gaXNGcmFnbWVudDtcbiAgICAgICAgZXhwb3J0cy5pc0xhenkgPSBpc0xhenk7XG4gICAgICAgIGV4cG9ydHMuaXNNZW1vID0gaXNNZW1vO1xuICAgICAgICBleHBvcnRzLmlzUG9ydGFsID0gaXNQb3J0YWw7XG4gICAgICAgIGV4cG9ydHMuaXNQcm9maWxlciA9IGlzUHJvZmlsZXI7XG4gICAgICAgIGV4cG9ydHMuaXNTdHJpY3RNb2RlID0gaXNTdHJpY3RNb2RlO1xuICAgICAgICBleHBvcnRzLmlzU3VzcGVuc2UgPSBpc1N1c3BlbnNlO1xuICAgICAgICBleHBvcnRzLmlzVmFsaWRFbGVtZW50VHlwZSA9IGlzVmFsaWRFbGVtZW50VHlwZTI7XG4gICAgICAgIGV4cG9ydHMudHlwZU9mID0gdHlwZU9mO1xuICAgICAgfSkoKTtcbiAgICB9XG4gIH1cbn0pO1xuXG4vLyBub2RlX21vZHVsZXMvcmVhY3QtcmVkdXgvbm9kZV9tb2R1bGVzL3JlYWN0LWlzL2luZGV4LmpzXG52YXIgcmVxdWlyZV9yZWFjdF9pczIgPSBfX2NvbW1vbkpTKHtcbiAgXCJub2RlX21vZHVsZXMvcmVhY3QtcmVkdXgvbm9kZV9tb2R1bGVzL3JlYWN0LWlzL2luZGV4LmpzXCIoZXhwb3J0cywgbW9kdWxlKSB7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG4gICAgaWYgKGZhbHNlKSB7XG4gICAgICBtb2R1bGUuZXhwb3J0cyA9IG51bGw7XG4gICAgfSBlbHNlIHtcbiAgICAgIG1vZHVsZS5leHBvcnRzID0gcmVxdWlyZV9yZWFjdF9pc19kZXZlbG9wbWVudDIoKTtcbiAgICB9XG4gIH1cbn0pO1xuXG4vLyBub2RlX21vZHVsZXMvbG9kYXNoLmlzZnVuY3Rpb24vaW5kZXguanNcbnZhciByZXF1aXJlX2xvZGFzaCA9IF9fY29tbW9uSlMoe1xuICBcIm5vZGVfbW9kdWxlcy9sb2Rhc2guaXNmdW5jdGlvbi9pbmRleC5qc1wiKGV4cG9ydHMsIG1vZHVsZSkge1xuICAgIHZhciBhc3luY1RhZyA9IFwiW29iamVjdCBBc3luY0Z1bmN0aW9uXVwiO1xuICAgIHZhciBmdW5jVGFnID0gXCJbb2JqZWN0IEZ1bmN0aW9uXVwiO1xuICAgIHZhciBnZW5UYWcgPSBcIltvYmplY3QgR2VuZXJhdG9yRnVuY3Rpb25dXCI7XG4gICAgdmFyIG51bGxUYWcgPSBcIltvYmplY3QgTnVsbF1cIjtcbiAgICB2YXIgcHJveHlUYWcgPSBcIltvYmplY3QgUHJveHldXCI7XG4gICAgdmFyIHVuZGVmaW5lZFRhZyA9IFwiW29iamVjdCBVbmRlZmluZWRdXCI7XG4gICAgdmFyIGZyZWVHbG9iYWwgPSB0eXBlb2YgZ2xvYmFsID09IFwib2JqZWN0XCIgJiYgZ2xvYmFsICYmIGdsb2JhbC5PYmplY3QgPT09IE9iamVjdCAmJiBnbG9iYWw7XG4gICAgdmFyIGZyZWVTZWxmID0gdHlwZW9mIHNlbGYgPT0gXCJvYmplY3RcIiAmJiBzZWxmICYmIHNlbGYuT2JqZWN0ID09PSBPYmplY3QgJiYgc2VsZjtcbiAgICB2YXIgcm9vdCA9IGZyZWVHbG9iYWwgfHwgZnJlZVNlbGYgfHwgRnVuY3Rpb24oXCJyZXR1cm4gdGhpc1wiKSgpO1xuICAgIHZhciBvYmplY3RQcm90byA9IE9iamVjdC5wcm90b3R5cGU7XG4gICAgdmFyIGhhc093blByb3BlcnR5ID0gb2JqZWN0UHJvdG8uaGFzT3duUHJvcGVydHk7XG4gICAgdmFyIG5hdGl2ZU9iamVjdFRvU3RyaW5nID0gb2JqZWN0UHJvdG8udG9TdHJpbmc7XG4gICAgdmFyIFN5bWJvbDIgPSByb290LlN5bWJvbDtcbiAgICB2YXIgc3ltVG9TdHJpbmdUYWcgPSBTeW1ib2wyID8gU3ltYm9sMi50b1N0cmluZ1RhZyA6IHZvaWQgMDtcbiAgICBmdW5jdGlvbiBiYXNlR2V0VGFnKHZhbHVlKSB7XG4gICAgICBpZiAodmFsdWUgPT0gbnVsbCkge1xuICAgICAgICByZXR1cm4gdmFsdWUgPT09IHZvaWQgMCA/IHVuZGVmaW5lZFRhZyA6IG51bGxUYWc7XG4gICAgICB9XG4gICAgICByZXR1cm4gc3ltVG9TdHJpbmdUYWcgJiYgc3ltVG9TdHJpbmdUYWcgaW4gT2JqZWN0KHZhbHVlKSA/IGdldFJhd1RhZyh2YWx1ZSkgOiBvYmplY3RUb1N0cmluZyh2YWx1ZSk7XG4gICAgfVxuICAgIGZ1bmN0aW9uIGdldFJhd1RhZyh2YWx1ZSkge1xuICAgICAgdmFyIGlzT3duID0gaGFzT3duUHJvcGVydHkuY2FsbCh2YWx1ZSwgc3ltVG9TdHJpbmdUYWcpLCB0YWcgPSB2YWx1ZVtzeW1Ub1N0cmluZ1RhZ107XG4gICAgICB0cnkge1xuICAgICAgICB2YWx1ZVtzeW1Ub1N0cmluZ1RhZ10gPSB2b2lkIDA7XG4gICAgICAgIHZhciB1bm1hc2tlZCA9IHRydWU7XG4gICAgICB9IGNhdGNoIChlKSB7XG4gICAgICB9XG4gICAgICB2YXIgcmVzdWx0ID0gbmF0aXZlT2JqZWN0VG9TdHJpbmcuY2FsbCh2YWx1ZSk7XG4gICAgICBpZiAodW5tYXNrZWQpIHtcbiAgICAgICAgaWYgKGlzT3duKSB7XG4gICAgICAgICAgdmFsdWVbc3ltVG9TdHJpbmdUYWddID0gdGFnO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGRlbGV0ZSB2YWx1ZVtzeW1Ub1N0cmluZ1RhZ107XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfVxuICAgIGZ1bmN0aW9uIG9iamVjdFRvU3RyaW5nKHZhbHVlKSB7XG4gICAgICByZXR1cm4gbmF0aXZlT2JqZWN0VG9TdHJpbmcuY2FsbCh2YWx1ZSk7XG4gICAgfVxuICAgIGZ1bmN0aW9uIGlzRnVuY3Rpb24yKHZhbHVlKSB7XG4gICAgICBpZiAoIWlzT2JqZWN0KHZhbHVlKSkge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG4gICAgICB2YXIgdGFnID0gYmFzZUdldFRhZyh2YWx1ZSk7XG4gICAgICByZXR1cm4gdGFnID09IGZ1bmNUYWcgfHwgdGFnID09IGdlblRhZyB8fCB0YWcgPT0gYXN5bmNUYWcgfHwgdGFnID09IHByb3h5VGFnO1xuICAgIH1cbiAgICBmdW5jdGlvbiBpc09iamVjdCh2YWx1ZSkge1xuICAgICAgdmFyIHR5cGUgPSB0eXBlb2YgdmFsdWU7XG4gICAgICByZXR1cm4gdmFsdWUgIT0gbnVsbCAmJiAodHlwZSA9PSBcIm9iamVjdFwiIHx8IHR5cGUgPT0gXCJmdW5jdGlvblwiKTtcbiAgICB9XG4gICAgbW9kdWxlLmV4cG9ydHMgPSBpc0Z1bmN0aW9uMjtcbiAgfVxufSk7XG5cbi8vIC5pY2UvaW5kZXgudHNcbmltcG9ydCB7IExpbmssIE91dGxldCwgdXNlUGFyYW1zLCB1c2VTZWFyY2hQYXJhbXMsIHVzZUxvY2F0aW9uLCB1c2VOYXZpZ2F0ZSB9IGZyb20gXCJAaWNlL3J1bnRpbWUvcm91dGVyXCI7XG5pbXBvcnQgeyBkZWZpbmVBcHBDb25maWcsIHVzZUFwcERhdGEsIHVzZURhdGEsIHVzZUNvbmZpZywgTWV0YSwgVGl0bGUsIExpbmtzLCBTY3JpcHRzLCBEYXRhLCBNYWluLCBoaXN0b3J5LCBLZWVwQWxpdmVPdXRsZXQsIHVzZU1vdW50ZWQsIENsaWVudE9ubHksIGRlZmluZURhdGFMb2FkZXIsIGRlZmluZVNlcnZlckRhdGFMb2FkZXIsIGRlZmluZVN0YXRpY0RhdGFMb2FkZXIgfSBmcm9tIFwiQGljZS9ydW50aW1lXCI7XG5cbi8vIG5vZGVfbW9kdWxlcy9AaWNlL3BsdWdpbi1yZXF1ZXN0L2VzbS9yZXF1ZXN0LmpzXG52YXIgaW1wb3J0X2F4aW9zID0gX190b0VTTShyZXF1aXJlX2F4aW9zMigpLCAxKTtcbnZhciBERUZBVUxUX0NPTkZJRyA9IHt9O1xudmFyIGF4aW9zSW5zdGFuY2VzID0ge1xuICBkZWZhdWx0OiBpbXBvcnRfYXhpb3MuZGVmYXVsdC5jcmVhdGUoREVGQVVMVF9DT05GSUcpXG59O1xuZnVuY3Rpb24gY3JlYXRlQXhpb3NJbnN0YW5jZShpbnN0YW5jZU5hbWUpIHtcbiAgaWYgKGluc3RhbmNlTmFtZSkge1xuICAgIGlmIChheGlvc0luc3RhbmNlc1tpbnN0YW5jZU5hbWVdKSB7XG4gICAgICByZXR1cm4gYXhpb3NJbnN0YW5jZXM7XG4gICAgfVxuICAgIGF4aW9zSW5zdGFuY2VzW2luc3RhbmNlTmFtZV0gPSBpbXBvcnRfYXhpb3MuZGVmYXVsdC5jcmVhdGUoREVGQVVMVF9DT05GSUcpO1xuICB9XG4gIHJldHVybiBheGlvc0luc3RhbmNlcztcbn1cbnZhciByZXF1ZXN0ID0gYXN5bmMgZnVuY3Rpb24ob3B0aW9ucykge1xuICB0cnkge1xuICAgIGNvbnN0IGluc3RhbmNlTmFtZSA9IG9wdGlvbnMuaW5zdGFuY2VOYW1lID8gb3B0aW9ucy5pbnN0YW5jZU5hbWUgOiBcImRlZmF1bHRcIjtcbiAgICBjb25zdCBheGlvc0luc3RhbmNlID0gY3JlYXRlQXhpb3NJbnN0YW5jZSgpW2luc3RhbmNlTmFtZV07XG4gICAgaWYgKCEodHlwZW9mIGF4aW9zSW5zdGFuY2UgPT09IFwiZnVuY3Rpb25cIikpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihgdW5rbm93biAke2luc3RhbmNlTmFtZX0gaW4gcmVxdWVzdCBtZXRob2RgKTtcbiAgICB9XG4gICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCBheGlvc0luc3RhbmNlKG9wdGlvbnMpO1xuICAgIGlmIChheGlvc0luc3RhbmNlLmRlZmF1bHRzLndpdGhGdWxsUmVzcG9uc2UgfHwgb3B0aW9ucy53aXRoRnVsbFJlc3BvbnNlKSB7XG4gICAgICByZXR1cm4gcmVzcG9uc2U7XG4gICAgfVxuICAgIHJldHVybiByZXNwb25zZS5kYXRhO1xuICB9IGNhdGNoIChlcnJvcikge1xuICAgIGNvbnNvbGUuZXJyb3IoZXJyb3IpO1xuICAgIHRocm93IGVycm9yO1xuICB9XG59O1xuW1wiZGVsZXRlXCIsIFwiZ2V0XCIsIFwiaGVhZFwiLCBcIm9wdGlvbnNcIl0uZm9yRWFjaCgobWV0aG9kKSA9PiB7XG4gIHJlcXVlc3RbbWV0aG9kXSA9IGZ1bmN0aW9uKHVybCwgY29uZmlnKSB7XG4gICAgcmV0dXJuIHJlcXVlc3QoT2JqZWN0LmFzc2lnbihjb25maWcgfHwge30sIHtcbiAgICAgIG1ldGhvZCxcbiAgICAgIHVybFxuICAgIH0pKTtcbiAgfTtcbn0pO1xuW1wicG9zdFwiLCBcInB1dFwiLCBcInBhdGNoXCJdLmZvckVhY2goKG1ldGhvZCkgPT4ge1xuICByZXF1ZXN0W21ldGhvZF0gPSBmdW5jdGlvbih1cmwsIGRhdGEsIGNvbmZpZykge1xuICAgIHJldHVybiByZXF1ZXN0KE9iamVjdC5hc3NpZ24oY29uZmlnIHx8IHt9LCB7XG4gICAgICBtZXRob2QsXG4gICAgICB1cmwsXG4gICAgICBkYXRhXG4gICAgfSkpO1xuICB9O1xufSk7XG5yZXF1ZXN0LkNhbmNlbFRva2VuID0gaW1wb3J0X2F4aW9zLmRlZmF1bHQuQ2FuY2VsVG9rZW47XG5yZXF1ZXN0LmlzQ2FuY2VsID0gaW1wb3J0X2F4aW9zLmRlZmF1bHQuaXNDYW5jZWw7XG5cbi8vIG5vZGVfbW9kdWxlcy9AaWNlL3BsdWdpbi1zdG9yZS9lc20vcnVudGltZS5qc1xuaW1wb3J0ICogYXMgUmVhY3Q3IGZyb20gXCJyZWFjdFwiO1xuXG4vLyBub2RlX21vZHVsZXMvQGljZS9zdG9yZS9lc20vaW5kZXguanNcbmltcG9ydCBSZWFjdDYgZnJvbSBcInJlYWN0XCI7XG5cbi8vIG5vZGVfbW9kdWxlcy9AaWNlL3N0b3JlL2VzbS91dGlscy92YWxpZGF0ZS5qc1xudmFyIHZhbGlkYXRlID0gZnVuY3Rpb24odmFsaWRhdGlvbnMpIHtcbiAgaWYgKHRydWUpIHtcbiAgICBmb3IgKHZhciBfaSA9IDAsIHZhbGlkYXRpb25zXzEgPSB2YWxpZGF0aW9uczsgX2kgPCB2YWxpZGF0aW9uc18xLmxlbmd0aDsgX2krKykge1xuICAgICAgdmFyIHZhbGlkYXRpb24gPSB2YWxpZGF0aW9uc18xW19pXTtcbiAgICAgIHZhciBjb25kaXRpb24gPSB2YWxpZGF0aW9uWzBdO1xuICAgICAgdmFyIGVycm9yTWVzc2FnZSA9IHZhbGlkYXRpb25bMV07XG4gICAgICBpZiAoY29uZGl0aW9uKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihlcnJvck1lc3NhZ2UpO1xuICAgICAgfVxuICAgIH1cbiAgfVxufTtcbnZhciB2YWxpZGF0ZV9kZWZhdWx0ID0gdmFsaWRhdGU7XG5cbi8vIG5vZGVfbW9kdWxlcy9AaWNlL3N0b3JlL2VzbS9wbHVnaW5GYWN0b3J5LmpzXG52YXIgcGx1Z2luRmFjdG9yeV9kZWZhdWx0ID0gZnVuY3Rpb24oY29uZmlnKSB7XG4gIHJldHVybiB7XG4gICAgY29uZmlnLFxuICAgIHZhbGlkYXRlOiB2YWxpZGF0ZV9kZWZhdWx0LFxuICAgIGNyZWF0ZTogZnVuY3Rpb24ocGx1Z2luKSB7XG4gICAgICB2YWxpZGF0ZV9kZWZhdWx0KFtcbiAgICAgICAgW1xuICAgICAgICAgIHBsdWdpbi5vblN0b3JlQ3JlYXRlZCAmJiB0eXBlb2YgcGx1Z2luLm9uU3RvcmVDcmVhdGVkICE9PSBcImZ1bmN0aW9uXCIsXG4gICAgICAgICAgXCJQbHVnaW4gb25TdG9yZUNyZWF0ZWQgbXVzdCBiZSBhIGZ1bmN0aW9uXCJcbiAgICAgICAgXSxcbiAgICAgICAgW1xuICAgICAgICAgIHBsdWdpbi5vbk1vZGVsICYmIHR5cGVvZiBwbHVnaW4ub25Nb2RlbCAhPT0gXCJmdW5jdGlvblwiLFxuICAgICAgICAgIFwiUGx1Z2luIG9uTW9kZWwgbXVzdCBiZSBhIGZ1bmN0aW9uXCJcbiAgICAgICAgXSxcbiAgICAgICAgW1xuICAgICAgICAgIHBsdWdpbi5taWRkbGV3YXJlICYmIHR5cGVvZiBwbHVnaW4ubWlkZGxld2FyZSAhPT0gXCJmdW5jdGlvblwiLFxuICAgICAgICAgIFwiUGx1Z2luIG1pZGRsZXdhcmUgbXVzdCBiZSBhIGZ1bmN0aW9uXCJcbiAgICAgICAgXVxuICAgICAgXSk7XG4gICAgICBpZiAocGx1Z2luLm9uSW5pdCkge1xuICAgICAgICBwbHVnaW4ub25Jbml0LmNhbGwodGhpcyk7XG4gICAgICB9XG4gICAgICB2YXIgcmVzdWx0ID0ge307XG4gICAgICBpZiAocGx1Z2luLmV4cG9zZWQpIHtcbiAgICAgICAgZm9yICh2YXIgX2kgPSAwLCBfYSA9IE9iamVjdC5rZXlzKHBsdWdpbi5leHBvc2VkKTsgX2kgPCBfYS5sZW5ndGg7IF9pKyspIHtcbiAgICAgICAgICB2YXIga2V5ID0gX2FbX2ldO1xuICAgICAgICAgIHRoaXNba2V5XSA9IHR5cGVvZiBwbHVnaW4uZXhwb3NlZFtrZXldID09PSBcImZ1bmN0aW9uXCIgPyBwbHVnaW4uZXhwb3NlZFtrZXldLmJpbmQodGhpcykgOiBPYmplY3QuY3JlYXRlKHBsdWdpbi5leHBvc2VkW2tleV0pO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBmb3IgKHZhciBfYiA9IDAsIF9jID0gW1wib25Nb2RlbFwiLCBcIm1pZGRsZXdhcmVcIiwgXCJvblN0b3JlQ3JlYXRlZFwiXTsgX2IgPCBfYy5sZW5ndGg7IF9iKyspIHtcbiAgICAgICAgdmFyIG1ldGhvZCA9IF9jW19iXTtcbiAgICAgICAgaWYgKHBsdWdpblttZXRob2RdKSB7XG4gICAgICAgICAgcmVzdWx0W21ldGhvZF0gPSBwbHVnaW5bbWV0aG9kXS5iaW5kKHRoaXMpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH1cbiAgfTtcbn07XG5cbi8vIG5vZGVfbW9kdWxlcy9AaWNlL3N0b3JlL2VzbS9wbHVnaW5zL2Rpc3BhdGNoLmpzXG52YXIgX19hd2FpdGVyID0gZnVuY3Rpb24odGhpc0FyZywgX2FyZ3VtZW50cywgUDIsIGdlbmVyYXRvcikge1xuICBmdW5jdGlvbiBhZG9wdCh2YWx1ZSkge1xuICAgIHJldHVybiB2YWx1ZSBpbnN0YW5jZW9mIFAyID8gdmFsdWUgOiBuZXcgUDIoZnVuY3Rpb24ocmVzb2x2ZSkge1xuICAgICAgcmVzb2x2ZSh2YWx1ZSk7XG4gICAgfSk7XG4gIH1cbiAgcmV0dXJuIG5ldyAoUDIgfHwgKFAyID0gUHJvbWlzZSkpKGZ1bmN0aW9uKHJlc29sdmUsIHJlamVjdCkge1xuICAgIGZ1bmN0aW9uIGZ1bGZpbGxlZCh2YWx1ZSkge1xuICAgICAgdHJ5IHtcbiAgICAgICAgc3RlcChnZW5lcmF0b3IubmV4dCh2YWx1ZSkpO1xuICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICByZWplY3QoZSk7XG4gICAgICB9XG4gICAgfVxuICAgIGZ1bmN0aW9uIHJlamVjdGVkKHZhbHVlKSB7XG4gICAgICB0cnkge1xuICAgICAgICBzdGVwKGdlbmVyYXRvcltcInRocm93XCJdKHZhbHVlKSk7XG4gICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIHJlamVjdChlKTtcbiAgICAgIH1cbiAgICB9XG4gICAgZnVuY3Rpb24gc3RlcChyZXN1bHQpIHtcbiAgICAgIHJlc3VsdC5kb25lID8gcmVzb2x2ZShyZXN1bHQudmFsdWUpIDogYWRvcHQocmVzdWx0LnZhbHVlKS50aGVuKGZ1bGZpbGxlZCwgcmVqZWN0ZWQpO1xuICAgIH1cbiAgICBzdGVwKChnZW5lcmF0b3IgPSBnZW5lcmF0b3IuYXBwbHkodGhpc0FyZywgX2FyZ3VtZW50cyB8fCBbXSkpLm5leHQoKSk7XG4gIH0pO1xufTtcbnZhciBfX2dlbmVyYXRvciA9IGZ1bmN0aW9uKHRoaXNBcmcsIGJvZHkpIHtcbiAgdmFyIF8yID0geyBsYWJlbDogMCwgc2VudDogZnVuY3Rpb24oKSB7XG4gICAgaWYgKHQyWzBdICYgMSlcbiAgICAgIHRocm93IHQyWzFdO1xuICAgIHJldHVybiB0MlsxXTtcbiAgfSwgdHJ5czogW10sIG9wczogW10gfSwgZjIsIHkyLCB0MiwgZzI7XG4gIHJldHVybiBnMiA9IHsgbmV4dDogdmVyYigwKSwgXCJ0aHJvd1wiOiB2ZXJiKDEpLCBcInJldHVyblwiOiB2ZXJiKDIpIH0sIHR5cGVvZiBTeW1ib2wgPT09IFwiZnVuY3Rpb25cIiAmJiAoZzJbU3ltYm9sLml0ZXJhdG9yXSA9IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiB0aGlzO1xuICB9KSwgZzI7XG4gIGZ1bmN0aW9uIHZlcmIobjIpIHtcbiAgICByZXR1cm4gZnVuY3Rpb24odjIpIHtcbiAgICAgIHJldHVybiBzdGVwKFtuMiwgdjJdKTtcbiAgICB9O1xuICB9XG4gIGZ1bmN0aW9uIHN0ZXAob3ApIHtcbiAgICBpZiAoZjIpXG4gICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKFwiR2VuZXJhdG9yIGlzIGFscmVhZHkgZXhlY3V0aW5nLlwiKTtcbiAgICB3aGlsZSAoXzIpXG4gICAgICB0cnkge1xuICAgICAgICBpZiAoZjIgPSAxLCB5MiAmJiAodDIgPSBvcFswXSAmIDIgPyB5MltcInJldHVyblwiXSA6IG9wWzBdID8geTJbXCJ0aHJvd1wiXSB8fCAoKHQyID0geTJbXCJyZXR1cm5cIl0pICYmIHQyLmNhbGwoeTIpLCAwKSA6IHkyLm5leHQpICYmICEodDIgPSB0Mi5jYWxsKHkyLCBvcFsxXSkpLmRvbmUpXG4gICAgICAgICAgcmV0dXJuIHQyO1xuICAgICAgICBpZiAoeTIgPSAwLCB0MilcbiAgICAgICAgICBvcCA9IFtvcFswXSAmIDIsIHQyLnZhbHVlXTtcbiAgICAgICAgc3dpdGNoIChvcFswXSkge1xuICAgICAgICAgIGNhc2UgMDpcbiAgICAgICAgICBjYXNlIDE6XG4gICAgICAgICAgICB0MiA9IG9wO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgY2FzZSA0OlxuICAgICAgICAgICAgXzIubGFiZWwrKztcbiAgICAgICAgICAgIHJldHVybiB7IHZhbHVlOiBvcFsxXSwgZG9uZTogZmFsc2UgfTtcbiAgICAgICAgICBjYXNlIDU6XG4gICAgICAgICAgICBfMi5sYWJlbCsrO1xuICAgICAgICAgICAgeTIgPSBvcFsxXTtcbiAgICAgICAgICAgIG9wID0gWzBdO1xuICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgY2FzZSA3OlxuICAgICAgICAgICAgb3AgPSBfMi5vcHMucG9wKCk7XG4gICAgICAgICAgICBfMi50cnlzLnBvcCgpO1xuICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgIGlmICghKHQyID0gXzIudHJ5cywgdDIgPSB0Mi5sZW5ndGggPiAwICYmIHQyW3QyLmxlbmd0aCAtIDFdKSAmJiAob3BbMF0gPT09IDYgfHwgb3BbMF0gPT09IDIpKSB7XG4gICAgICAgICAgICAgIF8yID0gMDtcbiAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAob3BbMF0gPT09IDMgJiYgKCF0MiB8fCBvcFsxXSA+IHQyWzBdICYmIG9wWzFdIDwgdDJbM10pKSB7XG4gICAgICAgICAgICAgIF8yLmxhYmVsID0gb3BbMV07XG4gICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKG9wWzBdID09PSA2ICYmIF8yLmxhYmVsIDwgdDJbMV0pIHtcbiAgICAgICAgICAgICAgXzIubGFiZWwgPSB0MlsxXTtcbiAgICAgICAgICAgICAgdDIgPSBvcDtcbiAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAodDIgJiYgXzIubGFiZWwgPCB0MlsyXSkge1xuICAgICAgICAgICAgICBfMi5sYWJlbCA9IHQyWzJdO1xuICAgICAgICAgICAgICBfMi5vcHMucHVzaChvcCk7XG4gICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHQyWzJdKVxuICAgICAgICAgICAgICBfMi5vcHMucG9wKCk7XG4gICAgICAgICAgICBfMi50cnlzLnBvcCgpO1xuICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgIH1cbiAgICAgICAgb3AgPSBib2R5LmNhbGwodGhpc0FyZywgXzIpO1xuICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICBvcCA9IFs2LCBlXTtcbiAgICAgICAgeTIgPSAwO1xuICAgICAgfSBmaW5hbGx5IHtcbiAgICAgICAgZjIgPSB0MiA9IDA7XG4gICAgICB9XG4gICAgaWYgKG9wWzBdICYgNSlcbiAgICAgIHRocm93IG9wWzFdO1xuICAgIHJldHVybiB7IHZhbHVlOiBvcFswXSA/IG9wWzFdIDogdm9pZCAwLCBkb25lOiB0cnVlIH07XG4gIH1cbn07XG52YXIgZGlzcGF0Y2hQbHVnaW4gPSB7XG4gIGV4cG9zZWQ6IHtcbiAgICBzdG9yZURpc3BhdGNoOiBmdW5jdGlvbihhY3Rpb24sIHN0YXRlKSB7XG4gICAgICBjb25zb2xlLndhcm4oXCJXYXJuaW5nOiBzdG9yZSBub3QgeWV0IGxvYWRlZFwiKTtcbiAgICB9LFxuICAgIHN0b3JlR2V0U3RhdGU6IGZ1bmN0aW9uKCkge1xuICAgICAgY29uc29sZS53YXJuKFwiV2FybmluZzogc3RvcmUgbm90IHlldCBsb2FkZWRcIik7XG4gICAgfSxcbiAgICBkaXNwYXRjaDogZnVuY3Rpb24oYWN0aW9uKSB7XG4gICAgICByZXR1cm4gdGhpcy5zdG9yZURpc3BhdGNoKGFjdGlvbik7XG4gICAgfSxcbiAgICBjcmVhdGVEaXNwYXRjaGVyOiBmdW5jdGlvbihtb2RlbE5hbWUsIHJlZHVjZXJOYW1lKSB7XG4gICAgICB2YXIgX3RoaXMgPSB0aGlzO1xuICAgICAgcmV0dXJuIGZ1bmN0aW9uKHBheWxvYWQsIG1ldGEpIHtcbiAgICAgICAgcmV0dXJuIF9fYXdhaXRlcihfdGhpcywgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgIHZhciBhY3Rpb247XG4gICAgICAgICAgcmV0dXJuIF9fZ2VuZXJhdG9yKHRoaXMsIGZ1bmN0aW9uKF9hKSB7XG4gICAgICAgICAgICBhY3Rpb24gPSB7IHR5cGU6IG1vZGVsTmFtZSArIFwiL1wiICsgcmVkdWNlck5hbWUgfTtcbiAgICAgICAgICAgIGlmICh0eXBlb2YgcGF5bG9hZCAhPT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgICAgICAgICBhY3Rpb24ucGF5bG9hZCA9IHBheWxvYWQ7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAodHlwZW9mIG1ldGEgIT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICAgICAgICAgICAgYWN0aW9uLm1ldGEgPSBtZXRhO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIFsyLCB0aGlzLmRpc3BhdGNoKGFjdGlvbildO1xuICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICAgIH07XG4gICAgfVxuICB9LFxuICBvblN0b3JlQ3JlYXRlZDogZnVuY3Rpb24oc3RvcmUpIHtcbiAgICB0aGlzLnN0b3JlRGlzcGF0Y2ggPSBzdG9yZS5kaXNwYXRjaDtcbiAgICB0aGlzLnN0b3JlR2V0U3RhdGUgPSBzdG9yZS5nZXRTdGF0ZTtcbiAgICByZXR1cm4geyBkaXNwYXRjaDogdGhpcy5kaXNwYXRjaCB9O1xuICB9LFxuICBvbk1vZGVsOiBmdW5jdGlvbihtb2RlbCkge1xuICAgIHRoaXMuZGlzcGF0Y2hbbW9kZWwubmFtZV0gPSB7fTtcbiAgICBpZiAoIW1vZGVsLnJlZHVjZXJzKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGZvciAodmFyIF9pID0gMCwgX2EgPSBPYmplY3Qua2V5cyhtb2RlbC5yZWR1Y2Vycyk7IF9pIDwgX2EubGVuZ3RoOyBfaSsrKSB7XG4gICAgICB2YXIgcmVkdWNlck5hbWUgPSBfYVtfaV07XG4gICAgICB0aGlzLnZhbGlkYXRlKFtcbiAgICAgICAgW1xuICAgICAgICAgICEhcmVkdWNlck5hbWUubWF0Y2goL1xcLy4rXFwvLyksXG4gICAgICAgICAgXCJJbnZhbGlkIHJlZHVjZXIgbmFtZSAoXCIgKyBtb2RlbC5uYW1lICsgXCIvXCIgKyByZWR1Y2VyTmFtZSArIFwiKVwiXG4gICAgICAgIF0sXG4gICAgICAgIFtcbiAgICAgICAgICB0eXBlb2YgbW9kZWwucmVkdWNlcnNbcmVkdWNlck5hbWVdICE9PSBcImZ1bmN0aW9uXCIsXG4gICAgICAgICAgXCJJbnZhbGlkIHJlZHVjZXIgKFwiICsgbW9kZWwubmFtZSArIFwiL1wiICsgcmVkdWNlck5hbWUgKyBcIikuIE11c3QgYmUgYSBmdW5jdGlvblwiXG4gICAgICAgIF1cbiAgICAgIF0pO1xuICAgICAgdGhpcy5kaXNwYXRjaFttb2RlbC5uYW1lXVtyZWR1Y2VyTmFtZV0gPSB0aGlzLmNyZWF0ZURpc3BhdGNoZXIuYXBwbHkodGhpcywgW21vZGVsLm5hbWUsIHJlZHVjZXJOYW1lXSk7XG4gICAgfVxuICB9XG59O1xudmFyIGRpc3BhdGNoX2RlZmF1bHQgPSBkaXNwYXRjaFBsdWdpbjtcblxuLy8gbm9kZV9tb2R1bGVzL0BpY2Uvc3RvcmUvZXNtL3BsdWdpbnMvZWZmZWN0cy5qc1xudmFyIF9fYXdhaXRlcjIgPSBmdW5jdGlvbih0aGlzQXJnLCBfYXJndW1lbnRzLCBQMiwgZ2VuZXJhdG9yKSB7XG4gIGZ1bmN0aW9uIGFkb3B0KHZhbHVlKSB7XG4gICAgcmV0dXJuIHZhbHVlIGluc3RhbmNlb2YgUDIgPyB2YWx1ZSA6IG5ldyBQMihmdW5jdGlvbihyZXNvbHZlKSB7XG4gICAgICByZXNvbHZlKHZhbHVlKTtcbiAgICB9KTtcbiAgfVxuICByZXR1cm4gbmV3IChQMiB8fCAoUDIgPSBQcm9taXNlKSkoZnVuY3Rpb24ocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgZnVuY3Rpb24gZnVsZmlsbGVkKHZhbHVlKSB7XG4gICAgICB0cnkge1xuICAgICAgICBzdGVwKGdlbmVyYXRvci5uZXh0KHZhbHVlKSk7XG4gICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIHJlamVjdChlKTtcbiAgICAgIH1cbiAgICB9XG4gICAgZnVuY3Rpb24gcmVqZWN0ZWQodmFsdWUpIHtcbiAgICAgIHRyeSB7XG4gICAgICAgIHN0ZXAoZ2VuZXJhdG9yW1widGhyb3dcIl0odmFsdWUpKTtcbiAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgcmVqZWN0KGUpO1xuICAgICAgfVxuICAgIH1cbiAgICBmdW5jdGlvbiBzdGVwKHJlc3VsdCkge1xuICAgICAgcmVzdWx0LmRvbmUgPyByZXNvbHZlKHJlc3VsdC52YWx1ZSkgOiBhZG9wdChyZXN1bHQudmFsdWUpLnRoZW4oZnVsZmlsbGVkLCByZWplY3RlZCk7XG4gICAgfVxuICAgIHN0ZXAoKGdlbmVyYXRvciA9IGdlbmVyYXRvci5hcHBseSh0aGlzQXJnLCBfYXJndW1lbnRzIHx8IFtdKSkubmV4dCgpKTtcbiAgfSk7XG59O1xudmFyIF9fZ2VuZXJhdG9yMiA9IGZ1bmN0aW9uKHRoaXNBcmcsIGJvZHkpIHtcbiAgdmFyIF8yID0geyBsYWJlbDogMCwgc2VudDogZnVuY3Rpb24oKSB7XG4gICAgaWYgKHQyWzBdICYgMSlcbiAgICAgIHRocm93IHQyWzFdO1xuICAgIHJldHVybiB0MlsxXTtcbiAgfSwgdHJ5czogW10sIG9wczogW10gfSwgZjIsIHkyLCB0MiwgZzI7XG4gIHJldHVybiBnMiA9IHsgbmV4dDogdmVyYigwKSwgXCJ0aHJvd1wiOiB2ZXJiKDEpLCBcInJldHVyblwiOiB2ZXJiKDIpIH0sIHR5cGVvZiBTeW1ib2wgPT09IFwiZnVuY3Rpb25cIiAmJiAoZzJbU3ltYm9sLml0ZXJhdG9yXSA9IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiB0aGlzO1xuICB9KSwgZzI7XG4gIGZ1bmN0aW9uIHZlcmIobjIpIHtcbiAgICByZXR1cm4gZnVuY3Rpb24odjIpIHtcbiAgICAgIHJldHVybiBzdGVwKFtuMiwgdjJdKTtcbiAgICB9O1xuICB9XG4gIGZ1bmN0aW9uIHN0ZXAob3ApIHtcbiAgICBpZiAoZjIpXG4gICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKFwiR2VuZXJhdG9yIGlzIGFscmVhZHkgZXhlY3V0aW5nLlwiKTtcbiAgICB3aGlsZSAoXzIpXG4gICAgICB0cnkge1xuICAgICAgICBpZiAoZjIgPSAxLCB5MiAmJiAodDIgPSBvcFswXSAmIDIgPyB5MltcInJldHVyblwiXSA6IG9wWzBdID8geTJbXCJ0aHJvd1wiXSB8fCAoKHQyID0geTJbXCJyZXR1cm5cIl0pICYmIHQyLmNhbGwoeTIpLCAwKSA6IHkyLm5leHQpICYmICEodDIgPSB0Mi5jYWxsKHkyLCBvcFsxXSkpLmRvbmUpXG4gICAgICAgICAgcmV0dXJuIHQyO1xuICAgICAgICBpZiAoeTIgPSAwLCB0MilcbiAgICAgICAgICBvcCA9IFtvcFswXSAmIDIsIHQyLnZhbHVlXTtcbiAgICAgICAgc3dpdGNoIChvcFswXSkge1xuICAgICAgICAgIGNhc2UgMDpcbiAgICAgICAgICBjYXNlIDE6XG4gICAgICAgICAgICB0MiA9IG9wO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgY2FzZSA0OlxuICAgICAgICAgICAgXzIubGFiZWwrKztcbiAgICAgICAgICAgIHJldHVybiB7IHZhbHVlOiBvcFsxXSwgZG9uZTogZmFsc2UgfTtcbiAgICAgICAgICBjYXNlIDU6XG4gICAgICAgICAgICBfMi5sYWJlbCsrO1xuICAgICAgICAgICAgeTIgPSBvcFsxXTtcbiAgICAgICAgICAgIG9wID0gWzBdO1xuICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgY2FzZSA3OlxuICAgICAgICAgICAgb3AgPSBfMi5vcHMucG9wKCk7XG4gICAgICAgICAgICBfMi50cnlzLnBvcCgpO1xuICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgIGlmICghKHQyID0gXzIudHJ5cywgdDIgPSB0Mi5sZW5ndGggPiAwICYmIHQyW3QyLmxlbmd0aCAtIDFdKSAmJiAob3BbMF0gPT09IDYgfHwgb3BbMF0gPT09IDIpKSB7XG4gICAgICAgICAgICAgIF8yID0gMDtcbiAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAob3BbMF0gPT09IDMgJiYgKCF0MiB8fCBvcFsxXSA+IHQyWzBdICYmIG9wWzFdIDwgdDJbM10pKSB7XG4gICAgICAgICAgICAgIF8yLmxhYmVsID0gb3BbMV07XG4gICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKG9wWzBdID09PSA2ICYmIF8yLmxhYmVsIDwgdDJbMV0pIHtcbiAgICAgICAgICAgICAgXzIubGFiZWwgPSB0MlsxXTtcbiAgICAgICAgICAgICAgdDIgPSBvcDtcbiAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAodDIgJiYgXzIubGFiZWwgPCB0MlsyXSkge1xuICAgICAgICAgICAgICBfMi5sYWJlbCA9IHQyWzJdO1xuICAgICAgICAgICAgICBfMi5vcHMucHVzaChvcCk7XG4gICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHQyWzJdKVxuICAgICAgICAgICAgICBfMi5vcHMucG9wKCk7XG4gICAgICAgICAgICBfMi50cnlzLnBvcCgpO1xuICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgIH1cbiAgICAgICAgb3AgPSBib2R5LmNhbGwodGhpc0FyZywgXzIpO1xuICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICBvcCA9IFs2LCBlXTtcbiAgICAgICAgeTIgPSAwO1xuICAgICAgfSBmaW5hbGx5IHtcbiAgICAgICAgZjIgPSB0MiA9IDA7XG4gICAgICB9XG4gICAgaWYgKG9wWzBdICYgNSlcbiAgICAgIHRocm93IG9wWzFdO1xuICAgIHJldHVybiB7IHZhbHVlOiBvcFswXSA/IG9wWzFdIDogdm9pZCAwLCBkb25lOiB0cnVlIH07XG4gIH1cbn07XG52YXIgZWZmZWN0c1BsdWdpbiA9IHtcbiAgZXhwb3NlZDoge1xuICAgIGVmZmVjdHM6IHt9XG4gIH0sXG4gIG9uTW9kZWw6IGZ1bmN0aW9uKG1vZGVsKSB7XG4gICAgaWYgKCFtb2RlbC5lZmZlY3RzKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIHZhciBlZmZlY3RzID0gdHlwZW9mIG1vZGVsLmVmZmVjdHMgPT09IFwiZnVuY3Rpb25cIiA/IG1vZGVsLmVmZmVjdHModGhpcy5kaXNwYXRjaCkgOiBtb2RlbC5lZmZlY3RzO1xuICAgIHRoaXMudmFsaWRhdGUoW1xuICAgICAgW1xuICAgICAgICB0eXBlb2YgZWZmZWN0cyAhPT0gXCJvYmplY3RcIixcbiAgICAgICAgXCJJbnZhbGlkIGVmZmVjdHMgZnJvbSBNb2RlbChcIiArIG1vZGVsLm5hbWUgKyBcIiksIGVmZmVjdHMgc2hvdWxkIHJldHVybiBhbiBvYmplY3RcIlxuICAgICAgXVxuICAgIF0pO1xuICAgIGZvciAodmFyIF9pID0gMCwgX2EgPSBPYmplY3Qua2V5cyhlZmZlY3RzKTsgX2kgPCBfYS5sZW5ndGg7IF9pKyspIHtcbiAgICAgIHZhciBlZmZlY3ROYW1lID0gX2FbX2ldO1xuICAgICAgdGhpcy52YWxpZGF0ZShbXG4gICAgICAgIFtcbiAgICAgICAgICAhIWVmZmVjdE5hbWUubWF0Y2goL1xcLy8pLFxuICAgICAgICAgIFwiSW52YWxpZCBlZmZlY3QgbmFtZSAoXCIgKyBtb2RlbC5uYW1lICsgXCIvXCIgKyBlZmZlY3ROYW1lICsgXCIpXCJcbiAgICAgICAgXSxcbiAgICAgICAgW1xuICAgICAgICAgIHR5cGVvZiBlZmZlY3RzW2VmZmVjdE5hbWVdICE9PSBcImZ1bmN0aW9uXCIsXG4gICAgICAgICAgXCJJbnZhbGlkIGVmZmVjdCAoXCIgKyBtb2RlbC5uYW1lICsgXCIvXCIgKyBlZmZlY3ROYW1lICsgXCIpLiBNdXN0IGJlIGEgZnVuY3Rpb25cIlxuICAgICAgICBdXG4gICAgICBdKTtcbiAgICAgIHRoaXMuZWZmZWN0c1ttb2RlbC5uYW1lICsgXCIvXCIgKyBlZmZlY3ROYW1lXSA9IGVmZmVjdHNbZWZmZWN0TmFtZV0uYmluZCh0aGlzLmRpc3BhdGNoW21vZGVsLm5hbWVdKTtcbiAgICAgIHRoaXMuZGlzcGF0Y2hbbW9kZWwubmFtZV1bZWZmZWN0TmFtZV0gPSB0aGlzLmNyZWF0ZURpc3BhdGNoZXIuYXBwbHkodGhpcywgW21vZGVsLm5hbWUsIGVmZmVjdE5hbWVdKTtcbiAgICAgIHRoaXMuZGlzcGF0Y2hbbW9kZWwubmFtZV1bZWZmZWN0TmFtZV0uaXNFZmZlY3QgPSB0cnVlO1xuICAgIH1cbiAgfSxcbiAgbWlkZGxld2FyZTogZnVuY3Rpb24oc3RvcmUpIHtcbiAgICB2YXIgX3RoaXMgPSB0aGlzO1xuICAgIHJldHVybiBmdW5jdGlvbihuZXh0KSB7XG4gICAgICByZXR1cm4gZnVuY3Rpb24oYWN0aW9uKSB7XG4gICAgICAgIHJldHVybiBfX2F3YWl0ZXIyKF90aGlzLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgcmV0dXJuIF9fZ2VuZXJhdG9yMih0aGlzLCBmdW5jdGlvbihfYSkge1xuICAgICAgICAgICAgc3dpdGNoIChfYS5sYWJlbCkge1xuICAgICAgICAgICAgICBjYXNlIDA6XG4gICAgICAgICAgICAgICAgaWYgKCEoYWN0aW9uLnR5cGUgaW4gdGhpcy5lZmZlY3RzKSlcbiAgICAgICAgICAgICAgICAgIHJldHVybiBbMywgMl07XG4gICAgICAgICAgICAgICAgcmV0dXJuIFs0LCBuZXh0KGFjdGlvbildO1xuICAgICAgICAgICAgICBjYXNlIDE6XG4gICAgICAgICAgICAgICAgX2Euc2VudCgpO1xuICAgICAgICAgICAgICAgIHJldHVybiBbMiwgdGhpcy5lZmZlY3RzW2FjdGlvbi50eXBlXShhY3Rpb24ucGF5bG9hZCwgc3RvcmUuZ2V0U3RhdGUoKSwgYWN0aW9uLm1ldGEpXTtcbiAgICAgICAgICAgICAgY2FzZSAyOlxuICAgICAgICAgICAgICAgIHJldHVybiBbMiwgbmV4dChhY3Rpb24pXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgICB9O1xuICAgIH07XG4gIH1cbn07XG52YXIgZWZmZWN0c19kZWZhdWx0ID0gZWZmZWN0c1BsdWdpbjtcblxuLy8gbm9kZV9tb2R1bGVzL3JlZHV4L2VzL3JlZHV4LmpzXG52YXIgcmVkdXhfZXhwb3J0cyA9IHt9O1xuX19leHBvcnQocmVkdXhfZXhwb3J0cywge1xuICBfX0RPX05PVF9VU0VfX0FjdGlvblR5cGVzOiAoKSA9PiBBY3Rpb25UeXBlcyxcbiAgYXBwbHlNaWRkbGV3YXJlOiAoKSA9PiBhcHBseU1pZGRsZXdhcmUsXG4gIGJpbmRBY3Rpb25DcmVhdG9yczogKCkgPT4gYmluZEFjdGlvbkNyZWF0b3JzLFxuICBjb21iaW5lUmVkdWNlcnM6ICgpID0+IGNvbWJpbmVSZWR1Y2VycyxcbiAgY29tcG9zZTogKCkgPT4gY29tcG9zZSxcbiAgY3JlYXRlU3RvcmU6ICgpID0+IGNyZWF0ZVN0b3JlLFxuICBsZWdhY3lfY3JlYXRlU3RvcmU6ICgpID0+IGxlZ2FjeV9jcmVhdGVTdG9yZVxufSk7XG5cbi8vIG5vZGVfbW9kdWxlcy9AYmFiZWwvcnVudGltZS9oZWxwZXJzL2VzbS9kZWZpbmVQcm9wZXJ0eS5qc1xuZnVuY3Rpb24gX2RlZmluZVByb3BlcnR5KG9iaiwga2V5LCB2YWx1ZSkge1xuICBpZiAoa2V5IGluIG9iaikge1xuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShvYmosIGtleSwge1xuICAgICAgdmFsdWUsXG4gICAgICBlbnVtZXJhYmxlOiB0cnVlLFxuICAgICAgY29uZmlndXJhYmxlOiB0cnVlLFxuICAgICAgd3JpdGFibGU6IHRydWVcbiAgICB9KTtcbiAgfSBlbHNlIHtcbiAgICBvYmpba2V5XSA9IHZhbHVlO1xuICB9XG4gIHJldHVybiBvYmo7XG59XG5cbi8vIG5vZGVfbW9kdWxlcy9AYmFiZWwvcnVudGltZS9oZWxwZXJzL2VzbS9vYmplY3RTcHJlYWQyLmpzXG5mdW5jdGlvbiBvd25LZXlzKG9iamVjdCwgZW51bWVyYWJsZU9ubHkpIHtcbiAgdmFyIGtleXMgPSBPYmplY3Qua2V5cyhvYmplY3QpO1xuICBpZiAoT2JqZWN0LmdldE93blByb3BlcnR5U3ltYm9scykge1xuICAgIHZhciBzeW1ib2xzID0gT2JqZWN0LmdldE93blByb3BlcnR5U3ltYm9scyhvYmplY3QpO1xuICAgIGVudW1lcmFibGVPbmx5ICYmIChzeW1ib2xzID0gc3ltYm9scy5maWx0ZXIoZnVuY3Rpb24oc3ltKSB7XG4gICAgICByZXR1cm4gT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcihvYmplY3QsIHN5bSkuZW51bWVyYWJsZTtcbiAgICB9KSksIGtleXMucHVzaC5hcHBseShrZXlzLCBzeW1ib2xzKTtcbiAgfVxuICByZXR1cm4ga2V5cztcbn1cbmZ1bmN0aW9uIF9vYmplY3RTcHJlYWQyKHRhcmdldCkge1xuICBmb3IgKHZhciBpMiA9IDE7IGkyIDwgYXJndW1lbnRzLmxlbmd0aDsgaTIrKykge1xuICAgIHZhciBzb3VyY2UgPSBudWxsICE9IGFyZ3VtZW50c1tpMl0gPyBhcmd1bWVudHNbaTJdIDoge307XG4gICAgaTIgJSAyID8gb3duS2V5cyhPYmplY3Qoc291cmNlKSwgdHJ1ZSkuZm9yRWFjaChmdW5jdGlvbihrZXkpIHtcbiAgICAgIF9kZWZpbmVQcm9wZXJ0eSh0YXJnZXQsIGtleSwgc291cmNlW2tleV0pO1xuICAgIH0pIDogT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcnMgPyBPYmplY3QuZGVmaW5lUHJvcGVydGllcyh0YXJnZXQsIE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3JzKHNvdXJjZSkpIDogb3duS2V5cyhPYmplY3Qoc291cmNlKSkuZm9yRWFjaChmdW5jdGlvbihrZXkpIHtcbiAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0YXJnZXQsIGtleSwgT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcihzb3VyY2UsIGtleSkpO1xuICAgIH0pO1xuICB9XG4gIHJldHVybiB0YXJnZXQ7XG59XG5cbi8vIG5vZGVfbW9kdWxlcy9yZWR1eC9lcy9yZWR1eC5qc1xudmFyICQkb2JzZXJ2YWJsZSA9IGZ1bmN0aW9uKCkge1xuICByZXR1cm4gdHlwZW9mIFN5bWJvbCA9PT0gXCJmdW5jdGlvblwiICYmIFN5bWJvbC5vYnNlcnZhYmxlIHx8IFwiQEBvYnNlcnZhYmxlXCI7XG59KCk7XG52YXIgcmFuZG9tU3RyaW5nID0gZnVuY3Rpb24gcmFuZG9tU3RyaW5nMigpIHtcbiAgcmV0dXJuIE1hdGgucmFuZG9tKCkudG9TdHJpbmcoMzYpLnN1YnN0cmluZyg3KS5zcGxpdChcIlwiKS5qb2luKFwiLlwiKTtcbn07XG52YXIgQWN0aW9uVHlwZXMgPSB7XG4gIElOSVQ6IFwiQEByZWR1eC9JTklUXCIgKyByYW5kb21TdHJpbmcoKSxcbiAgUkVQTEFDRTogXCJAQHJlZHV4L1JFUExBQ0VcIiArIHJhbmRvbVN0cmluZygpLFxuICBQUk9CRV9VTktOT1dOX0FDVElPTjogZnVuY3Rpb24gUFJPQkVfVU5LTk9XTl9BQ1RJT04oKSB7XG4gICAgcmV0dXJuIFwiQEByZWR1eC9QUk9CRV9VTktOT1dOX0FDVElPTlwiICsgcmFuZG9tU3RyaW5nKCk7XG4gIH1cbn07XG5mdW5jdGlvbiBpc1BsYWluT2JqZWN0KG9iaikge1xuICBpZiAodHlwZW9mIG9iaiAhPT0gXCJvYmplY3RcIiB8fCBvYmogPT09IG51bGwpXG4gICAgcmV0dXJuIGZhbHNlO1xuICB2YXIgcHJvdG8gPSBvYmo7XG4gIHdoaWxlIChPYmplY3QuZ2V0UHJvdG90eXBlT2YocHJvdG8pICE9PSBudWxsKSB7XG4gICAgcHJvdG8gPSBPYmplY3QuZ2V0UHJvdG90eXBlT2YocHJvdG8pO1xuICB9XG4gIHJldHVybiBPYmplY3QuZ2V0UHJvdG90eXBlT2Yob2JqKSA9PT0gcHJvdG87XG59XG5mdW5jdGlvbiBtaW5pS2luZE9mKHZhbCkge1xuICBpZiAodmFsID09PSB2b2lkIDApXG4gICAgcmV0dXJuIFwidW5kZWZpbmVkXCI7XG4gIGlmICh2YWwgPT09IG51bGwpXG4gICAgcmV0dXJuIFwibnVsbFwiO1xuICB2YXIgdHlwZSA9IHR5cGVvZiB2YWw7XG4gIHN3aXRjaCAodHlwZSkge1xuICAgIGNhc2UgXCJib29sZWFuXCI6XG4gICAgY2FzZSBcInN0cmluZ1wiOlxuICAgIGNhc2UgXCJudW1iZXJcIjpcbiAgICBjYXNlIFwic3ltYm9sXCI6XG4gICAgY2FzZSBcImZ1bmN0aW9uXCI6IHtcbiAgICAgIHJldHVybiB0eXBlO1xuICAgIH1cbiAgfVxuICBpZiAoQXJyYXkuaXNBcnJheSh2YWwpKVxuICAgIHJldHVybiBcImFycmF5XCI7XG4gIGlmIChpc0RhdGUodmFsKSlcbiAgICByZXR1cm4gXCJkYXRlXCI7XG4gIGlmIChpc0Vycm9yKHZhbCkpXG4gICAgcmV0dXJuIFwiZXJyb3JcIjtcbiAgdmFyIGNvbnN0cnVjdG9yTmFtZSA9IGN0b3JOYW1lKHZhbCk7XG4gIHN3aXRjaCAoY29uc3RydWN0b3JOYW1lKSB7XG4gICAgY2FzZSBcIlN5bWJvbFwiOlxuICAgIGNhc2UgXCJQcm9taXNlXCI6XG4gICAgY2FzZSBcIldlYWtNYXBcIjpcbiAgICBjYXNlIFwiV2Vha1NldFwiOlxuICAgIGNhc2UgXCJNYXBcIjpcbiAgICBjYXNlIFwiU2V0XCI6XG4gICAgICByZXR1cm4gY29uc3RydWN0b3JOYW1lO1xuICB9XG4gIHJldHVybiB0eXBlLnNsaWNlKDgsIC0xKS50b0xvd2VyQ2FzZSgpLnJlcGxhY2UoL1xccy9nLCBcIlwiKTtcbn1cbmZ1bmN0aW9uIGN0b3JOYW1lKHZhbCkge1xuICByZXR1cm4gdHlwZW9mIHZhbC5jb25zdHJ1Y3RvciA9PT0gXCJmdW5jdGlvblwiID8gdmFsLmNvbnN0cnVjdG9yLm5hbWUgOiBudWxsO1xufVxuZnVuY3Rpb24gaXNFcnJvcih2YWwpIHtcbiAgcmV0dXJuIHZhbCBpbnN0YW5jZW9mIEVycm9yIHx8IHR5cGVvZiB2YWwubWVzc2FnZSA9PT0gXCJzdHJpbmdcIiAmJiB2YWwuY29uc3RydWN0b3IgJiYgdHlwZW9mIHZhbC5jb25zdHJ1Y3Rvci5zdGFja1RyYWNlTGltaXQgPT09IFwibnVtYmVyXCI7XG59XG5mdW5jdGlvbiBpc0RhdGUodmFsKSB7XG4gIGlmICh2YWwgaW5zdGFuY2VvZiBEYXRlKVxuICAgIHJldHVybiB0cnVlO1xuICByZXR1cm4gdHlwZW9mIHZhbC50b0RhdGVTdHJpbmcgPT09IFwiZnVuY3Rpb25cIiAmJiB0eXBlb2YgdmFsLmdldERhdGUgPT09IFwiZnVuY3Rpb25cIiAmJiB0eXBlb2YgdmFsLnNldERhdGUgPT09IFwiZnVuY3Rpb25cIjtcbn1cbmZ1bmN0aW9uIGtpbmRPZih2YWwpIHtcbiAgdmFyIHR5cGVPZlZhbCA9IHR5cGVvZiB2YWw7XG4gIGlmICh0cnVlKSB7XG4gICAgdHlwZU9mVmFsID0gbWluaUtpbmRPZih2YWwpO1xuICB9XG4gIHJldHVybiB0eXBlT2ZWYWw7XG59XG5mdW5jdGlvbiBjcmVhdGVTdG9yZShyZWR1Y2VyLCBwcmVsb2FkZWRTdGF0ZSwgZW5oYW5jZXIpIHtcbiAgdmFyIF9yZWYyO1xuICBpZiAodHlwZW9mIHByZWxvYWRlZFN0YXRlID09PSBcImZ1bmN0aW9uXCIgJiYgdHlwZW9mIGVuaGFuY2VyID09PSBcImZ1bmN0aW9uXCIgfHwgdHlwZW9mIGVuaGFuY2VyID09PSBcImZ1bmN0aW9uXCIgJiYgdHlwZW9mIGFyZ3VtZW50c1szXSA9PT0gXCJmdW5jdGlvblwiKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKGZhbHNlID8gZm9ybWF0UHJvZEVycm9yTWVzc2FnZSgwKSA6IFwiSXQgbG9va3MgbGlrZSB5b3UgYXJlIHBhc3Npbmcgc2V2ZXJhbCBzdG9yZSBlbmhhbmNlcnMgdG8gY3JlYXRlU3RvcmUoKS4gVGhpcyBpcyBub3Qgc3VwcG9ydGVkLiBJbnN0ZWFkLCBjb21wb3NlIHRoZW0gdG9nZXRoZXIgdG8gYSBzaW5nbGUgZnVuY3Rpb24uIFNlZSBodHRwczovL3JlZHV4LmpzLm9yZy90dXRvcmlhbHMvZnVuZGFtZW50YWxzL3BhcnQtNC1zdG9yZSNjcmVhdGluZy1hLXN0b3JlLXdpdGgtZW5oYW5jZXJzIGZvciBhbiBleGFtcGxlLlwiKTtcbiAgfVxuICBpZiAodHlwZW9mIHByZWxvYWRlZFN0YXRlID09PSBcImZ1bmN0aW9uXCIgJiYgdHlwZW9mIGVuaGFuY2VyID09PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgZW5oYW5jZXIgPSBwcmVsb2FkZWRTdGF0ZTtcbiAgICBwcmVsb2FkZWRTdGF0ZSA9IHZvaWQgMDtcbiAgfVxuICBpZiAodHlwZW9mIGVuaGFuY2VyICE9PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgaWYgKHR5cGVvZiBlbmhhbmNlciAhPT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoZmFsc2UgPyBmb3JtYXRQcm9kRXJyb3JNZXNzYWdlKDEpIDogXCJFeHBlY3RlZCB0aGUgZW5oYW5jZXIgdG8gYmUgYSBmdW5jdGlvbi4gSW5zdGVhZCwgcmVjZWl2ZWQ6ICdcIiArIGtpbmRPZihlbmhhbmNlcikgKyBcIidcIik7XG4gICAgfVxuICAgIHJldHVybiBlbmhhbmNlcihjcmVhdGVTdG9yZSkocmVkdWNlciwgcHJlbG9hZGVkU3RhdGUpO1xuICB9XG4gIGlmICh0eXBlb2YgcmVkdWNlciAhPT0gXCJmdW5jdGlvblwiKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKGZhbHNlID8gZm9ybWF0UHJvZEVycm9yTWVzc2FnZSgyKSA6IFwiRXhwZWN0ZWQgdGhlIHJvb3QgcmVkdWNlciB0byBiZSBhIGZ1bmN0aW9uLiBJbnN0ZWFkLCByZWNlaXZlZDogJ1wiICsga2luZE9mKHJlZHVjZXIpICsgXCInXCIpO1xuICB9XG4gIHZhciBjdXJyZW50UmVkdWNlciA9IHJlZHVjZXI7XG4gIHZhciBjdXJyZW50U3RhdGUgPSBwcmVsb2FkZWRTdGF0ZTtcbiAgdmFyIGN1cnJlbnRMaXN0ZW5lcnMgPSBbXTtcbiAgdmFyIG5leHRMaXN0ZW5lcnMgPSBjdXJyZW50TGlzdGVuZXJzO1xuICB2YXIgaXNEaXNwYXRjaGluZyA9IGZhbHNlO1xuICBmdW5jdGlvbiBlbnN1cmVDYW5NdXRhdGVOZXh0TGlzdGVuZXJzKCkge1xuICAgIGlmIChuZXh0TGlzdGVuZXJzID09PSBjdXJyZW50TGlzdGVuZXJzKSB7XG4gICAgICBuZXh0TGlzdGVuZXJzID0gY3VycmVudExpc3RlbmVycy5zbGljZSgpO1xuICAgIH1cbiAgfVxuICBmdW5jdGlvbiBnZXRTdGF0ZSgpIHtcbiAgICBpZiAoaXNEaXNwYXRjaGluZykge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKGZhbHNlID8gZm9ybWF0UHJvZEVycm9yTWVzc2FnZSgzKSA6IFwiWW91IG1heSBub3QgY2FsbCBzdG9yZS5nZXRTdGF0ZSgpIHdoaWxlIHRoZSByZWR1Y2VyIGlzIGV4ZWN1dGluZy4gVGhlIHJlZHVjZXIgaGFzIGFscmVhZHkgcmVjZWl2ZWQgdGhlIHN0YXRlIGFzIGFuIGFyZ3VtZW50LiBQYXNzIGl0IGRvd24gZnJvbSB0aGUgdG9wIHJlZHVjZXIgaW5zdGVhZCBvZiByZWFkaW5nIGl0IGZyb20gdGhlIHN0b3JlLlwiKTtcbiAgICB9XG4gICAgcmV0dXJuIGN1cnJlbnRTdGF0ZTtcbiAgfVxuICBmdW5jdGlvbiBzdWJzY3JpYmUobGlzdGVuZXIpIHtcbiAgICBpZiAodHlwZW9mIGxpc3RlbmVyICE9PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihmYWxzZSA/IGZvcm1hdFByb2RFcnJvck1lc3NhZ2UoNCkgOiBcIkV4cGVjdGVkIHRoZSBsaXN0ZW5lciB0byBiZSBhIGZ1bmN0aW9uLiBJbnN0ZWFkLCByZWNlaXZlZDogJ1wiICsga2luZE9mKGxpc3RlbmVyKSArIFwiJ1wiKTtcbiAgICB9XG4gICAgaWYgKGlzRGlzcGF0Y2hpbmcpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihmYWxzZSA/IGZvcm1hdFByb2RFcnJvck1lc3NhZ2UoNSkgOiBcIllvdSBtYXkgbm90IGNhbGwgc3RvcmUuc3Vic2NyaWJlKCkgd2hpbGUgdGhlIHJlZHVjZXIgaXMgZXhlY3V0aW5nLiBJZiB5b3Ugd291bGQgbGlrZSB0byBiZSBub3RpZmllZCBhZnRlciB0aGUgc3RvcmUgaGFzIGJlZW4gdXBkYXRlZCwgc3Vic2NyaWJlIGZyb20gYSBjb21wb25lbnQgYW5kIGludm9rZSBzdG9yZS5nZXRTdGF0ZSgpIGluIHRoZSBjYWxsYmFjayB0byBhY2Nlc3MgdGhlIGxhdGVzdCBzdGF0ZS4gU2VlIGh0dHBzOi8vcmVkdXguanMub3JnL2FwaS9zdG9yZSNzdWJzY3JpYmVsaXN0ZW5lciBmb3IgbW9yZSBkZXRhaWxzLlwiKTtcbiAgICB9XG4gICAgdmFyIGlzU3Vic2NyaWJlZCA9IHRydWU7XG4gICAgZW5zdXJlQ2FuTXV0YXRlTmV4dExpc3RlbmVycygpO1xuICAgIG5leHRMaXN0ZW5lcnMucHVzaChsaXN0ZW5lcik7XG4gICAgcmV0dXJuIGZ1bmN0aW9uIHVuc3Vic2NyaWJlKCkge1xuICAgICAgaWYgKCFpc1N1YnNjcmliZWQpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgaWYgKGlzRGlzcGF0Y2hpbmcpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKGZhbHNlID8gZm9ybWF0UHJvZEVycm9yTWVzc2FnZSg2KSA6IFwiWW91IG1heSBub3QgdW5zdWJzY3JpYmUgZnJvbSBhIHN0b3JlIGxpc3RlbmVyIHdoaWxlIHRoZSByZWR1Y2VyIGlzIGV4ZWN1dGluZy4gU2VlIGh0dHBzOi8vcmVkdXguanMub3JnL2FwaS9zdG9yZSNzdWJzY3JpYmVsaXN0ZW5lciBmb3IgbW9yZSBkZXRhaWxzLlwiKTtcbiAgICAgIH1cbiAgICAgIGlzU3Vic2NyaWJlZCA9IGZhbHNlO1xuICAgICAgZW5zdXJlQ2FuTXV0YXRlTmV4dExpc3RlbmVycygpO1xuICAgICAgdmFyIGluZGV4ID0gbmV4dExpc3RlbmVycy5pbmRleE9mKGxpc3RlbmVyKTtcbiAgICAgIG5leHRMaXN0ZW5lcnMuc3BsaWNlKGluZGV4LCAxKTtcbiAgICAgIGN1cnJlbnRMaXN0ZW5lcnMgPSBudWxsO1xuICAgIH07XG4gIH1cbiAgZnVuY3Rpb24gZGlzcGF0Y2goYWN0aW9uKSB7XG4gICAgaWYgKCFpc1BsYWluT2JqZWN0KGFjdGlvbikpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihmYWxzZSA/IGZvcm1hdFByb2RFcnJvck1lc3NhZ2UoNykgOiBcIkFjdGlvbnMgbXVzdCBiZSBwbGFpbiBvYmplY3RzLiBJbnN0ZWFkLCB0aGUgYWN0dWFsIHR5cGUgd2FzOiAnXCIgKyBraW5kT2YoYWN0aW9uKSArIFwiJy4gWW91IG1heSBuZWVkIHRvIGFkZCBtaWRkbGV3YXJlIHRvIHlvdXIgc3RvcmUgc2V0dXAgdG8gaGFuZGxlIGRpc3BhdGNoaW5nIG90aGVyIHZhbHVlcywgc3VjaCBhcyAncmVkdXgtdGh1bmsnIHRvIGhhbmRsZSBkaXNwYXRjaGluZyBmdW5jdGlvbnMuIFNlZSBodHRwczovL3JlZHV4LmpzLm9yZy90dXRvcmlhbHMvZnVuZGFtZW50YWxzL3BhcnQtNC1zdG9yZSNtaWRkbGV3YXJlIGFuZCBodHRwczovL3JlZHV4LmpzLm9yZy90dXRvcmlhbHMvZnVuZGFtZW50YWxzL3BhcnQtNi1hc3luYy1sb2dpYyN1c2luZy10aGUtcmVkdXgtdGh1bmstbWlkZGxld2FyZSBmb3IgZXhhbXBsZXMuXCIpO1xuICAgIH1cbiAgICBpZiAodHlwZW9mIGFjdGlvbi50eXBlID09PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoZmFsc2UgPyBmb3JtYXRQcm9kRXJyb3JNZXNzYWdlKDgpIDogJ0FjdGlvbnMgbWF5IG5vdCBoYXZlIGFuIHVuZGVmaW5lZCBcInR5cGVcIiBwcm9wZXJ0eS4gWW91IG1heSBoYXZlIG1pc3NwZWxsZWQgYW4gYWN0aW9uIHR5cGUgc3RyaW5nIGNvbnN0YW50LicpO1xuICAgIH1cbiAgICBpZiAoaXNEaXNwYXRjaGluZykge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKGZhbHNlID8gZm9ybWF0UHJvZEVycm9yTWVzc2FnZSg5KSA6IFwiUmVkdWNlcnMgbWF5IG5vdCBkaXNwYXRjaCBhY3Rpb25zLlwiKTtcbiAgICB9XG4gICAgdHJ5IHtcbiAgICAgIGlzRGlzcGF0Y2hpbmcgPSB0cnVlO1xuICAgICAgY3VycmVudFN0YXRlID0gY3VycmVudFJlZHVjZXIoY3VycmVudFN0YXRlLCBhY3Rpb24pO1xuICAgIH0gZmluYWxseSB7XG4gICAgICBpc0Rpc3BhdGNoaW5nID0gZmFsc2U7XG4gICAgfVxuICAgIHZhciBsaXN0ZW5lcnMgPSBjdXJyZW50TGlzdGVuZXJzID0gbmV4dExpc3RlbmVycztcbiAgICBmb3IgKHZhciBpMiA9IDA7IGkyIDwgbGlzdGVuZXJzLmxlbmd0aDsgaTIrKykge1xuICAgICAgdmFyIGxpc3RlbmVyID0gbGlzdGVuZXJzW2kyXTtcbiAgICAgIGxpc3RlbmVyKCk7XG4gICAgfVxuICAgIHJldHVybiBhY3Rpb247XG4gIH1cbiAgZnVuY3Rpb24gcmVwbGFjZVJlZHVjZXIobmV4dFJlZHVjZXIpIHtcbiAgICBpZiAodHlwZW9mIG5leHRSZWR1Y2VyICE9PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihmYWxzZSA/IGZvcm1hdFByb2RFcnJvck1lc3NhZ2UoMTApIDogXCJFeHBlY3RlZCB0aGUgbmV4dFJlZHVjZXIgdG8gYmUgYSBmdW5jdGlvbi4gSW5zdGVhZCwgcmVjZWl2ZWQ6ICdcIiArIGtpbmRPZihuZXh0UmVkdWNlcikpO1xuICAgIH1cbiAgICBjdXJyZW50UmVkdWNlciA9IG5leHRSZWR1Y2VyO1xuICAgIGRpc3BhdGNoKHtcbiAgICAgIHR5cGU6IEFjdGlvblR5cGVzLlJFUExBQ0VcbiAgICB9KTtcbiAgfVxuICBmdW5jdGlvbiBvYnNlcnZhYmxlKCkge1xuICAgIHZhciBfcmVmO1xuICAgIHZhciBvdXRlclN1YnNjcmliZSA9IHN1YnNjcmliZTtcbiAgICByZXR1cm4gX3JlZiA9IHtcbiAgICAgIHN1YnNjcmliZTogZnVuY3Rpb24gc3Vic2NyaWJlMihvYnNlcnZlcikge1xuICAgICAgICBpZiAodHlwZW9mIG9ic2VydmVyICE9PSBcIm9iamVjdFwiIHx8IG9ic2VydmVyID09PSBudWxsKSB7XG4gICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGZhbHNlID8gZm9ybWF0UHJvZEVycm9yTWVzc2FnZSgxMSkgOiBcIkV4cGVjdGVkIHRoZSBvYnNlcnZlciB0byBiZSBhbiBvYmplY3QuIEluc3RlYWQsIHJlY2VpdmVkOiAnXCIgKyBraW5kT2Yob2JzZXJ2ZXIpICsgXCInXCIpO1xuICAgICAgICB9XG4gICAgICAgIGZ1bmN0aW9uIG9ic2VydmVTdGF0ZSgpIHtcbiAgICAgICAgICBpZiAob2JzZXJ2ZXIubmV4dCkge1xuICAgICAgICAgICAgb2JzZXJ2ZXIubmV4dChnZXRTdGF0ZSgpKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgb2JzZXJ2ZVN0YXRlKCk7XG4gICAgICAgIHZhciB1bnN1YnNjcmliZSA9IG91dGVyU3Vic2NyaWJlKG9ic2VydmVTdGF0ZSk7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgdW5zdWJzY3JpYmVcbiAgICAgICAgfTtcbiAgICAgIH1cbiAgICB9LCBfcmVmWyQkb2JzZXJ2YWJsZV0gPSBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH0sIF9yZWY7XG4gIH1cbiAgZGlzcGF0Y2goe1xuICAgIHR5cGU6IEFjdGlvblR5cGVzLklOSVRcbiAgfSk7XG4gIHJldHVybiBfcmVmMiA9IHtcbiAgICBkaXNwYXRjaCxcbiAgICBzdWJzY3JpYmUsXG4gICAgZ2V0U3RhdGUsXG4gICAgcmVwbGFjZVJlZHVjZXJcbiAgfSwgX3JlZjJbJCRvYnNlcnZhYmxlXSA9IG9ic2VydmFibGUsIF9yZWYyO1xufVxudmFyIGxlZ2FjeV9jcmVhdGVTdG9yZSA9IGNyZWF0ZVN0b3JlO1xuZnVuY3Rpb24gd2FybmluZyhtZXNzYWdlKSB7XG4gIGlmICh0eXBlb2YgY29uc29sZSAhPT0gXCJ1bmRlZmluZWRcIiAmJiB0eXBlb2YgY29uc29sZS5lcnJvciA9PT0gXCJmdW5jdGlvblwiKSB7XG4gICAgY29uc29sZS5lcnJvcihtZXNzYWdlKTtcbiAgfVxuICB0cnkge1xuICAgIHRocm93IG5ldyBFcnJvcihtZXNzYWdlKTtcbiAgfSBjYXRjaCAoZSkge1xuICB9XG59XG5mdW5jdGlvbiBnZXRVbmV4cGVjdGVkU3RhdGVTaGFwZVdhcm5pbmdNZXNzYWdlKGlucHV0U3RhdGUsIHJlZHVjZXJzLCBhY3Rpb24sIHVuZXhwZWN0ZWRLZXlDYWNoZSkge1xuICB2YXIgcmVkdWNlcktleXMgPSBPYmplY3Qua2V5cyhyZWR1Y2Vycyk7XG4gIHZhciBhcmd1bWVudE5hbWUgPSBhY3Rpb24gJiYgYWN0aW9uLnR5cGUgPT09IEFjdGlvblR5cGVzLklOSVQgPyBcInByZWxvYWRlZFN0YXRlIGFyZ3VtZW50IHBhc3NlZCB0byBjcmVhdGVTdG9yZVwiIDogXCJwcmV2aW91cyBzdGF0ZSByZWNlaXZlZCBieSB0aGUgcmVkdWNlclwiO1xuICBpZiAocmVkdWNlcktleXMubGVuZ3RoID09PSAwKSB7XG4gICAgcmV0dXJuIFwiU3RvcmUgZG9lcyBub3QgaGF2ZSBhIHZhbGlkIHJlZHVjZXIuIE1ha2Ugc3VyZSB0aGUgYXJndW1lbnQgcGFzc2VkIHRvIGNvbWJpbmVSZWR1Y2VycyBpcyBhbiBvYmplY3Qgd2hvc2UgdmFsdWVzIGFyZSByZWR1Y2Vycy5cIjtcbiAgfVxuICBpZiAoIWlzUGxhaW5PYmplY3QoaW5wdXRTdGF0ZSkpIHtcbiAgICByZXR1cm4gXCJUaGUgXCIgKyBhcmd1bWVudE5hbWUgKyAnIGhhcyB1bmV4cGVjdGVkIHR5cGUgb2YgXCInICsga2luZE9mKGlucHV0U3RhdGUpICsgJ1wiLiBFeHBlY3RlZCBhcmd1bWVudCB0byBiZSBhbiBvYmplY3Qgd2l0aCB0aGUgZm9sbG93aW5nICcgKyAoJ2tleXM6IFwiJyArIHJlZHVjZXJLZXlzLmpvaW4oJ1wiLCBcIicpICsgJ1wiJyk7XG4gIH1cbiAgdmFyIHVuZXhwZWN0ZWRLZXlzID0gT2JqZWN0LmtleXMoaW5wdXRTdGF0ZSkuZmlsdGVyKGZ1bmN0aW9uKGtleSkge1xuICAgIHJldHVybiAhcmVkdWNlcnMuaGFzT3duUHJvcGVydHkoa2V5KSAmJiAhdW5leHBlY3RlZEtleUNhY2hlW2tleV07XG4gIH0pO1xuICB1bmV4cGVjdGVkS2V5cy5mb3JFYWNoKGZ1bmN0aW9uKGtleSkge1xuICAgIHVuZXhwZWN0ZWRLZXlDYWNoZVtrZXldID0gdHJ1ZTtcbiAgfSk7XG4gIGlmIChhY3Rpb24gJiYgYWN0aW9uLnR5cGUgPT09IEFjdGlvblR5cGVzLlJFUExBQ0UpXG4gICAgcmV0dXJuO1xuICBpZiAodW5leHBlY3RlZEtleXMubGVuZ3RoID4gMCkge1xuICAgIHJldHVybiBcIlVuZXhwZWN0ZWQgXCIgKyAodW5leHBlY3RlZEtleXMubGVuZ3RoID4gMSA/IFwia2V5c1wiIDogXCJrZXlcIikgKyBcIiBcIiArICgnXCInICsgdW5leHBlY3RlZEtleXMuam9pbignXCIsIFwiJykgKyAnXCIgZm91bmQgaW4gJyArIGFyZ3VtZW50TmFtZSArIFwiLiBcIikgKyBcIkV4cGVjdGVkIHRvIGZpbmQgb25lIG9mIHRoZSBrbm93biByZWR1Y2VyIGtleXMgaW5zdGVhZDogXCIgKyAoJ1wiJyArIHJlZHVjZXJLZXlzLmpvaW4oJ1wiLCBcIicpICsgJ1wiLiBVbmV4cGVjdGVkIGtleXMgd2lsbCBiZSBpZ25vcmVkLicpO1xuICB9XG59XG5mdW5jdGlvbiBhc3NlcnRSZWR1Y2VyU2hhcGUocmVkdWNlcnMpIHtcbiAgT2JqZWN0LmtleXMocmVkdWNlcnMpLmZvckVhY2goZnVuY3Rpb24oa2V5KSB7XG4gICAgdmFyIHJlZHVjZXIgPSByZWR1Y2Vyc1trZXldO1xuICAgIHZhciBpbml0aWFsU3RhdGUgPSByZWR1Y2VyKHZvaWQgMCwge1xuICAgICAgdHlwZTogQWN0aW9uVHlwZXMuSU5JVFxuICAgIH0pO1xuICAgIGlmICh0eXBlb2YgaW5pdGlhbFN0YXRlID09PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoZmFsc2UgPyBmb3JtYXRQcm9kRXJyb3JNZXNzYWdlKDEyKSA6ICdUaGUgc2xpY2UgcmVkdWNlciBmb3Iga2V5IFwiJyArIGtleSArIGBcIiByZXR1cm5lZCB1bmRlZmluZWQgZHVyaW5nIGluaXRpYWxpemF0aW9uLiBJZiB0aGUgc3RhdGUgcGFzc2VkIHRvIHRoZSByZWR1Y2VyIGlzIHVuZGVmaW5lZCwgeW91IG11c3QgZXhwbGljaXRseSByZXR1cm4gdGhlIGluaXRpYWwgc3RhdGUuIFRoZSBpbml0aWFsIHN0YXRlIG1heSBub3QgYmUgdW5kZWZpbmVkLiBJZiB5b3UgZG9uJ3Qgd2FudCB0byBzZXQgYSB2YWx1ZSBmb3IgdGhpcyByZWR1Y2VyLCB5b3UgY2FuIHVzZSBudWxsIGluc3RlYWQgb2YgdW5kZWZpbmVkLmApO1xuICAgIH1cbiAgICBpZiAodHlwZW9mIHJlZHVjZXIodm9pZCAwLCB7XG4gICAgICB0eXBlOiBBY3Rpb25UeXBlcy5QUk9CRV9VTktOT1dOX0FDVElPTigpXG4gICAgfSkgPT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihmYWxzZSA/IGZvcm1hdFByb2RFcnJvck1lc3NhZ2UoMTMpIDogJ1RoZSBzbGljZSByZWR1Y2VyIGZvciBrZXkgXCInICsga2V5ICsgJ1wiIHJldHVybmVkIHVuZGVmaW5lZCB3aGVuIHByb2JlZCB3aXRoIGEgcmFuZG9tIHR5cGUuICcgKyAoXCJEb24ndCB0cnkgdG8gaGFuZGxlICdcIiArIEFjdGlvblR5cGVzLklOSVQgKyBgJyBvciBvdGhlciBhY3Rpb25zIGluIFwicmVkdXgvKlwiIGApICsgXCJuYW1lc3BhY2UuIFRoZXkgYXJlIGNvbnNpZGVyZWQgcHJpdmF0ZS4gSW5zdGVhZCwgeW91IG11c3QgcmV0dXJuIHRoZSBjdXJyZW50IHN0YXRlIGZvciBhbnkgdW5rbm93biBhY3Rpb25zLCB1bmxlc3MgaXQgaXMgdW5kZWZpbmVkLCBpbiB3aGljaCBjYXNlIHlvdSBtdXN0IHJldHVybiB0aGUgaW5pdGlhbCBzdGF0ZSwgcmVnYXJkbGVzcyBvZiB0aGUgYWN0aW9uIHR5cGUuIFRoZSBpbml0aWFsIHN0YXRlIG1heSBub3QgYmUgdW5kZWZpbmVkLCBidXQgY2FuIGJlIG51bGwuXCIpO1xuICAgIH1cbiAgfSk7XG59XG5mdW5jdGlvbiBjb21iaW5lUmVkdWNlcnMocmVkdWNlcnMpIHtcbiAgdmFyIHJlZHVjZXJLZXlzID0gT2JqZWN0LmtleXMocmVkdWNlcnMpO1xuICB2YXIgZmluYWxSZWR1Y2VycyA9IHt9O1xuICBmb3IgKHZhciBpMiA9IDA7IGkyIDwgcmVkdWNlcktleXMubGVuZ3RoOyBpMisrKSB7XG4gICAgdmFyIGtleSA9IHJlZHVjZXJLZXlzW2kyXTtcbiAgICBpZiAodHJ1ZSkge1xuICAgICAgaWYgKHR5cGVvZiByZWR1Y2Vyc1trZXldID09PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgICAgIHdhcm5pbmcoJ05vIHJlZHVjZXIgcHJvdmlkZWQgZm9yIGtleSBcIicgKyBrZXkgKyAnXCInKTtcbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKHR5cGVvZiByZWR1Y2Vyc1trZXldID09PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgIGZpbmFsUmVkdWNlcnNba2V5XSA9IHJlZHVjZXJzW2tleV07XG4gICAgfVxuICB9XG4gIHZhciBmaW5hbFJlZHVjZXJLZXlzID0gT2JqZWN0LmtleXMoZmluYWxSZWR1Y2Vycyk7XG4gIHZhciB1bmV4cGVjdGVkS2V5Q2FjaGU7XG4gIGlmICh0cnVlKSB7XG4gICAgdW5leHBlY3RlZEtleUNhY2hlID0ge307XG4gIH1cbiAgdmFyIHNoYXBlQXNzZXJ0aW9uRXJyb3I7XG4gIHRyeSB7XG4gICAgYXNzZXJ0UmVkdWNlclNoYXBlKGZpbmFsUmVkdWNlcnMpO1xuICB9IGNhdGNoIChlKSB7XG4gICAgc2hhcGVBc3NlcnRpb25FcnJvciA9IGU7XG4gIH1cbiAgcmV0dXJuIGZ1bmN0aW9uIGNvbWJpbmF0aW9uKHN0YXRlLCBhY3Rpb24pIHtcbiAgICBpZiAoc3RhdGUgPT09IHZvaWQgMCkge1xuICAgICAgc3RhdGUgPSB7fTtcbiAgICB9XG4gICAgaWYgKHNoYXBlQXNzZXJ0aW9uRXJyb3IpIHtcbiAgICAgIHRocm93IHNoYXBlQXNzZXJ0aW9uRXJyb3I7XG4gICAgfVxuICAgIGlmICh0cnVlKSB7XG4gICAgICB2YXIgd2FybmluZ01lc3NhZ2UgPSBnZXRVbmV4cGVjdGVkU3RhdGVTaGFwZVdhcm5pbmdNZXNzYWdlKHN0YXRlLCBmaW5hbFJlZHVjZXJzLCBhY3Rpb24sIHVuZXhwZWN0ZWRLZXlDYWNoZSk7XG4gICAgICBpZiAod2FybmluZ01lc3NhZ2UpIHtcbiAgICAgICAgd2FybmluZyh3YXJuaW5nTWVzc2FnZSk7XG4gICAgICB9XG4gICAgfVxuICAgIHZhciBoYXNDaGFuZ2VkID0gZmFsc2U7XG4gICAgdmFyIG5leHRTdGF0ZTMgPSB7fTtcbiAgICBmb3IgKHZhciBfaSA9IDA7IF9pIDwgZmluYWxSZWR1Y2VyS2V5cy5sZW5ndGg7IF9pKyspIHtcbiAgICAgIHZhciBfa2V5ID0gZmluYWxSZWR1Y2VyS2V5c1tfaV07XG4gICAgICB2YXIgcmVkdWNlciA9IGZpbmFsUmVkdWNlcnNbX2tleV07XG4gICAgICB2YXIgcHJldmlvdXNTdGF0ZUZvcktleSA9IHN0YXRlW19rZXldO1xuICAgICAgdmFyIG5leHRTdGF0ZUZvcktleSA9IHJlZHVjZXIocHJldmlvdXNTdGF0ZUZvcktleSwgYWN0aW9uKTtcbiAgICAgIGlmICh0eXBlb2YgbmV4dFN0YXRlRm9yS2V5ID09PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgICAgIHZhciBhY3Rpb25UeXBlID0gYWN0aW9uICYmIGFjdGlvbi50eXBlO1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoZmFsc2UgPyBmb3JtYXRQcm9kRXJyb3JNZXNzYWdlKDE0KSA6IFwiV2hlbiBjYWxsZWQgd2l0aCBhbiBhY3Rpb24gb2YgdHlwZSBcIiArIChhY3Rpb25UeXBlID8gJ1wiJyArIFN0cmluZyhhY3Rpb25UeXBlKSArICdcIicgOiBcIih1bmtub3duIHR5cGUpXCIpICsgJywgdGhlIHNsaWNlIHJlZHVjZXIgZm9yIGtleSBcIicgKyBfa2V5ICsgJ1wiIHJldHVybmVkIHVuZGVmaW5lZC4gVG8gaWdub3JlIGFuIGFjdGlvbiwgeW91IG11c3QgZXhwbGljaXRseSByZXR1cm4gdGhlIHByZXZpb3VzIHN0YXRlLiBJZiB5b3Ugd2FudCB0aGlzIHJlZHVjZXIgdG8gaG9sZCBubyB2YWx1ZSwgeW91IGNhbiByZXR1cm4gbnVsbCBpbnN0ZWFkIG9mIHVuZGVmaW5lZC4nKTtcbiAgICAgIH1cbiAgICAgIG5leHRTdGF0ZTNbX2tleV0gPSBuZXh0U3RhdGVGb3JLZXk7XG4gICAgICBoYXNDaGFuZ2VkID0gaGFzQ2hhbmdlZCB8fCBuZXh0U3RhdGVGb3JLZXkgIT09IHByZXZpb3VzU3RhdGVGb3JLZXk7XG4gICAgfVxuICAgIGhhc0NoYW5nZWQgPSBoYXNDaGFuZ2VkIHx8IGZpbmFsUmVkdWNlcktleXMubGVuZ3RoICE9PSBPYmplY3Qua2V5cyhzdGF0ZSkubGVuZ3RoO1xuICAgIHJldHVybiBoYXNDaGFuZ2VkID8gbmV4dFN0YXRlMyA6IHN0YXRlO1xuICB9O1xufVxuZnVuY3Rpb24gYmluZEFjdGlvbkNyZWF0b3IoYWN0aW9uQ3JlYXRvciwgZGlzcGF0Y2gpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiBkaXNwYXRjaChhY3Rpb25DcmVhdG9yLmFwcGx5KHRoaXMsIGFyZ3VtZW50cykpO1xuICB9O1xufVxuZnVuY3Rpb24gYmluZEFjdGlvbkNyZWF0b3JzKGFjdGlvbkNyZWF0b3JzLCBkaXNwYXRjaCkge1xuICBpZiAodHlwZW9mIGFjdGlvbkNyZWF0b3JzID09PSBcImZ1bmN0aW9uXCIpIHtcbiAgICByZXR1cm4gYmluZEFjdGlvbkNyZWF0b3IoYWN0aW9uQ3JlYXRvcnMsIGRpc3BhdGNoKTtcbiAgfVxuICBpZiAodHlwZW9mIGFjdGlvbkNyZWF0b3JzICE9PSBcIm9iamVjdFwiIHx8IGFjdGlvbkNyZWF0b3JzID09PSBudWxsKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKGZhbHNlID8gZm9ybWF0UHJvZEVycm9yTWVzc2FnZSgxNikgOiBcImJpbmRBY3Rpb25DcmVhdG9ycyBleHBlY3RlZCBhbiBvYmplY3Qgb3IgYSBmdW5jdGlvbiwgYnV0IGluc3RlYWQgcmVjZWl2ZWQ6ICdcIiArIGtpbmRPZihhY3Rpb25DcmVhdG9ycykgKyBgJy4gRGlkIHlvdSB3cml0ZSBcImltcG9ydCBBY3Rpb25DcmVhdG9ycyBmcm9tXCIgaW5zdGVhZCBvZiBcImltcG9ydCAqIGFzIEFjdGlvbkNyZWF0b3JzIGZyb21cIj9gKTtcbiAgfVxuICB2YXIgYm91bmRBY3Rpb25DcmVhdG9ycyA9IHt9O1xuICBmb3IgKHZhciBrZXkgaW4gYWN0aW9uQ3JlYXRvcnMpIHtcbiAgICB2YXIgYWN0aW9uQ3JlYXRvciA9IGFjdGlvbkNyZWF0b3JzW2tleV07XG4gICAgaWYgKHR5cGVvZiBhY3Rpb25DcmVhdG9yID09PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgIGJvdW5kQWN0aW9uQ3JlYXRvcnNba2V5XSA9IGJpbmRBY3Rpb25DcmVhdG9yKGFjdGlvbkNyZWF0b3IsIGRpc3BhdGNoKTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIGJvdW5kQWN0aW9uQ3JlYXRvcnM7XG59XG5mdW5jdGlvbiBjb21wb3NlKCkge1xuICBmb3IgKHZhciBfbGVuID0gYXJndW1lbnRzLmxlbmd0aCwgZnVuY3MgPSBuZXcgQXJyYXkoX2xlbiksIF9rZXkgPSAwOyBfa2V5IDwgX2xlbjsgX2tleSsrKSB7XG4gICAgZnVuY3NbX2tleV0gPSBhcmd1bWVudHNbX2tleV07XG4gIH1cbiAgaWYgKGZ1bmNzLmxlbmd0aCA9PT0gMCkge1xuICAgIHJldHVybiBmdW5jdGlvbihhcmcpIHtcbiAgICAgIHJldHVybiBhcmc7XG4gICAgfTtcbiAgfVxuICBpZiAoZnVuY3MubGVuZ3RoID09PSAxKSB7XG4gICAgcmV0dXJuIGZ1bmNzWzBdO1xuICB9XG4gIHJldHVybiBmdW5jcy5yZWR1Y2UoZnVuY3Rpb24oYTIsIGIyKSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIGEyKGIyLmFwcGx5KHZvaWQgMCwgYXJndW1lbnRzKSk7XG4gICAgfTtcbiAgfSk7XG59XG5mdW5jdGlvbiBhcHBseU1pZGRsZXdhcmUoKSB7XG4gIGZvciAodmFyIF9sZW4gPSBhcmd1bWVudHMubGVuZ3RoLCBtaWRkbGV3YXJlcyA9IG5ldyBBcnJheShfbGVuKSwgX2tleSA9IDA7IF9rZXkgPCBfbGVuOyBfa2V5KyspIHtcbiAgICBtaWRkbGV3YXJlc1tfa2V5XSA9IGFyZ3VtZW50c1tfa2V5XTtcbiAgfVxuICByZXR1cm4gZnVuY3Rpb24oY3JlYXRlU3RvcmUzKSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgICAgdmFyIHN0b3JlID0gY3JlYXRlU3RvcmUzLmFwcGx5KHZvaWQgMCwgYXJndW1lbnRzKTtcbiAgICAgIHZhciBfZGlzcGF0Y2ggPSBmdW5jdGlvbiBkaXNwYXRjaCgpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKGZhbHNlID8gZm9ybWF0UHJvZEVycm9yTWVzc2FnZSgxNSkgOiBcIkRpc3BhdGNoaW5nIHdoaWxlIGNvbnN0cnVjdGluZyB5b3VyIG1pZGRsZXdhcmUgaXMgbm90IGFsbG93ZWQuIE90aGVyIG1pZGRsZXdhcmUgd291bGQgbm90IGJlIGFwcGxpZWQgdG8gdGhpcyBkaXNwYXRjaC5cIik7XG4gICAgICB9O1xuICAgICAgdmFyIG1pZGRsZXdhcmVBUEkgPSB7XG4gICAgICAgIGdldFN0YXRlOiBzdG9yZS5nZXRTdGF0ZSxcbiAgICAgICAgZGlzcGF0Y2g6IGZ1bmN0aW9uIGRpc3BhdGNoKCkge1xuICAgICAgICAgIHJldHVybiBfZGlzcGF0Y2guYXBwbHkodm9pZCAwLCBhcmd1bWVudHMpO1xuICAgICAgICB9XG4gICAgICB9O1xuICAgICAgdmFyIGNoYWluID0gbWlkZGxld2FyZXMubWFwKGZ1bmN0aW9uKG1pZGRsZXdhcmUpIHtcbiAgICAgICAgcmV0dXJuIG1pZGRsZXdhcmUobWlkZGxld2FyZUFQSSk7XG4gICAgICB9KTtcbiAgICAgIF9kaXNwYXRjaCA9IGNvbXBvc2UuYXBwbHkodm9pZCAwLCBjaGFpbikoc3RvcmUuZGlzcGF0Y2gpO1xuICAgICAgcmV0dXJuIF9vYmplY3RTcHJlYWQyKF9vYmplY3RTcHJlYWQyKHt9LCBzdG9yZSksIHt9LCB7XG4gICAgICAgIGRpc3BhdGNoOiBfZGlzcGF0Y2hcbiAgICAgIH0pO1xuICAgIH07XG4gIH07XG59XG5mdW5jdGlvbiBpc0NydXNoZWQoKSB7XG59XG5pZiAodHlwZW9mIGlzQ3J1c2hlZC5uYW1lID09PSBcInN0cmluZ1wiICYmIGlzQ3J1c2hlZC5uYW1lICE9PSBcImlzQ3J1c2hlZFwiKSB7XG4gIHdhcm5pbmcoJ1lvdSBhcmUgY3VycmVudGx5IHVzaW5nIG1pbmlmaWVkIGNvZGUgb3V0c2lkZSBvZiBOT0RFX0VOViA9PT0gXCJwcm9kdWN0aW9uXCIuIFRoaXMgbWVhbnMgdGhhdCB5b3UgYXJlIHJ1bm5pbmcgYSBzbG93ZXIgZGV2ZWxvcG1lbnQgYnVpbGQgb2YgUmVkdXguIFlvdSBjYW4gdXNlIGxvb3NlLWVudmlmeSAoaHR0cHM6Ly9naXRodWIuY29tL3plcnRvc2gvbG9vc2UtZW52aWZ5KSBmb3IgYnJvd3NlcmlmeSBvciBzZXR0aW5nIG1vZGUgdG8gcHJvZHVjdGlvbiBpbiB3ZWJwYWNrIChodHRwczovL3dlYnBhY2suanMub3JnL2NvbmNlcHRzL21vZGUvKSB0byBlbnN1cmUgeW91IGhhdmUgdGhlIGNvcnJlY3QgY29kZSBmb3IgeW91ciBwcm9kdWN0aW9uIGJ1aWxkLicpO1xufVxuXG4vLyBub2RlX21vZHVsZXMvQGljZS9zdG9yZS9lc20vdXRpbHMvaXNMaXN0ZW5lci5qc1xudmFyIGlzTGlzdGVuZXJfZGVmYXVsdCA9IGZ1bmN0aW9uKHJlZHVjZXIpIHtcbiAgcmV0dXJuIHJlZHVjZXIuaW5kZXhPZihcIi9cIikgPiAtMTtcbn07XG5cbi8vIG5vZGVfbW9kdWxlcy9AaWNlL3N0b3JlL2VzbS9yZWR1eC5qc1xudmFyIF9fYXNzaWduID0gZnVuY3Rpb24oKSB7XG4gIF9fYXNzaWduID0gT2JqZWN0LmFzc2lnbiB8fCBmdW5jdGlvbih0Mikge1xuICAgIGZvciAodmFyIHMyLCBpMiA9IDEsIG4yID0gYXJndW1lbnRzLmxlbmd0aDsgaTIgPCBuMjsgaTIrKykge1xuICAgICAgczIgPSBhcmd1bWVudHNbaTJdO1xuICAgICAgZm9yICh2YXIgcDIgaW4gczIpXG4gICAgICAgIGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwoczIsIHAyKSlcbiAgICAgICAgICB0MltwMl0gPSBzMltwMl07XG4gICAgfVxuICAgIHJldHVybiB0MjtcbiAgfTtcbiAgcmV0dXJuIF9fYXNzaWduLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG59O1xudmFyIF9fcmVzdCA9IGZ1bmN0aW9uKHMyLCBlKSB7XG4gIHZhciB0MiA9IHt9O1xuICBmb3IgKHZhciBwMiBpbiBzMilcbiAgICBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKHMyLCBwMikgJiYgZS5pbmRleE9mKHAyKSA8IDApXG4gICAgICB0MltwMl0gPSBzMltwMl07XG4gIGlmIChzMiAhPSBudWxsICYmIHR5cGVvZiBPYmplY3QuZ2V0T3duUHJvcGVydHlTeW1ib2xzID09PSBcImZ1bmN0aW9uXCIpXG4gICAgZm9yICh2YXIgaTIgPSAwLCBwMiA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eVN5bWJvbHMoczIpOyBpMiA8IHAyLmxlbmd0aDsgaTIrKykge1xuICAgICAgaWYgKGUuaW5kZXhPZihwMltpMl0pIDwgMCAmJiBPYmplY3QucHJvdG90eXBlLnByb3BlcnR5SXNFbnVtZXJhYmxlLmNhbGwoczIsIHAyW2kyXSkpXG4gICAgICAgIHQyW3AyW2kyXV0gPSBzMltwMltpMl1dO1xuICAgIH1cbiAgcmV0dXJuIHQyO1xufTtcbnZhciBfX3NwcmVhZEFycmF5cyA9IGZ1bmN0aW9uKCkge1xuICBmb3IgKHZhciBzMiA9IDAsIGkyID0gMCwgaWwgPSBhcmd1bWVudHMubGVuZ3RoOyBpMiA8IGlsOyBpMisrKVxuICAgIHMyICs9IGFyZ3VtZW50c1tpMl0ubGVuZ3RoO1xuICBmb3IgKHZhciByMiA9IEFycmF5KHMyKSwgazIgPSAwLCBpMiA9IDA7IGkyIDwgaWw7IGkyKyspXG4gICAgZm9yICh2YXIgYTIgPSBhcmd1bWVudHNbaTJdLCBqMiA9IDAsIGpsID0gYTIubGVuZ3RoOyBqMiA8IGpsOyBqMisrLCBrMisrKVxuICAgICAgcjJbazJdID0gYTJbajJdO1xuICByZXR1cm4gcjI7XG59O1xudmFyIGNvbXBvc2VFbmhhbmNlcnNXaXRoRGV2dG9vbHMgPSBmdW5jdGlvbihkZXZ0b29sT3B0aW9ucykge1xuICBpZiAoZGV2dG9vbE9wdGlvbnMgPT09IHZvaWQgMCkge1xuICAgIGRldnRvb2xPcHRpb25zID0ge307XG4gIH1cbiAgdmFyIGRpc2FibGVkID0gZGV2dG9vbE9wdGlvbnMuZGlzYWJsZWQsIG9wdGlvbnMgPSBfX3Jlc3QoZGV2dG9vbE9wdGlvbnMsIFtcImRpc2FibGVkXCJdKTtcbiAgcmV0dXJuICFkaXNhYmxlZCAmJiB0eXBlb2Ygd2luZG93ID09PSBcIm9iamVjdFwiICYmIHdpbmRvdy5fX1JFRFVYX0RFVlRPT0xTX0VYVEVOU0lPTl9DT01QT1NFX18gPyB3aW5kb3cuX19SRURVWF9ERVZUT09MU19FWFRFTlNJT05fQ09NUE9TRV9fKG9wdGlvbnMpIDogY29tcG9zZTtcbn07XG5mdW5jdGlvbiByZWR1eF9kZWZhdWx0KF9hKSB7XG4gIHZhciBfdGhpcyA9IHRoaXM7XG4gIHZhciByZWR1eCA9IF9hLnJlZHV4LCBtb2RlbHMgPSBfYS5tb2RlbHM7XG4gIHZhciBjb21iaW5lUmVkdWNlcnMyID0gcmVkdXguY29tYmluZVJlZHVjZXJzIHx8IGNvbWJpbmVSZWR1Y2VycztcbiAgdmFyIGNyZWF0ZVN0b3JlMyA9IHJlZHV4LmNyZWF0ZVN0b3JlIHx8IGNyZWF0ZVN0b3JlO1xuICB2YXIgaW5pdGlhbFN0YXRlcyA9IHR5cGVvZiByZWR1eC5pbml0aWFsU3RhdGVzICE9PSBcInVuZGVmaW5lZFwiID8gcmVkdXguaW5pdGlhbFN0YXRlcyA6IHt9O1xuICB0aGlzLnJlZHVjZXJzID0gcmVkdXgucmVkdWNlcnM7XG4gIHRoaXMubWVyZ2VSZWR1Y2VycyA9IGZ1bmN0aW9uKG5leHRSZWR1Y2Vycykge1xuICAgIGlmIChuZXh0UmVkdWNlcnMgPT09IHZvaWQgMCkge1xuICAgICAgbmV4dFJlZHVjZXJzID0ge307XG4gICAgfVxuICAgIF90aGlzLnJlZHVjZXJzID0gX19hc3NpZ24oX19hc3NpZ24oe30sIF90aGlzLnJlZHVjZXJzKSwgbmV4dFJlZHVjZXJzKTtcbiAgICBpZiAoIU9iamVjdC5rZXlzKF90aGlzLnJlZHVjZXJzKS5sZW5ndGgpIHtcbiAgICAgIHJldHVybiBmdW5jdGlvbihzdGF0ZSkge1xuICAgICAgICByZXR1cm4gc3RhdGU7XG4gICAgICB9O1xuICAgIH1cbiAgICByZXR1cm4gY29tYmluZVJlZHVjZXJzMihfdGhpcy5yZWR1Y2Vycyk7XG4gIH07XG4gIHRoaXMuY3JlYXRlTW9kZWxSZWR1Y2VyID0gZnVuY3Rpb24obW9kZWwyKSB7XG4gICAgdmFyIG1vZGVsQmFzZVJlZHVjZXIgPSBtb2RlbDIuYmFzZVJlZHVjZXI7XG4gICAgdmFyIG1vZGVsUmVkdWNlcnMgPSB7fTtcbiAgICBmb3IgKHZhciBfaTIgPSAwLCBfYTIgPSBPYmplY3Qua2V5cyhtb2RlbDIucmVkdWNlcnMgfHwge30pOyBfaTIgPCBfYTIubGVuZ3RoOyBfaTIrKykge1xuICAgICAgdmFyIG1vZGVsUmVkdWNlciA9IF9hMltfaTJdO1xuICAgICAgdmFyIGFjdGlvbiA9IGlzTGlzdGVuZXJfZGVmYXVsdChtb2RlbFJlZHVjZXIpID8gbW9kZWxSZWR1Y2VyIDogbW9kZWwyLm5hbWUgKyBcIi9cIiArIG1vZGVsUmVkdWNlcjtcbiAgICAgIG1vZGVsUmVkdWNlcnNbYWN0aW9uXSA9IG1vZGVsMi5yZWR1Y2Vyc1ttb2RlbFJlZHVjZXJdO1xuICAgIH1cbiAgICB2YXIgY29tYmluZWRSZWR1Y2VyID0gZnVuY3Rpb24oc3RhdGUsIGFjdGlvbjIpIHtcbiAgICAgIGlmIChzdGF0ZSA9PT0gdm9pZCAwKSB7XG4gICAgICAgIHN0YXRlID0gbW9kZWwyLnN0YXRlO1xuICAgICAgfVxuICAgICAgaWYgKHR5cGVvZiBtb2RlbFJlZHVjZXJzW2FjdGlvbjIudHlwZV0gPT09IFwiZnVuY3Rpb25cIikge1xuICAgICAgICByZXR1cm4gbW9kZWxSZWR1Y2Vyc1thY3Rpb24yLnR5cGVdKHN0YXRlLCBhY3Rpb24yLnBheWxvYWQsIGFjdGlvbjIubWV0YSk7XG4gICAgICB9XG4gICAgICByZXR1cm4gc3RhdGU7XG4gICAgfTtcbiAgICBfdGhpcy5yZWR1Y2Vyc1ttb2RlbDIubmFtZV0gPSAhbW9kZWxCYXNlUmVkdWNlciA/IGNvbWJpbmVkUmVkdWNlciA6IGZ1bmN0aW9uKHN0YXRlLCBhY3Rpb24yKSB7XG4gICAgICByZXR1cm4gY29tYmluZWRSZWR1Y2VyKG1vZGVsQmFzZVJlZHVjZXIoc3RhdGUsIGFjdGlvbjIpLCBhY3Rpb24yKTtcbiAgICB9O1xuICB9O1xuICBmb3IgKHZhciBfaSA9IDAsIG1vZGVsc18xID0gbW9kZWxzOyBfaSA8IG1vZGVsc18xLmxlbmd0aDsgX2krKykge1xuICAgIHZhciBtb2RlbCA9IG1vZGVsc18xW19pXTtcbiAgICB0aGlzLmNyZWF0ZU1vZGVsUmVkdWNlcihtb2RlbCk7XG4gIH1cbiAgdGhpcy5jcmVhdGVSb290UmVkdWNlciA9IGZ1bmN0aW9uKHJvb3RSZWR1Y2Vycykge1xuICAgIGlmIChyb290UmVkdWNlcnMgPT09IHZvaWQgMCkge1xuICAgICAgcm9vdFJlZHVjZXJzID0ge307XG4gICAgfVxuICAgIHZhciBtZXJnZWRSZWR1Y2VycyA9IF90aGlzLm1lcmdlUmVkdWNlcnMoKTtcbiAgICBpZiAoT2JqZWN0LmtleXMocm9vdFJlZHVjZXJzKS5sZW5ndGgpIHtcbiAgICAgIHJldHVybiBmdW5jdGlvbihzdGF0ZSwgYWN0aW9uKSB7XG4gICAgICAgIHZhciByb290UmVkdWNlckFjdGlvbiA9IHJvb3RSZWR1Y2Vyc1thY3Rpb24udHlwZV07XG4gICAgICAgIGlmIChyb290UmVkdWNlckFjdGlvbikge1xuICAgICAgICAgIHJldHVybiBtZXJnZWRSZWR1Y2Vycyhyb290UmVkdWNlckFjdGlvbihzdGF0ZSwgYWN0aW9uKSwgYWN0aW9uKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbWVyZ2VkUmVkdWNlcnMoc3RhdGUsIGFjdGlvbik7XG4gICAgICB9O1xuICAgIH1cbiAgICByZXR1cm4gbWVyZ2VkUmVkdWNlcnM7XG4gIH07XG4gIHZhciByb290UmVkdWNlciA9IHRoaXMuY3JlYXRlUm9vdFJlZHVjZXIocmVkdXgucm9vdFJlZHVjZXJzKTtcbiAgdmFyIG1pZGRsZXdhcmVzID0gYXBwbHlNaWRkbGV3YXJlLmFwcGx5KHJlZHV4X2V4cG9ydHMsIHJlZHV4Lm1pZGRsZXdhcmVzKTtcbiAgdmFyIGVuaGFuY2VycyA9IGNvbXBvc2VFbmhhbmNlcnNXaXRoRGV2dG9vbHMocmVkdXguZGV2dG9vbE9wdGlvbnMpLmFwcGx5KHZvaWQgMCwgX19zcHJlYWRBcnJheXMocmVkdXguZW5oYW5jZXJzLCBbbWlkZGxld2FyZXNdKSk7XG4gIHRoaXMuc3RvcmUgPSBjcmVhdGVTdG9yZTMocm9vdFJlZHVjZXIsIGluaXRpYWxTdGF0ZXMsIGVuaGFuY2Vycyk7XG4gIHJldHVybiB0aGlzO1xufVxuXG4vLyBub2RlX21vZHVsZXMvQGljZS9zdG9yZS9lc20vaWNlc3RvcmUuanNcbnZhciBfX2Fzc2lnbjIgPSBmdW5jdGlvbigpIHtcbiAgX19hc3NpZ24yID0gT2JqZWN0LmFzc2lnbiB8fCBmdW5jdGlvbih0Mikge1xuICAgIGZvciAodmFyIHMyLCBpMiA9IDEsIG4yID0gYXJndW1lbnRzLmxlbmd0aDsgaTIgPCBuMjsgaTIrKykge1xuICAgICAgczIgPSBhcmd1bWVudHNbaTJdO1xuICAgICAgZm9yICh2YXIgcDIgaW4gczIpXG4gICAgICAgIGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwoczIsIHAyKSlcbiAgICAgICAgICB0MltwMl0gPSBzMltwMl07XG4gICAgfVxuICAgIHJldHVybiB0MjtcbiAgfTtcbiAgcmV0dXJuIF9fYXNzaWduMi5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xufTtcbnZhciBjb3JlUGx1Z2lucyA9IFtkaXNwYXRjaF9kZWZhdWx0LCBlZmZlY3RzX2RlZmF1bHRdO1xudmFyIEljZXN0b3JlID0gZnVuY3Rpb24oKSB7XG4gIGZ1bmN0aW9uIEljZXN0b3JlMihjb25maWcpIHtcbiAgICB2YXIgX3RoaXMgPSB0aGlzO1xuICAgIHRoaXMucGx1Z2lucyA9IFtdO1xuICAgIHRoaXMuZ2V0TW9kZWxzID0gZnVuY3Rpb24obW9kZWxzKSB7XG4gICAgICByZXR1cm4gT2JqZWN0LmtleXMobW9kZWxzKS5tYXAoZnVuY3Rpb24obmFtZSkge1xuICAgICAgICByZXR1cm4gX19hc3NpZ24yKF9fYXNzaWduMih7IG5hbWUgfSwgbW9kZWxzW25hbWVdKSwgeyByZWR1Y2VyczogbW9kZWxzW25hbWVdLnJlZHVjZXJzIHx8IHt9IH0pO1xuICAgICAgfSk7XG4gICAgfTtcbiAgICB0aGlzLmNvbmZpZyA9IGNvbmZpZztcbiAgICB0aGlzLnBsdWdpbkZhY3RvcnkgPSBwbHVnaW5GYWN0b3J5X2RlZmF1bHQoY29uZmlnKTtcbiAgICBmb3IgKHZhciBfaSA9IDAsIF9hID0gY29yZVBsdWdpbnMuY29uY2F0KHRoaXMuY29uZmlnLnBsdWdpbnMpOyBfaSA8IF9hLmxlbmd0aDsgX2krKykge1xuICAgICAgdmFyIHBsdWdpbiA9IF9hW19pXTtcbiAgICAgIHRoaXMucGx1Z2lucy5wdXNoKHRoaXMucGx1Z2luRmFjdG9yeS5jcmVhdGUocGx1Z2luKSk7XG4gICAgfVxuICAgIHRoaXMuZm9yRWFjaFBsdWdpbihcIm1pZGRsZXdhcmVcIiwgZnVuY3Rpb24obWlkZGxld2FyZSkge1xuICAgICAgX3RoaXMuY29uZmlnLnJlZHV4Lm1pZGRsZXdhcmVzLnB1c2gobWlkZGxld2FyZSk7XG4gICAgfSk7XG4gIH1cbiAgSWNlc3RvcmUyLnByb3RvdHlwZS5mb3JFYWNoUGx1Z2luID0gZnVuY3Rpb24obWV0aG9kLCBmbjIpIHtcbiAgICBmb3IgKHZhciBfaSA9IDAsIF9hID0gdGhpcy5wbHVnaW5zOyBfaSA8IF9hLmxlbmd0aDsgX2krKykge1xuICAgICAgdmFyIHBsdWdpbiA9IF9hW19pXTtcbiAgICAgIGlmIChwbHVnaW5bbWV0aG9kXSkge1xuICAgICAgICBmbjIocGx1Z2luW21ldGhvZF0pO1xuICAgICAgfVxuICAgIH1cbiAgfTtcbiAgSWNlc3RvcmUyLnByb3RvdHlwZS5hZGRNb2RlbCA9IGZ1bmN0aW9uKG1vZGVsKSB7XG4gICAgdmFsaWRhdGVfZGVmYXVsdChbXG4gICAgICBbIW1vZGVsLCBcIm1vZGVsIGNvbmZpZyBpcyByZXF1aXJlZFwiXSxcbiAgICAgIFt0eXBlb2YgbW9kZWwubmFtZSAhPT0gXCJzdHJpbmdcIiwgJ21vZGVsIFwibmFtZVwiIFtzdHJpbmddIGlzIHJlcXVpcmVkJ10sXG4gICAgICBbXG4gICAgICAgIG1vZGVsLnN0YXRlID09PSB2b2lkIDAgJiYgbW9kZWwuYmFzZVJlZHVjZXIgPT09IHZvaWQgMCxcbiAgICAgICAgXCJtb2RlbChcIiArIG1vZGVsLm5hbWUgKyAnKSBcInN0YXRlXCIgaXMgcmVxdWlyZWQnXG4gICAgICBdLFxuICAgICAgW1xuICAgICAgICBtb2RlbC5iYXNlUmVkdWNlciAhPT0gdm9pZCAwICYmIHR5cGVvZiBtb2RlbC5iYXNlUmVkdWNlciAhPT0gXCJmdW5jdGlvblwiLFxuICAgICAgICBcIm1vZGVsKFwiICsgbW9kZWwubmFtZSArICcpIFwiYmFzZVJlZHVjZXJcIiBtdXN0IGJlIGEgZnVuY3Rpb24nXG4gICAgICBdXG4gICAgXSk7XG4gICAgdGhpcy5mb3JFYWNoUGx1Z2luKFwib25Nb2RlbFwiLCBmdW5jdGlvbihvbk1vZGVsKSB7XG4gICAgICByZXR1cm4gb25Nb2RlbChtb2RlbCk7XG4gICAgfSk7XG4gIH07XG4gIEljZXN0b3JlMi5wcm90b3R5cGUuaW5pdCA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciBfdGhpcyA9IHRoaXM7XG4gICAgdGhpcy5tb2RlbHMgPSB0aGlzLmdldE1vZGVscyh0aGlzLmNvbmZpZy5tb2RlbHMpO1xuICAgIGZvciAodmFyIF9pID0gMCwgX2EgPSB0aGlzLm1vZGVsczsgX2kgPCBfYS5sZW5ndGg7IF9pKyspIHtcbiAgICAgIHZhciBtb2RlbCA9IF9hW19pXTtcbiAgICAgIHRoaXMuYWRkTW9kZWwobW9kZWwpO1xuICAgIH1cbiAgICB2YXIgcmVkdXggPSByZWR1eF9kZWZhdWx0LmNhbGwodGhpcywge1xuICAgICAgcmVkdXg6IHRoaXMuY29uZmlnLnJlZHV4LFxuICAgICAgbW9kZWxzOiB0aGlzLm1vZGVsc1xuICAgIH0pO1xuICAgIHZhciBpY2VzdG9yZSA9IF9fYXNzaWduMihfX2Fzc2lnbjIoeyBuYW1lOiB0aGlzLmNvbmZpZy5uYW1lIH0sIHJlZHV4LnN0b3JlKSwge1xuICAgICAgbW9kZWw6IGZ1bmN0aW9uKG1vZGVsMikge1xuICAgICAgICBfdGhpcy5hZGRNb2RlbChtb2RlbDIpO1xuICAgICAgICByZWR1eC5tZXJnZVJlZHVjZXJzKHJlZHV4LmNyZWF0ZU1vZGVsUmVkdWNlcihtb2RlbDIpKTtcbiAgICAgICAgcmVkdXguc3RvcmUucmVwbGFjZVJlZHVjZXIocmVkdXguY3JlYXRlUm9vdFJlZHVjZXIoX3RoaXMuY29uZmlnLnJlZHV4LnJvb3RSZWR1Y2VycykpO1xuICAgICAgICByZWR1eC5zdG9yZS5kaXNwYXRjaCh7IHR5cGU6IFwiQEByZWR1eC9SRVBMQUNFIFwiIH0pO1xuICAgICAgfVxuICAgIH0pO1xuICAgIHRoaXMuZm9yRWFjaFBsdWdpbihcIm9uU3RvcmVDcmVhdGVkXCIsIGZ1bmN0aW9uKG9uU3RvcmVDcmVhdGVkKSB7XG4gICAgICB2YXIgcmV0dXJuZWQgPSBvblN0b3JlQ3JlYXRlZChpY2VzdG9yZSk7XG4gICAgICBpZiAocmV0dXJuZWQpIHtcbiAgICAgICAgT2JqZWN0LmtleXMocmV0dXJuZWQgfHwge30pLmZvckVhY2goZnVuY3Rpb24oa2V5KSB7XG4gICAgICAgICAgaWNlc3RvcmVba2V5XSA9IHJldHVybmVkW2tleV07XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH0pO1xuICAgIHJldHVybiBpY2VzdG9yZTtcbiAgfTtcbiAgcmV0dXJuIEljZXN0b3JlMjtcbn0oKTtcblxuLy8gbm9kZV9tb2R1bGVzL0BpY2Uvc3RvcmUvZXNtL3BsdWdpbnMvcHJvdmlkZXIuanNcbmltcG9ydCBSZWFjdDQgZnJvbSBcInJlYWN0XCI7XG5cbi8vIG5vZGVfbW9kdWxlcy9yZWFjdC1yZWR1eC9lcy9jb21wb25lbnRzL1Byb3ZpZGVyLmpzXG52YXIgaW1wb3J0X3Byb3BfdHlwZXMgPSBfX3RvRVNNKHJlcXVpcmVfcHJvcF90eXBlcygpKTtcbmltcG9ydCBSZWFjdDIsIHsgdXNlTWVtbyB9IGZyb20gXCJyZWFjdFwiO1xuXG4vLyBub2RlX21vZHVsZXMvcmVhY3QtcmVkdXgvZXMvY29tcG9uZW50cy9Db250ZXh0LmpzXG5pbXBvcnQgUmVhY3QgZnJvbSBcInJlYWN0XCI7XG52YXIgUmVhY3RSZWR1eENvbnRleHQgPSAvKiBAX19QVVJFX18gKi8gUmVhY3QuY3JlYXRlQ29udGV4dChudWxsKTtcbmlmICh0cnVlKSB7XG4gIFJlYWN0UmVkdXhDb250ZXh0LmRpc3BsYXlOYW1lID0gXCJSZWFjdFJlZHV4XCI7XG59XG5cbi8vIG5vZGVfbW9kdWxlcy9yZWFjdC1yZWR1eC9lcy91dGlscy9iYXRjaC5qc1xuZnVuY3Rpb24gZGVmYXVsdE5vb3BCYXRjaChjYWxsYmFjaykge1xuICBjYWxsYmFjaygpO1xufVxudmFyIGJhdGNoID0gZGVmYXVsdE5vb3BCYXRjaDtcbnZhciBzZXRCYXRjaCA9IGZ1bmN0aW9uIHNldEJhdGNoMihuZXdCYXRjaCkge1xuICByZXR1cm4gYmF0Y2ggPSBuZXdCYXRjaDtcbn07XG52YXIgZ2V0QmF0Y2ggPSBmdW5jdGlvbiBnZXRCYXRjaDIoKSB7XG4gIHJldHVybiBiYXRjaDtcbn07XG5cbi8vIG5vZGVfbW9kdWxlcy9yZWFjdC1yZWR1eC9lcy91dGlscy9TdWJzY3JpcHRpb24uanNcbmZ1bmN0aW9uIGNyZWF0ZUxpc3RlbmVyQ29sbGVjdGlvbigpIHtcbiAgdmFyIGJhdGNoMiA9IGdldEJhdGNoKCk7XG4gIHZhciBmaXJzdCA9IG51bGw7XG4gIHZhciBsYXN0ID0gbnVsbDtcbiAgcmV0dXJuIHtcbiAgICBjbGVhcjogZnVuY3Rpb24gY2xlYXIoKSB7XG4gICAgICBmaXJzdCA9IG51bGw7XG4gICAgICBsYXN0ID0gbnVsbDtcbiAgICB9LFxuICAgIG5vdGlmeTogZnVuY3Rpb24gbm90aWZ5MigpIHtcbiAgICAgIGJhdGNoMihmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIGxpc3RlbmVyID0gZmlyc3Q7XG4gICAgICAgIHdoaWxlIChsaXN0ZW5lcikge1xuICAgICAgICAgIGxpc3RlbmVyLmNhbGxiYWNrKCk7XG4gICAgICAgICAgbGlzdGVuZXIgPSBsaXN0ZW5lci5uZXh0O1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9LFxuICAgIGdldDogZnVuY3Rpb24gZ2V0MigpIHtcbiAgICAgIHZhciBsaXN0ZW5lcnMgPSBbXTtcbiAgICAgIHZhciBsaXN0ZW5lciA9IGZpcnN0O1xuICAgICAgd2hpbGUgKGxpc3RlbmVyKSB7XG4gICAgICAgIGxpc3RlbmVycy5wdXNoKGxpc3RlbmVyKTtcbiAgICAgICAgbGlzdGVuZXIgPSBsaXN0ZW5lci5uZXh0O1xuICAgICAgfVxuICAgICAgcmV0dXJuIGxpc3RlbmVycztcbiAgICB9LFxuICAgIHN1YnNjcmliZTogZnVuY3Rpb24gc3Vic2NyaWJlKGNhbGxiYWNrKSB7XG4gICAgICB2YXIgaXNTdWJzY3JpYmVkID0gdHJ1ZTtcbiAgICAgIHZhciBsaXN0ZW5lciA9IGxhc3QgPSB7XG4gICAgICAgIGNhbGxiYWNrLFxuICAgICAgICBuZXh0OiBudWxsLFxuICAgICAgICBwcmV2OiBsYXN0XG4gICAgICB9O1xuICAgICAgaWYgKGxpc3RlbmVyLnByZXYpIHtcbiAgICAgICAgbGlzdGVuZXIucHJldi5uZXh0ID0gbGlzdGVuZXI7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBmaXJzdCA9IGxpc3RlbmVyO1xuICAgICAgfVxuICAgICAgcmV0dXJuIGZ1bmN0aW9uIHVuc3Vic2NyaWJlKCkge1xuICAgICAgICBpZiAoIWlzU3Vic2NyaWJlZCB8fCBmaXJzdCA9PT0gbnVsbClcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIGlzU3Vic2NyaWJlZCA9IGZhbHNlO1xuICAgICAgICBpZiAobGlzdGVuZXIubmV4dCkge1xuICAgICAgICAgIGxpc3RlbmVyLm5leHQucHJldiA9IGxpc3RlbmVyLnByZXY7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgbGFzdCA9IGxpc3RlbmVyLnByZXY7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGxpc3RlbmVyLnByZXYpIHtcbiAgICAgICAgICBsaXN0ZW5lci5wcmV2Lm5leHQgPSBsaXN0ZW5lci5uZXh0O1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGZpcnN0ID0gbGlzdGVuZXIubmV4dDtcbiAgICAgICAgfVxuICAgICAgfTtcbiAgICB9XG4gIH07XG59XG52YXIgbnVsbExpc3RlbmVycyA9IHtcbiAgbm90aWZ5OiBmdW5jdGlvbiBub3RpZnkoKSB7XG4gIH0sXG4gIGdldDogZnVuY3Rpb24gZ2V0KCkge1xuICAgIHJldHVybiBbXTtcbiAgfVxufTtcbmZ1bmN0aW9uIGNyZWF0ZVN1YnNjcmlwdGlvbihzdG9yZSwgcGFyZW50U3ViKSB7XG4gIHZhciB1bnN1YnNjcmliZTtcbiAgdmFyIGxpc3RlbmVycyA9IG51bGxMaXN0ZW5lcnM7XG4gIGZ1bmN0aW9uIGFkZE5lc3RlZFN1YihsaXN0ZW5lcikge1xuICAgIHRyeVN1YnNjcmliZSgpO1xuICAgIHJldHVybiBsaXN0ZW5lcnMuc3Vic2NyaWJlKGxpc3RlbmVyKTtcbiAgfVxuICBmdW5jdGlvbiBub3RpZnlOZXN0ZWRTdWJzKCkge1xuICAgIGxpc3RlbmVycy5ub3RpZnkoKTtcbiAgfVxuICBmdW5jdGlvbiBoYW5kbGVDaGFuZ2VXcmFwcGVyKCkge1xuICAgIGlmIChzdWJzY3JpcHRpb24ub25TdGF0ZUNoYW5nZSkge1xuICAgICAgc3Vic2NyaXB0aW9uLm9uU3RhdGVDaGFuZ2UoKTtcbiAgICB9XG4gIH1cbiAgZnVuY3Rpb24gaXNTdWJzY3JpYmVkKCkge1xuICAgIHJldHVybiBCb29sZWFuKHVuc3Vic2NyaWJlKTtcbiAgfVxuICBmdW5jdGlvbiB0cnlTdWJzY3JpYmUoKSB7XG4gICAgaWYgKCF1bnN1YnNjcmliZSkge1xuICAgICAgdW5zdWJzY3JpYmUgPSBwYXJlbnRTdWIgPyBwYXJlbnRTdWIuYWRkTmVzdGVkU3ViKGhhbmRsZUNoYW5nZVdyYXBwZXIpIDogc3RvcmUuc3Vic2NyaWJlKGhhbmRsZUNoYW5nZVdyYXBwZXIpO1xuICAgICAgbGlzdGVuZXJzID0gY3JlYXRlTGlzdGVuZXJDb2xsZWN0aW9uKCk7XG4gICAgfVxuICB9XG4gIGZ1bmN0aW9uIHRyeVVuc3Vic2NyaWJlKCkge1xuICAgIGlmICh1bnN1YnNjcmliZSkge1xuICAgICAgdW5zdWJzY3JpYmUoKTtcbiAgICAgIHVuc3Vic2NyaWJlID0gdm9pZCAwO1xuICAgICAgbGlzdGVuZXJzLmNsZWFyKCk7XG4gICAgICBsaXN0ZW5lcnMgPSBudWxsTGlzdGVuZXJzO1xuICAgIH1cbiAgfVxuICB2YXIgc3Vic2NyaXB0aW9uID0ge1xuICAgIGFkZE5lc3RlZFN1YixcbiAgICBub3RpZnlOZXN0ZWRTdWJzLFxuICAgIGhhbmRsZUNoYW5nZVdyYXBwZXIsXG4gICAgaXNTdWJzY3JpYmVkLFxuICAgIHRyeVN1YnNjcmliZSxcbiAgICB0cnlVbnN1YnNjcmliZSxcbiAgICBnZXRMaXN0ZW5lcnM6IGZ1bmN0aW9uIGdldExpc3RlbmVycygpIHtcbiAgICAgIHJldHVybiBsaXN0ZW5lcnM7XG4gICAgfVxuICB9O1xuICByZXR1cm4gc3Vic2NyaXB0aW9uO1xufVxuXG4vLyBub2RlX21vZHVsZXMvcmVhY3QtcmVkdXgvZXMvdXRpbHMvdXNlSXNvbW9ycGhpY0xheW91dEVmZmVjdC5qc1xuaW1wb3J0IHsgdXNlRWZmZWN0LCB1c2VMYXlvdXRFZmZlY3QgfSBmcm9tIFwicmVhY3RcIjtcbnZhciB1c2VJc29tb3JwaGljTGF5b3V0RWZmZWN0ID0gdHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIiAmJiB0eXBlb2Ygd2luZG93LmRvY3VtZW50ICE9PSBcInVuZGVmaW5lZFwiICYmIHR5cGVvZiB3aW5kb3cuZG9jdW1lbnQuY3JlYXRlRWxlbWVudCAhPT0gXCJ1bmRlZmluZWRcIiA/IHVzZUxheW91dEVmZmVjdCA6IHVzZUVmZmVjdDtcblxuLy8gbm9kZV9tb2R1bGVzL3JlYWN0LXJlZHV4L2VzL2NvbXBvbmVudHMvUHJvdmlkZXIuanNcbmZ1bmN0aW9uIFByb3ZpZGVyKF9yZWYpIHtcbiAgdmFyIHN0b3JlID0gX3JlZi5zdG9yZSwgY29udGV4dCA9IF9yZWYuY29udGV4dCwgY2hpbGRyZW4gPSBfcmVmLmNoaWxkcmVuO1xuICB2YXIgY29udGV4dFZhbHVlID0gdXNlTWVtbyhmdW5jdGlvbigpIHtcbiAgICB2YXIgc3Vic2NyaXB0aW9uID0gY3JlYXRlU3Vic2NyaXB0aW9uKHN0b3JlKTtcbiAgICByZXR1cm4ge1xuICAgICAgc3RvcmUsXG4gICAgICBzdWJzY3JpcHRpb25cbiAgICB9O1xuICB9LCBbc3RvcmVdKTtcbiAgdmFyIHByZXZpb3VzU3RhdGUgPSB1c2VNZW1vKGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiBzdG9yZS5nZXRTdGF0ZSgpO1xuICB9LCBbc3RvcmVdKTtcbiAgdXNlSXNvbW9ycGhpY0xheW91dEVmZmVjdChmdW5jdGlvbigpIHtcbiAgICB2YXIgc3Vic2NyaXB0aW9uID0gY29udGV4dFZhbHVlLnN1YnNjcmlwdGlvbjtcbiAgICBzdWJzY3JpcHRpb24ub25TdGF0ZUNoYW5nZSA9IHN1YnNjcmlwdGlvbi5ub3RpZnlOZXN0ZWRTdWJzO1xuICAgIHN1YnNjcmlwdGlvbi50cnlTdWJzY3JpYmUoKTtcbiAgICBpZiAocHJldmlvdXNTdGF0ZSAhPT0gc3RvcmUuZ2V0U3RhdGUoKSkge1xuICAgICAgc3Vic2NyaXB0aW9uLm5vdGlmeU5lc3RlZFN1YnMoKTtcbiAgICB9XG4gICAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgICAgc3Vic2NyaXB0aW9uLnRyeVVuc3Vic2NyaWJlKCk7XG4gICAgICBzdWJzY3JpcHRpb24ub25TdGF0ZUNoYW5nZSA9IG51bGw7XG4gICAgfTtcbiAgfSwgW2NvbnRleHRWYWx1ZSwgcHJldmlvdXNTdGF0ZV0pO1xuICB2YXIgQ29udGV4dDIgPSBjb250ZXh0IHx8IFJlYWN0UmVkdXhDb250ZXh0O1xuICByZXR1cm4gLyogQF9fUFVSRV9fICovIFJlYWN0Mi5jcmVhdGVFbGVtZW50KENvbnRleHQyLlByb3ZpZGVyLCB7XG4gICAgdmFsdWU6IGNvbnRleHRWYWx1ZVxuICB9LCBjaGlsZHJlbik7XG59XG5pZiAodHJ1ZSkge1xuICBQcm92aWRlci5wcm9wVHlwZXMgPSB7XG4gICAgc3RvcmU6IGltcG9ydF9wcm9wX3R5cGVzLmRlZmF1bHQuc2hhcGUoe1xuICAgICAgc3Vic2NyaWJlOiBpbXBvcnRfcHJvcF90eXBlcy5kZWZhdWx0LmZ1bmMuaXNSZXF1aXJlZCxcbiAgICAgIGRpc3BhdGNoOiBpbXBvcnRfcHJvcF90eXBlcy5kZWZhdWx0LmZ1bmMuaXNSZXF1aXJlZCxcbiAgICAgIGdldFN0YXRlOiBpbXBvcnRfcHJvcF90eXBlcy5kZWZhdWx0LmZ1bmMuaXNSZXF1aXJlZFxuICAgIH0pLFxuICAgIGNvbnRleHQ6IGltcG9ydF9wcm9wX3R5cGVzLmRlZmF1bHQub2JqZWN0LFxuICAgIGNoaWxkcmVuOiBpbXBvcnRfcHJvcF90eXBlcy5kZWZhdWx0LmFueVxuICB9O1xufVxuXG4vLyBub2RlX21vZHVsZXMvcmVhY3QtcmVkdXgvZXMvY29tcG9uZW50cy9jb25uZWN0QWR2YW5jZWQuanNcbnZhciBpbXBvcnRfaG9pc3Rfbm9uX3JlYWN0X3N0YXRpY3MgPSBfX3RvRVNNKHJlcXVpcmVfaG9pc3Rfbm9uX3JlYWN0X3N0YXRpY3NfY2pzKCkpO1xudmFyIGltcG9ydF9yZWFjdF9pcyA9IF9fdG9FU00ocmVxdWlyZV9yZWFjdF9pczIoKSk7XG5pbXBvcnQgUmVhY3QzLCB7IHVzZUNvbnRleHQsIHVzZU1lbW8gYXMgdXNlTWVtbzIsIHVzZVJlZiwgdXNlUmVkdWNlciB9IGZyb20gXCJyZWFjdFwiO1xuXG4vLyBub2RlX21vZHVsZXMvcmVhY3QtcmVkdXgvZXMvaG9va3MvdXNlU3RvcmUuanNcbmltcG9ydCB7IHVzZUNvbnRleHQgYXMgdXNlQ29udGV4dDMgfSBmcm9tIFwicmVhY3RcIjtcblxuLy8gbm9kZV9tb2R1bGVzL3JlYWN0LXJlZHV4L2VzL2hvb2tzL3VzZVJlZHV4Q29udGV4dC5qc1xuaW1wb3J0IHsgdXNlQ29udGV4dCBhcyB1c2VDb250ZXh0MiB9IGZyb20gXCJyZWFjdFwiO1xuXG4vLyBub2RlX21vZHVsZXMvcmVhY3QtcmVkdXgvZXMvaG9va3MvdXNlU2VsZWN0b3IuanNcbmltcG9ydCB7IHVzZVJlZHVjZXIgYXMgdXNlUmVkdWNlcjIsIHVzZVJlZiBhcyB1c2VSZWYyLCB1c2VNZW1vIGFzIHVzZU1lbW8zLCB1c2VDb250ZXh0IGFzIHVzZUNvbnRleHQ0LCB1c2VEZWJ1Z1ZhbHVlIH0gZnJvbSBcInJlYWN0XCI7XG5cbi8vIG5vZGVfbW9kdWxlcy9yZWFjdC1yZWR1eC9lcy91dGlscy9yZWFjdEJhdGNoZWRVcGRhdGVzLmpzXG5pbXBvcnQgeyB1bnN0YWJsZV9iYXRjaGVkVXBkYXRlcyB9IGZyb20gXCJyZWFjdC1kb21cIjtcblxuLy8gbm9kZV9tb2R1bGVzL3JlYWN0LXJlZHV4L2VzL2luZGV4LmpzXG5zZXRCYXRjaCh1bnN0YWJsZV9iYXRjaGVkVXBkYXRlcyk7XG5cbi8vIG5vZGVfbW9kdWxlcy9AaWNlL3N0b3JlL2VzbS9hY3Rpb25UeXBlcy5qc1xudmFyIHJhbmRvbVN0cmluZzMgPSBmdW5jdGlvbigpIHtcbiAgcmV0dXJuIE1hdGgucmFuZG9tKCkudG9TdHJpbmcoMzYpLnN1YnN0cmluZyg3KS5zcGxpdChcIlwiKS5qb2luKFwiLlwiKTtcbn07XG52YXIgQWN0aW9uVHlwZXMyID0ge1xuICBTRVRfU1RBVEU6IFwiQEBpY2VzdG9yZV9TRVRfU1RBVEVcIiArIHJhbmRvbVN0cmluZzMoKVxufTtcbnZhciBhY3Rpb25UeXBlc19kZWZhdWx0ID0gQWN0aW9uVHlwZXMyO1xuXG4vLyBub2RlX21vZHVsZXMvQGljZS9zdG9yZS9lc20vcGx1Z2lucy9wcm92aWRlci5qc1xudmFyIFNFVF9TVEFURSA9IGFjdGlvblR5cGVzX2RlZmF1bHQuU0VUX1NUQVRFO1xuXG4vLyBub2RlX21vZHVsZXMvQGljZS9zdG9yZS9lc20vcGx1Z2lucy9tb2RlbEFwaXMuanNcbmltcG9ydCBSZWFjdDUgZnJvbSBcInJlYWN0XCI7XG5cbi8vIG5vZGVfbW9kdWxlcy9pbW1lci9kaXN0L2ltbWVyLmVzbS5tanNcbmZ1bmN0aW9uIG4objIpIHtcbiAgZm9yICh2YXIgcjIgPSBhcmd1bWVudHMubGVuZ3RoLCB0MiA9IEFycmF5KHIyID4gMSA/IHIyIC0gMSA6IDApLCBlID0gMTsgZSA8IHIyOyBlKyspXG4gICAgdDJbZSAtIDFdID0gYXJndW1lbnRzW2VdO1xuICBpZiAodHJ1ZSkge1xuICAgIHZhciBpMiA9IFlbbjJdLCBvMiA9IGkyID8gXCJmdW5jdGlvblwiID09IHR5cGVvZiBpMiA/IGkyLmFwcGx5KG51bGwsIHQyKSA6IGkyIDogXCJ1bmtub3duIGVycm9yIG5yOiBcIiArIG4yO1xuICAgIHRocm93IEVycm9yKFwiW0ltbWVyXSBcIiArIG8yKTtcbiAgfVxuICB0aHJvdyBFcnJvcihcIltJbW1lcl0gbWluaWZpZWQgZXJyb3IgbnI6IFwiICsgbjIgKyAodDIubGVuZ3RoID8gXCIgXCIgKyB0Mi5tYXAoZnVuY3Rpb24objMpIHtcbiAgICByZXR1cm4gXCInXCIgKyBuMyArIFwiJ1wiO1xuICB9KS5qb2luKFwiLFwiKSA6IFwiXCIpICsgXCIuIEZpbmQgdGhlIGZ1bGwgZXJyb3IgYXQ6IGh0dHBzOi8vYml0Lmx5LzNjWEVLV2ZcIik7XG59XG5mdW5jdGlvbiByKG4yKSB7XG4gIHJldHVybiAhIW4yICYmICEhbjJbUV07XG59XG5mdW5jdGlvbiB0KG4yKSB7XG4gIHZhciByMjtcbiAgcmV0dXJuICEhbjIgJiYgKGZ1bmN0aW9uKG4zKSB7XG4gICAgaWYgKCFuMyB8fCBcIm9iamVjdFwiICE9IHR5cGVvZiBuMylcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB2YXIgcjMgPSBPYmplY3QuZ2V0UHJvdG90eXBlT2YobjMpO1xuICAgIGlmIChudWxsID09PSByMylcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIHZhciB0MiA9IE9iamVjdC5oYXNPd25Qcm9wZXJ0eS5jYWxsKHIzLCBcImNvbnN0cnVjdG9yXCIpICYmIHIzLmNvbnN0cnVjdG9yO1xuICAgIHJldHVybiB0MiA9PT0gT2JqZWN0IHx8IFwiZnVuY3Rpb25cIiA9PSB0eXBlb2YgdDIgJiYgRnVuY3Rpb24udG9TdHJpbmcuY2FsbCh0MikgPT09IFo7XG4gIH0objIpIHx8IEFycmF5LmlzQXJyYXkobjIpIHx8ICEhbjJbTF0gfHwgISEobnVsbCA9PT0gKHIyID0gbjIuY29uc3RydWN0b3IpIHx8IHZvaWQgMCA9PT0gcjIgPyB2b2lkIDAgOiByMltMXSkgfHwgcyhuMikgfHwgdihuMikpO1xufVxuZnVuY3Rpb24gaShuMiwgcjIsIHQyKSB7XG4gIHZvaWQgMCA9PT0gdDIgJiYgKHQyID0gZmFsc2UpLCAwID09PSBvKG4yKSA/ICh0MiA/IE9iamVjdC5rZXlzIDogbm4pKG4yKS5mb3JFYWNoKGZ1bmN0aW9uKGUpIHtcbiAgICB0MiAmJiBcInN5bWJvbFwiID09IHR5cGVvZiBlIHx8IHIyKGUsIG4yW2VdLCBuMik7XG4gIH0pIDogbjIuZm9yRWFjaChmdW5jdGlvbih0MywgZSkge1xuICAgIHJldHVybiByMihlLCB0MywgbjIpO1xuICB9KTtcbn1cbmZ1bmN0aW9uIG8objIpIHtcbiAgdmFyIHIyID0gbjJbUV07XG4gIHJldHVybiByMiA/IHIyLmkgPiAzID8gcjIuaSAtIDQgOiByMi5pIDogQXJyYXkuaXNBcnJheShuMikgPyAxIDogcyhuMikgPyAyIDogdihuMikgPyAzIDogMDtcbn1cbmZ1bmN0aW9uIHUobjIsIHIyKSB7XG4gIHJldHVybiAyID09PSBvKG4yKSA/IG4yLmhhcyhyMikgOiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwobjIsIHIyKTtcbn1cbmZ1bmN0aW9uIGEobjIsIHIyKSB7XG4gIHJldHVybiAyID09PSBvKG4yKSA/IG4yLmdldChyMikgOiBuMltyMl07XG59XG5mdW5jdGlvbiBmKG4yLCByMiwgdDIpIHtcbiAgdmFyIGUgPSBvKG4yKTtcbiAgMiA9PT0gZSA/IG4yLnNldChyMiwgdDIpIDogMyA9PT0gZSA/IChuMi5kZWxldGUocjIpLCBuMi5hZGQodDIpKSA6IG4yW3IyXSA9IHQyO1xufVxuZnVuY3Rpb24gYyhuMiwgcjIpIHtcbiAgcmV0dXJuIG4yID09PSByMiA/IDAgIT09IG4yIHx8IDEgLyBuMiA9PSAxIC8gcjIgOiBuMiAhPSBuMiAmJiByMiAhPSByMjtcbn1cbmZ1bmN0aW9uIHMobjIpIHtcbiAgcmV0dXJuIFggJiYgbjIgaW5zdGFuY2VvZiBNYXA7XG59XG5mdW5jdGlvbiB2KG4yKSB7XG4gIHJldHVybiBxICYmIG4yIGluc3RhbmNlb2YgU2V0O1xufVxuZnVuY3Rpb24gcChuMikge1xuICByZXR1cm4gbjIubyB8fCBuMi50O1xufVxuZnVuY3Rpb24gbChuMikge1xuICBpZiAoQXJyYXkuaXNBcnJheShuMikpXG4gICAgcmV0dXJuIEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKG4yKTtcbiAgdmFyIHIyID0gcm4objIpO1xuICBkZWxldGUgcjJbUV07XG4gIGZvciAodmFyIHQyID0gbm4ocjIpLCBlID0gMDsgZSA8IHQyLmxlbmd0aDsgZSsrKSB7XG4gICAgdmFyIGkyID0gdDJbZV0sIG8yID0gcjJbaTJdO1xuICAgIGZhbHNlID09PSBvMi53cml0YWJsZSAmJiAobzIud3JpdGFibGUgPSB0cnVlLCBvMi5jb25maWd1cmFibGUgPSB0cnVlKSwgKG8yLmdldCB8fCBvMi5zZXQpICYmIChyMltpMl0gPSB7IGNvbmZpZ3VyYWJsZTogdHJ1ZSwgd3JpdGFibGU6IHRydWUsIGVudW1lcmFibGU6IG8yLmVudW1lcmFibGUsIHZhbHVlOiBuMltpMl0gfSk7XG4gIH1cbiAgcmV0dXJuIE9iamVjdC5jcmVhdGUoT2JqZWN0LmdldFByb3RvdHlwZU9mKG4yKSwgcjIpO1xufVxuZnVuY3Rpb24gZChuMiwgZSkge1xuICByZXR1cm4gdm9pZCAwID09PSBlICYmIChlID0gZmFsc2UpLCB5KG4yKSB8fCByKG4yKSB8fCAhdChuMikgPyBuMiA6IChvKG4yKSA+IDEgJiYgKG4yLnNldCA9IG4yLmFkZCA9IG4yLmNsZWFyID0gbjIuZGVsZXRlID0gaCksIE9iamVjdC5mcmVlemUobjIpLCBlICYmIGkobjIsIGZ1bmN0aW9uKG4zLCByMikge1xuICAgIHJldHVybiBkKHIyLCB0cnVlKTtcbiAgfSwgdHJ1ZSksIG4yKTtcbn1cbmZ1bmN0aW9uIGgoKSB7XG4gIG4oMik7XG59XG5mdW5jdGlvbiB5KG4yKSB7XG4gIHJldHVybiBudWxsID09IG4yIHx8IFwib2JqZWN0XCIgIT0gdHlwZW9mIG4yIHx8IE9iamVjdC5pc0Zyb3plbihuMik7XG59XG5mdW5jdGlvbiBiKHIyKSB7XG4gIHZhciB0MiA9IHRuW3IyXTtcbiAgcmV0dXJuIHQyIHx8IG4oMTgsIHIyKSwgdDI7XG59XG5mdW5jdGlvbiBtKG4yLCByMikge1xuICB0bltuMl0gfHwgKHRuW24yXSA9IHIyKTtcbn1cbmZ1bmN0aW9uIF8oKSB7XG4gIHJldHVybiBVIHx8IG4oMCksIFU7XG59XG5mdW5jdGlvbiBqKG4yLCByMikge1xuICByMiAmJiAoYihcIlBhdGNoZXNcIiksIG4yLnUgPSBbXSwgbjIucyA9IFtdLCBuMi52ID0gcjIpO1xufVxuZnVuY3Rpb24gTyhuMikge1xuICBnKG4yKSwgbjIucC5mb3JFYWNoKFMpLCBuMi5wID0gbnVsbDtcbn1cbmZ1bmN0aW9uIGcobjIpIHtcbiAgbjIgPT09IFUgJiYgKFUgPSBuMi5sKTtcbn1cbmZ1bmN0aW9uIHcobjIpIHtcbiAgcmV0dXJuIFUgPSB7IHA6IFtdLCBsOiBVLCBoOiBuMiwgbTogdHJ1ZSwgXzogMCB9O1xufVxuZnVuY3Rpb24gUyhuMikge1xuICB2YXIgcjIgPSBuMltRXTtcbiAgMCA9PT0gcjIuaSB8fCAxID09PSByMi5pID8gcjIuaigpIDogcjIuTyA9IHRydWU7XG59XG5mdW5jdGlvbiBQKHIyLCBlKSB7XG4gIGUuXyA9IGUucC5sZW5ndGg7XG4gIHZhciBpMiA9IGUucFswXSwgbzIgPSB2b2lkIDAgIT09IHIyICYmIHIyICE9PSBpMjtcbiAgcmV0dXJuIGUuaC5nIHx8IGIoXCJFUzVcIikuUyhlLCByMiwgbzIpLCBvMiA/IChpMltRXS5QICYmIChPKGUpLCBuKDQpKSwgdChyMikgJiYgKHIyID0gTShlLCByMiksIGUubCB8fCB4KGUsIHIyKSksIGUudSAmJiBiKFwiUGF0Y2hlc1wiKS5NKGkyW1FdLnQsIHIyLCBlLnUsIGUucykpIDogcjIgPSBNKGUsIGkyLCBbXSksIE8oZSksIGUudSAmJiBlLnYoZS51LCBlLnMpLCByMiAhPT0gSCA/IHIyIDogdm9pZCAwO1xufVxuZnVuY3Rpb24gTShuMiwgcjIsIHQyKSB7XG4gIGlmICh5KHIyKSlcbiAgICByZXR1cm4gcjI7XG4gIHZhciBlID0gcjJbUV07XG4gIGlmICghZSlcbiAgICByZXR1cm4gaShyMiwgZnVuY3Rpb24oaTIsIG8zKSB7XG4gICAgICByZXR1cm4gQShuMiwgZSwgcjIsIGkyLCBvMywgdDIpO1xuICAgIH0sIHRydWUpLCByMjtcbiAgaWYgKGUuQSAhPT0gbjIpXG4gICAgcmV0dXJuIHIyO1xuICBpZiAoIWUuUClcbiAgICByZXR1cm4geChuMiwgZS50LCB0cnVlKSwgZS50O1xuICBpZiAoIWUuSSkge1xuICAgIGUuSSA9IHRydWUsIGUuQS5fLS07XG4gICAgdmFyIG8yID0gNCA9PT0gZS5pIHx8IDUgPT09IGUuaSA/IGUubyA9IGwoZS5rKSA6IGUubztcbiAgICBpKDMgPT09IGUuaSA/IG5ldyBTZXQobzIpIDogbzIsIGZ1bmN0aW9uKHIzLCBpMikge1xuICAgICAgcmV0dXJuIEEobjIsIGUsIG8yLCByMywgaTIsIHQyKTtcbiAgICB9KSwgeChuMiwgbzIsIGZhbHNlKSwgdDIgJiYgbjIudSAmJiBiKFwiUGF0Y2hlc1wiKS5SKGUsIHQyLCBuMi51LCBuMi5zKTtcbiAgfVxuICByZXR1cm4gZS5vO1xufVxuZnVuY3Rpb24gQShlLCBpMiwgbzIsIGEyLCBjMiwgczIpIHtcbiAgaWYgKGMyID09PSBvMiAmJiBuKDUpLCByKGMyKSkge1xuICAgIHZhciB2MiA9IE0oZSwgYzIsIHMyICYmIGkyICYmIDMgIT09IGkyLmkgJiYgIXUoaTIuRCwgYTIpID8gczIuY29uY2F0KGEyKSA6IHZvaWQgMCk7XG4gICAgaWYgKGYobzIsIGEyLCB2MiksICFyKHYyKSlcbiAgICAgIHJldHVybjtcbiAgICBlLm0gPSBmYWxzZTtcbiAgfVxuICBpZiAodChjMikgJiYgIXkoYzIpKSB7XG4gICAgaWYgKCFlLmguRiAmJiBlLl8gPCAxKVxuICAgICAgcmV0dXJuO1xuICAgIE0oZSwgYzIpLCBpMiAmJiBpMi5BLmwgfHwgeChlLCBjMik7XG4gIH1cbn1cbmZ1bmN0aW9uIHgobjIsIHIyLCB0Mikge1xuICB2b2lkIDAgPT09IHQyICYmICh0MiA9IGZhbHNlKSwgbjIuaC5GICYmIG4yLm0gJiYgZChyMiwgdDIpO1xufVxuZnVuY3Rpb24geihuMiwgcjIpIHtcbiAgdmFyIHQyID0gbjJbUV07XG4gIHJldHVybiAodDIgPyBwKHQyKSA6IG4yKVtyMl07XG59XG5mdW5jdGlvbiBJKG4yLCByMikge1xuICBpZiAocjIgaW4gbjIpXG4gICAgZm9yICh2YXIgdDIgPSBPYmplY3QuZ2V0UHJvdG90eXBlT2YobjIpOyB0MjsgKSB7XG4gICAgICB2YXIgZSA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IodDIsIHIyKTtcbiAgICAgIGlmIChlKVxuICAgICAgICByZXR1cm4gZTtcbiAgICAgIHQyID0gT2JqZWN0LmdldFByb3RvdHlwZU9mKHQyKTtcbiAgICB9XG59XG5mdW5jdGlvbiBrKG4yKSB7XG4gIG4yLlAgfHwgKG4yLlAgPSB0cnVlLCBuMi5sICYmIGsobjIubCkpO1xufVxuZnVuY3Rpb24gRShuMikge1xuICBuMi5vIHx8IChuMi5vID0gbChuMi50KSk7XG59XG5mdW5jdGlvbiBSKG4yLCByMiwgdDIpIHtcbiAgdmFyIGUgPSBzKHIyKSA/IGIoXCJNYXBTZXRcIikuTihyMiwgdDIpIDogdihyMikgPyBiKFwiTWFwU2V0XCIpLlQocjIsIHQyKSA6IG4yLmcgPyBmdW5jdGlvbihuMywgcjMpIHtcbiAgICB2YXIgdDMgPSBBcnJheS5pc0FycmF5KG4zKSwgZTIgPSB7IGk6IHQzID8gMSA6IDAsIEE6IHIzID8gcjMuQSA6IF8oKSwgUDogZmFsc2UsIEk6IGZhbHNlLCBEOiB7fSwgbDogcjMsIHQ6IG4zLCBrOiBudWxsLCBvOiBudWxsLCBqOiBudWxsLCBDOiBmYWxzZSB9LCBpMiA9IGUyLCBvMiA9IGVuO1xuICAgIHQzICYmIChpMiA9IFtlMl0sIG8yID0gb24pO1xuICAgIHZhciB1MiA9IFByb3h5LnJldm9jYWJsZShpMiwgbzIpLCBhMiA9IHUyLnJldm9rZSwgZjIgPSB1Mi5wcm94eTtcbiAgICByZXR1cm4gZTIuayA9IGYyLCBlMi5qID0gYTIsIGYyO1xuICB9KHIyLCB0MikgOiBiKFwiRVM1XCIpLkoocjIsIHQyKTtcbiAgcmV0dXJuICh0MiA/IHQyLkEgOiBfKCkpLnAucHVzaChlKSwgZTtcbn1cbmZ1bmN0aW9uIEQoZSkge1xuICByZXR1cm4gcihlKSB8fCBuKDIyLCBlKSwgZnVuY3Rpb24gbjIocjIpIHtcbiAgICBpZiAoIXQocjIpKVxuICAgICAgcmV0dXJuIHIyO1xuICAgIHZhciBlMiwgdTIgPSByMltRXSwgYzIgPSBvKHIyKTtcbiAgICBpZiAodTIpIHtcbiAgICAgIGlmICghdTIuUCAmJiAodTIuaSA8IDQgfHwgIWIoXCJFUzVcIikuSyh1MikpKVxuICAgICAgICByZXR1cm4gdTIudDtcbiAgICAgIHUyLkkgPSB0cnVlLCBlMiA9IEYocjIsIGMyKSwgdTIuSSA9IGZhbHNlO1xuICAgIH0gZWxzZVxuICAgICAgZTIgPSBGKHIyLCBjMik7XG4gICAgcmV0dXJuIGkoZTIsIGZ1bmN0aW9uKHIzLCB0Mikge1xuICAgICAgdTIgJiYgYSh1Mi50LCByMykgPT09IHQyIHx8IGYoZTIsIHIzLCBuMih0MikpO1xuICAgIH0pLCAzID09PSBjMiA/IG5ldyBTZXQoZTIpIDogZTI7XG4gIH0oZSk7XG59XG5mdW5jdGlvbiBGKG4yLCByMikge1xuICBzd2l0Y2ggKHIyKSB7XG4gICAgY2FzZSAyOlxuICAgICAgcmV0dXJuIG5ldyBNYXAobjIpO1xuICAgIGNhc2UgMzpcbiAgICAgIHJldHVybiBBcnJheS5mcm9tKG4yKTtcbiAgfVxuICByZXR1cm4gbChuMik7XG59XG5mdW5jdGlvbiBOKCkge1xuICBmdW5jdGlvbiB0MihuMiwgcjIpIHtcbiAgICB2YXIgdDMgPSBzMltuMl07XG4gICAgcmV0dXJuIHQzID8gdDMuZW51bWVyYWJsZSA9IHIyIDogczJbbjJdID0gdDMgPSB7IGNvbmZpZ3VyYWJsZTogdHJ1ZSwgZW51bWVyYWJsZTogcjIsIGdldDogZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgcjMgPSB0aGlzW1FdO1xuICAgICAgcmV0dXJuIGYyKHIzKSwgZW4uZ2V0KHIzLCBuMik7XG4gICAgfSwgc2V0OiBmdW5jdGlvbihyMykge1xuICAgICAgdmFyIHQ0ID0gdGhpc1tRXTtcbiAgICAgIGYyKHQ0KSwgZW4uc2V0KHQ0LCBuMiwgcjMpO1xuICAgIH0gfSwgdDM7XG4gIH1cbiAgZnVuY3Rpb24gZShuMikge1xuICAgIGZvciAodmFyIHIyID0gbjIubGVuZ3RoIC0gMTsgcjIgPj0gMDsgcjItLSkge1xuICAgICAgdmFyIHQzID0gbjJbcjJdW1FdO1xuICAgICAgaWYgKCF0My5QKVxuICAgICAgICBzd2l0Y2ggKHQzLmkpIHtcbiAgICAgICAgICBjYXNlIDU6XG4gICAgICAgICAgICBhMih0MykgJiYgayh0Myk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICBjYXNlIDQ6XG4gICAgICAgICAgICBvMih0MykgJiYgayh0Myk7XG4gICAgICAgIH1cbiAgICB9XG4gIH1cbiAgZnVuY3Rpb24gbzIobjIpIHtcbiAgICBmb3IgKHZhciByMiA9IG4yLnQsIHQzID0gbjIuaywgZTIgPSBubih0MyksIGkyID0gZTIubGVuZ3RoIC0gMTsgaTIgPj0gMDsgaTItLSkge1xuICAgICAgdmFyIG8zID0gZTJbaTJdO1xuICAgICAgaWYgKG8zICE9PSBRKSB7XG4gICAgICAgIHZhciBhMyA9IHIyW28zXTtcbiAgICAgICAgaWYgKHZvaWQgMCA9PT0gYTMgJiYgIXUocjIsIG8zKSlcbiAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgdmFyIGYzID0gdDNbbzNdLCBzMyA9IGYzICYmIGYzW1FdO1xuICAgICAgICBpZiAoczMgPyBzMy50ICE9PSBhMyA6ICFjKGYzLCBhMykpXG4gICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9XG4gICAgfVxuICAgIHZhciB2MiA9ICEhcjJbUV07XG4gICAgcmV0dXJuIGUyLmxlbmd0aCAhPT0gbm4ocjIpLmxlbmd0aCArICh2MiA/IDAgOiAxKTtcbiAgfVxuICBmdW5jdGlvbiBhMihuMikge1xuICAgIHZhciByMiA9IG4yLms7XG4gICAgaWYgKHIyLmxlbmd0aCAhPT0gbjIudC5sZW5ndGgpXG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB2YXIgdDMgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKHIyLCByMi5sZW5ndGggLSAxKTtcbiAgICBpZiAodDMgJiYgIXQzLmdldClcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIGZvciAodmFyIGUyID0gMDsgZTIgPCByMi5sZW5ndGg7IGUyKyspXG4gICAgICBpZiAoIXIyLmhhc093blByb3BlcnR5KGUyKSlcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG4gIGZ1bmN0aW9uIGYyKHIyKSB7XG4gICAgcjIuTyAmJiBuKDMsIEpTT04uc3RyaW5naWZ5KHAocjIpKSk7XG4gIH1cbiAgdmFyIHMyID0ge307XG4gIG0oXCJFUzVcIiwgeyBKOiBmdW5jdGlvbihuMiwgcjIpIHtcbiAgICB2YXIgZTIgPSBBcnJheS5pc0FycmF5KG4yKSwgaTIgPSBmdW5jdGlvbihuMywgcjMpIHtcbiAgICAgIGlmIChuMykge1xuICAgICAgICBmb3IgKHZhciBlMyA9IEFycmF5KHIzLmxlbmd0aCksIGkzID0gMDsgaTMgPCByMy5sZW5ndGg7IGkzKyspXG4gICAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KGUzLCBcIlwiICsgaTMsIHQyKGkzLCB0cnVlKSk7XG4gICAgICAgIHJldHVybiBlMztcbiAgICAgIH1cbiAgICAgIHZhciBvNCA9IHJuKHIzKTtcbiAgICAgIGRlbGV0ZSBvNFtRXTtcbiAgICAgIGZvciAodmFyIHUyID0gbm4obzQpLCBhMyA9IDA7IGEzIDwgdTIubGVuZ3RoOyBhMysrKSB7XG4gICAgICAgIHZhciBmMyA9IHUyW2EzXTtcbiAgICAgICAgbzRbZjNdID0gdDIoZjMsIG4zIHx8ICEhbzRbZjNdLmVudW1lcmFibGUpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIE9iamVjdC5jcmVhdGUoT2JqZWN0LmdldFByb3RvdHlwZU9mKHIzKSwgbzQpO1xuICAgIH0oZTIsIG4yKSwgbzMgPSB7IGk6IGUyID8gNSA6IDQsIEE6IHIyID8gcjIuQSA6IF8oKSwgUDogZmFsc2UsIEk6IGZhbHNlLCBEOiB7fSwgbDogcjIsIHQ6IG4yLCBrOiBpMiwgbzogbnVsbCwgTzogZmFsc2UsIEM6IGZhbHNlIH07XG4gICAgcmV0dXJuIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShpMiwgUSwgeyB2YWx1ZTogbzMsIHdyaXRhYmxlOiB0cnVlIH0pLCBpMjtcbiAgfSwgUzogZnVuY3Rpb24objIsIHQzLCBvMykge1xuICAgIG8zID8gcih0MykgJiYgdDNbUV0uQSA9PT0gbjIgJiYgZShuMi5wKSA6IChuMi51ICYmIGZ1bmN0aW9uIG4zKHIyKSB7XG4gICAgICBpZiAocjIgJiYgXCJvYmplY3RcIiA9PSB0eXBlb2YgcjIpIHtcbiAgICAgICAgdmFyIHQ0ID0gcjJbUV07XG4gICAgICAgIGlmICh0NCkge1xuICAgICAgICAgIHZhciBlMiA9IHQ0LnQsIG80ID0gdDQuaywgZjMgPSB0NC5ELCBjMiA9IHQ0Lmk7XG4gICAgICAgICAgaWYgKDQgPT09IGMyKVxuICAgICAgICAgICAgaShvNCwgZnVuY3Rpb24ocjMpIHtcbiAgICAgICAgICAgICAgcjMgIT09IFEgJiYgKHZvaWQgMCAhPT0gZTJbcjNdIHx8IHUoZTIsIHIzKSA/IGYzW3IzXSB8fCBuMyhvNFtyM10pIDogKGYzW3IzXSA9IHRydWUsIGsodDQpKSk7XG4gICAgICAgICAgICB9KSwgaShlMiwgZnVuY3Rpb24objQpIHtcbiAgICAgICAgICAgICAgdm9pZCAwICE9PSBvNFtuNF0gfHwgdShvNCwgbjQpIHx8IChmM1tuNF0gPSBmYWxzZSwgayh0NCkpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgZWxzZSBpZiAoNSA9PT0gYzIpIHtcbiAgICAgICAgICAgIGlmIChhMih0NCkgJiYgKGsodDQpLCBmMy5sZW5ndGggPSB0cnVlKSwgbzQubGVuZ3RoIDwgZTIubGVuZ3RoKVxuICAgICAgICAgICAgICBmb3IgKHZhciBzMyA9IG80Lmxlbmd0aDsgczMgPCBlMi5sZW5ndGg7IHMzKyspXG4gICAgICAgICAgICAgICAgZjNbczNdID0gZmFsc2U7XG4gICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgIGZvciAodmFyIHYyID0gZTIubGVuZ3RoOyB2MiA8IG80Lmxlbmd0aDsgdjIrKylcbiAgICAgICAgICAgICAgICBmM1t2Ml0gPSB0cnVlO1xuICAgICAgICAgICAgZm9yICh2YXIgcDIgPSBNYXRoLm1pbihvNC5sZW5ndGgsIGUyLmxlbmd0aCksIGwyID0gMDsgbDIgPCBwMjsgbDIrKylcbiAgICAgICAgICAgICAgbzQuaGFzT3duUHJvcGVydHkobDIpIHx8IChmM1tsMl0gPSB0cnVlKSwgdm9pZCAwID09PSBmM1tsMl0gJiYgbjMobzRbbDJdKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KG4yLnBbMF0pLCBlKG4yLnApKTtcbiAgfSwgSzogZnVuY3Rpb24objIpIHtcbiAgICByZXR1cm4gNCA9PT0gbjIuaSA/IG8yKG4yKSA6IGEyKG4yKTtcbiAgfSB9KTtcbn1cbnZhciBHO1xudmFyIFU7XG52YXIgVyA9IFwidW5kZWZpbmVkXCIgIT0gdHlwZW9mIFN5bWJvbCAmJiBcInN5bWJvbFwiID09IHR5cGVvZiBTeW1ib2woXCJ4XCIpO1xudmFyIFggPSBcInVuZGVmaW5lZFwiICE9IHR5cGVvZiBNYXA7XG52YXIgcSA9IFwidW5kZWZpbmVkXCIgIT0gdHlwZW9mIFNldDtcbnZhciBCID0gXCJ1bmRlZmluZWRcIiAhPSB0eXBlb2YgUHJveHkgJiYgdm9pZCAwICE9PSBQcm94eS5yZXZvY2FibGUgJiYgXCJ1bmRlZmluZWRcIiAhPSB0eXBlb2YgUmVmbGVjdDtcbnZhciBIID0gVyA/IFN5bWJvbC5mb3IoXCJpbW1lci1ub3RoaW5nXCIpIDogKChHID0ge30pW1wiaW1tZXItbm90aGluZ1wiXSA9IHRydWUsIEcpO1xudmFyIEwgPSBXID8gU3ltYm9sLmZvcihcImltbWVyLWRyYWZ0YWJsZVwiKSA6IFwiX18kaW1tZXJfZHJhZnRhYmxlXCI7XG52YXIgUSA9IFcgPyBTeW1ib2wuZm9yKFwiaW1tZXItc3RhdGVcIikgOiBcIl9fJGltbWVyX3N0YXRlXCI7XG52YXIgWSA9IHsgMDogXCJJbGxlZ2FsIHN0YXRlXCIsIDE6IFwiSW1tZXIgZHJhZnRzIGNhbm5vdCBoYXZlIGNvbXB1dGVkIHByb3BlcnRpZXNcIiwgMjogXCJUaGlzIG9iamVjdCBoYXMgYmVlbiBmcm96ZW4gYW5kIHNob3VsZCBub3QgYmUgbXV0YXRlZFwiLCAzOiBmdW5jdGlvbihuMikge1xuICByZXR1cm4gXCJDYW5ub3QgdXNlIGEgcHJveHkgdGhhdCBoYXMgYmVlbiByZXZva2VkLiBEaWQgeW91IHBhc3MgYW4gb2JqZWN0IGZyb20gaW5zaWRlIGFuIGltbWVyIGZ1bmN0aW9uIHRvIGFuIGFzeW5jIHByb2Nlc3M/IFwiICsgbjI7XG59LCA0OiBcIkFuIGltbWVyIHByb2R1Y2VyIHJldHVybmVkIGEgbmV3IHZhbHVlICphbmQqIG1vZGlmaWVkIGl0cyBkcmFmdC4gRWl0aGVyIHJldHVybiBhIG5ldyB2YWx1ZSAqb3IqIG1vZGlmeSB0aGUgZHJhZnQuXCIsIDU6IFwiSW1tZXIgZm9yYmlkcyBjaXJjdWxhciByZWZlcmVuY2VzXCIsIDY6IFwiVGhlIGZpcnN0IG9yIHNlY29uZCBhcmd1bWVudCB0byBgcHJvZHVjZWAgbXVzdCBiZSBhIGZ1bmN0aW9uXCIsIDc6IFwiVGhlIHRoaXJkIGFyZ3VtZW50IHRvIGBwcm9kdWNlYCBtdXN0IGJlIGEgZnVuY3Rpb24gb3IgdW5kZWZpbmVkXCIsIDg6IFwiRmlyc3QgYXJndW1lbnQgdG8gYGNyZWF0ZURyYWZ0YCBtdXN0IGJlIGEgcGxhaW4gb2JqZWN0LCBhbiBhcnJheSwgb3IgYW4gaW1tZXJhYmxlIG9iamVjdFwiLCA5OiBcIkZpcnN0IGFyZ3VtZW50IHRvIGBmaW5pc2hEcmFmdGAgbXVzdCBiZSBhIGRyYWZ0IHJldHVybmVkIGJ5IGBjcmVhdGVEcmFmdGBcIiwgMTA6IFwiVGhlIGdpdmVuIGRyYWZ0IGlzIGFscmVhZHkgZmluYWxpemVkXCIsIDExOiBcIk9iamVjdC5kZWZpbmVQcm9wZXJ0eSgpIGNhbm5vdCBiZSB1c2VkIG9uIGFuIEltbWVyIGRyYWZ0XCIsIDEyOiBcIk9iamVjdC5zZXRQcm90b3R5cGVPZigpIGNhbm5vdCBiZSB1c2VkIG9uIGFuIEltbWVyIGRyYWZ0XCIsIDEzOiBcIkltbWVyIG9ubHkgc3VwcG9ydHMgZGVsZXRpbmcgYXJyYXkgaW5kaWNlc1wiLCAxNDogXCJJbW1lciBvbmx5IHN1cHBvcnRzIHNldHRpbmcgYXJyYXkgaW5kaWNlcyBhbmQgdGhlICdsZW5ndGgnIHByb3BlcnR5XCIsIDE1OiBmdW5jdGlvbihuMikge1xuICByZXR1cm4gXCJDYW5ub3QgYXBwbHkgcGF0Y2gsIHBhdGggZG9lc24ndCByZXNvbHZlOiBcIiArIG4yO1xufSwgMTY6ICdTZXRzIGNhbm5vdCBoYXZlIFwicmVwbGFjZVwiIHBhdGNoZXMuJywgMTc6IGZ1bmN0aW9uKG4yKSB7XG4gIHJldHVybiBcIlVuc3VwcG9ydGVkIHBhdGNoIG9wZXJhdGlvbjogXCIgKyBuMjtcbn0sIDE4OiBmdW5jdGlvbihuMikge1xuICByZXR1cm4gXCJUaGUgcGx1Z2luIGZvciAnXCIgKyBuMiArIFwiJyBoYXMgbm90IGJlZW4gbG9hZGVkIGludG8gSW1tZXIuIFRvIGVuYWJsZSB0aGUgcGx1Z2luLCBpbXBvcnQgYW5kIGNhbGwgYGVuYWJsZVwiICsgbjIgKyBcIigpYCB3aGVuIGluaXRpYWxpemluZyB5b3VyIGFwcGxpY2F0aW9uLlwiO1xufSwgMjA6IFwiQ2Fubm90IHVzZSBwcm94aWVzIGlmIFByb3h5LCBQcm94eS5yZXZvY2FibGUgb3IgUmVmbGVjdCBhcmUgbm90IGF2YWlsYWJsZVwiLCAyMTogZnVuY3Rpb24objIpIHtcbiAgcmV0dXJuIFwicHJvZHVjZSBjYW4gb25seSBiZSBjYWxsZWQgb24gdGhpbmdzIHRoYXQgYXJlIGRyYWZ0YWJsZTogcGxhaW4gb2JqZWN0cywgYXJyYXlzLCBNYXAsIFNldCBvciBjbGFzc2VzIHRoYXQgYXJlIG1hcmtlZCB3aXRoICdbaW1tZXJhYmxlXTogdHJ1ZScuIEdvdCAnXCIgKyBuMiArIFwiJ1wiO1xufSwgMjI6IGZ1bmN0aW9uKG4yKSB7XG4gIHJldHVybiBcIidjdXJyZW50JyBleHBlY3RzIGEgZHJhZnQsIGdvdDogXCIgKyBuMjtcbn0sIDIzOiBmdW5jdGlvbihuMikge1xuICByZXR1cm4gXCInb3JpZ2luYWwnIGV4cGVjdHMgYSBkcmFmdCwgZ290OiBcIiArIG4yO1xufSwgMjQ6IFwiUGF0Y2hpbmcgcmVzZXJ2ZWQgYXR0cmlidXRlcyBsaWtlIF9fcHJvdG9fXywgcHJvdG90eXBlIGFuZCBjb25zdHJ1Y3RvciBpcyBub3QgYWxsb3dlZFwiIH07XG52YXIgWiA9IFwiXCIgKyBPYmplY3QucHJvdG90eXBlLmNvbnN0cnVjdG9yO1xudmFyIG5uID0gXCJ1bmRlZmluZWRcIiAhPSB0eXBlb2YgUmVmbGVjdCAmJiBSZWZsZWN0Lm93bktleXMgPyBSZWZsZWN0Lm93bktleXMgOiB2b2lkIDAgIT09IE9iamVjdC5nZXRPd25Qcm9wZXJ0eVN5bWJvbHMgPyBmdW5jdGlvbihuMikge1xuICByZXR1cm4gT2JqZWN0LmdldE93blByb3BlcnR5TmFtZXMobjIpLmNvbmNhdChPYmplY3QuZ2V0T3duUHJvcGVydHlTeW1ib2xzKG4yKSk7XG59IDogT2JqZWN0LmdldE93blByb3BlcnR5TmFtZXM7XG52YXIgcm4gPSBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9ycyB8fCBmdW5jdGlvbihuMikge1xuICB2YXIgcjIgPSB7fTtcbiAgcmV0dXJuIG5uKG4yKS5mb3JFYWNoKGZ1bmN0aW9uKHQyKSB7XG4gICAgcjJbdDJdID0gT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcihuMiwgdDIpO1xuICB9KSwgcjI7XG59O1xudmFyIHRuID0ge307XG52YXIgZW4gPSB7IGdldDogZnVuY3Rpb24objIsIHIyKSB7XG4gIGlmIChyMiA9PT0gUSlcbiAgICByZXR1cm4gbjI7XG4gIHZhciBlID0gcChuMik7XG4gIGlmICghdShlLCByMikpXG4gICAgcmV0dXJuIGZ1bmN0aW9uKG4zLCByMywgdDIpIHtcbiAgICAgIHZhciBlMiwgaTMgPSBJKHIzLCB0Mik7XG4gICAgICByZXR1cm4gaTMgPyBcInZhbHVlXCIgaW4gaTMgPyBpMy52YWx1ZSA6IG51bGwgPT09IChlMiA9IGkzLmdldCkgfHwgdm9pZCAwID09PSBlMiA/IHZvaWQgMCA6IGUyLmNhbGwobjMuaykgOiB2b2lkIDA7XG4gICAgfShuMiwgZSwgcjIpO1xuICB2YXIgaTIgPSBlW3IyXTtcbiAgcmV0dXJuIG4yLkkgfHwgIXQoaTIpID8gaTIgOiBpMiA9PT0geihuMi50LCByMikgPyAoRShuMiksIG4yLm9bcjJdID0gUihuMi5BLmgsIGkyLCBuMikpIDogaTI7XG59LCBoYXM6IGZ1bmN0aW9uKG4yLCByMikge1xuICByZXR1cm4gcjIgaW4gcChuMik7XG59LCBvd25LZXlzOiBmdW5jdGlvbihuMikge1xuICByZXR1cm4gUmVmbGVjdC5vd25LZXlzKHAobjIpKTtcbn0sIHNldDogZnVuY3Rpb24objIsIHIyLCB0Mikge1xuICB2YXIgZSA9IEkocChuMiksIHIyKTtcbiAgaWYgKG51bGwgPT0gZSA/IHZvaWQgMCA6IGUuc2V0KVxuICAgIHJldHVybiBlLnNldC5jYWxsKG4yLmssIHQyKSwgdHJ1ZTtcbiAgaWYgKCFuMi5QKSB7XG4gICAgdmFyIGkyID0geihwKG4yKSwgcjIpLCBvMiA9IG51bGwgPT0gaTIgPyB2b2lkIDAgOiBpMltRXTtcbiAgICBpZiAobzIgJiYgbzIudCA9PT0gdDIpXG4gICAgICByZXR1cm4gbjIub1tyMl0gPSB0MiwgbjIuRFtyMl0gPSBmYWxzZSwgdHJ1ZTtcbiAgICBpZiAoYyh0MiwgaTIpICYmICh2b2lkIDAgIT09IHQyIHx8IHUobjIudCwgcjIpKSlcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIEUobjIpLCBrKG4yKTtcbiAgfVxuICByZXR1cm4gbjIub1tyMl0gPT09IHQyICYmIFwibnVtYmVyXCIgIT0gdHlwZW9mIHQyICYmICh2b2lkIDAgIT09IHQyIHx8IHIyIGluIG4yLm8pIHx8IChuMi5vW3IyXSA9IHQyLCBuMi5EW3IyXSA9IHRydWUsIHRydWUpO1xufSwgZGVsZXRlUHJvcGVydHk6IGZ1bmN0aW9uKG4yLCByMikge1xuICByZXR1cm4gdm9pZCAwICE9PSB6KG4yLnQsIHIyKSB8fCByMiBpbiBuMi50ID8gKG4yLkRbcjJdID0gZmFsc2UsIEUobjIpLCBrKG4yKSkgOiBkZWxldGUgbjIuRFtyMl0sIG4yLm8gJiYgZGVsZXRlIG4yLm9bcjJdLCB0cnVlO1xufSwgZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yOiBmdW5jdGlvbihuMiwgcjIpIHtcbiAgdmFyIHQyID0gcChuMiksIGUgPSBSZWZsZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcih0MiwgcjIpO1xuICByZXR1cm4gZSA/IHsgd3JpdGFibGU6IHRydWUsIGNvbmZpZ3VyYWJsZTogMSAhPT0gbjIuaSB8fCBcImxlbmd0aFwiICE9PSByMiwgZW51bWVyYWJsZTogZS5lbnVtZXJhYmxlLCB2YWx1ZTogdDJbcjJdIH0gOiBlO1xufSwgZGVmaW5lUHJvcGVydHk6IGZ1bmN0aW9uKCkge1xuICBuKDExKTtcbn0sIGdldFByb3RvdHlwZU9mOiBmdW5jdGlvbihuMikge1xuICByZXR1cm4gT2JqZWN0LmdldFByb3RvdHlwZU9mKG4yLnQpO1xufSwgc2V0UHJvdG90eXBlT2Y6IGZ1bmN0aW9uKCkge1xuICBuKDEyKTtcbn0gfTtcbnZhciBvbiA9IHt9O1xuaShlbiwgZnVuY3Rpb24objIsIHIyKSB7XG4gIG9uW24yXSA9IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiBhcmd1bWVudHNbMF0gPSBhcmd1bWVudHNbMF1bMF0sIHIyLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gIH07XG59KSwgb24uZGVsZXRlUHJvcGVydHkgPSBmdW5jdGlvbihyMiwgdDIpIHtcbiAgcmV0dXJuIGlzTmFOKHBhcnNlSW50KHQyKSkgJiYgbigxMyksIG9uLnNldC5jYWxsKHRoaXMsIHIyLCB0Miwgdm9pZCAwKTtcbn0sIG9uLnNldCA9IGZ1bmN0aW9uKHIyLCB0MiwgZSkge1xuICByZXR1cm4gXCJsZW5ndGhcIiAhPT0gdDIgJiYgaXNOYU4ocGFyc2VJbnQodDIpKSAmJiBuKDE0KSwgZW4uc2V0LmNhbGwodGhpcywgcjJbMF0sIHQyLCBlLCByMlswXSk7XG59O1xudmFyIHVuID0gZnVuY3Rpb24oKSB7XG4gIGZ1bmN0aW9uIGUocjIpIHtcbiAgICB2YXIgZTIgPSB0aGlzO1xuICAgIHRoaXMuZyA9IEIsIHRoaXMuRiA9IHRydWUsIHRoaXMucHJvZHVjZSA9IGZ1bmN0aW9uKHIzLCBpMywgbzIpIHtcbiAgICAgIGlmIChcImZ1bmN0aW9uXCIgPT0gdHlwZW9mIHIzICYmIFwiZnVuY3Rpb25cIiAhPSB0eXBlb2YgaTMpIHtcbiAgICAgICAgdmFyIHUyID0gaTM7XG4gICAgICAgIGkzID0gcjM7XG4gICAgICAgIHZhciBhMiA9IGUyO1xuICAgICAgICByZXR1cm4gZnVuY3Rpb24objIpIHtcbiAgICAgICAgICB2YXIgcjQgPSB0aGlzO1xuICAgICAgICAgIHZvaWQgMCA9PT0gbjIgJiYgKG4yID0gdTIpO1xuICAgICAgICAgIGZvciAodmFyIHQyID0gYXJndW1lbnRzLmxlbmd0aCwgZTMgPSBBcnJheSh0MiA+IDEgPyB0MiAtIDEgOiAwKSwgbzMgPSAxOyBvMyA8IHQyOyBvMysrKVxuICAgICAgICAgICAgZTNbbzMgLSAxXSA9IGFyZ3VtZW50c1tvM107XG4gICAgICAgICAgcmV0dXJuIGEyLnByb2R1Y2UobjIsIGZ1bmN0aW9uKG4zKSB7XG4gICAgICAgICAgICB2YXIgdDM7XG4gICAgICAgICAgICByZXR1cm4gKHQzID0gaTMpLmNhbGwuYXBwbHkodDMsIFtyNCwgbjNdLmNvbmNhdChlMykpO1xuICAgICAgICAgIH0pO1xuICAgICAgICB9O1xuICAgICAgfVxuICAgICAgdmFyIGYyO1xuICAgICAgaWYgKFwiZnVuY3Rpb25cIiAhPSB0eXBlb2YgaTMgJiYgbig2KSwgdm9pZCAwICE9PSBvMiAmJiBcImZ1bmN0aW9uXCIgIT0gdHlwZW9mIG8yICYmIG4oNyksIHQocjMpKSB7XG4gICAgICAgIHZhciBjMiA9IHcoZTIpLCBzMiA9IFIoZTIsIHIzLCB2b2lkIDApLCB2MiA9IHRydWU7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgZjIgPSBpMyhzMiksIHYyID0gZmFsc2U7XG4gICAgICAgIH0gZmluYWxseSB7XG4gICAgICAgICAgdjIgPyBPKGMyKSA6IGcoYzIpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBcInVuZGVmaW5lZFwiICE9IHR5cGVvZiBQcm9taXNlICYmIGYyIGluc3RhbmNlb2YgUHJvbWlzZSA/IGYyLnRoZW4oZnVuY3Rpb24objIpIHtcbiAgICAgICAgICByZXR1cm4gaihjMiwgbzIpLCBQKG4yLCBjMik7XG4gICAgICAgIH0sIGZ1bmN0aW9uKG4yKSB7XG4gICAgICAgICAgdGhyb3cgTyhjMiksIG4yO1xuICAgICAgICB9KSA6IChqKGMyLCBvMiksIFAoZjIsIGMyKSk7XG4gICAgICB9XG4gICAgICBpZiAoIXIzIHx8IFwib2JqZWN0XCIgIT0gdHlwZW9mIHIzKSB7XG4gICAgICAgIGlmICh2b2lkIDAgPT09IChmMiA9IGkzKHIzKSkgJiYgKGYyID0gcjMpLCBmMiA9PT0gSCAmJiAoZjIgPSB2b2lkIDApLCBlMi5GICYmIGQoZjIsIHRydWUpLCBvMikge1xuICAgICAgICAgIHZhciBwMiA9IFtdLCBsMiA9IFtdO1xuICAgICAgICAgIGIoXCJQYXRjaGVzXCIpLk0ocjMsIGYyLCBwMiwgbDIpLCBvMihwMiwgbDIpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBmMjtcbiAgICAgIH1cbiAgICAgIG4oMjEsIHIzKTtcbiAgICB9LCB0aGlzLnByb2R1Y2VXaXRoUGF0Y2hlcyA9IGZ1bmN0aW9uKG4yLCByMykge1xuICAgICAgaWYgKFwiZnVuY3Rpb25cIiA9PSB0eXBlb2YgbjIpXG4gICAgICAgIHJldHVybiBmdW5jdGlvbihyNCkge1xuICAgICAgICAgIGZvciAodmFyIHQzID0gYXJndW1lbnRzLmxlbmd0aCwgaTQgPSBBcnJheSh0MyA+IDEgPyB0MyAtIDEgOiAwKSwgbzMgPSAxOyBvMyA8IHQzOyBvMysrKVxuICAgICAgICAgICAgaTRbbzMgLSAxXSA9IGFyZ3VtZW50c1tvM107XG4gICAgICAgICAgcmV0dXJuIGUyLnByb2R1Y2VXaXRoUGF0Y2hlcyhyNCwgZnVuY3Rpb24ocjUpIHtcbiAgICAgICAgICAgIHJldHVybiBuMi5hcHBseSh2b2lkIDAsIFtyNV0uY29uY2F0KGk0KSk7XG4gICAgICAgICAgfSk7XG4gICAgICAgIH07XG4gICAgICB2YXIgdDIsIGkzLCBvMiA9IGUyLnByb2R1Y2UobjIsIHIzLCBmdW5jdGlvbihuMywgcjQpIHtcbiAgICAgICAgdDIgPSBuMywgaTMgPSByNDtcbiAgICAgIH0pO1xuICAgICAgcmV0dXJuIFwidW5kZWZpbmVkXCIgIT0gdHlwZW9mIFByb21pc2UgJiYgbzIgaW5zdGFuY2VvZiBQcm9taXNlID8gbzIudGhlbihmdW5jdGlvbihuMykge1xuICAgICAgICByZXR1cm4gW24zLCB0MiwgaTNdO1xuICAgICAgfSkgOiBbbzIsIHQyLCBpM107XG4gICAgfSwgXCJib29sZWFuXCIgPT0gdHlwZW9mIChudWxsID09IHIyID8gdm9pZCAwIDogcjIudXNlUHJveGllcykgJiYgdGhpcy5zZXRVc2VQcm94aWVzKHIyLnVzZVByb3hpZXMpLCBcImJvb2xlYW5cIiA9PSB0eXBlb2YgKG51bGwgPT0gcjIgPyB2b2lkIDAgOiByMi5hdXRvRnJlZXplKSAmJiB0aGlzLnNldEF1dG9GcmVlemUocjIuYXV0b0ZyZWV6ZSk7XG4gIH1cbiAgdmFyIGkyID0gZS5wcm90b3R5cGU7XG4gIHJldHVybiBpMi5jcmVhdGVEcmFmdCA9IGZ1bmN0aW9uKGUyKSB7XG4gICAgdChlMikgfHwgbig4KSwgcihlMikgJiYgKGUyID0gRChlMikpO1xuICAgIHZhciBpMyA9IHcodGhpcyksIG8yID0gUih0aGlzLCBlMiwgdm9pZCAwKTtcbiAgICByZXR1cm4gbzJbUV0uQyA9IHRydWUsIGcoaTMpLCBvMjtcbiAgfSwgaTIuZmluaXNoRHJhZnQgPSBmdW5jdGlvbihyMiwgdDIpIHtcbiAgICB2YXIgZTIgPSByMiAmJiByMltRXTtcbiAgICBlMiAmJiBlMi5DIHx8IG4oOSksIGUyLkkgJiYgbigxMCk7XG4gICAgdmFyIGkzID0gZTIuQTtcbiAgICByZXR1cm4gaihpMywgdDIpLCBQKHZvaWQgMCwgaTMpO1xuICB9LCBpMi5zZXRBdXRvRnJlZXplID0gZnVuY3Rpb24objIpIHtcbiAgICB0aGlzLkYgPSBuMjtcbiAgfSwgaTIuc2V0VXNlUHJveGllcyA9IGZ1bmN0aW9uKHIyKSB7XG4gICAgcjIgJiYgIUIgJiYgbigyMCksIHRoaXMuZyA9IHIyO1xuICB9LCBpMi5hcHBseVBhdGNoZXMgPSBmdW5jdGlvbihuMiwgdDIpIHtcbiAgICB2YXIgZTI7XG4gICAgZm9yIChlMiA9IHQyLmxlbmd0aCAtIDE7IGUyID49IDA7IGUyLS0pIHtcbiAgICAgIHZhciBpMyA9IHQyW2UyXTtcbiAgICAgIGlmICgwID09PSBpMy5wYXRoLmxlbmd0aCAmJiBcInJlcGxhY2VcIiA9PT0gaTMub3ApIHtcbiAgICAgICAgbjIgPSBpMy52YWx1ZTtcbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgfVxuICAgIGUyID4gLTEgJiYgKHQyID0gdDIuc2xpY2UoZTIgKyAxKSk7XG4gICAgdmFyIG8yID0gYihcIlBhdGNoZXNcIikuJDtcbiAgICByZXR1cm4gcihuMikgPyBvMihuMiwgdDIpIDogdGhpcy5wcm9kdWNlKG4yLCBmdW5jdGlvbihuMykge1xuICAgICAgcmV0dXJuIG8yKG4zLCB0Mik7XG4gICAgfSk7XG4gIH0sIGU7XG59KCk7XG52YXIgYW4gPSBuZXcgdW4oKTtcbnZhciBmbiA9IGFuLnByb2R1Y2U7XG52YXIgY24gPSBhbi5wcm9kdWNlV2l0aFBhdGNoZXMuYmluZChhbik7XG52YXIgc24gPSBhbi5zZXRBdXRvRnJlZXplLmJpbmQoYW4pO1xudmFyIHZuID0gYW4uc2V0VXNlUHJveGllcy5iaW5kKGFuKTtcbnZhciBwbiA9IGFuLmFwcGx5UGF0Y2hlcy5iaW5kKGFuKTtcbnZhciBsbiA9IGFuLmNyZWF0ZURyYWZ0LmJpbmQoYW4pO1xudmFyIGRuID0gYW4uZmluaXNoRHJhZnQuYmluZChhbik7XG5cbi8vIG5vZGVfbW9kdWxlcy9AaWNlL3N0b3JlL2VzbS9wbHVnaW5zL2ltbWVyLmpzXG5OKCk7XG5cbi8vIG5vZGVfbW9kdWxlcy9AaWNlL3N0b3JlL2VzbS9wbHVnaW5zL2xvYWRpbmcuanNcbnZhciBfX2Fzc2lnbjMgPSBmdW5jdGlvbigpIHtcbiAgX19hc3NpZ24zID0gT2JqZWN0LmFzc2lnbiB8fCBmdW5jdGlvbih0Mikge1xuICAgIGZvciAodmFyIHMyLCBpMiA9IDEsIG4yID0gYXJndW1lbnRzLmxlbmd0aDsgaTIgPCBuMjsgaTIrKykge1xuICAgICAgczIgPSBhcmd1bWVudHNbaTJdO1xuICAgICAgZm9yICh2YXIgcDIgaW4gczIpXG4gICAgICAgIGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwoczIsIHAyKSlcbiAgICAgICAgICB0MltwMl0gPSBzMltwMl07XG4gICAgfVxuICAgIHJldHVybiB0MjtcbiAgfTtcbiAgcmV0dXJuIF9fYXNzaWduMy5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xufTtcbnZhciBjbnRTdGF0ZSA9IHtcbiAgZ2xvYmFsOiAwLFxuICBtb2RlbHM6IHt9LFxuICBlZmZlY3RzOiB7fVxufTtcbnZhciBuZXh0U3RhdGUgPSBfX2Fzc2lnbjMoX19hc3NpZ24zKHt9LCBjbnRTdGF0ZSksIHsgbW9kZWxzOiBfX2Fzc2lnbjMoe30sIGNudFN0YXRlLm1vZGVscyksIGVmZmVjdHM6IF9fYXNzaWduMyh7fSwgY250U3RhdGUuZWZmZWN0cykgfSk7XG5cbi8vIG5vZGVfbW9kdWxlcy9AaWNlL3N0b3JlL2VzbS9wbHVnaW5zL2Vycm9yLmpzXG52YXIgX19hc3NpZ240ID0gZnVuY3Rpb24oKSB7XG4gIF9fYXNzaWduNCA9IE9iamVjdC5hc3NpZ24gfHwgZnVuY3Rpb24odDIpIHtcbiAgICBmb3IgKHZhciBzMiwgaTIgPSAxLCBuMiA9IGFyZ3VtZW50cy5sZW5ndGg7IGkyIDwgbjI7IGkyKyspIHtcbiAgICAgIHMyID0gYXJndW1lbnRzW2kyXTtcbiAgICAgIGZvciAodmFyIHAyIGluIHMyKVxuICAgICAgICBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKHMyLCBwMikpXG4gICAgICAgICAgdDJbcDJdID0gczJbcDJdO1xuICAgIH1cbiAgICByZXR1cm4gdDI7XG4gIH07XG4gIHJldHVybiBfX2Fzc2lnbjQuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbn07XG52YXIgZGVmYXVsdFZhbHVlID0ge1xuICBlcnJvcjogbnVsbCxcbiAgdmFsdWU6IDBcbn07XG52YXIgY250U3RhdGUyID0ge1xuICBnbG9iYWw6IF9fYXNzaWduNCh7fSwgZGVmYXVsdFZhbHVlKSxcbiAgbW9kZWxzOiB7fSxcbiAgZWZmZWN0czoge31cbn07XG52YXIgbmV4dFN0YXRlMiA9IHtcbiAgZ2xvYmFsOiBfX2Fzc2lnbjQoe30sIGNudFN0YXRlMi5nbG9iYWwpLFxuICBtb2RlbHM6IF9fYXNzaWduNCh7fSwgY250U3RhdGUyLm1vZGVscyksXG4gIGVmZmVjdHM6IF9fYXNzaWduNCh7fSwgY250U3RhdGUyLmVmZmVjdHMpXG59O1xuXG4vLyBub2RlX21vZHVsZXMvQGljZS9zdG9yZS9lc20vdXRpbHMvY2hlY2tNb2RlbHMuanNcbnZhciBpbXBvcnRfbG9kYXNoID0gX190b0VTTShyZXF1aXJlX2xvZGFzaCgpKTtcblxuLy8gbm9kZV9tb2R1bGVzL0BpY2Uvc3RvcmUvZXNtL3V0aWxzL2FwcGVuZFJlZHVjZXJzLmpzXG52YXIgU0VUX1NUQVRFMiA9IGFjdGlvblR5cGVzX2RlZmF1bHQuU0VUX1NUQVRFO1xuXG4vLyBub2RlX21vZHVsZXMvQGljZS9wbHVnaW4tYXV0aC9lc20vcnVudGltZS9pbmRleC5qc1xuaW1wb3J0ICogYXMgUmVhY3Q5IGZyb20gXCJyZWFjdFwiO1xuXG4vLyBub2RlX21vZHVsZXMvQGljZS9wbHVnaW4tYXV0aC9lc20vcnVudGltZS9BdXRoLmpzXG5pbXBvcnQgKiBhcyBSZWFjdDggZnJvbSBcInJlYWN0XCI7XG5pbXBvcnQgeyBjcmVhdGVDb250ZXh0LCB1c2VDb250ZXh0IGFzIHVzZUNvbnRleHQ1IH0gZnJvbSBcInJlYWN0XCI7XG52YXIgQ29udGV4dCA9IGNyZWF0ZUNvbnRleHQobnVsbCk7XG5Db250ZXh0LmRpc3BsYXlOYW1lID0gXCJBdXRoQ29udGV4dFwiO1xudmFyIEF1dGhQcm92aWRlciA9IENvbnRleHQuUHJvdmlkZXI7XG5cbi8vIC5pY2UvaW5kZXgudHNcbmZ1bmN0aW9uIGRlZmluZVBhZ2VDb25maWcocGFnZUNvbmZpZzQpIHtcbiAgcmV0dXJuIHBhZ2VDb25maWc0O1xufVxuXG4vLyBzcmMvcGFnZXMvZm9ybS9pbmRleC50c3hcbnZhciBwYWdlQ29uZmlnID0gZGVmaW5lUGFnZUNvbmZpZygoKSA9PiB7XG4gIHJldHVybiB7XG4gICAgYXV0aDogW1wiYWRtaW5cIiwgXCJ1c2VyXCJdXG4gIH07XG59KTtcblxuLy8gc3JjL3BhZ2VzL2xpc3QvaW5kZXgudHN4XG52YXIgcGFnZUNvbmZpZzIgPSBkZWZpbmVQYWdlQ29uZmlnKCgpID0+IHtcbiAgcmV0dXJuIHtcbiAgICBhdXRoOiBbXCJhZG1pblwiXVxuICB9O1xufSk7XG5cbi8vIHNyYy9wYWdlcy9pbmRleC50c3hcbnZhciBwYWdlQ29uZmlnMyA9IGRlZmluZVBhZ2VDb25maWcoKCkgPT4ge1xuICByZXR1cm4ge1xuICAgIGF1dGg6IFtcImFkbWluXCIsIFwidXNlclwiXVxuICB9O1xufSk7XG5cbi8vIC5pY2Uvcm91dGVzLWNvbmZpZy50c1xudmFyIHJvdXRlc19jb25maWdfZGVmYXVsdCA9IHtcbiAgXCJmb3JtL2luZGV4XCI6IHBhZ2VDb25maWcsXG4gIFwibGlzdC9pbmRleFwiOiBwYWdlQ29uZmlnMixcbiAgXCJpbmRleFwiOiBwYWdlQ29uZmlnM1xufTtcbmV4cG9ydCB7XG4gIHJvdXRlc19jb25maWdfZGVmYXVsdCBhcyBkZWZhdWx0XG59O1xuLypcbm9iamVjdC1hc3NpZ25cbihjKSBTaW5kcmUgU29yaHVzXG5AbGljZW5zZSBNSVRcbiovXG4vKiogQGxpY2Vuc2UgUmVhY3QgdjE2LjEzLjFcbiAqIHJlYWN0LWlzLmRldmVsb3BtZW50LmpzXG4gKlxuICogQ29weXJpZ2h0IChjKSBGYWNlYm9vaywgSW5jLiBhbmQgaXRzIGFmZmlsaWF0ZXMuXG4gKlxuICogVGhpcyBzb3VyY2UgY29kZSBpcyBsaWNlbnNlZCB1bmRlciB0aGUgTUlUIGxpY2Vuc2UgZm91bmQgaW4gdGhlXG4gKiBMSUNFTlNFIGZpbGUgaW4gdGhlIHJvb3QgZGlyZWN0b3J5IG9mIHRoaXMgc291cmNlIHRyZWUuXG4gKi9cbi8qKiBAbGljZW5zZSBSZWFjdCB2MTcuMC4yXG4gKiByZWFjdC1pcy5kZXZlbG9wbWVudC5qc1xuICpcbiAqIENvcHlyaWdodCAoYykgRmFjZWJvb2ssIEluYy4gYW5kIGl0cyBhZmZpbGlhdGVzLlxuICpcbiAqIFRoaXMgc291cmNlIGNvZGUgaXMgbGljZW5zZWQgdW5kZXIgdGhlIE1JVCBsaWNlbnNlIGZvdW5kIGluIHRoZVxuICogTElDRU5TRSBmaWxlIGluIHRoZSByb290IGRpcmVjdG9yeSBvZiB0aGlzIHNvdXJjZSB0cmVlLlxuICovXG4iLCAiLyogZXNsaW50LWRpc2FibGUgQHR5cGVzY3JpcHQtZXNsaW50L2NvbnNpc3RlbnQtdHlwZS1hc3NlcnRpb25zICovXG5pbXBvcnQgeyBVc2VySW5mbyB9IGZyb20gJ0AvaW50ZXJmYWNlcy91c2VyJztcbmltcG9ydCB7IGNyZWF0ZU1vZGVsIH0gZnJvbSAnaWNlJztcblxuaW50ZXJmYWNlIE1vZGVsU3RhdGUge1xuICBjdXJyZW50VXNlcjogVXNlckluZm87XG59XG5cbmV4cG9ydCBkZWZhdWx0IGNyZWF0ZU1vZGVsKHtcbiAgc3RhdGU6IHtcbiAgICBjdXJyZW50VXNlcjoge30sXG4gIH0gYXMgTW9kZWxTdGF0ZSxcbiAgcmVkdWNlcnM6IHtcbiAgICB1cGRhdGVDdXJyZW50VXNlcihwcmV2U3RhdGU6IE1vZGVsU3RhdGUsIHBheWxvYWQpIHtcbiAgICAgIHByZXZTdGF0ZS5jdXJyZW50VXNlciA9IHBheWxvYWQ7XG4gICAgfSxcbiAgfSxcbn0pO1xuIiwgImltcG9ydCB7IGNyZWF0ZVN0b3JlIH0gZnJvbSAnaWNlJztcbmltcG9ydCB1c2VyIGZyb20gJ0AvbW9kZWxzL3VzZXInO1xuXG5leHBvcnQgZGVmYXVsdCBjcmVhdGVTdG9yZSh7XG4gIHVzZXIsXG59KTtcbiJdLAogICJtYXBwaW5ncyI6ICI7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBR0FBLFFBQVFDLElBQUlDLGdCQUFnQkM7QUFDNUJILFFBQVFDLElBQUlHLGtCQUFrQkQ7QUFDOUJILFFBQVFDLElBQUlJLDBCQUEwQkY7QUFDdENILFFBQVFDLElBQUlLLHdCQUF3Qkg7QUFDcENILFFBQVFDLElBQUlNLG9CQUFvQko7OztBQ05oQyxZQUFZSyxjQUFhOzs7QUNBekIsSUFBTSxjQUFjO0FBQ3BCLElBQU0sVUFBVSxPQUFPLEVBQUUsV0FBVyxNQUFNO0FBQ3RDLFFBQU0sRUFBRSxVQUFVLElBQUk7QUFDdEIsUUFBTSxXQUFXLFVBQVU7QUFDM0IsUUFBTSxpQkFBaUIsT0FBTyxhQUFhLGFBQWEsTUFBTSxTQUFTLElBQUksYUFBYSxDQUFDO0FBRXpGLE1BQUksTUFBTSxRQUFRLGFBQWEsR0FBRztBQUM5QixrQkFBYyxRQUFRLGlCQUFlO0FBQ2pDLFlBQU0sZUFBZSxZQUFZLGVBQWUsWUFBWSxlQUFlO0FBQzNFLFVBQUksY0FBYztBQUNkLGNBQU0sZ0JBQWdCLG9CQUFvQixZQUFZLEVBQUU7QUFDeEQseUJBQWlCLGFBQWEsYUFBYTtBQUFBLE1BQy9DO0FBQUEsSUFDSixDQUFDO0FBQUEsRUFDTCxPQUNLO0FBQ0QsVUFBTSxnQkFBZ0Isb0JBQW9CLEVBQUU7QUFDNUMscUJBQWlCLGVBQWUsYUFBYTtBQUFBLEVBQ2pEO0FB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TUFDZEM7O0dBRUg7QUFDSDtBQUVBLGVBQXNCQyxrQkFBaUJaLGdCQUFnQkMsVUFBeUIsQ0FBQSxHQUFJO0FBQ2xGLFFBQU0sRUFBRUMsY0FBY1IsYUFBYSxPQUFPRixVQUFVVyxvQkFBb0JFLGdCQUFlLElBQUtKO0FBQzVGUixnQkFBY1EsT0FBTztBQUVyQlksRUFBUUQsMEJBQWlCWixnQkFBZ0I7SUFDdkNWO0lBQ0FnQjtJQUNBQztJQUNBdkI7SUFDQXdCO0lBQ0FMO0lBQ0FYLFVBQVVBLFlBQVlMLGtCQUFpQjtJQUN2Q2U7SUFDQVI7SUFDQVc7SUFDQUk7SUFDQUMsZ0JBQWdCO01BQ2RDOztHQUVIO0FBQ0g7IiwKICAibmFtZXMiOiBbInByb2Nlc3MiLCAiZW52IiwgIklDRV9DT1JFX01PREUiLCAiX19wcm9jZXNzIiwgIklDRV9DT1JFX1JPVVRFUiIsICJJQ0VfQ09SRV9FUlJPUl9CT1VOREFSWSIsICJJQ0VfQ09SRV9JTklUSUFMX0RBVEEiLCAiSUNFX0NPUkVfREVWX1BPUlQiLCAicnVudGltZSIsICJydW50aW1lX2RlZmF1bHQiLCAic3RhdGljcyIsICJtb2R1bGUwIiwgImNvbW1vbnMiLCAibW9kdWxlMSIsICJtb2R1bGUyIiwgImRlZmluZUFwcENvbmZpZyIsICJodG1sIiwgImhlYWQiLCAibWV0YSIsICJjaGFyU2V0IiwgIm5hbWUiLCAiY29udGVudCIsICJsaW5rIiwgInJlbCIsICJocmVmIiwgInR5cGUiLCAiTWV0YSIsICJUaXRsZSIsICJMaW5rcyIsICJib2R5IiwgIk1haW4iLCAiU2NyaXB0cyIsICJwYXRoIiwgImxvYWQiLCAiY29tcG9uZW50TmFtZSIsICJpbmRleCIsICJ1bmRlZmluZWQiLCAiaWQiLCAiZXhhY3QiLCAiZXhwb3J0cyIsICJsYXlvdXQiLCAiY2hpbGRyZW4iLCAiTGluayIsICJPdXRsZXQiLCAidXNlUGFyYW1zIiwgInVzZVNlYXJjaFBhcmFtcyIsICJ1c2VMb2NhdGlvbiIsICJ1c2VOYXZpZ2F0ZSIsICJkZWZpbmVBcHBDb25maWciLCAidXNlQXBwRGF0YSIsICJ1c2VEYXRhIiwgInVzZUNvbmZpZyIsICJNZXRhIiwgIlRpdGxlIiwgIkxpbmtzIiwgIlNjcmlwdHMiLCAiRGF0YSIsICJNYWluIiwgImhpc3RvcnkiLCAiS2VlcEFsaXZlT3V0bGV0IiwgInVzZU1vdW50ZWQiLCAiQ2xpZW50T25seSIsICJkZWZpbmVEYXRhTG9hZGVyIiwgImRlZmluZVNlcnZlckRhdGFMb2FkZXIiLCAiZGVmaW5lU3RhdGljRGF0YUxvYWRlciIsICJSZWFjdDciLCAiUmVhY3Q2IiwgIlJlYWN0NCIsICJSZWFjdDIiLCAidXNlTWVtbyIsICJSZWFjdCIsICJ1c2VFZmZlY3QiLCAidXNlTGF5b3V0RWZmZWN0IiwgIlJlYWN0MyIsICJ1c2VDb250ZXh0IiwgInVzZU1lbW8yIiwgInVzZVJlZiIsICJ1c2VSZWR1Y2VyIiwgInVzZUNvbnRleHQzIiwgInVzZUNvbnRleHQyIiwgInVzZVJlZHVjZXIyIiwgInVzZVJlZjIiLCAidXNlTWVtbzMiLCAidXNlQ29udGV4dDQiLCAidXNlRGVidWdWYWx1ZSIsICJ1bnN0YWJsZV9iYXRjaGVkVXBkYXRlcyIsICJSZWFjdDUiLCAiUmVhY3Q5IiwgIlJlYWN0OCIsICJjcmVhdGVDb250ZXh0IiwgInVzZUNvbnRleHQ1IiwgIl9fY3JlYXRlIiwgIk9iamVjdCIsICJjcmVhdGUiLCAiX19kZWZQcm9wIiwgImRlZmluZVByb3BlcnR5IiwgIl9fZ2V0T3duUHJvcERlc2MiLCAiZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yIiwgIl9fZ2V0T3duUHJvcE5hbWVzIiwgImdldE93blByb3BlcnR5TmFtZXMiLCAiX19nZXRQcm90b09mIiwgImdldFByb3RvdHlwZU9mIiwgIl9faGFzT3duUHJvcCIsICJwcm90b3R5cGUiLCAiaGFzT3duUHJvcGVydHkiLCAiX19jb21tb25KUyIsICJjYiIsICJtb2QiLCAiX19yZXF1aXJlIiwgImV4cG9ydHMiLCAiX19leHBvcnQiLCAidGFyZ2V0IiwgImFsbCIsICJuYW1lIiwgImdldCIsICJlbnVtZXJhYmxlIiwgIl9fY29weVByb3BzIiwgInRvIiwgImZyb20iLCAiZXhjZXB0IiwgImRlc2MiLCAia2V5IiwgImNhbGwiLCAiX190b0VTTSIsICJpc05vZGVNb2RlIiwgIl9fZXNNb2R1bGUiLCAidmFsdWUiLCAicmVxdWlyZV9iaW5kIiwgIm1vZHVsZSIsICJiaW5kIiwgImZuMiIsICJ0aGlzQXJnIiwgIndyYXAiLCAiYXJncyIsICJBcnJheSIsICJhcmd1bWVudHMiLCAibGVuZ3RoIiwgImkyIiwgImFwcGx5IiwgInJlcXVpcmVfdXRpbHMiLCAidG9TdHJpbmciLCAia2luZE9mMiIsICJjYWNoZSIsICJ0aGluZyIsICJzdHIiLCAic2xpY2UiLCAidG9Mb3dlckNhc2UiLCAia2luZE9mVGVzdCIsICJ0eXBlIiwgImlzS2luZE9mIiwgImlzQXJyYXkiLCAidmFsIiwgImlzVW5kZWZpbmVkIiwgImlzQnVmZmVyIiwgImNvbnN0cnVjdG9yIiwgImlzQXJyYXlCdWZmZXIiLCAiaXNBcnJheUJ1ZmZlclZpZXciLCAicmVzdWx0IiwgIkFycmF5QnVmZmVyIiwgImlzVmlldyIsICJidWZmZXIiLCAiaXNTdHJpbmciLCAiaXNOdW1iZXIiLCAiaXNPYmplY3QiLCAiaXNQbGFpbk9iamVjdDMiLCAiaXNEYXRlMiIsICJpc0ZpbGUiLCAiaXNCbG9iIiwgImlzRmlsZUxpc3QiLCAiaXNGdW5jdGlvbjIiLCAiaXNTdHJlYW0iLCAicGlwZSIsICJpc0Zvcm1EYXRhIiwgInBhdHRlcm4iLCAiRm9ybURhdGEiLCAiaXNVUkxTZWFyY2hQYXJhbXMiLCAidHJpbSIsICJyZXBsYWNlIiwgImlzU3RhbmRhcmRCcm93c2VyRW52IiwgIm5hdmlnYXRvciIsICJwcm9kdWN0IiwgIndpbmRvdyIsICJkb2N1bWVudCIsICJmb3JFYWNoIiwgIm9iaiIsICJsMiIsICJtZXJnZSIsICJhc3NpZ25WYWx1ZSIsICJleHRlbmQiLCAiYTIiLCAiYjIiLCAic3RyaXBCT00iLCAiY29udGVudCIsICJjaGFyQ29kZUF0IiwgImluaGVyaXRzIiwgInN1cGVyQ29uc3RydWN0b3IiLCAicHJvcHMiLCAiZGVzY3JpcHRvcnMiLCAiYXNzaWduIiwgInRvRmxhdE9iamVjdCIsICJzb3VyY2VPYmoiLCAiZGVzdE9iaiIsICJmaWx0ZXIiLCAicHJvcCIsICJtZXJnZWQiLCAiZW5kc1dpdGgiLCAic2VhcmNoU3RyaW5nIiwgInBvc2l0aW9uIiwgIlN0cmluZyIsICJsYXN0SW5kZXgiLCAiaW5kZXhPZiIsICJ0b0FycmF5IiwgImFyciIsICJpc1R5cGVkQXJyYXkiLCAiVHlwZWRBcnJheSIsICJVaW50OEFycmF5IiwgImlzUGxhaW5PYmplY3QiLCAiaXNEYXRlIiwgImlzRnVuY3Rpb24iLCAia2luZE9mIiwgInJlcXVpcmVfYnVpbGRVUkwiLCAidXRpbHMiLCAiZW5jb2RlIiwgImVuY29kZVVSSUNvbXBvbmVudCIsICJidWlsZFVSTCIsICJ1cmwiLCAicGFyYW1zIiwgInBhcmFtc1NlcmlhbGl6ZXIiLCAic2VyaWFsaXplZFBhcmFtcyIsICJwYXJ0cyIsICJzZXJpYWxpemUiLCAicGFyc2VWYWx1ZSIsICJ2MiIsICJ0b0lTT1N0cmluZyIsICJKU09OIiwgInN0cmluZ2lmeSIsICJwdXNoIiwgImpvaW4iLCAiaGFzaG1hcmtJbmRleCIsICJyZXF1aXJlX0ludGVyY2VwdG9yTWFuYWdlciIsICJJbnRlcmNlcHRvck1hbmFnZXIiLCAiaGFuZGxlcnMiLCAidXNlIiwgImZ1bGZpbGxlZCIsICJyZWplY3RlZCIsICJvcHRpb25zIiwgInN5bmNocm9ub3VzIiwgInJ1bldoZW4iLCAiZWplY3QiLCAiaWQiLCAiZm9yRWFjaEhhbmRsZXIiLCAiaDIiLCAicmVxdWlyZV9ub3JtYWxpemVIZWFkZXJOYW1lIiwgIm5vcm1hbGl6ZUhlYWRlck5hbWUiLCAiaGVhZGVycyIsICJub3JtYWxpemVkTmFtZSIsICJwcm9jZXNzSGVhZGVyIiwgInRvVXBwZXJDYXNlIiwgInJlcXVpcmVfQXhpb3NFcnJvciIsICJBeGlvc0Vycm9yIiwgIm1lc3NhZ2UiLCAiY29kZSIsICJjb25maWciLCAicmVxdWVzdDIiLCAicmVzcG9uc2UiLCAiRXJyb3IiLCAicmVxdWVzdCIsICJ0b0pTT04iLCAiZGVzY3JpcHRpb24iLCAibnVtYmVyIiwgImZpbGVOYW1lIiwgImxpbmVOdW1iZXIiLCAiY29sdW1uTnVtYmVyIiwgInN0YWNrIiwgInN0YXR1cyIsICJkZWZpbmVQcm9wZXJ0aWVzIiwgImVycm9yIiwgImN1c3RvbVByb3BzIiwgImF4aW9zRXJyb3IiLCAicmVxdWlyZV90cmFuc2l0aW9uYWwiLCAic2lsZW50SlNPTlBhcnNpbmciLCAiZm9yY2VkSlNPTlBhcnNpbmciLCAiY2xhcmlmeVRpbWVvdXRFcnJvciIsICJyZXF1aXJlX3RvRm9ybURhdGEiLCAidG9Gb3JtRGF0YSIsICJmb3JtRGF0YSIsICJjb252ZXJ0VmFsdWUiLCAiQmxvYiIsICJCdWZmZXIiLCAiYnVpbGQiLCAiZGF0YSIsICJwYXJlbnRLZXkiLCAiZWFjaCIsICJmdWxsS2V5IiwgImVsIiwgImFwcGVuZCIsICJwb3AiLCAicmVxdWlyZV9zZXR0bGUiLCAic2V0dGxlIiwgInJlc29sdmUiLCAicmVqZWN0IiwgInZhbGlkYXRlU3RhdHVzIiwgIkVSUl9CQURfUkVRVUVTVCIsICJFUlJfQkFEX1JFU1BPTlNFIiwgIk1hdGgiLCAiZmxvb3IiLCAicmVxdWlyZV9jb29raWVzIiwgInN0YW5kYXJkQnJvd3NlckVudiIsICJ3cml0ZSIsICJleHBpcmVzIiwgInBhdGgiLCAiZG9tYWluIiwgInNlY3VyZSIsICJjb29raWUiLCAiRGF0ZSIsICJ0b0dNVFN0cmluZyIsICJyZWFkIiwgIm1hdGNoIiwgIlJlZ0V4cCIsICJkZWNvZGVVUklDb21wb25lbnQiLCAicmVtb3ZlIiwgIm5vdyIsICJub25TdGFuZGFyZEJyb3dzZXJFbnYiLCAicmVxdWlyZV9pc0Fic29sdXRlVVJMIiwgImlzQWJzb2x1dGVVUkwiLCAidGVzdCIsICJyZXF1aXJlX2NvbWJpbmVVUkxzIiwgImNvbWJpbmVVUkxzIiwgImJhc2VVUkwiLCAicmVsYXRpdmVVUkwiLCAicmVxdWlyZV9idWlsZEZ1bGxQYXRoIiwgImJ1aWxkRnVsbFBhdGgiLCAicmVxdWVzdGVkVVJMIiwgInJlcXVpcmVfcGFyc2VIZWFkZXJzIiwgImlnbm9yZUR1cGxpY2F0ZU9mIiwgInBhcnNlSGVhZGVycyIsICJwYXJzZWQiLCAic3BsaXQiLCAicGFyc2VyIiwgImxpbmUiLCAic3Vic3RyIiwgImNvbmNhdCIsICJyZXF1aXJlX2lzVVJMU2FtZU9yaWdpbiIsICJtc2llIiwgInVzZXJBZ2VudCIsICJ1cmxQYXJzaW5nTm9kZSIsICJjcmVhdGVFbGVtZW50IiwgIm9yaWdpblVSTCIsICJyZXNvbHZlVVJMIiwgImhyZWYiLCAic2V0QXR0cmlidXRlIiwgInByb3RvY29sIiwgImhvc3QiLCAic2VhcmNoIiwgImhhc2giLCAiaG9zdG5hbWUiLCAicG9ydCIsICJwYXRobmFtZSIsICJjaGFyQXQiLCAibG9jYXRpb24iLCAiaXNVUkxTYW1lT3JpZ2luIiwgInJlcXVlc3RVUkwiLCAicmVxdWlyZV9DYW5jZWxlZEVycm9yIiwgIkNhbmNlbGVkRXJyb3IiLCAiRVJSX0NBTkNFTEVEIiwgIl9fQ0FOQ0VMX18iLCAicmVxdWlyZV9wYXJzZVByb3RvY29sIiwgInBhcnNlUHJvdG9jb2wiLCAiZXhlYyIsICJyZXF1aXJlX3hociIsICJjb29raWVzIiwgInRyYW5zaXRpb25hbERlZmF1bHRzIiwgInhockFkYXB0ZXIiLCAiUHJvbWlzZSIsICJkaXNwYXRjaFhoclJlcXVlc3QiLCAicmVxdWVzdERhdGEiLCAicmVxdWVzdEhlYWRlcnMiLCAicmVzcG9uc2VUeXBlIiwgIm9uQ2FuY2VsZWQiLCAiZG9uZSIsICJjYW5jZWxUb2tlbiIsICJ1bnN1YnNjcmliZSIsICJzaWduYWwiLCAicmVtb3ZlRXZlbnRMaXN0ZW5lciIsICJYTUxIdHRwUmVxdWVzdCIsICJhdXRoIiwgInVzZXJuYW1lIiwgInBhc3N3b3JkIiwgInVuZXNjYXBlIiwgIkF1dGhvcml6YXRpb24iLCAiYnRvYSIsICJmdWxsUGF0aCIsICJvcGVuIiwgIm1ldGhvZCIsICJ0aW1lb3V0IiwgIm9ubG9hZGVuZCIsICJyZXNwb25zZUhlYWRlcnMiLCAiZ2V0QWxsUmVzcG9uc2VIZWFkZXJzIiwgInJlc3BvbnNlRGF0YSIsICJyZXNwb25zZVRleHQiLCAic3RhdHVzVGV4dCIsICJfcmVzb2x2ZSIsICJfcmVqZWN0IiwgImVyciIsICJvbnJlYWR5c3RhdGVjaGFuZ2UiLCAiaGFuZGxlTG9hZCIsICJyZWFkeVN0YXRlIiwgInJlc3BvbnNlVVJMIiwgInNldFRpbWVvdXQiLCAib25hYm9ydCIsICJoYW5kbGVBYm9ydCIsICJFQ09OTkFCT1JURUQiLCAib25lcnJvciIsICJoYW5kbGVFcnJvciIsICJFUlJfTkVUV09SSyIsICJvbnRpbWVvdXQiLCAiaGFuZGxlVGltZW91dCIsICJ0aW1lb3V0RXJyb3JNZXNzYWdlIiwgInRyYW5zaXRpb25hbCIsICJFVElNRURPVVQiLCAieHNyZlZhbHVlIiwgIndpdGhDcmVkZW50aWFscyIsICJ4c3JmQ29va2llTmFtZSIsICJ4c3JmSGVhZGVyTmFtZSIsICJzZXRSZXF1ZXN0SGVhZGVyIiwgIm9uRG93bmxvYWRQcm9ncmVzcyIsICJhZGRFdmVudExpc3RlbmVyIiwgIm9uVXBsb2FkUHJvZ3Jlc3MiLCAidXBsb2FkIiwgImNhbmNlbCIsICJhYm9ydCIsICJzdWJzY3JpYmUiLCAiYWJvcnRlZCIsICJzZW5kIiwgInJlcXVpcmVfbnVsbCIsICJyZXF1aXJlX2RlZmF1bHRzIiwgIkRFRkFVTFRfQ09OVEVOVF9UWVBFIiwgInNldENvbnRlbnRUeXBlSWZVbnNldCIsICJnZXREZWZhdWx0QWRhcHRlciIsICJhZGFwdGVyIiwgInByb2Nlc3MiLCAic3RyaW5naWZ5U2FmZWx5IiwgInJhd1ZhbHVlIiwgImVuY29kZXIiLCAicGFyc2UiLCAiZSIsICJkZWZhdWx0cyIsICJ0cmFuc2Zvcm1SZXF1ZXN0IiwgImlzT2JqZWN0UGF5bG9hZCIsICJjb250ZW50VHlwZSIsICJfRm9ybURhdGEiLCAiZW52IiwgInRyYW5zZm9ybVJlc3BvbnNlIiwgInN0cmljdEpTT05QYXJzaW5nIiwgIm1heENvbnRlbnRMZW5ndGgiLCAibWF4Qm9keUxlbmd0aCIsICJjb21tb24iLCAiZm9yRWFjaE1ldGhvZE5vRGF0YSIsICJmb3JFYWNoTWV0aG9kV2l0aERhdGEiLCAicmVxdWlyZV90cmFuc2Zvcm1EYXRhIiwgInRyYW5zZm9ybURhdGEiLCAiZm5zIiwgImNvbnRleHQiLCAidHJhbnNmb3JtIiwgInJlcXVpcmVfaXNDYW5jZWwiLCAiaXNDYW5jZWwiLCAicmVxdWlyZV9kaXNwYXRjaFJlcXVlc3QiLCAidGhyb3dJZkNhbmNlbGxhdGlvblJlcXVlc3RlZCIsICJ0aHJvd0lmUmVxdWVzdGVkIiwgImRpc3BhdGNoUmVxdWVzdCIsICJjbGVhbkhlYWRlckNvbmZpZyIsICJ0aGVuIiwgIm9uQWRhcHRlclJlc29sdXRpb24iLCAib25BZGFwdGVyUmVqZWN0aW9uIiwgInJlYXNvbiIsICJyZXF1aXJlX21lcmdlQ29uZmlnIiwgIm1lcmdlQ29uZmlnIiwgImNvbmZpZzEiLCAiY29uZmlnMiIsICJnZXRNZXJnZWRWYWx1ZSIsICJzb3VyY2UiLCAibWVyZ2VEZWVwUHJvcGVydGllcyIsICJ2YWx1ZUZyb21Db25maWcyIiwgImRlZmF1bHRUb0NvbmZpZzIiLCAibWVyZ2VEaXJlY3RLZXlzIiwgIm1lcmdlTWFwIiwgImtleXMiLCAiY29tcHV0ZUNvbmZpZ1ZhbHVlIiwgImNvbmZpZ1ZhbHVlIiwgInJlcXVpcmVfZGF0YSIsICJyZXF1aXJlX3ZhbGlkYXRvciIsICJWRVJTSU9OIiwgInZlcnNpb24iLCAidmFsaWRhdG9ycyIsICJ2YWxpZGF0b3IiLCAiZGVwcmVjYXRlZFdhcm5pbmdzIiwgImZvcm1hdE1lc3NhZ2UiLCAib3B0IiwgIm9wdHMiLCAiRVJSX0RFUFJFQ0FURUQiLCAiY29uc29sZSIsICJ3YXJuIiwgImFzc2VydE9wdGlvbnMiLCAic2NoZW1hIiwgImFsbG93VW5rbm93biIsICJFUlJfQkFEX09QVElPTl9WQUxVRSIsICJFUlJfQkFEX09QVElPTiIsICJyZXF1aXJlX0F4aW9zIiwgIkF4aW9zIiwgImluc3RhbmNlQ29uZmlnIiwgImludGVyY2VwdG9ycyIsICJjb25maWdPclVybCIsICJib29sZWFuIiwgInJlcXVlc3RJbnRlcmNlcHRvckNoYWluIiwgInN5bmNocm9ub3VzUmVxdWVzdEludGVyY2VwdG9ycyIsICJ1bnNoaWZ0UmVxdWVzdEludGVyY2VwdG9ycyIsICJpbnRlcmNlcHRvciIsICJ1bnNoaWZ0IiwgInJlc3BvbnNlSW50ZXJjZXB0b3JDaGFpbiIsICJwdXNoUmVzcG9uc2VJbnRlcmNlcHRvcnMiLCAicHJvbWlzZSIsICJjaGFpbiIsICJzaGlmdCIsICJuZXdDb25maWciLCAib25GdWxmaWxsZWQiLCAib25SZWplY3RlZCIsICJnZXRVcmkiLCAiZ2VuZXJhdGVIVFRQTWV0aG9kIiwgImlzRm9ybSIsICJodHRwTWV0aG9kIiwgInJlcXVpcmVfQ2FuY2VsVG9rZW4iLCAiQ2FuY2VsVG9rZW4iLCAiZXhlY3V0b3IiLCAiVHlwZUVycm9yIiwgInJlc29sdmVQcm9taXNlIiwgInByb21pc2VFeGVjdXRvciIsICJ0b2tlbiIsICJfbGlzdGVuZXJzIiwgIm9uZnVsZmlsbGVkIiwgImxpc3RlbmVyIiwgImluZGV4IiwgInNwbGljZSIsICJjMiIsICJyZXF1aXJlX3NwcmVhZCIsICJzcHJlYWQiLCAiY2FsbGJhY2siLCAicmVxdWlyZV9pc0F4aW9zRXJyb3IiLCAiaXNBeGlvc0Vycm9yIiwgInBheWxvYWQiLCAicmVxdWlyZV9heGlvcyIsICJjcmVhdGVJbnN0YW5jZSIsICJkZWZhdWx0Q29uZmlnIiwgImluc3RhbmNlIiwgImF4aW9zMiIsICJDYW5jZWwiLCAicHJvbWlzZXMiLCAiZGVmYXVsdCIsICJyZXF1aXJlX2F4aW9zMiIsICJyZXF1aXJlX3JlYWN0X2lzX2RldmVsb3BtZW50IiwgImhhc1N5bWJvbCIsICJTeW1ib2wiLCAiZm9yIiwgIlJFQUNUX0VMRU1FTlRfVFlQRSIsICJSRUFDVF9QT1JUQUxfVFlQRSIsICJSRUFDVF9GUkFHTUVOVF9UWVBFIiwgIlJFQUNUX1NUUklDVF9NT0RFX1RZUEUiLCAiUkVBQ1RfUFJPRklMRVJfVFlQRSIsICJSRUFDVF9QUk9WSURFUl9UWVBFIiwgIlJFQUNUX0NPTlRFWFRfVFlQRSIsICJSRUFDVF9BU1lOQ19NT0RFX1RZUEUiLCAiUkVBQ1RfQ09OQ1VSUkVOVF9NT0RFX1RZUEUiLCAiUkVBQ1RfRk9SV0FSRF9SRUZfVFlQRSIsICJSRUFDVF9TVVNQRU5TRV9UWVBFIiwgIlJFQUNUX1NVU1BFTlNFX0xJU1RfVFlQRSIsICJSRUFDVF9NRU1PX1RZUEUiLCAiUkVBQ1RfTEFaWV9UWVBFIiwgIlJFQUNUX0JMT0NLX1RZUEUiLCAiUkVBQ1RfRlVOREFNRU5UQUxfVFlQRSIsICJSRUFDVF9SRVNQT05ERVJfVFlQRSIsICJSRUFDVF9TQ09QRV9UWVBFIiwgImlzVmFsaWRFbGVtZW50VHlwZTIiLCAiJCR0eXBlb2YiLCAidHlwZU9mIiwgIm9iamVjdCIsICIkJHR5cGVvZlR5cGUiLCAiQXN5bmNNb2RlIiwgIkNvbmN1cnJlbnRNb2RlIiwgIkNvbnRleHRDb25zdW1lciIsICJDb250ZXh0UHJvdmlkZXIiLCAiRWxlbWVudCIsICJGb3J3YXJkUmVmIiwgIkZyYWdtZW50MyIsICJMYXp5IiwgIk1lbW8iLCAiUG9ydGFsIiwgIlByb2ZpbGVyIiwgIlN0cmljdE1vZGUiLCAiU3VzcGVuc2UiLCAiaGFzV2FybmVkQWJvdXREZXByZWNhdGVkSXNBc3luY01vZGUiLCAiaXNBc3luY01vZGUiLCAiaXNDb25jdXJyZW50TW9kZSIsICJpc0NvbnRleHRDb25zdW1lcjIiLCAiaXNDb250ZXh0UHJvdmlkZXIiLCAiaXNFbGVtZW50IiwgImlzRm9yd2FyZFJlZiIsICJpc0ZyYWdtZW50IiwgImlzTGF6eSIsICJpc01lbW8iLCAiaXNQb3J0YWwiLCAiaXNQcm9maWxlciIsICJpc1N0cmljdE1vZGUiLCAiaXNTdXNwZW5zZSIsICJGcmFnbWVudCIsICJpc0NvbnRleHRDb25zdW1lciIsICJpc1ZhbGlkRWxlbWVudFR5cGUiLCAicmVxdWlyZV9yZWFjdF9pcyIsICJyZXF1aXJlX29iamVjdF9hc3NpZ24iLCAiZ2V0T3duUHJvcGVydHlTeW1ib2xzIiwgInByb3BJc0VudW1lcmFibGUiLCAicHJvcGVydHlJc0VudW1lcmFibGUiLCAidG9PYmplY3QiLCAic2hvdWxkVXNlTmF0aXZlIiwgInRlc3QxIiwgInRlc3QyIiwgImZyb21DaGFyQ29kZSIsICJvcmRlcjIiLCAibWFwIiwgIm4yIiwgInRlc3QzIiwgImxldHRlciIsICJzeW1ib2xzIiwgInMyIiwgInJlcXVpcmVfUmVhY3RQcm9wVHlwZXNTZWNyZXQiLCAiUmVhY3RQcm9wVHlwZXNTZWNyZXQiLCAicmVxdWlyZV9oYXMiLCAiRnVuY3Rpb24iLCAicmVxdWlyZV9jaGVja1Byb3BUeXBlcyIsICJwcmludFdhcm5pbmciLCAibG9nZ2VkVHlwZUZhaWx1cmVzIiwgImhhcyIsICJ0ZXh0IiwgIngyIiwgImNoZWNrUHJvcFR5cGVzIiwgInR5cGVTcGVjcyIsICJ2YWx1ZXMiLCAiY29tcG9uZW50TmFtZSIsICJnZXRTdGFjayIsICJ0eXBlU3BlY05hbWUiLCAiZXgiLCAicmVzZXRXYXJuaW5nQ2FjaGUiLCAicmVxdWlyZV9mYWN0b3J5V2l0aFR5cGVDaGVja2VycyIsICJSZWFjdElzIiwgImVtcHR5RnVuY3Rpb25UaGF0UmV0dXJuc051bGwiLCAiaXNWYWxpZEVsZW1lbnQiLCAidGhyb3dPbkRpcmVjdEFjY2VzcyIsICJJVEVSQVRPUl9TWU1CT0wiLCAiaXRlcmF0b3IiLCAiRkFVWF9JVEVSQVRPUl9TWU1CT0wiLCAiZ2V0SXRlcmF0b3JGbiIsICJtYXliZUl0ZXJhYmxlIiwgIml0ZXJhdG9yRm4iLCAiQU5PTllNT1VTIiwgIlJlYWN0UHJvcFR5cGVzIiwgImFycmF5IiwgImNyZWF0ZVByaW1pdGl2ZVR5cGVDaGVja2VyIiwgImJpZ2ludCIsICJib29sIiwgImZ1bmMiLCAic3RyaW5nIiwgInN5bWJvbCIsICJhbnkiLCAiY3JlYXRlQW55VHlwZUNoZWNrZXIiLCAiYXJyYXlPZiIsICJjcmVhdGVBcnJheU9mVHlwZUNoZWNrZXIiLCAiZWxlbWVudCIsICJjcmVhdGVFbGVtZW50VHlwZUNoZWNrZXIiLCAiZWxlbWVudFR5cGUiLCAiY3JlYXRlRWxlbWVudFR5cGVUeXBlQ2hlY2tlciIsICJpbnN0YW5jZU9mIiwgImNyZWF0ZUluc3RhbmNlVHlwZUNoZWNrZXIiLCAibm9kZSIsICJjcmVhdGVOb2RlQ2hlY2tlciIsICJvYmplY3RPZiIsICJjcmVhdGVPYmplY3RPZlR5cGVDaGVja2VyIiwgIm9uZU9mIiwgImNyZWF0ZUVudW1UeXBlQ2hlY2tlciIsICJvbmVPZlR5cGUiLCAiY3JlYXRlVW5pb25UeXBlQ2hlY2tlciIsICJzaGFwZSIsICJjcmVhdGVTaGFwZVR5cGVDaGVja2VyIiwgImV4YWN0IiwgImNyZWF0ZVN0cmljdFNoYXBlVHlwZUNoZWNrZXIiLCAiaXMiLCAieTIiLCAiUHJvcFR5cGVFcnJvciIsICJjcmVhdGVDaGFpbmFibGVUeXBlQ2hlY2tlciIsICJ2YWxpZGF0ZTIiLCAibWFudWFsUHJvcFR5cGVDYWxsQ2FjaGUiLCAibWFudWFsUHJvcFR5cGVXYXJuaW5nQ291bnQiLCAiY2hlY2tUeXBlIiwgImlzUmVxdWlyZWQiLCAicHJvcE5hbWUiLCAicHJvcEZ1bGxOYW1lIiwgInNlY3JldCIsICJjYWNoZUtleSIsICJjaGFpbmVkQ2hlY2tUeXBlIiwgImV4cGVjdGVkVHlwZSIsICJwcm9wVmFsdWUiLCAicHJvcFR5cGUiLCAiZ2V0UHJvcFR5cGUiLCAicHJlY2lzZVR5cGUiLCAiZ2V0UHJlY2lzZVR5cGUiLCAidHlwZUNoZWNrZXIiLCAiZXhwZWN0ZWRDbGFzcyIsICJleHBlY3RlZENsYXNzTmFtZSIsICJhY3R1YWxDbGFzc05hbWUiLCAiZ2V0Q2xhc3NOYW1lIiwgImV4cGVjdGVkVmFsdWVzIiwgInZhbHVlc1N0cmluZyIsICJyZXBsYWNlciIsICJhcnJheU9mVHlwZUNoZWNrZXJzIiwgImNoZWNrZXIiLCAiZ2V0UG9zdGZpeEZvclR5cGVXYXJuaW5nIiwgImV4cGVjdGVkVHlwZXMiLCAiaTMiLCAiY2hlY2tlcjIiLCAiY2hlY2tlclJlc3VsdCIsICJleHBlY3RlZFR5cGVzTWVzc2FnZSIsICJpc05vZGUiLCAiaW52YWxpZFZhbGlkYXRvckVycm9yIiwgInNoYXBlVHlwZXMiLCAiYWxsS2V5cyIsICJldmVyeSIsICJzdGVwIiwgImVudHJpZXMiLCAibmV4dCIsICJlbnRyeSIsICJpc1N5bWJvbCIsICJQcm9wVHlwZXMiLCAicmVxdWlyZV9wcm9wX3R5cGVzIiwgInJlcXVpcmVfaG9pc3Rfbm9uX3JlYWN0X3N0YXRpY3NfY2pzIiwgInJlYWN0SXMiLCAiUkVBQ1RfU1RBVElDUyIsICJjaGlsZENvbnRleHRUeXBlcyIsICJjb250ZXh0VHlwZSIsICJjb250ZXh0VHlwZXMiLCAiZGVmYXVsdFByb3BzIiwgImRpc3BsYXlOYW1lIiwgImdldERlZmF1bHRQcm9wcyIsICJnZXREZXJpdmVkU3RhdGVGcm9tRXJyb3IiLCAiZ2V0RGVyaXZlZFN0YXRlRnJvbVByb3BzIiwgIm1peGlucyIsICJwcm9wVHlwZXMiLCAiS05PV05fU1RBVElDUyIsICJjYWxsZXIiLCAiY2FsbGVlIiwgImFyaXR5IiwgIkZPUldBUkRfUkVGX1NUQVRJQ1MiLCAicmVuZGVyIiwgIk1FTU9fU1RBVElDUyIsICJjb21wYXJlIiwgIlRZUEVfU1RBVElDUyIsICJnZXRTdGF0aWNzIiwgImNvbXBvbmVudCIsICJvYmplY3RQcm90b3R5cGUiLCAiaG9pc3ROb25SZWFjdFN0YXRpY3MiLCAidGFyZ2V0Q29tcG9uZW50IiwgInNvdXJjZUNvbXBvbmVudCIsICJibGFja2xpc3QiLCAiaW5oZXJpdGVkQ29tcG9uZW50IiwgInRhcmdldFN0YXRpY3MiLCAic291cmNlU3RhdGljcyIsICJkZXNjcmlwdG9yIiwgInJlcXVpcmVfcmVhY3RfaXNfZGV2ZWxvcG1lbnQyIiwgIlJFQUNUX1NFUlZFUl9CTE9DS19UWVBFIiwgIlJFQUNUX09QQVFVRV9JRF9UWVBFIiwgIlJFQUNUX0RFQlVHX1RSQUNJTkdfTU9ERV9UWVBFIiwgIlJFQUNUX09GRlNDUkVFTl9UWVBFIiwgIlJFQUNUX0xFR0FDWV9ISURERU5fVFlQRSIsICJzeW1ib2xGb3IiLCAiZW5hYmxlU2NvcGVBUEkiLCAiaGFzV2FybmVkQWJvdXREZXByZWNhdGVkSXNDb25jdXJyZW50TW9kZSIsICJyZXF1aXJlX3JlYWN0X2lzMiIsICJyZXF1aXJlX2xvZGFzaCIsICJhc3luY1RhZyIsICJmdW5jVGFnIiwgImdlblRhZyIsICJudWxsVGFnIiwgInByb3h5VGFnIiwgInVuZGVmaW5lZFRhZyIsICJmcmVlR2xvYmFsIiwgImdsb2JhbCIsICJmcmVlU2VsZiIsICJzZWxmIiwgInJvb3QiLCAib2JqZWN0UHJvdG8iLCAibmF0aXZlT2JqZWN0VG9TdHJpbmciLCAiU3ltYm9sMiIsICJzeW1Ub1N0cmluZ1RhZyIsICJ0b1N0cmluZ1RhZyIsICJiYXNlR2V0VGFnIiwgImdldFJhd1RhZyIsICJvYmplY3RUb1N0cmluZyIsICJpc093biIsICJ0YWciLCAidW5tYXNrZWQiLCAiaW1wb3J0X2F4aW9zIiwgIkRFRkFVTFRfQ09ORklHIiwgImF4aW9zSW5zdGFuY2VzIiwgImNyZWF0ZUF4aW9zSW5zdGFuY2UiLCAiaW5zdGFuY2VOYW1lIiwgImF4aW9zSW5zdGFuY2UiLCAid2l0aEZ1bGxSZXNwb25zZSIsICJ2YWxpZGF0ZSIsICJ2YWxpZGF0aW9ucyIsICJfaSIsICJ2YWxpZGF0aW9uc18xIiwgInZhbGlkYXRpb24iLCAiY29uZGl0aW9uIiwgImVycm9yTWVzc2FnZSIsICJ2YWxpZGF0ZV9kZWZhdWx0IiwgInBsdWdpbkZhY3RvcnlfZGVmYXVsdCIsICJwbHVnaW4iLCAib25TdG9yZUNyZWF0ZWQiLCAib25Nb2RlbCIsICJtaWRkbGV3YXJlIiwgIm9uSW5pdCIsICJleHBvc2VkIiwgIl9hIiwgIl9iIiwgIl9jIiwgIl9fYXdhaXRlciIsICJfYXJndW1lbnRzIiwgIlAyIiwgImdlbmVyYXRvciIsICJhZG9wdCIsICJfX2dlbmVyYXRvciIsICJib2R5IiwgIl8yIiwgImxhYmVsIiwgInNlbnQiLCAidDIiLCAidHJ5cyIsICJvcHMiLCAiZjIiLCAiZzIiLCAidmVyYiIsICJvcCIsICJkaXNwYXRjaFBsdWdpbiIsICJzdG9yZURpc3BhdGNoIiwgImFjdGlvbiIsICJzdGF0ZSIsICJzdG9yZUdldFN0YXRlIiwgImRpc3BhdGNoIiwgImNyZWF0ZURpc3BhdGNoZXIiLCAibW9kZWxOYW1lIiwgInJlZHVjZXJOYW1lIiwgIl90aGlzIiwgIm1ldGEiLCAic3RvcmUiLCAiZ2V0U3RhdGUiLCAibW9kZWwiLCAicmVkdWNlcnMiLCAiZGlzcGF0Y2hfZGVmYXVsdCIsICJfX2F3YWl0ZXIyIiwgIl9fZ2VuZXJhdG9yMiIsICJlZmZlY3RzUGx1Z2luIiwgImVmZmVjdHMiLCAiZWZmZWN0TmFtZSIsICJpc0VmZmVjdCIsICJlZmZlY3RzX2RlZmF1bHQiLCAicmVkdXhfZXhwb3J0cyIsICJfX0RPX05PVF9VU0VfX0FjdGlvblR5cGVzIiwgIkFjdGlvblR5cGVzIiwgImFwcGx5TWlkZGxld2FyZSIsICJiaW5kQWN0aW9uQ3JlYXRvcnMiLCAiY29tYmluZVJlZHVjZXJzIiwgImNvbXBvc2UiLCAiY3JlYXRlU3RvcmUiLCAibGVnYWN5X2NyZWF0ZVN0b3JlIiwgIl9kZWZpbmVQcm9wZXJ0eSIsICJjb25maWd1cmFibGUiLCAid3JpdGFibGUiLCAib3duS2V5cyIsICJlbnVtZXJhYmxlT25seSIsICJzeW0iLCAiX29iamVjdFNwcmVhZDIiLCAiZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9ycyIsICIkJG9ic2VydmFibGUiLCAib2JzZXJ2YWJsZSIsICJyYW5kb21TdHJpbmciLCAicmFuZG9tU3RyaW5nMiIsICJyYW5kb20iLCAic3Vic3RyaW5nIiwgIklOSVQiLCAiUkVQTEFDRSIsICJQUk9CRV9VTktOT1dOX0FDVElPTiIsICJwcm90byIsICJtaW5pS2luZE9mIiwgImlzRXJyb3IiLCAiY29uc3RydWN0b3JOYW1lIiwgImN0b3JOYW1lIiwgInN0YWNrVHJhY2VMaW1pdCIsICJ0b0RhdGVTdHJpbmciLCAiZ2V0RGF0ZSIsICJzZXREYXRlIiwgInR5cGVPZlZhbCIsICJyZWR1Y2VyIiwgInByZWxvYWRlZFN0YXRlIiwgImVuaGFuY2VyIiwgIl9yZWYyIiwgImZvcm1hdFByb2RFcnJvck1lc3NhZ2UiLCAiY3VycmVudFJlZHVjZXIiLCAiY3VycmVudFN0YXRlIiwgImN1cnJlbnRMaXN0ZW5lcnMiLCAibmV4dExpc3RlbmVycyIsICJpc0Rpc3BhdGNoaW5nIiwgImVuc3VyZUNhbk11dGF0ZU5leHRMaXN0ZW5lcnMiLCAiaXNTdWJzY3JpYmVkIiwgImxpc3RlbmVycyIsICJyZXBsYWNlUmVkdWNlciIsICJuZXh0UmVkdWNlciIsICJfcmVmIiwgIm91dGVyU3Vic2NyaWJlIiwgInN1YnNjcmliZTIiLCAib2JzZXJ2ZXIiLCAib2JzZXJ2ZVN0YXRlIiwgIndhcm5pbmciLCAiZ2V0VW5leHBlY3RlZFN0YXRlU2hhcGVXYXJuaW5nTWVzc2FnZSIsICJpbnB1dFN0YXRlIiwgInVuZXhwZWN0ZWRLZXlDYWNoZSIsICJyZWR1Y2VyS2V5cyIsICJhcmd1bWVudE5hbWUiLCAidW5leHBlY3RlZEtleXMiLCAiYXNzZXJ0UmVkdWNlclNoYXBlIiwgImluaXRpYWxTdGF0ZSIsICJmaW5hbFJlZHVjZXJzIiwgImZpbmFsUmVkdWNlcktleXMiLCAic2hhcGVBc3NlcnRpb25FcnJvciIsICJjb21iaW5hdGlvbiIsICJ3YXJuaW5nTWVzc2FnZSIsICJoYXNDaGFuZ2VkIiwgIm5leHRTdGF0ZTMiLCAiX2tleSIsICJwcmV2aW91c1N0YXRlRm9yS2V5IiwgIm5leHRTdGF0ZUZvcktleSIsICJhY3Rpb25UeXBlIiwgImJpbmRBY3Rpb25DcmVhdG9yIiwgImFjdGlvbkNyZWF0b3IiLCAiYWN0aW9uQ3JlYXRvcnMiLCAiYm91bmRBY3Rpb25DcmVhdG9ycyIsICJfbGVuIiwgImZ1bmNzIiwgImFyZyIsICJyZWR1Y2UiLCAibWlkZGxld2FyZXMiLCAiY3JlYXRlU3RvcmUzIiwgIl9kaXNwYXRjaCIsICJtaWRkbGV3YXJlQVBJIiwgImlzQ3J1c2hlZCIsICJpc0xpc3RlbmVyX2RlZmF1bHQiLCAiX19hc3NpZ24iLCAicDIiLCAiX19yZXN0IiwgIl9fc3ByZWFkQXJyYXlzIiwgImlsIiwgInIyIiwgImsyIiwgImoyIiwgImpsIiwgImNvbXBvc2VFbmhhbmNlcnNXaXRoRGV2dG9vbHMiLCAiZGV2dG9vbE9wdGlvbnMiLCAiZGlzYWJsZWQiLCAiX19SRURVWF9ERVZUT09MU19FWFRFTlNJT05fQ09NUE9TRV9fIiwgInJlZHV4X2RlZmF1bHQiLCAicmVkdXgiLCAibW9kZWxzIiwgImNvbWJpbmVSZWR1Y2VyczIiLCAiaW5pdGlhbFN0YXRlcyIsICJtZXJnZVJlZHVjZXJzIiwgIm5leHRSZWR1Y2VycyIsICJjcmVhdGVNb2RlbFJlZHVjZXIiLCAibW9kZWwyIiwgIm1vZGVsQmFzZVJlZHVjZXIiLCAiYmFzZVJlZHVjZXIiLCAibW9kZWxSZWR1Y2VycyIsICJfaTIiLCAiX2EyIiwgIm1vZGVsUmVkdWNlciIsICJjb21iaW5lZFJlZHVjZXIiLCAiYWN0aW9uMiIsICJtb2RlbHNfMSIsICJjcmVhdGVSb290UmVkdWNlciIsICJyb290UmVkdWNlcnMiLCAibWVyZ2VkUmVkdWNlcnMiLCAicm9vdFJlZHVjZXJBY3Rpb24iLCAicm9vdFJlZHVjZXIiLCAiZW5oYW5jZXJzIiwgIl9fYXNzaWduMiIsICJjb3JlUGx1Z2lucyIsICJJY2VzdG9yZSIsICJJY2VzdG9yZTIiLCAicGx1Z2lucyIsICJnZXRNb2RlbHMiLCAicGx1Z2luRmFjdG9yeSIsICJmb3JFYWNoUGx1Z2luIiwgImFkZE1vZGVsIiwgImluaXQiLCAiaWNlc3RvcmUiLCAicmV0dXJuZWQiLCAiaW1wb3J0X3Byb3BfdHlwZXMiLCAiUmVhY3RSZWR1eENvbnRleHQiLCAiZGVmYXVsdE5vb3BCYXRjaCIsICJiYXRjaCIsICJzZXRCYXRjaCIsICJzZXRCYXRjaDIiLCAibmV3QmF0Y2giLCAiZ2V0QmF0Y2giLCAiZ2V0QmF0Y2gyIiwgImNyZWF0ZUxpc3RlbmVyQ29sbGVjdGlvbiIsICJiYXRjaDIiLCAiZmlyc3QiLCAibGFzdCIsICJjbGVhciIsICJub3RpZnkiLCAibm90aWZ5MiIsICJnZXQyIiwgInByZXYiLCAibnVsbExpc3RlbmVycyIsICJjcmVhdGVTdWJzY3JpcHRpb24iLCAicGFyZW50U3ViIiwgImFkZE5lc3RlZFN1YiIsICJ0cnlTdWJzY3JpYmUiLCAibm90aWZ5TmVzdGVkU3VicyIsICJoYW5kbGVDaGFuZ2VXcmFwcGVyIiwgInN1YnNjcmlwdGlvbiIsICJvblN0YXRlQ2hhbmdlIiwgIkJvb2xlYW4iLCAidHJ5VW5zdWJzY3JpYmUiLCAiZ2V0TGlzdGVuZXJzIiwgInVzZUlzb21vcnBoaWNMYXlvdXRFZmZlY3QiLCAiUHJvdmlkZXIiLCAiY2hpbGRyZW4iLCAiY29udGV4dFZhbHVlIiwgInByZXZpb3VzU3RhdGUiLCAiQ29udGV4dDIiLCAiaW1wb3J0X2hvaXN0X25vbl9yZWFjdF9zdGF0aWNzIiwgImltcG9ydF9yZWFjdF9pcyIsICJyYW5kb21TdHJpbmczIiwgIkFjdGlvblR5cGVzMiIsICJTRVRfU1RBVEUiLCAiYWN0aW9uVHlwZXNfZGVmYXVsdCIsICJuIiwgIlkiLCAibzIiLCAibjMiLCAiciIsICJRIiwgInQiLCAicjMiLCAiWiIsICJMIiwgInMiLCAidiIsICJpIiwgIm8iLCAibm4iLCAidDMiLCAidSIsICJhIiwgImYiLCAic2V0IiwgImRlbGV0ZSIsICJhZGQiLCAiYyIsICJYIiwgIk1hcCIsICJxIiwgIlNldCIsICJwIiwgImwiLCAicm4iLCAiZCIsICJ5IiwgImgiLCAiZnJlZXplIiwgImlzRnJvemVuIiwgImIiLCAidG4iLCAibSIsICJfIiwgIlUiLCAiaiIsICJPIiwgImciLCAiUyIsICJ3IiwgIlAiLCAiTSIsICJ4IiwgIkgiLCAibzMiLCAiQSIsICJJIiwgImsiLCAiUiIsICJEIiwgIkYiLCAieiIsICJFIiwgIk4iLCAiVCIsICJlMiIsICJDIiwgImVuIiwgIm9uIiwgInUyIiwgIlByb3h5IiwgInJldm9jYWJsZSIsICJyZXZva2UiLCAicHJveHkiLCAiSiIsICJLIiwgInQ0IiwgImEzIiwgImYzIiwgInMzIiwgImUzIiwgIm80IiwgIm40IiwgIm1pbiIsICJHIiwgIlciLCAiQiIsICJSZWZsZWN0IiwgImRlbGV0ZVByb3BlcnR5IiwgInNldFByb3RvdHlwZU9mIiwgImlzTmFOIiwgInBhcnNlSW50IiwgInVuIiwgInByb2R1Y2UiLCAicjQiLCAicHJvZHVjZVdpdGhQYXRjaGVzIiwgImk0IiwgInI1IiwgInVzZVByb3hpZXMiLCAic2V0VXNlUHJveGllcyIsICJhdXRvRnJlZXplIiwgInNldEF1dG9GcmVlemUiLCAiY3JlYXRlRHJhZnQiLCAiZmluaXNoRHJhZnQiLCAiYXBwbHlQYXRjaGVzIiwgIiQiLCAiYW4iLCAiZm4iLCAiY24iLCAic24iLCAidm4iLCAicG4iLCAibG4iLCAiZG4iLCAiX19hc3NpZ24zIiwgImNudFN0YXRlIiwgIm5leHRTdGF0ZSIsICJfX2Fzc2lnbjQiLCAiZGVmYXVsdFZhbHVlIiwgImNudFN0YXRlMiIsICJuZXh0U3RhdGUyIiwgImltcG9ydF9sb2Rhc2giLCAiU0VUX1NUQVRFMiIsICJDb250ZXh0IiwgIkF1dGhQcm92aWRlciIsICJkZWZpbmVQYWdlQ29uZmlnIiwgInBhZ2VDb25maWc0IiwgInBhZ2VDb25maWciLCAicGFnZUNvbmZpZzIiLCAicGFnZUNvbmZpZzMiLCAicm91dGVzX2NvbmZpZ19kZWZhdWx0IiwgImNyZWF0ZU1vZGVsIiwgInN0YXRlIiwgImN1cnJlbnRVc2VyIiwgInJlZHVjZXJzIiwgInVwZGF0ZUN1cnJlbnRVc2VyIiwgInByZXZTdGF0ZSIsICJwYXlsb2FkIiwgImNyZWF0ZVN0b3JlIiwgInVzZXIiLCAicnVudGltZU1vZHVsZXMiLCAiY29tbW9ucyIsICJzdGF0aWNzIiwgImdldFJvdXRlckJhc2VuYW1lIiwgImFwcENvbmZpZyIsICJnZXRBcHBDb25maWciLCAiYXBwIiwgInJvdXRlciIsICJiYXNlbmFtZSIsICJzZXRSdW50aW1lRW52IiwgInJlbmRlck1vZGUiLCAicHJvY2VzcyIsICJlbnYiLCAiSUNFX0NPUkVfU1NHIiwgIklDRV9DT1JFX1NTUiIsICJyZW5kZXJUb0hUTUwiLCAicmVxdWVzdENvbnRleHQiLCAib3B0aW9ucyIsICJkb2N1bWVudE9ubHkiLCAic2VydmVyT25seUJhc2VuYW1lIiwgInJvdXRlUGF0aCIsICJkaXNhYmxlRmFsbGJhY2siLCAiYXNzZXRzTWFuaWZlc3QiLCAicm91dGVzIiwgIkRvY3VtZW50IiwgInJvdXRlc0NvbmZpZyIsICJydW50aW1lT3B0aW9ucyIsICJhcHBTdG9yZSIsICJyZW5kZXJUb1Jlc3BvbnNlIiwgInJ1bnRpbWUiXQp9Cg==
