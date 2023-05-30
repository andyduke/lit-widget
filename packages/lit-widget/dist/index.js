/*
  LitWidget 1.0.0-beta.1
  Copyright (C) 2023 Andy Chentsov <chentsov@gmail.com>
  @license BSD-3-Clause
*/

(function (exports, lit, templateContent_js) {

  /**
   * Throttle the execution of the function.
   *
   * You can specify the value in milliseconds as a number or in string format
   * with the suffix `'<delay>ms'`, supported suffixes: ms - milliseconds, s - seconds, m - minutes.
   *
   * This can be handy for "resize" or "scroll" events.
   *
   * @param {function} fn - The function to throttle.
   * @param {(Number|string)} delay - Delay value.
   * @returns {Function} The new throttled function.
   */ function throttle(fn, delay) {
      var throttlePause;
      return function() {
          for(var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++)args[_key] = arguments[_key];
          var _this = this;
          throttlePause || (throttlePause = !0, setTimeout(function() {
              fn.apply(_this, args), throttlePause = !1;
          }, duration(delay)));
      };
  }
  /**
   * Debounce the execution of the function.
   *
   * You can specify the value in milliseconds as a number or in string format
   * with the suffix `'<delay>ms'`, supported suffixes: ms - milliseconds, s - seconds, m - minutes.
   *
   * This can be handy for events such as key presses or "input" in input fields.
   *
   * @param {function} fn - The function to debounce.
   * @param {(Number|string)} delay - Delay value.
   * @returns {Function} The new debounced function.
   */ function debounce(fn, delay) {
      var timeoutId;
      function debouncer() {
          for(var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++)args[_key] = arguments[_key];
          var _this = this;
          debouncer.clear(), timeoutId = setTimeout(function() {
              timeoutId = null, fn.apply(_this, args);
          }, duration(delay));
      }
      return debouncer.clear = function() {
          timeoutId && (clearTimeout(timeoutId), timeoutId = null);
      }, debouncer;
  }
  /**
   * Duration converter from human-readable form to milliseconds.
   *
   * Converts a string like `'<delay>ms'` to milliseconds.
   * Supported suffixes: ms - milliseconds, s - seconds, m - minutes.
   *
   * If a numeric value is passed, it is returned unchanged.
   *
   * @param {(string|Number)} value - Duration in human-readable form.
   * @returns {Number} - Value in milliseconds.
   */ function duration(value) {
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
  /**
   * Declarative binding to child elements for [LitElement](https://lit.dev/)
   * like [Github/Catalyst](https://catalyst.rocks/) and
   * [Stimulus.js](https://stimulus.hotwired.dev/).
   *
   * To define a widget, subclass LitWidget, specify targets using
   * the `@target/@targets` decorators or the `static targets/targetsAll` property,
   * and add event handlers using the `@onEvent` decorator or
   * the `static events` property.
   *
   * LitWidget unlike LitElement implements the **`render()`** method,
   * which renders all child elements of the widget through `<slot>`.
   * To change this behavior, simply override the `render` method and
   * implement your own rendering.
   *
   * LitWidget makes all page styles (both `<style>` and `<link>` tags) available
   * in **shadowRoot** by default (except styles with the `[data-shared="false"]` attribute),
   * this behavior can be disabled by setting the `sharedStyles` static property to `false`.
   */ var LitWidget = function(LitElement) {
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
                  }, event.debounce ? event._handler = debounce(event._handler, event.debounce) : event.throttle && (event._handler = throttle(event._handler, event.throttle)), null != event.wrapper && void 0 !== event.wrapper && (event._handler = event.wrapper.call(_this, event._handler, _this)), target1.addEventListener(event.event, event._handler);
              } else throw Error('[LitWidget "' + _this.tagName.toLowerCase() + '"] Event target "' + event.target + '" not found.');
          }();
      }, _proto._detachEvents = function() {
          for(var _step, _iterator = _create_for_of_iterator_helper_loose(this._events); !(_step = _iterator()).done;){
              var event = _step.value;
              event._handler && target.addEventListener(event.event, event._handler);
          }
      }, /**
     * findTarget will run `querySelectorAll` against the given widget element, plus
     * its shadowRoot, returning any the first child that:
     *
     *  - Matches the selector of `[data-target~="tag.name"]` where tag is the
     *    tagName of the HTMLElement, and `name` is the given `targetName` argument.
     *
     *  - Closest ascendant of the element, that matches the tagname of the
     *    widget, is the specific instance of the widget itself - in other
     *    words it is not nested in other widgets of the same type.
     *
     * @param {string} tagName - HTML element tag name
     * @param {string} targetName - Widget property name
     * @param {string} [selector] - Selector to find element instead of using [data-target]
     * @param {Function} [converter] - The result converter can be used to convert the tag, for example using templateContent
     * @returns {(HTMLElement|any|null)} The HTML element found, or null if no matching element was found
     */ _proto.findTarget = function(tagName, targetName, selector, converter) {
          void 0 === selector && (selector = null), void 0 === converter && (converter = null);
          var convert = function(value) {
              return converter ? converter(value) : value;
          }, tag = tagName.toLowerCase();
          if (selector) for(var _step, _iterator = _create_for_of_iterator_helper_loose(this.querySelectorAll(selector)); !(_step = _iterator()).done;){
              var el = _step.value;
              if (el.closest(tag) === this) return convert(el);
          }
          if (this.shadowRoot) for(var _step1, _iterator1 = _create_for_of_iterator_helper_loose(this.shadowRoot.querySelectorAll('[data-target~="' + tag + "." + targetName + '"]')); !(_step1 = _iterator1()).done;){
              var el1 = _step1.value;
              if (!el1.closest(tag)) return convert(el1);
          }
          for(var _step2, _iterator2 = _create_for_of_iterator_helper_loose(this.querySelectorAll('[data-target~="' + tag + "." + targetName + '"]')); !(_step2 = _iterator2()).done;){
              var el2 = _step2.value;
              if (el2.closest(tag) === this) return convert(el2);
          }
      }, /**
     * findTargets will run `querySelectorAll` against the given widget element, plus
     * its shadowRoot, returning all matching child elements that are:
     *
     *  - Matches the selector of `[data-targets~="tag.name"]` where tag is the
     *    tagName of the HTMLElement, and `name` is the given `targetName` argument.
     *
     *  - Closest ascendant of the element, that matches the tagname of the
     *    widget, is the specific instance of the widget itself - in other
     *    words it is not nested in other widgets of the same type.
     *
     * @param {string} tagName - HTML element tag name
     * @param {string} targetName - Widget property name
     * @param {string} [selector] - Selector to find elements instead of using [data-targets]
     * @param {Function} [converter] - The result converter can be used to convert the result tags, for example using templateContent
     * @returns {HTMLElement[]} The HTML elements found
     */ _proto.findTargets = function(tagName, targetName, selector, converter) {
          void 0 === selector && (selector = null), void 0 === converter && (converter = null);
          var convert = function(value) {
              return converter ? converter(value) : value;
          }, tag = tagName.toLowerCase(), targets = [];
          if (selector) for(var _step, _iterator = _create_for_of_iterator_helper_loose(this.querySelectorAll(selector)); !(_step = _iterator()).done;){
              var el = _step.value;
              el.closest(tag) === this && targets.push(convert(el));
          }
          if (this.shadowRoot) for(var _step1, _iterator1 = _create_for_of_iterator_helper_loose(this.shadowRoot.querySelectorAll('[data-targets~="' + tag + "." + targetName + '"]')); !(_step1 = _iterator1()).done;){
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
  /**
     * Specifies whether to import page styles into shadowRoot.
     */ LitWidget.sharedStyles = !0, LitWidget.addInitializer(function(instance) {
      var klass = Object.getPrototypeOf(instance).constructor;
      if (void 0 !== klass.targets) for(var _step, _iterator = _create_for_of_iterator_helper_loose(Object.entries(klass.targets)); !(_step = _iterator()).done;)!function() {
          var _step_value = _step.value, target1 = _step_value[0], options = _step_value[1];
          // Add target getter
          Object.defineProperty(instance, target1, {
              configurable: !0,
              get: function() {
                  if (void 0 === this._findCache && (this._findCache = {}), this._findCache[target1]) return this._findCache[target1];
                  var _this__findCache, _, targetElement = null != (_ = (_this__findCache = this._findCache)[target1]) ? _ : _this__findCache[target1] = this.findTarget(this.tagName, target1, options.selector);
                  return null == targetElement ? console.error('[LitWidget "' + klass.name + '"] Target "' + target1 + '" not found.') : ((!0 === options.template || "template" == targetElement.tagName.toLowerCase() && !1 !== options.template) && (targetElement = templateContent_js.templateContent(targetElement)), this._findCache[target1] = targetElement), targetElement;
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
                  return void 0 === this._findCache && (this._findCache = {}), null != (_ = (_this__findCache = this._findCache)[target1]) ? _ : _this__findCache[target1] = this.findTargets(this.tagName, target1, options.selector);
              }
          });
      }();
  });

  function _instanceof(left, right) {
      return null != right && "undefined" != typeof Symbol && right[Symbol.hasInstance] ? !!right[Symbol.hasInstance](left) : left instanceof right;
  }
  /**
   * Decorator to bind a property to a child HTML element
   *
   * By default, it binds to a child element with the `data-target` attribute equal to
   * the component's tag name and the name of the property connected by a dot,
   * like this - `tag-name.property-name`.
   *
   * The element is first looked up in renderRoot and then in the component tag itself.
   *
   * If a CSS selector is specified, the element with the matching selector
   * is searched for only among the child elements of the component tag.
   *
   * If the element being bound is the `<template>` tag, then by default
   * automatic conversion takes place using the Lit's directive `templateContent`.
   * To disable this behavior - you must specify `template: false`.
   *
   * @param {{selector: string, template: Boolean}} options - Optional parameters for binding.
   * @param {string} options.selector - CSS selector to find the element to which the property will be bound.
   * @param {Boolean} options.template - Controls how the `<template>` tag is converted when bound.
   */ function target$1(param, name) {
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
  /**
   * Decorator to bind a property to an array of HTML child elements
   *
   * By default, it binds to an array of child elements with a `data-targets`
   * attribute equal to the component's tag name and the name of the property
   * connected by a dot, like this - `tag-name.property-name`.
   *
   * Elements are looked up in renderRoot and in the component tag itself.
   *
   * If a CSS selector is specified, all elements with the matching selector
   * are searched only among the child elements of the component tag.
   *
   * @param {{selector: string}} options - Optional parameters for binding.
   * @param {string} options.selector - CSS selector to find the elements to which the property will be bound.
   */ function targets(param, name) {
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
  /**
   * Decorator to attach a method as an HTML child element event handler
   *
   * @param {string} target - The name of the target to find the HTML element.
   * @param {string} event - The name of the DOM event to which the handler is attached.
   * @param {{debounce: (Number|string), throttle: (Number|string), wrapper: function(function, this)}} options - Optional parameters for attaching an event.
   * @param options.debounce - Delay to debounce the execution of the event handler,
   *     you can specify the value in milliseconds as a number or in string format
   *     with the suffix `'<delay>ms'`, supported suffixes: ms - milliseconds, s - seconds, m - minutes.
   *     This can be handy for events such as key presses or "input" in input fields.
   * @param options.throttle - Delay to throttle the execution of the event handler,
   *     you can specify the value in milliseconds as a number or in string format
   *     with the suffix `'<delay>ms'`, supported suffixes: ms - milliseconds, s - seconds, m - minutes.
   *     This can be handy for "resize" or "scroll" events.
   * @param options.wrapper - Wrapper function to apply additional decorators to the event handler;
   *     can be useful for example to apply a debounce decorator with a delay set at runtime:
   *     `onEvent(..., wrapper: (fn, self) => debounce(fn, self.delay) )`.
   *     The first parameter in the wrapper is the event handler method,
   *     the second is a reference to the class instance.
   */ function onEvent(target, event, param) {
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
