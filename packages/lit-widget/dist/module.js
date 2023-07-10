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
        return el.matches(selector);
    }
    targetsMatches(el, tagName, targetName) {
        let selector = this.createTargetsSelector(tagName, targetName);
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
 * TODO:
 */ class EventsController {
    prepareEvents(events) {
        let targetedEvents = new Map();
        for (let event of events){
            let target;
            if (event.target instanceof HTMLElement || event.target instanceof Document || event.target instanceof Window) target = {
                type: 'element',
                element: event.target
            };
            else if ('string' == typeof event.target) target = {
                type: 'target',
                target: event.target,
                selector: event.selector
            };
            else throw Error(`[LitWidget.EventsController]: Invalid event definition: ${JSON.stringify(event)}.`);
            targetedEvents.set(target, event);
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
        // Event name
        let eventName = event.event, handler = (...args)=>event.handler.apply(this.host, args);
        // Handle conditional event (eventName = {eventHandler: string, isMatch: function})
        if (event.debounce ? handler = debounce(handler, event.debounce) : event.throttle && (handler = throttle(handler, event.throttle)), null != event.wrapper && void 0 !== event.wrapper && (handler = event.wrapper.call(this.host, handler /*, this.host*/ )), 'string' == typeof event.selector && (handler = (()=>{
            let prevHandler = handler;
            return (e)=>{
                e.target.matches(event.selector) && prevHandler(e);
            };
        })()), 'object' == typeof eventName) {
            let preset = eventName;
            if (null == preset.eventName || 'function' != typeof preset.isMatch) throw Error(`[LitWidget.EventsController]: Invalid conditional event: ${preset}`);
            // Extract eventName from preset
            eventName = preset.eventName, // Wrap handler
            handler = (()=>{
                let isMatch = preset.isMatch, prevHandler = handler;
                return (e)=>{
                    isMatch(e) && prevHandler(e);
                };
            })();
        }
        // Create event handler
        let eventHandler = new EventHandler(eventName, handler);
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
        }
    }
    bindEvents(el, oldAttrValue) {
        // console.log('Bind actions:', el);
        // for (const event of this.events) {
        for (let [eventInfo, event] of this.events){
            if ('target' !== eventInfo.type) continue;
            let isMatch = this.host.targetMatches(el, this.tagName, eventInfo.target) || this.host.targetsMatches(el, this.tagName, eventInfo.target), isOldMatch = !isMatch && oldAttrValue == this.host.createTargetPath(this.tagName, eventInfo.target), key = {
                element: el,
                id: event.id
            };
            if (isMatch) {
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
                null == handler || handler.removeListener(el), // Remove element from listeners map
                this.listeners.delete(el, key);
            }
        }
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
        })), els))null != el && this.observer.observe(el, {
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
        if (this.listeners = new ListenersMap(), !(host instanceof LitWidgetBase)) throw Error('[LitWidget.EventsController]: The host is not an instance of the LitWidget class.');
        this.host = host, this.tagName = this.host.tagName.toLowerCase(), this.events = this.prepareEvents(events), // console.log('Events:', this.events);
        this.host.addController(this);
    }
}

