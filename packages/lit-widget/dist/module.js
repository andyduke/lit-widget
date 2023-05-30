/*
  LitWidget 1.0.0-beta.1
  Copyright (C) 2023 Andy Chentsov <chentsov@gmail.com>
  @license BSD-3-Clause
*/

import { LitElement, html } from 'lit';
import { templateContent } from 'lit/directives/template-content.js';

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
 */ class LitWidget extends LitElement {
    static widget(name) {
        return function(proto, options) {
            LitWidget.define(name, proto, options);
        };
    }
    static define(name, constructor, options) {
        customElements.define('w-' + name, constructor, options);
    }
    render() {
        return html`<slot></slot>`;
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
        super.connectedCallback(), setTimeout(()=>this._attachEvents());
    }
    disconnectedCallback() {
        super.disconnectedCallback(), setTimeout(()=>this._detachEvents());
    }
    get _events() {
        let klass = Object.getPrototypeOf(this).constructor;
        return klass.events || [];
    }
    _attachEvents() {
        for (let event of this._events){
            if (event.debounce && event.throttle) throw Error(`[LitWidget "${$this.tagName.toLowerCase()}"] For the event "${event.event}", debounce and throttle are specified, you can specify only one thing.`);
            let target1 = this.findTarget(this.tagName, event.target);
            if (target1) {
                let handler = event.handler;
                'string' == typeof handler && (handler = this[handler]), event._handler = (...args)=>handler.apply(this, args), event.debounce ? event._handler = debounce(event._handler, event.debounce) : event.throttle && (event._handler = throttle(event._handler, event.throttle)), null != event.wrapper && void 0 !== event.wrapper && (event._handler = event.wrapper.call(this, event._handler, this)), target1.addEventListener(event.event, event._handler);
            } else throw Error(`[LitWidget "${this.tagName.toLowerCase()}"] Event target "${event.target}" not found.`);
        }
    }
    _detachEvents() {
        for (let event of this._events)event._handler && target.addEventListener(event.event, event._handler);
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
        if (this.shadowRoot) {
            for (let el of this.shadowRoot.querySelectorAll(`[data-target~="${tag}.${targetName}"]`))if (!el.closest(tag)) return convert(el);
        }
        for (let el of this.querySelectorAll(`[data-target~="${tag}.${targetName}"]`))if (el.closest(tag) === this) return convert(el);
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
        if (this.shadowRoot) for (let el of this.shadowRoot.querySelectorAll(`[data-targets~="${tag}.${targetName}"]`))el.closest(tag) || targets.push(convert(el));
        for (let el of this.querySelectorAll(`[data-targets~="${tag}.${targetName}"]`))el.closest(tag) === this && targets.push(convert(el));
        return targets;
    }
}
/**
   * Specifies whether to import page styles into shadowRoot.
   */ LitWidget.sharedStyles = !0, LitWidget.addInitializer((instance)=>{
    let klass = Object.getPrototypeOf(instance).constructor;
    if (void 0 !== klass.targets) for (let [target1, options] of Object.entries(klass.targets))// Add target getter
    Object.defineProperty(instance, target1, {
        configurable: !0,
        get () {
            if (void 0 === this._findCache && (this._findCache = {}), this._findCache[target1]) return this._findCache[target1];
            {
                var _this__findCache, _;
                let targetElement = null != (_ = (_this__findCache = this._findCache)[target1]) ? _ : _this__findCache[target1] = this.findTarget(this.tagName, target1, options.selector);
                if (null == targetElement) console.error(`[LitWidget "${klass.name}"] Target "${target1}" not found.`);
                else {
                    let convertTemplate = !0 === options.template || 'template' == targetElement.tagName.toLowerCase() && !1 !== options.template;
                    convertTemplate && (targetElement = templateContent(targetElement)), this._findCache[target1] = targetElement;
                }
                return targetElement;
            }
        }
    });
    if (void 0 !== klass.targetsAll) for (let [target1, options] of Object.entries(klass.targetsAll))// Add target getter
    Object.defineProperty(instance, target1, {
        configurable: !0,
        get () {
            var _this__findCache, _;
            return void 0 === this._findCache && (this._findCache = {}), null != (_ = (_this__findCache = this._findCache)[target1]) ? _ : _this__findCache[target1] = this.findTargets(this.tagName, target1, options.selector);
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
 */ function target$1({ selector  } = {}, name = null) {
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
 */ function onEvent(target, event, { debounce , throttle , wrapper  } = {}) {
    return function(instance, property) {
        let klass = instance.constructor;
        if (!(instance instanceof LitWidget)) throw Error(`[LitWidget] The class "${klass.name}" is not a descendant of LitWidget.`);
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

export { LitWidget, onEvent, target$1 as target, targets };
//# sourceMappingURL=module.js.map
