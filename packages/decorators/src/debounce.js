
import { debounce, throottle } from './tools/debounce.js';
export { duration } from './tools/debounce.js';

export function debounce(duration) {
  return function(target, key, descriptor) {
    let fn = descriptor.value;

    if (typeof fn !== 'function') {
      throw new TypeError(`@debounce decorator can only be applied to methods not: ${typeof fn}`);
    }

    let definingProperty = false;

    return {
      configurable: true,
      get() {
        if (definingProperty || this === target.prototype || this.hasOwnProperty(key)) {
          return fn;
        }

        let boundFn = debounce(fn, duration);
        definingProperty = true;
        Object.defineProperty(this, key, {
          value: boundFn,
          configurable: true,
          writable: true
        });
        definingProperty = false;
        return boundFn;
      }
    };
  }
}

export function throttle(duration) {
  return function(target, key, descriptor) {
    let fn = descriptor.value;

    if (typeof fn !== 'function') {
      throw new TypeError(`@throttle decorator can only be applied to methods not: ${typeof fn}`);
    }

    let definingProperty = false;

    return {
      configurable: true,
      get() {
        if (definingProperty || this === target.prototype || this.hasOwnProperty(key)) {
          return fn;
        }

        let boundFn = throttle(fn, duration);
        definingProperty = true;
        Object.defineProperty(this, key, {
          value: boundFn,
          configurable: true,
          writable: true
        });
        definingProperty = false;
        return boundFn;
      }
    };
  }
}
