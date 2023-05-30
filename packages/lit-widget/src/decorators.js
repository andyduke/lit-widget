
import { LitWidget } from './lit-widget';

export function target({ selector } = {}, name = null) {
  const wrapper = function(instance, property) {
    const klass = instance.constructor;
    if (!(instance instanceof LitWidget)) {
      throw new Error(`[LitWidget] The class "${klass.name}" is not a descendant of LitWidget.`);
    }

    if (typeof klass.targets === 'undefined') {
      klass.targets = {};
    }
    klass.targets[property] = {selector};
  };

  if (name == null) {
    return wrapper;
  } else {
    const instance = arguments[0];
    wrapper(instance, name);
  }
}

export function targets({ selector } = {}, name = null) {
  const wrapper = function(instance, property) {
    const klass = instance.constructor;
    if (!(instance instanceof LitWidget)) {
      throw new Error(`[LitWidget] The class "${klass.name}" is not a descendant of LitWidget.`);
    }

    if (typeof klass.targetsAll === 'undefined') {
      klass.targetsAll = {};
    }
    klass.targetsAll[property] = {selector};
  };

  if (name == null) {
    return wrapper;
  } else {
    const instance = arguments[0];
    wrapper(instance, name);
  }
}

export function onEvent(target, event, { debounce, throttle, wrapper } = {}) {
  return function(instance, property) {
    const klass = instance.constructor;
    if (!(instance instanceof LitWidget)) {
      throw new Error(`[LitWidget] The class "${klass.name}" is not a descendant of LitWidget.`);
    }

    if (typeof klass.events === 'undefined') {
      klass.events = [];
    }

    klass.events.push({
      target: target,
      handler: instance[property],
      event: event,
      debounce: debounce || null,
      throttle: throttle || null,
      wrapper: wrapper || null,
    });
  };
}
