import { LitWidget } from './lit-widget';

/**
 * Decorator to bind a property to a child HTML element
 *
 * ```js
 * class SampleWidget extends LitWidget {
 *
 *   @target button;
 *
 * }
 * ```
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
 */
export function target({ name, selector, cache, template } = {}, propertyName = null) {
  const wrapper = function(instance, property) {
    const klass = instance.constructor;
    if (!(instance instanceof LitWidget)) {
      throw new Error(`[LitWidget] The class "${klass.name}" is not a descendant of LitWidget.`);
    }

    if (typeof klass.targets === 'undefined') {
      klass.targets = {};
    }
    klass.targets[name ?? property] = {property, selector, cache, template};
  };

  if (propertyName == null) {
    return wrapper;
  } else {
    const instance = arguments[0];
    wrapper(instance, propertyName);
  }
}

/**
 * Decorator to bind a property to an array of HTML child elements
 *
 * ```js
 * class SampleWidget extends LitWidget {
 *
 *   @targets emailEntries;
 *
 * }
 * ```
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
 */
export function targets({ name, selector, cache } = {}, propertyName = null) {
  const wrapper = function(instance, property) {
    const klass = instance.constructor;
    if (!(instance instanceof LitWidget)) {
      throw new Error(`[LitWidget] The class "${klass.name}" is not a descendant of LitWidget.`);
    }

    if (typeof klass.targetsAll === 'undefined') {
      klass.targetsAll = {};
    }
    klass.targetsAll[name ?? property] = {property, selector, cache};
  };

  if (propertyName == null) {
    return wrapper;
  } else {
    const instance = arguments[0];
    wrapper(instance, propertyName);
  }
}

/**
 * Decorator to attach a method as an HTML child element event handler
 *
 * ```js
 * class SampleWidget extends LitWidget {
 *
 *   @onEvent('button', 'click')
 *   greet(event) {
 *     ...
 *   }
 *
 * }
 * ```
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
 */
export function onEvent(target, event, { selector, debounce, throttle, wrapper } = {}) {
  return function(instance, property) {
    const klass = instance.constructor;
    if (!(instance instanceof LitWidget)) {
      throw new Error(`[LitWidget] The class "${klass.name}" is not a descendant of LitWidget.`);
    }

    if (typeof instance._events === 'undefined') {
      instance._events = [];
    }

    instance._events.push({
      target,
      handler: instance[property],
      event,
      selector,
      debounce,
      throttle,
      wrapper,
    });
  };
}