class DocumentStylesObserver {
    observe() {
        this.observing || (this.observer.observe(this.document.head, {
            childList: !0,
            subtree: !0
        }), this.observing = !0);
    }
    disconnect() {
        this.observing && (this.observer.takeRecords(), this.observer.disconnect(), this.observing = !1);
    }
    addListener(fn) {
        this.listeners.add(fn), this.listeners.size > 0 && this.observe();
    }
    removeListener(fn) {
        this.listeners.delete(fn), 0 == this.listeners.size && this.disconnect();
    }
    notifyListeners(operation) {
        for (let listener of this.listeners)listener(operation);
    }
    constructor(document){
        this.document = document, this.listeners = new Set(), this.observing = !1, this.observer = new MutationObserver((mutations)=>{
            for (let mutation of mutations)if ('childList' === mutation.type && (mutation.addedNodes.length || mutation.removedNodes.length)) {
                // console.log('! [+]', mutation.addedNodes);
                // console.log('! [-]', mutation.removedNodes);
                for (let node of mutation.addedNodes)if (node instanceof Element) {
                    let tagName = node.tagName.toLowerCase();
                    ('style' == tagName || 'link' == tagName && 'stylesheet' == node.getAttribute('rel')) && this.notifyListeners({
                        type: 'add',
                        node
                    });
                }
                for (let node of mutation.removedNodes)if (node instanceof Element) {
                    let tagName = node.tagName.toLowerCase();
                    ('style' == tagName || 'link' == tagName && 'stylesheet' == node.getAttribute('rel')) && this.notifyListeners({
                        type: 'remove',
                        node
                    });
                }
            }
        });
    }
}
/**
 * TODO:
 */ class SharedStylesController {
    hostConnected() {
        let shadowRoot = null != this.host.shadowRoot;
        if (!this.initialized) {
            this.initialized = !0;
            let root = this.host.renderRoot, document = this.host.ownerDocument;
            if (shadowRoot) {
                // Import styles
                for (let style of document.head.querySelectorAll('style'))this.addStyle(style, root);
                // Import link[stylesheet]
                for (let style of document.head.querySelectorAll('link[rel="stylesheet"]'))this.addStyle(style, root);
            }
        }
        shadowRoot && this.startObserving();
    }
    addStyle(style, root = null) {
        // Skip non-shared styles
        if ('false' == style.getAttribute('data-shared')) return;
        null == root && (root = this.host.renderRoot), null == this.styleRoot && (this.styleRoot = this.host.ownerDocument.createElement('shared-styles--'), root.insertBefore(this.styleRoot, root.firstChild));
        // Cloning and adding a style
        let styleClone = style.cloneNode(!0);
        this.styleRoot.appendChild(styleClone), // Save the link between the style and its clone
        this.styles.set(style, styleClone);
    }
    removeStyle(style) {
        let styleClone = this.styles.get(style);
        null != styleClone && (styleClone.remove(), this.styles.delete(style));
    }
    hostDisconnected() {
        this.stopObserving();
    }
    startObserving() {
        null == SharedStylesController.observer && (SharedStylesController.observer = new DocumentStylesObserver(this.host.ownerDocument)), // Start observing
        SharedStylesController.observer.addListener(this.stylesUpdated);
    }
    stopObserving() {
        null != SharedStylesController.observer && SharedStylesController.observer.removeListener(this.stylesUpdated);
    }
    updated({ type, node }) {
        switch(type){
            case 'add':
                this.addStyle(node);
                break;
            case 'remove':
                this.removeStyle(node);
        }
    }
    constructor(host, sharedStyles){
        this.initialized = !1, this.styles = new WeakMap(), sharedStyles && (this.host = host, this.host.addController(this), this.stylesUpdated = (o)=>this.updated(o));
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
 */ class LitWidget extends LitWidgetBase {
    // #region Static helpers
    /** TODO: ??? */ static widget(name) {
        return function(proto, options) {
            LitWidget.define(name, proto, options);
        };
    }
    static define(name, constructor, options) {
        customElements.define('w-' + name, constructor, options);
    }
    /**
   * TODO: Static getter
   */ get static() {
        return Object.getPrototypeOf(this).constructor;
    }
    // #endregion Static helpers
    // #region Default render
    /**
   * Default renderer, renders Light DOM
   */ render() {
        return html`<slot></slot>`;
    }
    get defaultValues() {
        var _Object_getPrototypeOf_defaultValues;
        if (null != this._defaultValues) return this._defaultValues;
        // const parentDefaultValues = (this instanceof LitWidget) ? {} : Object.getPrototypeOf(this).defaultValues;
        let parentDefaultValues = null != (_Object_getPrototypeOf_defaultValues = Object.getPrototypeOf(this).defaultValues) ? _Object_getPrototypeOf_defaultValues : {};
        return this._defaultValues = _extends({}, parentDefaultValues, this.constructor.defaultValues), this._defaultValues;
    }
    /**
   * TODO: describe override case
   */ get sharedStyles() {
        let sharedStyles = /*Object.getPrototypeOf(this).constructor*/ this.static.sharedStyles;
        return null != sharedStyles || this.lightDOM || // If sharedStyles is "auto" and not lightDOM - then it will default to true
        (sharedStyles = !0), sharedStyles;
    }
    /**
   * TODO: describe override case
   */ get lightDOM() {
        return /*Object.getPrototypeOf(this).constructor*/ this.static.lightDOM;
    }
    createRenderRoot() {
        let root;
        let tagName = this.tagName.toLowerCase();
        if (this.lightDOM) {
            // Find light DOM root [data-root]
            let rootElement = this.querySelector(`[data-root="${tagName}"]`);
            null != rootElement && rootElement.closest(tagName) != this && (rootElement = null), // Use found root target or element itself as renderRoot
            root = null != rootElement ? rootElement : this;
        } else root = super.createRenderRoot();
        return this.lightDOM && !0 === this.sharedStyles && console.warn(`[LitWidget "${tagName}"] Shared styles (sharedStyles = true) with lightDOM have no effect.`), root;
    }
    // #endregion Light DOM
    // #region Lifecycle
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
        }), Object.defineProperty(this, _sharedStylesController, {
            writable: !0,
            value: void 0
        }), _class_private_field_loose_base(this, _sharedStylesController)[_sharedStylesController] = new SharedStylesController(this, this.sharedStyles);
    }
}
function prepareEvents() {
    let events = [
        ...this._events || [],
        ...this.events || []
    ], eventsDefs = events.map((event, index)=>_extends({
            id: index
        }, event));
    // Seal events
    Object.defineProperty(this, 'events', {
        configurable: !0,
        get: ()=>eventsDefs
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
LitWidget.addInitializer((instance)=>{
    var _options_property, _options_property1;
    let klass = Object.getPrototypeOf(instance).constructor;
    if (void 0 !== klass.targets) for (let [target, options] of Object.entries(klass.targets))// Add target getter
    Object.defineProperty(instance, null != (_options_property = options.property) ? _options_property : target, {
        configurable: !0,
        get () {
            var _options_cache, _this__findCache, _;
            void 0 === this._findCache && (this._findCache = {});
            let cache = null == (_options_cache = options.cache) || _options_cache;
            if (cache && this._findCache[target]) return this._findCache[target];
            {
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
    Object.defineProperty(instance, null != (_options_property1 = options.property) ? _options_property1 : target, {
        configurable: !0,
        get () {
            var _options_cache, _this__findAllCache, _;
            void 0 === this._findAllCache && (this._findAllCache = {});
            let cache = null == (_options_cache = options.cache) || _options_cache;
            if (cache && this._findAllCache[target]) return this._findAllCache[target];
            {
                let targetElements = null != (_ = (_this__findAllCache = this._findAllCache)[target]) ? _ : _this__findAllCache[target] = this.findTargets(this.tagName, target, options.selector);
                return targetElements;
            }
        // return this._findAllCache[target] ??= this.findTargets(this.tagName, target, options.selector);
        }
    });
});
 // #endregion Targets getters

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
 */ function target({ name, selector, cache, template } = {}, propertyName = null) {
    let wrapper = function(instance, property) {
        let klass = instance.constructor;
        if (!(instance instanceof LitWidget)) throw Error(`[LitWidget] The class "${klass.name}" is not a descendant of LitWidget.`);
        void 0 === klass.targets && (klass.targets = {}), klass.targets[null != name ? name : property] = {
            property,
            selector,
            cache,
            template
        };
    };
    if (null == propertyName) return wrapper;
    {
        let instance = arguments[0];
        wrapper(instance, propertyName);
    }
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
 */ function targets({ name, selector, cache } = {}, propertyName = null) {
    let wrapper = function(instance, property) {
        let klass = instance.constructor;
        if (!(instance instanceof LitWidget)) throw Error(`[LitWidget] The class "${klass.name}" is not a descendant of LitWidget.`);
        void 0 === klass.targetsAll && (klass.targetsAll = {}), klass.targetsAll[null != name ? name : property] = {
            property,
            selector,
            cache
        };
    };
    if (null == propertyName) return wrapper;
    {
        let instance = arguments[0];
        wrapper(instance, propertyName);
    }
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
 */ function onEvent(target, event, { selector, debounce, throttle, wrapper } = {}) {
    return function(instance, property) {
        let klass = instance.constructor;
        if (!(instance instanceof LitWidget)) throw Error(`[LitWidget] The class "${klass.name}" is not a descendant of LitWidget.`);
        void 0 === instance._events && (instance._events = []), instance._events.push({
            target,
            handler: instance[property],
            event,
            selector,
            debounce,
            throttle,
            wrapper
        });
    };
}

// https://github.com/ianstormtaylor/is-hotkey/blob/master/src/index.js
class KeyboardShortcut {
    static get isMac() {
        var _this__isMac;
        return null != (_this__isMac = this._isMac) ? _this__isMac : this._isMac = /Mac|iPod|iPhone|iPad/.test(window.navigator.platform);
    }
    toKeyName(name) {
        return name = name.toLowerCase(), name = this.keyAliases[name] || name;
    }
    toKeyCode(name) {
        name = this.toKeyName(name);
        let code = this.keyCodes[name] || name.toUpperCase().charCodeAt(0);
        return code;
    }
    parse(shortcut) {
        let result = {};
        // Special case to handle the `+` key since we use it as a separator.
        shortcut = shortcut.replace('\\+', '+add');
        // Split keys
        let values = shortcut.split('+'), length = values.length;
        // Ensure that all the modifiers are set to false unless the hotkey has them.
        for(let k in this.keyModifiers)result[this.keyModifiers[k]] = !1;
        for (let value of values){
            // Optional key 'Shift?+a'
            let optional = value.endsWith('?') && value.length > 1;
            optional && (value = value.slice(0, -1));
            let name = this.toKeyName(value), modifier = this.keyModifiers[name];
            // Validate modifier
            if (value.length > 1 && !modifier && !this.keyAliases[value] && !this.keyCodes[name]) throw TypeError(`Unknown shortcut modifier: "${value}"`);
            1 !== length && modifier || (!0 === this.useKey ? result.key = name : result.which = this.toKeyCode(value)), modifier && (result[modifier] = !optional || null);
        }
        return result;
    }
    isMatchEvent(event) {
        for(let key in this.shortcut){
            let actual;
            let expected = this.shortcut[key];
            if (null != expected && (null != (actual = 'key' === key && null != event.key ? event.key.toLowerCase() : 'which' === key ? 91 === expected && 93 === event.which ? 91 : event.which : event[key]) || !1 !== expected) && actual !== expected) return !1;
        }
        return(// Store shortcut name inside event
        Object.defineProperty(event, 'shortcut', {
            value: this.shortcutName,
            writable: !1
        }), !0);
    }
    constructor(shortcut, { useKey = !0 } = {}){
        this.keyModifiers = {
            alt: 'altKey',
            control: 'ctrlKey',
            meta: 'metaKey',
            shift: 'shiftKey'
        }, this.keyAliases = {
            add: '+',
            break: 'pause',
            cmd: 'meta',
            command: 'meta',
            ctl: 'control',
            ctrl: 'control',
            del: 'delete',
            down: 'arrowdown',
            esc: 'escape',
            ins: 'insert',
            left: 'arrowleft',
            mod: this.constructor.isMac ? 'meta' : 'control',
            opt: 'alt',
            option: 'alt',
            return: 'enter',
            right: 'arrowright',
            space: ' ',
            spacebar: ' ',
            up: 'arrowup',
            win: 'meta',
            windows: 'meta'
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
            ' ': 32,
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
            ';': 186,
            '=': 187,
            ',': 188,
            '-': 189,
            '.': 190,
            '/': 191,
            '`': 192,
            '[': 219,
            '\\': 220,
            ']': 221,
            '\'': 222
        };
        // Generate F1-F20 codes
        for(let f = 1; f < 20; f++)this.keyCodes['f' + f] = 111 + f;
        this.useKey = useKey, this.shortcutName = shortcut.toLowerCase(), this.shortcut = this.parse(this.shortcutName);
    }
}
class KeyboardShortcuts {
    isMatchEvent(event) {
        return this.shortcuts.some((s)=>s.isMatchEvent(event));
    // return this.shortcuts.some((s) => {
    //   const result = s.isMatchEvent(event);
    //   console.log('is', event, 'match', s, '=', result);
    //   return result;
    // });
    }
    constructor(shortcuts){
        Array.isArray(shortcuts) || (shortcuts = [
            shortcuts
        ]), this.shortcuts = shortcuts.map((s)=>new KeyboardShortcut(s));
    }
}

function keydown(shortcut) {
    let shortcuts = new KeyboardShortcuts(shortcut);
    return {
        eventName: 'keydown',
        isMatch: (e)=>shortcuts.isMatchEvent(e)
    };
}
function keyup(shortcut) {
    let shortcuts = new KeyboardShortcuts(shortcut);
    return {
        eventName: 'keyup',
        isMatch: (e)=>shortcuts.isMatchEvent(e)
    };
}
function keypress(shortcut) {
    let shortcuts = new KeyboardShortcuts(shortcut);
    return {
        eventName: 'keypress',
        isMatch: (e)=>shortcuts.isMatchEvent(e)
    };
}

export { KeyboardShortcut, KeyboardShortcuts, LitWidget, keydown, keypress, keyup, onEvent, target, targets };
//# sourceMappingURL=module.js.map
