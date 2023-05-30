/*
  LitWidget 1.0.0-beta.1
  Copyright (C) 2023 Andy Chentsov <chentsov@gmail.com>
  @license BSD-3-Clause
*/

(function (exports, lit, templateContent_js) {

  function throttle(fn, duration) {
      var throttlePause;
      return function() {
          for(var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++)args[_key] = arguments[_key];
          var _this = this;
          throttlePause || (throttlePause = !0, setTimeout(function() {
              fn.apply(_this, args), throttlePause = !1;
          }, duration));
      };
  }
  function debounce(fn, duration) {
      var timeoutId;
      function debouncer() {
          for(var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++)args[_key] = arguments[_key];
          var _this = this;
          debouncer.clear(), timeoutId = setTimeout(function() {
              timeoutId = null, fn.apply(_this, args);
          }, duration);
      }
      return debouncer.clear = function() {
          timeoutId && (clearTimeout(timeoutId), timeoutId = null);
      }, debouncer;
  }
  function duration(value) {
      if ("number" == typeof value) return value;
      if ("string" != typeof value) throw Error('Invalid duration "' + value + '".');
      var duration = parseFloat(value);
      if (isNaN(duration)) throw Error('Invalid duration value "' + value + '".');
      return value.endsWith("ms") ? duration : value.endsWith("s") ? 1000 * duration : value.endsWith("m") ? 60000 * duration : void 0;
  }

  function _array_like_to_array(arr, len) {
      (null == len || len > arr.length) && (len = arr.length);
      for(var i = 0, arr2 = Array(len); i < len; i++)arr2[i] = arr[i];
      return arr2;
  }
  function _defineProperties(target1, props) {
      for(var i = 0; i < props.length; i++){
          var descriptor = props[i];
          descriptor.enumerable = descriptor.enumerable || !1, descriptor.configurable = !0, "value" in descriptor && (descriptor.writable = !0), Object.defineProperty(target1, descriptor.key, descriptor);
      }
  }
  function _set_prototype_of(o, p) {
      return (_set_prototype_of = Object.setPrototypeOf || function(o, p) {
          return o.__proto__ = p, o;
      })(o, p);
  }
  function _create_for_of_iterator_helper_loose(o, allowArrayLike) {
      var it = "undefined" != typeof Symbol && o[Symbol.iterator] || o["@@iterator"];
      if (it) return (it = it.call(o)).next.bind(it);
      if (Array.isArray(o) || (it = function(o, minLen) {
          if (o) {
              if ("string" == typeof o) return _array_like_to_array(o, minLen);
              var n = Object.prototype.toString.call(o).slice(8, -1);
              if ("Object" === n && o.constructor && (n = o.constructor.name), "Map" === n || "Set" === n) return Array.from(n);
              if ("Arguments" === n || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _array_like_to_array(o, minLen);
          }
      }(o)) || allowArrayLike && o && "number" == typeof o.length) {
          it && (o = it);
          var i = 0;
          return function() {
              return i >= o.length ? {
                  done: !0
              } : {
                  done: !1,
                  value: o[i++]
              };
          };
      }
      throw TypeError("Invalid attempt to iterate non-iterable instance.\\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }
  function _templateObject() {
      var strings, raw, data = (strings = [
          "<slot></slot>"
      ], raw || (raw = strings.slice(0)), strings.raw = raw, strings);
      return _templateObject = function() {
          return data;
      }, data;
  }
  var LitWidget = function(LitElement) {
      function LitWidget() {
          return LitElement.apply(this, arguments);
      }
      !function(subClass, superClass) {
          if ("function" != typeof superClass && null !== superClass) throw TypeError("Super expression must either be null or a function");
          subClass.prototype = Object.create(superClass && superClass.prototype, {
              constructor: {
                  value: subClass,
                  writable: !0,
                  configurable: !0
              }
          }), superClass && _set_prototype_of(subClass, superClass);
      }(LitWidget, LitElement);
      var _proto = LitWidget.prototype;
      return _proto.render = function() {
          return lit.html(_templateObject());
      }, _proto.createRenderRoot = function() {
          // Find handle [data-root]
          var shadowRoot = !0, tagName = this.tagName.toLowerCase(), rootElement = this.querySelector('[data-root="' + tagName + '"]');
          rootElement && rootElement.closest(tagName) == this ? (root = rootElement, shadowRoot = !1) : root = LitElement.prototype.createRenderRoot.call(this);
          var sharedStyles = Object.getPrototypeOf(this).constructor.sharedStyles;
          if (shadowRoot && sharedStyles) {
              // Import styles
              for(var root, _step, _iterator = _create_for_of_iterator_helper_loose(document.head.querySelectorAll("style")); !(_step = _iterator()).done;){
                  var style = _step.value;
                  if ("false" != style.getAttribute("data-shared")) {
                      var styleClone = style.cloneNode(!0);
                      root.insertBefore(styleClone, root.firstChild);
                  }
              }
              // Import link[stylesheet]
              for(var _step1, _iterator1 = _create_for_of_iterator_helper_loose(document.head.querySelectorAll('link[rel="stylesheet"]')); !(_step1 = _iterator1()).done;){
                  var style1 = _step1.value;
                  if ("false" != style1.getAttribute("data-shared")) {
                      var styleClone1 = style1.cloneNode(!0);
                      root.insertBefore(styleClone1, root.firstChild);
                  }
              }
          }
          return root;
      }, _proto.connectedCallback = function() {
          var _this = this;
          LitElement.prototype.connectedCallback.call(this), setTimeout(function() {
              return _this._attachEvents();
          });
      }, _proto.disconnectedCallback = function() {
          var _this = this;
          LitElement.prototype.disconnectedCallback.call(this), setTimeout(function() {
              return _this._detachEvents();
          });
      }, _proto._attachEvents = function() {
          for(var _step, _this = this, _this1 = this, _iterator = _create_for_of_iterator_helper_loose(this._events); !(_step = _iterator()).done;)!function() {
              var event = _step.value;
              if (event.debounce && event.throttle) throw Error('[LitWidget "' + $this.tagName.toLowerCase() + '"] For the event "' + event.event + '", debounce and throttle are specified, you can specify only one thing.');
              var target1 = _this.findTarget(_this.tagName, event.target);
              if (target1) {
                  var handler = event.handler;
                  "string" == typeof handler && (handler = _this[handler]), event._handler = function() {
                      for(var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++)args[_key] = arguments[_key];
                      return handler.apply(_this1, args);
                  }, event.debounce ? event._handler = debounce(event._handler, duration(event.debounce)) : event.throttle && (event._handler = throttle(event._handler, duration(event.throttle))), null != event.wrapper && void 0 !== event.wrapper && (event._handler = event.wrapper.call(_this, event._handler, _this)), target1.addEventListener(event.event, event._handler);
              } else throw Error('[LitWidget "' + _this.tagName.toLowerCase() + '"] Event target "' + event.target + '" not found.');
          }();
      }, _proto._detachEvents = function() {
          for(var _step, _iterator = _create_for_of_iterator_helper_loose(this._events); !(_step = _iterator()).done;){
              var event = _step.value;
              event._handler && target.addEventListener(event.event, event._handler);
          }
      }, _proto.findTarget = function(tagName, targetName, selector, converter) {
          void 0 === selector && (selector = null), void 0 === converter && (converter = null);
          var convert = function(value) {
              return converter ? converter(value) : value;
          }, tag = tagName.toLowerCase();
          if (selector) for(var _step, _iterator = _create_for_of_iterator_helper_loose(this.querySelectorAll(selector)); !(_step = _iterator()).done;){
              var el = _step.value;
              if (el.closest(tag) === this) return convert(el);
          }
          if (this.renderRoot) for(var _step1, _iterator1 = _create_for_of_iterator_helper_loose(this.renderRoot.querySelectorAll('[data-target~="' + tag + "." + targetName + '"]')); !(_step1 = _iterator1()).done;){
              var el1 = _step1.value;
              if (!el1.closest(tag)) return convert(el1);
          }
          for(var _step2, _iterator2 = _create_for_of_iterator_helper_loose(this.querySelectorAll('[data-target~="' + tag + "." + targetName + '"]')); !(_step2 = _iterator2()).done;){
              var el2 = _step2.value;
              if (el2.closest(tag) === this) return convert(el2);
          }
      }, _proto.findTargets = function(tagName, targetName, selector, converter) {
          void 0 === selector && (selector = null), void 0 === converter && (converter = null);
          var convert = function(value) {
              return converter ? converter(value) : value;
          }, tag = tagName.toLowerCase(), targets = [];
          if (selector) for(var _step, _iterator = _create_for_of_iterator_helper_loose(this.querySelectorAll(selector)); !(_step = _iterator()).done;){
              var el = _step.value;
              el.closest(tag) === this && targets.push(convert(el));
          }
          if (this.renderRoot) for(var _step1, _iterator1 = _create_for_of_iterator_helper_loose(this.renderRoot.querySelectorAll('[data-targets~="' + tag + "." + targetName + '"]')); !(_step1 = _iterator1()).done;){
              var el1 = _step1.value;
              el1.closest(tag) || targets.push(convert(el1));
          }
          for(var _step2, _iterator2 = _create_for_of_iterator_helper_loose(this.querySelectorAll('[data-targets~="' + tag + "." + targetName + '"]')); !(_step2 = _iterator2()).done;){
              var el2 = _step2.value;
              el2.closest(tag) === this && targets.push(convert(el2));
          }
          return targets;
      }, LitWidget.widget = function(name) {
          return function(proto, options) {
              LitWidget.define(name, proto, options);
          };
      }, LitWidget.define = function(name, constructor, options) {
          customElements.define("w-" + name, constructor, options);
      }, _defineProperties(LitWidget.prototype, [
          {
              key: "_events",
              get: function() {
                  return Object.getPrototypeOf(this).constructor.events || [];
              }
          }
      ]), LitWidget;
  }(lit.LitElement);
  LitWidget.sharedStyles = !0, LitWidget.addInitializer(function(instance) {
      var klass = Object.getPrototypeOf(instance).constructor;
      if (void 0 !== klass.targets) for(var _step, _iterator = _create_for_of_iterator_helper_loose(Object.entries(klass.targets)); !(_step = _iterator()).done;)!function() {
          var _step_value = _step.value, target1 = _step_value[0], options = _step_value[1];
          // Add target getter
          Object.defineProperty(instance, target1, {
              configurable: !0,
              get: function() {
                  if (void 0 === this._findCache && (this._findCache = {}), this._findCache[target1]) return this._findCache[target1];
                  var _this__findCache, _, targetElement = null != (_ = (_this__findCache = this._findCache)[target1]) ? _ : _this__findCache[target1] = this.findTarget(this.tagName, target1, options.selector, options.template ? function(value) {
                      return templateContent_js.templateContent(value);
                  } : null);
                  return null == targetElement ? console.error('[LitWidget "' + klass.name + '"] Target "' + target1 + '" not found.') : this._findCache[target1] = targetElement, targetElement;
              }
          });
      }();
      if (void 0 !== klass.targetsAll) for(var _step1, _iterator1 = _create_for_of_iterator_helper_loose(Object.entries(klass.targetsAll)); !(_step1 = _iterator1()).done;)!function() {
          var _step_value = _step1.value, target1 = _step_value[0], options = _step_value[1];
          // Add target getter
          Object.defineProperty(instance, target1, {
              configurable: !0,
              get: function() {
                  var _this__findCache, _;
                  return void 0 === this._findCache && (this._findCache = {}), null != (_ = (_this__findCache = this._findCache)[target1]) ? _ : _this__findCache[target1] = this.findTargets(this.tagName, target1, options.selector, options.template ? function(value) {
                      return templateContent_js.templateContent(value);
                  } : null);
              }
          });
      }();
  });

  function _instanceof(left, right) {
      return null != right && "undefined" != typeof Symbol && right[Symbol.hasInstance] ? !!right[Symbol.hasInstance](left) : left instanceof right;
  }
  function target$1(param, name) {
      var selector = (void 0 === param ? {} : param).selector;
      void 0 === name && (name = null);
      var wrapper = function(instance, property) {
          var klass = instance.constructor;
          if (!_instanceof(instance, LitWidget)) throw Error('[LitWidget] The class "' + klass.name + '" is not a descendant of LitWidget.');
          void 0 === klass.targets && (klass.targets = {}), klass.targets[property] = {
              selector: selector
          };
      };
      if (null == name) return wrapper;
      var instance = arguments[0];
      wrapper(instance, name);
  }
  function targets(param, name) {
      var selector = (void 0 === param ? {} : param).selector;
      void 0 === name && (name = null);
      var wrapper = function(instance, property) {
          var klass = instance.constructor;
          if (!_instanceof(instance, LitWidget)) throw Error('[LitWidget] The class "' + klass.name + '" is not a descendant of LitWidget.');
          void 0 === klass.targetsAll && (klass.targetsAll = {}), klass.targetsAll[property] = {
              selector: selector
          };
      };
      if (null == name) return wrapper;
      var instance = arguments[0];
      wrapper(instance, name);
  }
  function onEvent(target, event, param) {
      var _ref = void 0 === param ? {} : param, debounce = _ref.debounce, throttle = _ref.throttle, wrapper = _ref.wrapper;
      return function(instance, property) {
          var klass = instance.constructor;
          if (!_instanceof(instance, LitWidget)) throw Error('[LitWidget] The class "' + klass.name + '" is not a descendant of LitWidget.');
          void 0 === klass.events && (klass.events = []), klass.events.push({
              target: target,
              handler: instance[property],
              event: event,
              debounce: debounce || null,
              throttle: throttle || null,
              wrapper: wrapper || null
          });
      };
  }

  exports.LitWidget = LitWidget;
  exports.onEvent = onEvent;
  exports.target = target$1;
  exports.targets = targets;

})(this.window = this.window || {}, lit, templateContent);
//# sourceMappingURL=index.js.map
