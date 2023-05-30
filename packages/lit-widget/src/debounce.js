
export function throttle(fn, duration) {
  let throttlePause;

  function throttler(...args) {
    if (throttlePause) return;
    throttlePause = true;

    setTimeout(() => {
      fn.apply(this, args);
      throttlePause = false;
    }, duration);
  }

  return throttler;
}

export function debounce(fn, duration) {
  let timeoutId;

  function debouncer(...args) {
    debouncer.clear();

    timeoutId = setTimeout(() => {
      timeoutId = null;

      fn.apply(this, args);
    }, duration);
  }

  debouncer.clear = function() {
    if (timeoutId) {
      clearTimeout(timeoutId);
      timeoutId = null;
    }
  }

  return debouncer;
}

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
