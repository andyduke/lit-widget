
import * as tools from '@simulacron/tools';
export { duration } from '@simulacron/tools';

/**
 * Debounce the execution of the method.
 *
 * You can specify the value in milliseconds as a number or in string format
 * with the suffix `'<delay>ms'`, supported suffixes: ms - milliseconds, s - seconds, m - minutes.
 *
 * This can be handy for events such as key presses or "input" in input fields.
 *
 * @param {(Number|string)} delay - Delay value.
 * @returns {Function} The new debounced method.
 */
export function debounce(duration) {
  return function(target, key, descriptor) {
    let fn = descriptor.value;

    if (typeof fn !== 'function') {
      throw new TypeError(`@debounce decorator can only be applied to methods, not ${typeof fn}`);
    }

    let definingProperty = false;

    return {
      configurable: true,
      get() {
        if (definingProperty || this === target.prototype || this.hasOwnProperty(key)) {
          return fn;
        }

        let boundFn = tools.debounce(fn, duration);
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

/**
 * Throttle the execution of the method.
 *
 * You can specify the value in milliseconds as a number or in string format
 * with the suffix `'<delay>ms'`, supported suffixes: ms - milliseconds, s - seconds, m - minutes.
 *
 * This can be handy for "resize" or "scroll" events.
 *
 * @param {(Number|string)} delay - Delay value.
 * @returns {Function} The new throttled method.
 */
export function throttle(duration) {
  return function(target, key, descriptor) {
    let fn = descriptor.value;

    if (typeof fn !== 'function') {
      throw new TypeError(`@throttle decorator can only be applied to methods, not ${typeof fn}`);
    }

    let definingProperty = false;

    return {
      configurable: true,
      get() {
        if (definingProperty || this === target.prototype || this.hasOwnProperty(key)) {
          return fn;
        }

        let boundFn = tools.throttle(fn, duration);
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
