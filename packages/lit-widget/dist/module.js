/*
  LitWidget 1.0.0-beta.1
  Copyright (C) 2023 Andy Chentsov <chentsov@gmail.com>
  @license BSD-3-Clause
*/

import { LitElement, html } from 'lit';
import { templateContent } from 'lit/directives/template-content.js';

function throttle(fn, duration) {
    let throttlePause;
    return function(...args) {
        throttlePause || (throttlePause = !0, setTimeout(()=>{
            fn.apply(this, args), throttlePause = !1;
        }, duration));
    };
}
function debounce(fn, duration) {
    let timeoutId;
    function debouncer(...args) {
        debouncer.clear(), timeoutId = setTimeout(()=>{
            timeoutId = null, fn.apply(this, args);
        }, duration);
    }
    return debouncer.clear = function() {
        timeoutId && (clearTimeout(timeoutId), timeoutId = null);
    }, debouncer;
}
function duration(value) {
    if ('number' == typeof value) return value;
    if ('string' != typeof value) throw Error(`Invalid duration "${value}".`);
    let duration = parseFloat(value);
    if (isNaN(duration)) throw Error(`Invalid duration value "${value}".`);
    return value.endsWith('ms') ? duration : value.endsWith('s') ? 1000 * duration : value.endsWith('m') ? 60000 * duration : void 0;
}

class LitWidget extends LitElement {
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
                'string' == typeof handler && (handler = this[handler]), event._handler = (...args)=>handler.apply(this, args), event.debounce ? event._handler = debounce(event._handler, duration(event.debounce)) : event.throttle && (event._handler = throttle(event._handler, duration(event.throttle))), null != event.wrapper && void 0 !== event.wrapper && (event._handler = event.wrapper.call(this, event._handler, this)), target1.addEventListener(event.event, event._handler);
            } else throw Error(`[LitWidget "${this.tagName.toLowerCase()}"] Event target "${event.target}" not found.`);
        }
    }
    _detachEvents() {
        for (let event of this._events)event._handler && target.addEventListener(event.event, event._handler);
    }
    findTarget(tagName, targetName, selector = null, converter = null) {
        let convert = (value)=>converter ? converter(value) : value, tag = tagName.toLowerCase();
        if (selector) {
            for (let el of this.querySelectorAll(selector))if (el.closest(tag) === this) return convert(el);
        }
        if (this.renderRoot) {
            for (let el of this.renderRoot.querySelectorAll(`[data-target~="${tag}.${targetName}"]`))if (!el.closest(tag)) return convert(el);
        }
        for (let el of this.querySelectorAll(`[data-target~="${tag}.${targetName}"]`))if (el.closest(tag) === this) return convert(el);
    }
    findTargets(tagName, targetName, selector = null, converter = null) {
        let convert = (value)=>converter ? converter(value) : value, tag = tagName.toLowerCase(), targets = [];
        if (selector) for (let el of this.querySelectorAll(selector))el.closest(tag) === this && targets.push(convert(el));
        if (this.renderRoot) for (let el of this.renderRoot.querySelectorAll(`[data-targets~="${tag}.${targetName}"]`))el.closest(tag) || targets.push(convert(el));
        for (let el of this.querySelectorAll(`[data-targets~="${tag}.${targetName}"]`))el.closest(tag) === this && targets.push(convert(el));
        return targets;
    }
}
LitWidget.sharedStyles = !0, LitWidget.addInitializer((instance)=>{
    let klass = Object.getPrototypeOf(instance).constructor;
    if (void 0 !== klass.targets) for (let [target1, options] of Object.entries(klass.targets))// Add target getter
    Object.defineProperty(instance, target1, {
        configurable: !0,
        get () {
            if (void 0 === this._findCache && (this._findCache = {}), this._findCache[target1]) return this._findCache[target1];
            {
                var _this__findCache, _;
                let targetElement = null != (_ = (_this__findCache = this._findCache)[target1]) ? _ : _this__findCache[target1] = this.findTarget(this.tagName, target1, options.selector, options.template ? (value)=>templateContent(value) : null);
                return null == targetElement ? console.error(`[LitWidget "${klass.name}"] Target "${target1}" not found.`) : this._findCache[target1] = targetElement, targetElement;
            }
        }
    });
    if (void 0 !== klass.targetsAll) for (let [target1, options] of Object.entries(klass.targetsAll))// Add target getter
    Object.defineProperty(instance, target1, {
        configurable: !0,
        get () {
            var _this__findCache, _;
            return void 0 === this._findCache && (this._findCache = {}), null != (_ = (_this__findCache = this._findCache)[target1]) ? _ : _this__findCache[target1] = this.findTargets(this.tagName, target1, options.selector, options.template ? (value)=>templateContent(value) : null);
        }
    });
});

function target$1({ selector  } = {}, name = null) {
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
function targets({ selector  } = {}, name = null) {
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
function onEvent(target, event, { debounce , throttle , wrapper  } = {}) {
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
