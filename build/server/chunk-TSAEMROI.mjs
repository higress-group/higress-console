var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// node_modules/axios/lib/helpers/bind.js
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

// node_modules/axios/lib/utils.js
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
    function isObject2(val) {
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
      return isObject2(val) && isFunction2(val.pipe);
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
        obj = [obj];
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
    function merge2() {
      var result = {};
      function assignValue(val, key) {
        if (isPlainObject3(result[key]) && isPlainObject3(val)) {
          result[key] = merge2(result[key], val);
        } else if (isPlainObject3(val)) {
          result[key] = merge2({}, val);
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
      isObject: isObject2,
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
      merge: merge2,
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

// node_modules/axios/lib/helpers/buildURL.js
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
            val = [val];
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

// node_modules/axios/lib/core/InterceptorManager.js
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

// node_modules/axios/lib/helpers/normalizeHeaderName.js
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

// node_modules/axios/lib/core/AxiosError.js
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
      descriptors[code] = { value: code };
    });
    Object.defineProperties(AxiosError, descriptors);
    Object.defineProperty(prototype, "isAxiosError", { value: true });
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

// node_modules/axios/lib/defaults/transitional.js
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

// node_modules/axios/lib/helpers/toFormData.js
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
          return typeof Blob === "function" ? new Blob([value]) : Buffer.from(value);
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

// node_modules/axios/lib/core/settle.js
var require_settle = __commonJS({
  "node_modules/axios/lib/core/settle.js"(exports, module) {
    "use strict";
    var AxiosError = require_AxiosError();
    module.exports = function settle(resolve, reject, response) {
      var validateStatus = response.config.validateStatus;
      if (!response.status || !validateStatus || validateStatus(response.status)) {
        resolve(response);
      } else {
        reject(new AxiosError(
          "Request failed with status code " + response.status,
          [AxiosError.ERR_BAD_REQUEST, AxiosError.ERR_BAD_RESPONSE][Math.floor(response.status / 100) - 4],
          response.config,
          response.request,
          response
        ));
      }
    };
  }
});

// node_modules/axios/lib/helpers/cookies.js
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

// node_modules/axios/lib/helpers/isAbsoluteURL.js
var require_isAbsoluteURL = __commonJS({
  "node_modules/axios/lib/helpers/isAbsoluteURL.js"(exports, module) {
    "use strict";
    module.exports = function isAbsoluteURL(url) {
      return /^([a-z][a-z\d+\-.]*:)?\/\//i.test(url);
    };
  }
});

// node_modules/axios/lib/helpers/combineURLs.js
var require_combineURLs = __commonJS({
  "node_modules/axios/lib/helpers/combineURLs.js"(exports, module) {
    "use strict";
    module.exports = function combineURLs(baseURL, relativeURL) {
      return relativeURL ? baseURL.replace(/\/+$/, "") + "/" + relativeURL.replace(/^\/+/, "") : baseURL;
    };
  }
});

// node_modules/axios/lib/core/buildFullPath.js
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

// node_modules/axios/lib/helpers/parseHeaders.js
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
            parsed[key] = (parsed[key] ? parsed[key] : []).concat([val]);
          } else {
            parsed[key] = parsed[key] ? parsed[key] + ", " + val : val;
          }
        }
      });
      return parsed;
    };
  }
});

// node_modules/axios/lib/helpers/isURLSameOrigin.js
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

// node_modules/axios/lib/cancel/CanceledError.js
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

// node_modules/axios/lib/helpers/parseProtocol.js
var require_parseProtocol = __commonJS({
  "node_modules/axios/lib/helpers/parseProtocol.js"(exports, module) {
    "use strict";
    module.exports = function parseProtocol(url) {
      var match = /^([-+\w]{1,25})(:?\/\/|:)/.exec(url);
      return match && match[1] || "";
    };
  }
});

// node_modules/axios/lib/adapters/xhr.js
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
          reject(new AxiosError(
            timeoutErrorMessage,
            transitional.clarifyTimeoutError ? AxiosError.ETIMEDOUT : AxiosError.ECONNABORTED,
            config,
            request2
          ));
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
        if (protocol && ["http", "https", "file"].indexOf(protocol) === -1) {
          reject(new AxiosError("Unsupported protocol " + protocol + ":", AxiosError.ERR_BAD_REQUEST, config));
          return;
        }
        request2.send(requestData);
      });
    };
  }
});

// node_modules/axios/lib/helpers/null.js
var require_null = __commonJS({
  "node_modules/axios/lib/helpers/null.js"(exports, module) {
    module.exports = null;
  }
});

// node_modules/axios/lib/defaults/index.js
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
      transformRequest: [function transformRequest(data, headers) {
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
          return toFormData(isFileList ? { "files[]": data } : data, _FormData && new _FormData());
        } else if (isObjectPayload || contentType === "application/json") {
          setContentTypeIfUnset(headers, "application/json");
          return stringifySafely(data);
        }
        return data;
      }],
      transformResponse: [function transformResponse(data) {
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
      }],
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
    utils.forEach(["delete", "get", "head"], function forEachMethodNoData(method) {
      defaults.headers[method] = {};
    });
    utils.forEach(["post", "put", "patch"], function forEachMethodWithData(method) {
      defaults.headers[method] = utils.merge(DEFAULT_CONTENT_TYPE);
    });
    module.exports = defaults;
  }
});

// node_modules/axios/lib/core/transformData.js
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

// node_modules/axios/lib/cancel/isCancel.js
var require_isCancel = __commonJS({
  "node_modules/axios/lib/cancel/isCancel.js"(exports, module) {
    "use strict";
    module.exports = function isCancel(value) {
      return !!(value && value.__CANCEL__);
    };
  }
});

// node_modules/axios/lib/core/dispatchRequest.js
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
      config.data = transformData.call(
        config,
        config.data,
        config.headers,
        config.transformRequest
      );
      config.headers = utils.merge(
        config.headers.common || {},
        config.headers[config.method] || {},
        config.headers
      );
      utils.forEach(
        ["delete", "get", "head", "post", "put", "patch", "common"],
        function cleanHeaderConfig(method) {
          delete config.headers[method];
        }
      );
      var adapter = config.adapter || defaults.adapter;
      return adapter(config).then(function onAdapterResolution(response) {
        throwIfCancellationRequested(config);
        response.data = transformData.call(
          config,
          response.data,
          response.headers,
          config.transformResponse
        );
        return response;
      }, function onAdapterRejection(reason) {
        if (!isCancel(reason)) {
          throwIfCancellationRequested(config);
          if (reason && reason.response) {
            reason.response.data = transformData.call(
              config,
              reason.response.data,
              reason.response.headers,
              config.transformResponse
            );
          }
        }
        return Promise.reject(reason);
      });
    };
  }
});

// node_modules/axios/lib/core/mergeConfig.js
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
        var merge2 = mergeMap[prop] || mergeDeepProperties;
        var configValue = merge2(prop);
        utils.isUndefined(configValue) && merge2 !== mergeDirectKeys || (config[prop] = configValue);
      });
      return config;
    };
  }
});

// node_modules/axios/lib/env/data.js
var require_data = __commonJS({
  "node_modules/axios/lib/env/data.js"(exports, module) {
    module.exports = {
      "version": "0.27.2"
    };
  }
});

// node_modules/axios/lib/helpers/validator.js
var require_validator = __commonJS({
  "node_modules/axios/lib/helpers/validator.js"(exports, module) {
    "use strict";
    var VERSION = require_data().version;
    var AxiosError = require_AxiosError();
    var validators = {};
    ["object", "boolean", "number", "function", "string", "symbol"].forEach(function(type, i2) {
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
          throw new AxiosError(
            formatMessage(opt, " has been removed" + (version ? " in " + version : "")),
            AxiosError.ERR_DEPRECATED
          );
        }
        if (version && !deprecatedWarnings[opt]) {
          deprecatedWarnings[opt] = true;
          console.warn(
            formatMessage(
              opt,
              " has been deprecated since v" + version + " and will be removed in the near future"
            )
          );
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

// node_modules/axios/lib/core/Axios.js
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
        var chain = [dispatchRequest, void 0];
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
      } catch (error) {
        return Promise.reject(error);
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
    utils.forEach(["delete", "get", "head", "options"], function forEachMethodNoData(method) {
      Axios.prototype[method] = function(url, config) {
        return this.request(mergeConfig(config || {}, {
          method,
          url,
          data: (config || {}).data
        }));
      };
    });
    utils.forEach(["post", "put", "patch"], function forEachMethodWithData(method) {
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

// node_modules/axios/lib/cancel/CancelToken.js
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
        this._listeners = [listener];
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

// node_modules/axios/lib/helpers/spread.js
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

// node_modules/axios/lib/helpers/isAxiosError.js
var require_isAxiosError = __commonJS({
  "node_modules/axios/lib/helpers/isAxiosError.js"(exports, module) {
    "use strict";
    var utils = require_utils();
    module.exports = function isAxiosError(payload) {
      return utils.isObject(payload) && payload.isAxiosError === true;
    };
  }
});

// node_modules/axios/lib/axios.js
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

// node_modules/axios/index.js
var require_axios2 = __commonJS({
  "node_modules/axios/index.js"(exports, module) {
    module.exports = require_axios();
  }
});

// node_modules/react-is/cjs/react-is.development.js
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

// node_modules/react-is/index.js
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

// node_modules/object-assign/index.js
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

// node_modules/prop-types/lib/ReactPropTypesSecret.js
var require_ReactPropTypesSecret = __commonJS({
  "node_modules/prop-types/lib/ReactPropTypesSecret.js"(exports, module) {
    "use strict";
    var ReactPropTypesSecret = "SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED";
    module.exports = ReactPropTypesSecret;
  }
});

// node_modules/prop-types/lib/has.js
var require_has = __commonJS({
  "node_modules/prop-types/lib/has.js"(exports, module) {
    module.exports = Function.call.bind(Object.prototype.hasOwnProperty);
  }
});

// node_modules/prop-types/checkPropTypes.js
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
                var err = Error(
                  (componentName || "React class") + ": " + location + " type `" + typeSpecName + "` is invalid; it must be a function, usually from the `prop-types` package, but received `" + typeof typeSpecs[typeSpecName] + "`.This often happens because of typos such as `PropTypes.function` instead of `PropTypes.func`."
                );
                err.name = "Invariant Violation";
                throw err;
              }
              error = typeSpecs[typeSpecName](values, typeSpecName, componentName, location, null, ReactPropTypesSecret);
            } catch (ex) {
              error = ex;
            }
            if (error && !(error instanceof Error)) {
              printWarning(
                (componentName || "React class") + ": type specification of " + location + " `" + typeSpecName + "` is invalid; the type checker function must return `null` or an `Error` but returned a " + typeof error + ". You may have forgotten to pass an argument to the type checker creator (arrayOf, instanceOf, objectOf, oneOf, oneOfType, and shape all require an argument)."
              );
            }
            if (error instanceof Error && !(error.message in loggedTypeFailures)) {
              loggedTypeFailures[error.message] = true;
              var stack = getStack ? getStack() : "";
              printWarning(
                "Failed " + location + " type: " + error.message + (stack != null ? stack : "")
              );
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

// node_modules/prop-types/factoryWithTypeCheckers.js
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
              var err = new Error(
                "Calling PropTypes validators directly is not supported by the `prop-types` package. Use `PropTypes.checkPropTypes()` to call them. Read more at http://fb.me/use-check-prop-types"
              );
              err.name = "Invariant Violation";
              throw err;
            } else if (typeof console !== "undefined") {
              var cacheKey = componentName + ":" + propName;
              if (!manualPropTypeCallCache[cacheKey] && manualPropTypeWarningCount < 3) {
                printWarning(
                  "You are manually calling a React.PropTypes validation function for the `" + propFullName + "` prop on `" + componentName + "`. This is deprecated and will throw in the standalone `prop-types` package. You may be seeing this warning due to a third-party PropTypes library. See https://fb.me/react-warning-dont-call-proptypes for details."
                );
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
            return new PropTypeError(
              "Invalid " + location + " `" + propFullName + "` of type " + ("`" + preciseType + "` supplied to `" + componentName + "`, expected ") + ("`" + expectedType + "`."),
              { expectedType }
            );
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
              printWarning(
                "Invalid arguments supplied to oneOf, expected an array, got " + arguments.length + " arguments. A common mistake is to write oneOf(x, y, z) instead of oneOf([x, y, z])."
              );
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
            printWarning(
              "Invalid argument supplied to oneOfType. Expected an array of check functions, but received " + getPostfixForTypeWarning(checker) + " at index " + i2 + "."
            );
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
        return new PropTypeError(
          (componentName || "React class") + ": " + location + " type `" + propFullName + "." + key + "` is invalid; it must be a function, usually from the `prop-types` package, but received `" + type + "`."
        );
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
              return new PropTypeError(
                "Invalid " + location + " `" + propFullName + "` key `" + key + "` supplied to `" + componentName + "`.\nBad object: " + JSON.stringify(props[propName], null, "  ") + "\nValid keys: " + JSON.stringify(Object.keys(shapeTypes), null, "  ")
              );
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

// node_modules/prop-types/index.js
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

// node_modules/hoist-non-react-statics/dist/hoist-non-react-statics.cjs.js
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

// node_modules/react-redux/node_modules/react-is/cjs/react-is.development.js
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

// node_modules/react-redux/node_modules/react-is/index.js
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

// node_modules/lodash.isfunction/index.js
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
      if (!isObject2(value)) {
        return false;
      }
      var tag = baseGetTag(value);
      return tag == funcTag || tag == genTag || tag == asyncTag || tag == proxyTag;
    }
    function isObject2(value) {
      var type = typeof value;
      return value != null && (type == "object" || type == "function");
    }
    module.exports = isFunction2;
  }
});

// .ice/index.ts
import { Link, Outlet, useParams, useSearchParams, useLocation, useNavigate } from "@ice/runtime/router";
import { defineAppConfig, useAppData, useData, useConfig, Meta, Title, Links, Scripts, Data, Main, history, KeepAliveOutlet, useMounted, ClientOnly, defineDataLoader, defineServerDataLoader, defineStaticDataLoader } from "@ice/runtime";

// node_modules/@ice/plugin-request/esm/request.js
var import_axios = __toESM(require_axios2(), 1);
var DEFAULT_CONFIG = {};
var axiosInstances = {
  default: import_axios.default.create(DEFAULT_CONFIG)
};
function createAxiosInstance(instanceName) {
  if (instanceName) {
    if (axiosInstances[instanceName]) {
      return axiosInstances;
    }
    axiosInstances[instanceName] = import_axios.default.create(DEFAULT_CONFIG);
  }
  return axiosInstances;
}
function setAxiosInstance(requestConfig, axiosInstance) {
  const { interceptors = {}, ...requestOptions } = requestConfig;
  Object.keys(requestOptions).forEach((key) => {
    axiosInstance.defaults[key] = requestOptions[key];
  });
  function isExist(handlers, [fulfilled, rejected]) {
    return handlers.some((item) => item.fulfilled === fulfilled && item.rejected === rejected);
  }
  if (interceptors.request) {
    const [fulfilled, rejected] = [
      interceptors.request.onConfig || function(config) {
        return config;
      },
      interceptors.request.onError || function(error) {
        return Promise.reject(error);
      }
    ];
    if (isExist(axiosInstance.interceptors.request.handlers, [fulfilled, rejected]))
      return;
    axiosInstance.interceptors.request.use(fulfilled, rejected);
  }
  if (interceptors.response) {
    const [fulfilled, rejected] = [
      interceptors.response.onConfig || function(response) {
        return response;
      },
      interceptors.response.onError || function(error) {
        return Promise.reject(error);
      }
    ];
    if (isExist(axiosInstance.interceptors.response.handlers, [fulfilled, rejected]))
      return;
    axiosInstance.interceptors.response.use(fulfilled, rejected);
  }
}
var request = async function(options) {
  try {
    const instanceName = options.instanceName ? options.instanceName : "default";
    const axiosInstance = createAxiosInstance()[instanceName];
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
["delete", "get", "head", "options"].forEach((method) => {
  request[method] = function(url, config) {
    return request(Object.assign(config || {}, {
      method,
      url
    }));
  };
});
["post", "put", "patch"].forEach((method) => {
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

// node_modules/@ice/plugin-store/esm/runtime.js
import * as React7 from "react";

// node_modules/@ice/plugin-store/esm/constants.js
var PAGE_STORE_PROVIDER = "__PAGE_STORE_PROVIDER__";
var PAGE_STORE_INITIAL_STATES = "__PAGE_STORE_INITIAL_STATES__";

// node_modules/@ice/store/esm/index.js
import React6 from "react";

// node_modules/redux-thunk/es/index.js
function createThunkMiddleware(extraArgument) {
  var middleware = function middleware2(_ref) {
    var dispatch = _ref.dispatch, getState = _ref.getState;
    return function(next) {
      return function(action) {
        if (typeof action === "function") {
          return action(dispatch, getState, extraArgument);
        }
        return next(action);
      };
    };
  };
  return middleware;
}
var thunk = createThunkMiddleware();
thunk.withExtraArgument = createThunkMiddleware;
var es_default = thunk;

// node_modules/@ice/store/esm/utils/validate.js
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

// node_modules/@ice/store/esm/pluginFactory.js
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
      for (var _b = 0, _c = ["onModel", "middleware", "onStoreCreated"]; _b < _c.length; _b++) {
        var method = _c[_b];
        if (plugin[method]) {
          result[method] = plugin[method].bind(this);
        }
      }
      return result;
    }
  };
};

// node_modules/@ice/store/esm/plugins/dispatch.js
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
  var _2 = { label: 0, sent: function() {
    if (t2[0] & 1)
      throw t2[1];
    return t2[1];
  }, trys: [], ops: [] }, f2, y2, t2, g2;
  return g2 = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g2[Symbol.iterator] = function() {
    return this;
  }), g2;
  function verb(n2) {
    return function(v2) {
      return step([n2, v2]);
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
          op = [op[0] & 2, t2.value];
        switch (op[0]) {
          case 0:
          case 1:
            t2 = op;
            break;
          case 4:
            _2.label++;
            return { value: op[1], done: false };
          case 5:
            _2.label++;
            y2 = op[1];
            op = [0];
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
        op = [6, e];
        y2 = 0;
      } finally {
        f2 = t2 = 0;
      }
    if (op[0] & 5)
      throw op[1];
    return { value: op[0] ? op[1] : void 0, done: true };
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
            action = { type: modelName + "/" + reducerName };
            if (typeof payload !== "undefined") {
              action.payload = payload;
            }
            if (typeof meta !== "undefined") {
              action.meta = meta;
            }
            return [2, this.dispatch(action)];
          });
        });
      };
    }
  },
  onStoreCreated: function(store) {
    this.storeDispatch = store.dispatch;
    this.storeGetState = store.getState;
    return { dispatch: this.dispatch };
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
      this.dispatch[model.name][reducerName] = this.createDispatcher.apply(this, [model.name, reducerName]);
    }
  }
};
var dispatch_default = dispatchPlugin;

// node_modules/@ice/store/esm/plugins/effects.js
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
  var _2 = { label: 0, sent: function() {
    if (t2[0] & 1)
      throw t2[1];
    return t2[1];
  }, trys: [], ops: [] }, f2, y2, t2, g2;
  return g2 = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g2[Symbol.iterator] = function() {
    return this;
  }), g2;
  function verb(n2) {
    return function(v2) {
      return step([n2, v2]);
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
          op = [op[0] & 2, t2.value];
        switch (op[0]) {
          case 0:
          case 1:
            t2 = op;
            break;
          case 4:
            _2.label++;
            return { value: op[1], done: false };
          case 5:
            _2.label++;
            y2 = op[1];
            op = [0];
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
        op = [6, e];
        y2 = 0;
      } finally {
        f2 = t2 = 0;
      }
    if (op[0] & 5)
      throw op[1];
    return { value: op[0] ? op[1] : void 0, done: true };
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
      this.dispatch[model.name][effectName] = this.createDispatcher.apply(this, [model.name, effectName]);
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
                  return [3, 2];
                return [4, next(action)];
              case 1:
                _a.sent();
                return [2, this.effects[action.type](action.payload, store.getState(), action.meta)];
              case 2:
                return [2, next(action)];
            }
          });
        });
      };
    };
  }
};
var effects_default = effectsPlugin;

// node_modules/redux/es/redux.js
var redux_exports = {};
__export(redux_exports, {
  __DO_NOT_USE__ActionTypes: () => ActionTypes,
  applyMiddleware: () => applyMiddleware,
  bindActionCreators: () => bindActionCreators,
  combineReducers: () => combineReducers,
  compose: () => compose,
  createStore: () => createStore,
  legacy_createStore: () => legacy_createStore
});

// node_modules/@babel/runtime/helpers/esm/defineProperty.js
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

// node_modules/@babel/runtime/helpers/esm/objectSpread2.js
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

// node_modules/redux/es/redux.js
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
function createStore(reducer, preloadedState, enhancer) {
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
    return enhancer(createStore)(reducer, preloadedState);
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
var legacy_createStore = createStore;
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

// node_modules/@ice/store/esm/utils/isListener.js
var isListener_default = function(reducer) {
  return reducer.indexOf("/") > -1;
};

// node_modules/@ice/store/esm/redux.js
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
  var disabled = devtoolOptions.disabled, options = __rest(devtoolOptions, ["disabled"]);
  return !disabled && typeof window === "object" && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__(options) : compose;
};
function redux_default(_a) {
  var _this = this;
  var redux = _a.redux, models = _a.models;
  var combineReducers2 = redux.combineReducers || combineReducers;
  var createStore3 = redux.createStore || createStore;
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
  var enhancers = composeEnhancersWithDevtools(redux.devtoolOptions).apply(void 0, __spreadArrays(redux.enhancers, [middlewares]));
  this.store = createStore3(rootReducer, initialStates, enhancers);
  return this;
}

// node_modules/@ice/store/esm/icestore.js
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
var corePlugins = [dispatch_default, effects_default];
var Icestore = function() {
  function Icestore2(config) {
    var _this = this;
    this.plugins = [];
    this.getModels = function(models) {
      return Object.keys(models).map(function(name) {
        return __assign2(__assign2({ name }, models[name]), { reducers: models[name].reducers || {} });
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
      [!model, "model config is required"],
      [typeof model.name !== "string", 'model "name" [string] is required'],
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
    var icestore = __assign2(__assign2({ name: this.config.name }, redux.store), {
      model: function(model2) {
        _this.addModel(model2);
        redux.mergeReducers(redux.createModelReducer(model2));
        redux.store.replaceReducer(redux.createRootReducer(_this.config.redux.rootReducers));
        redux.store.dispatch({ type: "@@redux/REPLACE " });
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
var icestore_default = Icestore;

// node_modules/@ice/store/esm/utils/mergeConfig.js
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
var __spreadArrays2 = function() {
  for (var s2 = 0, i2 = 0, il = arguments.length; i2 < il; i2++)
    s2 += arguments[i2].length;
  for (var r2 = Array(s2), k2 = 0, i2 = 0; i2 < il; i2++)
    for (var a2 = arguments[i2], j2 = 0, jl = a2.length; j2 < jl; j2++, k2++)
      r2[k2] = a2[j2];
  return r2;
};
var merge = function(original, next) {
  return next ? __assign3(__assign3({}, next), original || {}) : original || {};
};
var isObject = function(obj) {
  return Array.isArray(obj) || typeof obj !== "object";
};
var mergeConfig_default = function(initConfig) {
  var config = __assign3(__assign3({ name: initConfig.name, models: {}, plugins: [] }, initConfig), { redux: __assign3(__assign3({ reducers: {}, rootReducers: {}, enhancers: [], middlewares: [] }, initConfig.redux), { devtoolOptions: __assign3({ name: initConfig.name }, initConfig.redux && initConfig.redux.devtoolOptions ? initConfig.redux.devtoolOptions : {}) }) });
  if (true) {
    validate_default([
      [!Array.isArray(config.plugins), "init config.plugins must be an array"],
      [isObject(config.models), "init config.models must be an object"],
      [
        isObject(config.redux.reducers),
        "init config.redux.reducers must be an object"
      ],
      [
        !Array.isArray(config.redux.middlewares),
        "init config.redux.middlewares must be an array"
      ],
      [
        !Array.isArray(config.redux.enhancers),
        "init config.redux.enhancers must be an array of functions"
      ],
      [
        config.redux.combineReducers && typeof config.redux.combineReducers !== "function",
        "init config.redux.combineReducers must be a function"
      ],
      [
        config.redux.createStore && typeof config.redux.createStore !== "function",
        "init config.redux.createStore must be a function"
      ]
    ]);
  }
  for (var _i = 0, _a = config.plugins; _i < _a.length; _i++) {
    var plugin = _a[_i];
    if (plugin.config) {
      var models = merge(config.models, plugin.config.models);
      config.models = models;
      config.plugins = __spreadArrays2(config.plugins, plugin.config.plugins || []);
      if (plugin.config.redux) {
        config.redux.initialStates = merge(config.redux.initialStates, plugin.config.redux.initialStates);
        config.redux.reducers = merge(config.redux.reducers, plugin.config.redux.reducers);
        config.redux.rootReducers = merge(config.redux.rootReducers, plugin.config.redux.reducers);
        config.redux.enhancers = __spreadArrays2(config.redux.enhancers, plugin.config.redux.enhancers || []);
        config.redux.middlewares = __spreadArrays2(config.redux.middlewares, plugin.config.redux.middlewares || []);
        config.redux.combineReducers = config.redux.combineReducers || plugin.config.redux.combineReducers;
        config.redux.createStore = config.redux.createStore || plugin.config.redux.createStore;
      }
    }
  }
  return config;
};

// node_modules/@ice/store/esm/plugins/provider.js
import React4 from "react";

// node_modules/react-redux/es/components/Provider.js
var import_prop_types = __toESM(require_prop_types());
import React2, { useMemo } from "react";

// node_modules/react-redux/es/components/Context.js
import React from "react";
var ReactReduxContext = /* @__PURE__ */ React.createContext(null);
if (true) {
  ReactReduxContext.displayName = "ReactRedux";
}

// node_modules/react-redux/es/utils/batch.js
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

// node_modules/react-redux/es/utils/Subscription.js
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

// node_modules/react-redux/es/utils/useIsomorphicLayoutEffect.js
import { useEffect, useLayoutEffect } from "react";
var useIsomorphicLayoutEffect = typeof window !== "undefined" && typeof window.document !== "undefined" && typeof window.document.createElement !== "undefined" ? useLayoutEffect : useEffect;

// node_modules/react-redux/es/components/Provider.js
function Provider(_ref) {
  var store = _ref.store, context = _ref.context, children = _ref.children;
  var contextValue = useMemo(function() {
    var subscription = createSubscription(store);
    return {
      store,
      subscription
    };
  }, [store]);
  var previousState = useMemo(function() {
    return store.getState();
  }, [store]);
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
  }, [contextValue, previousState]);
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
var Provider_default = Provider;

// node_modules/react-redux/es/components/connectAdvanced.js
var import_hoist_non_react_statics = __toESM(require_hoist_non_react_statics_cjs());
var import_react_is = __toESM(require_react_is2());
import React3, { useContext, useMemo as useMemo2, useRef, useReducer } from "react";

// node_modules/react-redux/es/hooks/useStore.js
import { useContext as useContext3 } from "react";

// node_modules/react-redux/es/hooks/useReduxContext.js
import { useContext as useContext2 } from "react";
function useReduxContext() {
  var contextValue = useContext2(ReactReduxContext);
  if (!contextValue) {
    throw new Error("could not find react-redux context value; please ensure the component is wrapped in a <Provider>");
  }
  return contextValue;
}

// node_modules/react-redux/es/hooks/useStore.js
function createStoreHook(context) {
  if (context === void 0) {
    context = ReactReduxContext;
  }
  var useReduxContext2 = context === ReactReduxContext ? useReduxContext : function() {
    return useContext3(context);
  };
  return function useStore2() {
    var _useReduxContext = useReduxContext2(), store = _useReduxContext.store;
    return store;
  };
}
var useStore = /* @__PURE__ */ createStoreHook();

// node_modules/react-redux/es/hooks/useDispatch.js
function createDispatchHook(context) {
  if (context === void 0) {
    context = ReactReduxContext;
  }
  var useStore2 = context === ReactReduxContext ? useStore : createStoreHook(context);
  return function useDispatch2() {
    var store = useStore2();
    return store.dispatch;
  };
}

// node_modules/react-redux/es/hooks/useSelector.js
import { useReducer as useReducer2, useRef as useRef2, useMemo as useMemo3, useContext as useContext4, useDebugValue } from "react";
var refEquality = function refEquality2(a2, b2) {
  return a2 === b2;
};
function useSelectorWithStoreAndSubscription(selector, equalityFn, store, contextSub) {
  var _useReducer = useReducer2(function(s2) {
    return s2 + 1;
  }, 0), forceRender = _useReducer[1];
  var subscription = useMemo3(function() {
    return createSubscription(store, contextSub);
  }, [store, contextSub]);
  var latestSubscriptionCallbackError = useRef2();
  var latestSelector = useRef2();
  var latestStoreState = useRef2();
  var latestSelectedState = useRef2();
  var storeState = store.getState();
  var selectedState;
  try {
    if (selector !== latestSelector.current || storeState !== latestStoreState.current || latestSubscriptionCallbackError.current) {
      var newSelectedState = selector(storeState);
      if (latestSelectedState.current === void 0 || !equalityFn(newSelectedState, latestSelectedState.current)) {
        selectedState = newSelectedState;
      } else {
        selectedState = latestSelectedState.current;
      }
    } else {
      selectedState = latestSelectedState.current;
    }
  } catch (err) {
    if (latestSubscriptionCallbackError.current) {
      err.message += "\nThe error may be correlated with this previous error:\n" + latestSubscriptionCallbackError.current.stack + "\n\n";
    }
    throw err;
  }
  useIsomorphicLayoutEffect(function() {
    latestSelector.current = selector;
    latestStoreState.current = storeState;
    latestSelectedState.current = selectedState;
    latestSubscriptionCallbackError.current = void 0;
  });
  useIsomorphicLayoutEffect(function() {
    function checkForUpdates() {
      try {
        var newStoreState = store.getState();
        if (newStoreState === latestStoreState.current) {
          return;
        }
        var _newSelectedState = latestSelector.current(newStoreState);
        if (equalityFn(_newSelectedState, latestSelectedState.current)) {
          return;
        }
        latestSelectedState.current = _newSelectedState;
        latestStoreState.current = newStoreState;
      } catch (err) {
        latestSubscriptionCallbackError.current = err;
      }
      forceRender();
    }
    subscription.onStateChange = checkForUpdates;
    subscription.trySubscribe();
    checkForUpdates();
    return function() {
      return subscription.tryUnsubscribe();
    };
  }, [store, subscription]);
  return selectedState;
}
function createSelectorHook(context) {
  if (context === void 0) {
    context = ReactReduxContext;
  }
  var useReduxContext2 = context === ReactReduxContext ? useReduxContext : function() {
    return useContext4(context);
  };
  return function useSelector2(selector, equalityFn) {
    if (equalityFn === void 0) {
      equalityFn = refEquality;
    }
    if (true) {
      if (!selector) {
        throw new Error("You must pass a selector to useSelector");
      }
      if (typeof selector !== "function") {
        throw new Error("You must pass a function as a selector to useSelector");
      }
      if (typeof equalityFn !== "function") {
        throw new Error("You must pass a function as an equality function to useSelector");
      }
    }
    var _useReduxContext = useReduxContext2(), store = _useReduxContext.store, contextSub = _useReduxContext.subscription;
    var selectedState = useSelectorWithStoreAndSubscription(selector, equalityFn, store, contextSub);
    useDebugValue(selectedState);
    return selectedState;
  };
}

// node_modules/react-redux/es/utils/reactBatchedUpdates.js
import { unstable_batchedUpdates } from "react-dom";

// node_modules/react-redux/es/index.js
setBatch(unstable_batchedUpdates);

// node_modules/@ice/store/esm/actionTypes.js
var randomString3 = function() {
  return Math.random().toString(36).substring(7).split("").join(".");
};
var ActionTypes2 = {
  SET_STATE: "@@icestore_SET_STATE" + randomString3()
};
var actionTypes_default = ActionTypes2;

// node_modules/@ice/store/esm/plugins/provider.js
var SET_STATE = actionTypes_default.SET_STATE;
var provider_default = function(_a) {
  var context = _a.context;
  return {
    onStoreCreated: function(store) {
      var Provider2 = function(props) {
        var children = props.children, initialStates = props.initialStates;
        if (initialStates) {
          Object.keys(initialStates).forEach(function(name) {
            var initialState = initialStates[name];
            if (initialState && store.dispatch[name][SET_STATE]) {
              store.dispatch[name][SET_STATE](initialState);
            }
          });
        }
        return React4.createElement(Provider_default, { store, context }, children);
      };
      return { Provider: Provider2, context };
    }
  };
};

// node_modules/@ice/store/esm/plugins/reduxHooks.js
var reduxHooks_default = function(_a) {
  var context = _a.context;
  var useSelector2 = createSelectorHook(context);
  var useDispatch2 = createDispatchHook(context);
  return {
    onStoreCreated: function() {
      return {
        useSelector: useSelector2,
        useDispatch: useDispatch2
      };
    }
  };
};

// node_modules/@ice/store/esm/plugins/modelApis.js
import React5 from "react";
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
var modelApis_default = function() {
  return {
    onStoreCreated: function(store) {
      function useModel(name) {
        var state = useModelState(name);
        var dispatchers = useModelDispatchers(name);
        return [state, dispatchers];
      }
      function useModelState(name) {
        var selector = store.useSelector(function(state) {
          return state[name];
        });
        if (typeof selector !== "undefined") {
          return selector;
        }
        throw new Error("Not found model by namespace: " + name + ".");
      }
      function useModelDispatchers(name) {
        var dispatch = store.useDispatch();
        if (dispatch[name]) {
          return dispatch[name];
        }
        throw new Error("Not found model by namespace: " + name + ".");
      }
      function useModelEffectsState(name) {
        var dispatch = useModelDispatchers(name);
        var effectsLoading = useModelEffectsLoading(name);
        var effectsError = useModelEffectsError(name);
        var states = {};
        Object.keys(dispatch).forEach(function(key) {
          states[key] = {
            isLoading: effectsLoading[key],
            error: effectsError[key] ? effectsError[key].error : null
          };
        });
        return states;
      }
      function useModelEffectsError(name) {
        return store.useSelector(function(state) {
          return state.error ? state.error.effects[name] : void 0;
        });
      }
      function useModelEffectsLoading(name) {
        return store.useSelector(function(state) {
          return state.loading ? state.loading.effects[name] : void 0;
        });
      }
      function getModel(name) {
        return [getModelState(name), getModelDispatchers(name)];
      }
      function getModelState(name) {
        return store.getState()[name];
      }
      function getModelDispatchers(name) {
        return store.dispatch[name];
      }
      function withModel(name, mapModelToProps) {
        mapModelToProps = mapModelToProps || function(model) {
          var _a;
          return _a = {}, _a[name] = model, _a;
        };
        return function(Component) {
          return function(props) {
            var value = useModel(name);
            var withProps = mapModelToProps(value);
            return React5.createElement(Component, __assign4({}, withProps, props));
          };
        };
      }
      function createWithModelDispatchers(fieldSuffix) {
        if (fieldSuffix === void 0) {
          fieldSuffix = "Dispatchers";
        }
        return function withModelDispatchers2(name, mapModelDispatchersToProps) {
          mapModelDispatchersToProps = mapModelDispatchersToProps || function(dispatch) {
            var _a;
            return _a = {}, _a["" + name + fieldSuffix] = dispatch, _a;
          };
          return function(Component) {
            return function(props) {
              var dispatchers = useModelDispatchers(name);
              var withProps = mapModelDispatchersToProps(dispatchers);
              return React5.createElement(Component, __assign4({}, withProps, props));
            };
          };
        };
      }
      var withModelDispatchers = createWithModelDispatchers();
      function createWithModelEffectsState(fieldSuffix) {
        if (fieldSuffix === void 0) {
          fieldSuffix = "EffectsState";
        }
        return function(name, mapModelEffectsStateToProps) {
          mapModelEffectsStateToProps = mapModelEffectsStateToProps || function(effectsState) {
            var _a;
            return _a = {}, _a["" + name + fieldSuffix] = effectsState, _a;
          };
          return function(Component) {
            return function(props) {
              var value = useModelEffectsState(name);
              var withProps = mapModelEffectsStateToProps(value);
              return React5.createElement(Component, __assign4({}, withProps, props));
            };
          };
        };
      }
      var withModelEffectsState = createWithModelEffectsState();
      function withModelEffectsError(name, mapModelEffectsErrorToProps) {
        mapModelEffectsErrorToProps = mapModelEffectsErrorToProps || function(errors) {
          var _a;
          return _a = {}, _a[name + "EffectsError"] = errors, _a;
        };
        return function(Component) {
          return function(props) {
            var value = useModelEffectsError(name);
            var withProps = mapModelEffectsErrorToProps(value);
            return React5.createElement(Component, __assign4({}, withProps, props));
          };
        };
      }
      function withModelEffectsLoading(name, mapModelEffectsLoadingToProps) {
        mapModelEffectsLoadingToProps = mapModelEffectsLoadingToProps || function(loadings) {
          var _a;
          return _a = {}, _a[name + "EffectsLoading"] = loadings, _a;
        };
        return function(Component) {
          return function(props) {
            var value = useModelEffectsLoading(name);
            var withProps = mapModelEffectsLoadingToProps(value);
            return React5.createElement(Component, __assign4({}, withProps, props));
          };
        };
      }
      function getModelAPIs(name) {
        return {
          useValue: function() {
            return useModel(name);
          },
          useState: function() {
            return useModelState(name);
          },
          useDispatchers: function() {
            return useModelDispatchers(name);
          },
          useEffectsState: function() {
            return useModelEffectsState(name);
          },
          useEffectsError: function() {
            return useModelEffectsError(name);
          },
          useEffectsLoading: function() {
            return useModelEffectsLoading(name);
          },
          getValue: function() {
            return getModel(name);
          },
          getState: function() {
            return getModelState(name);
          },
          getDispatchers: function() {
            return getModelDispatchers(name);
          },
          withValue: function(mapToProps) {
            return withModel(name, mapToProps);
          },
          withDispatchers: function(mapToProps) {
            return withModelDispatchers(name, mapToProps);
          },
          withEffectsState: function(mapToProps) {
            return withModelEffectsState(name, mapToProps);
          },
          withEffectsError: function(mapToProps) {
            return withModelEffectsError(name, mapToProps);
          },
          withEffectsLoading: function(mapToProps) {
            return withModelEffectsLoading(name, mapToProps);
          }
        };
      }
      return {
        getModelAPIs,
        useModel,
        useModelState,
        useModelDispatchers,
        useModelEffectsState,
        useModelEffectsError,
        useModelEffectsLoading,
        getModel,
        getModelState,
        getModelDispatchers,
        withModel,
        withModelDispatchers,
        withModelEffectsState,
        withModelEffectsError,
        withModelEffectsLoading
      };
    }
  };
};

// node_modules/immer/dist/immer.esm.mjs
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
    false === o2.writable && (o2.writable = true, o2.configurable = true), (o2.get || o2.set) && (r2[i2] = { configurable: true, writable: true, enumerable: o2.enumerable, value: n2[i2] });
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
  return U = { p: [], l: U, h: n2, m: true, _: 0 };
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
    var t3 = Array.isArray(n3), e2 = { i: t3 ? 1 : 0, A: r3 ? r3.A : _(), P: false, I: false, D: {}, l: r3, t: n3, k: null, o: null, j: null, C: false }, i2 = e2, o2 = en;
    t3 && (i2 = [e2], o2 = on);
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
    return t3 ? t3.enumerable = r2 : s2[n2] = t3 = { configurable: true, enumerable: r2, get: function() {
      var r3 = this[Q];
      return f2(r3), en.get(r3, n2);
    }, set: function(r3) {
      var t4 = this[Q];
      f2(t4), en.set(t4, n2, r3);
    } }, t3;
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
  m("ES5", { J: function(n2, r2) {
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
    }(e2, n2), o3 = { i: e2 ? 5 : 4, A: r2 ? r2.A : _(), P: false, I: false, D: {}, l: r2, t: n2, k: i2, o: null, O: false, C: false };
    return Object.defineProperty(i2, Q, { value: o3, writable: true }), i2;
  }, S: function(n2, t3, o3) {
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
  }, K: function(n2) {
    return 4 === n2.i ? o2(n2) : a2(n2);
  } });
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
var Y = { 0: "Illegal state", 1: "Immer drafts cannot have computed properties", 2: "This object has been frozen and should not be mutated", 3: function(n2) {
  return "Cannot use a proxy that has been revoked. Did you pass an object from inside an immer function to an async process? " + n2;
}, 4: "An immer producer returned a new value *and* modified its draft. Either return a new value *or* modify the draft.", 5: "Immer forbids circular references", 6: "The first or second argument to `produce` must be a function", 7: "The third argument to `produce` must be a function or undefined", 8: "First argument to `createDraft` must be a plain object, an array, or an immerable object", 9: "First argument to `finishDraft` must be a draft returned by `createDraft`", 10: "The given draft is already finalized", 11: "Object.defineProperty() cannot be used on an Immer draft", 12: "Object.setPrototypeOf() cannot be used on an Immer draft", 13: "Immer only supports deleting array indices", 14: "Immer only supports setting array indices and the 'length' property", 15: function(n2) {
  return "Cannot apply patch, path doesn't resolve: " + n2;
}, 16: 'Sets cannot have "replace" patches.', 17: function(n2) {
  return "Unsupported patch operation: " + n2;
}, 18: function(n2) {
  return "The plugin for '" + n2 + "' has not been loaded into Immer. To enable the plugin, import and call `enable" + n2 + "()` when initializing your application.";
}, 20: "Cannot use proxies if Proxy, Proxy.revocable or Reflect are not available", 21: function(n2) {
  return "produce can only be called on things that are draftable: plain objects, arrays, Map, Set or classes that are marked with '[immerable]: true'. Got '" + n2 + "'";
}, 22: function(n2) {
  return "'current' expects a draft, got: " + n2;
}, 23: function(n2) {
  return "'original' expects a draft, got: " + n2;
}, 24: "Patching reserved attributes like __proto__, prototype and constructor is not allowed" };
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
var en = { get: function(n2, r2) {
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
}, has: function(n2, r2) {
  return r2 in p(n2);
}, ownKeys: function(n2) {
  return Reflect.ownKeys(p(n2));
}, set: function(n2, r2, t2) {
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
}, deleteProperty: function(n2, r2) {
  return void 0 !== z(n2.t, r2) || r2 in n2.t ? (n2.D[r2] = false, E(n2), k(n2)) : delete n2.D[r2], n2.o && delete n2.o[r2], true;
}, getOwnPropertyDescriptor: function(n2, r2) {
  var t2 = p(n2), e = Reflect.getOwnPropertyDescriptor(t2, r2);
  return e ? { writable: true, configurable: 1 !== n2.i || "length" !== r2, enumerable: e.enumerable, value: t2[r2] } : e;
}, defineProperty: function() {
  n(11);
}, getPrototypeOf: function(n2) {
  return Object.getPrototypeOf(n2.t);
}, setPrototypeOf: function() {
  n(12);
} };
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
            return (t3 = i3).call.apply(t3, [r4, n3].concat(e3));
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
            return n2.apply(void 0, [r5].concat(i4));
          });
        };
      var t2, i3, o2 = e2.produce(n2, r3, function(n3, r4) {
        t2 = n3, i3 = r4;
      });
      return "undefined" != typeof Promise && o2 instanceof Promise ? o2.then(function(n3) {
        return [n3, t2, i3];
      }) : [o2, t2, i3];
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
var immer_esm_default = fn;

// node_modules/@ice/store/esm/plugins/immer.js
N();
function createCombineReducersWithImmer(blacklist) {
  if (blacklist === void 0) {
    blacklist = [];
  }
  return function(reducers) {
    var reducersWithImmer = {};
    Object.keys(reducers).forEach(function(key) {
      var reducerFn = reducers[key];
      reducersWithImmer[key] = function(state, payload) {
        return typeof state === "object" && !blacklist.includes(key) ? immer_esm_default(state, function(draft) {
          var next = reducerFn(draft, payload);
          if (typeof next === "object")
            return next;
        }) : reducerFn(state, payload);
      };
    });
    return combineReducers(reducersWithImmer);
  };
}
var immerPlugin = function(config) {
  if (config === void 0) {
    config = {};
  }
  return {
    config: {
      redux: {
        combineReducers: createCombineReducersWithImmer(config.blacklist)
      }
    }
  };
};
var immer_default = immerPlugin;

// node_modules/@ice/store/esm/plugins/loading.js
var __assign5 = function() {
  __assign5 = Object.assign || function(t2) {
    for (var s2, i2 = 1, n2 = arguments.length; i2 < n2; i2++) {
      s2 = arguments[i2];
      for (var p2 in s2)
        if (Object.prototype.hasOwnProperty.call(s2, p2))
          t2[p2] = s2[p2];
    }
    return t2;
  };
  return __assign5.apply(this, arguments);
};
var __awaiter3 = function(thisArg, _arguments, P2, generator) {
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
var __generator3 = function(thisArg, body) {
  var _2 = { label: 0, sent: function() {
    if (t2[0] & 1)
      throw t2[1];
    return t2[1];
  }, trys: [], ops: [] }, f2, y2, t2, g2;
  return g2 = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g2[Symbol.iterator] = function() {
    return this;
  }), g2;
  function verb(n2) {
    return function(v2) {
      return step([n2, v2]);
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
          op = [op[0] & 2, t2.value];
        switch (op[0]) {
          case 0:
          case 1:
            t2 = op;
            break;
          case 4:
            _2.label++;
            return { value: op[1], done: false };
          case 5:
            _2.label++;
            y2 = op[1];
            op = [0];
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
        op = [6, e];
        y2 = 0;
      } finally {
        f2 = t2 = 0;
      }
    if (op[0] & 5)
      throw op[1];
    return { value: op[0] ? op[1] : void 0, done: true };
  }
};
var cntState = {
  global: 0,
  models: {},
  effects: {}
};
var nextState = __assign5(__assign5({}, cntState), { models: __assign5({}, cntState.models), effects: __assign5({}, cntState.effects) });
var createLoadingAction = function(converter, i2) {
  return function(state, _a) {
    var _b, _c, _d;
    var name = _a.name, action = _a.action;
    nextState.global += i2;
    if (typeof nextState.models[name] === "undefined") {
      nextState.models[name] = 0;
    }
    nextState.models[name] += i2;
    if (typeof nextState.effects[name] === "undefined") {
      nextState.effects[name] = {};
    }
    if (typeof nextState.effects[name][action] === "undefined") {
      nextState.effects[name][action] = 0;
    }
    nextState.effects[name][action] += i2;
    return __assign5(__assign5({}, state), { global: converter(nextState.global), models: __assign5(__assign5({}, state.models), (_b = {}, _b[name] = converter(nextState.models[name]), _b)), effects: __assign5(__assign5({}, state.effects), (_c = {}, _c[name] = __assign5(__assign5({}, state.effects[name]), (_d = {}, _d[action] = converter(nextState.effects[name][action]), _d)), _c)) });
  };
};
var validateConfig = function(config) {
  if (config.name && typeof config.name !== "string") {
    throw new Error("loading plugin config name must be a string");
  }
  if (config.asNumber && typeof config.asNumber !== "boolean") {
    throw new Error("loading plugin config asNumber must be a boolean");
  }
  if (config.whitelist && !Array.isArray(config.whitelist)) {
    throw new Error("loading plugin config whitelist must be an array of strings");
  }
  if (config.blacklist && !Array.isArray(config.blacklist)) {
    throw new Error("loading plugin config blacklist must be an array of strings");
  }
  if (config.whitelist && config.blacklist) {
    throw new Error("loading plugin config cannot have both a whitelist & a blacklist");
  }
};
var loading_default = function(config) {
  if (config === void 0) {
    config = {};
  }
  validateConfig(config);
  var loadingModelName = config.name || "loading";
  var converter = config.asNumber === true ? function(cnt) {
    return cnt;
  } : function(cnt) {
    return cnt > 0;
  };
  var loading = {
    name: loadingModelName,
    reducers: {
      hide: createLoadingAction(converter, -1),
      show: createLoadingAction(converter, 1)
    },
    state: __assign5({}, cntState)
  };
  cntState.global = 0;
  loading.state.global = converter(cntState.global);
  return {
    config: {
      models: {
        loading
      }
    },
    onModel: function(_a) {
      var _this = this;
      var name = _a.name;
      if (name === loadingModelName) {
        return;
      }
      cntState.models[name] = 0;
      loading.state.models[name] = converter(cntState.models[name]);
      loading.state.effects[name] = {};
      var modelActions = this.dispatch[name];
      Object.keys(modelActions).forEach(function(action) {
        if (_this.dispatch[name][action].isEffect !== true) {
          return;
        }
        cntState.effects[name][action] = 0;
        loading.state.effects[name][action] = converter(cntState.effects[name][action]);
        var actionType = name + "/" + action;
        if (config.whitelist && !config.whitelist.includes(actionType)) {
          return;
        }
        if (config.blacklist && config.blacklist.includes(actionType)) {
          return;
        }
        var origEffect = _this.dispatch[name][action];
        var effectWrapper = function() {
          var props = [];
          for (var _i = 0; _i < arguments.length; _i++) {
            props[_i] = arguments[_i];
          }
          return __awaiter3(_this, void 0, void 0, function() {
            var effectResult, error_1;
            return __generator3(this, function(_a2) {
              switch (_a2.label) {
                case 0:
                  _a2.trys.push([0, 2, , 3]);
                  this.dispatch.loading.show({ name, action });
                  return [4, origEffect.apply(void 0, props)];
                case 1:
                  effectResult = _a2.sent();
                  this.dispatch.loading.hide({ name, action });
                  return [2, effectResult];
                case 2:
                  error_1 = _a2.sent();
                  this.dispatch.loading.hide({ name, action });
                  throw error_1;
                case 3:
                  return [2];
              }
            });
          });
        };
        effectWrapper.isEffect = true;
        _this.dispatch[name][action] = effectWrapper;
      });
    }
  };
};

// node_modules/@ice/store/esm/plugins/error.js
var __assign6 = function() {
  __assign6 = Object.assign || function(t2) {
    for (var s2, i2 = 1, n2 = arguments.length; i2 < n2; i2++) {
      s2 = arguments[i2];
      for (var p2 in s2)
        if (Object.prototype.hasOwnProperty.call(s2, p2))
          t2[p2] = s2[p2];
    }
    return t2;
  };
  return __assign6.apply(this, arguments);
};
var __awaiter4 = function(thisArg, _arguments, P2, generator) {
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
var __generator4 = function(thisArg, body) {
  var _2 = { label: 0, sent: function() {
    if (t2[0] & 1)
      throw t2[1];
    return t2[1];
  }, trys: [], ops: [] }, f2, y2, t2, g2;
  return g2 = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g2[Symbol.iterator] = function() {
    return this;
  }), g2;
  function verb(n2) {
    return function(v2) {
      return step([n2, v2]);
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
          op = [op[0] & 2, t2.value];
        switch (op[0]) {
          case 0:
          case 1:
            t2 = op;
            break;
          case 4:
            _2.label++;
            return { value: op[1], done: false };
          case 5:
            _2.label++;
            y2 = op[1];
            op = [0];
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
        op = [6, e];
        y2 = 0;
      } finally {
        f2 = t2 = 0;
      }
    if (op[0] & 5)
      throw op[1];
    return { value: op[0] ? op[1] : void 0, done: true };
  }
};
var defaultValue = {
  error: null,
  value: 0
};
var cntState2 = {
  global: __assign6({}, defaultValue),
  models: {},
  effects: {}
};
var nextState2 = {
  global: __assign6({}, cntState2.global),
  models: __assign6({}, cntState2.models),
  effects: __assign6({}, cntState2.effects)
};
function fallback(value) {
  return value < 0 ? 0 : value;
}
var createErrorAction = function(converter, i2) {
  return function(state, _a, error) {
    var _b, _c, _d;
    var name = _a.name, action = _a.action;
    nextState2.global = {
      value: fallback(nextState2.global.value + i2),
      error
    };
    if (typeof nextState2.models[name] === "undefined") {
      nextState2.models[name] = __assign6({}, defaultValue);
    }
    nextState2.models[name] = {
      value: fallback(nextState2.models[name].value + i2),
      error
    };
    if (typeof nextState2.effects[name] === "undefined") {
      nextState2.effects[name] = {};
    }
    if (typeof nextState2.effects[name][action] === "undefined") {
      nextState2.effects[name][action] = __assign6({}, defaultValue);
    }
    nextState2.effects[name][action] = {
      value: fallback(nextState2.effects[name][action].value + i2),
      error
    };
    return __assign6(__assign6({}, state), { global: converter(nextState2.global), models: __assign6(__assign6({}, state.models), (_b = {}, _b[name] = converter(nextState2.models[name]), _b)), effects: __assign6(__assign6({}, state.effects), (_c = {}, _c[name] = __assign6(__assign6({}, state.effects[name]), (_d = {}, _d[action] = converter(nextState2.effects[name][action]), _d)), _c)) });
  };
};
var validateConfig2 = function(config) {
  if (config.name && typeof config.name !== "string") {
    throw new Error("error plugin config name must be a string");
  }
  if (config.asNumber && typeof config.asNumber !== "boolean") {
    throw new Error("error plugin config asNumber must be a boolean");
  }
  if (config.whitelist && !Array.isArray(config.whitelist)) {
    throw new Error("error plugin config whitelist must be an array of strings");
  }
  if (config.blacklist && !Array.isArray(config.blacklist)) {
    throw new Error("error plugin config blacklist must be an array of strings");
  }
  if (config.whitelist && config.blacklist) {
    throw new Error("error plugin config cannot have both a whitelist & a blacklist");
  }
};
var error_default = function(config) {
  if (config === void 0) {
    config = {};
  }
  validateConfig2(config);
  var errorModelName = config.name || "error";
  var converter = config.asNumber === true ? function(cnt) {
    return cnt;
  } : function(cnt) {
    return __assign6(__assign6({}, cnt), { value: cnt.value > 0 });
  };
  var error = {
    name: errorModelName,
    reducers: {
      hide: createErrorAction(converter, -1),
      show: createErrorAction(converter, 1)
    },
    state: __assign6({}, cntState2)
  };
  cntState2.global = __assign6({}, defaultValue);
  error.state.global = converter(cntState2.global);
  return {
    config: {
      models: {
        error
      }
    },
    onModel: function(_a) {
      var _this = this;
      var name = _a.name;
      if (name === errorModelName) {
        return;
      }
      cntState2.models[name] = __assign6({}, defaultValue);
      error.state.models[name] = converter(cntState2.models[name]);
      error.state.effects[name] = {};
      var modelActions = this.dispatch[name];
      Object.keys(modelActions).forEach(function(action) {
        if (_this.dispatch[name][action].isEffect !== true) {
          return;
        }
        cntState2.effects[name][action] = __assign6({}, defaultValue);
        error.state.effects[name][action] = converter(cntState2.effects[name][action]);
        var actionType = name + "/" + action;
        if (config.whitelist && !config.whitelist.includes(actionType)) {
          return;
        }
        if (config.blacklist && config.blacklist.includes(actionType)) {
          return;
        }
        var origEffect = _this.dispatch[name][action];
        var effectWrapper = function() {
          var props = [];
          for (var _i = 0; _i < arguments.length; _i++) {
            props[_i] = arguments[_i];
          }
          return __awaiter4(_this, void 0, void 0, function() {
            var error_1;
            return __generator4(this, function(_a2) {
              switch (_a2.label) {
                case 0:
                  if (nextState2.effects[name] && nextState2.effects[name][action] && nextState2.effects[name][action].error) {
                    this.dispatch.error.hide({ name, action }, null);
                  }
                  _a2.label = 1;
                case 1:
                  _a2.trys.push([1, 3, , 4]);
                  return [4, origEffect.apply(void 0, props)];
                case 2:
                  return [2, _a2.sent()];
                case 3:
                  error_1 = _a2.sent();
                  console.error(error_1);
                  this.dispatch.error.show({ name, action }, error_1);
                  return [3, 4];
                case 4:
                  return [2];
              }
            });
          });
        };
        effectWrapper.isEffect = true;
        _this.dispatch[name][action] = effectWrapper;
      });
    }
  };
};

// node_modules/@ice/store/esm/utils/checkModels.js
var import_lodash = __toESM(require_lodash());
function checkModels(originModels) {
  Object.keys(originModels).forEach(function(name) {
    var model = originModels[name];
    if (model.effects && !(0, import_lodash.default)(model.effects)) {
      throw new Error("Model(" + name + "): Defining effects as objects has been detected, please use `{ effects: () => ({ effectName: () => {} }) }` instead. \n\n\n Visit https://github.com/ice-lab/icestore/blob/master/docs/upgrade-guidelines.md#define-model-effects to learn about how to upgrade.");
    }
    if (model.actions) {
      throw new Error("Model(" + name + "): The actions field has been detected, please use `reducers` and `effects` instead. Visit https://github.com/ice-lab/icestore/blob/master/docs/upgrade-guidelines.md#define-model-actions to learn about how to upgrade.");
    }
  });
}

// node_modules/@ice/store/esm/utils/appendReducers.js
var __assign7 = function() {
  __assign7 = Object.assign || function(t2) {
    for (var s2, i2 = 1, n2 = arguments.length; i2 < n2; i2++) {
      s2 = arguments[i2];
      for (var p2 in s2)
        if (Object.prototype.hasOwnProperty.call(s2, p2))
          t2[p2] = s2[p2];
    }
    return t2;
  };
  return __assign7.apply(this, arguments);
};
var SET_STATE2 = actionTypes_default.SET_STATE;
function appendReducers_default(originModels) {
  var models = {};
  Object.keys(originModels).forEach(function(name) {
    var model = originModels[name];
    if (!model.reducers) {
      model.reducers = {};
    }
    if (!model.reducers.setState) {
      model.reducers.setState = function(state, payload) {
        return __assign7(__assign7({}, state), payload);
      };
    }
    if (!model.reducers[SET_STATE2]) {
      model.reducers[SET_STATE2] = function(state, payload) {
        return payload;
      };
    }
    models[name] = model;
  });
  return models;
}

// node_modules/@ice/store/esm/types.js
function createModel(config) {
  return config;
}

// node_modules/@ice/store/esm/index.js
var __assign8 = function() {
  __assign8 = Object.assign || function(t2) {
    for (var s2, i2 = 1, n2 = arguments.length; i2 < n2; i2++) {
      s2 = arguments[i2];
      for (var p2 in s2)
        if (Object.prototype.hasOwnProperty.call(s2, p2))
          t2[p2] = s2[p2];
    }
    return t2;
  };
  return __assign8.apply(this, arguments);
};
var count = 0;
var init = function(initConfig) {
  if (initConfig === void 0) {
    initConfig = {};
  }
  var name = initConfig.name || count.toString();
  count += 1;
  var config = mergeConfig_default(__assign8(__assign8({}, initConfig), { name }));
  return new icestore_default(config).init();
};
var createStore2 = function(models, initConfig) {
  var _a = initConfig || {}, disableImmer = _a.disableImmer, disableLoading = _a.disableLoading, disableError = _a.disableError, _b = _a.plugins, plugins = _b === void 0 ? [] : _b, _c = _a.redux, redux = _c === void 0 ? {} : _c;
  var middlewares = redux.middlewares || [];
  var context = React6.createContext(null);
  middlewares.push(es_default);
  plugins.push(provider_default({ context }));
  plugins.push(reduxHooks_default({ context }));
  plugins.push(modelApis_default());
  var immerBlacklist = [];
  if (!disableLoading) {
    plugins.push(loading_default());
    immerBlacklist.push("loading");
  }
  if (!disableError) {
    plugins.push(error_default());
    immerBlacklist.push("error");
  }
  if (!disableImmer) {
    plugins.push(immer_default({ blacklist: immerBlacklist }));
  }
  checkModels(models);
  var wrappedModels = appendReducers_default(models);
  var store = init({
    models: wrappedModels,
    plugins,
    redux: __assign8(__assign8({}, redux), { middlewares })
  });
  return store;
};

// node_modules/@ice/plugin-store/esm/runtime.js
var EXPORT_CONFIG_NAME = "storeConfig";
var runtime = async ({ appContext, addWrapper, addProvider, useAppContext }, runtimeOptions) => {
  const { appExport, appData } = appContext;
  const exported = appExport[EXPORT_CONFIG_NAME];
  const storeConfig = (typeof exported === "function" ? await exported(appData) : exported) || {};
  const { initialStates } = storeConfig;
  const StoreProvider = ({ children }) => {
    var _a;
    if ((_a = runtimeOptions === null || runtimeOptions === void 0 ? void 0 : runtimeOptions.appStore) === null || _a === void 0 ? void 0 : _a.Provider) {
      const { Provider: Provider2 } = runtimeOptions.appStore;
      return React7.createElement(Provider2, { initialStates }, children);
    }
    return React7.createElement(React7.Fragment, null, children);
  };
  addProvider(StoreProvider);
  const StoreProviderWrapper = ({ children, routeId }) => {
    const { routeModules } = useAppContext();
    const routeModule = routeModules[routeId];
    if (routeModule[PAGE_STORE_PROVIDER]) {
      const Provider2 = routeModule[PAGE_STORE_PROVIDER];
      const initialStates2 = routeModule[PAGE_STORE_INITIAL_STATES];
      if (initialStates2) {
        return React7.createElement(Provider2, { initialStates: initialStates2 }, children);
      }
      return React7.createElement(Provider2, null, children);
    }
    return React7.createElement(React7.Fragment, null, children);
  };
  addWrapper(StoreProviderWrapper, true);
};
var runtime_default = runtime;

// node_modules/@ice/plugin-auth/esm/runtime/index.js
import * as React9 from "react";

// node_modules/@ice/plugin-auth/esm/runtime/Auth.js
import * as React8 from "react";
import { createContext, useContext as useContext5 } from "react";
var Context = createContext(null);
Context.displayName = "AuthContext";
var AuthProvider = Context.Provider;
var useAuth = () => {
  const value = useContext5(Context);
  return value;
};

// node_modules/@ice/plugin-auth/esm/runtime/index.js
var EXPORT_NAME = "authConfig";
var runtime2 = async ({ appContext, useConfig: useConfig2, addProvider, addWrapper }) => {
  const { appExport, appData } = appContext;
  const exported = appExport[EXPORT_NAME];
  const authConfig = (typeof exported === "function" ? await exported(appData) : exported) || {};
  const initialAuth = authConfig.initialAuth || {};
  const AuthProviderWrapper = ({ children }) => {
    const [state, setState] = React9.useState(initialAuth);
    const updateState = (newState = {}) => {
      setState({
        ...state,
        ...newState
      });
    };
    return React9.createElement(AuthProvider, { value: [state, updateState] }, children);
  };
  addProvider(AuthProviderWrapper);
  const AuthRouteWrapper = ({ children }) => {
    const [auth] = useAuth();
    const routeConfig = useConfig2();
    const routeConfigAuth = routeConfig === null || routeConfig === void 0 ? void 0 : routeConfig.auth;
    if (routeConfigAuth && !Array.isArray(routeConfigAuth)) {
      throw new Error("config.auth must be an array");
    }
    const hasAuth = Array.isArray(routeConfigAuth) && routeConfigAuth.length ? Object.keys(auth).filter((item) => routeConfigAuth.includes(item) ? auth[item] : false).length : true;
    if (!hasAuth) {
      if (authConfig.NoAuthFallback) {
        return React9.createElement(authConfig.NoAuthFallback, { routeConfig });
      }
      return React9.createElement(React9.Fragment, null, "No Auth");
    }
    return React9.createElement(React9.Fragment, null, children);
  };
  addWrapper(AuthRouteWrapper);
};
var runtime_default2 = runtime2;

// .ice/index.ts
function definePageConfig(pageConfig) {
  return pageConfig;
}

export {
  __export,
  createAxiosInstance,
  setAxiosInstance,
  createModel,
  createStore2 as createStore,
  runtime_default,
  runtime_default2,
  defineAppConfig,
  Meta,
  Title,
  Links,
  Scripts,
  Main,
  definePageConfig
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
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiLi4vLi4vbm9kZV9tb2R1bGVzL2F4aW9zL2xpYi9oZWxwZXJzL2JpbmQuanMiLCAiLi4vLi4vbm9kZV9tb2R1bGVzL2F4aW9zL2xpYi91dGlscy5qcyIsICIuLi8uLi9ub2RlX21vZHVsZXMvYXhpb3MvbGliL2hlbHBlcnMvYnVpbGRVUkwuanMiLCAiLi4vLi4vbm9kZV9tb2R1bGVzL2F4aW9zL2xpYi9jb3JlL0ludGVyY2VwdG9yTWFuYWdlci5qcyIsICIuLi8uLi9ub2RlX21vZHVsZXMvYXhpb3MvbGliL2hlbHBlcnMvbm9ybWFsaXplSGVhZGVyTmFtZS5qcyIsICIuLi8uLi9ub2RlX21vZHVsZXMvYXhpb3MvbGliL2NvcmUvQXhpb3NFcnJvci5qcyIsICIuLi8uLi9ub2RlX21vZHVsZXMvYXhpb3MvbGliL2RlZmF1bHRzL3RyYW5zaXRpb25hbC5qcyIsICIuLi8uLi9ub2RlX21vZHVsZXMvYXhpb3MvbGliL2hlbHBlcnMvdG9Gb3JtRGF0YS5qcyIsICIuLi8uLi9ub2RlX21vZHVsZXMvYXhpb3MvbGliL2NvcmUvc2V0dGxlLmpzIiwgIi4uLy4uL25vZGVfbW9kdWxlcy9heGlvcy9saWIvaGVscGVycy9jb29raWVzLmpzIiwgIi4uLy4uL25vZGVfbW9kdWxlcy9heGlvcy9saWIvaGVscGVycy9pc0Fic29sdXRlVVJMLmpzIiwgIi4uLy4uL25vZGVfbW9kdWxlcy9heGlvcy9saWIvaGVscGVycy9jb21iaW5lVVJMcy5qcyIsICIuLi8uLi9ub2RlX21vZHVsZXMvYXhpb3MvbGliL2NvcmUvYnVpbGRGdWxsUGF0aC5qcyIsICIuLi8uLi9ub2RlX21vZHVsZXMvYXhpb3MvbGliL2hlbHBlcnMvcGFyc2VIZWFkZXJzLmpzIiwgIi4uLy4uL25vZGVfbW9kdWxlcy9heGlvcy9saWIvaGVscGVycy9pc1VSTFNhbWVPcmlnaW4uanMiLCAiLi4vLi4vbm9kZV9tb2R1bGVzL2F4aW9zL2xpYi9jYW5jZWwvQ2FuY2VsZWRFcnJvci5qcyIsICIuLi8uLi9ub2RlX21vZHVsZXMvYXhpb3MvbGliL2hlbHBlcnMvcGFyc2VQcm90b2NvbC5qcyIsICIuLi8uLi9ub2RlX21vZHVsZXMvYXhpb3MvbGliL2FkYXB0ZXJzL3hoci5qcyIsICIuLi8uLi9ub2RlX21vZHVsZXMvYXhpb3MvbGliL2hlbHBlcnMvbnVsbC5qcyIsICIuLi8uLi9ub2RlX21vZHVsZXMvYXhpb3MvbGliL2RlZmF1bHRzL2luZGV4LmpzIiwgIi4uLy4uL25vZGVfbW9kdWxlcy9heGlvcy9saWIvY29yZS90cmFuc2Zvcm1EYXRhLmpzIiwgIi4uLy4uL25vZGVfbW9kdWxlcy9heGlvcy9saWIvY2FuY2VsL2lzQ2FuY2VsLmpzIiwgIi4uLy4uL25vZGVfbW9kdWxlcy9heGlvcy9saWIvY29yZS9kaXNwYXRjaFJlcXVlc3QuanMiLCAiLi4vLi4vbm9kZV9tb2R1bGVzL2F4aW9zL2xpYi9jb3JlL21lcmdlQ29uZmlnLmpzIiwgIi4uLy4uL25vZGVfbW9kdWxlcy9heGlvcy9saWIvZW52L2RhdGEuanMiLCAiLi4vLi4vbm9kZV9tb2R1bGVzL2F4aW9zL2xpYi9oZWxwZXJzL3ZhbGlkYXRvci5qcyIsICIuLi8uLi9ub2RlX21vZHVsZXMvYXhpb3MvbGliL2NvcmUvQXhpb3MuanMiLCAiLi4vLi4vbm9kZV9tb2R1bGVzL2F4aW9zL2xpYi9jYW5jZWwvQ2FuY2VsVG9rZW4uanMiLCAiLi4vLi4vbm9kZV9tb2R1bGVzL2F4aW9zL2xpYi9oZWxwZXJzL3NwcmVhZC5qcyIsICIuLi8uLi9ub2RlX21vZHVsZXMvYXhpb3MvbGliL2hlbHBlcnMvaXNBeGlvc0Vycm9yLmpzIiwgIi4uLy4uL25vZGVfbW9kdWxlcy9heGlvcy9saWIvYXhpb3MuanMiLCAiLi4vLi4vbm9kZV9tb2R1bGVzL2F4aW9zL2luZGV4LmpzIiwgIi4uLy4uL25vZGVfbW9kdWxlcy9yZWFjdC1pcy9janMvcmVhY3QtaXMuZGV2ZWxvcG1lbnQuanMiLCAiLi4vLi4vbm9kZV9tb2R1bGVzL3JlYWN0LWlzL2luZGV4LmpzIiwgIi4uLy4uL25vZGVfbW9kdWxlcy9vYmplY3QtYXNzaWduL2luZGV4LmpzIiwgIi4uLy4uL25vZGVfbW9kdWxlcy9wcm9wLXR5cGVzL2xpYi9SZWFjdFByb3BUeXBlc1NlY3JldC5qcyIsICIuLi8uLi9ub2RlX21vZHVsZXMvcHJvcC10eXBlcy9saWIvaGFzLmpzIiwgIi4uLy4uL25vZGVfbW9kdWxlcy9wcm9wLXR5cGVzL2NoZWNrUHJvcFR5cGVzLmpzIiwgIi4uLy4uL25vZGVfbW9kdWxlcy9wcm9wLXR5cGVzL2ZhY3RvcnlXaXRoVHlwZUNoZWNrZXJzLmpzIiwgIi4uLy4uL25vZGVfbW9kdWxlcy9wcm9wLXR5cGVzL2luZGV4LmpzIiwgIi4uLy4uL25vZGVfbW9kdWxlcy9ob2lzdC1ub24tcmVhY3Qtc3RhdGljcy9kaXN0L2hvaXN0LW5vbi1yZWFjdC1zdGF0aWNzLmNqcy5qcyIsICIuLi8uLi9ub2RlX21vZHVsZXMvcmVhY3QtcmVkdXgvbm9kZV9tb2R1bGVzL3JlYWN0LWlzL2Nqcy9yZWFjdC1pcy5kZXZlbG9wbWVudC5qcyIsICIuLi8uLi9ub2RlX21vZHVsZXMvcmVhY3QtcmVkdXgvbm9kZV9tb2R1bGVzL3JlYWN0LWlzL2luZGV4LmpzIiwgIi4uLy4uL25vZGVfbW9kdWxlcy9sb2Rhc2guaXNmdW5jdGlvbi9pbmRleC5qcyIsICIuLi8uLi8uaWNlL1VzZXJzL21hbWJhL3dvcmtzcGFjZS9tc2UvaWNlLWFwcC8uaWNlL2luZGV4LnRzIiwgIi4uLy4uL25vZGVfbW9kdWxlcy9AaWNlL3BsdWdpbi1yZXF1ZXN0L2VzbS9yZXF1ZXN0LmpzIiwgIi4uLy4uL25vZGVfbW9kdWxlcy9AaWNlL3BsdWdpbi1zdG9yZS9lc20vcnVudGltZS5qcyIsICIuLi8uLi9ub2RlX21vZHVsZXMvQGljZS9wbHVnaW4tc3RvcmUvZXNtL2NvbnN0YW50cy5qcyIsICIuLi8uLi9ub2RlX21vZHVsZXMvQGljZS9zdG9yZS9lc20vaW5kZXguanMiLCAiLi4vLi4vbm9kZV9tb2R1bGVzL3JlZHV4LXRodW5rL2VzL2luZGV4LmpzIiwgIi4uLy4uL25vZGVfbW9kdWxlcy9AaWNlL3N0b3JlL2VzbS91dGlscy92YWxpZGF0ZS5qcyIsICIuLi8uLi9ub2RlX21vZHVsZXMvQGljZS9zdG9yZS9lc20vcGx1Z2luRmFjdG9yeS5qcyIsICIuLi8uLi9ub2RlX21vZHVsZXMvQGljZS9zdG9yZS9lc20vcGx1Z2lucy9kaXNwYXRjaC5qcyIsICIuLi8uLi9ub2RlX21vZHVsZXMvQGljZS9zdG9yZS9lc20vcGx1Z2lucy9lZmZlY3RzLmpzIiwgIi4uLy4uL25vZGVfbW9kdWxlcy9yZWR1eC9lcy9yZWR1eC5qcyIsICIuLi8uLi9ub2RlX21vZHVsZXMvQGJhYmVsL3J1bnRpbWUvaGVscGVycy9lc20vZGVmaW5lUHJvcGVydHkuanMiLCAiLi4vLi4vbm9kZV9tb2R1bGVzL0BiYWJlbC9ydW50aW1lL2hlbHBlcnMvZXNtL29iamVjdFNwcmVhZDIuanMiLCAiLi4vLi4vbm9kZV9tb2R1bGVzL0BpY2Uvc3RvcmUvZXNtL3V0aWxzL2lzTGlzdGVuZXIuanMiLCAiLi4vLi4vbm9kZV9tb2R1bGVzL0BpY2Uvc3RvcmUvZXNtL3JlZHV4LmpzIiwgIi4uLy4uL25vZGVfbW9kdWxlcy9AaWNlL3N0b3JlL2VzbS9pY2VzdG9yZS5qcyIsICIuLi8uLi9ub2RlX21vZHVsZXMvQGljZS9zdG9yZS9lc20vdXRpbHMvbWVyZ2VDb25maWcuanMiLCAiLi4vLi4vbm9kZV9tb2R1bGVzL0BpY2Uvc3RvcmUvZXNtL3BsdWdpbnMvcHJvdmlkZXIuanMiLCAiLi4vLi4vbm9kZV9tb2R1bGVzL3JlYWN0LXJlZHV4L2VzL2NvbXBvbmVudHMvUHJvdmlkZXIuanMiLCAiLi4vLi4vbm9kZV9tb2R1bGVzL3JlYWN0LXJlZHV4L2VzL2NvbXBvbmVudHMvQ29udGV4dC5qcyIsICIuLi8uLi9ub2RlX21vZHVsZXMvcmVhY3QtcmVkdXgvZXMvdXRpbHMvYmF0Y2guanMiLCAiLi4vLi4vbm9kZV9tb2R1bGVzL3JlYWN0LXJlZHV4L2VzL3V0aWxzL1N1YnNjcmlwdGlvbi5qcyIsICIuLi8uLi9ub2RlX21vZHVsZXMvcmVhY3QtcmVkdXgvZXMvdXRpbHMvdXNlSXNvbW9ycGhpY0xheW91dEVmZmVjdC5qcyIsICIuLi8uLi9ub2RlX21vZHVsZXMvcmVhY3QtcmVkdXgvZXMvY29tcG9uZW50cy9jb25uZWN0QWR2YW5jZWQuanMiLCAiLi4vLi4vbm9kZV9tb2R1bGVzL3JlYWN0LXJlZHV4L2VzL2hvb2tzL3VzZVN0b3JlLmpzIiwgIi4uLy4uL25vZGVfbW9kdWxlcy9yZWFjdC1yZWR1eC9lcy9ob29rcy91c2VSZWR1eENvbnRleHQuanMiLCAiLi4vLi4vbm9kZV9tb2R1bGVzL3JlYWN0LXJlZHV4L2VzL2hvb2tzL3VzZURpc3BhdGNoLmpzIiwgIi4uLy4uL25vZGVfbW9kdWxlcy9yZWFjdC1yZWR1eC9lcy9ob29rcy91c2VTZWxlY3Rvci5qcyIsICIuLi8uLi9ub2RlX21vZHVsZXMvcmVhY3QtcmVkdXgvZXMvdXRpbHMvcmVhY3RCYXRjaGVkVXBkYXRlcy5qcyIsICIuLi8uLi9ub2RlX21vZHVsZXMvcmVhY3QtcmVkdXgvZXMvaW5kZXguanMiLCAiLi4vLi4vbm9kZV9tb2R1bGVzL0BpY2Uvc3RvcmUvZXNtL2FjdGlvblR5cGVzLmpzIiwgIi4uLy4uL25vZGVfbW9kdWxlcy9AaWNlL3N0b3JlL2VzbS9wbHVnaW5zL3JlZHV4SG9va3MuanMiLCAiLi4vLi4vbm9kZV9tb2R1bGVzL0BpY2Uvc3RvcmUvZXNtL3BsdWdpbnMvbW9kZWxBcGlzLmpzIiwgIi4uLy4uL25vZGVfbW9kdWxlcy9pbW1lci9zcmMvdXRpbHMvZXJyb3JzLnRzIiwgIi4uLy4uL25vZGVfbW9kdWxlcy9pbW1lci9zcmMvdXRpbHMvY29tbW9uLnRzIiwgIi4uLy4uL25vZGVfbW9kdWxlcy9pbW1lci9zcmMvdXRpbHMvcGx1Z2lucy50cyIsICIuLi8uLi9ub2RlX21vZHVsZXMvaW1tZXIvc3JjL2NvcmUvc2NvcGUudHMiLCAiLi4vLi4vbm9kZV9tb2R1bGVzL2ltbWVyL3NyYy9jb3JlL2ZpbmFsaXplLnRzIiwgIi4uLy4uL25vZGVfbW9kdWxlcy9pbW1lci9zcmMvY29yZS9wcm94eS50cyIsICIuLi8uLi9ub2RlX21vZHVsZXMvaW1tZXIvc3JjL2NvcmUvaW1tZXJDbGFzcy50cyIsICIuLi8uLi9ub2RlX21vZHVsZXMvaW1tZXIvc3JjL2NvcmUvY3VycmVudC50cyIsICIuLi8uLi9ub2RlX21vZHVsZXMvaW1tZXIvc3JjL3BsdWdpbnMvZXM1LnRzIiwgIi4uLy4uL25vZGVfbW9kdWxlcy9pbW1lci9zcmMvcGx1Z2lucy9wYXRjaGVzLnRzIiwgIi4uLy4uL25vZGVfbW9kdWxlcy9pbW1lci9zcmMvcGx1Z2lucy9tYXBzZXQudHMiLCAiLi4vLi4vbm9kZV9tb2R1bGVzL2ltbWVyL3NyYy9wbHVnaW5zL2FsbC50cyIsICIuLi8uLi9ub2RlX21vZHVsZXMvaW1tZXIvc3JjL2ltbWVyLnRzIiwgIi4uLy4uL25vZGVfbW9kdWxlcy9pbW1lci9zcmMvdXRpbHMvZW52LnRzIiwgIi4uLy4uL25vZGVfbW9kdWxlcy9AaWNlL3N0b3JlL2VzbS9wbHVnaW5zL2ltbWVyLmpzIiwgIi4uLy4uL25vZGVfbW9kdWxlcy9AaWNlL3N0b3JlL2VzbS9wbHVnaW5zL2xvYWRpbmcuanMiLCAiLi4vLi4vbm9kZV9tb2R1bGVzL0BpY2Uvc3RvcmUvZXNtL3BsdWdpbnMvZXJyb3IuanMiLCAiLi4vLi4vbm9kZV9tb2R1bGVzL0BpY2Uvc3RvcmUvZXNtL3V0aWxzL2NoZWNrTW9kZWxzLmpzIiwgIi4uLy4uL25vZGVfbW9kdWxlcy9AaWNlL3N0b3JlL2VzbS91dGlscy9hcHBlbmRSZWR1Y2Vycy5qcyIsICIuLi8uLi9ub2RlX21vZHVsZXMvQGljZS9zdG9yZS9lc20vdHlwZXMuanMiLCAiLi4vLi4vbm9kZV9tb2R1bGVzL0BpY2UvcGx1Z2luLWF1dGgvZXNtL3J1bnRpbWUvaW5kZXguanMiLCAiLi4vLi4vbm9kZV9tb2R1bGVzL0BpY2UvcGx1Z2luLWF1dGgvZXNtL3J1bnRpbWUvQXV0aC5qcyJdLAogICJzb3VyY2VzQ29udGVudCI6IFsiJ3VzZSBzdHJpY3QnO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGJpbmQoZm4sIHRoaXNBcmcpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uIHdyYXAoKSB7XG4gICAgdmFyIGFyZ3MgPSBuZXcgQXJyYXkoYXJndW1lbnRzLmxlbmd0aCk7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBhcmdzLmxlbmd0aDsgaSsrKSB7XG4gICAgICBhcmdzW2ldID0gYXJndW1lbnRzW2ldO1xuICAgIH1cbiAgICByZXR1cm4gZm4uYXBwbHkodGhpc0FyZywgYXJncyk7XG4gIH07XG59O1xuIiwgIid1c2Ugc3RyaWN0JztcblxudmFyIGJpbmQgPSByZXF1aXJlKCcuL2hlbHBlcnMvYmluZCcpO1xuXG4vLyB1dGlscyBpcyBhIGxpYnJhcnkgb2YgZ2VuZXJpYyBoZWxwZXIgZnVuY3Rpb25zIG5vbi1zcGVjaWZpYyB0byBheGlvc1xuXG52YXIgdG9TdHJpbmcgPSBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nO1xuXG4vLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgZnVuYy1uYW1lc1xudmFyIGtpbmRPZiA9IChmdW5jdGlvbihjYWNoZSkge1xuICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgZnVuYy1uYW1lc1xuICByZXR1cm4gZnVuY3Rpb24odGhpbmcpIHtcbiAgICB2YXIgc3RyID0gdG9TdHJpbmcuY2FsbCh0aGluZyk7XG4gICAgcmV0dXJuIGNhY2hlW3N0cl0gfHwgKGNhY2hlW3N0cl0gPSBzdHIuc2xpY2UoOCwgLTEpLnRvTG93ZXJDYXNlKCkpO1xuICB9O1xufSkoT2JqZWN0LmNyZWF0ZShudWxsKSk7XG5cbmZ1bmN0aW9uIGtpbmRPZlRlc3QodHlwZSkge1xuICB0eXBlID0gdHlwZS50b0xvd2VyQ2FzZSgpO1xuICByZXR1cm4gZnVuY3Rpb24gaXNLaW5kT2YodGhpbmcpIHtcbiAgICByZXR1cm4ga2luZE9mKHRoaW5nKSA9PT0gdHlwZTtcbiAgfTtcbn1cblxuLyoqXG4gKiBEZXRlcm1pbmUgaWYgYSB2YWx1ZSBpcyBhbiBBcnJheVxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSB2YWwgVGhlIHZhbHVlIHRvIHRlc3RcbiAqIEByZXR1cm5zIHtib29sZWFufSBUcnVlIGlmIHZhbHVlIGlzIGFuIEFycmF5LCBvdGhlcndpc2UgZmFsc2VcbiAqL1xuZnVuY3Rpb24gaXNBcnJheSh2YWwpIHtcbiAgcmV0dXJuIEFycmF5LmlzQXJyYXkodmFsKTtcbn1cblxuLyoqXG4gKiBEZXRlcm1pbmUgaWYgYSB2YWx1ZSBpcyB1bmRlZmluZWRcbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gdmFsIFRoZSB2YWx1ZSB0byB0ZXN0XG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gVHJ1ZSBpZiB0aGUgdmFsdWUgaXMgdW5kZWZpbmVkLCBvdGhlcndpc2UgZmFsc2VcbiAqL1xuZnVuY3Rpb24gaXNVbmRlZmluZWQodmFsKSB7XG4gIHJldHVybiB0eXBlb2YgdmFsID09PSAndW5kZWZpbmVkJztcbn1cblxuLyoqXG4gKiBEZXRlcm1pbmUgaWYgYSB2YWx1ZSBpcyBhIEJ1ZmZlclxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSB2YWwgVGhlIHZhbHVlIHRvIHRlc3RcbiAqIEByZXR1cm5zIHtib29sZWFufSBUcnVlIGlmIHZhbHVlIGlzIGEgQnVmZmVyLCBvdGhlcndpc2UgZmFsc2VcbiAqL1xuZnVuY3Rpb24gaXNCdWZmZXIodmFsKSB7XG4gIHJldHVybiB2YWwgIT09IG51bGwgJiYgIWlzVW5kZWZpbmVkKHZhbCkgJiYgdmFsLmNvbnN0cnVjdG9yICE9PSBudWxsICYmICFpc1VuZGVmaW5lZCh2YWwuY29uc3RydWN0b3IpXG4gICAgJiYgdHlwZW9mIHZhbC5jb25zdHJ1Y3Rvci5pc0J1ZmZlciA9PT0gJ2Z1bmN0aW9uJyAmJiB2YWwuY29uc3RydWN0b3IuaXNCdWZmZXIodmFsKTtcbn1cblxuLyoqXG4gKiBEZXRlcm1pbmUgaWYgYSB2YWx1ZSBpcyBhbiBBcnJheUJ1ZmZlclxuICpcbiAqIEBmdW5jdGlvblxuICogQHBhcmFtIHtPYmplY3R9IHZhbCBUaGUgdmFsdWUgdG8gdGVzdFxuICogQHJldHVybnMge2Jvb2xlYW59IFRydWUgaWYgdmFsdWUgaXMgYW4gQXJyYXlCdWZmZXIsIG90aGVyd2lzZSBmYWxzZVxuICovXG52YXIgaXNBcnJheUJ1ZmZlciA9IGtpbmRPZlRlc3QoJ0FycmF5QnVmZmVyJyk7XG5cblxuLyoqXG4gKiBEZXRlcm1pbmUgaWYgYSB2YWx1ZSBpcyBhIHZpZXcgb24gYW4gQXJyYXlCdWZmZXJcbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gdmFsIFRoZSB2YWx1ZSB0byB0ZXN0XG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gVHJ1ZSBpZiB2YWx1ZSBpcyBhIHZpZXcgb24gYW4gQXJyYXlCdWZmZXIsIG90aGVyd2lzZSBmYWxzZVxuICovXG5mdW5jdGlvbiBpc0FycmF5QnVmZmVyVmlldyh2YWwpIHtcbiAgdmFyIHJlc3VsdDtcbiAgaWYgKCh0eXBlb2YgQXJyYXlCdWZmZXIgIT09ICd1bmRlZmluZWQnKSAmJiAoQXJyYXlCdWZmZXIuaXNWaWV3KSkge1xuICAgIHJlc3VsdCA9IEFycmF5QnVmZmVyLmlzVmlldyh2YWwpO1xuICB9IGVsc2Uge1xuICAgIHJlc3VsdCA9ICh2YWwpICYmICh2YWwuYnVmZmVyKSAmJiAoaXNBcnJheUJ1ZmZlcih2YWwuYnVmZmVyKSk7XG4gIH1cbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxuLyoqXG4gKiBEZXRlcm1pbmUgaWYgYSB2YWx1ZSBpcyBhIFN0cmluZ1xuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSB2YWwgVGhlIHZhbHVlIHRvIHRlc3RcbiAqIEByZXR1cm5zIHtib29sZWFufSBUcnVlIGlmIHZhbHVlIGlzIGEgU3RyaW5nLCBvdGhlcndpc2UgZmFsc2VcbiAqL1xuZnVuY3Rpb24gaXNTdHJpbmcodmFsKSB7XG4gIHJldHVybiB0eXBlb2YgdmFsID09PSAnc3RyaW5nJztcbn1cblxuLyoqXG4gKiBEZXRlcm1pbmUgaWYgYSB2YWx1ZSBpcyBhIE51bWJlclxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSB2YWwgVGhlIHZhbHVlIHRvIHRlc3RcbiAqIEByZXR1cm5zIHtib29sZWFufSBUcnVlIGlmIHZhbHVlIGlzIGEgTnVtYmVyLCBvdGhlcndpc2UgZmFsc2VcbiAqL1xuZnVuY3Rpb24gaXNOdW1iZXIodmFsKSB7XG4gIHJldHVybiB0eXBlb2YgdmFsID09PSAnbnVtYmVyJztcbn1cblxuLyoqXG4gKiBEZXRlcm1pbmUgaWYgYSB2YWx1ZSBpcyBhbiBPYmplY3RcbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gdmFsIFRoZSB2YWx1ZSB0byB0ZXN0XG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gVHJ1ZSBpZiB2YWx1ZSBpcyBhbiBPYmplY3QsIG90aGVyd2lzZSBmYWxzZVxuICovXG5mdW5jdGlvbiBpc09iamVjdCh2YWwpIHtcbiAgcmV0dXJuIHZhbCAhPT0gbnVsbCAmJiB0eXBlb2YgdmFsID09PSAnb2JqZWN0Jztcbn1cblxuLyoqXG4gKiBEZXRlcm1pbmUgaWYgYSB2YWx1ZSBpcyBhIHBsYWluIE9iamVjdFxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSB2YWwgVGhlIHZhbHVlIHRvIHRlc3RcbiAqIEByZXR1cm4ge2Jvb2xlYW59IFRydWUgaWYgdmFsdWUgaXMgYSBwbGFpbiBPYmplY3QsIG90aGVyd2lzZSBmYWxzZVxuICovXG5mdW5jdGlvbiBpc1BsYWluT2JqZWN0KHZhbCkge1xuICBpZiAoa2luZE9mKHZhbCkgIT09ICdvYmplY3QnKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgdmFyIHByb3RvdHlwZSA9IE9iamVjdC5nZXRQcm90b3R5cGVPZih2YWwpO1xuICByZXR1cm4gcHJvdG90eXBlID09PSBudWxsIHx8IHByb3RvdHlwZSA9PT0gT2JqZWN0LnByb3RvdHlwZTtcbn1cblxuLyoqXG4gKiBEZXRlcm1pbmUgaWYgYSB2YWx1ZSBpcyBhIERhdGVcbiAqXG4gKiBAZnVuY3Rpb25cbiAqIEBwYXJhbSB7T2JqZWN0fSB2YWwgVGhlIHZhbHVlIHRvIHRlc3RcbiAqIEByZXR1cm5zIHtib29sZWFufSBUcnVlIGlmIHZhbHVlIGlzIGEgRGF0ZSwgb3RoZXJ3aXNlIGZhbHNlXG4gKi9cbnZhciBpc0RhdGUgPSBraW5kT2ZUZXN0KCdEYXRlJyk7XG5cbi8qKlxuICogRGV0ZXJtaW5lIGlmIGEgdmFsdWUgaXMgYSBGaWxlXG4gKlxuICogQGZ1bmN0aW9uXG4gKiBAcGFyYW0ge09iamVjdH0gdmFsIFRoZSB2YWx1ZSB0byB0ZXN0XG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gVHJ1ZSBpZiB2YWx1ZSBpcyBhIEZpbGUsIG90aGVyd2lzZSBmYWxzZVxuICovXG52YXIgaXNGaWxlID0ga2luZE9mVGVzdCgnRmlsZScpO1xuXG4vKipcbiAqIERldGVybWluZSBpZiBhIHZhbHVlIGlzIGEgQmxvYlxuICpcbiAqIEBmdW5jdGlvblxuICogQHBhcmFtIHtPYmplY3R9IHZhbCBUaGUgdmFsdWUgdG8gdGVzdFxuICogQHJldHVybnMge2Jvb2xlYW59IFRydWUgaWYgdmFsdWUgaXMgYSBCbG9iLCBvdGhlcndpc2UgZmFsc2VcbiAqL1xudmFyIGlzQmxvYiA9IGtpbmRPZlRlc3QoJ0Jsb2InKTtcblxuLyoqXG4gKiBEZXRlcm1pbmUgaWYgYSB2YWx1ZSBpcyBhIEZpbGVMaXN0XG4gKlxuICogQGZ1bmN0aW9uXG4gKiBAcGFyYW0ge09iamVjdH0gdmFsIFRoZSB2YWx1ZSB0byB0ZXN0XG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gVHJ1ZSBpZiB2YWx1ZSBpcyBhIEZpbGUsIG90aGVyd2lzZSBmYWxzZVxuICovXG52YXIgaXNGaWxlTGlzdCA9IGtpbmRPZlRlc3QoJ0ZpbGVMaXN0Jyk7XG5cbi8qKlxuICogRGV0ZXJtaW5lIGlmIGEgdmFsdWUgaXMgYSBGdW5jdGlvblxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSB2YWwgVGhlIHZhbHVlIHRvIHRlc3RcbiAqIEByZXR1cm5zIHtib29sZWFufSBUcnVlIGlmIHZhbHVlIGlzIGEgRnVuY3Rpb24sIG90aGVyd2lzZSBmYWxzZVxuICovXG5mdW5jdGlvbiBpc0Z1bmN0aW9uKHZhbCkge1xuICByZXR1cm4gdG9TdHJpbmcuY2FsbCh2YWwpID09PSAnW29iamVjdCBGdW5jdGlvbl0nO1xufVxuXG4vKipcbiAqIERldGVybWluZSBpZiBhIHZhbHVlIGlzIGEgU3RyZWFtXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IHZhbCBUaGUgdmFsdWUgdG8gdGVzdFxuICogQHJldHVybnMge2Jvb2xlYW59IFRydWUgaWYgdmFsdWUgaXMgYSBTdHJlYW0sIG90aGVyd2lzZSBmYWxzZVxuICovXG5mdW5jdGlvbiBpc1N0cmVhbSh2YWwpIHtcbiAgcmV0dXJuIGlzT2JqZWN0KHZhbCkgJiYgaXNGdW5jdGlvbih2YWwucGlwZSk7XG59XG5cbi8qKlxuICogRGV0ZXJtaW5lIGlmIGEgdmFsdWUgaXMgYSBGb3JtRGF0YVxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSB0aGluZyBUaGUgdmFsdWUgdG8gdGVzdFxuICogQHJldHVybnMge2Jvb2xlYW59IFRydWUgaWYgdmFsdWUgaXMgYW4gRm9ybURhdGEsIG90aGVyd2lzZSBmYWxzZVxuICovXG5mdW5jdGlvbiBpc0Zvcm1EYXRhKHRoaW5nKSB7XG4gIHZhciBwYXR0ZXJuID0gJ1tvYmplY3QgRm9ybURhdGFdJztcbiAgcmV0dXJuIHRoaW5nICYmIChcbiAgICAodHlwZW9mIEZvcm1EYXRhID09PSAnZnVuY3Rpb24nICYmIHRoaW5nIGluc3RhbmNlb2YgRm9ybURhdGEpIHx8XG4gICAgdG9TdHJpbmcuY2FsbCh0aGluZykgPT09IHBhdHRlcm4gfHxcbiAgICAoaXNGdW5jdGlvbih0aGluZy50b1N0cmluZykgJiYgdGhpbmcudG9TdHJpbmcoKSA9PT0gcGF0dGVybilcbiAgKTtcbn1cblxuLyoqXG4gKiBEZXRlcm1pbmUgaWYgYSB2YWx1ZSBpcyBhIFVSTFNlYXJjaFBhcmFtcyBvYmplY3RcbiAqIEBmdW5jdGlvblxuICogQHBhcmFtIHtPYmplY3R9IHZhbCBUaGUgdmFsdWUgdG8gdGVzdFxuICogQHJldHVybnMge2Jvb2xlYW59IFRydWUgaWYgdmFsdWUgaXMgYSBVUkxTZWFyY2hQYXJhbXMgb2JqZWN0LCBvdGhlcndpc2UgZmFsc2VcbiAqL1xudmFyIGlzVVJMU2VhcmNoUGFyYW1zID0ga2luZE9mVGVzdCgnVVJMU2VhcmNoUGFyYW1zJyk7XG5cbi8qKlxuICogVHJpbSBleGNlc3Mgd2hpdGVzcGFjZSBvZmYgdGhlIGJlZ2lubmluZyBhbmQgZW5kIG9mIGEgc3RyaW5nXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IHN0ciBUaGUgU3RyaW5nIHRvIHRyaW1cbiAqIEByZXR1cm5zIHtTdHJpbmd9IFRoZSBTdHJpbmcgZnJlZWQgb2YgZXhjZXNzIHdoaXRlc3BhY2VcbiAqL1xuZnVuY3Rpb24gdHJpbShzdHIpIHtcbiAgcmV0dXJuIHN0ci50cmltID8gc3RyLnRyaW0oKSA6IHN0ci5yZXBsYWNlKC9eXFxzK3xcXHMrJC9nLCAnJyk7XG59XG5cbi8qKlxuICogRGV0ZXJtaW5lIGlmIHdlJ3JlIHJ1bm5pbmcgaW4gYSBzdGFuZGFyZCBicm93c2VyIGVudmlyb25tZW50XG4gKlxuICogVGhpcyBhbGxvd3MgYXhpb3MgdG8gcnVuIGluIGEgd2ViIHdvcmtlciwgYW5kIHJlYWN0LW5hdGl2ZS5cbiAqIEJvdGggZW52aXJvbm1lbnRzIHN1cHBvcnQgWE1MSHR0cFJlcXVlc3QsIGJ1dCBub3QgZnVsbHkgc3RhbmRhcmQgZ2xvYmFscy5cbiAqXG4gKiB3ZWIgd29ya2VyczpcbiAqICB0eXBlb2Ygd2luZG93IC0+IHVuZGVmaW5lZFxuICogIHR5cGVvZiBkb2N1bWVudCAtPiB1bmRlZmluZWRcbiAqXG4gKiByZWFjdC1uYXRpdmU6XG4gKiAgbmF2aWdhdG9yLnByb2R1Y3QgLT4gJ1JlYWN0TmF0aXZlJ1xuICogbmF0aXZlc2NyaXB0XG4gKiAgbmF2aWdhdG9yLnByb2R1Y3QgLT4gJ05hdGl2ZVNjcmlwdCcgb3IgJ05TJ1xuICovXG5mdW5jdGlvbiBpc1N0YW5kYXJkQnJvd3NlckVudigpIHtcbiAgaWYgKHR5cGVvZiBuYXZpZ2F0b3IgIT09ICd1bmRlZmluZWQnICYmIChuYXZpZ2F0b3IucHJvZHVjdCA9PT0gJ1JlYWN0TmF0aXZlJyB8fFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5hdmlnYXRvci5wcm9kdWN0ID09PSAnTmF0aXZlU2NyaXB0JyB8fFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5hdmlnYXRvci5wcm9kdWN0ID09PSAnTlMnKSkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuICByZXR1cm4gKFxuICAgIHR5cGVvZiB3aW5kb3cgIT09ICd1bmRlZmluZWQnICYmXG4gICAgdHlwZW9mIGRvY3VtZW50ICE9PSAndW5kZWZpbmVkJ1xuICApO1xufVxuXG4vKipcbiAqIEl0ZXJhdGUgb3ZlciBhbiBBcnJheSBvciBhbiBPYmplY3QgaW52b2tpbmcgYSBmdW5jdGlvbiBmb3IgZWFjaCBpdGVtLlxuICpcbiAqIElmIGBvYmpgIGlzIGFuIEFycmF5IGNhbGxiYWNrIHdpbGwgYmUgY2FsbGVkIHBhc3NpbmdcbiAqIHRoZSB2YWx1ZSwgaW5kZXgsIGFuZCBjb21wbGV0ZSBhcnJheSBmb3IgZWFjaCBpdGVtLlxuICpcbiAqIElmICdvYmonIGlzIGFuIE9iamVjdCBjYWxsYmFjayB3aWxsIGJlIGNhbGxlZCBwYXNzaW5nXG4gKiB0aGUgdmFsdWUsIGtleSwgYW5kIGNvbXBsZXRlIG9iamVjdCBmb3IgZWFjaCBwcm9wZXJ0eS5cbiAqXG4gKiBAcGFyYW0ge09iamVjdHxBcnJheX0gb2JqIFRoZSBvYmplY3QgdG8gaXRlcmF0ZVxuICogQHBhcmFtIHtGdW5jdGlvbn0gZm4gVGhlIGNhbGxiYWNrIHRvIGludm9rZSBmb3IgZWFjaCBpdGVtXG4gKi9cbmZ1bmN0aW9uIGZvckVhY2gob2JqLCBmbikge1xuICAvLyBEb24ndCBib3RoZXIgaWYgbm8gdmFsdWUgcHJvdmlkZWRcbiAgaWYgKG9iaiA9PT0gbnVsbCB8fCB0eXBlb2Ygb2JqID09PSAndW5kZWZpbmVkJykge1xuICAgIHJldHVybjtcbiAgfVxuXG4gIC8vIEZvcmNlIGFuIGFycmF5IGlmIG5vdCBhbHJlYWR5IHNvbWV0aGluZyBpdGVyYWJsZVxuICBpZiAodHlwZW9mIG9iaiAhPT0gJ29iamVjdCcpIHtcbiAgICAvKmVzbGludCBuby1wYXJhbS1yZWFzc2lnbjowKi9cbiAgICBvYmogPSBbb2JqXTtcbiAgfVxuXG4gIGlmIChpc0FycmF5KG9iaikpIHtcbiAgICAvLyBJdGVyYXRlIG92ZXIgYXJyYXkgdmFsdWVzXG4gICAgZm9yICh2YXIgaSA9IDAsIGwgPSBvYmoubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XG4gICAgICBmbi5jYWxsKG51bGwsIG9ialtpXSwgaSwgb2JqKTtcbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgLy8gSXRlcmF0ZSBvdmVyIG9iamVjdCBrZXlzXG4gICAgZm9yICh2YXIga2V5IGluIG9iaikge1xuICAgICAgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIGtleSkpIHtcbiAgICAgICAgZm4uY2FsbChudWxsLCBvYmpba2V5XSwga2V5LCBvYmopO1xuICAgICAgfVxuICAgIH1cbiAgfVxufVxuXG4vKipcbiAqIEFjY2VwdHMgdmFyYXJncyBleHBlY3RpbmcgZWFjaCBhcmd1bWVudCB0byBiZSBhbiBvYmplY3QsIHRoZW5cbiAqIGltbXV0YWJseSBtZXJnZXMgdGhlIHByb3BlcnRpZXMgb2YgZWFjaCBvYmplY3QgYW5kIHJldHVybnMgcmVzdWx0LlxuICpcbiAqIFdoZW4gbXVsdGlwbGUgb2JqZWN0cyBjb250YWluIHRoZSBzYW1lIGtleSB0aGUgbGF0ZXIgb2JqZWN0IGluXG4gKiB0aGUgYXJndW1lbnRzIGxpc3Qgd2lsbCB0YWtlIHByZWNlZGVuY2UuXG4gKlxuICogRXhhbXBsZTpcbiAqXG4gKiBgYGBqc1xuICogdmFyIHJlc3VsdCA9IG1lcmdlKHtmb286IDEyM30sIHtmb286IDQ1Nn0pO1xuICogY29uc29sZS5sb2cocmVzdWx0LmZvbyk7IC8vIG91dHB1dHMgNDU2XG4gKiBgYGBcbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gb2JqMSBPYmplY3QgdG8gbWVyZ2VcbiAqIEByZXR1cm5zIHtPYmplY3R9IFJlc3VsdCBvZiBhbGwgbWVyZ2UgcHJvcGVydGllc1xuICovXG5mdW5jdGlvbiBtZXJnZSgvKiBvYmoxLCBvYmoyLCBvYmozLCAuLi4gKi8pIHtcbiAgdmFyIHJlc3VsdCA9IHt9O1xuICBmdW5jdGlvbiBhc3NpZ25WYWx1ZSh2YWwsIGtleSkge1xuICAgIGlmIChpc1BsYWluT2JqZWN0KHJlc3VsdFtrZXldKSAmJiBpc1BsYWluT2JqZWN0KHZhbCkpIHtcbiAgICAgIHJlc3VsdFtrZXldID0gbWVyZ2UocmVzdWx0W2tleV0sIHZhbCk7XG4gICAgfSBlbHNlIGlmIChpc1BsYWluT2JqZWN0KHZhbCkpIHtcbiAgICAgIHJlc3VsdFtrZXldID0gbWVyZ2Uoe30sIHZhbCk7XG4gICAgfSBlbHNlIGlmIChpc0FycmF5KHZhbCkpIHtcbiAgICAgIHJlc3VsdFtrZXldID0gdmFsLnNsaWNlKCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJlc3VsdFtrZXldID0gdmFsO1xuICAgIH1cbiAgfVxuXG4gIGZvciAodmFyIGkgPSAwLCBsID0gYXJndW1lbnRzLmxlbmd0aDsgaSA8IGw7IGkrKykge1xuICAgIGZvckVhY2goYXJndW1lbnRzW2ldLCBhc3NpZ25WYWx1ZSk7XG4gIH1cbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxuLyoqXG4gKiBFeHRlbmRzIG9iamVjdCBhIGJ5IG11dGFibHkgYWRkaW5nIHRvIGl0IHRoZSBwcm9wZXJ0aWVzIG9mIG9iamVjdCBiLlxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSBhIFRoZSBvYmplY3QgdG8gYmUgZXh0ZW5kZWRcbiAqIEBwYXJhbSB7T2JqZWN0fSBiIFRoZSBvYmplY3QgdG8gY29weSBwcm9wZXJ0aWVzIGZyb21cbiAqIEBwYXJhbSB7T2JqZWN0fSB0aGlzQXJnIFRoZSBvYmplY3QgdG8gYmluZCBmdW5jdGlvbiB0b1xuICogQHJldHVybiB7T2JqZWN0fSBUaGUgcmVzdWx0aW5nIHZhbHVlIG9mIG9iamVjdCBhXG4gKi9cbmZ1bmN0aW9uIGV4dGVuZChhLCBiLCB0aGlzQXJnKSB7XG4gIGZvckVhY2goYiwgZnVuY3Rpb24gYXNzaWduVmFsdWUodmFsLCBrZXkpIHtcbiAgICBpZiAodGhpc0FyZyAmJiB0eXBlb2YgdmFsID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICBhW2tleV0gPSBiaW5kKHZhbCwgdGhpc0FyZyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGFba2V5XSA9IHZhbDtcbiAgICB9XG4gIH0pO1xuICByZXR1cm4gYTtcbn1cblxuLyoqXG4gKiBSZW1vdmUgYnl0ZSBvcmRlciBtYXJrZXIuIFRoaXMgY2F0Y2hlcyBFRiBCQiBCRiAodGhlIFVURi04IEJPTSlcbiAqXG4gKiBAcGFyYW0ge3N0cmluZ30gY29udGVudCB3aXRoIEJPTVxuICogQHJldHVybiB7c3RyaW5nfSBjb250ZW50IHZhbHVlIHdpdGhvdXQgQk9NXG4gKi9cbmZ1bmN0aW9uIHN0cmlwQk9NKGNvbnRlbnQpIHtcbiAgaWYgKGNvbnRlbnQuY2hhckNvZGVBdCgwKSA9PT0gMHhGRUZGKSB7XG4gICAgY29udGVudCA9IGNvbnRlbnQuc2xpY2UoMSk7XG4gIH1cbiAgcmV0dXJuIGNvbnRlbnQ7XG59XG5cbi8qKlxuICogSW5oZXJpdCB0aGUgcHJvdG90eXBlIG1ldGhvZHMgZnJvbSBvbmUgY29uc3RydWN0b3IgaW50byBhbm90aGVyXG4gKiBAcGFyYW0ge2Z1bmN0aW9ufSBjb25zdHJ1Y3RvclxuICogQHBhcmFtIHtmdW5jdGlvbn0gc3VwZXJDb25zdHJ1Y3RvclxuICogQHBhcmFtIHtvYmplY3R9IFtwcm9wc11cbiAqIEBwYXJhbSB7b2JqZWN0fSBbZGVzY3JpcHRvcnNdXG4gKi9cblxuZnVuY3Rpb24gaW5oZXJpdHMoY29uc3RydWN0b3IsIHN1cGVyQ29uc3RydWN0b3IsIHByb3BzLCBkZXNjcmlwdG9ycykge1xuICBjb25zdHJ1Y3Rvci5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKHN1cGVyQ29uc3RydWN0b3IucHJvdG90eXBlLCBkZXNjcmlwdG9ycyk7XG4gIGNvbnN0cnVjdG9yLnByb3RvdHlwZS5jb25zdHJ1Y3RvciA9IGNvbnN0cnVjdG9yO1xuICBwcm9wcyAmJiBPYmplY3QuYXNzaWduKGNvbnN0cnVjdG9yLnByb3RvdHlwZSwgcHJvcHMpO1xufVxuXG4vKipcbiAqIFJlc29sdmUgb2JqZWN0IHdpdGggZGVlcCBwcm90b3R5cGUgY2hhaW4gdG8gYSBmbGF0IG9iamVjdFxuICogQHBhcmFtIHtPYmplY3R9IHNvdXJjZU9iaiBzb3VyY2Ugb2JqZWN0XG4gKiBAcGFyYW0ge09iamVjdH0gW2Rlc3RPYmpdXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBbZmlsdGVyXVxuICogQHJldHVybnMge09iamVjdH1cbiAqL1xuXG5mdW5jdGlvbiB0b0ZsYXRPYmplY3Qoc291cmNlT2JqLCBkZXN0T2JqLCBmaWx0ZXIpIHtcbiAgdmFyIHByb3BzO1xuICB2YXIgaTtcbiAgdmFyIHByb3A7XG4gIHZhciBtZXJnZWQgPSB7fTtcblxuICBkZXN0T2JqID0gZGVzdE9iaiB8fCB7fTtcblxuICBkbyB7XG4gICAgcHJvcHMgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcyhzb3VyY2VPYmopO1xuICAgIGkgPSBwcm9wcy5sZW5ndGg7XG4gICAgd2hpbGUgKGktLSA+IDApIHtcbiAgICAgIHByb3AgPSBwcm9wc1tpXTtcbiAgICAgIGlmICghbWVyZ2VkW3Byb3BdKSB7XG4gICAgICAgIGRlc3RPYmpbcHJvcF0gPSBzb3VyY2VPYmpbcHJvcF07XG4gICAgICAgIG1lcmdlZFtwcm9wXSA9IHRydWU7XG4gICAgICB9XG4gICAgfVxuICAgIHNvdXJjZU9iaiA9IE9iamVjdC5nZXRQcm90b3R5cGVPZihzb3VyY2VPYmopO1xuICB9IHdoaWxlIChzb3VyY2VPYmogJiYgKCFmaWx0ZXIgfHwgZmlsdGVyKHNvdXJjZU9iaiwgZGVzdE9iaikpICYmIHNvdXJjZU9iaiAhPT0gT2JqZWN0LnByb3RvdHlwZSk7XG5cbiAgcmV0dXJuIGRlc3RPYmo7XG59XG5cbi8qXG4gKiBkZXRlcm1pbmVzIHdoZXRoZXIgYSBzdHJpbmcgZW5kcyB3aXRoIHRoZSBjaGFyYWN0ZXJzIG9mIGEgc3BlY2lmaWVkIHN0cmluZ1xuICogQHBhcmFtIHtTdHJpbmd9IHN0clxuICogQHBhcmFtIHtTdHJpbmd9IHNlYXJjaFN0cmluZ1xuICogQHBhcmFtIHtOdW1iZXJ9IFtwb3NpdGlvbj0gMF1cbiAqIEByZXR1cm5zIHtib29sZWFufVxuICovXG5mdW5jdGlvbiBlbmRzV2l0aChzdHIsIHNlYXJjaFN0cmluZywgcG9zaXRpb24pIHtcbiAgc3RyID0gU3RyaW5nKHN0cik7XG4gIGlmIChwb3NpdGlvbiA9PT0gdW5kZWZpbmVkIHx8IHBvc2l0aW9uID4gc3RyLmxlbmd0aCkge1xuICAgIHBvc2l0aW9uID0gc3RyLmxlbmd0aDtcbiAgfVxuICBwb3NpdGlvbiAtPSBzZWFyY2hTdHJpbmcubGVuZ3RoO1xuICB2YXIgbGFzdEluZGV4ID0gc3RyLmluZGV4T2Yoc2VhcmNoU3RyaW5nLCBwb3NpdGlvbik7XG4gIHJldHVybiBsYXN0SW5kZXggIT09IC0xICYmIGxhc3RJbmRleCA9PT0gcG9zaXRpb247XG59XG5cblxuLyoqXG4gKiBSZXR1cm5zIG5ldyBhcnJheSBmcm9tIGFycmF5IGxpa2Ugb2JqZWN0XG4gKiBAcGFyYW0geyp9IFt0aGluZ11cbiAqIEByZXR1cm5zIHtBcnJheX1cbiAqL1xuZnVuY3Rpb24gdG9BcnJheSh0aGluZykge1xuICBpZiAoIXRoaW5nKSByZXR1cm4gbnVsbDtcbiAgdmFyIGkgPSB0aGluZy5sZW5ndGg7XG4gIGlmIChpc1VuZGVmaW5lZChpKSkgcmV0dXJuIG51bGw7XG4gIHZhciBhcnIgPSBuZXcgQXJyYXkoaSk7XG4gIHdoaWxlIChpLS0gPiAwKSB7XG4gICAgYXJyW2ldID0gdGhpbmdbaV07XG4gIH1cbiAgcmV0dXJuIGFycjtcbn1cblxuLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIGZ1bmMtbmFtZXNcbnZhciBpc1R5cGVkQXJyYXkgPSAoZnVuY3Rpb24oVHlwZWRBcnJheSkge1xuICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgZnVuYy1uYW1lc1xuICByZXR1cm4gZnVuY3Rpb24odGhpbmcpIHtcbiAgICByZXR1cm4gVHlwZWRBcnJheSAmJiB0aGluZyBpbnN0YW5jZW9mIFR5cGVkQXJyYXk7XG4gIH07XG59KSh0eXBlb2YgVWludDhBcnJheSAhPT0gJ3VuZGVmaW5lZCcgJiYgT2JqZWN0LmdldFByb3RvdHlwZU9mKFVpbnQ4QXJyYXkpKTtcblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIGlzQXJyYXk6IGlzQXJyYXksXG4gIGlzQXJyYXlCdWZmZXI6IGlzQXJyYXlCdWZmZXIsXG4gIGlzQnVmZmVyOiBpc0J1ZmZlcixcbiAgaXNGb3JtRGF0YTogaXNGb3JtRGF0YSxcbiAgaXNBcnJheUJ1ZmZlclZpZXc6IGlzQXJyYXlCdWZmZXJWaWV3LFxuICBpc1N0cmluZzogaXNTdHJpbmcsXG4gIGlzTnVtYmVyOiBpc051bWJlcixcbiAgaXNPYmplY3Q6IGlzT2JqZWN0LFxuICBpc1BsYWluT2JqZWN0OiBpc1BsYWluT2JqZWN0LFxuICBpc1VuZGVmaW5lZDogaXNVbmRlZmluZWQsXG4gIGlzRGF0ZTogaXNEYXRlLFxuICBpc0ZpbGU6IGlzRmlsZSxcbiAgaXNCbG9iOiBpc0Jsb2IsXG4gIGlzRnVuY3Rpb246IGlzRnVuY3Rpb24sXG4gIGlzU3RyZWFtOiBpc1N0cmVhbSxcbiAgaXNVUkxTZWFyY2hQYXJhbXM6IGlzVVJMU2VhcmNoUGFyYW1zLFxuICBpc1N0YW5kYXJkQnJvd3NlckVudjogaXNTdGFuZGFyZEJyb3dzZXJFbnYsXG4gIGZvckVhY2g6IGZvckVhY2gsXG4gIG1lcmdlOiBtZXJnZSxcbiAgZXh0ZW5kOiBleHRlbmQsXG4gIHRyaW06IHRyaW0sXG4gIHN0cmlwQk9NOiBzdHJpcEJPTSxcbiAgaW5oZXJpdHM6IGluaGVyaXRzLFxuICB0b0ZsYXRPYmplY3Q6IHRvRmxhdE9iamVjdCxcbiAga2luZE9mOiBraW5kT2YsXG4gIGtpbmRPZlRlc3Q6IGtpbmRPZlRlc3QsXG4gIGVuZHNXaXRoOiBlbmRzV2l0aCxcbiAgdG9BcnJheTogdG9BcnJheSxcbiAgaXNUeXBlZEFycmF5OiBpc1R5cGVkQXJyYXksXG4gIGlzRmlsZUxpc3Q6IGlzRmlsZUxpc3Rcbn07XG4iLCAiJ3VzZSBzdHJpY3QnO1xuXG52YXIgdXRpbHMgPSByZXF1aXJlKCcuLy4uL3V0aWxzJyk7XG5cbmZ1bmN0aW9uIGVuY29kZSh2YWwpIHtcbiAgcmV0dXJuIGVuY29kZVVSSUNvbXBvbmVudCh2YWwpLlxuICAgIHJlcGxhY2UoLyUzQS9naSwgJzonKS5cbiAgICByZXBsYWNlKC8lMjQvZywgJyQnKS5cbiAgICByZXBsYWNlKC8lMkMvZ2ksICcsJykuXG4gICAgcmVwbGFjZSgvJTIwL2csICcrJykuXG4gICAgcmVwbGFjZSgvJTVCL2dpLCAnWycpLlxuICAgIHJlcGxhY2UoLyU1RC9naSwgJ10nKTtcbn1cblxuLyoqXG4gKiBCdWlsZCBhIFVSTCBieSBhcHBlbmRpbmcgcGFyYW1zIHRvIHRoZSBlbmRcbiAqXG4gKiBAcGFyYW0ge3N0cmluZ30gdXJsIFRoZSBiYXNlIG9mIHRoZSB1cmwgKGUuZy4sIGh0dHA6Ly93d3cuZ29vZ2xlLmNvbSlcbiAqIEBwYXJhbSB7b2JqZWN0fSBbcGFyYW1zXSBUaGUgcGFyYW1zIHRvIGJlIGFwcGVuZGVkXG4gKiBAcmV0dXJucyB7c3RyaW5nfSBUaGUgZm9ybWF0dGVkIHVybFxuICovXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGJ1aWxkVVJMKHVybCwgcGFyYW1zLCBwYXJhbXNTZXJpYWxpemVyKSB7XG4gIC8qZXNsaW50IG5vLXBhcmFtLXJlYXNzaWduOjAqL1xuICBpZiAoIXBhcmFtcykge1xuICAgIHJldHVybiB1cmw7XG4gIH1cblxuICB2YXIgc2VyaWFsaXplZFBhcmFtcztcbiAgaWYgKHBhcmFtc1NlcmlhbGl6ZXIpIHtcbiAgICBzZXJpYWxpemVkUGFyYW1zID0gcGFyYW1zU2VyaWFsaXplcihwYXJhbXMpO1xuICB9IGVsc2UgaWYgKHV0aWxzLmlzVVJMU2VhcmNoUGFyYW1zKHBhcmFtcykpIHtcbiAgICBzZXJpYWxpemVkUGFyYW1zID0gcGFyYW1zLnRvU3RyaW5nKCk7XG4gIH0gZWxzZSB7XG4gICAgdmFyIHBhcnRzID0gW107XG5cbiAgICB1dGlscy5mb3JFYWNoKHBhcmFtcywgZnVuY3Rpb24gc2VyaWFsaXplKHZhbCwga2V5KSB7XG4gICAgICBpZiAodmFsID09PSBudWxsIHx8IHR5cGVvZiB2YWwgPT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgaWYgKHV0aWxzLmlzQXJyYXkodmFsKSkge1xuICAgICAgICBrZXkgPSBrZXkgKyAnW10nO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdmFsID0gW3ZhbF07XG4gICAgICB9XG5cbiAgICAgIHV0aWxzLmZvckVhY2godmFsLCBmdW5jdGlvbiBwYXJzZVZhbHVlKHYpIHtcbiAgICAgICAgaWYgKHV0aWxzLmlzRGF0ZSh2KSkge1xuICAgICAgICAgIHYgPSB2LnRvSVNPU3RyaW5nKCk7XG4gICAgICAgIH0gZWxzZSBpZiAodXRpbHMuaXNPYmplY3QodikpIHtcbiAgICAgICAgICB2ID0gSlNPTi5zdHJpbmdpZnkodik7XG4gICAgICAgIH1cbiAgICAgICAgcGFydHMucHVzaChlbmNvZGUoa2V5KSArICc9JyArIGVuY29kZSh2KSk7XG4gICAgICB9KTtcbiAgICB9KTtcblxuICAgIHNlcmlhbGl6ZWRQYXJhbXMgPSBwYXJ0cy5qb2luKCcmJyk7XG4gIH1cblxuICBpZiAoc2VyaWFsaXplZFBhcmFtcykge1xuICAgIHZhciBoYXNobWFya0luZGV4ID0gdXJsLmluZGV4T2YoJyMnKTtcbiAgICBpZiAoaGFzaG1hcmtJbmRleCAhPT0gLTEpIHtcbiAgICAgIHVybCA9IHVybC5zbGljZSgwLCBoYXNobWFya0luZGV4KTtcbiAgICB9XG5cbiAgICB1cmwgKz0gKHVybC5pbmRleE9mKCc/JykgPT09IC0xID8gJz8nIDogJyYnKSArIHNlcmlhbGl6ZWRQYXJhbXM7XG4gIH1cblxuICByZXR1cm4gdXJsO1xufTtcbiIsICIndXNlIHN0cmljdCc7XG5cbnZhciB1dGlscyA9IHJlcXVpcmUoJy4vLi4vdXRpbHMnKTtcblxuZnVuY3Rpb24gSW50ZXJjZXB0b3JNYW5hZ2VyKCkge1xuICB0aGlzLmhhbmRsZXJzID0gW107XG59XG5cbi8qKlxuICogQWRkIGEgbmV3IGludGVyY2VwdG9yIHRvIHRoZSBzdGFja1xuICpcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGZ1bGZpbGxlZCBUaGUgZnVuY3Rpb24gdG8gaGFuZGxlIGB0aGVuYCBmb3IgYSBgUHJvbWlzZWBcbiAqIEBwYXJhbSB7RnVuY3Rpb259IHJlamVjdGVkIFRoZSBmdW5jdGlvbiB0byBoYW5kbGUgYHJlamVjdGAgZm9yIGEgYFByb21pc2VgXG4gKlxuICogQHJldHVybiB7TnVtYmVyfSBBbiBJRCB1c2VkIHRvIHJlbW92ZSBpbnRlcmNlcHRvciBsYXRlclxuICovXG5JbnRlcmNlcHRvck1hbmFnZXIucHJvdG90eXBlLnVzZSA9IGZ1bmN0aW9uIHVzZShmdWxmaWxsZWQsIHJlamVjdGVkLCBvcHRpb25zKSB7XG4gIHRoaXMuaGFuZGxlcnMucHVzaCh7XG4gICAgZnVsZmlsbGVkOiBmdWxmaWxsZWQsXG4gICAgcmVqZWN0ZWQ6IHJlamVjdGVkLFxuICAgIHN5bmNocm9ub3VzOiBvcHRpb25zID8gb3B0aW9ucy5zeW5jaHJvbm91cyA6IGZhbHNlLFxuICAgIHJ1bldoZW46IG9wdGlvbnMgPyBvcHRpb25zLnJ1bldoZW4gOiBudWxsXG4gIH0pO1xuICByZXR1cm4gdGhpcy5oYW5kbGVycy5sZW5ndGggLSAxO1xufTtcblxuLyoqXG4gKiBSZW1vdmUgYW4gaW50ZXJjZXB0b3IgZnJvbSB0aGUgc3RhY2tcbiAqXG4gKiBAcGFyYW0ge051bWJlcn0gaWQgVGhlIElEIHRoYXQgd2FzIHJldHVybmVkIGJ5IGB1c2VgXG4gKi9cbkludGVyY2VwdG9yTWFuYWdlci5wcm90b3R5cGUuZWplY3QgPSBmdW5jdGlvbiBlamVjdChpZCkge1xuICBpZiAodGhpcy5oYW5kbGVyc1tpZF0pIHtcbiAgICB0aGlzLmhhbmRsZXJzW2lkXSA9IG51bGw7XG4gIH1cbn07XG5cbi8qKlxuICogSXRlcmF0ZSBvdmVyIGFsbCB0aGUgcmVnaXN0ZXJlZCBpbnRlcmNlcHRvcnNcbiAqXG4gKiBUaGlzIG1ldGhvZCBpcyBwYXJ0aWN1bGFybHkgdXNlZnVsIGZvciBza2lwcGluZyBvdmVyIGFueVxuICogaW50ZXJjZXB0b3JzIHRoYXQgbWF5IGhhdmUgYmVjb21lIGBudWxsYCBjYWxsaW5nIGBlamVjdGAuXG4gKlxuICogQHBhcmFtIHtGdW5jdGlvbn0gZm4gVGhlIGZ1bmN0aW9uIHRvIGNhbGwgZm9yIGVhY2ggaW50ZXJjZXB0b3JcbiAqL1xuSW50ZXJjZXB0b3JNYW5hZ2VyLnByb3RvdHlwZS5mb3JFYWNoID0gZnVuY3Rpb24gZm9yRWFjaChmbikge1xuICB1dGlscy5mb3JFYWNoKHRoaXMuaGFuZGxlcnMsIGZ1bmN0aW9uIGZvckVhY2hIYW5kbGVyKGgpIHtcbiAgICBpZiAoaCAhPT0gbnVsbCkge1xuICAgICAgZm4oaCk7XG4gICAgfVxuICB9KTtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gSW50ZXJjZXB0b3JNYW5hZ2VyO1xuIiwgIid1c2Ugc3RyaWN0JztcblxudmFyIHV0aWxzID0gcmVxdWlyZSgnLi4vdXRpbHMnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBub3JtYWxpemVIZWFkZXJOYW1lKGhlYWRlcnMsIG5vcm1hbGl6ZWROYW1lKSB7XG4gIHV0aWxzLmZvckVhY2goaGVhZGVycywgZnVuY3Rpb24gcHJvY2Vzc0hlYWRlcih2YWx1ZSwgbmFtZSkge1xuICAgIGlmIChuYW1lICE9PSBub3JtYWxpemVkTmFtZSAmJiBuYW1lLnRvVXBwZXJDYXNlKCkgPT09IG5vcm1hbGl6ZWROYW1lLnRvVXBwZXJDYXNlKCkpIHtcbiAgICAgIGhlYWRlcnNbbm9ybWFsaXplZE5hbWVdID0gdmFsdWU7XG4gICAgICBkZWxldGUgaGVhZGVyc1tuYW1lXTtcbiAgICB9XG4gIH0pO1xufTtcbiIsICIndXNlIHN0cmljdCc7XG5cbnZhciB1dGlscyA9IHJlcXVpcmUoJy4uL3V0aWxzJyk7XG5cbi8qKlxuICogQ3JlYXRlIGFuIEVycm9yIHdpdGggdGhlIHNwZWNpZmllZCBtZXNzYWdlLCBjb25maWcsIGVycm9yIGNvZGUsIHJlcXVlc3QgYW5kIHJlc3BvbnNlLlxuICpcbiAqIEBwYXJhbSB7c3RyaW5nfSBtZXNzYWdlIFRoZSBlcnJvciBtZXNzYWdlLlxuICogQHBhcmFtIHtzdHJpbmd9IFtjb2RlXSBUaGUgZXJyb3IgY29kZSAoZm9yIGV4YW1wbGUsICdFQ09OTkFCT1JURUQnKS5cbiAqIEBwYXJhbSB7T2JqZWN0fSBbY29uZmlnXSBUaGUgY29uZmlnLlxuICogQHBhcmFtIHtPYmplY3R9IFtyZXF1ZXN0XSBUaGUgcmVxdWVzdC5cbiAqIEBwYXJhbSB7T2JqZWN0fSBbcmVzcG9uc2VdIFRoZSByZXNwb25zZS5cbiAqIEByZXR1cm5zIHtFcnJvcn0gVGhlIGNyZWF0ZWQgZXJyb3IuXG4gKi9cbmZ1bmN0aW9uIEF4aW9zRXJyb3IobWVzc2FnZSwgY29kZSwgY29uZmlnLCByZXF1ZXN0LCByZXNwb25zZSkge1xuICBFcnJvci5jYWxsKHRoaXMpO1xuICB0aGlzLm1lc3NhZ2UgPSBtZXNzYWdlO1xuICB0aGlzLm5hbWUgPSAnQXhpb3NFcnJvcic7XG4gIGNvZGUgJiYgKHRoaXMuY29kZSA9IGNvZGUpO1xuICBjb25maWcgJiYgKHRoaXMuY29uZmlnID0gY29uZmlnKTtcbiAgcmVxdWVzdCAmJiAodGhpcy5yZXF1ZXN0ID0gcmVxdWVzdCk7XG4gIHJlc3BvbnNlICYmICh0aGlzLnJlc3BvbnNlID0gcmVzcG9uc2UpO1xufVxuXG51dGlscy5pbmhlcml0cyhBeGlvc0Vycm9yLCBFcnJvciwge1xuICB0b0pTT046IGZ1bmN0aW9uIHRvSlNPTigpIHtcbiAgICByZXR1cm4ge1xuICAgICAgLy8gU3RhbmRhcmRcbiAgICAgIG1lc3NhZ2U6IHRoaXMubWVzc2FnZSxcbiAgICAgIG5hbWU6IHRoaXMubmFtZSxcbiAgICAgIC8vIE1pY3Jvc29mdFxuICAgICAgZGVzY3JpcHRpb246IHRoaXMuZGVzY3JpcHRpb24sXG4gICAgICBudW1iZXI6IHRoaXMubnVtYmVyLFxuICAgICAgLy8gTW96aWxsYVxuICAgICAgZmlsZU5hbWU6IHRoaXMuZmlsZU5hbWUsXG4gICAgICBsaW5lTnVtYmVyOiB0aGlzLmxpbmVOdW1iZXIsXG4gICAgICBjb2x1bW5OdW1iZXI6IHRoaXMuY29sdW1uTnVtYmVyLFxuICAgICAgc3RhY2s6IHRoaXMuc3RhY2ssXG4gICAgICAvLyBBeGlvc1xuICAgICAgY29uZmlnOiB0aGlzLmNvbmZpZyxcbiAgICAgIGNvZGU6IHRoaXMuY29kZSxcbiAgICAgIHN0YXR1czogdGhpcy5yZXNwb25zZSAmJiB0aGlzLnJlc3BvbnNlLnN0YXR1cyA/IHRoaXMucmVzcG9uc2Uuc3RhdHVzIDogbnVsbFxuICAgIH07XG4gIH1cbn0pO1xuXG52YXIgcHJvdG90eXBlID0gQXhpb3NFcnJvci5wcm90b3R5cGU7XG52YXIgZGVzY3JpcHRvcnMgPSB7fTtcblxuW1xuICAnRVJSX0JBRF9PUFRJT05fVkFMVUUnLFxuICAnRVJSX0JBRF9PUFRJT04nLFxuICAnRUNPTk5BQk9SVEVEJyxcbiAgJ0VUSU1FRE9VVCcsXG4gICdFUlJfTkVUV09SSycsXG4gICdFUlJfRlJfVE9PX01BTllfUkVESVJFQ1RTJyxcbiAgJ0VSUl9ERVBSRUNBVEVEJyxcbiAgJ0VSUl9CQURfUkVTUE9OU0UnLFxuICAnRVJSX0JBRF9SRVFVRVNUJyxcbiAgJ0VSUl9DQU5DRUxFRCdcbi8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBmdW5jLW5hbWVzXG5dLmZvckVhY2goZnVuY3Rpb24oY29kZSkge1xuICBkZXNjcmlwdG9yc1tjb2RlXSA9IHt2YWx1ZTogY29kZX07XG59KTtcblxuT2JqZWN0LmRlZmluZVByb3BlcnRpZXMoQXhpb3NFcnJvciwgZGVzY3JpcHRvcnMpO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KHByb3RvdHlwZSwgJ2lzQXhpb3NFcnJvcicsIHt2YWx1ZTogdHJ1ZX0pO1xuXG4vLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgZnVuYy1uYW1lc1xuQXhpb3NFcnJvci5mcm9tID0gZnVuY3Rpb24oZXJyb3IsIGNvZGUsIGNvbmZpZywgcmVxdWVzdCwgcmVzcG9uc2UsIGN1c3RvbVByb3BzKSB7XG4gIHZhciBheGlvc0Vycm9yID0gT2JqZWN0LmNyZWF0ZShwcm90b3R5cGUpO1xuXG4gIHV0aWxzLnRvRmxhdE9iamVjdChlcnJvciwgYXhpb3NFcnJvciwgZnVuY3Rpb24gZmlsdGVyKG9iaikge1xuICAgIHJldHVybiBvYmogIT09IEVycm9yLnByb3RvdHlwZTtcbiAgfSk7XG5cbiAgQXhpb3NFcnJvci5jYWxsKGF4aW9zRXJyb3IsIGVycm9yLm1lc3NhZ2UsIGNvZGUsIGNvbmZpZywgcmVxdWVzdCwgcmVzcG9uc2UpO1xuXG4gIGF4aW9zRXJyb3IubmFtZSA9IGVycm9yLm5hbWU7XG5cbiAgY3VzdG9tUHJvcHMgJiYgT2JqZWN0LmFzc2lnbihheGlvc0Vycm9yLCBjdXN0b21Qcm9wcyk7XG5cbiAgcmV0dXJuIGF4aW9zRXJyb3I7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IEF4aW9zRXJyb3I7XG4iLCAiJ3VzZSBzdHJpY3QnO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgc2lsZW50SlNPTlBhcnNpbmc6IHRydWUsXG4gIGZvcmNlZEpTT05QYXJzaW5nOiB0cnVlLFxuICBjbGFyaWZ5VGltZW91dEVycm9yOiBmYWxzZVxufTtcbiIsICIndXNlIHN0cmljdCc7XG5cbnZhciB1dGlscyA9IHJlcXVpcmUoJy4uL3V0aWxzJyk7XG5cbi8qKlxuICogQ29udmVydCBhIGRhdGEgb2JqZWN0IHRvIEZvcm1EYXRhXG4gKiBAcGFyYW0ge09iamVjdH0gb2JqXG4gKiBAcGFyYW0gez9PYmplY3R9IFtmb3JtRGF0YV1cbiAqIEByZXR1cm5zIHtPYmplY3R9XG4gKiovXG5cbmZ1bmN0aW9uIHRvRm9ybURhdGEob2JqLCBmb3JtRGF0YSkge1xuICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tcGFyYW0tcmVhc3NpZ25cbiAgZm9ybURhdGEgPSBmb3JtRGF0YSB8fCBuZXcgRm9ybURhdGEoKTtcblxuICB2YXIgc3RhY2sgPSBbXTtcblxuICBmdW5jdGlvbiBjb252ZXJ0VmFsdWUodmFsdWUpIHtcbiAgICBpZiAodmFsdWUgPT09IG51bGwpIHJldHVybiAnJztcblxuICAgIGlmICh1dGlscy5pc0RhdGUodmFsdWUpKSB7XG4gICAgICByZXR1cm4gdmFsdWUudG9JU09TdHJpbmcoKTtcbiAgICB9XG5cbiAgICBpZiAodXRpbHMuaXNBcnJheUJ1ZmZlcih2YWx1ZSkgfHwgdXRpbHMuaXNUeXBlZEFycmF5KHZhbHVlKSkge1xuICAgICAgcmV0dXJuIHR5cGVvZiBCbG9iID09PSAnZnVuY3Rpb24nID8gbmV3IEJsb2IoW3ZhbHVlXSkgOiBCdWZmZXIuZnJvbSh2YWx1ZSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHZhbHVlO1xuICB9XG5cbiAgZnVuY3Rpb24gYnVpbGQoZGF0YSwgcGFyZW50S2V5KSB7XG4gICAgaWYgKHV0aWxzLmlzUGxhaW5PYmplY3QoZGF0YSkgfHwgdXRpbHMuaXNBcnJheShkYXRhKSkge1xuICAgICAgaWYgKHN0YWNrLmluZGV4T2YoZGF0YSkgIT09IC0xKSB7XG4gICAgICAgIHRocm93IEVycm9yKCdDaXJjdWxhciByZWZlcmVuY2UgZGV0ZWN0ZWQgaW4gJyArIHBhcmVudEtleSk7XG4gICAgICB9XG5cbiAgICAgIHN0YWNrLnB1c2goZGF0YSk7XG5cbiAgICAgIHV0aWxzLmZvckVhY2goZGF0YSwgZnVuY3Rpb24gZWFjaCh2YWx1ZSwga2V5KSB7XG4gICAgICAgIGlmICh1dGlscy5pc1VuZGVmaW5lZCh2YWx1ZSkpIHJldHVybjtcbiAgICAgICAgdmFyIGZ1bGxLZXkgPSBwYXJlbnRLZXkgPyBwYXJlbnRLZXkgKyAnLicgKyBrZXkgOiBrZXk7XG4gICAgICAgIHZhciBhcnI7XG5cbiAgICAgICAgaWYgKHZhbHVlICYmICFwYXJlbnRLZXkgJiYgdHlwZW9mIHZhbHVlID09PSAnb2JqZWN0Jykge1xuICAgICAgICAgIGlmICh1dGlscy5lbmRzV2l0aChrZXksICd7fScpKSB7XG4gICAgICAgICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tcGFyYW0tcmVhc3NpZ25cbiAgICAgICAgICAgIHZhbHVlID0gSlNPTi5zdHJpbmdpZnkodmFsdWUpO1xuICAgICAgICAgIH0gZWxzZSBpZiAodXRpbHMuZW5kc1dpdGgoa2V5LCAnW10nKSAmJiAoYXJyID0gdXRpbHMudG9BcnJheSh2YWx1ZSkpKSB7XG4gICAgICAgICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgZnVuYy1uYW1lc1xuICAgICAgICAgICAgYXJyLmZvckVhY2goZnVuY3Rpb24oZWwpIHtcbiAgICAgICAgICAgICAgIXV0aWxzLmlzVW5kZWZpbmVkKGVsKSAmJiBmb3JtRGF0YS5hcHBlbmQoZnVsbEtleSwgY29udmVydFZhbHVlKGVsKSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBidWlsZCh2YWx1ZSwgZnVsbEtleSk7XG4gICAgICB9KTtcblxuICAgICAgc3RhY2sucG9wKCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGZvcm1EYXRhLmFwcGVuZChwYXJlbnRLZXksIGNvbnZlcnRWYWx1ZShkYXRhKSk7XG4gICAgfVxuICB9XG5cbiAgYnVpbGQob2JqKTtcblxuICByZXR1cm4gZm9ybURhdGE7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gdG9Gb3JtRGF0YTtcbiIsICIndXNlIHN0cmljdCc7XG5cbnZhciBBeGlvc0Vycm9yID0gcmVxdWlyZSgnLi9BeGlvc0Vycm9yJyk7XG5cbi8qKlxuICogUmVzb2x2ZSBvciByZWplY3QgYSBQcm9taXNlIGJhc2VkIG9uIHJlc3BvbnNlIHN0YXR1cy5cbiAqXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSByZXNvbHZlIEEgZnVuY3Rpb24gdGhhdCByZXNvbHZlcyB0aGUgcHJvbWlzZS5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IHJlamVjdCBBIGZ1bmN0aW9uIHRoYXQgcmVqZWN0cyB0aGUgcHJvbWlzZS5cbiAqIEBwYXJhbSB7b2JqZWN0fSByZXNwb25zZSBUaGUgcmVzcG9uc2UuXG4gKi9cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gc2V0dGxlKHJlc29sdmUsIHJlamVjdCwgcmVzcG9uc2UpIHtcbiAgdmFyIHZhbGlkYXRlU3RhdHVzID0gcmVzcG9uc2UuY29uZmlnLnZhbGlkYXRlU3RhdHVzO1xuICBpZiAoIXJlc3BvbnNlLnN0YXR1cyB8fCAhdmFsaWRhdGVTdGF0dXMgfHwgdmFsaWRhdGVTdGF0dXMocmVzcG9uc2Uuc3RhdHVzKSkge1xuICAgIHJlc29sdmUocmVzcG9uc2UpO1xuICB9IGVsc2Uge1xuICAgIHJlamVjdChuZXcgQXhpb3NFcnJvcihcbiAgICAgICdSZXF1ZXN0IGZhaWxlZCB3aXRoIHN0YXR1cyBjb2RlICcgKyByZXNwb25zZS5zdGF0dXMsXG4gICAgICBbQXhpb3NFcnJvci5FUlJfQkFEX1JFUVVFU1QsIEF4aW9zRXJyb3IuRVJSX0JBRF9SRVNQT05TRV1bTWF0aC5mbG9vcihyZXNwb25zZS5zdGF0dXMgLyAxMDApIC0gNF0sXG4gICAgICByZXNwb25zZS5jb25maWcsXG4gICAgICByZXNwb25zZS5yZXF1ZXN0LFxuICAgICAgcmVzcG9uc2VcbiAgICApKTtcbiAgfVxufTtcbiIsICIndXNlIHN0cmljdCc7XG5cbnZhciB1dGlscyA9IHJlcXVpcmUoJy4vLi4vdXRpbHMnKTtcblxubW9kdWxlLmV4cG9ydHMgPSAoXG4gIHV0aWxzLmlzU3RhbmRhcmRCcm93c2VyRW52KCkgP1xuXG4gIC8vIFN0YW5kYXJkIGJyb3dzZXIgZW52cyBzdXBwb3J0IGRvY3VtZW50LmNvb2tpZVxuICAgIChmdW5jdGlvbiBzdGFuZGFyZEJyb3dzZXJFbnYoKSB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICB3cml0ZTogZnVuY3Rpb24gd3JpdGUobmFtZSwgdmFsdWUsIGV4cGlyZXMsIHBhdGgsIGRvbWFpbiwgc2VjdXJlKSB7XG4gICAgICAgICAgdmFyIGNvb2tpZSA9IFtdO1xuICAgICAgICAgIGNvb2tpZS5wdXNoKG5hbWUgKyAnPScgKyBlbmNvZGVVUklDb21wb25lbnQodmFsdWUpKTtcblxuICAgICAgICAgIGlmICh1dGlscy5pc051bWJlcihleHBpcmVzKSkge1xuICAgICAgICAgICAgY29va2llLnB1c2goJ2V4cGlyZXM9JyArIG5ldyBEYXRlKGV4cGlyZXMpLnRvR01UU3RyaW5nKCkpO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGlmICh1dGlscy5pc1N0cmluZyhwYXRoKSkge1xuICAgICAgICAgICAgY29va2llLnB1c2goJ3BhdGg9JyArIHBhdGgpO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGlmICh1dGlscy5pc1N0cmluZyhkb21haW4pKSB7XG4gICAgICAgICAgICBjb29raWUucHVzaCgnZG9tYWluPScgKyBkb21haW4pO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGlmIChzZWN1cmUgPT09IHRydWUpIHtcbiAgICAgICAgICAgIGNvb2tpZS5wdXNoKCdzZWN1cmUnKTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBkb2N1bWVudC5jb29raWUgPSBjb29raWUuam9pbignOyAnKTtcbiAgICAgICAgfSxcblxuICAgICAgICByZWFkOiBmdW5jdGlvbiByZWFkKG5hbWUpIHtcbiAgICAgICAgICB2YXIgbWF0Y2ggPSBkb2N1bWVudC5jb29raWUubWF0Y2gobmV3IFJlZ0V4cCgnKF58O1xcXFxzKikoJyArIG5hbWUgKyAnKT0oW147XSopJykpO1xuICAgICAgICAgIHJldHVybiAobWF0Y2ggPyBkZWNvZGVVUklDb21wb25lbnQobWF0Y2hbM10pIDogbnVsbCk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgcmVtb3ZlOiBmdW5jdGlvbiByZW1vdmUobmFtZSkge1xuICAgICAgICAgIHRoaXMud3JpdGUobmFtZSwgJycsIERhdGUubm93KCkgLSA4NjQwMDAwMCk7XG4gICAgICAgIH1cbiAgICAgIH07XG4gICAgfSkoKSA6XG5cbiAgLy8gTm9uIHN0YW5kYXJkIGJyb3dzZXIgZW52ICh3ZWIgd29ya2VycywgcmVhY3QtbmF0aXZlKSBsYWNrIG5lZWRlZCBzdXBwb3J0LlxuICAgIChmdW5jdGlvbiBub25TdGFuZGFyZEJyb3dzZXJFbnYoKSB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICB3cml0ZTogZnVuY3Rpb24gd3JpdGUoKSB7fSxcbiAgICAgICAgcmVhZDogZnVuY3Rpb24gcmVhZCgpIHsgcmV0dXJuIG51bGw7IH0sXG4gICAgICAgIHJlbW92ZTogZnVuY3Rpb24gcmVtb3ZlKCkge31cbiAgICAgIH07XG4gICAgfSkoKVxuKTtcbiIsICIndXNlIHN0cmljdCc7XG5cbi8qKlxuICogRGV0ZXJtaW5lcyB3aGV0aGVyIHRoZSBzcGVjaWZpZWQgVVJMIGlzIGFic29sdXRlXG4gKlxuICogQHBhcmFtIHtzdHJpbmd9IHVybCBUaGUgVVJMIHRvIHRlc3RcbiAqIEByZXR1cm5zIHtib29sZWFufSBUcnVlIGlmIHRoZSBzcGVjaWZpZWQgVVJMIGlzIGFic29sdXRlLCBvdGhlcndpc2UgZmFsc2VcbiAqL1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBpc0Fic29sdXRlVVJMKHVybCkge1xuICAvLyBBIFVSTCBpcyBjb25zaWRlcmVkIGFic29sdXRlIGlmIGl0IGJlZ2lucyB3aXRoIFwiPHNjaGVtZT46Ly9cIiBvciBcIi8vXCIgKHByb3RvY29sLXJlbGF0aXZlIFVSTCkuXG4gIC8vIFJGQyAzOTg2IGRlZmluZXMgc2NoZW1lIG5hbWUgYXMgYSBzZXF1ZW5jZSBvZiBjaGFyYWN0ZXJzIGJlZ2lubmluZyB3aXRoIGEgbGV0dGVyIGFuZCBmb2xsb3dlZFxuICAvLyBieSBhbnkgY29tYmluYXRpb24gb2YgbGV0dGVycywgZGlnaXRzLCBwbHVzLCBwZXJpb2QsIG9yIGh5cGhlbi5cbiAgcmV0dXJuIC9eKFthLXpdW2EtelxcZCtcXC0uXSo6KT9cXC9cXC8vaS50ZXN0KHVybCk7XG59O1xuIiwgIid1c2Ugc3RyaWN0JztcblxuLyoqXG4gKiBDcmVhdGVzIGEgbmV3IFVSTCBieSBjb21iaW5pbmcgdGhlIHNwZWNpZmllZCBVUkxzXG4gKlxuICogQHBhcmFtIHtzdHJpbmd9IGJhc2VVUkwgVGhlIGJhc2UgVVJMXG4gKiBAcGFyYW0ge3N0cmluZ30gcmVsYXRpdmVVUkwgVGhlIHJlbGF0aXZlIFVSTFxuICogQHJldHVybnMge3N0cmluZ30gVGhlIGNvbWJpbmVkIFVSTFxuICovXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGNvbWJpbmVVUkxzKGJhc2VVUkwsIHJlbGF0aXZlVVJMKSB7XG4gIHJldHVybiByZWxhdGl2ZVVSTFxuICAgID8gYmFzZVVSTC5yZXBsYWNlKC9cXC8rJC8sICcnKSArICcvJyArIHJlbGF0aXZlVVJMLnJlcGxhY2UoL15cXC8rLywgJycpXG4gICAgOiBiYXNlVVJMO1xufTtcbiIsICIndXNlIHN0cmljdCc7XG5cbnZhciBpc0Fic29sdXRlVVJMID0gcmVxdWlyZSgnLi4vaGVscGVycy9pc0Fic29sdXRlVVJMJyk7XG52YXIgY29tYmluZVVSTHMgPSByZXF1aXJlKCcuLi9oZWxwZXJzL2NvbWJpbmVVUkxzJyk7XG5cbi8qKlxuICogQ3JlYXRlcyBhIG5ldyBVUkwgYnkgY29tYmluaW5nIHRoZSBiYXNlVVJMIHdpdGggdGhlIHJlcXVlc3RlZFVSTCxcbiAqIG9ubHkgd2hlbiB0aGUgcmVxdWVzdGVkVVJMIGlzIG5vdCBhbHJlYWR5IGFuIGFic29sdXRlIFVSTC5cbiAqIElmIHRoZSByZXF1ZXN0VVJMIGlzIGFic29sdXRlLCB0aGlzIGZ1bmN0aW9uIHJldHVybnMgdGhlIHJlcXVlc3RlZFVSTCB1bnRvdWNoZWQuXG4gKlxuICogQHBhcmFtIHtzdHJpbmd9IGJhc2VVUkwgVGhlIGJhc2UgVVJMXG4gKiBAcGFyYW0ge3N0cmluZ30gcmVxdWVzdGVkVVJMIEFic29sdXRlIG9yIHJlbGF0aXZlIFVSTCB0byBjb21iaW5lXG4gKiBAcmV0dXJucyB7c3RyaW5nfSBUaGUgY29tYmluZWQgZnVsbCBwYXRoXG4gKi9cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gYnVpbGRGdWxsUGF0aChiYXNlVVJMLCByZXF1ZXN0ZWRVUkwpIHtcbiAgaWYgKGJhc2VVUkwgJiYgIWlzQWJzb2x1dGVVUkwocmVxdWVzdGVkVVJMKSkge1xuICAgIHJldHVybiBjb21iaW5lVVJMcyhiYXNlVVJMLCByZXF1ZXN0ZWRVUkwpO1xuICB9XG4gIHJldHVybiByZXF1ZXN0ZWRVUkw7XG59O1xuIiwgIid1c2Ugc3RyaWN0JztcblxudmFyIHV0aWxzID0gcmVxdWlyZSgnLi8uLi91dGlscycpO1xuXG4vLyBIZWFkZXJzIHdob3NlIGR1cGxpY2F0ZXMgYXJlIGlnbm9yZWQgYnkgbm9kZVxuLy8gYy5mLiBodHRwczovL25vZGVqcy5vcmcvYXBpL2h0dHAuaHRtbCNodHRwX21lc3NhZ2VfaGVhZGVyc1xudmFyIGlnbm9yZUR1cGxpY2F0ZU9mID0gW1xuICAnYWdlJywgJ2F1dGhvcml6YXRpb24nLCAnY29udGVudC1sZW5ndGgnLCAnY29udGVudC10eXBlJywgJ2V0YWcnLFxuICAnZXhwaXJlcycsICdmcm9tJywgJ2hvc3QnLCAnaWYtbW9kaWZpZWQtc2luY2UnLCAnaWYtdW5tb2RpZmllZC1zaW5jZScsXG4gICdsYXN0LW1vZGlmaWVkJywgJ2xvY2F0aW9uJywgJ21heC1mb3J3YXJkcycsICdwcm94eS1hdXRob3JpemF0aW9uJyxcbiAgJ3JlZmVyZXInLCAncmV0cnktYWZ0ZXInLCAndXNlci1hZ2VudCdcbl07XG5cbi8qKlxuICogUGFyc2UgaGVhZGVycyBpbnRvIGFuIG9iamVjdFxuICpcbiAqIGBgYFxuICogRGF0ZTogV2VkLCAyNyBBdWcgMjAxNCAwODo1ODo0OSBHTVRcbiAqIENvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvblxuICogQ29ubmVjdGlvbjoga2VlcC1hbGl2ZVxuICogVHJhbnNmZXItRW5jb2Rpbmc6IGNodW5rZWRcbiAqIGBgYFxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBoZWFkZXJzIEhlYWRlcnMgbmVlZGluZyB0byBiZSBwYXJzZWRcbiAqIEByZXR1cm5zIHtPYmplY3R9IEhlYWRlcnMgcGFyc2VkIGludG8gYW4gb2JqZWN0XG4gKi9cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gcGFyc2VIZWFkZXJzKGhlYWRlcnMpIHtcbiAgdmFyIHBhcnNlZCA9IHt9O1xuICB2YXIga2V5O1xuICB2YXIgdmFsO1xuICB2YXIgaTtcblxuICBpZiAoIWhlYWRlcnMpIHsgcmV0dXJuIHBhcnNlZDsgfVxuXG4gIHV0aWxzLmZvckVhY2goaGVhZGVycy5zcGxpdCgnXFxuJyksIGZ1bmN0aW9uIHBhcnNlcihsaW5lKSB7XG4gICAgaSA9IGxpbmUuaW5kZXhPZignOicpO1xuICAgIGtleSA9IHV0aWxzLnRyaW0obGluZS5zdWJzdHIoMCwgaSkpLnRvTG93ZXJDYXNlKCk7XG4gICAgdmFsID0gdXRpbHMudHJpbShsaW5lLnN1YnN0cihpICsgMSkpO1xuXG4gICAgaWYgKGtleSkge1xuICAgICAgaWYgKHBhcnNlZFtrZXldICYmIGlnbm9yZUR1cGxpY2F0ZU9mLmluZGV4T2Yoa2V5KSA+PSAwKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIGlmIChrZXkgPT09ICdzZXQtY29va2llJykge1xuICAgICAgICBwYXJzZWRba2V5XSA9IChwYXJzZWRba2V5XSA/IHBhcnNlZFtrZXldIDogW10pLmNvbmNhdChbdmFsXSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBwYXJzZWRba2V5XSA9IHBhcnNlZFtrZXldID8gcGFyc2VkW2tleV0gKyAnLCAnICsgdmFsIDogdmFsO1xuICAgICAgfVxuICAgIH1cbiAgfSk7XG5cbiAgcmV0dXJuIHBhcnNlZDtcbn07XG4iLCAiJ3VzZSBzdHJpY3QnO1xuXG52YXIgdXRpbHMgPSByZXF1aXJlKCcuLy4uL3V0aWxzJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gKFxuICB1dGlscy5pc1N0YW5kYXJkQnJvd3NlckVudigpID9cblxuICAvLyBTdGFuZGFyZCBicm93c2VyIGVudnMgaGF2ZSBmdWxsIHN1cHBvcnQgb2YgdGhlIEFQSXMgbmVlZGVkIHRvIHRlc3RcbiAgLy8gd2hldGhlciB0aGUgcmVxdWVzdCBVUkwgaXMgb2YgdGhlIHNhbWUgb3JpZ2luIGFzIGN1cnJlbnQgbG9jYXRpb24uXG4gICAgKGZ1bmN0aW9uIHN0YW5kYXJkQnJvd3NlckVudigpIHtcbiAgICAgIHZhciBtc2llID0gLyhtc2llfHRyaWRlbnQpL2kudGVzdChuYXZpZ2F0b3IudXNlckFnZW50KTtcbiAgICAgIHZhciB1cmxQYXJzaW5nTm9kZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2EnKTtcbiAgICAgIHZhciBvcmlnaW5VUkw7XG5cbiAgICAgIC8qKlxuICAgICogUGFyc2UgYSBVUkwgdG8gZGlzY292ZXIgaXQncyBjb21wb25lbnRzXG4gICAgKlxuICAgICogQHBhcmFtIHtTdHJpbmd9IHVybCBUaGUgVVJMIHRvIGJlIHBhcnNlZFxuICAgICogQHJldHVybnMge09iamVjdH1cbiAgICAqL1xuICAgICAgZnVuY3Rpb24gcmVzb2x2ZVVSTCh1cmwpIHtcbiAgICAgICAgdmFyIGhyZWYgPSB1cmw7XG5cbiAgICAgICAgaWYgKG1zaWUpIHtcbiAgICAgICAgLy8gSUUgbmVlZHMgYXR0cmlidXRlIHNldCB0d2ljZSB0byBub3JtYWxpemUgcHJvcGVydGllc1xuICAgICAgICAgIHVybFBhcnNpbmdOb2RlLnNldEF0dHJpYnV0ZSgnaHJlZicsIGhyZWYpO1xuICAgICAgICAgIGhyZWYgPSB1cmxQYXJzaW5nTm9kZS5ocmVmO1xuICAgICAgICB9XG5cbiAgICAgICAgdXJsUGFyc2luZ05vZGUuc2V0QXR0cmlidXRlKCdocmVmJywgaHJlZik7XG5cbiAgICAgICAgLy8gdXJsUGFyc2luZ05vZGUgcHJvdmlkZXMgdGhlIFVybFV0aWxzIGludGVyZmFjZSAtIGh0dHA6Ly91cmwuc3BlYy53aGF0d2cub3JnLyN1cmx1dGlsc1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIGhyZWY6IHVybFBhcnNpbmdOb2RlLmhyZWYsXG4gICAgICAgICAgcHJvdG9jb2w6IHVybFBhcnNpbmdOb2RlLnByb3RvY29sID8gdXJsUGFyc2luZ05vZGUucHJvdG9jb2wucmVwbGFjZSgvOiQvLCAnJykgOiAnJyxcbiAgICAgICAgICBob3N0OiB1cmxQYXJzaW5nTm9kZS5ob3N0LFxuICAgICAgICAgIHNlYXJjaDogdXJsUGFyc2luZ05vZGUuc2VhcmNoID8gdXJsUGFyc2luZ05vZGUuc2VhcmNoLnJlcGxhY2UoL15cXD8vLCAnJykgOiAnJyxcbiAgICAgICAgICBoYXNoOiB1cmxQYXJzaW5nTm9kZS5oYXNoID8gdXJsUGFyc2luZ05vZGUuaGFzaC5yZXBsYWNlKC9eIy8sICcnKSA6ICcnLFxuICAgICAgICAgIGhvc3RuYW1lOiB1cmxQYXJzaW5nTm9kZS5ob3N0bmFtZSxcbiAgICAgICAgICBwb3J0OiB1cmxQYXJzaW5nTm9kZS5wb3J0LFxuICAgICAgICAgIHBhdGhuYW1lOiAodXJsUGFyc2luZ05vZGUucGF0aG5hbWUuY2hhckF0KDApID09PSAnLycpID9cbiAgICAgICAgICAgIHVybFBhcnNpbmdOb2RlLnBhdGhuYW1lIDpcbiAgICAgICAgICAgICcvJyArIHVybFBhcnNpbmdOb2RlLnBhdGhuYW1lXG4gICAgICAgIH07XG4gICAgICB9XG5cbiAgICAgIG9yaWdpblVSTCA9IHJlc29sdmVVUkwod2luZG93LmxvY2F0aW9uLmhyZWYpO1xuXG4gICAgICAvKipcbiAgICAqIERldGVybWluZSBpZiBhIFVSTCBzaGFyZXMgdGhlIHNhbWUgb3JpZ2luIGFzIHRoZSBjdXJyZW50IGxvY2F0aW9uXG4gICAgKlxuICAgICogQHBhcmFtIHtTdHJpbmd9IHJlcXVlc3RVUkwgVGhlIFVSTCB0byB0ZXN0XG4gICAgKiBAcmV0dXJucyB7Ym9vbGVhbn0gVHJ1ZSBpZiBVUkwgc2hhcmVzIHRoZSBzYW1lIG9yaWdpbiwgb3RoZXJ3aXNlIGZhbHNlXG4gICAgKi9cbiAgICAgIHJldHVybiBmdW5jdGlvbiBpc1VSTFNhbWVPcmlnaW4ocmVxdWVzdFVSTCkge1xuICAgICAgICB2YXIgcGFyc2VkID0gKHV0aWxzLmlzU3RyaW5nKHJlcXVlc3RVUkwpKSA/IHJlc29sdmVVUkwocmVxdWVzdFVSTCkgOiByZXF1ZXN0VVJMO1xuICAgICAgICByZXR1cm4gKHBhcnNlZC5wcm90b2NvbCA9PT0gb3JpZ2luVVJMLnByb3RvY29sICYmXG4gICAgICAgICAgICBwYXJzZWQuaG9zdCA9PT0gb3JpZ2luVVJMLmhvc3QpO1xuICAgICAgfTtcbiAgICB9KSgpIDpcblxuICAvLyBOb24gc3RhbmRhcmQgYnJvd3NlciBlbnZzICh3ZWIgd29ya2VycywgcmVhY3QtbmF0aXZlKSBsYWNrIG5lZWRlZCBzdXBwb3J0LlxuICAgIChmdW5jdGlvbiBub25TdGFuZGFyZEJyb3dzZXJFbnYoKSB7XG4gICAgICByZXR1cm4gZnVuY3Rpb24gaXNVUkxTYW1lT3JpZ2luKCkge1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH07XG4gICAgfSkoKVxuKTtcbiIsICIndXNlIHN0cmljdCc7XG5cbnZhciBBeGlvc0Vycm9yID0gcmVxdWlyZSgnLi4vY29yZS9BeGlvc0Vycm9yJyk7XG52YXIgdXRpbHMgPSByZXF1aXJlKCcuLi91dGlscycpO1xuXG4vKipcbiAqIEEgYENhbmNlbGVkRXJyb3JgIGlzIGFuIG9iamVjdCB0aGF0IGlzIHRocm93biB3aGVuIGFuIG9wZXJhdGlvbiBpcyBjYW5jZWxlZC5cbiAqXG4gKiBAY2xhc3NcbiAqIEBwYXJhbSB7c3RyaW5nPX0gbWVzc2FnZSBUaGUgbWVzc2FnZS5cbiAqL1xuZnVuY3Rpb24gQ2FuY2VsZWRFcnJvcihtZXNzYWdlKSB7XG4gIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1lcS1udWxsLGVxZXFlcVxuICBBeGlvc0Vycm9yLmNhbGwodGhpcywgbWVzc2FnZSA9PSBudWxsID8gJ2NhbmNlbGVkJyA6IG1lc3NhZ2UsIEF4aW9zRXJyb3IuRVJSX0NBTkNFTEVEKTtcbiAgdGhpcy5uYW1lID0gJ0NhbmNlbGVkRXJyb3InO1xufVxuXG51dGlscy5pbmhlcml0cyhDYW5jZWxlZEVycm9yLCBBeGlvc0Vycm9yLCB7XG4gIF9fQ0FOQ0VMX186IHRydWVcbn0pO1xuXG5tb2R1bGUuZXhwb3J0cyA9IENhbmNlbGVkRXJyb3I7XG4iLCAiJ3VzZSBzdHJpY3QnO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIHBhcnNlUHJvdG9jb2wodXJsKSB7XG4gIHZhciBtYXRjaCA9IC9eKFstK1xcd117MSwyNX0pKDo/XFwvXFwvfDopLy5leGVjKHVybCk7XG4gIHJldHVybiBtYXRjaCAmJiBtYXRjaFsxXSB8fCAnJztcbn07XG4iLCAiJ3VzZSBzdHJpY3QnO1xuXG52YXIgdXRpbHMgPSByZXF1aXJlKCcuLy4uL3V0aWxzJyk7XG52YXIgc2V0dGxlID0gcmVxdWlyZSgnLi8uLi9jb3JlL3NldHRsZScpO1xudmFyIGNvb2tpZXMgPSByZXF1aXJlKCcuLy4uL2hlbHBlcnMvY29va2llcycpO1xudmFyIGJ1aWxkVVJMID0gcmVxdWlyZSgnLi8uLi9oZWxwZXJzL2J1aWxkVVJMJyk7XG52YXIgYnVpbGRGdWxsUGF0aCA9IHJlcXVpcmUoJy4uL2NvcmUvYnVpbGRGdWxsUGF0aCcpO1xudmFyIHBhcnNlSGVhZGVycyA9IHJlcXVpcmUoJy4vLi4vaGVscGVycy9wYXJzZUhlYWRlcnMnKTtcbnZhciBpc1VSTFNhbWVPcmlnaW4gPSByZXF1aXJlKCcuLy4uL2hlbHBlcnMvaXNVUkxTYW1lT3JpZ2luJyk7XG52YXIgdHJhbnNpdGlvbmFsRGVmYXVsdHMgPSByZXF1aXJlKCcuLi9kZWZhdWx0cy90cmFuc2l0aW9uYWwnKTtcbnZhciBBeGlvc0Vycm9yID0gcmVxdWlyZSgnLi4vY29yZS9BeGlvc0Vycm9yJyk7XG52YXIgQ2FuY2VsZWRFcnJvciA9IHJlcXVpcmUoJy4uL2NhbmNlbC9DYW5jZWxlZEVycm9yJyk7XG52YXIgcGFyc2VQcm90b2NvbCA9IHJlcXVpcmUoJy4uL2hlbHBlcnMvcGFyc2VQcm90b2NvbCcpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIHhockFkYXB0ZXIoY29uZmlnKSB7XG4gIHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbiBkaXNwYXRjaFhoclJlcXVlc3QocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgdmFyIHJlcXVlc3REYXRhID0gY29uZmlnLmRhdGE7XG4gICAgdmFyIHJlcXVlc3RIZWFkZXJzID0gY29uZmlnLmhlYWRlcnM7XG4gICAgdmFyIHJlc3BvbnNlVHlwZSA9IGNvbmZpZy5yZXNwb25zZVR5cGU7XG4gICAgdmFyIG9uQ2FuY2VsZWQ7XG4gICAgZnVuY3Rpb24gZG9uZSgpIHtcbiAgICAgIGlmIChjb25maWcuY2FuY2VsVG9rZW4pIHtcbiAgICAgICAgY29uZmlnLmNhbmNlbFRva2VuLnVuc3Vic2NyaWJlKG9uQ2FuY2VsZWQpO1xuICAgICAgfVxuXG4gICAgICBpZiAoY29uZmlnLnNpZ25hbCkge1xuICAgICAgICBjb25maWcuc2lnbmFsLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2Fib3J0Jywgb25DYW5jZWxlZCk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKHV0aWxzLmlzRm9ybURhdGEocmVxdWVzdERhdGEpICYmIHV0aWxzLmlzU3RhbmRhcmRCcm93c2VyRW52KCkpIHtcbiAgICAgIGRlbGV0ZSByZXF1ZXN0SGVhZGVyc1snQ29udGVudC1UeXBlJ107IC8vIExldCB0aGUgYnJvd3NlciBzZXQgaXRcbiAgICB9XG5cbiAgICB2YXIgcmVxdWVzdCA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpO1xuXG4gICAgLy8gSFRUUCBiYXNpYyBhdXRoZW50aWNhdGlvblxuICAgIGlmIChjb25maWcuYXV0aCkge1xuICAgICAgdmFyIHVzZXJuYW1lID0gY29uZmlnLmF1dGgudXNlcm5hbWUgfHwgJyc7XG4gICAgICB2YXIgcGFzc3dvcmQgPSBjb25maWcuYXV0aC5wYXNzd29yZCA/IHVuZXNjYXBlKGVuY29kZVVSSUNvbXBvbmVudChjb25maWcuYXV0aC5wYXNzd29yZCkpIDogJyc7XG4gICAgICByZXF1ZXN0SGVhZGVycy5BdXRob3JpemF0aW9uID0gJ0Jhc2ljICcgKyBidG9hKHVzZXJuYW1lICsgJzonICsgcGFzc3dvcmQpO1xuICAgIH1cblxuICAgIHZhciBmdWxsUGF0aCA9IGJ1aWxkRnVsbFBhdGgoY29uZmlnLmJhc2VVUkwsIGNvbmZpZy51cmwpO1xuXG4gICAgcmVxdWVzdC5vcGVuKGNvbmZpZy5tZXRob2QudG9VcHBlckNhc2UoKSwgYnVpbGRVUkwoZnVsbFBhdGgsIGNvbmZpZy5wYXJhbXMsIGNvbmZpZy5wYXJhbXNTZXJpYWxpemVyKSwgdHJ1ZSk7XG5cbiAgICAvLyBTZXQgdGhlIHJlcXVlc3QgdGltZW91dCBpbiBNU1xuICAgIHJlcXVlc3QudGltZW91dCA9IGNvbmZpZy50aW1lb3V0O1xuXG4gICAgZnVuY3Rpb24gb25sb2FkZW5kKCkge1xuICAgICAgaWYgKCFyZXF1ZXN0KSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIC8vIFByZXBhcmUgdGhlIHJlc3BvbnNlXG4gICAgICB2YXIgcmVzcG9uc2VIZWFkZXJzID0gJ2dldEFsbFJlc3BvbnNlSGVhZGVycycgaW4gcmVxdWVzdCA/IHBhcnNlSGVhZGVycyhyZXF1ZXN0LmdldEFsbFJlc3BvbnNlSGVhZGVycygpKSA6IG51bGw7XG4gICAgICB2YXIgcmVzcG9uc2VEYXRhID0gIXJlc3BvbnNlVHlwZSB8fCByZXNwb25zZVR5cGUgPT09ICd0ZXh0JyB8fCAgcmVzcG9uc2VUeXBlID09PSAnanNvbicgP1xuICAgICAgICByZXF1ZXN0LnJlc3BvbnNlVGV4dCA6IHJlcXVlc3QucmVzcG9uc2U7XG4gICAgICB2YXIgcmVzcG9uc2UgPSB7XG4gICAgICAgIGRhdGE6IHJlc3BvbnNlRGF0YSxcbiAgICAgICAgc3RhdHVzOiByZXF1ZXN0LnN0YXR1cyxcbiAgICAgICAgc3RhdHVzVGV4dDogcmVxdWVzdC5zdGF0dXNUZXh0LFxuICAgICAgICBoZWFkZXJzOiByZXNwb25zZUhlYWRlcnMsXG4gICAgICAgIGNvbmZpZzogY29uZmlnLFxuICAgICAgICByZXF1ZXN0OiByZXF1ZXN0XG4gICAgICB9O1xuXG4gICAgICBzZXR0bGUoZnVuY3Rpb24gX3Jlc29sdmUodmFsdWUpIHtcbiAgICAgICAgcmVzb2x2ZSh2YWx1ZSk7XG4gICAgICAgIGRvbmUoKTtcbiAgICAgIH0sIGZ1bmN0aW9uIF9yZWplY3QoZXJyKSB7XG4gICAgICAgIHJlamVjdChlcnIpO1xuICAgICAgICBkb25lKCk7XG4gICAgICB9LCByZXNwb25zZSk7XG5cbiAgICAgIC8vIENsZWFuIHVwIHJlcXVlc3RcbiAgICAgIHJlcXVlc3QgPSBudWxsO1xuICAgIH1cblxuICAgIGlmICgnb25sb2FkZW5kJyBpbiByZXF1ZXN0KSB7XG4gICAgICAvLyBVc2Ugb25sb2FkZW5kIGlmIGF2YWlsYWJsZVxuICAgICAgcmVxdWVzdC5vbmxvYWRlbmQgPSBvbmxvYWRlbmQ7XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIExpc3RlbiBmb3IgcmVhZHkgc3RhdGUgdG8gZW11bGF0ZSBvbmxvYWRlbmRcbiAgICAgIHJlcXVlc3Qub25yZWFkeXN0YXRlY2hhbmdlID0gZnVuY3Rpb24gaGFuZGxlTG9hZCgpIHtcbiAgICAgICAgaWYgKCFyZXF1ZXN0IHx8IHJlcXVlc3QucmVhZHlTdGF0ZSAhPT0gNCkge1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIFRoZSByZXF1ZXN0IGVycm9yZWQgb3V0IGFuZCB3ZSBkaWRuJ3QgZ2V0IGEgcmVzcG9uc2UsIHRoaXMgd2lsbCBiZVxuICAgICAgICAvLyBoYW5kbGVkIGJ5IG9uZXJyb3IgaW5zdGVhZFxuICAgICAgICAvLyBXaXRoIG9uZSBleGNlcHRpb246IHJlcXVlc3QgdGhhdCB1c2luZyBmaWxlOiBwcm90b2NvbCwgbW9zdCBicm93c2Vyc1xuICAgICAgICAvLyB3aWxsIHJldHVybiBzdGF0dXMgYXMgMCBldmVuIHRob3VnaCBpdCdzIGEgc3VjY2Vzc2Z1bCByZXF1ZXN0XG4gICAgICAgIGlmIChyZXF1ZXN0LnN0YXR1cyA9PT0gMCAmJiAhKHJlcXVlc3QucmVzcG9uc2VVUkwgJiYgcmVxdWVzdC5yZXNwb25zZVVSTC5pbmRleE9mKCdmaWxlOicpID09PSAwKSkge1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICAvLyByZWFkeXN0YXRlIGhhbmRsZXIgaXMgY2FsbGluZyBiZWZvcmUgb25lcnJvciBvciBvbnRpbWVvdXQgaGFuZGxlcnMsXG4gICAgICAgIC8vIHNvIHdlIHNob3VsZCBjYWxsIG9ubG9hZGVuZCBvbiB0aGUgbmV4dCAndGljaydcbiAgICAgICAgc2V0VGltZW91dChvbmxvYWRlbmQpO1xuICAgICAgfTtcbiAgICB9XG5cbiAgICAvLyBIYW5kbGUgYnJvd3NlciByZXF1ZXN0IGNhbmNlbGxhdGlvbiAoYXMgb3Bwb3NlZCB0byBhIG1hbnVhbCBjYW5jZWxsYXRpb24pXG4gICAgcmVxdWVzdC5vbmFib3J0ID0gZnVuY3Rpb24gaGFuZGxlQWJvcnQoKSB7XG4gICAgICBpZiAoIXJlcXVlc3QpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICByZWplY3QobmV3IEF4aW9zRXJyb3IoJ1JlcXVlc3QgYWJvcnRlZCcsIEF4aW9zRXJyb3IuRUNPTk5BQk9SVEVELCBjb25maWcsIHJlcXVlc3QpKTtcblxuICAgICAgLy8gQ2xlYW4gdXAgcmVxdWVzdFxuICAgICAgcmVxdWVzdCA9IG51bGw7XG4gICAgfTtcblxuICAgIC8vIEhhbmRsZSBsb3cgbGV2ZWwgbmV0d29yayBlcnJvcnNcbiAgICByZXF1ZXN0Lm9uZXJyb3IgPSBmdW5jdGlvbiBoYW5kbGVFcnJvcigpIHtcbiAgICAgIC8vIFJlYWwgZXJyb3JzIGFyZSBoaWRkZW4gZnJvbSB1cyBieSB0aGUgYnJvd3NlclxuICAgICAgLy8gb25lcnJvciBzaG91bGQgb25seSBmaXJlIGlmIGl0J3MgYSBuZXR3b3JrIGVycm9yXG4gICAgICByZWplY3QobmV3IEF4aW9zRXJyb3IoJ05ldHdvcmsgRXJyb3InLCBBeGlvc0Vycm9yLkVSUl9ORVRXT1JLLCBjb25maWcsIHJlcXVlc3QsIHJlcXVlc3QpKTtcblxuICAgICAgLy8gQ2xlYW4gdXAgcmVxdWVzdFxuICAgICAgcmVxdWVzdCA9IG51bGw7XG4gICAgfTtcblxuICAgIC8vIEhhbmRsZSB0aW1lb3V0XG4gICAgcmVxdWVzdC5vbnRpbWVvdXQgPSBmdW5jdGlvbiBoYW5kbGVUaW1lb3V0KCkge1xuICAgICAgdmFyIHRpbWVvdXRFcnJvck1lc3NhZ2UgPSBjb25maWcudGltZW91dCA/ICd0aW1lb3V0IG9mICcgKyBjb25maWcudGltZW91dCArICdtcyBleGNlZWRlZCcgOiAndGltZW91dCBleGNlZWRlZCc7XG4gICAgICB2YXIgdHJhbnNpdGlvbmFsID0gY29uZmlnLnRyYW5zaXRpb25hbCB8fCB0cmFuc2l0aW9uYWxEZWZhdWx0cztcbiAgICAgIGlmIChjb25maWcudGltZW91dEVycm9yTWVzc2FnZSkge1xuICAgICAgICB0aW1lb3V0RXJyb3JNZXNzYWdlID0gY29uZmlnLnRpbWVvdXRFcnJvck1lc3NhZ2U7XG4gICAgICB9XG4gICAgICByZWplY3QobmV3IEF4aW9zRXJyb3IoXG4gICAgICAgIHRpbWVvdXRFcnJvck1lc3NhZ2UsXG4gICAgICAgIHRyYW5zaXRpb25hbC5jbGFyaWZ5VGltZW91dEVycm9yID8gQXhpb3NFcnJvci5FVElNRURPVVQgOiBBeGlvc0Vycm9yLkVDT05OQUJPUlRFRCxcbiAgICAgICAgY29uZmlnLFxuICAgICAgICByZXF1ZXN0KSk7XG5cbiAgICAgIC8vIENsZWFuIHVwIHJlcXVlc3RcbiAgICAgIHJlcXVlc3QgPSBudWxsO1xuICAgIH07XG5cbiAgICAvLyBBZGQgeHNyZiBoZWFkZXJcbiAgICAvLyBUaGlzIGlzIG9ubHkgZG9uZSBpZiBydW5uaW5nIGluIGEgc3RhbmRhcmQgYnJvd3NlciBlbnZpcm9ubWVudC5cbiAgICAvLyBTcGVjaWZpY2FsbHkgbm90IGlmIHdlJ3JlIGluIGEgd2ViIHdvcmtlciwgb3IgcmVhY3QtbmF0aXZlLlxuICAgIGlmICh1dGlscy5pc1N0YW5kYXJkQnJvd3NlckVudigpKSB7XG4gICAgICAvLyBBZGQgeHNyZiBoZWFkZXJcbiAgICAgIHZhciB4c3JmVmFsdWUgPSAoY29uZmlnLndpdGhDcmVkZW50aWFscyB8fCBpc1VSTFNhbWVPcmlnaW4oZnVsbFBhdGgpKSAmJiBjb25maWcueHNyZkNvb2tpZU5hbWUgP1xuICAgICAgICBjb29raWVzLnJlYWQoY29uZmlnLnhzcmZDb29raWVOYW1lKSA6XG4gICAgICAgIHVuZGVmaW5lZDtcblxuICAgICAgaWYgKHhzcmZWYWx1ZSkge1xuICAgICAgICByZXF1ZXN0SGVhZGVyc1tjb25maWcueHNyZkhlYWRlck5hbWVdID0geHNyZlZhbHVlO1xuICAgICAgfVxuICAgIH1cblxuICAgIC8vIEFkZCBoZWFkZXJzIHRvIHRoZSByZXF1ZXN0XG4gICAgaWYgKCdzZXRSZXF1ZXN0SGVhZGVyJyBpbiByZXF1ZXN0KSB7XG4gICAgICB1dGlscy5mb3JFYWNoKHJlcXVlc3RIZWFkZXJzLCBmdW5jdGlvbiBzZXRSZXF1ZXN0SGVhZGVyKHZhbCwga2V5KSB7XG4gICAgICAgIGlmICh0eXBlb2YgcmVxdWVzdERhdGEgPT09ICd1bmRlZmluZWQnICYmIGtleS50b0xvd2VyQ2FzZSgpID09PSAnY29udGVudC10eXBlJykge1xuICAgICAgICAgIC8vIFJlbW92ZSBDb250ZW50LVR5cGUgaWYgZGF0YSBpcyB1bmRlZmluZWRcbiAgICAgICAgICBkZWxldGUgcmVxdWVzdEhlYWRlcnNba2V5XTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAvLyBPdGhlcndpc2UgYWRkIGhlYWRlciB0byB0aGUgcmVxdWVzdFxuICAgICAgICAgIHJlcXVlc3Quc2V0UmVxdWVzdEhlYWRlcihrZXksIHZhbCk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cblxuICAgIC8vIEFkZCB3aXRoQ3JlZGVudGlhbHMgdG8gcmVxdWVzdCBpZiBuZWVkZWRcbiAgICBpZiAoIXV0aWxzLmlzVW5kZWZpbmVkKGNvbmZpZy53aXRoQ3JlZGVudGlhbHMpKSB7XG4gICAgICByZXF1ZXN0LndpdGhDcmVkZW50aWFscyA9ICEhY29uZmlnLndpdGhDcmVkZW50aWFscztcbiAgICB9XG5cbiAgICAvLyBBZGQgcmVzcG9uc2VUeXBlIHRvIHJlcXVlc3QgaWYgbmVlZGVkXG4gICAgaWYgKHJlc3BvbnNlVHlwZSAmJiByZXNwb25zZVR5cGUgIT09ICdqc29uJykge1xuICAgICAgcmVxdWVzdC5yZXNwb25zZVR5cGUgPSBjb25maWcucmVzcG9uc2VUeXBlO1xuICAgIH1cblxuICAgIC8vIEhhbmRsZSBwcm9ncmVzcyBpZiBuZWVkZWRcbiAgICBpZiAodHlwZW9mIGNvbmZpZy5vbkRvd25sb2FkUHJvZ3Jlc3MgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgIHJlcXVlc3QuYWRkRXZlbnRMaXN0ZW5lcigncHJvZ3Jlc3MnLCBjb25maWcub25Eb3dubG9hZFByb2dyZXNzKTtcbiAgICB9XG5cbiAgICAvLyBOb3QgYWxsIGJyb3dzZXJzIHN1cHBvcnQgdXBsb2FkIGV2ZW50c1xuICAgIGlmICh0eXBlb2YgY29uZmlnLm9uVXBsb2FkUHJvZ3Jlc3MgPT09ICdmdW5jdGlvbicgJiYgcmVxdWVzdC51cGxvYWQpIHtcbiAgICAgIHJlcXVlc3QudXBsb2FkLmFkZEV2ZW50TGlzdGVuZXIoJ3Byb2dyZXNzJywgY29uZmlnLm9uVXBsb2FkUHJvZ3Jlc3MpO1xuICAgIH1cblxuICAgIGlmIChjb25maWcuY2FuY2VsVG9rZW4gfHwgY29uZmlnLnNpZ25hbCkge1xuICAgICAgLy8gSGFuZGxlIGNhbmNlbGxhdGlvblxuICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIGZ1bmMtbmFtZXNcbiAgICAgIG9uQ2FuY2VsZWQgPSBmdW5jdGlvbihjYW5jZWwpIHtcbiAgICAgICAgaWYgKCFyZXF1ZXN0KSB7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIHJlamVjdCghY2FuY2VsIHx8IChjYW5jZWwgJiYgY2FuY2VsLnR5cGUpID8gbmV3IENhbmNlbGVkRXJyb3IoKSA6IGNhbmNlbCk7XG4gICAgICAgIHJlcXVlc3QuYWJvcnQoKTtcbiAgICAgICAgcmVxdWVzdCA9IG51bGw7XG4gICAgICB9O1xuXG4gICAgICBjb25maWcuY2FuY2VsVG9rZW4gJiYgY29uZmlnLmNhbmNlbFRva2VuLnN1YnNjcmliZShvbkNhbmNlbGVkKTtcbiAgICAgIGlmIChjb25maWcuc2lnbmFsKSB7XG4gICAgICAgIGNvbmZpZy5zaWduYWwuYWJvcnRlZCA/IG9uQ2FuY2VsZWQoKSA6IGNvbmZpZy5zaWduYWwuYWRkRXZlbnRMaXN0ZW5lcignYWJvcnQnLCBvbkNhbmNlbGVkKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAoIXJlcXVlc3REYXRhKSB7XG4gICAgICByZXF1ZXN0RGF0YSA9IG51bGw7XG4gICAgfVxuXG4gICAgdmFyIHByb3RvY29sID0gcGFyc2VQcm90b2NvbChmdWxsUGF0aCk7XG5cbiAgICBpZiAocHJvdG9jb2wgJiYgWyAnaHR0cCcsICdodHRwcycsICdmaWxlJyBdLmluZGV4T2YocHJvdG9jb2wpID09PSAtMSkge1xuICAgICAgcmVqZWN0KG5ldyBBeGlvc0Vycm9yKCdVbnN1cHBvcnRlZCBwcm90b2NvbCAnICsgcHJvdG9jb2wgKyAnOicsIEF4aW9zRXJyb3IuRVJSX0JBRF9SRVFVRVNULCBjb25maWcpKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cblxuICAgIC8vIFNlbmQgdGhlIHJlcXVlc3RcbiAgICByZXF1ZXN0LnNlbmQocmVxdWVzdERhdGEpO1xuICB9KTtcbn07XG4iLCAiLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIHN0cmljdFxubW9kdWxlLmV4cG9ydHMgPSBudWxsO1xuIiwgIid1c2Ugc3RyaWN0JztcblxudmFyIHV0aWxzID0gcmVxdWlyZSgnLi4vdXRpbHMnKTtcbnZhciBub3JtYWxpemVIZWFkZXJOYW1lID0gcmVxdWlyZSgnLi4vaGVscGVycy9ub3JtYWxpemVIZWFkZXJOYW1lJyk7XG52YXIgQXhpb3NFcnJvciA9IHJlcXVpcmUoJy4uL2NvcmUvQXhpb3NFcnJvcicpO1xudmFyIHRyYW5zaXRpb25hbERlZmF1bHRzID0gcmVxdWlyZSgnLi90cmFuc2l0aW9uYWwnKTtcbnZhciB0b0Zvcm1EYXRhID0gcmVxdWlyZSgnLi4vaGVscGVycy90b0Zvcm1EYXRhJyk7XG5cbnZhciBERUZBVUxUX0NPTlRFTlRfVFlQRSA9IHtcbiAgJ0NvbnRlbnQtVHlwZSc6ICdhcHBsaWNhdGlvbi94LXd3dy1mb3JtLXVybGVuY29kZWQnXG59O1xuXG5mdW5jdGlvbiBzZXRDb250ZW50VHlwZUlmVW5zZXQoaGVhZGVycywgdmFsdWUpIHtcbiAgaWYgKCF1dGlscy5pc1VuZGVmaW5lZChoZWFkZXJzKSAmJiB1dGlscy5pc1VuZGVmaW5lZChoZWFkZXJzWydDb250ZW50LVR5cGUnXSkpIHtcbiAgICBoZWFkZXJzWydDb250ZW50LVR5cGUnXSA9IHZhbHVlO1xuICB9XG59XG5cbmZ1bmN0aW9uIGdldERlZmF1bHRBZGFwdGVyKCkge1xuICB2YXIgYWRhcHRlcjtcbiAgaWYgKHR5cGVvZiBYTUxIdHRwUmVxdWVzdCAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAvLyBGb3IgYnJvd3NlcnMgdXNlIFhIUiBhZGFwdGVyXG4gICAgYWRhcHRlciA9IHJlcXVpcmUoJy4uL2FkYXB0ZXJzL3hocicpO1xuICB9IGVsc2UgaWYgKHR5cGVvZiBwcm9jZXNzICE9PSAndW5kZWZpbmVkJyAmJiBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwocHJvY2VzcykgPT09ICdbb2JqZWN0IHByb2Nlc3NdJykge1xuICAgIC8vIEZvciBub2RlIHVzZSBIVFRQIGFkYXB0ZXJcbiAgICBhZGFwdGVyID0gcmVxdWlyZSgnLi4vYWRhcHRlcnMvaHR0cCcpO1xuICB9XG4gIHJldHVybiBhZGFwdGVyO1xufVxuXG5mdW5jdGlvbiBzdHJpbmdpZnlTYWZlbHkocmF3VmFsdWUsIHBhcnNlciwgZW5jb2Rlcikge1xuICBpZiAodXRpbHMuaXNTdHJpbmcocmF3VmFsdWUpKSB7XG4gICAgdHJ5IHtcbiAgICAgIChwYXJzZXIgfHwgSlNPTi5wYXJzZSkocmF3VmFsdWUpO1xuICAgICAgcmV0dXJuIHV0aWxzLnRyaW0ocmF3VmFsdWUpO1xuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgIGlmIChlLm5hbWUgIT09ICdTeW50YXhFcnJvcicpIHtcbiAgICAgICAgdGhyb3cgZTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICByZXR1cm4gKGVuY29kZXIgfHwgSlNPTi5zdHJpbmdpZnkpKHJhd1ZhbHVlKTtcbn1cblxudmFyIGRlZmF1bHRzID0ge1xuXG4gIHRyYW5zaXRpb25hbDogdHJhbnNpdGlvbmFsRGVmYXVsdHMsXG5cbiAgYWRhcHRlcjogZ2V0RGVmYXVsdEFkYXB0ZXIoKSxcblxuICB0cmFuc2Zvcm1SZXF1ZXN0OiBbZnVuY3Rpb24gdHJhbnNmb3JtUmVxdWVzdChkYXRhLCBoZWFkZXJzKSB7XG4gICAgbm9ybWFsaXplSGVhZGVyTmFtZShoZWFkZXJzLCAnQWNjZXB0Jyk7XG4gICAgbm9ybWFsaXplSGVhZGVyTmFtZShoZWFkZXJzLCAnQ29udGVudC1UeXBlJyk7XG5cbiAgICBpZiAodXRpbHMuaXNGb3JtRGF0YShkYXRhKSB8fFxuICAgICAgdXRpbHMuaXNBcnJheUJ1ZmZlcihkYXRhKSB8fFxuICAgICAgdXRpbHMuaXNCdWZmZXIoZGF0YSkgfHxcbiAgICAgIHV0aWxzLmlzU3RyZWFtKGRhdGEpIHx8XG4gICAgICB1dGlscy5pc0ZpbGUoZGF0YSkgfHxcbiAgICAgIHV0aWxzLmlzQmxvYihkYXRhKVxuICAgICkge1xuICAgICAgcmV0dXJuIGRhdGE7XG4gICAgfVxuICAgIGlmICh1dGlscy5pc0FycmF5QnVmZmVyVmlldyhkYXRhKSkge1xuICAgICAgcmV0dXJuIGRhdGEuYnVmZmVyO1xuICAgIH1cbiAgICBpZiAodXRpbHMuaXNVUkxTZWFyY2hQYXJhbXMoZGF0YSkpIHtcbiAgICAgIHNldENvbnRlbnRUeXBlSWZVbnNldChoZWFkZXJzLCAnYXBwbGljYXRpb24veC13d3ctZm9ybS11cmxlbmNvZGVkO2NoYXJzZXQ9dXRmLTgnKTtcbiAgICAgIHJldHVybiBkYXRhLnRvU3RyaW5nKCk7XG4gICAgfVxuXG4gICAgdmFyIGlzT2JqZWN0UGF5bG9hZCA9IHV0aWxzLmlzT2JqZWN0KGRhdGEpO1xuICAgIHZhciBjb250ZW50VHlwZSA9IGhlYWRlcnMgJiYgaGVhZGVyc1snQ29udGVudC1UeXBlJ107XG5cbiAgICB2YXIgaXNGaWxlTGlzdDtcblxuICAgIGlmICgoaXNGaWxlTGlzdCA9IHV0aWxzLmlzRmlsZUxpc3QoZGF0YSkpIHx8IChpc09iamVjdFBheWxvYWQgJiYgY29udGVudFR5cGUgPT09ICdtdWx0aXBhcnQvZm9ybS1kYXRhJykpIHtcbiAgICAgIHZhciBfRm9ybURhdGEgPSB0aGlzLmVudiAmJiB0aGlzLmVudi5Gb3JtRGF0YTtcbiAgICAgIHJldHVybiB0b0Zvcm1EYXRhKGlzRmlsZUxpc3QgPyB7J2ZpbGVzW10nOiBkYXRhfSA6IGRhdGEsIF9Gb3JtRGF0YSAmJiBuZXcgX0Zvcm1EYXRhKCkpO1xuICAgIH0gZWxzZSBpZiAoaXNPYmplY3RQYXlsb2FkIHx8IGNvbnRlbnRUeXBlID09PSAnYXBwbGljYXRpb24vanNvbicpIHtcbiAgICAgIHNldENvbnRlbnRUeXBlSWZVbnNldChoZWFkZXJzLCAnYXBwbGljYXRpb24vanNvbicpO1xuICAgICAgcmV0dXJuIHN0cmluZ2lmeVNhZmVseShkYXRhKTtcbiAgICB9XG5cbiAgICByZXR1cm4gZGF0YTtcbiAgfV0sXG5cbiAgdHJhbnNmb3JtUmVzcG9uc2U6IFtmdW5jdGlvbiB0cmFuc2Zvcm1SZXNwb25zZShkYXRhKSB7XG4gICAgdmFyIHRyYW5zaXRpb25hbCA9IHRoaXMudHJhbnNpdGlvbmFsIHx8IGRlZmF1bHRzLnRyYW5zaXRpb25hbDtcbiAgICB2YXIgc2lsZW50SlNPTlBhcnNpbmcgPSB0cmFuc2l0aW9uYWwgJiYgdHJhbnNpdGlvbmFsLnNpbGVudEpTT05QYXJzaW5nO1xuICAgIHZhciBmb3JjZWRKU09OUGFyc2luZyA9IHRyYW5zaXRpb25hbCAmJiB0cmFuc2l0aW9uYWwuZm9yY2VkSlNPTlBhcnNpbmc7XG4gICAgdmFyIHN0cmljdEpTT05QYXJzaW5nID0gIXNpbGVudEpTT05QYXJzaW5nICYmIHRoaXMucmVzcG9uc2VUeXBlID09PSAnanNvbic7XG5cbiAgICBpZiAoc3RyaWN0SlNPTlBhcnNpbmcgfHwgKGZvcmNlZEpTT05QYXJzaW5nICYmIHV0aWxzLmlzU3RyaW5nKGRhdGEpICYmIGRhdGEubGVuZ3RoKSkge1xuICAgICAgdHJ5IHtcbiAgICAgICAgcmV0dXJuIEpTT04ucGFyc2UoZGF0YSk7XG4gICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIGlmIChzdHJpY3RKU09OUGFyc2luZykge1xuICAgICAgICAgIGlmIChlLm5hbWUgPT09ICdTeW50YXhFcnJvcicpIHtcbiAgICAgICAgICAgIHRocm93IEF4aW9zRXJyb3IuZnJvbShlLCBBeGlvc0Vycm9yLkVSUl9CQURfUkVTUE9OU0UsIHRoaXMsIG51bGwsIHRoaXMucmVzcG9uc2UpO1xuICAgICAgICAgIH1cbiAgICAgICAgICB0aHJvdyBlO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIGRhdGE7XG4gIH1dLFxuXG4gIC8qKlxuICAgKiBBIHRpbWVvdXQgaW4gbWlsbGlzZWNvbmRzIHRvIGFib3J0IGEgcmVxdWVzdC4gSWYgc2V0IHRvIDAgKGRlZmF1bHQpIGFcbiAgICogdGltZW91dCBpcyBub3QgY3JlYXRlZC5cbiAgICovXG4gIHRpbWVvdXQ6IDAsXG5cbiAgeHNyZkNvb2tpZU5hbWU6ICdYU1JGLVRPS0VOJyxcbiAgeHNyZkhlYWRlck5hbWU6ICdYLVhTUkYtVE9LRU4nLFxuXG4gIG1heENvbnRlbnRMZW5ndGg6IC0xLFxuICBtYXhCb2R5TGVuZ3RoOiAtMSxcblxuICBlbnY6IHtcbiAgICBGb3JtRGF0YTogcmVxdWlyZSgnLi9lbnYvRm9ybURhdGEnKVxuICB9LFxuXG4gIHZhbGlkYXRlU3RhdHVzOiBmdW5jdGlvbiB2YWxpZGF0ZVN0YXR1cyhzdGF0dXMpIHtcbiAgICByZXR1cm4gc3RhdHVzID49IDIwMCAmJiBzdGF0dXMgPCAzMDA7XG4gIH0sXG5cbiAgaGVhZGVyczoge1xuICAgIGNvbW1vbjoge1xuICAgICAgJ0FjY2VwdCc6ICdhcHBsaWNhdGlvbi9qc29uLCB0ZXh0L3BsYWluLCAqLyonXG4gICAgfVxuICB9XG59O1xuXG51dGlscy5mb3JFYWNoKFsnZGVsZXRlJywgJ2dldCcsICdoZWFkJ10sIGZ1bmN0aW9uIGZvckVhY2hNZXRob2ROb0RhdGEobWV0aG9kKSB7XG4gIGRlZmF1bHRzLmhlYWRlcnNbbWV0aG9kXSA9IHt9O1xufSk7XG5cbnV0aWxzLmZvckVhY2goWydwb3N0JywgJ3B1dCcsICdwYXRjaCddLCBmdW5jdGlvbiBmb3JFYWNoTWV0aG9kV2l0aERhdGEobWV0aG9kKSB7XG4gIGRlZmF1bHRzLmhlYWRlcnNbbWV0aG9kXSA9IHV0aWxzLm1lcmdlKERFRkFVTFRfQ09OVEVOVF9UWVBFKTtcbn0pO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGRlZmF1bHRzO1xuIiwgIid1c2Ugc3RyaWN0JztcblxudmFyIHV0aWxzID0gcmVxdWlyZSgnLi8uLi91dGlscycpO1xudmFyIGRlZmF1bHRzID0gcmVxdWlyZSgnLi4vZGVmYXVsdHMnKTtcblxuLyoqXG4gKiBUcmFuc2Zvcm0gdGhlIGRhdGEgZm9yIGEgcmVxdWVzdCBvciBhIHJlc3BvbnNlXG4gKlxuICogQHBhcmFtIHtPYmplY3R8U3RyaW5nfSBkYXRhIFRoZSBkYXRhIHRvIGJlIHRyYW5zZm9ybWVkXG4gKiBAcGFyYW0ge0FycmF5fSBoZWFkZXJzIFRoZSBoZWFkZXJzIGZvciB0aGUgcmVxdWVzdCBvciByZXNwb25zZVxuICogQHBhcmFtIHtBcnJheXxGdW5jdGlvbn0gZm5zIEEgc2luZ2xlIGZ1bmN0aW9uIG9yIEFycmF5IG9mIGZ1bmN0aW9uc1xuICogQHJldHVybnMgeyp9IFRoZSByZXN1bHRpbmcgdHJhbnNmb3JtZWQgZGF0YVxuICovXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIHRyYW5zZm9ybURhdGEoZGF0YSwgaGVhZGVycywgZm5zKSB7XG4gIHZhciBjb250ZXh0ID0gdGhpcyB8fCBkZWZhdWx0cztcbiAgLyplc2xpbnQgbm8tcGFyYW0tcmVhc3NpZ246MCovXG4gIHV0aWxzLmZvckVhY2goZm5zLCBmdW5jdGlvbiB0cmFuc2Zvcm0oZm4pIHtcbiAgICBkYXRhID0gZm4uY2FsbChjb250ZXh0LCBkYXRhLCBoZWFkZXJzKTtcbiAgfSk7XG5cbiAgcmV0dXJuIGRhdGE7XG59O1xuIiwgIid1c2Ugc3RyaWN0JztcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBpc0NhbmNlbCh2YWx1ZSkge1xuICByZXR1cm4gISEodmFsdWUgJiYgdmFsdWUuX19DQU5DRUxfXyk7XG59O1xuIiwgIid1c2Ugc3RyaWN0JztcblxudmFyIHV0aWxzID0gcmVxdWlyZSgnLi8uLi91dGlscycpO1xudmFyIHRyYW5zZm9ybURhdGEgPSByZXF1aXJlKCcuL3RyYW5zZm9ybURhdGEnKTtcbnZhciBpc0NhbmNlbCA9IHJlcXVpcmUoJy4uL2NhbmNlbC9pc0NhbmNlbCcpO1xudmFyIGRlZmF1bHRzID0gcmVxdWlyZSgnLi4vZGVmYXVsdHMnKTtcbnZhciBDYW5jZWxlZEVycm9yID0gcmVxdWlyZSgnLi4vY2FuY2VsL0NhbmNlbGVkRXJyb3InKTtcblxuLyoqXG4gKiBUaHJvd3MgYSBgQ2FuY2VsZWRFcnJvcmAgaWYgY2FuY2VsbGF0aW9uIGhhcyBiZWVuIHJlcXVlc3RlZC5cbiAqL1xuZnVuY3Rpb24gdGhyb3dJZkNhbmNlbGxhdGlvblJlcXVlc3RlZChjb25maWcpIHtcbiAgaWYgKGNvbmZpZy5jYW5jZWxUb2tlbikge1xuICAgIGNvbmZpZy5jYW5jZWxUb2tlbi50aHJvd0lmUmVxdWVzdGVkKCk7XG4gIH1cblxuICBpZiAoY29uZmlnLnNpZ25hbCAmJiBjb25maWcuc2lnbmFsLmFib3J0ZWQpIHtcbiAgICB0aHJvdyBuZXcgQ2FuY2VsZWRFcnJvcigpO1xuICB9XG59XG5cbi8qKlxuICogRGlzcGF0Y2ggYSByZXF1ZXN0IHRvIHRoZSBzZXJ2ZXIgdXNpbmcgdGhlIGNvbmZpZ3VyZWQgYWRhcHRlci5cbiAqXG4gKiBAcGFyYW0ge29iamVjdH0gY29uZmlnIFRoZSBjb25maWcgdGhhdCBpcyB0byBiZSB1c2VkIGZvciB0aGUgcmVxdWVzdFxuICogQHJldHVybnMge1Byb21pc2V9IFRoZSBQcm9taXNlIHRvIGJlIGZ1bGZpbGxlZFxuICovXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGRpc3BhdGNoUmVxdWVzdChjb25maWcpIHtcbiAgdGhyb3dJZkNhbmNlbGxhdGlvblJlcXVlc3RlZChjb25maWcpO1xuXG4gIC8vIEVuc3VyZSBoZWFkZXJzIGV4aXN0XG4gIGNvbmZpZy5oZWFkZXJzID0gY29uZmlnLmhlYWRlcnMgfHwge307XG5cbiAgLy8gVHJhbnNmb3JtIHJlcXVlc3QgZGF0YVxuICBjb25maWcuZGF0YSA9IHRyYW5zZm9ybURhdGEuY2FsbChcbiAgICBjb25maWcsXG4gICAgY29uZmlnLmRhdGEsXG4gICAgY29uZmlnLmhlYWRlcnMsXG4gICAgY29uZmlnLnRyYW5zZm9ybVJlcXVlc3RcbiAgKTtcblxuICAvLyBGbGF0dGVuIGhlYWRlcnNcbiAgY29uZmlnLmhlYWRlcnMgPSB1dGlscy5tZXJnZShcbiAgICBjb25maWcuaGVhZGVycy5jb21tb24gfHwge30sXG4gICAgY29uZmlnLmhlYWRlcnNbY29uZmlnLm1ldGhvZF0gfHwge30sXG4gICAgY29uZmlnLmhlYWRlcnNcbiAgKTtcblxuICB1dGlscy5mb3JFYWNoKFxuICAgIFsnZGVsZXRlJywgJ2dldCcsICdoZWFkJywgJ3Bvc3QnLCAncHV0JywgJ3BhdGNoJywgJ2NvbW1vbiddLFxuICAgIGZ1bmN0aW9uIGNsZWFuSGVhZGVyQ29uZmlnKG1ldGhvZCkge1xuICAgICAgZGVsZXRlIGNvbmZpZy5oZWFkZXJzW21ldGhvZF07XG4gICAgfVxuICApO1xuXG4gIHZhciBhZGFwdGVyID0gY29uZmlnLmFkYXB0ZXIgfHwgZGVmYXVsdHMuYWRhcHRlcjtcblxuICByZXR1cm4gYWRhcHRlcihjb25maWcpLnRoZW4oZnVuY3Rpb24gb25BZGFwdGVyUmVzb2x1dGlvbihyZXNwb25zZSkge1xuICAgIHRocm93SWZDYW5jZWxsYXRpb25SZXF1ZXN0ZWQoY29uZmlnKTtcblxuICAgIC8vIFRyYW5zZm9ybSByZXNwb25zZSBkYXRhXG4gICAgcmVzcG9uc2UuZGF0YSA9IHRyYW5zZm9ybURhdGEuY2FsbChcbiAgICAgIGNvbmZpZyxcbiAgICAgIHJlc3BvbnNlLmRhdGEsXG4gICAgICByZXNwb25zZS5oZWFkZXJzLFxuICAgICAgY29uZmlnLnRyYW5zZm9ybVJlc3BvbnNlXG4gICAgKTtcblxuICAgIHJldHVybiByZXNwb25zZTtcbiAgfSwgZnVuY3Rpb24gb25BZGFwdGVyUmVqZWN0aW9uKHJlYXNvbikge1xuICAgIGlmICghaXNDYW5jZWwocmVhc29uKSkge1xuICAgICAgdGhyb3dJZkNhbmNlbGxhdGlvblJlcXVlc3RlZChjb25maWcpO1xuXG4gICAgICAvLyBUcmFuc2Zvcm0gcmVzcG9uc2UgZGF0YVxuICAgICAgaWYgKHJlYXNvbiAmJiByZWFzb24ucmVzcG9uc2UpIHtcbiAgICAgICAgcmVhc29uLnJlc3BvbnNlLmRhdGEgPSB0cmFuc2Zvcm1EYXRhLmNhbGwoXG4gICAgICAgICAgY29uZmlnLFxuICAgICAgICAgIHJlYXNvbi5yZXNwb25zZS5kYXRhLFxuICAgICAgICAgIHJlYXNvbi5yZXNwb25zZS5oZWFkZXJzLFxuICAgICAgICAgIGNvbmZpZy50cmFuc2Zvcm1SZXNwb25zZVxuICAgICAgICApO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBQcm9taXNlLnJlamVjdChyZWFzb24pO1xuICB9KTtcbn07XG4iLCAiJ3VzZSBzdHJpY3QnO1xuXG52YXIgdXRpbHMgPSByZXF1aXJlKCcuLi91dGlscycpO1xuXG4vKipcbiAqIENvbmZpZy1zcGVjaWZpYyBtZXJnZS1mdW5jdGlvbiB3aGljaCBjcmVhdGVzIGEgbmV3IGNvbmZpZy1vYmplY3RcbiAqIGJ5IG1lcmdpbmcgdHdvIGNvbmZpZ3VyYXRpb24gb2JqZWN0cyB0b2dldGhlci5cbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gY29uZmlnMVxuICogQHBhcmFtIHtPYmplY3R9IGNvbmZpZzJcbiAqIEByZXR1cm5zIHtPYmplY3R9IE5ldyBvYmplY3QgcmVzdWx0aW5nIGZyb20gbWVyZ2luZyBjb25maWcyIHRvIGNvbmZpZzFcbiAqL1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBtZXJnZUNvbmZpZyhjb25maWcxLCBjb25maWcyKSB7XG4gIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1wYXJhbS1yZWFzc2lnblxuICBjb25maWcyID0gY29uZmlnMiB8fCB7fTtcbiAgdmFyIGNvbmZpZyA9IHt9O1xuXG4gIGZ1bmN0aW9uIGdldE1lcmdlZFZhbHVlKHRhcmdldCwgc291cmNlKSB7XG4gICAgaWYgKHV0aWxzLmlzUGxhaW5PYmplY3QodGFyZ2V0KSAmJiB1dGlscy5pc1BsYWluT2JqZWN0KHNvdXJjZSkpIHtcbiAgICAgIHJldHVybiB1dGlscy5tZXJnZSh0YXJnZXQsIHNvdXJjZSk7XG4gICAgfSBlbHNlIGlmICh1dGlscy5pc1BsYWluT2JqZWN0KHNvdXJjZSkpIHtcbiAgICAgIHJldHVybiB1dGlscy5tZXJnZSh7fSwgc291cmNlKTtcbiAgICB9IGVsc2UgaWYgKHV0aWxzLmlzQXJyYXkoc291cmNlKSkge1xuICAgICAgcmV0dXJuIHNvdXJjZS5zbGljZSgpO1xuICAgIH1cbiAgICByZXR1cm4gc291cmNlO1xuICB9XG5cbiAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIGNvbnNpc3RlbnQtcmV0dXJuXG4gIGZ1bmN0aW9uIG1lcmdlRGVlcFByb3BlcnRpZXMocHJvcCkge1xuICAgIGlmICghdXRpbHMuaXNVbmRlZmluZWQoY29uZmlnMltwcm9wXSkpIHtcbiAgICAgIHJldHVybiBnZXRNZXJnZWRWYWx1ZShjb25maWcxW3Byb3BdLCBjb25maWcyW3Byb3BdKTtcbiAgICB9IGVsc2UgaWYgKCF1dGlscy5pc1VuZGVmaW5lZChjb25maWcxW3Byb3BdKSkge1xuICAgICAgcmV0dXJuIGdldE1lcmdlZFZhbHVlKHVuZGVmaW5lZCwgY29uZmlnMVtwcm9wXSk7XG4gICAgfVxuICB9XG5cbiAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIGNvbnNpc3RlbnQtcmV0dXJuXG4gIGZ1bmN0aW9uIHZhbHVlRnJvbUNvbmZpZzIocHJvcCkge1xuICAgIGlmICghdXRpbHMuaXNVbmRlZmluZWQoY29uZmlnMltwcm9wXSkpIHtcbiAgICAgIHJldHVybiBnZXRNZXJnZWRWYWx1ZSh1bmRlZmluZWQsIGNvbmZpZzJbcHJvcF0pO1xuICAgIH1cbiAgfVxuXG4gIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBjb25zaXN0ZW50LXJldHVyblxuICBmdW5jdGlvbiBkZWZhdWx0VG9Db25maWcyKHByb3ApIHtcbiAgICBpZiAoIXV0aWxzLmlzVW5kZWZpbmVkKGNvbmZpZzJbcHJvcF0pKSB7XG4gICAgICByZXR1cm4gZ2V0TWVyZ2VkVmFsdWUodW5kZWZpbmVkLCBjb25maWcyW3Byb3BdKTtcbiAgICB9IGVsc2UgaWYgKCF1dGlscy5pc1VuZGVmaW5lZChjb25maWcxW3Byb3BdKSkge1xuICAgICAgcmV0dXJuIGdldE1lcmdlZFZhbHVlKHVuZGVmaW5lZCwgY29uZmlnMVtwcm9wXSk7XG4gICAgfVxuICB9XG5cbiAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIGNvbnNpc3RlbnQtcmV0dXJuXG4gIGZ1bmN0aW9uIG1lcmdlRGlyZWN0S2V5cyhwcm9wKSB7XG4gICAgaWYgKHByb3AgaW4gY29uZmlnMikge1xuICAgICAgcmV0dXJuIGdldE1lcmdlZFZhbHVlKGNvbmZpZzFbcHJvcF0sIGNvbmZpZzJbcHJvcF0pO1xuICAgIH0gZWxzZSBpZiAocHJvcCBpbiBjb25maWcxKSB7XG4gICAgICByZXR1cm4gZ2V0TWVyZ2VkVmFsdWUodW5kZWZpbmVkLCBjb25maWcxW3Byb3BdKTtcbiAgICB9XG4gIH1cblxuICB2YXIgbWVyZ2VNYXAgPSB7XG4gICAgJ3VybCc6IHZhbHVlRnJvbUNvbmZpZzIsXG4gICAgJ21ldGhvZCc6IHZhbHVlRnJvbUNvbmZpZzIsXG4gICAgJ2RhdGEnOiB2YWx1ZUZyb21Db25maWcyLFxuICAgICdiYXNlVVJMJzogZGVmYXVsdFRvQ29uZmlnMixcbiAgICAndHJhbnNmb3JtUmVxdWVzdCc6IGRlZmF1bHRUb0NvbmZpZzIsXG4gICAgJ3RyYW5zZm9ybVJlc3BvbnNlJzogZGVmYXVsdFRvQ29uZmlnMixcbiAgICAncGFyYW1zU2VyaWFsaXplcic6IGRlZmF1bHRUb0NvbmZpZzIsXG4gICAgJ3RpbWVvdXQnOiBkZWZhdWx0VG9Db25maWcyLFxuICAgICd0aW1lb3V0TWVzc2FnZSc6IGRlZmF1bHRUb0NvbmZpZzIsXG4gICAgJ3dpdGhDcmVkZW50aWFscyc6IGRlZmF1bHRUb0NvbmZpZzIsXG4gICAgJ2FkYXB0ZXInOiBkZWZhdWx0VG9Db25maWcyLFxuICAgICdyZXNwb25zZVR5cGUnOiBkZWZhdWx0VG9Db25maWcyLFxuICAgICd4c3JmQ29va2llTmFtZSc6IGRlZmF1bHRUb0NvbmZpZzIsXG4gICAgJ3hzcmZIZWFkZXJOYW1lJzogZGVmYXVsdFRvQ29uZmlnMixcbiAgICAnb25VcGxvYWRQcm9ncmVzcyc6IGRlZmF1bHRUb0NvbmZpZzIsXG4gICAgJ29uRG93bmxvYWRQcm9ncmVzcyc6IGRlZmF1bHRUb0NvbmZpZzIsXG4gICAgJ2RlY29tcHJlc3MnOiBkZWZhdWx0VG9Db25maWcyLFxuICAgICdtYXhDb250ZW50TGVuZ3RoJzogZGVmYXVsdFRvQ29uZmlnMixcbiAgICAnbWF4Qm9keUxlbmd0aCc6IGRlZmF1bHRUb0NvbmZpZzIsXG4gICAgJ2JlZm9yZVJlZGlyZWN0JzogZGVmYXVsdFRvQ29uZmlnMixcbiAgICAndHJhbnNwb3J0JzogZGVmYXVsdFRvQ29uZmlnMixcbiAgICAnaHR0cEFnZW50JzogZGVmYXVsdFRvQ29uZmlnMixcbiAgICAnaHR0cHNBZ2VudCc6IGRlZmF1bHRUb0NvbmZpZzIsXG4gICAgJ2NhbmNlbFRva2VuJzogZGVmYXVsdFRvQ29uZmlnMixcbiAgICAnc29ja2V0UGF0aCc6IGRlZmF1bHRUb0NvbmZpZzIsXG4gICAgJ3Jlc3BvbnNlRW5jb2RpbmcnOiBkZWZhdWx0VG9Db25maWcyLFxuICAgICd2YWxpZGF0ZVN0YXR1cyc6IG1lcmdlRGlyZWN0S2V5c1xuICB9O1xuXG4gIHV0aWxzLmZvckVhY2goT2JqZWN0LmtleXMoY29uZmlnMSkuY29uY2F0KE9iamVjdC5rZXlzKGNvbmZpZzIpKSwgZnVuY3Rpb24gY29tcHV0ZUNvbmZpZ1ZhbHVlKHByb3ApIHtcbiAgICB2YXIgbWVyZ2UgPSBtZXJnZU1hcFtwcm9wXSB8fCBtZXJnZURlZXBQcm9wZXJ0aWVzO1xuICAgIHZhciBjb25maWdWYWx1ZSA9IG1lcmdlKHByb3ApO1xuICAgICh1dGlscy5pc1VuZGVmaW5lZChjb25maWdWYWx1ZSkgJiYgbWVyZ2UgIT09IG1lcmdlRGlyZWN0S2V5cykgfHwgKGNvbmZpZ1twcm9wXSA9IGNvbmZpZ1ZhbHVlKTtcbiAgfSk7XG5cbiAgcmV0dXJuIGNvbmZpZztcbn07XG4iLCAibW9kdWxlLmV4cG9ydHMgPSB7XG4gIFwidmVyc2lvblwiOiBcIjAuMjcuMlwiXG59OyIsICIndXNlIHN0cmljdCc7XG5cbnZhciBWRVJTSU9OID0gcmVxdWlyZSgnLi4vZW52L2RhdGEnKS52ZXJzaW9uO1xudmFyIEF4aW9zRXJyb3IgPSByZXF1aXJlKCcuLi9jb3JlL0F4aW9zRXJyb3InKTtcblxudmFyIHZhbGlkYXRvcnMgPSB7fTtcblxuLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIGZ1bmMtbmFtZXNcblsnb2JqZWN0JywgJ2Jvb2xlYW4nLCAnbnVtYmVyJywgJ2Z1bmN0aW9uJywgJ3N0cmluZycsICdzeW1ib2wnXS5mb3JFYWNoKGZ1bmN0aW9uKHR5cGUsIGkpIHtcbiAgdmFsaWRhdG9yc1t0eXBlXSA9IGZ1bmN0aW9uIHZhbGlkYXRvcih0aGluZykge1xuICAgIHJldHVybiB0eXBlb2YgdGhpbmcgPT09IHR5cGUgfHwgJ2EnICsgKGkgPCAxID8gJ24gJyA6ICcgJykgKyB0eXBlO1xuICB9O1xufSk7XG5cbnZhciBkZXByZWNhdGVkV2FybmluZ3MgPSB7fTtcblxuLyoqXG4gKiBUcmFuc2l0aW9uYWwgb3B0aW9uIHZhbGlkYXRvclxuICogQHBhcmFtIHtmdW5jdGlvbnxib29sZWFuP30gdmFsaWRhdG9yIC0gc2V0IHRvIGZhbHNlIGlmIHRoZSB0cmFuc2l0aW9uYWwgb3B0aW9uIGhhcyBiZWVuIHJlbW92ZWRcbiAqIEBwYXJhbSB7c3RyaW5nP30gdmVyc2lvbiAtIGRlcHJlY2F0ZWQgdmVyc2lvbiAvIHJlbW92ZWQgc2luY2UgdmVyc2lvblxuICogQHBhcmFtIHtzdHJpbmc/fSBtZXNzYWdlIC0gc29tZSBtZXNzYWdlIHdpdGggYWRkaXRpb25hbCBpbmZvXG4gKiBAcmV0dXJucyB7ZnVuY3Rpb259XG4gKi9cbnZhbGlkYXRvcnMudHJhbnNpdGlvbmFsID0gZnVuY3Rpb24gdHJhbnNpdGlvbmFsKHZhbGlkYXRvciwgdmVyc2lvbiwgbWVzc2FnZSkge1xuICBmdW5jdGlvbiBmb3JtYXRNZXNzYWdlKG9wdCwgZGVzYykge1xuICAgIHJldHVybiAnW0F4aW9zIHYnICsgVkVSU0lPTiArICddIFRyYW5zaXRpb25hbCBvcHRpb24gXFwnJyArIG9wdCArICdcXCcnICsgZGVzYyArIChtZXNzYWdlID8gJy4gJyArIG1lc3NhZ2UgOiAnJyk7XG4gIH1cblxuICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgZnVuYy1uYW1lc1xuICByZXR1cm4gZnVuY3Rpb24odmFsdWUsIG9wdCwgb3B0cykge1xuICAgIGlmICh2YWxpZGF0b3IgPT09IGZhbHNlKSB7XG4gICAgICB0aHJvdyBuZXcgQXhpb3NFcnJvcihcbiAgICAgICAgZm9ybWF0TWVzc2FnZShvcHQsICcgaGFzIGJlZW4gcmVtb3ZlZCcgKyAodmVyc2lvbiA/ICcgaW4gJyArIHZlcnNpb24gOiAnJykpLFxuICAgICAgICBBeGlvc0Vycm9yLkVSUl9ERVBSRUNBVEVEXG4gICAgICApO1xuICAgIH1cblxuICAgIGlmICh2ZXJzaW9uICYmICFkZXByZWNhdGVkV2FybmluZ3Nbb3B0XSkge1xuICAgICAgZGVwcmVjYXRlZFdhcm5pbmdzW29wdF0gPSB0cnVlO1xuICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLWNvbnNvbGVcbiAgICAgIGNvbnNvbGUud2FybihcbiAgICAgICAgZm9ybWF0TWVzc2FnZShcbiAgICAgICAgICBvcHQsXG4gICAgICAgICAgJyBoYXMgYmVlbiBkZXByZWNhdGVkIHNpbmNlIHYnICsgdmVyc2lvbiArICcgYW5kIHdpbGwgYmUgcmVtb3ZlZCBpbiB0aGUgbmVhciBmdXR1cmUnXG4gICAgICAgIClcbiAgICAgICk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHZhbGlkYXRvciA/IHZhbGlkYXRvcih2YWx1ZSwgb3B0LCBvcHRzKSA6IHRydWU7XG4gIH07XG59O1xuXG4vKipcbiAqIEFzc2VydCBvYmplY3QncyBwcm9wZXJ0aWVzIHR5cGVcbiAqIEBwYXJhbSB7b2JqZWN0fSBvcHRpb25zXG4gKiBAcGFyYW0ge29iamVjdH0gc2NoZW1hXG4gKiBAcGFyYW0ge2Jvb2xlYW4/fSBhbGxvd1Vua25vd25cbiAqL1xuXG5mdW5jdGlvbiBhc3NlcnRPcHRpb25zKG9wdGlvbnMsIHNjaGVtYSwgYWxsb3dVbmtub3duKSB7XG4gIGlmICh0eXBlb2Ygb3B0aW9ucyAhPT0gJ29iamVjdCcpIHtcbiAgICB0aHJvdyBuZXcgQXhpb3NFcnJvcignb3B0aW9ucyBtdXN0IGJlIGFuIG9iamVjdCcsIEF4aW9zRXJyb3IuRVJSX0JBRF9PUFRJT05fVkFMVUUpO1xuICB9XG4gIHZhciBrZXlzID0gT2JqZWN0LmtleXMob3B0aW9ucyk7XG4gIHZhciBpID0ga2V5cy5sZW5ndGg7XG4gIHdoaWxlIChpLS0gPiAwKSB7XG4gICAgdmFyIG9wdCA9IGtleXNbaV07XG4gICAgdmFyIHZhbGlkYXRvciA9IHNjaGVtYVtvcHRdO1xuICAgIGlmICh2YWxpZGF0b3IpIHtcbiAgICAgIHZhciB2YWx1ZSA9IG9wdGlvbnNbb3B0XTtcbiAgICAgIHZhciByZXN1bHQgPSB2YWx1ZSA9PT0gdW5kZWZpbmVkIHx8IHZhbGlkYXRvcih2YWx1ZSwgb3B0LCBvcHRpb25zKTtcbiAgICAgIGlmIChyZXN1bHQgIT09IHRydWUpIHtcbiAgICAgICAgdGhyb3cgbmV3IEF4aW9zRXJyb3IoJ29wdGlvbiAnICsgb3B0ICsgJyBtdXN0IGJlICcgKyByZXN1bHQsIEF4aW9zRXJyb3IuRVJSX0JBRF9PUFRJT05fVkFMVUUpO1xuICAgICAgfVxuICAgICAgY29udGludWU7XG4gICAgfVxuICAgIGlmIChhbGxvd1Vua25vd24gIT09IHRydWUpIHtcbiAgICAgIHRocm93IG5ldyBBeGlvc0Vycm9yKCdVbmtub3duIG9wdGlvbiAnICsgb3B0LCBBeGlvc0Vycm9yLkVSUl9CQURfT1BUSU9OKTtcbiAgICB9XG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIGFzc2VydE9wdGlvbnM6IGFzc2VydE9wdGlvbnMsXG4gIHZhbGlkYXRvcnM6IHZhbGlkYXRvcnNcbn07XG4iLCAiJ3VzZSBzdHJpY3QnO1xuXG52YXIgdXRpbHMgPSByZXF1aXJlKCcuLy4uL3V0aWxzJyk7XG52YXIgYnVpbGRVUkwgPSByZXF1aXJlKCcuLi9oZWxwZXJzL2J1aWxkVVJMJyk7XG52YXIgSW50ZXJjZXB0b3JNYW5hZ2VyID0gcmVxdWlyZSgnLi9JbnRlcmNlcHRvck1hbmFnZXInKTtcbnZhciBkaXNwYXRjaFJlcXVlc3QgPSByZXF1aXJlKCcuL2Rpc3BhdGNoUmVxdWVzdCcpO1xudmFyIG1lcmdlQ29uZmlnID0gcmVxdWlyZSgnLi9tZXJnZUNvbmZpZycpO1xudmFyIGJ1aWxkRnVsbFBhdGggPSByZXF1aXJlKCcuL2J1aWxkRnVsbFBhdGgnKTtcbnZhciB2YWxpZGF0b3IgPSByZXF1aXJlKCcuLi9oZWxwZXJzL3ZhbGlkYXRvcicpO1xuXG52YXIgdmFsaWRhdG9ycyA9IHZhbGlkYXRvci52YWxpZGF0b3JzO1xuLyoqXG4gKiBDcmVhdGUgYSBuZXcgaW5zdGFuY2Ugb2YgQXhpb3NcbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gaW5zdGFuY2VDb25maWcgVGhlIGRlZmF1bHQgY29uZmlnIGZvciB0aGUgaW5zdGFuY2VcbiAqL1xuZnVuY3Rpb24gQXhpb3MoaW5zdGFuY2VDb25maWcpIHtcbiAgdGhpcy5kZWZhdWx0cyA9IGluc3RhbmNlQ29uZmlnO1xuICB0aGlzLmludGVyY2VwdG9ycyA9IHtcbiAgICByZXF1ZXN0OiBuZXcgSW50ZXJjZXB0b3JNYW5hZ2VyKCksXG4gICAgcmVzcG9uc2U6IG5ldyBJbnRlcmNlcHRvck1hbmFnZXIoKVxuICB9O1xufVxuXG4vKipcbiAqIERpc3BhdGNoIGEgcmVxdWVzdFxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSBjb25maWcgVGhlIGNvbmZpZyBzcGVjaWZpYyBmb3IgdGhpcyByZXF1ZXN0IChtZXJnZWQgd2l0aCB0aGlzLmRlZmF1bHRzKVxuICovXG5BeGlvcy5wcm90b3R5cGUucmVxdWVzdCA9IGZ1bmN0aW9uIHJlcXVlc3QoY29uZmlnT3JVcmwsIGNvbmZpZykge1xuICAvKmVzbGludCBuby1wYXJhbS1yZWFzc2lnbjowKi9cbiAgLy8gQWxsb3cgZm9yIGF4aW9zKCdleGFtcGxlL3VybCdbLCBjb25maWddKSBhIGxhIGZldGNoIEFQSVxuICBpZiAodHlwZW9mIGNvbmZpZ09yVXJsID09PSAnc3RyaW5nJykge1xuICAgIGNvbmZpZyA9IGNvbmZpZyB8fCB7fTtcbiAgICBjb25maWcudXJsID0gY29uZmlnT3JVcmw7XG4gIH0gZWxzZSB7XG4gICAgY29uZmlnID0gY29uZmlnT3JVcmwgfHwge307XG4gIH1cblxuICBjb25maWcgPSBtZXJnZUNvbmZpZyh0aGlzLmRlZmF1bHRzLCBjb25maWcpO1xuXG4gIC8vIFNldCBjb25maWcubWV0aG9kXG4gIGlmIChjb25maWcubWV0aG9kKSB7XG4gICAgY29uZmlnLm1ldGhvZCA9IGNvbmZpZy5tZXRob2QudG9Mb3dlckNhc2UoKTtcbiAgfSBlbHNlIGlmICh0aGlzLmRlZmF1bHRzLm1ldGhvZCkge1xuICAgIGNvbmZpZy5tZXRob2QgPSB0aGlzLmRlZmF1bHRzLm1ldGhvZC50b0xvd2VyQ2FzZSgpO1xuICB9IGVsc2Uge1xuICAgIGNvbmZpZy5tZXRob2QgPSAnZ2V0JztcbiAgfVxuXG4gIHZhciB0cmFuc2l0aW9uYWwgPSBjb25maWcudHJhbnNpdGlvbmFsO1xuXG4gIGlmICh0cmFuc2l0aW9uYWwgIT09IHVuZGVmaW5lZCkge1xuICAgIHZhbGlkYXRvci5hc3NlcnRPcHRpb25zKHRyYW5zaXRpb25hbCwge1xuICAgICAgc2lsZW50SlNPTlBhcnNpbmc6IHZhbGlkYXRvcnMudHJhbnNpdGlvbmFsKHZhbGlkYXRvcnMuYm9vbGVhbiksXG4gICAgICBmb3JjZWRKU09OUGFyc2luZzogdmFsaWRhdG9ycy50cmFuc2l0aW9uYWwodmFsaWRhdG9ycy5ib29sZWFuKSxcbiAgICAgIGNsYXJpZnlUaW1lb3V0RXJyb3I6IHZhbGlkYXRvcnMudHJhbnNpdGlvbmFsKHZhbGlkYXRvcnMuYm9vbGVhbilcbiAgICB9LCBmYWxzZSk7XG4gIH1cblxuICAvLyBmaWx0ZXIgb3V0IHNraXBwZWQgaW50ZXJjZXB0b3JzXG4gIHZhciByZXF1ZXN0SW50ZXJjZXB0b3JDaGFpbiA9IFtdO1xuICB2YXIgc3luY2hyb25vdXNSZXF1ZXN0SW50ZXJjZXB0b3JzID0gdHJ1ZTtcbiAgdGhpcy5pbnRlcmNlcHRvcnMucmVxdWVzdC5mb3JFYWNoKGZ1bmN0aW9uIHVuc2hpZnRSZXF1ZXN0SW50ZXJjZXB0b3JzKGludGVyY2VwdG9yKSB7XG4gICAgaWYgKHR5cGVvZiBpbnRlcmNlcHRvci5ydW5XaGVuID09PSAnZnVuY3Rpb24nICYmIGludGVyY2VwdG9yLnJ1bldoZW4oY29uZmlnKSA9PT0gZmFsc2UpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBzeW5jaHJvbm91c1JlcXVlc3RJbnRlcmNlcHRvcnMgPSBzeW5jaHJvbm91c1JlcXVlc3RJbnRlcmNlcHRvcnMgJiYgaW50ZXJjZXB0b3Iuc3luY2hyb25vdXM7XG5cbiAgICByZXF1ZXN0SW50ZXJjZXB0b3JDaGFpbi51bnNoaWZ0KGludGVyY2VwdG9yLmZ1bGZpbGxlZCwgaW50ZXJjZXB0b3IucmVqZWN0ZWQpO1xuICB9KTtcblxuICB2YXIgcmVzcG9uc2VJbnRlcmNlcHRvckNoYWluID0gW107XG4gIHRoaXMuaW50ZXJjZXB0b3JzLnJlc3BvbnNlLmZvckVhY2goZnVuY3Rpb24gcHVzaFJlc3BvbnNlSW50ZXJjZXB0b3JzKGludGVyY2VwdG9yKSB7XG4gICAgcmVzcG9uc2VJbnRlcmNlcHRvckNoYWluLnB1c2goaW50ZXJjZXB0b3IuZnVsZmlsbGVkLCBpbnRlcmNlcHRvci5yZWplY3RlZCk7XG4gIH0pO1xuXG4gIHZhciBwcm9taXNlO1xuXG4gIGlmICghc3luY2hyb25vdXNSZXF1ZXN0SW50ZXJjZXB0b3JzKSB7XG4gICAgdmFyIGNoYWluID0gW2Rpc3BhdGNoUmVxdWVzdCwgdW5kZWZpbmVkXTtcblxuICAgIEFycmF5LnByb3RvdHlwZS51bnNoaWZ0LmFwcGx5KGNoYWluLCByZXF1ZXN0SW50ZXJjZXB0b3JDaGFpbik7XG4gICAgY2hhaW4gPSBjaGFpbi5jb25jYXQocmVzcG9uc2VJbnRlcmNlcHRvckNoYWluKTtcblxuICAgIHByb21pc2UgPSBQcm9taXNlLnJlc29sdmUoY29uZmlnKTtcbiAgICB3aGlsZSAoY2hhaW4ubGVuZ3RoKSB7XG4gICAgICBwcm9taXNlID0gcHJvbWlzZS50aGVuKGNoYWluLnNoaWZ0KCksIGNoYWluLnNoaWZ0KCkpO1xuICAgIH1cblxuICAgIHJldHVybiBwcm9taXNlO1xuICB9XG5cblxuICB2YXIgbmV3Q29uZmlnID0gY29uZmlnO1xuICB3aGlsZSAocmVxdWVzdEludGVyY2VwdG9yQ2hhaW4ubGVuZ3RoKSB7XG4gICAgdmFyIG9uRnVsZmlsbGVkID0gcmVxdWVzdEludGVyY2VwdG9yQ2hhaW4uc2hpZnQoKTtcbiAgICB2YXIgb25SZWplY3RlZCA9IHJlcXVlc3RJbnRlcmNlcHRvckNoYWluLnNoaWZ0KCk7XG4gICAgdHJ5IHtcbiAgICAgIG5ld0NvbmZpZyA9IG9uRnVsZmlsbGVkKG5ld0NvbmZpZyk7XG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgIG9uUmVqZWN0ZWQoZXJyb3IpO1xuICAgICAgYnJlYWs7XG4gICAgfVxuICB9XG5cbiAgdHJ5IHtcbiAgICBwcm9taXNlID0gZGlzcGF0Y2hSZXF1ZXN0KG5ld0NvbmZpZyk7XG4gIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgcmV0dXJuIFByb21pc2UucmVqZWN0KGVycm9yKTtcbiAgfVxuXG4gIHdoaWxlIChyZXNwb25zZUludGVyY2VwdG9yQ2hhaW4ubGVuZ3RoKSB7XG4gICAgcHJvbWlzZSA9IHByb21pc2UudGhlbihyZXNwb25zZUludGVyY2VwdG9yQ2hhaW4uc2hpZnQoKSwgcmVzcG9uc2VJbnRlcmNlcHRvckNoYWluLnNoaWZ0KCkpO1xuICB9XG5cbiAgcmV0dXJuIHByb21pc2U7XG59O1xuXG5BeGlvcy5wcm90b3R5cGUuZ2V0VXJpID0gZnVuY3Rpb24gZ2V0VXJpKGNvbmZpZykge1xuICBjb25maWcgPSBtZXJnZUNvbmZpZyh0aGlzLmRlZmF1bHRzLCBjb25maWcpO1xuICB2YXIgZnVsbFBhdGggPSBidWlsZEZ1bGxQYXRoKGNvbmZpZy5iYXNlVVJMLCBjb25maWcudXJsKTtcbiAgcmV0dXJuIGJ1aWxkVVJMKGZ1bGxQYXRoLCBjb25maWcucGFyYW1zLCBjb25maWcucGFyYW1zU2VyaWFsaXplcik7XG59O1xuXG4vLyBQcm92aWRlIGFsaWFzZXMgZm9yIHN1cHBvcnRlZCByZXF1ZXN0IG1ldGhvZHNcbnV0aWxzLmZvckVhY2goWydkZWxldGUnLCAnZ2V0JywgJ2hlYWQnLCAnb3B0aW9ucyddLCBmdW5jdGlvbiBmb3JFYWNoTWV0aG9kTm9EYXRhKG1ldGhvZCkge1xuICAvKmVzbGludCBmdW5jLW5hbWVzOjAqL1xuICBBeGlvcy5wcm90b3R5cGVbbWV0aG9kXSA9IGZ1bmN0aW9uKHVybCwgY29uZmlnKSB7XG4gICAgcmV0dXJuIHRoaXMucmVxdWVzdChtZXJnZUNvbmZpZyhjb25maWcgfHwge30sIHtcbiAgICAgIG1ldGhvZDogbWV0aG9kLFxuICAgICAgdXJsOiB1cmwsXG4gICAgICBkYXRhOiAoY29uZmlnIHx8IHt9KS5kYXRhXG4gICAgfSkpO1xuICB9O1xufSk7XG5cbnV0aWxzLmZvckVhY2goWydwb3N0JywgJ3B1dCcsICdwYXRjaCddLCBmdW5jdGlvbiBmb3JFYWNoTWV0aG9kV2l0aERhdGEobWV0aG9kKSB7XG4gIC8qZXNsaW50IGZ1bmMtbmFtZXM6MCovXG5cbiAgZnVuY3Rpb24gZ2VuZXJhdGVIVFRQTWV0aG9kKGlzRm9ybSkge1xuICAgIHJldHVybiBmdW5jdGlvbiBodHRwTWV0aG9kKHVybCwgZGF0YSwgY29uZmlnKSB7XG4gICAgICByZXR1cm4gdGhpcy5yZXF1ZXN0KG1lcmdlQ29uZmlnKGNvbmZpZyB8fCB7fSwge1xuICAgICAgICBtZXRob2Q6IG1ldGhvZCxcbiAgICAgICAgaGVhZGVyczogaXNGb3JtID8ge1xuICAgICAgICAgICdDb250ZW50LVR5cGUnOiAnbXVsdGlwYXJ0L2Zvcm0tZGF0YSdcbiAgICAgICAgfSA6IHt9LFxuICAgICAgICB1cmw6IHVybCxcbiAgICAgICAgZGF0YTogZGF0YVxuICAgICAgfSkpO1xuICAgIH07XG4gIH1cblxuICBBeGlvcy5wcm90b3R5cGVbbWV0aG9kXSA9IGdlbmVyYXRlSFRUUE1ldGhvZCgpO1xuXG4gIEF4aW9zLnByb3RvdHlwZVttZXRob2QgKyAnRm9ybSddID0gZ2VuZXJhdGVIVFRQTWV0aG9kKHRydWUpO1xufSk7XG5cbm1vZHVsZS5leHBvcnRzID0gQXhpb3M7XG4iLCAiJ3VzZSBzdHJpY3QnO1xuXG52YXIgQ2FuY2VsZWRFcnJvciA9IHJlcXVpcmUoJy4vQ2FuY2VsZWRFcnJvcicpO1xuXG4vKipcbiAqIEEgYENhbmNlbFRva2VuYCBpcyBhbiBvYmplY3QgdGhhdCBjYW4gYmUgdXNlZCB0byByZXF1ZXN0IGNhbmNlbGxhdGlvbiBvZiBhbiBvcGVyYXRpb24uXG4gKlxuICogQGNsYXNzXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBleGVjdXRvciBUaGUgZXhlY3V0b3IgZnVuY3Rpb24uXG4gKi9cbmZ1bmN0aW9uIENhbmNlbFRva2VuKGV4ZWN1dG9yKSB7XG4gIGlmICh0eXBlb2YgZXhlY3V0b3IgIT09ICdmdW5jdGlvbicpIHtcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdleGVjdXRvciBtdXN0IGJlIGEgZnVuY3Rpb24uJyk7XG4gIH1cblxuICB2YXIgcmVzb2x2ZVByb21pc2U7XG5cbiAgdGhpcy5wcm9taXNlID0gbmV3IFByb21pc2UoZnVuY3Rpb24gcHJvbWlzZUV4ZWN1dG9yKHJlc29sdmUpIHtcbiAgICByZXNvbHZlUHJvbWlzZSA9IHJlc29sdmU7XG4gIH0pO1xuXG4gIHZhciB0b2tlbiA9IHRoaXM7XG5cbiAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIGZ1bmMtbmFtZXNcbiAgdGhpcy5wcm9taXNlLnRoZW4oZnVuY3Rpb24oY2FuY2VsKSB7XG4gICAgaWYgKCF0b2tlbi5fbGlzdGVuZXJzKSByZXR1cm47XG5cbiAgICB2YXIgaTtcbiAgICB2YXIgbCA9IHRva2VuLl9saXN0ZW5lcnMubGVuZ3RoO1xuXG4gICAgZm9yIChpID0gMDsgaSA8IGw7IGkrKykge1xuICAgICAgdG9rZW4uX2xpc3RlbmVyc1tpXShjYW5jZWwpO1xuICAgIH1cbiAgICB0b2tlbi5fbGlzdGVuZXJzID0gbnVsbDtcbiAgfSk7XG5cbiAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIGZ1bmMtbmFtZXNcbiAgdGhpcy5wcm9taXNlLnRoZW4gPSBmdW5jdGlvbihvbmZ1bGZpbGxlZCkge1xuICAgIHZhciBfcmVzb2x2ZTtcbiAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgZnVuYy1uYW1lc1xuICAgIHZhciBwcm9taXNlID0gbmV3IFByb21pc2UoZnVuY3Rpb24ocmVzb2x2ZSkge1xuICAgICAgdG9rZW4uc3Vic2NyaWJlKHJlc29sdmUpO1xuICAgICAgX3Jlc29sdmUgPSByZXNvbHZlO1xuICAgIH0pLnRoZW4ob25mdWxmaWxsZWQpO1xuXG4gICAgcHJvbWlzZS5jYW5jZWwgPSBmdW5jdGlvbiByZWplY3QoKSB7XG4gICAgICB0b2tlbi51bnN1YnNjcmliZShfcmVzb2x2ZSk7XG4gICAgfTtcblxuICAgIHJldHVybiBwcm9taXNlO1xuICB9O1xuXG4gIGV4ZWN1dG9yKGZ1bmN0aW9uIGNhbmNlbChtZXNzYWdlKSB7XG4gICAgaWYgKHRva2VuLnJlYXNvbikge1xuICAgICAgLy8gQ2FuY2VsbGF0aW9uIGhhcyBhbHJlYWR5IGJlZW4gcmVxdWVzdGVkXG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdG9rZW4ucmVhc29uID0gbmV3IENhbmNlbGVkRXJyb3IobWVzc2FnZSk7XG4gICAgcmVzb2x2ZVByb21pc2UodG9rZW4ucmVhc29uKTtcbiAgfSk7XG59XG5cbi8qKlxuICogVGhyb3dzIGEgYENhbmNlbGVkRXJyb3JgIGlmIGNhbmNlbGxhdGlvbiBoYXMgYmVlbiByZXF1ZXN0ZWQuXG4gKi9cbkNhbmNlbFRva2VuLnByb3RvdHlwZS50aHJvd0lmUmVxdWVzdGVkID0gZnVuY3Rpb24gdGhyb3dJZlJlcXVlc3RlZCgpIHtcbiAgaWYgKHRoaXMucmVhc29uKSB7XG4gICAgdGhyb3cgdGhpcy5yZWFzb247XG4gIH1cbn07XG5cbi8qKlxuICogU3Vic2NyaWJlIHRvIHRoZSBjYW5jZWwgc2lnbmFsXG4gKi9cblxuQ2FuY2VsVG9rZW4ucHJvdG90eXBlLnN1YnNjcmliZSA9IGZ1bmN0aW9uIHN1YnNjcmliZShsaXN0ZW5lcikge1xuICBpZiAodGhpcy5yZWFzb24pIHtcbiAgICBsaXN0ZW5lcih0aGlzLnJlYXNvbik7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgaWYgKHRoaXMuX2xpc3RlbmVycykge1xuICAgIHRoaXMuX2xpc3RlbmVycy5wdXNoKGxpc3RlbmVyKTtcbiAgfSBlbHNlIHtcbiAgICB0aGlzLl9saXN0ZW5lcnMgPSBbbGlzdGVuZXJdO1xuICB9XG59O1xuXG4vKipcbiAqIFVuc3Vic2NyaWJlIGZyb20gdGhlIGNhbmNlbCBzaWduYWxcbiAqL1xuXG5DYW5jZWxUb2tlbi5wcm90b3R5cGUudW5zdWJzY3JpYmUgPSBmdW5jdGlvbiB1bnN1YnNjcmliZShsaXN0ZW5lcikge1xuICBpZiAoIXRoaXMuX2xpc3RlbmVycykge1xuICAgIHJldHVybjtcbiAgfVxuICB2YXIgaW5kZXggPSB0aGlzLl9saXN0ZW5lcnMuaW5kZXhPZihsaXN0ZW5lcik7XG4gIGlmIChpbmRleCAhPT0gLTEpIHtcbiAgICB0aGlzLl9saXN0ZW5lcnMuc3BsaWNlKGluZGV4LCAxKTtcbiAgfVxufTtcblxuLyoqXG4gKiBSZXR1cm5zIGFuIG9iamVjdCB0aGF0IGNvbnRhaW5zIGEgbmV3IGBDYW5jZWxUb2tlbmAgYW5kIGEgZnVuY3Rpb24gdGhhdCwgd2hlbiBjYWxsZWQsXG4gKiBjYW5jZWxzIHRoZSBgQ2FuY2VsVG9rZW5gLlxuICovXG5DYW5jZWxUb2tlbi5zb3VyY2UgPSBmdW5jdGlvbiBzb3VyY2UoKSB7XG4gIHZhciBjYW5jZWw7XG4gIHZhciB0b2tlbiA9IG5ldyBDYW5jZWxUb2tlbihmdW5jdGlvbiBleGVjdXRvcihjKSB7XG4gICAgY2FuY2VsID0gYztcbiAgfSk7XG4gIHJldHVybiB7XG4gICAgdG9rZW46IHRva2VuLFxuICAgIGNhbmNlbDogY2FuY2VsXG4gIH07XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IENhbmNlbFRva2VuO1xuIiwgIid1c2Ugc3RyaWN0JztcblxuLyoqXG4gKiBTeW50YWN0aWMgc3VnYXIgZm9yIGludm9raW5nIGEgZnVuY3Rpb24gYW5kIGV4cGFuZGluZyBhbiBhcnJheSBmb3IgYXJndW1lbnRzLlxuICpcbiAqIENvbW1vbiB1c2UgY2FzZSB3b3VsZCBiZSB0byB1c2UgYEZ1bmN0aW9uLnByb3RvdHlwZS5hcHBseWAuXG4gKlxuICogIGBgYGpzXG4gKiAgZnVuY3Rpb24gZih4LCB5LCB6KSB7fVxuICogIHZhciBhcmdzID0gWzEsIDIsIDNdO1xuICogIGYuYXBwbHkobnVsbCwgYXJncyk7XG4gKiAgYGBgXG4gKlxuICogV2l0aCBgc3ByZWFkYCB0aGlzIGV4YW1wbGUgY2FuIGJlIHJlLXdyaXR0ZW4uXG4gKlxuICogIGBgYGpzXG4gKiAgc3ByZWFkKGZ1bmN0aW9uKHgsIHksIHopIHt9KShbMSwgMiwgM10pO1xuICogIGBgYFxuICpcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGNhbGxiYWNrXG4gKiBAcmV0dXJucyB7RnVuY3Rpb259XG4gKi9cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gc3ByZWFkKGNhbGxiYWNrKSB7XG4gIHJldHVybiBmdW5jdGlvbiB3cmFwKGFycikge1xuICAgIHJldHVybiBjYWxsYmFjay5hcHBseShudWxsLCBhcnIpO1xuICB9O1xufTtcbiIsICIndXNlIHN0cmljdCc7XG5cbnZhciB1dGlscyA9IHJlcXVpcmUoJy4vLi4vdXRpbHMnKTtcblxuLyoqXG4gKiBEZXRlcm1pbmVzIHdoZXRoZXIgdGhlIHBheWxvYWQgaXMgYW4gZXJyb3IgdGhyb3duIGJ5IEF4aW9zXG4gKlxuICogQHBhcmFtIHsqfSBwYXlsb2FkIFRoZSB2YWx1ZSB0byB0ZXN0XG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gVHJ1ZSBpZiB0aGUgcGF5bG9hZCBpcyBhbiBlcnJvciB0aHJvd24gYnkgQXhpb3MsIG90aGVyd2lzZSBmYWxzZVxuICovXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGlzQXhpb3NFcnJvcihwYXlsb2FkKSB7XG4gIHJldHVybiB1dGlscy5pc09iamVjdChwYXlsb2FkKSAmJiAocGF5bG9hZC5pc0F4aW9zRXJyb3IgPT09IHRydWUpO1xufTtcbiIsICIndXNlIHN0cmljdCc7XG5cbnZhciB1dGlscyA9IHJlcXVpcmUoJy4vdXRpbHMnKTtcbnZhciBiaW5kID0gcmVxdWlyZSgnLi9oZWxwZXJzL2JpbmQnKTtcbnZhciBBeGlvcyA9IHJlcXVpcmUoJy4vY29yZS9BeGlvcycpO1xudmFyIG1lcmdlQ29uZmlnID0gcmVxdWlyZSgnLi9jb3JlL21lcmdlQ29uZmlnJyk7XG52YXIgZGVmYXVsdHMgPSByZXF1aXJlKCcuL2RlZmF1bHRzJyk7XG5cbi8qKlxuICogQ3JlYXRlIGFuIGluc3RhbmNlIG9mIEF4aW9zXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IGRlZmF1bHRDb25maWcgVGhlIGRlZmF1bHQgY29uZmlnIGZvciB0aGUgaW5zdGFuY2VcbiAqIEByZXR1cm4ge0F4aW9zfSBBIG5ldyBpbnN0YW5jZSBvZiBBeGlvc1xuICovXG5mdW5jdGlvbiBjcmVhdGVJbnN0YW5jZShkZWZhdWx0Q29uZmlnKSB7XG4gIHZhciBjb250ZXh0ID0gbmV3IEF4aW9zKGRlZmF1bHRDb25maWcpO1xuICB2YXIgaW5zdGFuY2UgPSBiaW5kKEF4aW9zLnByb3RvdHlwZS5yZXF1ZXN0LCBjb250ZXh0KTtcblxuICAvLyBDb3B5IGF4aW9zLnByb3RvdHlwZSB0byBpbnN0YW5jZVxuICB1dGlscy5leHRlbmQoaW5zdGFuY2UsIEF4aW9zLnByb3RvdHlwZSwgY29udGV4dCk7XG5cbiAgLy8gQ29weSBjb250ZXh0IHRvIGluc3RhbmNlXG4gIHV0aWxzLmV4dGVuZChpbnN0YW5jZSwgY29udGV4dCk7XG5cbiAgLy8gRmFjdG9yeSBmb3IgY3JlYXRpbmcgbmV3IGluc3RhbmNlc1xuICBpbnN0YW5jZS5jcmVhdGUgPSBmdW5jdGlvbiBjcmVhdGUoaW5zdGFuY2VDb25maWcpIHtcbiAgICByZXR1cm4gY3JlYXRlSW5zdGFuY2UobWVyZ2VDb25maWcoZGVmYXVsdENvbmZpZywgaW5zdGFuY2VDb25maWcpKTtcbiAgfTtcblxuICByZXR1cm4gaW5zdGFuY2U7XG59XG5cbi8vIENyZWF0ZSB0aGUgZGVmYXVsdCBpbnN0YW5jZSB0byBiZSBleHBvcnRlZFxudmFyIGF4aW9zID0gY3JlYXRlSW5zdGFuY2UoZGVmYXVsdHMpO1xuXG4vLyBFeHBvc2UgQXhpb3MgY2xhc3MgdG8gYWxsb3cgY2xhc3MgaW5oZXJpdGFuY2VcbmF4aW9zLkF4aW9zID0gQXhpb3M7XG5cbi8vIEV4cG9zZSBDYW5jZWwgJiBDYW5jZWxUb2tlblxuYXhpb3MuQ2FuY2VsZWRFcnJvciA9IHJlcXVpcmUoJy4vY2FuY2VsL0NhbmNlbGVkRXJyb3InKTtcbmF4aW9zLkNhbmNlbFRva2VuID0gcmVxdWlyZSgnLi9jYW5jZWwvQ2FuY2VsVG9rZW4nKTtcbmF4aW9zLmlzQ2FuY2VsID0gcmVxdWlyZSgnLi9jYW5jZWwvaXNDYW5jZWwnKTtcbmF4aW9zLlZFUlNJT04gPSByZXF1aXJlKCcuL2Vudi9kYXRhJykudmVyc2lvbjtcbmF4aW9zLnRvRm9ybURhdGEgPSByZXF1aXJlKCcuL2hlbHBlcnMvdG9Gb3JtRGF0YScpO1xuXG4vLyBFeHBvc2UgQXhpb3NFcnJvciBjbGFzc1xuYXhpb3MuQXhpb3NFcnJvciA9IHJlcXVpcmUoJy4uL2xpYi9jb3JlL0F4aW9zRXJyb3InKTtcblxuLy8gYWxpYXMgZm9yIENhbmNlbGVkRXJyb3IgZm9yIGJhY2t3YXJkIGNvbXBhdGliaWxpdHlcbmF4aW9zLkNhbmNlbCA9IGF4aW9zLkNhbmNlbGVkRXJyb3I7XG5cbi8vIEV4cG9zZSBhbGwvc3ByZWFkXG5heGlvcy5hbGwgPSBmdW5jdGlvbiBhbGwocHJvbWlzZXMpIHtcbiAgcmV0dXJuIFByb21pc2UuYWxsKHByb21pc2VzKTtcbn07XG5heGlvcy5zcHJlYWQgPSByZXF1aXJlKCcuL2hlbHBlcnMvc3ByZWFkJyk7XG5cbi8vIEV4cG9zZSBpc0F4aW9zRXJyb3JcbmF4aW9zLmlzQXhpb3NFcnJvciA9IHJlcXVpcmUoJy4vaGVscGVycy9pc0F4aW9zRXJyb3InKTtcblxubW9kdWxlLmV4cG9ydHMgPSBheGlvcztcblxuLy8gQWxsb3cgdXNlIG9mIGRlZmF1bHQgaW1wb3J0IHN5bnRheCBpbiBUeXBlU2NyaXB0XG5tb2R1bGUuZXhwb3J0cy5kZWZhdWx0ID0gYXhpb3M7XG4iLCAibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKCcuL2xpYi9heGlvcycpOyIsICIvKiogQGxpY2Vuc2UgUmVhY3QgdjE2LjEzLjFcbiAqIHJlYWN0LWlzLmRldmVsb3BtZW50LmpzXG4gKlxuICogQ29weXJpZ2h0IChjKSBGYWNlYm9vaywgSW5jLiBhbmQgaXRzIGFmZmlsaWF0ZXMuXG4gKlxuICogVGhpcyBzb3VyY2UgY29kZSBpcyBsaWNlbnNlZCB1bmRlciB0aGUgTUlUIGxpY2Vuc2UgZm91bmQgaW4gdGhlXG4gKiBMSUNFTlNFIGZpbGUgaW4gdGhlIHJvb3QgZGlyZWN0b3J5IG9mIHRoaXMgc291cmNlIHRyZWUuXG4gKi9cblxuJ3VzZSBzdHJpY3QnO1xuXG5cblxuaWYgKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSBcInByb2R1Y3Rpb25cIikge1xuICAoZnVuY3Rpb24oKSB7XG4ndXNlIHN0cmljdCc7XG5cbi8vIFRoZSBTeW1ib2wgdXNlZCB0byB0YWcgdGhlIFJlYWN0RWxlbWVudC1saWtlIHR5cGVzLiBJZiB0aGVyZSBpcyBubyBuYXRpdmUgU3ltYm9sXG4vLyBub3IgcG9seWZpbGwsIHRoZW4gYSBwbGFpbiBudW1iZXIgaXMgdXNlZCBmb3IgcGVyZm9ybWFuY2UuXG52YXIgaGFzU3ltYm9sID0gdHlwZW9mIFN5bWJvbCA9PT0gJ2Z1bmN0aW9uJyAmJiBTeW1ib2wuZm9yO1xudmFyIFJFQUNUX0VMRU1FTlRfVFlQRSA9IGhhc1N5bWJvbCA/IFN5bWJvbC5mb3IoJ3JlYWN0LmVsZW1lbnQnKSA6IDB4ZWFjNztcbnZhciBSRUFDVF9QT1JUQUxfVFlQRSA9IGhhc1N5bWJvbCA/IFN5bWJvbC5mb3IoJ3JlYWN0LnBvcnRhbCcpIDogMHhlYWNhO1xudmFyIFJFQUNUX0ZSQUdNRU5UX1RZUEUgPSBoYXNTeW1ib2wgPyBTeW1ib2wuZm9yKCdyZWFjdC5mcmFnbWVudCcpIDogMHhlYWNiO1xudmFyIFJFQUNUX1NUUklDVF9NT0RFX1RZUEUgPSBoYXNTeW1ib2wgPyBTeW1ib2wuZm9yKCdyZWFjdC5zdHJpY3RfbW9kZScpIDogMHhlYWNjO1xudmFyIFJFQUNUX1BST0ZJTEVSX1RZUEUgPSBoYXNTeW1ib2wgPyBTeW1ib2wuZm9yKCdyZWFjdC5wcm9maWxlcicpIDogMHhlYWQyO1xudmFyIFJFQUNUX1BST1ZJREVSX1RZUEUgPSBoYXNTeW1ib2wgPyBTeW1ib2wuZm9yKCdyZWFjdC5wcm92aWRlcicpIDogMHhlYWNkO1xudmFyIFJFQUNUX0NPTlRFWFRfVFlQRSA9IGhhc1N5bWJvbCA/IFN5bWJvbC5mb3IoJ3JlYWN0LmNvbnRleHQnKSA6IDB4ZWFjZTsgLy8gVE9ETzogV2UgZG9uJ3QgdXNlIEFzeW5jTW9kZSBvciBDb25jdXJyZW50TW9kZSBhbnltb3JlLiBUaGV5IHdlcmUgdGVtcG9yYXJ5XG4vLyAodW5zdGFibGUpIEFQSXMgdGhhdCBoYXZlIGJlZW4gcmVtb3ZlZC4gQ2FuIHdlIHJlbW92ZSB0aGUgc3ltYm9scz9cblxudmFyIFJFQUNUX0FTWU5DX01PREVfVFlQRSA9IGhhc1N5bWJvbCA/IFN5bWJvbC5mb3IoJ3JlYWN0LmFzeW5jX21vZGUnKSA6IDB4ZWFjZjtcbnZhciBSRUFDVF9DT05DVVJSRU5UX01PREVfVFlQRSA9IGhhc1N5bWJvbCA/IFN5bWJvbC5mb3IoJ3JlYWN0LmNvbmN1cnJlbnRfbW9kZScpIDogMHhlYWNmO1xudmFyIFJFQUNUX0ZPUldBUkRfUkVGX1RZUEUgPSBoYXNTeW1ib2wgPyBTeW1ib2wuZm9yKCdyZWFjdC5mb3J3YXJkX3JlZicpIDogMHhlYWQwO1xudmFyIFJFQUNUX1NVU1BFTlNFX1RZUEUgPSBoYXNTeW1ib2wgPyBTeW1ib2wuZm9yKCdyZWFjdC5zdXNwZW5zZScpIDogMHhlYWQxO1xudmFyIFJFQUNUX1NVU1BFTlNFX0xJU1RfVFlQRSA9IGhhc1N5bWJvbCA/IFN5bWJvbC5mb3IoJ3JlYWN0LnN1c3BlbnNlX2xpc3QnKSA6IDB4ZWFkODtcbnZhciBSRUFDVF9NRU1PX1RZUEUgPSBoYXNTeW1ib2wgPyBTeW1ib2wuZm9yKCdyZWFjdC5tZW1vJykgOiAweGVhZDM7XG52YXIgUkVBQ1RfTEFaWV9UWVBFID0gaGFzU3ltYm9sID8gU3ltYm9sLmZvcigncmVhY3QubGF6eScpIDogMHhlYWQ0O1xudmFyIFJFQUNUX0JMT0NLX1RZUEUgPSBoYXNTeW1ib2wgPyBTeW1ib2wuZm9yKCdyZWFjdC5ibG9jaycpIDogMHhlYWQ5O1xudmFyIFJFQUNUX0ZVTkRBTUVOVEFMX1RZUEUgPSBoYXNTeW1ib2wgPyBTeW1ib2wuZm9yKCdyZWFjdC5mdW5kYW1lbnRhbCcpIDogMHhlYWQ1O1xudmFyIFJFQUNUX1JFU1BPTkRFUl9UWVBFID0gaGFzU3ltYm9sID8gU3ltYm9sLmZvcigncmVhY3QucmVzcG9uZGVyJykgOiAweGVhZDY7XG52YXIgUkVBQ1RfU0NPUEVfVFlQRSA9IGhhc1N5bWJvbCA/IFN5bWJvbC5mb3IoJ3JlYWN0LnNjb3BlJykgOiAweGVhZDc7XG5cbmZ1bmN0aW9uIGlzVmFsaWRFbGVtZW50VHlwZSh0eXBlKSB7XG4gIHJldHVybiB0eXBlb2YgdHlwZSA9PT0gJ3N0cmluZycgfHwgdHlwZW9mIHR5cGUgPT09ICdmdW5jdGlvbicgfHwgLy8gTm90ZTogaXRzIHR5cGVvZiBtaWdodCBiZSBvdGhlciB0aGFuICdzeW1ib2wnIG9yICdudW1iZXInIGlmIGl0J3MgYSBwb2x5ZmlsbC5cbiAgdHlwZSA9PT0gUkVBQ1RfRlJBR01FTlRfVFlQRSB8fCB0eXBlID09PSBSRUFDVF9DT05DVVJSRU5UX01PREVfVFlQRSB8fCB0eXBlID09PSBSRUFDVF9QUk9GSUxFUl9UWVBFIHx8IHR5cGUgPT09IFJFQUNUX1NUUklDVF9NT0RFX1RZUEUgfHwgdHlwZSA9PT0gUkVBQ1RfU1VTUEVOU0VfVFlQRSB8fCB0eXBlID09PSBSRUFDVF9TVVNQRU5TRV9MSVNUX1RZUEUgfHwgdHlwZW9mIHR5cGUgPT09ICdvYmplY3QnICYmIHR5cGUgIT09IG51bGwgJiYgKHR5cGUuJCR0eXBlb2YgPT09IFJFQUNUX0xBWllfVFlQRSB8fCB0eXBlLiQkdHlwZW9mID09PSBSRUFDVF9NRU1PX1RZUEUgfHwgdHlwZS4kJHR5cGVvZiA9PT0gUkVBQ1RfUFJPVklERVJfVFlQRSB8fCB0eXBlLiQkdHlwZW9mID09PSBSRUFDVF9DT05URVhUX1RZUEUgfHwgdHlwZS4kJHR5cGVvZiA9PT0gUkVBQ1RfRk9SV0FSRF9SRUZfVFlQRSB8fCB0eXBlLiQkdHlwZW9mID09PSBSRUFDVF9GVU5EQU1FTlRBTF9UWVBFIHx8IHR5cGUuJCR0eXBlb2YgPT09IFJFQUNUX1JFU1BPTkRFUl9UWVBFIHx8IHR5cGUuJCR0eXBlb2YgPT09IFJFQUNUX1NDT1BFX1RZUEUgfHwgdHlwZS4kJHR5cGVvZiA9PT0gUkVBQ1RfQkxPQ0tfVFlQRSk7XG59XG5cbmZ1bmN0aW9uIHR5cGVPZihvYmplY3QpIHtcbiAgaWYgKHR5cGVvZiBvYmplY3QgPT09ICdvYmplY3QnICYmIG9iamVjdCAhPT0gbnVsbCkge1xuICAgIHZhciAkJHR5cGVvZiA9IG9iamVjdC4kJHR5cGVvZjtcblxuICAgIHN3aXRjaCAoJCR0eXBlb2YpIHtcbiAgICAgIGNhc2UgUkVBQ1RfRUxFTUVOVF9UWVBFOlxuICAgICAgICB2YXIgdHlwZSA9IG9iamVjdC50eXBlO1xuXG4gICAgICAgIHN3aXRjaCAodHlwZSkge1xuICAgICAgICAgIGNhc2UgUkVBQ1RfQVNZTkNfTU9ERV9UWVBFOlxuICAgICAgICAgIGNhc2UgUkVBQ1RfQ09OQ1VSUkVOVF9NT0RFX1RZUEU6XG4gICAgICAgICAgY2FzZSBSRUFDVF9GUkFHTUVOVF9UWVBFOlxuICAgICAgICAgIGNhc2UgUkVBQ1RfUFJPRklMRVJfVFlQRTpcbiAgICAgICAgICBjYXNlIFJFQUNUX1NUUklDVF9NT0RFX1RZUEU6XG4gICAgICAgICAgY2FzZSBSRUFDVF9TVVNQRU5TRV9UWVBFOlxuICAgICAgICAgICAgcmV0dXJuIHR5cGU7XG5cbiAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgdmFyICQkdHlwZW9mVHlwZSA9IHR5cGUgJiYgdHlwZS4kJHR5cGVvZjtcblxuICAgICAgICAgICAgc3dpdGNoICgkJHR5cGVvZlR5cGUpIHtcbiAgICAgICAgICAgICAgY2FzZSBSRUFDVF9DT05URVhUX1RZUEU6XG4gICAgICAgICAgICAgIGNhc2UgUkVBQ1RfRk9SV0FSRF9SRUZfVFlQRTpcbiAgICAgICAgICAgICAgY2FzZSBSRUFDVF9MQVpZX1RZUEU6XG4gICAgICAgICAgICAgIGNhc2UgUkVBQ1RfTUVNT19UWVBFOlxuICAgICAgICAgICAgICBjYXNlIFJFQUNUX1BST1ZJREVSX1RZUEU6XG4gICAgICAgICAgICAgICAgcmV0dXJuICQkdHlwZW9mVHlwZTtcblxuICAgICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgIHJldHVybiAkJHR5cGVvZjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICB9XG5cbiAgICAgIGNhc2UgUkVBQ1RfUE9SVEFMX1RZUEU6XG4gICAgICAgIHJldHVybiAkJHR5cGVvZjtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gdW5kZWZpbmVkO1xufSAvLyBBc3luY01vZGUgaXMgZGVwcmVjYXRlZCBhbG9uZyB3aXRoIGlzQXN5bmNNb2RlXG5cbnZhciBBc3luY01vZGUgPSBSRUFDVF9BU1lOQ19NT0RFX1RZUEU7XG52YXIgQ29uY3VycmVudE1vZGUgPSBSRUFDVF9DT05DVVJSRU5UX01PREVfVFlQRTtcbnZhciBDb250ZXh0Q29uc3VtZXIgPSBSRUFDVF9DT05URVhUX1RZUEU7XG52YXIgQ29udGV4dFByb3ZpZGVyID0gUkVBQ1RfUFJPVklERVJfVFlQRTtcbnZhciBFbGVtZW50ID0gUkVBQ1RfRUxFTUVOVF9UWVBFO1xudmFyIEZvcndhcmRSZWYgPSBSRUFDVF9GT1JXQVJEX1JFRl9UWVBFO1xudmFyIEZyYWdtZW50ID0gUkVBQ1RfRlJBR01FTlRfVFlQRTtcbnZhciBMYXp5ID0gUkVBQ1RfTEFaWV9UWVBFO1xudmFyIE1lbW8gPSBSRUFDVF9NRU1PX1RZUEU7XG52YXIgUG9ydGFsID0gUkVBQ1RfUE9SVEFMX1RZUEU7XG52YXIgUHJvZmlsZXIgPSBSRUFDVF9QUk9GSUxFUl9UWVBFO1xudmFyIFN0cmljdE1vZGUgPSBSRUFDVF9TVFJJQ1RfTU9ERV9UWVBFO1xudmFyIFN1c3BlbnNlID0gUkVBQ1RfU1VTUEVOU0VfVFlQRTtcbnZhciBoYXNXYXJuZWRBYm91dERlcHJlY2F0ZWRJc0FzeW5jTW9kZSA9IGZhbHNlOyAvLyBBc3luY01vZGUgc2hvdWxkIGJlIGRlcHJlY2F0ZWRcblxuZnVuY3Rpb24gaXNBc3luY01vZGUob2JqZWN0KSB7XG4gIHtcbiAgICBpZiAoIWhhc1dhcm5lZEFib3V0RGVwcmVjYXRlZElzQXN5bmNNb2RlKSB7XG4gICAgICBoYXNXYXJuZWRBYm91dERlcHJlY2F0ZWRJc0FzeW5jTW9kZSA9IHRydWU7IC8vIFVzaW5nIGNvbnNvbGVbJ3dhcm4nXSB0byBldmFkZSBCYWJlbCBhbmQgRVNMaW50XG5cbiAgICAgIGNvbnNvbGVbJ3dhcm4nXSgnVGhlIFJlYWN0SXMuaXNBc3luY01vZGUoKSBhbGlhcyBoYXMgYmVlbiBkZXByZWNhdGVkLCAnICsgJ2FuZCB3aWxsIGJlIHJlbW92ZWQgaW4gUmVhY3QgMTcrLiBVcGRhdGUgeW91ciBjb2RlIHRvIHVzZSAnICsgJ1JlYWN0SXMuaXNDb25jdXJyZW50TW9kZSgpIGluc3RlYWQuIEl0IGhhcyB0aGUgZXhhY3Qgc2FtZSBBUEkuJyk7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIGlzQ29uY3VycmVudE1vZGUob2JqZWN0KSB8fCB0eXBlT2Yob2JqZWN0KSA9PT0gUkVBQ1RfQVNZTkNfTU9ERV9UWVBFO1xufVxuZnVuY3Rpb24gaXNDb25jdXJyZW50TW9kZShvYmplY3QpIHtcbiAgcmV0dXJuIHR5cGVPZihvYmplY3QpID09PSBSRUFDVF9DT05DVVJSRU5UX01PREVfVFlQRTtcbn1cbmZ1bmN0aW9uIGlzQ29udGV4dENvbnN1bWVyKG9iamVjdCkge1xuICByZXR1cm4gdHlwZU9mKG9iamVjdCkgPT09IFJFQUNUX0NPTlRFWFRfVFlQRTtcbn1cbmZ1bmN0aW9uIGlzQ29udGV4dFByb3ZpZGVyKG9iamVjdCkge1xuICByZXR1cm4gdHlwZU9mKG9iamVjdCkgPT09IFJFQUNUX1BST1ZJREVSX1RZUEU7XG59XG5mdW5jdGlvbiBpc0VsZW1lbnQob2JqZWN0KSB7XG4gIHJldHVybiB0eXBlb2Ygb2JqZWN0ID09PSAnb2JqZWN0JyAmJiBvYmplY3QgIT09IG51bGwgJiYgb2JqZWN0LiQkdHlwZW9mID09PSBSRUFDVF9FTEVNRU5UX1RZUEU7XG59XG5mdW5jdGlvbiBpc0ZvcndhcmRSZWYob2JqZWN0KSB7XG4gIHJldHVybiB0eXBlT2Yob2JqZWN0KSA9PT0gUkVBQ1RfRk9SV0FSRF9SRUZfVFlQRTtcbn1cbmZ1bmN0aW9uIGlzRnJhZ21lbnQob2JqZWN0KSB7XG4gIHJldHVybiB0eXBlT2Yob2JqZWN0KSA9PT0gUkVBQ1RfRlJBR01FTlRfVFlQRTtcbn1cbmZ1bmN0aW9uIGlzTGF6eShvYmplY3QpIHtcbiAgcmV0dXJuIHR5cGVPZihvYmplY3QpID09PSBSRUFDVF9MQVpZX1RZUEU7XG59XG5mdW5jdGlvbiBpc01lbW8ob2JqZWN0KSB7XG4gIHJldHVybiB0eXBlT2Yob2JqZWN0KSA9PT0gUkVBQ1RfTUVNT19UWVBFO1xufVxuZnVuY3Rpb24gaXNQb3J0YWwob2JqZWN0KSB7XG4gIHJldHVybiB0eXBlT2Yob2JqZWN0KSA9PT0gUkVBQ1RfUE9SVEFMX1RZUEU7XG59XG5mdW5jdGlvbiBpc1Byb2ZpbGVyKG9iamVjdCkge1xuICByZXR1cm4gdHlwZU9mKG9iamVjdCkgPT09IFJFQUNUX1BST0ZJTEVSX1RZUEU7XG59XG5mdW5jdGlvbiBpc1N0cmljdE1vZGUob2JqZWN0KSB7XG4gIHJldHVybiB0eXBlT2Yob2JqZWN0KSA9PT0gUkVBQ1RfU1RSSUNUX01PREVfVFlQRTtcbn1cbmZ1bmN0aW9uIGlzU3VzcGVuc2Uob2JqZWN0KSB7XG4gIHJldHVybiB0eXBlT2Yob2JqZWN0KSA9PT0gUkVBQ1RfU1VTUEVOU0VfVFlQRTtcbn1cblxuZXhwb3J0cy5Bc3luY01vZGUgPSBBc3luY01vZGU7XG5leHBvcnRzLkNvbmN1cnJlbnRNb2RlID0gQ29uY3VycmVudE1vZGU7XG5leHBvcnRzLkNvbnRleHRDb25zdW1lciA9IENvbnRleHRDb25zdW1lcjtcbmV4cG9ydHMuQ29udGV4dFByb3ZpZGVyID0gQ29udGV4dFByb3ZpZGVyO1xuZXhwb3J0cy5FbGVtZW50ID0gRWxlbWVudDtcbmV4cG9ydHMuRm9yd2FyZFJlZiA9IEZvcndhcmRSZWY7XG5leHBvcnRzLkZyYWdtZW50ID0gRnJhZ21lbnQ7XG5leHBvcnRzLkxhenkgPSBMYXp5O1xuZXhwb3J0cy5NZW1vID0gTWVtbztcbmV4cG9ydHMuUG9ydGFsID0gUG9ydGFsO1xuZXhwb3J0cy5Qcm9maWxlciA9IFByb2ZpbGVyO1xuZXhwb3J0cy5TdHJpY3RNb2RlID0gU3RyaWN0TW9kZTtcbmV4cG9ydHMuU3VzcGVuc2UgPSBTdXNwZW5zZTtcbmV4cG9ydHMuaXNBc3luY01vZGUgPSBpc0FzeW5jTW9kZTtcbmV4cG9ydHMuaXNDb25jdXJyZW50TW9kZSA9IGlzQ29uY3VycmVudE1vZGU7XG5leHBvcnRzLmlzQ29udGV4dENvbnN1bWVyID0gaXNDb250ZXh0Q29uc3VtZXI7XG5leHBvcnRzLmlzQ29udGV4dFByb3ZpZGVyID0gaXNDb250ZXh0UHJvdmlkZXI7XG5leHBvcnRzLmlzRWxlbWVudCA9IGlzRWxlbWVudDtcbmV4cG9ydHMuaXNGb3J3YXJkUmVmID0gaXNGb3J3YXJkUmVmO1xuZXhwb3J0cy5pc0ZyYWdtZW50ID0gaXNGcmFnbWVudDtcbmV4cG9ydHMuaXNMYXp5ID0gaXNMYXp5O1xuZXhwb3J0cy5pc01lbW8gPSBpc01lbW87XG5leHBvcnRzLmlzUG9ydGFsID0gaXNQb3J0YWw7XG5leHBvcnRzLmlzUHJvZmlsZXIgPSBpc1Byb2ZpbGVyO1xuZXhwb3J0cy5pc1N0cmljdE1vZGUgPSBpc1N0cmljdE1vZGU7XG5leHBvcnRzLmlzU3VzcGVuc2UgPSBpc1N1c3BlbnNlO1xuZXhwb3J0cy5pc1ZhbGlkRWxlbWVudFR5cGUgPSBpc1ZhbGlkRWxlbWVudFR5cGU7XG5leHBvcnRzLnR5cGVPZiA9IHR5cGVPZjtcbiAgfSkoKTtcbn1cbiIsICIndXNlIHN0cmljdCc7XG5cbmlmIChwcm9jZXNzLmVudi5OT0RFX0VOViA9PT0gJ3Byb2R1Y3Rpb24nKSB7XG4gIG1vZHVsZS5leHBvcnRzID0gcmVxdWlyZSgnLi9janMvcmVhY3QtaXMucHJvZHVjdGlvbi5taW4uanMnKTtcbn0gZWxzZSB7XG4gIG1vZHVsZS5leHBvcnRzID0gcmVxdWlyZSgnLi9janMvcmVhY3QtaXMuZGV2ZWxvcG1lbnQuanMnKTtcbn1cbiIsICIvKlxub2JqZWN0LWFzc2lnblxuKGMpIFNpbmRyZSBTb3JodXNcbkBsaWNlbnNlIE1JVFxuKi9cblxuJ3VzZSBzdHJpY3QnO1xuLyogZXNsaW50LWRpc2FibGUgbm8tdW51c2VkLXZhcnMgKi9cbnZhciBnZXRPd25Qcm9wZXJ0eVN5bWJvbHMgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlTeW1ib2xzO1xudmFyIGhhc093blByb3BlcnR5ID0gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eTtcbnZhciBwcm9wSXNFbnVtZXJhYmxlID0gT2JqZWN0LnByb3RvdHlwZS5wcm9wZXJ0eUlzRW51bWVyYWJsZTtcblxuZnVuY3Rpb24gdG9PYmplY3QodmFsKSB7XG5cdGlmICh2YWwgPT09IG51bGwgfHwgdmFsID09PSB1bmRlZmluZWQpIHtcblx0XHR0aHJvdyBuZXcgVHlwZUVycm9yKCdPYmplY3QuYXNzaWduIGNhbm5vdCBiZSBjYWxsZWQgd2l0aCBudWxsIG9yIHVuZGVmaW5lZCcpO1xuXHR9XG5cblx0cmV0dXJuIE9iamVjdCh2YWwpO1xufVxuXG5mdW5jdGlvbiBzaG91bGRVc2VOYXRpdmUoKSB7XG5cdHRyeSB7XG5cdFx0aWYgKCFPYmplY3QuYXNzaWduKSB7XG5cdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0fVxuXG5cdFx0Ly8gRGV0ZWN0IGJ1Z2d5IHByb3BlcnR5IGVudW1lcmF0aW9uIG9yZGVyIGluIG9sZGVyIFY4IHZlcnNpb25zLlxuXG5cdFx0Ly8gaHR0cHM6Ly9idWdzLmNocm9taXVtLm9yZy9wL3Y4L2lzc3Vlcy9kZXRhaWw/aWQ9NDExOFxuXHRcdHZhciB0ZXN0MSA9IG5ldyBTdHJpbmcoJ2FiYycpOyAgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby1uZXctd3JhcHBlcnNcblx0XHR0ZXN0MVs1XSA9ICdkZSc7XG5cdFx0aWYgKE9iamVjdC5nZXRPd25Qcm9wZXJ0eU5hbWVzKHRlc3QxKVswXSA9PT0gJzUnKSB7XG5cdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0fVxuXG5cdFx0Ly8gaHR0cHM6Ly9idWdzLmNocm9taXVtLm9yZy9wL3Y4L2lzc3Vlcy9kZXRhaWw/aWQ9MzA1NlxuXHRcdHZhciB0ZXN0MiA9IHt9O1xuXHRcdGZvciAodmFyIGkgPSAwOyBpIDwgMTA7IGkrKykge1xuXHRcdFx0dGVzdDJbJ18nICsgU3RyaW5nLmZyb21DaGFyQ29kZShpKV0gPSBpO1xuXHRcdH1cblx0XHR2YXIgb3JkZXIyID0gT2JqZWN0LmdldE93blByb3BlcnR5TmFtZXModGVzdDIpLm1hcChmdW5jdGlvbiAobikge1xuXHRcdFx0cmV0dXJuIHRlc3QyW25dO1xuXHRcdH0pO1xuXHRcdGlmIChvcmRlcjIuam9pbignJykgIT09ICcwMTIzNDU2Nzg5Jykge1xuXHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdH1cblxuXHRcdC8vIGh0dHBzOi8vYnVncy5jaHJvbWl1bS5vcmcvcC92OC9pc3N1ZXMvZGV0YWlsP2lkPTMwNTZcblx0XHR2YXIgdGVzdDMgPSB7fTtcblx0XHQnYWJjZGVmZ2hpamtsbW5vcHFyc3QnLnNwbGl0KCcnKS5mb3JFYWNoKGZ1bmN0aW9uIChsZXR0ZXIpIHtcblx0XHRcdHRlc3QzW2xldHRlcl0gPSBsZXR0ZXI7XG5cdFx0fSk7XG5cdFx0aWYgKE9iamVjdC5rZXlzKE9iamVjdC5hc3NpZ24oe30sIHRlc3QzKSkuam9pbignJykgIT09XG5cdFx0XHRcdCdhYmNkZWZnaGlqa2xtbm9wcXJzdCcpIHtcblx0XHRcdHJldHVybiBmYWxzZTtcblx0XHR9XG5cblx0XHRyZXR1cm4gdHJ1ZTtcblx0fSBjYXRjaCAoZXJyKSB7XG5cdFx0Ly8gV2UgZG9uJ3QgZXhwZWN0IGFueSBvZiB0aGUgYWJvdmUgdG8gdGhyb3csIGJ1dCBiZXR0ZXIgdG8gYmUgc2FmZS5cblx0XHRyZXR1cm4gZmFsc2U7XG5cdH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBzaG91bGRVc2VOYXRpdmUoKSA/IE9iamVjdC5hc3NpZ24gOiBmdW5jdGlvbiAodGFyZ2V0LCBzb3VyY2UpIHtcblx0dmFyIGZyb207XG5cdHZhciB0byA9IHRvT2JqZWN0KHRhcmdldCk7XG5cdHZhciBzeW1ib2xzO1xuXG5cdGZvciAodmFyIHMgPSAxOyBzIDwgYXJndW1lbnRzLmxlbmd0aDsgcysrKSB7XG5cdFx0ZnJvbSA9IE9iamVjdChhcmd1bWVudHNbc10pO1xuXG5cdFx0Zm9yICh2YXIga2V5IGluIGZyb20pIHtcblx0XHRcdGlmIChoYXNPd25Qcm9wZXJ0eS5jYWxsKGZyb20sIGtleSkpIHtcblx0XHRcdFx0dG9ba2V5XSA9IGZyb21ba2V5XTtcblx0XHRcdH1cblx0XHR9XG5cblx0XHRpZiAoZ2V0T3duUHJvcGVydHlTeW1ib2xzKSB7XG5cdFx0XHRzeW1ib2xzID0gZ2V0T3duUHJvcGVydHlTeW1ib2xzKGZyb20pO1xuXHRcdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCBzeW1ib2xzLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHRcdGlmIChwcm9wSXNFbnVtZXJhYmxlLmNhbGwoZnJvbSwgc3ltYm9sc1tpXSkpIHtcblx0XHRcdFx0XHR0b1tzeW1ib2xzW2ldXSA9IGZyb21bc3ltYm9sc1tpXV07XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9XG5cdH1cblxuXHRyZXR1cm4gdG87XG59O1xuIiwgIi8qKlxuICogQ29weXJpZ2h0IChjKSAyMDEzLXByZXNlbnQsIEZhY2Vib29rLCBJbmMuXG4gKlxuICogVGhpcyBzb3VyY2UgY29kZSBpcyBsaWNlbnNlZCB1bmRlciB0aGUgTUlUIGxpY2Vuc2UgZm91bmQgaW4gdGhlXG4gKiBMSUNFTlNFIGZpbGUgaW4gdGhlIHJvb3QgZGlyZWN0b3J5IG9mIHRoaXMgc291cmNlIHRyZWUuXG4gKi9cblxuJ3VzZSBzdHJpY3QnO1xuXG52YXIgUmVhY3RQcm9wVHlwZXNTZWNyZXQgPSAnU0VDUkVUX0RPX05PVF9QQVNTX1RISVNfT1JfWU9VX1dJTExfQkVfRklSRUQnO1xuXG5tb2R1bGUuZXhwb3J0cyA9IFJlYWN0UHJvcFR5cGVzU2VjcmV0O1xuIiwgIm1vZHVsZS5leHBvcnRzID0gRnVuY3Rpb24uY2FsbC5iaW5kKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkpO1xuIiwgIi8qKlxuICogQ29weXJpZ2h0IChjKSAyMDEzLXByZXNlbnQsIEZhY2Vib29rLCBJbmMuXG4gKlxuICogVGhpcyBzb3VyY2UgY29kZSBpcyBsaWNlbnNlZCB1bmRlciB0aGUgTUlUIGxpY2Vuc2UgZm91bmQgaW4gdGhlXG4gKiBMSUNFTlNFIGZpbGUgaW4gdGhlIHJvb3QgZGlyZWN0b3J5IG9mIHRoaXMgc291cmNlIHRyZWUuXG4gKi9cblxuJ3VzZSBzdHJpY3QnO1xuXG52YXIgcHJpbnRXYXJuaW5nID0gZnVuY3Rpb24oKSB7fTtcblxuaWYgKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicpIHtcbiAgdmFyIFJlYWN0UHJvcFR5cGVzU2VjcmV0ID0gcmVxdWlyZSgnLi9saWIvUmVhY3RQcm9wVHlwZXNTZWNyZXQnKTtcbiAgdmFyIGxvZ2dlZFR5cGVGYWlsdXJlcyA9IHt9O1xuICB2YXIgaGFzID0gcmVxdWlyZSgnLi9saWIvaGFzJyk7XG5cbiAgcHJpbnRXYXJuaW5nID0gZnVuY3Rpb24odGV4dCkge1xuICAgIHZhciBtZXNzYWdlID0gJ1dhcm5pbmc6ICcgKyB0ZXh0O1xuICAgIGlmICh0eXBlb2YgY29uc29sZSAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgIGNvbnNvbGUuZXJyb3IobWVzc2FnZSk7XG4gICAgfVxuICAgIHRyeSB7XG4gICAgICAvLyAtLS0gV2VsY29tZSB0byBkZWJ1Z2dpbmcgUmVhY3QgLS0tXG4gICAgICAvLyBUaGlzIGVycm9yIHdhcyB0aHJvd24gYXMgYSBjb252ZW5pZW5jZSBzbyB0aGF0IHlvdSBjYW4gdXNlIHRoaXMgc3RhY2tcbiAgICAgIC8vIHRvIGZpbmQgdGhlIGNhbGxzaXRlIHRoYXQgY2F1c2VkIHRoaXMgd2FybmluZyB0byBmaXJlLlxuICAgICAgdGhyb3cgbmV3IEVycm9yKG1lc3NhZ2UpO1xuICAgIH0gY2F0Y2ggKHgpIHsgLyoqLyB9XG4gIH07XG59XG5cbi8qKlxuICogQXNzZXJ0IHRoYXQgdGhlIHZhbHVlcyBtYXRjaCB3aXRoIHRoZSB0eXBlIHNwZWNzLlxuICogRXJyb3IgbWVzc2FnZXMgYXJlIG1lbW9yaXplZCBhbmQgd2lsbCBvbmx5IGJlIHNob3duIG9uY2UuXG4gKlxuICogQHBhcmFtIHtvYmplY3R9IHR5cGVTcGVjcyBNYXAgb2YgbmFtZSB0byBhIFJlYWN0UHJvcFR5cGVcbiAqIEBwYXJhbSB7b2JqZWN0fSB2YWx1ZXMgUnVudGltZSB2YWx1ZXMgdGhhdCBuZWVkIHRvIGJlIHR5cGUtY2hlY2tlZFxuICogQHBhcmFtIHtzdHJpbmd9IGxvY2F0aW9uIGUuZy4gXCJwcm9wXCIsIFwiY29udGV4dFwiLCBcImNoaWxkIGNvbnRleHRcIlxuICogQHBhcmFtIHtzdHJpbmd9IGNvbXBvbmVudE5hbWUgTmFtZSBvZiB0aGUgY29tcG9uZW50IGZvciBlcnJvciBtZXNzYWdlcy5cbiAqIEBwYXJhbSB7P0Z1bmN0aW9ufSBnZXRTdGFjayBSZXR1cm5zIHRoZSBjb21wb25lbnQgc3RhY2suXG4gKiBAcHJpdmF0ZVxuICovXG5mdW5jdGlvbiBjaGVja1Byb3BUeXBlcyh0eXBlU3BlY3MsIHZhbHVlcywgbG9jYXRpb24sIGNvbXBvbmVudE5hbWUsIGdldFN0YWNrKSB7XG4gIGlmIChwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nKSB7XG4gICAgZm9yICh2YXIgdHlwZVNwZWNOYW1lIGluIHR5cGVTcGVjcykge1xuICAgICAgaWYgKGhhcyh0eXBlU3BlY3MsIHR5cGVTcGVjTmFtZSkpIHtcbiAgICAgICAgdmFyIGVycm9yO1xuICAgICAgICAvLyBQcm9wIHR5cGUgdmFsaWRhdGlvbiBtYXkgdGhyb3cuIEluIGNhc2UgdGhleSBkbywgd2UgZG9uJ3Qgd2FudCB0b1xuICAgICAgICAvLyBmYWlsIHRoZSByZW5kZXIgcGhhc2Ugd2hlcmUgaXQgZGlkbid0IGZhaWwgYmVmb3JlLiBTbyB3ZSBsb2cgaXQuXG4gICAgICAgIC8vIEFmdGVyIHRoZXNlIGhhdmUgYmVlbiBjbGVhbmVkIHVwLCB3ZSdsbCBsZXQgdGhlbSB0aHJvdy5cbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAvLyBUaGlzIGlzIGludGVudGlvbmFsbHkgYW4gaW52YXJpYW50IHRoYXQgZ2V0cyBjYXVnaHQuIEl0J3MgdGhlIHNhbWVcbiAgICAgICAgICAvLyBiZWhhdmlvciBhcyB3aXRob3V0IHRoaXMgc3RhdGVtZW50IGV4Y2VwdCB3aXRoIGEgYmV0dGVyIG1lc3NhZ2UuXG4gICAgICAgICAgaWYgKHR5cGVvZiB0eXBlU3BlY3NbdHlwZVNwZWNOYW1lXSAhPT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgdmFyIGVyciA9IEVycm9yKFxuICAgICAgICAgICAgICAoY29tcG9uZW50TmFtZSB8fCAnUmVhY3QgY2xhc3MnKSArICc6ICcgKyBsb2NhdGlvbiArICcgdHlwZSBgJyArIHR5cGVTcGVjTmFtZSArICdgIGlzIGludmFsaWQ7ICcgK1xuICAgICAgICAgICAgICAnaXQgbXVzdCBiZSBhIGZ1bmN0aW9uLCB1c3VhbGx5IGZyb20gdGhlIGBwcm9wLXR5cGVzYCBwYWNrYWdlLCBidXQgcmVjZWl2ZWQgYCcgKyB0eXBlb2YgdHlwZVNwZWNzW3R5cGVTcGVjTmFtZV0gKyAnYC4nICtcbiAgICAgICAgICAgICAgJ1RoaXMgb2Z0ZW4gaGFwcGVucyBiZWNhdXNlIG9mIHR5cG9zIHN1Y2ggYXMgYFByb3BUeXBlcy5mdW5jdGlvbmAgaW5zdGVhZCBvZiBgUHJvcFR5cGVzLmZ1bmNgLidcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgICBlcnIubmFtZSA9ICdJbnZhcmlhbnQgVmlvbGF0aW9uJztcbiAgICAgICAgICAgIHRocm93IGVycjtcbiAgICAgICAgICB9XG4gICAgICAgICAgZXJyb3IgPSB0eXBlU3BlY3NbdHlwZVNwZWNOYW1lXSh2YWx1ZXMsIHR5cGVTcGVjTmFtZSwgY29tcG9uZW50TmFtZSwgbG9jYXRpb24sIG51bGwsIFJlYWN0UHJvcFR5cGVzU2VjcmV0KTtcbiAgICAgICAgfSBjYXRjaCAoZXgpIHtcbiAgICAgICAgICBlcnJvciA9IGV4O1xuICAgICAgICB9XG4gICAgICAgIGlmIChlcnJvciAmJiAhKGVycm9yIGluc3RhbmNlb2YgRXJyb3IpKSB7XG4gICAgICAgICAgcHJpbnRXYXJuaW5nKFxuICAgICAgICAgICAgKGNvbXBvbmVudE5hbWUgfHwgJ1JlYWN0IGNsYXNzJykgKyAnOiB0eXBlIHNwZWNpZmljYXRpb24gb2YgJyArXG4gICAgICAgICAgICBsb2NhdGlvbiArICcgYCcgKyB0eXBlU3BlY05hbWUgKyAnYCBpcyBpbnZhbGlkOyB0aGUgdHlwZSBjaGVja2VyICcgK1xuICAgICAgICAgICAgJ2Z1bmN0aW9uIG11c3QgcmV0dXJuIGBudWxsYCBvciBhbiBgRXJyb3JgIGJ1dCByZXR1cm5lZCBhICcgKyB0eXBlb2YgZXJyb3IgKyAnLiAnICtcbiAgICAgICAgICAgICdZb3UgbWF5IGhhdmUgZm9yZ290dGVuIHRvIHBhc3MgYW4gYXJndW1lbnQgdG8gdGhlIHR5cGUgY2hlY2tlciAnICtcbiAgICAgICAgICAgICdjcmVhdG9yIChhcnJheU9mLCBpbnN0YW5jZU9mLCBvYmplY3RPZiwgb25lT2YsIG9uZU9mVHlwZSwgYW5kICcgK1xuICAgICAgICAgICAgJ3NoYXBlIGFsbCByZXF1aXJlIGFuIGFyZ3VtZW50KS4nXG4gICAgICAgICAgKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoZXJyb3IgaW5zdGFuY2VvZiBFcnJvciAmJiAhKGVycm9yLm1lc3NhZ2UgaW4gbG9nZ2VkVHlwZUZhaWx1cmVzKSkge1xuICAgICAgICAgIC8vIE9ubHkgbW9uaXRvciB0aGlzIGZhaWx1cmUgb25jZSBiZWNhdXNlIHRoZXJlIHRlbmRzIHRvIGJlIGEgbG90IG9mIHRoZVxuICAgICAgICAgIC8vIHNhbWUgZXJyb3IuXG4gICAgICAgICAgbG9nZ2VkVHlwZUZhaWx1cmVzW2Vycm9yLm1lc3NhZ2VdID0gdHJ1ZTtcblxuICAgICAgICAgIHZhciBzdGFjayA9IGdldFN0YWNrID8gZ2V0U3RhY2soKSA6ICcnO1xuXG4gICAgICAgICAgcHJpbnRXYXJuaW5nKFxuICAgICAgICAgICAgJ0ZhaWxlZCAnICsgbG9jYXRpb24gKyAnIHR5cGU6ICcgKyBlcnJvci5tZXNzYWdlICsgKHN0YWNrICE9IG51bGwgPyBzdGFjayA6ICcnKVxuICAgICAgICAgICk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cbn1cblxuLyoqXG4gKiBSZXNldHMgd2FybmluZyBjYWNoZSB3aGVuIHRlc3RpbmcuXG4gKlxuICogQHByaXZhdGVcbiAqL1xuY2hlY2tQcm9wVHlwZXMucmVzZXRXYXJuaW5nQ2FjaGUgPSBmdW5jdGlvbigpIHtcbiAgaWYgKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicpIHtcbiAgICBsb2dnZWRUeXBlRmFpbHVyZXMgPSB7fTtcbiAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGNoZWNrUHJvcFR5cGVzO1xuIiwgIi8qKlxuICogQ29weXJpZ2h0IChjKSAyMDEzLXByZXNlbnQsIEZhY2Vib29rLCBJbmMuXG4gKlxuICogVGhpcyBzb3VyY2UgY29kZSBpcyBsaWNlbnNlZCB1bmRlciB0aGUgTUlUIGxpY2Vuc2UgZm91bmQgaW4gdGhlXG4gKiBMSUNFTlNFIGZpbGUgaW4gdGhlIHJvb3QgZGlyZWN0b3J5IG9mIHRoaXMgc291cmNlIHRyZWUuXG4gKi9cblxuJ3VzZSBzdHJpY3QnO1xuXG52YXIgUmVhY3RJcyA9IHJlcXVpcmUoJ3JlYWN0LWlzJyk7XG52YXIgYXNzaWduID0gcmVxdWlyZSgnb2JqZWN0LWFzc2lnbicpO1xuXG52YXIgUmVhY3RQcm9wVHlwZXNTZWNyZXQgPSByZXF1aXJlKCcuL2xpYi9SZWFjdFByb3BUeXBlc1NlY3JldCcpO1xudmFyIGhhcyA9IHJlcXVpcmUoJy4vbGliL2hhcycpO1xudmFyIGNoZWNrUHJvcFR5cGVzID0gcmVxdWlyZSgnLi9jaGVja1Byb3BUeXBlcycpO1xuXG52YXIgcHJpbnRXYXJuaW5nID0gZnVuY3Rpb24oKSB7fTtcblxuaWYgKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicpIHtcbiAgcHJpbnRXYXJuaW5nID0gZnVuY3Rpb24odGV4dCkge1xuICAgIHZhciBtZXNzYWdlID0gJ1dhcm5pbmc6ICcgKyB0ZXh0O1xuICAgIGlmICh0eXBlb2YgY29uc29sZSAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgIGNvbnNvbGUuZXJyb3IobWVzc2FnZSk7XG4gICAgfVxuICAgIHRyeSB7XG4gICAgICAvLyAtLS0gV2VsY29tZSB0byBkZWJ1Z2dpbmcgUmVhY3QgLS0tXG4gICAgICAvLyBUaGlzIGVycm9yIHdhcyB0aHJvd24gYXMgYSBjb252ZW5pZW5jZSBzbyB0aGF0IHlvdSBjYW4gdXNlIHRoaXMgc3RhY2tcbiAgICAgIC8vIHRvIGZpbmQgdGhlIGNhbGxzaXRlIHRoYXQgY2F1c2VkIHRoaXMgd2FybmluZyB0byBmaXJlLlxuICAgICAgdGhyb3cgbmV3IEVycm9yKG1lc3NhZ2UpO1xuICAgIH0gY2F0Y2ggKHgpIHt9XG4gIH07XG59XG5cbmZ1bmN0aW9uIGVtcHR5RnVuY3Rpb25UaGF0UmV0dXJuc051bGwoKSB7XG4gIHJldHVybiBudWxsO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGlzVmFsaWRFbGVtZW50LCB0aHJvd09uRGlyZWN0QWNjZXNzKSB7XG4gIC8qIGdsb2JhbCBTeW1ib2wgKi9cbiAgdmFyIElURVJBVE9SX1NZTUJPTCA9IHR5cGVvZiBTeW1ib2wgPT09ICdmdW5jdGlvbicgJiYgU3ltYm9sLml0ZXJhdG9yO1xuICB2YXIgRkFVWF9JVEVSQVRPUl9TWU1CT0wgPSAnQEBpdGVyYXRvcic7IC8vIEJlZm9yZSBTeW1ib2wgc3BlYy5cblxuICAvKipcbiAgICogUmV0dXJucyB0aGUgaXRlcmF0b3IgbWV0aG9kIGZ1bmN0aW9uIGNvbnRhaW5lZCBvbiB0aGUgaXRlcmFibGUgb2JqZWN0LlxuICAgKlxuICAgKiBCZSBzdXJlIHRvIGludm9rZSB0aGUgZnVuY3Rpb24gd2l0aCB0aGUgaXRlcmFibGUgYXMgY29udGV4dDpcbiAgICpcbiAgICogICAgIHZhciBpdGVyYXRvckZuID0gZ2V0SXRlcmF0b3JGbihteUl0ZXJhYmxlKTtcbiAgICogICAgIGlmIChpdGVyYXRvckZuKSB7XG4gICAqICAgICAgIHZhciBpdGVyYXRvciA9IGl0ZXJhdG9yRm4uY2FsbChteUl0ZXJhYmxlKTtcbiAgICogICAgICAgLi4uXG4gICAqICAgICB9XG4gICAqXG4gICAqIEBwYXJhbSB7P29iamVjdH0gbWF5YmVJdGVyYWJsZVxuICAgKiBAcmV0dXJuIHs/ZnVuY3Rpb259XG4gICAqL1xuICBmdW5jdGlvbiBnZXRJdGVyYXRvckZuKG1heWJlSXRlcmFibGUpIHtcbiAgICB2YXIgaXRlcmF0b3JGbiA9IG1heWJlSXRlcmFibGUgJiYgKElURVJBVE9SX1NZTUJPTCAmJiBtYXliZUl0ZXJhYmxlW0lURVJBVE9SX1NZTUJPTF0gfHwgbWF5YmVJdGVyYWJsZVtGQVVYX0lURVJBVE9SX1NZTUJPTF0pO1xuICAgIGlmICh0eXBlb2YgaXRlcmF0b3JGbiA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgcmV0dXJuIGl0ZXJhdG9yRm47XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIENvbGxlY3Rpb24gb2YgbWV0aG9kcyB0aGF0IGFsbG93IGRlY2xhcmF0aW9uIGFuZCB2YWxpZGF0aW9uIG9mIHByb3BzIHRoYXQgYXJlXG4gICAqIHN1cHBsaWVkIHRvIFJlYWN0IGNvbXBvbmVudHMuIEV4YW1wbGUgdXNhZ2U6XG4gICAqXG4gICAqICAgdmFyIFByb3BzID0gcmVxdWlyZSgnUmVhY3RQcm9wVHlwZXMnKTtcbiAgICogICB2YXIgTXlBcnRpY2xlID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xuICAgKiAgICAgcHJvcFR5cGVzOiB7XG4gICAqICAgICAgIC8vIEFuIG9wdGlvbmFsIHN0cmluZyBwcm9wIG5hbWVkIFwiZGVzY3JpcHRpb25cIi5cbiAgICogICAgICAgZGVzY3JpcHRpb246IFByb3BzLnN0cmluZyxcbiAgICpcbiAgICogICAgICAgLy8gQSByZXF1aXJlZCBlbnVtIHByb3AgbmFtZWQgXCJjYXRlZ29yeVwiLlxuICAgKiAgICAgICBjYXRlZ29yeTogUHJvcHMub25lT2YoWydOZXdzJywnUGhvdG9zJ10pLmlzUmVxdWlyZWQsXG4gICAqXG4gICAqICAgICAgIC8vIEEgcHJvcCBuYW1lZCBcImRpYWxvZ1wiIHRoYXQgcmVxdWlyZXMgYW4gaW5zdGFuY2Ugb2YgRGlhbG9nLlxuICAgKiAgICAgICBkaWFsb2c6IFByb3BzLmluc3RhbmNlT2YoRGlhbG9nKS5pc1JlcXVpcmVkXG4gICAqICAgICB9LFxuICAgKiAgICAgcmVuZGVyOiBmdW5jdGlvbigpIHsgLi4uIH1cbiAgICogICB9KTtcbiAgICpcbiAgICogQSBtb3JlIGZvcm1hbCBzcGVjaWZpY2F0aW9uIG9mIGhvdyB0aGVzZSBtZXRob2RzIGFyZSB1c2VkOlxuICAgKlxuICAgKiAgIHR5cGUgOj0gYXJyYXl8Ym9vbHxmdW5jfG9iamVjdHxudW1iZXJ8c3RyaW5nfG9uZU9mKFsuLi5dKXxpbnN0YW5jZU9mKC4uLilcbiAgICogICBkZWNsIDo9IFJlYWN0UHJvcFR5cGVzLnt0eXBlfSguaXNSZXF1aXJlZCk/XG4gICAqXG4gICAqIEVhY2ggYW5kIGV2ZXJ5IGRlY2xhcmF0aW9uIHByb2R1Y2VzIGEgZnVuY3Rpb24gd2l0aCB0aGUgc2FtZSBzaWduYXR1cmUuIFRoaXNcbiAgICogYWxsb3dzIHRoZSBjcmVhdGlvbiBvZiBjdXN0b20gdmFsaWRhdGlvbiBmdW5jdGlvbnMuIEZvciBleGFtcGxlOlxuICAgKlxuICAgKiAgdmFyIE15TGluayA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcbiAgICogICAgcHJvcFR5cGVzOiB7XG4gICAqICAgICAgLy8gQW4gb3B0aW9uYWwgc3RyaW5nIG9yIFVSSSBwcm9wIG5hbWVkIFwiaHJlZlwiLlxuICAgKiAgICAgIGhyZWY6IGZ1bmN0aW9uKHByb3BzLCBwcm9wTmFtZSwgY29tcG9uZW50TmFtZSkge1xuICAgKiAgICAgICAgdmFyIHByb3BWYWx1ZSA9IHByb3BzW3Byb3BOYW1lXTtcbiAgICogICAgICAgIGlmIChwcm9wVmFsdWUgIT0gbnVsbCAmJiB0eXBlb2YgcHJvcFZhbHVlICE9PSAnc3RyaW5nJyAmJlxuICAgKiAgICAgICAgICAgICEocHJvcFZhbHVlIGluc3RhbmNlb2YgVVJJKSkge1xuICAgKiAgICAgICAgICByZXR1cm4gbmV3IEVycm9yKFxuICAgKiAgICAgICAgICAgICdFeHBlY3RlZCBhIHN0cmluZyBvciBhbiBVUkkgZm9yICcgKyBwcm9wTmFtZSArICcgaW4gJyArXG4gICAqICAgICAgICAgICAgY29tcG9uZW50TmFtZVxuICAgKiAgICAgICAgICApO1xuICAgKiAgICAgICAgfVxuICAgKiAgICAgIH1cbiAgICogICAgfSxcbiAgICogICAgcmVuZGVyOiBmdW5jdGlvbigpIHsuLi59XG4gICAqICB9KTtcbiAgICpcbiAgICogQGludGVybmFsXG4gICAqL1xuXG4gIHZhciBBTk9OWU1PVVMgPSAnPDxhbm9ueW1vdXM+Pic7XG5cbiAgLy8gSW1wb3J0YW50IVxuICAvLyBLZWVwIHRoaXMgbGlzdCBpbiBzeW5jIHdpdGggcHJvZHVjdGlvbiB2ZXJzaW9uIGluIGAuL2ZhY3RvcnlXaXRoVGhyb3dpbmdTaGltcy5qc2AuXG4gIHZhciBSZWFjdFByb3BUeXBlcyA9IHtcbiAgICBhcnJheTogY3JlYXRlUHJpbWl0aXZlVHlwZUNoZWNrZXIoJ2FycmF5JyksXG4gICAgYmlnaW50OiBjcmVhdGVQcmltaXRpdmVUeXBlQ2hlY2tlcignYmlnaW50JyksXG4gICAgYm9vbDogY3JlYXRlUHJpbWl0aXZlVHlwZUNoZWNrZXIoJ2Jvb2xlYW4nKSxcbiAgICBmdW5jOiBjcmVhdGVQcmltaXRpdmVUeXBlQ2hlY2tlcignZnVuY3Rpb24nKSxcbiAgICBudW1iZXI6IGNyZWF0ZVByaW1pdGl2ZVR5cGVDaGVja2VyKCdudW1iZXInKSxcbiAgICBvYmplY3Q6IGNyZWF0ZVByaW1pdGl2ZVR5cGVDaGVja2VyKCdvYmplY3QnKSxcbiAgICBzdHJpbmc6IGNyZWF0ZVByaW1pdGl2ZVR5cGVDaGVja2VyKCdzdHJpbmcnKSxcbiAgICBzeW1ib2w6IGNyZWF0ZVByaW1pdGl2ZVR5cGVDaGVja2VyKCdzeW1ib2wnKSxcblxuICAgIGFueTogY3JlYXRlQW55VHlwZUNoZWNrZXIoKSxcbiAgICBhcnJheU9mOiBjcmVhdGVBcnJheU9mVHlwZUNoZWNrZXIsXG4gICAgZWxlbWVudDogY3JlYXRlRWxlbWVudFR5cGVDaGVja2VyKCksXG4gICAgZWxlbWVudFR5cGU6IGNyZWF0ZUVsZW1lbnRUeXBlVHlwZUNoZWNrZXIoKSxcbiAgICBpbnN0YW5jZU9mOiBjcmVhdGVJbnN0YW5jZVR5cGVDaGVja2VyLFxuICAgIG5vZGU6IGNyZWF0ZU5vZGVDaGVja2VyKCksXG4gICAgb2JqZWN0T2Y6IGNyZWF0ZU9iamVjdE9mVHlwZUNoZWNrZXIsXG4gICAgb25lT2Y6IGNyZWF0ZUVudW1UeXBlQ2hlY2tlcixcbiAgICBvbmVPZlR5cGU6IGNyZWF0ZVVuaW9uVHlwZUNoZWNrZXIsXG4gICAgc2hhcGU6IGNyZWF0ZVNoYXBlVHlwZUNoZWNrZXIsXG4gICAgZXhhY3Q6IGNyZWF0ZVN0cmljdFNoYXBlVHlwZUNoZWNrZXIsXG4gIH07XG5cbiAgLyoqXG4gICAqIGlubGluZWQgT2JqZWN0LmlzIHBvbHlmaWxsIHRvIGF2b2lkIHJlcXVpcmluZyBjb25zdW1lcnMgc2hpcCB0aGVpciBvd25cbiAgICogaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvSmF2YVNjcmlwdC9SZWZlcmVuY2UvR2xvYmFsX09iamVjdHMvT2JqZWN0L2lzXG4gICAqL1xuICAvKmVzbGludC1kaXNhYmxlIG5vLXNlbGYtY29tcGFyZSovXG4gIGZ1bmN0aW9uIGlzKHgsIHkpIHtcbiAgICAvLyBTYW1lVmFsdWUgYWxnb3JpdGhtXG4gICAgaWYgKHggPT09IHkpIHtcbiAgICAgIC8vIFN0ZXBzIDEtNSwgNy0xMFxuICAgICAgLy8gU3RlcHMgNi5iLTYuZTogKzAgIT0gLTBcbiAgICAgIHJldHVybiB4ICE9PSAwIHx8IDEgLyB4ID09PSAxIC8geTtcbiAgICB9IGVsc2Uge1xuICAgICAgLy8gU3RlcCA2LmE6IE5hTiA9PSBOYU5cbiAgICAgIHJldHVybiB4ICE9PSB4ICYmIHkgIT09IHk7XG4gICAgfVxuICB9XG4gIC8qZXNsaW50LWVuYWJsZSBuby1zZWxmLWNvbXBhcmUqL1xuXG4gIC8qKlxuICAgKiBXZSB1c2UgYW4gRXJyb3ItbGlrZSBvYmplY3QgZm9yIGJhY2t3YXJkIGNvbXBhdGliaWxpdHkgYXMgcGVvcGxlIG1heSBjYWxsXG4gICAqIFByb3BUeXBlcyBkaXJlY3RseSBhbmQgaW5zcGVjdCB0aGVpciBvdXRwdXQuIEhvd2V2ZXIsIHdlIGRvbid0IHVzZSByZWFsXG4gICAqIEVycm9ycyBhbnltb3JlLiBXZSBkb24ndCBpbnNwZWN0IHRoZWlyIHN0YWNrIGFueXdheSwgYW5kIGNyZWF0aW5nIHRoZW1cbiAgICogaXMgcHJvaGliaXRpdmVseSBleHBlbnNpdmUgaWYgdGhleSBhcmUgY3JlYXRlZCB0b28gb2Z0ZW4sIHN1Y2ggYXMgd2hhdFxuICAgKiBoYXBwZW5zIGluIG9uZU9mVHlwZSgpIGZvciBhbnkgdHlwZSBiZWZvcmUgdGhlIG9uZSB0aGF0IG1hdGNoZWQuXG4gICAqL1xuICBmdW5jdGlvbiBQcm9wVHlwZUVycm9yKG1lc3NhZ2UsIGRhdGEpIHtcbiAgICB0aGlzLm1lc3NhZ2UgPSBtZXNzYWdlO1xuICAgIHRoaXMuZGF0YSA9IGRhdGEgJiYgdHlwZW9mIGRhdGEgPT09ICdvYmplY3QnID8gZGF0YToge307XG4gICAgdGhpcy5zdGFjayA9ICcnO1xuICB9XG4gIC8vIE1ha2UgYGluc3RhbmNlb2YgRXJyb3JgIHN0aWxsIHdvcmsgZm9yIHJldHVybmVkIGVycm9ycy5cbiAgUHJvcFR5cGVFcnJvci5wcm90b3R5cGUgPSBFcnJvci5wcm90b3R5cGU7XG5cbiAgZnVuY3Rpb24gY3JlYXRlQ2hhaW5hYmxlVHlwZUNoZWNrZXIodmFsaWRhdGUpIHtcbiAgICBpZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJykge1xuICAgICAgdmFyIG1hbnVhbFByb3BUeXBlQ2FsbENhY2hlID0ge307XG4gICAgICB2YXIgbWFudWFsUHJvcFR5cGVXYXJuaW5nQ291bnQgPSAwO1xuICAgIH1cbiAgICBmdW5jdGlvbiBjaGVja1R5cGUoaXNSZXF1aXJlZCwgcHJvcHMsIHByb3BOYW1lLCBjb21wb25lbnROYW1lLCBsb2NhdGlvbiwgcHJvcEZ1bGxOYW1lLCBzZWNyZXQpIHtcbiAgICAgIGNvbXBvbmVudE5hbWUgPSBjb21wb25lbnROYW1lIHx8IEFOT05ZTU9VUztcbiAgICAgIHByb3BGdWxsTmFtZSA9IHByb3BGdWxsTmFtZSB8fCBwcm9wTmFtZTtcblxuICAgICAgaWYgKHNlY3JldCAhPT0gUmVhY3RQcm9wVHlwZXNTZWNyZXQpIHtcbiAgICAgICAgaWYgKHRocm93T25EaXJlY3RBY2Nlc3MpIHtcbiAgICAgICAgICAvLyBOZXcgYmVoYXZpb3Igb25seSBmb3IgdXNlcnMgb2YgYHByb3AtdHlwZXNgIHBhY2thZ2VcbiAgICAgICAgICB2YXIgZXJyID0gbmV3IEVycm9yKFxuICAgICAgICAgICAgJ0NhbGxpbmcgUHJvcFR5cGVzIHZhbGlkYXRvcnMgZGlyZWN0bHkgaXMgbm90IHN1cHBvcnRlZCBieSB0aGUgYHByb3AtdHlwZXNgIHBhY2thZ2UuICcgK1xuICAgICAgICAgICAgJ1VzZSBgUHJvcFR5cGVzLmNoZWNrUHJvcFR5cGVzKClgIHRvIGNhbGwgdGhlbS4gJyArXG4gICAgICAgICAgICAnUmVhZCBtb3JlIGF0IGh0dHA6Ly9mYi5tZS91c2UtY2hlY2stcHJvcC10eXBlcydcbiAgICAgICAgICApO1xuICAgICAgICAgIGVyci5uYW1lID0gJ0ludmFyaWFudCBWaW9sYXRpb24nO1xuICAgICAgICAgIHRocm93IGVycjtcbiAgICAgICAgfSBlbHNlIGlmIChwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nICYmIHR5cGVvZiBjb25zb2xlICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgIC8vIE9sZCBiZWhhdmlvciBmb3IgcGVvcGxlIHVzaW5nIFJlYWN0LlByb3BUeXBlc1xuICAgICAgICAgIHZhciBjYWNoZUtleSA9IGNvbXBvbmVudE5hbWUgKyAnOicgKyBwcm9wTmFtZTtcbiAgICAgICAgICBpZiAoXG4gICAgICAgICAgICAhbWFudWFsUHJvcFR5cGVDYWxsQ2FjaGVbY2FjaGVLZXldICYmXG4gICAgICAgICAgICAvLyBBdm9pZCBzcGFtbWluZyB0aGUgY29uc29sZSBiZWNhdXNlIHRoZXkgYXJlIG9mdGVuIG5vdCBhY3Rpb25hYmxlIGV4Y2VwdCBmb3IgbGliIGF1dGhvcnNcbiAgICAgICAgICAgIG1hbnVhbFByb3BUeXBlV2FybmluZ0NvdW50IDwgM1xuICAgICAgICAgICkge1xuICAgICAgICAgICAgcHJpbnRXYXJuaW5nKFxuICAgICAgICAgICAgICAnWW91IGFyZSBtYW51YWxseSBjYWxsaW5nIGEgUmVhY3QuUHJvcFR5cGVzIHZhbGlkYXRpb24gJyArXG4gICAgICAgICAgICAgICdmdW5jdGlvbiBmb3IgdGhlIGAnICsgcHJvcEZ1bGxOYW1lICsgJ2AgcHJvcCBvbiBgJyArIGNvbXBvbmVudE5hbWUgKyAnYC4gVGhpcyBpcyBkZXByZWNhdGVkICcgK1xuICAgICAgICAgICAgICAnYW5kIHdpbGwgdGhyb3cgaW4gdGhlIHN0YW5kYWxvbmUgYHByb3AtdHlwZXNgIHBhY2thZ2UuICcgK1xuICAgICAgICAgICAgICAnWW91IG1heSBiZSBzZWVpbmcgdGhpcyB3YXJuaW5nIGR1ZSB0byBhIHRoaXJkLXBhcnR5IFByb3BUeXBlcyAnICtcbiAgICAgICAgICAgICAgJ2xpYnJhcnkuIFNlZSBodHRwczovL2ZiLm1lL3JlYWN0LXdhcm5pbmctZG9udC1jYWxsLXByb3B0eXBlcyAnICsgJ2ZvciBkZXRhaWxzLidcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgICBtYW51YWxQcm9wVHlwZUNhbGxDYWNoZVtjYWNoZUtleV0gPSB0cnVlO1xuICAgICAgICAgICAgbWFudWFsUHJvcFR5cGVXYXJuaW5nQ291bnQrKztcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGlmIChwcm9wc1twcm9wTmFtZV0gPT0gbnVsbCkge1xuICAgICAgICBpZiAoaXNSZXF1aXJlZCkge1xuICAgICAgICAgIGlmIChwcm9wc1twcm9wTmFtZV0gPT09IG51bGwpIHtcbiAgICAgICAgICAgIHJldHVybiBuZXcgUHJvcFR5cGVFcnJvcignVGhlICcgKyBsb2NhdGlvbiArICcgYCcgKyBwcm9wRnVsbE5hbWUgKyAnYCBpcyBtYXJrZWQgYXMgcmVxdWlyZWQgJyArICgnaW4gYCcgKyBjb21wb25lbnROYW1lICsgJ2AsIGJ1dCBpdHMgdmFsdWUgaXMgYG51bGxgLicpKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgcmV0dXJuIG5ldyBQcm9wVHlwZUVycm9yKCdUaGUgJyArIGxvY2F0aW9uICsgJyBgJyArIHByb3BGdWxsTmFtZSArICdgIGlzIG1hcmtlZCBhcyByZXF1aXJlZCBpbiAnICsgKCdgJyArIGNvbXBvbmVudE5hbWUgKyAnYCwgYnV0IGl0cyB2YWx1ZSBpcyBgdW5kZWZpbmVkYC4nKSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gdmFsaWRhdGUocHJvcHMsIHByb3BOYW1lLCBjb21wb25lbnROYW1lLCBsb2NhdGlvbiwgcHJvcEZ1bGxOYW1lKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICB2YXIgY2hhaW5lZENoZWNrVHlwZSA9IGNoZWNrVHlwZS5iaW5kKG51bGwsIGZhbHNlKTtcbiAgICBjaGFpbmVkQ2hlY2tUeXBlLmlzUmVxdWlyZWQgPSBjaGVja1R5cGUuYmluZChudWxsLCB0cnVlKTtcblxuICAgIHJldHVybiBjaGFpbmVkQ2hlY2tUeXBlO1xuICB9XG5cbiAgZnVuY3Rpb24gY3JlYXRlUHJpbWl0aXZlVHlwZUNoZWNrZXIoZXhwZWN0ZWRUeXBlKSB7XG4gICAgZnVuY3Rpb24gdmFsaWRhdGUocHJvcHMsIHByb3BOYW1lLCBjb21wb25lbnROYW1lLCBsb2NhdGlvbiwgcHJvcEZ1bGxOYW1lLCBzZWNyZXQpIHtcbiAgICAgIHZhciBwcm9wVmFsdWUgPSBwcm9wc1twcm9wTmFtZV07XG4gICAgICB2YXIgcHJvcFR5cGUgPSBnZXRQcm9wVHlwZShwcm9wVmFsdWUpO1xuICAgICAgaWYgKHByb3BUeXBlICE9PSBleHBlY3RlZFR5cGUpIHtcbiAgICAgICAgLy8gYHByb3BWYWx1ZWAgYmVpbmcgaW5zdGFuY2Ugb2YsIHNheSwgZGF0ZS9yZWdleHAsIHBhc3MgdGhlICdvYmplY3QnXG4gICAgICAgIC8vIGNoZWNrLCBidXQgd2UgY2FuIG9mZmVyIGEgbW9yZSBwcmVjaXNlIGVycm9yIG1lc3NhZ2UgaGVyZSByYXRoZXIgdGhhblxuICAgICAgICAvLyAnb2YgdHlwZSBgb2JqZWN0YCcuXG4gICAgICAgIHZhciBwcmVjaXNlVHlwZSA9IGdldFByZWNpc2VUeXBlKHByb3BWYWx1ZSk7XG5cbiAgICAgICAgcmV0dXJuIG5ldyBQcm9wVHlwZUVycm9yKFxuICAgICAgICAgICdJbnZhbGlkICcgKyBsb2NhdGlvbiArICcgYCcgKyBwcm9wRnVsbE5hbWUgKyAnYCBvZiB0eXBlICcgKyAoJ2AnICsgcHJlY2lzZVR5cGUgKyAnYCBzdXBwbGllZCB0byBgJyArIGNvbXBvbmVudE5hbWUgKyAnYCwgZXhwZWN0ZWQgJykgKyAoJ2AnICsgZXhwZWN0ZWRUeXBlICsgJ2AuJyksXG4gICAgICAgICAge2V4cGVjdGVkVHlwZTogZXhwZWN0ZWRUeXBlfVxuICAgICAgICApO1xuICAgICAgfVxuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICAgIHJldHVybiBjcmVhdGVDaGFpbmFibGVUeXBlQ2hlY2tlcih2YWxpZGF0ZSk7XG4gIH1cblxuICBmdW5jdGlvbiBjcmVhdGVBbnlUeXBlQ2hlY2tlcigpIHtcbiAgICByZXR1cm4gY3JlYXRlQ2hhaW5hYmxlVHlwZUNoZWNrZXIoZW1wdHlGdW5jdGlvblRoYXRSZXR1cm5zTnVsbCk7XG4gIH1cblxuICBmdW5jdGlvbiBjcmVhdGVBcnJheU9mVHlwZUNoZWNrZXIodHlwZUNoZWNrZXIpIHtcbiAgICBmdW5jdGlvbiB2YWxpZGF0ZShwcm9wcywgcHJvcE5hbWUsIGNvbXBvbmVudE5hbWUsIGxvY2F0aW9uLCBwcm9wRnVsbE5hbWUpIHtcbiAgICAgIGlmICh0eXBlb2YgdHlwZUNoZWNrZXIgIT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9wVHlwZUVycm9yKCdQcm9wZXJ0eSBgJyArIHByb3BGdWxsTmFtZSArICdgIG9mIGNvbXBvbmVudCBgJyArIGNvbXBvbmVudE5hbWUgKyAnYCBoYXMgaW52YWxpZCBQcm9wVHlwZSBub3RhdGlvbiBpbnNpZGUgYXJyYXlPZi4nKTtcbiAgICAgIH1cbiAgICAgIHZhciBwcm9wVmFsdWUgPSBwcm9wc1twcm9wTmFtZV07XG4gICAgICBpZiAoIUFycmF5LmlzQXJyYXkocHJvcFZhbHVlKSkge1xuICAgICAgICB2YXIgcHJvcFR5cGUgPSBnZXRQcm9wVHlwZShwcm9wVmFsdWUpO1xuICAgICAgICByZXR1cm4gbmV3IFByb3BUeXBlRXJyb3IoJ0ludmFsaWQgJyArIGxvY2F0aW9uICsgJyBgJyArIHByb3BGdWxsTmFtZSArICdgIG9mIHR5cGUgJyArICgnYCcgKyBwcm9wVHlwZSArICdgIHN1cHBsaWVkIHRvIGAnICsgY29tcG9uZW50TmFtZSArICdgLCBleHBlY3RlZCBhbiBhcnJheS4nKSk7XG4gICAgICB9XG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHByb3BWYWx1ZS5sZW5ndGg7IGkrKykge1xuICAgICAgICB2YXIgZXJyb3IgPSB0eXBlQ2hlY2tlcihwcm9wVmFsdWUsIGksIGNvbXBvbmVudE5hbWUsIGxvY2F0aW9uLCBwcm9wRnVsbE5hbWUgKyAnWycgKyBpICsgJ10nLCBSZWFjdFByb3BUeXBlc1NlY3JldCk7XG4gICAgICAgIGlmIChlcnJvciBpbnN0YW5jZW9mIEVycm9yKSB7XG4gICAgICAgICAgcmV0dXJuIGVycm9yO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gICAgcmV0dXJuIGNyZWF0ZUNoYWluYWJsZVR5cGVDaGVja2VyKHZhbGlkYXRlKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGNyZWF0ZUVsZW1lbnRUeXBlQ2hlY2tlcigpIHtcbiAgICBmdW5jdGlvbiB2YWxpZGF0ZShwcm9wcywgcHJvcE5hbWUsIGNvbXBvbmVudE5hbWUsIGxvY2F0aW9uLCBwcm9wRnVsbE5hbWUpIHtcbiAgICAgIHZhciBwcm9wVmFsdWUgPSBwcm9wc1twcm9wTmFtZV07XG4gICAgICBpZiAoIWlzVmFsaWRFbGVtZW50KHByb3BWYWx1ZSkpIHtcbiAgICAgICAgdmFyIHByb3BUeXBlID0gZ2V0UHJvcFR5cGUocHJvcFZhbHVlKTtcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9wVHlwZUVycm9yKCdJbnZhbGlkICcgKyBsb2NhdGlvbiArICcgYCcgKyBwcm9wRnVsbE5hbWUgKyAnYCBvZiB0eXBlICcgKyAoJ2AnICsgcHJvcFR5cGUgKyAnYCBzdXBwbGllZCB0byBgJyArIGNvbXBvbmVudE5hbWUgKyAnYCwgZXhwZWN0ZWQgYSBzaW5nbGUgUmVhY3RFbGVtZW50LicpKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgICByZXR1cm4gY3JlYXRlQ2hhaW5hYmxlVHlwZUNoZWNrZXIodmFsaWRhdGUpO1xuICB9XG5cbiAgZnVuY3Rpb24gY3JlYXRlRWxlbWVudFR5cGVUeXBlQ2hlY2tlcigpIHtcbiAgICBmdW5jdGlvbiB2YWxpZGF0ZShwcm9wcywgcHJvcE5hbWUsIGNvbXBvbmVudE5hbWUsIGxvY2F0aW9uLCBwcm9wRnVsbE5hbWUpIHtcbiAgICAgIHZhciBwcm9wVmFsdWUgPSBwcm9wc1twcm9wTmFtZV07XG4gICAgICBpZiAoIVJlYWN0SXMuaXNWYWxpZEVsZW1lbnRUeXBlKHByb3BWYWx1ZSkpIHtcbiAgICAgICAgdmFyIHByb3BUeXBlID0gZ2V0UHJvcFR5cGUocHJvcFZhbHVlKTtcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9wVHlwZUVycm9yKCdJbnZhbGlkICcgKyBsb2NhdGlvbiArICcgYCcgKyBwcm9wRnVsbE5hbWUgKyAnYCBvZiB0eXBlICcgKyAoJ2AnICsgcHJvcFR5cGUgKyAnYCBzdXBwbGllZCB0byBgJyArIGNvbXBvbmVudE5hbWUgKyAnYCwgZXhwZWN0ZWQgYSBzaW5nbGUgUmVhY3RFbGVtZW50IHR5cGUuJykpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICAgIHJldHVybiBjcmVhdGVDaGFpbmFibGVUeXBlQ2hlY2tlcih2YWxpZGF0ZSk7XG4gIH1cblxuICBmdW5jdGlvbiBjcmVhdGVJbnN0YW5jZVR5cGVDaGVja2VyKGV4cGVjdGVkQ2xhc3MpIHtcbiAgICBmdW5jdGlvbiB2YWxpZGF0ZShwcm9wcywgcHJvcE5hbWUsIGNvbXBvbmVudE5hbWUsIGxvY2F0aW9uLCBwcm9wRnVsbE5hbWUpIHtcbiAgICAgIGlmICghKHByb3BzW3Byb3BOYW1lXSBpbnN0YW5jZW9mIGV4cGVjdGVkQ2xhc3MpKSB7XG4gICAgICAgIHZhciBleHBlY3RlZENsYXNzTmFtZSA9IGV4cGVjdGVkQ2xhc3MubmFtZSB8fCBBTk9OWU1PVVM7XG4gICAgICAgIHZhciBhY3R1YWxDbGFzc05hbWUgPSBnZXRDbGFzc05hbWUocHJvcHNbcHJvcE5hbWVdKTtcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9wVHlwZUVycm9yKCdJbnZhbGlkICcgKyBsb2NhdGlvbiArICcgYCcgKyBwcm9wRnVsbE5hbWUgKyAnYCBvZiB0eXBlICcgKyAoJ2AnICsgYWN0dWFsQ2xhc3NOYW1lICsgJ2Agc3VwcGxpZWQgdG8gYCcgKyBjb21wb25lbnROYW1lICsgJ2AsIGV4cGVjdGVkICcpICsgKCdpbnN0YW5jZSBvZiBgJyArIGV4cGVjdGVkQ2xhc3NOYW1lICsgJ2AuJykpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICAgIHJldHVybiBjcmVhdGVDaGFpbmFibGVUeXBlQ2hlY2tlcih2YWxpZGF0ZSk7XG4gIH1cblxuICBmdW5jdGlvbiBjcmVhdGVFbnVtVHlwZUNoZWNrZXIoZXhwZWN0ZWRWYWx1ZXMpIHtcbiAgICBpZiAoIUFycmF5LmlzQXJyYXkoZXhwZWN0ZWRWYWx1ZXMpKSB7XG4gICAgICBpZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJykge1xuICAgICAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA+IDEpIHtcbiAgICAgICAgICBwcmludFdhcm5pbmcoXG4gICAgICAgICAgICAnSW52YWxpZCBhcmd1bWVudHMgc3VwcGxpZWQgdG8gb25lT2YsIGV4cGVjdGVkIGFuIGFycmF5LCBnb3QgJyArIGFyZ3VtZW50cy5sZW5ndGggKyAnIGFyZ3VtZW50cy4gJyArXG4gICAgICAgICAgICAnQSBjb21tb24gbWlzdGFrZSBpcyB0byB3cml0ZSBvbmVPZih4LCB5LCB6KSBpbnN0ZWFkIG9mIG9uZU9mKFt4LCB5LCB6XSkuJ1xuICAgICAgICAgICk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcHJpbnRXYXJuaW5nKCdJbnZhbGlkIGFyZ3VtZW50IHN1cHBsaWVkIHRvIG9uZU9mLCBleHBlY3RlZCBhbiBhcnJheS4nKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgcmV0dXJuIGVtcHR5RnVuY3Rpb25UaGF0UmV0dXJuc051bGw7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gdmFsaWRhdGUocHJvcHMsIHByb3BOYW1lLCBjb21wb25lbnROYW1lLCBsb2NhdGlvbiwgcHJvcEZ1bGxOYW1lKSB7XG4gICAgICB2YXIgcHJvcFZhbHVlID0gcHJvcHNbcHJvcE5hbWVdO1xuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBleHBlY3RlZFZhbHVlcy5sZW5ndGg7IGkrKykge1xuICAgICAgICBpZiAoaXMocHJvcFZhbHVlLCBleHBlY3RlZFZhbHVlc1tpXSkpIHtcbiAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICB2YXIgdmFsdWVzU3RyaW5nID0gSlNPTi5zdHJpbmdpZnkoZXhwZWN0ZWRWYWx1ZXMsIGZ1bmN0aW9uIHJlcGxhY2VyKGtleSwgdmFsdWUpIHtcbiAgICAgICAgdmFyIHR5cGUgPSBnZXRQcmVjaXNlVHlwZSh2YWx1ZSk7XG4gICAgICAgIGlmICh0eXBlID09PSAnc3ltYm9sJykge1xuICAgICAgICAgIHJldHVybiBTdHJpbmcodmFsdWUpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB2YWx1ZTtcbiAgICAgIH0pO1xuICAgICAgcmV0dXJuIG5ldyBQcm9wVHlwZUVycm9yKCdJbnZhbGlkICcgKyBsb2NhdGlvbiArICcgYCcgKyBwcm9wRnVsbE5hbWUgKyAnYCBvZiB2YWx1ZSBgJyArIFN0cmluZyhwcm9wVmFsdWUpICsgJ2AgJyArICgnc3VwcGxpZWQgdG8gYCcgKyBjb21wb25lbnROYW1lICsgJ2AsIGV4cGVjdGVkIG9uZSBvZiAnICsgdmFsdWVzU3RyaW5nICsgJy4nKSk7XG4gICAgfVxuICAgIHJldHVybiBjcmVhdGVDaGFpbmFibGVUeXBlQ2hlY2tlcih2YWxpZGF0ZSk7XG4gIH1cblxuICBmdW5jdGlvbiBjcmVhdGVPYmplY3RPZlR5cGVDaGVja2VyKHR5cGVDaGVja2VyKSB7XG4gICAgZnVuY3Rpb24gdmFsaWRhdGUocHJvcHMsIHByb3BOYW1lLCBjb21wb25lbnROYW1lLCBsb2NhdGlvbiwgcHJvcEZ1bGxOYW1lKSB7XG4gICAgICBpZiAodHlwZW9mIHR5cGVDaGVja2VyICE9PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgIHJldHVybiBuZXcgUHJvcFR5cGVFcnJvcignUHJvcGVydHkgYCcgKyBwcm9wRnVsbE5hbWUgKyAnYCBvZiBjb21wb25lbnQgYCcgKyBjb21wb25lbnROYW1lICsgJ2AgaGFzIGludmFsaWQgUHJvcFR5cGUgbm90YXRpb24gaW5zaWRlIG9iamVjdE9mLicpO1xuICAgICAgfVxuICAgICAgdmFyIHByb3BWYWx1ZSA9IHByb3BzW3Byb3BOYW1lXTtcbiAgICAgIHZhciBwcm9wVHlwZSA9IGdldFByb3BUeXBlKHByb3BWYWx1ZSk7XG4gICAgICBpZiAocHJvcFR5cGUgIT09ICdvYmplY3QnKSB7XG4gICAgICAgIHJldHVybiBuZXcgUHJvcFR5cGVFcnJvcignSW52YWxpZCAnICsgbG9jYXRpb24gKyAnIGAnICsgcHJvcEZ1bGxOYW1lICsgJ2Agb2YgdHlwZSAnICsgKCdgJyArIHByb3BUeXBlICsgJ2Agc3VwcGxpZWQgdG8gYCcgKyBjb21wb25lbnROYW1lICsgJ2AsIGV4cGVjdGVkIGFuIG9iamVjdC4nKSk7XG4gICAgICB9XG4gICAgICBmb3IgKHZhciBrZXkgaW4gcHJvcFZhbHVlKSB7XG4gICAgICAgIGlmIChoYXMocHJvcFZhbHVlLCBrZXkpKSB7XG4gICAgICAgICAgdmFyIGVycm9yID0gdHlwZUNoZWNrZXIocHJvcFZhbHVlLCBrZXksIGNvbXBvbmVudE5hbWUsIGxvY2F0aW9uLCBwcm9wRnVsbE5hbWUgKyAnLicgKyBrZXksIFJlYWN0UHJvcFR5cGVzU2VjcmV0KTtcbiAgICAgICAgICBpZiAoZXJyb3IgaW5zdGFuY2VvZiBFcnJvcikge1xuICAgICAgICAgICAgcmV0dXJuIGVycm9yO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICAgIHJldHVybiBjcmVhdGVDaGFpbmFibGVUeXBlQ2hlY2tlcih2YWxpZGF0ZSk7XG4gIH1cblxuICBmdW5jdGlvbiBjcmVhdGVVbmlvblR5cGVDaGVja2VyKGFycmF5T2ZUeXBlQ2hlY2tlcnMpIHtcbiAgICBpZiAoIUFycmF5LmlzQXJyYXkoYXJyYXlPZlR5cGVDaGVja2VycykpIHtcbiAgICAgIHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicgPyBwcmludFdhcm5pbmcoJ0ludmFsaWQgYXJndW1lbnQgc3VwcGxpZWQgdG8gb25lT2ZUeXBlLCBleHBlY3RlZCBhbiBpbnN0YW5jZSBvZiBhcnJheS4nKSA6IHZvaWQgMDtcbiAgICAgIHJldHVybiBlbXB0eUZ1bmN0aW9uVGhhdFJldHVybnNOdWxsO1xuICAgIH1cblxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgYXJyYXlPZlR5cGVDaGVja2Vycy5sZW5ndGg7IGkrKykge1xuICAgICAgdmFyIGNoZWNrZXIgPSBhcnJheU9mVHlwZUNoZWNrZXJzW2ldO1xuICAgICAgaWYgKHR5cGVvZiBjaGVja2VyICE9PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgIHByaW50V2FybmluZyhcbiAgICAgICAgICAnSW52YWxpZCBhcmd1bWVudCBzdXBwbGllZCB0byBvbmVPZlR5cGUuIEV4cGVjdGVkIGFuIGFycmF5IG9mIGNoZWNrIGZ1bmN0aW9ucywgYnV0ICcgK1xuICAgICAgICAgICdyZWNlaXZlZCAnICsgZ2V0UG9zdGZpeEZvclR5cGVXYXJuaW5nKGNoZWNrZXIpICsgJyBhdCBpbmRleCAnICsgaSArICcuJ1xuICAgICAgICApO1xuICAgICAgICByZXR1cm4gZW1wdHlGdW5jdGlvblRoYXRSZXR1cm5zTnVsbDtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiB2YWxpZGF0ZShwcm9wcywgcHJvcE5hbWUsIGNvbXBvbmVudE5hbWUsIGxvY2F0aW9uLCBwcm9wRnVsbE5hbWUpIHtcbiAgICAgIHZhciBleHBlY3RlZFR5cGVzID0gW107XG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGFycmF5T2ZUeXBlQ2hlY2tlcnMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgdmFyIGNoZWNrZXIgPSBhcnJheU9mVHlwZUNoZWNrZXJzW2ldO1xuICAgICAgICB2YXIgY2hlY2tlclJlc3VsdCA9IGNoZWNrZXIocHJvcHMsIHByb3BOYW1lLCBjb21wb25lbnROYW1lLCBsb2NhdGlvbiwgcHJvcEZ1bGxOYW1lLCBSZWFjdFByb3BUeXBlc1NlY3JldCk7XG4gICAgICAgIGlmIChjaGVja2VyUmVzdWx0ID09IG51bGwpIHtcbiAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgfVxuICAgICAgICBpZiAoY2hlY2tlclJlc3VsdC5kYXRhICYmIGhhcyhjaGVja2VyUmVzdWx0LmRhdGEsICdleHBlY3RlZFR5cGUnKSkge1xuICAgICAgICAgIGV4cGVjdGVkVHlwZXMucHVzaChjaGVja2VyUmVzdWx0LmRhdGEuZXhwZWN0ZWRUeXBlKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgdmFyIGV4cGVjdGVkVHlwZXNNZXNzYWdlID0gKGV4cGVjdGVkVHlwZXMubGVuZ3RoID4gMCkgPyAnLCBleHBlY3RlZCBvbmUgb2YgdHlwZSBbJyArIGV4cGVjdGVkVHlwZXMuam9pbignLCAnKSArICddJzogJyc7XG4gICAgICByZXR1cm4gbmV3IFByb3BUeXBlRXJyb3IoJ0ludmFsaWQgJyArIGxvY2F0aW9uICsgJyBgJyArIHByb3BGdWxsTmFtZSArICdgIHN1cHBsaWVkIHRvICcgKyAoJ2AnICsgY29tcG9uZW50TmFtZSArICdgJyArIGV4cGVjdGVkVHlwZXNNZXNzYWdlICsgJy4nKSk7XG4gICAgfVxuICAgIHJldHVybiBjcmVhdGVDaGFpbmFibGVUeXBlQ2hlY2tlcih2YWxpZGF0ZSk7XG4gIH1cblxuICBmdW5jdGlvbiBjcmVhdGVOb2RlQ2hlY2tlcigpIHtcbiAgICBmdW5jdGlvbiB2YWxpZGF0ZShwcm9wcywgcHJvcE5hbWUsIGNvbXBvbmVudE5hbWUsIGxvY2F0aW9uLCBwcm9wRnVsbE5hbWUpIHtcbiAgICAgIGlmICghaXNOb2RlKHByb3BzW3Byb3BOYW1lXSkpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9wVHlwZUVycm9yKCdJbnZhbGlkICcgKyBsb2NhdGlvbiArICcgYCcgKyBwcm9wRnVsbE5hbWUgKyAnYCBzdXBwbGllZCB0byAnICsgKCdgJyArIGNvbXBvbmVudE5hbWUgKyAnYCwgZXhwZWN0ZWQgYSBSZWFjdE5vZGUuJykpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICAgIHJldHVybiBjcmVhdGVDaGFpbmFibGVUeXBlQ2hlY2tlcih2YWxpZGF0ZSk7XG4gIH1cblxuICBmdW5jdGlvbiBpbnZhbGlkVmFsaWRhdG9yRXJyb3IoY29tcG9uZW50TmFtZSwgbG9jYXRpb24sIHByb3BGdWxsTmFtZSwga2V5LCB0eXBlKSB7XG4gICAgcmV0dXJuIG5ldyBQcm9wVHlwZUVycm9yKFxuICAgICAgKGNvbXBvbmVudE5hbWUgfHwgJ1JlYWN0IGNsYXNzJykgKyAnOiAnICsgbG9jYXRpb24gKyAnIHR5cGUgYCcgKyBwcm9wRnVsbE5hbWUgKyAnLicgKyBrZXkgKyAnYCBpcyBpbnZhbGlkOyAnICtcbiAgICAgICdpdCBtdXN0IGJlIGEgZnVuY3Rpb24sIHVzdWFsbHkgZnJvbSB0aGUgYHByb3AtdHlwZXNgIHBhY2thZ2UsIGJ1dCByZWNlaXZlZCBgJyArIHR5cGUgKyAnYC4nXG4gICAgKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGNyZWF0ZVNoYXBlVHlwZUNoZWNrZXIoc2hhcGVUeXBlcykge1xuICAgIGZ1bmN0aW9uIHZhbGlkYXRlKHByb3BzLCBwcm9wTmFtZSwgY29tcG9uZW50TmFtZSwgbG9jYXRpb24sIHByb3BGdWxsTmFtZSkge1xuICAgICAgdmFyIHByb3BWYWx1ZSA9IHByb3BzW3Byb3BOYW1lXTtcbiAgICAgIHZhciBwcm9wVHlwZSA9IGdldFByb3BUeXBlKHByb3BWYWx1ZSk7XG4gICAgICBpZiAocHJvcFR5cGUgIT09ICdvYmplY3QnKSB7XG4gICAgICAgIHJldHVybiBuZXcgUHJvcFR5cGVFcnJvcignSW52YWxpZCAnICsgbG9jYXRpb24gKyAnIGAnICsgcHJvcEZ1bGxOYW1lICsgJ2Agb2YgdHlwZSBgJyArIHByb3BUeXBlICsgJ2AgJyArICgnc3VwcGxpZWQgdG8gYCcgKyBjb21wb25lbnROYW1lICsgJ2AsIGV4cGVjdGVkIGBvYmplY3RgLicpKTtcbiAgICAgIH1cbiAgICAgIGZvciAodmFyIGtleSBpbiBzaGFwZVR5cGVzKSB7XG4gICAgICAgIHZhciBjaGVja2VyID0gc2hhcGVUeXBlc1trZXldO1xuICAgICAgICBpZiAodHlwZW9mIGNoZWNrZXIgIT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICByZXR1cm4gaW52YWxpZFZhbGlkYXRvckVycm9yKGNvbXBvbmVudE5hbWUsIGxvY2F0aW9uLCBwcm9wRnVsbE5hbWUsIGtleSwgZ2V0UHJlY2lzZVR5cGUoY2hlY2tlcikpO1xuICAgICAgICB9XG4gICAgICAgIHZhciBlcnJvciA9IGNoZWNrZXIocHJvcFZhbHVlLCBrZXksIGNvbXBvbmVudE5hbWUsIGxvY2F0aW9uLCBwcm9wRnVsbE5hbWUgKyAnLicgKyBrZXksIFJlYWN0UHJvcFR5cGVzU2VjcmV0KTtcbiAgICAgICAgaWYgKGVycm9yKSB7XG4gICAgICAgICAgcmV0dXJuIGVycm9yO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gICAgcmV0dXJuIGNyZWF0ZUNoYWluYWJsZVR5cGVDaGVja2VyKHZhbGlkYXRlKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGNyZWF0ZVN0cmljdFNoYXBlVHlwZUNoZWNrZXIoc2hhcGVUeXBlcykge1xuICAgIGZ1bmN0aW9uIHZhbGlkYXRlKHByb3BzLCBwcm9wTmFtZSwgY29tcG9uZW50TmFtZSwgbG9jYXRpb24sIHByb3BGdWxsTmFtZSkge1xuICAgICAgdmFyIHByb3BWYWx1ZSA9IHByb3BzW3Byb3BOYW1lXTtcbiAgICAgIHZhciBwcm9wVHlwZSA9IGdldFByb3BUeXBlKHByb3BWYWx1ZSk7XG4gICAgICBpZiAocHJvcFR5cGUgIT09ICdvYmplY3QnKSB7XG4gICAgICAgIHJldHVybiBuZXcgUHJvcFR5cGVFcnJvcignSW52YWxpZCAnICsgbG9jYXRpb24gKyAnIGAnICsgcHJvcEZ1bGxOYW1lICsgJ2Agb2YgdHlwZSBgJyArIHByb3BUeXBlICsgJ2AgJyArICgnc3VwcGxpZWQgdG8gYCcgKyBjb21wb25lbnROYW1lICsgJ2AsIGV4cGVjdGVkIGBvYmplY3RgLicpKTtcbiAgICAgIH1cbiAgICAgIC8vIFdlIG5lZWQgdG8gY2hlY2sgYWxsIGtleXMgaW4gY2FzZSBzb21lIGFyZSByZXF1aXJlZCBidXQgbWlzc2luZyBmcm9tIHByb3BzLlxuICAgICAgdmFyIGFsbEtleXMgPSBhc3NpZ24oe30sIHByb3BzW3Byb3BOYW1lXSwgc2hhcGVUeXBlcyk7XG4gICAgICBmb3IgKHZhciBrZXkgaW4gYWxsS2V5cykge1xuICAgICAgICB2YXIgY2hlY2tlciA9IHNoYXBlVHlwZXNba2V5XTtcbiAgICAgICAgaWYgKGhhcyhzaGFwZVR5cGVzLCBrZXkpICYmIHR5cGVvZiBjaGVja2VyICE9PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgcmV0dXJuIGludmFsaWRWYWxpZGF0b3JFcnJvcihjb21wb25lbnROYW1lLCBsb2NhdGlvbiwgcHJvcEZ1bGxOYW1lLCBrZXksIGdldFByZWNpc2VUeXBlKGNoZWNrZXIpKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoIWNoZWNrZXIpIHtcbiAgICAgICAgICByZXR1cm4gbmV3IFByb3BUeXBlRXJyb3IoXG4gICAgICAgICAgICAnSW52YWxpZCAnICsgbG9jYXRpb24gKyAnIGAnICsgcHJvcEZ1bGxOYW1lICsgJ2Aga2V5IGAnICsga2V5ICsgJ2Agc3VwcGxpZWQgdG8gYCcgKyBjb21wb25lbnROYW1lICsgJ2AuJyArXG4gICAgICAgICAgICAnXFxuQmFkIG9iamVjdDogJyArIEpTT04uc3RyaW5naWZ5KHByb3BzW3Byb3BOYW1lXSwgbnVsbCwgJyAgJykgK1xuICAgICAgICAgICAgJ1xcblZhbGlkIGtleXM6ICcgKyBKU09OLnN0cmluZ2lmeShPYmplY3Qua2V5cyhzaGFwZVR5cGVzKSwgbnVsbCwgJyAgJylcbiAgICAgICAgICApO1xuICAgICAgICB9XG4gICAgICAgIHZhciBlcnJvciA9IGNoZWNrZXIocHJvcFZhbHVlLCBrZXksIGNvbXBvbmVudE5hbWUsIGxvY2F0aW9uLCBwcm9wRnVsbE5hbWUgKyAnLicgKyBrZXksIFJlYWN0UHJvcFR5cGVzU2VjcmV0KTtcbiAgICAgICAgaWYgKGVycm9yKSB7XG4gICAgICAgICAgcmV0dXJuIGVycm9yO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICByZXR1cm4gY3JlYXRlQ2hhaW5hYmxlVHlwZUNoZWNrZXIodmFsaWRhdGUpO1xuICB9XG5cbiAgZnVuY3Rpb24gaXNOb2RlKHByb3BWYWx1ZSkge1xuICAgIHN3aXRjaCAodHlwZW9mIHByb3BWYWx1ZSkge1xuICAgICAgY2FzZSAnbnVtYmVyJzpcbiAgICAgIGNhc2UgJ3N0cmluZyc6XG4gICAgICBjYXNlICd1bmRlZmluZWQnOlxuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIGNhc2UgJ2Jvb2xlYW4nOlxuICAgICAgICByZXR1cm4gIXByb3BWYWx1ZTtcbiAgICAgIGNhc2UgJ29iamVjdCc6XG4gICAgICAgIGlmIChBcnJheS5pc0FycmF5KHByb3BWYWx1ZSkpIHtcbiAgICAgICAgICByZXR1cm4gcHJvcFZhbHVlLmV2ZXJ5KGlzTm9kZSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHByb3BWYWx1ZSA9PT0gbnVsbCB8fCBpc1ZhbGlkRWxlbWVudChwcm9wVmFsdWUpKSB7XG4gICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgaXRlcmF0b3JGbiA9IGdldEl0ZXJhdG9yRm4ocHJvcFZhbHVlKTtcbiAgICAgICAgaWYgKGl0ZXJhdG9yRm4pIHtcbiAgICAgICAgICB2YXIgaXRlcmF0b3IgPSBpdGVyYXRvckZuLmNhbGwocHJvcFZhbHVlKTtcbiAgICAgICAgICB2YXIgc3RlcDtcbiAgICAgICAgICBpZiAoaXRlcmF0b3JGbiAhPT0gcHJvcFZhbHVlLmVudHJpZXMpIHtcbiAgICAgICAgICAgIHdoaWxlICghKHN0ZXAgPSBpdGVyYXRvci5uZXh0KCkpLmRvbmUpIHtcbiAgICAgICAgICAgICAgaWYgKCFpc05vZGUoc3RlcC52YWx1ZSkpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgLy8gSXRlcmF0b3Igd2lsbCBwcm92aWRlIGVudHJ5IFtrLHZdIHR1cGxlcyByYXRoZXIgdGhhbiB2YWx1ZXMuXG4gICAgICAgICAgICB3aGlsZSAoIShzdGVwID0gaXRlcmF0b3IubmV4dCgpKS5kb25lKSB7XG4gICAgICAgICAgICAgIHZhciBlbnRyeSA9IHN0ZXAudmFsdWU7XG4gICAgICAgICAgICAgIGlmIChlbnRyeSkge1xuICAgICAgICAgICAgICAgIGlmICghaXNOb2RlKGVudHJ5WzFdKSkge1xuICAgICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiBpc1N5bWJvbChwcm9wVHlwZSwgcHJvcFZhbHVlKSB7XG4gICAgLy8gTmF0aXZlIFN5bWJvbC5cbiAgICBpZiAocHJvcFR5cGUgPT09ICdzeW1ib2wnKSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG5cbiAgICAvLyBmYWxzeSB2YWx1ZSBjYW4ndCBiZSBhIFN5bWJvbFxuICAgIGlmICghcHJvcFZhbHVlKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgLy8gMTkuNC4zLjUgU3ltYm9sLnByb3RvdHlwZVtAQHRvU3RyaW5nVGFnXSA9PT0gJ1N5bWJvbCdcbiAgICBpZiAocHJvcFZhbHVlWydAQHRvU3RyaW5nVGFnJ10gPT09ICdTeW1ib2wnKSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG5cbiAgICAvLyBGYWxsYmFjayBmb3Igbm9uLXNwZWMgY29tcGxpYW50IFN5bWJvbHMgd2hpY2ggYXJlIHBvbHlmaWxsZWQuXG4gICAgaWYgKHR5cGVvZiBTeW1ib2wgPT09ICdmdW5jdGlvbicgJiYgcHJvcFZhbHVlIGluc3RhbmNlb2YgU3ltYm9sKSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG5cbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICAvLyBFcXVpdmFsZW50IG9mIGB0eXBlb2ZgIGJ1dCB3aXRoIHNwZWNpYWwgaGFuZGxpbmcgZm9yIGFycmF5IGFuZCByZWdleHAuXG4gIGZ1bmN0aW9uIGdldFByb3BUeXBlKHByb3BWYWx1ZSkge1xuICAgIHZhciBwcm9wVHlwZSA9IHR5cGVvZiBwcm9wVmFsdWU7XG4gICAgaWYgKEFycmF5LmlzQXJyYXkocHJvcFZhbHVlKSkge1xuICAgICAgcmV0dXJuICdhcnJheSc7XG4gICAgfVxuICAgIGlmIChwcm9wVmFsdWUgaW5zdGFuY2VvZiBSZWdFeHApIHtcbiAgICAgIC8vIE9sZCB3ZWJraXRzIChhdCBsZWFzdCB1bnRpbCBBbmRyb2lkIDQuMCkgcmV0dXJuICdmdW5jdGlvbicgcmF0aGVyIHRoYW5cbiAgICAgIC8vICdvYmplY3QnIGZvciB0eXBlb2YgYSBSZWdFeHAuIFdlJ2xsIG5vcm1hbGl6ZSB0aGlzIGhlcmUgc28gdGhhdCAvYmxhL1xuICAgICAgLy8gcGFzc2VzIFByb3BUeXBlcy5vYmplY3QuXG4gICAgICByZXR1cm4gJ29iamVjdCc7XG4gICAgfVxuICAgIGlmIChpc1N5bWJvbChwcm9wVHlwZSwgcHJvcFZhbHVlKSkge1xuICAgICAgcmV0dXJuICdzeW1ib2wnO1xuICAgIH1cbiAgICByZXR1cm4gcHJvcFR5cGU7XG4gIH1cblxuICAvLyBUaGlzIGhhbmRsZXMgbW9yZSB0eXBlcyB0aGFuIGBnZXRQcm9wVHlwZWAuIE9ubHkgdXNlZCBmb3IgZXJyb3IgbWVzc2FnZXMuXG4gIC8vIFNlZSBgY3JlYXRlUHJpbWl0aXZlVHlwZUNoZWNrZXJgLlxuICBmdW5jdGlvbiBnZXRQcmVjaXNlVHlwZShwcm9wVmFsdWUpIHtcbiAgICBpZiAodHlwZW9mIHByb3BWYWx1ZSA9PT0gJ3VuZGVmaW5lZCcgfHwgcHJvcFZhbHVlID09PSBudWxsKSB7XG4gICAgICByZXR1cm4gJycgKyBwcm9wVmFsdWU7XG4gICAgfVxuICAgIHZhciBwcm9wVHlwZSA9IGdldFByb3BUeXBlKHByb3BWYWx1ZSk7XG4gICAgaWYgKHByb3BUeXBlID09PSAnb2JqZWN0Jykge1xuICAgICAgaWYgKHByb3BWYWx1ZSBpbnN0YW5jZW9mIERhdGUpIHtcbiAgICAgICAgcmV0dXJuICdkYXRlJztcbiAgICAgIH0gZWxzZSBpZiAocHJvcFZhbHVlIGluc3RhbmNlb2YgUmVnRXhwKSB7XG4gICAgICAgIHJldHVybiAncmVnZXhwJztcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHByb3BUeXBlO1xuICB9XG5cbiAgLy8gUmV0dXJucyBhIHN0cmluZyB0aGF0IGlzIHBvc3RmaXhlZCB0byBhIHdhcm5pbmcgYWJvdXQgYW4gaW52YWxpZCB0eXBlLlxuICAvLyBGb3IgZXhhbXBsZSwgXCJ1bmRlZmluZWRcIiBvciBcIm9mIHR5cGUgYXJyYXlcIlxuICBmdW5jdGlvbiBnZXRQb3N0Zml4Rm9yVHlwZVdhcm5pbmcodmFsdWUpIHtcbiAgICB2YXIgdHlwZSA9IGdldFByZWNpc2VUeXBlKHZhbHVlKTtcbiAgICBzd2l0Y2ggKHR5cGUpIHtcbiAgICAgIGNhc2UgJ2FycmF5JzpcbiAgICAgIGNhc2UgJ29iamVjdCc6XG4gICAgICAgIHJldHVybiAnYW4gJyArIHR5cGU7XG4gICAgICBjYXNlICdib29sZWFuJzpcbiAgICAgIGNhc2UgJ2RhdGUnOlxuICAgICAgY2FzZSAncmVnZXhwJzpcbiAgICAgICAgcmV0dXJuICdhICcgKyB0eXBlO1xuICAgICAgZGVmYXVsdDpcbiAgICAgICAgcmV0dXJuIHR5cGU7XG4gICAgfVxuICB9XG5cbiAgLy8gUmV0dXJucyBjbGFzcyBuYW1lIG9mIHRoZSBvYmplY3QsIGlmIGFueS5cbiAgZnVuY3Rpb24gZ2V0Q2xhc3NOYW1lKHByb3BWYWx1ZSkge1xuICAgIGlmICghcHJvcFZhbHVlLmNvbnN0cnVjdG9yIHx8ICFwcm9wVmFsdWUuY29uc3RydWN0b3IubmFtZSkge1xuICAgICAgcmV0dXJuIEFOT05ZTU9VUztcbiAgICB9XG4gICAgcmV0dXJuIHByb3BWYWx1ZS5jb25zdHJ1Y3Rvci5uYW1lO1xuICB9XG5cbiAgUmVhY3RQcm9wVHlwZXMuY2hlY2tQcm9wVHlwZXMgPSBjaGVja1Byb3BUeXBlcztcbiAgUmVhY3RQcm9wVHlwZXMucmVzZXRXYXJuaW5nQ2FjaGUgPSBjaGVja1Byb3BUeXBlcy5yZXNldFdhcm5pbmdDYWNoZTtcbiAgUmVhY3RQcm9wVHlwZXMuUHJvcFR5cGVzID0gUmVhY3RQcm9wVHlwZXM7XG5cbiAgcmV0dXJuIFJlYWN0UHJvcFR5cGVzO1xufTtcbiIsICIvKipcbiAqIENvcHlyaWdodCAoYykgMjAxMy1wcmVzZW50LCBGYWNlYm9vaywgSW5jLlxuICpcbiAqIFRoaXMgc291cmNlIGNvZGUgaXMgbGljZW5zZWQgdW5kZXIgdGhlIE1JVCBsaWNlbnNlIGZvdW5kIGluIHRoZVxuICogTElDRU5TRSBmaWxlIGluIHRoZSByb290IGRpcmVjdG9yeSBvZiB0aGlzIHNvdXJjZSB0cmVlLlxuICovXG5cbmlmIChwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nKSB7XG4gIHZhciBSZWFjdElzID0gcmVxdWlyZSgncmVhY3QtaXMnKTtcblxuICAvLyBCeSBleHBsaWNpdGx5IHVzaW5nIGBwcm9wLXR5cGVzYCB5b3UgYXJlIG9wdGluZyBpbnRvIG5ldyBkZXZlbG9wbWVudCBiZWhhdmlvci5cbiAgLy8gaHR0cDovL2ZiLm1lL3Byb3AtdHlwZXMtaW4tcHJvZFxuICB2YXIgdGhyb3dPbkRpcmVjdEFjY2VzcyA9IHRydWU7XG4gIG1vZHVsZS5leHBvcnRzID0gcmVxdWlyZSgnLi9mYWN0b3J5V2l0aFR5cGVDaGVja2VycycpKFJlYWN0SXMuaXNFbGVtZW50LCB0aHJvd09uRGlyZWN0QWNjZXNzKTtcbn0gZWxzZSB7XG4gIC8vIEJ5IGV4cGxpY2l0bHkgdXNpbmcgYHByb3AtdHlwZXNgIHlvdSBhcmUgb3B0aW5nIGludG8gbmV3IHByb2R1Y3Rpb24gYmVoYXZpb3IuXG4gIC8vIGh0dHA6Ly9mYi5tZS9wcm9wLXR5cGVzLWluLXByb2RcbiAgbW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKCcuL2ZhY3RvcnlXaXRoVGhyb3dpbmdTaGltcycpKCk7XG59XG4iLCAiJ3VzZSBzdHJpY3QnO1xuXG52YXIgcmVhY3RJcyA9IHJlcXVpcmUoJ3JlYWN0LWlzJyk7XG5cbi8qKlxuICogQ29weXJpZ2h0IDIwMTUsIFlhaG9vISBJbmMuXG4gKiBDb3B5cmlnaHRzIGxpY2Vuc2VkIHVuZGVyIHRoZSBOZXcgQlNEIExpY2Vuc2UuIFNlZSB0aGUgYWNjb21wYW55aW5nIExJQ0VOU0UgZmlsZSBmb3IgdGVybXMuXG4gKi9cbnZhciBSRUFDVF9TVEFUSUNTID0ge1xuICBjaGlsZENvbnRleHRUeXBlczogdHJ1ZSxcbiAgY29udGV4dFR5cGU6IHRydWUsXG4gIGNvbnRleHRUeXBlczogdHJ1ZSxcbiAgZGVmYXVsdFByb3BzOiB0cnVlLFxuICBkaXNwbGF5TmFtZTogdHJ1ZSxcbiAgZ2V0RGVmYXVsdFByb3BzOiB0cnVlLFxuICBnZXREZXJpdmVkU3RhdGVGcm9tRXJyb3I6IHRydWUsXG4gIGdldERlcml2ZWRTdGF0ZUZyb21Qcm9wczogdHJ1ZSxcbiAgbWl4aW5zOiB0cnVlLFxuICBwcm9wVHlwZXM6IHRydWUsXG4gIHR5cGU6IHRydWVcbn07XG52YXIgS05PV05fU1RBVElDUyA9IHtcbiAgbmFtZTogdHJ1ZSxcbiAgbGVuZ3RoOiB0cnVlLFxuICBwcm90b3R5cGU6IHRydWUsXG4gIGNhbGxlcjogdHJ1ZSxcbiAgY2FsbGVlOiB0cnVlLFxuICBhcmd1bWVudHM6IHRydWUsXG4gIGFyaXR5OiB0cnVlXG59O1xudmFyIEZPUldBUkRfUkVGX1NUQVRJQ1MgPSB7XG4gICckJHR5cGVvZic6IHRydWUsXG4gIHJlbmRlcjogdHJ1ZSxcbiAgZGVmYXVsdFByb3BzOiB0cnVlLFxuICBkaXNwbGF5TmFtZTogdHJ1ZSxcbiAgcHJvcFR5cGVzOiB0cnVlXG59O1xudmFyIE1FTU9fU1RBVElDUyA9IHtcbiAgJyQkdHlwZW9mJzogdHJ1ZSxcbiAgY29tcGFyZTogdHJ1ZSxcbiAgZGVmYXVsdFByb3BzOiB0cnVlLFxuICBkaXNwbGF5TmFtZTogdHJ1ZSxcbiAgcHJvcFR5cGVzOiB0cnVlLFxuICB0eXBlOiB0cnVlXG59O1xudmFyIFRZUEVfU1RBVElDUyA9IHt9O1xuVFlQRV9TVEFUSUNTW3JlYWN0SXMuRm9yd2FyZFJlZl0gPSBGT1JXQVJEX1JFRl9TVEFUSUNTO1xuVFlQRV9TVEFUSUNTW3JlYWN0SXMuTWVtb10gPSBNRU1PX1NUQVRJQ1M7XG5cbmZ1bmN0aW9uIGdldFN0YXRpY3MoY29tcG9uZW50KSB7XG4gIC8vIFJlYWN0IHYxNi4xMSBhbmQgYmVsb3dcbiAgaWYgKHJlYWN0SXMuaXNNZW1vKGNvbXBvbmVudCkpIHtcbiAgICByZXR1cm4gTUVNT19TVEFUSUNTO1xuICB9IC8vIFJlYWN0IHYxNi4xMiBhbmQgYWJvdmVcblxuXG4gIHJldHVybiBUWVBFX1NUQVRJQ1NbY29tcG9uZW50WyckJHR5cGVvZiddXSB8fCBSRUFDVF9TVEFUSUNTO1xufVxuXG52YXIgZGVmaW5lUHJvcGVydHkgPSBPYmplY3QuZGVmaW5lUHJvcGVydHk7XG52YXIgZ2V0T3duUHJvcGVydHlOYW1lcyA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eU5hbWVzO1xudmFyIGdldE93blByb3BlcnR5U3ltYm9scyA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eVN5bWJvbHM7XG52YXIgZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yID0gT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcjtcbnZhciBnZXRQcm90b3R5cGVPZiA9IE9iamVjdC5nZXRQcm90b3R5cGVPZjtcbnZhciBvYmplY3RQcm90b3R5cGUgPSBPYmplY3QucHJvdG90eXBlO1xuZnVuY3Rpb24gaG9pc3ROb25SZWFjdFN0YXRpY3ModGFyZ2V0Q29tcG9uZW50LCBzb3VyY2VDb21wb25lbnQsIGJsYWNrbGlzdCkge1xuICBpZiAodHlwZW9mIHNvdXJjZUNvbXBvbmVudCAhPT0gJ3N0cmluZycpIHtcbiAgICAvLyBkb24ndCBob2lzdCBvdmVyIHN0cmluZyAoaHRtbCkgY29tcG9uZW50c1xuICAgIGlmIChvYmplY3RQcm90b3R5cGUpIHtcbiAgICAgIHZhciBpbmhlcml0ZWRDb21wb25lbnQgPSBnZXRQcm90b3R5cGVPZihzb3VyY2VDb21wb25lbnQpO1xuXG4gICAgICBpZiAoaW5oZXJpdGVkQ29tcG9uZW50ICYmIGluaGVyaXRlZENvbXBvbmVudCAhPT0gb2JqZWN0UHJvdG90eXBlKSB7XG4gICAgICAgIGhvaXN0Tm9uUmVhY3RTdGF0aWNzKHRhcmdldENvbXBvbmVudCwgaW5oZXJpdGVkQ29tcG9uZW50LCBibGFja2xpc3QpO1xuICAgICAgfVxuICAgIH1cblxuICAgIHZhciBrZXlzID0gZ2V0T3duUHJvcGVydHlOYW1lcyhzb3VyY2VDb21wb25lbnQpO1xuXG4gICAgaWYgKGdldE93blByb3BlcnR5U3ltYm9scykge1xuICAgICAga2V5cyA9IGtleXMuY29uY2F0KGdldE93blByb3BlcnR5U3ltYm9scyhzb3VyY2VDb21wb25lbnQpKTtcbiAgICB9XG5cbiAgICB2YXIgdGFyZ2V0U3RhdGljcyA9IGdldFN0YXRpY3ModGFyZ2V0Q29tcG9uZW50KTtcbiAgICB2YXIgc291cmNlU3RhdGljcyA9IGdldFN0YXRpY3Moc291cmNlQ29tcG9uZW50KTtcblxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwga2V5cy5sZW5ndGg7ICsraSkge1xuICAgICAgdmFyIGtleSA9IGtleXNbaV07XG5cbiAgICAgIGlmICghS05PV05fU1RBVElDU1trZXldICYmICEoYmxhY2tsaXN0ICYmIGJsYWNrbGlzdFtrZXldKSAmJiAhKHNvdXJjZVN0YXRpY3MgJiYgc291cmNlU3RhdGljc1trZXldKSAmJiAhKHRhcmdldFN0YXRpY3MgJiYgdGFyZ2V0U3RhdGljc1trZXldKSkge1xuICAgICAgICB2YXIgZGVzY3JpcHRvciA9IGdldE93blByb3BlcnR5RGVzY3JpcHRvcihzb3VyY2VDb21wb25lbnQsIGtleSk7XG5cbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAvLyBBdm9pZCBmYWlsdXJlcyBmcm9tIHJlYWQtb25seSBwcm9wZXJ0aWVzXG4gICAgICAgICAgZGVmaW5lUHJvcGVydHkodGFyZ2V0Q29tcG9uZW50LCBrZXksIGRlc2NyaXB0b3IpO1xuICAgICAgICB9IGNhdGNoIChlKSB7fVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHJldHVybiB0YXJnZXRDb21wb25lbnQ7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gaG9pc3ROb25SZWFjdFN0YXRpY3M7XG4iLCAiLyoqIEBsaWNlbnNlIFJlYWN0IHYxNy4wLjJcbiAqIHJlYWN0LWlzLmRldmVsb3BtZW50LmpzXG4gKlxuICogQ29weXJpZ2h0IChjKSBGYWNlYm9vaywgSW5jLiBhbmQgaXRzIGFmZmlsaWF0ZXMuXG4gKlxuICogVGhpcyBzb3VyY2UgY29kZSBpcyBsaWNlbnNlZCB1bmRlciB0aGUgTUlUIGxpY2Vuc2UgZm91bmQgaW4gdGhlXG4gKiBMSUNFTlNFIGZpbGUgaW4gdGhlIHJvb3QgZGlyZWN0b3J5IG9mIHRoaXMgc291cmNlIHRyZWUuXG4gKi9cblxuJ3VzZSBzdHJpY3QnO1xuXG5pZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09IFwicHJvZHVjdGlvblwiKSB7XG4gIChmdW5jdGlvbigpIHtcbid1c2Ugc3RyaWN0JztcblxuLy8gQVRURU5USU9OXG4vLyBXaGVuIGFkZGluZyBuZXcgc3ltYm9scyB0byB0aGlzIGZpbGUsXG4vLyBQbGVhc2UgY29uc2lkZXIgYWxzbyBhZGRpbmcgdG8gJ3JlYWN0LWRldnRvb2xzLXNoYXJlZC9zcmMvYmFja2VuZC9SZWFjdFN5bWJvbHMnXG4vLyBUaGUgU3ltYm9sIHVzZWQgdG8gdGFnIHRoZSBSZWFjdEVsZW1lbnQtbGlrZSB0eXBlcy4gSWYgdGhlcmUgaXMgbm8gbmF0aXZlIFN5bWJvbFxuLy8gbm9yIHBvbHlmaWxsLCB0aGVuIGEgcGxhaW4gbnVtYmVyIGlzIHVzZWQgZm9yIHBlcmZvcm1hbmNlLlxudmFyIFJFQUNUX0VMRU1FTlRfVFlQRSA9IDB4ZWFjNztcbnZhciBSRUFDVF9QT1JUQUxfVFlQRSA9IDB4ZWFjYTtcbnZhciBSRUFDVF9GUkFHTUVOVF9UWVBFID0gMHhlYWNiO1xudmFyIFJFQUNUX1NUUklDVF9NT0RFX1RZUEUgPSAweGVhY2M7XG52YXIgUkVBQ1RfUFJPRklMRVJfVFlQRSA9IDB4ZWFkMjtcbnZhciBSRUFDVF9QUk9WSURFUl9UWVBFID0gMHhlYWNkO1xudmFyIFJFQUNUX0NPTlRFWFRfVFlQRSA9IDB4ZWFjZTtcbnZhciBSRUFDVF9GT1JXQVJEX1JFRl9UWVBFID0gMHhlYWQwO1xudmFyIFJFQUNUX1NVU1BFTlNFX1RZUEUgPSAweGVhZDE7XG52YXIgUkVBQ1RfU1VTUEVOU0VfTElTVF9UWVBFID0gMHhlYWQ4O1xudmFyIFJFQUNUX01FTU9fVFlQRSA9IDB4ZWFkMztcbnZhciBSRUFDVF9MQVpZX1RZUEUgPSAweGVhZDQ7XG52YXIgUkVBQ1RfQkxPQ0tfVFlQRSA9IDB4ZWFkOTtcbnZhciBSRUFDVF9TRVJWRVJfQkxPQ0tfVFlQRSA9IDB4ZWFkYTtcbnZhciBSRUFDVF9GVU5EQU1FTlRBTF9UWVBFID0gMHhlYWQ1O1xudmFyIFJFQUNUX1NDT1BFX1RZUEUgPSAweGVhZDc7XG52YXIgUkVBQ1RfT1BBUVVFX0lEX1RZUEUgPSAweGVhZTA7XG52YXIgUkVBQ1RfREVCVUdfVFJBQ0lOR19NT0RFX1RZUEUgPSAweGVhZTE7XG52YXIgUkVBQ1RfT0ZGU0NSRUVOX1RZUEUgPSAweGVhZTI7XG52YXIgUkVBQ1RfTEVHQUNZX0hJRERFTl9UWVBFID0gMHhlYWUzO1xuXG5pZiAodHlwZW9mIFN5bWJvbCA9PT0gJ2Z1bmN0aW9uJyAmJiBTeW1ib2wuZm9yKSB7XG4gIHZhciBzeW1ib2xGb3IgPSBTeW1ib2wuZm9yO1xuICBSRUFDVF9FTEVNRU5UX1RZUEUgPSBzeW1ib2xGb3IoJ3JlYWN0LmVsZW1lbnQnKTtcbiAgUkVBQ1RfUE9SVEFMX1RZUEUgPSBzeW1ib2xGb3IoJ3JlYWN0LnBvcnRhbCcpO1xuICBSRUFDVF9GUkFHTUVOVF9UWVBFID0gc3ltYm9sRm9yKCdyZWFjdC5mcmFnbWVudCcpO1xuICBSRUFDVF9TVFJJQ1RfTU9ERV9UWVBFID0gc3ltYm9sRm9yKCdyZWFjdC5zdHJpY3RfbW9kZScpO1xuICBSRUFDVF9QUk9GSUxFUl9UWVBFID0gc3ltYm9sRm9yKCdyZWFjdC5wcm9maWxlcicpO1xuICBSRUFDVF9QUk9WSURFUl9UWVBFID0gc3ltYm9sRm9yKCdyZWFjdC5wcm92aWRlcicpO1xuICBSRUFDVF9DT05URVhUX1RZUEUgPSBzeW1ib2xGb3IoJ3JlYWN0LmNvbnRleHQnKTtcbiAgUkVBQ1RfRk9SV0FSRF9SRUZfVFlQRSA9IHN5bWJvbEZvcigncmVhY3QuZm9yd2FyZF9yZWYnKTtcbiAgUkVBQ1RfU1VTUEVOU0VfVFlQRSA9IHN5bWJvbEZvcigncmVhY3Quc3VzcGVuc2UnKTtcbiAgUkVBQ1RfU1VTUEVOU0VfTElTVF9UWVBFID0gc3ltYm9sRm9yKCdyZWFjdC5zdXNwZW5zZV9saXN0Jyk7XG4gIFJFQUNUX01FTU9fVFlQRSA9IHN5bWJvbEZvcigncmVhY3QubWVtbycpO1xuICBSRUFDVF9MQVpZX1RZUEUgPSBzeW1ib2xGb3IoJ3JlYWN0LmxhenknKTtcbiAgUkVBQ1RfQkxPQ0tfVFlQRSA9IHN5bWJvbEZvcigncmVhY3QuYmxvY2snKTtcbiAgUkVBQ1RfU0VSVkVSX0JMT0NLX1RZUEUgPSBzeW1ib2xGb3IoJ3JlYWN0LnNlcnZlci5ibG9jaycpO1xuICBSRUFDVF9GVU5EQU1FTlRBTF9UWVBFID0gc3ltYm9sRm9yKCdyZWFjdC5mdW5kYW1lbnRhbCcpO1xuICBSRUFDVF9TQ09QRV9UWVBFID0gc3ltYm9sRm9yKCdyZWFjdC5zY29wZScpO1xuICBSRUFDVF9PUEFRVUVfSURfVFlQRSA9IHN5bWJvbEZvcigncmVhY3Qub3BhcXVlLmlkJyk7XG4gIFJFQUNUX0RFQlVHX1RSQUNJTkdfTU9ERV9UWVBFID0gc3ltYm9sRm9yKCdyZWFjdC5kZWJ1Z190cmFjZV9tb2RlJyk7XG4gIFJFQUNUX09GRlNDUkVFTl9UWVBFID0gc3ltYm9sRm9yKCdyZWFjdC5vZmZzY3JlZW4nKTtcbiAgUkVBQ1RfTEVHQUNZX0hJRERFTl9UWVBFID0gc3ltYm9sRm9yKCdyZWFjdC5sZWdhY3lfaGlkZGVuJyk7XG59XG5cbi8vIEZpbHRlciBjZXJ0YWluIERPTSBhdHRyaWJ1dGVzIChlLmcuIHNyYywgaHJlZikgaWYgdGhlaXIgdmFsdWVzIGFyZSBlbXB0eSBzdHJpbmdzLlxuXG52YXIgZW5hYmxlU2NvcGVBUEkgPSBmYWxzZTsgLy8gRXhwZXJpbWVudGFsIENyZWF0ZSBFdmVudCBIYW5kbGUgQVBJLlxuXG5mdW5jdGlvbiBpc1ZhbGlkRWxlbWVudFR5cGUodHlwZSkge1xuICBpZiAodHlwZW9mIHR5cGUgPT09ICdzdHJpbmcnIHx8IHR5cGVvZiB0eXBlID09PSAnZnVuY3Rpb24nKSB7XG4gICAgcmV0dXJuIHRydWU7XG4gIH0gLy8gTm90ZTogdHlwZW9mIG1pZ2h0IGJlIG90aGVyIHRoYW4gJ3N5bWJvbCcgb3IgJ251bWJlcicgKGUuZy4gaWYgaXQncyBhIHBvbHlmaWxsKS5cblxuXG4gIGlmICh0eXBlID09PSBSRUFDVF9GUkFHTUVOVF9UWVBFIHx8IHR5cGUgPT09IFJFQUNUX1BST0ZJTEVSX1RZUEUgfHwgdHlwZSA9PT0gUkVBQ1RfREVCVUdfVFJBQ0lOR19NT0RFX1RZUEUgfHwgdHlwZSA9PT0gUkVBQ1RfU1RSSUNUX01PREVfVFlQRSB8fCB0eXBlID09PSBSRUFDVF9TVVNQRU5TRV9UWVBFIHx8IHR5cGUgPT09IFJFQUNUX1NVU1BFTlNFX0xJU1RfVFlQRSB8fCB0eXBlID09PSBSRUFDVF9MRUdBQ1lfSElEREVOX1RZUEUgfHwgZW5hYmxlU2NvcGVBUEkgKSB7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cblxuICBpZiAodHlwZW9mIHR5cGUgPT09ICdvYmplY3QnICYmIHR5cGUgIT09IG51bGwpIHtcbiAgICBpZiAodHlwZS4kJHR5cGVvZiA9PT0gUkVBQ1RfTEFaWV9UWVBFIHx8IHR5cGUuJCR0eXBlb2YgPT09IFJFQUNUX01FTU9fVFlQRSB8fCB0eXBlLiQkdHlwZW9mID09PSBSRUFDVF9QUk9WSURFUl9UWVBFIHx8IHR5cGUuJCR0eXBlb2YgPT09IFJFQUNUX0NPTlRFWFRfVFlQRSB8fCB0eXBlLiQkdHlwZW9mID09PSBSRUFDVF9GT1JXQVJEX1JFRl9UWVBFIHx8IHR5cGUuJCR0eXBlb2YgPT09IFJFQUNUX0ZVTkRBTUVOVEFMX1RZUEUgfHwgdHlwZS4kJHR5cGVvZiA9PT0gUkVBQ1RfQkxPQ0tfVFlQRSB8fCB0eXBlWzBdID09PSBSRUFDVF9TRVJWRVJfQkxPQ0tfVFlQRSkge1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIGZhbHNlO1xufVxuXG5mdW5jdGlvbiB0eXBlT2Yob2JqZWN0KSB7XG4gIGlmICh0eXBlb2Ygb2JqZWN0ID09PSAnb2JqZWN0JyAmJiBvYmplY3QgIT09IG51bGwpIHtcbiAgICB2YXIgJCR0eXBlb2YgPSBvYmplY3QuJCR0eXBlb2Y7XG5cbiAgICBzd2l0Y2ggKCQkdHlwZW9mKSB7XG4gICAgICBjYXNlIFJFQUNUX0VMRU1FTlRfVFlQRTpcbiAgICAgICAgdmFyIHR5cGUgPSBvYmplY3QudHlwZTtcblxuICAgICAgICBzd2l0Y2ggKHR5cGUpIHtcbiAgICAgICAgICBjYXNlIFJFQUNUX0ZSQUdNRU5UX1RZUEU6XG4gICAgICAgICAgY2FzZSBSRUFDVF9QUk9GSUxFUl9UWVBFOlxuICAgICAgICAgIGNhc2UgUkVBQ1RfU1RSSUNUX01PREVfVFlQRTpcbiAgICAgICAgICBjYXNlIFJFQUNUX1NVU1BFTlNFX1RZUEU6XG4gICAgICAgICAgY2FzZSBSRUFDVF9TVVNQRU5TRV9MSVNUX1RZUEU6XG4gICAgICAgICAgICByZXR1cm4gdHlwZTtcblxuICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICB2YXIgJCR0eXBlb2ZUeXBlID0gdHlwZSAmJiB0eXBlLiQkdHlwZW9mO1xuXG4gICAgICAgICAgICBzd2l0Y2ggKCQkdHlwZW9mVHlwZSkge1xuICAgICAgICAgICAgICBjYXNlIFJFQUNUX0NPTlRFWFRfVFlQRTpcbiAgICAgICAgICAgICAgY2FzZSBSRUFDVF9GT1JXQVJEX1JFRl9UWVBFOlxuICAgICAgICAgICAgICBjYXNlIFJFQUNUX0xBWllfVFlQRTpcbiAgICAgICAgICAgICAgY2FzZSBSRUFDVF9NRU1PX1RZUEU6XG4gICAgICAgICAgICAgIGNhc2UgUkVBQ1RfUFJPVklERVJfVFlQRTpcbiAgICAgICAgICAgICAgICByZXR1cm4gJCR0eXBlb2ZUeXBlO1xuXG4gICAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgcmV0dXJuICQkdHlwZW9mO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgIH1cblxuICAgICAgY2FzZSBSRUFDVF9QT1JUQUxfVFlQRTpcbiAgICAgICAgcmV0dXJuICQkdHlwZW9mO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiB1bmRlZmluZWQ7XG59XG52YXIgQ29udGV4dENvbnN1bWVyID0gUkVBQ1RfQ09OVEVYVF9UWVBFO1xudmFyIENvbnRleHRQcm92aWRlciA9IFJFQUNUX1BST1ZJREVSX1RZUEU7XG52YXIgRWxlbWVudCA9IFJFQUNUX0VMRU1FTlRfVFlQRTtcbnZhciBGb3J3YXJkUmVmID0gUkVBQ1RfRk9SV0FSRF9SRUZfVFlQRTtcbnZhciBGcmFnbWVudCA9IFJFQUNUX0ZSQUdNRU5UX1RZUEU7XG52YXIgTGF6eSA9IFJFQUNUX0xBWllfVFlQRTtcbnZhciBNZW1vID0gUkVBQ1RfTUVNT19UWVBFO1xudmFyIFBvcnRhbCA9IFJFQUNUX1BPUlRBTF9UWVBFO1xudmFyIFByb2ZpbGVyID0gUkVBQ1RfUFJPRklMRVJfVFlQRTtcbnZhciBTdHJpY3RNb2RlID0gUkVBQ1RfU1RSSUNUX01PREVfVFlQRTtcbnZhciBTdXNwZW5zZSA9IFJFQUNUX1NVU1BFTlNFX1RZUEU7XG52YXIgaGFzV2FybmVkQWJvdXREZXByZWNhdGVkSXNBc3luY01vZGUgPSBmYWxzZTtcbnZhciBoYXNXYXJuZWRBYm91dERlcHJlY2F0ZWRJc0NvbmN1cnJlbnRNb2RlID0gZmFsc2U7IC8vIEFzeW5jTW9kZSBzaG91bGQgYmUgZGVwcmVjYXRlZFxuXG5mdW5jdGlvbiBpc0FzeW5jTW9kZShvYmplY3QpIHtcbiAge1xuICAgIGlmICghaGFzV2FybmVkQWJvdXREZXByZWNhdGVkSXNBc3luY01vZGUpIHtcbiAgICAgIGhhc1dhcm5lZEFib3V0RGVwcmVjYXRlZElzQXN5bmNNb2RlID0gdHJ1ZTsgLy8gVXNpbmcgY29uc29sZVsnd2FybiddIHRvIGV2YWRlIEJhYmVsIGFuZCBFU0xpbnRcblxuICAgICAgY29uc29sZVsnd2FybiddKCdUaGUgUmVhY3RJcy5pc0FzeW5jTW9kZSgpIGFsaWFzIGhhcyBiZWVuIGRlcHJlY2F0ZWQsICcgKyAnYW5kIHdpbGwgYmUgcmVtb3ZlZCBpbiBSZWFjdCAxOCsuJyk7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIGZhbHNlO1xufVxuZnVuY3Rpb24gaXNDb25jdXJyZW50TW9kZShvYmplY3QpIHtcbiAge1xuICAgIGlmICghaGFzV2FybmVkQWJvdXREZXByZWNhdGVkSXNDb25jdXJyZW50TW9kZSkge1xuICAgICAgaGFzV2FybmVkQWJvdXREZXByZWNhdGVkSXNDb25jdXJyZW50TW9kZSA9IHRydWU7IC8vIFVzaW5nIGNvbnNvbGVbJ3dhcm4nXSB0byBldmFkZSBCYWJlbCBhbmQgRVNMaW50XG5cbiAgICAgIGNvbnNvbGVbJ3dhcm4nXSgnVGhlIFJlYWN0SXMuaXNDb25jdXJyZW50TW9kZSgpIGFsaWFzIGhhcyBiZWVuIGRlcHJlY2F0ZWQsICcgKyAnYW5kIHdpbGwgYmUgcmVtb3ZlZCBpbiBSZWFjdCAxOCsuJyk7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIGZhbHNlO1xufVxuZnVuY3Rpb24gaXNDb250ZXh0Q29uc3VtZXIob2JqZWN0KSB7XG4gIHJldHVybiB0eXBlT2Yob2JqZWN0KSA9PT0gUkVBQ1RfQ09OVEVYVF9UWVBFO1xufVxuZnVuY3Rpb24gaXNDb250ZXh0UHJvdmlkZXIob2JqZWN0KSB7XG4gIHJldHVybiB0eXBlT2Yob2JqZWN0KSA9PT0gUkVBQ1RfUFJPVklERVJfVFlQRTtcbn1cbmZ1bmN0aW9uIGlzRWxlbWVudChvYmplY3QpIHtcbiAgcmV0dXJuIHR5cGVvZiBvYmplY3QgPT09ICdvYmplY3QnICYmIG9iamVjdCAhPT0gbnVsbCAmJiBvYmplY3QuJCR0eXBlb2YgPT09IFJFQUNUX0VMRU1FTlRfVFlQRTtcbn1cbmZ1bmN0aW9uIGlzRm9yd2FyZFJlZihvYmplY3QpIHtcbiAgcmV0dXJuIHR5cGVPZihvYmplY3QpID09PSBSRUFDVF9GT1JXQVJEX1JFRl9UWVBFO1xufVxuZnVuY3Rpb24gaXNGcmFnbWVudChvYmplY3QpIHtcbiAgcmV0dXJuIHR5cGVPZihvYmplY3QpID09PSBSRUFDVF9GUkFHTUVOVF9UWVBFO1xufVxuZnVuY3Rpb24gaXNMYXp5KG9iamVjdCkge1xuICByZXR1cm4gdHlwZU9mKG9iamVjdCkgPT09IFJFQUNUX0xBWllfVFlQRTtcbn1cbmZ1bmN0aW9uIGlzTWVtbyhvYmplY3QpIHtcbiAgcmV0dXJuIHR5cGVPZihvYmplY3QpID09PSBSRUFDVF9NRU1PX1RZUEU7XG59XG5mdW5jdGlvbiBpc1BvcnRhbChvYmplY3QpIHtcbiAgcmV0dXJuIHR5cGVPZihvYmplY3QpID09PSBSRUFDVF9QT1JUQUxfVFlQRTtcbn1cbmZ1bmN0aW9uIGlzUHJvZmlsZXIob2JqZWN0KSB7XG4gIHJldHVybiB0eXBlT2Yob2JqZWN0KSA9PT0gUkVBQ1RfUFJPRklMRVJfVFlQRTtcbn1cbmZ1bmN0aW9uIGlzU3RyaWN0TW9kZShvYmplY3QpIHtcbiAgcmV0dXJuIHR5cGVPZihvYmplY3QpID09PSBSRUFDVF9TVFJJQ1RfTU9ERV9UWVBFO1xufVxuZnVuY3Rpb24gaXNTdXNwZW5zZShvYmplY3QpIHtcbiAgcmV0dXJuIHR5cGVPZihvYmplY3QpID09PSBSRUFDVF9TVVNQRU5TRV9UWVBFO1xufVxuXG5leHBvcnRzLkNvbnRleHRDb25zdW1lciA9IENvbnRleHRDb25zdW1lcjtcbmV4cG9ydHMuQ29udGV4dFByb3ZpZGVyID0gQ29udGV4dFByb3ZpZGVyO1xuZXhwb3J0cy5FbGVtZW50ID0gRWxlbWVudDtcbmV4cG9ydHMuRm9yd2FyZFJlZiA9IEZvcndhcmRSZWY7XG5leHBvcnRzLkZyYWdtZW50ID0gRnJhZ21lbnQ7XG5leHBvcnRzLkxhenkgPSBMYXp5O1xuZXhwb3J0cy5NZW1vID0gTWVtbztcbmV4cG9ydHMuUG9ydGFsID0gUG9ydGFsO1xuZXhwb3J0cy5Qcm9maWxlciA9IFByb2ZpbGVyO1xuZXhwb3J0cy5TdHJpY3RNb2RlID0gU3RyaWN0TW9kZTtcbmV4cG9ydHMuU3VzcGVuc2UgPSBTdXNwZW5zZTtcbmV4cG9ydHMuaXNBc3luY01vZGUgPSBpc0FzeW5jTW9kZTtcbmV4cG9ydHMuaXNDb25jdXJyZW50TW9kZSA9IGlzQ29uY3VycmVudE1vZGU7XG5leHBvcnRzLmlzQ29udGV4dENvbnN1bWVyID0gaXNDb250ZXh0Q29uc3VtZXI7XG5leHBvcnRzLmlzQ29udGV4dFByb3ZpZGVyID0gaXNDb250ZXh0UHJvdmlkZXI7XG5leHBvcnRzLmlzRWxlbWVudCA9IGlzRWxlbWVudDtcbmV4cG9ydHMuaXNGb3J3YXJkUmVmID0gaXNGb3J3YXJkUmVmO1xuZXhwb3J0cy5pc0ZyYWdtZW50ID0gaXNGcmFnbWVudDtcbmV4cG9ydHMuaXNMYXp5ID0gaXNMYXp5O1xuZXhwb3J0cy5pc01lbW8gPSBpc01lbW87XG5leHBvcnRzLmlzUG9ydGFsID0gaXNQb3J0YWw7XG5leHBvcnRzLmlzUHJvZmlsZXIgPSBpc1Byb2ZpbGVyO1xuZXhwb3J0cy5pc1N0cmljdE1vZGUgPSBpc1N0cmljdE1vZGU7XG5leHBvcnRzLmlzU3VzcGVuc2UgPSBpc1N1c3BlbnNlO1xuZXhwb3J0cy5pc1ZhbGlkRWxlbWVudFR5cGUgPSBpc1ZhbGlkRWxlbWVudFR5cGU7XG5leHBvcnRzLnR5cGVPZiA9IHR5cGVPZjtcbiAgfSkoKTtcbn1cbiIsICIndXNlIHN0cmljdCc7XG5cbmlmIChwcm9jZXNzLmVudi5OT0RFX0VOViA9PT0gJ3Byb2R1Y3Rpb24nKSB7XG4gIG1vZHVsZS5leHBvcnRzID0gcmVxdWlyZSgnLi9janMvcmVhY3QtaXMucHJvZHVjdGlvbi5taW4uanMnKTtcbn0gZWxzZSB7XG4gIG1vZHVsZS5leHBvcnRzID0gcmVxdWlyZSgnLi9janMvcmVhY3QtaXMuZGV2ZWxvcG1lbnQuanMnKTtcbn1cbiIsICIvKipcbiAqIExvZGFzaCAoQ3VzdG9tIEJ1aWxkKSA8aHR0cHM6Ly9sb2Rhc2guY29tLz5cbiAqIEJ1aWxkOiBgbG9kYXNoIG1vZHVsYXJpemUgZXhwb3J0cz1cIm5wbVwiIC1vIC4vYFxuICogQ29weXJpZ2h0IEpTIEZvdW5kYXRpb24gYW5kIG90aGVyIGNvbnRyaWJ1dG9ycyA8aHR0cHM6Ly9qcy5mb3VuZGF0aW9uLz5cbiAqIFJlbGVhc2VkIHVuZGVyIE1JVCBsaWNlbnNlIDxodHRwczovL2xvZGFzaC5jb20vbGljZW5zZT5cbiAqIEJhc2VkIG9uIFVuZGVyc2NvcmUuanMgMS44LjMgPGh0dHA6Ly91bmRlcnNjb3JlanMub3JnL0xJQ0VOU0U+XG4gKiBDb3B5cmlnaHQgSmVyZW15IEFzaGtlbmFzLCBEb2N1bWVudENsb3VkIGFuZCBJbnZlc3RpZ2F0aXZlIFJlcG9ydGVycyAmIEVkaXRvcnNcbiAqL1xuXG4vKiogYE9iamVjdCN0b1N0cmluZ2AgcmVzdWx0IHJlZmVyZW5jZXMuICovXG52YXIgYXN5bmNUYWcgPSAnW29iamVjdCBBc3luY0Z1bmN0aW9uXScsXG4gICAgZnVuY1RhZyA9ICdbb2JqZWN0IEZ1bmN0aW9uXScsXG4gICAgZ2VuVGFnID0gJ1tvYmplY3QgR2VuZXJhdG9yRnVuY3Rpb25dJyxcbiAgICBudWxsVGFnID0gJ1tvYmplY3QgTnVsbF0nLFxuICAgIHByb3h5VGFnID0gJ1tvYmplY3QgUHJveHldJyxcbiAgICB1bmRlZmluZWRUYWcgPSAnW29iamVjdCBVbmRlZmluZWRdJztcblxuLyoqIERldGVjdCBmcmVlIHZhcmlhYmxlIGBnbG9iYWxgIGZyb20gTm9kZS5qcy4gKi9cbnZhciBmcmVlR2xvYmFsID0gdHlwZW9mIGdsb2JhbCA9PSAnb2JqZWN0JyAmJiBnbG9iYWwgJiYgZ2xvYmFsLk9iamVjdCA9PT0gT2JqZWN0ICYmIGdsb2JhbDtcblxuLyoqIERldGVjdCBmcmVlIHZhcmlhYmxlIGBzZWxmYC4gKi9cbnZhciBmcmVlU2VsZiA9IHR5cGVvZiBzZWxmID09ICdvYmplY3QnICYmIHNlbGYgJiYgc2VsZi5PYmplY3QgPT09IE9iamVjdCAmJiBzZWxmO1xuXG4vKiogVXNlZCBhcyBhIHJlZmVyZW5jZSB0byB0aGUgZ2xvYmFsIG9iamVjdC4gKi9cbnZhciByb290ID0gZnJlZUdsb2JhbCB8fCBmcmVlU2VsZiB8fCBGdW5jdGlvbigncmV0dXJuIHRoaXMnKSgpO1xuXG4vKiogVXNlZCBmb3IgYnVpbHQtaW4gbWV0aG9kIHJlZmVyZW5jZXMuICovXG52YXIgb2JqZWN0UHJvdG8gPSBPYmplY3QucHJvdG90eXBlO1xuXG4vKiogVXNlZCB0byBjaGVjayBvYmplY3RzIGZvciBvd24gcHJvcGVydGllcy4gKi9cbnZhciBoYXNPd25Qcm9wZXJ0eSA9IG9iamVjdFByb3RvLmhhc093blByb3BlcnR5O1xuXG4vKipcbiAqIFVzZWQgdG8gcmVzb2x2ZSB0aGVcbiAqIFtgdG9TdHJpbmdUYWdgXShodHRwOi8vZWNtYS1pbnRlcm5hdGlvbmFsLm9yZy9lY21hLTI2Mi83LjAvI3NlYy1vYmplY3QucHJvdG90eXBlLnRvc3RyaW5nKVxuICogb2YgdmFsdWVzLlxuICovXG52YXIgbmF0aXZlT2JqZWN0VG9TdHJpbmcgPSBvYmplY3RQcm90by50b1N0cmluZztcblxuLyoqIEJ1aWx0LWluIHZhbHVlIHJlZmVyZW5jZXMuICovXG52YXIgU3ltYm9sID0gcm9vdC5TeW1ib2wsXG4gICAgc3ltVG9TdHJpbmdUYWcgPSBTeW1ib2wgPyBTeW1ib2wudG9TdHJpbmdUYWcgOiB1bmRlZmluZWQ7XG5cbi8qKlxuICogVGhlIGJhc2UgaW1wbGVtZW50YXRpb24gb2YgYGdldFRhZ2Agd2l0aG91dCBmYWxsYmFja3MgZm9yIGJ1Z2d5IGVudmlyb25tZW50cy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gcXVlcnkuXG4gKiBAcmV0dXJucyB7c3RyaW5nfSBSZXR1cm5zIHRoZSBgdG9TdHJpbmdUYWdgLlxuICovXG5mdW5jdGlvbiBiYXNlR2V0VGFnKHZhbHVlKSB7XG4gIGlmICh2YWx1ZSA9PSBudWxsKSB7XG4gICAgcmV0dXJuIHZhbHVlID09PSB1bmRlZmluZWQgPyB1bmRlZmluZWRUYWcgOiBudWxsVGFnO1xuICB9XG4gIHJldHVybiAoc3ltVG9TdHJpbmdUYWcgJiYgc3ltVG9TdHJpbmdUYWcgaW4gT2JqZWN0KHZhbHVlKSlcbiAgICA/IGdldFJhd1RhZyh2YWx1ZSlcbiAgICA6IG9iamVjdFRvU3RyaW5nKHZhbHVlKTtcbn1cblxuLyoqXG4gKiBBIHNwZWNpYWxpemVkIHZlcnNpb24gb2YgYGJhc2VHZXRUYWdgIHdoaWNoIGlnbm9yZXMgYFN5bWJvbC50b1N0cmluZ1RhZ2AgdmFsdWVzLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBxdWVyeS5cbiAqIEByZXR1cm5zIHtzdHJpbmd9IFJldHVybnMgdGhlIHJhdyBgdG9TdHJpbmdUYWdgLlxuICovXG5mdW5jdGlvbiBnZXRSYXdUYWcodmFsdWUpIHtcbiAgdmFyIGlzT3duID0gaGFzT3duUHJvcGVydHkuY2FsbCh2YWx1ZSwgc3ltVG9TdHJpbmdUYWcpLFxuICAgICAgdGFnID0gdmFsdWVbc3ltVG9TdHJpbmdUYWddO1xuXG4gIHRyeSB7XG4gICAgdmFsdWVbc3ltVG9TdHJpbmdUYWddID0gdW5kZWZpbmVkO1xuICAgIHZhciB1bm1hc2tlZCA9IHRydWU7XG4gIH0gY2F0Y2ggKGUpIHt9XG5cbiAgdmFyIHJlc3VsdCA9IG5hdGl2ZU9iamVjdFRvU3RyaW5nLmNhbGwodmFsdWUpO1xuICBpZiAodW5tYXNrZWQpIHtcbiAgICBpZiAoaXNPd24pIHtcbiAgICAgIHZhbHVlW3N5bVRvU3RyaW5nVGFnXSA9IHRhZztcbiAgICB9IGVsc2Uge1xuICAgICAgZGVsZXRlIHZhbHVlW3N5bVRvU3RyaW5nVGFnXTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxuLyoqXG4gKiBDb252ZXJ0cyBgdmFsdWVgIHRvIGEgc3RyaW5nIHVzaW5nIGBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nYC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY29udmVydC5cbiAqIEByZXR1cm5zIHtzdHJpbmd9IFJldHVybnMgdGhlIGNvbnZlcnRlZCBzdHJpbmcuXG4gKi9cbmZ1bmN0aW9uIG9iamVjdFRvU3RyaW5nKHZhbHVlKSB7XG4gIHJldHVybiBuYXRpdmVPYmplY3RUb1N0cmluZy5jYWxsKHZhbHVlKTtcbn1cblxuLyoqXG4gKiBDaGVja3MgaWYgYHZhbHVlYCBpcyBjbGFzc2lmaWVkIGFzIGEgYEZ1bmN0aW9uYCBvYmplY3QuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSAwLjEuMFxuICogQGNhdGVnb3J5IExhbmdcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgYSBmdW5jdGlvbiwgZWxzZSBgZmFsc2VgLlxuICogQGV4YW1wbGVcbiAqXG4gKiBfLmlzRnVuY3Rpb24oXyk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc0Z1bmN0aW9uKC9hYmMvKTtcbiAqIC8vID0+IGZhbHNlXG4gKi9cbmZ1bmN0aW9uIGlzRnVuY3Rpb24odmFsdWUpIHtcbiAgaWYgKCFpc09iamVjdCh2YWx1ZSkpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbiAgLy8gVGhlIHVzZSBvZiBgT2JqZWN0I3RvU3RyaW5nYCBhdm9pZHMgaXNzdWVzIHdpdGggdGhlIGB0eXBlb2ZgIG9wZXJhdG9yXG4gIC8vIGluIFNhZmFyaSA5IHdoaWNoIHJldHVybnMgJ29iamVjdCcgZm9yIHR5cGVkIGFycmF5cyBhbmQgb3RoZXIgY29uc3RydWN0b3JzLlxuICB2YXIgdGFnID0gYmFzZUdldFRhZyh2YWx1ZSk7XG4gIHJldHVybiB0YWcgPT0gZnVuY1RhZyB8fCB0YWcgPT0gZ2VuVGFnIHx8IHRhZyA9PSBhc3luY1RhZyB8fCB0YWcgPT0gcHJveHlUYWc7XG59XG5cbi8qKlxuICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgdGhlXG4gKiBbbGFuZ3VhZ2UgdHlwZV0oaHR0cDovL3d3dy5lY21hLWludGVybmF0aW9uYWwub3JnL2VjbWEtMjYyLzcuMC8jc2VjLWVjbWFzY3JpcHQtbGFuZ3VhZ2UtdHlwZXMpXG4gKiBvZiBgT2JqZWN0YC4gKGUuZy4gYXJyYXlzLCBmdW5jdGlvbnMsIG9iamVjdHMsIHJlZ2V4ZXMsIGBuZXcgTnVtYmVyKDApYCwgYW5kIGBuZXcgU3RyaW5nKCcnKWApXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSAwLjEuMFxuICogQGNhdGVnb3J5IExhbmdcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgYW4gb2JqZWN0LCBlbHNlIGBmYWxzZWAuXG4gKiBAZXhhbXBsZVxuICpcbiAqIF8uaXNPYmplY3Qoe30pO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNPYmplY3QoWzEsIDIsIDNdKTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzT2JqZWN0KF8ubm9vcCk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc09iamVjdChudWxsKTtcbiAqIC8vID0+IGZhbHNlXG4gKi9cbmZ1bmN0aW9uIGlzT2JqZWN0KHZhbHVlKSB7XG4gIHZhciB0eXBlID0gdHlwZW9mIHZhbHVlO1xuICByZXR1cm4gdmFsdWUgIT0gbnVsbCAmJiAodHlwZSA9PSAnb2JqZWN0JyB8fCB0eXBlID09ICdmdW5jdGlvbicpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGlzRnVuY3Rpb247XG4iLCAiaW1wb3J0ICdAL2dsb2JhbC5jc3MnXG5pbXBvcnQgdHlwZSB7IFBhZ2VDb25maWcgfSBmcm9tICcuL3R5cGVzJztcbmltcG9ydCB7IExpbmssIE91dGxldCwgdXNlUGFyYW1zLCB1c2VTZWFyY2hQYXJhbXMsIHVzZUxvY2F0aW9uLCB1c2VOYXZpZ2F0ZSB9IGZyb20gJ0BpY2UvcnVudGltZS9yb3V0ZXInO1xuaW1wb3J0IHsgZGVmaW5lQXBwQ29uZmlnLCB1c2VBcHBEYXRhLCB1c2VEYXRhLCB1c2VDb25maWcsIE1ldGEsIFRpdGxlLCBMaW5rcywgU2NyaXB0cywgRGF0YSwgTWFpbiwgaGlzdG9yeSwgS2VlcEFsaXZlT3V0bGV0LCB1c2VNb3VudGVkLCBDbGllbnRPbmx5LCBkZWZpbmVEYXRhTG9hZGVyLCBkZWZpbmVTZXJ2ZXJEYXRhTG9hZGVyLCBkZWZpbmVTdGF0aWNEYXRhTG9hZGVyIH0gZnJvbSAnQGljZS9ydW50aW1lJztcbmltcG9ydCB1c2VSZXF1ZXN0IGZyb20gJ0BpY2UvcGx1Z2luLXJlcXVlc3QvaG9va3MnO1xuaW1wb3J0IHJlcXVlc3QgZnJvbSAnQGljZS9wbHVnaW4tcmVxdWVzdC9yZXF1ZXN0JztcbmltcG9ydCB7IGNyZWF0ZVN0b3JlLCBjcmVhdGVNb2RlbCB9IGZyb20gJ0BpY2UvcGx1Z2luLXN0b3JlL2VzbS9ydW50aW1lJztcbmltcG9ydCB7IHdpdGhBdXRoLCB1c2VBdXRoIH0gZnJvbSAnQGljZS9wbHVnaW4tYXV0aC9lc20vcnVudGltZSc7XG5cbmZ1bmN0aW9uIGRlZmluZVBhZ2VDb25maWcocGFnZUNvbmZpZzogKCkgPT4gUGFnZUNvbmZpZyk6ICgpID0+IFBhZ2VDb25maWcge1xuICByZXR1cm4gcGFnZUNvbmZpZztcbn1cblxuZXhwb3J0IHtcbiAgZGVmaW5lUGFnZUNvbmZpZyxcbiAgTGluayxcbiAgT3V0bGV0LFxuICB1c2VQYXJhbXMsXG4gIHVzZVNlYXJjaFBhcmFtcyxcbiAgdXNlTG9jYXRpb24sXG4gIHVzZU5hdmlnYXRlLFxuICBkZWZpbmVBcHBDb25maWcsXG4gIHVzZUFwcERhdGEsXG4gIHVzZURhdGEsXG4gIHVzZUNvbmZpZyxcbiAgTWV0YSxcbiAgVGl0bGUsXG4gIExpbmtzLFxuICBTY3JpcHRzLFxuICBEYXRhLFxuICBNYWluLFxuICBoaXN0b3J5LFxuICBLZWVwQWxpdmVPdXRsZXQsXG4gIHVzZU1vdW50ZWQsXG4gIENsaWVudE9ubHksXG4gIGRlZmluZURhdGFMb2FkZXIsXG4gIGRlZmluZVNlcnZlckRhdGFMb2FkZXIsXG4gIGRlZmluZVN0YXRpY0RhdGFMb2FkZXIsXG4gIHVzZVJlcXVlc3QsXG4gIHJlcXVlc3QsXG4gIGNyZWF0ZVN0b3JlLFxuICBjcmVhdGVNb2RlbCxcbiAgd2l0aEF1dGgsXG4gIHVzZUF1dGgsfTtcblxuZXhwb3J0ICogZnJvbSAnLi90eXBlcyc7XG4iLCAiaW1wb3J0IGF4aW9zIGZyb20gJ2F4aW9zJztcbi8vIGh0dHBzOi8vZ2l0aHViLmNvbS9heGlvcy9heGlvcyNyZXF1ZXN0LWNvbmZpZ1xuY29uc3QgREVGQVVMVF9DT05GSUcgPSB7fTtcbmNvbnN0IGF4aW9zSW5zdGFuY2VzID0ge1xuICAgIGRlZmF1bHQ6IGF4aW9zLmNyZWF0ZShERUZBVUxUX0NPTkZJRyksXG59O1xuLyoqXG4gKiBDcmVhdGUgYW4gYXhpb3MgaW5zdGFuY2UuXG4gKiBAcGFyYW0gaW5zdGFuY2VOYW1lXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGVBeGlvc0luc3RhbmNlKGluc3RhbmNlTmFtZSkge1xuICAgIGlmIChpbnN0YW5jZU5hbWUpIHtcbiAgICAgICAgaWYgKGF4aW9zSW5zdGFuY2VzW2luc3RhbmNlTmFtZV0pIHtcbiAgICAgICAgICAgIHJldHVybiBheGlvc0luc3RhbmNlcztcbiAgICAgICAgfVxuICAgICAgICBheGlvc0luc3RhbmNlc1tpbnN0YW5jZU5hbWVdID0gYXhpb3MuY3JlYXRlKERFRkFVTFRfQ09ORklHKTtcbiAgICB9XG4gICAgcmV0dXJuIGF4aW9zSW5zdGFuY2VzO1xufVxuZXhwb3J0IGZ1bmN0aW9uIHNldEF4aW9zSW5zdGFuY2UocmVxdWVzdENvbmZpZywgYXhpb3NJbnN0YW5jZSkge1xuICAgIGNvbnN0IHsgaW50ZXJjZXB0b3JzID0ge30sIC4uLnJlcXVlc3RPcHRpb25zIH0gPSByZXF1ZXN0Q29uZmlnO1xuICAgIE9iamVjdC5rZXlzKHJlcXVlc3RPcHRpb25zKS5mb3JFYWNoKGtleSA9PiB7XG4gICAgICAgIGF4aW9zSW5zdGFuY2UuZGVmYXVsdHNba2V5XSA9IHJlcXVlc3RPcHRpb25zW2tleV07XG4gICAgfSk7XG4gICAgZnVuY3Rpb24gaXNFeGlzdChoYW5kbGVycywgW2Z1bGZpbGxlZCwgcmVqZWN0ZWRdKSB7XG4gICAgICAgIHJldHVybiBoYW5kbGVycy5zb21lKGl0ZW0gPT4gaXRlbS5mdWxmaWxsZWQgPT09IGZ1bGZpbGxlZCAmJiBpdGVtLnJlamVjdGVkID09PSByZWplY3RlZCk7XG4gICAgfVxuICAgIC8vIEFkZCByZXF1ZXN0IGludGVyY2VwdG9yLlxuICAgIGlmIChpbnRlcmNlcHRvcnMucmVxdWVzdCkge1xuICAgICAgICBjb25zdCBbZnVsZmlsbGVkLCByZWplY3RlZF0gPSBbXG4gICAgICAgICAgICBpbnRlcmNlcHRvcnMucmVxdWVzdC5vbkNvbmZpZyB8fCBmdW5jdGlvbiAoY29uZmlnKSB7IHJldHVybiBjb25maWc7IH0sXG4gICAgICAgICAgICBpbnRlcmNlcHRvcnMucmVxdWVzdC5vbkVycm9yIHx8IGZ1bmN0aW9uIChlcnJvcikgeyByZXR1cm4gUHJvbWlzZS5yZWplY3QoZXJyb3IpOyB9LFxuICAgICAgICBdO1xuICAgICAgICBpZiAoaXNFeGlzdChheGlvc0luc3RhbmNlLmludGVyY2VwdG9ycy5yZXF1ZXN0LmhhbmRsZXJzLCBbZnVsZmlsbGVkLCByZWplY3RlZF0pKVxuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICBheGlvc0luc3RhbmNlLmludGVyY2VwdG9ycy5yZXF1ZXN0LnVzZShmdWxmaWxsZWQsIHJlamVjdGVkKTtcbiAgICB9XG4gICAgLy8gQWRkIHJlc3BvbnNlIGludGVyY2VwdG9yLlxuICAgIGlmIChpbnRlcmNlcHRvcnMucmVzcG9uc2UpIHtcbiAgICAgICAgY29uc3QgW2Z1bGZpbGxlZCwgcmVqZWN0ZWRdID0gW1xuICAgICAgICAgICAgaW50ZXJjZXB0b3JzLnJlc3BvbnNlLm9uQ29uZmlnIHx8IGZ1bmN0aW9uIChyZXNwb25zZSkgeyByZXR1cm4gcmVzcG9uc2U7IH0sXG4gICAgICAgICAgICBpbnRlcmNlcHRvcnMucmVzcG9uc2Uub25FcnJvciB8fCBmdW5jdGlvbiAoZXJyb3IpIHsgcmV0dXJuIFByb21pc2UucmVqZWN0KGVycm9yKTsgfSxcbiAgICAgICAgXTtcbiAgICAgICAgaWYgKGlzRXhpc3QoYXhpb3NJbnN0YW5jZS5pbnRlcmNlcHRvcnMucmVzcG9uc2UuaGFuZGxlcnMsIFtmdWxmaWxsZWQsIHJlamVjdGVkXSkpXG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIGF4aW9zSW5zdGFuY2UuaW50ZXJjZXB0b3JzLnJlc3BvbnNlLnVzZShmdWxmaWxsZWQsIHJlamVjdGVkKTtcbiAgICB9XG59XG4vKipcbiAqIFJlcXVlc3QsIHJldHVybiByZXNwb25zZS5kYXRhIHwgcmVzcG9uc2VcbiAqIEBwYXJhbSBvcHRpb25zIFJlZmVyZW5jZTogaHR0cHM6Ly9naXRodWIuY29tL2F4aW9zL2F4aW9zI3JlcXVlc3QtY29uZmlnXG4gKi9cbmNvbnN0IHJlcXVlc3QgPSBhc3luYyBmdW5jdGlvbiAob3B0aW9ucykge1xuICAgIHRyeSB7XG4gICAgICAgIGNvbnN0IGluc3RhbmNlTmFtZSA9IG9wdGlvbnMuaW5zdGFuY2VOYW1lID8gb3B0aW9ucy5pbnN0YW5jZU5hbWUgOiAnZGVmYXVsdCc7XG4gICAgICAgIGNvbnN0IGF4aW9zSW5zdGFuY2UgPSBjcmVhdGVBeGlvc0luc3RhbmNlKClbaW5zdGFuY2VOYW1lXTtcbiAgICAgICAgaWYgKCEodHlwZW9mIGF4aW9zSW5zdGFuY2UgPT09ICdmdW5jdGlvbicpKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYHVua25vd24gJHtpbnN0YW5jZU5hbWV9IGluIHJlcXVlc3QgbWV0aG9kYCk7XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCBheGlvc0luc3RhbmNlKG9wdGlvbnMpO1xuICAgICAgICBpZiAoYXhpb3NJbnN0YW5jZS5kZWZhdWx0cy53aXRoRnVsbFJlc3BvbnNlIHx8IG9wdGlvbnMud2l0aEZ1bGxSZXNwb25zZSkge1xuICAgICAgICAgICAgcmV0dXJuIHJlc3BvbnNlO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiByZXNwb25zZS5kYXRhO1xuICAgIH1cbiAgICBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgY29uc29sZS5lcnJvcihlcnJvcik7XG4gICAgICAgIHRocm93IGVycm9yO1xuICAgIH1cbn07XG4vLyBQcm92aWRlIGFsaWFzZXMgZm9yIHN1cHBvcnRlZCByZXF1ZXN0IG1ldGhvZHNcblsnZGVsZXRlJywgJ2dldCcsICdoZWFkJywgJ29wdGlvbnMnXS5mb3JFYWNoKChtZXRob2QpID0+IHtcbiAgICByZXF1ZXN0W21ldGhvZF0gPSBmdW5jdGlvbiAodXJsLCBjb25maWcpIHtcbiAgICAgICAgcmV0dXJuIHJlcXVlc3QoT2JqZWN0LmFzc2lnbihjb25maWcgfHwge30sIHtcbiAgICAgICAgICAgIG1ldGhvZCxcbiAgICAgICAgICAgIHVybCxcbiAgICAgICAgfSkpO1xuICAgIH07XG59KTtcblsncG9zdCcsICdwdXQnLCAncGF0Y2gnXS5mb3JFYWNoKChtZXRob2QpID0+IHtcbiAgICByZXF1ZXN0W21ldGhvZF0gPSBmdW5jdGlvbiAodXJsLCBkYXRhLCBjb25maWcpIHtcbiAgICAgICAgcmV0dXJuIHJlcXVlc3QoT2JqZWN0LmFzc2lnbihjb25maWcgfHwge30sIHtcbiAgICAgICAgICAgIG1ldGhvZCxcbiAgICAgICAgICAgIHVybCxcbiAgICAgICAgICAgIGRhdGEsXG4gICAgICAgIH0pKTtcbiAgICB9O1xufSk7XG5yZXF1ZXN0LkNhbmNlbFRva2VuID0gYXhpb3MuQ2FuY2VsVG9rZW47XG5yZXF1ZXN0LmlzQ2FuY2VsID0gYXhpb3MuaXNDYW5jZWw7XG5leHBvcnQgZGVmYXVsdCByZXF1ZXN0O1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9cmVxdWVzdC5qcy5tYXAiLCAiaW1wb3J0ICogYXMgUmVhY3QgZnJvbSAncmVhY3QnO1xuaW1wb3J0IHsgUEFHRV9TVE9SRV9JTklUSUFMX1NUQVRFUywgUEFHRV9TVE9SRV9QUk9WSURFUiB9IGZyb20gJy4vY29uc3RhbnRzLmpzJztcbmNvbnN0IEVYUE9SVF9DT05GSUdfTkFNRSA9ICdzdG9yZUNvbmZpZyc7XG5jb25zdCBydW50aW1lID0gYXN5bmMgKHsgYXBwQ29udGV4dCwgYWRkV3JhcHBlciwgYWRkUHJvdmlkZXIsIHVzZUFwcENvbnRleHQgfSwgcnVudGltZU9wdGlvbnMpID0+IHtcbiAgICBjb25zdCB7IGFwcEV4cG9ydCwgYXBwRGF0YSB9ID0gYXBwQ29udGV4dDtcbiAgICBjb25zdCBleHBvcnRlZCA9IGFwcEV4cG9ydFtFWFBPUlRfQ09ORklHX05BTUVdO1xuICAgIGNvbnN0IHN0b3JlQ29uZmlnID0gKHR5cGVvZiBleHBvcnRlZCA9PT0gJ2Z1bmN0aW9uJyA/IGF3YWl0IGV4cG9ydGVkKGFwcERhdGEpIDogZXhwb3J0ZWQpIHx8IHt9O1xuICAgIGNvbnN0IHsgaW5pdGlhbFN0YXRlcyB9ID0gc3RvcmVDb25maWc7XG4gICAgLy8gQWRkIGFwcCBzdG9yZSA8UHJvdmlkZXIgLz4uXG4gICAgY29uc3QgU3RvcmVQcm92aWRlciA9ICh7IGNoaWxkcmVuIH0pID0+IHtcbiAgICAgICAgdmFyIF9hO1xuICAgICAgICBpZiAoKF9hID0gcnVudGltZU9wdGlvbnMgPT09IG51bGwgfHwgcnVudGltZU9wdGlvbnMgPT09IHZvaWQgMCA/IHZvaWQgMCA6IHJ1bnRpbWVPcHRpb25zLmFwcFN0b3JlKSA9PT0gbnVsbCB8fCBfYSA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2EuUHJvdmlkZXIpIHtcbiAgICAgICAgICAgIGNvbnN0IHsgUHJvdmlkZXIgfSA9IHJ1bnRpbWVPcHRpb25zLmFwcFN0b3JlO1xuICAgICAgICAgICAgcmV0dXJuIChSZWFjdC5jcmVhdGVFbGVtZW50KFByb3ZpZGVyLCB7IGluaXRpYWxTdGF0ZXM6IGluaXRpYWxTdGF0ZXMgfSwgY2hpbGRyZW4pKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gUmVhY3QuY3JlYXRlRWxlbWVudChSZWFjdC5GcmFnbWVudCwgbnVsbCwgY2hpbGRyZW4pO1xuICAgIH07XG4gICAgYWRkUHJvdmlkZXIoU3RvcmVQcm92aWRlcik7XG4gICAgLy8gQWRkIHBhZ2Ugc3RvcmUgPFByb3ZpZGVyIC8+LlxuICAgIGNvbnN0IFN0b3JlUHJvdmlkZXJXcmFwcGVyID0gKHsgY2hpbGRyZW4sIHJvdXRlSWQgfSkgPT4ge1xuICAgICAgICBjb25zdCB7IHJvdXRlTW9kdWxlcyB9ID0gdXNlQXBwQ29udGV4dCgpO1xuICAgICAgICBjb25zdCByb3V0ZU1vZHVsZSA9IHJvdXRlTW9kdWxlc1tyb3V0ZUlkXTtcbiAgICAgICAgaWYgKHJvdXRlTW9kdWxlW1BBR0VfU1RPUkVfUFJPVklERVJdKSB7XG4gICAgICAgICAgICBjb25zdCBQcm92aWRlciA9IHJvdXRlTW9kdWxlW1BBR0VfU1RPUkVfUFJPVklERVJdO1xuICAgICAgICAgICAgY29uc3QgaW5pdGlhbFN0YXRlcyA9IHJvdXRlTW9kdWxlW1BBR0VfU1RPUkVfSU5JVElBTF9TVEFURVNdO1xuICAgICAgICAgICAgaWYgKGluaXRpYWxTdGF0ZXMpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gUmVhY3QuY3JlYXRlRWxlbWVudChQcm92aWRlciwgeyBpbml0aWFsU3RhdGVzOiBpbml0aWFsU3RhdGVzIH0sIGNoaWxkcmVuKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBSZWFjdC5jcmVhdGVFbGVtZW50KFByb3ZpZGVyLCBudWxsLCBjaGlsZHJlbik7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIFJlYWN0LmNyZWF0ZUVsZW1lbnQoUmVhY3QuRnJhZ21lbnQsIG51bGwsIGNoaWxkcmVuKTtcbiAgICB9O1xuICAgIGFkZFdyYXBwZXIoU3RvcmVQcm92aWRlcldyYXBwZXIsIHRydWUpO1xufTtcbmV4cG9ydCBkZWZhdWx0IHJ1bnRpbWU7XG5leHBvcnQgeyBjcmVhdGVNb2RlbCwgY3JlYXRlU3RvcmUgfSBmcm9tICdAaWNlL3N0b3JlJztcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPXJ1bnRpbWUuanMubWFwIiwgImV4cG9ydCBjb25zdCBQQUdFX1NUT1JFX01PRFVMRSA9ICdfX1BBR0VfU1RPUkVfXyc7XG5leHBvcnQgY29uc3QgUEFHRV9TVE9SRV9QUk9WSURFUiA9ICdfX1BBR0VfU1RPUkVfUFJPVklERVJfXyc7XG5leHBvcnQgY29uc3QgUEFHRV9TVE9SRV9JTklUSUFMX1NUQVRFUyA9ICdfX1BBR0VfU1RPUkVfSU5JVElBTF9TVEFURVNfXyc7XG4vLyMgc291cmNlTWFwcGluZ1VSTD1jb25zdGFudHMuanMubWFwIiwgInZhciBfX2Fzc2lnbiA9ICh0aGlzICYmIHRoaXMuX19hc3NpZ24pIHx8IGZ1bmN0aW9uICgpIHtcbiAgICBfX2Fzc2lnbiA9IE9iamVjdC5hc3NpZ24gfHwgZnVuY3Rpb24odCkge1xuICAgICAgICBmb3IgKHZhciBzLCBpID0gMSwgbiA9IGFyZ3VtZW50cy5sZW5ndGg7IGkgPCBuOyBpKyspIHtcbiAgICAgICAgICAgIHMgPSBhcmd1bWVudHNbaV07XG4gICAgICAgICAgICBmb3IgKHZhciBwIGluIHMpIGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwocywgcCkpXG4gICAgICAgICAgICAgICAgdFtwXSA9IHNbcF07XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHQ7XG4gICAgfTtcbiAgICByZXR1cm4gX19hc3NpZ24uYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbn07XG5pbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xuaW1wb3J0IHRodW5rTWlkZGxld2FyZSBmcm9tICdyZWR1eC10aHVuayc7XG5pbXBvcnQgSWNlc3RvcmUgZnJvbSAnLi9pY2VzdG9yZSc7XG5pbXBvcnQgbWVyZ2VDb25maWcgZnJvbSAnLi91dGlscy9tZXJnZUNvbmZpZyc7XG5pbXBvcnQgY3JlYXRlUHJvdmlkZXJQbHVnaW4gZnJvbSAnLi9wbHVnaW5zL3Byb3ZpZGVyJztcbmltcG9ydCBjcmVhdGVSZWR1eEhvb2tzUGx1Z2luIGZyb20gJy4vcGx1Z2lucy9yZWR1eEhvb2tzJztcbmltcG9ydCBjcmVhdGVNb2RlbEFwaXNQbHVnaW4gZnJvbSAnLi9wbHVnaW5zL21vZGVsQXBpcyc7XG5pbXBvcnQgY3JlYXRlSW1tZXJQbHVnaW4gZnJvbSAnLi9wbHVnaW5zL2ltbWVyJztcbmltcG9ydCBjcmVhdGVMb2FkaW5nUGx1Z2luIGZyb20gJy4vcGx1Z2lucy9sb2FkaW5nJztcbmltcG9ydCBjcmVhdGVFcnJvclBsdWdpbiBmcm9tICcuL3BsdWdpbnMvZXJyb3InO1xuaW1wb3J0IHsgY2hlY2tNb2RlbHMgfSBmcm9tICcuL3V0aWxzL2NoZWNrTW9kZWxzJztcbmltcG9ydCBhcHBlbmRSZWR1Y2VycyBmcm9tICcuL3V0aWxzL2FwcGVuZFJlZHVjZXJzJztcbi8vIGluY3JlbWVudGVyIHVzZWQgdG8gcHJvdmlkZSBhIHN0b3JlIG5hbWUgaWYgbm9uZSBleGlzdHNcbnZhciBjb3VudCA9IDA7XG4vKipcbiAqIGNyZWF0ZU9yaWdpblN0b3JlXG4gKlxuICogZ2VuZXJhdGVzIGEgSWNlc3RvcmUgd2l0aCBhIHNldCBjb25maWd1cmF0aW9uXG4gKiBAcGFyYW0gY29uZmlnXG4gKi9cbnZhciBpbml0ID0gZnVuY3Rpb24gKGluaXRDb25maWcpIHtcbiAgICBpZiAoaW5pdENvbmZpZyA9PT0gdm9pZCAwKSB7IGluaXRDb25maWcgPSB7fTsgfVxuICAgIHZhciBuYW1lID0gaW5pdENvbmZpZy5uYW1lIHx8IGNvdW50LnRvU3RyaW5nKCk7XG4gICAgY291bnQgKz0gMTtcbiAgICB2YXIgY29uZmlnID0gbWVyZ2VDb25maWcoX19hc3NpZ24oX19hc3NpZ24oe30sIGluaXRDb25maWcpLCB7IG5hbWU6IG5hbWUgfSkpO1xuICAgIHJldHVybiBuZXcgSWNlc3RvcmUoY29uZmlnKS5pbml0KCk7XG59O1xuLyoqXG4gKiBjcmVhdGVTdG9yZVxuICpcbiAqIGdlbmVyYXRlcyBhIHByZXNldCBJY2VzdG9yZVxuICogQHBhcmFtIG1vZGVsc1xuICogQHBhcmFtIGluaXRDb25maWdcbiAqL1xuZXhwb3J0IHZhciBjcmVhdGVTdG9yZSA9IGZ1bmN0aW9uIChtb2RlbHMsIGluaXRDb25maWcpIHtcbiAgICB2YXIgX2EgPSBpbml0Q29uZmlnIHx8IHt9LCBkaXNhYmxlSW1tZXIgPSBfYS5kaXNhYmxlSW1tZXIsIGRpc2FibGVMb2FkaW5nID0gX2EuZGlzYWJsZUxvYWRpbmcsIGRpc2FibGVFcnJvciA9IF9hLmRpc2FibGVFcnJvciwgX2IgPSBfYS5wbHVnaW5zLCBwbHVnaW5zID0gX2IgPT09IHZvaWQgMCA/IFtdIDogX2IsIF9jID0gX2EucmVkdXgsIHJlZHV4ID0gX2MgPT09IHZvaWQgMCA/IHt9IDogX2M7XG4gICAgdmFyIG1pZGRsZXdhcmVzID0gcmVkdXgubWlkZGxld2FyZXMgfHwgW107XG4gICAgdmFyIGNvbnRleHQgPSBSZWFjdC5jcmVhdGVDb250ZXh0KG51bGwpO1xuICAgIC8vIGRlZmF1bHRzIG1pZGRsZXdhcmVzXG4gICAgbWlkZGxld2FyZXMucHVzaCh0aHVua01pZGRsZXdhcmUpO1xuICAgIC8vIGRlZmF1bHRzIHBsdWdpbnNcbiAgICBwbHVnaW5zLnB1c2goY3JlYXRlUHJvdmlkZXJQbHVnaW4oeyBjb250ZXh0OiBjb250ZXh0IH0pKTtcbiAgICBwbHVnaW5zLnB1c2goY3JlYXRlUmVkdXhIb29rc1BsdWdpbih7IGNvbnRleHQ6IGNvbnRleHQgfSkpO1xuICAgIHBsdWdpbnMucHVzaChjcmVhdGVNb2RlbEFwaXNQbHVnaW4oKSk7XG4gICAgLy8gaHR0cHM6Ly9naXRodWIuY29tL2ljZS1sYWIvaWNlc3RvcmUvaXNzdWVzLzk0XG4gICAgLy8gVE9ETzogZml4IGVycm9yICYgbG9hZGluZyBwbHVnaW4gaW1tZXIgcHJvYmxlbVxuICAgIHZhciBpbW1lckJsYWNrbGlzdCA9IFtdO1xuICAgIGlmICghZGlzYWJsZUxvYWRpbmcpIHtcbiAgICAgICAgcGx1Z2lucy5wdXNoKGNyZWF0ZUxvYWRpbmdQbHVnaW4oKSk7XG4gICAgICAgIGltbWVyQmxhY2tsaXN0LnB1c2goJ2xvYWRpbmcnKTtcbiAgICB9XG4gICAgaWYgKCFkaXNhYmxlRXJyb3IpIHtcbiAgICAgICAgcGx1Z2lucy5wdXNoKGNyZWF0ZUVycm9yUGx1Z2luKCkpO1xuICAgICAgICBpbW1lckJsYWNrbGlzdC5wdXNoKCdlcnJvcicpO1xuICAgIH1cbiAgICBpZiAoIWRpc2FibGVJbW1lcikge1xuICAgICAgICBwbHVnaW5zLnB1c2goY3JlYXRlSW1tZXJQbHVnaW4oeyBibGFja2xpc3Q6IGltbWVyQmxhY2tsaXN0IH0pKTtcbiAgICB9XG4gICAgLy8gVE9ETzogZGlzYWJsZSBpbiBwcm9kdWN0aW9uP1xuICAgIGNoZWNrTW9kZWxzKG1vZGVscyk7XG4gICAgLy8gY29tcGF0aWJpbGl0eSBoYW5kbGluZ1xuICAgIHZhciB3cmFwcGVkTW9kZWxzID0gYXBwZW5kUmVkdWNlcnMobW9kZWxzKTtcbiAgICB2YXIgc3RvcmUgPSBpbml0KHtcbiAgICAgICAgbW9kZWxzOiB3cmFwcGVkTW9kZWxzLFxuICAgICAgICBwbHVnaW5zOiBwbHVnaW5zLFxuICAgICAgICByZWR1eDogX19hc3NpZ24oX19hc3NpZ24oe30sIHJlZHV4KSwgeyBtaWRkbGV3YXJlczogbWlkZGxld2FyZXMgfSksXG4gICAgfSk7XG4gICAgcmV0dXJuIHN0b3JlO1xufTtcbmV4cG9ydCB2YXIgd2l0aE1vZGVsID0gZnVuY3Rpb24gKG1vZGVsLCBtYXBNb2RlbFRvUHJvcHMsIGluaXRDb25maWcpIHtcbiAgICB2YXIgX2E7XG4gICAgdmFyIG1vZGVsTmFtZSA9ICdtb2RlbCc7XG4gICAgbWFwTW9kZWxUb1Byb3BzID0gKG1hcE1vZGVsVG9Qcm9wcyB8fCAoZnVuY3Rpb24gKG1vZGVsQXBpcykge1xuICAgICAgICB2YXIgX2E7XG4gICAgICAgIHJldHVybiAoX2EgPSB7fSwgX2FbbW9kZWxOYW1lXSA9IG1vZGVsQXBpcywgX2EpO1xuICAgIH0pKTtcbiAgICB2YXIgc3RvcmUgPSBjcmVhdGVTdG9yZSgoX2EgPSB7fSwgX2FbbW9kZWxOYW1lXSA9IG1vZGVsLCBfYSksIGluaXRDb25maWcpO1xuICAgIHZhciBQcm92aWRlciA9IHN0b3JlLlByb3ZpZGVyLCBnZXRNb2RlbEFQSXMgPSBzdG9yZS5nZXRNb2RlbEFQSXM7XG4gICAgdmFyIG1vZGVsQXBpcyA9IGdldE1vZGVsQVBJcyhtb2RlbE5hbWUpO1xuICAgIHZhciB3aXRoUHJvcHMgPSBtYXBNb2RlbFRvUHJvcHMobW9kZWxBcGlzKTtcbiAgICByZXR1cm4gZnVuY3Rpb24gKENvbXBvbmVudCkge1xuICAgICAgICByZXR1cm4gZnVuY3Rpb24gKHByb3BzKSB7XG4gICAgICAgICAgICByZXR1cm4gKFJlYWN0LmNyZWF0ZUVsZW1lbnQoUHJvdmlkZXIsIG51bGwsXG4gICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChDb21wb25lbnQsIF9fYXNzaWduKHt9LCB3aXRoUHJvcHMsIHByb3BzKSkpKTtcbiAgICAgICAgfTtcbiAgICB9O1xufTtcbmV4cG9ydCBkZWZhdWx0IGNyZWF0ZVN0b3JlO1xuZXhwb3J0ICogZnJvbSAnLi90eXBlcyc7XG4iLCAiLyoqIEEgZnVuY3Rpb24gdGhhdCBhY2NlcHRzIGEgcG90ZW50aWFsIFwiZXh0cmEgYXJndW1lbnRcIiB2YWx1ZSB0byBiZSBpbmplY3RlZCBsYXRlcixcclxuICogYW5kIHJldHVybnMgYW4gaW5zdGFuY2Ugb2YgdGhlIHRodW5rIG1pZGRsZXdhcmUgdGhhdCB1c2VzIHRoYXQgdmFsdWVcclxuICovXG5mdW5jdGlvbiBjcmVhdGVUaHVua01pZGRsZXdhcmUoZXh0cmFBcmd1bWVudCkge1xuICAvLyBTdGFuZGFyZCBSZWR1eCBtaWRkbGV3YXJlIGRlZmluaXRpb24gcGF0dGVybjpcbiAgLy8gU2VlOiBodHRwczovL3JlZHV4LmpzLm9yZy90dXRvcmlhbHMvZnVuZGFtZW50YWxzL3BhcnQtNC1zdG9yZSN3cml0aW5nLWN1c3RvbS1taWRkbGV3YXJlXG4gIHZhciBtaWRkbGV3YXJlID0gZnVuY3Rpb24gbWlkZGxld2FyZShfcmVmKSB7XG4gICAgdmFyIGRpc3BhdGNoID0gX3JlZi5kaXNwYXRjaCxcbiAgICAgICAgZ2V0U3RhdGUgPSBfcmVmLmdldFN0YXRlO1xuICAgIHJldHVybiBmdW5jdGlvbiAobmV4dCkge1xuICAgICAgcmV0dXJuIGZ1bmN0aW9uIChhY3Rpb24pIHtcbiAgICAgICAgLy8gVGhlIHRodW5rIG1pZGRsZXdhcmUgbG9va3MgZm9yIGFueSBmdW5jdGlvbnMgdGhhdCB3ZXJlIHBhc3NlZCB0byBgc3RvcmUuZGlzcGF0Y2hgLlxuICAgICAgICAvLyBJZiB0aGlzIFwiYWN0aW9uXCIgaXMgcmVhbGx5IGEgZnVuY3Rpb24sIGNhbGwgaXQgYW5kIHJldHVybiB0aGUgcmVzdWx0LlxuICAgICAgICBpZiAodHlwZW9mIGFjdGlvbiA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgIC8vIEluamVjdCB0aGUgc3RvcmUncyBgZGlzcGF0Y2hgIGFuZCBgZ2V0U3RhdGVgIG1ldGhvZHMsIGFzIHdlbGwgYXMgYW55IFwiZXh0cmEgYXJnXCJcbiAgICAgICAgICByZXR1cm4gYWN0aW9uKGRpc3BhdGNoLCBnZXRTdGF0ZSwgZXh0cmFBcmd1bWVudCk7XG4gICAgICAgIH0gLy8gT3RoZXJ3aXNlLCBwYXNzIHRoZSBhY3Rpb24gZG93biB0aGUgbWlkZGxld2FyZSBjaGFpbiBhcyB1c3VhbFxuXG5cbiAgICAgICAgcmV0dXJuIG5leHQoYWN0aW9uKTtcbiAgICAgIH07XG4gICAgfTtcbiAgfTtcblxuICByZXR1cm4gbWlkZGxld2FyZTtcbn1cblxudmFyIHRodW5rID0gY3JlYXRlVGh1bmtNaWRkbGV3YXJlKCk7IC8vIEF0dGFjaCB0aGUgZmFjdG9yeSBmdW5jdGlvbiBzbyB1c2VycyBjYW4gY3JlYXRlIGEgY3VzdG9taXplZCB2ZXJzaW9uXG4vLyB3aXRoIHdoYXRldmVyIFwiZXh0cmEgYXJnXCIgdGhleSB3YW50IHRvIGluamVjdCBpbnRvIHRoZWlyIHRodW5rc1xuXG50aHVuay53aXRoRXh0cmFBcmd1bWVudCA9IGNyZWF0ZVRodW5rTWlkZGxld2FyZTtcbmV4cG9ydCBkZWZhdWx0IHRodW5rOyIsICIvKipcbiAqIHZhbGlkYXRlXG4gKlxuICogdGFrZXMgYW4gYXJyYXkgb2YgYXJyYXlzIG9mIHZhbGlkYXRpb25zIGFuZFxuICogdGhyb3dzIGlmIGFuIGVycm9yIG9jY3Vyc1xuICovXG52YXIgdmFsaWRhdGUgPSBmdW5jdGlvbiAodmFsaWRhdGlvbnMpIHtcbiAgICBpZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJykge1xuICAgICAgICBmb3IgKHZhciBfaSA9IDAsIHZhbGlkYXRpb25zXzEgPSB2YWxpZGF0aW9uczsgX2kgPCB2YWxpZGF0aW9uc18xLmxlbmd0aDsgX2krKykge1xuICAgICAgICAgICAgdmFyIHZhbGlkYXRpb24gPSB2YWxpZGF0aW9uc18xW19pXTtcbiAgICAgICAgICAgIHZhciBjb25kaXRpb24gPSB2YWxpZGF0aW9uWzBdO1xuICAgICAgICAgICAgdmFyIGVycm9yTWVzc2FnZSA9IHZhbGlkYXRpb25bMV07XG4gICAgICAgICAgICBpZiAoY29uZGl0aW9uKSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGVycm9yTWVzc2FnZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG59O1xuZXhwb3J0IGRlZmF1bHQgdmFsaWRhdGU7XG4iLCAiaW1wb3J0IHZhbGlkYXRlIGZyb20gJy4vdXRpbHMvdmFsaWRhdGUnO1xuLyoqXG4gKiBQbHVnaW5GYWN0b3J5XG4gKlxuICogbWFrZXMgUGx1Z2luIG9iamVjdHMgZXh0ZW5kIGFuZCBpbmhlcml0IGZyb20gYSByb290IFBsdWdpbkZhY3RvcnlcbiAqL1xuZXhwb3J0IGRlZmF1bHQgKGZ1bmN0aW9uIChjb25maWcpIHsgcmV0dXJuICh7XG4gICAgY29uZmlnOiBjb25maWcsXG4gICAgLyoqXG4gICAgICogdmFsaWRhdGVcbiAgICAgKlxuICAgICAqIGJpbmQgdmFsaWRhdGUgdG8gdGhlIHN0b3JlIGZvciBlYXN5IGFjY2Vzc1xuICAgICAqL1xuICAgIHZhbGlkYXRlOiB2YWxpZGF0ZSxcbiAgICAvKipcbiAgICAgKiBjcmVhdGUgcGx1Z2luXG4gICAgICpcbiAgICAgKiBiaW5kcyBwbHVnaW4gcHJvcGVydGllcyBhbmQgZnVuY3Rpb25zIHRvIGFuIGluc3RhbmNlIG9mIFBsdWdpbkZhY3RvcnlzXG4gICAgICogQHBhcmFtIHBsdWdpblxuICAgICAqL1xuICAgIGNyZWF0ZTogZnVuY3Rpb24gKHBsdWdpbikge1xuICAgICAgICB2YWxpZGF0ZShbXG4gICAgICAgICAgICBbXG4gICAgICAgICAgICAgICAgcGx1Z2luLm9uU3RvcmVDcmVhdGVkICYmIHR5cGVvZiBwbHVnaW4ub25TdG9yZUNyZWF0ZWQgIT09ICdmdW5jdGlvbicsXG4gICAgICAgICAgICAgICAgJ1BsdWdpbiBvblN0b3JlQ3JlYXRlZCBtdXN0IGJlIGEgZnVuY3Rpb24nLFxuICAgICAgICAgICAgXSxcbiAgICAgICAgICAgIFtcbiAgICAgICAgICAgICAgICBwbHVnaW4ub25Nb2RlbCAmJiB0eXBlb2YgcGx1Z2luLm9uTW9kZWwgIT09ICdmdW5jdGlvbicsXG4gICAgICAgICAgICAgICAgJ1BsdWdpbiBvbk1vZGVsIG11c3QgYmUgYSBmdW5jdGlvbicsXG4gICAgICAgICAgICBdLFxuICAgICAgICAgICAgW1xuICAgICAgICAgICAgICAgIHBsdWdpbi5taWRkbGV3YXJlICYmIHR5cGVvZiBwbHVnaW4ubWlkZGxld2FyZSAhPT0gJ2Z1bmN0aW9uJyxcbiAgICAgICAgICAgICAgICAnUGx1Z2luIG1pZGRsZXdhcmUgbXVzdCBiZSBhIGZ1bmN0aW9uJyxcbiAgICAgICAgICAgIF0sXG4gICAgICAgIF0pO1xuICAgICAgICBpZiAocGx1Z2luLm9uSW5pdCkge1xuICAgICAgICAgICAgcGx1Z2luLm9uSW5pdC5jYWxsKHRoaXMpO1xuICAgICAgICB9XG4gICAgICAgIHZhciByZXN1bHQgPSB7fTtcbiAgICAgICAgaWYgKHBsdWdpbi5leHBvc2VkKSB7XG4gICAgICAgICAgICBmb3IgKHZhciBfaSA9IDAsIF9hID0gT2JqZWN0LmtleXMocGx1Z2luLmV4cG9zZWQpOyBfaSA8IF9hLmxlbmd0aDsgX2krKykge1xuICAgICAgICAgICAgICAgIHZhciBrZXkgPSBfYVtfaV07XG4gICAgICAgICAgICAgICAgdGhpc1trZXldID1cbiAgICAgICAgICAgICAgICAgICAgdHlwZW9mIHBsdWdpbi5leHBvc2VkW2tleV0gPT09ICdmdW5jdGlvbidcbiAgICAgICAgICAgICAgICAgICAgICAgID8gcGx1Z2luLmV4cG9zZWRba2V5XS5iaW5kKHRoaXMpIC8vIGJpbmQgZnVuY3Rpb25zIHRvIHBsdWdpbiBjbGFzc1xuICAgICAgICAgICAgICAgICAgICAgICAgOiBPYmplY3QuY3JlYXRlKHBsdWdpbi5leHBvc2VkW2tleV0pOyAvLyBhZGQgZXhwb3NlZCB0byBwbHVnaW4gY2xhc3NcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBmb3IgKHZhciBfYiA9IDAsIF9jID0gWydvbk1vZGVsJywgJ21pZGRsZXdhcmUnLCAnb25TdG9yZUNyZWF0ZWQnXTsgX2IgPCBfYy5sZW5ndGg7IF9iKyspIHtcbiAgICAgICAgICAgIHZhciBtZXRob2QgPSBfY1tfYl07XG4gICAgICAgICAgICBpZiAocGx1Z2luW21ldGhvZF0pIHtcbiAgICAgICAgICAgICAgICByZXN1bHRbbWV0aG9kXSA9IHBsdWdpblttZXRob2RdLmJpbmQodGhpcyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9LFxufSk7IH0pO1xuIiwgInZhciBfX2F3YWl0ZXIgPSAodGhpcyAmJiB0aGlzLl9fYXdhaXRlcikgfHwgZnVuY3Rpb24gKHRoaXNBcmcsIF9hcmd1bWVudHMsIFAsIGdlbmVyYXRvcikge1xuICAgIGZ1bmN0aW9uIGFkb3B0KHZhbHVlKSB7IHJldHVybiB2YWx1ZSBpbnN0YW5jZW9mIFAgPyB2YWx1ZSA6IG5ldyBQKGZ1bmN0aW9uIChyZXNvbHZlKSB7IHJlc29sdmUodmFsdWUpOyB9KTsgfVxuICAgIHJldHVybiBuZXcgKFAgfHwgKFAgPSBQcm9taXNlKSkoZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgICBmdW5jdGlvbiBmdWxmaWxsZWQodmFsdWUpIHsgdHJ5IHsgc3RlcChnZW5lcmF0b3IubmV4dCh2YWx1ZSkpOyB9IGNhdGNoIChlKSB7IHJlamVjdChlKTsgfSB9XG4gICAgICAgIGZ1bmN0aW9uIHJlamVjdGVkKHZhbHVlKSB7IHRyeSB7IHN0ZXAoZ2VuZXJhdG9yW1widGhyb3dcIl0odmFsdWUpKTsgfSBjYXRjaCAoZSkgeyByZWplY3QoZSk7IH0gfVxuICAgICAgICBmdW5jdGlvbiBzdGVwKHJlc3VsdCkgeyByZXN1bHQuZG9uZSA/IHJlc29sdmUocmVzdWx0LnZhbHVlKSA6IGFkb3B0KHJlc3VsdC52YWx1ZSkudGhlbihmdWxmaWxsZWQsIHJlamVjdGVkKTsgfVxuICAgICAgICBzdGVwKChnZW5lcmF0b3IgPSBnZW5lcmF0b3IuYXBwbHkodGhpc0FyZywgX2FyZ3VtZW50cyB8fCBbXSkpLm5leHQoKSk7XG4gICAgfSk7XG59O1xudmFyIF9fZ2VuZXJhdG9yID0gKHRoaXMgJiYgdGhpcy5fX2dlbmVyYXRvcikgfHwgZnVuY3Rpb24gKHRoaXNBcmcsIGJvZHkpIHtcbiAgICB2YXIgXyA9IHsgbGFiZWw6IDAsIHNlbnQ6IGZ1bmN0aW9uKCkgeyBpZiAodFswXSAmIDEpIHRocm93IHRbMV07IHJldHVybiB0WzFdOyB9LCB0cnlzOiBbXSwgb3BzOiBbXSB9LCBmLCB5LCB0LCBnO1xuICAgIHJldHVybiBnID0geyBuZXh0OiB2ZXJiKDApLCBcInRocm93XCI6IHZlcmIoMSksIFwicmV0dXJuXCI6IHZlcmIoMikgfSwgdHlwZW9mIFN5bWJvbCA9PT0gXCJmdW5jdGlvblwiICYmIChnW1N5bWJvbC5pdGVyYXRvcl0gPSBmdW5jdGlvbigpIHsgcmV0dXJuIHRoaXM7IH0pLCBnO1xuICAgIGZ1bmN0aW9uIHZlcmIobikgeyByZXR1cm4gZnVuY3Rpb24gKHYpIHsgcmV0dXJuIHN0ZXAoW24sIHZdKTsgfTsgfVxuICAgIGZ1bmN0aW9uIHN0ZXAob3ApIHtcbiAgICAgICAgaWYgKGYpIHRocm93IG5ldyBUeXBlRXJyb3IoXCJHZW5lcmF0b3IgaXMgYWxyZWFkeSBleGVjdXRpbmcuXCIpO1xuICAgICAgICB3aGlsZSAoXykgdHJ5IHtcbiAgICAgICAgICAgIGlmIChmID0gMSwgeSAmJiAodCA9IG9wWzBdICYgMiA/IHlbXCJyZXR1cm5cIl0gOiBvcFswXSA/IHlbXCJ0aHJvd1wiXSB8fCAoKHQgPSB5W1wicmV0dXJuXCJdKSAmJiB0LmNhbGwoeSksIDApIDogeS5uZXh0KSAmJiAhKHQgPSB0LmNhbGwoeSwgb3BbMV0pKS5kb25lKSByZXR1cm4gdDtcbiAgICAgICAgICAgIGlmICh5ID0gMCwgdCkgb3AgPSBbb3BbMF0gJiAyLCB0LnZhbHVlXTtcbiAgICAgICAgICAgIHN3aXRjaCAob3BbMF0pIHtcbiAgICAgICAgICAgICAgICBjYXNlIDA6IGNhc2UgMTogdCA9IG9wOyBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlIDQ6IF8ubGFiZWwrKzsgcmV0dXJuIHsgdmFsdWU6IG9wWzFdLCBkb25lOiBmYWxzZSB9O1xuICAgICAgICAgICAgICAgIGNhc2UgNTogXy5sYWJlbCsrOyB5ID0gb3BbMV07IG9wID0gWzBdOyBjb250aW51ZTtcbiAgICAgICAgICAgICAgICBjYXNlIDc6IG9wID0gXy5vcHMucG9wKCk7IF8udHJ5cy5wb3AoKTsgY29udGludWU7XG4gICAgICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICAgICAgaWYgKCEodCA9IF8udHJ5cywgdCA9IHQubGVuZ3RoID4gMCAmJiB0W3QubGVuZ3RoIC0gMV0pICYmIChvcFswXSA9PT0gNiB8fCBvcFswXSA9PT0gMikpIHsgXyA9IDA7IGNvbnRpbnVlOyB9XG4gICAgICAgICAgICAgICAgICAgIGlmIChvcFswXSA9PT0gMyAmJiAoIXQgfHwgKG9wWzFdID4gdFswXSAmJiBvcFsxXSA8IHRbM10pKSkgeyBfLmxhYmVsID0gb3BbMV07IGJyZWFrOyB9XG4gICAgICAgICAgICAgICAgICAgIGlmIChvcFswXSA9PT0gNiAmJiBfLmxhYmVsIDwgdFsxXSkgeyBfLmxhYmVsID0gdFsxXTsgdCA9IG9wOyBicmVhazsgfVxuICAgICAgICAgICAgICAgICAgICBpZiAodCAmJiBfLmxhYmVsIDwgdFsyXSkgeyBfLmxhYmVsID0gdFsyXTsgXy5vcHMucHVzaChvcCk7IGJyZWFrOyB9XG4gICAgICAgICAgICAgICAgICAgIGlmICh0WzJdKSBfLm9wcy5wb3AoKTtcbiAgICAgICAgICAgICAgICAgICAgXy50cnlzLnBvcCgpOyBjb250aW51ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIG9wID0gYm9keS5jYWxsKHRoaXNBcmcsIF8pO1xuICAgICAgICB9IGNhdGNoIChlKSB7IG9wID0gWzYsIGVdOyB5ID0gMDsgfSBmaW5hbGx5IHsgZiA9IHQgPSAwOyB9XG4gICAgICAgIGlmIChvcFswXSAmIDUpIHRocm93IG9wWzFdOyByZXR1cm4geyB2YWx1ZTogb3BbMF0gPyBvcFsxXSA6IHZvaWQgMCwgZG9uZTogdHJ1ZSB9O1xuICAgIH1cbn07XG4vKipcbiAqIERpc3BhdGNoIFBsdWdpblxuICpcbiAqIGdlbmVyYXRlcyBkaXNwYXRjaFttb2RlbE5hbWVdW2FjdGlvbk5hbWVdXG4gKi9cbnZhciBkaXNwYXRjaFBsdWdpbiA9IHtcbiAgICBleHBvc2VkOiB7XG4gICAgICAgIC8vIHJlcXVpcmVkIGFzIGEgcGxhY2Vob2xkZXIgZm9yIHN0b3JlLmRpc3BhdGNoXG4gICAgICAgIHN0b3JlRGlzcGF0Y2g6IGZ1bmN0aW9uIChhY3Rpb24sIHN0YXRlKSB7XG4gICAgICAgICAgICBjb25zb2xlLndhcm4oJ1dhcm5pbmc6IHN0b3JlIG5vdCB5ZXQgbG9hZGVkJyk7XG4gICAgICAgIH0sXG4gICAgICAgIHN0b3JlR2V0U3RhdGU6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGNvbnNvbGUud2FybignV2FybmluZzogc3RvcmUgbm90IHlldCBsb2FkZWQnKTtcbiAgICAgICAgfSxcbiAgICAgICAgLyoqXG4gICAgICAgICAqIGRpc3BhdGNoXG4gICAgICAgICAqXG4gICAgICAgICAqIGJvdGggYSBmdW5jdGlvbiAoZGlzcGF0Y2gpIGFuZCBhbiBvYmplY3QgKGRpc3BhdGNoW21vZGVsTmFtZV1bYWN0aW9uTmFtZV0pXG4gICAgICAgICAqIEBwYXJhbSBhY3Rpb24gVC5BY3Rpb25cbiAgICAgICAgICovXG4gICAgICAgIGRpc3BhdGNoOiBmdW5jdGlvbiAoYWN0aW9uKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5zdG9yZURpc3BhdGNoKGFjdGlvbik7XG4gICAgICAgIH0sXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBjcmVhdGVEaXNwYXRjaGVyXG4gICAgICAgICAqXG4gICAgICAgICAqIGdlbmVyZWF0ZXMgYW4gYWN0aW9uIGNyZWF0b3IgZm9yIGEgZ2l2ZW4gbW9kZWwgJiByZWR1Y2VyXG4gICAgICAgICAqIEBwYXJhbSBtb2RlbE5hbWUgc3RyaW5nXG4gICAgICAgICAqIEBwYXJhbSByZWR1Y2VyTmFtZSBzdHJpbmdcbiAgICAgICAgICovXG4gICAgICAgIGNyZWF0ZURpc3BhdGNoZXI6IGZ1bmN0aW9uIChtb2RlbE5hbWUsIHJlZHVjZXJOYW1lKSB7XG4gICAgICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xuICAgICAgICAgICAgcmV0dXJuIGZ1bmN0aW9uIChwYXlsb2FkLCBtZXRhKSB7IHJldHVybiBfX2F3YWl0ZXIoX3RoaXMsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgdmFyIGFjdGlvbjtcbiAgICAgICAgICAgICAgICByZXR1cm4gX19nZW5lcmF0b3IodGhpcywgZnVuY3Rpb24gKF9hKSB7XG4gICAgICAgICAgICAgICAgICAgIGFjdGlvbiA9IHsgdHlwZTogbW9kZWxOYW1lICsgXCIvXCIgKyByZWR1Y2VyTmFtZSB9O1xuICAgICAgICAgICAgICAgICAgICBpZiAodHlwZW9mIHBheWxvYWQgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBhY3Rpb24ucGF5bG9hZCA9IHBheWxvYWQ7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgaWYgKHR5cGVvZiBtZXRhICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgICAgICAgICAgICAgYWN0aW9uLm1ldGEgPSBtZXRhO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBbMiAvKnJldHVybiovLCB0aGlzLmRpc3BhdGNoKGFjdGlvbildO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSk7IH07XG4gICAgICAgIH0sXG4gICAgfSxcbiAgICBvblN0b3JlQ3JlYXRlZDogZnVuY3Rpb24gKHN0b3JlKSB7XG4gICAgICAgIHRoaXMuc3RvcmVEaXNwYXRjaCA9IHN0b3JlLmRpc3BhdGNoO1xuICAgICAgICB0aGlzLnN0b3JlR2V0U3RhdGUgPSBzdG9yZS5nZXRTdGF0ZTtcbiAgICAgICAgcmV0dXJuIHsgZGlzcGF0Y2g6IHRoaXMuZGlzcGF0Y2ggfTtcbiAgICB9LFxuICAgIC8vIGdlbmVyYXRlIGFjdGlvbiBjcmVhdG9ycyBmb3IgYWxsIG1vZGVsLnJlZHVjZXJzXG4gICAgb25Nb2RlbDogZnVuY3Rpb24gKG1vZGVsKSB7XG4gICAgICAgIHRoaXMuZGlzcGF0Y2hbbW9kZWwubmFtZV0gPSB7fTtcbiAgICAgICAgaWYgKCFtb2RlbC5yZWR1Y2Vycykge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGZvciAodmFyIF9pID0gMCwgX2EgPSBPYmplY3Qua2V5cyhtb2RlbC5yZWR1Y2Vycyk7IF9pIDwgX2EubGVuZ3RoOyBfaSsrKSB7XG4gICAgICAgICAgICB2YXIgcmVkdWNlck5hbWUgPSBfYVtfaV07XG4gICAgICAgICAgICB0aGlzLnZhbGlkYXRlKFtcbiAgICAgICAgICAgICAgICBbXG4gICAgICAgICAgICAgICAgICAgICEhcmVkdWNlck5hbWUubWF0Y2goL1xcLy4rXFwvLyksXG4gICAgICAgICAgICAgICAgICAgIFwiSW52YWxpZCByZWR1Y2VyIG5hbWUgKFwiICsgbW9kZWwubmFtZSArIFwiL1wiICsgcmVkdWNlck5hbWUgKyBcIilcIixcbiAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICAgIFtcbiAgICAgICAgICAgICAgICAgICAgdHlwZW9mIG1vZGVsLnJlZHVjZXJzW3JlZHVjZXJOYW1lXSAhPT0gJ2Z1bmN0aW9uJyxcbiAgICAgICAgICAgICAgICAgICAgXCJJbnZhbGlkIHJlZHVjZXIgKFwiICsgbW9kZWwubmFtZSArIFwiL1wiICsgcmVkdWNlck5hbWUgKyBcIikuIE11c3QgYmUgYSBmdW5jdGlvblwiLFxuICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICBdKTtcbiAgICAgICAgICAgIHRoaXMuZGlzcGF0Y2hbbW9kZWwubmFtZV1bcmVkdWNlck5hbWVdID0gdGhpcy5jcmVhdGVEaXNwYXRjaGVyLmFwcGx5KHRoaXMsIFttb2RlbC5uYW1lLCByZWR1Y2VyTmFtZV0pO1xuICAgICAgICB9XG4gICAgfSxcbn07XG5leHBvcnQgZGVmYXVsdCBkaXNwYXRjaFBsdWdpbjtcbiIsICJ2YXIgX19hd2FpdGVyID0gKHRoaXMgJiYgdGhpcy5fX2F3YWl0ZXIpIHx8IGZ1bmN0aW9uICh0aGlzQXJnLCBfYXJndW1lbnRzLCBQLCBnZW5lcmF0b3IpIHtcbiAgICBmdW5jdGlvbiBhZG9wdCh2YWx1ZSkgeyByZXR1cm4gdmFsdWUgaW5zdGFuY2VvZiBQID8gdmFsdWUgOiBuZXcgUChmdW5jdGlvbiAocmVzb2x2ZSkgeyByZXNvbHZlKHZhbHVlKTsgfSk7IH1cbiAgICByZXR1cm4gbmV3IChQIHx8IChQID0gUHJvbWlzZSkpKGZ1bmN0aW9uIChyZXNvbHZlLCByZWplY3QpIHtcbiAgICAgICAgZnVuY3Rpb24gZnVsZmlsbGVkKHZhbHVlKSB7IHRyeSB7IHN0ZXAoZ2VuZXJhdG9yLm5leHQodmFsdWUpKTsgfSBjYXRjaCAoZSkgeyByZWplY3QoZSk7IH0gfVxuICAgICAgICBmdW5jdGlvbiByZWplY3RlZCh2YWx1ZSkgeyB0cnkgeyBzdGVwKGdlbmVyYXRvcltcInRocm93XCJdKHZhbHVlKSk7IH0gY2F0Y2ggKGUpIHsgcmVqZWN0KGUpOyB9IH1cbiAgICAgICAgZnVuY3Rpb24gc3RlcChyZXN1bHQpIHsgcmVzdWx0LmRvbmUgPyByZXNvbHZlKHJlc3VsdC52YWx1ZSkgOiBhZG9wdChyZXN1bHQudmFsdWUpLnRoZW4oZnVsZmlsbGVkLCByZWplY3RlZCk7IH1cbiAgICAgICAgc3RlcCgoZ2VuZXJhdG9yID0gZ2VuZXJhdG9yLmFwcGx5KHRoaXNBcmcsIF9hcmd1bWVudHMgfHwgW10pKS5uZXh0KCkpO1xuICAgIH0pO1xufTtcbnZhciBfX2dlbmVyYXRvciA9ICh0aGlzICYmIHRoaXMuX19nZW5lcmF0b3IpIHx8IGZ1bmN0aW9uICh0aGlzQXJnLCBib2R5KSB7XG4gICAgdmFyIF8gPSB7IGxhYmVsOiAwLCBzZW50OiBmdW5jdGlvbigpIHsgaWYgKHRbMF0gJiAxKSB0aHJvdyB0WzFdOyByZXR1cm4gdFsxXTsgfSwgdHJ5czogW10sIG9wczogW10gfSwgZiwgeSwgdCwgZztcbiAgICByZXR1cm4gZyA9IHsgbmV4dDogdmVyYigwKSwgXCJ0aHJvd1wiOiB2ZXJiKDEpLCBcInJldHVyblwiOiB2ZXJiKDIpIH0sIHR5cGVvZiBTeW1ib2wgPT09IFwiZnVuY3Rpb25cIiAmJiAoZ1tTeW1ib2wuaXRlcmF0b3JdID0gZnVuY3Rpb24oKSB7IHJldHVybiB0aGlzOyB9KSwgZztcbiAgICBmdW5jdGlvbiB2ZXJiKG4pIHsgcmV0dXJuIGZ1bmN0aW9uICh2KSB7IHJldHVybiBzdGVwKFtuLCB2XSk7IH07IH1cbiAgICBmdW5jdGlvbiBzdGVwKG9wKSB7XG4gICAgICAgIGlmIChmKSB0aHJvdyBuZXcgVHlwZUVycm9yKFwiR2VuZXJhdG9yIGlzIGFscmVhZHkgZXhlY3V0aW5nLlwiKTtcbiAgICAgICAgd2hpbGUgKF8pIHRyeSB7XG4gICAgICAgICAgICBpZiAoZiA9IDEsIHkgJiYgKHQgPSBvcFswXSAmIDIgPyB5W1wicmV0dXJuXCJdIDogb3BbMF0gPyB5W1widGhyb3dcIl0gfHwgKCh0ID0geVtcInJldHVyblwiXSkgJiYgdC5jYWxsKHkpLCAwKSA6IHkubmV4dCkgJiYgISh0ID0gdC5jYWxsKHksIG9wWzFdKSkuZG9uZSkgcmV0dXJuIHQ7XG4gICAgICAgICAgICBpZiAoeSA9IDAsIHQpIG9wID0gW29wWzBdICYgMiwgdC52YWx1ZV07XG4gICAgICAgICAgICBzd2l0Y2ggKG9wWzBdKSB7XG4gICAgICAgICAgICAgICAgY2FzZSAwOiBjYXNlIDE6IHQgPSBvcDsgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSA0OiBfLmxhYmVsKys7IHJldHVybiB7IHZhbHVlOiBvcFsxXSwgZG9uZTogZmFsc2UgfTtcbiAgICAgICAgICAgICAgICBjYXNlIDU6IF8ubGFiZWwrKzsgeSA9IG9wWzFdOyBvcCA9IFswXTsgY29udGludWU7XG4gICAgICAgICAgICAgICAgY2FzZSA3OiBvcCA9IF8ub3BzLnBvcCgpOyBfLnRyeXMucG9wKCk7IGNvbnRpbnVlO1xuICAgICAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgICAgIGlmICghKHQgPSBfLnRyeXMsIHQgPSB0Lmxlbmd0aCA+IDAgJiYgdFt0Lmxlbmd0aCAtIDFdKSAmJiAob3BbMF0gPT09IDYgfHwgb3BbMF0gPT09IDIpKSB7IF8gPSAwOyBjb250aW51ZTsgfVxuICAgICAgICAgICAgICAgICAgICBpZiAob3BbMF0gPT09IDMgJiYgKCF0IHx8IChvcFsxXSA+IHRbMF0gJiYgb3BbMV0gPCB0WzNdKSkpIHsgXy5sYWJlbCA9IG9wWzFdOyBicmVhazsgfVxuICAgICAgICAgICAgICAgICAgICBpZiAob3BbMF0gPT09IDYgJiYgXy5sYWJlbCA8IHRbMV0pIHsgXy5sYWJlbCA9IHRbMV07IHQgPSBvcDsgYnJlYWs7IH1cbiAgICAgICAgICAgICAgICAgICAgaWYgKHQgJiYgXy5sYWJlbCA8IHRbMl0pIHsgXy5sYWJlbCA9IHRbMl07IF8ub3BzLnB1c2gob3ApOyBicmVhazsgfVxuICAgICAgICAgICAgICAgICAgICBpZiAodFsyXSkgXy5vcHMucG9wKCk7XG4gICAgICAgICAgICAgICAgICAgIF8udHJ5cy5wb3AoKTsgY29udGludWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBvcCA9IGJvZHkuY2FsbCh0aGlzQXJnLCBfKTtcbiAgICAgICAgfSBjYXRjaCAoZSkgeyBvcCA9IFs2LCBlXTsgeSA9IDA7IH0gZmluYWxseSB7IGYgPSB0ID0gMDsgfVxuICAgICAgICBpZiAob3BbMF0gJiA1KSB0aHJvdyBvcFsxXTsgcmV0dXJuIHsgdmFsdWU6IG9wWzBdID8gb3BbMV0gOiB2b2lkIDAsIGRvbmU6IHRydWUgfTtcbiAgICB9XG59O1xuLyoqXG4gKiBFZmZlY3RzIFBsdWdpblxuICpcbiAqIFBsdWdpbiBmb3IgaGFuZGxpbmcgYXN5bmMgYWN0aW9uc1xuICovXG52YXIgZWZmZWN0c1BsdWdpbiA9IHtcbiAgICBleHBvc2VkOiB7XG4gICAgICAgIC8vIGV4cG9zZSBlZmZlY3RzIGZvciBhY2Nlc3MgZnJvbSBkaXNwYXRjaCBwbHVnaW5cbiAgICAgICAgZWZmZWN0czoge30sXG4gICAgfSxcbiAgICAvLyBhZGQgZWZmZWN0cyB0byBkaXNwYXRjaCBzbyB0aGF0IGRpc3BhdGNoW21vZGVsTmFtZV1bZWZmZWN0TmFtZV0gY2FsbHMgYW4gZWZmZWN0XG4gICAgb25Nb2RlbDogZnVuY3Rpb24gKG1vZGVsKSB7XG4gICAgICAgIGlmICghbW9kZWwuZWZmZWN0cykge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIHZhciBlZmZlY3RzID0gdHlwZW9mIG1vZGVsLmVmZmVjdHMgPT09ICdmdW5jdGlvbidcbiAgICAgICAgICAgID8gbW9kZWwuZWZmZWN0cyh0aGlzLmRpc3BhdGNoKVxuICAgICAgICAgICAgOiBtb2RlbC5lZmZlY3RzO1xuICAgICAgICB0aGlzLnZhbGlkYXRlKFtcbiAgICAgICAgICAgIFtcbiAgICAgICAgICAgICAgICB0eXBlb2YgZWZmZWN0cyAhPT0gJ29iamVjdCcsXG4gICAgICAgICAgICAgICAgXCJJbnZhbGlkIGVmZmVjdHMgZnJvbSBNb2RlbChcIiArIG1vZGVsLm5hbWUgKyBcIiksIGVmZmVjdHMgc2hvdWxkIHJldHVybiBhbiBvYmplY3RcIixcbiAgICAgICAgICAgIF0sXG4gICAgICAgIF0pO1xuICAgICAgICBmb3IgKHZhciBfaSA9IDAsIF9hID0gT2JqZWN0LmtleXMoZWZmZWN0cyk7IF9pIDwgX2EubGVuZ3RoOyBfaSsrKSB7XG4gICAgICAgICAgICB2YXIgZWZmZWN0TmFtZSA9IF9hW19pXTtcbiAgICAgICAgICAgIHRoaXMudmFsaWRhdGUoW1xuICAgICAgICAgICAgICAgIFtcbiAgICAgICAgICAgICAgICAgICAgISFlZmZlY3ROYW1lLm1hdGNoKC9cXC8vKSxcbiAgICAgICAgICAgICAgICAgICAgXCJJbnZhbGlkIGVmZmVjdCBuYW1lIChcIiArIG1vZGVsLm5hbWUgKyBcIi9cIiArIGVmZmVjdE5hbWUgKyBcIilcIixcbiAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICAgIFtcbiAgICAgICAgICAgICAgICAgICAgdHlwZW9mIGVmZmVjdHNbZWZmZWN0TmFtZV0gIT09ICdmdW5jdGlvbicsXG4gICAgICAgICAgICAgICAgICAgIFwiSW52YWxpZCBlZmZlY3QgKFwiICsgbW9kZWwubmFtZSArIFwiL1wiICsgZWZmZWN0TmFtZSArIFwiKS4gTXVzdCBiZSBhIGZ1bmN0aW9uXCIsXG4gICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgIF0pO1xuICAgICAgICAgICAgLy8gcHJvdmlkZSB0aGlzLnJlZHVjZXIoKSBmb3IgZWZmZWN0c1xuICAgICAgICAgICAgdGhpcy5lZmZlY3RzW21vZGVsLm5hbWUgKyBcIi9cIiArIGVmZmVjdE5hbWVdID0gZWZmZWN0c1tlZmZlY3ROYW1lXS5iaW5kKHRoaXMuZGlzcGF0Y2hbbW9kZWwubmFtZV0pO1xuICAgICAgICAgICAgLy8gYWRkIGVmZmVjdCB0byBkaXNwYXRjaFxuICAgICAgICAgICAgLy8gaXMgYXNzdW1pbmcgZGlzcGF0Y2ggaXMgYXZhaWxhYmxlIGFscmVhZHkuLi4gdGhhdCB0aGUgZGlzcGF0Y2ggcGx1Z2luIGlzIGluIHRoZXJlXG4gICAgICAgICAgICB0aGlzLmRpc3BhdGNoW21vZGVsLm5hbWVdW2VmZmVjdE5hbWVdID0gdGhpcy5jcmVhdGVEaXNwYXRjaGVyLmFwcGx5KHRoaXMsIFttb2RlbC5uYW1lLCBlZmZlY3ROYW1lXSk7XG4gICAgICAgICAgICAvLyB0YWcgZWZmZWN0cyBzbyB0aGV5IGNhbiBiZSBkaWZmZXJlbnRpYXRlZCBmcm9tIG5vcm1hbCBhY3Rpb25zXG4gICAgICAgICAgICB0aGlzLmRpc3BhdGNoW21vZGVsLm5hbWVdW2VmZmVjdE5hbWVdLmlzRWZmZWN0ID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgIH0sXG4gICAgLy8gcHJvY2VzcyBhc3luYy9hd2FpdCBhY3Rpb25zXG4gICAgbWlkZGxld2FyZTogZnVuY3Rpb24gKHN0b3JlKSB7XG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XG4gICAgICAgIHJldHVybiBmdW5jdGlvbiAobmV4dCkgeyByZXR1cm4gZnVuY3Rpb24gKGFjdGlvbikgeyByZXR1cm4gX19hd2FpdGVyKF90aGlzLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIF9fZ2VuZXJhdG9yKHRoaXMsIGZ1bmN0aW9uIChfYSkge1xuICAgICAgICAgICAgICAgIHN3aXRjaCAoX2EubGFiZWwpIHtcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAwOlxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCEoYWN0aW9uLnR5cGUgaW4gdGhpcy5lZmZlY3RzKSkgcmV0dXJuIFszIC8qYnJlYWsqLywgMl07XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBlZmZlY3RzIHRoYXQgc2hhcmUgYSBuYW1lIHdpdGggYSByZWR1Y2VyIGFyZSBjYWxsZWQgYWZ0ZXIgdGhlaXIgcmVkdWNlciBjb3VudGVycGFydFxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFs0IC8qeWllbGQqLywgbmV4dChhY3Rpb24pXTtcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAxOlxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gZWZmZWN0cyB0aGF0IHNoYXJlIGEgbmFtZSB3aXRoIGEgcmVkdWNlciBhcmUgY2FsbGVkIGFmdGVyIHRoZWlyIHJlZHVjZXIgY291bnRlcnBhcnRcbiAgICAgICAgICAgICAgICAgICAgICAgIF9hLnNlbnQoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBbMiAvKnJldHVybiovLCB0aGlzLmVmZmVjdHNbYWN0aW9uLnR5cGVdKGFjdGlvbi5wYXlsb2FkLCBzdG9yZS5nZXRTdGF0ZSgpLCBhY3Rpb24ubWV0YSldO1xuICAgICAgICAgICAgICAgICAgICBjYXNlIDI6IHJldHVybiBbMiAvKnJldHVybiovLCBuZXh0KGFjdGlvbildO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTsgfTsgfTtcbiAgICB9LFxufTtcbmV4cG9ydCBkZWZhdWx0IGVmZmVjdHNQbHVnaW47XG4iLCAiaW1wb3J0IF9vYmplY3RTcHJlYWQgZnJvbSAnQGJhYmVsL3J1bnRpbWUvaGVscGVycy9lc20vb2JqZWN0U3ByZWFkMic7XG5cbi8qKlxuICogQWRhcHRlZCBmcm9tIFJlYWN0OiBodHRwczovL2dpdGh1Yi5jb20vZmFjZWJvb2svcmVhY3QvYmxvYi9tYXN0ZXIvcGFja2FnZXMvc2hhcmVkL2Zvcm1hdFByb2RFcnJvck1lc3NhZ2UuanNcbiAqXG4gKiBEbyBub3QgcmVxdWlyZSB0aGlzIG1vZHVsZSBkaXJlY3RseSEgVXNlIG5vcm1hbCB0aHJvdyBlcnJvciBjYWxscy4gVGhlc2UgbWVzc2FnZXMgd2lsbCBiZSByZXBsYWNlZCB3aXRoIGVycm9yIGNvZGVzXG4gKiBkdXJpbmcgYnVpbGQuXG4gKiBAcGFyYW0ge251bWJlcn0gY29kZVxuICovXG5mdW5jdGlvbiBmb3JtYXRQcm9kRXJyb3JNZXNzYWdlKGNvZGUpIHtcbiAgcmV0dXJuIFwiTWluaWZpZWQgUmVkdXggZXJyb3IgI1wiICsgY29kZSArIFwiOyB2aXNpdCBodHRwczovL3JlZHV4LmpzLm9yZy9FcnJvcnM/Y29kZT1cIiArIGNvZGUgKyBcIiBmb3IgdGhlIGZ1bGwgbWVzc2FnZSBvciBcIiArICd1c2UgdGhlIG5vbi1taW5pZmllZCBkZXYgZW52aXJvbm1lbnQgZm9yIGZ1bGwgZXJyb3JzLiAnO1xufVxuXG4vLyBJbmxpbmVkIHZlcnNpb24gb2YgdGhlIGBzeW1ib2wtb2JzZXJ2YWJsZWAgcG9seWZpbGxcbnZhciAkJG9ic2VydmFibGUgPSAoZnVuY3Rpb24gKCkge1xuICByZXR1cm4gdHlwZW9mIFN5bWJvbCA9PT0gJ2Z1bmN0aW9uJyAmJiBTeW1ib2wub2JzZXJ2YWJsZSB8fCAnQEBvYnNlcnZhYmxlJztcbn0pKCk7XG5cbi8qKlxuICogVGhlc2UgYXJlIHByaXZhdGUgYWN0aW9uIHR5cGVzIHJlc2VydmVkIGJ5IFJlZHV4LlxuICogRm9yIGFueSB1bmtub3duIGFjdGlvbnMsIHlvdSBtdXN0IHJldHVybiB0aGUgY3VycmVudCBzdGF0ZS5cbiAqIElmIHRoZSBjdXJyZW50IHN0YXRlIGlzIHVuZGVmaW5lZCwgeW91IG11c3QgcmV0dXJuIHRoZSBpbml0aWFsIHN0YXRlLlxuICogRG8gbm90IHJlZmVyZW5jZSB0aGVzZSBhY3Rpb24gdHlwZXMgZGlyZWN0bHkgaW4geW91ciBjb2RlLlxuICovXG52YXIgcmFuZG9tU3RyaW5nID0gZnVuY3Rpb24gcmFuZG9tU3RyaW5nKCkge1xuICByZXR1cm4gTWF0aC5yYW5kb20oKS50b1N0cmluZygzNikuc3Vic3RyaW5nKDcpLnNwbGl0KCcnKS5qb2luKCcuJyk7XG59O1xuXG52YXIgQWN0aW9uVHlwZXMgPSB7XG4gIElOSVQ6IFwiQEByZWR1eC9JTklUXCIgKyByYW5kb21TdHJpbmcoKSxcbiAgUkVQTEFDRTogXCJAQHJlZHV4L1JFUExBQ0VcIiArIHJhbmRvbVN0cmluZygpLFxuICBQUk9CRV9VTktOT1dOX0FDVElPTjogZnVuY3Rpb24gUFJPQkVfVU5LTk9XTl9BQ1RJT04oKSB7XG4gICAgcmV0dXJuIFwiQEByZWR1eC9QUk9CRV9VTktOT1dOX0FDVElPTlwiICsgcmFuZG9tU3RyaW5nKCk7XG4gIH1cbn07XG5cbi8qKlxuICogQHBhcmFtIHthbnl9IG9iaiBUaGUgb2JqZWN0IHRvIGluc3BlY3QuXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gVHJ1ZSBpZiB0aGUgYXJndW1lbnQgYXBwZWFycyB0byBiZSBhIHBsYWluIG9iamVjdC5cbiAqL1xuZnVuY3Rpb24gaXNQbGFpbk9iamVjdChvYmopIHtcbiAgaWYgKHR5cGVvZiBvYmogIT09ICdvYmplY3QnIHx8IG9iaiA9PT0gbnVsbCkgcmV0dXJuIGZhbHNlO1xuICB2YXIgcHJvdG8gPSBvYmo7XG5cbiAgd2hpbGUgKE9iamVjdC5nZXRQcm90b3R5cGVPZihwcm90bykgIT09IG51bGwpIHtcbiAgICBwcm90byA9IE9iamVjdC5nZXRQcm90b3R5cGVPZihwcm90byk7XG4gIH1cblxuICByZXR1cm4gT2JqZWN0LmdldFByb3RvdHlwZU9mKG9iaikgPT09IHByb3RvO1xufVxuXG4vLyBJbmxpbmVkIC8gc2hvcnRlbmVkIHZlcnNpb24gb2YgYGtpbmRPZmAgZnJvbSBodHRwczovL2dpdGh1Yi5jb20vam9uc2NobGlua2VydC9raW5kLW9mXG5mdW5jdGlvbiBtaW5pS2luZE9mKHZhbCkge1xuICBpZiAodmFsID09PSB2b2lkIDApIHJldHVybiAndW5kZWZpbmVkJztcbiAgaWYgKHZhbCA9PT0gbnVsbCkgcmV0dXJuICdudWxsJztcbiAgdmFyIHR5cGUgPSB0eXBlb2YgdmFsO1xuXG4gIHN3aXRjaCAodHlwZSkge1xuICAgIGNhc2UgJ2Jvb2xlYW4nOlxuICAgIGNhc2UgJ3N0cmluZyc6XG4gICAgY2FzZSAnbnVtYmVyJzpcbiAgICBjYXNlICdzeW1ib2wnOlxuICAgIGNhc2UgJ2Z1bmN0aW9uJzpcbiAgICAgIHtcbiAgICAgICAgcmV0dXJuIHR5cGU7XG4gICAgICB9XG4gIH1cblxuICBpZiAoQXJyYXkuaXNBcnJheSh2YWwpKSByZXR1cm4gJ2FycmF5JztcbiAgaWYgKGlzRGF0ZSh2YWwpKSByZXR1cm4gJ2RhdGUnO1xuICBpZiAoaXNFcnJvcih2YWwpKSByZXR1cm4gJ2Vycm9yJztcbiAgdmFyIGNvbnN0cnVjdG9yTmFtZSA9IGN0b3JOYW1lKHZhbCk7XG5cbiAgc3dpdGNoIChjb25zdHJ1Y3Rvck5hbWUpIHtcbiAgICBjYXNlICdTeW1ib2wnOlxuICAgIGNhc2UgJ1Byb21pc2UnOlxuICAgIGNhc2UgJ1dlYWtNYXAnOlxuICAgIGNhc2UgJ1dlYWtTZXQnOlxuICAgIGNhc2UgJ01hcCc6XG4gICAgY2FzZSAnU2V0JzpcbiAgICAgIHJldHVybiBjb25zdHJ1Y3Rvck5hbWU7XG4gIH0gLy8gb3RoZXJcblxuXG4gIHJldHVybiB0eXBlLnNsaWNlKDgsIC0xKS50b0xvd2VyQ2FzZSgpLnJlcGxhY2UoL1xccy9nLCAnJyk7XG59XG5cbmZ1bmN0aW9uIGN0b3JOYW1lKHZhbCkge1xuICByZXR1cm4gdHlwZW9mIHZhbC5jb25zdHJ1Y3RvciA9PT0gJ2Z1bmN0aW9uJyA/IHZhbC5jb25zdHJ1Y3Rvci5uYW1lIDogbnVsbDtcbn1cblxuZnVuY3Rpb24gaXNFcnJvcih2YWwpIHtcbiAgcmV0dXJuIHZhbCBpbnN0YW5jZW9mIEVycm9yIHx8IHR5cGVvZiB2YWwubWVzc2FnZSA9PT0gJ3N0cmluZycgJiYgdmFsLmNvbnN0cnVjdG9yICYmIHR5cGVvZiB2YWwuY29uc3RydWN0b3Iuc3RhY2tUcmFjZUxpbWl0ID09PSAnbnVtYmVyJztcbn1cblxuZnVuY3Rpb24gaXNEYXRlKHZhbCkge1xuICBpZiAodmFsIGluc3RhbmNlb2YgRGF0ZSkgcmV0dXJuIHRydWU7XG4gIHJldHVybiB0eXBlb2YgdmFsLnRvRGF0ZVN0cmluZyA9PT0gJ2Z1bmN0aW9uJyAmJiB0eXBlb2YgdmFsLmdldERhdGUgPT09ICdmdW5jdGlvbicgJiYgdHlwZW9mIHZhbC5zZXREYXRlID09PSAnZnVuY3Rpb24nO1xufVxuXG5mdW5jdGlvbiBraW5kT2YodmFsKSB7XG4gIHZhciB0eXBlT2ZWYWwgPSB0eXBlb2YgdmFsO1xuXG4gIGlmIChwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nKSB7XG4gICAgdHlwZU9mVmFsID0gbWluaUtpbmRPZih2YWwpO1xuICB9XG5cbiAgcmV0dXJuIHR5cGVPZlZhbDtcbn1cblxuLyoqXG4gKiBAZGVwcmVjYXRlZFxuICpcbiAqICoqV2UgcmVjb21tZW5kIHVzaW5nIHRoZSBgY29uZmlndXJlU3RvcmVgIG1ldGhvZFxuICogb2YgdGhlIGBAcmVkdXhqcy90b29sa2l0YCBwYWNrYWdlKiosIHdoaWNoIHJlcGxhY2VzIGBjcmVhdGVTdG9yZWAuXG4gKlxuICogUmVkdXggVG9vbGtpdCBpcyBvdXIgcmVjb21tZW5kZWQgYXBwcm9hY2ggZm9yIHdyaXRpbmcgUmVkdXggbG9naWMgdG9kYXksXG4gKiBpbmNsdWRpbmcgc3RvcmUgc2V0dXAsIHJlZHVjZXJzLCBkYXRhIGZldGNoaW5nLCBhbmQgbW9yZS5cbiAqXG4gKiAqKkZvciBtb3JlIGRldGFpbHMsIHBsZWFzZSByZWFkIHRoaXMgUmVkdXggZG9jcyBwYWdlOioqXG4gKiAqKmh0dHBzOi8vcmVkdXguanMub3JnL2ludHJvZHVjdGlvbi93aHktcnRrLWlzLXJlZHV4LXRvZGF5KipcbiAqXG4gKiBgY29uZmlndXJlU3RvcmVgIGZyb20gUmVkdXggVG9vbGtpdCBpcyBhbiBpbXByb3ZlZCB2ZXJzaW9uIG9mIGBjcmVhdGVTdG9yZWAgdGhhdFxuICogc2ltcGxpZmllcyBzZXR1cCBhbmQgaGVscHMgYXZvaWQgY29tbW9uIGJ1Z3MuXG4gKlxuICogWW91IHNob3VsZCBub3QgYmUgdXNpbmcgdGhlIGByZWR1eGAgY29yZSBwYWNrYWdlIGJ5IGl0c2VsZiB0b2RheSwgZXhjZXB0IGZvciBsZWFybmluZyBwdXJwb3Nlcy5cbiAqIFRoZSBgY3JlYXRlU3RvcmVgIG1ldGhvZCBmcm9tIHRoZSBjb3JlIGByZWR1eGAgcGFja2FnZSB3aWxsIG5vdCBiZSByZW1vdmVkLCBidXQgd2UgZW5jb3VyYWdlXG4gKiBhbGwgdXNlcnMgdG8gbWlncmF0ZSB0byB1c2luZyBSZWR1eCBUb29sa2l0IGZvciBhbGwgUmVkdXggY29kZS5cbiAqXG4gKiBJZiB5b3Ugd2FudCB0byB1c2UgYGNyZWF0ZVN0b3JlYCB3aXRob3V0IHRoaXMgdmlzdWFsIGRlcHJlY2F0aW9uIHdhcm5pbmcsIHVzZVxuICogdGhlIGBsZWdhY3lfY3JlYXRlU3RvcmVgIGltcG9ydCBpbnN0ZWFkOlxuICpcbiAqIGBpbXBvcnQgeyBsZWdhY3lfY3JlYXRlU3RvcmUgYXMgY3JlYXRlU3RvcmV9IGZyb20gJ3JlZHV4J2BcbiAqXG4gKi9cblxuZnVuY3Rpb24gY3JlYXRlU3RvcmUocmVkdWNlciwgcHJlbG9hZGVkU3RhdGUsIGVuaGFuY2VyKSB7XG4gIHZhciBfcmVmMjtcblxuICBpZiAodHlwZW9mIHByZWxvYWRlZFN0YXRlID09PSAnZnVuY3Rpb24nICYmIHR5cGVvZiBlbmhhbmNlciA9PT0gJ2Z1bmN0aW9uJyB8fCB0eXBlb2YgZW5oYW5jZXIgPT09ICdmdW5jdGlvbicgJiYgdHlwZW9mIGFyZ3VtZW50c1szXSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgIHRocm93IG5ldyBFcnJvcihwcm9jZXNzLmVudi5OT0RFX0VOViA9PT0gXCJwcm9kdWN0aW9uXCIgPyBmb3JtYXRQcm9kRXJyb3JNZXNzYWdlKDApIDogJ0l0IGxvb2tzIGxpa2UgeW91IGFyZSBwYXNzaW5nIHNldmVyYWwgc3RvcmUgZW5oYW5jZXJzIHRvICcgKyAnY3JlYXRlU3RvcmUoKS4gVGhpcyBpcyBub3Qgc3VwcG9ydGVkLiBJbnN0ZWFkLCBjb21wb3NlIHRoZW0gJyArICd0b2dldGhlciB0byBhIHNpbmdsZSBmdW5jdGlvbi4gU2VlIGh0dHBzOi8vcmVkdXguanMub3JnL3R1dG9yaWFscy9mdW5kYW1lbnRhbHMvcGFydC00LXN0b3JlI2NyZWF0aW5nLWEtc3RvcmUtd2l0aC1lbmhhbmNlcnMgZm9yIGFuIGV4YW1wbGUuJyk7XG4gIH1cblxuICBpZiAodHlwZW9mIHByZWxvYWRlZFN0YXRlID09PSAnZnVuY3Rpb24nICYmIHR5cGVvZiBlbmhhbmNlciA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICBlbmhhbmNlciA9IHByZWxvYWRlZFN0YXRlO1xuICAgIHByZWxvYWRlZFN0YXRlID0gdW5kZWZpbmVkO1xuICB9XG5cbiAgaWYgKHR5cGVvZiBlbmhhbmNlciAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICBpZiAodHlwZW9mIGVuaGFuY2VyICE9PSAnZnVuY3Rpb24nKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IocHJvY2Vzcy5lbnYuTk9ERV9FTlYgPT09IFwicHJvZHVjdGlvblwiID8gZm9ybWF0UHJvZEVycm9yTWVzc2FnZSgxKSA6IFwiRXhwZWN0ZWQgdGhlIGVuaGFuY2VyIHRvIGJlIGEgZnVuY3Rpb24uIEluc3RlYWQsIHJlY2VpdmVkOiAnXCIgKyBraW5kT2YoZW5oYW5jZXIpICsgXCInXCIpO1xuICAgIH1cblxuICAgIHJldHVybiBlbmhhbmNlcihjcmVhdGVTdG9yZSkocmVkdWNlciwgcHJlbG9hZGVkU3RhdGUpO1xuICB9XG5cbiAgaWYgKHR5cGVvZiByZWR1Y2VyICE9PSAnZnVuY3Rpb24nKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKHByb2Nlc3MuZW52Lk5PREVfRU5WID09PSBcInByb2R1Y3Rpb25cIiA/IGZvcm1hdFByb2RFcnJvck1lc3NhZ2UoMikgOiBcIkV4cGVjdGVkIHRoZSByb290IHJlZHVjZXIgdG8gYmUgYSBmdW5jdGlvbi4gSW5zdGVhZCwgcmVjZWl2ZWQ6ICdcIiArIGtpbmRPZihyZWR1Y2VyKSArIFwiJ1wiKTtcbiAgfVxuXG4gIHZhciBjdXJyZW50UmVkdWNlciA9IHJlZHVjZXI7XG4gIHZhciBjdXJyZW50U3RhdGUgPSBwcmVsb2FkZWRTdGF0ZTtcbiAgdmFyIGN1cnJlbnRMaXN0ZW5lcnMgPSBbXTtcbiAgdmFyIG5leHRMaXN0ZW5lcnMgPSBjdXJyZW50TGlzdGVuZXJzO1xuICB2YXIgaXNEaXNwYXRjaGluZyA9IGZhbHNlO1xuICAvKipcbiAgICogVGhpcyBtYWtlcyBhIHNoYWxsb3cgY29weSBvZiBjdXJyZW50TGlzdGVuZXJzIHNvIHdlIGNhbiB1c2VcbiAgICogbmV4dExpc3RlbmVycyBhcyBhIHRlbXBvcmFyeSBsaXN0IHdoaWxlIGRpc3BhdGNoaW5nLlxuICAgKlxuICAgKiBUaGlzIHByZXZlbnRzIGFueSBidWdzIGFyb3VuZCBjb25zdW1lcnMgY2FsbGluZ1xuICAgKiBzdWJzY3JpYmUvdW5zdWJzY3JpYmUgaW4gdGhlIG1pZGRsZSBvZiBhIGRpc3BhdGNoLlxuICAgKi9cblxuICBmdW5jdGlvbiBlbnN1cmVDYW5NdXRhdGVOZXh0TGlzdGVuZXJzKCkge1xuICAgIGlmIChuZXh0TGlzdGVuZXJzID09PSBjdXJyZW50TGlzdGVuZXJzKSB7XG4gICAgICBuZXh0TGlzdGVuZXJzID0gY3VycmVudExpc3RlbmVycy5zbGljZSgpO1xuICAgIH1cbiAgfVxuICAvKipcbiAgICogUmVhZHMgdGhlIHN0YXRlIHRyZWUgbWFuYWdlZCBieSB0aGUgc3RvcmUuXG4gICAqXG4gICAqIEByZXR1cm5zIHthbnl9IFRoZSBjdXJyZW50IHN0YXRlIHRyZWUgb2YgeW91ciBhcHBsaWNhdGlvbi5cbiAgICovXG5cblxuICBmdW5jdGlvbiBnZXRTdGF0ZSgpIHtcbiAgICBpZiAoaXNEaXNwYXRjaGluZykge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKHByb2Nlc3MuZW52Lk5PREVfRU5WID09PSBcInByb2R1Y3Rpb25cIiA/IGZvcm1hdFByb2RFcnJvck1lc3NhZ2UoMykgOiAnWW91IG1heSBub3QgY2FsbCBzdG9yZS5nZXRTdGF0ZSgpIHdoaWxlIHRoZSByZWR1Y2VyIGlzIGV4ZWN1dGluZy4gJyArICdUaGUgcmVkdWNlciBoYXMgYWxyZWFkeSByZWNlaXZlZCB0aGUgc3RhdGUgYXMgYW4gYXJndW1lbnQuICcgKyAnUGFzcyBpdCBkb3duIGZyb20gdGhlIHRvcCByZWR1Y2VyIGluc3RlYWQgb2YgcmVhZGluZyBpdCBmcm9tIHRoZSBzdG9yZS4nKTtcbiAgICB9XG5cbiAgICByZXR1cm4gY3VycmVudFN0YXRlO1xuICB9XG4gIC8qKlxuICAgKiBBZGRzIGEgY2hhbmdlIGxpc3RlbmVyLiBJdCB3aWxsIGJlIGNhbGxlZCBhbnkgdGltZSBhbiBhY3Rpb24gaXMgZGlzcGF0Y2hlZCxcbiAgICogYW5kIHNvbWUgcGFydCBvZiB0aGUgc3RhdGUgdHJlZSBtYXkgcG90ZW50aWFsbHkgaGF2ZSBjaGFuZ2VkLiBZb3UgbWF5IHRoZW5cbiAgICogY2FsbCBgZ2V0U3RhdGUoKWAgdG8gcmVhZCB0aGUgY3VycmVudCBzdGF0ZSB0cmVlIGluc2lkZSB0aGUgY2FsbGJhY2suXG4gICAqXG4gICAqIFlvdSBtYXkgY2FsbCBgZGlzcGF0Y2goKWAgZnJvbSBhIGNoYW5nZSBsaXN0ZW5lciwgd2l0aCB0aGUgZm9sbG93aW5nXG4gICAqIGNhdmVhdHM6XG4gICAqXG4gICAqIDEuIFRoZSBzdWJzY3JpcHRpb25zIGFyZSBzbmFwc2hvdHRlZCBqdXN0IGJlZm9yZSBldmVyeSBgZGlzcGF0Y2goKWAgY2FsbC5cbiAgICogSWYgeW91IHN1YnNjcmliZSBvciB1bnN1YnNjcmliZSB3aGlsZSB0aGUgbGlzdGVuZXJzIGFyZSBiZWluZyBpbnZva2VkLCB0aGlzXG4gICAqIHdpbGwgbm90IGhhdmUgYW55IGVmZmVjdCBvbiB0aGUgYGRpc3BhdGNoKClgIHRoYXQgaXMgY3VycmVudGx5IGluIHByb2dyZXNzLlxuICAgKiBIb3dldmVyLCB0aGUgbmV4dCBgZGlzcGF0Y2goKWAgY2FsbCwgd2hldGhlciBuZXN0ZWQgb3Igbm90LCB3aWxsIHVzZSBhIG1vcmVcbiAgICogcmVjZW50IHNuYXBzaG90IG9mIHRoZSBzdWJzY3JpcHRpb24gbGlzdC5cbiAgICpcbiAgICogMi4gVGhlIGxpc3RlbmVyIHNob3VsZCBub3QgZXhwZWN0IHRvIHNlZSBhbGwgc3RhdGUgY2hhbmdlcywgYXMgdGhlIHN0YXRlXG4gICAqIG1pZ2h0IGhhdmUgYmVlbiB1cGRhdGVkIG11bHRpcGxlIHRpbWVzIGR1cmluZyBhIG5lc3RlZCBgZGlzcGF0Y2goKWAgYmVmb3JlXG4gICAqIHRoZSBsaXN0ZW5lciBpcyBjYWxsZWQuIEl0IGlzLCBob3dldmVyLCBndWFyYW50ZWVkIHRoYXQgYWxsIHN1YnNjcmliZXJzXG4gICAqIHJlZ2lzdGVyZWQgYmVmb3JlIHRoZSBgZGlzcGF0Y2goKWAgc3RhcnRlZCB3aWxsIGJlIGNhbGxlZCB3aXRoIHRoZSBsYXRlc3RcbiAgICogc3RhdGUgYnkgdGhlIHRpbWUgaXQgZXhpdHMuXG4gICAqXG4gICAqIEBwYXJhbSB7RnVuY3Rpb259IGxpc3RlbmVyIEEgY2FsbGJhY2sgdG8gYmUgaW52b2tlZCBvbiBldmVyeSBkaXNwYXRjaC5cbiAgICogQHJldHVybnMge0Z1bmN0aW9ufSBBIGZ1bmN0aW9uIHRvIHJlbW92ZSB0aGlzIGNoYW5nZSBsaXN0ZW5lci5cbiAgICovXG5cblxuICBmdW5jdGlvbiBzdWJzY3JpYmUobGlzdGVuZXIpIHtcbiAgICBpZiAodHlwZW9mIGxpc3RlbmVyICE9PSAnZnVuY3Rpb24nKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IocHJvY2Vzcy5lbnYuTk9ERV9FTlYgPT09IFwicHJvZHVjdGlvblwiID8gZm9ybWF0UHJvZEVycm9yTWVzc2FnZSg0KSA6IFwiRXhwZWN0ZWQgdGhlIGxpc3RlbmVyIHRvIGJlIGEgZnVuY3Rpb24uIEluc3RlYWQsIHJlY2VpdmVkOiAnXCIgKyBraW5kT2YobGlzdGVuZXIpICsgXCInXCIpO1xuICAgIH1cblxuICAgIGlmIChpc0Rpc3BhdGNoaW5nKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IocHJvY2Vzcy5lbnYuTk9ERV9FTlYgPT09IFwicHJvZHVjdGlvblwiID8gZm9ybWF0UHJvZEVycm9yTWVzc2FnZSg1KSA6ICdZb3UgbWF5IG5vdCBjYWxsIHN0b3JlLnN1YnNjcmliZSgpIHdoaWxlIHRoZSByZWR1Y2VyIGlzIGV4ZWN1dGluZy4gJyArICdJZiB5b3Ugd291bGQgbGlrZSB0byBiZSBub3RpZmllZCBhZnRlciB0aGUgc3RvcmUgaGFzIGJlZW4gdXBkYXRlZCwgc3Vic2NyaWJlIGZyb20gYSAnICsgJ2NvbXBvbmVudCBhbmQgaW52b2tlIHN0b3JlLmdldFN0YXRlKCkgaW4gdGhlIGNhbGxiYWNrIHRvIGFjY2VzcyB0aGUgbGF0ZXN0IHN0YXRlLiAnICsgJ1NlZSBodHRwczovL3JlZHV4LmpzLm9yZy9hcGkvc3RvcmUjc3Vic2NyaWJlbGlzdGVuZXIgZm9yIG1vcmUgZGV0YWlscy4nKTtcbiAgICB9XG5cbiAgICB2YXIgaXNTdWJzY3JpYmVkID0gdHJ1ZTtcbiAgICBlbnN1cmVDYW5NdXRhdGVOZXh0TGlzdGVuZXJzKCk7XG4gICAgbmV4dExpc3RlbmVycy5wdXNoKGxpc3RlbmVyKTtcbiAgICByZXR1cm4gZnVuY3Rpb24gdW5zdWJzY3JpYmUoKSB7XG4gICAgICBpZiAoIWlzU3Vic2NyaWJlZCkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIGlmIChpc0Rpc3BhdGNoaW5nKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihwcm9jZXNzLmVudi5OT0RFX0VOViA9PT0gXCJwcm9kdWN0aW9uXCIgPyBmb3JtYXRQcm9kRXJyb3JNZXNzYWdlKDYpIDogJ1lvdSBtYXkgbm90IHVuc3Vic2NyaWJlIGZyb20gYSBzdG9yZSBsaXN0ZW5lciB3aGlsZSB0aGUgcmVkdWNlciBpcyBleGVjdXRpbmcuICcgKyAnU2VlIGh0dHBzOi8vcmVkdXguanMub3JnL2FwaS9zdG9yZSNzdWJzY3JpYmVsaXN0ZW5lciBmb3IgbW9yZSBkZXRhaWxzLicpO1xuICAgICAgfVxuXG4gICAgICBpc1N1YnNjcmliZWQgPSBmYWxzZTtcbiAgICAgIGVuc3VyZUNhbk11dGF0ZU5leHRMaXN0ZW5lcnMoKTtcbiAgICAgIHZhciBpbmRleCA9IG5leHRMaXN0ZW5lcnMuaW5kZXhPZihsaXN0ZW5lcik7XG4gICAgICBuZXh0TGlzdGVuZXJzLnNwbGljZShpbmRleCwgMSk7XG4gICAgICBjdXJyZW50TGlzdGVuZXJzID0gbnVsbDtcbiAgICB9O1xuICB9XG4gIC8qKlxuICAgKiBEaXNwYXRjaGVzIGFuIGFjdGlvbi4gSXQgaXMgdGhlIG9ubHkgd2F5IHRvIHRyaWdnZXIgYSBzdGF0ZSBjaGFuZ2UuXG4gICAqXG4gICAqIFRoZSBgcmVkdWNlcmAgZnVuY3Rpb24sIHVzZWQgdG8gY3JlYXRlIHRoZSBzdG9yZSwgd2lsbCBiZSBjYWxsZWQgd2l0aCB0aGVcbiAgICogY3VycmVudCBzdGF0ZSB0cmVlIGFuZCB0aGUgZ2l2ZW4gYGFjdGlvbmAuIEl0cyByZXR1cm4gdmFsdWUgd2lsbFxuICAgKiBiZSBjb25zaWRlcmVkIHRoZSAqKm5leHQqKiBzdGF0ZSBvZiB0aGUgdHJlZSwgYW5kIHRoZSBjaGFuZ2UgbGlzdGVuZXJzXG4gICAqIHdpbGwgYmUgbm90aWZpZWQuXG4gICAqXG4gICAqIFRoZSBiYXNlIGltcGxlbWVudGF0aW9uIG9ubHkgc3VwcG9ydHMgcGxhaW4gb2JqZWN0IGFjdGlvbnMuIElmIHlvdSB3YW50IHRvXG4gICAqIGRpc3BhdGNoIGEgUHJvbWlzZSwgYW4gT2JzZXJ2YWJsZSwgYSB0aHVuaywgb3Igc29tZXRoaW5nIGVsc2UsIHlvdSBuZWVkIHRvXG4gICAqIHdyYXAgeW91ciBzdG9yZSBjcmVhdGluZyBmdW5jdGlvbiBpbnRvIHRoZSBjb3JyZXNwb25kaW5nIG1pZGRsZXdhcmUuIEZvclxuICAgKiBleGFtcGxlLCBzZWUgdGhlIGRvY3VtZW50YXRpb24gZm9yIHRoZSBgcmVkdXgtdGh1bmtgIHBhY2thZ2UuIEV2ZW4gdGhlXG4gICAqIG1pZGRsZXdhcmUgd2lsbCBldmVudHVhbGx5IGRpc3BhdGNoIHBsYWluIG9iamVjdCBhY3Rpb25zIHVzaW5nIHRoaXMgbWV0aG9kLlxuICAgKlxuICAgKiBAcGFyYW0ge09iamVjdH0gYWN0aW9uIEEgcGxhaW4gb2JqZWN0IHJlcHJlc2VudGluZyBcdTIwMUN3aGF0IGNoYW5nZWRcdTIwMUQuIEl0IGlzXG4gICAqIGEgZ29vZCBpZGVhIHRvIGtlZXAgYWN0aW9ucyBzZXJpYWxpemFibGUgc28geW91IGNhbiByZWNvcmQgYW5kIHJlcGxheSB1c2VyXG4gICAqIHNlc3Npb25zLCBvciB1c2UgdGhlIHRpbWUgdHJhdmVsbGluZyBgcmVkdXgtZGV2dG9vbHNgLiBBbiBhY3Rpb24gbXVzdCBoYXZlXG4gICAqIGEgYHR5cGVgIHByb3BlcnR5IHdoaWNoIG1heSBub3QgYmUgYHVuZGVmaW5lZGAuIEl0IGlzIGEgZ29vZCBpZGVhIHRvIHVzZVxuICAgKiBzdHJpbmcgY29uc3RhbnRzIGZvciBhY3Rpb24gdHlwZXMuXG4gICAqXG4gICAqIEByZXR1cm5zIHtPYmplY3R9IEZvciBjb252ZW5pZW5jZSwgdGhlIHNhbWUgYWN0aW9uIG9iamVjdCB5b3UgZGlzcGF0Y2hlZC5cbiAgICpcbiAgICogTm90ZSB0aGF0LCBpZiB5b3UgdXNlIGEgY3VzdG9tIG1pZGRsZXdhcmUsIGl0IG1heSB3cmFwIGBkaXNwYXRjaCgpYCB0b1xuICAgKiByZXR1cm4gc29tZXRoaW5nIGVsc2UgKGZvciBleGFtcGxlLCBhIFByb21pc2UgeW91IGNhbiBhd2FpdCkuXG4gICAqL1xuXG5cbiAgZnVuY3Rpb24gZGlzcGF0Y2goYWN0aW9uKSB7XG4gICAgaWYgKCFpc1BsYWluT2JqZWN0KGFjdGlvbikpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihwcm9jZXNzLmVudi5OT0RFX0VOViA9PT0gXCJwcm9kdWN0aW9uXCIgPyBmb3JtYXRQcm9kRXJyb3JNZXNzYWdlKDcpIDogXCJBY3Rpb25zIG11c3QgYmUgcGxhaW4gb2JqZWN0cy4gSW5zdGVhZCwgdGhlIGFjdHVhbCB0eXBlIHdhczogJ1wiICsga2luZE9mKGFjdGlvbikgKyBcIicuIFlvdSBtYXkgbmVlZCB0byBhZGQgbWlkZGxld2FyZSB0byB5b3VyIHN0b3JlIHNldHVwIHRvIGhhbmRsZSBkaXNwYXRjaGluZyBvdGhlciB2YWx1ZXMsIHN1Y2ggYXMgJ3JlZHV4LXRodW5rJyB0byBoYW5kbGUgZGlzcGF0Y2hpbmcgZnVuY3Rpb25zLiBTZWUgaHR0cHM6Ly9yZWR1eC5qcy5vcmcvdHV0b3JpYWxzL2Z1bmRhbWVudGFscy9wYXJ0LTQtc3RvcmUjbWlkZGxld2FyZSBhbmQgaHR0cHM6Ly9yZWR1eC5qcy5vcmcvdHV0b3JpYWxzL2Z1bmRhbWVudGFscy9wYXJ0LTYtYXN5bmMtbG9naWMjdXNpbmctdGhlLXJlZHV4LXRodW5rLW1pZGRsZXdhcmUgZm9yIGV4YW1wbGVzLlwiKTtcbiAgICB9XG5cbiAgICBpZiAodHlwZW9mIGFjdGlvbi50eXBlID09PSAndW5kZWZpbmVkJykge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKHByb2Nlc3MuZW52Lk5PREVfRU5WID09PSBcInByb2R1Y3Rpb25cIiA/IGZvcm1hdFByb2RFcnJvck1lc3NhZ2UoOCkgOiAnQWN0aW9ucyBtYXkgbm90IGhhdmUgYW4gdW5kZWZpbmVkIFwidHlwZVwiIHByb3BlcnR5LiBZb3UgbWF5IGhhdmUgbWlzc3BlbGxlZCBhbiBhY3Rpb24gdHlwZSBzdHJpbmcgY29uc3RhbnQuJyk7XG4gICAgfVxuXG4gICAgaWYgKGlzRGlzcGF0Y2hpbmcpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihwcm9jZXNzLmVudi5OT0RFX0VOViA9PT0gXCJwcm9kdWN0aW9uXCIgPyBmb3JtYXRQcm9kRXJyb3JNZXNzYWdlKDkpIDogJ1JlZHVjZXJzIG1heSBub3QgZGlzcGF0Y2ggYWN0aW9ucy4nKTtcbiAgICB9XG5cbiAgICB0cnkge1xuICAgICAgaXNEaXNwYXRjaGluZyA9IHRydWU7XG4gICAgICBjdXJyZW50U3RhdGUgPSBjdXJyZW50UmVkdWNlcihjdXJyZW50U3RhdGUsIGFjdGlvbik7XG4gICAgfSBmaW5hbGx5IHtcbiAgICAgIGlzRGlzcGF0Y2hpbmcgPSBmYWxzZTtcbiAgICB9XG5cbiAgICB2YXIgbGlzdGVuZXJzID0gY3VycmVudExpc3RlbmVycyA9IG5leHRMaXN0ZW5lcnM7XG5cbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGxpc3RlbmVycy5sZW5ndGg7IGkrKykge1xuICAgICAgdmFyIGxpc3RlbmVyID0gbGlzdGVuZXJzW2ldO1xuICAgICAgbGlzdGVuZXIoKTtcbiAgICB9XG5cbiAgICByZXR1cm4gYWN0aW9uO1xuICB9XG4gIC8qKlxuICAgKiBSZXBsYWNlcyB0aGUgcmVkdWNlciBjdXJyZW50bHkgdXNlZCBieSB0aGUgc3RvcmUgdG8gY2FsY3VsYXRlIHRoZSBzdGF0ZS5cbiAgICpcbiAgICogWW91IG1pZ2h0IG5lZWQgdGhpcyBpZiB5b3VyIGFwcCBpbXBsZW1lbnRzIGNvZGUgc3BsaXR0aW5nIGFuZCB5b3Ugd2FudCB0b1xuICAgKiBsb2FkIHNvbWUgb2YgdGhlIHJlZHVjZXJzIGR5bmFtaWNhbGx5LiBZb3UgbWlnaHQgYWxzbyBuZWVkIHRoaXMgaWYgeW91XG4gICAqIGltcGxlbWVudCBhIGhvdCByZWxvYWRpbmcgbWVjaGFuaXNtIGZvciBSZWR1eC5cbiAgICpcbiAgICogQHBhcmFtIHtGdW5jdGlvbn0gbmV4dFJlZHVjZXIgVGhlIHJlZHVjZXIgZm9yIHRoZSBzdG9yZSB0byB1c2UgaW5zdGVhZC5cbiAgICogQHJldHVybnMge3ZvaWR9XG4gICAqL1xuXG5cbiAgZnVuY3Rpb24gcmVwbGFjZVJlZHVjZXIobmV4dFJlZHVjZXIpIHtcbiAgICBpZiAodHlwZW9mIG5leHRSZWR1Y2VyICE9PSAnZnVuY3Rpb24nKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IocHJvY2Vzcy5lbnYuTk9ERV9FTlYgPT09IFwicHJvZHVjdGlvblwiID8gZm9ybWF0UHJvZEVycm9yTWVzc2FnZSgxMCkgOiBcIkV4cGVjdGVkIHRoZSBuZXh0UmVkdWNlciB0byBiZSBhIGZ1bmN0aW9uLiBJbnN0ZWFkLCByZWNlaXZlZDogJ1wiICsga2luZE9mKG5leHRSZWR1Y2VyKSk7XG4gICAgfVxuXG4gICAgY3VycmVudFJlZHVjZXIgPSBuZXh0UmVkdWNlcjsgLy8gVGhpcyBhY3Rpb24gaGFzIGEgc2ltaWxpYXIgZWZmZWN0IHRvIEFjdGlvblR5cGVzLklOSVQuXG4gICAgLy8gQW55IHJlZHVjZXJzIHRoYXQgZXhpc3RlZCBpbiBib3RoIHRoZSBuZXcgYW5kIG9sZCByb290UmVkdWNlclxuICAgIC8vIHdpbGwgcmVjZWl2ZSB0aGUgcHJldmlvdXMgc3RhdGUuIFRoaXMgZWZmZWN0aXZlbHkgcG9wdWxhdGVzXG4gICAgLy8gdGhlIG5ldyBzdGF0ZSB0cmVlIHdpdGggYW55IHJlbGV2YW50IGRhdGEgZnJvbSB0aGUgb2xkIG9uZS5cblxuICAgIGRpc3BhdGNoKHtcbiAgICAgIHR5cGU6IEFjdGlvblR5cGVzLlJFUExBQ0VcbiAgICB9KTtcbiAgfVxuICAvKipcbiAgICogSW50ZXJvcGVyYWJpbGl0eSBwb2ludCBmb3Igb2JzZXJ2YWJsZS9yZWFjdGl2ZSBsaWJyYXJpZXMuXG4gICAqIEByZXR1cm5zIHtvYnNlcnZhYmxlfSBBIG1pbmltYWwgb2JzZXJ2YWJsZSBvZiBzdGF0ZSBjaGFuZ2VzLlxuICAgKiBGb3IgbW9yZSBpbmZvcm1hdGlvbiwgc2VlIHRoZSBvYnNlcnZhYmxlIHByb3Bvc2FsOlxuICAgKiBodHRwczovL2dpdGh1Yi5jb20vdGMzOS9wcm9wb3NhbC1vYnNlcnZhYmxlXG4gICAqL1xuXG5cbiAgZnVuY3Rpb24gb2JzZXJ2YWJsZSgpIHtcbiAgICB2YXIgX3JlZjtcblxuICAgIHZhciBvdXRlclN1YnNjcmliZSA9IHN1YnNjcmliZTtcbiAgICByZXR1cm4gX3JlZiA9IHtcbiAgICAgIC8qKlxuICAgICAgICogVGhlIG1pbmltYWwgb2JzZXJ2YWJsZSBzdWJzY3JpcHRpb24gbWV0aG9kLlxuICAgICAgICogQHBhcmFtIHtPYmplY3R9IG9ic2VydmVyIEFueSBvYmplY3QgdGhhdCBjYW4gYmUgdXNlZCBhcyBhbiBvYnNlcnZlci5cbiAgICAgICAqIFRoZSBvYnNlcnZlciBvYmplY3Qgc2hvdWxkIGhhdmUgYSBgbmV4dGAgbWV0aG9kLlxuICAgICAgICogQHJldHVybnMge3N1YnNjcmlwdGlvbn0gQW4gb2JqZWN0IHdpdGggYW4gYHVuc3Vic2NyaWJlYCBtZXRob2QgdGhhdCBjYW5cbiAgICAgICAqIGJlIHVzZWQgdG8gdW5zdWJzY3JpYmUgdGhlIG9ic2VydmFibGUgZnJvbSB0aGUgc3RvcmUsIGFuZCBwcmV2ZW50IGZ1cnRoZXJcbiAgICAgICAqIGVtaXNzaW9uIG9mIHZhbHVlcyBmcm9tIHRoZSBvYnNlcnZhYmxlLlxuICAgICAgICovXG4gICAgICBzdWJzY3JpYmU6IGZ1bmN0aW9uIHN1YnNjcmliZShvYnNlcnZlcikge1xuICAgICAgICBpZiAodHlwZW9mIG9ic2VydmVyICE9PSAnb2JqZWN0JyB8fCBvYnNlcnZlciA9PT0gbnVsbCkge1xuICAgICAgICAgIHRocm93IG5ldyBFcnJvcihwcm9jZXNzLmVudi5OT0RFX0VOViA9PT0gXCJwcm9kdWN0aW9uXCIgPyBmb3JtYXRQcm9kRXJyb3JNZXNzYWdlKDExKSA6IFwiRXhwZWN0ZWQgdGhlIG9ic2VydmVyIHRvIGJlIGFuIG9iamVjdC4gSW5zdGVhZCwgcmVjZWl2ZWQ6ICdcIiArIGtpbmRPZihvYnNlcnZlcikgKyBcIidcIik7XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiBvYnNlcnZlU3RhdGUoKSB7XG4gICAgICAgICAgaWYgKG9ic2VydmVyLm5leHQpIHtcbiAgICAgICAgICAgIG9ic2VydmVyLm5leHQoZ2V0U3RhdGUoKSk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgb2JzZXJ2ZVN0YXRlKCk7XG4gICAgICAgIHZhciB1bnN1YnNjcmliZSA9IG91dGVyU3Vic2NyaWJlKG9ic2VydmVTdGF0ZSk7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgdW5zdWJzY3JpYmU6IHVuc3Vic2NyaWJlXG4gICAgICAgIH07XG4gICAgICB9XG4gICAgfSwgX3JlZlskJG9ic2VydmFibGVdID0gZnVuY3Rpb24gKCkge1xuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfSwgX3JlZjtcbiAgfSAvLyBXaGVuIGEgc3RvcmUgaXMgY3JlYXRlZCwgYW4gXCJJTklUXCIgYWN0aW9uIGlzIGRpc3BhdGNoZWQgc28gdGhhdCBldmVyeVxuICAvLyByZWR1Y2VyIHJldHVybnMgdGhlaXIgaW5pdGlhbCBzdGF0ZS4gVGhpcyBlZmZlY3RpdmVseSBwb3B1bGF0ZXNcbiAgLy8gdGhlIGluaXRpYWwgc3RhdGUgdHJlZS5cblxuXG4gIGRpc3BhdGNoKHtcbiAgICB0eXBlOiBBY3Rpb25UeXBlcy5JTklUXG4gIH0pO1xuICByZXR1cm4gX3JlZjIgPSB7XG4gICAgZGlzcGF0Y2g6IGRpc3BhdGNoLFxuICAgIHN1YnNjcmliZTogc3Vic2NyaWJlLFxuICAgIGdldFN0YXRlOiBnZXRTdGF0ZSxcbiAgICByZXBsYWNlUmVkdWNlcjogcmVwbGFjZVJlZHVjZXJcbiAgfSwgX3JlZjJbJCRvYnNlcnZhYmxlXSA9IG9ic2VydmFibGUsIF9yZWYyO1xufVxuLyoqXG4gKiBDcmVhdGVzIGEgUmVkdXggc3RvcmUgdGhhdCBob2xkcyB0aGUgc3RhdGUgdHJlZS5cbiAqXG4gKiAqKldlIHJlY29tbWVuZCB1c2luZyBgY29uZmlndXJlU3RvcmVgIGZyb20gdGhlXG4gKiBgQHJlZHV4anMvdG9vbGtpdGAgcGFja2FnZSoqLCB3aGljaCByZXBsYWNlcyBgY3JlYXRlU3RvcmVgOlxuICogKipodHRwczovL3JlZHV4LmpzLm9yZy9pbnRyb2R1Y3Rpb24vd2h5LXJ0ay1pcy1yZWR1eC10b2RheSoqXG4gKlxuICogVGhlIG9ubHkgd2F5IHRvIGNoYW5nZSB0aGUgZGF0YSBpbiB0aGUgc3RvcmUgaXMgdG8gY2FsbCBgZGlzcGF0Y2goKWAgb24gaXQuXG4gKlxuICogVGhlcmUgc2hvdWxkIG9ubHkgYmUgYSBzaW5nbGUgc3RvcmUgaW4geW91ciBhcHAuIFRvIHNwZWNpZnkgaG93IGRpZmZlcmVudFxuICogcGFydHMgb2YgdGhlIHN0YXRlIHRyZWUgcmVzcG9uZCB0byBhY3Rpb25zLCB5b3UgbWF5IGNvbWJpbmUgc2V2ZXJhbCByZWR1Y2Vyc1xuICogaW50byBhIHNpbmdsZSByZWR1Y2VyIGZ1bmN0aW9uIGJ5IHVzaW5nIGBjb21iaW5lUmVkdWNlcnNgLlxuICpcbiAqIEBwYXJhbSB7RnVuY3Rpb259IHJlZHVjZXIgQSBmdW5jdGlvbiB0aGF0IHJldHVybnMgdGhlIG5leHQgc3RhdGUgdHJlZSwgZ2l2ZW5cbiAqIHRoZSBjdXJyZW50IHN0YXRlIHRyZWUgYW5kIHRoZSBhY3Rpb24gdG8gaGFuZGxlLlxuICpcbiAqIEBwYXJhbSB7YW55fSBbcHJlbG9hZGVkU3RhdGVdIFRoZSBpbml0aWFsIHN0YXRlLiBZb3UgbWF5IG9wdGlvbmFsbHkgc3BlY2lmeSBpdFxuICogdG8gaHlkcmF0ZSB0aGUgc3RhdGUgZnJvbSB0aGUgc2VydmVyIGluIHVuaXZlcnNhbCBhcHBzLCBvciB0byByZXN0b3JlIGFcbiAqIHByZXZpb3VzbHkgc2VyaWFsaXplZCB1c2VyIHNlc3Npb24uXG4gKiBJZiB5b3UgdXNlIGBjb21iaW5lUmVkdWNlcnNgIHRvIHByb2R1Y2UgdGhlIHJvb3QgcmVkdWNlciBmdW5jdGlvbiwgdGhpcyBtdXN0IGJlXG4gKiBhbiBvYmplY3Qgd2l0aCB0aGUgc2FtZSBzaGFwZSBhcyBgY29tYmluZVJlZHVjZXJzYCBrZXlzLlxuICpcbiAqIEBwYXJhbSB7RnVuY3Rpb259IFtlbmhhbmNlcl0gVGhlIHN0b3JlIGVuaGFuY2VyLiBZb3UgbWF5IG9wdGlvbmFsbHkgc3BlY2lmeSBpdFxuICogdG8gZW5oYW5jZSB0aGUgc3RvcmUgd2l0aCB0aGlyZC1wYXJ0eSBjYXBhYmlsaXRpZXMgc3VjaCBhcyBtaWRkbGV3YXJlLFxuICogdGltZSB0cmF2ZWwsIHBlcnNpc3RlbmNlLCBldGMuIFRoZSBvbmx5IHN0b3JlIGVuaGFuY2VyIHRoYXQgc2hpcHMgd2l0aCBSZWR1eFxuICogaXMgYGFwcGx5TWlkZGxld2FyZSgpYC5cbiAqXG4gKiBAcmV0dXJucyB7U3RvcmV9IEEgUmVkdXggc3RvcmUgdGhhdCBsZXRzIHlvdSByZWFkIHRoZSBzdGF0ZSwgZGlzcGF0Y2ggYWN0aW9uc1xuICogYW5kIHN1YnNjcmliZSB0byBjaGFuZ2VzLlxuICovXG5cbnZhciBsZWdhY3lfY3JlYXRlU3RvcmUgPSBjcmVhdGVTdG9yZTtcblxuLyoqXG4gKiBQcmludHMgYSB3YXJuaW5nIGluIHRoZSBjb25zb2xlIGlmIGl0IGV4aXN0cy5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gbWVzc2FnZSBUaGUgd2FybmluZyBtZXNzYWdlLlxuICogQHJldHVybnMge3ZvaWR9XG4gKi9cbmZ1bmN0aW9uIHdhcm5pbmcobWVzc2FnZSkge1xuICAvKiBlc2xpbnQtZGlzYWJsZSBuby1jb25zb2xlICovXG4gIGlmICh0eXBlb2YgY29uc29sZSAhPT0gJ3VuZGVmaW5lZCcgJiYgdHlwZW9mIGNvbnNvbGUuZXJyb3IgPT09ICdmdW5jdGlvbicpIHtcbiAgICBjb25zb2xlLmVycm9yKG1lc3NhZ2UpO1xuICB9XG4gIC8qIGVzbGludC1lbmFibGUgbm8tY29uc29sZSAqL1xuXG5cbiAgdHJ5IHtcbiAgICAvLyBUaGlzIGVycm9yIHdhcyB0aHJvd24gYXMgYSBjb252ZW5pZW5jZSBzbyB0aGF0IGlmIHlvdSBlbmFibGVcbiAgICAvLyBcImJyZWFrIG9uIGFsbCBleGNlcHRpb25zXCIgaW4geW91ciBjb25zb2xlLFxuICAgIC8vIGl0IHdvdWxkIHBhdXNlIHRoZSBleGVjdXRpb24gYXQgdGhpcyBsaW5lLlxuICAgIHRocm93IG5ldyBFcnJvcihtZXNzYWdlKTtcbiAgfSBjYXRjaCAoZSkge30gLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby1lbXB0eVxuXG59XG5cbmZ1bmN0aW9uIGdldFVuZXhwZWN0ZWRTdGF0ZVNoYXBlV2FybmluZ01lc3NhZ2UoaW5wdXRTdGF0ZSwgcmVkdWNlcnMsIGFjdGlvbiwgdW5leHBlY3RlZEtleUNhY2hlKSB7XG4gIHZhciByZWR1Y2VyS2V5cyA9IE9iamVjdC5rZXlzKHJlZHVjZXJzKTtcbiAgdmFyIGFyZ3VtZW50TmFtZSA9IGFjdGlvbiAmJiBhY3Rpb24udHlwZSA9PT0gQWN0aW9uVHlwZXMuSU5JVCA/ICdwcmVsb2FkZWRTdGF0ZSBhcmd1bWVudCBwYXNzZWQgdG8gY3JlYXRlU3RvcmUnIDogJ3ByZXZpb3VzIHN0YXRlIHJlY2VpdmVkIGJ5IHRoZSByZWR1Y2VyJztcblxuICBpZiAocmVkdWNlcktleXMubGVuZ3RoID09PSAwKSB7XG4gICAgcmV0dXJuICdTdG9yZSBkb2VzIG5vdCBoYXZlIGEgdmFsaWQgcmVkdWNlci4gTWFrZSBzdXJlIHRoZSBhcmd1bWVudCBwYXNzZWQgJyArICd0byBjb21iaW5lUmVkdWNlcnMgaXMgYW4gb2JqZWN0IHdob3NlIHZhbHVlcyBhcmUgcmVkdWNlcnMuJztcbiAgfVxuXG4gIGlmICghaXNQbGFpbk9iamVjdChpbnB1dFN0YXRlKSkge1xuICAgIHJldHVybiBcIlRoZSBcIiArIGFyZ3VtZW50TmFtZSArIFwiIGhhcyB1bmV4cGVjdGVkIHR5cGUgb2YgXFxcIlwiICsga2luZE9mKGlucHV0U3RhdGUpICsgXCJcXFwiLiBFeHBlY3RlZCBhcmd1bWVudCB0byBiZSBhbiBvYmplY3Qgd2l0aCB0aGUgZm9sbG93aW5nIFwiICsgKFwia2V5czogXFxcIlwiICsgcmVkdWNlcktleXMuam9pbignXCIsIFwiJykgKyBcIlxcXCJcIik7XG4gIH1cblxuICB2YXIgdW5leHBlY3RlZEtleXMgPSBPYmplY3Qua2V5cyhpbnB1dFN0YXRlKS5maWx0ZXIoZnVuY3Rpb24gKGtleSkge1xuICAgIHJldHVybiAhcmVkdWNlcnMuaGFzT3duUHJvcGVydHkoa2V5KSAmJiAhdW5leHBlY3RlZEtleUNhY2hlW2tleV07XG4gIH0pO1xuICB1bmV4cGVjdGVkS2V5cy5mb3JFYWNoKGZ1bmN0aW9uIChrZXkpIHtcbiAgICB1bmV4cGVjdGVkS2V5Q2FjaGVba2V5XSA9IHRydWU7XG4gIH0pO1xuICBpZiAoYWN0aW9uICYmIGFjdGlvbi50eXBlID09PSBBY3Rpb25UeXBlcy5SRVBMQUNFKSByZXR1cm47XG5cbiAgaWYgKHVuZXhwZWN0ZWRLZXlzLmxlbmd0aCA+IDApIHtcbiAgICByZXR1cm4gXCJVbmV4cGVjdGVkIFwiICsgKHVuZXhwZWN0ZWRLZXlzLmxlbmd0aCA+IDEgPyAna2V5cycgOiAna2V5JykgKyBcIiBcIiArIChcIlxcXCJcIiArIHVuZXhwZWN0ZWRLZXlzLmpvaW4oJ1wiLCBcIicpICsgXCJcXFwiIGZvdW5kIGluIFwiICsgYXJndW1lbnROYW1lICsgXCIuIFwiKSArIFwiRXhwZWN0ZWQgdG8gZmluZCBvbmUgb2YgdGhlIGtub3duIHJlZHVjZXIga2V5cyBpbnN0ZWFkOiBcIiArIChcIlxcXCJcIiArIHJlZHVjZXJLZXlzLmpvaW4oJ1wiLCBcIicpICsgXCJcXFwiLiBVbmV4cGVjdGVkIGtleXMgd2lsbCBiZSBpZ25vcmVkLlwiKTtcbiAgfVxufVxuXG5mdW5jdGlvbiBhc3NlcnRSZWR1Y2VyU2hhcGUocmVkdWNlcnMpIHtcbiAgT2JqZWN0LmtleXMocmVkdWNlcnMpLmZvckVhY2goZnVuY3Rpb24gKGtleSkge1xuICAgIHZhciByZWR1Y2VyID0gcmVkdWNlcnNba2V5XTtcbiAgICB2YXIgaW5pdGlhbFN0YXRlID0gcmVkdWNlcih1bmRlZmluZWQsIHtcbiAgICAgIHR5cGU6IEFjdGlvblR5cGVzLklOSVRcbiAgICB9KTtcblxuICAgIGlmICh0eXBlb2YgaW5pdGlhbFN0YXRlID09PSAndW5kZWZpbmVkJykge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKHByb2Nlc3MuZW52Lk5PREVfRU5WID09PSBcInByb2R1Y3Rpb25cIiA/IGZvcm1hdFByb2RFcnJvck1lc3NhZ2UoMTIpIDogXCJUaGUgc2xpY2UgcmVkdWNlciBmb3Iga2V5IFxcXCJcIiArIGtleSArIFwiXFxcIiByZXR1cm5lZCB1bmRlZmluZWQgZHVyaW5nIGluaXRpYWxpemF0aW9uLiBcIiArIFwiSWYgdGhlIHN0YXRlIHBhc3NlZCB0byB0aGUgcmVkdWNlciBpcyB1bmRlZmluZWQsIHlvdSBtdXN0IFwiICsgXCJleHBsaWNpdGx5IHJldHVybiB0aGUgaW5pdGlhbCBzdGF0ZS4gVGhlIGluaXRpYWwgc3RhdGUgbWF5IFwiICsgXCJub3QgYmUgdW5kZWZpbmVkLiBJZiB5b3UgZG9uJ3Qgd2FudCB0byBzZXQgYSB2YWx1ZSBmb3IgdGhpcyByZWR1Y2VyLCBcIiArIFwieW91IGNhbiB1c2UgbnVsbCBpbnN0ZWFkIG9mIHVuZGVmaW5lZC5cIik7XG4gICAgfVxuXG4gICAgaWYgKHR5cGVvZiByZWR1Y2VyKHVuZGVmaW5lZCwge1xuICAgICAgdHlwZTogQWN0aW9uVHlwZXMuUFJPQkVfVU5LTk9XTl9BQ1RJT04oKVxuICAgIH0pID09PSAndW5kZWZpbmVkJykge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKHByb2Nlc3MuZW52Lk5PREVfRU5WID09PSBcInByb2R1Y3Rpb25cIiA/IGZvcm1hdFByb2RFcnJvck1lc3NhZ2UoMTMpIDogXCJUaGUgc2xpY2UgcmVkdWNlciBmb3Iga2V5IFxcXCJcIiArIGtleSArIFwiXFxcIiByZXR1cm5lZCB1bmRlZmluZWQgd2hlbiBwcm9iZWQgd2l0aCBhIHJhbmRvbSB0eXBlLiBcIiArIChcIkRvbid0IHRyeSB0byBoYW5kbGUgJ1wiICsgQWN0aW9uVHlwZXMuSU5JVCArIFwiJyBvciBvdGhlciBhY3Rpb25zIGluIFxcXCJyZWR1eC8qXFxcIiBcIikgKyBcIm5hbWVzcGFjZS4gVGhleSBhcmUgY29uc2lkZXJlZCBwcml2YXRlLiBJbnN0ZWFkLCB5b3UgbXVzdCByZXR1cm4gdGhlIFwiICsgXCJjdXJyZW50IHN0YXRlIGZvciBhbnkgdW5rbm93biBhY3Rpb25zLCB1bmxlc3MgaXQgaXMgdW5kZWZpbmVkLCBcIiArIFwiaW4gd2hpY2ggY2FzZSB5b3UgbXVzdCByZXR1cm4gdGhlIGluaXRpYWwgc3RhdGUsIHJlZ2FyZGxlc3Mgb2YgdGhlIFwiICsgXCJhY3Rpb24gdHlwZS4gVGhlIGluaXRpYWwgc3RhdGUgbWF5IG5vdCBiZSB1bmRlZmluZWQsIGJ1dCBjYW4gYmUgbnVsbC5cIik7XG4gICAgfVxuICB9KTtcbn1cbi8qKlxuICogVHVybnMgYW4gb2JqZWN0IHdob3NlIHZhbHVlcyBhcmUgZGlmZmVyZW50IHJlZHVjZXIgZnVuY3Rpb25zLCBpbnRvIGEgc2luZ2xlXG4gKiByZWR1Y2VyIGZ1bmN0aW9uLiBJdCB3aWxsIGNhbGwgZXZlcnkgY2hpbGQgcmVkdWNlciwgYW5kIGdhdGhlciB0aGVpciByZXN1bHRzXG4gKiBpbnRvIGEgc2luZ2xlIHN0YXRlIG9iamVjdCwgd2hvc2Uga2V5cyBjb3JyZXNwb25kIHRvIHRoZSBrZXlzIG9mIHRoZSBwYXNzZWRcbiAqIHJlZHVjZXIgZnVuY3Rpb25zLlxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSByZWR1Y2VycyBBbiBvYmplY3Qgd2hvc2UgdmFsdWVzIGNvcnJlc3BvbmQgdG8gZGlmZmVyZW50XG4gKiByZWR1Y2VyIGZ1bmN0aW9ucyB0aGF0IG5lZWQgdG8gYmUgY29tYmluZWQgaW50byBvbmUuIE9uZSBoYW5keSB3YXkgdG8gb2J0YWluXG4gKiBpdCBpcyB0byB1c2UgRVM2IGBpbXBvcnQgKiBhcyByZWR1Y2Vyc2Agc3ludGF4LiBUaGUgcmVkdWNlcnMgbWF5IG5ldmVyIHJldHVyblxuICogdW5kZWZpbmVkIGZvciBhbnkgYWN0aW9uLiBJbnN0ZWFkLCB0aGV5IHNob3VsZCByZXR1cm4gdGhlaXIgaW5pdGlhbCBzdGF0ZVxuICogaWYgdGhlIHN0YXRlIHBhc3NlZCB0byB0aGVtIHdhcyB1bmRlZmluZWQsIGFuZCB0aGUgY3VycmVudCBzdGF0ZSBmb3IgYW55XG4gKiB1bnJlY29nbml6ZWQgYWN0aW9uLlxuICpcbiAqIEByZXR1cm5zIHtGdW5jdGlvbn0gQSByZWR1Y2VyIGZ1bmN0aW9uIHRoYXQgaW52b2tlcyBldmVyeSByZWR1Y2VyIGluc2lkZSB0aGVcbiAqIHBhc3NlZCBvYmplY3QsIGFuZCBidWlsZHMgYSBzdGF0ZSBvYmplY3Qgd2l0aCB0aGUgc2FtZSBzaGFwZS5cbiAqL1xuXG5cbmZ1bmN0aW9uIGNvbWJpbmVSZWR1Y2VycyhyZWR1Y2Vycykge1xuICB2YXIgcmVkdWNlcktleXMgPSBPYmplY3Qua2V5cyhyZWR1Y2Vycyk7XG4gIHZhciBmaW5hbFJlZHVjZXJzID0ge307XG5cbiAgZm9yICh2YXIgaSA9IDA7IGkgPCByZWR1Y2VyS2V5cy5sZW5ndGg7IGkrKykge1xuICAgIHZhciBrZXkgPSByZWR1Y2VyS2V5c1tpXTtcblxuICAgIGlmIChwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nKSB7XG4gICAgICBpZiAodHlwZW9mIHJlZHVjZXJzW2tleV0gPT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgIHdhcm5pbmcoXCJObyByZWR1Y2VyIHByb3ZpZGVkIGZvciBrZXkgXFxcIlwiICsga2V5ICsgXCJcXFwiXCIpO1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmICh0eXBlb2YgcmVkdWNlcnNba2V5XSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgZmluYWxSZWR1Y2Vyc1trZXldID0gcmVkdWNlcnNba2V5XTtcbiAgICB9XG4gIH1cblxuICB2YXIgZmluYWxSZWR1Y2VyS2V5cyA9IE9iamVjdC5rZXlzKGZpbmFsUmVkdWNlcnMpOyAvLyBUaGlzIGlzIHVzZWQgdG8gbWFrZSBzdXJlIHdlIGRvbid0IHdhcm4gYWJvdXQgdGhlIHNhbWVcbiAgLy8ga2V5cyBtdWx0aXBsZSB0aW1lcy5cblxuICB2YXIgdW5leHBlY3RlZEtleUNhY2hlO1xuXG4gIGlmIChwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nKSB7XG4gICAgdW5leHBlY3RlZEtleUNhY2hlID0ge307XG4gIH1cblxuICB2YXIgc2hhcGVBc3NlcnRpb25FcnJvcjtcblxuICB0cnkge1xuICAgIGFzc2VydFJlZHVjZXJTaGFwZShmaW5hbFJlZHVjZXJzKTtcbiAgfSBjYXRjaCAoZSkge1xuICAgIHNoYXBlQXNzZXJ0aW9uRXJyb3IgPSBlO1xuICB9XG5cbiAgcmV0dXJuIGZ1bmN0aW9uIGNvbWJpbmF0aW9uKHN0YXRlLCBhY3Rpb24pIHtcbiAgICBpZiAoc3RhdGUgPT09IHZvaWQgMCkge1xuICAgICAgc3RhdGUgPSB7fTtcbiAgICB9XG5cbiAgICBpZiAoc2hhcGVBc3NlcnRpb25FcnJvcikge1xuICAgICAgdGhyb3cgc2hhcGVBc3NlcnRpb25FcnJvcjtcbiAgICB9XG5cbiAgICBpZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJykge1xuICAgICAgdmFyIHdhcm5pbmdNZXNzYWdlID0gZ2V0VW5leHBlY3RlZFN0YXRlU2hhcGVXYXJuaW5nTWVzc2FnZShzdGF0ZSwgZmluYWxSZWR1Y2VycywgYWN0aW9uLCB1bmV4cGVjdGVkS2V5Q2FjaGUpO1xuXG4gICAgICBpZiAod2FybmluZ01lc3NhZ2UpIHtcbiAgICAgICAgd2FybmluZyh3YXJuaW5nTWVzc2FnZSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgdmFyIGhhc0NoYW5nZWQgPSBmYWxzZTtcbiAgICB2YXIgbmV4dFN0YXRlID0ge307XG5cbiAgICBmb3IgKHZhciBfaSA9IDA7IF9pIDwgZmluYWxSZWR1Y2VyS2V5cy5sZW5ndGg7IF9pKyspIHtcbiAgICAgIHZhciBfa2V5ID0gZmluYWxSZWR1Y2VyS2V5c1tfaV07XG4gICAgICB2YXIgcmVkdWNlciA9IGZpbmFsUmVkdWNlcnNbX2tleV07XG4gICAgICB2YXIgcHJldmlvdXNTdGF0ZUZvcktleSA9IHN0YXRlW19rZXldO1xuICAgICAgdmFyIG5leHRTdGF0ZUZvcktleSA9IHJlZHVjZXIocHJldmlvdXNTdGF0ZUZvcktleSwgYWN0aW9uKTtcblxuICAgICAgaWYgKHR5cGVvZiBuZXh0U3RhdGVGb3JLZXkgPT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgIHZhciBhY3Rpb25UeXBlID0gYWN0aW9uICYmIGFjdGlvbi50eXBlO1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IocHJvY2Vzcy5lbnYuTk9ERV9FTlYgPT09IFwicHJvZHVjdGlvblwiID8gZm9ybWF0UHJvZEVycm9yTWVzc2FnZSgxNCkgOiBcIldoZW4gY2FsbGVkIHdpdGggYW4gYWN0aW9uIG9mIHR5cGUgXCIgKyAoYWN0aW9uVHlwZSA/IFwiXFxcIlwiICsgU3RyaW5nKGFjdGlvblR5cGUpICsgXCJcXFwiXCIgOiAnKHVua25vd24gdHlwZSknKSArIFwiLCB0aGUgc2xpY2UgcmVkdWNlciBmb3Iga2V5IFxcXCJcIiArIF9rZXkgKyBcIlxcXCIgcmV0dXJuZWQgdW5kZWZpbmVkLiBcIiArIFwiVG8gaWdub3JlIGFuIGFjdGlvbiwgeW91IG11c3QgZXhwbGljaXRseSByZXR1cm4gdGhlIHByZXZpb3VzIHN0YXRlLiBcIiArIFwiSWYgeW91IHdhbnQgdGhpcyByZWR1Y2VyIHRvIGhvbGQgbm8gdmFsdWUsIHlvdSBjYW4gcmV0dXJuIG51bGwgaW5zdGVhZCBvZiB1bmRlZmluZWQuXCIpO1xuICAgICAgfVxuXG4gICAgICBuZXh0U3RhdGVbX2tleV0gPSBuZXh0U3RhdGVGb3JLZXk7XG4gICAgICBoYXNDaGFuZ2VkID0gaGFzQ2hhbmdlZCB8fCBuZXh0U3RhdGVGb3JLZXkgIT09IHByZXZpb3VzU3RhdGVGb3JLZXk7XG4gICAgfVxuXG4gICAgaGFzQ2hhbmdlZCA9IGhhc0NoYW5nZWQgfHwgZmluYWxSZWR1Y2VyS2V5cy5sZW5ndGggIT09IE9iamVjdC5rZXlzKHN0YXRlKS5sZW5ndGg7XG4gICAgcmV0dXJuIGhhc0NoYW5nZWQgPyBuZXh0U3RhdGUgOiBzdGF0ZTtcbiAgfTtcbn1cblxuZnVuY3Rpb24gYmluZEFjdGlvbkNyZWF0b3IoYWN0aW9uQ3JlYXRvciwgZGlzcGF0Y2gpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gZGlzcGF0Y2goYWN0aW9uQ3JlYXRvci5hcHBseSh0aGlzLCBhcmd1bWVudHMpKTtcbiAgfTtcbn1cbi8qKlxuICogVHVybnMgYW4gb2JqZWN0IHdob3NlIHZhbHVlcyBhcmUgYWN0aW9uIGNyZWF0b3JzLCBpbnRvIGFuIG9iamVjdCB3aXRoIHRoZVxuICogc2FtZSBrZXlzLCBidXQgd2l0aCBldmVyeSBmdW5jdGlvbiB3cmFwcGVkIGludG8gYSBgZGlzcGF0Y2hgIGNhbGwgc28gdGhleVxuICogbWF5IGJlIGludm9rZWQgZGlyZWN0bHkuIFRoaXMgaXMganVzdCBhIGNvbnZlbmllbmNlIG1ldGhvZCwgYXMgeW91IGNhbiBjYWxsXG4gKiBgc3RvcmUuZGlzcGF0Y2goTXlBY3Rpb25DcmVhdG9ycy5kb1NvbWV0aGluZygpKWAgeW91cnNlbGYganVzdCBmaW5lLlxuICpcbiAqIEZvciBjb252ZW5pZW5jZSwgeW91IGNhbiBhbHNvIHBhc3MgYW4gYWN0aW9uIGNyZWF0b3IgYXMgdGhlIGZpcnN0IGFyZ3VtZW50LFxuICogYW5kIGdldCBhIGRpc3BhdGNoIHdyYXBwZWQgZnVuY3Rpb24gaW4gcmV0dXJuLlxuICpcbiAqIEBwYXJhbSB7RnVuY3Rpb258T2JqZWN0fSBhY3Rpb25DcmVhdG9ycyBBbiBvYmplY3Qgd2hvc2UgdmFsdWVzIGFyZSBhY3Rpb25cbiAqIGNyZWF0b3IgZnVuY3Rpb25zLiBPbmUgaGFuZHkgd2F5IHRvIG9idGFpbiBpdCBpcyB0byB1c2UgRVM2IGBpbXBvcnQgKiBhc2BcbiAqIHN5bnRheC4gWW91IG1heSBhbHNvIHBhc3MgYSBzaW5nbGUgZnVuY3Rpb24uXG4gKlxuICogQHBhcmFtIHtGdW5jdGlvbn0gZGlzcGF0Y2ggVGhlIGBkaXNwYXRjaGAgZnVuY3Rpb24gYXZhaWxhYmxlIG9uIHlvdXIgUmVkdXhcbiAqIHN0b3JlLlxuICpcbiAqIEByZXR1cm5zIHtGdW5jdGlvbnxPYmplY3R9IFRoZSBvYmplY3QgbWltaWNraW5nIHRoZSBvcmlnaW5hbCBvYmplY3QsIGJ1dCB3aXRoXG4gKiBldmVyeSBhY3Rpb24gY3JlYXRvciB3cmFwcGVkIGludG8gdGhlIGBkaXNwYXRjaGAgY2FsbC4gSWYgeW91IHBhc3NlZCBhXG4gKiBmdW5jdGlvbiBhcyBgYWN0aW9uQ3JlYXRvcnNgLCB0aGUgcmV0dXJuIHZhbHVlIHdpbGwgYWxzbyBiZSBhIHNpbmdsZVxuICogZnVuY3Rpb24uXG4gKi9cblxuXG5mdW5jdGlvbiBiaW5kQWN0aW9uQ3JlYXRvcnMoYWN0aW9uQ3JlYXRvcnMsIGRpc3BhdGNoKSB7XG4gIGlmICh0eXBlb2YgYWN0aW9uQ3JlYXRvcnMgPT09ICdmdW5jdGlvbicpIHtcbiAgICByZXR1cm4gYmluZEFjdGlvbkNyZWF0b3IoYWN0aW9uQ3JlYXRvcnMsIGRpc3BhdGNoKTtcbiAgfVxuXG4gIGlmICh0eXBlb2YgYWN0aW9uQ3JlYXRvcnMgIT09ICdvYmplY3QnIHx8IGFjdGlvbkNyZWF0b3JzID09PSBudWxsKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKHByb2Nlc3MuZW52Lk5PREVfRU5WID09PSBcInByb2R1Y3Rpb25cIiA/IGZvcm1hdFByb2RFcnJvck1lc3NhZ2UoMTYpIDogXCJiaW5kQWN0aW9uQ3JlYXRvcnMgZXhwZWN0ZWQgYW4gb2JqZWN0IG9yIGEgZnVuY3Rpb24sIGJ1dCBpbnN0ZWFkIHJlY2VpdmVkOiAnXCIgKyBraW5kT2YoYWN0aW9uQ3JlYXRvcnMpICsgXCInLiBcIiArIFwiRGlkIHlvdSB3cml0ZSBcXFwiaW1wb3J0IEFjdGlvbkNyZWF0b3JzIGZyb21cXFwiIGluc3RlYWQgb2YgXFxcImltcG9ydCAqIGFzIEFjdGlvbkNyZWF0b3JzIGZyb21cXFwiP1wiKTtcbiAgfVxuXG4gIHZhciBib3VuZEFjdGlvbkNyZWF0b3JzID0ge307XG5cbiAgZm9yICh2YXIga2V5IGluIGFjdGlvbkNyZWF0b3JzKSB7XG4gICAgdmFyIGFjdGlvbkNyZWF0b3IgPSBhY3Rpb25DcmVhdG9yc1trZXldO1xuXG4gICAgaWYgKHR5cGVvZiBhY3Rpb25DcmVhdG9yID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICBib3VuZEFjdGlvbkNyZWF0b3JzW2tleV0gPSBiaW5kQWN0aW9uQ3JlYXRvcihhY3Rpb25DcmVhdG9yLCBkaXNwYXRjaCk7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIGJvdW5kQWN0aW9uQ3JlYXRvcnM7XG59XG5cbi8qKlxuICogQ29tcG9zZXMgc2luZ2xlLWFyZ3VtZW50IGZ1bmN0aW9ucyBmcm9tIHJpZ2h0IHRvIGxlZnQuIFRoZSByaWdodG1vc3RcbiAqIGZ1bmN0aW9uIGNhbiB0YWtlIG11bHRpcGxlIGFyZ3VtZW50cyBhcyBpdCBwcm92aWRlcyB0aGUgc2lnbmF0dXJlIGZvclxuICogdGhlIHJlc3VsdGluZyBjb21wb3NpdGUgZnVuY3Rpb24uXG4gKlxuICogQHBhcmFtIHsuLi5GdW5jdGlvbn0gZnVuY3MgVGhlIGZ1bmN0aW9ucyB0byBjb21wb3NlLlxuICogQHJldHVybnMge0Z1bmN0aW9ufSBBIGZ1bmN0aW9uIG9idGFpbmVkIGJ5IGNvbXBvc2luZyB0aGUgYXJndW1lbnQgZnVuY3Rpb25zXG4gKiBmcm9tIHJpZ2h0IHRvIGxlZnQuIEZvciBleGFtcGxlLCBjb21wb3NlKGYsIGcsIGgpIGlzIGlkZW50aWNhbCB0byBkb2luZ1xuICogKC4uLmFyZ3MpID0+IGYoZyhoKC4uLmFyZ3MpKSkuXG4gKi9cbmZ1bmN0aW9uIGNvbXBvc2UoKSB7XG4gIGZvciAodmFyIF9sZW4gPSBhcmd1bWVudHMubGVuZ3RoLCBmdW5jcyA9IG5ldyBBcnJheShfbGVuKSwgX2tleSA9IDA7IF9rZXkgPCBfbGVuOyBfa2V5KyspIHtcbiAgICBmdW5jc1tfa2V5XSA9IGFyZ3VtZW50c1tfa2V5XTtcbiAgfVxuXG4gIGlmIChmdW5jcy5sZW5ndGggPT09IDApIHtcbiAgICByZXR1cm4gZnVuY3Rpb24gKGFyZykge1xuICAgICAgcmV0dXJuIGFyZztcbiAgICB9O1xuICB9XG5cbiAgaWYgKGZ1bmNzLmxlbmd0aCA9PT0gMSkge1xuICAgIHJldHVybiBmdW5jc1swXTtcbiAgfVxuXG4gIHJldHVybiBmdW5jcy5yZWR1Y2UoZnVuY3Rpb24gKGEsIGIpIHtcbiAgICByZXR1cm4gZnVuY3Rpb24gKCkge1xuICAgICAgcmV0dXJuIGEoYi5hcHBseSh2b2lkIDAsIGFyZ3VtZW50cykpO1xuICAgIH07XG4gIH0pO1xufVxuXG4vKipcbiAqIENyZWF0ZXMgYSBzdG9yZSBlbmhhbmNlciB0aGF0IGFwcGxpZXMgbWlkZGxld2FyZSB0byB0aGUgZGlzcGF0Y2ggbWV0aG9kXG4gKiBvZiB0aGUgUmVkdXggc3RvcmUuIFRoaXMgaXMgaGFuZHkgZm9yIGEgdmFyaWV0eSBvZiB0YXNrcywgc3VjaCBhcyBleHByZXNzaW5nXG4gKiBhc3luY2hyb25vdXMgYWN0aW9ucyBpbiBhIGNvbmNpc2UgbWFubmVyLCBvciBsb2dnaW5nIGV2ZXJ5IGFjdGlvbiBwYXlsb2FkLlxuICpcbiAqIFNlZSBgcmVkdXgtdGh1bmtgIHBhY2thZ2UgYXMgYW4gZXhhbXBsZSBvZiB0aGUgUmVkdXggbWlkZGxld2FyZS5cbiAqXG4gKiBCZWNhdXNlIG1pZGRsZXdhcmUgaXMgcG90ZW50aWFsbHkgYXN5bmNocm9ub3VzLCB0aGlzIHNob3VsZCBiZSB0aGUgZmlyc3RcbiAqIHN0b3JlIGVuaGFuY2VyIGluIHRoZSBjb21wb3NpdGlvbiBjaGFpbi5cbiAqXG4gKiBOb3RlIHRoYXQgZWFjaCBtaWRkbGV3YXJlIHdpbGwgYmUgZ2l2ZW4gdGhlIGBkaXNwYXRjaGAgYW5kIGBnZXRTdGF0ZWAgZnVuY3Rpb25zXG4gKiBhcyBuYW1lZCBhcmd1bWVudHMuXG4gKlxuICogQHBhcmFtIHsuLi5GdW5jdGlvbn0gbWlkZGxld2FyZXMgVGhlIG1pZGRsZXdhcmUgY2hhaW4gdG8gYmUgYXBwbGllZC5cbiAqIEByZXR1cm5zIHtGdW5jdGlvbn0gQSBzdG9yZSBlbmhhbmNlciBhcHBseWluZyB0aGUgbWlkZGxld2FyZS5cbiAqL1xuXG5mdW5jdGlvbiBhcHBseU1pZGRsZXdhcmUoKSB7XG4gIGZvciAodmFyIF9sZW4gPSBhcmd1bWVudHMubGVuZ3RoLCBtaWRkbGV3YXJlcyA9IG5ldyBBcnJheShfbGVuKSwgX2tleSA9IDA7IF9rZXkgPCBfbGVuOyBfa2V5KyspIHtcbiAgICBtaWRkbGV3YXJlc1tfa2V5XSA9IGFyZ3VtZW50c1tfa2V5XTtcbiAgfVxuXG4gIHJldHVybiBmdW5jdGlvbiAoY3JlYXRlU3RvcmUpIHtcbiAgICByZXR1cm4gZnVuY3Rpb24gKCkge1xuICAgICAgdmFyIHN0b3JlID0gY3JlYXRlU3RvcmUuYXBwbHkodm9pZCAwLCBhcmd1bWVudHMpO1xuXG4gICAgICB2YXIgX2Rpc3BhdGNoID0gZnVuY3Rpb24gZGlzcGF0Y2goKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihwcm9jZXNzLmVudi5OT0RFX0VOViA9PT0gXCJwcm9kdWN0aW9uXCIgPyBmb3JtYXRQcm9kRXJyb3JNZXNzYWdlKDE1KSA6ICdEaXNwYXRjaGluZyB3aGlsZSBjb25zdHJ1Y3RpbmcgeW91ciBtaWRkbGV3YXJlIGlzIG5vdCBhbGxvd2VkLiAnICsgJ090aGVyIG1pZGRsZXdhcmUgd291bGQgbm90IGJlIGFwcGxpZWQgdG8gdGhpcyBkaXNwYXRjaC4nKTtcbiAgICAgIH07XG5cbiAgICAgIHZhciBtaWRkbGV3YXJlQVBJID0ge1xuICAgICAgICBnZXRTdGF0ZTogc3RvcmUuZ2V0U3RhdGUsXG4gICAgICAgIGRpc3BhdGNoOiBmdW5jdGlvbiBkaXNwYXRjaCgpIHtcbiAgICAgICAgICByZXR1cm4gX2Rpc3BhdGNoLmFwcGx5KHZvaWQgMCwgYXJndW1lbnRzKTtcbiAgICAgICAgfVxuICAgICAgfTtcbiAgICAgIHZhciBjaGFpbiA9IG1pZGRsZXdhcmVzLm1hcChmdW5jdGlvbiAobWlkZGxld2FyZSkge1xuICAgICAgICByZXR1cm4gbWlkZGxld2FyZShtaWRkbGV3YXJlQVBJKTtcbiAgICAgIH0pO1xuICAgICAgX2Rpc3BhdGNoID0gY29tcG9zZS5hcHBseSh2b2lkIDAsIGNoYWluKShzdG9yZS5kaXNwYXRjaCk7XG4gICAgICByZXR1cm4gX29iamVjdFNwcmVhZChfb2JqZWN0U3ByZWFkKHt9LCBzdG9yZSksIHt9LCB7XG4gICAgICAgIGRpc3BhdGNoOiBfZGlzcGF0Y2hcbiAgICAgIH0pO1xuICAgIH07XG4gIH07XG59XG5cbi8qXG4gKiBUaGlzIGlzIGEgZHVtbXkgZnVuY3Rpb24gdG8gY2hlY2sgaWYgdGhlIGZ1bmN0aW9uIG5hbWUgaGFzIGJlZW4gYWx0ZXJlZCBieSBtaW5pZmljYXRpb24uXG4gKiBJZiB0aGUgZnVuY3Rpb24gaGFzIGJlZW4gbWluaWZpZWQgYW5kIE5PREVfRU5WICE9PSAncHJvZHVjdGlvbicsIHdhcm4gdGhlIHVzZXIuXG4gKi9cblxuZnVuY3Rpb24gaXNDcnVzaGVkKCkge31cblxuaWYgKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicgJiYgdHlwZW9mIGlzQ3J1c2hlZC5uYW1lID09PSAnc3RyaW5nJyAmJiBpc0NydXNoZWQubmFtZSAhPT0gJ2lzQ3J1c2hlZCcpIHtcbiAgd2FybmluZygnWW91IGFyZSBjdXJyZW50bHkgdXNpbmcgbWluaWZpZWQgY29kZSBvdXRzaWRlIG9mIE5PREVfRU5WID09PSBcInByb2R1Y3Rpb25cIi4gJyArICdUaGlzIG1lYW5zIHRoYXQgeW91IGFyZSBydW5uaW5nIGEgc2xvd2VyIGRldmVsb3BtZW50IGJ1aWxkIG9mIFJlZHV4LiAnICsgJ1lvdSBjYW4gdXNlIGxvb3NlLWVudmlmeSAoaHR0cHM6Ly9naXRodWIuY29tL3plcnRvc2gvbG9vc2UtZW52aWZ5KSBmb3IgYnJvd3NlcmlmeSAnICsgJ29yIHNldHRpbmcgbW9kZSB0byBwcm9kdWN0aW9uIGluIHdlYnBhY2sgKGh0dHBzOi8vd2VicGFjay5qcy5vcmcvY29uY2VwdHMvbW9kZS8pICcgKyAndG8gZW5zdXJlIHlvdSBoYXZlIHRoZSBjb3JyZWN0IGNvZGUgZm9yIHlvdXIgcHJvZHVjdGlvbiBidWlsZC4nKTtcbn1cblxuZXhwb3J0IHsgQWN0aW9uVHlwZXMgYXMgX19ET19OT1RfVVNFX19BY3Rpb25UeXBlcywgYXBwbHlNaWRkbGV3YXJlLCBiaW5kQWN0aW9uQ3JlYXRvcnMsIGNvbWJpbmVSZWR1Y2VycywgY29tcG9zZSwgY3JlYXRlU3RvcmUsIGxlZ2FjeV9jcmVhdGVTdG9yZSB9O1xuIiwgImV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIF9kZWZpbmVQcm9wZXJ0eShvYmosIGtleSwgdmFsdWUpIHtcbiAgaWYgKGtleSBpbiBvYmopIHtcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkob2JqLCBrZXksIHtcbiAgICAgIHZhbHVlOiB2YWx1ZSxcbiAgICAgIGVudW1lcmFibGU6IHRydWUsXG4gICAgICBjb25maWd1cmFibGU6IHRydWUsXG4gICAgICB3cml0YWJsZTogdHJ1ZVxuICAgIH0pO1xuICB9IGVsc2Uge1xuICAgIG9ialtrZXldID0gdmFsdWU7XG4gIH1cbiAgcmV0dXJuIG9iajtcbn0iLCAiaW1wb3J0IGRlZmluZVByb3BlcnR5IGZyb20gXCIuL2RlZmluZVByb3BlcnR5LmpzXCI7XG5mdW5jdGlvbiBvd25LZXlzKG9iamVjdCwgZW51bWVyYWJsZU9ubHkpIHtcbiAgdmFyIGtleXMgPSBPYmplY3Qua2V5cyhvYmplY3QpO1xuICBpZiAoT2JqZWN0LmdldE93blByb3BlcnR5U3ltYm9scykge1xuICAgIHZhciBzeW1ib2xzID0gT2JqZWN0LmdldE93blByb3BlcnR5U3ltYm9scyhvYmplY3QpO1xuICAgIGVudW1lcmFibGVPbmx5ICYmIChzeW1ib2xzID0gc3ltYm9scy5maWx0ZXIoZnVuY3Rpb24gKHN5bSkge1xuICAgICAgcmV0dXJuIE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3Iob2JqZWN0LCBzeW0pLmVudW1lcmFibGU7XG4gICAgfSkpLCBrZXlzLnB1c2guYXBwbHkoa2V5cywgc3ltYm9scyk7XG4gIH1cbiAgcmV0dXJuIGtleXM7XG59XG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBfb2JqZWN0U3ByZWFkMih0YXJnZXQpIHtcbiAgZm9yICh2YXIgaSA9IDE7IGkgPCBhcmd1bWVudHMubGVuZ3RoOyBpKyspIHtcbiAgICB2YXIgc291cmNlID0gbnVsbCAhPSBhcmd1bWVudHNbaV0gPyBhcmd1bWVudHNbaV0gOiB7fTtcbiAgICBpICUgMiA/IG93bktleXMoT2JqZWN0KHNvdXJjZSksICEwKS5mb3JFYWNoKGZ1bmN0aW9uIChrZXkpIHtcbiAgICAgIGRlZmluZVByb3BlcnR5KHRhcmdldCwga2V5LCBzb3VyY2Vba2V5XSk7XG4gICAgfSkgOiBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9ycyA/IE9iamVjdC5kZWZpbmVQcm9wZXJ0aWVzKHRhcmdldCwgT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcnMoc291cmNlKSkgOiBvd25LZXlzKE9iamVjdChzb3VyY2UpKS5mb3JFYWNoKGZ1bmN0aW9uIChrZXkpIHtcbiAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0YXJnZXQsIGtleSwgT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcihzb3VyY2UsIGtleSkpO1xuICAgIH0pO1xuICB9XG4gIHJldHVybiB0YXJnZXQ7XG59IiwgIi8qKlxuICogaXNMaXN0ZW5lclxuICpcbiAqIGRldGVybWluZXMgaWYgYW4gYWN0aW9uIGlzIGEgbGlzdGVuZXIgb24gYW5vdGhlciBtb2RlbFxuICovXG5leHBvcnQgZGVmYXVsdCAoZnVuY3Rpb24gKHJlZHVjZXIpIHsgcmV0dXJuIHJlZHVjZXIuaW5kZXhPZignLycpID4gLTE7IH0pO1xuIiwgInZhciBfX2Fzc2lnbiA9ICh0aGlzICYmIHRoaXMuX19hc3NpZ24pIHx8IGZ1bmN0aW9uICgpIHtcbiAgICBfX2Fzc2lnbiA9IE9iamVjdC5hc3NpZ24gfHwgZnVuY3Rpb24odCkge1xuICAgICAgICBmb3IgKHZhciBzLCBpID0gMSwgbiA9IGFyZ3VtZW50cy5sZW5ndGg7IGkgPCBuOyBpKyspIHtcbiAgICAgICAgICAgIHMgPSBhcmd1bWVudHNbaV07XG4gICAgICAgICAgICBmb3IgKHZhciBwIGluIHMpIGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwocywgcCkpXG4gICAgICAgICAgICAgICAgdFtwXSA9IHNbcF07XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHQ7XG4gICAgfTtcbiAgICByZXR1cm4gX19hc3NpZ24uYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbn07XG52YXIgX19yZXN0ID0gKHRoaXMgJiYgdGhpcy5fX3Jlc3QpIHx8IGZ1bmN0aW9uIChzLCBlKSB7XG4gICAgdmFyIHQgPSB7fTtcbiAgICBmb3IgKHZhciBwIGluIHMpIGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwocywgcCkgJiYgZS5pbmRleE9mKHApIDwgMClcbiAgICAgICAgdFtwXSA9IHNbcF07XG4gICAgaWYgKHMgIT0gbnVsbCAmJiB0eXBlb2YgT2JqZWN0LmdldE93blByb3BlcnR5U3ltYm9scyA9PT0gXCJmdW5jdGlvblwiKVxuICAgICAgICBmb3IgKHZhciBpID0gMCwgcCA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eVN5bWJvbHMocyk7IGkgPCBwLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBpZiAoZS5pbmRleE9mKHBbaV0pIDwgMCAmJiBPYmplY3QucHJvdG90eXBlLnByb3BlcnR5SXNFbnVtZXJhYmxlLmNhbGwocywgcFtpXSkpXG4gICAgICAgICAgICAgICAgdFtwW2ldXSA9IHNbcFtpXV07XG4gICAgICAgIH1cbiAgICByZXR1cm4gdDtcbn07XG52YXIgX19zcHJlYWRBcnJheXMgPSAodGhpcyAmJiB0aGlzLl9fc3ByZWFkQXJyYXlzKSB8fCBmdW5jdGlvbiAoKSB7XG4gICAgZm9yICh2YXIgcyA9IDAsIGkgPSAwLCBpbCA9IGFyZ3VtZW50cy5sZW5ndGg7IGkgPCBpbDsgaSsrKSBzICs9IGFyZ3VtZW50c1tpXS5sZW5ndGg7XG4gICAgZm9yICh2YXIgciA9IEFycmF5KHMpLCBrID0gMCwgaSA9IDA7IGkgPCBpbDsgaSsrKVxuICAgICAgICBmb3IgKHZhciBhID0gYXJndW1lbnRzW2ldLCBqID0gMCwgamwgPSBhLmxlbmd0aDsgaiA8IGpsOyBqKyssIGsrKylcbiAgICAgICAgICAgIHJba10gPSBhW2pdO1xuICAgIHJldHVybiByO1xufTtcbmltcG9ydCAqIGFzIFJlZHV4IGZyb20gJ3JlZHV4JztcbmltcG9ydCBpc0xpc3RlbmVyIGZyb20gJy4vdXRpbHMvaXNMaXN0ZW5lcic7XG52YXIgY29tcG9zZUVuaGFuY2Vyc1dpdGhEZXZ0b29scyA9IGZ1bmN0aW9uIChkZXZ0b29sT3B0aW9ucykge1xuICAgIGlmIChkZXZ0b29sT3B0aW9ucyA9PT0gdm9pZCAwKSB7IGRldnRvb2xPcHRpb25zID0ge307IH1cbiAgICB2YXIgZGlzYWJsZWQgPSBkZXZ0b29sT3B0aW9ucy5kaXNhYmxlZCwgb3B0aW9ucyA9IF9fcmVzdChkZXZ0b29sT3B0aW9ucywgW1wiZGlzYWJsZWRcIl0pO1xuICAgIC8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICovXG4gICAgcmV0dXJuICFkaXNhYmxlZCAmJlxuICAgICAgICB0eXBlb2Ygd2luZG93ID09PSAnb2JqZWN0JyAmJlxuICAgICAgICB3aW5kb3cuX19SRURVWF9ERVZUT09MU19FWFRFTlNJT05fQ09NUE9TRV9fXG4gICAgICAgID8gd2luZG93Ll9fUkVEVVhfREVWVE9PTFNfRVhURU5TSU9OX0NPTVBPU0VfXyhvcHRpb25zKVxuICAgICAgICA6IFJlZHV4LmNvbXBvc2U7XG59O1xuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gKF9hKSB7XG4gICAgdmFyIF90aGlzID0gdGhpcztcbiAgICB2YXIgcmVkdXggPSBfYS5yZWR1eCwgbW9kZWxzID0gX2EubW9kZWxzO1xuICAgIHZhciBjb21iaW5lUmVkdWNlcnMgPSByZWR1eC5jb21iaW5lUmVkdWNlcnMgfHwgUmVkdXguY29tYmluZVJlZHVjZXJzO1xuICAgIHZhciBjcmVhdGVTdG9yZSA9IHJlZHV4LmNyZWF0ZVN0b3JlIHx8IFJlZHV4LmNyZWF0ZVN0b3JlO1xuICAgIHZhciBpbml0aWFsU3RhdGVzID0gdHlwZW9mIHJlZHV4LmluaXRpYWxTdGF0ZXMgIT09ICd1bmRlZmluZWQnID8gcmVkdXguaW5pdGlhbFN0YXRlcyA6IHt9O1xuICAgIC8vIEFsbG93cyBwYXNzaW5nIGluIG9mIHJlZHVjZXIgZnVuY3Rpb25zLCByYXRoZXIgdGhhbiBtb2RlbHMuXG4gICAgLy8gV2hpbGUgbm90IHJlY29tbWVuZGVkLFxuICAgIC8vIHRoaXMgY2FuIGJlIHVzZWQgZm9yIG1pZ3JhdGluZyBhIFJlZHV4IGNvZGViYXNlIG9yIGNvbmZpZ3VyaW5nIGRpZmZlcmVudCBSZWR1eCBleHRlbnNpb25zLlxuICAgIHRoaXMucmVkdWNlcnMgPSByZWR1eC5yZWR1Y2VycztcbiAgICAvLyBjb21iaW5lIG1vZGVscyB0byBnZW5lcmF0ZSByZWR1Y2Vyc1xuICAgIHRoaXMubWVyZ2VSZWR1Y2VycyA9IGZ1bmN0aW9uIChuZXh0UmVkdWNlcnMpIHtcbiAgICAgICAgaWYgKG5leHRSZWR1Y2VycyA9PT0gdm9pZCAwKSB7IG5leHRSZWR1Y2VycyA9IHt9OyB9XG4gICAgICAgIC8vIG1lcmdlIG5ldyByZWR1Y2VycyB3aXRoIGV4aXN0aW5nIHJlZHVjZXJzXG4gICAgICAgIF90aGlzLnJlZHVjZXJzID0gX19hc3NpZ24oX19hc3NpZ24oe30sIF90aGlzLnJlZHVjZXJzKSwgbmV4dFJlZHVjZXJzKTtcbiAgICAgICAgaWYgKCFPYmplY3Qua2V5cyhfdGhpcy5yZWR1Y2VycykubGVuZ3RoKSB7XG4gICAgICAgICAgICAvLyBubyByZWR1Y2VycywganVzdCByZXR1cm4gc3RhdGVcbiAgICAgICAgICAgIHJldHVybiBmdW5jdGlvbiAoc3RhdGUpIHsgcmV0dXJuIHN0YXRlOyB9O1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBjb21iaW5lUmVkdWNlcnMoX3RoaXMucmVkdWNlcnMpO1xuICAgIH07XG4gICAgdGhpcy5jcmVhdGVNb2RlbFJlZHVjZXIgPSBmdW5jdGlvbiAobW9kZWwpIHtcbiAgICAgICAgdmFyIG1vZGVsQmFzZVJlZHVjZXIgPSBtb2RlbC5iYXNlUmVkdWNlcjtcbiAgICAgICAgdmFyIG1vZGVsUmVkdWNlcnMgPSB7fTtcbiAgICAgICAgZm9yICh2YXIgX2kgPSAwLCBfYSA9IE9iamVjdC5rZXlzKG1vZGVsLnJlZHVjZXJzIHx8IHt9KTsgX2kgPCBfYS5sZW5ndGg7IF9pKyspIHtcbiAgICAgICAgICAgIHZhciBtb2RlbFJlZHVjZXIgPSBfYVtfaV07XG4gICAgICAgICAgICB2YXIgYWN0aW9uID0gaXNMaXN0ZW5lcihtb2RlbFJlZHVjZXIpXG4gICAgICAgICAgICAgICAgPyBtb2RlbFJlZHVjZXJcbiAgICAgICAgICAgICAgICA6IG1vZGVsLm5hbWUgKyBcIi9cIiArIG1vZGVsUmVkdWNlcjtcbiAgICAgICAgICAgIG1vZGVsUmVkdWNlcnNbYWN0aW9uXSA9IG1vZGVsLnJlZHVjZXJzW21vZGVsUmVkdWNlcl07XG4gICAgICAgIH1cbiAgICAgICAgLy8gdXNlIHRoZSBgc3RhdGUgPSBtb2RlbC5zdGF0ZWAgYXJndW1lbnQgY29udmVudGlvbiBwb3B1bGFyaXplZFxuICAgICAgICB2YXIgY29tYmluZWRSZWR1Y2VyID0gZnVuY3Rpb24gKHN0YXRlLCBhY3Rpb24pIHtcbiAgICAgICAgICAgIGlmIChzdGF0ZSA9PT0gdm9pZCAwKSB7IHN0YXRlID0gbW9kZWwuc3RhdGU7IH1cbiAgICAgICAgICAgIGlmICh0eXBlb2YgbW9kZWxSZWR1Y2Vyc1thY3Rpb24udHlwZV0gPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gbW9kZWxSZWR1Y2Vyc1thY3Rpb24udHlwZV0oc3RhdGUsIGFjdGlvbi5wYXlsb2FkLCBhY3Rpb24ubWV0YSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gc3RhdGU7XG4gICAgICAgIH07XG4gICAgICAgIF90aGlzLnJlZHVjZXJzW21vZGVsLm5hbWVdID0gIW1vZGVsQmFzZVJlZHVjZXJcbiAgICAgICAgICAgID8gY29tYmluZWRSZWR1Y2VyXG4gICAgICAgICAgICA6IGZ1bmN0aW9uIChzdGF0ZSwgYWN0aW9uKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGNvbWJpbmVkUmVkdWNlcihtb2RlbEJhc2VSZWR1Y2VyKHN0YXRlLCBhY3Rpb24pLCBhY3Rpb24pO1xuICAgICAgICAgICAgfTtcbiAgICB9O1xuICAgIC8vIGluaXRpYWxpemUgbW9kZWwgcmVkdWNlcnNcbiAgICBmb3IgKHZhciBfaSA9IDAsIG1vZGVsc18xID0gbW9kZWxzOyBfaSA8IG1vZGVsc18xLmxlbmd0aDsgX2krKykge1xuICAgICAgICB2YXIgbW9kZWwgPSBtb2RlbHNfMVtfaV07XG4gICAgICAgIHRoaXMuY3JlYXRlTW9kZWxSZWR1Y2VyKG1vZGVsKTtcbiAgICB9XG4gICAgLy8gcm9vdFJlZHVjZXJzIGlzIGEgd2F5IHRvIHNldHVwIG1pZGRsZXdhcmUgaG9va3MgYXQgdGhlIGJhc2Ugb2YgeW91ciByb290IHJlZHVjZXIuXG4gICAgLy8gVW5saWtlIG1pZGRsZXdhcmUsIHRoZSByZXR1cm4gdmFsdWUgaXMgdGhlIG5leHQgc3RhdGUuXG4gICAgLy8gSWYgdW5kZWZpbmVkLCB0aGUgc3RhdGUgd2lsbCBmYWxsYmFjayB0byB0aGUgaW5pdGlhbCBzdGF0ZSBvZiByZWR1Y2Vycy5cbiAgICB0aGlzLmNyZWF0ZVJvb3RSZWR1Y2VyID0gZnVuY3Rpb24gKHJvb3RSZWR1Y2Vycykge1xuICAgICAgICBpZiAocm9vdFJlZHVjZXJzID09PSB2b2lkIDApIHsgcm9vdFJlZHVjZXJzID0ge307IH1cbiAgICAgICAgdmFyIG1lcmdlZFJlZHVjZXJzID0gX3RoaXMubWVyZ2VSZWR1Y2VycygpO1xuICAgICAgICBpZiAoT2JqZWN0LmtleXMocm9vdFJlZHVjZXJzKS5sZW5ndGgpIHtcbiAgICAgICAgICAgIHJldHVybiBmdW5jdGlvbiAoc3RhdGUsIGFjdGlvbikge1xuICAgICAgICAgICAgICAgIHZhciByb290UmVkdWNlckFjdGlvbiA9IHJvb3RSZWR1Y2Vyc1thY3Rpb24udHlwZV07XG4gICAgICAgICAgICAgICAgaWYgKHJvb3RSZWR1Y2VyQWN0aW9uKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBtZXJnZWRSZWR1Y2Vycyhyb290UmVkdWNlckFjdGlvbihzdGF0ZSwgYWN0aW9uKSwgYWN0aW9uKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmV0dXJuIG1lcmdlZFJlZHVjZXJzKHN0YXRlLCBhY3Rpb24pO1xuICAgICAgICAgICAgfTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbWVyZ2VkUmVkdWNlcnM7XG4gICAgfTtcbiAgICB2YXIgcm9vdFJlZHVjZXIgPSB0aGlzLmNyZWF0ZVJvb3RSZWR1Y2VyKHJlZHV4LnJvb3RSZWR1Y2Vycyk7XG4gICAgdmFyIG1pZGRsZXdhcmVzID0gUmVkdXguYXBwbHlNaWRkbGV3YXJlLmFwcGx5KFJlZHV4LCByZWR1eC5taWRkbGV3YXJlcyk7XG4gICAgdmFyIGVuaGFuY2VycyA9IGNvbXBvc2VFbmhhbmNlcnNXaXRoRGV2dG9vbHMocmVkdXguZGV2dG9vbE9wdGlvbnMpLmFwcGx5KHZvaWQgMCwgX19zcHJlYWRBcnJheXMocmVkdXguZW5oYW5jZXJzLCBbbWlkZGxld2FyZXNdKSk7XG4gICAgdGhpcy5zdG9yZSA9IGNyZWF0ZVN0b3JlKHJvb3RSZWR1Y2VyLCBpbml0aWFsU3RhdGVzLCBlbmhhbmNlcnMpO1xuICAgIHJldHVybiB0aGlzO1xufVxuIiwgInZhciBfX2Fzc2lnbiA9ICh0aGlzICYmIHRoaXMuX19hc3NpZ24pIHx8IGZ1bmN0aW9uICgpIHtcbiAgICBfX2Fzc2lnbiA9IE9iamVjdC5hc3NpZ24gfHwgZnVuY3Rpb24odCkge1xuICAgICAgICBmb3IgKHZhciBzLCBpID0gMSwgbiA9IGFyZ3VtZW50cy5sZW5ndGg7IGkgPCBuOyBpKyspIHtcbiAgICAgICAgICAgIHMgPSBhcmd1bWVudHNbaV07XG4gICAgICAgICAgICBmb3IgKHZhciBwIGluIHMpIGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwocywgcCkpXG4gICAgICAgICAgICAgICAgdFtwXSA9IHNbcF07XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHQ7XG4gICAgfTtcbiAgICByZXR1cm4gX19hc3NpZ24uYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbn07XG5pbXBvcnQgcGx1Z2luRmFjdG9yeSBmcm9tICcuL3BsdWdpbkZhY3RvcnknO1xuaW1wb3J0IGRpc3BhdGNoUGx1Z2luIGZyb20gJy4vcGx1Z2lucy9kaXNwYXRjaCc7XG5pbXBvcnQgZWZmZWN0c1BsdWdpbiBmcm9tICcuL3BsdWdpbnMvZWZmZWN0cyc7XG5pbXBvcnQgY3JlYXRlUmVkdXggZnJvbSAnLi9yZWR1eCc7XG5pbXBvcnQgdmFsaWRhdGUgZnJvbSAnLi91dGlscy92YWxpZGF0ZSc7XG52YXIgY29yZVBsdWdpbnMgPSBbZGlzcGF0Y2hQbHVnaW4sIGVmZmVjdHNQbHVnaW5dO1xuLyoqXG4gKiBJY2VzdG9yZSBjbGFzc1xuICpcbiAqIGFuIGluc3RhbmNlIG9mIEljZXN0b3JlIGdlbmVyYXRlZCBieSBcImluaXRcIlxuICovXG52YXIgSWNlc3RvcmUgPSAvKiogQGNsYXNzICovIChmdW5jdGlvbiAoKSB7XG4gICAgZnVuY3Rpb24gSWNlc3RvcmUoY29uZmlnKSB7XG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XG4gICAgICAgIHRoaXMucGx1Z2lucyA9IFtdO1xuICAgICAgICB0aGlzLmdldE1vZGVscyA9IGZ1bmN0aW9uIChtb2RlbHMpIHtcbiAgICAgICAgICAgIHJldHVybiBPYmplY3Qua2V5cyhtb2RlbHMpLm1hcChmdW5jdGlvbiAobmFtZSkgeyByZXR1cm4gKF9fYXNzaWduKF9fYXNzaWduKHsgbmFtZTogbmFtZSB9LCBtb2RlbHNbbmFtZV0pLCB7IHJlZHVjZXJzOiBtb2RlbHNbbmFtZV0ucmVkdWNlcnMgfHwge30gfSkpOyB9KTtcbiAgICAgICAgfTtcbiAgICAgICAgdGhpcy5jb25maWcgPSBjb25maWc7XG4gICAgICAgIHRoaXMucGx1Z2luRmFjdG9yeSA9IHBsdWdpbkZhY3RvcnkoY29uZmlnKTtcbiAgICAgICAgZm9yICh2YXIgX2kgPSAwLCBfYSA9IGNvcmVQbHVnaW5zLmNvbmNhdCh0aGlzLmNvbmZpZy5wbHVnaW5zKTsgX2kgPCBfYS5sZW5ndGg7IF9pKyspIHtcbiAgICAgICAgICAgIHZhciBwbHVnaW4gPSBfYVtfaV07XG4gICAgICAgICAgICB0aGlzLnBsdWdpbnMucHVzaCh0aGlzLnBsdWdpbkZhY3RvcnkuY3JlYXRlKHBsdWdpbikpO1xuICAgICAgICB9XG4gICAgICAgIC8vIHByZVN0b3JlOiBtaWRkbGV3YXJlLCBtb2RlbCBob29rc1xuICAgICAgICB0aGlzLmZvckVhY2hQbHVnaW4oJ21pZGRsZXdhcmUnLCBmdW5jdGlvbiAobWlkZGxld2FyZSkge1xuICAgICAgICAgICAgX3RoaXMuY29uZmlnLnJlZHV4Lm1pZGRsZXdhcmVzLnB1c2gobWlkZGxld2FyZSk7XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICBJY2VzdG9yZS5wcm90b3R5cGUuZm9yRWFjaFBsdWdpbiA9IGZ1bmN0aW9uIChtZXRob2QsIGZuKSB7XG4gICAgICAgIGZvciAodmFyIF9pID0gMCwgX2EgPSB0aGlzLnBsdWdpbnM7IF9pIDwgX2EubGVuZ3RoOyBfaSsrKSB7XG4gICAgICAgICAgICB2YXIgcGx1Z2luID0gX2FbX2ldO1xuICAgICAgICAgICAgaWYgKHBsdWdpblttZXRob2RdKSB7XG4gICAgICAgICAgICAgICAgZm4ocGx1Z2luW21ldGhvZF0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfTtcbiAgICBJY2VzdG9yZS5wcm90b3R5cGUuYWRkTW9kZWwgPSBmdW5jdGlvbiAobW9kZWwpIHtcbiAgICAgICAgdmFsaWRhdGUoW1xuICAgICAgICAgICAgWyFtb2RlbCwgJ21vZGVsIGNvbmZpZyBpcyByZXF1aXJlZCddLFxuICAgICAgICAgICAgW3R5cGVvZiBtb2RlbC5uYW1lICE9PSAnc3RyaW5nJywgJ21vZGVsIFwibmFtZVwiIFtzdHJpbmddIGlzIHJlcXVpcmVkJ10sXG4gICAgICAgICAgICBbXG4gICAgICAgICAgICAgICAgbW9kZWwuc3RhdGUgPT09IHVuZGVmaW5lZCAmJiBtb2RlbC5iYXNlUmVkdWNlciA9PT0gdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIFwibW9kZWwoXCIgKyBtb2RlbC5uYW1lICsgXCIpIFxcXCJzdGF0ZVxcXCIgaXMgcmVxdWlyZWRcIixcbiAgICAgICAgICAgIF0sXG4gICAgICAgICAgICBbXG4gICAgICAgICAgICAgICAgbW9kZWwuYmFzZVJlZHVjZXIgIT09IHVuZGVmaW5lZCAmJlxuICAgICAgICAgICAgICAgICAgICB0eXBlb2YgbW9kZWwuYmFzZVJlZHVjZXIgIT09ICdmdW5jdGlvbicsXG4gICAgICAgICAgICAgICAgXCJtb2RlbChcIiArIG1vZGVsLm5hbWUgKyBcIikgXFxcImJhc2VSZWR1Y2VyXFxcIiBtdXN0IGJlIGEgZnVuY3Rpb25cIixcbiAgICAgICAgICAgIF0sXG4gICAgICAgIF0pO1xuICAgICAgICAvLyBydW4gcGx1Z2luIG1vZGVsIHN1YnNjcmlwdGlvbnNcbiAgICAgICAgdGhpcy5mb3JFYWNoUGx1Z2luKCdvbk1vZGVsJywgZnVuY3Rpb24gKG9uTW9kZWwpIHsgcmV0dXJuIG9uTW9kZWwobW9kZWwpOyB9KTtcbiAgICB9O1xuICAgIEljZXN0b3JlLnByb3RvdHlwZS5pbml0ID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xuICAgICAgICAvLyBjb2xsZWN0IGFsbCBtb2RlbHNcbiAgICAgICAgdGhpcy5tb2RlbHMgPSB0aGlzLmdldE1vZGVscyh0aGlzLmNvbmZpZy5tb2RlbHMpO1xuICAgICAgICBmb3IgKHZhciBfaSA9IDAsIF9hID0gdGhpcy5tb2RlbHM7IF9pIDwgX2EubGVuZ3RoOyBfaSsrKSB7XG4gICAgICAgICAgICB2YXIgbW9kZWwgPSBfYVtfaV07XG4gICAgICAgICAgICB0aGlzLmFkZE1vZGVsKG1vZGVsKTtcbiAgICAgICAgfVxuICAgICAgICAvLyBjcmVhdGUgYSByZWR1eCBzdG9yZSB3aXRoIGluaXRpYWxTdGF0ZVxuICAgICAgICAvLyBtZXJnZSBpbiBhZGRpdGlvbmFsIGV4dHJhIHJlZHVjZXJzXG4gICAgICAgIHZhciByZWR1eCA9IGNyZWF0ZVJlZHV4LmNhbGwodGhpcywge1xuICAgICAgICAgICAgcmVkdXg6IHRoaXMuY29uZmlnLnJlZHV4LFxuICAgICAgICAgICAgbW9kZWxzOiB0aGlzLm1vZGVscyxcbiAgICAgICAgfSk7XG4gICAgICAgIHZhciBpY2VzdG9yZSA9IF9fYXNzaWduKF9fYXNzaWduKHsgbmFtZTogdGhpcy5jb25maWcubmFtZSB9LCByZWR1eC5zdG9yZSksIHsgXG4gICAgICAgICAgICAvLyBkeW5hbWljIGxvYWRpbmcgb2YgbW9kZWxzIHdpdGggYHJlcGxhY2VSZWR1Y2VyYFxuICAgICAgICAgICAgbW9kZWw6IGZ1bmN0aW9uIChtb2RlbCkge1xuICAgICAgICAgICAgICAgIF90aGlzLmFkZE1vZGVsKG1vZGVsKTtcbiAgICAgICAgICAgICAgICByZWR1eC5tZXJnZVJlZHVjZXJzKHJlZHV4LmNyZWF0ZU1vZGVsUmVkdWNlcihtb2RlbCkpO1xuICAgICAgICAgICAgICAgIHJlZHV4LnN0b3JlLnJlcGxhY2VSZWR1Y2VyKHJlZHV4LmNyZWF0ZVJvb3RSZWR1Y2VyKF90aGlzLmNvbmZpZy5yZWR1eC5yb290UmVkdWNlcnMpKTtcbiAgICAgICAgICAgICAgICByZWR1eC5zdG9yZS5kaXNwYXRjaCh7IHR5cGU6ICdAQHJlZHV4L1JFUExBQ0UgJyB9KTtcbiAgICAgICAgICAgIH0gfSk7XG4gICAgICAgIHRoaXMuZm9yRWFjaFBsdWdpbignb25TdG9yZUNyZWF0ZWQnLCBmdW5jdGlvbiAob25TdG9yZUNyZWF0ZWQpIHtcbiAgICAgICAgICAgIHZhciByZXR1cm5lZCA9IG9uU3RvcmVDcmVhdGVkKGljZXN0b3JlKTtcbiAgICAgICAgICAgIC8vIGlmIG9uU3RvcmVDcmVhdGVkIHJldHVybnMgYW4gb2JqZWN0IHZhbHVlXG4gICAgICAgICAgICAvLyBtZXJnZSBpdHMgcmV0dXJuZWQgdmFsdWUgb250byB0aGUgc3RvcmVcbiAgICAgICAgICAgIGlmIChyZXR1cm5lZCkge1xuICAgICAgICAgICAgICAgIE9iamVjdC5rZXlzKHJldHVybmVkIHx8IHt9KS5mb3JFYWNoKGZ1bmN0aW9uIChrZXkpIHtcbiAgICAgICAgICAgICAgICAgICAgaWNlc3RvcmVba2V5XSA9IHJldHVybmVkW2tleV07XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gaWNlc3RvcmU7XG4gICAgfTtcbiAgICByZXR1cm4gSWNlc3RvcmU7XG59KCkpO1xuZXhwb3J0IGRlZmF1bHQgSWNlc3RvcmU7XG4iLCAidmFyIF9fYXNzaWduID0gKHRoaXMgJiYgdGhpcy5fX2Fzc2lnbikgfHwgZnVuY3Rpb24gKCkge1xuICAgIF9fYXNzaWduID0gT2JqZWN0LmFzc2lnbiB8fCBmdW5jdGlvbih0KSB7XG4gICAgICAgIGZvciAodmFyIHMsIGkgPSAxLCBuID0gYXJndW1lbnRzLmxlbmd0aDsgaSA8IG47IGkrKykge1xuICAgICAgICAgICAgcyA9IGFyZ3VtZW50c1tpXTtcbiAgICAgICAgICAgIGZvciAodmFyIHAgaW4gcykgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChzLCBwKSlcbiAgICAgICAgICAgICAgICB0W3BdID0gc1twXTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdDtcbiAgICB9O1xuICAgIHJldHVybiBfX2Fzc2lnbi5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xufTtcbnZhciBfX3NwcmVhZEFycmF5cyA9ICh0aGlzICYmIHRoaXMuX19zcHJlYWRBcnJheXMpIHx8IGZ1bmN0aW9uICgpIHtcbiAgICBmb3IgKHZhciBzID0gMCwgaSA9IDAsIGlsID0gYXJndW1lbnRzLmxlbmd0aDsgaSA8IGlsOyBpKyspIHMgKz0gYXJndW1lbnRzW2ldLmxlbmd0aDtcbiAgICBmb3IgKHZhciByID0gQXJyYXkocyksIGsgPSAwLCBpID0gMDsgaSA8IGlsOyBpKyspXG4gICAgICAgIGZvciAodmFyIGEgPSBhcmd1bWVudHNbaV0sIGogPSAwLCBqbCA9IGEubGVuZ3RoOyBqIDwgamw7IGorKywgaysrKVxuICAgICAgICAgICAgcltrXSA9IGFbal07XG4gICAgcmV0dXJuIHI7XG59O1xuaW1wb3J0IHZhbGlkYXRlIGZyb20gJy4vdmFsaWRhdGUnO1xudmFyIG1lcmdlID0gZnVuY3Rpb24gKG9yaWdpbmFsLCBuZXh0KSB7XG4gICAgcmV0dXJuIG5leHQgPyBfX2Fzc2lnbihfX2Fzc2lnbih7fSwgbmV4dCksIChvcmlnaW5hbCB8fCB7fSkpIDogb3JpZ2luYWwgfHwge307XG59O1xudmFyIGlzT2JqZWN0ID0gZnVuY3Rpb24gKG9iaikge1xuICAgIHJldHVybiBBcnJheS5pc0FycmF5KG9iaikgfHwgdHlwZW9mIG9iaiAhPT0gJ29iamVjdCc7XG59O1xuLyoqXG4gKiBtZXJnZUNvbmZpZ1xuICpcbiAqIG1lcmdlIGluaXQgY29uZmlncyB0b2dldGhlclxuICovXG5leHBvcnQgZGVmYXVsdCAoZnVuY3Rpb24gKGluaXRDb25maWcpIHtcbiAgICB2YXIgY29uZmlnID0gX19hc3NpZ24oX19hc3NpZ24oeyBuYW1lOiBpbml0Q29uZmlnLm5hbWUsIG1vZGVsczoge30sIHBsdWdpbnM6IFtdIH0sIGluaXRDb25maWcpLCB7IHJlZHV4OiBfX2Fzc2lnbihfX2Fzc2lnbih7IHJlZHVjZXJzOiB7fSwgcm9vdFJlZHVjZXJzOiB7fSwgZW5oYW5jZXJzOiBbXSwgbWlkZGxld2FyZXM6IFtdIH0sIGluaXRDb25maWcucmVkdXgpLCB7IGRldnRvb2xPcHRpb25zOiBfX2Fzc2lnbih7IG5hbWU6IGluaXRDb25maWcubmFtZSB9LCAoaW5pdENvbmZpZy5yZWR1eCAmJiBpbml0Q29uZmlnLnJlZHV4LmRldnRvb2xPcHRpb25zXG4gICAgICAgICAgICAgICAgPyBpbml0Q29uZmlnLnJlZHV4LmRldnRvb2xPcHRpb25zXG4gICAgICAgICAgICAgICAgOiB7fSkpIH0pIH0pO1xuICAgIGlmIChwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nKSB7XG4gICAgICAgIHZhbGlkYXRlKFtcbiAgICAgICAgICAgIFshQXJyYXkuaXNBcnJheShjb25maWcucGx1Z2lucyksICdpbml0IGNvbmZpZy5wbHVnaW5zIG11c3QgYmUgYW4gYXJyYXknXSxcbiAgICAgICAgICAgIFtpc09iamVjdChjb25maWcubW9kZWxzKSwgJ2luaXQgY29uZmlnLm1vZGVscyBtdXN0IGJlIGFuIG9iamVjdCddLFxuICAgICAgICAgICAgW1xuICAgICAgICAgICAgICAgIGlzT2JqZWN0KGNvbmZpZy5yZWR1eC5yZWR1Y2VycyksXG4gICAgICAgICAgICAgICAgJ2luaXQgY29uZmlnLnJlZHV4LnJlZHVjZXJzIG11c3QgYmUgYW4gb2JqZWN0JyxcbiAgICAgICAgICAgIF0sXG4gICAgICAgICAgICBbXG4gICAgICAgICAgICAgICAgIUFycmF5LmlzQXJyYXkoY29uZmlnLnJlZHV4Lm1pZGRsZXdhcmVzKSxcbiAgICAgICAgICAgICAgICAnaW5pdCBjb25maWcucmVkdXgubWlkZGxld2FyZXMgbXVzdCBiZSBhbiBhcnJheScsXG4gICAgICAgICAgICBdLFxuICAgICAgICAgICAgW1xuICAgICAgICAgICAgICAgICFBcnJheS5pc0FycmF5KGNvbmZpZy5yZWR1eC5lbmhhbmNlcnMpLFxuICAgICAgICAgICAgICAgICdpbml0IGNvbmZpZy5yZWR1eC5lbmhhbmNlcnMgbXVzdCBiZSBhbiBhcnJheSBvZiBmdW5jdGlvbnMnLFxuICAgICAgICAgICAgXSxcbiAgICAgICAgICAgIFtcbiAgICAgICAgICAgICAgICBjb25maWcucmVkdXguY29tYmluZVJlZHVjZXJzICYmXG4gICAgICAgICAgICAgICAgICAgIHR5cGVvZiBjb25maWcucmVkdXguY29tYmluZVJlZHVjZXJzICE9PSAnZnVuY3Rpb24nLFxuICAgICAgICAgICAgICAgICdpbml0IGNvbmZpZy5yZWR1eC5jb21iaW5lUmVkdWNlcnMgbXVzdCBiZSBhIGZ1bmN0aW9uJyxcbiAgICAgICAgICAgIF0sXG4gICAgICAgICAgICBbXG4gICAgICAgICAgICAgICAgY29uZmlnLnJlZHV4LmNyZWF0ZVN0b3JlICYmXG4gICAgICAgICAgICAgICAgICAgIHR5cGVvZiBjb25maWcucmVkdXguY3JlYXRlU3RvcmUgIT09ICdmdW5jdGlvbicsXG4gICAgICAgICAgICAgICAgJ2luaXQgY29uZmlnLnJlZHV4LmNyZWF0ZVN0b3JlIG11c3QgYmUgYSBmdW5jdGlvbicsXG4gICAgICAgICAgICBdLFxuICAgICAgICBdKTtcbiAgICB9XG4gICAgLy8gZGVmYXVsdHNcbiAgICBmb3IgKHZhciBfaSA9IDAsIF9hID0gY29uZmlnLnBsdWdpbnM7IF9pIDwgX2EubGVuZ3RoOyBfaSsrKSB7XG4gICAgICAgIHZhciBwbHVnaW4gPSBfYVtfaV07XG4gICAgICAgIGlmIChwbHVnaW4uY29uZmlnKSB7XG4gICAgICAgICAgICAvLyBtb2RlbHNcbiAgICAgICAgICAgIHZhciBtb2RlbHMgPSBtZXJnZShjb25maWcubW9kZWxzLCBwbHVnaW4uY29uZmlnLm1vZGVscyk7XG4gICAgICAgICAgICBjb25maWcubW9kZWxzID0gbW9kZWxzO1xuICAgICAgICAgICAgLy8gcGx1Z2luc1xuICAgICAgICAgICAgY29uZmlnLnBsdWdpbnMgPSBfX3NwcmVhZEFycmF5cyhjb25maWcucGx1Z2lucywgKHBsdWdpbi5jb25maWcucGx1Z2lucyB8fCBbXSkpO1xuICAgICAgICAgICAgLy8gcmVkdXhcbiAgICAgICAgICAgIGlmIChwbHVnaW4uY29uZmlnLnJlZHV4KSB7XG4gICAgICAgICAgICAgICAgY29uZmlnLnJlZHV4LmluaXRpYWxTdGF0ZXMgPSBtZXJnZShjb25maWcucmVkdXguaW5pdGlhbFN0YXRlcywgcGx1Z2luLmNvbmZpZy5yZWR1eC5pbml0aWFsU3RhdGVzKTtcbiAgICAgICAgICAgICAgICBjb25maWcucmVkdXgucmVkdWNlcnMgPSBtZXJnZShjb25maWcucmVkdXgucmVkdWNlcnMsIHBsdWdpbi5jb25maWcucmVkdXgucmVkdWNlcnMpO1xuICAgICAgICAgICAgICAgIGNvbmZpZy5yZWR1eC5yb290UmVkdWNlcnMgPSBtZXJnZShjb25maWcucmVkdXgucm9vdFJlZHVjZXJzLCBwbHVnaW4uY29uZmlnLnJlZHV4LnJlZHVjZXJzKTtcbiAgICAgICAgICAgICAgICBjb25maWcucmVkdXguZW5oYW5jZXJzID0gX19zcHJlYWRBcnJheXMoY29uZmlnLnJlZHV4LmVuaGFuY2VycywgKHBsdWdpbi5jb25maWcucmVkdXguZW5oYW5jZXJzIHx8IFtdKSk7XG4gICAgICAgICAgICAgICAgY29uZmlnLnJlZHV4Lm1pZGRsZXdhcmVzID0gX19zcHJlYWRBcnJheXMoY29uZmlnLnJlZHV4Lm1pZGRsZXdhcmVzLCAocGx1Z2luLmNvbmZpZy5yZWR1eC5taWRkbGV3YXJlcyB8fCBbXSkpO1xuICAgICAgICAgICAgICAgIGNvbmZpZy5yZWR1eC5jb21iaW5lUmVkdWNlcnMgPVxuICAgICAgICAgICAgICAgICAgICBjb25maWcucmVkdXguY29tYmluZVJlZHVjZXJzIHx8IHBsdWdpbi5jb25maWcucmVkdXguY29tYmluZVJlZHVjZXJzO1xuICAgICAgICAgICAgICAgIGNvbmZpZy5yZWR1eC5jcmVhdGVTdG9yZSA9XG4gICAgICAgICAgICAgICAgICAgIGNvbmZpZy5yZWR1eC5jcmVhdGVTdG9yZSB8fCBwbHVnaW4uY29uZmlnLnJlZHV4LmNyZWF0ZVN0b3JlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiBjb25maWc7XG59KTtcbiIsICJpbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xuaW1wb3J0IHsgUHJvdmlkZXIgYXMgUmVkdXhQcm92aWRlciB9IGZyb20gJ3JlYWN0LXJlZHV4JztcbmltcG9ydCBhY3Rpb25UeXBlcyBmcm9tICcuLi9hY3Rpb25UeXBlcyc7XG52YXIgU0VUX1NUQVRFID0gYWN0aW9uVHlwZXMuU0VUX1NUQVRFO1xuZXhwb3J0IGRlZmF1bHQgKGZ1bmN0aW9uIChfYSkge1xuICAgIHZhciBjb250ZXh0ID0gX2EuY29udGV4dDtcbiAgICByZXR1cm4ge1xuICAgICAgICBvblN0b3JlQ3JlYXRlZDogZnVuY3Rpb24gKHN0b3JlKSB7XG4gICAgICAgICAgICB2YXIgUHJvdmlkZXIgPSBmdW5jdGlvbiAocHJvcHMpIHtcbiAgICAgICAgICAgICAgICB2YXIgY2hpbGRyZW4gPSBwcm9wcy5jaGlsZHJlbiwgaW5pdGlhbFN0YXRlcyA9IHByb3BzLmluaXRpYWxTdGF0ZXM7XG4gICAgICAgICAgICAgICAgaWYgKGluaXRpYWxTdGF0ZXMpIHtcbiAgICAgICAgICAgICAgICAgICAgT2JqZWN0LmtleXMoaW5pdGlhbFN0YXRlcykuZm9yRWFjaChmdW5jdGlvbiAobmFtZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGluaXRpYWxTdGF0ZSA9IGluaXRpYWxTdGF0ZXNbbmFtZV07XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoaW5pdGlhbFN0YXRlICYmIHN0b3JlLmRpc3BhdGNoW25hbWVdW1NFVF9TVEFURV0pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdG9yZS5kaXNwYXRjaFtuYW1lXVtTRVRfU1RBVEVdKGluaXRpYWxTdGF0ZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgICAgIC8vIEB0cy1pZ25vcmVcbiAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFJlZHV4UHJvdmlkZXIsIHsgc3RvcmU6IHN0b3JlLCBjb250ZXh0OiBjb250ZXh0IH0sIGNoaWxkcmVuKSk7XG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgcmV0dXJuIHsgUHJvdmlkZXI6IFByb3ZpZGVyLCBjb250ZXh0OiBjb250ZXh0IH07XG4gICAgICAgIH0sXG4gICAgfTtcbn0pO1xuIiwgImltcG9ydCBSZWFjdCwgeyB1c2VNZW1vIH0gZnJvbSAncmVhY3QnO1xuaW1wb3J0IFByb3BUeXBlcyBmcm9tICdwcm9wLXR5cGVzJztcbmltcG9ydCB7IFJlYWN0UmVkdXhDb250ZXh0IH0gZnJvbSAnLi9Db250ZXh0JztcbmltcG9ydCB7IGNyZWF0ZVN1YnNjcmlwdGlvbiB9IGZyb20gJy4uL3V0aWxzL1N1YnNjcmlwdGlvbic7XG5pbXBvcnQgeyB1c2VJc29tb3JwaGljTGF5b3V0RWZmZWN0IH0gZnJvbSAnLi4vdXRpbHMvdXNlSXNvbW9ycGhpY0xheW91dEVmZmVjdCc7XG5cbmZ1bmN0aW9uIFByb3ZpZGVyKF9yZWYpIHtcbiAgdmFyIHN0b3JlID0gX3JlZi5zdG9yZSxcbiAgICAgIGNvbnRleHQgPSBfcmVmLmNvbnRleHQsXG4gICAgICBjaGlsZHJlbiA9IF9yZWYuY2hpbGRyZW47XG4gIHZhciBjb250ZXh0VmFsdWUgPSB1c2VNZW1vKGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgc3Vic2NyaXB0aW9uID0gY3JlYXRlU3Vic2NyaXB0aW9uKHN0b3JlKTtcbiAgICByZXR1cm4ge1xuICAgICAgc3RvcmU6IHN0b3JlLFxuICAgICAgc3Vic2NyaXB0aW9uOiBzdWJzY3JpcHRpb25cbiAgICB9O1xuICB9LCBbc3RvcmVdKTtcbiAgdmFyIHByZXZpb3VzU3RhdGUgPSB1c2VNZW1vKGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gc3RvcmUuZ2V0U3RhdGUoKTtcbiAgfSwgW3N0b3JlXSk7XG4gIHVzZUlzb21vcnBoaWNMYXlvdXRFZmZlY3QoZnVuY3Rpb24gKCkge1xuICAgIHZhciBzdWJzY3JpcHRpb24gPSBjb250ZXh0VmFsdWUuc3Vic2NyaXB0aW9uO1xuICAgIHN1YnNjcmlwdGlvbi5vblN0YXRlQ2hhbmdlID0gc3Vic2NyaXB0aW9uLm5vdGlmeU5lc3RlZFN1YnM7XG4gICAgc3Vic2NyaXB0aW9uLnRyeVN1YnNjcmliZSgpO1xuXG4gICAgaWYgKHByZXZpb3VzU3RhdGUgIT09IHN0b3JlLmdldFN0YXRlKCkpIHtcbiAgICAgIHN1YnNjcmlwdGlvbi5ub3RpZnlOZXN0ZWRTdWJzKCk7XG4gICAgfVxuXG4gICAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcbiAgICAgIHN1YnNjcmlwdGlvbi50cnlVbnN1YnNjcmliZSgpO1xuICAgICAgc3Vic2NyaXB0aW9uLm9uU3RhdGVDaGFuZ2UgPSBudWxsO1xuICAgIH07XG4gIH0sIFtjb250ZXh0VmFsdWUsIHByZXZpb3VzU3RhdGVdKTtcbiAgdmFyIENvbnRleHQgPSBjb250ZXh0IHx8IFJlYWN0UmVkdXhDb250ZXh0O1xuICByZXR1cm4gLyojX19QVVJFX18qL1JlYWN0LmNyZWF0ZUVsZW1lbnQoQ29udGV4dC5Qcm92aWRlciwge1xuICAgIHZhbHVlOiBjb250ZXh0VmFsdWVcbiAgfSwgY2hpbGRyZW4pO1xufVxuXG5pZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJykge1xuICBQcm92aWRlci5wcm9wVHlwZXMgPSB7XG4gICAgc3RvcmU6IFByb3BUeXBlcy5zaGFwZSh7XG4gICAgICBzdWJzY3JpYmU6IFByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWQsXG4gICAgICBkaXNwYXRjaDogUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZCxcbiAgICAgIGdldFN0YXRlOiBQcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkXG4gICAgfSksXG4gICAgY29udGV4dDogUHJvcFR5cGVzLm9iamVjdCxcbiAgICBjaGlsZHJlbjogUHJvcFR5cGVzLmFueVxuICB9O1xufVxuXG5leHBvcnQgZGVmYXVsdCBQcm92aWRlcjsiLCAiaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JztcbmV4cG9ydCB2YXIgUmVhY3RSZWR1eENvbnRleHQgPSAvKiNfX1BVUkVfXyovUmVhY3QuY3JlYXRlQ29udGV4dChudWxsKTtcblxuaWYgKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicpIHtcbiAgUmVhY3RSZWR1eENvbnRleHQuZGlzcGxheU5hbWUgPSAnUmVhY3RSZWR1eCc7XG59XG5cbmV4cG9ydCBkZWZhdWx0IFJlYWN0UmVkdXhDb250ZXh0OyIsICIvLyBEZWZhdWx0IHRvIGEgZHVtbXkgXCJiYXRjaFwiIGltcGxlbWVudGF0aW9uIHRoYXQganVzdCBydW5zIHRoZSBjYWxsYmFja1xuZnVuY3Rpb24gZGVmYXVsdE5vb3BCYXRjaChjYWxsYmFjaykge1xuICBjYWxsYmFjaygpO1xufVxuXG52YXIgYmF0Y2ggPSBkZWZhdWx0Tm9vcEJhdGNoOyAvLyBBbGxvdyBpbmplY3RpbmcgYW5vdGhlciBiYXRjaGluZyBmdW5jdGlvbiBsYXRlclxuXG5leHBvcnQgdmFyIHNldEJhdGNoID0gZnVuY3Rpb24gc2V0QmF0Y2gobmV3QmF0Y2gpIHtcbiAgcmV0dXJuIGJhdGNoID0gbmV3QmF0Y2g7XG59OyAvLyBTdXBwbHkgYSBnZXR0ZXIganVzdCB0byBza2lwIGRlYWxpbmcgd2l0aCBFU00gYmluZGluZ3NcblxuZXhwb3J0IHZhciBnZXRCYXRjaCA9IGZ1bmN0aW9uIGdldEJhdGNoKCkge1xuICByZXR1cm4gYmF0Y2g7XG59OyIsICJpbXBvcnQgeyBnZXRCYXRjaCB9IGZyb20gJy4vYmF0Y2gnOyAvLyBlbmNhcHN1bGF0ZXMgdGhlIHN1YnNjcmlwdGlvbiBsb2dpYyBmb3IgY29ubmVjdGluZyBhIGNvbXBvbmVudCB0byB0aGUgcmVkdXggc3RvcmUsIGFzXG4vLyB3ZWxsIGFzIG5lc3Rpbmcgc3Vic2NyaXB0aW9ucyBvZiBkZXNjZW5kYW50IGNvbXBvbmVudHMsIHNvIHRoYXQgd2UgY2FuIGVuc3VyZSB0aGVcbi8vIGFuY2VzdG9yIGNvbXBvbmVudHMgcmUtcmVuZGVyIGJlZm9yZSBkZXNjZW5kYW50c1xuXG5mdW5jdGlvbiBjcmVhdGVMaXN0ZW5lckNvbGxlY3Rpb24oKSB7XG4gIHZhciBiYXRjaCA9IGdldEJhdGNoKCk7XG4gIHZhciBmaXJzdCA9IG51bGw7XG4gIHZhciBsYXN0ID0gbnVsbDtcbiAgcmV0dXJuIHtcbiAgICBjbGVhcjogZnVuY3Rpb24gY2xlYXIoKSB7XG4gICAgICBmaXJzdCA9IG51bGw7XG4gICAgICBsYXN0ID0gbnVsbDtcbiAgICB9LFxuICAgIG5vdGlmeTogZnVuY3Rpb24gbm90aWZ5KCkge1xuICAgICAgYmF0Y2goZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgbGlzdGVuZXIgPSBmaXJzdDtcblxuICAgICAgICB3aGlsZSAobGlzdGVuZXIpIHtcbiAgICAgICAgICBsaXN0ZW5lci5jYWxsYmFjaygpO1xuICAgICAgICAgIGxpc3RlbmVyID0gbGlzdGVuZXIubmV4dDtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfSxcbiAgICBnZXQ6IGZ1bmN0aW9uIGdldCgpIHtcbiAgICAgIHZhciBsaXN0ZW5lcnMgPSBbXTtcbiAgICAgIHZhciBsaXN0ZW5lciA9IGZpcnN0O1xuXG4gICAgICB3aGlsZSAobGlzdGVuZXIpIHtcbiAgICAgICAgbGlzdGVuZXJzLnB1c2gobGlzdGVuZXIpO1xuICAgICAgICBsaXN0ZW5lciA9IGxpc3RlbmVyLm5leHQ7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBsaXN0ZW5lcnM7XG4gICAgfSxcbiAgICBzdWJzY3JpYmU6IGZ1bmN0aW9uIHN1YnNjcmliZShjYWxsYmFjaykge1xuICAgICAgdmFyIGlzU3Vic2NyaWJlZCA9IHRydWU7XG4gICAgICB2YXIgbGlzdGVuZXIgPSBsYXN0ID0ge1xuICAgICAgICBjYWxsYmFjazogY2FsbGJhY2ssXG4gICAgICAgIG5leHQ6IG51bGwsXG4gICAgICAgIHByZXY6IGxhc3RcbiAgICAgIH07XG5cbiAgICAgIGlmIChsaXN0ZW5lci5wcmV2KSB7XG4gICAgICAgIGxpc3RlbmVyLnByZXYubmV4dCA9IGxpc3RlbmVyO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgZmlyc3QgPSBsaXN0ZW5lcjtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIGZ1bmN0aW9uIHVuc3Vic2NyaWJlKCkge1xuICAgICAgICBpZiAoIWlzU3Vic2NyaWJlZCB8fCBmaXJzdCA9PT0gbnVsbCkgcmV0dXJuO1xuICAgICAgICBpc1N1YnNjcmliZWQgPSBmYWxzZTtcblxuICAgICAgICBpZiAobGlzdGVuZXIubmV4dCkge1xuICAgICAgICAgIGxpc3RlbmVyLm5leHQucHJldiA9IGxpc3RlbmVyLnByZXY7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgbGFzdCA9IGxpc3RlbmVyLnByZXY7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAobGlzdGVuZXIucHJldikge1xuICAgICAgICAgIGxpc3RlbmVyLnByZXYubmV4dCA9IGxpc3RlbmVyLm5leHQ7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgZmlyc3QgPSBsaXN0ZW5lci5uZXh0O1xuICAgICAgICB9XG4gICAgICB9O1xuICAgIH1cbiAgfTtcbn1cblxudmFyIG51bGxMaXN0ZW5lcnMgPSB7XG4gIG5vdGlmeTogZnVuY3Rpb24gbm90aWZ5KCkge30sXG4gIGdldDogZnVuY3Rpb24gZ2V0KCkge1xuICAgIHJldHVybiBbXTtcbiAgfVxufTtcbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGVTdWJzY3JpcHRpb24oc3RvcmUsIHBhcmVudFN1Yikge1xuICB2YXIgdW5zdWJzY3JpYmU7XG4gIHZhciBsaXN0ZW5lcnMgPSBudWxsTGlzdGVuZXJzO1xuXG4gIGZ1bmN0aW9uIGFkZE5lc3RlZFN1YihsaXN0ZW5lcikge1xuICAgIHRyeVN1YnNjcmliZSgpO1xuICAgIHJldHVybiBsaXN0ZW5lcnMuc3Vic2NyaWJlKGxpc3RlbmVyKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIG5vdGlmeU5lc3RlZFN1YnMoKSB7XG4gICAgbGlzdGVuZXJzLm5vdGlmeSgpO1xuICB9XG5cbiAgZnVuY3Rpb24gaGFuZGxlQ2hhbmdlV3JhcHBlcigpIHtcbiAgICBpZiAoc3Vic2NyaXB0aW9uLm9uU3RhdGVDaGFuZ2UpIHtcbiAgICAgIHN1YnNjcmlwdGlvbi5vblN0YXRlQ2hhbmdlKCk7XG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gaXNTdWJzY3JpYmVkKCkge1xuICAgIHJldHVybiBCb29sZWFuKHVuc3Vic2NyaWJlKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHRyeVN1YnNjcmliZSgpIHtcbiAgICBpZiAoIXVuc3Vic2NyaWJlKSB7XG4gICAgICB1bnN1YnNjcmliZSA9IHBhcmVudFN1YiA/IHBhcmVudFN1Yi5hZGROZXN0ZWRTdWIoaGFuZGxlQ2hhbmdlV3JhcHBlcikgOiBzdG9yZS5zdWJzY3JpYmUoaGFuZGxlQ2hhbmdlV3JhcHBlcik7XG4gICAgICBsaXN0ZW5lcnMgPSBjcmVhdGVMaXN0ZW5lckNvbGxlY3Rpb24oKTtcbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiB0cnlVbnN1YnNjcmliZSgpIHtcbiAgICBpZiAodW5zdWJzY3JpYmUpIHtcbiAgICAgIHVuc3Vic2NyaWJlKCk7XG4gICAgICB1bnN1YnNjcmliZSA9IHVuZGVmaW5lZDtcbiAgICAgIGxpc3RlbmVycy5jbGVhcigpO1xuICAgICAgbGlzdGVuZXJzID0gbnVsbExpc3RlbmVycztcbiAgICB9XG4gIH1cblxuICB2YXIgc3Vic2NyaXB0aW9uID0ge1xuICAgIGFkZE5lc3RlZFN1YjogYWRkTmVzdGVkU3ViLFxuICAgIG5vdGlmeU5lc3RlZFN1YnM6IG5vdGlmeU5lc3RlZFN1YnMsXG4gICAgaGFuZGxlQ2hhbmdlV3JhcHBlcjogaGFuZGxlQ2hhbmdlV3JhcHBlcixcbiAgICBpc1N1YnNjcmliZWQ6IGlzU3Vic2NyaWJlZCxcbiAgICB0cnlTdWJzY3JpYmU6IHRyeVN1YnNjcmliZSxcbiAgICB0cnlVbnN1YnNjcmliZTogdHJ5VW5zdWJzY3JpYmUsXG4gICAgZ2V0TGlzdGVuZXJzOiBmdW5jdGlvbiBnZXRMaXN0ZW5lcnMoKSB7XG4gICAgICByZXR1cm4gbGlzdGVuZXJzO1xuICAgIH1cbiAgfTtcbiAgcmV0dXJuIHN1YnNjcmlwdGlvbjtcbn0iLCAiaW1wb3J0IHsgdXNlRWZmZWN0LCB1c2VMYXlvdXRFZmZlY3QgfSBmcm9tICdyZWFjdCc7IC8vIFJlYWN0IGN1cnJlbnRseSB0aHJvd3MgYSB3YXJuaW5nIHdoZW4gdXNpbmcgdXNlTGF5b3V0RWZmZWN0IG9uIHRoZSBzZXJ2ZXIuXG4vLyBUbyBnZXQgYXJvdW5kIGl0LCB3ZSBjYW4gY29uZGl0aW9uYWxseSB1c2VFZmZlY3Qgb24gdGhlIHNlcnZlciAobm8tb3ApIGFuZFxuLy8gdXNlTGF5b3V0RWZmZWN0IGluIHRoZSBicm93c2VyLiBXZSBuZWVkIHVzZUxheW91dEVmZmVjdCB0byBlbnN1cmUgdGhlIHN0b3JlXG4vLyBzdWJzY3JpcHRpb24gY2FsbGJhY2sgYWx3YXlzIGhhcyB0aGUgc2VsZWN0b3IgZnJvbSB0aGUgbGF0ZXN0IHJlbmRlciBjb21taXRcbi8vIGF2YWlsYWJsZSwgb3RoZXJ3aXNlIGEgc3RvcmUgdXBkYXRlIG1heSBoYXBwZW4gYmV0d2VlbiByZW5kZXIgYW5kIHRoZSBlZmZlY3QsXG4vLyB3aGljaCBtYXkgY2F1c2UgbWlzc2VkIHVwZGF0ZXM7IHdlIGFsc28gbXVzdCBlbnN1cmUgdGhlIHN0b3JlIHN1YnNjcmlwdGlvblxuLy8gaXMgY3JlYXRlZCBzeW5jaHJvbm91c2x5LCBvdGhlcndpc2UgYSBzdG9yZSB1cGRhdGUgbWF5IG9jY3VyIGJlZm9yZSB0aGVcbi8vIHN1YnNjcmlwdGlvbiBpcyBjcmVhdGVkIGFuZCBhbiBpbmNvbnNpc3RlbnQgc3RhdGUgbWF5IGJlIG9ic2VydmVkXG5cbmV4cG9ydCB2YXIgdXNlSXNvbW9ycGhpY0xheW91dEVmZmVjdCA9IHR5cGVvZiB3aW5kb3cgIT09ICd1bmRlZmluZWQnICYmIHR5cGVvZiB3aW5kb3cuZG9jdW1lbnQgIT09ICd1bmRlZmluZWQnICYmIHR5cGVvZiB3aW5kb3cuZG9jdW1lbnQuY3JlYXRlRWxlbWVudCAhPT0gJ3VuZGVmaW5lZCcgPyB1c2VMYXlvdXRFZmZlY3QgOiB1c2VFZmZlY3Q7IiwgImltcG9ydCBfZXh0ZW5kcyBmcm9tIFwiQGJhYmVsL3J1bnRpbWUvaGVscGVycy9lc20vZXh0ZW5kc1wiO1xuaW1wb3J0IF9vYmplY3RXaXRob3V0UHJvcGVydGllc0xvb3NlIGZyb20gXCJAYmFiZWwvcnVudGltZS9oZWxwZXJzL2VzbS9vYmplY3RXaXRob3V0UHJvcGVydGllc0xvb3NlXCI7XG52YXIgX2V4Y2x1ZGVkID0gW1wiZ2V0RGlzcGxheU5hbWVcIiwgXCJtZXRob2ROYW1lXCIsIFwicmVuZGVyQ291bnRQcm9wXCIsIFwic2hvdWxkSGFuZGxlU3RhdGVDaGFuZ2VzXCIsIFwic3RvcmVLZXlcIiwgXCJ3aXRoUmVmXCIsIFwiZm9yd2FyZFJlZlwiLCBcImNvbnRleHRcIl0sXG4gICAgX2V4Y2x1ZGVkMiA9IFtcInJlYWN0UmVkdXhGb3J3YXJkZWRSZWZcIl07XG5pbXBvcnQgaG9pc3RTdGF0aWNzIGZyb20gJ2hvaXN0LW5vbi1yZWFjdC1zdGF0aWNzJztcbmltcG9ydCBSZWFjdCwgeyB1c2VDb250ZXh0LCB1c2VNZW1vLCB1c2VSZWYsIHVzZVJlZHVjZXIgfSBmcm9tICdyZWFjdCc7XG5pbXBvcnQgeyBpc1ZhbGlkRWxlbWVudFR5cGUsIGlzQ29udGV4dENvbnN1bWVyIH0gZnJvbSAncmVhY3QtaXMnO1xuaW1wb3J0IHsgY3JlYXRlU3Vic2NyaXB0aW9uIH0gZnJvbSAnLi4vdXRpbHMvU3Vic2NyaXB0aW9uJztcbmltcG9ydCB7IHVzZUlzb21vcnBoaWNMYXlvdXRFZmZlY3QgfSBmcm9tICcuLi91dGlscy91c2VJc29tb3JwaGljTGF5b3V0RWZmZWN0JztcbmltcG9ydCB7IFJlYWN0UmVkdXhDb250ZXh0IH0gZnJvbSAnLi9Db250ZXh0JzsgLy8gRGVmaW5lIHNvbWUgY29uc3RhbnQgYXJyYXlzIGp1c3QgdG8gYXZvaWQgcmUtY3JlYXRpbmcgdGhlc2VcblxudmFyIEVNUFRZX0FSUkFZID0gW107XG52YXIgTk9fU1VCU0NSSVBUSU9OX0FSUkFZID0gW251bGwsIG51bGxdO1xuXG52YXIgc3RyaW5naWZ5Q29tcG9uZW50ID0gZnVuY3Rpb24gc3RyaW5naWZ5Q29tcG9uZW50KENvbXApIHtcbiAgdHJ5IHtcbiAgICByZXR1cm4gSlNPTi5zdHJpbmdpZnkoQ29tcCk7XG4gIH0gY2F0Y2ggKGVycikge1xuICAgIHJldHVybiBTdHJpbmcoQ29tcCk7XG4gIH1cbn07XG5cbmZ1bmN0aW9uIHN0b3JlU3RhdGVVcGRhdGVzUmVkdWNlcihzdGF0ZSwgYWN0aW9uKSB7XG4gIHZhciB1cGRhdGVDb3VudCA9IHN0YXRlWzFdO1xuICByZXR1cm4gW2FjdGlvbi5wYXlsb2FkLCB1cGRhdGVDb3VudCArIDFdO1xufVxuXG5mdW5jdGlvbiB1c2VJc29tb3JwaGljTGF5b3V0RWZmZWN0V2l0aEFyZ3MoZWZmZWN0RnVuYywgZWZmZWN0QXJncywgZGVwZW5kZW5jaWVzKSB7XG4gIHVzZUlzb21vcnBoaWNMYXlvdXRFZmZlY3QoZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiBlZmZlY3RGdW5jLmFwcGx5KHZvaWQgMCwgZWZmZWN0QXJncyk7XG4gIH0sIGRlcGVuZGVuY2llcyk7XG59XG5cbmZ1bmN0aW9uIGNhcHR1cmVXcmFwcGVyUHJvcHMobGFzdFdyYXBwZXJQcm9wcywgbGFzdENoaWxkUHJvcHMsIHJlbmRlcklzU2NoZWR1bGVkLCB3cmFwcGVyUHJvcHMsIGFjdHVhbENoaWxkUHJvcHMsIGNoaWxkUHJvcHNGcm9tU3RvcmVVcGRhdGUsIG5vdGlmeU5lc3RlZFN1YnMpIHtcbiAgLy8gV2Ugd2FudCB0byBjYXB0dXJlIHRoZSB3cmFwcGVyIHByb3BzIGFuZCBjaGlsZCBwcm9wcyB3ZSB1c2VkIGZvciBsYXRlciBjb21wYXJpc29uc1xuICBsYXN0V3JhcHBlclByb3BzLmN1cnJlbnQgPSB3cmFwcGVyUHJvcHM7XG4gIGxhc3RDaGlsZFByb3BzLmN1cnJlbnQgPSBhY3R1YWxDaGlsZFByb3BzO1xuICByZW5kZXJJc1NjaGVkdWxlZC5jdXJyZW50ID0gZmFsc2U7IC8vIElmIHRoZSByZW5kZXIgd2FzIGZyb20gYSBzdG9yZSB1cGRhdGUsIGNsZWFyIG91dCB0aGF0IHJlZmVyZW5jZSBhbmQgY2FzY2FkZSB0aGUgc3Vic2NyaWJlciB1cGRhdGVcblxuICBpZiAoY2hpbGRQcm9wc0Zyb21TdG9yZVVwZGF0ZS5jdXJyZW50KSB7XG4gICAgY2hpbGRQcm9wc0Zyb21TdG9yZVVwZGF0ZS5jdXJyZW50ID0gbnVsbDtcbiAgICBub3RpZnlOZXN0ZWRTdWJzKCk7XG4gIH1cbn1cblxuZnVuY3Rpb24gc3Vic2NyaWJlVXBkYXRlcyhzaG91bGRIYW5kbGVTdGF0ZUNoYW5nZXMsIHN0b3JlLCBzdWJzY3JpcHRpb24sIGNoaWxkUHJvcHNTZWxlY3RvciwgbGFzdFdyYXBwZXJQcm9wcywgbGFzdENoaWxkUHJvcHMsIHJlbmRlcklzU2NoZWR1bGVkLCBjaGlsZFByb3BzRnJvbVN0b3JlVXBkYXRlLCBub3RpZnlOZXN0ZWRTdWJzLCBmb3JjZUNvbXBvbmVudFVwZGF0ZURpc3BhdGNoKSB7XG4gIC8vIElmIHdlJ3JlIG5vdCBzdWJzY3JpYmVkIHRvIHRoZSBzdG9yZSwgbm90aGluZyB0byBkbyBoZXJlXG4gIGlmICghc2hvdWxkSGFuZGxlU3RhdGVDaGFuZ2VzKSByZXR1cm47IC8vIENhcHR1cmUgdmFsdWVzIGZvciBjaGVja2luZyBpZiBhbmQgd2hlbiB0aGlzIGNvbXBvbmVudCB1bm1vdW50c1xuXG4gIHZhciBkaWRVbnN1YnNjcmliZSA9IGZhbHNlO1xuICB2YXIgbGFzdFRocm93bkVycm9yID0gbnVsbDsgLy8gV2UnbGwgcnVuIHRoaXMgY2FsbGJhY2sgZXZlcnkgdGltZSBhIHN0b3JlIHN1YnNjcmlwdGlvbiB1cGRhdGUgcHJvcGFnYXRlcyB0byB0aGlzIGNvbXBvbmVudFxuXG4gIHZhciBjaGVja0ZvclVwZGF0ZXMgPSBmdW5jdGlvbiBjaGVja0ZvclVwZGF0ZXMoKSB7XG4gICAgaWYgKGRpZFVuc3Vic2NyaWJlKSB7XG4gICAgICAvLyBEb24ndCBydW4gc3RhbGUgbGlzdGVuZXJzLlxuICAgICAgLy8gUmVkdXggZG9lc24ndCBndWFyYW50ZWUgdW5zdWJzY3JpcHRpb25zIGhhcHBlbiB1bnRpbCBuZXh0IGRpc3BhdGNoLlxuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHZhciBsYXRlc3RTdG9yZVN0YXRlID0gc3RvcmUuZ2V0U3RhdGUoKTtcbiAgICB2YXIgbmV3Q2hpbGRQcm9wcywgZXJyb3I7XG5cbiAgICB0cnkge1xuICAgICAgLy8gQWN0dWFsbHkgcnVuIHRoZSBzZWxlY3RvciB3aXRoIHRoZSBtb3N0IHJlY2VudCBzdG9yZSBzdGF0ZSBhbmQgd3JhcHBlciBwcm9wc1xuICAgICAgLy8gdG8gZGV0ZXJtaW5lIHdoYXQgdGhlIGNoaWxkIHByb3BzIHNob3VsZCBiZVxuICAgICAgbmV3Q2hpbGRQcm9wcyA9IGNoaWxkUHJvcHNTZWxlY3RvcihsYXRlc3RTdG9yZVN0YXRlLCBsYXN0V3JhcHBlclByb3BzLmN1cnJlbnQpO1xuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgIGVycm9yID0gZTtcbiAgICAgIGxhc3RUaHJvd25FcnJvciA9IGU7XG4gICAgfVxuXG4gICAgaWYgKCFlcnJvcikge1xuICAgICAgbGFzdFRocm93bkVycm9yID0gbnVsbDtcbiAgICB9IC8vIElmIHRoZSBjaGlsZCBwcm9wcyBoYXZlbid0IGNoYW5nZWQsIG5vdGhpbmcgdG8gZG8gaGVyZSAtIGNhc2NhZGUgdGhlIHN1YnNjcmlwdGlvbiB1cGRhdGVcblxuXG4gICAgaWYgKG5ld0NoaWxkUHJvcHMgPT09IGxhc3RDaGlsZFByb3BzLmN1cnJlbnQpIHtcbiAgICAgIGlmICghcmVuZGVySXNTY2hlZHVsZWQuY3VycmVudCkge1xuICAgICAgICBub3RpZnlOZXN0ZWRTdWJzKCk7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIFNhdmUgcmVmZXJlbmNlcyB0byB0aGUgbmV3IGNoaWxkIHByb3BzLiAgTm90ZSB0aGF0IHdlIHRyYWNrIHRoZSBcImNoaWxkIHByb3BzIGZyb20gc3RvcmUgdXBkYXRlXCJcbiAgICAgIC8vIGFzIGEgcmVmIGluc3RlYWQgb2YgYSB1c2VTdGF0ZS91c2VSZWR1Y2VyIGJlY2F1c2Ugd2UgbmVlZCBhIHdheSB0byBkZXRlcm1pbmUgaWYgdGhhdCB2YWx1ZSBoYXNcbiAgICAgIC8vIGJlZW4gcHJvY2Vzc2VkLiAgSWYgdGhpcyB3ZW50IGludG8gdXNlU3RhdGUvdXNlUmVkdWNlciwgd2UgY291bGRuJ3QgY2xlYXIgb3V0IHRoZSB2YWx1ZSB3aXRob3V0XG4gICAgICAvLyBmb3JjaW5nIGFub3RoZXIgcmUtcmVuZGVyLCB3aGljaCB3ZSBkb24ndCB3YW50LlxuICAgICAgbGFzdENoaWxkUHJvcHMuY3VycmVudCA9IG5ld0NoaWxkUHJvcHM7XG4gICAgICBjaGlsZFByb3BzRnJvbVN0b3JlVXBkYXRlLmN1cnJlbnQgPSBuZXdDaGlsZFByb3BzO1xuICAgICAgcmVuZGVySXNTY2hlZHVsZWQuY3VycmVudCA9IHRydWU7IC8vIElmIHRoZSBjaGlsZCBwcm9wcyBfZGlkXyBjaGFuZ2UgKG9yIHdlIGNhdWdodCBhbiBlcnJvciksIHRoaXMgd3JhcHBlciBjb21wb25lbnQgbmVlZHMgdG8gcmUtcmVuZGVyXG5cbiAgICAgIGZvcmNlQ29tcG9uZW50VXBkYXRlRGlzcGF0Y2goe1xuICAgICAgICB0eXBlOiAnU1RPUkVfVVBEQVRFRCcsXG4gICAgICAgIHBheWxvYWQ6IHtcbiAgICAgICAgICBlcnJvcjogZXJyb3JcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuICB9OyAvLyBBY3R1YWxseSBzdWJzY3JpYmUgdG8gdGhlIG5lYXJlc3QgY29ubmVjdGVkIGFuY2VzdG9yIChvciBzdG9yZSlcblxuXG4gIHN1YnNjcmlwdGlvbi5vblN0YXRlQ2hhbmdlID0gY2hlY2tGb3JVcGRhdGVzO1xuICBzdWJzY3JpcHRpb24udHJ5U3Vic2NyaWJlKCk7IC8vIFB1bGwgZGF0YSBmcm9tIHRoZSBzdG9yZSBhZnRlciBmaXJzdCByZW5kZXIgaW4gY2FzZSB0aGUgc3RvcmUgaGFzXG4gIC8vIGNoYW5nZWQgc2luY2Ugd2UgYmVnYW4uXG5cbiAgY2hlY2tGb3JVcGRhdGVzKCk7XG5cbiAgdmFyIHVuc3Vic2NyaWJlV3JhcHBlciA9IGZ1bmN0aW9uIHVuc3Vic2NyaWJlV3JhcHBlcigpIHtcbiAgICBkaWRVbnN1YnNjcmliZSA9IHRydWU7XG4gICAgc3Vic2NyaXB0aW9uLnRyeVVuc3Vic2NyaWJlKCk7XG4gICAgc3Vic2NyaXB0aW9uLm9uU3RhdGVDaGFuZ2UgPSBudWxsO1xuXG4gICAgaWYgKGxhc3RUaHJvd25FcnJvcikge1xuICAgICAgLy8gSXQncyBwb3NzaWJsZSB0aGF0IHdlIGNhdWdodCBhbiBlcnJvciBkdWUgdG8gYSBiYWQgbWFwU3RhdGUgZnVuY3Rpb24sIGJ1dCB0aGVcbiAgICAgIC8vIHBhcmVudCByZS1yZW5kZXJlZCB3aXRob3V0IHRoaXMgY29tcG9uZW50IGFuZCB3ZSdyZSBhYm91dCB0byB1bm1vdW50LlxuICAgICAgLy8gVGhpcyBzaG91bGRuJ3QgaGFwcGVuIGFzIGxvbmcgYXMgd2UgZG8gdG9wLWRvd24gc3Vic2NyaXB0aW9ucyBjb3JyZWN0bHksIGJ1dFxuICAgICAgLy8gaWYgd2UgZXZlciBkbyB0aG9zZSB3cm9uZywgdGhpcyB0aHJvdyB3aWxsIHN1cmZhY2UgdGhlIGVycm9yIGluIG91ciB0ZXN0cy5cbiAgICAgIC8vIEluIHRoYXQgY2FzZSwgdGhyb3cgdGhlIGVycm9yIGZyb20gaGVyZSBzbyBpdCBkb2Vzbid0IGdldCBsb3N0LlxuICAgICAgdGhyb3cgbGFzdFRocm93bkVycm9yO1xuICAgIH1cbiAgfTtcblxuICByZXR1cm4gdW5zdWJzY3JpYmVXcmFwcGVyO1xufVxuXG52YXIgaW5pdFN0YXRlVXBkYXRlcyA9IGZ1bmN0aW9uIGluaXRTdGF0ZVVwZGF0ZXMoKSB7XG4gIHJldHVybiBbbnVsbCwgMF07XG59O1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBjb25uZWN0QWR2YW5jZWQoXG4vKlxyXG4gIHNlbGVjdG9yRmFjdG9yeSBpcyBhIGZ1bmMgdGhhdCBpcyByZXNwb25zaWJsZSBmb3IgcmV0dXJuaW5nIHRoZSBzZWxlY3RvciBmdW5jdGlvbiB1c2VkIHRvXHJcbiAgY29tcHV0ZSBuZXcgcHJvcHMgZnJvbSBzdGF0ZSwgcHJvcHMsIGFuZCBkaXNwYXRjaC4gRm9yIGV4YW1wbGU6XHJcbiAgICAgIGV4cG9ydCBkZWZhdWx0IGNvbm5lY3RBZHZhbmNlZCgoZGlzcGF0Y2gsIG9wdGlvbnMpID0+IChzdGF0ZSwgcHJvcHMpID0+ICh7XHJcbiAgICAgIHRoaW5nOiBzdGF0ZS50aGluZ3NbcHJvcHMudGhpbmdJZF0sXHJcbiAgICAgIHNhdmVUaGluZzogZmllbGRzID0+IGRpc3BhdGNoKGFjdGlvbkNyZWF0b3JzLnNhdmVUaGluZyhwcm9wcy50aGluZ0lkLCBmaWVsZHMpKSxcclxuICAgIH0pKShZb3VyQ29tcG9uZW50KVxyXG4gICAgQWNjZXNzIHRvIGRpc3BhdGNoIGlzIHByb3ZpZGVkIHRvIHRoZSBmYWN0b3J5IHNvIHNlbGVjdG9yRmFjdG9yaWVzIGNhbiBiaW5kIGFjdGlvbkNyZWF0b3JzXHJcbiAgb3V0c2lkZSBvZiB0aGVpciBzZWxlY3RvciBhcyBhbiBvcHRpbWl6YXRpb24uIE9wdGlvbnMgcGFzc2VkIHRvIGNvbm5lY3RBZHZhbmNlZCBhcmUgcGFzc2VkIHRvXHJcbiAgdGhlIHNlbGVjdG9yRmFjdG9yeSwgYWxvbmcgd2l0aCBkaXNwbGF5TmFtZSBhbmQgV3JhcHBlZENvbXBvbmVudCwgYXMgdGhlIHNlY29uZCBhcmd1bWVudC5cclxuICAgIE5vdGUgdGhhdCBzZWxlY3RvckZhY3RvcnkgaXMgcmVzcG9uc2libGUgZm9yIGFsbCBjYWNoaW5nL21lbW9pemF0aW9uIG9mIGluYm91bmQgYW5kIG91dGJvdW5kXHJcbiAgcHJvcHMuIERvIG5vdCB1c2UgY29ubmVjdEFkdmFuY2VkIGRpcmVjdGx5IHdpdGhvdXQgbWVtb2l6aW5nIHJlc3VsdHMgYmV0d2VlbiBjYWxscyB0byB5b3VyXHJcbiAgc2VsZWN0b3IsIG90aGVyd2lzZSB0aGUgQ29ubmVjdCBjb21wb25lbnQgd2lsbCByZS1yZW5kZXIgb24gZXZlcnkgc3RhdGUgb3IgcHJvcHMgY2hhbmdlLlxyXG4qL1xuc2VsZWN0b3JGYWN0b3J5LCAvLyBvcHRpb25zIG9iamVjdDpcbl9yZWYpIHtcbiAgaWYgKF9yZWYgPT09IHZvaWQgMCkge1xuICAgIF9yZWYgPSB7fTtcbiAgfVxuXG4gIHZhciBfcmVmMiA9IF9yZWYsXG4gICAgICBfcmVmMiRnZXREaXNwbGF5TmFtZSA9IF9yZWYyLmdldERpc3BsYXlOYW1lLFxuICAgICAgZ2V0RGlzcGxheU5hbWUgPSBfcmVmMiRnZXREaXNwbGF5TmFtZSA9PT0gdm9pZCAwID8gZnVuY3Rpb24gKG5hbWUpIHtcbiAgICByZXR1cm4gXCJDb25uZWN0QWR2YW5jZWQoXCIgKyBuYW1lICsgXCIpXCI7XG4gIH0gOiBfcmVmMiRnZXREaXNwbGF5TmFtZSxcbiAgICAgIF9yZWYyJG1ldGhvZE5hbWUgPSBfcmVmMi5tZXRob2ROYW1lLFxuICAgICAgbWV0aG9kTmFtZSA9IF9yZWYyJG1ldGhvZE5hbWUgPT09IHZvaWQgMCA/ICdjb25uZWN0QWR2YW5jZWQnIDogX3JlZjIkbWV0aG9kTmFtZSxcbiAgICAgIF9yZWYyJHJlbmRlckNvdW50UHJvcCA9IF9yZWYyLnJlbmRlckNvdW50UHJvcCxcbiAgICAgIHJlbmRlckNvdW50UHJvcCA9IF9yZWYyJHJlbmRlckNvdW50UHJvcCA9PT0gdm9pZCAwID8gdW5kZWZpbmVkIDogX3JlZjIkcmVuZGVyQ291bnRQcm9wLFxuICAgICAgX3JlZjIkc2hvdWxkSGFuZGxlU3RhID0gX3JlZjIuc2hvdWxkSGFuZGxlU3RhdGVDaGFuZ2VzLFxuICAgICAgc2hvdWxkSGFuZGxlU3RhdGVDaGFuZ2VzID0gX3JlZjIkc2hvdWxkSGFuZGxlU3RhID09PSB2b2lkIDAgPyB0cnVlIDogX3JlZjIkc2hvdWxkSGFuZGxlU3RhLFxuICAgICAgX3JlZjIkc3RvcmVLZXkgPSBfcmVmMi5zdG9yZUtleSxcbiAgICAgIHN0b3JlS2V5ID0gX3JlZjIkc3RvcmVLZXkgPT09IHZvaWQgMCA/ICdzdG9yZScgOiBfcmVmMiRzdG9yZUtleSxcbiAgICAgIF9yZWYyJHdpdGhSZWYgPSBfcmVmMi53aXRoUmVmLFxuICAgICAgd2l0aFJlZiA9IF9yZWYyJHdpdGhSZWYgPT09IHZvaWQgMCA/IGZhbHNlIDogX3JlZjIkd2l0aFJlZixcbiAgICAgIF9yZWYyJGZvcndhcmRSZWYgPSBfcmVmMi5mb3J3YXJkUmVmLFxuICAgICAgZm9yd2FyZFJlZiA9IF9yZWYyJGZvcndhcmRSZWYgPT09IHZvaWQgMCA/IGZhbHNlIDogX3JlZjIkZm9yd2FyZFJlZixcbiAgICAgIF9yZWYyJGNvbnRleHQgPSBfcmVmMi5jb250ZXh0LFxuICAgICAgY29udGV4dCA9IF9yZWYyJGNvbnRleHQgPT09IHZvaWQgMCA/IFJlYWN0UmVkdXhDb250ZXh0IDogX3JlZjIkY29udGV4dCxcbiAgICAgIGNvbm5lY3RPcHRpb25zID0gX29iamVjdFdpdGhvdXRQcm9wZXJ0aWVzTG9vc2UoX3JlZjIsIF9leGNsdWRlZCk7XG5cbiAgaWYgKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicpIHtcbiAgICBpZiAocmVuZGVyQ291bnRQcm9wICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihcInJlbmRlckNvdW50UHJvcCBpcyByZW1vdmVkLiByZW5kZXIgY291bnRpbmcgaXMgYnVpbHQgaW50byB0aGUgbGF0ZXN0IFJlYWN0IERldiBUb29scyBwcm9maWxpbmcgZXh0ZW5zaW9uXCIpO1xuICAgIH1cblxuICAgIGlmICh3aXRoUmVmKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ3dpdGhSZWYgaXMgcmVtb3ZlZC4gVG8gYWNjZXNzIHRoZSB3cmFwcGVkIGluc3RhbmNlLCB1c2UgYSByZWYgb24gdGhlIGNvbm5lY3RlZCBjb21wb25lbnQnKTtcbiAgICB9XG5cbiAgICB2YXIgY3VzdG9tU3RvcmVXYXJuaW5nTWVzc2FnZSA9ICdUbyB1c2UgYSBjdXN0b20gUmVkdXggc3RvcmUgZm9yIHNwZWNpZmljIGNvbXBvbmVudHMsIGNyZWF0ZSBhIGN1c3RvbSBSZWFjdCBjb250ZXh0IHdpdGggJyArIFwiUmVhY3QuY3JlYXRlQ29udGV4dCgpLCBhbmQgcGFzcyB0aGUgY29udGV4dCBvYmplY3QgdG8gUmVhY3QgUmVkdXgncyBQcm92aWRlciBhbmQgc3BlY2lmaWMgY29tcG9uZW50c1wiICsgJyBsaWtlOiA8UHJvdmlkZXIgY29udGV4dD17TXlDb250ZXh0fT48Q29ubmVjdGVkQ29tcG9uZW50IGNvbnRleHQ9e015Q29udGV4dH0gLz48L1Byb3ZpZGVyPi4gJyArICdZb3UgbWF5IGFsc28gcGFzcyBhIHtjb250ZXh0IDogTXlDb250ZXh0fSBvcHRpb24gdG8gY29ubmVjdCc7XG5cbiAgICBpZiAoc3RvcmVLZXkgIT09ICdzdG9yZScpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignc3RvcmVLZXkgaGFzIGJlZW4gcmVtb3ZlZCBhbmQgZG9lcyBub3QgZG8gYW55dGhpbmcuICcgKyBjdXN0b21TdG9yZVdhcm5pbmdNZXNzYWdlKTtcbiAgICB9XG4gIH1cblxuICB2YXIgQ29udGV4dCA9IGNvbnRleHQ7XG4gIHJldHVybiBmdW5jdGlvbiB3cmFwV2l0aENvbm5lY3QoV3JhcHBlZENvbXBvbmVudCkge1xuICAgIGlmIChwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nICYmICFpc1ZhbGlkRWxlbWVudFR5cGUoV3JhcHBlZENvbXBvbmVudCkpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihcIllvdSBtdXN0IHBhc3MgYSBjb21wb25lbnQgdG8gdGhlIGZ1bmN0aW9uIHJldHVybmVkIGJ5IFwiICsgKG1ldGhvZE5hbWUgKyBcIi4gSW5zdGVhZCByZWNlaXZlZCBcIiArIHN0cmluZ2lmeUNvbXBvbmVudChXcmFwcGVkQ29tcG9uZW50KSkpO1xuICAgIH1cblxuICAgIHZhciB3cmFwcGVkQ29tcG9uZW50TmFtZSA9IFdyYXBwZWRDb21wb25lbnQuZGlzcGxheU5hbWUgfHwgV3JhcHBlZENvbXBvbmVudC5uYW1lIHx8ICdDb21wb25lbnQnO1xuICAgIHZhciBkaXNwbGF5TmFtZSA9IGdldERpc3BsYXlOYW1lKHdyYXBwZWRDb21wb25lbnROYW1lKTtcblxuICAgIHZhciBzZWxlY3RvckZhY3RvcnlPcHRpb25zID0gX2V4dGVuZHMoe30sIGNvbm5lY3RPcHRpb25zLCB7XG4gICAgICBnZXREaXNwbGF5TmFtZTogZ2V0RGlzcGxheU5hbWUsXG4gICAgICBtZXRob2ROYW1lOiBtZXRob2ROYW1lLFxuICAgICAgcmVuZGVyQ291bnRQcm9wOiByZW5kZXJDb3VudFByb3AsXG4gICAgICBzaG91bGRIYW5kbGVTdGF0ZUNoYW5nZXM6IHNob3VsZEhhbmRsZVN0YXRlQ2hhbmdlcyxcbiAgICAgIHN0b3JlS2V5OiBzdG9yZUtleSxcbiAgICAgIGRpc3BsYXlOYW1lOiBkaXNwbGF5TmFtZSxcbiAgICAgIHdyYXBwZWRDb21wb25lbnROYW1lOiB3cmFwcGVkQ29tcG9uZW50TmFtZSxcbiAgICAgIFdyYXBwZWRDb21wb25lbnQ6IFdyYXBwZWRDb21wb25lbnRcbiAgICB9KTtcblxuICAgIHZhciBwdXJlID0gY29ubmVjdE9wdGlvbnMucHVyZTtcblxuICAgIGZ1bmN0aW9uIGNyZWF0ZUNoaWxkU2VsZWN0b3Ioc3RvcmUpIHtcbiAgICAgIHJldHVybiBzZWxlY3RvckZhY3Rvcnkoc3RvcmUuZGlzcGF0Y2gsIHNlbGVjdG9yRmFjdG9yeU9wdGlvbnMpO1xuICAgIH0gLy8gSWYgd2UgYXJlbid0IHJ1bm5pbmcgaW4gXCJwdXJlXCIgbW9kZSwgd2UgZG9uJ3Qgd2FudCB0byBtZW1vaXplIHZhbHVlcy5cbiAgICAvLyBUbyBhdm9pZCBjb25kaXRpb25hbGx5IGNhbGxpbmcgaG9va3MsIHdlIGZhbGwgYmFjayB0byBhIHRpbnkgd3JhcHBlclxuICAgIC8vIHRoYXQganVzdCBleGVjdXRlcyB0aGUgZ2l2ZW4gY2FsbGJhY2sgaW1tZWRpYXRlbHkuXG5cblxuICAgIHZhciB1c2VQdXJlT25seU1lbW8gPSBwdXJlID8gdXNlTWVtbyA6IGZ1bmN0aW9uIChjYWxsYmFjaykge1xuICAgICAgcmV0dXJuIGNhbGxiYWNrKCk7XG4gICAgfTtcblxuICAgIGZ1bmN0aW9uIENvbm5lY3RGdW5jdGlvbihwcm9wcykge1xuICAgICAgdmFyIF91c2VNZW1vID0gdXNlTWVtbyhmdW5jdGlvbiAoKSB7XG4gICAgICAgIC8vIERpc3Rpbmd1aXNoIGJldHdlZW4gYWN0dWFsIFwiZGF0YVwiIHByb3BzIHRoYXQgd2VyZSBwYXNzZWQgdG8gdGhlIHdyYXBwZXIgY29tcG9uZW50LFxuICAgICAgICAvLyBhbmQgdmFsdWVzIG5lZWRlZCB0byBjb250cm9sIGJlaGF2aW9yIChmb3J3YXJkZWQgcmVmcywgYWx0ZXJuYXRlIGNvbnRleHQgaW5zdGFuY2VzKS5cbiAgICAgICAgLy8gVG8gbWFpbnRhaW4gdGhlIHdyYXBwZXJQcm9wcyBvYmplY3QgcmVmZXJlbmNlLCBtZW1vaXplIHRoaXMgZGVzdHJ1Y3R1cmluZy5cbiAgICAgICAgdmFyIHJlYWN0UmVkdXhGb3J3YXJkZWRSZWYgPSBwcm9wcy5yZWFjdFJlZHV4Rm9yd2FyZGVkUmVmLFxuICAgICAgICAgICAgd3JhcHBlclByb3BzID0gX29iamVjdFdpdGhvdXRQcm9wZXJ0aWVzTG9vc2UocHJvcHMsIF9leGNsdWRlZDIpO1xuXG4gICAgICAgIHJldHVybiBbcHJvcHMuY29udGV4dCwgcmVhY3RSZWR1eEZvcndhcmRlZFJlZiwgd3JhcHBlclByb3BzXTtcbiAgICAgIH0sIFtwcm9wc10pLFxuICAgICAgICAgIHByb3BzQ29udGV4dCA9IF91c2VNZW1vWzBdLFxuICAgICAgICAgIHJlYWN0UmVkdXhGb3J3YXJkZWRSZWYgPSBfdXNlTWVtb1sxXSxcbiAgICAgICAgICB3cmFwcGVyUHJvcHMgPSBfdXNlTWVtb1syXTtcblxuICAgICAgdmFyIENvbnRleHRUb1VzZSA9IHVzZU1lbW8oZnVuY3Rpb24gKCkge1xuICAgICAgICAvLyBVc2VycyBtYXkgb3B0aW9uYWxseSBwYXNzIGluIGEgY3VzdG9tIGNvbnRleHQgaW5zdGFuY2UgdG8gdXNlIGluc3RlYWQgb2Ygb3VyIFJlYWN0UmVkdXhDb250ZXh0LlxuICAgICAgICAvLyBNZW1vaXplIHRoZSBjaGVjayB0aGF0IGRldGVybWluZXMgd2hpY2ggY29udGV4dCBpbnN0YW5jZSB3ZSBzaG91bGQgdXNlLlxuICAgICAgICByZXR1cm4gcHJvcHNDb250ZXh0ICYmIHByb3BzQ29udGV4dC5Db25zdW1lciAmJiBpc0NvbnRleHRDb25zdW1lciggLyojX19QVVJFX18qL1JlYWN0LmNyZWF0ZUVsZW1lbnQocHJvcHNDb250ZXh0LkNvbnN1bWVyLCBudWxsKSkgPyBwcm9wc0NvbnRleHQgOiBDb250ZXh0O1xuICAgICAgfSwgW3Byb3BzQ29udGV4dCwgQ29udGV4dF0pOyAvLyBSZXRyaWV2ZSB0aGUgc3RvcmUgYW5kIGFuY2VzdG9yIHN1YnNjcmlwdGlvbiB2aWEgY29udGV4dCwgaWYgYXZhaWxhYmxlXG5cbiAgICAgIHZhciBjb250ZXh0VmFsdWUgPSB1c2VDb250ZXh0KENvbnRleHRUb1VzZSk7IC8vIFRoZSBzdG9yZSBfbXVzdF8gZXhpc3QgYXMgZWl0aGVyIGEgcHJvcCBvciBpbiBjb250ZXh0LlxuICAgICAgLy8gV2UnbGwgY2hlY2sgdG8gc2VlIGlmIGl0IF9sb29rc18gbGlrZSBhIFJlZHV4IHN0b3JlIGZpcnN0LlxuICAgICAgLy8gVGhpcyBhbGxvd3MgdXMgdG8gcGFzcyB0aHJvdWdoIGEgYHN0b3JlYCBwcm9wIHRoYXQgaXMganVzdCBhIHBsYWluIHZhbHVlLlxuXG4gICAgICB2YXIgZGlkU3RvcmVDb21lRnJvbVByb3BzID0gQm9vbGVhbihwcm9wcy5zdG9yZSkgJiYgQm9vbGVhbihwcm9wcy5zdG9yZS5nZXRTdGF0ZSkgJiYgQm9vbGVhbihwcm9wcy5zdG9yZS5kaXNwYXRjaCk7XG4gICAgICB2YXIgZGlkU3RvcmVDb21lRnJvbUNvbnRleHQgPSBCb29sZWFuKGNvbnRleHRWYWx1ZSkgJiYgQm9vbGVhbihjb250ZXh0VmFsdWUuc3RvcmUpO1xuXG4gICAgICBpZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJyAmJiAhZGlkU3RvcmVDb21lRnJvbVByb3BzICYmICFkaWRTdG9yZUNvbWVGcm9tQ29udGV4dCkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJDb3VsZCBub3QgZmluZCBcXFwic3RvcmVcXFwiIGluIHRoZSBjb250ZXh0IG9mIFwiICsgKFwiXFxcIlwiICsgZGlzcGxheU5hbWUgKyBcIlxcXCIuIEVpdGhlciB3cmFwIHRoZSByb290IGNvbXBvbmVudCBpbiBhIDxQcm92aWRlcj4sIFwiKSArIFwib3IgcGFzcyBhIGN1c3RvbSBSZWFjdCBjb250ZXh0IHByb3ZpZGVyIHRvIDxQcm92aWRlcj4gYW5kIHRoZSBjb3JyZXNwb25kaW5nIFwiICsgKFwiUmVhY3QgY29udGV4dCBjb25zdW1lciB0byBcIiArIGRpc3BsYXlOYW1lICsgXCIgaW4gY29ubmVjdCBvcHRpb25zLlwiKSk7XG4gICAgICB9IC8vIEJhc2VkIG9uIHRoZSBwcmV2aW91cyBjaGVjaywgb25lIG9mIHRoZXNlIG11c3QgYmUgdHJ1ZVxuXG5cbiAgICAgIHZhciBzdG9yZSA9IGRpZFN0b3JlQ29tZUZyb21Qcm9wcyA/IHByb3BzLnN0b3JlIDogY29udGV4dFZhbHVlLnN0b3JlO1xuICAgICAgdmFyIGNoaWxkUHJvcHNTZWxlY3RvciA9IHVzZU1lbW8oZnVuY3Rpb24gKCkge1xuICAgICAgICAvLyBUaGUgY2hpbGQgcHJvcHMgc2VsZWN0b3IgbmVlZHMgdGhlIHN0b3JlIHJlZmVyZW5jZSBhcyBhbiBpbnB1dC5cbiAgICAgICAgLy8gUmUtY3JlYXRlIHRoaXMgc2VsZWN0b3Igd2hlbmV2ZXIgdGhlIHN0b3JlIGNoYW5nZXMuXG4gICAgICAgIHJldHVybiBjcmVhdGVDaGlsZFNlbGVjdG9yKHN0b3JlKTtcbiAgICAgIH0sIFtzdG9yZV0pO1xuXG4gICAgICB2YXIgX3VzZU1lbW8yID0gdXNlTWVtbyhmdW5jdGlvbiAoKSB7XG4gICAgICAgIGlmICghc2hvdWxkSGFuZGxlU3RhdGVDaGFuZ2VzKSByZXR1cm4gTk9fU1VCU0NSSVBUSU9OX0FSUkFZOyAvLyBUaGlzIFN1YnNjcmlwdGlvbidzIHNvdXJjZSBzaG91bGQgbWF0Y2ggd2hlcmUgc3RvcmUgY2FtZSBmcm9tOiBwcm9wcyB2cy4gY29udGV4dC4gQSBjb21wb25lbnRcbiAgICAgICAgLy8gY29ubmVjdGVkIHRvIHRoZSBzdG9yZSB2aWEgcHJvcHMgc2hvdWxkbid0IHVzZSBzdWJzY3JpcHRpb24gZnJvbSBjb250ZXh0LCBvciB2aWNlIHZlcnNhLlxuXG4gICAgICAgIC8vIFRoaXMgU3Vic2NyaXB0aW9uJ3Mgc291cmNlIHNob3VsZCBtYXRjaCB3aGVyZSBzdG9yZSBjYW1lIGZyb206IHByb3BzIHZzLiBjb250ZXh0LiBBIGNvbXBvbmVudFxuICAgICAgICAvLyBjb25uZWN0ZWQgdG8gdGhlIHN0b3JlIHZpYSBwcm9wcyBzaG91bGRuJ3QgdXNlIHN1YnNjcmlwdGlvbiBmcm9tIGNvbnRleHQsIG9yIHZpY2UgdmVyc2EuXG4gICAgICAgIHZhciBzdWJzY3JpcHRpb24gPSBjcmVhdGVTdWJzY3JpcHRpb24oc3RvcmUsIGRpZFN0b3JlQ29tZUZyb21Qcm9wcyA/IG51bGwgOiBjb250ZXh0VmFsdWUuc3Vic2NyaXB0aW9uKTsgLy8gYG5vdGlmeU5lc3RlZFN1YnNgIGlzIGR1cGxpY2F0ZWQgdG8gaGFuZGxlIHRoZSBjYXNlIHdoZXJlIHRoZSBjb21wb25lbnQgaXMgdW5tb3VudGVkIGluXG4gICAgICAgIC8vIHRoZSBtaWRkbGUgb2YgdGhlIG5vdGlmaWNhdGlvbiBsb29wLCB3aGVyZSBgc3Vic2NyaXB0aW9uYCB3aWxsIHRoZW4gYmUgbnVsbC4gVGhpcyBjYW5cbiAgICAgICAgLy8gcHJvYmFibHkgYmUgYXZvaWRlZCBpZiBTdWJzY3JpcHRpb24ncyBsaXN0ZW5lcnMgbG9naWMgaXMgY2hhbmdlZCB0byBub3QgY2FsbCBsaXN0ZW5lcnNcbiAgICAgICAgLy8gdGhhdCBoYXZlIGJlZW4gdW5zdWJzY3JpYmVkIGluIHRoZSAgbWlkZGxlIG9mIHRoZSBub3RpZmljYXRpb24gbG9vcC5cblxuICAgICAgICAvLyBgbm90aWZ5TmVzdGVkU3Vic2AgaXMgZHVwbGljYXRlZCB0byBoYW5kbGUgdGhlIGNhc2Ugd2hlcmUgdGhlIGNvbXBvbmVudCBpcyB1bm1vdW50ZWQgaW5cbiAgICAgICAgLy8gdGhlIG1pZGRsZSBvZiB0aGUgbm90aWZpY2F0aW9uIGxvb3AsIHdoZXJlIGBzdWJzY3JpcHRpb25gIHdpbGwgdGhlbiBiZSBudWxsLiBUaGlzIGNhblxuICAgICAgICAvLyBwcm9iYWJseSBiZSBhdm9pZGVkIGlmIFN1YnNjcmlwdGlvbidzIGxpc3RlbmVycyBsb2dpYyBpcyBjaGFuZ2VkIHRvIG5vdCBjYWxsIGxpc3RlbmVyc1xuICAgICAgICAvLyB0aGF0IGhhdmUgYmVlbiB1bnN1YnNjcmliZWQgaW4gdGhlICBtaWRkbGUgb2YgdGhlIG5vdGlmaWNhdGlvbiBsb29wLlxuICAgICAgICB2YXIgbm90aWZ5TmVzdGVkU3VicyA9IHN1YnNjcmlwdGlvbi5ub3RpZnlOZXN0ZWRTdWJzLmJpbmQoc3Vic2NyaXB0aW9uKTtcbiAgICAgICAgcmV0dXJuIFtzdWJzY3JpcHRpb24sIG5vdGlmeU5lc3RlZFN1YnNdO1xuICAgICAgfSwgW3N0b3JlLCBkaWRTdG9yZUNvbWVGcm9tUHJvcHMsIGNvbnRleHRWYWx1ZV0pLFxuICAgICAgICAgIHN1YnNjcmlwdGlvbiA9IF91c2VNZW1vMlswXSxcbiAgICAgICAgICBub3RpZnlOZXN0ZWRTdWJzID0gX3VzZU1lbW8yWzFdOyAvLyBEZXRlcm1pbmUgd2hhdCB7c3RvcmUsIHN1YnNjcmlwdGlvbn0gdmFsdWUgc2hvdWxkIGJlIHB1dCBpbnRvIG5lc3RlZCBjb250ZXh0LCBpZiBuZWNlc3NhcnksXG4gICAgICAvLyBhbmQgbWVtb2l6ZSB0aGF0IHZhbHVlIHRvIGF2b2lkIHVubmVjZXNzYXJ5IGNvbnRleHQgdXBkYXRlcy5cblxuXG4gICAgICB2YXIgb3ZlcnJpZGRlbkNvbnRleHRWYWx1ZSA9IHVzZU1lbW8oZnVuY3Rpb24gKCkge1xuICAgICAgICBpZiAoZGlkU3RvcmVDb21lRnJvbVByb3BzKSB7XG4gICAgICAgICAgLy8gVGhpcyBjb21wb25lbnQgaXMgZGlyZWN0bHkgc3Vic2NyaWJlZCB0byBhIHN0b3JlIGZyb20gcHJvcHMuXG4gICAgICAgICAgLy8gV2UgZG9uJ3Qgd2FudCBkZXNjZW5kYW50cyByZWFkaW5nIGZyb20gdGhpcyBzdG9yZSAtIHBhc3MgZG93biB3aGF0ZXZlclxuICAgICAgICAgIC8vIHRoZSBleGlzdGluZyBjb250ZXh0IHZhbHVlIGlzIGZyb20gdGhlIG5lYXJlc3QgY29ubmVjdGVkIGFuY2VzdG9yLlxuICAgICAgICAgIHJldHVybiBjb250ZXh0VmFsdWU7XG4gICAgICAgIH0gLy8gT3RoZXJ3aXNlLCBwdXQgdGhpcyBjb21wb25lbnQncyBzdWJzY3JpcHRpb24gaW5zdGFuY2UgaW50byBjb250ZXh0LCBzbyB0aGF0XG4gICAgICAgIC8vIGNvbm5lY3RlZCBkZXNjZW5kYW50cyB3b24ndCB1cGRhdGUgdW50aWwgYWZ0ZXIgdGhpcyBjb21wb25lbnQgaXMgZG9uZVxuXG5cbiAgICAgICAgcmV0dXJuIF9leHRlbmRzKHt9LCBjb250ZXh0VmFsdWUsIHtcbiAgICAgICAgICBzdWJzY3JpcHRpb246IHN1YnNjcmlwdGlvblxuICAgICAgICB9KTtcbiAgICAgIH0sIFtkaWRTdG9yZUNvbWVGcm9tUHJvcHMsIGNvbnRleHRWYWx1ZSwgc3Vic2NyaXB0aW9uXSk7IC8vIFdlIG5lZWQgdG8gZm9yY2UgdGhpcyB3cmFwcGVyIGNvbXBvbmVudCB0byByZS1yZW5kZXIgd2hlbmV2ZXIgYSBSZWR1eCBzdG9yZSB1cGRhdGVcbiAgICAgIC8vIGNhdXNlcyBhIGNoYW5nZSB0byB0aGUgY2FsY3VsYXRlZCBjaGlsZCBjb21wb25lbnQgcHJvcHMgKG9yIHdlIGNhdWdodCBhbiBlcnJvciBpbiBtYXBTdGF0ZSlcblxuICAgICAgdmFyIF91c2VSZWR1Y2VyID0gdXNlUmVkdWNlcihzdG9yZVN0YXRlVXBkYXRlc1JlZHVjZXIsIEVNUFRZX0FSUkFZLCBpbml0U3RhdGVVcGRhdGVzKSxcbiAgICAgICAgICBfdXNlUmVkdWNlciQgPSBfdXNlUmVkdWNlclswXSxcbiAgICAgICAgICBwcmV2aW91c1N0YXRlVXBkYXRlUmVzdWx0ID0gX3VzZVJlZHVjZXIkWzBdLFxuICAgICAgICAgIGZvcmNlQ29tcG9uZW50VXBkYXRlRGlzcGF0Y2ggPSBfdXNlUmVkdWNlclsxXTsgLy8gUHJvcGFnYXRlIGFueSBtYXBTdGF0ZS9tYXBEaXNwYXRjaCBlcnJvcnMgdXB3YXJkc1xuXG5cbiAgICAgIGlmIChwcmV2aW91c1N0YXRlVXBkYXRlUmVzdWx0ICYmIHByZXZpb3VzU3RhdGVVcGRhdGVSZXN1bHQuZXJyb3IpIHtcbiAgICAgICAgdGhyb3cgcHJldmlvdXNTdGF0ZVVwZGF0ZVJlc3VsdC5lcnJvcjtcbiAgICAgIH0gLy8gU2V0IHVwIHJlZnMgdG8gY29vcmRpbmF0ZSB2YWx1ZXMgYmV0d2VlbiB0aGUgc3Vic2NyaXB0aW9uIGVmZmVjdCBhbmQgdGhlIHJlbmRlciBsb2dpY1xuXG5cbiAgICAgIHZhciBsYXN0Q2hpbGRQcm9wcyA9IHVzZVJlZigpO1xuICAgICAgdmFyIGxhc3RXcmFwcGVyUHJvcHMgPSB1c2VSZWYod3JhcHBlclByb3BzKTtcbiAgICAgIHZhciBjaGlsZFByb3BzRnJvbVN0b3JlVXBkYXRlID0gdXNlUmVmKCk7XG4gICAgICB2YXIgcmVuZGVySXNTY2hlZHVsZWQgPSB1c2VSZWYoZmFsc2UpO1xuICAgICAgdmFyIGFjdHVhbENoaWxkUHJvcHMgPSB1c2VQdXJlT25seU1lbW8oZnVuY3Rpb24gKCkge1xuICAgICAgICAvLyBUcmlja3kgbG9naWMgaGVyZTpcbiAgICAgICAgLy8gLSBUaGlzIHJlbmRlciBtYXkgaGF2ZSBiZWVuIHRyaWdnZXJlZCBieSBhIFJlZHV4IHN0b3JlIHVwZGF0ZSB0aGF0IHByb2R1Y2VkIG5ldyBjaGlsZCBwcm9wc1xuICAgICAgICAvLyAtIEhvd2V2ZXIsIHdlIG1heSBoYXZlIGdvdHRlbiBuZXcgd3JhcHBlciBwcm9wcyBhZnRlciB0aGF0XG4gICAgICAgIC8vIElmIHdlIGhhdmUgbmV3IGNoaWxkIHByb3BzLCBhbmQgdGhlIHNhbWUgd3JhcHBlciBwcm9wcywgd2Uga25vdyB3ZSBzaG91bGQgdXNlIHRoZSBuZXcgY2hpbGQgcHJvcHMgYXMtaXMuXG4gICAgICAgIC8vIEJ1dCwgaWYgd2UgaGF2ZSBuZXcgd3JhcHBlciBwcm9wcywgdGhvc2UgbWlnaHQgY2hhbmdlIHRoZSBjaGlsZCBwcm9wcywgc28gd2UgaGF2ZSB0byByZWNhbGN1bGF0ZSB0aGluZ3MuXG4gICAgICAgIC8vIFNvLCB3ZSdsbCB1c2UgdGhlIGNoaWxkIHByb3BzIGZyb20gc3RvcmUgdXBkYXRlIG9ubHkgaWYgdGhlIHdyYXBwZXIgcHJvcHMgYXJlIHRoZSBzYW1lIGFzIGxhc3QgdGltZS5cbiAgICAgICAgaWYgKGNoaWxkUHJvcHNGcm9tU3RvcmVVcGRhdGUuY3VycmVudCAmJiB3cmFwcGVyUHJvcHMgPT09IGxhc3RXcmFwcGVyUHJvcHMuY3VycmVudCkge1xuICAgICAgICAgIHJldHVybiBjaGlsZFByb3BzRnJvbVN0b3JlVXBkYXRlLmN1cnJlbnQ7XG4gICAgICAgIH0gLy8gVE9ETyBXZSdyZSByZWFkaW5nIHRoZSBzdG9yZSBkaXJlY3RseSBpbiByZW5kZXIoKSBoZXJlLiBCYWQgaWRlYT9cbiAgICAgICAgLy8gVGhpcyB3aWxsIGxpa2VseSBjYXVzZSBCYWQgVGhpbmdzIChUTSkgdG8gaGFwcGVuIGluIENvbmN1cnJlbnQgTW9kZS5cbiAgICAgICAgLy8gTm90ZSB0aGF0IHdlIGRvIHRoaXMgYmVjYXVzZSBvbiByZW5kZXJzIF9ub3RfIGNhdXNlZCBieSBzdG9yZSB1cGRhdGVzLCB3ZSBuZWVkIHRoZSBsYXRlc3Qgc3RvcmUgc3RhdGVcbiAgICAgICAgLy8gdG8gZGV0ZXJtaW5lIHdoYXQgdGhlIGNoaWxkIHByb3BzIHNob3VsZCBiZS5cblxuXG4gICAgICAgIHJldHVybiBjaGlsZFByb3BzU2VsZWN0b3Ioc3RvcmUuZ2V0U3RhdGUoKSwgd3JhcHBlclByb3BzKTtcbiAgICAgIH0sIFtzdG9yZSwgcHJldmlvdXNTdGF0ZVVwZGF0ZVJlc3VsdCwgd3JhcHBlclByb3BzXSk7IC8vIFdlIG5lZWQgdGhpcyB0byBleGVjdXRlIHN5bmNocm9ub3VzbHkgZXZlcnkgdGltZSB3ZSByZS1yZW5kZXIuIEhvd2V2ZXIsIFJlYWN0IHdhcm5zXG4gICAgICAvLyBhYm91dCB1c2VMYXlvdXRFZmZlY3QgaW4gU1NSLCBzbyB3ZSB0cnkgdG8gZGV0ZWN0IGVudmlyb25tZW50IGFuZCBmYWxsIGJhY2sgdG9cbiAgICAgIC8vIGp1c3QgdXNlRWZmZWN0IGluc3RlYWQgdG8gYXZvaWQgdGhlIHdhcm5pbmcsIHNpbmNlIG5laXRoZXIgd2lsbCBydW4gYW55d2F5LlxuXG4gICAgICB1c2VJc29tb3JwaGljTGF5b3V0RWZmZWN0V2l0aEFyZ3MoY2FwdHVyZVdyYXBwZXJQcm9wcywgW2xhc3RXcmFwcGVyUHJvcHMsIGxhc3RDaGlsZFByb3BzLCByZW5kZXJJc1NjaGVkdWxlZCwgd3JhcHBlclByb3BzLCBhY3R1YWxDaGlsZFByb3BzLCBjaGlsZFByb3BzRnJvbVN0b3JlVXBkYXRlLCBub3RpZnlOZXN0ZWRTdWJzXSk7IC8vIE91ciByZS1zdWJzY3JpYmUgbG9naWMgb25seSBydW5zIHdoZW4gdGhlIHN0b3JlL3N1YnNjcmlwdGlvbiBzZXR1cCBjaGFuZ2VzXG5cbiAgICAgIHVzZUlzb21vcnBoaWNMYXlvdXRFZmZlY3RXaXRoQXJncyhzdWJzY3JpYmVVcGRhdGVzLCBbc2hvdWxkSGFuZGxlU3RhdGVDaGFuZ2VzLCBzdG9yZSwgc3Vic2NyaXB0aW9uLCBjaGlsZFByb3BzU2VsZWN0b3IsIGxhc3RXcmFwcGVyUHJvcHMsIGxhc3RDaGlsZFByb3BzLCByZW5kZXJJc1NjaGVkdWxlZCwgY2hpbGRQcm9wc0Zyb21TdG9yZVVwZGF0ZSwgbm90aWZ5TmVzdGVkU3VicywgZm9yY2VDb21wb25lbnRVcGRhdGVEaXNwYXRjaF0sIFtzdG9yZSwgc3Vic2NyaXB0aW9uLCBjaGlsZFByb3BzU2VsZWN0b3JdKTsgLy8gTm93IHRoYXQgYWxsIHRoYXQncyBkb25lLCB3ZSBjYW4gZmluYWxseSB0cnkgdG8gYWN0dWFsbHkgcmVuZGVyIHRoZSBjaGlsZCBjb21wb25lbnQuXG4gICAgICAvLyBXZSBtZW1vaXplIHRoZSBlbGVtZW50cyBmb3IgdGhlIHJlbmRlcmVkIGNoaWxkIGNvbXBvbmVudCBhcyBhbiBvcHRpbWl6YXRpb24uXG5cbiAgICAgIHZhciByZW5kZXJlZFdyYXBwZWRDb21wb25lbnQgPSB1c2VNZW1vKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIC8qI19fUFVSRV9fKi9SZWFjdC5jcmVhdGVFbGVtZW50KFdyYXBwZWRDb21wb25lbnQsIF9leHRlbmRzKHt9LCBhY3R1YWxDaGlsZFByb3BzLCB7XG4gICAgICAgICAgcmVmOiByZWFjdFJlZHV4Rm9yd2FyZGVkUmVmXG4gICAgICAgIH0pKTtcbiAgICAgIH0sIFtyZWFjdFJlZHV4Rm9yd2FyZGVkUmVmLCBXcmFwcGVkQ29tcG9uZW50LCBhY3R1YWxDaGlsZFByb3BzXSk7IC8vIElmIFJlYWN0IHNlZXMgdGhlIGV4YWN0IHNhbWUgZWxlbWVudCByZWZlcmVuY2UgYXMgbGFzdCB0aW1lLCBpdCBiYWlscyBvdXQgb2YgcmUtcmVuZGVyaW5nXG4gICAgICAvLyB0aGF0IGNoaWxkLCBzYW1lIGFzIGlmIGl0IHdhcyB3cmFwcGVkIGluIFJlYWN0Lm1lbW8oKSBvciByZXR1cm5lZCBmYWxzZSBmcm9tIHNob3VsZENvbXBvbmVudFVwZGF0ZS5cblxuICAgICAgdmFyIHJlbmRlcmVkQ2hpbGQgPSB1c2VNZW1vKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgaWYgKHNob3VsZEhhbmRsZVN0YXRlQ2hhbmdlcykge1xuICAgICAgICAgIC8vIElmIHRoaXMgY29tcG9uZW50IGlzIHN1YnNjcmliZWQgdG8gc3RvcmUgdXBkYXRlcywgd2UgbmVlZCB0byBwYXNzIGl0cyBvd25cbiAgICAgICAgICAvLyBzdWJzY3JpcHRpb24gaW5zdGFuY2UgZG93biB0byBvdXIgZGVzY2VuZGFudHMuIFRoYXQgbWVhbnMgcmVuZGVyaW5nIHRoZSBzYW1lXG4gICAgICAgICAgLy8gQ29udGV4dCBpbnN0YW5jZSwgYW5kIHB1dHRpbmcgYSBkaWZmZXJlbnQgdmFsdWUgaW50byB0aGUgY29udGV4dC5cbiAgICAgICAgICByZXR1cm4gLyojX19QVVJFX18qL1JlYWN0LmNyZWF0ZUVsZW1lbnQoQ29udGV4dFRvVXNlLlByb3ZpZGVyLCB7XG4gICAgICAgICAgICB2YWx1ZTogb3ZlcnJpZGRlbkNvbnRleHRWYWx1ZVxuICAgICAgICAgIH0sIHJlbmRlcmVkV3JhcHBlZENvbXBvbmVudCk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gcmVuZGVyZWRXcmFwcGVkQ29tcG9uZW50O1xuICAgICAgfSwgW0NvbnRleHRUb1VzZSwgcmVuZGVyZWRXcmFwcGVkQ29tcG9uZW50LCBvdmVycmlkZGVuQ29udGV4dFZhbHVlXSk7XG4gICAgICByZXR1cm4gcmVuZGVyZWRDaGlsZDtcbiAgICB9IC8vIElmIHdlJ3JlIGluIFwicHVyZVwiIG1vZGUsIGVuc3VyZSBvdXIgd3JhcHBlciBjb21wb25lbnQgb25seSByZS1yZW5kZXJzIHdoZW4gaW5jb21pbmcgcHJvcHMgaGF2ZSBjaGFuZ2VkLlxuXG5cbiAgICB2YXIgQ29ubmVjdCA9IHB1cmUgPyBSZWFjdC5tZW1vKENvbm5lY3RGdW5jdGlvbikgOiBDb25uZWN0RnVuY3Rpb247XG4gICAgQ29ubmVjdC5XcmFwcGVkQ29tcG9uZW50ID0gV3JhcHBlZENvbXBvbmVudDtcbiAgICBDb25uZWN0LmRpc3BsYXlOYW1lID0gQ29ubmVjdEZ1bmN0aW9uLmRpc3BsYXlOYW1lID0gZGlzcGxheU5hbWU7XG5cbiAgICBpZiAoZm9yd2FyZFJlZikge1xuICAgICAgdmFyIGZvcndhcmRlZCA9IFJlYWN0LmZvcndhcmRSZWYoZnVuY3Rpb24gZm9yd2FyZENvbm5lY3RSZWYocHJvcHMsIHJlZikge1xuICAgICAgICByZXR1cm4gLyojX19QVVJFX18qL1JlYWN0LmNyZWF0ZUVsZW1lbnQoQ29ubmVjdCwgX2V4dGVuZHMoe30sIHByb3BzLCB7XG4gICAgICAgICAgcmVhY3RSZWR1eEZvcndhcmRlZFJlZjogcmVmXG4gICAgICAgIH0pKTtcbiAgICAgIH0pO1xuICAgICAgZm9yd2FyZGVkLmRpc3BsYXlOYW1lID0gZGlzcGxheU5hbWU7XG4gICAgICBmb3J3YXJkZWQuV3JhcHBlZENvbXBvbmVudCA9IFdyYXBwZWRDb21wb25lbnQ7XG4gICAgICByZXR1cm4gaG9pc3RTdGF0aWNzKGZvcndhcmRlZCwgV3JhcHBlZENvbXBvbmVudCk7XG4gICAgfVxuXG4gICAgcmV0dXJuIGhvaXN0U3RhdGljcyhDb25uZWN0LCBXcmFwcGVkQ29tcG9uZW50KTtcbiAgfTtcbn0iLCAiaW1wb3J0IHsgdXNlQ29udGV4dCB9IGZyb20gJ3JlYWN0JztcbmltcG9ydCB7IFJlYWN0UmVkdXhDb250ZXh0IH0gZnJvbSAnLi4vY29tcG9uZW50cy9Db250ZXh0JztcbmltcG9ydCB7IHVzZVJlZHV4Q29udGV4dCBhcyB1c2VEZWZhdWx0UmVkdXhDb250ZXh0IH0gZnJvbSAnLi91c2VSZWR1eENvbnRleHQnO1xuLyoqXHJcbiAqIEhvb2sgZmFjdG9yeSwgd2hpY2ggY3JlYXRlcyBhIGB1c2VTdG9yZWAgaG9vayBib3VuZCB0byBhIGdpdmVuIGNvbnRleHQuXHJcbiAqXHJcbiAqIEBwYXJhbSB7UmVhY3QuQ29udGV4dH0gW2NvbnRleHQ9UmVhY3RSZWR1eENvbnRleHRdIENvbnRleHQgcGFzc2VkIHRvIHlvdXIgYDxQcm92aWRlcj5gLlxyXG4gKiBAcmV0dXJucyB7RnVuY3Rpb259IEEgYHVzZVN0b3JlYCBob29rIGJvdW5kIHRvIHRoZSBzcGVjaWZpZWQgY29udGV4dC5cclxuICovXG5cbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGVTdG9yZUhvb2soY29udGV4dCkge1xuICBpZiAoY29udGV4dCA9PT0gdm9pZCAwKSB7XG4gICAgY29udGV4dCA9IFJlYWN0UmVkdXhDb250ZXh0O1xuICB9XG5cbiAgdmFyIHVzZVJlZHV4Q29udGV4dCA9IGNvbnRleHQgPT09IFJlYWN0UmVkdXhDb250ZXh0ID8gdXNlRGVmYXVsdFJlZHV4Q29udGV4dCA6IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gdXNlQ29udGV4dChjb250ZXh0KTtcbiAgfTtcbiAgcmV0dXJuIGZ1bmN0aW9uIHVzZVN0b3JlKCkge1xuICAgIHZhciBfdXNlUmVkdXhDb250ZXh0ID0gdXNlUmVkdXhDb250ZXh0KCksXG4gICAgICAgIHN0b3JlID0gX3VzZVJlZHV4Q29udGV4dC5zdG9yZTtcblxuICAgIHJldHVybiBzdG9yZTtcbiAgfTtcbn1cbi8qKlxyXG4gKiBBIGhvb2sgdG8gYWNjZXNzIHRoZSByZWR1eCBzdG9yZS5cclxuICpcclxuICogQHJldHVybnMge2FueX0gdGhlIHJlZHV4IHN0b3JlXHJcbiAqXHJcbiAqIEBleGFtcGxlXHJcbiAqXHJcbiAqIGltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCdcclxuICogaW1wb3J0IHsgdXNlU3RvcmUgfSBmcm9tICdyZWFjdC1yZWR1eCdcclxuICpcclxuICogZXhwb3J0IGNvbnN0IEV4YW1wbGVDb21wb25lbnQgPSAoKSA9PiB7XHJcbiAqICAgY29uc3Qgc3RvcmUgPSB1c2VTdG9yZSgpXHJcbiAqICAgcmV0dXJuIDxkaXY+e3N0b3JlLmdldFN0YXRlKCl9PC9kaXY+XHJcbiAqIH1cclxuICovXG5cbmV4cG9ydCB2YXIgdXNlU3RvcmUgPSAvKiNfX1BVUkVfXyovY3JlYXRlU3RvcmVIb29rKCk7IiwgImltcG9ydCB7IHVzZUNvbnRleHQgfSBmcm9tICdyZWFjdCc7XG5pbXBvcnQgeyBSZWFjdFJlZHV4Q29udGV4dCB9IGZyb20gJy4uL2NvbXBvbmVudHMvQ29udGV4dCc7XG4vKipcclxuICogQSBob29rIHRvIGFjY2VzcyB0aGUgdmFsdWUgb2YgdGhlIGBSZWFjdFJlZHV4Q29udGV4dGAuIFRoaXMgaXMgYSBsb3ctbGV2ZWxcclxuICogaG9vayB0aGF0IHlvdSBzaG91bGQgdXN1YWxseSBub3QgbmVlZCB0byBjYWxsIGRpcmVjdGx5LlxyXG4gKlxyXG4gKiBAcmV0dXJucyB7YW55fSB0aGUgdmFsdWUgb2YgdGhlIGBSZWFjdFJlZHV4Q29udGV4dGBcclxuICpcclxuICogQGV4YW1wbGVcclxuICpcclxuICogaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0J1xyXG4gKiBpbXBvcnQgeyB1c2VSZWR1eENvbnRleHQgfSBmcm9tICdyZWFjdC1yZWR1eCdcclxuICpcclxuICogZXhwb3J0IGNvbnN0IENvdW50ZXJDb21wb25lbnQgPSAoeyB2YWx1ZSB9KSA9PiB7XHJcbiAqICAgY29uc3QgeyBzdG9yZSB9ID0gdXNlUmVkdXhDb250ZXh0KClcclxuICogICByZXR1cm4gPGRpdj57c3RvcmUuZ2V0U3RhdGUoKX08L2Rpdj5cclxuICogfVxyXG4gKi9cblxuZXhwb3J0IGZ1bmN0aW9uIHVzZVJlZHV4Q29udGV4dCgpIHtcbiAgdmFyIGNvbnRleHRWYWx1ZSA9IHVzZUNvbnRleHQoUmVhY3RSZWR1eENvbnRleHQpO1xuXG4gIGlmIChwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nICYmICFjb250ZXh0VmFsdWUpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ2NvdWxkIG5vdCBmaW5kIHJlYWN0LXJlZHV4IGNvbnRleHQgdmFsdWU7IHBsZWFzZSBlbnN1cmUgdGhlIGNvbXBvbmVudCBpcyB3cmFwcGVkIGluIGEgPFByb3ZpZGVyPicpO1xuICB9XG5cbiAgcmV0dXJuIGNvbnRleHRWYWx1ZTtcbn0iLCAiaW1wb3J0IHsgUmVhY3RSZWR1eENvbnRleHQgfSBmcm9tICcuLi9jb21wb25lbnRzL0NvbnRleHQnO1xuaW1wb3J0IHsgdXNlU3RvcmUgYXMgdXNlRGVmYXVsdFN0b3JlLCBjcmVhdGVTdG9yZUhvb2sgfSBmcm9tICcuL3VzZVN0b3JlJztcbi8qKlxyXG4gKiBIb29rIGZhY3RvcnksIHdoaWNoIGNyZWF0ZXMgYSBgdXNlRGlzcGF0Y2hgIGhvb2sgYm91bmQgdG8gYSBnaXZlbiBjb250ZXh0LlxyXG4gKlxyXG4gKiBAcGFyYW0ge1JlYWN0LkNvbnRleHR9IFtjb250ZXh0PVJlYWN0UmVkdXhDb250ZXh0XSBDb250ZXh0IHBhc3NlZCB0byB5b3VyIGA8UHJvdmlkZXI+YC5cclxuICogQHJldHVybnMge0Z1bmN0aW9ufSBBIGB1c2VEaXNwYXRjaGAgaG9vayBib3VuZCB0byB0aGUgc3BlY2lmaWVkIGNvbnRleHQuXHJcbiAqL1xuXG5leHBvcnQgZnVuY3Rpb24gY3JlYXRlRGlzcGF0Y2hIb29rKGNvbnRleHQpIHtcbiAgaWYgKGNvbnRleHQgPT09IHZvaWQgMCkge1xuICAgIGNvbnRleHQgPSBSZWFjdFJlZHV4Q29udGV4dDtcbiAgfVxuXG4gIHZhciB1c2VTdG9yZSA9IGNvbnRleHQgPT09IFJlYWN0UmVkdXhDb250ZXh0ID8gdXNlRGVmYXVsdFN0b3JlIDogY3JlYXRlU3RvcmVIb29rKGNvbnRleHQpO1xuICByZXR1cm4gZnVuY3Rpb24gdXNlRGlzcGF0Y2goKSB7XG4gICAgdmFyIHN0b3JlID0gdXNlU3RvcmUoKTtcbiAgICByZXR1cm4gc3RvcmUuZGlzcGF0Y2g7XG4gIH07XG59XG4vKipcclxuICogQSBob29rIHRvIGFjY2VzcyB0aGUgcmVkdXggYGRpc3BhdGNoYCBmdW5jdGlvbi5cclxuICpcclxuICogQHJldHVybnMge2FueXxmdW5jdGlvbn0gcmVkdXggc3RvcmUncyBgZGlzcGF0Y2hgIGZ1bmN0aW9uXHJcbiAqXHJcbiAqIEBleGFtcGxlXHJcbiAqXHJcbiAqIGltcG9ydCBSZWFjdCwgeyB1c2VDYWxsYmFjayB9IGZyb20gJ3JlYWN0J1xyXG4gKiBpbXBvcnQgeyB1c2VEaXNwYXRjaCB9IGZyb20gJ3JlYWN0LXJlZHV4J1xyXG4gKlxyXG4gKiBleHBvcnQgY29uc3QgQ291bnRlckNvbXBvbmVudCA9ICh7IHZhbHVlIH0pID0+IHtcclxuICogICBjb25zdCBkaXNwYXRjaCA9IHVzZURpc3BhdGNoKClcclxuICogICBjb25zdCBpbmNyZWFzZUNvdW50ZXIgPSB1c2VDYWxsYmFjaygoKSA9PiBkaXNwYXRjaCh7IHR5cGU6ICdpbmNyZWFzZS1jb3VudGVyJyB9KSwgW10pXHJcbiAqICAgcmV0dXJuIChcclxuICogICAgIDxkaXY+XHJcbiAqICAgICAgIDxzcGFuPnt2YWx1ZX08L3NwYW4+XHJcbiAqICAgICAgIDxidXR0b24gb25DbGljaz17aW5jcmVhc2VDb3VudGVyfT5JbmNyZWFzZSBjb3VudGVyPC9idXR0b24+XHJcbiAqICAgICA8L2Rpdj5cclxuICogICApXHJcbiAqIH1cclxuICovXG5cbmV4cG9ydCB2YXIgdXNlRGlzcGF0Y2ggPSAvKiNfX1BVUkVfXyovY3JlYXRlRGlzcGF0Y2hIb29rKCk7IiwgImltcG9ydCB7IHVzZVJlZHVjZXIsIHVzZVJlZiwgdXNlTWVtbywgdXNlQ29udGV4dCwgdXNlRGVidWdWYWx1ZSB9IGZyb20gJ3JlYWN0JztcbmltcG9ydCB7IHVzZVJlZHV4Q29udGV4dCBhcyB1c2VEZWZhdWx0UmVkdXhDb250ZXh0IH0gZnJvbSAnLi91c2VSZWR1eENvbnRleHQnO1xuaW1wb3J0IHsgY3JlYXRlU3Vic2NyaXB0aW9uIH0gZnJvbSAnLi4vdXRpbHMvU3Vic2NyaXB0aW9uJztcbmltcG9ydCB7IHVzZUlzb21vcnBoaWNMYXlvdXRFZmZlY3QgfSBmcm9tICcuLi91dGlscy91c2VJc29tb3JwaGljTGF5b3V0RWZmZWN0JztcbmltcG9ydCB7IFJlYWN0UmVkdXhDb250ZXh0IH0gZnJvbSAnLi4vY29tcG9uZW50cy9Db250ZXh0JztcblxudmFyIHJlZkVxdWFsaXR5ID0gZnVuY3Rpb24gcmVmRXF1YWxpdHkoYSwgYikge1xuICByZXR1cm4gYSA9PT0gYjtcbn07XG5cbmZ1bmN0aW9uIHVzZVNlbGVjdG9yV2l0aFN0b3JlQW5kU3Vic2NyaXB0aW9uKHNlbGVjdG9yLCBlcXVhbGl0eUZuLCBzdG9yZSwgY29udGV4dFN1Yikge1xuICB2YXIgX3VzZVJlZHVjZXIgPSB1c2VSZWR1Y2VyKGZ1bmN0aW9uIChzKSB7XG4gICAgcmV0dXJuIHMgKyAxO1xuICB9LCAwKSxcbiAgICAgIGZvcmNlUmVuZGVyID0gX3VzZVJlZHVjZXJbMV07XG5cbiAgdmFyIHN1YnNjcmlwdGlvbiA9IHVzZU1lbW8oZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiBjcmVhdGVTdWJzY3JpcHRpb24oc3RvcmUsIGNvbnRleHRTdWIpO1xuICB9LCBbc3RvcmUsIGNvbnRleHRTdWJdKTtcbiAgdmFyIGxhdGVzdFN1YnNjcmlwdGlvbkNhbGxiYWNrRXJyb3IgPSB1c2VSZWYoKTtcbiAgdmFyIGxhdGVzdFNlbGVjdG9yID0gdXNlUmVmKCk7XG4gIHZhciBsYXRlc3RTdG9yZVN0YXRlID0gdXNlUmVmKCk7XG4gIHZhciBsYXRlc3RTZWxlY3RlZFN0YXRlID0gdXNlUmVmKCk7XG4gIHZhciBzdG9yZVN0YXRlID0gc3RvcmUuZ2V0U3RhdGUoKTtcbiAgdmFyIHNlbGVjdGVkU3RhdGU7XG5cbiAgdHJ5IHtcbiAgICBpZiAoc2VsZWN0b3IgIT09IGxhdGVzdFNlbGVjdG9yLmN1cnJlbnQgfHwgc3RvcmVTdGF0ZSAhPT0gbGF0ZXN0U3RvcmVTdGF0ZS5jdXJyZW50IHx8IGxhdGVzdFN1YnNjcmlwdGlvbkNhbGxiYWNrRXJyb3IuY3VycmVudCkge1xuICAgICAgdmFyIG5ld1NlbGVjdGVkU3RhdGUgPSBzZWxlY3RvcihzdG9yZVN0YXRlKTsgLy8gZW5zdXJlIGxhdGVzdCBzZWxlY3RlZCBzdGF0ZSBpcyByZXVzZWQgc28gdGhhdCBhIGN1c3RvbSBlcXVhbGl0eSBmdW5jdGlvbiBjYW4gcmVzdWx0IGluIGlkZW50aWNhbCByZWZlcmVuY2VzXG5cbiAgICAgIGlmIChsYXRlc3RTZWxlY3RlZFN0YXRlLmN1cnJlbnQgPT09IHVuZGVmaW5lZCB8fCAhZXF1YWxpdHlGbihuZXdTZWxlY3RlZFN0YXRlLCBsYXRlc3RTZWxlY3RlZFN0YXRlLmN1cnJlbnQpKSB7XG4gICAgICAgIHNlbGVjdGVkU3RhdGUgPSBuZXdTZWxlY3RlZFN0YXRlO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgc2VsZWN0ZWRTdGF0ZSA9IGxhdGVzdFNlbGVjdGVkU3RhdGUuY3VycmVudDtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgc2VsZWN0ZWRTdGF0ZSA9IGxhdGVzdFNlbGVjdGVkU3RhdGUuY3VycmVudDtcbiAgICB9XG4gIH0gY2F0Y2ggKGVycikge1xuICAgIGlmIChsYXRlc3RTdWJzY3JpcHRpb25DYWxsYmFja0Vycm9yLmN1cnJlbnQpIHtcbiAgICAgIGVyci5tZXNzYWdlICs9IFwiXFxuVGhlIGVycm9yIG1heSBiZSBjb3JyZWxhdGVkIHdpdGggdGhpcyBwcmV2aW91cyBlcnJvcjpcXG5cIiArIGxhdGVzdFN1YnNjcmlwdGlvbkNhbGxiYWNrRXJyb3IuY3VycmVudC5zdGFjayArIFwiXFxuXFxuXCI7XG4gICAgfVxuXG4gICAgdGhyb3cgZXJyO1xuICB9XG5cbiAgdXNlSXNvbW9ycGhpY0xheW91dEVmZmVjdChmdW5jdGlvbiAoKSB7XG4gICAgbGF0ZXN0U2VsZWN0b3IuY3VycmVudCA9IHNlbGVjdG9yO1xuICAgIGxhdGVzdFN0b3JlU3RhdGUuY3VycmVudCA9IHN0b3JlU3RhdGU7XG4gICAgbGF0ZXN0U2VsZWN0ZWRTdGF0ZS5jdXJyZW50ID0gc2VsZWN0ZWRTdGF0ZTtcbiAgICBsYXRlc3RTdWJzY3JpcHRpb25DYWxsYmFja0Vycm9yLmN1cnJlbnQgPSB1bmRlZmluZWQ7XG4gIH0pO1xuICB1c2VJc29tb3JwaGljTGF5b3V0RWZmZWN0KGZ1bmN0aW9uICgpIHtcbiAgICBmdW5jdGlvbiBjaGVja0ZvclVwZGF0ZXMoKSB7XG4gICAgICB0cnkge1xuICAgICAgICB2YXIgbmV3U3RvcmVTdGF0ZSA9IHN0b3JlLmdldFN0YXRlKCk7IC8vIEF2b2lkIGNhbGxpbmcgc2VsZWN0b3IgbXVsdGlwbGUgdGltZXMgaWYgdGhlIHN0b3JlJ3Mgc3RhdGUgaGFzIG5vdCBjaGFuZ2VkXG5cbiAgICAgICAgaWYgKG5ld1N0b3JlU3RhdGUgPT09IGxhdGVzdFN0b3JlU3RhdGUuY3VycmVudCkge1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBfbmV3U2VsZWN0ZWRTdGF0ZSA9IGxhdGVzdFNlbGVjdG9yLmN1cnJlbnQobmV3U3RvcmVTdGF0ZSk7XG5cbiAgICAgICAgaWYgKGVxdWFsaXR5Rm4oX25ld1NlbGVjdGVkU3RhdGUsIGxhdGVzdFNlbGVjdGVkU3RhdGUuY3VycmVudCkpIHtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBsYXRlc3RTZWxlY3RlZFN0YXRlLmN1cnJlbnQgPSBfbmV3U2VsZWN0ZWRTdGF0ZTtcbiAgICAgICAgbGF0ZXN0U3RvcmVTdGF0ZS5jdXJyZW50ID0gbmV3U3RvcmVTdGF0ZTtcbiAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICAvLyB3ZSBpZ25vcmUgYWxsIGVycm9ycyBoZXJlLCBzaW5jZSB3aGVuIHRoZSBjb21wb25lbnRcbiAgICAgICAgLy8gaXMgcmUtcmVuZGVyZWQsIHRoZSBzZWxlY3RvcnMgYXJlIGNhbGxlZCBhZ2FpbiwgYW5kXG4gICAgICAgIC8vIHdpbGwgdGhyb3cgYWdhaW4sIGlmIG5laXRoZXIgcHJvcHMgbm9yIHN0b3JlIHN0YXRlXG4gICAgICAgIC8vIGNoYW5nZWRcbiAgICAgICAgbGF0ZXN0U3Vic2NyaXB0aW9uQ2FsbGJhY2tFcnJvci5jdXJyZW50ID0gZXJyO1xuICAgICAgfVxuXG4gICAgICBmb3JjZVJlbmRlcigpO1xuICAgIH1cblxuICAgIHN1YnNjcmlwdGlvbi5vblN0YXRlQ2hhbmdlID0gY2hlY2tGb3JVcGRhdGVzO1xuICAgIHN1YnNjcmlwdGlvbi50cnlTdWJzY3JpYmUoKTtcbiAgICBjaGVja0ZvclVwZGF0ZXMoKTtcbiAgICByZXR1cm4gZnVuY3Rpb24gKCkge1xuICAgICAgcmV0dXJuIHN1YnNjcmlwdGlvbi50cnlVbnN1YnNjcmliZSgpO1xuICAgIH07XG4gIH0sIFtzdG9yZSwgc3Vic2NyaXB0aW9uXSk7XG4gIHJldHVybiBzZWxlY3RlZFN0YXRlO1xufVxuLyoqXHJcbiAqIEhvb2sgZmFjdG9yeSwgd2hpY2ggY3JlYXRlcyBhIGB1c2VTZWxlY3RvcmAgaG9vayBib3VuZCB0byBhIGdpdmVuIGNvbnRleHQuXHJcbiAqXHJcbiAqIEBwYXJhbSB7UmVhY3QuQ29udGV4dH0gW2NvbnRleHQ9UmVhY3RSZWR1eENvbnRleHRdIENvbnRleHQgcGFzc2VkIHRvIHlvdXIgYDxQcm92aWRlcj5gLlxyXG4gKiBAcmV0dXJucyB7RnVuY3Rpb259IEEgYHVzZVNlbGVjdG9yYCBob29rIGJvdW5kIHRvIHRoZSBzcGVjaWZpZWQgY29udGV4dC5cclxuICovXG5cblxuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZVNlbGVjdG9ySG9vayhjb250ZXh0KSB7XG4gIGlmIChjb250ZXh0ID09PSB2b2lkIDApIHtcbiAgICBjb250ZXh0ID0gUmVhY3RSZWR1eENvbnRleHQ7XG4gIH1cblxuICB2YXIgdXNlUmVkdXhDb250ZXh0ID0gY29udGV4dCA9PT0gUmVhY3RSZWR1eENvbnRleHQgPyB1c2VEZWZhdWx0UmVkdXhDb250ZXh0IDogZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiB1c2VDb250ZXh0KGNvbnRleHQpO1xuICB9O1xuICByZXR1cm4gZnVuY3Rpb24gdXNlU2VsZWN0b3Ioc2VsZWN0b3IsIGVxdWFsaXR5Rm4pIHtcbiAgICBpZiAoZXF1YWxpdHlGbiA9PT0gdm9pZCAwKSB7XG4gICAgICBlcXVhbGl0eUZuID0gcmVmRXF1YWxpdHk7XG4gICAgfVxuXG4gICAgaWYgKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicpIHtcbiAgICAgIGlmICghc2VsZWN0b3IpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiWW91IG11c3QgcGFzcyBhIHNlbGVjdG9yIHRvIHVzZVNlbGVjdG9yXCIpO1xuICAgICAgfVxuXG4gICAgICBpZiAodHlwZW9mIHNlbGVjdG9yICE9PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcIllvdSBtdXN0IHBhc3MgYSBmdW5jdGlvbiBhcyBhIHNlbGVjdG9yIHRvIHVzZVNlbGVjdG9yXCIpO1xuICAgICAgfVxuXG4gICAgICBpZiAodHlwZW9mIGVxdWFsaXR5Rm4gIT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiWW91IG11c3QgcGFzcyBhIGZ1bmN0aW9uIGFzIGFuIGVxdWFsaXR5IGZ1bmN0aW9uIHRvIHVzZVNlbGVjdG9yXCIpO1xuICAgICAgfVxuICAgIH1cblxuICAgIHZhciBfdXNlUmVkdXhDb250ZXh0ID0gdXNlUmVkdXhDb250ZXh0KCksXG4gICAgICAgIHN0b3JlID0gX3VzZVJlZHV4Q29udGV4dC5zdG9yZSxcbiAgICAgICAgY29udGV4dFN1YiA9IF91c2VSZWR1eENvbnRleHQuc3Vic2NyaXB0aW9uO1xuXG4gICAgdmFyIHNlbGVjdGVkU3RhdGUgPSB1c2VTZWxlY3RvcldpdGhTdG9yZUFuZFN1YnNjcmlwdGlvbihzZWxlY3RvciwgZXF1YWxpdHlGbiwgc3RvcmUsIGNvbnRleHRTdWIpO1xuICAgIHVzZURlYnVnVmFsdWUoc2VsZWN0ZWRTdGF0ZSk7XG4gICAgcmV0dXJuIHNlbGVjdGVkU3RhdGU7XG4gIH07XG59XG4vKipcclxuICogQSBob29rIHRvIGFjY2VzcyB0aGUgcmVkdXggc3RvcmUncyBzdGF0ZS4gVGhpcyBob29rIHRha2VzIGEgc2VsZWN0b3IgZnVuY3Rpb25cclxuICogYXMgYW4gYXJndW1lbnQuIFRoZSBzZWxlY3RvciBpcyBjYWxsZWQgd2l0aCB0aGUgc3RvcmUgc3RhdGUuXHJcbiAqXHJcbiAqIFRoaXMgaG9vayB0YWtlcyBhbiBvcHRpb25hbCBlcXVhbGl0eSBjb21wYXJpc29uIGZ1bmN0aW9uIGFzIHRoZSBzZWNvbmQgcGFyYW1ldGVyXHJcbiAqIHRoYXQgYWxsb3dzIHlvdSB0byBjdXN0b21pemUgdGhlIHdheSB0aGUgc2VsZWN0ZWQgc3RhdGUgaXMgY29tcGFyZWQgdG8gZGV0ZXJtaW5lXHJcbiAqIHdoZXRoZXIgdGhlIGNvbXBvbmVudCBuZWVkcyB0byBiZSByZS1yZW5kZXJlZC5cclxuICpcclxuICogQHBhcmFtIHtGdW5jdGlvbn0gc2VsZWN0b3IgdGhlIHNlbGVjdG9yIGZ1bmN0aW9uXHJcbiAqIEBwYXJhbSB7RnVuY3Rpb249fSBlcXVhbGl0eUZuIHRoZSBmdW5jdGlvbiB0aGF0IHdpbGwgYmUgdXNlZCB0byBkZXRlcm1pbmUgZXF1YWxpdHlcclxuICpcclxuICogQHJldHVybnMge2FueX0gdGhlIHNlbGVjdGVkIHN0YXRlXHJcbiAqXHJcbiAqIEBleGFtcGxlXHJcbiAqXHJcbiAqIGltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCdcclxuICogaW1wb3J0IHsgdXNlU2VsZWN0b3IgfSBmcm9tICdyZWFjdC1yZWR1eCdcclxuICpcclxuICogZXhwb3J0IGNvbnN0IENvdW50ZXJDb21wb25lbnQgPSAoKSA9PiB7XHJcbiAqICAgY29uc3QgY291bnRlciA9IHVzZVNlbGVjdG9yKHN0YXRlID0+IHN0YXRlLmNvdW50ZXIpXHJcbiAqICAgcmV0dXJuIDxkaXY+e2NvdW50ZXJ9PC9kaXY+XHJcbiAqIH1cclxuICovXG5cbmV4cG9ydCB2YXIgdXNlU2VsZWN0b3IgPSAvKiNfX1BVUkVfXyovY3JlYXRlU2VsZWN0b3JIb29rKCk7IiwgIi8qIGVzbGludC1kaXNhYmxlIGltcG9ydC9uby11bnJlc29sdmVkICovXG5leHBvcnQgeyB1bnN0YWJsZV9iYXRjaGVkVXBkYXRlcyB9IGZyb20gJ3JlYWN0LWRvbSc7IiwgImV4cG9ydCAqIGZyb20gJy4vZXhwb3J0cyc7XG5pbXBvcnQgeyB1bnN0YWJsZV9iYXRjaGVkVXBkYXRlcyBhcyBiYXRjaCB9IGZyb20gJy4vdXRpbHMvcmVhY3RCYXRjaGVkVXBkYXRlcyc7XG5pbXBvcnQgeyBzZXRCYXRjaCB9IGZyb20gJy4vdXRpbHMvYmF0Y2gnOyAvLyBFbmFibGUgYmF0Y2hlZCB1cGRhdGVzIGluIG91ciBzdWJzY3JpcHRpb25zIGZvciB1c2Vcbi8vIHdpdGggc3RhbmRhcmQgUmVhY3QgcmVuZGVyZXJzIChSZWFjdERPTSwgUmVhY3QgTmF0aXZlKVxuXG5zZXRCYXRjaChiYXRjaCk7XG5leHBvcnQgeyBiYXRjaCB9OyIsICJ2YXIgcmFuZG9tU3RyaW5nID0gZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiBNYXRoLnJhbmRvbSgpXG4gICAgICAgIC50b1N0cmluZygzNilcbiAgICAgICAgLnN1YnN0cmluZyg3KVxuICAgICAgICAuc3BsaXQoJycpXG4gICAgICAgIC5qb2luKCcuJyk7XG59O1xudmFyIEFjdGlvblR5cGVzID0ge1xuICAgIFNFVF9TVEFURTogXCJAQGljZXN0b3JlX1NFVF9TVEFURVwiICsgcmFuZG9tU3RyaW5nKCksXG59O1xuZXhwb3J0IGRlZmF1bHQgQWN0aW9uVHlwZXM7XG4iLCAiaW1wb3J0IHsgY3JlYXRlU2VsZWN0b3JIb29rLCBjcmVhdGVEaXNwYXRjaEhvb2sgfSBmcm9tICdyZWFjdC1yZWR1eCc7XG4vKipcbiAqIFJlZHV4IEhvb2tzIFBsdWdpblxuICpcbiAqIGdlbmVyYXRlcyByZWR1eCBob29rcyBmb3Igc3RvcmVcbiAqL1xuZXhwb3J0IGRlZmF1bHQgKGZ1bmN0aW9uIChfYSkge1xuICAgIHZhciBjb250ZXh0ID0gX2EuY29udGV4dDtcbiAgICB2YXIgdXNlU2VsZWN0b3IgPSBjcmVhdGVTZWxlY3Rvckhvb2soY29udGV4dCk7XG4gICAgdmFyIHVzZURpc3BhdGNoID0gY3JlYXRlRGlzcGF0Y2hIb29rKGNvbnRleHQpO1xuICAgIHJldHVybiB7XG4gICAgICAgIG9uU3RvcmVDcmVhdGVkOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIHVzZVNlbGVjdG9yOiB1c2VTZWxlY3RvcixcbiAgICAgICAgICAgICAgICB1c2VEaXNwYXRjaDogdXNlRGlzcGF0Y2gsXG4gICAgICAgICAgICB9O1xuICAgICAgICB9LFxuICAgIH07XG59KTtcbiIsICJ2YXIgX19hc3NpZ24gPSAodGhpcyAmJiB0aGlzLl9fYXNzaWduKSB8fCBmdW5jdGlvbiAoKSB7XG4gICAgX19hc3NpZ24gPSBPYmplY3QuYXNzaWduIHx8IGZ1bmN0aW9uKHQpIHtcbiAgICAgICAgZm9yICh2YXIgcywgaSA9IDEsIG4gPSBhcmd1bWVudHMubGVuZ3RoOyBpIDwgbjsgaSsrKSB7XG4gICAgICAgICAgICBzID0gYXJndW1lbnRzW2ldO1xuICAgICAgICAgICAgZm9yICh2YXIgcCBpbiBzKSBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKHMsIHApKVxuICAgICAgICAgICAgICAgIHRbcF0gPSBzW3BdO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0O1xuICAgIH07XG4gICAgcmV0dXJuIF9fYXNzaWduLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG59O1xuaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0Jztcbi8qKlxuICogTW9kZWxBcGlzIFBsdWdpblxuICpcbiAqIGdlbmVyYXRlcyBob29rcyBmb3Igc3RvcmVcbiAqL1xuZXhwb3J0IGRlZmF1bHQgKGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4ge1xuICAgICAgICBvblN0b3JlQ3JlYXRlZDogZnVuY3Rpb24gKHN0b3JlKSB7XG4gICAgICAgICAgICAvLyBob29rc1xuICAgICAgICAgICAgZnVuY3Rpb24gdXNlTW9kZWwobmFtZSkge1xuICAgICAgICAgICAgICAgIHZhciBzdGF0ZSA9IHVzZU1vZGVsU3RhdGUobmFtZSk7XG4gICAgICAgICAgICAgICAgdmFyIGRpc3BhdGNoZXJzID0gdXNlTW9kZWxEaXNwYXRjaGVycyhuYW1lKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gW3N0YXRlLCBkaXNwYXRjaGVyc107XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBmdW5jdGlvbiB1c2VNb2RlbFN0YXRlKG5hbWUpIHtcbiAgICAgICAgICAgICAgICB2YXIgc2VsZWN0b3IgPSBzdG9yZS51c2VTZWxlY3RvcihmdW5jdGlvbiAoc3RhdGUpIHsgcmV0dXJuIHN0YXRlW25hbWVdOyB9KTtcbiAgICAgICAgICAgICAgICBpZiAodHlwZW9mIHNlbGVjdG9yICE9PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBzZWxlY3RvcjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiTm90IGZvdW5kIG1vZGVsIGJ5IG5hbWVzcGFjZTogXCIgKyBuYW1lICsgXCIuXCIpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZnVuY3Rpb24gdXNlTW9kZWxEaXNwYXRjaGVycyhuYW1lKSB7XG4gICAgICAgICAgICAgICAgdmFyIGRpc3BhdGNoID0gc3RvcmUudXNlRGlzcGF0Y2goKTtcbiAgICAgICAgICAgICAgICBpZiAoZGlzcGF0Y2hbbmFtZV0pIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGRpc3BhdGNoW25hbWVdO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJOb3QgZm91bmQgbW9kZWwgYnkgbmFtZXNwYWNlOiBcIiArIG5hbWUgKyBcIi5cIik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBmdW5jdGlvbiB1c2VNb2RlbEVmZmVjdHNTdGF0ZShuYW1lKSB7XG4gICAgICAgICAgICAgICAgdmFyIGRpc3BhdGNoID0gdXNlTW9kZWxEaXNwYXRjaGVycyhuYW1lKTtcbiAgICAgICAgICAgICAgICB2YXIgZWZmZWN0c0xvYWRpbmcgPSB1c2VNb2RlbEVmZmVjdHNMb2FkaW5nKG5hbWUpO1xuICAgICAgICAgICAgICAgIHZhciBlZmZlY3RzRXJyb3IgPSB1c2VNb2RlbEVmZmVjdHNFcnJvcihuYW1lKTtcbiAgICAgICAgICAgICAgICB2YXIgc3RhdGVzID0ge307XG4gICAgICAgICAgICAgICAgT2JqZWN0LmtleXMoZGlzcGF0Y2gpLmZvckVhY2goZnVuY3Rpb24gKGtleSkge1xuICAgICAgICAgICAgICAgICAgICBzdGF0ZXNba2V5XSA9IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlzTG9hZGluZzogZWZmZWN0c0xvYWRpbmdba2V5XSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGVycm9yOiBlZmZlY3RzRXJyb3Jba2V5XSA/IGVmZmVjdHNFcnJvcltrZXldLmVycm9yIDogbnVsbCxcbiAgICAgICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICByZXR1cm4gc3RhdGVzO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZnVuY3Rpb24gdXNlTW9kZWxFZmZlY3RzRXJyb3IobmFtZSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBzdG9yZS51c2VTZWxlY3RvcihmdW5jdGlvbiAoc3RhdGUpIHsgcmV0dXJuIHN0YXRlLmVycm9yID8gc3RhdGUuZXJyb3IuZWZmZWN0c1tuYW1lXSA6IHVuZGVmaW5lZDsgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBmdW5jdGlvbiB1c2VNb2RlbEVmZmVjdHNMb2FkaW5nKG5hbWUpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gc3RvcmUudXNlU2VsZWN0b3IoZnVuY3Rpb24gKHN0YXRlKSB7IHJldHVybiBzdGF0ZS5sb2FkaW5nID8gc3RhdGUubG9hZGluZy5lZmZlY3RzW25hbWVdIDogdW5kZWZpbmVkOyB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vIG90aGVyIGFwaXNcbiAgICAgICAgICAgIGZ1bmN0aW9uIGdldE1vZGVsKG5hbWUpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gW2dldE1vZGVsU3RhdGUobmFtZSksIGdldE1vZGVsRGlzcGF0Y2hlcnMobmFtZSldO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZnVuY3Rpb24gZ2V0TW9kZWxTdGF0ZShuYW1lKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHN0b3JlLmdldFN0YXRlKClbbmFtZV07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBmdW5jdGlvbiBnZXRNb2RlbERpc3BhdGNoZXJzKG5hbWUpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gc3RvcmUuZGlzcGF0Y2hbbmFtZV07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvLyBjbGFzcyBjb21wb25lbnQgc3VwcG9ydFxuICAgICAgICAgICAgZnVuY3Rpb24gd2l0aE1vZGVsKG5hbWUsIG1hcE1vZGVsVG9Qcm9wcykge1xuICAgICAgICAgICAgICAgIG1hcE1vZGVsVG9Qcm9wcyA9IChtYXBNb2RlbFRvUHJvcHMgfHwgKGZ1bmN0aW9uIChtb2RlbCkge1xuICAgICAgICAgICAgICAgICAgICB2YXIgX2E7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAoX2EgPSB7fSwgX2FbbmFtZV0gPSBtb2RlbCwgX2EpO1xuICAgICAgICAgICAgICAgIH0pKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gZnVuY3Rpb24gKENvbXBvbmVudCkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZnVuY3Rpb24gKHByb3BzKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgdmFsdWUgPSB1c2VNb2RlbChuYW1lKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciB3aXRoUHJvcHMgPSBtYXBNb2RlbFRvUHJvcHModmFsdWUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIChSZWFjdC5jcmVhdGVFbGVtZW50KENvbXBvbmVudCwgX19hc3NpZ24oe30sIHdpdGhQcm9wcywgcHJvcHMpKSk7XG4gICAgICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGZ1bmN0aW9uIGNyZWF0ZVdpdGhNb2RlbERpc3BhdGNoZXJzKGZpZWxkU3VmZml4KSB7XG4gICAgICAgICAgICAgICAgaWYgKGZpZWxkU3VmZml4ID09PSB2b2lkIDApIHsgZmllbGRTdWZmaXggPSAnRGlzcGF0Y2hlcnMnOyB9XG4gICAgICAgICAgICAgICAgcmV0dXJuIGZ1bmN0aW9uIHdpdGhNb2RlbERpc3BhdGNoZXJzKG5hbWUsIG1hcE1vZGVsRGlzcGF0Y2hlcnNUb1Byb3BzKSB7XG4gICAgICAgICAgICAgICAgICAgIG1hcE1vZGVsRGlzcGF0Y2hlcnNUb1Byb3BzID0gKG1hcE1vZGVsRGlzcGF0Y2hlcnNUb1Byb3BzIHx8IChmdW5jdGlvbiAoZGlzcGF0Y2gpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBfYTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiAoX2EgPSB7fSwgX2FbXCJcIiArIG5hbWUgKyBmaWVsZFN1ZmZpeF0gPSBkaXNwYXRjaCwgX2EpO1xuICAgICAgICAgICAgICAgICAgICB9KSk7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBmdW5jdGlvbiAoQ29tcG9uZW50KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gZnVuY3Rpb24gKHByb3BzKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGRpc3BhdGNoZXJzID0gdXNlTW9kZWxEaXNwYXRjaGVycyhuYW1lKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgd2l0aFByb3BzID0gbWFwTW9kZWxEaXNwYXRjaGVyc1RvUHJvcHMoZGlzcGF0Y2hlcnMpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiAoUmVhY3QuY3JlYXRlRWxlbWVudChDb21wb25lbnQsIF9fYXNzaWduKHt9LCB3aXRoUHJvcHMsIHByb3BzKSkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdmFyIHdpdGhNb2RlbERpc3BhdGNoZXJzID0gY3JlYXRlV2l0aE1vZGVsRGlzcGF0Y2hlcnMoKTtcbiAgICAgICAgICAgIGZ1bmN0aW9uIGNyZWF0ZVdpdGhNb2RlbEVmZmVjdHNTdGF0ZShmaWVsZFN1ZmZpeCkge1xuICAgICAgICAgICAgICAgIGlmIChmaWVsZFN1ZmZpeCA9PT0gdm9pZCAwKSB7IGZpZWxkU3VmZml4ID0gJ0VmZmVjdHNTdGF0ZSc7IH1cbiAgICAgICAgICAgICAgICByZXR1cm4gZnVuY3Rpb24gKG5hbWUsIG1hcE1vZGVsRWZmZWN0c1N0YXRlVG9Qcm9wcykge1xuICAgICAgICAgICAgICAgICAgICBtYXBNb2RlbEVmZmVjdHNTdGF0ZVRvUHJvcHMgPSAobWFwTW9kZWxFZmZlY3RzU3RhdGVUb1Byb3BzIHx8IChmdW5jdGlvbiAoZWZmZWN0c1N0YXRlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgX2E7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gKF9hID0ge30sIF9hW1wiXCIgKyBuYW1lICsgZmllbGRTdWZmaXhdID0gZWZmZWN0c1N0YXRlLCBfYSk7XG4gICAgICAgICAgICAgICAgICAgIH0pKTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZ1bmN0aW9uIChDb21wb25lbnQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBmdW5jdGlvbiAocHJvcHMpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgdmFsdWUgPSB1c2VNb2RlbEVmZmVjdHNTdGF0ZShuYW1lKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgd2l0aFByb3BzID0gbWFwTW9kZWxFZmZlY3RzU3RhdGVUb1Byb3BzKHZhbHVlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gKFJlYWN0LmNyZWF0ZUVsZW1lbnQoQ29tcG9uZW50LCBfX2Fzc2lnbih7fSwgd2l0aFByb3BzLCBwcm9wcykpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHZhciB3aXRoTW9kZWxFZmZlY3RzU3RhdGUgPSBjcmVhdGVXaXRoTW9kZWxFZmZlY3RzU3RhdGUoKTtcbiAgICAgICAgICAgIGZ1bmN0aW9uIHdpdGhNb2RlbEVmZmVjdHNFcnJvcihuYW1lLCBtYXBNb2RlbEVmZmVjdHNFcnJvclRvUHJvcHMpIHtcbiAgICAgICAgICAgICAgICBtYXBNb2RlbEVmZmVjdHNFcnJvclRvUHJvcHMgPSAobWFwTW9kZWxFZmZlY3RzRXJyb3JUb1Byb3BzIHx8IChmdW5jdGlvbiAoZXJyb3JzKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBfYTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIChfYSA9IHt9LCBfYVtuYW1lICsgXCJFZmZlY3RzRXJyb3JcIl0gPSBlcnJvcnMsIF9hKTtcbiAgICAgICAgICAgICAgICB9KSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGZ1bmN0aW9uIChDb21wb25lbnQpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZ1bmN0aW9uIChwcm9wcykge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHZhbHVlID0gdXNlTW9kZWxFZmZlY3RzRXJyb3IobmFtZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgd2l0aFByb3BzID0gbWFwTW9kZWxFZmZlY3RzRXJyb3JUb1Byb3BzKHZhbHVlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiAoUmVhY3QuY3JlYXRlRWxlbWVudChDb21wb25lbnQsIF9fYXNzaWduKHt9LCB3aXRoUHJvcHMsIHByb3BzKSkpO1xuICAgICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBmdW5jdGlvbiB3aXRoTW9kZWxFZmZlY3RzTG9hZGluZyhuYW1lLCBtYXBNb2RlbEVmZmVjdHNMb2FkaW5nVG9Qcm9wcykge1xuICAgICAgICAgICAgICAgIG1hcE1vZGVsRWZmZWN0c0xvYWRpbmdUb1Byb3BzID0gKG1hcE1vZGVsRWZmZWN0c0xvYWRpbmdUb1Byb3BzIHx8IChmdW5jdGlvbiAobG9hZGluZ3MpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIF9hO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gKF9hID0ge30sIF9hW25hbWUgKyBcIkVmZmVjdHNMb2FkaW5nXCJdID0gbG9hZGluZ3MsIF9hKTtcbiAgICAgICAgICAgICAgICB9KSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGZ1bmN0aW9uIChDb21wb25lbnQpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZ1bmN0aW9uIChwcm9wcykge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHZhbHVlID0gdXNlTW9kZWxFZmZlY3RzTG9hZGluZyhuYW1lKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciB3aXRoUHJvcHMgPSBtYXBNb2RlbEVmZmVjdHNMb2FkaW5nVG9Qcm9wcyh2YWx1ZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gKFJlYWN0LmNyZWF0ZUVsZW1lbnQoQ29tcG9uZW50LCBfX2Fzc2lnbih7fSwgd2l0aFByb3BzLCBwcm9wcykpKTtcbiAgICAgICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZnVuY3Rpb24gZ2V0TW9kZWxBUElzKG5hbWUpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgICAgICB1c2VWYWx1ZTogZnVuY3Rpb24gKCkgeyByZXR1cm4gdXNlTW9kZWwobmFtZSk7IH0sXG4gICAgICAgICAgICAgICAgICAgIHVzZVN0YXRlOiBmdW5jdGlvbiAoKSB7IHJldHVybiB1c2VNb2RlbFN0YXRlKG5hbWUpOyB9LFxuICAgICAgICAgICAgICAgICAgICB1c2VEaXNwYXRjaGVyczogZnVuY3Rpb24gKCkgeyByZXR1cm4gdXNlTW9kZWxEaXNwYXRjaGVycyhuYW1lKTsgfSxcbiAgICAgICAgICAgICAgICAgICAgdXNlRWZmZWN0c1N0YXRlOiBmdW5jdGlvbiAoKSB7IHJldHVybiB1c2VNb2RlbEVmZmVjdHNTdGF0ZShuYW1lKTsgfSxcbiAgICAgICAgICAgICAgICAgICAgdXNlRWZmZWN0c0Vycm9yOiBmdW5jdGlvbiAoKSB7IHJldHVybiB1c2VNb2RlbEVmZmVjdHNFcnJvcihuYW1lKTsgfSxcbiAgICAgICAgICAgICAgICAgICAgdXNlRWZmZWN0c0xvYWRpbmc6IGZ1bmN0aW9uICgpIHsgcmV0dXJuIHVzZU1vZGVsRWZmZWN0c0xvYWRpbmcobmFtZSk7IH0sXG4gICAgICAgICAgICAgICAgICAgIGdldFZhbHVlOiBmdW5jdGlvbiAoKSB7IHJldHVybiBnZXRNb2RlbChuYW1lKTsgfSxcbiAgICAgICAgICAgICAgICAgICAgZ2V0U3RhdGU6IGZ1bmN0aW9uICgpIHsgcmV0dXJuIGdldE1vZGVsU3RhdGUobmFtZSk7IH0sXG4gICAgICAgICAgICAgICAgICAgIGdldERpc3BhdGNoZXJzOiBmdW5jdGlvbiAoKSB7IHJldHVybiBnZXRNb2RlbERpc3BhdGNoZXJzKG5hbWUpOyB9LFxuICAgICAgICAgICAgICAgICAgICB3aXRoVmFsdWU6IGZ1bmN0aW9uIChtYXBUb1Byb3BzKSB7IHJldHVybiB3aXRoTW9kZWwobmFtZSwgbWFwVG9Qcm9wcyk7IH0sXG4gICAgICAgICAgICAgICAgICAgIHdpdGhEaXNwYXRjaGVyczogZnVuY3Rpb24gKG1hcFRvUHJvcHMpIHsgcmV0dXJuIHdpdGhNb2RlbERpc3BhdGNoZXJzKG5hbWUsIG1hcFRvUHJvcHMpOyB9LFxuICAgICAgICAgICAgICAgICAgICB3aXRoRWZmZWN0c1N0YXRlOiBmdW5jdGlvbiAobWFwVG9Qcm9wcykgeyByZXR1cm4gd2l0aE1vZGVsRWZmZWN0c1N0YXRlKG5hbWUsIG1hcFRvUHJvcHMpOyB9LFxuICAgICAgICAgICAgICAgICAgICB3aXRoRWZmZWN0c0Vycm9yOiBmdW5jdGlvbiAobWFwVG9Qcm9wcykgeyByZXR1cm4gd2l0aE1vZGVsRWZmZWN0c0Vycm9yKG5hbWUsIG1hcFRvUHJvcHMpOyB9LFxuICAgICAgICAgICAgICAgICAgICB3aXRoRWZmZWN0c0xvYWRpbmc6IGZ1bmN0aW9uIChtYXBUb1Byb3BzKSB7IHJldHVybiB3aXRoTW9kZWxFZmZlY3RzTG9hZGluZyhuYW1lLCBtYXBUb1Byb3BzKTsgfSxcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICBnZXRNb2RlbEFQSXM6IGdldE1vZGVsQVBJcyxcbiAgICAgICAgICAgICAgICAvLyBIb29rc1xuICAgICAgICAgICAgICAgIHVzZU1vZGVsOiB1c2VNb2RlbCxcbiAgICAgICAgICAgICAgICB1c2VNb2RlbFN0YXRlOiB1c2VNb2RlbFN0YXRlLFxuICAgICAgICAgICAgICAgIHVzZU1vZGVsRGlzcGF0Y2hlcnM6IHVzZU1vZGVsRGlzcGF0Y2hlcnMsXG4gICAgICAgICAgICAgICAgdXNlTW9kZWxFZmZlY3RzU3RhdGU6IHVzZU1vZGVsRWZmZWN0c1N0YXRlLFxuICAgICAgICAgICAgICAgIHVzZU1vZGVsRWZmZWN0c0Vycm9yOiB1c2VNb2RlbEVmZmVjdHNFcnJvcixcbiAgICAgICAgICAgICAgICB1c2VNb2RlbEVmZmVjdHNMb2FkaW5nOiB1c2VNb2RlbEVmZmVjdHNMb2FkaW5nLFxuICAgICAgICAgICAgICAgIC8vIHJlYWwgdGltZVxuICAgICAgICAgICAgICAgIGdldE1vZGVsOiBnZXRNb2RlbCxcbiAgICAgICAgICAgICAgICBnZXRNb2RlbFN0YXRlOiBnZXRNb2RlbFN0YXRlLFxuICAgICAgICAgICAgICAgIGdldE1vZGVsRGlzcGF0Y2hlcnM6IGdldE1vZGVsRGlzcGF0Y2hlcnMsXG4gICAgICAgICAgICAgICAgLy8gQ2xhc3MgY29tcG9uZW50IHN1cHBvcnRcbiAgICAgICAgICAgICAgICB3aXRoTW9kZWw6IHdpdGhNb2RlbCxcbiAgICAgICAgICAgICAgICB3aXRoTW9kZWxEaXNwYXRjaGVyczogd2l0aE1vZGVsRGlzcGF0Y2hlcnMsXG4gICAgICAgICAgICAgICAgd2l0aE1vZGVsRWZmZWN0c1N0YXRlOiB3aXRoTW9kZWxFZmZlY3RzU3RhdGUsXG4gICAgICAgICAgICAgICAgd2l0aE1vZGVsRWZmZWN0c0Vycm9yOiB3aXRoTW9kZWxFZmZlY3RzRXJyb3IsXG4gICAgICAgICAgICAgICAgd2l0aE1vZGVsRWZmZWN0c0xvYWRpbmc6IHdpdGhNb2RlbEVmZmVjdHNMb2FkaW5nLFxuICAgICAgICAgICAgfTtcbiAgICAgICAgfSxcbiAgICB9O1xufSk7XG4iLCAiY29uc3QgZXJyb3JzID0ge1xuXHQwOiBcIklsbGVnYWwgc3RhdGVcIixcblx0MTogXCJJbW1lciBkcmFmdHMgY2Fubm90IGhhdmUgY29tcHV0ZWQgcHJvcGVydGllc1wiLFxuXHQyOiBcIlRoaXMgb2JqZWN0IGhhcyBiZWVuIGZyb3plbiBhbmQgc2hvdWxkIG5vdCBiZSBtdXRhdGVkXCIsXG5cdDMoZGF0YTogYW55KSB7XG5cdFx0cmV0dXJuIChcblx0XHRcdFwiQ2Fubm90IHVzZSBhIHByb3h5IHRoYXQgaGFzIGJlZW4gcmV2b2tlZC4gRGlkIHlvdSBwYXNzIGFuIG9iamVjdCBmcm9tIGluc2lkZSBhbiBpbW1lciBmdW5jdGlvbiB0byBhbiBhc3luYyBwcm9jZXNzPyBcIiArXG5cdFx0XHRkYXRhXG5cdFx0KVxuXHR9LFxuXHQ0OiBcIkFuIGltbWVyIHByb2R1Y2VyIHJldHVybmVkIGEgbmV3IHZhbHVlICphbmQqIG1vZGlmaWVkIGl0cyBkcmFmdC4gRWl0aGVyIHJldHVybiBhIG5ldyB2YWx1ZSAqb3IqIG1vZGlmeSB0aGUgZHJhZnQuXCIsXG5cdDU6IFwiSW1tZXIgZm9yYmlkcyBjaXJjdWxhciByZWZlcmVuY2VzXCIsXG5cdDY6IFwiVGhlIGZpcnN0IG9yIHNlY29uZCBhcmd1bWVudCB0byBgcHJvZHVjZWAgbXVzdCBiZSBhIGZ1bmN0aW9uXCIsXG5cdDc6IFwiVGhlIHRoaXJkIGFyZ3VtZW50IHRvIGBwcm9kdWNlYCBtdXN0IGJlIGEgZnVuY3Rpb24gb3IgdW5kZWZpbmVkXCIsXG5cdDg6IFwiRmlyc3QgYXJndW1lbnQgdG8gYGNyZWF0ZURyYWZ0YCBtdXN0IGJlIGEgcGxhaW4gb2JqZWN0LCBhbiBhcnJheSwgb3IgYW4gaW1tZXJhYmxlIG9iamVjdFwiLFxuXHQ5OiBcIkZpcnN0IGFyZ3VtZW50IHRvIGBmaW5pc2hEcmFmdGAgbXVzdCBiZSBhIGRyYWZ0IHJldHVybmVkIGJ5IGBjcmVhdGVEcmFmdGBcIixcblx0MTA6IFwiVGhlIGdpdmVuIGRyYWZ0IGlzIGFscmVhZHkgZmluYWxpemVkXCIsXG5cdDExOiBcIk9iamVjdC5kZWZpbmVQcm9wZXJ0eSgpIGNhbm5vdCBiZSB1c2VkIG9uIGFuIEltbWVyIGRyYWZ0XCIsXG5cdDEyOiBcIk9iamVjdC5zZXRQcm90b3R5cGVPZigpIGNhbm5vdCBiZSB1c2VkIG9uIGFuIEltbWVyIGRyYWZ0XCIsXG5cdDEzOiBcIkltbWVyIG9ubHkgc3VwcG9ydHMgZGVsZXRpbmcgYXJyYXkgaW5kaWNlc1wiLFxuXHQxNDogXCJJbW1lciBvbmx5IHN1cHBvcnRzIHNldHRpbmcgYXJyYXkgaW5kaWNlcyBhbmQgdGhlICdsZW5ndGgnIHByb3BlcnR5XCIsXG5cdDE1KHBhdGg6IHN0cmluZykge1xuXHRcdHJldHVybiBcIkNhbm5vdCBhcHBseSBwYXRjaCwgcGF0aCBkb2Vzbid0IHJlc29sdmU6IFwiICsgcGF0aFxuXHR9LFxuXHQxNjogJ1NldHMgY2Fubm90IGhhdmUgXCJyZXBsYWNlXCIgcGF0Y2hlcy4nLFxuXHQxNyhvcDogc3RyaW5nKSB7XG5cdFx0cmV0dXJuIFwiVW5zdXBwb3J0ZWQgcGF0Y2ggb3BlcmF0aW9uOiBcIiArIG9wXG5cdH0sXG5cdDE4KHBsdWdpbjogc3RyaW5nKSB7XG5cdFx0cmV0dXJuIGBUaGUgcGx1Z2luIGZvciAnJHtwbHVnaW59JyBoYXMgbm90IGJlZW4gbG9hZGVkIGludG8gSW1tZXIuIFRvIGVuYWJsZSB0aGUgcGx1Z2luLCBpbXBvcnQgYW5kIGNhbGwgXFxgZW5hYmxlJHtwbHVnaW59KClcXGAgd2hlbiBpbml0aWFsaXppbmcgeW91ciBhcHBsaWNhdGlvbi5gXG5cdH0sXG5cdDIwOiBcIkNhbm5vdCB1c2UgcHJveGllcyBpZiBQcm94eSwgUHJveHkucmV2b2NhYmxlIG9yIFJlZmxlY3QgYXJlIG5vdCBhdmFpbGFibGVcIixcblx0MjEodGhpbmc6IHN0cmluZykge1xuXHRcdHJldHVybiBgcHJvZHVjZSBjYW4gb25seSBiZSBjYWxsZWQgb24gdGhpbmdzIHRoYXQgYXJlIGRyYWZ0YWJsZTogcGxhaW4gb2JqZWN0cywgYXJyYXlzLCBNYXAsIFNldCBvciBjbGFzc2VzIHRoYXQgYXJlIG1hcmtlZCB3aXRoICdbaW1tZXJhYmxlXTogdHJ1ZScuIEdvdCAnJHt0aGluZ30nYFxuXHR9LFxuXHQyMih0aGluZzogc3RyaW5nKSB7XG5cdFx0cmV0dXJuIGAnY3VycmVudCcgZXhwZWN0cyBhIGRyYWZ0LCBnb3Q6ICR7dGhpbmd9YFxuXHR9LFxuXHQyMyh0aGluZzogc3RyaW5nKSB7XG5cdFx0cmV0dXJuIGAnb3JpZ2luYWwnIGV4cGVjdHMgYSBkcmFmdCwgZ290OiAke3RoaW5nfWBcblx0fSxcblx0MjQ6IFwiUGF0Y2hpbmcgcmVzZXJ2ZWQgYXR0cmlidXRlcyBsaWtlIF9fcHJvdG9fXywgcHJvdG90eXBlIGFuZCBjb25zdHJ1Y3RvciBpcyBub3QgYWxsb3dlZFwiXG59IGFzIGNvbnN0XG5cbmV4cG9ydCBmdW5jdGlvbiBkaWUoZXJyb3I6IGtleW9mIHR5cGVvZiBlcnJvcnMsIC4uLmFyZ3M6IGFueVtdKTogbmV2ZXIge1xuXHRpZiAoX19ERVZfXykge1xuXHRcdGNvbnN0IGUgPSBlcnJvcnNbZXJyb3JdXG5cdFx0Y29uc3QgbXNnID0gIWVcblx0XHRcdD8gXCJ1bmtub3duIGVycm9yIG5yOiBcIiArIGVycm9yXG5cdFx0XHQ6IHR5cGVvZiBlID09PSBcImZ1bmN0aW9uXCJcblx0XHRcdD8gZS5hcHBseShudWxsLCBhcmdzIGFzIGFueSlcblx0XHRcdDogZVxuXHRcdHRocm93IG5ldyBFcnJvcihgW0ltbWVyXSAke21zZ31gKVxuXHR9XG5cdHRocm93IG5ldyBFcnJvcihcblx0XHRgW0ltbWVyXSBtaW5pZmllZCBlcnJvciBucjogJHtlcnJvcn0ke1xuXHRcdFx0YXJncy5sZW5ndGggPyBcIiBcIiArIGFyZ3MubWFwKHMgPT4gYCcke3N9J2ApLmpvaW4oXCIsXCIpIDogXCJcIlxuXHRcdH0uIEZpbmQgdGhlIGZ1bGwgZXJyb3IgYXQ6IGh0dHBzOi8vYml0Lmx5LzNjWEVLV2ZgXG5cdClcbn1cbiIsICJpbXBvcnQge1xuXHREUkFGVF9TVEFURSxcblx0RFJBRlRBQkxFLFxuXHRoYXNTZXQsXG5cdE9iamVjdGlzaCxcblx0RHJhZnRlZCxcblx0QW55T2JqZWN0LFxuXHRBbnlNYXAsXG5cdEFueVNldCxcblx0SW1tZXJTdGF0ZSxcblx0aGFzTWFwLFxuXHRBcmNodHlwZSxcblx0ZGllXG59IGZyb20gXCIuLi9pbnRlcm5hbFwiXG5cbi8qKiBSZXR1cm5zIHRydWUgaWYgdGhlIGdpdmVuIHZhbHVlIGlzIGFuIEltbWVyIGRyYWZ0ICovXG4vKiNfX1BVUkVfXyovXG5leHBvcnQgZnVuY3Rpb24gaXNEcmFmdCh2YWx1ZTogYW55KTogYm9vbGVhbiB7XG5cdHJldHVybiAhIXZhbHVlICYmICEhdmFsdWVbRFJBRlRfU1RBVEVdXG59XG5cbi8qKiBSZXR1cm5zIHRydWUgaWYgdGhlIGdpdmVuIHZhbHVlIGNhbiBiZSBkcmFmdGVkIGJ5IEltbWVyICovXG4vKiNfX1BVUkVfXyovXG5leHBvcnQgZnVuY3Rpb24gaXNEcmFmdGFibGUodmFsdWU6IGFueSk6IGJvb2xlYW4ge1xuXHRpZiAoIXZhbHVlKSByZXR1cm4gZmFsc2Vcblx0cmV0dXJuIChcblx0XHRpc1BsYWluT2JqZWN0KHZhbHVlKSB8fFxuXHRcdEFycmF5LmlzQXJyYXkodmFsdWUpIHx8XG5cdFx0ISF2YWx1ZVtEUkFGVEFCTEVdIHx8XG5cdFx0ISF2YWx1ZS5jb25zdHJ1Y3Rvcj8uW0RSQUZUQUJMRV0gfHxcblx0XHRpc01hcCh2YWx1ZSkgfHxcblx0XHRpc1NldCh2YWx1ZSlcblx0KVxufVxuXG5jb25zdCBvYmplY3RDdG9yU3RyaW5nID0gT2JqZWN0LnByb3RvdHlwZS5jb25zdHJ1Y3Rvci50b1N0cmluZygpXG4vKiNfX1BVUkVfXyovXG5leHBvcnQgZnVuY3Rpb24gaXNQbGFpbk9iamVjdCh2YWx1ZTogYW55KTogYm9vbGVhbiB7XG5cdGlmICghdmFsdWUgfHwgdHlwZW9mIHZhbHVlICE9PSBcIm9iamVjdFwiKSByZXR1cm4gZmFsc2Vcblx0Y29uc3QgcHJvdG8gPSBPYmplY3QuZ2V0UHJvdG90eXBlT2YodmFsdWUpXG5cdGlmIChwcm90byA9PT0gbnVsbCkge1xuXHRcdHJldHVybiB0cnVlXG5cdH1cblx0Y29uc3QgQ3RvciA9XG5cdFx0T2JqZWN0Lmhhc093blByb3BlcnR5LmNhbGwocHJvdG8sIFwiY29uc3RydWN0b3JcIikgJiYgcHJvdG8uY29uc3RydWN0b3JcblxuXHRpZiAoQ3RvciA9PT0gT2JqZWN0KSByZXR1cm4gdHJ1ZVxuXG5cdHJldHVybiAoXG5cdFx0dHlwZW9mIEN0b3IgPT0gXCJmdW5jdGlvblwiICYmXG5cdFx0RnVuY3Rpb24udG9TdHJpbmcuY2FsbChDdG9yKSA9PT0gb2JqZWN0Q3RvclN0cmluZ1xuXHQpXG59XG5cbi8qKiBHZXQgdGhlIHVuZGVybHlpbmcgb2JqZWN0IHRoYXQgaXMgcmVwcmVzZW50ZWQgYnkgdGhlIGdpdmVuIGRyYWZ0ICovXG4vKiNfX1BVUkVfXyovXG5leHBvcnQgZnVuY3Rpb24gb3JpZ2luYWw8VD4odmFsdWU6IFQpOiBUIHwgdW5kZWZpbmVkXG5leHBvcnQgZnVuY3Rpb24gb3JpZ2luYWwodmFsdWU6IERyYWZ0ZWQ8YW55Pik6IGFueSB7XG5cdGlmICghaXNEcmFmdCh2YWx1ZSkpIGRpZSgyMywgdmFsdWUpXG5cdHJldHVybiB2YWx1ZVtEUkFGVF9TVEFURV0uYmFzZV9cbn1cblxuLyojX19QVVJFX18qL1xuZXhwb3J0IGNvbnN0IG93bktleXM6ICh0YXJnZXQ6IEFueU9iamVjdCkgPT4gUHJvcGVydHlLZXlbXSA9XG5cdHR5cGVvZiBSZWZsZWN0ICE9PSBcInVuZGVmaW5lZFwiICYmIFJlZmxlY3Qub3duS2V5c1xuXHRcdD8gUmVmbGVjdC5vd25LZXlzXG5cdFx0OiB0eXBlb2YgT2JqZWN0LmdldE93blByb3BlcnR5U3ltYm9scyAhPT0gXCJ1bmRlZmluZWRcIlxuXHRcdD8gb2JqID0+XG5cdFx0XHRcdE9iamVjdC5nZXRPd25Qcm9wZXJ0eU5hbWVzKG9iaikuY29uY2F0KFxuXHRcdFx0XHRcdE9iamVjdC5nZXRPd25Qcm9wZXJ0eVN5bWJvbHMob2JqKSBhcyBhbnlcblx0XHRcdFx0KVxuXHRcdDogLyogaXN0YW5idWwgaWdub3JlIG5leHQgKi8gT2JqZWN0LmdldE93blByb3BlcnR5TmFtZXNcblxuZXhwb3J0IGNvbnN0IGdldE93blByb3BlcnR5RGVzY3JpcHRvcnMgPVxuXHRPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9ycyB8fFxuXHRmdW5jdGlvbiBnZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3JzKHRhcmdldDogYW55KSB7XG5cdFx0Ly8gUG9seWZpbGwgbmVlZGVkIGZvciBIZXJtZXMgYW5kIElFLCBzZWUgaHR0cHM6Ly9naXRodWIuY29tL2ZhY2Vib29rL2hlcm1lcy9pc3N1ZXMvMjc0XG5cdFx0Y29uc3QgcmVzOiBhbnkgPSB7fVxuXHRcdG93bktleXModGFyZ2V0KS5mb3JFYWNoKGtleSA9PiB7XG5cdFx0XHRyZXNba2V5XSA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IodGFyZ2V0LCBrZXkpXG5cdFx0fSlcblx0XHRyZXR1cm4gcmVzXG5cdH1cblxuZXhwb3J0IGZ1bmN0aW9uIGVhY2g8VCBleHRlbmRzIE9iamVjdGlzaD4oXG5cdG9iajogVCxcblx0aXRlcjogKGtleTogc3RyaW5nIHwgbnVtYmVyLCB2YWx1ZTogYW55LCBzb3VyY2U6IFQpID0+IHZvaWQsXG5cdGVudW1lcmFibGVPbmx5PzogYm9vbGVhblxuKTogdm9pZFxuZXhwb3J0IGZ1bmN0aW9uIGVhY2gob2JqOiBhbnksIGl0ZXI6IGFueSwgZW51bWVyYWJsZU9ubHkgPSBmYWxzZSkge1xuXHRpZiAoZ2V0QXJjaHR5cGUob2JqKSA9PT0gQXJjaHR5cGUuT2JqZWN0KSB7XG5cdFx0OyhlbnVtZXJhYmxlT25seSA/IE9iamVjdC5rZXlzIDogb3duS2V5cykob2JqKS5mb3JFYWNoKGtleSA9PiB7XG5cdFx0XHRpZiAoIWVudW1lcmFibGVPbmx5IHx8IHR5cGVvZiBrZXkgIT09IFwic3ltYm9sXCIpIGl0ZXIoa2V5LCBvYmpba2V5XSwgb2JqKVxuXHRcdH0pXG5cdH0gZWxzZSB7XG5cdFx0b2JqLmZvckVhY2goKGVudHJ5OiBhbnksIGluZGV4OiBhbnkpID0+IGl0ZXIoaW5kZXgsIGVudHJ5LCBvYmopKVxuXHR9XG59XG5cbi8qI19fUFVSRV9fKi9cbmV4cG9ydCBmdW5jdGlvbiBnZXRBcmNodHlwZSh0aGluZzogYW55KTogQXJjaHR5cGUge1xuXHQvKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAqL1xuXHRjb25zdCBzdGF0ZTogdW5kZWZpbmVkIHwgSW1tZXJTdGF0ZSA9IHRoaW5nW0RSQUZUX1NUQVRFXVxuXHRyZXR1cm4gc3RhdGVcblx0XHQ/IHN0YXRlLnR5cGVfID4gM1xuXHRcdFx0PyBzdGF0ZS50eXBlXyAtIDQgLy8gY2F1c2UgT2JqZWN0IGFuZCBBcnJheSBtYXAgYmFjayBmcm9tIDQgYW5kIDVcblx0XHRcdDogKHN0YXRlLnR5cGVfIGFzIGFueSkgLy8gb3RoZXJzIGFyZSB0aGUgc2FtZVxuXHRcdDogQXJyYXkuaXNBcnJheSh0aGluZylcblx0XHQ/IEFyY2h0eXBlLkFycmF5XG5cdFx0OiBpc01hcCh0aGluZylcblx0XHQ/IEFyY2h0eXBlLk1hcFxuXHRcdDogaXNTZXQodGhpbmcpXG5cdFx0PyBBcmNodHlwZS5TZXRcblx0XHQ6IEFyY2h0eXBlLk9iamVjdFxufVxuXG4vKiNfX1BVUkVfXyovXG5leHBvcnQgZnVuY3Rpb24gaGFzKHRoaW5nOiBhbnksIHByb3A6IFByb3BlcnR5S2V5KTogYm9vbGVhbiB7XG5cdHJldHVybiBnZXRBcmNodHlwZSh0aGluZykgPT09IEFyY2h0eXBlLk1hcFxuXHRcdD8gdGhpbmcuaGFzKHByb3ApXG5cdFx0OiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwodGhpbmcsIHByb3ApXG59XG5cbi8qI19fUFVSRV9fKi9cbmV4cG9ydCBmdW5jdGlvbiBnZXQodGhpbmc6IEFueU1hcCB8IEFueU9iamVjdCwgcHJvcDogUHJvcGVydHlLZXkpOiBhbnkge1xuXHQvLyBAdHMtaWdub3JlXG5cdHJldHVybiBnZXRBcmNodHlwZSh0aGluZykgPT09IEFyY2h0eXBlLk1hcCA/IHRoaW5nLmdldChwcm9wKSA6IHRoaW5nW3Byb3BdXG59XG5cbi8qI19fUFVSRV9fKi9cbmV4cG9ydCBmdW5jdGlvbiBzZXQodGhpbmc6IGFueSwgcHJvcE9yT2xkVmFsdWU6IFByb3BlcnR5S2V5LCB2YWx1ZTogYW55KSB7XG5cdGNvbnN0IHQgPSBnZXRBcmNodHlwZSh0aGluZylcblx0aWYgKHQgPT09IEFyY2h0eXBlLk1hcCkgdGhpbmcuc2V0KHByb3BPck9sZFZhbHVlLCB2YWx1ZSlcblx0ZWxzZSBpZiAodCA9PT0gQXJjaHR5cGUuU2V0KSB7XG5cdFx0dGhpbmcuZGVsZXRlKHByb3BPck9sZFZhbHVlKVxuXHRcdHRoaW5nLmFkZCh2YWx1ZSlcblx0fSBlbHNlIHRoaW5nW3Byb3BPck9sZFZhbHVlXSA9IHZhbHVlXG59XG5cbi8qI19fUFVSRV9fKi9cbmV4cG9ydCBmdW5jdGlvbiBpcyh4OiBhbnksIHk6IGFueSk6IGJvb2xlYW4ge1xuXHQvLyBGcm9tOiBodHRwczovL2dpdGh1Yi5jb20vZmFjZWJvb2svZmJqcy9ibG9iL2M2OTkwNGE1MTFiOTAwMjY2OTM1MTY4MjIzMDYzZGQ4NzcyZGZjNDAvcGFja2FnZXMvZmJqcy9zcmMvY29yZS9zaGFsbG93RXF1YWwuanNcblx0aWYgKHggPT09IHkpIHtcblx0XHRyZXR1cm4geCAhPT0gMCB8fCAxIC8geCA9PT0gMSAvIHlcblx0fSBlbHNlIHtcblx0XHRyZXR1cm4geCAhPT0geCAmJiB5ICE9PSB5XG5cdH1cbn1cblxuLyojX19QVVJFX18qL1xuZXhwb3J0IGZ1bmN0aW9uIGlzTWFwKHRhcmdldDogYW55KTogdGFyZ2V0IGlzIEFueU1hcCB7XG5cdHJldHVybiBoYXNNYXAgJiYgdGFyZ2V0IGluc3RhbmNlb2YgTWFwXG59XG5cbi8qI19fUFVSRV9fKi9cbmV4cG9ydCBmdW5jdGlvbiBpc1NldCh0YXJnZXQ6IGFueSk6IHRhcmdldCBpcyBBbnlTZXQge1xuXHRyZXR1cm4gaGFzU2V0ICYmIHRhcmdldCBpbnN0YW5jZW9mIFNldFxufVxuLyojX19QVVJFX18qL1xuZXhwb3J0IGZ1bmN0aW9uIGxhdGVzdChzdGF0ZTogSW1tZXJTdGF0ZSk6IGFueSB7XG5cdHJldHVybiBzdGF0ZS5jb3B5XyB8fCBzdGF0ZS5iYXNlX1xufVxuXG4vKiNfX1BVUkVfXyovXG5leHBvcnQgZnVuY3Rpb24gc2hhbGxvd0NvcHkoYmFzZTogYW55KSB7XG5cdGlmIChBcnJheS5pc0FycmF5KGJhc2UpKSByZXR1cm4gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYmFzZSlcblx0Y29uc3QgZGVzY3JpcHRvcnMgPSBnZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3JzKGJhc2UpXG5cdGRlbGV0ZSBkZXNjcmlwdG9yc1tEUkFGVF9TVEFURSBhcyBhbnldXG5cdGxldCBrZXlzID0gb3duS2V5cyhkZXNjcmlwdG9ycylcblx0Zm9yIChsZXQgaSA9IDA7IGkgPCBrZXlzLmxlbmd0aDsgaSsrKSB7XG5cdFx0Y29uc3Qga2V5OiBhbnkgPSBrZXlzW2ldXG5cdFx0Y29uc3QgZGVzYyA9IGRlc2NyaXB0b3JzW2tleV1cblx0XHRpZiAoZGVzYy53cml0YWJsZSA9PT0gZmFsc2UpIHtcblx0XHRcdGRlc2Mud3JpdGFibGUgPSB0cnVlXG5cdFx0XHRkZXNjLmNvbmZpZ3VyYWJsZSA9IHRydWVcblx0XHR9XG5cdFx0Ly8gbGlrZSBvYmplY3QuYXNzaWduLCB3ZSB3aWxsIHJlYWQgYW55IF9vd25fLCBnZXQvc2V0IGFjY2Vzc29ycy4gVGhpcyBoZWxwcyBpbiBkZWFsaW5nXG5cdFx0Ly8gd2l0aCBsaWJyYXJpZXMgdGhhdCB0cmFwIHZhbHVlcywgbGlrZSBtb2J4IG9yIHZ1ZVxuXHRcdC8vIHVubGlrZSBvYmplY3QuYXNzaWduLCBub24tZW51bWVyYWJsZXMgd2lsbCBiZSBjb3BpZWQgYXMgd2VsbFxuXHRcdGlmIChkZXNjLmdldCB8fCBkZXNjLnNldClcblx0XHRcdGRlc2NyaXB0b3JzW2tleV0gPSB7XG5cdFx0XHRcdGNvbmZpZ3VyYWJsZTogdHJ1ZSxcblx0XHRcdFx0d3JpdGFibGU6IHRydWUsIC8vIGNvdWxkIGxpdmUgd2l0aCAhIWRlc2Muc2V0IGFzIHdlbGwgaGVyZS4uLlxuXHRcdFx0XHRlbnVtZXJhYmxlOiBkZXNjLmVudW1lcmFibGUsXG5cdFx0XHRcdHZhbHVlOiBiYXNlW2tleV1cblx0XHRcdH1cblx0fVxuXHRyZXR1cm4gT2JqZWN0LmNyZWF0ZShPYmplY3QuZ2V0UHJvdG90eXBlT2YoYmFzZSksIGRlc2NyaXB0b3JzKVxufVxuXG4vKipcbiAqIEZyZWV6ZXMgZHJhZnRhYmxlIG9iamVjdHMuIFJldHVybnMgdGhlIG9yaWdpbmFsIG9iamVjdC5cbiAqIEJ5IGRlZmF1bHQgZnJlZXplcyBzaGFsbG93bHksIGJ1dCBpZiB0aGUgc2Vjb25kIGFyZ3VtZW50IGlzIGB0cnVlYCBpdCB3aWxsIGZyZWV6ZSByZWN1cnNpdmVseS5cbiAqXG4gKiBAcGFyYW0gb2JqXG4gKiBAcGFyYW0gZGVlcFxuICovXG5leHBvcnQgZnVuY3Rpb24gZnJlZXplPFQ+KG9iajogVCwgZGVlcD86IGJvb2xlYW4pOiBUXG5leHBvcnQgZnVuY3Rpb24gZnJlZXplPFQ+KG9iajogYW55LCBkZWVwOiBib29sZWFuID0gZmFsc2UpOiBUIHtcblx0aWYgKGlzRnJvemVuKG9iaikgfHwgaXNEcmFmdChvYmopIHx8ICFpc0RyYWZ0YWJsZShvYmopKSByZXR1cm4gb2JqXG5cdGlmIChnZXRBcmNodHlwZShvYmopID4gMSAvKiBNYXAgb3IgU2V0ICovKSB7XG5cdFx0b2JqLnNldCA9IG9iai5hZGQgPSBvYmouY2xlYXIgPSBvYmouZGVsZXRlID0gZG9udE11dGF0ZUZyb3plbkNvbGxlY3Rpb25zIGFzIGFueVxuXHR9XG5cdE9iamVjdC5mcmVlemUob2JqKVxuXHRpZiAoZGVlcCkgZWFjaChvYmosIChrZXksIHZhbHVlKSA9PiBmcmVlemUodmFsdWUsIHRydWUpLCB0cnVlKVxuXHRyZXR1cm4gb2JqXG59XG5cbmZ1bmN0aW9uIGRvbnRNdXRhdGVGcm96ZW5Db2xsZWN0aW9ucygpIHtcblx0ZGllKDIpXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBpc0Zyb3plbihvYmo6IGFueSk6IGJvb2xlYW4ge1xuXHRpZiAob2JqID09IG51bGwgfHwgdHlwZW9mIG9iaiAhPT0gXCJvYmplY3RcIikgcmV0dXJuIHRydWVcblx0Ly8gU2VlICM2MDAsIElFIGRpZXMgb24gbm9uLW9iamVjdHMgaW4gT2JqZWN0LmlzRnJvemVuXG5cdHJldHVybiBPYmplY3QuaXNGcm96ZW4ob2JqKVxufVxuIiwgImltcG9ydCB7XG5cdEltbWVyU3RhdGUsXG5cdFBhdGNoLFxuXHRJbW1lclNjb3BlLFxuXHREcmFmdGVkLFxuXHRBbnlPYmplY3QsXG5cdEltbWVyQmFzZVN0YXRlLFxuXHRBbnlNYXAsXG5cdEFueVNldCxcblx0UHJveHlUeXBlLFxuXHRkaWVcbn0gZnJvbSBcIi4uL2ludGVybmFsXCJcblxuLyoqIFBsdWdpbiB1dGlsaXRpZXMgKi9cbmNvbnN0IHBsdWdpbnM6IHtcblx0UGF0Y2hlcz86IHtcblx0XHRnZW5lcmF0ZVBhdGNoZXNfKFxuXHRcdFx0c3RhdGU6IEltbWVyU3RhdGUsXG5cdFx0XHRiYXNlUGF0aDogUGF0Y2hQYXRoLFxuXHRcdFx0cGF0Y2hlczogUGF0Y2hbXSxcblx0XHRcdGludmVyc2VQYXRjaGVzOiBQYXRjaFtdXG5cdFx0KTogdm9pZFxuXHRcdGdlbmVyYXRlUmVwbGFjZW1lbnRQYXRjaGVzXyhcblx0XHRcdGJhc2U6IGFueSxcblx0XHRcdHJlcGxhY2VtZW50OiBhbnksXG5cdFx0XHRwYXRjaGVzOiBQYXRjaFtdLFxuXHRcdFx0aW52ZXJzZVBhdGNoZXM6IFBhdGNoW11cblx0XHQpOiB2b2lkXG5cdFx0YXBwbHlQYXRjaGVzXzxUPihkcmFmdDogVCwgcGF0Y2hlczogUGF0Y2hbXSk6IFRcblx0fVxuXHRFUzU/OiB7XG5cdFx0d2lsbEZpbmFsaXplRVM1XyhzY29wZTogSW1tZXJTY29wZSwgcmVzdWx0OiBhbnksIGlzUmVwbGFjZWQ6IGJvb2xlYW4pOiB2b2lkXG5cdFx0Y3JlYXRlRVM1UHJveHlfPFQ+KFxuXHRcdFx0YmFzZTogVCxcblx0XHRcdHBhcmVudD86IEltbWVyU3RhdGVcblx0XHQpOiBEcmFmdGVkPFQsIEVTNU9iamVjdFN0YXRlIHwgRVM1QXJyYXlTdGF0ZT5cblx0XHRoYXNDaGFuZ2VzXyhzdGF0ZTogRVM1QXJyYXlTdGF0ZSB8IEVTNU9iamVjdFN0YXRlKTogYm9vbGVhblxuXHR9XG5cdE1hcFNldD86IHtcblx0XHRwcm94eU1hcF88VCBleHRlbmRzIEFueU1hcD4odGFyZ2V0OiBULCBwYXJlbnQ/OiBJbW1lclN0YXRlKTogVFxuXHRcdHByb3h5U2V0XzxUIGV4dGVuZHMgQW55U2V0Pih0YXJnZXQ6IFQsIHBhcmVudD86IEltbWVyU3RhdGUpOiBUXG5cdH1cbn0gPSB7fVxuXG50eXBlIFBsdWdpbnMgPSB0eXBlb2YgcGx1Z2luc1xuXG5leHBvcnQgZnVuY3Rpb24gZ2V0UGx1Z2luPEsgZXh0ZW5kcyBrZXlvZiBQbHVnaW5zPihcblx0cGx1Z2luS2V5OiBLXG4pOiBFeGNsdWRlPFBsdWdpbnNbS10sIHVuZGVmaW5lZD4ge1xuXHRjb25zdCBwbHVnaW4gPSBwbHVnaW5zW3BsdWdpbktleV1cblx0aWYgKCFwbHVnaW4pIHtcblx0XHRkaWUoMTgsIHBsdWdpbktleSlcblx0fVxuXHQvLyBAdHMtaWdub3JlXG5cdHJldHVybiBwbHVnaW5cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGxvYWRQbHVnaW48SyBleHRlbmRzIGtleW9mIFBsdWdpbnM+KFxuXHRwbHVnaW5LZXk6IEssXG5cdGltcGxlbWVudGF0aW9uOiBQbHVnaW5zW0tdXG4pOiB2b2lkIHtcblx0aWYgKCFwbHVnaW5zW3BsdWdpbktleV0pIHBsdWdpbnNbcGx1Z2luS2V5XSA9IGltcGxlbWVudGF0aW9uXG59XG5cbi8qKiBFUzUgUGx1Z2luICovXG5cbmludGVyZmFjZSBFUzVCYXNlU3RhdGUgZXh0ZW5kcyBJbW1lckJhc2VTdGF0ZSB7XG5cdGFzc2lnbmVkXzoge1trZXk6IHN0cmluZ106IGFueX1cblx0cGFyZW50Xz86IEltbWVyU3RhdGVcblx0cmV2b2tlZF86IGJvb2xlYW5cbn1cblxuZXhwb3J0IGludGVyZmFjZSBFUzVPYmplY3RTdGF0ZSBleHRlbmRzIEVTNUJhc2VTdGF0ZSB7XG5cdHR5cGVfOiBQcm94eVR5cGUuRVM1T2JqZWN0XG5cdGRyYWZ0XzogRHJhZnRlZDxBbnlPYmplY3QsIEVTNU9iamVjdFN0YXRlPlxuXHRiYXNlXzogQW55T2JqZWN0XG5cdGNvcHlfOiBBbnlPYmplY3QgfCBudWxsXG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgRVM1QXJyYXlTdGF0ZSBleHRlbmRzIEVTNUJhc2VTdGF0ZSB7XG5cdHR5cGVfOiBQcm94eVR5cGUuRVM1QXJyYXlcblx0ZHJhZnRfOiBEcmFmdGVkPEFueU9iamVjdCwgRVM1QXJyYXlTdGF0ZT5cblx0YmFzZV86IGFueVxuXHRjb3B5XzogYW55XG59XG5cbi8qKiBNYXAgLyBTZXQgcGx1Z2luICovXG5cbmV4cG9ydCBpbnRlcmZhY2UgTWFwU3RhdGUgZXh0ZW5kcyBJbW1lckJhc2VTdGF0ZSB7XG5cdHR5cGVfOiBQcm94eVR5cGUuTWFwXG5cdGNvcHlfOiBBbnlNYXAgfCB1bmRlZmluZWRcblx0YXNzaWduZWRfOiBNYXA8YW55LCBib29sZWFuPiB8IHVuZGVmaW5lZFxuXHRiYXNlXzogQW55TWFwXG5cdHJldm9rZWRfOiBib29sZWFuXG5cdGRyYWZ0XzogRHJhZnRlZDxBbnlNYXAsIE1hcFN0YXRlPlxufVxuXG5leHBvcnQgaW50ZXJmYWNlIFNldFN0YXRlIGV4dGVuZHMgSW1tZXJCYXNlU3RhdGUge1xuXHR0eXBlXzogUHJveHlUeXBlLlNldFxuXHRjb3B5XzogQW55U2V0IHwgdW5kZWZpbmVkXG5cdGJhc2VfOiBBbnlTZXRcblx0ZHJhZnRzXzogTWFwPGFueSwgRHJhZnRlZD4gLy8gbWFwcyB0aGUgb3JpZ2luYWwgdmFsdWUgdG8gdGhlIGRyYWZ0IHZhbHVlIGluIHRoZSBuZXcgc2V0XG5cdHJldm9rZWRfOiBib29sZWFuXG5cdGRyYWZ0XzogRHJhZnRlZDxBbnlTZXQsIFNldFN0YXRlPlxufVxuXG4vKiogUGF0Y2hlcyBwbHVnaW4gKi9cblxuZXhwb3J0IHR5cGUgUGF0Y2hQYXRoID0gKHN0cmluZyB8IG51bWJlcilbXVxuIiwgImltcG9ydCB7XG5cdFBhdGNoLFxuXHRQYXRjaExpc3RlbmVyLFxuXHREcmFmdGVkLFxuXHRJbW1lcixcblx0RFJBRlRfU1RBVEUsXG5cdEltbWVyU3RhdGUsXG5cdFByb3h5VHlwZSxcblx0Z2V0UGx1Z2luXG59IGZyb20gXCIuLi9pbnRlcm5hbFwiXG5pbXBvcnQge2RpZX0gZnJvbSBcIi4uL3V0aWxzL2Vycm9yc1wiXG5cbi8qKiBFYWNoIHNjb3BlIHJlcHJlc2VudHMgYSBgcHJvZHVjZWAgY2FsbC4gKi9cblxuZXhwb3J0IGludGVyZmFjZSBJbW1lclNjb3BlIHtcblx0cGF0Y2hlc18/OiBQYXRjaFtdXG5cdGludmVyc2VQYXRjaGVzXz86IFBhdGNoW11cblx0Y2FuQXV0b0ZyZWV6ZV86IGJvb2xlYW5cblx0ZHJhZnRzXzogYW55W11cblx0cGFyZW50Xz86IEltbWVyU2NvcGVcblx0cGF0Y2hMaXN0ZW5lcl8/OiBQYXRjaExpc3RlbmVyXG5cdGltbWVyXzogSW1tZXJcblx0dW5maW5hbGl6ZWREcmFmdHNfOiBudW1iZXJcbn1cblxubGV0IGN1cnJlbnRTY29wZTogSW1tZXJTY29wZSB8IHVuZGVmaW5lZFxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0Q3VycmVudFNjb3BlKCkge1xuXHRpZiAoX19ERVZfXyAmJiAhY3VycmVudFNjb3BlKSBkaWUoMClcblx0cmV0dXJuIGN1cnJlbnRTY29wZSFcbn1cblxuZnVuY3Rpb24gY3JlYXRlU2NvcGUoXG5cdHBhcmVudF86IEltbWVyU2NvcGUgfCB1bmRlZmluZWQsXG5cdGltbWVyXzogSW1tZXJcbik6IEltbWVyU2NvcGUge1xuXHRyZXR1cm4ge1xuXHRcdGRyYWZ0c186IFtdLFxuXHRcdHBhcmVudF8sXG5cdFx0aW1tZXJfLFxuXHRcdC8vIFdoZW5ldmVyIHRoZSBtb2RpZmllZCBkcmFmdCBjb250YWlucyBhIGRyYWZ0IGZyb20gYW5vdGhlciBzY29wZSwgd2Vcblx0XHQvLyBuZWVkIHRvIHByZXZlbnQgYXV0by1mcmVlemluZyBzbyB0aGUgdW5vd25lZCBkcmFmdCBjYW4gYmUgZmluYWxpemVkLlxuXHRcdGNhbkF1dG9GcmVlemVfOiB0cnVlLFxuXHRcdHVuZmluYWxpemVkRHJhZnRzXzogMFxuXHR9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiB1c2VQYXRjaGVzSW5TY29wZShcblx0c2NvcGU6IEltbWVyU2NvcGUsXG5cdHBhdGNoTGlzdGVuZXI/OiBQYXRjaExpc3RlbmVyXG4pIHtcblx0aWYgKHBhdGNoTGlzdGVuZXIpIHtcblx0XHRnZXRQbHVnaW4oXCJQYXRjaGVzXCIpIC8vIGFzc2VydCB3ZSBoYXZlIHRoZSBwbHVnaW5cblx0XHRzY29wZS5wYXRjaGVzXyA9IFtdXG5cdFx0c2NvcGUuaW52ZXJzZVBhdGNoZXNfID0gW11cblx0XHRzY29wZS5wYXRjaExpc3RlbmVyXyA9IHBhdGNoTGlzdGVuZXJcblx0fVxufVxuXG5leHBvcnQgZnVuY3Rpb24gcmV2b2tlU2NvcGUoc2NvcGU6IEltbWVyU2NvcGUpIHtcblx0bGVhdmVTY29wZShzY29wZSlcblx0c2NvcGUuZHJhZnRzXy5mb3JFYWNoKHJldm9rZURyYWZ0KVxuXHQvLyBAdHMtaWdub3JlXG5cdHNjb3BlLmRyYWZ0c18gPSBudWxsXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBsZWF2ZVNjb3BlKHNjb3BlOiBJbW1lclNjb3BlKSB7XG5cdGlmIChzY29wZSA9PT0gY3VycmVudFNjb3BlKSB7XG5cdFx0Y3VycmVudFNjb3BlID0gc2NvcGUucGFyZW50X1xuXHR9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBlbnRlclNjb3BlKGltbWVyOiBJbW1lcikge1xuXHRyZXR1cm4gKGN1cnJlbnRTY29wZSA9IGNyZWF0ZVNjb3BlKGN1cnJlbnRTY29wZSwgaW1tZXIpKVxufVxuXG5mdW5jdGlvbiByZXZva2VEcmFmdChkcmFmdDogRHJhZnRlZCkge1xuXHRjb25zdCBzdGF0ZTogSW1tZXJTdGF0ZSA9IGRyYWZ0W0RSQUZUX1NUQVRFXVxuXHRpZiAoXG5cdFx0c3RhdGUudHlwZV8gPT09IFByb3h5VHlwZS5Qcm94eU9iamVjdCB8fFxuXHRcdHN0YXRlLnR5cGVfID09PSBQcm94eVR5cGUuUHJveHlBcnJheVxuXHQpXG5cdFx0c3RhdGUucmV2b2tlXygpXG5cdGVsc2Ugc3RhdGUucmV2b2tlZF8gPSB0cnVlXG59XG4iLCAiaW1wb3J0IHtcblx0SW1tZXJTY29wZSxcblx0RFJBRlRfU1RBVEUsXG5cdGlzRHJhZnRhYmxlLFxuXHROT1RISU5HLFxuXHRQYXRjaFBhdGgsXG5cdGVhY2gsXG5cdGhhcyxcblx0ZnJlZXplLFxuXHRJbW1lclN0YXRlLFxuXHRpc0RyYWZ0LFxuXHRTZXRTdGF0ZSxcblx0c2V0LFxuXHRQcm94eVR5cGUsXG5cdGdldFBsdWdpbixcblx0ZGllLFxuXHRyZXZva2VTY29wZSxcblx0aXNGcm96ZW4sXG5cdHNoYWxsb3dDb3B5XG59IGZyb20gXCIuLi9pbnRlcm5hbFwiXG5cbmV4cG9ydCBmdW5jdGlvbiBwcm9jZXNzUmVzdWx0KHJlc3VsdDogYW55LCBzY29wZTogSW1tZXJTY29wZSkge1xuXHRzY29wZS51bmZpbmFsaXplZERyYWZ0c18gPSBzY29wZS5kcmFmdHNfLmxlbmd0aFxuXHRjb25zdCBiYXNlRHJhZnQgPSBzY29wZS5kcmFmdHNfIVswXVxuXHRjb25zdCBpc1JlcGxhY2VkID0gcmVzdWx0ICE9PSB1bmRlZmluZWQgJiYgcmVzdWx0ICE9PSBiYXNlRHJhZnRcblx0aWYgKCFzY29wZS5pbW1lcl8udXNlUHJveGllc18pXG5cdFx0Z2V0UGx1Z2luKFwiRVM1XCIpLndpbGxGaW5hbGl6ZUVTNV8oc2NvcGUsIHJlc3VsdCwgaXNSZXBsYWNlZClcblx0aWYgKGlzUmVwbGFjZWQpIHtcblx0XHRpZiAoYmFzZURyYWZ0W0RSQUZUX1NUQVRFXS5tb2RpZmllZF8pIHtcblx0XHRcdHJldm9rZVNjb3BlKHNjb3BlKVxuXHRcdFx0ZGllKDQpXG5cdFx0fVxuXHRcdGlmIChpc0RyYWZ0YWJsZShyZXN1bHQpKSB7XG5cdFx0XHQvLyBGaW5hbGl6ZSB0aGUgcmVzdWx0IGluIGNhc2UgaXQgY29udGFpbnMgKG9yIGlzKSBhIHN1YnNldCBvZiB0aGUgZHJhZnQuXG5cdFx0XHRyZXN1bHQgPSBmaW5hbGl6ZShzY29wZSwgcmVzdWx0KVxuXHRcdFx0aWYgKCFzY29wZS5wYXJlbnRfKSBtYXliZUZyZWV6ZShzY29wZSwgcmVzdWx0KVxuXHRcdH1cblx0XHRpZiAoc2NvcGUucGF0Y2hlc18pIHtcblx0XHRcdGdldFBsdWdpbihcIlBhdGNoZXNcIikuZ2VuZXJhdGVSZXBsYWNlbWVudFBhdGNoZXNfKFxuXHRcdFx0XHRiYXNlRHJhZnRbRFJBRlRfU1RBVEVdLmJhc2VfLFxuXHRcdFx0XHRyZXN1bHQsXG5cdFx0XHRcdHNjb3BlLnBhdGNoZXNfLFxuXHRcdFx0XHRzY29wZS5pbnZlcnNlUGF0Y2hlc18hXG5cdFx0XHQpXG5cdFx0fVxuXHR9IGVsc2Uge1xuXHRcdC8vIEZpbmFsaXplIHRoZSBiYXNlIGRyYWZ0LlxuXHRcdHJlc3VsdCA9IGZpbmFsaXplKHNjb3BlLCBiYXNlRHJhZnQsIFtdKVxuXHR9XG5cdHJldm9rZVNjb3BlKHNjb3BlKVxuXHRpZiAoc2NvcGUucGF0Y2hlc18pIHtcblx0XHRzY29wZS5wYXRjaExpc3RlbmVyXyEoc2NvcGUucGF0Y2hlc18sIHNjb3BlLmludmVyc2VQYXRjaGVzXyEpXG5cdH1cblx0cmV0dXJuIHJlc3VsdCAhPT0gTk9USElORyA/IHJlc3VsdCA6IHVuZGVmaW5lZFxufVxuXG5mdW5jdGlvbiBmaW5hbGl6ZShyb290U2NvcGU6IEltbWVyU2NvcGUsIHZhbHVlOiBhbnksIHBhdGg/OiBQYXRjaFBhdGgpIHtcblx0Ly8gRG9uJ3QgcmVjdXJzZSBpbiB0aG8gcmVjdXJzaXZlIGRhdGEgc3RydWN0dXJlc1xuXHRpZiAoaXNGcm96ZW4odmFsdWUpKSByZXR1cm4gdmFsdWVcblxuXHRjb25zdCBzdGF0ZTogSW1tZXJTdGF0ZSA9IHZhbHVlW0RSQUZUX1NUQVRFXVxuXHQvLyBBIHBsYWluIG9iamVjdCwgbWlnaHQgbmVlZCBmcmVlemluZywgbWlnaHQgY29udGFpbiBkcmFmdHNcblx0aWYgKCFzdGF0ZSkge1xuXHRcdGVhY2goXG5cdFx0XHR2YWx1ZSxcblx0XHRcdChrZXksIGNoaWxkVmFsdWUpID0+XG5cdFx0XHRcdGZpbmFsaXplUHJvcGVydHkocm9vdFNjb3BlLCBzdGF0ZSwgdmFsdWUsIGtleSwgY2hpbGRWYWx1ZSwgcGF0aCksXG5cdFx0XHR0cnVlIC8vIFNlZSAjNTkwLCBkb24ndCByZWN1cnNlIGludG8gbm9uLWVudW1lcmFibGUgb2Ygbm9uIGRyYWZ0ZWQgb2JqZWN0c1xuXHRcdClcblx0XHRyZXR1cm4gdmFsdWVcblx0fVxuXHQvLyBOZXZlciBmaW5hbGl6ZSBkcmFmdHMgb3duZWQgYnkgYW5vdGhlciBzY29wZS5cblx0aWYgKHN0YXRlLnNjb3BlXyAhPT0gcm9vdFNjb3BlKSByZXR1cm4gdmFsdWVcblx0Ly8gVW5tb2RpZmllZCBkcmFmdCwgcmV0dXJuIHRoZSAoZnJvemVuKSBvcmlnaW5hbFxuXHRpZiAoIXN0YXRlLm1vZGlmaWVkXykge1xuXHRcdG1heWJlRnJlZXplKHJvb3RTY29wZSwgc3RhdGUuYmFzZV8sIHRydWUpXG5cdFx0cmV0dXJuIHN0YXRlLmJhc2VfXG5cdH1cblx0Ly8gTm90IGZpbmFsaXplZCB5ZXQsIGxldCdzIGRvIHRoYXQgbm93XG5cdGlmICghc3RhdGUuZmluYWxpemVkXykge1xuXHRcdHN0YXRlLmZpbmFsaXplZF8gPSB0cnVlXG5cdFx0c3RhdGUuc2NvcGVfLnVuZmluYWxpemVkRHJhZnRzXy0tXG5cdFx0Y29uc3QgcmVzdWx0ID1cblx0XHRcdC8vIEZvciBFUzUsIGNyZWF0ZSBhIGdvb2QgY29weSBmcm9tIHRoZSBkcmFmdCBmaXJzdCwgd2l0aCBhZGRlZCBrZXlzIGFuZCB3aXRob3V0IGRlbGV0ZWQga2V5cy5cblx0XHRcdHN0YXRlLnR5cGVfID09PSBQcm94eVR5cGUuRVM1T2JqZWN0IHx8IHN0YXRlLnR5cGVfID09PSBQcm94eVR5cGUuRVM1QXJyYXlcblx0XHRcdFx0PyAoc3RhdGUuY29weV8gPSBzaGFsbG93Q29weShzdGF0ZS5kcmFmdF8pKVxuXHRcdFx0XHQ6IHN0YXRlLmNvcHlfXG5cdFx0Ly8gRmluYWxpemUgYWxsIGNoaWxkcmVuIG9mIHRoZSBjb3B5XG5cdFx0Ly8gRm9yIHNldHMgd2UgY2xvbmUgYmVmb3JlIGl0ZXJhdGluZywgb3RoZXJ3aXNlIHdlIGNhbiBnZXQgaW4gZW5kbGVzcyBsb29wIGR1ZSB0byBtb2RpZnlpbmcgZHVyaW5nIGl0ZXJhdGlvbiwgc2VlICM2Mjhcblx0XHQvLyBBbHRob3VnaCB0aGUgb3JpZ2luYWwgdGVzdCBjYXNlIGRvZXNuJ3Qgc2VlbSB2YWxpZCBhbnl3YXksIHNvIGlmIHRoaXMgaW4gdGhlIHdheSB3ZSBjYW4gdHVybiB0aGUgbmV4dCBsaW5lXG5cdFx0Ly8gYmFjayB0byBlYWNoKHJlc3VsdCwgLi4uLilcblx0XHRlYWNoKFxuXHRcdFx0c3RhdGUudHlwZV8gPT09IFByb3h5VHlwZS5TZXQgPyBuZXcgU2V0KHJlc3VsdCkgOiByZXN1bHQsXG5cdFx0XHQoa2V5LCBjaGlsZFZhbHVlKSA9PlxuXHRcdFx0XHRmaW5hbGl6ZVByb3BlcnR5KHJvb3RTY29wZSwgc3RhdGUsIHJlc3VsdCwga2V5LCBjaGlsZFZhbHVlLCBwYXRoKVxuXHRcdClcblx0XHQvLyBldmVyeXRoaW5nIGluc2lkZSBpcyBmcm96ZW4sIHdlIGNhbiBmcmVlemUgaGVyZVxuXHRcdG1heWJlRnJlZXplKHJvb3RTY29wZSwgcmVzdWx0LCBmYWxzZSlcblx0XHQvLyBmaXJzdCB0aW1lIGZpbmFsaXppbmcsIGxldCdzIGNyZWF0ZSB0aG9zZSBwYXRjaGVzXG5cdFx0aWYgKHBhdGggJiYgcm9vdFNjb3BlLnBhdGNoZXNfKSB7XG5cdFx0XHRnZXRQbHVnaW4oXCJQYXRjaGVzXCIpLmdlbmVyYXRlUGF0Y2hlc18oXG5cdFx0XHRcdHN0YXRlLFxuXHRcdFx0XHRwYXRoLFxuXHRcdFx0XHRyb290U2NvcGUucGF0Y2hlc18sXG5cdFx0XHRcdHJvb3RTY29wZS5pbnZlcnNlUGF0Y2hlc18hXG5cdFx0XHQpXG5cdFx0fVxuXHR9XG5cdHJldHVybiBzdGF0ZS5jb3B5X1xufVxuXG5mdW5jdGlvbiBmaW5hbGl6ZVByb3BlcnR5KFxuXHRyb290U2NvcGU6IEltbWVyU2NvcGUsXG5cdHBhcmVudFN0YXRlOiB1bmRlZmluZWQgfCBJbW1lclN0YXRlLFxuXHR0YXJnZXRPYmplY3Q6IGFueSxcblx0cHJvcDogc3RyaW5nIHwgbnVtYmVyLFxuXHRjaGlsZFZhbHVlOiBhbnksXG5cdHJvb3RQYXRoPzogUGF0Y2hQYXRoXG4pIHtcblx0aWYgKF9fREVWX18gJiYgY2hpbGRWYWx1ZSA9PT0gdGFyZ2V0T2JqZWN0KSBkaWUoNSlcblx0aWYgKGlzRHJhZnQoY2hpbGRWYWx1ZSkpIHtcblx0XHRjb25zdCBwYXRoID1cblx0XHRcdHJvb3RQYXRoICYmXG5cdFx0XHRwYXJlbnRTdGF0ZSAmJlxuXHRcdFx0cGFyZW50U3RhdGUhLnR5cGVfICE9PSBQcm94eVR5cGUuU2V0ICYmIC8vIFNldCBvYmplY3RzIGFyZSBhdG9taWMgc2luY2UgdGhleSBoYXZlIG5vIGtleXMuXG5cdFx0XHQhaGFzKChwYXJlbnRTdGF0ZSBhcyBFeGNsdWRlPEltbWVyU3RhdGUsIFNldFN0YXRlPikuYXNzaWduZWRfISwgcHJvcCkgLy8gU2tpcCBkZWVwIHBhdGNoZXMgZm9yIGFzc2lnbmVkIGtleXMuXG5cdFx0XHRcdD8gcm9vdFBhdGghLmNvbmNhdChwcm9wKVxuXHRcdFx0XHQ6IHVuZGVmaW5lZFxuXHRcdC8vIERyYWZ0cyBvd25lZCBieSBgc2NvcGVgIGFyZSBmaW5hbGl6ZWQgaGVyZS5cblx0XHRjb25zdCByZXMgPSBmaW5hbGl6ZShyb290U2NvcGUsIGNoaWxkVmFsdWUsIHBhdGgpXG5cdFx0c2V0KHRhcmdldE9iamVjdCwgcHJvcCwgcmVzKVxuXHRcdC8vIERyYWZ0cyBmcm9tIGFub3RoZXIgc2NvcGUgbXVzdCBwcmV2ZW50ZWQgdG8gYmUgZnJvemVuXG5cdFx0Ly8gaWYgd2UgZ290IGEgZHJhZnQgYmFjayBmcm9tIGZpbmFsaXplLCB3ZSdyZSBpbiBhIG5lc3RlZCBwcm9kdWNlIGFuZCBzaG91bGRuJ3QgZnJlZXplXG5cdFx0aWYgKGlzRHJhZnQocmVzKSkge1xuXHRcdFx0cm9vdFNjb3BlLmNhbkF1dG9GcmVlemVfID0gZmFsc2Vcblx0XHR9IGVsc2UgcmV0dXJuXG5cdH1cblx0Ly8gU2VhcmNoIG5ldyBvYmplY3RzIGZvciB1bmZpbmFsaXplZCBkcmFmdHMuIEZyb3plbiBvYmplY3RzIHNob3VsZCBuZXZlciBjb250YWluIGRyYWZ0cy5cblx0aWYgKGlzRHJhZnRhYmxlKGNoaWxkVmFsdWUpICYmICFpc0Zyb3plbihjaGlsZFZhbHVlKSkge1xuXHRcdGlmICghcm9vdFNjb3BlLmltbWVyXy5hdXRvRnJlZXplXyAmJiByb290U2NvcGUudW5maW5hbGl6ZWREcmFmdHNfIDwgMSkge1xuXHRcdFx0Ly8gb3B0aW1pemF0aW9uOiBpZiBhbiBvYmplY3QgaXMgbm90IGEgZHJhZnQsIGFuZCB3ZSBkb24ndCBoYXZlIHRvXG5cdFx0XHQvLyBkZWVwZnJlZXplIGV2ZXJ5dGhpbmcsIGFuZCB3ZSBhcmUgc3VyZSB0aGF0IG5vIGRyYWZ0cyBhcmUgbGVmdCBpbiB0aGUgcmVtYWluaW5nIG9iamVjdFxuXHRcdFx0Ly8gY2F1c2Ugd2Ugc2F3IGFuZCBmaW5hbGl6ZWQgYWxsIGRyYWZ0cyBhbHJlYWR5OyB3ZSBjYW4gc3RvcCB2aXNpdGluZyB0aGUgcmVzdCBvZiB0aGUgdHJlZS5cblx0XHRcdC8vIFRoaXMgYmVuZWZpdHMgZXNwZWNpYWxseSBhZGRpbmcgbGFyZ2UgZGF0YSB0cmVlJ3Mgd2l0aG91dCBmdXJ0aGVyIHByb2Nlc3NpbmcuXG5cdFx0XHQvLyBTZWUgYWRkLWRhdGEuanMgcGVyZiB0ZXN0XG5cdFx0XHRyZXR1cm5cblx0XHR9XG5cdFx0ZmluYWxpemUocm9vdFNjb3BlLCBjaGlsZFZhbHVlKVxuXHRcdC8vIGltbWVyIGRlZXAgZnJlZXplcyBwbGFpbiBvYmplY3RzLCBzbyBpZiB0aGVyZSBpcyBubyBwYXJlbnQgc3RhdGUsIHdlIGZyZWV6ZSBhcyB3ZWxsXG5cdFx0aWYgKCFwYXJlbnRTdGF0ZSB8fCAhcGFyZW50U3RhdGUuc2NvcGVfLnBhcmVudF8pXG5cdFx0XHRtYXliZUZyZWV6ZShyb290U2NvcGUsIGNoaWxkVmFsdWUpXG5cdH1cbn1cblxuZnVuY3Rpb24gbWF5YmVGcmVlemUoc2NvcGU6IEltbWVyU2NvcGUsIHZhbHVlOiBhbnksIGRlZXAgPSBmYWxzZSkge1xuXHRpZiAoc2NvcGUuaW1tZXJfLmF1dG9GcmVlemVfICYmIHNjb3BlLmNhbkF1dG9GcmVlemVfKSB7XG5cdFx0ZnJlZXplKHZhbHVlLCBkZWVwKVxuXHR9XG59XG4iLCAiaW1wb3J0IHtcblx0ZWFjaCxcblx0aGFzLFxuXHRpcyxcblx0aXNEcmFmdGFibGUsXG5cdHNoYWxsb3dDb3B5LFxuXHRsYXRlc3QsXG5cdEltbWVyQmFzZVN0YXRlLFxuXHRJbW1lclN0YXRlLFxuXHREcmFmdGVkLFxuXHRBbnlPYmplY3QsXG5cdEFueUFycmF5LFxuXHRPYmplY3Rpc2gsXG5cdGdldEN1cnJlbnRTY29wZSxcblx0RFJBRlRfU1RBVEUsXG5cdGRpZSxcblx0Y3JlYXRlUHJveHksXG5cdFByb3h5VHlwZVxufSBmcm9tIFwiLi4vaW50ZXJuYWxcIlxuXG5pbnRlcmZhY2UgUHJveHlCYXNlU3RhdGUgZXh0ZW5kcyBJbW1lckJhc2VTdGF0ZSB7XG5cdGFzc2lnbmVkXzoge1xuXHRcdFtwcm9wZXJ0eTogc3RyaW5nXTogYm9vbGVhblxuXHR9XG5cdHBhcmVudF8/OiBJbW1lclN0YXRlXG5cdHJldm9rZV8oKTogdm9pZFxufVxuXG5leHBvcnQgaW50ZXJmYWNlIFByb3h5T2JqZWN0U3RhdGUgZXh0ZW5kcyBQcm94eUJhc2VTdGF0ZSB7XG5cdHR5cGVfOiBQcm94eVR5cGUuUHJveHlPYmplY3Rcblx0YmFzZV86IGFueVxuXHRjb3B5XzogYW55XG5cdGRyYWZ0XzogRHJhZnRlZDxBbnlPYmplY3QsIFByb3h5T2JqZWN0U3RhdGU+XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgUHJveHlBcnJheVN0YXRlIGV4dGVuZHMgUHJveHlCYXNlU3RhdGUge1xuXHR0eXBlXzogUHJveHlUeXBlLlByb3h5QXJyYXlcblx0YmFzZV86IEFueUFycmF5XG5cdGNvcHlfOiBBbnlBcnJheSB8IG51bGxcblx0ZHJhZnRfOiBEcmFmdGVkPEFueUFycmF5LCBQcm94eUFycmF5U3RhdGU+XG59XG5cbnR5cGUgUHJveHlTdGF0ZSA9IFByb3h5T2JqZWN0U3RhdGUgfCBQcm94eUFycmF5U3RhdGVcblxuLyoqXG4gKiBSZXR1cm5zIGEgbmV3IGRyYWZ0IG9mIHRoZSBgYmFzZWAgb2JqZWN0LlxuICpcbiAqIFRoZSBzZWNvbmQgYXJndW1lbnQgaXMgdGhlIHBhcmVudCBkcmFmdC1zdGF0ZSAodXNlZCBpbnRlcm5hbGx5KS5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZVByb3h5UHJveHk8VCBleHRlbmRzIE9iamVjdGlzaD4oXG5cdGJhc2U6IFQsXG5cdHBhcmVudD86IEltbWVyU3RhdGVcbik6IERyYWZ0ZWQ8VCwgUHJveHlTdGF0ZT4ge1xuXHRjb25zdCBpc0FycmF5ID0gQXJyYXkuaXNBcnJheShiYXNlKVxuXHRjb25zdCBzdGF0ZTogUHJveHlTdGF0ZSA9IHtcblx0XHR0eXBlXzogaXNBcnJheSA/IFByb3h5VHlwZS5Qcm94eUFycmF5IDogKFByb3h5VHlwZS5Qcm94eU9iamVjdCBhcyBhbnkpLFxuXHRcdC8vIFRyYWNrIHdoaWNoIHByb2R1Y2UgY2FsbCB0aGlzIGlzIGFzc29jaWF0ZWQgd2l0aC5cblx0XHRzY29wZV86IHBhcmVudCA/IHBhcmVudC5zY29wZV8gOiBnZXRDdXJyZW50U2NvcGUoKSEsXG5cdFx0Ly8gVHJ1ZSBmb3IgYm90aCBzaGFsbG93IGFuZCBkZWVwIGNoYW5nZXMuXG5cdFx0bW9kaWZpZWRfOiBmYWxzZSxcblx0XHQvLyBVc2VkIGR1cmluZyBmaW5hbGl6YXRpb24uXG5cdFx0ZmluYWxpemVkXzogZmFsc2UsXG5cdFx0Ly8gVHJhY2sgd2hpY2ggcHJvcGVydGllcyBoYXZlIGJlZW4gYXNzaWduZWQgKHRydWUpIG9yIGRlbGV0ZWQgKGZhbHNlKS5cblx0XHRhc3NpZ25lZF86IHt9LFxuXHRcdC8vIFRoZSBwYXJlbnQgZHJhZnQgc3RhdGUuXG5cdFx0cGFyZW50XzogcGFyZW50LFxuXHRcdC8vIFRoZSBiYXNlIHN0YXRlLlxuXHRcdGJhc2VfOiBiYXNlLFxuXHRcdC8vIFRoZSBiYXNlIHByb3h5LlxuXHRcdGRyYWZ0XzogbnVsbCBhcyBhbnksIC8vIHNldCBiZWxvd1xuXHRcdC8vIFRoZSBiYXNlIGNvcHkgd2l0aCBhbnkgdXBkYXRlZCB2YWx1ZXMuXG5cdFx0Y29weV86IG51bGwsXG5cdFx0Ly8gQ2FsbGVkIGJ5IHRoZSBgcHJvZHVjZWAgZnVuY3Rpb24uXG5cdFx0cmV2b2tlXzogbnVsbCBhcyBhbnksXG5cdFx0aXNNYW51YWxfOiBmYWxzZVxuXHR9XG5cblx0Ly8gdGhlIHRyYXBzIG11c3QgdGFyZ2V0IHNvbWV0aGluZywgYSBiaXQgbGlrZSB0aGUgJ3JlYWwnIGJhc2UuXG5cdC8vIGJ1dCBhbHNvLCB3ZSBuZWVkIHRvIGJlIGFibGUgdG8gZGV0ZXJtaW5lIGZyb20gdGhlIHRhcmdldCB3aGF0IHRoZSByZWxldmFudCBzdGF0ZSBpc1xuXHQvLyAodG8gYXZvaWQgY3JlYXRpbmcgdHJhcHMgcGVyIGluc3RhbmNlIHRvIGNhcHR1cmUgdGhlIHN0YXRlIGluIGNsb3N1cmUsXG5cdC8vIGFuZCB0byBhdm9pZCBjcmVhdGluZyB3ZWlyZCBoaWRkZW4gcHJvcGVydGllcyBhcyB3ZWxsKVxuXHQvLyBTbyB0aGUgdHJpY2sgaXMgdG8gdXNlICdzdGF0ZScgYXMgdGhlIGFjdHVhbCAndGFyZ2V0JyEgKGFuZCBtYWtlIHN1cmUgd2UgaW50ZXJjZXB0IGV2ZXJ5dGhpbmcpXG5cdC8vIE5vdGUgdGhhdCBpbiB0aGUgY2FzZSBvZiBhbiBhcnJheSwgd2UgcHV0IHRoZSBzdGF0ZSBpbiBhbiBhcnJheSB0byBoYXZlIGJldHRlciBSZWZsZWN0IGRlZmF1bHRzIG9vdGJcblx0bGV0IHRhcmdldDogVCA9IHN0YXRlIGFzIGFueVxuXHRsZXQgdHJhcHM6IFByb3h5SGFuZGxlcjxvYmplY3QgfCBBcnJheTxhbnk+PiA9IG9iamVjdFRyYXBzXG5cdGlmIChpc0FycmF5KSB7XG5cdFx0dGFyZ2V0ID0gW3N0YXRlXSBhcyBhbnlcblx0XHR0cmFwcyA9IGFycmF5VHJhcHNcblx0fVxuXG5cdGNvbnN0IHtyZXZva2UsIHByb3h5fSA9IFByb3h5LnJldm9jYWJsZSh0YXJnZXQsIHRyYXBzKVxuXHRzdGF0ZS5kcmFmdF8gPSBwcm94eSBhcyBhbnlcblx0c3RhdGUucmV2b2tlXyA9IHJldm9rZVxuXHRyZXR1cm4gcHJveHkgYXMgYW55XG59XG5cbi8qKlxuICogT2JqZWN0IGRyYWZ0c1xuICovXG5leHBvcnQgY29uc3Qgb2JqZWN0VHJhcHM6IFByb3h5SGFuZGxlcjxQcm94eVN0YXRlPiA9IHtcblx0Z2V0KHN0YXRlLCBwcm9wKSB7XG5cdFx0aWYgKHByb3AgPT09IERSQUZUX1NUQVRFKSByZXR1cm4gc3RhdGVcblxuXHRcdGNvbnN0IHNvdXJjZSA9IGxhdGVzdChzdGF0ZSlcblx0XHRpZiAoIWhhcyhzb3VyY2UsIHByb3ApKSB7XG5cdFx0XHQvLyBub24tZXhpc3Rpbmcgb3Igbm9uLW93biBwcm9wZXJ0eS4uLlxuXHRcdFx0cmV0dXJuIHJlYWRQcm9wRnJvbVByb3RvKHN0YXRlLCBzb3VyY2UsIHByb3ApXG5cdFx0fVxuXHRcdGNvbnN0IHZhbHVlID0gc291cmNlW3Byb3BdXG5cdFx0aWYgKHN0YXRlLmZpbmFsaXplZF8gfHwgIWlzRHJhZnRhYmxlKHZhbHVlKSkge1xuXHRcdFx0cmV0dXJuIHZhbHVlXG5cdFx0fVxuXHRcdC8vIENoZWNrIGZvciBleGlzdGluZyBkcmFmdCBpbiBtb2RpZmllZCBzdGF0ZS5cblx0XHQvLyBBc3NpZ25lZCB2YWx1ZXMgYXJlIG5ldmVyIGRyYWZ0ZWQuIFRoaXMgY2F0Y2hlcyBhbnkgZHJhZnRzIHdlIGNyZWF0ZWQsIHRvby5cblx0XHRpZiAodmFsdWUgPT09IHBlZWsoc3RhdGUuYmFzZV8sIHByb3ApKSB7XG5cdFx0XHRwcmVwYXJlQ29weShzdGF0ZSlcblx0XHRcdHJldHVybiAoc3RhdGUuY29weV8hW3Byb3AgYXMgYW55XSA9IGNyZWF0ZVByb3h5KFxuXHRcdFx0XHRzdGF0ZS5zY29wZV8uaW1tZXJfLFxuXHRcdFx0XHR2YWx1ZSxcblx0XHRcdFx0c3RhdGVcblx0XHRcdCkpXG5cdFx0fVxuXHRcdHJldHVybiB2YWx1ZVxuXHR9LFxuXHRoYXMoc3RhdGUsIHByb3ApIHtcblx0XHRyZXR1cm4gcHJvcCBpbiBsYXRlc3Qoc3RhdGUpXG5cdH0sXG5cdG93bktleXMoc3RhdGUpIHtcblx0XHRyZXR1cm4gUmVmbGVjdC5vd25LZXlzKGxhdGVzdChzdGF0ZSkpXG5cdH0sXG5cdHNldChcblx0XHRzdGF0ZTogUHJveHlPYmplY3RTdGF0ZSxcblx0XHRwcm9wOiBzdHJpbmcgLyogc3RyaWN0bHkgbm90LCBidXQgaGVscHMgVFMgKi8sXG5cdFx0dmFsdWVcblx0KSB7XG5cdFx0Y29uc3QgZGVzYyA9IGdldERlc2NyaXB0b3JGcm9tUHJvdG8obGF0ZXN0KHN0YXRlKSwgcHJvcClcblx0XHRpZiAoZGVzYz8uc2V0KSB7XG5cdFx0XHQvLyBzcGVjaWFsIGNhc2U6IGlmIHRoaXMgd3JpdGUgaXMgY2FwdHVyZWQgYnkgYSBzZXR0ZXIsIHdlIGhhdmVcblx0XHRcdC8vIHRvIHRyaWdnZXIgaXQgd2l0aCB0aGUgY29ycmVjdCBjb250ZXh0XG5cdFx0XHRkZXNjLnNldC5jYWxsKHN0YXRlLmRyYWZ0XywgdmFsdWUpXG5cdFx0XHRyZXR1cm4gdHJ1ZVxuXHRcdH1cblx0XHRpZiAoIXN0YXRlLm1vZGlmaWVkXykge1xuXHRcdFx0Ly8gdGhlIGxhc3QgY2hlY2sgaXMgYmVjYXVzZSB3ZSBuZWVkIHRvIGJlIGFibGUgdG8gZGlzdGluZ3Vpc2ggc2V0dGluZyBhIG5vbi1leGlzdGluZyB0byB1bmRlZmluZWQgKHdoaWNoIGlzIGEgY2hhbmdlKVxuXHRcdFx0Ly8gZnJvbSBzZXR0aW5nIGFuIGV4aXN0aW5nIHByb3BlcnR5IHdpdGggdmFsdWUgdW5kZWZpbmVkIHRvIHVuZGVmaW5lZCAod2hpY2ggaXMgbm90IGEgY2hhbmdlKVxuXHRcdFx0Y29uc3QgY3VycmVudCA9IHBlZWsobGF0ZXN0KHN0YXRlKSwgcHJvcClcblx0XHRcdC8vIHNwZWNpYWwgY2FzZSwgaWYgd2UgYXNzaWduaW5nIHRoZSBvcmlnaW5hbCB2YWx1ZSB0byBhIGRyYWZ0LCB3ZSBjYW4gaWdub3JlIHRoZSBhc3NpZ25tZW50XG5cdFx0XHRjb25zdCBjdXJyZW50U3RhdGU6IFByb3h5T2JqZWN0U3RhdGUgPSBjdXJyZW50Py5bRFJBRlRfU1RBVEVdXG5cdFx0XHRpZiAoY3VycmVudFN0YXRlICYmIGN1cnJlbnRTdGF0ZS5iYXNlXyA9PT0gdmFsdWUpIHtcblx0XHRcdFx0c3RhdGUuY29weV8hW3Byb3BdID0gdmFsdWVcblx0XHRcdFx0c3RhdGUuYXNzaWduZWRfW3Byb3BdID0gZmFsc2Vcblx0XHRcdFx0cmV0dXJuIHRydWVcblx0XHRcdH1cblx0XHRcdGlmIChpcyh2YWx1ZSwgY3VycmVudCkgJiYgKHZhbHVlICE9PSB1bmRlZmluZWQgfHwgaGFzKHN0YXRlLmJhc2VfLCBwcm9wKSkpXG5cdFx0XHRcdHJldHVybiB0cnVlXG5cdFx0XHRwcmVwYXJlQ29weShzdGF0ZSlcblx0XHRcdG1hcmtDaGFuZ2VkKHN0YXRlKVxuXHRcdH1cblxuXHRcdGlmIChcblx0XHRcdHN0YXRlLmNvcHlfIVtwcm9wXSA9PT0gdmFsdWUgJiZcblx0XHRcdC8vIHNwZWNpYWwgY2FzZTogTmFOXG5cdFx0XHR0eXBlb2YgdmFsdWUgIT09IFwibnVtYmVyXCIgJiZcblx0XHRcdC8vIHNwZWNpYWwgY2FzZTogaGFuZGxlIG5ldyBwcm9wcyB3aXRoIHZhbHVlICd1bmRlZmluZWQnXG5cdFx0XHQodmFsdWUgIT09IHVuZGVmaW5lZCB8fCBwcm9wIGluIHN0YXRlLmNvcHlfKVxuXHRcdClcblx0XHRcdHJldHVybiB0cnVlXG5cblx0XHQvLyBAdHMtaWdub3JlXG5cdFx0c3RhdGUuY29weV8hW3Byb3BdID0gdmFsdWVcblx0XHRzdGF0ZS5hc3NpZ25lZF9bcHJvcF0gPSB0cnVlXG5cdFx0cmV0dXJuIHRydWVcblx0fSxcblx0ZGVsZXRlUHJvcGVydHkoc3RhdGUsIHByb3A6IHN0cmluZykge1xuXHRcdC8vIFRoZSBgdW5kZWZpbmVkYCBjaGVjayBpcyBhIGZhc3QgcGF0aCBmb3IgcHJlLWV4aXN0aW5nIGtleXMuXG5cdFx0aWYgKHBlZWsoc3RhdGUuYmFzZV8sIHByb3ApICE9PSB1bmRlZmluZWQgfHwgcHJvcCBpbiBzdGF0ZS5iYXNlXykge1xuXHRcdFx0c3RhdGUuYXNzaWduZWRfW3Byb3BdID0gZmFsc2Vcblx0XHRcdHByZXBhcmVDb3B5KHN0YXRlKVxuXHRcdFx0bWFya0NoYW5nZWQoc3RhdGUpXG5cdFx0fSBlbHNlIHtcblx0XHRcdC8vIGlmIGFuIG9yaWdpbmFsbHkgbm90IGFzc2lnbmVkIHByb3BlcnR5IHdhcyBkZWxldGVkXG5cdFx0XHRkZWxldGUgc3RhdGUuYXNzaWduZWRfW3Byb3BdXG5cdFx0fVxuXHRcdC8vIEB0cy1pZ25vcmVcblx0XHRpZiAoc3RhdGUuY29weV8pIGRlbGV0ZSBzdGF0ZS5jb3B5X1twcm9wXVxuXHRcdHJldHVybiB0cnVlXG5cdH0sXG5cdC8vIE5vdGU6IFdlIG5ldmVyIGNvZXJjZSBgZGVzYy52YWx1ZWAgaW50byBhbiBJbW1lciBkcmFmdCwgYmVjYXVzZSB3ZSBjYW4ndCBtYWtlXG5cdC8vIHRoZSBzYW1lIGd1YXJhbnRlZSBpbiBFUzUgbW9kZS5cblx0Z2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKHN0YXRlLCBwcm9wKSB7XG5cdFx0Y29uc3Qgb3duZXIgPSBsYXRlc3Qoc3RhdGUpXG5cdFx0Y29uc3QgZGVzYyA9IFJlZmxlY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKG93bmVyLCBwcm9wKVxuXHRcdGlmICghZGVzYykgcmV0dXJuIGRlc2Ncblx0XHRyZXR1cm4ge1xuXHRcdFx0d3JpdGFibGU6IHRydWUsXG5cdFx0XHRjb25maWd1cmFibGU6IHN0YXRlLnR5cGVfICE9PSBQcm94eVR5cGUuUHJveHlBcnJheSB8fCBwcm9wICE9PSBcImxlbmd0aFwiLFxuXHRcdFx0ZW51bWVyYWJsZTogZGVzYy5lbnVtZXJhYmxlLFxuXHRcdFx0dmFsdWU6IG93bmVyW3Byb3BdXG5cdFx0fVxuXHR9LFxuXHRkZWZpbmVQcm9wZXJ0eSgpIHtcblx0XHRkaWUoMTEpXG5cdH0sXG5cdGdldFByb3RvdHlwZU9mKHN0YXRlKSB7XG5cdFx0cmV0dXJuIE9iamVjdC5nZXRQcm90b3R5cGVPZihzdGF0ZS5iYXNlXylcblx0fSxcblx0c2V0UHJvdG90eXBlT2YoKSB7XG5cdFx0ZGllKDEyKVxuXHR9XG59XG5cbi8qKlxuICogQXJyYXkgZHJhZnRzXG4gKi9cblxuY29uc3QgYXJyYXlUcmFwczogUHJveHlIYW5kbGVyPFtQcm94eUFycmF5U3RhdGVdPiA9IHt9XG5lYWNoKG9iamVjdFRyYXBzLCAoa2V5LCBmbikgPT4ge1xuXHQvLyBAdHMtaWdub3JlXG5cdGFycmF5VHJhcHNba2V5XSA9IGZ1bmN0aW9uKCkge1xuXHRcdGFyZ3VtZW50c1swXSA9IGFyZ3VtZW50c1swXVswXVxuXHRcdHJldHVybiBmbi5hcHBseSh0aGlzLCBhcmd1bWVudHMpXG5cdH1cbn0pXG5hcnJheVRyYXBzLmRlbGV0ZVByb3BlcnR5ID0gZnVuY3Rpb24oc3RhdGUsIHByb3ApIHtcblx0aWYgKF9fREVWX18gJiYgaXNOYU4ocGFyc2VJbnQocHJvcCBhcyBhbnkpKSkgZGllKDEzKVxuXHQvLyBAdHMtaWdub3JlXG5cdHJldHVybiBhcnJheVRyYXBzLnNldCEuY2FsbCh0aGlzLCBzdGF0ZSwgcHJvcCwgdW5kZWZpbmVkKVxufVxuYXJyYXlUcmFwcy5zZXQgPSBmdW5jdGlvbihzdGF0ZSwgcHJvcCwgdmFsdWUpIHtcblx0aWYgKF9fREVWX18gJiYgcHJvcCAhPT0gXCJsZW5ndGhcIiAmJiBpc05hTihwYXJzZUludChwcm9wIGFzIGFueSkpKSBkaWUoMTQpXG5cdHJldHVybiBvYmplY3RUcmFwcy5zZXQhLmNhbGwodGhpcywgc3RhdGVbMF0sIHByb3AsIHZhbHVlLCBzdGF0ZVswXSlcbn1cblxuLy8gQWNjZXNzIGEgcHJvcGVydHkgd2l0aG91dCBjcmVhdGluZyBhbiBJbW1lciBkcmFmdC5cbmZ1bmN0aW9uIHBlZWsoZHJhZnQ6IERyYWZ0ZWQsIHByb3A6IFByb3BlcnR5S2V5KSB7XG5cdGNvbnN0IHN0YXRlID0gZHJhZnRbRFJBRlRfU1RBVEVdXG5cdGNvbnN0IHNvdXJjZSA9IHN0YXRlID8gbGF0ZXN0KHN0YXRlKSA6IGRyYWZ0XG5cdHJldHVybiBzb3VyY2VbcHJvcF1cbn1cblxuZnVuY3Rpb24gcmVhZFByb3BGcm9tUHJvdG8oc3RhdGU6IEltbWVyU3RhdGUsIHNvdXJjZTogYW55LCBwcm9wOiBQcm9wZXJ0eUtleSkge1xuXHRjb25zdCBkZXNjID0gZ2V0RGVzY3JpcHRvckZyb21Qcm90byhzb3VyY2UsIHByb3ApXG5cdHJldHVybiBkZXNjXG5cdFx0PyBgdmFsdWVgIGluIGRlc2Ncblx0XHRcdD8gZGVzYy52YWx1ZVxuXHRcdFx0OiAvLyBUaGlzIGlzIGEgdmVyeSBzcGVjaWFsIGNhc2UsIGlmIHRoZSBwcm9wIGlzIGEgZ2V0dGVyIGRlZmluZWQgYnkgdGhlXG5cdFx0XHQgIC8vIHByb3RvdHlwZSwgd2Ugc2hvdWxkIGludm9rZSBpdCB3aXRoIHRoZSBkcmFmdCBhcyBjb250ZXh0IVxuXHRcdFx0ICBkZXNjLmdldD8uY2FsbChzdGF0ZS5kcmFmdF8pXG5cdFx0OiB1bmRlZmluZWRcbn1cblxuZnVuY3Rpb24gZ2V0RGVzY3JpcHRvckZyb21Qcm90byhcblx0c291cmNlOiBhbnksXG5cdHByb3A6IFByb3BlcnR5S2V5XG4pOiBQcm9wZXJ0eURlc2NyaXB0b3IgfCB1bmRlZmluZWQge1xuXHQvLyAnaW4nIGNoZWNrcyBwcm90byFcblx0aWYgKCEocHJvcCBpbiBzb3VyY2UpKSByZXR1cm4gdW5kZWZpbmVkXG5cdGxldCBwcm90byA9IE9iamVjdC5nZXRQcm90b3R5cGVPZihzb3VyY2UpXG5cdHdoaWxlIChwcm90bykge1xuXHRcdGNvbnN0IGRlc2MgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKHByb3RvLCBwcm9wKVxuXHRcdGlmIChkZXNjKSByZXR1cm4gZGVzY1xuXHRcdHByb3RvID0gT2JqZWN0LmdldFByb3RvdHlwZU9mKHByb3RvKVxuXHR9XG5cdHJldHVybiB1bmRlZmluZWRcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIG1hcmtDaGFuZ2VkKHN0YXRlOiBJbW1lclN0YXRlKSB7XG5cdGlmICghc3RhdGUubW9kaWZpZWRfKSB7XG5cdFx0c3RhdGUubW9kaWZpZWRfID0gdHJ1ZVxuXHRcdGlmIChzdGF0ZS5wYXJlbnRfKSB7XG5cdFx0XHRtYXJrQ2hhbmdlZChzdGF0ZS5wYXJlbnRfKVxuXHRcdH1cblx0fVxufVxuXG5leHBvcnQgZnVuY3Rpb24gcHJlcGFyZUNvcHkoc3RhdGU6IHtiYXNlXzogYW55OyBjb3B5XzogYW55fSkge1xuXHRpZiAoIXN0YXRlLmNvcHlfKSB7XG5cdFx0c3RhdGUuY29weV8gPSBzaGFsbG93Q29weShzdGF0ZS5iYXNlXylcblx0fVxufVxuIiwgImltcG9ydCB7XG5cdElQcm9kdWNlV2l0aFBhdGNoZXMsXG5cdElQcm9kdWNlLFxuXHRJbW1lclN0YXRlLFxuXHREcmFmdGVkLFxuXHRpc0RyYWZ0YWJsZSxcblx0cHJvY2Vzc1Jlc3VsdCxcblx0UGF0Y2gsXG5cdE9iamVjdGlzaCxcblx0RFJBRlRfU1RBVEUsXG5cdERyYWZ0LFxuXHRQYXRjaExpc3RlbmVyLFxuXHRpc0RyYWZ0LFxuXHRpc01hcCxcblx0aXNTZXQsXG5cdGNyZWF0ZVByb3h5UHJveHksXG5cdGdldFBsdWdpbixcblx0ZGllLFxuXHRoYXNQcm94aWVzLFxuXHRlbnRlclNjb3BlLFxuXHRyZXZva2VTY29wZSxcblx0bGVhdmVTY29wZSxcblx0dXNlUGF0Y2hlc0luU2NvcGUsXG5cdGdldEN1cnJlbnRTY29wZSxcblx0Tk9USElORyxcblx0ZnJlZXplLFxuXHRjdXJyZW50XG59IGZyb20gXCIuLi9pbnRlcm5hbFwiXG5cbmludGVyZmFjZSBQcm9kdWNlcnNGbnMge1xuXHRwcm9kdWNlOiBJUHJvZHVjZVxuXHRwcm9kdWNlV2l0aFBhdGNoZXM6IElQcm9kdWNlV2l0aFBhdGNoZXNcbn1cblxuZXhwb3J0IGNsYXNzIEltbWVyIGltcGxlbWVudHMgUHJvZHVjZXJzRm5zIHtcblx0dXNlUHJveGllc186IGJvb2xlYW4gPSBoYXNQcm94aWVzXG5cblx0YXV0b0ZyZWV6ZV86IGJvb2xlYW4gPSB0cnVlXG5cblx0Y29uc3RydWN0b3IoY29uZmlnPzoge3VzZVByb3hpZXM/OiBib29sZWFuOyBhdXRvRnJlZXplPzogYm9vbGVhbn0pIHtcblx0XHRpZiAodHlwZW9mIGNvbmZpZz8udXNlUHJveGllcyA9PT0gXCJib29sZWFuXCIpXG5cdFx0XHR0aGlzLnNldFVzZVByb3hpZXMoY29uZmlnIS51c2VQcm94aWVzKVxuXHRcdGlmICh0eXBlb2YgY29uZmlnPy5hdXRvRnJlZXplID09PSBcImJvb2xlYW5cIilcblx0XHRcdHRoaXMuc2V0QXV0b0ZyZWV6ZShjb25maWchLmF1dG9GcmVlemUpXG5cdH1cblxuXHQvKipcblx0ICogVGhlIGBwcm9kdWNlYCBmdW5jdGlvbiB0YWtlcyBhIHZhbHVlIGFuZCBhIFwicmVjaXBlIGZ1bmN0aW9uXCIgKHdob3NlXG5cdCAqIHJldHVybiB2YWx1ZSBvZnRlbiBkZXBlbmRzIG9uIHRoZSBiYXNlIHN0YXRlKS4gVGhlIHJlY2lwZSBmdW5jdGlvbiBpc1xuXHQgKiBmcmVlIHRvIG11dGF0ZSBpdHMgZmlyc3QgYXJndW1lbnQgaG93ZXZlciBpdCB3YW50cy4gQWxsIG11dGF0aW9ucyBhcmVcblx0ICogb25seSBldmVyIGFwcGxpZWQgdG8gYSBfX2NvcHlfXyBvZiB0aGUgYmFzZSBzdGF0ZS5cblx0ICpcblx0ICogUGFzcyBvbmx5IGEgZnVuY3Rpb24gdG8gY3JlYXRlIGEgXCJjdXJyaWVkIHByb2R1Y2VyXCIgd2hpY2ggcmVsaWV2ZXMgeW91XG5cdCAqIGZyb20gcGFzc2luZyB0aGUgcmVjaXBlIGZ1bmN0aW9uIGV2ZXJ5IHRpbWUuXG5cdCAqXG5cdCAqIE9ubHkgcGxhaW4gb2JqZWN0cyBhbmQgYXJyYXlzIGFyZSBtYWRlIG11dGFibGUuIEFsbCBvdGhlciBvYmplY3RzIGFyZVxuXHQgKiBjb25zaWRlcmVkIHVuY29weWFibGUuXG5cdCAqXG5cdCAqIE5vdGU6IFRoaXMgZnVuY3Rpb24gaXMgX19ib3VuZF9fIHRvIGl0cyBgSW1tZXJgIGluc3RhbmNlLlxuXHQgKlxuXHQgKiBAcGFyYW0ge2FueX0gYmFzZSAtIHRoZSBpbml0aWFsIHN0YXRlXG5cdCAqIEBwYXJhbSB7RnVuY3Rpb259IHByb2R1Y2VyIC0gZnVuY3Rpb24gdGhhdCByZWNlaXZlcyBhIHByb3h5IG9mIHRoZSBiYXNlIHN0YXRlIGFzIGZpcnN0IGFyZ3VtZW50IGFuZCB3aGljaCBjYW4gYmUgZnJlZWx5IG1vZGlmaWVkXG5cdCAqIEBwYXJhbSB7RnVuY3Rpb259IHBhdGNoTGlzdGVuZXIgLSBvcHRpb25hbCBmdW5jdGlvbiB0aGF0IHdpbGwgYmUgY2FsbGVkIHdpdGggYWxsIHRoZSBwYXRjaGVzIHByb2R1Y2VkIGhlcmVcblx0ICogQHJldHVybnMge2FueX0gYSBuZXcgc3RhdGUsIG9yIHRoZSBpbml0aWFsIHN0YXRlIGlmIG5vdGhpbmcgd2FzIG1vZGlmaWVkXG5cdCAqL1xuXHRwcm9kdWNlOiBJUHJvZHVjZSA9IChiYXNlOiBhbnksIHJlY2lwZT86IGFueSwgcGF0Y2hMaXN0ZW5lcj86IGFueSkgPT4ge1xuXHRcdC8vIGN1cnJpZWQgaW52b2NhdGlvblxuXHRcdGlmICh0eXBlb2YgYmFzZSA9PT0gXCJmdW5jdGlvblwiICYmIHR5cGVvZiByZWNpcGUgIT09IFwiZnVuY3Rpb25cIikge1xuXHRcdFx0Y29uc3QgZGVmYXVsdEJhc2UgPSByZWNpcGVcblx0XHRcdHJlY2lwZSA9IGJhc2VcblxuXHRcdFx0Y29uc3Qgc2VsZiA9IHRoaXNcblx0XHRcdHJldHVybiBmdW5jdGlvbiBjdXJyaWVkUHJvZHVjZShcblx0XHRcdFx0dGhpczogYW55LFxuXHRcdFx0XHRiYXNlID0gZGVmYXVsdEJhc2UsXG5cdFx0XHRcdC4uLmFyZ3M6IGFueVtdXG5cdFx0XHQpIHtcblx0XHRcdFx0cmV0dXJuIHNlbGYucHJvZHVjZShiYXNlLCAoZHJhZnQ6IERyYWZ0ZWQpID0+IHJlY2lwZS5jYWxsKHRoaXMsIGRyYWZ0LCAuLi5hcmdzKSkgLy8gcHJldHRpZXItaWdub3JlXG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0aWYgKHR5cGVvZiByZWNpcGUgIT09IFwiZnVuY3Rpb25cIikgZGllKDYpXG5cdFx0aWYgKHBhdGNoTGlzdGVuZXIgIT09IHVuZGVmaW5lZCAmJiB0eXBlb2YgcGF0Y2hMaXN0ZW5lciAhPT0gXCJmdW5jdGlvblwiKVxuXHRcdFx0ZGllKDcpXG5cblx0XHRsZXQgcmVzdWx0XG5cblx0XHQvLyBPbmx5IHBsYWluIG9iamVjdHMsIGFycmF5cywgYW5kIFwiaW1tZXJhYmxlIGNsYXNzZXNcIiBhcmUgZHJhZnRlZC5cblx0XHRpZiAoaXNEcmFmdGFibGUoYmFzZSkpIHtcblx0XHRcdGNvbnN0IHNjb3BlID0gZW50ZXJTY29wZSh0aGlzKVxuXHRcdFx0Y29uc3QgcHJveHkgPSBjcmVhdGVQcm94eSh0aGlzLCBiYXNlLCB1bmRlZmluZWQpXG5cdFx0XHRsZXQgaGFzRXJyb3IgPSB0cnVlXG5cdFx0XHR0cnkge1xuXHRcdFx0XHRyZXN1bHQgPSByZWNpcGUocHJveHkpXG5cdFx0XHRcdGhhc0Vycm9yID0gZmFsc2Vcblx0XHRcdH0gZmluYWxseSB7XG5cdFx0XHRcdC8vIGZpbmFsbHkgaW5zdGVhZCBvZiBjYXRjaCArIHJldGhyb3cgYmV0dGVyIHByZXNlcnZlcyBvcmlnaW5hbCBzdGFja1xuXHRcdFx0XHRpZiAoaGFzRXJyb3IpIHJldm9rZVNjb3BlKHNjb3BlKVxuXHRcdFx0XHRlbHNlIGxlYXZlU2NvcGUoc2NvcGUpXG5cdFx0XHR9XG5cdFx0XHRpZiAodHlwZW9mIFByb21pc2UgIT09IFwidW5kZWZpbmVkXCIgJiYgcmVzdWx0IGluc3RhbmNlb2YgUHJvbWlzZSkge1xuXHRcdFx0XHRyZXR1cm4gcmVzdWx0LnRoZW4oXG5cdFx0XHRcdFx0cmVzdWx0ID0+IHtcblx0XHRcdFx0XHRcdHVzZVBhdGNoZXNJblNjb3BlKHNjb3BlLCBwYXRjaExpc3RlbmVyKVxuXHRcdFx0XHRcdFx0cmV0dXJuIHByb2Nlc3NSZXN1bHQocmVzdWx0LCBzY29wZSlcblx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdGVycm9yID0+IHtcblx0XHRcdFx0XHRcdHJldm9rZVNjb3BlKHNjb3BlKVxuXHRcdFx0XHRcdFx0dGhyb3cgZXJyb3Jcblx0XHRcdFx0XHR9XG5cdFx0XHRcdClcblx0XHRcdH1cblx0XHRcdHVzZVBhdGNoZXNJblNjb3BlKHNjb3BlLCBwYXRjaExpc3RlbmVyKVxuXHRcdFx0cmV0dXJuIHByb2Nlc3NSZXN1bHQocmVzdWx0LCBzY29wZSlcblx0XHR9IGVsc2UgaWYgKCFiYXNlIHx8IHR5cGVvZiBiYXNlICE9PSBcIm9iamVjdFwiKSB7XG5cdFx0XHRyZXN1bHQgPSByZWNpcGUoYmFzZSlcblx0XHRcdGlmIChyZXN1bHQgPT09IHVuZGVmaW5lZCkgcmVzdWx0ID0gYmFzZVxuXHRcdFx0aWYgKHJlc3VsdCA9PT0gTk9USElORykgcmVzdWx0ID0gdW5kZWZpbmVkXG5cdFx0XHRpZiAodGhpcy5hdXRvRnJlZXplXykgZnJlZXplKHJlc3VsdCwgdHJ1ZSlcblx0XHRcdGlmIChwYXRjaExpc3RlbmVyKSB7XG5cdFx0XHRcdGNvbnN0IHA6IFBhdGNoW10gPSBbXVxuXHRcdFx0XHRjb25zdCBpcDogUGF0Y2hbXSA9IFtdXG5cdFx0XHRcdGdldFBsdWdpbihcIlBhdGNoZXNcIikuZ2VuZXJhdGVSZXBsYWNlbWVudFBhdGNoZXNfKGJhc2UsIHJlc3VsdCwgcCwgaXApXG5cdFx0XHRcdHBhdGNoTGlzdGVuZXIocCwgaXApXG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gcmVzdWx0XG5cdFx0fSBlbHNlIGRpZSgyMSwgYmFzZSlcblx0fVxuXG5cdHByb2R1Y2VXaXRoUGF0Y2hlczogSVByb2R1Y2VXaXRoUGF0Y2hlcyA9IChcblx0XHRiYXNlOiBhbnksXG5cdFx0cmVjaXBlPzogYW55LFxuXHQpOiBhbnkgPT4ge1xuXHRcdC8vIGN1cnJpZWQgaW52b2NhdGlvblxuXHRcdGlmICh0eXBlb2YgYmFzZSA9PT0gXCJmdW5jdGlvblwiKSB7XG5cdFx0XHRyZXR1cm4gKHN0YXRlOiBhbnksIC4uLmFyZ3M6IGFueVtdKSA9PlxuXHRcdFx0XHR0aGlzLnByb2R1Y2VXaXRoUGF0Y2hlcyhzdGF0ZSwgKGRyYWZ0OiBhbnkpID0+IGJhc2UoZHJhZnQsIC4uLmFyZ3MpKVxuXHRcdH1cblxuXHRcdGxldCBwYXRjaGVzOiBQYXRjaFtdLCBpbnZlcnNlUGF0Y2hlczogUGF0Y2hbXVxuXHRcdGNvbnN0IHJlc3VsdCA9IHRoaXMucHJvZHVjZShiYXNlLCByZWNpcGUsIChwOiBQYXRjaFtdLCBpcDogUGF0Y2hbXSkgPT4ge1xuXHRcdFx0cGF0Y2hlcyA9IHBcblx0XHRcdGludmVyc2VQYXRjaGVzID0gaXBcblx0XHR9KVxuXG5cdFx0aWYgKHR5cGVvZiBQcm9taXNlICE9PSBcInVuZGVmaW5lZFwiICYmIHJlc3VsdCBpbnN0YW5jZW9mIFByb21pc2UpIHtcblx0XHRcdHJldHVybiByZXN1bHQudGhlbihuZXh0U3RhdGUgPT4gW25leHRTdGF0ZSwgcGF0Y2hlcyEsIGludmVyc2VQYXRjaGVzIV0pXG5cdFx0fVxuXHRcdHJldHVybiBbcmVzdWx0LCBwYXRjaGVzISwgaW52ZXJzZVBhdGNoZXMhXVxuXHR9XG5cblx0Y3JlYXRlRHJhZnQ8VCBleHRlbmRzIE9iamVjdGlzaD4oYmFzZTogVCk6IERyYWZ0PFQ+IHtcblx0XHRpZiAoIWlzRHJhZnRhYmxlKGJhc2UpKSBkaWUoOClcblx0XHRpZiAoaXNEcmFmdChiYXNlKSkgYmFzZSA9IGN1cnJlbnQoYmFzZSlcblx0XHRjb25zdCBzY29wZSA9IGVudGVyU2NvcGUodGhpcylcblx0XHRjb25zdCBwcm94eSA9IGNyZWF0ZVByb3h5KHRoaXMsIGJhc2UsIHVuZGVmaW5lZClcblx0XHRwcm94eVtEUkFGVF9TVEFURV0uaXNNYW51YWxfID0gdHJ1ZVxuXHRcdGxlYXZlU2NvcGUoc2NvcGUpXG5cdFx0cmV0dXJuIHByb3h5IGFzIGFueVxuXHR9XG5cblx0ZmluaXNoRHJhZnQ8RCBleHRlbmRzIERyYWZ0PGFueT4+KFxuXHRcdGRyYWZ0OiBELFxuXHRcdHBhdGNoTGlzdGVuZXI/OiBQYXRjaExpc3RlbmVyXG5cdCk6IEQgZXh0ZW5kcyBEcmFmdDxpbmZlciBUPiA/IFQgOiBuZXZlciB7XG5cdFx0Y29uc3Qgc3RhdGU6IEltbWVyU3RhdGUgPSBkcmFmdCAmJiAoZHJhZnQgYXMgYW55KVtEUkFGVF9TVEFURV1cblx0XHRpZiAoX19ERVZfXykge1xuXHRcdFx0aWYgKCFzdGF0ZSB8fCAhc3RhdGUuaXNNYW51YWxfKSBkaWUoOSlcblx0XHRcdGlmIChzdGF0ZS5maW5hbGl6ZWRfKSBkaWUoMTApXG5cdFx0fVxuXHRcdGNvbnN0IHtzY29wZV86IHNjb3BlfSA9IHN0YXRlXG5cdFx0dXNlUGF0Y2hlc0luU2NvcGUoc2NvcGUsIHBhdGNoTGlzdGVuZXIpXG5cdFx0cmV0dXJuIHByb2Nlc3NSZXN1bHQodW5kZWZpbmVkLCBzY29wZSlcblx0fVxuXG5cdC8qKlxuXHQgKiBQYXNzIHRydWUgdG8gYXV0b21hdGljYWxseSBmcmVlemUgYWxsIGNvcGllcyBjcmVhdGVkIGJ5IEltbWVyLlxuXHQgKlxuXHQgKiBCeSBkZWZhdWx0LCBhdXRvLWZyZWV6aW5nIGlzIGVuYWJsZWQuXG5cdCAqL1xuXHRzZXRBdXRvRnJlZXplKHZhbHVlOiBib29sZWFuKSB7XG5cdFx0dGhpcy5hdXRvRnJlZXplXyA9IHZhbHVlXG5cdH1cblxuXHQvKipcblx0ICogUGFzcyB0cnVlIHRvIHVzZSB0aGUgRVMyMDE1IGBQcm94eWAgY2xhc3Mgd2hlbiBjcmVhdGluZyBkcmFmdHMsIHdoaWNoIGlzXG5cdCAqIGFsd2F5cyBmYXN0ZXIgdGhhbiB1c2luZyBFUzUgcHJveGllcy5cblx0ICpcblx0ICogQnkgZGVmYXVsdCwgZmVhdHVyZSBkZXRlY3Rpb24gaXMgdXNlZCwgc28gY2FsbGluZyB0aGlzIGlzIHJhcmVseSBuZWNlc3NhcnkuXG5cdCAqL1xuXHRzZXRVc2VQcm94aWVzKHZhbHVlOiBib29sZWFuKSB7XG5cdFx0aWYgKHZhbHVlICYmICFoYXNQcm94aWVzKSB7XG5cdFx0XHRkaWUoMjApXG5cdFx0fVxuXHRcdHRoaXMudXNlUHJveGllc18gPSB2YWx1ZVxuXHR9XG5cblx0YXBwbHlQYXRjaGVzPFQgZXh0ZW5kcyBPYmplY3Rpc2g+KGJhc2U6IFQsIHBhdGNoZXM6IFBhdGNoW10pOiBUIHtcblx0XHQvLyBJZiBhIHBhdGNoIHJlcGxhY2VzIHRoZSBlbnRpcmUgc3RhdGUsIHRha2UgdGhhdCByZXBsYWNlbWVudCBhcyBiYXNlXG5cdFx0Ly8gYmVmb3JlIGFwcGx5aW5nIHBhdGNoZXNcblx0XHRsZXQgaTogbnVtYmVyXG5cdFx0Zm9yIChpID0gcGF0Y2hlcy5sZW5ndGggLSAxOyBpID49IDA7IGktLSkge1xuXHRcdFx0Y29uc3QgcGF0Y2ggPSBwYXRjaGVzW2ldXG5cdFx0XHRpZiAocGF0Y2gucGF0aC5sZW5ndGggPT09IDAgJiYgcGF0Y2gub3AgPT09IFwicmVwbGFjZVwiKSB7XG5cdFx0XHRcdGJhc2UgPSBwYXRjaC52YWx1ZVxuXHRcdFx0XHRicmVha1xuXHRcdFx0fVxuXHRcdH1cblx0XHQvLyBJZiB0aGVyZSB3YXMgYSBwYXRjaCB0aGF0IHJlcGxhY2VkIHRoZSBlbnRpcmUgc3RhdGUsIHN0YXJ0IGZyb20gdGhlXG5cdFx0Ly8gcGF0Y2ggYWZ0ZXIgdGhhdC5cblx0XHRpZiAoaSA+IC0xKSB7XG5cdFx0XHRwYXRjaGVzID0gcGF0Y2hlcy5zbGljZShpICsgMSlcblx0XHR9XG5cblx0XHRjb25zdCBhcHBseVBhdGNoZXNJbXBsID0gZ2V0UGx1Z2luKFwiUGF0Y2hlc1wiKS5hcHBseVBhdGNoZXNfXG5cdFx0aWYgKGlzRHJhZnQoYmFzZSkpIHtcblx0XHRcdC8vIE4uQjogbmV2ZXIgaGl0cyBpZiBzb21lIHBhdGNoIGEgcmVwbGFjZW1lbnQsIHBhdGNoZXMgYXJlIG5ldmVyIGRyYWZ0c1xuXHRcdFx0cmV0dXJuIGFwcGx5UGF0Y2hlc0ltcGwoYmFzZSwgcGF0Y2hlcylcblx0XHR9XG5cdFx0Ly8gT3RoZXJ3aXNlLCBwcm9kdWNlIGEgY29weSBvZiB0aGUgYmFzZSBzdGF0ZS5cblx0XHRyZXR1cm4gdGhpcy5wcm9kdWNlKGJhc2UsIChkcmFmdDogRHJhZnRlZCkgPT5cblx0XHRcdGFwcGx5UGF0Y2hlc0ltcGwoZHJhZnQsIHBhdGNoZXMpXG5cdFx0KVxuXHR9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGVQcm94eTxUIGV4dGVuZHMgT2JqZWN0aXNoPihcblx0aW1tZXI6IEltbWVyLFxuXHR2YWx1ZTogVCxcblx0cGFyZW50PzogSW1tZXJTdGF0ZVxuKTogRHJhZnRlZDxULCBJbW1lclN0YXRlPiB7XG5cdC8vIHByZWNvbmRpdGlvbjogY3JlYXRlUHJveHkgc2hvdWxkIGJlIGd1YXJkZWQgYnkgaXNEcmFmdGFibGUsIHNvIHdlIGtub3cgd2UgY2FuIHNhZmVseSBkcmFmdFxuXHRjb25zdCBkcmFmdDogRHJhZnRlZCA9IGlzTWFwKHZhbHVlKVxuXHRcdD8gZ2V0UGx1Z2luKFwiTWFwU2V0XCIpLnByb3h5TWFwXyh2YWx1ZSwgcGFyZW50KVxuXHRcdDogaXNTZXQodmFsdWUpXG5cdFx0PyBnZXRQbHVnaW4oXCJNYXBTZXRcIikucHJveHlTZXRfKHZhbHVlLCBwYXJlbnQpXG5cdFx0OiBpbW1lci51c2VQcm94aWVzX1xuXHRcdD8gY3JlYXRlUHJveHlQcm94eSh2YWx1ZSwgcGFyZW50KVxuXHRcdDogZ2V0UGx1Z2luKFwiRVM1XCIpLmNyZWF0ZUVTNVByb3h5Xyh2YWx1ZSwgcGFyZW50KVxuXG5cdGNvbnN0IHNjb3BlID0gcGFyZW50ID8gcGFyZW50LnNjb3BlXyA6IGdldEN1cnJlbnRTY29wZSgpXG5cdHNjb3BlLmRyYWZ0c18ucHVzaChkcmFmdClcblx0cmV0dXJuIGRyYWZ0XG59XG4iLCAiaW1wb3J0IHtcblx0ZGllLFxuXHRpc0RyYWZ0LFxuXHRzaGFsbG93Q29weSxcblx0ZWFjaCxcblx0RFJBRlRfU1RBVEUsXG5cdGdldCxcblx0c2V0LFxuXHRJbW1lclN0YXRlLFxuXHRpc0RyYWZ0YWJsZSxcblx0QXJjaHR5cGUsXG5cdGdldEFyY2h0eXBlLFxuXHRnZXRQbHVnaW5cbn0gZnJvbSBcIi4uL2ludGVybmFsXCJcblxuLyoqIFRha2VzIGEgc25hcHNob3Qgb2YgdGhlIGN1cnJlbnQgc3RhdGUgb2YgYSBkcmFmdCBhbmQgZmluYWxpemVzIGl0IChidXQgd2l0aG91dCBmcmVlemluZykuIFRoaXMgaXMgYSBncmVhdCB1dGlsaXR5IHRvIHByaW50IHRoZSBjdXJyZW50IHN0YXRlIGR1cmluZyBkZWJ1Z2dpbmcgKG5vIFByb3hpZXMgaW4gdGhlIHdheSkuIFRoZSBvdXRwdXQgb2YgY3VycmVudCBjYW4gYWxzbyBiZSBzYWZlbHkgbGVha2VkIG91dHNpZGUgdGhlIHByb2R1Y2VyLiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGN1cnJlbnQ8VD4odmFsdWU6IFQpOiBUXG5leHBvcnQgZnVuY3Rpb24gY3VycmVudCh2YWx1ZTogYW55KTogYW55IHtcblx0aWYgKCFpc0RyYWZ0KHZhbHVlKSkgZGllKDIyLCB2YWx1ZSlcblx0cmV0dXJuIGN1cnJlbnRJbXBsKHZhbHVlKVxufVxuXG5mdW5jdGlvbiBjdXJyZW50SW1wbCh2YWx1ZTogYW55KTogYW55IHtcblx0aWYgKCFpc0RyYWZ0YWJsZSh2YWx1ZSkpIHJldHVybiB2YWx1ZVxuXHRjb25zdCBzdGF0ZTogSW1tZXJTdGF0ZSB8IHVuZGVmaW5lZCA9IHZhbHVlW0RSQUZUX1NUQVRFXVxuXHRsZXQgY29weTogYW55XG5cdGNvbnN0IGFyY2hUeXBlID0gZ2V0QXJjaHR5cGUodmFsdWUpXG5cdGlmIChzdGF0ZSkge1xuXHRcdGlmIChcblx0XHRcdCFzdGF0ZS5tb2RpZmllZF8gJiZcblx0XHRcdChzdGF0ZS50eXBlXyA8IDQgfHwgIWdldFBsdWdpbihcIkVTNVwiKS5oYXNDaGFuZ2VzXyhzdGF0ZSBhcyBhbnkpKVxuXHRcdClcblx0XHRcdHJldHVybiBzdGF0ZS5iYXNlX1xuXHRcdC8vIE9wdGltaXphdGlvbjogYXZvaWQgZ2VuZXJhdGluZyBuZXcgZHJhZnRzIGR1cmluZyBjb3B5aW5nXG5cdFx0c3RhdGUuZmluYWxpemVkXyA9IHRydWVcblx0XHRjb3B5ID0gY29weUhlbHBlcih2YWx1ZSwgYXJjaFR5cGUpXG5cdFx0c3RhdGUuZmluYWxpemVkXyA9IGZhbHNlXG5cdH0gZWxzZSB7XG5cdFx0Y29weSA9IGNvcHlIZWxwZXIodmFsdWUsIGFyY2hUeXBlKVxuXHR9XG5cblx0ZWFjaChjb3B5LCAoa2V5LCBjaGlsZFZhbHVlKSA9PiB7XG5cdFx0aWYgKHN0YXRlICYmIGdldChzdGF0ZS5iYXNlXywga2V5KSA9PT0gY2hpbGRWYWx1ZSkgcmV0dXJuIC8vIG5vIG5lZWQgdG8gY29weSBvciBzZWFyY2ggaW4gc29tZXRoaW5nIHRoYXQgZGlkbid0IGNoYW5nZVxuXHRcdHNldChjb3B5LCBrZXksIGN1cnJlbnRJbXBsKGNoaWxkVmFsdWUpKVxuXHR9KVxuXHQvLyBJbiB0aGUgZnV0dXJlLCB3ZSBtaWdodCBjb25zaWRlciBmcmVlemluZyBoZXJlLCBiYXNlZCBvbiB0aGUgY3VycmVudCBzZXR0aW5nc1xuXHRyZXR1cm4gYXJjaFR5cGUgPT09IEFyY2h0eXBlLlNldCA/IG5ldyBTZXQoY29weSkgOiBjb3B5XG59XG5cbmZ1bmN0aW9uIGNvcHlIZWxwZXIodmFsdWU6IGFueSwgYXJjaFR5cGU6IG51bWJlcik6IGFueSB7XG5cdC8vIGNyZWF0ZXMgYSBzaGFsbG93IGNvcHksIGV2ZW4gaWYgaXQgaXMgYSBtYXAgb3Igc2V0XG5cdHN3aXRjaCAoYXJjaFR5cGUpIHtcblx0XHRjYXNlIEFyY2h0eXBlLk1hcDpcblx0XHRcdHJldHVybiBuZXcgTWFwKHZhbHVlKVxuXHRcdGNhc2UgQXJjaHR5cGUuU2V0OlxuXHRcdFx0Ly8gU2V0IHdpbGwgYmUgY2xvbmVkIGFzIGFycmF5IHRlbXBvcmFyaWx5LCBzbyB0aGF0IHdlIGNhbiByZXBsYWNlIGluZGl2aWR1YWwgaXRlbXNcblx0XHRcdHJldHVybiBBcnJheS5mcm9tKHZhbHVlKVxuXHR9XG5cdHJldHVybiBzaGFsbG93Q29weSh2YWx1ZSlcbn1cbiIsICJpbXBvcnQge1xuXHRJbW1lclN0YXRlLFxuXHREcmFmdGVkLFxuXHRFUzVBcnJheVN0YXRlLFxuXHRFUzVPYmplY3RTdGF0ZSxcblx0ZWFjaCxcblx0aGFzLFxuXHRpc0RyYWZ0LFxuXHRsYXRlc3QsXG5cdERSQUZUX1NUQVRFLFxuXHRpcyxcblx0bG9hZFBsdWdpbixcblx0SW1tZXJTY29wZSxcblx0UHJveHlUeXBlLFxuXHRnZXRDdXJyZW50U2NvcGUsXG5cdGRpZSxcblx0bWFya0NoYW5nZWQsXG5cdG9iamVjdFRyYXBzLFxuXHRvd25LZXlzLFxuXHRnZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3JzXG59IGZyb20gXCIuLi9pbnRlcm5hbFwiXG5cbnR5cGUgRVM1U3RhdGUgPSBFUzVBcnJheVN0YXRlIHwgRVM1T2JqZWN0U3RhdGVcblxuZXhwb3J0IGZ1bmN0aW9uIGVuYWJsZUVTNSgpIHtcblx0ZnVuY3Rpb24gd2lsbEZpbmFsaXplRVM1Xyhcblx0XHRzY29wZTogSW1tZXJTY29wZSxcblx0XHRyZXN1bHQ6IGFueSxcblx0XHRpc1JlcGxhY2VkOiBib29sZWFuXG5cdCkge1xuXHRcdGlmICghaXNSZXBsYWNlZCkge1xuXHRcdFx0aWYgKHNjb3BlLnBhdGNoZXNfKSB7XG5cdFx0XHRcdG1hcmtDaGFuZ2VzUmVjdXJzaXZlbHkoc2NvcGUuZHJhZnRzXyFbMF0pXG5cdFx0XHR9XG5cdFx0XHQvLyBUaGlzIGlzIGZhc3RlciB3aGVuIHdlIGRvbid0IGNhcmUgYWJvdXQgd2hpY2ggYXR0cmlidXRlcyBjaGFuZ2VkLlxuXHRcdFx0bWFya0NoYW5nZXNTd2VlcChzY29wZS5kcmFmdHNfKVxuXHRcdH1cblx0XHQvLyBXaGVuIGEgY2hpbGQgZHJhZnQgaXMgcmV0dXJuZWQsIGxvb2sgZm9yIGNoYW5nZXMuXG5cdFx0ZWxzZSBpZiAoXG5cdFx0XHRpc0RyYWZ0KHJlc3VsdCkgJiZcblx0XHRcdChyZXN1bHRbRFJBRlRfU1RBVEVdIGFzIEVTNVN0YXRlKS5zY29wZV8gPT09IHNjb3BlXG5cdFx0KSB7XG5cdFx0XHRtYXJrQ2hhbmdlc1N3ZWVwKHNjb3BlLmRyYWZ0c18pXG5cdFx0fVxuXHR9XG5cblx0ZnVuY3Rpb24gY3JlYXRlRVM1RHJhZnQoaXNBcnJheTogYm9vbGVhbiwgYmFzZTogYW55KSB7XG5cdFx0aWYgKGlzQXJyYXkpIHtcblx0XHRcdGNvbnN0IGRyYWZ0ID0gbmV3IEFycmF5KGJhc2UubGVuZ3RoKVxuXHRcdFx0Zm9yIChsZXQgaSA9IDA7IGkgPCBiYXNlLmxlbmd0aDsgaSsrKVxuXHRcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZHJhZnQsIFwiXCIgKyBpLCBwcm94eVByb3BlcnR5KGksIHRydWUpKVxuXHRcdFx0cmV0dXJuIGRyYWZ0XG5cdFx0fSBlbHNlIHtcblx0XHRcdGNvbnN0IGRlc2NyaXB0b3JzID0gZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9ycyhiYXNlKVxuXHRcdFx0ZGVsZXRlIGRlc2NyaXB0b3JzW0RSQUZUX1NUQVRFIGFzIGFueV1cblx0XHRcdGNvbnN0IGtleXMgPSBvd25LZXlzKGRlc2NyaXB0b3JzKVxuXHRcdFx0Zm9yIChsZXQgaSA9IDA7IGkgPCBrZXlzLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHRcdGNvbnN0IGtleTogYW55ID0ga2V5c1tpXVxuXHRcdFx0XHRkZXNjcmlwdG9yc1trZXldID0gcHJveHlQcm9wZXJ0eShcblx0XHRcdFx0XHRrZXksXG5cdFx0XHRcdFx0aXNBcnJheSB8fCAhIWRlc2NyaXB0b3JzW2tleV0uZW51bWVyYWJsZVxuXHRcdFx0XHQpXG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gT2JqZWN0LmNyZWF0ZShPYmplY3QuZ2V0UHJvdG90eXBlT2YoYmFzZSksIGRlc2NyaXB0b3JzKVxuXHRcdH1cblx0fVxuXG5cdGZ1bmN0aW9uIGNyZWF0ZUVTNVByb3h5XzxUPihcblx0XHRiYXNlOiBULFxuXHRcdHBhcmVudD86IEltbWVyU3RhdGVcblx0KTogRHJhZnRlZDxULCBFUzVPYmplY3RTdGF0ZSB8IEVTNUFycmF5U3RhdGU+IHtcblx0XHRjb25zdCBpc0FycmF5ID0gQXJyYXkuaXNBcnJheShiYXNlKVxuXHRcdGNvbnN0IGRyYWZ0ID0gY3JlYXRlRVM1RHJhZnQoaXNBcnJheSwgYmFzZSlcblxuXHRcdGNvbnN0IHN0YXRlOiBFUzVPYmplY3RTdGF0ZSB8IEVTNUFycmF5U3RhdGUgPSB7XG5cdFx0XHR0eXBlXzogaXNBcnJheSA/IFByb3h5VHlwZS5FUzVBcnJheSA6IChQcm94eVR5cGUuRVM1T2JqZWN0IGFzIGFueSksXG5cdFx0XHRzY29wZV86IHBhcmVudCA/IHBhcmVudC5zY29wZV8gOiBnZXRDdXJyZW50U2NvcGUoKSxcblx0XHRcdG1vZGlmaWVkXzogZmFsc2UsXG5cdFx0XHRmaW5hbGl6ZWRfOiBmYWxzZSxcblx0XHRcdGFzc2lnbmVkXzoge30sXG5cdFx0XHRwYXJlbnRfOiBwYXJlbnQsXG5cdFx0XHQvLyBiYXNlIGlzIHRoZSBvYmplY3Qgd2UgYXJlIGRyYWZ0aW5nXG5cdFx0XHRiYXNlXzogYmFzZSxcblx0XHRcdC8vIGRyYWZ0IGlzIHRoZSBkcmFmdCBvYmplY3QgaXRzZWxmLCB0aGF0IHRyYXBzIGFsbCByZWFkcyBhbmQgcmVhZHMgZnJvbSBlaXRoZXIgdGhlIGJhc2UgKGlmIHVubW9kaWZpZWQpIG9yIGNvcHkgKGlmIG1vZGlmaWVkKVxuXHRcdFx0ZHJhZnRfOiBkcmFmdCxcblx0XHRcdGNvcHlfOiBudWxsLFxuXHRcdFx0cmV2b2tlZF86IGZhbHNlLFxuXHRcdFx0aXNNYW51YWxfOiBmYWxzZVxuXHRcdH1cblxuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShkcmFmdCwgRFJBRlRfU1RBVEUsIHtcblx0XHRcdHZhbHVlOiBzdGF0ZSxcblx0XHRcdC8vIGVudW1lcmFibGU6IGZhbHNlIDwtIHRoZSBkZWZhdWx0XG5cdFx0XHR3cml0YWJsZTogdHJ1ZVxuXHRcdH0pXG5cdFx0cmV0dXJuIGRyYWZ0XG5cdH1cblxuXHQvLyBwcm9wZXJ0eSBkZXNjcmlwdG9ycyBhcmUgcmVjeWNsZWQgdG8gbWFrZSBzdXJlIHdlIGRvbid0IGNyZWF0ZSBhIGdldCBhbmQgc2V0IGNsb3N1cmUgcGVyIHByb3BlcnR5LFxuXHQvLyBidXQgc2hhcmUgdGhlbSBhbGwgaW5zdGVhZFxuXHRjb25zdCBkZXNjcmlwdG9yczoge1twcm9wOiBzdHJpbmddOiBQcm9wZXJ0eURlc2NyaXB0b3J9ID0ge31cblxuXHRmdW5jdGlvbiBwcm94eVByb3BlcnR5KFxuXHRcdHByb3A6IHN0cmluZyB8IG51bWJlcixcblx0XHRlbnVtZXJhYmxlOiBib29sZWFuXG5cdCk6IFByb3BlcnR5RGVzY3JpcHRvciB7XG5cdFx0bGV0IGRlc2MgPSBkZXNjcmlwdG9yc1twcm9wXVxuXHRcdGlmIChkZXNjKSB7XG5cdFx0XHRkZXNjLmVudW1lcmFibGUgPSBlbnVtZXJhYmxlXG5cdFx0fSBlbHNlIHtcblx0XHRcdGRlc2NyaXB0b3JzW3Byb3BdID0gZGVzYyA9IHtcblx0XHRcdFx0Y29uZmlndXJhYmxlOiB0cnVlLFxuXHRcdFx0XHRlbnVtZXJhYmxlLFxuXHRcdFx0XHRnZXQodGhpczogYW55KSB7XG5cdFx0XHRcdFx0Y29uc3Qgc3RhdGUgPSB0aGlzW0RSQUZUX1NUQVRFXVxuXHRcdFx0XHRcdGlmIChfX0RFVl9fKSBhc3NlcnRVbnJldm9rZWQoc3RhdGUpXG5cdFx0XHRcdFx0Ly8gQHRzLWlnbm9yZVxuXHRcdFx0XHRcdHJldHVybiBvYmplY3RUcmFwcy5nZXQoc3RhdGUsIHByb3ApXG5cdFx0XHRcdH0sXG5cdFx0XHRcdHNldCh0aGlzOiBhbnksIHZhbHVlKSB7XG5cdFx0XHRcdFx0Y29uc3Qgc3RhdGUgPSB0aGlzW0RSQUZUX1NUQVRFXVxuXHRcdFx0XHRcdGlmIChfX0RFVl9fKSBhc3NlcnRVbnJldm9rZWQoc3RhdGUpXG5cdFx0XHRcdFx0Ly8gQHRzLWlnbm9yZVxuXHRcdFx0XHRcdG9iamVjdFRyYXBzLnNldChzdGF0ZSwgcHJvcCwgdmFsdWUpXG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9XG5cdFx0cmV0dXJuIGRlc2Ncblx0fVxuXG5cdC8vIFRoaXMgbG9va3MgZXhwZW5zaXZlLCBidXQgb25seSBwcm94aWVzIGFyZSB2aXNpdGVkLCBhbmQgb25seSBvYmplY3RzIHdpdGhvdXQga25vd24gY2hhbmdlcyBhcmUgc2Nhbm5lZC5cblx0ZnVuY3Rpb24gbWFya0NoYW5nZXNTd2VlcChkcmFmdHM6IERyYWZ0ZWQ8YW55LCBJbW1lclN0YXRlPltdKSB7XG5cdFx0Ly8gVGhlIG5hdHVyYWwgb3JkZXIgb2YgZHJhZnRzIGluIHRoZSBgc2NvcGVgIGFycmF5IGlzIGJhc2VkIG9uIHdoZW4gdGhleVxuXHRcdC8vIHdlcmUgYWNjZXNzZWQuIEJ5IHByb2Nlc3NpbmcgZHJhZnRzIGluIHJldmVyc2UgbmF0dXJhbCBvcmRlciwgd2UgaGF2ZSBhXG5cdFx0Ly8gYmV0dGVyIGNoYW5jZSBvZiBwcm9jZXNzaW5nIGxlYWYgbm9kZXMgZmlyc3QuIFdoZW4gYSBsZWFmIG5vZGUgaXMga25vd24gdG9cblx0XHQvLyBoYXZlIGNoYW5nZWQsIHdlIGNhbiBhdm9pZCBhbnkgdHJhdmVyc2FsIG9mIGl0cyBhbmNlc3RvciBub2Rlcy5cblx0XHRmb3IgKGxldCBpID0gZHJhZnRzLmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKSB7XG5cdFx0XHRjb25zdCBzdGF0ZTogRVM1U3RhdGUgPSBkcmFmdHNbaV1bRFJBRlRfU1RBVEVdXG5cdFx0XHRpZiAoIXN0YXRlLm1vZGlmaWVkXykge1xuXHRcdFx0XHRzd2l0Y2ggKHN0YXRlLnR5cGVfKSB7XG5cdFx0XHRcdFx0Y2FzZSBQcm94eVR5cGUuRVM1QXJyYXk6XG5cdFx0XHRcdFx0XHRpZiAoaGFzQXJyYXlDaGFuZ2VzKHN0YXRlKSkgbWFya0NoYW5nZWQoc3RhdGUpXG5cdFx0XHRcdFx0XHRicmVha1xuXHRcdFx0XHRcdGNhc2UgUHJveHlUeXBlLkVTNU9iamVjdDpcblx0XHRcdFx0XHRcdGlmIChoYXNPYmplY3RDaGFuZ2VzKHN0YXRlKSkgbWFya0NoYW5nZWQoc3RhdGUpXG5cdFx0XHRcdFx0XHRicmVha1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fVxuXHR9XG5cblx0ZnVuY3Rpb24gbWFya0NoYW5nZXNSZWN1cnNpdmVseShvYmplY3Q6IGFueSkge1xuXHRcdGlmICghb2JqZWN0IHx8IHR5cGVvZiBvYmplY3QgIT09IFwib2JqZWN0XCIpIHJldHVyblxuXHRcdGNvbnN0IHN0YXRlOiBFUzVTdGF0ZSB8IHVuZGVmaW5lZCA9IG9iamVjdFtEUkFGVF9TVEFURV1cblx0XHRpZiAoIXN0YXRlKSByZXR1cm5cblx0XHRjb25zdCB7YmFzZV8sIGRyYWZ0XywgYXNzaWduZWRfLCB0eXBlX30gPSBzdGF0ZVxuXHRcdGlmICh0eXBlXyA9PT0gUHJveHlUeXBlLkVTNU9iamVjdCkge1xuXHRcdFx0Ly8gTG9vayBmb3IgYWRkZWQga2V5cy5cblx0XHRcdC8vIHByb2JhYmx5IHRoZXJlIGlzIGEgZmFzdGVyIHdheSB0byBkZXRlY3QgY2hhbmdlcywgYXMgc3dlZXAgKyByZWN1cnNlIHNlZW1zIHRvIGRvIHNvbWVcblx0XHRcdC8vIHVubmVjZXNzYXJ5IHdvcmsuXG5cdFx0XHQvLyBhbHNvOiBwcm9iYWJseSB3ZSBjYW4gc3RvcmUgdGhlIGluZm9ybWF0aW9uIHdlIGRldGVjdCBoZXJlLCB0byBzcGVlZCB1cCB0cmVlIGZpbmFsaXphdGlvbiFcblx0XHRcdGVhY2goZHJhZnRfLCBrZXkgPT4ge1xuXHRcdFx0XHRpZiAoKGtleSBhcyBhbnkpID09PSBEUkFGVF9TVEFURSkgcmV0dXJuXG5cdFx0XHRcdC8vIFRoZSBgdW5kZWZpbmVkYCBjaGVjayBpcyBhIGZhc3QgcGF0aCBmb3IgcHJlLWV4aXN0aW5nIGtleXMuXG5cdFx0XHRcdGlmICgoYmFzZV8gYXMgYW55KVtrZXldID09PSB1bmRlZmluZWQgJiYgIWhhcyhiYXNlXywga2V5KSkge1xuXHRcdFx0XHRcdGFzc2lnbmVkX1trZXldID0gdHJ1ZVxuXHRcdFx0XHRcdG1hcmtDaGFuZ2VkKHN0YXRlKVxuXHRcdFx0XHR9IGVsc2UgaWYgKCFhc3NpZ25lZF9ba2V5XSkge1xuXHRcdFx0XHRcdC8vIE9ubHkgdW50b3VjaGVkIHByb3BlcnRpZXMgdHJpZ2dlciByZWN1cnNpb24uXG5cdFx0XHRcdFx0bWFya0NoYW5nZXNSZWN1cnNpdmVseShkcmFmdF9ba2V5XSlcblx0XHRcdFx0fVxuXHRcdFx0fSlcblx0XHRcdC8vIExvb2sgZm9yIHJlbW92ZWQga2V5cy5cblx0XHRcdGVhY2goYmFzZV8sIGtleSA9PiB7XG5cdFx0XHRcdC8vIFRoZSBgdW5kZWZpbmVkYCBjaGVjayBpcyBhIGZhc3QgcGF0aCBmb3IgcHJlLWV4aXN0aW5nIGtleXMuXG5cdFx0XHRcdGlmIChkcmFmdF9ba2V5XSA9PT0gdW5kZWZpbmVkICYmICFoYXMoZHJhZnRfLCBrZXkpKSB7XG5cdFx0XHRcdFx0YXNzaWduZWRfW2tleV0gPSBmYWxzZVxuXHRcdFx0XHRcdG1hcmtDaGFuZ2VkKHN0YXRlKVxuXHRcdFx0XHR9XG5cdFx0XHR9KVxuXHRcdH0gZWxzZSBpZiAodHlwZV8gPT09IFByb3h5VHlwZS5FUzVBcnJheSkge1xuXHRcdFx0aWYgKGhhc0FycmF5Q2hhbmdlcyhzdGF0ZSBhcyBFUzVBcnJheVN0YXRlKSkge1xuXHRcdFx0XHRtYXJrQ2hhbmdlZChzdGF0ZSlcblx0XHRcdFx0YXNzaWduZWRfLmxlbmd0aCA9IHRydWVcblx0XHRcdH1cblxuXHRcdFx0aWYgKGRyYWZ0Xy5sZW5ndGggPCBiYXNlXy5sZW5ndGgpIHtcblx0XHRcdFx0Zm9yIChsZXQgaSA9IGRyYWZ0Xy5sZW5ndGg7IGkgPCBiYXNlXy5sZW5ndGg7IGkrKykgYXNzaWduZWRfW2ldID0gZmFsc2Vcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdGZvciAobGV0IGkgPSBiYXNlXy5sZW5ndGg7IGkgPCBkcmFmdF8ubGVuZ3RoOyBpKyspIGFzc2lnbmVkX1tpXSA9IHRydWVcblx0XHRcdH1cblxuXHRcdFx0Ly8gTWluaW11bSBjb3VudCBpcyBlbm91Z2gsIHRoZSBvdGhlciBwYXJ0cyBoYXMgYmVlbiBwcm9jZXNzZWQuXG5cdFx0XHRjb25zdCBtaW4gPSBNYXRoLm1pbihkcmFmdF8ubGVuZ3RoLCBiYXNlXy5sZW5ndGgpXG5cblx0XHRcdGZvciAobGV0IGkgPSAwOyBpIDwgbWluOyBpKyspIHtcblx0XHRcdFx0Ly8gT25seSB1bnRvdWNoZWQgaW5kaWNlcyB0cmlnZ2VyIHJlY3Vyc2lvbi5cblx0XHRcdFx0aWYgKCFkcmFmdF8uaGFzT3duUHJvcGVydHkoaSkpIHtcblx0XHRcdFx0XHRhc3NpZ25lZF9baV0gPSB0cnVlXG5cdFx0XHRcdH1cblx0XHRcdFx0aWYgKGFzc2lnbmVkX1tpXSA9PT0gdW5kZWZpbmVkKSBtYXJrQ2hhbmdlc1JlY3Vyc2l2ZWx5KGRyYWZ0X1tpXSlcblx0XHRcdH1cblx0XHR9XG5cdH1cblxuXHRmdW5jdGlvbiBoYXNPYmplY3RDaGFuZ2VzKHN0YXRlOiBFUzVPYmplY3RTdGF0ZSkge1xuXHRcdGNvbnN0IHtiYXNlXywgZHJhZnRffSA9IHN0YXRlXG5cblx0XHQvLyBTZWFyY2ggZm9yIGFkZGVkIGtleXMgYW5kIGNoYW5nZWQga2V5cy4gU3RhcnQgYXQgdGhlIGJhY2ssIGJlY2F1c2Vcblx0XHQvLyBub24tbnVtZXJpYyBrZXlzIGFyZSBvcmRlcmVkIGJ5IHRpbWUgb2YgZGVmaW5pdGlvbiBvbiB0aGUgb2JqZWN0LlxuXHRcdGNvbnN0IGtleXMgPSBvd25LZXlzKGRyYWZ0Xylcblx0XHRmb3IgKGxldCBpID0ga2V5cy5sZW5ndGggLSAxOyBpID49IDA7IGktLSkge1xuXHRcdFx0Y29uc3Qga2V5OiBhbnkgPSBrZXlzW2ldXG5cdFx0XHRpZiAoa2V5ID09PSBEUkFGVF9TVEFURSkgY29udGludWVcblx0XHRcdGNvbnN0IGJhc2VWYWx1ZSA9IGJhc2VfW2tleV1cblx0XHRcdC8vIFRoZSBgdW5kZWZpbmVkYCBjaGVjayBpcyBhIGZhc3QgcGF0aCBmb3IgcHJlLWV4aXN0aW5nIGtleXMuXG5cdFx0XHRpZiAoYmFzZVZhbHVlID09PSB1bmRlZmluZWQgJiYgIWhhcyhiYXNlXywga2V5KSkge1xuXHRcdFx0XHRyZXR1cm4gdHJ1ZVxuXHRcdFx0fVxuXHRcdFx0Ly8gT25jZSBhIGJhc2Uga2V5IGlzIGRlbGV0ZWQsIGZ1dHVyZSBjaGFuZ2VzIGdvIHVuZGV0ZWN0ZWQsIGJlY2F1c2UgaXRzXG5cdFx0XHQvLyBkZXNjcmlwdG9yIGlzIGVyYXNlZC4gVGhpcyBicmFuY2ggZGV0ZWN0cyBhbnkgbWlzc2VkIGNoYW5nZXMuXG5cdFx0XHRlbHNlIHtcblx0XHRcdFx0Y29uc3QgdmFsdWUgPSBkcmFmdF9ba2V5XVxuXHRcdFx0XHRjb25zdCBzdGF0ZTogSW1tZXJTdGF0ZSA9IHZhbHVlICYmIHZhbHVlW0RSQUZUX1NUQVRFXVxuXHRcdFx0XHRpZiAoc3RhdGUgPyBzdGF0ZS5iYXNlXyAhPT0gYmFzZVZhbHVlIDogIWlzKHZhbHVlLCBiYXNlVmFsdWUpKSB7XG5cdFx0XHRcdFx0cmV0dXJuIHRydWVcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH1cblxuXHRcdC8vIEF0IHRoaXMgcG9pbnQsIG5vIGtleXMgd2VyZSBhZGRlZCBvciBjaGFuZ2VkLlxuXHRcdC8vIENvbXBhcmUga2V5IGNvdW50IHRvIGRldGVybWluZSBpZiBrZXlzIHdlcmUgZGVsZXRlZC5cblx0XHRjb25zdCBiYXNlSXNEcmFmdCA9ICEhYmFzZV9bRFJBRlRfU1RBVEUgYXMgYW55XVxuXHRcdHJldHVybiBrZXlzLmxlbmd0aCAhPT0gb3duS2V5cyhiYXNlXykubGVuZ3RoICsgKGJhc2VJc0RyYWZ0ID8gMCA6IDEpIC8vICsgMSB0byBjb3JyZWN0IGZvciBEUkFGVF9TVEFURVxuXHR9XG5cblx0ZnVuY3Rpb24gaGFzQXJyYXlDaGFuZ2VzKHN0YXRlOiBFUzVBcnJheVN0YXRlKSB7XG5cdFx0Y29uc3Qge2RyYWZ0X30gPSBzdGF0ZVxuXHRcdGlmIChkcmFmdF8ubGVuZ3RoICE9PSBzdGF0ZS5iYXNlXy5sZW5ndGgpIHJldHVybiB0cnVlXG5cdFx0Ly8gU2VlICMxMTZcblx0XHQvLyBJZiB3ZSBmaXJzdCBzaG9ydGVuIHRoZSBsZW5ndGgsIG91ciBhcnJheSBpbnRlcmNlcHRvcnMgd2lsbCBiZSByZW1vdmVkLlxuXHRcdC8vIElmIGFmdGVyIHRoYXQgbmV3IGl0ZW1zIGFyZSBhZGRlZCwgcmVzdWx0IGluIHRoZSBzYW1lIG9yaWdpbmFsIGxlbmd0aCxcblx0XHQvLyB0aG9zZSBsYXN0IGl0ZW1zIHdpbGwgaGF2ZSBubyBpbnRlcmNlcHRpbmcgcHJvcGVydHkuXG5cdFx0Ly8gU28gaWYgdGhlcmUgaXMgbm8gb3duIGRlc2NyaXB0b3Igb24gdGhlIGxhc3QgcG9zaXRpb24sIHdlIGtub3cgdGhhdCBpdGVtcyB3ZXJlIHJlbW92ZWQgYW5kIGFkZGVkXG5cdFx0Ly8gTi5CLjogc3BsaWNlLCB1bnNoaWZ0LCBldGMgb25seSBzaGlmdCB2YWx1ZXMgYXJvdW5kLCBidXQgbm90IHByb3AgZGVzY3JpcHRvcnMsIHNvIHdlIG9ubHkgaGF2ZSB0byBjaGVja1xuXHRcdC8vIHRoZSBsYXN0IG9uZVxuXHRcdC8vIGxhc3QgZGVzY3JpcHRvciBjYW4gYmUgbm90IGEgdHJhcCwgaWYgdGhlIGFycmF5IHdhcyBleHRlbmRlZFxuXHRcdGNvbnN0IGRlc2NyaXB0b3IgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKFxuXHRcdFx0ZHJhZnRfLFxuXHRcdFx0ZHJhZnRfLmxlbmd0aCAtIDFcblx0XHQpXG5cdFx0Ly8gZGVzY3JpcHRvciBjYW4gYmUgbnVsbCwgYnV0IG9ubHkgZm9yIG5ld2x5IGNyZWF0ZWQgc3BhcnNlIGFycmF5cywgZWcuIG5ldyBBcnJheSgxMClcblx0XHRpZiAoZGVzY3JpcHRvciAmJiAhZGVzY3JpcHRvci5nZXQpIHJldHVybiB0cnVlXG5cdFx0Ly8gaWYgd2UgbWlzcyBhIHByb3BlcnR5LCBpdCBoYXMgYmVlbiBkZWxldGVkLCBzbyBhcnJheSBwcm9ib2JhbHkgY2hhbmdlZFxuXHRcdGZvciAobGV0IGkgPSAwOyBpIDwgZHJhZnRfLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHRpZiAoIWRyYWZ0Xy5oYXNPd25Qcm9wZXJ0eShpKSkgcmV0dXJuIHRydWVcblx0XHR9XG5cdFx0Ly8gRm9yIGFsbCBvdGhlciBjYXNlcywgd2UgZG9uJ3QgaGF2ZSB0byBjb21wYXJlLCBhcyB0aGV5IHdvdWxkIGhhdmUgYmVlbiBwaWNrZWQgdXAgYnkgdGhlIGluZGV4IHNldHRlcnNcblx0XHRyZXR1cm4gZmFsc2Vcblx0fVxuXG5cdGZ1bmN0aW9uIGhhc0NoYW5nZXNfKHN0YXRlOiBFUzVTdGF0ZSkge1xuXHRcdHJldHVybiBzdGF0ZS50eXBlXyA9PT0gUHJveHlUeXBlLkVTNU9iamVjdFxuXHRcdFx0PyBoYXNPYmplY3RDaGFuZ2VzKHN0YXRlKVxuXHRcdFx0OiBoYXNBcnJheUNoYW5nZXMoc3RhdGUpXG5cdH1cblxuXHRmdW5jdGlvbiBhc3NlcnRVbnJldm9rZWQoc3RhdGU6IGFueSAvKkVTNVN0YXRlIHwgTWFwU3RhdGUgfCBTZXRTdGF0ZSovKSB7XG5cdFx0aWYgKHN0YXRlLnJldm9rZWRfKSBkaWUoMywgSlNPTi5zdHJpbmdpZnkobGF0ZXN0KHN0YXRlKSkpXG5cdH1cblxuXHRsb2FkUGx1Z2luKFwiRVM1XCIsIHtcblx0XHRjcmVhdGVFUzVQcm94eV8sXG5cdFx0d2lsbEZpbmFsaXplRVM1Xyxcblx0XHRoYXNDaGFuZ2VzX1xuXHR9KVxufVxuIiwgImltcG9ydCB7aW1tZXJhYmxlfSBmcm9tIFwiLi4vaW1tZXJcIlxuaW1wb3J0IHtcblx0SW1tZXJTdGF0ZSxcblx0UGF0Y2gsXG5cdFNldFN0YXRlLFxuXHRFUzVBcnJheVN0YXRlLFxuXHRQcm94eUFycmF5U3RhdGUsXG5cdE1hcFN0YXRlLFxuXHRFUzVPYmplY3RTdGF0ZSxcblx0UHJveHlPYmplY3RTdGF0ZSxcblx0UGF0Y2hQYXRoLFxuXHRnZXQsXG5cdGVhY2gsXG5cdGhhcyxcblx0Z2V0QXJjaHR5cGUsXG5cdGlzU2V0LFxuXHRpc01hcCxcblx0bG9hZFBsdWdpbixcblx0UHJveHlUeXBlLFxuXHRBcmNodHlwZSxcblx0ZGllLFxuXHRpc0RyYWZ0LFxuXHRpc0RyYWZ0YWJsZSxcblx0Tk9USElOR1xufSBmcm9tIFwiLi4vaW50ZXJuYWxcIlxuXG5leHBvcnQgZnVuY3Rpb24gZW5hYmxlUGF0Y2hlcygpIHtcblx0Y29uc3QgUkVQTEFDRSA9IFwicmVwbGFjZVwiXG5cdGNvbnN0IEFERCA9IFwiYWRkXCJcblx0Y29uc3QgUkVNT1ZFID0gXCJyZW1vdmVcIlxuXG5cdGZ1bmN0aW9uIGdlbmVyYXRlUGF0Y2hlc18oXG5cdFx0c3RhdGU6IEltbWVyU3RhdGUsXG5cdFx0YmFzZVBhdGg6IFBhdGNoUGF0aCxcblx0XHRwYXRjaGVzOiBQYXRjaFtdLFxuXHRcdGludmVyc2VQYXRjaGVzOiBQYXRjaFtdXG5cdCk6IHZvaWQge1xuXHRcdHN3aXRjaCAoc3RhdGUudHlwZV8pIHtcblx0XHRcdGNhc2UgUHJveHlUeXBlLlByb3h5T2JqZWN0OlxuXHRcdFx0Y2FzZSBQcm94eVR5cGUuRVM1T2JqZWN0OlxuXHRcdFx0Y2FzZSBQcm94eVR5cGUuTWFwOlxuXHRcdFx0XHRyZXR1cm4gZ2VuZXJhdGVQYXRjaGVzRnJvbUFzc2lnbmVkKFxuXHRcdFx0XHRcdHN0YXRlLFxuXHRcdFx0XHRcdGJhc2VQYXRoLFxuXHRcdFx0XHRcdHBhdGNoZXMsXG5cdFx0XHRcdFx0aW52ZXJzZVBhdGNoZXNcblx0XHRcdFx0KVxuXHRcdFx0Y2FzZSBQcm94eVR5cGUuRVM1QXJyYXk6XG5cdFx0XHRjYXNlIFByb3h5VHlwZS5Qcm94eUFycmF5OlxuXHRcdFx0XHRyZXR1cm4gZ2VuZXJhdGVBcnJheVBhdGNoZXMoc3RhdGUsIGJhc2VQYXRoLCBwYXRjaGVzLCBpbnZlcnNlUGF0Y2hlcylcblx0XHRcdGNhc2UgUHJveHlUeXBlLlNldDpcblx0XHRcdFx0cmV0dXJuIGdlbmVyYXRlU2V0UGF0Y2hlcyhcblx0XHRcdFx0XHQoc3RhdGUgYXMgYW55KSBhcyBTZXRTdGF0ZSxcblx0XHRcdFx0XHRiYXNlUGF0aCxcblx0XHRcdFx0XHRwYXRjaGVzLFxuXHRcdFx0XHRcdGludmVyc2VQYXRjaGVzXG5cdFx0XHRcdClcblx0XHR9XG5cdH1cblxuXHRmdW5jdGlvbiBnZW5lcmF0ZUFycmF5UGF0Y2hlcyhcblx0XHRzdGF0ZTogRVM1QXJyYXlTdGF0ZSB8IFByb3h5QXJyYXlTdGF0ZSxcblx0XHRiYXNlUGF0aDogUGF0Y2hQYXRoLFxuXHRcdHBhdGNoZXM6IFBhdGNoW10sXG5cdFx0aW52ZXJzZVBhdGNoZXM6IFBhdGNoW11cblx0KSB7XG5cdFx0bGV0IHtiYXNlXywgYXNzaWduZWRffSA9IHN0YXRlXG5cdFx0bGV0IGNvcHlfID0gc3RhdGUuY29weV8hXG5cblx0XHQvLyBSZWR1Y2UgY29tcGxleGl0eSBieSBlbnN1cmluZyBgYmFzZWAgaXMgbmV2ZXIgbG9uZ2VyLlxuXHRcdGlmIChjb3B5Xy5sZW5ndGggPCBiYXNlXy5sZW5ndGgpIHtcblx0XHRcdC8vIEB0cy1pZ25vcmVcblx0XHRcdDtbYmFzZV8sIGNvcHlfXSA9IFtjb3B5XywgYmFzZV9dXG5cdFx0XHQ7W3BhdGNoZXMsIGludmVyc2VQYXRjaGVzXSA9IFtpbnZlcnNlUGF0Y2hlcywgcGF0Y2hlc11cblx0XHR9XG5cblx0XHQvLyBQcm9jZXNzIHJlcGxhY2VkIGluZGljZXMuXG5cdFx0Zm9yIChsZXQgaSA9IDA7IGkgPCBiYXNlXy5sZW5ndGg7IGkrKykge1xuXHRcdFx0aWYgKGFzc2lnbmVkX1tpXSAmJiBjb3B5X1tpXSAhPT0gYmFzZV9baV0pIHtcblx0XHRcdFx0Y29uc3QgcGF0aCA9IGJhc2VQYXRoLmNvbmNhdChbaV0pXG5cdFx0XHRcdHBhdGNoZXMucHVzaCh7XG5cdFx0XHRcdFx0b3A6IFJFUExBQ0UsXG5cdFx0XHRcdFx0cGF0aCxcblx0XHRcdFx0XHQvLyBOZWVkIHRvIG1heWJlIGNsb25lIGl0LCBhcyBpdCBjYW4gaW4gZmFjdCBiZSB0aGUgb3JpZ2luYWwgdmFsdWVcblx0XHRcdFx0XHQvLyBkdWUgdG8gdGhlIGJhc2UvY29weSBpbnZlcnNpb24gYXQgdGhlIHN0YXJ0IG9mIHRoaXMgZnVuY3Rpb25cblx0XHRcdFx0XHR2YWx1ZTogY2xvbmVQYXRjaFZhbHVlSWZOZWVkZWQoY29weV9baV0pXG5cdFx0XHRcdH0pXG5cdFx0XHRcdGludmVyc2VQYXRjaGVzLnB1c2goe1xuXHRcdFx0XHRcdG9wOiBSRVBMQUNFLFxuXHRcdFx0XHRcdHBhdGgsXG5cdFx0XHRcdFx0dmFsdWU6IGNsb25lUGF0Y2hWYWx1ZUlmTmVlZGVkKGJhc2VfW2ldKVxuXHRcdFx0XHR9KVxuXHRcdFx0fVxuXHRcdH1cblxuXHRcdC8vIFByb2Nlc3MgYWRkZWQgaW5kaWNlcy5cblx0XHRmb3IgKGxldCBpID0gYmFzZV8ubGVuZ3RoOyBpIDwgY29weV8ubGVuZ3RoOyBpKyspIHtcblx0XHRcdGNvbnN0IHBhdGggPSBiYXNlUGF0aC5jb25jYXQoW2ldKVxuXHRcdFx0cGF0Y2hlcy5wdXNoKHtcblx0XHRcdFx0b3A6IEFERCxcblx0XHRcdFx0cGF0aCxcblx0XHRcdFx0Ly8gTmVlZCB0byBtYXliZSBjbG9uZSBpdCwgYXMgaXQgY2FuIGluIGZhY3QgYmUgdGhlIG9yaWdpbmFsIHZhbHVlXG5cdFx0XHRcdC8vIGR1ZSB0byB0aGUgYmFzZS9jb3B5IGludmVyc2lvbiBhdCB0aGUgc3RhcnQgb2YgdGhpcyBmdW5jdGlvblxuXHRcdFx0XHR2YWx1ZTogY2xvbmVQYXRjaFZhbHVlSWZOZWVkZWQoY29weV9baV0pXG5cdFx0XHR9KVxuXHRcdH1cblx0XHRpZiAoYmFzZV8ubGVuZ3RoIDwgY29weV8ubGVuZ3RoKSB7XG5cdFx0XHRpbnZlcnNlUGF0Y2hlcy5wdXNoKHtcblx0XHRcdFx0b3A6IFJFUExBQ0UsXG5cdFx0XHRcdHBhdGg6IGJhc2VQYXRoLmNvbmNhdChbXCJsZW5ndGhcIl0pLFxuXHRcdFx0XHR2YWx1ZTogYmFzZV8ubGVuZ3RoXG5cdFx0XHR9KVxuXHRcdH1cblx0fVxuXG5cdC8vIFRoaXMgaXMgdXNlZCBmb3IgYm90aCBNYXAgb2JqZWN0cyBhbmQgbm9ybWFsIG9iamVjdHMuXG5cdGZ1bmN0aW9uIGdlbmVyYXRlUGF0Y2hlc0Zyb21Bc3NpZ25lZChcblx0XHRzdGF0ZTogTWFwU3RhdGUgfCBFUzVPYmplY3RTdGF0ZSB8IFByb3h5T2JqZWN0U3RhdGUsXG5cdFx0YmFzZVBhdGg6IFBhdGNoUGF0aCxcblx0XHRwYXRjaGVzOiBQYXRjaFtdLFxuXHRcdGludmVyc2VQYXRjaGVzOiBQYXRjaFtdXG5cdCkge1xuXHRcdGNvbnN0IHtiYXNlXywgY29weV99ID0gc3RhdGVcblx0XHRlYWNoKHN0YXRlLmFzc2lnbmVkXyEsIChrZXksIGFzc2lnbmVkVmFsdWUpID0+IHtcblx0XHRcdGNvbnN0IG9yaWdWYWx1ZSA9IGdldChiYXNlXywga2V5KVxuXHRcdFx0Y29uc3QgdmFsdWUgPSBnZXQoY29weV8hLCBrZXkpXG5cdFx0XHRjb25zdCBvcCA9ICFhc3NpZ25lZFZhbHVlID8gUkVNT1ZFIDogaGFzKGJhc2VfLCBrZXkpID8gUkVQTEFDRSA6IEFERFxuXHRcdFx0aWYgKG9yaWdWYWx1ZSA9PT0gdmFsdWUgJiYgb3AgPT09IFJFUExBQ0UpIHJldHVyblxuXHRcdFx0Y29uc3QgcGF0aCA9IGJhc2VQYXRoLmNvbmNhdChrZXkgYXMgYW55KVxuXHRcdFx0cGF0Y2hlcy5wdXNoKG9wID09PSBSRU1PVkUgPyB7b3AsIHBhdGh9IDoge29wLCBwYXRoLCB2YWx1ZX0pXG5cdFx0XHRpbnZlcnNlUGF0Y2hlcy5wdXNoKFxuXHRcdFx0XHRvcCA9PT0gQUREXG5cdFx0XHRcdFx0PyB7b3A6IFJFTU9WRSwgcGF0aH1cblx0XHRcdFx0XHQ6IG9wID09PSBSRU1PVkVcblx0XHRcdFx0XHQ/IHtvcDogQURELCBwYXRoLCB2YWx1ZTogY2xvbmVQYXRjaFZhbHVlSWZOZWVkZWQob3JpZ1ZhbHVlKX1cblx0XHRcdFx0XHQ6IHtvcDogUkVQTEFDRSwgcGF0aCwgdmFsdWU6IGNsb25lUGF0Y2hWYWx1ZUlmTmVlZGVkKG9yaWdWYWx1ZSl9XG5cdFx0XHQpXG5cdFx0fSlcblx0fVxuXG5cdGZ1bmN0aW9uIGdlbmVyYXRlU2V0UGF0Y2hlcyhcblx0XHRzdGF0ZTogU2V0U3RhdGUsXG5cdFx0YmFzZVBhdGg6IFBhdGNoUGF0aCxcblx0XHRwYXRjaGVzOiBQYXRjaFtdLFxuXHRcdGludmVyc2VQYXRjaGVzOiBQYXRjaFtdXG5cdCkge1xuXHRcdGxldCB7YmFzZV8sIGNvcHlffSA9IHN0YXRlXG5cblx0XHRsZXQgaSA9IDBcblx0XHRiYXNlXy5mb3JFYWNoKCh2YWx1ZTogYW55KSA9PiB7XG5cdFx0XHRpZiAoIWNvcHlfIS5oYXModmFsdWUpKSB7XG5cdFx0XHRcdGNvbnN0IHBhdGggPSBiYXNlUGF0aC5jb25jYXQoW2ldKVxuXHRcdFx0XHRwYXRjaGVzLnB1c2goe1xuXHRcdFx0XHRcdG9wOiBSRU1PVkUsXG5cdFx0XHRcdFx0cGF0aCxcblx0XHRcdFx0XHR2YWx1ZVxuXHRcdFx0XHR9KVxuXHRcdFx0XHRpbnZlcnNlUGF0Y2hlcy51bnNoaWZ0KHtcblx0XHRcdFx0XHRvcDogQURELFxuXHRcdFx0XHRcdHBhdGgsXG5cdFx0XHRcdFx0dmFsdWVcblx0XHRcdFx0fSlcblx0XHRcdH1cblx0XHRcdGkrK1xuXHRcdH0pXG5cdFx0aSA9IDBcblx0XHRjb3B5XyEuZm9yRWFjaCgodmFsdWU6IGFueSkgPT4ge1xuXHRcdFx0aWYgKCFiYXNlXy5oYXModmFsdWUpKSB7XG5cdFx0XHRcdGNvbnN0IHBhdGggPSBiYXNlUGF0aC5jb25jYXQoW2ldKVxuXHRcdFx0XHRwYXRjaGVzLnB1c2goe1xuXHRcdFx0XHRcdG9wOiBBREQsXG5cdFx0XHRcdFx0cGF0aCxcblx0XHRcdFx0XHR2YWx1ZVxuXHRcdFx0XHR9KVxuXHRcdFx0XHRpbnZlcnNlUGF0Y2hlcy51bnNoaWZ0KHtcblx0XHRcdFx0XHRvcDogUkVNT1ZFLFxuXHRcdFx0XHRcdHBhdGgsXG5cdFx0XHRcdFx0dmFsdWVcblx0XHRcdFx0fSlcblx0XHRcdH1cblx0XHRcdGkrK1xuXHRcdH0pXG5cdH1cblxuXHRmdW5jdGlvbiBnZW5lcmF0ZVJlcGxhY2VtZW50UGF0Y2hlc18oXG5cdFx0YmFzZVZhbHVlOiBhbnksXG5cdFx0cmVwbGFjZW1lbnQ6IGFueSxcblx0XHRwYXRjaGVzOiBQYXRjaFtdLFxuXHRcdGludmVyc2VQYXRjaGVzOiBQYXRjaFtdXG5cdCk6IHZvaWQge1xuXHRcdHBhdGNoZXMucHVzaCh7XG5cdFx0XHRvcDogUkVQTEFDRSxcblx0XHRcdHBhdGg6IFtdLFxuXHRcdFx0dmFsdWU6IHJlcGxhY2VtZW50ID09PSBOT1RISU5HID8gdW5kZWZpbmVkIDogcmVwbGFjZW1lbnRcblx0XHR9KVxuXHRcdGludmVyc2VQYXRjaGVzLnB1c2goe1xuXHRcdFx0b3A6IFJFUExBQ0UsXG5cdFx0XHRwYXRoOiBbXSxcblx0XHRcdHZhbHVlOiBiYXNlVmFsdWVcblx0XHR9KVxuXHR9XG5cblx0ZnVuY3Rpb24gYXBwbHlQYXRjaGVzXzxUPihkcmFmdDogVCwgcGF0Y2hlczogUGF0Y2hbXSk6IFQge1xuXHRcdHBhdGNoZXMuZm9yRWFjaChwYXRjaCA9PiB7XG5cdFx0XHRjb25zdCB7cGF0aCwgb3B9ID0gcGF0Y2hcblxuXHRcdFx0bGV0IGJhc2U6IGFueSA9IGRyYWZ0XG5cdFx0XHRmb3IgKGxldCBpID0gMDsgaSA8IHBhdGgubGVuZ3RoIC0gMTsgaSsrKSB7XG5cdFx0XHRcdGNvbnN0IHBhcmVudFR5cGUgPSBnZXRBcmNodHlwZShiYXNlKVxuXHRcdFx0XHRjb25zdCBwID0gXCJcIiArIHBhdGhbaV1cblx0XHRcdFx0Ly8gU2VlICM3MzgsIGF2b2lkIHByb3RvdHlwZSBwb2xsdXRpb25cblx0XHRcdFx0aWYgKFxuXHRcdFx0XHRcdChwYXJlbnRUeXBlID09PSBBcmNodHlwZS5PYmplY3QgfHwgcGFyZW50VHlwZSA9PT0gQXJjaHR5cGUuQXJyYXkpICYmXG5cdFx0XHRcdFx0KHAgPT09IFwiX19wcm90b19fXCIgfHwgcCA9PT0gXCJjb25zdHJ1Y3RvclwiKVxuXHRcdFx0XHQpXG5cdFx0XHRcdFx0ZGllKDI0KVxuXHRcdFx0XHRpZiAodHlwZW9mIGJhc2UgPT09IFwiZnVuY3Rpb25cIiAmJiBwID09PSBcInByb3RvdHlwZVwiKSBkaWUoMjQpXG5cdFx0XHRcdGJhc2UgPSBnZXQoYmFzZSwgcClcblx0XHRcdFx0aWYgKHR5cGVvZiBiYXNlICE9PSBcIm9iamVjdFwiKSBkaWUoMTUsIHBhdGguam9pbihcIi9cIikpXG5cdFx0XHR9XG5cblx0XHRcdGNvbnN0IHR5cGUgPSBnZXRBcmNodHlwZShiYXNlKVxuXHRcdFx0Y29uc3QgdmFsdWUgPSBkZWVwQ2xvbmVQYXRjaFZhbHVlKHBhdGNoLnZhbHVlKSAvLyB1c2VkIHRvIGNsb25lIHBhdGNoIHRvIGVuc3VyZSBvcmlnaW5hbCBwYXRjaCBpcyBub3QgbW9kaWZpZWQsIHNlZSAjNDExXG5cdFx0XHRjb25zdCBrZXkgPSBwYXRoW3BhdGgubGVuZ3RoIC0gMV1cblx0XHRcdHN3aXRjaCAob3ApIHtcblx0XHRcdFx0Y2FzZSBSRVBMQUNFOlxuXHRcdFx0XHRcdHN3aXRjaCAodHlwZSkge1xuXHRcdFx0XHRcdFx0Y2FzZSBBcmNodHlwZS5NYXA6XG5cdFx0XHRcdFx0XHRcdHJldHVybiBiYXNlLnNldChrZXksIHZhbHVlKVxuXHRcdFx0XHRcdFx0LyogaXN0YW5idWwgaWdub3JlIG5leHQgKi9cblx0XHRcdFx0XHRcdGNhc2UgQXJjaHR5cGUuU2V0OlxuXHRcdFx0XHRcdFx0XHRkaWUoMTYpXG5cdFx0XHRcdFx0XHRkZWZhdWx0OlxuXHRcdFx0XHRcdFx0XHQvLyBpZiB2YWx1ZSBpcyBhbiBvYmplY3QsIHRoZW4gaXQncyBhc3NpZ25lZCBieSByZWZlcmVuY2Vcblx0XHRcdFx0XHRcdFx0Ly8gaW4gdGhlIGZvbGxvd2luZyBhZGQgb3IgcmVtb3ZlIG9wcywgdGhlIHZhbHVlIGZpZWxkIGluc2lkZSB0aGUgcGF0Y2ggd2lsbCBhbHNvIGJlIG1vZGlmeWVkXG5cdFx0XHRcdFx0XHRcdC8vIHNvIHdlIHVzZSB2YWx1ZSBmcm9tIHRoZSBjbG9uZWQgcGF0Y2hcblx0XHRcdFx0XHRcdFx0Ly8gQHRzLWlnbm9yZVxuXHRcdFx0XHRcdFx0XHRyZXR1cm4gKGJhc2Vba2V5XSA9IHZhbHVlKVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0Y2FzZSBBREQ6XG5cdFx0XHRcdFx0c3dpdGNoICh0eXBlKSB7XG5cdFx0XHRcdFx0XHRjYXNlIEFyY2h0eXBlLkFycmF5OlxuXHRcdFx0XHRcdFx0XHRyZXR1cm4ga2V5ID09PSBcIi1cIlxuXHRcdFx0XHRcdFx0XHRcdD8gYmFzZS5wdXNoKHZhbHVlKVxuXHRcdFx0XHRcdFx0XHRcdDogYmFzZS5zcGxpY2Uoa2V5IGFzIGFueSwgMCwgdmFsdWUpXG5cdFx0XHRcdFx0XHRjYXNlIEFyY2h0eXBlLk1hcDpcblx0XHRcdFx0XHRcdFx0cmV0dXJuIGJhc2Uuc2V0KGtleSwgdmFsdWUpXG5cdFx0XHRcdFx0XHRjYXNlIEFyY2h0eXBlLlNldDpcblx0XHRcdFx0XHRcdFx0cmV0dXJuIGJhc2UuYWRkKHZhbHVlKVxuXHRcdFx0XHRcdFx0ZGVmYXVsdDpcblx0XHRcdFx0XHRcdFx0cmV0dXJuIChiYXNlW2tleV0gPSB2YWx1ZSlcblx0XHRcdFx0XHR9XG5cdFx0XHRcdGNhc2UgUkVNT1ZFOlxuXHRcdFx0XHRcdHN3aXRjaCAodHlwZSkge1xuXHRcdFx0XHRcdFx0Y2FzZSBBcmNodHlwZS5BcnJheTpcblx0XHRcdFx0XHRcdFx0cmV0dXJuIGJhc2Uuc3BsaWNlKGtleSBhcyBhbnksIDEpXG5cdFx0XHRcdFx0XHRjYXNlIEFyY2h0eXBlLk1hcDpcblx0XHRcdFx0XHRcdFx0cmV0dXJuIGJhc2UuZGVsZXRlKGtleSlcblx0XHRcdFx0XHRcdGNhc2UgQXJjaHR5cGUuU2V0OlxuXHRcdFx0XHRcdFx0XHRyZXR1cm4gYmFzZS5kZWxldGUocGF0Y2gudmFsdWUpXG5cdFx0XHRcdFx0XHRkZWZhdWx0OlxuXHRcdFx0XHRcdFx0XHRyZXR1cm4gZGVsZXRlIGJhc2Vba2V5XVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0ZGVmYXVsdDpcblx0XHRcdFx0XHRkaWUoMTcsIG9wKVxuXHRcdFx0fVxuXHRcdH0pXG5cblx0XHRyZXR1cm4gZHJhZnRcblx0fVxuXG5cdC8vIG9wdGltaXplOiB0aGlzIGlzIHF1aXRlIGEgcGVyZm9ybWFuY2UgaGl0LCBjYW4gd2UgZGV0ZWN0IGludGVsbGlnZW50bHkgd2hlbiBpdCBpcyBuZWVkZWQ/XG5cdC8vIEUuZy4gYXV0by1kcmFmdCB3aGVuIG5ldyBvYmplY3RzIGZyb20gb3V0c2lkZSBhcmUgYXNzaWduZWQgYW5kIG1vZGlmaWVkP1xuXHQvLyAoU2VlIGZhaWxpbmcgdGVzdCB3aGVuIGRlZXBDbG9uZSBqdXN0IHJldHVybnMgb2JqKVxuXHRmdW5jdGlvbiBkZWVwQ2xvbmVQYXRjaFZhbHVlPFQ+KG9iajogVCk6IFRcblx0ZnVuY3Rpb24gZGVlcENsb25lUGF0Y2hWYWx1ZShvYmo6IGFueSkge1xuXHRcdGlmICghaXNEcmFmdGFibGUob2JqKSkgcmV0dXJuIG9ialxuXHRcdGlmIChBcnJheS5pc0FycmF5KG9iaikpIHJldHVybiBvYmoubWFwKGRlZXBDbG9uZVBhdGNoVmFsdWUpXG5cdFx0aWYgKGlzTWFwKG9iaikpXG5cdFx0XHRyZXR1cm4gbmV3IE1hcChcblx0XHRcdFx0QXJyYXkuZnJvbShvYmouZW50cmllcygpKS5tYXAoKFtrLCB2XSkgPT4gW2ssIGRlZXBDbG9uZVBhdGNoVmFsdWUodildKVxuXHRcdFx0KVxuXHRcdGlmIChpc1NldChvYmopKSByZXR1cm4gbmV3IFNldChBcnJheS5mcm9tKG9iaikubWFwKGRlZXBDbG9uZVBhdGNoVmFsdWUpKVxuXHRcdGNvbnN0IGNsb25lZCA9IE9iamVjdC5jcmVhdGUoT2JqZWN0LmdldFByb3RvdHlwZU9mKG9iaikpXG5cdFx0Zm9yIChjb25zdCBrZXkgaW4gb2JqKSBjbG9uZWRba2V5XSA9IGRlZXBDbG9uZVBhdGNoVmFsdWUob2JqW2tleV0pXG5cdFx0aWYgKGhhcyhvYmosIGltbWVyYWJsZSkpIGNsb25lZFtpbW1lcmFibGVdID0gb2JqW2ltbWVyYWJsZV1cblx0XHRyZXR1cm4gY2xvbmVkXG5cdH1cblxuXHRmdW5jdGlvbiBjbG9uZVBhdGNoVmFsdWVJZk5lZWRlZDxUPihvYmo6IFQpOiBUIHtcblx0XHRpZiAoaXNEcmFmdChvYmopKSB7XG5cdFx0XHRyZXR1cm4gZGVlcENsb25lUGF0Y2hWYWx1ZShvYmopXG5cdFx0fSBlbHNlIHJldHVybiBvYmpcblx0fVxuXG5cdGxvYWRQbHVnaW4oXCJQYXRjaGVzXCIsIHtcblx0XHRhcHBseVBhdGNoZXNfLFxuXHRcdGdlbmVyYXRlUGF0Y2hlc18sXG5cdFx0Z2VuZXJhdGVSZXBsYWNlbWVudFBhdGNoZXNfXG5cdH0pXG59XG4iLCAiLy8gdHlwZXMgb25seSFcbmltcG9ydCB7XG5cdEltbWVyU3RhdGUsXG5cdEFueU1hcCxcblx0QW55U2V0LFxuXHRNYXBTdGF0ZSxcblx0U2V0U3RhdGUsXG5cdERSQUZUX1NUQVRFLFxuXHRnZXRDdXJyZW50U2NvcGUsXG5cdGxhdGVzdCxcblx0aXRlcmF0b3JTeW1ib2wsXG5cdGlzRHJhZnRhYmxlLFxuXHRjcmVhdGVQcm94eSxcblx0bG9hZFBsdWdpbixcblx0bWFya0NoYW5nZWQsXG5cdFByb3h5VHlwZSxcblx0ZGllLFxuXHRlYWNoXG59IGZyb20gXCIuLi9pbnRlcm5hbFwiXG5cbmV4cG9ydCBmdW5jdGlvbiBlbmFibGVNYXBTZXQoKSB7XG5cdC8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICovXG5cdHZhciBleHRlbmRTdGF0aWNzID0gZnVuY3Rpb24oZDogYW55LCBiOiBhbnkpOiBhbnkge1xuXHRcdGV4dGVuZFN0YXRpY3MgPVxuXHRcdFx0T2JqZWN0LnNldFByb3RvdHlwZU9mIHx8XG5cdFx0XHQoe19fcHJvdG9fXzogW119IGluc3RhbmNlb2YgQXJyYXkgJiZcblx0XHRcdFx0ZnVuY3Rpb24oZCwgYikge1xuXHRcdFx0XHRcdGQuX19wcm90b19fID0gYlxuXHRcdFx0XHR9KSB8fFxuXHRcdFx0ZnVuY3Rpb24oZCwgYikge1xuXHRcdFx0XHRmb3IgKHZhciBwIGluIGIpIGlmIChiLmhhc093blByb3BlcnR5KHApKSBkW3BdID0gYltwXVxuXHRcdFx0fVxuXHRcdHJldHVybiBleHRlbmRTdGF0aWNzKGQsIGIpXG5cdH1cblxuXHQvLyBVZ2x5IGhhY2sgdG8gcmVzb2x2ZSAjNTAyIGFuZCBpbmhlcml0IGJ1aWx0IGluIE1hcCAvIFNldFxuXHRmdW5jdGlvbiBfX2V4dGVuZHMoZDogYW55LCBiOiBhbnkpOiBhbnkge1xuXHRcdGV4dGVuZFN0YXRpY3MoZCwgYilcblx0XHRmdW5jdGlvbiBfXyh0aGlzOiBhbnkpOiBhbnkge1xuXHRcdFx0dGhpcy5jb25zdHJ1Y3RvciA9IGRcblx0XHR9XG5cdFx0ZC5wcm90b3R5cGUgPVxuXHRcdFx0Ly8gQHRzLWlnbm9yZVxuXHRcdFx0KChfXy5wcm90b3R5cGUgPSBiLnByb3RvdHlwZSksIG5ldyBfXygpKVxuXHR9XG5cblx0Y29uc3QgRHJhZnRNYXAgPSAoZnVuY3Rpb24oX3N1cGVyKSB7XG5cdFx0X19leHRlbmRzKERyYWZ0TWFwLCBfc3VwZXIpXG5cdFx0Ly8gQ3JlYXRlIGNsYXNzIG1hbnVhbGx5LCBjYXVzZSAjNTAyXG5cdFx0ZnVuY3Rpb24gRHJhZnRNYXAodGhpczogYW55LCB0YXJnZXQ6IEFueU1hcCwgcGFyZW50PzogSW1tZXJTdGF0ZSk6IGFueSB7XG5cdFx0XHR0aGlzW0RSQUZUX1NUQVRFXSA9IHtcblx0XHRcdFx0dHlwZV86IFByb3h5VHlwZS5NYXAsXG5cdFx0XHRcdHBhcmVudF86IHBhcmVudCxcblx0XHRcdFx0c2NvcGVfOiBwYXJlbnQgPyBwYXJlbnQuc2NvcGVfIDogZ2V0Q3VycmVudFNjb3BlKCkhLFxuXHRcdFx0XHRtb2RpZmllZF86IGZhbHNlLFxuXHRcdFx0XHRmaW5hbGl6ZWRfOiBmYWxzZSxcblx0XHRcdFx0Y29weV86IHVuZGVmaW5lZCxcblx0XHRcdFx0YXNzaWduZWRfOiB1bmRlZmluZWQsXG5cdFx0XHRcdGJhc2VfOiB0YXJnZXQsXG5cdFx0XHRcdGRyYWZ0XzogdGhpcyBhcyBhbnksXG5cdFx0XHRcdGlzTWFudWFsXzogZmFsc2UsXG5cdFx0XHRcdHJldm9rZWRfOiBmYWxzZVxuXHRcdFx0fSBhcyBNYXBTdGF0ZVxuXHRcdFx0cmV0dXJuIHRoaXNcblx0XHR9XG5cdFx0Y29uc3QgcCA9IERyYWZ0TWFwLnByb3RvdHlwZVxuXG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KHAsIFwic2l6ZVwiLCB7XG5cdFx0XHRnZXQ6IGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRyZXR1cm4gbGF0ZXN0KHRoaXNbRFJBRlRfU1RBVEVdKS5zaXplXG5cdFx0XHR9XG5cdFx0XHQvLyBlbnVtZXJhYmxlOiBmYWxzZSxcblx0XHRcdC8vIGNvbmZpZ3VyYWJsZTogdHJ1ZVxuXHRcdH0pXG5cblx0XHRwLmhhcyA9IGZ1bmN0aW9uKGtleTogYW55KTogYm9vbGVhbiB7XG5cdFx0XHRyZXR1cm4gbGF0ZXN0KHRoaXNbRFJBRlRfU1RBVEVdKS5oYXMoa2V5KVxuXHRcdH1cblxuXHRcdHAuc2V0ID0gZnVuY3Rpb24oa2V5OiBhbnksIHZhbHVlOiBhbnkpIHtcblx0XHRcdGNvbnN0IHN0YXRlOiBNYXBTdGF0ZSA9IHRoaXNbRFJBRlRfU1RBVEVdXG5cdFx0XHRhc3NlcnRVbnJldm9rZWQoc3RhdGUpXG5cdFx0XHRpZiAoIWxhdGVzdChzdGF0ZSkuaGFzKGtleSkgfHwgbGF0ZXN0KHN0YXRlKS5nZXQoa2V5KSAhPT0gdmFsdWUpIHtcblx0XHRcdFx0cHJlcGFyZU1hcENvcHkoc3RhdGUpXG5cdFx0XHRcdG1hcmtDaGFuZ2VkKHN0YXRlKVxuXHRcdFx0XHRzdGF0ZS5hc3NpZ25lZF8hLnNldChrZXksIHRydWUpXG5cdFx0XHRcdHN0YXRlLmNvcHlfIS5zZXQoa2V5LCB2YWx1ZSlcblx0XHRcdFx0c3RhdGUuYXNzaWduZWRfIS5zZXQoa2V5LCB0cnVlKVxuXHRcdFx0fVxuXHRcdFx0cmV0dXJuIHRoaXNcblx0XHR9XG5cblx0XHRwLmRlbGV0ZSA9IGZ1bmN0aW9uKGtleTogYW55KTogYm9vbGVhbiB7XG5cdFx0XHRpZiAoIXRoaXMuaGFzKGtleSkpIHtcblx0XHRcdFx0cmV0dXJuIGZhbHNlXG5cdFx0XHR9XG5cblx0XHRcdGNvbnN0IHN0YXRlOiBNYXBTdGF0ZSA9IHRoaXNbRFJBRlRfU1RBVEVdXG5cdFx0XHRhc3NlcnRVbnJldm9rZWQoc3RhdGUpXG5cdFx0XHRwcmVwYXJlTWFwQ29weShzdGF0ZSlcblx0XHRcdG1hcmtDaGFuZ2VkKHN0YXRlKVxuXHRcdFx0aWYgKHN0YXRlLmJhc2VfLmhhcyhrZXkpKSB7XG5cdFx0XHRcdHN0YXRlLmFzc2lnbmVkXyEuc2V0KGtleSwgZmFsc2UpXG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRzdGF0ZS5hc3NpZ25lZF8hLmRlbGV0ZShrZXkpXG5cdFx0XHR9XG5cdFx0XHRzdGF0ZS5jb3B5XyEuZGVsZXRlKGtleSlcblx0XHRcdHJldHVybiB0cnVlXG5cdFx0fVxuXG5cdFx0cC5jbGVhciA9IGZ1bmN0aW9uKCkge1xuXHRcdFx0Y29uc3Qgc3RhdGU6IE1hcFN0YXRlID0gdGhpc1tEUkFGVF9TVEFURV1cblx0XHRcdGFzc2VydFVucmV2b2tlZChzdGF0ZSlcblx0XHRcdGlmIChsYXRlc3Qoc3RhdGUpLnNpemUpIHtcblx0XHRcdFx0cHJlcGFyZU1hcENvcHkoc3RhdGUpXG5cdFx0XHRcdG1hcmtDaGFuZ2VkKHN0YXRlKVxuXHRcdFx0XHRzdGF0ZS5hc3NpZ25lZF8gPSBuZXcgTWFwKClcblx0XHRcdFx0ZWFjaChzdGF0ZS5iYXNlXywga2V5ID0+IHtcblx0XHRcdFx0XHRzdGF0ZS5hc3NpZ25lZF8hLnNldChrZXksIGZhbHNlKVxuXHRcdFx0XHR9KVxuXHRcdFx0XHRzdGF0ZS5jb3B5XyEuY2xlYXIoKVxuXHRcdFx0fVxuXHRcdH1cblxuXHRcdHAuZm9yRWFjaCA9IGZ1bmN0aW9uKFxuXHRcdFx0Y2I6ICh2YWx1ZTogYW55LCBrZXk6IGFueSwgc2VsZjogYW55KSA9PiB2b2lkLFxuXHRcdFx0dGhpc0FyZz86IGFueVxuXHRcdCkge1xuXHRcdFx0Y29uc3Qgc3RhdGU6IE1hcFN0YXRlID0gdGhpc1tEUkFGVF9TVEFURV1cblx0XHRcdGxhdGVzdChzdGF0ZSkuZm9yRWFjaCgoX3ZhbHVlOiBhbnksIGtleTogYW55LCBfbWFwOiBhbnkpID0+IHtcblx0XHRcdFx0Y2IuY2FsbCh0aGlzQXJnLCB0aGlzLmdldChrZXkpLCBrZXksIHRoaXMpXG5cdFx0XHR9KVxuXHRcdH1cblxuXHRcdHAuZ2V0ID0gZnVuY3Rpb24oa2V5OiBhbnkpOiBhbnkge1xuXHRcdFx0Y29uc3Qgc3RhdGU6IE1hcFN0YXRlID0gdGhpc1tEUkFGVF9TVEFURV1cblx0XHRcdGFzc2VydFVucmV2b2tlZChzdGF0ZSlcblx0XHRcdGNvbnN0IHZhbHVlID0gbGF0ZXN0KHN0YXRlKS5nZXQoa2V5KVxuXHRcdFx0aWYgKHN0YXRlLmZpbmFsaXplZF8gfHwgIWlzRHJhZnRhYmxlKHZhbHVlKSkge1xuXHRcdFx0XHRyZXR1cm4gdmFsdWVcblx0XHRcdH1cblx0XHRcdGlmICh2YWx1ZSAhPT0gc3RhdGUuYmFzZV8uZ2V0KGtleSkpIHtcblx0XHRcdFx0cmV0dXJuIHZhbHVlIC8vIGVpdGhlciBhbHJlYWR5IGRyYWZ0ZWQgb3IgcmVhc3NpZ25lZFxuXHRcdFx0fVxuXHRcdFx0Ly8gZGVzcGl0ZSB3aGF0IGl0IGxvb2tzLCB0aGlzIGNyZWF0ZXMgYSBkcmFmdCBvbmx5IG9uY2UsIHNlZSBhYm92ZSBjb25kaXRpb25cblx0XHRcdGNvbnN0IGRyYWZ0ID0gY3JlYXRlUHJveHkoc3RhdGUuc2NvcGVfLmltbWVyXywgdmFsdWUsIHN0YXRlKVxuXHRcdFx0cHJlcGFyZU1hcENvcHkoc3RhdGUpXG5cdFx0XHRzdGF0ZS5jb3B5XyEuc2V0KGtleSwgZHJhZnQpXG5cdFx0XHRyZXR1cm4gZHJhZnRcblx0XHR9XG5cblx0XHRwLmtleXMgPSBmdW5jdGlvbigpOiBJdGVyYWJsZUl0ZXJhdG9yPGFueT4ge1xuXHRcdFx0cmV0dXJuIGxhdGVzdCh0aGlzW0RSQUZUX1NUQVRFXSkua2V5cygpXG5cdFx0fVxuXG5cdFx0cC52YWx1ZXMgPSBmdW5jdGlvbigpOiBJdGVyYWJsZUl0ZXJhdG9yPGFueT4ge1xuXHRcdFx0Y29uc3QgaXRlcmF0b3IgPSB0aGlzLmtleXMoKVxuXHRcdFx0cmV0dXJuIHtcblx0XHRcdFx0W2l0ZXJhdG9yU3ltYm9sXTogKCkgPT4gdGhpcy52YWx1ZXMoKSxcblx0XHRcdFx0bmV4dDogKCkgPT4ge1xuXHRcdFx0XHRcdGNvbnN0IHIgPSBpdGVyYXRvci5uZXh0KClcblx0XHRcdFx0XHQvKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAqL1xuXHRcdFx0XHRcdGlmIChyLmRvbmUpIHJldHVybiByXG5cdFx0XHRcdFx0Y29uc3QgdmFsdWUgPSB0aGlzLmdldChyLnZhbHVlKVxuXHRcdFx0XHRcdHJldHVybiB7XG5cdFx0XHRcdFx0XHRkb25lOiBmYWxzZSxcblx0XHRcdFx0XHRcdHZhbHVlXG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9IGFzIGFueVxuXHRcdH1cblxuXHRcdHAuZW50cmllcyA9IGZ1bmN0aW9uKCk6IEl0ZXJhYmxlSXRlcmF0b3I8W2FueSwgYW55XT4ge1xuXHRcdFx0Y29uc3QgaXRlcmF0b3IgPSB0aGlzLmtleXMoKVxuXHRcdFx0cmV0dXJuIHtcblx0XHRcdFx0W2l0ZXJhdG9yU3ltYm9sXTogKCkgPT4gdGhpcy5lbnRyaWVzKCksXG5cdFx0XHRcdG5leHQ6ICgpID0+IHtcblx0XHRcdFx0XHRjb25zdCByID0gaXRlcmF0b3IubmV4dCgpXG5cdFx0XHRcdFx0LyogaXN0YW5idWwgaWdub3JlIG5leHQgKi9cblx0XHRcdFx0XHRpZiAoci5kb25lKSByZXR1cm4gclxuXHRcdFx0XHRcdGNvbnN0IHZhbHVlID0gdGhpcy5nZXQoci52YWx1ZSlcblx0XHRcdFx0XHRyZXR1cm4ge1xuXHRcdFx0XHRcdFx0ZG9uZTogZmFsc2UsXG5cdFx0XHRcdFx0XHR2YWx1ZTogW3IudmFsdWUsIHZhbHVlXVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fSBhcyBhbnlcblx0XHR9XG5cblx0XHRwW2l0ZXJhdG9yU3ltYm9sXSA9IGZ1bmN0aW9uKCkge1xuXHRcdFx0cmV0dXJuIHRoaXMuZW50cmllcygpXG5cdFx0fVxuXG5cdFx0cmV0dXJuIERyYWZ0TWFwXG5cdH0pKE1hcClcblxuXHRmdW5jdGlvbiBwcm94eU1hcF88VCBleHRlbmRzIEFueU1hcD4odGFyZ2V0OiBULCBwYXJlbnQ/OiBJbW1lclN0YXRlKTogVCB7XG5cdFx0Ly8gQHRzLWlnbm9yZVxuXHRcdHJldHVybiBuZXcgRHJhZnRNYXAodGFyZ2V0LCBwYXJlbnQpXG5cdH1cblxuXHRmdW5jdGlvbiBwcmVwYXJlTWFwQ29weShzdGF0ZTogTWFwU3RhdGUpIHtcblx0XHRpZiAoIXN0YXRlLmNvcHlfKSB7XG5cdFx0XHRzdGF0ZS5hc3NpZ25lZF8gPSBuZXcgTWFwKClcblx0XHRcdHN0YXRlLmNvcHlfID0gbmV3IE1hcChzdGF0ZS5iYXNlXylcblx0XHR9XG5cdH1cblxuXHRjb25zdCBEcmFmdFNldCA9IChmdW5jdGlvbihfc3VwZXIpIHtcblx0XHRfX2V4dGVuZHMoRHJhZnRTZXQsIF9zdXBlcilcblx0XHQvLyBDcmVhdGUgY2xhc3MgbWFudWFsbHksIGNhdXNlICM1MDJcblx0XHRmdW5jdGlvbiBEcmFmdFNldCh0aGlzOiBhbnksIHRhcmdldDogQW55U2V0LCBwYXJlbnQ/OiBJbW1lclN0YXRlKSB7XG5cdFx0XHR0aGlzW0RSQUZUX1NUQVRFXSA9IHtcblx0XHRcdFx0dHlwZV86IFByb3h5VHlwZS5TZXQsXG5cdFx0XHRcdHBhcmVudF86IHBhcmVudCxcblx0XHRcdFx0c2NvcGVfOiBwYXJlbnQgPyBwYXJlbnQuc2NvcGVfIDogZ2V0Q3VycmVudFNjb3BlKCkhLFxuXHRcdFx0XHRtb2RpZmllZF86IGZhbHNlLFxuXHRcdFx0XHRmaW5hbGl6ZWRfOiBmYWxzZSxcblx0XHRcdFx0Y29weV86IHVuZGVmaW5lZCxcblx0XHRcdFx0YmFzZV86IHRhcmdldCxcblx0XHRcdFx0ZHJhZnRfOiB0aGlzLFxuXHRcdFx0XHRkcmFmdHNfOiBuZXcgTWFwKCksXG5cdFx0XHRcdHJldm9rZWRfOiBmYWxzZSxcblx0XHRcdFx0aXNNYW51YWxfOiBmYWxzZVxuXHRcdFx0fSBhcyBTZXRTdGF0ZVxuXHRcdFx0cmV0dXJuIHRoaXNcblx0XHR9XG5cdFx0Y29uc3QgcCA9IERyYWZ0U2V0LnByb3RvdHlwZVxuXG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KHAsIFwic2l6ZVwiLCB7XG5cdFx0XHRnZXQ6IGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRyZXR1cm4gbGF0ZXN0KHRoaXNbRFJBRlRfU1RBVEVdKS5zaXplXG5cdFx0XHR9XG5cdFx0XHQvLyBlbnVtZXJhYmxlOiB0cnVlLFxuXHRcdH0pXG5cblx0XHRwLmhhcyA9IGZ1bmN0aW9uKHZhbHVlOiBhbnkpOiBib29sZWFuIHtcblx0XHRcdGNvbnN0IHN0YXRlOiBTZXRTdGF0ZSA9IHRoaXNbRFJBRlRfU1RBVEVdXG5cdFx0XHRhc3NlcnRVbnJldm9rZWQoc3RhdGUpXG5cdFx0XHQvLyBiaXQgb2YgdHJpY2tlcnkgaGVyZSwgdG8gYmUgYWJsZSB0byByZWNvZ25pemUgYm90aCB0aGUgdmFsdWUsIGFuZCB0aGUgZHJhZnQgb2YgaXRzIHZhbHVlXG5cdFx0XHRpZiAoIXN0YXRlLmNvcHlfKSB7XG5cdFx0XHRcdHJldHVybiBzdGF0ZS5iYXNlXy5oYXModmFsdWUpXG5cdFx0XHR9XG5cdFx0XHRpZiAoc3RhdGUuY29weV8uaGFzKHZhbHVlKSkgcmV0dXJuIHRydWVcblx0XHRcdGlmIChzdGF0ZS5kcmFmdHNfLmhhcyh2YWx1ZSkgJiYgc3RhdGUuY29weV8uaGFzKHN0YXRlLmRyYWZ0c18uZ2V0KHZhbHVlKSkpXG5cdFx0XHRcdHJldHVybiB0cnVlXG5cdFx0XHRyZXR1cm4gZmFsc2Vcblx0XHR9XG5cblx0XHRwLmFkZCA9IGZ1bmN0aW9uKHZhbHVlOiBhbnkpOiBhbnkge1xuXHRcdFx0Y29uc3Qgc3RhdGU6IFNldFN0YXRlID0gdGhpc1tEUkFGVF9TVEFURV1cblx0XHRcdGFzc2VydFVucmV2b2tlZChzdGF0ZSlcblx0XHRcdGlmICghdGhpcy5oYXModmFsdWUpKSB7XG5cdFx0XHRcdHByZXBhcmVTZXRDb3B5KHN0YXRlKVxuXHRcdFx0XHRtYXJrQ2hhbmdlZChzdGF0ZSlcblx0XHRcdFx0c3RhdGUuY29weV8hLmFkZCh2YWx1ZSlcblx0XHRcdH1cblx0XHRcdHJldHVybiB0aGlzXG5cdFx0fVxuXG5cdFx0cC5kZWxldGUgPSBmdW5jdGlvbih2YWx1ZTogYW55KTogYW55IHtcblx0XHRcdGlmICghdGhpcy5oYXModmFsdWUpKSB7XG5cdFx0XHRcdHJldHVybiBmYWxzZVxuXHRcdFx0fVxuXG5cdFx0XHRjb25zdCBzdGF0ZTogU2V0U3RhdGUgPSB0aGlzW0RSQUZUX1NUQVRFXVxuXHRcdFx0YXNzZXJ0VW5yZXZva2VkKHN0YXRlKVxuXHRcdFx0cHJlcGFyZVNldENvcHkoc3RhdGUpXG5cdFx0XHRtYXJrQ2hhbmdlZChzdGF0ZSlcblx0XHRcdHJldHVybiAoXG5cdFx0XHRcdHN0YXRlLmNvcHlfIS5kZWxldGUodmFsdWUpIHx8XG5cdFx0XHRcdChzdGF0ZS5kcmFmdHNfLmhhcyh2YWx1ZSlcblx0XHRcdFx0XHQ/IHN0YXRlLmNvcHlfIS5kZWxldGUoc3RhdGUuZHJhZnRzXy5nZXQodmFsdWUpKVxuXHRcdFx0XHRcdDogLyogaXN0YW5idWwgaWdub3JlIG5leHQgKi8gZmFsc2UpXG5cdFx0XHQpXG5cdFx0fVxuXG5cdFx0cC5jbGVhciA9IGZ1bmN0aW9uKCkge1xuXHRcdFx0Y29uc3Qgc3RhdGU6IFNldFN0YXRlID0gdGhpc1tEUkFGVF9TVEFURV1cblx0XHRcdGFzc2VydFVucmV2b2tlZChzdGF0ZSlcblx0XHRcdGlmIChsYXRlc3Qoc3RhdGUpLnNpemUpIHtcblx0XHRcdFx0cHJlcGFyZVNldENvcHkoc3RhdGUpXG5cdFx0XHRcdG1hcmtDaGFuZ2VkKHN0YXRlKVxuXHRcdFx0XHRzdGF0ZS5jb3B5XyEuY2xlYXIoKVxuXHRcdFx0fVxuXHRcdH1cblxuXHRcdHAudmFsdWVzID0gZnVuY3Rpb24oKTogSXRlcmFibGVJdGVyYXRvcjxhbnk+IHtcblx0XHRcdGNvbnN0IHN0YXRlOiBTZXRTdGF0ZSA9IHRoaXNbRFJBRlRfU1RBVEVdXG5cdFx0XHRhc3NlcnRVbnJldm9rZWQoc3RhdGUpXG5cdFx0XHRwcmVwYXJlU2V0Q29weShzdGF0ZSlcblx0XHRcdHJldHVybiBzdGF0ZS5jb3B5XyEudmFsdWVzKClcblx0XHR9XG5cblx0XHRwLmVudHJpZXMgPSBmdW5jdGlvbiBlbnRyaWVzKCk6IEl0ZXJhYmxlSXRlcmF0b3I8W2FueSwgYW55XT4ge1xuXHRcdFx0Y29uc3Qgc3RhdGU6IFNldFN0YXRlID0gdGhpc1tEUkFGVF9TVEFURV1cblx0XHRcdGFzc2VydFVucmV2b2tlZChzdGF0ZSlcblx0XHRcdHByZXBhcmVTZXRDb3B5KHN0YXRlKVxuXHRcdFx0cmV0dXJuIHN0YXRlLmNvcHlfIS5lbnRyaWVzKClcblx0XHR9XG5cblx0XHRwLmtleXMgPSBmdW5jdGlvbigpOiBJdGVyYWJsZUl0ZXJhdG9yPGFueT4ge1xuXHRcdFx0cmV0dXJuIHRoaXMudmFsdWVzKClcblx0XHR9XG5cblx0XHRwW2l0ZXJhdG9yU3ltYm9sXSA9IGZ1bmN0aW9uKCkge1xuXHRcdFx0cmV0dXJuIHRoaXMudmFsdWVzKClcblx0XHR9XG5cblx0XHRwLmZvckVhY2ggPSBmdW5jdGlvbiBmb3JFYWNoKGNiOiBhbnksIHRoaXNBcmc/OiBhbnkpIHtcblx0XHRcdGNvbnN0IGl0ZXJhdG9yID0gdGhpcy52YWx1ZXMoKVxuXHRcdFx0bGV0IHJlc3VsdCA9IGl0ZXJhdG9yLm5leHQoKVxuXHRcdFx0d2hpbGUgKCFyZXN1bHQuZG9uZSkge1xuXHRcdFx0XHRjYi5jYWxsKHRoaXNBcmcsIHJlc3VsdC52YWx1ZSwgcmVzdWx0LnZhbHVlLCB0aGlzKVxuXHRcdFx0XHRyZXN1bHQgPSBpdGVyYXRvci5uZXh0KClcblx0XHRcdH1cblx0XHR9XG5cblx0XHRyZXR1cm4gRHJhZnRTZXRcblx0fSkoU2V0KVxuXG5cdGZ1bmN0aW9uIHByb3h5U2V0XzxUIGV4dGVuZHMgQW55U2V0Pih0YXJnZXQ6IFQsIHBhcmVudD86IEltbWVyU3RhdGUpOiBUIHtcblx0XHQvLyBAdHMtaWdub3JlXG5cdFx0cmV0dXJuIG5ldyBEcmFmdFNldCh0YXJnZXQsIHBhcmVudClcblx0fVxuXG5cdGZ1bmN0aW9uIHByZXBhcmVTZXRDb3B5KHN0YXRlOiBTZXRTdGF0ZSkge1xuXHRcdGlmICghc3RhdGUuY29weV8pIHtcblx0XHRcdC8vIGNyZWF0ZSBkcmFmdHMgZm9yIGFsbCBlbnRyaWVzIHRvIHByZXNlcnZlIGluc2VydGlvbiBvcmRlclxuXHRcdFx0c3RhdGUuY29weV8gPSBuZXcgU2V0KClcblx0XHRcdHN0YXRlLmJhc2VfLmZvckVhY2godmFsdWUgPT4ge1xuXHRcdFx0XHRpZiAoaXNEcmFmdGFibGUodmFsdWUpKSB7XG5cdFx0XHRcdFx0Y29uc3QgZHJhZnQgPSBjcmVhdGVQcm94eShzdGF0ZS5zY29wZV8uaW1tZXJfLCB2YWx1ZSwgc3RhdGUpXG5cdFx0XHRcdFx0c3RhdGUuZHJhZnRzXy5zZXQodmFsdWUsIGRyYWZ0KVxuXHRcdFx0XHRcdHN0YXRlLmNvcHlfIS5hZGQoZHJhZnQpXG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0c3RhdGUuY29weV8hLmFkZCh2YWx1ZSlcblx0XHRcdFx0fVxuXHRcdFx0fSlcblx0XHR9XG5cdH1cblxuXHRmdW5jdGlvbiBhc3NlcnRVbnJldm9rZWQoc3RhdGU6IGFueSAvKkVTNVN0YXRlIHwgTWFwU3RhdGUgfCBTZXRTdGF0ZSovKSB7XG5cdFx0aWYgKHN0YXRlLnJldm9rZWRfKSBkaWUoMywgSlNPTi5zdHJpbmdpZnkobGF0ZXN0KHN0YXRlKSkpXG5cdH1cblxuXHRsb2FkUGx1Z2luKFwiTWFwU2V0XCIsIHtwcm94eU1hcF8sIHByb3h5U2V0X30pXG59XG4iLCAiaW1wb3J0IHtlbmFibGVFUzV9IGZyb20gXCIuL2VzNVwiXG5pbXBvcnQge2VuYWJsZU1hcFNldH0gZnJvbSBcIi4vbWFwc2V0XCJcbmltcG9ydCB7ZW5hYmxlUGF0Y2hlc30gZnJvbSBcIi4vcGF0Y2hlc1wiXG5cbmV4cG9ydCBmdW5jdGlvbiBlbmFibGVBbGxQbHVnaW5zKCkge1xuXHRlbmFibGVFUzUoKVxuXHRlbmFibGVNYXBTZXQoKVxuXHRlbmFibGVQYXRjaGVzKClcbn1cbiIsICJpbXBvcnQge1xuXHRJUHJvZHVjZSxcblx0SVByb2R1Y2VXaXRoUGF0Y2hlcyxcblx0SW1tZXIsXG5cdERyYWZ0LFxuXHRJbW11dGFibGVcbn0gZnJvbSBcIi4vaW50ZXJuYWxcIlxuXG5leHBvcnQge1xuXHREcmFmdCxcblx0SW1tdXRhYmxlLFxuXHRQYXRjaCxcblx0UGF0Y2hMaXN0ZW5lcixcblx0b3JpZ2luYWwsXG5cdGN1cnJlbnQsXG5cdGlzRHJhZnQsXG5cdGlzRHJhZnRhYmxlLFxuXHROT1RISU5HIGFzIG5vdGhpbmcsXG5cdERSQUZUQUJMRSBhcyBpbW1lcmFibGUsXG5cdGZyZWV6ZVxufSBmcm9tIFwiLi9pbnRlcm5hbFwiXG5cbmNvbnN0IGltbWVyID0gbmV3IEltbWVyKClcblxuLyoqXG4gKiBUaGUgYHByb2R1Y2VgIGZ1bmN0aW9uIHRha2VzIGEgdmFsdWUgYW5kIGEgXCJyZWNpcGUgZnVuY3Rpb25cIiAod2hvc2VcbiAqIHJldHVybiB2YWx1ZSBvZnRlbiBkZXBlbmRzIG9uIHRoZSBiYXNlIHN0YXRlKS4gVGhlIHJlY2lwZSBmdW5jdGlvbiBpc1xuICogZnJlZSB0byBtdXRhdGUgaXRzIGZpcnN0IGFyZ3VtZW50IGhvd2V2ZXIgaXQgd2FudHMuIEFsbCBtdXRhdGlvbnMgYXJlXG4gKiBvbmx5IGV2ZXIgYXBwbGllZCB0byBhIF9fY29weV9fIG9mIHRoZSBiYXNlIHN0YXRlLlxuICpcbiAqIFBhc3Mgb25seSBhIGZ1bmN0aW9uIHRvIGNyZWF0ZSBhIFwiY3VycmllZCBwcm9kdWNlclwiIHdoaWNoIHJlbGlldmVzIHlvdVxuICogZnJvbSBwYXNzaW5nIHRoZSByZWNpcGUgZnVuY3Rpb24gZXZlcnkgdGltZS5cbiAqXG4gKiBPbmx5IHBsYWluIG9iamVjdHMgYW5kIGFycmF5cyBhcmUgbWFkZSBtdXRhYmxlLiBBbGwgb3RoZXIgb2JqZWN0cyBhcmVcbiAqIGNvbnNpZGVyZWQgdW5jb3B5YWJsZS5cbiAqXG4gKiBOb3RlOiBUaGlzIGZ1bmN0aW9uIGlzIF9fYm91bmRfXyB0byBpdHMgYEltbWVyYCBpbnN0YW5jZS5cbiAqXG4gKiBAcGFyYW0ge2FueX0gYmFzZSAtIHRoZSBpbml0aWFsIHN0YXRlXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBwcm9kdWNlciAtIGZ1bmN0aW9uIHRoYXQgcmVjZWl2ZXMgYSBwcm94eSBvZiB0aGUgYmFzZSBzdGF0ZSBhcyBmaXJzdCBhcmd1bWVudCBhbmQgd2hpY2ggY2FuIGJlIGZyZWVseSBtb2RpZmllZFxuICogQHBhcmFtIHtGdW5jdGlvbn0gcGF0Y2hMaXN0ZW5lciAtIG9wdGlvbmFsIGZ1bmN0aW9uIHRoYXQgd2lsbCBiZSBjYWxsZWQgd2l0aCBhbGwgdGhlIHBhdGNoZXMgcHJvZHVjZWQgaGVyZVxuICogQHJldHVybnMge2FueX0gYSBuZXcgc3RhdGUsIG9yIHRoZSBpbml0aWFsIHN0YXRlIGlmIG5vdGhpbmcgd2FzIG1vZGlmaWVkXG4gKi9cbmV4cG9ydCBjb25zdCBwcm9kdWNlOiBJUHJvZHVjZSA9IGltbWVyLnByb2R1Y2VcbmV4cG9ydCBkZWZhdWx0IHByb2R1Y2VcblxuLyoqXG4gKiBMaWtlIGBwcm9kdWNlYCwgYnV0IGBwcm9kdWNlV2l0aFBhdGNoZXNgIGFsd2F5cyByZXR1cm5zIGEgdHVwbGVcbiAqIFtuZXh0U3RhdGUsIHBhdGNoZXMsIGludmVyc2VQYXRjaGVzXSAoaW5zdGVhZCBvZiBqdXN0IHRoZSBuZXh0IHN0YXRlKVxuICovXG5leHBvcnQgY29uc3QgcHJvZHVjZVdpdGhQYXRjaGVzOiBJUHJvZHVjZVdpdGhQYXRjaGVzID0gaW1tZXIucHJvZHVjZVdpdGhQYXRjaGVzLmJpbmQoXG5cdGltbWVyXG4pXG5cbi8qKlxuICogUGFzcyB0cnVlIHRvIGF1dG9tYXRpY2FsbHkgZnJlZXplIGFsbCBjb3BpZXMgY3JlYXRlZCBieSBJbW1lci5cbiAqXG4gKiBBbHdheXMgZnJlZXplIGJ5IGRlZmF1bHQsIGV2ZW4gaW4gcHJvZHVjdGlvbiBtb2RlXG4gKi9cbmV4cG9ydCBjb25zdCBzZXRBdXRvRnJlZXplID0gaW1tZXIuc2V0QXV0b0ZyZWV6ZS5iaW5kKGltbWVyKVxuXG4vKipcbiAqIFBhc3MgdHJ1ZSB0byB1c2UgdGhlIEVTMjAxNSBgUHJveHlgIGNsYXNzIHdoZW4gY3JlYXRpbmcgZHJhZnRzLCB3aGljaCBpc1xuICogYWx3YXlzIGZhc3RlciB0aGFuIHVzaW5nIEVTNSBwcm94aWVzLlxuICpcbiAqIEJ5IGRlZmF1bHQsIGZlYXR1cmUgZGV0ZWN0aW9uIGlzIHVzZWQsIHNvIGNhbGxpbmcgdGhpcyBpcyByYXJlbHkgbmVjZXNzYXJ5LlxuICovXG5leHBvcnQgY29uc3Qgc2V0VXNlUHJveGllcyA9IGltbWVyLnNldFVzZVByb3hpZXMuYmluZChpbW1lcilcblxuLyoqXG4gKiBBcHBseSBhbiBhcnJheSBvZiBJbW1lciBwYXRjaGVzIHRvIHRoZSBmaXJzdCBhcmd1bWVudC5cbiAqXG4gKiBUaGlzIGZ1bmN0aW9uIGlzIGEgcHJvZHVjZXIsIHdoaWNoIG1lYW5zIGNvcHktb24td3JpdGUgaXMgaW4gZWZmZWN0LlxuICovXG5leHBvcnQgY29uc3QgYXBwbHlQYXRjaGVzID0gaW1tZXIuYXBwbHlQYXRjaGVzLmJpbmQoaW1tZXIpXG5cbi8qKlxuICogQ3JlYXRlIGFuIEltbWVyIGRyYWZ0IGZyb20gdGhlIGdpdmVuIGJhc2Ugc3RhdGUsIHdoaWNoIG1heSBiZSBhIGRyYWZ0IGl0c2VsZi5cbiAqIFRoZSBkcmFmdCBjYW4gYmUgbW9kaWZpZWQgdW50aWwgeW91IGZpbmFsaXplIGl0IHdpdGggdGhlIGBmaW5pc2hEcmFmdGAgZnVuY3Rpb24uXG4gKi9cbmV4cG9ydCBjb25zdCBjcmVhdGVEcmFmdCA9IGltbWVyLmNyZWF0ZURyYWZ0LmJpbmQoaW1tZXIpXG5cbi8qKlxuICogRmluYWxpemUgYW4gSW1tZXIgZHJhZnQgZnJvbSBhIGBjcmVhdGVEcmFmdGAgY2FsbCwgcmV0dXJuaW5nIHRoZSBiYXNlIHN0YXRlXG4gKiAoaWYgbm8gY2hhbmdlcyB3ZXJlIG1hZGUpIG9yIGEgbW9kaWZpZWQgY29weS4gVGhlIGRyYWZ0IG11c3QgKm5vdCogYmVcbiAqIG11dGF0ZWQgYWZ0ZXJ3YXJkcy5cbiAqXG4gKiBQYXNzIGEgZnVuY3Rpb24gYXMgdGhlIDJuZCBhcmd1bWVudCB0byBnZW5lcmF0ZSBJbW1lciBwYXRjaGVzIGJhc2VkIG9uIHRoZVxuICogY2hhbmdlcyB0aGF0IHdlcmUgbWFkZS5cbiAqL1xuZXhwb3J0IGNvbnN0IGZpbmlzaERyYWZ0ID0gaW1tZXIuZmluaXNoRHJhZnQuYmluZChpbW1lcilcblxuLyoqXG4gKiBUaGlzIGZ1bmN0aW9uIGlzIGFjdHVhbGx5IGEgbm8tb3AsIGJ1dCBjYW4gYmUgdXNlZCB0byBjYXN0IGFuIGltbXV0YWJsZSB0eXBlXG4gKiB0byBhbiBkcmFmdCB0eXBlIGFuZCBtYWtlIFR5cGVTY3JpcHQgaGFwcHlcbiAqXG4gKiBAcGFyYW0gdmFsdWVcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGNhc3REcmFmdDxUPih2YWx1ZTogVCk6IERyYWZ0PFQ+IHtcblx0cmV0dXJuIHZhbHVlIGFzIGFueVxufVxuXG4vKipcbiAqIFRoaXMgZnVuY3Rpb24gaXMgYWN0dWFsbHkgYSBuby1vcCwgYnV0IGNhbiBiZSB1c2VkIHRvIGNhc3QgYSBtdXRhYmxlIHR5cGVcbiAqIHRvIGFuIGltbXV0YWJsZSB0eXBlIGFuZCBtYWtlIFR5cGVTY3JpcHQgaGFwcHlcbiAqIEBwYXJhbSB2YWx1ZVxuICovXG5leHBvcnQgZnVuY3Rpb24gY2FzdEltbXV0YWJsZTxUPih2YWx1ZTogVCk6IEltbXV0YWJsZTxUPiB7XG5cdHJldHVybiB2YWx1ZSBhcyBhbnlcbn1cblxuZXhwb3J0IHtJbW1lcn1cblxuZXhwb3J0IHtlbmFibGVFUzV9IGZyb20gXCIuL3BsdWdpbnMvZXM1XCJcbmV4cG9ydCB7ZW5hYmxlUGF0Y2hlc30gZnJvbSBcIi4vcGx1Z2lucy9wYXRjaGVzXCJcbmV4cG9ydCB7ZW5hYmxlTWFwU2V0fSBmcm9tIFwiLi9wbHVnaW5zL21hcHNldFwiXG5leHBvcnQge2VuYWJsZUFsbFBsdWdpbnN9IGZyb20gXCIuL3BsdWdpbnMvYWxsXCJcbiIsICIvLyBTaG91bGQgYmUgbm8gaW1wb3J0cyBoZXJlIVxuXG4vLyBTb21lIHRoaW5ncyB0aGF0IHNob3VsZCBiZSBldmFsdWF0ZWQgYmVmb3JlIGFsbCBlbHNlLi4uXG5cbi8vIFdlIG9ubHkgd2FudCB0byBrbm93IGlmIG5vbi1wb2x5ZmlsbGVkIHN5bWJvbHMgYXJlIGF2YWlsYWJsZVxuY29uc3QgaGFzU3ltYm9sID1cblx0dHlwZW9mIFN5bWJvbCAhPT0gXCJ1bmRlZmluZWRcIiAmJiB0eXBlb2YgU3ltYm9sKFwieFwiKSA9PT0gXCJzeW1ib2xcIlxuZXhwb3J0IGNvbnN0IGhhc01hcCA9IHR5cGVvZiBNYXAgIT09IFwidW5kZWZpbmVkXCJcbmV4cG9ydCBjb25zdCBoYXNTZXQgPSB0eXBlb2YgU2V0ICE9PSBcInVuZGVmaW5lZFwiXG5leHBvcnQgY29uc3QgaGFzUHJveGllcyA9XG5cdHR5cGVvZiBQcm94eSAhPT0gXCJ1bmRlZmluZWRcIiAmJlxuXHR0eXBlb2YgUHJveHkucmV2b2NhYmxlICE9PSBcInVuZGVmaW5lZFwiICYmXG5cdHR5cGVvZiBSZWZsZWN0ICE9PSBcInVuZGVmaW5lZFwiXG5cbi8qKlxuICogVGhlIHNlbnRpbmVsIHZhbHVlIHJldHVybmVkIGJ5IHByb2R1Y2VycyB0byByZXBsYWNlIHRoZSBkcmFmdCB3aXRoIHVuZGVmaW5lZC5cbiAqL1xuZXhwb3J0IGNvbnN0IE5PVEhJTkc6IE5vdGhpbmcgPSBoYXNTeW1ib2xcblx0PyBTeW1ib2wuZm9yKFwiaW1tZXItbm90aGluZ1wiKVxuXHQ6ICh7W1wiaW1tZXItbm90aGluZ1wiXTogdHJ1ZX0gYXMgYW55KVxuXG4vKipcbiAqIFRvIGxldCBJbW1lciB0cmVhdCB5b3VyIGNsYXNzIGluc3RhbmNlcyBhcyBwbGFpbiBpbW11dGFibGUgb2JqZWN0c1xuICogKGFsYmVpdCB3aXRoIGEgY3VzdG9tIHByb3RvdHlwZSksIHlvdSBtdXN0IGRlZmluZSBlaXRoZXIgYW4gaW5zdGFuY2UgcHJvcGVydHlcbiAqIG9yIGEgc3RhdGljIHByb3BlcnR5IG9uIGVhY2ggb2YgeW91ciBjdXN0b20gY2xhc3Nlcy5cbiAqXG4gKiBPdGhlcndpc2UsIHlvdXIgY2xhc3MgaW5zdGFuY2Ugd2lsbCBuZXZlciBiZSBkcmFmdGVkLCB3aGljaCBtZWFucyBpdCB3b24ndCBiZVxuICogc2FmZSB0byBtdXRhdGUgaW4gYSBwcm9kdWNlIGNhbGxiYWNrLlxuICovXG5leHBvcnQgY29uc3QgRFJBRlRBQkxFOiB1bmlxdWUgc3ltYm9sID0gaGFzU3ltYm9sXG5cdD8gU3ltYm9sLmZvcihcImltbWVyLWRyYWZ0YWJsZVwiKVxuXHQ6IChcIl9fJGltbWVyX2RyYWZ0YWJsZVwiIGFzIGFueSlcblxuZXhwb3J0IGNvbnN0IERSQUZUX1NUQVRFOiB1bmlxdWUgc3ltYm9sID0gaGFzU3ltYm9sXG5cdD8gU3ltYm9sLmZvcihcImltbWVyLXN0YXRlXCIpXG5cdDogKFwiX18kaW1tZXJfc3RhdGVcIiBhcyBhbnkpXG5cbi8vIEV2ZW4gYSBwb2x5ZmlsbGVkIFN5bWJvbCBtaWdodCBwcm92aWRlIFN5bWJvbC5pdGVyYXRvclxuZXhwb3J0IGNvbnN0IGl0ZXJhdG9yU3ltYm9sOiB0eXBlb2YgU3ltYm9sLml0ZXJhdG9yID1cblx0KHR5cGVvZiBTeW1ib2wgIT0gXCJ1bmRlZmluZWRcIiAmJiBTeW1ib2wuaXRlcmF0b3IpIHx8IChcIkBAaXRlcmF0b3JcIiBhcyBhbnkpXG5cbi8qKiBVc2UgYSBjbGFzcyB0eXBlIGZvciBgbm90aGluZ2Agc28gaXRzIHR5cGUgaXMgdW5pcXVlICovXG5leHBvcnQgY2xhc3MgTm90aGluZyB7XG5cdC8vIFRoaXMgbGV0cyB1cyBkbyBgRXhjbHVkZTxULCBOb3RoaW5nPmBcblx0Ly8gQHRzLWlnbm9yZVxuXHRwcml2YXRlIF8hOiB1bmlxdWUgc3ltYm9sXG59XG4iLCAiaW1wb3J0IHByb2R1Y2UsIHsgZW5hYmxlRVM1IH0gZnJvbSAnaW1tZXInO1xuaW1wb3J0IHsgY29tYmluZVJlZHVjZXJzIH0gZnJvbSAncmVkdXgnO1xuLy8gbWFrZSBpdCB3b3JrIGluIElFMTFcbmVuYWJsZUVTNSgpO1xuZnVuY3Rpb24gY3JlYXRlQ29tYmluZVJlZHVjZXJzV2l0aEltbWVyKGJsYWNrbGlzdCkge1xuICAgIGlmIChibGFja2xpc3QgPT09IHZvaWQgMCkgeyBibGFja2xpc3QgPSBbXTsgfVxuICAgIHJldHVybiBmdW5jdGlvbiAocmVkdWNlcnMpIHtcbiAgICAgICAgdmFyIHJlZHVjZXJzV2l0aEltbWVyID0ge307XG4gICAgICAgIC8vIHJlZHVjZXIgbXVzdCByZXR1cm4gdmFsdWUgYmVjYXVzZSBsaXRlcmFsIGRvbid0IHN1cHBvcnQgaW1tZXJcbiAgICAgICAgT2JqZWN0LmtleXMocmVkdWNlcnMpLmZvckVhY2goZnVuY3Rpb24gKGtleSkge1xuICAgICAgICAgICAgdmFyIHJlZHVjZXJGbiA9IHJlZHVjZXJzW2tleV07XG4gICAgICAgICAgICByZWR1Y2Vyc1dpdGhJbW1lcltrZXldID0gZnVuY3Rpb24gKHN0YXRlLCBwYXlsb2FkKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHR5cGVvZiBzdGF0ZSA9PT0gJ29iamVjdCcgJiYgIWJsYWNrbGlzdC5pbmNsdWRlcyhrZXkpXG4gICAgICAgICAgICAgICAgICAgID8gcHJvZHVjZShzdGF0ZSwgZnVuY3Rpb24gKGRyYWZ0KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgbmV4dCA9IHJlZHVjZXJGbihkcmFmdCwgcGF5bG9hZCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodHlwZW9mIG5leHQgPT09ICdvYmplY3QnKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBuZXh0O1xuICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICA6IHJlZHVjZXJGbihzdGF0ZSwgcGF5bG9hZCk7XG4gICAgICAgICAgICB9O1xuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIGNvbWJpbmVSZWR1Y2VycyhyZWR1Y2Vyc1dpdGhJbW1lcik7XG4gICAgfTtcbn1cbi8vIGljZXN0b3JlIHBsdWdpblxudmFyIGltbWVyUGx1Z2luID0gZnVuY3Rpb24gKGNvbmZpZykge1xuICAgIGlmIChjb25maWcgPT09IHZvaWQgMCkgeyBjb25maWcgPSB7fTsgfVxuICAgIHJldHVybiAoe1xuICAgICAgICBjb25maWc6IHtcbiAgICAgICAgICAgIHJlZHV4OiB7XG4gICAgICAgICAgICAgICAgY29tYmluZVJlZHVjZXJzOiBjcmVhdGVDb21iaW5lUmVkdWNlcnNXaXRoSW1tZXIoY29uZmlnLmJsYWNrbGlzdCksXG4gICAgICAgICAgICB9LFxuICAgICAgICB9LFxuICAgIH0pO1xufTtcbmV4cG9ydCBkZWZhdWx0IGltbWVyUGx1Z2luO1xuIiwgInZhciBfX2Fzc2lnbiA9ICh0aGlzICYmIHRoaXMuX19hc3NpZ24pIHx8IGZ1bmN0aW9uICgpIHtcbiAgICBfX2Fzc2lnbiA9IE9iamVjdC5hc3NpZ24gfHwgZnVuY3Rpb24odCkge1xuICAgICAgICBmb3IgKHZhciBzLCBpID0gMSwgbiA9IGFyZ3VtZW50cy5sZW5ndGg7IGkgPCBuOyBpKyspIHtcbiAgICAgICAgICAgIHMgPSBhcmd1bWVudHNbaV07XG4gICAgICAgICAgICBmb3IgKHZhciBwIGluIHMpIGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwocywgcCkpXG4gICAgICAgICAgICAgICAgdFtwXSA9IHNbcF07XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHQ7XG4gICAgfTtcbiAgICByZXR1cm4gX19hc3NpZ24uYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbn07XG52YXIgX19hd2FpdGVyID0gKHRoaXMgJiYgdGhpcy5fX2F3YWl0ZXIpIHx8IGZ1bmN0aW9uICh0aGlzQXJnLCBfYXJndW1lbnRzLCBQLCBnZW5lcmF0b3IpIHtcbiAgICBmdW5jdGlvbiBhZG9wdCh2YWx1ZSkgeyByZXR1cm4gdmFsdWUgaW5zdGFuY2VvZiBQID8gdmFsdWUgOiBuZXcgUChmdW5jdGlvbiAocmVzb2x2ZSkgeyByZXNvbHZlKHZhbHVlKTsgfSk7IH1cbiAgICByZXR1cm4gbmV3IChQIHx8IChQID0gUHJvbWlzZSkpKGZ1bmN0aW9uIChyZXNvbHZlLCByZWplY3QpIHtcbiAgICAgICAgZnVuY3Rpb24gZnVsZmlsbGVkKHZhbHVlKSB7IHRyeSB7IHN0ZXAoZ2VuZXJhdG9yLm5leHQodmFsdWUpKTsgfSBjYXRjaCAoZSkgeyByZWplY3QoZSk7IH0gfVxuICAgICAgICBmdW5jdGlvbiByZWplY3RlZCh2YWx1ZSkgeyB0cnkgeyBzdGVwKGdlbmVyYXRvcltcInRocm93XCJdKHZhbHVlKSk7IH0gY2F0Y2ggKGUpIHsgcmVqZWN0KGUpOyB9IH1cbiAgICAgICAgZnVuY3Rpb24gc3RlcChyZXN1bHQpIHsgcmVzdWx0LmRvbmUgPyByZXNvbHZlKHJlc3VsdC52YWx1ZSkgOiBhZG9wdChyZXN1bHQudmFsdWUpLnRoZW4oZnVsZmlsbGVkLCByZWplY3RlZCk7IH1cbiAgICAgICAgc3RlcCgoZ2VuZXJhdG9yID0gZ2VuZXJhdG9yLmFwcGx5KHRoaXNBcmcsIF9hcmd1bWVudHMgfHwgW10pKS5uZXh0KCkpO1xuICAgIH0pO1xufTtcbnZhciBfX2dlbmVyYXRvciA9ICh0aGlzICYmIHRoaXMuX19nZW5lcmF0b3IpIHx8IGZ1bmN0aW9uICh0aGlzQXJnLCBib2R5KSB7XG4gICAgdmFyIF8gPSB7IGxhYmVsOiAwLCBzZW50OiBmdW5jdGlvbigpIHsgaWYgKHRbMF0gJiAxKSB0aHJvdyB0WzFdOyByZXR1cm4gdFsxXTsgfSwgdHJ5czogW10sIG9wczogW10gfSwgZiwgeSwgdCwgZztcbiAgICByZXR1cm4gZyA9IHsgbmV4dDogdmVyYigwKSwgXCJ0aHJvd1wiOiB2ZXJiKDEpLCBcInJldHVyblwiOiB2ZXJiKDIpIH0sIHR5cGVvZiBTeW1ib2wgPT09IFwiZnVuY3Rpb25cIiAmJiAoZ1tTeW1ib2wuaXRlcmF0b3JdID0gZnVuY3Rpb24oKSB7IHJldHVybiB0aGlzOyB9KSwgZztcbiAgICBmdW5jdGlvbiB2ZXJiKG4pIHsgcmV0dXJuIGZ1bmN0aW9uICh2KSB7IHJldHVybiBzdGVwKFtuLCB2XSk7IH07IH1cbiAgICBmdW5jdGlvbiBzdGVwKG9wKSB7XG4gICAgICAgIGlmIChmKSB0aHJvdyBuZXcgVHlwZUVycm9yKFwiR2VuZXJhdG9yIGlzIGFscmVhZHkgZXhlY3V0aW5nLlwiKTtcbiAgICAgICAgd2hpbGUgKF8pIHRyeSB7XG4gICAgICAgICAgICBpZiAoZiA9IDEsIHkgJiYgKHQgPSBvcFswXSAmIDIgPyB5W1wicmV0dXJuXCJdIDogb3BbMF0gPyB5W1widGhyb3dcIl0gfHwgKCh0ID0geVtcInJldHVyblwiXSkgJiYgdC5jYWxsKHkpLCAwKSA6IHkubmV4dCkgJiYgISh0ID0gdC5jYWxsKHksIG9wWzFdKSkuZG9uZSkgcmV0dXJuIHQ7XG4gICAgICAgICAgICBpZiAoeSA9IDAsIHQpIG9wID0gW29wWzBdICYgMiwgdC52YWx1ZV07XG4gICAgICAgICAgICBzd2l0Y2ggKG9wWzBdKSB7XG4gICAgICAgICAgICAgICAgY2FzZSAwOiBjYXNlIDE6IHQgPSBvcDsgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSA0OiBfLmxhYmVsKys7IHJldHVybiB7IHZhbHVlOiBvcFsxXSwgZG9uZTogZmFsc2UgfTtcbiAgICAgICAgICAgICAgICBjYXNlIDU6IF8ubGFiZWwrKzsgeSA9IG9wWzFdOyBvcCA9IFswXTsgY29udGludWU7XG4gICAgICAgICAgICAgICAgY2FzZSA3OiBvcCA9IF8ub3BzLnBvcCgpOyBfLnRyeXMucG9wKCk7IGNvbnRpbnVlO1xuICAgICAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgICAgIGlmICghKHQgPSBfLnRyeXMsIHQgPSB0Lmxlbmd0aCA+IDAgJiYgdFt0Lmxlbmd0aCAtIDFdKSAmJiAob3BbMF0gPT09IDYgfHwgb3BbMF0gPT09IDIpKSB7IF8gPSAwOyBjb250aW51ZTsgfVxuICAgICAgICAgICAgICAgICAgICBpZiAob3BbMF0gPT09IDMgJiYgKCF0IHx8IChvcFsxXSA+IHRbMF0gJiYgb3BbMV0gPCB0WzNdKSkpIHsgXy5sYWJlbCA9IG9wWzFdOyBicmVhazsgfVxuICAgICAgICAgICAgICAgICAgICBpZiAob3BbMF0gPT09IDYgJiYgXy5sYWJlbCA8IHRbMV0pIHsgXy5sYWJlbCA9IHRbMV07IHQgPSBvcDsgYnJlYWs7IH1cbiAgICAgICAgICAgICAgICAgICAgaWYgKHQgJiYgXy5sYWJlbCA8IHRbMl0pIHsgXy5sYWJlbCA9IHRbMl07IF8ub3BzLnB1c2gob3ApOyBicmVhazsgfVxuICAgICAgICAgICAgICAgICAgICBpZiAodFsyXSkgXy5vcHMucG9wKCk7XG4gICAgICAgICAgICAgICAgICAgIF8udHJ5cy5wb3AoKTsgY29udGludWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBvcCA9IGJvZHkuY2FsbCh0aGlzQXJnLCBfKTtcbiAgICAgICAgfSBjYXRjaCAoZSkgeyBvcCA9IFs2LCBlXTsgeSA9IDA7IH0gZmluYWxseSB7IGYgPSB0ID0gMDsgfVxuICAgICAgICBpZiAob3BbMF0gJiA1KSB0aHJvdyBvcFsxXTsgcmV0dXJuIHsgdmFsdWU6IG9wWzBdID8gb3BbMV0gOiB2b2lkIDAsIGRvbmU6IHRydWUgfTtcbiAgICB9XG59O1xudmFyIGNudFN0YXRlID0ge1xuICAgIGdsb2JhbDogMCxcbiAgICBtb2RlbHM6IHt9LFxuICAgIGVmZmVjdHM6IHt9LFxufTtcbnZhciBuZXh0U3RhdGUgPSBfX2Fzc2lnbihfX2Fzc2lnbih7fSwgY250U3RhdGUpLCB7IG1vZGVsczogX19hc3NpZ24oe30sIGNudFN0YXRlLm1vZGVscyksIGVmZmVjdHM6IF9fYXNzaWduKHt9LCBjbnRTdGF0ZS5lZmZlY3RzKSB9KTtcbnZhciBjcmVhdGVMb2FkaW5nQWN0aW9uID0gZnVuY3Rpb24gKGNvbnZlcnRlciwgaSkgeyByZXR1cm4gZnVuY3Rpb24gKHN0YXRlLCBfYSkge1xuICAgIHZhciBfYiwgX2MsIF9kO1xuICAgIHZhciBuYW1lID0gX2EubmFtZSwgYWN0aW9uID0gX2EuYWN0aW9uO1xuICAgIG5leHRTdGF0ZS5nbG9iYWwgKz0gaTtcbiAgICBpZiAodHlwZW9mIG5leHRTdGF0ZS5tb2RlbHNbbmFtZV0gPT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgIG5leHRTdGF0ZS5tb2RlbHNbbmFtZV0gPSAwO1xuICAgIH1cbiAgICBuZXh0U3RhdGUubW9kZWxzW25hbWVdICs9IGk7XG4gICAgaWYgKHR5cGVvZiBuZXh0U3RhdGUuZWZmZWN0c1tuYW1lXSA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgbmV4dFN0YXRlLmVmZmVjdHNbbmFtZV0gPSB7fTtcbiAgICB9XG4gICAgaWYgKHR5cGVvZiBuZXh0U3RhdGUuZWZmZWN0c1tuYW1lXVthY3Rpb25dID09PSAndW5kZWZpbmVkJykge1xuICAgICAgICBuZXh0U3RhdGUuZWZmZWN0c1tuYW1lXVthY3Rpb25dID0gMDtcbiAgICB9XG4gICAgbmV4dFN0YXRlLmVmZmVjdHNbbmFtZV1bYWN0aW9uXSArPSBpO1xuICAgIHJldHVybiBfX2Fzc2lnbihfX2Fzc2lnbih7fSwgc3RhdGUpLCB7IGdsb2JhbDogY29udmVydGVyKG5leHRTdGF0ZS5nbG9iYWwpLCBtb2RlbHM6IF9fYXNzaWduKF9fYXNzaWduKHt9LCBzdGF0ZS5tb2RlbHMpLCAoX2IgPSB7fSwgX2JbbmFtZV0gPSBjb252ZXJ0ZXIobmV4dFN0YXRlLm1vZGVsc1tuYW1lXSksIF9iKSksIGVmZmVjdHM6IF9fYXNzaWduKF9fYXNzaWduKHt9LCBzdGF0ZS5lZmZlY3RzKSwgKF9jID0ge30sIF9jW25hbWVdID0gX19hc3NpZ24oX19hc3NpZ24oe30sIHN0YXRlLmVmZmVjdHNbbmFtZV0pLCAoX2QgPSB7fSwgX2RbYWN0aW9uXSA9IGNvbnZlcnRlcihuZXh0U3RhdGUuZWZmZWN0c1tuYW1lXVthY3Rpb25dKSwgX2QpKSwgX2MpKSB9KTtcbn07IH07XG52YXIgdmFsaWRhdGVDb25maWcgPSBmdW5jdGlvbiAoY29uZmlnKSB7XG4gICAgaWYgKGNvbmZpZy5uYW1lICYmIHR5cGVvZiBjb25maWcubmFtZSAhPT0gJ3N0cmluZycpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdsb2FkaW5nIHBsdWdpbiBjb25maWcgbmFtZSBtdXN0IGJlIGEgc3RyaW5nJyk7XG4gICAgfVxuICAgIGlmIChjb25maWcuYXNOdW1iZXIgJiYgdHlwZW9mIGNvbmZpZy5hc051bWJlciAhPT0gJ2Jvb2xlYW4nKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcignbG9hZGluZyBwbHVnaW4gY29uZmlnIGFzTnVtYmVyIG11c3QgYmUgYSBib29sZWFuJyk7XG4gICAgfVxuICAgIGlmIChjb25maWcud2hpdGVsaXN0ICYmICFBcnJheS5pc0FycmF5KGNvbmZpZy53aGl0ZWxpc3QpKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcignbG9hZGluZyBwbHVnaW4gY29uZmlnIHdoaXRlbGlzdCBtdXN0IGJlIGFuIGFycmF5IG9mIHN0cmluZ3MnKTtcbiAgICB9XG4gICAgaWYgKGNvbmZpZy5ibGFja2xpc3QgJiYgIUFycmF5LmlzQXJyYXkoY29uZmlnLmJsYWNrbGlzdCkpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdsb2FkaW5nIHBsdWdpbiBjb25maWcgYmxhY2tsaXN0IG11c3QgYmUgYW4gYXJyYXkgb2Ygc3RyaW5ncycpO1xuICAgIH1cbiAgICBpZiAoY29uZmlnLndoaXRlbGlzdCAmJiBjb25maWcuYmxhY2tsaXN0KSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcignbG9hZGluZyBwbHVnaW4gY29uZmlnIGNhbm5vdCBoYXZlIGJvdGggYSB3aGl0ZWxpc3QgJiBhIGJsYWNrbGlzdCcpO1xuICAgIH1cbn07XG5leHBvcnQgZGVmYXVsdCAoZnVuY3Rpb24gKGNvbmZpZykge1xuICAgIGlmIChjb25maWcgPT09IHZvaWQgMCkgeyBjb25maWcgPSB7fTsgfVxuICAgIHZhbGlkYXRlQ29uZmlnKGNvbmZpZyk7XG4gICAgdmFyIGxvYWRpbmdNb2RlbE5hbWUgPSBjb25maWcubmFtZSB8fCAnbG9hZGluZyc7XG4gICAgdmFyIGNvbnZlcnRlciA9IGNvbmZpZy5hc051bWJlciA9PT0gdHJ1ZSA/IGZ1bmN0aW9uIChjbnQpIHsgcmV0dXJuIGNudDsgfSA6IGZ1bmN0aW9uIChjbnQpIHsgcmV0dXJuIGNudCA+IDA7IH07XG4gICAgdmFyIGxvYWRpbmcgPSB7XG4gICAgICAgIG5hbWU6IGxvYWRpbmdNb2RlbE5hbWUsXG4gICAgICAgIHJlZHVjZXJzOiB7XG4gICAgICAgICAgICBoaWRlOiBjcmVhdGVMb2FkaW5nQWN0aW9uKGNvbnZlcnRlciwgLTEpLFxuICAgICAgICAgICAgc2hvdzogY3JlYXRlTG9hZGluZ0FjdGlvbihjb252ZXJ0ZXIsIDEpLFxuICAgICAgICB9LFxuICAgICAgICBzdGF0ZTogX19hc3NpZ24oe30sIGNudFN0YXRlKSxcbiAgICB9O1xuICAgIGNudFN0YXRlLmdsb2JhbCA9IDA7XG4gICAgbG9hZGluZy5zdGF0ZS5nbG9iYWwgPSBjb252ZXJ0ZXIoY250U3RhdGUuZ2xvYmFsKTtcbiAgICByZXR1cm4ge1xuICAgICAgICBjb25maWc6IHtcbiAgICAgICAgICAgIG1vZGVsczoge1xuICAgICAgICAgICAgICAgIGxvYWRpbmc6IGxvYWRpbmcsXG4gICAgICAgICAgICB9LFxuICAgICAgICB9LFxuICAgICAgICBvbk1vZGVsOiBmdW5jdGlvbiAoX2EpIHtcbiAgICAgICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XG4gICAgICAgICAgICB2YXIgbmFtZSA9IF9hLm5hbWU7XG4gICAgICAgICAgICAvLyBkbyBub3QgcnVuIGRpc3BhdGNoIG9uICdsb2FkaW5nJyBtb2RlbFxuICAgICAgICAgICAgaWYgKG5hbWUgPT09IGxvYWRpbmdNb2RlbE5hbWUpIHtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjbnRTdGF0ZS5tb2RlbHNbbmFtZV0gPSAwO1xuICAgICAgICAgICAgbG9hZGluZy5zdGF0ZS5tb2RlbHNbbmFtZV0gPSBjb252ZXJ0ZXIoY250U3RhdGUubW9kZWxzW25hbWVdKTtcbiAgICAgICAgICAgIGxvYWRpbmcuc3RhdGUuZWZmZWN0c1tuYW1lXSA9IHt9O1xuICAgICAgICAgICAgdmFyIG1vZGVsQWN0aW9ucyA9IHRoaXMuZGlzcGF0Y2hbbmFtZV07XG4gICAgICAgICAgICAvLyBtYXAgb3ZlciBlZmZlY3RzIHdpdGhpbiBtb2RlbHNcbiAgICAgICAgICAgIE9iamVjdC5rZXlzKG1vZGVsQWN0aW9ucykuZm9yRWFjaChmdW5jdGlvbiAoYWN0aW9uKSB7XG4gICAgICAgICAgICAgICAgaWYgKF90aGlzLmRpc3BhdGNoW25hbWVdW2FjdGlvbl0uaXNFZmZlY3QgIT09IHRydWUpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBjbnRTdGF0ZS5lZmZlY3RzW25hbWVdW2FjdGlvbl0gPSAwO1xuICAgICAgICAgICAgICAgIGxvYWRpbmcuc3RhdGUuZWZmZWN0c1tuYW1lXVthY3Rpb25dID0gY29udmVydGVyKGNudFN0YXRlLmVmZmVjdHNbbmFtZV1bYWN0aW9uXSk7XG4gICAgICAgICAgICAgICAgdmFyIGFjdGlvblR5cGUgPSBuYW1lICsgXCIvXCIgKyBhY3Rpb247XG4gICAgICAgICAgICAgICAgLy8gaWdub3JlIGl0ZW1zIG5vdCBpbiB3aGl0ZWxpc3RcbiAgICAgICAgICAgICAgICBpZiAoY29uZmlnLndoaXRlbGlzdCAmJiAhY29uZmlnLndoaXRlbGlzdC5pbmNsdWRlcyhhY3Rpb25UeXBlKSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIC8vIGlnbm9yZSBpdGVtcyBpbiBibGFja2xpc3RcbiAgICAgICAgICAgICAgICBpZiAoY29uZmlnLmJsYWNrbGlzdCAmJiBjb25maWcuYmxhY2tsaXN0LmluY2x1ZGVzKGFjdGlvblR5cGUpKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgLy8gY29weSBvcmlnIGVmZmVjdCBwb2ludGVyXG4gICAgICAgICAgICAgICAgdmFyIG9yaWdFZmZlY3QgPSBfdGhpcy5kaXNwYXRjaFtuYW1lXVthY3Rpb25dO1xuICAgICAgICAgICAgICAgIC8vIGNyZWF0ZSBmdW5jdGlvbiB3aXRoIHByZSAmIHBvc3QgbG9hZGluZyBjYWxsc1xuICAgICAgICAgICAgICAgIHZhciBlZmZlY3RXcmFwcGVyID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICB2YXIgcHJvcHMgPSBbXTtcbiAgICAgICAgICAgICAgICAgICAgZm9yICh2YXIgX2kgPSAwOyBfaSA8IGFyZ3VtZW50cy5sZW5ndGg7IF9pKyspIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHByb3BzW19pXSA9IGFyZ3VtZW50c1tfaV07XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIF9fYXdhaXRlcihfdGhpcywgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBlZmZlY3RSZXN1bHQsIGVycm9yXzE7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gX19nZW5lcmF0b3IodGhpcywgZnVuY3Rpb24gKF9hKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc3dpdGNoIChfYS5sYWJlbCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlIDA6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBfYS50cnlzLnB1c2goWzAsIDIsICwgM10pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5kaXNwYXRjaC5sb2FkaW5nLnNob3coeyBuYW1lOiBuYW1lLCBhY3Rpb246IGFjdGlvbiB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBbNCAvKnlpZWxkKi8sIG9yaWdFZmZlY3QuYXBwbHkodm9pZCAwLCBwcm9wcyldO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlIDE6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBlZmZlY3RSZXN1bHQgPSBfYS5zZW50KCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmRpc3BhdGNoLmxvYWRpbmcuaGlkZSh7IG5hbWU6IG5hbWUsIGFjdGlvbjogYWN0aW9uIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFsyIC8qcmV0dXJuKi8sIGVmZmVjdFJlc3VsdF07XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgMjpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVycm9yXzEgPSBfYS5zZW50KCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmRpc3BhdGNoLmxvYWRpbmcuaGlkZSh7IG5hbWU6IG5hbWUsIGFjdGlvbjogYWN0aW9uIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhyb3cgZXJyb3JfMTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSAzOiByZXR1cm4gWzIgLypyZXR1cm4qL107XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgZWZmZWN0V3JhcHBlci5pc0VmZmVjdCA9IHRydWU7XG4gICAgICAgICAgICAgICAgLy8gcmVwbGFjZSBleGlzdGluZyBlZmZlY3Qgd2l0aCBuZXcgd3JhcHBlclxuICAgICAgICAgICAgICAgIF90aGlzLmRpc3BhdGNoW25hbWVdW2FjdGlvbl0gPSBlZmZlY3RXcmFwcGVyO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0sXG4gICAgfTtcbn0pO1xuIiwgInZhciBfX2Fzc2lnbiA9ICh0aGlzICYmIHRoaXMuX19hc3NpZ24pIHx8IGZ1bmN0aW9uICgpIHtcbiAgICBfX2Fzc2lnbiA9IE9iamVjdC5hc3NpZ24gfHwgZnVuY3Rpb24odCkge1xuICAgICAgICBmb3IgKHZhciBzLCBpID0gMSwgbiA9IGFyZ3VtZW50cy5sZW5ndGg7IGkgPCBuOyBpKyspIHtcbiAgICAgICAgICAgIHMgPSBhcmd1bWVudHNbaV07XG4gICAgICAgICAgICBmb3IgKHZhciBwIGluIHMpIGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwocywgcCkpXG4gICAgICAgICAgICAgICAgdFtwXSA9IHNbcF07XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHQ7XG4gICAgfTtcbiAgICByZXR1cm4gX19hc3NpZ24uYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbn07XG52YXIgX19hd2FpdGVyID0gKHRoaXMgJiYgdGhpcy5fX2F3YWl0ZXIpIHx8IGZ1bmN0aW9uICh0aGlzQXJnLCBfYXJndW1lbnRzLCBQLCBnZW5lcmF0b3IpIHtcbiAgICBmdW5jdGlvbiBhZG9wdCh2YWx1ZSkgeyByZXR1cm4gdmFsdWUgaW5zdGFuY2VvZiBQID8gdmFsdWUgOiBuZXcgUChmdW5jdGlvbiAocmVzb2x2ZSkgeyByZXNvbHZlKHZhbHVlKTsgfSk7IH1cbiAgICByZXR1cm4gbmV3IChQIHx8IChQID0gUHJvbWlzZSkpKGZ1bmN0aW9uIChyZXNvbHZlLCByZWplY3QpIHtcbiAgICAgICAgZnVuY3Rpb24gZnVsZmlsbGVkKHZhbHVlKSB7IHRyeSB7IHN0ZXAoZ2VuZXJhdG9yLm5leHQodmFsdWUpKTsgfSBjYXRjaCAoZSkgeyByZWplY3QoZSk7IH0gfVxuICAgICAgICBmdW5jdGlvbiByZWplY3RlZCh2YWx1ZSkgeyB0cnkgeyBzdGVwKGdlbmVyYXRvcltcInRocm93XCJdKHZhbHVlKSk7IH0gY2F0Y2ggKGUpIHsgcmVqZWN0KGUpOyB9IH1cbiAgICAgICAgZnVuY3Rpb24gc3RlcChyZXN1bHQpIHsgcmVzdWx0LmRvbmUgPyByZXNvbHZlKHJlc3VsdC52YWx1ZSkgOiBhZG9wdChyZXN1bHQudmFsdWUpLnRoZW4oZnVsZmlsbGVkLCByZWplY3RlZCk7IH1cbiAgICAgICAgc3RlcCgoZ2VuZXJhdG9yID0gZ2VuZXJhdG9yLmFwcGx5KHRoaXNBcmcsIF9hcmd1bWVudHMgfHwgW10pKS5uZXh0KCkpO1xuICAgIH0pO1xufTtcbnZhciBfX2dlbmVyYXRvciA9ICh0aGlzICYmIHRoaXMuX19nZW5lcmF0b3IpIHx8IGZ1bmN0aW9uICh0aGlzQXJnLCBib2R5KSB7XG4gICAgdmFyIF8gPSB7IGxhYmVsOiAwLCBzZW50OiBmdW5jdGlvbigpIHsgaWYgKHRbMF0gJiAxKSB0aHJvdyB0WzFdOyByZXR1cm4gdFsxXTsgfSwgdHJ5czogW10sIG9wczogW10gfSwgZiwgeSwgdCwgZztcbiAgICByZXR1cm4gZyA9IHsgbmV4dDogdmVyYigwKSwgXCJ0aHJvd1wiOiB2ZXJiKDEpLCBcInJldHVyblwiOiB2ZXJiKDIpIH0sIHR5cGVvZiBTeW1ib2wgPT09IFwiZnVuY3Rpb25cIiAmJiAoZ1tTeW1ib2wuaXRlcmF0b3JdID0gZnVuY3Rpb24oKSB7IHJldHVybiB0aGlzOyB9KSwgZztcbiAgICBmdW5jdGlvbiB2ZXJiKG4pIHsgcmV0dXJuIGZ1bmN0aW9uICh2KSB7IHJldHVybiBzdGVwKFtuLCB2XSk7IH07IH1cbiAgICBmdW5jdGlvbiBzdGVwKG9wKSB7XG4gICAgICAgIGlmIChmKSB0aHJvdyBuZXcgVHlwZUVycm9yKFwiR2VuZXJhdG9yIGlzIGFscmVhZHkgZXhlY3V0aW5nLlwiKTtcbiAgICAgICAgd2hpbGUgKF8pIHRyeSB7XG4gICAgICAgICAgICBpZiAoZiA9IDEsIHkgJiYgKHQgPSBvcFswXSAmIDIgPyB5W1wicmV0dXJuXCJdIDogb3BbMF0gPyB5W1widGhyb3dcIl0gfHwgKCh0ID0geVtcInJldHVyblwiXSkgJiYgdC5jYWxsKHkpLCAwKSA6IHkubmV4dCkgJiYgISh0ID0gdC5jYWxsKHksIG9wWzFdKSkuZG9uZSkgcmV0dXJuIHQ7XG4gICAgICAgICAgICBpZiAoeSA9IDAsIHQpIG9wID0gW29wWzBdICYgMiwgdC52YWx1ZV07XG4gICAgICAgICAgICBzd2l0Y2ggKG9wWzBdKSB7XG4gICAgICAgICAgICAgICAgY2FzZSAwOiBjYXNlIDE6IHQgPSBvcDsgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSA0OiBfLmxhYmVsKys7IHJldHVybiB7IHZhbHVlOiBvcFsxXSwgZG9uZTogZmFsc2UgfTtcbiAgICAgICAgICAgICAgICBjYXNlIDU6IF8ubGFiZWwrKzsgeSA9IG9wWzFdOyBvcCA9IFswXTsgY29udGludWU7XG4gICAgICAgICAgICAgICAgY2FzZSA3OiBvcCA9IF8ub3BzLnBvcCgpOyBfLnRyeXMucG9wKCk7IGNvbnRpbnVlO1xuICAgICAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgICAgIGlmICghKHQgPSBfLnRyeXMsIHQgPSB0Lmxlbmd0aCA+IDAgJiYgdFt0Lmxlbmd0aCAtIDFdKSAmJiAob3BbMF0gPT09IDYgfHwgb3BbMF0gPT09IDIpKSB7IF8gPSAwOyBjb250aW51ZTsgfVxuICAgICAgICAgICAgICAgICAgICBpZiAob3BbMF0gPT09IDMgJiYgKCF0IHx8IChvcFsxXSA+IHRbMF0gJiYgb3BbMV0gPCB0WzNdKSkpIHsgXy5sYWJlbCA9IG9wWzFdOyBicmVhazsgfVxuICAgICAgICAgICAgICAgICAgICBpZiAob3BbMF0gPT09IDYgJiYgXy5sYWJlbCA8IHRbMV0pIHsgXy5sYWJlbCA9IHRbMV07IHQgPSBvcDsgYnJlYWs7IH1cbiAgICAgICAgICAgICAgICAgICAgaWYgKHQgJiYgXy5sYWJlbCA8IHRbMl0pIHsgXy5sYWJlbCA9IHRbMl07IF8ub3BzLnB1c2gob3ApOyBicmVhazsgfVxuICAgICAgICAgICAgICAgICAgICBpZiAodFsyXSkgXy5vcHMucG9wKCk7XG4gICAgICAgICAgICAgICAgICAgIF8udHJ5cy5wb3AoKTsgY29udGludWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBvcCA9IGJvZHkuY2FsbCh0aGlzQXJnLCBfKTtcbiAgICAgICAgfSBjYXRjaCAoZSkgeyBvcCA9IFs2LCBlXTsgeSA9IDA7IH0gZmluYWxseSB7IGYgPSB0ID0gMDsgfVxuICAgICAgICBpZiAob3BbMF0gJiA1KSB0aHJvdyBvcFsxXTsgcmV0dXJuIHsgdmFsdWU6IG9wWzBdID8gb3BbMV0gOiB2b2lkIDAsIGRvbmU6IHRydWUgfTtcbiAgICB9XG59O1xudmFyIGRlZmF1bHRWYWx1ZSA9IHtcbiAgICBlcnJvcjogbnVsbCxcbiAgICB2YWx1ZTogMCxcbn07XG52YXIgY250U3RhdGUgPSB7XG4gICAgZ2xvYmFsOiBfX2Fzc2lnbih7fSwgZGVmYXVsdFZhbHVlKSxcbiAgICBtb2RlbHM6IHt9LFxuICAgIGVmZmVjdHM6IHt9LFxufTtcbnZhciBuZXh0U3RhdGUgPSB7XG4gICAgZ2xvYmFsOiBfX2Fzc2lnbih7fSwgY250U3RhdGUuZ2xvYmFsKSxcbiAgICBtb2RlbHM6IF9fYXNzaWduKHt9LCBjbnRTdGF0ZS5tb2RlbHMpLFxuICAgIGVmZmVjdHM6IF9fYXNzaWduKHt9LCBjbnRTdGF0ZS5lZmZlY3RzKSxcbn07XG5mdW5jdGlvbiBmYWxsYmFjayh2YWx1ZSkge1xuICAgIHJldHVybiB2YWx1ZSA8IDAgPyAwIDogdmFsdWU7XG59XG52YXIgY3JlYXRlRXJyb3JBY3Rpb24gPSBmdW5jdGlvbiAoY29udmVydGVyLCBpKSB7IHJldHVybiBmdW5jdGlvbiAoc3RhdGUsIF9hLCBlcnJvcikge1xuICAgIHZhciBfYiwgX2MsIF9kO1xuICAgIHZhciBuYW1lID0gX2EubmFtZSwgYWN0aW9uID0gX2EuYWN0aW9uO1xuICAgIG5leHRTdGF0ZS5nbG9iYWwgPSB7XG4gICAgICAgIHZhbHVlOiBmYWxsYmFjayhuZXh0U3RhdGUuZ2xvYmFsLnZhbHVlICsgaSksXG4gICAgICAgIGVycm9yOiBlcnJvcixcbiAgICB9O1xuICAgIGlmICh0eXBlb2YgbmV4dFN0YXRlLm1vZGVsc1tuYW1lXSA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgbmV4dFN0YXRlLm1vZGVsc1tuYW1lXSA9IF9fYXNzaWduKHt9LCBkZWZhdWx0VmFsdWUpO1xuICAgIH1cbiAgICBuZXh0U3RhdGUubW9kZWxzW25hbWVdID0ge1xuICAgICAgICB2YWx1ZTogZmFsbGJhY2sobmV4dFN0YXRlLm1vZGVsc1tuYW1lXS52YWx1ZSArIGkpLFxuICAgICAgICBlcnJvcjogZXJyb3IsXG4gICAgfTtcbiAgICBpZiAodHlwZW9mIG5leHRTdGF0ZS5lZmZlY3RzW25hbWVdID09PSAndW5kZWZpbmVkJykge1xuICAgICAgICBuZXh0U3RhdGUuZWZmZWN0c1tuYW1lXSA9IHt9O1xuICAgIH1cbiAgICBpZiAodHlwZW9mIG5leHRTdGF0ZS5lZmZlY3RzW25hbWVdW2FjdGlvbl0gPT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgIG5leHRTdGF0ZS5lZmZlY3RzW25hbWVdW2FjdGlvbl0gPSBfX2Fzc2lnbih7fSwgZGVmYXVsdFZhbHVlKTtcbiAgICB9XG4gICAgbmV4dFN0YXRlLmVmZmVjdHNbbmFtZV1bYWN0aW9uXSA9IHtcbiAgICAgICAgdmFsdWU6IGZhbGxiYWNrKG5leHRTdGF0ZS5lZmZlY3RzW25hbWVdW2FjdGlvbl0udmFsdWUgKyBpKSxcbiAgICAgICAgZXJyb3I6IGVycm9yLFxuICAgIH07XG4gICAgcmV0dXJuIF9fYXNzaWduKF9fYXNzaWduKHt9LCBzdGF0ZSksIHsgZ2xvYmFsOiBjb252ZXJ0ZXIobmV4dFN0YXRlLmdsb2JhbCksIG1vZGVsczogX19hc3NpZ24oX19hc3NpZ24oe30sIHN0YXRlLm1vZGVscyksIChfYiA9IHt9LCBfYltuYW1lXSA9IGNvbnZlcnRlcihuZXh0U3RhdGUubW9kZWxzW25hbWVdKSwgX2IpKSwgZWZmZWN0czogX19hc3NpZ24oX19hc3NpZ24oe30sIHN0YXRlLmVmZmVjdHMpLCAoX2MgPSB7fSwgX2NbbmFtZV0gPSBfX2Fzc2lnbihfX2Fzc2lnbih7fSwgc3RhdGUuZWZmZWN0c1tuYW1lXSksIChfZCA9IHt9LCBfZFthY3Rpb25dID0gY29udmVydGVyKG5leHRTdGF0ZS5lZmZlY3RzW25hbWVdW2FjdGlvbl0pLCBfZCkpLCBfYykpIH0pO1xufTsgfTtcbnZhciB2YWxpZGF0ZUNvbmZpZyA9IGZ1bmN0aW9uIChjb25maWcpIHtcbiAgICBpZiAoY29uZmlnLm5hbWUgJiYgdHlwZW9mIGNvbmZpZy5uYW1lICE9PSAnc3RyaW5nJykge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ2Vycm9yIHBsdWdpbiBjb25maWcgbmFtZSBtdXN0IGJlIGEgc3RyaW5nJyk7XG4gICAgfVxuICAgIGlmIChjb25maWcuYXNOdW1iZXIgJiYgdHlwZW9mIGNvbmZpZy5hc051bWJlciAhPT0gJ2Jvb2xlYW4nKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcignZXJyb3IgcGx1Z2luIGNvbmZpZyBhc051bWJlciBtdXN0IGJlIGEgYm9vbGVhbicpO1xuICAgIH1cbiAgICBpZiAoY29uZmlnLndoaXRlbGlzdCAmJiAhQXJyYXkuaXNBcnJheShjb25maWcud2hpdGVsaXN0KSkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ2Vycm9yIHBsdWdpbiBjb25maWcgd2hpdGVsaXN0IG11c3QgYmUgYW4gYXJyYXkgb2Ygc3RyaW5ncycpO1xuICAgIH1cbiAgICBpZiAoY29uZmlnLmJsYWNrbGlzdCAmJiAhQXJyYXkuaXNBcnJheShjb25maWcuYmxhY2tsaXN0KSkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ2Vycm9yIHBsdWdpbiBjb25maWcgYmxhY2tsaXN0IG11c3QgYmUgYW4gYXJyYXkgb2Ygc3RyaW5ncycpO1xuICAgIH1cbiAgICBpZiAoY29uZmlnLndoaXRlbGlzdCAmJiBjb25maWcuYmxhY2tsaXN0KSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcignZXJyb3IgcGx1Z2luIGNvbmZpZyBjYW5ub3QgaGF2ZSBib3RoIGEgd2hpdGVsaXN0ICYgYSBibGFja2xpc3QnKTtcbiAgICB9XG59O1xuZXhwb3J0IGRlZmF1bHQgKGZ1bmN0aW9uIChjb25maWcpIHtcbiAgICBpZiAoY29uZmlnID09PSB2b2lkIDApIHsgY29uZmlnID0ge307IH1cbiAgICB2YWxpZGF0ZUNvbmZpZyhjb25maWcpO1xuICAgIHZhciBlcnJvck1vZGVsTmFtZSA9IGNvbmZpZy5uYW1lIHx8ICdlcnJvcic7XG4gICAgdmFyIGNvbnZlcnRlciA9IGNvbmZpZy5hc051bWJlciA9PT0gdHJ1ZVxuICAgICAgICA/IGZ1bmN0aW9uIChjbnQpIHsgcmV0dXJuIGNudDsgfVxuICAgICAgICA6IGZ1bmN0aW9uIChjbnQpIHsgcmV0dXJuIChfX2Fzc2lnbihfX2Fzc2lnbih7fSwgY250KSwgeyB2YWx1ZTogY250LnZhbHVlID4gMCB9KSk7IH07XG4gICAgdmFyIGVycm9yID0ge1xuICAgICAgICBuYW1lOiBlcnJvck1vZGVsTmFtZSxcbiAgICAgICAgcmVkdWNlcnM6IHtcbiAgICAgICAgICAgIGhpZGU6IGNyZWF0ZUVycm9yQWN0aW9uKGNvbnZlcnRlciwgLTEpLFxuICAgICAgICAgICAgc2hvdzogY3JlYXRlRXJyb3JBY3Rpb24oY29udmVydGVyLCAxKSxcbiAgICAgICAgfSxcbiAgICAgICAgc3RhdGU6IF9fYXNzaWduKHt9LCBjbnRTdGF0ZSksXG4gICAgfTtcbiAgICBjbnRTdGF0ZS5nbG9iYWwgPSBfX2Fzc2lnbih7fSwgZGVmYXVsdFZhbHVlKTtcbiAgICBlcnJvci5zdGF0ZS5nbG9iYWwgPSBjb252ZXJ0ZXIoY250U3RhdGUuZ2xvYmFsKTtcbiAgICByZXR1cm4ge1xuICAgICAgICBjb25maWc6IHtcbiAgICAgICAgICAgIG1vZGVsczoge1xuICAgICAgICAgICAgICAgIGVycm9yOiBlcnJvcixcbiAgICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgICAgIG9uTW9kZWw6IGZ1bmN0aW9uIChfYSkge1xuICAgICAgICAgICAgdmFyIF90aGlzID0gdGhpcztcbiAgICAgICAgICAgIHZhciBuYW1lID0gX2EubmFtZTtcbiAgICAgICAgICAgIC8vIGRvIG5vdCBydW4gZGlzcGF0Y2ggb24gJ2Vycm9yJyBtb2RlbFxuICAgICAgICAgICAgaWYgKG5hbWUgPT09IGVycm9yTW9kZWxOYW1lKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY250U3RhdGUubW9kZWxzW25hbWVdID0gX19hc3NpZ24oe30sIGRlZmF1bHRWYWx1ZSk7XG4gICAgICAgICAgICBlcnJvci5zdGF0ZS5tb2RlbHNbbmFtZV0gPSBjb252ZXJ0ZXIoY250U3RhdGUubW9kZWxzW25hbWVdKTtcbiAgICAgICAgICAgIGVycm9yLnN0YXRlLmVmZmVjdHNbbmFtZV0gPSB7fTtcbiAgICAgICAgICAgIHZhciBtb2RlbEFjdGlvbnMgPSB0aGlzLmRpc3BhdGNoW25hbWVdO1xuICAgICAgICAgICAgLy8gbWFwIG92ZXIgZWZmZWN0cyB3aXRoaW4gbW9kZWxzXG4gICAgICAgICAgICBPYmplY3Qua2V5cyhtb2RlbEFjdGlvbnMpLmZvckVhY2goZnVuY3Rpb24gKGFjdGlvbikge1xuICAgICAgICAgICAgICAgIGlmIChfdGhpcy5kaXNwYXRjaFtuYW1lXVthY3Rpb25dLmlzRWZmZWN0ICE9PSB0cnVlKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgY250U3RhdGUuZWZmZWN0c1tuYW1lXVthY3Rpb25dID0gX19hc3NpZ24oe30sIGRlZmF1bHRWYWx1ZSk7XG4gICAgICAgICAgICAgICAgZXJyb3Iuc3RhdGUuZWZmZWN0c1tuYW1lXVthY3Rpb25dID0gY29udmVydGVyKGNudFN0YXRlLmVmZmVjdHNbbmFtZV1bYWN0aW9uXSk7XG4gICAgICAgICAgICAgICAgdmFyIGFjdGlvblR5cGUgPSBuYW1lICsgXCIvXCIgKyBhY3Rpb247XG4gICAgICAgICAgICAgICAgLy8gaWdub3JlIGl0ZW1zIG5vdCBpbiB3aGl0ZWxpc3RcbiAgICAgICAgICAgICAgICBpZiAoY29uZmlnLndoaXRlbGlzdCAmJiAhY29uZmlnLndoaXRlbGlzdC5pbmNsdWRlcyhhY3Rpb25UeXBlKSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIC8vIGlnbm9yZSBpdGVtcyBpbiBibGFja2xpc3RcbiAgICAgICAgICAgICAgICBpZiAoY29uZmlnLmJsYWNrbGlzdCAmJiBjb25maWcuYmxhY2tsaXN0LmluY2x1ZGVzKGFjdGlvblR5cGUpKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgLy8gY29weSBvcmlnIGVmZmVjdCBwb2ludGVyXG4gICAgICAgICAgICAgICAgdmFyIG9yaWdFZmZlY3QgPSBfdGhpcy5kaXNwYXRjaFtuYW1lXVthY3Rpb25dO1xuICAgICAgICAgICAgICAgIC8vIGNyZWF0ZSBmdW5jdGlvbiB3aXRoIHByZSAmIHBvc3QgZXJyb3IgY2FsbHNcbiAgICAgICAgICAgICAgICB2YXIgZWZmZWN0V3JhcHBlciA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIHByb3BzID0gW107XG4gICAgICAgICAgICAgICAgICAgIGZvciAodmFyIF9pID0gMDsgX2kgPCBhcmd1bWVudHMubGVuZ3RoOyBfaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBwcm9wc1tfaV0gPSBhcmd1bWVudHNbX2ldO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBfX2F3YWl0ZXIoX3RoaXMsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgZXJyb3JfMTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBfX2dlbmVyYXRvcih0aGlzLCBmdW5jdGlvbiAoX2EpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzd2l0Y2ggKF9hLmxhYmVsKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgMDpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIG9ubHkgY2xlYXIgd2hlbiB0aGVyZSBoYXMgYmVlbiBhIGVycm9yXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAobmV4dFN0YXRlLmVmZmVjdHNbbmFtZV0gJiYgbmV4dFN0YXRlLmVmZmVjdHNbbmFtZV1bYWN0aW9uXSAmJiBuZXh0U3RhdGUuZWZmZWN0c1tuYW1lXVthY3Rpb25dLmVycm9yKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5kaXNwYXRjaC5lcnJvci5oaWRlKHsgbmFtZTogbmFtZSwgYWN0aW9uOiBhY3Rpb24gfSwgbnVsbCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBfYS5sYWJlbCA9IDE7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgMTpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIF9hLnRyeXMucHVzaChbMSwgMywgLCA0XSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gWzQgLyp5aWVsZCovLCBvcmlnRWZmZWN0LmFwcGx5KHZvaWQgMCwgcHJvcHMpXTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSAyOiByZXR1cm4gWzIgLypyZXR1cm4qLywgX2Euc2VudCgpXTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSAzOlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZXJyb3JfMSA9IF9hLnNlbnQoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGRpc3BsYXkgZXJyb3Igb24gY29uc29sZVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcihlcnJvcl8xKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZGlzcGF0Y2guZXJyb3Iuc2hvdyh7IG5hbWU6IG5hbWUsIGFjdGlvbjogYWN0aW9uIH0sIGVycm9yXzEpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFszIC8qYnJlYWsqLywgNF07XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgNDogcmV0dXJuIFsyIC8qcmV0dXJuKi9dO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgIGVmZmVjdFdyYXBwZXIuaXNFZmZlY3QgPSB0cnVlO1xuICAgICAgICAgICAgICAgIC8vIHJlcGxhY2UgZXhpc3RpbmcgZWZmZWN0IHdpdGggbmV3IHdyYXBwZXJcbiAgICAgICAgICAgICAgICBfdGhpcy5kaXNwYXRjaFtuYW1lXVthY3Rpb25dID0gZWZmZWN0V3JhcHBlcjtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9LFxuICAgIH07XG59KTtcbiIsICJpbXBvcnQgaXNGdW5jdGlvbiBmcm9tICdsb2Rhc2guaXNmdW5jdGlvbic7XG4vKipcbiAqIGNoZWNrTW9kZWxzXG4gKlxuICogQHBhcmFtIG9yaWdpbk1vZGVsc1xuICovXG5leHBvcnQgZnVuY3Rpb24gY2hlY2tNb2RlbHMob3JpZ2luTW9kZWxzKSB7XG4gICAgT2JqZWN0LmtleXMob3JpZ2luTW9kZWxzKS5mb3JFYWNoKGZ1bmN0aW9uIChuYW1lKSB7XG4gICAgICAgIHZhciBtb2RlbCA9IG9yaWdpbk1vZGVsc1tuYW1lXTtcbiAgICAgICAgLy8gMS4xLjAtMS4yLjA6IGVmZmVjdHM6IHt9IC0+IGVmZmVjdHM6ICgpID0+ICh7fSlcbiAgICAgICAgaWYgKG1vZGVsLmVmZmVjdHMgJiYgIWlzRnVuY3Rpb24obW9kZWwuZWZmZWN0cykpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIk1vZGVsKFwiICsgbmFtZSArIFwiKTogRGVmaW5pbmcgZWZmZWN0cyBhcyBvYmplY3RzIGhhcyBiZWVuIGRldGVjdGVkLCBwbGVhc2UgdXNlIGB7IGVmZmVjdHM6ICgpID0+ICh7IGVmZmVjdE5hbWU6ICgpID0+IHt9IH0pIH1gIGluc3RlYWQuIFxcblxcblxcbiBWaXNpdCBodHRwczovL2dpdGh1Yi5jb20vaWNlLWxhYi9pY2VzdG9yZS9ibG9iL21hc3Rlci9kb2NzL3VwZ3JhZGUtZ3VpZGVsaW5lcy5tZCNkZWZpbmUtbW9kZWwtZWZmZWN0cyB0byBsZWFybiBhYm91dCBob3cgdG8gdXBncmFkZS5cIik7XG4gICAgICAgIH1cbiAgICAgICAgLy8gPDEuMS4wOiBhY3Rpb25zOiB7fSAtPiBlZmZlY3RzOiAoKSA9PiAoe30pXG4gICAgICAgIGlmIChtb2RlbC5hY3Rpb25zKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJNb2RlbChcIiArIG5hbWUgKyBcIik6IFRoZSBhY3Rpb25zIGZpZWxkIGhhcyBiZWVuIGRldGVjdGVkLCBwbGVhc2UgdXNlIGByZWR1Y2Vyc2AgYW5kIGBlZmZlY3RzYCBpbnN0ZWFkLiBWaXNpdCBodHRwczovL2dpdGh1Yi5jb20vaWNlLWxhYi9pY2VzdG9yZS9ibG9iL21hc3Rlci9kb2NzL3VwZ3JhZGUtZ3VpZGVsaW5lcy5tZCNkZWZpbmUtbW9kZWwtYWN0aW9ucyB0byBsZWFybiBhYm91dCBob3cgdG8gdXBncmFkZS5cIik7XG4gICAgICAgIH1cbiAgICB9KTtcbn1cbiIsICJ2YXIgX19hc3NpZ24gPSAodGhpcyAmJiB0aGlzLl9fYXNzaWduKSB8fCBmdW5jdGlvbiAoKSB7XG4gICAgX19hc3NpZ24gPSBPYmplY3QuYXNzaWduIHx8IGZ1bmN0aW9uKHQpIHtcbiAgICAgICAgZm9yICh2YXIgcywgaSA9IDEsIG4gPSBhcmd1bWVudHMubGVuZ3RoOyBpIDwgbjsgaSsrKSB7XG4gICAgICAgICAgICBzID0gYXJndW1lbnRzW2ldO1xuICAgICAgICAgICAgZm9yICh2YXIgcCBpbiBzKSBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKHMsIHApKVxuICAgICAgICAgICAgICAgIHRbcF0gPSBzW3BdO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0O1xuICAgIH07XG4gICAgcmV0dXJuIF9fYXNzaWduLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG59O1xuaW1wb3J0IGFjdGlvblR5cGVzIGZyb20gJy4uL2FjdGlvblR5cGVzJztcbnZhciBTRVRfU1RBVEUgPSBhY3Rpb25UeXBlcy5TRVRfU1RBVEU7XG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiAob3JpZ2luTW9kZWxzKSB7XG4gICAgdmFyIG1vZGVscyA9IHt9O1xuICAgIE9iamVjdC5rZXlzKG9yaWdpbk1vZGVscykuZm9yRWFjaChmdW5jdGlvbiAobmFtZSkge1xuICAgICAgICB2YXIgbW9kZWwgPSBvcmlnaW5Nb2RlbHNbbmFtZV07XG4gICAgICAgIGlmICghbW9kZWwucmVkdWNlcnMpIHtcbiAgICAgICAgICAgIG1vZGVsLnJlZHVjZXJzID0ge307XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCFtb2RlbC5yZWR1Y2Vycy5zZXRTdGF0ZSkge1xuICAgICAgICAgICAgbW9kZWwucmVkdWNlcnMuc2V0U3RhdGUgPSBmdW5jdGlvbiAoc3RhdGUsIHBheWxvYWQpIHsgcmV0dXJuIChfX2Fzc2lnbihfX2Fzc2lnbih7fSwgc3RhdGUpLCBwYXlsb2FkKSk7IH07XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCFtb2RlbC5yZWR1Y2Vyc1tTRVRfU1RBVEVdKSB7XG4gICAgICAgICAgICBtb2RlbC5yZWR1Y2Vyc1tTRVRfU1RBVEVdID0gZnVuY3Rpb24gKHN0YXRlLCBwYXlsb2FkKSB7IHJldHVybiBwYXlsb2FkOyB9O1xuICAgICAgICB9XG4gICAgICAgIG1vZGVsc1tuYW1lXSA9IG1vZGVsO1xuICAgIH0pO1xuICAgIHJldHVybiBtb2RlbHM7XG59XG4iLCAiO1xuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZU1vZGVsKGNvbmZpZykge1xuICAgIHJldHVybiBjb25maWc7XG59XG4iLCAiaW1wb3J0ICogYXMgUmVhY3QgZnJvbSAncmVhY3QnO1xuaW1wb3J0IHsgQXV0aFByb3ZpZGVyLCB1c2VBdXRoLCB3aXRoQXV0aCB9IGZyb20gJy4vQXV0aC5qcyc7XG5leHBvcnQgeyB3aXRoQXV0aCwgdXNlQXV0aCB9O1xuY29uc3QgRVhQT1JUX05BTUUgPSAnYXV0aENvbmZpZyc7XG5jb25zdCBydW50aW1lID0gYXN5bmMgKHsgYXBwQ29udGV4dCwgdXNlQ29uZmlnLCBhZGRQcm92aWRlciwgYWRkV3JhcHBlciB9KSA9PiB7XG4gICAgY29uc3QgeyBhcHBFeHBvcnQsIGFwcERhdGEgfSA9IGFwcENvbnRleHQ7XG4gICAgY29uc3QgZXhwb3J0ZWQgPSBhcHBFeHBvcnRbRVhQT1JUX05BTUVdO1xuICAgIGNvbnN0IGF1dGhDb25maWcgPSAodHlwZW9mIGV4cG9ydGVkID09PSAnZnVuY3Rpb24nID8gYXdhaXQgZXhwb3J0ZWQoYXBwRGF0YSkgOiBleHBvcnRlZCkgfHwge307XG4gICAgY29uc3QgaW5pdGlhbEF1dGggPSBhdXRoQ29uZmlnLmluaXRpYWxBdXRoIHx8IHt9O1xuICAgIGNvbnN0IEF1dGhQcm92aWRlcldyYXBwZXIgPSAoeyBjaGlsZHJlbiB9KSA9PiB7XG4gICAgICAgIGNvbnN0IFtzdGF0ZSwgc2V0U3RhdGVdID0gUmVhY3QudXNlU3RhdGUoaW5pdGlhbEF1dGgpO1xuICAgICAgICBjb25zdCB1cGRhdGVTdGF0ZSA9IChuZXdTdGF0ZSA9IHt9KSA9PiB7XG4gICAgICAgICAgICBzZXRTdGF0ZSh7XG4gICAgICAgICAgICAgICAgLi4uc3RhdGUsXG4gICAgICAgICAgICAgICAgLi4ubmV3U3RhdGUsXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfTtcbiAgICAgICAgcmV0dXJuIFJlYWN0LmNyZWF0ZUVsZW1lbnQoQXV0aFByb3ZpZGVyLCB7IHZhbHVlOiBbc3RhdGUsIHVwZGF0ZVN0YXRlXSB9LCBjaGlsZHJlbik7XG4gICAgfTtcbiAgICBhZGRQcm92aWRlcihBdXRoUHJvdmlkZXJXcmFwcGVyKTtcbiAgICBjb25zdCBBdXRoUm91dGVXcmFwcGVyID0gKHsgY2hpbGRyZW4gfSkgPT4ge1xuICAgICAgICBjb25zdCBbYXV0aF0gPSB1c2VBdXRoKCk7XG4gICAgICAgIGNvbnN0IHJvdXRlQ29uZmlnID0gdXNlQ29uZmlnKCk7XG4gICAgICAgIGNvbnN0IHJvdXRlQ29uZmlnQXV0aCA9IHJvdXRlQ29uZmlnID09PSBudWxsIHx8IHJvdXRlQ29uZmlnID09PSB2b2lkIDAgPyB2b2lkIDAgOiByb3V0ZUNvbmZpZy5hdXRoO1xuICAgICAgICBpZiAocm91dGVDb25maWdBdXRoICYmICFBcnJheS5pc0FycmF5KHJvdXRlQ29uZmlnQXV0aCkpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignY29uZmlnLmF1dGggbXVzdCBiZSBhbiBhcnJheScpO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IGhhc0F1dGggPSBBcnJheS5pc0FycmF5KHJvdXRlQ29uZmlnQXV0aCkgJiYgcm91dGVDb25maWdBdXRoLmxlbmd0aFxuICAgICAgICAgICAgPyBPYmplY3Qua2V5cyhhdXRoKS5maWx0ZXIoKGl0ZW0pID0+IChyb3V0ZUNvbmZpZ0F1dGguaW5jbHVkZXMoaXRlbSkgPyBhdXRoW2l0ZW1dIDogZmFsc2UpKS5sZW5ndGhcbiAgICAgICAgICAgIDogdHJ1ZTtcbiAgICAgICAgaWYgKCFoYXNBdXRoKSB7XG4gICAgICAgICAgICBpZiAoYXV0aENvbmZpZy5Ob0F1dGhGYWxsYmFjaykge1xuICAgICAgICAgICAgICAgIHJldHVybiBSZWFjdC5jcmVhdGVFbGVtZW50KGF1dGhDb25maWcuTm9BdXRoRmFsbGJhY2ssIHsgcm91dGVDb25maWc6IHJvdXRlQ29uZmlnIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIFJlYWN0LmNyZWF0ZUVsZW1lbnQoUmVhY3QuRnJhZ21lbnQsIG51bGwsIFwiTm8gQXV0aFwiKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gUmVhY3QuY3JlYXRlRWxlbWVudChSZWFjdC5GcmFnbWVudCwgbnVsbCwgY2hpbGRyZW4pO1xuICAgIH07XG4gICAgYWRkV3JhcHBlcihBdXRoUm91dGVXcmFwcGVyKTtcbn07XG5leHBvcnQgZGVmYXVsdCBydW50aW1lO1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9aW5kZXguanMubWFwIiwgImltcG9ydCAqIGFzIFJlYWN0IGZyb20gJ3JlYWN0JztcbmltcG9ydCB7IGNyZWF0ZUNvbnRleHQsIHVzZUNvbnRleHQgfSBmcm9tICdyZWFjdCc7XG5jb25zdCBDb250ZXh0ID0gY3JlYXRlQ29udGV4dChudWxsKTtcbkNvbnRleHQuZGlzcGxheU5hbWUgPSAnQXV0aENvbnRleHQnO1xuY29uc3QgQXV0aFByb3ZpZGVyID0gQ29udGV4dC5Qcm92aWRlcjtcbmNvbnN0IHVzZUF1dGggPSAoKSA9PiB7XG4gICAgY29uc3QgdmFsdWUgPSB1c2VDb250ZXh0KENvbnRleHQpO1xuICAgIHJldHVybiB2YWx1ZTtcbn07XG4vLyBjbGFzcyBcdTdFQzRcdTRFRjZcdTY1MkZcdTYzMDEgSG9jIFx1NzUyOFx1NkNENVxuZnVuY3Rpb24gd2l0aEF1dGgoQ29tcG9uZW50KSB7XG4gICAgY29uc3QgQXV0aFdyYXBwZWQgPSAocHJvcHMpID0+IHtcbiAgICAgICAgY29uc3QgW2F1dGgsIHNldEF1dGhdID0gdXNlQXV0aCgpO1xuICAgICAgICByZXR1cm4gUmVhY3QuY3JlYXRlRWxlbWVudChDb21wb25lbnQsIHsgLi4ucHJvcHMsIGF1dGg6IGF1dGgsIHNldEF1dGg6IHNldEF1dGggfSk7XG4gICAgfTtcbiAgICByZXR1cm4gQXV0aFdyYXBwZWQ7XG59XG5leHBvcnQgeyB1c2VBdXRoLCB3aXRoQXV0aCwgQXV0aFByb3ZpZGVyLCB9O1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9QXV0aC5qcy5tYXAiXSwKICAibWFwcGluZ3MiOiAiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTtBQUFBO0FBQUE7QUFFQSxXQUFPLFVBQVUsU0FBUyxLQUFLQSxLQUFJLFNBQVM7QUFDMUMsYUFBTyxTQUFTLE9BQU87QUFDckIsWUFBSSxPQUFPLElBQUksTUFBTSxVQUFVLE1BQU07QUFDckMsaUJBQVND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QUFDLE1BQU0sUUFBUSxlQUFlLEdBQUc7QUFDcEQsWUFBTSxJQUFJLE1BQU0sOEJBQThCO0FBQUEsSUFDbEQ7QUFDQSxVQUFNLFVBQVUsTUFBTSxRQUFRLGVBQWUsS0FBSyxnQkFBZ0IsU0FDNUQsT0FBTyxLQUFLLElBQUksRUFBRSxPQUFPLENBQUMsU0FBVSxnQkFBZ0IsU0FBUyxJQUFJLElBQUksS0FBSyxRQUFRLEtBQU0sRUFBRSxTQUMxRjtBQUNOLFFBQUksQ0FBQyxTQUFTO0FBQ1YsVUFBSSxXQUFXLGdCQUFnQjtBQUMzQixlQUFhLHFCQUFjLFdBQVcsZ0JBQWdCLEVBQUUsWUFBeUIsQ0FBQztBQUFBLE1BQ3RGO0FBQ0EsYUFBYSxxQkFBb0IsaUJBQVUsTUFBTSxTQUFTO0FBQUEsSUFDOUQ7QUFDQSxXQUFhLHFCQUFvQixpQkFBVSxNQUFNLFFBQVE7QUFBQSxFQUM3RDtBQUNBLGFBQVcsZ0JBQWdCO0FBQy9CO0FBQ0EsSUFBT0MsbUJBQVFGOzs7QXJEL0JmLFNBQVNHLGlCQUFpQkMsWUFBZ0Q7QUFDeEUsU0FBT0E7QUFDVDsiLAogICJuYW1lcyI6IFsiZm4iLCAiaSIsICJraW5kT2YiLCAiaXNPYmplY3QiLCAiaXNQbGFpbk9iamVjdCIsICJpc0RhdGUiLCAiaXNGdW5jdGlvbiIsICJmbiIsICJpIiwgImwiLCAibWVyZ2UiLCAiYSIsICJiIiwgInYiLCAiZm4iLCAiaCIsICJyZXF1ZXN0IiwgImkiLCAicmVxdWVzdCIsICJmbiIsICJtZXJnZSIsICJpIiwgInJlcXVlc3QiLCAiaSIsICJsIiwgImMiLCAiYXhpb3MiLCAicmVxdWlyZV9heGlvcyIsICJpc1ZhbGlkRWxlbWVudFR5cGUiLCAiRnJhZ21lbnQiLCAiaXNDb250ZXh0Q29uc3VtZXIiLCAiaSIsICJuIiwgInMiLCAieCIsICJ4IiwgInkiLCAidmFsaWRhdGUiLCAiaSIsICJjaGVja2VyIiwgImkiLCAicmVxdWlyZV9yZWFjdF9pc19kZXZlbG9wbWVudCIsICJpc1ZhbGlkRWxlbWVudFR5cGUiLCAiRnJhZ21lbnQiLCAiaXNDb250ZXh0Q29uc3VtZXIiLCAicmVxdWlyZV9yZWFjdF9pcyIsICJTeW1ib2wiLCAiaXNGdW5jdGlvbiIsICJpc09iamVjdCIsICJMaW5rIiwgIk91dGxldCIsICJ1c2VQYXJhbXMiLCAidXNlU2VhcmNoUGFyYW1zIiwgInVzZUxvY2F0aW9uIiwgInVzZU5hdmlnYXRlIiwgImRlZmluZUFwcENvbmZpZyIsICJ1c2VBcHBEYXRhIiwgInVzZURhdGEiLCAidXNlQ29uZmlnIiwgIk1ldGEiLCAiVGl0bGUiLCAiTGlua3MiLCAiU2NyaXB0cyIsICJEYXRhIiwgIk1haW4iLCAiaGlzdG9yeSIsICJLZWVwQWxpdmVPdXRsZXQiLCAidXNlTW91bnRlZCIsICJDbGllbnRPbmx5IiwgImRlZmluZURhdGFMb2FkZXIiLCAiZGVmaW5lU2VydmVyRGF0YUxvYWRlciIsICJkZWZpbmVTdGF0aWNEYXRhTG9hZGVyIiwgImF4aW9zIiwgIlJlYWN0IiwgIlJlYWN0IiwgIm1pZGRsZXdhcmUiLCAiUCIsICJfIiwgInQiLCAiZiIsICJ5IiwgImciLCAibiIsICJ2IiwgIl9fYXdhaXRlciIsICJQIiwgIl9fZ2VuZXJhdG9yIiwgIl8iLCAidCIsICJmIiwgInkiLCAiZyIsICJuIiwgInYiLCAiaSIsICJyYW5kb21TdHJpbmciLCAiaSIsICJzdWJzY3JpYmUiLCAibmV4dFN0YXRlIiwgImEiLCAiYiIsICJjcmVhdGVTdG9yZSIsICJ0IiwgInMiLCAiaSIsICJuIiwgInAiLCAiciIsICJrIiwgImEiLCAiaiIsICJjb21iaW5lUmVkdWNlcnMiLCAiY3JlYXRlU3RvcmUiLCAibW9kZWwiLCAiX2kiLCAiX2EiLCAiYWN0aW9uIiwgIl9fYXNzaWduIiwgInQiLCAicyIsICJpIiwgIm4iLCAicCIsICJJY2VzdG9yZSIsICJmbiIsICJtb2RlbCIsICJfX2Fzc2lnbiIsICJ0IiwgInMiLCAiaSIsICJuIiwgInAiLCAiX19zcHJlYWRBcnJheXMiLCAiciIsICJrIiwgImEiLCAiaiIsICJSZWFjdCIsICJSZWFjdCIsICJzZXRCYXRjaCIsICJnZXRCYXRjaCIsICJiYXRjaCIsICJub3RpZnkiLCAiZ2V0IiwgIkNvbnRleHQiLCAiUmVhY3QiLCAiUHJvcFR5cGVzIiwgIlJlYWN0IiwgInVzZU1lbW8iLCAidXNlQ29udGV4dCIsICJ1c2VDb250ZXh0IiwgInVzZUNvbnRleHQiLCAidXNlUmVkdXhDb250ZXh0IiwgInVzZUNvbnRleHQiLCAidXNlU3RvcmUiLCAidXNlU3RvcmUiLCAidXNlRGlzcGF0Y2giLCAidXNlUmVkdWNlciIsICJ1c2VSZWYiLCAidXNlTWVtbyIsICJ1c2VDb250ZXh0IiwgInJlZkVxdWFsaXR5IiwgImEiLCAiYiIsICJ1c2VSZWR1Y2VyIiwgInMiLCAidXNlTWVtbyIsICJ1c2VSZWYiLCAidXNlUmVkdXhDb250ZXh0IiwgInVzZUNvbnRleHQiLCAidXNlU2VsZWN0b3IiLCAicmFuZG9tU3RyaW5nIiwgIkFjdGlvblR5cGVzIiwgIlByb3ZpZGVyIiwgIlJlYWN0IiwgInVzZVNlbGVjdG9yIiwgInVzZURpc3BhdGNoIiwgIlJlYWN0IiwgIl9fYXNzaWduIiwgInQiLCAicyIsICJpIiwgIm4iLCAicCIsICJ3aXRoTW9kZWxEaXNwYXRjaGVycyIsICJkaWUiLCAiZXJyb3IiLCAiYXJncyIsICJlIiwgImVycm9ycyIsICJtc2ciLCAiYXBwbHkiLCAiRXJyb3IiLCAibGVuZ3RoIiwgIm1hcCIsICJzIiwgImpvaW4iLCAiaXNEcmFmdCIsICJ2YWx1ZSIsICJEUkFGVF9TVEFURSIsICJpc0RyYWZ0YWJsZSIsICJwcm90byIsICJPYmplY3QiLCAiZ2V0UHJvdG90eXBlT2YiLCAiQ3RvciIsICJoYXNPd25Qcm9wZXJ0eSIsICJjYWxsIiwgImNvbnN0cnVjdG9yIiwgIkZ1bmN0aW9uIiwgInRvU3RyaW5nIiwgIm9iamVjdEN0b3JTdHJpbmciLCAiQXJyYXkiLCAiaXNBcnJheSIsICJEUkFGVEFCTEUiLCAiX3ZhbHVlJGNvbnN0cnVjdG9yIiwgImlzTWFwIiwgImlzU2V0IiwgImVhY2giLCAib2JqIiwgIml0ZXIiLCAiZW51bWVyYWJsZU9ubHkiLCAiZ2V0QXJjaHR5cGUiLCAiT2JqZWN0IiwgImtleXMiLCAib3duS2V5cyIsICJmb3JFYWNoIiwgImtleSIsICJlbnRyeSIsICJpbmRleCIsICJ0aGluZyIsICJzdGF0ZSIsICJEUkFGVF9TVEFURSIsICJ0eXBlXyIsICJBcnJheSIsICJpc0FycmF5IiwgImlzTWFwIiwgImlzU2V0IiwgImhhcyIsICJwcm9wIiwgInByb3RvdHlwZSIsICJoYXNPd25Qcm9wZXJ0eSIsICJjYWxsIiwgImdldCIsICJzZXQiLCAicHJvcE9yT2xkVmFsdWUiLCAidmFsdWUiLCAidCIsICJkZWxldGUiLCAiYWRkIiwgImlzIiwgIngiLCAieSIsICJ0YXJnZXQiLCAiaGFzTWFwIiwgIk1hcCIsICJoYXNTZXQiLCAiU2V0IiwgImxhdGVzdCIsICJjb3B5XyIsICJiYXNlXyIsICJzaGFsbG93Q29weSIsICJiYXNlIiwgInNsaWNlIiwgImRlc2NyaXB0b3JzIiwgImdldE93blByb3BlcnR5RGVzY3JpcHRvcnMiLCAiaSIsICJsZW5ndGgiLCAiZGVzYyIsICJ3cml0YWJsZSIsICJjb25maWd1cmFibGUiLCAiZW51bWVyYWJsZSIsICJjcmVhdGUiLCAiZ2V0UHJvdG90eXBlT2YiLCAiZnJlZXplIiwgImRlZXAiLCAiaXNGcm96ZW4iLCAiaXNEcmFmdCIsICJpc0RyYWZ0YWJsZSIsICJjbGVhciIsICJkb250TXV0YXRlRnJvemVuQ29sbGVjdGlvbnMiLCAiZGllIiwgImdldFBsdWdpbiIsICJwbHVnaW5LZXkiLCAicGx1Z2luIiwgInBsdWdpbnMiLCAibG9hZFBsdWdpbiIsICJpbXBsZW1lbnRhdGlvbiIsICJnZXRDdXJyZW50U2NvcGUiLCAiY3VycmVudFNjb3BlIiwgInVzZVBhdGNoZXNJblNjb3BlIiwgInNjb3BlIiwgInBhdGNoTGlzdGVuZXIiLCAicGF0Y2hlc18iLCAiaW52ZXJzZVBhdGNoZXNfIiwgInBhdGNoTGlzdGVuZXJfIiwgInJldm9rZVNjb3BlIiwgImxlYXZlU2NvcGUiLCAiZHJhZnRzXyIsICJyZXZva2VEcmFmdCIsICJwYXJlbnRfIiwgImVudGVyU2NvcGUiLCAiaW1tZXIiLCAiaW1tZXJfIiwgImNhbkF1dG9GcmVlemVfIiwgInVuZmluYWxpemVkRHJhZnRzXyIsICJkcmFmdCIsICJyZXZva2VfIiwgInJldm9rZWRfIiwgInByb2Nlc3NSZXN1bHQiLCAicmVzdWx0IiwgImJhc2VEcmFmdCIsICJpc1JlcGxhY2VkIiwgInVzZVByb3hpZXNfIiwgIndpbGxGaW5hbGl6ZUVTNV8iLCAibW9kaWZpZWRfIiwgImZpbmFsaXplIiwgIm1heWJlRnJlZXplIiwgImdlbmVyYXRlUmVwbGFjZW1lbnRQYXRjaGVzXyIsICJOT1RISU5HIiwgInVuZGVmaW5lZCIsICJyb290U2NvcGUiLCAicGF0aCIsICJjaGlsZFZhbHVlIiwgImZpbmFsaXplUHJvcGVydHkiLCAic2NvcGVfIiwgImZpbmFsaXplZF8iLCAiZHJhZnRfIiwgImdlbmVyYXRlUGF0Y2hlc18iLCAicGFyZW50U3RhdGUiLCAidGFyZ2V0T2JqZWN0IiwgInJvb3RQYXRoIiwgInJlcyIsICJhc3NpZ25lZF8iLCAiY29uY2F0IiwgImF1dG9GcmVlemVfIiwgInBlZWsiLCAiZ2V0RGVzY3JpcHRvckZyb21Qcm90byIsICJzb3VyY2UiLCAicHJvdG8iLCAiZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yIiwgIm1hcmtDaGFuZ2VkIiwgInByZXBhcmVDb3B5IiwgImNyZWF0ZVByb3h5IiwgInBhcmVudCIsICJwcm94eU1hcF8iLCAicHJveHlTZXRfIiwgImlzTWFudWFsXyIsICJ0cmFwcyIsICJvYmplY3RUcmFwcyIsICJhcnJheVRyYXBzIiwgIlByb3h5IiwgInJldm9jYWJsZSIsICJyZXZva2UiLCAicHJveHkiLCAiY3JlYXRlRVM1UHJveHlfIiwgInB1c2giLCAiY3VycmVudCIsICJjdXJyZW50SW1wbCIsICJjb3B5IiwgImFyY2hUeXBlIiwgImhhc0NoYW5nZXNfIiwgImNvcHlIZWxwZXIiLCAiZnJvbSIsICJlbmFibGVFUzUiLCAicHJveHlQcm9wZXJ0eSIsICJ0aGlzIiwgImFzc2VydFVucmV2b2tlZCIsICJtYXJrQ2hhbmdlc1N3ZWVwIiwgImRyYWZ0cyIsICJoYXNBcnJheUNoYW5nZXMiLCAiaGFzT2JqZWN0Q2hhbmdlcyIsICJiYXNlVmFsdWUiLCAiYmFzZUlzRHJhZnQiLCAiZGVzY3JpcHRvciIsICJKU09OIiwgInN0cmluZ2lmeSIsICJkZWZpbmVQcm9wZXJ0eSIsICJtYXJrQ2hhbmdlc1JlY3Vyc2l2ZWx5IiwgIm9iamVjdCIsICJtaW4iLCAiTWF0aCIsICJ2YWx1ZSIsICJjdXJyZW50U2NvcGUiLCAiaGFzU3ltYm9sIiwgIlN5bWJvbCIsICJoYXNNYXAiLCAiTWFwIiwgImhhc1NldCIsICJTZXQiLCAiaGFzUHJveGllcyIsICJQcm94eSIsICJyZXZvY2FibGUiLCAiUmVmbGVjdCIsICJOT1RISU5HIiwgImZvciIsICJEUkFGVEFCTEUiLCAiRFJBRlRfU1RBVEUiLCAidmFsdWUiLCAiZXJyb3JzIiwgImRhdGEiLCAicGF0aCIsICJvcCIsICJwbHVnaW4iLCAidGhpbmciLCAib2JqZWN0Q3RvclN0cmluZyIsICJPYmplY3QiLCAicHJvdG90eXBlIiwgImNvbnN0cnVjdG9yIiwgIm93bktleXMiLCAiUmVmbGVjdCIsICJnZXRPd25Qcm9wZXJ0eVN5bWJvbHMiLCAib2JqIiwgImdldE93blByb3BlcnR5TmFtZXMiLCAiY29uY2F0IiwgImdldE93blByb3BlcnR5RGVzY3JpcHRvcnMiLCAidGFyZ2V0IiwgInJlcyIsICJmb3JFYWNoIiwgImtleSIsICJnZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IiLCAicGx1Z2lucyIsICJvYmplY3RUcmFwcyIsICJnZXQiLCAic3RhdGUiLCAicHJvcCIsICJEUkFGVF9TVEFURSIsICJzb3VyY2UiLCAibGF0ZXN0IiwgImhhcyIsICJkZXNjIiwgImdldERlc2NyaXB0b3JGcm9tUHJvdG8iLCAiX2Rlc2MkZ2V0IiwgImNhbGwiLCAiZHJhZnRfIiwgInVuZGVmaW5lZCIsICJmaW5hbGl6ZWRfIiwgImlzRHJhZnRhYmxlIiwgInBlZWsiLCAiYmFzZV8iLCAicHJlcGFyZUNvcHkiLCAiY29weV8iLCAiY3JlYXRlUHJveHkiLCAic2NvcGVfIiwgImltbWVyXyIsICJzZXQiLCAibW9kaWZpZWRfIiwgImN1cnJlbnQiLCAiY3VycmVudFN0YXRlIiwgImFzc2lnbmVkXyIsICJpcyIsICJtYXJrQ2hhbmdlZCIsICJkZWxldGVQcm9wZXJ0eSIsICJvd25lciIsICJ3cml0YWJsZSIsICJjb25maWd1cmFibGUiLCAidHlwZV8iLCAiZW51bWVyYWJsZSIsICJkZWZpbmVQcm9wZXJ0eSIsICJkaWUiLCAiZ2V0UHJvdG90eXBlT2YiLCAic2V0UHJvdG90eXBlT2YiLCAiYXJyYXlUcmFwcyIsICJlYWNoIiwgImZuIiwgImFyZ3VtZW50cyIsICJhcHBseSIsICJ0aGlzIiwgImlzTmFOIiwgInBhcnNlSW50IiwgIkltbWVyIiwgImNvbmZpZyIsICJoYXNQcm94aWVzIiwgImJhc2UiLCAicmVjaXBlIiwgInBhdGNoTGlzdGVuZXIiLCAiZGVmYXVsdEJhc2UiLCAic2VsZiIsICJfdGhpcyIsICJhcmdzIiwgInByb2R1Y2UiLCAiZHJhZnQiLCAiX3RoaXMyIiwgInJlc3VsdCIsICJzY29wZSIsICJlbnRlclNjb3BlIiwgInByb3h5IiwgImhhc0Vycm9yIiwgInJldm9rZVNjb3BlIiwgImxlYXZlU2NvcGUiLCAiUHJvbWlzZSIsICJ0aGVuIiwgInVzZVBhdGNoZXNJblNjb3BlIiwgInByb2Nlc3NSZXN1bHQiLCAiZXJyb3IiLCAiTk9USElORyIsICJhdXRvRnJlZXplXyIsICJmcmVlemUiLCAicCIsICJpcCIsICJnZXRQbHVnaW4iLCAiZ2VuZXJhdGVSZXBsYWNlbWVudFBhdGNoZXNfIiwgInByb2R1Y2VXaXRoUGF0Y2hlcyIsICJwYXRjaGVzIiwgImludmVyc2VQYXRjaGVzIiwgIm5leHRTdGF0ZSIsICJ1c2VQcm94aWVzIiwgInNldFVzZVByb3hpZXMiLCAiYXV0b0ZyZWV6ZSIsICJzZXRBdXRvRnJlZXplIiwgImNyZWF0ZURyYWZ0IiwgImlzRHJhZnQiLCAiaXNNYW51YWxfIiwgImZpbmlzaERyYWZ0IiwgInVzZVByb3hpZXNfIiwgImFwcGx5UGF0Y2hlcyIsICJpIiwgImxlbmd0aCIsICJwYXRjaCIsICJzbGljZSIsICJhcHBseVBhdGNoZXNJbXBsIiwgImFwcGx5UGF0Y2hlc18iLCAiaW1tZXIiLCAiYmluZCIsICJfX2Fzc2lnbiIsICJ0IiwgInMiLCAiaSIsICJuIiwgInAiLCAiX19hd2FpdGVyIiwgIlAiLCAiX19nZW5lcmF0b3IiLCAiXyIsICJmIiwgInkiLCAiZyIsICJ2IiwgIl9hIiwgIl9fYXNzaWduIiwgInQiLCAicyIsICJpIiwgIm4iLCAicCIsICJfX2F3YWl0ZXIiLCAiUCIsICJfX2dlbmVyYXRvciIsICJfIiwgImYiLCAieSIsICJnIiwgInYiLCAiY250U3RhdGUiLCAibmV4dFN0YXRlIiwgInZhbGlkYXRlQ29uZmlnIiwgIl9hIiwgImlzRnVuY3Rpb24iLCAiX19hc3NpZ24iLCAidCIsICJzIiwgImkiLCAibiIsICJwIiwgIlNFVF9TVEFURSIsICJfX2Fzc2lnbiIsICJ0IiwgInMiLCAiaSIsICJuIiwgInAiLCAiY3JlYXRlU3RvcmUiLCAiUmVhY3QiLCAiUHJvdmlkZXIiLCAiaW5pdGlhbFN0YXRlcyIsICJSZWFjdCIsICJSZWFjdCIsICJ1c2VDb250ZXh0IiwgInJ1bnRpbWUiLCAidXNlQ29uZmlnIiwgInJ1bnRpbWVfZGVmYXVsdCIsICJkZWZpbmVQYWdlQ29uZmlnIiwgInBhZ2VDb25maWciXQp9Cg==
