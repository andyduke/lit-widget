
export class ListenersMap {

	#map;

	constructor() {
  	this.#map = new Map();
  }

  #normalizeKey(key) {
  	return JSON.stringify(key);
    //return key;
  }

  has(el, key) {
  	if (!this.#map.has(el)) return false;
    return this.#map.get(el).has(this.#normalizeKey(key));
  }

  get(el, key) {
  	if (!this.#map.has(el)) return null;
    return this.#map.get(el).get(this.#normalizeKey(key));
  }

  set(el, key, value) {
  	const listeners = this.#map.get(el) || new Map();
		const normalizedKey = this.#normalizeKey(key);
    listeners.set(normalizedKey, value);
    this.#map.set(el, listeners);
  }

  delete(el, key) {
  	if (!this.#map.has(el)) return null;
    return this.#map.get(el).delete(this.#normalizeKey(key));
  }

  clear() {
    this.#map = new Map();
  }

  *[Symbol.iterator]() {
  	for (const [el, listeners] of this.#map) {
    	for (const [key, listener] of listeners) {
      	yield [el, key, listener];
      }
    }
  }

}

