import { html } from 'lit';
import { templateContent } from 'lit/directives/template-content.js';
import { EventsController } from './controllers/events-controller';
import { SharedStylesController } from './controllers/shared-styles-controller';
import { LitWidgetBase } from './lit-widget-base';

/**
 * Declarative binding to child elements for [LitElement](https://lit.dev/)
 * like [Github/Catalyst](https://catalyst.rocks/) and
 * [Stimulus.js](https://stimulus.hotwired.dev/).
 *
 * To define a widget, subclass LitWidget, specify targets using
 * the `@target/@targets` decorators or the `static targets/targetsAll` property,
 * and add event handlers using the `@onEvent` decorator or
 * the `events` property.
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
 * TODO: Describe [data-root] binding
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

  // #region Static helpers

  /** TODO: ??? */
  static widget(name) {
    return function(proto, options) {
      LitWidget.define(name, proto, options);
    }
  }

  static define(name, constructor, options) {
    customElements.define('w-' + name, constructor, options);
  }

  /**
   * TODO: Static getter
   */
	get static() {
    return Object.getPrototypeOf(this).constructor;
  }

  // #endregion Static helpers

  // #region Default render

  /**
   * Default renderer, renders Light DOM
   */
  render() {
    return html`<slot></slot>`;
  }

  // #endregion Default render

  // #region Default values

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

  // #endregion Default values

  // #region Events

  #events;

  #prepareEvents() {
    const events = [
      ...(this._events || []),
      ...(this.events || []),
    ];

  	const eventsDefs = events.map((event, index) => {
      return {id: index, ...event};
    });

    // Seal events
    Object.defineProperty(this, 'events', {
    	configurable: true,
      get() {
      	return eventsDefs;
      },
    });
  }

  // #endregion Events

  // #region Shared styles

  /**
   * Specifies whether to import page styles into shadowRoot.
   */
  static sharedStyles = null

  /**
   * TODO: describe override case
   */
  get sharedStyles() {
    let sharedStyles = /*Object.getPrototypeOf(this).constructor*/this.static.sharedStyles;

    // Treat null as auto
    if ((sharedStyles == null) && !this.lightDOM) {
      // If sharedStyles is "auto" and not lightDOM - then it will default to true
      sharedStyles = true;
    }

    return sharedStyles;
  }

  #sharedStylesController = new SharedStylesController(this, this.sharedStyles);

  // #endregion Shared styles

  // #region Light DOM

  /**
   * TODO:
   */
  static lightDOM = false

  /**
   * TODO: describe override case
   */
  get lightDOM() {
    return /*Object.getPrototypeOf(this).constructor*/this.static.lightDOM;
  }

  createRenderRoot() {
    let root;
    const tagName = this.tagName.toLowerCase();

    if (this.lightDOM) {
      // Find light DOM root [data-root]
      let rootElement = this.querySelector(`[data-root="${tagName}"]`);

      // If the nearest root target found is not the element itself,
      // ignore it (to avoid using the root target in a nested same widget)
      if (rootElement != null && rootElement.closest(tagName) != this) {
        rootElement = null;
      }

      // Use found root target or element itself as renderRoot
      root = rootElement ?? this;
    } else {
      root = super.createRenderRoot();
    }

    if (this.lightDOM && this.sharedStyles === true) {
      console.warn(`[LitWidget "${tagName}"] Shared styles (sharedStyles = true) with lightDOM have no effect.`);
    }

    return root;
  }

  // #endregion Light DOM

  // #region Lifecycle

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

  // #endregion Lifecycle

}

// #region Targets getters

LitWidget.addInitializer((instance) => {
  const klass = Object.getPrototypeOf(instance).constructor;

  if (typeof klass.targets !== 'undefined') {
    for (const [target, options] of Object.entries(klass.targets)) {
      // Add target getter
      Object.defineProperty(instance, options.property ?? target, {
        configurable: true,
        get() {
          if (typeof this._findCache === 'undefined') {
            this._findCache = {};
          }

          const cache = options.cache ?? true;

          if (cache && this._findCache[target]) {
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
      Object.defineProperty(instance, options.property ?? target, {
        configurable: true,
        get() {
          if (typeof this._findAllCache === 'undefined') {
            this._findAllCache = {};
          }

          const cache = options.cache ?? true;

          if (cache && this._findAllCache[target]) {
            return this._findAllCache[target];
          } else {
            const targetElements = this._findAllCache[target] ??= this.findTargets(this.tagName, target, options.selector);
            return targetElements;
          }

          // return this._findAllCache[target] ??= this.findTargets(this.tagName, target, options.selector);
        }
      });
    }
  }
});

// #endregion Targets getters
