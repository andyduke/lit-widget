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

  #events;

  #prepareEvents() {
    const events = [
      ...this._events,
      ...this.events,
    ];

  	const eventsDefs = events.map((event, index) => {
      return {id: index, ...event};
    });

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
