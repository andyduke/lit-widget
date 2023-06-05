import { html } from 'lit';
import { templateContent } from 'lit/directives/template-content.js';
import { EventsController } from './events-controller';
import { LitWidgetBase } from './lit-widget-base';

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
 *
 * TODO: Describe "static targets/targetsAll"
 * TODO: Describe "static events"
 * TODO: Describe defaultValues pattern
 *
 * ## Events:
 *
 * ```js
 * events = [
 *   // Event bound to target
 *   {event: 'click', target: 'button', handler: 'doClick'},
 *
 *   // Event bound to DOM Element
 *   {event: 'click', target: document, handler: 'outsideClick'},
 *
 *   // Event bound to element via selector
 *   {event: 'click', selector: '.expand-button', handler: 'doExpand'},
 * ];
 * ```
 *
 */
export class LitWidget extends LitWidgetBase {

  static widget(name) {
    return function(proto, options) {
      LitWidget.define(name, proto, options);
    }
  }

  static define(name, constructor, options) {
    customElements.define('w-' + name, constructor, options);
  }

  /**
   * Default renderer, renders Light DOM
   */
  render() {
    return html`<slot></slot>`;
  }

  static defaultValues = {}

  get defaultValues() {
    if (this._defaultValues != null) {
      return this._defaultValues;
    }

    const parentDefaultValues = (this instanceof LitWidget) ? {} : Object.getPrototypeOf(this).defaultValues;
    this._defaultValues = {
      ...parentDefaultValues,
      ...this.constructor.defaultValues,
    };

    return this._defaultValues;
  }

  // #events = new EventsController(this, this.events);
  #events;
  // events = [];

  // constructor() {
  //   super();
  //   console.log(this.constructor.name, 'Init [1]', this.events);
  // }

  /*
  constructor() {
    super();
    this.#prepareEvents();
    this.#events = new EventsController(this, this.events);
  }
  */

  #prepareEvents() {
    const events = [
      ...this._events,
      ...this.events,
    ];

    // console.log(this.constructor.name, 'Init [4]', events);

  	const eventsDefs = events.map((event, index) => {
      return {id: index, ...event};
    });
    // console.log('[1]', eventsDefs);

    Object.defineProperty(this, 'events', {
    	configurable: true,
      get() {
      	return eventsDefs;
      },
    });
  }

  /**
   * Specifies whether to import page styles into shadowRoot.
   */
  static sharedStyles = true

  createRenderRoot() {
    // Find handle [data-root]
    let shadowRoot = true;
    let root;
    const tagName = this.tagName.toLowerCase();
    const rootElement = this.querySelector(`[data-root="${tagName}"]`);
    if (!!rootElement && rootElement.closest(tagName) == this) {
      root = rootElement;
      shadowRoot = false;
    } else {
      root = super.createRenderRoot();
    }

    const sharedStyles = Object.getPrototypeOf(this).constructor.sharedStyles;

    if (shadowRoot && sharedStyles) {
      // Import styles
      for (const style of document.head.querySelectorAll('style')) {
        if (style.getAttribute('data-shared') == 'false') continue;
        const styleClone = style.cloneNode(true);
        root.insertBefore(styleClone, root.firstChild);
      }

      // Import link[stylesheet]
      for (const style of document.head.querySelectorAll('link[rel="stylesheet"]')) {
        if (style.getAttribute('data-shared') == 'false') continue;
        const styleClone = style.cloneNode(true);
        root.insertBefore(styleClone, root.firstChild);
      }
    }

    return root;
  }

  connectedCallback() {
    if (!this.#events) {
      this.#prepareEvents();
      this.#events = new EventsController(this, this.events);
    }

    super.connectedCallback();
  }

  disconnectedCallback() {
    super.disconnectedCallback();

    if (typeof this._findCache !== 'undefined') {
      this._findCache = {};
    }
  }

  /*
  connectedCallback() {
    super.connectedCallback();

    setTimeout(() => this._attachEvents());
  }

  disconnectedCallback() {
    super.disconnectedCallback();

    setTimeout(() => this._detachEvents());
  }

  get _events() {
    const klass = Object.getPrototypeOf(this).constructor;
    return klass.events || [];
  }

  _attachEvents() {
    for (const event of this._events) {
      const eventName = event.event;
      // TODO: If eventName is function -> handle as preset
      //       eventName maybe `{eventName, isMatch: fn(event): bool}`

      if (event.debounce && event.throttle) {
        throw new Error(`[LitWidget "${this.tagName.toLowerCase()}"] For the event "${eventName}", debounce and throttle are specified, you can specify only one thing.`);
      }

      let target;
      if ((event.target instanceof HTMLElement) || (event.target instanceof Document) || (event.target instanceof Window)) {
        target = event.target;
      } else {
        let targetName;
        let selector;

        if (event.target instanceof Object) {
          selector = event.target['selector'];
        } else {
          targetName = event.target;
        }

        if (!targetName && !selector) {
          throw new Error(`[LitWidget "${this.tagName.toLowerCase()}"] Invalid event target: "${event.target}".`);
        }

        target = this.findTarget(this.tagName, targetName, selector);
      }

      if (target) {
        let handler = event.handler;
        if (typeof handler === 'string') handler = this[handler];

        event._handler = (...args) => handler.apply(this, args);

        if (event.debounce) {
          event._handler = debounce(event._handler, event.debounce);
        } else if (event.throttle) {
          event._handler = throttle(event._handler, event.throttle);
        }

        if (event['wrapper'] != null && typeof event['wrapper'] !== 'undefined') {
          event._handler = event.wrapper.call(this, event._handler, this);
        }

        // TODO: if eventName is preset -> wrap event._handler with `(event) => eventName.isMatch(event) ? event._handler : null`

        target.addEventListener(eventName, event._handler);
      } else {
        throw new Error(`[LitWidget "${this.tagName.toLowerCase()}"] Event target "${event.target}" not found.`);
      }
    }
  }

  _detachEvents() {
    for (const event of this._events) {
      if (!!event._handler) {
        target.addEventListener(event.event, event._handler);
      }
    }
  }
  */

}

LitWidget.addInitializer((instance) => {
  const klass = Object.getPrototypeOf(instance).constructor;

  if (typeof klass.targets !== 'undefined') {
    for (const [target, options] of Object.entries(klass.targets)) {
      // Add target getter
      Object.defineProperty(instance, target, {
        configurable: true,
        get() {
          if (typeof this._findCache === 'undefined') {
            this._findCache = {};
          }

          if (this._findCache[target]) {
            return this._findCache[target];
          } else {
            let targetElement = this._findCache[target] ??= this.findTarget(this.tagName, target, options.selector);
            if (targetElement == null) {
              console.error(`[LitWidget "${klass.name}"] Target "${target}" not found.`);
            } else {
              const convertTemplate = (options.template === true) || ((targetElement.tagName.toLowerCase() == 'template') && (options.template !== false));
              if (convertTemplate) {
                targetElement = templateContent(targetElement);
              }
              this._findCache[target] = targetElement;
            }
            return targetElement;
          }
        }
      });
    }
  }

  if (typeof klass.targetsAll !== 'undefined') {
    for (const [target, options] of Object.entries(klass.targetsAll)) {
      // Add target getter
      Object.defineProperty(instance, target, {
        configurable: true,
        get() {
          if (typeof this._findCache === 'undefined') {
            this._findCache = {};
          }
          return this._findCache[target] ??= this.findTargets(this.tagName, target, options.selector);
        }
      });
    }
  }
});
