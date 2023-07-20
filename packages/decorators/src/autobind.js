
export function autobind() {
  return function(target, key, descriptor) {
    let fn = descriptor.value;

    if (typeof fn !== 'function') {
      throw new TypeError(`@autobind decorator can only be applied to methods not: ${typeof fn}`);
    }

    let definingProperty = false;

    return {
      configurable: true,
      get() {
        if (definingProperty || this === target.prototype || this.hasOwnProperty(key)) {
          return fn;
        }

        let boundFn = fn.bind(this);
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
  };
}
