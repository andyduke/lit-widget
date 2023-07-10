/*
  LitWidget 1.0.0-beta.1
  Copyright (C) 2023 Andy Chentsov <chentsov@gmail.com>
  @license BSD-3-Clause
*/

(function (exports, lit, templateContent_js) {

  function _array_like_to_array$5(arr, len) {
      (null == len || len > arr.length) && (len = arr.length);
      for(var i = 0, arr2 = Array(len); i < len; i++)arr2[i] = arr[i];
      return arr2;
  }
  function _defineProperties$1(target, props) {
      for(var i = 0; i < props.length; i++){
          var descriptor = props[i];
          descriptor.enumerable = descriptor.enumerable || !1, descriptor.configurable = !0, "value" in descriptor && (descriptor.writable = !0), Object.defineProperty(target, descriptor.key, descriptor);
      }
  }
  function _set_prototype_of$1(o, p) {
      return (_set_prototype_of$1 = Object.setPrototypeOf || function(o, p) {
          return o.__proto__ = p, o;
      })(o, p);
  }
  function _create_for_of_iterator_helper_loose$4(o, allowArrayLike) {
      var it = "undefined" != typeof Symbol && o[Symbol.iterator] || o["@@iterator"];
      if (it) return (it = it.call(o)).next.bind(it);
      if (Array.isArray(o) || (it = function(o, minLen) {
          if (o) {
              if ("string" == typeof o) return _array_like_to_array$5(o, minLen);
              var n = Object.prototype.toString.call(o).slice(8, -1);
              if ("Object" === n && o.constructor && (n = o.constructor.name), "Map" === n || "Set" === n) return Array.from(n);
              if ("Arguments" === n || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _array_like_to_array$5(o, minLen);
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
  var LitWidgetBase = function(LitElement) {
      function LitWidgetBase() {
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
          }), superClass && _set_prototype_of$1(subClass, superClass);
      }(LitWidgetBase, LitElement);
      var _proto = LitWidgetBase.prototype;
      return _proto.createTargetPath = function(tagName, targetName) {
          return tagName.toLowerCase() + "." + targetName;
      }, _proto.createTargetSelector = function(tagName, targetName) {
          var tag = tagName.toLowerCase();
          return "[" + this.targetAttribute + '~="' + tag + "." + targetName + '"]';
      }, _proto.createTargetsSelector = function(tagName, targetName) {
          var tag = tagName.toLowerCase();
          return "[" + this.targetsAttribute + '~="' + tag + "." + targetName + '"]';
      }, _proto.targetMatches = function(el, tagName, targetName) {
          var selector = this.createTargetSelector(tagName, targetName);
          return el.matches(selector);
      }, _proto.targetsMatches = function(el, tagName, targetName) {
          var selector = this.createTargetsSelector(tagName, targetName);
          return el.matches(selector);
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
          if (selector) for(var _step, _iterator = _create_for_of_iterator_helper_loose$4(this.querySelectorAll(selector)); !(_step = _iterator()).done;){
              var el = _step.value;
              if (el.closest(tag) === this) return convert(el);
          }
          var targetSelector = this.createTargetSelector(tag, targetName);
          if (this.shadowRoot) for(var _step1, _iterator1 = _create_for_of_iterator_helper_loose$4(this.shadowRoot.querySelectorAll(targetSelector)); !(_step1 = _iterator1()).done;){
              var el1 = _step1.value;
              if (!el1.closest(tag)) return convert(el1);
          }
          for(var _step2, _iterator2 = _create_for_of_iterator_helper_loose$4(this.querySelectorAll(targetSelector)); !(_step2 = _iterator2()).done;){
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
          if (selector) for(var _step, _iterator = _create_for_of_iterator_helper_loose$4(this.querySelectorAll(selector)); !(_step = _iterator()).done;){
              var el = _step.value;
              el.closest(tag) === this && targets.push(convert(el));
          }
          var targetsSelector = this.createTargetsSelector(tag, targetName);
          if (this.shadowRoot) for(var _step1, _iterator1 = _create_for_of_iterator_helper_loose$4(this.shadowRoot.querySelectorAll(targetsSelector)); !(_step1 = _iterator1()).done;){
              var el1 = _step1.value;
              el1.closest(tag) || targets.push(convert(el1));
          }
          for(var _step2, _iterator2 = _create_for_of_iterator_helper_loose$4(this.querySelectorAll(targetsSelector)); !(_step2 = _iterator2()).done;){
              var el2 = _step2.value;
              el2.closest(tag) === this && targets.push(convert(el2));
          }
          return targets;
      }, _defineProperties$1(LitWidgetBase.prototype, [
          {
              key: "targetAttribute",
              get: function() {
                  return "data-target";
              }
          },
          {
              key: "targetsAttribute",
              get: function() {
                  return "data-targets";
              }
          }
      ]), LitWidgetBase;
  }(lit.LitElement);

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

  function _array_like_to_array$4(arr, len) {
      (null == len || len > arr.length) && (len = arr.length);
      for(var i = 0, arr2 = Array(len); i < len; i++)arr2[i] = arr[i];
      return arr2;
  }
  function _class_private_field_loose_base$1(receiver, privateKey) {
      if (!Object.prototype.hasOwnProperty.call(receiver, privateKey)) throw TypeError("attempted to use private field on non-instance");
      return receiver;
  }
  var id$1 = 0;
  function _class_private_field_loose_key$1(name) {
      return "__private_" + id$1++ + "_" + name;
  }
  function _create_for_of_iterator_helper_loose$3(o, allowArrayLike) {
      var it = "undefined" != typeof Symbol && o[Symbol.iterator] || o["@@iterator"];
      if (it) return (it = it.call(o)).next.bind(it);
      if (Array.isArray(o) || (it = function(o, minLen) {
          if (o) {
              if ("string" == typeof o) return _array_like_to_array$4(o, minLen);
              var n = Object.prototype.toString.call(o).slice(8, -1);
              if ("Object" === n && o.constructor && (n = o.constructor.name), "Map" === n || "Set" === n) return Array.from(n);
              if ("Arguments" === n || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _array_like_to_array$4(o, minLen);
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
  var _map = /*#__PURE__*/ _class_private_field_loose_key$1("_map"), _normalizeKey = /*#__PURE__*/ _class_private_field_loose_key$1("_normalizeKey"), _Symbol_iterator = Symbol.iterator;
  var ListenersMap = function() {
      function ListenersMap() {
          Object.defineProperty(this, _normalizeKey, {
              value: normalizeKey
          }), Object.defineProperty(this, _map, {
              writable: !0,
              value: void 0
          }), _class_private_field_loose_base$1(this, _map)[_map] = new Map();
      }
      var _proto = ListenersMap.prototype;
      return _proto.has = function(el, key) {
          return !!_class_private_field_loose_base$1(this, _map)[_map].has(el) && _class_private_field_loose_base$1(this, _map)[_map].get(el).has(_class_private_field_loose_base$1(this, _normalizeKey)[_normalizeKey](key));
      }, _proto.get = function(el, key) {
          return _class_private_field_loose_base$1(this, _map)[_map].has(el) ? _class_private_field_loose_base$1(this, _map)[_map].get(el).get(_class_private_field_loose_base$1(this, _normalizeKey)[_normalizeKey](key)) : null;
      }, _proto.set = function(el, key, value) {
          var listeners = _class_private_field_loose_base$1(this, _map)[_map].get(el) || new Map(), normalizedKey = _class_private_field_loose_base$1(this, _normalizeKey)[_normalizeKey](key);
          listeners.set(normalizedKey, value), _class_private_field_loose_base$1(this, _map)[_map].set(el, listeners);
      }, _proto.delete = function(el, key) {
          return _class_private_field_loose_base$1(this, _map)[_map].has(el) ? _class_private_field_loose_base$1(this, _map)[_map].get(el).delete(_class_private_field_loose_base$1(this, _normalizeKey)[_normalizeKey](key)) : null;
      }, _proto.clear = function() {
          _class_private_field_loose_base$1(this, _map)[_map] = new Map();
      }, _proto[_Symbol_iterator] = function() {
          var _iterator, _step, _step_value, el, _iterator1, _step1, _step_value1;
          return function(thisArg, body) {
              var f, y, t, g, _ = {
                  label: 0,
                  sent: function() {
                      if (1 & t[0]) throw t[1];
                      return t[1];
                  },
                  trys: [],
                  ops: []
              };
              return g = {
                  next: verb(0),
                  throw: verb(1),
                  return: verb(2)
              }, "function" == typeof Symbol && (g[Symbol.iterator] = function() {
                  return this;
              }), g;
              function verb(n) {
                  return function(v) {
                      return function(op) {
                          if (f) throw TypeError("Generator is already executing.");
                          for(; _;)try {
                              if (f = 1, y && (t = 2 & op[0] ? y.return : op[0] ? y.throw || ((t = y.return) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
                              switch(y = 0, t && (op = [
                                  2 & op[0],
                                  t.value
                              ]), op[0]){
                                  case 0:
                                  case 1:
                                      t = op;
                                      break;
                                  case 4:
                                      return _.label++, {
                                          value: op[1],
                                          done: !1
                                      };
                                  case 5:
                                      _.label++, y = op[1], op = [
                                          0
                                      ];
                                      continue;
                                  case 7:
                                      op = _.ops.pop(), _.trys.pop();
                                      continue;
                                  default:
                                      if (!(t = (t = _.trys).length > 0 && t[t.length - 1]) && (6 === op[0] || 2 === op[0])) {
                                          _ = 0;
                                          continue;
                                      }
                                      if (3 === op[0] && (!t || op[1] > t[0] && op[1] < t[3])) {
                                          _.label = op[1];
                                          break;
                                      }
                                      if (6 === op[0] && _.label < t[1]) {
                                          _.label = t[1], t = op;
                                          break;
                                      }
                                      if (t && _.label < t[2]) {
                                          _.label = t[2], _.ops.push(op);
                                          break;
                                      }
                                      t[2] && _.ops.pop(), _.trys.pop();
                                      continue;
                              }
                              op = body.call(thisArg, _);
                          } catch (e) {
                              op = [
                                  6,
                                  e
                              ], y = 0;
                          } finally{
                              f = t = 0;
                          }
                          if (5 & op[0]) throw op[1];
                          return {
                              value: op[0] ? op[1] : void 0,
                              done: !0
                          };
                      }([
                          n,
                          v
                      ]);
                  };
              }
          }(this, function(_state) {
              switch(_state.label){
                  case 0:
                      _iterator = _create_for_of_iterator_helper_loose$3(_class_private_field_loose_base$1(this, _map)[_map]), _state.label = 1;
                  case 1:
                      if ((_step = _iterator()).done) return [
                          3,
                          6
                      ];
                      el = (_step_value = _step.value)[0], _iterator1 = _create_for_of_iterator_helper_loose$3(_step_value[1]), _state.label = 2;
                  case 2:
                      if ((_step1 = _iterator1()).done) return [
                          3,
                          5
                      ];
                      return [
                          4,
                          [
                              el,
                              (_step_value1 = _step1.value)[0],
                              _step_value1[1]
                          ]
                      ];
                  case 3:
                      _state.sent(), _state.label = 4;
                  case 4:
                      return [
                          3,
                          2
                      ];
                  case 5:
                      return [
                          3,
                          1
                      ];
                  case 6:
                      return [
                          2
                      ];
              }
          });
      }, ListenersMap;
  }();
  function normalizeKey(key) {
      return JSON.stringify(key);
  //return key;
  }

  function _array_like_to_array$3(arr, len) {
      (null == len || len > arr.length) && (len = arr.length);
      for(var i = 0, arr2 = Array(len); i < len; i++)arr2[i] = arr[i];
      return arr2;
  }
  function _instanceof$2(left, right) {
      return null != right && "undefined" != typeof Symbol && right[Symbol.hasInstance] ? !!right[Symbol.hasInstance](left) : left instanceof right;
  }
  function _create_for_of_iterator_helper_loose$2(o, allowArrayLike) {
      var it = "undefined" != typeof Symbol && o[Symbol.iterator] || o["@@iterator"];
      if (it) return (it = it.call(o)).next.bind(it);
      if (Array.isArray(o) || (it = function(o, minLen) {
          if (o) {
              if ("string" == typeof o) return _array_like_to_array$3(o, minLen);
              var n = Object.prototype.toString.call(o).slice(8, -1);
              if ("Object" === n && o.constructor && (n = o.constructor.name), "Map" === n || "Set" === n) return Array.from(n);
              if ("Arguments" === n || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _array_like_to_array$3(o, minLen);
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
  var EventHandler = function() {
      function EventHandler(eventName, handler) {
          this.eventName = eventName, this.handler = handler;
      }
      var _proto = EventHandler.prototype;
      return _proto.addListener = function(el) {
          el.addEventListener(this.eventName, this.handler);
      }, _proto.removeListener = function(el) {
          el.removeEventListener(this.eventName, this.handler);
      }, EventHandler;
  }();
  /**
   * TODO:
   */ var EventsController = function() {
      function EventsController(host, events) {
          if (this.listeners = new ListenersMap(), !_instanceof$2(host, LitWidgetBase)) throw Error("[LitWidget.EventsController]: The host is not an instance of the LitWidget class.");
          this.host = host, this.tagName = this.host.tagName.toLowerCase(), this.events = this.prepareEvents(events), // console.log('Events:', this.events);
          this.host.addController(this);
      }
      var _proto = EventsController.prototype;
      return _proto.prepareEvents = function(events) {
          for(var _step, targetedEvents = new Map(), _iterator = _create_for_of_iterator_helper_loose$2(events); !(_step = _iterator()).done;){
              var event = _step.value, target = void 0;
              if (_instanceof$2(event.target, HTMLElement) || _instanceof$2(event.target, Document) || _instanceof$2(event.target, Window)) target = {
                  type: "element",
                  element: event.target
              };
              else if ("string" == typeof event.target) target = {
                  type: "target",
                  target: event.target,
                  selector: event.selector
              };
              else throw Error("[LitWidget.EventsController]: Invalid event definition: " + JSON.stringify(event) + ".");
              targetedEvents.set(target, event);
          }
          // console.log('Targeted events:', targetedEvents);
          return targetedEvents;
      }, _proto.hostConnected = function() {
          // console.log('[!] EventsController connected');
          // Bind [type=element] events to elements
          this.bindElementsEvents(), // Bind element events to targets
          this.bindTargetElements(this.host), // Observe shadowRoot and element
          this.listen([
              this.host.shadowRoot,
              this.host
          ]);
      }, _proto.hostDisconnected = function() {
          null == (// console.log('[!] EventsController disconnected');
          // Disconnect observer
          _this_observer = this.observer) || _this_observer.disconnect(), this.observer = null;
          // Remove elements listeners
          for(var _this_observer, _step, _iterator = _create_for_of_iterator_helper_loose$2(this.listeners); !(_step = _iterator()).done;){
              var _step_value = _step.value, element = _step_value[0];
              (_step_value[1], _step_value[2]).removeListener(element);
          }
          this.listeners.clear();
      }, _proto.createHandler = function(event) {
          var _this = this, eventName = event.event, handler = function() {
              for(var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++)args[_key] = arguments[_key];
              return event.handler.apply(_this.host, args);
          };
          // Handle conditional event (eventName = {eventHandler: string, isMatch: function})
          if (event.debounce ? handler = debounce(handler, event.debounce) : event.throttle && (handler = throttle(handler, event.throttle)), null != event.wrapper && void 0 !== event.wrapper && (handler = event.wrapper.call(this.host, handler /*, this.host*/ )), "string" == typeof event.selector && (prevHandler = handler, handler = function(e) {
              e.target.matches(event.selector) && prevHandler(e);
          }), "object" == typeof eventName) {
              var prevHandler, isMatch, prevHandler1, preset = eventName;
              if (null == preset.eventName || "function" != typeof preset.isMatch) throw Error("[LitWidget.EventsController]: Invalid conditional event: " + preset);
              // Extract eventName from preset
              eventName = preset.eventName, isMatch = preset.isMatch, prevHandler1 = handler, // Wrap handler
              handler = function(e) {
                  isMatch(e) && prevHandler1(e);
              };
          }
          return new EventHandler(eventName, handler);
      }, _proto.bindElementsEvents = function() {
          for(var _step, _iterator = _create_for_of_iterator_helper_loose$2(this.events); !(_step = _iterator()).done;){
              var _step_value = _step.value, eventInfo = _step_value[0], event = _step_value[1];
              if ("element" === eventInfo.type) {
                  var key = {
                      element: eventInfo.element,
                      target: eventInfo
                  };
                  if (!this.listeners.has(eventInfo.element, key)) {
                      // Create event handler
                      var eventHandler = this.createHandler(event);
                      // Add listener to element
                      eventHandler.addListener(eventInfo.element), // Store element's event handler
                      this.listeners.set(eventInfo.element, key, eventHandler);
                  }
              }
          }
      }, _proto.bindEvents = function(el, oldAttrValue) {
          // console.log('Bind actions:', el);
          // for (const event of this.events) {
          for(var _step, _iterator = _create_for_of_iterator_helper_loose$2(this.events); !(_step = _iterator()).done;){
              var _step_value = _step.value, eventInfo = _step_value[0], event = _step_value[1];
              if ("target" === eventInfo.type) {
                  var isMatch = this.host.targetMatches(el, this.tagName, eventInfo.target) || this.host.targetsMatches(el, this.tagName, eventInfo.target), isOldMatch = !isMatch && oldAttrValue == this.host.createTargetPath(this.tagName, eventInfo.target), key = {
                      element: el,
                      id: event.id
                  };
                  if (isMatch) {
                      if (this.listeners.has(el, key) || el.getRootNode() === this.host.shadowRoot && el.closest(this.tagName)) continue;
                      // Create event handler
                      var eventHandler = this.createHandler(event);
                      // Add listener to element
                      eventHandler.addListener(el), // Store element's event handler
                      this.listeners.set(el, key, eventHandler);
                  } else if (isOldMatch) {
                      if (!this.listeners.has(el, key)) continue;
                      // console.log('Bind [3] (-):', key, el, event);
                      // Remove listeners if attribute removed
                      var handler = this.listeners.get(el, key);
                      null == handler || handler.removeListener(el), // Remove element from listeners map
                      this.listeners.delete(el, key);
                  }
              }
          }
      }, _proto.bindTargetElements = function(root) {
          // Bind controller's targets
          for(var _step, _iterator = _create_for_of_iterator_helper_loose$2(root.querySelectorAll("[" + this.host.targetAttribute + "],[" + this.host.targetsAttribute + "]")); !(_step = _iterator()).done;){
              var el = _step.value;
              this.bindEvents(el);
          }
          _instanceof$2(root, Element) && (root.hasAttribute(this.host.targetAttribute) || root.hasAttribute(this.host.targetsAttribute)) && this.bindEvents(root);
      }, _proto.listen = function(els) {
          var _this = this;
          this.observer || // Create observer
          (this.observer = new MutationObserver(function(mutations) {
              for(var _step, _iterator = _create_for_of_iterator_helper_loose$2(mutations); !(_step = _iterator()).done;){
                  var mutation = _step.value;
                  if ("attributes" === mutation.type && _instanceof$2(mutation.target, Element)) _this.bindEvents(mutation.target, mutation.oldValue);
                  else if ("childList" === mutation.type && mutation.addedNodes.length) for(var _step1, _iterator1 = _create_for_of_iterator_helper_loose$2(mutation.addedNodes); !(_step1 = _iterator1()).done;){
                      var node = _step1.value;
                      _instanceof$2(node, Element) && _this.bindTargetElements(node);
                  }
              }
          }));
          // Observe elements
          for(var _step, _iterator = _create_for_of_iterator_helper_loose$2(els); !(_step = _iterator()).done;){
              var el = _step.value;
              null != el && this.observer.observe(el, {
                  childList: !0,
                  subtree: !0,
                  attributeFilter: [
                      this.host.targetAttribute,
                      this.host.targetsAttribute
                  ],
                  attributeOldValue: !0
              });
          }
      }, EventsController;
  }();

  function _array_like_to_array$2(arr, len) {
      (null == len || len > arr.length) && (len = arr.length);
      for(var i = 0, arr2 = Array(len); i < len; i++)arr2[i] = arr[i];
      return arr2;
  }
  function _instanceof$1(left, right) {
      return null != right && "undefined" != typeof Symbol && right[Symbol.hasInstance] ? !!right[Symbol.hasInstance](left) : left instanceof right;
  }
  function _create_for_of_iterator_helper_loose$1(o, allowArrayLike) {
      var it = "undefined" != typeof Symbol && o[Symbol.iterator] || o["@@iterator"];
      if (it) return (it = it.call(o)).next.bind(it);
      if (Array.isArray(o) || (it = function(o, minLen) {
          if (o) {
              if ("string" == typeof o) return _array_like_to_array$2(o, minLen);
              var n = Object.prototype.toString.call(o).slice(8, -1);
              if ("Object" === n && o.constructor && (n = o.constructor.name), "Map" === n || "Set" === n) return Array.from(n);
              if ("Arguments" === n || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _array_like_to_array$2(o, minLen);
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
  var DocumentStylesObserver = function() {
      function DocumentStylesObserver(document) {
          var _this = this;
          this.document = document, this.listeners = new Set(), this.observing = !1, this.observer = new MutationObserver(function(mutations) {
              for(var _step, _iterator = _create_for_of_iterator_helper_loose$1(mutations); !(_step = _iterator()).done;){
                  var mutation = _step.value;
                  if ("childList" === mutation.type && (mutation.addedNodes.length || mutation.removedNodes.length)) {
                      // console.log('! [+]', mutation.addedNodes);
                      // console.log('! [-]', mutation.removedNodes);
                      for(var _step1, _iterator1 = _create_for_of_iterator_helper_loose$1(mutation.addedNodes); !(_step1 = _iterator1()).done;){
                          var node = _step1.value;
                          if (_instanceof$1(node, Element)) {
                              var tagName = node.tagName.toLowerCase();
                              ("style" == tagName || "link" == tagName && "stylesheet" == node.getAttribute("rel")) && _this.notifyListeners({
                                  type: "add",
                                  node: node
                              });
                          }
                      }
                      for(var _step2, _iterator2 = _create_for_of_iterator_helper_loose$1(mutation.removedNodes); !(_step2 = _iterator2()).done;){
                          var node1 = _step2.value;
                          if (_instanceof$1(node1, Element)) {
                              var tagName1 = node1.tagName.toLowerCase();
                              ("style" == tagName1 || "link" == tagName1 && "stylesheet" == node1.getAttribute("rel")) && _this.notifyListeners({
                                  type: "remove",
                                  node: node1
                              });
                          }
                      }
                  }
              }
          });
      }
      var _proto = DocumentStylesObserver.prototype;
      return _proto.observe = function() {
          this.observing || (this.observer.observe(this.document.head, {
              childList: !0,
              subtree: !0
          }), this.observing = !0);
      }, _proto.disconnect = function() {
          this.observing && (this.observer.takeRecords(), this.observer.disconnect(), this.observing = !1);
      }, _proto.addListener = function(fn) {
          this.listeners.add(fn), this.listeners.size > 0 && this.observe();
      }, _proto.removeListener = function(fn) {
          this.listeners.delete(fn), 0 == this.listeners.size && this.disconnect();
      }, _proto.notifyListeners = function(operation) {
          for(var _step, _iterator = _create_for_of_iterator_helper_loose$1(this.listeners); !(_step = _iterator()).done;)(0, _step.value)(operation);
      }, DocumentStylesObserver;
  }();
  /**
   * TODO:
   */ var SharedStylesController = function() {
      function SharedStylesController(host, sharedStyles) {
          var _this = this;
          this.initialized = !1, this.styles = new WeakMap(), sharedStyles && (this.host = host, this.host.addController(this), this.stylesUpdated = function(o) {
              return _this.updated(o);
          });
      }
      var _proto = SharedStylesController.prototype;
      return _proto.hostConnected = function() {
          var shadowRoot = null != this.host.shadowRoot;
          if (!this.initialized) {
              this.initialized = !0;
              var root = this.host.renderRoot, document = this.host.ownerDocument;
              if (shadowRoot) {
                  // Import styles
                  for(var _step, _iterator = _create_for_of_iterator_helper_loose$1(document.head.querySelectorAll("style")); !(_step = _iterator()).done;){
                      var style = _step.value;
                      this.addStyle(style, root);
                  }
                  // Import link[stylesheet]
                  for(var _step1, _iterator1 = _create_for_of_iterator_helper_loose$1(document.head.querySelectorAll('link[rel="stylesheet"]')); !(_step1 = _iterator1()).done;){
                      var style1 = _step1.value;
                      this.addStyle(style1, root);
                  }
              }
          }
          shadowRoot && this.startObserving();
      }, _proto.addStyle = function(style, root) {
          // Skip non-shared styles
          if (void 0 === root && (root = null), "false" != style.getAttribute("data-shared")) {
              null == root && (root = this.host.renderRoot), null == this.styleRoot && (this.styleRoot = this.host.ownerDocument.createElement("shared-styles--"), root.insertBefore(this.styleRoot, root.firstChild));
              // Cloning and adding a style
              var styleClone = style.cloneNode(!0);
              this.styleRoot.appendChild(styleClone), // Save the link between the style and its clone
              this.styles.set(style, styleClone);
          }
      }, _proto.removeStyle = function(style) {
          var styleClone = this.styles.get(style);
          null != styleClone && (styleClone.remove(), this.styles.delete(style));
      }, _proto.hostDisconnected = function() {
          this.stopObserving();
      }, _proto.startObserving = function() {
          null == SharedStylesController.observer && (SharedStylesController.observer = new DocumentStylesObserver(this.host.ownerDocument)), // Start observing
          SharedStylesController.observer.addListener(this.stylesUpdated);
      }, _proto.stopObserving = function() {
          null != SharedStylesController.observer && SharedStylesController.observer.removeListener(this.stylesUpdated);
      }, _proto.updated = function(param) {
          var type = param.type, node = param.node;
          switch(type){
              case "add":
                  this.addStyle(node);
                  break;
              case "remove":
                  this.removeStyle(node);
          }
      }, SharedStylesController;
  }();

  function _array_like_to_array$1(arr, len) {
      (null == len || len > arr.length) && (len = arr.length);
      for(var i = 0, arr2 = Array(len); i < len; i++)arr2[i] = arr[i];
      return arr2;
  }
  function _assert_this_initialized(self) {
      if (void 0 === self) throw ReferenceError("this hasn't been initialised - super() hasn't been called");
      return self;
  }
  function _class_private_field_loose_base(receiver, privateKey) {
      if (!Object.prototype.hasOwnProperty.call(receiver, privateKey)) throw TypeError("attempted to use private field on non-instance");
      return receiver;
  }
  var id = 0;
  function _class_private_field_loose_key(name) {
      return "__private_" + id++ + "_" + name;
  }
  function _defineProperties(target, props) {
      for(var i = 0; i < props.length; i++){
          var descriptor = props[i];
          descriptor.enumerable = descriptor.enumerable || !1, descriptor.configurable = !0, "value" in descriptor && (descriptor.writable = !0), Object.defineProperty(target, descriptor.key, descriptor);
      }
  }
  function _extends() {
      return (_extends = Object.assign || function(target) {
          for(var i = 1; i < arguments.length; i++){
              var source = arguments[i];
              for(var key in source)Object.prototype.hasOwnProperty.call(source, key) && (target[key] = source[key]);
          }
          return target;
      }).apply(this, arguments);
  }
  function _set_prototype_of(o, p) {
      return (_set_prototype_of = Object.setPrototypeOf || function(o, p) {
          return o.__proto__ = p, o;
      })(o, p);
  }
  function _to_consumable_array(arr) {
      return function(arr) {
          if (Array.isArray(arr)) return _array_like_to_array$1(arr);
      }(arr) || function(iter) {
          if ("undefined" != typeof Symbol && null != iter[Symbol.iterator] || null != iter["@@iterator"]) return Array.from(iter);
      }(arr) || _unsupported_iterable_to_array(arr) || function() {
          throw TypeError("Invalid attempt to spread non-iterable instance.\\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
      }();
  }
  function _unsupported_iterable_to_array(o, minLen) {
      if (o) {
          if ("string" == typeof o) return _array_like_to_array$1(o, minLen);
          var n = Object.prototype.toString.call(o).slice(8, -1);
          if ("Object" === n && o.constructor && (n = o.constructor.name), "Map" === n || "Set" === n) return Array.from(n);
          if ("Arguments" === n || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _array_like_to_array$1(o, minLen);
      }
  }
  function _create_for_of_iterator_helper_loose(o, allowArrayLike) {
      var it = "undefined" != typeof Symbol && o[Symbol.iterator] || o["@@iterator"];
      if (it) return (it = it.call(o)).next.bind(it);
      if (Array.isArray(o) || (it = _unsupported_iterable_to_array(o)) || allowArrayLike && o && "number" == typeof o.length) {
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
  var // #endregion Default values
  // #region Events
  _events = /*#__PURE__*/ _class_private_field_loose_key("_events"), _prepareEvents = /*#__PURE__*/ _class_private_field_loose_key("_prepareEvents"), _sharedStylesController = /*#__PURE__*/ _class_private_field_loose_key("_sharedStylesController");
  /**
   * Declarative binding to child elements for [LitElement](https://lit.dev/)
   * like [Github/Catalyst](https://catalyst.rocks/) and
   * [Stimulus.js](https://stimulus.hotwired.dev/).
   *
   * To define a widget, subclass LitWidget, specify targets using
   * the `@target/@targets` decorators or the `static targets/targetsAll` property,
   * and add event handlers using the `@onEvent` decorator or
   * the `events` property.
   *
   * LitWidget unlike LitElement implements the **`render()`** method,
   * which renders all child elements of the widget through `<slot>`.
   * To change this behavior, simply override the `render` method and
   * implement your own rendering.
   *
   * LitWidget makes all page styles (both `<style>` and `<link>` tags) available
   * in **shadowRoot** by default (except styles with the `[data-shared="false"]` attribute),
   * this behavior can be disabled by setting the `sharedStyles` static property to `false`.
   *
   * TODO: Describe [data-root] binding
   *
   * TODO: Describe "static targets/targetsAll"
   * TODO: Describe "static events"
   * TODO: Describe defaultValues pattern
   *
   * ## Events:
   *
   * ```js
   * events = [
   *   // Event bound to target
   *   {event: 'click', target: 'button', handler: 'doClick'},
   *
   *   // Event bound to DOM Element
   *   {event: 'click', target: document, handler: 'outsideClick'},
   *
   *   // Event bound to element via selector
   *   {event: 'click', selector: '.expand-button', handler: 'doExpand'},
   * ];
   * ```
   *
   */ var LitWidget = function(LitWidgetBase) {
      function LitWidget() {
          var _this;
          return _this = LitWidgetBase.apply(this, arguments) || this, Object.defineProperty(_assert_this_initialized(_this), _prepareEvents, {
              value: prepareEvents
          }), Object.defineProperty(_assert_this_initialized(_this), _events, {
              writable: !0,
              value: void 0
          }), Object.defineProperty(_assert_this_initialized(_this), _sharedStylesController, {
              writable: !0,
              value: void 0
          }), _class_private_field_loose_base(_this, _sharedStylesController)[_sharedStylesController] = new SharedStylesController(_assert_this_initialized(_this), _this.sharedStyles), _this;
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
      }(LitWidget, LitWidgetBase);
      var protoProps, _proto = LitWidget.prototype;
      return(// #endregion Static helpers
      // #region Default render
      /**
     * Default renderer, renders Light DOM
     */ _proto.render = function() {
          return lit.html(_templateObject());
      }, _proto.createRenderRoot = function() {
          var root, tagName = this.tagName.toLowerCase();
          if (this.lightDOM) {
              // Find light DOM root [data-root]
              var rootElement = this.querySelector('[data-root="' + tagName + '"]');
              null != rootElement && rootElement.closest(tagName) != this && (rootElement = null), // Use found root target or element itself as renderRoot
              root = null != rootElement ? rootElement : this;
          } else root = LitWidgetBase.prototype.createRenderRoot.call(this);
          return this.lightDOM && !0 === this.sharedStyles && console.warn('[LitWidget "' + tagName + '"] Shared styles (sharedStyles = true) with lightDOM have no effect.'), root;
      }, // #endregion Light DOM
      // #region Lifecycle
      _proto.connectedCallback = function() {
          _class_private_field_loose_base(this, _events)[_events] || (_class_private_field_loose_base(this, _prepareEvents)[_prepareEvents](), _class_private_field_loose_base(this, _events)[_events] = new EventsController(this, this.events)), LitWidgetBase.prototype.connectedCallback.call(this);
      }, _proto.disconnectedCallback = function() {
          LitWidgetBase.prototype.disconnectedCallback.call(this), void 0 !== this._findCache && (this._findCache = {});
      }, // #region Static helpers
      /** TODO: ??? */ LitWidget.widget = function(name) {
          return function(proto, options) {
              LitWidget.define(name, proto, options);
          };
      }, LitWidget.define = function(name, constructor, options) {
          customElements.define("w-" + name, constructor, options);
      }, protoProps = [
          {
              key: "static",
              get: /**
     * TODO: Static getter
     */ function() {
                  return Object.getPrototypeOf(this).constructor;
              }
          },
          {
              key: "defaultValues",
              get: function() {
                  if (null != this._defaultValues) return this._defaultValues;
                  // const parentDefaultValues = (this instanceof LitWidget) ? {} : Object.getPrototypeOf(this).defaultValues;
                  var _Object_getPrototypeOf_defaultValues, parentDefaultValues = null != (_Object_getPrototypeOf_defaultValues = Object.getPrototypeOf(this).defaultValues) ? _Object_getPrototypeOf_defaultValues : {};
                  return this._defaultValues = _extends({}, parentDefaultValues, this.constructor.defaultValues), this._defaultValues;
              }
          },
          {
              key: "sharedStyles",
              get: /**
     * TODO: describe override case
     */ function() {
                  var sharedStyles = /*Object.getPrototypeOf(this).constructor*/ this.static.sharedStyles;
                  return null != sharedStyles || this.lightDOM || // If sharedStyles is "auto" and not lightDOM - then it will default to true
                  (sharedStyles = !0), sharedStyles;
              }
          },
          {
              key: "lightDOM",
              get: /**
     * TODO: describe override case
     */ function() {
                  return /*Object.getPrototypeOf(this).constructor*/ this.static.lightDOM;
              }
          }
      ], _defineProperties(LitWidget.prototype, protoProps), LitWidget);
  }(LitWidgetBase);
  function prepareEvents() {
      var eventsDefs = _to_consumable_array(this._events || []).concat(_to_consumable_array(this.events || [])).map(function(event, index) {
          return _extends({
              id: index
          }, event);
      });
      // Seal events
      Object.defineProperty(this, "events", {
          configurable: !0,
          get: function() {
              return eventsDefs;
          }
      });
  }
  // #endregion Default render
  // #region Default values
  LitWidget.defaultValues = {}, // #endregion Events
  // #region Shared styles
  /**
     * Specifies whether to import page styles into shadowRoot.
     */ LitWidget.sharedStyles = null, // #endregion Shared styles
  // #region Light DOM
  /**
     * TODO:
     */ LitWidget.lightDOM = !1, // #region Targets getters
  LitWidget.addInitializer(function(instance) {
      var klass = Object.getPrototypeOf(instance).constructor;
      if (void 0 !== klass.targets) for(var _step, _iterator = _create_for_of_iterator_helper_loose(Object.entries(klass.targets)); !(_step = _iterator()).done;)!function() {
          var _options_property, _step_value = _step.value, target = _step_value[0], options = _step_value[1];
          // Add target getter
          Object.defineProperty(instance, null != (_options_property = options.property) ? _options_property : target, {
              configurable: !0,
              get: function() {
                  if (void 0 === this._findCache && (this._findCache = {}), (null == (_options_cache = options.cache) || _options_cache) && this._findCache[target]) return this._findCache[target];
                  var _options_cache, _this__findCache, _, targetElement = null != (_ = (_this__findCache = this._findCache)[target]) ? _ : _this__findCache[target] = this.findTarget(this.tagName, target, options.selector);
                  return null == targetElement ? console.error('[LitWidget "' + klass.name + '"] Target "' + target + '" not found.') : ((!0 === options.template || "template" == targetElement.tagName.toLowerCase() && !1 !== options.template) && (targetElement = templateContent_js.templateContent(targetElement)), this._findCache[target] = targetElement), targetElement;
              }
          });
      }();
      if (void 0 !== klass.targetsAll) for(var _step1, _iterator1 = _create_for_of_iterator_helper_loose(Object.entries(klass.targetsAll)); !(_step1 = _iterator1()).done;)!function() {
          var _options_property, _step_value = _step1.value, target = _step_value[0], options = _step_value[1];
          // Add target getter
          Object.defineProperty(instance, null != (_options_property = options.property) ? _options_property : target, {
              configurable: !0,
              get: function() {
                  var _options_cache, _this__findAllCache, _;
                  return (void 0 === this._findAllCache && (this._findAllCache = {}), (null == (_options_cache = options.cache) || _options_cache) && this._findAllCache[target]) ? this._findAllCache[target] : null != (_ = (_this__findAllCache = this._findAllCache)[target]) ? _ : _this__findAllCache[target] = this.findTargets(this.tagName, target, options.selector);
              // return this._findAllCache[target] ??= this.findTargets(this.tagName, target, options.selector);
              }
          });
      }();
  });
   // #endregion Targets getters

  function _instanceof(left, right) {
      return null != right && "undefined" != typeof Symbol && right[Symbol.hasInstance] ? !!right[Symbol.hasInstance](left) : left instanceof right;
  }
  /**
   * Decorator to bind a property to a child HTML element
   *
   * TODO: examples
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
   * @param {{name: string, selector: string, cache: Boolean, template: Boolean}} options - Optional parameters for binding.
   * @param {string} options.name - Target name to find the element to which the property will be bound.
   * @param {string} options.selector - CSS selector to find the element to which the property will be bound.
   * @param {Boolean} options.cache - Should the bind operation be cached or search for an element each time it is accessed?
   * @param {Boolean} options.template - Controls how the `<template>` tag is converted when bound.
   */ function target(param, propertyName) {
      var _ref = void 0 === param ? {} : param, name = _ref.name, selector = _ref.selector, cache = _ref.cache, template = _ref.template;
      void 0 === propertyName && (propertyName = null);
      var wrapper = function(instance, property) {
          var klass = instance.constructor;
          if (!_instanceof(instance, LitWidget)) throw Error('[LitWidget] The class "' + klass.name + '" is not a descendant of LitWidget.');
          void 0 === klass.targets && (klass.targets = {}), klass.targets[null != name ? name : property] = {
              property: property,
              selector: selector,
              cache: cache,
              template: template
          };
      };
      if (null == propertyName) return wrapper;
      var instance = arguments[0];
      wrapper(instance, propertyName);
  }
  /**
   * Decorator to bind a property to an array of HTML child elements
   *
   * TODO: examples
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
   * @param {{name: string, selector: string, cache: Boolean}} options - Optional parameters for binding.
   * @param {string} options.name - Target name to find the elements to which the property will be bound.
   * @param {string} options.selector - CSS selector to find the elements to which the property will be bound.
   * @param {Boolean} options.cache - Should the bind operation be cached or search for an element each time it is accessed?
   */ function targets(param, propertyName) {
      var _ref = void 0 === param ? {} : param, name = _ref.name, selector = _ref.selector, cache = _ref.cache;
      void 0 === propertyName && (propertyName = null);
      var wrapper = function(instance, property) {
          var klass = instance.constructor;
          if (!_instanceof(instance, LitWidget)) throw Error('[LitWidget] The class "' + klass.name + '" is not a descendant of LitWidget.');
          void 0 === klass.targetsAll && (klass.targetsAll = {}), klass.targetsAll[null != name ? name : property] = {
              property: property,
              selector: selector,
              cache: cache
          };
      };
      if (null == propertyName) return wrapper;
      var instance = arguments[0];
      wrapper(instance, propertyName);
  }
  /**
   * Decorator to attach a method as an HTML child element event handler
   *
   * TODO: examples
   *
   * @param {(string|Window|Document|HTMLElement)} target - The name of the target to find the HTML element.
   *     You can pass an existing HTML element or window to attach an event handler to document.body or window for example.
   * @param {string|{eventName: string, isMatch: function}} event - The name of the DOM event to which the handler is attached.
   * @param {{selector: string, debounce: (Number|string), throttle: (Number|string), wrapper: function(function, this)}} options - Optional parameters for attaching an event.
   * @param {string} options.selector - This parameter allows you to filter the triggering of delegated events by CSS selector.
   * @param {string|number} options.debounce - Delay to debounce the execution of the event handler,
   *     you can specify the value in milliseconds as a number or in string format
   *     with the suffix `'<delay>ms'`, supported suffixes: ms - milliseconds, s - seconds, m - minutes.
   *     This can be handy for events such as key presses or "input" in input fields.
   * @param {string|number} options.throttle - Delay to throttle the execution of the event handler,
   *     you can specify the value in milliseconds as a number or in string format
   *     with the suffix `'<delay>ms'`, supported suffixes: ms - milliseconds, s - seconds, m - minutes.
   *     This can be handy for "resize" or "scroll" events.
   * @param {function} options.wrapper - Wrapper function to apply additional decorators to the event handler;
   *     can be useful for example to apply a debounce decorator with a delay set at runtime:
   *     `onEvent(..., wrapper: (fn, self) => debounce(fn, self.delay) )`.
   *     The first parameter in the wrapper is the event handler method,
   *     the second is a reference to the class instance.
   */ function onEvent(target, event, param) {
      var _ref = void 0 === param ? {} : param, selector = _ref.selector, debounce = _ref.debounce, throttle = _ref.throttle, wrapper = _ref.wrapper;
      return function(instance, property) {
          var klass = instance.constructor;
          if (!_instanceof(instance, LitWidget)) throw Error('[LitWidget] The class "' + klass.name + '" is not a descendant of LitWidget.');
          void 0 === instance._events && (instance._events = []), instance._events.push({
              target: target,
              handler: instance[property],
              event: event,
              selector: selector,
              debounce: debounce,
              throttle: throttle,
              wrapper: wrapper
          });
      };
  }

  // https://github.com/ianstormtaylor/is-hotkey/blob/master/src/index.js
  function _array_like_to_array(arr, len) {
      (null == len || len > arr.length) && (len = arr.length);
      for(var i = 0, arr2 = Array(len); i < len; i++)arr2[i] = arr[i];
      return arr2;
  }
  var KeyboardShortcut = function() {
      function KeyboardShortcut(shortcut, param) {
          var _ref_useKey = (void 0 === param ? {} : param).useKey;
          this.keyModifiers = {
              alt: "altKey",
              control: "ctrlKey",
              meta: "metaKey",
              shift: "shiftKey"
          }, this.keyAliases = {
              add: "+",
              break: "pause",
              cmd: "meta",
              command: "meta",
              ctl: "control",
              ctrl: "control",
              del: "delete",
              down: "arrowdown",
              esc: "escape",
              ins: "insert",
              left: "arrowleft",
              mod: this.constructor.isMac ? "meta" : "control",
              opt: "alt",
              option: "alt",
              return: "enter",
              right: "arrowright",
              space: " ",
              spacebar: " ",
              up: "arrowup",
              win: "meta",
              windows: "meta"
          }, this.keyCodes = {
              backspace: 8,
              tab: 9,
              enter: 13,
              shift: 16,
              control: 17,
              alt: 18,
              pause: 19,
              capslock: 20,
              escape: 27,
              " ": 32,
              pageup: 33,
              pagedown: 34,
              end: 35,
              home: 36,
              arrowleft: 37,
              arrowup: 38,
              arrowright: 39,
              arrowdown: 40,
              insert: 45,
              delete: 46,
              meta: 91,
              numlock: 144,
              scrolllock: 145,
              ";": 186,
              "=": 187,
              ",": 188,
              "-": 189,
              ".": 190,
              "/": 191,
              "`": 192,
              "[": 219,
              "\\": 220,
              "]": 221,
              "'": 222
          };
          // Generate F1-F20 codes
          for(var f = 1; f < 20; f++)this.keyCodes["f" + f] = 111 + f;
          this.useKey = void 0 === _ref_useKey || _ref_useKey, this.shortcutName = shortcut.toLowerCase(), this.shortcut = this.parse(this.shortcutName);
      }
      var staticProps, _proto = KeyboardShortcut.prototype;
      return _proto.toKeyName = function(name) {
          return name = name.toLowerCase(), name = this.keyAliases[name] || name;
      }, _proto.toKeyCode = function(name) {
          return name = this.toKeyName(name), this.keyCodes[name] || name.toUpperCase().charCodeAt(0);
      }, _proto.parse = function(shortcut) {
          var result = {}, values = // Special case to handle the `+` key since we use it as a separator.
          (shortcut = shortcut.replace("\\+", "+add")).split("+"), length = values.length;
          // Ensure that all the modifiers are set to false unless the hotkey has them.
          for(var k in this.keyModifiers)result[this.keyModifiers[k]] = !1;
          for(var _step, _iterator = function(o, allowArrayLike) {
              var it = "undefined" != typeof Symbol && o[Symbol.iterator] || o["@@iterator"];
              if (it) return (it = it.call(o)).next.bind(it);
              if (Array.isArray(o) || (it = function(o, minLen) {
                  if (o) {
                      if ("string" == typeof o) return _array_like_to_array(o, minLen);
                      var n = Object.prototype.toString.call(o).slice(8, -1);
                      if ("Object" === n && o.constructor && (n = o.constructor.name), "Map" === n || "Set" === n) return Array.from(n);
                      if ("Arguments" === n || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _array_like_to_array(o, minLen);
                  }
              }(o))) {
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
          }(values); !(_step = _iterator()).done;){
              var value = _step.value, optional = value.endsWith("?") && value.length > 1;
              optional && (value = value.slice(0, -1));
              var name = this.toKeyName(value), modifier = this.keyModifiers[name];
              // Validate modifier
              if (value.length > 1 && !modifier && !this.keyAliases[value] && !this.keyCodes[name]) throw TypeError('Unknown shortcut modifier: "' + value + '"');
              1 !== length && modifier || (!0 === this.useKey ? result.key = name : result.which = this.toKeyCode(value)), modifier && (result[modifier] = !optional || null);
          }
          return result;
      }, _proto.isMatchEvent = function(event) {
          for(var key in this.shortcut){
              var expected = this.shortcut[key], actual = void 0;
              if (null != expected && (null != (actual = "key" === key && null != event.key ? event.key.toLowerCase() : "which" === key ? 91 === expected && 93 === event.which ? 91 : event.which : event[key]) || !1 !== expected) && actual !== expected) return !1;
          }
          return(// Store shortcut name inside event
          Object.defineProperty(event, "shortcut", {
              value: this.shortcutName,
              writable: !1
          }), !0);
      }, staticProps = [
          {
              key: "isMac",
              get: function() {
                  var _this__isMac;
                  return null != (_this__isMac = this._isMac) ? _this__isMac : this._isMac = /Mac|iPod|iPhone|iPad/.test(window.navigator.platform);
              }
          }
      ], function(target, props) {
          for(var i = 0; i < props.length; i++){
              var descriptor = props[i];
              descriptor.enumerable = descriptor.enumerable || !1, descriptor.configurable = !0, "value" in descriptor && (descriptor.writable = !0), Object.defineProperty(target, descriptor.key, descriptor);
          }
      }(KeyboardShortcut, staticProps), KeyboardShortcut;
  }();
  var KeyboardShortcuts = function() {
      function KeyboardShortcuts(shortcuts) {
          Array.isArray(shortcuts) || (shortcuts = [
              shortcuts
          ]), this.shortcuts = shortcuts.map(function(s) {
              return new KeyboardShortcut(s);
          });
      }
      return KeyboardShortcuts.prototype.isMatchEvent = function(event) {
          return this.shortcuts.some(function(s) {
              return s.isMatchEvent(event);
          });
      // return this.shortcuts.some((s) => {
      //   const result = s.isMatchEvent(event);
      //   console.log('is', event, 'match', s, '=', result);
      //   return result;
      // });
      }, KeyboardShortcuts;
  }();

  function keydown(shortcut) {
      var shortcuts = new KeyboardShortcuts(shortcut);
      return {
          eventName: "keydown",
          isMatch: function(e) {
              return shortcuts.isMatchEvent(e);
          }
      };
  }
  function keyup(shortcut) {
      var shortcuts = new KeyboardShortcuts(shortcut);
      return {
          eventName: "keyup",
          isMatch: function(e) {
              return shortcuts.isMatchEvent(e);
          }
      };
  }
  function keypress(shortcut) {
      var shortcuts = new KeyboardShortcuts(shortcut);
      return {
          eventName: "keypress",
          isMatch: function(e) {
              return shortcuts.isMatchEvent(e);
          }
      };
  }

  exports.KeyboardShortcut = KeyboardShortcut;
  exports.KeyboardShortcuts = KeyboardShortcuts;
  exports.LitWidget = LitWidget;
  exports.keydown = keydown;
  exports.keypress = keypress;
  exports.keyup = keyup;
  exports.onEvent = onEvent;
  exports.target = target;
  exports.targets = targets;

})(this.window = this.window || {}, lit, templateContent);
//# sourceMappingURL=index.js.map
