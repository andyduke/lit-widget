/*
  LitWidget 1.0.0-beta.1
  Copyright (C) 2023 Andy Chentsov <chentsov@gmail.com>
  @license BSD-3-Clause
*/

import { LitElement, html } from 'lit';
import { templateContent } from 'lit/directives/template-content.js';

class LitWidgetBase extends LitElement {
    get targetAttribute() {
        return 'data-target';
    }
    get targetsAttribute() {
        return 'data-targets';
    }
    createTargetPath(tagName, targetName) {
        let tag = tagName.toLowerCase();
        return `${tag}.${targetName}`;
    }
    createTargetSelector(tagName, targetName) {
        let tag = tagName.toLowerCase();
        return `[${this.targetAttribute}~="${tag}.${targetName}"]`;
    }
    createTargetsSelector(tagName, targetName) {
        let tag = tagName.toLowerCase();
        return `[${this.targetsAttribute}~="${tag}.${targetName}"]`;
    }
    targetMatches(el, tagName, targetName) {
        let selector = this.createTargetSelector(tagName, targetName);
        // console.log('targetMatches:', el.matches(selector), selector, el);
        return el.matches(selector);
    }
    targetsMatches(el, tagName, targetName) {
        let selector = this.createTargetsSelector(tagName, targetName);
        // console.log('targetsMatches:', el.matches(selector), selector, el);
        return el.matches(selector);
    }
    /**
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
   */ findTarget(tagName, targetName, selector = null, converter = null) {
        let convert = (value)=>converter ? converter(value) : value, tag = tagName.toLowerCase();
        if (selector) {
            for (let el of this.querySelectorAll(selector))if (el.closest(tag) === this) return convert(el);
        }
        let targetSelector = this.createTargetSelector(tag, targetName);
        if (this.shadowRoot) {
            for (let el of this.shadowRoot.querySelectorAll(targetSelector))if (!el.closest(tag)) return convert(el);
        }
        for (let el of this.querySelectorAll(targetSelector))if (el.closest(tag) === this) return convert(el);
    }
    /**
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
   */ findTargets(tagName, targetName, selector = null, converter = null) {
        let convert = (value)=>converter ? converter(value) : value, tag = tagName.toLowerCase(), targets = [];
        if (selector) for (let el of this.querySelectorAll(selector))el.closest(tag) === this && targets.push(convert(el));
        let targetsSelector = this.createTargetsSelector(tag, targetName);
        if (this.shadowRoot) for (let el of this.shadowRoot.querySelectorAll(targetsSelector))el.closest(tag) || targets.push(convert(el));
        for (let el of this.querySelectorAll(targetsSelector))el.closest(tag) === this && targets.push(convert(el));
        return targets;
    }
}

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
    let throttlePause;
    return function(...args) {
        throttlePause || (throttlePause = !0, setTimeout(()=>{
            fn.apply(this, args), throttlePause = !1;
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
    let timeoutId;
    function debouncer(...args) {
        debouncer.clear(), timeoutId = setTimeout(()=>{
            timeoutId = null, fn.apply(this, args);
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
    if ('number' == typeof value) return value;
    if ('string' != typeof value) throw Error(`Invalid duration "${value}".`);
    let duration = parseFloat(value);
    if (isNaN(duration)) throw Error(`Invalid duration value "${value}".`);
    return value.endsWith('ms') ? duration : value.endsWith('s') ? 1000 * duration : value.endsWith('m') ? 60000 * duration : void 0;
}

function _class_private_field_loose_base$1(receiver, privateKey) {
    if (!Object.prototype.hasOwnProperty.call(receiver, privateKey)) throw TypeError("attempted to use private field on non-instance");
    return receiver;
}
var id$1 = 0;
function _class_private_field_loose_key$1(name) {
    return "__private_" + id$1++ + "_" + name;
}
var _map = /*#__PURE__*/ _class_private_field_loose_key$1("_map"), _normalizeKey = /*#__PURE__*/ _class_private_field_loose_key$1("_normalizeKey");
let _Symbol_iterator = Symbol.iterator;
class ListenersMap {
    has(el, key) {
        return !!_class_private_field_loose_base$1(this, _map)[_map].has(el) && _class_private_field_loose_base$1(this, _map)[_map].get(el).has(_class_private_field_loose_base$1(this, _normalizeKey)[_normalizeKey](key));
    }
    get(el, key) {
        return _class_private_field_loose_base$1(this, _map)[_map].has(el) ? _class_private_field_loose_base$1(this, _map)[_map].get(el).get(_class_private_field_loose_base$1(this, _normalizeKey)[_normalizeKey](key)) : null;
    }
    set(el, key, value) {
        let listeners = _class_private_field_loose_base$1(this, _map)[_map].get(el) || new Map(), normalizedKey = _class_private_field_loose_base$1(this, _normalizeKey)[_normalizeKey](key);
        listeners.set(normalizedKey, value), _class_private_field_loose_base$1(this, _map)[_map].set(el, listeners);
    }
    delete(el, key) {
        return _class_private_field_loose_base$1(this, _map)[_map].has(el) ? _class_private_field_loose_base$1(this, _map)[_map].get(el).delete(_class_private_field_loose_base$1(this, _normalizeKey)[_normalizeKey](key)) : null;
    }
    clear() {
        _class_private_field_loose_base$1(this, _map)[_map] = new Map();
    }
    *[_Symbol_iterator]() {
        for (let [el, listeners] of _class_private_field_loose_base$1(this, _map)[_map])for (let [key, listener] of listeners)yield [
            el,
            key,
            listener
        ];
    }
    constructor(){
        Object.defineProperty(this, _normalizeKey, {
            value: normalizeKey
        }), Object.defineProperty(this, _map, {
            writable: !0,
            value: void 0
        }), _class_private_field_loose_base$1(this, _map)[_map] = new Map();
    }
}
function normalizeKey(key) {
    return JSON.stringify(key);
//return key;
}

class EventHandler {
    addListener(el) {
        el.addEventListener(this.eventName, this.handler);
    }
    removeListener(el) {
        el.removeEventListener(this.eventName, this.handler);
    }
    constructor(eventName, handler){
        this.eventName = eventName, this.handler = handler;
    }
}
/**
 *
 */ class EventsController {
    prepareEvents(events) {
        let targetedEvents = new Map();
        // let targetedEvents = new Set();
        for (let event of events){
            let target;
            if (event.target instanceof HTMLElement || event.target instanceof Document || event.target instanceof Window) target = {
                type: 'element',
                element: event.target
            };
            else // if (typeof event.target !== 'undefined') {
            //   target = {type: 'target', target: event.target, handler: event.handler};
            // } else if (typeof event.selector !== 'undefined') {
            //   target = {type: 'selector', selector: event.selector, handler: event.handler};
            // } else {
            //   throw new Error(`[LitWidget.EventsController]: Invalid event definition: ${JSON.stringify(event)}.`);
            // }
            /*if ((typeof event.target === 'object') && (typeof event.target['selector'] === 'string')) {
          target = {type: 'selector', selector: event.target['selector']};
        } else*/ if ('string' == typeof event.target) target = {
                type: 'target',
                target: event.target,
                selector: event.selector
            };
            else throw Error(`[LitWidget.EventsController]: Invalid event definition: ${JSON.stringify(event)}.`);
            targetedEvents.set(target, event);
        // targetedEvents.add(target);
        }
        // console.log('Targeted events:', targetedEvents);
        return targetedEvents;
    }
    hostConnected() {
        // console.log('[!] EventsController connected');
        // Bind [type=element] events to elements
        this.bindElementsEvents(), // Bind element events to targets
        this.bindTargetElements(this.host), // Observe shadowRoot and element
        this.listen([
            this.host.shadowRoot,
            this.host
        ]);
    }
    hostDisconnected() {
        var // console.log('[!] EventsController disconnected');
        // Disconnect observer
        _this_observer;
        // Remove elements listeners
        for (let [element, target, handler] of (null == (_this_observer = this.observer) || _this_observer.disconnect(), this.observer = null, this.listeners))handler.removeListener(element);
        this.listeners.clear();
    }
    createHandler(event) {
        // Add listeners if attribute added
        let handler = (...args)=>event.handler.apply(this.host, args);
        // Handle delegated event
        if (event.debounce ? handler = debounce(handler, event.debounce) : event.throttle && (handler = throttle(handler, event.throttle)), null != event.wrapper && void 0 !== event.wrapper && (handler = event.wrapper.call(this.host, handler /*, this.host*/ )), 'string' == typeof event.selector) {
            let prevHandler = handler;
            handler = (e)=>{
                e.target.matches(event.selector) && prevHandler(e);
            };
        }
        // TODO: if eventName is preset -> wrap event._handler with `(event) => eventName.isMatch(event) ? event._handler : null`
        // Create event handler
        let eventHandler = new EventHandler(event.event, handler);
        return eventHandler;
    }
    bindElementsEvents() {
        for (let [eventInfo, event] of this.events){
            if ('element' !== eventInfo.type) continue;
            let key = {
                element: eventInfo.element,
                target: eventInfo
            };
            if (this.listeners.has(eventInfo.element, key)) continue;
            // Create event handler
            let eventHandler = this.createHandler(event);
            // Add listener to element
            eventHandler.addListener(eventInfo.element), // Store element's event handler
            this.listeners.set(eventInfo.element, key, eventHandler);
        /*
      const handlers = this.listeners.get(eventInfo.element) || [];
      handlers.push(eventHandler);
      this.listeners.set(eventInfo.element, handlers);
      */ }
    }
    bindEvents(el, oldAttrValue) {
        // console.log('Bind actions:', el);
        // for (const event of this.events) {
        for (let [eventInfo, event] of this.events){
            // if (eventInfo.type == 'element') continue;
            if ('target' !== eventInfo.type) continue;
            // console.log('Bind [1]:', el, eventInfo, event);
            // const isSelector = (eventInfo.type == 'selector');
            // const isMatch = isSelector
            //   ? el.matches(event.selector)
            //   : this.host.targetMatches(el, this.tagName, event.target) || this.host.targetsMatches(el, this.tagName, event.target);
            let isMatch = this.host.targetMatches(el, this.tagName, eventInfo.target) || this.host.targetsMatches(el, this.tagName, eventInfo.target), isOldMatch = !isMatch && oldAttrValue == this.host.createTargetPath(this.tagName, eventInfo.target), key = {
                element: el,
                id: event.id
            };
            // console.log('Bind [2]', key, 'is match =', isMatch, 'is old match =', isOldMatch, '*', this.tagName, eventInfo.target, el, event);
            // console.log('         key:', JSON.stringify(key));
            // console.log('         has key:', this.listeners.has(el, key));
            // TODO: Check selectors???
            if (isMatch) {
                // TODO: Multiple handlers via event.id?
                if (this.listeners.has(el, key)) continue;
                // console.log('Bind [3] (+):', key, el, event);
                // Skip nested (Shadow DOM Only!)
                let isShadowNode = el.getRootNode() === this.host.shadowRoot;
                if (isShadowNode && el.closest(this.tagName)) continue;
                // Create event handler
                let eventHandler = this.createHandler(event);
                // Add listener to element
                eventHandler.addListener(el), // Store element's event handler
                this.listeners.set(el, key, eventHandler);
            } else if (isOldMatch) {
                if (!this.listeners.has(el, key)) continue;
                // console.log('Bind [3] (-):', key, el, event);
                // Remove listeners if attribute removed
                let handler = this.listeners.get(el, key);
                null == handler || handler.removeListener(el), // console.log('   *', handler);
                // Remove element from listeners map
                this.listeners.delete(el, key);
            }
        /*
      if (isMatch) {
        console.log('Bind [3]:', el, event);

        // Skip nested (Shadow DOM Only!)
        const isShadowNode = el.getRootNode() === this.host.shadowRoot;
        if (isShadowNode && el.closest(this.tagName)) continue;

        // console.log('Bind [3]:', el, event);

        // Create event handler
        const eventHandler = this.createHandler(event);

        // Add listener to element
        eventHandler.addListener(el);

        // Store element's event handler
        const handlers = this.listeners.get(el) || [];
        handlers.push(eventHandler);
        this.listeners.set(el, handlers);
      } else if (isOldMatch && this.listeners.has(el)) {
        console.log('Bind [3]: Remove element listeners,', el);

        // TODO: Remove only oldAttrValue listener

        // Remove listeners if attribute removed
        const handlers = this.listeners.get(el) || [];
        for (const handler of handlers) {
          handler.removeListener(el);
        }

        // Remove element from listeners map
        this.listeners.delete(el);
      }
      */ }
    // console.log('Listeners:', this.listeners);
    }
    bindTargetElements(root) {
        // Bind controller's targets
        for (let el of root.querySelectorAll(`[${this.host.targetAttribute}],[${this.host.targetsAttribute}]`))this.bindEvents(el);
        root instanceof Element && (root.hasAttribute(this.host.targetAttribute) || root.hasAttribute(this.host.targetsAttribute)) && this.bindEvents(root);
    }
    listen(els) {
        // Observe elements
        for (let el of (this.observer || // Create observer
        (this.observer = new MutationObserver((mutations)=>{
            for (let mutation of mutations)if ('attributes' === mutation.type && mutation.target instanceof Element) this.bindEvents(mutation.target, mutation.oldValue);
            else if ('childList' === mutation.type && mutation.addedNodes.length) for (let node of mutation.addedNodes)node instanceof Element && this.bindTargetElements(node);
        })), els))this.observer.observe(el, {
            childList: !0,
            subtree: !0,
            attributeFilter: [
                this.host.targetAttribute,
                this.host.targetsAttribute
            ],
            attributeOldValue: !0
        });
    }
    constructor(host, events){
        // console.log('[2]', events);
        if (this.listeners = new ListenersMap(), !(host instanceof LitWidgetBase)) throw Error('[LitWidget.EventsController]: The host is not an instance of the LitWidget class.');
        this.host = host, this.tagName = this.host.tagName.toLowerCase(), this.events = this.prepareEvents(events), // console.log('Events:', this.events);
        this.host.addController(this);
    }
}

function _class_private_field_loose_base(receiver, privateKey) {
    if (!Object.prototype.hasOwnProperty.call(receiver, privateKey)) throw TypeError("attempted to use private field on non-instance");
    return receiver;
}
var id = 0;
function _class_private_field_loose_key(name) {
    return "__private_" + id++ + "_" + name;
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
var // #events = new EventsController(this, this.events);
_events = /*#__PURE__*/ _class_private_field_loose_key("_events"), // events = [];
// constructor() {
//   super();
//   console.log(this.constructor.name, 'Init [1]', this.events);
// }
/*
  constructor() {
    super();
    this.#prepareEvents();
    this.#events = new EventsController(this, this.events);
  }
  */ _prepareEvents = /*#__PURE__*/ _class_private_field_loose_key("_prepareEvents");
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
 */ class LitWidget extends LitWidgetBase {
    static widget(name) {
        return function(proto, options) {
            LitWidget.define(name, proto, options);
        };
    }
    static define(name, constructor, options) {
        customElements.define('w-' + name, constructor, options);
    }
    /**
   * Default renderer, renders Light DOM
   */ render() {
        return html`<slot></slot>`;
    }
    get defaultValues() {
        if (null != this._defaultValues) return this._defaultValues;
        let parentDefaultValues = this instanceof LitWidget ? {} : Object.getPrototypeOf(this).defaultValues;
        return this._defaultValues = _extends({}, parentDefaultValues, this.constructor.defaultValues), this._defaultValues;
    }
    createRenderRoot() {
        // Find handle [data-root]
        let root, shadowRoot = !0, tagName = this.tagName.toLowerCase(), rootElement = this.querySelector(`[data-root="${tagName}"]`);
        rootElement && rootElement.closest(tagName) == this ? (root = rootElement, shadowRoot = !1) : root = super.createRenderRoot();
        let sharedStyles = Object.getPrototypeOf(this).constructor.sharedStyles;
        if (shadowRoot && sharedStyles) {
            // Import styles
            for (let style of document.head.querySelectorAll('style')){
                if ('false' == style.getAttribute('data-shared')) continue;
                let styleClone = style.cloneNode(!0);
                root.insertBefore(styleClone, root.firstChild);
            }
            // Import link[stylesheet]
            for (let style of document.head.querySelectorAll('link[rel="stylesheet"]')){
                if ('false' == style.getAttribute('data-shared')) continue;
                let styleClone = style.cloneNode(!0);
                root.insertBefore(styleClone, root.firstChild);
            }
        }
        return root;
    }
    connectedCallback() {
        _class_private_field_loose_base(this, _events)[_events] || (_class_private_field_loose_base(this, _prepareEvents)[_prepareEvents](), _class_private_field_loose_base(this, _events)[_events] = new EventsController(this, this.events)), super.connectedCallback();
    }
    disconnectedCallback() {
        super.disconnectedCallback(), void 0 !== this._findCache && (this._findCache = {});
    }
    constructor(...args){
        super(...args), Object.defineProperty(this, _prepareEvents, {
            value: prepareEvents
        }), Object.defineProperty(this, _events, {
            writable: !0,
            value: void 0
        });
    }
}
function prepareEvents() {
    let events = [
        ...this._events,
        ...this.events
    ], eventsDefs = events.map((event, index)=>_extends({
            id: index
        }, event));
    // console.log('[1]', eventsDefs);
    Object.defineProperty(this, 'events', {
        configurable: !0,
        get: ()=>eventsDefs
    });
}
LitWidget.defaultValues = {}, /**
   * Specifies whether to import page styles into shadowRoot.
   */ LitWidget.sharedStyles = !0, LitWidget.addInitializer((instance)=>{
    let klass = Object.getPrototypeOf(instance).constructor;
    if (void 0 !== klass.targets) for (let [target, options] of Object.entries(klass.targets))// Add target getter
    Object.defineProperty(instance, target, {
        configurable: !0,
        get () {
            if (void 0 === this._findCache && (this._findCache = {}), this._findCache[target]) return this._findCache[target];
            {
                var _this__findCache, _;
                let targetElement = null != (_ = (_this__findCache = this._findCache)[target]) ? _ : _this__findCache[target] = this.findTarget(this.tagName, target, options.selector);
                if (null == targetElement) console.error(`[LitWidget "${klass.name}"] Target "${target}" not found.`);
                else {
                    let convertTemplate = !0 === options.template || 'template' == targetElement.tagName.toLowerCase() && !1 !== options.template;
                    convertTemplate && (targetElement = templateContent(targetElement)), this._findCache[target] = targetElement;
                }
                return targetElement;
            }
        }
    });
    if (void 0 !== klass.targetsAll) for (let [target, options] of Object.entries(klass.targetsAll))// Add target getter
    Object.defineProperty(instance, target, {
        configurable: !0,
        get () {
            var _this__findCache, _;
            return void 0 === this._findCache && (this._findCache = {}), null != (_ = (_this__findCache = this._findCache)[target]) ? _ : _this__findCache[target] = this.findTargets(this.tagName, target, options.selector);
        }
    });
});

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
 */ function target({ selector  } = {}, name = null) {
    let wrapper = function(instance, property) {
        let klass = instance.constructor;
        if (!(instance instanceof LitWidget)) throw Error(`[LitWidget] The class "${klass.name}" is not a descendant of LitWidget.`);
        void 0 === klass.targets && (klass.targets = {}), klass.targets[property] = {
            selector
        };
    };
    if (null == name) return wrapper;
    {
        let instance = arguments[0];
        wrapper(instance, name);
    }
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
 */ function targets({ selector  } = {}, name = null) {
    let wrapper = function(instance, property) {
        let klass = instance.constructor;
        if (!(instance instanceof LitWidget)) throw Error(`[LitWidget] The class "${klass.name}" is not a descendant of LitWidget.`);
        void 0 === klass.targetsAll && (klass.targetsAll = {}), klass.targetsAll[property] = {
            selector
        };
    };
    if (null == name) return wrapper;
    {
        let instance = arguments[0];
        wrapper(instance, name);
    }
}
/**
 * Decorator to attach a method as an HTML child element event handler
 *
 * @param {(string|{selector: string}|Window|Document|HTMLElement)} target - The name of the target or CSS-selector to find the HTML element.
 *     To use a CSS selector to find a target for attaching an event handler,
 *     you must pass an object with the `selector` field instead of the target name, for example:
 *     `@onEvent({selector: '.button'}, 'click')`.
 *     You can also pass an existing HTML element or window to attach an event handler to document.body or window for example.
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
 */ function onEvent(target, event, { debounce , throttle , wrapper  } = {}) {
    return function(instance, property) {
        let klass = instance.constructor;
        if (!(instance instanceof LitWidget)) throw Error(`[LitWidget] The class "${klass.name}" is not a descendant of LitWidget.`);
        void 0 === instance._events && (instance._events = []), instance._events.push({
            target: target,
            handler: instance[property],
            event: event,
            debounce: debounce || null,
            throttle: throttle || null,
            wrapper: wrapper || null
        });
    };
}

export { LitWidget, onEvent, target, targets };
//# sourceMappingURL=module.js.map
