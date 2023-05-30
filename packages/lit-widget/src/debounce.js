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
 */
export function throttle(fn, delay) {
  let throttlePause;

  function throttler(...args) {
    if (throttlePause) return;
    throttlePause = true;

    setTimeout(() => {
      fn.apply(this, args);
      throttlePause = false;
    }, duration(delay));
  }

  return throttler;
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
 */
export function debounce(fn, delay) {
  let timeoutId;

  function debouncer(...args) {
    debouncer.clear();

    timeoutId = setTimeout(() => {
      timeoutId = null;

      fn.apply(this, args);
    }, duration(delay));
  }

  debouncer.clear = function() {
    if (timeoutId) {
      clearTimeout(timeoutId);
      timeoutId = null;
    }
  }

  return debouncer;
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
 */
export function duration(value) {
  if (typeof value === 'number') {
    return value;
  }
  if (typeof value !== 'string') {
    throw new Error(`Invalid duration "${value}".`);
  }

  const duration = parseFloat(value);
  if (isNaN(duration)) {
    throw new Error(`Invalid duration value "${value}".`);
  }

  if (value.endsWith('ms')) {
    return duration;
  }
  if (value.endsWith('s')) {
    return duration * 1000;
  }
  if (value.endsWith('m')) {
    return duration * 1000 * 60;
  }
}
